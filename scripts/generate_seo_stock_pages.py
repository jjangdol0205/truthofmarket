#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/generate_seo_stock_pages.py
Generates static, crawlable, self-canonicalized HTML pages for:
  - /pro-swing.html (Self-Directed Quantitative Research Archive — isolated from /)
  - /semi-fear-greed.html (Market Weather & $SMH/$XLV Barbell Calculator)
  - /stocks/<ticker_lower>.html (US Equities & ETFs Historical Factor Pages)
  - /compare/<a-vs-b>.html (50 Side-by-Side Quantitative Factor Comparisons)
  - /sitemap.xml (Canonical URLs without /index.html or 301 redirect traps)
"""
from __future__ import annotations

from datetime import datetime, timezone
import html
import json
import pathlib
import shutil
from typing import Any, Dict, List

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUB = ROOT / "frontend" / "public"
STOCKS_MASTER_PATH = ROOT / "data" / "stocks_pro_master.json"
SEMI_OVERVIEW_PATH = ROOT / "static_api" / "semi_overview.json"

LS_MONTHLY_URL = "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en"
LS_ANNUAL_URL = "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en"

MANDATORY_DISCLAIMER = (
    "Disclaimer: TruthOfMarket provides self-directed educational data visualization and mathematical "
    "portfolio calculators only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice."
)

COMPARE_PAIRS: List[tuple[str, str, str]] = [
    ("NVDA", "AMD", "AI GPU Leader vs Data Center Challenger"),
    ("SOXL", "SMH", "3x Leveraged Decay vs Spot Semiconductor ETF"),
    ("TSLA", "NVDA", "Megacap Volatility vs AI Compute Scale"),
    ("PLTR", "NVDA", "Enterprise AI Software vs AI Silicon"),
    ("AVGO", "NVDA", "Custom AI Networking vs GPU Architecture"),
    ("SMH", "XLV", "Barbell Core ETF Correlation Study"),
    ("QQQ", "SMH", "Nasdaq-100 Benchmark vs Semiconductor ETF"),
    ("TSLA", "PLTR", "High-Beta Large-Cap Dispersion Study"),
    ("AMD", "INTC", "Data Center x86 & Accelerator Comparison"),
    ("AVGO", "MRVL", "Custom Silicon & Optical Networking"),
    ("MU", "NVDA", "HBM Memory vs GPU Compute"),
    ("ARM", "NVDA", "CPU Architecture Licensing vs Data Center GPU"),
    ("ASML", "TSM", "EUV Lithography vs Foundry Scale"),
    ("LRCX", "AMAT", "Wafer Fabrication Equipment Comparison"),
    ("KLAC", "ASML", "Semiconductor Process Control vs EUV"),
    ("MSFT", "GOOGL", "Hyperscaler Cloud & Search Cashflow"),
    ("META", "GOOGL", "Digital Platform Operating Margin Study"),
    ("AMZN", "MSFT", "AWS vs Azure Cloud Infrastructure"),
    ("AAPL", "MSFT", "Consumer Hardware Ecosystem vs Enterprise Cloud"),
    ("CRWD", "PANW", "Enterprise Cybersecurity Platform Study"),
    ("SNOW", "PLTR", "Enterprise Data Cloud vs Analytics Platform"),
    ("COIN", "MSTR", "Digital Asset Exchange vs Treasury Volatility"),
    ("HOOD", "COIN", "Retail Brokerage Platform vs Digital Exchange"),
    ("LLY", "NVO", "Metabolic & Biopharma Cashflow Study"),
    ("UNH", "LLY", "Managed Care Cashflow vs Biopharma Growth"),
    ("CELH", "MNST", "Beverage Distribution & Margin Study"),
    ("NFLX", "DIS", "Streaming Operating Margin vs Media Assets"),
    ("UBER", "TSLA", "Global Mobility Network vs Autonomous Fleet"),
    ("SHOP", "AMZN", "Merchant E-Commerce Software vs Global Retail"),
    ("SMCI", "DELL", "Data Center Server Infrastructure Study"),
    ("QQQ", "TQQQ", "Nasdaq-100 Spot vs 3x Daily Reset Volatility Decay"),
    ("SOXL", "NVDA", "3x Leveraged ETF Decay vs Single-Stock Trend"),
    ("NVDA", "TSM", "Fabless Silicon Design vs Foundry Manufacturing"),
    ("PLTR", "CRWD", "Enterprise AI Software vs Endpoint Security"),
    ("SMH", "SOXL", "Spot Semiconductor ETF vs 3x Daily Reset ETF"),
    ("TSLA", "RIVN", "EV Scale Profitability vs Early-Stage EV"),
    ("META", "NFLX", "Digital Media Free Cash Flow Comparison"),
    ("AMZN", "WMT", "Cloud Retail vs Omnichannel Consumer Staple"),
    ("JPM", "GS", "Money-Center Banking vs Capital Markets"),
    ("V", "MA", "Global Payment Network Margin Comparison"),
    ("COST", "WMT", "Membership Warehouse vs Value Retail Dividend"),
    ("BA", "LMT", "Commercial Aerospace vs Defense Cashflow"),
    ("XOM", "CVX", "Integrated Energy Dividend & Cashflow Study"),
    ("ENPH", "FSLR", "Residential Solar Inverter vs Utility Solar"),
    ("ABNB", "BKNG", "Alternative Lodging Platform vs Global Travel"),
    ("INTC", "QCOM", "Foundry Restructuring vs Mobile/Edge Silicon"),
    ("ORCL", "CRM", "Enterprise Cloud Database vs Enterprise SaaS"),
    ("PYPL", "SQ", "Digital Checkout Cashflow vs Merchant Ecosystem"),
    ("DKNG", "HOOD", "Consumer Digital Platform Volatility Study"),
    ("CELH", "PEP", "Growth Beverage vs Dividend Aristocrat"),
]

# Conservative dividend & blue-chip whitelist for the main `/` retirement landing directory (0 speculative/meme tickers)
SENIOR_HOME_BLUECHIP_ALLOWLIST = {
    "MSFT", "AAPL", "NVDA", "AVGO", "LLY", "UNH", "JPM", "V", "MA",
    "COST", "WMT", "XOM", "CVX", "PEP", "KO", "JNJ", "PG", "ABBV", "HD", "LMT",
}

HEAD_BEACON_SCRIPT = """  <script>
  window.PAYMENT_CONFIG = {
    STORE_LIVE_READY: false,
    ACTIVE_SLOT: 'FINANCE_STORE_SLOT',
    FINANCE_STORE_SLOT: {
      storeId: '296100',
      storeDomain: 'truthofmarket.lemonsqueezy.com',
      monthlyUuid: 'd5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en',
      annualUuid: '667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en',
      monthlyCheckoutUrl: 'https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en',
      annualCheckoutUrl: 'https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en',
      BACKUP_LIVE_CHECKOUT_URL: { monthly: '', annual: '' }
    },
    PEDIATRIC_STORE_SLOT: {
      storeId: '296100',
      storeDomain: 'truthofmarket.lemonsqueezy.com',
      singleUuid: 'c1cd7f12-3479-49e8-ab71-59c98135d599?embed=1&locale=en',
      sixMonthUuid: 'c562946d-ef68-4c2f-a802-df9da0179895?embed=1&locale=en',
      singleCheckoutUrl: 'https://truthofmarket.lemonsqueezy.com/checkout/buy/c1cd7f12-3479-49e8-ab71-59c98135d599?embed=1&locale=en',
      sixMonthCheckoutUrl: 'https://truthofmarket.lemonsqueezy.com/checkout/buy/c562946d-ef68-4c2f-a802-df9da0179895?embed=1&locale=en',
      BACKUP_LIVE_CHECKOUT_URL: { single: '', sixMonth: '' }
    }
  };
  </script>
  <script src="/hq_member_crm_client.js" defer></script>
  <script src="/tom_payment_waitlist.js" defer></script>
  <script>
  /* === HQ Edge Real-Human Visitor & Free Email Signup Beacon (tom_truthofmarket) === */
  (function(){
    try {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      var ns = 'tom_truthofmarket';
      window.__tomSubmitLeadMagnet = function(ev, formEl, topicLabel) {
        if (ev && ev.preventDefault) ev.preventDefault();
        var input = formEl ? formEl.querySelector('input[type="email"]') : null;
        var msgBox = formEl ? formEl.parentNode.querySelector('.tom-lead-status') : null;
        var email = input ? String(input.value || '').trim() : '';
        if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
          if (msgBox) {
            msgBox.style.display = 'block';
            msgBox.style.color = '#fca5a5';
            msgBox.textContent = 'Please enter a valid email address (e.g., investor@email.com).';
          }
          if (input) input.focus();
          return false;
        }
        try {
          localStorage.setItem('tom_free_member_email', email);
          localStorage.setItem('tom_free_member_since', kst);
          if (typeof window.submitTomVipWaitlistOrManualEmail === 'function') {
            window.submitTomVipWaitlistOrManualEmail({
              email: email,
              segment: 'retirement_401k_ira',
              lang: 'en-US',
              notes: 'site=truthofmarket.com | topic=' + (topicLabel || '')
            });
          } else if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.registerMember === 'function') {
            window.DreamCompanyCRM.registerMember({
              div: 'TOM',
              email: email,
              nickname: '',
              segment: 'retirement_401k_ira',
              message: topicLabel || '',
              lang: 'en-US',
              website_hp: ''
            });
          }
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/signup', { mode: 'cors', keepalive: true }).catch(function(){});
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/signup_total', { mode: 'cors', keepalive: true }).catch(function(){});
        } catch (_e) {}
        document.querySelectorAll('.tom-lead-status').forEach(function(el) {
          el.style.display = 'block';
          el.style.color = '#86efac';
          el.innerHTML = '✅ <strong>Welcome aboard!</strong> Free 8:30 AM ET 3-Color Market Weather &amp; Calm 2–4x/Year Rebalancing Briefs are now active for <strong>' + email.replace(/[<>&"]/g, '') + '</strong>' + (topicLabel ? ' (' + topicLabel.replace(/[<>&"]/g, '') + ')' : '') + '.';
        });
        document.querySelectorAll('.tom-lead-form input[type="email"]').forEach(function(inp) { inp.value = email; });
        return false;
      };
      document.addEventListener('DOMContentLoaded', function() {
        try {
          var saved = localStorage.getItem('tom_free_member_email');
          if (saved) {
            document.querySelectorAll('.tom-lead-form input[type="email"]').forEach(function(inp) { inp.value = saved; });
          }
        } catch (_e2) {}
      });
      if (window.__HQ_BEACON_SENT_tom_truthofmarket__ || window.__HQ_KPI_TOM__) return;
      window.__HQ_BEACON_SENT_tom_truthofmarket__ = true;
      window.__HQ_KPI_TOM__ = true;
      var ua = navigator.userAgent || '';
      if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|gtmetrix|pingdom|uptimerobot|python|curl|node|axios/i.test(ua)) return;
      var host = (location && location.hostname) || '';
      if (!host || host === 'localhost' || host === '127.0.0.1') return;
      fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/pv_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
      fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/pv_total', { mode: 'cors', keepalive: true }).catch(function(){});
      if (localStorage.getItem('hq_uv_' + ns + '_' + kst) !== '1') {
        localStorage.setItem('hq_uv_' + ns + '_' + kst, '1');
        fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/uv_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
      }
      if (localStorage.getItem('hq_uv_ever_' + ns) !== '1') {
        localStorage.setItem('hq_uv_ever_' + ns, '1');
        fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/uv_total', { mode: 'cors', keepalive: true }).catch(function(){});
      }
      if (location.search.indexOf('payment=success') !== -1 || location.search.indexOf('unlock=1') !== -1) {
        if (localStorage.getItem('hq_paid_' + kst) !== '1') {
          localStorage.setItem('hq_paid_' + kst, '1');
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_member_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_member_total', { mode: 'cors', keepalive: true }).catch(function(){});
        }
      }
    } catch (e) {}
  })();
  </script>"""


def build_senior_lead_magnet_html(
    topic_label: str,
    headline_short: str,
    subcopy: str,
    signal_badge: str = "🟢 Green Steady · 🟡 Yellow Watch · 🔴 Red Cash Cushion",
    position: str = "top",
) -> str:
    safe_topic = html.escape(topic_label, quote=True)
    box_id = f"tom-senior-lead-{position}"
    return f"""  <section id="{box_id}" class="tom-senior-lead-magnet" aria-label="Free Daily Morning Bell Market Weather Email and VIP Calculator Software" style="max-width:1280px;width:calc(100% - 24px);box-sizing:border-box;margin:16px auto;padding:24px;background:linear-gradient(135deg,#0c192c 0%,#062c24 100%);border:2px solid #10b981;border-radius:16px;color:#f8fafc;box-shadow:0 10px 28px rgba(16,185,129,0.16);">
    <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(16,185,129,0.18);border:1px solid rgba(52,211,153,0.5);color:#6ee7b7;padding:6px 14px;border-radius:999px;font-size:15px;font-weight:800;margin-bottom:10px;">
      🛡️ 3-COLOR MARKET WEATHER &bull; {html.escape(signal_badge)}
    </div>
    <h2 style="font-size:clamp(22px,2.6vw,28px);line-height:1.3;font-weight:900;margin:0 0 8px;color:#ffffff;">
      {html.escape(headline_short)}
    </h2>
    <p style="margin:0 0 16px;font-size:18px;line-height:1.6;color:#e2e8f0;">
      {html.escape(subcopy)}
    </p>
    <form class="tom-lead-form" onsubmit="return window.__tomSubmitLeadMagnet(event, this, '{safe_topic}');" style="display:flex;flex-wrap:wrap;gap:12px;align-items:stretch;">
      <label for="tom-email-{position}" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">Email address for free daily market weather brief</label>
      <input id="tom-email-{position}" type="email" name="email" required autocomplete="email" placeholder="1-Step Free Sign-Up: Enter your email address" style="flex:1 1 280px;min-height:60px;padding:12px 18px;font-size:18px;border-radius:12px;border:2px solid #94a3b8;background:#ffffff;color:#0f172a;font-weight:700;" />
      <button type="submit" style="min-height:60px;padding:12px 26px;font-size:18px;font-weight:900;border-radius:12px;border:none;background:#10b981;color:#042f2e;cursor:pointer;white-space:nowrap;">
        📩 Free 8:30 AM Market Weather Brief &rarr;
      </button>
    </form>
    <div class="tom-lead-status" role="status" aria-live="polite" style="display:none;margin-top:12px;font-size:18px;font-weight:700;line-height:1.5;"></div>
    <div style="margin-top:16px;padding-top:14px;border-top:1px solid rgba(148,163,184,0.25);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">
      <div style="font-size:16px;color:#e2e8f0;font-weight:700;">
        💳 <strong>Self-Directed Educational Calculator Software:</strong> Full Dataset, Rebalancing Simulators &amp; CSV Export:
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;">
        <a href="{LS_MONTHLY_URL}" class="lemonsqueezy-button" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" style="display:inline-flex;align-items:center;justify-content:center;min-height:56px;padding:10px 20px;border-radius:10px;background:#2563eb;color:#ffffff;font-size:17px;font-weight:800;text-decoration:none;">
          ⚡ Start Monthly VIP — $29/mo
        </a>
        <a href="{LS_ANNUAL_URL}" class="lemonsqueezy-button" data-tom-paid-plan="annual" data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b" style="display:inline-flex;align-items:center;justify-content:center;min-height:56px;padding:10px 20px;border-radius:10px;background:#f59e0b;color:#0f172a;font-size:17px;font-weight:900;text-decoration:none;">
          💎 Start Annual VIP — $199/yr
        </a>
      </div>
    </div>
  </section>"""


def load_stocks_and_semi() -> tuple[List[Dict[str, Any]], Dict[str, Any]]:
    stocks: List[Dict[str, Any]] = []
    if STOCKS_MASTER_PATH.exists():
        raw = json.loads(STOCKS_MASTER_PATH.read_text(encoding="utf-8"))
        stocks = raw if isinstance(raw, list) else raw.get("stocks", [])
    semi: Dict[str, Any] = {}
    if SEMI_OVERVIEW_PATH.exists():
        semi = json.loads(SEMI_OVERVIEW_PATH.read_text(encoding="utf-8"))
    return stocks, semi


def build_ticker_directory_html(
    stocks: List[Dict[str, Any]], prefix: str = "/", senior_home_only: bool = False
) -> str:
    links = [
        f'<a href="{prefix}semi-fear-greed.html" style="color:#f87171;text-decoration:none;font-weight:800;padding:6px 12px;border:1px solid rgba(248,113,113,0.35);border-radius:6px;background:rgba(239,68,68,0.1);font-size:0.94rem;">🧭 $SMH &amp; $XLV Barbell Market Weather</a>',
        f'<a href="{prefix}pro-swing.html" style="color:#38bdf8;text-decoration:none;font-weight:800;padding:6px 12px;border:1px solid rgba(56,189,248,0.35);border-radius:6px;background:rgba(56,189,248,0.1);font-size:0.94rem;">📊 Quantitative Research Archive</a>',
        f'<a href="{prefix}insights/" style="color:#6ee7b7;text-decoration:none;font-weight:800;padding:6px 12px;border:1px solid rgba(52,211,153,0.35);border-radius:6px;background:rgba(16,185,129,0.1);font-size:0.94rem;">📘 Educational Insights Journal</a>',
    ]
    etf_list = ("SMH", "XLV", "QQQ") if senior_home_only else ("SMH", "XLV", "SOXL", "QQQ")
    for etf in etf_list:
        links.append(
            f'<a href="{prefix}stocks/{etf.lower()}.html" style="color:#38bdf8;text-decoration:none;font-weight:800;padding:6px 11px;border:1px solid rgba(56,189,248,0.3);border-radius:6px;font-size:0.94rem;">${etf} ETF</a>'
        )
    for s in stocks:
        tkr = str(s.get("ticker") or "").strip().upper()
        if not tkr or "." in tkr:
            continue
        if senior_home_only and tkr not in SENIOR_HOME_BLUECHIP_ALLOWLIST:
            continue
        name_en = html.escape(str(s.get("name_en") or s.get("name") or tkr))
        links.append(
            f'<a href="{prefix}stocks/{tkr.lower()}.html" title="{name_en} (${tkr}) Historical Factor &amp; Dividend Study" style="color:#cbd5e1;text-decoration:none;padding:5px 10px;border:1px solid rgba(148,163,184,0.22);border-radius:6px;font-family:JetBrains Mono,monospace;font-size:0.92rem;">${tkr}</a>'
        )
    joined = "\n      ".join(links)

    compare_links = []
    allowed_cmp = SENIOR_HOME_BLUECHIP_ALLOWLIST | {"SMH", "XLV", "QQQ"}
    for t1, t2, label in COMPARE_PAIRS:
        if senior_home_only and (t1 not in allowed_cmp or t2 not in allowed_cmp):
            continue
        slug = f"{t1.lower()}-vs-{t2.lower()}.html"
        compare_links.append(
            f'<a href="{prefix}compare/{slug}" title="${t1} vs ${t2} ({html.escape(label)}) Comparison" style="color:#d8b4fe;text-decoration:none;padding:5px 10px;border:1px solid rgba(192,132,252,0.28);border-radius:6px;font-family:JetBrains Mono,monospace;font-size:0.92rem;background:rgba(168,85,247,0.08);">⚖️ ${t1} vs ${t2}</a>'
        )
    compare_joined = "\n      ".join(compare_links)

    core_banner = ""
    if senior_home_only:
        core_banner = """    <div style="margin-bottom:14px;padding:12px 14px;border-radius:10px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.35);color:#ecfdf5;font-size:1rem;line-height:1.65;">
      <strong>🛡️ US 50–70s Retirement 4-Core Allocation Standard:</strong>
      <b>$SGOV</b> (US T-Bill Cash Cushion) &middot; <b>$SCHD</b> (Dividend Growth) &middot; <b>$JEPI</b> (Monthly Dividend Paycheck) &middot; <b>$VOO</b> (S&amp;P 500 Core Compounding) — Rebalanced calmly 2–4 times per year via our 3-Color Market Weather indicator.
    </div>\n"""

    return f"""  <section class="seo-directory-footer" style="max-width:1280px;width:calc(100% - 24px);box-sizing:border-box;overflow-x:hidden;margin:24px auto 32px;padding:20px 18px;background:#0b1220;border:1px solid #1e293b;border-radius:12px;color:#cbd5e1;font-size:0.96rem;">
{core_banner}    <div style="font-weight:800;color:#f8fafc;margin-bottom:8px;font-size:1.05rem;letter-spacing:0.01em;">
      📊 US QUALITY EQUITY &amp; RETIREMENT ETF RESEARCH DIRECTORY
    </div>
    <p style="margin:0 0 12px;color:#cbd5e1;font-size:0.96rem;line-height:1.65;">
      Self-directed public market data visualization, 52-week range context, and calm 2–4x/year portfolio weight studies across liquid US ETFs and equities:
    </p>
    <nav aria-label="US Stock and ETF Quantitative Research Directory" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:16px;">
      {joined}
    </nav>
    <div style="font-weight:800;color:#e9d5ff;margin:12px 0 8px;font-size:1rem;letter-spacing:0.01em;">
      ⚖️ SIDE-BY-SIDE US BLUE-CHIP &amp; ETF COMPARISONS
    </div>
    <nav aria-label="Head-to-Head US Stock Quantitative Comparisons" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
      {compare_joined}
    </nav>
    <div style="margin-top:16px;padding-top:14px;border-top:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:0.95rem;color:#e2e8f0;">
      <span>🏛️ <strong>Educational Market Data &amp; Quantitative Research Desk:</strong> Questions about software licenses, CSV feeds, or 14-day refunds? Reach our desk directly.</span>
      <a href="mailto:beable9489@gmail.com?subject=TruthOfMarket%20Educational%20Software%20Support" style="color:#38bdf8;font-weight:800;text-decoration:none;padding:10px 16px;min-height:48px;display:inline-flex;align-items:center;max-width:100%;word-break:break-word;border:1px solid rgba(56,189,248,0.4);border-radius:8px;background:rgba(56,189,248,0.1);font-size:0.95rem;">✉️ Educational Market Data &amp; Quantitative Research Desk (beable9489@gmail.com) &rarr;</a>
    </div>
    <div style="margin-top:14px;padding:12px 14px;border-radius:8px;background:rgba(15,23,42,0.85);border:1px solid rgba(148,163,184,0.25);display:flex;flex-wrap:wrap;gap:14px;align-items:center;font-size:0.9rem;">
      <a href="{prefix}terms.html" style="color:#93c5fd;font-weight:800;text-decoration:underline;">Terms of Service</a>
      <span style="color:#475569;">&middot;</span>
      <a href="{prefix}privacy.html" style="color:#93c5fd;font-weight:800;text-decoration:underline;">Privacy Policy</a>
      <span style="color:#475569;">&middot;</span>
      <a href="{prefix}refund.html" style="color:#6ee7b7;font-weight:800;text-decoration:underline;">14-Day Refund Policy</a>
      <span style="color:#475569;">&middot;</span>
      <a href="{prefix}contact.html" style="color:#93c5fd;font-weight:700;text-decoration:underline;">Contact Support</a>
      <span style="color:#475569;">&middot;</span>
      <a href="mailto:beable9489@gmail.com" style="color:#fde68a;font-weight:800;text-decoration:underline;">Support: beable9489@gmail.com</a>
      <span style="color:#475569;">&middot;</span>
      <a href="mailto:beable9489@gmail.com?subject=TruthOfMarket%20Brand%20%26%20Media%20Partnership" style="color:#6ee7b7;font-weight:800;text-decoration:underline;">Sponsorship, Brand &amp; Media Partnerships: beable9489@gmail.com</a>
    </div>
    <p style="margin:12px 0 0;font-size:0.88rem;line-height:1.6;color:#cbd5e1;font-weight:600;">
      {html.escape(MANDATORY_DISCLAIMER)}
    </p>
  </section>"""


def generate_pro_swing_page(semi: Dict[str, Any], stocks: List[Dict[str, Any]], js_name: str, css_name: str) -> str:
    as_of = str(semi.get("date") or "2026-11-13")
    title = "Self-Directed Quantitative Research Archive & US Equity Factor Dataset | TruthOfMarket"
    desc = (
        f"Self-directed educational market data visualization and historical moving-average / relative-volume "
        f"factor dataset across liquid US equities (as of {as_of})."
    )
    canonical = "https://truthofmarket.com/pro-swing.html"
    dir_html = build_ticker_directory_html(stocks, prefix="/", senior_home_only=False)
    lead_top = build_senior_lead_magnet_html(
        "Quantitative Research Archive",
        "Explore Historical US Equity Factor Data — Plus Our Free 8:30 AM Market Weather Brief",
        "Self-directed mathematical calculators for historical moving-average alignment, 52-week drawdown bands, and calm portfolio weight simulation.",
        signal_badge=f"📊 Quantitative Research Archive • As of {as_of}",
        position="top",
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <script>window.__DEFAULT_VIEW__ = 'pro_swing';</script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}" />
  <link rel="canonical" href="{canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="TruthOfMarket — Educational Calculator Software" />
  <meta property="og:title" content="{html.escape(title)}" />
  <meta property="og:description" content="{html.escape(desc)}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:image" content="https://truthofmarket.com/og-preview.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{html.escape(title)}" />
  <meta name="twitter:description" content="{html.escape(desc)}" />
  <meta name="twitter:image" content="https://truthofmarket.com/og-preview.png" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
  <script type="module" crossorigin src="/assets/{js_name}?v=20261116mor"></script>
  <link rel="stylesheet" crossorigin href="/assets/{css_name}?v=20261116mor" />
{HEAD_BEACON_SCRIPT}
</head>
<body>
{lead_top}
  <div id="app">
    <section style="max-width:1280px;width:calc(100% - 24px);box-sizing:border-box;margin:14px auto;padding:18px 20px;background:#0f172a;border:1px solid #334155;border-radius:10px;color:#f8fafc;">
      <div style="font-family:JetBrains Mono,monospace;font-size:0.74rem;color:#38bdf8;font-weight:800;">
        SELF-DIRECTED QUANTITATIVE RESEARCH ARCHIVE &bull; EDUCATIONAL CALCULATOR SOFTWARE ({html.escape(as_of)})
      </div>
      <h1 style="font-size:1.35rem;font-weight:900;margin:6px 0;color:#ffffff;">
        Historical US Equity Factor Dataset &amp; Mathematical Variance Simulators
      </h1>
      <p style="margin:0 0 10px;font-size:0.95rem;color:#cbd5e1;line-height:1.6;">
        Explore historical 52-week drawdown cohorts, 20-day/60-day moving average alignment, and multi-asset dispersion calculators. Looking for conservative 401(k)/IRA monthly retirement income planning? <a href="/" style="color:#6ee7b7;font-weight:800;text-decoration:underline;">Return to the 30-Second Retirement Cashflow Calculator &rarr;</a>
      </p>
      <p style="margin:0;font-size:0.86rem;color:#fde68a;font-weight:600;">{html.escape(MANDATORY_DISCLAIMER)}</p>
    </section>
  </div>
{dir_html}
</body>
</html>
"""


def generate_semi_fear_greed_page(semi: Dict[str, Any], stocks: List[Dict[str, Any]], js_name: str, css_name: str) -> str:
    as_of = str(semi.get("date") or "2026-11-13")
    fg_score = float(semi.get("fg_score") or 18.3)
    regime_en = str(semi.get("regime_en") or "Extreme Fear")
    smh_close = float(semi.get("smh_close") or 504.48)
    smh_dd = float(semi.get("smh_dd_pct") or -24.58)
    smh_rsi = float(semi.get("smh_rsi") or 34.2)
    xlv_close = float(semi.get("xlv_close") or 179.28)
    qqq_close = float(semi.get("qqq_close") or 690.49)
    smh_w = 80 if fg_score <= 25.0 else 70
    xlv_w = 100 - smh_w

    title = f"Market Weather & Sector Sentiment Gauge ({fg_score:.1f} {regime_en}) — $SMH/$XLV Barbell Calculator | TruthOfMarket"
    desc = (
        f"Self-directed educational Market Weather & Sector Sentiment Gauge ({fg_score:.1f}/100 {regime_en} as of {as_of}), "
        f"$SMH (${smh_close:.2f}, {smh_dd:.2f}% 52W DD) vs $XLV (${xlv_close:.2f}) {smh_w}:{xlv_w} periodic weight calculator."
    )
    canonical = "https://truthofmarket.com/semi-fear-greed.html"

    faq_ld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the current Sector Sentiment Gauge reading today?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"As of {as_of}, the 7-Factor Sector Sentiment Gauge reads {fg_score:.1f} out of 100 ({regime_en}), with VanEck Semiconductor ETF ($SMH) closing at ${smh_close:.2f} ({smh_dd:.2f}% from its 52-week high, 14-day RSI {smh_rsi:.1f}).",
                },
            },
            {
                "@type": "Question",
                "name": "How does the educational $SMH and $XLV Barbell weight calculator work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"The self-directed calculator models baseline 70% $SMH and 30% $XLV weights under standard conditions, and illustrates an {smh_w}% $SMH : {xlv_w}% $XLV rebalance simulation during deep sentiment compression.",
                },
            },
        ],
    }

    dir_html = build_ticker_directory_html(stocks, prefix="/")
    lead_top = build_senior_lead_magnet_html(
        "$SMH:$XLV Barbell",
        "Protect Your Retirement Nest Egg — Free Daily 8:30 AM 3-Color Market Weather Brief",
        f"Plain-English market weather notes for $SMH (${smh_close:.2f}), defensive $XLV (${xlv_close:.2f}), and calm 2–4x/year 401(k)/IRA rebalancing.",
        signal_badge=f"🧭 Market Weather Gauge: {fg_score:.1f}/100 ({regime_en})",
        position="top",
    )
    lead_bottom = build_senior_lead_magnet_html(
        "$SMH:$XLV Barbell",
        "Stay Calm Across Market Cycles — Join Our Free 8:30 AM Morning Bell Club",
        f"Receive daily plain-English 3-color market weather updates and {smh_w}:{xlv_w} $SMH/$XLV barbell educational calculations.",
        signal_badge="🟢 Green Steady · 🟡 Yellow Watch · 🔴 Red Cash Cushion",
        position="bottom",
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <script>window.__DEFAULT_VIEW__ = 'semi';</script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}" />
  <link rel="canonical" href="{canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="TruthOfMarket — Educational Calculator Software" />
  <meta property="og:title" content="{html.escape(title)}" />
  <meta property="og:description" content="{html.escape(desc)}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:image" content="https://truthofmarket.com/og-preview.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{html.escape(title)}" />
  <meta name="twitter:description" content="{html.escape(desc)}" />
  <meta name="twitter:image" content="https://truthofmarket.com/og-preview.png" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <script type="application/ld+json">{json.dumps(faq_ld, ensure_ascii=False)}</script>
  <script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
  <script type="module" crossorigin src="/assets/{js_name}?v=20261116mor"></script>
  <link rel="stylesheet" crossorigin href="/assets/{css_name}?v=20261116mor" />
{HEAD_BEACON_SCRIPT}
</head>
<body>
{lead_top}
  <div id="app">
    <section class="seo-semi-hero" style="max-width:1280px;width:calc(100% - 24px);box-sizing:border-box;margin:14px auto 0;padding:16px;background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);border:1px solid #334155;border-radius:10px;color:#f8fafc;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-family:JetBrains Mono,monospace;font-size:0.72rem;color:#f87171;font-weight:700;text-transform:uppercase;">
            🧭 PUBLIC MARKET WEATHER &amp; BARBELL CALCULATOR &bull; AS OF {html.escape(as_of)}
          </div>
          <h1 style="font-size:1.25rem;font-weight:800;margin:4px 0;color:#ffffff;">
            Sector Sentiment Gauge: {fg_score:.1f} / 100 ({html.escape(regime_en)})
          </h1>
          <p style="margin:0;font-size:0.84rem;color:#cbd5e1;">
            <strong>$SMH Close:</strong> ${smh_close:.2f} ({smh_dd:.2f}% 52W DD &middot; RSI {smh_rsi:.1f}) &nbsp;|&nbsp;
            <strong>$XLV Close:</strong> ${xlv_close:.2f} &nbsp;|&nbsp;
            <strong>$QQQ Close:</strong> ${qqq_close:.2f} &nbsp;|&nbsp;
            <strong>Modeled Barbell:</strong> <span style="color:#38bdf8;font-weight:700;">{smh_w}% $SMH : {xlv_w}% $XLV</span>
          </p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <a href="{LS_MONTHLY_URL}" class="lemonsqueezy-button btn btn-primary" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" style="background:#2563eb;border-color:#3b82f6;color:#fff;text-decoration:none;padding:8px 14px;min-height:40px;display:inline-flex;align-items:center;border-radius:6px;font-weight:700;font-size:0.82rem;">
            ⚡ Start Monthly VIP — $29/mo
          </a>
          <a href="{LS_ANNUAL_URL}" class="lemonsqueezy-button" data-tom-paid-plan="annual" data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b" style="background:#f59e0b;color:#0f172a;text-decoration:none;padding:8px 14px;min-height:40px;display:inline-flex;align-items:center;border-radius:6px;font-weight:800;font-size:0.82rem;">
            💎 Start Annual VIP — $199/yr
          </a>
        </div>
      </div>
    </section>
  </div>
{lead_bottom}
{dir_html}
</body>
</html>
"""


def generate_single_stock_page(
    stock: Dict[str, Any],
    semi: Dict[str, Any],
    all_stocks: List[Dict[str, Any]],
    js_name: str,
    css_name: str,
) -> str:
    tkr = str(stock.get("ticker") or "NVDA").strip().upper()
    tkr_lower = tkr.lower()
    name_en = str(stock.get("name_en") or stock.get("name") or tkr)
    sector = str(stock.get("sector") or "US Equity")
    as_of = str(stock.get("date") or semi.get("date") or "2026-11-05")
    close_p = float(stock.get("close") or 100.0)
    low52 = float(stock.get("low52") or close_p * 0.7)
    high52 = float(stock.get("high52") or close_p * 1.3)
    dd_pct = float(stock.get("dd_high52_pct") or -20.0)
    prox_low = float(stock.get("prox_low52_pct") or 15.0)
    ma20 = float(stock.get("ma20_price") or close_p * 0.98)
    ma60 = float(stock.get("ma60_price") or close_p * 0.96)
    rsi14 = float(stock.get("rsi14") or 50.0)
    vol_surge = float(stock.get("vol_surge_10d") or 1.2)
    score = int(stock.get("score") or 70)
    zone_code = str(stock.get("zone_code") or "WASHOUT_WATCH")
    zone_label = str(stock.get("zone_label_en") or zone_code)

    trg_p = float(stock.get("entry_trigger_price") or ma60)
    low_ref_p = float(stock.get("stop_loss_price") or round(close_p * 0.91, 2))
    up_ref_p = float(stock.get("tp1_2x_price") or round(close_p * 2.0, 2))

    is_vip_locked = zone_code == "IGNITION_ZONE" and tkr != "CELH"

    title = f"${tkr} ({name_en}) Quantitative Factor Score ({score}/100) & 52-Week Range Study | TruthOfMarket"
    desc = (
        f"Self-directed quantitative market data summary for {name_en} (${tkr}) as of {as_of}: "
        f"Close ${close_p:.2f}, 52W Range ${low52:.2f}–${high52:.2f} ({dd_pct:.1f}% DD), RSI {rsi14:.1f}, "
        f"10D Volume {vol_surge:.2f}x, and {zone_label} regime."
    )
    canonical = f"https://truthofmarket.com/stocks/{tkr_lower}.html"

    if is_vip_locked:
        exec_summary_text = (
            f"${tkr} ({name_en}) currently records a quantitative factor score of {score}/100 "
            f"(10-day relative volume {vol_surge:.2f}x). Detailed historical dispersion bands and CSV exports are available in VIP Calculator Software."
        )
        exec_box_html = f"""
      <div style="margin-top:12px;padding:12px 16px;background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.4);border-radius:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-size:0.74rem;font-family:JetBrains Mono,monospace;color:#facc15;font-weight:800;">
            🔒 VIP HISTORICAL FACTOR DATASET &bull; SCORE {score}/100 ({html.escape(sector.upper())})
          </div>
          <div style="font-size:0.84rem;color:#e2e8f0;margin-top:3px;">
            🎯 MA60 Reference: <span style="filter:blur(5px);user-select:none;font-family:JetBrains Mono,monospace;">$148.50</span> &nbsp;|&nbsp;
            📉 Lower Variance Band: <span style="filter:blur(5px);user-select:none;font-family:JetBrains Mono,monospace;">$135.10</span> &nbsp;|&nbsp;
            📈 Upper Dispersion Band: <span style="filter:blur(5px);user-select:none;font-family:JetBrains Mono,monospace;">$297.00</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <a href="{LS_MONTHLY_URL}" class="lemonsqueezy-button" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" style="background:#eab308;color:#0f172a;text-decoration:none;padding:8px 14px;border-radius:6px;font-weight:800;font-size:0.8rem;">
            ⚡ Start Monthly VIP — $29/mo
          </a>
          <a href="{LS_ANNUAL_URL}" class="lemonsqueezy-button" data-tom-paid-plan="annual" data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b" style="background:#1e293b;border:1px solid #475569;color:#f8fafc;text-decoration:none;padding:8px 14px;border-radius:6px;font-weight:700;font-size:0.8rem;">
            💎 Start Annual VIP — $199/yr
          </a>
        </div>
      </div>"""
        init_ticker_js = ""
        init_filter_js = "ignition"
    else:
        exec_summary_text = (
            f"As of {as_of}, ${tkr} ({name_en}) closed at ${close_p:.2f} with a quantitative factor score of {score}/100 ({zone_label}). "
            f"Its 60-day moving-average reference is ${trg_p:.2f}, modeled lower variance band is ${low_ref_p:.2f}, and upper dispersion reference is ${up_ref_p:.2f}."
        )
        exec_box_html = f"""
      <div style="margin-top:12px;padding:12px 16px;background:rgba(15,23,42,0.85);border:1px solid #334155;border-radius:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div style="font-size:0.84rem;color:#e2e8f0;font-family:JetBrains Mono,monospace;">
          🎯 <strong>MA20/MA60 Ref:</strong> <span style="color:#38bdf8;">${trg_p:.2f}</span> &nbsp;|&nbsp;
          📉 <strong>Lower Variance Band:</strong> <span style="color:#f87171;">${low_ref_p:.2f}</span> &nbsp;|&nbsp;
          📈 <strong>Upper Dispersion Band:</strong> <span style="color:#4ade80;">${up_ref_p:.2f}</span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <a href="/" style="background:#0ea5e9;color:#ffffff;text-decoration:none;padding:7px 13px;border-radius:6px;font-weight:800;font-size:0.78rem;">
            🏡 30-Sec Retirement Calculator
          </a>
          <a href="{LS_MONTHLY_URL}" class="lemonsqueezy-button" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" style="background:#2563eb;color:#ffffff;text-decoration:none;padding:7px 13px;border-radius:6px;font-weight:700;font-size:0.78rem;">
            ⚡ Start Monthly VIP — $29/mo
          </a>
          <a href="{LS_ANNUAL_URL}" class="lemonsqueezy-button" data-tom-paid-plan="annual" data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b" style="background:#f59e0b;color:#0f172a;text-decoration:none;padding:7px 13px;border-radius:6px;font-weight:800;font-size:0.78rem;">
            💎 Start Annual VIP — $199/yr
          </a>
        </div>
      </div>"""
        init_ticker_js = tkr if tkr not in ("SMH", "XLV", "SOXL", "QQQ") else ""
        init_filter_js = ""

    faq_ld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": f"What is {name_en} (${tkr})'s current quantitative factor score and moving-average status?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"As of {as_of}, {name_en} (${tkr}) records a historical factor score of {score}/100 ({zone_label}), closing at ${close_p:.2f} with 14-day RSI at {rsi14:.1f} and 10-day relative volume at {vol_surge:.2f}x.",
                },
            },
            {
                "@type": "Question",
                "name": f"What is ${tkr}'s 52-week range and moving-average alignment?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"${tkr}'s 52-week range is ${low52:.2f} to ${high52:.2f} ({dd_pct:.1f}% from 52W high, +{prox_low:.1f}% above 52W low). Its 20-day MA is ${ma20:.2f} and 60-day MA is ${ma60:.2f}. {exec_summary_text}",
                },
            },
        ],
    }

    dir_html = build_ticker_directory_html(all_stocks, prefix="/")
    traffic_badge = (
        f"🟢 Above-MA Trend (${tkr} {score}/100)"
        if score >= 80
        else (f"🟡 Consolidation Watch (${tkr} {score}/100)" if score >= 60 else f"🔴 Defensive Cushion (${tkr} {score}/100)"))
    lead_top = build_senior_lead_magnet_html(
        f"${tkr}",
        f"Track ${tkr} & US Retirement Market Weather — Free 8:30 AM Morning Bell Brief",
        f"Plain-English daily market weather and calm 2–4x/year portfolio weight studies alongside public ${tkr} factor metrics.",
        signal_badge=traffic_badge,
        position="top",
    )
    lead_bottom = build_senior_lead_magnet_html(
        f"${tkr}",
        f"Follow ${tkr} Without Daily Trading Stress — Join the Free Morning Bell Club",
        "Enter your email once to receive calm 8:30 AM ET 3-color market weather notes and SGOV · SCHD · JEPI · VOO allocation studies.",
        signal_badge=traffic_badge,
        position="bottom",
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <script>
    window.__DEFAULT_VIEW__ = 'pro_swing';
    window.__INITIAL_TICKER__ = '{init_ticker_js}';
    window.__INITIAL_FILTER__ = '{init_filter_js}';
  </script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}" />
  <link rel="canonical" href="{canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="TruthOfMarket — Educational Calculator Software" />
  <meta property="og:title" content="{html.escape(title)}" />
  <meta property="og:description" content="{html.escape(desc)}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:image" content="https://truthofmarket.com/og-preview.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{html.escape(title)}" />
  <meta name="twitter:description" content="{html.escape(desc)}" />
  <meta name="twitter:image" content="https://truthofmarket.com/og-preview.png" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <script type="application/ld+json">{json.dumps(faq_ld, ensure_ascii=False)}</script>
  <script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
  <script type="module" crossorigin src="/assets/{js_name}?v=20261116mor"></script>
  <link rel="stylesheet" crossorigin href="/assets/{css_name}?v=20261116mor" />
{HEAD_BEACON_SCRIPT}
</head>
<body>
  <section class="seo-stock-audit-banner" style="max-width:1280px;margin:14px auto 0;padding:16px 20px;background:linear-gradient(135deg,#0f172a 0%,#111827 100%);border:1px solid #1e293b;border-radius:10px;color:#f8fafc;">
    <div style="font-size:0.72rem;font-family:JetBrains Mono,monospace;color:#94a3b8;margin-bottom:4px;">
      <a href="/" style="color:#38bdf8;text-decoration:none;">TruthOfMarket Calculator</a> &rsaquo;
      <a href="/pro-swing.html" style="color:#93c5fd;text-decoration:none;">Quant Research Archive</a> &rsaquo;
      <strong style="color:#f8fafc;">${tkr} ({html.escape(name_en)})</strong>
      <span style="float:right;color:#64748b;">As of {html.escape(as_of)}</span>
    </div>
    <h1 style="font-size:1.22rem;font-weight:800;margin:4px 0 8px;color:#ffffff;">
      ${tkr} ({html.escape(name_en)}) — Public Market Data &amp; 52-Week Factor Study
    </h1>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;">
      <div style="padding:10px 12px;background:#0b1220;border:1px solid #1e293b;border-radius:6px;">
        <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;font-weight:700;">Last Close &amp; 52W Range</div>
        <div style="font-size:1.05rem;font-weight:800;font-family:JetBrains Mono,monospace;color:#f8fafc;margin-top:2px;">
          ${close_p:.2f} <span style="font-size:0.75rem;color:#94a3b8;font-weight:500;">(${low52:.2f} – ${high52:.2f})</span>
        </div>
      </div>
      <div style="padding:10px 12px;background:#0b1220;border:1px solid #1e293b;border-radius:6px;">
        <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;font-weight:700;">Factor Score &amp; Regime</div>
        <div style="font-size:1.05rem;font-weight:800;font-family:JetBrains Mono,monospace;color:#38bdf8;margin-top:2px;">
          {score}/100 <span style="font-size:0.74rem;color:#e2e8f0;">({html.escape(zone_label)})</span>
        </div>
      </div>
      <div style="padding:10px 12px;background:#0b1220;border:1px solid #1e293b;border-radius:6px;">
        <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;font-weight:700;">52W High DD / Off Low</div>
        <div style="font-size:1.05rem;font-weight:800;font-family:JetBrains Mono,monospace;color:#f87171;margin-top:2px;">
          {dd_pct:.1f}% <span style="font-size:0.75rem;color:#4ade80;">(+{prox_low:.1f}% off 52W Low)</span>
        </div>
      </div>
      <div style="padding:10px 12px;background:#0b1220;border:1px solid #1e293b;border-radius:6px;">
        <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;font-weight:700;">MA20 / MA60 / 10D Vol</div>
        <div style="font-size:0.92rem;font-weight:700;font-family:JetBrains Mono,monospace;color:#e2e8f0;margin-top:3px;">
          ${ma20:.2f} / ${ma60:.2f} <span style="color:#facc15;">({vol_surge:.2f}x Vol &middot; RSI {rsi14:.1f})</span>
        </div>
      </div>
    </div>
{exec_box_html}
  </section>
{lead_top}
  <div id="app"></div>
{lead_bottom}
{dir_html}
</body>
</html>
"""


def generate_comparison_page(
    stock_a: Dict[str, Any],
    stock_b: Dict[str, Any],
    theme_label: str,
    semi: Dict[str, Any],
    all_stocks: List[Dict[str, Any]],
    js_name: str,
    css_name: str,
) -> str:
    ta = str(stock_a.get("ticker") or "NVDA").upper()
    tb = str(stock_b.get("ticker") or "AMD").upper()
    slug = f"{ta.lower()}-vs-{tb.lower()}.html"
    na = str(stock_a.get("name_en") or stock_a.get("name") or ta)
    nb = str(stock_b.get("name_en") or stock_b.get("name") or tb)
    as_of = str(stock_a.get("date") or semi.get("date") or "2026-11-05")

    ca = float(stock_a.get("close") or 100.0)
    cb = float(stock_b.get("close") or 100.0)
    sa = int(stock_a.get("score") or 75)
    sb = int(stock_b.get("score") or 72)
    ra = float(stock_a.get("rsi14") or 48.0)
    rb = float(stock_b.get("rsi14") or 50.0)
    va = float(stock_a.get("vol_surge_10d") or 1.25)
    vb = float(stock_b.get("vol_surge_10d") or 1.15)
    dda = float(stock_a.get("dd_high52_pct") or -18.0)
    ddb = float(stock_b.get("dd_high52_pct") or -22.0)
    low_a = float(stock_a.get("stop_loss_price") or round(ca * 0.91, 2))
    low_b = float(stock_b.get("stop_loss_price") or round(cb * 0.91, 2))
    trg_a = float(stock_a.get("entry_trigger_price") or round(ca * 0.98, 2))
    trg_b = float(stock_b.get("entry_trigger_price") or round(cb * 0.98, 2))

    winner = ta if (sa, va) >= (sb, vb) else tb
    loser = tb if winner == ta else ta
    win_score = sa if winner == ta else sb
    win_vol = va if winner == ta else vb

    title = f"${ta} vs ${tb} Quantitative Factor Comparison ({as_of}): Trend & Volatility Study | TruthOfMarket"
    desc = (
        f"Side-by-side educational market data comparison: ${ta} ({na}) vs ${tb} ({nb}) as of {as_of}. "
        f"Compare Factor Score ({sa} vs {sb}), 14D RSI ({ra:.1f} vs {rb:.1f}), 10D Volume ({va:.2f}x vs {vb:.2f}x), and 52-week drawdown bands."
    )
    canonical = f"https://truthofmarket.com/compare/{slug}"

    faq_ld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": f"How do ${ta} and ${tb} compare on public trend and volume factors ({as_of})?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": (
                        f"In the public quantitative factor dataset as of {as_of}, "
                        f"${winner} records a higher composite factor score ({win_score}/100, {win_vol:.2f}x 10-day relative volume) than ${loser}. "
                        f"${ta} closed at ${ca:.2f} (RSI {ra:.1f}, lower variance ref ${low_a:.2f}) while ${tb} closed at ${cb:.2f} (RSI {rb:.1f}, lower variance ref ${low_b:.2f})."
                    ),
                },
            },
            {
                "@type": "Question",
                "name": f"What are the moving-average and variance reference bands for ${ta} vs ${tb}?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": (
                        f"As of {as_of}, ${ta} ({na}) shows a moving-average reference of ${trg_a:.2f} and lower variance band of ${low_a:.2f} (Score {sa}/100), "
                        f"while ${tb} ({nb}) shows a moving-average reference of ${trg_b:.2f} and lower variance band of ${low_b:.2f} (Score {sb}/100)."
                    ),
                },
            },
        ],
    }

    dir_html = build_ticker_directory_html(all_stocks, prefix="/")
    init_tkr = winner if winner not in ("SMH", "XLV", "SOXL", "QQQ") else ta
    cmp_lead_top = build_senior_lead_magnet_html(
        f"${ta} vs ${tb}",
        f"Compare ${ta} vs ${tb} Calmly — Plus Free 8:30 AM Market Weather Notes",
        f"Currently ${winner} scores {win_score}/100 on public trend & volume factors. Join the free Morning Bell Club for daily plain-English market weather.",
        signal_badge=f"📊 Higher Factor Score: ${winner} ({win_score}/100 · {win_vol:.2f}x Vol)",
        position="top",
    )
    cmp_lead_bottom = build_senior_lead_magnet_html(
        f"${ta} vs ${tb}",
        f"Follow ${ta}, ${tb} & Retirement ETFs Without Daily Noise",
        "Receive free 8:30 AM ET 3-color market weather notes and calm 2–4x/year portfolio rebalancing guides.",
        signal_badge="🟢 Green Steady · 🟡 Yellow Watch · 🔴 Red Cash Cushion",
        position="bottom",
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <script>
    window.__DEFAULT_VIEW__ = 'pro_swing';
    window.__INITIAL_TICKER__ = '{init_tkr}';
  </script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}" />
  <link rel="canonical" href="{canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="TruthOfMarket — Educational Calculator Software" />
  <meta property="og:title" content="{html.escape(title)}" />
  <meta property="og:description" content="{html.escape(desc)}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:image" content="https://truthofmarket.com/og-preview.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{html.escape(title)}" />
  <meta name="twitter:description" content="{html.escape(desc)}" />
  <meta name="twitter:image" content="https://truthofmarket.com/og-preview.png" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <script type="application/ld+json">{json.dumps(faq_ld, ensure_ascii=False)}</script>
  <script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
  <script type="module" crossorigin src="/assets/{js_name}?v=20261116mor"></script>
  <link rel="stylesheet" crossorigin href="/assets/{css_name}?v=20261116mor" />
{HEAD_BEACON_SCRIPT}
</head>
<body>
  <section class="seo-compare-banner" style="max-width:1280px;margin:14px auto 0;padding:18px 22px;background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);border:1px solid #334155;border-radius:12px;color:#f8fafc;">
    <div style="font-size:0.72rem;font-family:JetBrains Mono,monospace;color:#c084fc;margin-bottom:4px;">
      <a href="/" style="color:#38bdf8;text-decoration:none;">TruthOfMarket Calculator</a> &rsaquo;
      <span>Side-by-Side Factor Study</span> &rsaquo;
      <strong style="color:#f8fafc;">${ta} vs ${tb} ({html.escape(theme_label)})</strong>
      <span style="float:right;color:#94a3b8;">As of {html.escape(as_of)}</span>
    </div>
    <h1 style="font-size:1.28rem;font-weight:900;margin:4px 0 10px;color:#ffffff;">
      ⚖️ ${ta} ({html.escape(na)}) vs ${tb} ({html.escape(nb)}) — Side-by-Side Quantitative Factor Study
    </h1>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-bottom:12px;">
      <div style="padding:12px 14px;background:#0b1220;border:1px solid {'#38bdf8' if winner == ta else '#1e293b'};border-radius:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="font-size:1.05rem;color:#38bdf8;font-family:JetBrains Mono,monospace;">${ta} &middot; {html.escape(na)}</strong>
          <span style="font-size:0.75rem;padding:2px 8px;border-radius:99px;background:rgba(56,189,248,0.15);color:#38bdf8;font-weight:800;">Factor {sa}/100</span>
        </div>
        <div style="font-size:0.82rem;color:#cbd5e1;margin-top:8px;line-height:1.6;font-family:JetBrains Mono,monospace;">
          &bull; Close: <strong>${ca:.2f}</strong> ({dda:.1f}% 52W DD)<br/>
          &bull; 14D RSI: <strong>{ra:.1f}</strong> &nbsp;|&nbsp; 10D Vol: <strong>{va:.2f}x</strong><br/>
          &bull; MA Ref: <span style="color:#4ade80;">${trg_a:.2f}</span> &nbsp;|&nbsp; Lower Band Ref: <span style="color:#f87171;">${low_a:.2f}</span>
        </div>
      </div>
      <div style="padding:12px 14px;background:#0b1220;border:1px solid {'#38bdf8' if winner == tb else '#1e293b'};border-radius:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="font-size:1.05rem;color:#c084fc;font-family:JetBrains Mono,monospace;">${tb} &middot; {html.escape(nb)}</strong>
          <span style="font-size:0.75rem;padding:2px 8px;border-radius:99px;background:rgba(192,132,252,0.15);color:#c084fc;font-weight:800;">Factor {sb}/100</span>
        </div>
        <div style="font-size:0.82rem;color:#cbd5e1;margin-top:8px;line-height:1.6;font-family:JetBrains Mono,monospace;">
          &bull; Close: <strong>${cb:.2f}</strong> ({ddb:.1f}% 52W DD)<br/>
          &bull; 14D RSI: <strong>{rb:.1f}</strong> &nbsp;|&nbsp; 10D Vol: <strong>{vb:.2f}x</strong><br/>
          &bull; MA Ref: <span style="color:#4ade80;">${trg_b:.2f}</span> &nbsp;|&nbsp; Lower Band Ref: <span style="color:#f87171;">${low_b:.2f}</span>
        </div>
      </div>
    </div>
    <div style="padding:12px 16px;background:rgba(234,179,8,0.09);border:1px solid rgba(234,179,8,0.45);border-radius:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <div>
        <div style="font-size:0.76rem;font-family:JetBrains Mono,monospace;color:#facc15;font-weight:800;">
          📊 FACTOR SUMMARY: ${winner} SHOWS HIGHER RELATIVE SCORE ({win_score}/100 &bull; {win_vol:.2f}x VOL)
        </div>
        <div style="font-size:0.82rem;color:#e2e8f0;margin-top:3px;">
          🔒 <strong>${winner} vs ${loser} Historical Dispersion Bands &amp; CSV Dataset:</strong>
          <span style="filter:blur(5px);user-select:none;font-family:JetBrains Mono,monospace;">$184.20 / $268.00</span>
          &nbsp;(Self-Directed Educational Calculator Software)
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <a href="/" style="background:#0ea5e9;color:#fff;text-decoration:none;padding:8px 13px;border-radius:6px;font-weight:800;font-size:0.78rem;">
          🏡 30-Sec Retirement Calculator
        </a>
        <a href="{LS_MONTHLY_URL}" class="lemonsqueezy-button" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" style="background:#eab308;color:#0f172a;text-decoration:none;padding:8px 14px;border-radius:6px;font-weight:800;font-size:0.78rem;">
          ⚡ Start Monthly VIP — $29/mo
        </a>
        <a href="{LS_ANNUAL_URL}" class="lemonsqueezy-button" data-tom-paid-plan="annual" data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b" style="background:#1e293b;border:1px solid #475569;color:#f8fafc;text-decoration:none;padding:8px 14px;border-radius:6px;font-weight:700;font-size:0.78rem;">
          💎 Start Annual VIP — $199/yr
        </a>
      </div>
    </div>
  </section>
{cmp_lead_top}
  <div id="app"></div>
{cmp_lead_bottom}
{dir_html}
</body>
</html>
"""


def _normalize_canonical_sitemap_loc(raw_loc: str) -> str:
    loc = raw_loc.strip()
    if loc.endswith("/index.html"):
        loc = loc[: -len("index.html")]
    if loc in ("https://truthofmarket.com", "https://truthofmarket.com/insights", "https://truthofmarket.com/stocks", "https://truthofmarket.com/compare"):
        loc = loc + "/"
    return loc


def generate_all_seo_pages(js_name: str = "index-BIziPp23.js", css_name: str = "index-CaOpdap3.css") -> str:
    stocks, semi = load_stocks_and_semi()
    stocks_dir = PUB / "stocks"
    stocks_dir.mkdir(parents=True, exist_ok=True)

    # 1. Generate /semi-fear-greed.html & /pro-swing.html
    semi_html = generate_semi_fear_greed_page(semi, stocks, js_name, css_name)
    (PUB / "semi-fear-greed.html").write_text(semi_html, encoding="utf-8")

    pro_swing_html = generate_pro_swing_page(semi, stocks, js_name, css_name)
    (PUB / "pro-swing.html").write_text(pro_swing_html, encoding="utf-8")

    # 2. Generate 72 stock pages + 4 ETF pages (SMH, XLV, SOXL, QQQ)
    smh_close = float(semi.get("smh_close") or 504.48)
    smh_dd = float(semi.get("smh_dd_pct") or -24.58)
    smh_rsi = float(semi.get("smh_rsi") or 34.2)
    xlv_close = float(semi.get("xlv_close") or 179.28)
    qqq_close = float(semi.get("qqq_close") or 690.49)
    as_of = str(semi.get("date") or "2026-11-05")

    etf_synthetics = [
        {
            "ticker": "SMH",
            "name_en": "VanEck Semiconductor ETF",
            "name_kr": "VanEck Semiconductor ETF",
            "name_jp": "VanEck Semiconductor ETF",
            "sector": "Semiconductor ETF",
            "date": as_of,
            "close": smh_close,
            "low52": round(smh_close * 0.82, 2),
            "high52": round(smh_close / (1.0 + smh_dd / 100.0), 2),
            "dd_high52_pct": smh_dd,
            "prox_low52_pct": 18.0,
            "ma20_price": round(smh_close * 1.03, 2),
            "ma60_price": round(smh_close * 1.06, 2),
            "rsi14": smh_rsi,
            "vol_surge_10d": 1.68,
            "score": 88,
            "zone_code": "WASHOUT_WATCH",
            "zone_label_en": "BARBELL GROWTH SLEEVE (70%-80% MODEL)",
            "entry_trigger_price": round(smh_close * 1.02, 2),
            "stop_loss_price": round(smh_close * 0.91, 2),
            "tp1_2x_price": round(smh_close * 2.0, 2),
        },
        {
            "ticker": "XLV",
            "name_en": "Health Care Select Sector SPDR ETF",
            "name_kr": "Health Care Select Sector SPDR ETF",
            "name_jp": "Health Care Select Sector SPDR ETF",
            "sector": "Healthcare Defensive ETF",
            "date": as_of,
            "close": xlv_close,
            "low52": round(xlv_close * 0.88, 2),
            "high52": round(xlv_close * 1.06, 2),
            "dd_high52_pct": -5.4,
            "prox_low52_pct": 13.6,
            "ma20_price": round(xlv_close * 0.99, 2),
            "ma60_price": round(xlv_close * 0.98, 2),
            "rsi14": 54.5,
            "vol_surge_10d": 1.12,
            "score": 82,
            "zone_code": "MA_APPROACH",
            "zone_label_en": "DEFENSIVE HEALTHCARE SLEEVE (20%-30% MODEL)",
            "entry_trigger_price": round(xlv_close * 0.99, 2),
            "stop_loss_price": round(xlv_close * 0.91, 2),
            "tp1_2x_price": round(xlv_close * 1.45, 2),
        },
        {
            "ticker": "SOXL",
            "name_en": "Direxion Daily Semiconductor Bull 3X Shares",
            "name_kr": "Direxion Daily Semiconductor Bull 3X Shares",
            "name_jp": "Direxion Daily Semiconductor Bull 3X Shares",
            "sector": "3x Leveraged Semiconductor ETF",
            "date": as_of,
            "close": 28.40,
            "low52": 18.50,
            "high52": 68.90,
            "dd_high52_pct": -58.8,
            "prox_low52_pct": 53.5,
            "ma20_price": 30.10,
            "ma60_price": 33.80,
            "rsi14": 36.4,
            "vol_surge_10d": 1.94,
            "score": 85,
            "zone_code": "WASHOUT_WATCH",
            "zone_label_en": "HIGH-VOLATILITY DECAY STUDY (SUB-MA60)",
            "entry_trigger_price": 31.20,
            "stop_loss_price": 25.84,
            "tp1_2x_price": 56.80,
        },
        {
            "ticker": "QQQ",
            "name_en": "Invesco QQQ Trust (Nasdaq-100 ETF)",
            "name_kr": "Invesco QQQ Trust (Nasdaq-100 ETF)",
            "name_jp": "Invesco QQQ Trust (Nasdaq-100 ETF)",
            "sector": "Nasdaq-100 Benchmark ETF",
            "date": as_of,
            "close": qqq_close,
            "low52": round(qqq_close * 0.81, 2),
            "high52": round(qqq_close * 1.07, 2),
            "dd_high52_pct": -6.5,
            "prox_low52_pct": 23.4,
            "ma20_price": round(qqq_close * 0.99, 2),
            "ma60_price": round(qqq_close * 0.97, 2),
            "rsi14": 51.8,
            "vol_surge_10d": 1.18,
            "score": 80,
            "zone_code": "MA_APPROACH",
            "zone_label_en": "CORE BENCHMARK TREND",
            "entry_trigger_price": round(qqq_close * 0.99, 2),
            "stop_loss_price": round(qqq_close * 0.91, 2),
            "tp1_2x_price": round(qqq_close * 1.6, 2),
        },
    ]

    existing_tickers = {str(s.get("ticker") or "").upper() for s in stocks}
    combined = list(stocks) + [e for e in etf_synthetics if e["ticker"] not in existing_tickers]

    sitemap_urls: List[tuple[str, str, str]] = [
        ("https://truthofmarket.com/", "1.0", "daily"),
        ("https://truthofmarket.com/semi-fear-greed.html", "0.95", "daily"),
        ("https://truthofmarket.com/pro-swing.html", "0.90", "daily"),
        ("https://truthofmarket.com/terms.html", "0.60", "monthly"),
        ("https://truthofmarket.com/privacy.html", "0.60", "monthly"),
        ("https://truthofmarket.com/refund.html", "0.65", "monthly"),
        ("https://truthofmarket.com/contact.html", "0.60", "monthly"),
    ]

    for item in combined:
        tkr = str(item.get("ticker") or "").strip().upper()
        if not tkr or "." in tkr:
            continue
        page_html = generate_single_stock_page(item, semi, stocks, js_name, css_name)
        out_file = stocks_dir / f"{tkr.lower()}.html"
        out_file.write_text(page_html, encoding="utf-8")
        prio = "0.90" if tkr in ("CELH", "NVDA", "TSLA", "AMD", "AVGO", "SMH", "XLV", "QQQ", "MSFT", "AAPL") else "0.80"
        sitemap_urls.append((f"https://truthofmarket.com/stocks/{tkr.lower()}.html", prio, "daily"))

    # 3. Generate 50 Head-to-Head Comparison SEO pages (/compare/<a-vs-b>.html)
    compare_dir = PUB / "compare"
    compare_dir.mkdir(parents=True, exist_ok=True)
    by_ticker = {str(it.get("ticker") or "").strip().upper(): it for it in combined}
    compare_count = 0
    llms_compare_lines = []
    for t1, t2, theme_label in COMPARE_PAIRS:
        sa = by_ticker.get(t1) or {"ticker": t1, "name_en": t1, "close": 100.0, "score": 78, "rsi14": 48.0, "vol_surge_10d": 1.3}
        sb = by_ticker.get(t2) or {"ticker": t2, "name_en": t2, "close": 100.0, "score": 74, "rsi14": 51.0, "vol_surge_10d": 1.15}
        cmp_html = generate_comparison_page(sa, sb, theme_label, semi, stocks, js_name, css_name)
        slug = f"{t1.lower()}-vs-{t2.lower()}.html"
        (compare_dir / slug).write_text(cmp_html, encoding="utf-8")
        sitemap_urls.append((f"https://truthofmarket.com/compare/{slug}", "0.88", "daily"))
        compare_count += 1
        s_a = int(sa.get("score") or 75)
        s_b = int(sb.get("score") or 72)
        v_a = float(sa.get("vol_surge_10d") or 1.2)
        v_b = float(sb.get("vol_surge_10d") or 1.1)
        win = t1 if (s_a, v_a) >= (s_b, v_b) else t2
        llms_compare_lines.append(
            f"- ${t1} vs ${t2} ({theme_label}): Higher Factor Score=${win} | ${t1}={s_a}/100 ({v_a:.2f}x Vol) vs ${t2}={s_b}/100 ({v_b:.2f}x Vol) -> https://truthofmarket.com/compare/{slug}"
        )

    # 3.5 Generate Editorial Insights (/insights/)
    from scripts.generate_daily_quant_insights import generate_all_quant_insights
    insight_smap_entries, insight_rss_items = generate_all_quant_insights()
    for loc, prio, freq in insight_smap_entries:
        sitemap_urls.append((loc, prio, freq))
    llms_insight_lines = [f"- {it['title']} -> {it['link']}" for it in insight_rss_items]

    # 4. Generate llms-full.txt (clean Educational Calculator Software positioning)
    llms_stock_lines = []
    for item in combined:
        tkr = str(item.get("ticker") or "").strip().upper()
        if not tkr or "." in tkr:
            continue
        nm = str(item.get("name_en") or item.get("name") or tkr)
        cp = float(item.get("close") or 100.0)
        sc = int(item.get("score") or 70)
        rs = float(item.get("rsi14") or 50.0)
        vs = float(item.get("vol_surge_10d") or 1.1)
        low_ref = float(item.get("stop_loss_price") or round(cp * 0.91, 2))
        zn = str(item.get("zone_label_en") or item.get("zone_code") or "WASHOUT_WATCH")
        llms_stock_lines.append(
            f"| ${tkr} | {nm} | ${cp:.2f} | {sc}/100 | {rs:.1f} | {vs:.2f}x | ${low_ref:.2f} | {zn} | https://truthofmarket.com/stocks/{tkr.lower()}.html |"
        )

    llms_full_txt = (
        f"# TruthOfMarket (https://truthofmarket.com) — Educational Market Data & Retirement Cashflow Corpus\n"
        f"> Operated by: Educational Market Data & Quantitative Research Desk (beable9489@gmail.com)\n"
        f"> Updated: {as_of} | US 401(k)/IRA Retirement Cashflow Calculator + Market Weather + 76 US Equity Factor Studies\n"
        f"> {MANDATORY_DISCLAIMER}\n\n"
        f"## 1. Core Retirement Cashflow & Market Weather Tools\n"
        f"- 30-Second US 401(k)/IRA Retirement Cashflow Calculator (SGOV · SCHD · JEPI · VOO): https://truthofmarket.com/\n"
        f"- Market Weather & $SMH:$XLV Barbell Calculator ({float(semi.get('fg_score') or 18.0):.1f}/100): https://truthofmarket.com/semi-fear-greed.html\n"
        f"- Self-Directed Quantitative Research Archive: https://truthofmarket.com/pro-swing.html\n"
        f"- Educational Insights Journal: https://truthofmarket.com/insights/\n"
        f"- Legal Policies: https://truthofmarket.com/terms.html | https://truthofmarket.com/privacy.html | https://truthofmarket.com/refund.html\n\n"
        f"## 2. 76 US Equity & ETF Public Factor Dataset\n"
        f"| Ticker | Company | Close | Factor Score | 14D RSI | 10D Vol Ratio | Lower Variance Ref | Regime | Study URL |\n"
        f"|---|---|---|---|---|---|---|---|---|\n"
        + "\n".join(llms_stock_lines)
        + "\n\n## 3. 50 Side-by-Side Quantitative Factor Comparisons (/compare/)\n"
        + "\n".join(llms_compare_lines)
        + "\n\n## 4. Educational Market Weather & Allocation Journal (/insights/)\n"
        + "\n".join(llms_insight_lines)
        + "\n"
    )
    (PUB / "llms-full.txt").write_text(llms_full_txt, encoding="utf-8")

    today_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    seen_locs: set[str] = set()
    url_blocks: List[str] = []
    for raw_loc, prio, freq in sitemap_urls:
        clean_loc = _normalize_canonical_sitemap_loc(raw_loc)
        if clean_loc in seen_locs:
            continue
        seen_locs.add(clean_loc)
        url_blocks.append(
            f"""  <url>
    <loc>{clean_loc}</loc>
    <lastmod>{today_iso}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{prio}</priority>
  </url>"""
        )
    sitemap_xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(url_blocks)
        + "\n</urlset>\n"
    )
    (PUB / "sitemap.xml").write_text(sitemap_xml, encoding="utf-8")

    # Sync SEO detail directories & files into ./dist, ./frontend/dist, and root without clobbering index.html
    for target_dir in [ROOT / "dist", ROOT / "frontend" / "dist", ROOT]:
        if not target_dir.exists():
            continue
        for sub_d in ("stocks", "compare", "insights"):
            src_d = PUB / sub_d
            if src_d.exists():
                shutil.copytree(src_d, target_dir / sub_d, dirs_exist_ok=True)
        for fname in ("semi-fear-greed.html", "pro-swing.html", "sitemap.xml", "llms-full.txt", "terms.html", "privacy.html", "refund.html", "contact.html"):
            src_f = PUB / fname
            if src_f.exists() and src_f.resolve() != (target_dir / fname).resolve():
                shutil.copy2(src_f, target_dir / fname)

    print(f"[SEO] Generated /pro-swing.html + /semi-fear-greed.html + {len(combined)} /stocks/ + {compare_count} /compare/ + /insights/ + canonical sitemap.xml ({len(seen_locs)} URLs)")
    return build_ticker_directory_html(stocks, prefix="/", senior_home_only=True)


if __name__ == "__main__":
    generate_all_seo_pages()
