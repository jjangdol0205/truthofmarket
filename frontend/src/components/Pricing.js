import { formatCheckoutUrl } from "../services/api.js";

function getTomPricingCopyByMode() {
  const isLiveSharp =
    typeof window !== "undefined" &&
    window.PAYMENT_CONFIG &&
    window.PAYMENT_CONFIG.STORE_LIVE_READY === true;
  if (typeof window !== "undefined") {
    window.TOM_COPY_MODE = isLiveSharp ? "LIVE_SHARP" : "UNDERWRITING_SAFE";
  }

  if (isLiveSharp) {
    return {
      kicker: "STAGE 3 OF 3 · DAILY SMH × XLV REGIME & RATIO TRACKING VIP",
      heading: "Track Daily SMH × XLV Regime Shifts Automatically Every Morning",
      subheading:
        "Receive daily overheating & fear regime tracking emails before the US bell, exact account-size dollar ($) allocation worksheets, and the lifetime-updated 14-Page SMH × XLV Master PDF Guide. Backed by our 14-Day Refund Policy.",
      t1Badge: "MONTHLY VIP",
      t1Title: "Monthly SMH × XLV Daily Tracking & Worksheet Suite",
      t1Period: "/ month",
      t1Bundle:
        "Includes Daily Automated SMH × XLV Tracking Digest + Lifetime-Updated 14-Page Master PDF Guide",
      t1Items: [
        "<b>Daily Automated SMH &times; XLV Regime &amp; Ratio Tracking Email Digest:</b> Delivered every morning before the US bell — tracks market overheating / fear indicators (0–100) and shows how the historical <b>$SMH : $XLV</b> ratio shifts across regimes.",
        "<b>Account-Size Dollar ($) Allocation Worksheet:</b> Enter your exact account balance (e.g., <b>$150,000</b>, <b>$300,000</b>, or <b>$500,000</b>) to compute exact dollar amounts across <b>$SMH</b>, <b>$XLV</b>, and optional <b>$SGOV</b> T-Bill cushion.",
        "<b>Lifetime-Updated 14-Page SMH &times; XLV Master PDF Guide:</b> Complete 26-year (2000–2026) crash study, IRA/Taxable bucket reference, and printable self-directed execution checklist.",
      ],
      t1Btn: "Start Monthly VIP — $29/mo →",
      t1PayNote:
        "💳 Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay) · 1-Click Cancel · 14-Day Refund Policy",
      t2Badge: "ANNUAL VIP",
      t2Title: "Annual SMH × XLV Daily Tracking & Master Pass",
      t2Period: "/ year",
      t2Bundle:
        "Save 43% ($149/yr saved) · Full 12-Month Daily Tracking Digest + 14-Page SMH × XLV Master PDF Guide",
      t2Items: [
        "<b>Full 12-Month Daily Automated SMH &times; XLV Tracking Digest:</b> Uninterrupted morning regime &amp; ratio-shift email tracking across every market season.",
        "<b>Account-Size Dollar ($) Allocation Worksheet + 26-Year CSV Dataset:</b> Full historical 2000–2026 <b>$SMH / $XLV / $QQQ</b> daily series and multi-account dollar worksheets.",
        "<b>Lifetime-Updated 14-Page SMH &times; XLV Master PDF Guide:</b> Save 43% vs. monthly billing — backed by our unconditional 14-Day Refund Policy.",
      ],
      t2Btn: "Start Annual VIP — $199/yr (Save 43%) →",
      t2PayNote:
        "💳 Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay) · Billed Annually · 14-Day Refund Policy",
      autoUnlockNote:
        "✨ Instant Software Activation: Your SMH × XLV Dollar ($) Allocation Worksheet, 14-Page Master PDF Guide, and Daily Tracking Digest activate immediately after checkout.",
      restoreSummary: "🔑 Switching computers or already subscribed? Restore your VIP License Key here",
      restoreBtn: "Open License Key Restore Box",
    };
  }

  return {
    kicker: "STAGE 3 OF 3 · SELF-DIRECTED EDUCATIONAL SOFTWARE & DAILY INDICATOR DATA DIGEST",
    heading: "Historical SMH × XLV Sector Balance Simulator & Daily Automated Market Indicator Data Digest",
    subheading:
      "Upgrade for automated morning semiconductor & healthcare indicator data digests, custom account-size dollar ($) allocation worksheets, and our lifetime-updated 14-Page SMH × XLV Master PDF Guide. Backed by our 14-Day No-Questions-Asked Refund Policy.",
    t1Badge: "MONTHLY VIP",
    t1Title: "Monthly VIP Sector Balance Worksheet & Daily Indicator Digest",
    t1Period: "/ month",
    t1Bundle:
      "Includes Daily Automated SMH × XLV Indicator Data Digest + Lifetime-Updated 14-Page SMH × XLV Master PDF Guide",
    t1Items: [
      "<b>Daily Automated SMH &times; XLV Regime &amp; Ratio Tracking Email Digest:</b> Morning educational data email tracking public overheating / fear indicators (0–100) and showing how the historical <b>$SMH : $XLV</b> sector model behaves across market regimes.",
      "<b>Account-Size Dollar ($) Allocation Worksheet:</b> Enter any simulated portfolio size (e.g., <b>$150,000</b>, <b>$300,000</b>, or <b>$500,000</b>) to calculate exact mathematical dollar weights across <b>$SMH</b>, <b>$XLV</b>, and <b>$SGOV</b> Treasury reserves.",
      "<b>Lifetime-Updated 14-Page SMH &times; XLV Master PDF Guide:</b> 26-year (2000–2026) Dot-Com / 2008 / 2022 empirical drawdown study, Traditional/Roth IRA educational tax-location reference, and printable 1-page worksheet.",
    ],
    t1Btn: "Start Monthly VIP — $29/mo",
    t1PayNote:
      "💳 Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay) · 1-Click Cancel · 14-Day Refund Policy",
    t2Badge: "ANNUAL VIP",
    t2Title: "Annual VIP Sector Balance Worksheet & Daily Indicator Pass",
    t2Period: "/ year",
    t2Bundle:
      "Includes 12-Month Automated SMH × XLV Indicator Digest + Lifetime-Updated 14-Page SMH × XLV Master PDF Guide",
    t2Items: [
      "<b>12-Month Automated SMH &times; XLV Regime &amp; Ratio Tracking Email Digest:</b> Full-year daily morning public market indicator summaries and historical sector ratio study tables.",
      "<b>Account-Size Dollar ($) Allocation Worksheet + 26-Year CSV Archive:</b> Exact dollar worksheets plus downloadable 2000–2026 public market historical series.",
      "<b>Lifetime-Updated 14-Page SMH &times; XLV Master PDF Guide:</b> Save 43% ($149/yr saved vs. monthly) — self-directed educational calculator software backed by our 14-Day Refund Policy.",
    ],
    t2Btn: "Start Annual VIP — $199/yr",
    t2PayNote:
      "💳 Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay) · Billed Annually · 14-Day Refund Policy",
    autoUnlockNote:
      "✨ Instant Software Activation: Your Custom SMH × XLV Dollar ($) Allocation Worksheet, 14-Page Master PDF Guide, and Daily Indicator Digest unlock automatically after checkout.",
    restoreSummary: "🔑 Switching computers or already subscribed? Restore your VIP License Key here",
    restoreBtn: "Open License Key Restore Box",
  };
}

export function renderPricing(state) {
  const cfg = state.config || {};
  const c = getTomPricingCopyByMode();
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
    <section id="pricing" class="tom-pricing-section" aria-label="Stage 3: VIP SMH x XLV Daily Tracking Digest and Software Pricing">
      <span id="pricingSection" style="display:block; height:0; overflow:hidden;"></span>
      <div class="pricing-head-wrap">
        <div class="pricing-kicker-pill">
          ${c.kicker}
        </div>
        <h2 class="pricing-main-heading">${c.heading}</h2>
        <p class="pricing-main-sub">${c.subheading}</p>
      </div>

      <div class="vip-efficacy-preview-grid" aria-label="3 Core SMH x XLV VIP Deliverables">
        <div class="vip-efficacy-card">
          <span class="vip-eff-step">BENEFIT 1 &bull; DAILY MORNING EMAIL</span>
          <strong>Daily Automated SMH &times; XLV Regime &amp; Ratio Tracking Digest</strong>
          <p>Tracks public semiconductor overheating / fear indicators every morning before the US bell and shows how the historical <b>$SMH : $XLV</b> baseline shifts across regimes.</p>
        </div>
        <div class="vip-efficacy-card">
          <span class="vip-eff-step">BENEFIT 2 &bull; EXACT DOLLAR ($) SHEET</span>
          <strong>Account-Size Dollar ($) Allocation Worksheet</strong>
          <p>Type any portfolio size (such as <b>$150,000</b>, <b>$300,000</b>, or <b>$500,000</b>) to compute exact dollar amounts across <b>$SMH</b>, <b>$XLV</b>, and optional <b>$SGOV</b> T-Bill cushion.</p>
        </div>
        <div class="vip-efficacy-card">
          <span class="vip-eff-step">BENEFIT 3 &bull; MASTER PDF PLAYBOOK</span>
          <strong>Lifetime-Updated 14-Page SMH &times; XLV Master PDF Guide</strong>
          <p>Complete 26-year (2000–2026) Dot-Com, 2008 &amp; 2022 empirical drawdown study, IRA/Taxable reference, and large-print 1-page self-directed checklist.</p>
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
