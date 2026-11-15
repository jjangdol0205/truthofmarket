"""
scripts/build_static_bundle.py
Builds the production frontend bundle from frontend/src/* and frontend/public/*
and synchronizes identical outputs to:
  1. frontend/dist/
  2. dist/
  3. ./ (repo root static files)
"""
from datetime import datetime, timezone
from email.utils import format_datetime
import json
import pathlib
import re
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.generate_seo_stock_pages import generate_all_seo_pages

FE = ROOT / "frontend"
DIST = FE / "dist"
ROOT_DIST = ROOT / "dist"
PUB = FE / "public"

MODULE_ORDER = [
    "src/locales/i18n.js",
    "src/services/api.js",
    "src/components/PositionDoctor.js",
    "src/components/ChartBlindTest.js",
    "src/components/Header.js",
    "src/components/Hero.js",
    "src/components/ProofCard.js",
    "src/components/StockTable.js",
    "src/components/ProVault.js",
    "src/components/Pricing.js",
    "src/components/Modals.js",
    "src/components/SemiFearGreedView.js",
    "src/main.js",
]


def strip_imports_and_exports(code: str) -> str:
    code = re.sub(r"^\s*import\s+[\s\S]*?from\s+[\"'][^\"']+[\"'];?\s*$", "", code, flags=re.M)
    code = re.sub(r"^\s*import\s+[\"'][^\"']+[\"'];?\s*$", "", code, flags=re.M)
    code = re.sub(r"^\s*export\s+(async\s+function|function|const|let|var)\s+", r"\1 ", code, flags=re.M)
    return code


def refresh_health_and_rss() -> tuple[str, str]:
    semi_path = ROOT / "static_api" / "semi_overview.json"
    stocks_path = ROOT / "static_api" / "stocks_free.json"
    as_of_date = "2026-11-13"
    fg_score = 18.3
    regime_code = "EXTREME_FEAR"
    smh_close = 504.48
    smh_dd_pct = -24.58
    celh_close = 30.04
    celh_stop = 27.34
    celh_tp1 = 60.08

    if semi_path.exists():
        try:
            ov = json.loads(semi_path.read_text(encoding="utf-8"))
            as_of_date = str(ov.get("date") or as_of_date)
            fg_score = float(ov.get("fg_score") or fg_score)
            regime_code = str(ov.get("regime_code") or regime_code)
            smh_close = float(ov.get("smh_close") or smh_close)
            smh_dd_pct = float(ov.get("smh_dd_pct") or smh_dd_pct)
        except Exception:
            pass

    try:
        close_dt_utc = datetime.strptime(as_of_date[:10], "%Y-%m-%d").replace(hour=21, minute=0, second=0, tzinfo=timezone.utc)
    except Exception:
        close_dt_utc = datetime.now(timezone.utc).replace(hour=21, minute=0, second=0, microsecond=0)
    iso_now = close_dt_utc.strftime("%Y-%m-%dT%H:%M:%SZ")
    rfc_now = format_datetime(close_dt_utc)

    if stocks_path.exists():
        try:
            st = json.loads(stocks_path.read_text(encoding="utf-8"))
            for row in st:
                if row.get("ticker") == "CELH":
                    celh_close = float(row.get("close") or celh_close)
                    celh_stop = round(celh_close * 0.91, 2)
                    celh_tp1 = round(celh_close * 2.0, 2)
                    break
        except Exception:
            pass

    health_obj = {
        "status": "ok",
        "mode": "static",
        "as_of_date": as_of_date,
        "updated_at": iso_now,
        "services": ["RightSideAlpha", "SemiFearGreed"],
    }
    health_json = json.dumps(health_obj, indent=2) + "\n"

    insight_items_xml = f"""
    <item>
      <title><![CDATA[US Market Regime Dispatch ({as_of_date}): $SMH Fear & Greed at {fg_score:.1f}/100 ({regime_code}) & PW-RSI Watchlist]]></title>
      <link>https://truthofmarket.com/insights/daily-us-quant-regime-brief.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/insights/daily-us-quant-regime-brief.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Post-close institutional US market regime dispatch as of {as_of_date}: $SMH ${smh_close:.2f} ({smh_dd_pct:.2f}% off 52W high), contrarian $SMH:$XLV barbell status, and public PW-RSI leaders.]]></description>
    </item>
    <item>
      <title><![CDATA[Why Left-Side Dip Buyers Bleed Out: The 26.8-Year Math Behind Right-Side Ignition (PW-RSI)]]></title>
      <link>https://truthofmarket.com/insights/pw-rsi-right-side-breakout-methodology.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/insights/pw-rsi-right-side-breakout-methodology.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[How filtering for completed 52-week washouts, MA20/MA60 reclaims, and institutional volume surges eliminates value traps across 72 liquid US stocks.]]></description>
    </item>
    <item>
      <title><![CDATA[Surviving Chip Crashes: How the $SMH:$XLV Contrarian Barbell Cuts Max Drawdown Without Killing Alpha]]></title>
      <link>https://truthofmarket.com/insights/smh-xlv-80-20-barbell-drawdown-study.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/insights/smh-xlv-80-20-barbell-drawdown-study.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Empirical breakdown of pairing high-beta Semiconductors ($SMH) with low-beta Healthcare ($XLV) and shifting from 70:30 to 80:20 during Extreme Fear washouts.]]></description>
    </item>
    <item>
      <title><![CDATA[The Asymmetry of Ruin: Why Cutting Every Loser at -9.0% Saves Years of Dead-Money Recovery]]></title>
      <link>https://truthofmarket.com/insights/rule-1-minus-9-percent-stop-loss-math.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/insights/rule-1-minus-9-percent-stop-loss-math.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[A -9% loss requires +9.89% to break even; a -50% bagholder drawdown demands +100%. Inside Rule 1 and the 55-day dead-money time stop.]]></description>
    </item>"""

    rss_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>RightSideAlpha x SemiFearGreed | US Equity Quant Terminal &amp; Semiconductor Fear &amp; Greed Index</title>
    <link>https://truthofmarket.com/</link>
    <atom:link href="https://truthofmarket.com/rss.xml" rel="self" type="application/rss+xml" />
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub" />
    <description>Institutional US Equity Post-Washout Right-Side Ignition (PW-RSI) Quant Terminal covering 72 US equities, daily $SMH Semiconductor Fear &amp; Greed Index (0-100), and $SMH/$XLV contrarian barbell allocation.</description>
    <language>en-US</language>
    <lastBuildDate>{rfc_now}</lastBuildDate>{insight_items_xml}
    <item>
      <title><![CDATA[RightSideAlpha x SemiFearGreed — 72 US Equity PW-RSI Turnaround Terminal & 26.8-Year Backtest (As of {as_of_date})]]></title>
      <link>https://truthofmarket.com/</link>
      <guid isPermaLink="true">https://truthofmarket.com/</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Live institutional US equity quant screener (as of {as_of_date}) tracking 72 liquid US stocks across 52-week washout bottoms, right-side SMA20/SMA60 turnaround ignition triggers, -9.0% mechanical hard-stop protection, and 2x (TP1 +100%) asymmetric profit targets.]]></description>
    </item>
    <item>
      <title><![CDATA[CNN-Edition Semiconductor Fear & Greed Index ($SMH {fg_score:.1f} {regime_code}) & $SMH/$XLV 80:20 Contrarian Barbell Engine]]></title>
      <link>https://truthofmarket.com/semi-fear-greed.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/semi-fear-greed.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Real-time 5-factor Semiconductor Fear & Greed Index ($SMH Close ${smh_close:.2f}, {smh_dd_pct:.2f}% from 52W High as of {as_of_date}) and regime-based $SMH (VanEck Semiconductor ETF) vs. $XLV (Health Care Select Sector SPDR) contrarian barbell rebalancing simulator.]]></description>
    </item>
    <item>
      <title><![CDATA[Celsius Holdings ($CELH) Institutional Deep-Dive: 52W Bottom Re-Accumulation & PW-RSI Turnaround Analysis (${celh_close:.2f})]]></title>
      <link>https://truthofmarket.com/stocks/celh.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/stocks/celh.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Comprehensive institutional audit of Celsius Holdings ($CELH, Close ${celh_close:.2f} as of {as_of_date}) following its PepsiCo inventory destocking washout: gross margin defense, international expansion catalysts, ${celh_stop:.2f} (-9.0%) hard stop floor, and ${celh_tp1:.2f} (+100% 2x) TP1 target.]]></description>
    </item>
    <item>
      <title><![CDATA[Mobileye Global ($MBLY) Post-Mortem Risk Audit: Rule 1 (-9.0% Hard Stop @ $6.39) Execution & Capital Preservation]]></title>
      <link>https://truthofmarket.com/stocks/mbly.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/stocks/mbly.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Transparent institutional post-mortem on Mobileye Global ($MBLY): how mechanical execution of Rule 1 (-9.0% Hard Stop at $6.39) prevented deeper drawdown after support breakdown and redeployed capital into confirmed right-side leaders.]]></description>
    </item>
    <item>
      <title><![CDATA[NVIDIA ($NVDA) & VanEck Semiconductor ETF ($SMH) Institutional PW-RSI Support/Resistance Audit ({as_of_date})]]></title>
      <link>https://truthofmarket.com/stocks/nvda.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/stocks/nvda.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Daily retirement safety & market weather screening ({as_of_date}) across $SGOV (US T-Bill Cushion), $SCHD (Dividend Growth), $JEPI (Monthly Paycheck), $VOO (S&P 500 Core), $SMH, and $XLV with calm 2-4x/year 3-color rebalancing guidance.]]></description>
    </item>
  </channel>
</rss>
"""
    return health_json, rss_xml


def main() -> None:
    chunks = []
    for rel in MODULE_ORDER:
        raw = (FE / rel).read_text(encoding="utf-8")
        chunks.append(f"// --- {rel} ---\n{strip_imports_and_exports(raw)}")
    bundled_js = "\n\n".join(chunks)
    css_raw = (FE / "src/styles/theme.css").read_text(encoding="utf-8")

    js_name = "index-BIziPp23.js"
    css_name = "index-CaOpdap3.css"

    # Generate all 76 static /stocks/<ticker>.html pages, /semi-fear-greed.html, and clean sitemap.xml
    seo_dir_html = generate_all_seo_pages(js_name=js_name, css_name=css_name)

    index_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <script>window.__DEFAULT_VIEW__ = 'rightside';</script>
  <meta charset="UTF-8" />
  <meta name="google-site-verification" content="nAGlJMEUUPifbzSd8X4PCaBIyr3DtTwaa1a-q9zkbBc" />
  <meta name="google-site-verification" content="G99bl17UU6iKgNm5ndGcSWp0dHFpJ0MjJqBBp0Exfx0" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Turn Your 401(k) &amp; Savings Into Calm, Reliable Monthly Retirement Income | TruthOfMarket</title>
  <meta name="description" content="30-Second Comfortable Retirement &amp; Monthly Cashflow Simulator for 50-70s US investors. Build calm monthly income with SGOV (T-Bill Cushion), SCHD (Dividend Growth), JEPI (Monthly Paycheck) &amp; VOO (S&amp;P 500 Core) via 2-4x/year 3-color rebalancing." />
  <link rel="canonical" href="https://truthofmarket.com/" />
  <link rel="alternate" type="application/rss+xml" title="TruthOfMarket Retirement &amp; Market Weather RSS Feed" href="https://truthofmarket.com/rss.xml" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="TruthOfMarket — Retirement Cashflow Architect" />
  <meta property="og:title" content="Turn Your 401(k) &amp; Savings Into Calm, Reliable Monthly Retirement Income | TruthOfMarket" />
  <meta property="og:description" content="Design your monthly retirement paycheck in 30 seconds and protect your nest egg from -35% sequence-of-returns crashes with SGOV, SCHD, JEPI &amp; VOO calm 2-4x/year rebalancing." />
  <meta property="og:url" content="https://truthofmarket.com/" />
  <meta property="og:image" content="https://truthofmarket.com/og-preview.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Turn Your 401(k) &amp; Savings Into Calm, Reliable Monthly Retirement Income | TruthOfMarket" />
  <meta name="twitter:description" content="30-Second Retirement Cashflow Simulator &amp; 3-Bucket Blueprint (SGOV · SCHD · JEPI · VOO) for calm monthly retirement income." />
  <meta name="twitter:image" content="https://truthofmarket.com/og-preview.png" />
  <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&family=Noto+Sans+JP:wght@400;600;700&family=Noto+Sans+KR:wght@400;600;700&display=swap" rel="stylesheet" />
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@graph": [
      {{
        "@type": "Organization",
        "@id": "https://truthofmarket.com/#organization",
        "name": "RightSideAlpha × SemiFearGreed",
        "url": "https://truthofmarket.com/",
        "logo": "https://truthofmarket.com/favicon.svg",
        "sameAs": [
          "https://www.youtube.com/@RightSideAlpha",
          "https://t.me/truthofmarketss",
          "https://www.instagram.com/rightsidealpha",
          "https://x.com/rightsidealpha"
        ]
      }},
      {{
        "@type": "WebSite",
        "@id": "https://truthofmarket.com/#website",
        "url": "https://truthofmarket.com/",
        "name": "RightSideAlpha × SemiFearGreed",
        "publisher": {{
          "@id": "https://truthofmarket.com/#organization"
        }},
        "description": "Real-time Semiconductor Fear & Greed Index (0-100), $SMH/$XLV Contrarian Barbell Rebalancing Engine, and 72 US Equity Post-Washout Right-Side Ignition (PW-RSI) Terminal."
      }},
      {{
        "@type": "SoftwareApplication",
        "@id": "https://truthofmarket.com/#software",
        "name": "RightSideAlpha × SemiFearGreed Institutional Quant Terminal",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "url": "https://truthofmarket.com/",
        "publisher": {{
          "@id": "https://truthofmarket.com/#organization"
        }},
        "description": "72 US Equity Post-Washout Right-Side Ignition (PW-RSI) Screener, 3-Second Position Doctor, and CNN-Edition Semiconductor Fear & Greed ($SMH:$XLV) Barbell Engine.",
        "offers": [
          {{
            "@type": "Offer",
            "name": "Pro Quantitative Terminal (Monthly)",
            "price": "29.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
          }},
          {{
            "@type": "Offer",
            "name": "Lifetime Research & Terminal License",
            "price": "199.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b"
          }}
        ]
      }}
    ]
  }}
  </script>
  <script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
  <script src="/hq_member_crm_client.js" defer></script>
  <script type="module" crossorigin src="./assets/{js_name}?v=20261116senior"></script>
  <link rel="stylesheet" crossorigin href="./assets/{css_name}?v=20261116senior" />
  <script>
  /* === HQ Edge Real-Human Visitor & KPI Beacon (tom_truthofmarket) === */
  (function(){{
    try {{
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      var ns = 'tom_truthofmarket';
      window.trackTomFreeSignup = function(emailAddr) {{
        try {{
          var h = (location && location.hostname) || '';
          if (!h || h === 'localhost' || h === '127.0.0.1') return;
          if (localStorage.getItem('hq_signup_' + ns + '_' + kst) !== '1') {{
            localStorage.setItem('hq_signup_' + ns + '_' + kst, '1');
            fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/signup_' + kst, {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
          }}
          if (localStorage.getItem('hq_signup_ever_' + ns) !== '1') {{
            localStorage.setItem('hq_signup_ever_' + ns, '1');
            fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/signup_total', {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
          }}
        }} catch (e) {{}}
      }};
      if (window.__HQ_BEACON_SENT_tom_truthofmarket__ || window.__HQ_KPI_TOM__) return;
      window.__HQ_BEACON_SENT_tom_truthofmarket__ = true;
      window.__HQ_KPI_TOM__ = true;
      var ua = navigator.userAgent || '';
      if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|gtmetrix|pingdom|uptimerobot|python|curl|node|axios/i.test(ua)) return;
      var host = (location && location.hostname) || '';
      if (!host || host === 'localhost' || host === '127.0.0.1') return;
      fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/pv_' + kst, {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
      fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/pv_total', {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
      if (localStorage.getItem('hq_uv_' + ns + '_' + kst) !== '1') {{
        localStorage.setItem('hq_uv_' + ns + '_' + kst, '1');
        fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/uv_' + kst, {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
      }}
      if (localStorage.getItem('hq_uv_ever_' + ns) !== '1') {{
        localStorage.setItem('hq_uv_ever_' + ns, '1');
        fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/uv_total', {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
      }}
      if (location.search.indexOf('payment=success') !== -1 || location.search.indexOf('unlock=1') !== -1) {{
        if (localStorage.getItem('hq_paid_' + kst) !== '1') {{
          localStorage.setItem('hq_paid_' + kst, '1');
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_member_' + kst, {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_member_total', {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
        }}
      }}
      document.addEventListener('click', function(e) {{
        var el = e.target && e.target.closest ? e.target.closest('a, button, [role="button"]') : null;
        if (!el) return;
        var href = (el.getAttribute('href') || '').toLowerCase();
        var txt = (el.innerText || el.textContent || '').toLowerCase();
        var cls = (el.className || '').toLowerCase();
        if (href.indexOf('lemonsqueezy.com') !== -1 || href.indexOf('truthofmarketss') !== -1 || cls.indexOf('pro') !== -1 || cls.indexOf('paywall') !== -1 || /pro|vip|unlock|subscribe|upgrade|checkout|\\$19|\\$29|\\$49|\\$199/.test(txt)) {{
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_click_' + kst, {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_click_total', {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
        }}
      }}, true);
    }} catch (e) {{}}
  }})();
  </script>
</head>
<body>
  <div id="app">
    <section class="seo-home-fallback" id="tom-retirement-architect" style="max-width:1280px;width:calc(100% - 24px);box-sizing:border-box;margin:16px auto;padding:24px;background:#0f172a;border:1px solid #10b981;border-radius:14px;color:#f8fafc;">
      <h1 style="font-size:1.75rem;font-weight:900;margin:0 0 10px;color:#ffffff;line-height:1.3;">Turn Your 401(k) &amp; Savings Into Calm, Reliable Monthly Retirement Income.</h1>
      <p style="margin:0;color:#e2e8f0;font-size:1.125rem;line-height:1.72;">30-Second Comfortable Retirement &amp; Monthly Cashflow Simulator — Design your guarded monthly retirement paycheck ($150k / $400k / $800k / $1.5M presets), shield your nest egg from -35% sequence-of-returns crashes, and rebalance calmly 2–4 times a year across <b>SGOV</b> (US T-Bill Cash Cushion), <b>SCHD</b> (Dividend Growth), <b>JEPI</b> (Monthly Dividend Paycheck), and <b>VOO</b> (S&amp;P 500 Core Compounding) using our 3-Color Traffic Light.</p>
      <p id="tomMorningBellClub" style="margin:12px 0 0;padding-top:12px;border-top:1px solid #1e293b;color:#fbbf24;font-size:1.06rem;font-weight:700;line-height:1.65;"><span id="tom-passwordless-club-signup">☕ Morning Bell Retirement &amp; Macro Club — Protecting Your Nest Egg &amp; Monthly Income Together · Free 3-Second Passwordless Membership</span></p>
      <p id="tomFreeStarterManual" style="margin:8px 0 0;color:#38bdf8;font-size:1.06rem;font-weight:700;line-height:1.65;">📘 $0 Free Public Product: US Brokerage App &amp; Safe Retirement Rebalancing Manual (Fidelity · Charles Schwab · Vanguard — SGOV/SPAXX Cash Cushion, Limit Orders &amp; Calm 2–4x/Year Rebalancing Guide)</p>
      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
        <a href="https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&amp;locale=en" class="lemonsqueezy-button" style="color:#6ee7b7;font-weight:800;font-size:1rem;">⚡ Monthly VIP ($29/mo)</a>
        <a href="https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&amp;locale=en" class="lemonsqueezy-button" style="color:#fde68a;font-weight:800;font-size:1rem;">👑 Lifetime VIP ($199 Once)</a>
      </div>
    </section>
  </div>
{seo_dir_html}
</body>
</html>
"""

    health_json, rss_xml = refresh_health_and_rss()
    feed_xml = rss_xml.replace(
        'href="https://truthofmarket.com/rss.xml" rel="self"',
        'href="https://truthofmarket.com/feed.xml" rel="self"',
    )

    # Keep frontend/public/index.html, rss.xml, feed.xml, and health.json in sync
    (PUB / "index.html").write_text(index_html, encoding="utf-8")
    (PUB / "rss.xml").write_text(rss_xml, encoding="utf-8")
    (PUB / "feed.xml").write_text(feed_xml, encoding="utf-8")
    (PUB / "static_api").mkdir(parents=True, exist_ok=True)
    (PUB / "static_api" / "health.json").write_text(health_json, encoding="utf-8")
    (ROOT / "static_api" / "health.json").write_text(health_json, encoding="utf-8")

    # Remove deprecated/leak files from public source before copying
    for stale_rel in ["instagram_us_setup.html", "static_api/stocks_pro.json", "static_api/smh_xlv_fear_greed_history.csv"]:
        sp = PUB / stale_rel
        if sp.exists():
            sp.unlink()

    # Explicitly sync passwordless CRM client & mailing endpoint config across public, frontend/dist, dist, and root
    for crm_name in ("hq_member_crm_client.js", "hq-mailing-endpoint.json"):
        root_crm = ROOT / crm_name
        pub_crm = PUB / crm_name
        src_crm = pub_crm if pub_crm.exists() else root_crm
        if crm_name == "hq-mailing-endpoint.json" and root_crm.exists() and pub_crm.exists():
            try:
                r_cfg = json.loads(root_crm.read_text(encoding="utf-8"))
                p_cfg = json.loads(pub_crm.read_text(encoding="utf-8"))
                if r_cfg.get("webapp_exec_url") and not p_cfg.get("webapp_exec_url"):
                    src_crm = root_crm
                elif root_crm.stat().st_mtime > pub_crm.stat().st_mtime and r_cfg.get("webapp_exec_url") == p_cfg.get("webapp_exec_url"):
                    src_crm = root_crm
            except Exception:
                pass
        elif root_crm.exists() and pub_crm.exists() and root_crm.stat().st_mtime > pub_crm.stat().st_mtime:
            src_crm = root_crm
        if src_crm.exists() and src_crm.resolve() != pub_crm.resolve():
            shutil.copy2(src_crm, pub_crm)

    for target_dir in [DIST, ROOT_DIST, ROOT]:
        assets_d = target_dir / "assets"
        assets_d.mkdir(parents=True, exist_ok=True)
        (assets_d / js_name).write_text(bundled_js, encoding="utf-8")
        (assets_d / css_name).write_text(css_raw, encoding="utf-8")
        for item in PUB.iterdir():
            if item.name in ("index.html", "instagram_us_setup.html"):
                continue
            dest = target_dir / item.name
            if item.is_dir():
                shutil.copytree(item, dest, dirs_exist_ok=True)
            else:
                shutil.copy2(item, dest)
        for crm_name in ("hq_member_crm_client.js", "hq-mailing-endpoint.json"):
            pub_crm = PUB / crm_name
            dest_crm = target_dir / crm_name
            if pub_crm.exists() and pub_crm.resolve() != dest_crm.resolve():
                shutil.copy2(pub_crm, dest_crm)
        # Write index.html, rss.xml, feed.xml, and static_api/health.json AFTER copying public files
        (target_dir / "index.html").write_text(index_html, encoding="utf-8")
        (target_dir / "rss.xml").write_text(rss_xml, encoding="utf-8")
        (target_dir / "feed.xml").write_text(feed_xml, encoding="utf-8")
        (target_dir / "static_api").mkdir(parents=True, exist_ok=True)
        (target_dir / "static_api" / "health.json").write_text(health_json, encoding="utf-8")
        for stale_rel in ["instagram_us_setup.html", "static_api/stocks_pro.json", "static_api/smh_xlv_fear_greed_history.csv", "assets/index-BPaRJGLB.css"]:
            tp = target_dir / stale_rel
            if tp.exists():
                tp.unlink()

    print(f"Built & synced frontend/dist, ./dist, and root static bundle ({js_name}, {css_name})")


if __name__ == "__main__":
    main()
