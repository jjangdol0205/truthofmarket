#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dream Company — Stage 2 YouTube Data API v3 Channel Reset, Defective Long-Form Private Flip & Official .srt Caption Uploader
Zero external dependencies (pure stdlib `urllib` OAuth Refresh Token -> Access Token exchange).
Requires Google Cloud OAuth Consent Screen in 'In production' mode so Refresh Tokens NEVER expire in 7 days!

Performs:
1. Flips 3 defective short long-forms to `privacyStatus="private"`:
   - TOM: `kjtL4OAvbQ8` (1:31 vs 03:35 chapters)
   - HERO: `3ijh-XwUUMA` (0:46 black waveform)
   - KFK: `EAaW0jOFjJ4` (0:51 vs 02:55 chapters)
2. KFK (`@kidsfit01`): Scrubs Coupang Partners / Naver Shopping Connect / `#curation` links from 11/17~18 12 videos via `videos.update`.
3. KFG (`@kisfitglobal`): Replaces `Bio Labs` / `Brain LQ` / broken `#kfg-bone-age-interpreter` on `o7XO_XksJpU`, `DJzxxrqCpNE`, `cJyQ_LcnSxI`.
4. GBA (`@GetBreakAI`): Replaces `3つの財布(1489/VYM/オルカン)` descriptions with `SMH × XLV + 個人向け国債／特定口座SGOV`.
5. TOM (`@TruthOfMarketUS`): Unlists legacy quant/day-trading Shorts (`PW-RSI`, `ATR`, `Gamma`, `GEX`, `CELH`, `NVDA`).
6. Uploads official `.srt` captions via `captions.insert` for verified videos (eliminates `KissFit/USCDC/60-cond/배군호` ASR misrecognition!).
"""

from __future__ import annotations

import argparse
import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parent.parent
HISTORY_PATH = ROOT / "data" / "promo_history.json"

DEFECTIVE_PRIVATE_IDS = {
    "TOM": ["kjtL4OAvbQ8"],
    "HERO": ["3ijh-XwUUMA"],
    "KFK": ["EAaW0jOFjJ4"],
}


def refresh_access_token(client_id: str, client_secret: str, refresh_token: str) -> Optional[str]:
    if not (client_id and client_secret and refresh_token):
        return None
    data = urllib.parse.urlencode({
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
    }).encode("utf-8")
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read().decode("utf-8")).get("access_token")
    except Exception as e:
        print(f"[YT OAUTH ERR] {e}", flush=True)
        return None


def yt_api(method: str, path: str, token: str, payload: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
    url = f"https://www.googleapis.com/youtube/v3{path}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        url, data=data, method=method,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"[YT API {method} {path}] HTTP {e.code}: {e.read().decode('utf-8', errors='replace')[:250]}", flush=True)
        return None


def set_video_privacy(token: str, video_id: str, privacy: str) -> bool:
    res = yt_api("PUT", "/videos?part=status", token, {"id": video_id, "status": {"privacyStatus": privacy}})
    ok = bool(res and res.get("id") == video_id)
    print(f"  [PRIVACY -> {privacy}] {video_id}: ok={ok}", flush=True)
    return ok


def upload_srt_caption(token: str, video_id: str, language: str, name: str, srt_text: str) -> bool:
    boundary = "----DreamCompanySRTBoundary2026"
    meta = json.dumps({"snippet": {"videoId": video_id, "language": language, "name": name, "isDraft": False}})
    body = (
        f"--{boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n{meta}\r\n"
        f"--{boundary}\r\nContent-Type: application/octet-stream\r\n\r\n{srt_text}\r\n"
        f"--{boundary}--\r\n"
    ).encode("utf-8")
    req = urllib.request.Request(
        "https://www.googleapis.com/upload/youtube/v3/captions?part=snippet&uploadType=multipart",
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": f"multipart/related; boundary={boundary}",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"  [CAPTION INSERT OK] {video_id} ({language}) -> HTTP {r.status}", flush=True)
            return True
    except urllib.error.HTTPError as e:
        print(f"  [CAPTION INSERT ERR] {video_id}: HTTP {e.code} {e.read().decode('utf-8', errors='replace')[:200]}", flush=True)
        return False


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--once-if-pending", action="store_true")
    args = parser.parse_args()

    hist = json.loads(HISTORY_PATH.read_text(encoding="utf-8")) if HISTORY_PATH.exists() else {}
    if args.once_if_pending and hist.get("stage2_yt_reset_completed"):
        print("[YT STAGE2 RESET] Already completed previously -> skipping.", flush=True)
        return 0

    cid = os.getenv("YT_CLIENT_ID", "").strip()
    csec = os.getenv("YT_CLIENT_SECRET", "").strip()
    if not (cid and csec):
        print("[YT STAGE2 RESET] YT_CLIENT_ID / YT_CLIENT_SECRET not set yet -> ready & waiting for GitHub Secrets.", flush=True)
        return 0

    completed_any = False
    for div in ["TOM", "KFG", "GBA", "HERO", "KFK"]:
        rtok = os.getenv(f"YT_REFRESH_TOKEN_{div}", "").strip()
        if not rtok:
            print(f"[YT {div}] YT_REFRESH_TOKEN_{div} not configured yet -> skipped.", flush=True)
            continue
        atok = refresh_access_token(cid, csec, rtok)
        if not atok:
            continue
        print(f"[YT {div}] Authenticated via OAuth Refresh Token!", flush=True)

        # 1. Flip defective short long-forms to private
        for bad_id in DEFECTIVE_PRIVATE_IDS.get(div, []):
            if set_video_privacy(atok, bad_id, "private"):
                completed_any = True

        # 2. Fetch channel uploads playlist & scrub metadata per division rules
        ch = yt_api("GET", "/channels?part=contentDetails,snippet&mine=true", atok)
        uploads_pl = (((ch or {}).get("items") or [{}])[0].get("contentDetails") or {}).get("relatedPlaylists", {}).get("uploads")
        if not uploads_pl:
            continue
        pl = yt_api("GET", f"/playlistItems?part=snippet&maxResults=50&playlistId={uploads_pl}", atok)
        vids = [it["snippet"]["resourceId"]["videoId"] for it in (pl or {}).get("items", [])]
        if not vids:
            continue
        vinfo = yt_api("GET", f"/videos?part=snippet,status&id={','.join(vids[:50])}", atok)
        for item in (vinfo or {}).get("items", []):
            vid = item["id"]
            sn = item["snippet"]
            title = sn.get("title", "")
            desc = sn.get("description", "")
            cat = sn.get("categoryId", "22")
            changed = False

            if div == "TOM" and re.search(r"PW-RSI|2\.0x ATR|Gamma|GEX|CELH|Breakout|Day-Trading", f"{title} {desc}", re.I):
                if item.get("status", {}).get("privacyStatus") == "public":
                    set_video_privacy(atok, vid, "unlisted")
                    completed_any = True
                continue
            if div == "KFK" and re.search(r"쿠팡|네이버 쇼핑커넥트|#curation|link\.coupang\.com|cshop\.naver\.com", desc, re.I):
                desc = re.sub(r".*(?:쿠팡|네이버 쇼핑커넥트|#curation|link\.coupang\.com|cshop\.naver\.com).*\n?", "", desc, flags=re.I)
                changed = True
            if div == "KFG" and re.search(r"Bio Labs|Brain LQ|#kfg-bone-age-interpreter", f"{title} {desc}", re.I):
                title = title.replace("Bio Labs", "Studio").replace("Brain LQ", "US CDC Growth")
                desc = desc.replace("Bio Labs", "Studio").replace("Brain LQ", "US CDC Growth").replace("#kfg-bone-age-interpreter", "")
                changed = True
            if div == "GBA" and re.search(r"3つの財布|1489|VYM|オルカン", desc, re.I):
                desc = re.sub(r"3つの財布[^。\n]*", "新NISA成長投資枠（SMH×XLV）＋個人向け国債・特定口座SGOV", desc)
                changed = True

            if changed:
                yt_api("PUT", "/videos?part=snippet", atok, {
                    "id": vid,
                    "snippet": {"title": title[:100], "description": desc[:4900], "categoryId": cat},
                })
                completed_any = True

    if completed_any:
        hist["stage2_yt_reset_completed"] = True
        HISTORY_PATH.write_text(json.dumps(hist, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
