import { formatCheckoutUrl } from "../services/api.js";

const PRICING_COPY = {
  en: {
    heading: "VIP Retirement Cashflow & Budget Calculator Software — Built for US Retirees",
    subheading:
      "Self-directed educational calculators, tax-bucket reference guides, and large-print action sheets to protect your 401(k), IRA & monthly income. Backed by our 14-Day No-Questions-Asked Refund Policy.",
    t1Badge: "MONTHLY VIP",
    t1Title: "Monthly VIP Retirement Income & Budget Calculator Suite",
    t1Period: "/ month",
    t1Bundle:
      "Includes Lifetime-Updated 401(k)/IRA Drawdown Defense PDF Guide + 3-Bucket Retirement Budget Calculator",
    t1Items: [
      "<b>Custom Nest-Egg Dollar ($) Budget Worksheet:</b> Enter your exact portfolio size (e.g., $500,000) to calculate exact dollar amounts across $SGOV, $SCHD, $JEPI, and $VOO whenever the 3-Color Weather changes.",
      "<b>12-Month Dividend Paycheck Calendar &amp; Tax-Bucket Placement Reference:</b> Educational tax-location guide across Traditional IRA, Roth IRA, and Taxable accounts ($JEPI ordinary income vs. $SCHD qualified dividends vs. $SGOV state-tax-exempt T-Bills) to help protect after-tax monthly income.",
      "<b>Large-Print 1-Page Weather Change Action Sheet (2–4x/Year):</b> Printable step-by-step Fidelity / Schwab / Vanguard checklist — Includes Lifetime-Updated 401(k)/IRA Drawdown Defense PDF Guide + 3-Bucket Retirement Budget Calculator.",
    ],
    t1Btn: "Start Monthly VIP — $29/mo",
    t1PayNote:
      "💳 Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay) · 1-Click Cancel · 14-Day Refund Policy",
    t2Badge: "ANNUAL VIP",
    t2Title: "Annual VIP Retirement Income & Budget Calculator Pass",
    t2Period: "/ year",
    t2Bundle:
      "Includes Lifetime-Updated 401(k)/IRA Drawdown Defense PDF Guide + 3-Bucket Retirement Budget Calculator",
    t2Items: [
      "<b>Custom Nest-Egg Dollar ($) Budget Worksheet (Full 12-Month Pass):</b> Enter your exact portfolio size (e.g., $500,000) to calculate exact dollar amounts across $SGOV, $SCHD, $JEPI, and $VOO whenever the 3-Color Weather changes.",
      "<b>12-Month Dividend Paycheck Calendar &amp; Tax-Bucket Placement Reference:</b> Educational tax-location guide across Traditional IRA, Roth IRA, and Taxable accounts ($JEPI ordinary income vs. $SCHD qualified dividends vs. $SGOV state-tax-exempt T-Bills) to help protect after-tax monthly income.",
      "<b>Large-Print 1-Page Weather Change Action Sheet (2–4x/Year):</b> Save 43% ($149/yr saved vs. monthly) — Includes Lifetime-Updated 401(k)/IRA Drawdown Defense PDF Guide + 3-Bucket Retirement Budget Calculator.",
    ],
    t2Btn: "Start Annual VIP — $199/yr",
    t2PayNote:
      "💳 Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay) · Billed Annually · 14-Day Refund Policy",
    autoUnlockNote:
      "✨ Instant Software Activation: Your Custom Dollar ($) Budget Worksheet, Tax-Bucket Reference, and Printable PDF Action Sheets unlock on screen automatically after checkout.",
    restoreSummary: "🔑 Switching computers or already subscribed? Restore your VIP License Key here",
    restoreBtn: "Open License Key Restore Box",
  },
};
PRICING_COPY.jp = PRICING_COPY.en;
PRICING_COPY.kr = PRICING_COPY.en;

export function renderPricing(state) {
  const cfg = state.config || {};
  const c = PRICING_COPY[state.lang] || PRICING_COPY.en;
  const polarMonthly = formatCheckoutUrl(
    cfg.polar_tom_monthly_url || cfg.ls_site1_monthly_url,
    "#tom-vip-monthly"
  );
  const polarAnnual = formatCheckoutUrl(
    cfg.polar_tom_annual_url || cfg.ls_site1_ltd_url,
    "#tom-vip-annual"
  );

  const checkoutFallbackHtml = `
    <div class="pricing-support-note">
      Questions, software licenses, or 14-day refunds? Email <a href="mailto:beable9489@gmail.com?subject=TruthOfMarket%20Support%20%26%20VIP%20Software" class="pricing-support-link">beable9489@gmail.com</a>.
    </div>
  `;

  const checkSvg = `
    <span class="price-check" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
  `;

  return `
    <section id="pricing" class="tom-pricing-section" aria-label="VIP Retirement Software Benefits and Pricing">
      <span id="pricingSection" style="display:block; height:0; overflow:hidden;"></span>
      <div class="pricing-head-wrap">
        <div class="pricing-kicker-pill">
          SELF-DIRECTED EDUCATIONAL CALCULATOR SOFTWARE &bull; ZERO PERSONALIZED ADVICE
        </div>
        <h2 class="pricing-main-heading">${c.heading}</h2>
        <p class="pricing-main-sub">${c.subheading}</p>
      </div>

      <!-- 3 TANGIBLE RETIREE SOFTWARE TOOLS OVERVIEW -->
      <div class="vip-efficacy-preview-grid" aria-label="3 Core VIP Retiree Software Tools">
        <div class="vip-efficacy-card">
          <span class="vip-eff-step">TOOL 1 &bull; EXACT DOLLAR ($) MATH</span>
          <strong>Custom Nest-Egg Dollar ($) Budget Worksheet</strong>
          <p>Type any exact portfolio balance (such as <b>$500,000</b> or <b>$725,000</b>) to see exact target dollar amounts across <b>$SGOV</b>, <b>$SCHD</b>, <b>$JEPI</b>, and <b>$VOO</b> whenever our 3-Color Market Weather shifts.</p>
        </div>
        <div class="vip-efficacy-card">
          <span class="vip-eff-step">TOOL 2 &bull; AFTER-TAX INCOME</span>
          <strong>12-Month Dividend Paycheck Calendar &amp; Tax-Bucket Reference</strong>
          <p>Educational account-location reference across <b>Traditional IRA</b>, <b>Roth IRA</b>, and <b>Taxable</b> brokerage accounts (<b>$JEPI</b> ordinary distributions vs. <b>$SCHD</b> qualified dividends vs. <b>$SGOV</b> state-tax-exempt T-Bills).</p>
        </div>
        <div class="vip-efficacy-card">
          <span class="vip-eff-step">TOOL 3 &bull; CALM PRINTABLE SHEET</span>
          <strong>Large-Print 1-Page Weather Change Action Sheet (2–4x/Yr)</strong>
          <p>Clean, senior-readable 1-page printable summary sheet plus our <b>Lifetime-Updated 401(k)/IRA Drawdown Defense PDF Guide + 3-Bucket Retirement Budget Calculator</b>.</p>
        </div>
      </div>

      <div class="pricing-grid">
        <!-- Tier 1: Monthly VIP ($29/mo) -->
        <div class="price-card featured">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span class="badge badge-ignition">${c.t1Badge}</span>
              <span class="badge price-badge-popular">FLEXIBLE MONTHLY</span>
            </div>
            <h3 class="price-card-title">
              ${c.t1Title}
            </h3>
            <div class="price-num">$29 <span class="price-period">${c.t1Period}</span></div>
            <div class="price-subtext">Billed monthly &middot; Cancel anytime with 1 click &middot; 14-Day Refund Policy</div>
            <div class="price-bundle-box is-monthly">
              📘 ${c.t1Bundle}
            </div>
            <ul class="price-list">
              ${c.t1Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <a class="btn btn-primary polar-checkout-button price-cta-btn" id="cardMonthlyBtn" data-polar-checkout data-polar-plan="monthly_29" data-tom-paid-plan="monthly" href="${polarMonthly}">
              ${c.t1Btn}
            </a>
            <div class="price-pay-note">
              ${c.t1PayNote}
            </div>
            ${checkoutFallbackHtml}
          </div>
        </div>

        <!-- Tier 2: Annual VIP ($199/yr) -->
        <div class="price-card best-value">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span class="badge badge-watch">${c.t2Badge}</span>
              <span class="badge price-badge-lifetime">BEST VALUE &middot; SAVE 43%</span>
            </div>
            <h3 class="price-card-title">
              ${c.t2Title}
            </h3>
            <div class="price-num">$199 <span class="price-period">${c.t2Period}</span></div>
            <div class="price-subtext">Annual recurring pass ($199/yr) &middot; Cancel anytime &middot; 14-Day Refund Policy</div>
            <div class="price-savings-pill">⚡ Save $149/Yr vs. $29/mo Monthly Billing ($199/yr vs. $348/yr)</div>
            <div class="price-bundle-box is-annual">
              📘 ${c.t2Bundle}
            </div>
            <ul class="price-list">
              ${c.t2Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <a class="btn btn-emerald polar-checkout-button price-cta-btn" id="cardLtdBtn" data-polar-checkout data-polar-plan="annual_199" data-tom-paid-plan="annual" href="${polarAnnual}">
              ${c.t2Btn}
            </a>
            <div class="price-pay-note is-emerald">
              ${c.t2PayNote}
            </div>
            ${checkoutFallbackHtml}
          </div>
        </div>
      </div>

      <!-- MANDATORY PERMANENT EDUCATIONAL SOFTWARE DISCLAIMER -->
      <div id="tomPricingDisclaimerBox" class="tom-pricing-disclaimer" role="note">
        Disclaimer: TruthOfMarket provides self-directed educational data visualization and mathematical portfolio calculators only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice.
      </div>

      <!-- Instant Auto-Unlock Note & Collapsible Device License Restore -->
      <div class="pricing-restore-wrap">
        <div class="pricing-autounlock-note">
          ${c.autoUnlockNote}
        </div>
        <details class="pricing-restore-details">
          <summary class="pricing-restore-summary">
            ${c.restoreSummary} ▾
          </summary>
          <div class="pricing-restore-body">
            <span>Already have a Polar.sh VIP receipt key on another computer or tablet? Restore your VIP session in 1 click:</span>
            <button type="button" class="btn btn-sm" onclick="var b=document.getElementById('btnOpenLicense');if(b){b.click();}else{var m=document.getElementById('licenseModal');if(m)m.style.display='flex';}">
              ${c.restoreBtn} &rarr;
            </button>
          </div>
        </details>
      </div>

      <!-- Trust & Security Micro-Ribbon -->
      <div class="pricing-trust-ribbon">
        <div class="trust-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span><b>Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay)</b></span>
        </div>
        <div class="trust-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>14-Day No-Questions-Asked Refund Policy</span>
        </div>
        <div class="trust-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Self-Directed Educational Calculator Software</span>
        </div>
      </div>
    </section>
  `;
}
