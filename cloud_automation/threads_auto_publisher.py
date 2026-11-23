#!/usr/bin/env python3
# -*- coding: utf-8 -*-
r"""
cloud_automation/threads_auto_publisher.py
================================================================================
Channel 2 — Official Free Meta `Threads API` Auto-Publisher & 45-Day Token Refresher
  - Endpoint: `POST https://graph.threads.com/v1.0/{threads-user-id}/threads`
              `POST https://graph.threads.com/v1.0/{threads-user-id}/threads_publish`
  - Single-Variable A/B Staggered Testing:
      Publishes Arm A (`vA`) and Arm B (`vB`) differing ONLY in the first 0.3s
      hook line (`hook_type`), with 90% pure insight body and bottom link
      `?utm_source=threads&utm_medium=text&utm_content={matrix_id}_v{A|B}`.
  - 45-Day Long-Lived Token Auto-Refresher (`graph.threads.net/refresh_access_token`).
  - Paid X (Twitter) API ($0.20/link) is PERMANENTLY EXCLUDED (`0` X API calls).
================================================================================
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
from pathlib import Path
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

KST = dt.timezone(dt.timedelta(hours=9))
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from written_promo_engine import (
    DIV_WEB_CONFIG,
    LEDGER_PATH,
    MATRIX_PATH,
    X_PAID_API_FORBIDDEN,
    check_written_auto_gate,
    select_article_ab_pair,
)

THREADS_QUEUE_PATH = ROOT / "data" / "threads_ab_queue.json"
THREADS_API_BASE = "https://graph.threads.com/v1.0"
THREADS_REFRESH_URL = "https://graph.threads.net/refresh_access_token"


def build_threads_post_text(div: str, matrix_db: Dict[str, Any], article_url: str, arm: str = "A", week_seed: int = 0) -> Dict[str, Any]:
    """Builds a ~420-500 char Slippery-Slide Threads post (90% pure insight + bottom UTM link)."""
    div_u = div.upper()
    d_obj = matrix_db["divisions"][div_u]
    sb = d_obj["storybrand_7parts"]
    p3 = sb["problem_3layers"]
    arm_a, arm_b = select_article_ab_pair(matrix_db, div_u, week_seed=week_seed)
    chosen = arm_a if arm.upper() == "A" else arm_b

    utm_content = f"{chosen['id']}_v{arm.upper()}"
    sep = "&" if "?" in article_url else "?"
    utm_link = f"{article_url}{sep}utm_source=threads&utm_medium=text&utm_content={utm_content}"

    hook = str(chosen["hook_line"]).strip()
    body = str(chosen["slide_script_body"]).strip()
    empathy = str(p3["internal"]).strip()
    step1 = str(sb["plan_3steps"][0]).strip()
    cta_prefix = (
        "Full 2000–2025 data table & free check:" if div_u == "TOM"
        else ("Full US CDC reference table & free 60s check:" if div_u == "KFG"
              else ("過去25年データ表＆30秒無料診断はこちら：" if div_u == "GBA"
                    else ("백운호 14분 무료 라디오 & 큰글씨 이야기 전문:" if div_u == "HERO"
                          else "질병관리청 실데이터 표 & 30초 무료 진단:")))
    )

    # Keep cleanly under Threads 500-char limit while keeping 90% insight + clean bottom link
    core = f"{hook}\n\n{empathy}\n\n{body}\n\n{step1}"
    footer = f"\n\n{cta_prefix}\n{utm_link}"
    max_core = max(160, 495 - len(footer))
    if len(core) > max_core:
        core = core[: max_core - 1].rstrip() + "…"
    full_text = core + footer

    ok, errs = check_written_auto_gate(div_u, hook, full_text, full_text, is_seo_article=False)
    return {
        "ok": ok and X_PAID_API_FORBIDDEN,
        "errors": errs,
        "division": div_u,
        "arm": arm.upper(),
        "matrix_id": chosen["id"],
        "hook_type": chosen["hook_type"],
        "utm_content": utm_content,
        "text": full_text,
        "char_count": len(full_text),
        "link": utm_link,
    }


def publish_to_threads_api(div: str, text: str, dry_run: bool = False) -> Dict[str, Any]:
    tok = os.getenv(f"THREADS_ACCESS_TOKEN_{div}", "").strip()
    uid = os.getenv(f"THREADS_USER_ID_{div}", "").strip()
    if dry_run:
        return {"ok": True, "status": "dry_run_validated", "has_credentials": bool(tok and uid)}
    if not (tok and uid):
        return {"ok": True, "status": "queued_awaiting_threads_token", "has_credentials": False}

    try:
        # Step 1: Create Threads text container
        create_data = urllib.parse.urlencode({
            "media_type": "TEXT",
            "text": text,
            "access_token": tok,
        }).encode("utf-8")
        req = urllib.request.Request(f"{THREADS_API_BASE}/{uid}/threads", data=create_data, method="POST")
        with urllib.request.urlopen(req, timeout=25) as r:
            cid = json.loads(r.read().decode("utf-8")).get("id")
        if not cid:
            return {"ok": False, "error": "missing_creation_id"}

        time.sleep(3)
        # Step 2: Publish Threads container
        pub_data = urllib.parse.urlencode({"creation_id": cid, "access_token": tok}).encode("utf-8")
        preq = urllib.request.Request(f"{THREADS_API_BASE}/{uid}/threads_publish", data=pub_data, method="POST")
        with urllib.request.urlopen(preq, timeout=25) as pr:
            pid = json.loads(pr.read().decode("utf-8")).get("id")
        return {"ok": True, "status": "published_live", "threads_post_id": pid}
    except urllib.error.HTTPError as e:
        return {"ok": False, "http_error": e.code, "body": e.read().decode("utf-8", errors="replace")[:240]}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def refresh_threads_tokens_45d(dry_run: bool = False) -> Dict[str, Any]:
    """45-Day automatic Threads Long-Lived Token renewal (`graph.threads.net/refresh_access_token`)."""
    results: Dict[str, Any] = {}
    for div in ("TOM", "KFG", "GBA", "HERO", "KFK"):
        tok = os.getenv(f"THREADS_ACCESS_TOKEN_{div}", "").strip()
        if not tok:
            results[div] = {"status": "token_not_configured"}
            continue
        if dry_run:
            results[div] = {"status": "dry_run_ready"}
            continue
        qs = urllib.parse.urlencode({"grant_type": "th_refresh_token", "access_token": tok})
        try:
            with urllib.request.urlopen(f"{THREADS_REFRESH_URL}?{qs}", timeout=20) as r:
                body = json.loads(r.read().decode("utf-8"))
                results[div] = {"ok": True, "expires_in_sec": body.get("expires_in", 0)}
        except urllib.error.HTTPError as e:
            results[div] = {"ok": False, "http_error": e.code}
        except Exception as e:
            results[div] = {"ok": False, "error": str(e)[:120]}
    return results


def main() -> int:
    parser = argparse.ArgumentParser(description="Channel 2: Official Free Meta Threads API Auto-Publisher (A/B Hook Staggered)")
    parser.add_argument("--arm", choices=["A", "B", "BOTH"], default="BOTH")
    parser.add_argument("--refresh-tokens", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    matrix_db = json.loads(MATRIX_PATH.read_text(encoding="utf-8"))
    ledger = json.loads(LEDGER_PATH.read_text(encoding="utf-8")) if LEDGER_PATH.exists() else {"articles": []}
    latest_by_div = {a["division"]: a["canonical_url"] for a in ledger.get("articles", [])}
    week_seed = dt.datetime.now(KST).isocalendar().week
    arms = ["A", "B"] if args.arm == "BOTH" else [args.arm]

    posts = []
    for div in ("TOM", "KFG", "GBA", "HERO", "KFK"):
        target_url = latest_by_div.get(div) or DIV_WEB_CONFIG[div]["base_url"]
        for arm in arms:
            p = build_threads_post_text(div, matrix_db, target_url, arm=arm, week_seed=week_seed)
            if not p["ok"]:
                raise RuntimeError(f"Auto-Gate blocked Threads {div} {arm}: {p['errors']}")
            p["publish_result"] = publish_to_threads_api(div, p["text"], dry_run=args.dry_run)
            posts.append(p)

    out = {
        "updated_at_kst": dt.datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST"),
        "x_paid_api_disabled": True,
        "count": len(posts),
        "posts": posts,
    }
    if args.refresh_tokens:
        out["token_refresh"] = refresh_threads_tokens_45d(dry_run=args.dry_run)
    if not args.dry_run:
        THREADS_QUEUE_PATH.parent.mkdir(parents=True, exist_ok=True)
        THREADS_QUEUE_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({
        "ok": True,
        "x_paid_api_disabled": True,
        "count": len(posts),
        "sample": [{k: p[k] for k in ("division", "arm", "hook_type", "utm_content", "char_count", "publish_result")} for p in posts],
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
