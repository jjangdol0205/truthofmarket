/**
 * TruthOfMarket (Division 1) — Whop (@whop/checkout) Live PAYMENT_CONFIG,
 * Embedded Whop Checkout Modal + 1-Tap Direct Checkout Fallback,
 * ?payment=success&provider=whop&plan=monthly|annual Return Handler,
 * CRM Helper & 70% Scroll + 15s Dwell `read_complete` Beacon.
 */
(function initTomUnifiedWhopCheckoutAndBeacon() {
  if (typeof window === "undefined") return;
  window.__TOM_WHOP_WAITLIST_V3_LOADED__ = true;

  var WHOP_TOM_STARTER_PLAN_ID = "plan_xIpLzFNR8SlMz";
  var WHOP_TOM_MONTHLY_PLAN_ID = "plan_xVJeNwyrDef8T";
  var WHOP_TOM_ANNUAL_PLAN_ID = "plan_9sdgFI753ucXQ";
  var WHOP_TOM_MONTHLY_CH_ID = "ch_uFPUZl9jaGdNTvH";
  var WHOP_TOM_ANNUAL_CH_ID = "ch_G3EyPgGXTTahfv7";
  var WHOP_TOM_STARTER_URL = "https://whop.com/checkout/plan_xIpLzFNR8SlMz";
  var WHOP_TOM_MONTHLY_URL = "https://whop.com/checkout/plan_xVJeNwyrDef8T";
  var WHOP_TOM_ANNUAL_URL = "https://whop.com/checkout/plan_9sdgFI753ucXQ";
  var WHOP_TOM_STARTER_REDIRECT = "https://truthofmarket.com/?payment=success&provider=whop&plan=starter";
  var WHOP_TOM_MONTHLY_REDIRECT = "https://truthofmarket.com/?payment=success&provider=whop&plan=monthly";
  var WHOP_TOM_ANNUAL_REDIRECT = "https://truthofmarket.com/?payment=success&provider=whop&plan=annual";

  var DEFAULT_PAYMENT_CONFIG = {
    PROVIDER: "whop",
    DIVISION: "TOM",
    STORE_SLOT: "FINANCE_STORE_SLOT",
    STORE_LIVE_READY: true,
    COMPANY_ID: "biz_4ynqri19wFDIwm",
    STORE_NAME: "TruthOfMarket Research",
    WHOP_PLAN_IDS: {
      monthly: WHOP_TOM_MONTHLY_PLAN_ID,
      annual: WHOP_TOM_ANNUAL_PLAN_ID,
    },
    WHOP_CHECKOUT_CONFIG_IDS: {
      monthly: WHOP_TOM_MONTHLY_CH_ID,
      annual: WHOP_TOM_ANNUAL_CH_ID,
    },
    WHOP_CHECKOUT_URLS: {
      monthly: WHOP_TOM_MONTHLY_URL,
      annual: WHOP_TOM_ANNUAL_URL,
    },
    WHOP_REDIRECT_URLS: {
      monthly: WHOP_TOM_MONTHLY_REDIRECT,
      annual: WHOP_TOM_ANNUAL_REDIRECT,
    },
    WHOP_TOM_STARTER_URL: WHOP_TOM_STARTER_URL,
    WHOP_TOM_MONTHLY_URL: WHOP_TOM_MONTHLY_URL,
    WHOP_TOM_ANNUAL_URL: WHOP_TOM_ANNUAL_URL,
    SUPPORT_EMAIL: "hello@truthofmarket.com",
  };

  if (!window.PAYMENT_CONFIG || typeof window.PAYMENT_CONFIG !== "object") {
    window.PAYMENT_CONFIG = DEFAULT_PAYMENT_CONFIG;
  } else {
    window.PAYMENT_CONFIG.PROVIDER = "whop";
    window.PAYMENT_CONFIG.DIVISION = "TOM";
    window.PAYMENT_CONFIG.STORE_SLOT = window.PAYMENT_CONFIG.STORE_SLOT || "FINANCE_STORE_SLOT";
    window.PAYMENT_CONFIG.STORE_LIVE_READY = true;
    window.PAYMENT_CONFIG.COMPANY_ID = "biz_4ynqri19wFDIwm";
    window.PAYMENT_CONFIG.STORE_NAME = "TruthOfMarket Research";
    window.PAYMENT_CONFIG.WHOP_PLAN_IDS = {
      monthly: WHOP_TOM_MONTHLY_PLAN_ID,
      annual: WHOP_TOM_ANNUAL_PLAN_ID,
    };
    window.PAYMENT_CONFIG.WHOP_CHECKOUT_CONFIG_IDS = {
      monthly: WHOP_TOM_MONTHLY_CH_ID,
      annual: WHOP_TOM_ANNUAL_CH_ID,
    };
    window.PAYMENT_CONFIG.WHOP_CHECKOUT_URLS = {
      monthly: WHOP_TOM_MONTHLY_URL,
      annual: WHOP_TOM_ANNUAL_URL,
    };
    window.PAYMENT_CONFIG.WHOP_REDIRECT_URLS = {
      monthly: WHOP_TOM_MONTHLY_REDIRECT,
      annual: WHOP_TOM_ANNUAL_REDIRECT,
    };
    window.PAYMENT_CONFIG.WHOP_TOM_STARTER_URL = WHOP_TOM_STARTER_URL;
    window.PAYMENT_CONFIG.WHOP_TOM_MONTHLY_URL = WHOP_TOM_MONTHLY_URL;
    window.PAYMENT_CONFIG.WHOP_TOM_ANNUAL_URL = WHOP_TOM_ANNUAL_URL;
    window.PAYMENT_CONFIG.SUPPORT_EMAIL = window.PAYMENT_CONFIG.SUPPORT_EMAIL || "hello@truthofmarket.com";
  }

  window.TOM_COPY_MODE = "LIVE_SHARP";
  window.getTomCopyMode = function () {
    return "LIVE_SHARP";
  };

  function getKstDateString() {
    try {
      return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
    } catch (_) {
      return "2026-11-19";
    }
  }

  window.isTomInAppWebView = function () {
    try {
      var ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
      return /Instagram|FBAN|FBAV|KAKAOTALK|Line/i.test(ua);
    } catch (_) {
      return false;
    }
  };

  function getKnownTomMemberEmail() {
    try {
      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.getLocalMember === "function") {
        var crmRec = window.DreamCompanyCRM.getLocalMember("TOM");
        if (crmRec && crmRec.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(crmRec.email).trim())) {
          return String(crmRec.email).trim().toLowerCase();
        }
      }
      var rawDc = localStorage.getItem("dc_member_TOM");
      if (rawDc) {
        var parsedDc = JSON.parse(rawDc);
        if (parsedDc && parsedDc.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(parsedDc.email).trim())) {
          return String(parsedDc.email).trim().toLowerCase();
        }
      }
      var freeEmail = String(localStorage.getItem("tom_free_member_email") || localStorage.getItem("rsa_vip_email") || "").trim();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(freeEmail)) {
        return freeEmail.toLowerCase();
      }
    } catch (_) {}
    return "";
  }

  function resolveTomWhopPlanSpec(planKey) {
    var k = String(planKey || "").toLowerCase();
    if (k === "starter" || k === "low" || k === "workbook") {
      return {
        key: "starter",
        planId: WHOP_TOM_STARTER_PLAN_ID,
        checkoutConfigId: "",
        purchaseUrl: WHOP_TOM_STARTER_URL,
        redirectUrl: WHOP_TOM_STARTER_REDIRECT,
        title: "2000–2025 Crisis Workbook PDF",
        priceLabel: "$9 One-Time",
      };
    }
    if (k === "annual") {
      return {
        key: "annual",
        planId: WHOP_TOM_ANNUAL_PLAN_ID,
        checkoutConfigId: WHOP_TOM_ANNUAL_CH_ID,
        purchaseUrl: WHOP_TOM_ANNUAL_URL,
        redirectUrl: WHOP_TOM_ANNUAL_REDIRECT,
        title: "Annual Private Research Suite",
        priceLabel: "$199 / year (Save 43%)",
      };
    }
    return {
      key: "monthly",
      planId: WHOP_TOM_MONTHLY_PLAN_ID,
      checkoutConfigId: WHOP_TOM_MONTHLY_CH_ID,
      purchaseUrl: WHOP_TOM_MONTHLY_URL,
      redirectUrl: WHOP_TOM_MONTHLY_REDIRECT,
      title: "Monthly Research Pass",
      priceLabel: "$29 / month",
    };
  }

  window.resolveTomWhopCheckoutUrl = function (planKey) {
    return resolveTomWhopPlanSpec(planKey).purchaseUrl;
  };

  function ensureWhopLoaderScript() {
    try {
      if (typeof document === "undefined") return;
      var existing = document.querySelector('script[src*="js.whop.com/static/checkout/loader.js"]');
      if (existing) return;
      var sc = document.createElement("script");
      sc.src = "https://js.whop.com/static/checkout/loader.js";
      sc.async = true;
      sc.defer = true;
      (document.head || document.documentElement).appendChild(sc);
    } catch (_) {}
  }

  function postCrmRegistrationWithFallback(opts) {
    var cleanEmail = String((opts && opts.email) || "")
      .trim()
      .toLowerCase();
    var segment = String((opts && opts.segment) || "retirement_401k_ira").trim();
    var notes = String((opts && opts.notes) || "").trim();
    var lang = String((opts && opts.lang) || "en-US").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      return Promise.resolve({ ok: false, error: "INVALID_EMAIL" });
    }

    if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.registerMember === "function") {
      return window.DreamCompanyCRM.registerMember({
        action: "register_member",
        div: "TOM",
        email: cleanEmail,
        nickname: "",
        segment: segment,
        lang: lang,
        notes: notes,
        message: notes,
      });
    }

    var payload = {
      action: "register_member",
      div: "TOM",
      email: cleanEmail,
      nickname: "",
      segment: segment,
      message: notes,
      notes: notes,
      lang: lang,
      website_hp: "",
      source_url: window.location && window.location.href ? window.location.href : "https://truthofmarket.com/",
      client_ts: new Date().toISOString(),
    };

    try {
      localStorage.setItem(
        "dc_member_TOM",
        JSON.stringify({
          div: "TOM",
          email: cleanEmail,
          nickname: "",
          segment: segment,
          joined_at: payload.client_ts,
        })
      );
    } catch (_) {}

    function enqueueOffline() {
      try {
        var rawQ = localStorage.getItem("dc_crm_sync_queue_v1");
        var q = rawQ ? JSON.parse(rawQ) : [];
        if (!Array.isArray(q)) q = [];
        q.push(payload);
        localStorage.setItem("dc_crm_sync_queue_v1", JSON.stringify(q.slice(-25)));
      } catch (_) {}
      return { ok: true, queued_for_sync: true, div: "TOM", email: cleanEmail, segment: segment };
    }

    return fetch("/hq-mailing-endpoint.json?v=" + Math.floor(Date.now() / 300000), { cache: "no-store" })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (cfg) {
        var execUrl = cfg && cfg.webapp_exec_url ? String(cfg.webapp_exec_url).trim() : "";
        if (!execUrl || execUrl.indexOf("https://script.google.com/macros/s/") !== 0) {
          return enqueueOffline();
        }
        return fetch(execUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
          redirect: "follow",
        })
          .then(function (res) {
            return { ok: Boolean(res && res.ok), div: "TOM", email: cleanEmail, segment: segment };
          })
          .catch(function () {
            return enqueueOffline();
          });
      })
      .catch(function () {
        return enqueueOffline();
      });
  }

  window.submitTomVipWaitlistOrManualEmail = postCrmRegistrationWithFallback;

  function ensureWhopModalDom() {
    var existing = document.getElementById("tomWhopCheckoutModal");
    if (existing) return existing;

    var styleEl = document.getElementById("tomWhopCheckoutStyles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "tomWhopCheckoutStyles";
      styleEl.textContent = [
        "#tomWhopCheckoutModal,#tomWhopCheckoutModal *{box-sizing:border-box;}",
        "#tomWhopCheckoutModal{position:fixed;inset:0;z-index:10060;display:none;align-items:center;justify-content:center;padding:16px 12px;background:rgba(15,23,42,0.74);backdrop-filter:blur(6px);overflow-y:auto;}",
        "#tomWhopCheckoutDialog{position:relative;width:100%;max-width:640px;background:#ffffff;border:1.5px solid #065f46;border-radius:12px;padding:20px 20px 18px;color:#0f172a;box-shadow:0 24px 56px rgba(15,23,42,0.34);font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;max-height:calc(100vh - 28px);max-height:calc(100dvh - 28px);overflow-x:hidden;overflow-y:auto;margin:auto;}",
        ".tom-whop-top-row{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;}",
        ".tom-whop-kicker-pill{display:inline-block;background:#ecfdf5;border:1px solid #059669;color:#065f46;padding:5px 11px;border-radius:999px;font-size:11.5px;line-height:1.35;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;}",
        "#btnCloseTomWhopModal{appearance:none;flex-shrink:0;min-height:44px;min-width:72px;padding:8px 14px;border-radius:6px;border:1px solid #94a3b8;background:#f8fafc;color:#0f172a;font-weight:700;font-size:14px;cursor:pointer;}",
        "#btnCloseTomWhopModal:hover{background:#e2e8f0;}",
        ".tom-whop-plan-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0;}",
        ".tom-whop-tab-btn{padding:12px 14px;border-radius:8px;border:1.5px solid #cbd5e1;background:#f8fafc;color:#0f172a;text-align:left;cursor:pointer;font-family:inherit;transition:all 0.15s ease;}",
        ".tom-whop-tab-btn.is-selected{border-color:#065f46;background:#ecfdf5;color:#064e3b;box-shadow:0 0 0 2px rgba(6,95,70,0.15);}",
        ".tom-whop-direct-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;margin-bottom:12px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;}",
        ".tom-whop-direct-btn{display:inline-flex;align-items:center;justify-content:center;text-align:center;min-height:44px;padding:10px 14px;border-radius:6px;background:#065f46;color:#ffffff !important;font-size:13.5px;font-weight:700;text-decoration:none !important;white-space:normal;line-height:1.3;}",
        ".tom-whop-direct-btn:hover{background:#047857;}",
        "#tomWhopEmbedMount{min-height:480px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;padding:6px;overflow:visible;}",
        "#tomWhopEmbedMount iframe{width:100% !important;min-height:468px !important;border:0 !important;background:#ffffff !important;border-radius:6px;}",
        "@media(max-width:560px){.tom-whop-plan-tabs{grid-template-columns:1fr;}#tomWhopCheckoutDialog{padding:16px 14px;}.tom-whop-direct-btn{width:100%;}}",
      ].join("");
      document.head.appendChild(styleEl);
    }

    var backdrop = document.createElement("div");
    backdrop.id = "tomWhopCheckoutModal";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", "tomWhopModalTitle");
    backdrop.innerHTML =
      '<div id="tomWhopCheckoutDialog">' +
      '  <div class="tom-whop-top-row">' +
      '    <span class="tom-whop-kicker-pill">INDEPENDENT MARKET DATA &amp; EDUCATIONAL RESEARCH</span>' +
      '    <button type="button" id="btnCloseTomWhopModal" aria-label="Close checkout modal">Close</button>' +
      "  </div>" +
      '  <h3 id="tomWhopModalTitle" style="margin:0 0 6px;font-size:1.25rem;line-height:1.3;font-weight:800;color:#0f172a;">' +
      "    TruthOfMarket Research Pass &mdash; Secure Checkout" +
      "  </h3>" +
      '  <p style="margin:0;font-size:13.5px;line-height:1.5;color:#475569;">' +
      "    Non-Advisory Educational Research &middot; 2000&ndash;2025 SMH &times; XLV + SGOV Study" +
      "  </p>" +
      '  <div class="tom-whop-plan-tabs" role="radiogroup" aria-label="Select Research Pass">' +
      '    <button type="button" class="tom-whop-tab-btn" data-whop-tab="starter">' +
      '      <div style="font-size:10.5px;font-weight:700;color:#0369a1;letter-spacing:0.04em;">STEP 2 &middot; STARTER</div>' +
      '      <div style="font-size:16px;font-weight:800;margin:2px 0;">$9 <span style="font-size:12px;font-weight:500;color:#475569;">one-time</span></div>' +
      '      <div style="font-size:11.5px;color:#475569;">14p Crisis Workbook PDF</div>' +
      "    </button>" +
      '    <button type="button" class="tom-whop-tab-btn is-selected" data-whop-tab="monthly">' +
      '      <div style="font-size:10.5px;font-weight:700;color:#065f46;letter-spacing:0.04em;">STEP 3 &middot; CORE</div>' +
      '      <div style="font-size:16px;font-weight:800;margin:2px 0;">$29 <span style="font-size:12px;font-weight:500;color:#475569;">/ mo</span></div>' +
      '      <div style="font-size:11.5px;color:#475569;">Daily Newsletter + Workbook</div>' +
      "    </button>" +
      '    <button type="button" class="tom-whop-tab-btn" data-whop-tab="annual">' +
      '      <div style="font-size:10.5px;font-weight:700;color:#b45309;letter-spacing:0.04em;">STEP 4 &middot; SAVE 43%</div>' +
      '      <div style="font-size:16px;font-weight:800;margin:2px 0;">$199 <span style="font-size:12px;font-weight:500;color:#475569;">/ yr</span></div>' +
      '      <div style="font-size:11.5px;color:#475569;">12-Mo Suite + Masterbook</div>' +
      "    </button>" +
      "  </div>" +
      '  <div class="tom-whop-direct-bar">' +
      '    <span style="font-size:12.5px;color:#0f172a;font-weight:700;">Fastest on Mobile (Apple Pay &middot; Google Pay &middot; Card):</span>' +
      '    <a id="tomWhopDirectTopBtn" class="tom-whop-direct-btn" data-whop-direct-tab="1" href="' +
      WHOP_TOM_MONTHLY_URL +
      '" target="_blank" rel="noopener">Open Full-Screen Secure Checkout &rarr;</a>' +
      "  </div>" +
      '  <div id="tomWhopEmbedMount" aria-live="polite" style="margin-bottom:10px;"></div>' +
      '  <div style="margin-top:8px;padding-top:8px;border-top:1px solid #e2e8f0;font-size:12px;color:#475569;text-align:center;">' +
      '    Secure Checkout via Whop.com &middot; 7-Day Unopened Refund &middot; 1-Click Cancel &middot; <a href="mailto:hello@truthofmarket.com" style="color:#065f46;font-weight:700;">hello@truthofmarket.com</a>' +
      "  </div>" +
      "</div>";

    document.body.appendChild(backdrop);

    var closeBtn = document.getElementById("btnCloseTomWhopModal");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        backdrop.style.display = "none";
      });
    }
    backdrop.addEventListener("click", function (ev) {
      if (ev.target === backdrop) {
        backdrop.style.display = "none";
      }
    });

    backdrop.querySelectorAll("[data-whop-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var pk = btn.getAttribute("data-whop-tab") || "monthly";
        mountWhopPlanInModal(pk);
      });
    });

    return backdrop;
  }

  function mountWhopPlanInModal(planKey) {
    ensureWhopLoaderScript();
    var modal = ensureWhopModalDom();
    var spec = resolveTomWhopPlanSpec(planKey);

    modal.querySelectorAll("[data-whop-tab]").forEach(function (btn) {
      var active = btn.getAttribute("data-whop-tab") === spec.key;
      btn.classList.toggle("is-selected", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });

    var topDirect = document.getElementById("tomWhopDirectTopBtn");
    if (topDirect) topDirect.setAttribute("href", spec.purchaseUrl);

    var mount = document.getElementById("tomWhopEmbedMount");
    if (mount) {
      mount.innerHTML = "";
      var embedDiv = document.createElement("div");
      embedDiv.className = "whop-checkout-embed";
      embedDiv.setAttribute("data-whop-checkout-plan-id", spec.planId);
      embedDiv.setAttribute("data-whop-checkout-return-url", spec.redirectUrl);
      embedDiv.setAttribute("data-whop-checkout-redirect-url", spec.redirectUrl);
      embedDiv.setAttribute("data-whop-checkout-theme", "light");
      var savedEmail = getKnownTomMemberEmail();
      if (savedEmail) {
        embedDiv.setAttribute("data-whop-checkout-prefill-email", savedEmail);
      }
      mount.appendChild(embedDiv);
    }
  }

  window.openTomWhopCheckoutModal = function (planKey) {
    var modal = ensureWhopModalDom();
    var norm = String(planKey || "monthly").toLowerCase();
    if (norm !== "starter" && norm !== "annual") norm = "monthly";
    mountWhopPlanInModal(norm);
    modal.style.display = "flex";
  };
  window.openTomVipWaitlistModal = window.openTomWhopCheckoutModal;

  if (window.__TOM_PAYMENT_SYSTEM_READY__) return;
  window.__TOM_PAYMENT_SYSTEM_READY__ = true;

  ensureWhopLoaderScript();

  // 1. Unified Capture-Phase Paid Checkout Click Handler
  window.addEventListener(
    "click",
    function (e) {
      var el =
        e.target && e.target.closest
          ? e.target.closest("[data-whop-direct-tab], .whop-checkout-button, [data-whop-checkout], [data-tom-paid-plan]") ||
            e.target.closest("a, button, [role='button']")
          : null;
      if (!el) return;

      if (el.hasAttribute("data-whop-direct-tab")) {
        return;
      }

      var href = String(el.getAttribute("href") || "");
      var planAttr = String(el.getAttribute("data-tom-paid-plan") || el.getAttribute("data-whop-plan") || "").toLowerCase();
      var cls = String(el.className || "");

      var isPaidCta =
        cls.indexOf("whop-checkout-button") !== -1 ||
        el.hasAttribute("data-whop-checkout") ||
        Boolean(planAttr) ||
        href.indexOf("whop.com/checkout/plan_") !== -1 ||
        href.indexOf("#tom-vip-") === 0 ||
        href.indexOf("#tom-whop-") === 0;

      if (!isPaidCta) return;

      var txt = String(el.innerText || el.textContent || "").toLowerCase();
      var isStarter =
        planAttr === "starter" ||
        href.indexOf(WHOP_TOM_STARTER_PLAN_ID) !== -1 ||
        txt.indexOf("$9") !== -1;
      var isAnnual =
        planAttr === "annual" ||
        href.indexOf(WHOP_TOM_ANNUAL_PLAN_ID) !== -1 ||
        href.indexOf("annual") !== -1 ||
        txt.indexOf("199") !== -1 ||
        txt.indexOf("annual") !== -1;
      var planKey = isStarter ? "starter" : (isAnnual ? "annual" : "monthly");

      if (!e.__tomPaidClickTracked) {
        e.__tomPaidClickTracked = true;
        try {
          if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.trackFunnelEvent === "function") {
            window.DreamCompanyCRM.trackFunnelEvent("TOM", "checkout_click");
          }
        } catch (_) {}
      }

      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") {
        e.stopImmediatePropagation();
      }

      window.openTomWhopCheckoutModal(planKey);
    },
    true
  );

  // 2. Escape key closes Whop Checkout Modal
  window.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") {
      var wl = document.getElementById("tomWhopCheckoutModal");
      if (wl && wl.style.display === "flex") {
        wl.style.display = "none";
      }
    }
  });

  // 3. Handle ?payment=success&provider=whop&plan=monthly|annual cleanly on return
  function applyWhopCheckoutUnlock(orderRef, planSlug) {
    var rawPlanLow = String(planSlug || "monthly").toLowerCase();
    var cleanPlan = rawPlanLow === "annual" ? "annual" : (rawPlanLow === "starter" ? "starter" : "monthly");
    var cleanRef = String(orderRef || ("WHOP-PASS-2026-" + cleanPlan.toUpperCase())).trim();
    try {
      localStorage.setItem("rsa_pro_unlocked", "true");
      localStorage.setItem("rsa_token", cleanRef);
      localStorage.setItem("tom_whop_active_plan", cleanPlan);
      var kst = getKstDateString();
      if (localStorage.getItem("hq_paid_" + kst) !== "1") {
        localStorage.setItem("hq_paid_" + kst, "1");
        fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_member_" + kst, {
          mode: "cors",
          keepalive: true,
        }).catch(function () {});
        fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_member_total", {
          mode: "cors",
          keepalive: true,
        }).catch(function () {});
      }
    } catch (_) {}

    try {
      var knownEm = getKnownTomMemberEmail();
      var savedAns = {};
      try {
        savedAns = JSON.parse(localStorage.getItem("tom_pw_stepup_answers_v1") || "{}") || {};
      } catch (_) {}
      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.deliverPaidMagicPack === "function") {
        window.DreamCompanyCRM.deliverPaidMagicPack({
          div: "TOM",
          email: knownEm,
          plan_tier: cleanPlan === "annual" ? "Annual Research Pass ($199/yr)" : "Monthly Research Pass ($29/mo)",
          order_ref: cleanRef,
          base_url: "https://truthofmarket.com/",
          hash_anchor: "tomPaidScreen4Vault",
          profile_state: savedAns,
        });
      }
      window.dispatchEvent(new CustomEvent("tom:paid-unlocked", { detail: { orderRef: cleanRef, plan: cleanPlan } }));
    } catch (_) {}

    try {
      if (typeof document !== "undefined" && document.body && !document.getElementById("tomWhopReturnBanner")) {
        var planTitle = cleanPlan === "annual" ? "Annual Research Pass ($199/yr)" : "Monthly Research Pass ($29/mo)";
        var banner = document.createElement("div");
        banner.id = "tomWhopReturnBanner";
        banner.setAttribute("role", "status");
        banner.style.cssText =
          "max-width:820px;margin:16px auto 0;padding:14px 18px;border-radius:8px;background:#ecfdf5;border:1.5px solid #059669;color:#064e3b;font-family:'Inter',sans-serif;font-size:15px;line-height:1.55;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;";
        banner.innerHTML =
          "<div><strong>Whop Checkout Confirmed &mdash; " +
          planTitle +
          " Active.</strong> Your Paid Screen 4 Vault &amp; Protected 14-Page PDF are open below (<a href='mailto:hello@truthofmarket.com?subject=TOM%20Support%20or%20Refund' style='color:#065f46;font-weight:700;text-decoration:underline;'>1-Click Support</a>).</div>" +
          "<button type='button' data-csp-act='remove-parent' style='padding:6px 12px;border-radius:6px;border:1px solid #059669;background:#ffffff;color:#064e3b;font-weight:700;cursor:pointer;'>Dismiss</button>";
        document.body.insertBefore(banner, document.body.firstChild);
      }
    } catch (_) {}
  }

  window.unlockTomPaidScreen4 = applyWhopCheckoutUnlock;

  // 3. Handle ?payment=success&provider=whop return securely (NEVER trust bare URL params without server verification!)
  function setupWhopCheckoutSuccess() {
    try {
      var searchStr = (window.location && window.location.search) || "";
      if (searchStr.indexOf("payment=success") !== -1 || searchStr.indexOf("checkout_status=succeeded") !== -1) {
        var sp = new URLSearchParams(searchStr);
        var planParam = sp.get("plan") === "annual" ? "annual" : "monthly";
        var planTitle = planParam === "annual" ? "Annual Research Pass ($199/yr)" : "Monthly Research Pass ($29/mo)";
        var knownEm = sp.get("email") || sp.get("customer_email") || getKnownTomMemberEmail();
        var cid = sp.get("receipt_id") || sp.get("checkout_id") || "";

        if (knownEm && cid && window.DreamCompanyCRM && typeof window.DreamCompanyCRM.verifyEntitlement === "function") {
          window.DreamCompanyCRM.verifyEntitlement({ div: "TOM", email: knownEm, access_code: cid }).then(function (vres) {
            if (vres && vres.authorized) {
              applyWhopCheckoutUnlock(cid, planParam);
              return;
            }
            var m = document.getElementById("pwRestoreModal");
            if (m) m.classList.add("is-open");
          });
          return;
        }

        if (typeof document !== "undefined" && document.body && !document.getElementById("tomWhopReturnBanner")) {
          var banner = document.createElement("div");
          banner.id = "tomWhopReturnBanner";
          banner.setAttribute("role", "status");
          banner.style.cssText =
            "max-width:820px;margin:16px auto 0;padding:14px 18px;border-radius:8px;background:#ecfdf5;border:1.5px solid #059669;color:#064e3b;font-family:'Inter',sans-serif;font-size:15px;line-height:1.55;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;";
          banner.innerHTML =
            "<div><strong>Thank you for your " +
            planTitle +
            " order.</strong> Check your email for your Verified Access Code (arrives within 60 seconds), or click <strong>Verify Access</strong> to unlock your Paid Vault &amp; Protected 14-Page PDF.</div>" +
            "<button type='button' id='tomOpenVerifyFromBanner' style='padding:8px 14px;border-radius:6px;border:none;background:#0F2C22;color:#ffffff;font-weight:700;cursor:pointer;'>Verify Access &rarr;</button>";
          document.body.insertBefore(banner, document.body.firstChild);
          var btn = document.getElementById("tomOpenVerifyFromBanner");
          if (btn) {
            btn.addEventListener("click", function () {
              var m = document.getElementById("pwRestoreModal");
              if (m) m.classList.add("is-open");
            });
          }
        }
      }
    } catch (_) {}
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupWhopCheckoutSuccess);
  } else {
    setupWhopCheckoutSuccess();
  }

  // 4. Session-Scoped `read_complete` Beacon (Scroll Depth >= 70% AND Dwell Time >= 15000ms)
  (function bindReadCompleteBeacon() {
    var SESSION_KEY = "tom_read_complete_fired_v1";
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch (_) {}

    var reachedScroll70 = false;
    var reachedDwell15s = false;
    var fired = false;

    function maybeFireReadComplete() {
      if (fired || !reachedScroll70 || !reachedDwell15s) return;
      try {
        if (sessionStorage.getItem(SESSION_KEY) === "1") {
          fired = true;
          return;
        }
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch (_) {}
      fired = true;
      try {
        fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/read_complete", {
          mode: "cors",
          keepalive: true,
        }).catch(function () {});
      } catch (_) {}
    }

    function checkScrollDepth() {
      if (reachedScroll70) return;
      try {
        var docEl = document.documentElement || document.body;
        var scrollTop =
          window.pageYOffset ||
          (docEl && docEl.scrollTop) ||
          (document.body && document.body.scrollTop) ||
          0;
        var winH = window.innerHeight || (docEl && docEl.clientHeight) || 0;
        var fullH = Math.max(
          document.body ? document.body.scrollHeight : 0,
          docEl ? docEl.scrollHeight : 0,
          document.body ? document.body.offsetHeight : 0,
          docEl ? docEl.offsetHeight : 0,
          1
        );
        if (fullH <= winH * 1.05) {
          reachedScroll70 = true;
        } else if (scrollTop > 0) {
          var viewedRatio = (scrollTop + winH) / fullH;
          var trackRatio = scrollTop / Math.max(1, fullH - winH);
          if (viewedRatio >= 0.7 || trackRatio >= 0.7) {
            reachedScroll70 = true;
          }
        }
        if (reachedScroll70) {
          maybeFireReadComplete();
        }
      } catch (_) {}
    }

    window.addEventListener("scroll", checkScrollDepth, { passive: true });
    window.addEventListener("resize", checkScrollDepth, { passive: true });
    setTimeout(function () {
      reachedDwell15s = true;
      checkScrollDepth();
      maybeFireReadComplete();
    }, 15000);
  })();
})();
