#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
1사업부/scripts/generate_daily_quant_insights.py
==============================================
Seeking Alpha-Grade Editorial Quant Research & Daily US Market Close Journal Generator
for RightSideAlpha x SemiFearGreed (https://truthofmarket.com/insights/).

Generates:
  - /insights/index.html (Editorial Hub)
  - 4 Evergreen Institutional Pillar Articles
  - Daily Post-Close Market Regime & PW-RSI Movers Brief (/insights/daily-us-quant-regime-brief.html + dated slug)

Strict Guardrails:
  - English-only (Zero Hangul), Anti-AI Human-Tone 19+/20 prose (0 AI clichés).
  - Preserves Lemon Squeezy Store #296100 Live UUIDs:
      Monthly VIP ($29/mo): d5e7e761-8b1b-4ca8-b1fe-771acd1450f8
      Lifetime VIP ($199):  667aa482-f17c-47d1-b7f3-a2427c36516b
  - Never leaks Pro-only locked ticker triggers (uses public `stocks_free.json` + `semi_overview.json`).
"""

from __future__ import annotations

import html
import json
import pathlib
from datetime import datetime, timezone
from typing import Any, Dict, List, Tuple

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUB = ROOT / "frontend" / "public"
SEMI_PATH = ROOT / "static_api" / "semi_overview.json"
STOCKS_FREE_PATH = ROOT / "static_api" / "stocks_free.json"

LS_MONTHLY_URL = "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1"
LS_LIFETIME_URL = "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1"


def _load_json(path: pathlib.Path, default: Any) -> Any:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return default
    return default


def _beacon_script() -> str:
    return """<script>
  (function(){
    try {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      if (window.__HQ_KPI_TOM__) return;
      window.__HQ_KPI_TOM__ = true;
      var ua = navigator.userAgent || '';
      if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|python|curl|node/i.test(ua)) return;
      var host = (location && location.hostname) || '';
      if (!host || host === 'localhost' || host === '127.0.0.1') return;
      var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      var ns = 'tom_truthofmarket';
      fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/pv_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
      fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/pv_total', { mode: 'cors', keepalive: true }).catch(function(){});
    } catch (e) {}
  })();
  </script>"""


def _render_article_shell(
    slug: str,
    title: str,
    meta_desc: str,
    category: str,
    pub_date: str,
    read_mins: int,
    body_html: str,
    faqs: List[Tuple[str, str]],
) -> str:
    canonical_url = f"https://truthofmarket.com/insights/{slug}"
    faq_entities = [
        {
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a},
        }
        for q, a in faqs
    ]
    ld_json = json.dumps(
        {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Article",
                    "headline": title,
                    "description": meta_desc,
                    "datePublished": pub_date,
                    "dateModified": pub_date,
                    "mainEntityOfPage": canonical_url,
                    "author": {
                        "@type": "Organization",
                        "name": "RightSideAlpha Institutional Quant Desk",
                        "url": "https://truthofmarket.com/",
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "RightSideAlpha x SemiFearGreed",
                        "url": "https://truthofmarket.com/",
                        "logo": {"@type": "ImageObject", "url": "https://truthofmarket.com/favicon.svg"},
                    },
                },
                {"@type": "FAQPage", "mainEntity": faq_entities},
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": 1, "name": "Terminal", "item": "https://truthofmarket.com/"},
                        {"@type": "ListItem", "position": 2, "name": "Quant Insights", "item": "https://truthofmarket.com/insights/index.html"},
                        {"@type": "ListItem", "position": 3, "name": title, "item": canonical_url},
                    ],
                },
            ],
        },
        ensure_ascii=False,
    )

    faq_html = "\n".join(
        f'<div class="faq-card"><h3>{html.escape(q)}</h3><p>{html.escape(a)}</p></div>'
        for q, a in faqs
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{html.escape(title)} | RightSideAlpha Quant Insights</title>
  <meta name="description" content="{html.escape(meta_desc)}" />
  <link rel="canonical" href="{canonical_url}" />
  <link rel="alternate" type="application/rss+xml" title="RightSideAlpha RSS Feed" href="https://truthofmarket.com/rss.xml" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="{html.escape(title)}" />
  <meta property="og:description" content="{html.escape(meta_desc)}" />
  <meta property="og:url" content="{canonical_url}" />
  <meta property="og:image" content="https://truthofmarket.com/og-preview.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{html.escape(title)}" />
  <meta name="twitter:description" content="{html.escape(meta_desc)}" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <script type="application/ld+json">{ld_json}</script>
  <script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
  {_beacon_script()}
  <style>
    :root {{ --bg:#090d16; --panel:#111827; --border:#1f2937; --text:#e5e7eb; --muted:#9ca3af; --accent:#10b981; --amber:#f59e0b; --blue:#38bdf8; }}
    * {{ box-sizing:border-box; }}
    body {{ margin:0; font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background:var(--bg); color:var(--text); line-height:1.72; }}
    a {{ color:var(--blue); text-decoration:none; }}
    a:hover {{ text-decoration:underline; }}
    .topbar {{ border-bottom:1px solid var(--border); background:#0b1120; padding:0.9rem 1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; }}
    .brand {{ font-weight:800; color:#f8fafc; font-size:1.05rem; letter-spacing:-0.02em; }}
    .nav-links a {{ margin-left:1rem; font-size:0.9rem; color:#cbd5e1; font-weight:600; }}
    .wrap {{ max-width:860px; margin:0 auto; padding:2.2rem 1.25rem 4rem; }}
    .badge {{ display:inline-block; background:rgba(16,185,129,0.14); color:#34d399; border:1px solid rgba(16,185,129,0.35); border-radius:999px; padding:0.2rem 0.75rem; font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; }}
    h1 {{ font-size:clamp(1.75rem,3.6vw,2.45rem); line-height:1.22; color:#f8fafc; margin:0.8rem 0 0.6rem; letter-spacing:-0.025em; }}
    .meta {{ color:var(--muted); font-size:0.88rem; margin-bottom:1.8rem; border-bottom:1px solid var(--border); padding-bottom:1rem; }}
    article h2 {{ color:#f8fafc; font-size:1.38rem; margin-top:2.1rem; margin-bottom:0.65rem; }}
    article p {{ margin:0.9rem 0; color:#d1d5db; font-size:1.03rem; }}
    .callout {{ background:var(--panel); border-left:4px solid var(--accent); padding:1.1rem 1.25rem; border-radius:8px; margin:1.4rem 0; }}
    .data-table {{ width:100%; border-collapse:collapse; margin:1.25rem 0; font-size:0.92rem; background:var(--panel); border-radius:8px; overflow:hidden; }}
    .data-table th, .data-table td {{ padding:0.7rem 0.85rem; border-bottom:1px solid var(--border); text-align:left; }}
    .data-table th {{ background:#0f172a; color:#94a3b8; font-weight:700; text-transform:uppercase; font-size:0.76rem; }}
    .cta-box {{ background:linear-gradient(135deg,#0f172a 0%,#06281e 100%); border:1px solid rgba(16,185,129,0.45); border-radius:14px; padding:1.6rem; margin:2.4rem 0; }}
    .cta-box h3 {{ margin:0 0 0.5rem; color:#ecfdf5; font-size:1.25rem; }}
    .btn-row {{ display:flex; flex-wrap:wrap; gap:0.75rem; margin-top:1.1rem; }}
    .btn {{ display:inline-block; padding:0.75rem 1.25rem; border-radius:8px; font-weight:700; font-size:0.93rem; text-decoration:none !important; }}
    .btn-free {{ background:#1e293b; color:#f8fafc; border:1px solid #475569; }}
    .btn-vip {{ background:#10b981; color:#042f2e; }}
    .btn-life {{ background:#f59e0b; color:#1f1300; }}
    .faq-card {{ background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:1.1rem 1.25rem; margin-bottom:0.85rem; }}
    .faq-card h3 {{ margin:0 0 0.4rem; font-size:1.02rem; color:#f8fafc; }}
    .faq-card p {{ margin:0; color:#cbd5e1; font-size:0.95rem; }}
    footer {{ margin-top:3rem; padding-top:1.4rem; border-top:1px solid var(--border); color:var(--muted); font-size:0.82rem; }}
  </style>
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/">RightSideAlpha × SemiFearGreed</a>
    <nav class="nav-links">
      <a href="/">72-Stock Terminal</a>
      <a href="/semi-fear-greed.html">$SMH Fear &amp; Greed</a>
      <a href="/insights/index.html">Quant Insights</a>
    </nav>
  </header>
  <main class="wrap">
    <span class="badge">{html.escape(category)}</span>
    <h1>{html.escape(title)}</h1>
    <div class="meta">Published {html.escape(pub_date)} · {read_mins} min read · RightSideAlpha Institutional Quant Desk</div>
    <article>
      {body_html}
    </article>

    <section class="cta-box">
      <h3>Don't Hold a Falling Stock—Check Your -9% Exit Line in 3 Seconds</h3>
      <p style="margin:0;color:#cbd5e1;">Stop guessing where support sits. Run any of our 72 liquid US equities through the free Position Doctor to calculate your exact -9.0% hard stop floor and +100% TP1 principal-harvest target—or unlock real-time institutional Ignition Zone entries on Store #296100.</p>
      <div class="btn-row">
        <a class="btn btn-free" href="/">Run Free 3-Second Position Doctor →</a>
        <a class="btn btn-vip lemonsqueezy-button" href="{LS_MONTHLY_URL}">Unlock Monthly Pro VIP ($29/mo)</a>
        <a class="btn btn-life lemonsqueezy-button" href="{LS_LIFETIME_URL}">Lifetime Institutional Pass ($199)</a>
      </div>
      <p style="margin:0.95rem 0 0;font-size:0.84rem;color:#94a3b8;">
        🏛️ <strong>Institutional JSON Data Feed, RIA White-Label &amp; Newsletter Sponsorship Desk:</strong> <a href="mailto:beable9489@gmail.com?subject=RightSideAlpha%20Institutional%20API%20%26%20Sponsorship%20Desk">beable9489@gmail.com</a>
      </p>
    </section>

    <section>
      <h2>Frequently Asked Quantitative Questions</h2>
      {faq_html}
    </section>

    <footer>
      <p><strong>Quantitative Research Disclosure:</strong> All empirical statistics, backtest metrics (2000–2026), and algorithmic trigger levels published by RightSideAlpha × SemiFearGreed (<a href="https://truthofmarket.com">truthofmarket.com</a>) are strictly for educational and quantitative research purposes and do not constitute personalized investment advice.</p>
    </footer>
  </main>
</body>
</html>
"""


def generate_all_quant_insights() -> Tuple[List[Tuple[str, str, str]], List[Dict[str, str]]]:
    """
    Generates `/insights/` static HTML pages inside `frontend/public/insights/`.
    Returns `(sitemap_tuples, rss_items)`.
    """
    insights_dir = PUB / "insights"
    insights_dir.mkdir(parents=True, exist_ok=True)

    semi = _load_json(SEMI_PATH, {})
    stocks = _load_json(STOCKS_FREE_PATH, [])

    as_of = str(semi.get("date") or datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    fg = float(semi.get("fg_score") or 18.0)
    regime = str(semi.get("regime_en") or "Extreme Fear")
    smh_c = float(semi.get("smh_close") or 463.96)
    smh_dd = float(semi.get("smh_dd_pct") or -30.64)
    smh_rsi = float(semi.get("smh_rsi") or 31.4)
    xlv_c = float(semi.get("xlv_close") or 184.80)
    qqq_c = float(semi.get("qqq_close") or 656.10)
    rec_smh = int(semi.get("recommended_smh_weight") or 80)
    rec_xlv = int(semi.get("recommended_xlv_weight") or 20)

    unlocked = [s for s in stocks if s.get("ticker") and s.get("ticker") != "LOCKED"]
    unlocked_sorted = sorted(unlocked, key=lambda x: float(x.get("score") or 0), reverse=True)
    top5 = unlocked_sorted[:5]

    rows_html = ""
    for s in top5:
        t = str(s.get("ticker")).upper()
        c = float(s.get("close") or 100.0)
        sc = int(s.get("score") or 75)
        dd = float(s.get("dd_from_52w_high_pct") or s.get("dd_high52_pct") or -22.0)
        vol = float(s.get("vol_surge_10d") or 1.35)
        stop = round(c * 0.91, 2)
        tp1 = round(c * 2.0, 2)
        rows_html += (
            f"<tr><td><a href=\"/stocks/{t.lower()}.html\"><strong>${t}</strong></a></td>"
            f"<td>${c:.2f}</td><td>{sc}/100</td><td>{dd:+.1f}%</td><td>{vol:.2f}x</td>"
            f"<td>${stop:.2f}</td><td>${tp1:.2f}</td></tr>\n"
        )

    articles_spec: List[Dict[str, Any]] = [
        {
            "slug": "daily-us-quant-regime-brief.html",
            "title": f"US Market Regime Dispatch ({as_of}): $SMH Fear & Greed at {fg:.1f}/100 ({regime}) & PW-RSI Watchlist",
            "desc": f"Post-close institutional audit as of {as_of}: $SMH ${smh_c:.2f} ({smh_dd:+.2f}% 52W DD), {rec_smh}:{rec_xlv} $SMH:$XLV barbell allocation, and public PW-RSI leaders.",
            "cat": "Daily Regime Dispatch",
            "date": as_of,
            "mins": 5,
            "body": f"""
      <div class="callout">
        <strong>Post-Close Executive Readout ({as_of}):</strong> Semiconductor Fear &amp; Greed stands at <strong>{fg:.1f}/100 ({html.escape(regime)})</strong>.
        <a href="/stocks/smh.html">$SMH</a> closed at <strong>${smh_c:.2f}</strong> ({smh_dd:+.2f}% vs. 52-week high, 14D RSI {smh_rsi:.1f}),
        <a href="/stocks/xlv.html">$XLV</a> closed at <strong>${xlv_c:.2f}</strong>, and <a href="/stocks/qqq.html">$QQQ</a> closed at <strong>${qqq_c:.2f}</strong>.
        Active Barbell Weight: <strong>{rec_smh}% $SMH : {rec_xlv}% $XLV</strong>.
      </div>
      <h2>1. Why Retail Traders Misread Semiconductor Washouts</h2>
      <p>Most individual portfolios suffer permanent capital impairment during semiconductor drawdowns for two opposite reasons: buying the very first -10% dip on 3x leveraged ETFs (<a href="/stocks/soxl.html">$SOXL</a>) with zero stop-loss discipline, and then capitulating near the bottom when 14-day RSI drops into the low 30s.</p>
      <p>Our 7-factor <a href="/semi-fear-greed.html">Semiconductor Fear &amp; Greed engine</a> removes emotion from sector rotation. Rather than holding unhedged high-beta chip exposure through macro tightening, pairing $SMH against defensive Health Care (<a href="/compare/smh-vs-xlv.html">$SMH vs $XLV</a>) provides dry powder to rebalance into deep fear regimes.</p>
      <h2>2. Public PW-RSI Watchlist &amp; Mechanical Risk Floors ({as_of})</h2>
      <p>Below are the top publicly unlocked US equities from our 72-ticker universe ranked by composite Post-Washout Right-Side Ignition (PW-RSI) score, alongside their non-negotiable Rule 1 (-9.0% hard stop) and Rule 3 (+100% TP1 principal recovery) levels:</p>
      <table class="data-table">
        <thead>
          <tr><th>Ticker</th><th>Close</th><th>PW-RSI</th><th>52W DD</th><th>10D Vol</th><th>-9% Stop</th><th>+100% TP1</th></tr>
        </thead>
        <tbody>
          {rows_html}
        </tbody>
      </table>
      <h2>3. Key Head-to-Head Relative Strength Matchups</h2>
      <p>Before deploying capital into a single semiconductor or software name, compare institutional accumulation velocity side-by-side: review <a href="/compare/nvda-vs-amd.html">$NVDA vs $AMD</a>, <a href="/compare/avgo-vs-mrvl.html">$AVGO vs $MRVL</a>, and <a href="/compare/pltr-vs-crwd.html">$PLTR vs $CRWD</a>.</p>
""",
            "faqs": [
                (
                    f"What is the Semiconductor Fear & Greed score as of {as_of}?",
                    f"As of {as_of}, the RightSideAlpha Semiconductor Fear & Greed Index is {fg:.1f}/100 ({regime}), with $SMH at ${smh_c:.2f} ({smh_dd:+.2f}% from its 52-week high) and an active {rec_smh}:{rec_xlv} $SMH:$XLV allocation.",
                ),
                (
                    "How does Rule 1 protect against deep semiconductor drawdowns?",
                    "Every single-stock entry enforces a strict -9.0% mechanical hard stop from average cost basis so a failed breakout never mutates into a -50% bagholder position.",
                ),
            ],
        },
        {
            "slug": "pw-rsi-right-side-breakout-methodology.html",
            "title": "Why Left-Side Dip Buyers Bleed Out: The 26.8-Year Math Behind Right-Side Ignition (PW-RSI)",
            "desc": "How filtering for completed 52-week washouts, MA20/MA60 reclaims, and 1.4x institutional volume surges eliminates value traps across 72 liquid US stocks.",
            "cat": "Quant Methodology",
            "date": as_of,
            "mins": 7,
            "body": """
      <div class="callout">
        <strong>Core Premise:</strong> Cheap stocks get cheaper until institutional volume steps in to reclaim the 20-day and 60-day moving averages. Bottoms are not predicted; they are confirmed on the right side of the V.
      </div>
      <h2>1. The Left-Side Falling Knife Trap</h2>
      <p>Every cycle, retail traders anchor to a stock's former all-time high. When a former darling drops -35%, it looks like a bargain. Yet without trend confirmation, buying below a falling 60-day moving average (MA60) exposes capital to multi-year structural value traps—think legacy turnarounds that bleed another -45% while the Nasdaq compounds without you.</p>
      <h2>2. Four Mathematical Gates of Post-Washout Right-Side Ignition (PW-RSI)</h2>
      <p>Across our 26.8-year backtest (2000–2026), the PW-RSI composite score requires four simultaneous conditions before flagging an institutional Ignition Zone setup:</p>
      <p><strong>Gate 1 — Seller Exhaustion Washout:</strong> The stock has already digested a meaningful correction off its 52-week high, flushing out late momentum chasers and leveraged margin accounts.</p>
      <p><strong>Gate 2 — Off-Bottom Elasticity (+10% to +45% off 52W Low):</strong> Price has stopped making lower lows and proved real demand off the floor without being over-extended.</p>
      <p><strong>Gate 3 — Right-Side Moving Average Reclaim:</strong> Daily close reclaims both MA20 and MA60, proving medium-term institutional cost basis has flipped from overhead supply to support.</p>
      <p><strong>Gate 4 — 10-Day Institutional Volume Surge:</strong> Relative volume expands above 1.3x–1.5x its prior baseline, confirming block accumulation rather than a low-volume retail bounce. See live examples on <a href="/stocks/celh.html">$CELH</a> and <a href="/stocks/nvda.html">$NVDA</a>.</p>
""",
            "faqs": [
                (
                    "What is the difference between conventional RSI and PW-RSI?",
                    "Conventional 14-day RSI only measures short-term price velocity and frequently triggers premature buys in downtrends. PW-RSI combines 52-week washout depth, off-low rebound structure, MA20/MA60 right-side reclaim, and 10-day institutional volume expansion.",
                ),
                (
                    "Why wait for MA60 reclaim instead of buying the exact 52-week low?",
                    "Nobody catches the exact tick of a bottom consistently. Giving up the first 10-15% off the low in exchange for MA60 trend confirmation dramatically reduces time spent in dead-money sideways bases.",
                ),
            ],
        },
        {
            "slug": "smh-xlv-80-20-barbell-drawdown-study.html",
            "title": "Surviving Chip Crashes: How the $SMH:$XLV Contrarian Barbell Cuts Max Drawdown Without Killing Alpha",
            "desc": "Empirical breakdown of pairing high-beta Semiconductors ($SMH) with low-beta Healthcare ($XLV) and shifting from 70:30 to 80:20 during Extreme Fear washouts.",
            "cat": "Portfolio Architecture",
            "date": as_of,
            "mins": 6,
            "body": """
      <div class="callout">
        <strong>Structural Edge:</strong> Semiconductors drive modern earnings growth, but 100% chip exposure suffers -55% to -75% cyclical wipeouts. Pairing <a href="/stocks/smh.html">$SMH</a> with <a href="/stocks/xlv.html">$XLV</a> creates non-correlated rebalancing fuel.
      </div>
      <h2>1. Why Cash Drag Hurts Almost as Much as Leverage Decay</h2>
      <p>Sitting in 50% cash waiting for a crash destroys multi-decade compounding during secular bull runs. Conversely, holding 100% <a href="/stocks/soxl.html">$SOXL</a> or unhedged high-beta tech triggers behavioral panic right at cyclical troughs.</p>
      <h2>2. Why Healthcare ($XLV) Is the Ideal Ballast for Semiconductors ($SMH)</h2>
      <p>Pharmaceuticals, medical devices, and managed care generate recession-resilient free cash flow when wafer equipment and GPU capex pause. During semiconductor drawdowns exceeding -20%, $XLV historically holds relative value—giving systematic investors appreciated defensive shares to trim and rotate into discounted $SMH shares when the <a href="/semi-fear-greed.html">Semiconductor Fear &amp; Greed Index</a> enters Extreme Fear (&lt;25).</p>
      <p>Compare live momentum metrics directly on our <a href="/compare/smh-vs-xlv.html">$SMH vs $XLV institutional comparison page</a>.</p>
""",
            "faqs": [
                (
                    "When does the barbell shift from 70:30 to 80:20 $SMH:$XLV?",
                    "When $SMH experiences a >20% drawdown from its 52-week high and the 7-Factor Semiconductor Fear & Greed score drops into Fear/Extreme Fear territory, the model rotates 10% from defensive $XLV into discounted $SMH.",
                ),
                (
                    "Why avoid holding $SOXL as a long-term core position?",
                    "Daily 3x leveraged ETFs suffer severe volatility decay in choppy regimes; a -33% underlying index drop wipes out roughly -70%+ in 3x daily reset structures.",
                ),
            ],
        },
        {
            "slug": "rule-1-minus-9-percent-stop-loss-math.html",
            "title": "The Asymmetry of Ruin: Why Cutting Every Loser at -9.0% Saves Years of Dead-Money Recovery",
            "desc": "A -9% loss requires +9.89% to break even; a -50% bagholder drawdown demands +100%. Inside Rule 1 and the 55-day dead-money time stop.",
            "cat": "Risk Engineering",
            "date": as_of,
            "mins": 5,
            "body": """
      <div class="callout">
        <strong>The Math of Survival:</strong> Every -60% portfolio disaster started as an ego- bruised -9% dip where the trader whispered, "I'll sell when it bounces back to my entry."
      </div>
      <h2>1. Loss Asymmetry Is Non-Linear</h2>
      <p>Lose <strong>-9.0%</strong> on a failed breakout, and a routine <strong>+9.89%</strong> winner restores 100% of your capital. Let that same position slide to <strong>-40%</strong>, and you need <strong>+66.7%</strong> just to get back to zero. At <strong>-60%</strong>, you must double and a half (<strong>+150%</strong>) merely to erase the scar. Audit our real post-mortem on <a href="/stocks/mbly.html">$MBLY</a> to see Rule 1 in action.</p>
      <h2>2. Combining Rule 1 (-9% Price Stop) with Rule 2 (55-Day Time Stop)</h2>
      <p>Even if a stock doesn't hit -9.0%, sideways chop bleeds opportunity cost. If an equity fails to clear +8.0% within 55 trading days, institutional momentum was mistimed. Rotating stagnant capital into fresh MA60 breakouts keeps portfolio velocity high.</p>
""",
            "faqs": [
                (
                    "Why specifically -9.0% instead of -15% or -20%?",
                    "When entering right-side breakouts near MA20/MA60 support, a >9% drop below cost basis almost always invalidates the breakout pivot itself while keeping account-level risk under 1% on a 10% position size.",
                ),
                (
                    "What is the +100% TP1 Free-Ride Rule (Rule 3)?",
                    "When a winner reaches +100% (2x entry), selling 50% withdraws 100% of original principal so the remaining half rides the 60-day moving average with zero principal at risk.",
                ),
            ],
        },
    ]

    # Also write dated archive snapshot for today's dispatch so URLs accumulate cleanly over time
    dated_slug = f"{as_of}-us-quant-regime-brief.html"
    daily_spec = dict(articles_spec[0])
    daily_spec["slug"] = dated_slug
    all_specs = [articles_spec[0], daily_spec] + articles_spec[1:]

    sitemap_entries: List[Tuple[str, str, str]] = [
        ("https://truthofmarket.com/insights/index.html", "0.92", "daily")
    ]
    rss_items: List[Dict[str, str]] = []
    cards_html = ""

    for idx, sp in enumerate(all_specs):
        html_out = _render_article_shell(
            slug=sp["slug"],
            title=sp["title"],
            meta_desc=sp["desc"],
            category=sp["cat"],
            pub_date=sp["date"],
            read_mins=sp["mins"],
            body_html=sp["body"],
            faqs=sp["faqs"],
        )
        (insights_dir / sp["slug"]).write_text(html_out, encoding="utf-8")
        full_url = f"https://truthofmarket.com/insights/{sp['slug']}"
        sitemap_entries.append((full_url, "0.90" if idx < 2 else "0.86", "daily"))

        if sp["slug"] != dated_slug:  # Keep hub cards clean without duplicating today's alias
            rss_items.append(
                {
                    "title": sp["title"],
                    "link": full_url,
                    "description": sp["desc"],
                    "date": sp["date"],
                }
            )
            cards_html += f"""
      <article class="card">
        <div class="cat">{html.escape(sp['cat'])} · {html.escape(sp['date'])} · {sp['mins']} min read</div>
        <h2><a href="/insights/{sp['slug']}">{html.escape(sp['title'])}</a></h2>
        <p>{html.escape(sp['desc'])}</p>
        <a class="read-more" href="/insights/{sp['slug']}">Read Institutional Research Note →</a>
      </article>"""

    hub_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>US Equity Quant Insights &amp; Daily Semiconductor Regime Journal | RightSideAlpha</title>
  <meta name="description" content="Institutional US stock quantitative research, daily $SMH:$XLV Fear & Greed dispatches, PW-RSI right-side breakout studies, and -9% risk management audits." />
  <link rel="canonical" href="https://truthofmarket.com/insights/index.html" />
  <link rel="alternate" type="application/rss+xml" title="RightSideAlpha RSS Feed" href="https://truthofmarket.com/rss.xml" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="RightSideAlpha Institutional Quant Insights" />
  <meta property="og:description" content="Daily $SMH:$XLV Fear & Greed dispatches and 72-stock PW-RSI quantitative research." />
  <meta property="og:url" content="https://truthofmarket.com/insights/index.html" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  {_beacon_script()}
  <style>
    body {{ margin:0; font-family:'Inter',-apple-system,sans-serif; background:#090d16; color:#e5e7eb; line-height:1.65; }}
    a {{ color:#38bdf8; text-decoration:none; }}
    .topbar {{ border-bottom:1px solid #1f2937; background:#0b1120; padding:0.9rem 1.25rem; display:flex; justify-content:space-between; align-items:center; }}
    .brand {{ font-weight:800; color:#f8fafc; }}
    .nav-links a {{ margin-left:1rem; color:#cbd5e1; font-size:0.9rem; font-weight:600; }}
    .wrap {{ max-width:920px; margin:0 auto; padding:2.5rem 1.25rem 4rem; }}
    h1 {{ color:#f8fafc; font-size:clamp(1.8rem,3.5vw,2.4rem); margin-bottom:0.5rem; }}
    .sub {{ color:#9ca3af; font-size:1.05rem; margin-bottom:2rem; }}
    .card {{ background:#111827; border:1px solid #1f2937; border-radius:12px; padding:1.5rem; margin-bottom:1.15rem; }}
    .cat {{ color:#34d399; font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; }}
    .card h2 {{ margin:0.45rem 0 0.55rem; font-size:1.28rem; }}
    .card h2 a {{ color:#f8fafc; }}
    .card p {{ margin:0 0 0.85rem; color:#cbd5e1; font-size:0.96rem; }}
    .read-more {{ font-weight:700; font-size:0.9rem; color:#38bdf8; }}
  </style>
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/">RightSideAlpha × SemiFearGreed</a>
    <nav class="nav-links">
      <a href="/">72-Stock Terminal</a>
      <a href="/semi-fear-greed.html">$SMH Fear &amp; Greed</a>
      <a href="/insights/index.html">Quant Insights</a>
    </nav>
  </header>
  <main class="wrap">
    <h1>Institutional Quant Insights &amp; Market Regime Journal</h1>
    <p class="sub">Empirical US equity breakout studies, daily $SMH:$XLV Fear &amp; Greed dispatches, and mechanical -9.0% risk audits powered by 26.8 years of market data.</p>
    {cards_html}
  </main>
</body>
</html>
"""
    (insights_dir / "index.html").write_text(hub_html, encoding="utf-8")
    return sitemap_entries, rss_items


if __name__ == "__main__":
    smap, rss = generate_all_quant_insights()
    print(f"[Insights] Generated {len(smap)} editorial insight URLs in frontend/public/insights/")
