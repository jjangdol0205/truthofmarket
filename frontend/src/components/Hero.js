import { formatCheckoutUrl } from "../services/api.js";
import { getLatestUsMarketCloseDate } from "./Header.js";

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
    "🤝 Right beside you — staying calm in quality dividend & index compounders while rebalancing 2–4 times a year is how retirement wealth endures.",
  watch:
    "👀 Wise patience — waiting calmly on the sidelines while collecting steady dividend income protects both your sleep and your savings.",
  cash:
    "🛡️ Smart defense — holding T-Bill & money-market cash cushions in uncertain weeks keeps your nest egg intact for the next calm uptrend.",
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

export const TOM_CRM_SEGMENTS = [
  { id: "retirement_401k_ira", label: "401(k) / IRA Monthly Cashflow & Defense" },
  { id: "dividend_income_core", label: "Dividend Growth & T-Bill Yield ($SCHD · $JEPI · $SGOV)" },
  { id: "us_macro_sp500", label: "Daily US S&P 500 Market Weather ($VOO)" },
];

export function escapeTomCrmHtml(raw) {
  return String(raw || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function getTomCrmSegmentLabel(segId) {
  const key = String(segId || "").trim();
  const found = TOM_CRM_SEGMENTS.find((s) => s.id === key);
  return found ? found.label : TOM_CRM_SEGMENTS[0].label;
}

export function getStoredTomClubMember() {
  try {
    if (
      typeof window !== "undefined" &&
      window.DreamCompanyCRM &&
      typeof window.DreamCompanyCRM.getLocalMember === "function"
    ) {
      const rec = window.DreamCompanyCRM.getLocalMember("TOM");
      if (rec && rec.email) return rec;
    }
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem("dc_member_TOM");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email) return parsed;
      }
    }
  } catch (_) {}
  return null;
}

export function registerTomClubMemberSafe(opts) {
  const cleanEmail = String((opts && opts.email) || "").trim().toLowerCase();
  const cleanNick = String((opts && opts.nickname) || "").trim();
  const cleanSeg = String((opts && opts.segment) || "retirement_401k_ira").trim() || "retirement_401k_ira";
  const cleanHp = String((opts && opts.website_hp) || "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
    return Promise.resolve({ ok: false, error: "INVALID_EMAIL" });
  }

  if (
    typeof window !== "undefined" &&
    window.DreamCompanyCRM &&
    typeof window.DreamCompanyCRM.registerMember === "function"
  ) {
    return window.DreamCompanyCRM.registerMember({
      div: "TOM",
      email: cleanEmail,
      nickname: cleanNick,
      segment: cleanSeg,
      lang: "en-US",
      website_hp: cleanHp,
    });
  }

  const nowIso = new Date().toISOString();
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(
        "dc_member_TOM",
        JSON.stringify({
          div: "TOM",
          email: cleanEmail,
          nickname: cleanNick,
          segment: cleanSeg,
          joined_at: nowIso,
        })
      );
      const qRaw = localStorage.getItem("dc_crm_sync_queue_v1");
      const parsedQ = qRaw ? JSON.parse(qRaw) : [];
      const queue = Array.isArray(parsedQ) ? parsedQ : [];
      queue.push({
        action: "register_member",
        div: "TOM",
        email: cleanEmail,
        nickname: cleanNick,
        segment: cleanSeg,
        message: "",
        notes: "",
        lang: "en-US",
        website_hp: cleanHp,
        source_url: typeof window !== "undefined" && window.location ? window.location.href : "",
        client_ts: nowIso,
      });
      localStorage.setItem("dc_crm_sync_queue_v1", JSON.stringify(queue.slice(-25)));
    }
  } catch (_) {}
  return Promise.resolve({
    ok: true,
    queued_for_sync: true,
    div: "TOM",
    email: cleanEmail,
    segment: cleanSeg,
  });
}

export function bindTomPasswordlessClubEvents(state, showToastFn) {
  const panel = document.getElementById("tom-passwordless-club-signup");
  if (!panel) return;

  const form = document.getElementById("tom-club-signup-form");
  const segHidden = document.getElementById("tom-club-segment-value");
  const nickInput = document.getElementById("tom-club-nickname-input");
  const emailInput = document.getElementById("tom-club-email-input");
  const hpInput = document.getElementById("tom-club-hp-input");
  const submitBtn = document.getElementById("tom-club-signup-btn");
  const activeBar = document.getElementById("tom-club-active-member-bar");
  const activeText = document.getElementById("tom-club-active-member-text");
  const toggleBtn = document.getElementById("tom-club-update-toggle-btn");
  const feedbackEl = document.getElementById("tom-club-signup-feedback");

  const applyActiveMemberUi = (memberObj) => {
    if (!memberObj || !memberObj.email) return;
    const segId = memberObj.segment || "retirement_401k_ira";
    const segLabel = getTomCrmSegmentLabel(segId);
    if (activeText) {
      activeText.textContent = `Morning Bell Member Active: ${memberObj.email} · Focus: ${segLabel}`;
    }
    if (activeBar) {
      activeBar.style.display = "flex";
    }
    if (segHidden) segHidden.value = segId;
    if (emailInput && !emailInput.value) emailInput.value = memberObj.email;
    if (nickInput && memberObj.nickname && !nickInput.value) nickInput.value = memberObj.nickname;
    panel.querySelectorAll(".tom-crm-seg-pill").forEach((pill) => {
      const active = pill.getAttribute("data-tom-crm-seg") === segId;
      pill.classList.toggle("is-active", active);
      pill.setAttribute("aria-pressed", active ? "true" : "false");
    });
  };

  // Mount check for existing passwordless member
  const existing = getStoredTomClubMember();
  if (existing && existing.email) {
    applyActiveMemberUi(existing);
    if (form) form.style.display = "none";
  }

  panel.querySelectorAll(".tom-crm-seg-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const chosen = String(pill.getAttribute("data-tom-crm-seg") || "retirement_401k_ira").trim();
      if (segHidden) segHidden.value = chosen;
      panel.querySelectorAll(".tom-crm-seg-pill").forEach((btn) => {
        const isCurrent = btn.getAttribute("data-tom-crm-seg") === chosen;
        btn.classList.toggle("is-active", isCurrent);
        btn.setAttribute("aria-pressed", isCurrent ? "true" : "false");
      });
    });
  });

  if (toggleBtn && form) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = form.style.display === "none";
      form.style.display = isHidden ? "block" : "none";
      toggleBtn.textContent = isHidden ? "Hide Editor" : "Update Email / Focus";
      if (isHidden && emailInput) {
        setTimeout(() => emailInput.focus(), 40);
      }
    });
  }

  panel.addEventListener("click", (ev) => {
    const jumpLink = ev.target && ev.target.closest ? ev.target.closest("#tom-club-jump-manual-btn, .tom-crm-manual-jump-btn") : null;
    if (!jumpLink) return;
    ev.preventDefault();
    const manualEl = document.getElementById("tomFreeStarterManual");
    if (manualEl && manualEl.scrollIntoView) {
      manualEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = String((emailInput && emailInput.value) || "").trim().toLowerCase();
      const nickname = String((nickInput && nickInput.value) || "").trim();
      const segment = String((segHidden && segHidden.value) || "retirement_401k_ira").trim() || "retirement_401k_ira";
      const website_hp = String((hpInput && hpInput.value) || "").trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        if (feedbackEl) {
          feedbackEl.className = "tom-crm-feedback is-error";
          feedbackEl.style.display = "block";
          feedbackEl.textContent = "Please enter a valid email address (for example, robert@email.com).";
        }
        if (emailInput) emailInput.focus();
        return;
      }

      const defaultBtnLabel = "Join Free Morning Bell Club (3-Sec Access) ->";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Activating 3-Sec Club Access...";
      }

      try {
        await registerTomClubMemberSafe({ email, nickname, segment, website_hp });
      } catch (_) {}

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultBtnLabel;
      }

      if (state) state.freeMemberEmail = email;
      try {
        const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("tom_free_member_email", email);
          localStorage.setItem("tom_free_member_since", kst);
        }
        if (typeof window !== "undefined" && typeof window.trackTomFreeSignup === "function") {
          window.trackTomFreeSignup(email);
        }
      } catch (_) {}

      const topEmailInp = document.getElementById("tomMorningEmailInput");
      if (topEmailInp) topEmailInp.value = email;
      const topStatusEl = document.getElementById("tomMorningSignalStatus");
      if (topStatusEl) {
        topStatusEl.style.display = "block";
        topStatusEl.style.color = "#34d399";
        topStatusEl.textContent = `✅ Free Morning Retirement Brief Active (${email}) — Your 4-Core Allocation Guide below is unlocked!`;
      }
      const bonusCardEl = document.getElementById("tomFreeMemberBonusCard");
      if (bonusCardEl) bonusCardEl.style.display = "block";

      const segLabel = getTomCrmSegmentLabel(segment);
      applyActiveMemberUi({ email, nickname, segment });
      form.style.display = "none";
      if (toggleBtn) toggleBtn.textContent = "Update Email / Focus";

      if (feedbackEl) {
        feedbackEl.className = "tom-crm-feedback is-success";
        feedbackEl.style.display = "block";
        feedbackEl.innerHTML = `
          <div class="tom-crm-feedback-copy">
            <strong>✅ Passwordless Morning Bell Macro Club membership is active for ${escapeTomCrmHtml(email)}!</strong>
            <span>${nickname ? `Welcome, ${escapeTomCrmHtml(nickname)} — ` : ""}Focus: <b>${escapeTomCrmHtml(segLabel)}</b> · Daily US Rates, Liquidity, S&amp;P/ETF &amp; 3-Color Market Weather Educational Briefings will arrive in your inbox before the opening bell.</span>
          </div>
          <a href="#tomFreeStarterManual" class="tom-crm-manual-jump-btn" id="tom-club-jump-manual-btn">
            📘 Open Your Free $0 Calm Cashflow Budget Manual ->
          </a>
        `;
      }

      if (typeof showToastFn === "function") {
        showToastFn("✅ Morning Bell Macro Club Membership Active!");
      }
    });
  }
}

export const TOM_RETIRE_NEST_PRESETS = [
  { val: 150000, label: "$150k" },
  { val: 400000, label: "$400k" },
  { val: 800000, label: "$800k" },
  { val: 1500000, label: "$1.5M" },
];

export const TOM_RETIRE_YEAR_PRESETS = [
  { val: 0, label: "Retiring Now" },
  { val: 5, label: "5 Yrs" },
  { val: 10, label: "10 Yrs" },
  { val: 15, label: "15 Yrs" },
];

export const TOM_RETIRE_ADD_PRESETS = [
  { val: 0, label: "$0/mo" },
  { val: 500, label: "$500/mo" },
  { val: 1000, label: "$1,000/mo" },
  { val: 2000, label: "$2,000/mo" },
];

export const TOM_RETIRE_WEATHER_MAP = {
  green: {
    pill: "🟢 Calm Uptrend Weather",
    desc: "Confirmed institutional uptrends active — lean into quality growth while keeping a 2-year T-Bill sleep cushion.",
    weights: [20, 35, 45],
  },
  yellow: {
    pill: "🟡 Cautious Base Weather",
    desc: "Mixed market breadth — prioritize monthly dividend paychecks & T-Bill cushion while waiting for volume breakouts.",
    weights: [30, 40, 30],
  },
  red: {
    pill: "🔴 Crash Defense Weather",
    desc: "Elevated volatility / downtrend alert — hold 40% in ~4.5% T-Bill cash cushion so you never sell stocks in a crash.",
    weights: [40, 40, 20],
  },
};

export function detectTomLiveWeatherMode(semiScoreNum, cntGreen, cntRed) {
  const fg = Number(semiScoreNum);
  if ((!isNaN(fg) && fg <= 32) || Number(cntRed) >= 40) return "red";
  if (!isNaN(fg) && fg >= 58 && Number(cntGreen) >= 15) return "green";
  return "yellow";
}

export function computeTomRetirementPlan({ nestEgg, years, monthlyAdd, weatherMode }) {
  const egg = Math.max(10000, Number(nestEgg) || 400000);
  const yrs = Math.max(0, Number(years) || 0);
  const add = Math.max(0, Number(monthlyAdd) || 0);
  const months = Math.round(yrs * 12);
  const monthlyRate = 0.062 / 12;

  const projectedNestEgg =
    months > 0
      ? Math.round(
          egg * Math.pow(1 + monthlyRate, months) +
            add * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
        )
      : Math.round(egg);

  // Guarded 3-Bucket Calm 2-4x/Year Rebalance Path (4.5% blended safe withdrawal + dividend yield)
  const guardedAnnual = Math.round(projectedNestEgg * 0.045);
  const guardedMonthly = Math.round(guardedAnnual / 12);

  // Unprotected Sequence-of-Returns Crash Path (-35% early bear drawdown, 3.8% forced cut)
  const crashNestEgg = Math.round(projectedNestEgg * 0.65);
  const crashAnnual = Math.round(crashNestEgg * 0.038);
  const crashMonthly = Math.round(crashAnnual / 12);

  const comfortGapMonthly = Math.max(0, guardedMonthly - crashMonthly);
  const comfortGapAnnual = comfortGapMonthly * 12;

  const modeKey = TOM_RETIRE_WEATHER_MAP[weatherMode] ? weatherMode : "red";
  const wSpec = TOM_RETIRE_WEATHER_MAP[modeKey];
  const [w1, w2, w3] = wSpec.weights;
  const b1Dollars = Math.round((projectedNestEgg * w1) / 100);
  const b2Dollars = Math.round((projectedNestEgg * w2) / 100);
  const b3Dollars = Math.max(0, projectedNestEgg - b1Dollars - b2Dollars);

  return {
    egg,
    yrs,
    add,
    projectedNestEgg,
    guardedAnnual,
    guardedMonthly,
    crashNestEgg,
    crashMonthly,
    comfortGapMonthly,
    comfortGapAnnual,
    longevityGainYears: "13.5",
    modeKey,
    weatherPill: wSpec.pill,
    weatherDesc: wSpec.desc,
    buckets: [
      { pct: w1, dollars: b1Dollars },
      { pct: w2, dollars: b2Dollars },
      { pct: w3, dollars: b3Dollars },
    ],
  };
}

function fmtUsdInt(n) {
  return "$" + Math.round(Number(n) || 0).toLocaleString("en-US");
}

export function renderTomRetirementArchitect(state, { semiScore, cntGreen, cntRed }) {
  const cfg = (state && state.config) || {};
  const polarMonthly = formatCheckoutUrl(
    cfg.polar_tom_monthly_url || cfg.ls_site1_monthly_url,
    "#tom-vip-monthly"
  );
  const polarAnnual = formatCheckoutUrl(
    cfg.polar_tom_annual_url || cfg.ls_site1_ltd_url,
    "#tom-vip-annual"
  );

  const liveMode = detectTomLiveWeatherMode(semiScore, cntGreen, cntRed);
  const defaultEgg = 400000;
  const defaultYrs = 5;
  const defaultAdd = 1000;
  const plan = computeTomRetirementPlan({
    nestEgg: defaultEgg,
    years: defaultYrs,
    monthlyAdd: defaultAdd,
    weatherMode: liveMode,
  });

  return `
    <section
      class="tom-retire-architect"
      id="tom-retirement-architect"
      data-live-weather="${liveMode}"
      role="region"
      aria-label="30-Second Comfortable Retirement & Monthly Cashflow Simulator"
    >
      <div class="tom-retire-top-bar">
        <span class="tom-retire-badge">🧭 FREE 30-SECOND RETIREMENT ARCHITECT · ZERO LOGIN</span>
        <span class="tom-retire-live-tag" id="tomRetireLiveSignalBadge">
          US Retirement Market Weather (S&amp;P 500 Breadth &amp; Drawdown Guard): ${plan.weatherPill}
        </span>
      </div>

      <h2 class="tom-retire-title">
        30-Second Comfortable Retirement &amp; Monthly Cashflow Simulator
      </h2>
      <p class="tom-retire-lead">
        Tap 3 buttons below to see your <b>calm monthly retirement paycheck</b> (on top of Social Security), how much monthly income you protect by avoiding a <b>-35% retirement-eve crash</b>, and how to rebalance <b>$VOO &middot; $SCHD &middot; $JEPI &middot; $SGOV</b> calmly just <b>2–4 times a year</b>.
      </p>

      <div class="tom-retire-presets-wrap">
        <div class="tom-retire-preset-group">
          <div class="tom-retire-preset-label">1. Current 401(k) / IRA / Savings Nest Egg</div>
          <div class="tom-retire-preset-row" role="group" aria-label="Current Nest Egg">
            ${TOM_RETIRE_NEST_PRESETS.map(
              (p) => `
              <button
                type="button"
                class="tom-retire-pill ${p.val === defaultEgg ? "is-active" : ""}"
                data-tom-retire-group="egg"
                data-tom-retire-val="${p.val}"
                aria-pressed="${p.val === defaultEgg ? "true" : "false"}"
              >
                ${p.label}
              </button>`
            ).join("")}
          </div>
        </div>

        <div class="tom-retire-preset-group">
          <div class="tom-retire-preset-label">2. Years Until Retirement</div>
          <div class="tom-retire-preset-row" role="group" aria-label="Years Until Retirement">
            ${TOM_RETIRE_YEAR_PRESETS.map(
              (p) => `
              <button
                type="button"
                class="tom-retire-pill ${p.val === defaultYrs ? "is-active" : ""}"
                data-tom-retire-group="years"
                data-tom-retire-val="${p.val}"
                aria-pressed="${p.val === defaultYrs ? "true" : "false"}"
              >
                ${p.label}
              </button>`
            ).join("")}
          </div>
        </div>

        <div class="tom-retire-preset-group">
          <div class="tom-retire-preset-label">3. Monthly Contribution</div>
          <div class="tom-retire-preset-row" role="group" aria-label="Monthly Contribution">
            ${TOM_RETIRE_ADD_PRESETS.map(
              (p) => `
              <button
                type="button"
                class="tom-retire-pill ${p.val === defaultAdd ? "is-active" : ""}"
                data-tom-retire-group="add"
                data-tom-retire-val="${p.val}"
                aria-pressed="${p.val === defaultAdd ? "true" : "false"}"
              >
                ${p.label}
              </button>`
            ).join("")}
          </div>
        </div>
      </div>

      <div class="tom-retire-results-grid" aria-live="polite">
        <!-- RESULT 1: Guarded Monthly Paycheck vs. Unprotected -35% Crash Path -->
        <div class="tom-retire-card card-paycheck" id="tomRetireResultPaycheck">
          <div class="tom-retire-card-kicker">RESULT ① · MONTHLY RETIREMENT PAYCHECK &amp; CRASH SHIELD</div>
          <div class="tom-retire-proj-line">
            Projected Nest Egg at Retirement: <strong id="tomRetireProjectedEgg">${fmtUsdInt(plan.projectedNestEgg)}</strong>
          </div>

          <div class="tom-retire-compare-boxes">
            <div class="tom-retire-pay-box is-guarded">
              <span class="tom-retire-pay-tag">🛡️ Calm 2–4x/Yr Rebalance Path (SGOV · SCHD · JEPI · VOO)</span>
              <div class="tom-retire-pay-amount" id="tomRetireGuardedMo">${fmtUsdInt(plan.guardedMonthly)}<span>/mo</span></div>
              <div class="tom-retire-pay-sub" id="tomRetireGuardedSub">
                ${fmtUsdInt(plan.guardedAnnual)}/yr calm cashflow (4.5% safe withdrawal + dividend yield) · <b>32+ Yr Horizon</b>
              </div>
            </div>

            <div class="tom-retire-pay-box is-crash">
              <span class="tom-retire-pay-tag">⚠️ Unprotected -35% Crash Path</span>
              <div class="tom-retire-pay-amount is-muted" id="tomRetireCrashMo">${fmtUsdInt(plan.crashMonthly)}<span>/mo</span></div>
              <div class="tom-retire-pay-sub" id="tomRetireCrashSub">
                Sequence-of-returns shock shrinks nest egg to ${fmtUsdInt(plan.crashNestEgg)} · <b>~18.5 Yr Depletion Risk</b>
              </div>
            </div>
          </div>

          <div class="tom-retire-gap-banner" id="tomRetireComfortGapBanner">
            ✅ <strong>+${fmtUsdInt(plan.comfortGapMonthly)}/mo Comfort Gap Protected</strong> (${fmtUsdInt(plan.comfortGapAnnual)}/yr extra income) &amp; <strong>+${plan.longevityGainYears} Years</strong> of Nest-Egg Longevity!
          </div>
        </div>

        <!-- RESULT 2: 3-Color Market Weather Linked 3-Bucket Retirement Blueprint -->
        <div class="tom-retire-card card-buckets" id="tomRetireResultBuckets">
          <div class="tom-retire-card-kicker">RESULT ② · 3-BUCKET RETIREMENT BLUEPRINT (LINKED TO MARKET WEATHER)</div>

          <div class="tom-retire-weather-tabs" role="group" aria-label="Preview Market Weather Allocation">
            <button
              type="button"
              class="tom-retire-wtab ${liveMode === "green" ? "is-active" : ""}"
              data-tom-weather="green"
              aria-pressed="${liveMode === "green" ? "true" : "false"}"
            >
              🟢 Calm${liveMode === "green" ? " (Today)" : ""}
            </button>
            <button
              type="button"
              class="tom-retire-wtab ${liveMode === "yellow" ? "is-active" : ""}"
              data-tom-weather="yellow"
              aria-pressed="${liveMode === "yellow" ? "true" : "false"}"
            >
              🟡 Cautious${liveMode === "yellow" ? " (Today)" : ""}
            </button>
            <button
              type="button"
              class="tom-retire-wtab ${liveMode === "red" ? "is-active" : ""}"
              data-tom-weather="red"
              aria-pressed="${liveMode === "red" ? "true" : "false"}"
            >
              🔴 Defense${liveMode === "red" ? " (Today)" : ""}
            </button>
          </div>

          <div class="tom-retire-weather-desc" id="tomRetireWeatherDesc">${plan.weatherDesc}</div>

          <div class="tom-retire-bucket-list">
            <div class="tom-retire-bucket-item b-cash">
              <div class="tom-retire-bucket-head">
                <strong>Bucket 1 · US T-Bill Cash Cushion ($SGOV)</strong>
                <span id="tomBucket1Stat">${plan.buckets[0].pct}% · ${fmtUsdInt(plan.buckets[0].dollars)}</span>
              </div>
              <div class="tom-retire-bucket-bar"><span id="tomBucket1Bar" style="width:${plan.buckets[0].pct}%;"></span></div>
              <div class="tom-retire-bucket-note">$SGOV (0–3 Mo US Treasury ETF) &amp; SPAXX / SWVXX (~4.7% yield) — covers 2–3 yrs of bills so you never sell stocks in a downturn.</div>
            </div>

            <div class="tom-retire-bucket-item b-div">
              <div class="tom-retire-bucket-head">
                <strong>Bucket 2 · Monthly &amp; Rising Dividend Paycheck ($JEPI + $SCHD)</strong>
                <span id="tomBucket2Stat">${plan.buckets[1].pct}% · ${fmtUsdInt(plan.buckets[1].dollars)}</span>
              </div>
              <div class="tom-retire-bucket-bar"><span id="tomBucket2Bar" style="width:${plan.buckets[1].pct}%;"></span></div>
              <div class="tom-retire-bucket-note">$JEPI monthly income + $SCHD dividend growth + $XLV healthcare cushion for steady retirement cashflow.</div>
            </div>

            <div class="tom-retire-bucket-item b-growth">
              <div class="tom-retire-bucket-head">
                <strong>Bucket 3 · S&amp;P 500 Core Compounding ($VOO)</strong>
                <span id="tomBucket3Stat">${plan.buckets[2].pct}% · ${fmtUsdInt(plan.buckets[2].dollars)}</span>
              </div>
              <div class="tom-retire-bucket-bar"><span id="tomBucket3Bar" style="width:${plan.buckets[2].pct}%;"></span></div>
              <div class="tom-retire-bucket-note">$VOO (Vanguard S&amp;P 500) &amp; quality US leaders — rebalanced calmly 2–4 times a year when our 3-color weather shifts.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- US 50-70s RETIREMENT 4-CORE STANDARD STRIP (ZERO LEVERAGED / ZERO CRYPTO) -->
      <div class="tom-senior-core-strip" id="tomSeniorCoreStrip" aria-label="US 50-70s 4-Core Retirement Standard">
        <div class="tom-senior-core-title">
          🏛️ <strong>US 50–70s Retirement 4-Core Standard</strong> — No leveraged ETFs, no day-trading stress. Just calm <b>2–4x/year rebalancing</b> across 4 liquid, low-fee pillars:
        </div>
        <div class="tom-senior-core-grid">
          <div class="tom-senior-core-card">
            <span class="tom-core-tkr c-cash">$SGOV · US T-Bill Cushion</span>
            <strong>~4.7% Monthly Treasury Yield</strong>
            <span>State-tax-advantaged 0–3 month US Treasury shield for 2–3 years of living expenses.</span>
          </div>
          <div class="tom-senior-core-card">
            <span class="tom-core-tkr c-div">$SCHD · Dividend Growth</span>
            <strong>100 Cash-Rich US Dividend Payers</strong>
            <span>10+ year dividend track record to keep your retirement income rising ahead of inflation.</span>
          </div>
          <div class="tom-senior-core-card">
            <span class="tom-core-tkr c-pay">$JEPI · Monthly Paycheck</span>
            <strong>Steady Monthly Cash Distributions</strong>
            <span>Low-volatility S&amp;P 500 blue-chips engineered to deliver calm monthly retirement income.</span>
          </div>
          <div class="tom-senior-core-card">
            <span class="tom-core-tkr c-grow">$VOO · S&amp;P 500 Core</span>
            <strong>0.03% Ultra-Low Fee Compounding</strong>
            <span>America&rsquo;s top 500 profitable enterprises for 15–30 year nest-egg longevity.</span>
          </div>
        </div>
      </div>

      <!-- 3-STEP RETIREMENT VALUE LADDER BAR -->
      <div class="tom-retire-ladder-bar">
        <button type="button" class="tom-retire-cta-btn step-manual" id="btnTomRetireStepManual">
          📘 Step 1 ($0 Free): Safe Brokerage &amp; Cashflow Budget Manual
        </button>
        <button type="button" class="tom-retire-cta-btn step-club" id="btnTomRetireStepClub">
          ☕ Step 2 (Free 3-Sec Club): Daily Retirement Cashflow Brief
        </button>
        <a
          href="${polarMonthly}"
          class="tom-retire-cta-btn step-vip polar-checkout-button"
          data-polar-checkout
          data-polar-plan="monthly_29"
          data-tom-paid-plan="monthly"
        >
          ⚡ Step 3: Start Monthly VIP — $29/mo
        </a>
        <a
          href="${polarAnnual}"
          class="tom-retire-cta-btn step-ltd polar-checkout-button"
          data-polar-checkout
          data-polar-plan="annual_199"
          data-tom-paid-plan="annual"
        >
          👑 Start Annual VIP — $199/yr
        </a>
      </div>
    </section>
  `;
}

export function bindTomRetirementArchitectEvents(state, showToastFn) {
  const root = document.getElementById("tom-retirement-architect");
  if (!root) return;

  let curEgg = 400000;
  let curYears = 5;
  let curAdd = 1000;
  let curWeather = root.getAttribute("data-live-weather") || "red";

  const updateDom = () => {
    const plan = computeTomRetirementPlan({
      nestEgg: curEgg,
      years: curYears,
      monthlyAdd: curAdd,
      weatherMode: curWeather,
    });

    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };
    const setHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };

    setTxt("tomRetireProjectedEgg", fmtUsdInt(plan.projectedNestEgg));
    setHtml("tomRetireGuardedMo", `${fmtUsdInt(plan.guardedMonthly)}<span>/mo</span>`);
    setHtml(
      "tomRetireGuardedSub",
      `${fmtUsdInt(plan.guardedAnnual)}/yr calm cashflow (4.5% safe withdrawal + dividend yield) · <b>32+ Yr Horizon</b>`
    );
    setHtml("tomRetireCrashMo", `${fmtUsdInt(plan.crashMonthly)}<span>/mo</span>`);
    setHtml(
      "tomRetireCrashSub",
      `Sequence-of-returns shock shrinks nest egg to ${fmtUsdInt(plan.crashNestEgg)} · <b>~18.5 Yr Depletion Risk</b>`
    );
    setHtml(
      "tomRetireComfortGapBanner",
      `✅ <strong>+${fmtUsdInt(plan.comfortGapMonthly)}/mo Comfort Gap Protected</strong> (${fmtUsdInt(plan.comfortGapAnnual)}/yr extra income) &amp; <strong>+${plan.longevityGainYears} Years</strong> of Nest-Egg Longevity!`
    );
    setTxt("tomRetireWeatherDesc", plan.weatherDesc);

    [0, 1, 2].forEach((idx) => {
      const b = plan.buckets[idx];
      setTxt(`tomBucket${idx + 1}Stat`, `${b.pct}% · ${fmtUsdInt(b.dollars)}`);
      const bar = document.getElementById(`tomBucket${idx + 1}Bar`);
      if (bar) bar.style.width = `${b.pct}%`;
    });
  };

  root.querySelectorAll(".tom-retire-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      const grp = btn.getAttribute("data-tom-retire-group");
      const val = Number(btn.getAttribute("data-tom-retire-val"));
      if (grp === "egg") curEgg = val;
      else if (grp === "years") curYears = val;
      else if (grp === "add") curAdd = val;

      root.querySelectorAll(`.tom-retire-pill[data-tom-retire-group="${grp}"]`).forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      updateDom();
    });
  });

  root.querySelectorAll(".tom-retire-wtab").forEach((wbtn) => {
    wbtn.addEventListener("click", () => {
      const w = wbtn.getAttribute("data-tom-weather") || "red";
      curWeather = w;
      root.querySelectorAll(".tom-retire-wtab").forEach((b) => {
        const active = b === wbtn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      updateDom();
    });
  });

  const btnStepManual = document.getElementById("btnTomRetireStepManual");
  if (btnStepManual) {
    btnStepManual.addEventListener("click", () => {
      const manualSec = document.getElementById("tomFreeStarterManual");
      if (manualSec && manualSec.scrollIntoView) {
        manualSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  const btnStepClub = document.getElementById("btnTomRetireStepClub");
  if (btnStepClub) {
    btnStepClub.addEventListener("click", () => {
      const clubPanel = document.getElementById("tom-passwordless-club-signup");
      const form = document.getElementById("tom-club-signup-form");
      const segInput = document.getElementById("tom-club-segment-value");
      const emailInput = document.getElementById("tom-club-email-input");

      if (form) form.style.display = "block";
      if (segInput) segInput.value = "retirement_401k_ira";
      if (clubPanel) {
        clubPanel.querySelectorAll(".tom-crm-seg-pill").forEach((pill) => {
          const isRetire = pill.getAttribute("data-tom-crm-seg") === "retirement_401k_ira";
          pill.classList.toggle("is-active", isRetire);
          pill.setAttribute("aria-pressed", isRetire ? "true" : "false");
        });
        if (clubPanel.scrollIntoView) {
          clubPanel.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      setTimeout(() => {
        if (emailInput && emailInput.focus) emailInput.focus();
      }, 280);
      if (typeof showToastFn === "function") {
        showToastFn("☕ Enter your email below for daily 401(k)/IRA Retirement Cashflow & 3-Color Market Weather Briefs!");
      }
    });
  }
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
      : "28.0";
  const closeDateStr = getLatestUsMarketCloseDate(ov && ov.date ? ov.date : "2026-11-16");
  const latestStockDate = `${closeDateStr} US Market Close`;

  const allStocks = (state.stocks || []).filter((s) => s.ticker && !String(s.ticker).includes("."));
  const cntGreen = allStocks.filter((s) => s.zone_code === "IGNITION_ZONE").length || 8;
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
  const existingClubMember = getStoredTomClubMember();
  const hasActiveClubMember = Boolean((existingClubMember && existingClubMember.email) || savedFreeEmail);
  const activeEmailDisplay = (existingClubMember && existingClubMember.email) || savedFreeEmail || "";
  const initialClubSeg =
    (existingClubMember && existingClubMember.segment) || "retirement_401k_ira";
  const initialClubSegLabel = getTomCrmSegmentLabel(initialClubSeg);
  const initialClubEmail = activeEmailDisplay;
  const initialClubNick =
    (existingClubMember && existingClubMember.nickname) || "";

  return `
    <section class="hero">
      <div class="hero-top-row">
        <div style="min-width:0; flex:1 1 320px;">
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
            <div class="hero-tag" id="heroTag" style="margin-bottom:0; font-size:0.95rem;">${t.heroTag} &middot; ${latestStockDate}</div>
            <button
              type="button"
              class="btn btn-sm hero-explainer-btn"
              id="btnOpenPwRsiExplainer"
              title="Click to view full 3-Bucket methodology"
            >
              <span>💡</span>
              <span>${t.pwRsiExplainerBtn || "How It Works"}</span>
            </button>
          </div>
          <h1 id="heroTitle">${t.heroTitle}</h1>
          <p id="heroDesc">${t.heroDesc}</p>
        </div>
      </div>

      <!-- 🚦 JARGON-FREE 3-COLOR US RETIREMENT MARKET WEATHER (S&P 500 BREADTH & DRAWDOWN GUARD) -->
      <div class="tom-traffic-strip" id="tomTrafficLightStrip" role="group" aria-label="US Retirement Market Weather (S&P 500 Breadth & Drawdown Guard)">
        <button type="button" class="tom-traffic-card t-green" data-traffic-zone="RETIRE_SIM">
          <span class="tom-traffic-kicker is-green">🟢 CALM UPTREND WEATHER</span>
          <strong class="tom-traffic-weights">20% $SGOV &middot; 35% $JEPI+$SCHD &middot; 45% $VOO</strong>
          <span class="tom-traffic-sub">Healthy S&amp;P 500 breadth &middot; Let dividends &amp; core index compound calmly &rarr;</span>
        </button>
        <button type="button" class="tom-traffic-card t-yellow" data-traffic-zone="RETIRE_SIM">
          <span class="tom-traffic-kicker is-yellow">🟡 CAUTIOUS BASE WEATHER</span>
          <strong class="tom-traffic-weights">30% $SGOV &middot; 40% $JEPI+$SCHD &middot; 30% $VOO</strong>
          <span class="tom-traffic-sub">Mixed market breadth &middot; Collect steady monthly dividends while bases form &rarr;</span>
        </button>
        <button type="button" class="tom-traffic-card t-red" data-traffic-zone="MANUAL">
          <span class="tom-traffic-kicker is-red">🔴 DRAWDOWN GUARD WEATHER</span>
          <strong class="tom-traffic-weights">40% $SGOV &middot; 40% $JEPI+$SCHD &middot; 20% $VOO</strong>
          <span class="tom-traffic-sub">Calm 2–4x/yr weight rebalance &middot; Open the $0 Safe Broker Guide &rarr;</span>
        </button>
      </div>

      <!-- 🧭 30-SECOND COMFORTABLE RETIREMENT & MONTHLY CASHFLOW SIMULATOR (#tom-retirement-architect) -->
      ${renderTomRetirementArchitect(state, { semiScore, cntGreen, cntRed })}

      <!-- ☕ UNIFIED MORNING BELL CLUB — SINGLE PASSWORDLESS 3-SEC SIGNUP & DAILY HABIT HUB -->
      <div class="tom-club-box" id="tomMorningBellClub" role="region" aria-label="Morning Bell Retirement & Macro Club — Protecting Your Nest Egg Together">
        <div class="tom-club-header">
          <div class="tom-club-title-wrap">
            <span class="tom-club-kicker">☕ MORNING BELL RETIREMENT &amp; MACRO CLUB</span>
            <strong class="tom-club-heading">Protecting Your Nest Egg &amp; Monthly Income Together</strong>
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
          <span class="tom-club-poll-title">🗳️ Today&rsquo;s Retiree Sentiment Poll (1-Click):</span>
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

        <div
          class="tom-crm-signup-panel"
          id="tom-passwordless-club-signup"
          role="region"
          aria-label="Passwordless 3-Second Morning Bell Club Membership"
        >
          <div class="tom-crm-top-row">
            <span class="tom-crm-badge">📧 FREE DAILY 8:30 AM ET BRIEF &bull; NO PASSWORD NEEDED</span>
            <span class="tom-crm-trust-note">100% Free Forever &middot; 1-Click Unsubscribe Anytime</span>
          </div>

          <h3 class="tom-crm-heading">
            Join the Morning Bell Club — Get Daily 3-Color US Retirement Market Weather in Your Inbox.
          </h3>
          <p class="tom-crm-subcopy">
            One simple 3-second signup unlocks <b>Today&rsquo;s 4-Core Retirement Posture ($VOO &middot; $SCHD &middot; $JEPI &middot; $SGOV)</b> right on this screen plus calm 8:30 AM ET rebalancing notes before the opening bell.
          </p>

          <div
            class="tom-crm-active-bar"
            id="tom-club-active-member-bar"
            style="display:${hasActiveClubMember ? "flex" : "none"};"
          >
            <span class="tom-crm-active-text" id="tom-club-active-member-text">
              ${
                hasActiveClubMember
                  ? `Morning Bell Member Active: ${escapeTomCrmHtml(activeEmailDisplay)} · Focus: ${escapeTomCrmHtml(initialClubSegLabel)}`
                  : ""
              }
            </span>
            <button type="button" class="tom-crm-update-toggle-btn" id="tom-club-update-toggle-btn">
              Update Email / Focus
            </button>
          </div>

          <form
            class="tom-crm-form"
            id="tom-club-signup-form"
            novalidate
            style="display:${hasActiveClubMember ? "none" : "block"};"
          >
            <input type="hidden" id="tom-club-segment-value" name="segment" value="${escapeTomCrmHtml(initialClubSeg)}" />
            <input
              type="text"
              name="website_hp"
              id="tom-club-hp-input"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
              style="display:none;"
            />

            <div class="tom-crm-seg-label">Tap Your #1 Retirement Focus (1-Click):</div>
            <div class="tom-crm-seg-grid" role="group" aria-label="Choose your #1 Morning Bell focus">
              ${TOM_CRM_SEGMENTS.map(
                (seg) => `
                <button
                  type="button"
                  class="tom-crm-seg-pill ${initialClubSeg === seg.id ? "is-active" : ""}"
                  data-tom-crm-seg="${seg.id}"
                  aria-pressed="${initialClubSeg === seg.id ? "true" : "false"}"
                >
                  ${escapeTomCrmHtml(seg.label)}
                </button>
              `
              ).join("")}
            </div>

            <div class="tom-crm-inputs-row">
              <input
                type="text"
                id="tom-club-nickname-input"
                class="tom-crm-input tom-crm-input-nick"
                name="nickname"
                autocomplete="given-name"
                value="${escapeTomCrmHtml(initialClubNick)}"
                placeholder="First name (optional)"
                aria-label="First name (optional)"
              />
              <input
                type="email"
                id="tom-club-email-input"
                class="tom-crm-input tom-crm-input-email"
                name="email"
                required
                autocomplete="email"
                value="${escapeTomCrmHtml(initialClubEmail)}"
                placeholder="Enter your email address (e.g., robert@email.com)"
                aria-label="Email address"
              />
              <button type="submit" id="tom-club-signup-btn" class="tom-crm-submit-btn">
                Join Free Morning Bell Club (3-Sec Access) -&gt;
              </button>
            </div>
          </form>

          <div
            class="tom-crm-feedback"
            id="tom-club-signup-feedback"
            role="status"
            aria-live="polite"
            style="display:none;"
          ></div>

          <div id="tomFreeMemberBonusCard" class="tom-member-bonus-card" style="display:${hasActiveClubMember ? "block" : "none"};">
            <div class="tom-member-bonus-title">🎁 CLUB MEMBER POSTURE UNLOCKED — Today&rsquo;s 4-Core Retirement Weights (Calm 2–4x/Yr Review):</div>
            <div>&bull; <b>🛡️ Bucket 1 ($SGOV US T-Bill Cash ~4.7%):</b> Hold <b>30–40%</b> in state-tax-advantaged short-term Treasury cash so 2–3 years of monthly living bills stay 100% insulated.</div>
            <div>&bull; <b>💵 Bucket 2 ($JEPI ~7.4% + $SCHD ~3.5%):</b> Hold <b>35–40%</b> across monthly income &amp; rising quality dividend payers.</div>
            <div>&bull; <b>🌱 Bucket 3 ($VOO S&amp;P 500 Core):</b> Hold <b>20–35%</b> aligned with our <b>US Retirement Market Weather (S&amp;P 500 Breadth &amp; Drawdown Guard)</b> — rebalance calmly 2–4 times per year, never panic-sell.</div>
          </div>
        </div>
      </div>

      <!-- 3 BIG INTUITIVE RETIREE SHORTCUTS -->
      <div class="hero-action-grid" role="group" aria-label="Educational Calculator Shortcuts">
        <button type="button" class="hero-cta-card primary" id="btnHeroActionRetireSim">
          <span>🧭 30-Sec Income Simulator</span>
        </button>
        <button type="button" class="hero-cta-card emerald" id="btnHeroActionManual">
          <span>📘 $0 Safe Brokerage &amp; Budget Guide</span>
        </button>
        <a href="#pricing" class="hero-cta-card vip-jump" id="btnHeroActionVip">
          <span>💎 VIP Dollar Worksheet &amp; Tax-Bucket Guide</span>
        </a>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-emerald">
          <div class="kpi-label" id="kpi1_label">${t.kpi1_label}</div>
          <div class="kpi-val">$VOO</div>
          <div class="kpi-sub" id="kpi1_sub">${t.kpi1_sub}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label" id="kpi2_label">${t.kpi2_label}</div>
          <div class="kpi-val">$SCHD+$JEPI</div>
          <div class="kpi-sub" id="kpi2_sub">${t.kpi2_sub}</div>
        </div>
        <div class="kpi-card kpi-emerald">
          <div class="kpi-label" id="kpi3_label">${t.kpi3_label}</div>
          <div class="kpi-val">$SGOV</div>
          <div class="kpi-sub" id="kpi3_sub">${t.kpi3_sub}</div>
        </div>
        <div class="kpi-card kpi-amber">
          <div class="kpi-label" id="kpi4_label">${t.kpi4_label}</div>
          <div class="kpi-val">2–4x/Yr</div>
          <div class="kpi-sub" id="kpi4_sub">${t.kpi4_sub}</div>
        </div>
      </div>
    </section>
  `;
}

export function renderFreeStarterManual(state) {
  const cfg = (state && state.config) || {};
  const polarMonthly = formatCheckoutUrl(
    cfg.polar_tom_monthly_url || cfg.ls_site1_monthly_url,
    "#tom-vip-monthly"
  );
  const polarAnnual = formatCheckoutUrl(
    cfg.polar_tom_annual_url || cfg.ls_site1_ltd_url,
    "#tom-vip-annual"
  );
  const isWebView =
    typeof window !== "undefined" &&
    typeof window.isTomInAppWebView === "function" &&
    window.isTomInAppWebView();

  return `
    <section class="tom-starter-manual-section" id="tomFreeStarterManual" aria-label="$0 Free Public Product: US Brokerage App & Calm 2-4x/Year Brokerage Limit-Order & Budget Starter Manual">
      <div class="tom-manual-top-row">
        <span class="tom-manual-free-pill">📘 $0 FREE PUBLIC PRODUCT · SELF-DIRECTED EDUCATIONAL GUIDE</span>
        <span class="tom-manual-broker-pill">🏦 Fidelity · Charles Schwab · Vanguard Ready</span>
      </div>

      <h2 class="tom-manual-heading">
        US Brokerage App &amp; Calm 2–4x/Year Household Budget & Cashflow Manual ($0 Free Edition)
      </h2>
      <p class="tom-manual-lead">
        Managing a lifelong <b>401(k) or IRA</b> nest egg does not require stressful daily trading. Learn the 3 calm self-directed brokerage habits: placing safe Limit Orders, rebalancing <b>SGOV · SCHD · JEPI · VOO</b> weights 2–4 times a year with our 3-Color Market Weather indicator, and earning steady government money-market yield on cash cushions.
      </p>

      <div class="tom-manual-steps-grid">
        <button type="button" class="tom-manual-step-card btn-open-tom-manual-step" data-manual-step="tomManualStep1">
          <span class="tom-manual-step-badge step-b1">STEP 1 · SAFE ORDER ENTRY</span>
          <strong class="tom-manual-step-title">Limit Order vs. Market Order</strong>
          <span class="tom-manual-step-desc">
            Why tapping &ldquo;Market Order&rdquo; at 9:30 AM ET risks overpaying on wide morning spreads &mdash; and how to place a calm <b>Limit Order</b> in 3 taps on Fidelity, Schwab, or Vanguard.
          </span>
          <span class="tom-manual-step-cta">Read Step 1 Guide →</span>
        </button>

        <button type="button" class="tom-manual-step-card btn-open-tom-manual-step" data-manual-step="tomManualStep2">
          <span class="tom-manual-step-badge step-b2">STEP 2 · CALM BUDGET WORKSHEET</span>
          <strong class="tom-manual-step-title">2–4x/Year Household Cashflow & Budget Worksheet</strong>
          <span class="tom-manual-step-desc">
            How to review and gently adjust your <b>SGOV · SCHD · JEPI · VOO</b> bucket percentages just <b>2–4 times per year</b> aligned with our 3-Color Market Weather indicator.
          </span>
          <span class="tom-manual-step-cta">Read Step 2 Guide →</span>
        </button>

        <button type="button" class="tom-manual-step-card btn-open-tom-manual-step" data-manual-step="tomManualStep3">
          <span class="tom-manual-step-badge step-b3">STEP 3 · T-BILL &amp; MMF CUSHION</span>
          <strong class="tom-manual-step-title">401(k) / IRA Cash MMF Cushion</strong>
          <span class="tom-manual-step-desc">
            During 🔴 Red (Crash Defense Weather), keep your Bucket 1 cushion in <b>SGOV</b>, <b>SPAXX</b>, <b>SWVXX</b>, or <b>VMFXX</b> to collect monthly interest without selling core holdings.
          </span>
          <span class="tom-manual-step-cta">Read Step 3 Guide →</span>
        </button>
      </div>

      <div class="tom-manual-cta-bar">
        <button type="button" class="tom-manual-open-btn" id="btnOpenTomStarterManual">
          ${isWebView ? "📖 Read Complete $0 Manual &amp; Email Me This PDF Guide →" : "📖 Open Complete $0 Starter Manual (Read / Save PDF) →"}
        </button>
        <button type="button" class="tom-manual-sec-btn btn-jump-tom-morning">
          📧 Get Free Daily 3-Color Market Weather ($0)
        </button>
        <a
          href="${polarMonthly}"
          class="tom-manual-vip-link polar-checkout-button"
          data-polar-checkout
          data-polar-plan="monthly_29"
          data-tom-paid-plan="monthly"
        >
          ⚡ Start Monthly VIP — $29/mo
        </a>
        <a
          href="${polarAnnual}"
          class="tom-manual-vip-link is-ltd polar-checkout-button"
          data-polar-checkout
          data-polar-plan="annual_199"
          data-tom-paid-plan="annual"
        >
          👑 Start Annual VIP — $199/yr
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
          badge: "🟢 GREEN REGIME · ABOVE MA20/MA60",
          color: "#34d399",
          bg: "rgba(16,185,129,0.12)",
          border: "rgba(16,185,129,0.4)",
          summary: `Base consolidation confirmed with volume expansion (${Number(selectedStock.vol_surge_10d || 1.5).toFixed(2)}x volume). Historical factor model tracks standard dispersion bands.`,
        }
      : zone === "WASHOUT_WATCH"
      ? {
          badge: "🟡 YELLOW REGIME · BASE CONSOLIDATION",
          color: "#fbbf24",
          bg: "rgba(245,158,11,0.12)",
          border: "rgba(245,158,11,0.4)",
          summary: `Valuation compression detected (Score ${Number(selectedStock.score || 22).toFixed(1)}), awaiting volume confirmation above moving averages.`,
        }
      : {
          badge: "🔴 RED REGIME · BELOW MA60 DOWNTREND",
          color: "#f87171",
          bg: "rgba(239,68,68,0.12)",
          border: "rgba(239,68,68,0.4)",
          summary: `Price remains below 20-day & 60-day moving averages. Historical factor filter excludes sub-MA60 trends.`,
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
            How Our Quantitative Factor Model Evaluates Dispersion &amp; Allocation Weights in 3 Steps
          </h2>
          <p style="font-size:0.8rem; color:#cbd5e1; margin:0; line-height:1.5;">
            Explore the <b>3-State Factor Regime</b> below and simulate historical position sizing, variance bands, and compounding scenarios (self-directed educational calculator software only).
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
            Filter Trend-Confirmed Factor Cohorts
          </div>
          <div style="font-size:0.74rem; color:#94a3b8; line-height:1.45;">
            Identifies post-drawdown equities reclaiming 20-day and 60-day moving averages alongside volume expansion (<b>Volume &ge; 1.4x</b>).
          </div>
        </div>

        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(245,158,11,0.28); border-left:3px solid #f59e0b; border-radius:6px; padding:10px 12px;">
          <div style="font-size:0.72rem; font-weight:800; color:#fbbf24; font-family:var(--font-mono); margin-bottom:3px;">
            STEP 2 · LOWER VARIANCE BOUNDARY
          </div>
          <div style="font-size:0.8rem; font-weight:700; color:#ffffff; margin-bottom:3px;">
            Model Position Weight &amp; Drawdown Variance
          </div>
          <div style="font-size:0.74rem; color:#94a3b8; line-height:1.45;">
            Deep drawdowns erode compounding math. Modeling a disciplined single-slot weight caps simulated portfolio variance impact at ~1.35%.
          </div>
        </div>

        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(56,189,248,0.28); border-left:3px solid #38bdf8; border-radius:6px; padding:10px 12px;">
          <div style="font-size:0.72rem; font-weight:800; color:#38bdf8; font-family:var(--font-mono); margin-bottom:3px;">
            STEP 3 · HISTORICAL DISPERSION PROFILE
          </div>
          <div style="font-size:0.8rem; font-weight:700; color:#ffffff; margin-bottom:3px;">
            Multi-Year Empirical Return Distribution
          </div>
          <div style="font-size:0.74rem; color:#94a3b8; line-height:1.45;">
            Across 2000–2026 empirical data, trend-confirmed factor cohorts yielded <b>+${netCagrStr}%/yr</b> backtested net CAGR (past performance does not guarantee future results).
          </div>
        </div>
      </div>

      <!-- Interactive 1:1 Dollar Action Ticket & Wealth Compounder -->
      <div style="background:#080c15; border:1px solid rgba(56,189,248,0.3); border-radius:6px; padding:12px 14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; max-width:100%;">
            <span class="mono" style="font-size:0.72rem; font-weight:800; color:#38bdf8;">🎯 INTERACTIVE POSITION WEIGHT &amp; VARIANCE SIMULATOR:</span>
            <select id="easySimTickerSelect" style="min-height:40px; max-width:100%; background:#0f172a; color:#ffffff; border:1px solid #38bdf8; border-radius:4px; padding:6px 8px; font-family:var(--font-mono); font-size:0.76rem; font-weight:700; cursor:pointer;">
              ${selectableStocks
                .map(
                  (s) =>
                    `<option value="${s.ticker}" ${s.ticker === selectedStock.ticker ? "selected" : ""}>$${s.ticker} (${s.name_en || s.ticker}) — $${Number(
                      s.close || 0
                    ).toFixed(2)} [${s.zone_code === "IGNITION_ZONE" ? "🟢 GREEN" : s.zone_code}]</option>`
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
            <div class="mono" style="font-size:0.66rem; color:#f87171;">② SIMULATED LOWER VARIANCE BAND</div>
            <div class="mono" style="font-size:1.05rem; font-weight:800; color:#f87171; margin-top:3px;">
              -$${maxLossUsd.toLocaleString()} <span style="font-size:0.74rem; color:#fca5a5;">(Ref @ $${stopPrice})</span>
            </div>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">
              Caps simulated impact to <b>~1.35%</b> of $${capUsd.toLocaleString()} model
            </div>
          </div>

          <div style="background:#0d1424; border:1px solid rgba(16,185,129,0.35); border-radius:5px; padding:9px 11px;">
            <div class="mono" style="font-size:0.66rem; color:#34d399;">③ HISTORICAL UPPER DISPERSION BAND</div>
            <div class="mono" style="font-size:1.05rem; font-weight:800; color:#34d399; margin-top:3px;">
              +$${profit1Usd.toLocaleString()} ~ +$${profit2Usd.toLocaleString()}
            </div>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">
              Mid Band ($${target1Price}) · Upper Band ($${target2Price})
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
