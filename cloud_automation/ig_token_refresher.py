#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dream Company — 45-Day Instagram Long-Lived Token Auto-Refresher & Expiry Alert (Stage 4-2 Hardened)
================================================================================
Fixes `OAuthException code: 190 (Cannot parse access token)` permanently:
1. Sanitizes every token (strips CR/LF/spaces/wrapping quotes) & blocks empty/dummy/malformed
   secrets BEFORE calling Meta Graph API, printing the exact secret key name to fix.
2. Strictly separates endpoints by token type:
   - `EAA...` (Meta Page/Business Graph Token):
     * Verify:  `https://graph.facebook.com/v21.0/{ig_user_id}?fields=id,username`
     * Refresh: `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token`
                (requires `META_APP_ID` + `META_APP_SECRET`; if absent, performs live verify ONLY
                and NEVER calls `graph.instagram.com/refresh_access_token`!).
   - `IGAA...` / `IGQV...` (Instagram Login Token):
     * Verify:  `https://graph.instagram.com/v21.0/me?fields=id,username`
     * Refresh: `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token`
3. Enforces `#5 Outbound Allowlist`: ONLY official 5 Dream Company IG Business IDs and
   allowlisted internal HQ alert emails may be queried/notified.
4. Falls back cleanly to local `shorts_automation_hq/data/instagram_api_vault.json` when run
   locally without exported env vars.
"""

from __future__ import annotations

import datetime as dt
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, Tuple

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
    assert_allowed_email_recipient,
    assert_allowed_ig_target,
    sanitize_and_classify_ig_token,
)

ROOT = Path(__file__).resolve().parent.parent
HISTORY_PATH = ROOT / "data" / "promo_history.json"
LOCAL_VAULT_PATH = ROOT / "shorts_automation_hq" / "data" / "instagram_api_vault.json"
DIVS = ["TOM", "KFG", "GBA", "HERO", "KFK"]


def _load_local_vault() -> Dict[str, Any]:
    if LOCAL_VAULT_PATH.exists():
        try:
            return json.loads(LOCAL_VAULT_PATH.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def send_brevo_alert(subject: str, html: str) -> None:
    key = os.getenv("BREVO_API_KEY", "").strip()
    to_email = os.getenv("HQ_MASTER_EMAIL", "beable9489@gmail.com").strip()
    try:
        to_email = assert_allowed_email_recipient(to_email, d1_opted_in=False)
    except OutboundAllowlistError as oe:
        print(f"[ALLOWLIST BLOCKED ALERT] {oe}", flush=True)
        return
    if not key:
        print(f"[ALERT SKIPPED - NO BREVO KEY] {subject}", flush=True)
        return
    payload = {
        "sender": {"name": "DreamCompany Token Watchdog", "email": "hello@truthofmarket.com"},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html,
    }
    req = urllib.request.Request(
        "https://api.brevo.com/v3/smtp/email",
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={"api-key": key, "content-type": "application/json", "accept": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            print(f"[ALERT SENT] {subject} -> HTTP {r.status}", flush=True)
    except Exception as e:
        print(f"[ALERT ERR] {e}", flush=True)


def verify_token_live(token: str, token_type: str, ig_user_id: str) -> Tuple[bool, str]:
    """Verifies Meta/Instagram token liveness using the strictly matched Graph host."""
    if token_type == "ig_login_igaa":
        qs = urllib.parse.urlencode({"fields": "id,username", "access_token": token})
        endpoint = f"https://graph.instagram.com/v21.0/me?{qs}"
    else:
        target = urllib.parse.quote(ig_user_id) if ig_user_id else "me"
        qs = urllib.parse.urlencode({"fields": "id,username", "access_token": token})
        endpoint = f"https://graph.facebook.com/v21.0/{target}?{qs}"

    try:
        with urllib.request.urlopen(endpoint, timeout=15) as cr:
            cdata = json.loads(cr.read().decode("utf-8"))
            if isinstance(cdata, dict):
                if cdata.get("error"):
                    return False, str(cdata["error"])[:220]
                ident = cdata.get("username") or cdata.get("id") or "ok"
                return True, f"id={cdata.get('id', ig_user_id or 'me')} (@{ident})"
            return True, "HTTP 200 valid"
    except urllib.error.HTTPError as ce:
        err_body = ce.read().decode("utf-8", errors="replace")[:220]
        return False, f"HTTP {ce.code} ({err_body})"
    except Exception as e:
        return False, str(e)


def build_refresh_url(token: str, token_type: str, app_id: str, app_secret: str) -> Tuple[str, str]:
    """
    Strictly splits refresh endpoints by token prefix:
      - `fb_graph_eaa` (`EAA...`) -> `graph.facebook.com/v21.0/oauth/access_token` (`fb_exchange_token`)
      - `ig_login_igaa` (`IGAA...`) -> `graph.instagram.com/refresh_access_token` (`ig_refresh_token`)
    Returns `(url, mode)` where `url == ""` means verify-only (when `EAA...` lacks `META_APP_SECRET`).
    """
    if token_type == "fb_graph_eaa":
        if app_id and app_secret:
            qs = urllib.parse.urlencode({
                "grant_type": "fb_exchange_token",
                "client_id": app_id,
                "client_secret": app_secret,
                "fb_exchange_token": token,
            })
            return f"https://graph.facebook.com/v21.0/oauth/access_token?{qs}", "fb_exchange_token"
        return "", "fb_verify_only_no_app_secret"
    if token_type == "ig_login_igaa":
        qs = urllib.parse.urlencode({"grant_type": "ig_refresh_token", "access_token": token})
        return f"https://graph.instagram.com/refresh_access_token?{qs}", "ig_refresh_token"
    return "", "unsupported_token_type"


def main() -> int:
    hist = json.loads(HISTORY_PATH.read_text(encoding="utf-8")) if HISTORY_PATH.exists() else {}
    refreshed_map = hist.setdefault("ig_tokens_last_refreshed", {})
    vault = _load_local_vault()
    vault_divs = vault.get("divisions", {}) if isinstance(vault, dict) else {}

    now = dt.datetime.now(dt.timezone.utc)
    app_id = (os.getenv("META_APP_ID", "") or str(vault.get("meta_app_id", ""))).strip()
    app_secret = (os.getenv("META_APP_SECRET", "") or str(vault.get("meta_app_secret", ""))).strip()
    alerts = []
    report: Dict[str, Any] = {}

    for div in DIVS:
        raw_env_tok = os.getenv(f"IG_ACCESS_TOKEN_{div}", "")
        raw_env_uid = os.getenv(f"IG_USER_ID_{div}", "")
        vcfg = vault_divs.get(div, {}) if isinstance(vault_divs, dict) else {}
        source = "env" if raw_env_tok else ("local_vault" if vcfg.get("access_token") else "missing")
        raw_tok = raw_env_tok if raw_env_tok else str(vcfg.get("access_token", ""))
        ig_uid = (raw_env_uid or str(vcfg.get("ig_user_id", "")) or ALLOWED_IG_ACCOUNTS[div]["ig_user_id"]).strip()

        # Enforce #5 Outbound Allowlist on target IG User ID
        try:
            ig_uid = assert_allowed_ig_target(div, ig_uid)
        except OutboundAllowlistError as oe:
            print(f"[IG TOKEN {div}] {oe}", flush=True)
            alerts.append(f"{div} (IG_USER_ID_{div}): {oe}")
            continue

        info = sanitize_and_classify_ig_token(raw_tok)
        if not info["ok"]:
            msg = f"IG_ACCESS_TOKEN_{div} invalid ({info['reason']}, source={source}, had_ws={info['had_whitespace']}) — reissue/sync required"
            print(f"[IG TOKEN {div}] FORMAT/SECRET ERROR: {msg}", flush=True)
            report[div] = {"ok": False, "source": source, "reason": info["reason"], "key": f"IG_ACCESS_TOKEN_{div}"}
            if source != "missing":
                alerts.append(f"{div}: {msg}")
            continue

        tok = str(info["token"])
        tok_type = str(info["token_type"])
        if info["had_whitespace"]:
            print(f"[IG TOKEN {div}] WARN: stripped trailing whitespace/newline from IG_ACCESS_TOKEN_{div} ({source})", flush=True)

        last_iso = refreshed_map.get(div, "")
        age_days = 999
        if last_iso:
            try:
                age_days = (now - dt.datetime.fromisoformat(last_iso)).days
            except Exception:
                age_days = 999

        if age_days < 45:
            ok, detail = verify_token_live(tok, tok_type, ig_uid)
            report[div] = {"ok": ok, "source": source, "type": tok_type, "detail": detail, "age_days": age_days}
            if ok:
                print(f"[IG TOKEN {div}] LIVE OK ({tok_type}, {age_days}d < 45d, {detail})", flush=True)
            else:
                print(f"[IG TOKEN {div}] LIVE CHECK FAIL ({tok_type}): {detail}", flush=True)
                alerts.append(f"{div} (IG_ACCESS_TOKEN_{div}): {detail}")
            continue

        refresh_url, mode = build_refresh_url(tok, tok_type, app_id, app_secret)
        if not refresh_url:
            ok, detail = verify_token_live(tok, tok_type, ig_uid)
            report[div] = {"ok": ok, "source": source, "type": tok_type, "mode": mode, "detail": detail}
            if ok:
                refreshed_map[div] = now.isoformat()
                print(f"[IG TOKEN {div}] VERIFIED LIVE ({mode}, {detail}) -> OK", flush=True)
            else:
                print(f"[IG TOKEN {div}] VERIFY FAIL ({mode}): {detail}", flush=True)
                alerts.append(f"{div} (IG_ACCESS_TOKEN_{div}): {detail}")
            continue

        try:
            with urllib.request.urlopen(refresh_url, timeout=15) as r:
                data = json.loads(r.read().decode("utf-8"))
                if data.get("access_token"):
                    refreshed_map[div] = now.isoformat()
                    print(f"[IG TOKEN {div}] REFRESHED OK via {mode} (expires_in={data.get('expires_in')}s)", flush=True)
                    report[div] = {"ok": True, "source": source, "type": tok_type, "mode": mode}
                else:
                    alerts.append(f"{div} (IG_ACCESS_TOKEN_{div}): unexpected refresh response")
                    report[div] = {"ok": False, "source": source, "type": tok_type, "mode": mode}
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")[:220]
            print(f"[IG TOKEN {div}] REFRESH FAIL ({mode}) HTTP {e.code}: {err_body}", flush=True)
            alerts.append(f"{div} (IG_ACCESS_TOKEN_{div}): HTTP {e.code} ({err_body})")
            report[div] = {"ok": False, "source": source, "type": tok_type, "mode": mode, "error": err_body}
        except Exception as e:
            alerts.append(f"{div} (IG_ACCESS_TOKEN_{div}): {e}")
            report[div] = {"ok": False, "source": source, "type": tok_type, "error": str(e)}

    if alerts:
        send_brevo_alert(
            f"[🚨 토큰 만료 경보] Instagram 장기 토큰 확인 필요 {len(alerts)}건",
            "<h3>Instagram 장기 토큰 점검 필요 (시크릿 키명 명시)</h3><ul>" + "".join(f"<li>{a}</li>" for a in alerts) + "</ul>",
        )
    if HISTORY_PATH.exists():
        HISTORY_PATH.write_text(json.dumps(hist, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    ok_cnt = sum(1 for v in report.values() if v.get("ok"))
    print(f"=== IG Token Audit Complete: {ok_cnt}/5 LIVE OK ===", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
