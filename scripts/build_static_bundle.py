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
    celh_low_ref = 27.34
    celh_up_ref = 60.08

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
        "desk": "Educational Market Data & Quantitative Research Desk",
        "services": ["TruthOfMarket", "MarketWeather"],
    }
    health_json = json.dumps(health_obj, indent=2) + "\n"

    insight_items_xml = f"""
    <item>
      <title><![CDATA[Morning Bell Market Weather Note ({as_of_date}): Sentiment Gauge at {fg_score:.1f}/100 ({regime_code}) & Calm 2-4x/Year Rebalancing]]></title>
      <link>https://truthofmarket.com/insights/daily-us-quant-regime-brief.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/insights/daily-us-quant-regime-brief.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Educational US market weather summary as of {as_of_date}: $SMH ${smh_close:.2f} ({smh_dd_pct:.2f}% off 52W high), $SMH:$XLV barbell calculator context, and SGOV · SCHD · JEPI · VOO retirement allocation study.]]></description>
    </item>
    <item>
      <title><![CDATA[Understanding Moving-Average Confirmation: 26.8-Year Empirical Factor Study (2000-2026)]]></title>
      <link>https://truthofmarket.com/insights/pw-rsi-right-side-breakout-methodology.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/insights/pw-rsi-right-side-breakout-methodology.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Educational quantitative study examining 52-week drawdown recovery, 20-day and 60-day moving average alignment, and 10-day relative volume across liquid US equities.]]></description>
    </item>
    <item>
      <title><![CDATA[Sector Correlation & Rebalancing Math: Studying the $SMH and $XLV Barbell (2000-2026)]]></title>
      <link>https://truthofmarket.com/insights/smh-xlv-80-20-barbell-drawdown-study.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/insights/smh-xlv-80-20-barbell-drawdown-study.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Empirical educational study of combining Semiconductors ($SMH) with Healthcare ($XLV) under calm 2-4x/year weight rebalancing.]]></description>
    </item>
    <item>
      <title><![CDATA[The Mathematics of Drawdown Asymmetry: Why Portfolio Cushions Preserve Long-Term Compounding]]></title>
      <link>https://truthofmarket.com/insights/rule-1-minus-9-percent-stop-loss-math.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/insights/rule-1-minus-9-percent-stop-loss-math.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Educational compounding math showing how deep drawdowns require nonlinear recovery gains, and how short-term US Treasury cushions reduce sequence-of-returns risk.]]></description>
    </item>"""

    rss_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TruthOfMarket | US 401k/IRA Retirement Cashflow &amp; Safe Rebalancing Calculator</title>
    <link>https://truthofmarket.com/</link>
    <atom:link href="https://truthofmarket.com/rss.xml" rel="self" type="application/rss+xml" />
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub" />
    <description>Self-directed educational calculator software for US 401(k)/IRA retirement cashflow simulation, 3-color market weather visualization, and calm 2-4x/year SGOV · SCHD · JEPI · VOO portfolio rebalancing.</description>
    <language>en-US</language>
    <lastBuildDate>{rfc_now}</lastBuildDate>{insight_items_xml}
    <item>
      <title><![CDATA[TruthOfMarket — 30-Second US 401(k)/IRA Retirement Cashflow & Safe Rebalancing Calculator (As of {as_of_date})]]></title>
      <link>https://truthofmarket.com/</link>
      <guid isPermaLink="true">https://truthofmarket.com/</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Self-directed educational retirement income calculator modeling SGOV (US T-Bill Cushion), SCHD (Dividend Growth), JEPI (Monthly Paycheck), and VOO (S&P 500 Core) with calm 2-4x/year weight rebalancing.]]></description>
    </item>
    <item>
      <title><![CDATA[Public Market Weather & Sector Sentiment Gauge ({fg_score:.1f} {regime_code}) — $SMH/$XLV Barbell Calculator]]></title>
      <link>https://truthofmarket.com/semi-fear-greed.html</link>
      <guid isPermaLink="true">https://truthofmarket.com/semi-fear-greed.html</guid>
      <pubDate>{rfc_now}</pubDate>
      <description><![CDATA[Self-directed educational sector sentiment gauge ($SMH Close ${smh_close:.2f}, {smh_dd_pct:.2f}% from 52W High as of {as_of_date}) and periodic $SMH vs. $XLV barbell weight calculator.]]></description>
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
    return health_json, rss_xml


def main() -> None:
    PUB.mkdir(parents=True, exist_ok=True)

    # Export standalone tom_payment_waitlist.js to frontend/public/ so all static subpages share unified PAYMENT_CONFIG & beacons
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

    # Generate static /pro-swing.html, /semi-fear-greed.html, /stocks/*.html, /compare/*.html, /insights/*.html, and canonical sitemap.xml
    seo_dir_html = generate_all_seo_pages(js_name=js_name, css_name=css_name)

    index_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <script>
  window.__DEFAULT_VIEW__ = 'rightside';
  window.PAYMENT_CONFIG = {{
    PROVIDER: 'polar_sh',
    DIVISION: 'TOM',
    STORE_SLOT: 'FINANCE_STORE_SLOT',
    STORE_LIVE_READY: false,
    POLAR_CHECKOUT_URLS: {{
      monthly_29: '',
      annual_199: ''
    }},
    POLAR_TOM_MONTHLY_URL: '',
    POLAR_TOM_ANNUAL_URL: '',
    SUPPORT_EMAIL: 'beable9489@gmail.com'
  }};
  </script>
  <meta charset="UTF-8" />
  <meta name="google-site-verification" content="nAGlJMEUUPifbzSd8X4PCaBIyr3DtTwaa1a-q9zkbBc" />
  <meta name="google-site-verification" content="G99bl17UU6iKgNm5ndGcSWp0dHFpJ0MjJqBBp0Exfx0" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Turn Your 401(k) &amp; Savings Into Calm, Reliable Monthly Retirement Income | TruthOfMarket</title>
  <meta name="description" content="Self-directed US 401k/IRA Retirement Cashflow &amp; Safe Rebalancing Calculator Software. Simulate monthly income with SGOV (T-Bill Cushion), SCHD (Dividend Growth), JEPI (Monthly Paycheck) &amp; VOO (S&amp;P 500 Core) via calm 2-4x/year rebalancing." />
  <link rel="canonical" href="https://truthofmarket.com/" />
  <link rel="alternate" type="application/rss+xml" title="TruthOfMarket US 401k/IRA Retirement Cashflow RSS Feed" href="https://truthofmarket.com/rss.xml" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="TruthOfMarket — US 401k/IRA Retirement Cashflow &amp; Safe Rebalancing Calculator" />
  <meta property="og:title" content="Turn Your 401(k) &amp; Savings Into Calm, Reliable Monthly Retirement Income | TruthOfMarket" />
  <meta property="og:description" content="Self-directed educational calculator software to simulate monthly retirement cashflow and calm 2-4x/year SGOV, SCHD, JEPI &amp; VOO portfolio weight rebalancing." />
  <meta property="og:url" content="https://truthofmarket.com/" />
  <meta property="og:image" content="https://truthofmarket.com/og-preview.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Turn Your 401(k) &amp; Savings Into Calm, Reliable Monthly Retirement Income | TruthOfMarket" />
  <meta name="twitter:description" content="30-Second US 401k/IRA Retirement Cashflow &amp; Safe Rebalancing Calculator (SGOV · SCHD · JEPI · VOO)." />
  <meta name="twitter:image" content="https://truthofmarket.com/og-preview.png" />
  <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@graph": [
      {{
        "@type": "Organization",
        "@id": "https://truthofmarket.com/#organization",
        "name": "TruthOfMarket — Educational Market Data & Quantitative Research Desk",
        "url": "https://truthofmarket.com/",
        "email": "beable9489@gmail.com",
        "logo": "https://truthofmarket.com/favicon.svg",
        "sameAs": [
          "https://www.youtube.com/@RightSideAlpha",
          "https://www.instagram.com/rightsidealpha",
          "https://x.com/rightsidealpha"
        ]
      }},
      {{
        "@type": "WebSite",
        "@id": "https://truthofmarket.com/#website",
        "url": "https://truthofmarket.com/",
        "name": "TruthOfMarket",
        "publisher": {{
          "@id": "https://truthofmarket.com/#organization"
        }},
        "description": "Self-directed educational calculator software for US 401k/IRA Retirement Cashflow & Safe Rebalancing across SGOV, SCHD, JEPI, and VOO."
      }},
      {{
        "@type": "SoftwareApplication",
        "@id": "https://truthofmarket.com/#software",
        "name": "TruthOfMarket US 401k/IRA Retirement Cashflow & Safe Rebalancing Calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "url": "https://truthofmarket.com/",
        "publisher": {{
          "@id": "https://truthofmarket.com/#organization"
        }},
        "description": "Self-directed educational market data visualization and mathematical portfolio calculator software for US 401k/IRA retirement cashflow and 2-4x/year weight rebalancing.",
        "offers": [
          {{
            "@type": "Offer",
            "name": "Monthly VIP Educational Calculator Software ($29/mo)",
            "price": "29.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://truthofmarket.com/#pricing"
          }},
          {{
            "@type": "Offer",
            "name": "Annual VIP Educational Calculator Software ($199/yr)",
            "price": "199.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://truthofmarket.com/#pricing"
          }}
        ]
      }}
    ]
  }}
  </script>
  <script src="/hq_member_crm_client.js" defer></script>
  <script src="/tom_payment_waitlist.js" defer></script>
  <script type="module" crossorigin src="./assets/{js_name}?v=20261117polar"></script>
  <link rel="stylesheet" crossorigin href="./assets/{css_name}?v=20261117polar" />
  <script>
  /* === HQ Edge Real-Human Visitor & Signup Helper (tom_truthofmarket) === */
  (function(){{
    try {{
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      var ns = 'tom_truthofmarket';
      window.trackTomFreeSignup = function(emailAddr) {{
        try {{
          var h = (location && location.hostname) || '';
          if (!h || h === 'localhost' || h === '127.0.0.1') return;
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/signup', {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/signup_total', {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
        }} catch (e) {{}}
      }};
      document.addEventListener('click', function(ev) {{
        try {{
          if (ev.__tomPaidClickTracked) return;
          var a = ev.target && ev.target.closest ? ev.target.closest('a,button') : null;
          if (!a) return;
          var href = String(a.getAttribute('href') || '');
          var isPolarLink = (href.indexOf('polar.sh') !== -1 || href.indexOf('buy.polar.sh') !== -1) && href.indexOf('polar.sh/purchases') === -1;
          var isPolarBtn = a.hasAttribute('data-polar-checkout') || a.hasAttribute('data-tom-paid-plan') || a.classList.contains('polar-checkout-button');
          if (isPolarLink || isPolarBtn) {{
            ev.__tomPaidClickTracked = true;
            var h = (location && location.hostname) || '';
            if (!h || h === 'localhost' || h === '127.0.0.1') return;
            fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_click_' + kst, {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
            fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_click_total', {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
          }}
        }} catch (_err) {{}}
      }}, true);
    }} catch (e) {{}}
  }})();
  </script>
</head>
<body>
  <div id="app">
    <section class="seo-home-fallback" id="tom-retirement-architect" style="max-width:1280px;width:calc(100% - 24px);box-sizing:border-box;margin:16px auto;padding:24px;background:#0f172a;border:1px solid #10b981;border-radius:14px;color:#f8fafc;">
      <h1 style="font-size:1.75rem;font-weight:900;margin:0 0 10px;color:#ffffff;line-height:1.3;">Turn Your 401(k) &amp; Savings Into Calm, Reliable Monthly Retirement Income.</h1>
      <p style="margin:0;color:#e2e8f0;font-size:1.125rem;line-height:1.72;">30-Second Comfortable Retirement &amp; Monthly Cashflow Calculator — Simulate your monthly retirement paycheck ($150k / $400k / $800k / $1.5M presets), cushion your nest egg from sequence-of-returns drawdowns, and rebalance calmly 2–4 times per year across <b>SGOV</b> (US T-Bill Cash Cushion), <b>SCHD</b> (Dividend Growth), <b>JEPI</b> (Monthly Dividend Paycheck), and <b>VOO</b> (S&amp;P 500 Core Compounding) aligned with our 3-Color Market Weather indicator.</p>
      <p id="tomMorningBellClub" style="margin:12px 0 0;padding-top:12px;border-top:1px solid #1e293b;color:#fbbf24;font-size:1.06rem;font-weight:700;line-height:1.65;"><span id="tom-passwordless-club-signup">☕ Morning Bell Retirement &amp; Macro Club — Protecting Your Nest Egg &amp; Monthly Income Together · Free 3-Second Passwordless Membership</span></p>
      <p id="tomFreeStarterManual" style="margin:8px 0 0;color:#38bdf8;font-size:1.06rem;font-weight:700;line-height:1.65;">📘 $0 Free Public Product: US Brokerage App &amp; Calm 2–4x/Year Portfolio Weight Rebalancing Manual (Fidelity · Charles Schwab · Vanguard — SGOV/SPAXX Cash Cushion &amp; Limit Order Guide)</p>
      <div style="margin-top:12px;display:flex;gap:12px;flex-wrap:wrap;">
        <a href="#tom-vip-monthly" class="polar-checkout-button" data-polar-checkout data-polar-plan="monthly_29" data-tom-paid-plan="monthly" style="color:#6ee7b7;font-weight:800;font-size:1rem;">⚡ Start Monthly VIP — $29/mo</a>
        <a href="#tom-vip-annual" class="polar-checkout-button" data-polar-checkout data-polar-plan="annual_199" data-tom-paid-plan="annual" style="color:#fde68a;font-weight:800;font-size:1rem;">💎 Start Annual VIP — $199/yr</a>
      </div>
      <p style="margin:10px 0 0;padding:8px 12px;border-radius:8px;background:rgba(16,185,129,0.12);border:1px solid rgba(52,211,153,0.35);color:#a7f3d0;font-size:0.96rem;font-weight:800;line-height:1.55;">📦 VIP Software Bundle ($29/mo &amp; $199/yr Annual VIP): Includes Lifetime-Updated 401(k)/IRA Drawdown Defense PDF Guide + 3-Bucket Rebalancing Calculator</p>
      <p style="margin:8px 0 0;font-size:0.88rem;color:#93c5fd;font-weight:700;">💳 Checkout &amp; Billing: Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay) · 14-Day Refund Policy</p>
      <p style="margin:12px 0 0;padding-top:10px;border-top:1px solid rgba(148,163,184,0.2);font-size:0.9rem;color:#cbd5e1;font-weight:600;">Disclaimer: TruthOfMarket provides self-directed educational data visualization and mathematical portfolio calculators only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice.</p>
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
