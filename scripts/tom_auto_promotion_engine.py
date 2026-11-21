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
if HQ_TEXT_DIR.exists() and str(HQ_TEXT_DIR) not in sys.path:
    sys.path.insert(0, str(HQ_TEXT_DIR))

try:
    from fandom_editor_letter_builder import (  # noqa: E402
        compose_fandom_editor_letter_md,
        validate_fandom_editor_letter,
    )
    from indexnow_delta_gate import (  # noqa: E402
        ping_websub_if_feed_changed,
        publish_daily_unique_telegraph_summary,
        submit_delta_indexnow,
    )
    from live_web_deployer import deploy_division_live, sync_remote_before_build  # noqa: E402
    from official_api_syndicator import dispatch_zero_ban_text_bundle  # noqa: E402
    HAS_HQ_TEXT_MODULES = True
except ImportError:
    HAS_HQ_TEXT_MODULES = False
    compose_fandom_editor_letter_md = None
    validate_fandom_editor_letter = None
    ping_websub_if_feed_changed = None
    publish_daily_unique_telegraph_summary = None
    submit_delta_indexnow = None
    deploy_division_live = None
    sync_remote_before_build = None
    dispatch_zero_ban_text_bundle = None

SEMI_PATH = ROOT_DIR / "static_api" / "semi_overview.json"
STOCKS_PATH = ROOT_DIR / "static_api" / "stocks_free.json"
TELEGRAPH_ACCT_PATH = ROOT_DIR / "data" / "tom_telegraph_account.json"
BACKLINKS_LOG_PATH = ROOT_DIR / "data" / "tom_external_backlinks.json"
INDEXNOW_KEY = "94e2c81f70a44d5eb63918ac4f02d715"

TOM_RETAIL_INVESTOR_THEMES = [
    {
        "slug": "daily-us-quant-regime-brief.html",
        "lead_hook": "Falling chip stocks trap dip-buyers for years—check your stock's -9% exit line free.",
        "angle_title": "Morning 3-Color Stock Safety Check & -9% Protection Floor",
    },
    {
        "slug": "smh-xlv-80-20-barbell-drawdown-study.html",
        "lead_hook": "One tech crash after 50 can erase years of hard-earned retirement gains.",
        "angle_title": "Protecting IRA & 401(k) Tech Gains With an 80:20 Semiconductor-Healthcare Cushion",
    },
    {
        "slug": "rule-1-minus-9-percent-stop-loss-math.html",
        "lead_hook": "A -50% stock loss demands a +100% rally just to get even.",
        "angle_title": "Why Retail Investors Use a Calm -9% Safety Line Instead of Hoping & Bag-Holding",
    },
    {
        "slug": "pw-rsi-right-side-breakout-methodology.html",
        "lead_hook": "Buying 'cheap' stocks in a downtrend locks up your cash for years.",
        "angle_title": "Green-Light Uptrends Only: Waiting for Real Institutional Buying Before Entering",
    },
    {
        "slug": "daily-us-quant-regime-brief.html",
        "lead_hook": "Check your top stock's Green-Yellow-Red safety signal in 10 seconds before the bell.",
        "angle_title": "8:30 AM US Market Safety Traffic Light for Individual & Retirement Investors",
    },
]


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
        f"- **Active Barbell Allocation Directive**: {semi.get('historical_study_smh_ratio', 80)}% $SMH : {semi.get('historical_study_xlv_ratio', 20)}% $XLV Contrarian Barbell",
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
    rec_smh = int(semi.get("historical_study_smh_ratio") or 80)
    rec_xlv = int(semi.get("historical_study_xlv_ratio") or 20)

    valid_stocks = [s for s in stocks if s.get("ticker") and s.get("ticker") != "LOCKED"]
    top_stocks = sorted(valid_stocks, key=lambda x: float(x.get("score") or 0), reverse=True)[:5]
    lead = top_stocks[0] if top_stocks else {"ticker": "CELH", "close": 30.04, "score": 88}
    lead_tkr = str(lead.get("ticker", "CELH")).upper()
    lead_close = float(lead.get("close") or 30.04)
    lead_stop = round(lead_close * 0.91, 2)
    lead_tp1 = round(lead_close * 2.0, 2)

    day_ord = datetime.now(timezone.utc).date().toordinal()
    theme = TOM_RETAIL_INVESTOR_THEMES[day_ord % len(TOM_RETAIL_INVESTOR_THEMES)]
    target_slug = theme["slug"]
    if not (ROOT_DIR / "frontend" / "public" / "insights" / target_slug).exists():
        target_slug = "daily-us-quant-regime-brief.html"
    canonical_url = f"https://truthofmarket.com/insights/{target_slug}"
    title = f"[US Stock Safety Brief · {as_of}] {theme['angle_title']} ($SMH {fg:.1f}/100 · {regime})"

    stock_bullets = []
    md_rows = []
    for st in top_stocks:
        t = str(st.get("ticker")).upper()
        c = float(st.get("close") or 100.0)
        sc = int(st.get("score") or 75)
        stp = round(c * 0.91, 2)
        tp1 = round(c * 2.0, 2)
        sig_badge = "🟢 Green Uptrend" if sc >= 70 else ("🟡 Yellow Watch" if sc >= 50 else "🔴 Red Caution")
        stock_bullets.append(
            {
                "tag": "li",
                "children": [
                    {"tag": "strong", "children": [f"${t} (${c:.2f} · {sig_badge}, Score {sc}/100): "]},
                    f"🔴 -9% Safety Exit Line ${stp:.2f} | 🎯 +100% Half-Profit Target ${tp1:.2f} — ",
                    {"tag": "a", "attrs": {"href": f"https://truthofmarket.com/stocks/{t.lower()}.html"}, "children": [f"Check ${t} Safety Card"]},
                ],
            }
        )
        md_rows.append(f"| **${t}** | ${c:.2f} | {sig_badge} ({sc}/100) | ${stp:.2f} | ${tp1:.2f} | [Safety Card](https://truthofmarket.com/stocks/{t.lower()}.html) |")

    nodes = [
        {
            "tag": "blockquote",
            "children": [
                f"☕ Wall Street Morning Bell Club ({as_of}): Good morning, friend—if loud chip headlines have you worrying about your 401(k) or IRA principal, take a slow sip of coffee first. We stand on your side every morning so a routine pullback never mutates into a multi-year bagholder loss."
            ],
        },
        {
            "tag": "p",
            "children": [
                f"Today's 3-Color Market Readout: Semiconductor Fear & Greed = {fg:.1f}/100 ({regime}). $SMH closed at ${smh_c:.2f} ({smh_dd:+.2f}% off 52-week high) paired with steady healthcare $XLV at ${xlv_c:.2f} ({rec_smh}% $SMH : {rec_xlv}% $XLV cushion). Today's 1-Minute Mission: write down your top stock's -9.0% safety exit line before the bell, or check it free at ",
                {"tag": "a", "attrs": {"href": canonical_url}, "children": ["Wall Street Morning Bell Daily Letter"]},
                ".",
            ],
        },
        {"tag": "ul", "children": stock_bullets},
    ]

    tg_res = publish_daily_unique_telegraph_summary(
        div_code="TOM",
        account_file=TELEGRAPH_ACCT_PATH,
        short_name="RightSideAlpha",
        author_name="Wall Street Morning Bell Club — TruthOfMarket",
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

    # Zero-Shadowban 2-Post Thread (Post #1: <=15-word B2C 3-sec hook, ZERO URLs, max 2 cashtags: $SMH and $XLV!)
    main_hook = (
        f"{theme['lead_hook']}\n\n"
        f"Chip Fear & Greed sits at {fg:.1f}/100 ({regime}); $SMH is {smh_dd:+.1f}% off highs (${smh_c:.2f}) with an {rec_smh}:{rec_xlv} $XLV cushion.\n"
        f"Top stock {lead_tkr}: ${lead_close:.2f} (safety stop ${lead_stop:.2f})."
    )[:275]

    reply_link = (
        f"☕ Read today's Wall Street Morning Bell Letter & check any US stock's -9% safety line free:\n"
        f"{canonical_url}?utm_source=social_thread&utm_medium=organic"
    )

    watchlist_table_md = (
        "| Ticker | Last Close | 3-Color Signal | 🔴 -9% Safety Line | 🎯 +100% Profit Lock | Free Check |\n"
        "|---|---|---|---|---|---|\n"
        + "\n".join(md_rows)
    )

    longform_md = compose_fandom_editor_letter_md(
        div_code="TOM",
        title=title,
        canonical_url=canonical_url,
        empathy_two_lines=[
            "Good morning, friend—if noisy Wall Street headlines had you worrying about your 401(k) or IRA nest egg last night, take a calm breath over your morning coffee first.",
            "You spent decades building your principal, and our Morning Bell Club desk sits right on your side every morning so a routine -9.0% stop-loss never turns into a painful -50% drawdown.",
        ],
        three_insights=[
            f"**Today's Market Weather ({as_of})**: Semiconductor Fear & Greed sits at `{fg:.1f}/100` (**{regime}**), with `$SMH` at `${smh_c:.2f}` (`{smh_dd:+.2f}%` off its 52-week high) balanced against healthcare `$XLV` at `${xlv_c:.2f}` (`{rec_smh}% $SMH : {rec_xlv}% $XLV` cushion).",
            "**Wait for Right-Side Confirmation (PW-RSI & MA60)**: Instead of catching falling knives in a panic, we wait until institutional volume steps back above the 20-day and 60-day trend lines (MA20 / MA60).",
            "**The Calm Math of Rule 1 (-9.0% Exit Floor)**: Exiting a failed trade at `-9.0%` takes only a routine `+9.89%` gain to recover, whereas bagholding down `-50%` demands `+100%` just to break even.",
        ],
        daily_mission=(
            f"Before the 9:30 AM opening bell, pick your #1 stock holding (or benchmark `${lead_tkr}` at `${lead_close:.2f}`, safety stop `${lead_stop:.2f}`) "
            "and jot its -9.0% safety floor on a sticky note—knowing your exit in advance lets you sleep peacefully tonight."
        ),
        gentle_bridge_lines=[
            f"**Read Today's Full Morning Bell Letter & Stamp Your Daily Check-In**: [{canonical_url}]({canonical_url})",
            "**Free 3-Second Position Doctor & 1-Field 8:30 AM Club Email**: Check any of our 72 liquid US stocks free at [https://truthofmarket.com/](https://truthofmarket.com/) — zero pressure, always free to start.",
            "**Optional Pro VIP When You're Ready**: If you ever want all 11 unmasked Top Uptrend Leaders and TradingView Pine v5 alerts, Monthly VIP ($29/mo) and Lifetime Pass ($199) are waiting quietly inside the terminal.",
        ],
        extra_body_md=watchlist_table_md,
        footer_disclaimer="*Educational quantitative research from the Wall Street Morning Bell Club (`truthofmarket.com`); not personalized financial or tax advice.*",
    )
    tom_letter_check = validate_fandom_editor_letter("TOM", longform_md)
    if not tom_letter_check["passed"]:
        raise RuntimeError(f"TOM Fandom Editor Letter validation failed: {tom_letter_check}")

    reddit_md = (
        f"# [Portfolio Risk Study] Protecting Tech/IRA Gains With a -9% Safety Floor & {rec_smh}:{rec_xlv} $SMH/$XLV Cushion ({as_of})\n\n"
        f"For fellow self-directed & retirement-account investors holding semiconductors (`$NVDA`, `$AVGO`, `$AMD`, `$SMH`), here is today's post-close risk snapshot from our 26.8-year rules-based study:\n\n"
        f"1. **Where Chip Sentiment Stands Today**: `$SMH` closed at `${smh_c:.2f}` (`{smh_dd:+.2f}%` off its 52-week high), putting our 7-factor Semiconductor Fear & Greed gauge at **{fg:.1f}/100 ({regime})**.\n"
        f"2. **Why an 80:20 Healthcare Cushion Helps You Sleep at Night**: Pairing growth chips (`$SMH`) with steady healthcare (`$XLV` at `${xlv_c:.2f}`) keeps reserve buying power ready during >20% tech pullbacks without leveraged-ETF decay.\n"
        f"3. **The -9% vs -50% Recovery Math**: A `-9.0%` exit only takes a routine `+9.89%` gain to recover, whereas holding a falling stock down `-50%` requires `+100%` just to break even.\n\n"
        f"How are other 40s–60s investors here balancing tech exposure vs capital protection heading into next week?"
    )

    substack_md = (
        f"# {title}\n\n"
        f"> **10-Second Morning Check:** Falling chip stocks trap dip-buyers for years—check any US stock's 🟢 Green / 🟡 Yellow / 🔴 -9% safety line free at [truthofmarket.com](https://truthofmarket.com/).\n\n"
        + longform_md
        + "\n### Upgrade When Ready: Full 72-Stock Signals & Pro VIP\n"
        + "- **Free 8:30 AM Safety Email & 3-Second Position Doctor**: https://truthofmarket.com/\n"
        + "- **Pro VIP ($29/mo) & Lifetime Pass ($199 — One-Time)**: Unlocks all 11 unmasked Top Uptrend Leaders, exact entry/exit alerts, and TradingView Pine v5 indicators.\n"
        + "- **Research & Partnership Desk**: `beable9489@gmail.com`\n"
    )

    tradingview_idea_md = (
        f"TITLE: $SMH Fear & Greed at {fg:.1f}/100 ({regime}) — {rec_smh}:{rec_xlv} $XLV Cushion & -9% Safety Floor ({as_of})\n\n"
        f"1. PLAIN-ENGLISH MARKET READOUT:\n"
        f"$SMH closed at ${smh_c:.2f} ({smh_dd:+.2f}% off its 52-week high), placing our 7-factor Semiconductor Fear & Greed gauge at {fg:.1f}/100 ({regime}).\n"
        f"Current capital-protection balance: {rec_smh}% $SMH / {rec_xlv}% $XLV healthcare cushion.\n\n"
        f"2. 3 CALM RULES FOR INDIVIDUAL & RETIREMENT ACCOUNTS (26.8-YEAR STUDY):\n"
        f"- Wait for a Green Uptrend: Avoid averaging down below a falling 60-day trend line.\n"
        f"- Rule 1 (-9.0% Safety Exit): A -9% stop needs only +9.89% to recover, versus +100% needed after a -50% slide.\n"
        f"- Rule 3 (+100% Half-Lock): Sell half at 2x so remaining shares ride stress-free.\n"
        f"- Top public showcase stock: ${lead_tkr} at ${lead_close:.2f} (-9% safety floor ${lead_stop:.2f} / 2x target ${lead_tp1:.2f}).\n\n"
        f"(Educational study only, not financial advice. Free 3-Color Stock Checker & 8:30 AM Alert: truthofmarket.com)\n"
    )

    syn_res = dispatch_zero_ban_text_bundle(
        div_code="TOM",
        canonical_domain="truthofmarket.com",
        canonical_url=canonical_url,
        title=title,
        summary=f"8:30 AM 3-Color US Stock Safety Brief: $SMH {fg:.1f}/100 ({regime}), {rec_smh}:{rec_xlv} $SMH:$XLV cushion & -9% exit floors.",
        main_social_hook=main_hook,
        reply_social_link=reply_link,
        longform_markdown=longform_md,
        tags=["stocks", "investing", "retirement", "semiconductors"],
        platform_extras={
            "reddit_r_algotrading_value_post.md": reddit_md,
            "substack_linkedin_newsletter_edition.md": substack_md,
            "tradingview_published_idea_script.md": tradingview_idea_md,
        },
        div_env_path=ROOT_DIR / ".env",
        dry_run=dry_run,
    )
    return tg_url, syn_res


def main():
    dry_run = "--dry-run" in sys.argv
    no_deploy = "--no-deploy" in sys.argv
    if not no_deploy and HAS_HQ_TEXT_MODULES:
        sync_remote_before_build("TOM", dry_run=dry_run)
    for k_dir in [ROOT_DIR, ROOT_DIR / "dist", ROOT_DIR / "frontend" / "public"]:
        k_dir.mkdir(parents=True, exist_ok=True)
        (k_dir / f"{INDEXNOW_KEY}.txt").write_text(INDEXNOW_KEY, encoding="utf-8")

    insights_py = ROOT_DIR / "scripts" / "generate_daily_quant_insights.py"
    build_bundle_py = ROOT_DIR / "scripts" / "build_static_bundle.py"
    if no_deploy:
        if insights_py.exists():
            subprocess.run([sys.executable, str(insights_py)], cwd=str(ROOT_DIR), check=False, capture_output=True)
            pub_ins = ROOT_DIR / "frontend" / "public" / "insights"
            for dst_ins in [ROOT_DIR / "dist" / "insights", ROOT_DIR / "insights"]:
                if pub_ins.exists():
                    dst_ins.mkdir(parents=True, exist_ok=True)
                    for html_f in pub_ins.glob("*.html"):
                        (dst_ins / html_f.name).write_text(html_f.read_text(encoding="utf-8"), encoding="utf-8")
    elif build_bundle_py.exists():
        subprocess.run([sys.executable, str(build_bundle_py)], cwd=str(ROOT_DIR), check=False, capture_output=True)

    semi = load_json(SEMI_PATH, {})
    stocks = load_json(STOCKS_PATH, [])
    as_of = update_llms_txt(semi, stocks)

    if not HAS_HQ_TEXT_MODULES:
        print(
            f"[TOM Zero-Ban v2] Standalone CI Mode | llms.txt({as_of}) & /insights/ refreshed cleanly "
            "(local HQ syndication skipped on standalone runner)."
        )
        return

    deploy_res = {"status": "SKIPPED_NO_DEPLOY"} if no_deploy else deploy_division_live("TOM", dry_run=dry_run)
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
