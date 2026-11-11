"""
backend/tests/test_adversarial_quant_doctor.py - Adversarial & Boundary Stress Harness
Author: Challenger D1-1 (Empirical Challenger)
Milestone: M4 Adversarial Mathematical Verification

Target Components:
- `backend/app/services/quant_engine.py`: `diagnose_portfolio`
- `backend/app/models/auth.py`: `PortfolioDoctorRequest`, `PortfolioDoctorResponse`
- `backend/app/api/pro.py`: `POST /api/pro/portfolio-doctor`

Adversarial Stress Dimensions:
1. Boundary Positions: 0 positions, 1 position, exactly 10 positions, 11+ positions (11, 15, 25).
2. Extreme Returns & Prices: -99.99% loss, 0% change, +1000% gain, +100,000% gain.
3. Fractional Shares & Extreme Basis: 0.001 shares, $0.01 micro-cost, $1,000,000 mega-basis.
4. Holding Days Transitions: 0, 54, 55 (critical dead money boundary), 56, 1000 days, hard stop priority over time stop.
5. Health Score Strict Range: All 121 combinations of (hard_stops, dead_money) clamped strictly [0, 100].
6. Macro Stress Volatility: Finite float math, zero NaN, zero ZeroDivisionError across sector regime baskets.
7. Rebalancing Parity: 1.35% risk parity sizing, positive dollar amounts, zero value trap contamination.
8. Gated REST API Adherence: Full JSON serialization and contract compliance via FastAPI TestClient.
"""

import math
import json
import pytest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.services.quant_engine import quant_engine, VALUE_TRAPS
from backend.app.models.auth import (
    PortfolioPositionItem,
    PortfolioDoctorRequest,
    PortfolioDoctorResponse,
)

client = TestClient(app)
PRO_HEADERS = {"Authorization": "Bearer PRO-DEMO-2026"}


# ==============================================================================
# 1. Boundary Positions: 0, 1, Exactly 10, and 11+ Positions
# ==============================================================================

def test_adv_boundary_0_positions():
    """Empty position list must return valid response with health_score=100 and zeroed metrics."""
    res = quant_engine.diagnose_portfolio(positions=[], total_capital=10000.0)
    assert isinstance(res, PortfolioDoctorResponse)
    assert res.health_score == 100
    assert res.total_invested == 0.0
    assert res.total_unrealized_pnl == 0.0
    assert res.total_unrealized_pnl_pct == 0.0
    assert res.capital_at_risk == 0.0
    assert len(res.items) == 0
    assert len(res.stress_scenarios) == 3
    for s in res.stress_scenarios:
        assert s.projected_pnl_pct == 0.0
        assert s.impact_usd == 0.0
        assert s.verdict == "Neutral"
        assert math.isfinite(s.projected_pnl_pct)
        assert math.isfinite(s.impact_usd)
    assert len(res.rebalance_recommendations) == 1
    reb = res.rebalance_recommendations[0]
    assert reb.action == "MAINTAIN"
    assert reb.amount_usd == 0.0
    assert reb.setup_type == "CASH_RESERVE"


def test_adv_boundary_1_position_states():
    """Single position correctly triggers each of the 4 core exit rules."""
    # State 1: Hard Stop (-9% or worse)
    p_stop = [PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=10, days_held=10, current_price=90.0)]
    r_stop = quant_engine.diagnose_portfolio(p_stop)
    assert r_stop.items[0].status_code == "HARD_STOP"
    assert r_stop.items[0].is_critical is True
    assert r_stop.health_score == 70  # 100 - 30

    # State 2: Time Stop (>= 55 days & < 8%)
    p_time = [PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=10, days_held=55, current_price=105.0)]
    r_time = quant_engine.diagnose_portfolio(p_time)
    assert r_time.items[0].status_code == "TIME_STOP"
    assert r_time.items[0].is_critical is False
    assert r_time.health_score == 85  # 100 - 15

    # State 3: TP1 Take Profit (>= +100%)
    p_tp1 = [PortfolioPositionItem(ticker="CELH", entry_price=50.0, shares=10, days_held=40, current_price=100.0)]
    r_tp1 = quant_engine.diagnose_portfolio(p_tp1)
    assert r_tp1.items[0].status_code == "TP1_HARVEST"
    assert r_tp1.items[0].is_critical is False
    assert r_tp1.health_score == 100

    # State 4: Active Healthy Hold
    p_hold = [PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=10, days_held=20, current_price=110.0)]
    r_hold = quant_engine.diagnose_portfolio(p_hold)
    assert r_hold.items[0].status_code == "HOLD"
    assert r_hold.items[0].is_critical is False
    assert r_hold.health_score == 100


def test_adv_boundary_exactly_10_positions():
    """Exactly 10 positions handled smoothly without overflow or missing items."""
    raw_tickers = ["CELH", "CCL", "TSLA", "UPST", "MBLY", "APP", "ENPH", "SEDG", "CVNA", "UBER"]
    positions = [
        PortfolioPositionItem(
            ticker=t,
            entry_price=100.0 + (i * 10.0),
            shares=5.0,
            days_held=10 + (i * 5),
            current_price=105.0 + (i * 10.0),
        )
        for i, t in enumerate(raw_tickers)
    ]
    assert len(positions) == 10
    res = quant_engine.diagnose_portfolio(positions)
    assert len(res.items) == 10
    assert 0 <= res.health_score <= 100
    assert res.total_invested > 0
    assert math.isfinite(res.total_invested)
    assert math.isfinite(res.capital_at_risk)


def test_adv_boundary_11_plus_positions():
    """Engine gracefully processes 11, 15, and 25 positions without crashing and preserves score bounds."""
    for count in [11, 15, 25]:
        tickers = ["CELH", "CCL", "TSLA", "UPST", "MBLY", "APP", "ENPH", "SEDG", "CVNA", "UBER", "NVDA", "AMD", "MU", "CRWD", "PANW"]
        positions = [
            PortfolioPositionItem(
                ticker=tickers[i % len(tickers)],
                entry_price=50.0,
                shares=2.0,
                days_held=60,
                current_price=40.0,  # -20% -> HARD_STOP
            )
            for i in range(count)
        ]
        res = quant_engine.diagnose_portfolio(positions)
        assert len(res.items) == count
        # With 11+ hard stops: raw = 100 - (30 * 11) = -230 -> strictly clamped to 0
        assert res.health_score == 0
        assert res.total_invested == round(40.0 * 2.0 * count, 2)
        assert math.isfinite(res.total_invested)
        assert math.isfinite(res.total_unrealized_pnl)


# ==============================================================================
# 2. Extreme Price and Return Tests
# ==============================================================================

def test_adv_extreme_loss_and_gain():
    """Tests extreme -99.9% collapse, 0% change, +1000% moonshot, and +100,000% gain."""
    # Case 1: Catastrophic -99.9% loss
    p_loss = [PortfolioPositionItem(ticker="CELH", entry_price=1000.0, shares=10.0, days_held=5, current_price=1.0)]
    r_loss = quant_engine.diagnose_portfolio(p_loss)
    diag_loss = r_loss.items[0]
    assert diag_loss.current_return_pct == -99.9
    assert diag_loss.status_code == "HARD_STOP"
    assert diag_loss.is_critical is True
    assert diag_loss.invested_value == 10.0
    assert diag_loss.unrealized_pnl == -9990.0
    assert r_loss.total_unrealized_pnl == -9990.0

    # Case 2: Exactly 0.0% change
    p_flat = [PortfolioPositionItem(ticker="CCL", entry_price=25.0, shares=100.0, days_held=10, current_price=25.0)]
    r_flat = quant_engine.diagnose_portfolio(p_flat)
    diag_flat = r_flat.items[0]
    assert diag_flat.current_return_pct == 0.0
    assert diag_flat.unrealized_pnl == 0.0
    assert diag_flat.status_code == "HOLD"

    # Case 3: +1000% gain ($10 -> $110)
    p_1000 = [PortfolioPositionItem(ticker="NVDA", entry_price=10.0, shares=50.0, days_held=80, current_price=110.0)]
    r_1000 = quant_engine.diagnose_portfolio(p_1000)
    diag_1000 = r_1000.items[0]
    assert diag_1000.current_return_pct == 1000.0
    assert diag_1000.status_code == "TP1_HARVEST"
    assert diag_1000.is_critical is False
    assert diag_1000.invested_value == 5500.0
    assert diag_1000.unrealized_pnl == 5000.0

    # Case 4: Extreme +100,000% gain ($0.10 -> $100.10)
    p_mega = [PortfolioPositionItem(ticker="UPST", entry_price=0.10, shares=100.0, days_held=200, current_price=100.10)]
    r_mega = quant_engine.diagnose_portfolio(p_mega)
    diag_mega = r_mega.items[0]
    assert diag_mega.current_return_pct == 100000.0
    assert diag_mega.status_code == "TP1_HARVEST"
    assert math.isfinite(r_mega.total_unrealized_pnl_pct)


def test_adv_return_threshold_boundaries():
    """Tests critical return boundaries: -9.01%, -9.00%, -8.99%, +7.99%, +8.00%, +99.99%, +100.00%."""
    # Boundary: -9.00% vs -8.99%
    p_exact_stop = [PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=1.0, days_held=10, current_price=91.0)]
    assert quant_engine.diagnose_portfolio(p_exact_stop).items[0].status_code == "HARD_STOP"

    p_below_stop = [PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=1.0, days_held=10, current_price=90.99)]
    assert quant_engine.diagnose_portfolio(p_below_stop).items[0].status_code == "HARD_STOP"

    p_above_stop = [PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=1.0, days_held=10, current_price=91.01)]
    assert quant_engine.diagnose_portfolio(p_above_stop).items[0].status_code == "HOLD"

    # Boundary at 55 days: +7.99% vs +8.00%
    p_stagnant = [PortfolioPositionItem(ticker="CCL", entry_price=100.0, shares=1.0, days_held=55, current_price=107.99)]
    assert quant_engine.diagnose_portfolio(p_stagnant).items[0].status_code == "TIME_STOP"

    p_cleared = [PortfolioPositionItem(ticker="CCL", entry_price=100.0, shares=1.0, days_held=55, current_price=108.00)]
    assert quant_engine.diagnose_portfolio(p_cleared).items[0].status_code == "HOLD"

    # Boundary at TP1: +99.99% vs +100.00%
    p_near_tp1 = [PortfolioPositionItem(ticker="TSLA", entry_price=100.0, shares=1.0, days_held=40, current_price=199.99)]
    assert quant_engine.diagnose_portfolio(p_near_tp1).items[0].status_code == "HOLD"

    p_exact_tp1 = [PortfolioPositionItem(ticker="TSLA", entry_price=100.0, shares=1.0, days_held=40, current_price=200.00)]
    assert quant_engine.diagnose_portfolio(p_exact_tp1).items[0].status_code == "TP1_HARVEST"


# ==============================================================================
# 3. Fractional Shares and Extreme Basis Tests
# ==============================================================================

def test_adv_fractional_shares_and_extreme_cost_basis():
    """Validates fractional share math (0.001 shares) and high basis ($500,000/sh)."""
    # Micro position: 0.001 shares of $30 stock
    p_micro = [PortfolioPositionItem(ticker="CELH", entry_price=30.0, shares=0.001, days_held=10, current_price=33.0)]
    r_micro = quant_engine.diagnose_portfolio(p_micro)
    assert r_micro.items[0].invested_value == 0.03
    assert math.isfinite(r_micro.capital_at_risk)

    # Mega position: 100 shares of $500,000 stock ($50M capital)
    p_mega = [PortfolioPositionItem(ticker="NVDA", entry_price=500000.0, shares=100.0, days_held=20, current_price=550000.0)]
    r_mega = quant_engine.diagnose_portfolio(p_mega, total_capital=100000000.0)
    assert r_mega.total_invested == 55000000.0
    assert r_mega.total_unrealized_pnl == 5000000.0
    assert r_mega.total_unrealized_pnl_pct == 10.0
    assert math.isfinite(r_mega.capital_at_risk)
    assert not math.isnan(r_mega.total_invested)


# ==============================================================================
# 4. Holding Days Transitions: 0, 54, 55, 56, 1000 Days & Rule Precedence
# ==============================================================================

def test_adv_holding_days_transitions_and_precedence():
    """Verify holding days transitions and Rule 1 (-9% hard stop) precedence over Rule 2 (55D time stop)."""
    # 0 days, moderate gain (+5%) -> HOLD
    assert quant_engine.diagnose_portfolio([
        PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=1.0, days_held=0, current_price=105.0)
    ]).items[0].status_code == "HOLD"

    # 54 days (active hold just before dead money threshold), gain +5% -> HOLD
    assert quant_engine.diagnose_portfolio([
        PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=1.0, days_held=54, current_price=105.0)
    ]).items[0].status_code == "HOLD"

    # 55 days (dead money threshold breached), gain +5% (<8%) -> TIME_STOP
    assert quant_engine.diagnose_portfolio([
        PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=1.0, days_held=55, current_price=105.0)
    ]).items[0].status_code == "TIME_STOP"

    # 56 days, gain +5% -> TIME_STOP
    assert quant_engine.diagnose_portfolio([
        PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=1.0, days_held=56, current_price=105.0)
    ]).items[0].status_code == "TIME_STOP"

    # 1000 days, gain +5% -> TIME_STOP
    assert quant_engine.diagnose_portfolio([
        PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=1.0, days_held=1000, current_price=105.0)
    ]).items[0].status_code == "TIME_STOP"

    # RULE 1 PRECEDENCE:
    # 60 days held AND return is -15% (both conditions met: days >= 55 AND return <= -9%).
    # Rule 1 MUST take absolute priority -> HARD_STOP (critical liquidation), NOT TIME_STOP.
    r_priority = quant_engine.diagnose_portfolio([
        PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=1.0, days_held=60, current_price=85.0)
    ])
    assert r_priority.items[0].status_code == "HARD_STOP"
    assert r_priority.items[0].is_critical is True
    # Verify score penalty is -30 (from HARD_STOP), not -15
    assert r_priority.health_score == 70


# ==============================================================================
# 5. Health Score Strict Range [0, 100] Exhaustive Matrix
# ==============================================================================

def test_adv_health_score_bounds_matrix():
    """
    Exhaustively tests all 121 combinations of (hard_stops: 0..10, dead_money: 0..10):
    - Starts at 100
    - -30 per hard stop
    - -15 per dead money
    - MUST strictly satisfy: 0 <= health_score <= 100
    - Zero NaN, zero float drift, purely integer.
    """
    for hs in range(11):
        for dm in range(11):
            positions = []
            for i in range(hs):
                positions.append(
                    PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=1.0, days_held=10, current_price=80.0)
                )
            for j in range(dm):
                positions.append(
                    PortfolioPositionItem(ticker="CCL", entry_price=100.0, shares=1.0, days_held=60, current_price=102.0)
                )

            res = quant_engine.diagnose_portfolio(positions)
            score = res.health_score

            expected_raw = 100 - (30 * hs) - (15 * dm)
            expected_clamped = int(max(0, min(100, expected_raw)))

            assert score == expected_clamped, f"Failed at ({hs} HS, {dm} DM): expected {expected_clamped}, got {score}"
            assert 0 <= score <= 100, f"Health score {score} out of bounds at ({hs} HS, {dm} DM)"
            assert isinstance(score, int)


# ==============================================================================
# 6. Macro Volatility Stress Scenarios Math & Finite Floats
# ==============================================================================

def test_adv_macro_stress_scenarios_finite_floats_and_verdicts():
    """
    Verifies that all 3 macro stress scenarios produce valid finite floats,
    accurate USD impacts, and responsive qualitative verdicts.
    """
    # 1. Tech & Semiconductor Heavy Portfolio
    p_tech = [
        PortfolioPositionItem(ticker="NVDA", entry_price=100.0, shares=10.0, days_held=20, current_price=120.0),
        PortfolioPositionItem(ticker="AMD", entry_price=150.0, shares=10.0, days_held=20, current_price=160.0),
    ]
    r_tech = quant_engine.diagnose_portfolio(p_tech)
    scenarios_tech = {s.name: s for s in r_tech.stress_scenarios}

    s1 = scenarios_tech["Semi Extreme Fear Shock (-15%)"]
    assert s1.projected_pnl_pct == -15.0
    assert s1.impact_usd < 0
    assert s1.verdict == "Vulnerable"
    assert math.isfinite(s1.impact_usd)

    s2 = scenarios_tech["Defensive Safe-Haven Rotation ($XLV +5%)"]
    assert s2.projected_pnl_pct == -2.0
    assert s2.verdict in ("Neutral", "Vulnerable")

    s3 = scenarios_tech["Right-Side Ignition Wave (+25%)"]
    assert math.isfinite(s3.projected_pnl_pct)
    assert s3.impact_usd > 0

    # 2. Healthcare & Defensive Portfolio (CELH mapped to Consumer, LLY to Healthcare)
    p_def = [
        PortfolioPositionItem(ticker="LLY", entry_price=700.0, shares=5.0, days_held=30, current_price=750.0),
    ]
    r_def = quant_engine.diagnose_portfolio(p_def)
    scenarios_def = {s.name: s for s in r_def.stress_scenarios}
    s2_def = scenarios_def["Defensive Safe-Haven Rotation ($XLV +5%)"]
    assert s2_def.projected_pnl_pct == 5.0
    assert s2_def.verdict == "Resilient"


# ==============================================================================
# 7. Rebalancing Recommendations & Risk Parity Sizing
# ==============================================================================

def test_adv_rebalancing_harvest_and_reallocation():
    """
    Verifies that:
    1. Harvest amounts equal exact invested values of stopped/dead positions.
    2. Reallocated amounts are strictly positive, sum equals total harvested.
    3. Reallocation targets top active Right-Side Ignition setups.
    4. Current holdings and VALUE_TRAPS are strictly excluded from reallocations.
    5. Reason states '1.35% risk parity allocation'.
    """
    # 2 positions: 1 HARD_STOP (CELH: invested $850), 1 TIME_STOP (CCL: invested $1050), 1 HOLD (TSLA: invested $2000)
    p_rebal = [
        PortfolioPositionItem(ticker="CELH", entry_price=100.0, shares=10.0, days_held=10, current_price=85.0),
        PortfolioPositionItem(ticker="CCL", entry_price=100.0, shares=10.0, days_held=60, current_price=105.0),
        PortfolioPositionItem(ticker="TSLA", entry_price=180.0, shares=10.0, days_held=20, current_price=200.0),
    ]
    res = quant_engine.diagnose_portfolio(p_rebal)
    rebs = res.rebalance_recommendations

    harvests = [r for r in rebs if r.action == "HARVEST"]
    reallocs = [r for r in rebs if r.action == "REALLOCATE"]

    assert len(harvests) == 2
    harvest_tickers = {h.ticker for h in harvests}
    assert harvest_tickers == {"CELH", "CCL"}

    total_harvest_usd = sum(h.amount_usd for h in harvests)
    assert total_harvest_usd == 850.0 + 1050.0  # $1900.00

    assert len(reallocs) > 0
    total_realloc_usd = sum(r.amount_usd for r in reallocs)
    # Reallocated sum must match harvested sum within rounding tolerance
    assert abs(total_realloc_usd - total_harvest_usd) <= 0.10

    for r in reallocs:
        assert r.amount_usd > 0
        assert r.target_ticker not in {"CELH", "CCL", "TSLA"}
        assert r.target_ticker not in VALUE_TRAPS
        assert "1.35% risk parity" in r.reason or "CASH" in r.setup_type


def test_adv_rebalancing_all_ignition_held_fallback_to_cash():
    """
    If all available ignition candidates are already in the portfolio,
    harvested capital must safely route 100% to CASH_RESERVE / CASH_SAFE_HAVEN.
    """
    # Find all ignition tickers currently in quant_engine
    ign_tickers = [s.ticker for s in quant_engine.stocks if s.zone_code == "IGNITION_ZONE" and s.ticker not in VALUE_TRAPS]
    # Build positions with all ignition candidates, making one of them HARD_STOP
    positions = []
    for i, t in enumerate(ign_tickers):
        cur = 50.0 if i == 0 else 110.0
        positions.append(
            PortfolioPositionItem(ticker=t, entry_price=100.0, shares=1.0, days_held=10, current_price=cur)
        )
    res = quant_engine.diagnose_portfolio(positions)
    reallocs = [r for r in res.rebalance_recommendations if r.action == "REALLOCATE"]
    assert len(reallocs) == 1
    assert reallocs[0].target_ticker == "CASH_RESERVE"
    assert reallocs[0].allocation_pct == 100.0
    assert reallocs[0].setup_type == "CASH_SAFE_HAVEN"


# ==============================================================================
# 8. Full End-to-End API Integration & Contract Verification
# ==============================================================================

def test_adv_api_endpoint_portfolio_doctor_full_contract():
    """
    POST /api/pro/portfolio-doctor end-to-end integration:
    - 401 Unauthorized without token
    - 200 OK with PRO-DEMO-2026
    - Verifies JSON output contains zero NaN, zero null required fields, valid schema
    """
    # Unauthenticated -> 401
    r_unauth = client.post("/api/pro/portfolio-doctor", json={"positions": []})
    assert r_unauth.status_code == 401

    # Authenticated with valid payload -> 200
    payload = {
        "positions": [
            {"ticker": "CELH", "entry_price": 28.5, "shares": 100.0, "days_held": 45, "current_price": 24.5},
            {"ticker": "CCL", "entry_price": 19.2, "shares": 200.0, "days_held": 58, "current_price": 20.0},
            {"ticker": "TSLA", "entry_price": 215.0, "shares": 50.0, "days_held": 30, "current_price": 230.0},
        ],
        "total_capital": 50000.0,
    }
    r_auth = client.post("/api/pro/portfolio-doctor", json=payload, headers=PRO_HEADERS)
    assert r_auth.status_code == 200
    data = r_auth.json()

    # Raw string inspection to guarantee zero NaN or undefined in JSON wire format
    raw_text = r_auth.text
    assert "NaN" not in raw_text
    assert "undefined" not in raw_text

    assert "health_score" in data
    assert 0 <= data["health_score"] <= 100
    assert data["total_invested"] > 0
    assert len(data["items"]) == 3
    assert len(data["stress_scenarios"]) == 3
    assert len(data["rebalance_recommendations"]) >= 1
