/**
 * TruthOfMarket — Single-Breath Educational Sector Research Platform
 * 0 Emojis · 0 Clutter Below Step-Up Container · 1-Line Legal Footer Only
 * Strictly Non-Advisory Educational Publisher · Whop (@whop/checkout) Live Integration
 */

const PW_HTML_TEMPLATE = `    <main id="tom-retirement-architect" class="pw-shell">
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
          <span id="tomLiveTempText">Data As Of: 2026-11-18 &middot; Sector Temperature: 11 / 100 (Extreme Fear Regime)</span>
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

  const estCrisisDd = -(0.34 * (smh / 100) + 0.175 * (xlv / 100) + 0.005 * (sgov / 100)) * 100;
  const estRecMos = Math.max(9, Math.round(25 * (smh / 100) + 11 * (xlv / 100) + 2 * (sgov / 100)));

  const objLabel =
    obj === "growth"
      ? "Secular Growth Study"
      : obj === "preservation"
      ? "Defensive Stability Study"
      : "Balanced Cash-Flow Study";
  const scaleLabel = scale >= 1000000 ? "$1,000,000+" : "$" + scale.toLocaleString();
  const ddLabel = comfort === "dd10" ? "-10% Band" : comfort === "dd25" ? "-25% Band" : "-18% Band";

  return {
    smh,
    xlv,
    sgov,
    headline: `${smh}% SMH · ${xlv}% XLV · ${sgov}% SGOV Historical Study Ratio`,
    summaryLine: `Study Profile: ${objLabel} · ${scaleLabel} Sample · ${ddLabel}`,
    ddCompareText: `~${estCrisisDd.toFixed(1)}% Hist. Crisis DD · ~${estRecMos} mos recovery`,
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

  let liveTempScore = 11;
  let liveTempDate = "2026-11-18";

  // Restore cross-device magic_restore payload if present
  try {
    if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.decodeMagicRestoreParam === "function") {
      const magicObj = window.DreamCompanyCRM.decodeMagicRestoreParam(window.location.search);
      if (magicObj && typeof magicObj === "object") {
        if (magicObj.objective) answers.objective = magicObj.objective;
        if (magicObj.scale) answers.scale = Number(magicObj.scale) || 300000;
        if (magicObj.comfort) answers.comfort = magicObj.comfort;
        if (magicObj.techMix) answers.techMix = magicObj.techMix;
        localStorage.setItem("rsa_pro_unlocked", "true");
        localStorage.setItem("tom_pw_stepup_answers_v1", JSON.stringify(answers));
        if (magicObj.email) localStorage.setItem("tom_free_member_email", String(magicObj.email).toLowerCase());
      }
    }
  } catch (_) {}

  const hydrateLiveTempBadge = () => {
    const applyOverview = (ov) => {
      if (!ov || typeof ov !== "object") return;
      const dt = String(ov.date || "").trim();
      const rawScore = Number(ov.fg_score);
      if (!dt || !Number.isFinite(rawScore)) return;
      const scoreInt = Math.round(rawScore);
      liveTempScore = scoreInt;
      liveTempDate = dt;
      const regRaw = String(ov.regime_en || "Neutral").trim();
      const regText = /regime$/i.test(regRaw) ? regRaw : `${regRaw} Regime`;
      const txtEl = document.getElementById("tomLiveTempText");
      if (txtEl) {
        txtEl.textContent = `Data As Of: ${dt} · Sector Temperature: ${scoreInt} / 100 (${regText})`;
      }
      renderScreen4PaidVault();
    };

    if (state && state.semiOverview) {
      applyOverview(state.semiOverview);
    }
    fetch("/data/semi_overview.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(applyOverview)
      .catch(() => {
        fetch("/static_api/semi_overview.json", { cache: "no-store" })
          .then((r) => (r.ok ? r.json() : null))
          .then(applyOverview)
          .catch(() => {});
      });
  };

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

    const ddCmpEl = document.getElementById("pwStudyDrawdownCompareVal");
    if (ddCmpEl) ddCmpEl.textContent = b.ddCompareText;

    const barEl = document.getElementById("pwRatioVisualBar");
    if (barEl) {
      barEl.innerHTML =
        `<span style="width:${b.smh}%;background:#0F172A;"></span>` +
        `<span style="width:${b.xlv}%;background:#065F46;"></span>` +
        `<span style="width:${b.sgov}%;background:#94A3B8;"></span>`;
    }

    const email = getSavedEmail();
    const inp = document.getElementById("pwGateEmailInput");
    if (inp && email && !inp.value) {
      inp.value = email;
    }
  };

  const fmtUsd = (n) => "$" + Math.round(Number(n) || 0).toLocaleString("en-US");

  const renderScreen4PaidVault = () => {
    const b = computePwBaseline(answers);
    const scaleInp = document.getElementById("tomCustomDollarInput");
    const totalUsd = Math.max(10000, Number(scaleInp && scaleInp.value ? scaleInp.value : answers.scale) || 300000);
    if (scaleInp && Number(scaleInp.value) !== totalUsd) {
      scaleInp.value = String(totalUsd);
    }
    const smhUsd = Math.round(totalUsd * (b.smh / 100));
    const xlvUsd = Math.round(totalUsd * (b.xlv / 100));
    const sgovUsd = totalUsd - smhUsd - xlvUsd;

    const tblEl = document.getElementById("tomScreen4DollarTable");
    if (tblEl) {
      tblEl.innerHTML =
        `<div class="pw-table-header"><span class="pw-table-title">SECTION I &mdash; SAMPLE DOLLAR-SCALE EDUCATIONAL WORKSHEET (${fmtUsd(totalUsd)})</span><span class="pw-table-meta">1x Spot ETF Case Study</span></div>` +
        `<div class="pw-table-scroll"><table class="pw-sim-table"><thead><tr><th>Study Sleeve</th><th>Study Ratio</th><th>Sample Dollar Amount</th><th>Historical Role in 2000&ndash;2025 Dataset</th></tr></thead><tbody>` +
        `<tr><td><strong>SMH</strong> (Semiconductor 1x)</td><td>${b.smh}%</td><td style="font-variant-numeric:tabular-nums;font-weight:700;">${fmtUsd(smhUsd)}</td><td>Secular innovation &amp; long-term compounding engine</td></tr>` +
        `<tr><td><strong>XLV</strong> (US Healthcare 1x)</td><td>${b.xlv}%</td><td style="font-variant-numeric:tabular-nums;font-weight:700;">${fmtUsd(xlvUsd)}</td><td>Non-cyclical cash-flow ballast during tech contractions</td></tr>` +
        `<tr class="is-featured"><td><strong>SGOV</strong> (0&ndash;3 Mo US T-Bill)</td><td>${b.sgov}%</td><td style="font-variant-numeric:tabular-nums;font-weight:700;">${fmtUsd(sgovUsd)}</td><td>Multi-year calm withdrawal buffer (zero equity forced selling)</td></tr>` +
        `</tbody></table></div>`;
    }

    const sp35Loss = Math.round(totalUsd * 0.35);
    const tech49Loss = Math.round(totalUsd * 0.49);
    const studyShockPct = Math.round((0.46 * (b.smh / 100) + 0.16 * (b.xlv / 100) + 0.0 * (b.sgov / 100)) * 1000) / 10;
    const studyShockLoss = Math.round(totalUsd * (studyShockPct / 100));
    const stressEl = document.getElementById("tomScreen4StressTest");
    if (stressEl) {
      stressEl.innerHTML =
        `<div class="pw-table-header"><span class="pw-table-title">SECTION II &mdash; -35% SEVERE MARKET CRASH STRESS TEST (${fmtUsd(totalUsd)} SCALE)</span><span class="pw-table-meta">Drawdown Cushion Study</span></div>` +
        `<div class="pw-table-scroll"><table class="pw-sim-table"><thead><tr><th>Comparison Cohort</th><th>Modeled Shock</th><th>Dollar Change</th><th>Remaining Value &amp; SGOV Cushion</th></tr></thead><tbody>` +
        `<tr><td>100% Semiconductor Alone</td><td class="pw-dd-neg">-49.0%</td><td class="pw-dd-neg">-${fmtUsd(tech49Loss)}</td><td>${fmtUsd(totalUsd - tech49Loss)} ($0 T-Bill buffer)</td></tr>` +
        `<tr><td>S&amp;P 500 Index Alone</td><td class="pw-dd-neg">-35.0%</td><td class="pw-dd-neg">-${fmtUsd(sp35Loss)}</td><td>${fmtUsd(totalUsd - sp35Loss)} ($0 T-Bill buffer)</td></tr>` +
        `<tr class="is-featured"><td><strong>Selected SMH &times; XLV + SGOV Study</strong></td><td class="pw-eff-pos">-${studyShockPct.toFixed(1)}%</td><td class="pw-eff-pos">-${fmtUsd(studyShockLoss)}</td><td><strong>${fmtUsd(totalUsd - studyShockLoss)} (${fmtUsd(sgovUsd)} SGOV intact)</strong></td></tr>` +
        `</tbody></table></div>` +
        `<p class="pw-table-note">Educational historical stress illustration only: keeping ${fmtUsd(sgovUsd)} in 0&ndash;3 month US Treasury reserves (SGOV) historically prevented forced equity sales during 18&ndash;24 month market recoveries.</p>`;
    }

    const taxEl = document.getElementById("tomScreen4TaxRoadmap");
    if (taxEl) {
      taxEl.innerHTML =
        `<div class="pw-kicker" style="margin-bottom:6px;">SECTION III &mdash; US RETIREMENT TAX-LOCATION EDUCATIONAL ROADMAP</div>` +
        `<h3 style="margin:0 0 10px;font-size:1.15rem;color:#0F172A;">401(k) &middot; Traditional IRA &middot; Roth IRA &middot; Taxable Account Study Mapping</h3>` +
        `<div style="display:grid;gap:10px;font-size:0.94rem;color:#334155;">` +
        `<div style="padding:12px;background:#F8FAFC;border-left:3px solid #0F172A;border-radius:6px;"><strong>1. Roth IRA (Tax-Free Compounding Sleeve &mdash; Est. ${fmtUsd(Math.round(smhUsd * 0.55))}):</strong> Commonly studied for higher-growth 1x <strong>SMH</strong> holdings so multi-year appreciation compounds without future RMD or withdrawal tax friction.</div>` +
        `<div style="padding:12px;background:#F8FAFC;border-left:3px solid #065F46;border-radius:6px;"><strong>2. 401(k) / Traditional IRA (Tax-Deferred Rebalancing Sleeve &mdash; Est. ${fmtUsd(xlvUsd + Math.round(smhUsd * 0.45))}):</strong> Studying semi-annual ratio resets between <strong>XLV</strong> and <strong>SMH</strong> inside tax-deferred accounts avoids triggering annual taxable capital-gains distributions.</div>` +
        `<div style="padding:12px;background:#F8FAFC;border-left:3px solid #64748B;border-radius:6px;"><strong>3. Taxable Brokerage / Treasury Direct (Liquidity Sleeve &mdash; ${fmtUsd(sgovUsd)}):</strong> Holding 0&ndash;3 month US Treasury ETF <strong>SGOV</strong> provides penalty-free household cash access while US Treasury interest is generally exempt from state and local income taxes.</div>` +
        `</div>`;
    }

    const brokerEl = document.getElementById("tomScreen4BrokerGuide");
    if (brokerEl) {
      brokerEl.innerHTML =
        `<div class="pw-kicker" style="margin-bottom:6px;">SECTION IV &mdash; FIDELITY &middot; CHARLES SCHWAB &middot; VANGUARD 5-MINUTE VISUAL GUIDE</div>` +
        `<h3 style="margin:0 0 10px;font-size:1.15rem;color:#0F172A;">Large-Print Self-Directed Limit-Order Checklist (18px+ Senior Clarity)</h3>` +
        `<ol style="margin:0;padding-left:22px;font-size:1.02rem;line-height:1.8;color:#1E293B;">` +
        `<li><strong>Trade During Calm Midday Hours (10:00 AM &ndash; 3:30 PM ET):</strong> Skip the first and last 15 minutes of the trading session when ETF bid-ask spreads temporarily widen.</li>` +
        `<li><strong>Verify Exact 1x Unleveraged Tickers:</strong> Confirm <strong>SMH</strong> (VanEck Semiconductor ETF), <strong>XLV</strong> (Health Care Select Sector SPDR), and <strong>SGOV</strong> (iShares 0&ndash;3 Month Treasury Bond ETF). Never select 3x leveraged tickers.</li>` +
        `<li><strong>Select "Limit Order" Instead of "Market Order":</strong> On Fidelity, Schwab, or Vanguard, set your Limit Price at the current Ask price (or +$0.05) so execution price is strictly bounded.</li>` +
        `<li><strong>Semi-Annual Calendar Review Only:</strong> Check drift just twice a year (e.g., January 15 &amp; July 15) rather than reacting to daily headlines.</li>` +
        `</ol>`;
    }

    const rebalanceWindow = liveTempScore >= 78 || liveTempScore <= 22;
    const verdictLabel = rebalanceWindow
      ? "[1-SECOND STATUS: HISTORICAL DRIFT REVIEW WINDOW]"
      : "[1-SECOND STATUS: KEEP CALM & HOLD — REST EASY THIS MONTH]";
    const monthlyEl = document.getElementById("tomScreen4MonthlyCard");
    if (monthlyEl) {
      monthlyEl.innerHTML =
        `<div class="pw-kicker" style="margin-bottom:6px;">SECTION V &mdash; MONTHLY 1ST REASSURANCE REPORT CARD &amp; WEEKLY PLAIN-ENGLISH ESSAY</div>` +
        `<div style="padding:12px 16px;border-radius:8px;background:${rebalanceWindow ? "#FEF3C7" : "#ECFDF5"};color:${rebalanceWindow ? "#92400E" : "#065F46"};font-weight:800;font-size:1.02rem;margin-bottom:10px;">${verdictLabel} &middot; Temperature ${liveTempScore}/100 (As Of ${liveTempDate})</div>` +
        `<p style="margin:0 0 8px;font-size:0.96rem;color:#334155;"><strong>Monthly Cushion Summary:</strong> Across recent market swings, pairing unleveraged SMH with defensive healthcare XLV and ${fmtUsd(sgovUsd)} in SGOV Treasury reserves kept household volatility muted compared with single-sector tech holdings.</p>` +
        `<p style="margin:0;font-size:0.94rem;color:#475569;"><strong>Weekly Plain-English Note:</strong> A calm retirement plan works best when your near-term living expenses sit outside the stock market in short-term Treasury bills—turning market pullbacks from an emergency into background weather.</p>`;
    }

    const satMount = document.getElementById("tomSatisfactionMount");
    if (satMount && !satMount.__mounted && window.DreamCompanyCRM && typeof window.DreamCompanyCRM.mountSatisfactionBar === "function") {
      satMount.__mounted = true;
      window.DreamCompanyCRM.mountSatisfactionBar(satMount, { div: "TOM", context: "screen4_paid_vault", email: getSavedEmail() });
    }
  };

  const openTomCustomPdfWindow = () => {
    renderScreen4PaidVault();
    const dollarHtml = (document.getElementById("tomScreen4DollarTable") || {}).innerHTML || "";
    const stressHtml = (document.getElementById("tomScreen4StressTest") || {}).innerHTML || "";
    const taxHtml = (document.getElementById("tomScreen4TaxRoadmap") || {}).innerHTML || "";
    const brokerHtml = (document.getElementById("tomScreen4BrokerGuide") || {}).innerHTML || "";
    const monthlyHtml = (document.getElementById("tomScreen4MonthlyCard") || {}).innerHTML || "";
    const w = window.open("", "_blank");
    if (!w) {
      window.print();
      return;
    }
    w.document.write(
      `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>TruthOfMarket 1:1 Custom SMH x XLV + SGOV Workbook PDF</title>` +
      `<style>body{font-family:Georgia,serif;max-width:780px;margin:24px auto;padding:0 20px;color:#0f172a;font-size:16px;line-height:1.65;}h1,h2,h3{font-family:Inter,Arial,sans-serif;}table{width:100%;border-collapse:collapse;margin:12px 0;font-family:Inter,Arial,sans-serif;font-size:14px;}th,td{border:1px solid #cbd5e1;padding:9px 10px;text-align:left;}th{background:#f1f5f9;}.page-break{page-break-before:always;margin-top:28px;padding-top:18px;border-top:2px solid #0f172a;}@media print{.no-print{display:none;}}</style></head><body>` +
      `<div class="no-print" style="padding:12px;background:#ecfdf5;border:1px solid #059669;border-radius:8px;margin-bottom:18px;font-family:Arial,sans-serif;"><strong>Ready to Save as PDF:</strong> Choose <em>Save as PDF</em> in the print dialog. <button onclick="window.print()" style="margin-left:12px;padding:8px 16px;background:#065f46;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;">Save / Print PDF</button></div>` +
      `<h1>TruthOfMarket &mdash; 1:1 Custom SMH &times; XLV + SGOV Educational Workbook</h1>` +
      `<p style="font-size:13px;color:#475569;">Independent Market Data &amp; Educational Research Publisher (Strictly Non-Advisory Historical Statistics &middot; Support: beable9489@gmail.com)</p>` +
      `<div>${dollarHtml}</div><div style="margin-top:18px;">${stressHtml}</div>` +
      `<div class="page-break">${taxHtml}</div><div class="page-break">${brokerHtml}</div><div class="page-break">${monthlyHtml}</div>` +
      `</body></html>`
    );
    w.document.close();
    setTimeout(() => {
      try { w.print(); } catch (_) {}
    }, 350);
  };

  const showScreen = (screenNum) => {
    currentScreen = screenNum;
    const isPaidUnlocked = (() => {
      try {
        return localStorage.getItem("rsa_pro_unlocked") === "true" || screenNum === 4;
      } catch (_) {
        return screenNum === 4;
      }
    })();
    const s0 = document.getElementById("pwScreen0");
    const s1 = document.getElementById("pwScreen1");
    const s2 = document.getElementById("tomMorningBellClub");
    const s3 = document.getElementById("pricing");
    const s4 = document.getElementById("tomPaidScreen4Vault");
    if (s0) s0.style.display = screenNum === 0 ? "block" : "none";
    if (s1) s1.style.display = screenNum === 1 ? "block" : "none";
    if (s2) s2.style.display = screenNum >= 2 ? "block" : "none";
    if (s3) s3.style.display = screenNum >= 2 ? "block" : "none";
    if (s4) s4.style.display = screenNum === 4 || (screenNum >= 2 && isPaidUnlocked) ? "block" : "none";
    if (screenNum >= 2) {
      syncStage2And3Data();
      if (s4 && s4.style.display === "block") {
        renderScreen4PaidVault();
      }
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

  document.querySelectorAll("[data-pw-start-stepup], #btnStartPwStepUp").forEach((startBtn) => {
    if (startBtn.__pwBound) return;
    startBtn.__pwBound = true;
    startBtn.addEventListener("click", () => {
      showQuestionStep(1);
      showScreen(1);
    });
  });

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
          msg.style.color = "#991B1B";
          msg.textContent = "Please enter a valid email address.";
        }
        if (inp) inp.focus();
        return;
      }
      const submitBtn = document.getElementById("btnPwGateSubmit");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving Summary...";
      }

      const b = computePwBaseline(answers);
      const noteStr = `site=truthofmarket.com | study_ratio=${b.headline} | ${b.summaryLine}`;
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

      const finishSave = () => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Saved & Subscribed";
        }
        if (msg) {
          msg.style.display = "block";
          msg.style.color = "#065F46";
          msg.textContent = `Saved for ${email}. Complimentary morning research notes are now active (1-click unsubscribe anytime).`;
        }
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
          .then(finishSave)
          .catch(finishSave);
      } else if (typeof window.submitTomVipWaitlistOrManualEmail === "function") {
        window.submitTomVipWaitlistOrManualEmail({
          email,
          segment: "retirement_401k_ira",
          lang: "en-US",
          notes: noteStr,
        })
          .then(finishSave)
          .catch(finishSave);
      } else {
        finishSave();
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

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em) && lic.length < 8) {
        if (stEl) {
          stEl.style.display = "block";
          stEl.style.color = "#991B1B";
          stEl.textContent = "Please enter a valid registered email or Whop receipt ID.";
        }
        return;
      }
      try {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) {
          localStorage.setItem("tom_free_member_email", em);
          if (state) state.freeMemberEmail = em;
        }
        if (lic.length >= 8) {
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
        stEl.textContent = "Session restored. Opening your historical study summary.";
      }
      setTimeout(() => {
        if (restoreModal) restoreModal.classList.remove("is-open");
        showScreen(lic.length >= 8 ? 4 : 2);
      }, 450);
    });
  }

  const customDollarInp = document.getElementById("tomCustomDollarInput");
  if (customDollarInp) {
    customDollarInp.value = String(answers.scale || 300000);
    customDollarInp.addEventListener("input", () => {
      answers.scale = Math.max(10000, Number(customDollarInp.value) || 300000);
      renderScreen4PaidVault();
    });
  }

  const pdfBtn = document.getElementById("btnDownloadTomCustomPdf");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", openTomCustomPdfWindow);
  }

  const magicForm = document.getElementById("tomPaidMagicEmailForm");
  if (magicForm) {
    magicForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = document.getElementById("tomPaidMagicEmailInput");
      const st = document.getElementById("tomPaidMagicStatus");
      const em = String(inp ? inp.value : getSavedEmail()).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) {
        if (st) {
          st.style.display = "block";
          st.style.color = "#991B1B";
          st.textContent = "Please enter a valid email address.";
        }
        return;
      }
      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.deliverPaidMagicPack === "function") {
        window.DreamCompanyCRM.deliverPaidMagicPack({
          div: "TOM",
          email: em,
          plan_tier: (localStorage.getItem("tom_whop_active_plan") === "annual") ? "Annual Research Pass ($199/yr)" : "Monthly Research Pass ($29/mo)",
          order_ref: localStorage.getItem("rsa_token") || "TOM-MAGIC-LINK",
          base_url: "https://truthofmarket.com/",
          hash_anchor: "tomPaidScreen4Vault",
          profile_state: answers,
        }).then((res) => {
          if (st) {
            st.style.display = "block";
            st.style.color = "#065F46";
            st.textContent = `Permanent cross-device restore link sent to ${em} (14-day refund guarantee included).`;
          }
          const rf = document.getElementById("tomOneClickRefundLink");
          if (rf && res && res.refund_support_url) rf.href = res.refund_support_url;
        });
      }
    });
  }

  window.addEventListener("tom:paid-unlocked", () => {
    showScreen(4);
    setTimeout(() => {
      const v4 = document.getElementById("tomPaidScreen4Vault");
      if (v4 && v4.scrollIntoView) v4.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  });

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

  hydrateLiveTempBadge();
  syncOptionSelections();

  const h = (window.location.hash || "").toLowerCase();
  const s = (window.location.search || "").toLowerCase();
  if (
    h === "#tompaidscreen4vault" ||
    s.includes("payment=success") ||
    s.includes("paid_restore=1") ||
    s.includes("magic_restore=")
  ) {
    showScreen(4);
    setTimeout(() => {
      const v4 = document.getElementById("tomPaidScreen4Vault");
      if (v4 && v4.scrollIntoView) v4.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  } else if (h === "#pricing" || h === "#tommorningbellclub") {
    showScreen(2);
    if (h === "#pricing") {
      setTimeout(() => {
        const pr = document.getElementById("pricing");
        if (pr && pr.scrollIntoView) pr.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }
}
