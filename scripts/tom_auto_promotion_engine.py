#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
1사업부/scripts/tom_auto_promotion_engine.py (v2.0 — Zero-Ban Edition)
====================================================================
RightSideAlpha × SemiFearGreed (https://truthofmarket.com) Autonomous Text & Organic Syndication Engine:
  1. [GEO / AI Search] Updates `llms.txt` across root, `dist/`, and `frontend/public/` with live $SMH/$XLV + /insights/.
  2. [Zero-Spam Daily Telegraph] Publishes MAX 1 unique institutional quant summary/day via `indexnow_delta_gate.py`.
  3. [SHA-256 Delta-Only IndexNow & WebSub] Pings ONLY modified canonical URLs across all 134+ pages (stocks + compare + insights).
  4. [Official API + Outbox Multi-Channel Syndication] Dispatches 2-step linkless-hook threads (Bluesky / Threads / X v2),
     canonical Dev.to/Hashnode markdown, and Reddit data-study kits into `text_automation_hq/outbox/YYYY-MM-DD/TOM/`.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
HQ_TEXT_DIR = ROOT_DIR.parent / "text_automation_hq"
if str(HQ_TEXT_DIR) not in sys.path:
    sys.path.insert(0, str(HQ_TEXT_DIR))

from indexnow_delta_gate import (  # noqa: E402
    ping_websub_if_feed_changed,
    publish_daily_unique_telegraph_summary,
    submit_delta_indexnow,
)
from live_web_deployer import deploy_division_live, sync_remote_before_build  # noqa: E402
from official_api_syndicator import dispatch_zero_ban_text_bundle  # noqa: E402

SEMI_PATH = ROOT_DIR / "static_api" / "semi_overview.json"
STOCKS_PATH = ROOT_DIR / "static_api" / "stocks_free.json"
TELEGRAPH_ACCT_PATH = ROOT_DIR / "data" / "tom_telegraph_account.json"
BACKLINKS_LOG_PATH = ROOT_DIR / "data" / "tom_external_backlinks.json"
INDEXNOW_KEY = "72f988bf86f141af91ab2d7cd011db47"


def load_json(path: Path, default):
    try:
        if path.exists():
            return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        pass
    return default


def update_llms_txt(semi: dict, stocks: list) -> str:
    as_of = semi.get("date", datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    fg = semi.get("fg_score", 18.0)
    regime = semi.get("regime_en", "Extreme Fear")
    smh_c = semi.get("smh_close", 463.96)
    smh_dd = semi.get("smh_dd_pct", -30.64)
    xlv_c = semi.get("xlv_close", 184.80)
    qqq_c = semi.get("qqq_close", 656.10)

    free_tickers = [s for s in stocks if s.get("ticker") and s.get("ticker") != "LOCKED"]

    lines = [
        "# RightSideAlpha × SemiFearGreed (https://truthofmarket.com)",
        "",
        "> Institutional US Equity Post-Washout Right-Side Ignition (PW-RSI) Terminal & 7-Factor Semiconductor ($SMH × $XLV) Fear & Greed Index.",
        f"> Live Daily Closing Snapshot as of {as_of} | 26.8-Year Empirical Backtest (2000–2026): PW-RSI 24.48% CAGR (349.3x vs QQQ 14.3x).",
        "",
        "## 1. Live Macro & Semiconductor Fear & Greed Snapshot",
        f"- **As of Date**: {as_of}",
        f"- **7-Factor Semiconductor Fear & Greed Score**: {fg}/100 ({regime})",
        f"- **$SMH (VanEck Semiconductor ETF)**: ${smh_c} ({smh_dd}% off 52-week high)",
        f"- **$XLV (Health Care Select Sector SPDR ETF)**: ${xlv_c}",
        f"- **$QQQ (Invesco QQQ Trust)**: ${qqq_c}",
        f"- **Active Barbell Allocation Directive**: {semi.get('recommended_smh_weight', 80)}% $SMH : {semi.get('recommended_xlv_weight', 20)}% $XLV Contrarian Barbell",
        "- **Interactive Terminal**: https://truthofmarket.com/semi-fear-greed.html",
        "- **Daily Editorial Quant Journal**: https://truthofmarket.com/insights/daily-us-quant-regime-brief.html",
        "",
        "## 2. Core Quantitative Rules & Editorial Research (/insights/)",
        "- **Methodology Deep-Dive**: https://truthofmarket.com/insights/pw-rsi-right-side-breakout-methodology.html",
        "- **$SMH:$XLV Barbell Study**: https://truthofmarket.com/insights/smh-xlv-80-20-barbell-drawdown-study.html",
        "- **Rule 1 (-9.0% Hard Stop Math)**: https://truthofmarket.com/insights/rule-1-minus-9-percent-stop-loss-math.html",
        "",
        "## 3. Live US Equity Coverage & Direct Research URLs",
        "- Main Screener & Position Doctor: https://truthofmarket.com/",
        "- Quant Insights Archive: https://truthofmarket.com/insights/index.html",
        "- Live Telegram Quant Channel: https://t.me/truthofmarketss",
    ]
    for s in free_tickers[:25]:
        t = s.get("ticker", "")
        c = s.get("close", "")
        st = round(float(c) * 0.91, 2) if isinstance(c, (int, float)) else ""
        tp = round(float(c) * 2.0, 2) if isinstance(c, (int, float)) else ""
        lines.append(
            f"- **${t} ({s.get('name', t)})**: Close ${c} | -9% Hard Stop ${st} | +100% Target ${tp} -> https://truthofmarket.com/stocks/{t.lower()}.html"
        )

    content = "\n".join(lines) + "\n"
    for target in [
        ROOT_DIR / "llms.txt",
        ROOT_DIR / "dist" / "llms.txt",
        ROOT_DIR / "frontend" / "public" / "llms.txt",
    ]:
        try:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding="utf-8")
        except Exception:
            pass
    return as_of


def build_url_to_file_map() -> dict[str, Path]:
    smap = ROOT_DIR / "sitemap.xml"
    mapping: dict[str, Path] = {}
    if not smap.exists():
        return mapping
    locs = re.findall(r"<loc>(https://truthofmarket\.com[^<]*)</loc>", smap.read_text(encoding="utf-8"))
    for u in locs:
        rel = u.replace("https://truthofmarket.com/", "").strip("/")
        fpath = (ROOT_DIR / "index.html") if not rel else (ROOT_DIR / rel)
        if fpath.exists():
            mapping[u] = fpath
    return mapping


def run_daily_telegraph_and_syndication(semi: dict, stocks: list, dry_run: bool = False) -> tuple[str, dict]:
    as_of = str(semi.get("date") or datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    fg = float(semi.get("fg_score") or 18.0)
    regime = str(semi.get("regime_en") or "Extreme Fear")
    smh_c = float(semi.get("smh_close") or 463.96)
    smh_dd = float(semi.get("smh_dd_pct") or -30.64)
    xlv_c = float(semi.get("xlv_close") or 184.80)
    rec_smh = int(semi.get("recommended_smh_weight") or 80)
    rec_xlv = int(semi.get("recommended_xlv_weight") or 20)

    valid_stocks = [s for s in stocks if s.get("ticker") and s.get("ticker") != "LOCKED"]
    top_stocks = sorted(valid_stocks, key=lambda x: float(x.get("score") or 0), reverse=True)[:5]
    lead = top_stocks[0] if top_stocks else {"ticker": "CELH", "close": 30.04, "score": 88}
    lead_tkr = str(lead.get("ticker", "CELH")).upper()
    lead_close = float(lead.get("close") or 30.04)
    lead_stop = round(lead_close * 0.91, 2)
    lead_tp1 = round(lead_close * 2.0, 2)

    canonical_url = "https://truthofmarket.com/insights/daily-us-quant-regime-brief.html"
    title = f"[US Quant Close · {as_of}] $SMH Fear & Greed at {fg:.1f}/100 ({regime}) & {rec_smh}:{rec_xlv} Barbell Audit"

    stock_bullets = []
    md_rows = []
    for st in top_stocks:
        t = str(st.get("ticker")).upper()
        c = float(st.get("close") or 100.0)
        sc = int(st.get("score") or 75)
        stp = round(c * 0.91, 2)
        tp1 = round(c * 2.0, 2)
        stock_bullets.append(
            {
                "tag": "li",
                "children": [
                    {"tag": "strong", "children": [f"${t} (${c:.2f}, PW-RSI {sc}/100): "]},
                    f"Rule 1 (-9% Hard Stop) ${stp:.2f} | Rule 3 (+100% TP1) ${tp1:.2f} — ",
                    {"tag": "a", "attrs": {"href": f"https://truthofmarket.com/stocks/{t.lower()}.html"}, "children": [f"${t} Audit"]},
                ],
            }
        )
        md_rows.append(f"| **${t}** | ${c:.2f} | {sc}/100 | ${stp:.2f} | ${tp1:.2f} | [Audit](https://truthofmarket.com/stocks/{t.lower()}.html) |")

    nodes = [
        {
            "tag": "blockquote",
            "children": [
                f"Post-Close Readout ({as_of}): Semiconductor Fear & Greed = {fg:.1f}/100 ({regime}). $SMH closed at ${smh_c:.2f} ({smh_dd:+.2f}% 52W DD) vs $XLV at ${xlv_c:.2f}. Active Contrarian Barbell: {rec_smh}% $SMH : {rec_xlv}% $XLV."
            ],
        },
        {
            "tag": "p",
            "children": [
                "Buying falling knives below a declining 60-day moving average traps capital for years, while cutting losers mechanically at -9.0% keeps single-trade drawdowns recoverable with a routine +9.89% gain. Read the full post-close dispatch at ",
                {"tag": "a", "attrs": {"href": canonical_url}, "children": ["RightSideAlpha Daily Quant Regime Brief"]},
                ".",
            ],
        },
        {"tag": "ul", "children": stock_bullets},
    ]

    tg_res = publish_daily_unique_telegraph_summary(
        div_code="TOM",
        account_file=TELEGRAPH_ACCT_PATH,
        short_name="RightSideAlpha",
        author_name="RightSideAlpha Quant Desk",
        author_url="https://truthofmarket.com",
        title=title,
        content_nodes=nodes,
        canonical_url=canonical_url,
        dry_run=dry_run,
    )

    registry = load_json(BACKLINKS_LOG_PATH, [])
    tg_url = tg_res.get("url", "")
    if tg_res.get("status") == "PUBLISHED" and tg_url:
        registry.append(
            {
                "date": as_of,
                "url": tg_url,
                "quality": "v3_zero_ban_daily",
                "ts": datetime.now(timezone.utc).isoformat(),
            }
        )
        BACKLINKS_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        BACKLINKS_LOG_PATH.write_text(json.dumps(registry[-90:], indent=2), encoding="utf-8")
    elif not tg_url and registry:
        tg_url = registry[-1].get("url", "")

    # Zero-Shadowban 2-Post Thread (Post #1: <=15-word B2C 3-sec hook, ZERO URLs, max 2 cashtags!)
    main_hook = (
        f"Falling chip stocks trap dip-buyers for years—check your stock's -9% exit line free.\n\n"
        f"Semi Fear & Greed sits at {fg:.1f}/100 ({regime}); $SMH is {smh_dd:+.1f}% off highs (${smh_c:.2f}) with {rec_smh}:{rec_xlv} $XLV barbell.\n"
        f"Leader {lead_tkr}: ${lead_close:.2f} (stop ${lead_stop:.2f} / target ${lead_tp1:.2f})."
    )[:275]

    reply_link = (
        f"Check any US ticker's -9% stop line & 72-stock regime table free in 3 seconds:\n"
        f"{canonical_url}?utm_source=social_thread&utm_medium=organic"
    )

    longform_md = (
        f"# {title}\n\n"
        f"*Originally published at [{canonical_url}]({canonical_url}).*\n\n"
        f"Most retail drawdowns happen in two predictable stages: averaging down below a falling 60-day moving average, "
        f"and holding losers past -25% where math turns asymmetric (-50% requires +100% just to break even).\n\n"
        f"## 1. Semiconductor Fear & Greed Snapshot ({as_of})\n"
        f"- **Composite Score**: `{fg:.1f}/100` ({regime})\n"
        f"- **$SMH Close**: `${smh_c:.2f}` ({smh_dd:+.2f}% from 52W High)\n"
        f"- **$XLV Close**: `${xlv_c:.2f}`\n"
        f"- **Active Allocation**: `{rec_smh}% $SMH : {rec_xlv}% $XLV` ([Interactive Backtest](https://truthofmarket.com/semi-fear-greed.html))\n\n"
        f"## 2. Public PW-RSI Watchlist & -9.0% Risk Floors\n"
        f"| Ticker | Close | PW-RSI | -9% Hard Stop | +100% TP1 | Terminal |\n"
        f"|---|---|---|---|---|---|\n"
        + "\n".join(md_rows)
        + "\n\n---\n*Educational quantitative research only; not personalized financial advice.*\n"
    )

    reddit_md = (
        f"# [Quant Data] Semiconductor Fear & Greed ({fg:.1f}/100) vs $SMH:$XLV 80:20 Rebalancing Study ({as_of})\n\n"
        f"Sharing today's systematic regime readout from our 26.8-year post-washout tracking model:\n\n"
        f"1. **Current Regime**: $SMH closed at ${smh_c:.2f} ({smh_dd:+.2f}% off its 52W high), placing the 7-factor Semi Fear & Greed score at **{fg:.1f}/100 ({regime})**.\n"
        f"2. **Why Barbell Beats Cash Drag**: Pairing high-beta semis with defensive healthcare ($XLV at ${xlv_c:.2f}) provides non-correlated dry powder to rotate 10% into deep washouts (>20% DD) without suffering 3x leveraged ETF volatility decay.\n"
        f"3. **Single-Name Risk Rule**: Every equity entry uses a hard -9.0% stop from cost basis (-9% needs +9.89% to recover vs +100% needed after -50%) and a 55-day +8% time stop.\n\n"
        f"Curious how other systematic swing traders here handle sector-specific drawdown thresholds vs broad index VIX filters?"
    )

    syn_res = dispatch_zero_ban_text_bundle(
        div_code="TOM",
        canonical_domain="truthofmarket.com",
        canonical_url=canonical_url,
        title=title,
        summary=f"$SMH Fear & Greed at {fg:.1f}/100 ({regime}); {rec_smh}:{rec_xlv} $SMH:$XLV barbell & PW-RSI watchlist.",
        main_social_hook=main_hook,
        reply_social_link=reply_link,
        longform_markdown=longform_md,
        tags=["quant", "stocks", "investing", "datascience"],
        platform_extras={"reddit_r_algotrading_value_post.md": reddit_md},
        div_env_path=ROOT_DIR / ".env",
        dry_run=dry_run,
    )
    return tg_url, syn_res


def main():
    dry_run = "--dry-run" in sys.argv
    sync_remote_before_build("TOM", dry_run=dry_run)
    for k_dir in [ROOT_DIR, ROOT_DIR / "dist", ROOT_DIR / "frontend" / "public"]:
        k_dir.mkdir(parents=True, exist_ok=True)
        (k_dir / f"{INDEXNOW_KEY}.txt").write_text(INDEXNOW_KEY, encoding="utf-8")

    build_bundle_py = ROOT_DIR / "scripts" / "build_static_bundle.py"
    if build_bundle_py.exists():
        subprocess.run([sys.executable, str(build_bundle_py)], cwd=str(ROOT_DIR), check=False, capture_output=True)

    semi = load_json(SEMI_PATH, {})
    stocks = load_json(STOCKS_PATH, [])
    as_of = update_llms_txt(semi, stocks)

    deploy_res = deploy_division_live("TOM", dry_run=dry_run)
    tg_url, syn_res = run_daily_telegraph_and_syndication(semi, stocks, dry_run=dry_run)

    url_map = build_url_to_file_map()
    idx_res = submit_delta_indexnow(
        div_code="TOM",
        host="truthofmarket.com",
        key=INDEXNOW_KEY,
        url_to_filepath=url_map,
        dry_run=dry_run,
    )
    ws_rss = (
        {"status": "DRY_RUN"}
        if dry_run
        else ping_websub_if_feed_changed("TOM", "https://truthofmarket.com/rss.xml", ROOT_DIR / "rss.xml")
    )
    ws_feed = (
        {"status": "DRY_RUN"}
        if dry_run
        else ping_websub_if_feed_changed("TOM", "https://truthofmarket.com/feed.xml", ROOT_DIR / "feed.xml")
    )

    print(
        f"[TOM Zero-Ban v2] Deploy={deploy_res.get('status')} | llms.txt({as_of}) | Telegraph={tg_url or 'daily-cap'} | "
        f"IndexNow={idx_res.get('status')}({idx_res.get('submitted_count', 0)}/{len(url_map)} URLs) | "
        f"WebSub={ws_rss.get('status')}/{ws_feed.get('status')} | Syndication={syn_res.get('status')}"
    )


if __name__ == "__main__":
    main()
