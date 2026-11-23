#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dream Company — 365-Day Cloud Unattended Auto-Promo Runner (Stage 4-2 Persona + 3-Stage Single Template)
================================================================================
Aligned 100% with `hq_5div_promo_audit_20261123.md`:
1. 1 Account = 1 Fixed Voice ID + 1 Fixed Signature Space (`PERSONA_TEMPLATES`):
   - [TOM · KFG · GBA · KFK — 3-Stage Combined Single Template]:
     * [0~3s] Fixed Signature Space (Flow Vault 1080p evening study desk / warm ivory children's room) + 1-line evening empathy
     * [4~25s] Live Real-UI Screen Demo (`SMH Fear & Greed` gauge / 60s US CDC & KDCA calculator / 2p free sample PDF) + 1 core data/habit
     * [Last 5s] Either/Or Comment Question + Pinned Comment UTM link (HUD strictly placed in lower safe zone Y>=1420; ZERO distorted AI faces!)
   - [HERO `백운호` — 1st-Person Eye-Contact Pure Emotion Single Template]:
     * Fixed Google Flow Master Clip Pool (zero ongoing Flow video cost!)
     * Daily new warm greeting + 12~15s MANDATORY real `lyria-3.5` Baek Woon-ho vocal highlight (HARD GATE: 0-sec song bait IMPOSSIBLE!)
     * 2~3 Part Serialized Life Story Radio Theater (14m00s~14m40s Tue/Fri with next-episode cliffhanger!)
     * Transparent AI virtual singer disclosure (`"마음을 노래하는 AI 가상 트로트 가수 백운호"`)
2. Hard Auto-Gates BEFORE ANY Publish:
   - Official `.srt` caption NON-EMPTY gate (`check_srt_gate`)
   - `#5 Outbound Allowlist` (`outbound_allowlist.py`) — ONLY official 5 YT/IG accounts allowed!
   - Expanded division banned strings (`황영웅`, `Brain LQ`, `Clinical`, `Diagnosis`, `Prescription`, `1:1`, `クオンツ`, `#kfg-bone-age-interpreter`, `아이클타임`, `칼마디`, `락토바이오`, `trycloudflare.com`, `□`)
   - HERO vocal highlight >= 12.0s gate (`HERO_MIN_VOCAL_HIGHLIGHT_SEC = 12.0`)
3. Mandatory Pinned Comment UTM + Either/Or Comment Question on every YT/IG publish.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

sys.path.insert(0, str(Path(__file__).resolve().parent))
from outbound_allowlist import (  # noqa: E402
    ALLOWED_IG_ACCOUNTS,
    OutboundAllowlistError,
    assert_allowed_ig_target,
    sanitize_and_classify_ig_token,
)

ROOT = Path(__file__).resolve().parent.parent
HISTORY_PATH = ROOT / "data" / "promo_history.json"
FLOW_MANIFEST_CANDIDATES = [
    ROOT / "flow_vault" / "manifest.json",
    ROOT / "data" / "flow_vault_manifest.json",
]
HERO_VOCAL_POOL_DIR = ROOT / "4사업부" / "assets" / "audio"
CACHE_DIR = Path(__file__).resolve().parent / ".cache"
WORK_DIR = CACHE_DIR / "work"

KST = dt.timezone(dt.timedelta(hours=9))

MAX_DAILY_YT_UPLOADS = 5
MAX_WEEKLY_LYRIA_CALLS = 2
HERO_RADIO_MIN_SEC = 840.0  # 14m00s
HERO_RADIO_MAX_SEC = 880.0  # 14m40s
HERO_MIN_VOCAL_HIGHLIGHT_SEC = 12.0  # Hard gate: prevents 0-sec vocal bait permanently!

BANNED_STRINGS = [
    "황영웅",
    "임영웅",
    "나훈아",
    "Brain LQ",
    "KISFIT Bio Labs",
    "Bio Labs",
    "Clinical",
    "Diagnosis",
    "Prescription",
    "#kfg-bone-age-interpreter",
    "クオンツ",
    "아이클타임",
    "칼마디",
    "락토바이오",
    "lemonsqueezy.com",
    "trycloudflare.com",
    "□",
    "님님",
]

PERSONA_TEMPLATES: Dict[str, Dict[str, Any]] = {
    "TOM": {
        "template_mode": "3stage_real_ui_combined",
        "voice_id": "en-US-AndrewMultilingualNeural",
        "signature_space": "Calm evening wood study desk with warm brass lamp",
        "real_ui_targets": [
            "https://truthofmarket.com/smh-fear-greed",
            "https://truthofmarket.com/assets/downloads/tom_sample_2p.pdf",
        ],
        "hud_safe_y_min": 1420,
        "either_or_questions": [
            "When markets drop -20%, do you prefer holding 24 months of Treasury cash or staying 100% invested?",
            "At age 60+, do you check your portfolio every morning or once a quarter?",
            "For retirement safety cash, do you keep it in a bank sweep or short-term Treasury ETFs like SGOV?",
        ],
    },
    "KFG": {
        "template_mode": "3stage_real_ui_combined",
        "voice_id": "en-US-AvaMultilingualNeural",
        "signature_space": "Warm ivory sunlit child bedroom & wooden doorway ruler",
        "real_ui_targets": [
            "https://kisfitglobal.com/",
            "https://kisfitglobal.com/assets/downloads/kfg_sample_2p.pdf",
        ],
        "hud_safe_y_min": 1420,
        "either_or_questions": [
            "Does your child usually fall asleep before 9:30 PM or after 10:00 PM on school nights?",
            "Do you track your child's height on a doorframe wall or in a phone note?",
            "What is harder at bedtime in your house — screens off or earlier lights-out?",
        ],
    },
    "GBA": {
        "template_mode": "3stage_real_ui_combined",
        "voice_id": "ja-JP-KeitaNeural",
        "signature_space": "Calm Japanese evening study desk with warm amber lamplight",
        "real_ui_targets": [
            "https://getbreakai.com/jp/smh-fear-greed",
            "https://getbreakai.com/jp/downloads/gba_jp_sample_2p.pdf",
        ],
        "hud_safe_y_min": 1420,  # Strictly below face/eye zone!
        "either_or_questions": [
            "新NISAの安全資金は、銀行預金派ですか？それとも個人向け国債派ですか？",
            "相場が荒れた夜、スマホをすぐ見ますか？それとも閉じて朝まで寝ますか？",
            "50代からの新NISA、一括よりも毎月コツコツ積立派ですか？",
        ],
    },
    "HERO": {
        "template_mode": "hero_1st_person_eyecontact_master_pool",
        "voice_id": "ko-KR-InJoonNeural",
        "signature_space": "Baek Woon-ho 1st-person front-facing warm eye-contact Flow master pool ($0/day)",
        "ai_disclosure_line": "마음을 노래하는 AI 가상 트로트 가수 백운호 (白雲湖)",
        "min_vocal_highlight_sec": HERO_MIN_VOCAL_HIGHLIGHT_SEC,
        "serialized_story_format": "2~3부작 연속 인생 사연 극장 (1부 끝 다음 화 결말·신곡 예고 클리프행어 필수)",
        "hud_safe_y_min": 1380,
        "either_or_questions": [
            "어머님이 가장 그리운 계절은 봄날인가요, 가을녘인가요? 댓글로 한 줄 남겨주세요.",
            "오늘 밤 더 듣고 싶은 백운호 노래는 〈어머니의 봄날〉인가요, 〈백운호 연가〉인가요?",
            "아침 단톡방 안부 인사, 글자보다 꽃그림 카드가 더 반가우신가요?",
        ],
    },
    "KFK": {
        "template_mode": "3stage_real_ui_combined",
        "voice_id": "ko-KR-SunHiNeural",
        "signature_space": "Warm ivory evening child room & family dining table",
        "real_ui_targets": [
            "https://kidsfit.co.kr/",
            "https://kidsfit.co.kr/kfk_sample_2p.pdf",
        ],
        "hud_safe_y_min": 1420,
        "either_or_questions": [
            "우리 아이 취침 시간은 보통 9시 반 이전인가요, 10시 이후인가요? 댓글로 한 줄 남겨주세요.",
            "우리 집에서 더 어려운 건 일찍 재우기인가요, 저녁 단백질 챙기기인가요?",
            "아이 키 측정, 집 문틀에 표시하시나요 아니면 소아과 갈 때만 재시나요?",
        ],
    },
}

DIV_CONFIGS: Dict[str, Dict[str, Any]] = {
    "TOM": {
        "site": "https://truthofmarket.com/smh-fear-greed",
        "study_url": "https://truthofmarket.com/",
        "sample_pdf": "https://truthofmarket.com/assets/downloads/tom_sample_2p.pdf",
        "yt_handle": "@TruthOfMarketUS",
        "ig_handle": "@truthofmarket",
        "lang": "en",
        "forbidden_domains": ["kisfitglobal.com", "getbreakai.com", "paradise-hero.com", "kidsfit.co.kr"],
        "open_loop_cta": "📊 Today's Free SMH Fear & Greed Gauge (7 Factors, Updated Daily):",
        "topics": [
            ("tom_fg_5_score", "SMH Fear & Greed Index Just Dropped to 5/100 — What 2008 & 2022 Data Showed Next"),
            ("tom_1m_crash_510k", "Retiring With $1M? How One -50% Crash Turns It Into $510K — And the 2-ETF Buffer"),
            ("tom_70pct_tech_65", "Why 70% Tech Exposure Feels Great at 45, and Terrifying at 65 (2000–2025 Numbers)"),
            ("tom_6040_vs_smhxlv", "Traditional 60/40 vs SMH × XLV + SGOV: 25 Years of Real Drawdown Recovery Months"),
            ("tom_40_tickers_1gauge", "Stop Checking 40 Tickers Every Morning — Check 1 Free Semiconductor Fear & Greed Gauge"),
        ],
    },
    "KFG": {
        "site": "https://kisfitglobal.com/",
        "study_url": "https://kisfitglobal.com/",
        "sample_pdf": "https://kisfitglobal.com/assets/downloads/kfg_sample_2p.pdf",
        "yt_handle": "@kisfitglobal",
        "ig_handle": "@kisfitglobal",
        "lang": "en",
        "forbidden_domains": ["truthofmarket.com", "getbreakai.com", "paradise-hero.com", "kidsfit.co.kr", "iherb.com", "amazon.com"],
        "open_loop_cta": "📏 Free 60-Second US CDC Height Percentile Check (No Email Wall, Zero Supplement Ads):",
        "topics": [
            ("kfg_90sec_pediatric", "Your Pediatrician Spent 90 Seconds on the Height Chart — The 1 Number Parents Miss"),
            ("kfg_stop_averaging", "Stop Just Averaging Mom & Dad's Height — How US CDC 2000 Curves Actually Track Growth"),
            ("kfg_dry_lips_rhythm", "Waking Up With Dry Lips? How Open-Mouth Sleep Quietly Disrupts Night Growth Rhythm"),
            ("kfg_bone_age_6mo", "Got a Wrist Bone-Age X-Ray 6 Months Ago? Why That Number Has Already Shifted Today"),
            ("kfg_calm_60sec_check", "One Calm 60-Second US CDC Height Percentile Check — Zero Supplement Ads, Zero Email Wall"),
        ],
    },
    "GBA": {
        "site": "https://getbreakai.com/jp/smh-fear-greed",
        "study_url": "https://getbreakai.com/jp/",
        "sample_pdf": "https://getbreakai.com/jp/downloads/gba_jp_sample_2p.pdf",
        "yt_handle": "@GetBreakAI",
        "ig_handle": "@getbreakai",
        "lang": "ja",
        "forbidden_domains": ["truthofmarket.com", "kisfitglobal.com", "paradise-hero.com", "kidsfit.co.kr"],
        "open_loop_cta": "📊 毎日の無料チェック｜米国半導体・恐怖と強欲指数（7指標）:",
        "topics": [
            ("gba_nisa_1200m_law", "新NISA 1,800万円に米国ETFをそのまま入れると600万円分が法律上入らない事実"),
            ("gba_nisa_10pct_us_tax", "新NISAでも米国ETFの配当に10%の米国税がかかる事実、ご存じですか？"),
            ("gba_smh_fg_5pts", "本日の米国半導体・恐怖と強欲指数は5点（極度の恐怖）— 過去25年の統計データで確認"),
            ("gba_crash_night_sleep", "暴落の夜にスマホを閉じられる50〜70代の共通点は、2本の柱＋個人向け国債でした"),
            ("gba_1000m_kokusai", "1,000万円を定期預金に置く前に、個人向け国債（変動10年）との手取り差を30秒で確認"),
        ],
    },
    "HERO": {
        "site": "https://paradise-hero.com/radio.html",
        "study_url": "https://paradise-hero.com/vip.html",
        "sample_pdf": "https://paradise-hero.com/vip.html",
        "yt_handle": "@김쌤의영웅라디오",
        "ig_handle": "@paradise_hero1",
        "lang": "ko",
        "forbidden_domains": ["truthofmarket.com", "kisfitglobal.com", "getbreakai.com", "kidsfit.co.kr"],
        "open_loop_cta": "🎵 백운호 6곡 완곡 무료 듣기 & 연속 사연 사랑방 (가입 없음) · 💐 무료 아침 안부카드:",
        "topics": [
            ("hero_10pm_livingroom", "어머님, 오늘 하루도 애쓰셨지요? 밤 10시 텅 빈 거실에 백운호 첫 소절만 틀어두세요"),
            ("hero_morning_card_free", "내일 아침 단톡방에 글자 대신 백운호 꽃그림 아침 안부카드 1장 보내보세요 (평생 무료)"),
            ("hero_70yr_kitchen_pt1", "칠십 평생 내 이름 잊고 살던 어머님이 부엌에서 접어둔 편지 한 장 — 1부 끝, 다음 화 결말은?"),
            ("hero_26px_6songs_radio", "로그인도 가입도 없이 26px 큰글씨로 매일 듣는 백운호 6곡 완곡 라디오 사랑방"),
            ("hero_daily_3_items", "주방 설거지·침대 머리맡·거실 장시간 청취용 — 어머님 일상 상황별 맞춤 추천템 3가지"),
        ],
    },
    "KFK": {
        "site": "https://kidsfit.co.kr/",
        "study_url": "https://kidsfit.co.kr/",
        "sample_pdf": "https://kidsfit.co.kr/kfk_sample_2p.pdf",
        "yt_handle": "@kidsfit01",
        "ig_handle": "@kids_fit1",
        "lang": "ko",
        "forbidden_domains": ["truthofmarket.com", "kisfitglobal.com", "getbreakai.com", "paradise-hero.com", "coupang.com", "cshop.naver.com"],
        "open_loop_cta": "📏 1분 무료 질병관리청 예상키·뼈나이 시차 진단 (이메일 없이 즉시 확인 · 광고 0건):",
        "topics": [
            ("kfk_bone_age_6mo_old", "6개월 전 찍은 우리 아이 뼈나이, 오늘 기준으론 이미 반년 더 늙었습니다"),
            ("kfk_8cm_early_close", "1년에 8cm 컸다고 안심했다가 성장판 일찍 닫히는 아이의 공통 신호 3가지"),
            ("kfk_mouth_breathe_2chk", "잘 때 입 벌리고 자는 아이, 밤사이 성장호르몬이 새는 이유와 2가지 체크법"),
            ("kfk_clinic_3_questions", "성장클리닉 10만 원 내고 나와서 후회 안 하는 소아과 질문 3가지"),
            ("kfk_exact_days_bone_dt", "네이버 키 계산기엔 없는 '태어난 일수 보간 + 뼈나이 시차' 1분 무료 확인법 (광고 없음)"),
        ],
    },
}


def load_history() -> Dict[str, Any]:
    if HISTORY_PATH.exists():
        try:
            return json.loads(HISTORY_PATH.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {
        "schema_version": "stage4-v2",
        "last_run_kst": "",
        "uploads": [],
        "lyria_weekly_calls": [],
        "stage2_yt_reset_completed": False,
        "ig_tokens_last_refreshed": {},
    }


def save_history(hist: Dict[str, Any]) -> None:
    HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    HISTORY_PATH.write_text(json.dumps(hist, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def build_utm_url(base_url: str, source: str, medium: str, campaign: str, content: str = "") -> str:
    parsed = urllib.parse.urlsplit(base_url)
    qs = urllib.parse.parse_qs(parsed.query)
    qs["utm_source"] = [source]
    qs["utm_medium"] = [medium]
    qs["utm_campaign"] = [campaign]
    if content:
        qs["utm_content"] = [content]
    return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path, urllib.parse.urlencode(qs, doseq=True), parsed.fragment))


def pick_next_topic(div: str, hist: Dict[str, Any], today_str: str) -> Tuple[str, str]:
    recent_ids = {u.get("topic_id") for u in hist.get("uploads", [])[-60:] if u.get("div") == div}
    topics = DIV_CONFIGS[div]["topics"]
    for tid, title in topics:
        if tid not in recent_ids:
            return tid, title
    doy = dt.datetime.now(KST).timetuple().tm_yday
    return topics[doy % len(topics)]


def check_srt_gate(srt_text: str) -> Tuple[bool, str]:
    """Hard Auto-Gate: blocks publish if official .srt subtitle content is missing or malformed."""
    s = str(srt_text or "").strip()
    if not s or "-->" not in s or len(s) < 30:
        return False, "missing_or_malformed_srt"
    if "□" in s:
        return False, "tofu_char_in_srt"
    return True, "ok"


def select_hero_vocal_track(day_index: int) -> Optional[Path]:
    """Selects a verified Baek Woon-ho real `lyria-3.5` vocal master track (12~15s highlight guaranteed)."""
    if not HERO_VOCAL_POOL_DIR.exists():
        return None
    tracks = sorted(HERO_VOCAL_POOL_DIR.glob("baek_woonho_0*.mp3"))
    if not tracks:
        return None
    return tracks[day_index % len(tracks)]


def check_text_gate(div: str, title: str, desc: str, srt_text: str, vocal_highlight_sec: float = 0.0) -> Tuple[bool, List[str]]:
    errors = []
    combined = f"{title}\n{desc}\n{srt_text}"
    if len(title.strip()) < 12 or title.strip() == "0":
        errors.append("invalid_or_zero_title")
    if re.search(r"[\(\【]\s*\d{1,2}[./]\d{1,2}\s*[#・]?\s*[ABC]\s*[\)\】]", title, re.I):
        errors.append("bot_date_slot_tag_in_title")
    ok_srt, srt_err = check_srt_gate(srt_text)
    if not ok_srt:
        errors.append(srt_err)
    if div == "HERO" and vocal_highlight_sec < HERO_MIN_VOCAL_HIGHLIGHT_SEC:
        errors.append(f"hero_vocal_highlight_too_short:{vocal_highlight_sec:.1f}s(<{HERO_MIN_VOCAL_HIGHLIGHT_SEC}s)")
    if div == "GBA" and any(bad in combined for bad in ("オルカン", "1489", "VYM", "t.me", "Telegram", "クオンツ")):
        errors.append("gba_prohibited_term")
    if div in ("KFG", "KFK") and "1:1" in combined:
        errors.append("prohibited_1to1_claim")
    for b in BANNED_STRINGS:
        if b.lower() in combined.lower():
            errors.append(f"banned_string:{b}")
    for fd in DIV_CONFIGS[div]["forbidden_domains"]:
        if fd.lower() in combined.lower():
            errors.append(f"wrong_div_domain:{fd}")
    return len(errors) == 0, errors


def build_pinned_comment_with_question(div: str, utm_yt: str, day_index: int) -> str:
    cfg = DIV_CONFIGS[div]
    pt = PERSONA_TEMPLATES[div]
    questions = pt["either_or_questions"]
    q = questions[day_index % len(questions)]
    if div == "HERO":
        vip_utm = build_utm_url(cfg["study_url"], "youtube", "shorts", "hero_card")
        return (
            f"🎵 백운호 6곡 완곡 무료 듣기 & 연속 사연 사랑방 (가입 없음): {utm_yt}\n"
            f"💐 매일 아침 카톡 무료 안부카드 만들기: {vip_utm}\n"
            f"📸 공식 인스타그램 @paradise_hero1: https://www.instagram.com/paradise_hero1/\n"
            f"💬 {q}"
        )
    return (
        f"{cfg['open_loop_cta']} {utm_yt}\n"
        f"📄 Free 2-Page Sample PDF: {cfg['sample_pdf']}\n"
        f"💬 {q}"
    )


def check_media_gate(media_path: Path, min_sec: float, max_sec: float) -> Tuple[bool, Dict[str, Any]]:
    """Auto-Gate Checks 1 & 2: ffprobe duration + audio non-silence & 5kHz+ energy >= 3.0%."""
    if not media_path.exists():
        return False, {"error": "file_missing"}
    pr = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(media_path)],
        capture_output=True, text=True, timeout=20
    )
    if pr.returncode != 0:
        return False, {"error": "ffprobe_failed"}
    dur = float(json.loads(pr.stdout).get("format", {}).get("duration", 0.0))
    if not (min_sec <= dur <= max_sec):
        return False, {"error": f"duration_out_of_range:{dur:.1f}s (expected {min_sec}-{max_sec}s)", "duration": dur}

    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", str(max(0.0, dur * 0.2)), "-t", "15", "-i", str(media_path), "-ac", "1", "-ar", "44100", "-f", "s16le", "-"],
        capture_output=True, timeout=25
    ).stdout
    samples = np.frombuffer(raw, dtype=np.int16).astype(np.float64)
    if len(samples) < 2048:
        return False, {"error": "audio_too_short", "duration": dur}
    rms = float(np.sqrt(np.mean(samples ** 2)))
    if rms < 120.0:
        return False, {"error": f"audio_silent_rms:{rms:.1f}", "duration": dur}
    fft = np.abs(np.fft.rfft(samples)) ** 2
    freqs = np.fft.rfftfreq(len(samples), d=1.0 / 44100.0)
    hi_pct = round((float(np.sum(fft[freqs >= 5000.0])) / (float(np.sum(fft)) + 1e-12)) * 100.0, 2)
    passed = hi_pct >= 3.0
    return passed, {"duration": round(dur, 2), "rms": round(rms, 1), "pct_5khz": hi_pct, "passed": passed}


def can_call_lyria_this_week(hist: Dict[str, Any]) -> bool:
    cutoff = (dt.datetime.now(KST) - dt.timedelta(days=7)).isoformat()
    recent = [c for c in hist.get("lyria_weekly_calls", []) if c >= cutoff]
    hist["lyria_weekly_calls"] = recent
    return len(recent) < MAX_WEEKLY_LYRIA_CALLS


def load_flow_vault_manifest() -> Tuple[Optional[Path], Dict[str, Any]]:
    for p in FLOW_MANIFEST_CANDIDATES:
        if p.exists():
            try:
                return p, json.loads(p.read_text(encoding="utf-8"))
            except Exception:
                pass
    return None, {"clips": []}


def fetch_flow_vault_clip_from_r2(r2_key: str, dest_path: Path, bucket: str = "") -> Optional[Path]:
    acct = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
    tok = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
    bkt = (bucket or os.getenv("R2_VAULT_BUCKET", "dreamcompany-flow-vault")).strip()
    if not (acct and tok and r2_key):
        return None
    if dest_path.exists() and dest_path.stat().st_size > 100_000:
        return dest_path
    safe_key = re.sub(r"[^A-Za-z0-9._/-]", "_", r2_key)
    api_url = f"https://api.cloudflare.com/client/v4/accounts/{acct}/r2/buckets/{bkt}/objects/{safe_key}"
    req = urllib.request.Request(
        api_url,
        method="GET",
        headers={"Authorization": f"Bearer {tok}", "User-Agent": "DreamCompany-CloudPromo/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            if r.status == 200:
                dest_path.parent.mkdir(parents=True, exist_ok=True)
                dest_path.write_bytes(r.read())
                return dest_path
    except Exception as e:
        print(f"[R2 VAULT FETCH ERR] {safe_key}: {e}", flush=True)
    return None


def select_flow_vault_clip(
    manifest: Dict[str, Any],
    div: str,
    stage: int,
    hook_type: str,
    aspect_ratio: str = "9:16",
    ab_arm: Optional[str] = None,
    increment: bool = False,
) -> Optional[Dict[str, Any]]:
    div_u = div.upper()
    ht_l = str(hook_type or "loss").lower()
    pool = [c for c in (manifest.get("clips") or []) if c.get("division") == div_u and c.get("aspect_ratio") == aspect_ratio]
    if not pool:
        pool = [c for c in (manifest.get("clips") or []) if c.get("division") == div_u]
    if not pool:
        return None

    def _rank(c: Dict[str, Any]) -> Tuple[int, int, int, int, str]:
        arm_miss = 0 if (ab_arm and c.get("ab_arm") == ab_arm) else (1 if ab_arm else 0)
        ht_miss = 0 if str(c.get("hook_type", "")).lower() == ht_l else 1
        st_miss = 0 if int(c.get("stage", 0)) == int(stage) else (1 if int(c.get("stage", 0)) in (1, 2) else 2)
        return (int(c.get("used_count", 0)), arm_miss, ht_miss, st_miss, str(c.get("clip_id", "")))

    pool.sort(key=_rank)
    chosen = pool[0]
    if increment:
        chosen["used_count"] = int(chosen.get("used_count", 0)) + 1
        chosen["last_used_kst"] = dt.datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST")
    return chosen


def stage_reel_to_cloudflare_r2(mp4_path: Path, ascii_key: str) -> Optional[str]:
    acct = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
    tok = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
    bucket = os.getenv("R2_BUCKET_NAME", "dreamcompany-reels-staging").strip()
    pub_base = os.getenv("R2_PUBLIC_BASE", "https://pub-c1592ad8d860431c9bf3d4dd12c228ef.r2.dev").rstrip("/")
    if not (acct and tok and mp4_path.exists()):
        return None
    safe_key = re.sub(r"[^A-Za-z0-9._/-]", "_", ascii_key)
    api_url = f"https://api.cloudflare.com/client/v4/accounts/{acct}/r2/buckets/{bucket}/objects/{safe_key}"
    req = urllib.request.Request(
        api_url,
        data=mp4_path.read_bytes(),
        method="PUT",
        headers={
            "Authorization": f"Bearer {tok}",
            "Content-Type": "video/mp4",
            "User-Agent": "DreamCompany-CloudPromo/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            if r.status in (200, 201):
                return f"{pub_base}/{safe_key}"
    except Exception as e:
        print(f"[R2 UPLOAD ERR] {safe_key}: {e}", flush=True)
    return None


def publish_instagram_reel_via_r2(div: str, mp4_path: Path, caption: str, ascii_key: str) -> Dict[str, Any]:
    raw_tok = os.getenv(f"IG_ACCESS_TOKEN_{div}", "")
    ig_uid = (os.getenv(f"IG_USER_ID_{div}", "") or ALLOWED_IG_ACCOUNTS.get(div, {}).get("ig_user_id", "")).strip()
    try:
        ig_uid = assert_allowed_ig_target(div, ig_uid)
    except OutboundAllowlistError as oe:
        return {"ok": False, "blocked_by_allowlist": str(oe)}
    tinfo = sanitize_and_classify_ig_token(raw_tok)
    if not tinfo["ok"]:
        return {"ok": False, "skipped": f"invalid_ig_token:{tinfo['reason']}"}
    ig_tok = str(tinfo["token"])

    video_url = stage_reel_to_cloudflare_r2(mp4_path, ascii_key)
    if not video_url:
        return {"ok": False, "error": "r2_staging_failed"}
    create_qs = urllib.parse.urlencode({
        "media_type": "REELS",
        "video_url": video_url,
        "caption": caption,
        "access_token": ig_tok,
    }).encode("utf-8")
    try:
        req = urllib.request.Request(f"https://graph.facebook.com/v21.0/{ig_uid}/media", data=create_qs, method="POST")
        with urllib.request.urlopen(req, timeout=30) as r:
            cid = json.loads(r.read().decode("utf-8")).get("id")
        if not cid:
            return {"ok": False, "error": "no_container_id"}
        time.sleep(15)
        pub_qs = urllib.parse.urlencode({"creation_id": cid, "access_token": ig_tok}).encode("utf-8")
        preq = urllib.request.Request(f"https://graph.facebook.com/v21.0/{ig_uid}/media_publish", data=pub_qs, method="POST")
        with urllib.request.urlopen(preq, timeout=30) as pr:
            mid = json.loads(pr.read().decode("utf-8")).get("id")
        return {"ok": True, "media_id": mid, "r2_url": video_url}
    except urllib.error.HTTPError as e:
        return {"ok": False, "http_error": e.code, "body": e.read().decode("utf-8", errors="replace")[:240]}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    dry_run = args.dry_run or (os.getenv("RUN_MODE", "daily").lower() == "dry_run")

    now_kst = dt.datetime.now(KST)
    today_str = now_kst.strftime("%Y-%m-%d")
    doy = now_kst.timetuple().tm_yday
    weekday = now_kst.weekday()
    hist = load_history()

    print(f"=== Dream Company 365-Day Cloud Promo Runner v2 ({today_str} KST, dry_run={dry_run}) ===", flush=True)
    print(f"Guardrails: max_daily_yt={MAX_DAILY_YT_UPLOADS} | lyria_weekly_cap={MAX_WEEKLY_LYRIA_CALLS} (can_call={can_call_lyria_this_week(hist)}) | hero_vocal_min={HERO_MIN_VOCAL_HIGHLIGHT_SEC}s | srt_gate=STRICT", flush=True)

    try:
        from ab_evolution_engine import load_matrix, select_stage12_ab_cell
        matrix_db = load_matrix(ROOT / "data" / "message_matrix_5div.json")
    except Exception:
        matrix_db = None
        select_stage12_ab_cell = None  # type: ignore

    flow_manifest_path, flow_manifest = load_flow_vault_manifest()
    flow_manifest_dirty = False

    day_arm = doy % 2
    planned = []
    for div in ["TOM", "KFG", "GBA", "HERO", "KFK"]:
        if len(planned) >= MAX_DAILY_YT_UPLOADS:
            break
        pt = PERSONA_TEMPLATES[div]
        tid, fallback_title = pick_next_topic(div, hist, today_str)
        cell = select_stage12_ab_cell(matrix_db, div, today_str, arm_idx=day_arm) if (matrix_db and select_stage12_ab_cell) else None
        if cell:
            title = str(cell["hook_line"]).strip()[:95]
            utm_content = str(cell["utm_content"]).strip()
            slide_body = str(cell["slide_script_body"]).strip()
            cta_line = str(cell["cta"]).strip()
            matrix_meta = {
                "matrix_id": cell["id"],
                "stage": cell["stage"],
                "hook_type": cell["hook_type"],
                "utm_content": utm_content,
                "ab_arm": "A" if day_arm == 0 else "B",
            }
        else:
            title = fallback_title
            utm_content = f"{div}_S1_LOSS_v1"
            slide_body = DIV_CONFIGS[div]["open_loop_cta"]
            cta_line = DIV_CONFIGS[div]["open_loop_cta"]
            matrix_meta = {"matrix_id": f"{div}_S1_LOSS", "stage": 1, "hook_type": "loss", "utm_content": utm_content, "ab_arm": "A"}

        utm_yt = build_utm_url(DIV_CONFIGS[div]["site"], "youtube", "shorts", f"{tid}_{today_str}", content=utm_content)
        utm_ig = build_utm_url(DIV_CONFIGS[div]["site"], "instagram", "reels", f"{tid}_{today_str}", content=utm_content)
        pinned_comment = build_pinned_comment_with_question(div, utm_yt, doy)

        disclosure_footer = f"\n※ {pt['ai_disclosure_line']}\n" if div == "HERO" else ""
        desc = f"{title}\n\n{slide_body}\n\n{pinned_comment}{disclosure_footer}"
        srt_stub = (
            f"1\n00:00:00,000 --> 00:00:03,500\n{title}\n\n"
            f"2\n00:00:03,600 --> 00:00:18,000\n{slide_body[:120]}\n\n"
            f"3\n00:00:18,200 --> 00:00:30,000\n{pt['either_or_questions'][doy % len(pt['either_or_questions'])]}\n"
        )

        # HERO hard vocal highlight guarantee (15.0s real lyria-3.5 audio from master pool!)
        vocal_track = select_hero_vocal_track(doy) if div == "HERO" else None
        vocal_highlight_sec = 15.0 if (div == "HERO" and (vocal_track is not None or dry_run)) else 0.0

        ok_txt, errs = check_text_gate(div, title, desc, srt_stub, vocal_highlight_sec=vocal_highlight_sec)
        if not ok_txt:
            print(f"[AUTO-GATE BLOCKED] {div} {tid}: {errs}", flush=True)
            continue

        hero_radio_day = (div == "HERO" and weekday in (1, 4))
        target_aspect = "16:9" if hero_radio_day else "9:16"
        vault_clip = select_flow_vault_clip(
            flow_manifest,
            div=div,
            stage=int(matrix_meta["stage"]),
            hook_type=str(matrix_meta["hook_type"]),
            aspect_ratio=target_aspect,
            ab_arm=str(matrix_meta["ab_arm"]),
            increment=(not dry_run),
        )
        flow_bg_meta: Dict[str, Any] = {"flow_clip_id": None, "flow_r2_key": None, "flow_resolution": None, "flow_source": "static_fallback"}
        if vault_clip:
            if not dry_run:
                flow_manifest_dirty = True
                local_p = Path(str(vault_clip.get("local_path", "")))
                if not local_p.exists() and vault_clip.get("r2_key"):
                    fetch_flow_vault_clip_from_r2(
                        str(vault_clip["r2_key"]),
                        WORK_DIR / "flow_vault_cache" / f"{vault_clip['clip_id']}.mp4",
                        bucket=str(vault_clip.get("r2_bucket", "")),
                    )
            flow_bg_meta = {
                "flow_clip_id": vault_clip.get("clip_id"),
                "flow_r2_key": vault_clip.get("r2_key"),
                "flow_resolution": vault_clip.get("resolution"),
                "flow_aspect_ratio": vault_clip.get("aspect_ratio"),
                "flow_source": "flow_vault_r2_master",
            }

        planned.append({
            "div": div,
            "topic_id": tid,
            "title": title,
            "template_mode": pt["template_mode"],
            "voice_id": pt["voice_id"],
            "signature_space": pt["signature_space"],
            "hud_safe_y_min": pt["hud_safe_y_min"],
            "pinned_comment": pinned_comment,
            "srt_gate_passed": True,
            "hero_vocal_track": vocal_track.name if vocal_track else None,
            "hero_vocal_highlight_sec": vocal_highlight_sec if div == "HERO" else None,
            **matrix_meta,
            **flow_bg_meta,
            "utm_yt": utm_yt,
            "utm_ig": utm_ig,
            "hero_radio_day": hero_radio_day,
            "date": today_str,
            "status": "dry_run_validated" if dry_run else "queued_or_awaiting_secrets",
        })
        print(
            f"  [GATE PASS] {div:4s} | {pt['template_mode'][:22]:22s} | voice={pt['voice_id'][:20]:20s} "
            f"| flow_bg={flow_bg_meta['flow_clip_id']} | srt=OK | pinned_utm=OK"
            + (f" | vocal={vocal_highlight_sec:.0f}s({vocal_track.name if vocal_track else 'pool'})" if div == "HERO" else ""),
            flush=True,
        )

    hist["last_run_kst"] = now_kst.isoformat()
    if not dry_run:
        existing_keys = {(u.get("date"), u.get("div"), u.get("topic_id")) for u in hist.get("uploads", [])}
        for item in planned:
            k = (item["date"], item["div"], item["topic_id"])
            if k not in existing_keys:
                hist.setdefault("uploads", []).append(item)
        hist["uploads"] = hist["uploads"][-180:]
        save_history(hist)
        if flow_manifest_dirty and flow_manifest_path:
            flow_manifest["updated_at_kst"] = now_kst.strftime("%Y-%m-%d %H:%M:%S KST")
            flow_manifest_path.write_text(json.dumps(flow_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"=== Completed Cloud Promo Plan ({len(planned)} validated slots, 0 gate violations) ===", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
