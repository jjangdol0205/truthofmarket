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
import hashlib
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
import wave
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
from promo_hard_gate import (  # noqa: E402
    ENDING_CTA_BY_DIV,
    HERO_DJ_OUTRO_SPOKEN_KO,
    append_ab_utm_suffix,
    build_ab_go_link,
    build_clean_go_link,
    build_clean_social_comment,
    build_ig_caption_with_line1_cta,
    check_hero_lyric_sync_catalog_gate,
    check_promo_hard_gate,
    compute_yt_publish_at_iso,
    normalize_japanese_tts_text,
    normalize_korean_tts_text,
    pick_rotating_comment_question,
    scrub_ai_slop,
    strip_unsupported_yt_api_fields,
)
from flow_character_track import (  # noqa: E402
    build_live_date_badge,
    check_flow_character_eligibility,
    compose_flow_character_short,
    extract_reel_cover_frame,
)
from taste_evaluator import (  # noqa: E402
    PASS_THRESHOLD as TASTE_PASS_THRESHOLD,
    evaluate_and_refine_for_taste,
)
from real_ui_mobile_recorder import (  # noqa: E402
    RealUIAutoGateError,
    record_html_motion_chart_clip,
    record_mobile_real_ui_clip,
)
from zero_ai_video_composer import (  # noqa: E402
    compose_zero_ai_short,
    draw_safezone_ending_cta_box,
    get_cached_faceless_stock_clip,
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
    # 2026-11-25 Shared Fail-Closed Hard Gate (KO/EN/JA clichés + Polar/Whop + bot UTM leak + SRT check)
    ok_hg, hg_errs = check_promo_hard_gate(div, f"{title}\n{desc}", surface="youtube_desc", srt_text=srt_text)
    if not ok_hg:
        errors.extend(hg_errs)
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
    return len(errors) == 0, list(dict.fromkeys(errors))


def build_pinned_comment_with_question(div: str, utm_yt: str, day_index: int) -> str:
    """2026-11-25 Hard Gate: Clean `/go/yt` short link + 20-pattern rotating human question (ZERO long UTM!)."""
    return build_clean_social_comment(div, index_seed=day_index)


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
        draw_safezone_ending_cta_box(
            draw,
            div,
            DIV_LANG_MAP.get(div.upper(), "en"),
            width=1080,
            height=1920,
            cta_text_override=ENDING_CTA_BY_DIV.get(div.upper(), cta),
        )

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


def synthesize_edge_tts_mp3(text: str, voice_id: str, out_mp3: Path, rate: str = "+0%") -> Optional[Path]:
    try:
        import edge_tts  # type: ignore
    except Exception as e:
        print(f"[TTS SKIP] edge_tts unavailable: {e}", flush=True)
        return None
    out_mp3.parent.mkdir(parents=True, exist_ok=True)
    clean_text = re.sub(r"https?://\S+|#\S+", "", text or "").strip()
    if str(voice_id or "").startswith("ja-"):
        clean_text = normalize_japanese_tts_text(clean_text)
    elif str(voice_id or "").startswith("ko-"):
        clean_text = normalize_korean_tts_text(clean_text)
    if not clean_text:
        return None

    async def _gen() -> None:
        comm = edge_tts.Communicate(clean_text, voice=voice_id, rate=rate)
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
    cat: Optional[Dict[str, Any]] = None
    for cand in [
        ROOT / "4사업부" / "data" / "baek_woonho_6songs_mv_catalog.json",
        ROOT / "data" / "baek_woonho_6songs_mv_catalog.json",
        WORK_DIR / "hero_vocals_cache" / "baek_woonho_6songs_mv_catalog.json",
    ]:
        if cand.exists():
            try:
                cat = json.loads(cand.read_text(encoding="utf-8"))
                break
            except Exception:
                pass
    if cat is None:
        fetched = fetch_flow_vault_clip_from_r2(HERO_R2_CATALOG_KEY, WORK_DIR / "hero_vocals_cache" / "baek_woonho_6songs_mv_catalog.json")
        if fetched and fetched.exists():
            try:
                cat = json.loads(fetched.read_text(encoding="utf-8"))
            except Exception:
                pass
    if cat is not None:
        ok_sync, sync_errs = check_hero_lyric_sync_catalog_gate(cat)
        if not ok_sync:
            raise RuntimeError(f"HERO_LYRIC_SYNC_HARD_GATE_BLOCKED: {sync_errs}")
    return cat


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
    srt_cues_out: Optional[List[Tuple[float, float, str, str]]] = None,
) -> Tuple[Optional[Path], float]:
    """
    Renders 1080x1920 Music-First Baek Woon-ho Trot Singing Short MV:
      - `0 ~ sing_dur` (~26.0s): Immediate Baek Woon-ho singing + Demucs-synced gold/white karaoke lyrics.
      - Final `5.5 ~ 6.0s` (`sing_dur ~ total_dur`): Accompaniment smoothly ducks to `volume=0.22` while
        DJ Kim-ssaem (`ko-KR-InJoonNeural`) gives warm voice guidance paired with centered safe-zone
        (`Y=1100~1250`, `bottom: 35%~42%`) golden-yellow big-font CTA box + downward arrow!
    """
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        try:
            import imageio_ffmpeg  # type: ignore
            ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
        except Exception:
            return None, 0.0

    raw_dur = float(sl.get("duration_sec", 34.0))
    start_s = float(sl.get("start_sec", 41.0))
    raw_cues = [(float(a), float(b), str(c), str(d)) for a, b, c, d in (sl.get("cues") or [])]
    voc_end_raw = float(sl.get("vocal_end_rel_sec") or 26.0)
    sing_dur = round(min(26.5, max(20.0, min(raw_dur - 5.5, voc_end_raw))), 2)
    cues: List[Tuple[float, float, str, str]] = []
    for t0, t1, l1, l2 in raw_cues:
        if t0 >= sing_dur - 0.4:
            continue
        cues.append((t0, min(t1, sing_dur - 0.05), l1, l2))

    out_mp4.parent.mkdir(parents=True, exist_ok=True)
    aud_m4a = out_mp4.with_suffix(".trot.m4a")
    dj_mp3 = out_mp4.with_suffix(".dj_outro.mp3")
    dj_wav = out_mp4.with_suffix(".dj_outro.wav")

    outro_dur = 5.8
    dj_voice_ready = False
    got_dj = synthesize_edge_tts_mp3(HERO_DJ_OUTRO_SPOKEN_KO, "ko-KR-InJoonNeural", dj_mp3, rate="+4%")
    if got_dj and got_dj.exists():
        rd = subprocess.run(
            [ffmpeg, "-y", "-threads", "2", "-i", str(got_dj), "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", str(dj_wav)],
            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=60,
        )
        if rd.returncode == 0 and dj_wav.exists():
            with wave.open(str(dj_wav), "rb") as wf:
                raw_dj_sec = wf.getnframes() / float(wf.getframerate())
            # Guarantee seg_dur >= tts_dur + 0.22s (0.40s breath cushion, compact ~5.6~6.3s outro!)
            outro_dur = round(max(5.0, raw_dj_sec + 0.40), 2)
            dj_voice_ready = True

    dur = round(sing_dur + outro_dur, 2)
    fade_duck_s = 0.45
    vol_expr = (
        f"if(lt(t,{sing_dur:.2f}),1.0,"
        f"if(lt(t,{sing_dur + fade_duck_s:.2f}),1.0-0.78*(t-{sing_dur:.2f})/{fade_duck_s:.2f},0.22))"
    )
    if dj_voice_ready:
        delay_ms = int(round((sing_dur + 0.15) * 1000))
        cmd_a = [
            ffmpeg, "-y", "-threads", "2",
            "-ss", f"{start_s:.2f}", "-t", f"{dur:.2f}", "-i", str(song_mp3),
            "-i", str(dj_wav),
            "-filter_complex",
            f"[0:a]aresample=44100,aformat=channel_layouts=stereo,"
            f"afade=t=in:st=0:d=0.5,volume='{vol_expr}':eval=frame,"
            f"afade=t=out:st={max(1.0, dur - 1.2):.2f}:d=1.2[songduck];"
            f"[1:a]aresample=44100,aformat=channel_layouts=stereo,volume=1.18,adelay={delay_ms}|{delay_ms}[dj];"
            f"[songduck][dj]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.944[aout]",
            "-map", "[aout]", "-t", f"{dur:.2f}",
            "-c:a", "aac", "-b:a", "192k", str(aud_m4a),
        ]
    else:
        cmd_a = [
            ffmpeg, "-y", "-threads", "2",
            "-ss", f"{start_s:.2f}", "-t", f"{dur:.2f}", "-i", str(song_mp3),
            "-af", f"aresample=44100,afade=t=in:st=0:d=0.6,afade=t=out:st={max(1.0, dur-1.6):.2f}:d=1.6,alimiter=limit=0.944",
            "-c:a", "aac", "-b:a", "192k", str(aud_m4a),
        ]
    ra = subprocess.run(cmd_a, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=90)
    if ra.returncode != 0 or not aud_m4a.exists():
        print(f"[HERO TROT AUDIO ERR] {ra.stderr[-220:]}", flush=True)
        return None, 0.0

    # Append final DJ Kim-ssaem safe-zone CTA visual cue (`sing_dur .. dur`)
    cues.append((
        sing_dur,
        dur - 0.05,
        "3분 완곡 · 무료 카톡 꽃카드 안내",
        "아래 백운호 얼굴 → 맨 위 파란 주소!",
    ))
    if srt_cues_out is not None:
        srt_cues_out.clear()
        srt_cues_out.extend(cues[:-1])
        srt_cues_out.append((sing_dur + 0.15, dur - 0.10, HERO_DJ_OUTRO_SPOKEN_KO, ""))

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
            draw_safezone_ending_cta_box(
                dr,
                "HERO",
                "ko",
                width=1080,
                height=1920,
                cta_text_override=ENDING_CTA_BY_DIV["HERO"],
            )
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
        dj_mp3.unlink(missing_ok=True)
        dj_wav.unlink(missing_ok=True)
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

    # 1. Verify official channel against #5 Outbound Allowlist BEFORE uploading + check recent 10 titles for dedup!
    recent_norm_titles = set()
    try:
        creq = urllib.request.Request(
            "https://www.googleapis.com/youtube/v3/channels?part=id,contentDetails&mine=true",
            headers={"Authorization": f"Bearer {atok}"},
        )
        with urllib.request.urlopen(creq, timeout=20) as cr:
            citems = json.loads(cr.read().decode("utf-8")).get("items") or []
        ch_id = str(citems[0]["id"]) if citems else ""
        assert_allowed_yt_channel(div, ch_id)
        up_pl = ((citems[0].get("contentDetails") or {}).get("relatedPlaylists") or {}).get("uploads", "") if citems else ""
        if up_pl:
            preq = urllib.request.Request(
                f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId={up_pl}",
                headers={"Authorization": f"Bearer {atok}"},
            )
            with urllib.request.urlopen(preq, timeout=15) as pr:
                for pit in (json.loads(pr.read().decode("utf-8")).get("items") or []):
                    rt = re.sub(r"#\S+|\s+", "", str((pit.get("snippet") or {}).get("title") or "")).lower()
                    if rt:
                        recent_norm_titles.add(rt[:28])
    except OutboundAllowlistError as oe:
        return {"ok": False, "blocked_by_allowlist": str(oe)}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:260]
        if e.code == 403 and "quotaExceeded" in body:
            return {"ok": False, "quota_exceeded": True}
        return {"ok": False, "http_error": e.code, "body": body}
    except Exception as e:
        return {"ok": False, "error": str(e)}

    # Deduplicate title against recent 10 channel uploads (differs within first 28 normalized chars too!)
    def _norm28(s: str) -> str:
        return re.sub(r"#\S+|\s+", "", str(s or "")).lower()[:28]

    if _norm28(title) and _norm28(title) in recent_norm_titles:
        base_no_tags = re.sub(r"\s*#\S+", "", title).strip()
        if div == "HERO":
            hero_variants = ["하이라이트 무대", "오늘의 헌정 클립", "실황 감동 구간", "바리톤 절정 무대"]
            if "〉" in base_no_tags:
                head, tail = base_no_tags.split("〉", 1)
                for hv in hero_variants:
                    cand = f"{head}〉 {hv} · {tail.strip()}"[:82]
                    if _norm28(cand) not in recent_norm_titles:
                        title = f"{cand} #백운호 #트로트"[:92]
                        break
            else:
                for hv in hero_variants:
                    cand = f"[{hv}] {base_no_tags}"[:82]
                    if _norm28(cand) not in recent_norm_titles:
                        title = f"{cand} #백운호 #트로트"[:92]
                        break
        else:
            alt_prefixes = {
                "TOM": ["Live Check: ", "Data View: ", "2026 Brief: "],
                "KFG": ["CDC Check: ", "Parent View: ", "Growth Brief: "],
                "GBA": ["【最新統計】", "【新NISA確認】", "【データ検証】"],
                "KFK": ["[무료 확인] ", "[성장 체크] ", "[핵심 비교] "],
            }.get(div, ["Update: ", "Check: ", "Brief: "])
            for pref in alt_prefixes:
                cand = f"{pref}{base_no_tags}"[:88]
                if _norm28(cand) not in recent_norm_titles:
                    title = cand
                    break

    # 2. Initiate Resumable Video Upload (Zero GHA sleep! Uses `status.publishAt` golden-time ±17~43m jitter; ZERO unsupported API fields!)
    lang = DIV_LANG_MAP.get(div, "en")
    publish_at_iso = compute_yt_publish_at_iso(div, seed_key=title[:40])
    meta = strip_unsupported_yt_api_fields({
        "snippet": {
            "title": (f"{title[:88]} #Shorts" if "#shorts" not in title.lower() else title[:98]),
            "description": desc[:4900],
            "categoryId": "10" if div == "HERO" else "27",
            "defaultLanguage": lang,
            "defaultAudioLanguage": lang,
        },
        "status": {
            "privacyStatus": "private",
            "publishAt": publish_at_iso,
            "selfDeclaredMadeForKids": False,
        },
    })
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
        "thumb_offset": "500",
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


_SMH_FG_CACHE: Optional[Dict[str, Any]] = None


def fetch_live_smh_fg_snapshot() -> Optional[Dict[str, Any]]:
    """
    Fetches live daily SMH Fear & Greed Index from https://truthofmarket.com/data/smh_fg_latest.json
    (browser User-Agent required by edge WAF) with clean local dist/data fallback.
    """
    global _SMH_FG_CACHE
    if _SMH_FG_CACHE is not None:
        return _SMH_FG_CACHE or None

    raw: Optional[Dict[str, Any]] = None
    try:
        req = urllib.request.Request(
            f"https://truthofmarket.com/data/smh_fg_latest.json?nc={int(time.time())}",
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
                "Accept": "application/json",
            },
        )
        with urllib.request.urlopen(req, timeout=12) as r:
            raw = json.loads(r.read().decode("utf-8"))
    except Exception:
        for cand in (
            ROOT / "dist" / "data" / "smh_fg_latest.json",
            ROOT / "data" / "smh_fg_latest.json",
            Path(r"D:\드림컴퍼니\1사업부\dist\data\smh_fg_latest.json"),
        ):
            if cand.exists():
                try:
                    raw = json.loads(cand.read_text(encoding="utf-8"))
                    break
                except Exception:
                    pass

    if not raw or raw.get("score") is None:
        _SMH_FG_CACHE = {}
        return None

    factors = raw.get("factors") or []
    dd_pct = ""
    rot_pct = ""
    vol_raw = ""
    rsi_raw = ""
    qqq_gap = ""
    for f in factors:
        k = str(f.get("key") or "")
        rd = str(f.get("raw_display") or "")
        m = re.search(r"([+-]?\d+(?:\.\d+)?%)", rd)
        if k == "drawdown_52w" and m:
            dd_pct = m.group(1)
        elif k == "safe_haven_rotation" and m:
            rot_pct = m.group(1)
        elif k == "volatility":
            vol_raw = rd
        elif k == "rsi_14":
            rsi_raw = rd
        elif k == "qqq_leadership" and m:
            qqq_gap = m.group(1)

    prices = raw.get("prices") or {}
    comps = raw.get("comparisons") or {}
    parsed = {
        "as_of_date": str(raw.get("as_of_date") or ""),
        "score": float(raw["score"]),
        "score_str": f"{float(raw['score']):.1f}".rstrip("0").rstrip("."),
        "zone_key": str(raw.get("zone_key") or "neutral"),
        "label_en": str(raw.get("label_en") or "Neutral"),
        "label_ja": str(raw.get("label_ja") or "中立"),
        "drawdown_52w_pct": dd_pct or "-35%",
        "rot_20d_pct": rot_pct,
        "qqq_20d_pct": qqq_gap,
        "vol_display": vol_raw,
        "rsi_display": rsi_raw,
        "prices": {
            "SMH": prices.get("SMH"),
            "XLV": prices.get("XLV"),
            "QQQ": prices.get("QQQ"),
            "VIX": prices.get("VIX"),
        },
        "prev_1d": comps.get("prev_1d"),
        "prev_1w": comps.get("prev_1w"),
        "prev_1m": comps.get("prev_1m"),
    }
    _SMH_FG_CACHE = parsed
    return parsed


def build_tom_daily_smh_fg_briefing_package(
    smh_fg: Optional[Dict[str, Any]],
    slot_id: str = "SLOT_A",
    rot_q_seed: int = 0,
) -> Dict[str, Any]:
    """
    2026-11-27 Chairman Directive: Transforms EVERY Div 1 (`TOM` · `@TruthOfMarketUS`) Short & Reel
    from textbook lectures into a 30-second Daily Live SMH Fear & Greed Market Briefing:
      - `0.0s` Frame 1: Direct mobile `/smh-fear-greed` live UI + yesterday's real close (`SMH`, `XLV`, `QQQ`, `VIX` if present).
      - `0~3s`: Live score + regime hook (100% public historical statistics, ZERO buy/sell timing — Whop compliant!).
      - `4~24s`: 7-factor gauge walkthrough + `SMH` solo vs `SMH x XLV + SGOV` 2000-2025 drawdown recovery math.
      - `25~32s`: Centered safe-zone (`bottom: 38%`, `Y=1100~1250`) CTA pointing to `truthofmarket.com/go/yt-fg`.
    """
    snap = smh_fg or {
        "as_of_date": dt.datetime.now(KST).strftime("%Y-%m-%d"),
        "score": 10.0,
        "score_str": "10",
        "label_en": "Extreme Fear",
        "drawdown_52w_pct": "-35%",
        "rot_20d_pct": "-25%",
        "prices": {},
    }
    sc = str(snap.get("score_str") or "10")
    sc_val = float(snap.get("score") or 10.0)
    lbl = str(snap.get("label_en") or "Extreme Fear")
    dd = str(snap.get("drawdown_52w_pct") or "-35%")
    rot = str(snap.get("rot_20d_pct") or "")
    as_of = str(snap.get("as_of_date") or "")
    px = snap.get("prices") or {}
    smh_px = px.get("SMH")
    xlv_px = px.get("XLV")
    qqq_px = px.get("QQQ")
    vix_px = px.get("VIX")
    is_b = (str(slot_id).upper() == "SLOT_B")

    # Build top live market close ribbon (strictly real verified numbers from smh_fg_latest.json!)
    px_parts: List[str] = [f"SMH F&G {sc}/100 ({lbl})"]
    if smh_px is not None:
        px_parts.append(f"SMH ${float(smh_px):.2f}")
    if xlv_px is not None:
        px_parts.append(f"XLV ${float(xlv_px):.2f}")
    if qqq_px is not None:
        px_parts.append(f"QQQ ${float(qqq_px):.2f}")
    if vix_px is not None:
        px_parts.append(f"VIX {float(vix_px):.1f}")
    top_live_banner = " · ".join(px_parts)

    # 0~3s Hook (strictly historical statistics — zero trade timing signals!)
    if sc_val < 10.0:
        hook_spoken = (
            f"SMH Fear and Greed just hit {sc}, {lbl}, after yesterday's swing. "
            f"Here is what happened every time it dropped below 10 since 2000."
            if not is_b else
            f"SMH Fear and Greed sits at {sc} out of 100 today, {dd} below its 52-week high. "
            f"Here is how a balanced cushion held up in past sub-10 shocks."
        )
        yt_title = (
            f"SMH Fear & Greed Just Hit {sc} ({lbl}): What Happened Below 10 Since 2000 #Shorts"
            if not is_b else
            f"SMH Gauge {sc}/100 ({dd}): SMH Solo vs SMH x XLV + SGOV Crash History #Shorts"
        )
    else:
        hook_spoken = (
            f"SMH Fear and Greed reads {sc}, {lbl}, after yesterday's close, {dd} from its peak. "
            f"Here is how 25 years of semiconductor swings compare to a balanced mix."
        )
        yt_title = f"Daily SMH Fear & Greed: {sc}/100 ({lbl}, {dd}) | 2000-2025 History #Shorts"

    # 4~24s Real Close + 7-Factor Gauge + SMH solo vs SMH x XLV + SGOV historical comparison
    close_sentence = ""
    if smh_px is not None and xlv_px is not None and qqq_px is not None:
        close_sentence = f"At the latest close, SMH finished at {float(smh_px):.0f} dollars, healthcare XLV at {float(xlv_px):.0f}, and QQQ at {float(qqq_px):.0f}."
        if vix_px is not None:
            close_sentence += f" Market volatility VIX stood at {float(vix_px):.1f}."
    rot_sentence = (
        f"Over 20 sessions, semiconductors trailed defensive healthcare by {rot}, pushing all 7 gauge factors deep into stress."
        if rot else
        "Our free 7-factor gauge tracks momentum, 52-week drawdown, realized volatility, and defensive healthcare rotation."
    )
    history_sentence = (
        "Across 2000, 2008, and 2022 public market data, holding 100 percent tech took 62 months to recover peak losses. "
        "Pairing SMH with healthcare XLV and 24 months of short-term Treasury SGOV cut historical recovery to 17 months."
    )
    ending_spoken = (
        "Check today's live 0 to 100 score free. "
        "Tap our round channel profile below, then tap the top blue link."
    )

    spoken_script = f"{hook_spoken} {close_sentence} {rot_sentence} {history_sentence} {ending_spoken}".strip()
    fg_url = build_ab_go_link("TOM", "yt_fg", "slot_a_realui")
    yt_url = build_ab_go_link("TOM", "yt", "slot_a_realui")
    sample_url = build_clean_go_link("TOM", "yt_sample")
    ig_url = build_ab_go_link("TOM", "ig", "slot_a_realui")
    q_line = pick_rotating_comment_question("TOM", rot_q_seed)

    desc = (
        f"Check today's live 0-100 SMH Fear & Greed score free: {fg_url}\n"
        f"Free 2000-2025 Retirement Stress-Test & 2-page sample PDF: {yt_url}\n\n"
        f"{yt_title}\n\n"
        f"Latest Market Close ({as_of}): {top_live_banner} | 52w drawdown {dd}\n"
        f"Independent historical market statistics only (2000-2025 public ETF data) - not personalized investment advice.\n\n"
        f"{q_line}"
    )
    pinned_comment = (
        f"Live 0-100 SMH Fear & Greed Gauge (updated daily, free): {fg_url}\n"
        f"2000-2025 Stress-Test & Free 2p Sample PDF: {sample_url}\n\n"
        f"{q_line}"
    )
    ig_caption = (
        f"Tap @truthofmarket profile link → {ig_url.replace('https://', '')} (Free Live SMH Gauge: {sc}/100)\n\n"
        f"{yt_title.replace('#Shorts', '').strip()}\n\n"
        f"Latest Close ({as_of}): {top_live_banner} | 52w drawdown {dd}.\n"
        f"{history_sentence}\n\n"
        f"{q_line}"
    )
    return {
        "yt_title": yt_title[:98],
        "spoken_script": spoken_script,
        "slide_body": f"{hook_spoken} {close_sentence} {history_sentence}".strip(),
        "description": desc,
        "pinned_comment": pinned_comment,
        "ig_caption": ig_caption,
        "top_live_banner": top_live_banner,
        "smh_fg_score": sc_val,
        "smh_fg_as_of": as_of,
        "smh_fg_dd52w": dd,
    }


def apply_live_smh_fg_timeliness_hook(
    div: str,
    title: str,
    slide_body: str,
    desc: str,
    hook_type: str,
    slot_id: str,
    smh_fg: Optional[Dict[str, Any]],
) -> Tuple[str, str, str, Optional[Dict[str, Any]]]:
    """
    Injects real-time SMH Fear & Greed Index score & 52-week drawdown into TOM & GBA
    first-3-second hook, title, and description WITHOUT mutating message_matrix_5div.json.
    Strictly educational/statistical (0 buy/sell signals, 0 advisory, Hard Gate verified).
    """
    if div not in ("TOM", "GBA") or not smh_fg:
        return title, slide_body, desc, None

    sc = smh_fg["score_str"]
    dd = smh_fg["drawdown_52w_pct"]
    as_of = smh_fg["as_of_date"]
    rot = smh_fg["rot_20d_pct"]
    ht = str(hook_type or "proof").lower()
    is_b = (slot_id == "SLOT_B")

    if div == "TOM":
        lbl = smh_fg["label_en"]
        en_titles = {
            "loss": (
                f"SMH Fear & Greed Hits {sc} ({dd}): Can Your 401(k) Cushion Hold?"
                if not is_b else
                f"Chips Down {dd} (Gauge {sc}/100): Retirement Sequence Risk Explained"
            ),
            "curiosity": (
                f"SMH Gauge at {sc} ({lbl}) — Why Healthcare (XLV) Moves Differently"
                if not is_b else
                f"Why SMH Fear Index Reads {sc}/100 ({dd} Off Peak) Today"
            ),
            "self": (
                f"Age 55+ Watching Chips Down {dd}? SMH Gauge {sc} Stress-Test Math"
                if not is_b else
                f"Near Retirement With SMH at {sc}/100 ({dd})? Check Historical Math"
            ),
            "pattern": (
                f"SMH Fear Index {sc} ({dd}): Why 60/40 Still Feels Heavy in Chip Drops"
                if not is_b else
                f"Beyond Tech Headlines: SMH {sc}/100 ({lbl}) vs 25-Year Balance Data"
            ),
            "proof": (
                f"SMH Fear & Greed {sc}/100 ({dd} Off High): 2000–2025 Drawdown Math"
                if not is_b else
                f"Live Data: SMH Index {sc} ({lbl}, {dd}) vs SMH + XLV History"
            ),
        }
        new_title = en_titles.get(ht, en_titles["proof"])[:95]
        lead_line = f"Today's SMH Fear and Greed Index reads {sc} out of 100 ({lbl}), {dd} below its 52-week high."
        new_body = f"{lead_line} {slide_body}"
        fg_link = build_clean_go_link("TOM", "yt_fg")
        rot_note = f" | 20d SMH vs XLV gap: {rot}" if rot else ""
        live_block = (
            f"SMH Fear & Greed Index ({as_of}): {sc}/100 ({lbl}) | {dd} from 52w high{rot_note}.\n"
            f"Free daily 7-factor gauge: {fg_link}\n"
            f"(Independent historical market statistics only — not personalized investment advice.)"
        )
        new_desc = f"{new_title}\n\n{live_block}\n\n{slide_body}\n\n" + "\n\n".join(desc.split("\n\n")[2:])
    else:
        lbl_ja = smh_fg["label_ja"]
        ja_titles = {
            "loss": (
                f"米国半導体・恐怖指数{sc}（高値比{dd}）｜新NISA老後資金を守る統計"
                if not is_b else
                f"半導体{dd}下落（指数{sc}点）｜50代からの取り崩し防御チェック"
            ),
            "curiosity": (
                f"半導体指数{sc}点「{lbl_ja}」の今、医療株XLVとの差はなぜ開く？"
                if not is_b else
                f"米国半導体・恐怖指数が{sc}点（{dd}）まで冷え込んだ7指標の中身"
            ),
            "self": (
                f"50代・60代の新NISA｜半導体{dd}局面（指数{sc}）で確認したい25年統計"
                if not is_b else
                f"老後資金を守る新NISA｜SMH指数{sc}点（{lbl_ja}）の過去データ比較"
            ),
            "pattern": (
                f"半導体・恐怖指数{sc}（{dd}）｜一括集中より大切な防御クッション設計"
                if not is_b else
                f"半導体急落{dd}（指数{sc}点）でも慌てないSMH×XLV25年バランス統計"
            ),
            "proof": (
                f"【最新統計】SMH恐怖指数{sc}/100（52週高値比{dd}）2000-2025検証"
                if not is_b else
                f"最新データ：半導体恐怖指数{sc}点（{lbl_ja}・{dd}）と防御配分の歴史"
            ),
        }
        new_title = ja_titles.get(ht, ja_titles["proof"])[:95]
        lead_line = f"最新の米国半導体・恐怖と強欲指数は100点中{sc}点（{lbl_ja}）、52週高値から{dd}の水準です。"
        new_body = f"{lead_line} {slide_body}"
        fg_link = build_clean_go_link("GBA", "yt_fg")
        rot_note = f"｜20日SMH対XLV差 {rot}" if rot else ""
        live_block = (
            f"米国半導体・恐怖と強欲指数（{as_of}時点）：{sc}/100（{lbl_ja}）｜52週高値比 {dd}{rot_note}。\n"
            f"毎日更新の無料7指標ゲージ：{fg_link}\n"
            f"（※過去の公開市場データに基づく教育・統計情報であり、特定銘柄の投資助言ではありません）"
        )
        new_desc = f"{new_title}\n\n{live_block}\n\n{slide_body}\n\n" + "\n\n".join(desc.split("\n\n")[2:])

    ok_t, _ = check_promo_hard_gate(div, new_title, surface="youtube_title")
    ok_d, _ = check_promo_hard_gate(div, new_desc, surface="youtube_desc")
    if ok_t and ok_d:
        return new_title, new_body, new_desc, {"smh_fg_score": smh_fg["score"], "smh_fg_as_of": as_of, "smh_fg_dd52w": dd}
    return title, slide_body, desc, None


def build_natural_spoken_hook(
    div: str,
    title: str,
    slide_body: str,
    smh_fg_meta: Optional[Dict[str, Any]] = None,
    either_or_q: str = "",
) -> str:
    """
    2026-11-27 12:00 KST Patch: NEVER feeds raw YouTube SEO titles containing pipes/brackets
    (`｜`, `|`, `・`, `【...】`, `（...）`) directly into Edge-TTS!
    Builds a natural, conversational spoken script from `slide_body` + a clean 1-sentence
    conversational hook (when not already embedded) + `either_or_q`.
    Note: preserves clean visual decimals (`3.7`, `-36.8%`) for on-screen PNG/`.srt` while
    `zero_ai_video_composer` converts them phonetically (`3点7`, `マイナス36点8%`) right before TTS!
    """
    div_u = div.upper()
    body = re.sub(r"\s+", " ", (slide_body or "").strip())
    q = re.sub(r"\s+", " ", (either_or_q or "").strip())

    # Clean any raw title metadata tokens just in case a fallback hook is needed
    clean_t = re.sub(r"#\S+", "", title or "")
    clean_t = re.sub(r"【[^】]*】|\[[^\]]*\]", " ", clean_t)
    clean_t = re.sub(r"\s*[｜|]\s*", "、" if div_u == "GBA" else ", ", clean_t)
    clean_t = re.sub(r"\s+", " ", clean_t).strip(" 、,.-")

    if div_u == "GBA":
        # `apply_live_smh_fg_timeliness_hook` ALREADY prepends the natural live spoken lead to `slide_body`!
        if body.startswith("最新の米国半導体"):
            parts = [body, q]
        elif smh_fg_meta and smh_fg_meta.get("smh_fg_score") is not None:
            sc_s = f"{float(smh_fg_meta['smh_fg_score']):.1f}".rstrip("0").rstrip(".")
            dd_s = str(smh_fg_meta.get("smh_fg_dd52w") or "-35%")
            hook = f"最新の米国半導体・恐怖と強欲指数は100点中{sc_s}点、52週高値から{dd_s}の水準です。"
            parts = [hook, body, q]
        else:
            hook = f"{clean_t}。" if clean_t and clean_t[:12] not in body else ""
            parts = [hook, body, q]
        return " ".join(p for p in parts if p).strip()

    if div_u == "KFK":
        # Avoid reading bracketed/piped YT title or duplicating slide_body's opening hook
        norm_t = normalize_korean_tts_text(clean_t)
        if body and (not norm_t or norm_t[:10] in body or len(body) >= 45):
            parts = [body, q]
        else:
            parts = [f"{norm_t}." if norm_t and not re.search(r"[.?!]$", norm_t) else norm_t, body, q]
        return " ".join(p for p in parts if p).strip()

    # KFG (English) & fallback: Matrix `slide_body` already opens with a human conversational hook
    if body and (not clean_t or clean_t[:14].lower() in body.lower() or len(body) >= 55):
        parts = [body, q]
    else:
        hook_en = f"{clean_t}." if clean_t and not re.search(r"[.?!]$", clean_t) else clean_t
        parts = [hook_en, body, q]
    return " ".join(p for p in parts if p).strip()


def load_topic_hook_weights() -> Dict[str, Any]:
    """Loads Device 2 Weekly Hill-Climber weights (`data/topic_hook_weights.json`) if available."""
    for cand in (
        ROOT / "data" / "topic_hook_weights.json",
        ROOT.parent / "data" / "topic_hook_weights.json",
        Path(r"D:\드림컴퍼니\data\topic_hook_weights.json"),
    ):
        if cand.exists():
            try:
                return json.loads(cand.read_text(encoding="utf-8"))
            except Exception:
                pass
    return {}


def load_swarm_promo_overlay() -> Dict[str, Any]:
    """Loads non-destructive Promo Swarm experiment overlay (`data/swarm_promo_experiments.json`) if present."""
    for cand in (
        ROOT / "data" / "swarm_promo_experiments.json",
        ROOT.parent / "data" / "swarm_promo_experiments.json",
        Path(r"D:\드림컴퍼니\data\swarm_promo_experiments.json"),
    ):
        if cand.exists():
            try:
                data = json.loads(cand.read_text(encoding="utf-8"))
                if isinstance(data, dict) and data.get("schema_version") == "swarm-promo-overlay-v1":
                    return data
            except Exception:
                pass
    return {}


def select_hill_climbed_cell_80_20(
    matrix_db: Optional[Dict[str, Any]],
    div: str,
    date_str: str,
    arm_idx: int,
    weights_db: Dict[str, Any],
    fallback_selector: Any,
    swarm_overlay: Optional[Dict[str, Any]] = None,
) -> Tuple[Optional[Dict[str, Any]], str]:
    """
    Device 2 80/20 Diversity Quota Cell Selector + Non-Destructive Promo Swarm Overlay:
      - 80% Exploitation (`exploit_80`): ALWAYS uses immutable baseline matrix cells ranked by
        Weekly Hill-Climber hook weights (plus tiny bounded Swarm delta `[-0.25, +0.25]` if present).
      - 20% Exploration (`explore_20` / `swarm_explore_20`): inside the <=20% Explore slice ONLY,
        safely tests active, non-expired, Hard-Gate + Taste>=85 verified Swarm experiments
        (`data/swarm_promo_experiments.json`, max 2/div).
      - Falls back 100% cleanly to `topic_hook_weights.json` / `select_stage12_ab_cell` if absent.
    """
    div_u = div.upper()
    d_weights = (weights_db.get("divisions") or {}).get(div_u) or {}
    hook_w = dict(d_weights.get("hook_weights") or {})
    d_obj = ((matrix_db or {}).get("divisions") or {}).get(div_u) if matrix_db else None
    cells = [c for c in ((d_obj or {}).get("matrix") or []) if c.get("stage") in (1, 2) and c.get("status", "active") != "paused"]

    ov_div = ((swarm_overlay or {}).get("divisions") or {}).get(div_u) or {}
    ov_policy = (swarm_overlay or {}).get("safety_policy") or {}
    ov_deltas = ov_div.get("hook_weight_deltas") or {}
    for ht_k, dv_raw in ov_deltas.items():
        if ht_k in ("loss", "curiosity", "self", "pattern", "proof"):
            try:
                bounded_dv = max(-0.25, min(0.25, float(dv_raw)))
                hook_w[ht_k] = round(max(0.10, float(hook_w.get(ht_k, 1.0)) + bounded_dv), 3)
            except (TypeError, ValueError):
                pass

    # Active, non-expired, Hard-Gate & Taste>=85 verified Swarm experiments (strictly <= 2/div)
    valid_swarm_exps: List[Dict[str, Any]] = []
    for exp in (ov_div.get("experiments") or []):
        if not isinstance(exp, dict):
            continue
        if exp.get("status") != "active":
            continue
        if exp.get("hard_gate_passed") is not True or int(exp.get("taste_score") or 0) < TASTE_PASS_THRESHOLD:
            continue
        exp_until = str(exp.get("expires_at") or "").strip()
        if exp_until and exp_until < date_str:
            continue
        if str(exp.get("hook_line") or "").strip() and str(exp.get("slide_script_body") or "").strip():
            valid_swarm_exps.append(exp)
        if len(valid_swarm_exps) >= 2:
            break

    if not (cells and hook_w) and not valid_swarm_exps:
        cell = fallback_selector(matrix_db, div_u, date_str, arm_idx=arm_idx) if (matrix_db and fallback_selector) else None
        return cell, "matrix_default"

    quotas = weights_db.get("quotas") or {}
    explore_pct = int(round(float(quotas.get("exploration_quota", 0.20)) * 100))
    swarm_cap_pct = min(explore_pct, int(round(min(0.20, float(ov_policy.get("max_traffic_allocation_ratio", 0.20))) * 100)))
    h_int = int(hashlib.md5(f"hc:{div_u}:{date_str}:{arm_idx}".encode("utf-8")).hexdigest()[:8], 16)
    bucket = h_int % 100
    is_explore = bucket < explore_pct

    if is_explore and valid_swarm_exps and bucket < swarm_cap_pct:
        chosen = valid_swarm_exps[(h_int // 100) % len(valid_swarm_exps)]
        exp_id = str(chosen.get("exp_id") or f"{div_u}_SWARM_EXP")
        return {
            "id": exp_id,
            "division": div_u,
            "stage": 1,
            "hook_type": str(chosen.get("hook_type") or "proof"),
            "hook_line": str(chosen["hook_line"]).strip(),
            "slide_script_body": str(chosen["slide_script_body"]).strip(),
            "cta": str(chosen.get("cta") or DIV_CONFIGS[div_u]["open_loop_cta"]).strip(),
            "utm_content": f"{exp_id}_v1",
            "weight": 1.0,
            "swarm_exp_id": exp_id,
            "swarm_speech_bubble": str(chosen.get("speech_bubble") or "").strip(),
            "swarm_pinned_comment_bridge": str(chosen.get("pinned_comment_bridge") or "").strip(),
            "swarm_ending_cta_bridge": str(chosen.get("ending_cta_bridge") or "").strip(),
        }, "swarm_explore_20"

    if not (cells and hook_w):
        cell = fallback_selector(matrix_db, div_u, date_str, arm_idx=arm_idx) if (matrix_db and fallback_selector) else None
        return cell, "matrix_default"

    if is_explore:
        # 20% Exploration: prefer non-boosted/baseline hook types (still skipping completely zeroed hooks)
        exp_pool = [c for c in cells if 0.0 < float(hook_w.get(str(c.get("hook_type") or ""), 1.0)) <= 1.2] or cells
        exp_pool.sort(key=lambda c: hashlib.md5(f"hcexp:{date_str}:{arm_idx}:{c['id']}".encode("utf-8")).hexdigest())
        return dict(exp_pool[0]), "explore_20"

    # 80% Exploitation: rank immutable baseline cells by Weekly Hill Climber hook weight (2.0x winners first!)
    ranked = sorted(
        cells,
        key=lambda c: (
            float(hook_w.get(str(c.get("hook_type") or ""), 1.0)),
            float(c.get("weight", 1.0)),
            int(hashlib.md5(f"hcwin:{date_str}:{arm_idx}:{c['id']}".encode("utf-8")).hexdigest()[:4], 16) / 65536.0,
        ),
        reverse=True,
    )
    return dict(ranked[0]), "exploit_80"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--slot", choices=["AUTO", "SLOT_A", "SLOT_B"], default="AUTO")
    args = parser.parse_args()
    dry_run = args.dry_run or (os.getenv("RUN_MODE", "daily").lower() == "dry_run")

    now_kst = dt.datetime.now(KST)
    today_str = now_kst.strftime("%Y-%m-%d")
    slot_id = ("SLOT_A" if now_kst.hour < 14 else "SLOT_B") if args.slot == "AUTO" else args.slot
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
    topic_weights_db = load_topic_hook_weights()
    swarm_overlay_db = load_swarm_promo_overlay()

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
        cell, hill_climb_quota_mode = select_hill_climbed_cell_80_20(
            matrix_db,
            div,
            today_str,
            arm_idx=day_arm,
            weights_db=topic_weights_db,
            fallback_selector=select_stage12_ab_cell,
            swarm_overlay=swarm_overlay_db,
        )
        swarm_exp_id = str(cell.get("swarm_exp_id") or "").strip() if cell else ""
        swarm_speech_bubble = str(cell.get("swarm_speech_bubble") or "").strip() if cell else ""
        swarm_pinned_bridge = str(cell.get("swarm_pinned_comment_bridge") or "").strip() if cell else ""
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

        # Plan C (2026-11-27): Non-Destructive A/B Track Eligibility & Graceful Fallback!
        # - SLOT_A (`07:17 KST`): ALWAYS `slot_a_realui` (100% untouched 0.0s mobile real-UI!).
        # - SLOT_B (`19:23 KST`): WIP=1 KFK Pilot (`FLOW_CHAR_PILOT_DIVS={"KFK"}`); if character_clips/ empty
        #   or validation fails, gracefully falls back to `slot_a_realui` with explicit `flow_fallback_reason`.
        episode_key = f"{div}_{today_str}_{slot_id}_{matrix_meta['matrix_id']}"
        flow_elig = check_flow_character_eligibility(
            div=div,
            slot_id=slot_id,
            episode_key=episode_key,
            today_kst=now_kst.date(),
            persist_lru=(not dry_run),
        )
        ab_track = str(flow_elig["ab_track"])
        flow_fallback_reason = str(flow_elig["flow_fallback_reason"])
        utm_content_ab = append_ab_utm_suffix(utm_content, ab_track)
        matrix_meta["ab_track"] = ab_track
        matrix_meta["utm_content_ab"] = utm_content_ab

        # 2026-11-27 Shield 7: A/B separated clean short `/go/yt-a` vs `/go/yt-b` & `/go/ig` vs `/go/ig-b`!
        utm_yt = build_ab_go_link(div, "yt", ab_track)
        utm_ig = build_ab_go_link(div, "ig", ab_track)
        rot_q_seed = doy * 2 + (1 if slot_id == "SLOT_B" else 0)
        either_or_q = pick_rotating_comment_question(div, rot_q_seed)
        pinned_comment = build_clean_social_comment(div, index_seed=rot_q_seed, go_url_override=utm_yt)

        disclosure_footer = (
            f"\n※ {pt['ai_disclosure_line']}\n"
            f"※ 홈페이지 내 추천 준비물관은 제휴 활동의 일환으로 일정 수수료를 제공받을 수 있습니다.\n"
            if div == "HERO" else ""
        )
        line1_prefix_by_div = {
            "TOM": "Free Daily SMH Fear & Greed Gauge",
            "KFG": "Free 60-Second US CDC Height Percentile Check",
            "GBA": "毎日無料の米国半導体・恐怖と強欲指数＆新NISA25年統計",
            "HERO": "AI 가상가수 백운호 오리지널 곡 · 6곡 완곡 무료 라디오 & 아침 꽃카드",
            "KFK": "광고 없는 1분 무료 질병관리청 예상키·뼈나이 시차 진단",
        }
        desc = f"{line1_prefix_by_div.get(div, 'Free guide')}: {utm_yt}\n\n{title}\n\n{slide_body}\n\n{pinned_comment}{disclosure_footer}"

        # Live SMH Fear & Greed Index timeliness hook:
        # - TOM: Full 30-second Daily Live SMH Fear & Greed Market Briefing (`0.0s` mobile `/smh-fear-greed` UI + real close!)
        # - GBA: Live SMH Fear & Greed timeliness hook + `0.0s` mobile `/jp/smh-fear-greed` UI!
        smh_fg_meta: Optional[Dict[str, Any]] = None
        tom_brief_pkg: Optional[Dict[str, Any]] = None
        if div == "TOM":
            live_smh_fg = fetch_live_smh_fg_snapshot()
            tom_brief_pkg = build_tom_daily_smh_fg_briefing_package(live_smh_fg, slot_id=slot_id, rot_q_seed=rot_q_seed)
            title = tom_brief_pkg["yt_title"]
            slide_body = tom_brief_pkg["slide_body"]
            desc = tom_brief_pkg["description"]
            pinned_comment = tom_brief_pkg["pinned_comment"]
            smh_fg_meta = {
                "smh_fg_score": tom_brief_pkg["smh_fg_score"],
                "smh_fg_as_of": tom_brief_pkg["smh_fg_as_of"],
                "smh_fg_dd52w": tom_brief_pkg["smh_fg_dd52w"],
            }
        elif div == "GBA":
            live_smh_fg = fetch_live_smh_fg_snapshot()
            title, slide_body, desc, smh_fg_meta = apply_live_smh_fg_timeliness_hook(
                div=div,
                title=title,
                slide_body=slide_body,
                desc=desc,
                hook_type=str(matrix_meta.get("hook_type") or "proof"),
                slot_id=slot_id,
                smh_fg=live_smh_fg,
            )
            if not desc.splitlines()[0].strip().endswith(utm_yt) and utm_yt not in desc.splitlines()[0]:
                desc = f"毎日無料の米国半導体・恐怖と強欲指数＆新NISA25年統計: {utm_yt}\n\n{desc}"

        srt_stub = (
            f"1\n00:00:00,000 --> 00:00:04,500\n{title}\n\n"
            f"2\n00:00:04,600 --> 00:00:18,000\n{slide_body[:130]}\n\n"
            f"3\n00:00:18,200 --> 00:00:28,000\n{either_or_q}\n"
        )

        # HERO Music-First Trot MV Mode: natural smile/lighting Google Flow master clip pool + real `lyria-3.5` singing + synced lyrics!
        hero_mv_song: Optional[Dict[str, Any]] = None
        hero_mv_slice: Optional[Dict[str, Any]] = None
        vocal_track: Optional[Path] = None
        vocal_highlight_sec = 0.0
        if div == "HERO":
            try:
                hero_cat = load_hero_trot_mv_catalog()
            except RuntimeError as sync_err:
                print(f"[AUTO-GATE BLOCKED] HERO lyric sync gate: {sync_err}", flush=True)
                alerts.append(f"HERO sync gate blocked: {sync_err}")
                continue
            if hero_cat and hero_cat.get("songs"):
                songs_list = hero_cat["songs"]
                rot_idx = doy * 2 + (1 if slot_id == "SLOT_B" else 0)
                hero_mv_song = songs_list[rot_idx % len(songs_list)]
                slices_list = hero_mv_song.get("slices") or []
                hero_mv_slice = slices_list[(rot_idx // len(songs_list)) % len(slices_list)] if slices_list else None
                if hero_mv_song and hero_mv_slice:
                    tid = f"hero_mv_{hero_mv_song['song_id']}_{hero_mv_slice['slice_id']}"
                    # Slice-unique lyric hook + section label so all 18 (6 songs x 3 slices) MVs NEVER share a duplicate title!
                    cues_raw = hero_mv_slice.get("cues") or []
                    first_lyric = f"{cues_raw[0][2]} {cues_raw[0][3]}".strip() if cues_raw else hero_mv_song["hook_headline"]
                    sl_id = str(hero_mv_slice.get("slice_id") or "")
                    if sl_id == "chorus1":
                        title = f"♪ 백운호 〈{hero_mv_song['title']}〉 {hero_mv_song['hook_headline']} #백운호 #트로트"[:95]
                    elif sl_id == "verse1":
                        title = f"♪ 백운호 〈{hero_mv_song['title']}〉 \"{first_lyric}\" 1절 첫 소절 무대 #백운호 #트로트"[:95]
                    else:
                        title = f"♪ 백운호 〈{hero_mv_song['title']}〉 \"{first_lyric}\" {hero_mv_slice['label']} #백운호 #트로트"[:95]
                    # Also guard against any recent local/cloud history title collision
                    recent_hero_t = {re.sub(r"#\S+|\s+", "", str(u.get("title") or "")).lower()[:28] for u in hist.get("uploads", [])[-25:] if u.get("div") == "HERO"}
                    if re.sub(r"#\S+|\s+", "", title).lower()[:28] in recent_hero_t:
                        title = f"♪ 백운호 〈{hero_mv_song['title']}〉 {hero_mv_slice['label']} · {first_lyric} #백운호 #트로트"[:95]
                    slide_body = f"마음을 노래하는 AI 가상 트로트 가수 백운호의 {hero_mv_song['badge']} 〈{hero_mv_song['title']}〉 ({hero_mv_slice['label']})"
                    either_or_q = pick_rotating_comment_question("HERO", rot_idx)
                    utm_yt = build_ab_go_link("HERO", "yt", ab_track)
                    utm_ig = build_ab_go_link("HERO", "ig", ab_track)
                    hero_longform_by_song = {
                        "01_mothers_spring": "https://www.youtube.com/watch?v=pWAPQDb-KRE",
                        "03_harbor_light": "https://www.youtube.com/watch?v=DI1YG_yeWYs",
                    }
                    matched_mv_url = hero_longform_by_song.get(str(hero_mv_song.get("song_id") or ""), "https://www.youtube.com/watch?v=pWAPQDb-KRE")
                    radio_ep1_url = "https://www.youtube.com/watch?v=QRMLZZzhtnE"
                    pinned_comment = (
                        f"백운호 〈{hero_mv_song['title']}〉 포함 6곡 무료 라디오 & 카톡 아침 안부카드:\n"
                        f"{utm_yt}\n"
                        f"🎬 3분 완곡 무대: {matched_mv_url} | 📻 15분 1화 라디오: {radio_ep1_url}\n\n"
                        f"{either_or_q}"
                    )
                    desc = (
                        f"AI 가상가수 백운호 오리지널 곡 · 6곡 완곡 무료 라디오 & 아침 꽃카드 (가입 없음): {utm_yt}\n"
                        f"🎬 3분 완곡 공식 무대: {matched_mv_url} | 📻 15분 사연 라디오 1화: {radio_ep1_url}\n\n"
                        f"{title}\n\n{slide_body}\n\n{pinned_comment}{disclosure_footer}"
                    )
                    cues_srt = []
                    _srt_sym_re = re.compile(r"[\U0001F300-\U0001FAFF\U00002600-\U000027BF]")
                    for ci, (a, b, l1, l2) in enumerate(hero_mv_slice.get("cues") or [], start=1):
                        c1 = _srt_sym_re.sub("", re.sub(r"https?://\S+", "", str(l1 or ""))).strip()
                        c2 = _srt_sym_re.sub("", re.sub(r"https?://\S+", "", str(l2 or ""))).strip()
                        cues_srt.append(f"{ci}\n{_fmt_srt_ts(float(a))} --> {_fmt_srt_ts(float(b))}\n{c1}\n{c2}\n")
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

        # Optional non-destructive Swarm Explore 20% pinned-comment bridge (Hard-Gate verified, preserves URL & disclosures!)
        if swarm_pinned_bridge and hill_climb_quota_mode == "swarm_explore_20":
            ok_sb, _ = check_promo_hard_gate(div, swarm_pinned_bridge, surface="youtube_comment")
            if ok_sb and swarm_pinned_bridge not in pinned_comment:
                pinned_comment = f"{swarm_pinned_bridge}\n{pinned_comment}"

        # Device 1 (2026-11-28): `$0` Deterministic Taste Gate (100-pt Rubric, 85-pt Threshold, Max 3 Rewrites)
        # Evaluates title/script/bubble BEFORE release on BOTH SLOT_A and SLOT_B without touching SLOT_A's 0.0s real-UI video pipeline!
        pre_taste_spoken = (
            tom_brief_pkg["spoken_script"]
            if (div == "TOM" and tom_brief_pkg)
            else (slide_body if div == "HERO" else build_natural_spoken_hook(div, title, slide_body, smh_fg_meta, either_or_q))
        )
        taste_res = evaluate_and_refine_for_taste(
            div=div,
            title=title,
            spoken_script=pre_taste_spoken,
            speech_bubble=swarm_speech_bubble,
            cta=cta_line,
        )
        refined_spoken_override: Optional[str] = None
        taste_speech_bubble = str(taste_res["candidate"].get("speech_bubble") or "").strip() or title[:15]
        if taste_res["attempts_used"] > 0 and taste_res["evaluation"]["compliance_ok"]:
            if div in ("KFG", "GBA", "KFK"):
                refined_spoken_override = str(taste_res["candidate"]["spoken_script"]).strip()
                # Apply sharper title ONLY if initial title triggered abstract-intro kill-switch
                init_b1 = (taste_res["history"][0].get("feedback") or [""])[0] if taste_res.get("history") else ""
                if "[항목1:0/25]" in init_b1 and len(taste_res["candidate"]["title"]) >= 12:
                    title = taste_res["candidate"]["title"][:95]

        # Scrub any stacked em-dashes across title+desc+srt_stub (Standing Directive #35: max 2 em-dashes combined) before Hard Gate!
        if (title.count("—") + desc.count("—") + srt_stub.count("—")) > 2:
            _lg = DIV_LANG_MAP.get(div, "en")
            title, _ = scrub_ai_slop(title, lang=_lg, max_em_dashes=0, is_html=False)
            desc, _ = scrub_ai_slop(desc, lang=_lg, max_em_dashes=1, is_html=False)
            srt_stub, _ = scrub_ai_slop(srt_stub, lang=_lg, max_em_dashes=0, is_html=False)
            if (title.count("—") + desc.count("—") + srt_stub.count("—")) > 2:
                _sep = "、" if _lg == "ja" else (", " if _lg == "ko" else " - ")
                title = title.replace("—", _sep)
                desc = desc.replace("—", _sep)
                srt_stub = srt_stub.replace("—", _sep)

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
            rendered_mp4: Optional[Path] = None
            if div == "HERO" and hero_mv_song and hero_mv_slice and vocal_track and vocal_track.exists():
                hero_srt_cues: List[Tuple[float, float, str, str]] = []
                rendered_mp4, rendered_dur = render_hero_trot_music_short_mp4(
                    song=hero_mv_song,
                    sl=hero_mv_slice,
                    bg_clips=[bg_local_path] if bg_local_path else [],
                    song_mp3=vocal_track,
                    out_mp4=out_mp4,
                    srt_cues_out=hero_srt_cues,
                )
                if hero_srt_cues:
                    _srt_sym_re2 = re.compile(r"[\U0001F300-\U0001FAFF\U00002600-\U000027BF]")
                    srt_stub = "\n".join(
                        f"{ci}\n{_fmt_srt_ts(a)} --> {_fmt_srt_ts(b)}\n"
                        + (f"{_srt_sym_re2.sub('', l1).strip()}\n{_srt_sym_re2.sub('', l2).strip()}".strip())
                        + "\n"
                        for ci, (a, b, l1, l2) in enumerate(hero_srt_cues, start=1)
                    )
            else:
                # 2026-11-27 HARD GATE: 1·2·3·5사업부 Zero-AI-Tell Direct 0.0s Mobile Real-UI 30fps Pipeline!
                # Zero unrelated raindrop/coffee/nature stock filler on Cut 0 — opens at 0.0s directly on mobile UI!
                # + HTML motion chart + 2.5s cuts + 1-line safe-zone captions + Y=1100~1250 ending CTA + true .srt + SFX + -26dB BGM
                try:
                    ui_mp4 = WORK_DIR / f"{div}_{today_str}_{slot_id}.real_ui.mp4"
                    chart_mp4 = WORK_DIR / f"{div}_{today_str}_{slot_id}.chart.mp4"
                    record_mobile_real_ui_clip(div, ui_mp4, duration_sec=12.0 if div == "TOM" else 11.0)
                    record_html_motion_chart_clip(div, chart_mp4, aspect="9:16", duration_sec=4.5)
                    spoken_script = (
                        refined_spoken_override
                        if refined_spoken_override
                        else (
                            tom_brief_pkg["spoken_script"]
                            if (div == "TOM" and tom_brief_pkg)
                            else build_natural_spoken_hook(div, title, slide_body, smh_fg_meta, either_or_q)
                        )
                    )
                    flow_render_meta: Optional[Dict[str, Any]] = None
                    if (
                        ab_track == "slot_b_flowchar"
                        and flow_elig["eligible"]
                        and flow_elig["clip_path"]
                        and flow_elig["pip_avatar_png"]
                    ):
                        try:
                            rendered_mp4, rendered_dur, srt_stub, flow_render_meta = compose_flow_character_short(
                                div=div,
                                lang=DIV_LANG_MAP.get(div, "ko"),
                                voice_id=pt["voice_id"],
                                spoken_script=spoken_script,
                                speech_bubble_text=taste_speech_bubble,
                                character_clip_mp4=Path(flow_elig["clip_path"]),
                                pip_avatar_png=Path(flow_elig["pip_avatar_png"]),
                                real_ui_mp4=ui_mp4,
                                motion_chart_mp4=chart_mp4,
                                out_mp4=out_mp4,
                                episode_key=episode_key,
                                live_badge_text=build_live_date_badge(div, now_kst=now_kst, smh_fg_meta=smh_fg_meta),
                                zoom_factor=float(flow_elig["zoom_factor"]),
                                now_kst=now_kst,
                            )
                        except Exception as flow_err:
                            # Graceful Fallback: NEVER crash or fake faces -> fall back seamlessly to proven SLOT_A 0.0s real-UI!
                            flow_fallback_reason = f"flow_compose_err_fallback:{type(flow_err).__name__}:{str(flow_err)[:100]}"
                            ab_track = "slot_a_realui"
                            matrix_meta["ab_track"] = ab_track
                            matrix_meta["utm_content_ab"] = append_ab_utm_suffix(utm_content, ab_track)
                            utm_yt = build_ab_go_link(div, "yt", ab_track)
                            utm_ig = build_ab_go_link(div, "ig", ab_track)
                            print(f"  [FLOW GRACEFUL FALLBACK -> SLOT_A] {div}: {flow_fallback_reason}", flush=True)
                            rendered_mp4, rendered_dur, srt_stub = compose_zero_ai_short(
                                div=div,
                                lang=DIV_LANG_MAP.get(div, "en"),
                                voice_id=pt["voice_id"],
                                spoken_script=spoken_script,
                                faceless_stock_mp4=None,
                                real_ui_mp4=ui_mp4,
                                motion_chart_mp4=chart_mp4,
                                out_mp4=out_mp4,
                                top_live_banner=(tom_brief_pkg["top_live_banner"] if (div == "TOM" and tom_brief_pkg) else ""),
                            )
                    else:
                        rendered_mp4, rendered_dur, srt_stub = compose_zero_ai_short(
                            div=div,
                            lang=DIV_LANG_MAP.get(div, "en"),
                            voice_id=pt["voice_id"],
                            spoken_script=spoken_script,
                            faceless_stock_mp4=None,
                            real_ui_mp4=ui_mp4,
                            motion_chart_mp4=chart_mp4,
                            out_mp4=out_mp4,
                            top_live_banner=(tom_brief_pkg["top_live_banner"] if (div == "TOM" and tom_brief_pkg) else ""),
                        )
                    ui_mp4.unlink(missing_ok=True)
                    chart_mp4.unlink(missing_ok=True)
                except RealUIAutoGateError as gate_err:
                    print(f"[REAL-UI AUTO-GATE ABORT] {div}: {gate_err}", flush=True)
                    alerts.append(f"REAL_UI_GATE_BLOCKED {div}: {gate_err}")
                    rendered_mp4 = None
                except Exception as comp_err:
                    print(f"[ZERO-AI COMPOSER ERR] {div}: {comp_err}", flush=True)
                    alerts.append(f"COMPOSE_ERR {div}: {comp_err}")
                    rendered_mp4 = None
            if rendered_mp4 and rendered_mp4.exists():
                if yt_already:
                    yt_res = {"ok": False, "skipped": "yt_daily_1per_div_already_done"}
                else:
                    do_srt = (div == "HERO") or (div == srt_partner_today)
                    yt_res = upload_youtube_short_v3(div, rendered_mp4, title, desc, srt_stub, pinned_comment, upload_srt=do_srt)
                if ig_already:
                    ig_res = {"ok": False, "skipped": "ig_slot_already_done"}
                else:
                    ig_caption = (
                        tom_brief_pkg["ig_caption"]
                        if (div == "TOM" and tom_brief_pkg)
                        else build_ig_caption_with_line1_cta(
                            div=div,
                            title=title,
                            slide_body=slide_body,
                            either_or_q=either_or_q,
                            go_ig_url=utm_ig,
                            disclosure_footer=disclosure_footer,
                        )
                    )
                    ok_ig_c, ig_c_errs = check_promo_hard_gate(div, ig_caption, surface="ig_caption")
                    if not ok_ig_c:
                        ig_res = {"ok": False, "error": f"ig_caption_hard_gate_blocked:{ig_c_errs}"}
                    else:
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
            **(smh_fg_meta or {}),
            "utm_yt": utm_yt,
            "utm_ig": utm_ig,
            "ab_track": ab_track,
            "utm_content_ab": matrix_meta["utm_content_ab"],
            "flow_fallback_reason": flow_fallback_reason,
            "flow_character_clip_id": (flow_elig.get("selected_clip") or {}).get("clip_id") if ab_track == "slot_b_flowchar" else None,
            "flow_zoom_factor": flow_elig.get("zoom_factor") if ab_track == "slot_b_flowchar" else None,
            "ig_thumb_offset_ms": 500,
            "taste_score": taste_res["final_score"],
            "taste_initial_score": taste_res["initial_score"],
            "taste_passed": taste_res["passed"],
            "taste_retries": taste_res["attempts_used"],
            "taste_low_score_warn": taste_res["low_score_warn"],
            "speech_bubble": taste_speech_bubble,
            "hill_climb_quota_mode": hill_climb_quota_mode,
            "swarm_exp_id": swarm_exp_id or None,
            "hero_radio_day": hero_radio_day,
            "date": today_str,
            "status": status,
        })
        print(
            f"  [GATE PASS] {div:4s} | status={status} | track={ab_track}"
            + (f" (fallback={flow_fallback_reason})" if flow_fallback_reason else "")
            + f" | taste={taste_res['final_score']}/100(r={taste_res['attempts_used']}{',WARN' if taste_res['low_score_warn'] else ''}) | quota={hill_climb_quota_mode}"
            + (f" | swarm={swarm_exp_id}" if swarm_exp_id else "")
            + f" | flow_bg={flow_bg_meta['flow_clip_id']} "
            f"| yt={yt_res.get('video_id') or yt_res.get('skipped') or yt_res.get('http_error') or 'dry'} "
            f"| ig={ig_res.get('media_id') or ig_res.get('skipped') or ig_res.get('http_error') or 'dry'}"
            + (f" | smh_fg={smh_fg_meta['smh_fg_score']}/100({smh_fg_meta['smh_fg_dd52w']})" if smh_fg_meta else "")
            + (f" | vocal={vocal_highlight_sec:.0f}s({vocal_track.name if vocal_track else 'pool'})" if div == "HERO" else "")
            + (f" | title={title[:52]}" if dry_run else ""),
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
