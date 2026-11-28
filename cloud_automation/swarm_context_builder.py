#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/swarm_context_builder.py
================================================================================
Dream Company — Full-Scale 5-Division Promo Swarm Evidence Packet Builder (`$0`)

Aggregates 100% primary-source operational data into a compact, zero-token-bomb
evidence packet (`data/swarm_weekly_brief.json` + `data/swarm_weekly_brief.md`)
consumed by the 7 read-only `/swarm` workers (Data Analyst, Div 1~5 Strategists,
and Red-Team Compliance Auditor):
  1. Live/Snapshot Cloudflare D1 AARRR (`data/hq_aarrr_growth_snapshot.json`)
     — strictly excluding internal owner traffic (`excluded_internal_summary`)
  2. 14-day Multi-Platform Promo Views & `shadow_14d` Phase (`data/promo_learning_snapshot.json`)
  3. 48h+ Matured Anti-Goodhart Winners/Losers (`data/topic_hook_weights.json`)
  4. Compact Stage 1-2 Hook Matrix Summary (`data/message_matrix_5div.json`)
  5. Landing Page StoryBrand USP & Direct CTAs (`data/landing_storybrand_handoff_5div.json`)
     for Message-Match Gap detection (Cliff #2: UV -> Quiz/Signup)
  6. Active Swarm Overlay & Pending Telegram Approvals (`data/swarm_promo_experiments.json`,
     `data/swarm_approval_proposals.json`)

Strictly READ-ONLY on all operational sources; writes ONLY to `data/swarm_weekly_brief.{json,md}`.
Zero external paid LLM API calls (`EXTERNAL_PAID_API_ENABLED = False`).
================================================================================
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

EXTERNAL_PAID_API_ENABLED = False
KST = dt.timezone(dt.timedelta(hours=9))
ROOT = Path(__file__).resolve().parent.parent
HQ_ROOT = ROOT.parent if (ROOT.name == "1사업부" and (ROOT.parent / "data").exists()) else ROOT

DIVISIONS: Tuple[str, ...] = ("TOM", "KFG", "GBA", "HERO", "KFK")
DIV_META: Dict[str, Dict[str, str]] = {
    "TOM": {
        "div_num": "1사업부",
        "name": "TruthOfMarket (US Retirement)",
        "lang": "en",
        "domain": "https://truthofmarket.com",
        "pg_model": "Whop ($0 -> $9 -> $29/mo -> $199/yr)",
        "handles": "YT @TruthOfMarketUS / IG @truthofmarket",
    },
    "KFG": {
        "div_num": "2사업부",
        "name": "KISFIT Global (EN Pediatric Growth)",
        "lang": "en",
        "domain": "https://kisfitglobal.com",
        "pg_model": "Polar.sh ($0 -> $8.99 -> $19.99 -> $49)",
        "handles": "YT @kisfitglobal / IG @kisfitglobal",
    },
    "GBA": {
        "div_num": "3사업부",
        "name": "GetBreakAI Japan (JP Shin-NISA)",
        "lang": "ja",
        "domain": "https://getbreakai.com/jp/",
        "pg_model": "Whop (¥0 -> ¥1,480 -> ¥4,400/mo -> ¥29,800/yr)",
        "handles": "YT @GetBreakAI / IG @getbreakai",
    },
    "HERO": {
        "div_num": "4사업부",
        "name": "Paradise Hero (Baek Woon-ho IP)",
        "lang": "ko",
        "domain": "https://paradise-hero.com",
        "pg_model": "Affiliate (Naver cshop/Coupang 7 items) + B2B Sponsorship (Overseas PG 0)",
        "handles": "YT @김쌤의영웅라디오 / IG @paradise_hero1",
    },
    "KFK": {
        "div_num": "5사업부",
        "name": "KidsFit Korea (KO Pediatric Growth)",
        "lang": "ko",
        "domain": "https://kidsfit.co.kr",
        "pg_model": "Latpeed Pure Paid (0 -> 9,900 -> 19,900 -> 39,000 KRW; Affiliates 0)",
        "handles": "YT @kidsfit01 / IG @kids_fit1",
    },
}

AARRR_API_URL = "https://api.truthofmarket.com/api/admin/aarrr-summary"


def _load_env_map() -> Dict[str, str]:
    merged: Dict[str, str] = {}
    for cand in (HQ_ROOT / ".env", ROOT / ".env"):
        if cand.exists():
            try:
                for raw in cand.read_text(encoding="utf-8", errors="ignore").splitlines():
                    s = raw.strip()
                    if not s or s.startswith("#") or "=" not in s:
                        continue
                    k, v = s.split("=", 1)
                    val = v.strip().strip('"').strip("'")
                    if val:
                        merged.setdefault(k.strip(), val)
            except Exception:
                pass
    for k, v in os.environ.items():
        if v is not None and str(v).strip():
            merged[k] = str(v).strip()
    return merged


def _read_json_candidates(filename: str) -> Tuple[Optional[Path], Dict[str, Any]]:
    for base in (HQ_ROOT / "data", ROOT / "data"):
        p = base / filename
        if p.exists():
            try:
                data = json.loads(p.read_text(encoding="utf-8"))
                if isinstance(data, dict):
                    return p, data
            except Exception:
                pass
    return None, {}


def _try_fetch_live_aarrr(days: int = 30) -> Optional[Dict[str, Any]]:
    env = _load_env_map()
    tok = env.get("WATCHDOG_ADMIN_TOKEN", "").strip()
    if not tok:
        return None
    try:
        req = urllib.request.Request(
            f"{AARRR_API_URL}?days={int(days)}",
            headers={
                "Authorization": f"Bearer {tok}",
                "Accept": "application/json",
                "User-Agent": "DreamCompany-SwarmContextBuilder/1.0",
            },
            method="GET",
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = json.loads(resp.read().decode("utf-8"))
        if isinstance(body, dict) and body.get("ok"):
            return body
    except Exception:
        pass
    return None


def _safe_pct(num: float, den: float) -> float:
    if den <= 0:
        return 0.0
    return round((num / den) * 100.0, 2)


def build_swarm_brief(refresh_live_aarrr: bool = False, days: int = 30) -> Dict[str, Any]:
    now_kst = dt.datetime.now(KST)

    aarrr_path, aarrr_snap = _read_json_candidates("hq_aarrr_growth_snapshot.json")
    live_d1 = _try_fetch_live_aarrr(days=days) if refresh_live_aarrr else None
    aarrr_source = "live_d1_api" if live_d1 else "local_snapshot"
    aarrr_live = live_d1 if live_d1 else (aarrr_snap.get("live_d1_aarrr") or {})

    learn_path, learn_snap = _read_json_candidates("promo_learning_snapshot.json")
    weights_path, weights_db = _read_json_candidates("topic_hook_weights.json")
    matrix_path, matrix_db = _read_json_candidates("message_matrix_5div.json")
    handoff_path, handoff_db = _read_json_candidates("landing_storybrand_handoff_5div.json")
    overlay_path, overlay_db = _read_json_candidates("swarm_promo_experiments.json")
    proposals_path, proposals_db = _read_json_candidates("swarm_approval_proposals.json")

    runs_by_div = {
        str(r.get("div_code") or "").upper(): r
        for r in (learn_snap.get("runs") or [])
        if isinstance(r, dict)
    }
    ab_tracks = aarrr_live.get("ab_track_summary") or {}
    slot_a_by_div = (ab_tracks.get("slot_a_realui") or {}).get("by_div") or {}
    slot_b_by_div = (ab_tracks.get("slot_b_flowchar") or {}).get("by_div") or {}

    divisions_summary: Dict[str, Any] = {}
    cross_div_winners: List[Dict[str, Any]] = []

    for div in DIVISIONS:
        meta = DIV_META[div]
        a_div = (aarrr_live.get("divisions") or {}).get(div) or {}
        acq = a_div.get("acquisition") or {}
        act = a_div.get("activation") or {}
        ret = a_div.get("retention") or {}
        ref = a_div.get("referral") or {}
        rev = a_div.get("revenue") or {}
        diag = a_div.get("diagnosis") or {}

        l_run = runs_by_div.get(div) or {}
        w_div = (weights_db.get("divisions") or {}).get(div) or {}
        m_div = (matrix_db.get("divisions") or {}).get(div) or {}
        h_div = (handoff_db.get("divisions") or {}).get(div) or {}
        ov_div = (overlay_db.get("divisions") or {}).get(div) or {}

        views_14d = int(l_run.get("sample_views") or 0)
        items_14d = int(l_run.get("sample_videos") or 0)
        uv_30d = int(acq.get("unique_visitors") or 0)
        pv_30d = int(acq.get("total_pageviews") or 0)
        go_slot_a = int((slot_a_by_div.get(div) or {}).get("go_clicks") or 0)
        go_slot_b = int((slot_b_by_div.get(div) or {}).get("go_clicks") or 0)
        go_total = max(int(w_div.get("go_clicks_14d") or 0), go_slot_a + go_slot_b)

        quiz_starts = int(act.get("quiz_starts") or 0)
        quiz_completes = int(act.get("quiz_completes") or 0)
        activated = int(act.get("activated_users") or 0)
        signups = int(act.get("signups_window") or 0)
        checkout_clicks = int(rev.get("checkout_clicks") or 0)
        affiliate_clicks = int(rev.get("affiliate_clicks") or 0)
        paid_active = int(rev.get("paid_buyers_active") or 0)

        top_winners = [
            {
                "platform": w.get("platform"),
                "title": str(w.get("title") or "")[:90],
                "topic_key": w.get("topic_key"),
                "hook_type": w.get("hook_type"),
                "views": int(w.get("views") or 0),
                "composite_score": float(w.get("composite_score") or 0.0),
            }
            for w in (w_div.get("top_20_winners") or [])[:3]
        ]
        if top_winners:
            cross_div_winners.append({"div": div, **top_winners[0]})

        bottom_losers = [
            {
                "platform": lo.get("platform"),
                "title": str(lo.get("title") or "")[:80],
                "hook_type": lo.get("hook_type"),
                "views": int(lo.get("views") or 0),
                "composite_score": float(lo.get("composite_score") or 0.0),
            }
            for lo in (w_div.get("bottom_30_losers") or [])[:3]
        ]

        stage12_samples = [
            {
                "id": c.get("id"),
                "hook_type": c.get("hook_type"),
                "hook_line": str(c.get("hook_line") or "")[:100],
                "cta": str(c.get("cta") or "")[:90],
                "weight": float(c.get("weight") or 1.0),
            }
            for c in (m_div.get("matrix") or [])
            if c.get("stage") in (1, 2) and c.get("status", "active") != "paused"
        ][:5]

        sb = h_div.get("storybrand_7parts") or {}
        active_exps = [
            {
                "exp_id": e.get("exp_id"),
                "hook_type": e.get("hook_type"),
                "hook_line": str(e.get("hook_line") or "")[:90],
                "taste_score": e.get("taste_score"),
                "expires_at": e.get("expires_at"),
                "status": e.get("status"),
            }
            for e in (ov_div.get("experiments") or [])
            if e.get("status") == "active"
        ]

        cliff1_ctr_pct = _safe_pct(go_total, views_14d)
        cliff2_act_pct = _safe_pct(activated + signups + quiz_starts, uv_30d)

        divisions_summary[div] = {
            "meta": meta,
            "funnel_metrics": {
                "views_14d": views_14d,
                "shortform_items_14d": items_14d,
                "matured_48h_count": int(w_div.get("matured_48h_count") or 0),
                "immature_held_under_48h": int(w_div.get("immature_held_under_48h") or 0),
                "go_clicks_total": go_total,
                "go_clicks_slot_a": go_slot_a,
                "go_clicks_slot_b": go_slot_b,
                "external_uv_30d": uv_30d,
                "external_pv_30d": pv_30d,
                "top_sources": acq.get("top_sources") or [],
                "quiz_starts": quiz_starts,
                "quiz_completes": quiz_completes,
                "activated_users": activated,
                "signups_window": signups,
                "d7_retained_any": int(ret.get("d7_retained_any") or 0),
                "share_clicks": int(ref.get("share_clicks") or 0),
                "checkout_clicks": checkout_clicks,
                "affiliate_clicks": affiliate_clicks,
                "paid_buyers_active": paid_active,
                "cliff1_views_to_go_pct": cliff1_ctr_pct,
                "cliff2_uv_to_activation_pct": cliff2_act_pct,
            },
            "diagnosis": {
                "weakest_stage": diag.get("weakest_stage") or "unknown",
                "weakest_label": diag.get("weakest_label") or "-",
                "learning_winner_hook": l_run.get("winner_summary") or "-",
                "learning_loser_hook": l_run.get("loser_summary") or "-",
                "current_hook_weights": w_div.get("hook_weights") or {},
            },
            "top_20_winners": top_winners,
            "bottom_30_losers": bottom_losers,
            "baseline_stage12_samples": stage12_samples,
            "landing_message_match": {
                "usp_one_sentence": str(h_div.get("usp_one_sentence") or "")[:220],
                "direct_cta": str(sb.get("direct_cta") or ""),
                "transitional_cta": str(sb.get("transitional_cta") or ""),
                "reassurance_stage5": str(h_div.get("reassurance_stage5") or "")[:200],
            },
            "active_swarm_experiments": active_exps,
            "active_swarm_weight_deltas": ov_div.get("hook_weight_deltas") or {},
        }

    pending_proposals = [
        {
            "proposal_id": p.get("proposal_id"),
            "division": p.get("division"),
            "target_room": p.get("target_room"),
            "category": p.get("category"),
            "status": p.get("status"),
            "created_at_kst": p.get("created_at_kst"),
        }
        for p in (proposals_db.get("proposals") or [])
        if p.get("status") == "PENDING_CHAIRMAN_APPROVAL"
    ]

    brief: Dict[str, Any] = {
        "schema_version": "swarm-weekly-brief-v1",
        "generated_at_kst": now_kst.strftime("%Y-%m-%d %H:%M:%S KST"),
        "aarrr_source": aarrr_source,
        "source_timestamps": {
            "aarrr_snapshot_kst": aarrr_snap.get("updated_at_kst", ""),
            "promo_learning_kst": learn_snap.get("generated_at_kst", ""),
            "topic_weights_kst": weights_db.get("generated_at_kst", ""),
            "overlay_kst": overlay_db.get("updated_at_kst", ""),
        },
        "source_files": {
            "aarrr": str(aarrr_path) if aarrr_path else "",
            "promo_learning": str(learn_path) if learn_path else "",
            "topic_weights": str(weights_path) if weights_path else "",
            "message_matrix": str(matrix_path) if matrix_path else "",
            "landing_handoff": str(handoff_path) if handoff_path else "",
            "swarm_overlay": str(overlay_path) if overlay_path else "",
            "approval_proposals": str(proposals_path) if proposals_path else "",
        },
        "global_guardrails": {
            "shadow_phase": learn_snap.get("phase", "shadow_14d"),
            "shadow_day": learn_snap.get("shadow_day", 0),
            "active_unlock_date": learn_snap.get("active_unlock_date", "2026-12-09"),
            "baseline_matrix_immutable": True,
            "max_active_experiments_per_div": 2,
            "max_traffic_allocation_ratio": 0.20,
            "max_hook_weight_delta": 0.25,
            "min_taste_score": 85,
            "external_paid_api_cost_usd": 0,
            "frozen_out_of_scope_channels": [
                "div5_naver_blog",
                "div5_naver_clip",
                "manual_kin",
                "paid_x_api",
                "threads_api",
                "facebook_api",
            ],
        },
        "global_totals": {
            "views_14d": int((learn_snap.get("totals") or {}).get("views") or 0),
            "items_14d": int((learn_snap.get("totals") or {}).get("items") or 0),
            "external_uv_30d": int((aarrr_live.get("totals") or {}).get("unique_visitors") or 0),
            "external_pv_30d": int((aarrr_live.get("totals") or {}).get("total_pageviews") or 0),
            "activated_users_30d": int((aarrr_live.get("totals") or {}).get("activated_users") or 0),
            "signups_30d": int((aarrr_live.get("totals") or {}).get("signups") or 0),
            "checkout_clicks_30d": int((aarrr_live.get("totals") or {}).get("checkout_clicks") or 0),
            "affiliate_clicks_30d": int((aarrr_live.get("totals") or {}).get("affiliate_clicks") or 0),
            "paid_active_30d": int((aarrr_live.get("totals") or {}).get("paid_active") or 0),
            "excluded_internal_total": int((aarrr_live.get("excluded_internal_summary") or {}).get("excluded_total") or 0),
            "ab_track_slot_a_go_clicks": int((ab_tracks.get("slot_a_realui") or {}).get("go_clicks") or 0),
            "ab_track_slot_b_go_clicks": int((ab_tracks.get("slot_b_flowchar") or {}).get("go_clicks") or 0),
        },
        "cross_division_top_winners": sorted(cross_div_winners, key=lambda x: x.get("views", 0), reverse=True),
        "pending_chairman_approvals": pending_proposals,
        "divisions": divisions_summary,
    }
    return brief


def format_swarm_brief_markdown(brief: Dict[str, Any]) -> str:
    gt = brief["global_totals"]
    gg = brief["global_guardrails"]
    lines = [
        f"# 5개 사업부 풀 스케일 홍보 Swarm 실데이터 브리핑 ({brief['generated_at_kst']})",
        "",
        f"- **Phase / 가드레일**: `{gg['shadow_phase']}` (Day {gg['shadow_day']}, 해금 `{gg['active_unlock_date']}`) | 기준선 80% 불변 | 실험 ≤2건/사업부 · ≤20% Explore · 가중치 Δ ≤±0.25 · Taste ≥85점 · 비용 `$0`",
        f"- **전사 합계**: 14일 조회수 **{gt['views_14d']:,}회** (`{gt['items_14d']}건`) | 30일 순수 외부 UV **{gt['external_uv_30d']}명** (내부 `{gt['excluded_internal_total']:,}건` 제외) | `/go/` 클릭 `SLOT_A {gt['ab_track_slot_a_go_clicks']}` / `SLOT_B {gt['ab_track_slot_b_go_clicks']}` | 활성 **{gt['activated_users_30d']}** · 가입 **{gt['signups_30d']}** · 결제클릭 **{gt['checkout_clicks_30d']}** · 결제 **{gt['paid_active_30d']}**",
        "",
        "## 1. 사업부별 2단 절벽 진단표 (1차 절벽: 조회수→/go/ | 2차 절벽: UV→활성/결제)",
        "",
        "| 사업부 | 14일 조회수 | `/go/` 클릭 (1차 전환율) | 30일 외부 UV | 퀴즈·가입 / 결제클릭 (2차 전환율) | 현행 승자 후크 | 활성 Swarm 실험 |",
        "| :--- | :---: | :---: | :---: | :---: | :--- | :---: |",
    ]

    for div in DIVISIONS:
        d = brief["divisions"][div]
        fm = d["funnel_metrics"]
        diag = d["diagnosis"]
        div_label = f"{d['meta']['div_num']} {div}"
        act_cnt = fm["quiz_starts"] + fm["activated_users"] + fm["signups_window"]
        rev_cnt = fm["affiliate_clicks"] if div == "HERO" else fm["checkout_clicks"]
        lines.append(
            f"| **{div_label}** | {fm['views_14d']:,} ({fm['shortform_items_14d']}건) | "
            f"{fm['go_clicks_total']}건 ({fm['cliff1_views_to_go_pct']}%) | "
            f"{fm['external_uv_30d']}명 | "
            f"{act_cnt} / {rev_cnt} ({fm['cliff2_uv_to_activation_pct']}%) | "
            f"{diag['learning_winner_hook']} | {len(d['active_swarm_experiments'])}/2 |"
        )

    lines.extend(["", "## 2. 타 사업부 교차 학습용 Top 승자 소재 (48h+ 숙성 실측)", ""])
    for w in brief.get("cross_division_top_winners") or []:
        lines.append(
            f"- **[{w['div']}]** `{w['views']:,}회` (score `{w['composite_score']}`, `{w['hook_type']}` / `{w['platform']}`): {w['title']}"
        )

    lines.extend(["", "## 3. 사업부별 랜딩 메시지 매치 기준 (2차 절벽 점검용)", ""])
    for div in DIVISIONS:
        d = brief["divisions"][div]
        lm = d["landing_message_match"]
        lines.append(
            f"- **[{div}]** PG: `{d['meta']['pg_model']}` | Direct CTA: `{lm['direct_cta']}` | USP: {lm['usp_one_sentence']}"
        )

    if brief.get("pending_chairman_approvals"):
        lines.extend(["", "## 4. 현재 회장님 텔레그램 결재 대기 목록", ""])
        for p in brief["pending_chairman_approvals"]:
            lines.append(
                f"- `{p['proposal_id']}` [{p['division']} → `{p['target_room']}`] {p['category']} (`{p['created_at_kst']}`)"
            )

    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Dream Company Promo Swarm Context Packet Builder ($0)")
    parser.add_argument("--refresh-live", action="store_true", help="Fetch live Cloudflare D1 AARRR before building brief")
    parser.add_argument("--days", type=int, default=30, help="AARRR window days (default: 30)")
    parser.add_argument("--out-json", type=str, default="", help="Override output JSON path")
    parser.add_argument("--out-md", type=str, default="", help="Override output Markdown path")
    parser.add_argument("--print-md", action="store_true", help="Print Markdown summary to stdout")
    args = parser.parse_args()

    brief = build_swarm_brief(refresh_live_aarrr=args.refresh_live, days=args.days)
    md = format_swarm_brief_markdown(brief)

    out_json = Path(args.out_json) if args.out_json else (HQ_ROOT / "data" / "swarm_weekly_brief.json")
    out_md = Path(args.out_md) if args.out_md else (HQ_ROOT / "data" / "swarm_weekly_brief.md")
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_md.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(brief, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    out_md.write_text(md, encoding="utf-8")

    print(
        f"SWARM_CONTEXT_BRIEF_READY: json={out_json} md={out_md} "
        f"| views_14d={brief['global_totals']['views_14d']} uv_30d={brief['global_totals']['external_uv_30d']} "
        f"aarrr_source={brief['aarrr_source']}",
        flush=True,
    )
    if args.print_md:
        print("\n" + md, flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
