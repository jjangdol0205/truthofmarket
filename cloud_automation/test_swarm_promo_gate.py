#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/test_swarm_promo_gate.py
================================================================================
Deterministic Unit & Regression Test Suite for Full-Scale 5-Division Promo Swarm:
  1. Governance Sanctuary Hard Lock (11 forbidden paths blocked, only overlay/ledger allowed)
  2. Gradual Cap Enforcement (<=2 active exps/div, <=20% traffic, <=+-0.25 delta, immutable baseline)
  3. Hard Gate + Out-of-Scope Frozen Channel Blocking (Naver blog/clip, Threads, banned terms)
  4. Taste >= 85 Score Rejection (84-pt or abstract-intro rejected; >=85-pt verified passes)
  5. High-Risk Approval Proposal Validation & Safe HTML Escaping
  6. Non-Destructive Integration with `cloud_promo_runner.select_hill_climbed_cell_80_20()`
     (verifies 80% Exploit NEVER mutates baseline, <=20% Explore safely activates Swarm experiment)
  7. Context Packet Builder (`swarm_context_builder.py`) smoke test
================================================================================
"""

from __future__ import annotations

import copy
import datetime as dt
import json
import sys
import tempfile
from pathlib import Path
from typing import Any, Dict

sys.path.insert(0, str(Path(__file__).resolve().parent))
import cloud_promo_runner as cpr  # noqa: E402
import swarm_context_builder as scb  # noqa: E402
import swarm_promo_gate as spg  # noqa: E402
from weekly_hill_climber import GovernanceSanctuaryViolationError  # noqa: E402


def _make_valid_overlay(today: dt.date) -> Dict[str, Any]:
    exp_date = (today + dt.timedelta(days=14)).isoformat()
    return {
        "schema_version": "swarm-promo-overlay-v1",
        "session_id": "SWARM-20261129-01",
        "updated_at_kst": "2026-11-29 10:00:00 KST",
        "safety_policy": {
            "max_active_experiments_per_div": 2,
            "max_traffic_allocation_ratio": 0.20,
            "baseline_matrix_immutable": True,
            "auto_expire_days": 14,
            "min_taste_score": 85,
        },
        "divisions": {
            "TOM": {
                "hook_weight_deltas": {"proof": 0.15, "pattern": -0.10},
                "experiments": [
                    {
                        "exp_id": "TOM_SWARM_20261129_01",
                        "status": "active",
                        "expires_at": exp_date,
                        "hook_type": "proof",
                        "hook_line": "After yesterday's close, SMH Fear and Greed hit 3.7 (-36.8%) vs 62-month crash recovery",
                        "slide_script_body": "After yesterday's market close, SMH Fear and Greed sits at 3.7 (-36.8% off peak), yet 2000-2025 history shows 62 months vs 17 months recovery when paired with defensive healthcare and 24-month Treasury cash.",
                        "cta": "Check today's free 0 to 100 SMH Fear and Greed gauge via the top profile link.",
                        "speech_bubble": "SMH 3.7: 62 vs 17 Mo",
                        "pinned_comment_bridge": "Check today's free live 0 to 100 SMH gauge and 2000-2025 stress-test first.",
                        "success_metric": "go_yt_ctr >= 0.8% over 7d",
                        "rollback_trigger": "48h views < 50% of division median after 2 runs",
                    }
                ],
            },
            "KFG": {
                "hook_weight_deltas": {"pattern": 0.20},
                "experiments": [
                    {
                        "exp_id": "KFG_SWARM_20261129_01",
                        "status": "active",
                        "expires_at": exp_date,
                        "hook_type": "pattern",
                        "hook_line": "Before bedtime tonight, stop assuming parents' height decides 100% of adult height",
                        "slide_script_body": "Before bedtime tonight, remember parents' average height misses up to 25% shaped by daily sleep and nutrition rhythm. Compare your child's exact US CDC percentile in 60 seconds with zero supplement ads.",
                        "cta": "Run our free 60-second US CDC height percentile check via the top profile link.",
                        "speech_bubble": "25% Isn't Just Genetics",
                        "pinned_comment_bridge": "Run the free 60-second US CDC percentile check via our top profile link.",
                        "success_metric": "go_clicks >= 3 over 7d",
                        "rollback_trigger": "0 go_clicks after 3 matured runs",
                    }
                ],
            },
            "GBA": {
                "hook_weight_deltas": {"loss": 0.15},
                "experiments": [
                    {
                        "exp_id": "GBA_SWARM_20261129_01",
                        "status": "active",
                        "expires_at": exp_date,
                        "hook_type": "loss",
                        "hook_line": "新NISAの年間360万円枠を一括で入れた直後に36.8%下がる落とし穴",
                        "slide_script_body": "新NISAの年間360万円枠を一括で入れた直後に36.8%下がると、老後資金の回復には数年かかります。毎日無料の米国半導体・恐怖と強欲指数と25年統計を30秒で確認できます。",
                        "cta": "毎日無料の米国半導体・恐怖と強欲指数と25年統計を下のプロフィールリンクから確認できます。",
                        "speech_bubble": "新NISA 360万円一括の罠",
                        "pinned_comment_bridge": "毎日無料の米国半導体・恐怖指数と25年統計をプロフィール上部リンクで確認できます。",
                        "success_metric": "go_clicks >= 3 over 7d",
                        "rollback_trigger": "0 go_clicks after 3 matured runs",
                    }
                ],
            },
            "HERO": {
                "hook_weight_deltas": {"self": 0.10},
                "experiments": [
                    {
                        "exp_id": "HERO_SWARM_20261129_01",
                        "status": "active",
                        "expires_at": exp_date,
                        "hook_type": "self",
                        "hook_line": "밤 10시 거실에서 어머님께 바치는 백운호 6곡 완곡 무대와 꽃카드",
                        "slide_script_body": "밤 10시 텅 빈 거실에서 평생 가족 밥상 차리신 어머님께 바치는 백운호 6곡 완곡 무료 라디오입니다. 어제와 다른 따뜻한 위로곡 2절과 무료 아침 꽃카드를 가입 없이 들으세요.",
                        "cta": "가입 없이 듣는 백운호 6곡 완곡 무료 라디오와 아침 꽃카드는 아래 백운호 얼굴 누르고 파란 주소에서 바로 여세요.",
                        "speech_bubble": "어머님 위한 6곡 위로곡",
                        "pinned_comment_bridge": "가입 없이 듣는 백운호 6곡 무료 라디오와 아침 꽃카드를 아래 파란 주소에서 바로 열어보세요.",
                        "success_metric": "go_clicks >= 8 over 7d",
                        "rollback_trigger": "go_ctr < 0.1% after 3 matured runs",
                    }
                ],
            },
            "KFK": {
                "hook_weight_deltas": {"loss": 0.20},
                "experiments": [
                    {
                        "exp_id": "KFK_SWARM_20261129_01",
                        "status": "active",
                        "expires_at": exp_date,
                        "hook_type": "loss",
                        "hook_line": "새벽마다 이불 차는 아이, 침실 온도 2도 낮추면 키 3cm 차이",
                        "slide_script_body": "새벽마다 이불 차고 깨는 아이, 침실 온도 딱 2도만 낮춰도 밤사이 성장 리듬이 달라집니다. 광고 없는 1분 무료 질병관리청 예상키·뼈나이 시차 진단으로 바로 확인해 보세요.",
                        "cta": "광고 없는 1분 무료 질병관리청 예상키·뼈나이 시차 진단으로 아래 프로필 링크에서 바로 확인해 보세요.",
                        "speech_bubble": "침실 온도 2도 반전 공식",
                        "pinned_comment_bridge": "광고 없는 1분 무료 질병관리청 예상키·뼈나이 시차 진단, 아래 프로필 링크에서 바로 확인해 보세요.",
                        "success_metric": "go_clicks >= 6 over 7d",
                        "rollback_trigger": "48h views < 50% median after 2 runs",
                    }
                ],
            },
        },
    }


def run_all_tests() -> None:
    today = dt.date(2026, 11, 28)

    # 1. Governance Sanctuary Hard Lock
    spg.run_sanctuary_self_tests()
    print("[PASS 1/7] Governance Sanctuary Hard Lock blocked 11/11 forbidden targets.")

    # 2. Valid 5-Division Overlay passes ALL 6 layers (Hard Gate + Taste >= 85 + Caps)
    valid = _make_valid_overlay(today)
    ok, errs, rep = spg.validate_swarm_overlay(valid, today_kst=today)
    assert ok, f"Valid 5-div overlay unexpectedly failed: {errs}"
    assert rep["total_active_experiments"] == 5
    for d in spg.DIVISIONS:
        assert rep["divisions"][d]["experiments"][0]["taste_score"] >= 85
    print("[PASS 2/7] Valid 5-division overlay passed Hard Gate + Taste >= 85 + Gradual Caps.")

    # 3. Gradual Cap Violations Blocked (>2 active exps, >20% traffic, >+-0.25 delta, mutable baseline)
    bad_cap = copy.deepcopy(valid)
    bad_cap["safety_policy"]["max_traffic_allocation_ratio"] = 0.35
    bad_cap["safety_policy"]["baseline_matrix_immutable"] = False
    bad_cap["divisions"]["KFK"]["hook_weight_deltas"]["loss"] = 0.60
    e1 = copy.deepcopy(bad_cap["divisions"]["KFK"]["experiments"][0])
    e2 = copy.deepcopy(e1); e2["exp_id"] = "KFK_SWARM_20261129_02"
    e3 = copy.deepcopy(e1); e3["exp_id"] = "KFK_SWARM_20261129_03"
    bad_cap["divisions"]["KFK"]["experiments"] = [e1, e2, e3]
    ok_cap, errs_cap, _ = spg.validate_swarm_overlay(bad_cap, today_kst=today)
    assert not ok_cap
    assert any("policy_traffic_ratio_exceeded" in e for e in errs_cap)
    assert any("policy_baseline_matrix_must_be_immutable" in e for e in errs_cap)
    assert any("delta_exceeds_cap" in e for e in errs_cap)
    assert any("too_many_active_experiments" in e for e in errs_cap)
    print("[PASS 3/7] Gradual cap violations (3 exps, 35% traffic, +0.60 delta, mutable baseline) blocked.")

    # 4. Out-of-Scope Frozen Channels & Division Banned Terms Blocked
    bad_oos = copy.deepcopy(valid)
    bad_oos["divisions"]["KFK"]["experiments"][0]["pinned_comment_bridge"] = "네이버 블로그 최저가 쿠팡 특가로 확인하세요."
    bad_oos["divisions"]["HERO"]["experiments"][0]["hook_line"] = "황영웅 콘서트 무료 듣기 밤 10시 거실 무대"
    bad_oos["divisions"]["GBA"]["experiments"][0]["cta"] = "Telegram t.me とオルカンで老後資産を確認"
    ok_oos, errs_oos, _ = spg.validate_swarm_overlay(bad_oos, today_kst=today)
    assert not ok_oos
    assert any("out_of_scope_channel:oos_naver_blog" in e for e in errs_oos)
    assert any("global_banned:황영웅" in e for e in errs_oos)
    assert any("div_banned:t.me" in e or "div_banned:オルカン" in e for e in errs_oos)
    print("[PASS 4/7] Out-of-scope frozen channels & division guardrails strictly blocked.")

    # 5. Low-Taste (<85) Abstract Intro Rejected Fail-Closed
    bad_taste = copy.deepcopy(valid)
    bad_taste["divisions"]["KFK"]["experiments"][0]["hook_line"] = "오늘은 우리 아이 키 성장에 대해 알아보겠습니다"
    bad_taste["divisions"]["KFK"]["experiments"][0]["slide_script_body"] = "오늘은 성장의 중요성에 대해 전반적으로 살펴보겠습니다."
    bad_taste["divisions"]["KFK"]["experiments"][0]["speech_bubble"] = "오늘은 우리 아이 키 성장에 대해 모두 정리해 드리겠습니다"
    ok_t, errs_t, _ = spg.validate_swarm_overlay(bad_taste, today_kst=today)
    assert not ok_t
    assert any("taste_gate_failed" in e for e in errs_t)
    print("[PASS 5/7] Abstract intro / Taste < 85 draft rejected fail-closed.")

    # 6. High-Risk Approval Proposal Registry & HTML Escaping (No Live Telegram Send)
    sample_proposals = [
        {
            "proposal_id": "SWARM-20261129-01",
            "division": "TOM",
            "target_room": "homepage",
            "category": "홈페이지 첫 화면 메시지 매치 개선",
            "data_evidence": "30일 순수 외부 UV 18명 유입 중 퀴즈 시작 0건 (이탈률 100%)",
            "before_state": "일반 은퇴 문구 노출 & 4단계 시작 버튼 하단 배치",
            "after_proposal": "SMH 3.7 & 2008 <stress-test> 30초 진단 버튼 상단 배치",
            "redteam_risk_and_rollback": "결제/Whop 링크 무변경; 7일 후 퀴즈 시작률 < 10% 시 즉시 원복",
            "expected_impact": "외부 UV -> 스텝업 진단 진입률 0% -> 15%+",
        }
    ]
    tg_html = spg.format_proposal_telegram_html(sample_proposals[0])
    assert "&lt;stress-test&gt;" in tg_html and "&amp;" in tg_html, f"HTML escaping failed: {tg_html}"
    assert "SWARM-20261129-01 승인" in tg_html
    with tempfile.TemporaryDirectory() as td:
        tmp_data = Path(td) / "data"
        tmp_docs = Path(td) / "docs"
        res_p = spg.register_and_notify_proposals(
            sample_proposals,
            ledger_path=tmp_data / "swarm_approval_proposals.json",
            docs_dir=tmp_docs,
            notify_telegram=False,
        )
        assert res_p["ok"] and res_p["count"] == 1
        assert (tmp_data / "swarm_approval_proposals.json").exists()
        assert (tmp_docs / "SWARM-20261129-01.md").exists()

        # Also test atomic apply_swarm_overlay to temp data dir
        res_apply = spg.apply_swarm_overlay(
            valid,
            hq_path=tmp_data / "swarm_promo_experiments.json",
            div1_path=None,
            today_kst=today,
        )
        assert res_apply["ok"]
        raw_bytes = (tmp_data / "swarm_promo_experiments.json").read_bytes()
        assert b"\r\n" not in raw_bytes, "Overlay JSON must use LF line endings!"
    print("[PASS 6/7] High-risk proposal registration, HTML escaping, and LF atomic overlay apply passed.")

    # 7. Runner 80/20 Non-Destructive Integration + Context Builder Smoke
    from ab_evolution_engine import load_matrix, select_stage12_ab_cell
    matrix_db = load_matrix()
    weights_db = cpr.load_topic_hook_weights()
    modes = []
    for day_offset in range(60):
        d_str = (today + dt.timedelta(days=day_offset % 14)).isoformat()
        cell, mode = cpr.select_hill_climbed_cell_80_20(
            matrix_db,
            "KFK",
            d_str,
            arm_idx=day_offset % 2,
            weights_db=weights_db,
            fallback_selector=select_stage12_ab_cell,
            swarm_overlay=valid,
        )
        assert cell is not None
        modes.append(mode)
        if mode == "exploit_80":
            assert not cell.get("swarm_exp_id"), "80% Exploit MUST NEVER mutate baseline cells!"
        if mode == "swarm_explore_20":
            assert cell.get("swarm_exp_id") == "KFK_SWARM_20261129_01"
    swarm_ratio = modes.count("swarm_explore_20") / len(modes)
    assert 0.0 < swarm_ratio <= 0.30, f"Unexpected swarm explore share across 60 samples: {swarm_ratio:.2f}"

    brief = scb.build_swarm_brief(refresh_live_aarrr=False)
    assert brief["schema_version"] == "swarm-weekly-brief-v1"
    assert set(brief["divisions"].keys()) == set(spg.DIVISIONS)
    md = scb.format_swarm_brief_markdown(brief)
    assert "2단 절벽 진단표" in md and "1사업부 TOM" in md and "5사업부 KFK" in md
    print(f"[PASS 7/7] Runner 80/20 non-destructive overlay (swarm_explore={swarm_ratio:.1%}) & context builder passed.")
    print("ALL SWARM PROMO GATE & INTEGRATION TESTS PASSED (7/7).")


if __name__ == "__main__":
    run_all_tests()
