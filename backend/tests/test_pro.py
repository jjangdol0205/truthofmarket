"""
backend/tests/test_pro.py - Unit and Integration Tests for Pro Access Control and Tools
"""
import pytest
from fastapi.testclient import TestClient

from backend.app.main import app


@pytest.fixture
def api_client():
    return TestClient(app)


def test_pro_vault_unauthenticated_blocked(api_client):
    """Unauthenticated access to /api/pro/vault returns 401 Unauthorized."""
    res = api_client.get("/api/pro/vault")
    assert res.status_code == 401


def test_pro_vault_authenticated_success(api_client):
    """Pro access to /api/pro/vault with Bearer PRO-DEMO-2026 returns 200 OK."""
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}
    res = api_client.get("/api/pro/vault", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["unlocked"] is True
    assert data["tier"] == "pro"
    assert "position_doctor" in data["tools"]


def test_pine_script_unauthenticated_blocked(api_client):
    """Unauthenticated access to /api/pro/pine-script returns 401 Unauthorized."""
    res = api_client.get("/api/pro/pine-script")
    assert res.status_code == 401


def test_pine_script_authenticated_delivery(api_client):
    """Authenticated access returns TradingView Pine Script v5 indicator code."""
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}
    res = api_client.get("/api/pro/pine-script", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["version"] == "v5"
    assert "//@version=5" in data["code"]
    assert "RightSideAlpha" in data["code"]


def test_pinescript_alias_route(api_client):
    """GET /api/pro/pinescript works as alias for /api/pro/pine-script."""
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}
    res = api_client.get("/api/pro/pinescript", headers=headers)
    assert res.status_code == 200
    assert "indicator" in res.json()["code"]


def test_pro_stocks_unmasked(api_client):
    """GET /api/pro/stocks-unmasked returns all 72 US stocks with target prices."""
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}
    res = api_client.get("/api/pro/stocks-unmasked", headers=headers)
    assert res.status_code == 200
    stocks = res.json()
    assert len(stocks) == 72
    for s in stocks:
        assert s["is_pro_locked"] is False
        assert s["stop_loss_price"] is not None
        assert s["tp1_2x_price"] is not None


def test_position_doctor_rule_1_hard_stop(api_client):
    """Position Doctor Rule 1 (-9.0% hard stop)."""
    payload = {"ticker": "CELH", "entry_price": 100.0, "days_held": 10, "current_price": 91.0}
    res = api_client.post("/api/pro/position-doctor", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status_code"] == "HARD_STOP"
    assert data["is_critical"] is True
    assert data["return_pct"] == -9.0


def test_position_doctor_rule_2_time_stop(api_client):
    """Position Doctor Rule 2 (55-day time stop when return < 8%)."""
    payload = {"ticker": "CELH", "entry_price": 100.0, "days_held": 55, "current_price": 105.0}
    res = api_client.post("/api/pro/position-doctor", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status_code"] == "TIME_STOP"
    assert "Rule 2" in data["rule_triggered"]


def test_position_doctor_rule_3_tp1_harvest(api_client):
    """Position Doctor Rule 3 (+100% TP1 harvesting)."""
    payload = {"ticker": "CELH", "entry_price": 50.0, "days_held": 40, "current_price": 100.0}
    res = api_client.post("/api/pro/position-doctor", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status_code"] == "TP1_HARVEST"
    assert "Sell 50%" in data["action_plan"]


def test_position_doctor_rule_4_hold(api_client):
    """Position Doctor Rule 4 (Normal hold)."""
    payload = {"ticker": "CELH", "entry_price": 100.0, "days_held": 20, "current_price": 115.0}
    res = api_client.post("/api/pro/position-doctor", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status_code"] == "HOLD"


def test_position_doctor_negative_entry_price_returns_422(api_client):
    """Invalid entry_price <= 0 returns 422 Unprocessable Entity."""
    payload = {"ticker": "CELH", "entry_price": -10.0, "days_held": 5}
    res = api_client.post("/api/pro/position-doctor", json=payload)
    assert res.status_code == 422


def test_position_doctor_returns_entry_and_current_price(api_client):
    """Position Doctor returns entry_price, current_price, and as_of_date."""
    payload = {"ticker": "CELH", "entry_price": 25.0, "days_held": 12}
    res = api_client.post("/api/pro/position-doctor", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["entry_price"] == 25.0
    assert data["current_price"] == 27.93
    assert data["as_of_date"] == "2026-10-13"


def test_semi_pro_csv_head_and_alias(api_client):
    """HEAD and GET on /api/semi/pro/csv and /api/semi/download-csv work with X-License-Key."""
    headers = {"X-License-Key": "PRO-DEMO-2026"}
    for path in ["/api/semi/pro/csv", "/api/semi/download-csv"]:
        r_head = api_client.head(path, headers=headers)
        assert r_head.status_code == 200
        r_get = api_client.get(path, headers=headers)
        assert r_get.status_code == 200


# =====================================================================
# Milestone 1: VIP Portfolio Doctor 2.0 & Gated Endpoints Test Suite
# =====================================================================

def test_portfolio_doctor_unauthenticated_blocked(api_client):
    """POST /api/pro/portfolio-doctor without authorization returns 401 Unauthorized."""
    payload = {
        "positions": [
            {"ticker": "CELH", "entry_price": 35.0, "shares": 100, "days_held": 45, "current_price": 28.5}
        ],
        "total_capital": 10000.0,
    }
    res = api_client.post("/api/pro/portfolio-doctor", json=payload)
    assert res.status_code == 401
    assert "Unauthorized" in res.json().get("detail", "")


def test_portfolio_doctor_invalid_token_blocked(api_client):
    """POST /api/pro/portfolio-doctor with invalid token returns 401 Unauthorized."""
    headers = {"Authorization": "Bearer INVALID-EXPIRED-KEY-999"}
    payload = {
        "positions": [
            {"ticker": "CELH", "entry_price": 35.0, "shares": 10, "days_held": 10}
        ]
    }
    res = api_client.post("/api/pro/portfolio-doctor", headers=headers, json=payload)
    assert res.status_code == 401


def test_sector_matrix_unauthenticated_blocked(api_client):
    """GET /api/pro/sector-matrix without authorization returns 401 Unauthorized."""
    res = api_client.get("/api/pro/sector-matrix")
    assert res.status_code == 401


def test_watchlist_unauthenticated_blocked(api_client):
    """GET and POST /api/pro/watchlist without authorization return 401 Unauthorized."""
    res_get = api_client.get("/api/pro/watchlist")
    assert res_get.status_code == 401

    res_post = api_client.post("/api/pro/watchlist", json={"tickers": ["NVDA"]})
    assert res_post.status_code == 401


def test_portfolio_doctor_authenticated_with_demo_key(api_client):
    """POST /api/pro/portfolio-doctor with Bearer PRO-DEMO-2026 returns 200 OK."""
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}
    payload = {
        "positions": [
            {"ticker": "CELH", "entry_price": 35.0, "shares": 100, "days_held": 45, "current_price": 28.5}
        ],
        "total_capital": 10000.0,
    }
    res = api_client.post("/api/pro/portfolio-doctor", headers=headers, json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "health_score" in data
    assert "total_invested" in data
    assert "capital_at_risk" in data
    assert len(data["items"]) == 1
    assert len(data["stress_scenarios"]) == 3
    assert len(data["rebalance_recommendations"]) > 0


def test_portfolio_doctor_authenticated_with_rsa_live_key(api_client):
    """POST /api/pro/portfolio-doctor with X-License-Key RSA-PRO-2026-LIVE7777 returns 200 OK."""
    headers = {"X-License-Key": "RSA-PRO-2026-LIVE7777"}
    payload = {
        "positions": [
            {"ticker": "NVDA", "entry_price": 120.0, "shares": 50, "days_held": 25, "current_price": 135.0}
        ],
        "total_capital": 20000.0,
    }
    res = api_client.post("/api/pro/portfolio-doctor", headers=headers, json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["health_score"] == 100
    assert data["items"][0]["status_code"] == "HOLD"


def test_portfolio_doctor_multi_position_diagnostics(api_client):
    """Multi-position diagnosis correctly evaluates Rule 1, Rule 2, Rule 3, and Rule 4."""
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}
    payload = {
        "positions": [
            {"ticker": "CELH", "entry_price": 35.0, "shares": 100, "days_held": 45, "current_price": 28.5},
            {"ticker": "INTC", "entry_price": 30.0, "shares": 100, "days_held": 60, "current_price": 31.0},
            {"ticker": "SPOT", "entry_price": 150.0, "shares": 20, "days_held": 40, "current_price": 320.0},
            {"ticker": "NVDA", "entry_price": 120.0, "shares": 50, "days_held": 20, "current_price": 130.0},
        ],
        "total_capital": 25000.0,
    }
    res = api_client.post("/api/pro/portfolio-doctor", headers=headers, json=payload)
    assert res.status_code == 200
    data = res.json()

    # CELH: -18.57% -> Rule 1 Hard Stop
    celh = next(item for item in data["items"] if item["ticker"] == "CELH")
    assert celh["status_code"] == "HARD_STOP"
    assert celh["action"] == "CRITICAL_STOP_EXIT"
    assert celh["is_critical"] is True
    assert celh["hard_stop_price"] == 31.85
    assert celh["current_return_pct"] == -18.57

    # INTC: +3.33% in 60 days -> Rule 2 Time Stop (55D Dead Money)
    intc = next(item for item in data["items"] if item["ticker"] == "INTC")
    assert intc["status_code"] == "TIME_STOP"
    assert intc["action"] == "DEAD_MONEY_ROTATE"
    assert intc["is_critical"] is False
    assert "55-Day Dead-Money" in intc["directive"]

    # SPOT: +113.33% -> Rule 3 TP1 Harvest
    spot = next(item for item in data["items"] if item["ticker"] == "SPOT")
    assert spot["status_code"] == "TP1_HARVEST"
    assert spot["action"] == "TP1_TAKE_PROFIT"
    assert spot["current_return_pct"] == 113.33

    # NVDA: +8.33% in 20 days -> Rule 4 Active Hold
    nvda = next(item for item in data["items"] if item["ticker"] == "NVDA")
    assert nvda["status_code"] == "HOLD"
    assert nvda["action"] == "ACTIVE_HOLD"

    # Health score calculation: 100 - (30 * 1 hard stop) - (15 * 1 dead money) = 55
    assert data["health_score"] == 55


def test_portfolio_doctor_health_score_bounds(api_client):
    """Health score starts at 100 and is bounded between 0 and 100."""
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}

    # 4 hard stop breaches: 100 - (4 * 30) = -20 -> bounded to 0
    payload_bad = {
        "positions": [
            {"ticker": "CELH", "entry_price": 50.0, "shares": 10, "days_held": 5, "current_price": 40.0},
            {"ticker": "CCL", "entry_price": 20.0, "shares": 10, "days_held": 5, "current_price": 15.0},
            {"ticker": "TSLA", "entry_price": 250.0, "shares": 10, "days_held": 5, "current_price": 200.0},
            {"ticker": "AMD", "entry_price": 150.0, "shares": 10, "days_held": 5, "current_price": 100.0},
        ]
    }
    res_bad = api_client.post("/api/pro/portfolio-doctor", headers=headers, json=payload_bad)
    assert res_bad.status_code == 200
    assert res_bad.json()["health_score"] == 0

    # Perfect portfolio: all active holds -> health score 100
    payload_good = {
        "positions": [
            {"ticker": "NVDA", "entry_price": 100.0, "shares": 10, "days_held": 10, "current_price": 110.0},
            {"ticker": "AVGO", "entry_price": 150.0, "shares": 10, "days_held": 15, "current_price": 165.0},
        ]
    }
    res_good = api_client.post("/api/pro/portfolio-doctor", headers=headers, json=payload_good)
    assert res_good.status_code == 200
    assert res_good.json()["health_score"] == 100


def test_portfolio_doctor_empty_positions(api_client):
    """Empty portfolio input returns 100 health score and safe default objects."""
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}
    payload = {"positions": [], "total_capital": 10000.0}
    res = api_client.post("/api/pro/portfolio-doctor", headers=headers, json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["health_score"] == 100
    assert data["total_invested"] == 0.0
    assert data["capital_at_risk"] == 0.0
    assert data["items"] == []
    assert len(data["stress_scenarios"]) == 3


def test_portfolio_doctor_stress_scenarios_and_rebalance(api_client):
    """Macro stress scenarios and risk parity rebalance recommendations calculate genuine metrics."""
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}
    payload = {
        "positions": [
            {"ticker": "CELH", "entry_price": 35.0, "shares": 100, "days_held": 45, "current_price": 28.5}
        ],
        "total_capital": 10000.0,
    }
    res = api_client.post("/api/pro/portfolio-doctor", headers=headers, json=payload)
    assert res.status_code == 200
    data = res.json()

    # 3 Macro Stress Scenarios
    scenarios = data["stress_scenarios"]
    assert len(scenarios) == 3
    names = [s["name"] for s in scenarios]
    assert "Semi Extreme Fear Shock (-15%)" in names
    assert "Defensive Safe-Haven Rotation ($XLV +5%)" in names
    assert "Right-Side Ignition Wave (+25%)" in names

    for s in scenarios:
        assert isinstance(s["projected_pnl_pct"], (int, float))
        assert isinstance(s["impact_usd"], (int, float))
        assert s["verdict"] in ("Vulnerable", "Resilient", "High Upside", "Moderate Risk", "Moderate Upside", "Neutral", "Low Momentum")

    # Rebalance Recommendations
    recs = data["rebalance_recommendations"]
    assert len(recs) >= 2
    harvest_recs = [r for r in recs if r["action"] == "HARVEST"]
    realloc_recs = [r for r in recs if r["action"] == "REALLOCATE"]

    assert len(harvest_recs) == 1
    assert harvest_recs[0]["ticker"] == "CELH"
    assert harvest_recs[0]["amount_usd"] == 2850.0

    assert len(realloc_recs) > 0
    for r in realloc_recs:
        assert r["target_ticker"] is not None
        assert r["amount_usd"] > 0
        assert "1.35%" in r["reason"]


def test_sector_matrix_structure_and_completeness(api_client):
    """GET /api/pro/sector-matrix returns exactly 8 sectors covering all 72 US stocks."""
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}
    res = api_client.get("/api/pro/sector-matrix", headers=headers)
    assert res.status_code == 200
    data = res.json()

    sectors = data["sectors"]
    assert len(sectors) == 8

    total_stocks = sum(s["count"] for s in sectors)
    assert total_stocks == 72

    sector_names = [s["name"] for s in sectors]
    assert "AI & Semiconductors" in sector_names
    assert "Consumer & Retail" in sector_names
    assert "Internet & Digital Media" in sector_names
    assert "Cloud & Enterprise Software" in sector_names
    assert "Mobility, EV & CleanTech" in sector_names
    assert "Energy & Industrials" in sector_names
    assert "Fintech & Digital Finance" in sector_names
    assert "Healthcare & Biotechnology" in sector_names

    for s in sectors:
        assert s["count"] == len(s["tickers"])
        assert 0.0 <= s["avg_score"] <= 100.0
        assert s["momentum_trend"] in ("BULLISH", "NEUTRAL", "BEARISH")
        assert s["ignition_count"] >= 0


def test_watchlist_crud_lifecycle(api_client):
    """POST and GET /api/pro/watchlist handle set, add, remove, and clear operations."""
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}

    # Set initial watchlist
    r_set = api_client.post("/api/pro/watchlist", headers=headers, json={"tickers": ["NVDA", "CELH"], "action": "set"})
    assert r_set.status_code == 200
    assert r_set.json()["watchlist"] == ["CELH", "NVDA"]
    assert r_set.json()["count"] == 2

    # Add ticker
    r_add = api_client.post("/api/pro/watchlist", headers=headers, json={"tickers": ["TSLA"], "action": "add"})
    assert r_add.status_code == 200
    assert "TSLA" in r_add.json()["watchlist"]
    assert r_add.json()["count"] == 3

    # Remove ticker
    r_rem = api_client.post("/api/pro/watchlist", headers=headers, json={"tickers": ["CELH"], "action": "remove"})
    assert r_rem.status_code == 200
    assert "CELH" not in r_rem.json()["watchlist"]
    assert r_rem.json()["count"] == 2

    # Get synchronized watchlist
    r_get = api_client.get("/api/pro/watchlist", headers=headers)
    assert r_get.status_code == 200
    assert r_get.json()["count"] == 2
    assert "NVDA" in r_get.json()["watchlist"]

    # Clear watchlist
    r_clr = api_client.post("/api/pro/watchlist", headers=headers, json={"action": "clear"})
    assert r_clr.status_code == 200
    assert r_clr.json()["count"] == 0


def test_portfolio_doctor_validation_errors(api_client):
    """Negative entry_price, negative shares, or negative days_held return 422."""
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}

    # Negative entry price
    r1 = api_client.post(
        "/api/pro/portfolio-doctor",
        headers=headers,
        json={"positions": [{"ticker": "CELH", "entry_price": -20.0, "shares": 10}]},
    )
    assert r1.status_code == 422

    # Negative shares
    r2 = api_client.post(
        "/api/pro/portfolio-doctor",
        headers=headers,
        json={"positions": [{"ticker": "CELH", "entry_price": 20.0, "shares": -5}]},
    )
    assert r2.status_code == 422

    # Negative days held
    r3 = api_client.post(
        "/api/pro/portfolio-doctor",
        headers=headers,
        json={"positions": [{"ticker": "CELH", "entry_price": 20.0, "shares": 5, "days_held": -10}]},
    )
    assert r3.status_code == 422

