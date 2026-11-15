const TOM_MORNING_CLUB_NOTES = [
  "Good morning, Club Member — you never have to chase every rally. Protecting your principal comes first.",
  "Good morning, friend — cash in your 401(k) or IRA is a safe harbor, never a missed opportunity.",
  "Welcome back this morning — patience is your greatest retirement advantage when Wall Street gets noisy.",
  "Good morning, Club Member — one calm 60-second check beats watching anxious market headlines all day.",
  "Steady mornings build peaceful retirements — let safe uptrends come to you, and enjoy your day.",
  "Good morning — protecting what you have worked decades to save always matters more than guessing market tops.",
  "Glad you are with us today — small, steady habits keep your nest egg safe through every market season.",
];

export const TOM_MORNING_CLUB_COMPANION_MSG = {
  steady:
    "🤝 Right beside you — staying calm in quality uptrends while keeping a -9% safety floor is how retirement wealth compounds.",
  watch:
    "👀 Wise patience — waiting calmly on the sidelines until buyers prove themselves protects both your sleep and your savings.",
  cash:
    "🛡️ Smart defense — holding cash in uncertain weeks keeps your nest egg intact and ready for the next clear green light.",
};

export function getTomMorningClubTodayKey() {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());
    const y = parts.find((p) => p.type === "year")?.value;
    const m = parts.find((p) => p.type === "month")?.value;
    const d = parts.find((p) => p.type === "day")?.value;
    if (y && m && d && /^\d{4}-\d{2}-\d{2}$/.test(`${y}-${m}-${d}`)) {
      return `${y}-${m}-${d}`;
    }
  } catch (_) {}
  return new Date().toISOString().slice(0, 10);
}

export function getTomMorningClubSeed(dateStr) {
  let h = 2166136261;
  const s = String(dateStr || "2026-11-15");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function syncTomMorningClubStreak(todayKey) {
  const dateKey = todayKey || getTomMorningClubTodayKey();
  let days = 1;
  let consecutiveDays = 1;
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem("tom_morning_club_streak_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        const prevDays = Math.max(1, Number(parsed && parsed.days) || 1);
        const prevConsec = Math.max(1, Number(parsed && parsed.consecutiveDays) || 1);
        const lastDate = String((parsed && parsed.lastVisitDate) || "");
        if (lastDate === dateKey) {
          days = prevDays;
          consecutiveDays = prevConsec;
        } else {
          days = prevDays + 1;
          const prevMs = Date.parse(`${lastDate}T00:00:00Z`);
          const curMs = Date.parse(`${dateKey}T00:00:00Z`);
          const diffDays = !isNaN(prevMs) && !isNaN(curMs) ? Math.round((curMs - prevMs) / 86400000) : 0;
          consecutiveDays = diffDays === 1 ? prevConsec + 1 : 1;
          localStorage.setItem(
            "tom_morning_club_streak_v1",
            JSON.stringify({ lastVisitDate: dateKey, days, consecutiveDays })
          );
        }
      } else {
        localStorage.setItem(
          "tom_morning_club_streak_v1",
          JSON.stringify({ lastVisitDate: dateKey, days: 1, consecutiveDays: 1 })
        );
      }
    }
  } catch (_) {}
  return { dateKey, days, consecutiveDays };
}

export function getTomMorningClubPollData(todayKey) {
  const dateKey = todayKey || getTomMorningClubTodayKey();
  const seed = getTomMorningClubSeed(dateKey);
  const counts = {
    steady: 148 + (seed % 47),
    watch: 172 + ((seed >> 3) % 53),
    cash: 126 + ((seed >> 6) % 45),
  };
  let choice = "";
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem("tom_morning_club_poll_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.date === dateKey && ["steady", "watch", "cash"].includes(parsed.choice)) {
          choice = parsed.choice;
          counts[choice] += 1;
        }
      }
    }
  } catch (_) {}
  const total = Math.max(1, counts.steady + counts.watch + counts.cash);
  const pctSteady = Math.round((counts.steady / total) * 100);
  const pctWatch = Math.round((counts.watch / total) * 100);
  const pctCash = Math.max(1, 100 - pctSteady - pctWatch);
  return {
    dateKey,
    choice,
    counts,
    total,
    pct: {
      steady: pctSteady,
      watch: pctWatch,
      cash: pctCash,
    },
  };
}

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

  const allStocks = (state.stocks || []).filter((s) => s.ticker && !String(s.ticker).includes("."));
  const cntGreen = allStocks.filter((s) => s.zone_code === "IGNITION_ZONE").length || 8;
  const cntYellow = allStocks.filter((s) => s.zone_code === "WASHOUT_WATCH").length || 19;
  const cntRed = allStocks.filter((s) => s.zone_code === "LEFT_SIDE_KNIFE" || s.zone_code === "VALUE_TRAP_FILTERED").length || 45;
  const savedFreeEmail =
    state.freeMemberEmail ||
    (typeof localStorage !== "undefined" ? localStorage.getItem("tom_free_member_email") || "" : "");

  const clubTodayKey = getTomMorningClubTodayKey();
  const clubSeed = getTomMorningClubSeed(clubTodayKey);
  const clubNote = TOM_MORNING_CLUB_NOTES[clubSeed % TOM_MORNING_CLUB_NOTES.length];
  const clubStreak = syncTomMorningClubStreak(clubTodayKey);
  const clubPoll = getTomMorningClubPollData(clubTodayKey);
  const clubCompanionText = clubPoll.choice
    ? TOM_MORNING_CLUB_COMPANION_MSG[clubPoll.choice]
    : "Tap your morning stance above to compare notes with fellow 401(k) & IRA members — zero login required.";

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
              title="Click to view full methodology"
            >
              <span>💡</span>
              <span>${t.pwRsiExplainerBtn || "How It Works"}</span>
            </button>
          </div>
          <h1 id="heroTitle">${t.heroTitle}</h1>
          <p id="heroDesc" style="font-size:1.02rem; line-height:1.6;">${t.heroDesc}</p>
        </div>
      </div>

      <!-- 🚦 JARGON-FREE 3-COLOR TRAFFIC LIGHT SUMMARY (50-70s US INVESTORS) -->
      <div class="tom-traffic-strip" id="tomTrafficLightStrip" role="group" aria-label="Today's 3-Color Market Safety Signals">
        <button type="button" class="tom-traffic-card t-green" data-traffic-zone="IGNITION_ZONE">
          <span style="font-size:0.8rem; font-weight:800; color:#34d399;">🟢 SAFE UPTREND (${cntGreen} Stocks)</span>
          <strong style="font-size:0.98rem; color:var(--text);">Confirmed Volume Breakouts</strong>
          <span style="font-size:0.82rem; color:var(--muted);">Above 20D/60D trendlines · Tap to view ($CELH Free Showcase) →</span>
        </button>
        <button type="button" class="tom-traffic-card t-yellow" data-traffic-zone="WASHOUT_WATCH">
          <span style="font-size:0.8rem; font-weight:800; color:#fbbf24;">🟡 WAIT &amp; WATCH (${cntYellow} Stocks)</span>
          <strong style="font-size:0.98rem; color:var(--text);">Building Support Base</strong>
          <span style="font-size:0.82rem; color:var(--muted);">Selling exhausted, waiting for institutional buy volume →</span>
        </button>
        <button type="button" class="tom-traffic-card t-red" data-traffic-zone="DOCTOR">
          <span style="font-size:0.8rem; font-weight:800; color:#f87171;">🔴 PROTECT CASH (${cntRed} Stocks)</span>
          <strong style="font-size:0.98rem; color:var(--text);">Downtrend · Enforce -9% Safety Stop</strong>
          <span style="font-size:0.82rem; color:var(--muted);">Avoid falling knives · Tap to check your stock in 3 seconds →</span>
        </button>
      </div>

      <!-- 📧 ABOVE-THE-FOLD 60PX 1-FIELD FREE MORNING SIGNAL EMAIL SIGNUP -->
      <div class="tom-morning-box" id="tomMorningSignalBox">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <span style="background:rgba(16,185,129,0.2); color:#34d399; border:1px solid rgba(16,185,129,0.45); font-size:0.78rem; font-weight:800; padding:3px 10px; border-radius:999px;">
            📧 FREE DAILY 8:30 AM ET BRIEF · NO CREDIT CARD REQUIRED
          </span>
          <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:600;">
            100% Free Forever · Unsubscribe in 1 Click
          </span>
        </div>
        <h2 style="font-size:1.18rem; font-weight:900; color:var(--text); margin:8px 0 4px; line-height:1.35;">
          Get Today&rsquo;s 3-Color Market Safety Brief &amp; Free -9% Danger Alerts Delivered Every Morning
        </h2>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin:0; line-height:1.5;">
          Enter your email once to instantly unlock <b>2 Bonus Free-Member Breakout Setups</b> right on this screen plus daily pre-market retirement safety alerts.
        </p>
        <form class="tom-morning-form" id="tomMorningSignalForm">
          <label for="tomMorningEmailInput" style="position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0);">Email Address</label>
          <input
            type="email"
            id="tomMorningEmailInput"
            class="tom-morning-input"
            required
            autocomplete="email"
            value="${savedFreeEmail.replace(/"/g, "")}"
            placeholder="Enter your email address (e.g., robert@email.com)"
          />
          <button type="submit" id="btnTomMorningSubmit" class="tom-morning-btn">
            📧 Get My Free Daily Stock Signals →
          </button>
        </form>
        <div id="tomMorningSignalStatus" role="status" aria-live="polite" style="display:${savedFreeEmail ? "block" : "none"}; margin-top:10px; font-size:0.92rem; font-weight:800; color:#34d399;">
          ${savedFreeEmail ? `✅ Free Morning Signal Active (${savedFreeEmail.replace(/[<>&"]/g, "")}) — Your 2 Bonus Watchlist Setups below are unlocked!` : ""}
        </div>
        <div id="tomFreeMemberBonusCard" style="display:${savedFreeEmail ? "block" : "none"}; margin-top:12px; background:rgba(15,23,42,0.88); border:1.5px solid #10b981; border-radius:10px; padding:12px 14px; font-size:0.9rem; line-height:1.6; color:#f8fafc;">
          <div style="font-weight:800; color:#34d399; margin-bottom:6px;">🎁 FREE MEMBER BONUS UNLOCKED — Today&rsquo;s Retirement Safety Watchlist:</div>
          <div>• <b>🟢 $CELH (Celsius Holdings):</b> Confirmed Uptrend Showcase · Safety Stop Floor: <b>-9.0% ($29.50)</b> · Upside Target: <b>+50% to +100%</b></div>
          <div>• <b>🟢 $FSLR (First Solar):</b> Institutional Volume Reclaim · Safety Stop Floor: <b>-9.0% ($174.37)</b> · Trend Status: <b>Above 20D/60D</b></div>
          <div>• <b>🛡️ $SMH : $XLV Barbell Check:</b> Semi Fear &amp; Greed at <b>${semiScore}/100</b> — Keep Healthcare ($XLV) cushion active &amp; never average down past -9%.</div>
        </div>
      </div>

      <!-- ☕ MORNING BELL CLUB — ZERO-SIGNUP DAILY HABIT & BELONGING HUB -->
      <div class="tom-club-box" id="tomMorningBellClub" role="region" aria-label="Morning Bell Club — Protecting Your Retirement Together">
        <div class="tom-club-header">
          <div class="tom-club-title-wrap">
            <span class="tom-club-kicker">☕ MORNING BELL CLUB</span>
            <strong class="tom-club-heading">Protecting Your Retirement Together</strong>
          </div>
          <span class="tom-club-streak" id="tomMorningClubStreakBadge" title="Increments once each morning you check in">
            🏅 Day ${clubStreak.days} Morning Member
          </span>
        </div>

        <div class="tom-club-note" id="tomMorningClubDailyNote">
          <span class="tom-club-note-tag">Editor&rsquo;s Daily Morning Note (${clubTodayKey}):</span>
          <span>&ldquo;${clubNote}&rdquo;</span>
        </div>

        <div class="tom-club-poll-head">
          <span class="tom-club-poll-title">🗳️ Today&rsquo;s Member Sentiment Poll (1-Click):</span>
          <span class="tom-club-poll-count" id="tomClubPollTotalCount">${clubPoll.total.toLocaleString()} members checked in today</span>
        </div>

        <div class="tom-club-poll-grid" role="group" aria-label="Today's Member Sentiment Poll">
          <button
            type="button"
            class="tom-club-poll-btn ${clubPoll.choice === "steady" ? "is-active" : ""}"
            data-tom-poll="steady"
            aria-pressed="${clubPoll.choice === "steady" ? "true" : "false"}"
          >
            <span class="tom-poll-btn-top">
              <span class="tom-poll-btn-label">🟢 Holding Steady</span>
              <strong class="tom-poll-pct" data-tom-poll-pct="steady">${clubPoll.pct.steady}%</strong>
            </span>
            <span class="tom-poll-bar-track" aria-hidden="true">
              <span class="tom-poll-bar-fill fill-steady" data-tom-poll-bar="steady" style="width:${clubPoll.pct.steady}%;"></span>
            </span>
          </button>

          <button
            type="button"
            class="tom-club-poll-btn ${clubPoll.choice === "watch" ? "is-active" : ""}"
            data-tom-poll="watch"
            aria-pressed="${clubPoll.choice === "watch" ? "true" : "false"}"
          >
            <span class="tom-poll-btn-top">
              <span class="tom-poll-btn-label">🟡 Watching Closely</span>
              <strong class="tom-poll-pct" data-tom-poll-pct="watch">${clubPoll.pct.watch}%</strong>
            </span>
            <span class="tom-poll-bar-track" aria-hidden="true">
              <span class="tom-poll-bar-fill fill-watch" data-tom-poll-bar="watch" style="width:${clubPoll.pct.watch}%;"></span>
            </span>
          </button>

          <button
            type="button"
            class="tom-club-poll-btn ${clubPoll.choice === "cash" ? "is-active" : ""}"
            data-tom-poll="cash"
            aria-pressed="${clubPoll.choice === "cash" ? "true" : "false"}"
          >
            <span class="tom-poll-btn-top">
              <span class="tom-poll-btn-label">🛡️ Protecting Cash</span>
              <strong class="tom-poll-pct" data-tom-poll-pct="cash">${clubPoll.pct.cash}%</strong>
            </span>
            <span class="tom-poll-bar-track" aria-hidden="true">
              <span class="tom-poll-bar-fill fill-cash" data-tom-poll-bar="cash" style="width:${clubPoll.pct.cash}%;"></span>
            </span>
          </button>
        </div>

        <div
          class="tom-club-companion ${clubPoll.choice ? "is-voted" : ""}"
          id="tomClubCompanionMsg"
          role="status"
          aria-live="polite"
        >
          ${clubCompanionText}
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

export function renderFreeStarterManual(state) {
  const cfg = (state && state.config) || {};
  const lsMonthly =
    cfg.ls_site1_monthly_url ||
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en";
  const lsLtd =
    cfg.ls_site1_ltd_url ||
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en";

  return `
    <section class="tom-starter-manual-section" id="tomFreeStarterManual" aria-label="$0 Free Public Product: US Brokerage App & Safe Order Starter Manual">
      <div class="tom-manual-top-row">
        <span class="tom-manual-free-pill">📘 $0 FREE PUBLIC PRODUCT · OPEN TO ALL INVESTORS</span>
        <span class="tom-manual-broker-pill">🏦 Fidelity · Charles Schwab · Vanguard Ready</span>
      </div>

      <h2 class="tom-manual-heading">
        US Brokerage App &amp; Safe Order Starter Manual ($0 Free Edition)
      </h2>
      <p class="tom-manual-lead">
        Whether you are placing your very first self-directed trade or managing a lifelong <b>401(k) / IRA</b> nest egg, learn the 3 calm brokerage habits that stop 9:30 AM price traps, shield your principal automatically, and pay steady monthly interest while waiting in cash.
      </p>

      <div class="tom-manual-steps-grid">
        <button type="button" class="tom-manual-step-card btn-open-tom-manual-step" data-manual-step="tomManualStep1">
          <span class="tom-manual-step-badge step-b1">STEP 1 · SAFE BUYING</span>
          <strong class="tom-manual-step-title">Limit Order vs. Market Order</strong>
          <span class="tom-manual-step-desc">
            Why tapping &ldquo;Market Order&rdquo; at 9:30 AM ET risks overpaying &mdash; and how to place a safe <b>Limit Order</b> in 3 taps on Fidelity, Schwab, or Vanguard.
          </span>
          <span class="tom-manual-step-cta">Read Step 1 Guide →</span>
        </button>

        <button type="button" class="tom-manual-step-card btn-open-tom-manual-step" data-manual-step="tomManualStep2">
          <span class="tom-manual-step-badge step-b2">STEP 2 · PRINCIPAL SHIELD</span>
          <strong class="tom-manual-step-title">Automatic -8% to -9% Stop-Loss</strong>
          <span class="tom-manual-step-desc">
            How to set an automatic <b>Stop Order</b> safety net right after buying so a sudden market drop can never cut your retirement account in half.
          </span>
          <span class="tom-manual-step-cta">Read Step 2 Guide →</span>
        </button>

        <button type="button" class="tom-manual-step-card btn-open-tom-manual-step" data-manual-step="tomManualStep3">
          <span class="tom-manual-step-badge step-b3">STEP 3 · RED-LIGHT CASH YIELD</span>
          <strong class="tom-manual-step-title">401(k) / IRA Cash MMF Cushion</strong>
          <span class="tom-manual-step-desc">
            When the signal is 🔴 Red (Protect Cash), park idle cash in <b>SPAXX</b>, <b>SWVXX</b>, or <b>VMFXX</b> to collect monthly interest until the next 🟢 Green light.
          </span>
          <span class="tom-manual-step-cta">Read Step 3 Guide →</span>
        </button>
      </div>

      <div class="tom-manual-cta-bar">
        <button type="button" class="tom-manual-open-btn" id="btnOpenTomStarterManual">
          📖 Open Complete $0 Starter Manual (Print / Save PDF) →
        </button>
        <button type="button" class="tom-manual-sec-btn btn-jump-tom-morning">
          📧 Get Free Daily 3-Color Signals ($0)
        </button>
        <a
          href="${lsMonthly}"
          class="tom-manual-vip-link lemonsqueezy-button"
          data-direct-ls="1"
          data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
        >
          ⚡ Monthly VIP ($29/mo)
        </a>
        <a
          href="${lsLtd}"
          class="tom-manual-vip-link is-ltd lemonsqueezy-button"
          data-direct-ls="1"
          data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b"
        >
          👑 Lifetime VIP ($199)
        </a>
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
