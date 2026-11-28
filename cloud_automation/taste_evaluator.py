#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/taste_evaluator.py
================================================================================
Dream Company — Device 1: Autonomous Self-Scoring Taste Gate (`$0` Deterministic)
100-Point 5-Rubric Taste Evaluator + 85-Point Release Gate + Hard-Capped 3-Retry
Deterministic Rewriter (`PASS_THRESHOLD = 85`, `MAX_REWRITE_RETRIES = 3`).

Zero Paid API Cost Lock:
  - `EXTERNAL_PAID_EVAL_API_ENABLED = False` (ZERO external LLM or scoring API calls).
  - Pure deterministic linguistic, scene, numeric-contrast, bubble-length,
    `promo_hard_gate.py` compliance, and free-tool utility evaluation.

5-Item 100-Point Rubric:
  1. [25 pts] First 1.5s Daily/Visual Concreteness (abstract intros => IMMEDIATE 0 pts!)
  2. [25 pts] First 5s Clear Number / Common-Sense Reversal Contrast
  3. [20 pts] Speech Bubble / Top Hook Intuitiveness (12~15 chars KO/JA or <=6 words EN, zero dead-zone violation)
  4. [15 pts] Zero Textbook Lecture Tone & AI Clichés (`promo_hard_gate.py` integrated)
  5. [15 pts] Concrete Free Web-Tool Click Rationale (zero pushy sales pressure)
================================================================================
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

sys.path.insert(0, str(Path(__file__).resolve().parent))
from promo_hard_gate import (  # noqa: E402
    check_ai_slop_gate,
    check_promo_hard_gate,
    scrub_ai_slop,
)

# ==============================================================================
# Hard-Locked Constants (`$0` Cost & Bounded Retry Ceiling)
# ==============================================================================
EXTERNAL_PAID_EVAL_API_ENABLED = False
PASS_THRESHOLD = 85
MAX_REWRITE_RETRIES = 3

# Verified Real High-View Channel Winners (Gold Standard Taste Anchors by Division)
GOLD_STANDARD_ANCHORS_BY_DIV: Dict[str, List[Dict[str, Any]]] = {
    "HERO": [
        {
            "title": "〈어머니의 봄날〉",
            "views": 454,
            "pattern": "가족 헌신·위로형",
            "scene_lead": "평생 가족 밥상 차리느라 굳은살 박힌 어머님 손등,",
            "bubble_example": "어머님, 오늘도 애쓰셨죠",
        },
        {
            "title": "〈항구의 등불〉",
            "views": 386,
            "pattern": "가족 헌신·위로형",
            "scene_lead": "밤 10시 텅 빈 거실에 아버님 발걸음을 비추던 등불,",
            "bubble_example": "아버님 위한 6곡 위로곡",
        },
    ],
    "KFK": [
        {
            "title": "침실 온도 2도 공식",
            "views": 448,
            "pattern": "생활 숫자 반전형",
            "scene_lead": "새벽마다 이불 차고 깨는 아이, 침실 온도 딱 2도만 낮춰도 다릅니다.",
            "bubble_example": "침실 온도 2도 반전 공식",
        },
        {
            "title": "구강호흡 숨은 키 3cm",
            "views": 278,
            "pattern": "생활 숫자 반전형",
            "scene_lead": "아침마다 입술 바짝 마른 아이, 밤사이 성장호르몬과 3cm가 새고 있습니다.",
            "bubble_example": "입 벌린 잠, 키 3cm 손실",
        },
    ],
    "GBA": [
        {
            "title": "아침 9시 시장가 매수 경고",
            "views": 119,
            "pattern": "시간·금액 경고형",
            "scene_lead": "朝9時の寄付き直後に成行注文を出すと、最初の5分で高値掴みする罠があります。",
            "bubble_example": "朝9時の成行買いの罠",
        },
        {
            "title": "360만엔 일괄투자 함정",
            "views": 151,
            "pattern": "시간·금액 경고형",
            "scene_lead": "新NISAの年間360万円枠を一括で入れた直後に36%下がると、老後資金は戻りに数年かかります。",
            "bubble_example": "新NISA 360万円一括の罠",
        },
    ],
    "KFG": [
        {
            "title": "부모 키 편견 반전 25% 공식",
            "views": 377,
            "pattern": "통념 반전 수치형",
            "scene_lead": "Before bedtime tonight, stop assuming parents' height locks in 100% — 25% is built by daily habits.",
            "bubble_example": "25% Growth Isn't Genetic",
        },
    ],
    "TOM": [
        {
            "title": "SMH Fear & Greed 3.7 (-36.8%) 25년 회복 격차",
            "views": 128,
            "pattern": "실시간 지수 대비형",
            "scene_lead": "After yesterday's market close, SMH Fear and Greed sits at 3.7 (-36.8% off peak) — 62 months vs 17 months recovery.",
            "bubble_example": "SMH 3.7: 62 vs 17 Mo",
        },
    ],
}

# Item 1 Instant-Zero Abstract Intro Kill-Switch Patterns
ABSTRACT_INTRO_KILL_REGEXES: Tuple[Tuple[str, str], ...] = (
    ("ko_today_explore", r"오늘은\s*[^.!?\n]{0,40}(?:알아봅니다|알아보겠습니다|살펴봅니다|살펴보겠습니다|이야기해\s*보겠습니다|소개합니다)"),
    ("ko_about_to_explore", r"에\s*대해\s*(?:알아봅니다|알아보겠습니다|설명하겠습니다|다루겠습니다)"),
    ("ko_what_is_open", r"^(?:여러분|안녕하세요)[,\s!.]*(?:오늘은|이번\s*영상에서는)"),
    ("en_todays_world", r"\bin\s+today['’]?s\s+(?:fast[- ]paced\s+)?world\b"),
    ("en_today_we_will", r"^(?:hello|hi|welcome|today\s+we\s+(?:will|are\s+going\s+to)|in\s+this\s+video\s+we\s+(?:will|discuss|explore)|let['’]?s\s+(?:talk\s+about|explore|discuss))"),
    ("ja_this_video_explain", r"本動画では[^。！？\n]{0,30}(?:解説|説明|紹介)|今回は[^。！？\n]{0,25}について(?:解説|説明|紹介)|今日は[^。！？\n]{0,25}について(?:解説|説明|お話し)"),
)

# Item 1 Concrete Daily / Visual / Time / Sensory Markers
CONCRETE_SCENE_MARKERS: Dict[str, Tuple[str, ...]] = {
    "ko": (
        "새벽", "아침", "저녁", "밤 ", "밤10시", "밤 10시", "밤 9시", "침실", "거실", "이불", "문틀", "벽 ",
        "입술", "입 벌리", "손목", "병원", "소아과", "교실", "식탁", "부엌", "장롱", "버스", "가방",
        "첫 소절", "숨소리", "눈물", "손등", "등불", "봄날", "동백꽃", "항구", "우유", "뒤꿈치", "신발",
        "6개월 전", "1년", "어머님", "아버님", "초등", "잠들기", "줄넘기", "온도", "습도",
    ),
    "en": (
        "bedtime", "tonight", "morning", "yesterday", "close", "doorframe", "dry lips", "mouth",
        "pediatrician", "90 seconds", "dinner", "sleep", "pillow", "401(k)", "ira", "broker", "sweep",
        "crash", "peak", "age 55", "age 60", "65", "screen", "lights-out", "barefoot", "shoe",
        "parents", "3rd grader", "kitchen", "x-ray", "wrist", "gauge", "smh", "xlv", "sgov",
    ),
    "ja": (
        "朝9時", "朝", "夜", "スマホ", "寄付き", "成行", "証券口座", "口座", "暴落", "高値", "下落",
        "50代", "60代", "70代", "老後", "新NISA", "定期預金", "国債", "退職金", "紙のメモ", "取り崩し",
        "半導体", "配当", "360万", "1,800万", "1800万", "2,000万", "2000万", "最新",
    ),
}

# Item 2 Contrast / Common-Sense Reversal Markers
CONTRAST_REVERSAL_PATTERNS: Tuple[str, ...] = (
    r"오히려|반면|사실은|착각|함정|안심했다가|줄\s*알았|대신|비교|격차|차이|경고|새고|일찍\s*닫히|늙었습니다|막습니다|놓치|위험",
    r"\b(?:stop|don['’]?t|instead|actually|vs\.?|versus|myth|trap|miss|missed|cut|drop|dropped|below|unlike|but|yet|wrong|shock|crash|zero|0%)\b",
    r"罠|落とし穴|誤解|危険|損する|実は|一括|差|比較|下落|暴落|冷え込|警告|消える|入らない|かかる事実",
)

# Item 4 Textbook / Lecture Tone Patterns (beyond promo_hard_gate clichés)
LECTURE_TONE_PATTERNS: Tuple[Tuple[str, str], ...] = (
    ("ko_lecture_must", r"(?:해야\s*합니다|지켜야\s*합니다|기억하시기\s*바랍니다|알아두어야\s*합니다)"),
    ("ko_mechanical_list", r"첫째[\s,:].*둘째[\s,:]|정리해\s*드리겠습니다|마치겠습니다"),
    ("en_lecture_must", r"\b(?:you\s+must\s+always|it\s+is\s+important\s+to\s+(?:note|remember|understand)|in\s+summary|to\s+summarize|as\s+we\s+can\s+see)\b"),
    ("ja_lecture_must", r"覚えておきましょう|まとめると|以上が|解説しました|いかがでしょうか"),
)

# Item 5 Concrete Free Web-Tool Utility & Non-Pushy CTA Markers
FREE_TOOL_MARKERS_BY_DIV: Dict[str, Tuple[str, ...]] = {
    "TOM": ("smh", "fear", "greed", "gauge", "stress-test", "2000-2025", "free", "0 to 100", "0-100", "profile", "link", "sample"),
    "KFG": ("cdc", "percentile", "height", "bone-age", "growth", "60-second", "free", "zero ads", "profile", "link", "check"),
    "GBA": ("恐怖", "強欲", "指数", "7指標", "新NISA", "25年", "統計", "無料", "プロフィール", "リンク", "チェック", "確認"),
    "HERO": ("백운호", "6곡", "완곡", "라디오", "꽃카드", "안부카드", "사랑방", "무료", "가입 없음", "파란 주소", "프로필", "얼굴"),
    "KFK": ("질병관리청", "kdca", "예상키", "뼈나이", "성장속도", "성장도표", "1분", "무료", "광고 없", "프로필", "링크", "확인"),
}

PUSHY_SALES_PATTERNS: Tuple[str, ...] = (
    r"지금\s*바로\s*결제|할인\s*마감|특가\s*구매|선착순\s*결제|지금\s*사세요",
    r"\b(?:buy\s+now|limited\s+time\s+discount|flash\s+sale|act\s+now\s+before\s+price)\b",
    r"今すぐ購入|限定セール|割引終了",
)

DIV_LANG_MAP = {"TOM": "en", "KFG": "en", "GBA": "ja", "HERO": "ko", "KFK": "ko"}

# Deterministic $0 Rewrite Templates Grounded in Each Division's Gold Standard Anchors
_DIV_CONCRETE_OPENERS: Dict[str, List[str]] = {
    "KFK": [
        "새벽마다 이불 차고 깨는 아이, 침실 온도 2도만 바꿔도 밤사이 성장 리듬이 달라집니다.",
        "아침마다 입술이 바짝 마른 초등 아이, 입 벌린 잠이 밤사이 키 3cm 손실로 이어질 수 있습니다.",
        "6개월 전 찍은 우리 아이 손목 뼈나이, 오늘 기준으로는 이미 반년 더 흘러 오차가 4cm까지 벌어집니다.",
    ],
    "KFG": [
        "Before bedtime tonight, stop assuming parents' height decides 100% — 25% of growth is built by daily habits.",
        "Your pediatrician spent 90 seconds on the wall chart, missing the 1 yearly velocity shift that changes everything.",
        "Waking up with dry lips at 7 AM? Open-mouth sleep quietly disrupts nighttime growth rhythm by up to 2 inches.",
    ],
    "GBA": [
        "新NISAの年間360万円枠を一括で入れた直後に36.8%下がると、老後資金の回復には数年かかります。",
        "朝9時の寄付き直後に成行買いを繰り返す50代が、最初の5分で高値掴みしてしまう落とし穴があります。",
        "最新の米国半導体・恐怖指数は3.7点（高値比-36.8%）、暴落の夜に慌てない25年統計を確認しましょう。",
    ],
    "TOM": [
        "After yesterday's market close, SMH Fear and Greed hit 3.7 (-36.8% off peak) — 62 months vs 17 months historical recovery.",
        "At age 60, a -50% tech drawdown cuts $1,000,000 to $510,000 unless a 24-month Treasury cushion absorbs withdrawals.",
        "Idle broker cash paying 0.01% earns just $10 a year on $100,000 instead of short-term Treasury liquidity.",
    ],
    "HERO": [
        "밤 10시 텅 빈 거실에서 평생 가족 위해 사신 어머님께 바치는 백운호 〈어머니의 봄날〉 첫 소절을 들려드립니다.",
        "어두운 밤바다를 지키던 아버님 발걸음을 위로하는 백운호 〈항구의 등불〉 6곡 완곡 무대입니다.",
        "내일 아침 가족 단톡방에 글자 대신 따뜻한 백운호 꽃그림 아침 안부카드 1장을 무료로 건네보세요.",
    ],
}

_DIV_COMPACT_BUBBLES: Dict[str, List[str]] = {
    "KFK": ["침실 온도 2도 공식", "입 벌린 잠, 키 3cm", "6개월 전 뼈나이 오차"],
    "KFG": ["25% Isn't Just Genetics", "90s Checkup Missed This", "Dry Lips Cut Growth"],
    "GBA": ["新NISA 360万円一括の罠", "朝9時の成行買い警告", "半導体指数3.7と25年統計"],
    "TOM": ["SMH 3.7: 62 vs 17 Mo", "-50% Crash vs 24Mo Cash", "0.01% Cash Drag Math"],
    "HERO": ["어머님 위한 봄날 위로곡", "아버님께 바치는 등불 노래", "백운호 6곡 무료 라디오"],
}

_DIV_FREE_TOOL_BRIDGES: Dict[str, str] = {
    "KFK": "광고 없는 1분 무료 질병관리청 예상키·뼈나이 시차 진단으로 아래 프로필 링크에서 바로 확인해 보세요.",
    "KFG": "Run our free 60-second US CDC height percentile check (zero supplement ads) via the top profile link.",
    "GBA": "毎日無料の米国半導体・恐怖と強欲指数と25年統計を、下のプロフィールリンクから30秒で確認できます。",
    "TOM": "Check today's free live 0 to 100 SMH Fear and Greed gauge and 2000-2025 stress-test via the top profile link.",
    "HERO": "가입 없이 듣는 백운호 6곡 완곡 무료 라디오와 아침 꽃카드는 아래 백운호 얼굴 누르고 파란 주소에서 바로 여세요.",
}

_EMOJI_STRIP_RE = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF]", flags=re.UNICODE)


def _derive_compact_bubble(div: str, text: str, attempt_idx: int = 0) -> str:
    """Compresses a raw title/hook into a clean `12~15 char` (KO/JA) or `<=6 word` (EN) speech bubble."""
    div_u = div.upper()
    lang = DIV_LANG_MAP.get(div_u, "en")
    clean = _EMOJI_STRIP_RE.sub("", re.sub(r"#\S+|https?://\S+", "", str(text or "")))
    clean = re.sub(r"【[^】]*】|\[[^\]]*\]", " ", clean)
    clean = re.sub(r"[｜|·•—–]", " ", clean)
    clean = re.sub(r"\s+", " ", clean).strip(" ,.!?\"'‘’“”:")

    if lang in ("ko", "ja"):
        if 6 <= len(clean) <= 15:
            return clean
        # Try first natural clause if <= 15 chars
        first_cl = re.split(r"[,、。?!:]", clean)[0].strip()
        if 6 <= len(first_cl) <= 15:
            return first_cl
        # Try keeping leading words within 15 chars
        if " " in clean:
            out = ""
            for w in clean.split(" "):
                cand = f"{out} {w}".strip() if out else w
                if len(cand) <= 15:
                    out = cand
                else:
                    break
            if len(out) >= 7:
                return out
        # Fall back to division gold-standard crisp anchor bubble
        bank = _DIV_COMPACT_BUBBLES[div_u]
        return bank[attempt_idx % len(bank)]

    words = clean.split()
    if 2 <= len(words) <= 6 and len(clean) <= 36:
        return clean
    if len(words) > 6:
        short_en = " ".join(words[:6]).rstrip(",;:-")
        if len(short_en) <= 36:
            return short_en
    bank = _DIV_COMPACT_BUBBLES[div_u]
    return bank[attempt_idx % len(bank)]


def evaluate_taste(
    div: str,
    title: str,
    spoken_script: str,
    speech_bubble: str = "",
    cta: str = "",
) -> Dict[str, Any]:
    """
    Deterministically scores a short-form content package on the 5-item 100-point Taste Rubric (`$0`).
    Returns total score, per-item breakdown, compliance status, and concrete actionable deductions.
    """
    div_u = div.upper()
    lang = DIV_LANG_MAP.get(div_u, "en")
    t_str = str(title or "").strip()
    s_str = str(spoken_script or "").strip()
    c_str = str(cta or "").strip()
    b_str = str(speech_bubble or "").strip() or t_str
    combined = f"{t_str}\n{s_str}\n{c_str}".strip()

    feedback: List[str] = []
    breakdown: Dict[str, Dict[str, Any]] = {}

    # ------------------------------------------------------------------
    # Item 1: First 1.5s Daily/Visual Concreteness (25 pts; abstract intro => IMMEDIATE 0!)
    # ------------------------------------------------------------------
    opening_15s = f"{t_str} {s_str[:80]}".strip()
    abstract_hits: List[str] = []
    for code, pat in ABSTRACT_INTRO_KILL_REGEXES:
        if re.search(pat, opening_15s, flags=re.IGNORECASE):
            abstract_hits.append(code)

    if abstract_hits:
        pts_1 = 0
        feedback.append(f"[항목1:0/25] 추상적 개론 시작 감지({','.join(abstract_hits)}) — 즉시 첫 1.5초를 구체적 시간·장면·행동으로 교체 필요")
    else:
        low_open = opening_15s.lower()
        scene_hits = [m for m in CONCRETE_SCENE_MARKERS.get(lang, ()) if m.lower() in low_open]
        if len(scene_hits) >= 2:
            pts_1 = 25
        elif len(scene_hits) == 1:
            pts_1 = 20
            feedback.append("[항목1:20/25] 첫 1.5초 시각·생활 장면 디테일을 1개 더 선명히 보강 권장")
        else:
            pts_1 = 8
            feedback.append("[항목1:8/25] 첫 1.5초에 구체적 일상 시간·공간·행동 장면 부족")
    breakdown["item1_concreteness_25"] = {"score": pts_1, "max": 25, "abstract_kill_hits": abstract_hits}

    # ------------------------------------------------------------------
    # Item 2: First 5s Clear Number / Common-Sense Reversal Contrast (25 pts)
    # ------------------------------------------------------------------
    if lang == "en":
        first_5s = f"{t_str} " + " ".join(s_str.split()[:24])
    else:
        first_5s = f"{t_str} {s_str[:95]}"

    has_number = bool(re.search(r"[+-]?\d+(?:[.,]\d+)?(?:\s*(?:%|cm|mm|도|℃|시|분|초|개월|년|곡|만\s*원|만원|万円|円|歳|代|点|mo|months|years|in|k|m))?", first_5s, flags=re.I))
    has_contrast = any(re.search(pat, first_5s, flags=re.IGNORECASE) for pat in CONTRAST_REVERSAL_PATTERNS)

    if has_number and has_contrast:
        pts_2 = 25
    elif has_number:
        pts_2 = 18
        feedback.append("[항목2:18/25] 첫 5초 숫자는 있으나 상식 반전·대비 구도 보강 필요")
    elif has_contrast:
        pts_2 = 16
        feedback.append("[항목2:16/25] 첫 5초 반전은 있으나 구체적 숫자(예: 2도, 3cm, -36.8%, 25%, 360만엔) 삽입 필요")
    else:
        pts_2 = 5
        feedback.append("[항목2:5/25] 첫 5초 이내 명확한 숫자 및 상식 반전 대비 모두 부재")
    breakdown["item2_number_contrast_25"] = {"score": pts_2, "max": 25, "has_number": has_number, "has_contrast": has_contrast}

    # ------------------------------------------------------------------
    # Item 3: Speech Bubble / Top Headline Intuitiveness (20 pts)
    # ------------------------------------------------------------------
    b_clean = re.sub(r"\s+", " ", b_str).strip()
    b_has_deadzone_junk = bool(_EMOJI_STRIP_RE.search(b_clean) or re.search(r"https?://|□|[｜|]", b_clean))
    if lang in ("ko", "ja"):
        b_len = len(b_clean)
        fits_one_glance = 5 <= b_len <= 15
        near_fit = 16 <= b_len <= 22
    else:
        b_words = len(b_clean.split())
        fits_one_glance = 2 <= b_words <= 6 and len(b_clean) <= 38
        near_fit = (7 <= b_words <= 9) and len(b_clean) <= 52

    if fits_one_glance and not b_has_deadzone_junk:
        pts_3 = 20
    elif near_fit and not b_has_deadzone_junk:
        pts_3 = 13
        feedback.append(f"[항목3:13/20] 말풍선/상단 후크({b_clean!r})가 길어 12~15자(영문 6단어 이하) 압축 필요")
    else:
        pts_3 = 6 if not b_has_deadzone_junk else 3
        feedback.append(f"[항목3:{pts_3}/20] 말풍선 길이 초과 또는 특수기호/이모지 혼입({b_clean[:28]!r}) — 12~15자(영문<=6단어) 정제 필요")
    breakdown["item3_bubble_intuitiveness_20"] = {
        "score": pts_3,
        "max": 20,
        "bubble_checked": b_clean,
        "fits_one_glance": fits_one_glance,
        "has_junk": b_has_deadzone_junk,
    }

    # ------------------------------------------------------------------
    # Item 4: Zero Textbook Lecture Tone & AI Clichés (15 pts, promo_hard_gate linked)
    # ------------------------------------------------------------------
    hg_ok, hg_errs = check_promo_hard_gate(div_u, combined, surface="youtube_desc")
    slop_ok, slop_errs = check_ai_slop_gate(combined)
    lecture_hits = [code for code, pat in LECTURE_TONE_PATTERNS if re.search(pat, combined, flags=re.IGNORECASE)]

    if hg_ok and slop_ok and not lecture_hits:
        pts_4 = 15
    elif hg_ok and slop_ok and lecture_hits:
        pts_4 = 7
        feedback.append(f"[항목4:7/15] 교과서식 훈계투/기계적 마감 표현 감지({','.join(lecture_hits)})")
    else:
        pts_4 = 0
        all_bad = list(dict.fromkeys(hg_errs + slop_errs + lecture_hits))
        feedback.append(f"[항목4:0/15] 금지어 또는 AI 상투어 감지({','.join(all_bad[:4])}) — 전면 세탁 필요")
    breakdown["item4_no_lecture_ai_15"] = {
        "score": pts_4,
        "max": 15,
        "hard_gate_ok": hg_ok,
        "hard_gate_errors": hg_errs,
        "lecture_hits": lecture_hits,
    }

    # ------------------------------------------------------------------
    # Item 5: Concrete Free Web-Tool Click Rationale (15 pts)
    # ------------------------------------------------------------------
    low_all = combined.lower()
    pushy_hits = [p for p in PUSHY_SALES_PATTERNS if re.search(p, combined, flags=re.IGNORECASE)]
    tool_hits = [k for k in FREE_TOOL_MARKERS_BY_DIV.get(div_u, ()) if k.lower() in low_all]

    if pushy_hits:
        pts_5 = 0
        feedback.append("[항목5:0/15] 억지 결제/판매 강요 표현 감지 — 무료 실화면 도구 안내로 교체 필요")
    elif len(tool_hits) >= 3:
        pts_5 = 15
    elif len(tool_hits) >= 1:
        pts_5 = 9
        feedback.append("[항목5:9/15] 무료 웹 도구를 지금 클릭해야 할 구체적 효익(1분·무료·실시간 기준) 보강 필요")
    else:
        pts_5 = 2
        feedback.append("[항목5:2/15] 자사 무료 웹 도구(SMH 공포지수/CDC·KDCA 진단/백운호 6곡·꽃카드) 연결 누락")
    breakdown["item5_free_tool_cta_15"] = {
        "score": pts_5,
        "max": 15,
        "tool_hits_count": len(tool_hits),
        "pushy_sales": bool(pushy_hits),
    }

    total_score = pts_1 + pts_2 + pts_3 + pts_4 + pts_5
    passed = (total_score >= PASS_THRESHOLD) and hg_ok
    return {
        "div": div_u,
        "total_score": total_score,
        "threshold": PASS_THRESHOLD,
        "passed": passed,
        "compliance_ok": hg_ok,
        "compliance_errors": hg_errs,
        "breakdown": breakdown,
        "feedback": feedback,
        "gold_anchors": [a["title"] for a in GOLD_STANDARD_ANCHORS_BY_DIV.get(div_u, [])],
    }


def rewrite_candidate_for_taste(
    div: str,
    candidate: Dict[str, str],
    evaluation: Dict[str, Any],
    attempt_idx: int = 1,
) -> Dict[str, str]:
    """
    Deterministic `$0` Self-Rewriter guided by the exact failing rubric items.
    Repairs AI clichés/lecture tone, upgrades abstract/number-less hooks using the division's
    Gold Standard Anchors, compresses speech bubbles to `12~15 chars` / `<=6 words`, and
    weaves in a zero-sales-pressure free web-tool click rationale.
    """
    div_u = div.upper()
    lang = DIV_LANG_MAP.get(div_u, "en")
    title = str(candidate.get("title") or "").strip()
    script = str(candidate.get("spoken_script") or "").strip()
    bubble = str(candidate.get("speech_bubble") or "").strip()
    cta = str(candidate.get("cta") or "").strip()
    bd = evaluation.get("breakdown") or {}

    # 1. Always scrub AI slop, lecture phrases, pushy sales hype, and abstract openers first
    title, _ = scrub_ai_slop(title, lang=lang, max_em_dashes=1, is_html=False)
    script, _ = scrub_ai_slop(script, lang=lang, max_em_dashes=1, is_html=False)
    cta, _ = scrub_ai_slop(cta, lang=lang, max_em_dashes=1, is_html=False)

    for _, pat in ABSTRACT_INTRO_KILL_REGEXES:
        title = re.sub(pat, "", title, flags=re.IGNORECASE).strip(" ,.:-")
        script = re.sub(pat, "", script, flags=re.IGNORECASE).strip(" ,.:-")

    for _, pat in LECTURE_TONE_PATTERNS:
        script = re.sub(pat, "", script, flags=re.IGNORECASE).strip()

    for pat in PUSHY_SALES_PATTERNS:
        script = re.sub(pat, "", script, flags=re.IGNORECASE).strip()
        cta = re.sub(pat, "", cta, flags=re.IGNORECASE).strip()

    # Clean common compliance triggers on rewrite so compliance_ok stays True
    if div_u == "KFG":
        for bad_re, rep in [(r"\bclinical\b", "reference"), (r"\bdiagnosis\b", "percentile check"), (r"\b1:1\b", "monthly"), (r"brain\s*lq", "KISFIT Studio")]:
            title = re.sub(bad_re, rep, title, flags=re.I)
            script = re.sub(bad_re, rep, script, flags=re.I)
    elif div_u == "GBA":
        for bad_re, rep in [(r"1対1|１対１|\b1:1\b", "ご自身での"), (r"クオンツ", "統計データ"), (r"買い時|売り時", "過去の推移"), (r"元本保証", "過去データの検証")]:
            title = re.sub(bad_re, rep, title, flags=re.I)
            script = re.sub(bad_re, rep, script, flags=re.I)
    elif div_u == "KFK":
        for bad_re, rep in [(r"\b1:1\b|1대1", "맞춤"), (r"최저가|특가|할인율", "무료 기준"), (r"100%\s*성장|키\s*성장\s*보장", "성장 리듬 점검")]:
            title = re.sub(bad_re, rep, title, flags=re.I)
            script = re.sub(bad_re, rep, script, flags=re.I)
    elif div_u == "TOM":
        for bad_re, rep in [(r"\b(buy|sell)\s+(signal|now|today)\b", "historical gauge"), (r"guaranteed\s+return", "historical range"), (r"\b1:1\b", "self-guided")]:
            title = re.sub(bad_re, rep, title, flags=re.I)
            script = re.sub(bad_re, rep, script, flags=re.I)

    # 2. Repair Item 1 (Concreteness < 25) or Item 2 (Number/Contrast < 25) using Gold Standard Anchors
    need_scene_or_num = (
        int((bd.get("item1_concreteness_25") or {}).get("score", 0)) < 25
        or int((bd.get("item2_number_contrast_25") or {}).get("score", 0)) < 25
    )
    if need_scene_or_num:
        openers = _DIV_CONCRETE_OPENERS[div_u]
        anchor_lead = openers[(attempt_idx - 1) % len(openers)]
        # Keep non-empty clean core body after replacing weak opening sentence
        sents = [x.strip() for x in re.split(r"(?<=[.?!。？！])\s+", script) if len(x.strip()) >= 8]
        tail_body = " ".join(sents[1:3]) if len(sents) > 1 else ""
        script = f"{anchor_lead} {tail_body}".strip()
        # Also sharpen title if weak or abstract
        if (
            int((bd.get("item1_concreteness_25") or {}).get("score", 0)) == 0
            or len(title) < 12
            or attempt_idx >= 2
        ):
            title = anchor_lead[:86].rstrip(" .。!")

    # 3. Repair Item 3 (Bubble Intuitiveness < 20): strictly 12~15 chars (KO/JA) or <=6 words (EN)
    if int((bd.get("item3_bubble_intuitiveness_20") or {}).get("score", 0)) < 20 or not bubble:
        if attempt_idx >= 2:
            bank = _DIV_COMPACT_BUBBLES[div_u]
            bubble = bank[(attempt_idx - 1) % len(bank)]
        else:
            bubble = _derive_compact_bubble(div_u, title or script, attempt_idx=attempt_idx - 1)

    # 4. Repair Item 5 (Free Web-Tool Rationale < 15)
    if int((bd.get("item5_free_tool_cta_15") or {}).get("score", 0)) < 15:
        bridge = _DIV_FREE_TOOL_BRIDGES[div_u]
        cta = bridge
        if bridge[:18] not in script:
            script = f"{script} {bridge}".strip()

    # Final whitespace cleanup
    title = re.sub(r"\s+", " ", title).strip()
    script = re.sub(r"\s+", " ", script).strip()
    bubble = re.sub(r"\s+", " ", bubble).strip()
    cta = re.sub(r"\s+", " ", cta).strip()

    return {
        "title": title,
        "spoken_script": script,
        "speech_bubble": bubble,
        "cta": cta,
    }


def evaluate_and_refine_for_taste(
    div: str,
    title: str,
    spoken_script: str,
    speech_bubble: str = "",
    cta: str = "",
    max_retries: int = MAX_REWRITE_RETRIES,
) -> Dict[str, Any]:
    """
    Runs the full 85-point Taste Gate with hard-capped `MAX_REWRITE_RETRIES = 3`.
      - Evaluates initial candidate (attempt 0).
      - If `< 85` or non-compliant, logs concrete deductions and rewrites up to `min(max_retries, 3)` times.
      - If still `< 85` after 3 rewrites, releases the highest-scoring compliance-clean candidate
        and sets `low_score_warn = True` (`[TASTE_LOW_SCORE_WARN]`).
    """
    assert not EXTERNAL_PAID_EVAL_API_ENABLED, "Paid Taste API calls are permanently forbidden ($0 lock)."
    capped_retries = min(MAX_REWRITE_RETRIES, max(0, int(max_retries)))
    div_u = div.upper()

    current = {
        "title": str(title or "").strip(),
        "spoken_script": str(spoken_script or "").strip(),
        "speech_bubble": str(speech_bubble or "").strip() or _derive_compact_bubble(div_u, title),
        "cta": str(cta or "").strip(),
    }

    history: List[Dict[str, Any]] = []
    best_clean: Optional[Tuple[int, Dict[str, str], Dict[str, Any]]] = None
    best_any: Optional[Tuple[int, Dict[str, str], Dict[str, Any]]] = None

    for attempt in range(capped_retries + 1):
        ev = evaluate_taste(
            div_u,
            title=current["title"],
            spoken_script=current["spoken_script"],
            speech_bubble=current["speech_bubble"],
            cta=current["cta"],
        )
        history.append({
            "attempt": attempt,
            "score": ev["total_score"],
            "passed": ev["passed"],
            "compliance_ok": ev["compliance_ok"],
            "feedback": ev["feedback"],
            "speech_bubble": current["speech_bubble"],
        })
        if best_any is None or ev["total_score"] > best_any[0]:
            best_any = (ev["total_score"], dict(current), ev)
        if ev["compliance_ok"] and (best_clean is None or ev["total_score"] > best_clean[0]):
            best_clean = (ev["total_score"], dict(current), ev)

        if ev["passed"]:
            return {
                "div": div_u,
                "passed": True,
                "low_score_warn": False,
                "warn_tag": "",
                "attempts_used": attempt,
                "initial_score": history[0]["score"],
                "final_score": ev["total_score"],
                "candidate": current,
                "evaluation": ev,
                "history": history,
            }

        if attempt < capped_retries:
            current = rewrite_candidate_for_taste(div_u, current, ev, attempt_idx=attempt + 1)

    # Hard cap reached (3 retries): pick highest-scoring compliance-clean candidate + emit WARN tag
    chosen_score, chosen_cand, chosen_ev = best_clean if best_clean is not None else best_any  # type: ignore
    warn_tag = "[TASTE_LOW_SCORE_WARN]"
    print(
        f"  {warn_tag} {div_u} score={chosen_score}/{PASS_THRESHOLD} after {capped_retries} rewrites "
        f"(compliance_ok={chosen_ev['compliance_ok']}, reasons={chosen_ev['feedback'][:2]})",
        flush=True,
    )
    return {
        "div": div_u,
        "passed": False,
        "low_score_warn": True,
        "warn_tag": warn_tag,
        "attempts_used": capped_retries,
        "initial_score": history[0]["score"],
        "final_score": chosen_score,
        "candidate": chosen_cand,
        "evaluation": chosen_ev,
        "history": history,
    }


if __name__ == "__main__":
    # Built-in 5-division low-quality -> rewrite -> 85+ PASS self-verification
    bad_samples = {
        "TOM": (
            "In today's fast-paced world, let's explore retirement investing",
            "In today's world, today we will talk about investing. It is important to remember to diversify. Buy now before discount ends.",
            "Let us talk about general investing philosophy for everyone today",
        ),
        "KFG": (
            "Today we will talk about child height and clinical diagnosis",
            "In today's fast-paced world, let's explore Brain LQ and 1:1 clinical tips. You must always measure height.",
            "Today we will explore how kids grow in general over time",
        ),
        "GBA": (
            "本動画では新NISAについて解説します クオンツ1対1",
            "本動画では新NISAについて解説します。結論として投資することが非常に重要です。元本保証を今すぐ購入。",
            "本動画では新NISAの基本について詳しく徹底解説します",
        ),
        "HERO": (
            "오늘은 트로트 음악에 대해 알아보겠습니다",
            "오늘은 트로트 노래에 대해 알아보겠습니다. 결론적으로 음악 감상은 매우 중요합니다. 첫째 마음을 편히 하고 둘째 들어야 합니다.",
            "오늘은 좋은 트로트 음악에 대해 알아보겠습니다",
        ),
        "KFK": (
            "오늘은 아이 키 성장에 대해 알아보겠습니다 1:1 특가",
            "오늘은 아이 키 성장에 대해 알아보겠습니다. 결론적으로 수면은 매우 중요합니다. 첫째 일찍 자고 둘째 잘 먹어야 합니다. 지금 바로 결제하세요.",
            "오늘은 우리 아이 키 성장에 대해 차근차근 알아보겠습니다",
        ),
    }
    print("=== TASTE EVALUATOR 5-DIV SELF-TEST (LOW <85 -> REWRITE -> >=85 PASS) ===")
    for d_code, (bad_t, bad_s, bad_b) in bad_samples.items():
        res = evaluate_and_refine_for_taste(d_code, bad_t, bad_s, speech_bubble=bad_b)
        assert res["initial_score"] < PASS_THRESHOLD, f"{d_code} initial score unexpectedly high: {res['initial_score']}"
        assert res["passed"] and res["final_score"] >= PASS_THRESHOLD, f"{d_code} failed to pass 85+: {res}"
        assert res["evaluation"]["compliance_ok"], f"{d_code} compliance failed after rewrite!"
        print(
            f"  [PASS] {d_code:4s} | init={res['initial_score']:2d} -> final={res['final_score']:3d}/100 "
            f"(retries={res['attempts_used']}) | bubble={res['candidate']['speech_bubble']!r} "
            f"| first_deduction={res['history'][0]['feedback'][0][:62]}"
        )
    print("TASTE_EVALUATOR 5/5 SELF-TEST PASS.")
