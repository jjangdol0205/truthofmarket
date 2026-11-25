#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Unit tests for Standing Directive #29 (`ab_evolution_engine.py`):
  1. Phase 1 (`shadow_14d` Day 1..14): STRICT 0-diff zero-mutation lock on `message_matrix_5div.json`
  2. Phase 2 (`active_evolve` Day 15+ `2026-12-09`):
     - Per-division independent sample gate (`videos>=10 & views>=500` OR `go_clicks>=20`)
     - 70% Exploit : 30% Explore balance (winner weight cap <= 2.5x, explore weight floor >= 0.75)
     - Bottom 20% loser pause ONLY when relative gap >= 20%
     - Zero mechanical prefixes (`Check tonight:`, `놓치기 전 확인:`)
     - Fail-Closed `promo_hard_gate.py` blocking of AI clichés / Polar/Whop banned terms
  3. Division-tailored reward functions (TOM/KFG/GBA/KFK vs HERO)
"""

from __future__ import annotations

import copy
import datetime as dt
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ab_evolution_engine as abe  # noqa: E402


def _make_sample_items(div: str, n_win: int, win_views: int, n_lose: int, lose_views: int) -> list:
    items = []
    for i in range(n_win):
        items.append({
            "div_code": div,
            "platform": "youtube_shorts",
            "content_id": f"{div}_w_{i}",
            "title": f"{div} proof video {i}",
            "hook_type": "proof",
            "matrix_id": f"{div}_S1_PROOF",
            "published_at": "2026-12-05T10:00:00Z",
            "views": win_views,
            "views_per_day": float(win_views) / 3.0,
            "likes": max(1, win_views // 15),
            "comments": max(1, win_views // 40),
            "saves": 3,
            "shares": 2,
            "go_clicks_7d": 5,
            "site_conversions_7d": 2,
        })
    for i in range(n_lose):
        items.append({
            "div_code": div,
            "platform": "youtube_shorts",
            "content_id": f"{div}_l_{i}",
            "title": f"{div} loss video {i}",
            "hook_type": "loss",
            "matrix_id": f"{div}_S1_LOSS",
            "published_at": "2026-12-05T10:00:00Z",
            "views": lose_views,
            "views_per_day": float(lose_views) / 5.0,
            "likes": 0,
            "comments": 0,
            "saves": 0,
            "shares": 0,
            "go_clicks_7d": 0,
            "site_conversions_7d": 0,
        })
    return items


def run_all_tests() -> None:
    base_db = abe.load_matrix()
    assert base_db is not None, "message_matrix_5div.json must exist"

    with tempfile.TemporaryDirectory(prefix="dc_ab_test_") as tmp:
        tdir = Path(tmp)

        # ------------------------------------------------------------------
        # TEST 1: Phase 1 (`shadow_14d`) Day 1 & Day 14 -> ZERO MATRIX DIFF!
        # ------------------------------------------------------------------
        m1 = tdir / "matrix_p1.json"
        orig_raw = json.dumps(base_db, ensure_ascii=False, indent=2) + "\n"
        m1.write_text(orig_raw, encoding="utf-8")

        heavy_items = _make_sample_items("TOM", 8, 250, 6, 8)
        heavy_go = {d: {"total_clicks": 40 if d == "TOM" else 0, "slugs": {"yt": 40 if d == "TOM" else 0}} for d in abe.DIVISIONS}
        heavy_fun = {d: {"landing_view": 30, "quiz_complete": 10, "email_signup": 5, "checkout_click": 2, "paid_success": 1, "story_submit": 0, "share_click": 0, "gift_download": 0, "total_conversions": 18} for d in abe.DIVISIONS}

        for test_date, expected_day in [(dt.date(2026, 11, 25), 1), (dt.date(2026, 12, 8), 14)]:
            res1 = abe.run_promo_learning_cycle(
                matrix_path=m1,
                snapshot_path=tdir / f"snap_{expected_day}.json",
                eval_date=test_date,
                dry_run=True,  # also verify dry_run=False without D1 ingest below
                injected_items=copy.deepcopy(heavy_items),
                injected_go=heavy_go,
                injected_funnel=heavy_fun,
            )
            assert res1["phase"] == "shadow_14d", f"Expected shadow_14d on {test_date}, got {res1['phase']}"
            assert res1["shadow_day"] == expected_day, f"Expected day {expected_day}, got {res1['shadow_day']}"
            assert res1["matrix_mutated"] is False, "Phase 1 must NEVER mutate matrix"
            assert m1.read_text(encoding="utf-8") == orig_raw, "Matrix bytes changed during Phase 1!"

        # Also test non-dry-run Phase 1 (disabling D1 network via empty token): matrix MUST remain byte-identical!
        orig_ingest = abe.ingest_to_central_d1
        abe.ingest_to_central_d1 = lambda payload, env: {"ok": True, "mocked": True}
        try:
            res1_live = abe.run_promo_learning_cycle(
                matrix_path=m1,
                snapshot_path=tdir / "snap_live_p1.json",
                eval_date=dt.date(2026, 12, 8),
                dry_run=False,
                injected_items=copy.deepcopy(heavy_items),
                injected_go=heavy_go,
                injected_funnel=heavy_fun,
            )
            assert res1_live["phase"] == "shadow_14d"
            assert res1_live["matrix_mutated"] is False
            assert m1.read_text(encoding="utf-8") == orig_raw, "Phase 1 non-dry-run touched message_matrix_5div.json!"
            assert (tdir / "snap_live_p1.json").exists(), "Snapshot file must be written in Phase 1"

            # ------------------------------------------------------------------
            # TEST 2: Phase 2 (`active_evolve` 2026-12-09)
            #   - TOM passes sample gate -> promotes proof (<=2.5x), pauses bottom loss, blocks poisoned Hard Gate cell!
            #   - KFG fails sample gate -> 0 changes!
            # ------------------------------------------------------------------
            db2 = copy.deepcopy(base_db)
            # Poison ONE TOM proof cell to verify Fail-Closed Hard Gate blocks its promotion!
            tom_cells = db2["divisions"]["TOM"]["matrix"]
            poisoned_id = ""
            for c in tom_cells:
                if c.get("stage") in (1, 2) and c.get("hook_type") == "proof":
                    c["hook_line"] = "Delve into this game-changer ETF buy signal today!"
                    poisoned_id = c["id"]
                    break
            assert poisoned_id, "Must find a TOM proof cell to poison for Hard Gate test"

            m2 = tdir / "matrix_p2.json"
            m2.write_text(json.dumps(db2, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

            p2_items = _make_sample_items("TOM", 7, 180, 5, 5) + _make_sample_items("KFG", 2, 20, 1, 5)
            p2_go = {d: {"total_clicks": 25 if d == "TOM" else 3, "slugs": {"yt": 25 if d == "TOM" else 3}} for d in abe.DIVISIONS}
            res2 = abe.run_promo_learning_cycle(
                matrix_path=m2,
                snapshot_path=tdir / "snap_p2.json",
                eval_date=dt.date(2026, 12, 9),
                dry_run=False,
                injected_items=p2_items,
                injected_go=p2_go,
                injected_funnel=heavy_fun,
            )
            assert res2["phase"] == "active_evolve", f"Expected active_evolve on 2026-12-09, got {res2['phase']}"
            assert res2["shadow_day"] == 15
            assert res2["matrix_mutated"] is True

            runs_by_div = {r["div_code"]: r for r in res2["runs"]}
            assert runs_by_div["TOM"]["gate_passed"] is True
            assert runs_by_div["KFG"]["gate_passed"] is False

            # Check Hard Gate blocked poisoned cell while promoting clean proof cell
            act_tom = next(a for a in res2["evolution_actions"] if a["div_code"] == "TOM")
            assert any(poisoned_id in b for b in act_tom["blocked_by_hard_gate"]), f"Hard Gate failed to block {poisoned_id}: {act_tom}"
            assert len(act_tom["promoted_ids"]) >= 1, "Clean TOM proof cell must be promoted"
            assert len(act_tom["paused_ids"]) >= 1, "Bottom TOM loss cell must be paused when gap >= 20%"

            updated_db2 = json.loads(m2.read_text(encoding="utf-8"))
            # Verify NO mechanical prefixes injected anywhere & weights respect [0.75, 2.5]
            for c in updated_db2["divisions"]["TOM"]["matrix"]:
                assert not c["hook_line"].startswith(("Check tonight:", "Silent gap:", "놓치기 전 확인:")), f"Mechanical prefix leaked: {c['hook_line']}"
                if c["id"] == poisoned_id:
                    assert float(c["weight"]) == 1.0, "Poisoned cell weight must NOT be promoted!"
                if c.get("stage") in (1, 2) and c.get("status") == "active":
                    assert 0.75 <= float(c["weight"]) <= 2.5, f"Weight out of 70:30 guardrail bounds: {c['id']}={c['weight']}"

            # Verify KFG (failed sample gate) was untouched
            assert updated_db2["divisions"]["KFG"]["matrix"] == db2["divisions"]["KFG"]["matrix"], "KFG failed gate and must remain untouched!"

            # Verify 70:30 Explore/Exploit selector distribution across 100 synthetic dates
            picks = [abe.select_stage12_ab_cell(updated_db2, "TOM", f"2026-12-{10 + (i % 20):02d}", arm_idx=i)["hook_type"] for i in range(100)]
            proof_ratio = picks.count("proof") / 100.0
            non_proof_types = set(picks) - {"proof"}
            assert 0.55 <= proof_ratio <= 0.88, f"Expected ~70% exploit ratio on proof, got {proof_ratio}"
            assert len(non_proof_types) >= 2, f"Expected exploration diversity across non-winner hooks, got {non_proof_types}"

            # Verify HERO tailored reward weights respond to comments/story + card clicks
            h_low = abe.compute_item_reward_score(
                "HERO",
                {"views": 200, "views_per_day": 50, "likes": 10, "comments": 0, "go_clicks_7d": 0},
                {"total_clicks": 0, "slugs": {}},
                {"story_submit": 0, "gift_download": 0, "share_click": 0},
            )
            h_high = abe.compute_item_reward_score(
                "HERO",
                {"views": 200, "views_per_day": 50, "likes": 10, "comments": 8, "go_clicks_7d": 5},
                {"total_clicks": 5, "slugs": {"yt-card": 4, "yt-radio": 3}},
                {"story_submit": 3, "gift_download": 6, "share_click": 4},
            )
            assert h_high > h_low + 20.0, f"HERO custom reward function must strongly reward comments/stories/cards ({h_low} vs {h_high})"
        finally:
            abe.ingest_to_central_d1 = orig_ingest

    print("ALL 2-PHASE AB EVOLUTION UNIT TESTS PASSED (Phase 1 0-diff lock, Phase 2 sample gate + 70:30 + Hard Gate block + HERO reward)!")


if __name__ == "__main__":
    run_all_tests()
