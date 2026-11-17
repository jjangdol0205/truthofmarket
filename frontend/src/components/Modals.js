import { formatCheckoutUrl } from "../services/api.js";

export function renderModals(state) {
  const t = state.t || {};
  const cfg = state.config || {};
  const polarMonthly = formatCheckoutUrl(
    cfg.polar_tom_monthly_url || cfg.ls_site1_monthly_url,
    "#tom-vip-monthly"
  );
  const polarAnnual = formatCheckoutUrl(
    cfg.polar_tom_annual_url || cfg.ls_site1_ltd_url,
    "#tom-vip-annual"
  );
  const tgChannelUrl = cfg.telegram_channel_url || "https://t.me/truthofmarketss";
  const ytUrl = cfg.youtube_url || "https://www.youtube.com/@RightSideAlpha";
  const igUrl = cfg.instagram_url || "https://www.instagram.com/rightsidealpha";
  const tgChatId = state.telegramChatId || cfg.telegram_chat_id || "@truthofmarketss";
  const tgToken = state.telegramBotToken || "DEMO-BOT-TOKEN";
  const tgType = state.telegramAlertType || "SEMI_BRIEFING";
  const ov = state.semiOverview || {};
  const ovDate = ov.date || "2026-11-16";
  const ovScore = Number(ov.fg_score ?? 18.0).toFixed(1);
  const ovRegime = String(ov.regime_en || "EXTREME FEAR").toUpperCase();
  const ovSmh = Number(ov.smh_close ?? 522.49).toFixed(2);
  const ovDd = Number(ov.smh_dd_pct ?? -22.23).toFixed(2);
  const ovRsi = Number(ov.smh_rsi ?? 40.6).toFixed(1);
  const ovXlv = Number(ov.xlv_close ?? 184.87).toFixed(2);
  const ovQqq = Number(ov.qqq_close ?? 690.49).toFixed(2);
  const ovW1 = ov.recommended_smh_weight ?? 80;
  const ovW2 = ov.recommended_xlv_weight ?? 20;
  const tgPreview =
    state.telegramPreviewText ||
    `🧭 [TruthOfMarket] Daily Market Weather & Barbell Summary (${ovDate})\n• Sentiment Score: ${ovScore} / 100 (${ovRegime})\n• $SMH: $${ovSmh} (${ovDd}% 52W DD | RSI ${ovRsi})\n• $XLV: $${ovXlv} | $QQQ: $${ovQqq}\n• Educational Barbell Model: ${ovW1}% $SMH : ${ovW2}% $XLV`;

  const isWebView =
    typeof window !== "undefined" &&
    typeof window.isTomInAppWebView === "function" &&
    window.isTomInAppWebView();
  const savedEmail =
    (state && state.freeMemberEmail) ||
    (typeof localStorage !== "undefined" ? localStorage.getItem("tom_free_member_email") || "" : "");

  return `
    <!-- LICENSE ACTIVATION MODAL -->
    <div class="modal-backdrop" id="licenseModal">
      <div class="modal" style="max-width:540px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
          <div style="font-size:0.68rem; font-family:var(--font-mono); color:#93c5fd; text-transform:uppercase; letter-spacing:0.05em;">
            SELF-DIRECTED EDUCATIONAL CALCULATOR SOFTWARE · VIP ACCESS
          </div>
          <button type="button" class="btn btn-sm" id="btnCancelLicense" style="padding:4px 10px;">✕ Close</button>
        </div>
        <h3 style="font-size:1.18rem; font-weight:800; margin-top:4px; color:var(--text);">Unlock Full VIP Retiree Worksheets &amp; Tax-Bucket Reference</h3>
        <p style="color:var(--text-secondary); font-size:0.95rem; margin-top:6px; line-height:1.55;">
          Includes Custom Nest-Egg Dollar ($) Budget Worksheet, 12-Month Dividend Paycheck Calendar &amp; Tax-Bucket Reference, and Large-Print 1-Page Weather Action Sheet. Backed by our 14-Day Refund Policy.
        </p>
        <div style="display:grid; grid-template-columns:1fr; gap:10px; margin:14px 0 10px;">
          <a class="btn btn-primary polar-checkout-button" data-polar-checkout data-polar-plan="monthly_29" data-tom-paid-plan="monthly" href="${polarMonthly}" style="justify-content:center; min-height:62px; padding:12px 16px; font-size:1.02rem; font-weight:800; border-radius:12px;">
            Start Monthly VIP — $29/mo
          </a>
          <a class="btn btn-emerald polar-checkout-button" data-polar-checkout data-polar-plan="annual_199" data-tom-paid-plan="annual" href="${polarAnnual}" style="justify-content:center; min-height:62px; padding:12px 16px; font-size:1.02rem; font-weight:800; border-radius:12px;">
            Start Annual VIP — $199/yr (Save 43%)
          </a>
        </div>
        <div style="margin-bottom:8px; font-size:0.78rem; color:#e2e8f0; font-weight:700; text-align:center; line-height:1.45;">
          💳 Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay) · 1-Click Cancel Anytime · 14-Day Refund Policy
        </div>
        <div style="margin-bottom:12px; font-size:0.72rem; color:#94a3b8; text-align:center; line-height:1.45;">
          Support Desk: <a href="mailto:beable9489@gmail.com?subject=TruthOfMarket%20VIP%20Software%20Support" style="color:#93c5fd; font-weight:700; text-decoration:underline;">beable9489@gmail.com</a>
        </div>
        <div id="licenseMsg" style="font-size:0.8rem; margin-bottom:8px; min-height:1.1em;"></div>
        <details id="licenseRestoreDetails" ${state.isProUnlocked ? "open" : ""} style="background:#0b1120; border:1px solid rgba(148,163,184,0.25); border-radius:10px; padding:10px 12px;">
          <summary style="cursor:pointer; font-size:0.8rem; font-weight:700; color:#93c5fd;">
            🔑 Switching devices or already have a License Key? Restore here
          </summary>
          <div style="margin-top:10px;">
            <input type="text" id="licenseInput" value="${state.licenseKey || ""}" placeholder="Enter Polar.sh VIP License Key (XXXX-XXXX-XXXX-XXXX)" autocomplete="off" />
            <div style="display:flex; gap:8px; justify-content:space-between; align-items:center; flex-wrap:wrap; margin-top:8px;">
              <div>
                ${
                  state.isProUnlocked
                    ? `<button class="btn btn-sm" id="btnLockLicense" style="color:var(--fin-down); border-color:rgba(246,70,93,0.4);">Deactivate / Lock</button>`
                    : ""
                }
              </div>
              <div style="display:flex; gap:8px;">
                <button class="btn btn-primary" id="btnVerifyLicense">Restore &amp; Unlock VIP</button>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>

    <!-- TELEGRAM RESEARCH DISPATCH HUB MODAL -->
    <div class="modal-backdrop" id="telegramModal">
      <div class="modal" style="max-width:640px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#38bdf8; text-transform:uppercase; letter-spacing:0.05em;">
              EDUCATIONAL MARKET DATA &amp; QUANTITATIVE RESEARCH DESK
            </div>
            <h3 style="font-size:1.12rem; font-weight:800; margin-top:3px; color:#ffffff;">
              Telegram Educational Research &amp; Briefing Hub
            </h3>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <a class="btn btn-sm" id="tgModalYtBtn" href="${ytUrl}" target="_blank" rel="noopener noreferrer" style="border-color:rgba(239,68,68,0.45); color:#fca5a5;">
              📺 YouTube ↗
            </a>
            <a class="btn btn-sm" id="tgModalIgBtn" href="${igUrl}" target="_blank" rel="noopener noreferrer" style="border-color:rgba(236,72,153,0.45); color:#f9a8d4;">
              📸 Instagram ↗
            </a>
            <a class="btn btn-sm" id="tgChannelLinkBtn" href="${tgChannelUrl}" target="_blank" rel="noopener noreferrer" style="border-color:rgba(56,189,248,0.45); color:#38bdf8;">
              ✈️ @truthofmarketss ↗
            </a>
          </div>
        </div>

        <p style="color:var(--muted); font-size:0.8rem; margin-top:6px; margin-bottom:12px; line-height:1.5;">
          Join our Official Broadcast Channel <a href="${tgChannelUrl}" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; font-weight:700;">t.me/truthofmarketss</a> (<code class="mono" style="color:#93c5fd;">@truthofmarketss</code>) for daily US Market Weather &amp; ETF educational summaries.
        </p>

        ${
          state.isAdminAuthenticated
            ? `<div class="semi-form-grid-2" style="margin-bottom:8px;">
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">TELEGRAM BOT PROFILE (@BotFather)</label>
            <input type="text" id="tgBotTokenInput" value="${tgToken}" placeholder="DEMO-BOT-TOKEN" autocomplete="off" style="margin:4px 0 0; -webkit-text-security:disc;" />
          </div>
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">CHAT ID OR @CHANNEL USERNAME</label>
            <input type="text" id="tgChatIdInput" value="${tgChatId}" placeholder="@truthofmarketss" autocomplete="off" style="margin:4px 0 0;" />
          </div>
        </div>`
            : ""
        }

        <div class="${state.isAdminAuthenticated ? "semi-form-grid-2" : ""}" style="margin-bottom:10px;">
          ${
            state.isAdminAuthenticated
              ? `<div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">PUBLIC CHANNEL URL (HEADER / FOOTER LINK)</label>
            <input type="text" id="tgChannelUrlInput" value="${tgChannelUrl}" placeholder="https://t.me/truthofmarketss" style="margin:4px 0 0;" />
          </div>`
              : ""
          }
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">BRIEFING TEMPLATE</label>
            <select id="tgAlertTypeSelect" style="width:100%; padding:9px 10px; margin-top:4px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-sans); font-size:0.82rem; font-weight:600;">
              <option value="SEMI_BRIEFING" ${tgType === "SEMI_BRIEFING" ? "selected" : ""}>1. Market Weather &amp; $SMH:$XLV Barbell Summary</option>
              <option value="RSA_IGNITION" ${tgType === "RSA_IGNITION" ? "selected" : ""}>2. US Factor Research Snapshot</option>
              <option value="FULL_DAILY" ${tgType === "FULL_DAILY" ? "selected" : ""}>3. Full Combined Educational Summary</option>
              ${
                state.isAdminAuthenticated
                  ? `<option value="TEST_PING" ${tgType === "TEST_PING" ? "selected" : ""}>4. Bot Connection Verification Ping</option>`
                  : ""
              }
            </select>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-size:0.68rem; font-family:var(--font-mono); color:#93c5fd;">
            LIVE BRIEFING PREVIEW (VERIFIED LATEST CLOSES)
          </span>
          <div style="display:flex; gap:6px;">
            ${
              state.isAdminAuthenticated
                ? `<button class="btn btn-sm" id="btnVerifyTelegram" title="Test Bot Token with Telegram API">Verify &amp; Save Bot</button>`
                : ""
            }
            <button class="btn btn-sm" id="btnPreviewTelegram">Refresh Preview</button>
            <button class="btn btn-sm" id="btnCopyTelegramMsg">Copy Text</button>
          </div>
        </div>

        <pre id="telegramPreviewBox" style="background:#05080f; border:1px solid var(--border); border-left:3px solid #38bdf8; border-radius:4px; padding:12px; font-family:var(--font-mono); font-size:0.74rem; color:#e2e8f0; white-space:pre-wrap; max-height:210px; overflow-y:auto; line-height:1.5; margin-bottom:10px;">${tgPreview}</pre>

        <div id="telegramStatusMsg" style="font-size:0.78rem; margin-bottom:10px; min-height:1.2em; color:#93c5fd;"></div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <span class="mono" style="font-size:0.68rem; color:var(--muted);">
            Official Channel: @truthofmarketss · Educational Market Data
          </span>
          <div style="display:flex; gap:8px;">
            <button class="btn" id="btnCloseTelegram">Close</button>
            <a class="btn btn-primary" href="${tgChannelUrl}" target="_blank" rel="noopener noreferrer" style="background:#0284c7; border-color:#38bdf8;">
              Join Telegram Channel ↗
            </a>
            ${
              state.isAdminAuthenticated
                ? `<button class="btn btn-primary" id="btnSendTelegramNow" style="background:#059669; border-color:#10b981;">
              Send Briefing to Telegram ↗
            </button>`
                : ""
            }
          </div>
        </div>
      </div>
    </div>

    <!-- ADMIN LOGIN MODAL -->
    <div class="modal-backdrop" id="adminLoginModal">
      <div class="modal" style="max-width:440px;">
        <div style="font-size:0.68rem; font-family:var(--font-mono); color:#f59e0b; text-transform:uppercase; letter-spacing:0.05em;">
          RESTRICTED ACCESS · ADMINISTRATOR AUTHENTICATION
        </div>
        <h3 style="font-size:1.12rem; font-weight:800; margin-top:4px; color:#ffffff;">
          🔒 Admin Software Login
        </h3>
        <p style="color:var(--muted); font-size:0.8rem; margin-top:6px; margin-bottom:12px; line-height:1.5;">
          Enter your Administrator ID and Password to manage Checkout &amp; Partner parameters.
        </p>

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">ADMIN ID</label>
        <input type="text" id="adminIdInput" placeholder="Enter Admin ID" autocomplete="off" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">ADMIN ACCESS KEY</label>
        <input type="text" id="adminPwInput" placeholder="Enter Admin Password" autocomplete="off" style="-webkit-text-security:disc;" />

        <div id="adminLoginMsg" style="font-size:0.8rem; margin-bottom:12px; min-height:1.2em;"></div>

        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button class="btn" id="btnCancelAdminLogin">Cancel</button>
          <button class="btn btn-primary" id="btnSubmitAdminLogin">Login as Admin</button>
        </div>
      </div>
    </div>

    <!-- TERMINAL & PARTNER CONFIG MODAL -->
    <div class="modal-backdrop" id="configModal">
      <div class="modal" style="max-width:640px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#93c5fd; text-transform:uppercase; letter-spacing:0.05em;">
              ADMINISTRATION · CHECKOUT &amp; PARTNER ROUTING
            </div>
            <h3 style="font-size:1.12rem; font-weight:800; margin-top:4px; color:#ffffff;">Checkout &amp; Partner Parameter Configuration</h3>
          </div>
          <button class="btn btn-sm" id="btnAdminLogout" style="border-color:rgba(246,70,93,0.45); color:var(--fin-down);">
            🔒 Admin Logout
          </button>
        </div>

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">PLATFORM DOMAIN</label>
        <input type="text" id="cfgSite1Url" value="${cfg.site1_url || "https://truthofmarket.com"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">POLAR.SH MONTHLY VIP URL ($29/MO)</label>
        <input type="text" id="cfgLsMonthly" value="${cfg.polar_tom_monthly_url || ""}" placeholder="https://buy.polar.sh/..." />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">POLAR.SH ANNUAL VIP URL ($199/YR)</label>
        <input type="text" id="cfgLsLtd" value="${cfg.polar_tom_annual_url || ""}" placeholder="https://buy.polar.sh/..." />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TELEGRAM OFFICIAL CHANNEL URL</label>
        <input type="text" id="cfgTgChannel" value="${tgChannelUrl}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">OFFICIAL YOUTUBE CHANNEL URL (@RightSideAlpha)</label>
        <input type="text" id="cfgYoutubeUrl" value="${ytUrl}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">OFFICIAL INSTAGRAM PROFILE URL (@rightsidealpha)</label>
        <input type="text" id="cfgInstagramUrl" value="${igUrl}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TRADINGVIEW PARTNER ID</label>
        <input type="text" id="cfgAffTv" value="${cfg.tradingview_aff_id || "1173809"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">SEEKING ALPHA PARTNER SOURCE TAG</label>
        <input type="text" id="cfgAffSa" value="${cfg.seekingalpha_source || "better_life333"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TRENDSPIDER PARTNER LABEL</label>
        <input type="text" id="cfgBrokerName" value="${cfg.broker_name || "TrendSpider (rightside)"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TRENDSPIDER PARTNER URL</label>
        <input type="text" id="cfgBrokerUrl" value="${cfg.broker_referral_url || "https://trendspider.com/?_go=rightside"}" />

        <div id="configMsg" style="font-size:0.8rem; margin-bottom:12px; min-height:1.2em;"></div>

        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button class="btn" id="btnCancelConfig">Close</button>
          <button class="btn btn-primary" id="btnSaveConfig">Save Configuration</button>
        </div>
      </div>
    </div>

    <!-- EDUCATIONAL SEC FILING SUMMARY MODAL -->
    <div class="modal-backdrop" id="researchModal">
      <div class="modal" style="max-width:760px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <h3 style="font-size:1.1rem; font-weight:800; color:#ffffff;" id="researchModalTitle">Public SEC Filing Educational Summary</h3>
          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-switch-research" data-ticker="CELH" id="btnSwitchResearchCelh">$CELH Summary</button>
            <button type="button" class="btn btn-sm btn-switch-research" data-ticker="MBLY" id="btnSwitchResearchMbly">$MBLY Summary</button>
            <button class="btn btn-sm" id="btnCloseResearch">Close ✕</button>
          </div>
        </div>
        <div id="researchModalBody" style="font-size:0.84rem; color:var(--text); line-height:1.65; max-height:62vh; overflow-y:auto; background:#05080f; padding:18px; border-radius:4px; border:1px solid var(--border);">
          Loading public filing summary...
        </div>
      </div>
    </div>

    <!-- LEGAL, PRIVACY, 14-DAY REFUND POLICY & SUPPORT MODAL -->
    <div class="modal-backdrop" id="legalModal">
      <div class="modal" style="max-width:740px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#93c5fd; text-transform:uppercase; letter-spacing:0.05em;">
              LEGAL &amp; COMPLIANCE · Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay)
            </div>
            <h3 style="font-size:1.1rem; font-weight:800; color:#ffffff; margin-top:3px;" id="legalModalTitle">
              Terms of Service, Privacy Policy &amp; 14-Day Refund Policy
            </h3>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <a class="btn btn-sm" href="/terms.html">Terms Page ↗</a>
            <a class="btn btn-sm" href="/privacy.html">Privacy Page ↗</a>
            <a class="btn btn-sm" href="/refund.html">14-Day Refund Page ↗</a>
            <button type="button" class="btn btn-sm" id="btnCloseLegalModal">Close ✕</button>
          </div>
        </div>
        <div id="legalModalBody" style="font-size:0.84rem; color:var(--text); line-height:1.68; max-height:62vh; overflow-y:auto; background:#05080f; padding:18px; border-radius:4px; border:1px solid var(--border);">
          <div data-legal-section="terms">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">1. Terms of Service &amp; Educational Software Scope</h4>
            <p style="color:var(--muted); margin-bottom:10px;">
              TruthOfMarket (<code class="mono">truthofmarket.com</code>) provides self-directed educational data visualization and mathematical portfolio calculators only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice. Users are solely responsible for their own financial decisions.
            </p>
          </div>
          <div data-legal-section="privacy" style="border-top:1px solid var(--border); padding-top:12px; margin-top:12px;">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">2. Privacy Policy</h4>
            <p style="color:var(--muted); margin-bottom:10px;">
              Portfolio inputs entered into our calculators are processed locally in your browser and are never sold or shared with third parties. Payment processing is handled securely by <b>Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay)</b> under PCI-DSS Level 1 compliance.
            </p>
          </div>
          <div data-legal-section="refund" style="border-top:1px solid var(--border); padding-top:12px; margin-top:12px;">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">3. 14-Day No-Questions-Asked Refund Policy &amp; 1-Click Cancellation</h4>
            <p style="color:var(--muted); margin-bottom:10px;">
              Both Monthly VIP ($29/mo) and Annual VIP ($199/yr) software subscriptions are backed by a <b>14-Day No-Questions-Asked Full Refund Guarantee</b>. Email <a href="mailto:beable9489@gmail.com" style="color:#60a5fa; font-weight:700;">beable9489@gmail.com</a> within 14 calendar days of initial purchase for a 100% full refund to your original payment method. You may also cancel recurring billing anytime in 1 click via your Polar.sh Customer Billing Portal.
            </p>
          </div>
          <div data-legal-section="support" style="border-top:1px solid var(--border); padding-top:12px; margin-top:12px;">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">4. Educational Market Data &amp; Quantitative Research Desk</h4>
            <p style="color:var(--muted);">
              • <b>Official Support Email</b>: <a href="mailto:beable9489@gmail.com" style="color:#60a5fa; font-weight:700;">beable9489@gmail.com</a><br/>
              • <b>Merchant of Record</b>: Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay) (<a href="https://polar.sh/purchases" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;">Manage Orders &amp; Receipts ↗</a>)
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- CALM 2-4X/YEAR REBALANCING METHODOLOGY MODAL -->
    <div class="modal-backdrop" id="pwRsiModal">
      <div class="modal" style="max-width:680px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#38bdf8; text-transform:uppercase; letter-spacing:0.06em; font-weight:800;">
              SELF-DIRECTED EDUCATIONAL CALCULATOR METHODOLOGY
            </div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#ffffff; margin:3px 0 0;">
              ${t.pwRsiModalTitle || "Calm 2–4x/Year 3-Bucket Household Budget & Cashflow Methodology"}
            </h3>
          </div>
          <button class="btn btn-sm" id="btnClosePwRsiModal" style="padding:4px 8px;">✕ Close</button>
        </div>

        <div style="max-height:70vh; overflow-y:auto; padding-right:4px; font-size:0.92rem; line-height:1.65; color:#cbd5e1;">
          <div style="background:#0b1322; border:1px solid rgba(56,189,248,0.25); border-radius:8px; padding:14px 16px; margin-bottom:12px;">
            <div style="font-weight:800; color:#ffffff; margin-bottom:4px; font-size:0.98rem;">
              Why Calm 2–4x/Year Weight Rebalancing Protects Retirement Longevity
            </div>
            <p style="margin:0; color:var(--muted); font-size:0.88rem;">
              Sequence-of-returns shocks occur when retirees are forced to sell depressed equity holdings to pay monthly living bills during a market downturn. Separating your nest egg into 3 clear buckets keeps 2–3 years of living expenses insulated in short-term US Treasuries while dividends and S&amp;P 500 compounding replenish cash calmly.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:12px;">
            <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:12px 14px;">
              <div style="font-weight:800; color:#38bdf8; margin-bottom:4px;">Bucket 1: US T-Bill &amp; Government MMF Cushion ($SGOV · SPAXX · SWVXX · VMFXX)</div>
              <p style="margin:0; font-size:0.86rem; color:var(--muted);">
                Holds 20% to 40% depending on our 3-Color Market Weather indicator, earning monthly Treasury interest while insulating near-term retirement cashflow.
              </p>
            </div>
            <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:12px 14px;">
              <div style="font-weight:800; color:#34d399; margin-bottom:4px;">Bucket 2: Monthly &amp; Rising Dividend Income ($JEPI · $SCHD · $XLV)</div>
              <p style="margin:0; font-size:0.86rem; color:var(--muted);">
                Holds 35% to 40% across monthly distribution and 10+ year dividend-growth ETFs to support predictable retirement income.
              </p>
            </div>
            <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:12px 14px;">
              <div style="font-weight:800; color:#fbbf24; margin-bottom:4px;">Bucket 3: S&amp;P 500 Core Compounding ($VOO)</div>
              <p style="margin:0; font-size:0.86rem; color:var(--muted);">
                Holds 20% to 45% in ultra-low-cost broad US equities, rebalanced calmly just 2–4 times per year when 3-Color Market Weather shifts.
              </p>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:14px; border-top:1px solid var(--border); padding-top:10px;">
            <button type="button" class="btn btn-primary btn-sm" id="btnUnderstandPwRsi" style="min-height:42px;">Got It — Return to Calculator</button>
          </div>
        </div>
      </div>
    </div>

    <!-- STOCK DETAIL SNAPSHOT MODAL (Used on /pro-swing.html & /stocks/*.html) -->
    <div class="modal-backdrop" id="stockDetailModal">
      <div class="modal" style="max-width:580px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#38bdf8; text-transform:uppercase; letter-spacing:0.06em; font-weight:800;">
              QUANTITATIVE FACTOR DATA SNAPSHOT
            </div>
            <h3 style="font-size:1.12rem; font-weight:800; color:#ffffff; margin:3px 0 0;" id="stockDetailTitle">
              Factor Snapshot Details
            </h3>
          </div>
          <button type="button" class="btn btn-sm" id="btnCloseStockDetail" style="min-height:40px; padding:6px 12px;">✕ Close</button>
        </div>
        <div id="stockDetailBody" style="max-height:70vh; overflow-y:auto; font-size:0.82rem; line-height:1.55; color:#cbd5e1;">
        </div>
      </div>
    </div>

    <!-- $0 FREE PUBLIC PRODUCT: US BROKERAGE APP & CALM 2-4X/YEAR REBALANCING MANUAL MODAL -->
    <div class="modal-backdrop" id="tomStarterManualModal" role="dialog" aria-modal="true" aria-labelledby="tomStarterManualModalTitle">
      <div class="modal tom-manual-modal-dialog">
        <div class="tom-manual-modal-header">
          <div style="min-width:0;">
            <div class="tom-manual-modal-kicker">📘 $0 FREE PUBLIC PRODUCT · FIDELITY · CHARLES SCHWAB · VANGUARD</div>
            <h3 id="tomStarterManualModalTitle" class="tom-manual-modal-title">
              US Brokerage App &amp; Calm 2–4x/Year Brokerage Limit-Order & Budget Starter Manual
            </h3>
          </div>
          <div class="tom-manual-modal-actions">
            <button type="button" class="tom-manual-print-btn" id="btnPrintTomStarterManual">
              ${isWebView ? "📩 Email Me This PDF Guide" : "🖨️ Print / Save PDF"}
            </button>
            <button type="button" class="tom-manual-close-btn" id="btnCloseTomStarterManual">
              ✕ Close
            </button>
          </div>
        </div>

        <div class="tom-manual-jump-nav" role="navigation" aria-label="Manual Chapters">
          <button type="button" class="tom-manual-jump-pill" data-manual-target="tomManualStep1">Step 1: Safe Limit Order</button>
          <button type="button" class="tom-manual-jump-pill" data-manual-target="tomManualStep2">Step 2: Calm 2–4x/Yr Rebalancing</button>
          <button type="button" class="tom-manual-jump-pill" data-manual-target="tomManualStep3">Step 3: 401(k)/IRA Cash MMF</button>
        </div>

        <div class="tom-manual-modal-body" id="tomStarterManualPrintArea">
          <!-- INLINE EMAIL-ME-THIS-PDF-GUIDE FORM (Auto-highlighted in Instagram/FB/Kakao WebViews + available anytime) -->
          <div
            id="tomWebviewPdfEmailBox"
            class="no-print-tom"
            style="background:linear-gradient(135deg,rgba(6,95,70,0.32),rgba(15,23,42,0.95));border:2px solid #10b981;border-radius:12px;padding:16px;display:${isWebView ? "block" : "block"};"
          >
            <div style="font-size:0.82rem;font-weight:900;color:#6ee7b7;letter-spacing:0.02em;margin-bottom:4px;">
              📩 ${isWebView ? "IN-APP BROWSER DETECTED — SAVE THIS GUIDE TO YOUR INBOX" : "INSTANT EMAIL COPY + FREE CLUB ACCESS"}
            </div>
            <h4 style="margin:0 0 6px;font-size:1.12rem;font-weight:900;color:#ffffff;">
              Email Me This PDF Guide Now (Instant Free Club Access)
            </h4>
            <p style="margin:0 0 10px;font-size:0.96rem;line-height:1.55;color:#e2e8f0;">
              Enter your email below and we will send this complete 3-Step Brokerage &amp; Calm 2–4x/Year Rebalancing Guide straight to your inbox along with free Morning Bell Retirement &amp; Macro Club membership ($0).
            </p>
            <form id="tomWebviewPdfEmailForm" novalidate style="display:flex;flex-wrap:wrap;gap:10px;">
              <input
                type="email"
                id="tomWebviewPdfEmailInput"
                required
                autocomplete="email"
                value="${String(savedEmail).replace(/"/g, "")}"
                placeholder="Enter your email address (e.g., robert@email.com)"
                style="flex:1 1 240px;min-height:52px;padding:10px 14px;border-radius:10px;border:2px solid #94a3b8;background:#ffffff;color:#0f172a;font-size:1rem;font-weight:700;"
              />
              <button
                type="submit"
                id="btnSubmitTomWebviewPdfEmail"
                style="min-height:52px;padding:10px 20px;border-radius:10px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:#022c22;font-size:1rem;font-weight:900;cursor:pointer;"
              >
                📩 Email Me This PDF Guide Now &rarr;
              </button>
            </form>
            <div
              id="tomWebviewPdfEmailStatus"
              role="status"
              aria-live="polite"
              style="display:none;margin-top:10px;font-size:0.95rem;font-weight:800;color:#6ee7b7;line-height:1.5;"
            ></div>
          </div>

          <article class="tom-manual-chapter" id="tomManualStep1">
            <div class="tom-manual-chapter-tag tag-green">STEP 1 OF 3 · SAFE ORDER ENTRY</div>
            <h4>Fidelity · Charles Schwab · Vanguard Safe Buying: Limit Order vs. Market Order</h4>
            <p>
              <b>Why 9:30 AM ET Market Orders Are Risky:</b> During the first 15 to 30 minutes after the 9:30 AM Eastern opening bell, bid-ask spreads on ETFs and stocks often widen temporarily. Tapping <b>Market Order</b> instructs your brokerage app to fill immediately at the prevailing ask price. Setting a calm <b>Limit Order</b> defines the exact maximum dollar price per share you are comfortable paying.
            </p>
            <div class="tom-manual-broker-list">
              <div class="tom-manual-broker-item">
                <strong>🟢 Fidelity App / Fidelity.com (3 Taps):</strong>
                <span>1) Tap <b>Transact → Trade</b> and enter the ETF symbol (such as SGOV, SCHD, JEPI, or VOO). 2) Switch <b>Order Type</b> from <i>Market</i> to <b>Limit</b> and enter your limit price. 3) Keep Time-in-Force on <b>Day</b>, tap <b>Preview</b>, and confirm.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🔵 Charles Schwab Mobile / Web (3 Taps):</strong>
                <span>1) Tap <b>Trade</b>, enter the symbol, and choose <b>Buy</b>. 2) Under <b>Order Type</b>, select <b>Limit</b> and enter your target Limit Price. 3) Choose <b>Timing: Day</b>, review total dollar amount, and tap <b>Place Order</b>.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🔴 Vanguard App / Vanguard.com (3 Taps):</strong>
                <span>1) Open <b>Transact → Buy &amp; sell stocks and ETFs</b>. 2) Enter ticker &amp; shares, then choose <b>Order Type: Limit</b>. 3) Enter your maximum share price, select <b>Duration: Day</b>, and submit.</span>
              </div>
            </div>
          </article>

          <article class="tom-manual-chapter" id="tomManualStep2">
            <div class="tom-manual-chapter-tag tag-amber">STEP 2 OF 3 · CALM 2–4X/YEAR PORTFOLIO WEIGHT REBALANCING</div>
            <h4>Aligning Your 3 Retirement Buckets 2–4 Times a Year with the 3-Color Market Weather Indicator</h4>
            <p>
              <b>No Daily Stress or Frequent Trading:</b> Instead of reacting to noisy daily headlines, self-directed retirement investors review portfolio weights calmly just <b>2 to 4 times per year</b> across four liquid, low-fee core ETFs (<b>SGOV · SCHD · JEPI · VOO</b>) aligned with our 3-Color Market Weather indicator:
            </p>
            <div class="tom-manual-broker-list">
              <div class="tom-manual-broker-item">
                <strong>🟢 Calm Uptrend Weather (20% SGOV · 35% JEPI+SCHD · 45% VOO):</strong>
                <span>Maintain a 2-year T-Bill cash cushion in <b>SGOV</b> while allowing dividend growth (<b>SCHD</b>), monthly distributions (<b>JEPI</b>), and broad S&amp;P 500 compounding (<b>VOO</b>) to work steadily.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🟡 Cautious Base Weather (30% SGOV · 40% JEPI+SCHD · 30% VOO):</strong>
                <span>When market breadth is mixed, emphasize monthly income and dividend stability while holding 30% in short-term Treasury cash reserves.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🔴 Crash Defense Weather (40% SGOV · 40% JEPI+SCHD · 20% VOO):</strong>
                <span>During elevated market volatility, gently rebalance up to 40% into <b>SGOV</b> / government money-market reserves so 2–3 years of retirement living expenses are insulated from sequence-of-returns drawdowns.</span>
              </div>
            </div>
          </article>

          <article class="tom-manual-chapter" id="tomManualStep3">
            <div class="tom-manual-chapter-tag tag-sky">STEP 3 OF 3 · T-BILL &amp; GOVERNMENT MMF CASH CUSHION</div>
            <h4>401(k) / IRA Cash Cushion: Earning Steady Monthly Money-Market Yield</h4>
            <p>
              <b>Patience Pays Monthly Interest:</b> Holding a 20%–40% safety cushion during uncertain market weather does <i>not</i> mean earning 0%. Parking Bucket 1 cash in short-term US Treasury ETFs (<b>SGOV</b>) or your broker&rsquo;s government <b>Money Market Fund (MMF)</b> collects monthly yield while keeping principal ready:
            </p>
            <div class="tom-manual-broker-list">
              <div class="tom-manual-broker-item">
                <strong>🏦 Fidelity — SPAXX (Fidelity Government Money Market Fund):</strong>
                <span>Default core cash sweep for most Fidelity IRAs and brokerage accounts. Uninvested cash earns monthly government money-market interest automatically.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🏦 Charles Schwab — SWVXX (Schwab Value Advantage Money Fund):</strong>
                <span>In Schwab IRAs or brokerage accounts, tap <b>Trade → Mutual Funds</b> and select <b>SWVXX</b> ($0 transaction fee) for sidelined cash; redemptions settle the next business day.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🏦 Vanguard — VMFXX (Vanguard Federal Money Market Fund):</strong>
                <span>Default Vanguard settlement fund — sidelined cash automatically earns federal money-market yield while you wait calmly between quarterly rebalancing checks.</span>
              </div>
            </div>
          </article>

          <div class="tom-manual-funnel-box no-print-tom">
            <div class="tom-manual-funnel-title">
              🧭 Ready to Use Our Self-Directed Educational Calculators?
            </div>
            <p class="tom-manual-funnel-sub">
              Join our free daily 8:30 AM ET 3-Color Market Weather brief — or explore full VIP Educational Calculator Software access (Monthly $29/mo or Annual $199/yr):
            </p>
            <div class="tom-manual-funnel-btns">
              <button type="button" class="tom-manual-funnel-free" id="btnModalJumpTomFreeSignal">
                📧 Step 1: Join Free 8:30 AM ET Market Weather Brief ($0)
              </button>
              <a
                href="${polarMonthly}"
                class="tom-manual-funnel-paid polar-checkout-button"
                data-polar-checkout
                data-polar-plan="monthly_29"
                data-tom-paid-plan="monthly"
              >
                ⚡ Start Monthly VIP — $29/mo
              </a>
              <a
                href="${polarAnnual}"
                class="tom-manual-funnel-paid is-ltd polar-checkout-button"
                data-polar-checkout
                data-polar-plan="annual_199"
                data-tom-paid-plan="annual"
              >
                👑 Start Annual VIP — $199/yr
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <div class="toast" id="toastBox">Action completed</div>
  `;
}
