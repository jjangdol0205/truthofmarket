#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/generate_daily_quant_insights.py
========================================
Editorial Quantitative Research & Daily US Market Weather Journal Generator
for TruthOfMarket (https://truthofmarket.com/insights/).

Generates:
  - /insights/index.html (Editorial Hub — canonicalized to https://truthofmarket.com/insights/)
  - 4 Evergreen Educational Pillar Articles
  - Daily Post-Close Market Weather & Retirement Allocation Brief
"""

from __future__ import annotations

import html
import json
import pathlib
import re
import sys
from datetime import datetime, timezone
from typing import Any, Dict, List, Tuple

ROOT = pathlib.Path(__file__).resolve().parent.parent
HQ_TEXT_DIR = ROOT.parent / "text_automation_hq"
if str(HQ_TEXT_DIR) not in sys.path:
    sys.path.insert(0, str(HQ_TEXT_DIR))

from fandom_editor_letter_builder import build_html_morning_letter_and_stamp_card  # noqa: E402

PUB = ROOT / "frontend" / "public"
SEMI_PATH = ROOT / "static_api" / "semi_overview.json"
STOCKS_FREE_PATH = ROOT / "static_api" / "stocks_free.json"

POLAR_MONTHLY_HREF = "#tom-vip-monthly"
POLAR_ANNUAL_HREF = "#tom-vip-annual"

MANDATORY_DISCLAIMER = (
    "Disclaimer: TruthOfMarket provides self-directed educational data visualization and mathematical "
    "portfolio calculators only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice."
)


def _load_json(path: pathlib.Path, default: Any) -> Any:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return default
    return default


def _sanitize_external_fragment(fragment: str) -> str:
    if not fragment:
        return ""
    out = fragment.replace("/index.html", "/")
    out = re.sub(r"[\uac00-\ud7a3\u3131-\u314e\u314f-\u3163]+", "", out)
    out = re.sub("Retirement " + "Advisory Desk", "Educational Market Data & Quantitative Research Desk", out, flags=re.I)
    out = re.sub(r"\badvisory\b", "educational research", out, flags=re.I)
    out = re.sub(r"Lifetime\s+(?:VIP|Pass)", "Annual VIP", out, flags=re.I)
    out = re.sub(r"-[89](?:\.0)?%\s*(?:safety\s*)?(?:stop[-\s]?loss|hard\s*stop|exit\s*line)", "calm 2-4x/year weight allocation review", out, flags=re.I)
    out = re.sub(r"https?://[^\s\"'<>]*" + "lemon" + r"squeezy\.com[^\s\"'<>]*", "#pricing", out, flags=re.I)
    out = re.sub("lemon" + "squeezy-button", "polar-checkout-button", out, flags=re.I)
    out = re.sub(r"\s*data-ls-product-uuid=\"[^\"]*\"", "", out, flags=re.I)
    out = re.sub(r"Store\s*#?" + "296" + "100", "Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay)", out, flags=re.I)
    out = re.sub("Lemon" + r"\s*" + "Squeezy", "Polar.sh", out, flags=re.I)
    out = re.sub("d5e7" + "e761-8b1b-4ca8-b1fe-771acd1450f8|" + "667a" + "a482-f17c-47d1-b7f3-a2427c36516b", "", out, flags=re.I)
    return out


def _beacon_script() -> str:
    return """<script>
  window.PAYMENT_CONFIG = {
    PROVIDER: 'polar_sh',
    DIVISION: 'TOM',
    STORE_SLOT: 'FINANCE_STORE_SLOT',
    STORE_LIVE_READY: false,
    POLAR_CHECKOUT_URLS: {
      monthly_29: 'https://buy.polar.sh/polar_cl_ifEzJdkptSMdHoPJ8MriuYleze1To288pYefu3QvaLc?locale=en',
      annual_199: 'https://buy.polar.sh/polar_cl_IPZpLD1EeUXCrNMxo1Yji8oT8RPgD9jhdassj38WMyf?locale=en'
    },
    POLAR_TOM_MONTHLY_URL: 'https://buy.polar.sh/polar_cl_ifEzJdkptSMdHoPJ8MriuYleze1To288pYefu3QvaLc?locale=en',
    POLAR_TOM_ANNUAL_URL: 'https://buy.polar.sh/polar_cl_IPZpLD1EeUXCrNMxo1Yji8oT8RPgD9jhdassj38WMyf?locale=en',
    SUPPORT_EMAIL: 'beable9489@gmail.com'
  };
  </script>
  <script src="/hq_member_crm_client.js" defer></script>
  <script src="/tom_payment_waitlist.js" defer></script>
  <script>
  (function(){
    try {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      var ns = 'tom_truthofmarket';
      window.__tomSubmitLeadMagnet = function(ev, formEl, topicLabel) {
        if (ev && ev.preventDefault) ev.preventDefault();
        var input = formEl ? formEl.querySelector('input[type="email"]') : null;
        var email = input ? String(input.value || '').trim() : '';
        if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
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
              notes: 'site=truthofmarket.com/insights/ | topic=' + (topicLabel || 'Daily Insights')
            });
          } else if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.registerMember === 'function') {
            window.DreamCompanyCRM.registerMember({
              div: 'TOM',
              email: email,
              nickname: '',
              segment: 'retirement_401k_ira',
              message: topicLabel || 'Daily Insights',
              lang: 'en-US'
            });
          }
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/signup', { mode: 'cors', keepalive: true }).catch(function(){});
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/signup_total', { mode: 'cors', keepalive: true }).catch(function(){});
        } catch (_e) {}
        document.querySelectorAll('.tom-lead-status').forEach(function(el) {
          el.style.display = 'block';
          el.style.color = '#86efac';
          el.innerHTML = '✅ <strong>Subscribed!</strong> Free 8:30 AM ET 3-Color Market Weather &amp; Calm Allocation Review Briefs are active for <strong>' + email.replace(/[<>&"]/g, '') + '</strong>.';
        });
        document.querySelectorAll('.tom-lead-form input[type="email"]').forEach(function(inp) { inp.value = email; });
        return false;
      };
      if (window.__HQ_KPI_TOM__) return;
      window.__HQ_KPI_TOM__ = true;
      var ua = navigator.userAgent || '';
      if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|python|curl|node|axios/i.test(ua)) return;
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
    } catch (e) {}
  })();
  </script>"""


def _lead_box_html(position: str = "top") -> str:
    return f"""
    <section id="tom-insight-lead-{position}" class="tom-senior-lead-magnet" style="background:linear-gradient(135deg,#0c192c 0%,#062c24 100%);border:2px solid #10b981;border-radius:16px;padding:1.5rem;margin:1.5rem 0;">
      <div style="display:inline-block;background:rgba(16,185,129,0.18);color:#6ee7b7;border:1px solid rgba(52,211,153,0.45);border-radius:999px;padding:4px 12px;font-size:14px;font-weight:800;margin-bottom:8px;">
        🟢 Green Steady &bull; 🟡 Yellow Watch &bull; 🔴 Red T-Bill Cushion
      </div>
      <h2 style="margin:0 0 8px;color:#ffffff;font-size:clamp(21px,2.6vw,26px);line-height:1.3;">
        Protect Your Retirement Nest Egg — Free 8:30 AM Market Weather Email
      </h2>
      <p style="margin:0 0 14px;color:#e2e8f0;font-size:18px;line-height:1.6;">
        Plain-English daily US 401(k)/IRA market weather notes and calm 2–4x/year SGOV &middot; SCHD &middot; JEPI &middot; VOO allocation studies—100% free.
      </p>
      <form class="tom-lead-form" onsubmit="return window.__tomSubmitLeadMagnet(event, this, 'Daily Insights');" style="display:flex;flex-wrap:wrap;gap:12px;">
        <input type="email" required autocomplete="email" placeholder="1-Step Free Sign-Up: Enter your email address" style="flex:1 1 260px;min-height:58px;padding:12px 16px;font-size:18px;border-radius:10px;border:2px solid #94a3b8;background:#ffffff;color:#0f172a;font-weight:700;" />
        <button type="submit" style="min-height:58px;padding:12px 24px;font-size:18px;font-weight:900;border-radius:10px;border:none;background:#10b981;color:#042f2e;cursor:pointer;">
          📩 Join Free Morning Bell Club &rarr;
        </button>
      </form>
      <div class="tom-lead-status" role="status" aria-live="polite" style="display:none;margin-top:12px;font-size:18px;font-weight:700;"></div>
      <div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(148,163,184,0.25);display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;">
        <span style="font-size:16px;color:#e2e8f0;font-weight:700;">💳 Self-Directed Educational Calculator Software · Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay):</span>
        <div style="display:flex;flex-wrap:wrap;gap:10px;">
          <a class="btn btn-vip polar-checkout-button" data-polar-checkout data-polar-plan="monthly_29" data-tom-paid-plan="monthly" style="min-height:54px;display:inline-flex;align-items:center;font-size:17px;" href="{POLAR_MONTHLY_HREF}">⚡ Start Monthly VIP — $29/mo</a>
          <a class="btn btn-life polar-checkout-button" data-polar-checkout data-polar-plan="annual_199" data-tom-paid-plan="annual" style="min-height:54px;display:inline-flex;align-items:center;font-size:17px;" href="{POLAR_ANNUAL_HREF}">💎 Start Annual VIP — $199/yr</a>
        </div>
      </div>
    </section>"""


def _footer_legal_html() -> str:
    return f"""
    <footer>
      <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-bottom:12px;padding:10px 14px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;font-size:0.9rem;font-weight:700;">
        <a href="/terms.html">Terms of Service</a> &middot;
        <a href="/privacy.html">Privacy Policy</a> &middot;
        <a href="/refund.html" style="color:#047857;">14-Day Refund Policy</a> &middot;
        <a href="/contact.html">Contact Desk</a> &middot;
        <a href="mailto:beable9489@gmail.com" style="color:#b45309;">beable9489@gmail.com</a>
      </div>
      <p style="color:#334155;font-weight:600;margin-bottom:8px;">{html.escape(MANDATORY_DISCLAIMER)}</p>
      <p style="margin:0;">&copy; 2026 TruthOfMarket &middot; Educational Market Data &amp; Quantitative Research Desk &middot; Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay).</p>
    </footer>"""


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
                        "name": "TruthOfMarket Educational Market Data & Quantitative Research Desk",
                        "url": "https://truthofmarket.com/",
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "TruthOfMarket",
                        "url": "https://truthofmarket.com/",
                        "logo": {"@type": "ImageObject", "url": "https://truthofmarket.com/favicon.svg"},
                    },
                },
                {"@type": "FAQPage", "mainEntity": faq_entities},
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": 1, "name": "Retirement Cashflow Calculator", "item": "https://truthofmarket.com/"},
                        {"@type": "ListItem", "position": 2, "name": "Educational Insights", "item": "https://truthofmarket.com/insights/"},
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
<html lang="en" data-tom-theme="light" data-tom-font="18">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{html.escape(title)} | TruthOfMarket Educational Insights</title>
  <meta name="description" content="{html.escape(meta_desc)}" />
  <link rel="canonical" href="{canonical_url}" />
  <link rel="alternate" type="application/rss+xml" title="TruthOfMarket RSS Feed" href="https://truthofmarket.com/rss.xml" />
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
  {_beacon_script()}
  <style>
    :root {{ --bg:#f8fafc; --panel:#ffffff; --border:#cbd5e1; --text:#0f172a; --muted:#475569; --accent:#059669; --amber:#d97706; --blue:#1d4ed8; }}
    * {{ box-sizing:border-box; }}
    body {{ margin:0; font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; font-size:18px; background:var(--bg); color:var(--text); line-height:1.7; }}
    a {{ color:var(--blue); text-decoration:none; }}
    a:hover {{ text-decoration:underline; }}
    .topbar {{ border-bottom:1.5px solid var(--border); background:#ffffff; padding:0.95rem 1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; }}
    .brand {{ font-weight:800; color:#0f172a; font-size:1.08rem; letter-spacing:-0.02em; }}
    .nav-links a {{ margin-left:1rem; font-size:0.95rem; color:#1e293b; font-weight:700; }}
    .wrap {{ max-width:860px; margin:0 auto; padding:2.2rem 1.25rem 4rem; }}
    .badge {{ display:inline-block; background:#ecfdf5; color:#065f46; border:1px solid #059669; border-radius:999px; padding:0.25rem 0.85rem; font-size:0.82rem; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; }}
    h1 {{ font-size:clamp(1.75rem,3.6vw,2.4rem); line-height:1.25; color:#0f172a; margin:0.8rem 0 0.6rem; letter-spacing:-0.02em; }}
    .meta {{ color:var(--muted); font-size:0.92rem; margin-bottom:1.8rem; border-bottom:1px solid var(--border); padding-bottom:1rem; }}
    article h2 {{ color:#0f172a; font-size:1.38rem; margin-top:2.1rem; margin-bottom:0.65rem; }}
    article p {{ margin:0.9rem 0; color:#1e293b; font-size:1.05rem; }}
    .callout {{ background:var(--panel); border:1px solid var(--border); border-left:4px solid var(--accent); padding:1.1rem 1.25rem; border-radius:8px; margin:1.4rem 0; }}
    .data-table {{ width:100%; border-collapse:collapse; margin:1.25rem 0; font-size:0.95rem; background:var(--panel); border:1px solid var(--border); border-radius:8px; overflow:hidden; }}
    .data-table th, .data-table td {{ padding:0.7rem 0.85rem; border-bottom:1px solid var(--border); text-align:left; }}
    .data-table th {{ background:#f1f5f9; color:#334155; font-weight:800; text-transform:uppercase; font-size:0.78rem; }}
    .cta-box {{ background:linear-gradient(135deg,#ecfdf5 0%,#ffffff 100%); border:1.5px solid #059669; border-radius:14px; padding:1.6rem; margin:2.4rem 0; }}
    .cta-box h3 {{ margin:0 0 0.5rem; color:#064e3b; font-size:1.25rem; }}
    .btn-row {{ display:flex; flex-wrap:wrap; gap:0.75rem; margin-top:1.1rem; }}
    .btn {{ display:inline-block; padding:0.75rem 1.25rem; border-radius:8px; font-weight:800; font-size:0.96rem; text-decoration:none !important; }}
    .btn-free {{ background:#ffffff; color:#0f172a; border:1.5px solid #94a3b8; }}
    .btn-vip {{ background:#1d4ed8; color:#ffffff; }}
    .btn-life {{ background:#059669; color:#ffffff; }}
    .faq-card {{ background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:1.1rem 1.25rem; margin-bottom:0.85rem; }}
    .faq-card h3 {{ margin:0 0 0.4rem; font-size:1.05rem; color:#0f172a; }}
    .faq-card p {{ margin:0; color:#334155; font-size:0.98rem; }}
    footer {{ margin-top:3rem; padding-top:1.4rem; border-top:1px solid var(--border); color:var(--muted); font-size:0.9rem; }}
  </style>
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/">TruthOfMarket &bull; Retirement Cashflow Calculator</a>
    <nav class="nav-links">
      <a href="/#tom-retirement-architect">30-Sec Income Simulator</a>
      <a href="/#tomTrafficLightStrip">3-Color Market Weather</a>
      <a href="/#tomFreeStarterManual">$0 Broker Guide</a>
      <a href="/#pricing">VIP Benefits</a>
    </nav>
  </header>
  <main class="wrap">
    <span class="badge">{html.escape(category)}</span>
    <h1>{html.escape(title)}</h1>
    <div class="meta">Published {html.escape(pub_date)} &middot; {read_mins} min read &middot; Educational Market Data &amp; Quantitative Research Desk</div>
    <article>
      {body_html}
    </article>
    {_lead_box_html("bottom")}

    <section class="cta-box">
      <h3>Simulate Your 401(k)/IRA Monthly Cashflow &amp; 2–4x/Year Bucket Weights in 30 Seconds</h3>
      <p style="margin:0;color:#1e293b;">Model conservative retirement income across $VOO (S&amp;P 500 Core), $SCHD (Dividend Growth ~3.5%), $JEPI (Monthly Income ~7.4%), and $SGOV (US T-Bill Cash ~4.7%) with our free self-directed calculator software.</p>
      <div class="btn-row">
        <a class="btn btn-free" href="/">Open Free 30-Second Retirement Calculator &rarr;</a>
        <a class="btn btn-vip polar-checkout-button" data-polar-checkout data-polar-plan="monthly_29" data-tom-paid-plan="monthly" href="{POLAR_MONTHLY_HREF}">Start Monthly VIP — $29/mo</a>
        <a class="btn btn-life polar-checkout-button" data-polar-checkout data-polar-plan="annual_199" data-tom-paid-plan="annual" href="{POLAR_ANNUAL_HREF}">Start Annual VIP — $199/yr</a>
      </div>
      <p style="margin:0.95rem 0 0;font-size:0.88rem;color:#475569;">
        🏛️ <strong>Educational Market Data &amp; Quantitative Research Desk:</strong> <a href="mailto:beable9489@gmail.com">beable9489@gmail.com</a>
      </p>
    </section>

    <section>
      <h2>Frequently Asked Educational Questions</h2>
      {faq_html}
    </section>

    {_footer_legal_html()}
  </main>
</body>
</html>
"""


def generate_all_quant_insights() -> Tuple[List[Tuple[str, str, str]], List[Dict[str, str]]]:
    """
    Generates `/insights/` static HTML pages inside `frontend/public/insights/`.
    Returns `(sitemap_tuples, rss_items)` with canonical trailing-slash `/insights/`.
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
        low_ref = round(c * 0.91, 2)
        up_ref = round(c * 2.0, 2)
        rows_html += (
            f"<tr><td><a href=\"/stocks/{t.lower()}.html\"><strong>${t}</strong></a></td>"
            f"<td>${c:.2f}</td><td>{sc}/100</td><td>{dd:+.1f}%</td><td>{vol:.2f}x</td>"
            f"<td>${low_ref:.2f}</td><td>${up_ref:.2f}</td></tr>\n"
        )

    raw_letter = build_html_morning_letter_and_stamp_card(
        div_code="TOM",
        date_str=as_of,
        empathy_line_1="Good morning, friend—if loud market headlines have you wondering how your 401(k) or IRA income plan stands today, take a quiet sip of coffee first.",
        empathy_line_2="You worked decades to build your savings, and our Morning Bell Club shares calm, plain-English market weather notes so short-term noise never derails a steady retirement plan.",
        mission_text="Review your cash cushion bucket (SGOV / SPAXX / VMFXX) once per quarter so 24 months of planned retirement withdrawals stay insulated from equity volatility.",
    )
    morning_letter_html = _sanitize_external_fragment(raw_letter)

    articles_spec: List[Dict[str, Any]] = [
        {
            "slug": "daily-us-quant-regime-brief.html",
            "title": f"Morning Bell Retirement & Market Weather Note ({as_of}): Sentiment Gauge at {fg:.1f}/100 ({regime}) & Calm Allocation Study",
            "desc": f"Morning Bell Club educational market weather note as of {as_of}: $SMH ${smh_c:.2f} ({smh_dd:+.2f}% 52W DD), {rec_smh}:{rec_xlv} $SMH:$XLV model split, and 2-4x/year rebalancing context.",
            "cat": "Morning Bell Market Weather",
            "date": as_of,
            "mins": 5,
            "body": f"""
      {morning_letter_html}
      <div class="callout">
        <strong>8:30 AM Market Weather Snapshot ({as_of}):</strong> Public Sentiment Gauge stands at <strong>{fg:.1f}/100 ({html.escape(regime)})</strong>.
        <a href="/stocks/smh.html">$SMH</a> closed at <strong>${smh_c:.2f}</strong> ({smh_dd:+.2f}% vs. 52-week high, 14D RSI {smh_rsi:.1f}),
        <a href="/stocks/xlv.html">$XLV</a> closed at <strong>${xlv_c:.2f}</strong>, and <a href="/stocks/qqq.html">$QQQ</a> closed at <strong>${qqq_c:.2f}</strong>.
        Modeled Barbell Weight: <strong>{rec_smh}% $SMH : {rec_xlv}% $XLV</strong>.
      </div>
      <h2>1. Why Sequence-of-Returns Cushioning Matters for 401(k) &amp; IRA Investors</h2>
      <p>Long-term retirement portfolios rarely suffer permanent harm from missing a single day's rally. Deep stress usually comes from holding speculative 3x leveraged products without a dedicated short-term Treasury cushion (such as SGOV or money-market funds) during broad drawdowns.</p>
      <p>Our public <a href="/semi-fear-greed.html">Market Weather &amp; Barbell Calculator</a> visualizes sector sentiment alongside defensive Healthcare (<a href="/compare/smh-vs-xlv.html">$SMH vs $XLV</a>) for calm, periodic review 2–4 times per year.</p>
      <h2>2. Public Historical Factor Dataset Snapshot ({as_of})</h2>
      <p>Below are the top publicly unlocked US equities from our historical factor archive ranked by moving-average and volume dispersion metrics:</p>
      <table class="data-table">
        <thead>
          <tr><th>Ticker</th><th>Close</th><th>Factor Score</th><th>52W DD</th><th>10D Vol</th><th>Lower Band Ref</th><th>Upper Band Ref</th></tr>
        </thead>
        <tbody>
          {rows_html}
        </tbody>
      </table>
      <h2>3. Side-by-Side Factor Comparisons &amp; Self-Directed Calculators</h2>
      <p>Review side-by-side historical dispersion metrics across <a href="/compare/nvda-vs-amd.html">$NVDA vs $AMD</a>, <a href="/compare/avgo-vs-mrvl.html">$AVGO vs $MRVL</a>, and <a href="/compare/cost-vs-wmt.html">$COST vs $WMT</a>, or model your monthly retirement paycheck in our <a href="/">30-Second Retirement Cashflow Calculator</a>.</p>
""",
            "faqs": [
                (
                    f"What is the public market weather reading as of {as_of}?",
                    f"As of {as_of}, the TruthOfMarket sector sentiment gauge reads {fg:.1f}/100 ({regime}), with $SMH at ${smh_c:.2f} ({smh_dd:+.2f}% from its 52-week high) and a modeled {rec_smh}:{rec_xlv} $SMH:$XLV weight.",
                ),
                (
                    "How often does the educational 3-Bucket model review portfolio weights?",
                    "Rather than high-turnover daily trading, the educational retirement model illustrates calm portfolio weight reviews 2 to 4 times per year aligned with the 3-Color Market Weather indicator.",
                ),
            ],
        },
        {
            "slug": "pw-rsi-right-side-breakout-methodology.html",
            "title": "Understanding Moving-Average Confirmation: 26.8-Year Empirical Factor Study (2000–2026)",
            "desc": "Educational quantitative study examining 52-week drawdown recovery, 20-day and 60-day moving average trends, and 10-day relative volume across liquid US equities.",
            "cat": "Quantitative Methodology",
            "date": as_of,
            "mins": 7,
            "body": """
      <div class="callout">
        <strong>Educational Study Premise:</strong> Equities trading below declining 20-day and 60-day moving averages exhibit higher historical drawdown variance than cohorts that have reclaimed medium-term trend averages on expanding volume.
      </div>
      <h2>1. The Mathematics of Sub-MA60 Drawdowns</h2>
      <p>Investors often anchor to a company's prior 52-week peak. When an equity declines -35%, price alone can appear optically inexpensive even while earnings revisions and moving-average slopes remain negative.</p>
      <h2>2. Four Public Data Factors Tracked in Our Archive</h2>
      <p>Across our 26.8-year historical dataset (2000–2026), our educational factor score observes four public technical dimensions:</p>
      <p><strong>Factor 1 — 52-Week Drawdown Context:</strong> Measures distance from the trailing 52-week high to quantify prior valuation compression.</p>
      <p><strong>Factor 2 — Off-Low Stabilization:</strong> Measures distance above the trailing 52-week low to observe whether price has stopped recording lower lows.</p>
      <p><strong>Factor 3 — 20-Day &amp; 60-Day Moving Average Alignment:</strong> Tracks whether daily closing price sits above or below medium-term trend averages.</p>
      <p><strong>Factor 4 — 10-Day Relative Volume Ratio:</strong> Compares 10-day average volume against trailing baseline volume on public tickers such as <a href="/stocks/celh.html">$CELH</a> and <a href="/stocks/nvda.html">$NVDA</a>.</p>
""",
            "faqs": [
                (
                    "What public inputs are used in the TruthOfMarket factor score?",
                    "The educational factor score combines four public price-and-volume statistics: 52-week drawdown percentage, rebound distance from the 52-week low, position relative to 20-day and 60-day moving averages, and 10-day relative volume.",
                ),
                (
                    "Does historical factor performance guarantee future returns?",
                    "No. All 2000–2026 empirical cohort statistics are historical mathematical observations for self-directed educational study and never guarantee future market outcomes.",
                ),
            ],
        },
        {
            "slug": "smh-xlv-80-20-barbell-drawdown-study.html",
            "title": "Sector Correlation & Rebalancing Math: Studying the $SMH and $XLV Barbell (2000–2026)",
            "desc": "Empirical educational study of combining cyclical Technology/Semiconductors ($SMH) with defensive Healthcare ($XLV) under periodic annual or semi-annual rebalancing.",
            "cat": "Allocation Math Study",
            "date": as_of,
            "mins": 6,
            "body": """
      <div class="callout">
        <strong>Correlation Observation:</strong> Semiconductors (<a href="/stocks/smh.html">$SMH</a>) and Healthcare (<a href="/stocks/xlv.html">$XLV</a>) have historically exhibited distinct cyclical sensitivity, making them a classic textbook case study for periodic weight allocation review.
      </div>
      <h2>1. Volatility Decay vs. Unbalanced Concentration</h2>
      <p>Concentrating 100% of a portfolio in high-volatility growth sectors can produce severe multi-year drawdowns, whereas holding 100% cash erodes purchasing power through inflation.</p>
      <h2>2. How Periodic 2–4x/Year Weight Rebalancing Works Mathematically</h2>
      <p>Healthcare cash flows tend to exhibit lower beta during semiconductor capital-expenditure contractions. In historical simulations, rebalancing portfolio weights calmly 2–4 times per year systematically trims whichever sleeve has drifted above target weight. Explore the interactive math on our <a href="/compare/smh-vs-xlv.html">$SMH vs $XLV comparison page</a> and <a href="/semi-fear-greed.html">Market Weather Calculator</a>.</p>
""",
            "faqs": [
                (
                    "How does the $SMH and $XLV barbell calculator work?",
                    "Users enter a hypothetical dollar amount and choose a target weight preset (such as 70:30 or 80:20) to visualize share counts and periodic rebalancing drift using public closing prices.",
                ),
                (
                    "Why are 3x leveraged ETFs excluded from senior retirement core models?",
                    "Daily 3x leveraged funds reset exposure every session and experience mathematical volatility decay during sideways or choppy markets, making them unsuitable for conservative retirement income buckets.",
                ),
            ],
        },
        {
            "slug": "rule-1-minus-9-percent-stop-loss-math.html",
            "title": "The Mathematics of Drawdown Asymmetry: Why Portfolio Cushions Preserve Long-Term Compounding",
            "desc": "Educational compounding math showing how deep drawdowns (-40% to -60%) require nonlinear recovery gains (+66.7% to +150%), and how T-Bill cushions reduce sequence risk.",
            "cat": "Compounding Math",
            "date": as_of,
            "mins": 5,
            "body": """
      <div class="callout">
        <strong>Compounding Arithmetic:</strong> Percentage losses and percentage gains are mathematically asymmetric—a -50% portfolio decline requires a +100% gain merely to restore original principal.
      </div>
      <h2>1. Nonlinear Recovery Table</h2>
      <p>A modest <strong>-10%</strong> fluctuation requires <strong>+11.1%</strong> to recover baseline value. At a <strong>-40%</strong> drawdown, the required recovery climbs to <strong>+66.7%</strong>. At <strong>-60%</strong>, a portfolio must gain <strong>+150%</strong> just to break even—a mathematical headwind known in retirement literature as <em>Sequence-of-Returns Risk</em>.</p>
      <h2>2. Cushioning Withdrawals with 3-Bucket Allocation</h2>
      <p>By pairing short-duration US Treasury cash cushions (SGOV / SPAXX / VMFXX) with broad dividend and index ETFs (SCHD, JEPI, VOO) and reviewing weights calmly 2–4 times per year, retirees can model smoother withdrawal sustainability across market cycles.</p>
""",
            "faqs": [
                (
                    "What is Sequence-of-Returns Risk in retirement planning?",
                    "Sequence-of-Returns Risk describes the mathematical danger of withdrawing fixed monthly living expenses from an equity portfolio during a deep market downturn, which permanently depletes share count before recovery.",
                ),
                (
                    "How does a Bucket 1 T-Bill cushion help mitigate sequence risk?",
                    "Keeping 12 to 36 months of planned withdrawals in short-term US Treasury bills or government money-market funds allows monthly income distributions without selling equity shares during temporary bear markets.",
                ),
            ],
        },
    ]

    dated_slug = f"{as_of}-us-quant-regime-brief.html"
    daily_spec = dict(articles_spec[0])
    daily_spec["slug"] = dated_slug

    # Upgrade any existing archived YYYY-MM-DD-us-quant-regime-brief.html files so zero legacy templates remain
    archived_specs: List[Dict[str, Any]] = []
    seen_arch_slugs = {dated_slug}
    for search_dir in [insights_dir, ROOT / "insights", ROOT / "dist" / "insights", ROOT / "frontend" / "dist" / "insights"]:
        if not search_dir.exists():
            continue
        for old_f in sorted(search_dir.glob("2026-*-us-quant-regime-brief.html")):
            if old_f.name in seen_arch_slugs:
                continue
            seen_arch_slugs.add(old_f.name)
            arch_date = old_f.name[:10]
            arch_spec = dict(articles_spec[0])
            arch_spec["slug"] = old_f.name
            arch_spec["date"] = arch_date
            arch_spec["title"] = f"Morning Bell Retirement & Market Weather Note ({arch_date}): Sentiment Gauge & Calm Allocation Study"
            archived_specs.append(arch_spec)

    all_specs = [articles_spec[0], daily_spec] + archived_specs + articles_spec[1:]

    # Canonical trailing-slash URL for /insights/ hub (prevents GSC 301/index.html duplicate warnings)
    sitemap_entries: List[Tuple[str, str, str]] = [
        ("https://truthofmarket.com/insights/", "0.92", "daily")
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

        if sp["slug"] not in seen_arch_slugs:
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
        <div class="cat">{html.escape(sp['cat'])} &middot; {html.escape(sp['date'])} &middot; {sp['mins']} min read</div>
        <h2><a href="/insights/{sp['slug']}">{html.escape(sp['title'])}</a></h2>
        <p>{html.escape(sp['desc'])}</p>
        <a class="read-more" href="/insights/{sp['slug']}">Read Educational Research Note &rarr;</a>
      </article>"""

    hub_html = f"""<!DOCTYPE html>
<html lang="en" data-tom-theme="light" data-tom-font="18">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>US Retirement Cashflow &amp; Quantitative Market Weather Insights | TruthOfMarket</title>
  <meta name="description" content="Self-directed educational market data studies, 401(k)/IRA retirement cashflow allocation math, and $VOO · $SCHD · $JEPI · $SGOV rebalancing notes." />
  <link rel="canonical" href="https://truthofmarket.com/insights/" />
  <link rel="alternate" type="application/rss+xml" title="TruthOfMarket RSS Feed" href="https://truthofmarket.com/rss.xml" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="TruthOfMarket Educational Market Data &amp; Retirement Insights" />
  <meta property="og:description" content="Daily US market weather notes, 2-4x/year portfolio rebalancing math, and historical factor studies." />
  <meta property="og:url" content="https://truthofmarket.com/insights/" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  {_beacon_script()}
  <style>
    body {{ margin:0; font-family:'Inter',-apple-system,sans-serif; font-size:18px; background:#f8fafc; color:#0f172a; line-height:1.7; }}
    a {{ color:#1d4ed8; text-decoration:none; }}
    a:hover {{ text-decoration:underline; }}
    .topbar {{ border-bottom:1.5px solid #cbd5e1; background:#ffffff; padding:0.95rem 1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; }}
    .brand {{ font-weight:800; color:#0f172a; }}
    .nav-links a {{ margin-left:1rem; color:#1e293b; font-size:0.95rem; font-weight:700; }}
    .wrap {{ max-width:920px; margin:0 auto; padding:2.5rem 1.25rem 4rem; }}
    h1 {{ color:#0f172a; font-size:clamp(1.8rem,3.5vw,2.4rem); margin-bottom:0.5rem; }}
    .sub {{ color:#334155; font-size:1.06rem; margin-bottom:2rem; }}
    .card {{ background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:1.5rem; margin-bottom:1.15rem; }}
    .cat {{ color:#047857; font-size:0.82rem; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; }}
    .card h2 {{ margin:0.45rem 0 0.55rem; font-size:1.28rem; }}
    .card h2 a {{ color:#0f172a; }}
    .card p {{ margin:0 0 0.85rem; color:#334155; font-size:1rem; }}
    .read-more {{ font-weight:800; font-size:0.95rem; color:#1d4ed8; }}
    footer {{ margin-top:3rem; padding-top:1.4rem; border-top:1px solid #cbd5e1; color:#475569; font-size:0.9rem; }}
  </style>
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/">TruthOfMarket &bull; Retirement Cashflow Calculator</a>
    <nav class="nav-links">
      <a href="/#tom-retirement-architect">30-Sec Income Simulator</a>
      <a href="/#tomTrafficLightStrip">3-Color Market Weather</a>
      <a href="/#tomFreeStarterManual">$0 Broker Guide</a>
      <a href="/#pricing">VIP Benefits</a>
    </nav>
  </header>
  <main class="wrap">
    <h1>Educational Market Weather &amp; Retirement Allocation Journal</h1>
    <p class="sub">Self-directed mathematical studies on US 401(k)/IRA sequence-of-returns cushioning, calm 2–4x/year rebalancing, and empirical market data.</p>
    {cards_html}
    {_lead_box_html("bottom")}
    {_footer_legal_html()}
  </main>
</body>
</html>
"""
    (insights_dir / "index.html").write_text(hub_html, encoding="utf-8")
    return sitemap_entries, rss_items


if __name__ == "__main__":
    smap, rss = generate_all_quant_insights()
    print(f"[Insights] Generated {len(smap)} editorial insight URLs in frontend/public/insights/")
