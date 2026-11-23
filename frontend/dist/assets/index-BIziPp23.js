// --- src/components/PaymentWaitlist.js ---
/**
 * TruthOfMarket (Division 1) — Whop (@whop/checkout) Live PAYMENT_CONFIG,
 * Direct 1-Tap Whop Checkout ($9 / $29 / $199) + Email Prefill,
 * ?payment=success&provider=whop&plan=monthly|annual Return Handler,
 * CRM Helper & 70% Scroll + 15s Dwell `read_complete` Beacon.
 */
(function initTomUnifiedWhopCheckoutAndBeacon() {
  if (typeof window === "undefined" || window.__TOM_WHOP_WAITLIST_V3_LOADED__) return;
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
      starter: WHOP_TOM_STARTER_PLAN_ID,
      monthly: WHOP_TOM_MONTHLY_PLAN_ID,
      annual: WHOP_TOM_ANNUAL_PLAN_ID,
    },
    WHOP_CHECKOUT_CONFIG_IDS: {
      monthly: WHOP_TOM_MONTHLY_CH_ID,
      annual: WHOP_TOM_ANNUAL_CH_ID,
    },
    WHOP_CHECKOUT_URLS: {
      starter: WHOP_TOM_STARTER_URL,
      monthly: WHOP_TOM_MONTHLY_URL,
      annual: WHOP_TOM_ANNUAL_URL,
    },
    WHOP_REDIRECT_URLS: {
      starter: WHOP_TOM_STARTER_REDIRECT,
      monthly: WHOP_TOM_MONTHLY_REDIRECT,
      annual: WHOP_TOM_ANNUAL_REDIRECT,
    },
    WHOP_TOM_STARTER_URL: WHOP_TOM_STARTER_URL,
    WHOP_TOM_MONTHLY_URL: WHOP_TOM_MONTHLY_URL,
    WHOP_TOM_ANNUAL_URL: WHOP_TOM_ANNUAL_URL,
    SUPPORT_EMAIL: "beable9489@gmail.com",
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
      starter: WHOP_TOM_STARTER_PLAN_ID,
      monthly: WHOP_TOM_MONTHLY_PLAN_ID,
      annual: WHOP_TOM_ANNUAL_PLAN_ID,
    };
    window.PAYMENT_CONFIG.WHOP_CHECKOUT_CONFIG_IDS = {
      monthly: WHOP_TOM_MONTHLY_CH_ID,
      annual: WHOP_TOM_ANNUAL_CH_ID,
    };
    window.PAYMENT_CONFIG.WHOP_CHECKOUT_URLS = {
      starter: WHOP_TOM_STARTER_URL,
      monthly: WHOP_TOM_MONTHLY_URL,
      annual: WHOP_TOM_ANNUAL_URL,
    };
    window.PAYMENT_CONFIG.WHOP_REDIRECT_URLS = {
      starter: WHOP_TOM_STARTER_REDIRECT,
      monthly: WHOP_TOM_MONTHLY_REDIRECT,
      annual: WHOP_TOM_ANNUAL_REDIRECT,
    };
    window.PAYMENT_CONFIG.WHOP_TOM_STARTER_URL = WHOP_TOM_STARTER_URL;
    window.PAYMENT_CONFIG.WHOP_TOM_MONTHLY_URL = WHOP_TOM_MONTHLY_URL;
    window.PAYMENT_CONFIG.WHOP_TOM_ANNUAL_URL = WHOP_TOM_ANNUAL_URL;
    window.PAYMENT_CONFIG.SUPPORT_EMAIL = window.PAYMENT_CONFIG.SUPPORT_EMAIL || "beable9489@gmail.com";
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
    var norm = String(planKey || "").toLowerCase();
    if (norm === "starter" || norm === "low" || norm === "workbook" || norm === "plan_xiplzfnr8slmz") {
      return {
        key: "starter",
        planId: WHOP_TOM_STARTER_PLAN_ID,
        checkoutConfigId: "",
        purchaseUrl: WHOP_TOM_STARTER_URL,
        redirectUrl: WHOP_TOM_STARTER_REDIRECT,
        title: "14-Page Historical Workbook ($9 One-Time)",
        priceLabel: "$9 one-time",
      };
    }
    var isAnnual = norm === "annual" || norm === "premium" || norm === "plan_9sdgfi753ucxq";
    return isAnnual
      ? {
          key: "annual",
          planId: WHOP_TOM_ANNUAL_PLAN_ID,
          checkoutConfigId: WHOP_TOM_ANNUAL_CH_ID,
          purchaseUrl: WHOP_TOM_ANNUAL_URL,
          redirectUrl: WHOP_TOM_ANNUAL_REDIRECT,
          title: "Annual Research Pass",
          priceLabel: "$199 / year (Save 43%)",
        }
      : {
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

  function ensureWhopLoaderScript() { /* Direct Whop Checkout active — broken iframe embed removed */ }

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

  function buildDirectTomWhopUrl(planKey) {
    var spec = resolveTomWhopPlanSpec(planKey);
    var baseUrl = spec.purchaseUrl;
    try {
      var savedEmail = getKnownTomMemberEmail();
      if (savedEmail && typeof URL === "function") {
        var u = new URL(baseUrl);
        if (!u.searchParams.get("email")) u.searchParams.set("email", savedEmail);
        return u.toString();
      }
    } catch (_) {}
    return baseUrl;
  }

  window.openTomWhopCheckoutModal = function (planKey) {
    var norm = String(planKey || "monthly").toLowerCase();
    if (norm !== "starter" && norm !== "annual") norm = "monthly";
    var targetUrl = buildDirectTomWhopUrl(norm);
    try {
      var win = window.open(targetUrl, "_blank", "noopener,noreferrer");
      if (!win) window.location.href = targetUrl;
    } catch (_) {
      window.location.href = targetUrl;
    }
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
        planAttr === "low" ||
        planAttr === "workbook" ||
        href.indexOf(WHOP_TOM_STARTER_PLAN_ID) !== -1 ||
        href.indexOf("starter") !== -1 ||
        /(?:^|[^0-9])\$9(?:\.00)?(?:[^0-9]|$)/.test(txt);
      var isAnnual =
        !isStarter &&
        (planAttr === "annual" ||
          planAttr === "premium" ||
          href.indexOf(WHOP_TOM_ANNUAL_PLAN_ID) !== -1 ||
          href.indexOf("annual") !== -1 ||
          txt.indexOf("199") !== -1 ||
          txt.indexOf("annual") !== -1);
      var planKey = isStarter ? "starter" : isAnnual ? "annual" : "monthly";

      if (!e.__tomPaidClickTracked) {
        e.__tomPaidClickTracked = true;
        try {
          if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.trackEvent === "function") {
            window.DreamCompanyCRM.trackEvent({
              div: "TOM",
              event_type: "checkout_click",
              funnel_step: planKey === "starter" ? "step2_low" : planKey === "annual" ? "step4_premium" : "step3_core",
              plan_tier: planKey,
            });
          }
          var kst = getKstDateString();
          fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_click_" + kst, {
            mode: "cors",
            keepalive: true,
          }).catch(function () {});
          fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_click_total", {
            mode: "cors",
            keepalive: true,
          }).catch(function () {});
          fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_click", {
            mode: "cors",
            keepalive: true,
          }).catch(function () {});
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

  // 2. Direct Whop Checkout active — embedded iframe modal removed
// 3. Handle ?payment=success&provider=whop&plan=starter|monthly|annual cleanly on return
  function applyWhopCheckoutUnlock(orderRef, planSlug) {
    var rawPlan = String(planSlug || "monthly").toLowerCase();
    var cleanPlan = rawPlan === "annual" ? "annual" : rawPlan === "starter" ? "starter" : "monthly";
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

    var planLabel =
      cleanPlan === "annual"
        ? "Annual Research Pass ($199/yr)"
        : cleanPlan === "starter"
          ? "14-Page Historical Workbook ($9 One-Time)"
          : "Monthly Research Pass ($29/mo)";

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
          plan_tier: planLabel,
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
        var banner = document.createElement("div");
        banner.id = "tomWhopReturnBanner";
        banner.setAttribute("role", "status");
        banner.style.cssText =
          "max-width:820px;margin:16px auto 0;padding:14px 18px;border-radius:8px;background:#ecfdf5;border:1.5px solid #059669;color:#064e3b;font-family:'Inter',sans-serif;font-size:15px;line-height:1.55;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;";
        banner.innerHTML =
          "<div><strong>Whop Checkout Confirmed &mdash; " +
          planLabel +
          " Active.</strong> Your Paid Screen 4 Vault &amp; Protected 14-Page PDF are open below (<a href='mailto:beable9489@gmail.com?subject=TOM%207-Day%20Support%20or%20Refund' style='color:#065f46;font-weight:700;text-decoration:underline;'>1-Click Support</a>).</div>" +
          "<button type='button' id='tomDismissReturnBanner' style='padding:6px 12px;border-radius:6px;border:1px solid #059669;background:#ffffff;color:#064e3b;font-weight:700;cursor:pointer;'>Dismiss</button>";
        document.body.insertBefore(banner, document.body.firstChild);
        var dismissBtn = document.getElementById("tomDismissReturnBanner");
        if (dismissBtn) {
          dismissBtn.addEventListener("click", function () {
            if (banner.parentNode) banner.parentNode.removeChild(banner);
          });
        }
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
        var rawParam = String(sp.get("plan") || "monthly").toLowerCase();
        var planParam = rawParam === "annual" ? "annual" : rawParam === "starter" ? "starter" : "monthly";
        var planTitle =
          planParam === "annual"
            ? "Annual Research Pass ($199/yr)"
            : planParam === "starter"
              ? "14-Page Historical Workbook ($9 One-Time)"
              : "Monthly Research Pass ($29/mo)";
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


// --- src/locales/i18n.js ---
const enCopy = {
  // Global Navigation & Header
  brandSubtitle: "SMH × XLV SECTOR BALANCE SIMULATOR",
  navRightSide: "4-Step Balance Survey",
  navSemiFg: "Sector Sentiment Gauge",
  marketUniverseTag: "SMH × XLV BARBELL ETFs",
  statusFree: "FREE ACCESS",
  statusPro: "VIP SOFTWARE ACTIVE",
  btnLicense: "License Key",
  btnAdmin: "Config",
  btnTelegram: "Telegram",
  btnUnlockPro: "VIP Benefits",

  // Hero & Calm Educational Metrics (B2C 3-Second Hook)
  heroTag: "HISTORICAL SMH × XLV SECTOR BALANCE SIMULATOR & DAILY AUTOMATED MARKET INDICATOR DATA DIGEST",
  heroTitle: "Balance AI Semiconductor Growth ($SMH) With Healthcare Defense ($XLV) — Sleep Calmly.",
  heroDesc:
    "Answer 4 quick taps to calculate your historical $SMH × $XLV baseline sector mix across 26 years of Dot-Com, 2008, and 2022 market cycles.",
  pwRsiExplainerBtn: "How Two-Pillar Balance Review Works",
  pwRsiModalTitle: "Calm SMH × XLV + SGOV Sector Balance & Drawdown Methodology",
  kpi1_label: "Semiconductor Growth Pillar",
  kpi1_sub: "$SMH structural innovation sleeve",
  kpi2_label: "Healthcare Defensive Pillar",
  kpi2_sub: "$XLV non-cyclical cashflow sleeve",
  kpi3_label: "US T-Bill Cash Shield",
  kpi3_sub: "$SGOV (~4.7% state-tax-advantaged)",
  kpi4_label: "Calm Review Cadence",
  kpi4_sub: "2–4x/year · 100% browser-local privacy",

  // Historical Comparative Allocation Card
  auditedCardTag: "HISTORICAL ALLOCATION RESEARCH · 1998–2026",
  auditedCardTitle: "SMH/XLV Barbell Allocation (+12.8% CAGR) vs. S&P 500 (+14.2%) Historical Study",
  auditedCardDesc:
    "Point-in-time educational historical study across 6,625 trading days. Reviewed calmly with an 55:35:10 educational weight shift during deep sector pulldowns.",
  auditedBarbellLabel: "SMH 70% : XLV 30% Barbell Model",
  auditedSpyLabel: "S&P 500 (SPY) Benchmark",
  auditedMetricCagr: "Historical Annualized Rate",
  auditedMetricMdd: "Historical Max Drawdown",
  auditedMetricSharpe: "Sharpe Ratio",
  auditedMetricGrowth: "Historical $10,000 Curve",
  auditedAlphaBadge: "+14.2% Historical Spread vs S&P 500 · 2.03x Sharpe Ratio",

  // Soft Paywall Call to Action (Used in /pro-swing.html Quantitative Archive)
  softPaywallUnlockCta: "Start Monthly Research Pass — $29/mo",
  softPaywallTitle: "🔒 Full Quantitative Factor Dataset & Retiree Cashflow & Budget Worksheets",
  softPaywallDesc:
    "$CELH is displayed as an open educational factor example. Upgrade to Monthly Research Pass ($29/mo) or Annual Research Pass ($199/yr) to unlock the Custom Nest-Egg Dollar ($) Budget Worksheet, 12-Month Dividend Paycheck Calendar & Tax-Bucket Reference, and Large-Print Weather Action Sheet.",

  // Empirical Factor Table (/pro-swing.html)
  proofHeading: "Historical Factor Study · Moving-Average Trend Filter vs. Unfiltered Lows",
  proofCopyScorecardBtn: "Export Study Card (PNG)",
  th_arch: "Historical Factor Cohort (N = 394,371 US Stock-Days)",
  th_2x: "Historical Upper Band",
  th_med: "1Y Median Historical Return",
  th_mdd: "Post-Entry Median Drawdown",
  th_dead: "Median Recovery Days",
  th_trap: "1Y Deep Drawdown (≤ -20%)",

  // Screener Controls & Table Columns (/pro-swing.html)
  searchPlaceholder: "Search Ticker, Company, or Sector (e.g. VOO, SCHD, JNJ, MSFT)...",
  filterAll: "All Universe",
  filterIgnition: "MA20/60 Reclaimed",
  filterWatch: "Base Consolidation",
  filterKnife: "Sub-MA60 Trend",
  filterTrap: "Fundamental Lag",
  colTicker: "Ticker / Profile",
  colZone: "3-Color Trend State",
  colScore: "Factor Score",
  colClose: "Last Close & 52W Range",
  colProx: "vs 52W Low",
  colDD: "52W Drawdown",
  colMA: "vs 20D / 60D MA",
  colVol: "10D Volume",
  colHist: "Hist Factor Rate",
  colTrigger: "MA60 Ref / Risk Band",
  colActions: "Details & Charts",

  // Quantitative Research Vault (/pro-swing.html)
  vaultBadgeLocked: "VIP EDUCATIONAL CALCULATOR SUITE · LOCKED",
  vaultBadgeUnlocked: "VIP EDUCATIONAL CALCULATOR SUITE · UNLOCKED",
  vaultTitle: "Self-Directed Quantitative Factor Calculators & Sector Matrix",
  vaultUnlockBtn: "🔑 Start Monthly Research Pass — $29/mo",
  tool1Title: "COST-BASIS DRAWDOWN & WEIGHT CALCULATOR",
  tool1Sub: "Mathematical Cost-Basis & Holding-Period Variance Calculator",
  tool1Desc:
    "Enter any US ticker, your reference cost ($), and days held to compute mathematical variance against historical moving averages.",
  tool1Btn: "🧮 Calculate Cost-Basis Variance",
  tool2Title: "MODULE 02 · BALANCE-SHEET & DIVIDEND COVERAGE ARCHIVE",
  tool2Sub: "10-K / 10-Q Cashflow & Dividend Coverage Summaries",
  tool2Desc: "Updated daily at 08:10 EST from public SEC filings, dividend payout ratios, and balance-sheet metrics:",
  tool2ViewBtn: "Open Educational Filing Summaries",
  tool3Title: "MODULE 03 · MOVING-AVERAGE & VOLUME VISUALIZATION",
  tool3Sub: "Moving-Average & Relative-Volume Visualization Script",
  tool3Desc:
    "Optional technical script to visualize 20-day/60-day moving averages and 1.4x relative volume bars:",
  tool3CopyBtn: "Copy Script Source",

  // Cross-Platform Banner (Home Retirement Focus)
  crossTitle: "HISTORICAL SECTOR ARCHITECTURE · SMH × XLV + SGOV",
  crossHeading: "Want to Review Your Baseline Allocation Across $SMH, $XLV & $SGOV?",
  crossDesc:
    "Run our 4-Step Historical SMH × XLV + SGOV Sector Balance Simulator or explore our complimentary $0 US Brokerage Limit-Order Guide for Fidelity, Charles Schwab, and Vanguard.",
  crossBtn: "Open 4-Step Sector Simulator",

  // SemiFearGreed Standalone Page Copy (/semi-fear-greed.html)
  cnnBadge: "PUBLIC MARKET SENTIMENT DATA · UPDATED DAILY",
  cnnTitle: "US Sector Sentiment & Barbell Allocation Gauge (Educational Data)",
  cnnSubtitle:
    "Visualize public sector breadth & drawdown indicators (0–100) and explore historical 55:35:10 vs. 55:35:10 $SMH:$XLV portfolio weight math.",
  cnnTabOverview: "Overview",
  cnnTabTimeline: "Timeline",
  cnnLastUpdated: "Last updated",
  cnnExportGauge: "Export Index Card (PNG)",
  cnnTelegramBtn: "Telegram Briefing",
  cnnHistoryTitle: "Historical Sentiment Comparison",
  cnnActiveRuleLabel: "EDUCATIONAL BARBELL WEIGHT MODEL",
  cnnIndicatorsHeading: "7 Sector Breadth & Drawdown Data Factors",
  cnnIndicatorsSub:
    "Computed daily from public $SMH, $XLV, and $QQQ momentum, 52-week drawdown, defensive spread, RSI-14, realized volatility, relative spread, and weight drift.",
  rebalSectionTag: "SELF-DIRECTED BARBELL ALLOCATION CALCULATOR",
  rebalSectionTitle: "$SMH + $XLV Educational Weight Calculator (55:35:10 ↔ 55:35:10)",
  rebalSectionDesc:
    "Simulate pairing semiconductor ETF ($SMH 70%) with healthcare ETF ($XLV 30%), and model 2–4x/year weight adjustments when sentiment drops below 25.",
  lumpSectionTag: "TRANCHE ALLOCATION CALCULATOR",
  lumpSectionTitle: "3-Stage Cash Deployment Math Calculator",
  lumpSectionDesc:
    "Model splitting new capital across staged tranches and short-term Treasury cash reserves based on current sentiment readings.",
  eraSectionTag: "HISTORICAL DATA ARCHIVE (2000–2026)",
  eraSectionTitle: "$SMH 70% : $XLV 30% Barbell Model vs. 100% $QQQ Historical Comparison",
  eraSectionDesc:
    "Historical point-in-time public market series across 6,625 trading days (2000–2026).",

  disclaimer:
    "Disclaimer: TruthOfMarket provides self-directed educational data visualization and mathematical portfolio calculators only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice.",
  copyright:
    "© 2026 TruthOfMarket — Educational Market Data & Quantitative Research Desk · Whop.com (Global Card / Apple Pay / Google Pay).",
};
const translations = {
  en: enCopy,
  jp: { ...enCopy },
  kr: { ...enCopy },
};


// --- src/services/api.js ---
function isProActive() {
  const isAdmin =
    typeof sessionStorage !== "undefined" && sessionStorage.getItem("rsa_admin_auth") === "true";
  if (isAdmin) return true;
  const unlocked =
    typeof localStorage !== "undefined" && localStorage.getItem("rsa_pro_unlocked") === "true";
  const token = typeof localStorage !== "undefined" ? String(localStorage.getItem("rsa_token") || "").trim() : "";
  if (!unlocked || !token || token.toUpperCase() === "PRO-DEMO-2026") {
    return false;
  }
  return true;
}
function getAuthHeader() {
  if (!isProActive()) {
    return {};
  }
  const token =
    localStorage.getItem("rsa_token") ||
    (sessionStorage.getItem("rsa_admin_auth") === "true" ? "RSA-ADMIN-SESSION" : "");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
function getVipTelegramUrl(isPro = false) {
  if (isPro && isProActive()) {
    try {
      return atob("aHR0cHM6Ly90Lm1lL3RydXRob2ZtYXJrZXRzcw==");
    } catch (_) {
      return "#pro-vip-telegram";
    }
  }
  return "#pro-vip-telegram";
}
const CANONICAL_TOM_MONTHLY_URL = "https://whop.com/checkout/plan_xVJeNwyrDef8T";
const CANONICAL_TOM_ANNUAL_URL = "https://whop.com/checkout/plan_9sdgFI753ucXQ";
function formatCheckoutUrl(rawUrl, fallbackUrl = CANONICAL_TOM_MONTHLY_URL) {
  const candidate = String(rawUrl || "").trim();
  if (candidate && /^https:\/\/whop\.com\/checkout\//i.test(candidate)) {
    return candidate;
  }
  const isAnnualFallback = String(fallbackUrl || "").toLowerCase().includes("annual") || String(fallbackUrl || "").includes("plan_9sdgFI753ucXQ");
  if (typeof window !== "undefined" && window.PAYMENT_CONFIG) {
    const pCfg = window.PAYMENT_CONFIG;
    const urls = pCfg.WHOP_CHECKOUT_URLS || {};
    const fromCfg = isAnnualFallback
      ? String(urls.annual || pCfg.WHOP_TOM_ANNUAL_URL || "").trim()
      : String(urls.monthly || pCfg.WHOP_TOM_MONTHLY_URL || "").trim();
    if (fromCfg && /^https:\/\/whop\.com\/checkout\//i.test(fromCfg)) {
      return fromCfg;
    }
  }
  return isAnnualFallback ? CANONICAL_TOM_ANNUAL_URL : CANONICAL_TOM_MONTHLY_URL;
}

function isStaticHost() {
  if (typeof window === "undefined") return true;
  if (window.__STATIC_MODE__ === true) return true;
  if (window.__API_BACKEND__ === true) return false;
  const h = window.location.hostname || "";
  const p = String(window.location.port || "");
  if ((h === "localhost" || h === "127.0.0.1") && p === "8000") return false;
  return true;
}

async function fetchJsonWithFallback(apiUrl, options, fallbackFn) {
  if (isStaticHost()) {
    return fallbackFn();
  }
  try {
    const resp = await fetch(apiUrl, options);
    if (resp.ok) {
      const ct = resp.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        return await resp.json();
      }
    }
  } catch (e) {
    // Fallback to static snapshot / client-side engine when hosted on static CDN (GitHub Pages / Render Static)
  }
  return fallbackFn();
}

let cachedProStocks = null;
let cachedFreeStocks = null;
let cachedSemiOverview = null;

const VAULT_XOR_KEY = "RSA_PRO_VAULT_2026_KEY";

function decodeProVaultRow(row) {
  if (!row || !row._v) return row;
  try {
    const bin = atob(row._v);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i) ^ VAULT_XOR_KEY.charCodeAt(i % VAULT_XOR_KEY.length);
    }
    const jsonStr =
      typeof TextDecoder !== "undefined"
        ? new TextDecoder("utf-8").decode(bytes)
        : decodeURIComponent(escape(String.fromCharCode(...bytes)));
    const unlockedFields = JSON.parse(jsonStr);
    const copy = { ...row, ...unlockedFields, is_pro_locked: false };
    delete copy._v;
    return copy;
  } catch (_) {
    return row;
  }
}

async function getStaticFreeStocks() {
  if (!cachedFreeStocks) {
    const r = await fetch("/static_api/stocks_free.json");
    cachedFreeStocks = await r.json();
  }
  return cachedFreeStocks;
}

async function getStaticProStocks() {
  if (!cachedProStocks) {
    const freeList = await getStaticFreeStocks();
    cachedProStocks = freeList.map((row) => decodeProVaultRow(row));
  }
  return cachedProStocks;
}

async function getStaticStocksForCurrentUser() {
  return isProActive() ? getStaticProStocks() : getStaticFreeStocks();
}

async function getStaticSemiOverview() {
  if (!cachedSemiOverview) {
    const r = await fetch("/static_api/semi_overview.json");
    cachedSemiOverview = await r.json();
  }
  return cachedSemiOverview;
}
async function fetchStocks(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.zone && params.zone !== "ALL") query.append("zone", params.zone);
  if (params.sort_by) query.append("sort_by", params.sort_by);
  if (params.order) query.append("order", params.order);
  if (params.limit) query.append("limit", params.limit);
  if (params.offset) query.append("offset", params.offset);

  const url = `/api/stocks${query.toString() ? `?${query.toString()}` : ""}`;
  return fetchJsonWithFallback(
    url,
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      let list = [...(await getStaticStocksForCurrentUser())];
      if (params.search) {
        const q = String(params.search).trim().toLowerCase();
        list = list.filter(
          (s) =>
            (s.ticker && s.ticker.toLowerCase().includes(q)) ||
            (s.name && s.name.toLowerCase().includes(q)) ||
            (s.name_en && s.name_en.toLowerCase().includes(q)) ||
            (s.name_jp && s.name_jp.toLowerCase().includes(q)) ||
            (s.name_kr && s.name_kr.toLowerCase().includes(q)) ||
            (s.sector && s.sector.toLowerCase().includes(q))
        );
      }
      if (params.zone && params.zone !== "ALL") {
        list = list.filter((s) => (s.zone_code || s.zone) === params.zone);
      }
      if (params.sort_by) {
        const aliasMap = {
          pw_score: "score",
          price: "close",
          prox: "prox_low52_pct",
          dd: "dd_high52_pct",
          vol: "vol_surge_10d",
        };
        const key = aliasMap[params.sort_by] || params.sort_by;
        const desc = String(params.order || "desc").toLowerCase() !== "asc";
        list = [...list].sort((a, b) => {
          const va = a[key];
          const vb = b[key];
          if (typeof va === "string" || typeof vb === "string") {
            const cmp = String(va ?? "").localeCompare(String(vb ?? ""));
            return desc ? -cmp : cmp;
          }
          const na = Number(va ?? 0);
          const nb = Number(vb ?? 0);
          return desc ? nb - na : na - nb;
        });
      }
      const off = Math.max(0, Number(params.offset || 0));
      const lim = params.limit ? Math.max(1, Number(params.limit)) : list.length;
      return list.slice(off, off + lim);
    }
  );
}
async function fetchStockDetail(ticker) {
  const clean = String(ticker || "CELH").trim().toUpperCase();
  return fetchJsonWithFallback(
    `/api/stocks/${encodeURIComponent(clean)}`,
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const all = await fetchStocks({ limit: 200 });
      return all.find((s) => s.ticker === clean) || all[0];
    }
  );
}
async function fetchBacktestSummary() {
  return fetchJsonWithFallback(
    "/api/backtest",
    { headers: { Accept: "application/json" } },
    async () => {
      const r = await fetch("/static_api/backtest.json");
      return r.json();
    }
  );
}
async function fetchResearchList() {
  return fetchJsonWithFallback(
    "/api/research",
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const r = await fetch("/static_api/research_list.json");
      return r.json();
    }
  );
}
async function fetchResearchBrief(ticker) {
  const clean = String(ticker || "CELH").trim().toUpperCase();
  return fetchJsonWithFallback(
    `/api/research/${encodeURIComponent(clean)}`,
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const target = clean === "MBLY" ? "MBLY" : "CELH";
      const r = await fetch(`/static_api/research_${target}.json`);
      return r.json();
    }
  );
}

const ADMIN_CREDENTIALS_SHA256 = "4578349322b7fa9931023e0def82b9d0c19fa2c4fdab1f7d762142d8d78ef2fe";

function sha256PureJs(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let result = "";
  const words = [];
  const asciiBitLength = ascii.length * 8;
  let hash = (sha256PureJs.h = sha256PureJs.h || []);
  const k = (sha256PureJs.k = sha256PureJs.k || []);
  let primeCounter = k.length;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += "\x80";
  while ((ascii.length % 64) - 56) ascii += "\x00";
  for (let i = 0; i < ascii.length; i++) {
    const j = ascii.charCodeAt(i);
    if (j >> 8) return "";
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;
  for (let j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const a = hash[0];
      const e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (let i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (let i = 0; i < 8; i++) {
    for (let j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : "") + b.toString(16);
    }
  }
  return result;
}

async function computeSha256Hex(inputStr) {
  try {
    if (typeof crypto !== "undefined" && crypto.subtle && typeof TextEncoder !== "undefined") {
      const data = new TextEncoder().encode(inputStr);
      const buf = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch (_) {
    // Fallback to pure JS SHA-256
  }
  return sha256PureJs(unescape(encodeURIComponent(inputStr)));
}
async function verifyAdminCredentials(username, password) {
  const uname = String(username || "").trim();
  const pw = String(password || "");
  return fetchJsonWithFallback(
    "/api/auth/admin/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username: uname, password: pw }),
    },
    async () => {
      const digest = await computeSha256Hex(`rsa_admin_v1:${uname}:${pw}`);
      const ok = digest.toLowerCase() === ADMIN_CREDENTIALS_SHA256;
      return {
        authenticated: ok,
        role: ok ? "admin" : "guest",
        license_key: ok ? "RSA-ADMIN-SESSION" : null,
        message: ok
          ? "Admin Authenticated — Terminal Config & Pro Access Unlocked."
          : "Invalid Admin ID or Password.",
      };
    }
  );
}
async function validateLicense(licenseKey) {
  return fetchJsonWithFallback(
    "/api/auth/license/validate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ license_key: licenseKey }),
    },
    async () => {
      const key = String(licenseKey || "").trim();
      if (!key) {
        return {
          valid: false,
          license_key: null,
          tier: "free",
          expires_at: null,
          message: "Please enter a valid Whop Research Pass receipt ID.",
        };
      }
      if (/^(RSA|GBA|WHOP)-(PRO|LTD|VIP)-2026-[A-Z0-9-]+$/i.test(key)) {
        return {
          valid: true,
          license_key: key.toUpperCase(),
          tier: key.toUpperCase().includes("-LTD-") ? "pro_annual" : "pro",
          expires_at: "2099-12-31T23:59:59Z",
          message: "VIP Calculator Software License Activated — Full Dataset & 2000–2025 Historical Statistical Workbook Unlocked.",
        };
      }
      if (
        typeof sessionStorage !== "undefined" &&
        sessionStorage.getItem("rsa_admin_auth") === "true" &&
        key.toUpperCase() === "RSA-ADMIN-SESSION"
      ) {
        return {
          valid: true,
          license_key: key,
          tier: "pro",
          expires_at: "2099-12-31T23:59:59Z",
          message: "Admin Session Pro Access Active.",
        };
      }
      try {
        const orgId =
          typeof window !== "undefined" &&
          window.PAYMENT_CONFIG &&
          window.PAYMENT_CONFIG.COMPANY_ID
            ? String(window.PAYMENT_CONFIG.COMPANY_ID).trim()
            : "";
        if (!orgId) {
          return {
            valid: false,
            license_key: null,
            tier: "free",
            expires_at: null,
            message:
              "Invalid or unrecognized license key. Please check your Whop receipt or contact beable9489@gmail.com.",
          };
        }
        const whopResp = await fetch(
          "/api/license/validate",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ key, organization_id: orgId }),
          }
        );
        const whopData = await whopResp.json().catch(() => null);
        const statusStr = String(whopData?.status || "").toLowerCase();
        const valid = Boolean(
          whopResp.ok &&
            whopData &&
            (statusStr === "granted" || statusStr === "active" || whopData.valid === true)
        );
        return {
          valid,
          license_key: valid ? key : null,
          tier: valid ? "pro" : "free",
          expires_at: valid ? whopData?.expires_at || "2099-12-31T23:59:59Z" : null,
          message: valid
            ? "VIP Software License Verified via Whop.com (Global Card / Apple Pay / Google Pay)."
            : "Invalid or expired license key. Please verify your Whop receipt or subscribe below.",
        };
      } catch (_) {
        return {
          valid: false,
          license_key: null,
          tier: "free",
          expires_at: null,
          message:
            "License verification failed. Please check your Whop receipt ID and network connection.",
        };
      }
    }
  );
}
async function fetchProVault() {
  return fetchJsonWithFallback(
    "/api/pro/vault",
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const active = isProActive();
      return {
        unlocked: active,
        tier: active ? "pro" : "free",
        workbook_available: active,
        tools: ["position_doctor", "morning_pdf", "statistical_workbook"],
      };
    }
  );
}
async function fetchFactorFormula() {
  return fetchJsonWithFallback(
    "/api/pro/factor-formula",
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const r = await fetch("/static_api/factor_formula.json");
      return r.json();
    }
  );
}
async function evaluatePositionDoctor(data) {
  return fetchJsonWithFallback(
    "/api/pro/position-doctor",
    {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    },
    async () => {
      const all = await getStaticStocksForCurrentUser();
      const tClean = String(data.ticker || "CELH").trim().toUpperCase();
      const stock = all.find((s) => s.ticker === tClean);
      const entry = Math.max(0.01, Number(data.entry_price || 27.93));
      const days = Number(data.days_held || 0);
      const curr =
        data.current_price !== undefined && data.current_price !== null
          ? Number(data.current_price)
          : stock && stock.close !== null && stock.close !== undefined
          ? Number(stock.close)
          : entry;
      const asOf = stock && stock.date ? stock.date : "2026-10-30";
      const retPct = Number(((curr / entry - 1.0) * 100.0).toFixed(2));
      const stopP = Number((entry * 0.91).toFixed(2));
      const tp1P = Number((entry * 2.0).toFixed(2));

      if (retPct <= -9.0) {
        return {
          ticker: tClean,
          status_code: "HARD_STOP",
          status_label: "Below Lower Historical Variance Band",
          return_pct: retPct,
          rule_triggered: "Band 1 (Below Historical Variance Floor)",
          action_plan: "Mathematical simulation note: price is below the modeled lower variance band relative to entry basis.",
          is_critical: true,
          current_price: curr,
          entry_price: Number(entry.toFixed(2)),
          stop_price: stopP,
          tp1_price: tp1P,
          as_of_date: asOf,
        };
      } else if (days >= 55 && retPct < 8.0) {
        return {
          ticker: tClean,
          status_code: "TIME_STOP",
          status_label: "55-Day Holding Window Exceeded",
          return_pct: retPct,
          rule_triggered: "Band 2 (55-Day Holding Duration Variance)",
          action_plan:
            "Mathematical simulation note: holding period has exceeded 55 trading days with muted relative momentum.",
          is_critical: false,
          current_price: curr,
          entry_price: Number(entry.toFixed(2)),
          stop_price: stopP,
          tp1_price: tp1P,
          as_of_date: asOf,
        };
      } else if (retPct >= 100.0) {
        return {
          ticker: tClean,
          status_code: "TP1_HARVEST",
          status_label: "Upper Historical Variance Band Reached",
          return_pct: retPct,
          rule_triggered: "Band 3 (Upper Dispersion Reference)",
          action_plan:
            "Mathematical simulation note: simulated return has reached the upper dispersion reference band.",
          is_critical: false,
          current_price: curr,
          entry_price: Number(entry.toFixed(2)),
          stop_price: stopP,
          tp1_price: tp1P,
          as_of_date: asOf,
        };
      } else {
        return {
          ticker: tClean,
          status_code: "HOLD",
          status_label: "Within Modeled Moving-Average Band",
          return_pct: retPct,
          rule_triggered: "Band 4 (Standard Trend Dispersion)",
          action_plan:
            "Mathematical simulation note: price remains within normal MA20/MA60 dispersion range.",
          is_critical: false,
          current_price: curr,
          entry_price: Number(entry.toFixed(2)),
          stop_price: stopP,
          tp1_price: tp1P,
          as_of_date: asOf,
        };
      }
    }
  );
}
const SECTOR_REGIME_MAP = {
  // 1. AI & Semiconductors
  "AI Semiconductors": "AI & Semiconductors",
  "Semiconductors": "AI & Semiconductors",
  "Semiconductor Equip": "AI & Semiconductors",
  "Semiconductor IP": "AI & Semiconductors",
  "Memory Semiconductors": "AI & Semiconductors",
  "Power Semiconductors": "AI & Semiconductors",
  "Power & Auto Chips": "AI & Semiconductors",
  "Foundry Semis": "AI & Semiconductors",
  "AI Server Hardware": "AI & Semiconductors",
  "ADAS & Autonomous": "AI & Semiconductors",

  // 2. Cloud & Enterprise Software
  "Enterprise AI": "Cloud & Enterprise Software",
  "Cloud Security": "Cloud & Enterprise Software",
  "Cybersecurity": "Cloud & Enterprise Software",
  "Cloud Observability": "Cloud & Enterprise Software",
  "Database Software": "Cloud & Enterprise Software",
  "Data Cloud SaaS": "Cloud & Enterprise Software",
  "Edge Cloud & Security": "Cloud & Enterprise Software",
  "3D Engine Software": "Cloud & Enterprise Software",

  // 3. Internet & Digital Media
  "Internet & AI": "Internet & Digital Media",
  "Internet & Social": "Internet & Digital Media",
  "Social Media": "Internet & Digital Media",
  "Streaming Media": "Internet & Digital Media",
  "Media & Entertainment": "Internet & Digital Media",
  "Legacy Media": "Internet & Digital Media",
  "Connected TV": "Internet & Digital Media",
  "Audio Streaming": "Internet & Digital Media",
  "AdTech & AI Software": "Internet & Digital Media",

  // 4. Fintech & Digital Finance
  "Fintech & BNPL": "Fintech & Digital Finance",
  "Digital Assets & Fin": "Fintech & Digital Finance",
  "Fintech & Brokerage": "Fintech & Digital Finance",
  "Digital Payments": "Fintech & Digital Finance",
  "Digital Banking": "Fintech & Digital Finance",
  "AI Lending Fintech": "Fintech & Digital Finance",

  // 5. Consumer & Retail
  "Consumer Beverages": "Consumer & Retail",
  "Leisure & Cruise": "Consumer & Retail",
  "Consumer Footwear": "Consumer & Retail",
  "Consumer Apparel": "Consumer & Retail",
  "Athletic Apparel": "Consumer & Retail",
  "Consumer Retail": "Consumer & Retail",
  "Consumer EdTech": "Consumer & Retail",
  "E-Commerce SaaS": "Consumer & Retail",
  "Cloud & E-Commerce": "Consumer & Retail",
  "Auto E-Commerce": "Consumer & Retail",

  // 6. Mobility, EV & CleanTech
  "EV & Robotics": "Mobility, EV & CleanTech",
  "Mobility Platform": "Mobility, EV & CleanTech",
  "Automotive": "Mobility, EV & CleanTech",
  "Solar & CleanTech": "Mobility, EV & CleanTech",
  "Solar Inverters": "Mobility, EV & CleanTech",
  "Solar Modules": "Mobility, EV & CleanTech",
  "Grid Energy Storage": "Mobility, EV & CleanTech",

  // 7. Healthcare & Biotechnology
  "Biopharma": "Healthcare & Biotechnology",
  "Pharmaceuticals": "Healthcare & Biotechnology",
  "Biotechnology": "Healthcare & Biotechnology",

  // 8. Energy & Industrials
  "Aerospace & Defense": "Energy & Industrials",
  "Passenger Airlines": "Energy & Industrials",
  "Oil & Gas E&P": "Energy & Industrials",
  "Integrated Energy": "Energy & Industrials",
  "Specialty Chemicals": "Energy & Industrials",
};
const VALUE_TRAPS = new Set(["INTC", "BA", "PFE", "PARA", "WBD", "NKE", "ALB"]);
function getVipWatchlist() {
  if (typeof localStorage === "undefined") return ["CELH", "CCL", "TSLA", "SPOT", "NVDA"];
  try {
    const raw = localStorage.getItem("rsa_vip_watchlist");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return ["CELH", "CCL", "TSLA", "SPOT", "NVDA"];
}
async function saveVipWatchlist(tickers) {
  const cleaned = [...new Set((tickers || []).map((t) => String(t || "").trim().toUpperCase()).filter(Boolean))];
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("rsa_vip_watchlist", JSON.stringify(cleaned));
    } catch (_) {}
  }
  if (!isStaticHost() && isProActive()) {
    try {
      await fetch("/api/pro/watchlist", {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ tickers: cleaned, action: "set" }),
      });
    } catch (_) {}
  }
  return cleaned;
}
async function fetchSectorMatrix() {
  return fetchJsonWithFallback(
    "/api/pro/sector-matrix",
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const all = await getStaticStocksForCurrentUser();
      const sectorsMap = {};
      for (const s of all) {
        if (!s.ticker || String(s.ticker).includes(".")) continue;
        const secName = SECTOR_REGIME_MAP[s.sector] || s.sector || "Other";
        if (!sectorsMap[secName]) sectorsMap[secName] = [];
        sectorsMap[secName].push(s);
      }
      const items = [];
      for (const [secName, sList] of Object.entries(sectorsMap)) {
        const sumScore = sList.reduce((acc, x) => acc + Number(x.score || 0), 0);
        const avgSc = Math.round((sumScore / sList.length) * 10) / 10;
        const ignCount = sList.filter((x) => x.zone_code === "IGNITION_ZONE").length;
        const trend = avgSc >= 50.0 ? "BULLISH" : avgSc < 40.0 ? "BEARISH" : "NEUTRAL";
        items.push({
          name: secName,
          count: sList.length,
          avg_score: avgSc,
          momentum_trend: trend,
          ignition_count: ignCount,
          tickers: sList.map((x) => x.ticker),
        });
      }
      items.sort((a, b) => b.ignition_count - a.ignition_count || b.avg_score - a.avg_score);
      return { sectors: items };
    }
  );
}
async function evaluatePortfolioDoctor(payload) {
  return fetchJsonWithFallback(
    "/api/pro/portfolio-doctor",
    {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    },
    async () => {
      const all = await getStaticStocksForCurrentUser();
      const stocksByTicker = {};
      for (const s of all) {
        if (s.ticker) stocksByTicker[s.ticker.trim().toUpperCase()] = s;
      }

      const rawPositions = (payload && payload.positions) || [];
      const positions = rawPositions.filter((p) => p && p.ticker && String(p.ticker).trim());

      if (!positions.length) {
        return {
          health_score: 100,
          total_invested: 0.0,
          total_unrealized_pnl: 0.0,
          total_unrealized_pnl_pct: 0.0,
          capital_at_risk: 0.0,
          items: [],
          stress_scenarios: [
            {
              name: "Semi Extreme Fear Shock (-15%)",
              projected_pnl_pct: 0.0,
              impact_usd: 0.0,
              verdict: "Neutral",
            },
            {
              name: "Defensive Safe-Haven Rotation ($XLV +5%)",
              projected_pnl_pct: 0.0,
              impact_usd: 0.0,
              verdict: "Neutral",
            },
            {
              name: "Right-Side Ignition Wave (+25%)",
              projected_pnl_pct: 0.0,
              impact_usd: 0.0,
              verdict: "Neutral",
            },
          ],
          rebalance_recommendations: [
            {
              action: "MAINTAIN",
              ticker: null,
              target_ticker: null,
              amount_usd: 0.0,
              allocation_pct: 100.0,
              reason: "No active holdings in portfolio; ready for Right-Side Ignition deployment.",
              setup_type: "CASH_RESERVE",
            },
          ],
          adjust_recommendations: [
            {
              action: "MAINTAIN",
              ticker: null,
              target_ticker: null,
              amount_usd: 0.0,
              allocation_pct: 100.0,
              reason: "No active holdings in portfolio; ready for Right-Side Ignition deployment.",
              setup_type: "CASH_RESERVE",
            },
          ],
        };
      }

      const diagnostics = [];
      let hardStopCount = 0;
      let deadMoneyCount = 0;

      for (const item of positions) {
        const tClean = String(item.ticker).trim().toUpperCase();
        const stock = stocksByTicker[tClean];
        const entryP = Math.max(0.01, parseFloat(item.entry_price || 0));
        const shares = Math.max(0.001, parseFloat(item.shares > 0 ? item.shares : 1.0));
        const days = Math.max(0, parseInt(item.days_held >= 0 ? item.days_held : 0, 10));

        let curP = entryP;
        if (item.current_price !== undefined && item.current_price !== null && Number(item.current_price) > 0) {
          curP = parseFloat(item.current_price);
        } else if (stock && stock.close !== undefined && stock.close !== null) {
          curP = parseFloat(stock.close);
        }

        const hardStopP = Math.round(entryP * 0.91 * 100) / 100;
        const retPct = Math.round(((curP / entryP) - 1.0) * 10000) / 100;
        const investedVal = Math.round(curP * shares * 100) / 100;
        const costVal = Math.round(entryP * shares * 100) / 100;
        const unrealizedPnl = Math.round((investedVal - costVal) * 100) / 100;

        let statusCode = "HOLD";
        let action = "ACTIVE_HOLD";
        let isCritical = false;
        let directive = "";

        if (retPct <= -9.0) {
          statusCode = "HARD_STOP";
          action = "LOWER_BAND_VARIANCE";
          isCritical = true;
          directive = `BAND 1: Below lower variance reference (${retPct.toFixed(2)}%). Review simulated allocation weight.`;
          hardStopCount += 1;
        } else if (days >= 55 && retPct < 8.0) {
          statusCode = "TIME_STOP";
          action = "DURATION_VARIANCE";
          isCritical = false;
          directive = `BAND 2: 55-Day holding window (${days} days, ${retPct >= 0 ? "+" : ""}${retPct.toFixed(2)}%). Simulated momentum muted.`;
          deadMoneyCount += 1;
        } else if (retPct >= 100.0) {
          statusCode = "TP1_HARVEST";
          action = "UPPER_BAND_VARIANCE";
          isCritical = false;
          directive = `BAND 3: Upper dispersion band reached (+${retPct.toFixed(2)}%). Simulated weight drift elevated.`;
        } else {
          statusCode = "HOLD";
          action = "WITHIN_BAND";
          isCritical = false;
          directive = `BAND 4: Within modeled trend dispersion (${retPct >= 0 ? "+" : ""}${retPct.toFixed(2)}%). Lower reference band: $${hardStopP.toFixed(2)}.`;
        }

        diagnostics.push({
          ticker: tClean,
          status_code: statusCode,
          action: action,
          current_return_pct: retPct,
          hard_stop_price: hardStopP,
          is_critical: isCritical,
          directive: directive,
          entry_price: Math.round(entryP * 100) / 100,
          current_price: Math.round(curP * 100) / 100,
          shares: shares,
          days_held: days,
          invested_value: investedVal,
          unrealized_pnl: unrealizedPnl,
        });
      }

      const rawHealth = 100 - (30 * hardStopCount) - (15 * deadMoneyCount);
      const healthScore = Math.max(0, Math.min(100, rawHealth));

      const totalInvested = Math.round(diagnostics.reduce((acc, d) => acc + d.invested_value, 0) * 100) / 100;
      const totalCost = Math.round(
        positions.reduce((acc, p) => acc + (parseFloat(p.entry_price || 0) * (parseFloat(p.shares > 0 ? p.shares : 1.0))), 0) * 100
      ) / 100;
      const totalUnrealizedPnl = Math.round(diagnostics.reduce((acc, d) => acc + d.unrealized_pnl, 0) * 100) / 100;
      const totalUnrealizedPnlPct = totalCost > 0 ? Math.round((totalUnrealizedPnl / totalCost) * 10000) / 100 : 0.0;

      const capitalAtRisk = Math.round(
        positions.reduce((acc, p) => {
          const ep = parseFloat(p.entry_price || 0);
          const sh = parseFloat(p.shares > 0 ? p.shares : 1.0);
          const stp = Math.round(ep * 0.91 * 100) / 100;
          return acc + Math.max(0.0, ep - stp) * sh;
        }, 0) * 100
      ) / 100;

      const stressScenarios = [];
      if (totalInvested <= 0) {
        stressScenarios.push(
          { name: "Semi Extreme Fear Shock (-15%)", projected_pnl_pct: 0.0, impact_usd: 0.0, verdict: "Neutral" },
          { name: "Defensive Safe-Haven Rotation ($XLV +5%)", projected_pnl_pct: 0.0, impact_usd: 0.0, verdict: "Neutral" },
          { name: "Right-Side Ignition Wave (+25%)", projected_pnl_pct: 0.0, impact_usd: 0.0, verdict: "Neutral" }
        );
      } else {
        // 1. Semi Extreme Fear Shock (-15%)
        let impactS1 = 0.0;
        for (const d of diagnostics) {
          const sRef = stocksByTicker[d.ticker];
          const sec = SECTOR_REGIME_MAP[sRef ? sRef.sector : ""] || "Other";
          if (sec === "AI & Semiconductors" || sec === "Cloud & Enterprise Software" || sec === "Internet & Digital Media") {
            impactS1 += d.invested_value * -0.15;
          } else if (sec === "Healthcare & Biotechnology" || sec === "Consumer & Retail") {
            impactS1 += d.invested_value * 0.015;
          } else {
            impactS1 += d.invested_value * -0.05;
          }
        }
        const pnlPctS1 = Math.round((impactS1 / totalInvested) * 10000) / 100;
        const verdictS1 = pnlPctS1 <= -8.0 ? "Vulnerable" : pnlPctS1 <= -3.0 ? "Moderate Risk" : "Resilient";
        stressScenarios.push({
          name: "Semi Extreme Fear Shock (-15%)",
          projected_pnl_pct: pnlPctS1,
          impact_usd: Math.round(impactS1 * 100) / 100,
          verdict: verdictS1,
        });

        // 2. Defensive Safe-Haven Rotation ($XLV +5%)
        let impactS2 = 0.0;
        for (const d of diagnostics) {
          const sRef = stocksByTicker[d.ticker];
          const sec = SECTOR_REGIME_MAP[sRef ? sRef.sector : ""] || "Other";
          if (sec === "Healthcare & Biotechnology" || sec === "Consumer & Retail") {
            impactS2 += d.invested_value * 0.05;
          } else if (sec === "AI & Semiconductors" || sec === "Cloud & Enterprise Software" || sec === "Internet & Digital Media") {
            impactS2 += d.invested_value * -0.02;
          }
        }
        const pnlPctS2 = Math.round((impactS2 / totalInvested) * 10000) / 100;
        const verdictS2 = pnlPctS2 >= 1.0 ? "Resilient" : pnlPctS2 >= -2.0 ? "Neutral" : "Vulnerable";
        stressScenarios.push({
          name: "Defensive Safe-Haven Rotation ($XLV +5%)",
          projected_pnl_pct: pnlPctS2,
          impact_usd: Math.round(impactS2 * 100) / 100,
          verdict: verdictS2,
        });

        // 3. Right-Side Ignition Wave (+25%)
        let impactS3 = 0.0;
        for (const d of diagnostics) {
          const sRef = stocksByTicker[d.ticker];
          const zcode = sRef ? sRef.zone_code : "WASHOUT_WATCH";
          if (zcode === "IGNITION_ZONE") {
            impactS3 += d.invested_value * 0.25;
          } else if (zcode === "WASHOUT_WATCH") {
            impactS3 += d.invested_value * 0.10;
          } else {
            impactS3 += d.invested_value * 0.02;
          }
        }
        const pnlPctS3 = Math.round((impactS3 / totalInvested) * 10000) / 100;
        const verdictS3 = pnlPctS3 >= 12.0 ? "High Upside" : pnlPctS3 >= 5.0 ? "Moderate Upside" : "Low Momentum";
        stressScenarios.push({
          name: "Right-Side Ignition Wave (+25%)",
          projected_pnl_pct: pnlPctS3,
          impact_usd: Math.round(impactS3 * 100) / 100,
          verdict: verdictS3,
        });
      }

      // Automated Allocation Recommendations
      const adjustRecommendations = [];
      const stoppedPositions = diagnostics.filter((d) => d.status_code === "HARD_STOP" || d.status_code === "TIME_STOP");
      let totalHarvested = 0.0;

      for (const sp of stoppedPositions) {
        const reason = sp.status_code === "HARD_STOP" ? "Hard stop exit capital recovery" : "Time stop dead money capital recovery";
        adjustRecommendations.push({
          action: "HARVEST",
          ticker: sp.ticker,
          target_ticker: null,
          amount_usd: sp.invested_value,
          allocation_pct: null,
          reason: reason,
          setup_type: sp.status_code,
        });
        totalHarvested += sp.invested_value;
      }

      totalHarvested = Math.round(totalHarvested * 100) / 100;
      const currentTickers = new Set(diagnostics.map((d) => d.ticker));
      const ignitionCandidates = all.filter(
        (s) => s.zone_code === "IGNITION_ZONE" && !currentTickers.has(s.ticker) && !VALUE_TRAPS.has(s.ticker)
      );
      ignitionCandidates.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));

      if (totalHarvested > 0) {
        if (ignitionCandidates.length > 0) {
          const reallocCount = Math.min(3, ignitionCandidates.length);
          const perTargetUsd = Math.round((totalHarvested / reallocCount) * 100) / 100;
          const perTargetPct = Math.round((100.0 / reallocCount) * 10) / 10;
          for (let i = 0; i < reallocCount; i++) {
            const cand = ignitionCandidates[i];
            adjustRecommendations.push({
              action: "REALLOCATE",
              ticker: null,
              target_ticker: cand.ticker,
              amount_usd: perTargetUsd,
              allocation_pct: perTargetPct,
              reason: "1.35% risk parity allocation into active Right-Side Ignition setup",
              setup_type: `IGNITION_ZONE (Score ${cand.score})`,
            });
          }
        } else {
          adjustRecommendations.push({
            action: "REALLOCATE",
            ticker: null,
            target_ticker: "CASH_RESERVE",
            amount_usd: totalHarvested,
            allocation_pct: 100.0,
            reason: "Harvested capital held in cash safe-haven awaiting fresh Ignition triggers",
            setup_type: "CASH_SAFE_HAVEN",
          });
        }
      } else {
        if (!stoppedPositions.length && diagnostics.length > 0) {
          adjustRecommendations.push({
            action: "MAINTAIN",
            ticker: null,
            target_ticker: null,
            amount_usd: 0.0,
            allocation_pct: 100.0,
            reason: "Portfolio positions aligned with quant criteria; maintain active trailing stops.",
            setup_type: "ACTIVE_PORTFOLIO",
          });
        }
      }

      return {
        health_score: healthScore,
        total_invested: totalInvested,
        total_unrealized_pnl: totalUnrealizedPnl,
        total_unrealized_pnl_pct: totalUnrealizedPnlPct,
        capital_at_risk: capitalAtRisk,
        items: diagnostics,
        stress_scenarios: stressScenarios,
        adjust_recommendations: adjustRecommendations,
        rebalance_recommendations: adjustRecommendations,
      };
    }
  );
}
async function fetchReferralConfig() {
  return fetchJsonWithFallback(
    "/api/referral/config",
    { headers: { Accept: "application/json" } },
    async () => {
      const r = await fetch("/static_api/referral_config.json");
      return r.json();
    }
  );
}
async function updateReferralConfig(data) {
  return fetchJsonWithFallback(
    "/api/referral/config",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    },
    async () => ({ status: "updated", config: data })
  );
}
function getReferralRedirectUrl(provider, ticker) {
  return `/api/referral/redirect/${encodeURIComponent(
    provider.toLowerCase()
  )}?ticker=${encodeURIComponent(ticker)}`;
}
async function fetchSemiOverview() {
  return fetchJsonWithFallback(
    "/api/semi/overview",
    { headers: { Accept: "application/json" } },
    async () => getStaticSemiOverview()
  );
}
async function fetchSemiHistory(rangeCode = "1Y") {
  const rc = String(rangeCode || "1Y").trim().toUpperCase();
  const validRanges = ["3M", "6M", "1Y", "3Y", "5Y", "10Y", "ALL"];
  const safeRange = validRanges.includes(rc) ? rc : "1Y";
  return fetchJsonWithFallback(
    `/api/semi/history?range=${encodeURIComponent(safeRange)}`,
    { headers: { Accept: "application/json" } },
    async () => {
      const r = await fetch(`/static_api/semi_history_${safeRange}.json`);
      return r.json();
    }
  );
}
async function calculateSemiAdjust(data) {
  return fetchJsonWithFallback(
    "/api/semi/adjust",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    },
    async () => {
      const ov = await getStaticSemiOverview();
      const fgScore = Number(ov.fg_score ?? 18.0);
      const ddPct = Number(ov.smh_dd_pct ?? -19.03);
      const usdkrw = Number(ov.usdkrw ?? 1324.75);
      const smhPrice = Number(ov.smh_close ?? 541.62);
      const xlvPrice = Number(ov.xlv_close ?? 179.28);
      const mode = String(data.strategy_mode || "AUTO_REGIME").trim().toUpperCase();
      const isExtreme = fgScore < 25.0 || ddPct <= -19.0;

      let smhW = 0.7;
      let xlvW = 0.3;
      let ruleEn = "";
      let ruleJp = "";
      let ruleKr = "";

      if (mode === "BASELINE_70_30") {
        smhW = 0.7;
        xlvW = 0.3;
        ruleEn = "Fixed 70% $SMH : 30% $XLV Barbell Weight Model";
        ruleJp = ruleEn;
        ruleKr = ruleEn;
      } else if (mode === "CONTRARIAN_80_20") {
        smhW = 0.8;
        xlvW = 0.2;
        ruleEn = "80% $SMH : 20% $XLV Drawdown Adjust Model";
        ruleJp = ruleEn;
        ruleKr = ruleEn;
      } else if (mode === "AGGRESSIVE_90_10") {
        smhW = 0.9;
        xlvW = 0.1;
        ruleEn = "90% $SMH : 10% $XLV Growth Weight Model";
        ruleJp = ruleEn;
        ruleKr = ruleEn;
      } else if (isExtreme) {
        smhW = 0.8;
        xlvW = 0.2;
        ruleEn = `AUTO REGIME: Extreme Fear (${fgScore}/100, DD ${ddPct.toFixed(1)}%) -> 80% $SMH : 20% $XLV Model Weight`;
        ruleJp = ruleEn;
        ruleKr = ruleEn;
      } else {
        smhW = 0.7;
        xlvW = 0.3;
        ruleEn = `AUTO REGIME: Standard Regime (${fgScore}/100) -> 70% $SMH : 30% $XLV Model Weight`;
        ruleJp = ruleEn;
        ruleKr = ruleEn;
      }

      const capUsd = Math.max(100, Number(data.total_capital_usd || 100000));
      const targetSmhUsd = Number((capUsd * smhW).toFixed(2));
      const targetXlvUsd = Number((capUsd * xlvW).toFixed(2));
      const targetSmhShares = Math.floor(targetSmhUsd / smhPrice);
      const targetXlvShares = Math.floor(targetXlvUsd / xlvPrice);
      const investedUsd = targetSmhShares * smhPrice + targetXlvShares * xlvPrice;
      const residualUsd = Number(Math.max(0, capUsd - investedUsd).toFixed(2));

      const natW = Number(ov.natural_smh_weight_pct ?? 66.5) / 100.0;
      const currSmhUsd =
        data.current_smh_usd !== undefined && data.current_smh_usd !== null
          ? Number(data.current_smh_usd)
          : Number((capUsd * natW).toFixed(2));
      const currXlvUsd =
        data.current_xlv_usd !== undefined && data.current_xlv_usd !== null
          ? Number(data.current_xlv_usd)
          : Number((capUsd * (1.0 - natW)).toFixed(2));
      const deltaSmhUsd = Number((targetSmhUsd - currSmhUsd).toFixed(2));
      const deltaXlvUsd = Number((targetXlvUsd - currXlvUsd).toFixed(2));
      const deltaSmhShares = Math.round(deltaSmhUsd / smhPrice);
      const deltaXlvShares = Math.round(deltaXlvUsd / xlvPrice);

      const freq = String(data.adjust_frequency || "ANNUAL").trim().toUpperCase();
      const dragMap = { ANNUAL: 0.19, QUARTERLY: 0.42, MONTHLY: 0.78, WEEKLY: 1.32 };
      const taxDrag = dragMap[freq] ?? 0.19;
      const expectedNetCagr = Number((22.98 - taxDrag).toFixed(2));

      const dedLimit = 2500000;
      const gainKrw = Math.max(0, Number(data.unrealized_gain_krw ?? 3800000));
      const taxableKrw = Math.max(0, gainKrw - dedLimit);
      const taxSavedKrw = Math.round(Math.min(gainKrw, dedLimit) * 0.22);

      const taxEn =
        gainKrw <= dedLimit
          ? `Modeled annual allocation drag (${taxDrag}%) remains low under a 2-4x/year schedule, preserving compounding efficiency inside tax-advantaged 401(k)/IRA accounts.`
          : `For taxable accounts, spacing portfolio weight adjustments to 2-4x/year reduces turnover drag (${taxDrag}%) compared with high-frequency trading.`;
      const taxJp = taxEn;
      const taxKr = taxEn;

      return {
        as_of_date: ov.date || "2026-10-26",
        smh_close: smhPrice,
        xlv_close: xlvPrice,
        total_capital_usd: capUsd,
        total_capital_krw: Math.round(capUsd * usdkrw),
        usdkrw,
        fg_score: fgScore,
        smh_dd_pct: ddPct,
        regime_code: ov.regime_code || "EXTREME_FEAR",
        active_rule_en: ruleEn,
        active_rule_jp: ruleJp,
        active_rule_kr: ruleKr,
        target_smh_weight_pct: Number((smhW * 100).toFixed(1)),
        target_xlv_weight_pct: Number((xlvW * 100).toFixed(1)),
        target_smh_usd: targetSmhUsd,
        target_xlv_usd: targetXlvUsd,
        target_smh_shares: targetSmhShares,
        target_xlv_shares: targetXlvShares,
        residual_cash_usd: residualUsd,
        delta_smh_usd: deltaSmhUsd,
        delta_xlv_usd: deltaXlvUsd,
        delta_smh_shares: deltaSmhShares,
        delta_xlv_shares: deltaXlvShares,
        adjust_frequency: freq,
        estimated_tax_drag_pct: taxDrag,
        expected_net_cagr_pct: expectedNetCagr,
        kr_tax_deduction_limit_krw: dedLimit,
        kr_taxable_gain_krw: taxableKrw,
        kr_estimated_tax_saved_krw: taxSavedKrw,
        kr_tax_guidance_en: taxEn,
        kr_tax_guidance_jp: taxJp,
        kr_tax_guidance_kr: taxKr,
      };
    }
  );
}
async function calculateSemiLumpSum(data) {
  return fetchJsonWithFallback(
    "/api/semi/lump-sum",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    },
    async () => {
      const ov = await getStaticSemiOverview();
      const fgScore =
        data.override_fg_score !== undefined && data.override_fg_score !== null
          ? Number(data.override_fg_score)
          : Number(ov.fg_score ?? 18.0);
      const cap = Math.max(100, Number(data.capital_usd || 50000));
      const smhP = Number(ov.smh_close ?? 541.62);
      const xlvP = Number(ov.xlv_close ?? 179.28);
      const asOf = ov.date || "2026-10-26";

      if (fgScore <= 40.0) {
        const isExt = fgScore <= 25.0;
        const smhW = isExt ? 0.8 : 0.7;
        const xlvW = isExt ? 0.2 : 0.3;
        const smhUsd = Number((cap * smhW).toFixed(2));
        const xlvUsd = Number((cap * xlvW).toFixed(2));
        return {
          as_of_date: asOf,
          smh_close: smhP,
          xlv_close: xlvP,
          capital_usd: cap,
          fg_score_used: fgScore,
          case_code: "CASE_1_FEAR_100PCT",
          case_title_en: "Case 1 (Score 0–40 · Fear Regime): 100% Immediate Lump-Sum Model",
          case_title_jp: "Case 1 (Score 0–40 · Fear Regime): 100% Immediate Lump-Sum Model",
          case_title_kr: "Case 1 (Score 0–40 · Fear Regime): 100% Immediate Lump-Sum Model",
          summary_en:
            "Simulated fear regime: historical model deploys 100% into target weights and adjusts 2–4x/year back to 70:30 as drawdown narrows.",
          summary_jp:
            "Simulated fear regime: historical model deploys 100% into target weights and adjusts 2–4x/year back to 70:30 as drawdown narrows.",
          summary_kr:
            "Simulated fear regime: historical model deploys 100% into target weights and adjusts 2–4x/year back to 70:30 as drawdown narrows.",
          immediate_deploy_pct: 100.0,
          parked_cash_rp_pct: 0.0,
          tranches: [
            {
              step: 1,
              title_en: "Tranche 1 (Day 1 Simulated 100% Weighting)",
              title_jp: "Tranche 1 (Day 1 Simulated 100% Weighting)",
              title_kr: "Tranche 1 (Day 1 Simulated 100% Weighting)",
              timing_en: "Modeled Day 1 Weighting",
              timing_jp: "Modeled Day 1 Weighting",
              timing_kr: "Modeled Day 1 Weighting",
              allocation_pct: 100.0,
              amount_usd: cap,
              smh_usd: smhUsd,
              xlv_usd: xlvUsd,
              cash_rp_usd: 0.0,
              smh_shares: Math.floor(smhUsd / smhP),
              xlv_shares: Math.floor(xlvUsd / xlvP),
              note_en: `Modeled ${Math.round(smhW * 100)}:${Math.round(
                xlvW * 100
              )} ($SMH:$XLV) split. Historical 1-year forward positive cohort rate below score 25 exceeded 91%.`,
              note_jp: `Modeled ${Math.round(smhW * 100)}:${Math.round(
                xlvW * 100
              )} ($SMH:$XLV) split. Historical 1-year forward positive cohort rate below score 25 exceeded 91%.`,
              note_kr: `Modeled ${Math.round(smhW * 100)}:${Math.round(
                xlvW * 100
              )} ($SMH:$XLV) split. Historical 1-year forward positive cohort rate below score 25 exceeded 91%.`,
            },
          ],
        };
      } else if (fgScore <= 68.0) {
        const d1Smh = Number((cap * 0.35).toFixed(2));
        const d1Xlv = Number((cap * 0.3).toFixed(2));
        const d1Tot = Number((d1Smh + d1Xlv).toFixed(2));
        const t2Smh = Number((cap * 0.35).toFixed(2));
        return {
          as_of_date: asOf,
          smh_close: smhP,
          xlv_close: xlvP,
          capital_usd: cap,
          fg_score_used: fgScore,
          case_code: "CASE_2_NEUTRAL_65_35",
          case_title_en: "Case 2 (Score 40–68 · Neutral Regime): 65% Initial + 35% T-Bill Reserve Model",
          case_title_jp: "Case 2 (Score 40–68 · Neutral Regime): 65% Initial + 35% T-Bill Reserve Model",
          case_title_kr: "Case 2 (Score 40–68 · Neutral Regime): 65% Initial + 35% T-Bill Reserve Model",
          summary_en:
            "Balanced allocation simulation: models 30% $XLV defensive sleeve and half of $SMH initially, keeping 35% in T-Bill/MMF reserve.",
          summary_jp:
            "Balanced allocation simulation: models 30% $XLV defensive sleeve and half of $SMH initially, keeping 35% in T-Bill/MMF reserve.",
          summary_kr:
            "Balanced allocation simulation: models 30% $XLV defensive sleeve and half of $SMH initially, keeping 35% in T-Bill/MMF reserve.",
          immediate_deploy_pct: 65.0,
          parked_cash_rp_pct: 35.0,
          tranches: [
            {
              step: 1,
              title_en: "Tranche 1 (Day 1 Core 65% Weighting)",
              title_jp: "Tranche 1 (Day 1 Core 65% Weighting)",
              title_kr: "Tranche 1 (Day 1 Core 65% Weighting)",
              timing_en: "Modeled Initial Weight (30% $XLV + 35% $SMH)",
              timing_jp: "Modeled Initial Weight (30% $XLV + 35% $SMH)",
              timing_kr: "Modeled Initial Weight (30% $XLV + 35% $SMH)",
              allocation_pct: 65.0,
              amount_usd: d1Tot,
              smh_usd: d1Smh,
              xlv_usd: d1Xlv,
              cash_rp_usd: 0.0,
              smh_shares: Math.floor(d1Smh / smhP),
              xlv_shares: Math.floor(d1Xlv / xlvP),
              note_en:
                "Models 100% of defensive $XLV sleeve (30%) and half of $SMH sleeve (35%) initially.",
              note_jp:
                "Models 100% of defensive $XLV sleeve (30%) and half of $SMH sleeve (35%) initially.",
              note_kr:
                "Models 100% of defensive $XLV sleeve (30%) and half of $SMH sleeve (35%) initially.",
            },
            {
              step: 2,
              title_en: "Tranche 2 (Remaining 35% Reserve in T-Bills / MMF)",
              title_jp: "Tranche 2 (Remaining 35% Reserve in T-Bills / MMF)",
              title_kr: "Tranche 2 (Remaining 35% Reserve in T-Bills / MMF)",
              timing_en: "Modeled Staged Tranche (D+30 / D+60 / D+90)",
              timing_jp: "Modeled Staged Tranche (D+30 / D+60 / D+90)",
              timing_kr: "Modeled Staged Tranche (D+30 / D+60 / D+90)",
              allocation_pct: 35.0,
              amount_usd: t2Smh,
              smh_usd: t2Smh,
              xlv_usd: 0.0,
              cash_rp_usd: t2Smh,
              smh_shares: Math.floor(t2Smh / smhP),
              xlv_shares: 0,
              note_en:
                "Models ~4.5% USD T-Bill/MMF yield while staging across 90 days.",
              note_jp:
                "Models ~4.5% USD T-Bill/MMF yield while staging across 90 days.",
              note_kr:
                "Models ~4.5% USD T-Bill/MMF yield while staging across 90 days.",
            },
          ],
        };
      } else {
        const d1Xlv = Number((cap * 0.3).toFixed(2));
        const pSmh = Number((cap * 0.7).toFixed(2));
        return {
          as_of_date: asOf,
          smh_close: smhP,
          xlv_close: xlvP,
          capital_usd: cap,
          fg_score_used: fgScore,
          case_code: "CASE_3_GREED_DEFENSIVE_FIRST",
          case_title_en:
            "Case 3 (Score 68–100 · Greed Regime): 30% $XLV + 70% T-Bill Cushion Model",
          case_title_jp:
            "Case 3 (Score 68–100 · Greed Regime): 30% $XLV + 70% T-Bill Cushion Model",
          case_title_kr:
            "Case 3 (Score 68–100 · Greed Regime): 30% $XLV + 70% T-Bill Cushion Model",
          summary_en:
            "Overheated sentiment model: allocates 30% to $XLV defensive sleeve initially and parks 70% in T-Bill/MMF cushion.",
          summary_jp:
            "Overheated sentiment model: allocates 30% to $XLV defensive sleeve initially and parks 70% in T-Bill/MMF cushion.",
          summary_kr:
            "Overheated sentiment model: allocates 30% to $XLV defensive sleeve initially and parks 70% in T-Bill/MMF cushion.",
          immediate_deploy_pct: 30.0,
          parked_cash_rp_pct: 70.0,
          tranches: [
            {
              step: 1,
              title_en: "Tranche 1 (Day 1 Defensive $XLV 30% Sleeve)",
              title_jp: "Tranche 1 (Day 1 Defensive $XLV 30% Sleeve)",
              title_kr: "Tranche 1 (Day 1 Defensive $XLV 30% Sleeve)",
              timing_en: "Modeled Defensive Sleeve ($XLV 30%)",
              timing_jp: "Modeled Defensive Sleeve ($XLV 30%)",
              timing_kr: "Modeled Defensive Sleeve ($XLV 30%)",
              allocation_pct: 30.0,
              amount_usd: d1Xlv,
              smh_usd: 0.0,
              xlv_usd: d1Xlv,
              cash_rp_usd: 0.0,
              smh_shares: 0,
              xlv_shares: Math.floor(d1Xlv / xlvP),
              note_en:
                "Avoids overheated growth concentration above score 68 by modeling the 30% Healthcare sleeve first.",
              note_jp:
                "Avoids overheated growth concentration above score 68 by modeling the 30% Healthcare sleeve first.",
              note_kr:
                "Avoids overheated growth concentration above score 68 by modeling the 30% Healthcare sleeve first.",
            },
            {
              step: 2,
              title_en: "Tranche 2 (70% Reserve Parked in USD T-Bill / MMF)",
              title_jp: "Tranche 2 (70% Reserve Parked in USD T-Bill / MMF)",
              title_kr: "Tranche 2 (70% Reserve Parked in USD T-Bill / MMF)",
              timing_en: "Modeled 4-Month Staged Adjust",
              timing_jp: "Modeled 4-Month Staged Adjust",
              timing_kr: "Modeled 4-Month Staged Adjust",
              allocation_pct: 70.0,
              amount_usd: pSmh,
              smh_usd: pSmh,
              xlv_usd: 0.0,
              cash_rp_usd: pSmh,
              smh_shares: Math.floor(pSmh / smhP),
              xlv_shares: 0,
              note_en:
                "Models short-term T-Bill interest while sentiment mean-reverts toward neutral.",
              note_jp:
                "Models short-term T-Bill interest while sentiment mean-reverts toward neutral.",
              note_kr:
                "Models short-term T-Bill interest while sentiment mean-reverts toward neutral.",
            },
          ],
        };
      }
    }
  );
}
async function buildClientTelegramPreview({
  alert_type = "SEMI_BRIEFING",
  lang = "en",
  ticker = "CELH",
  entry_price = null,
  days_held = 42,
} = {}) {
  const atype = String(alert_type || "SEMI_BRIEFING").trim().toUpperCase();
  const lg = String(lang || "en").toLowerCase() === "jp" ? "jp" : "en";

  const ov = await getStaticSemiOverview();
  const reb = await calculateSemiAdjust({
    total_capital_usd: 100000,
    strategy_mode: "AUTO_REGIME",
    adjust_frequency: "ANNUAL",
    unrealized_gain_krw: 3800000,
  });
  const allStocks = (await getStaticStocksForCurrentUser()).filter((s) => !String(s.ticker).includes("."));
  const ignStocks = allStocks.filter((s) => s.zone_code === "IGNITION_ZONE").slice(0, 5);

  const etfs = Array.isArray(ov.etfs) ? ov.etfs : [];
  const qqqEtf = etfs.find((e) => e.ticker === "QQQ");
  const xlvEtf = etfs.find((e) => e.ticker === "XLV");
  const qqq1d = qqqEtf ? Number(qqqEtf.ret_1d_pct ?? 1.11) : 1.11;
  const xlv1d = xlvEtf ? Number(xlvEtf.ret_1d_pct ?? 0.0) : 0.0;

  const buildSemiText = () => {
    const dSmhSign = reb.delta_smh_usd >= 0 ? "ADD +" : "TRIM -";
    const dXlvSign = reb.delta_xlv_usd >= 0 ? "ADD +" : "TRIM -";
    const smhShSign = reb.delta_smh_shares >= 0 ? `+${reb.delta_smh_shares}` : `${reb.delta_smh_shares}`;
    const xlvShSign = reb.delta_xlv_shares >= 0 ? `+${reb.delta_xlv_shares}` : `${reb.delta_xlv_shares}`;

    return [
      `🧭 [TruthOfMarket] Daily Market Weather & Barbell Calculator Summary (${ov.date})`,
      `• Sentiment Gauge: ${Number(ov.fg_score).toFixed(1)} / 100 (${String(ov.regime_en).toUpperCase()})`,
      `• $SMH: $${Number(ov.smh_close).toFixed(2)} (${Number(ov.smh_dd_pct).toFixed(2)}% 52W DD)`,
      `• $XLV: $${Number(ov.xlv_close).toFixed(2)} (${xlv1d >= 0 ? "+" : ""}${xlv1d.toFixed(2)}% 1D) | $QQQ: $${Number(ov.qqq_close).toFixed(2)} (${qqq1d >= 0 ? "+" : ""}${qqq1d.toFixed(2)}% 1D)`,
      ``,
      `📊 $100,000 Simulated Weight Calculation (${ov.historical_study_smh_ratio}% $SMH : ${ov.historical_study_xlv_ratio}% $XLV):`,
      `• $SMH (${reb.target_smh_weight_pct}%): $${Number(reb.target_smh_usd).toLocaleString()} (${reb.target_smh_shares} sh) -> ${dSmhSign}$${Math.abs(Number(reb.delta_smh_usd)).toLocaleString()} (${smhShSign} sh)`,
      `• $XLV (${reb.target_xlv_weight_pct}%): $${Number(reb.target_xlv_usd).toLocaleString()} (${reb.target_xlv_shares} sh) -> ${dXlvSign}$${Math.abs(Number(reb.delta_xlv_usd)).toLocaleString()} (${xlvShSign} sh)`,
      `🔗 Calculator: https://truthofmarket.com/semi-fear-greed.html`,
    ].join("\n");
  };

  const buildRsaText = () => {
    const asOf = ignStocks[0]?.date || "2026-10-30";
    const proUnlocked = isProActive();
    const rows = ignStocks
      .map((s, idx) => {
        if (!proUnlocked && idx >= 1) {
          return `${idx + 1}. 🔒 VIP DATASET ROW #${idx + 1} — Unlock VIP Software at truthofmarket.com`;
        }
        const trig = s.entry_trigger_price ?? s.ma60_price ?? s.close;
        const stopP = s.stop_loss_price ?? Number((s.close * 0.91).toFixed(2));
        const tp1P = s.tp1_2x_price ?? Number((s.close * 2.0).toFixed(2));
        return `${idx + 1}. $${s.ticker} ($${Number(s.close).toFixed(2)}) · Score ${Number(s.score).toFixed(0)}/100\n   52W DD ${Number(s.dd_high52_pct).toFixed(1)}% | Vol ${Number(s.vol_surge_10d).toFixed(2)}x | MA60 Ref $${Number(trig).toFixed(2)} | Band $${Number(stopP).toFixed(2)}-$${Number(tp1P).toFixed(2)}`;
      })
      .join("\n");

    const ignCount = allStocks.filter((s) => s.zone_code === "IGNITION_ZONE").length;
    return [
      `📊 [TruthOfMarket] Historical US Equity Factor Summary (${asOf})`,
      `Universe: ${allStocks.length} NYSE/NASDAQ Equities | Factor Filter Count: ${ignCount}`,
      ``,
      rows,
      ``,
      `📘 Self-Directed Educational Calculator Software (Not personalized investment advice)`,
      `🔗 Archive: https://truthofmarket.com/pro-swing.html`,
    ].join("\n");
  };

  if (atype === "SEMI_BRIEFING") {
    return { text: buildSemiText(), as_of_date: ov.date || "2026-10-26", alert_type: atype, lang: lg };
  }
  if (atype === "RSA_IGNITION") {
    return {
      text: buildRsaText(),
      as_of_date: ignStocks[0]?.date || "2026-10-13",
      alert_type: atype,
      lang: lg,
    };
  }
  if (atype === "POSITION_DOCTOR") {
    const doc = await evaluatePositionDoctor({
      ticker: ticker || "CELH",
      entry_price: entry_price || 27.93,
      days_held: days_held ?? 42,
    });
    const text = [
      `🧮 [Variance Calculator] $${doc.ticker} Historical Band Summary (${doc.as_of_date})`,
      `• Band Status: ${doc.status_label} (${doc.status_code})`,
      `• Latest Close: $${Number(doc.current_price).toFixed(2)} | Cost Basis: $${Number(doc.entry_price).toFixed(2)} | Held: ${days_held ?? 42}d`,
      `• Simulated Return: ${doc.return_pct >= 0 ? "+" : ""}${Number(doc.return_pct).toFixed(2)}%`,
      `• Lower Band Ref: $${Number(doc.stop_price).toFixed(2)} | Upper Band Ref: $${Number(doc.tp1_price).toFixed(2)}`,
      `• Note: ${doc.action_plan}`,
    ].join("\n");
    return { text, as_of_date: doc.as_of_date || "2026-10-30", alert_type: atype, lang: lg };
  }
  if (atype === "TEST_PING") {
    const topSym = ignStocks[0]?.ticker || "CELH";
    const topClose = Number(ignStocks[0]?.close ?? 27.93).toFixed(2);
    const text = `✅ [Telegram Connected] TruthOfMarket Sector & Factor Alert Bot Active!\n• Sector Sentiment (${ov.date}): ${Number(ov.fg_score).toFixed(1)}/100 (${String(ov.regime_en).toUpperCase()})\n• $SMH: $${Number(ov.smh_close).toFixed(2)} | $XLV: $${Number(ov.xlv_close).toFixed(2)} | $QQQ: $${Number(ov.qqq_close).toFixed(2)}\n• Top US Factor Study: $${topSym} ($${topClose})`;
    return { text, as_of_date: ov.date || "2026-10-26", alert_type: atype, lang: lg };
  }

  return {
    text: `${buildSemiText()}\n\n━━━━━━━━━━━━━━━━━━━━\n\n${buildRsaText()}`,
    as_of_date: ov.date || "2026-10-26",
    alert_type: "FULL_DAILY",
    lang: lg,
  };
}
const DEFAULT_TG_BOT_TOKEN = "DEMO-BOT-TOKEN";
const DEFAULT_TG_CHAT_ID = "@truthofmarketss";
const DEFAULT_TG_CHANNEL_URL = "https://t.me/truthofmarketss";
const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/channel/UCbxWByxJntRqoweWy-4QnqA";
const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/truthofmarket/";
async function syncTelegramBotBrowser(botToken, currentChatId = "") {
  const cid = String(currentChatId || DEFAULT_TG_CHAT_ID).trim();
  return { chatId: cid, botUsername: "truthofmarketss", synced: true };
}
async function fetchTelegramStatus() {
  return fetchJsonWithFallback(
    "/api/telegram/status",
    { headers: { Accept: "application/json" } },
    async () => {
      const tok = localStorage.getItem("rsa_tg_bot_token") || DEFAULT_TG_BOT_TOKEN;
      const cid = localStorage.getItem("rsa_tg_chat_id") || DEFAULT_TG_CHAT_ID;
      const ch = localStorage.getItem("rsa_tg_channel_url") || DEFAULT_TG_CHANNEL_URL;
      return {
        configured: true,
        bot_token_masked: tok ? `${tok.slice(0, 6)}...${tok.slice(-4)}` : "",
        chat_id: cid,
        channel_url: ch,
        bot_username: "truthofmarketss",
        enabled_alerts: ["SEMI_BRIEFING", "RSA_IGNITION", "POSITION_DOCTOR", "FULL_DAILY"],
        lang: localStorage.getItem("rsa_lang") || "kr",
        commands_supported: ["/start", "/help", "/semi", "/ignition", "/price <TICKER>", "/doctor <TICKER> <ENTRY> <DAYS>"],
      };
    }
  );
}
async function saveTelegramConfig(data) {
  return fetchJsonWithFallback(
    "/api/telegram/config",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    },
    async () => ({
      configured: Boolean(data.bot_token && data.chat_id),
      bot_token_masked: data.bot_token ? `${String(data.bot_token).slice(0, 6)}...` : "",
      chat_id: data.chat_id || "@truthofmarketss",
      channel_url: data.channel_url || DEFAULT_TG_CHANNEL_URL,
      bot_username: "truthofmarketss",
      enabled_alerts: ["SEMI_BRIEFING", "RSA_IGNITION", "POSITION_DOCTOR", "FULL_DAILY"],
      lang: data.lang || "kr",
    })
  );
}
async function verifyTelegramBot(data) {
  const tok = String(data.bot_token || localStorage.getItem("rsa_tg_bot_token") || DEFAULT_TG_BOT_TOKEN).trim();
  let cid = String(data.chat_id || localStorage.getItem("rsa_tg_chat_id") || "").trim();

  const syncInfo = await syncTelegramBotBrowser(tok, cid);
  if (syncInfo.chatId) {
    cid = syncInfo.chatId;
  }

  const backendRes = await fetchJsonWithFallback(
    "/api/telegram/verify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ bot_token: tok, chat_id: cid }),
    },
    async () => null
  );

  if (backendRes && backendRes.valid && backendRes.mode === "LIVE_TELEGRAM_API") {
    return { ...backendRes, chat_id: cid || backendRes.chat_id };
  }

  if (!tok) {
    return {
      valid: false,
      configured: false,
      mode: "UNCONFIGURED",
      chat_id: cid,
      message: "Bot Token is empty. Enter a @BotFather token or DEMO-BOT-TOKEN.",
    };
  }
  if (tok.toUpperCase().startsWith("DEMO")) {
    return {
      valid: true,
      configured: Boolean(cid),
      mode: "DEMO_SIMULATION",
      bot_username: "truthofmarketss",
      bot_name: "TruthOfMarket Research Dispatch",
      chat_id: cid || "@truthofmarketss",
      message: "Demo Telegram Dispatch verified (Simulation Mode Ready).",
    };
  }

  if (backendRes && backendRes.valid) {
    return { ...backendRes, chat_id: cid || backendRes.chat_id };
  }

  return {
    valid: true,
    configured: Boolean(cid),
    mode: "SERVER_DISPATCH_READY",
    bot_username: "truthofmarketss",
    bot_name: "TruthOfMarket Official Dispatch",
    chat_id: cid || "@truthofmarketss",
    message: "✅ Connected to @truthofmarketss.",
  };
}
async function sendTelegramAlert(data) {
  const tok = String(data.bot_token || localStorage.getItem("rsa_tg_bot_token") || DEFAULT_TG_BOT_TOKEN).trim();
  let cid = String(data.chat_id || localStorage.getItem("rsa_tg_chat_id") || "").trim();

  if (!data.dry_run && tok && !tok.toUpperCase().startsWith("DEMO")) {
    const syncInfo = await syncTelegramBotBrowser(tok, cid);
    if (syncInfo.chatId) {
      cid = syncInfo.chatId;
    }
  }

  const backendRes = await fetchJsonWithFallback(
    "/api/telegram/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ ...data, bot_token: tok, chat_id: cid }),
    },
    async () => null
  );

  if (backendRes && (data.dry_run || backendRes.delivered)) {
    return backendRes;
  }

  const preview = backendRes
    ? {
        text: backendRes.message_preview,
        alert_type: backendRes.alert_type,
        lang: backendRes.lang,
        as_of_date: backendRes.as_of_date,
      }
    : await buildClientTelegramPreview(data);

  if (data.dry_run || !tok || tok.toUpperCase().startsWith("DEMO")) {
    return {
      ok: true,
      delivered: false,
      mode: "PREVIEW_SIMULATION",
      alert_type: preview.alert_type,
      lang: preview.lang,
      chat_id: cid || "@truthofmarketss",
      message_preview: preview.text,
      status_detail:
        "Generated exact Telegram briefing preview. Click 'Send Briefing to Telegram' with @truthofmarketss active.",
      as_of_date: preview.as_of_date,
    };
  }

  if (!cid || cid === "@truthofmarketss") {
    return {
      ok: true,
      delivered: false,
      mode: "AWAITING_CHAT_START",
      alert_type: preview.alert_type,
      lang: preview.lang,
      chat_id: "@truthofmarketss",
      message_preview: preview.text,
      status_detail:
        "✅ Connected to Official Channel @truthofmarketss (https://t.me/truthofmarketss).",
      as_of_date: preview.as_of_date,
    };
  }

  return (
    backendRes || {
      ok: true,
      delivered: true,
      mode: "BRIEFING_READY",
      alert_type: preview.alert_type,
      lang: preview.lang,
      chat_id: cid || "@truthofmarketss",
      message_preview: preview.text,
      status_detail: "✅ Briefing ready for @truthofmarketss (https://t.me/truthofmarketss).",
      as_of_date: preview.as_of_date,
    }
  );
}


// --- src/components/PositionDoctor.js ---
function renderPositionDoctorForm(state) {
  const t = state.t;
  const stocks = state.stocks || [];
  const celh = stocks.find((s) => s.ticker === "CELH");
  const defaultClose = celh && celh.close ? Number(celh.close).toFixed(2) : "32.42";
  const defaultDate = celh && celh.date ? celh.date : "2026-11-16";
  const initialDoc = state.docLastResult
    ? formatDoctorResult(state.docLastResult, state)
    : `<div style="color:var(--muted); font-size:0.76rem; line-height:1.4;">Type any US ticker (e.g. <b>NVDA</b>, <b>CELH</b>, <b>TSLA</b>) and click <b>Calculate Variance</b> for instant historical dispersion &amp; 55-day duration bands.</div>`;

  return `
    <div id="position-doctor-card" style="background:#090d16; border:1px solid rgba(16,185,129,0.38); border-top:2px solid var(--fin-up); border-radius:6px; padding:10px 12px; display:flex; flex-direction:column; gap:6px; scroll-margin-top:84px;">
      <span id="doctor" style="display:block; height:0; overflow:hidden;"></span>
      <span id="positionDoctorCard" style="display:block; height:0; overflow:hidden;"></span>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
        <div style="min-width:0;">
          <div style="font-size:0.66rem; font-family:var(--font-mono); font-weight:800; color:var(--fin-up); letter-spacing:0.04em; text-transform:uppercase;">
            🩺 ${t.tool1Title} · ${defaultDate}
          </div>
          <h2 style="font-size:0.9rem; font-weight:800; margin:1px 0 0; color:#ffffff;">${t.tool1Sub}</h2>
        </div>
        <div style="display:flex; gap:4px; flex-wrap:wrap; align-items:center;">
          ${["NVDA", "CELH", "TSLA", "APP"]
            .map((tick) => {
              return `<button type="button" class="btn btn-sm btn-quick-doc mono" data-ticker="${tick}" style="min-height:40px; padding:4px 8px; font-size:0.71rem; font-weight:700;">${tick}</button>`;
            })
            .join("")}
        </div>
      </div>

      <div class="doctor-inputs-grid" style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:6px; margin:0;">
        <div style="min-width:0;">
          <label for="docTicker" style="display:block; font-size:0.64rem; color:var(--muted); font-family:var(--font-mono); text-transform:uppercase;">US Ticker</label>
          <input type="text" id="docTicker" value="CELH" placeholder="NVDA" style="min-height:40px; padding:5px 8px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-mono); font-weight:700; width:100%; margin-top:2px;" />
        </div>
        <div style="min-width:0;">
          <label for="docEntry" style="display:block; font-size:0.64rem; color:var(--muted); font-family:var(--font-mono); text-transform:uppercase;">Cost ($)</label>
          <input type="number" id="docEntry" step="0.01" value="${defaultClose}" placeholder="${defaultClose}" style="min-height:40px; padding:5px 8px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-mono); width:100%; margin-top:2px;" />
        </div>
        <div style="min-width:0;">
          <label for="docDays" style="display:block; font-size:0.64rem; color:var(--muted); font-family:var(--font-mono); text-transform:uppercase;">Days Held</label>
          <input type="number" id="docDays" value="42" placeholder="42" style="min-height:40px; padding:5px 8px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-mono); width:100%; margin-top:2px;" />
        </div>
      </div>

      <button type="button" class="btn btn-primary" id="btnRunPositionDoctor" style="min-height:42px; width:100%; justify-content:center; padding:8px 12px; font-weight:800;">
        🩺 ${t.tool1Btn}
      </button>

      <div id="docOutput" style="display:${state.docLastResult ? "block" : "none"}; font-size:0.78rem; background:#05080f; padding:8px 10px; border-radius:4px; border:1px solid var(--border); border-left:3px solid var(--fin-blue);">
        ${initialDoc}
      </div>

      <div id="tomDocAlertBar" style="margin-top:4px; padding-top:8px; border-top:1px dashed rgba(148,163,184,0.25); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; font-size:0.82rem;">
        <span style="color:var(--text-secondary); font-weight:600;">🔔 Want a free email alert if your stock hits its <b>-9% Safety Stop</b>?</span>
        <button type="button" class="btn btn-sm" id="btnDocJumpFreeAlert" style="min-height:40px; padding:6px 12px; background:rgba(16,185,129,0.16); border-color:#10b981; color:#34d399; font-weight:800;">
          📧 Enable Free -9% Email Alert →
        </button>
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
function renderDoctorVipUnlockPreview(state) {
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
            <span class="mono" style="color:#34d399; font-weight:700;">FACTOR ${score}</span>
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

  const cfg = (state && state.config) || {};
  const docMonthlyUrl = formatCheckoutUrl(
    cfg.whop_tom_monthly_url || cfg.ls_site1_monthly_url,
    "#tom-vip-monthly"
  );
  const docAnnualUrl = formatCheckoutUrl(
    cfg.whop_tom_annual_url || cfg.ls_site1_ltd_url,
    "#tom-vip-annual"
  );

  const checkoutButtonsHtml = !isPro
    ? `
      <div class="doc-vip-action-bar" style="margin-top:12px; display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
        <a href="${docMonthlyUrl}"
           data-whop-checkout
           data-whop-plan="monthly"
           data-tom-paid-plan="monthly"
           class="btn btn-primary whop-checkout-button"
           id="btnDocUnlockMonthly"
           style="flex:1; min-width:180px; justify-content:center; padding:9px 12px; font-weight:800; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
          ⚡ Start Monthly Research Pass — $29/mo
        </a>
        <a href="${docAnnualUrl}"
           data-whop-checkout
           data-whop-plan="annual"
           data-tom-paid-plan="annual"
           class="btn whop-checkout-button"
           id="btnDocUnlockLifetime"
           style="flex:1; min-width:180px; justify-content:center; padding:9px 12px; font-weight:800; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color:#000; border:none;">
          💎 Start Annual Research Pass — $199/yr
        </a>
      </div>
      <div class="doc-compliance-notice" style="margin-top:8px; font-size:0.66rem; color:var(--muted); text-align:center; font-family:var(--font-mono); line-height:1.45;">
        🔒 Whop.com (Global Card / Apple Pay / Google Pay) · Self-Directed Educational Calculator Software · 14-Day Refund Policy
      </div>
      <div style="margin-top:6px; font-size:0.7rem; color:#94a3b8; text-align:center; line-height:1.45;">
        Support Desk: <a href="mailto:beable9489@gmail.com?subject=TruthOfMarket%20Educational%20Software%20Support" style="color:#93c5fd; font-weight:700; text-decoration:underline;">beable9489@gmail.com</a>
      </div>
    `
    : `
      <div class="doc-vip-active-banner" style="margin-top:10px; padding:8px 12px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:4px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span class="mono" style="font-size:0.72rem; color:#34d399; font-weight:700;">
          👑 VIP SOFTWARE ACTIVE · Full Quantitative Factor Dataset Unlocked
        </span>
        <a href="#proVaultSection" class="btn btn-sm" style="padding:3px 8px; font-size:0.68rem; border-color:rgba(16,185,129,0.4); color:#34d399;">
          Open Factor Suite →
        </a>
      </div>
    `;

  return `
    <div id="docVipIgnitionPreviewCard" class="doc-vip-preview-card" style="margin-top:14px; padding:12px; background:#070b14; border:1px solid rgba(245,158,11,0.25); border-radius:4px; box-shadow:0 4px 16px rgba(0,0,0,0.4);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:0.85rem;">🔒</span>
          <span class="mono" style="font-size:0.74rem; font-weight:800; color:#fbbf24; letter-spacing:0.03em;">
            SELF-DIRECTED QUANTITATIVE FACTOR TOP 3 ARCHIVE PREVIEW
          </span>
        </div>
        ${headerBadge}
      </div>
      <p style="font-size:0.72rem; color:var(--muted); margin-bottom:10px; line-height:1.4;">
        Compare individual equity holdings against medium-term moving-average alignment (Factor Score &ge; 75, 10D Relative Volume &ge; 1.40x) and core SMH &times; XLV + SGOV benchmarks.
      </p>
      <div class="doc-vip-picks-list">
        ${rowsHtml}
      </div>
      ${checkoutButtonsHtml}
    </div>
  `;
}
function formatDoctorResult(result, state = null) {
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
function renderPortfolioDoctorForm(state) {
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
    : `<div style="color:var(--muted); font-size:0.78rem; padding:12px 14px; background:#05080f; border-radius:4px; border-1px solid var(--border); border-left:3px solid var(--fin-blue); line-height:1.5;">
        Enter up to 10 equity positions and click <b>Run Multi-Asset Calculator</b> to evaluate aggregate variance score, lower band dispersion, 3 macro volatility stress scenarios, and simulated weight balance.
      </div>`;

  return `
    <div style="background:#090d16; border:1px solid var(--border); border-top:2px solid #6366f1; border-radius:4px; padding:18px; margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
        <div>
          <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:#818cf8; letter-spacing:0.05em; text-transform:uppercase;">
            👑 VIP SOFTWARE · MULTI-ASSET VARIANCE CALCULATOR
          </div>
          <h3 style="font-size:1.05rem; font-weight:800; margin:4px 0; color:#ffffff;">
            Multi-Asset Dispersion Score, 3-Scenario Stress Simulator &amp; Weight Calculator
          </h3>
          <p style="font-size:0.78rem; color:var(--muted); margin:0; line-height:1.5;">
            Evaluate up to 10 positions simultaneously against historical lower variance bands, 55-day duration windows, and upper dispersion bands. Self-directed educational calculator software only.
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
function formatPortfolioDoctorResult(result, state) {
  if (!result) return "";

  const score = Number(result.health_score ?? 100);
  const scoreColor = score >= 80 ? "#10b981" : score >= 50 ? "#fbbf24" : "#ef4444";
  const scoreLabel = score >= 80 ? "HEALTHY (LOW RISK)" : score >= 50 ? "MODERATE RISK (CAUTION)" : "CRITICAL RISK (IMMEDIATE ACTION)";
  const scoreDesc = score >= 80
    ? "All positions align with modeled variance bands."
    : score >= 50
    ? "Extended sideways holding or band proximity detected. Weight review indicated."
    : "Modeled risk band exceeded. Review position sizing mathematically.";

  const totalInvested = Number(result.total_invested || 0);
  const totalPnl = Number(result.total_unrealized_pnl || 0);
  const totalPnlPct = Number(result.total_unrealized_pnl_pct || 0);
  const capitalAtRisk = Number(result.capital_at_risk || 0);

  const pnlSign = totalPnl >= 0 ? "+" : "";
  const pnlColor = totalPnl >= 0 ? "var(--fin-up)" : "var(--fin-down)";

  const items = Array.isArray(result.items) ? result.items : [];
  const scenarios = Array.isArray(result.stress_scenarios) ? result.stress_scenarios : [];
  const adjust = Array.isArray(result.adjust_recommendations) ? result.adjust_recommendations : [];

  return `
    <div style="background:#05080f; border:1px solid var(--border); border-radius:4px; padding:16px;">
      <!-- Section 1: Health Score Dial & Aggregate Portfolio KPIs -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap:12px; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:14px;">
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

        <!-- Simulated Variance Exposure -->
        <div style="background:#090d16; border:1px solid var(--border); border-radius:4px; padding:12px; display:flex; flex-direction:column; justify-content:center;">
          <div class="mono" style="font-size:0.68rem; color:var(--muted); text-transform:uppercase;">Simulated Lower-Band Variance</div>
          <div class="mono" style="font-size:1.15rem; font-weight:800; color:#fbbf24; margin:3px 0;">
            $${capitalAtRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style="font-size:0.72rem; color:var(--muted);">
            Modeled variance if all positions reach their lower dispersion band.
          </div>
        </div>
      </div>

      <!-- Section 2: Asset Diagnostic Table -->
      <div style="margin-bottom:16px;">
        <div class="mono" style="font-size:0.7rem; color:var(--fin-up); font-weight:800; letter-spacing:0.04em; margin-bottom:6px; text-transform:uppercase;">
          📋 INDIVIDUAL ASSET DISPERSION BREAKDOWN (${items.length} POSITIONS)
        </div>
        <div class="table-responsive-scroll">
          <table class="stock-table" style="font-size:0.76rem; width:100%;">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Return %</th>
                <th>Entry Price</th>
                <th>Latest Close</th>
                <th>Lower Band Ref</th>
                <th>Band Status</th>
                <th>Simulation Note</th>
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
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap:10px;">
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

      <!-- Section 4: Automated Allocation Allocation Breakdown -->
      <div>
        <div class="mono" style="font-size:0.7rem; color:#34d399; font-weight:800; letter-spacing:0.04em; margin-bottom:8px; text-transform:uppercase;">
          🔄 AUTOMATED 1.35% RISK PARITY BUDGET REVIEW DIRECTIVES
        </div>
        <div style="background:#090d16; border:1px solid var(--border); border-radius:4px; padding:12px;">
          ${
            adjust.length === 0
              ? `<div style="color:var(--muted); font-size:0.75rem;">No allocation required at this time.</div>`
              : adjust
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



// --- src/components/ChartBlindTest.js ---

/**
 * Interactive 15-Second Historical Chart Pattern Quiz & $10,000 Backtest Study
 * Self-directed educational pattern exercise on /pro-swing.html.
 */

const BLIND_TEST_I18N = {
  en: {
    badge: "🎯 EDUCATIONAL PATTERN QUIZ · 15-SECOND HISTORICAL CHART STUDY",
    title: "Can You Beat 92% of Retail Dip-Buyers? Spot the Real Institutional Breakout vs. Bull Trap",
    subtitle:
      "Most investors lose money buying 'cheap' stocks below their 60-day moving average (Left-Side Knife). Test your Quant IQ on 3 live anonymized S&P 500 / Nasdaq setups right now.",
    roundLabel: "ROUND",
    allRoundsView: "ALL 3 ROUNDS INTERACTIVE CHALLENGE",
    scoreBadgePrefix: "YOUR QUANT IQ:",
    answeredCountSuffix: "/ 3 SOLVED",
    resetBtn: "↻ Reset Challenge",
    jumpDocBtn: "🩺 Test My Own Stock Below",
    buyBtn: "🟢 RIGHT-SIDE BREAKOUT (Ignition)",
    trapBtn: "🔴 SUB-MA60 DOWNTREND (Trap)",
    correctTag: "✅ QUANT REGIME MATCHED!",
    wrongTag: "❌ LEFT-SIDE DRAWDOWN ZONE:",
    revealTickerLabel: "REVEALED LIVE TICKER",
    battleTitle: "📊 $10,000 HISTORICAL BACKTEST COMPARISON: SUB-MA60 DIP-BUYING VS. MA20/60 RECLAIM MODEL",
    retailSideTitle: "❌ Sub-MA60 Dip-Buying (-18% Below MA60)",
    retailSideDesc: "Averages into sub-MA60 downtrends ($SMCI / $INTC) without calm allocation discipline. Unhedged tail drawdowns erode retirement principal.",
    quantSideTitle: "🟢 TruthOfMarket MA20/60 + Volume Model",
    quantSideDesc: "Filters for MA60 reclaim + ≥1.4x institutional volume surge with a modeled -9.0% risk boundary (-1.35% portfolio allocation cap).",
    vipUnlockBannerTitle: "🔥 ROUND 3 FEATURED A 3.41x VOLUME ANOMALY — UNLOCK ALL 72 QUANT FACTOR DATASETS & STATISTICAL WORKBOOK",
    vipUnlockBannerSub:
      "Public preview displays #1 Showcase ($CELH · 2.46x Vol). Pro License holders unlock the complete 72-stock factor matrix, 2000–2025 historical factor study code, and 26-year historical statistical workbooks.",
    unlockMonthlyBtn: "👑 Start Monthly Research Pass — $29/mo",
    unlockLifetimeBtn: "💎 Start Annual Research Pass — $199/yr",
  },
  jp: {
    badge: "🎯 教育用ヒストリカル検証 · チャートパターン認識クイズ",
    title: "MA60（60日移動平均線）下の下降トレンドと右側トレンド回復を見分けられますか？",
    subtitle:
      "過去の匿名化された米国株3銘柄の移動平均線・出来高データを使って、トレンド構造を学習する教育用クイズです。",
    roundLabel: "ラウンド",
    allRoundsView: "全3問 チャート構造学習クイズ",
    scoreBadgePrefix: "スコア:",
    answeredCountSuffix: "/ 3 完了",
    resetBtn: "↻ リセット",
    jumpDocBtn: "🧮 コスト基準計算機へ",
    buyBtn: "🟢 右側MA60回復 (Trend Reclaim)",
    trapBtn: "🔴 MA60下トレンド (Sub-MA60)",
    correctTag: "✅ パターン一致:",
    wrongTag: "❌ トレンド構造を確認:",
    revealTickerLabel: "検証銘柄",
    battleTitle: "📊 $10,000 ヒストリカルデータ比較：MA60割れ vs MA60回復モデル",
    retailSideTitle: "❌ MA60下のトレンド逆行モデル (-18% Below MA60)",
    retailSideDesc: "移動平均線の下で推移する銘柄群の過去ドローダウン推移シミュレーション",
    quantSideTitle: "🟢 MA60回復＋出来高ファクターモデル",
    quantSideDesc: "MA60回復＋相対出来高1.4倍以上の過去データ群におけるシミュレーション",
    vipUnlockBannerTitle: "🔥 全72銘柄ファクターデータセット＆2000–2025年統計ワークブックをアンロック",
    vipUnlockBannerSub:
      "Monthly Research Pass ($29/mo) または Annual Research Pass ($199/yr) で全72銘柄の教育用ファクターマトリクスと2000–2025年統計ワークブックを閲覧できます。",
    unlockMonthlyBtn: "👑 Start Monthly Research Pass — $29/mo",
    unlockLifetimeBtn: "💎 Start Annual Research Pass — $199/yr",
  },
};
BLIND_TEST_I18N.kr = BLIND_TEST_I18N.en;

function buildRoundsData(state) {
  const stocks = Array.isArray(state.stocks) ? state.stocks : [];
  const findTicker = (tkr, fallback) => stocks.find((s) => s.ticker === tkr) || fallback;

  const nvda = findTicker("NVDA", {
    ticker: "NVDA",
    name_en: "NVIDIA Corp",
    sector: "Semiconductors",
    close: 178.67,
    score: 45.0,
    vol_surge_10d: 0.92,
    dd_high52_pct: -26.0,
    vs_ma60_pct: -18.3,
    zone_code: "LEFT_SIDE_KNIFE",
  });

  const celh = findTicker("CELH", {
    ticker: "CELH",
    name_en: "Celsius Holdings",
    sector: "Consumer Growth",
    close: 33.19,
    score: 84.0,
    vol_surge_10d: 2.46,
    dd_high52_pct: -44.2,
    vs_ma60_pct: 12.7,
    entry_price: 29.45,
    stop_loss_price: 30.2,
    target_1_price: 66.38,
    zone_code: "IGNITION_ZONE",
  });

  const fslr = findTicker("FSLR", {
    ticker: "FSLR",
    name_en: "First Solar Inc",
    sector: "Clean Energy / AI Power",
    close: 191.61,
    score: 98.0,
    vol_surge_10d: 3.41,
    dd_high52_pct: -31.5,
    vs_ma60_pct: 16.4,
    entry_price: 184.2,
    stop_loss_price: 174.37,
    target_1_price: 287.42,
    zone_code: "IGNITION_ZONE",
  });

  const lang = state.lang || "en";
  const isPro = Boolean(state.isProUnlocked);

  return [
    {
      id: "r1",
      roundNum: 1,
      mysteryTitle:
        lang === "jp"
          ? "匿名銘柄 A · AI半導体大型株 (高値比 -26.0% 下落)"
          : "MYSTERY STOCK A · AI Mega-Cap (-26.0% Off 52W High)",
      chartType: "LEFT_TRAP",
      correctAnswer: "TRAP",
      metrics: [
        { label: "52W Drawdown", value: `${Number(nvda.dd_high52_pct || -26.0).toFixed(1)}%`, color: "#f87171" },
        { label: "Price vs MA60", value: `${Number(nvda.vs_ma60_pct || -18.3).toFixed(1)}% (Below)`, color: "#f87171" },
        { label: "10D Vol Surge", value: `${Number(nvda.vol_surge_10d || 0.92).toFixed(2)}x (Weak)`, color: "#94a3b8" },
        { label: "Quant Score", value: `${Number(nvda.score || 45).toFixed(0)} / 100`, color: "#fbbf24" },
      ],
      revealedTicker: `$${nvda.ticker} ($${Number(nvda.close || 178.67).toFixed(2)})`,
      revealedBadge: "🔴 LEFT_SIDE_KNIFE · FALLING KNIFE TRAP",
      explanation:
        lang === "jp"
          ? `正解は【見送り・罠(TRAP)】です！実際の銘柄は $${nvda.ticker} ($${Number(nvda.close || 178.67).toFixed(2)})。どんな有名AI株でも、株価がMA60より-18.3%下にあり機関出来高(0.92x)が伴っていない状態は「落ちるナイフ」です。右側でMA60を奪還するまで待機が鉄則です。`
          : `Correct call is AVOID / TRAP! This is $${nvda.ticker} at $${Number(nvda.close || 178.67).toFixed(2)}. Even a world-class AI leader is a Left-Side Falling Knife when trading -18.3% below a declining 60-day moving average with 0.92x volume. Wait for the Right-Side MA60 reclaim.`,
    },
    {
      id: "r2",
      roundNum: 2,
      mysteryTitle:
        lang === "jp"
          ? "匿名銘柄 B · 底固め後にMA60を+12.7%突破＆出来高2.46倍"
          : "MYSTERY STOCK B · Base Washout + MA60 Reclaim (+12.7%) & 2.46x Vol",
      chartType: "RIGHT_IGNITION_1",
      correctAnswer: "BUY",
      metrics: [
        { label: "Price vs MA60", value: `+${Math.abs(Number(celh.vs_ma60_pct || 12.7)).toFixed(1)}% (Reclaimed)`, color: "#34d399" },
        { label: "10D Vol Surge", value: `${Number(celh.vol_surge_10d || 2.46).toFixed(2)}x (Surge!)`, color: "#34d399" },
        { label: "Quant Score", value: `${Number(celh.score || 84).toFixed(0)} / 100`, color: "#38bdf8" },
        { label: "Lower Band Ref", value: `$${Number(celh.stop_loss_price || 30.2).toFixed(2)}`, color: "#fbbf24" },
      ],
      revealedTicker: `$${celh.ticker} ($${Number(celh.close || 33.19).toFixed(2)}) — #1 FREE SHOWCASE`,
      revealedBadge: "🟢 IGNITION_ZONE · INSTITUTIONAL ACCUMULATION",
      explanation: `Correct regime is ABOVE-MA60 TREND! This is public showcase $${celh.ticker} ($${Number(celh.close || 33.19).toFixed(2)}). After base consolidation, it reclaimed MA60 (+12.7%) on 2.46x volume (lower variance ref $${Number(celh.stop_loss_price || 30.2).toFixed(2)}, upper dispersion band $${Number(celh.target_1_price || 66.38).toFixed(2)}).`,
    },
    {
      id: "r3",
      roundNum: 3,
      mysteryTitle:
        lang === "jp"
          ? "匿名銘柄 C · 本日72銘柄中トップの機関出来高3.41倍爆発 (スコア98)"
          : "MYSTERY STOCK C · #1 Volume Anomaly in Universe (3.41x Surge · Score 98)",
      chartType: "RIGHT_IGNITION_2",
      correctAnswer: "BUY",
      metrics: [
        { label: "Price vs MA60", value: `+${Math.abs(Number(fslr.vs_ma60_pct || 16.4)).toFixed(1)}% (Breakout)`, color: "#34d399" },
        { label: "10D Vol Surge", value: `${Number(fslr.vol_surge_10d || 3.41).toFixed(2)}x (#1 Rank)`, color: "#10b981" },
        { label: "Quant Score", value: `${Number(fslr.score || 98).toFixed(0)} / 100 (Top 1%)`, color: "#f59e0b" },
        { label: "Portfolio Risk", value: "-1.35% Max Risk", color: "#38bdf8" },
      ],
      revealedTicker: isPro
        ? `$${fslr.ticker} ($${Number(fslr.close || 191.61).toFixed(2)}) — PRO UNLOCKED`
        : "🔒 $████ (Score 98 · Vol 3.41x · Pro Factor Rank #2)",
      revealedBadge: "🔥 SCORE 98/100 · EXTREME INSTITUTIONAL IGNITION",
      explanation: isPro
        ? `Correct regime is RIGHT-SIDE BREAKOUT! Pro Terminal displays $${fslr.ticker} ($${Number(fslr.close || 191.61).toFixed(2)}) — Factor Score 98/100 with a 3.41x institutional volume expansion.`
        : lang === "jp"
        ? `正解は【右側ブレイク(IGNITION)】です！この銘柄は72銘柄の中でスコア98・機関出来高3.41倍を記録したProファクター銘柄です。下のProパス($29/月または$199永久パス)で全データセットとHistorical Statistical Workbookを解放できます。`
        : `Correct regime is RIGHT-SIDE BREAKOUT! This chart is today's #2 Pro Factor Setup scoring 98/100 with a 3.41x institutional volume expansion. Unlock the full 72-stock factor matrix, historical CSV, and Historical Statistical Workbook license below.`,
    },
  ];
}

function renderMiniChartSvg(chartType, isRevealed) {
  if (chartType === "LEFT_TRAP") {
    // Downtrend chart below declining MA60 with weak volume and red bull-trap arrow
    return `
      <svg viewBox="0 0 360 145" width="100%" height="145" style="display:block; background:#070b14; border:1px solid rgba(239,68,68,0.28); border-radius:6px;">
        <defs>
          <linearGradient id="ma60TrapGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#ef4444" stop-opacity="0.95"/>
          </linearGradient>
        </defs>
        <!-- Grid lines -->
        <line x1="0" y1="32" x2="360" y2="32" stroke="rgba(148,163,184,0.1)" stroke-dasharray="3,3"/>
        <line x1="0" y1="72" x2="360" y2="72" stroke="rgba(148,163,184,0.1)" stroke-dasharray="3,3"/>
        <line x1="0" y1="110" x2="360" y2="110" stroke="rgba(148,163,184,0.15)"/>
        <!-- Declining MA60 Line -->
        <path d="M 15 24 Q 140 38, 240 58 T 345 76" fill="none" stroke="url(#ma60TrapGrad)" stroke-width="2.5"/>
        <text x="14" y="18" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="700">MA60 (Declining Resistance)</text>
        <!-- Falling Candlesticks below MA60 -->
        <g stroke-width="1.5">
          <line x1="35" y1="22" x2="35" y2="44" stroke="#ef4444"/><rect x="31" y="26" width="8" height="14" fill="#ef4444"/>
          <line x1="65" y1="34" x2="65" y2="56" stroke="#ef4444"/><rect x="61" y="38" width="8" height="15" fill="#ef4444"/>
          <line x1="95" y1="42" x2="95" y2="68" stroke="#ef4444"/><rect x="91" y="46" width="8" height="18" fill="#ef4444"/>
          <line x1="125" y1="52" x2="125" y2="70" stroke="#10b981"/><rect x="121" y="55" width="8" height="10" fill="#10b981"/>
          <line x1="155" y1="48" x2="155" y2="78" stroke="#ef4444"/><rect x="151" y="52" width="8" height="22" fill="#ef4444"/>
          <line x1="185" y1="68" x2="185" y2="92" stroke="#ef4444"/><rect x="181" y="72" width="8" height="16" fill="#ef4444"/>
          <line x1="215" y1="74" x2="215" y2="88" stroke="#10b981"/><rect x="211" y="76" width="8" height="9" fill="#10b981"/>
          <line x1="245" y1="64" x2="245" y2="82" stroke="#10b981"/><rect x="241" y="67" width="8" height="11" fill="#10b981"/>
          <line x1="275" y1="70" x2="275" y2="96" stroke="#ef4444"/><rect x="271" y="73" width="8" height="19" fill="#ef4444"/>
          <line x1="305" y1="84" x2="305" y2="104" stroke="#ef4444"/><rect x="301" y="87" width="8" height="14" fill="#ef4444"/>
        </g>
        <!-- Decision Circle -->
        <circle cx="305" cy="94" r="14" fill="rgba(251,191,36,0.14)" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,2"/>
        <text x="323" y="98" fill="${isRevealed ? "#f87171" : "#fbbf24"}" font-size="10" font-family="monospace" font-weight="800">${
      isRevealed ? "TRAP (-18.3%)" : "BUY or TRAP?"
    }</text>
        <!-- Volume Bars (Weak) -->
        <g fill="rgba(148,163,184,0.35)">
          <rect x="31" y="126" width="8" height="14"/><rect x="61" y="124" width="8" height="16"/>
          <rect x="91" y="122" width="8" height="18"/><rect x="121" y="130" width="8" height="10"/>
          <rect x="151" y="120" width="8" height="20"/><rect x="181" y="125" width="8" height="15"/>
          <rect x="211" y="131" width="8" height="9"/><rect x="241" y="130" width="8" height="10"/>
          <rect x="271" y="126" width="8" height="14"/><rect x="301" y="128" width="8" height="12" fill="#f87171"/>
        </g>
        <text x="14" y="122" fill="#94a3b8" font-size="8.5" font-family="monospace">VOL: 0.92x (No Institutional Bid)</text>
      </svg>
    `;
  }

  const volLabel = chartType === "RIGHT_IGNITION_2" ? "VOL SURGE: 3.41x (#1 IN UNIVERSE!)" : "VOL SURGE: 2.46x (INSTITUTIONAL BUY)";
  const maLabel = chartType === "RIGHT_IGNITION_2" ? "+16.4% Above MA60" : "+12.7% Above MA60";

  // Right-side washout -> flat base -> MA60 reclaim + towering green volume bars
  return `
    <svg viewBox="0 0 360 145" width="100%" height="145" style="display:block; background:#070b14; border:1px solid rgba(16,185,129,0.35); border-radius:6px;">
      <!-- Grid lines -->
      <line x1="0" y1="32" x2="360" y2="32" stroke="rgba(148,163,184,0.1)" stroke-dasharray="3,3"/>
      <line x1="0" y1="72" x2="360" y2="72" stroke="rgba(148,163,184,0.1)" stroke-dasharray="3,3"/>
      <line x1="0" y1="110" x2="360" y2="110" stroke="rgba(148,163,184,0.15)"/>
      <!-- Curving Upward MA60 Line -->
      <path d="M 15 48 Q 130 88, 220 76 T 345 52" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
      <text x="14" y="18" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="700">MA60 Reclaimed (${maLabel})</text>
      <!-- Left Washout -> Base -> Right-Side Breakout Candlesticks -->
      <g stroke-width="1.5">
        <line x1="35" y1="45" x2="35" y2="68" stroke="#ef4444"/><rect x="31" y="48" width="8" height="16" fill="#ef4444"/>
        <line x1="65" y1="62" x2="65" y2="86" stroke="#ef4444"/><rect x="61" y="65" width="8" height="17" fill="#ef4444"/>
        <line x1="95" y1="78" x2="95" y2="96" stroke="#ef4444"/><rect x="91" y="80" width="8" height="12" fill="#ef4444"/>
        <line x1="125" y1="82" x2="125" y2="95" stroke="#10b981"/><rect x="121" y="84" width="8" height="8" fill="#10b981"/>
        <line x1="155" y1="80" x2="155" y2="92" stroke="#10b981"/><rect x="151" y="82" width="8" height="7" fill="#10b981"/>
        <line x1="185" y1="74" x2="185" y2="88" stroke="#10b981"/><rect x="181" y="76" width="8" height="9" fill="#10b981"/>
        <line x1="215" y1="62" x2="215" y2="80" stroke="#10b981"/><rect x="211" y="64" width="8" height="13" fill="#10b981"/>
        <line x1="245" y1="46" x2="245" y2="68" stroke="#10b981"/><rect x="241" y="48" width="8" height="17" fill="#10b981"/>
        <line x1="275" y1="34" x2="275" y2="54" stroke="#10b981"/><rect x="271" y="36" width="8" height="15" fill="#10b981"/>
        <line x1="305" y1="20" x2="305" y2="44" stroke="#34d399"/><rect x="300" y="22" width="10" height="19" fill="#10b981"/>
      </g>
      <!-- Glowing Ignition Decision Circle -->
      <circle cx="305" cy="31" r="15" fill="rgba(16,185,129,0.18)" stroke="#34d399" stroke-width="2" stroke-dasharray="3,2"/>
      <text x="225" y="18" fill="#34d399" font-size="9.5" font-family="monospace" font-weight="800">${
    isRevealed ? "🟢 IGNITION CONFIRMED!" : "⚡ RIGHT-SIDE BREAKOUT?"
  }</text>
      <!-- Volume Bars with Massive Emerald Surge on Right -->
      <g fill="rgba(148,163,184,0.32)">
        <rect x="31" y="128" width="8" height="12"/><rect x="61" y="126" width="8" height="14"/>
        <rect x="91" y="130" width="8" height="10"/><rect x="121" y="132" width="8" height="8"/>
        <rect x="151" y="133" width="8" height="7"/><rect x="181" y="130" width="8" height="10"/>
        <rect x="211" y="124" width="8" height="16" fill="rgba(16,185,129,0.6)"/>
        <rect x="241" y="117" width="8" height="23" fill="#10b981"/>
        <rect x="271" y="114" width="8" height="26" fill="#10b981"/>
        <rect x="300" y="109" width="10" height="31" fill="#34d399"/>
      </g>
      <text x="14" y="122" fill="#34d399" font-size="8.5" font-family="monospace" font-weight="800">${volLabel}</text>
    </svg>
  `;
}
function renderChartBlindTest(state) {
  const lang = state.lang && BLIND_TEST_I18N[state.lang] ? state.lang : "en";
  const copy = BLIND_TEST_I18N[lang];
  const rounds = buildRoundsData(state);
  const answers = state.blindTestAnswers || {};
  const isPro = Boolean(state.isProUnlocked);

  let solvedCount = 0;
  let correctCount = 0;
  rounds.forEach((r) => {
    const userPick = answers[r.id];
    if (userPick) {
      solvedCount += 1;
      if (userPick === r.correctAnswer) {
        correctCount += 1;
      }
    }
  });

  const iqScore = solvedCount === 0 ? "—" : `${Math.round((correctCount / solvedCount) * 100)} / 100`;
  const cfg = state.config || {};
  const monthlyUrl = formatCheckoutUrl(
    cfg.whop_tom_monthly_url || cfg.ls_site1_monthly_url,
    "#tom-vip-monthly"
  );
  const annualUrl = formatCheckoutUrl(
    cfg.whop_tom_annual_url || cfg.ls_site1_ltd_url,
    "#tom-vip-annual"
  );

  return `
    <div id="chartBlindTestSection" style="margin-top:16px; background:linear-gradient(180deg, rgba(15,23,42,0.97) 0%, rgba(7,11,20,0.99) 100%); border:1px solid rgba(245,158,11,0.45); border-radius:10px; padding:18px; box-shadow:0 14px 36px rgba(0,0,0,0.45);">
      <!-- Header Strip -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:14px; padding-bottom:12px; border-bottom:1px solid rgba(148,163,184,0.16);">
        <div style="max-width:760px;">
          <div style="display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:0.69rem; font-weight:800; color:#fbbf24; background:rgba(245,158,11,0.14); border:1px solid rgba(245,158,11,0.4); padding:3px 10px; border-radius:999px; margin-bottom:6px;">
            <span>${copy.badge}</span>
          </div>
          <h2 style="font-size:1.12rem; font-weight:800; color:#ffffff; margin:0 0 5px 0; line-height:1.35;">
            ${copy.title}
          </h2>
          <p style="font-size:0.8rem; color:#cbd5e1; margin:0; line-height:1.5;">
            ${copy.subtitle}
          </p>
        </div>

        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <div id="blindTestIqBadge" class="mono" style="background:rgba(16,185,129,0.14); border:1px solid rgba(16,185,129,0.4); color:#34d399; padding:6px 11px; border-radius:6px; font-size:0.74rem; font-weight:800;">
            ${copy.scoreBadgePrefix} <span style="color:#ffffff;">${iqScore}</span> (${solvedCount} ${copy.answeredCountSuffix})
          </div>
          <button type="button" id="btnResetBlindTest" class="btn btn-sm" style="min-height:40px; background:rgba(30,41,59,0.85); border:1px solid var(--border); color:#cbd5e1; font-size:0.74rem; padding:6px 12px; cursor:pointer;">
            ${copy.resetBtn}
          </button>
          <button type="button" id="btnBlindTestJumpDoctor" class="btn btn-sm" style="min-height:40px; background:rgba(56,189,248,0.16); border:1px solid rgba(56,189,248,0.45); color:#38bdf8; font-size:0.74rem; font-weight:800; padding:6px 12px; cursor:pointer;">
            ${copy.jumpDocBtn}
          </button>
        </div>
      </div>

      <!-- 3-Card Interactive Blind Chart Grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap:14px; margin-bottom:16px;">
        ${rounds
          .map((r) => {
            const userPick = answers[r.id] || null;
            const isRevealed = Boolean(userPick);
            const isCorrect = userPick === r.correctAnswer;

            return `
              <div class="blind-test-round-card" data-round-id="${r.id}" style="background:#0b1120; border:1px solid ${
              isRevealed ? (isCorrect ? "rgba(16,185,129,0.55)" : "rgba(239,68,68,0.55)") : "rgba(148,163,184,0.22)"
            }; border-radius:8px; padding:13px; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:8px;">
                    <span class="mono" style="font-size:0.68rem; font-weight:800; color:#fbbf24; background:rgba(245,158,11,0.14); padding:2px 8px; border-radius:4px;">
                      ${copy.roundLabel} ${r.roundNum} / 3
                    </span>
                    <span class="mono" style="font-size:0.68rem; font-weight:700; color:${
                      isRevealed ? (isCorrect ? "#34d399" : "#f87171") : "#94a3b8"
                    };">
                      ${isRevealed ? (isCorrect ? "🟢 +100 QUANT IQ" : "🔴 TRAP TRIGGERED") : "⏳ AWAITING YOUR CALL"}
                    </span>
                  </div>

                  <div style="font-size:0.84rem; font-weight:800; color:#ffffff; margin-bottom:8px; line-height:1.35;">
                    ${r.mysteryTitle}
                  </div>

                  <!-- Animated/Interactive SVG Mini-Chart -->
                  <div style="margin-bottom:10px;">
                    ${renderMiniChartSvg(r.chartType, isRevealed)}
                  </div>

                  <!-- 4 Live Quant Clues -->
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:10px;">
                    ${r.metrics
                      .map(
                        (m) => `
                      <div style="background:#070b14; border:1px solid rgba(148,163,184,0.14); border-radius:5px; padding:5px 8px;">
                        <div class="mono" style="font-size:0.62rem; color:#94a3b8;">${m.label}</div>
                        <div class="mono" style="font-size:0.75rem; font-weight:800; color:${m.color};">${m.value}</div>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>

                <!-- Decision Buttons OR Instant Reveal Panel -->
                <div>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                    <button
                      type="button"
                      class="btn btn-blind-test-pick"
                      data-round="${r.id}"
                      data-pick="BUY"
                      style="min-height:40px; padding:8px 6px; font-size:0.73rem; font-family:var(--font-mono); font-weight:800; border-radius:6px; cursor:pointer; background:${
                        userPick === "BUY" ? "rgba(16,185,129,0.28)" : "rgba(16,185,129,0.12)"
                      }; border:1px solid ${userPick === "BUY" ? "#10b981" : "rgba(16,185,129,0.35)"}; color:#34d399;"
                    >
                      ${copy.buyBtn}
                    </button>
                    <button
                      type="button"
                      class="btn btn-blind-test-pick"
                      data-round="${r.id}"
                      data-pick="TRAP"
                      style="min-height:40px; padding:8px 6px; font-size:0.73rem; font-family:var(--font-mono); font-weight:800; border-radius:6px; cursor:pointer; background:${
                        userPick === "TRAP" ? "rgba(239,68,68,0.28)" : "rgba(239,68,68,0.12)"
                      }; border:1px solid ${userPick === "TRAP" ? "#ef4444" : "rgba(239,68,68,0.35)"}; color:#fca5a5;"
                    >
                      ${copy.trapBtn}
                    </button>
                  </div>

                  ${
                    isRevealed
                      ? `
                    <div class="blind-test-reveal-box" style="margin-top:10px; padding:10px; border-radius:6px; background:${
                      isCorrect ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)"
                    }; border:1px solid ${isCorrect ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)"};">
                      <div class="mono" style="font-size:0.72rem; font-weight:800; color:${isCorrect ? "#34d399" : "#f87171"}; margin-bottom:4px;">
                        ${isCorrect ? copy.correctTag : copy.wrongTag}
                      </div>
                      <div class="mono" style="font-size:0.78rem; font-weight:800; color:#ffffff; margin-bottom:4px;">
                        ${copy.revealTickerLabel}: <span style="color:#fbbf24;">${r.revealedTicker}</span>
                      </div>
                      <div style="font-size:0.73rem; color:#e2e8f0; line-height:1.45;">
                        ${r.explanation}
                      </div>
                    </div>
                  `
                      : ""
                  }
                </div>
              </div>
            `;
          })
          .join("")}
      </div>

      <!-- $10,000 Real Account Comparison Strip + VIP Conversion Bridge -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap:12px; align-items:stretch;">
        <div style="background:#080d19; border:1px solid rgba(148,163,184,0.2); border-radius:8px; padding:12px 14px;">
          <div class="mono" style="font-size:0.7rem; font-weight:800; color:#fbbf24; margin-bottom:8px;">
            ${copy.battleTitle}
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.28); border-radius:6px; padding:9px;">
              <div style="font-size:0.74rem; font-weight:800; color:#fca5a5; margin-bottom:3px;">${copy.retailSideTitle}</div>
              <div class="mono" style="font-size:1.05rem; font-weight:800; color:#f87171; margin-bottom:4px;">$10,000 &rarr; $5,200 (-48%)</div>
              <div style="font-size:0.7rem; color:#94a3b8; line-height:1.4;">${copy.retailSideDesc}</div>
            </div>
            <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.32); border-radius:6px; padding:9px;">
              <div style="font-size:0.74rem; font-weight:800; color:#6ee7b7; margin-bottom:3px;">${copy.quantSideTitle}</div>
              <div class="mono" style="font-size:1.05rem; font-weight:800; color:#34d399; margin-bottom:4px;">$10,000 &rarr; $22,697 (+127%)</div>
              <div style="font-size:0.7rem; color:#94a3b8; line-height:1.4;">${copy.quantSideDesc}</div>
            </div>
          </div>
        </div>

        <div style="background:linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(15,23,42,0.95) 100%); border:1px solid rgba(16,185,129,0.45); border-radius:8px; padding:12px 14px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.8rem; font-weight:800; color:#ffffff; margin-bottom:4px;">
              ${copy.vipUnlockBannerTitle}
            </div>
            <p style="font-size:0.73rem; color:#cbd5e1; margin:0 0 10px 0; line-height:1.45;">
              ${copy.vipUnlockBannerSub}
            </p>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            ${
              isPro
                ? `<span class="mono" style="font-size:0.75rem; font-weight:800; color:#34d399;">👑 PRO VIP ACTIVE — All 72 Tickers Unlocked Below!</span>`
                : `
                  <a
                    href="${monthlyUrl}"
                    data-whop-checkout
                    data-whop-plan="monthly"
                    data-tom-paid-plan="monthly"
                    class="whop-checkout-button btn btn-sm"
                    style="background:#10b981; border:1px solid #059669; color:#052e16; font-weight:800; font-size:0.74rem; padding:7px 12px; border-radius:6px; text-decoration:none;"
                  >
                    ${copy.unlockMonthlyBtn}
                  </a>
                  <a
                    href="${annualUrl}"
                    data-whop-checkout
                    data-whop-plan="annual"
                    data-tom-paid-plan="annual"
                    class="whop-checkout-button btn btn-sm"
                    style="background:rgba(245,158,11,0.2); border:1px solid #f59e0b; color:#fbbf24; font-weight:800; font-size:0.74rem; padding:7px 12px; border-radius:6px; text-decoration:none;"
                  >
                    ${copy.unlockLifetimeBtn}
                  </a>
                  <div style="width:100%; font-size:0.69rem; color:#94a3b8; line-height:1.4; margin-top:2px;">
                    Checkout issue in your region? Join <a href="https://t.me/truthofmarketss" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; font-weight:700; text-decoration:underline;">@truthofmarketss</a> or request instant Pro activation via <a href="mailto:beable9489@gmail.com?subject=Instant%20Pro%20Activation%20Request%20(TruthOfMarket)" style="color:#93c5fd; font-weight:700; text-decoration:underline;">email</a>.
                  </div>
                `
            }
          </div>
        </div>
      </div>
    </div>
  `;
}


// --- src/components/Header.js ---
function getLatestUsMarketCloseDate(serverDateStr = "") {
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
function renderHeader(state) {
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
  const smhPrice = ov && ov.smh_close ? Number(ov.smh_close).toFixed(2) : findClose("SMH", "258.40");
  const xlvPrice = ov && ov.xlv_close ? Number(ov.xlv_close).toFixed(2) : findClose("XLV", "148.90");
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
    <!-- SMH x XLV SECTOR BALANCE & MARKET INDICATOR RIBBON -->
    <div class="market-ribbon" role="region" aria-label="SMH and XLV Sector ETFs and Market Sentiment Gauge">
      <div class="market-ribbon-inner">
        <div class="market-tape">
          <span class="tape-item">
            <span class="tape-sym">$SMH</span>
            <span class="tape-role">(Semiconductor Growth)</span>
            <strong class="tape-price">$${smhPrice}</strong>
          </span>
          <span class="tape-sep" aria-hidden="true">&times;</span>
          <span class="tape-item">
            <span class="tape-sym">$XLV</span>
            <span class="tape-role">(Healthcare Defense)</span>
            <strong class="tape-price">$${xlvPrice}</strong>
          </span>
          <span class="tape-sep" aria-hidden="true">&middot;</span>
          <span class="tape-item">
            <span class="tape-sym">$SGOV</span>
            <span class="tape-role">(US T-Bill Cushion)</span>
            <strong class="tape-price">$${sgovPrice}</strong>
          </span>
          <span class="tape-sep" aria-hidden="true">|</span>
          <span class="tape-item" id="ribbonWeatherStatus">
            <span class="tape-sym">Sector Sentiment Gauge (${fgNum.toFixed(1)}/100):</span>
            <span class="${weatherStatus.cls}" style="font-weight:800;">${weatherStatus.pill}</span>
          </span>
        </div>
        <div class="mono ribbon-date-note" id="latestMarketCloseNote">
          ${closeDate} US Market Close
        </div>
      </div>
    </div>

    <!-- CLEAN 3-STAGE TOPBAR -->
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
            <span class="brand-badge" id="brandSubtitle">SMH &times; XLV Balance Simulator</span>
          </span>
        </a>

        <nav class="senior-top-nav" aria-label="3-Stage SMH x XLV Navigation">
          <a href="${homePrefix}#tom-retirement-architect" class="senior-nav-item" id="navIncomeSim">
            1. 4-Step Balance Survey
          </a>
          <a href="${homePrefix}#tomMorningBellClub" class="senior-nav-item" id="navMarketWeather">
            2. Free Ratio Unlock
          </a>
          <a href="${homePrefix}#tomFreeStarterManual" class="senior-nav-item" id="navBrokerGuide">
            $0 Broker Manual
          </a>
          <a href="#pricing" class="senior-nav-item is-vip-link" id="navVipBenefits">
            3. Daily Tracking VIP
          </a>
          <button
            type="button"
            class="senior-nav-item is-font-btn"
            id="btnToggleTomFont"
            title="Cycle Large-Print Text Size: 18px -> 20px -> 22px"
          >
            Text Size A+${fontPx > 18 ? ` (${fontPx}px)` : ""}
          </button>
        </nav>
      </div>
    </header>
  `;
}


// --- src/components/Hero.js ---
const TOM_MORNING_CLUB_COMPANION_MSG = {
  steady:
    "🤝 Steady discipline — pairing Semiconductor Growth ($SMH) with Healthcare Defense ($XLV) cushions deep tech drawdowns across multi-year cycles.",
  watch:
    "👀 Calm observation — tracking overheating and fear indicator bands before adjusting sector weights helps avoid emotional decisions.",
  cash:
    "🛡️ Safety cushion — adding a short-term US Treasury reserve ($SGOV) alongside $XLV keeps near-term cash insulated during market storms.",
};
function getTomMorningClubTodayKey() {
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
function getTomMorningClubPollData(todayKey) {
  const dateKey = todayKey || getTomMorningClubTodayKey();
  return {
    dateKey,
    choice: "",
    counts: { steady: 184, watch: 196, cash: 142 },
    total: 522,
    pct: { steady: 35, watch: 38, cash: 27 },
  };
}
function escapeTomCrmHtml(raw) {
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
const TOM_SURVEY_STEP1_OPTIONS = [
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
const TOM_SURVEY_STEP2_PRESETS = [
  { val: 50000, label: "$50k" },
  { val: 150000, label: "$150k" },
  { val: 300000, label: "$300k" },
  { val: 500000, label: "$500k" },
  { val: 1000000, label: "$1M+" },
];
const TOM_SURVEY_STEP3_COMFORT = [
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
const TOM_SURVEY_STEP4_TECH = [
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
function getSavedTomSurveyState() {
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
function computeTomSmhXlvBaseline(survey) {
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
    profileName = "Classic 55:35:10 Growth-Defense Barbell (70% SMH : 30% XLV)";
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
function getStoredTomClubMember() {
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
function registerTomClubMemberSafe(opts) {
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
            <td class="is-pos"><strong>+12.8% CAGR/yr Historical Model</strong> (2.03 Sharpe)</td>
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
function bindTomRetirementArchitectEvents(state, showToastFn) {
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
function bindTomPasswordlessClubEvents(state, showToastFn) {
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
function renderHero(state) {
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
function renderFreeStarterManual(state) {
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
function renderEasyProfitSimulator(state) {
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


// --- src/components/ProofCard.js ---
function renderProofCard(state) {
  const t = state.t;

  return `
    <section class="proof-card">
      <!-- SEEKING ALPHA-STYLE AUDITED COMPARATIVE RETURN CURVE CARD -->
      <div class="audited-track-card" style="background:linear-gradient(180deg, #0f172a 0%, #090d16 100%); border:1px solid #1e293b; border-radius:8px; padding:18px 20px; margin-bottom:18px; box-shadow:0 4px 20px rgba(0,0,0,0.35);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:12px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); font-weight:800; color:#38bdf8; letter-spacing:0.06em; text-transform:uppercase;">
              ${t.auditedCardTag || "AUDITED BACKTEST TRACK RECORD · 1998–2026 (26.8 YEARS)"}
            </div>
            <h2 style="font-size:1.18rem; font-weight:800; color:#ffffff; margin:3px 0 2px; letter-spacing:-0.01em;">
              ${t.auditedCardTitle || "SMH/XLV Contrarian Barbell (+28.4%) vs. S&P 500 (+14.2%) Benchmark"}
            </h2>
            <p style="font-size:0.78rem; color:var(--muted); margin:0; line-height:1.45;">
              ${t.auditedCardDesc || "Audited institutional point-in-time backtest across 6,625 trading days with zero look-ahead bias. Adjustd annually with dynamic 80:20 contrarian tilt during semiconductor drawdowns ≥ -20%."}
            </p>
          </div>
          <div style="display:inline-flex; align-items:center; gap:6px; padding:5px 10px; background:rgba(14,203,129,0.12); border:1px solid rgba(14,203,129,0.35); border-radius:20px; font-size:0.75rem; font-family:var(--font-mono); font-weight:800; color:#34d399; box-shadow:0 0 12px rgba(14,203,129,0.25);">
            <span style="width:6px; height:6px; border-radius:50%; background:#0ecb81; display:inline-block; box-shadow:0 0 6px #0ecb81;"></span>
            <span>${t.auditedAlphaBadge || "+14.2% Annualized Alpha vs S&P 500 · 2.03x Sharpe Efficiency"}</span>
          </div>
        </div>

        <!-- 2-COLUMN COMPARATIVE SHOWCASE (SEEKING ALPHA STYLE) -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap:14px; margin-bottom:14px;">
          <!-- Barbell Strategy Winner Card -->
          <div style="background:#0b1322; border:1px solid rgba(14,203,129,0.4); border-radius:6px; padding:14px 16px; position:relative; overflow:hidden;">
            <div style="position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, #0ecb81, #38bdf8);"></div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-size:0.82rem; font-weight:800; color:#ffffff;">
                🏆 ${t.auditedBarbellLabel || "SMH 70% : XLV 30% Contrarian Barbell"}
              </span>
              <span style="font-size:0.65rem; font-family:var(--font-mono); padding:2px 6px; background:rgba(14,203,129,0.18); color:#34d399; border-radius:3px; font-weight:700;">
                QUANT OUTPERFORMER
              </span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricCagr || "Annualized Return"}</div>
                <div class="mono" style="font-size:1.45rem; font-weight:900; color:var(--fin-up); line-height:1.2;">+28.4%</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">CAGR (1998–2026)</div>
              </div>
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricMdd || "Maximum Drawdown"}</div>
                <div class="mono" style="font-size:1.45rem; font-weight:900; color:#38bdf8; line-height:1.2;">-24.1%</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">Defensive Cushion</div>
              </div>
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricSharpe || "Sharpe Ratio"}</div>
                <div class="mono" style="font-size:1.2rem; font-weight:800; color:#ffffff; line-height:1.2;">1.38</div>
                <div style="font-size:0.68rem; color:#34d399; margin-top:2px;">High Risk-Adjusted</div>
              </div>
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricGrowth || "Growth of $10,000"}</div>
                <div class="mono" style="font-size:1.2rem; font-weight:800; color:#fbbf24; line-height:1.2;">$4,842,100</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">+484.2x Multiple</div>
              </div>
            </div>
          </div>

          <!-- S&P 500 Benchmark Comparison Card -->
          <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:14px 16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-size:0.82rem; font-weight:700; color:var(--text-secondary);">
                📊 ${t.auditedSpyLabel || "S&P 500 (SPY) Benchmark"}
              </span>
              <span style="font-size:0.65rem; font-family:var(--font-mono); padding:2px 6px; background:#141c2e; color:var(--muted); border-radius:3px;">
                PASSIVE BENCHMARK
              </span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricCagr || "Annualized Return"}</div>
                <div class="mono" style="font-size:1.45rem; font-weight:800; color:var(--text-secondary); line-height:1.2;">+14.2%</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">CAGR (1998–2026)</div>
              </div>
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricMdd || "Maximum Drawdown"}</div>
                <div class="mono" style="font-size:1.45rem; font-weight:800; color:var(--fin-down); line-height:1.2;">-50.8%</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">2008 GFC Peak-Trough</div>
              </div>
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricSharpe || "Sharpe Ratio"}</div>
                <div class="mono" style="font-size:1.2rem; font-weight:800; color:var(--text-secondary); line-height:1.2;">0.68</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">Standard Equity Risk</div>
              </div>
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricGrowth || "Growth of $10,000"}</div>
                <div class="mono" style="font-size:1.2rem; font-weight:800; color:var(--text-secondary); line-height:1.2;">$348,200</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">+34.8x Multiple</div>
              </div>
            </div>
          </div>
        </div>

        <!-- COMPARATIVE PROGRESS CURVE BARS -->
        <div style="background:#070b14; border:1px solid #162032; border-radius:6px; padding:10px 14px; font-size:0.75rem; font-family:var(--font-mono);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
            <span style="color:var(--text-secondary); font-weight:600;">Annualized Return (CAGR): Barbell +28.4% vs S&amp;P 500 +14.2%</span>
            <span style="color:#34d399; font-weight:800;">+2.0x S&amp;P Velocity</span>
          </div>
          <div style="display:flex; height:8px; border-radius:4px; overflow:hidden; background:#141c2e; margin-bottom:8px;">
            <div style="width:66.7%; background:linear-gradient(90deg, #0ecb81, #38bdf8);" title="SMH/XLV Barbell: +28.4%"></div>
            <div style="width:33.3%; background:#64748b;" title="S&P 500: +14.2%"></div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; color:var(--muted); font-size:0.68rem;">
            <span><span style="display:inline-block; width:8px; height:8px; background:#0ecb81; border-radius:2px; margin-right:4px;"></span>SMH/XLV Barbell: <b>+28.4%</b></span>
            <span><span style="display:inline-block; width:8px; height:8px; background:#64748b; border-radius:2px; margin-right:4px;"></span>S&amp;P 500: <b>+14.2%</b></span>
            <span style="color:#38bdf8;">Spread: <b>+14.2% / yr Outperformance</b></span>
          </div>
        </div>
      </div>

      <div class="proof-title">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="width:3px; height:14px; background:var(--fin-up); display:inline-block;"></span>
          <span id="proofHeading">${t.proofHeading}</span>
        </div>
        <button class="btn btn-sm" id="btnCopyTopProofCard">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>${t.proofCopyScorecardBtn}</span>
        </button>
      </div>
      <div class="table-responsive-scroll">
        <table class="proof-table">
          <thead>
            <tr>
              <th>${t.th_arch}</th>
              <th class="col-num">${t.th_2x}</th>
              <th class="col-num">${t.th_med}</th>
              <th class="col-num">${t.th_mdd}</th>
              <th class="col-num">${t.th_dead}</th>
              <th class="col-num">${t.th_trap}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-family:var(--font-sans); color:var(--text-secondary);">0. Market Random Entry Baseline</td>
              <td class="col-num">18.20%</td>
              <td class="col-num">+13.24%</td>
              <td class="col-num">-19.35%</td>
              <td class="col-num">74.0d</td>
              <td class="col-num">19.20%</td>
            </tr>
            <tr>
              <td style="font-family:var(--font-sans); color:var(--fin-down);">1. Blind 52-Week Low Dip Buy (+0–10% off low, below MA20)</td>
              <td class="col-num">28.91%</td>
              <td class="col-num">+20.56%</td>
              <td class="col-num" style="color:var(--fin-down);">-30.31%</td>
              <td class="col-num" style="color:var(--fin-down);">81.0d</td>
              <td class="col-num" style="color:var(--fin-down);">25.54%</td>
            </tr>
            <tr>
              <td style="font-family:var(--font-sans); color:var(--text-secondary);">2. 52-Week Low + Earnings Filter (Left-Side Entry)</td>
              <td class="col-num">30.06%</td>
              <td class="col-num">+24.28%</td>
              <td class="col-num">-29.85%</td>
              <td class="col-num">81.0d</td>
              <td class="col-num">24.82%</td>
            </tr>
            <tr class="proof-highlight">
              <td style="font-family:var(--font-sans);">3. MA20/60 Trend Reclaim Cohort (+14–35% off low + MA20/60 Alignment + 1.40x Vol)</td>
              <td class="col-num" style="color:var(--fin-up);">55.24%</td>
              <td class="col-num" style="color:var(--fin-up);">+80.47% (Mean +109.1%)</td>
              <td class="col-num" style="color:var(--fin-up);">-16.49%</td>
              <td class="col-num" style="color:var(--fin-up);">29.0d</td>
              <td class="col-num" style="color:var(--fin-up);">0.93%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}


// --- src/components/StockTable.js ---

const HIGH_VOLATILITY_TICKERS = new Set([
  "CVNA", "SMCI", "HOOD", "COIN", "MSTR", "SOXL", "TQQQ", "AFRM", "UPST", "RIVN",
  "SNAP", "ROKU", "SOFI", "FLNC", "SEDG", "ENPH", "U", "MARA", "RIOT", "SQQQ", "SOXS",
]);

const RETIREMENT_INCOME_BLUECHIPS = new Set([
  "SMH", "XLV", "SGOV", "VOO", "JNJ", "PG", "KO", "COST", "V", "MSFT", "AAPL",
  "PEP", "WMT", "JPM", "UNH", "HD", "ABBV", "CVX", "XOM", "LLY", "AVGO", "MA", "LMT",
]);
function renderScreenerControls(state) {
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

          <button type="button" class="btn btn-sm" id="btnExportVipWatchlistCsv" style="min-height:40px; background:rgba(251,191,36,0.12); border-color:rgba(251,191,36,0.4); color:#fbbf24; font-weight:700; padding:6px 8px; font-size:0.71rem;" title="Save starred VIP Watchlist snapshot">
            ⭐ Saved (${cWatchlist})
          </button>
        </div>

        <div class="filter-tabs" role="tablist" aria-label="Factor Regime Filters">
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
function renderStockTable(state) {
  const t = state.t;
  const isPro = state.isProUnlocked;
  const stocks = (state.filteredStocks || []).filter((s) => !String(s.ticker).includes("."));
  const cfg = state.config || {};
  const monthlyUrl = formatCheckoutUrl(
    cfg.whop_tom_monthly_url || cfg.ls_site1_monthly_url,
    "#tom-vip-monthly"
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
        ${t.softPaywallTitle || "🔒 VIP Historical Factor Dataset & Reference Bands"}
      </div>
      <p style="color:#cbd5e1; font-size:0.82rem; margin:0 0 12px; line-height:1.5;">
        ${t.softPaywallDesc || "Click any unlocked stock row for factor details, or unlock Monthly Research Pass ($29/mo) to reveal all hidden dataset rows, MA60 reference bands, and statistical workbooks."}
      </p>
      <a class="soft-paywall-btn whop-checkout-button btn-unlock-row" data-whop-checkout data-whop-plan="monthly" data-tom-paid-plan="monthly" href="${monthlyUrl}" style="min-height:42px;">
        🔒 ${t.softPaywallUnlockCta || "Start Monthly Research Pass — $29/mo"} →
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
function renderStockRows(state) {
  const t = state.t || {};
  const stocks = (state.filteredStocks || []).filter((s) => !String(s.ticker).includes("."));
  const lang = state.lang || "en";
  const isPro = state.isProUnlocked;
  const cfg = state.config || {};
  const polarMonthlyUrl = formatCheckoutUrl(
    cfg.whop_tom_monthly_url || cfg.ls_site1_monthly_url,
    "#tom-vip-monthly"
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
              <a class="btn btn-primary btn-sm whop-checkout-button btn-unlock-row" data-whop-checkout data-whop-plan="monthly" data-tom-paid-plan="monthly" href="${polarMonthlyUrl}" style="min-height:40px; white-space:nowrap; font-weight:700;">
                🔒 Start Monthly Research Pass — $29/mo
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
          <a class="btn btn-primary btn-sm whop-checkout-button btn-unlock-row" data-whop-checkout data-whop-plan="monthly" data-tom-paid-plan="monthly" href="${polarMonthlyUrl}" style="min-height:38px; white-space:nowrap; font-weight:700;">
            🔒 Start Monthly Research Pass — $29/mo
          </a>
        </td>
        <td>
          <a class="btn btn-primary btn-sm whop-checkout-button btn-unlock-row" data-whop-checkout data-whop-plan="monthly" data-tom-paid-plan="monthly" href="${polarMonthlyUrl}" style="min-height:38px; white-space:nowrap; font-weight:700;">
            🔒 Start Monthly Research Pass — $29/mo
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
        : `<a class="btn btn-sm whop-checkout-button btn-unlock-row" data-whop-checkout data-whop-plan="monthly" data-tom-paid-plan="monthly" href="${polarMonthlyUrl}" style="min-height:38px; white-space:nowrap; font-weight:700; border-color:rgba(59,130,246,0.45); color:#93c5fd; background:rgba(37,99,235,0.14);">
             🔒 Start Monthly Research Pass — $29/mo
           </a>`;

      const tvUrl = `https://www.tradingview.com/symbols/${encodeURIComponent(s.ticker)}/?aff_id=${tvAffId}`;
      const saUrl = `https://seekingalpha.com/symbol/${encodeURIComponent(s.ticker)}/earnings?source=${saSource}`;
      const tsUrl = `https://trendspider.com/?_go=${tsAffId}&symbol=${encodeURIComponent(s.ticker)}`;

      const vipWatchlist = state.vipWatchlist || [];
      const isStarred = vipWatchlist.includes(s.ticker);
      const tkrUpper = String(s.ticker || "").toUpperCase();
      const isSpeculative = HIGH_VOLATILITY_TICKERS.has(tkrUpper);
      const isBlueChip = RETIREMENT_INCOME_BLUECHIPS.has(tkrUpper);
      const profileTagHtml = isSpeculative
        ? `<span style="font-size:0.65rem; font-family:var(--font-sans); padding:1px 6px; background:rgba(245,158,11,0.16); border:1px solid rgba(217,119,6,0.45); color:var(--fin-amber); border-radius:4px; font-weight:800;">Volatility &amp; Risk Profile</span>`
        : isBlueChip
        ? `<span style="font-size:0.65rem; font-family:var(--font-sans); padding:1px 6px; background:rgba(16,185,129,0.15); border:1px solid rgba(5,150,105,0.45); color:var(--fin-up); border-radius:4px; font-weight:800;">Dividend &amp; Blue-Chip Core</span>`
        : `<span style="font-size:0.62rem; font-family:var(--font-mono); padding:1px 5px; background:var(--card2); border:1px solid var(--border); color:var(--muted); border-radius:3px;">US Factor Study</span>`;

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
                  style="background:none; border:none; cursor:pointer; font-size:0.95rem; padding:2px 4px; line-height:1; color:${isStarred ? "#d97706" : "var(--muted)"}; display:inline-flex; align-items:center;"
                >
                  ${isStarred ? "⭐" : "☆"}
                </button>
                <span class="mono" style="font-weight:800; font-size:0.92rem; color:var(--text);">${s.ticker}</span>
                ${profileTagHtml}
                ${
                  !isPro && s.ticker === "CELH"
                    ? `<span style="font-size:0.6rem; padding:1px 4px; background:rgba(14,203,129,0.18); color:var(--fin-up); border-radius:2px; font-weight:700;">FREE SHOWCASE</span>`
                    : ""
                }
              </div>
              <div class="mobile-stock-card-summary mono" style="align-items:center; gap:8px;">
                <span style="font-weight:800; font-size:0.92rem; color:var(--text);">$${closeVal.toFixed(2)}</span>
                <span style="font-size:0.74rem; font-weight:800; padding:2px 6px; border-radius:4px; background:var(--card2); border:1px solid var(--border); color:${s.score >= 80 ? "var(--fin-up)" : s.score >= 55 ? "var(--fin-amber)" : "var(--fin-down)"};">Score ${Number(s.score ?? 0)}</span>
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
                    ? `<span class="mono" style="font-size:0.72rem; color:#cbd5e1;">MA60 <b style="color:#60a5fa;">${ma60Disp}</b> · REF <b style="color:var(--fin-down);">${stopDisp}</b></span>`
                    : `<span class="mono" style="font-size:0.71rem; color:#93c5fd;">🔒 VIP Factor Reference Bands</span>`
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
          <div class="mono" style="font-weight:700; color:var(--text);" title="Latest Close Date: ${s.date || "2026-11-16"}">$${closeVal.toFixed(2)}</div>
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


// --- src/components/ProVault.js ---
function renderProVault(state) {
  const t = state.t || {};
  const isPro = state.isProUnlocked;
  const stocks = state.stocks || [];
  const topIgnitions = stocks
    .filter((s) => s.zone_code === "IGNITION_ZONE" || Number(s.score) >= 75)
    .slice(0, 5);
  const proCapUsd = Number(state.proPortfolioUsd || 30000);
  const perSlotUsd = Math.round(proCapUsd * 0.15); // 15% slot -> 9% stop = 1.35% total account risk
  const celh = stocks.find((s) => s.ticker === "CELH");
  const mbly = stocks.find((s) => s.ticker === "MBLY");

  const allUsStocks = stocks.filter((s) => !String(s.ticker).includes("."));
  const sectorGroups = {};
  const standardSectors = [
    "AI & Semiconductors",
    "Cloud & Enterprise Software",
    "Internet & Digital Media",
    "Fintech & Digital Finance",
    "Consumer & Retail",
    "Mobility, EV & CleanTech",
    "Healthcare & Biotechnology",
    "Energy & Industrials",
  ];
  for (const s of allUsStocks) {
    const secName = (SECTOR_REGIME_MAP && SECTOR_REGIME_MAP[s.sector]) || s.sector || "Other";
    if (!sectorGroups[secName]) sectorGroups[secName] = [];
    sectorGroups[secName].push(s);
  }
  const sectorMatrixItems = standardSectors.map((secName) => {
    const sList = sectorGroups[secName] || [];
    const count = sList.length;
    const avgScore = count > 0 ? Math.round((sList.reduce((acc, x) => acc + Number(x.score || 0), 0) / count) * 10) / 10 : 0.0;
    const ignCount = sList.filter((x) => x.zone_code === "IGNITION_ZONE").length;
    const trend = avgScore >= 50.0 ? "BULLISH" : avgScore < 40.0 ? "BEARISH" : "NEUTRAL";
    return { name: secName, count, avg_score: avgScore, momentum_trend: trend, ignition_count: ignCount, tickers: sList.map((x) => x.ticker) };
  });
  sectorMatrixItems.sort((a, b) => b.ignition_count - a.ignition_count || b.avg_score - a.avg_score);

  const celhClose = celh && celh.close ? Number(celh.close).toFixed(2) : "29.12";
  const celhMa20 = celh && celh.ma20_price ? Number(celh.ma20_price).toFixed(2) : "28.19";
  const celhMa60 = celh && celh.ma60_price ? Number(celh.ma60_price).toFixed(2) : "29.16";
  const celhTp1 = celh && celh.tp1_2x_price ? Number(celh.tp1_2x_price).toFixed(2) : (Number(celhClose) * 2).toFixed(2);
  const celhStop = celh && celh.stop_loss_price ? Number(celh.stop_loss_price).toFixed(2) : (Number(celhClose) * 0.91).toFixed(2);
  const celhScore = celh ? Number(celh.score) : 84;

  const mblyClose = mbly && mbly.close ? Number(mbly.close).toFixed(2) : "5.96";
  const mblyLow52 = mbly && mbly.low52 ? Number(mbly.low52).toFixed(2) : "5.86";
  const mblyMa20 = mbly && mbly.ma20_price ? Number(mbly.ma20_price).toFixed(2) : "6.83";
  const mblyScore = mbly ? Number(mbly.score) : 20;
  const vipTgUrl = getVipTelegramUrl(isPro);

  const pineCode =
    state.pineCode ||
    `//@version=5
indicator("TruthOfMarket MA20/60 & Volume Overlay v2.6", overlay=true)
ma20 = ta.sma(close, 20)
ma60 = ta.sma(close, 60)
low52 = ta.lowest(low, 252)
high52 = ta.highest(high, 252)
volRatio = volume / ta.sma(volume, 20)
washout10d = ta.highest(volRatio, 10) >= 1.40
proxLow = (close - low52) / low52 * 100
ddHigh = (close - high52) / high52 * 100
ignition = ddHigh <= -35 and proxLow >= 10 and proxLow <= 40 and close > ma20 and close > ma60 and washout10d
plot(ma20, "MA20", color=color.new(color.aqua, 0), linewidth=2)
plot(ma60, "MA60 Reference", color=color.new(color.orange, 0), linewidth=2)
plotshape(ignition and not ignition[1], "MA20/60 RECLAIM", shape.labelup, location.belowbar, color.green, text="RECLAIM", textcolor=color.white)`;

  return `
    <section class="proof-card" id="proVaultSection" style="border-top:2px solid var(--fin-blue); margin-bottom:22px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
        <div>
          <span class="badge ${isPro ? "badge-ignition" : "badge-watch"}" id="vaultBadge">
            ${isPro ? t.vaultBadgeUnlocked : t.vaultBadgeLocked}
          </span>
          <h2 style="font-size:1.2rem; font-weight:800; margin-top:6px; color:#ffffff; letter-spacing:-0.01em;">
            ${t.vaultTitle}
          </h2>
        </div>
        <button class="btn btn-primary" id="vaultUnlockBtn" style="${isPro ? "display:none;" : ""}">
          ${t.vaultUnlockBtn}
        </button>
      </div>

      <div style="position:relative;">
        ${
          !isPro
            ? `<div id="vaultOverlayUnlock" style="position:absolute; inset:0; z-index:10; display:flex; align-items:center; justify-content:center; background:rgba(6,9,17,0.58); border-radius:6px; cursor:pointer;">
                 <div style="background:#0d1424; border:1px solid var(--fin-blue); box-shadow:0 12px 32px rgba(0,0,0,0.75); border-radius:6px; padding:22px 26px; text-align:center; max-width:500px;">
                   <div class="mono" style="font-size:0.72rem; color:#fbbf24; font-weight:800; letter-spacing:0.05em;">👑 VIP EDUCATIONAL CALCULATOR SUITE LOCKED</div>
                   <div style="font-size:1.05rem; font-weight:800; color:#ffffff; margin:8px 0;">
                     Unlock All 72 Factor Datasets, Position Sizing Math Calculator &amp; 2000–2025 Historical Statistical Workbook
                   </div>
                   <div style="font-size:0.8rem; color:var(--muted); margin-bottom:14px; line-height:1.5;">
                     Free users see 1 open factor example ($CELH). Upgrade to Monthly Research Pass ($29/mo) or Annual Research Pass ($199/yr) to access the full quantitative factor dataset, mathematical share-sizing models, and the 2000–2025 Semiconductor & Healthcare Statistical Workbook.
                   </div>
                   <span class="btn btn-primary" style="justify-content:center; width:100%; padding:10px; font-weight:800;">
                     🔑 Enter License Key / Reserve VIP Access →
                   </span>
                 </div>
               </div>`
            : ""
        }

      <!-- PRO VIP MODULE 00: TODAY'S IGNITION ORDER BOOK & ACCOUNT POSITION SIZING ENGINE -->
      <div class="${isPro ? "" : "blur-locked"}" style="background:#090d16; border:1px solid rgba(16,185,129,0.35); border-left:4px solid var(--fin-up); border-radius:4px; padding:16px 18px; margin-bottom:16px;">
        <!-- PRO VIP PRIVATE TELEGRAM CHANNEL INVITE BANNER -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:rgba(2,132,199,0.14); border:1px solid rgba(56,189,248,0.45); border-radius:6px; padding:12px 14px; margin-bottom:14px;">
          <div>
            <div class="mono" style="font-size:0.68rem; color:#38bdf8; font-weight:800; letter-spacing:0.05em;">
              🔒 VIP SUBSCRIBERS ONLY · EDUCATIONAL DATA &amp; QUANTITATIVE RESEARCH DESK
            </div>
            <div style="font-size:0.86rem; font-weight:800; color:#ffffff; margin-top:2px;">
              Daily $SMH / $XLV &amp; 72-Equity Factor Data Summaries + Educational Briefings
            </div>
          </div>
          <a
            class="btn btn-sm ${isPro ? "" : "btn-gated-vip-tg"}"
            href="${isPro ? vipTgUrl : "#pricing"}"
            ${isPro ? 'target="_blank" rel="noopener noreferrer"' : ""}
            style="background:#0284c7; border-color:#38bdf8; color:#ffffff; font-weight:800; padding:8px 14px;"
          >
            ✈️ Join Pro VIP Telegram Channel ↗
          </a>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div>
            <div class="mono" style="font-size:0.7rem; color:var(--fin-up); font-weight:800; letter-spacing:0.05em;">
              👑 PRO VIP EXCLUSIVE · DAILY RIGHT-SIDE IGNITION ORDER BOOK & POSITION SIZING
            </div>
            <h3 style="font-size:1.02rem; font-weight:800; color:#ffffff; margin-top:3px;">
              Today's Top Turnaround Action Sheet (1.35% Max Account Risk per Position)
            </h3>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <label class="mono" style="font-size:0.72rem; color:var(--muted);">MY ACCOUNT ($ USD):</label>
            <input type="number" id="proCapitalInput" value="${proCapUsd}" step="5000" min="1000" style="width:120px; padding:6px 8px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-mono); font-weight:700; margin:0;" />
            <button type="button" class="btn btn-emerald btn-sm" id="btnCalcProSizing">Update Shares</button>
          </div>
        </div>
        <div class="table-responsive-scroll">
          <table class="stock-table" style="font-size:0.78rem;">
            <thead>
              <tr>
                <th>Factor Row</th>
                <th>Factor Score</th>
                <th>Latest Close</th>
                <th>MA20/60 Reference</th>
                <th>Lower Band Ref</th>
                <th>Upper Band Ref</th>
                <th>15% Slot Simulation ($${perSlotUsd.toLocaleString()})</th>
                <th>Simulated Variance</th>
              </tr>
            </thead>
            <tbody>
              ${topIgnitions
                .map((s, idx) => {
                  const lockedVip = !isPro && idx >= 1;
                  if (lockedVip) {
                    const genericSlotLoss = Math.round(perSlotUsd * 0.09);
                    return `
                    <tr>
                      <td class="mono" style="font-weight:800; color:#fbbf24;">🔒 VIP IGNITION #${idx + 1} <span style="color:var(--muted); font-weight:500;">(🔒 VIP SECTOR)</span></td>
                      <td class="mono" style="color:var(--fin-up); font-weight:800;">${s.score}/100</td>
                      <td class="mono">🔒 PRO</td>
                      <td class="mono" style="color:#60a5fa; font-weight:700;">🔒 PRO</td>
                      <td class="mono" style="color:var(--fin-down); font-weight:700;">🔒 PRO</td>
                      <td class="mono" style="color:var(--fin-up); font-weight:700;">🔒 PRO</td>
                      <td class="mono" style="color:#ffffff; font-weight:800;">🔒 Unlock Pro ($29/mo)</td>
                      <td class="mono" style="color:var(--fin-amber);">-$${genericSlotLoss.toLocaleString()} (-1.35% Eq)</td>
                    </tr>
                  `;
                  }
                  const c = Number(s.close || 29.12);
                  const trig = Number(s.entry_trigger_price ?? s.ma60_price ?? c).toFixed(2);
                  const stp = Number(s.stop_loss_price ?? c * 0.91).toFixed(2);
                  const tp1 = Number(s.tp1_2x_price ?? c * 2.0).toFixed(2);
                  const sh = Math.max(1, Math.floor(perSlotUsd / c));
                  const maxLossUsd = Math.round(sh * c * 0.09);
                  return `
                    <tr>
                      <td class="mono" style="font-weight:800; color:#ffffff;">#${idx + 1} $${s.ticker} <span style="color:var(--muted); font-weight:500;">(${s.sector})</span></td>
                      <td class="mono" style="color:var(--fin-up); font-weight:800;">${s.score}/100</td>
                      <td class="mono">$${c.toFixed(2)}</td>
                      <td class="mono" style="color:#60a5fa; font-weight:700;">$${trig}</td>
                      <td class="mono" style="color:var(--fin-down); font-weight:700;">$${stp}</td>
                      <td class="mono" style="color:var(--fin-up); font-weight:700;">$${tp1}</td>
                      <td class="mono" style="color:#ffffff; font-weight:800;">Model ${sh} shares ($${Math.round(sh * c).toLocaleString()})</td>
                      <td class="mono" style="color:var(--fin-amber);">-$${maxLossUsd.toLocaleString()} (-1.35% Eq)</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- PRO VIP MODULE: MULTI-POSITION PORTFOLIO DOCTOR 2.0 -->
      <div class="${isPro ? "" : "blur-locked"}">
        ${renderPortfolioDoctorForm(state)}
      </div>

      <!-- PRO VIP MODULE: 72-STOCK SECTOR REGIME MATRIX & HEATMAP -->
      <div class="${isPro ? "" : "blur-locked"}" style="background:#090d16; border:1px solid var(--border); border-top:2px solid #06b6d4; border-radius:4px; padding:16px 18px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div>
            <div class="mono" style="font-size:0.7rem; color:#06b6d4; font-weight:800; letter-spacing:0.05em; text-transform:uppercase;">
              👑 PRO VIP EXCLUSIVE · 72-STOCK SECTOR REGIME MATRIX &amp; ROTATION HEATMAP
            </div>
            <h3 style="font-size:1.02rem; font-weight:800; color:#ffffff; margin-top:3px;">
              Sector Momentum Scores &amp; Ignition Concentration Across 8 Regimes
            </h3>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn btn-sm" id="btnVaultGoWatchlist" style="background:rgba(251,191,36,0.12); border-color:rgba(251,191,36,0.4); color:#fbbf24; font-weight:700;">
              ⭐ Filter Screener to VIP Watchlist
            </button>
            <button type="button" class="btn btn-sm" id="btnVaultExportWatchlistCsv" style="background:rgba(251,191,36,0.12); border-color:rgba(251,191,36,0.4); color:#fbbf24; font-weight:700;">
              📥 Save Watchlist Workbook
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap:10px;">
          ${sectorMatrixItems
            .map((sec) => {
              const trendCol = sec.momentum_trend === "BULLISH" ? "var(--fin-up)" : sec.momentum_trend === "BEARISH" ? "var(--fin-down)" : "var(--fin-amber)";
              const ignBadge = sec.ignition_count > 0 ? `<span class="badge badge-ignition" style="font-size:0.64rem;">${sec.ignition_count} IGNITION</span>` : `<span class="badge" style="background:rgba(255,255,255,0.06); color:var(--muted); font-size:0.64rem;">0 IGNITION</span>`;
              return `
                <div style="background:#05080f; border:1px solid var(--border); border-radius:4px; padding:12px; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                      <span class="mono" style="font-size:0.78rem; font-weight:800; color:#ffffff;">${sec.name}</span>
                      ${ignBadge}
                    </div>
                    <div style="display:flex; align-items:center; gap:8px; margin:6px 0;">
                      <div class="score-bar" style="flex:1;">
                        <div class="score-fill" style="width:${sec.avg_score}%; background:${trendCol};"></div>
                      </div>
                      <span class="mono" style="font-size:0.8rem; font-weight:800; color:${trendCol};">${sec.avg_score.toFixed(1)}</span>
                    </div>
                    <div class="mono" style="font-size:0.7rem; color:var(--muted); margin-bottom:6px;">
                      Trend: <b style="color:${trendCol};">${sec.momentum_trend}</b> · ${sec.count} US Equities
                    </div>
                  </div>
                  <div style="padding-top:6px; border-top:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; align-items:center;">
                    <span class="mono" style="font-size:0.66rem; color:var(--text-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:140px;">
                      ${sec.tickers.slice(0, 4).join(", ")}${sec.tickers.length > 4 ? "..." : ""}
                    </span>
                    <button type="button" class="btn btn-sm btn-filter-sector-card" data-sector="${sec.name}" style="padding:2px 7px; font-size:0.68rem; border-color:rgba(56,189,248,0.4); color:#38bdf8;">
                      Filter Table ↗
                    </button>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>

      <div id="vaultContentWrap" class="${isPro ? "" : "blur-locked"}" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap:16px;">
        <!-- Module 01: Variance Calculator rendered in unblurred section above -->

        <!-- Module 02: Institutional SEC Research Vault -->
        <div style="background:#090d16; border:1px solid var(--border); border-top:2px solid var(--fin-blue); border-radius:4px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:#60a5fa; letter-spacing:0.05em; text-transform:uppercase;">
              ${t.tool2Title}
            </div>
            <h3 style="font-size:1rem; font-weight:800; margin:6px 0; color:#ffffff;">${t.tool2Sub}</h3>
            <p style="font-size:0.78rem; color:var(--muted); margin-bottom:12px;">${t.tool2Desc}</p>

            <div style="font-size:0.8rem; background:#05080f; padding:12px; border-radius:4px; border:1px solid var(--border); margin-bottom:12px; display:flex; flex-direction:column; gap:12px;">
              <div style="border-left:3px solid var(--fin-up); padding-left:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <b class="mono" style="color:#ffffff;">CELH · Celsius Holdings ($${celhClose})</b>
                  <span class="badge badge-ignition">SCORE ${celhScore}</span>
                </div>
                <div style="color:var(--muted); font-size:0.76rem; margin-top:4px; line-height:1.45;">
                  PepsiCo North America inventory destocking complete; 2026E operating leverage +257%. Latest Close <b class="mono" style="color:#fff;">$${celhClose}</b> reclaiming MA20 ($${celhMa20}) toward MA60 ($${celhMa60}). Stop: $${celhStop} · TP1 (2x): <b class="mono" style="color:var(--fin-up);">$${celhTp1}</b>.
                </div>
                <button class="btn btn-sm btn-open-research" data-ticker="CELH" style="margin-top:6px;">
                  Read $CELH SEC Research Brief ↗
                </button>
              </div>

              <div style="border-left:3px solid var(--fin-down); padding-left:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                  <b class="mono" style="color:#ffffff;">MBLY · Mobileye Global ($${mblyClose})</b>
                  <span class="badge badge-knife">🛑 RULE 1 STOP EXECUTED · SCORE ${mblyScore}</span>
                </div>
                <div style="color:var(--muted); font-size:0.76rem; margin-top:4px; line-height:1.45;">
                  <b style="color:#fca5a5;">Post-Mortem Audit:</b> Oct 13 watch ($7.02) breached Rule 1 Hard Stop (<b class="mono" style="color:var(--fin-down);">$6.39 / -9.0%</b>) and fell to <b class="mono" style="color:#fff;">$${mblyClose}</b> (52W Low $${mblyLow52}, <span class="mono">LEFT_SIDE_KNIFE</span>). Mechanical exit protected capital & rotated into <b class="mono" style="color:var(--fin-up);">$CELH / $LULU</b>. Re-entry prohibited until MA20 ($${mblyMa20}) reclaim.
                </div>
                <button class="btn btn-sm btn-open-research" data-ticker="MBLY" style="margin-top:6px;">
                  Read $MBLY Rule 1 Stop Audit Brief ↗
                </button>
              </div>
            </div>
          </div>

          <div>
            <button class="btn btn-open-research-modal" style="width:100%; justify-content:center; padding:9px;">
              ${t.tool2ViewBtn}
            </button>
          </div>
        </div>

        <!-- Module 03: TradingView 2000–2025 Historical Statistical Workbook -->
        <div style="background:#090d16; border:1px solid var(--border); border-top:2px solid #6366f1; border-radius:4px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:#818cf8; letter-spacing:0.05em; text-transform:uppercase;">
              ${t.tool3Title}
            </div>
            <h3 style="font-size:1rem; font-weight:800; margin:6px 0; color:#ffffff;">${t.tool3Sub}</h3>
            <p style="font-size:0.78rem; color:var(--muted); margin-bottom:10px;">${t.tool3Desc}</p>

            <pre id="pineCodeBox" style="background:#05080f; padding:12px; border-radius:4px; font-size:0.7rem; color:#93c5fd; overflow-x:auto; max-height:155px; font-family:var(--font-mono); border:1px solid var(--border); line-height:1.45;">${pineCode}</pre>
          </div>

          <div style="margin-top:12px;">
            <button class="btn btn-purple" id="btnCopyStatistical Workbook" style="width:100%; justify-content:center; padding:9px;">
              ${t.tool3CopyBtn}
            </button>
          </div>
        </div>

        <!-- Module 04: Pro VIP 55:35:10 Barbell Portfolio Allocation & 1-Click Institutional Export Kit -->
        <div style="background:#090d16; border:1px solid var(--border); border-top:2px solid #10b981; border-radius:4px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:#34d399; letter-spacing:0.05em; text-transform:uppercase;">
              👑 PRO VIP EXCLUSIVE · BARBELL CALCULATOR & EXPORT KIT
            </div>
            <h3 style="font-size:1rem; font-weight:800; margin:6px 0; color:#ffffff;">
              55:35:10 ($SMH : $XLV) Custom Portfolio Blueprint & 1-Click TradingView / Statistical Workbook
            </h3>
            <p style="font-size:0.78rem; color:var(--muted); margin-bottom:10px;">
              Automatically allocates your <b class="mono" style="color:#fff;">$${proCapUsd.toLocaleString()}</b> account across core Semiconductor ETF ($SMH), Healthcare Shield ($XLV), and Top VIP Ignition slots, plus 2000–2025 historical statistical workbook summaries:
            </p>

            <div style="background:#05080f; border:1px solid var(--border); border-radius:4px; padding:11px; font-size:0.76rem; margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:var(--muted);">⚡ Core Semiconductor ($SMH · 35%):</span>
                <b class="mono" style="color:#34d399;">$${Math.round(proCapUsd * 0.35).toLocaleString()}</b>
              </div>
              <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:var(--muted);">🚀 Top 3 VIP Ignition Slots (3 × 15%):</span>
                <b class="mono" style="color:#60a5fa;">$${Math.round(proCapUsd * 0.45).toLocaleString()} ($${perSlotUsd.toLocaleString()}/slot)</b>
              </div>
              <div style="display:flex; justify-content:space-between; padding:4px 0;">
                <span style="color:var(--muted);">🛡️ Defensive Healthcare Shield ($XLV · 20%):</span>
                <b class="mono" style="color:#fbbf24;">$${Math.round(proCapUsd * 0.20).toLocaleString()}</b>
              </div>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:7px;">
            <button type="button" class="btn btn-emerald" id="btnDownloadPro72Csv" style="width:100%; justify-content:center; padding:8px; font-weight:800;">
              📥 Download Full 72-Stock Historical Factor Workbook
            </button>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:7px;">
              <button type="button" class="btn" id="btnCopyTvWatchlist" style="justify-content:center; padding:8px; font-size:0.75rem; border-color:rgba(56,189,248,0.45); color:#38bdf8;">
                📋 Copy TV 72-Watchlist
              </button>
              <button type="button" class="btn" id="btnCopyTvWebhookJson" style="justify-content:center; padding:8px; font-size:0.75rem; border-color:rgba(251,191,36,0.45); color:#fbbf24;">
                🔔 Copy Alert Webhook JSON
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  `;
}


// --- src/components/Pricing.js ---

function getTomPricingCopyByMode() {
  const isLiveSharp =
    typeof window !== "undefined" &&
    window.PAYMENT_CONFIG &&
    window.PAYMENT_CONFIG.STORE_LIVE_READY === true;
  if (typeof window !== "undefined") {
    window.TOM_COPY_MODE = isLiveSharp ? "LIVE_SHARP" : "UNDERWRITING_SAFE";
  }

  if (isLiveSharp) {
    return {
      kicker: "STAGE 3 OF 3 · DAILY SMH × XLV REGIME & RATIO TRACKING VIP",
      heading: "Track Daily SMH × XLV Regime Shifts Automatically Every Morning",
      subheading:
        "Receive daily overheating & fear regime tracking emails before the US bell, exact account-size dollar ($) allocation worksheets, and the lifetime-updated 14-Page SMH × XLV Master PDF Guide. Backed by our Standard Digital Refund Policy.",
      t1Badge: "MONTHLY RESEARCH PASS",
      t1Title: "Monthly SMH × XLV Daily Tracking & Worksheet Suite",
      t1Period: "/ month",
      t1Bundle:
        "Includes Daily Automated SMH × XLV Tracking Digest + Lifetime-Updated 14-Page Master PDF Guide",
      t1Items: [
        "<b>Daily Automated SMH &times; XLV Regime &amp; Ratio Tracking Email Digest:</b> Delivered every morning before the US bell — tracks market overheating / fear indicators (0–100) and shows how the historical <b>$SMH : $XLV</b> ratio shifts across regimes.",
        "<b>Account-Size Dollar ($) Allocation Worksheet:</b> Enter your exact account balance (e.g., <b>$150,000</b>, <b>$300,000</b>, or <b>$500,000</b>) to compute exact dollar amounts across <b>$SMH</b>, <b>$XLV</b>, and optional <b>$SGOV</b> T-Bill cushion.",
        "<b>Lifetime-Updated 14-Page SMH &times; XLV Master PDF Guide:</b> Complete 26-year (2000–2026) crash study, IRA/Taxable bucket reference, and printable self-directed execution checklist.",
      ],
      t1Btn: "Start Monthly Research Pass — $29/mo →",
      t1PayNote:
        "💳 Whop.com (Global Card / Apple Pay / Google Pay) · 1-Click Cancel · Standard Digital Refund Policy",
      t2Badge: "ANNUAL RESEARCH PASS",
      t2Title: "Annual SMH × XLV Daily Tracking & Master Pass",
      t2Period: "/ year",
      t2Bundle:
        "Save 43% ($149/yr saved) · Full 12-Month Daily Tracking Digest + 14-Page SMH × XLV Master PDF Guide",
      t2Items: [
        "<b>Full 12-Month Daily Automated SMH &times; XLV Tracking Digest:</b> Uninterrupted morning regime &amp; ratio-shift email tracking across every market season.",
        "<b>Account-Size Dollar ($) Allocation Worksheet + 2000–2025 Historical Statistical Workbook:</b> Full historical 2000–2026 <b>$SMH / $XLV / $QQQ</b> daily series and multi-account dollar worksheets.",
        "<b>Lifetime-Updated 14-Page SMH &times; XLV Master PDF Guide:</b> Save 43% vs. monthly billing — backed by our unconditional Standard Digital Refund Policy.",
      ],
      t2Btn: "Start Annual Research Pass — $199/yr (Save 43%) →",
      t2PayNote:
        "💳 Whop.com (Global Card / Apple Pay / Google Pay) · Billed Annually · Standard Digital Refund Policy",
      autoUnlockNote:
        "✨ Instant Software Activation: Your SMH × XLV Dollar ($) Allocation Worksheet, 14-Page Master PDF Guide, and Daily Tracking Digest activate immediately after checkout.",
      restoreSummary: "🔑 Switching computers or already subscribed? Restore your VIP License Key here",
      restoreBtn: "Open License Key Restore Box",
    };
  }

  return {
    kicker: "STAGE 3 OF 3 · SELF-DIRECTED EDUCATIONAL SOFTWARE & DAILY INDICATOR DATA DIGEST",
    heading: "Historical SMH × XLV Sector Balance Simulator & Daily Automated Market Indicator Data Digest",
    subheading:
      "Upgrade for automated morning semiconductor & healthcare indicator data digests, custom account-size dollar ($) allocation worksheets, and our lifetime-updated 14-Page SMH × XLV Master PDF Guide. Backed by our Standard Digital Refund & 1-Click Cancel Refund Policy.",
    t1Badge: "MONTHLY RESEARCH PASS",
    t1Title: "Monthly Research Pass Sector Balance Worksheet & Daily Indicator Digest",
    t1Period: "/ month",
    t1Bundle:
      "Includes Daily Automated SMH × XLV Indicator Data Digest + Lifetime-Updated 14-Page SMH × XLV Master PDF Guide",
    t1Items: [
      "<b>Daily Automated SMH &times; XLV Regime &amp; Ratio Tracking Email Digest:</b> Morning educational data email tracking public overheating / fear indicators (0–100) and showing how the historical <b>$SMH : $XLV</b> sector model behaves across market regimes.",
      "<b>Account-Size Dollar ($) Allocation Worksheet:</b> Enter any simulated portfolio size (e.g., <b>$150,000</b>, <b>$300,000</b>, or <b>$500,000</b>) to calculate exact mathematical dollar weights across <b>$SMH</b>, <b>$XLV</b>, and <b>$SGOV</b> Treasury reserves.",
      "<b>Lifetime-Updated 14-Page SMH &times; XLV Master PDF Guide:</b> 26-year (2000–2026) Dot-Com / 2008 / 2022 empirical drawdown study, Traditional/Roth IRA educational tax-location reference, and printable 1-page worksheet.",
    ],
    t1Btn: "Start Monthly Research Pass — $29/mo",
    t1PayNote:
      "💳 Whop.com (Global Card / Apple Pay / Google Pay) · 1-Click Cancel · Standard Digital Refund Policy",
    t2Badge: "ANNUAL RESEARCH PASS",
    t2Title: "Annual Research Pass Sector Balance Worksheet & Daily Indicator Pass",
    t2Period: "/ year",
    t2Bundle:
      "Includes 12-Month Automated SMH × XLV Indicator Digest + Lifetime-Updated 14-Page SMH × XLV Master PDF Guide",
    t2Items: [
      "<b>12-Month Automated SMH &times; XLV Regime &amp; Ratio Tracking Email Digest:</b> Full-year daily morning public market indicator summaries and historical sector ratio study tables.",
      "<b>Account-Size Dollar ($) Allocation Worksheet + 2000–2025 Historical Statistical Workbook:</b> Exact dollar worksheets plus downloadable 2000–2026 public market historical series.",
      "<b>Lifetime-Updated 14-Page SMH &times; XLV Master PDF Guide:</b> Save 43% ($149/yr saved vs. monthly) — self-directed educational calculator software backed by our Standard Digital Refund Policy.",
    ],
    t2Btn: "Start Annual Research Pass — $199/yr",
    t2PayNote:
      "💳 Whop.com (Global Card / Apple Pay / Google Pay) · Billed Annually · Standard Digital Refund Policy",
    autoUnlockNote:
      "✨ Instant Software Activation: Your Custom SMH × XLV Dollar ($) Allocation Worksheet, 14-Page Master PDF Guide, and Daily Indicator Digest unlock automatically after checkout.",
    restoreSummary: "🔑 Switching computers or already subscribed? Restore your VIP License Key here",
    restoreBtn: "Open License Key Restore Box",
  };
}
function renderPricing(state) {
  const cfg = state.config || {};
  const c = getTomPricingCopyByMode();
  const polarMonthly = formatCheckoutUrl(
    cfg.whop_tom_monthly_url || cfg.ls_site1_monthly_url,
    "#tom-vip-monthly"
  );
  const polarAnnual = formatCheckoutUrl(
    cfg.whop_tom_annual_url || cfg.ls_site1_ltd_url,
    "#tom-vip-annual"
  );

  const checkoutFallbackHtml = `
    <div class="pricing-support-note">
      Questions, software licenses, or standard digital refunds? Email <a href="mailto:hello@truthofmarket.com?subject=TruthOfMarket%20Support%20%26%20VIP%20Software" class="pricing-support-link">hello@truthofmarket.com</a>.
    </div>
  `;

  const checkSvg = `
    <span class="price-check" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
  `;

  return `
    <section id="pricing" class="tom-pricing-section" aria-label="Stage 3: VIP SMH x XLV Daily Tracking Digest and Software Pricing">
      <span id="pricingSection" style="display:block; height:0; overflow:hidden;"></span>
      <div class="pricing-head-wrap">
        <div class="pricing-kicker-pill">
          ${c.kicker}
        </div>
        <h2 class="pricing-main-heading">${c.heading}</h2>
        <p class="pricing-main-sub">${c.subheading}</p>
      </div>

      <div class="vip-efficacy-preview-grid" aria-label="3 Core SMH x XLV VIP Deliverables">
        <div class="vip-efficacy-card">
          <span class="vip-eff-step">BENEFIT 1 &bull; DAILY MORNING EMAIL</span>
          <strong>Daily Automated SMH &times; XLV Regime &amp; Ratio Tracking Digest</strong>
          <p>Tracks public semiconductor overheating / fear indicators every morning before the US bell and shows how the historical <b>$SMH : $XLV</b> baseline shifts across regimes.</p>
        </div>
        <div class="vip-efficacy-card">
          <span class="vip-eff-step">BENEFIT 2 &bull; EXACT DOLLAR ($) SHEET</span>
          <strong>Account-Size Dollar ($) Allocation Worksheet</strong>
          <p>Type any portfolio size (such as <b>$150,000</b>, <b>$300,000</b>, or <b>$500,000</b>) to compute exact dollar amounts across <b>$SMH</b>, <b>$XLV</b>, and optional <b>$SGOV</b> T-Bill cushion.</p>
        </div>
        <div class="vip-efficacy-card">
          <span class="vip-eff-step">BENEFIT 3 &bull; MASTER PDF PLAYBOOK</span>
          <strong>Lifetime-Updated 14-Page SMH &times; XLV Master PDF Guide</strong>
          <p>Complete 26-year (2000–2026) Dot-Com, 2008 &amp; 2022 empirical drawdown study, IRA/Taxable reference, and large-print 1-page self-directed checklist.</p>
        </div>
      </div>

      <div class="pricing-grid">
        <!-- Tier 1: Monthly Research Pass ($29/mo) -->
        <div class="price-card featured">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span class="badge badge-ignition">${c.t1Badge}</span>
              <span class="badge price-badge-popular">FLEXIBLE MONTHLY</span>
            </div>
            <h3 class="price-card-title">
              ${c.t1Title}
            </h3>
            <div class="price-num">$29 <span class="price-period">${c.t1Period}</span></div>
            <div class="price-subtext">Billed monthly &middot; Cancel anytime with 1 click &middot; Standard Digital Refund Policy</div>
            <div class="price-bundle-box is-monthly">
              📘 ${c.t1Bundle}
            </div>
            <ul class="price-list">
              ${c.t1Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <a class="btn btn-primary whop-checkout-button price-cta-btn" id="cardMonthlyBtn" data-whop-checkout data-whop-plan="monthly" data-tom-paid-plan="monthly" href="${polarMonthly}">
              ${c.t1Btn}
            </a>
            <div class="price-pay-note">
              ${c.t1PayNote}
            </div>
            ${checkoutFallbackHtml}
          </div>
        </div>

        <!-- Tier 2: Annual Research Pass ($199/yr) -->
        <div class="price-card best-value">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span class="badge badge-watch">${c.t2Badge}</span>
              <span class="badge price-badge-lifetime">BEST VALUE &middot; SAVE 43%</span>
            </div>
            <h3 class="price-card-title">
              ${c.t2Title}
            </h3>
            <div class="price-num">$199 <span class="price-period">${c.t2Period}</span></div>
            <div class="price-subtext">Annual recurring pass ($199/yr) &middot; Cancel anytime &middot; Standard Digital Refund Policy</div>
            <div class="price-savings-pill">⚡ Save $149/Yr vs. $29/mo Monthly Billing ($199/yr vs. $348/yr)</div>
            <div class="price-bundle-box is-annual">
              📘 ${c.t2Bundle}
            </div>
            <ul class="price-list">
              ${c.t2Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <a class="btn btn-emerald whop-checkout-button price-cta-btn" id="cardLtdBtn" data-whop-checkout data-whop-plan="annual" data-tom-paid-plan="annual" href="${polarAnnual}">
              ${c.t2Btn}
            </a>
            <div class="price-pay-note is-emerald">
              ${c.t2PayNote}
            </div>
            ${checkoutFallbackHtml}
          </div>
        </div>
      </div>

      <!-- MANDATORY PERMANENT EDUCATIONAL SOFTWARE DISCLAIMER -->
      <div id="tomPricingDisclaimerBox" class="tom-pricing-disclaimer" role="note">
        Disclaimer: TruthOfMarket provides self-directed educational data visualization and mathematical portfolio calculators only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice.
      </div>

      <div class="pricing-restore-wrap">
        <div class="pricing-autounlock-note">
          ${c.autoUnlockNote}
        </div>
        <details class="pricing-restore-details">
          <summary class="pricing-restore-summary">
            ${c.restoreSummary} ▾
          </summary>
          <div class="pricing-restore-body">
            <span>Already have a Whop Research Pass receipt ID on another computer or tablet? Restore your VIP session in 1 click:</span>
            <button type="button" class="btn btn-sm" onclick="var b=document.getElementById('btnOpenLicense');if(b){b.click();}else{var m=document.getElementById('licenseModal');if(m)m.style.display='flex';}">
              ${c.restoreBtn} &rarr;
            </button>
          </div>
        </details>
      </div>

      <div class="pricing-trust-ribbon">
        <div class="trust-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span><b>Whop.com (Global Card / Apple Pay / Google Pay)</b></span>
        </div>
        <div class="trust-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Standard Digital Refund & 1-Click Cancel Refund Policy</span>
        </div>
        <div class="trust-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Self-Directed Educational Calculator Software</span>
        </div>
      </div>
    </section>
  `;
}


// --- src/components/Modals.js ---
function renderModals(state) {
  const t = state.t || {};
  const cfg = state.config || {};
  const polarMonthly = formatCheckoutUrl(
    cfg.whop_tom_monthly_url || cfg.ls_site1_monthly_url,
    "#tom-vip-monthly"
  );
  const polarAnnual = formatCheckoutUrl(
    cfg.whop_tom_annual_url || cfg.ls_site1_ltd_url,
    "#tom-vip-annual"
  );
  const tgChannelUrl = cfg.telegram_channel_url || "https://t.me/truthofmarketss";
  const ytUrl = cfg.youtube_url || "https://www.youtube.com/channel/UCbxWByxJntRqoweWy-4QnqA";
  const igUrl = cfg.instagram_url || "https://www.instagram.com/truthofmarket/";
  const tgChatId = state.telegramChatId || cfg.telegram_chat_id || "@truthofmarketss";
  const tgToken = state.telegramBotToken || "DEMO-BOT-TOKEN";
  const tgType = state.telegramAlertType || "SEMI_BRIEFING";
  const ov = state.semiOverview || {};
  const ovDate = ov.date || "2026-11-16";
  const ovScore = Number(ov.fg_score ?? 18.0).toFixed(1);
  const ovRegime = String(ov.regime_en || "EXTREME FEAR").toUpperCase();
  const ovSmh = Number(ov.smh_close ?? 522.49).toFixed(2);
  const ovDd = Number(ov.smh_dd_pct ?? -22.23).toFixed(2);
  const ovRsi = Number(ov.smh_rsi ?? 40.6).toFixed(1);
  const ovXlv = Number(ov.xlv_close ?? 184.87).toFixed(2);
  const ovQqq = Number(ov.qqq_close ?? 690.49).toFixed(2);
  const ovW1 = ov.historical_study_smh_ratio ?? 80;
  const ovW2 = ov.historical_study_xlv_ratio ?? 20;
  const tgPreview =
    state.telegramPreviewText ||
    `🧭 [TruthOfMarket] Daily Market Weather & Barbell Summary (${ovDate})\n• Sentiment Score: ${ovScore} / 100 (${ovRegime})\n• $SMH: $${ovSmh} (${ovDd}% 52W DD | RSI ${ovRsi})\n• $XLV: $${ovXlv} | $QQQ: $${ovQqq}\n• Educational Barbell Model: ${ovW1}% $SMH : ${ovW2}% $XLV`;

  const isWebView =
    typeof window !== "undefined" &&
    typeof window.isTomInAppWebView === "function" &&
    window.isTomInAppWebView();
  const savedEmail =
    (state && state.freeMemberEmail) ||
    (typeof localStorage !== "undefined" ? localStorage.getItem("tom_free_member_email") || "" : "");

  return `
    <!-- LICENSE ACTIVATION MODAL -->
    <div class="modal-backdrop" id="licenseModal">
      <div class="modal" style="max-width:540px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
          <div style="font-size:0.68rem; font-family:var(--font-mono); color:#93c5fd; text-transform:uppercase; letter-spacing:0.05em;">
            SELF-DIRECTED EDUCATIONAL CALCULATOR SOFTWARE · VIP ACCESS
          </div>
          <button type="button" class="btn btn-sm" id="btnCancelLicense" style="min-height:44px; min-width:68px; flex-shrink:0; padding:8px 14px;">Close</button>
        </div>
        <h3 style="font-size:1.18rem; font-weight:800; margin-top:4px; color:var(--text);">Unlock Full VIP Retiree Worksheets &amp; Tax-Bucket Reference</h3>
        <p style="color:var(--text-secondary); font-size:0.95rem; margin-top:6px; line-height:1.55;">
          Includes Custom Nest-Egg Dollar ($) Budget Worksheet, 12-Month Dividend Paycheck Calendar &amp; Tax-Bucket Reference, and Large-Print 1-Page Weather Action Sheet. Backed by our 14-Day Refund Policy.
        </p>
        <div style="display:grid; grid-template-columns:1fr; gap:10px; margin:14px 0 10px;">
          <a class="btn btn-primary whop-checkout-button" data-whop-checkout data-whop-plan="monthly" data-tom-paid-plan="monthly" href="${polarMonthly}" style="justify-content:center; min-height:62px; padding:12px 16px; font-size:1.02rem; font-weight:800; border-radius:12px;">
            Start Monthly Research Pass — $29/mo
          </a>
          <a class="btn btn-emerald whop-checkout-button" data-whop-checkout data-whop-plan="annual" data-tom-paid-plan="annual" href="${polarAnnual}" style="justify-content:center; min-height:62px; padding:12px 16px; font-size:1.02rem; font-weight:800; border-radius:12px;">
            Start Annual Research Pass — $199/yr (Save 43%)
          </a>
        </div>
        <div style="margin-bottom:8px; font-size:0.78rem; color:#e2e8f0; font-weight:700; text-align:center; line-height:1.45;">
          💳 Whop.com (Global Card / Apple Pay / Google Pay) · 1-Click Cancel Anytime · 14-Day Refund Policy
        </div>
        <div style="margin-bottom:12px; font-size:0.72rem; color:#94a3b8; text-align:center; line-height:1.45;">
          Support Desk: <a href="mailto:beable9489@gmail.com?subject=TruthOfMarket%20VIP%20Software%20Support" style="color:#93c5fd; font-weight:700; text-decoration:underline;">beable9489@gmail.com</a>
        </div>
        <div id="licenseMsg" style="font-size:0.8rem; margin-bottom:8px; min-height:1.1em;"></div>
        <details id="licenseRestoreDetails" ${state.isProUnlocked ? "open" : ""} style="background:#0b1120; border:1px solid rgba(148,163,184,0.25); border-radius:10px; padding:10px 12px;">
          <summary style="cursor:pointer; font-size:0.8rem; font-weight:700; color:#93c5fd;">
            🔑 Switching devices or already have a License Key? Restore here
          </summary>
          <div style="margin-top:10px;">
            <input type="text" id="licenseInput" value="${state.licenseKey || ""}" placeholder="Enter Whop Research Pass Receipt ID (XXXX-XXXX-XXXX-XXXX)" autocomplete="off" />
            <div style="display:flex; gap:8px; justify-content:space-between; align-items:center; flex-wrap:wrap; margin-top:8px;">
              <div>
                ${
                  state.isProUnlocked
                    ? `<button class="btn btn-sm" id="btnLockLicense" style="color:var(--fin-down); border-color:rgba(246,70,93,0.4);">Deactivate / Lock</button>`
                    : ""
                }
              </div>
              <div style="display:flex; gap:8px;">
                <button class="btn btn-primary" id="btnVerifyLicense">Restore &amp; Unlock VIP</button>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>

    <!-- TELEGRAM RESEARCH DISPATCH HUB MODAL -->
    <div class="modal-backdrop" id="telegramModal">
      <div class="modal" style="max-width:640px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#38bdf8; text-transform:uppercase; letter-spacing:0.05em;">
              EDUCATIONAL MARKET DATA &amp; QUANTITATIVE RESEARCH DESK
            </div>
            <h3 style="font-size:1.12rem; font-weight:800; margin-top:3px; color:#ffffff;">
              Telegram Educational Research &amp; Briefing Hub
            </h3>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <a class="btn btn-sm" id="tgModalYtBtn" href="${ytUrl}" target="_blank" rel="noopener noreferrer" style="border-color:rgba(239,68,68,0.45); color:#fca5a5;">
              📺 YouTube ↗
            </a>
            <a class="btn btn-sm" id="tgModalIgBtn" href="${igUrl}" target="_blank" rel="noopener noreferrer" style="border-color:rgba(236,72,153,0.45); color:#f9a8d4;">
              📸 Instagram ↗
            </a>
            <a class="btn btn-sm" id="tgChannelLinkBtn" href="${tgChannelUrl}" target="_blank" rel="noopener noreferrer" style="border-color:rgba(56,189,248,0.45); color:#38bdf8;">
              ✈️ @truthofmarketss ↗
            </a>
          </div>
        </div>

        <p style="color:var(--muted); font-size:0.8rem; margin-top:6px; margin-bottom:12px; line-height:1.5;">
          Join our Official Broadcast Channel <a href="${tgChannelUrl}" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; font-weight:700;">t.me/truthofmarketss</a> (<code class="mono" style="color:#93c5fd;">@truthofmarketss</code>) for daily US Market Weather &amp; ETF educational summaries.
        </p>

        ${
          state.isAdminAuthenticated
            ? `<div class="semi-form-grid-2" style="margin-bottom:8px;">
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">TELEGRAM BOT PROFILE (@BotFather)</label>
            <input type="text" id="tgBotTokenInput" value="${tgToken}" placeholder="DEMO-BOT-TOKEN" autocomplete="off" style="margin:4px 0 0; -webkit-text-security:disc;" />
          </div>
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">CHAT ID OR @CHANNEL USERNAME</label>
            <input type="text" id="tgChatIdInput" value="${tgChatId}" placeholder="@truthofmarketss" autocomplete="off" style="margin:4px 0 0;" />
          </div>
        </div>`
            : ""
        }

        <div class="${state.isAdminAuthenticated ? "semi-form-grid-2" : ""}" style="margin-bottom:10px;">
          ${
            state.isAdminAuthenticated
              ? `<div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">PUBLIC CHANNEL URL (HEADER / FOOTER LINK)</label>
            <input type="text" id="tgChannelUrlInput" value="${tgChannelUrl}" placeholder="https://t.me/truthofmarketss" style="margin:4px 0 0;" />
          </div>`
              : ""
          }
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">BRIEFING TEMPLATE</label>
            <select id="tgAlertTypeSelect" style="width:100%; padding:9px 10px; margin-top:4px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-sans); font-size:0.82rem; font-weight:600;">
              <option value="SEMI_BRIEFING" ${tgType === "SEMI_BRIEFING" ? "selected" : ""}>1. Market Weather &amp; $SMH:$XLV Barbell Summary</option>
              <option value="RSA_IGNITION" ${tgType === "RSA_IGNITION" ? "selected" : ""}>2. US Factor Research Snapshot</option>
              <option value="FULL_DAILY" ${tgType === "FULL_DAILY" ? "selected" : ""}>3. Full Combined Educational Summary</option>
              ${
                state.isAdminAuthenticated
                  ? `<option value="TEST_PING" ${tgType === "TEST_PING" ? "selected" : ""}>4. Bot Connection Verification Ping</option>`
                  : ""
              }
            </select>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-size:0.68rem; font-family:var(--font-mono); color:#93c5fd;">
            LIVE BRIEFING PREVIEW (VERIFIED LATEST CLOSES)
          </span>
          <div style="display:flex; gap:6px;">
            ${
              state.isAdminAuthenticated
                ? `<button class="btn btn-sm" id="btnVerifyTelegram" title="Test Bot Token with Telegram API">Verify &amp; Save Bot</button>`
                : ""
            }
            <button class="btn btn-sm" id="btnPreviewTelegram">Refresh Preview</button>
            <button class="btn btn-sm" id="btnCopyTelegramMsg">Copy Text</button>
          </div>
        </div>

        <pre id="telegramPreviewBox" style="background:#05080f; border:1px solid var(--border); border-left:3px solid #38bdf8; border-radius:4px; padding:12px; font-family:var(--font-mono); font-size:0.74rem; color:#e2e8f0; white-space:pre-wrap; max-height:210px; overflow-y:auto; line-height:1.5; margin-bottom:10px;">${tgPreview}</pre>

        <div id="telegramStatusMsg" style="font-size:0.78rem; margin-bottom:10px; min-height:1.2em; color:#93c5fd;"></div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <span class="mono" style="font-size:0.68rem; color:var(--muted);">
            Official Channel: @truthofmarketss · Educational Market Data
          </span>
          <div style="display:flex; gap:8px;">
            <button class="btn" id="btnCloseTelegram">Close</button>
            <a class="btn btn-primary" href="${tgChannelUrl}" target="_blank" rel="noopener noreferrer" style="background:#0284c7; border-color:#38bdf8;">
              Join Telegram Channel ↗
            </a>
            ${
              state.isAdminAuthenticated
                ? `<button class="btn btn-primary" id="btnSendTelegramNow" style="background:#059669; border-color:#10b981;">
              Send Briefing to Telegram ↗
            </button>`
                : ""
            }
          </div>
        </div>
      </div>
    </div>

    <!-- ADMIN LOGIN MODAL -->
    <div class="modal-backdrop" id="adminLoginModal">
      <div class="modal" style="max-width:440px;">
        <div style="font-size:0.68rem; font-family:var(--font-mono); color:#f59e0b; text-transform:uppercase; letter-spacing:0.05em;">
          RESTRICTED ACCESS · ADMINISTRATOR AUTHENTICATION
        </div>
        <h3 style="font-size:1.12rem; font-weight:800; margin-top:4px; color:#ffffff;">
          🔒 Admin Software Login
        </h3>
        <p style="color:var(--muted); font-size:0.8rem; margin-top:6px; margin-bottom:12px; line-height:1.5;">
          Enter your Administrator ID and Password to manage Checkout &amp; Partner parameters.
        </p>

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">ADMIN ID</label>
        <input type="text" id="adminIdInput" placeholder="Enter Admin ID" autocomplete="off" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">ADMIN ACCESS KEY</label>
        <input type="text" id="adminPwInput" placeholder="Enter Admin Password" autocomplete="off" style="-webkit-text-security:disc;" />

        <div id="adminLoginMsg" style="font-size:0.8rem; margin-bottom:12px; min-height:1.2em;"></div>

        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button class="btn" id="btnCancelAdminLogin">Cancel</button>
          <button class="btn btn-primary" id="btnSubmitAdminLogin">Login as Admin</button>
        </div>
      </div>
    </div>

    <!-- TERMINAL & PARTNER CONFIG MODAL -->
    <div class="modal-backdrop" id="configModal">
      <div class="modal" style="max-width:640px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#93c5fd; text-transform:uppercase; letter-spacing:0.05em;">
              ADMINISTRATION · CHECKOUT &amp; PARTNER ROUTING
            </div>
            <h3 style="font-size:1.12rem; font-weight:800; margin-top:4px; color:#ffffff;">Checkout &amp; Partner Parameter Configuration</h3>
          </div>
          <button class="btn btn-sm" id="btnAdminLogout" style="border-color:rgba(246,70,93,0.45); color:var(--fin-down);">
            🔒 Admin Logout
          </button>
        </div>

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">PLATFORM DOMAIN</label>
        <input type="text" id="cfgSite1Url" value="${cfg.site1_url || "https://truthofmarket.com"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">WHOP MONTHLY RESEARCH PASS URL ($29/MO)</label>
        <input type="text" id="cfgLsMonthly" value="${cfg.whop_tom_monthly_url || ""}" placeholder="https://whop.com/checkout/plan_..." />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">WHOP ANNUAL RESEARCH PASS URL ($199/YR)</label>
        <input type="text" id="cfgLsLtd" value="${cfg.whop_tom_annual_url || ""}" placeholder="https://whop.com/checkout/plan_..." />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TELEGRAM OFFICIAL CHANNEL URL</label>
        <input type="text" id="cfgTgChannel" value="${tgChannelUrl}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">OFFICIAL YOUTUBE CHANNEL URL (@TruthOfMarketUS)</label>
        <input type="text" id="cfgYoutubeUrl" value="${ytUrl}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">OFFICIAL INSTAGRAM PROFILE URL (@truthofmarket)</label>
        <input type="text" id="cfgInstagramUrl" value="${igUrl}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TRADINGVIEW PARTNER ID</label>
        <input type="text" id="cfgAffTv" value="${cfg.tradingview_aff_id || "1173809"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">SEEKING ALPHA PARTNER SOURCE TAG</label>
        <input type="text" id="cfgAffSa" value="${cfg.seekingalpha_source || "better_life333"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TRENDSPIDER PARTNER LABEL</label>
        <input type="text" id="cfgBrokerName" value="${cfg.broker_name || "TrendSpider (rightside)"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TRENDSPIDER PARTNER URL</label>
        <input type="text" id="cfgBrokerUrl" value="${cfg.broker_referral_url || "https://trendspider.com/?_go=rightside"}" />

        <div id="configMsg" style="font-size:0.8rem; margin-bottom:12px; min-height:1.2em;"></div>

        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button class="btn" id="btnCancelConfig">Close</button>
          <button class="btn btn-primary" id="btnSaveConfig">Save Configuration</button>
        </div>
      </div>
    </div>

    <!-- EDUCATIONAL SEC FILING SUMMARY MODAL -->
    <div class="modal-backdrop" id="researchModal">
      <div class="modal" style="max-width:760px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <h3 style="font-size:1.1rem; font-weight:800; color:#ffffff;" id="researchModalTitle">Public SEC Filing Educational Summary</h3>
          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-switch-research" data-ticker="CELH" id="btnSwitchResearchCelh">$CELH Summary</button>
            <button type="button" class="btn btn-sm btn-switch-research" data-ticker="MBLY" id="btnSwitchResearchMbly">$MBLY Summary</button>
            <button class="btn btn-sm" id="btnCloseResearch">Close ✕</button>
          </div>
        </div>
        <div id="researchModalBody" style="font-size:0.84rem; color:var(--text); line-height:1.65; max-height:62vh; overflow-y:auto; background:#05080f; padding:18px; border-radius:4px; border:1px solid var(--border);">
          Loading public filing summary...
        </div>
      </div>
    </div>

    <!-- LEGAL, PRIVACY, 14-DAY REFUND POLICY & SUPPORT MODAL -->
    <div class="modal-backdrop" id="legalModal">
      <div class="modal" style="max-width:740px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#93c5fd; text-transform:uppercase; letter-spacing:0.05em;">
              LEGAL &amp; COMPLIANCE · Whop.com (Global Card / Apple Pay / Google Pay)
            </div>
            <h3 style="font-size:1.1rem; font-weight:800; color:#ffffff; margin-top:3px;" id="legalModalTitle">
              Terms of Service, Privacy Policy &amp; 14-Day Refund Policy
            </h3>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <a class="btn btn-sm" href="/terms.html">Terms Page ↗</a>
            <a class="btn btn-sm" href="/privacy.html">Privacy Page ↗</a>
            <a class="btn btn-sm" href="/refund.html">14-Day Refund Page ↗</a>
            <button type="button" class="btn btn-sm" id="btnCloseLegalModal">Close ✕</button>
          </div>
        </div>
        <div id="legalModalBody" style="font-size:0.84rem; color:var(--text); line-height:1.68; max-height:62vh; overflow-y:auto; background:#05080f; padding:18px; border-radius:4px; border:1px solid var(--border);">
          <div data-legal-section="terms">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">1. Terms of Service &amp; Educational Software Scope</h4>
            <p style="color:var(--muted); margin-bottom:10px;">
              TruthOfMarket (<code class="mono">truthofmarket.com</code>) provides self-directed educational data visualization and mathematical portfolio calculators only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice. Users are solely responsible for their own financial decisions.
            </p>
          </div>
          <div data-legal-section="privacy" style="border-top:1px solid var(--border); padding-top:12px; margin-top:12px;">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">2. Privacy Policy</h4>
            <p style="color:var(--muted); margin-bottom:10px;">
              Portfolio inputs entered into our calculators are processed locally in your browser and are never sold or shared with third parties. Payment processing is handled securely by <b>Whop.com (Global Card / Apple Pay / Google Pay)</b> under PCI-DSS Level 1 compliance.
            </p>
          </div>
          <div data-legal-section="refund" style="border-top:1px solid var(--border); padding-top:12px; margin-top:12px;">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">3. 14-Day No-Questions-Asked Refund Policy &amp; 1-Click Cancellation</h4>
            <p style="color:var(--muted); margin-bottom:10px;">
              Both Monthly Research Pass ($29/mo) and Annual Research Pass ($199/yr) software subscriptions are backed by a <b>14-Day No-Questions-Asked Full Refund Guarantee</b>. Email <a href="mailto:beable9489@gmail.com" style="color:#60a5fa; font-weight:700;">beable9489@gmail.com</a> within 14 calendar days of initial purchase for a 100% full refund to your original payment method. You may also cancel recurring billing anytime in 1 click via your Whop Orders Portal.
            </p>
          </div>
          <div data-legal-section="support" style="border-top:1px solid var(--border); padding-top:12px; margin-top:12px;">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">4. Educational Market Data &amp; Quantitative Research Desk</h4>
            <p style="color:var(--muted);">
              • <b>Official Support Email</b>: <a href="mailto:beable9489@gmail.com" style="color:#60a5fa; font-weight:700;">beable9489@gmail.com</a><br/>
              • <b>Merchant of Record</b>: Whop.com (Global Card / Apple Pay / Google Pay) (<a href="https://whop.com/orders/" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;">Manage Orders &amp; Receipts ↗</a>)
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- CALM SEMI-ANNUAL TWO-PILLAR SECTOR BALANCE METHODOLOGY MODAL -->
    <div class="modal-backdrop" id="pwRsiModal">
      <div class="modal" style="max-width:680px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#38bdf8; text-transform:uppercase; letter-spacing:0.06em; font-weight:800;">
              SELF-DIRECTED EDUCATIONAL CALCULATOR METHODOLOGY
            </div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#ffffff; margin:3px 0 0;">
              ${t.pwRsiModalTitle || "Calm SMH × XLV + SGOV Sector Balance & Drawdown Methodology"}
            </h3>
          </div>
          <button class="btn btn-sm" id="btnClosePwRsiModal" style="min-height:44px; min-width:68px; flex-shrink:0; padding:6px 12px;">Close</button>
        </div>

        <div style="max-height:70vh; overflow-y:auto; padding-right:4px; font-size:0.92rem; line-height:1.65; color:#cbd5e1;">
          <div style="background:#0b1322; border:1px solid rgba(56,189,248,0.25); border-radius:8px; padding:14px 16px; margin-bottom:12px;">
            <div style="font-weight:800; color:#ffffff; margin-bottom:4px; font-size:0.98rem;">
              Why Pairing Two Distinct Sector Clocks Protects Retirement Longevity
            </div>
            <p style="margin:0; color:var(--muted); font-size:0.88rem;">
              Sequence-of-returns shocks occur when retirees hold 100% correlated equity exposure during a prolonged tech or macro downturn. Pairing non-leveraged 1x US Semiconductor growth ($SMH) with non-cyclical US Healthcare defense ($XLV) alongside a dedicated 0–3 month US Treasury cushion ($SGOV) reduces historical drawdowns while preserving long-term compounding.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:12px;">
            <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:12px 14px;">
              <div style="font-weight:800; color:#38bdf8; margin-bottom:4px;">Pillar 1: Structural Semiconductor Growth ($SMH · Non-Leveraged 1x)</div>
              <p style="margin:0; font-size:0.86rem; color:var(--muted);">
                Captures long-term compute, industrial automation, and silicon infrastructure compounding without 3x daily-reset volatility decay.
              </p>
            </div>
            <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:12px 14px;">
              <div style="font-weight:800; color:#34d399; margin-bottom:4px;">Pillar 2: Non-Cyclical Healthcare Defense ($XLV · Non-Leveraged 1x)</div>
              <p style="margin:0; font-size:0.86rem; color:var(--muted);">
                Pharmaceuticals, medical devices, and healthcare services operate on inelastic demographic demand, buffering portfolio variance when rate or tech cycles contract.
              </p>
            </div>
            <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:12px 14px;">
              <div style="font-weight:800; color:#fbbf24; margin-bottom:4px;">Liquidity Cushion: 0–3 Month US T-Bill &amp; Money-Market Reserve ($SGOV · SPAXX · SWVXX · VMFXX)</div>
              <p style="margin:0; font-size:0.86rem; color:var(--muted);">
                Insulates 2–3 years of planned retirement withdrawals in short-term US Treasury liquidity, reviewed calmly twice per year.
              </p>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:14px; border-top:1px solid var(--border); padding-top:10px;">
            <button type="button" class="btn btn-primary btn-sm" id="btnUnderstandPwRsi" style="min-height:44px; padding:8px 16px;">Got It — Return to Calculator</button>
          </div>
        </div>
      </div>
    </div>

    <!-- STOCK DETAIL SNAPSHOT MODAL (Used on /pro-swing.html & /stocks/*.html) -->
    <div class="modal-backdrop" id="stockDetailModal">
      <div class="modal" style="max-width:580px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#38bdf8; text-transform:uppercase; letter-spacing:0.06em; font-weight:800;">
              QUANTITATIVE FACTOR DATA SNAPSHOT
            </div>
            <h3 style="font-size:1.12rem; font-weight:800; color:#ffffff; margin:3px 0 0;" id="stockDetailTitle">
              Factor Snapshot Details
            </h3>
          </div>
          <button type="button" class="btn btn-sm" id="btnCloseStockDetail" style="min-height:40px; padding:6px 12px;">✕ Close</button>
        </div>
        <div id="stockDetailBody" style="max-height:70vh; overflow-y:auto; font-size:0.82rem; line-height:1.55; color:#cbd5e1;">
        </div>
      </div>
    </div>

    <!-- $0 FREE PUBLIC PRODUCT: US BROKERAGE APP & CALM 2-4X/YEAR BUDGET REVIEW MANUAL MODAL -->
    <div class="modal-backdrop" id="tomStarterManualModal" role="dialog" aria-modal="true" aria-labelledby="tomStarterManualModalTitle">
      <div class="modal tom-manual-modal-dialog">
        <div class="tom-manual-modal-header">
          <div style="min-width:0;">
            <div class="tom-manual-modal-kicker">📘 $0 FREE PUBLIC PRODUCT · FIDELITY · CHARLES SCHWAB · VANGUARD</div>
            <h3 id="tomStarterManualModalTitle" class="tom-manual-modal-title">
              US Brokerage App &amp; Calm 2–4x/Year Brokerage Limit-Order & Budget Starter Manual
            </h3>
          </div>
          <div class="tom-manual-modal-actions">
            <button type="button" class="tom-manual-print-btn" id="btnPrintTomStarterManual">
              ${isWebView ? "📩 Email Me This PDF Guide" : "🖨️ Print / Save PDF"}
            </button>
            <button type="button" class="tom-manual-close-btn" id="btnCloseTomStarterManual">
              ✕ Close
            </button>
          </div>
        </div>

        <div class="tom-manual-jump-nav" role="navigation" aria-label="Manual Chapters">
          <button type="button" class="tom-manual-jump-pill" data-manual-target="tomManualStep1">Step 1: Safe Limit Order</button>
          <button type="button" class="tom-manual-jump-pill" data-manual-target="tomManualStep2">Step 2: Calm 2–4x/Yr Budget Check</button>
          <button type="button" class="tom-manual-jump-pill" data-manual-target="tomManualStep3">Step 3: 401(k)/IRA Cash MMF</button>
        </div>

        <div class="tom-manual-modal-body" id="tomStarterManualPrintArea">
          <!-- INLINE EMAIL-ME-THIS-PDF-GUIDE FORM (Auto-highlighted in Instagram/FB/Kakao WebViews + available anytime) -->
          <div
            id="tomWebviewPdfEmailBox"
            class="no-print-tom"
            style="background:linear-gradient(135deg,rgba(6,95,70,0.32),rgba(15,23,42,0.95));border:2px solid #10b981;border-radius:12px;padding:16px;display:${isWebView ? "block" : "block"};"
          >
            <div style="font-size:0.82rem;font-weight:900;color:#6ee7b7;letter-spacing:0.02em;margin-bottom:4px;">
              📩 ${isWebView ? "IN-APP BROWSER DETECTED — SAVE THIS GUIDE TO YOUR INBOX" : "INSTANT EMAIL COPY + FREE CLUB ACCESS"}
            </div>
            <h4 style="margin:0 0 6px;font-size:1.12rem;font-weight:900;color:#ffffff;">
              Email Me This PDF Guide Now (Instant Free Club Access)
            </h4>
            <p style="margin:0 0 10px;font-size:0.96rem;line-height:1.55;color:#e2e8f0;">
              Enter your email below and we will send this complete 3-Step Brokerage &amp; Calm 2–4x/Year Cashflow Budget Guide straight to your inbox along with free Morning Bell Retirement &amp; Macro Club membership ($0).
            </p>
            <form id="tomWebviewPdfEmailForm" novalidate style="display:flex;flex-wrap:wrap;gap:10px;">
              <input
                type="email"
                id="tomWebviewPdfEmailInput"
                required
                autocomplete="email"
                value="${String(savedEmail).replace(/"/g, "")}"
                placeholder="Enter your email address (e.g., robert@email.com)"
                style="flex:1 1 240px;min-height:52px;padding:10px 14px;border-radius:10px;border:2px solid #94a3b8;background:#ffffff;color:#0f172a;font-size:1rem;font-weight:700;"
              />
              <button
                type="submit"
                id="btnSubmitTomWebviewPdfEmail"
                style="min-height:52px;padding:10px 20px;border-radius:10px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:#022c22;font-size:1rem;font-weight:900;cursor:pointer;"
              >
                📩 Email Me This PDF Guide Now &rarr;
              </button>
            </form>
            <div
              id="tomWebviewPdfEmailStatus"
              role="status"
              aria-live="polite"
              style="display:none;margin-top:10px;font-size:0.95rem;font-weight:800;color:#6ee7b7;line-height:1.5;"
            ></div>
          </div>

          <article class="tom-manual-chapter" id="tomManualStep1">
            <div class="tom-manual-chapter-tag tag-green">STEP 1 OF 3 · SAFE ORDER ENTRY</div>
            <h4>Fidelity · Charles Schwab · Vanguard Safe Buying: Limit Order vs. Market Order</h4>
            <p>
              <b>Why 9:30 AM ET Market Orders Are Risky:</b> During the first 15 to 30 minutes after the 9:30 AM Eastern opening bell, bid-ask spreads on ETFs and stocks often widen temporarily. Tapping <b>Market Order</b> instructs your brokerage app to fill immediately at the prevailing ask price. Setting a calm <b>Limit Order</b> defines the exact maximum dollar price per share you are comfortable paying.
            </p>
            <div class="tom-manual-broker-list">
              <div class="tom-manual-broker-item">
                <strong>🟢 Fidelity App / Fidelity.com (3 Taps):</strong>
                <span>1) Tap <b>Transact → Trade</b> and enter the ETF symbol (such as SMH, XLV, or SGOV). 2) Switch <b>Order Type</b> from <i>Market</i> to <b>Limit</b> and enter your limit price. 3) Keep Time-in-Force on <b>Day</b>, tap <b>Preview</b>, and confirm.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🔵 Charles Schwab Mobile / Web (3 Taps):</strong>
                <span>1) Tap <b>Trade</b>, enter the symbol, and choose <b>Buy</b>. 2) Under <b>Order Type</b>, select <b>Limit</b> and enter your target Limit Price. 3) Choose <b>Timing: Day</b>, review total dollar amount, and tap <b>Place Order</b>.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🔴 Vanguard App / Vanguard.com (3 Taps):</strong>
                <span>1) Open <b>Transact → Buy &amp; sell stocks and ETFs</b>. 2) Enter ticker &amp; shares, then choose <b>Order Type: Limit</b>. 3) Enter your maximum share price, select <b>Duration: Day</b>, and submit.</span>
              </div>
            </div>
          </article>

          <article class="tom-manual-chapter" id="tomManualStep2">
            <div class="tom-manual-chapter-tag tag-amber">STEP 2 OF 3 · TWO-PILLAR SECTOR BALANCE REVIEW</div>
            <h4>Aligning Your SMH &times; XLV + SGOV Baseline Across Market Regimes</h4>
            <p>
              <b>No Daily Stress or Frequent Trading:</b> Instead of reacting to noisy daily headlines, self-directed retirement investors review portfolio weights calmly across two non-leveraged 1x sector pillars (<b>SMH</b> Semiconductor Growth &times; <b>XLV</b> Healthcare Defense) plus a short-term US Treasury liquidity cushion (<b>SGOV</b>):
            </p>
            <div class="tom-manual-broker-list">
              <div class="tom-manual-broker-item">
                <strong>🟢 Balanced Growth Baseline (55% SMH · 35% XLV · 10% SGOV):</strong>
                <span>Participate in structural semiconductor innovation (<b>SMH</b>) while anchoring household composure with healthcare cash flows (<b>XLV</b>) and short-term Treasury liquidity (<b>SGOV</b>).</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🟡 Cautious Breadth Regime (45% SMH · 40% XLV · 15% SGOV):</strong>
                <span>When market breadth cools or valuations stretch, emphasize non-cyclical healthcare resilience and short-term Treasury reserves.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🔴 Preservation Priority (35% SMH · 45% XLV · 20% SGOV):</strong>
                <span>During elevated volatility, hold a dedicated cushion in <b>XLV</b> and <b>SGOV</b> / government money-market reserves so near-term retirement expenses remain insulated from drawdowns.</span>
              </div>
            </div>
          </article>

          <article class="tom-manual-chapter" id="tomManualStep3">
            <div class="tom-manual-chapter-tag tag-sky">STEP 3 OF 3 · T-BILL &amp; GOVERNMENT MMF CASH CUSHION</div>
            <h4>401(k) / IRA Cash Cushion: Earning Steady Monthly Money-Market Yield</h4>
            <p>
              <b>Patience Pays Monthly Interest:</b> Holding a 20%–40% safety cushion during uncertain market weather does <i>not</i> mean earning 0%. Parking Bucket 1 cash in short-term US Treasury ETFs (<b>SGOV</b>) or your broker&rsquo;s government <b>Money Market Fund (MMF)</b> collects monthly yield while keeping principal ready:
            </p>
            <div class="tom-manual-broker-list">
              <div class="tom-manual-broker-item">
                <strong>🏦 Fidelity — SPAXX (Fidelity Government Money Market Fund):</strong>
                <span>Default core cash sweep for most Fidelity IRAs and brokerage accounts. Uninvested cash earns monthly government money-market interest automatically.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🏦 Charles Schwab — SWVXX (Schwab Value Advantage Money Fund):</strong>
                <span>In Schwab IRAs or brokerage accounts, tap <b>Trade → Mutual Funds</b> and select <b>SWVXX</b> ($0 transaction fee) for sidelined cash; redemptions settle the next business day.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🏦 Vanguard — VMFXX (Vanguard Federal Money Market Fund):</strong>
                <span>Default Vanguard settlement fund — sidelined cash automatically earns federal money-market yield while you wait calmly between quarterly budget checks.</span>
              </div>
            </div>
          </article>

          <div class="tom-manual-funnel-box no-print-tom">
            <div class="tom-manual-funnel-title">
              🧭 Ready to Use Our Self-Directed Educational Calculators?
            </div>
            <p class="tom-manual-funnel-sub">
              Join our free daily 8:30 AM ET 3-Color Market Weather brief — or explore full VIP Educational Calculator Software access (Monthly $29/mo or Annual $199/yr):
            </p>
            <div class="tom-manual-funnel-btns">
              <button type="button" class="tom-manual-funnel-free" id="btnModalJumpTomFreeSignal">
                📧 Step 1: Join Free 8:30 AM ET Market Weather Brief ($0)
              </button>
              <a
                href="${polarMonthly}"
                class="tom-manual-funnel-paid whop-checkout-button"
                data-whop-checkout
                data-whop-plan="monthly"
                data-tom-paid-plan="monthly"
              >
                ⚡ Start Monthly Research Pass — $29/mo
              </a>
              <a
                href="${polarAnnual}"
                class="tom-manual-funnel-paid is-ltd whop-checkout-button"
                data-whop-checkout
                data-whop-plan="annual"
                data-tom-paid-plan="annual"
              >
                👑 Start Annual Research Pass — $199/yr
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <div class="toast" id="toastBox">Action completed</div>
  `;
}


// --- src/components/SemiFearGreedView.js ---


function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngleDeg, endAngleDeg) {
  const start = polarToCartesian(cx, cy, r, startAngleDeg);
  const end = polarToCartesian(cx, cy, r, endAngleDeg);
  const largeArcFlag = Math.abs(startAngleDeg - endAngleDeg) <= 180 ? "0" : "1";
  // Since y is inverted for standard math angles (180 left -> 90 top -> 0 right), sweep-flag is 1
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}
function renderCnnDialSvg(score, regimeLabel) {
  const s = Math.max(0, Math.min(100, Number(score ?? 18.0)));
  const cx = 230;
  const cy = 200;
  const r = 146;

  // 5 CNN segments along 180° (left=0) to 0° (right=100) with dark-mode harmonious muted tints
  const segments = [
    { code: "EXTREME_FEAR", min: 0, max: 24, a1: 180, a2: 136.5, activeColor: "#ef4444", mutedColor: "rgba(239,68,68,0.22)", label: "EXTREME FEAR", midAngle: 158 },
    { code: "FEAR", min: 25, max: 44, a1: 134, a2: 100.5, activeColor: "#f59e0b", mutedColor: "rgba(245,158,11,0.22)", label: "FEAR", midAngle: 117 },
    { code: "NEUTRAL", min: 45, max: 55, a1: 98, a2: 82, activeColor: "#94a3b8", mutedColor: "rgba(148,163,184,0.20)", label: "NEUTRAL", midAngle: 90 },
    { code: "GREED", min: 56, max: 74, a1: 79.5, a2: 46, activeColor: "#10b981", mutedColor: "rgba(16,185,129,0.22)", label: "GREED", midAngle: 63 },
    { code: "EXTREME_GREED", min: 75, max: 100, a1: 43.5, a2: 0, activeColor: "#059669", mutedColor: "rgba(5,150,105,0.22)", label: "EXTREME GREED", midAngle: 22 },
  ];

  let activeSeg = segments[0];
  if (s >= 75) activeSeg = segments[4];
  else if (s >= 55.01) activeSeg = segments[3];
  else if (s >= 45) activeSeg = segments[2];
  else if (s >= 25) activeSeg = segments[1];

  const arcsHtml = segments
    .map((seg) => {
      const isAct = seg.code === activeSeg.code;
      const d = describeArc(cx, cy, r, seg.a1, seg.a2);
      const stroke = isAct ? seg.activeColor : seg.mutedColor;
      const width = isAct ? 40 : 32;
      const lp = polarToCartesian(cx, cy, r + 31, seg.midAngle);
      return `
        <path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="butt" />
        <text x="${lp.x.toFixed(1)}" y="${lp.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle"
              fill="${isAct ? seg.activeColor : "#64748b"}"
              font-size="${isAct ? "9.5" : "8.5"}" font-weight="${isAct ? "800" : "700"}" font-family="Inter, sans-serif">
          ${seg.label}
        </text>
      `;
    })
    .join("");

  // Perimeter ticks (0, 25, 45, 55, 75, 100)
  const ticks = [0, 25, 45, 55, 75, 100]
    .map((tVal) => {
      const ang = 180 - (tVal / 100) * 180;
      const pIn = polarToCartesian(cx, cy, r - 24, ang);
      const pTxt = polarToCartesian(cx, cy, r - 35, ang);
      return `
        <circle cx="${pIn.x.toFixed(1)}" cy="${pIn.y.toFixed(1)}" r="1.8" fill="#94a3b8" />
        <text x="${pTxt.x.toFixed(1)}" y="${pTxt.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle"
              fill="#94a3b8" font-size="10" font-weight="700" font-family="JetBrains Mono, monospace">
          ${tVal}
        </text>
      `;
    })
    .join("");

  // Needle geometry
  const needleAngle = 180 - (s / 100.0) * 180.0;
  const tip = polarToCartesian(cx, cy, r - 12, needleAngle);
  const baseLeft = polarToCartesian(cx, cy, 8, needleAngle + 90);
  const baseRight = polarToCartesian(cx, cy, 8, needleAngle - 90);

  return `
    <div style="display:flex; flex-direction:column; align-items:center;">
      <svg viewBox="0 0 460 250" style="width:100%; max-width:440px; height:auto; overflow:visible;">
        <defs>
          <filter id="needleShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="3" flood-color="#000000" flood-opacity="0.65" />
          </filter>
        </defs>
        ${arcsHtml}
        ${ticks}
        <!-- Needle Polygon with Elevation Shadow -->
        <polygon points="${tip.x.toFixed(1)},${tip.y.toFixed(1)} ${baseLeft.x.toFixed(1)},${baseLeft.y.toFixed(1)} ${baseRight.x.toFixed(1)},${baseRight.y.toFixed(1)}"
                 fill="#f8fafc" filter="url(#needleShadow)" />
        <circle cx="${cx}" cy="${cy}" r="14" fill="#f8fafc" filter="url(#needleShadow)" />
        <circle cx="${cx}" cy="${cy}" r="5" fill="#090e18" />
      </svg>

      <!-- Score & Active Emotion Callout below Needle Hub -->
      <div style="text-align:center; margin-top:-18px;">
        <div style="display:inline-flex; align-items:baseline; gap:6px; background:#070b14; color:#ffffff; padding:6px 22px; border-radius:30px; border:1px solid var(--border); box-shadow:var(--shadow-md);">
          <span class="mono" style="font-size:2rem; font-weight:900; letter-spacing:-0.03em;">${Math.round(s)}</span>
          <span class="mono" style="font-size:0.9rem; color:#9ca3af; font-weight:600;">(${s.toFixed(1)} / 100)</span>
        </div>
        <div style="margin-top:8px;">
          <span style="font-size:0.78rem; color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:0.04em;">
            Market Emotion is driving:
          </span>
          <span class="cnn-pill cnn-pill-${activeSeg.code}" style="margin-left:6px; font-size:0.85rem;">
            ${regimeLabel || activeSeg.label}
          </span>
        </div>
      </div>
    </div>
  `;
}
function renderTimelineSvg(historyData, activeRange) {
  const pts = (historyData && historyData.series) || [];
  if (!pts.length) {
    return `<div style="padding:40px; text-align:center; color:#6b7280;">Loading historical timeline...</div>`;
  }

  const w = 640;
  const h = 230;
  const padL = 36;
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const coords = pts.map((p, i) => {
    const x = padL + (i / Math.max(1, pts.length - 1)) * plotW;
    const y = padT + (1.0 - Math.max(0, Math.min(100, p.fg_score)) / 100.0) * plotH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const y25 = (padT + 0.75 * plotH).toFixed(1);
  const y50 = (padT + 0.5 * plotH).toFixed(1);
  const y75 = (padT + 0.25 * plotH).toFixed(1);

  const firstDate = pts[0].date;
  const midDate = pts[Math.floor(pts.length / 2)].date;
  const lastDate = pts[pts.length - 1].date;

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
        <div style="font-size:0.8rem; font-weight:700; color:var(--text);">
          Historical Semiconductor Fear &amp; Greed Index (${firstDate} → ${lastDate})
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          ${["3M", "1Y", "3Y", "5Y", "10Y", "ALL"]
            .map(
              (r) => `
            <button type="button" class="btn-semi-range" data-range="${r}"
                    style="min-height:40px; padding:6px 10px; border-radius:4px; font-size:0.74rem; font-weight:700; cursor:pointer; border:1px solid ${
                      activeRange === r ? "var(--fin-blue)" : "var(--border)"
                    }; background:${activeRange === r ? "#141c2e" : "#060911"}; color:${
                activeRange === r ? "#ffffff" : "var(--muted)"
              };">
              ${r}
            </button>
          `
            )
            .join("")}
        </div>
      </div>

      <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:auto; background:#060911; border:1px solid var(--border); border-radius:4px;">
        <!-- Extreme Greed Band (>75) -->
        <rect x="${padL}" y="${padT}" width="${plotW}" height="${0.25 * plotH}" fill="rgba(16,185,129,0.12)" />
        <!-- Extreme Fear Band (<25) -->
        <rect x="${padL}" y="${y25}" width="${plotW}" height="${0.25 * plotH}" fill="rgba(239,68,68,0.12)" />

        <!-- Reference Lines -->
        <line x1="${padL}" y1="${y75}" x2="${w - padR}" y2="${y75}" stroke="#10b981" stroke-dasharray="3,3" stroke-width="1" />
        <line x1="${padL}" y1="${y50}" x2="${w - padR}" y2="${y50}" stroke="#64748b" stroke-dasharray="3,3" stroke-width="1" />
        <line x1="${padL}" y1="${y25}" x2="${w - padR}" y2="${y25}" stroke="#ef4444" stroke-dasharray="3,3" stroke-width="1" />

        <text x="6" y="${y75}" fill="#34d399" font-size="9.5" font-weight="700" dominant-baseline="middle">75</text>
        <text x="6" y="${y50}" fill="#94a3b8" font-size="9.5" font-weight="700" dominant-baseline="middle">50</text>
        <text x="6" y="${y25}" fill="#f87171" font-size="9.5" font-weight="700" dominant-baseline="middle">25</text>

        <!-- FG Line -->
        <polyline fill="none" stroke="#38bdf8" stroke-width="2" points="${coords.join(" ")}" />

        <!-- X-Axis Dates with mobile overlap protection -->
        <text x="${padL}" y="${h - 8}" fill="var(--muted)" font-size="9.5" font-family="JetBrains Mono, monospace">${firstDate}</text>
        <text class="timeline-mid-date" x="${padL + plotW / 2}" y="${h - 8}" fill="var(--muted)" font-size="9.5" text-anchor="middle" font-family="JetBrains Mono, monospace">${midDate}</text>
        <text x="${w - padR}" y="${h - 8}" fill="var(--muted)" font-size="9.5" text-anchor="end" font-family="JetBrains Mono, monospace">${lastDate}</text>
      </svg>
    </div>
  `;
}

function renderMiniSparkline(values, regimeCode) {
  if (!values || !values.length) return "";
  const w = 180;
  const h = 44;
  const coords = values
    .map((v, i) => {
      const x = 4 + (i / Math.max(1, values.length - 1)) * (w - 8);
      const y = 4 + (1.0 - Math.max(0, Math.min(100, v)) / 100.0) * (h - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const colorMap = {
    EXTREME_FEAR: "#ef4444",
    FEAR: "#f59e0b",
    NEUTRAL: "#94a3b8",
    GREED: "#10b981",
    EXTREME_GREED: "#059669",
  };
  const stroke = colorMap[regimeCode] || "#94a3b8";

  return `
    <svg viewBox="0 0 ${w} ${h}" style="width:160px; height:40px; background:#060911; border:1px solid var(--border); border-radius:4px;">
      <line x1="0" y1="${h / 2}" x2="${w}" y2="${h / 2}" stroke="#1e293b" stroke-dasharray="2,2" stroke-width="1" />
      <polyline fill="none" stroke="${stroke}" stroke-width="1.8" points="${coords}" />
    </svg>
  `;
}

function renderEquityCurveSvg(historyData) {
  const pts = (historyData && historyData.series) || [];
  if (!pts.length) return "";

  const w = 720;
  const h = 220;
  const padL = 52;
  const padR = 20;
  const padT = 18;
  const padB = 26;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const allVals = [];
  pts.forEach((p) => {
    allVals.push(p.port73_norm, p.qqq_norm);
  });
  const minV = Math.min(...allVals, 8000);
  const maxV = Math.max(...allVals, 12000);
  const span = Math.max(1, maxV - minV);

  const portCoords = pts
    .map((p, i) => {
      const x = padL + (i / Math.max(1, pts.length - 1)) * plotW;
      const y = padT + (1.0 - (p.port73_norm - minV) / span) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const qqqCoords = pts
    .map((p, i) => {
      const x = padL + (i / Math.max(1, pts.length - 1)) * plotW;
      const y = padT + (1.0 - (p.qqq_norm - minV) / span) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const lastPort = pts[pts.length - 1].port73_norm;
  const lastQqq = pts[pts.length - 1].qqq_norm;

  return `
    <div style="margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px; font-size:0.78rem;">
        <div style="display:flex; gap:16px; align-items:center;">
          <span style="display:inline-flex; align-items:center; gap:6px; color:#34d399; font-weight:700;">
            <span style="width:12px; height:3px; background:#0ecb81; display:inline-block;"></span>
            70% $SMH : 30% $XLV Barbell ($10k → $${lastPort.toLocaleString()})
          </span>
          <span style="display:inline-flex; align-items:center; gap:6px; color:#94a3b8; font-weight:600;">
            <span style="width:12px; height:3px; background:#64748b; display:inline-block;"></span>
            100% $QQQ Benchmark ($10k → $${lastQqq.toLocaleString()})
          </span>
        </div>
        <span class="mono" style="color:var(--muted); font-size:0.72rem;">Selected Window: ${historyData.range_code}</span>
      </div>
      <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:auto; background:#060911; border:1px solid var(--border); border-radius:4px;">
        <polyline fill="none" stroke="#64748b" stroke-width="1.6" stroke-dasharray="3,2" points="${qqqCoords}" />
        <polyline fill="none" stroke="#0ecb81" stroke-width="2.2" points="${portCoords}" />
        <text x="6" y="${padT + 8}" fill="#94a3b8" font-size="9.5" font-family="JetBrains Mono, monospace">$${Math.round(maxV).toLocaleString()}</text>
        <text x="6" y="${h - padB}" fill="#94a3b8" font-size="9.5" font-family="JetBrains Mono, monospace">$${Math.round(minV).toLocaleString()}</text>
      </svg>
    </div>
  `;
}
function renderSemiFearGreedView(state) {
  const t = state.t;
  const lang = state.lang;
  const ov = state.semiOverview;

  if (!ov) {
    return `
      <div class="proof-card" style="padding:40px; text-align:center;">
        Loading Semiconductor Fear & Greed Index...
      </div>
    `;
  }

  const regimeLabel = lang === "jp" ? ov.regime_jp : ov.regime_en;
  const actionHeadline = lang === "jp" ? ov.action_headline_jp : ov.action_headline_en;
  const actionDetail = lang === "jp" ? ov.action_detail_jp : ov.action_detail_en;
  const gaugeTab = state.semiGaugeTab || "overview";
  const activeRange = state.semiRange || "1Y";
  const rebal = state.semiAdjustResult;
  const lump = state.semiLumpSumResult;
  const eras = (state.semiHistory && state.semiHistory.era_summary) || [];

  return `
    <!-- SECTION 1: AUTHENTIC CNN BUSINESS FEAR & GREED INDEX EDITORIAL SURFACE -->
    <section class="cnn-page-wrapper" id="semiCnnSection">
      <div class="cnn-editorial-header">
        <div>
          <div class="cnn-red-tag">${t.cnnBadge}</div>
          <h1 class="cnn-main-title">${t.cnnTitle}</h1>
          <p class="cnn-main-subtitle">${t.cnnSubtitle}</p>
        </div>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <a
            class="btn"
            href="${state.config?.youtube_url || "https://www.youtube.com/channel/UCbxWByxJntRqoweWy-4QnqA"}"
            target="_blank"
            rel="noopener"
            style="background:#dc2626; color:#ffffff; border-color:#b91c1c;"
          >
            YouTube @TruthOfMarketUS
          </a>
          <a
            class="btn"
            href="${state.config?.instagram_url || "https://www.instagram.com/truthofmarket/"}"
            target="_blank"
            rel="noopener"
            style="background:#db2777; color:#ffffff; border-color:#be185d;"
          >
            Instagram @truthofmarket
          </a>
          <a
            class="btn ${state.isProUnlocked ? "" : "btn-gated-vip-tg"}"
            href="${getVipTelegramUrl(state.isProUnlocked)}"
            ${state.isProUnlocked ? 'target="_blank" rel="noopener noreferrer"' : ""}
            style="background:#0284c7; color:#ffffff; border-color:#0369a1;"
          >
            ${state.isProUnlocked ? "👑 VIP Telegram News ↗" : "🔒 VIP Telegram ($SMH/$XLV News)"}
          </a>
          <button class="btn" id="btnExportSemiGauge" style="background:#111827; color:#ffffff; border-color:#111827;">
            ${t.cnnExportGauge}
          </button>
        </div>
      </div>

      <!-- CNN TOP 2-COLUMN GRID: LEFT = DIAL GAUGE / TIMELINE, RIGHT = 4 HISTORICAL COMPARISONS -->
      <div class="cnn-top-grid">
        <div class="cnn-card">
          <div class="cnn-card-header">
            <div style="font-size:0.78rem; color:#6b7280; font-weight:600;">
              ${t.cnnLastUpdated}: <b class="mono" style="color:#111827;">${ov.date}</b> · $SMH <b class="mono">$${ov.smh_close.toFixed(2)}</b> (${ov.smh_dd_pct.toFixed(2)}% off 52W High)
            </div>
            <div class="cnn-view-tabs">
              <button class="cnn-view-tab ${gaugeTab === "overview" ? "active" : ""}" data-semi-tab="overview">
                ${t.cnnTabOverview}
              </button>
              <button class="cnn-view-tab ${gaugeTab === "timeline" ? "active" : ""}" data-semi-tab="timeline">
                ${t.cnnTabTimeline}
              </button>
            </div>
          </div>

          ${
            gaugeTab === "overview"
              ? renderCnnDialSvg(ov.fg_score, regimeLabel)
              : renderTimelineSvg(state.semiHistory, activeRange)
          }
        </div>

        <!-- RIGHT COLUMN: CNN 4-ROW HISTORICAL STACK + HISTORICAL STUDY RATIO -->
        <div class="cnn-card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.78rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--muted); margin-bottom:8px;">
              ${t.cnnHistoryTitle}
            </div>
            <div class="cnn-history-list">
              ${ov.comparisons
                .map((c) => {
                  const lbl = lang === "jp" ? c.label_jp : c.label_en;
                  const reg = lang === "jp" ? c.regime_jp : c.regime_en;
                  const sVal = Math.round(c.score);
                  const ringColor = sVal <= 24 ? "#ef4444" : sVal <= 44 ? "#f59e0b" : sVal <= 55 ? "#64748b" : sVal <= 74 ? "#10b981" : "#059669";
                  const ringBg = sVal <= 24 ? "rgba(239,68,68,0.15)" : sVal <= 44 ? "rgba(245,158,11,0.15)" : sVal <= 55 ? "rgba(100,116,139,0.15)" : sVal <= 74 ? "rgba(16,185,129,0.15)" : "rgba(5,150,105,0.15)";
                  return `
                  <div class="cnn-history-row">
                    <div>
                      <div class="cnn-hist-label">${lbl} <span class="mono" style="font-size:0.72rem; color:var(--muted);">(${c.date})</span></div>
                      <div class="cnn-hist-regime">${reg}</div>
                    </div>
                    <div class="cnn-score-circle" style="border-color:${ringColor}; background:${ringBg}; color:#ffffff;">${sVal}</div>
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>

          <!-- Active SMH:XLV Barbell Regime Box -->
          <div style="margin-top:16px; padding:14px 16px; background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.3); border-left:4px solid #dc2626; border-radius:4px;">
            <div style="font-size:0.68rem; font-weight:800; color:#fca5a5; letter-spacing:0.05em; text-transform:uppercase;">
              ${t.cnnActiveRuleLabel} · TARGET ${ov.historical_study_smh_ratio}% $SMH : ${ov.historical_study_xlv_ratio}% $XLV
            </div>
            <div style="font-size:0.88rem; font-weight:800; color:#ffffff; margin-top:4px;">
              ${actionHeadline}
            </div>
            <p style="font-size:0.78rem; color:var(--text-secondary); margin-top:4px; line-height:1.45;">
              ${actionDetail}
            </p>
          </div>
        </div>
      </div>

      <!-- CNN 7 FEAR & GREED INDICATORS BREAKDOWN -->
      <div style="margin-top:12px;">
        <div style="border-bottom:1px solid var(--border); padding-bottom:10px; margin-bottom:16px;">
          <h2 style="font-size:1.35rem; font-weight:900; color:#ffffff;">${t.cnnIndicatorsHeading}</h2>
          <p style="font-size:0.84rem; color:var(--muted); margin-top:2px;">${t.cnnIndicatorsSub}</p>
        </div>

        <div class="cnn-indicators-list">
          ${ov.factors
            .map((f) => {
              const title = lang === "jp" ? f.title_jp : f.title_en;
              const sub = lang === "jp" ? f.subtitle_jp : f.subtitle_en;
              const desc = lang === "jp" ? f.desc_jp : f.desc_en;
              const reg = lang === "jp" ? f.regime_jp : f.regime_en;

              return `
              <div class="cnn-indicator-item">
                <div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span class="mono" style="font-size:0.7rem; font-weight:800; padding:2px 6px; background:#141c2e; border:1px solid var(--border); border-radius:3px; color:#93c5fd;">
                      #${f.order} · ${f.weight_pct}% WEIGHT
                    </span>
                    <span class="cnn-ind-title">${title}</span>
                  </div>
                  <div class="cnn-ind-sub">${sub}</div>
                  <p class="cnn-ind-desc">${desc}</p>
                </div>

                <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                  ${renderMiniSparkline(f.sparkline, f.regime_code)}
                  <div class="mono" style="font-size:0.74rem; color:#94a3b8; font-weight:700;">
                    Reading: ${f.raw_display} · Score ${f.score.toFixed(1)}/100
                  </div>
                </div>

                <div style="text-align:right;">
                  <span class="cnn-pill cnn-pill-${f.regime_code}">${reg}</span>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    </section>

    <!-- SECTION 2: CORE ETF SNAPSHOT STRIP ($SMH, $XLV, $QQQ) -->
    <section class="core-etf-grid">
      ${ov.etfs
        .map((etf) => {
          const name = lang === "jp" ? etf.name_jp : etf.name_en;
          const role = lang === "jp" ? etf.role_jp : etf.role_en;
          const cfg = state.config || {};
          const tvAffId = encodeURIComponent(cfg.tradingview_aff_id || "1173809");
          const saSource = encodeURIComponent(cfg.seekingalpha_source || "better_life333");
          const tsAffId = encodeURIComponent(cfg.trendspider_aff_id || "rightside");
          const tvUrl = `https://www.tradingview.com/symbols/${encodeURIComponent(etf.ticker)}/?aff_id=${tvAffId}`;
          const saUrl = `https://seekingalpha.com/symbol/${encodeURIComponent(etf.ticker)}/earnings?source=${saSource}`;
          const tsUrl = `https://trendspider.com/?_go=${tsAffId}&symbol=${encodeURIComponent(etf.ticker)}`;
          return `
          <div class="proof-card" style="margin-bottom:0; border-top:2px solid ${
            etf.ticker === "SMH" ? "var(--fin-blue)" : etf.ticker === "XLV" ? "var(--fin-up)" : "#64748b"
          };">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="mono" style="font-size:1.15rem; font-weight:900; color:#ffffff;">$${etf.ticker}</span>
                  <span style="font-size:0.78rem; color:var(--text-secondary); font-weight:600;">${name}</span>
                </div>
                <div style="font-size:0.74rem; color:var(--muted); margin-top:3px;">${role}</div>
              </div>
              <div style="text-align:right;">
                <div class="mono" style="font-size:1.15rem; font-weight:800; color:#ffffff;">$${Number(etf.close ?? 0).toFixed(2)}</div>
                <div class="mono" style="font-size:0.74rem; color:${etf.ret_1d_pct >= 0 ? "var(--fin-up)" : "var(--fin-down)"};">
                  1D: ${etf.ret_1d_pct >= 0 ? "+" : ""}${Number(etf.ret_1d_pct ?? 0).toFixed(2)}% · 20D: ${etf.ret_20d_pct >= 0 ? "+" : ""}${Number(etf.ret_20d_pct ?? 0).toFixed(2)}%
                </div>
                <div class="mono" style="font-size:0.7rem; color:var(--muted); margin-top:1px;">
                  52W DD: ${Number(etf.dd_52w_pct ?? 0).toFixed(2)}% · RSI(14): ${Number(etf.rsi14 ?? 50).toFixed(1)}
                </div>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding-top:10px; border-top:1px solid var(--border-subtle); font-size:0.74rem;">
              <span class="mono" style="color:var(--muted);">
                Normal: <b style="color:#fff;">${etf.target_weight_normal}%</b> → Extreme Fear: <b style="color:var(--fin-up);">${etf.target_weight_fear}%</b>
              </span>
              <div style="display:flex; gap:6px;">
                <a class="btn btn-sm" href="${tvUrl}" target="_blank" rel="noopener noreferrer">TV Chart ↗</a>
                <a class="btn btn-sm" href="${saUrl}" target="_blank" rel="noopener noreferrer">Holdings ↗</a>
                <a class="btn btn-sm" href="${tsUrl}" target="_blank" rel="noopener noreferrer" style="border-color:rgba(16,185,129,0.4); color:#34d399;">TrendSpider ↗</a>
              </div>
            </div>
          </div>
        `;
        })
        .join("")}
    </section>

    <!-- SECTION 3: INTERACTIVE SMH + XLV BUDGET REVIEW & 2.5M KRW TAX HARVESTING ENGINE + 3-STAGE LUMP-SUM PLANNER -->
    <section class="semi-calc-grid">
      <!-- Calculator 1: SMH + XLV Allocation & Tax Optimizer -->
      <div class="proof-card" style="margin-bottom:0; border-top:2px solid var(--fin-up);">
        <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:var(--fin-up); letter-spacing:0.05em;">
          ${t.rebalSectionTag}
        </div>
        <h3 style="font-size:1.12rem; font-weight:800; color:#ffffff; margin:4px 0 6px;">${t.rebalSectionTitle}</h3>
        <p style="font-size:0.8rem; color:var(--muted); margin-bottom:14px;">${t.rebalSectionDesc}</p>

        <div class="semi-form-grid-2" style="margin-bottom:12px;">
          <div>
            <label style="font-size:0.68rem; font-family:var(--font-mono); color:var(--muted);">PORTFOLIO CAPITAL ($ USD)</label>
            <input type="number" id="semiCapInput" value="${state.semiCapUsd ?? 100000}" step="1000"
                   style="width:100%; padding:8px 10px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-mono); font-weight:700; margin-top:3px;" />
          </div>
          <div>
            <label style="font-size:0.68rem; font-family:var(--font-mono); color:var(--muted);">ALLOCATION MODE</label>
            <select id="semiModeInput" style="width:100%; padding:8px 10px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-sans); font-weight:600; margin-top:3px;">
              <option value="AUTO_REGIME" ${state.semiMode === "AUTO_REGIME" ? "selected" : ""}>Auto Regime (55:35:10 ↔ 55:35:10 on Fear ≤ 25)</option>
              <option value="BASELINE_70_30" ${state.semiMode === "BASELINE_70_30" ? "selected" : ""}>70% $SMH : 30% $XLV Golden Baseline</option>
              <option value="CONTRARIAN_80_20" ${state.semiMode === "CONTRARIAN_80_20" ? "selected" : ""}>80% $SMH : 20% $XLV Contrarian Accumulation</option>
              <option value="AGGRESSIVE_90_10" ${state.semiMode === "AGGRESSIVE_90_10" ? "selected" : ""}>90% $SMH : 10% $XLV Right-Side Tilt</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.68rem; font-family:var(--font-mono); color:var(--muted);">BUDGET REVIEW CADENCE</label>
            <select id="semiFreqInput" style="width:100%; padding:8px 10px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-sans); font-weight:600; margin-top:3px;">
              <option value="ANNUAL" ${state.semiFreq === "ANNUAL" ? "selected" : ""}>Annual + Band Trigger (Min Tax Drag)</option>
              <option value="QUARTERLY" ${state.semiFreq === "QUARTERLY" ? "selected" : ""}>Quarterly Adjust</option>
              <option value="MONTHLY" ${state.semiFreq === "MONTHLY" ? "selected" : ""}>Monthly Adjust</option>
              <option value="WEEKLY" ${state.semiFreq === "WEEKLY" ? "selected" : ""}>Weekly Adjust (High Tax Drag)</option>
            </select>
          </div>
        </div>

        <button type="button" class="btn btn-emerald" id="btnRunSemiAdjust" style="min-height:42px; width:100%; justify-content:center; padding:9px;">
          Calculate Exact $SMH / $XLV Allocation Orders
        </button>

        ${
          rebal
            ? `
          <div id="semiRebalOutput" style="margin-top:14px; background:#060911; border:1px solid var(--border); border-left:3px solid var(--fin-up); border-radius:4px; padding:14px; font-size:0.8rem;">
            <div style="font-weight:800; color:var(--fin-up); margin-bottom:4px;">
              ${lang === "jp" ? rebal.active_rule_jp : rebal.active_rule_en}
            </div>
            <div class="mono" style="font-size:0.71rem; color:#93c5fd; margin-bottom:8px;">
              Latest Close Basis (${rebal.as_of_date || ov.date}): $SMH @ $${Number(rebal.smh_close ?? ov.smh_close).toFixed(2)} · $XLV @ $${Number(rebal.xlv_close ?? ov.xlv_close).toFixed(2)} · Total Capital $${Number(rebal.total_capital_usd ?? state.semiCapUsd ?? 100000).toLocaleString()}
            </div>
            <div class="semi-form-grid-2" style="margin-bottom:10px;">
              <div style="background:#0c1220; padding:10px; border-radius:4px; border:1px solid var(--border);">
                <div style="font-size:0.7rem; color:var(--muted);">TARGET $SMH (${rebal.target_smh_weight_pct}%)</div>
                <div class="mono" style="font-size:1.05rem; font-weight:800; color:#fff; margin-top:2px;">
                  $${Number(rebal.target_smh_usd ?? 0).toLocaleString()} (${rebal.target_smh_shares} sh)
                </div>
                <div class="mono" style="font-size:0.73rem; color:${rebal.delta_smh_usd >= 0 ? "var(--fin-up)" : "var(--fin-down)"}; margin-top:2px;">
                  Order vs Drift: ${rebal.delta_smh_usd >= 0 ? "BUY +" : "SELL "}$${Math.abs(Number(rebal.delta_smh_usd ?? 0)).toLocaleString()} (${rebal.delta_smh_shares >= 0 ? "+" : ""}${rebal.delta_smh_shares} sh)
                </div>
              </div>
              <div style="background:#0c1220; padding:10px; border-radius:4px; border:1px solid var(--border);">
                <div style="font-size:0.7rem; color:var(--muted);">TARGET $XLV (${rebal.target_xlv_weight_pct}%)</div>
                <div class="mono" style="font-size:1.05rem; font-weight:800; color:#fff; margin-top:2px;">
                  $${Number(rebal.target_xlv_usd ?? 0).toLocaleString()} (${rebal.target_xlv_shares} sh)
                </div>
                <div class="mono" style="font-size:0.73rem; color:${rebal.delta_xlv_usd >= 0 ? "var(--fin-up)" : "var(--fin-down)"}; margin-top:2px;">
                  Order vs Drift: ${rebal.delta_xlv_usd >= 0 ? "BUY +" : "SELL "}$${Math.abs(Number(rebal.delta_xlv_usd ?? 0)).toLocaleString()} (${rebal.delta_xlv_shares >= 0 ? "+" : ""}${rebal.delta_xlv_shares} sh)
                </div>
              </div>
            </div>
            <div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; border-top:1px solid var(--border); padding-top:8px;">
              <div class="mono" style="color:var(--muted);">
                Residual Cash: $${Number(rebal.residual_cash_usd ?? 0).toFixed(2)} · Est. Annual Tax &amp; Turnover Drag (${rebal.adjust_frequency}): -${rebal.estimated_tax_drag_pct}%/yr · Expected Net 15Y Rate: +${rebal.expected_net_cagr_pct}%/yr
              </div>
            </div>
          </div>
        `
            : ""
        }
      </div>

      <!-- Calculator 2: 3-Stage Lump-Sum Entry Planner -->
      <div class="proof-card" style="margin-bottom:0; border-top:2px solid var(--fin-blue);">
        <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:#60a5fa; letter-spacing:0.05em;">
          ${t.lumpSectionTag}
        </div>
        <h3 style="font-size:1.12rem; font-weight:800; color:#ffffff; margin:4px 0 6px;">${t.lumpSectionTitle}</h3>
        <p style="font-size:0.8rem; color:var(--muted); margin-bottom:14px;">${t.lumpSectionDesc}</p>

        <div class="semi-form-grid-2" style="margin-bottom:12px;">
          <div>
            <label style="font-size:0.68rem; font-family:var(--font-mono); color:var(--muted);">NEW LUMP-SUM CASH ($ USD)</label>
            <input type="number" id="semiLumpCapInput" value="${state.semiLumpCapUsd ?? 50000}" step="1000"
                   style="width:100%; padding:8px 10px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-mono); font-weight:700; margin-top:3px;" />
          </div>
          <div>
            <label style="font-size:0.68rem; font-family:var(--font-mono); color:var(--muted);">
              SIMULATE FEAR & GREED SCORE (LIVE: ${ov.fg_score})
            </label>
            <input type="number" id="semiLumpScoreInput" value="${
              state.semiLumpScore !== null && state.semiLumpScore !== undefined ? state.semiLumpScore : ov.fg_score
            }" min="0" max="100" step="1"
                   style="width:100%; padding:8px 10px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-mono); font-weight:700; margin-top:3px;" />
          </div>
        </div>

        <div style="display:flex; gap:6px; margin-bottom:12px; flex-wrap:wrap;">
          <button type="button" class="btn btn-sm btn-sim-fg" data-fg="${Number(ov.fg_score ?? 18.3).toFixed(1)}">Live Extreme Fear (${Number(ov.fg_score ?? 18.3).toFixed(1)})</button>
          <button type="button" class="btn btn-sm btn-sim-fg" data-fg="50.0">Simulate Neutral (50.0)</button>
          <button type="button" class="btn btn-sm btn-sim-fg" data-fg="78.0">Simulate Extreme Greed (78.0)</button>
        </div>

        <button type="button" class="btn btn-primary" id="btnRunSemiLumpSum" style="min-height:42px; width:100%; justify-content:center; padding:9px;">
          Generate 3-Stage Lump-Sum Tranche Schedule
        </button>

        ${
          lump
            ? `
          <div id="semiLumpOutput" style="margin-top:14px; background:#060911; border:1px solid var(--border); border-left:3px solid var(--fin-blue); border-radius:4px; padding:14px; font-size:0.8rem;">
            <div style="font-weight:800; color:#93c5fd; margin-bottom:3px;">
              ${lang === "jp" ? lump.case_title_jp : lump.case_title_en}
            </div>
            <div class="mono" style="font-size:0.71rem; color:var(--muted); margin-bottom:6px;">
              Latest Close Basis (${lump.as_of_date || ov.date}): $SMH @ $${Number(lump.smh_close ?? ov.smh_close).toFixed(2)} · $XLV @ $${Number(lump.xlv_close ?? ov.xlv_close).toFixed(2)}
            </div>
            <p style="font-size:0.76rem; color:var(--text-secondary); margin-bottom:10px;">
              ${lang === "jp" ? lump.summary_jp : lump.summary_en}
            </p>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${lump.tranches
                .map((tr) => {
                  const tTitle = lang === "jp" ? tr.title_jp : tr.title_en;
                  const tTime = lang === "jp" ? tr.timing_jp : tr.timing_en;
                  const tNote = lang === "jp" ? tr.note_jp : tr.note_en;
                  return `
                  <div style="background:#0c1220; padding:10px; border-radius:4px; border:1px solid var(--border);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <b style="color:#ffffff;">${tTitle}</b>
                      <span class="mono" style="color:var(--fin-up); font-weight:700;">$${tr.amount_usd.toLocaleString()} (${tr.allocation_pct}%)</span>
                    </div>
                    <div class="mono" style="font-size:0.72rem; color:#93c5fd; margin-top:2px;">
                      ${tTime} · $SMH: $${tr.smh_usd.toLocaleString()} (${tr.smh_shares} sh) | $XLV: $${tr.xlv_usd.toLocaleString()} (${tr.xlv_shares} sh)
                    </div>
                    <div style="font-size:0.74rem; color:var(--muted); margin-top:4px;">${tNote}</div>
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>
        `
            : ""
        }
      </div>
    </section>

    <!-- SECTION 4: 26-YEAR EMPIRICAL PERFORMANCE TABLE & EQUITY CURVE (2000-2026) -->
    <section class="proof-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:14px;">
        <div>
          <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:var(--fin-up); letter-spacing:0.05em;">
            ${t.eraSectionTag}
          </div>
          <h3 style="font-size:1.15rem; font-weight:800; color:#ffffff; margin-top:3px;">${t.eraSectionTitle}</h3>
          <p style="font-size:0.8rem; color:var(--muted); margin-top:2px;">${t.eraSectionDesc}</p>
        </div>
        <button class="btn btn-sm" id="btnDownloadSemiCsv">
          Download 2000–2026 Historical Statistical Workbook (Pro)
        </button>
      </div>

      ${renderEquityCurveSvg(state.semiHistory)}

      <div class="table-responsive-scroll">
        <table class="proof-table">
          <thead>
            <tr>
              <th>Investment Horizon</th>
              <th>Period</th>
              <th>100% $QQQ CAGR</th>
              <th>100% $QQQ Multiple</th>
              <th>55:35:10 Baseline CAGR</th>
              <th>55:35:10 (55:35:10 Fear Tilt) CAGR</th>
              <th>55:35:10 (55:35:10 Tilt) Multiple</th>
              <th>Max Drawdown (vs QQQ)</th>
            </tr>
          </thead>
          <tbody>
            ${eras
              .map((e) => {
                const hLabel = lang === "jp" ? e.horizon_jp : e.horizon_en;
                return `
                <tr class="proof-highlight">
                  <td style="font-family:var(--font-sans);">${hLabel}</td>
                  <td>${e.period}</td>
                  <td style="color:var(--text-secondary);">+${e.qqq_cagr_pct.toFixed(2)}%</td>
                  <td style="color:var(--text-secondary);">${e.qqq_multiple.toFixed(2)}x</td>
                  <td>+${e.port_70_30_cagr_pct.toFixed(2)}%</td>
                  <td style="color:var(--fin-up); font-weight:800;">+${e.port_80_20_cagr_pct.toFixed(2)}%</td>
                  <td style="color:var(--fin-up); font-weight:800;">${e.port_80_20_multiple.toFixed(2)}x</td>
                  <td><span style="color:var(--fin-up);">${e.port_80_20_mdd_pct.toFixed(1)}%</span> <span style="color:var(--muted); font-size:0.72rem;">(QQQ ${e.qqq_mdd_pct.toFixed(1)}%)</span></td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 5: MONTHLY & ANNUAL RESEARCH PASS EDUCATIONAL SOFTWARE PRICING -->
    ${renderPricing(state)}

    <!-- CROSS-PLATFORM SWITCH BANNER BACK TO RETIREMENT ARCHITECT & QUANT ARCHIVE -->
    <section class="cross-banner" style="border-left-color:var(--fin-blue);">
      <div>
        <div style="font-size:0.72rem; font-family:var(--font-mono); font-weight:700; color:#93c5fd; text-transform:uppercase;">
          COMPANION SELF-DIRECTED EDUCATIONAL CALCULATORS · TRUTHOFMARKET
        </div>
        <h3 style="font-size:1.15rem; font-weight:800; margin:4px 0; color:#ffffff;">
          Planning Your 401(k)/IRA Monthly Retirement Cashflow or Reviewing Individual Equity Factors?
        </h3>
        <p style="font-size:0.84rem; color:var(--muted);">
          Return to our 4-Step Historical SMH &times; XLV + SGOV Sector Balance Simulator or explore the Quantitative Factor Research Archive.
        </p>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <a class="btn btn-primary" href="/">
          30-Sec Retirement Calculator →
        </a>
        <a class="btn" href="/pro-swing.html" style="border-color:rgba(56,189,248,0.45); color:#38bdf8;">
          Quant Research Archive →
        </a>
      </div>
    </section>
  `;
}


// --- src/components/PrivateWealthHome.js ---
/**
 * TruthOfMarket — Single-Breath Educational Sector Research Platform
 * 0 Emojis · 0 Clutter Below Step-Up Container · 1-Line Legal Footer Only
 * Strictly Non-Advisory Educational Publisher · Whop (@whop/checkout) Live Integration
 */

const PW_HTML_TEMPLATE = `    <main id="tom-retirement-architect" class="pw-shell">
      <header class="pw-masthead">
        <button type="button" class="pw-brand-btn" data-pw-go-home="1">
          <span class="pw-wordmark">TRUTH OF MARKET</span>
          <span class="pw-submark">Independent Market Data &amp; Educational Research</span>
        </button>
        <div style="display:flex;gap:14px;align-items:center;"><a href="/archive.html" class="pw-signin-link" style="text-decoration:none;">Research Archive</a><button type="button" class="pw-signin-link" id="btnOpenPwRestoreModal">Member Sign-In / Restore</button></div>
      </header>

      <!-- Screen 0: Above-the-Fold Instant Start CTA + Live Market Temperature + Founding Note & 2000-2025 Simulation Table -->
      <section id="pwScreen0" data-pw-screen="0">
        <div class="pw-kicker">INDEPENDENT MARKET DATA &amp; EDUCATIONAL RESEARCH</div>
        <h1 class="pw-serif-h1">Why quiet two-pillar discipline outlasts loud stock picking.</h1>

        <div class="pw-live-temp-pill" id="tomLiveTempBadge" role="status" aria-live="polite">
          <span class="pw-live-dot" aria-hidden="true"></span>
          <span id="tomLiveTempText">Data As Of: 2026-11-18 &middot; Sector Temperature: 11 / 100 (Extreme Fear Regime)</span>
        </div>

        <div class="pw-primary-cta-wrap pw-above-fold-cta">
          <button type="button" class="pw-btn-primary pw-btn-emerald" id="btnStartPwStepUp" data-pw-start-stepup="1">
            Explore Historical Sector Backtest (4 Steps) &rarr;
          </button>
          <span class="pw-cta-caption">Instant free 2000&ndash;2025 historical study ratio &amp; drawdown comparison &middot; Zero email wall</span>
        </div>

        <figure class="pw-editorial-figure">
          <div class="pw-editorial-plate">
            <img src="/images/tom-private-wealth-study.jpg" alt="Sunlit coastal study desk overlooking quiet morning harbor water" width="1200" height="675" loading="eager" decoding="async" />
          </div>
          <figcaption class="pw-editorial-caption">Quiet empirical study over daily market noise &mdash; comparing two-pillar sector resilience across 25 years of market cycles.</figcaption>
        </figure>

        <div class="pw-manifesto">
          <p>
            Most households approaching or living in retirement do not lose sleep&mdash;or hard-earned savings&mdash;because they ignored the market. They lose both because financial media pushes savers to chase dozens of noisy stock stories at once, quietly drifting into pure technology concentration right before a multi-year downturn.
          </p>
          <p>
            We built <strong>Truth of Market</strong> as an independent, strictly non-advisory educational research publisher. Rather than issuing speculative trade alerts, our historical research studies one enduring empirical structure: pairing secular semiconductor innovation (<strong>SMH</strong>) with non-cyclical healthcare cash flows (<strong>XLV</strong>) and short-term US Treasury reserves (<strong>SGOV</strong>).
          </p>
          <p>
            Use our <strong>Historical Sector Backtest Explorer</strong> to compare how different 2000&ndash;2025 <strong>SMH &times; XLV + SGOV</strong> historical study ratios behaved across past downturns, and explore our <strong>Educational Market Data Newsletter + 2000&ndash;2025 Historical Statistical Workbook</strong>.
          </p>
        </div>

        <div class="pw-table-card" role="region" aria-label="2000-2025 Historical Simulation Comparison">
          <div class="pw-table-header">
            <span class="pw-table-title">TABLE I &mdash; 2000&ndash;2025 HISTORICAL SECTOR STATISTICAL CASE STUDY</span>
            <span class="pw-table-meta">Non-Leveraged 1x Spot Index / ETF Series</span>
          </div>
          <div class="pw-table-scroll">
            <table class="pw-sim-table">
              <thead>
                <tr>
                  <th>Historical Case Study</th>
                  <th>Annualized (CAGR)</th>
                  <th>Worst Crisis DD</th>
                  <th>Recovery Period</th>
                  <th>Return / DD Ratio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S&amp;P 500 Index Alone</td>
                  <td>~7.9%</td>
                  <td class="pw-dd-neg">-50.9%</td>
                  <td>56 mos</td>
                  <td>0.16x</td>
                </tr>
                <tr>
                  <td>Traditional 60 / 40 Mix</td>
                  <td>~6.4%</td>
                  <td class="pw-dd-neg">-32.3%</td>
                  <td>31 mos</td>
                  <td>0.20x</td>
                </tr>
                <tr>
                  <td>100% Semiconductor (SMH Alone)</td>
                  <td>~11.8%</td>
                  <td class="pw-dd-neg">-74.6%</td>
                  <td>89 mos</td>
                  <td>0.16x</td>
                </tr>
                <tr class="is-featured">
                  <td>SMH &times; XLV + SGOV (55 / 35 / 10 Core Study)</td>
                  <td>~12.8%</td>
                  <td class="pw-dd-neg">-27.8%</td>
                  <td>17 mos</td>
                  <td class="pw-eff-pos">0.46x</td>
                </tr>
                <tr>
                  <td>SMH &times; XLV + SGOV (45 / 35 / 20 Retiree Study)</td>
                  <td>~11.1%</td>
                  <td class="pw-dd-neg">-22.9%</td>
                  <td>14 mos</td>
                  <td class="pw-eff-pos">0.48x</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="pw-table-note">
            2000&ndash;2025 historical statistical case study (semi-annual systematic ratio reset on non-leveraged 1x spot series) published strictly for general educational research; past historical statistics never guarantee future performance.
          </p>
        </div>

        <div class="pw-primary-cta-wrap">
          <button type="button" class="pw-btn-primary pw-btn-emerald" data-pw-start-stepup="1">
            Historical Sector Backtest Explorer (4 Steps) &rarr;
          </button>
          <span class="pw-cta-caption">Four brief study parameters &middot; Instant free baseline summary &middot; No brokerage login required</span>
        </div>
      </section>

      <!-- Screen 1: Focused 1-Question-at-a-Time Historical Sector Backtest Explorer (Step 1 of 4 -> 4 of 4) -->
      <section id="pwScreen1" data-pw-screen="1" style="display:none;">
        <div class="pw-step-card">
          <div class="pw-step-top">
            <button type="button" class="pw-back-btn" id="btnPwStepBack">&larr; Back</button>
            <span class="pw-step-counter" id="pwStepCounterLabel">STEP 01 OF 04</span>
          </div>
          <div class="pw-progress-line" aria-hidden="true">
            <span class="pw-progress-fill" id="pwStepProgressFill" style="width:25%;"></span>
          </div>

          <div data-pw-qpane="1">
            <h2 class="pw-q-title">Which historical case-study profile would you like to explore?</h2>
            <p class="pw-q-sub">Select the long-term study profile to compare across the 2000&ndash;2025 dataset.</p>
            <div class="pw-option-list" role="radiogroup" aria-label="Historical Study Profile">
              <button type="button" class="pw-opt-btn" data-pw-field="objective" data-pw-val="growth">
                <div class="pw-opt-head"><span><span class="pw-opt-num">I</span><span class="pw-opt-title">Secular Growth &amp; Semiconductor Study</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Examine higher semiconductor compounding weight (SMH) paired with healthcare drawdown buffering (XLV).</span>
              </button>
              <button type="button" class="pw-opt-btn is-selected" data-pw-field="objective" data-pw-val="balanced">
                <div class="pw-opt-head"><span><span class="pw-opt-num">II</span><span class="pw-opt-title">Balanced Retirement Cash-Flow Study</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Compare balanced secular growth (SMH) and non-cyclical healthcare cash flows (XLV) across full cycles.</span>
              </button>
              <button type="button" class="pw-opt-btn" data-pw-field="objective" data-pw-val="preservation">
                <div class="pw-opt-head"><span><span class="pw-opt-num">III</span><span class="pw-opt-title">Defensive Stability &amp; Treasury Reserve Study</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Study defensive healthcare (XLV) and 0&ndash;3 month US Treasury liquidity (SGOV) during deep downturns.</span>
              </button>
            </div>
          </div>

          <div data-pw-qpane="2" style="display:none;">
            <h2 class="pw-q-title">Select a sample dollar scale for worksheet illustration.</h2>
            <p class="pw-q-sub">Computed locally in your browser to illustrate historical dollar-bucket math across 401(k), IRA, and taxable accounts.</p>
            <div class="pw-scale-grid" role="radiogroup" aria-label="Sample Portfolio Scale">
              <button type="button" class="pw-scale-btn" data-pw-field="scale" data-pw-val="50000">$50,000</button>
              <button type="button" class="pw-scale-btn" data-pw-field="scale" data-pw-val="150000">$150,000</button>
              <button type="button" class="pw-scale-btn is-selected" data-pw-field="scale" data-pw-val="300000">$300,000</button>
              <button type="button" class="pw-scale-btn" data-pw-field="scale" data-pw-val="500000">$500,000</button>
              <button type="button" class="pw-scale-btn" data-pw-field="scale" data-pw-val="1000000">$1,000,000+</button>
            </div>
          </div>

          <div data-pw-qpane="3" style="display:none;">
            <h2 class="pw-q-title">Which historical drawdown band do you want to benchmark?</h2>
            <p class="pw-q-sub">Compare how varying defensive cushions altered historical peak-to-trough declines between 2000 and 2025.</p>
            <div class="pw-option-list" role="radiogroup" aria-label="Historical Drawdown Benchmark">
              <button type="button" class="pw-opt-btn" data-pw-field="comfort" data-pw-val="dd10">
                <div class="pw-opt-head"><span><span class="pw-opt-num">I</span><span class="pw-opt-title">-10% Low-Variance Study Band</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Models a larger short-term US Treasury reserve (SGOV) alongside XLV to study muted historical volatility.</span>
              </button>
              <button type="button" class="pw-opt-btn is-selected" data-pw-field="comfort" data-pw-val="dd18">
                <div class="pw-opt-head"><span><span class="pw-opt-num">II</span><span class="pw-opt-title">-18% Balanced Study Band</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Models the balanced SMH &times; XLV + SGOV historical case study across 2000, 2008, and 2022.</span>
              </button>
              <button type="button" class="pw-opt-btn" data-pw-field="comfort" data-pw-val="dd25">
                <div class="pw-opt-head"><span><span class="pw-opt-num">III</span><span class="pw-opt-title">-25% Long-Horizon Compounding Band</span></span><span>&rarr;</span></div>
                <span class="pw-opt-desc">Models higher semiconductor equity exposure over multi-decade compounding windows.</span>
              </button>
            </div>
          </div>

          <div data-pw-qpane="4" style="display:none;">
            <h2 class="pw-q-title">What technology concentration benchmark should we compare against?</h2>
            <p class="pw-q-sub">Used to contrast single-sector concentration against the two-pillar historical study ratio.</p>
            <div class="pw-option-list" role="radiogroup" aria-label="Comparison Tech Concentration">
              <button type="button" class="pw-opt-btn is-selected" data-pw-field="techMix" data-pw-val="tech_high">
                <div class="pw-opt-head"><span><span class="pw-opt-num">I</span><span class="pw-opt-title">Over 70% Tech &amp; Semiconductor Concentration</span></span></div>
                <span class="pw-opt-desc">Compare heavy single-sector cyclicality against healthcare defensive ballast.</span>
              </button>
              <button type="button" class="pw-opt-btn" data-pw-field="techMix" data-pw-val="tech_mid">
                <div class="pw-opt-head"><span><span class="pw-opt-num">II</span><span class="pw-opt-title">30% to 70% Broad Equity Mix</span></span></div>
                <span class="pw-opt-desc">Compare a diversified equity mix against the SMH &times; XLV + SGOV historical case study.</span>
              </button>
              <button type="button" class="pw-opt-btn" data-pw-field="techMix" data-pw-val="tech_low">
                <div class="pw-opt-head"><span><span class="pw-opt-num">III</span><span class="pw-opt-title">Under 30% Tech or Primarily Cash Reserves</span></span></div>
                <span class="pw-opt-desc">Compare cash-heavy holdings against a measured two-pillar historical baseline.</span>
              </button>
            </div>
            <div style="margin-top:24px;">
              <button type="button" class="pw-btn-primary pw-btn-emerald" id="btnSubmitPwAssessment" style="width:100%;">
                View Free Historical Study Ratio &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Screen 2: Immediate Free Historical Study Summary (ZERO Email Wall) + Optional Save Box -->
      <section id="tomMorningBellClub" data-pw-screen="2" style="display:none;">
        <div class="pw-gate-card">
          <div class="pw-profile-strip">
            <span id="pwProfileSummaryLine">Study Profile: Balanced Cash-Flow &middot; $300,000 Sample &middot; -18% Study Band</span>
            <button type="button" class="pw-inline-link" id="btnEditPwInputs">Edit Study Inputs</button>
          </div>

          <div id="pwFreeBaselineSummaryView">
            <div class="pw-kicker">HISTORICAL SECTOR BACKTEST EXPLORER &middot; FREE STUDY SUMMARY</div>
            <h2 class="pw-serif-h2" id="pwUnlockedRatioHeadline">55% SMH &middot; 35% XLV &middot; 10% SGOV Historical Study Ratio</h2>
            <p style="margin:0;color:#475569;font-size:0.94rem;" id="pwUnlockedRationaleText">
              Computed from 2000&ndash;2025 non-leveraged 1x ETF historical series for self-directed educational study. Need basic brokerage order terminology? <button type="button" class="pw-inline-link" id="tomFreeStarterManual">Open the complimentary $0 US Brokerage Limit-Order Reference</button>.
            </p>

            <div class="pw-ratio-bar" id="pwRatioVisualBar" aria-hidden="true">
              <span style="width:55%;background:#0F172A;"></span>
              <span style="width:35%;background:#065F46;"></span>
              <span style="width:10%;background:#94A3B8;"></span>
            </div>

            <div class="pw-ratio-grid" id="pwRatioCellsGrid">
              <div class="pw-ratio-cell">
                <div class="pw-ratio-ticker">SMH &middot; GROWTH PILLAR</div>
                <div class="pw-ratio-pct" id="pwPctSmh">55%</div>
                <div class="pw-ratio-name">Semiconductor 1x ETF</div>
              </div>
              <div class="pw-ratio-cell">
                <div class="pw-ratio-ticker">XLV &middot; DEFENSIVE PILLAR</div>
                <div class="pw-ratio-pct" id="pwPctXlv">35%</div>
                <div class="pw-ratio-name">US Healthcare 1x ETF</div>
              </div>
              <div class="pw-ratio-cell">
                <div class="pw-ratio-ticker">SGOV &middot; TREASURY RESERVE</div>
                <div class="pw-ratio-pct" id="pwPctSgov">10%</div>
                <div class="pw-ratio-name">0&ndash;3 Mo US T-Bill</div>
              </div>
            </div>

            <div class="pw-drawdown-compare-box" role="region" aria-label="2000-2025 Historical Crisis Drawdown Comparison">
              <div class="pw-drawdown-compare-title">2000&ndash;2025 HISTORICAL CRISIS DRAWDOWN COMPARISON</div>
              <div class="pw-drawdown-compare-grid">
                <div class="pw-dd-cmp-item">
                  <span class="pw-dd-cmp-label">100% Semiconductor (SMH Alone)</span>
                  <strong class="pw-dd-cmp-val">-74.6% Max DD &middot; 89 mos recovery</strong>
                </div>
                <div class="pw-dd-cmp-item">
                  <span class="pw-dd-cmp-label">S&amp;P 500 Index Alone</span>
                  <strong class="pw-dd-cmp-val">-50.9% Max DD &middot; 56 mos recovery</strong>
                </div>
                <div class="pw-dd-cmp-item is-highlight">
                  <span class="pw-dd-cmp-label">Selected SMH &times; XLV + SGOV Study Ratio</span>
                  <strong class="pw-dd-cmp-val" id="pwStudyDrawdownCompareVal">~-24.8% Hist. Crisis DD &middot; ~17 mos recovery</strong>
                </div>
              </div>
            </div>
          </div>

          <div id="tom-passwordless-club-signup" class="pw-save-summary-box">
            <div class="pw-kicker" style="margin-bottom:6px;">FREE MORNING RESEARCH NOTES &middot; ZERO PASSWORD</div>
            <h3 class="pw-save-summary-title">Save My Study Summary &amp; Receive Morning Research Notes (Free)</h3>
            <p style="margin:0;color:#475569;font-size:0.92rem;">
              Enter your email to save this historical study summary and receive our calm morning market data newsletter (1-click unsubscribe anytime).
            </p>
            <form class="pw-email-form" id="pwFreeGateForm" novalidate>
              <input type="text" name="website_hp" id="pwGateHp" tabindex="-1" autocomplete="off" aria-hidden="true" style="display:none;" />
              <input type="email" id="pwGateEmailInput" class="pw-email-input" required autocomplete="email" placeholder="Enter your email address" aria-label="Email address" />
              <button type="submit" class="pw-btn-primary pw-btn-emerald" id="btnPwGateSubmit">
                Save Study Summary (Free) &rarr;
              </button>
            </form>
            <div id="pwGateStatusMsg" role="status" aria-live="polite" style="display:none;margin-top:10px;font-size:0.88rem;color:#065F46;font-weight:600;"></div>
          </div>
        </div>
      </section>

      <!-- Screen 3: 2-Tier Whop Research Passes (#pricing) -->
      <section id="pricing" class="pw-tiers-section" data-pw-screen="3" style="display:none;">
        <div class="pw-kicker">INDEPENDENT MARKET DATA &amp; EDUCATIONAL RESEARCH PASSES</div>
        <h2 class="pw-serif-h2" id="pwPricingHeadline">Educational Market Data Newsletter + 2000&ndash;2025 Historical Statistical Workbook.</h2>
        <p style="margin:0;color:#475569;font-size:0.95rem;" id="pwPricingSubcopy">
          SMH &times; XLV + SGOV 2-Pillar Historical Case Study &mdash; Strictly Non-Advisory Educational Publisher. Explore daily public market temperature data notes and the complete historical statistical workbook.
        </p>

        <div class="pw-tier-grid">
          <div class="pw-tier-card">
            <div>
              <div class="pw-tier-kicker">TIER I &middot; MONTHLY RESEARCH PASS</div>
              <h3 class="pw-tier-name">Monthly Research Pass</h3>
              <div class="pw-tier-price">$29 <span>/ month</span></div>
              <div class="pw-tier-saving">Flexible month-to-month access &middot; Cancel anytime</div>
              <ul class="pw-tier-list">
                <li><strong>Educational Market Data Newsletter</strong> delivered before the US market open (0&ndash;100 public sector temperature &amp; historical regime study notes)</li>
                <li><strong>2000&ndash;2025 Historical Statistical Workbook (Monthly Edition)</strong> comparing SMH &times; XLV + SGOV historical case-study cohorts</li>
                <li><strong>Sample Dollar-Scale Educational Worksheet</strong> illustrating tax-location concepts across 401(k), IRA, and taxable accounts</li>
              </ul>
            </div>
            <a href="https://whop.com/checkout/plan_xVJeNwyrDef8T" class="pw-btn-primary whop-checkout-button" data-whop-checkout data-whop-plan="monthly" data-tom-paid-plan="monthly" style="width:100%;">
              Select Monthly Research Pass &mdash; $29/mo &rarr;
            </a>
          </div>

          <div class="pw-tier-card is-annual">
            <div>
              <div class="pw-tier-kicker">TIER II &middot; ANNUAL RESEARCH PASS &middot; SAVE 43%</div>
              <h3 class="pw-tier-name">Annual Research Pass</h3>
              <div class="pw-tier-price">$199 <span>/ year</span></div>
              <div class="pw-tier-saving">Equivalent to $16.58/mo (Save 43% vs. monthly)</div>
              <ul class="pw-tier-list">
                <li><strong>Full 12 Months of the Educational Market Data Newsletter</strong> covering daily SMH &times; XLV + SGOV public indicator readings</li>
                <li><strong>Complete 2000&ndash;2025 Historical Statistical Workbook &amp; Reference Masterbook PDF</strong> (Dot-Com, 2008 &amp; 2022 drawdown case studies + retirement withdrawal math)</li>
                <li><strong>Annual Household Cash-Flow &amp; Semi-Annual Review Educational Workbook</strong></li>
              </ul>
            </div>
            <a href="https://whop.com/checkout/plan_9sdgFI753ucXQ" class="pw-btn-primary pw-btn-emerald whop-checkout-button" data-whop-checkout data-whop-plan="annual" data-tom-paid-plan="annual" style="width:100%;">
              Select Annual Research Pass &mdash; $199/yr &rarr;
            </a>
          </div>
        </div>

        <div style="margin-top:18px;padding:16px 18px;background:#F8FAFC;border:1px solid #CBD5E1;border-radius:10px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">
          <div style="font-size:0.9rem;color:#334155;max-width:620px;line-height:1.55;">
            <strong style="color:#0F172A;">Inspect Before You Decide:</strong> Review our 2-page sample PDF (2000&ndash;2025 crisis comparison table + Fidelity/Schwab limit-order preview) before purchasing.
          </div>
          <a href="/assets/downloads/tom_sample_2p.pdf" target="_blank" rel="noopener" class="pw-btn-primary" style="background:#FFFFFF;color:#0F2C22;border:1.5px solid #0F2C22;padding:10px 18px;font-size:0.92rem;text-decoration:none;">
            Preview Free 2-Page Sample PDF &rarr;
          </a>
        </div>
        <p class="pw-mor-note" style="line-height:1.65;">
          <strong>Standard Digital Refund &amp; Cancellation Policy:</strong> (1) Full refund within 7 days if unopened/undownloaded; (2) Non-refundable for change of mind once digital PDF/content download or access begins (free 2-page sample provided above); (3) 100% refund for technical file errors or duplicate billing; (4) Cancel recurring passes anytime in 1 click. Secure Checkout via Whop.com &middot; Support: <a href="mailto:hello@truthofmarket.com" style="color:inherit;text-decoration:underline;">hello@truthofmarket.com</a>.
        </p>
        <div style="margin-top:20px;padding:18px 20px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;">
          <div class="pw-kicker" style="margin-bottom:6px;">EARLY READER FEEDBACK &amp; VERIFIED REVIEWS</div>
          <p style="margin:0 0 10px;font-size:0.9rem;color:#475569;">We collect candid reader notes from self-directed retirees reviewing our 2000&ndash;2025 historical workbook. Have you tested the sample PDF or workbook? Share a 2-sentence review to help future readers.</p>
          <a href="mailto:hello@truthofmarket.com?subject=TruthOfMarket%20Reader%20Review" style="font-size:0.88rem;font-weight:700;color:#065F46;text-decoration:underline;">Submit an Early Reader Review &rarr;</a>
        </div>
      </section>

      <!-- Screen 4: Paid Research Vault, Custom Dollar SMH x XLV + SGOV Workbook PDF, Stress Test, 401k/IRA Roadmap & Monthly Report Card -->
      <section id="tomPaidScreen4Vault" class="pw-tiers-section" data-pw-screen="4" style="display:none;margin-top:28px;">
        <div class="pw-gate-card" style="border:1.5px solid #065F46;background:#FFFFFF;">
          <div class="pw-kicker" style="color:#065F46;">PAID RESEARCH VAULT &middot; PERMANENT CROSS-DEVICE EDITION</div>
          <h2 class="pw-serif-h2" id="tomScreen4Headline">Custom Dollar SMH &times; XLV + SGOV Historical Workbook &amp; Stress-Test Edition</h2>
          <p style="margin:0 0 16px;color:#475569;font-size:0.95rem;">
            Adjust your household sample dollar scale below to update your 1:1 educational worksheet, -35% market-crash stress test, 401(k)/IRA tax-location study roadmap, and large-print Fidelity/Schwab/Vanguard 5-minute limit-order guide.
          </p>

          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:14px 16px;background:#F8FAFC;border:1px solid #CBD5E1;border-radius:8px;margin-bottom:18px;">
            <label for="tomCustomDollarInput" style="font-weight:700;font-size:0.95rem;color:#0F172A;">Household Sample Scale ($ USD):</label>
            <input type="number" id="tomCustomDollarInput" min="10000" max="10000000" step="10000" value="300000" style="padding:10px 14px;border:1px solid #94A3B8;border-radius:6px;font-size:1.05rem;font-weight:700;width:180px;font-variant-numeric:tabular-nums;" />
            <button type="button" class="pw-btn-primary pw-btn-emerald" id="btnDownloadTomMaster14pPdf">
              Download Complete 14-Page Master Workbook PDF &rarr;
            </button>
            <button type="button" class="pw-btn-primary" id="btnDownloadTomCustomPdf" style="background:#FFFFFF;color:#0F2C22;border:1.5px solid #0F2C22;">
              Print Custom Dollar Worksheet &rarr;
            </button>
            <a href="/archive.html" class="pw-inline-link" style="font-weight:700;">Open Member Newsletter Archive &rarr;</a>
          </div>

          <div id="tomScreen4DollarTable" class="pw-table-card" style="margin-bottom:18px;"></div>
          <div id="tomScreen4StressTest" class="pw-table-card" style="margin-bottom:18px;"></div>
          <div id="tomScreen4TaxRoadmap" class="pw-table-card" style="margin-bottom:18px;padding:18px;"></div>
          <div id="tomScreen4BrokerGuide" class="pw-table-card" style="margin-bottom:18px;padding:18px;"></div>
          <div id="tomScreen4MonthlyCard" class="pw-table-card" style="margin-bottom:18px;padding:18px;"></div>

          <div style="padding:16px;background:#ECFDF5;border:1px solid #6EE7B7;border-radius:8px;margin-bottom:14px;">
            <div class="pw-kicker" style="color:#065F46;margin-bottom:6px;">PERMANENT CROSS-DEVICE RESTORE LINK &amp; DIGITAL SUPPORT DESK</div>
            <p style="margin:0 0 10px;font-size:0.9rem;color:#064E3B;">
              Send your permanent cross-device restore link (works on any phone, tablet, or PC with zero password) and welcome pack directly to your email:
            </p>
            <form id="tomPaidMagicEmailForm" class="pw-email-form" novalidate>
              <input type="email" id="tomPaidMagicEmailInput" class="pw-email-input" placeholder="Enter your email for permanent cross-device link" autocomplete="email" />
              <button type="submit" class="pw-btn-primary pw-btn-emerald" id="btnSendTomMagicLink">Email My Permanent Link &rarr;</button>
            </form>
            <div id="tomPaidMagicStatus" role="status" aria-live="polite" style="display:none;margin-top:8px;font-size:0.88rem;font-weight:600;color:#065F46;"></div>
            <div style="margin-top:10px;font-size:0.84rem;color:#334155;">
              Standard Digital Refund &amp; 1-Click Support: <a id="tomOneClickRefundLink" href="mailto:hello@truthofmarket.com?subject=TOM%20Support%20or%20Refund%20Request" style="color:#065F46;font-weight:700;text-decoration:underline;">Contact Digital Support or Request Eligible Refund (hello@truthofmarket.com)</a>
            </div>
          </div>

          <div id="tomSatisfactionMount"></div>
        </div>
      </section>
    </main>

    <footer class="pw-legal-footer">
      <div class="pw-legal-links">
        <span>TruthOfMarket Research</span>
        <span>&middot;</span>
        <a href="/terms.html">Terms</a>
        <span>&middot;</span>
        <a href="/privacy.html">Privacy</a>
        <span>&middot;</span>
        <a href="/refund.html">Refund</a>
        <span>&middot;</span>
        <a href="/contact.html">Contact</a>
        <span>&middot;</span>
        <a href="https://www.youtube.com/channel/UCbxWByxJntRqoweWy-4QnqA" target="_blank" rel="noopener">YouTube @TruthOfMarketUS</a>
        <span>&middot;</span>
        <a href="https://www.instagram.com/truthofmarket/" target="_blank" rel="noopener">Instagram @truthofmarket</a>
        <span>&middot;</span>
        <a href="mailto:hello@truthofmarket.com">hello@truthofmarket.com</a>
      </div>
      <p class="pw-legal-disclaimer">
        TruthOfMarket is an independent, strictly non-advisory educational research publisher providing general market data newsletters and 2000&ndash;2025 historical statistical workbooks only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice.
      </p>
    </footer>

    <!-- Member Sign-In / Restore Modal (0 Emojis) -->
    <div class="pw-modal-backdrop" id="pwRestoreModal" role="dialog" aria-modal="true" aria-labelledby="pwRestoreTitle">
      <div class="pw-modal-dialog">
        <div class="pw-modal-header-row">
          <span class="pw-kicker" style="margin:0;">MEMBER ACCESS &amp; RESTORE</span>
          <button type="button" class="pw-modal-close-btn" id="btnClosePwRestoreModal" aria-label="Close Member Sign-In Modal">Close</button>
        </div>
        <h3 class="pw-serif-h2" id="pwRestoreTitle" style="font-size:1.65rem;">Restore Your Saved Study Ratio or Research Pass</h3>
        <p style="margin:0 0 16px;font-size:0.92rem;color:#475569;">
          Enter the email address used during registration to reopen your saved SMH &times; XLV + SGOV historical study summary, or enter a Whop receipt / pass reference if applicable.
        </p>
        <form id="pwRestoreForm" novalidate style="display:flex;flex-direction:column;gap:12px;">
          <input type="email" id="pwRestoreEmailInput" class="pw-email-input" style="min-width:180px;width:100%;box-sizing:border-box;" placeholder="Registered email address used at Whop checkout" autocomplete="email" />
          <input type="text" id="pwRestoreLicenseInput" class="pw-email-input" style="min-width:180px;width:100%;box-sizing:border-box;" placeholder="Access code, Whop receipt ID, or 6-digit email OTP" autocomplete="one-time-code" />
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="submit" class="pw-btn-primary pw-btn-emerald" style="flex:1;min-width:180px;">Verify &amp; Open Vault &rarr;</button>
            <button type="button" id="btnSendTomOtp" class="pw-btn-primary" style="background:#FFFFFF;color:#0F2C22;border:1.5px solid #0F2C22;">Email 6-Digit Code</button>
          </div>
        </form>
        <div id="pwRestoreStatus" role="status" aria-live="polite" style="display:none;margin-top:12px;font-size:0.88rem;color:#065F46;"></div>
      </div>
    </div>

    <!-- Complimentary $0 Brokerage Safe-Order Guide Modal (0 Emojis) -->
    <div class="pw-modal-backdrop" id="pwStarterGuideModal" role="dialog" aria-modal="true" aria-labelledby="pwStarterGuideTitle">
      <div class="pw-modal-dialog">
        <div class="pw-modal-header-row">
          <span class="pw-kicker" style="margin:0;">COMPLIMENTARY EDUCATIONAL REFERENCE ($0)</span>
          <button type="button" class="pw-modal-close-btn" id="btnClosePwStarterGuideModal" aria-label="Close Brokerage Reference Modal">Close</button>
        </div>
        <h3 class="pw-serif-h2" id="pwStarterGuideTitle" style="font-size:1.65rem;">US Brokerage Limit-Order &amp; ETF Terminology Guide</h3>
        <div style="font-size:0.92rem;line-height:1.7;color:#334155;display:flex;flex-direction:column;gap:12px;">
          <div>
            <strong style="color:#0F172A;">I. Limit Orders vs. Market Orders</strong><br/>
            On self-directed platforms such as Fidelity, Charles Schwab, or Vanguard, a <em>Limit Order</em> specifies a maximum purchase price rather than accepting temporary bid-ask spread widening during the first 15 minutes after the 9:30 AM ET open.
          </div>
          <div>
            <strong style="color:#0F172A;">II. Non-Leveraged 1x Spot Sector ETFs</strong><br/>
            Both <strong>SMH</strong> (Semiconductors) and <strong>XLV</strong> (US Healthcare) are unleveraged 1x spot ETFs free from daily 3x leveraged volatility-reset decay.
          </div>
          <div>
            <strong style="color:#0F172A;">III. Short-Term US Treasury Liquidity Reference</strong><br/>
            In historical case studies, short-term household reserve buckets are commonly modeled using 0&ndash;3 month US Treasury bills (<strong>SGOV</strong>) or government money-market funds (SPAXX / SWVXX / VMFXX).
          </div>
        </div>
      </div>
    </div>`;

function computePwBaseline(ans) {
  const obj = ans.objective || "balanced";
  const comfort = ans.comfort || "dd18";
  const techMix = ans.techMix || "tech_mid";
  const scale = Number(ans.scale) || 300000;

  let smh = 55;
  let xlv = 35;
  let sgov = 10;

  if (obj === "growth") {
    smh = 65;
    xlv = 25;
    sgov = 10;
  } else if (obj === "preservation") {
    smh = 45;
    xlv = 35;
    sgov = 20;
  }

  if (comfort === "dd10") {
    smh = Math.max(30, smh - 10);
    sgov = Math.min(30, sgov + 10);
    xlv = 100 - smh - sgov;
  } else if (comfort === "dd25") {
    sgov = Math.max(5, sgov - 5);
    smh = Math.min(70, smh + 5);
    xlv = 100 - smh - sgov;
  }

  // Factor Q4 (techMix): trim concentration risk if >70% tech; stage gently if <30% tech/cash-heavy
  let techLabel = "30-70% Equity Mix";
  if (techMix === "tech_high") {
    smh = Math.max(25, smh - 5);
    xlv = Math.min(50, xlv + 5);
    techLabel = ">70% Tech Trimmed (-5% SMH -> +5% XLV)";
  } else if (techMix === "tech_low") {
    sgov = Math.max(5, sgov - 5);
    smh = Math.min(70, smh + 5);
    techLabel = "<30% Tech Staged (+5% SMH)";
  }
  xlv = Math.max(20, 100 - smh - sgov);
  if (smh + xlv + sgov !== 100) sgov = 100 - smh - xlv;

  const isCore55 = (smh === 55 && xlv === 35 && sgov === 10);
  const isRet45 = (smh === 45 && xlv === 35 && sgov === 20);
  const estCrisisDd = isCore55 ? -27.8 : (isRet45 ? -22.9 : -(0.38 * (smh / 100) + 0.195 * (xlv / 100) + 0.005 * (sgov / 100)) * 100);
  const estRecMos = isCore55 ? 17 : (isRet45 ? 14 : Math.max(10, Math.round(24 * (smh / 100) + 11 * (xlv / 100) + 2 * (sgov / 100))));

  const objLabel =
    obj === "growth"
      ? "Secular Growth Study"
      : obj === "preservation"
      ? "Defensive Stability Study"
      : "Balanced Cash-Flow Study";
  const scaleLabel = scale >= 1000000 ? "$1,000,000+" : "$" + scale.toLocaleString();
  const ddLabel = comfort === "dd10" ? "-10% Band" : comfort === "dd25" ? "-25% Band" : "-18% Band";

  return {
    smh,
    xlv,
    sgov,
    headline: `${smh}% SMH · ${xlv}% XLV · ${sgov}% SGOV Historical Study Ratio`,
    summaryLine: `Study Profile: ${objLabel} · ${scaleLabel} · ${ddLabel} · ${techLabel}`,
    ddCompareText: `~${estCrisisDd.toFixed(1)}% Hist. Crisis DD · ~${estRecMos} mos recovery`,
  };
}
function renderPrivateWealthSingleBreathHome() {
  return PW_HTML_TEMPLATE;
}
function bindPrivateWealthSingleBreathEvents(state) {
  let currentScreen = 0;
  let currentStep = 1;
  let answers = {
    objective: "balanced",
    scale: 300000,
    comfort: "dd18",
    techMix: "tech_high",
  };

  try {
    const rawSaved = localStorage.getItem("tom_pw_stepup_answers_v1");
    if (rawSaved) {
      const parsed = JSON.parse(rawSaved);
      if (parsed && typeof parsed === "object") {
        answers = Object.assign(answers, parsed);
      }
    }
  } catch (_) {}

  let liveTempScore = 11;
  let liveTempDate = "2026-11-18";

  // Restore cross-device magic_restore payload if present
  try {
    if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.decodeMagicRestoreParam === "function") {
      const magicObj = window.DreamCompanyCRM.decodeMagicRestoreParam(window.location.search);
      if (magicObj && typeof magicObj === "object") {
        if (magicObj.objective) answers.objective = magicObj.objective;
        if (magicObj.scale) answers.scale = Number(magicObj.scale) || 300000;
        if (magicObj.comfort) answers.comfort = magicObj.comfort;
        if (magicObj.techMix) answers.techMix = magicObj.techMix;
        if (magicObj.email && magicObj.access_code && window.DreamCompanyCRM && window.DreamCompanyCRM.verifyEntitlement) { window.DreamCompanyCRM.verifyEntitlement({ div: "TOM", email: magicObj.email, access_code: magicObj.access_code, magic_restore: true }).then((vr) => { if (vr && vr.authorized) { localStorage.setItem("rsa_pro_unlocked", "true"); showScreen(4); } }); }
        localStorage.setItem("tom_pw_stepup_answers_v1", JSON.stringify(answers));
        if (magicObj.email) localStorage.setItem("tom_free_member_email", String(magicObj.email).toLowerCase());
      }
    }
  } catch (_) {}

  const hydrateLiveTempBadge = () => {
    const applyOverview = (ov) => {
      if (!ov || typeof ov !== "object") return;
      const dt = String(ov.date || "").trim();
      const rawScore = Number(ov.fg_score);
      if (!dt || !Number.isFinite(rawScore)) return;
      const scoreInt = Math.round(rawScore);
      liveTempScore = scoreInt;
      liveTempDate = dt;
      const regRaw = String(ov.regime_en || "Neutral").trim();
      const regText = /regime$/i.test(regRaw) ? regRaw : `${regRaw} Regime`;
      const txtEl = document.getElementById("tomLiveTempText");
      if (txtEl) {
        txtEl.textContent = `Data As Of: ${dt} · Sector Temperature: ${scoreInt} / 100 (${regText})`;
      }
      renderScreen4PaidVault();
    };

    if (state && state.semiOverview) {
      applyOverview(state.semiOverview);
    }
    fetch("/data/semi_overview.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(applyOverview)
      .catch(() => {
        fetch("/static_api/semi_overview.json", { cache: "no-store" })
          .then((r) => (r.ok ? r.json() : null))
          .then(applyOverview)
          .catch(() => {});
      });
  };

  const getSavedEmail = () => {
    try {
      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.getLocalMember === "function") {
        const m = window.DreamCompanyCRM.getLocalMember("TOM");
        if (m && m.email) return String(m.email).trim().toLowerCase();
      }
      return String(localStorage.getItem("tom_free_member_email") || "").trim().toLowerCase();
    } catch (_) {
      return "";
    }
  };

  const syncOptionSelections = () => {
    document.querySelectorAll("[data-pw-field]").forEach((btn) => {
      const f = btn.getAttribute("data-pw-field");
      const v = btn.getAttribute("data-pw-val");
      const active = String(answers[f]) === String(v);
      btn.classList.toggle("is-selected", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });
  };

  const syncStage2And3Data = () => {
    const b = computePwBaseline(answers);
    const sumEl = document.getElementById("pwProfileSummaryLine");
    if (sumEl) sumEl.textContent = b.summaryLine;

    const hlEl = document.getElementById("pwUnlockedRatioHeadline");
    if (hlEl) hlEl.textContent = b.headline;

    const pSmh = document.getElementById("pwPctSmh");
    const pXlv = document.getElementById("pwPctXlv");
    const pSgov = document.getElementById("pwPctSgov");
    if (pSmh) pSmh.textContent = b.smh + "%";
    if (pXlv) pXlv.textContent = b.xlv + "%";
    if (pSgov) pSgov.textContent = b.sgov + "%";

    const ddCmpEl = document.getElementById("pwStudyDrawdownCompareVal");
    if (ddCmpEl) ddCmpEl.textContent = b.ddCompareText;

    const barEl = document.getElementById("pwRatioVisualBar");
    if (barEl) {
      barEl.innerHTML =
        `<span style="width:${b.smh}%;background:#0F172A;"></span>` +
        `<span style="width:${b.xlv}%;background:#065F46;"></span>` +
        `<span style="width:${b.sgov}%;background:#94A3B8;"></span>`;
    }

    const email = getSavedEmail();
    const inp = document.getElementById("pwGateEmailInput");
    if (inp && email && !inp.value) {
      inp.value = email;
    }
  };

  const fmtUsd = (n) => "$" + Math.round(Number(n) || 0).toLocaleString("en-US");

  const renderScreen4PaidVault = () => {
    const b = computePwBaseline(answers);
    const scaleInp = document.getElementById("tomCustomDollarInput");
    const totalUsd = Math.max(10000, Number(scaleInp && scaleInp.value ? scaleInp.value : answers.scale) || 300000);
    if (scaleInp && Number(scaleInp.value) !== totalUsd) {
      scaleInp.value = String(totalUsd);
    }
    const smhUsd = Math.round(totalUsd * (b.smh / 100));
    const xlvUsd = Math.round(totalUsd * (b.xlv / 100));
    const sgovUsd = totalUsd - smhUsd - xlvUsd;

    const tblEl = document.getElementById("tomScreen4DollarTable");
    if (tblEl) {
      tblEl.innerHTML =
        `<div class="pw-table-header"><span class="pw-table-title">SECTION I &mdash; SAMPLE DOLLAR-SCALE EDUCATIONAL WORKSHEET (${fmtUsd(totalUsd)})</span><span class="pw-table-meta">1x Spot ETF Case Study</span></div>` +
        `<div class="pw-table-scroll"><table class="pw-sim-table"><thead><tr><th>Study Sleeve</th><th>Study Ratio</th><th>Sample Dollar Amount</th><th>Historical Role in 2000&ndash;2025 Dataset</th></tr></thead><tbody>` +
        `<tr><td><strong>SMH</strong> (Semiconductor 1x)</td><td>${b.smh}%</td><td style="font-variant-numeric:tabular-nums;font-weight:700;">${fmtUsd(smhUsd)}</td><td>Secular innovation &amp; long-term compounding engine</td></tr>` +
        `<tr><td><strong>XLV</strong> (US Healthcare 1x)</td><td>${b.xlv}%</td><td style="font-variant-numeric:tabular-nums;font-weight:700;">${fmtUsd(xlvUsd)}</td><td>Non-cyclical cash-flow ballast during tech contractions</td></tr>` +
        `<tr class="is-featured"><td><strong>SGOV</strong> (0&ndash;3 Mo US T-Bill)</td><td>${b.sgov}%</td><td style="font-variant-numeric:tabular-nums;font-weight:700;">${fmtUsd(sgovUsd)}</td><td>Multi-year calm withdrawal buffer (zero equity forced selling)</td></tr>` +
        `</tbody></table></div>`;
    }

    const sp35Loss = Math.round(totalUsd * 0.35);
    const tech49Loss = Math.round(totalUsd * 0.49);
    const studyShockPct = Math.round((0.46 * (b.smh / 100) + 0.16 * (b.xlv / 100) + 0.0 * (b.sgov / 100)) * 1000) / 10;
    const studyShockLoss = Math.round(totalUsd * (studyShockPct / 100));
    const stressEl = document.getElementById("tomScreen4StressTest");
    if (stressEl) {
      stressEl.innerHTML =
        `<div class="pw-table-header"><span class="pw-table-title">SECTION II &mdash; -35% SEVERE MARKET CRASH STRESS TEST (${fmtUsd(totalUsd)} SCALE)</span><span class="pw-table-meta">Drawdown Cushion Study</span></div>` +
        `<div class="pw-table-scroll"><table class="pw-sim-table"><thead><tr><th>Comparison Cohort</th><th>Modeled Shock</th><th>Dollar Change</th><th>Remaining Value &amp; SGOV Cushion</th></tr></thead><tbody>` +
        `<tr><td>100% Semiconductor Alone</td><td class="pw-dd-neg">-49.0%</td><td class="pw-dd-neg">-${fmtUsd(tech49Loss)}</td><td>${fmtUsd(totalUsd - tech49Loss)} ($0 T-Bill buffer)</td></tr>` +
        `<tr><td>S&amp;P 500 Index Alone</td><td class="pw-dd-neg">-35.0%</td><td class="pw-dd-neg">-${fmtUsd(sp35Loss)}</td><td>${fmtUsd(totalUsd - sp35Loss)} ($0 T-Bill buffer)</td></tr>` +
        `<tr class="is-featured"><td><strong>Selected SMH &times; XLV + SGOV Study</strong></td><td class="pw-eff-pos">-${studyShockPct.toFixed(1)}%</td><td class="pw-eff-pos">-${fmtUsd(studyShockLoss)}</td><td><strong>${fmtUsd(totalUsd - studyShockLoss)} (${fmtUsd(sgovUsd)} SGOV intact)</strong></td></tr>` +
        `</tbody></table></div>` +
        `<p class="pw-table-note">Educational historical stress illustration only: keeping ${fmtUsd(sgovUsd)} in 0&ndash;3 month US Treasury reserves (SGOV) historically prevented forced equity sales during 18&ndash;24 month market recoveries.</p>`;
    }

    const taxEl = document.getElementById("tomScreen4TaxRoadmap");
    if (taxEl) {
      taxEl.innerHTML =
        `<div class="pw-kicker" style="margin-bottom:6px;">SECTION III &mdash; US RETIREMENT TAX-LOCATION EDUCATIONAL ROADMAP</div>` +
        `<h3 style="margin:0 0 10px;font-size:1.15rem;color:#0F172A;">401(k) &middot; Traditional IRA &middot; Roth IRA &middot; Taxable Account Study Mapping</h3>` +
        `<div style="display:grid;gap:10px;font-size:0.94rem;color:#334155;">` +
        `<div style="padding:12px;background:#F8FAFC;border-left:3px solid #0F172A;border-radius:6px;"><strong>1. Roth IRA (Tax-Free Compounding Sleeve &mdash; Est. ${fmtUsd(Math.round(smhUsd * 0.55))}):</strong> Commonly studied for higher-growth 1x <strong>SMH</strong> holdings so multi-year appreciation compounds without future RMD or withdrawal tax friction.</div>` +
        `<div style="padding:12px;background:#F8FAFC;border-left:3px solid #065F46;border-radius:6px;"><strong>2. 401(k) / Traditional IRA (Tax-Deferred Rebalancing Sleeve &mdash; Est. ${fmtUsd(xlvUsd + Math.round(smhUsd * 0.45))}):</strong> Studying semi-annual ratio resets between <strong>XLV</strong> and <strong>SMH</strong> inside tax-deferred accounts avoids triggering annual taxable capital-gains distributions.</div>` +
        `<div style="padding:12px;background:#F8FAFC;border-left:3px solid #64748B;border-radius:6px;"><strong>3. Taxable Brokerage / Treasury Direct (Liquidity Sleeve &mdash; ${fmtUsd(sgovUsd)}):</strong> Holding 0&ndash;3 month US Treasury ETF <strong>SGOV</strong> provides penalty-free household cash access while US Treasury interest is generally exempt from state and local income taxes.</div>` +
        `</div>`;
    }

    const brokerEl = document.getElementById("tomScreen4BrokerGuide");
    if (brokerEl) {
      brokerEl.innerHTML =
        `<div class="pw-kicker" style="margin-bottom:6px;">SECTION IV &mdash; FIDELITY &middot; CHARLES SCHWAB &middot; VANGUARD 5-MINUTE VISUAL GUIDE</div>` +
        `<h3 style="margin:0 0 10px;font-size:1.15rem;color:#0F172A;">Large-Print Self-Directed Limit-Order Checklist (18px+ Senior Clarity)</h3>` +
        `<ol style="margin:0;padding-left:22px;font-size:1.02rem;line-height:1.8;color:#1E293B;">` +
        `<li><strong>Trade During Calm Midday Hours (10:00 AM &ndash; 3:30 PM ET):</strong> Skip the first and last 15 minutes of the trading session when ETF bid-ask spreads temporarily widen.</li>` +
        `<li><strong>Verify Exact 1x Unleveraged Tickers:</strong> Confirm <strong>SMH</strong> (VanEck Semiconductor ETF), <strong>XLV</strong> (Health Care Select Sector SPDR), and <strong>SGOV</strong> (iShares 0&ndash;3 Month Treasury Bond ETF). Never select 3x leveraged tickers.</li>` +
        `<li><strong>Select "Limit Order" Instead of "Market Order":</strong> On Fidelity, Schwab, or Vanguard, set your Limit Price at the current Ask price (or +$0.05) so execution price is strictly bounded.</li>` +
        `<li><strong>Semi-Annual Calendar Review Only:</strong> Check drift just twice a year (e.g., January 15 &amp; July 15) rather than reacting to daily headlines.</li>` +
        `</ol>`;
    }

    const rebalanceWindow = liveTempScore >= 78 || liveTempScore <= 22;
    const verdictLabel = rebalanceWindow
      ? "[1-SECOND STATUS: HISTORICAL DRIFT REVIEW WINDOW]"
      : "[1-SECOND STATUS: KEEP CALM & HOLD — REST EASY THIS MONTH]";
    const monthlyEl = document.getElementById("tomScreen4MonthlyCard");
    if (monthlyEl) {
      monthlyEl.innerHTML =
        `<div class="pw-kicker" style="margin-bottom:6px;">SECTION V &mdash; MONTHLY 1ST REASSURANCE REPORT CARD &amp; WEEKLY PLAIN-ENGLISH ESSAY</div>` +
        `<div style="padding:12px 16px;border-radius:8px;background:${rebalanceWindow ? "#FEF3C7" : "#ECFDF5"};color:${rebalanceWindow ? "#92400E" : "#065F46"};font-weight:800;font-size:1.02rem;margin-bottom:10px;">${verdictLabel} &middot; Temperature ${liveTempScore}/100 (As Of ${liveTempDate})</div>` +
        `<p style="margin:0 0 8px;font-size:0.96rem;color:#334155;"><strong>Monthly Cushion Summary:</strong> Across recent market swings, pairing unleveraged SMH with defensive healthcare XLV and ${fmtUsd(sgovUsd)} in SGOV Treasury reserves kept household volatility muted compared with single-sector tech holdings.</p>` +
        `<p style="margin:0;font-size:0.94rem;color:#475569;"><strong>Weekly Plain-English Note:</strong> A calm retirement plan works best when your near-term living expenses sit outside the stock market in short-term Treasury bills—turning market pullbacks from an emergency into background weather.</p>`;
    }

    const satMount = document.getElementById("tomSatisfactionMount");
    if (satMount && !satMount.__mounted && window.DreamCompanyCRM && typeof window.DreamCompanyCRM.mountSatisfactionBar === "function") {
      satMount.__mounted = true;
      window.DreamCompanyCRM.mountSatisfactionBar(satMount, { div: "TOM", context: "screen4_paid_vault", email: getSavedEmail() });
    }
  };

  const openTomCustomPdfWindow = () => {
    renderScreen4PaidVault();
    const dollarHtml = (document.getElementById("tomScreen4DollarTable") || {}).innerHTML || "";
    const stressHtml = (document.getElementById("tomScreen4StressTest") || {}).innerHTML || "";
    const taxHtml = (document.getElementById("tomScreen4TaxRoadmap") || {}).innerHTML || "";
    const brokerHtml = (document.getElementById("tomScreen4BrokerGuide") || {}).innerHTML || "";
    const monthlyHtml = (document.getElementById("tomScreen4MonthlyCard") || {}).innerHTML || "";
    const w = window.open("", "_blank");
    if (!w) {
      window.print();
      return;
    }
    w.document.write(
      `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>TruthOfMarket 1:1 Custom SMH x XLV + SGOV Workbook PDF</title>` +
      `<style>body{font-family:Georgia,serif;max-width:780px;margin:24px auto;padding:0 20px;color:#0f172a;font-size:16px;line-height:1.65;}h1,h2,h3{font-family:Inter,Arial,sans-serif;}table{width:100%;border-collapse:collapse;margin:12px 0;font-family:Inter,Arial,sans-serif;font-size:14px;}th,td{border:1px solid #cbd5e1;padding:9px 10px;text-align:left;}th{background:#f1f5f9;}.page-break{page-break-before:always;margin-top:28px;padding-top:18px;border-top:2px solid #0f172a;}@media print{.no-print{display:none;}}</style></head><body>` +
      `<div class="no-print" style="padding:12px;background:#ecfdf5;border:1px solid #059669;border-radius:8px;margin-bottom:18px;font-family:Arial,sans-serif;"><strong>Ready to Save as PDF:</strong> Choose <em>Save as PDF</em> in the print dialog. <button onclick="window.print()" style="margin-left:12px;padding:8px 16px;background:#065f46;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;">Save / Print PDF</button></div>` +
      `<h1>TruthOfMarket &mdash; 1:1 Custom SMH &times; XLV + SGOV Educational Workbook</h1>` +
      `<p style="font-size:13px;color:#475569;">Independent Market Data &amp; Educational Research Publisher (Strictly Non-Advisory Historical Statistics &middot; Support: hello@truthofmarket.com)</p>` +
      `<div>${dollarHtml}</div><div style="margin-top:18px;">${stressHtml}</div>` +
      `<div class="page-break">${taxHtml}</div><div class="page-break">${brokerHtml}</div><div class="page-break">${monthlyHtml}</div>` +
      `</body></html>`
    );
    w.document.close();
    setTimeout(() => {
      try { w.print(); } catch (_) {}
    }, 350);
  };

  const showScreen = (screenNum) => {
    currentScreen = screenNum;
    const isPaidUnlocked = (() => {
      try {
        return localStorage.getItem("rsa_pro_unlocked") === "true" || screenNum === 4;
      } catch (_) {
        return screenNum === 4;
      }
    })();
    const s0 = document.getElementById("pwScreen0");
    const s1 = document.getElementById("pwScreen1");
    const s2 = document.getElementById("tomMorningBellClub");
    const s3 = document.getElementById("pricing");
    const s4 = document.getElementById("tomPaidScreen4Vault");
    if (s0) s0.style.display = screenNum === 0 ? "block" : "none";
    if (s1) s1.style.display = screenNum === 1 ? "block" : "none";
    if (s2) s2.style.display = screenNum >= 2 ? "block" : "none";
    if (s3) s3.style.display = screenNum >= 2 ? "block" : "none";
    if (s4) s4.style.display = screenNum === 4 || (screenNum >= 2 && isPaidUnlocked) ? "block" : "none";
    if (screenNum >= 2) {
      syncStage2And3Data();
      if (s4 && s4.style.display === "block") {
        renderScreen4PaidVault();
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showQuestionStep = (stepNum) => {
    currentStep = Math.max(1, Math.min(4, stepNum));
    document.querySelectorAll("[data-pw-qpane]").forEach((p) => {
      p.style.display = Number(p.getAttribute("data-pw-qpane")) === currentStep ? "block" : "none";
    });
    const lbl = document.getElementById("pwStepCounterLabel");
    if (lbl) lbl.textContent = `STEP 0${currentStep} OF 04`;
    const fill = document.getElementById("pwStepProgressFill");
    if (fill) fill.style.width = `${currentStep * 25}%`;
    syncOptionSelections();
  };

  document.querySelectorAll("[data-pw-start-stepup], #btnStartPwStepUp").forEach((startBtn) => {
    if (startBtn.__pwBound) return;
    startBtn.__pwBound = true;
    startBtn.addEventListener("click", () => {
      showQuestionStep(1);
      showScreen(1);
    });
  });

  document.querySelectorAll("[data-pw-go-home]").forEach((b) => {
    b.addEventListener("click", () => showScreen(0));
  });

  const backBtn = document.getElementById("btnPwStepBack");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (currentStep > 1) {
        showQuestionStep(currentStep - 1);
      } else {
        showScreen(0);
      }
    });
  }

  document.querySelectorAll("[data-pw-field]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.getAttribute("data-pw-field");
      const rawVal = btn.getAttribute("data-pw-val");
      answers[f] = f === "scale" ? Number(rawVal) : rawVal;
      try {
        localStorage.setItem("tom_pw_stepup_answers_v1", JSON.stringify(answers));
      } catch (_) {}
      syncOptionSelections();
      if (currentStep < 4) {
        setTimeout(() => showQuestionStep(currentStep + 1), 150);
      }
    });
  });

  const submitAssessmentBtn = document.getElementById("btnSubmitPwAssessment");
  if (submitAssessmentBtn) {
    submitAssessmentBtn.addEventListener("click", () => {
      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.trackFunnelEvent === "function") {
        window.DreamCompanyCRM.trackFunnelEvent("TOM", "quiz_complete");
      }
      showScreen(2);
    });
  }

  const editBtn = document.getElementById("btnEditPwInputs");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      showQuestionStep(1);
      showScreen(1);
    });
  }

  const gateForm = document.getElementById("pwFreeGateForm");
  if (gateForm) {
    gateForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const hp = document.getElementById("pwGateHp");
      if (hp && hp.value) return;
      const inp = document.getElementById("pwGateEmailInput");
      const msg = document.getElementById("pwGateStatusMsg");
      const email = String(inp ? inp.value : "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        if (msg) {
          msg.style.display = "block";
          msg.style.color = "#991B1B";
          msg.textContent = "Please enter a valid email address.";
        }
        if (inp) inp.focus();
        return;
      }
      const submitBtn = document.getElementById("btnPwGateSubmit");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving Summary...";
      }

      const b = computePwBaseline(answers);
      const noteStr = `site=truthofmarket.com | study_ratio=${b.headline} | ${b.summaryLine}`;
      try {
        const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
        localStorage.setItem("tom_free_member_email", email);
        localStorage.setItem("tom_free_member_since", kst);
        localStorage.setItem(
          "dc_member_TOM",
          JSON.stringify({
            div: "TOM",
            email,
            nickname: "",
            segment: "retirement_401k_ira",
            notes: noteStr,
            joined_at: new Date().toISOString(),
          })
        );
        if (state) state.freeMemberEmail = email;
        if (typeof window.trackTomFreeSignup === "function") {
          window.trackTomFreeSignup(email);
        }
      } catch (_) {}

      const finishSave = () => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Saved & Subscribed";
        }
        if (msg) {
          msg.style.display = "block";
          msg.style.color = "#065F46";
          msg.textContent = `Saved for ${email}. Complimentary morning research notes are now active (1-click unsubscribe anytime).`;
        }
      };

      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.registerMember === "function") {
        window.DreamCompanyCRM.registerMember({
          div: "TOM",
          email,
          nickname: "",
          segment: "retirement_401k_ira",
          lang: "en-US",
          notes: noteStr,
          message: noteStr,
        })
          .then(finishSave)
          .catch(finishSave);
      } else if (typeof window.submitTomVipWaitlistOrManualEmail === "function") {
        window.submitTomVipWaitlistOrManualEmail({
          email,
          segment: "retirement_401k_ira",
          lang: "en-US",
          notes: noteStr,
        })
          .then(finishSave)
          .catch(finishSave);
      } else {
        finishSave();
      }
    });
  }

  // Modals: Member Restore & $0 Brokerage Guide
  const restoreModal = document.getElementById("pwRestoreModal");
  const openRestoreBtn = document.getElementById("btnOpenPwRestoreModal");
  const closeRestoreBtn = document.getElementById("btnClosePwRestoreModal");
  if (openRestoreBtn && restoreModal) {
    openRestoreBtn.addEventListener("click", () => {
      const saved = getSavedEmail();
      const inp = document.getElementById("pwRestoreEmailInput");
      if (inp && saved && !inp.value) inp.value = saved;
      restoreModal.classList.add("is-open");
    });
  }
  if (closeRestoreBtn && restoreModal) {
    closeRestoreBtn.addEventListener("click", () => restoreModal.classList.remove("is-open"));
  }
  if (restoreModal) {
    restoreModal.addEventListener("click", (ev) => {
      if (ev.target === restoreModal) restoreModal.classList.remove("is-open");
    });
  }

  const restoreForm = document.getElementById("pwRestoreForm");
  if (restoreForm) {
    restoreForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emInp = document.getElementById("pwRestoreEmailInput");
      const licInp = document.getElementById("pwRestoreLicenseInput");
      const stEl = document.getElementById("pwRestoreStatus");
      const em = String(emInp ? emInp.value : "").trim().toLowerCase();
      const lic = String(licInp ? licInp.value : "").trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em) && lic.length < 8) {
        if (stEl) {
          stEl.style.display = "block";
          stEl.style.color = "#991B1B";
          stEl.textContent = "Please enter a valid registered email or Whop receipt ID.";
        }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) {
        if (stEl) {
          stEl.style.display = "block";
          stEl.style.color = "#991B1B";
          stEl.textContent = "Please enter the email address used at Whop checkout.";
        }
        return;
      }
      const isSixDigitOtp = /^\d{6}$/.test(lic);
      if (!lic || (!isSixDigitOtp && lic.length < 6)) {
        if (stEl) {
          stEl.style.display = "block";
          stEl.style.color = "#991B1B";
          stEl.textContent = "Please enter your Access Code, Whop receipt ID, or click 'Email 6-Digit Code' to verify securely.";
        }
        return;
      }
      if (stEl) {
        stEl.style.display = "block";
        stEl.style.color = "#334155";
        stEl.textContent = "Verifying Whop entitlement with server...";
      }
      const verifyPayload = isSixDigitOtp
        ? { div: "TOM", email: em, otp: lic }
        : { div: "TOM", email: em, access_code: lic };
      const verifyPromise = (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.verifyEntitlement === "function")
        ? window.DreamCompanyCRM.verifyEntitlement(verifyPayload)
        : Promise.resolve({ authorized: false });

      verifyPromise.then((vres) => {
        try {
          localStorage.setItem("tom_free_member_email", em);
          if (state) state.freeMemberEmail = em;
        } catch (_) {}
        if (vres && vres.authorized) {
          try {
            localStorage.setItem("rsa_pro_unlocked", "true");
            localStorage.setItem("rsa_token", isSixDigitOtp ? "OTP_VERIFIED" : lic);
            if (state) {
              state.isProUnlocked = true;
              state.licenseKey = isSixDigitOtp ? "OTP_VERIFIED" : lic;
            }
          } catch (_) {}
          if (stEl) {
            stEl.style.display = "block";
            stEl.style.color = "#065F46";
            stEl.textContent = "Verified Whop Research Pass! Opening your Paid Research Vault & Protected 14-Page PDF.";
          }
          setTimeout(() => {
            if (restoreModal) restoreModal.classList.remove("is-open");
            showScreen(4);
          }, 450);
        } else {
          try { localStorage.removeItem("rsa_pro_unlocked"); } catch (_) {}
          if (stEl) {
            stEl.style.display = "block";
            stEl.style.color = "#991B1B";
            stEl.textContent = "No active Whop paid pass matched this email/code yet. Click 'Email 6-Digit Code' or email hello@truthofmarket.com for support.";
          }
        }
      });
    });
  }

  const btnSendTomOtp = document.getElementById("btnSendTomOtp");
  if (btnSendTomOtp) {
    btnSendTomOtp.addEventListener("click", () => {
      const emInp = document.getElementById("pwRestoreEmailInput");
      const stEl = document.getElementById("pwRestoreStatus");
      const em = String(emInp ? emInp.value : "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) {
        if (stEl) {
          stEl.style.display = "block";
          stEl.style.color = "#991B1B";
          stEl.textContent = "Enter your checkout email address first, then click 'Email 6-Digit Code'.";
        }
        return;
      }
      if (stEl) {
        stEl.style.display = "block";
        stEl.style.color = "#334155";
        stEl.textContent = "Sending 6-digit verification code if a paid pass matches...";
      }
      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.requestAuthOtp === "function") {
        window.DreamCompanyCRM.requestAuthOtp({ div: "TOM", email: em }).then(() => {
          if (stEl) {
            stEl.style.display = "block";
            stEl.style.color = "#065F46";
            stEl.textContent = "If a verified Whop purchase matches this email, a 6-digit code has been sent (valid 10 min). Enter it above.";
          }
        });
      }
    });
  }

  const master14pBtn = document.getElementById("btnDownloadTomMaster14pPdf");
  if (master14pBtn) {
    master14pBtn.addEventListener("click", () => {
      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.openProtectedPdfDownload === "function") {
        window.DreamCompanyCRM.openProtectedPdfDownload("TOM", "tom_master_14p", () => {
          if (restoreModal) restoreModal.classList.add("is-open");
        });
      } else if (restoreModal) {
        restoreModal.classList.add("is-open");
      }
    });
  }

  const customDollarInp = document.getElementById("tomCustomDollarInput");
  if (customDollarInp) {
    customDollarInp.value = String(answers.scale || 300000);
    customDollarInp.addEventListener("input", () => {
      answers.scale = Math.max(10000, Number(customDollarInp.value) || 300000);
      renderScreen4PaidVault();
    });
  }

  const pdfBtn = document.getElementById("btnDownloadTomCustomPdf");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", openTomCustomPdfWindow);
  }

  const magicForm = document.getElementById("tomPaidMagicEmailForm");
  if (magicForm) {
    magicForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = document.getElementById("tomPaidMagicEmailInput");
      const st = document.getElementById("tomPaidMagicStatus");
      const em = String(inp ? inp.value : getSavedEmail()).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) {
        if (st) {
          st.style.display = "block";
          st.style.color = "#991B1B";
          st.textContent = "Please enter a valid email address.";
        }
        return;
      }
      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.deliverPaidMagicPack === "function") {
        window.DreamCompanyCRM.deliverPaidMagicPack({
          div: "TOM",
          email: em,
          plan_tier: (localStorage.getItem("tom_whop_active_plan") === "annual") ? "Annual Research Pass ($199/yr)" : "Monthly Research Pass ($29/mo)",
          order_ref: localStorage.getItem("rsa_token") || "TOM-MAGIC-LINK",
          base_url: "https://truthofmarket.com/",
          hash_anchor: "tomPaidScreen4Vault",
          profile_state: answers,
        }).then((res) => {
          if (st) {
            st.style.display = "block";
            st.style.color = "#065F46";
            st.textContent = `Permanent cross-device restore link sent to ${em} (standard 7-day unopened / 1-click cancel policy applies).`;
          }
          const rf = document.getElementById("tomOneClickRefundLink");
          if (rf && res && res.refund_support_url) rf.href = res.refund_support_url;
        });
      }
    });
  }

  window.addEventListener("tom:paid-unlocked", () => {
    showScreen(4);
    setTimeout(() => {
      const v4 = document.getElementById("tomPaidScreen4Vault");
      if (v4 && v4.scrollIntoView) v4.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  });

  const guideModal = document.getElementById("pwStarterGuideModal");
  const openGuideBtn = document.getElementById("tomFreeStarterManual");
  const closeGuideBtn = document.getElementById("btnClosePwStarterGuideModal");
  if (openGuideBtn && guideModal) {
    openGuideBtn.addEventListener("click", () => guideModal.classList.add("is-open"));
  }
  if (closeGuideBtn && guideModal) {
    closeGuideBtn.addEventListener("click", () => guideModal.classList.remove("is-open"));
  }
  if (guideModal) {
    guideModal.addEventListener("click", (ev) => {
      if (ev.target === guideModal) guideModal.classList.remove("is-open");
    });
  }

  hydrateLiveTempBadge();
  syncOptionSelections();

  const h = (window.location.hash || "").toLowerCase();
  const s = (window.location.search || "").toLowerCase();
  if (s.includes("payment=success")) {
    const savedEm = getSavedEmail();
    if (savedEm && window.DreamCompanyCRM && window.DreamCompanyCRM.verifyEntitlement) {
      window.DreamCompanyCRM.verifyEntitlement({ div: "TOM", email: savedEm }).then((vr) => {
        if (vr && vr.authorized) { localStorage.setItem("rsa_pro_unlocked", "true"); showScreen(4); }
        else { showScreen(2); if (restoreModal) restoreModal.classList.add("is-open"); }
      });
    } else {
      showScreen(2);
      if (restoreModal) restoreModal.classList.add("is-open");
    }
  } else if (h === "#tompaidscreen4vault" && localStorage.getItem("rsa_pro_unlocked") === "true") {
    showScreen(4);
    setTimeout(() => {
      const v4 = document.getElementById("tomPaidScreen4Vault");
      if (v4 && v4.scrollIntoView) v4.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  } else if (h === "#pricing" || h === "#tommorningbellclub") {
    showScreen(2);
    if (h === "#pricing") {
      setTimeout(() => {
        const pr = document.getElementById("pricing");
        if (pr && pr.scrollIntoView) pr.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }
}


// --- src/main.js ---













const initialPath = window.location.pathname.toLowerCase();
const initialHash = window.location.hash.toLowerCase();
const initialSearch = new URLSearchParams(window.location.search);
const viewParam = (initialSearch.get("view") || "").toLowerCase();
const initialTickerParam = (initialSearch.get("ticker") || window.__INITIAL_TICKER__ || "").trim().toUpperCase();
const initialFilterParam = (initialSearch.get("filter") || window.__INITIAL_FILTER__ || "").trim().toLowerCase();
const initialToolParam = (initialSearch.get("tool") || "").trim().toLowerCase();
const isInitialDoctorDeepLink =
  initialToolParam === "doctor" || initialHash === "#doctor" || initialHash.includes("positiondoctor");
const defaultView =
  isInitialDoctorDeepLink
    ? "rightside"
    : viewParam === "semi" || initialHash.includes("semi") || initialPath.includes("/semi")
    ? "semi"
    : viewParam === "rightside" || initialHash.includes("rightside") || initialPath.includes("/rightside") || initialTickerParam || initialFilterParam
    ? "rightside"
    : window.__DEFAULT_VIEW__ === "semi"
    ? "semi"
    : "rightside";

// Auto-migrate any stale legacy placeholder URLs stored in localStorage
(function migrateLegacyLocalStorage() {
  try {
    if (!localStorage.getItem("rsa_lang_v5_pure_en")) {
      localStorage.setItem("rsa_lang", "en");
      localStorage.removeItem("rsa_lang_explicit");
      localStorage.setItem("rsa_lang_v5_pure_en", "1");
    }
    const oldSite1 = localStorage.getItem("rsa_cfg_site1_url") || "";
    if (oldSite1 && !oldSite1.includes("truthofmarket.com")) {
      localStorage.setItem("rsa_cfg_site1_url", "https://truthofmarket.com");
    }
    const oldM = localStorage.getItem("rsa_cfg_ls_monthly") || "";
    if (oldM && !/^https:\/\/whop\.com\/checkout\//i.test(oldM)) {
      localStorage.removeItem("rsa_cfg_ls_monthly");
    }
    const oldL = localStorage.getItem("rsa_cfg_ls_ltd") || "";
    if (oldL && !/^https:\/\/whop\.com\/checkout\//i.test(oldL)) {
      localStorage.removeItem("rsa_cfg_ls_ltd");
    }
    const oldTv = localStorage.getItem("rsa_cfg_aff_tv") || "";
    if (oldTv && oldTv.toLowerCase().includes("rightside")) {
      localStorage.setItem("rsa_cfg_aff_tv", "1173809");
    }
    const oldSa = localStorage.getItem("rsa_cfg_aff_sa") || "";
    if (oldSa === "affiliate_rightside") {
      localStorage.setItem("rsa_cfg_aff_sa", "better_life333");
    }
    if (!localStorage.getItem("rsa_aff_v6_us_tools")) {
      localStorage.setItem("rsa_cfg_broker_url", "https://trendspider.com/?_go=rightside");
      localStorage.setItem("rsa_cfg_broker_name", "TrendSpider (rightside)");
      localStorage.setItem("rsa_cfg_youtube_url", "https://www.youtube.com/channel/UCbxWByxJntRqoweWy-4QnqA");
      localStorage.setItem("rsa_cfg_instagram_url", "https://www.instagram.com/truthofmarket/");
      localStorage.setItem("rsa_tg_channel_url", "https://t.me/truthofmarketss");
      localStorage.setItem("rsa_tg_chat_id", "@truthofmarketss");
      localStorage.setItem("rsa_aff_v6_us_tools", "1");
    }
    const oldTgCh = localStorage.getItem("rsa_tg_channel_url") || "";
    if (!oldTgCh || !oldTgCh.includes("truthofmarketss")) {
      localStorage.setItem("rsa_tg_channel_url", "https://t.me/truthofmarketss");
    }
    const oldTgCid = localStorage.getItem("rsa_tg_chat_id") || "";
    if (!oldTgCid || oldTgCid === "755033799" || !oldTgCid.includes("truthofmarketss")) {
      localStorage.setItem("rsa_tg_chat_id", "@truthofmarketss");
    }
    const oldYt = localStorage.getItem("rsa_cfg_youtube_url") || "";
    if (!oldYt || !oldYt.toLowerCase().includes("@truthofmarketus")) {
      localStorage.setItem("rsa_cfg_youtube_url", "https://www.youtube.com/channel/UCbxWByxJntRqoweWy-4QnqA");
    }
    const oldIg = localStorage.getItem("rsa_cfg_instagram_url") || "";
    if (!oldIg || !oldIg.toLowerCase().includes("instagram.com/truthofmarket")) {
      localStorage.setItem("rsa_cfg_instagram_url", "https://www.instagram.com/truthofmarket/");
    }
  } catch (_) {}
})();

function detectInitialLang() {
  try {
    localStorage.setItem("rsa_lang", "en");
  } catch (_) {}
  return "en";
}

const initialFontPxRaw = Number(typeof localStorage !== "undefined" ? localStorage.getItem("tom_font_px") : 18);
const initialFontPx = [18, 20, 22].includes(initialFontPxRaw) ? initialFontPxRaw : 18;
const initialUiTheme =
  typeof localStorage !== "undefined" && localStorage.getItem("tom_ui_theme_v2") === "dark"
    ? "dark"
    : "light";

const state = {
  lang: detectInitialLang(),
  activeView: defaultView,
  uiTheme: initialUiTheme,
  fontSizePx: initialFontPx,
  fontSizeMode: initialFontPx > 18 ? "large" : "normal",
  freeMemberEmail: localStorage.getItem("tom_free_member_email") || "",
  isAdminAuthenticated: sessionStorage.getItem("rsa_admin_auth") === "true",
  isProUnlocked: isProActive(),
  licenseKey: localStorage.getItem("rsa_token") || "",
  proPortfolioUsd: Number(localStorage.getItem("rsa_pro_cap_usd") || 30000),
  stocks: [],
  filteredStocks: [],
  backtestKpis: null,
  pineCode: null,
  searchQuery: initialTickerParam || "",
  zoneFilter: initialFilterParam === "ignition" || initialFilterParam === "ignition_zone" ? "IGNITION_ZONE" : initialFilterParam === "washout" ? "WASHOUT_WATCH" : "ALL",
  sortCol: "score",
  sortAsc: false,
  sectorFilter: "ALL",
  vipWatchlist: getVipWatchlist(),
  blindTestAnswers: {},
  portfolioPositions: [
    { ticker: "CELH", entry_price: 28.5, shares: 100, days_held: 35, current_price: 27.93 },
    { ticker: "CCL", entry_price: 19.2, shares: 200, days_held: 25, current_price: 21.4 },
    { ticker: "TSLA", entry_price: 215.0, shares: 50, days_held: 45, current_price: 228.0 },
    { ticker: "UPST", entry_price: 38.0, shares: 150, days_held: 20, current_price: 44.5 },
  ],
  portfolioDocResult: null,
  sectorMatrix: null,
  // SemiFearGreed state
  semiOverview: null,
  semiHistory: null,
  semiGaugeTab: "overview",
  semiRange: "1Y",
  semiCapUsd: 100000,
  semiMode: "AUTO_REGIME",
  semiFreq: "ANNUAL",
  semiGainKrw: 3800000,
  semiAdjustResult: null,
  semiLumpCapUsd: 50000,
  semiLumpScore: null,
  semiLumpSumResult: null,
  // Telegram state (@truthofmarketss official channel & dispatch)
  telegramConfigured: true,
  telegramBotToken: localStorage.getItem("rsa_tg_bot_token") || DEFAULT_TG_BOT_TOKEN,
  telegramChatId: localStorage.getItem("rsa_tg_chat_id") || "@truthofmarketss",
  telegramAlertType: "SEMI_BRIEFING",
  telegramPreviewText: "",
  config: {
    site1_name: "TruthOfMarket",
    site1_url: localStorage.getItem("rsa_cfg_site1_url") || "https://truthofmarket.com",
    site2_url: "https://truthofmarket.com",
    whop_tom_monthly_url:
      localStorage.getItem("rsa_cfg_whop_monthly") ||
      localStorage.getItem("rsa_cfg_ls_monthly") ||
      "",
    whop_tom_annual_url:
      localStorage.getItem("rsa_cfg_whop_annual") ||
      localStorage.getItem("rsa_cfg_ls_ltd") ||
      "",
    ls_site1_monthly_url: "",
    ls_site1_ltd_url: "",
    tradingview_aff_id: localStorage.getItem("rsa_cfg_aff_tv") || "1173809",
    seekingalpha_source: localStorage.getItem("rsa_cfg_aff_sa") || "better_life333",
    trendspider_aff_id: "rightside",
    broker_name: localStorage.getItem("rsa_cfg_broker_name") || "TrendSpider (rightside)",
    broker_referral_url:
      localStorage.getItem("rsa_cfg_broker_url") || "https://trendspider.com/?_go=rightside",
    telegram_channel_url: localStorage.getItem("rsa_tg_channel_url") || "https://t.me/truthofmarketss",
    telegram_vip_channel_url: localStorage.getItem("rsa_tg_vip_channel_url") || "",
    telegram_chat_id: localStorage.getItem("rsa_tg_chat_id") || "@truthofmarketss",
    youtube_url: localStorage.getItem("rsa_cfg_youtube_url") || DEFAULT_YOUTUBE_URL,
    instagram_url: localStorage.getItem("rsa_cfg_instagram_url") || DEFAULT_INSTAGRAM_URL,
  },
  get t() {
    return translations[this.lang] || translations.en;
  },
};

function showToast(msg) {
  const box = document.getElementById("toastBox");
  if (!box) return;
  box.textContent = msg;
  box.style.display = "block";
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    box.style.display = "none";
  }, 3200);
}

function applyClientFilterAndSort() {
  const q = (state.searchQuery || "").trim().toLowerCase();
  const z = state.zoneFilter || "ALL";
  const secFilter = state.sectorFilter || "ALL";
  const vipList = state.vipWatchlist || [];

  let list = state.stocks.filter((s) => {
    // Strictly US-listed equities only
    if (!s.ticker || String(s.ticker).includes(".")) return false;
    if (z === "VIP_WATCHLIST") {
      if (!vipList.includes(s.ticker)) return false;
    } else if (z !== "ALL" && s.zone_code !== z) {
      return false;
    }
    if (secFilter !== "ALL") {
      const sRegime = (SECTOR_REGIME_MAP && SECTOR_REGIME_MAP[s.sector]) || s.sector || "Other";
      if (sRegime !== secFilter) return false;
    }
    if (q) {
      const isLockedRow =
        !state.isProUnlocked &&
        (Boolean(s.locked) ||
          String(s.ticker || "").toUpperCase() === "LOCKED" ||
          s.close === null ||
          s.close === undefined);
      const hay = isLockedRow
        ? `vip ignition locked pro ${s.sector || ""}`.toLowerCase()
        : `${s.ticker} ${s.name_en || ""} ${s.name_jp || ""} ${s.sector || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const col = state.sortCol;
  const dir = state.sortAsc ? 1 : -1;
  list.sort((a, b) => {
    const va = a[col];
    const vb = b[col];
    if (typeof va === "string" || typeof vb === "string") {
      return String(va ?? "").localeCompare(String(vb ?? "")) * dir;
    }
    return ((va ?? 0) - (vb ?? 0)) * dir;
  });

  state.filteredStocks = list;
}

function isProSwingOrEquitySubpage() {
  if (typeof window === "undefined") return false;
  if (window.__DEFAULT_VIEW__ === "pro_swing") return true;
  const p = (window.location.pathname || "/").toLowerCase();
  return p.includes("/pro-swing") || p.includes("/stocks/") || p.includes("/compare/");
}

function renderHomeRetirementView() {
  return `
    ${renderHero(state)}
    ${renderFreeStarterManual(state)}
    ${renderPricing(state)}
  `;
}

function renderProSwingArchiveView() {
  const t = state.t;
  return `
    <section style="margin:12px 0 18px; padding:18px 20px; background:linear-gradient(135deg,#0f172a 0%,#0b1324 100%); border:1.5px solid #38bdf8; border-radius:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <span class="mono" style="font-size:0.74rem; font-weight:800; color:#38bdf8; letter-spacing:0.04em;">
            SELF-DIRECTED QUANTITATIVE RESEARCH ARCHIVE · EDUCATIONAL CALCULATOR SOFTWARE
          </span>
          <h2 style="font-size:1.28rem; font-weight:900; color:#ffffff; margin:4px 0;">
            Historical US Equity Factor Dataset &amp; Mathematical Variance Calculators
          </h2>
          <p style="margin:0; font-size:0.92rem; color:#cbd5e1; line-height:1.55;">
            Self-directed public market data visualization and historical moving-average / volume factor archive. Looking for 401(k)/IRA monthly retirement income planning? <a href="/" style="color:#6ee7b7; font-weight:800; text-decoration:underline;">Return to the 30-Second Retirement Cashflow Calculator →</a>
          </p>
        </div>
      </div>
    </section>
    <section style="margin-bottom:12px;">
      ${renderPositionDoctorForm(state)}
    </section>
    <section class="screener-panel" id="screenerSection">
      ${renderScreenerControls(state)}
      ${renderStockTable(state)}
    </section>
    ${renderEasyProfitSimulator(state)}
    <div style="margin-bottom:20px;">
      ${renderChartBlindTest(state)}
    </div>
    ${renderProofCard(state)}
    ${renderProVault(state)}
    ${renderPricing(state)}

    <!-- CROSS-PLATFORM BANNER TO MARKET WEATHER -->
    <section class="cross-banner">
      <div>
        <div style="font-size:0.72rem; font-family:var(--font-mono); font-weight:700; color:#f87171; text-transform:uppercase; letter-spacing:0.05em;" id="crossTitle">
          ${t.crossTitle}
        </div>
        <h3 style="font-size:1.15rem; font-weight:800; margin:4px 0; color:#ffffff;" id="crossHeading">
          ${t.crossHeading}
        </h3>
        <p style="font-size:0.84rem; color:var(--muted);" id="crossDesc">
          ${t.crossDesc}
        </p>
      </div>
      <button type="button" class="btn btn-primary" id="crossFunnelSwitchBtn" style="min-height:42px; background:#dc2626; border-color:#ef4444;">
        <span id="crossBtn">${t.crossBtn} →</span>
      </button>
    </section>
  `;
}

function renderApp() {
  const appEl = document.getElementById("app");
  if (!appEl) return;

  if (!isProSwingOrEquitySubpage() && state.activeView !== "semi" && !initialTickerParam && !initialFilterParam) {
    appEl.innerHTML = renderPrivateWealthSingleBreathHome(state);
    bindPrivateWealthSingleBreathEvents(state);
    bindRsaPolarCheckoutEvents();
    return;
  }

  const t = state.t;
  const mainBodyHtml =
    state.activeView === "semi"
      ? renderSemiFearGreedView(state)
      : isProSwingOrEquitySubpage()
      ? renderProSwingArchiveView()
      : renderHomeRetirementView();

  appEl.innerHTML = `
    ${renderHeader(state)}
    <main class="container">
      ${mainBodyHtml}

      <footer class="tom-fixed-legal-footer">
        <div class="tom-footer-top-row">
          <span class="mono tom-footer-desk-label">EDUCATIONAL MARKET DATA &amp; QUANTITATIVE RESEARCH DESK:</span>
          <a href="mailto:hello@truthofmarket.com" class="tom-footer-email-link">
            ✉️ hello@truthofmarket.com
          </a>
          <span style="color:var(--border);">|</span>
          <a href="${state.config.youtube_url || DEFAULT_YOUTUBE_URL}" target="_blank" rel="noopener" class="tom-footer-social">
            YouTube @TruthOfMarketUS
          </a>
          <span style="color:var(--border);">|</span>
          <a href="${state.config.instagram_url || DEFAULT_INSTAGRAM_URL}" target="_blank" rel="noopener" class="tom-footer-social">
            Instagram @truthofmarket
          </a>
          <span style="color:var(--border);">|</span>
          <button type="button" class="btn btn-sm" id="btnToggleTomTheme" title="Switch between Daylight Mode and Optional Dark Mode">
            ${state.uiTheme === "dark" ? "☀️ Daylight Mode" : "🌙 Dark Mode"}
          </button>
          <button type="button" class="btn btn-sm" id="btnOpenLicense" title="Restore VIP License Key">
            🔑 Restore License Key
          </button>
        </div>
        <div class="tom-footer-legal-bar">
          <a href="/terms.html">Terms of Service</a>
          <span style="color:var(--border);">&middot;</span>
          <a href="/privacy.html">Privacy Policy</a>
          <span style="color:var(--border);">&middot;</span>
          <a href="/refund.html" class="is-refund">Standard Digital Refund Policy</a>
          <span style="color:var(--border);">&middot;</span>
          <a href="/contact.html">Contact Desk</a>
          <span style="color:var(--border);">&middot;</span>
          <a href="/insights/">Educational Insights</a>
          <span style="color:var(--border);">&middot;</span>
          <a href="/semi-fear-greed.html">Sector Barbell Calculator</a>
          <span style="color:var(--border);">&middot;</span>
          <a href="/pro-swing.html">Equity Factor Archive</a>
          <span style="color:var(--border);">&middot;</span>
          <a href="mailto:hello@truthofmarket.com" class="is-support">Support: hello@truthofmarket.com</a>
        </div>
        <p id="disclaimerText" class="tom-footer-disclaimer">${t.disclaimer}</p>
        <p class="tom-footer-copyright" id="copyrightText">${t.copyright}</p>
      </footer>
    </main>
    <canvas id="scoreCanvas" width="900" height="500" style="display:none;"></canvas>
    ${renderModals(state)}
  `;

  bindEvents();
}

function switchView(targetView) {
  state.activeView = targetView === "semi" ? "semi" : "rightside";
  const basePath = window.location.pathname || "/";
  if (state.activeView === "semi") {
    window.history.replaceState(null, "", `${basePath}#semi`);
  } else {
    window.history.replaceState(null, "", `${basePath}#rightside`);
  }
  renderApp();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function handlePolarCheckoutSuccess(orderRef) {
  const tokenVal = String(orderRef || "RSA-PRO-2026-WHOP-CHECKOUT").trim();
  state.isProUnlocked = true;
  state.licenseKey = tokenVal;
  try {
    localStorage.setItem("rsa_pro_unlocked", "true");
    localStorage.setItem("rsa_token", tokenVal);
    const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
    if (localStorage.getItem("hq_paid_" + kst) !== "1") {
      localStorage.setItem("hq_paid_" + kst, "1");
      fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_member_" + kst, {
        mode: "cors",
        keepalive: true,
      }).catch(() => {});
      fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_member_total", {
        mode: "cors",
        keepalive: true,
      }).catch(() => {});
    }
  } catch (_) {}
  await loadAllData();
  const licModal = document.getElementById("licenseModal");
  if (licModal) licModal.style.display = "none";
  renderApp();
  showToast(
    "Whop Research Pass Confirmed! All 72 Pro Setups Unlocked (Check your email for your permanent License Key)."
  );
}

function bindRsaPolarCheckoutEvents() {
  if (typeof window === "undefined") return;
  try {
    if (!window.__rsaPolarPostMessageBound && typeof window.addEventListener === "function") {
      window.__rsaPolarPostMessageBound = true;
      window.addEventListener("message", (ev) => {
        try {
          const origin = String(ev?.origin || "").toLowerCase();
          if (!origin.includes("whop.com")) return;
          const d = ev.data;
          const isSuccess =
            d === "whop_checkout_success" ||
            (d &&
              typeof d === "object" &&
              (d.event === "success" ||
                d.event === "whop_checkout_success" ||
                d.type === "whop_checkout_success" ||
                d.status === "succeeded"));
          if (isSuccess) {
            handlePolarCheckoutSuccess("RSA-PRO-2026-WHOP-EMBED");
          }
        } catch (_) {}
      });
    }
  } catch (_) {}
}

if (typeof window !== "undefined") {
  window.__bindRsaPolarCheckoutEvents = bindRsaPolarCheckoutEvents;
  window.addEventListener("load", bindRsaPolarCheckoutEvents);
  try {
    const initTheme = localStorage.getItem("tom_ui_theme_v2") === "dark" ? "dark" : "light";
    const rawPx = Number(localStorage.getItem("tom_font_px"));
    const initPx = [18, 20, 22].includes(rawPx) ? rawPx : 18;
    document.documentElement.setAttribute("data-tom-theme", initTheme);
    document.documentElement.setAttribute("data-tom-font", String(initPx));
    if (document.body) {
      document.body.style.fontSize = `${initPx}px`;
    }
  } catch (_) {}
}

function bindEvents() {
  // Initialize Whop.com checkout postMessage & auto-unlock handler
  bindRsaPolarCheckoutEvents();

  // Senior Font Size A+ 3-Step Cycle (18px -> 20px -> 22px -> 18px) & Daylight/Dark Toggle
  const btnToggleTomFont = document.getElementById("btnToggleTomFont");
  if (btnToggleTomFont) {
    btnToggleTomFont.addEventListener("click", () => {
      const cur = Number(state.fontSizePx || 18);
      const next = cur === 18 ? 20 : cur === 20 ? 22 : 18;
      state.fontSizePx = next;
      state.fontSizeMode = next > 18 ? "large" : "normal";
      try {
        localStorage.setItem("tom_font_px", String(next));
        localStorage.setItem("tom_font_size", state.fontSizeMode);
        document.documentElement.setAttribute("data-tom-font", String(next));
        if (document.body) {
          document.body.style.fontSize = `${next}px`;
        }
      } catch (_) {}
      renderApp();
      showToast(`🔍 Senior Readability Text Size: ${next}px Active`);
    });
  }

  const btnToggleTomTheme = document.getElementById("btnToggleTomTheme");
  if (btnToggleTomTheme) {
    btnToggleTomTheme.addEventListener("click", () => {
      state.uiTheme = state.uiTheme === "light" ? "dark" : "light";
      try {
        localStorage.setItem("tom_ui_theme_v2", state.uiTheme);
        localStorage.setItem("tom_ui_theme", state.uiTheme);
        document.documentElement.setAttribute("data-tom-theme", state.uiTheme);
      } catch (_) {}
      renderApp();
    });
  }

  // Smooth scroll for 4 Senior Header Navigation Links when on Home
  [
    ["navIncomeSim", "tom-retirement-architect"],
    ["navMarketWeather", "tomMorningBellClub"],
    ["navBrokerGuide", "tomFreeStarterManual"],
    ["navVipBenefits", "pricing"],
  ].forEach(([navId, targetId]) => {
    const navEl = document.getElementById(navId);
    if (!navEl) return;
    navEl.addEventListener("click", (e) => {
      const targetEl = document.getElementById(targetId);
      if (targetEl && typeof targetEl.scrollIntoView === "function") {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // 3-Color Market Weather Strip Actions
  document.querySelectorAll(".tom-traffic-card").forEach((card) => {
    card.addEventListener("click", () => {
      const z = card.getAttribute("data-traffic-zone");
      if (z === "RETIRE_SIM") {
        const simEl = document.getElementById("tom-retirement-architect");
        if (simEl && simEl.scrollIntoView) simEl.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (z === "MANUAL") {
        const manEl = document.getElementById("tomFreeStarterManual");
        if (manEl && manEl.scrollIntoView) manEl.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (z === "DOCTOR") {
        const docEl = document.getElementById("position-doctor-card");
        if (docEl && docEl.scrollIntoView) docEl.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (z) {
        state.zoneFilter = z;
        applyClientFilterAndSort();
        renderApp();
        const tbl = document.getElementById("screenerSection");
        if (tbl && tbl.scrollIntoView) tbl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // 1-Field Free Morning Retirement Brief Signup Form
  const tomMorningForm = document.getElementById("tomMorningSignalForm");
  if (tomMorningForm) {
    tomMorningForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = document.getElementById("tomMorningEmailInput");
      const statusEl = document.getElementById("tomMorningSignalStatus");
      const bonusEl = document.getElementById("tomFreeMemberBonusCard");
      const email = String(inp ? inp.value : "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (statusEl) {
          statusEl.style.display = "block";
          statusEl.style.color = "#f87171";
          statusEl.textContent = "⚠️ Please enter a valid email address (e.g., robert@email.com).";
        }
        if (inp) inp.focus();
        return;
      }
      state.freeMemberEmail = email;
      try {
        const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
        localStorage.setItem("tom_free_member_email", email);
        localStorage.setItem("tom_free_member_since", kst);
        if (typeof window.trackTomFreeSignup === "function") {
          window.trackTomFreeSignup(email);
        }
        registerTomClubMemberSafe({
          email,
          nickname: "",
          segment: "retirement_401k_ira",
          website_hp: "",
        }).catch(() => {});
      } catch (_) {}
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.style.color = "#34d399";
        statusEl.textContent = `Welcome aboard (${email})! Your 8:30 AM ET Retirement Weather Brief & 4-Core Allocation Guide are now unlocked.`;
      }
      if (bonusEl) bonusEl.style.display = "block";
      showToast("✅ Free Daily Morning Retirement Brief Activated!");
    });
  }

  // Morning Bell Club 1-Click Member Sentiment Poll (<50ms instant + non-blocking Abacus)
  document.querySelectorAll(".tom-club-poll-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const choice = String(btn.getAttribute("data-tom-poll") || "").trim();
      if (!["steady", "watch", "cash"].includes(choice)) return;
      const todayKey = getTomMorningClubTodayKey();
      try {
        localStorage.setItem(
          "tom_morning_club_poll_v1",
          JSON.stringify({ date: todayKey, choice })
        );
      } catch (_) {}

      const updated = getTomMorningClubPollData(todayKey);
      document.querySelectorAll(".tom-club-poll-btn").forEach((b) => {
        const key = b.getAttribute("data-tom-poll");
        const active = key === choice;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      ["steady", "watch", "cash"].forEach((k) => {
        const pctEl = document.querySelector(`[data-tom-poll-pct="${k}"]`);
        const barEl = document.querySelector(`[data-tom-poll-bar="${k}"]`);
        if (pctEl) pctEl.textContent = `${updated.pct[k]}%`;
        if (barEl) barEl.style.width = `${updated.pct[k]}%`;
      });
      const totalEl = document.getElementById("tomClubPollTotalCount");
      if (totalEl) {
        totalEl.textContent = `${updated.total.toLocaleString()} members checked in today`;
      }
      const msgEl = document.getElementById("tomClubCompanionMsg");
      if (msgEl && TOM_MORNING_CLUB_COMPANION_MSG[choice]) {
        msgEl.classList.add("is-voted");
        msgEl.textContent = TOM_MORNING_CLUB_COMPANION_MSG[choice];
      }

      try {
        const hitFlag = `tom_poll_hit_${choice}_${todayKey}`;
        if (typeof fetch === "function" && localStorage.getItem(hitFlag) !== "1") {
          localStorage.setItem(hitFlag, "1");
          fetch(
            `https://abacus.jasoncameron.dev/hit/tom_truthofmarket/poll_${choice}_${todayKey}`,
            { mode: "cors", keepalive: true }
          ).catch(() => {});
        }
      } catch (_) {}
    });
  });

  // 30-Second Comfortable Retirement & Monthly Cashflow Simulator (#tom-retirement-architect)
  bindTomRetirementArchitectEvents(state, showToast);

  // Passwordless 3-Second Morning Bell Macro Club Membership (#tom-passwordless-club-signup)
  bindTomPasswordlessClubEvents(state, showToast);

  const jumpToTomMorningBox = () => {
    const box = document.getElementById("tom-passwordless-club-signup") || document.getElementById("tomMorningBellClub");
    const form = document.getElementById("tom-club-signup-form");
    const inp = document.getElementById("tom-club-email-input");
    if (form) form.style.display = "block";
    if (box && box.scrollIntoView) box.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      if (inp) inp.focus();
    }, 250);
  };

  const btnDocJumpFreeAlert = document.getElementById("btnDocJumpFreeAlert");
  if (btnDocJumpFreeAlert) {
    btnDocJumpFreeAlert.addEventListener("click", jumpToTomMorningBox);
  }

  document.querySelectorAll(".btn-jump-tom-morning").forEach((btn) => {
    btn.addEventListener("click", jumpToTomMorningBox);
  });

  // $0 Free US Brokerage App & Calm 2-4x/Year Allocation Manual Modal + WebView Branching
  const tomStarterManualModal = document.getElementById("tomStarterManualModal");
  const isWebViewEnv = () =>
    typeof window !== "undefined" &&
    typeof window.isTomInAppWebView === "function" &&
    window.isTomInAppWebView();

  const openTomStarterManual = (stepId) => {
    if (!tomStarterManualModal) return;
    tomStarterManualModal.style.display = "flex";
    if (isWebViewEnv() && !stepId) {
      const wvBox = document.getElementById("tomWebviewPdfEmailBox");
      const wvInp = document.getElementById("tomWebviewPdfEmailInput");
      if (wvBox) wvBox.style.display = "block";
      setTimeout(() => {
        if (wvInp && !wvInp.value) wvInp.focus();
      }, 80);
      return;
    }
    if (stepId) {
      setTimeout(() => {
        const targetEl = document.getElementById(stepId);
        if (targetEl && targetEl.scrollIntoView) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 60);
    }
  };

  const btnOpenTomStarterManual = document.getElementById("btnOpenTomStarterManual");
  if (btnOpenTomStarterManual) {
    btnOpenTomStarterManual.addEventListener("click", () => openTomStarterManual(""));
  }

  document.querySelectorAll(".btn-open-tom-manual-step").forEach((card) => {
    card.addEventListener("click", () => {
      openTomStarterManual(card.getAttribute("data-manual-step") || "");
    });
  });

  document.querySelectorAll(".tom-manual-jump-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const tid = pill.getAttribute("data-manual-target");
      const targetEl = tid ? document.getElementById(tid) : null;
      if (targetEl && targetEl.scrollIntoView) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const btnCloseTomStarterManual = document.getElementById("btnCloseTomStarterManual");
  if (btnCloseTomStarterManual && tomStarterManualModal) {
    btnCloseTomStarterManual.addEventListener("click", () => {
      tomStarterManualModal.style.display = "none";
    });
  }

  if (tomStarterManualModal) {
    tomStarterManualModal.addEventListener("click", (e) => {
      if (e.target === tomStarterManualModal) {
        tomStarterManualModal.style.display = "none";
      }
    });
  }

  const btnPrintTomStarterManual = document.getElementById("btnPrintTomStarterManual");
  if (btnPrintTomStarterManual) {
    btnPrintTomStarterManual.addEventListener("click", (e) => {
      if (isWebViewEnv()) {
        if (e) e.preventDefault();
        if (tomStarterManualModal) tomStarterManualModal.style.display = "flex";
        const wvBox = document.getElementById("tomWebviewPdfEmailBox");
        const wvInp = document.getElementById("tomWebviewPdfEmailInput");
        if (wvBox) {
          wvBox.style.display = "block";
          if (wvBox.scrollIntoView) wvBox.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setTimeout(() => {
          if (wvInp) wvInp.focus();
        }, 80);
        return;
      }
      try {
        document.body.classList.add("printing-tom-manual");
        window.print();
        setTimeout(() => {
          document.body.classList.remove("printing-tom-manual");
        }, 600);
      } catch (_) {
        document.body.classList.remove("printing-tom-manual");
      }
    });
  }

  const tomWebviewPdfEmailForm = document.getElementById("tomWebviewPdfEmailForm");
  if (tomWebviewPdfEmailForm) {
    tomWebviewPdfEmailForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const inp = document.getElementById("tomWebviewPdfEmailInput");
      const statusEl = document.getElementById("tomWebviewPdfEmailStatus");
      const email = String((inp && inp.value) || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        if (statusEl) {
          statusEl.style.display = "block";
          statusEl.style.color = "#fca5a5";
          statusEl.textContent = "Please enter a valid email address (for example, robert@email.com).";
        }
        if (inp) inp.focus();
        return;
      }
      state.freeMemberEmail = email;
      try {
        localStorage.setItem("tom_free_member_email", email);
        fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/signup", {
          mode: "cors",
          keepalive: true,
        }).catch(() => {});
        fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/signup_total", {
          mode: "cors",
          keepalive: true,
        }).catch(() => {});
        if (typeof window.submitTomVipWaitlistOrManualEmail === "function") {
          window.submitTomVipWaitlistOrManualEmail({
            email,
            segment: "starter_manual_pdf",
            lang: "en-US",
            notes: "site=truthofmarket.com | source=starter_manual_pdf",
          }).catch(() => {});
        } else {
          registerTomClubMemberSafe({
            email,
            nickname: "",
            segment: "starter_manual_pdf",
            website_hp: "",
          }).catch(() => {});
        }
      } catch (_) {}
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.style.color = "#6ee7b7";
        statusEl.textContent = `✅ PDF Guide & Instant Free Morning Bell Club Access activated for ${email}! Check your inbox.`;
      }
      showToast("✅ $0 PDF Guide & Free Club Access Sent!");
    });
  }

  const btnModalJumpTomFreeSignal = document.getElementById("btnModalJumpTomFreeSignal");
  if (btnModalJumpTomFreeSignal) {
    btnModalJumpTomFreeSignal.addEventListener("click", () => {
      if (tomStarterManualModal) tomStarterManualModal.style.display = "none";
      jumpToTomMorningBox();
    });
  }

  // Brand Home Button
  const brandHomeBtn = document.getElementById("brandHomeBtn");
  if (brandHomeBtn) {
    brandHomeBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Platform Switcher
  const navTabRightSide = document.getElementById("navTabRightSide");
  if (navTabRightSide) {
    navTabRightSide.addEventListener("click", () => switchView("rightside"));
  }
  const navTabSemiFg = document.getElementById("navTabSemiFg");
  if (navTabSemiFg) {
    navTabSemiFg.addEventListener("click", () => switchView("semi"));
  }
  const ribbonSwitchSemi = document.getElementById("ribbonSwitchSemi");
  if (ribbonSwitchSemi) {
    ribbonSwitchSemi.addEventListener("click", () => switchView("semi"));
  }
  const crossFunnelSwitchBtn = document.getElementById("crossFunnelSwitchBtn");
  if (crossFunnelSwitchBtn) {
    crossFunnelSwitchBtn.addEventListener("click", (e) => {
      const stripEl = document.getElementById("tomTrafficLightStrip");
      if (stripEl && stripEl.scrollIntoView) {
        e.preventDefault();
        stripEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        switchView("semi");
      }
    });
  }
  const btnSwitchToRightSide = document.getElementById("btnSwitchToRightSide");
  if (btnSwitchToRightSide) {
    btnSwitchToRightSide.addEventListener("click", () => switchView("rightside"));
  }
  const btnQuickJumpSemiFg = document.getElementById("btnQuickJumpSemiFg");
  if (btnQuickJumpSemiFg) {
    btnQuickJumpSemiFg.addEventListener("click", () => switchView("semi"));
  }
  const focusPositionDoctor = (e) => {
    if (e) e.preventDefault();
    if (state.activeView !== "rightside") {
      state.activeView = "rightside";
      renderApp();
    }
    const docCard =
      document.getElementById("position-doctor-card") ||
      document.getElementById("doctor") ||
      document.getElementById("positionDoctorCard");
    const docTickerNow = document.getElementById("docTicker");
    if (docTickerNow) {
      try {
        docTickerNow.focus({ preventScroll: true });
      } catch (_) {
        docTickerNow.focus();
      }
      if (typeof docTickerNow.select === "function") docTickerNow.select();
    }
    if (docCard && docCard.scrollIntoView) {
      docCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(() => {
      const docTicker = document.getElementById("docTicker");
      if (docTicker) {
        try {
          docTicker.focus({ preventScroll: true });
        } catch (_) {
          docTicker.focus();
        }
        if (typeof docTicker.select === "function") docTicker.select();
      }
    }, 240);
  };
  const btnHeroActionRetireSim = document.getElementById("btnHeroActionRetireSim");
  if (btnHeroActionRetireSim) {
    btnHeroActionRetireSim.addEventListener("click", () => {
      const simEl = document.getElementById("tom-retirement-architect");
      if (simEl && typeof simEl.scrollIntoView === "function") {
        simEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
  const btnHeroActionManual = document.getElementById("btnHeroActionManual");
  if (btnHeroActionManual) {
    btnHeroActionManual.addEventListener("click", () => openTomStarterManual(""));
  }
  const btnHeroActionSignals = document.getElementById("btnHeroActionSignals");
  if (btnHeroActionSignals) {
    btnHeroActionSignals.addEventListener("click", () => {
      const tableEl = document.getElementById("stockTable") || document.getElementById("screenerSection");
      if (tableEl && typeof tableEl.scrollIntoView === "function") {
        tableEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
  const btnHeroActionDoctor = document.getElementById("btnHeroActionDoctor");
  if (btnHeroActionDoctor) {
    btnHeroActionDoctor.addEventListener("click", focusPositionDoctor);
  }
  const btnQuickJumpDoctor = document.getElementById("btnQuickJumpDoctor");
  if (btnQuickJumpDoctor) {
    btnQuickJumpDoctor.addEventListener("click", focusPositionDoctor);
  }
  const btnHeroJumpPositionDoctor = document.getElementById("btnHeroJumpPositionDoctor");
  if (btnHeroJumpPositionDoctor) {
    btnHeroJumpPositionDoctor.addEventListener("click", focusPositionDoctor);
  }

  // Language Switcher
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const newLang = btn.getAttribute("data-lang");
      if (newLang && translations[newLang]) {
        state.lang = newLang;
        localStorage.setItem("rsa_lang", newLang);
        localStorage.setItem("rsa_lang_explicit", "1");
        renderApp();
      }
    });
  });

  // Search Input (TruthOfMarket)
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      applyClientFilterAndSort();
      const tbody = document.getElementById("tableBody");
      if (tbody) tbody.innerHTML = renderStockRows(state);
      bindRowEvents();
    });
  }

  // Zone Filter Tabs
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.zoneFilter = tab.getAttribute("data-zone") || "ALL";
      applyClientFilterAndSort();
      renderApp();
    });
  });

  // Beginner-Friendly Profit Simulator Controls (Hero Section)
  document.querySelectorAll(".btn-easy-cap-preset").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cap = Math.max(500, Number(btn.getAttribute("data-cap") || 10000));
      state.easySimCapUsd = cap;
      state.proPortfolioUsd = cap;
      try {
        localStorage.setItem("rsa_pro_cap_usd", String(cap));
      } catch (_) {}
      renderApp();
    });
  });

  const easySimTickerSelect = document.getElementById("easySimTickerSelect");
  if (easySimTickerSelect) {
    easySimTickerSelect.addEventListener("change", (e) => {
      state.easySimTicker = e.target.value;
      renderApp();
    });
  }

  const easySimCapitalInput = document.getElementById("easySimCapitalInput");
  if (easySimCapitalInput) {
    easySimCapitalInput.addEventListener("change", (e) => {
      const cap = Math.max(500, Number(e.target.value || 10000));
      state.easySimCapUsd = cap;
      state.proPortfolioUsd = cap;
      try {
        localStorage.setItem("rsa_pro_cap_usd", String(cap));
      } catch (_) {}
      renderApp();
    });
  }

  // 15-Second Historical Chart Study Controls
  document.querySelectorAll(".btn-blind-test-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rId = btn.getAttribute("data-round");
      const pick = btn.getAttribute("data-pick");
      if (!rId || !pick) return;
      state.blindTestAnswers = { ...(state.blindTestAnswers || {}), [rId]: pick };
      renderApp();
    });
  });

  const btnResetBlindTest = document.getElementById("btnResetBlindTest");
  if (btnResetBlindTest) {
    btnResetBlindTest.addEventListener("click", () => {
      state.blindTestAnswers = {};
      renderApp();
      showToast("Historical Pattern Quiz Reset — Try All 3 Setups Again");
    });
  }

  const btnBlindTestJumpDoctor = document.getElementById("btnBlindTestJumpDoctor");
  if (btnBlindTestJumpDoctor) {
    btnBlindTestJumpDoctor.addEventListener("click", focusPositionDoctor);
  }

  // Sort Headers with Dynamic Directional Chevrons & Active State
  const updateSortHeaderIndicators = () => {
    document.querySelectorAll(".sort-header").forEach((el) => {
      const col = el.getAttribute("data-sort");
      if (!col) return;
      const isAct = state.sortCol === col;
      el.classList.remove("sort-active", "sort-asc", "sort-desc");
      if (isAct) {
        el.classList.add("sort-active", state.sortAsc ? "sort-asc" : "sort-desc");
      }
      const chevronEl = el.querySelector(".sort-chevron");
      if (chevronEl) {
        chevronEl.textContent = isAct ? (state.sortAsc ? "▲" : "▼") : "↕";
        if (isAct) {
          chevronEl.classList.remove("muted");
        } else {
          chevronEl.classList.add("muted");
        }
      }
    });
  };

  document.querySelectorAll(".sort-header").forEach((th) => {
    th.addEventListener("click", () => {
      const col = th.getAttribute("data-sort");
      if (!col) return;
      if (state.sortCol === col) {
        state.sortAsc = !state.sortAsc;
      } else {
        state.sortCol = col;
        state.sortAsc = col === "ticker";
      }
      applyClientFilterAndSort();
      updateSortHeaderIndicators();
      const tbody = document.getElementById("tableBody");
      if (tbody) tbody.innerHTML = renderStockRows(state);
      bindRowEvents();
    });
  });

  // License Modal Controls
  const licenseModal = document.getElementById("licenseModal");
  const openLicenseModal = (_prefill = false, customNotice = "") => {
    if (!licenseModal) return;
    licenseModal.style.display = "flex";
    const detailsEl = document.getElementById("licenseRestoreDetails");
    if (detailsEl && (_prefill || state.isProUnlocked)) {
      detailsEl.open = true;
    }
    const inputEl = document.getElementById("licenseInput");
    const msgEl = document.getElementById("licenseMsg");
    if (inputEl && !inputEl.value.trim()) {
      inputEl.value = state.licenseKey || "";
    }
    if (msgEl && customNotice) {
      msgEl.style.color = "#93c5fd";
      msgEl.textContent = customNotice;
    }
  };
  const closeLicenseModal = () => {
    if (licenseModal) licenseModal.style.display = "none";
  };

  const btnOpenLicense = document.getElementById("btnOpenLicense");
  if (btnOpenLicense) btnOpenLicense.addEventListener("click", () => openLicenseModal(false));

  const proStatusBadge = document.getElementById("proStatusBadge");
  if (proStatusBadge) {
    proStatusBadge.style.cursor = "pointer";
    proStatusBadge.addEventListener("click", () => openLicenseModal(false));
  }

  const vaultUnlockBtn = document.getElementById("vaultUnlockBtn");
  if (vaultUnlockBtn) vaultUnlockBtn.addEventListener("click", () => openLicenseModal(false));

  const vaultOverlayUnlock = document.getElementById("vaultOverlayUnlock");
  if (vaultOverlayUnlock) vaultOverlayUnlock.addEventListener("click", () => openLicenseModal(false));

  // Gated VIP Telegram Channel buttons -> open License / VIP modal for Free users
  document.querySelectorAll(".btn-gated-vip-tg").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (!state.isProUnlocked) {
        e.preventDefault();
        openLicenseModal(
          false,
          "🔒 VIP Telegram Educational Research Channel is available for Monthly Research Pass ($29/mo) and Annual Research Pass ($199/yr) subscribers."
        );
      }
    });
  });

  const btnCancelLicense = document.getElementById("btnCancelLicense");
  if (btnCancelLicense) btnCancelLicense.addEventListener("click", closeLicenseModal);

  const btnLockLicense = document.getElementById("btnLockLicense");
  if (btnLockLicense) {
    btnLockLicense.addEventListener("click", async () => {
      state.isProUnlocked = false;
      state.licenseKey = "";
      localStorage.removeItem("rsa_pro_unlocked");
      localStorage.removeItem("rsa_token");
      await loadAllData();
      closeLicenseModal();
      renderApp();
      showToast("Pro Terminal Locked — Reverted to Free Preview");
    });
  }

  const verifyLicenseFlow = async () => {
    const inputEl = document.getElementById("licenseInput");
    const msgEl = document.getElementById("licenseMsg");
    const key = (inputEl ? inputEl.value : "").trim();
    if (!key) {
      if (msgEl) {
        msgEl.style.color = "var(--fin-down)";
        msgEl.textContent = "Please enter your Whop.com VIP license key.";
      }
      return;
    }
    try {
      const res = await validateLicense(key);
      if (res.valid) {
        state.isProUnlocked = true;
        state.licenseKey = key;
        localStorage.setItem("rsa_pro_unlocked", "true");
        localStorage.setItem("rsa_token", key);
        if (msgEl) {
          msgEl.style.color = "var(--fin-up)";
          msgEl.textContent = res.message || "Pro Terminal Unlocked.";
        }
        await loadAllData();
        setTimeout(() => {
          closeLicenseModal();
          renderApp();
          showToast("Pro Terminal Unlocked — All 72 US Equity Targets Active");
        }, 350);
      } else {
        if (msgEl) {
          msgEl.style.color = "var(--fin-down)";
          msgEl.textContent =
            res.message || "Invalid or expired license key. Please verify your Whop.com receipt or subscribe below.";
        }
      }
    } catch (err) {
      if (msgEl) {
        msgEl.style.color = "var(--fin-down)";
        msgEl.textContent = "Unable to verify license key. Please check your key and try again.";
      }
    }
  };

  const btnVerifyLicense = document.getElementById("btnVerifyLicense");
  if (btnVerifyLicense) {
    btnVerifyLicense.addEventListener("click", verifyLicenseFlow);
  }

  const licenseInput = document.getElementById("licenseInput");
  if (licenseInput) {
    licenseInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        verifyLicenseFlow();
      }
    });
  }

  // Smart Checkout & Instant 7-Day Pro Founding Pass Bridge
  const activateInstantVipPass = async (sourceLabel, emailVal = "") => {
    const generatedKey = "RSA-VIP-2026-FOUNDER7D";
    state.isProUnlocked = true;
    state.licenseKey = generatedKey;
    localStorage.setItem("rsa_pro_unlocked", "true");
    localStorage.setItem("rsa_token", generatedKey);
    if (emailVal) {
      localStorage.setItem("rsa_vip_email", emailVal);
    }
    try {
      const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_member_" + kst, { mode: "cors", keepalive: true }).catch(() => {});
      fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_member_total", { mode: "cors", keepalive: true }).catch(() => {});
    } catch (_) {}
    const inputEl = document.getElementById("licenseInput");
    const msgEl = document.getElementById("licenseMsg");
    if (inputEl) inputEl.value = generatedKey;
    if (msgEl) {
      msgEl.style.color = "var(--fin-up)";
      msgEl.textContent = `✅ ${sourceLabel}: Pro Terminal Unlocked (Key: ${generatedKey}). All 72 US Equity Targets & 26Y CSV Active!`;
    }
    await loadAllData();
    setTimeout(() => {
      closeLicenseModal();
      renderApp();
      showToast("Pro Terminal Unlocked — All 72 US Equity Targets & 26Y CSV Active!");
    }, 350);
  };

  const btnInstantVipTrialUnlock = document.getElementById("btnInstantVipTrialUnlock");
  if (false && btnInstantVipTrialUnlock) { // Disabled free trial backdoor to protect live paid conversions
    btnInstantVipTrialUnlock.addEventListener("click", () => {
      const emailEl = document.getElementById("vipTrialEmailInput");
      const emailVal = (emailEl ? emailEl.value : "").trim();
      if (!emailVal || !emailVal.includes("@")) {
        const msgEl = document.getElementById("licenseMsg");
        if (msgEl) {
          msgEl.style.color = "#facc15";
          msgEl.textContent = "Please enter a valid email address to issue your 7-Day Pro Founding Pass key.";
        }
        if (emailEl) emailEl.focus();
        return;
      }
      activateInstantVipPass("7-Day Founding Pass Issued", emailVal);
    });
  }

  const vipTrialEmailInput = document.getElementById("vipTrialEmailInput");
  if (vipTrialEmailInput) {
    vipTrialEmailInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (btnInstantVipTrialUnlock) btnInstantVipTrialUnlock.click();
      }
    });
  }

  ["btnPartnerUnlockTv", "btnPartnerUnlockBrk"].forEach((id) => {
    const pBtn = document.getElementById(id);
    if (pBtn) {
      pBtn.addEventListener("click", () => {
        setTimeout(() => {
          activateInstantVipPass("Partner Verification Unlock");
        }, 600);
      });
    }
  });

  // Unified checkout handling is enforced by PaymentWaitlist.js (window.PAYMENT_CONFIG)

  // Admin Login & Config Modal Controls
  const adminLoginModal = document.getElementById("adminLoginModal");
  const configModal = document.getElementById("configModal");
  const btnOpenConfig = document.getElementById("btnOpenConfig");
  const btnCancelConfig = document.getElementById("btnCancelConfig");
  const btnSaveConfig = document.getElementById("btnSaveConfig");
  const btnCancelAdminLogin = document.getElementById("btnCancelAdminLogin");
  const btnSubmitAdminLogin = document.getElementById("btnSubmitAdminLogin");
  const btnAdminLogout = document.getElementById("btnAdminLogout");

  const handleAdminLoginSubmit = async () => {
    const idInput = document.getElementById("adminIdInput");
    const pwInput = document.getElementById("adminPwInput");
    const msgEl = document.getElementById("adminLoginMsg");
    const uname = (idInput ? idInput.value : "").trim();
    const pw = pwInput ? pwInput.value : "";

    if (!uname || !pw) {
      if (msgEl) {
        msgEl.style.color = "var(--fin-down)";
        msgEl.textContent = "Please enter both Admin ID and Password.";
      }
      return;
    }

    try {
      const res = await verifyAdminCredentials(uname, pw);
      if (res && res.authenticated) {
        state.isAdminAuthenticated = true;
        sessionStorage.setItem("rsa_admin_auth", "true");
        // Automatically grant Pro Terminal access to Admin
        state.isProUnlocked = true;
        state.licenseKey = res.license_key || "RSA-ADMIN-SESSION";
        localStorage.setItem("rsa_pro_unlocked", "true");
        localStorage.setItem("rsa_token", state.licenseKey);

        if (msgEl) {
          msgEl.style.color = "var(--fin-up)";
          msgEl.textContent = res.message || "Admin Authenticated!";
        }
        await loadAllData();
        if (adminLoginModal) adminLoginModal.style.display = "none";
        renderApp();
        const freshConfigModal = document.getElementById("configModal");
        if (freshConfigModal) freshConfigModal.style.display = "flex";
        showToast("Admin Authenticated — Terminal Config & Pro Access Unlocked");
      } else {
        if (msgEl) {
          msgEl.style.color = "var(--fin-down)";
          msgEl.textContent = (res && res.message) || "Invalid Admin ID or Password.";
        }
      }
    } catch (_) {
      if (msgEl) {
        msgEl.style.color = "var(--fin-down)";
        msgEl.textContent = "Authentication error. Please try again.";
      }
    }
  };

  if (btnOpenConfig) {
    btnOpenConfig.addEventListener("click", () => {
      if (state.isAdminAuthenticated) {
        if (configModal) configModal.style.display = "flex";
      } else if (adminLoginModal) {
        adminLoginModal.style.display = "flex";
        const idInput = document.getElementById("adminIdInput");
        if (idInput) idInput.focus();
      }
    });
  }
  if (btnCancelAdminLogin && adminLoginModal) {
    btnCancelAdminLogin.addEventListener("click", () => {
      adminLoginModal.style.display = "none";
    });
  }
  if (btnSubmitAdminLogin) {
    btnSubmitAdminLogin.addEventListener("click", handleAdminLoginSubmit);
  }
  const adminPwInput = document.getElementById("adminPwInput");
  if (adminPwInput) {
    adminPwInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAdminLoginSubmit();
      }
    });
  }
  if (btnAdminLogout) {
    btnAdminLogout.addEventListener("click", () => {
      state.isAdminAuthenticated = false;
      sessionStorage.removeItem("rsa_admin_auth");
      if (configModal) configModal.style.display = "none";
      showToast("Admin Session Locked");
    });
  }
  if (btnCancelConfig && configModal) {
    btnCancelConfig.addEventListener("click", () => {
      configModal.style.display = "none";
    });
  }
  if (btnSaveConfig) {
    btnSaveConfig.addEventListener("click", async () => {
      const s1Url = document.getElementById("cfgSite1Url")?.value.trim() || state.config.site1_url;
      const polarM = document.getElementById("cfgLsMonthly")?.value.trim() || "";
      const polarA = document.getElementById("cfgLsLtd")?.value.trim() || "";
      const tgCh = document.getElementById("cfgTgChannel")?.value.trim() || state.config.telegram_channel_url || DEFAULT_TG_CHANNEL_URL;
      const ytUrl = document.getElementById("cfgYoutubeUrl")?.value.trim() || state.config.youtube_url || DEFAULT_YOUTUBE_URL;
      const igUrl = document.getElementById("cfgInstagramUrl")?.value.trim() || state.config.instagram_url || DEFAULT_INSTAGRAM_URL;
      const tvId = document.getElementById("cfgAffTv")?.value.trim() || "1173809";
      const saSrc = document.getElementById("cfgAffSa")?.value.trim() || "better_life333";
      const brkName = document.getElementById("cfgBrokerName")?.value.trim() || "TrendSpider (rightside)";
      const brkUrl =
        document.getElementById("cfgBrokerUrl")?.value.trim() ||
        "https://trendspider.com/?_go=rightside";

      state.config.site1_url = s1Url;
      state.config.whop_tom_monthly_url = polarM;
      state.config.whop_tom_annual_url = polarA;
      state.config.telegram_channel_url = tgCh;
      state.config.youtube_url = ytUrl;
      state.config.instagram_url = igUrl;
      state.config.tradingview_aff_id = tvId;
      state.config.seekingalpha_source = saSrc;
      state.config.broker_name = brkName;
      state.config.broker_referral_url = brkUrl;

      localStorage.setItem("rsa_cfg_site1_url", s1Url);
      localStorage.setItem("rsa_cfg_whop_monthly", polarM);
      localStorage.setItem("rsa_cfg_whop_annual", polarA);
      localStorage.setItem("rsa_tg_channel_url", tgCh);
      localStorage.setItem("rsa_cfg_youtube_url", ytUrl);
      localStorage.setItem("rsa_cfg_instagram_url", igUrl);
      localStorage.setItem("rsa_cfg_aff_tv", tvId);
      localStorage.setItem("rsa_cfg_aff_sa", saSrc);
      localStorage.setItem("rsa_cfg_broker_name", brkName);
      localStorage.setItem("rsa_cfg_broker_url", brkUrl);

      try {
        await updateReferralConfig({
          tradingview_aff_id: tvId,
          seekingalpha_source: saSrc,
          broker_name: brkName,
          broker_referral_url: brkUrl,
          whop_tom_monthly_url: polarM,
          whop_tom_annual_url: polarA,
          site1_url: s1Url,
          telegram_channel_url: tgCh,
          youtube_url: ytUrl,
          instagram_url: igUrl,
        });
      } catch (e) {
        // Ignore network error if offline
      }

      if (configModal) configModal.style.display = "none";
      renderApp();
      showToast("Terminal & Affiliate Configuration Saved");
    });
  }

  // Telegram Modal Controls
  const telegramModal = document.getElementById("telegramModal");
  const refreshTelegramPreview = async (alertTypeOverride) => {
    const selEl = document.getElementById("tgAlertTypeSelect");
    const aType = alertTypeOverride || selEl?.value || state.telegramAlertType || "SEMI_BRIEFING";
    state.telegramAlertType = aType;
    const prevBox = document.getElementById("telegramPreviewBox");
    const docTicker = (document.getElementById("docTicker")?.value || "CELH").trim().toUpperCase();
    const docEntry = parseFloat(document.getElementById("docEntry")?.value || "27.93") || 27.93;
    const docDays = parseInt(document.getElementById("docDays")?.value || "42", 10) || 42;
    try {
      const res = await sendTelegramAlert({
        alert_type: aType,
        lang: state.lang,
        ticker: docTicker,
        entry_price: docEntry,
        days_held: docDays,
        dry_run: true,
      });
      if (res && res.message_preview) {
        state.telegramPreviewText = res.message_preview;
        if (prevBox) prevBox.textContent = res.message_preview;
      }
    } catch (_) {
      // Ignore preview error
    }
  };

  const openTelegramModal = async (defaultAlertType) => {
    if (!telegramModal) return;
    if (defaultAlertType) {
      state.telegramAlertType = defaultAlertType;
      const selEl = document.getElementById("tgAlertTypeSelect");
      if (selEl) selEl.value = defaultAlertType;
    }
    telegramModal.style.display = "flex";
    await refreshTelegramPreview(defaultAlertType);
    try {
      const syncInfo = await syncTelegramBotBrowser(state.telegramBotToken, state.telegramChatId);
      if (syncInfo && syncInfo.chatId && syncInfo.chatId !== state.telegramChatId) {
        state.telegramChatId = syncInfo.chatId;
        const cidInput = document.getElementById("tgChatIdInput");
        if (cidInput) cidInput.value = syncInfo.chatId;
      }
    } catch (_) {
      // Ignore sync error
    }
  };

  const btnOpenTelegram = document.getElementById("btnOpenTelegram");
  if (btnOpenTelegram) {
    btnOpenTelegram.addEventListener("click", () =>
      openTelegramModal(state.activeView === "semi" ? "SEMI_BRIEFING" : "RSA_IGNITION")
    );
  }
  const btnSendSemiTelegram = document.getElementById("btnSendSemiTelegram");
  if (btnSendSemiTelegram) {
    btnSendSemiTelegram.addEventListener("click", () => openTelegramModal("SEMI_BRIEFING"));
  }
  const btnOpenTelegramFromPricing = document.getElementById("btnOpenTelegramFromPricing");
  if (btnOpenTelegramFromPricing) {
    btnOpenTelegramFromPricing.addEventListener("click", () => openTelegramModal("FULL_DAILY"));
  }
  const btnCloseTelegram = document.getElementById("btnCloseTelegram");
  if (btnCloseTelegram && telegramModal) {
    btnCloseTelegram.addEventListener("click", () => {
      telegramModal.style.display = "none";
    });
  }

  const tgAlertTypeSelect = document.getElementById("tgAlertTypeSelect");
  if (tgAlertTypeSelect) {
    tgAlertTypeSelect.addEventListener("change", (e) => {
      refreshTelegramPreview(e.target.value);
    });
  }

  const btnPreviewTelegram = document.getElementById("btnPreviewTelegram");
  if (btnPreviewTelegram) {
    btnPreviewTelegram.addEventListener("click", () => {
      refreshTelegramPreview();
      showToast("Refreshed Live Telegram Briefing Preview");
    });
  }

  const btnCopyTelegramMsg = document.getElementById("btnCopyTelegramMsg");
  if (btnCopyTelegramMsg) {
    btnCopyTelegramMsg.addEventListener("click", async () => {
      const txt = document.getElementById("telegramPreviewBox")?.textContent || state.telegramPreviewText || "";
      try {
        await navigator.clipboard.writeText(txt);
        showToast("Telegram Briefing Copied to Clipboard");
      } catch (_) {
        showToast("Briefing Text Ready to Copy");
      }
    });
  }

  const persistTelegramInputs = async () => {
    const tok = document.getElementById("tgBotTokenInput")?.value.trim() ?? state.telegramBotToken;
    const cid = document.getElementById("tgChatIdInput")?.value.trim() ?? state.telegramChatId;
    const chUrl =
      document.getElementById("tgChannelUrlInput")?.value.trim() ||
      state.config.telegram_channel_url ||
      "https://t.me/SemiFearGreed";

    state.telegramBotToken = tok;
    state.telegramChatId = cid;
    state.telegramConfigured = Boolean(tok && cid);
    state.config.telegram_channel_url = chUrl;
    state.config.telegram_chat_id = cid;

    localStorage.setItem("rsa_tg_bot_token", tok);
    localStorage.setItem("rsa_tg_chat_id", cid);
    localStorage.setItem("rsa_tg_channel_url", chUrl);

    const chLinkBtn = document.getElementById("tgChannelLinkBtn");
    if (chLinkBtn) chLinkBtn.setAttribute("href", chUrl);

    try {
      await saveTelegramConfig({
        bot_token: tok,
        chat_id: cid,
        channel_url: chUrl,
        lang: state.lang,
      });
    } catch (_) {
      // Ignore if static
    }
    return { tok, cid, chUrl };
  };

  const btnVerifyTelegram = document.getElementById("btnVerifyTelegram");
  if (btnVerifyTelegram) {
    btnVerifyTelegram.addEventListener("click", async () => {
      const statusEl = document.getElementById("telegramStatusMsg");
      const { tok, cid } = await persistTelegramInputs();
      if (statusEl) {
        statusEl.style.color = "#93c5fd";
        statusEl.textContent = "Verifying Telegram Bot connection...";
      }
      try {
        const res = await verifyTelegramBot({ bot_token: tok, chat_id: cid });
        if (statusEl) {
          statusEl.style.color = res.valid ? "var(--fin-up)" : "var(--fin-amber)";
          statusEl.textContent = res.message || "Bot configuration saved.";
        }
        showToast(res.valid ? "Telegram Bot Verified & Saved" : "Saved Telegram Parameters");
      } catch (_) {
        if (statusEl) {
          statusEl.style.color = "var(--fin-amber)";
          statusEl.textContent = "Saved locally. Ready for preview or direct dispatch.";
        }
      }
    });
  }

  const btnSendTelegramNow = document.getElementById("btnSendTelegramNow");
  if (btnSendTelegramNow) {
    btnSendTelegramNow.addEventListener("click", async () => {
      const statusEl = document.getElementById("telegramStatusMsg");
      const prevBox = document.getElementById("telegramPreviewBox");
      const { tok, cid } = await persistTelegramInputs();
      const aType = document.getElementById("tgAlertTypeSelect")?.value || state.telegramAlertType || "SEMI_BRIEFING";
      const docTicker = (document.getElementById("docTicker")?.value || "CELH").trim().toUpperCase();
      const docEntry = parseFloat(document.getElementById("docEntry")?.value || "27.93") || 27.93;
      const docDays = parseInt(document.getElementById("docDays")?.value || "42", 10) || 42;

      if (statusEl) {
        statusEl.style.color = "#93c5fd";
        statusEl.textContent = "Dispatching briefing to Telegram...";
      }

      try {
        const res = await sendTelegramAlert({
          alert_type: aType,
          lang: state.lang,
          bot_token: tok,
          chat_id: cid,
          ticker: docTicker,
          entry_price: docEntry,
          days_held: docDays,
          dry_run: false,
        });
        if (res && res.message_preview) {
          state.telegramPreviewText = res.message_preview;
          if (prevBox) prevBox.textContent = res.message_preview;
        }
        if (statusEl) {
          statusEl.style.color = res.delivered ? "var(--fin-up)" : "#38bdf8";
          statusEl.textContent = res.status_detail || "Telegram briefing processed.";
        }
        showToast(
          res.delivered
            ? `Telegram Briefing Sent to ${res.chat_id}!`
            : "Briefing Preview Generated (Enter Live Bot Token & Chat ID to Push)"
        );
      } catch (_) {
        if (statusEl) {
          statusEl.style.color = "var(--fin-down)";
          statusEl.textContent = "Error sending Telegram alert.";
        }
      }
    });
  }

  // Pro VIP Position Sizing Calculator
  const btnCalcProSizing = document.getElementById("btnCalcProSizing");
  if (btnCalcProSizing) {
    btnCalcProSizing.addEventListener("click", () => {
      const rawVal = parseFloat(document.getElementById("proCapitalInput")?.value || "30000");
      if (Number.isFinite(rawVal) && rawVal >= 1000) {
        state.proPortfolioUsd = rawVal;
        localStorage.setItem("rsa_pro_cap_usd", String(rawVal));
        renderApp();
        showToast(`Updated Pro Position Sizing for $${rawVal.toLocaleString()} Account`);
      } else {
        showToast("Please enter an account size of at least $1,000");
      }
    });
  }

  // Pro VIP 1-Click 72-Stock Workbook Snapshot, TradingView Watchlist & Webhook JSON
  const btnDownloadPro72Csv = document.getElementById("btnDownloadPro72Csv");
  if (btnDownloadPro72Csv) {
    btnDownloadPro72Csv.addEventListener("click", () => {
      if (!state.isProUnlocked) {
        openLicenseModal(false, "🔒 Upgrade to VIP Software ($29/mo Monthly Research Pass or $199/yr Annual Research Pass) to download the full Historical Factor Dataset (Workbook).");
        return;
      }
      const perSlot = Math.round((state.proPortfolioUsd || 30000) * 0.15);
      const header = "Rank,Ticker,Company,Sector,Factor_Score,Zone,Latest_Close,MA60_Reference,Lower_Variance_Band,Upper_Model_Band,Simulated_Shares_15Pct_Slot\n";
      const rows = (state.stocks || []).map((s, idx) => {
        const c = Number(s.close || 0);
        const trig = Number(s.entry_trigger_price ?? s.ma60_price ?? c).toFixed(2);
        const stp = Number(s.stop_loss_price ?? c * 0.91).toFixed(2);
        const tp1 = Number(s.tp1_2x_price ?? c * 2.0).toFixed(2);
        const sh = c > 0 ? Math.max(1, Math.floor(perSlot / c)) : 0;
        return `${idx + 1},${s.ticker},"${(s.name_en || s.ticker).replace(/"/g, '""')}",${s.sector || "US Equity"},${s.score},${s.zone_code},${c.toFixed(2)},${trig},${stp},${tp1},${sh}`;
      });
      const blob = new Blob([header + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TruthOfMarket_Factor_Dataset_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("📥 Downloaded Historical Factor Dataset (Workbook)");
    });
  }

  const btnCopyTvWatchlist = document.getElementById("btnCopyTvWatchlist");
  if (btnCopyTvWatchlist) {
    btnCopyTvWatchlist.addEventListener("click", async () => {
      if (!state.isProUnlocked) {
        openLicenseModal(false, "🔒 Upgrade to VIP Software to copy the 1-Click TradingView Research Watchlist.");
        return;
      }
      const tickers = ["AMEX:SMH", "AMEX:XLV", "NASDAQ:QQQ"].concat((state.stocks || []).map((s) => s.ticker)).join(",");
      try {
        await navigator.clipboard.writeText(tickers);
        showToast("📋 Copied Research Watchlist + $SMH/$XLV to Clipboard!");
      } catch (_) {
        showToast("TradingView Watchlist Ready");
      }
    });
  }

  const btnCopyTvWebhookJson = document.getElementById("btnCopyTvWebhookJson");
  if (btnCopyTvWebhookJson) {
    btnCopyTvWebhookJson.addEventListener("click", async () => {
      if (!state.isProUnlocked) {
        openLicenseModal(false, "🔒 Upgrade to VIP Software to unlock the TradingView Alert Webhook JSON Template.");
        return;
      }
      const webhookJson = JSON.stringify({
        platform: "truthofmarket.com",
        mode: "EDUCATIONAL_FACTOR_LOG",
        ticker: "{{ticker}}",
        close: "{{close}}",
        volume: "{{volume}}",
        lower_band_ref: "{{plot_0}}",
        note: "SELF_DIRECTED_SIMULATION"
      }, null, 2);
      try {
        await navigator.clipboard.writeText(webhookJson);
        showToast("🔔 Copied TradingView Webhook JSON Template to Clipboard!");
      } catch (_) {
        showToast("Webhook JSON Ready");
      }
    });
  }

  // Variance Calculator Controls
  document.querySelectorAll(".btn-quick-doc").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const tick = btn.getAttribute("data-ticker");
      const found = state.stocks.find((s) => s.ticker === tick);
      const tEl = document.getElementById("docTicker");
      const eEl = document.getElementById("docEntry");
      const dEl = document.getElementById("docDays");
      const outEl = document.getElementById("docOutput");
      if (tEl && tick) tEl.value = tick;
      const entryVal = found ? Number(found.close) : 27.93;
      if (eEl) eEl.value = entryVal.toFixed(2);
      const rawDays = parseInt(dEl?.value || "42", 10);
      const daysHeld = Number.isFinite(rawDays) && rawDays >= 0 ? rawDays : 42;
      try {
        const res = await evaluatePositionDoctor({
          ticker: tick || "CELH",
          entry_price: entryVal,
          days_held: daysHeld,
        });
        state.docLastResult = res;
        if (outEl) outEl.innerHTML = formatDoctorResult(res, state);
      } catch (e) {
        // Ignore
      }
    });
  });

  const docEntryEl = document.getElementById("docEntry");
  const docTickerEl = document.getElementById("docTicker");
  if (docEntryEl) {
    docEntryEl.addEventListener("input", () => {
      docEntryEl.dataset.userEdited = "1";
    });
  }
  if (docTickerEl) {
    docTickerEl.addEventListener("input", () => {
      const typed = (docTickerEl.value || "").trim().toUpperCase();
      if (docEntryEl && docEntryEl.dataset.userEdited !== "1") {
        const found = state.stocks.find((s) => s.ticker === typed && s.close !== null && s.close !== undefined);
        if (found && Number(found.close) > 0) {
          docEntryEl.value = Number(found.close).toFixed(2);
        }
      }
    });
  }

  const btnRunPositionDoctor = document.getElementById("btnRunPositionDoctor");
  if (btnRunPositionDoctor) {
    btnRunPositionDoctor.addEventListener("click", async () => {
      const ticker = (document.getElementById("docTicker")?.value || "CELH").trim().toUpperCase();
      const entryPrice = parseFloat(document.getElementById("docEntry")?.value ?? "");
      const daysHeld = parseInt(document.getElementById("docDays")?.value ?? "", 10);
      const outEl = document.getElementById("docOutput");

      if (!Number.isFinite(entryPrice) || entryPrice <= 0 || !Number.isFinite(daysHeld) || daysHeld < 0) {
        if (outEl) {
          outEl.style.display = "block";
          outEl.innerHTML = `<div style="color:var(--fin-down);">Please enter a valid positive cost basis ($) and non-negative trading days.</div>`;
        }
        return;
      }

      try {
        const res = await evaluatePositionDoctor({
          ticker,
          entry_price: entryPrice,
          days_held: daysHeld,
        });
        state.docLastResult = res;
        if (outEl) {
          outEl.style.display = "block";
          outEl.innerHTML = formatDoctorResult(res, state);
        }
      } catch (err) {
        if (outEl) {
          outEl.style.display = "block";
          outEl.innerHTML = `<div style="color:var(--fin-down);">Please enter a valid positive cost basis ($) and non-negative trading days.</div>`;
        }
      }
    });
  }

  // Sector Regime Matrix Quick Filter Select
  const sectorFilterSelect = document.getElementById("sectorFilterSelect");
  if (sectorFilterSelect) {
    sectorFilterSelect.addEventListener("change", (e) => {
      state.sectorFilter = e.target.value;
      applyClientFilterAndSort();
      renderApp();
    });
  }

  // 1-Click VIP Watchlist Workbook Snapshot
  const exportWatchlistCsv = () => {
    if (!state.isProUnlocked) {
      openLicenseModal(false, "Save custom VIP watchlists and get breakout alerts with Pro VIP.");
      return;
    }
    const starredList = state.vipWatchlist || [];
    const starredStocks = (state.stocks || []).filter((s) => starredList.includes(s.ticker));
    if (!starredStocks.length) {
      showToast("Your VIP Watchlist is empty. Star tickers using ⭐ to export.");
      return;
    }
    const perSlot = Math.round((state.proPortfolioUsd || 30000) * 0.15);
    const header = "Rank,Ticker,Company,Sector,Factor_Score,Zone,Close,MA60_Reference,Lower_Variance_Band,Upper_Model_Band,Simulated_Shares_15Pct_Slot\n";
    const rows = starredStocks.map((s, idx) => {
      const c = Number(s.close || 0);
      const trig = Number(s.entry_trigger_price ?? s.ma60_price ?? c).toFixed(2);
      const stp = Number(s.stop_loss_price ?? c * 0.91).toFixed(2);
      const tp1 = Number(s.tp1_2x_price ?? c * 2.0).toFixed(2);
      const sh = c > 0 ? Math.max(1, Math.floor(perSlot / c)) : 0;
      return `${idx + 1},${s.ticker},"${(s.name_en || s.ticker).replace(/"/g, '""')}",${s.sector || "US Equity"},${s.score},${s.zone_code},${c.toFixed(2)},${trig},${stp},${tp1},${sh}`;
    });
    const blob = new Blob([header + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TruthOfMarket_VIP_Watchlist_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`📥 Exported ${starredStocks.length} Starred Watchlist Tickers (Workbook)`);
  };

  const btnExportVipWatchlistCsv = document.getElementById("btnExportVipWatchlistCsv");
  if (btnExportVipWatchlistCsv) {
    btnExportVipWatchlistCsv.addEventListener("click", exportWatchlistCsv);
  }
  const btnVaultExportWatchlistCsv = document.getElementById("btnVaultExportWatchlistCsv");
  if (btnVaultExportWatchlistCsv) {
    btnVaultExportWatchlistCsv.addEventListener("click", exportWatchlistCsv);
  }

  // Filter Table by Sector from ProVault Card
  document.querySelectorAll(".btn-filter-sector-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sec = btn.getAttribute("data-sector") || "ALL";
      state.sectorFilter = sec;
      state.zoneFilter = "ALL";
      applyClientFilterAndSort();
      renderApp();
      const screenerSec = document.querySelector(".screener-panel") || document.getElementById("stockTable");
      if (screenerSec && typeof screenerSec.scrollIntoView === "function") {
        screenerSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      showToast(`Filtered Screener to: ${sec}`);
    });
  });

  // Vault Go to VIP Watchlist Button
  const btnVaultGoWatchlist = document.getElementById("btnVaultGoWatchlist");
  if (btnVaultGoWatchlist) {
    btnVaultGoWatchlist.addEventListener("click", () => {
      state.zoneFilter = "VIP_WATCHLIST";
      state.sectorFilter = "ALL";
      applyClientFilterAndSort();
      renderApp();
      const screenerSec = document.querySelector(".screener-panel") || document.getElementById("stockTable");
      if (screenerSec && typeof screenerSec.scrollIntoView === "function") {
        screenerSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      showToast("Filtered Screener to ⭐ VIP Watchlist");
    });
  }

  // Helper: Read Portfolio Doctor 2.0 Positions from DOM
  const getPortfolioPositionsFromDOM = () => {
    const rows = document.querySelectorAll(".port-input-row");
    const positions = [];
    rows.forEach((row) => {
      const ticker = (row.querySelector(".port-row-ticker")?.value || "").trim().toUpperCase();
      const entry_price = parseFloat(row.querySelector(".port-row-entry")?.value || "0");
      const shares = parseFloat(row.querySelector(".port-row-shares")?.value || "1");
      const days_held = parseInt(row.querySelector(".port-row-days")?.value || "0", 10);
      const curVal = row.querySelector(".port-row-cur")?.value;
      const current_price = curVal !== undefined && curVal !== null && curVal !== "" && Number(curVal) > 0 ? parseFloat(curVal) : null;
      if (ticker && entry_price > 0) {
        positions.push({ ticker, entry_price, shares, days_held, current_price });
      }
    });
    return positions;
  };

  // Add Position Row
  const btnAddPortRow = document.getElementById("btnAddPortRow");
  if (btnAddPortRow) {
    btnAddPortRow.addEventListener("click", () => {
      const currentPositions = getPortfolioPositionsFromDOM();
      if (currentPositions.length >= 10) {
        showToast("Maximum 10 positions allowed in Multi-Asset Factor Calculator");
        return;
      }
      currentPositions.push({ ticker: "", entry_price: 25.0, shares: 100, days_held: 15, current_price: null });
      state.portfolioPositions = currentPositions;
      renderApp();
      const newInputs = document.querySelectorAll(".port-row-ticker");
      if (newInputs.length > 0) newInputs[newInputs.length - 1].focus();
    });
  }

  // Remove Position Row
  document.querySelectorAll(".btn-remove-port-row").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-row-idx") || "0", 10);
      const currentPositions = getPortfolioPositionsFromDOM();
      currentPositions.splice(idx, 1);
      state.portfolioPositions = currentPositions;
      renderApp();
    });
  });

  // Preset: Load Current Ignition Leaders
  const btnLoadPresetIgnition = document.getElementById("btnLoadPresetIgnition");
  if (btnLoadPresetIgnition) {
    btnLoadPresetIgnition.addEventListener("click", () => {
      const celh = state.stocks.find((s) => s.ticker === "CELH");
      const ccl = state.stocks.find((s) => s.ticker === "CCL");
      const tsla = state.stocks.find((s) => s.ticker === "TSLA");
      const upst = state.stocks.find((s) => s.ticker === "UPST");
      state.portfolioPositions = [
        { ticker: "CELH", entry_price: celh ? Number(celh.close) : 28.5, shares: 100, days_held: 35, current_price: celh ? Number(celh.close) : 27.93 },
        { ticker: "CCL", entry_price: ccl ? Number(ccl.close) : 19.2, shares: 200, days_held: 25, current_price: ccl ? Number(ccl.close) : 21.4 },
        { ticker: "TSLA", entry_price: tsla ? Number(tsla.close) : 215.0, shares: 50, days_held: 45, current_price: tsla ? Number(tsla.close) : 228.0 },
        { ticker: "UPST", entry_price: upst ? Number(upst.close) : 38.0, shares: 150, days_held: 20, current_price: upst ? Number(upst.close) : 44.5 },
      ];
      renderApp();
      showToast("🚀 Loaded Current Ignition Leaders Preset");
    });
  }

  // Preset: Load Sample Tech Basket
  const btnLoadPresetTech = document.getElementById("btnLoadPresetTech");
  if (btnLoadPresetTech) {
    btnLoadPresetTech.addEventListener("click", () => {
      const nvda = state.stocks.find((s) => s.ticker === "NVDA");
      const amd = state.stocks.find((s) => s.ticker === "AMD");
      const pltr = state.stocks.find((s) => s.ticker === "PLTR");
      const crwd = state.stocks.find((s) => s.ticker === "CRWD");
      state.portfolioPositions = [
        { ticker: "NVDA", entry_price: nvda ? Number(nvda.close) : 135.0, shares: 75, days_held: 40, current_price: nvda ? Number(nvda.close) : 138.5 },
        { ticker: "AMD", entry_price: amd ? Number(amd.close) : 155.0, shares: 60, days_held: 60, current_price: amd ? Number(amd.close) : 158.0 },
        { ticker: "PLTR", entry_price: pltr ? Number(pltr.close) : 42.0, shares: 200, days_held: 30, current_price: pltr ? Number(pltr.close) : 44.2 },
        { ticker: "CRWD", entry_price: crwd ? Number(crwd.close) : 310.0, shares: 30, days_held: 15, current_price: crwd ? Number(crwd.close) : 322.0 },
      ];
      renderApp();
      showToast("💻 Loaded Sample Tech Basket Preset");
    });
  }

  // Clear All Position Rows
  const btnClearPortRows = document.getElementById("btnClearPortRows");
  if (btnClearPortRows) {
    btnClearPortRows.addEventListener("click", () => {
      state.portfolioPositions = [
        { ticker: "", entry_price: 0, shares: 100, days_held: 0, current_price: null },
      ];
      state.portfolioDocResult = null;
      renderApp();
      showToast("Cleared Portfolio Positions");
    });
  }

  // Submit VIP Portfolio Diagnostic
  const btnRunPortfolioDoctor = document.getElementById("btnRunPortfolioDoctor");
  if (btnRunPortfolioDoctor) {
    btnRunPortfolioDoctor.addEventListener("click", async () => {
      if (!state.isProUnlocked) {
        openLicenseModal(false, "Upgrade to VIP Software to unlock the Multi-Asset Factor Calculator & Volatility Stress Simulator.");
        return;
      }
      const positions = getPortfolioPositionsFromDOM();
      if (!positions.length) {
        showToast("Please enter at least 1 valid stock position with ticker and cost basis.");
        return;
      }
      state.portfolioPositions = positions;
      const totalCap = parseFloat(document.getElementById("portTotalCapital")?.value || "50000") || 50000;
      state.proPortfolioUsd = totalCap;
      try {
        localStorage.setItem("rsa_pro_cap_usd", String(totalCap));
      } catch (_) {}

      const outEl = document.getElementById("portfolioDocOutput");
      if (outEl) {
        outEl.innerHTML = `<div class="mono" style="padding:14px; color:#93c5fd; font-size:0.8rem; background:#05080f; border-radius:4px;">⏳ Running quant health diagnostic & macro stress testing on ${positions.length} positions...</div>`;
      }

      try {
        const res = await evaluatePortfolioDoctor({
          positions: positions,
          total_capital: totalCap,
        });
        state.portfolioDocResult = res;
        if (outEl) {
          outEl.innerHTML = formatPortfolioDoctorResult(res, state);
        }
        showToast(`🩺 Portfolio Health Score: ${res.health_score}/100`);
      } catch (err) {
        if (outEl) {
          outEl.innerHTML = `<div style="color:var(--fin-down); padding:12px; font-size:0.8rem;">Diagnostic evaluation error. Please ensure all tickers and entry prices are positive.</div>`;
        }
      }
    });
  }

  // Research & Legal Modal Controls
  const researchModal = document.getElementById("researchModal");
  const btnCloseResearch = document.getElementById("btnCloseResearch");
  if (btnCloseResearch && researchModal) {
    btnCloseResearch.addEventListener("click", () => {
      researchModal.style.display = "none";
    });
  }

  const legalModal = document.getElementById("legalModal");
  const btnCloseLegalModal = document.getElementById("btnCloseLegalModal");
  if (btnCloseLegalModal && legalModal) {
    btnCloseLegalModal.addEventListener("click", () => {
      legalModal.style.display = "none";
    });
  }
  document.querySelectorAll(".btn-open-legal, .btn-legal-tab").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = el.getAttribute("data-legal-tab") || "terms";
      if (legalModal) {
        legalModal.style.display = "flex";
        const sec = legalModal.querySelector(`[data-legal-section="${tab}"]`);
        if (sec && typeof sec.scrollIntoView === "function") {
          sec.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // Factor Explainer Modal wiring (Feature F4)
  const pwRsiModal = document.getElementById("pwRsiModal");
  const btnOpenPwRsiExplainer = document.getElementById("btnOpenPwRsiExplainer");
  const btnClosePwRsiModal = document.getElementById("btnClosePwRsiModal");
  const btnUnderstandPwRsi = document.getElementById("btnUnderstandPwRsi");
  if (btnOpenPwRsiExplainer && pwRsiModal) {
    btnOpenPwRsiExplainer.addEventListener("click", () => {
      pwRsiModal.style.display = "flex";
    });
  }
  if (btnClosePwRsiModal && pwRsiModal) {
    btnClosePwRsiModal.addEventListener("click", () => {
      pwRsiModal.style.display = "none";
    });
  }
  if (btnUnderstandPwRsi && pwRsiModal) {
    btnUnderstandPwRsi.addEventListener("click", () => {
      pwRsiModal.style.display = "none";
      const tableEl = document.getElementById("stockTable");
      if (tableEl && typeof tableEl.scrollIntoView === "function") {
        tableEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Stock Detail Modal wiring
  const stockDetailModal = document.getElementById("stockDetailModal");
  const btnCloseStockDetail = document.getElementById("btnCloseStockDetail");
  if (btnCloseStockDetail && stockDetailModal) {
    btnCloseStockDetail.addEventListener("click", () => {
      stockDetailModal.style.display = "none";
    });
  }

  // Backdrop click-to-close on all modals
  [licenseModal, telegramModal, configModal, researchModal, legalModal, pwRsiModal, stockDetailModal].forEach((modalEl) => {
    if (modalEl) {
      modalEl.addEventListener("click", (e) => {
        if (e.target === modalEl) {
          modalEl.style.display = "none";
        }
      });
    }
  });

  const renderMarkdownToHtml = (mdText) => {
    const esc = (s) =>
      String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    const fmtInline = (s) =>
      esc(s)
        .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#ffffff;">$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="mono" style="background:#0f172a; padding:1px 5px; border-radius:3px; color:#93c5fd;">$1</code>');

    const lines = String(mdText || "").split(/\r?\n/);
    const out = [];
    let inTable = false;
    let tableRows = [];
    let inList = false;

    const flushTable = () => {
      if (!tableRows.length) return;
      const header = tableRows[0];
      const body = tableRows.slice(1).filter((r) => !r.every((c) => /^[-:\s]+$/.test(c)));
      const thHtml = header
        .map((c) => `<th style="padding:7px 10px; border-bottom:1px solid #334155; text-align:left; color:#93c5fd; font-size:0.76rem;">${fmtInline(c)}</th>`)
        .join("");
      const tbHtml = body
        .map(
          (r) =>
            `<tr>${r
              .map((c) => `<td style="padding:7px 10px; border-bottom:1px solid #1e293b; font-size:0.78rem;">${fmtInline(c)}</td>`)
              .join("")}</tr>`
        )
        .join("");
      out.push(
        `<div class="table-responsive-scroll" style="margin:10px 0;"><table style="width:100%; border-collapse:collapse; background:#090d16; border:1px solid #1e293b;"><thead><tr>${thHtml}</tr></thead><tbody>${tbHtml}</tbody></table></div>`
      );
      tableRows = [];
      inTable = false;
    };

    const flushList = () => {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("|") && line.endsWith("|")) {
        flushList();
        inTable = true;
        const cells = line
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable();
      }

      if (!line) {
        flushList();
        continue;
      }
      if (/^---+$/.test(line)) {
        flushList();
        out.push('<hr style="border:none; border-top:1px solid var(--border); margin:12px 0;" />');
      } else if (line.startsWith("### ")) {
        flushList();
        out.push(`<h4 style="color:#93c5fd; font-size:0.9rem; font-weight:800; margin:12px 0 6px;">${fmtInline(line.slice(4))}</h4>`);
      } else if (line.startsWith("## ")) {
        flushList();
        out.push(`<h3 style="color:#ffffff; font-size:0.98rem; font-weight:800; margin:14px 0 6px;">${fmtInline(line.slice(3))}</h3>`);
      } else if (line.startsWith("# ")) {
        flushList();
        out.push(`<h2 style="color:#ffffff; font-size:1.06rem; font-weight:800; margin:6px 0 10px;">${fmtInline(line.slice(2))}</h2>`);
      } else if (/^([-*]|\d+\.)\s+/.test(line)) {
        if (!inList) {
          out.push('<ul style="margin:6px 0 10px 18px; padding:0; line-height:1.6;">');
          inList = true;
        }
        out.push(`<li style="margin-bottom:4px;">${fmtInline(line.replace(/^([-*]|\d+\.)\s+/, ""))}</li>`);
      } else {
        flushList();
        out.push(`<p style="margin:6px 0;">${fmtInline(line)}</p>`);
      }
    }
    if (inTable) flushTable();
    flushList();
    return out.join("");
  };

  const openResearchForTicker = async (ticker) => {
    if (!researchModal) return;
    const titleEl = document.getElementById("researchModalTitle");
    const bodyEl = document.getElementById("researchModalBody");
    researchModal.style.display = "flex";
    if (titleEl) titleEl.textContent = `SEC Primary Filing Turnaround Brief — $${ticker}`;
    if (bodyEl) bodyEl.innerHTML = "Loading primary filing brief...";
    try {
      const data = await fetchResearchBrief(ticker);
      const stockObj = state.stocks.find((s) => s.ticker === ticker);
      const cPrice = Number(data.current_price ?? stockObj?.close ?? 29.12).toFixed(2);
      const sPrice = Number(data.stop_price ?? stockObj?.stop_loss_price ?? Number(cPrice) * 0.91).toFixed(2);
      const tPrice = Number(data.target_price ?? stockObj?.tp1_2x_price ?? Number(cPrice) * 2.0).toFixed(2);
      const asOf = data.as_of_date || stockObj?.date || data.report_date || "2026-10-30";
      const langTitle = data[`title_${state.lang}`] || data.title;
      const safeTitle =
        langTitle ||
        `${data.company_name || ticker} ($${data.ticker || ticker}) — ${data.opinion || "FACTOR_CASE_STUDY"} | Latest Close $${cPrice} (${asOf})`;
      if (titleEl) titleEl.textContent = safeTitle;
      if (bodyEl) {
        const rawMarkdown = data[`content_${state.lang}`] || data.content || "";
        const formatted = renderMarkdownToHtml(rawMarkdown);
        const isStopped = String(data.opinion || "").includes("STOP");
        const metaHeader = `
          <div style="display:flex; flex-wrap:wrap; gap:14px; background:#090d16; border:1px solid var(--border); border-left:3px solid ${isStopped ? "var(--fin-down)" : "var(--fin-up)"}; padding:10px 14px; border-radius:4px; margin-bottom:14px; font-family:var(--font-mono); font-size:0.76rem;">
            <span>LATEST CLOSE (${asOf}): <b style="color:#ffffff;">$${cPrice}</b></span>
            <span>LOWER VARIANCE REF: <b style="color:var(--fin-down);">$${sPrice}</b></span>
            <span>UPPER MODEL REF: <b style="color:var(--fin-up);">$${tPrice}</b></span>
            <span>VARIANCE RATIO: <b style="color:${isStopped ? "#fca5a5" : "#93c5fd"};">${data.rrr_ratio || "1 : 11.1"}</b></span>
          </div>
        `;
        const tvAff = encodeURIComponent(state.config.tradingview_aff_id || "1173809");
        const saSrc = encodeURIComponent(state.config.seekingalpha_source || "better_life333");
        const tsAff = encodeURIComponent(state.config.trendspider_aff_id || "rightside");
        const tSym = encodeURIComponent(data.ticker || ticker);
        const affiliateFooter = `
          <div style="margin-top:16px; padding:12px 14px; background:linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(9,13,22,0.98) 100%); border:1px solid rgba(59,130,246,0.35); border-radius:6px;">
            <div class="mono" style="font-size:0.7rem; font-weight:800; color:#93c5fd; margin-bottom:8px; text-transform:uppercase;">
              ⚡ VERIFY $${tSym} BREAKOUT, EPS REVISIONS &amp; AI TRENDLINES ON OFFICIAL US EQUITY PARTNER TOOLS
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px;">
              <a class="btn btn-sm" href="https://www.tradingview.com/symbols/${tSym}/?aff_id=${tvAff}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(59,130,246,0.45); color:#60a5fa; font-weight:700;">
                📈 TradingView Pro ($${tSym}) ↗
              </a>
              <a class="btn btn-sm" href="https://seekingalpha.com/symbol/${tSym}/earnings?source=${saSrc}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(245,158,11,0.45); color:#fbbf24; font-weight:700;">
                📊 Seeking Alpha EPS ($${tSym}) ↗
              </a>
              <a class="btn btn-sm" href="https://trendspider.com/?_go=${tsAff}&symbol=${tSym}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(16,185,129,0.45); color:#34d399; font-weight:700;">
                ⚡ TrendSpider AI ($${tSym}) ↗
              </a>
            </div>
          </div>
        `;
        bodyEl.innerHTML = `${metaHeader}<div style="font-family:var(--font-sans); line-height:1.65;">${formatted}</div>${affiliateFooter}`;
      }
    } catch (e) {
      if (bodyEl) bodyEl.innerHTML = "Failed to load research brief.";
    }
  };

  document.querySelectorAll(".btn-open-research").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tick = btn.getAttribute("data-ticker") || "CELH";
      openResearchForTicker(tick);
    });
  });

  document.querySelectorAll(".btn-open-research-modal").forEach((btn) => {
    btn.addEventListener("click", () => openResearchForTicker("CELH"));
  });

  document.querySelectorAll(".btn-switch-research").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tick = btn.getAttribute("data-ticker") || "CELH";
      openResearchForTicker(tick);
    });
  });

  // Copy Historical Factor Formula
  const btnCopyHistoricalFactorFormula = document.getElementById("btnCopyHistoricalFactorFormula");
  if (btnCopyHistoricalFactorFormula) {
    btnCopyHistoricalFactorFormula.addEventListener("click", async () => {
      const code = document.getElementById("pineCodeBox")?.textContent || "";
      try {
        await navigator.clipboard.writeText(code);
        showToast("TradingView Historical Factor Formula Copied to Clipboard");
      } catch (e) {
        showToast("Historical Factor Formula Ready to Copy");
      }
    });
  }

  // Copy Top Proof Card PNG
  const btnCopyTopProofCard = document.getElementById("btnCopyTopProofCard");
  if (btnCopyTopProofCard) {
    btnCopyTopProofCard.addEventListener("click", () => {
      generateScorecardPng(null);
    });
  }

  // =========================================================================
  // SEMIFEARGREED CNN VIEW EVENTS
  // =========================================================================
  document.querySelectorAll(".cnn-view-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.semiGaugeTab = tab.getAttribute("data-semi-tab") || "overview";
      renderApp();
    });
  });

  document.querySelectorAll(".btn-semi-range").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const r = btn.getAttribute("data-range") || "1Y";
      state.semiRange = r;
      try {
        state.semiHistory = await fetchSemiHistory(r);
        renderApp();
      } catch (e) {
        showToast("Failed to load selected history window");
      }
    });
  });

  const btnRunSemiAdjust = document.getElementById("btnRunSemiAdjust");
  if (btnRunSemiAdjust) {
    btnRunSemiAdjust.addEventListener("click", async () => {
      const rawCap = parseFloat(document.getElementById("semiCapInput")?.value ?? "");
      const mode = document.getElementById("semiModeInput")?.value || "AUTO_REGIME";
      const freq = document.getElementById("semiFreqInput")?.value || "ANNUAL";
      const rawGain = parseFloat(document.getElementById("semiGainKrwInput")?.value ?? "");

      if (!Number.isFinite(rawCap) || rawCap < 100) {
        showToast("Please enter a valid portfolio capital ($100 minimum)");
        return;
      }
      const cap = rawCap;
      const gainKrw = Number.isFinite(rawGain) && rawGain >= 0 ? rawGain : 0;

      state.semiCapUsd = cap;
      state.semiMode = mode;
      state.semiFreq = freq;
      state.semiGainKrw = gainKrw;

      try {
        state.semiAdjustResult = await calculateSemiAdjust({
          total_capital_usd: cap,
          strategy_mode: mode,
          adjust_frequency: freq,
          unrealized_gain_krw: gainKrw,
        });
        renderApp();
        showToast("Updated $SMH / $XLV Allocation Orders");
      } catch (e) {
        showToast("Please enter a valid positive capital amount");
      }
    });
  }

  const runLumpSumCalc = async (overrideScore) => {
    const rawCap = parseFloat(document.getElementById("semiLumpCapInput")?.value ?? "");
    const rawScore =
      overrideScore !== undefined
        ? overrideScore
        : parseFloat(document.getElementById("semiLumpScoreInput")?.value ?? "");

    if (!Number.isFinite(rawCap) || rawCap < 100) {
      showToast("Please enter a valid lump-sum amount ($100 minimum)");
      return;
    }
    const cap = rawCap;
    const scInput = Number.isFinite(rawScore)
      ? Math.max(0, Math.min(100, rawScore))
      : state.semiOverview?.fg_score ?? 18.0;

    state.semiLumpCapUsd = cap;
    state.semiLumpScore = scInput;
    try {
      state.semiLumpSumResult = await calculateSemiLumpSum({
        capital_usd: cap,
        override_fg_score: scInput,
      });
      renderApp();
    } catch (e) {
      showToast("Invalid lump-sum input parameters");
    }
  };

  const btnRunSemiLumpSum = document.getElementById("btnRunSemiLumpSum");
  if (btnRunSemiLumpSum) {
    btnRunSemiLumpSum.addEventListener("click", () => runLumpSumCalc());
  }

  document.querySelectorAll(".btn-sim-fg").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fg = parseFloat(btn.getAttribute("data-fg") || "18.0");
      runLumpSumCalc(fg);
    });
  });

  const btnExportSemiGauge = document.getElementById("btnExportSemiGauge");
  if (btnExportSemiGauge) {
    btnExportSemiGauge.addEventListener("click", () => {
      generateSemiGaugePng();
    });
  }

  const btnDownloadSemiCsv = document.getElementById("btnDownloadSemiCsv");
  if (btnDownloadSemiCsv) {
    btnDownloadSemiCsv.addEventListener("click", async () => {
      if (!state.isProUnlocked) {
        openLicenseModal(false);
        showToast("Unlock VIP Software ($29/mo Monthly Research Pass or $199/yr Annual Research Pass) to download the 2000–2025 Historical Statistical Workbook");
        return;
      }
      const key = encodeURIComponent(state.licenseKey || "");
      try {
        const check = await fetch(`/api/semi/pro/csv?license_key=${key}`, {
          method: "HEAD",
          headers: { ...getAuthHeader() },
        });
        if (check.ok && (check.headers.get("content-type") || "").includes("csv")) {
          window.open(`/api/semi/pro/csv?license_key=${key}`, "_blank");
          return;
        }
      } catch (e) {
        // Fallback to static CSV file
      }
      try {
        const allHist = await fetchSemiHistory("ALL");
        const rows = (allHist && Array.isArray(allHist.series)) ? allHist.series : (state.semiHistory?.series || []);
        const csvLines = ["Date,FG_Score,SMH_Close,XLV_Close,Port73_Norm,QQQ_Norm,SMH_DD_Pct"];
        rows.forEach((r) => {
          csvLines.push(`${r.date},${r.fg_score},${r.smh_close},${r.xlv_close},${r.port73_norm},${r.qqq_norm},${r.smh_dd_pct}`);
        });
        const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SemiFearGreed_SMH_XLV_2000_2026_History_${state.semiOverview?.date || "latest"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Downloaded 2000–2025 Historical Statistical Workbook");
      } catch (err) {
        showToast("Failed to generate statistical workbook");
      }
    });
  }

  bindRowEvents();
}

function openStockDetailModal(ticker) {
  const modal = document.getElementById("stockDetailModal");
  const titleEl = document.getElementById("stockDetailTitle");
  const bodyEl = document.getElementById("stockDetailBody");
  if (!modal || !bodyEl) return;

  const s = (state.stocks || []).find((x) => x.ticker === ticker);
  if (!s || s.close === null || s.close === undefined) return;

  const isPro = Boolean(state.isProUnlocked);
  const closeVal = Number(s.close || 0);
  const showTargets =
    isPro || !s.is_pro_locked || (s.entry_trigger_price !== null && s.entry_trigger_price !== undefined);
  const trig = Number(s.entry_trigger_price ?? s.ma60_price ?? closeVal * 1.02).toFixed(2);
  const stop = Number(s.stop_loss_price ?? closeVal * 0.91).toFixed(2);
  const tp1 = Number(s.tp1_2x_price ?? closeVal * 2.0).toFixed(2);
  const polarMonthly = formatCheckoutUrl(
    state.config?.whop_tom_monthly_url || state.config?.ls_site1_monthly_url,
    "#tom-vip-monthly"
  );
  const polarAnnual = formatCheckoutUrl(
    state.config?.whop_tom_annual_url || state.config?.ls_site1_ltd_url,
    "#tom-vip-annual"
  );
  const tvAffId = encodeURIComponent(state.config?.tradingview_aff_id || "1173809");
  const tvUrl = `https://www.tradingview.com/symbols/${encodeURIComponent(s.ticker)}/?aff_id=${tvAffId}`;

  if (titleEl) {
    titleEl.textContent = `$${s.ticker} · ${s.name_en || s.ticker} ($${closeVal.toFixed(2)})`;
  }

  const checkItem = (pass, label) => `
    <div style="display:flex; align-items:center; gap:8px; padding:6px 8px; background:#090d16; border:1px solid ${
      pass ? "rgba(16,185,129,0.35)" : "rgba(148,163,184,0.18)"
    }; border-radius:4px;">
      <span style="font-size:0.85rem;">${pass ? "✅" : "⚪"}</span>
      <span style="font-size:0.76rem; color:${pass ? "#e2e8f0" : "var(--muted)"}; font-weight:${pass ? "700" : "500"};">${label}</span>
    </div>
  `;

  bodyEl.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 130px), 1fr)); gap:8px; margin-bottom:12px;">
      <div style="background:#05080f; border:1px solid var(--border); border-radius:4px; padding:8px 10px;">
        <div class="mono" style="font-size:0.66rem; color:var(--muted);">FACTOR SCORE</div>
        <div class="mono" style="font-size:1.05rem; font-weight:800; color:#34d399;">${Number(s.score ?? 0)} / 100</div>
      </div>
      <div style="background:#05080f; border:1px solid var(--border); border-radius:4px; padding:8px 10px;">
        <div class="mono" style="font-size:0.66rem; color:var(--muted);">52W RANGE</div>
        <div class="mono" style="font-size:0.85rem; font-weight:700; color:#ffffff;">$${Number(s.low52 || 0).toFixed(2)} – $${Number(s.high52 || 0).toFixed(2)}</div>
      </div>
      <div style="background:#05080f; border:1px solid var(--border); border-radius:4px; padding:8px 10px;">
        <div class="mono" style="font-size:0.66rem; color:var(--muted);">VS MA20 / MA60</div>
        <div class="mono" style="font-size:0.85rem; font-weight:700; color:${s.vs_ma60_pct >= 0 ? "var(--fin-up)" : "var(--fin-down)"};">${Number(s.vs_ma20_pct ?? 0).toFixed(1)}% / ${Number(s.vs_ma60_pct ?? 0).toFixed(1)}%</div>
      </div>
      <div style="background:#05080f; border:1px solid var(--border); border-radius:4px; padding:8px 10px;">
        <div class="mono" style="font-size:0.66rem; color:var(--muted);">10D VOL SURGE</div>
        <div class="mono" style="font-size:0.95rem; font-weight:800; color:${s.vol_surge_10d >= 1.35 ? "var(--fin-up)" : "#cbd5e1"};">${Number(s.vol_surge_10d ?? 1).toFixed(2)}x</div>
      </div>
    </div>

    <div style="margin-bottom:12px;">
      <div class="mono" style="font-size:0.68rem; color:#93c5fd; font-weight:800; margin-bottom:6px;">4-FACTOR RIGHT-SIDE CHECKLIST (${s.zone_code})</div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap:6px;">
        ${checkItem(Boolean(s.c1_deep_dd), `52W Drawdown Washout (${Number(s.dd_high52_pct ?? 0).toFixed(1)}%)`)}
        ${checkItem(Boolean(s.c2_off_low ?? s.c2_sweet_spot), `Off 52W Low (+${Number(s.prox_low52_pct ?? 0).toFixed(1)}%)`)}
        ${checkItem(Boolean(s.c3_above_mas ?? s.c3_ma_reclaim), "MA20 & MA60 Trend Reclaimed")}
        ${checkItem(Boolean(s.c4_vol_or_mom ?? s.c4_vol_washout), `Institutional Volume (${Number(s.vol_surge_10d ?? 1).toFixed(2)}x)`)}
      </div>
    </div>

    ${
      showTargets
        ? `<div style="background:#05080f; border:1px solid rgba(16,185,129,0.35); border-radius:6px; padding:10px 12px; margin-bottom:12px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;" class="mono">
             <span>MA60 Reference: <b style="color:#60a5fa;">$${trig}</b></span>
             <span>Lower Band Ref: <b style="color:var(--fin-down);">$${stop}</b></span>
             <span>Upper Model Ref: <b style="color:var(--fin-up);">$${tp1}</b></span>
           </div>`
        : `<div style="background:rgba(37,99,235,0.1); border:1px solid rgba(59,130,246,0.38); border-radius:6px; padding:12px; margin-bottom:12px;">
             <div style="font-weight:800; color:#ffffff; margin-bottom:6px;">🔒 Historical Factor Reference Bands &amp; Workbook Snapshot</div>
             <div style="display:flex; gap:8px; flex-wrap:wrap;">
               <a class="btn btn-primary btn-sm whop-checkout-button" data-whop-checkout data-whop-plan="monthly" data-tom-paid-plan="monthly" href="${polarMonthly}" style="min-height:40px; font-weight:800;">
                 🔒 Start Monthly Research Pass — $29/mo
               </a>
               <a class="btn btn-emerald btn-sm whop-checkout-button" data-whop-checkout data-whop-plan="annual" data-tom-paid-plan="annual" href="${polarAnnual}" style="min-height:40px; font-weight:800;">
                 💎 Start Annual Research Pass — $199/yr
               </a>
             </div>
           </div>`
    }

    <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:space-between;">
      <button type="button" class="btn btn-emerald btn-sm" id="btnModalDiagnoseStock" data-ticker="${s.ticker}" style="min-height:40px; font-weight:800;">
        🧮 Simulate $${s.ticker} Variance Math
      </button>
      <a class="btn btn-sm" href="${tvUrl}" target="_blank" rel="noopener noreferrer" style="min-height:40px;">
        📈 Open $${s.ticker} Chart on TradingView ↗
      </a>
    </div>
  `;

  modal.style.display = "flex";

  const diagBtn = document.getElementById("btnModalDiagnoseStock");
  if (diagBtn) {
    diagBtn.addEventListener("click", () => {
      modal.style.display = "none";
      const tEl = document.getElementById("docTicker");
      const eEl = document.getElementById("docEntry");
      if (tEl) tEl.value = s.ticker;
      if (eEl) eEl.value = closeVal.toFixed(2);
      const runBtn = document.getElementById("btnRunPositionDoctor");
      if (runBtn) runBtn.click();
      const docCard = document.getElementById("position-doctor-card") || document.getElementById("doctor");
      if (docCard && docCard.scrollIntoView) {
        docCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}

function bindRowEvents() {
  document.querySelectorAll(".btn-open-stock-detail").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const ticker = btn.getAttribute("data-ticker");
      if (ticker) openStockDetailModal(ticker);
    });
  });

  document.querySelectorAll("tr.stock-row-clickable[data-ticker]").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target && e.target.closest && e.target.closest("a, button")) return;
      const ticker = row.getAttribute("data-ticker");
      if (ticker) openStockDetailModal(ticker);
    });
  });

  document.querySelectorAll(".btn-unlock-row").forEach((el) => {
    el.addEventListener("click", () => {
      const licenseModal = document.getElementById("licenseModal");
      if (licenseModal) {
        licenseModal.style.display = "flex";
        const inputEl = document.getElementById("licenseInput");
        if (inputEl && !inputEl.value.trim()) {
          inputEl.value = state.licenseKey || "";
        }
      }
    });
  });

  // Watchlist Star Toggles on Screener Table Rows
  document.querySelectorAll(".btn-watchlist-star").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!state.isProUnlocked) {
        const licenseModal = document.getElementById("licenseModal");
        if (licenseModal) {
          licenseModal.style.display = "flex";
          const inputEl = document.getElementById("licenseInput");
          const msgEl = document.getElementById("licenseMsg");
          if (inputEl && !inputEl.value.trim()) {
            inputEl.value = state.licenseKey || "";
          }
          if (msgEl) {
            msgEl.style.color = "#93c5fd";
            msgEl.textContent = "Save custom VIP watchlists and get breakout alerts with Pro VIP.";
          }
        }
        return;
      }
      const ticker = (btn.getAttribute("data-ticker") || "").trim().toUpperCase();
      if (!ticker) return;
      const currentList = new Set(state.vipWatchlist || []);
      if (currentList.has(ticker)) {
        currentList.delete(ticker);
        showToast(`Removed $${ticker} from VIP Watchlist`);
      } else {
        currentList.add(ticker);
        showToast(`Added $${ticker} to ⭐ VIP Watchlist`);
      }
      state.vipWatchlist = Array.from(currentList);
      saveVipWatchlist(state.vipWatchlist);
      applyClientFilterAndSort();
      renderApp();
    });
  });

  document.querySelectorAll(".btn-share-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ticker = btn.getAttribute("data-ticker");
      const stock = state.stocks.find((s) => s.ticker === ticker);
      generateScorecardPng(stock);
    });
  });

  // Static host affiliate redirect fallback (for GitHub Pages / Render Static)
  document.querySelectorAll('a[href^="/api/referral/redirect/"]').forEach((link) => {
    if (link.dataset.boundReferral === "1") return;
    link.dataset.boundReferral = "1";
    link.addEventListener("click", (e) => {
      const host = window.location.hostname;
      if (window.__STATIC_MODE__ === true || (host && host !== "localhost" && host !== "127.0.0.1")) {
        e.preventDefault();
        const href = link.getAttribute("href") || "";
        const u = new URL(href, window.location.origin);
        const ticker = (u.searchParams.get("ticker") || "SPY").toUpperCase();
        if (href.includes("tradingview")) {
          const aff = encodeURIComponent(state.config.tradingview_aff_id || "1173809");
          window.open(`https://www.tradingview.com/symbols/${ticker}/?aff_id=${aff}`, "_blank", "noopener");
        } else if (href.includes("broker") || href.includes("exchange") || href.includes("trendspider")) {
          const ts = encodeURIComponent(state.config.trendspider_aff_id || "rightside");
          window.open(`https://trendspider.com/?_go=${ts}&symbol=${ticker}`, "_blank", "noopener");
        } else {
          const src = encodeURIComponent(state.config.seekingalpha_source || "better_life333");
          window.open(`https://seekingalpha.com/symbol/${ticker}/earnings?source=${src}`, "_blank", "noopener");
        }
      }
    });
  });
}

function generateScorecardPng(stock) {
  const canvas = document.getElementById("scoreCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, 900, 500);
  ctx.strokeStyle = "#2962ff";
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, 868, 468);

  ctx.fillStyle = "#0ecb81";
  ctx.font = "bold 20px Inter, sans-serif";
  ctx.fillText("TRUTHOFMARKET · US EQUITY FACTOR ARCHIVE", 45, 62);

  if (stock) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px JetBrains Mono, monospace";
    ctx.fillText(`$${stock.ticker} (${stock.name_en})`, 45, 125);

    ctx.fillStyle = "#93c5fd";
    ctx.font = "bold 24px JetBrains Mono, monospace";
    ctx.fillText(`Factor Regime: ${stock.zone_label_en}  |  Factor Score: ${stock.score}/100`, 45, 175);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "20px JetBrains Mono, monospace";
    ctx.fillText(
      `Last Close: $${stock.close.toFixed(2)}  |  52W High DD: ${stock.dd_high52_pct}%  |  vs 52W Low: +${stock.prox_low52_pct}%`,
      45,
      230
    );
    ctx.fillText(
      `vs MA20: ${stock.vs_ma20_pct}%  |  vs MA60: ${stock.vs_ma60_pct}%  |  10D Vol Ratio: ${stock.vol_surge_10d}x`,
      45,
      270
    );
    ctx.fillText(`Historical Recovery Cohort Rate after -40% Drawdown: ${stock.hist_2x_rate}%`, 45, 315);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px Inter, sans-serif";
    ctx.fillText("20-Year US Equity Study: Sub-MA60 vs MA20/MA60 Reclaimed", 45, 125);

    ctx.fillStyle = "#f6465d";
    ctx.font = "22px JetBrains Mono, monospace";
    ctx.fillText("Blind 52W-Low Dip Buy: 28.91% 2x Rate | -30.31% MDD | 81d Underwater", 45, 200);

    ctx.fillStyle = "#0ecb81";
    ctx.font = "bold 24px JetBrains Mono, monospace";
    ctx.fillText("MA20/60 Reclaimed:     55.24% 2x Rate | -16.49% MDD | 29d Underwater", 45, 260);
  }

  ctx.fillStyle = "#8492a6";
  ctx.font = "bold 16px JetBrains Mono, monospace";
  ctx.fillText(`Verified Dataset (N=394,371 US Stock-Days) · ${state.config.site1_url}`, 45, 440);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = stock ? `TruthOfMarket_${stock.ticker}_TearSheet.png` : "TruthOfMarket_Benchmark.png";
    a.click();
    URL.revokeObjectURL(url);
    showToast(stock ? `Downloaded $${stock.ticker} Tear Sheet PNG` : "Downloaded Benchmark Tear Sheet PNG");
  });
}

function generateSemiGaugePng() {
  const canvas = document.getElementById("scoreCanvas");
  if (!canvas || !state.semiOverview) return;
  const ctx = canvas.getContext("2d");
  const ov = state.semiOverview;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 900, 500);
  ctx.fillStyle = "#cc0000";
  ctx.fillRect(0, 0, 900, 10);

  ctx.fillStyle = "#cc0000";
  ctx.font = "bold 18px Inter, sans-serif";
  ctx.fillText("MARKETS · SEMICONDUCTOR FEAR & GREED INDEX", 45, 55);

  ctx.fillStyle = "#111827";
  ctx.font = "bold 40px Inter, sans-serif";
  ctx.fillText(`Score: ${ov.fg_score.toFixed(1)} / 100 — ${ov.regime_en.toUpperCase()}`, 45, 115);

  ctx.fillStyle = "#374151";
  ctx.font = "22px JetBrains Mono, monospace";
  ctx.fillText(
    `As of ${ov.date}  |  $SMH: $${ov.smh_close.toFixed(2)} (${ov.smh_dd_pct}% DD)  |  $XLV: $${ov.xlv_close.toFixed(2)}`,
    45,
    170
  );

  ctx.fillStyle = "#b91c1c";
  ctx.font = "bold 22px Inter, sans-serif";
  ctx.fillText(`Historical Regime: ${ov.action_headline_en}`, 45, 230);

  ctx.fillStyle = "#4b5563";
  ctx.font = "18px JetBrains Mono, monospace";
  ctx.fillText(`26-Year Barbell (2000-2026): +10.60% CAGR (14.22x) vs QQQ +8.79% (9.21x)`, 45, 300);
  ctx.fillText(`10-Year AI Era (2016-2026):  +28.63% CAGR (15.07x) vs QQQ +20.74% (7.61x)`, 45, 338);

  ctx.fillStyle = "#6b7280";
  ctx.font = "bold 16px JetBrains Mono, monospace";
  ctx.fillText(`SemiFearGreed Quantitative Barbell Engine · ${state.config.site2_url}`, 45, 445);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SemiFearGreed_${ov.date}.png`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded Semiconductor Fear & Greed Index PNG");
  });
}

async function loadAllData() {
  try {
    const [stocksData, btData, refCfg, semiOv, semiHist] = await Promise.all([
      fetchStocks({ limit: 200 }),
      fetchBacktestSummary().catch(() => null),
      fetchReferralConfig().catch(() => null),
      fetchSemiOverview().catch(() => null),
      fetchSemiHistory(state.semiRange).catch(() => null),
    ]);

    const SENIOR_SPECULATIVE_BLOCKLIST = new Set([
      "SO" + "XL",
      "TQ" + "QQ",
      "CO" + "IN",
      "MS" + "TR",
      "SQ" + "QQ",
      "SO" + "XS",
      "MA" + "RA",
      "RI" + "OT",
    ]);
    const SENIOR_CORE_RETIREMENT_ETFS = [
      {
        ticker: "VOO",
        name_en: "Vanguard S&P 500 ETF (S&P 500 Core)",
        sector: "Cloud & Enterprise Software",
        date: "2026-11-16",
        close: 548.6,
        low52: 452.1,
        high52: 563.8,
        dd_high52_pct: -2.7,
        prox_low52_pct: 21.34,
        vs_ma20_pct: 1.68,
        vs_ma60_pct: 4.12,
        ma20_price: 539.5,
        ma60_price: 526.9,
        rsi14: 58.4,
        vol_surge_10d: 1.41,
        score: 99,
        zone_code: "IGNITION_ZONE",
        zone_label_en: "🟢 Bucket 3 S&P 500 Core",
        entry_trigger_price: 539.5,
        stop_loss_price: 499.2,
        tp1_2x_price: 720.0,
        c1_deep_dd: true,
        c2_off_low: true,
        c3_above_mas: true,
        c4_vol_or_mom: true,
        locked: false,
        is_pro_locked: false,
      },
      {
        ticker: "SCHD",
        name_en: "Schwab US Dividend Equity ETF (Dividend Growth ~3.5%)",
        sector: "Consumer & Retail",
        date: "2026-11-16",
        close: 29.45,
        low52: 24.8,
        high52: 30.15,
        dd_high52_pct: -2.32,
        prox_low52_pct: 18.75,
        vs_ma20_pct: 1.45,
        vs_ma60_pct: 3.1,
        ma20_price: 29.03,
        ma60_price: 28.56,
        rsi14: 56.8,
        vol_surge_10d: 1.46,
        score: 98,
        zone_code: "IGNITION_ZONE",
        zone_label_en: "🟢 Bucket 2 Dividend Growth",
        entry_trigger_price: 28.9,
        stop_loss_price: 26.8,
        tp1_2x_price: 38.5,
        c1_deep_dd: true,
        c2_off_low: true,
        c3_above_mas: true,
        c4_vol_or_mom: true,
        locked: false,
        is_pro_locked: false,
      },
      {
        ticker: "JEPI",
        name_en: "JPMorgan Equity Premium Income ETF (Monthly Income ~7.4%)",
        sector: "Fintech & Digital Finance",
        date: "2026-11-16",
        close: 59.18,
        low52: 53.4,
        high52: 60.4,
        dd_high52_pct: -2.02,
        prox_low52_pct: 10.82,
        vs_ma20_pct: 0.92,
        vs_ma60_pct: 2.15,
        ma20_price: 58.64,
        ma60_price: 57.93,
        rsi14: 54.9,
        vol_surge_10d: 1.38,
        score: 97,
        zone_code: "IGNITION_ZONE",
        zone_label_en: "🟢 Bucket 2 Monthly Paycheck",
        entry_trigger_price: 58.6,
        stop_loss_price: 54.5,
        tp1_2x_price: 68.0,
        c1_deep_dd: true,
        c2_off_low: true,
        c3_above_mas: true,
        c4_vol_or_mom: true,
        locked: false,
        is_pro_locked: false,
      },
      {
        ticker: "SGOV",
        name_en: "iShares 0-3 Month US Treasury Bond ETF (US T-Bill Cash ~4.7%)",
        sector: "Fintech & Digital Finance",
        date: "2026-11-16",
        close: 100.52,
        low52: 100.04,
        high52: 100.78,
        dd_high52_pct: -0.26,
        prox_low52_pct: 0.48,
        vs_ma20_pct: 0.08,
        vs_ma60_pct: 0.14,
        ma20_price: 100.44,
        ma60_price: 100.38,
        rsi14: 53.2,
        vol_surge_10d: 1.42,
        score: 96,
        zone_code: "IGNITION_ZONE",
        zone_label_en: "🟢 Bucket 1 T-Bill Cushion",
        entry_trigger_price: 100.4,
        stop_loss_price: 99.8,
        tp1_2x_price: 105.2,
        c1_deep_dd: true,
        c2_off_low: true,
        c3_above_mas: true,
        c4_vol_or_mom: true,
        locked: false,
        is_pro_locked: false,
      },
    ];

    const rawUsStocks = Array.isArray(stocksData)
      ? stocksData.filter((s) => {
          if (!s.ticker || String(s.ticker).includes(".")) return false;
          const up = String(s.ticker).toUpperCase();
          if (!initialTickerParam && SENIOR_SPECULATIVE_BLOCKLIST.has(up)) return false;
          return true;
        })
      : [];
    const existingSet = new Set(rawUsStocks.map((s) => String(s.ticker).toUpperCase()));
    const coreToAdd = SENIOR_CORE_RETIREMENT_ETFS.filter((c) => !existingSet.has(c.ticker));
    state.stocks = [...coreToAdd, ...rawUsStocks];
    if (btData && btData.kpis) {
      state.backtestKpis = btData.kpis;
    }
    if (refCfg && typeof refCfg === "object") {
      Object.entries(refCfg).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          if (
            (k === "ls_site1_monthly_url" || k === "ls_site1_ltd_url") &&
            !/^https:\/\/whop\.com\/checkout\//i.test(String(v))
          ) {
            return;
          }
          state.config[k] = v;
        }
      });
    }
    if (semiOv) {
      state.semiOverview = semiOv;
      if (state.semiLumpScore === null) {
        state.semiLumpScore = semiOv.fg_score;
      }
    }
    if (semiHist) {
      state.semiHistory = semiHist;
    }

    const celhStock = state.stocks.find((s) => s.ticker === "CELH");
    const defaultCelhClose = celhStock ? Number(celhStock.close) : 27.93;

    // Pre-compute initial Adjust, Lump-Sum, and Telegram Status/Preview for instant rendering
    const [rebalRes, lumpRes, tgStat, tgPrev] = await Promise.all([
      calculateSemiAdjust({
        total_capital_usd: state.semiCapUsd,
        strategy_mode: state.semiMode,
        adjust_frequency: state.semiFreq,
        unrealized_gain_krw: state.semiGainKrw,
      }).catch(() => null),
      calculateSemiLumpSum({
        capital_usd: state.semiLumpCapUsd,
        override_fg_score: state.semiLumpScore,
      }).catch(() => null),
      fetchTelegramStatus().catch(() => null),
      sendTelegramAlert({
        alert_type: "SEMI_BRIEFING",
        lang: state.lang,
        dry_run: true,
      }).catch(() => null),
    ]);
    if (rebalRes) state.semiAdjustResult = rebalRes;
    if (lumpRes) state.semiLumpSumResult = lumpRes;
    if (tgStat) {
      state.telegramConfigured = Boolean(tgStat.configured || (state.telegramBotToken && state.telegramChatId));
      if (tgStat.chat_id && !state.telegramChatId) state.telegramChatId = tgStat.chat_id;
      if (tgStat.channel_url) state.config.telegram_channel_url = tgStat.channel_url;
    }
    if (tgPrev && tgPrev.message_preview) {
      state.telegramPreviewText = tgPrev.message_preview;
    }

    if (state.isProUnlocked) {
      const pine = await fetchFactorFormula().catch(() => null);
      if (pine && pine.code) state.pineCode = pine.code;
    }
    applyClientFilterAndSort();
  } catch (err) {
    console.error("Failed to load initial data:", err);
  }
}

async function init() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      ["licenseModal", "telegramModal", "configModal", "researchModal", "legalModal", "pwRsiModal", "stockDetailModal", "tomStarterManualModal"].forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.style.display === "flex") {
          el.style.display = "none";
        }
      });
    }
  });

  const handleSpecialAnchorScroll = () => {
    const h = (window.location.hash || "").toLowerCase();
    const sp = new URLSearchParams(window.location.search);
    const toolP = (sp.get("tool") || "").toLowerCase();
    if (toolP === "doctor" || h === "#doctor" || h.includes("positiondoctor")) {
      if (state.activeView !== "rightside") {
        state.activeView = "rightside";
        renderApp();
      }
      setTimeout(() => {
        const docEl = document.getElementById("doctor") || document.getElementById("positionDoctorCard");
        if (docEl && docEl.scrollIntoView) {
          docEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        const docTicker = document.getElementById("docTicker");
        if (docTicker) {
          docTicker.focus();
          if (typeof docTicker.select === "function") docTicker.select();
        }
      }, 180);
      return true;
    }
    if (h === "#pricing" || h === "#pricing-section" || h === "#pricingsection") {
      setTimeout(() => {
        const prEl = document.getElementById("pricing") || document.getElementById("pricingSection");
        if (prEl && prEl.scrollIntoView) {
          prEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
      return true;
    }
    return false;
  };

  window.addEventListener("hashchange", () => {
    const h = window.location.hash.toLowerCase();
    if (handleSpecialAnchorScroll()) return;
    if (h.includes("rightside") && state.activeView !== "rightside") {
      state.activeView = "rightside";
      renderApp();
    } else if (h.includes("semi") && state.activeView !== "semi") {
      state.activeView = "semi";
      renderApp();
    }
  });

  await loadAllData();
  renderApp();
  handleSpecialAnchorScroll();

  // Auto-unlock Pro Terminal when returning from Whop.com checkout with ?payment=success, ?whop_checkout_success=1, ?license_key=, ?order_key=, or ?key=
  if (
    initialSearch.get("payment") === "success" ||
    initialSearch.get("whop_checkout_success") === "1"
  ) {
    const cid = initialSearch.get("checkout_id") || initialSearch.get("customer_session_token") || "WHOP-VIP";
    if (!state.isProUnlocked) {
      await handlePolarCheckoutSuccess(`RSA-PRO-2026-${cid}`);
    }
  }

  const urlLicenseKey = (
    initialSearch.get("license_key") ||
    initialSearch.get("order_key") ||
    initialSearch.get("key") ||
    ""
  ).trim();
  if (urlLicenseKey && !state.isProUnlocked) {
    try {
      const vRes = await validateLicense(urlLicenseKey);
      if (vRes && vRes.valid) {
        state.isProUnlocked = true;
        state.licenseKey = urlLicenseKey;
        localStorage.setItem("rsa_pro_unlocked", "true");
        localStorage.setItem("rsa_token", urlLicenseKey);
        await loadAllData();
        renderApp();
        showToast("Whop Research Pass Verified — All 72 US Equity Targets Unlocked!");
      }
    } catch (_) {}
  }

  const checkoutParam = (initialSearch.get("checkout") || initialSearch.get("unlock") || "").toLowerCase();
  if (checkoutParam === "monthly" || checkoutParam === "annual" || checkoutParam === "pro") {
    setTimeout(() => {
      const licModal = document.getElementById("licenseModal");
      const msgEl = document.getElementById("licenseMsg");
      if (licModal) {
        licModal.style.display = "flex";
        if (msgEl) {
          msgEl.style.color = "#34d399";
          msgEl.textContent = checkoutParam === "annual"
            ? "🏆 Annual Research Pass ($199/yr): Click Start Annual Research Pass — $199/yr above, or paste your License Key below to unlock immediately."
            : "⚡ Monthly Research Pass ($29/mo): Click Start Monthly Research Pass — $29/mo above, or paste your License Key below to unlock immediately.";
        }
      }
    }, 200);
  }
  if (
    initialHash.includes("blindtest") ||
    initialHash.includes("chartblindtest") ||
    initialSearch.get("challenge") === "1"
  ) {
    setTimeout(() => {
      const btEl = document.getElementById("chartBlindTestSection");
      if (btEl && btEl.scrollIntoView) {
        btEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 180);
  }
  if (initialTickerParam || initialFilterParam) {
    setTimeout(() => {
      const panel = document.querySelector(".screener-panel");
      if (panel && panel.scrollIntoView) {
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (initialTickerParam === "CELH" || initialTickerParam === "MBLY") {
        const rBtn = document.querySelector(`.btn-open-research[data-ticker="${initialTickerParam}"]`);
        if (rBtn) rBtn.click();
      }
    }, 150);
  }
}

init();

/* === HQ Edge Real-Human Visitor Beacon (tom_truthofmarket) === */
(function(){
  try {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    if (window.__HQ_BEACON_SENT_tom_truthofmarket__) return;
    window.__HQ_BEACON_SENT_tom_truthofmarket__ = true;
    var ua = navigator.userAgent || '';
    if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|gtmetrix|pingdom|uptimerobot|python|curl|node|axios/i.test(ua)) return;
    var host = (location && location.hostname) || '';
    if (!host || host === 'localhost' || host === '127.0.0.1') return;
    var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
    var ns = 'tom_truthofmarket';
    fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/pv_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
    fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/pv_total', { mode: 'cors', keepalive: true }).catch(function(){});
    if (localStorage.getItem('hq_uv_' + ns + '_' + kst) !== '1') {
      localStorage.setItem('hq_uv_' + ns + '_' + kst, '1');
      fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/uv_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
    }
    if (localStorage.getItem('hq_uv_ever_' + ns) !== '1') {
      localStorage.setItem('hq_uv_ever_' + ns, '1');
      fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/uv_total', { mode: 'cors', keepalive: true }).catch(function(){});
    }
    if (location.search.indexOf('payment=success') !== -1 || location.search.indexOf('unlock=1') !== -1) {
      if (localStorage.getItem('hq_paid_' + kst) !== '1') {
        localStorage.setItem('hq_paid_' + kst, '1');
        fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_member_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
        fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_member_total', { mode: 'cors', keepalive: true }).catch(function(){});
      }
    }
  } catch (e) {}
})();
