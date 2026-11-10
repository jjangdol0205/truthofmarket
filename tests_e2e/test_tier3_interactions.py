"""
tests_e2e/test_tier3_interactions.py - Tier 3: Cross-Feature Interactions E2E Test Suite

Covers pairwise feature interplay:
1. Public Masking -> License Validation -> Authenticated Unmasked Leaderboard
2. License Validation -> Unlocks Pro Vault & TradingView Pine Script v5
3. Live Stock Pricing Data -> Feeds into Position Doctor Diagnostics
4. Affiliate Configuration Update -> Dynamic Referral Deep Link Generation
5. Outbound Referral Click Redirect -> Analytics Tracking Counter Increment
6. Research Brief Ticker -> Validates against Screener Universe
7. Query Parameter Authentication Mode (?license_key=PRO-DEMO-2026)
Total: 7 Pairwise Interaction Test Cases
"""

import csv
import io
from pathlib import Path
import re
import pytest


def test_t3_pairwise_unauthenticated_masked_then_authenticated_unmasked(client):
    """
    Interaction 1:
    1. Unauthenticated request to /api/stocks receives masked target prices on rows >= 4.
    2. Validates PRO-DEMO-2026 license via /api/auth/validate.
    3. Authenticated request with Bearer token receives fully unmasked data for all rows.
    """
    # Step 1: Unauthenticated request
    free_resp = client.get("/api/stocks")
    assert free_resp.status_code == 200
    free_stocks = free_resp.json()
    assert len(free_stocks) >= 5
    assert free_stocks[4]["is_pro_locked"] is True
    assert free_stocks[4]["stop_loss_price"] is None
    assert free_stocks[4]["tp1_2x_price"] is None

    # Step 2: Validate license
    auth_resp = client.post("/api/auth/validate", json={"license_key": "PRO-DEMO-2026"})
    assert auth_resp.status_code == 200
    assert auth_resp.json().get("valid") is True

    # Step 3: Authenticated request with Bearer token
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}
    pro_resp = client.get("/api/stocks", headers=headers)
    assert pro_resp.status_code == 200
    pro_stocks = pro_resp.json()

    # Verify rows 4+ are now completely unmasked
    for i in range(len(pro_stocks)):
        assert pro_stocks[i]["is_pro_locked"] is False
        assert pro_stocks[i]["stop_loss_price"] is not None
        assert pro_stocks[i]["tp1_2x_price"] is not None
        assert pro_stocks[i]["stop_loss_price"] > 0
        assert pro_stocks[i]["tp1_2x_price"] > pro_stocks[i]["close"]


def test_t3_pairwise_license_validation_unlocks_pro_vault_and_pinescript(client):
    """
    Interaction 2:
    1. Accessing /api/pro/vault and /api/pro/pinescript without auth is blocked (401).
    2. Submitting PRO-DEMO-2026 token grants access to Pro Vault and Pine Script v5 code.
    """
    # Step 1: Blocked without auth
    v_unauth = client.get("/api/pro/vault")
    assert v_unauth.status_code in [401, 403]

    p_unauth = client.get("/api/pro/pinescript")
    assert p_unauth.status_code in [401, 403]

    # Step 2: Unlocked with Bearer token
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}
    v_auth = client.get("/api/pro/vault", headers=headers)
    assert v_auth.status_code == 200
    assert v_auth.json().get("unlocked") is True
    assert "pine_script_available" in v_auth.json()

    p_auth = client.get("/api/pro/pinescript", headers=headers)
    assert p_auth.status_code == 200
    pine_data = p_auth.json()
    assert pine_data.get("version") == "v5"
    assert "//@version=5" in pine_data.get("code", "")
    assert "RightSideAlpha" in pine_data.get("code", "")


def test_t3_pairwise_stock_data_feeds_position_doctor_underwater_exit(client):
    """
    Interaction 3:
    1. Fetch real stock detail for CELH to capture current market price.
    2. Simulate investor who entered CELH earlier at $35.00 (underwater).
    3. Run Position Doctor using real price: verifies -9% hard stop loss triggers.
    """
    stock_resp = client.get("/api/stocks/CELH")
    assert stock_resp.status_code == 200
    celh = stock_resp.json()
    current_price = celh["close"]

    # Entry at 35.00 when current is ~27.35 -> return ~ -21.8%
    entry_price = 35.00
    expected_return = round(((current_price - entry_price) / entry_price) * 100.0, 2)

    doc_payload = {
        "ticker": "CELH",
        "entry_price": entry_price,
        "days_held": 45,
        "current_price": current_price,
    }
    doc_resp = client.post("/api/pro/position-doctor", json=doc_payload)
    assert doc_resp.status_code == 200
    doc_result = doc_resp.json()

    assert doc_result.get("ticker") == "CELH"
    assert doc_result.get("status_code") == "HARD_STOP"
    assert doc_result.get("is_critical") is True
    assert abs(doc_result.get("return_pct") - expected_return) < 0.2
    assert "Exit immediately" in doc_result.get("action_plan", "")


def test_t3_pairwise_affiliate_config_update_alters_built_referral_links(client):
    """
    Interaction 4:
    1. Update affiliate configuration via POST /api/referral/config.
    2. Generate referral link for TradingView.
    3. Verify generated link incorporates the custom affiliate ID.
    """
    custom_aff = "custom_quant_partner_99"
    update_payload = {
        "tradingview_aff_id": custom_aff,
        "seekingalpha_source": "custom_sa_source",
        "trendspider_aff_id": "custom_ts_id",
    }
    up_resp = client.post("/api/referral/config", json=update_payload)
    assert up_resp.status_code == 200

    build_resp = client.get("/api/referral/build?provider=tradingview&ticker=NVDA")
    assert build_resp.status_code == 200
    built_url = build_resp.json().get("url", "")
    assert f"aff_id={custom_aff}" in built_url


def test_t3_pairwise_referral_click_redirect_increments_provider_counter(client):
    """
    Interaction 5:
    1. Read initial referral statistics for Seeking Alpha.
    2. Perform outbound 307 redirect request for Seeking Alpha.
    3. Verify Seeking Alpha click count specifically incremented.
    """
    initial_stats = client.get("/api/referral/stats").json()
    sa_clicks_before = initial_stats.get("seekingalpha", 0)

    # Perform redirect
    redir_resp = client.get("/api/referral/redirect/seekingalpha?ticker=CELH")
    assert redir_resp.status_code in [307, 302]

    # Verify counter
    new_stats = client.get("/api/referral/stats").json()
    assert new_stats.get("seekingalpha", 0) == sa_clicks_before + 1


def test_t3_pairwise_research_brief_validates_stock_ignition_zone(client):
    """
    Interaction 6:
    1. Retrieve research brief for MBLY.
    2. Cross-reference MBLY in stock leaderboard /api/stocks/MBLY.
    3. Verify stock is categorized in an actionable technical zone.
    """
    brief_resp = client.get("/api/research/MBLY")
    assert brief_resp.status_code == 200
    brief_content = brief_resp.json().get("content", "")

    stock_resp = client.get("/api/stocks/MBLY")
    assert stock_resp.status_code == 200
    stock_data = stock_resp.json()

    assert stock_data.get("ticker") == "MBLY"
    assert stock_data.get("close") > 0
    assert stock_data.get("zone_code") in ["IGNITION_ZONE", "WASHOUT_WATCH", "LEFT_SIDE_KNIFE"]
    assert "MBLY" in brief_content


def test_t3_pairwise_query_param_auth_unmasks_stocks(client):
    """
    Interaction 7:
    Verify that query parameter ?license_key=PRO-DEMO-2026 also unmasks stocks
    for frictionless integration with frontend URL triggers.
    """
    resp = client.get("/api/stocks?license_key=PRO-DEMO-2026")
    assert resp.status_code == 200
    stocks = resp.json()
    assert len(stocks) >= 5
    assert stocks[4]["is_pro_locked"] is False
    assert stocks[4]["stop_loss_price"] is not None


def test_t3_pairwise_vip_watchlist_lifecycle_and_export(client):
    """
    Interaction 8:
    1. Authenticate with Bearer PRO-DEMO-2026.
    2. Set synchronized watchlist tickers to ['NVDA', 'CELH'].
    3. Add 'TSLA' via action='add'.
    4. Remove 'CELH' via action='remove'.
    5. Query GET /api/pro/watchlist to verify state is ['NVDA', 'TSLA'].
    6. Verify CSV export generation with standard screener fields.
    7. Clear watchlist with action='clear'.
    """
    headers = {"Authorization": "Bearer PRO-DEMO-2026"}

    # Step 1: Set initial watchlist
    r_set = client.post(
        "/api/pro/watchlist",
        headers=headers,
        json={"tickers": ["NVDA", "CELH"], "action": "set"},
    )
    assert r_set.status_code == 200
    assert r_set.json()["count"] == 2
    assert "NVDA" in r_set.json()["watchlist"]
    assert "CELH" in r_set.json()["watchlist"]

    # Step 2: Add ticker
    r_add = client.post(
        "/api/pro/watchlist",
        headers=headers,
        json={"tickers": ["TSLA"], "action": "add"},
    )
    assert r_add.status_code == 200
    assert r_add.json()["count"] == 3
    assert "TSLA" in r_add.json()["watchlist"]

    # Step 3: Remove ticker
    r_rem = client.post(
        "/api/pro/watchlist",
        headers=headers,
        json={"tickers": ["CELH"], "action": "remove"},
    )
    assert r_rem.status_code == 200
    assert r_rem.json()["count"] == 2
    assert "CELH" not in r_rem.json()["watchlist"]

    # Step 4: Get synchronized watchlist
    r_get = client.get("/api/pro/watchlist", headers=headers)
    assert r_get.status_code == 200
    active_watchlist = r_get.json()["watchlist"]
    assert len(active_watchlist) == 2
    assert "NVDA" in active_watchlist
    assert "TSLA" in active_watchlist

    # Step 5: Verify CSV Export Structure
    # Retrieve unmasked stock metrics for active watchlist items
    r_stocks = client.get("/api/stocks", headers=headers)
    assert r_stocks.status_code == 200
    stocks_dict = {s["ticker"]: s for s in r_stocks.json()}

    # Construct standard Watchlist CSV export
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Ticker", "Name", "Close", "Zone", "Score", "StopLoss", "TP1_2X"])

    for ticker in active_watchlist:
        assert ticker in stocks_dict, f"Watchlist ticker {ticker} not found in universe"
        s = stocks_dict[ticker]
        writer.writerow([
            s["ticker"],
            s.get("name", s["ticker"]),
            f"{s['close']:.2f}",
            s.get("zone_code", "N/A"),
            f"{s.get('score', 0):.1f}",
            f"{s.get('stop_loss_price', 0):.2f}",
            f"{s.get('tp1_2x_price', 0):.2f}",
        ])

    csv_text = output.getvalue()
    lines = [ln.strip() for ln in csv_text.strip().split("\n") if ln.strip()]
    assert len(lines) == 3  # Header + 2 data rows
    assert lines[0] == "Ticker,Name,Close,Zone,Score,StopLoss,TP1_2X"
    assert "NVDA" in csv_text
    assert "TSLA" in csv_text
    assert "undefined" not in csv_text.lower()
    assert "nan" not in csv_text.lower()

    # Step 6: Clear watchlist
    r_clr = client.post("/api/pro/watchlist", headers=headers, json={"action": "clear"})
    assert r_clr.status_code == 200
    assert r_clr.json()["count"] == 0


def test_t3_lemonsqueezy_store_296100_invariants_preserved():
    """
    Interaction 9:
    Explicitly verifies that Lemon Squeezy Store #296100 Live Mode checkout links
    and overlay embed parameter are preserved intact across source and bundles:
    - Monthly VIP ($29/mo): bad98d00-7175-41f6-9d58-eeb2471d0da4
    - Lifetime VIP ($199): 00c9f6e1-c8be-42a4-b5a5-e05af1a41ed9
    - In-page checkout overlay: embed=1
    """
    project_root = Path(__file__).resolve().parent.parent

    monthly_uuid = "bad98d00-7175-41f6-9d58-eeb2471d0da4"
    lifetime_uuid = "00c9f6e1-c8be-42a4-b5a5-e05af1a41ed9"

    # 1. Source verification: frontend/src/components/Pricing.js
    pricing_js = (project_root / "frontend" / "src" / "components" / "Pricing.js").read_text(encoding="utf-8")
    assert monthly_uuid in pricing_js, "Monthly VIP UUID missing in Pricing.js"
    assert lifetime_uuid in pricing_js, "Lifetime VIP UUID missing in Pricing.js"
    assert "truthofmarket.lemonsqueezy.com/checkout/buy" in pricing_js

    # 2. Source verification: frontend/src/components/Modals.js
    modals_js = (project_root / "frontend" / "src" / "components" / "Modals.js").read_text(encoding="utf-8")
    assert monthly_uuid in modals_js, "Monthly VIP UUID missing in Modals.js"
    assert lifetime_uuid in modals_js, "Lifetime VIP UUID missing in Modals.js"
    assert "embed=1" in modals_js, "embed=1 parameter missing in Modals.js"

    # 3. Source verification: frontend/src/components/StockTable.js
    stock_table_js = (project_root / "frontend" / "src" / "components" / "StockTable.js").read_text(encoding="utf-8")
    assert monthly_uuid in stock_table_js, "Monthly VIP UUID missing in StockTable.js"
    assert "embed=1" in stock_table_js, "embed=1 parameter missing in StockTable.js"

    # 4. Source verification: frontend/src/services/api.js
    api_js = (project_root / "frontend" / "src" / "services" / "api.js").read_text(encoding="utf-8")
    assert monthly_uuid in api_js, "Monthly VIP UUID missing in api.js"

    # 5. Production bundle verification: active bundle referenced by index.html across assets/, dist/assets/, frontend/dist/assets/
    index_html_content = (project_root / "index.html").read_text(encoding="utf-8")
    js_match = re.search(r'assets/(index-[A-Za-z0-9_-]+\.js)', index_html_content)
    assert js_match, "Active JS bundle not found in index.html"
    active_bundle_name = js_match.group(1)

    bundle_dirs = [
        project_root / "assets",
        project_root / "dist" / "assets",
        project_root / "frontend" / "dist" / "assets",
    ]
    for b_dir in bundle_dirs:
        assert b_dir.exists(), f"Bundle directory missing: {b_dir}"
        js_file = b_dir / active_bundle_name
        assert js_file.exists(), f"Active bundle {active_bundle_name} missing in {b_dir}"
        js_content = js_file.read_text(encoding="utf-8")
        assert monthly_uuid in js_content, f"Monthly VIP UUID missing in {js_file}"
        assert lifetime_uuid in js_content, f"Lifetime VIP UUID missing in {js_file}"
        assert "embed=1" in js_content, f"embed=1 parameter missing in {js_file}"

    # 6. HTML shells verification: index.html & dist/index.html & frontend/dist/index.html
    html_targets = [
        project_root / "index.html",
        project_root / "dist" / "index.html",
        project_root / "frontend" / "dist" / "index.html",
    ]
    for html_file in html_targets:
        assert html_file.exists(), f"Target HTML file missing: {html_file}"
        content = html_file.read_text(encoding="utf-8")
        assert "assets.lemonsqueezy.com/lemon.js" in content, f"Missing lemon.js in {html_file.name}"
        assert active_bundle_name in content, f"Missing {active_bundle_name} script link in {html_file.name}"



