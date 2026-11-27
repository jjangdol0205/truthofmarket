#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/generate_daily_quant_insights.py
========================================
Substack-Inspired 680px Book-Reading Editorial Essays & Market Weather Notes
for TruthOfMarket (https://truthofmarket.com/insights/).

Generates:
  - /insights/index.html (Editorial Hub — canonicalized to https://truthofmarket.com/insights/)
  - /insights/why-quiet-barbells-outlast-loud-bull-markets.html (Flagship Human Columnist Prose Essay)
  - Evergreen Educational Pillar Essays & Daily Market Weather Note
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
PUB = ROOT / "frontend" / "public"
SEMI_PATH = ROOT / "static_api" / "semi_overview.json"
STOCKS_FREE_PATH = ROOT / "static_api" / "stocks_free.json"

WHOP_M_URL = "https://whop.com/checkout/plan_xVJeNwyrDef8T"
WHOP_A_URL = "https://whop.com/checkout/plan_9sdgFI753ucXQ"
WHOP_MONTHLY_HREF = WHOP_M_URL
WHOP_ANNUAL_HREF = WHOP_A_URL

MANDATORY_DISCLAIMER = (
    "Disclaimer: TruthOfMarket Research is a strictly non-advisory educational publisher providing general "
    "market data newsletters and 2000–2025 historical statistical workbooks only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice."
)


def _load_json(path: pathlib.Path, default: Any) -> Any:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return default
    return default


def _beacon_script(slug: str = "hub") -> str:
    safe_slug = re.sub(r"[^a-zA-Z0-9_.-]", "", slug)
    return f"""<script>
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
    WHOP_CHECKOUT_URLS: {{
      monthly: '{WHOP_M_URL}',
      annual: '{WHOP_A_URL}'
    }},
    WHOP_TOM_MONTHLY_URL: '{WHOP_M_URL}',
    WHOP_TOM_ANNUAL_URL: '{WHOP_A_URL}',
    SUPPORT_EMAIL: 'hello@truthofmarket.com'
  }};
  var COPY_MODE = 'LIVE_SHARP';
  window.TOM_COPY_MODE = COPY_MODE;
  </script>
  <script async defer src="https://js.whop.com/static/checkout/loader.js"></script>
  <script src="/hq_member_crm_client.js" defer></script>
  <script src="/tom_payment_waitlist.js" defer></script>
  <script>
  (function(){{
    try {{
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      var ns = 'tom_truthofmarket';
      window.__tomCopyEssayLink = function(btnEl) {{
        var url = (window.location && window.location.href) ? window.location.href : 'https://truthofmarket.com/insights/{safe_slug}';
        if (navigator.clipboard && navigator.clipboard.writeText) {{
          navigator.clipboard.writeText(url).then(function() {{
            if (btnEl) {{
              var orig = btnEl.getAttribute('data-orig') || btnEl.textContent;
              btnEl.setAttribute('data-orig', orig);
              btnEl.textContent = 'Copied Link';
              setTimeout(function() {{ btnEl.textContent = orig; }}, 2200);
            }}
          }}).catch(function(){{}});
        }}
      }};
      window.__tomSubmitSubstackSubscribe = function(ev, formEl, essaySlug) {{
        if (ev && ev.preventDefault) ev.preventDefault();
        var input = formEl ? formEl.querySelector('input[type="email"]') : null;
        var statusEl = formEl && formEl.parentNode ? formEl.parentNode.querySelector('.substack-sub-status') : null;
        var btnEl = formEl ? formEl.querySelector('button[type="submit"]') : null;
        var email = input ? String(input.value || '').trim().toLowerCase() : '';
        if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{{2,}}$/.test(email)) {{
          if (statusEl) {{
            statusEl.style.display = 'block';
            statusEl.style.color = '#991b1b';
            statusEl.textContent = 'Please enter a valid email address.';
          }}
          if (input) input.focus();
          return false;
        }}
        if (btnEl) {{
          btnEl.disabled = true;
          btnEl.textContent = 'Subscribing...';
        }}
        var noteStr = 'site=truthofmarket.com/insights/ | essay=' + (essaySlug || '{safe_slug}');
        try {{
          localStorage.setItem('tom_free_member_email', email);
          localStorage.setItem('tom_free_member_since', kst);
          localStorage.setItem('dc_member_TOM', JSON.stringify({{
            div: 'TOM',
            email: email,
            nickname: '',
            segment: 'substack_essay_reader',
            notes: noteStr,
            joined_at: new Date().toISOString()
          }}));
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/signup', {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
          fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/signup_total', {{ mode: 'cors', keepalive: true }}).catch(function(){{}});
        }} catch (_e) {{}}

        var finishOk = function() {{
          if (btnEl) {{
            btnEl.disabled = false;
            btnEl.textContent = 'Subscribed';
          }}
          if (statusEl) {{
            statusEl.style.display = 'block';
            statusEl.style.color = '#065f46';
            statusEl.innerHTML = 'Thank you. Future morning notes will arrive quietly at <strong>' + email.replace(/[<>&"]/g, '') + '</strong> (no password needed, 1-click unsubscribe anytime).';
          }}
        }};

        if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.registerMember === 'function') {{
          window.DreamCompanyCRM.registerMember({{
            div: 'TOM',
            email: email,
            nickname: '',
            segment: 'substack_essay_reader',
            lang: 'en-US',
            notes: noteStr,
            message: noteStr
          }}).then(finishOk).catch(finishOk);
        }} else if (typeof window.submitTomVipWaitlistOrManualEmail === 'function') {{
          window.submitTomVipWaitlistOrManualEmail({{
            email: email,
            segment: 'substack_essay_reader',
            lang: 'en-US',
            notes: noteStr
          }}).then(finishOk).catch(finishOk);
        }} else {{
          finishOk();
        }}
        return false;
      }};
      document.addEventListener('DOMContentLoaded', function() {{
        try {{
          var saved = localStorage.getItem('tom_free_member_email');
          if (saved) {{
            document.querySelectorAll('.substack-inline-form input[type="email"]').forEach(function(inp) {{
              if (!inp.value) inp.value = saved;
            }});
          }}
        }} catch (_e2) {{}}
      }});
      if (window.__HQ_KPI_TOM__) return;
      window.__HQ_KPI_TOM__ = true;
      var ua = navigator.userAgent || '';
      if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|python|curl|node|axios/i.test(ua)) return;
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
    }} catch (e) {{}}
  }})();
  </script>"""


def _substack_end_subscribe_html(slug: str) -> str:
    safe_slug = html.escape(slug, quote=True)
    return f"""
    <section class="substack-subscribe-box" aria-label="Subscribe to Morning Notes">
      <div class="substack-sub-title">Ready for the next morning note?</div>
      <p class="substack-sub-desc">
        Unrushed, plain-English research notes on the $SMH &times; $XLV sector balance and public market risk indicators. Free, zero password, 1-click unsubscribe anytime.
      </p>
      <form class="substack-inline-form" onsubmit="return window.__tomSubmitSubstackSubscribe(event, this, '{safe_slug}');" novalidate>
        <label for="substackEmailInput" class="sr-only">Email address</label>
        <input id="substackEmailInput" type="email" required autocomplete="email" placeholder="Type your email..." />
        <button type="submit">Subscribe Free</button>
      </form>
      <div class="substack-sub-status" role="status" aria-live="polite" style="display:none;"></div>
    </section>

    <aside class="editorial-postscript" aria-label="Historical Explorer and Research Passes">
      <div class="ps-label">Editorial Postscript &middot; Independent Educational Research</div>
      <p>
        Want to compare historical study ratios across 2000&ndash;2025 market cycles? Open our complimentary 4-step <a href="/#tom-retirement-architect"><strong>Historical Sector Backtest Explorer</strong></a>, or explore our Educational Market Data Newsletter + 2000&ndash;2025 Historical Statistical Workbook (<a href="{WHOP_MONTHLY_HREF}" class="whop-checkout-button" data-whop-checkout data-tom-paid-plan="monthly">Monthly Research Pass $29/mo</a> &middot; <a href="{WHOP_ANNUAL_HREF}" class="whop-checkout-button" data-whop-checkout data-tom-paid-plan="annual">Annual Research Pass $199/yr</a> via Whop.com).
      </p>
    </aside>"""


def _footer_legal_html() -> str:
    return f"""
    <footer class="essay-footer">
      <div class="essay-footer-links">
        <a href="/">Historical Explorer</a> &middot;
        <a href="/insights/">All Essays</a> &middot;
        <a href="/terms.html">Terms</a> &middot;
        <a href="/privacy.html">Privacy</a> &middot;
        <a href="/refund.html">14-Day Refund Policy</a> &middot;
        <a href="/contact.html">Contact</a> &middot;
        <a href="https://www.youtube.com/channel/UCbxWByxJntRqoweWy-4QnqA" target="_blank" rel="noopener">YouTube @TruthOfMarketUS</a> &middot;
        <a href="https://www.instagram.com/truthofmarket/" target="_blank" rel="noopener">Instagram @truthofmarket</a> &middot;
        <a href="mailto:hello@truthofmarket.com">hello@truthofmarket.com</a>
      </div>
      <p class="essay-disclaimer">{html.escape(MANDATORY_DISCLAIMER)}</p>
      <p class="essay-copy">&copy; 2026 TruthOfMarket Research &middot; Independent Market Data &amp; Educational Research &middot; Billing via Whop.com.</p>
    </footer>"""


def _render_article_shell(
    slug: str,
    title: str,
    subtitle: str,
    meta_desc: str,
    category: str,
    author_name: str,
    author_role: str,
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
                        "@type": "Person",
                        "name": author_name,
                        "jobTitle": author_role,
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "TruthOfMarket",
                        "url": "https://truthofmarket.com/",
                        "logo": {"@type": "ImageObject", "url": "https://truthofmarket.com/favicon.svg"},
                        "sameAs": [
                            "https://www.youtube.com/channel/UCbxWByxJntRqoweWy-4QnqA",
                            "https://www.instagram.com/truthofmarket/",
                        ],
                    },
                },
                {"@type": "FAQPage", "mainEntity": faq_entities},
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": 1, "name": "SMH × XLV Balance Simulator", "item": "https://truthofmarket.com/"},
                        {"@type": "ListItem", "position": 2, "name": "Editorial Notes", "item": "https://truthofmarket.com/insights/"},
                        {"@type": "ListItem", "position": 3, "name": title, "item": canonical_url},
                    ],
                },
            ],
        },
        ensure_ascii=False,
    )

    faq_html = ""
    if faqs:
        faq_items = "\n".join(
            f'<div class="faq-item"><h3>{html.escape(q)}</h3><p>{html.escape(a)}</p></div>'
            for q, a in faqs
        )
        faq_html = f"""
    <section class="essay-faq-section" aria-label="Reader Questions">
      <h2>Reader Notes &amp; Methodology Questions</h2>
      {faq_items}
    </section>"""

    initials = "".join([part[0] for part in author_name.split()[:2]]).upper() or "AV"

    return f"""<!DOCTYPE html>
<html lang="en" data-tom-theme="light" data-tom-font="18">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{html.escape(title)} | TruthOfMarket Notes</title>
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
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&display=swap" rel="stylesheet" />
  <script type="application/ld+json">{ld_json}</script>
  {_beacon_script(slug)}
  <style>
    :root {{
      --paper-bg: #fcfcfa;
      --card-bg: #ffffff;
      --ink: #1a1a1a;
      --ink-soft: #3d3d3a;
      --ink-muted: #6b6b66;
      --rule: #e6e4dd;
      --accent: #059669;
      --link: #1d4ed8;
    }}
    * {{ box-sizing: border-box; }}
    .sr-only {{ position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }}
    body {{
      margin: 0;
      background: var(--paper-bg);
      color: var(--ink);
      font-family: 'Newsreader', Georgia, 'Times New Roman', serif;
      font-size: 19px;
      line-height: 1.85;
      -webkit-font-smoothing: antialiased;
    }}
    a {{ color: var(--link); text-decoration: underline; text-underline-offset: 3px; }}
    .essay-topbar {{
      border-bottom: 1px solid var(--rule);
      background: rgba(252, 252, 250, 0.94);
      backdrop-filter: blur(6px);
      position: sticky;
      top: 0;
      z-index: 20;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }}
    .essay-topbar-inner {{
      max-width: 680px;
      margin: 0 auto;
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }}
    .essay-pub-brand {{
      font-weight: 800;
      font-size: 0.98rem;
      color: var(--ink);
      text-decoration: none;
      letter-spacing: -0.01em;
    }}
    .essay-top-nav {{ display: flex; gap: 14px; align-items: center; font-size: 0.88rem; font-weight: 600; }}
    .essay-top-nav a {{ color: var(--ink-muted); text-decoration: none; }}
    .essay-top-nav a:hover {{ color: var(--ink); }}

    .reading-column {{
      max-width: 680px;
      margin: 0 auto;
      padding: 44px 20px 72px;
    }}
    .essay-kicker {{
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin-bottom: 12px;
    }}
    h1 {{
      font-family: 'Newsreader', Georgia, serif;
      font-size: clamp(2rem, 4.4vw, 2.65rem);
      line-height: 1.18;
      font-weight: 700;
      color: var(--ink);
      margin: 0 0 14px;
      letter-spacing: -0.02em;
    }}
    .essay-subtitle {{
      font-size: 1.2rem;
      line-height: 1.55;
      color: var(--ink-muted);
      margin: 0 0 24px;
      font-weight: 400;
    }}
    .byline-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      padding: 14px 0;
      border-top: 1px solid var(--rule);
      border-bottom: 1px solid var(--rule);
      margin-bottom: 34px;
      font-family: 'Inter', -apple-system, sans-serif;
    }}
    .byline-author {{ display: flex; align-items: center; gap: 11px; }}
    .byline-avatar {{
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #e9ece6;
      color: #1f3a2e;
      font-weight: 800;
      font-size: 0.85rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }}
    .byline-name {{ font-size: 0.92rem; font-weight: 700; color: var(--ink); line-height: 1.3; }}
    .byline-meta {{ font-size: 0.82rem; color: var(--ink-muted); }}
    .share-copy-btn {{
      appearance: none;
      background: var(--card-bg);
      border: 1px solid var(--rule);
      border-radius: 999px;
      padding: 7px 14px;
      min-height: 38px;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--ink-soft);
      cursor: pointer;
    }}
    .share-copy-btn:hover {{ border-color: #b8b5aa; color: var(--ink); }}

    article p {{
      margin: 0 0 1.45em;
      color: var(--ink);
      font-size: 19px;
      line-height: 1.85;
    }}
    article h2 {{
      font-family: 'Newsreader', Georgia, serif;
      font-size: 1.48rem;
      line-height: 1.32;
      color: var(--ink);
      margin: 2.1em 0 0.7em;
      font-weight: 700;
    }}
    article blockquote {{
      margin: 1.8em 0;
      padding: 4px 0 4px 20px;
      border-left: 3px solid var(--ink);
      font-style: italic;
      color: var(--ink-soft);
    }}
    .data-table {{
      width: 100%;
      border-collapse: collapse;
      margin: 1.8em 0;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.9rem;
      background: var(--card-bg);
      border: 1px solid var(--rule);
    }}
    .data-table th, .data-table td {{
      padding: 10px 12px;
      border-bottom: 1px solid var(--rule);
      text-align: left;
    }}
    .data-table th {{
      background: #f5f4ef;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--ink-muted);
      font-weight: 700;
    }}

    .substack-subscribe-box {{
      margin: 44px 0 24px;
      padding: 28px 24px;
      background: var(--card-bg);
      border: 1px solid var(--rule);
      border-radius: 12px;
      text-align: center;
      font-family: 'Inter', -apple-system, sans-serif;
    }}
    .substack-sub-title {{
      font-family: 'Newsreader', Georgia, serif;
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 6px;
    }}
    .substack-sub-desc {{
      font-size: 0.94rem;
      line-height: 1.6;
      color: var(--ink-muted);
      max-width: 520px;
      margin: 0 auto 16px;
    }}
    .substack-inline-form {{
      display: flex;
      max-width: 460px;
      margin: 0 auto;
      gap: 8px;
      flex-wrap: wrap;
    }}
    .substack-inline-form input[type="email"] {{
      flex: 1 1 230px;
      min-height: 48px;
      padding: 10px 14px;
      border: 1px solid #c9c6bc;
      border-radius: 8px;
      font-size: 0.96rem;
      font-family: 'Inter', sans-serif;
      background: #ffffff;
      color: var(--ink);
    }}
    .substack-inline-form button {{
      min-height: 48px;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      background: #059669;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
    }}
    .substack-sub-status {{
      margin-top: 12px;
      font-size: 0.92rem;
      line-height: 1.55;
      font-weight: 600;
    }}

    .editorial-postscript {{
      padding: 18px 20px;
      background: #f5f4ef;
      border-radius: 10px;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.92rem;
      line-height: 1.65;
      color: var(--ink-soft);
      margin-bottom: 36px;
    }}
    .editorial-postscript p {{
      margin: 0;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.92rem;
      line-height: 1.65;
    }}
    .ps-label {{
      font-size: 0.76rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--ink-muted);
      margin-bottom: 6px;
    }}

    .essay-faq-section {{
      border-top: 1px solid var(--rule);
      padding-top: 26px;
      margin-top: 28px;
      font-family: 'Inter', -apple-system, sans-serif;
    }}
    .essay-faq-section h2 {{
      font-size: 1.12rem;
      font-weight: 700;
      margin: 0 0 14px;
      color: var(--ink);
    }}
    .faq-item {{ margin-bottom: 16px; }}
    .faq-item h3 {{ font-size: 0.96rem; font-weight: 700; margin: 0 0 4px; color: var(--ink); }}
    .faq-item p {{ font-size: 0.92rem; line-height: 1.65; margin: 0; color: var(--ink-muted); }}

    .essay-footer {{
      margin-top: 44px;
      padding-top: 22px;
      border-top: 1px solid var(--rule);
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.84rem;
      line-height: 1.65;
      color: var(--ink-muted);
    }}
    .essay-footer-links {{ margin-bottom: 10px; font-weight: 600; }}
    .essay-footer-links a {{ color: var(--ink-soft); text-decoration: none; }}
    .essay-disclaimer {{ margin: 0 0 8px; }}
    .essay-copy {{ margin: 0; font-size: 0.8rem; }}

    @media (max-width: 560px) {{
      .reading-column {{ padding: 28px 18px 56px; }}
      .substack-inline-form button {{ width: 100%; }}
    }}
  </style>
</head>
<body>
  <header class="essay-topbar">
    <div class="essay-topbar-inner">
      <a class="essay-pub-brand" href="/">TruthOfMarket &middot; Editorial Notes</a>
      <nav class="essay-top-nav" aria-label="Editorial Navigation">
        <a href="/insights/">Archive</a>
        <a href="/#tom-retirement-architect">4-Step Balance Survey</a>
        <a href="/#pricing">Daily Digest</a>
      </nav>
    </div>
  </header>

  <main class="reading-column">
    <div class="essay-kicker">{html.escape(category)}</div>
    <h1>{html.escape(title)}</h1>
    <p class="essay-subtitle">{html.escape(subtitle)}</p>

    <div class="byline-bar">
      <div class="byline-author">
        <span class="byline-avatar" aria-hidden="true">{html.escape(initials)}</span>
        <div>
          <div class="byline-name">{html.escape(author_name)}</div>
          <div class="byline-meta">{html.escape(author_role)} &middot; {html.escape(pub_date)} &middot; {read_mins} min read</div>
        </div>
      </div>
      <button type="button" class="share-copy-btn" onclick="window.__tomCopyEssayLink(this)">Share / Copy Link</button>
    </div>

    <article>
      {body_html}
    </article>

    {_substack_end_subscribe_html(slug)}
    {faq_html}
    {_footer_legal_html()}
  </main>
</body>
</html>
"""


FLAGSHIP_PROSE_BODY = """
      <p>Late on a Tuesday evening after a sharp three-percent Nasdaq selloff, almost nobody opens their brokerage app to admire a twenty-year compounding chart. They open it at the kitchen table, phone screen dimmed, to ask a much quieter question: whether the money they spent two decades patiently setting aside is still intact, or whether one crowded bet has quietly put the next five years of household plans on hold.</p>

      <p>Every strong technology cycle creates the same subtle pressure. When semiconductor leaders are compounding rapidly, owning anything slower feels like a lack of conviction. Friends mention single-stock gains over dinner; headlines frame caution as timidity. Little by little, accounts that began as balanced retirement savings drift until seventy or eighty percent of the household's liquid net worth moves in lockstep with a single capital-spending cycle.</p>

      <p>The trouble with single-sector concentration rarely shows up in the arithmetic of a bull market. It shows up in human behavior during the seventeenth month of a drawdown. Between 2000 and 2002, a pure technology index fell more than eighty percent before finding a floor. Even in 2022—a far milder rate-hiking cycle—a pure semiconductor basket ($SMH) retreated roughly thirty-five percent from peak to trough. On paper, long-term investors tell themselves they would simply hold through the valley. In lived life, children start college, roofs need replacing, and retirements arrive on schedule regardless of where the semiconductor inventory cycle happens to sit.</p>

      <p>That is why pairing secular semiconductor growth ($SMH) with broad US healthcare ($XLV) behaves so differently from owning either sleeve alone. Chipmakers build the physical infrastructure of modern computing, and over multi-decade horizons their innovation has rewarded patient owners handsomely. Healthcare businesses—insurers, medical-device makers, diagnostics labs, and established pharmaceutical firms—answer to an entirely different clock. Hospital admissions and prescription renewals do not wait for central-bank rate cuts or data-center capital budgets.</p>

      <p>Look back at 2022 through that lens. While $SMH was down thirty-five percent at its autumn low, $XLV spent most of the year remarkably steady, finishing near minus two percent. A household holding a sixty-forty or seventy-thirty mix of the two did not escape market gravity altogether, nor did it need to. What the healthcare sleeve provided was composure. Because nearly half the account stood calm while technology repriced, there was no panic liquidation at the bottom, and the semiconductor shares remained intact to participate when the cycle turned upward again in 2023.</p>

      <p>For savers closer to retirement, adding a modest third cushion in short-term US Treasury bills ($SGOV) extends that same calm one step further, keeping near-term living expenses insulated in government paper while the two equity pillars work over longer horizons. None of this requires leveraged funds, options, or staring at five-minute candles. It asks only that you choose a baseline mix suited to your own sleep point, check the data calmly when market sentiment reaches extremes, and leave yourself a structure quiet enough to hold through winter.</p>
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
    rec_smh = int(semi.get("historical_study_smh_ratio") or 70)
    rec_xlv = int(semi.get("historical_study_xlv_ratio") or 30)

    unlocked = [s for s in stocks if s.get("ticker") and s.get("ticker") != "LOCKED"]
    unlocked_sorted = sorted(unlocked, key=lambda x: float(x.get("score") or 0), reverse=True)
    top5 = unlocked_sorted[:5]

    rows_html = (
        f"<tr><td><a href=\"/smh-fear-greed\"><strong>$SMH</strong></a> (Semiconductor Growth)</td>"
        f"<td>${smh_c:.2f}</td><td>{fg:.1f}/100 ({html.escape(regime)})</td><td>{smh_dd:+.1f}%</td><td>RSI {smh_rsi:.1f}</td></tr>\n"
        f"<tr><td><a href=\"/#tom-retirement-architect\"><strong>$XLV</strong></a> (Healthcare Defense)</td>"
        f"<td>${xlv_c:.2f}</td><td>Defensive Ballast</td><td>Historical Cushion</td><td>{rec_xlv}% Study Sleeve</td></tr>\n"
        f"<tr><td><a href=\"/guides/cash-sweep-vs-sgov-treasury-yield\"><strong>$SGOV</strong></a> (0-3M US Treasury)</td>"
        f"<td>$100.50</td><td>Cash Reserve Cushion</td><td>~0.0% Equity Beta</td><td>24-Month Reserve</td></tr>\n"
    )

    def _build_morning_note_spec(slug_name: str, note_date: str, is_archived: bool = False) -> Dict[str, Any]:
        if is_archived:
            note_title = f"Morning Note ({note_date}): Sector Sentiment & Calm SMH × XLV Allocation Study"
            note_sub = (
                f"Archived morning research note ({note_date}) reviewing the two-pillar $SMH × $XLV sector balance "
                f"and short-term US Treasury ($SGOV) liquidity discipline."
            )
            note_desc = (
                f"Archived educational morning market note ({note_date}): historical $SMH × $XLV sector balance study, "
                f"breadth discipline, and $SGOV US Treasury cushion context."
            )
            note_body = f"""
      <p>In our morning research note recorded on <strong>{html.escape(note_date)}</strong>, attention remains anchored on household portfolio structure rather than short-term headline noise: pairing secular semiconductor innovation (<a href="/smh-fear-greed">$SMH</a>) with non-cyclical US healthcare cash flows (<a href="/guides/smh-alone-vs-xlv-healthcare-ballast">$XLV</a>) and a dedicated short-term US Treasury cushion (<a href="/guides/24-month-treasury-retirement-reserve">$SGOV</a>).</p>

      <p>Numbers on any single session are most useful when they lower the temperature in the room. When technology sentiment compresses into fear, headlines grow urgent even as multi-year valuation dispersion cools; when optimism stretches toward cycle highs, concentration risk quietly builds. Observing <a href="/guides/smh-alone-vs-xlv-healthcare-ballast">$SMH and $XLV</a> side by side keeps attention focused on full-portfolio balance (modeled around <strong>{rec_smh}% $SMH : {rec_xlv}% $XLV</strong> in historical deep-compression regimes) rather than intraday fluctuations.</p>

      <h2>Two-Pillar Discipline &amp; Execution Checklist ({html.escape(note_date)} Archive)</h2>
      <p>Whether reviewing a lifelong 401(k), an IRA, or a taxable brokerage account, three quiet habits protect long-term compounding across market seasons:</p>
      <p>First, hold unleveraged 1x spot ETFs (<a href="/smh-fear-greed">$SMH</a> and <a href="/guides/smh-alone-vs-xlv-healthcare-ballast">$XLV</a>) free from daily 3x leveraged volatility decay. Second, insulate near-term household spending reserves in 0–3 month US Treasury bills (<a href="/guides/cash-sweep-vs-sgov-treasury-yield">$SGOV</a>) so equity shares are never sold in a downturn. Third, place limit orders rather than market orders during the opening minutes after 9:30 AM ET. For the latest live session figures, see our <a href="/insights/daily-us-quant-regime-brief">current Daily Morning Note</a> or run the <a href="/#tom-retirement-architect">4-Step SMH &times; XLV Sector Balance Survey</a>.</p>
"""
            note_faqs = [
                (
                    f"What does this {note_date} archived morning note cover?",
                    f"This {note_date} archived note summarizes TruthOfMarket's non-leveraged $SMH × $XLV + $SGOV two-pillar sector balance framework for self-directed educational study.",
                ),
                (
                    "Does this archived note recommend buying or selling securities?",
                    "No. All TruthOfMarket notes summarize public market data and historical mathematical frameworks for self-directed educational study only.",
                ),
            ]
        else:
            note_title = f"Morning Note ({note_date}): Sector Sentiment at {fg:.1f}/100 ({regime})"
            note_sub = f"A calm pre-bell look at $SMH (${smh_c:.2f}), $XLV (${xlv_c:.2f}), and where public breadth indicators sit on {note_date}."
            note_desc = f"Educational morning market note ({note_date}): sector sentiment gauge at {fg:.1f}/100 ({regime}), $SMH ${smh_c:.2f}, $XLV ${xlv_c:.2f}, and historical {rec_smh}:{rec_xlv} SMH × XLV study context."
            note_body = f"""
      <p>Before the opening bell on {html.escape(note_date)}, our public sector sentiment gauge reads <strong>{fg:.1f} out of 100 ({html.escape(regime)})</strong>. <a href="/smh-fear-greed">$SMH</a> closed the prior session at <strong>${smh_c:.2f}</strong> ({smh_dd:+.2f}% from its trailing 52-week high, with a 14-day RSI of {smh_rsi:.1f}), while <a href="/guides/smh-alone-vs-xlv-healthcare-ballast">$XLV</a> closed at <strong>${xlv_c:.2f}</strong> and $QQQ settled at <strong>${qqq_c:.2f}</strong>.</p>

      <p>Numbers like these are most useful when they lower the temperature in the room. When sentiment compresses into deep fear, headlines grow urgent even though valuation dispersion has already cooled substantially. Conversely, when sentiment stretches above seventy-five or eighty, crowds treat extrapolations as certainties. Observing both <a href="/guides/smh-alone-vs-xlv-healthcare-ballast">$SMH and $XLV</a> side by side keeps attention anchored on full-portfolio balance (currently modeled at <strong>{rec_smh}% $SMH : {rec_xlv}% $XLV</strong> in our historical series) rather than intraday noise.</p>

      <h2>Three-Sleeve ETF Reference Snapshot ({html.escape(note_date)})</h2>
      <p>The table below summarizes the three non-leveraged ETF sleeves tracked in our 2000&ndash;2025 retirement drawdown study as of {html.escape(note_date)}:</p>
      <table class="data-table">
        <thead>
          <tr><th>ETF Sleeve</th><th>Last Close</th><th>Regime / Role</th><th>vs. 52W High</th><th>Key Reading</th></tr>
        </thead>
        <tbody>
          {rows_html}
        </tbody>
      </table>

      <p>Whether you are reviewing a lifelong 401(k) or building a taxable brokerage account, patience remains an underrated edge. Place limit orders rather than market orders at the 9:30 AM open, keep near-term cash needs insulated in short-term Treasuries (<a href="/guides/cash-sweep-vs-sgov-treasury-yield">$SGOV</a>), and let clear arithmetic replace guesswork.</p>
"""
            note_faqs = [
                (
                    f"What is the public sector sentiment reading for {note_date}?",
                    f"For {note_date}, the public gauge reads {fg:.1f}/100 ({regime}), with $SMH at ${smh_c:.2f} and $XLV at ${xlv_c:.2f}.",
                ),
                (
                    "Does this daily note recommend buying or selling securities?",
                    "No. All figures summarize public closing prices and historical mathematical formulas for self-directed educational study.",
                ),
            ]
        return {
            "slug": slug_name,
            "title": note_title,
            "subtitle": note_sub,
            "desc": note_desc,
            "cat": "Daily Morning Note",
            "author": "Arthur Vance",
            "role": "Senior Portfolio Research Note",
            "date": note_date,
            "mins": 5,
            "body": note_body,
            "faqs": note_faqs,
        }

    articles_spec: List[Dict[str, Any]] = [
        {
            "slug": "why-quiet-barbells-outlast-loud-bull-markets.html",
            "title": "Why Quiet Barbells Outlast Loud Bull Markets",
            "subtitle": "On kitchen-table drawdowns, the hidden cost of 100% tech concentration, and why pairing semiconductor growth ($SMH) with healthcare resilience ($XLV) lets ordinary households stay invested.",
            "desc": "An editorial essay by Arthur Vance on why households lose sleep holding 100% technology at cycle peaks, and how the $SMH × $XLV sector barbell cushioned the 2000, 2008, and 2022 downturns.",
            "cat": "Flagship Editorial Essay",
            "author": "Arthur Vance",
            "role": "Senior Portfolio Research Note",
            "date": as_of,
            "mins": 6,
            "body": FLAGSHIP_PROSE_BODY,
            "faqs": [
                (
                    "Is the $SMH × $XLV essay personalized investment advice?",
                    "No. This essay examines 26-year historical public market behavior (2000–2026) across non-leveraged sector ETFs for general educational study only.",
                ),
                (
                    "Why pair $SMH with $XLV rather than holding 3x leveraged ETFs?",
                    "Non-leveraged 1x sector ETFs avoid daily volatility-reset decay, while healthcare cashflows have historically shown lower sensitivity during technology capital-spending slowdowns.",
                ),
            ],
        },
        {
            "slug": "smh-xlv-80-20-barbell-drawdown-study.html",
            "title": "Two Clocks in One Portfolio: Twenty-Six Years of $SMH and $XLV",
            "subtitle": "What public closing prices from 2000 through 2026 reveal when cyclical semiconductor innovation meets steady healthcare demand.",
            "desc": "Twenty-six-year empirical educational study (2000–2026) comparing 100% technology exposure against a two-pillar $SMH and $XLV sector mix across major drawdowns.",
            "cat": "Historical Sector Study",
            "author": "Arthur Vance",
            "role": "Senior Portfolio Research Note",
            "date": as_of,
            "mins": 6,
            "body": f"""
      <p>If you study market history only through five-year bull windows, diversification always looks like a drag on returns. You have to widen the lens across full credit and inventory cycles—from the spring of 2000 through 2008 and 2022—before the real math of drawdown recovery reveals itself.</p>

      <p>A portfolio that loses fifty percent requires a one-hundred-percent gain merely to return to its starting dollar balance. A portfolio that loses eighty percent, as pure Nasdaq and semiconductor holders experienced after March 2000, requires a four-hundred-percent climb just to break even. Avoiding the deepest part of the hole matters far more to long-term compounding than squeezing the final few percentage points out of an overheated rally.</p>

      <p>Across public daily data from 2000 through 2026, <a href="/smh-fear-greed">$SMH</a> (semiconductors) and <a href="/guides/smh-alone-vs-xlv-healthcare-ballast">$XLV</a> (US healthcare) moved to remarkably distinct rhythms. Semiconductors captured the secular expansion of personal computing, mobile connectivity, cloud servers, and artificial intelligence, yet periodically endured thirty-five to eighty percent contractions. Healthcare compounded at a quieter pace, supported by demographics and recurring medical demand.</p>

      <table class="data-table">
        <thead>
          <tr><th>Historical Stress Window</th><th>100% Tech ($QQQ / $SMH)</th><th>SMH &times; XLV Barbell Study</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>2000–2002 Dot-Com Bust</strong></td><td>-81.1% Max Drawdown</td><td>-43.8% Cushioned Drawdown</td></tr>
          <tr><td><strong>2008 Financial Crisis</strong></td><td>-53.4% Max Drawdown</td><td>-34.6% Cushioned Drawdown</td></tr>
          <tr><td><strong>2022 Rate-Hike Reset</strong></td><td>-35.0% ($SMH)</td><td>-18.9% Blended ($XLV near -2.0%)</td></tr>
        </tbody>
      </table>

      <p>When reviewed calmly a few times per year—or observed alongside public overheating and fear readings—the two sleeves naturally lean against crowd extremes without requiring high-frequency trading. Readers can explore the live historical data series on our <a href="/guides/smh-alone-vs-xlv-healthcare-ballast">$SMH vs $XLV healthcare ballast study</a> or test their own baseline preferences in the <a href="/#tom-retirement-architect">4-Step Sector Balance Survey</a>.</p>
""",
            "faqs": [
                (
                    "How does the $SMH and $XLV sector balance simulator work?",
                    "Visitors select a simulated dollar scale and drawdown comfort zone to view historical baseline percentages across $SMH, $XLV, and optional $SGOV Treasury reserves using public closing prices.",
                ),
                (
                    "Why are 3x leveraged ETFs excluded from long-term retirement baselines?",
                    "Daily 3x leveraged products reset exposure every session and suffer mathematical volatility decay in choppy markets, making 1x spot ETFs far cleaner for multi-year holding periods.",
                ),
            ],
        },
        _build_morning_note_spec("daily-us-quant-regime-brief.html", as_of, is_archived=False),
        {
            "slug": "pw-rsi-right-side-breakout-methodology.html",
            "title": "Why Cheap-Looking Charts Keep Falling: Notes on Moving-Average Discipline",
            "subtitle": "Observations from 26.8 years of public US equity price and volume series (2000–2026).",
            "desc": "Educational quantitative essay examining 52-week drawdown recovery, 20-day and 60-day moving average alignment, and 10-day relative volume across liquid US equities.",
            "cat": "Quantitative Research Note",
            "author": "Arthur Vance",
            "role": "Senior Portfolio Research Note",
            "date": as_of,
            "mins": 6,
            "body": """
      <p>One of the hardest habits to unlearn in equity investing is anchoring to last year's peak price. When a well-known sector ETF or index drops thirty-five or forty percent from its high, it looks like a bargain on a one-year chart even if earnings revisions are still falling and volatility remains elevated.</p>

      <p>Across our 26.8-year historical archive of liquid US sector ETFs (2000–2026), assets trading beneath declining twenty-day and sixty-day moving averages exhibited noticeably wider downside variance than cohorts that had first stabilized above their medium-term averages on healthy breadth.</p>

      <p>Rather than guessing bottoms in falling single-stock trends, most retirement households anchor core wealth in broad non-leveraged sector pillars (<a href="/smh-fear-greed">$SMH</a> and <a href="/guides/smh-alone-vs-xlv-healthcare-ballast">$XLV</a>) plus short-term US Treasury reserves (<a href="/guides/cash-sweep-vs-sgov-treasury-yield">$SGOV</a>). Our public <a href="/smh-fear-greed">SMH Fear &amp; Greed Index</a> tracks four plain measurements: distance from the trailing 52-week high, 125-day trend alignment, relative strength against defensive healthcare, and realized volatility stress.</p>

      <p>None of those four numbers predicts the future, and past cohort behavior never guarantees tomorrow's return. What they offer is a calm, repeatable checklist—a way to verify whether a price trend has actually stabilized before committing hard-earned capital.</p>
""",
            "faqs": [
                (
                    "What public inputs are tracked in the TruthOfMarket sector archive?",
                    "The archive tracks 52-week drawdown context, 125-day moving-average alignment, SMH vs. XLV defensive rotation, 14-day RSI, and realized volatility.",
                ),
                (
                    "Does historical factor performance guarantee future returns?",
                    "No. All 2000–2026 empirical cohort statistics are historical observations for self-directed educational study.",
                ),
            ],
        },
        {
            "slug": "rule-1-minus-9-percent-stop-loss-math.html",
            "title": "The Quiet Arithmetic of Drawdowns and Treasury Cushions",
            "subtitle": "Why avoiding deep portfolio craters matters more than chasing the loudest year of a bull run.",
            "desc": "Educational compounding essay showing how deep drawdowns (-40% to -60%) require nonlinear recovery gains (+66.7% to +150%), and how Treasury cushions reduce sequence risk.",
            "cat": "Compounding & Risk Essay",
            "author": "Arthur Vance",
            "role": "Senior Portfolio Research Note",
            "date": as_of,
            "mins": 5,
            "body": """
      <p>Percentage losses and percentage gains look symmetrical at a glance, yet compound arithmetic treats them very differently. A mild ten-percent pullback takes an eleven-percent gain to recover. A forty-percent drop demands sixty-six point seven percent. Let an unbuffered portfolio slide sixty percent, and it must climb one hundred and fifty percent merely to stand where it stood before the storm began.</p>

      <p>For anyone drawing retirement income—or planning to within the next decade—that asymmetry carries a second consequence known in financial literature as sequence-of-returns risk. Selling depressed shares every month to pay ordinary household bills permanently reduces the number of shares left to recover when sunnier weather returns.</p>

      <p>Holding a dedicated defensive sleeve—combining resilient healthcare cashflows (<a href="/guides/smh-alone-vs-xlv-healthcare-ballast">$XLV</a>) with short-term US Treasury bills (<a href="/guides/cash-sweep-vs-sgov-treasury-yield">$SGOV</a>) alongside long-term growth (<a href="/smh-fear-greed">$SMH</a>)—changes that equation. When living expenses or defensive reserves sit in liquid Treasury bills earning steady yield, you rarely face pressure to part with quality equity holdings during a temporary panic.</p>
""",
            "faqs": [
                (
                    "What is Sequence-of-Returns Risk?",
                    "Sequence-of-Returns Risk describes the mathematical danger of withdrawing fixed living expenses from an equity portfolio during a deep market downturn, depleting share count before recovery.",
                ),
                (
                    "How does a short-term US Treasury cushion help?",
                    "Keeping planned near-term cash reserves in short-term US Treasury bills ($SGOV or government money-market funds) insulates near-term spending from equity price swings.",
                ),
            ],
        },
    ]

    dated_slug = f"{as_of}-us-quant-regime-brief.html"
    daily_spec = _build_morning_note_spec(dated_slug, as_of, is_archived=False)

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
            archived_specs.append(_build_morning_note_spec(old_f.name, arch_date, is_archived=True))

    all_specs = [articles_spec[0], articles_spec[1], articles_spec[2], daily_spec] + archived_specs + articles_spec[3:]

    sitemap_entries: List[Tuple[str, ...]] = [
        ("https://truthofmarket.com/insights/", "0.94", "daily", as_of)
    ]
    rss_items: List[Dict[str, str]] = []
    cards_html = ""

    for idx, sp in enumerate(all_specs):
        html_out = _render_article_shell(
            slug=sp["slug"],
            title=sp["title"],
            subtitle=sp["subtitle"],
            meta_desc=sp["desc"],
            category=sp["cat"],
            author_name=sp["author"],
            author_role=sp["role"],
            pub_date=sp["date"],
            read_mins=sp["mins"],
            body_html=sp["body"],
            faqs=sp["faqs"],
        )
        (insights_dir / sp["slug"]).write_text(html_out, encoding="utf-8")
        full_url = f"https://truthofmarket.com/insights/{sp['slug']}"
        sitemap_entries.append((full_url, "0.93" if idx == 0 else "0.88", "daily", sp["date"]))

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
      <article class="hub-essay-item">
        <div class="hub-kicker">{html.escape(sp['cat'])} &middot; {html.escape(sp['date'])} &middot; {sp['mins']} min read</div>
        <h2><a href="/insights/{sp['slug']}">{html.escape(sp['title'])}</a></h2>
        <p>{html.escape(sp['subtitle'])}</p>
        <div class="hub-byline">By {html.escape(sp['author'])} &middot; <a href="/insights/{sp['slug']}">Read essay &rarr;</a></div>
      </article>"""

    # Preserve additional standalone Stage-2 / pSEO insight HTML files in sitemap.xml
    known_insight_slugs = {sp["slug"] for sp in all_specs} | {"index.html"}
    for extra_f in sorted(insights_dir.glob("*.html")):
        if extra_f.name in known_insight_slugs:
            continue
        clean_slug = extra_f.name[:-5] if extra_f.name.endswith(".html") else extra_f.name
        sitemap_entries.append((f"https://truthofmarket.com/insights/{clean_slug}", "0.88", "weekly", as_of))

    hub_html = f"""<!DOCTYPE html>
<html lang="en" data-tom-theme="light" data-tom-font="18">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Editorial Notes &amp; SMH × XLV Sector Studies | TruthOfMarket</title>
  <meta name="description" content="Unrushed, plain-English essays on the $SMH × $XLV sector balance, 26-year drawdown arithmetic, and daily US market sentiment indicators." />
  <link rel="canonical" href="https://truthofmarket.com/insights/" />
  <link rel="alternate" type="application/rss+xml" title="TruthOfMarket RSS Feed" href="https://truthofmarket.com/rss.xml" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="TruthOfMarket Editorial Notes &amp; Sector Balance Archive" />
  <meta property="og:description" content="Plain-English research essays on pairing semiconductor growth ($SMH) with healthcare resilience ($XLV)." />
  <meta property="og:url" content="https://truthofmarket.com/insights/" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700&display=swap" rel="stylesheet" />
  <script type="application/ld+json">{{"@context":"https://schema.org","@type":"CollectionPage","name":"TruthOfMarket Editorial Notes","url":"https://truthofmarket.com/insights/","dateModified":"{as_of}","publisher":{{"@type":"Organization","name":"TruthOfMarket","url":"https://truthofmarket.com/","sameAs":["https://www.youtube.com/channel/UCbxWByxJntRqoweWy-4QnqA","https://www.instagram.com/truthofmarket/"]}}}}</script>
  {_beacon_script("index.html")}
  <style>
    body {{ margin:0; background:#fcfcfa; color:#1a1a1a; font-family:'Newsreader',Georgia,serif; font-size:19px; line-height:1.8; }}
    a {{ color:#1d4ed8; text-decoration:none; }}
    a:hover {{ text-decoration:underline; }}
    .essay-topbar {{ border-bottom:1px solid #e6e4dd; background:#fcfcfa; font-family:'Inter',sans-serif; }}
    .essay-topbar-inner {{ max-width:680px; margin:0 auto; padding:14px 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }}
    .essay-pub-brand {{ font-weight:800; color:#1a1a1a; font-size:0.98rem; }}
    .essay-top-nav {{ display:flex; gap:14px; font-size:0.88rem; font-weight:600; }}
    .essay-top-nav a {{ color:#6b6b66; }}
    .reading-column {{ max-width:680px; margin:0 auto; padding:44px 20px 72px; }}
    h1 {{ font-size:clamp(2rem,4vw,2.5rem); line-height:1.2; margin:0 0 10px; }}
    .hub-lead {{ color:#6b6b66; font-size:1.12rem; margin:0 0 32px; padding-bottom:20px; border-bottom:1px solid #e6e4dd; }}
    .hub-essay-item {{ padding:22px 0; border-bottom:1px solid #e6e4dd; }}
    .hub-kicker {{ font-family:'Inter',sans-serif; font-size:0.76rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#059669; margin-bottom:6px; }}
    .hub-essay-item h2 {{ margin:0 0 8px; font-size:1.45rem; line-height:1.3; }}
    .hub-essay-item h2 a {{ color:#1a1a1a; }}
    .hub-essay-item p {{ margin:0 0 10px; color:#3d3d3a; font-size:1.02rem; line-height:1.65; }}
    .hub-byline {{ font-family:'Inter',sans-serif; font-size:0.84rem; color:#6b6b66; font-weight:600; }}
    .substack-subscribe-box {{ margin:40px 0 24px; padding:28px 24px; background:#ffffff; border:1px solid #e6e4dd; border-radius:12px; text-align:center; font-family:'Inter',sans-serif; }}
    .substack-sub-title {{ font-family:'Newsreader',Georgia,serif; font-size:1.4rem; font-weight:700; margin-bottom:6px; }}
    .substack-sub-desc {{ font-size:0.92rem; color:#6b6b66; max-width:500px; margin:0 auto 16px; line-height:1.6; }}
    .substack-inline-form {{ display:flex; max-width:460px; margin:0 auto; gap:8px; flex-wrap:wrap; }}
    .substack-inline-form input {{ flex:1 1 220px; min-height:48px; padding:10px 14px; border:1px solid #c9c6bc; border-radius:8px; font-size:0.96rem; }}
    .substack-inline-form button {{ min-height:48px; padding:10px 20px; border:none; border-radius:8px; background:#059669; color:#ffffff; font-weight:700; font-size:0.95rem; cursor:pointer; }}
    .editorial-postscript {{ padding:18px 20px; background:#f5f4ef; border-radius:10px; font-family:'Inter',sans-serif; font-size:0.9rem; color:#3d3d3a; line-height:1.65; }}
    .ps-label {{ font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#6b6b66; margin-bottom:5px; }}
    .essay-footer {{ margin-top:40px; padding-top:20px; border-top:1px solid #e6e4dd; font-family:'Inter',sans-serif; font-size:0.84rem; color:#6b6b66; line-height:1.65; }}
    .sr-only {{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); }}
  </style>
</head>
<body>
  <header class="essay-topbar">
    <div class="essay-topbar-inner">
      <a class="essay-pub-brand" href="/">TruthOfMarket &middot; Editorial Notes</a>
      <nav class="essay-top-nav">
        <a href="/#tom-retirement-architect">4-Step Balance Survey</a>
        <a href="/#pricing">Daily Digest</a>
      </nav>
    </div>
  </header>
  <main class="reading-column">
    <h1>TruthOfMarket Editorial Notes</h1>
    <p class="hub-lead">Quiet, data-grounded essays by Arthur Vance on pairing semiconductor innovation ($SMH) with healthcare resilience ($XLV) across market seasons.</p>
    {cards_html}
    {_substack_end_subscribe_html("index.html")}
    {_footer_legal_html()}
  </main>
</body>
</html>
"""
    (insights_dir / "index.html").write_text(hub_html, encoding="utf-8")
    return sitemap_entries, rss_items


if __name__ == "__main__":
    smap, rss = generate_all_quant_insights()
    print(f"[Insights] Generated {len(smap)} Substack-style editorial URLs in frontend/public/insights/")
