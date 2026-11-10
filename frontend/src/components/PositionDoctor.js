export function renderPositionDoctorForm(state) {
  const t = state.t;
  const stocks = state.stocks || [];
  const celh = stocks.find((s) => s.ticker === "CELH");
  const defaultClose = celh ? Number(celh.close).toFixed(2) : "27.93";
  const defaultDate = celh && celh.date ? celh.date : "2026-10-13";
  const initialDoc = state.docLastResult
    ? formatDoctorResult(state.docLastResult, state)
    : `<div style="color:var(--muted);">Enter US ticker, cost basis ($), and trading days held to evaluate asymmetric exit triggers against the latest closing price ($${defaultClose}).</div>`;

  return `
    <div style="background:#090d16; border:1px solid var(--border); border-top:2px solid var(--fin-up); border-radius:4px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:var(--fin-up); letter-spacing:0.05em; text-transform:uppercase;">
          ${t.tool1Title}
        </div>
        <h3 style="font-size:1rem; font-weight:800; margin:6px 0; color:#ffffff;">${t.tool1Sub}</h3>
        <p style="font-size:0.78rem; color:var(--muted); margin-bottom:14px; line-height:1.5;">${t.tool1Desc}</p>

        <div class="doctor-inputs-grid">
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono); text-transform:uppercase;">US Ticker</label>
            <input type="text" id="docTicker" value="CELH" placeholder="CELH" style="padding:7px 9px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono); font-weight:700; width:100%; margin-top:3px;" />
          </div>
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono); text-transform:uppercase;">Cost Basis ($)</label>
            <input type="number" id="docEntry" step="0.01" value="${defaultClose}" placeholder="${defaultClose}" style="padding:7px 9px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono); width:100%; margin-top:3px;" />
          </div>
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono); text-transform:uppercase;">Trading Days</label>
            <input type="number" id="docDays" value="42" placeholder="42" style="padding:7px 9px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono); width:100%; margin-top:3px;" />
          </div>
        </div>

        <div style="display:flex; gap:5px; flex-wrap:wrap; align-items:center; margin-bottom:12px;">
          <span style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">LATEST CLOSE PRESETS (${defaultDate}):</span>
          ${["CELH", "MBLY", "APP", "UPST", "NVDA", "CCL"]
            .map((tick) => {
              const st = stocks.find((x) => x.ticker === tick);
              const pr = st ? ` $${Number(st.close).toFixed(2)}` : "";
              return `
                <button class="btn btn-sm btn-quick-doc mono" data-ticker="${tick}" style="padding:2px 6px; font-size:0.68rem;">${tick}${pr}</button>
              `;
            })
            .join("")}
        </div>
      </div>

      <div>
        <button class="btn btn-primary" id="btnRunPositionDoctor" style="width:100%; justify-content:center; padding:9px;">
          ${t.tool1Btn}
        </button>
        <div id="docOutput" style="margin-top:12px; font-size:0.8rem; background:#05080f; padding:12px; border-radius:4px; border:1px solid var(--border); border-left:3px solid var(--fin-blue);">
          ${initialDoc}
        </div>
      </div>
    </div>
  `;
}

const DOC_VAULT_KEY = "RSA_PRO_VAULT_2026_KEY";

function decodeDocRow(row) {
  if (!row || !row._v) return row;
  try {
    const bin =
      typeof atob === "function"
        ? atob(row._v)
        : typeof Buffer !== "undefined"
        ? Buffer.from(row._v, "base64").toString("binary")
        : "";
    if (!bin) return row;
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i) ^ DOC_VAULT_KEY.charCodeAt(i % DOC_VAULT_KEY.length);
    }
    const jsonStr =
      typeof TextDecoder !== "undefined"
        ? new TextDecoder("utf-8").decode(bytes)
        : decodeURIComponent(escape(String.fromCharCode(...bytes)));
    return { ...row, ...JSON.parse(jsonStr), is_pro_locked: false };
  } catch (_) {
    return row;
  }
}

export function renderDoctorVipUnlockPreview(state) {
  if (!state) return "";
  const isPro = Boolean(state.isProUnlocked);

  const fallbackIgnitions = [
    {
      ticker: "CELH",
      name: "Celsius Holdings",
      sector: "Consumer Beverages",
      score: 84,
      vol_surge_10d: 2.46,
      close: 33.19,
      entry_trigger_price: 29.45,
      stop_loss_price: 30.2,
      hist_2x_rate: 45.8,
      zone_code: "IGNITION_ZONE",
    },
    {
      ticker: "FSLR",
      name: "First Solar Inc",
      sector: "Solar Modules",
      score: 98,
      vol_surge_10d: 3.41,
      close: 191.61,
      entry_trigger_price: 191.02,
      stop_loss_price: 174.37,
      hist_2x_rate: 38.2,
      zone_code: "IGNITION_ZONE",
    },
    {
      ticker: "SOFI",
      name: "SoFi Technologies",
      sector: "Digital Banking",
      score: 98,
      vol_surge_10d: 3.17,
      close: 16.75,
      entry_trigger_price: 16.68,
      stop_loss_price: 15.24,
      hist_2x_rate: 41.5,
      zone_code: "IGNITION_ZONE",
    },
  ];

  let rawList = Array.isArray(state.stocks) && state.stocks.length > 0 ? state.stocks : [];
  let decodedList = rawList.map(decodeDocRow);
  let candidates = decodedList.filter(
    (s) => s && (s.zone_code === "IGNITION_ZONE" || Number(s.score ?? s.pw_score ?? 0) >= 75)
  );
  if (candidates.length < 3) {
    const existingTickers = new Set(candidates.map((s) => s.ticker));
    for (const fb of fallbackIgnitions) {
      if (!existingTickers.has(fb.ticker)) {
        candidates.push(fb);
      }
    }
  }
  const top3 = candidates.slice(0, 3);

  const rowsHtml = top3
    .map((s, idx) => {
      const isPick1 = idx === 0;
      const isPickUnmasked = isPro || isPick1;
      const score = Number(s.score ?? s.pw_score ?? 85);
      const volSurge = Number(s.vol_surge_10d ?? 2.5);
      const sector = s.sector || "Growth Tech";
      const ticker = s.ticker || `PICK#${idx + 1}`;
      const entryPrice =
        s.entry_trigger_price !== undefined && s.entry_trigger_price !== null
          ? Number(s.entry_trigger_price)
          : Number(s.close || 30.0) * 0.98;
      const stopPrice =
        s.stop_loss_price !== undefined && s.stop_loss_price !== null
          ? Number(s.stop_loss_price)
          : Number(s.close || 30.0) * 0.91;

      const tickerHtml = isPickUnmasked
        ? `<span class="mono" style="font-weight:800; color:#ffffff; font-size:0.86rem;">$${ticker}</span>`
        : `<span class="doc-blur-lock blurred-cell mono" style="font-weight:800; font-size:0.86rem; color:#93c5fd; user-select:none;">$${ticker}</span>`;

      const badgeHtml = isPro
        ? `<span class="badge" style="background:rgba(16,185,129,0.2); color:#34d399; font-size:0.62rem; padding:1px 5px; font-weight:700;">PICK #${idx + 1}</span>`
        : isPick1
        ? `<span class="badge" style="background:rgba(59,130,246,0.2); color:#60a5fa; font-size:0.62rem; padding:1px 5px; font-weight:700;">PICK #1 · UNMASKED</span>`
        : `<span class="badge" style="background:rgba(245,158,11,0.2); color:#fbbf24; font-size:0.62rem; padding:1px 5px; font-weight:700;">🔒 PICK #${idx + 1} · VIP LOCKED</span>`;

      const triggerDisp = isPickUnmasked
        ? `<span class="mono" style="color:#60a5fa; font-weight:700;">$${entryPrice.toFixed(2)}</span>`
        : `<span class="doc-blur-lock blurred-cell mono" style="color:#60a5fa; font-weight:700; user-select:none;">$${entryPrice.toFixed(2)}</span>`;

      const stopDisp = isPickUnmasked
        ? `<span class="mono" style="color:var(--fin-down); font-weight:700;">$${stopPrice.toFixed(2)}</span>`
        : `<span class="doc-blur-lock blurred-cell mono" style="color:var(--fin-down); font-weight:700; user-select:none;">$${stopPrice.toFixed(2)}</span>`;

      return `
        <div class="doc-vip-pick-row" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding:8px 10px; background:rgba(9,13,22,0.7); border:1px solid rgba(255,255,255,0.06); border-radius:4px; margin-bottom:6px;">
          <div style="display:flex; align-items:center; gap:8px;">
            ${badgeHtml}
            ${tickerHtml}
            <span style="font-size:0.72rem; color:var(--muted);">${sector}</span>
          </div>
          <div style="display:flex; align-items:center; gap:12px; font-size:0.72rem;">
            <span class="mono" style="color:#34d399; font-weight:700;">PW-RSI ${score}</span>
            <span class="mono" style="color:#94a3b8;">${volSurge.toFixed(2)}x Vol</span>
            <span class="mono" style="color:var(--muted);">TRG ${triggerDisp}</span>
            <span class="mono" style="color:var(--muted);">STP ${stopDisp}</span>
          </div>
        </div>
      `;
    })
    .join("");

  const headerBadge = isPro
    ? `<span class="badge" style="background:rgba(16,185,129,0.2); color:#34d399; font-size:0.65rem; font-weight:800; padding:2px 8px; border:1px solid rgba(16,185,129,0.4);">👑 PRO VIP ACTIVE</span>`
    : `<span class="badge" style="background:rgba(245,158,11,0.2); color:#fbbf24; font-size:0.65rem; font-weight:800; padding:2px 8px; border:1px solid rgba(245,158,11,0.4);">PRO VIP EXCLUSIVE</span>`;

  const checkoutButtonsHtml = !isPro
    ? `
      <div class="doc-vip-action-bar" style="margin-top:12px; display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
        <a href="https://truthofmarket.lemonsqueezy.com/checkout/buy/bad98d00-7175-41f6-9d58-eeb2471d0da4?embed=1"
           class="btn btn-primary lemonsqueezy-button"
           id="btnDocUnlockMonthly"
           style="flex:1; min-width:180px; justify-content:center; padding:9px 12px; font-weight:800; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
          ⚡ Monthly VIP ($29/mo)
        </a>
        <a href="https://truthofmarket.lemonsqueezy.com/checkout/buy/00c9f6e1-c8be-42a4-b5a5-e05af1a41ed9?embed=1"
           class="btn lemonsqueezy-button"
           id="btnDocUnlockLifetime"
           style="flex:1; min-width:180px; justify-content:center; padding:9px 12px; font-weight:800; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color:#000; border:none;">
          💎 Lifetime VIP ($199 · SAVE 43%)
        </a>
      </div>
      <div class="doc-compliance-notice" style="margin-top:8px; font-size:0.66rem; color:var(--muted); text-align:center; font-family:var(--font-mono); line-height:1.4;">
        🔒 Lemon Squeezy Store #296100 Live · PCI-DSS Encrypted · 즉시 영수증 및 라이선스키 발급
      </div>
    `
    : `
      <div class="doc-vip-active-banner" style="margin-top:10px; padding:8px 12px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:4px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span class="mono" style="font-size:0.72rem; color:#34d399; font-weight:700;">
          👑 PRO VIP ACTIVE · All 72 Institutional Breakout Signals Unlocked
        </span>
        <a href="#pro-vault" class="btn btn-sm" style="padding:3px 8px; font-size:0.68rem; border-color:rgba(16,185,129,0.4); color:#34d399;">
          Open Pro Vault →
        </a>
      </div>
    `;

  return `
    <div id="docVipIgnitionPreviewCard" class="doc-vip-preview-card" style="margin-top:14px; padding:12px; background:#070b14; border:1px solid rgba(245,158,11,0.25); border-radius:4px; box-shadow:0 4px 16px rgba(0,0,0,0.4);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:0.85rem;">🔒</span>
          <span class="mono" style="font-size:0.74rem; font-weight:800; color:#fbbf24; letter-spacing:0.03em;">
            기관 매집 돌파 시그널 TOP 3 블러 프리뷰 (REALLOCATION TARGETS)
          </span>
        </div>
        ${headerBadge}
      </div>
      <p style="font-size:0.72rem; color:var(--muted); margin-bottom:10px; line-height:1.4;">
        Exit capital from dead-money or stopped-out positions and immediately rotate into high-conviction right-side ignition breakouts (PW-RSI &ge; 75, 10D Volume Surge &ge; 1.40x).
      </p>
      <div class="doc-vip-picks-list">
        ${rowsHtml}
      </div>
      ${checkoutButtonsHtml}
    </div>
  `;
}

export function formatDoctorResult(result, state = null) {
  let badgeColor = "var(--fin-up)";
  let borderLeftColor = "var(--fin-up)";

  if (result.status_code === "CRITICAL_STOP" || result.status_code === "HARD_STOP" || result.is_critical) {
    badgeColor = "var(--fin-down)";
    borderLeftColor = "var(--fin-down)";
  } else if (result.status_code === "DEAD_MONEY" || result.status_code === "TIME_STOP") {
    badgeColor = "var(--fin-amber)";
    borderLeftColor = "var(--fin-amber)";
  } else if (result.status_code === "TP1_REACHED" || result.status_code === "TP1_HARVEST") {
    badgeColor = "var(--fin-up)";
    borderLeftColor = "var(--fin-up)";
  }

  const cleanLabel = String(result.status_label || result.status_code || "ACTIVE_HOLD").replace(/^[🟢🚨🛑⏳🎯⏰🏆\s]+/, "");
  const retVal = Number(result.return_pct ?? 0);
  const retStr = `${retVal >= 0 ? "+" : ""}${retVal.toFixed(2)}%`;
  const fallbackEntry =
    result.stop_price !== undefined && result.stop_price !== null && Number(result.stop_price) > 0
      ? Number(result.stop_price) / 0.91
      : result.tp1_price !== undefined && result.tp1_price !== null && Number(result.tp1_price) > 0
      ? Number(result.tp1_price) / 2.0
      : 27.93;
  const entryVal =
    result.entry_price !== undefined && result.entry_price !== null && Number(result.entry_price) > 0
      ? Number(result.entry_price)
      : fallbackEntry;
  const currVal =
    result.current_price !== undefined && result.current_price !== null && Number(result.current_price) > 0
      ? Number(result.current_price)
      : entryVal * (1.0 + retVal / 100.0);
  const stopVal = result.stop_price !== undefined && result.stop_price !== null ? Number(result.stop_price) : entryVal * 0.91;
  const tp1Val = result.tp1_price !== undefined && result.tp1_price !== null ? Number(result.tp1_price) : entryVal * 2.0;
  const stopStr = stopVal > 0 ? `$${stopVal.toFixed(2)}` : "$0.00";
  const tp1Str = tp1Val > 0 ? `$${tp1Val.toFixed(2)}` : "$0.00";
  const currStr = currVal > 0 ? `$${currVal.toFixed(2)}` : "$0.00";
  const entryStr = entryVal > 0 ? `$${entryVal.toFixed(2)}` : "$0.00";

  const baseHtml = `
    <div style="border-left: 3px solid ${borderLeftColor}; padding-left: 10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span class="mono" style="font-weight:800; font-size:0.84rem; color:${badgeColor};">
          ${cleanLabel}
        </span>
        <span class="mono" style="font-weight:800; color:${retVal >= 0 ? "var(--fin-up)" : "var(--fin-down)"}; font-size:0.86rem;">
          P&L: ${retStr}
        </span>
      </div>
      <div class="mono" style="font-size:0.73rem; color:#93c5fd; margin-bottom:4px;">
        $${result.ticker || "CELH"} Latest Close: <b style="color:#fff;">${currStr}</b> · Cost Basis: <b style="color:#fff;">${entryStr}</b>
      </div>
      <div style="font-weight:700; color:#ffffff; font-size:0.78rem; margin-bottom:4px;">
        Rule Triggered: ${result.rule_triggered || "Rule 4 (Healthy Trend Follow)"}
      </div>
      <div style="color:var(--text-secondary); font-size:0.78rem; line-height:1.45; margin-bottom:8px;">
        <b>Execution Directive:</b> ${result.action_plan || ""}
      </div>
      <div class="mono" style="display:flex; gap:14px; font-size:0.72rem; color:var(--muted); border-top:1px solid var(--border); padding-top:6px;">
        <span>Hard Stop (-9%): <b style="color:var(--fin-down);">${stopStr}</b></span>
        <span>TP1 Target (2x): <b style="color:var(--fin-up);">${tp1Str}</b></span>
      </div>
    </div>
  `;

  const previewHtml = state ? renderDoctorVipUnlockPreview(state) : "";
  return baseHtml + previewHtml;
}

export function renderPortfolioDoctorForm(state) {
  const isPro = Boolean(state && state.isProUnlocked);
  const defaultPositions = (state && state.portfolioPositions && state.portfolioPositions.length > 0)
    ? state.portfolioPositions
    : [
        { ticker: "CELH", entry_price: 28.5, shares: 100, days_held: 35, current_price: 27.93 },
        { ticker: "CCL", entry_price: 19.2, shares: 200, days_held: 25, current_price: 21.4 },
        { ticker: "TSLA", entry_price: 215.0, shares: 50, days_held: 45, current_price: 228.0 },
        { ticker: "UPST", entry_price: 38.0, shares: 150, days_held: 20, current_price: 44.5 },
      ];

  const totalCap = Number((state && state.proPortfolioUsd) || 50000);
  const outputHtml = (state && state.portfolioDocResult)
    ? formatPortfolioDoctorResult(state.portfolioDocResult, state)
    : `<div style="color:var(--muted); font-size:0.78rem; padding:12px 14px; background:#05080f; border-radius:4px; border:1px solid var(--border); border-left:3px solid var(--fin-blue); line-height:1.5;">
        Enter up to 10 equity positions and click <b>Run VIP Portfolio Diagnostic</b> to evaluate aggregate health score, Rule 1 -9% stop loss risks, 3 macro volatility stress scenarios, and 1.35% risk parity rebalancing directives.
      </div>`;

  return `
    <div style="background:#090d16; border:1px solid var(--border); border-top:2px solid #6366f1; border-radius:4px; padding:18px; margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
        <div>
          <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:#818cf8; letter-spacing:0.05em; text-transform:uppercase;">
            👑 PRO VIP EXCLUSIVE · MULTI-POSITION PORTFOLIO DOCTOR 2.0
          </div>
          <h3 style="font-size:1.05rem; font-weight:800; margin:4px 0; color:#ffffff;">
            Multi-Asset Health Score, 3-Scenario Stress Testing &amp; 1.35% Risk Parity Rebalancer
          </h3>
          <p style="font-size:0.78rem; color:var(--muted); margin:0; line-height:1.5;">
            Audit up to 10 positions simultaneously against Rule 1 (-9% Stop), Rule 2 (55D Time Stop), and Rule 3 (+100% TP1). Volatility stress-test against Semiconductor Fear Shocks and simulate capital reallocation into today's Top 3 Ignition Setups.
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <label class="mono" style="font-size:0.7rem; color:var(--muted);">TOTAL CAPITAL ($ USD):</label>
          <input type="number" id="portTotalCapital" value="${totalCap}" step="5000" min="1000" style="width:110px; padding:5px 8px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono); font-weight:700;" />
        </div>
      </div>

      <!-- 1-Click Preset Buttons Bar -->
      <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center; margin-bottom:12px; background:rgba(13,20,36,0.6); border:1px solid rgba(255,255,255,0.06); padding:8px 10px; border-radius:4px;">
        <span class="mono" style="font-size:0.68rem; color:var(--muted); font-weight:700;">1-CLICK PRESETS:</span>
        <button type="button" class="btn btn-sm btn-quick-port-preset" id="btnLoadPresetIgnition" style="padding:3px 8px; font-size:0.72rem; border-color:rgba(16,185,129,0.4); color:#34d399;">
          🚀 Load Current Ignition Leaders (CELH, CCL, TSLA, UPST)
        </button>
        <button type="button" class="btn btn-sm btn-quick-port-preset" id="btnLoadPresetTech" style="padding:3px 8px; font-size:0.72rem; border-color:rgba(99,102,241,0.4); color:#a5b4fc;">
          💻 Load Sample Tech Basket (NVDA, AMD, PLTR, CRWD)
        </button>
        <button type="button" class="btn btn-sm" id="btnClearPortRows" style="padding:3px 8px; font-size:0.72rem; border-color:rgba(239,68,68,0.4); color:#fca5a5;">
          🗑️ Clear All
        </button>
      </div>

      <!-- Multi-Position Input Grid Table -->
      <div class="table-responsive-scroll" style="margin-bottom:12px;">
        <table class="stock-table" id="portDoctorInputTable" style="font-size:0.78rem; width:100%;">
          <thead>
            <tr>
              <th style="min-width:90px;">US Ticker</th>
              <th style="min-width:110px;">Cost Basis ($)</th>
              <th style="min-width:90px;">Shares</th>
              <th style="min-width:90px;">Days Held</th>
              <th style="min-width:110px;">Current Price ($ Override)</th>
              <th style="width:40px; text-align:center;">Action</th>
            </tr>
          </thead>
          <tbody id="portDoctorTableBody">
            ${defaultPositions
              .map(
                (p, idx) => `
              <tr class="port-input-row" data-row-idx="${idx}">
                <td>
                  <input type="text" class="port-row-ticker" value="${p.ticker || ""}" placeholder="e.g. CELH" style="width:100%; padding:5px 7px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono); font-weight:700; text-transform:uppercase;" />
                </td>
                <td>
                  <input type="number" step="0.01" class="port-row-entry" value="${Number(p.entry_price || 0).toFixed(2)}" placeholder="0.00" style="width:100%; padding:5px 7px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono);" />
                </td>
                <td>
                  <input type="number" step="1" min="1" class="port-row-shares" value="${Number(p.shares || 1)}" placeholder="1" style="width:100%; padding:5px 7px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono);" />
                </td>
                <td>
                  <input type="number" step="1" min="0" class="port-row-days" value="${Number(p.days_held || 0)}" placeholder="0" style="width:100%; padding:5px 7px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono);" />
                </td>
                <td>
                  <input type="number" step="0.01" class="port-row-cur" value="${p.current_price !== undefined && p.current_price !== null && Number(p.current_price) > 0 ? Number(p.current_price).toFixed(2) : ""}" placeholder="Auto (Latest Close)" style="width:100%; padding:5px 7px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono);" />
                </td>
                <td style="text-align:center;">
                  <button type="button" class="btn btn-sm btn-remove-port-row" data-row-idx="${idx}" style="padding:3px 7px; color:#f87171; border-color:rgba(239,68,68,0.3);" title="Remove position">✕</button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
        <button type="button" class="btn btn-sm" id="btnAddPortRow" style="padding:5px 12px; font-size:0.75rem; border-color:rgba(99,102,241,0.45); color:#a5b4fc;">
          ➕ Add Position Row (Up to 10)
        </button>
        <span class="mono" style="font-size:0.7rem; color:var(--muted);" id="portRowCountLabel">
          Active Positions: ${(defaultPositions || []).length} / 10
        </span>
      </div>

      <div>
        <button class="btn btn-primary" id="btnRunPortfolioDoctor" style="width:100%; justify-content:center; padding:10px; font-weight:800; background:linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); border:none;">
          🩺 Run VIP Portfolio Diagnostic &amp; Macro Stress Test
        </button>
      </div>

      <div id="portfolioDocOutput" style="margin-top:14px;">
        ${outputHtml}
      </div>
    </div>
  `;
}

export function formatPortfolioDoctorResult(result, state) {
  if (!result) return "";

  const score = Number(result.health_score ?? 100);
  const scoreColor = score >= 80 ? "#10b981" : score >= 50 ? "#fbbf24" : "#ef4444";
  const scoreLabel = score >= 80 ? "HEALTHY (LOW RISK)" : score >= 50 ? "MODERATE RISK (CAUTION)" : "CRITICAL RISK (IMMEDIATE ACTION)";
  const scoreDesc = score >= 80
    ? "All positions follow mechanical stop-loss rules. Minimal capital at risk."
    : score >= 50
    ? "Dead money holding or stop-loss proximity detected. Rebalancing advised."
    : "Rule 1 -9% Hard Stop breached. Immediate liquidation required to preserve principal.";

  const totalInvested = Number(result.total_invested || 0);
  const totalPnl = Number(result.total_unrealized_pnl || 0);
  const totalPnlPct = Number(result.total_unrealized_pnl_pct || 0);
  const capitalAtRisk = Number(result.capital_at_risk || 0);

  const pnlSign = totalPnl >= 0 ? "+" : "";
  const pnlColor = totalPnl >= 0 ? "var(--fin-up)" : "var(--fin-down)";

  const items = Array.isArray(result.items) ? result.items : [];
  const scenarios = Array.isArray(result.stress_scenarios) ? result.stress_scenarios : [];
  const rebalance = Array.isArray(result.rebalance_recommendations) ? result.rebalance_recommendations : [];

  return `
    <div style="background:#05080f; border:1px solid var(--border); border-radius:4px; padding:16px;">
      <!-- Section 1: Health Score Dial & Aggregate Portfolio KPIs -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:14px;">
        <!-- Gauge Card -->
        <div style="background:#090d16; border:1px solid var(--border); border-left:4px solid ${scoreColor}; border-radius:4px; padding:12px; display:flex; align-items:center; gap:14px;">
          <div style="width:64px; height:64px; border-radius:50%; border:4px solid ${scoreColor}; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0;">
            <span class="mono" style="font-size:1.25rem; font-weight:800; color:${scoreColor}; line-height:1;">${score}</span>
            <span class="mono" style="font-size:0.55rem; color:var(--muted); text-transform:uppercase;">/ 100</span>
          </div>
          <div>
            <div class="mono" style="font-size:0.68rem; color:${scoreColor}; font-weight:800; letter-spacing:0.04em;">${scoreLabel}</div>
            <div style="font-size:0.86rem; font-weight:800; color:#ffffff; margin:2px 0;">Portfolio Health Score</div>
            <div style="font-size:0.72rem; color:var(--muted); line-height:1.35;">${scoreDesc}</div>
          </div>
        </div>

        <!-- Invested & Unrealized PnL -->
        <div style="background:#090d16; border:1px solid var(--border); border-radius:4px; padding:12px; display:flex; flex-direction:column; justify-content:center;">
          <div class="mono" style="font-size:0.68rem; color:var(--muted); text-transform:uppercase;">Total Invested Capital</div>
          <div class="mono" style="font-size:1.15rem; font-weight:800; color:#ffffff; margin:3px 0;">
            $${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div class="mono" style="font-size:0.76rem; color:${pnlColor}; font-weight:700;">
            P&amp;L: ${pnlSign}$${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${pnlSign}${totalPnlPct.toFixed(2)}%)
          </div>
        </div>

        <!-- Capital at Risk against Rule 1 Stop Loss -->
        <div style="background:#090d16; border:1px solid var(--border); border-radius:4px; padding:12px; display:flex; flex-direction:column; justify-content:center;">
          <div class="mono" style="font-size:0.68rem; color:var(--muted); text-transform:uppercase;">Rule 1 Capital at Risk (-9% Stop)</div>
          <div class="mono" style="font-size:1.15rem; font-weight:800; color:#fbbf24; margin:3px 0;">
            $${capitalAtRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style="font-size:0.72rem; color:var(--muted);">
            Max account drawdown if all positions hit their hard stop floor.
          </div>
        </div>
      </div>

      <!-- Section 2: Asset Diagnostic Table -->
      <div style="margin-bottom:16px;">
        <div class="mono" style="font-size:0.7rem; color:var(--fin-up); font-weight:800; letter-spacing:0.04em; margin-bottom:6px; text-transform:uppercase;">
          📋 INDIVIDUAL ASSET DIAGNOSTIC BREAKDOWN (${items.length} POSITIONS)
        </div>
        <div class="table-responsive-scroll">
          <table class="stock-table" style="font-size:0.76rem; width:100%;">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Return %</th>
                <th>Entry Price</th>
                <th>Latest Close</th>
                <th>-9% Hard Stop</th>
                <th>Status Rule</th>
                <th>Actionable Tactical Directive</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map((d) => {
                  let badgeBg = "rgba(16,185,129,0.18)";
                  let badgeColor = "#34d399";
                  let badgeText = "🟢 HOLD (Rule 4)";
                  if (d.status_code === "HARD_STOP") {
                    badgeBg = "rgba(239,68,68,0.22)";
                    badgeColor = "#fca5a5";
                    badgeText = "🛑 HARD STOP (Rule 1)";
                  } else if (d.status_code === "TIME_STOP") {
                    badgeBg = "rgba(251,191,36,0.22)";
                    badgeColor = "#fde047";
                    badgeText = "⏳ 55D TIME STOP (Rule 2)";
                  } else if (d.status_code === "TP1_HARVEST") {
                    badgeBg = "rgba(16,185,129,0.25)";
                    badgeColor = "#6ee7b7";
                    badgeText = "🎯 2X TP1 HARVEST (Rule 3)";
                  }

                  const retVal = Number(d.current_return_pct ?? 0);
                  const retSign = retVal >= 0 ? "+" : "";
                  const retCol = retVal >= 0 ? "var(--fin-up)" : "var(--fin-down)";

                  return `
                    <tr>
                      <td class="mono" style="font-weight:800; color:#ffffff;">$${d.ticker || ""}</td>
                      <td class="mono" style="font-weight:700; color:${retCol};">${retSign}${retVal.toFixed(2)}%</td>
                      <td class="mono">$${Number(d.entry_price || 0).toFixed(2)}</td>
                      <td class="mono">$${Number(d.current_price || 0).toFixed(2)}</td>
                      <td class="mono" style="color:var(--fin-down); font-weight:700;">$${Number(d.hard_stop_price || 0).toFixed(2)}</td>
                      <td>
                        <span class="badge" style="background:${badgeBg}; color:${badgeColor}; font-weight:700; font-size:0.68rem; padding:2px 6px;">
                          ${badgeText}
                        </span>
                      </td>
                      <td style="color:#cbd5e1; font-size:0.74rem;">${d.directive || ""}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 3: Macro Volatility Regime Stress-Testing Cards -->
      <div style="margin-bottom:16px;">
        <div class="mono" style="font-size:0.7rem; color:#60a5fa; font-weight:800; letter-spacing:0.04em; margin-bottom:8px; text-transform:uppercase;">
          ⚡ MACRO VOLATILITY REGIME STRESS-TESTING (3 MARKET SCENARIOS)
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px;">
          ${scenarios
            .map((s) => {
              const pnlVal = Number(s.projected_pnl_pct || 0);
              const pnlSignS = pnlVal >= 0 ? "+" : "";
              const pnlCol = pnlVal >= 0 ? "var(--fin-up)" : "var(--fin-down)";
              const impVal = Number(s.impact_usd || 0);
              const impSign = impVal >= 0 ? "+$" : "-$";

              let verdictBg = "rgba(16,185,129,0.18)";
              let verdictCol = "#34d399";
              if (s.verdict === "Vulnerable") {
                verdictBg = "rgba(239,68,68,0.2)";
                verdictCol = "#fca5a5";
              } else if (s.verdict === "Moderate Risk" || s.verdict === "Neutral") {
                verdictBg = "rgba(251,191,36,0.18)";
                verdictCol = "#fde047";
              }

              return `
                <div style="background:#090d16; border:1px solid var(--border); border-radius:4px; padding:12px; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                      <span class="mono" style="font-size:0.74rem; font-weight:800; color:#ffffff;">${s.name}</span>
                      <span class="badge" style="background:${verdictBg}; color:${verdictCol}; font-size:0.62rem; padding:2px 5px;">
                        ${s.verdict}
                      </span>
                    </div>
                  </div>
                  <div style="margin-top:8px; padding-top:6px; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
                    <span class="mono" style="font-size:0.72rem; color:var(--muted);">Projected P&amp;L:</span>
                    <span class="mono" style="font-size:0.88rem; font-weight:800; color:${pnlCol};">
                      ${pnlSignS}${pnlVal.toFixed(2)}% (${impSign}${Math.abs(impVal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                    </span>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>

      <!-- Section 4: Automated Rebalancing Allocation Breakdown -->
      <div>
        <div class="mono" style="font-size:0.7rem; color:#34d399; font-weight:800; letter-spacing:0.04em; margin-bottom:8px; text-transform:uppercase;">
          🔄 AUTOMATED 1.35% RISK PARITY REBALANCING DIRECTIVES
        </div>
        <div style="background:#090d16; border:1px solid var(--border); border-radius:4px; padding:12px;">
          ${
            rebalance.length === 0
              ? `<div style="color:var(--muted); font-size:0.75rem;">No rebalancing required at this time.</div>`
              : rebalance
                  .map((r) => {
                    const isHarvest = r.action === "HARVEST";
                    const isRealloc = r.action === "REALLOCATE";
                    const actColor = isHarvest ? "#f87171" : isRealloc ? "#34d399" : "#60a5fa";
                    const actBadge = isHarvest ? "🚨 HARVEST CAPITAL" : isRealloc ? "🚀 REALLOCATE" : "✅ MAINTAIN";

                    return `
                      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                        <div style="display:flex; align-items:center; gap:8px;">
                          <span class="badge" style="background:rgba(255,255,255,0.06); color:${actColor}; font-weight:800; font-size:0.65rem;">
                            ${actBadge}
                          </span>
                          <span class="mono" style="font-weight:800; font-size:0.8rem; color:#ffffff;">
                            ${isHarvest ? `$${r.ticker}` : isRealloc ? `→ $${r.target_ticker}` : "Portfolio"}
                          </span>
                          <span style="font-size:0.74rem; color:var(--muted);">
                            ${r.reason || ""} ${r.setup_type ? `[${r.setup_type}]` : ""}
                          </span>
                        </div>
                        <div class="mono" style="font-weight:800; font-size:0.82rem; color:${actColor};">
                          $${Number(r.amount_usd || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          ${r.allocation_pct ? `<span style="font-size:0.7rem; color:var(--muted); font-weight:500;"> (${Number(r.allocation_pct).toFixed(1)}%)</span>` : ""}
                        </div>
                      </div>
                    `;
                  })
                  .join("")
          }
        </div>
      </div>
    </div>
  `;
}

