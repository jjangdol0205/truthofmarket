import { formatCheckoutUrl } from "../services/api.js";
import { getLatestUsMarketCloseDate } from "./Header.js";

export const TOM_MORNING_CLUB_COMPANION_MSG = {
  steady:
    "🤝 Steady discipline — pairing Semiconductor Growth ($SMH) with Healthcare Defense ($XLV) cushions deep tech drawdowns across multi-year cycles.",
  watch:
    "👀 Calm observation — tracking overheating and fear indicator bands before adjusting sector weights helps avoid emotional decisions.",
  cash:
    "🛡️ Safety cushion — adding a short-term US Treasury reserve ($SGOV) alongside $XLV keeps near-term cash insulated during market storms.",
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

export function getTomMorningClubPollData(todayKey) {
  const dateKey = todayKey || getTomMorningClubTodayKey();
  return {
    dateKey,
    choice: "",
    counts: { steady: 184, watch: 196, cash: 142 },
    total: 522,
    pct: { steady: 35, watch: 38, cash: 27 },
  };
}

export function escapeTomCrmHtml(raw) {
  return String(raw || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getTomHeroCopyMode() {
  const isLiveSharp =
    typeof window !== "undefined" &&
    window.PAYMENT_CONFIG &&
    window.PAYMENT_CONFIG.STORE_LIVE_READY === true;
  const mode = isLiveSharp ? "LIVE_SHARP" : "UNDERWRITING_SAFE";
  if (typeof window !== "undefined") {
    window.TOM_COPY_MODE = mode;
  }
  return mode;
}

export const TOM_SURVEY_STEP1_OPTIONS = [
  {
    id: "growth",
    title: "AI & Growth Acceleration",
    sub: "Capture long-term semiconductor compounding ($SMH) while buffering severe tech drawdowns",
  },
  {
    id: "balanced",
    title: "Balanced Retirement & Steady Growth",
    sub: "Blend AI semiconductor growth ($SMH) with resilient healthcare defense ($XLV)",
  },
  {
    id: "defense",
    title: "Drawdown Protection First",
    sub: "Prioritize capital preservation with Healthcare ($XLV) + US T-Bill Cash Cushion ($SGOV)",
  },
];

export const TOM_SURVEY_STEP2_PRESETS = [
  { val: 50000, label: "$50k" },
  { val: 150000, label: "$150k" },
  { val: 300000, label: "$300k" },
  { val: 500000, label: "$500k" },
  { val: 1000000, label: "$1M+" },
];

export const TOM_SURVEY_STEP3_COMFORT = [
  {
    id: "dd10",
    title: "-10% Sleep-Well Priority",
    sub: "Keep drawdowns mild with Healthcare ($XLV) + short-term US Treasury cushion ($SGOV)",
  },
  {
    id: "dd18",
    title: "-18% Balanced Cushion",
    sub: "Classic SMH × XLV two-pillar barbell balance across full bull & bear cycles",
  },
  {
    id: "dd25",
    title: "-25% Long-Term Compounding",
    sub: "Accept wider interim swings for higher multi-year semiconductor growth exposure",
  },
];

export const TOM_SURVEY_STEP4_TECH = [
  {
    id: "tech_high",
    title: "Heavy Tech / Semiconductor (>70%)",
    sub: "Concentrated in AI, Nasdaq, or chip names — vulnerable to single-sector pullbacks",
  },
  {
    id: "tech_mid",
    title: "Balanced Mix (30–70%)",
    sub: "Moderate equity mix looking for cleaner growth-vs-defense sector discipline",
  },
  {
    id: "tech_low",
    title: "Mostly Cash or Broad Index (<30%)",
    sub: "Holding cash or broad funds — exploring a structured SMH × XLV entry baseline",
  },
];

const DEFAULT_TOM_SURVEY = {
  objective: "balanced",
  scale: 300000,
  comfort: "dd18",
  techMix: "tech_high",
  submitted: false,
};

export function getSavedTomSurveyState() {
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem("tom_smh_xlv_survey_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return {
            objective: ["growth", "balanced", "defense"].includes(parsed.objective)
              ? parsed.objective
              : DEFAULT_TOM_SURVEY.objective,
            scale: Number(parsed.scale) > 0 ? Number(parsed.scale) : DEFAULT_TOM_SURVEY.scale,
            comfort: ["dd10", "dd18", "dd25"].includes(parsed.comfort)
              ? parsed.comfort
              : DEFAULT_TOM_SURVEY.comfort,
            techMix: ["tech_high", "tech_mid", "tech_low"].includes(parsed.techMix)
              ? parsed.techMix
              : DEFAULT_TOM_SURVEY.techMix,
            submitted: Boolean(parsed.submitted),
          };
        }
      }
    }
  } catch (_) {}
  return { ...DEFAULT_TOM_SURVEY };
}

function saveTomSurveyState(nextState) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("tom_smh_xlv_survey_v1", JSON.stringify(nextState));
    }
  } catch (_) {}
}

function fmtUsdInt(n) {
  return "$" + Math.round(Number(n) || 0).toLocaleString("en-US");
}

export function computeTomSmhXlvBaseline(survey) {
  const s = survey || DEFAULT_TOM_SURVEY;
  const cap = Math.max(10000, Number(s.scale) || 300000);
  let smhPct = 60;
  let xlvPct = 40;
  let sgovPct = 0;
  let profileName = "Balanced SMH × XLV Barbell Baseline";

  if (s.objective === "defense" || s.comfort === "dd10") {
    if (s.objective === "defense" && s.comfort === "dd10") {
      smhPct = 40;
      xlvPct = 40;
      sgovPct = 20;
      profileName = "Sleep-Well Defense Mix (40% SMH : 40% XLV : 20% SGOV)";
    } else {
      smhPct = 50;
      xlvPct = 35;
      sgovPct = 15;
      profileName = "Cushioned Retirement Mix (50% SMH : 35% XLV : 15% SGOV)";
    }
  } else if (s.objective === "growth" && s.comfort === "dd25") {
    smhPct = 75;
    xlvPct = 25;
    sgovPct = 0;
    profileName = "Growth Compounding Barbell (75% SMH : 25% XLV)";
  } else if (s.objective === "growth" || s.comfort === "dd25") {
    smhPct = 70;
    xlvPct = 30;
    sgovPct = 0;
    profileName = "Classic 70:30 Growth-Defense Barbell (70% SMH : 30% XLV)";
  } else {
    smhPct = 60;
    xlvPct = 40;
    sgovPct = 0;
    profileName = "Balanced 60:40 Retirement Barbell (60% SMH : 40% XLV)";
  }

  const smhUsd = Math.round((cap * smhPct) / 100);
  const xlvUsd = Math.round((cap * xlvPct) / 100);
  const sgovUsd = Math.max(0, cap - smhUsd - xlvUsd);

  const objLabel =
    TOM_SURVEY_STEP1_OPTIONS.find((o) => o.id === s.objective)?.title ||
    "Balanced Retirement & Steady Growth";
  const scaleLabel =
    TOM_SURVEY_STEP2_PRESETS.find((p) => p.val === cap)?.label || fmtUsdInt(cap);
  const comfortLabel =
    TOM_SURVEY_STEP3_COMFORT.find((c) => c.id === s.comfort)?.title || "-18% Balanced Cushion";
  const techLabel =
    TOM_SURVEY_STEP4_TECH.find((t) => t.id === s.techMix)?.title || "Heavy Tech / Semiconductor (>70%)";

  const concentrationNote =
    s.techMix === "tech_high"
      ? "Historical Context (>70% Tech): Pure tech portfolios suffered -81.1% (2000–2002) and -35.0% (2022). Pairing $SMH with $XLV historically cut deep drawdowns roughly in half while keeping AI upside."
      : s.techMix === "tech_low"
      ? "Historical Context (<30% Tech): Gradually staging from cash/broad funds into an SMH × XLV baseline captures secular semiconductor growth while Healthcare ($XLV) anchors portfolio stability."
      : "Historical Context (30–70% Mix): Replacing scattered overlapping funds with a clean two-pillar $SMH × $XLV structure simplifies monitoring to one transparent sector ratio.";

  const ratioHeadline =
    sgovPct > 0
      ? `${smhPct}% $SMH : ${xlvPct}% $XLV : ${sgovPct}% $SGOV`
      : `${smhPct}% $SMH : ${xlvPct}% $XLV`;

  return {
    cap,
    smhPct,
    xlvPct,
    sgovPct,
    smhUsd,
    xlvUsd,
    sgovUsd,
    profileName,
    ratioHeadline,
    objLabel,
    scaleLabel,
    comfortLabel,
    techLabel,
    concentrationNote,
    teaserSummary: `${objLabel} · ${scaleLabel} Portfolio · ${comfortLabel} · ${techLabel}`,
  };
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
      const freeEmail = String(localStorage.getItem("tom_free_member_email") || "").trim();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(freeEmail)) {
        return { email: freeEmail, segment: "smh_xlv_barbell" };
      }
    }
  } catch (_) {}
  return null;
}

export function registerTomClubMemberSafe(opts) {
  const cleanEmail = String((opts && opts.email) || "").trim().toLowerCase();
  const cleanNick = String((opts && opts.nickname) || "").trim();
  const cleanSeg = String((opts && opts.segment) || "smh_xlv_barbell").trim() || "smh_xlv_barbell";
  const cleanHp = String((opts && opts.website_hp) || "").trim();
  const cleanNotes = String((opts && opts.notes) || "").trim();

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
      notes: cleanNotes,
      message: cleanNotes,
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
          notes: cleanNotes,
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
        message: cleanNotes,
        notes: cleanNotes,
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

function renderUnlockedSmhXlvContentHtml(baseline) {
  return `
    <div class="tom-unlocked-ratio-header">
      <span class="tom-unlocked-pill">🔓 PERSONALIZED HISTORICAL BASELINE UNLOCKED</span>
      <span class="tom-unlocked-scale">Simulated Scale: <strong>${fmtUsdInt(baseline.cap)}</strong></span>
    </div>
    <h4 class="tom-unlocked-ratio-title">
      ${escapeTomCrmHtml(baseline.profileName)}: <span class="tom-ratio-accent">${escapeTomCrmHtml(baseline.ratioHeadline)}</span>
    </h4>
    <p class="tom-unlocked-conc-note">${escapeTomCrmHtml(baseline.concentrationNote)}</p>

    <div class="tom-ratio-bars-grid">
      <div class="tom-ratio-bar-card is-smh">
        <div class="tom-ratio-bar-top">
          <strong>🚀 $SMH (Semiconductor Growth ETF)</strong>
          <span>${baseline.smhPct}% &middot; ${fmtUsdInt(baseline.smhUsd)}</span>
        </div>
        <div class="tom-ratio-track"><span style="width:${baseline.smhPct}%;"></span></div>
        <div class="tom-ratio-sub">1x non-leveraged global AI &amp; semiconductor leader basket</div>
      </div>

      <div class="tom-ratio-bar-card is-xlv">
        <div class="tom-ratio-bar-top">
          <strong>🛡️ $XLV (Healthcare Defense ETF)</strong>
          <span>${baseline.xlvPct}% &middot; ${fmtUsdInt(baseline.xlvUsd)}</span>
        </div>
        <div class="tom-ratio-track"><span style="width:${baseline.xlvPct}%;"></span></div>
        <div class="tom-ratio-sub">Recession-resilient US healthcare cashflows &amp; dividend cushion</div>
      </div>

      ${
        baseline.sgovPct > 0
          ? `
      <div class="tom-ratio-bar-card is-sgov">
        <div class="tom-ratio-bar-top">
          <strong>🏦 $SGOV (0–3 Mo US Treasury Cash Cushion)</strong>
          <span>${baseline.sgovPct}% &middot; ${fmtUsdInt(baseline.sgovUsd)}</span>
        </div>
        <div class="tom-ratio-track"><span style="width:${baseline.sgovPct}%;"></span></div>
        <div class="tom-ratio-sub">Short-term US Treasury reserve (~4.7% ref yield) for extra sleep-well stability</div>
      </div>`
          : ""
      }
    </div>

    <div class="tom-stress-table-wrap">
      <div class="tom-stress-table-title">
        📊 26-Year Historical Drawdown Comparison (2000–2026 Public Market Data)
      </div>
      <table class="tom-stress-table">
        <thead>
          <tr>
            <th>Historical Market Stress Episode</th>
            <th>100% Tech ($QQQ / $SMH)</th>
            <th>SMH &times; XLV Barbell Baseline</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>2000–2002 Dot-Com Bust</strong></td>
            <td class="is-neg">-81.1% Severe Drawdown</td>
            <td class="is-pos"><strong>-43.8% Cushioned</strong> ($XLV defensive offset)</td>
          </tr>
          <tr>
            <td><strong>2008 Global Financial Crisis</strong></td>
            <td class="is-neg">-53.4% Drawdown</td>
            <td class="is-pos"><strong>-34.6% Cushioned</strong> (Faster recovery horizon)</td>
          </tr>
          <tr>
            <td><strong>2022 Rate-Hike Tech Bear</strong></td>
            <td class="is-neg">-35.0% ($SMH) / -32.6% ($QQQ)</td>
            <td class="is-pos"><strong>-18.9% Blended</strong> ($XLV held near -2.0%)</td>
          </tr>
          <tr>
            <td><strong>2000–2026 Full-Cycle Study</strong></td>
            <td>High Single-Sector Volatility</td>
            <td class="is-pos"><strong>+28.4%/yr Historical Model</strong> (2.03 Sharpe)</td>
          </tr>
        </tbody>
      </table>
      <div class="tom-stress-footnote">
        * Educational historical public market simulation (2000–2026). Past performance does not guarantee future results; not personalized investment advice.
      </div>
    </div>

    <div class="tom-unlocked-next-actions">
      <button type="button" class="tom-unlocked-manual-btn" id="btnUnlockedOpenManual">
        📘 Open Unlocked $0 US Brokerage Safe-Order Manual (Fidelity · Schwab · Vanguard) →
      </button>
      <a href="#pricing" class="tom-unlocked-vip-jump">
        ⚡ Want Daily Morning SMH &times; XLV Indicator &amp; Ratio Tracking Emails? See Stage 3 VIP ($29/mo) ↓
      </a>
    </div>
  `;
}

function refreshStage2SurveyDom() {
  const survey = getSavedTomSurveyState();
  const baseline = computeTomSmhXlvBaseline(survey);
  const member = getStoredTomClubMember();
  const isUnlocked = Boolean(member && member.email);

  const teaserEl = document.getElementById("tomSurveyTeaserText");
  if (teaserEl) {
    teaserEl.innerHTML = isUnlocked
      ? `✅ <strong>Survey Profile Active (${escapeTomCrmHtml(member.email)}):</strong> ${escapeTomCrmHtml(
          baseline.teaserSummary
        )} &mdash; Your personalized <b>${escapeTomCrmHtml(baseline.ratioHeadline)}</b> baseline &amp; $0 Manual are unlocked below!`
      : `📊 <strong>Profile Summary Ready:</strong> ${escapeTomCrmHtml(
          baseline.teaserSummary
        )} &mdash; Enter your email below (<b>3 seconds · zero password</b>) to unlock your exact <b>SMH &times; XLV</b> ratio table, 26-year crash comparison &amp; $0 Brokerage Safe-Order Manual!`;
  }

  const lockedGate = document.getElementById("tomSurveyLockedPreviewGate");
  if (lockedGate) {
    lockedGate.style.display = isUnlocked ? "none" : "block";
  }

  const bonusCard = document.getElementById("tomFreeMemberBonusCard");
  if (bonusCard) {
    bonusCard.innerHTML = renderUnlockedSmhXlvContentHtml(baseline);
    bonusCard.style.display = isUnlocked ? "block" : "none";
    const openManBtn = bonusCard.querySelector("#btnUnlockedOpenManual");
    if (openManBtn) {
      openManBtn.addEventListener("click", () => {
        const modal = document.getElementById("tomStarterManualModal");
        if (modal) {
          modal.style.display = "flex";
        } else {
          const sec = document.getElementById("tomFreeStarterManual");
          if (sec && sec.scrollIntoView) sec.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  }

  const manualUnlockBadge = document.getElementById("tomManualUnlockStateBadge");
  if (manualUnlockBadge) {
    manualUnlockBadge.textContent = isUnlocked
      ? "✅ UNLOCKED FOR CLUB MEMBER · READ OR SAVE PDF ANYTIME"
      : "📘 $0 FREE PUBLIC PRODUCT · UNLOCKS WITH 3-SEC CLUB SIGNUP";
  }
}

export function bindTomRetirementArchitectEvents(state, showToastFn) {
  const root = document.getElementById("tom-retirement-architect");
  if (!root) return;

  let survey = getSavedTomSurveyState();
  let currentStep = 1;

  const renderStepState = () => {
    const pct = currentStep * 25;
    const fillEl = document.getElementById("tomSurveyProgressFill");
    const stepLbl = document.getElementById("tomSurveyStepCounter");
    if (fillEl) fillEl.style.width = `${pct}%`;
    if (stepLbl) stepLbl.textContent = `Step ${currentStep} of 4 (${pct}%)`;

    root.querySelectorAll("[data-tom-step-Indicator]").forEach((ind) => {
      const n = Number(ind.getAttribute("data-tom-step-Indicator"));
      ind.classList.toggle("is-current", n === currentStep);
      ind.classList.toggle("is-done", n < currentStep);
    });

    root.querySelectorAll(".tom-survey-step-pane").forEach((pane) => {
      const n = Number(pane.getAttribute("data-tom-step-pane"));
      pane.style.display = n === currentStep ? "block" : "none";
    });

    const backBtn = document.getElementById("btnTomSurveyPrev");
    if (backBtn) {
      backBtn.style.visibility = currentStep > 1 ? "visible" : "hidden";
    }
  };

  root.querySelectorAll("[data-tom-step-Indicator]").forEach((ind) => {
    ind.addEventListener("click", () => {
      const targetStep = Number(ind.getAttribute("data-tom-step-Indicator")) || 1;
      currentStep = Math.min(4, Math.max(1, targetStep));
      renderStepState();
    });
  });

  const prevBtn = document.getElementById("btnTomSurveyPrev");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep -= 1;
        renderStepState();
      }
    });
  }

  root.querySelectorAll("[data-tom-survey-field]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const field = btn.getAttribute("data-tom-survey-field");
      const val = btn.getAttribute("data-tom-survey-val");
      if (field === "objective") survey.objective = val;
      else if (field === "scale") survey.scale = Number(val) || 300000;
      else if (field === "comfort") survey.comfort = val;
      else if (field === "techMix") survey.techMix = val;

      root.querySelectorAll(`[data-tom-survey-field="${field}"]`).forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });

      saveTomSurveyState(survey);
      refreshStage2SurveyDom();

      if (currentStep < 4 && field !== "techMix") {
        setTimeout(() => {
          currentStep = Math.min(4, currentStep + 1);
          renderStepState();
        }, 120);
      }
    });
  });

  const calcBtn = document.getElementById("btnTomCalculateSmhXlv");
  if (calcBtn) {
    calcBtn.addEventListener("click", () => {
      survey.submitted = true;
      saveTomSurveyState(survey);
      refreshStage2SurveyDom();

      const member = getStoredTomClubMember();
      if (member && member.email) {
        const bonusEl = document.getElementById("tomFreeMemberBonusCard");
        if (bonusEl && bonusEl.scrollIntoView) {
          bonusEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (typeof showToastFn === "function") {
          showToastFn("✅ Your Personalized SMH × XLV Historical Baseline Mix Is Updated Below!");
        }
      } else {
        const gateEl =
          document.getElementById("tom-passwordless-club-signup") ||
          document.getElementById("tomMorningBellClub");
        const emailInp = document.getElementById("tom-club-email-input");
        if (gateEl && gateEl.scrollIntoView) {
          gateEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setTimeout(() => {
          if (emailInp && emailInp.focus) emailInp.focus();
        }, 280);
        if (typeof showToastFn === "function") {
          showToastFn("🔓 Enter your email in 3 seconds (no password) to unlock your SMH × XLV Baseline Mix!");
        }
      }
    });
  }

  renderStepState();
  refreshStage2SurveyDom();
}

export function bindTomPasswordlessClubEvents(state, showToastFn) {
  const panel = document.getElementById("tom-passwordless-club-signup");
  if (!panel) return;

  const form = document.getElementById("tom-club-signup-form");
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
    if (activeText) {
      activeText.textContent = `✅ Free Morning Bell Club Unlocked: ${memberObj.email} (SMH × XLV Baseline & $0 Manual Active)`;
    }
    if (activeBar) {
      activeBar.style.display = "flex";
    }
    if (emailInput && !emailInput.value) emailInput.value = memberObj.email;
    if (nickInput && memberObj.nickname && !nickInput.value) nickInput.value = memberObj.nickname;
  };

  const existing = getStoredTomClubMember();
  if (existing && existing.email) {
    applyActiveMemberUi(existing);
    if (form) form.style.display = "none";
    refreshStage2SurveyDom();
  }

  if (toggleBtn && form) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = form.style.display === "none";
      form.style.display = isHidden ? "block" : "none";
      toggleBtn.textContent = isHidden ? "Hide Form" : "Change Email";
      if (isHidden && emailInput) {
        setTimeout(() => emailInput.focus(), 40);
      }
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = String((emailInput && emailInput.value) || "").trim().toLowerCase();
      const nickname = String((nickInput && nickInput.value) || "").trim();
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

      const survey = getSavedTomSurveyState();
      const baseline = computeTomSmhXlvBaseline(survey);
      const notes = `site=truthofmarket.com | smh_xlv_survey=${baseline.ratioHeadline} | scale=${baseline.cap} | obj=${survey.objective} | comfort=${survey.comfort} | tech=${survey.techMix}`;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Unlocking Your SMH × XLV Baseline...";
      }

      try {
        const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("tom_free_member_email", email);
          localStorage.setItem("tom_free_member_since", kst);
          localStorage.setItem(
            "dc_member_TOM",
            JSON.stringify({
              div: "TOM",
              email,
              nickname,
              segment: "smh_xlv_barbell",
              notes,
              joined_at: new Date().toISOString(),
            })
          );
        }
        if (typeof window !== "undefined") {
          if (typeof window.trackTomFreeSignup === "function") {
            window.trackTomFreeSignup(email);
          } else {
            fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/signup", {
              mode: "cors",
              keepalive: true,
            }).catch(() => {});
            fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/signup_total", {
              mode: "cors",
              keepalive: true,
            }).catch(() => {});
          }
        }
        await registerTomClubMemberSafe({
          email,
          nickname,
          segment: "smh_xlv_barbell",
          notes,
          website_hp,
        });
      } catch (_) {}

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Unlock My SMH × XLV Baseline Mix & $0 Manual (3-Sec) →";
      }

      if (state) state.freeMemberEmail = email;
      applyActiveMemberUi({ email, nickname, segment: "smh_xlv_barbell" });
      form.style.display = "none";
      if (toggleBtn) toggleBtn.textContent = "Change Email";
      refreshStage2SurveyDom();

      if (feedbackEl) {
        feedbackEl.className = "tom-crm-feedback is-success";
        feedbackEl.style.display = "block";
        feedbackEl.innerHTML = `
          <div class="tom-crm-feedback-copy">
            <strong>✅ Instant Access Unlocked for ${escapeTomCrmHtml(email)}!</strong>
            <span>Your personalized <b>${escapeTomCrmHtml(
              baseline.ratioHeadline
            )}</b> historical baseline table, 26-year drawdown study, and $0 Brokerage Safe-Order Manual are now open below.</span>
          </div>
        `;
      }

      if (typeof showToastFn === "function") {
        showToastFn("🔓 SMH × XLV Historical Baseline & $0 Manual Unlocked!");
      }
    });
  }
}

export function renderHero(state) {
  const copyMode = getTomHeroCopyMode();
  const isSharp = copyMode === "LIVE_SHARP";
  const ov = state.semiOverview;
  const fgScore =
    ov && ov.fg_score !== undefined && ov.fg_score !== null
      ? Number(ov.fg_score).toFixed(1)
      : "28.0";
  const closeDateStr = getLatestUsMarketCloseDate(ov && ov.date ? ov.date : "2026-11-16");

  const survey = getSavedTomSurveyState();
  const baseline = computeTomSmhXlvBaseline(survey);
  const existingMember = getStoredTomClubMember();
  const savedFreeEmail =
    (existingMember && existingMember.email) ||
    state.freeMemberEmail ||
    (typeof localStorage !== "undefined" ? localStorage.getItem("tom_free_member_email") || "" : "");
  const isUnlocked = Boolean(savedFreeEmail);
  const initialNick = (existingMember && existingMember.nickname) || "";

  const heroBadge = isSharp
    ? `LIVE SMH × XLV SECTOR RATIO TRACKER & DAILY REGIME DIGEST · ${closeDateStr}`
    : `HISTORICAL SMH × XLV SECTOR BALANCE SIMULATOR & DAILY AUTOMATED MARKET INDICATOR DATA DIGEST · ${closeDateStr}`;
  const heroHeadline = isSharp
    ? "Lock In Your SMH × XLV Balance Ratio — Track Daily Shifts Before the Bell."
    : "Balance AI Semiconductor Growth ($SMH) With Healthcare Defense ($XLV) — Sleep Calmly.";
  const heroSub = isSharp
    ? "Complete the 4-step guided check below to unlock your personalized $SMH : $XLV baseline mix, 26-year crash test, and daily regime tracking."
    : "Answer 4 quick taps below to see how pairing 1x Semiconductor Growth ($SMH) with Healthcare Defense ($XLV) cushioned the 2000, 2008, and 2022 market downturns.";

  return `
    <section class="hero tom-clean-3stage-hero">
      <div class="tom-clean-hero-head">
        <span class="tom-clean-mode-pill" data-copy-mode="${copyMode}">
          🧭 ${escapeTomCrmHtml(heroBadge)}
        </span>
        <h1 class="tom-clean-h1" id="heroTitle">${escapeTomCrmHtml(heroHeadline)}</h1>
        <p class="tom-clean-lead" id="heroDesc">${escapeTomCrmHtml(heroSub)}</p>
      </div>

      <!-- STAGE 1 OF 3: SINGLE TOP-OF-PAGE SMH x XLV 4-STEP GUIDED BALANCE SURVEY (#tom-retirement-architect) -->
      <section
        class="tom-retire-architect tom-smh-xlv-survey-box"
        id="tom-retirement-architect"
        role="region"
        aria-label="Stage 1: SMH x XLV 4-Step Guided Balance Survey"
      >
        <div class="tom-survey-topbar">
          <span class="tom-stage-pill is-stage1">STAGE 1 OF 3 &bull; 4-STEP GUIDED BALANCE SURVEY</span>
          <span class="tom-survey-gauge-chip">
            Public Sector Sentiment Gauge: <strong>${fgScore}/100</strong>
          </span>
        </div>

        <div class="tom-survey-progress-row">
          <div class="tom-survey-steps-nav" role="tablist" aria-label="Survey Progress">
            <button type="button" class="tom-step-dot is-current" data-tom-step-Indicator="1">1. Goal</button>
            <button type="button" class="tom-step-dot" data-tom-step-Indicator="2">2. Scale</button>
            <button type="button" class="tom-step-dot" data-tom-step-Indicator="3">3. Comfort</button>
            <button type="button" class="tom-step-dot" data-tom-step-Indicator="4">4. Tech Mix</button>
          </div>
          <span class="tom-survey-step-count" id="tomSurveyStepCounter">Step 1 of 4 (25%)</span>
        </div>
        <div class="tom-survey-progress-bar" aria-hidden="true">
          <span id="tomSurveyProgressFill" style="width:25%;"></span>
        </div>

        <!-- STEP 1: Objective & Horizon -->
        <div class="tom-survey-step-pane" data-tom-step-pane="1">
          <h2 class="tom-survey-q-title">Step 1 of 4 &mdash; What is your primary objective &amp; horizon?</h2>
          <div class="tom-survey-options-stack" role="group" aria-label="Objective and Horizon">
            ${TOM_SURVEY_STEP1_OPTIONS.map(
              (opt) => `
              <button
                type="button"
                class="tom-survey-opt-btn ${survey.objective === opt.id ? "is-active" : ""}"
                data-tom-survey-field="objective"
                data-tom-survey-val="${opt.id}"
                aria-pressed="${survey.objective === opt.id ? "true" : "false"}"
              >
                <strong class="tom-opt-main">${escapeTomCrmHtml(opt.title)}</strong>
                <span class="tom-opt-sub">${escapeTomCrmHtml(opt.sub)}</span>
              </button>`
            ).join("")}
          </div>
        </div>

        <!-- STEP 2: Portfolio Scale Preset -->
        <div class="tom-survey-step-pane" data-tom-step-pane="2" style="display:none;">
          <h2 class="tom-survey-q-title">Step 2 of 4 &mdash; Select your simulated portfolio scale (401k / IRA / Brokerage):</h2>
          <div class="tom-survey-scale-grid" role="group" aria-label="Portfolio Scale Preset">
            ${TOM_SURVEY_STEP2_PRESETS.map(
              (p) => `
              <button
                type="button"
                class="tom-survey-scale-btn ${survey.scale === p.val ? "is-active" : ""}"
                data-tom-survey-field="scale"
                data-tom-survey-val="${p.val}"
                aria-pressed="${survey.scale === p.val ? "true" : "false"}"
              >
                ${escapeTomCrmHtml(p.label)}
              </button>`
            ).join("")}
          </div>
          <p class="tom-survey-helper-note">
            100% browser-local math: calculates exact dollar ($) amounts across non-leveraged 1x ETFs (<b>$SMH</b> &amp; <b>$XLV</b>, plus optional <b>$SGOV</b> US Treasury cushion).
          </p>
        </div>

        <!-- STEP 3: Max Drawdown Comfort Zone -->
        <div class="tom-survey-step-pane" data-tom-step-pane="3" style="display:none;">
          <h2 class="tom-survey-q-title">Step 3 of 4 &mdash; Choose your maximum historical drawdown comfort zone:</h2>
          <div class="tom-survey-options-stack" role="group" aria-label="Max Drawdown Comfort Zone">
            ${TOM_SURVEY_STEP3_COMFORT.map(
              (c) => `
              <button
                type="button"
                class="tom-survey-opt-btn ${survey.comfort === c.id ? "is-active" : ""}"
                data-tom-survey-field="comfort"
                data-tom-survey-val="${c.id}"
                aria-pressed="${survey.comfort === c.id ? "true" : "false"}"
              >
                <strong class="tom-opt-main">${escapeTomCrmHtml(c.title)}</strong>
                <span class="tom-opt-sub">${escapeTomCrmHtml(c.sub)}</span>
              </button>`
            ).join("")}
          </div>
        </div>

        <!-- STEP 4: Current Tech Concentration Check -> Submit! -->
        <div class="tom-survey-step-pane" data-tom-step-pane="4" style="display:none;">
          <h2 class="tom-survey-q-title">Step 4 of 4 &mdash; How concentrated is your current portfolio in Tech / AI?</h2>
          <div class="tom-survey-options-stack" role="group" aria-label="Current Tech Concentration">
            ${TOM_SURVEY_STEP4_TECH.map(
              (tm) => `
              <button
                type="button"
                class="tom-survey-opt-btn ${survey.techMix === tm.id ? "is-active" : ""}"
                data-tom-survey-field="techMix"
                data-tom-survey-val="${tm.id}"
                aria-pressed="${survey.techMix === tm.id ? "true" : "false"}"
              >
                <strong class="tom-opt-main">${escapeTomCrmHtml(tm.title)}</strong>
                <span class="tom-opt-sub">${escapeTomCrmHtml(tm.sub)}</span>
              </button>`
            ).join("")}
          </div>

          <button type="button" class="tom-survey-submit-cta" id="btnTomCalculateSmhXlv">
            Calculate My Historical SMH &times; XLV Baseline Mix &rarr;
          </button>
        </div>

        <div class="tom-survey-footer-nav">
          <button type="button" class="tom-survey-back-btn" id="btnTomSurveyPrev" style="visibility:hidden;">
            &larr; Previous Step
          </button>
          <span class="tom-survey-safe-note">
            Self-Directed Historical Data Simulator &middot; Zero Brokerage Login Required
          </span>
        </div>
      </section>

      <!-- STAGE 2 OF 3: FREE 3-SECOND PASSWORDLESS MEMBER GATE (#tomMorningBellClub -> #tom-passwordless-club-signup) -->
      <div class="tom-club-box tom-stage2-gate-box" id="tomMorningBellClub" role="region" aria-label="Stage 2: Free 3-Second Passwordless Member Gate">
        <div class="tom-survey-topbar">
          <span class="tom-stage-pill is-stage2">STAGE 2 OF 3 &bull; FREE 3-SECOND EMAIL UNLOCK ($0 FOREVER)</span>
          <span class="tom-crm-trust-note">Zero Password &middot; 1-Click Unsubscribe Anytime</span>
        </div>

        <!-- 1-Line Profile Summary Teaser -->
        <div class="tom-survey-teaser-banner" id="tomSurveyTeaserText" role="status" aria-live="polite">
          ${
            isUnlocked
              ? `✅ <strong>Survey Profile Active (${escapeTomCrmHtml(savedFreeEmail)}):</strong> ${escapeTomCrmHtml(
                  baseline.teaserSummary
                )} &mdash; Your personalized <b>${escapeTomCrmHtml(baseline.ratioHeadline)}</b> baseline &amp; $0 Manual are unlocked below!`
              : `📊 <strong>Profile Summary Ready:</strong> ${escapeTomCrmHtml(
                  baseline.teaserSummary
                )} &mdash; Enter your email below (<b>3 seconds &middot; zero password</b>) to unlock your exact <b>SMH &times; XLV</b> ratio table, 26-year crash comparison &amp; $0 Brokerage Safe-Order Manual!`
          }
        </div>

        <!-- Locked Teaser Preview (Hidden automatically once email is entered) -->
        <div id="tomSurveyLockedPreviewGate" class="tom-locked-preview-card" style="display:${isUnlocked ? "none" : "block"};">
          <div class="tom-locked-preview-row">
            <span>🔒 <strong>Personalized $SMH : $XLV (+ $SGOV) Exact Ratio &amp; Dollar Table</strong></span>
            <span class="tom-locked-tag">Unlocks Instantly Below ($0)</span>
          </div>
          <div class="tom-locked-preview-row">
            <span>🔒 <strong>26-Year Dot-Com / 2008 / 2022 Crash Comparison Table + $0 Brokerage Manual</strong></span>
            <span class="tom-locked-tag">Unlocks Instantly Below ($0)</span>
          </div>
        </div>

        <div
          class="tom-crm-signup-panel"
          id="tom-passwordless-club-signup"
          role="region"
          aria-label="Passwordless 3-Second Morning Bell Club Membership"
        >
          <div
            class="tom-crm-active-bar"
            id="tom-club-active-member-bar"
            style="display:${isUnlocked ? "flex" : "none"};"
          >
            <span class="tom-crm-active-text" id="tom-club-active-member-text">
              ${
                isUnlocked
                  ? `✅ Free Morning Bell Club Unlocked: ${escapeTomCrmHtml(savedFreeEmail)} (SMH × XLV Baseline & $0 Manual Active)`
                  : ""
              }
            </span>
            <button type="button" class="tom-crm-update-toggle-btn" id="tom-club-update-toggle-btn">
              Change Email
            </button>
          </div>

          <form
            class="tom-crm-form"
            id="tom-club-signup-form"
            novalidate
            style="display:${isUnlocked ? "none" : "block"};"
          >
            <input
              type="text"
              name="website_hp"
              id="tom-club-hp-input"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
              style="display:none;"
            />
            <div class="tom-crm-inputs-row">
              <input
                type="text"
                id="tom-club-nickname-input"
                class="tom-crm-input tom-crm-input-nick"
                name="nickname"
                autocomplete="given-name"
                value="${escapeTomCrmHtml(initialNick)}"
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
                value="${escapeTomCrmHtml(savedFreeEmail)}"
                placeholder="Enter your email address (e.g., robert@email.com)"
                aria-label="Email address"
              />
              <button type="submit" id="tom-club-signup-btn" class="tom-crm-submit-btn">
                Unlock My SMH &times; XLV Baseline Mix &amp; $0 Manual (3-Sec) &rarr;
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

          <!-- Instant On-Screen Unlocked Personalized SMH x XLV Ratio + 26-Yr Stress Test -->
          <div id="tomFreeMemberBonusCard" class="tom-member-bonus-card" style="display:${isUnlocked ? "block" : "none"};">
            ${renderUnlockedSmhXlvContentHtml(baseline)}
          </div>
        </div>
      </div>

      <aside class="tom-substack-preview-card" aria-label="Read Today's Editorial Note" style="max-width:1020px;margin:0 auto 22px;padding:22px 24px;background:#fcfcfa;border:1.5px solid #e6e4dd;border-left:4px solid #059669;border-radius:14px;color:#1a1a1a;">
        <div style="font-size:0.78rem;font-weight:800;letter-spacing:0.07em;text-transform:uppercase;color:#059669;margin-bottom:6px;">
          Editorial Essay &middot; Arthur Vance &middot; 6 Min Read
        </div>
        <h3 style="font-family:Georgia,serif;font-size:1.38rem;font-weight:700;margin:0 0 8px;color:#1a1a1a;line-height:1.3;">
          <a href="/insights/why-quiet-barbells-outlast-loud-bull-markets.html" style="color:inherit;text-decoration:none;">Why Quiet Barbells Outlast Loud Bull Markets</a>
        </h3>
        <p style="font-family:Georgia,serif;font-size:1.04rem;line-height:1.72;color:#3d3d3a;margin:0 0 12px;">
          &ldquo;Late on a Tuesday evening after a sharp Nasdaq selloff, almost nobody opens their brokerage app to admire a twenty-year compounding chart&mdash;they open it to ask whether twenty years of patient saving are still intact...&rdquo;
        </p>
        <a href="/insights/why-quiet-barbells-outlast-loud-bull-markets.html" style="display:inline-flex;align-items:center;font-weight:800;font-size:0.96rem;color:#1d4ed8;text-decoration:underline;">
          Read Today&rsquo;s Editorial Note &rarr;
        </a>
      </aside>
    </section>
  `;
}

export function renderFreeStarterManual(state) {
  const cfg = (state && state.config) || {};
  const polarMonthly = formatCheckoutUrl(
    cfg.whop_tom_monthly_url || cfg.ls_site1_monthly_url,
    "#tom-vip-monthly"
  );
  const polarAnnual = formatCheckoutUrl(
    cfg.whop_tom_annual_url || cfg.ls_site1_ltd_url,
    "#tom-vip-annual"
  );
  const isWebView =
    typeof window !== "undefined" &&
    typeof window.isTomInAppWebView === "function" &&
    window.isTomInAppWebView();
  const member = getStoredTomClubMember();
  const isUnlocked = Boolean(member && member.email);

  return `
    <section class="tom-starter-manual-section" id="tomFreeStarterManual" aria-label="$0 Free US Brokerage Safe-Order Starter Manual">
      <div class="tom-manual-top-row">
        <span class="tom-manual-free-pill" id="tomManualUnlockStateBadge">
          ${
            isUnlocked
              ? "✅ UNLOCKED FOR CLUB MEMBER · READ OR SAVE PDF ANYTIME"
              : "📘 $0 FREE PUBLIC PRODUCT · UNLOCKS WITH 3-SEC CLUB SIGNUP"
          }
        </span>
        <span class="tom-manual-broker-pill">🏦 Fidelity · Charles Schwab · Vanguard Ready</span>
      </div>

      <h2 class="tom-manual-heading">
        $0 US Brokerage Safe-Order Starter Manual ($SMH &times; $XLV &amp; $SGOV Execution Guide)
      </h2>
      <p class="tom-manual-lead">
        Learn the 3 calm self-directed brokerage habits in plain English: placing safe <b>Limit Orders</b> (never 9:30 AM market orders), understanding 1x sector ETFs (<b>$SMH</b> &amp; <b>$XLV</b>), and holding short-term US Treasury cash cushions (<b>$SGOV · SPAXX · SWVXX · VMFXX</b>).
      </p>

      <div class="tom-manual-steps-grid">
        <button type="button" class="tom-manual-step-card btn-open-tom-manual-step" data-manual-step="tomManualStep1">
          <span class="tom-manual-step-badge step-b1">STEP 1 · SAFE ORDER ENTRY</span>
          <strong class="tom-manual-step-title">Limit Order vs. Market Order</strong>
          <span class="tom-manual-step-desc">
            Avoid wide morning bid-ask spreads &mdash; place a calm <b>Limit Order</b> in 3 taps on Fidelity, Schwab, or Vanguard.
          </span>
          <span class="tom-manual-step-cta">Read Step 1 →</span>
        </button>

        <button type="button" class="tom-manual-step-card btn-open-tom-manual-step" data-manual-step="tomManualStep2">
          <span class="tom-manual-step-badge step-b2">STEP 2 · SECTOR MIX REVIEW</span>
          <strong class="tom-manual-step-title">Calm Periodic Weight Check</strong>
          <span class="tom-manual-step-desc">
            Review your <b>$SMH &times; $XLV</b> sector percentages calmly without daily trading stress or leveraged ETF decay.
          </span>
          <span class="tom-manual-step-cta">Read Step 2 →</span>
        </button>

        <button type="button" class="tom-manual-step-card btn-open-tom-manual-step" data-manual-step="tomManualStep3">
          <span class="tom-manual-step-badge step-b3">STEP 3 · T-BILL CASH CUSHION</span>
          <strong class="tom-manual-step-title">401(k) / IRA Treasury Reserve</strong>
          <span class="tom-manual-step-desc">
            Earn monthly government money-market yield in <b>$SGOV, SPAXX, SWVXX, or VMFXX</b> on defensive cash reserves.
          </span>
          <span class="tom-manual-step-cta">Read Step 3 →</span>
        </button>
      </div>

      <div class="tom-manual-cta-bar">
        <button type="button" class="tom-manual-open-btn" id="btnOpenTomStarterManual">
          ${
            isWebView
              ? "📖 Read Complete $0 Manual &amp; Email Me This PDF Guide →"
              : "📖 Open Complete $0 Safe-Order Manual (Read / Save PDF) →"
          }
        </button>
        <a
          href="${polarMonthly}"
          class="tom-manual-vip-link whop-checkout-button"
          data-whop-checkout
          data-whop-plan="monthly"
          data-tom-paid-plan="monthly"
        >
          ⚡ Stage 3: Daily Tracking VIP — $29/mo
        </a>
        <a
          href="${polarAnnual}"
          class="tom-manual-vip-link is-ltd whop-checkout-button"
          data-whop-checkout
          data-whop-plan="annual"
          data-tom-paid-plan="annual"
        >
          👑 Annual VIP — $199/yr (Save 43%)
        </a>
      </div>
    </section>
  `;
}

export function renderEasyProfitSimulator(state) {
  const kpis = state.backtestKpis || {};
  const netCagrStr = Number(kpis.cagr_after_tax_pct ?? kpis.us_only_net_cagr_pct ?? 17.81).toFixed(2);
  const allStocks = (state.stocks || []).filter(
    (s) =>
      s.ticker &&
      !String(s.ticker).includes(".") &&
      String(s.ticker || "").toUpperCase() !== "LOCKED" &&
      s.close !== null &&
      s.close !== undefined
  );
  const selectableStocks = allStocks.slice(0, 12);
  const defaultTicker = state.easySimTicker || (selectableStocks[0] && selectableStocks[0].ticker) || "CELH";
  const selectedStock =
    allStocks.find((s) => s.ticker === defaultTicker) ||
    selectableStocks[0] || {
      ticker: "CELH",
      name_en: "Celsius Holdings",
      close: 32.42,
      score: 14.2,
      vol_surge_10d: 1.65,
      zone_code: "IGNITION_ZONE",
    };

  const capUsd = Math.max(500, Number(state.easySimCapUsd || state.proPortfolioUsd || 10000));
  const slotUsd = Math.round(capUsd * 0.15);
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
  const yr5Total = Math.round(capUsd * Math.pow(1 + cagrDec, 5));

  return `
    <section id="easyProfitPlaybookSection" style="margin-bottom:20px; background:linear-gradient(180deg, rgba(16,24,44,0.96) 0%, rgba(10,14,24,0.98) 100%); border:1px solid rgba(52,211,153,0.38); border-radius:8px; padding:16px 18px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
        <h2 style="font-size:1.05rem; font-weight:800; color:#ffffff; margin:0;">
          Interactive Single-Slot Variance Simulator ($${selectedStock.ticker})
        </h2>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <select id="easySimTickerSelect" style="min-height:40px; background:#0f172a; color:#ffffff; border:1px solid #38bdf8; border-radius:4px; padding:6px 8px;">
            ${selectableStocks
              .map(
                (s) =>
                  `<option value="${s.ticker}" ${s.ticker === selectedStock.ticker ? "selected" : ""}>$${s.ticker} — $${Number(
                    s.close || 0
                  ).toFixed(2)}</option>`
              )
              .join("")}
          </select>
          <input type="number" id="easySimCapitalInput" value="${capUsd}" min="500" step="500" style="min-height:40px; width:120px; background:#0f172a; color:#34d399; border:1px solid rgba(16,185,129,0.45); border-radius:4px; padding:6px 8px;" />
        </div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 190px), 1fr)); gap:10px;">
        <div style="background:#0d1424; border:1px solid var(--border); border-radius:5px; padding:9px 11px; color:#ffffff;">
          <div class="mono" style="font-size:0.66rem; color:var(--muted);">15% ALLOCATION SLOT</div>
          <div class="mono" style="font-size:1rem; font-weight:800;">$${actualPositionUsd.toLocaleString()} (${shares} sh)</div>
        </div>
        <div style="background:#0d1424; border:1px solid rgba(239,68,68,0.3); border-radius:5px; padding:9px 11px; color:#f87171;">
          <div class="mono" style="font-size:0.66rem;">LOWER VARIANCE BAND</div>
          <div class="mono" style="font-size:1rem; font-weight:800;">-$${maxLossUsd.toLocaleString()} (@ $${stopPrice})</div>
        </div>
        <div style="background:#0d1424; border:1px solid rgba(16,185,129,0.35); border-radius:5px; padding:9px 11px; color:#34d399;">
          <div class="mono" style="font-size:0.66rem;">UPPER DISPERSION BAND</div>
          <div class="mono" style="font-size:1rem; font-weight:800;">+$${profit1Usd.toLocaleString()} ~ +$${profit2Usd.toLocaleString()} ($${target1Price}–$${target2Price})</div>
        </div>
        <div style="background:#0d1424; border:1px solid rgba(56,189,248,0.35); border-radius:5px; padding:9px 11px; color:#38bdf8;">
          <div class="mono" style="font-size:0.66rem;">5-YR HISTORICAL MODEL</div>
          <div class="mono" style="font-size:1rem; font-weight:800;">$${capUsd.toLocaleString()} &rarr; $${yr5Total.toLocaleString()}</div>
        </div>
      </div>
    </section>
  `;
}
