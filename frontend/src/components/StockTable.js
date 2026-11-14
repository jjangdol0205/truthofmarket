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
      <div class="controls" style="display:flex; flex-direction:column; gap:6px; width:100%; min-width:0;">
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; width:100%; min-width:0;">
          <div class="search-wrap" style="flex:1 1 135px; min-width:120px;">
            <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              class="search-box"
              id="searchInput"
              placeholder="${t.searchPlaceholder || "Ticker / Sector..."}"
              value="${state.searchQuery || ""}"
              style="min-height:40px; width:100%;"
            />
          </div>

          <select id="sectorFilterSelect" aria-label="Sector Filter" class="search-box" style="min-height:40px; flex:0 1 138px; max-width:165px; padding:6px 6px; font-size:0.72rem; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-sans);">
            <option value="ALL" ${secFilter === "ALL" ? "selected" : ""}>All Sectors (${cAll})</option>
            ${sectorsList
              .map((sec) => {
                const cnt = allStocks.filter(
                  (s) => (SECTOR_REGIME_MAP && SECTOR_REGIME_MAP[s.sector] ? SECTOR_REGIME_MAP[s.sector] : s.sector) === sec
                ).length;
                return `<option value="${sec}" ${secFilter === sec ? "selected" : ""}>${sec} (${cnt})</option>`;
              })
              .join("")}
          </select>

          <button type="button" class="btn btn-sm" id="btnExportVipWatchlistCsv" style="min-height:40px; background:rgba(251,191,36,0.12); border-color:rgba(251,191,36,0.4); color:#fbbf24; font-weight:700; padding:6px 8px; font-size:0.71rem;" title="Download CSV of starred VIP Watchlist tickers">
            ⭐ CSV (${cWatchlist})
          </button>
        </div>

        <div class="filter-tabs" role="tablist" aria-label="Signal Regime Filters">
          <button type="button" class="filter-tab ${f === "ALL" ? "active" : ""}" data-zone="ALL">
            <span>${t.filterAll || "All 72"}</span>
            <span class="tab-count">${cAll}</span>
          </button>
          <button type="button" class="filter-tab ${f === "IGNITION_ZONE" ? "active" : ""}" data-zone="IGNITION_ZONE">
            <span style="width:6px; height:6px; border-radius:50%; background:var(--fin-up); display:inline-block;"></span>
            <span>Turnaround</span>
            <span class="tab-count">${cIgn}</span>
          </button>
          <button type="button" class="filter-tab ${f === "WASHOUT_WATCH" ? "active" : ""}" data-zone="WASHOUT_WATCH">
            <span style="width:6px; height:6px; border-radius:50%; background:var(--fin-amber); display:inline-block;"></span>
            <span>Washout Watch</span>
            <span class="tab-count">${cWatch}</span>
          </button>
          <button type="button" class="filter-tab ${f === "LEFT_SIDE_KNIFE" ? "active" : ""}" data-zone="LEFT_SIDE_KNIFE">
            <span style="width:6px; height:6px; border-radius:50%; background:var(--fin-down); display:inline-block;"></span>
            <span>Downtrend</span>
            <span class="tab-count">${cKnife}</span>
          </button>
          <button type="button" class="filter-tab ${f === "VALUE_TRAP_FILTERED" ? "active" : ""}" data-zone="VALUE_TRAP_FILTERED">
            <span>Value Trap</span>
            <span class="tab-count">${cTrap}</span>
          </button>
          <button type="button" class="filter-tab ${f === "VIP_WATCHLIST" ? "active" : ""}" data-zone="VIP_WATCHLIST" style="border-color:rgba(251,191,36,0.35);">
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
        ${t.softPaywallTitle || "🔒 Pro VIP Ignition Picks & Exact Trigger Levels"}
      </div>
      <p style="color:#cbd5e1; font-size:0.82rem; margin:0 0 12px; line-height:1.5;">
        ${t.softPaywallDesc || "Click any unlocked stock row for factor details, or unlock Pro ($29/mo) to reveal all hidden VIP Ignition tickers, exact MA60 entry triggers, and -9% hard stops."}
      </p>
      <a class="soft-paywall-btn lemonsqueezy-button btn-unlock-row" data-direct-ls="1" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${monthlyUrl}" target="_blank" rel="noopener noreferrer" style="min-height:42px;">
        🔒 ${t.softPaywallUnlockCta || "Unlock Pro ($29/mo)"} →
      </a>
    </div>
  `
      : "";

  return `
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
      <div id="screenerPlainEnglishBar" style="background:rgba(13,20,36,0.9); border-top:1px solid rgba(56,189,248,0.22); padding:7px 12px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px; font-size:0.72rem; color:#cbd5e1;">
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span class="mono" style="background:rgba(56,189,248,0.14); color:#38bdf8; font-weight:800; font-size:0.65rem; padding:2px 6px; border-radius:3px;">📖 QUICK GUIDE</span>
          <span><b style="color:#34d399;">IGNITION:</b> Verified Breakout</span>
          <span style="color:var(--border);">·</span>
          <span><b style="color:#fff;">10d Vol &ge;1.4x:</b> Institutional Flow</span>
          <span style="color:var(--border);">·</span>
          <span class="mono" style="font-size:0.68rem; color:#fbbf24; font-weight:700;">Tap any unlocked stock row for full checklist</span>
        </div>
      </div>
      ${softPaywallBanner}
    </div>
  `;
}

export function renderStockRows(state) {
  const t = state.t || {};
  const stocks = (state.filteredStocks || []).filter((s) => !String(s.ticker).includes("."));
  const lang = state.lang || "en";
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

      const rawZoneLabel = lang === "jp" ? s.zone_label_jp : s.zone_label_en;
      const cleanZoneLabel = String(rawZoneLabel || s.zone_code).replace(/^[🟢🟡🔴⚠️\s]+/, "");
      const stockName = lang === "jp" ? s.name_jp || s.name_en : s.name_en;

      const isMaskedPlaceholder =
        !isPro &&
        (Boolean(s.locked) ||
          String(s.ticker || "").toUpperCase() === "LOCKED" ||
          s.close === null ||
          s.close === undefined);

      if (isMaskedPlaceholder) {
        return `
      <tr data-locked-row="1" class="soft-paywall-row">
        <td>
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; flex-wrap:wrap;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <span class="mono" style="font-weight:800; font-size:0.86rem; color:#fbbf24;">🔒 VIP IGNITION #${idx + 1}</span>
                <span style="font-size:0.62rem; font-family:var(--font-mono); padding:1px 5px; background:rgba(41,98,255,0.16); border:1px solid rgba(41,98,255,0.38); color:#93c5fd; border-radius:3px; font-weight:700;">PRO PICK</span>
              </div>
              <span class="mobile-stock-card-summary mono" style="font-size:0.78rem; font-weight:800; color:var(--fin-up);">Score ${Number(s.score ?? 85)}</span>
            </div>
            <div style="font-size:0.72rem; font-family:var(--font-sans); color:var(--muted); margin-top:2px;">
              Hidden Institutional Breakout · <span style="color:var(--text-secondary);">${s.sector || "US Equity"}</span>
            </div>
            <div class="mobile-stock-card-summary" style="margin-top:8px; padding-top:7px; border-top:1px solid rgba(51,65,85,0.55); align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap;">
              <span class="badge ${badgeClass}">${cleanZoneLabel}</span>
              <a class="btn btn-primary btn-sm lemonsqueezy-button btn-unlock-row" data-direct-ls="1" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthlyUrl}" target="_blank" rel="noopener noreferrer" style="min-height:40px; white-space:nowrap; font-weight:700;">
                🔒 Unlock Pro ($29/mo)
              </a>
            </div>
          </div>
        </td>
        <td>
          <span class="badge ${badgeClass}">${cleanZoneLabel}</span>
          <div class="cond-strip">
            <span class="cond-chip ${s.c1_deep_dd ? "pass" : ""}">DD</span>
            <span class="cond-chip ${(s.c2_off_low ?? s.c2_sweet_spot) ? "pass" : ""}">LOW</span>
            <span class="cond-chip ${(s.c3_above_mas ?? s.c3_ma_reclaim) ? "pass" : ""}">MA</span>
            <span class="cond-chip ${(s.c4_vol_or_mom ?? s.c4_vol_washout) ? "pass" : ""}">VOL</span>
          </div>
        </td>
        <td class="col-num">
          <div style="display:flex; align-items:center; justify-content:flex-end; gap:6px;">
            <div class="score-bar">
              <div class="score-fill" style="width:${Number(s.score ?? 85)}%; background:var(--fin-up);"></div>
            </div>
            <span class="mono" style="font-weight:800; font-size:0.9rem; width:26px; text-align:right; color:var(--fin-up);">${Number(s.score ?? 85)}</span>
          </div>
        </td>
        <td class="col-num"><span class="mono" style="font-weight:700; color:#93c5fd;">🔒 VIP ONLY</span></td>
        <td class="mono col-num" style="color:#94a3b8;">🔒 VIP</td>
        <td class="mono col-num" style="color:#94a3b8;">🔒 VIP</td>
        <td class="mono col-num" style="color:#94a3b8;">🔒 VIP</td>
        <td class="mono col-num" style="color:#34d399; font-weight:700;">&ge;1.40x</td>
        <td class="mono col-num" style="color:#94a3b8;">🔒 VIP</td>
        <td>
          <a class="btn btn-primary btn-sm lemonsqueezy-button btn-unlock-row" data-direct-ls="1" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthlyUrl}" target="_blank" rel="noopener noreferrer" style="min-height:38px; white-space:nowrap; font-weight:700;">
            🔒 Unlock Pro ($29/mo)
          </a>
        </td>
        <td>
          <a class="btn btn-primary btn-sm lemonsqueezy-button btn-unlock-row" data-direct-ls="1" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthlyUrl}" target="_blank" rel="noopener noreferrer" style="min-height:38px; white-space:nowrap; font-weight:700;">
            🔒 Unlock Pro ($29/mo)
          </a>
        </td>
      </tr>
        `;
      }

      const ma20Color = s.vs_ma20_pct >= 0 ? "var(--fin-up)" : "var(--fin-down)";
      const ma60Color = s.vs_ma60_pct >= 0 ? "var(--fin-up)" : "var(--fin-down)";
      const volColor = s.vol_surge_10d >= 1.35 ? "var(--fin-up)" : "var(--text-secondary)";

      const closeVal = Number(s.close || 0);
      const low52 = Number(s.low52 || closeVal * 0.65);
      const high52 = Number(s.high52 || closeVal * 1.5);
      const rangeSpan = Math.max(0.01, high52 - low52);
      const rangePct = Math.min(100, Math.max(2, Math.round(((closeVal - low52) / rangeSpan) * 100)));

      const showTargets =
        isPro ||
        !s.is_pro_locked ||
        (s.entry_trigger_price !== null && s.entry_trigger_price !== undefined);

      const calcTrig = s.entry_trigger_price ?? s.ma60_price ?? Number((closeVal * 1.02).toFixed(2));
      const calcStop = s.stop_loss_price ?? Number((closeVal * 0.91).toFixed(2));
      const calcTp1 = s.tp1_2x_price ?? Number((closeVal * 2.0).toFixed(2));

      const ma60Disp = `$${Number(calcTrig).toFixed(2)}`;
      const stopDisp = `$${Number(calcStop).toFixed(2)}`;
      const tp1Disp = `$${Number(calcTp1).toFixed(2)}`;

      const triggerHtml = showTargets
        ? `<div class="mono" style="font-size:0.75rem; line-height:1.45;">
             <div><span style="color:var(--muted);">TRG</span> <span style="color:#60a5fa; font-weight:700;">${ma60Disp}</span> ${
               !isPro && s.ticker === "CELH"
                 ? `<span style="font-size:0.6rem; padding:1px 4px; background:rgba(14,203,129,0.18); color:var(--fin-up); border-radius:2px; font-weight:700;">FREE SAMPLE</span>`
                 : ""
             }</div>
             <div><span style="color:var(--muted);">STP</span> <span style="color:var(--fin-down); font-weight:600;">${stopDisp}</span> · <span style="color:var(--fin-up);">TP ${tp1Disp}</span></div>
           </div>`
        : `<a class="btn btn-sm lemonsqueezy-button btn-unlock-row" data-direct-ls="1" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthlyUrl}" target="_blank" rel="noopener noreferrer" style="min-height:38px; white-space:nowrap; font-weight:700; border-color:rgba(59,130,246,0.45); color:#93c5fd; background:rgba(37,99,235,0.14);">
             🔒 Unlock Pro ($29/mo)
           </a>`;

      const tvUrl = `https://www.tradingview.com/symbols/${encodeURIComponent(s.ticker)}/?aff_id=${tvAffId}`;
      const saUrl = `https://seekingalpha.com/symbol/${encodeURIComponent(s.ticker)}/earnings?source=${saSource}`;
      const tsUrl = `https://trendspider.com/?_go=${tsAffId}&symbol=${encodeURIComponent(s.ticker)}`;

      const vipWatchlist = state.vipWatchlist || [];
      const isStarred = vipWatchlist.includes(s.ticker);

      return `
      <tr data-ticker="${s.ticker}" class="stock-row-clickable" style="cursor:pointer;">
        <td>
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; flex-wrap:wrap;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <button
                  type="button"
                  class="btn-watchlist-star"
                  data-ticker="${s.ticker}"
                  title="${isStarred ? "Remove from VIP Watchlist" : "Add to VIP Watchlist"}"
                  style="background:none; border:none; cursor:pointer; font-size:0.95rem; padding:2px 4px; line-height:1; color:${isStarred ? "#fbbf24" : "var(--muted)"}; display:inline-flex; align-items:center;"
                >
                  ${isStarred ? "⭐" : "☆"}
                </button>
                <span class="mono" style="font-weight:800; font-size:0.92rem; color:#ffffff;">${s.ticker}</span>
                <span style="font-size:0.62rem; font-family:var(--font-mono); padding:1px 4px; background:#141d2f; border:1px solid #24324d; color:#93c5fd; border-radius:2px;">US</span>
                ${
                  !isPro && s.ticker === "CELH"
                    ? `<span style="font-size:0.6rem; padding:1px 4px; background:rgba(14,203,129,0.18); color:var(--fin-up); border-radius:2px; font-weight:700;">FREE SHOWCASE</span>`
                    : ""
                }
              </div>
              <div class="mobile-stock-card-summary mono" style="align-items:center; gap:8px;">
                <span style="font-weight:800; font-size:0.92rem; color:#ffffff;">$${closeVal.toFixed(2)}</span>
                <span style="font-size:0.74rem; font-weight:800; padding:2px 6px; border-radius:4px; background:rgba(15,23,42,0.9); border:1px solid rgba(148,163,184,0.28); color:${s.score >= 80 ? "var(--fin-up)" : s.score >= 55 ? "var(--fin-amber)" : "var(--fin-down)"};">Score ${Number(s.score ?? 0)}</span>
              </div>
            </div>
            <div style="font-size:0.73rem; font-family:var(--font-sans); color:var(--muted); margin-top:2px;">
              ${stockName} · <span style="color:var(--text-secondary);">${s.sector}</span>
            </div>
            <div class="mobile-stock-card-summary" style="margin-top:8px; padding-top:7px; border-top:1px solid rgba(51,65,85,0.55); align-items:center; justify-content:space-between; gap:6px; flex-wrap:wrap;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <span class="badge ${badgeClass}">${cleanZoneLabel}</span>
                ${
                  showTargets
                    ? `<span class="mono" style="font-size:0.72rem; color:#cbd5e1;">TRG <b style="color:#60a5fa;">${ma60Disp}</b> · STP <b style="color:var(--fin-down);">${stopDisp}</b></span>`
                    : `<span class="mono" style="font-size:0.71rem; color:#93c5fd;">🔒 Pro Trigger &amp; -9% Stop</span>`
                }
              </div>
              <button type="button" class="btn btn-sm btn-open-stock-detail" data-ticker="${s.ticker}" style="min-height:40px; padding:5px 10px; border-color:rgba(56,189,248,0.45); color:#38bdf8; font-weight:700;">
                Details →
              </button>
            </div>
          </div>
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
        <td class="col-num">
          <div style="display:flex; align-items:center; justify-content:flex-end; gap:6px;">
            <div class="score-bar">
              <div class="score-fill" style="width:${Number(s.score ?? 0)}%; background:${
                s.score >= 80 ? "var(--fin-up)" : s.score >= 55 ? "var(--fin-amber)" : "var(--fin-down)"
              };"></div>
            </div>
            <span class="mono" style="font-weight:800; font-size:0.9rem; width:26px; text-align:right;">${Number(s.score ?? 0)}</span>
          </div>
        </td>
        <td class="col-num">
          <div class="mono" style="font-weight:700; color:#ffffff;" title="Latest Close Date: ${s.date || "2026-11-13"}">$${closeVal.toFixed(2)}</div>
          <div class="range-52w-wrap" title="52W Range: $${low52.toFixed(2)} – $${high52.toFixed(2)} | Current: $${closeVal.toFixed(2)}">
            <div class="range-52w-track">
              <div class="range-52w-pin" style="left:${rangePct}%;"></div>
            </div>
            <div class="range-52w-labels">
              <span>$${low52.toFixed(0)}</span>
              <span class="range-52w-curr">${rangePct}%</span>
              <span>$${high52.toFixed(0)}</span>
            </div>
          </div>
        </td>
        <td class="mono col-num" style="color:${s.prox_low52_pct <= 40 && s.prox_low52_pct >= 10 ? "var(--fin-up)" : "var(--text-secondary)"}; font-weight:600;">
          +${Number(s.prox_low52_pct ?? 0).toFixed(1)}%
        </td>
        <td class="mono col-num" style="color:var(--fin-down); font-weight:600;">
          ${Number(s.dd_high52_pct ?? 0).toFixed(1)}%
        </td>
        <td class="mono col-num">
          <span style="color:${ma20Color}; font-weight:600;">${Number(s.vs_ma20_pct ?? 0) >= 0 ? "+" : ""}${Number(s.vs_ma20_pct ?? 0).toFixed(1)}%</span>
          <span style="color:var(--muted);"> / </span>
          <span style="color:${ma60Color}; font-weight:600;">${Number(s.vs_ma60_pct ?? 0) >= 0 ? "+" : ""}${Number(s.vs_ma60_pct ?? 0).toFixed(1)}%</span>
        </td>
        <td class="mono col-num" style="color:${volColor}; font-weight:700;">
          ${Number(s.vol_surge_10d ?? 1.0).toFixed(2)}x
        </td>
        <td class="mono col-num" style="font-weight:700; color:${s.hist_2x_rate >= 40 ? "var(--fin-up)" : "var(--text-secondary)"};">
          ${Number(s.hist_2x_rate ?? 0).toFixed(1)}%
        </td>
        <td>${triggerHtml}</td>
        <td>
          <div style="display:flex; gap:5px; align-items:center;">
            <button type="button" class="btn btn-sm btn-open-stock-detail" data-ticker="${s.ticker}" style="min-height:38px; border-color:rgba(56,189,248,0.45); color:#38bdf8; font-weight:700;">
              Details
            </button>
            <button type="button" class="btn btn-sm btn-share-card" data-ticker="${s.ticker}" style="min-height:38px;" title="Export Institutional Tear Sheet PNG">
              PNG
            </button>
            <a class="btn btn-sm" href="${tvUrl}" target="_blank" rel="noopener noreferrer" style="min-height:38px;" title="Open TradingView Chart (Partner)">
              TV ↗
            </a>
            <a class="btn btn-sm" href="${saUrl}" target="_blank" rel="noopener noreferrer" style="min-height:38px;" title="Open Seeking Alpha Fundamentals (Partner)">
              SA ↗
            </a>
            <a class="btn btn-sm" href="${tsUrl}" target="_blank" rel="noopener noreferrer" title="Open TrendSpider AI Breakout Scanner (Partner)" style="min-height:38px; border-color:rgba(16,185,129,0.4); color:#34d399;">
              TS ↗
            </a>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}
