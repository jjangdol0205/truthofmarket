#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/ab_evolution_engine.py
================================================================================
Standing Directive #29 (2026-11-25):
5-Division 3-Tier Unified Performance Collector & 2-Phase Safe Self-Learning Engine

1. 3-Tier Unified Performance Collection (TOM / KFG / GBA / HERO / KFK, 14-day window):
   - Tier 1 (Top Acquisition): YouTube Data API v3 (`channels` -> `playlistItems` -> `videos`)
     + Instagram Graph API (`media` + lightweight `insights`, Meta 4-Rule safe, zero OAuthException storm)
   - Tier 2 (Mid-Funnel Clicks): Central D1 `/go/` clicks (`GET /api/admin/go-summary?days=14`, `is_test=0`)
   - Tier 3 (Bottom Conversions): Cloudflare D1 `funnel_events` (`is_qa=0`: landing_view, quiz_complete,
     email_signup, checkout_click, paid_success, story_submit, share_click, gift_download)

2. Division-Tailored Reward Functions:
   - TOM / KFG / GBA / KFK: Views & Engagement (40%) + `/go/` & Site Clicks (30%) + Survey/Email/Paid Conversions (30%)
   - HERO (Baek Woon-ho): Views & Retention Proxy (35%) + Comments & Story Submissions (35%) + Kakao Card & Curation Clicks (30%)

3. 2-Phase Safety Gate (`SHADOW_START_DATE = '2026-11-25'`, `SHADOW_DAYS = 14`, Unlock `'2026-12-09'`):
   - Phase 1 (`shadow_14d`, Day 1..14): Pure measurement, scoring, `data/promo_learning_snapshot.json` save,
     and Central D1 ingest (`POST /api/admin/promo-learning-ingest`).
     STRICT ZERO MUTATION LOCK on `data/message_matrix_5div.json`!
   - Phase 2 (`active_evolve`, Day 15+): Per-division independent sample gate
     (`(sample_videos >= 10 AND sample_views >= 500) OR sample_go_clicks >= 20`),
     Explore 30% : Exploit 70% balance (winner weight max 2.5x, explore floor >= 0.75,
     bottom 20% paused ONLY when relative gap >= 20%), ZERO mechanical prefixes,
     and Fail-Closed `promo_hard_gate.check_promo_hard_gate` required on every promoted cell.
================================================================================
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import math
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

sys.path.insert(0, str(Path(__file__).resolve().parent))
from outbound_allowlist import (  # noqa: E402
    ALLOWED_IG_ACCOUNTS,
    assert_allowed_ig_target,
    assert_allowed_yt_channel,
    sanitize_and_classify_ig_token,
)
from promo_hard_gate import check_promo_hard_gate  # noqa: E402

KST = dt.timezone(dt.timedelta(hours=9))
UTC = dt.timezone.utc

ROOT = Path(__file__).resolve().parent.parent
MATRIX_PATH = ROOT / "data" / "message_matrix_5div.json"
SNAPSHOT_PATH = ROOT / "data" / "promo_learning_snapshot.json"
PROMO_HISTORY_PATH = ROOT / "data" / "promo_history.json"
D1_DB_ID = "5fca0c1f-64cb-4277-85c4-b2ee9944bc06"
CENTRAL_API_BASE = "https://api.truthofmarket.com"

DIVISIONS = ("TOM", "KFG", "GBA", "HERO", "KFK")
HOOK_TYPES = ("loss", "curiosity", "self", "pattern", "proof")
ALLOWED_PLATFORMS = (
    "youtube_shorts",
    "youtube_longform",
    "instagram_reels",
    "instagram_carousel",
    "pseo",
    "go_redirect",
)

# 2-Phase Safe Activation Schedule
SHADOW_START_DATE = "2026-11-25"
SHADOW_DAYS = 14
ACTIVE_UNLOCK_DATE = "2026-12-09"

# Phase 2 Exploration/Exploitation Guardrails
EXPLORE_RATIO = 0.30
EXPLOIT_RATIO = 0.70
MAX_WINNER_WEIGHT = 2.5
MIN_EXPLORE_WEIGHT = 0.75
MIN_RELATIVE_GAP_PCT = 20.0
MIN_GATE_VIDEOS = 10
MIN_GATE_VIEWS = 500
MIN_GATE_GO_CLICKS = 20


# ==============================================================================
# 0. Safe Environment & Credential Loader (Cloud Env First -> Local .env / Vault)
# ==============================================================================
def _load_runtime_env() -> Dict[str, str]:
    merged: Dict[str, str] = {}
    for cand in (ROOT / ".env", ROOT.parent / ".env", Path(r"D:\드림컴퍼니\.env")):
        if cand.exists():
            try:
                for raw in cand.read_text(encoding="utf-8", errors="ignore").splitlines():
                    s = raw.strip()
                    if not s or s.startswith("#") or "=" not in s:
                        continue
                    k, v = s.split("=", 1)
                    merged.setdefault(k.strip(), v.strip().strip('"').strip("'"))
            except Exception:
                pass
            break
    # Process environment (GitHub Actions secrets) always overrides local .env
    for k, v in os.environ.items():
        if v is not None and str(v).strip() != "":
            merged[k] = str(v).strip()
    return merged


def _load_ig_credentials(div: str, env: Dict[str, str]) -> Tuple[str, str]:
    div_u = div.upper()
    tok = env.get(f"IG_ACCESS_TOKEN_{div_u}", "").strip()
    uid = (env.get(f"IG_USER_ID_{div_u}", "") or ALLOWED_IG_ACCOUNTS.get(div_u, {}).get("ig_user_id", "")).strip()
    if tok:
        return tok, uid
    # Local fallback: read local instagram_api_vault.json cleanly (never logs secrets)
    for vpath in (
        ROOT / "shorts_automation_hq" / "data" / "instagram_api_vault.json",
        ROOT.parent / "shorts_automation_hq" / "data" / "instagram_api_vault.json",
        Path(r"D:\드림컴퍼니\shorts_automation_hq\data\instagram_api_vault.json"),
    ):
        if vpath.exists():
            try:
                vault = json.loads(vpath.read_text(encoding="utf-8"))
                d_ent = (vault.get("divisions") or {}).get(div_u) or {}
                tok = str(d_ent.get("access_token") or "").strip()
                uid = str(d_ent.get("ig_user_id") or uid).strip()
                if tok:
                    return tok, uid
            except Exception:
                pass
            break
    return "", uid


# ==============================================================================
# 1. Matrix Loader & 70:30 Explore/Exploit Selector (100% Backward Compatible)
# ==============================================================================
def load_matrix(path: Path = MATRIX_PATH) -> Optional[Dict[str, Any]]:
    for cand in (path, ROOT.parent / "data" / "message_matrix_5div.json", Path(r"D:\드림컴퍼니\data\message_matrix_5div.json")):
        if cand.exists():
            try:
                return json.loads(cand.read_text(encoding="utf-8"))
            except Exception:
                pass
    return None


def select_stage12_ab_cell(matrix_db: Dict[str, Any], div: str, date_str: str, arm_idx: int = 0) -> Optional[Dict[str, Any]]:
    """
    Selects an active Stage 1-2 cell balancing 70% Exploitation (highest-weight winning hook_type)
    and 30% Exploration (uniform across all active hook_types) with Hard Gate verification.
    """
    div_u = div.upper()
    d_obj = (matrix_db.get("divisions") or {}).get(div_u)
    if not d_obj:
        return None
    cells = [c for c in (d_obj.get("matrix") or []) if c.get("stage") in (1, 2) and c.get("status", "active") != "paused"]
    if not cells:
        cells = [c for c in (d_obj.get("matrix") or []) if c.get("stage") in (1, 2)]
    if not cells:
        return None

    # Deterministic bucket 0..99: 0..29 => 30% Exploration, 30..99 => 70% Exploitation
    h_int = int(hashlib.md5(f"{div_u}:{date_str}:{arm_idx}".encode("utf-8")).hexdigest()[:8], 16)
    bucket = h_int % 100
    is_explore = bucket < int(EXPLORE_RATIO * 100)

    if is_explore:
        target_ht = HOOK_TYPES[(h_int // 100) % len(HOOK_TYPES)]
        pool = [c for c in cells if c.get("hook_type") == target_ht] or cells
        pool.sort(key=lambda c: hashlib.md5(f"exp:{date_str}:{arm_idx}:{c['id']}".encode()).hexdigest())
        return dict(pool[0])

    # 70% Exploit: weight-prioritized selection across active cells
    day_seed = int(hashlib.md5(f"{div_u}:{date_str}".encode("utf-8")).hexdigest()[:6], 16)
    max_w = max(float(c.get("weight", 1.0)) for c in cells)
    if max_w > 1.05:
        # Favor promoted winners while preserving variety among ties
        pool = sorted(
            cells,
            key=lambda c: (
                float(c.get("weight", 1.0)),
                int(hashlib.md5(f"{date_str}:{arm_idx}:{c['id']}".encode("utf-8")).hexdigest()[:4], 16) / 65536.0,
            ),
            reverse=True,
        )
        return dict(pool[0])

    target_ht = HOOK_TYPES[(day_seed + arm_idx) % len(HOOK_TYPES)]
    filtered = [c for c in cells if c.get("hook_type") == target_ht] or cells
    filtered.sort(
        key=lambda c: (
            float(c.get("weight", 1.0)),
            int(hashlib.md5(f"{date_str}:{arm_idx}:{c['id']}".encode("utf-8")).hexdigest()[:4], 16) / 65536.0,
        ),
        reverse=True,
    )
    return dict(filtered[0])


# ==============================================================================
# 2. Phase Calculator (Phase 1 Shadow 14d -> Phase 2 Active Evolve on 2026-12-09)
# ==============================================================================
def compute_learning_phase(eval_date: Optional[dt.date] = None, force_shadow: bool = False) -> Tuple[str, int]:
    today_d = eval_date or dt.datetime.now(KST).date()
    start_d = dt.date.fromisoformat(SHADOW_START_DATE)
    unlock_d = dt.date.fromisoformat(ACTIVE_UNLOCK_DATE)
    shadow_day = max(1, (today_d - start_d).days + 1)
    if force_shadow or today_d < unlock_d or shadow_day <= SHADOW_DAYS:
        return "shadow_14d", shadow_day
    return "active_evolve", shadow_day


# ==============================================================================
# 3. Hook-Type & Matrix-ID Resolver (Matches History -> Matrix -> Clean Heuristic)
# ==============================================================================
def _build_history_lookup() -> Tuple[Dict[str, Dict[str, str]], Dict[str, Dict[str, str]]]:
    yt_map: Dict[str, Dict[str, str]] = {}
    ig_map: Dict[str, Dict[str, str]] = {}
    for cand in (PROMO_HISTORY_PATH, ROOT.parent / "data" / "promo_history.json", Path(r"D:\드림컴퍼니\data\promo_history.json")):
        if cand.exists():
            try:
                hist = json.loads(cand.read_text(encoding="utf-8"))
                for u in hist.get("uploads") or []:
                    meta = {
                        "matrix_id": str(u.get("matrix_id") or u.get("topic_id") or ""),
                        "hook_type": str(u.get("hook_type") or ""),
                    }
                    if u.get("yt_video_id"):
                        yt_map[str(u["yt_video_id"])] = meta
                    if u.get("ig_media_id"):
                        ig_map[str(u["ig_media_id"])] = meta
            except Exception:
                pass
            break
    return yt_map, ig_map


def infer_hook_type_and_matrix(
    div: str,
    title: str,
    matrix_db: Optional[Dict[str, Any]],
    hist_meta: Optional[Dict[str, str]] = None,
) -> Tuple[str, str]:
    if hist_meta and hist_meta.get("hook_type") in HOOK_TYPES:
        return hist_meta["hook_type"], hist_meta.get("matrix_id", "")

    t_low = (title or "").lower()
    if matrix_db:
        cells = ((matrix_db.get("divisions") or {}).get(div.upper()) or {}).get("matrix") or []
        for c in cells:
            hl = str(c.get("hook_line") or "").strip().lower()
            if hl and len(hl) >= 16 and (hl[:26] in t_low or t_low[:26] in hl):
                return str(c.get("hook_type") or "proof"), str(c.get("id") or "")

    # Clean deterministic fallback heuristic across KO/EN/JA
    if re.search(r"\?|？|왜|why|なぜ|本当|진짜|정체|비밀|secret", t_low):
        return "curiosity", (hist_meta or {}).get("matrix_id", "")
    if re.search(r"stop|myth|don't|착각|오해|誤解|ではなく|반전|not ", t_low):
        return "pattern", (hist_meta or {}).get("matrix_id", "")
    if re.search(r"age\s*\d|50代|60代|70代|초등|어머님|아버님|parent|retire|살|세|학년", t_low):
        return "self", (hist_meta or {}).get("matrix_id", "")
    if re.search(r"%|cdc|질병관리청|2000|2008|2022|25年|cm|inch|통계|data|math|1,800|360|5/100|0\.01", t_low):
        return "proof", (hist_meta or {}).get("matrix_id", "")
    return "loss", (hist_meta or {}).get("matrix_id", "")


def _parse_iso_duration_sec(iso_dur: str) -> int:
    m = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso_dur or "")
    if not m:
        return 0
    return int(m.group(1) or 0) * 3600 + int(m.group(2) or 0) * 60 + int(m.group(3) or 0)


# ==============================================================================
# 4. Tier 1 Collectors: YouTube Data API v3 + Instagram Graph API (14-Day Window)
# ==============================================================================
def _refresh_yt_access_token(div: str, env: Dict[str, str]) -> Optional[str]:
    div_u = div.upper()
    use_p2 = div_u in ("HERO", "KFK")
    cid = env.get(f"YT_CLIENT_ID_{div_u}") or (env.get("YT_CLIENT_ID_2") if use_p2 else "") or env.get("YT_CLIENT_ID", "")
    csec = env.get(f"YT_CLIENT_SECRET_{div_u}") or (env.get("YT_CLIENT_SECRET_2") if use_p2 else "") or env.get("YT_CLIENT_SECRET", "")
    rtok = env.get(f"YT_REFRESH_TOKEN_{div_u}", "")
    if not (cid and csec and rtok):
        return None
    data = urllib.parse.urlencode({
        "client_id": cid, "client_secret": csec, "refresh_token": rtok, "grant_type": "refresh_token",
    }).encode("utf-8")
    try:
        with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=data, method="POST"), timeout=20) as r:
            return json.loads(r.read().decode("utf-8")).get("access_token")
    except Exception:
        return None


def collect_youtube_14d(
    div: str,
    env: Dict[str, str],
    matrix_db: Optional[Dict[str, Any]],
    yt_hist_map: Dict[str, Dict[str, str]],
    days: int = 14,
) -> List[Dict[str, Any]]:
    """Collects last 14 days of public videos from YouTube Data API v3 (graceful per-div error isolation)."""
    div_u = div.upper()
    tok = _refresh_yt_access_token(div_u, env)
    if not tok:
        return []

    def _yt_get(path: str) -> Optional[Dict[str, Any]]:
        req = urllib.request.Request(f"https://www.googleapis.com/youtube/v3{path}", headers={"Authorization": f"Bearer {tok}"})
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read().decode("utf-8"))

    items: List[Dict[str, Any]] = []
    try:
        ch = _yt_get("/channels?part=id,contentDetails&mine=true")
        it0 = ((ch or {}).get("items") or [{}])[0]
        ch_id = str(it0.get("id") or "")
        if ch_id:
            assert_allowed_yt_channel(div_u, ch_id)
        up_pl = ((it0.get("contentDetails") or {}).get("relatedPlaylists") or {}).get("uploads", "")
        if not up_pl:
            return []
        pl = _yt_get(f"/playlistItems?part=snippet&maxResults=30&playlistId={up_pl}")
        vids = [x["snippet"]["resourceId"]["videoId"] for x in ((pl or {}).get("items") or []) if x.get("snippet")]
        if not vids:
            return []
        vi = _yt_get(f"/videos?part=snippet,contentDetails,statistics,status&id={','.join(vids[:30])}")
        now_u = dt.datetime.now(UTC)
        cutoff = now_u - dt.timedelta(days=days)
        for v in (vi or {}).get("items") or []:
            if (v.get("status") or {}).get("privacyStatus") != "public":
                continue
            sn = v.get("snippet") or {}
            pub_str = str(sn.get("publishedAt") or "")
            try:
                pub_dt = dt.datetime.fromisoformat(pub_str.replace("Z", "+00:00"))
            except Exception:
                continue
            if pub_dt < cutoff:
                continue
            vid = str(v["id"])
            title = str(sn.get("title") or "")[:180]
            dur_sec = _parse_iso_duration_sec((v.get("contentDetails") or {}).get("duration", ""))
            platform = "youtube_shorts" if (dur_sec <= 65 or "#shorts" in title.lower()) else "youtube_longform"
            st = v.get("statistics") or {}
            views = int(st.get("viewCount") or 0)
            likes = int(st.get("likeCount") or 0)
            comments = int(st.get("commentCount") or 0)
            age_days = max(0.5, (now_u - pub_dt).total_seconds() / 86400.0)
            ht, mid = infer_hook_type_and_matrix(div_u, title, matrix_db, yt_hist_map.get(vid))
            items.append({
                "div_code": div_u,
                "platform": platform,
                "content_id": vid,
                "title": title,
                "hook_type": ht,
                "matrix_id": mid,
                "published_at": pub_str,
                "views": views,
                "views_per_day": round(views / age_days, 2),
                "likes": likes,
                "comments": comments,
                "saves": 0,
                "shares": 0,
                "go_clicks_7d": 0,
                "site_conversions_7d": 0,
                "reward_score": 0.0,
            })
    except Exception as exc:
        print(f"  [YT COLLECT SKIP {div_u}] {type(exc).__name__}: {str(exc)[:140]}", flush=True)
    return items


def collect_instagram_14d(
    div: str,
    env: Dict[str, str],
    matrix_db: Optional[Dict[str, Any]],
    ig_hist_map: Dict[str, Dict[str, str]],
    days: int = 14,
) -> List[Dict[str, Any]]:
    """
    Collects last 14 days of Instagram media & lightweight insights.
    Strictly honors Meta 4-Rule Safety: ZERO retry storms on OAuthException!
    """
    div_u = div.upper()
    raw_tok, ig_uid = _load_ig_credentials(div_u, env)
    if not (raw_tok and ig_uid):
        return []
    tinfo = sanitize_and_classify_ig_token(raw_tok)
    if not tinfo.get("ok"):
        return []
    ig_tok = str(tinfo["token"])
    try:
        ig_uid = assert_allowed_ig_target(div_u, ig_uid)
    except Exception:
        return []

    base_host = "https://graph.instagram.com" if tinfo.get("family") == "IGAA" else "https://graph.facebook.com/v21.0"
    items: List[Dict[str, Any]] = []
    try:
        m_url = (
            f"{base_host}/{ig_uid}/media"
            f"?fields=id,caption,media_type,media_product_type,timestamp,like_count,comments_count"
            f"&limit=20&access_token={urllib.parse.quote(ig_tok)}"
        )
        with urllib.request.urlopen(urllib.request.Request(m_url, headers={"User-Agent": "DC-AB-IG/1.0"}), timeout=20) as r:
            media_list = json.loads(r.read().decode("utf-8")).get("data") or []
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:160]
        print(f"  [IG COLLECT STOP {div_u}] HTTP {e.code} (no retry): {body}", flush=True)
        return []
    except Exception as exc:
        print(f"  [IG COLLECT SKIP {div_u}] {type(exc).__name__}: {str(exc)[:120]}", flush=True)
        return []

    now_u = dt.datetime.now(UTC)
    cutoff = now_u - dt.timedelta(days=days)
    oauth_stopped = False

    for m in media_list[:15]:
        ts_str = str(m.get("timestamp") or "")
        try:
            pub_dt = dt.datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
        except Exception:
            continue
        if pub_dt < cutoff:
            continue

        mid_str = str(m.get("id") or "")
        cap = str(m.get("caption") or "")
        first_line = (cap.splitlines()[0] if cap.splitlines() else cap).strip()[:160]
        mtype = str(m.get("media_type") or "").upper()
        platform = "instagram_carousel" if mtype == "CAROUSEL_ALBUM" else "instagram_reels"

        likes = int(m.get("like_count") or 0)
        comments = int(m.get("comments_count") or 0)
        plays = 0
        reach = 0
        saves = 0
        shares = 0

        if not oauth_stopped:
            metrics_q = "reach,saved,shares" if platform == "instagram_carousel" else "plays,reach,saved,shares"
            ins_url = f"{base_host}/{mid_str}/insights?metric={metrics_q}&access_token={urllib.parse.quote(ig_tok)}"
            try:
                with urllib.request.urlopen(urllib.request.Request(ins_url, headers={"User-Agent": "DC-AB-IG/1.0"}), timeout=12) as ir:
                    ins_data = json.loads(ir.read().decode("utf-8")).get("data") or []
                for entry in ins_data:
                    nm = str(entry.get("name") or "")
                    vals = entry.get("values") or [{}]
                    v0 = int((vals[0] or {}).get("value") or 0)
                    if nm == "plays":
                        plays = v0
                    elif nm == "reach":
                        reach = v0
                    elif nm == "saved":
                        saves = v0
                    elif nm == "shares":
                        shares = v0
            except urllib.error.HTTPError as e:
                err_b = e.read().decode("utf-8", errors="replace")
                if "OAuthException" in err_b or e.code in (401, 403):
                    oauth_stopped = True
            except Exception:
                pass

        views = plays if plays > 0 else reach
        age_days = max(0.5, (now_u - pub_dt).total_seconds() / 86400.0)
        ht, mat_id = infer_hook_type_and_matrix(div_u, first_line or cap[:120], matrix_db, ig_hist_map.get(mid_str))
        items.append({
            "div_code": div_u,
            "platform": platform,
            "content_id": mid_str,
            "title": first_line or f"IG {platform} {mid_str}",
            "hook_type": ht,
            "matrix_id": mat_id,
            "published_at": ts_str,
            "views": views,
            "views_per_day": round(views / age_days, 2),
            "likes": likes,
            "comments": comments,
            "saves": saves,
            "shares": shares,
            "go_clicks_7d": 0,
            "site_conversions_7d": 0,
            "reward_score": 0.0,
        })
    return items


# ==============================================================================
# 5. Tier 2 (/go/ clicks) & Tier 3 (D1 funnel_events) Collectors
# ==============================================================================
def _query_d1_sql(account_id: str, api_token: str, sql: str, params: Optional[List[Any]] = None) -> List[Dict[str, Any]]:
    if not (account_id and api_token):
        return []
    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{D1_DB_ID}/query"
    payload: Dict[str, Any] = {"sql": sql}
    if params is not None:
        payload["params"] = params
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_token}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            body = json.loads(r.read().decode("utf-8"))
        return ((body.get("result") or [{}])[0]).get("results") or []
    except Exception:
        return []


def collect_d1_go_clicks(env: Dict[str, str], days: int = 14) -> Dict[str, Dict[str, Any]]:
    """Tier 2: Fetches /go/ clicks (is_test=0) from Central Admin API (with direct D1 fallback)."""
    res: Dict[str, Dict[str, Any]] = {d: {"total_clicks": 0, "slugs": {}} for d in DIVISIONS}
    admin_tok = env.get("WATCHDOG_ADMIN_TOKEN", "").strip()
    if admin_tok:
        ep = f"{CENTRAL_API_BASE}/api/admin/go-summary?days={int(days)}"
        try:
            req = urllib.request.Request(ep, headers={"Authorization": f"Bearer {admin_tok}", "User-Agent": "DC-AB-Learn/1.0"})
            with urllib.request.urlopen(req, timeout=15) as r:
                data = json.loads(r.read().decode("utf-8"))
            if data.get("ok"):
                for row in data.get("by_division") or []:
                    dc = str(row.get("div_code") or "").upper()
                    if dc in res:
                        res[dc]["total_clicks"] = int(row.get("clicks") or 0)
                for row in data.get("top_slugs") or []:
                    dc = str(row.get("div_code") or "").upper()
                    sl = str(row.get("slug") or "")
                    if dc in res and sl:
                        res[dc]["slugs"][sl] = int(row.get("clicks") or 0)
                return res
        except Exception as exc:
            print(f"  [GO-SUMMARY API FALLBACK] {exc}", flush=True)

    # Direct Cloudflare D1 fallback
    acct = env.get("CLOUDFLARE_ACCOUNT_ID", "").strip()
    cf_tok = env.get("CLOUDFLARE_API_TOKEN", "").strip()
    rows = _query_d1_sql(
        acct, cf_tok,
        f"SELECT div_code, COALESCE(slug,'yt') AS slug, COUNT(*) AS clicks FROM go_clicks "
        f"WHERE COALESCE(is_test, 0) = 0 AND created_at >= datetime('now', '-{int(days)} days') "
        f"GROUP BY div_code, slug;",
    )
    for row in rows:
        dc = str(row.get("div_code") or "").upper()
        sl = str(row.get("slug") or "yt")
        c = int(row.get("clicks") or 0)
        if dc in res:
            res[dc]["total_clicks"] += c
            res[dc]["slugs"][sl] = res[dc]["slugs"].get(sl, 0) + c
    return res


def collect_d1_funnel_events(env: Dict[str, str], days: int = 14) -> Tuple[Dict[str, Dict[str, int]], Dict[str, Dict[str, int]]]:
    """Tier 3: Fetches D1 funnel_events (is_qa=0) aggregated by division AND by utm_content."""
    by_div: Dict[str, Dict[str, int]] = {
        d: {
            "landing_view": 0, "quiz_complete": 0, "email_signup": 0,
            "checkout_click": 0, "paid_success": 0, "story_submit": 0,
            "share_click": 0, "gift_download": 0, "total_conversions": 0,
        }
        for d in DIVISIONS
    }
    by_utm: Dict[str, Dict[str, int]] = {}
    acct = env.get("CLOUDFLARE_ACCOUNT_ID", "").strip()
    cf_tok = env.get("CLOUDFLARE_API_TOKEN", "").strip()
    if not (acct and cf_tok):
        return by_div, by_utm

    sql_qa = (
        f"SELECT UPPER(COALESCE(div_code,'')) AS dc, COALESCE(utm_content,'') AS uc, event_name, COUNT(*) AS c "
        f"FROM funnel_events WHERE created_at >= datetime('now', '-{int(days)} days') AND COALESCE(is_qa, 0) = 0 "
        f"GROUP BY dc, uc, event_name;"
    )
    rows = _query_d1_sql(acct, cf_tok, sql_qa)
    if not rows:
        sql_no_qa = (
            f"SELECT UPPER(COALESCE(div_code,'')) AS dc, COALESCE(utm_content,'') AS uc, event_name, COUNT(*) AS c "
            f"FROM funnel_events WHERE created_at >= datetime('now', '-{int(days)} days') "
            f"GROUP BY dc, uc, event_name;"
        )
        rows = _query_d1_sql(acct, cf_tok, sql_no_qa)

    conv_events = ("quiz_complete", "email_signup", "checkout_click", "paid_success", "story_submit", "share_click", "gift_download")
    for row in rows:
        dc = str(row.get("dc") or "").upper()
        uc = str(row.get("uc") or "").strip()
        ev = str(row.get("event_name") or "").strip()
        cnt = int(row.get("c") or 0)
        if dc in by_div:
            if ev in by_div[dc]:
                by_div[dc][ev] += cnt
            if ev in conv_events:
                by_div[dc]["total_conversions"] += cnt
        if uc:
            b = by_utm.setdefault(uc, {"landing_view": 0, "conversions": 0, "checkout_click": 0, "paid_success": 0})
            if ev == "landing_view":
                b["landing_view"] += cnt
            elif ev in conv_events:
                b["conversions"] += cnt
                if ev in ("checkout_click", "paid_success"):
                    b[ev] += cnt
    return by_div, by_utm


# Backward-compatible helper name for legacy tests/callers
def fetch_d1_metrics(account_id: str, api_token: str) -> Dict[str, Dict[str, int]]:
    _, by_utm = collect_d1_funnel_events({"CLOUDFLARE_ACCOUNT_ID": account_id, "CLOUDFLARE_API_TOKEN": api_token}, days=7)
    return {
        uc: {
            "impressions": 0,
            "landing_clicks": v.get("landing_view", 0),
            "quiz_completes": v.get("conversions", 0),
            "checkout_clicks": v.get("checkout_click", 0) + v.get("paid_success", 0),
        }
        for uc, v in by_utm.items()
    }


# ==============================================================================
# 6. Division-Tailored Reward Functions (TOM/KFG/GBA/KFK vs HERO)
# ==============================================================================
def compute_item_reward_score(
    div: str,
    item: Dict[str, Any],
    div_go_info: Dict[str, Any],
    div_funnel: Dict[str, int],
) -> float:
    """
    Computes bounded [0..100] division-tailored reward score:
      - TOM / KFG / GBA / KFK:
          Views & Engagement (40%) + `/go/` & Site Clicks (30%) + Survey/Email/Checkout/Paid Conversions (30%)
      - HERO (Baek Woon-ho):
          Views & Watch-Retention Proxy (35%) + Comments & Story Submissions (35%) + Kakao Card & Market Clicks (30%)
    """
    div_u = div.upper()
    views = max(0, int(item.get("views") or 0))
    vpd = max(0.0, float(item.get("views_per_day") or 0.0))
    likes = max(0, int(item.get("likes") or 0))
    comments = max(0, int(item.get("comments") or 0))
    saves = max(0, int(item.get("saves") or 0))
    shares = max(0, int(item.get("shares") or 0))
    go_clicks = max(0, int(item.get("go_clicks_7d") or 0))
    convs = max(0, int(item.get("site_conversions_7d") or 0))

    if div_u == "HERO":
        like_ratio_bonus = min(1.0, (likes / max(1.0, float(views))) * 12.0) * 20.0
        views_ret = min(100.0, 16.0 * math.log1p(vpd) + 7.5 * math.log1p(views) + like_ratio_bonus)
        story_sub = int(div_funnel.get("story_submit") or 0)
        comm_story = min(100.0, 30.0 * math.log1p(comments * 2.0 + story_sub * 1.5))
        slugs = div_go_info.get("slugs") or {}
        card_mkt_clicks = (
            int(div_funnel.get("gift_download") or 0)
            + int(div_funnel.get("share_click") or 0)
            + int(slugs.get("yt-card") or 0)
            + int(slugs.get("yt-radio") or 0)
            + int(slugs.get("market") or 0)
            + go_clicks
        )
        card_mkt = min(100.0, 26.0 * math.log1p(card_mkt_clicks))
        return round(0.35 * views_ret + 0.35 * comm_story + 0.30 * card_mkt, 2)

    views_eng = min(
        100.0,
        16.0 * math.log1p(vpd) + 6.5 * math.log1p(views) + 12.0 * math.log1p(likes + comments * 2 + saves * 2 + shares * 3),
    )
    landing_v = int(div_funnel.get("landing_view") or 0)
    clicks_part = min(100.0, 26.0 * math.log1p(go_clicks + min(landing_v, 50) * 0.25))
    paid_w = int(div_funnel.get("paid_success") or 0) * 8 + int(div_funnel.get("checkout_click") or 0) * 3
    conv_part = min(100.0, 30.0 * math.log1p(convs + paid_w * 0.25))
    return round(0.40 * views_eng + 0.30 * clicks_part + 0.30 * conv_part, 2)


# ==============================================================================
# 7. Central D1 Ingest Client (`POST /api/admin/promo-learning-ingest`)
# ==============================================================================
def ingest_to_central_d1(payload: Dict[str, Any], env: Dict[str, str], chunk_size: int = 35) -> Dict[str, Any]:
    """
    Posts 3-tier items & runs to Central D1 Worker in safe 35-item chunks
    (prevents Cloudflare Worker / D1 per-request timeout on 150+ items!).
    """
    admin_tok = env.get("WATCHDOG_ADMIN_TOKEN", "").strip()
    if not admin_tok:
        return {"ok": False, "skipped": "missing_WATCHDOG_ADMIN_TOKEN"}
    ep = f"{CENTRAL_API_BASE}/api/admin/promo-learning-ingest"
    items = list(payload.get("items") or [])
    runs = list(payload.get("runs") or [])

    chunks: List[Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]] = []
    if not items:
        chunks.append(([], runs))
    else:
        for i in range(0, len(items), chunk_size):
            batch_items = items[i : i + chunk_size]
            is_last = (i + chunk_size) >= len(items)
            chunks.append((batch_items, runs if is_last else []))

    total_ingested_items = 0
    total_ingested_runs = 0
    responses: List[Dict[str, Any]] = []

    for c_idx, (c_items, c_runs) in enumerate(chunks, start=1):
        chunk_payload = {
            "run_week": payload["run_week"],
            "phase": payload["phase"],
            "shadow_day": payload["shadow_day"],
            "is_test": bool(payload.get("is_test", False)),
            "items": c_items,
            "runs": c_runs,
        }
        req = urllib.request.Request(
            ep,
            data=json.dumps(chunk_payload, ensure_ascii=False).encode("utf-8"),
            method="POST",
            headers={
                "Authorization": f"Bearer {admin_tok}",
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": "DC-AB-Ingest/2.1",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                body = json.loads(r.read().decode("utf-8"))
                responses.append({"chunk": c_idx, "status": r.status, "items": len(c_items), "runs": len(c_runs), "ok": bool(body.get("ok", True))})
                total_ingested_items += len(c_items)
                total_ingested_runs += len(c_runs)
        except urllib.error.HTTPError as e:
            return {
                "ok": False,
                "failed_chunk": c_idx,
                "http_status": e.code,
                "error": e.read().decode("utf-8", errors="replace")[:300],
                "partial": responses,
            }
        except Exception as exc:
            return {"ok": False, "failed_chunk": c_idx, "error": str(exc)[:220], "partial": responses}

    return {
        "ok": True,
        "chunks": len(chunks),
        "ingested_items": total_ingested_items,
        "ingested_runs": total_ingested_runs,
        "responses": responses,
    }


# ==============================================================================
# 8. Core 2-Phase Evaluation & Safe Evolution Orchestrator
# ==============================================================================
def _passes_cell_hard_gate(div: str, cell: Dict[str, Any]) -> Tuple[bool, List[str]]:
    txt = f"{cell.get('hook_line', '')}\n{cell.get('slide_script_body', '')}\n{cell.get('cta', '')}"
    return check_promo_hard_gate(div, txt, surface="youtube_desc")


def run_promo_learning_cycle(
    matrix_path: Path = MATRIX_PATH,
    snapshot_path: Path = SNAPSHOT_PATH,
    eval_date: Optional[dt.date] = None,
    force_shadow: bool = False,
    dry_run: bool = False,
    injected_items: Optional[List[Dict[str, Any]]] = None,
    injected_go: Optional[Dict[str, Dict[str, Any]]] = None,
    injected_funnel: Optional[Dict[str, Dict[str, int]]] = None,
) -> Dict[str, Any]:
    """
    Executes the full 3-Tier 2-Phase Promo Learning Cycle:
      - Phase 1 (`shadow_14d`): ZERO mutation to `message_matrix_5div.json`. Saves snapshot + D1 ingest.
      - Phase 2 (`active_evolve`): Per-div sample gate + 70:30 exploit/explore + Hard Gate filter.
    """
    env = _load_runtime_env()
    now_kst = dt.datetime.now(KST)
    run_date = eval_date or now_kst.date()
    run_week = run_date.strftime("%Y-%m-%d")
    phase, shadow_day = compute_learning_phase(eval_date=run_date, force_shadow=force_shadow)

    db = load_matrix(matrix_path)
    if not db:
        return {"ok": False, "error": "matrix_missing"}

    yt_hist_map, ig_hist_map = _build_history_lookup()

    # 1. Collect Tier 2 & Tier 3
    go_by_div = injected_go if injected_go is not None else collect_d1_go_clicks(env, days=14)
    if injected_funnel is not None:
        funnel_by_div, funnel_by_utm = injected_funnel, {}
    else:
        funnel_by_div, funnel_by_utm = collect_d1_funnel_events(env, days=14)

    # 2. Collect Tier 1 (YT + IG) or use injected test fixtures
    all_items: List[Dict[str, Any]] = []
    if injected_items is not None:
        for raw_it in injected_items:
            it = dict(raw_it)
            if it.get("platform") not in ALLOWED_PLATFORMS:
                continue
            all_items.append(it)
    else:
        for div in DIVISIONS:
            yt_items = collect_youtube_14d(div, env, db, yt_hist_map, days=14)
            ig_items = collect_instagram_14d(div, env, db, ig_hist_map, days=14)
            all_items.extend(yt_items)
            all_items.extend(ig_items)

    # 3. Attribute `/go/` clicks & D1 conversions + compute division-tailored reward_score
    items_by_div: Dict[str, List[Dict[str, Any]]] = {d: [] for d in DIVISIONS}
    for it in all_items:
        dc = str(it.get("div_code") or "").upper()
        if dc in items_by_div:
            items_by_div[dc].append(it)

    for div in DIVISIONS:
        d_items = items_by_div[div]
        d_go = go_by_div.get(div) or {"total_clicks": 0, "slugs": {}}
        d_fun = funnel_by_div.get(div) or {}
        total_div_views = sum(max(1, int(x.get("views") or 0)) for x in d_items)
        div_go_total = int(d_go.get("total_clicks") or 0)
        div_conv_total = int(d_fun.get("total_conversions") or 0)

        for it in d_items:
            mid = str(it.get("matrix_id") or "")
            # Direct utm attribution if present; otherwise proportional share of division `/go/` clicks
            if int(it.get("go_clicks_7d") or 0) == 0 and div_go_total > 0 and total_div_views > 0:
                share = max(1, int(it.get("views") or 0)) / float(total_div_views)
                it["go_clicks_7d"] = int(round(div_go_total * share))
            if int(it.get("site_conversions_7d") or 0) == 0:
                utm_hit = funnel_by_utm.get(mid) or funnel_by_utm.get(f"{mid}_v1") or {}
                if utm_hit.get("conversions", 0) > 0:
                    it["site_conversions_7d"] = int(utm_hit["conversions"])
                elif div_conv_total > 0 and total_div_views > 0:
                    share = max(1, int(it.get("views") or 0)) / float(total_div_views)
                    it["site_conversions_7d"] = int(round(div_conv_total * share))
            it["reward_score"] = compute_item_reward_score(div, it, d_go, d_fun)

        # Also emit a clean `/go/` redirect summary row if a division has `/go/` clicks and 0 video items
        if not d_items and div_go_total > 0:
            go_item = {
                "div_code": div,
                "platform": "go_redirect",
                "content_id": f"{div.lower()}_go_summary_{run_week}",
                "title": f"{div} /go/ 14d redirect traffic",
                "hook_type": "proof",
                "matrix_id": f"{div}_S2_PROOF",
                "published_at": now_kst.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "views": 0,
                "views_per_day": 0.0,
                "likes": 0,
                "comments": 0,
                "saves": 0,
                "shares": 0,
                "go_clicks_7d": div_go_total,
                "site_conversions_7d": div_conv_total,
                "reward_score": 0.0,
            }
            go_item["reward_score"] = compute_item_reward_score(div, go_item, d_go, d_fun)
            d_items.append(go_item)
            all_items.append(go_item)

    # 4. Evaluate per division & apply Phase 1 Lock OR Phase 2 Safe 70:30 Evolution
    runs: List[Dict[str, Any]] = []
    matrix_mutated = False
    evolution_actions: List[Dict[str, Any]] = []

    for div in DIVISIONS:
        d_items = items_by_div[div]
        d_go = go_by_div.get(div) or {"total_clicks": 0, "slugs": {}}
        d_fun = funnel_by_div.get(div) or {}

        video_items = [x for x in d_items if x["platform"] in ("youtube_shorts", "youtube_longform", "instagram_reels", "instagram_carousel")]
        sample_videos = len(video_items)
        sample_views = sum(int(x.get("views") or 0) for x in d_items)
        sample_go_clicks = int(d_go.get("total_clicks") or 0)
        sample_conversions = int(d_fun.get("total_conversions") or 0)
        gate_passed = (sample_videos >= MIN_GATE_VIDEOS and sample_views >= MIN_GATE_VIEWS) or (sample_go_clicks >= MIN_GATE_GO_CLICKS)

        # Group reward_score by hook_type
        by_ht: Dict[str, List[float]] = {}
        for x in d_items:
            ht = str(x.get("hook_type") or "proof")
            if ht not in HOOK_TYPES:
                ht = "proof"
            by_ht.setdefault(ht, []).append(float(x.get("reward_score") or 0.0))

        ht_ranked = sorted(
            [(ht, round(sum(vals) / len(vals), 2), len(vals)) for ht, vals in by_ht.items() if vals],
            key=lambda t: t[1],
            reverse=True,
        )

        winner_ht = ht_ranked[0][0] if ht_ranked else "proof"
        winner_score = ht_ranked[0][1] if ht_ranked else 0.0
        loser_ht = ht_ranked[-1][0] if len(ht_ranked) >= 2 else ""
        loser_score = ht_ranked[-1][1] if len(ht_ranked) >= 2 else 0.0
        rel_gap_pct = round(((winner_score - loser_score) / winner_score) * 100.0, 1) if (winner_score > 0 and loser_ht and loser_ht != winner_ht) else 0.0

        winner_summary = (
            f"{winner_ht} (평균 보상 {winner_score}점 · 표본 {ht_ranked[0][2]}건)"
            if ht_ranked else "표본 수집 중"
        )
        loser_summary = (
            f"{loser_ht} (평균 보상 {loser_score}점 · 격차 -{rel_gap_pct}%)"
            if (loser_ht and loser_ht != winner_ht) else "비교 표본 1종 이하"
        )

        if phase == "shadow_14d":
            next_action = (
                f"Shadow 관찰 Day {shadow_day}/{SHADOW_DAYS} (2026-12-09 해금 전 매트릭스 무변경 동결 · "
                f"표본게이트={'충족' if gate_passed else '수집중'})"
            )
        elif not gate_passed:
            next_action = (
                f"Active 표본 게이트 미달 (영상 {sample_videos}/{MIN_GATE_VIDEOS}, 조회 {sample_views}/{MIN_GATE_VIEWS}, "
                f"/go/ {sample_go_clicks}/{MIN_GATE_GO_CLICKS}) — 가중치 동결 유지"
            )
        else:
            # Phase 2 Safe 70:30 Evolution with Fail-Closed Hard Gate!
            cells = ((db.get("divisions") or {}).get(div) or {}).get("matrix") or []
            promoted_ids: List[str] = []
            blocked_ids: List[str] = []
            paused_ids: List[str] = []

            for c in cells:
                if c.get("stage") not in (1, 2):
                    continue
                if c.get("hook_type") == winner_ht and c.get("status", "active") == "active":
                    ok_hg, hg_errs = _passes_cell_hard_gate(div, c)
                    if ok_hg:
                        new_w = min(MAX_WINNER_WEIGHT, round(max(1.0, float(c.get("weight", 1.0))) * 1.5, 2))
                        if new_w != float(c.get("weight", 1.0)):
                            c["weight"] = new_w
                            matrix_mutated = True
                        promoted_ids.append(c["id"])
                    else:
                        blocked_ids.append(f"{c['id']}:{','.join(hg_errs[:2])}")
                elif c.get("status", "active") == "active":
                    # Guarantee exploration weight floor (>= 0.75) to preserve Explore 30% : Exploit 70%
                    cur_w = float(c.get("weight", 1.0))
                    if cur_w < MIN_EXPLORE_WEIGHT:
                        c["weight"] = MIN_EXPLORE_WEIGHT
                        matrix_mutated = True

            # Pause bottom 20% ONLY when relative gap >= 20% and >= 3 distinct active hook_types remain
            active_hts = {c.get("hook_type") for c in cells if c.get("stage") in (1, 2) and c.get("status", "active") == "active"}
            if loser_ht and loser_ht != winner_ht and rel_gap_pct >= MIN_RELATIVE_GAP_PCT and len(active_hts) >= 4:
                loser_cells = [c for c in cells if c.get("stage") in (1, 2) and c.get("hook_type") == loser_ht and c.get("status", "active") == "active"]
                n_pause = max(1, int(math.ceil(len(loser_cells) * 0.20)))
                for lc in loser_cells[:n_pause]:
                    lc["status"] = "paused"
                    paused_ids.append(lc["id"])
                    matrix_mutated = True

            next_action = (
                f"Active 진화 적용(탐색30:활용70) — 승격 {len(promoted_ids)}건(최대 {MAX_WINNER_WEIGHT}x), "
                f"HardGate 차단 {len(blocked_ids)}건, 도태 {len(paused_ids)}건"
            )
            evolution_actions.append({
                "div_code": div,
                "winner_hook_type": winner_ht,
                "promoted_ids": promoted_ids,
                "blocked_by_hard_gate": blocked_ids,
                "paused_ids": paused_ids,
                "relative_gap_pct": rel_gap_pct,
            })

        runs.append({
            "div_code": div,
            "phase": phase,
            "shadow_day": shadow_day,
            "sample_videos": sample_videos,
            "sample_views": sample_views,
            "sample_go_clicks": sample_go_clicks,
            "sample_conversions": sample_conversions,
            "gate_passed": bool(gate_passed),
            "winner_hook_type": winner_ht,
            "winner_summary": winner_summary,
            "loser_summary": loser_summary,
            "next_week_action": next_action,
        })

    ingest_payload = {
        "run_week": run_week,
        "phase": phase,
        "shadow_day": shadow_day,
        "is_test": False,
        "items": all_items,
        "runs": runs,
    }

    snapshot_obj = {
        "schema_version": "promo-learning-3tier-v2",
        "generated_at_kst": now_kst.strftime("%Y-%m-%d %H:%M:%S KST"),
        "shadow_start_date": SHADOW_START_DATE,
        "shadow_days": SHADOW_DAYS,
        "active_unlock_date": ACTIVE_UNLOCK_DATE,
        "phase": phase,
        "shadow_day": shadow_day,
        "matrix_mutated": bool(matrix_mutated and phase == "active_evolve" and not dry_run),
        "totals": {
            "items": len(all_items),
            "views": sum(r["sample_views"] for r in runs),
            "go_clicks": sum(r["sample_go_clicks"] for r in runs),
            "conversions": sum(r["sample_conversions"] for r in runs),
        },
        "runs": runs,
        "evolution_actions": evolution_actions,
        "items": all_items,
    }

    ingest_res: Dict[str, Any] = {"ok": False, "skipped": "dry_run"}
    if not dry_run:
        snapshot_path.parent.mkdir(parents=True, exist_ok=True)
        snapshot_path.write_text(json.dumps(snapshot_obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        # STRICT Phase 1 Lock: NEVER touch message_matrix_5div.json when phase == "shadow_14d"!
        if phase == "active_evolve" and matrix_mutated:
            db["updated_at_kst"] = now_kst.strftime("%Y-%m-%d %H:%M:%S KST")
            db["weekly_evolution_summary"] = {
                "last_evaluated_at_kst": db["updated_at_kst"],
                "status": "ACTIVE_EVOLVE_70_30_APPLIED",
                "phase": phase,
                "shadow_day": shadow_day,
                "evolution_actions": evolution_actions,
            }
            matrix_path.write_text(json.dumps(db, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        ingest_res = ingest_to_central_d1(ingest_payload, env)

    return {
        "ok": True,
        "run_week": run_week,
        "phase": phase,
        "shadow_day": shadow_day,
        "matrix_mutated": bool(matrix_mutated and phase == "active_evolve" and not dry_run),
        "items_count": len(all_items),
        "runs": runs,
        "evolution_actions": evolution_actions,
        "ingest": ingest_res,
        "snapshot_path": str(snapshot_path),
    }


# Backward-compatible entrypoint alias
def run_weekly_ab_evolution(
    matrix_path: Path = MATRIX_PATH,
    metrics: Optional[Dict[str, Dict[str, int]]] = None,
    save: bool = True,
) -> Dict[str, Any]:
    return run_promo_learning_cycle(matrix_path=matrix_path, dry_run=(not save))


def main() -> int:
    parser = argparse.ArgumentParser(description="Dream Company 5-Div 3-Tier 2-Phase Safe Promo Self-Learning Engine")
    parser.add_argument("--shadow-now", action="store_true", help="Immediately collect live 3-tier data under Phase 1 Shadow lock and ingest to Central D1")
    parser.add_argument("--dry-run", action="store_true", help="Run without writing snapshot/matrix or ingesting to Central D1")
    parser.add_argument("--eval-date", type=str, default="", help="Override YYYY-MM-DD evaluation date for testing")
    args = parser.parse_args()

    eval_d = dt.date.fromisoformat(args.eval_date) if args.eval_date else None
    res = run_promo_learning_cycle(
        eval_date=eval_d,
        force_shadow=args.shadow_now,
        dry_run=args.dry_run,
    )
    print(json.dumps(res, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
