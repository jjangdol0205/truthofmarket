import { formatCheckoutUrl, SECTOR_REGIME_MAP } from "../services/api.js";

export function renderScreenerControls(state) {
  const t = state.t || {};
  const f = state.zoneFilter || "ALL";
  const secFilter = state.sectorFilter || "ALL";
  const allStocks = (state.stocks || []).filter((s) => !String(s.ticker).includes("."));
  const cAll = allStocks.length;
  const cIgn = allStocks.filter((s) => s.zone_code === "IGNITION_ZONE").length;
  const cWatch = allStocks.filter((s) => s.zone_code === "WASHOUT_WATCH").length;
  const cKnife = allStocks.filter((s) => s.zone_code === "LEFT_SIDE_KNIFE").length;
  const cTrap = allStocks.filter((s) => s.zone_code === "VALUE_TRAP_FILTERED").length;
  const vipList = state.vipWatchlist || [];
  const cWatchlist = allStocks.filter((s) => vipList.includes(s.ticker)).length;

  const sectorsList = [
    "AI & Semiconductors",
    "Cloud & Enterprise Software",
    "Internet & Digital Media",
    "Fintech & Digital Finance",
    "Consumer & Retail",
    "Mobility, EV & CleanTech",
    "Healthcare & Biotechnology",
    "Energy & Industrials",
  ];

  return `
    <div class="screener-header-bar">
      <div class="controls" style="display:flex; flex-direction:column; gap:8px; width:100%;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; width:100%;">
          <div class="search-wrap" style="flex:1; min-width:260px;">
            <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              class="search-box"
              id="searchInput"
              placeholder="${t.searchPlaceholder || "Filter by US Ticker, Company, or Sector..."}"
              value="${state.searchQuery || ""}"
            />
          </div>

          <!-- Sector Regime Matrix Quick Filter & Watchlist CSV Export -->
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <div style="display:flex; align-items:center; gap:5px;">
              <label for="sectorFilterSelect" class="mono" style="font-size:0.68rem; color:var(--muted); font-weight:700;">SECTOR:</label>
              <select id="sectorFilterSelect" class="search-box" style="padding:5px 8px; font-size:0.72rem; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-sans);">
                <option value="ALL" ${secFilter === "ALL" ? "selected" : ""}>All 8 Sectors (${cAll})</option>
                ${sectorsList
                  .map((sec) => {
                    const cnt = allStocks.filter((s) => (SECTOR_REGIME_MAP && SECTOR_REGIME_MAP[s.sector] ? SECTOR_REGIME_MAP[s.sector] : s.sector) === sec).length;
                    return `<option value="${sec}" ${secFilter === sec ? "selected" : ""}>${sec} (${cnt})</option>`;
                  })
                  .join("")}
              </select>
            </div>

            <button type="button" class="btn btn-sm" id="btnExportVipWatchlistCsv" style="background:rgba(251,191,36,0.12); border-color:rgba(251,191,36,0.4); color:#fbbf24; font-weight:700; padding:5px 9px; font-size:0.72rem;" title="Download CSV of starred VIP Watchlist tickers">
              ⭐ Export Watchlist CSV (${cWatchlist})
            </button>
          </div>
        </div>

        <div class="filter-tabs" style="flex-wrap:wrap;">
          <button class="filter-tab ${f === "ALL" ? "active" : ""}" data-zone="ALL">
            <span>${t.filterAll || "All US Equities"}</span>
            <span class="tab-count">${cAll}</span>
          </button>
          <button class="filter-tab ${f === "IGNITION_ZONE" ? "active" : ""}" data-zone="IGNITION_ZONE">
            <span style="width:6px; height:6px; border-radius:50%; background:var(--fin-up); display:inline-block;"></span>
            <span>${t.filterIgnition || "Right-Side Ignition"}</span>
            <span class="tab-count">${cIgn}</span>
          </button>
          <button class="filter-tab ${f === "WASHOUT_WATCH" ? "active" : ""}" data-zone="WASHOUT_WATCH">
            <span style="width:6px; height:6px; border-radius:50%; background:var(--fin-amber); display:inline-block;"></span>
            <span>${t.filterWatch || "Washout Base Watch"}</span>
            <span class="tab-count">${cWatch}</span>
          </button>
          <button class="filter-tab ${f === "LEFT_SIDE_KNIFE" ? "active" : ""}" data-zone="LEFT_SIDE_KNIFE">
            <span style="width:6px; height:6px; border-radius:50%; background:var(--fin-down); display:inline-block;"></span>
            <span>${t.filterKnife || "Downtrend / Avoid"}</span>
            <span class="tab-count">${cKnife}</span>
          </button>
          <button class="filter-tab ${f === "VALUE_TRAP_FILTERED" ? "active" : ""}" data-zone="VALUE_TRAP_FILTERED">
            <span>${t.filterTrap || "Value Trap Excluded"}</span>
            <span class="tab-count">${cTrap}</span>
          </button>
          <button class="filter-tab ${f === "VIP_WATCHLIST" ? "active" : ""}" data-zone="VIP_WATCHLIST" style="border-color:rgba(251,191,36,0.35);">
            <span style="color:#fbbf24; font-size:0.8rem;">⭐</span>
            <span style="color:#fef08a;">VIP Watchlist</span>
            <span class="tab-count" style="background:rgba(251,191,36,0.2); color:#fef08a;">${cWatchlist}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderStockTable(state) {
  const t = state.t;
  const isPro = state.isProUnlocked;
  const stocks = (state.filteredStocks || []).filter((s) => !String(s.ticker).includes("."));
  const cfg = state.config || {};
  const monthlyUrl = formatCheckoutUrl(
    cfg.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
  );

  const renderSortTh = (col, label, isNum = false) => {
    const isAct = state.sortCol === col;
    const chevron = isAct ? (state.sortAsc ? "▲" : "▼") : "↕";
    const actClass = isAct ? `sort-active ${state.sortAsc ? "sort-asc" : "sort-desc"}` : "";
    const numClass = isNum ? "col-num" : "";
    return `<th data-sort="${col}" data-base-label="${label}" class="sort-header ${actClass} ${numClass}">${label} <span class="sort-chevron ${isAct ? "" : "muted"}">${chevron}</span></th>`;
  };

  const softPaywallBanner =
    !isPro && stocks.length > 5
      ? `
    <div class="soft-paywall-barrier">
      <div style="font-size:0.72rem; font-family:var(--font-mono); color:#93c5fd; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">
        ${t.softPaywallTitle || "🔒 67 Pro Ignition Setups Live Today"}
      </div>
      <p style="color:#cbd5e1; font-size:0.84rem; margin:0 0 14px; line-height:1.5;">
        ${t.softPaywallDesc || "Tickers 1–5 are unlocked as featured ignition leaders. Unlock live institutional target levels, -9% stops, and real-time execution signals for all remaining 67 stocks."}
      </p>
      <a class="soft-paywall-btn lemonsqueezy-button btn-unlock-row" data-direct-ls="1" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${monthlyUrl}" target="_blank" rel="noopener noreferrer">
        🍋 ${t.softPaywallUnlockCta || "Unlock 67 Pro Setups ($29/mo)"} →
      </a>
    </div>
  `
      : "";

  return `
    <!-- Plain-English 5-Second Column Cheat Sheet for Everyday Investors -->
    <div id="screenerPlainEnglishBar" style="background:rgba(13,20,36,0.9); border:1px solid rgba(56,189,248,0.22); border-radius:6px; padding:8px 12px; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; font-size:0.73rem; color:#cbd5e1;">
      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
        <span class="mono" style="background:rgba(56,189,248,0.14); color:#38bdf8; font-weight:800; font-size:0.66rem; padding:2px 6px; border-radius:3px;">📖 5s TABLE GUIDE</span>
        <span><b style="color:#34d399;">IGNITION ZONE:</b> Ready to Buy Now</span>
        <span style="color:var(--border);">|</span>
        <span><b style="color:#fff;">PW-RSI (0–100):</b> Lower (&le;25) = Cheaper Bottom</span>
        <span style="color:var(--border);">|</span>
        <span><b style="color:#fff;">10d Vol:</b> &ge;1.4x = Institutions Buying</span>
        <span style="color:var(--border);">|</span>
        <span><b style="color:#fff;">2x Hit Rate:</b> % of Past Signals That Doubled (+100%)</span>
      </div>
      <span class="mono" style="font-size:0.68rem; color:#fbbf24; font-weight:700;">💡 Tip: Click any column header to sort!</span>
    </div>
    <div class="table-wrap">
      <table class="stock-table" id="stockTable">
        <thead>
          <tr>
            ${renderSortTh("ticker", t.colTicker, false)}
            ${renderSortTh("zone_code", t.colZone, false)}
            ${renderSortTh("score", t.colScore, true)}
            ${renderSortTh("close", t.colClose, true)}
            ${renderSortTh("prox_low52_pct", t.colProx, true)}
            ${renderSortTh("dd_high52_pct", t.colDD, true)}
            ${renderSortTh("vs_ma20_pct", t.colMA, true)}
            ${renderSortTh("vol_surge_10d", t.colVol, true)}
            ${renderSortTh("hist_2x_rate", t.colHist, true)}
            <th>${t.colTrigger}</th>
            <th>${t.colActions}</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          ${renderStockRows(state)}
        </tbody>
      </table>
      ${softPaywallBanner}
    </div>
  `;
}

export function renderStockRows(state) {
  const t = state.t || {};
  const stocks = (state.filteredStocks || []).filter((s) => !String(s.ticker).includes("."));
  const lang = state.lang;
  const isPro = state.isProUnlocked;
  const cfg = state.config || {};
  const lsMonthlyUrl = formatCheckoutUrl(
    cfg.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
  );
  const tvAffId = encodeURIComponent(cfg.tradingview_aff_id || "1173809");
  const saSource = encodeURIComponent(cfg.seekingalpha_source || "better_life333");
  const tsAffId = encodeURIComponent(cfg.trendspider_aff_id || "rightside");

  if (!stocks.length) {
    return `
      <tr>
        <td colspan="11" style="text-align:center; padding:36px; color:var(--muted); font-family:var(--font-sans);">
          No US-listed equities match the active filter criteria.
        </td>
      </tr>
    `;
  }

  return stocks
    .map((s, idx) => {
      let badgeClass = "badge-watch";
      if (s.zone_code === "IGNITION_ZONE") badgeClass = "badge-ignition";
      else if (s.zone_code === "LEFT_SIDE_KNIFE") badgeClass = "badge-knife";
      else if (s.zone_code === "VALUE_TRAP_FILTERED") badgeClass = "badge-trap";

      const rawZoneLabel =
        lang === "jp" ? s.zone_label_jp : lang === "kr" ? s.zone_label_kr : s.zone_label_en;
      const cleanZoneLabel = String(rawZoneLabel || s.zone_code).replace(/^[🟢🟡🔴⚠️\s]+/, "");
      const stockName =
        lang === "jp" ? s.name_jp : lang === "kr" ? s.name_kr : s.name_en;

      const ma20Color = s.vs_ma20_pct >= 0 ? "var(--fin-up)" : "var(--fin-down)";
      const ma60Color = s.vs_ma60_pct >= 0 ? "var(--fin-up)" : "var(--fin-down)";
      const volColor = s.vol_surge_10d >= 1.35 ? "var(--fin-up)" : "var(--text-secondary)";

      // 52W range bar calculation
      const low52 = Number(s.low52 || 0);
      const high52 = Number(s.high52 || s.close * 1.5);
      const closeVal = Number(s.close || 0);
      const rangeSpan = Math.max(0.01, high52 - low52);
      const rangePct = Math.min(100, Math.max(2, Math.round(((closeVal - low52) / rangeSpan) * 100)));

      // Soft paywall rule:
      // Unmasked free sample leader(s) (e.g. #1 CELH) are fully readable/interactive;
      // masked feed rows (ticker === "LOCKED") and rows 6–72 render cleanly as Pro-locked setups without $LOCKED/$0.00 placeholders.
      const isMaskedPlaceholder =
        !isPro &&
        (Boolean(s.locked) ||
          Boolean(s.is_pro_locked) ||
          String(s.ticker || "").toUpperCase() === "LOCKED");
      const isFeaturedLeader = idx < 5 && !isMaskedPlaceholder;
      const isFreeSample = isFeaturedLeader;
      const isReadable = isPro || isFreeSample;
      const isSoftBlurred = !isReadable;
      const blurClass = isSoftBlurred ? "blurred-cell" : "";

      const calcTrig = s.entry_trigger_price ?? s.ma60_price ?? Number((closeVal * 1.02).toFixed(2));
      const calcStop = s.stop_loss_price ?? Number((closeVal * 0.91).toFixed(2));
      const calcTp1 = s.tp1_2x_price ?? Number((closeVal * 2.0).toFixed(2));
      const showTargets = isReadable;

      const ma60Disp = `$${Number(calcTrig).toFixed(2)}`;
      const stopDisp = `$${Number(calcStop).toFixed(2)}`;
      const tp1Disp = `$${Number(calcTp1).toFixed(2)}`;

      const triggerHtml = showTargets
        ? `<div class="mono" style="font-size:0.75rem; line-height:1.45;">
             <div><span style="color:var(--muted);">TRG</span> <span style="color:#60a5fa; font-weight:700;">${ma60Disp}</span> ${
               !isPro && isFeaturedLeader
                 ? `<span style="font-size:0.6rem; padding:1px 4px; background:rgba(14,203,129,0.18); color:var(--fin-up); border-radius:2px; font-weight:700;">FEATURED #${idx + 1}</span>`
                 : ""
             }</div>
             <div><span style="color:var(--muted);">STP</span> <span style="color:var(--fin-down); font-weight:600;">${stopDisp}</span> · <span style="color:var(--fin-up);">TP ${tp1Disp}</span></div>
           </div>`
        : `<span class="pro-lock-cell btn-unlock-row" title="Unlock Pro to view exact Entry Trigger, -9% Stop & +100% Target">
             <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
               <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
               <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
             </svg>
             <span>🔒 PRO TARGETS</span>
           </span>`;

      const tvUrl = `https://www.tradingview.com/symbols/${encodeURIComponent(s.ticker)}/?aff_id=${tvAffId}`;
      const saUrl = `https://seekingalpha.com/symbol/${encodeURIComponent(s.ticker)}/earnings?source=${saSource}`;
      const tsUrl = `https://trendspider.com/?_go=${tsAffId}&symbol=${encodeURIComponent(s.ticker)}`;

      const vipWatchlist = state.vipWatchlist || [];
      const isStarred = vipWatchlist.includes(s.ticker);

      const tickerCellHtml = isMaskedPlaceholder
        ? `<div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="mono" style="font-weight:800; font-size:0.86rem; color:#93c5fd;">🔒 VIP #${idx + 1}</span>
              <span style="font-size:0.62rem; font-family:var(--font-mono); padding:1px 4px; background:#141d2f; border:1px solid #24324d; color:#93c5fd; border-radius:2px;">US</span>
              <span style="font-size:0.6rem; padding:1px 5px; background:rgba(41,98,255,0.14); border:1px solid rgba(41,98,255,0.35); color:#93c5fd; border-radius:2px; font-family:var(--font-mono); font-weight:700;">PRO IGNITION #${idx + 1}</span>
            </div>
            <div style="font-size:0.72rem; font-family:var(--font-sans); color:var(--muted); margin-top:2px;">
              Pro Institutional Signal · <span style="color:var(--text-secondary);">${s.sector || "US Equity"}</span>
            </div>
          </div>`
        : `<div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button
            type="button"
            class="btn-watchlist-star"
            data-ticker="${s.ticker}"
            title="${isStarred ? "Remove from VIP Watchlist" : "Add to VIP Watchlist"}"
            style="background:none; border:none; cursor:pointer; font-size:0.92rem; padding:0; line-height:1; vertical-align:middle; color:${isStarred ? "#fbbf24" : "var(--muted)"}; display:inline-flex; align-items:center;"
          >
            ${isStarred ? "⭐" : "☆"}
          </button>
          <span class="mono" style="font-weight:800; font-size:0.9rem; color:#ffffff;">${s.ticker}</span>
          <span style="font-size:0.62rem; font-family:var(--font-mono); padding:1px 4px; background:#141d2f; border:1px solid #24324d; color:#93c5fd; border-radius:2px;">US</span>
          ${
            !isPro
              ? isFeaturedLeader
                ? `<span style="font-size:0.6rem; padding:1px 4px; background:rgba(14,203,129,0.18); color:var(--fin-up); border-radius:2px; font-weight:700;">${idx === 0 || s.ticker === "CELH" ? "FREE SAMPLE #1 · FEATURED #1" : `FEATURED #${idx + 1}`}</span>`
                : `<span style="font-size:0.6rem; padding:1px 5px; background:rgba(41,98,255,0.14); border:1px solid rgba(41,98,255,0.35); color:#93c5fd; border-radius:2px; font-family:var(--font-mono); font-weight:700;">PRO SETUP #${idx + 1}</span>`
              : ""
          }
        </div>
        <div style="font-size:0.73rem; font-family:var(--font-sans); color:var(--muted); margin-top:2px;">
          ${stockName} · <span style="color:var(--text-secondary);">${s.sector}</span>
        </div>
      </div>`;

      const closeCellHtml =
        isMaskedPlaceholder || s.close === null || s.close === undefined
          ? `<div class="mono" style="font-weight:700; color:#93c5fd;">🔒 VIP</div>`
          : `<div class="mono" style="font-weight:700; color:#ffffff;" title="Latest Close Date: ${s.date || "2026-10-30"}">$${closeVal.toFixed(2)}</div>
             <div class="range-52w-wrap" title="52W Range: $${low52.toFixed(2)} – $${high52.toFixed(2)} | Current: $${closeVal.toFixed(2)}">
               <div class="range-52w-track">
                 <div class="range-52w-pin" style="left:${rangePct}%;"></div>
               </div>
               <div class="range-52w-labels">
                 <span>$${low52.toFixed(0)}</span>
                 <span class="range-52w-curr">${rangePct}%</span>
                 <span>$${high52.toFixed(0)}</span>
               </div>
             </div>`;

      return `
      <tr data-ticker="${s.ticker}" class="${isSoftBlurred ? "soft-paywall-row" : ""}">
        <td>
          ${tickerCellHtml}
        </td>
        <td>
          <span class="badge ${badgeClass}">${cleanZoneLabel}</span>
          <div class="cond-strip">
            <span class="cond-chip ${s.c1_deep_dd ? "pass" : ""}" title="52W High Drawdown <= -20%">DD</span>
            <span class="cond-chip ${(s.c2_off_low ?? s.c2_sweet_spot) ? "pass" : ""}" title="52W Low Proximity 10-45%">LOW</span>
            <span class="cond-chip ${(s.c3_above_mas ?? s.c3_ma_reclaim) ? "pass" : ""}" title="Reclaimed MA20/MA60">MA</span>
            <span class="cond-chip ${(s.c4_vol_or_mom ?? s.c4_vol_washout) ? "pass" : ""}" title="10D Volume Washout >= 1.3x">VOL</span>
          </div>
        </td>
        <td class="col-num ${blurClass}">
          <div style="display:flex; align-items:center; justify-content:flex-end; gap:6px;">
            <div class="score-bar">
              <div class="score-fill" style="width:${Number(s.score ?? 0)}%; background:${
                s.score >= 80 ? "var(--fin-up)" : s.score >= 55 ? "var(--fin-amber)" : "var(--fin-down)"
              };"></div>
            </div>
            <span class="mono" style="font-weight:800; font-size:0.9rem; width:26px; text-align:right;">${Number(s.score ?? 0)}</span>
          </div>
        </td>
        <td class="col-num ${blurClass}">
          ${closeCellHtml}
        </td>
        <td class="mono col-num ${blurClass}" style="color:${s.prox_low52_pct <= 40 && s.prox_low52_pct >= 10 ? "var(--fin-up)" : "var(--text-secondary)"}; font-weight:600;">
          +${Number(s.prox_low52_pct ?? 0).toFixed(1)}%
        </td>
        <td class="mono col-num ${blurClass}" style="color:var(--fin-down); font-weight:600;">
          ${Number(s.dd_high52_pct ?? 0).toFixed(1)}%
        </td>
        <td class="mono col-num ${blurClass}">
          <span style="color:${ma20Color}; font-weight:600;">${Number(s.vs_ma20_pct ?? 0) >= 0 ? "+" : ""}${Number(s.vs_ma20_pct ?? 0).toFixed(1)}%</span>
          <span style="color:var(--muted);"> / </span>
          <span style="color:${ma60Color}; font-weight:600;">${Number(s.vs_ma60_pct ?? 0) >= 0 ? "+" : ""}${Number(s.vs_ma60_pct ?? 0).toFixed(1)}%</span>
        </td>
        <td class="mono col-num ${blurClass}" style="color:${volColor}; font-weight:700;">
          ${Number(s.vol_surge_10d ?? 1.0).toFixed(2)}x
        </td>
        <td class="mono col-num ${blurClass}" style="font-weight:700; color:${s.hist_2x_rate >= 40 ? "var(--fin-up)" : "var(--text-secondary)"};">
          ${Number(s.hist_2x_rate ?? 0).toFixed(1)}%
        </td>
        <td>${triggerHtml}</td>
        <td>
          <div style="display:flex; gap:5px;">
            ${
              isSoftBlurred
                ? `<a class="btn btn-primary btn-sm lemonsqueezy-button btn-unlock-row" data-direct-ls="1" href="${lsMonthlyUrl}" target="_blank" rel="noopener noreferrer" style="white-space:nowrap; font-weight:700;">
                     🔒 ${t.softPaywallUnlockCta || "Unlock 67 Pro Setups ($29/mo)"}
                   </a>`
                : `
            <button class="btn btn-sm btn-share-card" data-ticker="${s.ticker}" title="Export Institutional Tear Sheet PNG">
              PNG
            </button>
            <a class="btn btn-sm" href="${tvUrl}" target="_blank" rel="noopener noreferrer" title="Open TradingView Chart (Partner)">
              TV ↗
            </a>
            <a class="btn btn-sm" href="${saUrl}" target="_blank" rel="noopener noreferrer" title="Open Seeking Alpha Fundamentals (Partner)">
              SA ↗
            </a>
            <a class="btn btn-sm" href="${tsUrl}" target="_blank" rel="noopener noreferrer" title="Open TrendSpider AI Breakout Scanner (Partner)" style="border-color:rgba(16,185,129,0.4); color:#34d399;">
              TS ↗
            </a>
            `
            }
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}
