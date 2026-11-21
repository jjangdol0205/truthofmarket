#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/ab_evolution_engine.py
=======================================
Standalone GitHub Actions & Local Weekly Single-Variable A/B Evolution Runner.
Reads `data/message_matrix_5div.json`, queries Cloudflare D1 `funnel_events`
grouped by `utm_content`, applies strict statistical gates:
  - min_impressions >= 300 OR min_landing_clicks >= 30
  - relative conversion rate lift >= 20%
Promotes confirmed Winners (weight 2x + 3 guardrail-verified variants) and pauses
bottom 20% Losers, writing updated `data/message_matrix_5div.json`.
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import urllib.request
from typing import Any, Dict, List, Optional, Tuple

KST = dt.timezone(dt.timedelta(hours=9))
ROOT = Path(__file__).resolve().parent.parent
MATRIX_PATH = ROOT / "data" / "message_matrix_5div.json"
D1_DB_ID = "5fca0c1f-64cb-4277-85c4-b2ee9944bc06"
HOOK_TYPES = ("loss", "curiosity", "self", "pattern", "proof")
DIVISIONS = ("TOM", "KFG", "GBA", "HERO", "KFK")

BANNED_BY_DIV: Dict[str, Tuple[str, ...]] = {
    "TOM": ("buy signal", "sell signal", "guaranteed return", "SOXL", "TQQQ", "SQQQ", "NVDA", "SCHD", "JEPI", "VOO", "3-Bucket", "lemonsqueezy"),
    "KFG": ("1:1", "clinical", "diagnosis", "diagnose", "prescription", "prescribe", "disease", "disorder", "cure", "bio labs", "brain lq", "no sign-up", "iherb", "amazon", "lemonsqueezy"),
    "GBA": ("買いシグナル", "売りシグナル", "売買タイミング", "Telegram", "t.me", "オルカン", "1489", "VYM", "3つの財布", "クオンツ", "SOXL", "TQQQ", "ATR", "lemonsqueezy"),
    "HERO": ("\ud669\uc601\uc6c5", "\uc784\uc601\uc6c5", "\uc601\ud0c1", "\uc774\ucc2c\uc6d0", "\uae40\ud638\uc911", "\uc7a5\ubbfc\ud638", "\uc815\ub3d9\uc6d0", "\ubc15\uc11c\uc9c4", "유료 결제", "구독료", "골드 VIP", "lemonsqueezy"),
    "KFK": ("1:1", "최저가", "할인율", "특가", "폭탄세일", "쿠팡", "네이버페이", "쇼핑커넥트", "링크프라이스", "lemonsqueezy"),
}


def load_matrix(path: Path = MATRIX_PATH) -> Optional[Dict[str, Any]]:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def select_stage12_ab_cell(matrix_db: Dict[str, Any], div: str, date_str: str, arm_idx: int = 0) -> Optional[Dict[str, Any]]:
    """Selects an active Stage 1-2 cell rotating ONLY `hook_type` (single-variable A/B!)."""
    d_obj = (matrix_db.get("divisions") or {}).get(div.upper())
    if not d_obj:
        return None
    cells = [c for c in (d_obj.get("matrix") or []) if c.get("stage") in (1, 2) and c.get("status", "active") != "paused"]
    if not cells:
        cells = [c for c in (d_obj.get("matrix") or []) if c.get("stage") in (1, 2)]
    if not cells:
        return None

    day_seed = int(hashlib.md5(f"{div.upper()}:{date_str}".encode("utf-8")).hexdigest()[:6], 16)
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


def fetch_d1_metrics(account_id: str, api_token: str) -> Dict[str, Dict[str, int]]:
    if not (account_id and api_token):
        return {}
    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{D1_DB_ID}/query"
    sql = (
        "SELECT COALESCE(utm_content, '') AS uc, event_name, COUNT(*) AS c "
        "FROM funnel_events WHERE created_at >= datetime('now', '-7 days') AND COALESCE(utm_content, '') != '' "
        "GROUP BY uc, event_name;"
    )
    req = urllib.request.Request(
        url,
        data=json.dumps({"sql": sql}).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_token}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            body = json.loads(r.read().decode("utf-8"))
        rows = ((body.get("result") or [{}])[0]).get("results") or []
    except Exception:
        return {}

    agg: Dict[str, Dict[str, int]] = {}
    for row in rows:
        uc = str(row.get("uc") or "").strip()
        ev = str(row.get("event_name") or "").strip()
        cnt = int(row.get("c") or 0)
        if not uc:
            continue
        b = agg.setdefault(uc, {"impressions": 0, "landing_clicks": 0, "quiz_completes": 0, "checkout_clicks": 0})
        if ev == "landing_view":
            b["landing_clicks"] += cnt
        elif ev in ("quiz_complete", "email_signup", "audio_play", "gift_download", "share_click"):
            b["quiz_completes"] += cnt
        elif ev in ("checkout_click", "paid_success"):
            b["checkout_clicks"] += cnt
    return agg


def log_winners_to_d1(account_id: str, api_token: str, run_week: str, winners: List[Dict[str, Any]], paused_losers: List[Dict[str, Any]], summary_line: str) -> None:
    if not (account_id and api_token and winners):
        return
    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{D1_DB_ID}/query"
    for w in winners:
        div = w["division"]
        div_paused = [p["id"] for p in paused_losers if p["division"] == div]
        sql = (
            "INSERT INTO ab_hook_evolution_log "
            "(run_week, division, winner_matrix_id, winner_hook_type, winner_cvr, runner_up_cvr, relative_lift_pct, paused_matrix_ids, added_variants_json, summary_line) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
        )
        payload = {
            "sql": sql,
            "params": [
                run_week,
                div,
                str(w.get("id", "")),
                str(w.get("hook_type", "")),
                float(w.get("conversion_rate", 0.0)),
                0.0,
                float(w.get("relative_lift_pct", 0.0)),
                json.dumps(div_paused, ensure_ascii=False),
                json.dumps(w.get("variants_added") or [], ensure_ascii=False),
                summary_line[:240],
            ],
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Authorization": f"Bearer {api_token}", "Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=15):
                pass
        except Exception:
            pass


def _passes_guardrail(div: str, text: str) -> bool:
    low = text.lower()
    for bad in BANNED_BY_DIV.get(div, ()):
        if bad.lower() in low:
            return False
    if div in ("TOM", "KFG", "GBA") and re.search(r"[\uac00-\ud7a3]", text):
        return False
    return True


def run_weekly_ab_evolution(matrix_path: Path = MATRIX_PATH, metrics: Optional[Dict[str, Dict[str, int]]] = None, save: bool = True) -> Dict[str, Any]:
    db = load_matrix(matrix_path)
    if not db:
        return {"ok": False, "error": "matrix_missing"}

    if metrics is None:
        acct = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
        tok = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
        metrics = fetch_d1_metrics(acct, tok)

    pol = db.get("ab_evolution_policy") or {}
    min_imp = int(pol.get("min_impressions", 300))
    min_clk = int(pol.get("min_landing_clicks", 30))
    min_lift = float(pol.get("min_relative_lift_pct", 20.0)) / 100.0
    mult = float(pol.get("winner_weight_multiplier", 2.0))

    winners: List[Dict[str, Any]] = []
    paused_losers: List[Dict[str, Any]] = []

    for div in DIVISIONS:
        d_obj = (db.get("divisions") or {}).get(div) or {}
        cells = d_obj.get("matrix") or []
        existing_ids = {c["id"] for c in cells}
        eligible: List[Tuple[float, Dict[str, Any]]] = []

        for c in cells:
            m = metrics.get(c["utm_content"]) or metrics.get(c["id"]) or {}
            imp = int(m.get("impressions", 0))
            clk = int(m.get("landing_clicks", 0))
            quiz = int(m.get("quiz_completes", 0))
            chk = int(m.get("checkout_clicks", 0))
            denom = clk if clk > 0 else max(1, imp)
            rate = round(((quiz + chk * 1.5) / float(denom)) * 100.0, 2) if (clk > 0 or imp > 0) else 0.0
            c["stats_7d"] = {"impressions": imp, "landing_clicks": clk, "quiz_completes": quiz, "checkout_clicks": chk, "conversion_rate": rate}
            if c.get("status", "active") == "active" and (imp >= min_imp or clk >= min_clk):
                eligible.append((rate, c))

        if len(eligible) < 2:
            continue
        eligible.sort(key=lambda x: x[0], reverse=True)
        rates = [r for r, _ in eligible]
        baseline = sorted(rates)[len(rates) // 2]
        top_rate, top_cell = eligible[0]
        rel_lift = ((top_rate - baseline) / baseline) if baseline > 0 else (1.0 if top_rate > 0 else 0.0)
        if rel_lift >= min_lift and top_rate > 0:
            top_cell["weight"] = min(4.0, round(float(top_cell.get("weight", 1.0)) * mult, 2))
            prefixes = (
                ["Check tonight: ", "Silent gap: ", "Before next month: "] if div in ("TOM", "KFG")
                else (["見落とし注意：", "意外な統計：", "今夜30秒確認："] if div == "GBA" else ["놓치기 전 확인: ", "숨은 차이는 하나: ", "오늘 저녁 점검: "])
            )
            added = []
            for idx, pref in enumerate(prefixes, start=1):
                vid = f"{top_cell['id']}_W{idx}"
                if vid in existing_ids:
                    continue
                ver = int(top_cell.get("version", 1)) + idx
                nh = f"{pref}{top_cell['hook_line']}"[:125]
                if _passes_guardrail(div, f"{nh} {top_cell['slide_script_body']} {top_cell['cta']}"):
                    cells.append({
                        **top_cell,
                        "id": vid,
                        "hook_line": nh,
                        "utm_content": f"{vid}_v{ver}",
                        "version": ver,
                        "status": "active",
                        "weight": 1.5,
                        "variant_of": top_cell["id"],
                        "stats_7d": {"impressions": 0, "landing_clicks": 0, "quiz_completes": 0, "checkout_clicks": 0, "conversion_rate": 0.0},
                    })
                    existing_ids.add(vid)
                    added.append(vid)
            winners.append({"division": div, "id": top_cell["id"], "hook_type": top_cell["hook_type"], "conversion_rate": top_rate, "relative_lift_pct": round(rel_lift * 100.0, 1), "variants_added": added})
            n_pause = max(1, int(len(eligible) * 0.20))
            for lr, lc in eligible[-n_pause:]:
                if lc["id"] != top_cell["id"] and ((top_rate - lr) / top_rate) >= min_lift:
                    lc["status"] = "paused"
                    paused_losers.append({"division": div, "id": lc["id"], "hook_type": lc["hook_type"], "conversion_rate": lr})

    now_kst = dt.datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST")
    if winners:
        tw = sorted(winners, key=lambda x: x["relative_lift_pct"], reverse=True)[0]
        tl = paused_losers[0] if paused_losers else None
        ltxt = f"{tl['id']}({tl['hook_type']}·{tl['conversion_rate']}% 도태)" if tl else "도태 기준 미달 0건"
        line = f"[이번 주 이긴 후크 TOP 1 vs 도태된 후크] 승자 {tw['id']}({tw['hook_type']}·전환 {tw['conversion_rate']}%·+{tw['relative_lift_pct']}%p, 변형 3종 증식) vs {ltxt}"
        st_lbl = "EVOLVED_WINNERS_CONFIRMED"
    else:
        line = "[이번 주 이긴 후크 TOP 1 vs 도태된 후크] 표본 수집 중 (노출 300회 또는 클릭 30회 + 상대 격차 20% 이상 달성 시 자동 확정)"
        st_lbl = "COLLECTING_SAMPLE"

    db["total_cells"] = sum(len(d.get("matrix") or []) for d in (db.get("divisions") or {}).values())
    db["updated_at_kst"] = now_kst
    db["weekly_evolution_summary"] = {
        "last_evaluated_at_kst": now_kst,
        "status": st_lbl,
        "monday_report_line": line,
        "winners": winners,
        "paused_losers": paused_losers,
    }
    if save:
        matrix_path.write_text(json.dumps(db, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        acct = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
        tok = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
        if winners and acct and tok:
            log_winners_to_d1(acct, tok, dt.datetime.now(KST).strftime("%Y-%m-%d"), winners, paused_losers, line)
    return db["weekly_evolution_summary"]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    res = run_weekly_ab_evolution(save=(not args.dry_run))
    print(json.dumps(res, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
