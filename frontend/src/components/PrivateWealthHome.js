/**
 * TruthOfMarket — Single-Breath Private-Wealth Step-Up Platform (GEMINI.md Section 9)
 * 0 Emojis · 0 Clutter Below Step-Up Container · 1-Line Legal Footer Only
 */

const PW_HTML_TEMPLATE = `    <main id="tom-retirement-architect" class="pw-shell">
      <header class="pw-masthead">
        <button type="button" class="pw-brand-btn" data-pw-go-home="1">
          <span class="pw-wordmark">TRUTH OF MARKET</span>
          <span class="pw-submark">Private Wealth Quantitative Desk</span>
        </button>
        <button type="button" class="pw-signin-link" id="btnOpenPwRestoreModal">Member Sign-In / Restore</button>
      </header>

      <!-- Screen 0: Founding Manifesto & 2000-2025 Institutional Simulation Table -->
      <section id="pwScreen0" data-pw-screen="0">
        <div class="pw-kicker">FOUNDING CHARTER &middot; QUANTITATIVE SECTOR ARCHITECTURE</div>
        <h1 class="pw-serif-h1">Why quiet two-pillar discipline outlasts loud stock picking.</h1>

        <div class="pw-manifesto">
          <p>
            Most households approaching or living in retirement do not lose sleep&mdash;or hard-earned capital&mdash;because they ignored the market. They lose both because financial media pushes investors to chase dozens of noisy stock tips at once, quietly drifting into pure technology concentration right before a multi-year downturn.
          </p>
          <p>
            We built <strong>Truth of Market</strong> for a calmer purpose. Rather than sending speculative trade alerts, our quantitative research desk focuses on one enduring discipline: participating in structural semiconductor innovation (<strong>SMH</strong>) while anchoring household composure with non-cyclical healthcare cash flows (<strong>XLV</strong>) and short-term US Treasury reserves (<strong>SGOV</strong>).
          </p>
          <p>
            Through a brief four-question assessment below, this platform maps your initial sector baseline, tracks daily public market temperature so you know when historical risk has stretched to extremes, and provides structured retirement withdrawal and tax-account planning tools.
          </p>
        </div>

        <div class="pw-table-card" role="region" aria-label="2000-2025 Historical Simulation Comparison">
          <div class="pw-table-header">
            <span class="pw-table-title">TABLE I &mdash; HISTORICAL SECTOR SIMULATION (2000&ndash;2025)</span>
            <span class="pw-table-meta">Non-Leveraged 1x Spot Index / ETF Series</span>
          </div>
          <div class="pw-table-scroll">
            <table class="pw-sim-table">
              <thead>
                <tr>
                  <th>Architecture</th>
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
                  <td>SMH &times; XLV Disciplined Balance</td>
                  <td>~11.4%</td>
                  <td class="pw-dd-neg">-27.8%</td>
                  <td>19 mos</td>
                  <td class="pw-eff-pos">0.41x</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="pw-table-note">
            Historical index/ETF simulation (2000&ndash;2025, semi-annual systematic ratio reset) for self-directed educational data visualization only; past results do not guarantee future performance.
          </p>
        </div>

        <div class="pw-primary-cta-wrap">
          <button type="button" class="pw-btn-primary pw-btn-emerald" id="btnStartPwStepUp">
            Design My Personal Balance &rarr;
          </button>
          <span class="pw-cta-caption">Four brief inputs &middot; Instant baseline computation &middot; No brokerage login required</span>
        </div>
      </section>

      <!-- Screen 1: Focused 1-Question-at-a-Time Step-Up Assessment (Step 1 of 4 -> 4 of 4) -->
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
            <h2 class="pw-q-title">What is your primary objective for this capital?</h2>
            <p class="pw-q-sub">Select the mandate that best reflects how this account serves your household.</p>
            <div class="pw-option-list" role="radiogroup" aria-label="Primary Capital Goal">
              <button type="button" class="pw-opt-btn" data-pw-field="objective" data-pw-val="growth">
                <div class="pw-opt-head"><span><span class="pw-opt-num">I</span><span class="pw-opt-title">Capital Growth &amp; AI Participation</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Emphasize structural semiconductor compounding (SMH) while tempering severe cycle drawdowns with XLV.</span>
              </button>
              <button type="button" class="pw-opt-btn is-selected" data-pw-field="objective" data-pw-val="balanced">
                <div class="pw-opt-head"><span><span class="pw-opt-num">II</span><span class="pw-opt-title">Balanced Retirement Income &amp; Stability</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Pair secular growth (SMH) with resilient healthcare cash flows (XLV) for steady multi-cycle compounding.</span>
              </button>
              <button type="button" class="pw-opt-btn" data-pw-field="objective" data-pw-val="preservation">
                <div class="pw-opt-head"><span><span class="pw-opt-num">III</span><span class="pw-opt-title">Capital Preservation First</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Prioritize defensive healthcare (XLV) and short-term US Treasury liquidity (SGOV) to protect principal.</span>
              </button>
            </div>
          </div>

          <div data-pw-qpane="2" style="display:none;">
            <h2 class="pw-q-title">What is the approximate scale of your portfolio?</h2>
            <p class="pw-q-sub">Used strictly in your browser to calibrate defensive reserve thresholds across 401(k), IRA, and taxable accounts.</p>
            <div class="pw-scale-grid" role="radiogroup" aria-label="Portfolio Scale">
              <button type="button" class="pw-scale-btn" data-pw-field="scale" data-pw-val="50000">$50,000</button>
              <button type="button" class="pw-scale-btn" data-pw-field="scale" data-pw-val="150000">$150,000</button>
              <button type="button" class="pw-scale-btn is-selected" data-pw-field="scale" data-pw-val="300000">$300,000</button>
              <button type="button" class="pw-scale-btn" data-pw-field="scale" data-pw-val="500000">$500,000</button>
              <button type="button" class="pw-scale-btn" data-pw-field="scale" data-pw-val="1000000">$1,000,000+</button>
            </div>
          </div>

          <div data-pw-qpane="3" style="display:none;">
            <h2 class="pw-q-title">During a severe market downturn, what drawdown can you hold through calmly?</h2>
            <p class="pw-q-sub">The best allocation is the one quiet enough that you never liquidate shares at the bottom of a cycle.</p>
            <div class="pw-option-list" role="radiogroup" aria-label="Maximum Drawdown Tolerance">
              <button type="button" class="pw-opt-btn" data-pw-field="comfort" data-pw-val="dd10">
                <div class="pw-opt-head"><span><span class="pw-opt-num">I</span><span class="pw-opt-title">-10% Calm Priority</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Include a dedicated short-term US Treasury reserve (SGOV) alongside XLV to keep volatility muted.</span>
              </button>
              <button type="button" class="pw-opt-btn is-selected" data-pw-field="comfort" data-pw-val="dd18">
                <div class="pw-opt-head"><span><span class="pw-opt-num">II</span><span class="pw-opt-title">-18% Balanced</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Accept moderate cyclical fluctuations in exchange for balanced SMH &times; XLV long-term participation.</span>
              </button>
              <button type="button" class="pw-opt-btn" data-pw-field="comfort" data-pw-val="dd25">
                <div class="pw-opt-head"><span><span class="pw-opt-num">III</span><span class="pw-opt-title">-25% Long-Term Compounding</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Focus on multi-year compounding with higher semiconductor equity weighting.</span>
              </button>
            </div>
          </div>

          <div data-pw-qpane="4" style="display:none;">
            <h2 class="pw-q-title">How much of your equity portfolio currently sits in technology or semiconductors?</h2>
            <p class="pw-q-sub">Helps highlight concentration exposure relative to your target historical baseline.</p>
            <div class="pw-option-list" role="radiogroup" aria-label="Current Tech Exposure">
              <button type="button" class="pw-opt-btn is-selected" data-pw-field="techMix" data-pw-val="tech_high">
                <div class="pw-opt-head"><span><span class="pw-opt-num">I</span><span class="pw-opt-title">Over 70% Concentrated in Tech &amp; Semiconductors</span></span></div>
                <span class="pw-opt-desc">Heavily exposed to a single capital-spending cycle; evaluating healthcare defensive ballast.</span>
              </button>
              <button type="button" class="pw-opt-btn" data-pw-field="techMix" data-pw-val="tech_mid">
                <div class="pw-opt-head"><span><span class="pw-opt-num">II</span><span class="pw-opt-title">30% to 70% Balanced Exposure</span></span></div>
                <span class="pw-opt-desc">Moderately diversified across sectors; refining into a clean two-pillar architecture.</span>
              </button>
              <button type="button" class="pw-opt-btn" data-pw-field="techMix" data-pw-val="tech_low">
                <div class="pw-opt-head"><span><span class="pw-opt-num">III</span><span class="pw-opt-title">Under 30% Tech or Primarily Cash</span></span></div>
                <span class="pw-opt-desc">Holding cash or broad index funds; establishing a disciplined entry baseline.</span>
              </button>
            </div>
            <div style="margin-top:24px;">
              <button type="button" class="pw-btn-primary pw-btn-emerald" id="btnSubmitPwAssessment" style="width:100%;">
                Generate My Baseline Allocation &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Screen 2: Free Email Gate (#tomMorningBellClub + #tom-passwordless-club-signup) -> Opens Partial Baseline -->
      <section id="tomMorningBellClub" data-pw-screen="2" style="display:none;">
        <div class="pw-gate-card">
          <div class="pw-profile-strip">
            <span id="pwProfileSummaryLine">Selected Mandate: Balanced Retirement &middot; $300,000 &middot; -18% Tolerance</span>
            <button type="button" class="pw-inline-link" id="btnEditPwInputs">Edit Inputs</button>
          </div>

          <div id="tom-passwordless-club-signup">
            <!-- Locked Email Gate -->
            <div id="pwEmailGateLockedView">
              <div class="pw-kicker">STEP-UP STAGE I &middot; COMPLIMENTARY BASELINE SUMMARY</div>
              <h2 class="pw-serif-h2">Open your initial SMH &times; XLV baseline ratio.</h2>
              <p style="margin:0;color:#475569;font-size:0.96rem;">
                Enter your email below (passwordless, 1-click unsubscribe anytime) to view your initial historical baseline percentages and receive our morning research note.
              </p>
              <form class="pw-email-form" id="pwFreeGateForm" novalidate>
                <input type="text" name="website_hp" id="pwGateHp" tabindex="-1" autocomplete="off" aria-hidden="true" style="display:none;" />
                <input type="email" id="pwGateEmailInput" class="pw-email-input" required autocomplete="email" placeholder="Enter your email address" aria-label="Email address" />
                <button type="submit" class="pw-btn-primary pw-btn-emerald" id="btnPwGateSubmit">
                  Open My Baseline Allocation &rarr;
                </button>
              </form>
              <div id="pwGateStatusMsg" role="status" aria-live="polite" style="display:none;margin-top:10px;font-size:0.88rem;color:#991B1B;"></div>
            </div>

            <!-- Partial Unlocked View (Initial Percentage Ratio ONLY; Tracking & PDF Gated in Paid Tiers) -->
            <div id="pwEmailGateUnlockedView" style="display:none;">
              <div class="pw-kicker">INITIAL HISTORICAL BASELINE &middot; PARTIAL SUMMARY OPEN</div>
              <h2 class="pw-serif-h2" id="pwUnlockedRatioHeadline">55% SMH &middot; 35% XLV &middot; 10% SGOV Reserve</h2>
              <p style="margin:0;color:#475569;font-size:0.94rem;" id="pwUnlockedRationaleText">
                Calibrated from 2000&ndash;2025 non-leveraged ETF series for your selected mandate. Need brokerage execution basics? <button type="button" class="pw-inline-link" id="tomFreeStarterManual">Open the complimentary $0 US Brokerage Limit-Order Guide</button>.
              </p>

              <div class="pw-ratio-bar" id="pwRatioVisualBar" aria-hidden="true">
                <span style="width:55%;background:#0F172A;"></span>
                <span style="width:35%;background:#065F46;"></span>
                <span style="width:10%;background:#94A3B8;"></span>
              </div>

              <div class="pw-ratio-grid" id="pwRatioCellsGrid">
                <div class="pw-ratio-cell">
                  <div class="pw-ratio-ticker">SMH &middot; GROWTH</div>
                  <div class="pw-ratio-pct" id="pwPctSmh">55%</div>
                  <div class="pw-ratio-name">Semiconductor Pillar</div>
                </div>
                <div class="pw-ratio-cell">
                  <div class="pw-ratio-ticker">XLV &middot; DEFENSE</div>
                  <div class="pw-ratio-pct" id="pwPctXlv">35%</div>
                  <div class="pw-ratio-name">Healthcare Cash Flow</div>
                </div>
                <div class="pw-ratio-cell">
                  <div class="pw-ratio-ticker">SGOV &middot; LIQUIDITY</div>
                  <div class="pw-ratio-pct" id="pwPctSgov">10%</div>
                  <div class="pw-ratio-name">0&ndash;3 Mo US T-Bill</div>
                </div>
              </div>

              <div class="pw-gated-preview-list">
                <div class="pw-gated-row">
                  <span>Daily Morning SMH &times; XLV Market Temperature (0&ndash;100) &amp; Weight Tracking Mail</span>
                  <span class="pw-gated-badge">UNLOCKS IN TIER I &amp; II BELOW</span>
                </div>
                <div class="pw-gated-row">
                  <span>Retirement Safe-Withdrawal &amp; Tax-Account Masterbook PDF + Annual Cash-Flow Sheet</span>
                  <span class="pw-gated-badge">UNLOCKS IN TIER II BELOW</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Screen 3: 2-Tier Differentiated Paid Membership (Polar.sh ?locale=en + COPY_MODE) -->
      <section id="pricing" class="pw-tiers-section" data-pw-screen="3" style="display:none;">
        <div class="pw-kicker">STEP-UP STAGE II &middot; PRIVATE WEALTH MEMBERSHIP</div>
        <h2 class="pw-serif-h2" id="pwPricingHeadline">Complete daily regime tracking and retirement withdrawal architecture.</h2>
        <p style="margin:0;color:#475569;font-size:0.95rem;" id="pwPricingSubcopy">
          Know every morning where semiconductor overheating or fear sits on our 25-year scale, and access the complete safe-withdrawal and tax-account planning suite.
        </p>

        <div class="pw-tier-grid">
          <div class="pw-tier-card">
            <div>
              <div class="pw-tier-kicker">TIER I &middot; MONTHLY EDITION</div>
              <h3 class="pw-tier-name">Monthly Tracking Edition</h3>
              <div class="pw-tier-price">$29 <span>/ month</span></div>
              <div class="pw-tier-saving">Flexible month-to-month access</div>
              <ul class="pw-tier-list">
                <li><strong>Daily Morning SMH &times; XLV Temperature &amp; Weight Tracking Briefings</strong> delivered before the US market open</li>
                <li><strong>Historical Regime Ratio Reference Sheet</strong> mapping 0&ndash;100 sentiment bands to model sector weights</li>
                <li><strong>Account-Scale Dollar Allocation Calculator</strong> across SMH, XLV, and SGOV reserves</li>
              </ul>
            </div>
            <a href="#tom-vip-monthly" class="pw-btn-primary polar-checkout-button" data-polar-checkout data-polar-plan="monthly_29" data-tom-paid-plan="monthly" style="width:100%;">
              Select Monthly Tracking &mdash; $29/mo &rarr;
            </a>
          </div>

          <div class="pw-tier-card is-annual">
            <div>
              <div class="pw-tier-kicker">TIER II &middot; ANNUAL PRIVATE WEALTH &middot; SAVE 43%</div>
              <h3 class="pw-tier-name">Annual Private Wealth Edition</h3>
              <div class="pw-tier-price">$199 <span>/ year</span></div>
              <div class="pw-tier-saving">Equivalent to $16.58/mo (Save 43% vs. monthly)</div>
              <ul class="pw-tier-list">
                <li><strong>Everything in Tier I</strong> &mdash; full 12 months of Daily Morning SMH &times; XLV Temperature &amp; Weight Tracking Briefings</li>
                <li><strong>Lifetime-Updated Retirement Safe-Withdrawal &amp; Tax-Account Masterbook PDF</strong> (401(k), IRA &amp; taxable sequencing)</li>
                <li><strong>Annual Cash-Flow &amp; Systematic Ratio Planning Sheet</strong> for multi-decade household budgeting</li>
              </ul>
            </div>
            <a href="#tom-vip-annual" class="pw-btn-primary pw-btn-emerald polar-checkout-button" data-polar-checkout data-polar-plan="annual_199" data-tom-paid-plan="annual" style="width:100%;">
              Select Annual Private Wealth &mdash; $199/yr &rarr;
            </a>
          </div>
        </div>

        <p class="pw-mor-note">
          Merchant of Record: Polar.sh (Global Card / Apple Pay / Google Pay) &middot; 14-Day Refund Policy &middot; Cancel anytime in one click.
        </p>
      </section>
    </main>

    <footer class="pw-legal-footer">
      <div class="pw-legal-links">
        <span>TruthOfMarket</span>
        <span>&middot;</span>
        <a href="/terms.html">Terms</a>
        <span>&middot;</span>
        <a href="/privacy.html">Privacy</a>
        <span>&middot;</span>
        <a href="/refund.html">Refund</a>
        <span>&middot;</span>
        <a href="/contact.html">Contact</a>
        <span>&middot;</span>
        <a href="mailto:beable9489@gmail.com">beable9489@gmail.com</a>
      </div>
      <p class="pw-legal-disclaimer">
        TruthOfMarket provides self-directed educational data visualization and mathematical portfolio calculators only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice.
      </p>
    </footer>

    <!-- Member Sign-In / Restore Modal (0 Emojis) -->
    <div class="pw-modal-backdrop" id="pwRestoreModal" role="dialog" aria-modal="true" aria-labelledby="pwRestoreTitle">
      <div class="pw-modal-dialog">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;">
          <span class="pw-kicker" style="margin:0;">MEMBER ACCESS &amp; RESTORE</span>
          <button type="button" class="pw-back-btn" id="btnClosePwRestoreModal">Close</button>
        </div>
        <h3 class="pw-serif-h2" id="pwRestoreTitle" style="font-size:1.65rem;">Restore Your Baseline or Paid License</h3>
        <p style="margin:0 0 16px;font-size:0.92rem;color:#475569;">
          Enter the email address used during registration to reopen your saved SMH &times; XLV baseline, or enter a Polar.sh license key if applicable.
        </p>
        <form id="pwRestoreForm" novalidate style="display:flex;flex-direction:column;gap:12px;">
          <input type="email" id="pwRestoreEmailInput" class="pw-email-input" placeholder="Registered email address" autocomplete="email" />
          <input type="text" id="pwRestoreLicenseInput" class="pw-email-input" placeholder="Optional: Polar.sh license key" autocomplete="off" />
          <button type="submit" class="pw-btn-primary pw-btn-emerald" style="width:100%;">Restore Session &rarr;</button>
        </form>
        <div id="pwRestoreStatus" role="status" aria-live="polite" style="display:none;margin-top:12px;font-size:0.88rem;color:#065F46;"></div>
      </div>
    </div>

    <!-- Complimentary $0 Brokerage Safe-Order Guide Modal (0 Emojis) -->
    <div class="pw-modal-backdrop" id="pwStarterGuideModal" role="dialog" aria-modal="true" aria-labelledby="pwStarterGuideTitle">
      <div class="pw-modal-dialog">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;">
          <span class="pw-kicker" style="margin:0;">COMPLIMENTARY EXECUTION REFERENCE ($0)</span>
          <button type="button" class="pw-back-btn" id="btnClosePwStarterGuideModal">Close</button>
        </div>
        <h3 class="pw-serif-h2" id="pwStarterGuideTitle" style="font-size:1.65rem;">US Brokerage Limit-Order &amp; ETF Reference</h3>
        <div style="font-size:0.92rem;line-height:1.7;color:#334155;display:flex;flex-direction:column;gap:12px;">
          <div>
            <strong style="color:#0F172A;">I. Place Limit Orders Rather Than Market Orders</strong><br/>
            On Fidelity, Charles Schwab, or Vanguard, select <em>Limit Order</em> rather than <em>Market Order</em> during the first 15 minutes after the 9:30 AM ET open to avoid temporary bid-ask spread widening on ETFs.
          </div>
          <div>
            <strong style="color:#0F172A;">II. Non-Leveraged 1x Spot Sector ETFs Only</strong><br/>
            Both <strong>SMH</strong> (Semiconductors) and <strong>XLV</strong> (US Healthcare) are unleveraged 1x spot ETFs free from daily 3x leveraged volatility-reset decay.
          </div>
          <div>
            <strong style="color:#0F172A;">III. Short-Term US Treasury Liquidity Cushion</strong><br/>
            Near-term household cash reserves can be insulated in 0&ndash;3 month US Treasury bills (<strong>SGOV</strong>) or government money-market funds (SPAXX / SWVXX / VMFXX).
          </div>
        </div>
      </div>
    </div>`;

function computePwBaseline(ans) {
  const obj = ans.objective || "balanced";
  const comfort = ans.comfort || "dd18";
  const scale = Number(ans.scale) || 300000;

  let smh = 55;
  let xlv = 35;
  let sgov = 10;

  if (obj === "growth") {
    smh = 68;
    xlv = 27;
    sgov = 5;
  } else if (obj === "preservation") {
    smh = 35;
    xlv = 45;
    sgov = 20;
  }

  if (comfort === "dd10") {
    smh = Math.max(25, smh - 12);
    xlv = xlv + 5;
    sgov = 100 - smh - xlv;
  } else if (comfort === "dd25") {
    sgov = Math.max(0, sgov - 5);
    smh = smh + 8;
    xlv = 100 - smh - sgov;
  }

  const objLabel =
    obj === "growth"
      ? "Capital Growth & AI"
      : obj === "preservation"
      ? "Capital Preservation"
      : "Balanced Retirement";
  const scaleLabel = scale >= 1000000 ? "$1,000,000+" : "$" + scale.toLocaleString();
  const ddLabel = comfort === "dd10" ? "-10% Calm" : comfort === "dd25" ? "-25% Compounding" : "-18% Balanced";

  return {
    smh,
    xlv,
    sgov,
    headline: `${smh}% SMH · ${xlv}% XLV · ${sgov}% SGOV Reserve`,
    summaryLine: `Mandate: ${objLabel} · ${scaleLabel} · ${ddLabel} Tolerance`,
  };
}

export function renderPrivateWealthSingleBreathHome() {
  return PW_HTML_TEMPLATE;
}

export function bindPrivateWealthSingleBreathEvents(state) {
  let currentScreen = 0;
  let currentStep = 1;
  let answers = {
    objective: "balanced",
    scale: 300000,
    comfort: "dd18",
    techMix: "tech_high",
  };

  try {
    const rawSaved = localStorage.getItem("tom_pw_stepup_answers_v1");
    if (rawSaved) {
      const parsed = JSON.parse(rawSaved);
      if (parsed && typeof parsed === "object") {
        answers = Object.assign(answers, parsed);
      }
    }
  } catch (_) {}

  const getSavedEmail = () => {
    try {
      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.getLocalMember === "function") {
        const m = window.DreamCompanyCRM.getLocalMember("TOM");
        if (m && m.email) return String(m.email).trim().toLowerCase();
      }
      return String(localStorage.getItem("tom_free_member_email") || "").trim().toLowerCase();
    } catch (_) {
      return "";
    }
  };

  const applyCopyMode = () => {
    const isLiveSharp = Boolean(window.PAYMENT_CONFIG && window.PAYMENT_CONFIG.STORE_LIVE_READY === true);
    window.TOM_COPY_MODE = isLiveSharp ? "LIVE_SHARP" : "UNDERWRITING_SAFE";
    const hEl = document.getElementById("pwPricingHeadline");
    if (hEl && isLiveSharp) {
      hEl.textContent = "Receive daily morning SMH × XLV regime weights and the complete retirement masterbook.";
    }
  };

  const syncOptionSelections = () => {
    document.querySelectorAll("[data-pw-field]").forEach((btn) => {
      const f = btn.getAttribute("data-pw-field");
      const v = btn.getAttribute("data-pw-val");
      const active = String(answers[f]) === String(v);
      btn.classList.toggle("is-selected", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });
  };

  const syncStage2And3Data = () => {
    const b = computePwBaseline(answers);
    const sumEl = document.getElementById("pwProfileSummaryLine");
    if (sumEl) sumEl.textContent = b.summaryLine;

    const hlEl = document.getElementById("pwUnlockedRatioHeadline");
    if (hlEl) hlEl.textContent = b.headline;

    const pSmh = document.getElementById("pwPctSmh");
    const pXlv = document.getElementById("pwPctXlv");
    const pSgov = document.getElementById("pwPctSgov");
    if (pSmh) pSmh.textContent = b.smh + "%";
    if (pXlv) pXlv.textContent = b.xlv + "%";
    if (pSgov) pSgov.textContent = b.sgov + "%";

    const barEl = document.getElementById("pwRatioVisualBar");
    if (barEl) {
      barEl.innerHTML =
        `<span style="width:${b.smh}%;background:#0F172A;"></span>` +
        `<span style="width:${b.xlv}%;background:#065F46;"></span>` +
        `<span style="width:${b.sgov}%;background:#94A3B8;"></span>`;
    }

    const email = getSavedEmail();
    const isUnlocked = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    const lockedView = document.getElementById("pwEmailGateLockedView");
    const unlockedView = document.getElementById("pwEmailGateUnlockedView");
    if (lockedView) lockedView.style.display = isUnlocked ? "none" : "block";
    if (unlockedView) unlockedView.style.display = isUnlocked ? "block" : "none";
  };

  const showScreen = (screenNum) => {
    currentScreen = screenNum;
    const s0 = document.getElementById("pwScreen0");
    const s1 = document.getElementById("pwScreen1");
    const s2 = document.getElementById("tomMorningBellClub");
    const s3 = document.getElementById("pricing");
    if (s0) s0.style.display = screenNum === 0 ? "block" : "none";
    if (s1) s1.style.display = screenNum === 1 ? "block" : "none";
    if (s2) s2.style.display = screenNum >= 2 ? "block" : "none";
    if (s3) s3.style.display = screenNum >= 2 ? "block" : "none";
    if (screenNum >= 2) {
      syncStage2And3Data();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showQuestionStep = (stepNum) => {
    currentStep = Math.max(1, Math.min(4, stepNum));
    document.querySelectorAll("[data-pw-qpane]").forEach((p) => {
      p.style.display = Number(p.getAttribute("data-pw-qpane")) === currentStep ? "block" : "none";
    });
    const lbl = document.getElementById("pwStepCounterLabel");
    if (lbl) lbl.textContent = `STEP 0${currentStep} OF 04`;
    const fill = document.getElementById("pwStepProgressFill");
    if (fill) fill.style.width = `${currentStep * 25}%`;
    syncOptionSelections();
  };

  const startBtn = document.getElementById("btnStartPwStepUp");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      showQuestionStep(1);
      showScreen(1);
    });
  }

  document.querySelectorAll("[data-pw-go-home]").forEach((b) => {
    b.addEventListener("click", () => showScreen(0));
  });

  const backBtn = document.getElementById("btnPwStepBack");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (currentStep > 1) {
        showQuestionStep(currentStep - 1);
      } else {
        showScreen(0);
      }
    });
  }

  document.querySelectorAll("[data-pw-field]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.getAttribute("data-pw-field");
      const rawVal = btn.getAttribute("data-pw-val");
      answers[f] = f === "scale" ? Number(rawVal) : rawVal;
      try {
        localStorage.setItem("tom_pw_stepup_answers_v1", JSON.stringify(answers));
      } catch (_) {}
      syncOptionSelections();
      if (currentStep < 4) {
        setTimeout(() => showQuestionStep(currentStep + 1), 150);
      }
    });
  });

  const submitAssessmentBtn = document.getElementById("btnSubmitPwAssessment");
  if (submitAssessmentBtn) {
    submitAssessmentBtn.addEventListener("click", () => {
      showScreen(2);
    });
  }

  const editBtn = document.getElementById("btnEditPwInputs");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      showQuestionStep(1);
      showScreen(1);
    });
  }

  const gateForm = document.getElementById("pwFreeGateForm");
  if (gateForm) {
    gateForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const hp = document.getElementById("pwGateHp");
      if (hp && hp.value) return;
      const inp = document.getElementById("pwGateEmailInput");
      const msg = document.getElementById("pwGateStatusMsg");
      const email = String(inp ? inp.value : "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        if (msg) {
          msg.style.display = "block";
          msg.textContent = "Please enter a valid email address.";
        }
        if (inp) inp.focus();
        return;
      }
      if (msg) msg.style.display = "none";
      const submitBtn = document.getElementById("btnPwGateSubmit");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Opening Baseline...";
      }

      const b = computePwBaseline(answers);
      const noteStr = `site=truthofmarket.com | baseline=${b.headline} | ${b.summaryLine}`;
      try {
        const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
        localStorage.setItem("tom_free_member_email", email);
        localStorage.setItem("tom_free_member_since", kst);
        localStorage.setItem(
          "dc_member_TOM",
          JSON.stringify({
            div: "TOM",
            email,
            nickname: "",
            segment: "retirement_401k_ira",
            notes: noteStr,
            joined_at: new Date().toISOString(),
          })
        );
        if (state) state.freeMemberEmail = email;
        if (typeof window.trackTomFreeSignup === "function") {
          window.trackTomFreeSignup(email);
        }
      } catch (_) {}

      const finishUnlock = () => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Open My Baseline Allocation &rarr;";
        }
        syncStage2And3Data();
      };

      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.registerMember === "function") {
        window.DreamCompanyCRM.registerMember({
          div: "TOM",
          email,
          nickname: "",
          segment: "retirement_401k_ira",
          lang: "en-US",
          notes: noteStr,
          message: noteStr,
        })
          .then(finishUnlock)
          .catch(finishUnlock);
      } else if (typeof window.submitTomVipWaitlistOrManualEmail === "function") {
        window.submitTomVipWaitlistOrManualEmail({
          email,
          segment: "retirement_401k_ira",
          lang: "en-US",
          notes: noteStr,
        })
          .then(finishUnlock)
          .catch(finishUnlock);
      } else {
        finishUnlock();
      }
    });
  }

  // Modals: Member Restore & $0 Brokerage Guide
  const restoreModal = document.getElementById("pwRestoreModal");
  const openRestoreBtn = document.getElementById("btnOpenPwRestoreModal");
  const closeRestoreBtn = document.getElementById("btnClosePwRestoreModal");
  if (openRestoreBtn && restoreModal) {
    openRestoreBtn.addEventListener("click", () => {
      const saved = getSavedEmail();
      const inp = document.getElementById("pwRestoreEmailInput");
      if (inp && saved && !inp.value) inp.value = saved;
      restoreModal.classList.add("is-open");
    });
  }
  if (closeRestoreBtn && restoreModal) {
    closeRestoreBtn.addEventListener("click", () => restoreModal.classList.remove("is-open"));
  }
  if (restoreModal) {
    restoreModal.addEventListener("click", (ev) => {
      if (ev.target === restoreModal) restoreModal.classList.remove("is-open");
    });
  }

  const restoreForm = document.getElementById("pwRestoreForm");
  if (restoreForm) {
    restoreForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emInp = document.getElementById("pwRestoreEmailInput");
      const licInp = document.getElementById("pwRestoreLicenseInput");
      const stEl = document.getElementById("pwRestoreStatus");
      const em = String(emInp ? emInp.value : "").trim().toLowerCase();
      const lic = String(licInp ? licInp.value : "").trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em) && lic.length < 12) {
        if (stEl) {
          stEl.style.display = "block";
          stEl.style.color = "#991B1B";
          stEl.textContent = "Please enter a valid registered email or license key.";
        }
        return;
      }
      try {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) {
          localStorage.setItem("tom_free_member_email", em);
          if (state) state.freeMemberEmail = em;
        }
        if (lic.length >= 12) {
          localStorage.setItem("rsa_pro_unlocked", "true");
          localStorage.setItem("rsa_token", lic);
          if (state) {
            state.isProUnlocked = true;
            state.licenseKey = lic;
          }
        }
      } catch (_) {}
      if (stEl) {
        stEl.style.display = "block";
        stEl.style.color = "#065F46";
        stEl.textContent = "Session restored. Opening your baseline view.";
      }
      setTimeout(() => {
        if (restoreModal) restoreModal.classList.remove("is-open");
        showScreen(2);
      }, 450);
    });
  }

  const guideModal = document.getElementById("pwStarterGuideModal");
  const openGuideBtn = document.getElementById("tomFreeStarterManual");
  const closeGuideBtn = document.getElementById("btnClosePwStarterGuideModal");
  if (openGuideBtn && guideModal) {
    openGuideBtn.addEventListener("click", () => guideModal.classList.add("is-open"));
  }
  if (closeGuideBtn && guideModal) {
    closeGuideBtn.addEventListener("click", () => guideModal.classList.remove("is-open"));
  }
  if (guideModal) {
    guideModal.addEventListener("click", (ev) => {
      if (ev.target === guideModal) guideModal.classList.remove("is-open");
    });
  }

  applyCopyMode();
  syncOptionSelections();

  const h = (window.location.hash || "").toLowerCase();
  if (h === "#pricing" || h === "#tommorningbellclub") {
    showScreen(2);
    if (h === "#pricing") {
      setTimeout(() => {
        const pr = document.getElementById("pricing");
        if (pr && pr.scrollIntoView) pr.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }
}
