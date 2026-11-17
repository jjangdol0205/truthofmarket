export function getLatestUsMarketCloseDate(serverDateStr = "") {
  const baseline = "2026-11-16";
  let candidate = String(serverDateStr || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || candidate < baseline) {
    candidate = baseline;
  }
  try {
    if (typeof Intl !== "undefined") {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(now);
      const getP = (t) => parts.find((p) => p.type === t)?.value || "";
      const y = Number(getP("year"));
      const m = Number(getP("month"));
      const d = Number(getP("day"));
      const wk = getP("weekday");
      const hr = Number(getP("hour"));
      const mn = Number(getP("minute"));
      if (y && m && d) {
        const utcRef = new Date(Date.UTC(y, m - 1, d));
        const afterClose = hr > 16 || (hr === 16 && mn >= 15);
        let backDays = 0;
        if (wk === "Sat") backDays = 1;
        else if (wk === "Sun") backDays = 2;
        else if (!afterClose) {
          backDays = wk === "Mon" ? 3 : 1;
        }
        utcRef.setUTCDate(utcRef.getUTCDate() - backDays);
        const nyCloseIso = utcRef.toISOString().slice(0, 10);
        if (nyCloseIso > candidate) {
          candidate = nyCloseIso;
        }
      }
    }
  } catch (_) {}
  return candidate;
}

export function renderHeader(state) {
  const ov = state.semiOverview;
  const fgNum =
    ov && ov.fg_score !== undefined && ov.fg_score !== null
      ? Number(ov.fg_score)
      : 28.0;
  const closeDate = getLatestUsMarketCloseDate(ov && ov.date ? ov.date : "2026-11-16");

  const weatherStatus =
    fgNum <= 32
      ? { pill: "🔴 Drawdown Guard Active", cls: "tape-down" }
      : fgNum >= 58
      ? { pill: "🟢 Calm Uptrend", cls: "tape-up" }
      : { pill: "🟡 Cautious Breadth", cls: "tape-caution" };

  const allStocks = Array.isArray(state.stocks) ? state.stocks : [];
  const findClose = (tkr, fallback) => {
    const found = allStocks.find((s) => String(s.ticker || "").toUpperCase() === tkr);
    return found && found.close ? Number(found.close).toFixed(2) : fallback;
  };
  const vooPrice = findClose("VOO", "548.60");
  const schdPrice = findClose("SCHD", "29.45");
  const jepiPrice = findClose("JEPI", "59.18");
  const sgovPrice = findClose("SGOV", "100.52");

  const isSubpage =
    typeof window !== "undefined" &&
    (window.__DEFAULT_VIEW__ === "pro_swing" ||
      window.__DEFAULT_VIEW__ === "semi" ||
      (window.location.pathname &&
        window.location.pathname !== "/" &&
        !window.location.pathname.endsWith("/index.html")));

  const homePrefix = isSubpage ? "/" : "";
  const fontPx = Number(state.fontSizePx || 18);

  return `
    <!-- RETIREMENT 4-CORE ETFs & US MARKET WEATHER RIBBON -->
    <div class="market-ribbon" role="region" aria-label="US Retirement 4-Core ETFs and Market Weather">
      <div class="market-ribbon-inner">
        <div class="market-tape">
          <span class="tape-item">
            <span class="tape-sym">$VOO</span>
            <span class="tape-role">(S&amp;P 500 Core)</span>
            <strong class="tape-price">$${vooPrice}</strong>
          </span>
          <span class="tape-sep" aria-hidden="true">&middot;</span>
          <span class="tape-item">
            <span class="tape-sym">$SCHD</span>
            <span class="tape-role">(Dividend Growth ~3.5%)</span>
            <strong class="tape-price">$${schdPrice}</strong>
          </span>
          <span class="tape-sep" aria-hidden="true">&middot;</span>
          <span class="tape-item">
            <span class="tape-sym">$JEPI</span>
            <span class="tape-role">(Monthly Income ~7.4%)</span>
            <strong class="tape-price">$${jepiPrice}</strong>
          </span>
          <span class="tape-sep" aria-hidden="true">&middot;</span>
          <span class="tape-item">
            <span class="tape-sym">$SGOV</span>
            <span class="tape-role">(US T-Bill Cash ~4.7%)</span>
            <strong class="tape-price">$${sgovPrice}</strong>
          </span>
          <span class="tape-sep" aria-hidden="true">|</span>
          <span class="tape-item" id="ribbonWeatherStatus">
            <span class="tape-sym">US Retirement Market Weather (S&amp;P 500 Breadth &amp; Drawdown Guard):</span>
            <span class="${weatherStatus.cls}" style="font-weight:800;">${weatherStatus.pill}</span>
          </span>
        </div>
        <div class="mono ribbon-date-note" id="latestMarketCloseNote">
          ${closeDate} US Market Close
        </div>
      </div>
    </div>

    <!-- CLEAN SENIOR-FRIENDLY TOPBAR (<= 5 CORE NAVIGATION ITEMS) -->
    <header class="topbar">
      <div class="topbar-inner">
        <a href="/" class="brand" id="brandHomeBtn" aria-label="TruthOfMarket Home">
          <span class="brand-mark" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
          </span>
          <span class="brand-name-wrap">
            <span class="brand-title">TruthOfMarket</span>
            <span class="brand-badge" id="brandSubtitle">401(k) &amp; IRA Income Architect</span>
          </span>
        </a>

        <nav class="senior-top-nav" aria-label="Main Retirement Tools Navigation">
          <a href="${homePrefix}#tom-retirement-architect" class="senior-nav-item" id="navIncomeSim">
            30-Sec Income Simulator
          </a>
          <a href="${homePrefix}#tomTrafficLightStrip" class="senior-nav-item" id="navMarketWeather">
            3-Color Market Weather
          </a>
          <a href="${homePrefix}#tomFreeStarterManual" class="senior-nav-item" id="navBrokerGuide">
            $0 Broker Guide
          </a>
          <a href="#pricing" class="senior-nav-item is-vip-link" id="navVipBenefits">
            VIP Benefits
          </a>
          <button
            type="button"
            class="senior-nav-item is-font-btn"
            id="btnToggleTomFont"
            title="Cycle Senior Large-Print Text Size: 18px -> 20px -> 22px"
          >
            Text Size A+${fontPx > 18 ? ` (${fontPx}px)` : ""}
          </button>
        </nav>
      </div>
    </header>
  `;
}
