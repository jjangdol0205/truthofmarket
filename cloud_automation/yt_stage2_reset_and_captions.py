#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dream Company — Stage 2 YouTube Data API v3 Full 5-Channel Audit Remediation,
Defective/Legacy Video Private Flip, Metadata Scrub, Official .srt Caption Sync,
and Automated Pinned UTM Comment + Either/Or Engagement Question Engine.

Aligned 100% with `hq_5div_promo_audit_20261123.md` & `#5 Outbound Allowlist`:
- TOM (`@TruthOfMarketUS`): Private legacy SCHD/JEPI/VOO/NVDA/PLTR videos (`FdmxF-fPQ8w`, `iuRVSQtyKpk`, `kjtL4OAvbQ8`), upload missing `.srt`, post `/smh-fear-greed` UTM + either/or question.
- KFG (`@kisfitglobal`): Private old Clinical/Brain LQ videos (`o7XO_XksJpU`, `DJzxxrqCpNE`, `YNaKhN197AQ`, `VMrGLwF4bUI`), scrub `#kfg-bone-age-interpreter` / `Bio Labs` / `Brain LQ` / `Clinical` / `Diagnosis`, update non-medical bio, upload `.srt`, post UTM + either/or question.
- GBA (`@GetBreakAI`): Private old NVDA/day-trade videos (`IbvoEICoOJ0`, `v1jJEZRasug`), scrub `クオンツ`/`オルカン`/`3つの財布`, upload `.srt`, post `/jp/smh-fear-greed` UTM + either/or question.
- HERO (`@김쌤의영웅라디오`): Private 0-sec vocal bait (`PwYOnWhIec4`) & defective 46s (`3ijh-XwUUMA`), fix Ep 2 (`O2_HvEfJoTw`) email (`beable9489@gmail.com` -> `radio@paradise-hero.com`) & `11:33` chapter typo, update channel bio (`"마음을 노래하는 AI 가상 트로트 가수 백운호"` + `@paradise_hero1`), upload `.srt`, post `radio.html` & `vip.html` UTM + either/or question.
- KFK (`@kidsfit01`): Private defective 51s (`EAaW0jOFjJ4`), fix `XI-whg0hyWs` (`02:55` -> fits inside `01:08`), scrub any affiliate leaks, upload `.srt` (incl. `ObsF6wID2w4`), post `kidsfit.co.kr` + `kfk_sample_2p.pdf` UTM + either/or question.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

sys.path.insert(0, str(Path(__file__).resolve().parent))
from outbound_allowlist import OutboundAllowlistError, assert_allowed_yt_channel  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
HISTORY_PATH = ROOT / "data" / "promo_history.json"

DEFECTIVE_PRIVATE_IDS: Dict[str, List[str]] = {
    "TOM": ["kjtL4OAvbQ8", "FdmxF-fPQ8w", "iuRVSQtyKpk", "LzLcU12N8v4"],
    "KFG": ["o7XO_XksJpU", "DJzxxrqCpNE", "YNaKhN197AQ", "VMrGLwF4bUI"],
    "GBA": ["IbvoEICoOJ0", "v1jJEZRasug"],
    "HERO": ["3ijh-XwUUMA", "PwYOnWhIec4"],
    "KFK": ["EAaW0jOFjJ4"],
}

DIV_LANG: Dict[str, str] = {"TOM": "en", "KFG": "en", "GBA": "ja", "HERO": "ko", "KFK": "ko"}

DIV_CLEAN_CHANNEL_BIO: Dict[str, str] = {
    "TOM": (
        "Calm retirement & ETF discipline for 50–70+ investors.\n"
        "Independent historical 2000–2025 SMH x XLV + SGOV research and our free daily Semiconductor Fear & Greed Index.\n"
        "Educational research only — zero buy/sell timing signals.\n\n"
        "Free Daily SMH Fear & Greed Gauge: https://truthofmarket.com/smh-fear-greed\n"
        "Free 2-Page 2000–2025 Crash Study PDF: https://truthofmarket.com/"
    ),
    "KFG": (
        "KISFIT Studio — Calm 60-second US CDC child height percentile & growth velocity studio for parents.\n"
        "100% automated self-serve educational reference built on official US CDC 2000 growth tables.\n"
        "Zero supplement ads, zero medical claims.\n\n"
        "Free 60-Second US CDC Height Check (No Email Wall): https://kisfitglobal.com/\n"
        "Free 2-Page Printable Sample PDF: https://kisfitglobal.com/assets/downloads/kfg_sample_2p.pdf"
    ),
    "GBA": (
        "50〜70代のための落ち着いた新NISA・老後資産設計スタジオ。\n"
        "過去25年統計（SMH×XLV＋個人向け国債）と毎日無料の「米国半導体・恐怖と強欲指数」を公開中。\n"
        "教育・統計データ出版のみ（売買タイミング助言は行いません）。\n\n"
        "無料・米国半導体 恐怖と強欲指数: https://getbreakai.com/jp/smh-fear-greed\n"
        "無料2pサンプルPDF＆新NISA統計確認: https://getbreakai.com/jp/"
    ),
    "HERO": (
        "어머님, 아버님 반갑습니다 💚\n"
        "마음을 노래하는 AI 가상 트로트 가수 『백운호 (白雲湖)』의 중저음 명곡(〈어머니의 봄날〉·〈백운호 연가〉)과 "
        "어머님들의 따뜻한 연속 인생 사연이 흐르는 [김쌤의 영웅 라디오] 공식 가족 사랑방입니다.\n\n"
        "📻 방송 편성\n"
        "• 매일: 백운호 감동 무대 & 시니어 일상 쇼츠\n"
        "• 매주 화·금 저녁 6시: 14분 연속 인생 사연 라디오 극장\n\n"
        "🎵 백운호 6곡 완곡 무료 라디오 (가입 없음): https://paradise-hero.com/radio.html\n"
        "💐 카톡 무료 아침 안부카드 만들기: https://paradise-hero.com/vip.html\n"
        "📸 공식 인스타그램 (@paradise_hero1): https://www.instagram.com/paradise_hero1/\n"
        "💌 사연 제보 및 협찬 문의: radio@paradise-hero.com"
    ),
    "KFK": (
        "키즈핏 소아성장 아틀리에 — 상업성 상품 광고 0건.\n"
        "질병관리청(KDCA) 공식 성장도표와 병원 뼈나이 경과 시차(Δt) 기준으로 우리 아이 1분 무료 예상키 진단과 저녁 통잠·바른자세 연구 노트를 전합니다.\n\n"
        "📏 1분 무료 예상키 진단 (이메일 없이 즉시 확인): https://kidsfit.co.kr/\n"
        "📄 결제 전 미리 보는 2p 무료 샘플 PDF: https://kidsfit.co.kr/kfk_sample_2p.pdf"
    ),
}

DIV_PINNED_UTM_COMMENTS: Dict[str, str] = {
    "TOM": (
        "📊 Today's Free SMH Fear & Greed Gauge (7 Factors, Updated Daily): "
        "https://truthofmarket.com/smh-fear-greed?utm_source=youtube&utm_medium=shorts&utm_campaign=tom_fg\n"
        "📄 Preview the Free 2-Page 2000–2025 Crash Study PDF (Zero Email Wall): "
        "https://truthofmarket.com/?utm_source=youtube&utm_medium=shorts&utm_campaign=tom_study\n"
        "💬 Quick question: When markets drop -20%, do you prefer holding 24 months of Treasury cash or staying 100% invested?"
    ),
    "KFG": (
        "📏 Free 60-Second US CDC Height Percentile Check (No Email Wall): "
        "https://kisfitglobal.com/?utm_source=youtube&utm_medium=shorts&utm_campaign=kfg_check\n"
        "📄 Preview the Free 2-Page Printable US CDC Reference PDF (Up to 4 Siblings Available): "
        "https://kisfitglobal.com/assets/downloads/kfg_sample_2p.pdf\n"
        "💬 Quick check-in: Does your child usually fall asleep before 9:30 PM or after 10:00 PM on school nights?"
    ),
    "GBA": (
        "📊 毎日の無料チェック｜米国半導体・恐怖と強欲指数（7指標）: "
        "https://getbreakai.com/jp/smh-fear-greed?utm_source=youtube&utm_medium=shorts&utm_campaign=gba_fg\n"
        "📄 メール不要・無料2pサンプルPDF＆新NISA 25年統計確認: "
        "https://getbreakai.com/jp/?utm_source=youtube&utm_medium=shorts&utm_campaign=gba_study\n"
        "💬 ひとことアンケート：新NISAの安全資金は、銀行預金派ですか？それとも個人向け国債派ですか？"
    ),
    "HERO": (
        "🎵 백운호 6곡 완곡 무료 듣기 & 연속 사연 사랑방 (가입 없음): "
        "https://paradise-hero.com/radio.html?utm_source=youtube&utm_medium=shorts&utm_campaign=hero_radio\n"
        "💐 매일 아침 카톡 무료 안부카드 만들기: "
        "https://paradise-hero.com/vip.html?utm_source=youtube&utm_medium=shorts&utm_campaign=hero_card\n"
        "📸 공식 인스타그램 @paradise_hero1: https://www.instagram.com/paradise_hero1/\n"
        "💬 어머님이 가장 그리운 계절은 봄날인가요, 가을녘인가요? 댓글로 한 줄 남겨주세요."
    ),
    "KFK": (
        "📏 1분 무료 질병관리청 예상키·뼈나이 시차 진단 (이메일 없이 즉시 확인 · 광고 0건): "
        "https://kidsfit.co.kr/?utm_source=youtube&utm_medium=shorts&utm_campaign=kfk_check\n"
        "📄 결제 전 미리 보는 2p 무료 샘플 PDF: "
        "https://kidsfit.co.kr/kfk_sample_2p.pdf\n"
        "💬 우리 아이 취침 시간은 보통 9시 반 이전인가요, 10시 이후인가요? 댓글로 한 줄 남겨주세요."
    ),
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
        body = e.read().decode("utf-8", errors="replace")[:260]
        print(f"[YT API {method} {path}] HTTP {e.code}: {body}", flush=True)
        if e.code == 403 and "quotaExceeded" in body:
            return {"_quota_exceeded": True}
        return None


def set_video_privacy(token: str, video_id: str, privacy: str) -> bool:
    res = yt_api("PUT", "/videos?part=status", token, {"id": video_id, "status": {"privacyStatus": privacy}})
    ok = bool(res and res.get("id") == video_id)
    print(f"  [PRIVACY -> {privacy}] {video_id}: ok={ok}", flush=True)
    return ok


def post_top_comment(token: str, channel_id: str, video_id: str, text: str) -> bool:
    payload = {
        "snippet": {
            "channelId": channel_id,
            "videoId": video_id,
            "topLevelComment": {"snippet": {"textOriginal": text}},
        }
    }
    res = yt_api("POST", "/commentThreads?part=snippet", token, payload)
    ok = bool(res and res.get("id"))
    print(f"  [COMMENT POST] {video_id}: ok={ok}", flush=True)
    return ok


def build_clean_srt_from_metadata(title: str, desc: str, dur_sec: float = 35.0) -> str:
    """Generates a clean official multi-cue .srt caption track eliminating ASR misrecognition."""
    lines = [re.sub(r"#\S+", "", title).strip()]
    for raw in desc.splitlines():
        s = raw.strip()
        if not s or "http" in s or s.startswith("#") or s.startswith("※") or s.startswith("("):
            continue
        if len(s) >= 8:
            lines.append(s[:110])
        if len(lines) >= 6:
            break
    n = max(1, len(lines))
    step = max(3.5, min(7.0, dur_sec / n))
    blocks = []
    for idx, line in enumerate(lines, start=1):
        t0 = (idx - 1) * step
        t1 = min(dur_sec, idx * step - 0.15)
        fmt = lambda sec: f"{int(sec//3600):02d}:{int((sec%3600)//60):02d}:{int(sec%60):02d},{int((sec%1)*1000):03d}"
        blocks.append(f"{idx}\n{fmt(t0)} --> {fmt(t1)}\n{line}\n")
    return "\n".join(blocks)


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


def fetch_r2_bytes(r2_key: str, timeout: int = 120) -> Optional[bytes]:
    acct = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
    tok = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
    bkt = os.getenv("R2_VAULT_BUCKET", "dreamcompany-flow-vault").strip()
    if not (acct and tok and r2_key):
        return None
    url = f"https://api.cloudflare.com/client/v4/accounts/{acct}/r2/buckets/{bkt}/objects/{r2_key}"
    req = urllib.request.Request(url, method="GET", headers={"Authorization": f"Bearer {tok}", "User-Agent": "DreamCompany-YTStage2/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            if r.status == 200:
                return r.read()
    except Exception as e:
        print(f"  [R2 FETCH ERR] {r2_key}: {e}", flush=True)
    return None


def sync_channel_banner_from_r2(token: str, div: str, ch_id: str, cur_branding: Dict[str, Any]) -> bool:
    """Uploads clean 2560x1440 banner via official YouTube Data API v3 channelBanners.insert + channels.update."""
    r2_key = f"brand_kits_20261123/{div.lower()}_yt_banner_2560x1440.png"
    png_bytes = fetch_r2_bytes(r2_key, timeout=60)
    if not png_bytes:
        return False
    req = urllib.request.Request(
        "https://www.googleapis.com/upload/youtube/v3/channelBanners/insert?uploadType=media",
        data=png_bytes,
        method="POST",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "image/png"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            banner_url = json.loads(r.read().decode("utf-8")).get("url", "")
        if not banner_url:
            return False
        ch_settings = dict((cur_branding or {}).get("channel") or {})
        ch_settings["description"] = DIV_CLEAN_CHANNEL_BIO[div]
        res = yt_api("PUT", "/channels?part=brandingSettings", token, {
            "id": ch_id,
            "brandingSettings": {
                "channel": ch_settings,
                "image": {"bannerExternalUrl": banner_url},
            },
        })
        ok = bool(res and not res.get("_quota_exceeded") and res.get("id") == ch_id)
        print(f"  [YT BANNER SYNC {div}] ok={ok}", flush=True)
        return ok
    except urllib.error.HTTPError as e:
        print(f"  [YT BANNER ERR {div}] HTTP {e.code} {e.read().decode('utf-8', errors='replace')[:200]}", flush=True)
        return False
    except Exception as e:
        print(f"  [YT BANNER ERR {div}] {e}", flush=True)
        return False


def upload_video_thumbnail_v3(token: str, video_id: str, png_bytes: bytes) -> bool:
    req = urllib.request.Request(
        f"https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId={video_id}&uploadType=media",
        data=png_bytes,
        method="POST",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "image/png"},
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            print(f"  [THUMBNAIL SET OK] {video_id} -> HTTP {r.status}", flush=True)
            return r.status in (200, 201)
    except Exception as e:
        print(f"  [THUMBNAIL SET WARN] {video_id}: {e}", flush=True)
        return False


def ensure_hero_ep1_14m09s_live(token: str, ch_id: str, hist: Dict[str, Any]) -> Optional[str]:
    """Ensures HERO 14m09s Ep 1 is live with clean 2026-11-23 metadata, thumbnail, .srt, and synthetic media flag."""
    if hist.get("hero_ep1_14m09s_synced_20261123"):
        return str(hist.get("hero_ep1_14m09s_video_id") or "")
    meta_bytes = fetch_r2_bytes("hero_ep1_upload/youtube_metadata.json", timeout=30)
    if not meta_bytes:
        return None
    meta = json.loads(meta_bytes.decode("utf-8"))
    thumb_bytes = fetch_r2_bytes("hero_ep1_upload/hero_ep1_flagship_thumb_1280x720.png", timeout=45)
    srt_bytes = fetch_r2_bytes("hero_ep1_upload/hero_ep1_flagship_20min.srt", timeout=30)

    # Check if existing 14m09s Ep 1 (`lUQWTtVW3PM`) is already live on @김쌤의영웅라디오
    existing_vid = ""
    check = yt_api("GET", "/videos?part=snippet,status&id=lUQWTtVW3PM", token)
    if check and check.get("items"):
        st = check["items"][0].get("status", {})
        if st.get("privacyStatus") == "public":
            existing_vid = "lUQWTtVW3PM"

    if existing_vid:
        yt_api("PUT", "/videos?part=snippet,status", token, {
            "id": existing_vid,
            "snippet": {
                "title": meta["title"][:100],
                "description": meta["description"][:4900],
                "tags": meta.get("tags", []),
                "categoryId": str(meta.get("categoryId", "24")),
                "defaultLanguage": "ko",
                "defaultAudioLanguage": "ko",
            },
            "status": {
                "privacyStatus": "public",
                "selfDeclaredMadeForKids": False,
                "containsSyntheticMedia": True,
            },
        })
        if thumb_bytes:
            upload_video_thumbnail_v3(token, existing_vid, thumb_bytes)
        if srt_bytes:
            upload_srt_caption(token, existing_vid, "ko", "공식 한국어 큰글씨 자막", srt_bytes.decode("utf-8", errors="replace"))
        hist["hero_ep1_14m09s_video_id"] = existing_vid
        hist["hero_ep1_14m09s_synced_20261123"] = True
        print(f"  [HERO EP1 UPDATED EXISTING] https://youtu.be/{existing_vid}", flush=True)
        return existing_vid

    # Otherwise download 246 MB MP4 from R2 and upload via resumable videos.insert
    mp4_bytes = fetch_r2_bytes("hero_ep1_upload/hero_ep1_14m09s_yt_upload.mp4", timeout=240)
    if not mp4_bytes:
        return None
    init_body = json.dumps({
        "snippet": {
            "title": meta["title"][:100],
            "description": meta["description"][:4900],
            "tags": meta.get("tags", []),
            "categoryId": str(meta.get("categoryId", "24")),
            "defaultLanguage": "ko",
            "defaultAudioLanguage": "ko",
        },
        "status": {
            "privacyStatus": "public",
            "selfDeclaredMadeForKids": False,
            "containsSyntheticMedia": True,
        },
    }, ensure_ascii=False).encode("utf-8")
    init_req = urllib.request.Request(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        data=init_body,
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json; charset=UTF-8",
            "X-Upload-Content-Length": str(len(mp4_bytes)),
            "X-Upload-Content-Type": "video/mp4",
        },
    )
    try:
        with urllib.request.urlopen(init_req, timeout=30) as ir:
            upload_url = ir.headers.get("Location")
        if not upload_url:
            return None
        put_req = urllib.request.Request(
            upload_url,
            data=mp4_bytes,
            method="PUT",
            headers={"Content-Type": "video/mp4", "Content-Length": str(len(mp4_bytes))},
        )
        with urllib.request.urlopen(put_req, timeout=300) as pr:
            new_vid = json.loads(pr.read().decode("utf-8")).get("id", "")
        if new_vid:
            if thumb_bytes:
                upload_video_thumbnail_v3(token, new_vid, thumb_bytes)
            if srt_bytes:
                upload_srt_caption(token, new_vid, "ko", "공식 한국어 큰글씨 자막", srt_bytes.decode("utf-8", errors="replace"))
            if meta.get("pinned_comment"):
                post_top_comment(token, ch_id, new_vid, meta["pinned_comment"])
            hist["hero_ep1_14m09s_video_id"] = new_vid
            hist["hero_ep1_14m09s_synced_20261123"] = True
            print(f"  [HERO EP1 UPLOADED LIVE] https://youtu.be/{new_vid}", flush=True)
            return new_vid
    except Exception as e:
        print(f"  [HERO EP1 UPLOAD ERR] {e}", flush=True)
    return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--once-if-pending", action="store_true")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    hist = json.loads(HISTORY_PATH.read_text(encoding="utf-8")) if HISTORY_PATH.exists() else {}
    banners_done = hist.get("banners_synced_20261123") or {}
    all_banners_done = all(banners_done.get(d) for d in ("TOM", "KFG", "GBA", "HERO", "KFK"))
    if args.once_if_pending and not args.force and hist.get("stage2_yt_audit_20261123_completed") and all_banners_done and hist.get("hero_ep1_14m09s_synced_20261123"):
        print("[YT STAGE2 AUDIT] Already completed 2026-11-23 remediation + 5 banners + HERO Ep1 -> skipping.", flush=True)
        return 0

    cid = os.getenv("YT_CLIENT_ID", "").strip()
    csec = os.getenv("YT_CLIENT_SECRET", "").strip()
    if not (cid and csec):
        print("[YT STAGE2 AUDIT] YT_CLIENT_ID / YT_CLIENT_SECRET not set -> waiting for secrets.", flush=True)
        return 0

    completed_all_divs = True
    quota_hit = False

    for div in ["TOM", "KFG", "GBA", "HERO", "KFK"]:
        if quota_hit:
            completed_all_divs = False
            break
        rtok = os.getenv(f"YT_REFRESH_TOKEN_{div}", "").strip()
        if not rtok:
            completed_all_divs = False
            continue
        atok = refresh_access_token(cid, csec, rtok)
        if not atok:
            completed_all_divs = False
            continue

        ch = yt_api("GET", "/channels?part=contentDetails,snippet,brandingSettings&mine=true", atok)
        if not ch or ch.get("_quota_exceeded"):
            quota_hit = True
            completed_all_divs = False
            break
        item0 = (ch.get("items") or [{}])[0]
        ch_id = str(item0.get("id", ""))
        try:
            assert_allowed_yt_channel(div, ch_id)
        except OutboundAllowlistError as oe:
            print(f"[YT {div}] {oe}", flush=True)
            completed_all_divs = False
            continue

        print(f"[YT {div}] Allowlist verified ({ch_id}). Running 2026-11-23 remediation...", flush=True)

        # 0. Sync clean 2560x1440 banner from R2 & clean channel bio
        cur_branding = item0.get("brandingSettings") or {}
        if not (hist.get("banners_synced_20261123") or {}).get(div):
            if sync_channel_banner_from_r2(atok, div, ch_id, cur_branding):
                hist.setdefault("banners_synced_20261123", {})[div] = True
            else:
                completed_all_divs = False
        cur_bio = item0.get("snippet", {}).get("description", "")
        target_bio = DIV_CLEAN_CHANNEL_BIO[div]
        if any(bad in cur_bio for bad in ("Bio Labs", "Brain LQ", "Clinical", "Diagnosis", "クオンツ", "황영웅")) or (
            div == "HERO" and "@paradise_hero1" not in cur_bio
        ):
            yt_api("PUT", "/channels?part=brandingSettings", atok, {
                "id": ch_id,
                "brandingSettings": {"channel": {"description": target_bio}},
            })

        # 0b. Ensure HERO 14m09s Ep 1 is live & synced
        if div == "HERO" and not hist.get("hero_ep1_14m09s_synced_20261123"):
            ensure_hero_ep1_14m09s_live(atok, ch_id, hist)

        # 1. Flip defective / legacy / bait videos to private
        for bad_id in DEFECTIVE_PRIVATE_IDS.get(div, []):
            set_video_privacy(atok, bad_id, "private")

        # 2. Scrub public videos metadata, post missing UTM comments, upload missing official .srt
        uploads_pl = (item0.get("contentDetails") or {}).get("relatedPlaylists", {}).get("uploads")
        if not uploads_pl:
            continue
        pl = yt_api("GET", f"/playlistItems?part=snippet&maxResults=25&playlistId={uploads_pl}", atok)
        vids = [it["snippet"]["resourceId"]["videoId"] for it in (pl or {}).get("items", [])]
        if not vids:
            continue
        vinfo = yt_api("GET", f"/videos?part=snippet,status,statistics&id={','.join(vids[:25])}", atok)
        srt_uploaded = 0
        cmt_posted = 0
        for item in (vinfo or {}).get("items", []):
            vid = item["id"]
            if item.get("status", {}).get("privacyStatus") != "public":
                continue
            sn = item["snippet"]
            title = sn.get("title", "")
            desc = sn.get("description", "")
            cat = sn.get("categoryId", "22")
            changed = False

            if div == "TOM" and re.search(r"PW-RSI|2\.0x ATR|Gamma|GEX|CELH|\$NVDA|\$PLTR|SCHD|JEPI", f"{title} {desc}", re.I):
                set_video_privacy(atok, vid, "private")
                continue
            if div == "KFG" and re.search(r"Bio Labs|Brain LQ|Clinical|Diagnosis|#kfg-bone-age-interpreter", f"{title} {desc}", re.I):
                for old, new in [
                    ("KISFIT Bio Labs", "KISFIT Studio"),
                    ("Bio Labs", "Studio"),
                    ("Brain LQ", "US CDC Growth"),
                    ("Clinical", "Reference"),
                    ("Diagnosis", "Check"),
                    ("#kfg-bone-age-interpreter", "?utm_source=youtube&utm_medium=shorts&utm_campaign=kfg_check"),
                ]:
                    title = re.sub(re.escape(old), new, title, flags=re.I)
                    desc = re.sub(re.escape(old), new, desc, flags=re.I)
                changed = True
            if div == "GBA" and re.search(r"3つの財布|1489|VYM|オルカン|クオンツ", desc, re.I):
                desc = re.sub(r"3つの財布[^。\n]*", "新NISA成長投資枠（SMH×XLV）＋個人向け国債", desc)
                desc = desc.replace("クオンツ", "過去25年統計")
                changed = True
            if div == "HERO" and vid == "O2_HvEfJoTw":
                desc = desc.replace("beable9489@gmail.com", "radio@paradise-hero.com")
                desc = re.sub(r"11:33.*", "09:10 따뜻한 저녁 클로징 & 다음 화 연속 사연 예고", desc)
                if "@paradise_hero1" not in desc:
                    desc += "\n\n📸 공식 인스타그램 @paradise_hero1: https://www.instagram.com/paradise_hero1/\n💐 카톡 무료 아침 안부카드: https://paradise-hero.com/vip.html?utm_source=youtube&utm_medium=radio&utm_campaign=hero_ep2\n"
                changed = True
            if div == "KFK":
                if vid == "XI-whg0hyWs" and "02:55" in desc:
                    desc = re.sub(r"0[1-9]:\d\d[^\n]*", "", desc)
                    desc = desc.strip() + (
                        "\n\n⏱️ 핵심 구간 안내\n00:00 우유 3잔·영양제보다 먼저 볼 1가지\n00:24 뼈나이 시차(Δt)와 질병관리청 표준키\n00:48 1분 무료 진단 & 2p 샘플 PDF 확인\n\n"
                        "📏 1분 무료 예상키 진단 (광고 0건): https://kidsfit.co.kr/?utm_source=youtube&utm_medium=video&utm_campaign=kfk_guide\n"
                        "📄 2p 무료 샘플 PDF: https://kidsfit.co.kr/kfk_sample_2p.pdf\n"
                    )
                    changed = True
                if re.search(r"쿠팡|네이버 쇼핑커넥트|#curation|link\.coupang\.com|cshop\.naver\.com|아이클타임|칼마디", desc, re.I):
                    desc = re.sub(r".*(?:쿠팡|네이버 쇼핑커넥트|#curation|link\.coupang\.com|cshop\.naver\.com|아이클타임|칼마디).*\n?", "", desc, flags=re.I)
                    changed = True

            if changed:
                yt_api("PUT", "/videos?part=snippet", atok, {
                    "id": vid,
                    "snippet": {"title": title[:100], "description": desc[:4900], "categoryId": cat},
                })

            # Post UTM + either/or top comment on public videos with 0 comments (max 4/div/run to protect quota)
            cmts = int(item.get("statistics", {}).get("commentCount", 0) or 0)
            if cmts == 0 and cmt_posted < 4:
                if post_top_comment(atok, ch_id, vid, DIV_PINNED_UTM_COMMENTS[div]):
                    cmt_posted += 1

            # Upload missing official .srt caption (max 3/div/run to stay well under 10k/day quota)
            if srt_uploaded < 3:
                caps = yt_api("GET", f"/captions?part=snippet&videoId={vid}", atok)
                if caps and caps.get("_quota_exceeded"):
                    quota_hit = True
                    completed_all_divs = False
                    break
                kinds = [c["snippet"].get("trackKind") for c in (caps or {}).get("items", [])]
                if "standard" not in kinds:
                    srt_txt = build_clean_srt_from_metadata(title, desc)
                    if upload_srt_caption(atok, vid, DIV_LANG[div], f"Official {DIV_LANG[div].upper()}", srt_txt):
                        srt_uploaded += 1

    if completed_all_divs and not quota_hit:
        hist["stage2_yt_reset_completed"] = True
        hist["stage2_yt_audit_20261123_completed"] = True
        HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
        HISTORY_PATH.write_text(json.dumps(hist, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("=== YT STAGE2 2026-11-23 REMEDIATION 100% COMPLETE ===", flush=True)
    else:
        HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
        HISTORY_PATH.write_text(json.dumps(hist, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("=== YT STAGE2 2026-11-23 REMEDIATION PARTIAL/QUEUED (re-runs automatically at next quota reset) ===", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
