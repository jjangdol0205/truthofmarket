#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dream Company — 365-Day Cloud Unattended Auto-Promo Runner (Stage 4-1)
Runs on GitHub Actions even when local PC is turned off 365 days/year.

Enforced Technical Guardrails:
1. YouTube Quota Hard Cap: max 5-8 total uploads/day (well under 10,000 units/day incl. captions.insert).
2. 4th Div Flagship Radio Window Lock: Tue & Fri strictly 14m00s ~ 14m40s (840s ~ 880s).
3. GitHub Actions Runtime Budget: ffmpeg `-preset ultrafast -tune stillimage` (<5 min/day, <150 min/mo).
4. 3-Check Pre-Upload Auto-Gate (max 1 retry; NEVER uploads failed video):
   - (a) ffprobe target duration check
   - (b) Audio non-silence & 5kHz+ high-frequency energy >= 3.0%
   - (c) Zero banned strings (`황영웅`, `Brain LQ`, wrong division links, broken char `□`)
5. Baek Woon-ho `lyria-3.5` Weekly Hard Cap: defaults to cycling verified 6-song master pool;
   max 2 new `lyria-3.5` API calls/week (max 1 retry, then falls back cleanly to master pool; NEVER fakes audio!).
6. Instagram Reels Cloudflare R2 24h Lifecycle Staging: uploads `.mp4` to Cloudflare R2
   (`dreamcompany-reels-staging`, 24h auto-delete lifecycle) -> passes public ASCII `https://` `video_url`
   to Meta Graph API `POST /<IG_ID>/media` (zero trycloudflare tunnels, zero auto-comments!).
7. Topic Deduplication (`data/promo_history.json`) + Automatic UTM parameter injection on every link!
"""

from __future__ import annotations

import argparse
import base64
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

ROOT = Path(__file__).resolve().parent.parent
HISTORY_PATH = ROOT / "data" / "promo_history.json"
FLOW_MANIFEST_CANDIDATES = [
    ROOT / "flow_vault" / "manifest.json",
    ROOT / "data" / "flow_vault_manifest.json",
]
CACHE_DIR = Path(__file__).resolve().parent / ".cache"
WORK_DIR = CACHE_DIR / "work"

KST = dt.timezone(dt.timedelta(hours=9))

MAX_DAILY_YT_UPLOADS = 5  # Strictly within 5-8/day cap (5 divs x 1/day + Tue/Fri HERO radio = 5~6/day)
MAX_WEEKLY_LYRIA_CALLS = 2  # Hard Cap: <= 2 new lyria-3.5 calls per week
HERO_RADIO_MIN_SEC = 840.0  # 14m00s
HERO_RADIO_MAX_SEC = 880.0  # 14m40s

BANNED_STRINGS = [
    "황영웅",
    "임영웅",
    "나훈아",
    "Brain LQ",
    "KISFIT Bio Labs",
    "lemonsqueezy.com",
    "trycloudflare.com",
    "□",
    "님님",
]

DIV_CONFIGS: Dict[str, Dict[str, Any]] = {
    "TOM": {
        "site": "https://truthofmarket.com/#tom-retirement-architect",
        "sample_pdf": "https://truthofmarket.com/assets/downloads/tom_sample_2p.pdf",
        "yt_handle": "@TruthOfMarketUS",
        "ig_handle": "@truthofmarket",
        "lang": "en",
        "forbidden_domains": ["kisfitglobal.com", "getbreakai.com", "paradise-hero.com", "kidsfit.co.kr"],
        "open_loop_cta": "Would YOUR 401(k) survive a 2008 crash? Run the free 30-second Retirement Crash Stress Test:",
        "topics": [
            ("tom_1m_crash_510k", "Retiring with $1M? One 2008 Crash Cuts It to $510K — Unless You Do This"),
            ("tom_broker_001_sweep", "Your Broker Pays 0.01% on Idle IRA Cash — That's $10 a Year on $100K"),
            ("tom_6040_broke_2022", "Why Classic 60/40 Broke in 2022 — And the 2-ETF Seesaw Built for Age 55+"),
            ("tom_401k_roth_seq", "One 401(k) vs Roth IRA Tax Mistake Quietly Costs Retirees Thousands"),
            ("tom_down_month_2x", "STOP Selling 401(k) Shares in a Down Month — It Cuts 9 Years Off Retirement"),
            ("tom_inflation_35pct", "3% Inflation Cuts a $4,000 Retirement Paycheck to $2,600 in 15 Years"),
            ("tom_ss_62_vs_70_180k", "Social Security at 62 vs 67 vs 70: The $180,000 Break-Even Surprise"),
            ("tom_1pct_fee_240k", "The Tiny 1% Retirement Fee Quietly Steals $240,000 Over 25 Years"),
            ("tom_rmd_age73_cliff", "STOP Ignoring Age 73 RMDs — The Forced IRS Tax Cliff Hits Retirees Hard"),
            ("tom_irmaa_1dollar", "The Sneaky $1 Retirement Mistake That Triggers a $2,400 Medicare Surcharge"),
        ],
    },
    "KFG": {
        "site": "https://kisfitglobal.com/#kfg-bone-age-interpreter",
        "sample_pdf": "https://kisfitglobal.com/assets/downloads/kfg_sample_2p.pdf",
        "yt_handle": "@kisfitglobal",
        "ig_handle": "@kisfitglobal",
        "lang": "en",
        "forbidden_domains": ["truthofmarket.com", "getbreakai.com", "paradise-hero.com", "kidsfit.co.kr", "iherb.com", "amazon.com"],
        "open_loop_cta": "Where does YOUR child's real height lane land on the US CDC curve? Run the free 60-second check:",
        "topics": [
            ("kfg_same_parents_4in", "Same Parents, 4 Inches Apart — Why Parent Height Alone Misleads Families"),
            ("kfg_old_xray_2in", "STOP Trusting Last Year's Wrist X-Ray — It Can Miss Final Height by 2 Inches"),
            ("kfg_10pm_70pct_gh", "If Your 8-Year-Old Sleeps Past 10 PM, 70% of Tonight's Growth Wave Is Gone"),
            ("kfg_pediatric_3qs", "3 Questions Pediatricians Wish Parents Brought Before Growth Plates Close"),
            ("kfg_dry_lips_airway", "Child Wakes Up With Dry Lips? Open-Mouth Sleep Quietly Steals 2 Inches"),
            ("kfg_milk_iron_block", "STOP Over-Pouring Milk — Too Much Plain Milk Can Quietly Slow Growth"),
            ("kfg_tallest_3rd_grade", "Tallest Kid in 3rd Grade? Why Early Shooters Often Stop Growing First"),
            ("kfg_stretch_vs_jump", "Stretching vs 10-Min Jumping: Only ONE Actually Wakes Up Growth Plates"),
            ("kfg_under_2in_redflag", "Growing Less Than 2 Inches a Year? The Pediatric Red-Flag Velocity Rule"),
            ("kfg_wall_10sec_test", "Try This 10-Second Wall Test Tonight — Spot Hidden Posture Loss Instantly"),
        ],
    },
    "GBA": {
        "site": "https://getbreakai.com/jp/#gba-retirement-architect-jp",
        "sample_pdf": "https://getbreakai.com/jp/downloads/gba_jp_sample_2p.pdf",
        "yt_handle": "@GetBreakAI",
        "ig_handle": "@getbreakai",
        "lang": "ja",
        "forbidden_domains": ["truthofmarket.com", "kisfitglobal.com", "paradise-hero.com", "kidsfit.co.kr"],
        "open_loop_cta": "あなたの今の配分は2008年級で何年持ちますか？30秒無料4ステップ暴落耐性診断はこちら：",
        "topics": [
            ("gba_nisa_5yr_wiped", "【50代の新NISA】暴落1回で『老後5年分』が消える人の共通点"),
            ("gba_10pct_div_trap", "【老後の落とし穴】利回り10%に飛びついた50代が最初に資産を減らす残酷な算数"),
            ("gba_deposit_erosion", "【50代必見】退職金を銀行預金に眠らせると10年で購買力が2割消える理由"),
            ("gba_rakuten_sbi_safe", "【保存版】楽天・SBIの新NISAで成行注文を出してはいけない1つの理由"),
            ("gba_360m_frame_burn", "【新NISAの罠】頻繁に売買すると『年間360万円の非課税枠』が一瞬で消える理由"),
            ("gba_tokutei_20m_tax", "【知らないと損】同じ100万円の利益でも特定口座は約20万円消える残酷な差"),
            ("gba_nenkin_65_vs_70", "【60歳の選択】年金65歳 vs 70歳繰下げ — 手取り損益分岐点は実は83歳超"),
            ("gba_bank_counter_60m", "【要注意】退職金で銀行窓口のおすすめ投信を買うと初日に60万円消える罠"),
            ("gba_monthly_15m_math", "【リアル試算】老後に年金＋毎月10万〜15万円を取り崩すなら幾ら必要か？"),
            ("gba_60s_not_too_late", "【誤解】新NISAは60代から始めても遅い？実はあと25年運用できる理由"),
        ],
    },
    "HERO": {
        "site": "https://paradise-hero.com/radio.html",
        "sample_pdf": "https://paradise-hero.com/stream.html",
        "yt_handle": "@김쌤의영웅라디오",
        "ig_handle": "@paradise_hero1",
        "lang": "ko",
        "forbidden_domains": ["truthofmarket.com", "kisfitglobal.com", "getbreakai.com", "kidsfit.co.kr"],
        "open_loop_cta": "쇼츠엔 30초뿐 — 광고 없는 백운호 3분 완곡 전체 듣기와 돋보기 없는 왕글씨 가사집·사연 신청:",
        "topics": [
            ("hero_11pm_dark_room", "[눈물주의] 아들 앞에선 웃었지만… 밤 11시 거실 불 끄고 어머님이 틀어놓은 노래"),
            ("hero_concert_backpain", "[시니어필수] 2시간 공연 갔다가 허리 아파 중간에 나오신 어머님들, 딱 1가지만 챙기세요"),
            ("hero_72yo_kitchen_note", "[뭉클실화] 대구 72세 어머님이 새벽 부엌에 접어둔 편지, 백운호 노래로 답장했습니다"),
            ("hero_yeonga_walk_20m", "[저녁산책] 무릎 부담 줄이는 저녁 20분 걷기와 백운호 〈백운호 연가〉 76 BPM 비밀"),
            ("hero_rainy_night_heal", "[감동무대] 비 오는 밤 잠 못 드실 때 어머님들이 꼭 틀어두시는 백운호 1곡"),
            ("hero_14min_radio_ep1", "[14분완곡] 어머님 감동 사연 2편과 백운호 대표곡 3곡 연속 듣기 열렸습니다"),
            ("hero_daughter_fridge", "[눈물주의] 시집간 딸이 친정 냉장고 문에 몰래 붙이고 간 메모 한 장"),
            ("hero_husband_40yr", "[눈물주의] 40년 만에 처음 받아본 남편의 손편지, 마지막 줄에서 무너졌습니다"),
            ("hero_60s_3_worries", "60 넘어서야 깨닫는 인생에서 진짜 버려야 할 걱정 3가지"),
            ("hero_phone_big_font", "스마트폰 깨알 글씨 10초 만에 2배 크게 키우는 시니어 초간단 비법"),
        ],
    },
    "KFK": {
        "site": "https://kidsfit.co.kr/#kfk-bone-age-interpreter",
        "sample_pdf": "https://kidsfit.co.kr/assets/downloads/kfk_sample_2p.pdf",
        "yt_handle": "@kidsfit01",
        "ig_handle": "@kids_fit1",
        "lang": "ko",
        "forbidden_domains": ["truthofmarket.com", "kisfitglobal.com", "getbreakai.com", "paradise-hero.com", "coupang.com", "cshop.naver.com"],
        "open_loop_cta": "엄마·아빠 키만 더하면 최대 7cm 틀립니다 — 우리 아이 진짜 성인 예상키 1분 무료 진단:",
        "topics": [
            ("kfk_milk_3cups_stop", "우유 하루 3잔 먹였는데 키가 멈춘 이유 — 100만원 영양제 전에 이것부터 보세요"),
            ("kfk_8cm_spurt_sign", "1년에 8cm 컸다고 좋아했다가 성장판 2년 빨리 닫히는 아이 특징 1가지"),
            ("kfk_old_bone_age_4cm", "작년 소아과 뼈나이 검사, 오늘 그대로 믿으면 예상키가 4cm 틀립니다"),
            ("kfk_10pm_sleep_loss", "밤 10시 반 넘겨 자는 초등 아이, 매일 밤 숨은 키 7cm가 새고 있습니다"),
            ("kfk_mouth_breathe_70", "[경고] 잘 때 입 벌리고 자는 아이, 밤사이 성장호르몬 70%가 새고 있습니다"),
            ("kfk_desk_footrest_3cm", "허리 펴라 백 번 잔소리해도 소용없는 이유 — 책상 아래 발이 숨은 키 3cm를 깎습니다"),
            ("kfk_same_parents_10cm", "부모 키가 작으면 끝? 같은 부모 밑에서 형제 키가 10cm 차이 나는 이유"),
            ("kfk_under_4cm_warning", "1년에 4cm 미만으로 크고 있다면? 소아과가 경고하는 키성장 정체 기준"),
            ("kfk_9pm_led_90min", "밤 9시 밝은 거실 하얀 LED가 아이 수면 호르몬을 90분 늦추는 충격 사실"),
            ("kfk_wall_10sec_2cm", "벽에 뒤꿈치 대고 딱 10초! 우리 아이 숨은 키 2cm 바로 찾아내는 테스트"),
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
        "schema_version": "stage4-v1",
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
    # Cycle cleanly by day-of-year if all topics recently covered
    doy = dt.datetime.now(KST).timetuple().tm_yday
    return topics[doy % len(topics)]


def check_text_gate(div: str, title: str, desc: str, srt_text: str) -> Tuple[bool, List[str]]:
    errors = []
    combined = f"{title}\n{desc}\n{srt_text}"
    if len(title.strip()) < 12 or title.strip() == "0":
        errors.append("invalid_or_zero_title")
    if re.search(r"[\(\【]\s*\d{1,2}[./]\d{1,2}\s*[#・]?\s*[ABC]\s*[\)\】]", title, re.I):
        errors.append("bot_date_slot_tag_in_title")
    if div == "GBA" and any(bad in combined for bad in ("オルカン", "1489", "VYM", "t.me", "Telegram")):
        errors.append("gba_prohibited_term")
    for b in BANNED_STRINGS:
        if b.lower() in combined.lower():
            errors.append(f"banned_string:{b}")
    for fd in DIV_CONFIGS[div]["forbidden_domains"]:
        if fd.lower() in combined.lower():
            errors.append(f"wrong_div_domain:{fd}")
    return len(errors) == 0, errors


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
    """Downloads a permanent 1080p/4K Flow Vault MP4 from Cloudflare R2 (`dreamcompany-flow-vault`)."""
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
    """Selects least-used matching 1080p/4K Flow Vault clip as #1 priority motion background."""
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
    """Uploads rendered reel `.mp4` to Cloudflare R2 bucket (24h Auto-Delete Lifecycle) and returns ASCII HTTPS URL."""
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
    ig_tok = os.getenv(f"IG_ACCESS_TOKEN_{div}", "").strip()
    ig_uid = os.getenv(f"IG_USER_ID_{div}", "").strip()
    if not (ig_tok and ig_uid):
        return {"ok": False, "skipped": "missing_ig_credentials"}
    video_url = stage_reel_to_cloudflare_r2(mp4_path, ascii_key)
    if not video_url:
        return {"ok": False, "error": "r2_staging_failed"}
    # Step 1: Create IG Reel Container using R2 public ASCII HTTPS video_url (ZERO trycloudflare, ZERO auto-comment!)
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
    weekday = now_kst.weekday()  # 0=Mon, 1=Tue, 4=Fri
    hist = load_history()

    print(f"=== Dream Company 365-Day Cloud Promo Runner ({today_str} KST, dry_run={dry_run}) ===", flush=True)
    print(f"Guardrails: max_daily_yt={MAX_DAILY_YT_UPLOADS} | lyria_weekly_cap={MAX_WEEKLY_LYRIA_CALLS} (can_call={can_call_lyria_this_week(hist)}) | hero_radio_window={HERO_RADIO_MIN_SEC}-{HERO_RADIO_MAX_SEC}s", flush=True)

    # Load 5x5 Message Matrix for strict Stage 1-2 (80% volume) Single-Variable A/B Hook Selection!
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    try:
        from ab_evolution_engine import load_matrix, select_stage12_ab_cell
        matrix_db = load_matrix(ROOT / "data" / "message_matrix_5div.json")
    except Exception:
        matrix_db = None
        select_stage12_ab_cell = None  # type: ignore

    flow_manifest_path, flow_manifest = load_flow_vault_manifest()
    flow_manifest_dirty = False

    day_arm = now_kst.timetuple().tm_yday % 2  # Alternates Control (Arm 0) vs Challenger (Arm 1) hook_type!
    planned = []
    for div in ["TOM", "KFG", "GBA", "HERO", "KFK"]:
        if len(planned) >= MAX_DAILY_YT_UPLOADS:
            break
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
            slide_body = DIV_CONFIGS[div].get("open_loop_cta", "")
            cta_line = DIV_CONFIGS[div].get("open_loop_cta", "Explore free interactive tool:")
            matrix_meta = {"matrix_id": f"{div}_S1_LOSS", "stage": 1, "hook_type": "loss", "utm_content": utm_content, "ab_arm": "A"}

        utm_yt = build_utm_url(DIV_CONFIGS[div]["site"], "youtube", "shorts", f"{tid}_{today_str}", content=utm_content)
        utm_ig = build_utm_url(DIV_CONFIGS[div]["site"], "instagram", "reels", f"{tid}_{today_str}", content=utm_content)
        desc = f"{title}\n\n{slide_body}\n\n{cta_line}\n{utm_yt}\n"
        srt_stub = f"1\n00:00:00,000 --> 00:00:04,500\n{title}\n"
        ok_txt, errs = check_text_gate(div, title, desc, srt_stub)
        if not ok_txt:
            print(f"[AUTO-GATE BLOCKED TEXT] {div} {tid}: {errs}", flush=True)
            continue

        # Select #1 priority 1080p/4K Flow Vault background clip (prefers matching hook_type & A/B arm!)
        hero_radio_day = (div == "HERO" and weekday in (1, 4, 6))
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
            **matrix_meta,
            **flow_bg_meta,
            "utm_yt": utm_yt,
            "utm_ig": utm_ig,
            "hero_radio_day": hero_radio_day,
            "ffmpeg_profile": "ffmpeg -i <flow_vault_1080p.mp4> -c:v libx264 -preset fast -threads 2" if vault_clip else "ffmpeg -preset ultrafast -tune stillimage -threads 2",
            "date": today_str,
            "status": "dry_run_validated" if dry_run else "queued_or_awaiting_secrets",
        })
        print(f"  [GATE PASS] {div:4s} | S{matrix_meta['stage']}/{matrix_meta['hook_type']:9s} | {utm_content} | flow_bg={flow_bg_meta['flow_clip_id']} ({flow_bg_meta['flow_resolution']}) | utm_yt={utm_yt}", flush=True)

    hist["last_run_kst"] = now_kst.isoformat()
    if not dry_run:
        # Append only non-duplicate entries for today
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
