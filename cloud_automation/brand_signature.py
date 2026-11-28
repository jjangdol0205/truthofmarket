#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/brand_signature.py
================================================================================
Dream Company — 5-Division Fixed Brand Series Signature Utility (`$0`, Fail-Open)

Reads `data/brand_series_signatures.json` (and `1사업부/data/brand_series_signatures.json`
GHA mirror) to format lightweight, non-destructive 1-line series signatures for:
  - YouTube Shorts / Reels descriptions (`channel="yt"`)
  - Instagram Reels & 5-Slide Carousels (`channel="ig"` / `"ig_carousel"`)
  - Written SEO columns (`channel="seo"`)
  - Morning Club newsletters (`format_newsletter_signature`)

Core Safety Guarantees:
  1. Strict Fail-Open: Missing/corrupt JSON or unknown division ALWAYS returns `""`
     (NEVER crashes any promo or mailing pipeline).
  2. Dry-Run Counter Immutability: `increment_episode(div, dry_run=True)` NEVER
     writes to disk.
  3. Non-Destructive Length & Em-Dash Budget Guard: `append_brand_signature()`
     protects YT (<=4900) & IG (<=2150) caption ceilings and ensures combined
     em-dash `—` count never exceeds Standing Directive #35 limit (`<= 2`).
================================================================================
"""

from __future__ import annotations

import datetime as dt
import html as html_lib
import json
import re
from pathlib import Path
from typing import Any, Dict, Optional

KST = dt.timezone(dt.timedelta(hours=9))
ROOT = Path(__file__).resolve().parent.parent
HQ_ROOT = ROOT.parent if (ROOT.name == "1사업부" and (ROOT.parent / "data").exists()) else ROOT

SIGNATURES_PATH_HQ = HQ_ROOT / "data" / "brand_series_signatures.json"
SIGNATURES_PATH_DIV1 = HQ_ROOT / "1사업부" / "data" / "brand_series_signatures.json"

CHANNEL_MAX_LEN: Dict[str, int] = {
    "yt": 4900,
    "ig": 2150,
    "ig_carousel": 2150,
    "seo": 400,
    "newsletter": 600,
}


def _resolve_signatures_path(path: Optional[Path] = None) -> Optional[Path]:
    if path is not None:
        p = Path(path)
        return p if p.exists() else None
    for cand in (ROOT / "data" / "brand_series_signatures.json", SIGNATURES_PATH_HQ, SIGNATURES_PATH_DIV1):
        if cand.exists():
            return cand
    return None


def load_signatures(path: Optional[Path] = None) -> Dict[str, Any]:
    """Fail-open loader for `brand_series_signatures.json`. Never raises on missing/corrupt files."""
    try:
        target = _resolve_signatures_path(path)
        if target is None or not target.exists():
            return {}
        data = json.loads(target.read_text(encoding="utf-8"))
        if not isinstance(data, dict) or not isinstance(data.get("divisions"), dict):
            return {}
        return data
    except Exception:
        return {}


def _get_div_entry(div: str, path: Optional[Path] = None) -> Optional[Dict[str, Any]]:
    try:
        div_u = str(div or "").strip().upper()
        if not div_u:
            return None
        db = load_signatures(path=path)
        entry = (db.get("divisions") or {}).get(div_u)
        if not isinstance(entry, dict):
            return None
        if not str(entry.get("series") or "").strip():
            return None
        return entry
    except Exception:
        return None


def _format_ep_label(entry: Dict[str, Any], episode: Optional[int] = None) -> str:
    ep_num = int(episode) if (episode is not None and int(episode) > 0) else int(entry.get("next_episode") or 1)
    fmt = str(entry.get("ep_fmt") or "Ep.{n}").strip()
    try:
        return fmt.format(n=ep_num)
    except Exception:
        return f"Ep.{ep_num}"


def _clean_tagline_em_dash(tagline: str, lang: str, allow_em_dash: bool) -> str:
    if allow_em_dash or "—" not in tagline:
        return tagline
    sep = "・" if lang == "ja" else " · "
    return re.sub(r"\s*—\s*", sep, tagline).strip()


def _channel_club_text(club: str, channel: str) -> str:
    ch = str(channel or "yt").strip().lower()
    if ch in ("ig", "ig_carousel"):
        return club.replace("/go/yt", "/go/ig")
    return club


def format_series_header(
    div: str,
    episode: Optional[int] = None,
    channel: str = "yt",
    path: Optional[Path] = None,
    allow_em_dash: bool = True,
    max_len: Optional[int] = None,
) -> str:
    """
    Formats a crisp 1-line fixed brand series signature for YT/IG/Carousel/SEO.
    Strictly fail-open: returns `""` if config or division is missing.
    """
    try:
        entry = _get_div_entry(div, path=path)
        if not entry:
            return ""
        lang = str(entry.get("lang") or "en").strip().lower()
        series = str(entry.get("series") or "").strip()
        ep_label = _format_ep_label(entry, episode=episode)
        tagline = _clean_tagline_em_dash(str(entry.get("tagline") or "").strip(), lang=lang, allow_em_dash=allow_em_dash)
        club = _channel_club_text(str(entry.get("club") or "").strip(), channel=channel)

        ch = str(channel or "yt").strip().lower()
        if ch == "seo":
            line = f"{series} {ep_label} | {tagline}"
        else:
            line = f"[{series} {ep_label}] {tagline} | {club}" if club else f"[{series} {ep_label}] {tagline}"

        line = re.sub(r"\s+", " ", line).strip()
        limit = max_len if (max_len is not None and max_len > 0) else CHANNEL_MAX_LEN.get(ch, 300)
        if len(line) > limit:
            compact = f"[{series} {ep_label}] {club}".strip() if club else f"[{series} {ep_label}]"
            line = compact[:limit].rstrip()
        return line
    except Exception:
        return ""


def format_newsletter_signature(
    div: str,
    episode: Optional[int] = None,
    path: Optional[Path] = None,
    as_html: bool = False,
    allow_em_dash: bool = True,
) -> str:
    """
    Formats a 1-line Morning Club newsletter series signature (plain text or accessible HTML block).
    Strictly fail-open: returns `""` if config or division is missing.
    """
    try:
        div_u = str(div or "").strip().upper()
        entry = _get_div_entry(div_u, path=path)
        if not entry:
            return ""
        lang = str(entry.get("lang") or "en").strip().lower()
        series = str(entry.get("series") or "").strip()
        ep_label = _format_ep_label(entry, episode=episode)
        tagline = _clean_tagline_em_dash(str(entry.get("tagline") or "").strip(), lang=lang, allow_em_dash=allow_em_dash)
        club = str(entry.get("club") or "").strip()

        plain = f"{series} ({ep_label}) | {tagline} | {club}" if club else f"{series} ({ep_label}) | {tagline}"
        plain = re.sub(r"\s+", " ", plain).strip()
        if not as_html:
            return plain

        font_px = 20 if div_u == "HERO" else (17 if div_u in ("TOM", "GBA") else 14)
        return (
            f'<div data-brand-series-sig="1" style="max-width:640px;margin:0 auto 14px;padding:10px 14px;'
            f'border-left:3px solid #0f766e;background:#f8fafc;color:#334155;'
            f'font-size:{font_px}px;line-height:1.55;font-family:sans-serif;">'
            f'<strong>{html_lib.escape(series)} ({html_lib.escape(ep_label)})</strong> &middot; '
            f'{html_lib.escape(tagline)} &middot; {html_lib.escape(club)}'
            f"</div>"
        )
    except Exception:
        return ""


def append_brand_signature(
    div: str,
    base_text: str,
    channel: str = "yt",
    episode: Optional[int] = None,
    path: Optional[Path] = None,
    max_total_len: Optional[int] = None,
) -> str:
    """
    Non-destructively appends the 1-line brand series signature to `base_text` ONLY when:
      - Config is valid and series title is not already present (idempotent)
      - Combined length stays strictly within platform cap (YT 4900 / IG 2150)
      - Combined em-dash (`—`) count stays strictly <= 2 (auto-degrades `—` in signature if needed)
    Returns `base_text` unchanged on any error or budget squeeze (fail-open).
    """
    try:
        raw = str(base_text or "")
        entry = _get_div_entry(div, path=path)
        if not entry:
            return raw
        series = str(entry.get("series") or "").strip()
        if series and series in raw:
            return raw

        existing_em = raw.count("—")
        allow_em = (existing_em + 1) <= 2
        sig = format_series_header(div, episode=episode, channel=channel, path=path, allow_em_dash=allow_em)
        if not sig:
            return raw

        ch = str(channel or "yt").strip().lower()
        cap = max_total_len if (max_total_len is not None and max_total_len > 0) else CHANNEL_MAX_LEN.get(ch, 2150)
        candidate = f"{raw.rstrip()}\n\n{sig}" if raw.strip() else sig
        if len(candidate) <= cap:
            return candidate

        # Fallback to compact series+club without disturbing original hook/CTA/links
        ep_label = _format_ep_label(entry, episode=episode)
        club = _channel_club_text(str(entry.get("club") or "").strip(), channel=channel)
        compact = f"[{series} {ep_label}] {club}".strip() if club else f"[{series} {ep_label}]"
        candidate_compact = f"{raw.rstrip()}\n\n{compact}" if raw.strip() else compact
        if len(candidate_compact) <= cap:
            return candidate_compact
        return raw
    except Exception:
        return str(base_text or "")


def increment_episode(
    div: str,
    dry_run: bool = True,
    path: Optional[Path] = None,
    mirror_div1: bool = True,
) -> int:
    """
    Increments `next_episode` for `div` in `brand_series_signatures.json`.
      - `dry_run=True` (default): NEVER writes to disk; returns preview next value (`current + 1`).
      - `dry_run=False`: writes updated JSON with LF endings and syncs `1사업부` mirror if present.
      - Strictly fail-open: returns `0` if file or division is missing.
    """
    try:
        div_u = str(div or "").strip().upper()
        target = _resolve_signatures_path(path)
        if target is None or not target.exists():
            return 0
        db = json.loads(target.read_text(encoding="utf-8"))
        d_obj = (db.get("divisions") or {}).get(div_u)
        if not isinstance(d_obj, dict):
            return 0
        cur = int(d_obj.get("next_episode") or 1)
        nxt = cur + 1
        if dry_run:
            return nxt

        d_obj["next_episode"] = nxt
        db["updated_at_kst"] = dt.datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST")
        payload_bytes = (json.dumps(db, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
        target.write_bytes(payload_bytes)
        if mirror_div1 and path is None:
            for peer in (SIGNATURES_PATH_HQ, SIGNATURES_PATH_DIV1):
                if peer != target and peer.parent.exists():
                    peer.write_bytes(payload_bytes)
        return nxt
    except Exception:
        return 0
