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
from scripts.generate_daily_quant_insights import generate_all_quant_insights

FE = ROOT / "frontend"
DIST = FE / "dist"
ROOT_DIST = ROOT / "dist"
PUB = FE / "public"

MODULE_ORDER = [
    "src/components/PaymentWaitlist.js",
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
    "src/components/PrivateWealthHome.js",
    "src/main.js",
]


def strip_imports_and_exports(code: str) -> str:
    code = re.sub(r"^\s*import\s+[\s\S]*?from\s+[\"'][^\"']+[\"'];?\s*$", "", code, flags=re.M)
    code = re.sub(r"^\s*import\s+[\"'][^\"']+[\"'];?\s*$", "", code, flags=re.M)
    code = re.sub(r"^\s*export\s+(async\s+function|function|const|let|var)\s+", r"\1 ", code, flags=re.M)
    return code


def refresh_health_and_rss() -> tuple[str, str, str, int, str]:
    semi_path = ROOT / "static_api" / "semi_overview.json"
    stocks_path = ROOT / "static_api" / "stocks_free.json"
    as_of_date = "2026-11-18"
    fg_score = 10.6
    regime_code = "EXTREME_FEAR"
    regime_en = "Extreme Fear"
    smh_close = 457.91
    smh_dd_pct = -31.54
    celh_close = 31.57
    celh_low_ref = 28.73
    celh_up_ref = 63.14

    if semi_path.exists():
        try:
            ov = json.loads(semi_path.read_text(encoding="utf-8"))
            as_of_date = str(ov.get("date") or as_of_date)
            fg_score = float(ov.get("fg_score") or fg_score)
            regime_code = str(ov.get("regime_code") or regime_code)
            regime_en = str(ov.get("regime_en") or regime_en)
            smh_close = float(ov.get("smh_close") or smh_close)
            smh_dd_pct = float(ov.get("smh_dd_pct") or smh_dd_pct)
            # Ensure public /data/semi_overview.json is always kept in sync
            (PUB / "data").mkdir(parents=True, exist_ok=True)
            (PUB / "data" / "semi_overview.json").write_text(
                json.dumps(ov, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            (ROOT / "data").mkdir(parents=True, exist_ok=True)
            (ROOT / "data" / "semi_overview.json").write_text(
                json.dumps(ov, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
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
                    celh_low_ref = round(celh_close * 0.91, 2)
                    celh_up_ref = round(celh_close * 2.0, 2)
                    break
        except Exception:
            pass

    health_obj = {
        "status": "ok",
        "mode": "static",
        "as_of_date": as_of_date,
        "updated_at": iso_now,
        "desk": "Independent Market Data & Educational Research",
        "services": ["TruthOfMarket", "MarketWeather"],
    }
    health_json = json.dumps(health_obj, indent=2) + "\n"

    insight_items_xml = f"""
    <item>
      <title><![CDATA[Morning Market Data Newsletter ({as_of_date}): Sector Temperature at {fg_score:.1f}/100 ({regime_code}) & SMH × XLV Study]]></title>
      <link>https://truthofmarket.com/insights/daily-us-quant-regime-brief.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/insights/daily-us-quant-regime-brief.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Educational US market data summary as of {as_of_date}: $SMH ${smh_close:.2f} ({smh_dd_pct:.2f}% off 52W high), $SMH × $XLV two-pillar historical case study, and $SGOV US Treasury reserve reference.]]></description>
    </item>
    <item>
      <title><![CDATA[Understanding Moving-Average Confirmation: 2000–2025 Historical Statistical Study]]></title>
      <link>https://truthofmarket.com/insights/pw-rsi-right-side-breakout-methodology.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/insights/pw-rsi-right-side-breakout-methodology.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Educational statistical study examining 52-week drawdown recovery, 20-day and 60-day moving average alignment, and 10-day relative volume across liquid US equities.]]></description>
    </item>
    <item>
      <title><![CDATA[Sector Correlation & Review Math: Studying the $SMH and $XLV 2-Pillar Case Study (2000–2025)]]></title>
      <link>https://truthofmarket.com/insights/smh-xlv-80-20-barbell-drawdown-study.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/insights/smh-xlv-80-20-barbell-drawdown-study.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Empirical educational study of combining Semiconductors ($SMH) with Healthcare ($XLV) under calm semi-annual ratio review.]]></description>
    </item>
    <item>
      <title><![CDATA[The Mathematics of Drawdown Asymmetry: Why Portfolio Cushions Preserve Long-Term Compounding]]></title>
      <link>https://truthofmarket.com/insights/rule-1-minus-9-percent-stop-loss-math.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/insights/rule-1-minus-9-percent-stop-loss-math.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Educational compounding math showing how deep drawdowns require nonlinear recovery gains, and how $XLV and short-term US Treasury ($SGOV) cushions reduce sequence-of-returns risk.]]></description>
    </item>"""

    rss_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TruthOfMarket | Independent Market Data &amp; Educational Research</title>
    <link>https://truthofmarket.com/</link>
    <atom:link href="https://truthofmarket.com/rss.xml" rel="self" type="application/rss+xml" />
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub" />
    <description>Educational Market Data Newsletter + 2000–2025 Historical Statistical Workbook (SMH × XLV + SGOV 2-Pillar Historical Case Study — Strictly Non-Advisory Educational Publisher).</description>
    <language>en-US</language>
    <lastBuildDate>{rfc_now}</lastBuildDate>{insight_items_xml}
    <item>
      <title><![CDATA[TruthOfMarket — Historical Sector Backtest Explorer (As of {as_of_date})]]></title>
      <link>https://truthofmarket.com/</link>
      <guid isPermaLink="true">https://truthofmarket.com/</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[4-Step Historical Sector Backtest Explorer studying non-leveraged Semiconductor Growth ($SMH), Healthcare Defense ($XLV), and 0-3 Month US Treasury Reserves ($SGOV).]]></description>
    </item>
    <item>
      <title><![CDATA[Public Market Weather & Sector Sentiment Gauge ({fg_score:.1f} {regime_code}) — $SMH/$XLV Study]]></title>
      <link>https://truthofmarket.com/semi-fear-greed.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/semi-fear-greed.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Self-directed educational sector sentiment gauge ($SMH Close ${smh_close:.2f}, {smh_dd_pct:.2f}% from 52W High as of {as_of_date}) and historical $SMH vs. $XLV statistical study.]]></description>
    </item>
    <item>
      <title><![CDATA[Celsius Holdings ($CELH) Public Factor Case Study: 52W Consolidation & Volume Analysis (${celh_close:.2f})]]></title>
      <link>https://truthofmarket.com/stocks/celh.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/stocks/celh.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Educational factor summary of Celsius Holdings ($CELH, Close ${celh_close:.2f} as of {as_of_date}): moving-average alignment, lower variance band (${celh_low_ref:.2f}), and upper dispersion band (${celh_up_ref:.2f}).]]></description>
    </item>
  </channel>
</rss>
"""
    return health_json, rss_xml, as_of_date, round(fg_score), regime_en


def main() -> None:
    PUB.mkdir(parents=True, exist_ok=True)

    # Export standalone tom_payment_waitlist.js to frontend/public/ so all static subpages share unified Whop PAYMENT_CONFIG & beacons
    waitlist_src = (FE / "src/components/PaymentWaitlist.js").read_text(encoding="utf-8")
    (PUB / "tom_payment_waitlist.js").write_text(waitlist_src, encoding="utf-8")

    chunks = []
    for rel in MODULE_ORDER:
        raw = (FE / rel).read_text(encoding="utf-8")
        chunks.append(f"// --- {rel} ---\n{strip_imports_and_exports(raw)}")
    bundled_js = "\n\n".join(chunks)
    css_raw = (FE / "src/styles/theme.css").read_text(encoding="utf-8")

    js_name = "index-BIziPp23.js"
    css_name = "index-CaOpdap3.css"

    # Regenerate Substack-style /insights/*.html first, then /stocks/*.html, /compare/*.html, /pro-swing.html, /semi-fear-greed.html & sitemap.xml
    generate_all_quant_insights()
    generate_all_seo_pages(js_name=js_name, css_name=css_name)

    health_json, rss_xml, as_of_date, fg_int, regime_en = refresh_health_and_rss()
    reg_badge_str = regime_en if regime_en.lower().endswith("regime") else f"{regime_en} Regime"

    index_html = f"""<!DOCTYPE html>
<html lang="en" data-tom-theme="light" data-tom-font="18">
<head>
  <script>
  window.__DEFAULT_VIEW__ = 'rightside';
  window.PAYMENT_CONFIG = {{
    PROVIDER: 'whop',
    DIVISION: 'TOM',
    STORE_SLOT: 'FINANCE_STORE_SLOT',
    STORE_LIVE_READY: true,
    COMPANY_ID: 'biz_4ynqri19wFDIwm',
    STORE_NAME: 'TruthOfMarket Research',
    WHOP_PLAN_IDS: {{
      monthly: 'plan_xVJeNwyrDef8T',
      annual: 'plan_9sdgFI753ucXQ'
    }},
    WHOP_CHECKOUT_CONFIG_IDS: {{
      monthly: 'ch_uFPUZl9jaGdNTvH',
      annual: 'ch_G3EyPgGXTTahfv7'
    }},
    WHOP_CHECKOUT_URLS: {{
      monthly: 'https://whop.com/checkout/plan_xVJeNwyrDef8T',
      annual: 'https://whop.com/checkout/plan_9sdgFI753ucXQ'
    }},
    WHOP_REDIRECT_URLS: {{
      monthly: 'https://truthofmarket.com/?payment=success&provider=whop&plan=monthly',
      annual: 'https://truthofmarket.com/?payment=success&provider=whop&plan=annual'
    }},
    WHOP_TOM_MONTHLY_URL: 'https://whop.com/checkout/plan_xVJeNwyrDef8T',
    WHOP_TOM_ANNUAL_URL: 'https://whop.com/checkout/plan_9sdgFI753ucXQ',
    SUPPORT_EMAIL: 'beable9489@gmail.com'
  }};
  var COPY_MODE = 'LIVE_SHARP';
  window.TOM_COPY_MODE = COPY_MODE;
  try {{
    var _th = localStorage.getItem('tom_ui_theme_v2') === 'dark' ? 'dark' : 'light';
    var _px = Number(localStorage.getItem('tom_font_px')) || 18;
    if ([18, 20, 22].indexOf(_px) === -1) _px = 18;
    document.documentElement.setAttribute('data-tom-theme', _th);
    document.documentElement.setAttribute('data-tom-font', String(_px));
  }} catch (_e) {{}}
  </script>
  <meta charset="UTF-8" />
  <meta name="google-site-verification" content="nAGlJMEUUPifbzSd8X4PCaBIyr3DtTwaa1a-q9zkbBc" />
  <meta name="google-site-verification" content="G99bl17UU6iKgNm5ndGcSWp0dHFpJ0MjJqBBp0Exfx0" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Independent Market Data &amp; Educational Research | TruthOfMarket</title>
  <meta name="description" content="Educational Market Data Newsletter + 2000–2025 Historical Statistical Workbook (SMH × XLV + SGOV 2-Pillar Historical Case Study — Strictly Non-Advisory Educational Publisher)." />
  <link rel="canonical" href="https://truthofmarket.com/" />
  <link rel="alternate" type="application/rss+xml" title="TruthOfMarket Educational Research RSS Feed" href="https://truthofmarket.com/rss.xml" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="TruthOfMarket — Independent Market Data &amp; Educational Research" />
  <meta property="og:title" content="Independent Market Data &amp; Educational Research | TruthOfMarket" />
  <meta property="og:description" content="Historical Sector Backtest Explorer &amp; Educational Market Data Newsletter + 2000–2025 Historical Statistical Workbook (SMH × XLV + SGOV 2-Pillar Historical Case Study)." />
  <meta property="og:url" content="https://truthofmarket.com/" />
  <meta property="og:image" content="https://truthofmarket.com/og-preview.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Independent Market Data &amp; Educational Research | TruthOfMarket" />
  <meta name="twitter:description" content="Historical Sector Backtest Explorer &amp; 2000–2025 SMH × XLV + SGOV Historical Statistical Workbook." />
  <meta name="twitter:image" content="https://truthofmarket.com/og-preview.png" />
  <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet" />
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@graph": [
      {{
        "@type": "Organization",
        "@id": "https://truthofmarket.com/#organization",
        "name": "TruthOfMarket Research — Independent Market Data & Educational Research",
        "url": "https://truthofmarket.com/",
        "email": "beable9489@gmail.com",
        "logo": "https://truthofmarket.com/favicon.svg",
        "sameAs": [
          "https://www.youtube.com/channel/UCbxWByxJntRqoweWy-4QnqA",
          "https://www.instagram.com/truthofmarket/"
        ]
      }},
      {{
        "@type": "WebSite",
        "@id": "https://truthofmarket.com/#website",
        "url": "https://truthofmarket.com/",
        "name": "TruthOfMarket Research",
        "publisher": {{
          "@id": "https://truthofmarket.com/#organization"
        }},
        "description": "Educational Market Data Newsletter + 2000–2025 Historical Statistical Workbook (SMH × XLV + SGOV 2-Pillar Historical Case Study — Strictly Non-Advisory Educational Publisher)."
      }},
      {{
        "@type": "SoftwareApplication",
        "@id": "https://truthofmarket.com/#software",
        "name": "TruthOfMarket Historical Sector Backtest Explorer",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "url": "https://truthofmarket.com/",
        "publisher": {{
          "@id": "https://truthofmarket.com/#organization"
        }},
        "description": "Educational Market Data Newsletter + 2000–2025 Historical Statistical Workbook (SMH × XLV + SGOV 2-Pillar Historical Case Study — Strictly Non-Advisory Educational Publisher).",
        "offers": [
          {{
            "@type": "Offer",
            "name": "Monthly Research Pass ($29/mo)",
            "price": "29.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://whop.com/checkout/plan_xVJeNwyrDef8T"
          }},
          {{
            "@type": "Offer",
            "name": "Annual Research Pass ($199/yr)",
            "price": "199.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://whop.com/checkout/plan_9sdgFI753ucXQ"
          }}
        ]
      }}
    ]
  }}
  </script>
  <script async defer src="https://js.whop.com/static/checkout/loader.js"></script>
  <script src="/hq_member_crm_client.js" defer></script>
  <script src="/tom_payment_waitlist.js" defer></script>
  <script type="module" crossorigin src="./assets/{js_name}?v=20261119whop"></script>
  <link rel="stylesheet" crossorigin href="./assets/{css_name}?v=20261119whop" />
  <script>
  /* === HQ Edge Real-Human Visitor & Signup Helper (tom_truthofmarket) === */
  (function(){{
    try {{
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      var ns = 'tom_truthofmarket';
      window.trackTomFreeSignup = function(emailAddr) {{
        try {{
          var h = (location && location.hostname) || '';
          if (!h || h === 'localhost' || h === '127.0.0.1') return;
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/signup', {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/signup_total', {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
        }} catch (e) {{}}
      }};
    }} catch (e) {{}}
  }})();
  </script>
</head>
<body class="pw-body-reset" style="background:#FBFBF9;color:#0F172A;font-size:18px;line-height:1.75;">
  <div id="app">
    <main id="tom-retirement-architect" class="pw-shell">
      <header class="pw-masthead">
        <button type="button" class="pw-brand-btn" data-pw-go-home="1">
          <span class="pw-wordmark">TRUTH OF MARKET</span>
          <span class="pw-submark">Independent Market Data &amp; Educational Research</span>
        </button>
        <button type="button" class="pw-signin-link" id="btnOpenPwRestoreModal">Member Sign-In / Restore</button>
      </header>

      <!-- Screen 0: Above-the-Fold Instant Start CTA + Live Market Temperature + Founding Note & 2000-2025 Simulation Table -->
      <section id="pwScreen0" data-pw-screen="0">
        <div class="pw-kicker">INDEPENDENT MARKET DATA &amp; EDUCATIONAL RESEARCH</div>
        <h1 class="pw-serif-h1">Why quiet two-pillar discipline outlasts loud stock picking.</h1>

        <div class="pw-live-temp-pill" id="tomLiveTempBadge" role="status" aria-live="polite">
          <span class="pw-live-dot" aria-hidden="true"></span>
          <span id="tomLiveTempText">Data As Of: {as_of_date} &middot; Sector Temperature: {fg_int} / 100 ({reg_badge_str})</span>
        </div>

        <div class="pw-primary-cta-wrap pw-above-fold-cta">
          <button type="button" class="pw-btn-primary pw-btn-emerald" id="btnStartPwStepUp" data-pw-start-stepup="1">
            Explore Historical Sector Backtest (4 Steps) &rarr;
          </button>
          <span class="pw-cta-caption">Instant free 2000&ndash;2025 historical study ratio &amp; drawdown comparison &middot; Zero email wall</span>
        </div>

        <figure class="pw-editorial-figure">
          <div class="pw-editorial-plate">
            <img src="/images/tom-private-wealth-study.jpg" alt="Sunlit coastal study desk overlooking quiet morning harbor water" width="1200" height="675" loading="eager" decoding="async" />
          </div>
          <figcaption class="pw-editorial-caption">Quiet empirical study over daily market noise &mdash; comparing two-pillar sector resilience across 25 years of market cycles.</figcaption>
        </figure>

        <div class="pw-manifesto">
          <p>
            Most households approaching or living in retirement do not lose sleep&mdash;or hard-earned savings&mdash;because they ignored the market. They lose both because financial media pushes savers to chase dozens of noisy stock stories at once, quietly drifting into pure technology concentration right before a multi-year downturn.
          </p>
          <p>
            We built <strong>Truth of Market</strong> as an independent, strictly non-advisory educational research publisher. Rather than issuing speculative trade alerts, our historical research studies one enduring empirical structure: pairing secular semiconductor innovation (<strong>SMH</strong>) with non-cyclical healthcare cash flows (<strong>XLV</strong>) and short-term US Treasury reserves (<strong>SGOV</strong>).
          </p>
          <p>
            Use our <strong>Historical Sector Backtest Explorer</strong> to compare how different 2000&ndash;2025 <strong>SMH &times; XLV + SGOV</strong> historical study ratios behaved across past downturns, and explore our <strong>Educational Market Data Newsletter + 2000&ndash;2025 Historical Statistical Workbook</strong>.
          </p>
        </div>

        <div class="pw-table-card" role="region" aria-label="2000-2025 Historical Simulation Comparison">
          <div class="pw-table-header">
            <span class="pw-table-title">TABLE I &mdash; 2000&ndash;2025 HISTORICAL SECTOR STATISTICAL CASE STUDY</span>
            <span class="pw-table-meta">Non-Leveraged 1x Spot Index / ETF Series</span>
          </div>
          <div class="pw-table-scroll">
            <table class="pw-sim-table">
              <thead>
                <tr>
                  <th>Historical Case Study</th>
                  <th>Annualized (CAGR)</th>
                  <th>Worst Crisis DD</th>
                  <th>Recovery Period</th>
                  <th>Return / DD Ratio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S&amp;P 500 Index Alone</td>
                  <td>~7.9%</td>
                  <td class="pw-dd-neg">-50.9%</td>
                  <td>56 mos</td>
                  <td>0.16x</td>
                </tr>
                <tr>
                  <td>Traditional 60 / 40 Mix</td>
                  <td>~6.4%</td>
                  <td class="pw-dd-neg">-32.3%</td>
                  <td>31 mos</td>
                  <td>0.20x</td>
                </tr>
                <tr>
                  <td>100% Semiconductor (SMH Alone)</td>
                  <td>~11.8%</td>
                  <td class="pw-dd-neg">-74.6%</td>
                  <td>89 mos</td>
                  <td>0.16x</td>
                </tr>
                <tr class="is-featured">
                  <td>SMH &times; XLV 2-Pillar Historical Study</td>
                  <td>~11.4%</td>
                  <td class="pw-dd-neg">-27.8%</td>
                  <td>19 mos</td>
                  <td class="pw-eff-pos">0.41x</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="pw-table-note">
            2000&ndash;2025 historical statistical case study (semi-annual systematic ratio reset on non-leveraged 1x spot series) published strictly for general educational research; past historical statistics never guarantee future performance.
          </p>
        </div>

        <div class="pw-primary-cta-wrap">
          <button type="button" class="pw-btn-primary pw-btn-emerald" data-pw-start-stepup="1">
            Historical Sector Backtest Explorer (4 Steps) &rarr;
          </button>
          <span class="pw-cta-caption">Four brief study parameters &middot; Instant free baseline summary &middot; No brokerage login required</span>
        </div>
      </section>

      <!-- Screen 1: Focused 1-Question-at-a-Time Historical Sector Backtest Explorer (Step 1 of 4 -> 4 of 4) -->
      <section id="pwScreen1" data-pw-screen="1" style="display:none;">
        <div class="pw-step-card">
          <div class="pw-step-top">
            <button type="button" class="pw-back-btn" id="btnPwStepBack">&larr; Back</button>
            <span class="pw-step-counter" id="pwStepCounterLabel">STEP 01 OF 04</span>
          </div>
          <div class="pw-progress-line" aria-hidden="true">
            <span class="pw-progress-fill" id="pwStepProgressFill" style="width:25%;"></span>
          </div>

          <div data-pw-qpane="1">
            <h2 class="pw-q-title">Which historical case-study profile would you like to explore?</h2>
            <p class="pw-q-sub">Select the long-term study profile to compare across the 2000&ndash;2025 dataset.</p>
            <div class="pw-option-list" role="radiogroup" aria-label="Historical Study Profile">
              <button type="button" class="pw-opt-btn" data-pw-field="objective" data-pw-val="growth">
                <div class="pw-opt-head"><span><span class="pw-opt-num">I</span><span class="pw-opt-title">Secular Growth &amp; Semiconductor Study</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Examine higher semiconductor compounding weight (SMH) paired with healthcare drawdown buffering (XLV).</span>
              </button>
              <button type="button" class="pw-opt-btn is-selected" data-pw-field="objective" data-pw-val="balanced">
                <div class="pw-opt-head"><span><span class="pw-opt-num">II</span><span class="pw-opt-title">Balanced Retirement Cash-Flow Study</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Compare balanced secular growth (SMH) and non-cyclical healthcare cash flows (XLV) across full cycles.</span>
              </button>
              <button type="button" class="pw-opt-btn" data-pw-field="objective" data-pw-val="preservation">
                <div class="pw-opt-head"><span><span class="pw-opt-num">III</span><span class="pw-opt-title">Defensive Stability &amp; Treasury Reserve Study</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Study defensive healthcare (XLV) and 0&ndash;3 month US Treasury liquidity (SGOV) during deep downturns.</span>
              </button>
            </div>
          </div>

          <div data-pw-qpane="2" style="display:none;">
            <h2 class="pw-q-title">Select a sample dollar scale for worksheet illustration.</h2>
            <p class="pw-q-sub">Computed locally in your browser to illustrate historical dollar-bucket math across 401(k), IRA, and taxable accounts.</p>
            <div class="pw-scale-grid" role="radiogroup" aria-label="Sample Portfolio Scale">
              <button type="button" class="pw-scale-btn" data-pw-field="scale" data-pw-val="50000">$50,000</button>
              <button type="button" class="pw-scale-btn" data-pw-field="scale" data-pw-val="150000">$150,000</button>
              <button type="button" class="pw-scale-btn is-selected" data-pw-field="scale" data-pw-val="300000">$300,000</button>
              <button type="button" class="pw-scale-btn" data-pw-field="scale" data-pw-val="500000">$500,000</button>
              <button type="button" class="pw-scale-btn" data-pw-field="scale" data-pw-val="1000000">$1,000,000+</button>
            </div>
          </div>

          <div data-pw-qpane="3" style="display:none;">
            <h2 class="pw-q-title">Which historical drawdown band do you want to benchmark?</h2>
            <p class="pw-q-sub">Compare how varying defensive cushions altered historical peak-to-trough declines between 2000 and 2025.</p>
            <div class="pw-option-list" role="radiogroup" aria-label="Historical Drawdown Benchmark">
              <button type="button" class="pw-opt-btn" data-pw-field="comfort" data-pw-val="dd10">
                <div class="pw-opt-head"><span><span class="pw-opt-num">I</span><span class="pw-opt-title">-10% Low-Variance Study Band</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Models a larger short-term US Treasury reserve (SGOV) alongside XLV to study muted historical volatility.</span>
              </button>
              <button type="button" class="pw-opt-btn is-selected" data-pw-field="comfort" data-pw-val="dd18">
                <div class="pw-opt-head"><span><span class="pw-opt-num">II</span><span class="pw-opt-title">-18% Balanced Study Band</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Models the balanced SMH &times; XLV + SGOV historical case study across 2000, 2008, and 2022.</span>
              </button>
              <button type="button" class="pw-opt-btn" data-pw-field="comfort" data-pw-val="dd25">
                <div class="pw-opt-head"><span><span class="pw-opt-num">III</span><span class="pw-opt-title">-25% Long-Horizon Compounding Band</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Models higher semiconductor equity exposure over multi-decade compounding windows.</span>
              </button>
            </div>
          </div>

          <div data-pw-qpane="4" style="display:none;">
            <h2 class="pw-q-title">What technology concentration benchmark should we compare against?</h2>
            <p class="pw-q-sub">Used to contrast single-sector concentration against the two-pillar historical study ratio.</p>
            <div class="pw-option-list" role="radiogroup" aria-label="Comparison Tech Concentration">
              <button type="button" class="pw-opt-btn is-selected" data-pw-field="techMix" data-pw-val="tech_high">
                <div class="pw-opt-head"><span><span class="pw-opt-num">I</span><span class="pw-opt-title">Over 70% Tech &amp; Semiconductor Concentration</span></span></div>
                <span class="pw-opt-desc">Compare heavy single-sector cyclicality against healthcare defensive ballast.</span>
              </button>
              <button type="button" class="pw-opt-btn" data-pw-field="techMix" data-pw-val="tech_mid">
                <div class="pw-opt-head"><span><span class="pw-opt-num">II</span><span class="pw-opt-title">30% to 70% Broad Equity Mix</span></span></div>
                <span class="pw-opt-desc">Compare a diversified equity mix against the SMH &times; XLV + SGOV historical case study.</span>
              </button>
              <button type="button" class="pw-opt-btn" data-pw-field="techMix" data-pw-val="tech_low">
                <div class="pw-opt-head"><span><span class="pw-opt-num">III</span><span class="pw-opt-title">Under 30% Tech or Primarily Cash Reserves</span></span></div>
                <span class="pw-opt-desc">Compare cash-heavy holdings against a measured two-pillar historical baseline.</span>
              </button>
            </div>
            <div style="margin-top:24px;">
              <button type="button" class="pw-btn-primary pw-btn-emerald" id="btnSubmitPwAssessment" style="width:100%;">
                View Free Historical Study Ratio &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Screen 2: Immediate Free Historical Study Summary (ZERO Email Wall) + Optional Save Box -->
      <section id="tomMorningBellClub" data-pw-screen="2" style="display:none;">
        <div class="pw-gate-card">
          <div class="pw-profile-strip">
            <span id="pwProfileSummaryLine">Study Profile: Balanced Cash-Flow &middot; $300,000 Sample &middot; -18% Study Band</span>
            <button type="button" class="pw-inline-link" id="btnEditPwInputs">Edit Study Inputs</button>
          </div>

          <div id="pwFreeBaselineSummaryView">
            <div class="pw-kicker">HISTORICAL SECTOR BACKTEST EXPLORER &middot; FREE STUDY SUMMARY</div>
            <h2 class="pw-serif-h2" id="pwUnlockedRatioHeadline">55% SMH &middot; 35% XLV &middot; 10% SGOV Historical Study Ratio</h2>
            <p style="margin:0;color:#475569;font-size:0.94rem;" id="pwUnlockedRationaleText">
              Computed from 2000&ndash;2025 non-leveraged 1x ETF historical series for self-directed educational study. Need basic brokerage order terminology? <button type="button" class="pw-inline-link" id="tomFreeStarterManual">Open the complimentary $0 US Brokerage Limit-Order Reference</button>.
            </p>

            <div class="pw-ratio-bar" id="pwRatioVisualBar" aria-hidden="true">
              <span style="width:55%;background:#0F172A;"></span>
              <span style="width:35%;background:#065F46;"></span>
              <span style="width:10%;background:#94A3B8;"></span>
            </div>

            <div class="pw-ratio-grid" id="pwRatioCellsGrid">
              <div class="pw-ratio-cell">
                <div class="pw-ratio-ticker">SMH &middot; GROWTH PILLAR</div>
                <div class="pw-ratio-pct" id="pwPctSmh">55%</div>
                <div class="pw-ratio-name">Semiconductor 1x ETF</div>
              </div>
              <div class="pw-ratio-cell">
                <div class="pw-ratio-ticker">XLV &middot; DEFENSIVE PILLAR</div>
                <div class="pw-ratio-pct" id="pwPctXlv">35%</div>
                <div class="pw-ratio-name">US Healthcare 1x ETF</div>
              </div>
              <div class="pw-ratio-cell">
                <div class="pw-ratio-ticker">SGOV &middot; TREASURY RESERVE</div>
                <div class="pw-ratio-pct" id="pwPctSgov">10%</div>
                <div class="pw-ratio-name">0&ndash;3 Mo US T-Bill</div>
              </div>
            </div>

            <div class="pw-drawdown-compare-box" role="region" aria-label="2000-2025 Historical Crisis Drawdown Comparison">
              <div class="pw-drawdown-compare-title">2000&ndash;2025 HISTORICAL CRISIS DRAWDOWN COMPARISON</div>
              <div class="pw-drawdown-compare-grid">
                <div class="pw-dd-cmp-item">
                  <span class="pw-dd-cmp-label">100% Semiconductor (SMH Alone)</span>
                  <strong class="pw-dd-cmp-val">-74.6% Max DD &middot; 89 mos recovery</strong>
                </div>
                <div class="pw-dd-cmp-item">
                  <span class="pw-dd-cmp-label">S&amp;P 500 Index Alone</span>
                  <strong class="pw-dd-cmp-val">-50.9% Max DD &middot; 56 mos recovery</strong>
                </div>
                <div class="pw-dd-cmp-item is-highlight">
                  <span class="pw-dd-cmp-label">Selected SMH &times; XLV + SGOV Study Ratio</span>
                  <strong class="pw-dd-cmp-val" id="pwStudyDrawdownCompareVal">~-24.8% Hist. Crisis DD &middot; ~17 mos recovery</strong>
                </div>
              </div>
            </div>
          </div>

          <div id="tom-passwordless-club-signup" class="pw-save-summary-box">
            <div class="pw-kicker" style="margin-bottom:6px;">FREE MORNING RESEARCH NOTES &middot; ZERO PASSWORD</div>
            <h3 class="pw-save-summary-title">Save My Study Summary &amp; Receive Morning Research Notes (Free)</h3>
            <p style="margin:0;color:#475569;font-size:0.92rem;">
              Enter your email to save this historical study summary and receive our calm morning market data newsletter (1-click unsubscribe anytime).
            </p>
            <form class="pw-email-form" id="pwFreeGateForm" novalidate>
              <input type="text" name="website_hp" id="pwGateHp" tabindex="-1" autocomplete="off" aria-hidden="true" style="display:none;" />
              <input type="email" id="pwGateEmailInput" class="pw-email-input" required autocomplete="email" placeholder="Enter your email address" aria-label="Email address" />
              <button type="submit" class="pw-btn-primary pw-btn-emerald" id="btnPwGateSubmit">
                Save Study Summary (Free) &rarr;
              </button>
            </form>
            <div id="pwGateStatusMsg" role="status" aria-live="polite" style="display:none;margin-top:10px;font-size:0.88rem;color:#065F46;font-weight:600;"></div>
          </div>
        </div>
      </section>

      <!-- Screen 3: 2-Tier Whop Research Passes (#pricing) -->
      <section id="pricing" class="pw-tiers-section" data-pw-screen="3" style="display:none;">
        <div class="pw-kicker">INDEPENDENT MARKET DATA &amp; EDUCATIONAL RESEARCH PASSES</div>
        <h2 class="pw-serif-h2" id="pwPricingHeadline">Educational Market Data Newsletter + 2000&ndash;2025 Historical Statistical Workbook.</h2>
        <p style="margin:0;color:#475569;font-size:0.95rem;" id="pwPricingSubcopy">
          SMH &times; XLV + SGOV 2-Pillar Historical Case Study &mdash; Strictly Non-Advisory Educational Publisher. Explore daily public market temperature data notes and the complete historical statistical workbook.
        </p>

        <div class="pw-tier-grid">
          <div class="pw-tier-card">
            <div>
              <div class="pw-tier-kicker">TIER I &middot; MONTHLY RESEARCH PASS</div>
              <h3 class="pw-tier-name">Monthly Research Pass</h3>
              <div class="pw-tier-price">$29 <span>/ month</span></div>
              <div class="pw-tier-saving">Flexible month-to-month access &middot; Cancel anytime</div>
              <ul class="pw-tier-list">
                <li><strong>Educational Market Data Newsletter</strong> delivered before the US market open (0&ndash;100 public sector temperature &amp; historical regime study notes)</li>
                <li><strong>2000&ndash;2025 Historical Statistical Workbook (Monthly Edition)</strong> comparing SMH &times; XLV + SGOV historical case-study cohorts</li>
                <li><strong>Sample Dollar-Scale Educational Worksheet</strong> illustrating tax-location concepts across 401(k), IRA, and taxable accounts</li>
              </ul>
            </div>
            <a href="https://whop.com/checkout/plan_xVJeNwyrDef8T" class="pw-btn-primary whop-checkout-button" data-whop-checkout data-whop-plan="monthly" data-tom-paid-plan="monthly" style="width:100%;">
              Select Monthly Research Pass &mdash; $29/mo &rarr;
            </a>
          </div>

          <div class="pw-tier-card is-annual">
            <div>
              <div class="pw-tier-kicker">TIER II &middot; ANNUAL RESEARCH PASS &middot; SAVE 43%</div>
              <h3 class="pw-tier-name">Annual Research Pass</h3>
              <div class="pw-tier-price">$199 <span>/ year</span></div>
              <div class="pw-tier-saving">Equivalent to $16.58/mo (Save 43% vs. monthly)</div>
              <ul class="pw-tier-list">
                <li><strong>Full 12 Months of the Educational Market Data Newsletter</strong> covering daily SMH &times; XLV + SGOV public indicator readings</li>
                <li><strong>Complete 2000&ndash;2025 Historical Statistical Workbook &amp; Reference Masterbook PDF</strong> (Dot-Com, 2008 &amp; 2022 drawdown case studies + retirement withdrawal math)</li>
                <li><strong>Annual Household Cash-Flow &amp; Semi-Annual Review Educational Workbook</strong></li>
              </ul>
            </div>
            <a href="https://whop.com/checkout/plan_9sdgFI753ucXQ" class="pw-btn-primary pw-btn-emerald whop-checkout-button" data-whop-checkout data-whop-plan="annual" data-tom-paid-plan="annual" style="width:100%;">
              Select Annual Research Pass &mdash; $199/yr &rarr;
            </a>
          </div>
        </div>

        <p class="pw-mor-note">
          Secure Checkout via Whop.com (Global Card / Apple Pay / Google Pay) &middot; 14-Day Refund Policy &middot; Cancel anytime in one click &middot; Strictly Non-Advisory Educational Publisher.
        </p>
      </section>

      <!-- Screen 4: Paid Research Vault, Custom Dollar SMH x XLV + SGOV Workbook PDF, Stress Test, 401k/IRA Roadmap & Monthly Report Card -->
      <section id="tomPaidScreen4Vault" class="pw-tiers-section" data-pw-screen="4" style="display:none;margin-top:28px;">
        <div class="pw-gate-card" style="border:1.5px solid #065F46;background:#FFFFFF;">
          <div class="pw-kicker" style="color:#065F46;">PAID RESEARCH VAULT &middot; PERMANENT CROSS-DEVICE EDITION</div>
          <h2 class="pw-serif-h2" id="tomScreen4Headline">Custom Dollar SMH &times; XLV + SGOV Historical Workbook &amp; Stress-Test Edition</h2>
          <p style="margin:0 0 16px;color:#475569;font-size:0.95rem;">
            Adjust your household sample dollar scale below to update your 1:1 educational worksheet, -35% market-crash stress test, 401(k)/IRA tax-location study roadmap, and large-print Fidelity/Schwab/Vanguard 5-minute limit-order guide.
          </p>

          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:14px 16px;background:#F8FAFC;border:1px solid #CBD5E1;border-radius:8px;margin-bottom:18px;">
            <label for="tomCustomDollarInput" style="font-weight:700;font-size:0.95rem;color:#0F172A;">Household Sample Scale ($ USD):</label>
            <input type="number" id="tomCustomDollarInput" min="10000" max="10000000" step="10000" value="300000" style="padding:10px 14px;border:1px solid #94A3B8;border-radius:6px;font-size:1.05rem;font-weight:700;width:180px;font-variant-numeric:tabular-nums;" />
            <button type="button" class="pw-btn-primary pw-btn-emerald" id="btnDownloadTomCustomPdf">
              Download / Print 1:1 Custom 4-Page PDF &rarr;
            </button>
          </div>

          <div id="tomScreen4DollarTable" class="pw-table-card" style="margin-bottom:18px;"></div>
          <div id="tomScreen4StressTest" class="pw-table-card" style="margin-bottom:18px;"></div>
          <div id="tomScreen4TaxRoadmap" class="pw-table-card" style="margin-bottom:18px;padding:18px;"></div>
          <div id="tomScreen4BrokerGuide" class="pw-table-card" style="margin-bottom:18px;padding:18px;"></div>
          <div id="tomScreen4MonthlyCard" class="pw-table-card" style="margin-bottom:18px;padding:18px;"></div>

          <div style="padding:16px;background:#ECFDF5;border:1px solid #6EE7B7;border-radius:8px;margin-bottom:14px;">
            <div class="pw-kicker" style="color:#065F46;margin-bottom:6px;">60-SECOND PERMANENT CROSS-DEVICE MAGIC LINK &amp; 14-DAY REFUND DESK</div>
            <p style="margin:0 0 10px;font-size:0.9rem;color:#064E3B;">
              Send your permanent cross-device restore link (works on any phone, tablet, or PC with zero password) and welcome pack directly to your email:
            </p>
            <form id="tomPaidMagicEmailForm" class="pw-email-form" novalidate>
              <input type="email" id="tomPaidMagicEmailInput" class="pw-email-input" placeholder="Enter your email for permanent cross-device link" autocomplete="email" />
              <button type="submit" class="pw-btn-primary pw-btn-emerald" id="btnSendTomMagicLink">Email My Permanent Link &rarr;</button>
            </form>
            <div id="tomPaidMagicStatus" role="status" aria-live="polite" style="display:none;margin-top:8px;font-size:0.88rem;font-weight:600;color:#065F46;"></div>
            <div style="margin-top:10px;font-size:0.84rem;color:#334155;">
              14-Day Refund Guarantee &amp; 1-Click Support: <a id="tomOneClickRefundLink" href="mailto:beable9489@gmail.com?subject=TOM%2014-Day%20Refund%20or%20Support" style="color:#065F46;font-weight:700;text-decoration:underline;">Request 1-Click Support or 14-Day Refund (beable9489@gmail.com)</a>
            </div>
          </div>

          <div id="tomSatisfactionMount"></div>
        </div>
      </section>
    </main>

    <footer class="pw-legal-footer">
      <div class="pw-legal-links">
        <span>TruthOfMarket Research</span>
        <span>&middot;</span>
        <a href="/terms.html">Terms</a>
        <span>&middot;</span>
        <a href="/privacy.html">Privacy</a>
        <span>&middot;</span>
        <a href="/refund.html">Refund</a>
        <span>&middot;</span>
        <a href="/contact.html">Contact</a>
        <span>&middot;</span>
        <a href="https://www.youtube.com/channel/UCbxWByxJntRqoweWy-4QnqA" target="_blank" rel="noopener">YouTube @TruthOfMarketUS</a>
        <span>&middot;</span>
        <a href="https://www.instagram.com/truthofmarket/" target="_blank" rel="noopener">Instagram @truthofmarket</a>
        <span>&middot;</span>
        <a href="mailto:beable9489@gmail.com">beable9489@gmail.com</a>
      </div>
      <p class="pw-legal-disclaimer">
        TruthOfMarket is an independent, strictly non-advisory educational research publisher providing general market data newsletters and 2000&ndash;2025 historical statistical workbooks only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice.
      </p>
    </footer>

    <!-- Member Sign-In / Restore Modal (0 Emojis) -->
    <div class="pw-modal-backdrop" id="pwRestoreModal" role="dialog" aria-modal="true" aria-labelledby="pwRestoreTitle">
      <div class="pw-modal-dialog">
        <div class="pw-modal-header-row">
          <span class="pw-kicker" style="margin:0;">MEMBER ACCESS &amp; RESTORE</span>
          <button type="button" class="pw-modal-close-btn" id="btnClosePwRestoreModal" aria-label="Close Member Sign-In Modal">Close</button>
        </div>
        <h3 class="pw-serif-h2" id="pwRestoreTitle" style="font-size:1.65rem;">Restore Your Saved Study Ratio or Research Pass</h3>
        <p style="margin:0 0 16px;font-size:0.92rem;color:#475569;">
          Enter the email address used during registration to reopen your saved SMH &times; XLV + SGOV historical study summary, or enter a Whop receipt / pass reference if applicable.
        </p>
        <form id="pwRestoreForm" novalidate style="display:flex;flex-direction:column;gap:12px;">
          <input type="email" id="pwRestoreEmailInput" class="pw-email-input" style="min-width:180px;width:100%;box-sizing:border-box;" placeholder="Registered email address" autocomplete="email" />
          <input type="text" id="pwRestoreLicenseInput" class="pw-email-input" style="min-width:180px;width:100%;box-sizing:border-box;" placeholder="Optional: Whop receipt or pass ID" autocomplete="off" />
          <button type="submit" class="pw-btn-primary pw-btn-emerald" style="width:100%;">Restore Session &rarr;</button>
        </form>
        <div id="pwRestoreStatus" role="status" aria-live="polite" style="display:none;margin-top:12px;font-size:0.88rem;color:#065F46;"></div>
      </div>
    </div>

    <!-- Complimentary $0 Brokerage Safe-Order Guide Modal (0 Emojis) -->
    <div class="pw-modal-backdrop" id="pwStarterGuideModal" role="dialog" aria-modal="true" aria-labelledby="pwStarterGuideTitle">
      <div class="pw-modal-dialog">
        <div class="pw-modal-header-row">
          <span class="pw-kicker" style="margin:0;">COMPLIMENTARY EDUCATIONAL REFERENCE ($0)</span>
          <button type="button" class="pw-modal-close-btn" id="btnClosePwStarterGuideModal" aria-label="Close Brokerage Reference Modal">Close</button>
        </div>
        <h3 class="pw-serif-h2" id="pwStarterGuideTitle" style="font-size:1.65rem;">US Brokerage Limit-Order &amp; ETF Terminology Guide</h3>
        <div style="font-size:0.92rem;line-height:1.7;color:#334155;display:flex;flex-direction:column;gap:12px;">
          <div>
            <strong style="color:#0F172A;">I. Limit Orders vs. Market Orders</strong><br/>
            On self-directed platforms such as Fidelity, Charles Schwab, or Vanguard, a <em>Limit Order</em> specifies a maximum purchase price rather than accepting temporary bid-ask spread widening during the first 15 minutes after the 9:30 AM ET open.
          </div>
          <div>
            <strong style="color:#0F172A;">II. Non-Leveraged 1x Spot Sector ETFs</strong><br/>
            Both <strong>SMH</strong> (Semiconductors) and <strong>XLV</strong> (US Healthcare) are unleveraged 1x spot ETFs free from daily 3x leveraged volatility-reset decay.
          </div>
          <div>
            <strong style="color:#0F172A;">III. Short-Term US Treasury Liquidity Reference</strong><br/>
            In historical case studies, short-term household reserve buckets are commonly modeled using 0&ndash;3 month US Treasury bills (<strong>SGOV</strong>) or government money-market funds (SPAXX / SWVXX / VMFXX).
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""

    feed_xml = rss_xml.replace(
        'href="https://truthofmarket.com/rss.xml" rel="self"',
        'href="https://truthofmarket.com/feed.xml" rel="self"',
    )

    (PUB / "index.html").write_text(index_html, encoding="utf-8")
    (PUB / "rss.xml").write_text(rss_xml, encoding="utf-8")
    (PUB / "feed.xml").write_text(feed_xml, encoding="utf-8")
    (PUB / "static_api").mkdir(parents=True, exist_ok=True)
    (PUB / "static_api" / "health.json").write_text(health_json, encoding="utf-8")
    (ROOT / "static_api" / "health.json").write_text(health_json, encoding="utf-8")

    for stale_rel in [
        "instagram_us_setup.html",
        "flow_10_promo_shorts_board.html",
        "flow_10_prompts_studio.html",
        "flow_ep11_20_prompts_studio.html",
        "static_api/stocks_pro.json",
        "static_api/smh_xlv_fear_greed_history.csv",
    ]:
        sp = PUB / stale_rel
        if sp.exists():
            sp.unlink()

    for crm_name in ("hq_member_crm_client.js", "hq-mailing-endpoint.json", "tom_payment_waitlist.js"):
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
        elif crm_name != "tom_payment_waitlist.js" and root_crm.exists() and pub_crm.exists() and root_crm.stat().st_mtime > pub_crm.stat().st_mtime:
            src_crm = root_crm
        if src_crm.exists() and src_crm.resolve() != pub_crm.resolve():
            shutil.copy2(src_crm, pub_crm)

    for target_dir in [DIST, ROOT_DIST, ROOT]:
        assets_d = target_dir / "assets"
        assets_d.mkdir(parents=True, exist_ok=True)
        if target_dir == DIST:
            for orphan in list(assets_d.glob("index-*")):
                if orphan.name not in (js_name, css_name):
                    orphan.unlink()
        (assets_d / js_name).write_text(bundled_js, encoding="utf-8")
        (assets_d / css_name).write_text(css_raw, encoding="utf-8")
        for item in PUB.iterdir():
            if item.name in ("index.html", "instagram_us_setup.html"):
                continue
            dest = target_dir / item.name
            if item.is_dir():
                shutil.copytree(item, dest, dirs_exist_ok=True)
            else:
                if item.resolve() != dest.resolve():
                    shutil.copy2(item, dest)
        for crm_name in ("hq_member_crm_client.js", "hq-mailing-endpoint.json", "tom_payment_waitlist.js"):
            pub_crm = PUB / crm_name
            dest_crm = target_dir / crm_name
            if pub_crm.exists() and pub_crm.resolve() != dest_crm.resolve():
                shutil.copy2(pub_crm, dest_crm)
        (target_dir / "index.html").write_text(index_html, encoding="utf-8")
        (target_dir / "rss.xml").write_text(rss_xml, encoding="utf-8")
        (target_dir / "feed.xml").write_text(feed_xml, encoding="utf-8")
        (target_dir / "static_api").mkdir(parents=True, exist_ok=True)
        (target_dir / "static_api" / "health.json").write_text(health_json, encoding="utf-8")
        for stale_rel in [
            "instagram_us_setup.html",
            "flow_10_promo_shorts_board.html",
            "flow_10_prompts_studio.html",
            "flow_ep11_20_prompts_studio.html",
            "static_api/stocks_pro.json",
            "static_api/smh_xlv_fear_greed_history.csv",
            "assets/index-BPaRJGLB.css",
            "assets/index-B8W1yRf6.js",
            "assets/index-DIaYcqm4.css",
            "assets/index-JnmWwMmW.css",
        ]:
            tp = target_dir / stale_rel
            if tp.exists():
                tp.unlink()
        if target_dir in (DIST, ROOT_DIST) and (target_dir / "samples").exists():
            shutil.rmtree(target_dir / "samples", ignore_errors=True)

    print(f"Built & synced frontend/dist, ./dist, and root static bundle ({js_name}, {css_name})")


if __name__ == "__main__":
    main()
