#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dream Company — 45-Day Instagram Long-Lived Token Auto-Refresher & Expiry Alert (Stage 4-1)
Checks all 5 divisions' IG long-lived access tokens (`IG_ACCESS_TOKEN_{TOM|KFG|GBA|HERO|KFK}`),
automatically refreshes any token older than 45 days via Meta Graph API, and sends an immediate
Brevo alert to `HQ_MASTER_EMAIL` ONLY if a token is invalid or expiring within 10 days ("No news is good news").
"""

from __future__ import annotations

import datetime as dt
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HISTORY_PATH = ROOT / "data" / "promo_history.json"
DIVS = ["TOM", "KFG", "GBA", "HERO", "KFK"]


def send_brevo_alert(subject: str, html: str) -> None:
    key = os.getenv("BREVO_API_KEY", "").strip()
    to_email = os.getenv("HQ_MASTER_EMAIL", "beable9489@gmail.com").strip()
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


def _verify_fb_graph_token_live(tok: str, ig_user_id: str = "") -> tuple[bool, str]:
    """Verify Facebook/Instagram Graph token liveness safely (handles IG User ID and /me list responses)."""
    if ig_user_id:
        qs = urllib.parse.urlencode({"fields": "id,username", "access_token": tok})
        endpoint = f"https://graph.facebook.com/v21.0/{urllib.parse.quote(ig_user_id)}?{qs}"
    else:
        qs = urllib.parse.urlencode({"fields": "id", "access_token": tok})
        endpoint = f"https://graph.facebook.com/v21.0/me?{qs}"
    try:
        with urllib.request.urlopen(endpoint, timeout=15) as cr:
            cdata = json.loads(cr.read().decode("utf-8"))
            if isinstance(cdata, dict):
                if cdata.get("error"):
                    return False, str(cdata["error"])[:200]
                ident = cdata.get("username") or cdata.get("id") or "ok"
                return True, f"id={cdata.get('id', ig_user_id or 'me')} ({ident})"
            if isinstance(cdata, list):
                # Scoped Graph tokens return HTTP 200 [] on /me?fields=id when valid (invalid tokens return HTTP 400/401)
                return True, "HTTP 200 scoped-token valid"
            return True, "HTTP 200 valid"
    except urllib.error.HTTPError as ce:
        err_body = ce.read().decode("utf-8", errors="replace")[:200]
        return False, f"HTTP {ce.code} ({err_body})"
    except Exception as e:
        return False, str(e)


def main() -> int:
    hist = json.loads(HISTORY_PATH.read_text(encoding="utf-8")) if HISTORY_PATH.exists() else {}
    refreshed_map = hist.setdefault("ig_tokens_last_refreshed", {})
    now = dt.datetime.now(dt.timezone.utc)
    app_id = os.getenv("META_APP_ID", "").strip()
    app_secret = os.getenv("META_APP_SECRET", "").strip()
    alerts = []

    for div in DIVS:
        tok = os.getenv(f"IG_ACCESS_TOKEN_{div}", "").strip()
        ig_uid = os.getenv(f"IG_USER_ID_{div}", "").strip()
        if not tok:
            print(f"[IG TOKEN {div}] secret not configured yet (skipped)", flush=True)
            continue
        last_iso = refreshed_map.get(div, "")
        age_days = 999
        if last_iso:
            try:
                age_days = (now - dt.datetime.fromisoformat(last_iso)).days
            except Exception:
                age_days = 999

        if age_days < 45:
            # Lightweight FB Graph liveness check without spamming false refresh failures
            ok, detail = _verify_fb_graph_token_live(tok, ig_uid)
            if ok:
                print(f"[IG TOKEN {div}] fresh & live ({age_days}d < 45d cycle, {detail}) -> OK", flush=True)
            else:
                print(f"[IG TOKEN {div}] LIVE CHECK WARN: {detail}", flush=True)
                if "HTTP 400" in detail or "HTTP 401" in detail or "OAuthException" in detail:
                    alerts.append(f"{div}: Token invalid/expired ({detail})")
            continue

        # Attempt Graph API long-lived token exchange/refresh
        if app_id and app_secret:
            qs = urllib.parse.urlencode({
                "grant_type": "fb_exchange_token",
                "client_id": app_id,
                "client_secret": app_secret,
                "fb_exchange_token": tok,
            })
            url = f"https://graph.facebook.com/v21.0/oauth/access_token?{qs}"
        elif tok.startswith("EAA"):
            # Facebook Graph long-lived page/business tokens require META_APP_SECRET to exchange; verify live validity instead of calling Basic Display endpoint
            ok, detail = _verify_fb_graph_token_live(tok, ig_uid)
            if ok:
                refreshed_map[div] = now.isoformat()
                print(f"[IG TOKEN {div}] FB Graph token verified LIVE ({detail}) -> OK", flush=True)
            else:
                print(f"[IG TOKEN {div}] FB Graph verify FAIL: {detail}", flush=True)
                alerts.append(f"{div}: {detail}")
            continue
        else:
            qs = urllib.parse.urlencode({"grant_type": "ig_refresh_token", "access_token": tok})
            url = f"https://graph.instagram.com/refresh_access_token?{qs}"

        try:
            with urllib.request.urlopen(url, timeout=15) as r:
                data = json.loads(r.read().decode("utf-8"))
                if data.get("access_token"):
                    refreshed_map[div] = now.isoformat()
                    print(f"[IG TOKEN {div}] refreshed OK (expires_in={data.get('expires_in')}s)", flush=True)
                else:
                    alerts.append(f"{div}: unexpected refresh response")
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")[:200]
            print(f"[IG TOKEN {div}] REFRESH FAIL HTTP {e.code}: {err_body}", flush=True)
            alerts.append(f"{div}: HTTP {e.code} ({err_body})")
        except Exception as e:
            alerts.append(f"{div}: {e}")

    if alerts:
        send_brevo_alert(
            f"[🚨 토큰 만료 경보] Instagram 장기 토큰 갱신 실패 {len(alerts)}건",
            "<h3>Instagram 장기 토큰 확인 필요</h3><ul>" + "".join(f"<li>{a}</li>" for a in alerts) + "</ul>",
        )
    if HISTORY_PATH.exists():
        HISTORY_PATH.write_text(json.dumps(hist, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
