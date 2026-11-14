import { formatCheckoutUrl } from "../services/api.js";

export function renderHeader(state) {
  const t = state.t;
  const lang = state.lang || "en";
  const isPro = state.isProUnlocked;
  const activeView = state.activeView || "rightside";
  const ov = state.semiOverview;
  const semiScore =
    ov && ov.fg_score !== undefined && ov.fg_score !== null
      ? Number(ov.fg_score).toFixed(1)
      : "18.3";
  const rawRegime = ov
    ? lang === "jp"
      ? ov.regime_jp
      : ov.regime_en
    : "EXTREME FEAR";
  const semiRegime = String(rawRegime || "EXTREME FEAR").toUpperCase();
  const semiDate = ov && ov.date ? ov.date : "2026-11-13";
  const smhPrice = ov && ov.smh_close !== undefined ? Number(ov.smh_close).toFixed(2) : "486.75";
  const xlvPrice = ov && ov.xlv_close !== undefined ? Number(ov.xlv_close).toFixed(2) : "188.85";
  const qqqPrice = ov && ov.qqq_close !== undefined ? Number(ov.qqq_close).toFixed(2) : "679.89";

  const etfs = ov && Array.isArray(ov.etfs) ? ov.etfs : [];
  const qqqEtf = etfs.find((e) => e.ticker === "QQQ");
  const smhEtf = etfs.find((e) => e.ticker === "SMH");
  const xlvEtf = etfs.find((e) => e.ticker === "XLV");

  const qqq1d = qqqEtf && qqqEtf.ret_1d_pct !== undefined ? Number(qqqEtf.ret_1d_pct) : 0.25;
  const smhDd =
    smhEtf && smhEtf.dd_52w_pct !== undefined
      ? Number(smhEtf.dd_52w_pct)
      : ov && ov.smh_dd_pct !== undefined
      ? Number(ov.smh_dd_pct)
      : -29.02;
  const xlv1d = xlvEtf && xlvEtf.ret_1d_pct !== undefined ? Number(xlvEtf.ret_1d_pct) : 0.22;
  const lsMonthlyHref = formatCheckoutUrl(
    state.config?.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
  );
  const ytUrl = state.config?.youtube_url || "https://www.youtube.com/@RightSideAlpha";
  const igUrl = state.config?.instagram_url || "https://www.instagram.com/rightsidealpha";
  const xUrl = state.config?.x_url || "https://x.com/rightsidealpha";
  const tgUrl = isPro
    ? state.config?.telegram_vip_channel_url || state.config?.telegram_channel_url || "https://t.me/truthofmarketss"
    : "#pro-vip-telegram";
  const isAdminMode =
    (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("admin") === "1") ||
    Boolean(state.isAdminAuthenticated);

  return `
    <span id="pro-vip-telegram" style="display:none;" aria-hidden="true"></span>
    <!-- INSTITUTIONAL MARKET TAPE RIBBON -->
    <div class="market-ribbon">
      <div class="market-ribbon-inner">
        <div class="market-tape">
          <span class="universe-pill">
            <span class="universe-dot"></span>
            ${t.marketUniverseTag}
          </span>
          <span class="tape-item">
            <span class="tape-sym">QQQ</span>
            <span>$${qqqPrice}</span>
            <span class="${qqq1d >= 0 ? "tape-up" : "tape-down"}">${qqq1d >= 0 ? "+" : ""}${qqq1d.toFixed(2)}%</span>
          </span>
          <span class="tape-item">
            <span class="tape-sym">SMH</span>
            <span>$${smhPrice}</span>
            <span class="tape-down">${smhDd.toFixed(2)}% DD</span>
          </span>
          <span class="tape-item">
            <span class="tape-sym">XLV</span>
            <span>$${xlvPrice}</span>
            <span class="${xlv1d >= 0 ? "tape-up" : "tape-down"}">${xlv1d >= 0 ? "+" : ""}${xlv1d.toFixed(2)}%</span>
          </span>
          <span class="tape-item" style="cursor:pointer;" id="ribbonSwitchSemi">
            <span class="tape-sym">SEMI FEAR &amp; GREED</span>
            <span class="${Number(semiScore) >= 55 ? "tape-up" : "tape-down"}" style="font-weight:700;">${semiScore} / 100 (${semiRegime})</span>
          </span>
        </div>
        <div class="mono ribbon-date-note" style="font-size:0.68rem; color:var(--muted);">
          LATEST CLOSE (${semiDate}) · NYSE / NASDAQ
        </div>
      </div>
    </div>

    <!-- MAIN INSTITUTIONAL TOPBAR -->
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand-cluster">
          <div class="brand" id="brandHomeBtn">
            <span class="brand-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
            </span>
            <span>${activeView === "semi" ? "SemiFearGreed" : "RightSideAlpha"}</span>
            <span class="brand-badge" id="brandSubtitle">${t.brandSubtitle}</span>
          </div>

          <!-- PLATFORM SWITCHER -->
          <div class="platform-switcher" role="tablist" aria-label="Platform Switcher">
            <button
              type="button"
              class="platform-tab ${activeView === "rightside" ? "active-rsa" : ""}"
              id="navTabRightSide"
              data-view="rightside"
            >
              <span>${t.navRightSide}</span>
              <span class="platform-tab-tag">72 US</span>
            </button>
            <button
              type="button"
              class="platform-tab ${activeView === "semi" ? "active-semi" : ""}"
              id="navTabSemiFg"
              data-view="semi"
            >
              <span>${t.navSemiFg}</span>
              <span class="platform-tab-tag" id="headerSemiScoreTag" style="color:#fca5a5; background:rgba(220,38,38,0.2);">${semiScore}</span>
            </button>
          </div>
        </div>

        <div class="nav-actions">
          <div class="lang-switch" aria-label="Language Selector">
            <button type="button" class="lang-btn ${lang !== "jp" ? "active" : ""}" data-lang="en">EN</button>
            <button type="button" class="lang-btn ${lang === "jp" ? "active" : ""}" data-lang="jp">JP</button>
          </div>

          <span class="badge ${isPro ? "badge-ignition" : "badge-watch"}" id="proStatusBadge">
            ${isPro ? t.statusPro : t.statusFree}
          </span>

          <button type="button" class="btn" id="btnOpenLicense">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span id="btnLicense">${t.btnLicense}</span>
          </button>

          <div class="social-icon-cluster" aria-label="Official Social Channels">
            <a
              class="btn social-btn yt"
              id="headerYoutubeLink"
              href="${ytUrl}"
              target="_blank"
              rel="noopener noreferrer"
              title="Official YouTube (@RightSideAlpha)"
              aria-label="Official YouTube"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/>
              </svg>
            </a>

            <a
              class="btn social-btn ig"
              id="headerInstagramLink"
              href="${igUrl}"
              target="_blank"
              rel="noopener noreferrer"
              title="Official Instagram (@rightsidealpha)"
              aria-label="Official Instagram"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            <a
              class="btn social-btn x"
              id="headerXLink"
              href="${xUrl}"
              target="_blank"
              rel="noopener noreferrer"
              title="Official X (@rightsidealpha)"
              aria-label="Official X"
            >
              <span style="font-weight:700; font-size:0.85rem;">𝕏</span>
            </a>
          </div>

          <a
            class="btn ${isPro ? "" : "btn-gated-vip-tg"}"
            id="headerTelegramLink"
            href="${tgUrl}"
            ${isPro ? 'target="_blank" rel="noopener noreferrer"' : ""}
            title="${isPro ? "Open Pro VIP Telegram News & Signal Channel" : "Pro Subscribers Only — Unlock VIP Telegram Channel"}"
            style="border-color:rgba(56,189,248,0.45); color:#38bdf8;"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span>${isPro ? "👑 VIP TG" : "🔒 VIP TG"}</span>
          </a>

          ${
            isAdminMode
              ? `<button type="button" class="btn" id="btnOpenConfig">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span id="btnAdmin">${t.btnAdmin}</span>
          </button>`
              : ""
          }

          <a
            class="btn btn-primary lemonsqueezy-button"
            id="topSubscribeBtn"
            data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
            href="${lsMonthlyHref}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span id="btnUnlockPro">${t.btnUnlockPro}</span>
          </a>
        </div>
      </div>
    </header>
  `;
}
