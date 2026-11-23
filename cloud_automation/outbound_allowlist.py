#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/outbound_allowlist.py
================================================================================
Dream Company Stage 4 Safety Pin (#5 Outbound Allowlist Guardrail)
Hard code-level allowlist preventing ANY automated SNS or Email worker from
posting to or emailing an unauthorized third-party account or recipient.

Enforces:
1. Official 5 YouTube Channel IDs ONLY
2. Official 5 Instagram Business Account IDs & Handles ONLY
3. Internal HQ Alert Emails or Cloudflare D1 verified (`unsubscribed = 0`) CRM members ONLY
4. Instagram Token Sanitization & Strict Prefix Routing (`EAA...` vs `IGAA...`)
   eliminating `OAuthException code: 190 (Cannot parse access token)` errors.
"""

from __future__ import annotations

import os
import re
from typing import Dict, FrozenSet, Optional, Tuple

ALLOWED_YOUTUBE_CHANNELS: Dict[str, Dict[str, str]] = {
    "TOM": {"channel_id": "UCbxWByxJntRqoweWy-4QnqA", "handle": "@TruthOfMarketUS"},
    "KFG": {"channel_id": "UCMabm6nnINhHFwekDP6mqoA", "handle": "@kisfitglobal"},
    "GBA": {"channel_id": "UCz_lV9K4EUZylnnS8zXGrng", "handle": "@GetBreakAI"},
    "HERO": {"channel_id": "UCVsUonyLFpyWHfLi0tqJzPg", "handle": "@김쌤의영웅라디오"},
    "KFK": {"channel_id": "UCZb2uBYNLfld4CkQl0CvWLQ", "handle": "@kidsfit01"},
}

ALLOWED_IG_ACCOUNTS: Dict[str, Dict[str, str]] = {
    "TOM": {"ig_user_id": "17841454132078079", "handle": "@truthofmarket"},
    "KFG": {"ig_user_id": "17841462105783884", "handle": "@kisfitglobal"},
    "GBA": {"ig_user_id": "17841442311842252", "handle": "@getbreakai"},
    "HERO": {"ig_user_id": "17841422748775190", "handle": "@paradise_hero1"},
    "KFK": {"ig_user_id": "17841478193339769", "handle": "@kids_fit1"},
}

ALLOWED_IG_USER_IDS: FrozenSet[str] = frozenset(v["ig_user_id"] for v in ALLOWED_IG_ACCOUNTS.values())
ALLOWED_YT_CHANNEL_IDS: FrozenSet[str] = frozenset(v["channel_id"] for v in ALLOWED_YOUTUBE_CHANNELS.values())

ALLOWED_OFFICIAL_DOMAINS: FrozenSet[str] = frozenset({
    "truthofmarket.com",
    "kisfitglobal.com",
    "getbreakai.com",
    "paradise-hero.com",
    "kidsfit.co.kr",
})

ALLOWED_INTERNAL_ALERT_EMAILS: FrozenSet[str] = frozenset({
    "beable9489@gmail.com",
    "hello@truthofmarket.com",
    "help@kidsfit.co.kr",
    "radio@paradise-hero.com",
})

DUMMY_TOKEN_MARKERS: Tuple[str, ...] = (
    "dummy",
    "your_",
    "placeholder",
    "replace_me",
    "changeme",
    "paste_",
    "todo",
    "test_token",
    "xxx",
    "none",
    "null",
    "undefined",
)

TOKEN_CHAR_RE = re.compile(r"^[A-Za-z0-9._|\-]+$")


class OutboundAllowlistError(PermissionError):
    """Raised whenever an outbound SNS or Email call targets a non-allowlisted destination."""


def assert_allowed_ig_target(div: str, ig_user_id: str) -> str:
    div_u = str(div or "").strip().upper()
    uid = str(ig_user_id or "").strip()
    if div_u not in ALLOWED_IG_ACCOUNTS:
        raise OutboundAllowlistError(f"[OUTBOUND_ALLOWLIST] Unknown division '{div_u}' for Instagram publish")
    expected = ALLOWED_IG_ACCOUNTS[div_u]["ig_user_id"]
    if uid != expected or uid not in ALLOWED_IG_USER_IDS:
        raise OutboundAllowlistError(
            f"[OUTBOUND_ALLOWLIST] Blocked Instagram target uid='{uid}' for {div_u} (expected allowlisted '{expected}')"
        )
    return uid


def assert_allowed_yt_channel(div: str, channel_id: str) -> str:
    div_u = str(div or "").strip().upper()
    cid = str(channel_id or "").strip()
    if div_u not in ALLOWED_YOUTUBE_CHANNELS:
        raise OutboundAllowlistError(f"[OUTBOUND_ALLOWLIST] Unknown division '{div_u}' for YouTube")
    expected = ALLOWED_YOUTUBE_CHANNELS[div_u]["channel_id"]
    if cid != expected or cid not in ALLOWED_YT_CHANNEL_IDS:
        raise OutboundAllowlistError(
            f"[OUTBOUND_ALLOWLIST] Blocked YouTube target channel_id='{cid}' for {div_u} (expected allowlisted '{expected}')"
        )
    return cid


def assert_allowed_email_recipient(email: str, *, d1_opted_in: bool = False) -> str:
    addr = str(email or "").strip().lower()
    if not addr or "@" not in addr or "." not in addr.split("@")[-1]:
        raise OutboundAllowlistError(f"[OUTBOUND_ALLOWLIST] Invalid recipient email format: '{addr}'")
    master = os.getenv("HQ_MASTER_EMAIL", "beable9489@gmail.com").strip().lower()
    if addr == master or addr in ALLOWED_INTERNAL_ALERT_EMAILS:
        return addr
    if d1_opted_in:
        return addr
    raise OutboundAllowlistError(
        f"[OUTBOUND_ALLOWLIST] Blocked outbound email to non-verified third-party recipient '{addr}' (d1_opted_in=False)"
    )


def sanitize_and_classify_ig_token(raw_token: str) -> Dict[str, object]:
    """
    Cleans hidden CR/LF/whitespace/wrapping quotes and classifies Meta/Instagram tokens
    BEFORE calling Graph API so malformed secrets NEVER trigger opaque `code 190` loops.

    Returns:
      {
        "ok": bool,
        "token": str,           # cleaned token (empty if invalid)
        "token_type": str,      # 'fb_graph_eaa' | 'ig_login_igaa' | 'empty' | 'dummy' | 'malformed' | 'unknown_prefix'
        "had_whitespace": bool,
        "reason": str,
      }
    """
    raw = str(raw_token or "")
    had_ws = (raw != raw.strip()) or ("\n" in raw) or ("\r" in raw) or ("\t" in raw)
    cleaned = raw.strip().strip('"').strip("'").replace("\r", "").replace("\n", "").strip()

    if not cleaned:
        return {"ok": False, "token": "", "token_type": "empty", "had_whitespace": had_ws, "reason": "empty_secret"}

    low = cleaned.lower()
    if any(m in low for m in DUMMY_TOKEN_MARKERS):
        return {"ok": False, "token": "", "token_type": "dummy", "had_whitespace": had_ws, "reason": "dummy_placeholder_string"}

    if len(cleaned) < 40 or not TOKEN_CHAR_RE.match(cleaned):
        return {
            "ok": False,
            "token": "",
            "token_type": "malformed",
            "had_whitespace": had_ws,
            "reason": f"malformed_token_chars_or_short(len={len(cleaned)})",
        }

    if cleaned.startswith("EAA"):
        return {
            "ok": True,
            "token": cleaned,
            "token_type": "fb_graph_eaa",
            "had_whitespace": had_ws,
            "reason": "valid_facebook_graph_page_token",
        }
    if cleaned.startswith(("IGAA", "IGQV", "IGA")):
        return {
            "ok": True,
            "token": cleaned,
            "token_type": "ig_login_igaa",
            "had_whitespace": had_ws,
            "reason": "valid_instagram_login_token",
        }

    return {
        "ok": False,
        "token": "",
        "token_type": "unknown_prefix",
        "had_whitespace": had_ws,
        "reason": f"unrecognized_prefix({cleaned[:4]})",
    }
