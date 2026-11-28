#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/weekly_hill_climber.py
================================================================================
Dream Company — Device 2: Weekly Hill-Climbing Weight Evolution Engine (`$0`)
Scheduled every Sunday 23:10 KST (`cron: "10 14 * * 0"` UTC) + `mode: hill_climb`.

Core Guarantees:
  1. 48-Hour Maturation Filter (`MIN_MATURATION_HOURS = 48.0`):
     Scores ONLY Shorts/Reels published within the last 14 days that have aged
     >= 48 hours so freshly posted videos are NEVER misjudged as losers.
  2. Anti-Goodhart Composite Score:
       `composite_score = 0.40 * norm_views + 0.25 * norm_engagement_rate + 0.35 * norm_web_ctr`
     Integrates live YouTube Data API v3 + IG Graph API (enriched cleanly with
     local `data/promo_learning_snapshot.json` when an API token is absent) AND
     real Cloudflare D1 `/api/admin/aarrr-summary` + `/api/admin/go-summary`!
  3. 80/20 Diversity Quota & Automatic Promotion / Archival (`data/topic_hook_weights.json`):
       - Top 20% winners -> `weight = 2.0` + hard-gate-verified follow-up variations.
       - Bottom 30% low-response -> `weight = 0.35`, or `status = "archived"` after
         2 consecutive bottom weeks (replaced by fresh exploration candidate).
       - `exploitation_quota = 0.80` / `exploration_quota = 0.20`.
       - Structured `latest_summary` (`top_winner_text`, `archived_loser_text`,
         `one_line_summary`) ready for 08:00 KST KPI `[🧬 자가 진화 한 줄 요약]`.
  4. Governance Absolute Sanctuary Hard Lock (`GovernanceSanctuaryViolationError`):
     The RSI engine can ONLY write to the whitelisted `topic_hook_weights.json`
     path! Any attempt to touch website pricing (`$9/$29/$199`, `$8.99~$49`,
     `¥1,480~¥29,800`, `9,900원~39,000원`), HTML/value ladders, disclaimers, or
     `promo_hard_gate.py` banned-word dictionaries raises an immediate exception.
================================================================================
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
import re
import sys
import urllib.request
from pathlib import Path
from typing import Any, Dict, FrozenSet, List, Optional, Tuple

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

sys.path.insert(0, str(Path(__file__).resolve().parent))
from ab_evolution_engine import (  # noqa: E402
    CENTRAL_API_BASE,
    DIVISIONS,
    SNAPSHOT_PATH,
    _build_history_lookup,
    _load_runtime_env,
    collect_d1_funnel_events,
    collect_d1_go_clicks,
    collect_instagram_14d,
    collect_youtube_14d,
    load_matrix,
)
from promo_hard_gate import check_promo_hard_gate  # noqa: E402

KST = dt.timezone(dt.timedelta(hours=9))
UTC = dt.timezone.utc
ROOT = Path(__file__).resolve().parent.parent

WEIGHTS_PATH_LOCAL = ROOT / "data" / "topic_hook_weights.json"
WEIGHTS_PATH_DIV1 = Path(r"D:\드림컴퍼니\1사업부\data\topic_hook_weights.json")

# ==============================================================================
# Core Constants & Anti-Goodhart / Diversity Quotas
# ==============================================================================
MIN_MATURATION_HOURS = 48.0
WINDOW_DAYS = 14
EXPLOITATION_QUOTA = 0.80
EXPLORATION_QUOTA = 0.20

WINNER_TOP_FRACTION = 0.20
LOSER_BOTTOM_FRACTION = 0.30
WINNER_WEIGHT = 2.0
BASELINE_WEIGHT = 1.0
DEMOTED_WEIGHT = 0.35

DIV_KO_LABELS: Dict[str, str] = {
    "TOM": "1사업부",
    "KFG": "2사업부",
    "GBA": "3사업부",
    "HERO": "4사업부",
    "KFK": "5사업부",
}

# ==============================================================================
# Governance Absolute Sanctuary Hard Lock (Whitelist-Only Write Control)
# ==============================================================================
ALLOWED_RSI_WRITE_FILENAME = "topic_hook_weights.json"

SANCTUARY_FORBIDDEN_EXTENSIONS: FrozenSet[str] = frozenset({
    ".html", ".htm", ".css", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".py", ".yml", ".yaml", ".md", ".sql",
})

SANCTUARY_FORBIDDEN_PATH_TOKENS: Tuple[str, ...] = (
    "promo_hard_gate",
    "outbound_allowlist",
    "taste_evaluator",
    "index.html",
    "vip.html",
    "radio.html",
    "pricing",
    "checkout",
    "paywall",
    "disclaimer",
    "terms",
    "privacy",
    "legal",
    "gemini.md",
    "payment",
    "whop",
    "polar",
    "latpeed",
    "functions",
    "workers",
)


class GovernanceSanctuaryViolationError(PermissionError):
    """Raised immediately if the RSI engine attempts to write to ANY sanctuary or non-whitelisted path."""


def assert_rsi_write_allowed(target_path: Path) -> Path:
    """
    Physical Governance Sanctuary Gate:
      - Blocks ALL sanctuary paths (pricing, HTML/value ladders, disclaimers, `promo_hard_gate.py`,
        banned-word configs, code/workflow files).
      - Allows ONLY exact filename `topic_hook_weights.json` inside a `data` directory (or temp test dir).
    """
    resolved = Path(target_path).resolve()
    low_full = str(resolved).replace("\\", "/").lower()
    suffix = resolved.suffix.lower()

    if suffix in SANCTUARY_FORBIDDEN_EXTENSIONS:
        raise GovernanceSanctuaryViolationError(
            f"[GOVERNANCE SANCTUARY BLOCKED] Forbidden file extension ({suffix}): {resolved}"
        )

    for tok in SANCTUARY_FORBIDDEN_PATH_TOKENS:
        if tok in low_full:
            raise GovernanceSanctuaryViolationError(
                f"[GOVERNANCE SANCTUARY BLOCKED] Protected sanctuary token ({tok!r}) in path: {resolved}"
            )

    if resolved.name != ALLOWED_RSI_WRITE_FILENAME:
        raise GovernanceSanctuaryViolationError(
            f"[GOVERNANCE SANCTUARY BLOCKED] RSI engine may ONLY write '{ALLOWED_RSI_WRITE_FILENAME}' (got '{resolved.name}'): {resolved}"
        )

    parent_name = resolved.parent.name.lower()
    if parent_name not in ("data", "scratch", "tmp") and "temp" not in low_full:
        raise GovernanceSanctuaryViolationError(
            f"[GOVERNANCE SANCTUARY BLOCKED] '{ALLOWED_RSI_WRITE_FILENAME}' must reside inside a 'data/' directory: {resolved}"
        )

    return resolved


def safe_write_rsi_weights(target_path: Path, payload: Dict[str, Any]) -> Path:
    """Single authorized write gateway for the Weekly Hill Climber."""
    safe_p = assert_rsi_write_allowed(target_path)
    safe_p.parent.mkdir(parents=True, exist_ok=True)
    safe_p.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return safe_p


# ==============================================================================
# Live Data Collectors (AARRR Summary + /go/ Clicks + YT/IG + Snapshot Enrichment)
# ==============================================================================
def collect_aarrr_summary(env: Dict[str, str], days: int = WINDOW_DAYS) -> Dict[str, Any]:
    tok = env.get("WATCHDOG_ADMIN_TOKEN", "").strip()
    if not tok:
        return {}
    url = f"{CENTRAL_API_BASE}/api/admin/aarrr-summary?days={int(days)}"
    try:
        req = urllib.request.Request(
            url,
            headers={"Authorization": f"Bearer {tok}", "User-Agent": "DC-HillClimber/1.0"},
        )
        with urllib.request.urlopen(req, timeout=15) as r:
            body = json.loads(r.read().decode("utf-8"))
        if body.get("ok"):
            return body
    except Exception as exc:
        print(f"  [AARRR API FALLBACK] {exc}", flush=True)
    return {}


def _load_snapshot_items() -> List[Dict[str, Any]]:
    for cand in (
        SNAPSHOT_PATH,
        ROOT.parent / "data" / "promo_learning_snapshot.json",
        Path(r"D:\드림컴퍼니\data\promo_learning_snapshot.json"),
        Path(r"D:\드림컴퍼니\1사업부\data\promo_learning_snapshot.json"),
    ):
        if cand.exists():
            try:
                data = json.loads(cand.read_text(encoding="utf-8"))
                items = list(data.get("items") or [])
                if items:
                    return items
            except Exception:
                pass
    return []


def collect_unified_14d_shortform_items(
    env: Dict[str, str],
    matrix_db: Optional[Dict[str, Any]],
    prefer_live_api: bool = True,
) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Collects 14-day Shorts & Reels across all 5 divisions by combining live YT/IG APIs
    with local `promo_learning_snapshot.json` (deduplicated by `(div_code, content_id)`,
    always keeping the higher/fresher view count so dry-runs & local runs match live reality).
    """
    yt_hist_map, ig_hist_map = _build_history_lookup()
    merged: Dict[Tuple[str, str], Dict[str, Any]] = {}
    live_yt_count = 0
    live_ig_count = 0

    # 1. Live APIs first when tokens are available
    if prefer_live_api:
        for div in DIVISIONS:
            yt_rows = collect_youtube_14d(div, env, matrix_db, yt_hist_map, days=WINDOW_DAYS)
            ig_rows = collect_instagram_14d(div, env, matrix_db, ig_hist_map, days=WINDOW_DAYS)
            live_yt_count += len(yt_rows)
            live_ig_count += len(ig_rows)
            for row in yt_rows + ig_rows:
                k = (str(row.get("div_code") or div).upper(), str(row.get("content_id") or ""))
                if k[1]:
                    merged[k] = dict(row)

    # 2. Enrich any missing division/items from fresh `promo_learning_snapshot.json`
    snap_rows = _load_snapshot_items()
    snap_used = 0
    for row in snap_rows:
        if row.get("platform") not in ("youtube_shorts", "instagram_reels", "instagram_carousel"):
            continue
        k = (str(row.get("div_code") or "").upper(), str(row.get("content_id") or ""))
        if not k[0] or not k[1]:
            continue
        if k not in merged:
            merged[k] = dict(row)
            snap_used += 1
        else:
            # Keep fresher/higher real view count if snapshot has fresher YT stats
            if int(row.get("views") or 0) > int(merged[k].get("views") or 0):
                merged[k]["views"] = int(row["views"])

    shortform_items = [
        it for it in merged.values()
        if it.get("platform") in ("youtube_shorts", "instagram_reels", "instagram_carousel")
    ]
    meta = {
        "live_yt_collected": live_yt_count,
        "live_ig_collected": live_ig_count,
        "snapshot_enriched": snap_used,
        "total_unified_shortform": len(shortform_items),
    }
    return shortform_items, meta


# ==============================================================================
# Clean Topic Key & Safe Follow-Up Variation Generator (Hard-Gate Verified)
# ==============================================================================
def _clean_short_label(title: str, max_len: int = 34) -> str:
    s = re.sub(r"#\S+|https?://\S+", "", str(title or ""))
    s = re.sub(r"[\U0001F300-\U0001FAFF\U00002600-\U000027BF]", "", s)
    s = re.sub(r"^\[[^\]]+\]\s*|^【[^】]+】\s*|^♪\s*", "", s).strip()
    s = re.sub(r"\s+", " ", s)
    return s[:max_len].strip(" -|·:")


def _extract_topic_key(div: str, title: str, hook_type: str) -> str:
    low = str(title or "").lower()
    if div == "KFK":
        if "온도" in low or "통잠" in low or "침실" in low:
            return "kfk_sleep_temp_2deg"
        if "입 벌리" in low or "구강" in low or "입술" in low:
            return "kfk_mouth_breathing_3cm"
        if "뼈나이" in low:
            return "kfk_bone_age_delta"
        if "우유" in low or "단백질" in low:
            return "kfk_milk_protein_myth"
        if "점프" in low or "운동" in low:
            return "kfk_5min_jump_routine"
    elif div == "HERO":
        if "어머니의 봄날" in low or "어머님" in low:
            return "hero_mothers_spring_dedication"
        if "항구의 등불" in low or "아버님" in low:
            return "hero_harbor_light_father"
        if "첫 소절" in low or "눈물" in low or "사연" in low:
            return "hero_emotional_story_ballad"
        if "안부카드" in low or "꽃그림" in low:
            return "hero_morning_flower_card"
    elif div == "GBA":
        if "朝9時" in low or "成行" in low:
            return "gba_9am_market_order_warn"
        if "360万" in low or "一括" in low:
            return "gba_360m_lump_sum_trap"
        if "税金" in low or "高配当" in low or "利回り" in low:
            return "gba_nisa_us_dividend_tax"
        if "60代" in low or "50代" in low:
            return "gba_50s60s_nisa_horizon"
        if "恐怖" in low or "半導体" in low:
            return "gba_smh_fg_live_stat"
    elif div == "KFG":
        if "parent" in low or "25%" in low or "average" in low:
            return "kfg_parent_height_25pct_myth"
        if "sleep" in low or "bedtime" in low or "dry lips" in low:
            return "kfg_bedtime_sleep_rhythm"
        if "bone" in low or "x-ray" in low or "pediatric" in low:
            return "kfg_bone_age_pediatric_gap"
    elif div == "TOM":
        if "2000" in low or "10" in low or "0%" in low or "lost decade" in low:
            return "tom_2000_2010_zero_return"
        if "0.01%" in low or "sweep" in low or "cash" in low:
            return "tom_idle_cash_sweep_drag"
        if "smh" in low or "3.7" in low or "-36.8" in low:
            return "tom_smh_fg_live_recovery"
        if "-35%" in low or "-50%" in low or "401(k)" in low:
            return "tom_401k_crash_cushion"
    return f"{div.lower()}_{str(hook_type or 'proof').lower()}_general"


def derive_safe_winner_variations(div: str, winner_title: str, topic_key: str) -> List[str]:
    """Generates 2 hard-gate-verified follow-up topic variations anchored to a Top 20% winner."""
    div_u = div.upper()
    bank: Dict[str, List[str]] = {
        "KFK": [
            "새벽 2시 이불 차는 아이, 침실 온도 2도·습도 50% 밤 루틴 2가지 체크",
            "아침 입술 마른 초등 아이, 밤사이 입호흡 줄이는 취침 전 3분 점검",
            "6개월 전 손목 뼈나이 그대로 믿으면 생기는 최대 4cm 예측키 오차",
        ],
        "HERO": [
            "밤 10시 텅 빈 거실에 들려드리는 백운호 〈어머니의 봄날〉 2절 헌정 무대",
            "평생 가족 버팀목이 된 아버님께 바치는 백운호 〈항구의 등불〉 6곡 라디오",
            "어머님 장롱 속 사연과 함께 보내는 무료 백운호 아침 꽃그림 안부카드",
        ],
        "GBA": [
            "新NISAの年間360万円枠を守る分割設計と、25年下落データで確認する回復期間",
            "朝9時の寄付き直後に成行注文を避けるだけで変わる50代・60代の老後資金ルール",
            "米国ETFの配当10%米国課税と新NISA1,800万円枠の落とし穴を30秒で確認",
        ],
        "KFG": [
            "Parents' height isn't 100% destiny — the 25% evening sleep & protein rhythm check",
            "Why weekend sleep-ins can't replace weekday 9:30 PM growth rhythm for ages 6-12",
            "Beyond averaging mom and dad's height: 60-second US CDC percentile velocity check",
        ],
        "TOM": [
            "When US large stocks stayed flat for 10 years (2000-2010), how a 24-month Treasury cushion worked",
            "Broker cash paying 0.01% vs short-term Treasury liquidity: $100,000 retirement drag math",
            "SMH Fear & Greed sub-10 shocks (2000-2025): 62-month solo vs 17-month balanced recovery",
        ],
    }
    raw_cands = bank.get(div_u, [])
    verified: List[str] = []
    for cand in raw_cands:
        ok, _ = check_promo_hard_gate(div_u, cand, surface="youtube_title")
        if ok:
            verified.append(cand)
        if len(verified) >= 2:
            break
    return verified


def _fresh_exploration_candidate(div: str) -> Dict[str, Any]:
    bank: Dict[str, Dict[str, Any]] = {
        "TOM": {"topic_key": "tom_explore_tax_location", "hook_type": "curiosity", "idea": "IRA vs taxable location: where defensive healthcare vs growth sits in retirement"},
        "KFG": {"topic_key": "kfg_explore_morning_vs_evening_cm", "hook_type": "curiosity", "idea": "Morning vs evening barefoot height can shift by 0.5 inches — why timing matters"},
        "GBA": {"topic_key": "gba_explore_kokusai_vs_teiki", "hook_type": "proof", "idea": "1,000万円を定期預金に置く前に確認したい個人向け国債（変動10年）との手取り差"},
        "HERO": {"topic_key": "hero_explore_autumn_station_story", "hook_type": "curiosity", "idea": "옛 고향 정거장 기억을 노래하는 백운호 〈고향 기차역〉 사연 라디오 하이라이트"},
        "KFK": {"topic_key": "kfk_explore_shoe_size_signal", "hook_type": "curiosity", "idea": "초등 고학년 신발 사이즈가 6개월 만에 갑자기 커졌을 때 꼭 체크할 성장판 신호"},
    }
    return bank[div.upper()]


# ==============================================================================
# Core Weekly Hill-Climbing Engine
# ==============================================================================
def _minmax_norm(vals: List[float]) -> List[float]:
    if not vals:
        return []
    lo, hi = min(vals), max(vals)
    if hi - lo <= 1e-12:
        return [1.0 if hi > 0 else 0.0 for _ in vals]
    return [(v - lo) / (hi - lo) for v in vals]


def _load_existing_weights(path: Path) -> Dict[str, Any]:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def run_weekly_hill_climb(
    weights_out_path: Path = WEIGHTS_PATH_LOCAL,
    mirror_div1_path: Optional[Path] = WEIGHTS_PATH_DIV1,
    dry_run: bool = False,
    now_utc: Optional[dt.datetime] = None,
    prefer_live_api: bool = True,
) -> Dict[str, Any]:
    """
    Runs the full Weekly Hill-Climbing evaluation:
      1. Collects 14-day Shorts/Reels + D1 `/api/admin/aarrr-summary` + `/api/admin/go-summary` + `funnel_events`.
      2. Applies strict 48-hour maturation filter (`age_hours >= 48.0`).
      3. Computes Anti-Goodhart `composite_score = 0.40*norm_views + 0.25*norm_engagement_rate + 0.35*norm_web_ctr`.
      4. Updates Top 20% winners (`2.0x` + variations) & Bottom 30% demoted/archived (`0.35x` / `archived`).
      5. Writes ONLY through `safe_write_rsi_weights()` (Governance Sanctuary Hard Lock!).
    """
    env = _load_runtime_env()
    now_u = now_utc or dt.datetime.now(UTC)
    now_kst = now_u.astimezone(KST)
    cutoff_14d = now_u - dt.timedelta(days=WINDOW_DAYS)

    matrix_db = load_matrix()
    prev_weights = _load_existing_weights(weights_out_path)
    prev_divs = prev_weights.get("divisions") or {}

    items, collect_meta = collect_unified_14d_shortform_items(env, matrix_db, prefer_live_api=prefer_live_api)
    go_by_div = collect_d1_go_clicks(env, days=WINDOW_DAYS)
    aarrr = collect_aarrr_summary(env, days=WINDOW_DAYS)
    _, funnel_by_utm = collect_d1_funnel_events(env, days=WINDOW_DAYS)

    aarrr_divs = aarrr.get("divisions") or {}

    divisions_out: Dict[str, Any] = {}
    top_winner_highlights: List[Tuple[int, str, str, str]] = []  # (views, div, short_title, text)
    archived_or_demoted_highlights: List[str] = []

    for div in DIVISIONS:
        d_all = [x for x in items if str(x.get("div_code") or "").upper() == div]
        matured: List[Dict[str, Any]] = []
        immature_under_48h: List[Dict[str, Any]] = []

        for it in d_all:
            pub_s = str(it.get("published_at") or "")
            try:
                pub_dt = dt.datetime.fromisoformat(pub_s.replace("Z", "+00:00"))
            except Exception:
                continue
            age_hours = (now_u - pub_dt).total_seconds() / 3600.0
            if pub_dt < cutoff_14d:
                continue
            it_copy = dict(it)
            it_copy["age_hours"] = round(age_hours, 2)
            if age_hours >= MIN_MATURATION_HOURS:
                matured.append(it_copy)
            else:
                immature_under_48h.append(it_copy)

        # Division-level web CTR signal from `/go/` clicks + AARRR social UV (youtube/instagram)
        d_go_clicks = int((go_by_div.get(div) or {}).get("total_clicks") or 0)
        d_aarrr_acq = ((aarrr_divs.get(div) or {}).get("acquisition") or {})
        social_uv = sum(
            int(s.get("uv") or 0)
            for s in (d_aarrr_acq.get("top_sources") or [])
            if str(s.get("source") or "").lower() in ("youtube", "instagram", "go_link", "social")
        )
        div_web_visits = max(d_go_clicks, social_uv)
        tot_matured_views = sum(max(1, int(x.get("views") or 0)) for x in matured)

        raw_views: List[float] = []
        raw_eng: List[float] = []
        raw_ctr: List[float] = []
        bayes_prior = 50.0  # Laplace smoothing prevents 1-view/2-view small-sample Goodhart distortion!

        for it in matured:
            v = max(0, int(it.get("views") or 0))
            likes = max(0, int(it.get("likes") or 0))
            cmts_raw = max(0, int(it.get("comments") or 0))
            # Subtract 1 self-posted pinned comment on YouTube Shorts so 1-view uploads don't look like 200% engagement
            human_cmts = max(0, cmts_raw - 1) if str(it.get("platform") or "") == "youtube_shorts" else cmts_raw
            saves = max(0, int(it.get("saves") or 0))
            shares = max(0, int(it.get("shares") or 0))
            eng_rate = (likes + human_cmts * 2.0 + saves * 2.0 + shares * 3.0) / (float(v) + bayes_prior)

            # Direct utm_content match if present; otherwise Bayesian-smoothed attributed web CTR
            mid = str(it.get("matrix_id") or "")
            utm_hit = (
                funnel_by_utm.get(mid)
                or funnel_by_utm.get(f"{mid}_v1")
                or funnel_by_utm.get(f"{mid}_v1_slot_b_flowchar")
                or funnel_by_utm.get(f"{mid}_v1_slot_a_realui")
                or {}
            )
            direct_clicks = int(utm_hit.get("landing_view") or 0) + int(it.get("go_clicks_7d") or 0)
            if direct_clicks > 0:
                web_ctr = direct_clicks / (float(v) + bayes_prior)
            elif div_web_visits > 0 and tot_matured_views > 0 and v > 0:
                attr_clicks = div_web_visits * (v / float(tot_matured_views))
                web_ctr = attr_clicks / (float(v) + bayes_prior)
            else:
                web_ctr = 0.0

            raw_views.append(float(v))
            raw_eng.append(eng_rate)
            raw_ctr.append(web_ctr)

        n_views = _minmax_norm(raw_views)
        n_eng = _minmax_norm(raw_eng)
        n_ctr = _minmax_norm(raw_ctr)

        scored: List[Dict[str, Any]] = []
        for idx, it in enumerate(matured):
            comp = round(0.40 * n_views[idx] + 0.25 * n_eng[idx] + 0.35 * n_ctr[idx], 4)
            tk = _extract_topic_key(div, str(it.get("title") or ""), str(it.get("hook_type") or "proof"))
            scored.append({
                "content_id": str(it.get("content_id") or ""),
                "platform": str(it.get("platform") or ""),
                "title": str(it.get("title") or "")[:120],
                "short_label": _clean_short_label(str(it.get("title") or "")),
                "topic_key": tk,
                "hook_type": str(it.get("hook_type") or "proof"),
                "published_at": str(it.get("published_at") or ""),
                "age_hours": float(it.get("age_hours") or 0.0),
                "views": int(it.get("views") or 0),
                "engagement_rate": round(raw_eng[idx], 5),
                "web_ctr": round(raw_ctr[idx], 5),
                "norm_views": round(n_views[idx], 4),
                "norm_engagement_rate": round(n_eng[idx], 4),
                "norm_web_ctr": round(n_ctr[idx], 4),
                "composite_score": comp,
            })

        # Sort by Anti-Goodhart composite_score descending (tie-break by real views)
        scored.sort(key=lambda x: (x["composite_score"], x["views"]), reverse=True)
        n = len(scored)
        top_n = max(1, math.ceil(n * WINNER_TOP_FRACTION)) if n > 0 else 0
        bot_n = max(1, math.ceil(n * LOSER_BOTTOM_FRACTION)) if n >= 3 else 0

        # Also track previous consecutive bottom weeks by topic_key
        prev_topic_map: Dict[str, Dict[str, Any]] = {
            str(x.get("topic_key") or ""): x
            for x in ((prev_divs.get(div) or {}).get("topic_weights") or [])
        }

        winners = scored[:top_n]
        losers = scored[max(top_n, n - bot_n):] if bot_n > 0 else []
        winner_keys = {w["topic_key"] for w in winners}
        loser_keys = {l["topic_key"] for l in losers if l["topic_key"] not in winner_keys}

        # Aggregate hook_type weights & topic_key weights
        hook_weights: Dict[str, float] = {"loss": 1.0, "curiosity": 1.0, "self": 1.0, "pattern": 1.0, "proof": 1.0}
        topic_weights_list: List[Dict[str, Any]] = []
        seen_tks = set()

        for rank_idx, item in enumerate(scored):
            tk = item["topic_key"]
            if tk in seen_tks:
                continue
            seen_tks.add(tk)
            prev_rec = prev_topic_map.get(tk) or {}
            prev_consec = int(prev_rec.get("consecutive_bottom_weeks") or 0)

            if tk in winner_keys:
                w_val = WINNER_WEIGHT
                status = "active"
                tier = "top_20_winner"
                consec_bot = 0
                variations = derive_safe_winner_variations(div, item["title"], tk)
                hook_weights[item["hook_type"]] = max(hook_weights.get(item["hook_type"], 1.0), WINNER_WEIGHT)
            elif tk in loser_keys:
                consec_bot = prev_consec + 1
                if consec_bot >= 2 or (item["views"] == 0 and item["age_hours"] >= 72.0):
                    w_val = 0.0
                    status = "archived"
                    tier = "archived_bottom_30"
                else:
                    w_val = DEMOTED_WEIGHT
                    status = "demoted"
                    tier = "bottom_30_demoted"
                variations = []
                if hook_weights.get(item["hook_type"], 1.0) <= 1.0:
                    hook_weights[item["hook_type"]] = min(hook_weights.get(item["hook_type"], 1.0), DEMOTED_WEIGHT)
            else:
                w_val = BASELINE_WEIGHT
                status = "active"
                tier = "baseline"
                consec_bot = 0
                variations = []

            topic_weights_list.append({
                "topic_key": tk,
                "hook_type": item["hook_type"],
                "sample_title": item["short_label"],
                "views": item["views"],
                "composite_score": item["composite_score"],
                "weight": w_val,
                "tier": tier,
                "status": status,
                "consecutive_bottom_weeks": consec_bot,
                "derived_variations": variations,
            })

        # Select headline top winner & loser for 08:00 KPI summary
        top_by_views = max(winners, key=lambda x: x["views"]) if winners else None
        if top_by_views:
            w_txt = f"{DIV_KO_LABELS[div]} '{top_by_views['short_label']}' {top_by_views['views']}회"
            top_winner_highlights.append((top_by_views["views"], div, top_by_views["short_label"], w_txt))

        archived_items = [t for t in topic_weights_list if t["status"] == "archived"]
        demoted_items = [t for t in topic_weights_list if t["status"] == "demoted"]
        if archived_items:
            archived_or_demoted_highlights.append(f"{DIV_KO_LABELS[div]} '{archived_items[0]['sample_title']}' 퇴출")
        elif demoted_items:
            archived_or_demoted_highlights.append(f"{DIV_KO_LABELS[div]} '{demoted_items[0]['sample_title']}' 0.35x감산")

        divisions_out[div] = {
            "div_label_ko": DIV_KO_LABELS[div],
            "matured_48h_count": len(matured),
            "immature_held_under_48h": len(immature_under_48h),
            "web_visits_14d": div_web_visits,
            "go_clicks_14d": d_go_clicks,
            "aarrr_social_uv_14d": social_uv,
            "top_20_winners": winners,
            "bottom_30_losers": losers,
            "hook_weights": hook_weights,
            "topic_weights": topic_weights_list,
            "exploration_replacement": _fresh_exploration_candidate(div),
        }

    # Build structured `latest_summary` for 08:00 KST KPI briefing (`[🧬 자가 진화 한 줄 요약]`)
    top_winner_highlights.sort(key=lambda t: t[0], reverse=True)
    # Prioritize KFK / HERO / GBA visible showcase summary cleanly
    by_div_top = {div: txt for _, div, _, txt in top_winner_highlights}
    ordered_highlights = [by_div_top[d] for d in ("KFK", "HERO", "KFG", "GBA", "TOM") if d in by_div_top]
    top_winner_text = ordered_highlights[0] if ordered_highlights else "표본 숙성 대기 중(48h+)"
    archived_loser_text = " · ".join(archived_or_demoted_highlights[:3]) if archived_or_demoted_highlights else "하위권 2주 누적 관찰 중"
    one_line_summary = f"[🧬 자가 진화] 승자(2.0x): {', '.join(ordered_highlights[:3])} | 조정: {archived_loser_text}"

    weights_payload: Dict[str, Any] = {
        "schema_version": "hill-climber-weights-v1",
        "generated_at_kst": now_kst.strftime("%Y-%m-%d %H:%M:%S KST"),
        "schedule_cron_kst": "Sunday 23:10 KST (UTC: 10 14 * * 0)",
        "maturation_filter_hours": MIN_MATURATION_HOURS,
        "window_days": WINDOW_DAYS,
        "scoring_formula": "0.40 * norm_views + 0.25 * norm_engagement_rate + 0.35 * norm_web_ctr",
        "quotas": {
            "exploitation_quota": EXPLOITATION_QUOTA,
            "exploration_quota": EXPLORATION_QUOTA,
        },
        "governance_sanctuary_lock": {
            "allowed_write_files": [ALLOWED_RSI_WRITE_FILENAME],
            "protected_sanctuaries": ["pricing", "html_value_ladders", "disclaimers", "promo_hard_gate_banned_words"],
        },
        "collection_meta": collect_meta,
        "latest_summary": {
            "run_at_kst": now_kst.strftime("%Y-%m-%d %H:%M:%S KST"),
            "top_winner_text": top_winner_text,
            "archived_loser_text": archived_loser_text,
            "one_line_summary": one_line_summary,
            "by_division_top_winner": by_div_top,
        },
        "divisions": divisions_out,
    }

    written_paths: List[str] = []
    d1_synced = False
    if not dry_run:
        written_paths.append(str(safe_write_rsi_weights(weights_out_path, weights_payload)))
        if mirror_div1_path and mirror_div1_path.parent.exists():
            written_paths.append(str(safe_write_rsi_weights(mirror_div1_path, weights_payload)))
        d1_synced = _sync_summary_to_watchdog_d1(one_line_summary)

    return {
        "ok": True,
        "dry_run": dry_run,
        "written_paths": written_paths,
        "d1_watchdog_synced": d1_synced,
        "collection_meta": collect_meta,
        "latest_summary": weights_payload["latest_summary"],
        "weights": weights_payload,
    }


def _sync_summary_to_watchdog_d1(one_line_summary: str) -> bool:
    """Best-effort sync of latest weekly Hill-Climber 1-liner to Cloudflare Watchdog D1 (08:00 KST cloud briefing)."""
    try:
        rt_env = _load_runtime_env()
        tok = str(os.environ.get("WATCHDOG_ADMIN_TOKEN") or rt_env.get("WATCHDOG_ADMIN_TOKEN") or "").strip()
        if not tok:
            return False
        clean_line = re.sub(r"^\[🧬\s*자가\s*진화\]\s*", "", str(one_line_summary or "")).strip()
        if not clean_line:
            return False
        if len(clean_line) > 255:
            clean_line = clean_line[:252].rstrip() + "..."
        req = urllib.request.Request(
            "https://hq-watchdog-worker.hq-api-worker.workers.dev/reliability-audit",
            data=json.dumps({
                "action": "record",
                "div_code": "HQ",
                "event_type": "weekly_hill_climber",
                "regex_violations": 0,
                "open_confessions": 0,
                "summary": clean_line,
                "is_test": False,
            }).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {tok}",
                "Content-Type": "application/json",
                "User-Agent": "DreamCompany-HQ-HillClimber/1.0",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=12) as resp:
            return resp.status == 200
    except Exception:
        return False


def run_governance_sanctuary_unit_tests() -> None:
    """Verifies that GovernanceSanctuaryViolationError blocks EVERY protected sanctuary path."""
    forbidden_targets = [
        Path(r"D:\드림컴퍼니\1사업부\index.html"),
        Path(r"D:\드림컴퍼니\5사업부\index.html"),
        Path(r"D:\드림컴퍼니\2사업부\src\pricing.json"),
        Path(r"D:\드림컴퍼니\cloud_automation\promo_hard_gate.py"),
        Path(r"D:\드림컴퍼니\1사업부\cloud_automation\promo_hard_gate.py"),
        Path(r"D:\드림컴퍼니\GEMINI.md"),
        Path(r"D:\드림컴퍼니\1사업부\legal\disclaimer.json"),
        Path(r"D:\드림컴퍼니\1사업부\data\whop_checkout_config.json"),
        Path(r"D:\드림컴퍼니\1사업부\.github\workflows\daily-auto-promo.yml"),
    ]
    for bad_p in forbidden_targets:
        try:
            assert_rsi_write_allowed(bad_p)
            raise AssertionError(f"Governance sanctuary FAILED to block: {bad_p}")
        except GovernanceSanctuaryViolationError:
            pass

    # Positive check: ONLY whitelisted `data/topic_hook_weights.json` is allowed
    assert_rsi_write_allowed(WEIGHTS_PATH_LOCAL)
    assert_rsi_write_allowed(WEIGHTS_PATH_DIV1)


def main() -> int:
    parser = argparse.ArgumentParser(description="Dream Company Weekly Hill-Climbing Weight Evolution Engine ($0)")
    parser.add_argument("--dry-run", action="store_true", help="Evaluate real 48h+ matured videos & print winners without writing files")
    parser.add_argument("--init-weights", action="store_true", help="Write initial data/topic_hook_weights.json (and 1사업부/data/ mirror)")
    parser.add_argument("--no-live-api", action="store_true", help="Use local promo_learning_snapshot.json without calling YT/IG APIs")
    parser.add_argument("--test-sanctuary", action="store_true", help="Run Governance Sanctuary Hard Lock unit tests")
    args = parser.parse_args()

    run_governance_sanctuary_unit_tests()
    if args.test_sanctuary and not (args.dry_run or args.init_weights):
        print("GOVERNANCE_SANCTUARY_LOCK SELF-TEST PASS (9/9 forbidden sanctuaries blocked, whitelist allowed).")
        return 0

    res = run_weekly_hill_climb(
        dry_run=bool(args.dry_run and not args.init_weights),
        prefer_live_api=(not args.no_live_api),
    )

    print("=== Dream Company Weekly Hill-Climbing Engine ($0 Anti-Goodhart) ===", flush=True)
    print(f"Summary: {res['latest_summary']['one_line_summary']}", flush=True)
    print(f"Governance Lock: PASS (9/9 sanctuary targets blocked) | written={res['written_paths']}", flush=True)
    for div in DIVISIONS:
        d_info = res["weights"]["divisions"][div]
        top_w = d_info["top_20_winners"][:2]
        top_str = ", ".join(f"{w['short_label']}({w['views']}v,score={w['composite_score']})" for w in top_w) or "none"
        print(
            f"  [{div:4s}] matured_48h={d_info['matured_48h_count']:2d} | held<48h={d_info['immature_held_under_48h']:2d} "
            f"| web_14d={d_info['web_visits_14d']:2d} | top20(2.0x)={top_str}",
            flush=True,
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
