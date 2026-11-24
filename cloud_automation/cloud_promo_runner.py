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
import asyncio
import datetime as dt
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
from PIL import Image, ImageDraw, ImageFont

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
    assert_allowed_yt_channel,
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


HERO_R2_VOCAL_KEYS: List[str] = [
    "brand_kits_20261123/hero_vocals/baek_woonho_01_mothers_spring.mp3",
    "brand_kits_20261123/hero_vocals/baek_woonho_02_yeonga.mp3",
    "brand_kits_20261123/hero_vocals/baek_woonho_03_harbor_light.mp3",
    "brand_kits_20261123/hero_vocals/baek_woonho_04_camellia.mp3",
    "brand_kits_20261123/hero_vocals/baek_woonho_05_hometown_train.mp3",
    "brand_kits_20261123/hero_vocals/baek_woonho_06_golden_sunset.mp3",
]

DIV_LANG_MAP: Dict[str, str] = {"TOM": "en", "KFG": "en", "GBA": "ja", "HERO": "ko", "KFK": "ko"}


def _pick_cjk_font(size: int) -> ImageFont.FreeTypeFont:
    candidates = [
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
        "/usr/share/fonts/noto-cjk/NotoSansCJK-Bold.ttc",
        r"C:\Windows\Fonts\malgunbd.ttf",
        r"C:\Windows\Fonts\meiryob.ttc",
        r"C:\Windows\Fonts\arialbd.ttf",
    ]
    for fp in candidates:
        if Path(fp).exists():
            try:
                return ImageFont.truetype(fp, size=size)
            except Exception:
                continue
    return ImageFont.load_default()


def _wrap_text_pixels(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_w: int) -> List[str]:
    clean = re.sub(r"\s+", " ", (text or "").strip())
    if not clean:
        return []
    lines: List[str] = []
    cur = ""
    tokens = clean.split(" ") if " " in clean and len(clean.split(" ")) > 2 else list(clean)
    sep = " " if " " in clean and len(clean.split(" ")) > 2 else ""
    for tok in tokens:
        cand = f"{cur}{sep}{tok}".strip() if cur else tok
        bbox = draw.textbbox((0, 0), cand, font=font, stroke_width=6)
        if (bbox[2] - bbox[0]) <= max_w:
            cur = cand
        else:
            if cur:
                lines.append(cur)
            cur = tok
    if cur:
        lines.append(cur)
    return lines[:4]


def _render_safezone_subtitle_png(div: str, headline: str, body: str, cta: str, out_png: Path) -> Path:
    """Renders 1080x1920 transparent overlay with crisp safe-zone subtitles (Y=1360..1680, ZERO eye-blocking top HUD!)."""
    img = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Soft bottom readability gradient ONLY below Y=1180 so faces/eyes in upper 2/3 stay 100% clear
    for y in range(1180, 1920):
        alpha = int(min(205, ((y - 1180) / 740.0) * 205))
        draw.line([(0, y), (1080, y)], fill=(12, 16, 22, alpha))

    f_head = _pick_cjk_font(54 if div == "HERO" else 48)
    f_body = _pick_cjk_font(44 if div == "HERO" else 38)
    f_cta = _pick_cjk_font(36)

    y_cur = 1310
    for line in _wrap_text_pixels(draw, headline, f_head, 940)[:2]:
        bb = draw.textbbox((0, 0), line, font=f_head, stroke_width=8)
        x = (1080 - (bb[2] - bb[0])) // 2
        draw.text((x, y_cur), line, font=f_head, fill=(255, 245, 200, 255), stroke_width=8, stroke_fill=(10, 14, 20, 255))
        y_cur += (bb[3] - bb[1]) + 16

    y_cur = max(y_cur + 10, 1455)
    for line in _wrap_text_pixels(draw, body, f_body, 940)[:2]:
        bb = draw.textbbox((0, 0), line, font=f_body, stroke_width=7)
        x = (1080 - (bb[2] - bb[0])) // 2
        draw.text((x, y_cur), line, font=f_body, fill=(255, 255, 255, 255), stroke_width=7, stroke_fill=(10, 14, 20, 255))
        y_cur += (bb[3] - bb[1]) + 14

    if cta:
        cta_lines = _wrap_text_pixels(draw, cta, f_cta, 920)[:1]
        if cta_lines:
            line = cta_lines[0]
            bb = draw.textbbox((0, 0), line, font=f_cta, stroke_width=6)
            x = (1080 - (bb[2] - bb[0])) // 2
            draw.text((x, 1645), line, font=f_cta, fill=(175, 240, 205, 255), stroke_width=6, stroke_fill=(10, 14, 20, 255))

    out_png.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_png)
    return out_png


def _probe_media_duration(path: Path) -> float:
    ffprobe = shutil.which("ffprobe")
    if ffprobe and path.exists():
        try:
            out = subprocess.check_output(
                [ffprobe, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
                stderr=subprocess.DEVNULL,
                text=True,
                timeout=15,
            ).strip()
            return max(0.0, float(out))
        except Exception:
            pass
    return 0.0


def synthesize_edge_tts_mp3(text: str, voice_id: str, out_mp3: Path) -> Optional[Path]:
    try:
        import edge_tts  # type: ignore
    except Exception as e:
        print(f"[TTS SKIP] edge_tts unavailable: {e}", flush=True)
        return None
    out_mp3.parent.mkdir(parents=True, exist_ok=True)
    clean_text = re.sub(r"https?://\S+|#\S+", "", text or "").strip()
    if not clean_text:
        return None

    async def _gen() -> None:
        comm = edge_tts.Communicate(clean_text, voice=voice_id, rate="+0%")
        await comm.save(str(out_mp3))

    for attempt in range(2):
        try:
            asyncio.run(_gen())
            if out_mp3.exists() and out_mp3.stat().st_size > 2000:
                return out_mp3
        except Exception as e:
            print(f"[TTS RETRY {attempt+1}] {voice_id}: {e}", flush=True)
            time.sleep(1.5)
    return None


HERO_R2_CATALOG_KEY = "brand_kits_20261123/hero_vocals/baek_woonho_6songs_mv_catalog.json"


def load_hero_trot_mv_catalog() -> Optional[Dict[str, Any]]:
    for cand in [
        ROOT / "4사업부" / "data" / "baek_woonho_6songs_mv_catalog.json",
        ROOT / "data" / "baek_woonho_6songs_mv_catalog.json",
        WORK_DIR / "hero_vocals_cache" / "baek_woonho_6songs_mv_catalog.json",
    ]:
        if cand.exists():
            try:
                return json.loads(cand.read_text(encoding="utf-8"))
            except Exception:
                pass
    fetched = fetch_flow_vault_clip_from_r2(HERO_R2_CATALOG_KEY, WORK_DIR / "hero_vocals_cache" / "baek_woonho_6songs_mv_catalog.json")
    if fetched and fetched.exists():
        try:
            return json.loads(fetched.read_text(encoding="utf-8"))
        except Exception:
            pass
    return None


def _fmt_srt_ts(sec: float) -> str:
    s = max(0.0, float(sec))
    h, m, r = int(s // 3600), int((s % 3600) // 60), int(s % 60)
    ms = int(round((s - int(s)) * 1000)) % 1000
    return f"{h:02d}:{m:02d}:{r:02d},{ms:03d}"


def render_hero_trot_music_short_mp4(
    song: Dict[str, Any],
    sl: Dict[str, Any],
    bg_clips: List[Path],
    song_mp3: Path,
    out_mp4: Path,
) -> Tuple[Optional[Path], float]:
    """Renders 1080x1920 Music-First Baek Woon-ho Trot Singing Short MV (0.0s immediate singing + synced gold/white karaoke lyrics)."""
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        try:
            import imageio_ffmpeg  # type: ignore
            ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
        except Exception:
            return None, 0.0

    dur = float(sl.get("duration_sec", 34.0))
    start_s = float(sl.get("start_sec", 41.0))
    cues = [(float(a), float(b), str(c), str(d)) for a, b, c, d in (sl.get("cues") or [])]
    out_mp4.parent.mkdir(parents=True, exist_ok=True)
    aud_m4a = out_mp4.with_suffix(".trot.m4a")
    ra = subprocess.run(
        [
            ffmpeg, "-y", "-threads", "2",
            "-ss", f"{start_s:.2f}", "-t", f"{dur:.2f}", "-i", str(song_mp3),
            "-af", f"aresample=44100,afade=t=in:st=0:d=0.6,afade=t=out:st={max(1.0, dur-1.6):.2f}:d=1.6,alimiter=limit=0.944",
            "-c:a", "aac", "-b:a", "192k", str(aud_m4a),
        ],
        stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=90,
    )
    if ra.returncode != 0 or not aud_m4a.exists():
        print(f"[HERO TROT AUDIO ERR] {ra.stderr[-220:]}", flush=True)
        return None, 0.0

    # Build looped multi-clip or single-clip background
    valid_bgs = [p for p in bg_clips if p and p.exists() and p.stat().st_size > 50_000]
    tmp_pngs: List[Path] = []
    bg_arg: List[str] = []
    if valid_bgs:
        bg_arg = ["-stream_loop", "-1", "-i", str(valid_bgs[0])]
        bg_scale = "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p[bg0]"
    else:
        bg_arg = ["-f", "lavfi", "-i", "color=c=0x11251E:s=1080x1920:r=30"]
        bg_scale = "[0:v]format=yuv420p[bg0]"

    inputs = [*bg_arg, "-i", str(aud_m4a)]
    filter_parts = [bg_scale]
    last_v = "bg0"
    f_pill = _pick_cjk_font(34)
    f_l1 = _pick_cjk_font(64)
    f_l2 = _pick_cjk_font(60)
    f_cta = _pick_cjk_font(34)

    for idx, (t0, t1, l1, l2) in enumerate(cues):
        is_last = idx == (len(cues) - 1)
        im = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        dr = ImageDraw.Draw(im)
        for y in range(1190, 1920):
            a = int(min(215, ((y - 1190) / 730.0) * 215))
            dr.line([(0, y), (1080, y)], fill=(8, 22, 18, a))
        pill = f"♪ 백운호 〈{song['title']}〉 · {song['badge']} (AI 가상 트로트 가수)"
        pbb = dr.textbbox((0, 0), pill, font=f_pill)
        pw, ph = pbb[2] - pbb[0] + 40, pbb[3] - pbb[1] + 20
        px = max(20, (1080 - pw) // 2)
        dr.rounded_rectangle([px, 72, px + pw, 72 + ph], radius=ph // 2, fill=(10, 38, 30, 205), outline=(212, 175, 55, 240), width=3)
        dr.text((px + 20, 81), pill, font=f_pill, fill=(255, 242, 195, 255))

        for line_txt, fnt, yy, col in [
            (l1, f_l1, 1325, (255, 226, 118, 255)),
            (l2, f_l2, 1418, (255, 255, 255, 255)),
        ]:
            if line_txt:
                bb = dr.textbbox((0, 0), line_txt, font=fnt, stroke_width=8)
                xx = max(24, (1080 - (bb[2] - bb[0])) // 2)
                dr.text((xx, yy), line_txt, font=fnt, fill=col, stroke_width=8, stroke_fill=(8, 16, 14, 255))
        if is_last:
            cta_t = "프로필 눌러 백운호 6곡 무료 듣기 → paradise-hero.com"
            cta_sz = 32
            f_cta_fit = _pick_cjk_font(cta_sz)
            while cta_sz >= 22:
                f_cta_fit = _pick_cjk_font(cta_sz)
                cbb = dr.textbbox((0, 0), cta_t, font=f_cta_fit)
                if (cbb[2] - cbb[0]) <= 940:
                    break
                cta_sz -= 2
            cbb = dr.textbbox((0, 0), cta_t, font=f_cta_fit)
            cw, ch = cbb[2] - cbb[0] + 44, cbb[3] - cbb[1] + 22
            cx = max(20, (1080 - cw) // 2)
            dr.rounded_rectangle([cx, 1605, cx + cw, 1605 + ch], radius=16, fill=(14, 58, 44, 235), outline=(245, 208, 90, 255), width=3)
            dr.text((cx + 22, 1615), cta_t, font=f_cta_fit, fill=(255, 250, 230, 255))
        png_p = out_mp4.with_name(f"{out_mp4.stem}_cue{idx}.png")
        im.save(png_p)
        tmp_pngs.append(png_p)
        inp_idx = idx + 2
        inputs.extend(["-i", str(png_p)])
        out_v = f"hv{idx}"
        filter_parts.append(f"[{last_v}][{inp_idx}:v]overlay=0:0:enable='between(t,{t0:.2f},{t1:.2f})'[{out_v}]")
        last_v = out_v

    rv = subprocess.run(
        [
            ffmpeg, "-y", "-threads", "2",
            *inputs,
            "-filter_complex", ";".join(filter_parts) + f";[{last_v}]format=yuv420p[vout]",
            "-map", "[vout]", "-map", "1:a",
            "-t", f"{dur:.2f}",
            "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-movflags", "+faststart",
            "-c:a", "copy", str(out_mp4),
        ],
        stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=240,
    )
    try:
        aud_m4a.unlink(missing_ok=True)
        for tp in tmp_pngs:
            tp.unlink(missing_ok=True)
    except Exception:
        pass
    if rv.returncode != 0 or not out_mp4.exists():
        print(f"[HERO TROT VIDEO ERR] {rv.stderr[-240:]}", flush=True)
        return None, 0.0
    return out_mp4, dur


def ensure_hero_vocal_track(doy: int, r2_key_override: Optional[str] = None, filename_override: Optional[str] = None) -> Optional[Path]:
    if filename_override:
        cand = HERO_VOCAL_POOL_DIR / filename_override
        if cand.exists():
            return cand
    if r2_key_override:
        dest = WORK_DIR / "hero_vocals_cache" / Path(r2_key_override).name
        fetched = fetch_flow_vault_clip_from_r2(r2_key_override, dest)
        if fetched and fetched.exists():
            return fetched
    local = select_hero_vocal_track(doy)
    if local and local.exists():
        return local
    idx = doy % len(HERO_R2_VOCAL_KEYS)
    r2_key = HERO_R2_VOCAL_KEYS[idx]
    dest = WORK_DIR / "hero_vocals_cache" / Path(r2_key).name
    fetched = fetch_flow_vault_clip_from_r2(r2_key, dest)
    if fetched and fetched.exists():
        return fetched
    return fetch_flow_vault_clip_from_r2(HERO_R2_VOCAL_KEYS[0], WORK_DIR / "hero_vocals_cache" / "baek_woonho_01_mothers_spring.mp3")


def render_cloud_short_mp4(
    div: str,
    bg_mp4: Optional[Path],
    tts_mp3: Optional[Path],
    vocal_mp3: Optional[Path],
    title: str,
    slide_body: str,
    cta_line: str,
    out_mp4: Path,
) -> Tuple[Optional[Path], float]:
    """Renders 1080x1920 clean vertical Short MP4 with -threads 2, -0.5 dBFS limiter, and mandatory HERO 14s vocal highlight."""
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        try:
            import imageio_ffmpeg  # type: ignore
            ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
        except Exception:
            print("[RENDER SKIP] ffmpeg not found", flush=True)
            return None, 0.0

    out_mp4.parent.mkdir(parents=True, exist_ok=True)
    overlay_png = out_mp4.with_suffix(".overlay.png")
    _render_safezone_subtitle_png(div, title, slide_body, cta_line, overlay_png)

    tts_dur = _probe_media_duration(tts_mp3) if (tts_mp3 and tts_mp3.exists()) else 12.0
    if tts_dur < 3.0:
        tts_dur = 12.0

    # Build master audio track (HERO: narration + 14.0s real Baek Woon-ho vocal highlight!)
    audio_wav = out_mp4.with_suffix(".master.m4a")
    total_dur = tts_dur + 0.6
    if div == "HERO" and vocal_mp3 and vocal_mp3.exists():
        vocal_slice_sec = 14.0
        total_dur = tts_dur + vocal_slice_sec + 0.5
        if tts_mp3 and tts_mp3.exists():
            cmd_a = [
                ffmpeg, "-y", "-threads", "2",
                "-i", str(tts_mp3),
                "-ss", "18", "-t", f"{vocal_slice_sec:.2f}", "-i", str(vocal_mp3),
                "-filter_complex",
                "[0:a]aresample=44100,aformat=channel_layouts=stereo[a0];"
                "[1:a]aresample=44100,aformat=channel_layouts=stereo,afade=t=in:st=0:d=0.6,afade=t=out:st=12.8:d=1.2[a1];"
                "[a0][a1]concat=n=2:v=0:a=1,alimiter=limit=0.944[aout]",
                "-map", "[aout]", "-c:a", "aac", "-b:a", "192k", str(audio_wav),
            ]
        else:
            cmd_a = [
                ffmpeg, "-y", "-threads", "2",
                "-ss", "18", "-t", f"{vocal_slice_sec:.2f}", "-i", str(vocal_mp3),
                "-af", "aresample=44100,afade=t=in:st=0:d=0.5,afade=t=out:st=12.8:d=1.2,alimiter=limit=0.944",
                "-c:a", "aac", "-b:a", "192k", str(audio_wav),
            ]
            total_dur = vocal_slice_sec + 0.4
    elif tts_mp3 and tts_mp3.exists():
        cmd_a = [
            ffmpeg, "-y", "-threads", "2",
            "-i", str(tts_mp3),
            "-af", "aresample=44100,apad=pad_dur=0.6,alimiter=limit=0.944",
            "-t", f"{total_dur:.2f}", "-c:a", "aac", "-b:a", "160k", str(audio_wav),
        ]
    else:
        cmd_a = [
            ffmpeg, "-y", "-threads", "2",
            "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
            "-t", f"{total_dur:.2f}", "-c:a", "aac", "-b:a", "128k", str(audio_wav),
        ]

    ra = subprocess.run(cmd_a, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=120)
    if ra.returncode != 0 or not audio_wav.exists():
        print(f"[AUDIO RENDER ERR] {div}: {ra.stderr[-260:]}", flush=True)
        return None, 0.0

    # Composite video (loop Flow Vault 1080p MP4 smoothly, fallback to clean dark navy/ivory matte)
    bg_color = "0x101826" if div in ("TOM", "GBA") else ("0x1B2B24" if div == "HERO" else "0xF4EFE6")
    if bg_mp4 and bg_mp4.exists() and bg_mp4.stat().st_size > 50_000:
        cmd_v = [
            ffmpeg, "-y", "-threads", "2",
            "-stream_loop", "-1", "-i", str(bg_mp4),
            "-i", str(overlay_png),
            "-i", str(audio_wav),
            "-filter_complex",
            "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p[bg];"
            "[bg][1:v]overlay=0:0:shortest=0,format=yuv420p[vout]",
            "-map", "[vout]", "-map", "2:a",
            "-t", f"{min(total_dur, 58.0):.2f}",
            "-c:v", "libx264", "-preset", "fast", "-crf", "23", "-movflags", "+faststart",
            "-c:a", "copy", str(out_mp4),
        ]
    else:
        cmd_v = [
            ffmpeg, "-y", "-threads", "2",
            "-f", "lavfi", "-i", f"color=c={bg_color}:s=1080x1920:r=30",
            "-i", str(overlay_png),
            "-i", str(audio_wav),
            "-filter_complex", "[0:v][1:v]overlay=0:0,format=yuv420p[vout]",
            "-map", "[vout]", "-map", "2:a",
            "-t", f"{min(total_dur, 58.0):.2f}",
            "-c:v", "libx264", "-preset", "fast", "-crf", "23", "-movflags", "+faststart",
            "-c:a", "copy", str(out_mp4),
        ]

    rv = subprocess.run(cmd_v, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=240)
    try:
        overlay_png.unlink(missing_ok=True)
        audio_wav.unlink(missing_ok=True)
    except Exception:
        pass
    if rv.returncode != 0 or not out_mp4.exists() or out_mp4.stat().st_size < 20_000:
        print(f"[VIDEO RENDER ERR] {div}: {rv.stderr[-260:]}", flush=True)
        return None, 0.0
    return out_mp4, min(total_dur, 58.0)


def _refresh_yt_token(div: str) -> Optional[str]:
    div_u = div.upper()
    use_proj2 = div_u in ("HERO", "KFK")
    cid = (
        os.getenv(f"YT_CLIENT_ID_{div_u}", "").strip()
        or (os.getenv("YT_CLIENT_ID_2", "").strip() if use_proj2 else "")
        or os.getenv("YT_CLIENT_ID", "").strip()
    )
    csec = (
        os.getenv(f"YT_CLIENT_SECRET_{div_u}", "").strip()
        or (os.getenv("YT_CLIENT_SECRET_2", "").strip() if use_proj2 else "")
        or os.getenv("YT_CLIENT_SECRET", "").strip()
    )
    rtok = os.getenv(f"YT_REFRESH_TOKEN_{div_u}", "").strip()
    if not (cid and csec and rtok):
        return None
    data = urllib.parse.urlencode({
        "client_id": cid, "client_secret": csec, "refresh_token": rtok, "grant_type": "refresh_token",
    }).encode("utf-8")
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read().decode("utf-8")).get("access_token")
    except Exception as e:
        print(f"[YT OAUTH ERR {div}] {e}", flush=True)
        return None


def upload_youtube_short_v3(
    div: str,
    mp4_path: Path,
    title: str,
    desc: str,
    srt_text: str,
    pinned_comment: str,
    upload_srt: bool = True,
) -> Dict[str, Any]:
    """Official YouTube Data API v3 Resumable Short Upload + Official .srt Caption + UTM Either/Or Comment."""
    atok = _refresh_yt_token(div)
    if not atok:
        return {"ok": False, "skipped": "missing_yt_oauth_secrets"}

    # 1. Verify official channel against #5 Outbound Allowlist BEFORE uploading
    try:
        creq = urllib.request.Request(
            "https://www.googleapis.com/youtube/v3/channels?part=id&mine=true",
            headers={"Authorization": f"Bearer {atok}"},
        )
        with urllib.request.urlopen(creq, timeout=20) as cr:
            citems = json.loads(cr.read().decode("utf-8")).get("items") or []
        ch_id = str(citems[0]["id"]) if citems else ""
        assert_allowed_yt_channel(div, ch_id)
    except OutboundAllowlistError as oe:
        return {"ok": False, "blocked_by_allowlist": str(oe)}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:260]
        if e.code == 403 and "quotaExceeded" in body:
            return {"ok": False, "quota_exceeded": True}
        return {"ok": False, "http_error": e.code, "body": body}
    except Exception as e:
        return {"ok": False, "error": str(e)}

    # 2. Initiate Resumable Video Upload
    lang = DIV_LANG_MAP.get(div, "en")
    meta = {
        "snippet": {
            "title": (f"{title[:88]} #Shorts" if "#shorts" not in title.lower() else title[:98]),
            "description": desc[:4900],
            "categoryId": "24" if div == "HERO" else "27",
            "defaultLanguage": lang,
            "defaultAudioLanguage": lang,
        },
        "status": {
            "privacyStatus": "public",
            "selfDeclaredMadeForKids": False,
            **({"containsSyntheticMedia": True} if div == "HERO" else {}),
        },
    }
    raw_bytes = mp4_path.read_bytes()
    init_req = urllib.request.Request(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        data=json.dumps(meta, ensure_ascii=False).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"Bearer {atok}",
            "Content-Type": "application/json; charset=UTF-8",
            "X-Upload-Content-Length": str(len(raw_bytes)),
            "X-Upload-Content-Type": "video/mp4",
        },
    )
    try:
        with urllib.request.urlopen(init_req, timeout=30) as ir:
            upload_url = ir.headers.get("Location")
        if not upload_url:
            return {"ok": False, "error": "missing_resumable_location"}
        put_req = urllib.request.Request(
            upload_url,
            data=raw_bytes,
            method="PUT",
            headers={"Content-Type": "video/mp4", "Content-Length": str(len(raw_bytes))},
        )
        with urllib.request.urlopen(put_req, timeout=180) as pr:
            vid = json.loads(pr.read().decode("utf-8")).get("id", "")
        if not vid:
            return {"ok": False, "error": "empty_video_id"}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:260]
        if e.code == 403 and "quotaExceeded" in body:
            return {"ok": False, "quota_exceeded": True}
        return {"ok": False, "http_error": e.code, "body": body}
    except Exception as e:
        return {"ok": False, "error": str(e)}

    # 3. Upload Official .srt Caption (quota-budgeted: 400 units each; HERO always prioritized!)
    srt_ok = False
    if upload_srt:
        try:
            boundary = "----DreamCompanyCloudSRT2026"
            cmeta = json.dumps({"snippet": {"videoId": vid, "language": lang, "name": f"Official {lang.upper()}", "isDraft": False}})
            cbody = (
                f"--{boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n{cmeta}\r\n"
                f"--{boundary}\r\nContent-Type: application/octet-stream\r\n\r\n{srt_text}\r\n"
                f"--{boundary}--\r\n"
            ).encode("utf-8")
            sreq = urllib.request.Request(
                "https://www.googleapis.com/upload/youtube/v3/captions?part=snippet&uploadType=multipart",
                data=cbody,
                method="POST",
                headers={"Authorization": f"Bearer {atok}", "Content-Type": f"multipart/related; boundary={boundary}"},
            )
            with urllib.request.urlopen(sreq, timeout=30) as sr:
                srt_ok = sr.status in (200, 201)
        except Exception as se:
            print(f"  [YT SRT WARN {div} {vid}] {se}", flush=True)

    # 4. Post Top UTM + Either/Or Engagement Comment
    cmt_ok = False
    try:
        payload = json.dumps({
            "snippet": {"channelId": ch_id, "videoId": vid, "topLevelComment": {"snippet": {"textOriginal": pinned_comment}}}
        }, ensure_ascii=False).encode("utf-8")
        treq = urllib.request.Request(
            "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet",
            data=payload,
            method="POST",
            headers={"Authorization": f"Bearer {atok}", "Content-Type": "application/json"},
        )
        with urllib.request.urlopen(treq, timeout=25) as tr:
            cmt_ok = tr.status in (200, 201)
    except Exception as ce:
        print(f"  [YT COMMENT WARN {div} {vid}] {ce}", flush=True)

    return {"ok": True, "video_id": vid, "url": f"https://youtube.com/shorts/{vid}", "srt_ok": srt_ok, "comment_ok": cmt_ok}


def send_hq_telegram_alert(text: str) -> None:
    btok = os.getenv("HQ_TELEGRAM_BOT_TOKEN", "").strip()
    cid = os.getenv("HQ_TELEGRAM_CHAT_ID", "").strip()
    if not (btok and cid):
        return
    try:
        data = urllib.parse.urlencode({"chat_id": cid, "text": text[:3900]}).encode("utf-8")
        req = urllib.request.Request(f"https://api.telegram.org/bot{btok}/sendMessage", data=data, method="POST")
        urllib.request.urlopen(req, timeout=12).read()
    except Exception:
        pass


def publish_instagram_reel_via_r2(
    div: str,
    mp4_path: Path,
    caption: str,
    ascii_key: str,
    hist: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
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

    # Meta 4-Rule Safety: respect 12h automatic OAuthException cooldown & 8h same-account minimum gap!
    now_ts = time.time()
    if hist is not None:
        cool_until = float((hist.get("ig_cooldown_until") or {}).get(div, 0) or 0)
        if cool_until > now_ts:
            return {"ok": False, "skipped": f"meta_12h_cooldown_active(rem={int((cool_until - now_ts)/60)}m)"}
        last_pub = float((hist.get("ig_last_publish_ts") or {}).get(div, 0) or 0)
        if last_pub and (now_ts - last_pub) < 8 * 3600:
            return {"ok": False, "skipped": f"meta_8h_gap_guard(elapsed={int((now_ts - last_pub)/60)}m)"}

    # Live cross-system Meta cap guard (prevents local PC daemon + GHA from ever exceeding 2/day or <8h gap!)
    try:
        mreq = urllib.request.Request(
            f"https://graph.facebook.com/v21.0/{ig_uid}/media?fields=timestamp&limit=5&access_token={urllib.parse.quote(ig_tok)}"
        )
        with urllib.request.urlopen(mreq, timeout=15) as mr:
            recent = json.loads(mr.read().decode("utf-8")).get("data") or []
        now_utc = dt.datetime.now(dt.timezone.utc)
        last24 = 0
        for item in recent:
            ts_str = str(item.get("timestamp") or "")
            if not ts_str:
                continue
            pub_dt = dt.datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
            age_sec = (now_utc - pub_dt).total_seconds()
            if age_sec < 7.5 * 3600:
                return {"ok": False, "skipped": f"meta_live_8h_gap_guard(age={int(age_sec/60)}m)"}
            if age_sec < 24 * 3600:
                last24 += 1
        if last24 >= 2:
            return {"ok": False, "skipped": f"meta_live_2per24h_cap(count={last24})"}
    except Exception:
        pass

    video_url = stage_reel_to_cloudflare_r2(mp4_path, ascii_key)
    if not video_url:
        return {"ok": False, "error": "r2_staging_failed"}
    create_qs = urllib.parse.urlencode({
        "media_type": "REELS",
        "video_url": video_url,
        "caption": caption[:2100],
        "access_token": ig_tok,
    }).encode("utf-8")
    try:
        req = urllib.request.Request(f"https://graph.facebook.com/v21.0/{ig_uid}/media", data=create_qs, method="POST")
        with urllib.request.urlopen(req, timeout=30) as r:
            cid = json.loads(r.read().decode("utf-8")).get("id")
        if not cid:
            return {"ok": False, "error": "no_container_id"}
        # Poll container processing cleanly up to 90s instead of blind sleep
        status_code = "IN_PROGRESS"
        for _ in range(18):
            time.sleep(5)
            sreq = urllib.request.Request(
                f"https://graph.facebook.com/v21.0/{cid}?fields=status_code&access_token={urllib.parse.quote(ig_tok)}"
            )
            with urllib.request.urlopen(sreq, timeout=20) as sr:
                status_code = str(json.loads(sr.read().decode("utf-8")).get("status_code", ""))
            if status_code == "FINISHED":
                break
            if status_code in ("ERROR", "EXPIRED"):
                return {"ok": False, "error": f"ig_container_{status_code}"}
        if status_code != "FINISHED":
            return {"ok": False, "error": f"ig_container_timeout({status_code})"}
        pub_qs = urllib.parse.urlencode({"creation_id": cid, "access_token": ig_tok}).encode("utf-8")
        preq = urllib.request.Request(f"https://graph.facebook.com/v21.0/{ig_uid}/media_publish", data=pub_qs, method="POST")
        with urllib.request.urlopen(preq, timeout=30) as pr:
            mid = json.loads(pr.read().decode("utf-8")).get("id")
        if hist is not None:
            hist.setdefault("ig_last_publish_ts", {})[div] = time.time()
        return {"ok": True, "media_id": mid, "r2_url": video_url}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:260]
        if hist is not None and ("OAuthException" in body or e.code in (400, 401, 403)):
            hist.setdefault("ig_cooldown_until", {})[div] = time.time() + 12 * 3600
        return {"ok": False, "http_error": e.code, "body": body}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    dry_run = args.dry_run or (os.getenv("RUN_MODE", "daily").lower() == "dry_run")

    now_kst = dt.datetime.now(KST)
    today_str = now_kst.strftime("%Y-%m-%d")
    slot_id = "SLOT_A" if now_kst.hour < 14 else "SLOT_B"
    doy = now_kst.timetuple().tm_yday
    weekday = now_kst.weekday()
    hist = load_history()

    print(f"=== Dream Company 365-Day Cloud Promo Runner v3 ({today_str} {slot_id} KST, dry_run={dry_run}) ===", flush=True)
    print(f"Guardrails: max_daily_yt={MAX_DAILY_YT_UPLOADS} | lyria_weekly_cap={MAX_WEEKLY_LYRIA_CALLS} (can_call={can_call_lyria_this_week(hist)}) | hero_vocal_min={HERO_MIN_VOCAL_HIGHLIGHT_SEC}s | srt_gate=STRICT", flush=True)

    try:
        from ab_evolution_engine import load_matrix, select_stage12_ab_cell
        matrix_db = load_matrix(ROOT / "data" / "message_matrix_5div.json")
    except Exception:
        matrix_db = None
        select_stage12_ab_cell = None  # type: ignore

    flow_manifest_path, flow_manifest = load_flow_vault_manifest()
    flow_manifest_dirty = False

    # Build quota-safe idempotency sets:
    # - Single GCP project (10k/day): max 1 Short/div/day (5 x 1,600 = 8,000u)
    # - Dual GCP project (`YT_CLIENT_ID_2` set for HERO/KFK -> 20k/day): auto-unlocks 2 Shorts/div/day (10/day = SLOT_A + SLOT_B)!
    has_proj2 = bool(os.getenv("YT_CLIENT_ID_2", "").strip() and os.getenv("YT_CLIENT_SECRET_2", "").strip())
    max_yt_per_div = 2 if has_proj2 else 1
    yt_count_today: Dict[str, int] = {}
    yt_done_slot = set()
    for u in hist.get("uploads", []):
        if u.get("date") == today_str and u.get("yt_video_id"):
            d0 = str(u.get("div") or "").upper()
            yt_count_today[d0] = yt_count_today.get(d0, 0) + 1
            yt_done_slot.add((u.get("date"), u.get("slot", "SLOT_A"), d0))
    ig_done_slot = {
        (u.get("date"), u.get("slot", "SLOT_A"), u.get("div"))
        for u in hist.get("uploads", [])
        if u.get("ig_media_id")
    }
    # Rotate captions.insert (400 units each): HERO always gets .srt + 1 rotating peer (800 units total -> 9,055/10,000 safe cap!)
    non_hero_divs = ["TOM", "KFG", "GBA", "KFK"]
    srt_partner_today = non_hero_divs[doy % len(non_hero_divs)]

    day_arm = (doy + (1 if slot_id == "SLOT_B" else 0)) % 2
    planned = []
    alerts: List[str] = []
    for div in ["TOM", "KFG", "GBA", "HERO", "KFK"]:
        if len(planned) >= MAX_DAILY_YT_UPLOADS:
            break
        yt_already = (yt_count_today.get(div, 0) >= max_yt_per_div) or ((today_str, slot_id, div) in yt_done_slot)
        ig_already = (today_str, slot_id, div) in ig_done_slot
        if (not dry_run) and yt_already and ig_already:
            print(f"  [IDEMPOTENT SKIP] {div:4s} already published YT (today) & IG ({slot_id})", flush=True)
            continue
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

        utm_yt = build_utm_url(DIV_CONFIGS[div]["site"], "youtube", "shorts", f"{tid}_{today_str}_{slot_id}", content=utm_content)
        utm_ig = build_utm_url(DIV_CONFIGS[div]["site"], "instagram", "reels", f"{tid}_{today_str}_{slot_id}", content=utm_content)
        pinned_comment = build_pinned_comment_with_question(div, utm_yt, doy + (1 if slot_id == "SLOT_B" else 0))

        disclosure_footer = f"\n※ {pt['ai_disclosure_line']}\n" if div == "HERO" else ""
        desc = f"{title}\n\n{slide_body}\n\n{pinned_comment}{disclosure_footer}"
        either_or_q = pt["either_or_questions"][(doy + (1 if slot_id == "SLOT_B" else 0)) % len(pt["either_or_questions"])]
        srt_stub = (
            f"1\n00:00:00,000 --> 00:00:04,500\n{title}\n\n"
            f"2\n00:00:04,600 --> 00:00:18,000\n{slide_body[:130]}\n\n"
            f"3\n00:00:18,200 --> 00:00:28,000\n{either_or_q}\n"
        )

        # HERO Music-First Trot MV Mode: 0.0s immediate Baek Woon-ho singing (34s chorus/verse) + synced karaoke lyrics!
        hero_mv_song: Optional[Dict[str, Any]] = None
        hero_mv_slice: Optional[Dict[str, Any]] = None
        vocal_track: Optional[Path] = None
        vocal_highlight_sec = 0.0
        if div == "HERO":
            hero_cat = load_hero_trot_mv_catalog()
            if hero_cat and hero_cat.get("songs"):
                songs_list = hero_cat["songs"]
                rot_idx = doy * 2 + (1 if slot_id == "SLOT_B" else 0)
                hero_mv_song = songs_list[rot_idx % len(songs_list)]
                slices_list = hero_mv_song.get("slices") or []
                hero_mv_slice = slices_list[(rot_idx // len(songs_list)) % len(slices_list)] if slices_list else None
                if hero_mv_song and hero_mv_slice:
                    tid = f"hero_mv_{hero_mv_song['song_id']}_{hero_mv_slice['slice_id']}"
                    title = f"♪ 백운호 〈{hero_mv_song['title']}〉 {hero_mv_song['hook_headline']} #백운호 #트로트"[:95]
                    slide_body = f"마음을 노래하는 AI 가상 트로트 가수 『백운호』의 {hero_mv_song['badge']} 〈{hero_mv_song['title']}〉 ({hero_mv_slice['label']})"
                    either_or_q = str(hero_mv_song.get("either_or_question") or either_or_q)
                    utm_yt = build_utm_url(DIV_CONFIGS[div]["site"], "youtube", "shorts", f"{tid}_{today_str}_{slot_id}", content=f"HERO_MV_T{hero_mv_song['track_no']}")
                    utm_ig = build_utm_url(DIV_CONFIGS[div]["site"], "instagram", "reels", f"{tid}_{today_str}_{slot_id}", content=f"HERO_MV_T{hero_mv_song['track_no']}")
                    pinned_comment = (
                        f"🎵 백운호 〈{hero_mv_song['title']}〉 포함 6곡 완곡 무료 라디오 (가입 없음): {utm_yt}\n"
                        f"💐 매일 아침 카톡 무료 안부카드 만들기: https://paradise-hero.com/vip.html\n"
                        f"📸 공식 인스타그램 @paradise_hero1: https://www.instagram.com/paradise_hero1/\n"
                        f"💬 {either_or_q}"
                    )
                    desc = f"{title}\n\n{slide_body}\n\n{pinned_comment}{disclosure_footer}"
                    cues_srt = []
                    for ci, (a, b, l1, l2) in enumerate(hero_mv_slice.get("cues") or [], start=1):
                        cues_srt.append(f"{ci}\n{_fmt_srt_ts(float(a))} --> {_fmt_srt_ts(float(b))}\n{l1}\n{l2}\n")
                    srt_stub = "\n".join(cues_srt) or srt_stub
                    vocal_track = (
                        (HERO_VOCAL_POOL_DIR / hero_mv_song["filename"])
                        if (dry_run and (HERO_VOCAL_POOL_DIR / hero_mv_song["filename"]).exists())
                        else ensure_hero_vocal_track(doy, r2_key_override=hero_mv_song.get("r2_key"), filename_override=hero_mv_song.get("filename"))
                    )
                    vocal_highlight_sec = float(hero_mv_slice.get("duration_sec", 34.0)) if (vocal_track is not None or dry_run) else 0.0
            if vocal_track is None and not dry_run:
                vocal_track = ensure_hero_vocal_track(doy)
                vocal_highlight_sec = 14.0 if vocal_track is not None else 0.0
            elif vocal_highlight_sec == 0.0 and dry_run:
                vocal_track = select_hero_vocal_track(doy)
                vocal_highlight_sec = 34.0

        ok_txt, errs = check_text_gate(div, title, desc, srt_stub, vocal_highlight_sec=vocal_highlight_sec)
        if not ok_txt:
            print(f"[AUTO-GATE BLOCKED] {div} {tid}: {errs}", flush=True)
            alerts.append(f"{div} gate blocked: {errs}")
            continue

        hero_radio_day = (div == "HERO" and weekday in (1, 4))
        target_aspect = "9:16"
        vault_clip = select_flow_vault_clip(
            flow_manifest,
            div=div,
            stage=int(matrix_meta["stage"]),
            hook_type=str(matrix_meta["hook_type"]),
            aspect_ratio=target_aspect,
            ab_arm=str(matrix_meta["ab_arm"]),
            increment=(not dry_run),
        )
        bg_local_path: Optional[Path] = None
        flow_bg_meta: Dict[str, Any] = {"flow_clip_id": None, "flow_r2_key": None, "flow_resolution": None, "flow_source": "static_fallback"}
        if vault_clip:
            if not dry_run:
                flow_manifest_dirty = True
                local_p = Path(str(vault_clip.get("local_path", "")))
                if local_p.exists():
                    bg_local_path = local_p
                elif vault_clip.get("r2_key"):
                    bg_local_path = fetch_flow_vault_clip_from_r2(
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

        yt_res: Dict[str, Any] = {}
        ig_res: Dict[str, Any] = {}
        status = "dry_run_validated"
        rendered_dur = 0.0

        if not dry_run:
            out_mp4 = WORK_DIR / f"{div}_{today_str}_{slot_id}.mp4"
            tts_mp3: Optional[Path] = None
            if div == "HERO" and hero_mv_song and hero_mv_slice and vocal_track and vocal_track.exists():
                rendered_mp4, rendered_dur = render_hero_trot_music_short_mp4(
                    song=hero_mv_song,
                    sl=hero_mv_slice,
                    bg_clips=[bg_local_path] if bg_local_path else [],
                    song_mp3=vocal_track,
                    out_mp4=out_mp4,
                )
            else:
                spoken_script = f"{title}. {slide_body}. {either_or_q}"
                tts_mp3 = synthesize_edge_tts_mp3(spoken_script, pt["voice_id"], WORK_DIR / f"{div}_{today_str}_{slot_id}.tts.mp3")
                rendered_mp4, rendered_dur = render_cloud_short_mp4(
                    div=div,
                    bg_mp4=bg_local_path,
                    tts_mp3=tts_mp3,
                    vocal_mp3=vocal_track,
                    title=title,
                    slide_body=slide_body,
                    cta_line=either_or_q,
                    out_mp4=out_mp4,
                )
            if rendered_mp4 and rendered_mp4.exists():
                if yt_already:
                    yt_res = {"ok": False, "skipped": "yt_daily_1per_div_already_done"}
                else:
                    do_srt = (div == "HERO") or (div == srt_partner_today)
                    yt_res = upload_youtube_short_v3(div, rendered_mp4, title, desc, srt_stub, pinned_comment, upload_srt=do_srt)
                if ig_already:
                    ig_res = {"ok": False, "skipped": "ig_slot_already_done"}
                else:
                    ig_caption = f"{title}\n\n{slide_body}\n\n{either_or_q}\n\n🔗 {utm_ig}{disclosure_footer}"
                    ig_res = publish_instagram_reel_via_r2(
                        div,
                        rendered_mp4,
                        ig_caption,
                        f"reels/{today_str}/{div}_{slot_id}_{int(time.time())}.mp4",
                        hist=hist,
                    )
                try:
                    rendered_mp4.unlink(missing_ok=True)
                    if tts_mp3:
                        tts_mp3.unlink(missing_ok=True)
                except Exception:
                    pass
                yt_ok = bool(yt_res.get("ok"))
                ig_ok = bool(ig_res.get("ok"))
                if yt_ok and ig_ok:
                    status = "published_live_yt_ig"
                elif yt_ok or ig_ok:
                    status = "published_partial"
                elif yt_res.get("quota_exceeded"):
                    status = "yt_quota_deferred"
                else:
                    status = "queued_or_awaiting_secrets"
                if (not yt_ok) and (not yt_res.get("skipped")) and (not yt_res.get("quota_exceeded")):
                    alerts.append(f"YT {div}: {yt_res}")
                if (not ig_ok) and (not ig_res.get("skipped")):
                    alerts.append(f"IG {div}: {ig_res}")
            else:
                status = "render_failed"
                alerts.append(f"RENDER {div}: failed to compose mp4")

        planned.append({
            "div": div,
            "slot": slot_id,
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
            "rendered_duration_sec": round(rendered_dur, 2),
            "yt_video_id": yt_res.get("video_id"),
            "yt_srt_ok": yt_res.get("srt_ok"),
            "yt_comment_ok": yt_res.get("comment_ok"),
            "yt_status": "ok" if yt_res.get("ok") else (yt_res.get("skipped") or ("quota" if yt_res.get("quota_exceeded") else yt_res.get("error") or yt_res.get("http_error"))),
            "ig_media_id": ig_res.get("media_id"),
            "ig_status": "ok" if ig_res.get("ok") else (ig_res.get("skipped") or ig_res.get("error") or ig_res.get("http_error")),
            **matrix_meta,
            **flow_bg_meta,
            "utm_yt": utm_yt,
            "utm_ig": utm_ig,
            "hero_radio_day": hero_radio_day,
            "date": today_str,
            "status": status,
        })
        print(
            f"  [GATE PASS] {div:4s} | status={status} | flow_bg={flow_bg_meta['flow_clip_id']} "
            f"| yt={yt_res.get('video_id') or yt_res.get('skipped') or yt_res.get('http_error') or 'dry'} "
            f"| ig={ig_res.get('media_id') or ig_res.get('skipped') or ig_res.get('http_error') or 'dry'}"
            + (f" | vocal={vocal_highlight_sec:.0f}s({vocal_track.name if vocal_track else 'pool'})" if div == "HERO" else ""),
            flush=True,
        )

    hist["last_run_kst"] = now_kst.isoformat()
    if not dry_run:
        existing_keys = {(u.get("date"), u.get("slot", "SLOT_A"), u.get("div"), u.get("topic_id")) for u in hist.get("uploads", [])}
        for item in planned:
            k = (item["date"], item["slot"], item["div"], item["topic_id"])
            if k not in existing_keys:
                hist.setdefault("uploads", []).append(item)
        hist["uploads"] = hist["uploads"][-240:]
        save_history(hist)
        if flow_manifest_dirty and flow_manifest_path:
            flow_manifest["updated_at_kst"] = now_kst.strftime("%Y-%m-%d %H:%M:%S KST")
            flow_manifest_path.write_text(json.dumps(flow_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if alerts:
            send_hq_telegram_alert(f"[Cloud Promo Watchdog {today_str} {slot_id}]\n" + "\n".join(alerts[:6]))
    print(f"=== Completed Cloud Promo Runner ({len(planned)} processed slots, alerts={len(alerts)}) ===", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
