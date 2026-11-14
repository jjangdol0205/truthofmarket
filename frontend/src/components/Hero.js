export function renderHero(state) {
  const t = state.t;
  const kpis = state.backtestKpis || {};
  const hitRate = Number(kpis.hit_rate_2x_pct ?? 55.24).toFixed(2);
  const underwater = Number(kpis.median_days_underwater ?? 29.0).toFixed(1);
  const netCagr = Number(kpis.cagr_after_tax_pct ?? kpis.us_only_net_cagr_pct ?? 17.81).toFixed(2);
  const severeRisk = Number(kpis.severe_loss_risk_pct ?? 0.93).toFixed(2);
  const ov = state.semiOverview;
  const semiScore =
    ov && ov.fg_score !== undefined && ov.fg_score !== null
      ? Number(ov.fg_score).toFixed(1)
      : "18.3";
  const latestStockDate =
    state.stocks && state.stocks.length > 0 && state.stocks[0].date
      ? state.stocks[0].date
      : ov && ov.date
      ? ov.date
      : "2026-11-13";

  return `
    <section class="hero">
      <div class="hero-top-row">
        <div style="min-width:0; flex:1 1 320px;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
            <div class="hero-tag" id="heroTag" style="margin-bottom:0;">${t.heroTag} · ${latestStockDate}</div>
            <button
              type="button"
              class="btn btn-sm"
              id="btnOpenPwRsiExplainer"
              style="min-height:40px; padding:6px 12px; font-size:0.74rem; font-family:var(--font-mono); font-weight:700; border-color:rgba(56,189,248,0.45); color:#38bdf8; background:rgba(56,189,248,0.1); display:inline-flex; align-items:center; gap:5px; cursor:pointer;"
              title="Click to view full PW-RSI methodology"
            >
              <span>💡</span>
              <span>${t.pwRsiExplainerBtn || "How It Works"}</span>
            </button>
          </div>
          <h1 id="heroTitle">${t.heroTitle}</h1>
          <p id="heroDesc">${t.heroDesc}</p>
        </div>
      </div>

      <!-- 3 BIG INTUITIVE ACTION CARDS / BUTTONS RIGHT ABOVE THE FOLD -->
      <div class="hero-action-grid" role="group" aria-label="Quick Actions">
        <button type="button" class="hero-cta-card primary" id="btnHeroActionSignals">
          <span>📊 View 72 Live Breakout Signals</span>
        </button>
        <button type="button" class="hero-cta-card emerald" id="btnHeroActionDoctor">
          <span>🩺 3-Sec Position Doctor (Check Any Ticker)</span>
        </button>
        <a href="/semi-fear-greed.html" class="hero-cta-card semi" id="btnHeroActionSemiFg">
          <span>🌡️ Live Semi Fear &amp; Greed Index (${semiScore})</span>
        </a>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-emerald">
          <div class="kpi-label" id="kpi1_label">${t.kpi1_label}</div>
          <div class="kpi-val">${hitRate}%</div>
          <div class="kpi-sub" id="kpi1_sub">${t.kpi1_sub}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label" id="kpi2_label">${t.kpi2_label}</div>
          <div class="kpi-val">${underwater}d</div>
          <div class="kpi-sub" id="kpi2_sub">${t.kpi2_sub}</div>
        </div>
        <div class="kpi-card kpi-emerald">
          <div class="kpi-label" id="kpi3_label">${t.kpi3_label}</div>
          <div class="kpi-val">+${netCagr}%</div>
          <div class="kpi-sub" id="kpi3_sub">${t.kpi3_sub}</div>
        </div>
        <div class="kpi-card kpi-amber">
          <div class="kpi-label" id="kpi4_label">${t.kpi4_label}</div>
          <div class="kpi-val">${severeRisk}%</div>
          <div class="kpi-sub" id="kpi4_sub">${t.kpi4_sub}</div>
        </div>
      </div>
    </section>
  `;
}

export function renderEasyProfitSimulator(state) {
  const kpis = state.backtestKpis || {};
  const netCagrStr = Number(kpis.cagr_after_tax_pct ?? kpis.us_only_net_cagr_pct ?? 17.81).toFixed(2);
  const isPro = Boolean(state.isProUnlocked);
  const allStocks = (state.stocks || []).filter(
    (s) =>
      s.ticker &&
      !String(s.ticker).includes(".") &&
      String(s.ticker || "").toUpperCase() !== "LOCKED" &&
      s.close !== null &&
      s.close !== undefined
  );
  const ignStocks = allStocks.filter((s) => s.zone_code === "IGNITION_ZONE");
  const selectableStocks = isPro
    ? ignStocks.length > 0
      ? ignStocks
      : allStocks.slice(0, 12)
    : allStocks.slice(0, 12);

  const defaultTicker = state.easySimTicker || (selectableStocks[0] && selectableStocks[0].ticker) || "CELH";
  const selectedStock =
    allStocks.find((s) => s.ticker === defaultTicker) ||
    selectableStocks[0] || {
      ticker: "CELH",
      name_en: "Celsius Holdings",
      close: 32.42,
      score: 14.2,
      vol_surge_10d: 1.65,
      hist_2x_rate: 62.5,
      zone_code: "IGNITION_ZONE",
    };

  const capUsd = Math.max(500, Number(state.easySimCapUsd || state.proPortfolioUsd || 10000));
  const slotPct = 0.15;
  const slotUsd = Math.round(capUsd * slotPct);
  const entryPrice = Math.max(1, Number(selectedStock.close || 32.42));
  const shares = Math.max(1, Math.floor(slotUsd / entryPrice));
  const actualPositionUsd = Math.round(shares * entryPrice);
  const stopPrice = (entryPrice * 0.91).toFixed(2);
  const maxLossUsd = Math.round(actualPositionUsd * 0.09);
  const target1Price = (entryPrice * 1.5).toFixed(2);
  const profit1Usd = Math.round(actualPositionUsd * 0.5);
  const target2Price = (entryPrice * 2.0).toFixed(2);
  const profit2Usd = Math.round(actualPositionUsd * 1.0);

  const cagrDec = Math.max(0.1, (Number(netCagrStr) || 17.81) / 100);
  const yr1Total = Math.round(capUsd * Math.pow(1 + cagrDec, 1));
  const yr3Total = Math.round(capUsd * Math.pow(1 + cagrDec, 3));
  const yr5Total = Math.round(capUsd * Math.pow(1 + cagrDec, 5));

  const zone = selectedStock.zone_code || "IGNITION_ZONE";
  const plainSignal =
    zone === "IGNITION_ZONE"
      ? {
          badge: "🟢 GREEN REGIME · RIGHT-SIDE IGNITION",
          color: "#34d399",
          bg: "rgba(16,185,129,0.12)",
          border: "rgba(16,185,129,0.4)",
          summary: `Base washout confirmed with institutional volume surge (${Number(selectedStock.vol_surge_10d || 1.5).toFixed(2)}x volume). Historical model applies a -9.0% risk threshold.`,
        }
      : zone === "WASHOUT_WATCH"
      ? {
          badge: "🟡 YELLOW REGIME · BASE CONSOLIDATION",
          color: "#fbbf24",
          bg: "rgba(245,158,11,0.12)",
          border: "rgba(245,158,11,0.4)",
          summary: `Valuation washout detected (PW-RSI ${Number(selectedStock.score || 22).toFixed(1)}), awaiting institutional volume confirmation above moving averages.`,
        }
      : {
          badge: "🔴 RED REGIME · BELOW MA60 DOWNTREND",
          color: "#f87171",
          bg: "rgba(239,68,68,0.12)",
          border: "rgba(239,68,68,0.4)",
          summary: `Left-side downtrend remains active below 20-day & 60-day moving averages. Historical factor filter excludes sub-MA60 trends.`,
        };

  return `
    <section id="easyProfitPlaybookSection" style="margin-bottom:20px; background:linear-gradient(180deg, rgba(16,24,44,0.96) 0%, rgba(10,14,24,0.98) 100%); border:1px solid rgba(52,211,153,0.38); border-radius:8px; padding:16px 18px; box-shadow:0 12px 32px rgba(0,0,0,0.35);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:14px; padding-bottom:12px; border-bottom:1px solid rgba(148,163,184,0.16);">
        <div style="min-width:0;">
          <div style="display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:0.68rem; font-weight:800; color:#34d399; background:rgba(16,185,129,0.14); border:1px solid rgba(16,185,129,0.35); padding:3px 9px; border-radius:999px; margin-bottom:6px;">
            <span>📊</span>
            <span>PLAIN-ENGLISH QUANT METHODOLOGY · ZERO JARGON GUIDE</span>
          </div>
          <h2 style="font-size:1.08rem; font-weight:800; color:#ffffff; margin:0 0 4px 0;">
            How Our Quantitative Factor Model Evaluates Risk &amp; Asymmetric Setups in 3 Steps
          </h2>
          <p style="font-size:0.8rem; color:#cbd5e1; margin:0; line-height:1.5;">
            Explore the <b>3-State Factor Regime</b> below and simulate historical position sizing, -9.0% risk bands, and R-multiple scenarios (educational research only).
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span class="mono" style="font-size:0.7rem; color:#94a3b8; font-weight:700;">SIMULATED CAPITAL:</span>
          ${[5000, 10000, 30000, 100000]
            .map(
              (amt) => `
            <button type="button" class="btn btn-sm btn-easy-cap-preset" data-cap="${amt}" style="min-height:40px; padding:6px 10px; font-size:0.74rem; font-family:var(--font-mono); font-weight:800; background:${
                capUsd === amt ? "rgba(16,185,129,0.22)" : "rgba(15,23,42,0.8)"
              }; border-color:${capUsd === amt ? "#10b981" : "var(--border)"}; color:${capUsd === amt ? "#34d399" : "#cbd5e1"}; cursor:pointer;">
              $${amt.toLocaleString()}
            </button>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- 3-Step Plain-English Traffic-Light Strip -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap:10px; margin-bottom:14px;">
        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(16,185,129,0.28); border-left:3px solid #10b981; border-radius:6px; padding:10px 12px;">
          <div style="font-size:0.72rem; font-weight:800; color:#34d399; font-family:var(--font-mono); margin-bottom:3px;">
            STEP 1 · REGIME FILTER (GREEN STATE)
          </div>
          <div style="font-size:0.8rem; font-weight:700; color:#ffffff; margin-bottom:3px;">
            Isolate &ldquo;IGNITION ZONE&rdquo; Factor Setups
          </div>
          <div style="font-size:0.74rem; color:#94a3b8; line-height:1.45;">
            Identifies post-washout equities (<b>PW-RSI &le; 25</b>) reclaiming moving averages alongside institutional volume expansion (<b>Volume &ge; 1.4x</b>).
          </div>
        </div>

        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(245,158,11,0.28); border-left:3px solid #f59e0b; border-radius:6px; padding:10px 12px;">
          <div style="font-size:0.72rem; font-weight:800; color:#fbbf24; font-family:var(--font-mono); margin-bottom:3px;">
            STEP 2 · DOWNSIDE BOUNDARY (-9% MODEL)
          </div>
          <div style="font-size:0.8rem; font-weight:700; color:#ffffff; margin-bottom:3px;">
            Model a Mechanical -9.0% Risk Threshold
          </div>
          <div style="font-size:0.74rem; color:#94a3b8; line-height:1.45;">
            Unhedged drawdowns (-50%) erode compounding math. Modeling a strict <b>-9.0%</b> invalidation boundary caps simulated single-position portfolio risk at -1.35%.
          </div>
        </div>

        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(56,189,248,0.28); border-left:3px solid #38bdf8; border-radius:6px; padding:10px 12px;">
          <div style="font-size:0.72rem; font-weight:800; color:#38bdf8; font-family:var(--font-mono); margin-bottom:3px;">
            STEP 3 · ASYMMETRIC R-MULTIPLE PROFILE
          </div>
          <div style="font-size:0.8rem; font-weight:700; color:#ffffff; margin-bottom:3px;">
            Historical +50% to +100% Excursion Bands
          </div>
          <div style="font-size:0.74rem; color:#94a3b8; line-height:1.45;">
            Across 2000–2026 empirical data, a <b>55% hit rate</b> with asymmetric payoff yielded <b>+${netCagrStr}%/yr</b> backtested net CAGR (past performance does not guarantee future results).
          </div>
        </div>
      </div>

      <!-- Interactive 1:1 Dollar Action Ticket & Wealth Compounder -->
      <div style="background:#080c15; border:1px solid rgba(56,189,248,0.3); border-radius:6px; padding:12px 14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; max-width:100%;">
            <span class="mono" style="font-size:0.72rem; font-weight:800; color:#38bdf8;">🎯 INTERACTIVE POSITION SIZING &amp; RISK SIMULATOR:</span>
            <select id="easySimTickerSelect" style="min-height:40px; max-width:100%; background:#0f172a; color:#ffffff; border:1px solid #38bdf8; border-radius:4px; padding:6px 8px; font-family:var(--font-mono); font-size:0.76rem; font-weight:700; cursor:pointer;">
              ${selectableStocks
                .map(
                  (s) =>
                    `<option value="${s.ticker}" ${s.ticker === selectedStock.ticker ? "selected" : ""}>$${s.ticker} (${s.name_en || s.ticker}) — $${Number(
                      s.close || 0
                    ).toFixed(2)} [${s.zone_code === "IGNITION_ZONE" ? "🟢 IGNITION" : s.zone_code}]</option>`
                )
                .join("")}
            </select>
            <input
              type="number"
              id="easySimCapitalInput"
              value="${capUsd}"
              min="500"
              step="500"
              style="min-height:40px; width:120px; background:#0f172a; color:#34d399; border:1px solid rgba(16,185,129,0.45); border-radius:4px; padding:6px 8px; font-family:var(--font-mono); font-size:0.76rem; font-weight:800;"
              title="Enter simulated portfolio capital in USD"
            />
          </div>
          <span style="font-family:var(--font-mono); font-size:0.71rem; font-weight:800; color:${plainSignal.color}; background:${plainSignal.bg}; border:1px solid ${plainSignal.border}; padding:4px 9px; border-radius:4px;">
            ${plainSignal.badge}
          </span>
        </div>

        <div style="font-size:0.77rem; color:#e2e8f0; margin-bottom:10px; padding:7px 10px; background:rgba(30,41,59,0.55); border-radius:4px;">
          <b>Quantitative Regime Summary for $${selectedStock.ticker}:</b> ${plainSignal.summary}
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 190px), 1fr)); gap:10px;">
          <div style="background:#0d1424; border:1px solid var(--border); border-radius:5px; padding:9px 11px;">
            <div class="mono" style="font-size:0.66rem; color:var(--muted);">① SIMULATED 15% ALLOCATION SLOT</div>
            <div class="mono" style="font-size:1.05rem; font-weight:800; color:#ffffff; margin-top:3px;">
              $${actualPositionUsd.toLocaleString()} <span style="font-size:0.76rem; color:#38bdf8;">(${shares} shares)</span>
            </div>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">
              Ref Close <b>$${entryPrice.toFixed(2)}</b> · 85% in $SMH/$XLV barbell model
            </div>
          </div>

          <div style="background:#0d1424; border:1px solid rgba(239,68,68,0.3); border-radius:5px; padding:9px 11px;">
            <div class="mono" style="font-size:0.66rem; color:#f87171;">② SIMULATED DRAWDOWN CAP (-9% BAND)</div>
            <div class="mono" style="font-size:1.05rem; font-weight:800; color:#f87171; margin-top:3px;">
              -$${maxLossUsd.toLocaleString()} <span style="font-size:0.74rem; color:#fca5a5;">(Band @ $${stopPrice})</span>
            </div>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">
              Caps simulated impact to <b>-1.35%</b> of $${capUsd.toLocaleString()} model
            </div>
          </div>

          <div style="background:#0d1424; border:1px solid rgba(16,185,129,0.35); border-radius:5px; padding:9px 11px;">
            <div class="mono" style="font-size:0.66rem; color:#34d399;">③ HISTORICAL EXCURSION BAND (+50% / +100%)</div>
            <div class="mono" style="font-size:1.05rem; font-weight:800; color:#34d399; margin-top:3px;">
              +$${profit1Usd.toLocaleString()} ~ +$${profit2Usd.toLocaleString()}
            </div>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">
              +50% Band ($${target1Price}) · 2.0x Band ($${target2Price})
            </div>
          </div>

          <div style="background:#0d1424; border:1px solid rgba(56,189,248,0.35); border-radius:5px; padding:9px 11px;">
            <div class="mono" style="font-size:0.66rem; color:#38bdf8;">④ 5-YR BACKTESTED CAGR MODEL (+${netCagrStr}%/YR)</div>
            <div class="mono" style="font-size:1.05rem; font-weight:800; color:#38bdf8; margin-top:3px;">
              $${capUsd.toLocaleString()} &rarr; $${yr5Total.toLocaleString()}
            </div>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">
              1-Yr: <b>$${yr1Total.toLocaleString()}</b> · 3-Yr: <b>$${yr3Total.toLocaleString()}</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
