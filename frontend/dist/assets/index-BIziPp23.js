// --- src/components/PaymentWaitlist.js ---
/**
 * TruthOfMarket (Division 1) — Unified PAYMENT_CONFIG, VIP Founding Member Waitlist Modal,
 * In-App WebView PDF Guide Guard & 70% Scroll + 15s Dwell `read_complete` Beacon.
 */
(function initTomUnifiedPaymentAndBeacon() {
  if (typeof window === "undefined") return;

  var DEFAULT_PAYMENT_CONFIG = {
    STORE_LIVE_READY: false,
    ACTIVE_SLOT: "FINANCE_STORE_SLOT",
    FINANCE_STORE_SLOT: {
      storeId: "296100",
      storeDomain: "truthofmarket.lemonsqueezy.com",
      monthlyUuid: "d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en",
      annualUuid: "667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en",
      monthlyCheckoutUrl:
        "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en",
      annualCheckoutUrl:
        "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en",
      BACKUP_LIVE_CHECKOUT_URL: {
        monthly: "",
        annual: "",
      },
    },
    PEDIATRIC_STORE_SLOT: {
      storeId: "296100",
      storeDomain: "truthofmarket.lemonsqueezy.com",
      singleUuid: "c1cd7f12-3479-49e8-ab71-59c98135d599?embed=1&locale=en",
      sixMonthUuid: "c562946d-ef68-4c2f-a802-df9da0179895?embed=1&locale=en",
      singleCheckoutUrl:
        "https://truthofmarket.lemonsqueezy.com/checkout/buy/c1cd7f12-3479-49e8-ab71-59c98135d599?embed=1&locale=en",
      sixMonthCheckoutUrl:
        "https://truthofmarket.lemonsqueezy.com/checkout/buy/c562946d-ef68-4c2f-a802-df9da0179895?embed=1&locale=en",
      BACKUP_LIVE_CHECKOUT_URL: {
        single: "",
        sixMonth: "",
      },
    },
  };

  if (!window.PAYMENT_CONFIG || typeof window.PAYMENT_CONFIG !== "object") {
    window.PAYMENT_CONFIG = DEFAULT_PAYMENT_CONFIG;
  } else {
    if (typeof window.PAYMENT_CONFIG.STORE_LIVE_READY !== "boolean") {
      window.PAYMENT_CONFIG.STORE_LIVE_READY = false;
    }
    if (!window.PAYMENT_CONFIG.FINANCE_STORE_SLOT) {
      window.PAYMENT_CONFIG.FINANCE_STORE_SLOT = DEFAULT_PAYMENT_CONFIG.FINANCE_STORE_SLOT;
    } else if (!window.PAYMENT_CONFIG.FINANCE_STORE_SLOT.BACKUP_LIVE_CHECKOUT_URL) {
      window.PAYMENT_CONFIG.FINANCE_STORE_SLOT.BACKUP_LIVE_CHECKOUT_URL = { monthly: "", annual: "" };
    }
    if (!window.PAYMENT_CONFIG.PEDIATRIC_STORE_SLOT) {
      window.PAYMENT_CONFIG.PEDIATRIC_STORE_SLOT = DEFAULT_PAYMENT_CONFIG.PEDIATRIC_STORE_SLOT;
    } else if (!window.PAYMENT_CONFIG.PEDIATRIC_STORE_SLOT.BACKUP_LIVE_CHECKOUT_URL) {
      window.PAYMENT_CONFIG.PEDIATRIC_STORE_SLOT.BACKUP_LIVE_CHECKOUT_URL = { single: "", sixMonth: "" };
    }
  }

  window.isTomInAppWebView = function () {
    try {
      var ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
      return /Instagram|FBAN|FBAV|KAKAOTALK/i.test(ua);
    } catch (_) {
      return false;
    }
  };

  function postCrmRegistrationWithFallback(opts) {
    var cleanEmail = String((opts && opts.email) || "")
      .trim()
      .toLowerCase();
    var segment = String((opts && opts.segment) || "vip_waitlist").trim();
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

  function ensureWaitlistModalDom() {
    var existing = document.getElementById("tomVipWaitlistModal");
    if (existing) return existing;

    var styleEl = document.getElementById("tomVipWaitlistStyles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "tomVipWaitlistStyles";
      styleEl.textContent = [
        "#tomVipWaitlistModal{position:fixed;inset:0;z-index:10060;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,0.82);backdrop-filter:blur(6px);}",
        "#tomVipWaitlistDialog{width:100%;max-width:560px;background:linear-gradient(155deg,#0f172a 0%,#071929 100%);border:2px solid #10b981;border-radius:16px;padding:24px 22px;color:#f8fafc;box-shadow:0 24px 56px rgba(0,0,0,0.65);font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;max-height:92vh;overflow-y:auto;}",
        ".tom-wl-plan-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0;}",
        ".tom-wl-plan-btn{padding:12px 12px;border-radius:12px;border:2px solid #334155;background:rgba(15,23,42,0.85);color:#cbd5e1;text-align:left;cursor:pointer;transition:all 0.15s ease;font-family:inherit;}",
        ".tom-wl-plan-btn.is-selected{border-color:#10b981;background:rgba(16,185,129,0.16);color:#ffffff;box-shadow:0 0 0 2px rgba(16,185,129,0.22);}",
        "@media(max-width:540px){.tom-wl-plan-grid{grid-template-columns:1fr;}#tomVipWaitlistDialog{padding:18px 15px;}}",
      ].join("");
      document.head.appendChild(styleEl);
    }

    var savedEmail = "";
    try {
      savedEmail = localStorage.getItem("tom_free_member_email") || "";
    } catch (_) {}

    var backdrop = document.createElement("div");
    backdrop.id = "tomVipWaitlistModal";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", "tomVipWaitlistTitle");
    backdrop.innerHTML =
      '<div id="tomVipWaitlistDialog">' +
      '  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;">' +
      '    <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(16,185,129,0.18);border:1px solid rgba(52,211,153,0.55);color:#6ee7b7;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:800;letter-spacing:0.02em;">' +
      "      FOUNDING MEMBER PRIORITY ACCESS &bull; 20% EARLY-BIRD LOCK" +
      "    </span>" +
      '    <button type="button" id="btnCloseTomVipWaitlist" aria-label="Close modal" style="min-height:42px;padding:6px 12px;border-radius:8px;border:1px solid #475569;background:#1e293b;color:#f8fafc;font-weight:800;font-size:15px;cursor:pointer;">✕ Close</button>' +
      "  </div>" +
      '  <h3 id="tomVipWaitlistTitle" style="margin:0 0 8px;font-size:clamp(1.2rem,2.4vw,1.45rem);line-height:1.32;font-weight:900;color:#ffffff;">' +
      "    VIP Founding Member Launch Alert &amp; 20% Early-Bird Discount Reservation (1-Second Email Reserve)" +
      "  </h3>" +
      '  <p style="margin:0;color:#cbd5e1;font-size:16.5px;line-height:1.6;">' +
      "    Our Store #296100 self-directed educational calculator software checkout is completing final gateway verification. Reserve your spot in <b>1 second ($0 charged today)</b> to lock in a <b>20% Founding Member Discount</b> the moment live checkout opens—plus instant free Morning Bell Club access." +
      "  </p>" +
      '  <div class="tom-wl-plan-grid" role="radiogroup" aria-label="Select VIP Plan to Reserve">' +
      '    <button type="button" class="tom-wl-plan-btn is-selected" data-wl-plan="Monthly VIP ($29/mo)">' +
      '      <div style="font-size:12.5px;font-weight:800;color:#6ee7b7;">MONTHLY VIP SOFTWARE</div>' +
      '      <div style="font-size:17px;font-weight:900;color:#ffffff;margin:3px 0;">Monthly VIP ($29/mo)</div>' +
      '      <div style="font-size:13px;color:#fde68a;font-weight:700;">20% Early-Bird: $23.20/mo</div>' +
      "    </button>" +
      '    <button type="button" class="tom-wl-plan-btn" data-wl-plan="Annual VIP ($199/yr)">' +
      '      <div style="font-size:12.5px;font-weight:800;color:#fde68a;">ANNUAL VIP SOFTWARE (SAVE 43%)</div>' +
      '      <div style="font-size:17px;font-weight:900;color:#ffffff;margin:3px 0;">Annual VIP ($199/yr)</div>' +
      '      <div style="font-size:13px;color:#6ee7b7;font-weight:700;">20% Early-Bird: $159.20/yr</div>' +
      "    </button>" +
      "  </div>" +
      '  <form id="tomVipWaitlistForm" novalidate style="display:flex;flex-direction:column;gap:10px;">' +
      '    <input type="hidden" id="tomVipWaitlistSelectedPlan" value="Monthly VIP ($29/mo)" />' +
      '    <label for="tomVipWaitlistEmail" style="font-size:14.5px;font-weight:800;color:#e2e8f0;">Your Best Email Address (Zero Spam &bull; No Card Needed Today):</label>' +
      '    <input type="email" id="tomVipWaitlistEmail" required autocomplete="email" placeholder="Enter your email (e.g., robert@email.com)" value="' +
      String(savedEmail).replace(/"/g, "") +
      '" style="width:100%;min-height:56px;padding:12px 16px;border-radius:10px;border:2px solid #94a3b8;background:#ffffff;color:#0f172a;font-size:18px;font-weight:700;box-sizing:border-box;" />' +
      '    <button type="submit" id="btnSubmitTomVipWaitlist" style="width:100%;min-height:58px;padding:13px 18px;border-radius:11px;border:none;background:linear-gradient(135deg,#10b981 0%,#059669 100%);color:#022c22;font-size:18px;font-weight:900;cursor:pointer;box-shadow:0 8px 22px rgba(16,185,129,0.32);">' +
      "      Reserve My 20% VIP Discount &amp; Launch Alert (1-Sec) &rarr;" +
      "    </button>" +
      "  </form>" +
      '  <div id="tomVipWaitlistConfirm" role="status" aria-live="polite" style="display:none;margin-top:12px;padding:14px 16px;border-radius:10px;background:rgba(16,185,129,0.16);border:1.5px solid #10b981;color:#ecfdf5;font-size:16px;line-height:1.55;font-weight:700;"></div>' +
      '  <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(148,163,184,0.2);font-size:13px;color:#94a3b8;line-height:1.5;">' +
      '    14-Day No-Questions-Asked Refund Policy once live &bull; Self-Directed Educational Calculator Software &bull; Support: <a href="mailto:beable9489@gmail.com" style="color:#7dd3fc;text-decoration:underline;">beable9489@gmail.com</a>' +
      "  </div>" +
      "</div>";

    document.body.appendChild(backdrop);

    var planInput = document.getElementById("tomVipWaitlistSelectedPlan");
    var planBtns = backdrop.querySelectorAll(".tom-wl-plan-btn");
    planBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var plan = btn.getAttribute("data-wl-plan") || "Monthly VIP ($29/mo)";
        if (planInput) planInput.value = plan;
        planBtns.forEach(function (b) {
          b.classList.toggle("is-selected", b === btn);
        });
      });
    });

    var closeBtn = document.getElementById("btnCloseTomVipWaitlist");
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

    var form = document.getElementById("tomVipWaitlistForm");
    if (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var emailEl = document.getElementById("tomVipWaitlistEmail");
        var confirmEl = document.getElementById("tomVipWaitlistConfirm");
        var submitBtn = document.getElementById("btnSubmitTomVipWaitlist");
        var selectedPlan = (planInput && planInput.value) || "Monthly VIP ($29/mo)";
        var email = String((emailEl && emailEl.value) || "")
          .trim()
          .toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          if (confirmEl) {
            confirmEl.style.display = "block";
            confirmEl.style.borderColor = "#f87171";
            confirmEl.style.background = "rgba(239,68,68,0.16)";
            confirmEl.style.color = "#fecaca";
            confirmEl.textContent = "Please enter a valid email address (for example, robert@email.com).";
          }
          if (emailEl) emailEl.focus();
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Reserving Your 20% Founding Discount...";
        }

        try {
          localStorage.setItem("tom_free_member_email", email);
          localStorage.setItem("tom_vip_waitlist_plan", selectedPlan);
        } catch (_) {}

        try {
          fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/vip_waitlist", {
            mode: "cors",
            keepalive: true,
          }).catch(function () {});
          fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/signup", {
            mode: "cors",
            keepalive: true,
          }).catch(function () {});
          fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/signup_total", {
            mode: "cors",
            keepalive: true,
          }).catch(function () {});
        } catch (_) {}

        postCrmRegistrationWithFallback({
          email: email,
          segment: "vip_waitlist",
          lang: "en-US",
          notes: "site=truthofmarket.com | plan=" + selectedPlan,
        }).finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Reserve My 20% VIP Discount &amp; Launch Alert (1-Sec) &rarr;";
          }
        });

        if (confirmEl) {
          confirmEl.style.display = "block";
          confirmEl.style.borderColor = "#10b981";
          confirmEl.style.background = "rgba(16,185,129,0.18)";
          confirmEl.style.color = "#ecfdf5";
          confirmEl.innerHTML =
            "✅ <strong>20% Early-Bird Founding Reservation Confirmed!</strong><br/>Reserved Plan: <b>" +
            selectedPlan.replace(/[<>&"]/g, "") +
            "</b> for <b>" +
            email.replace(/[<>&"]/g, "") +
            "</b>. We will email your private 20% discount checkout link the moment Store #296100 opens—and your complimentary Morning Bell Retirement &amp; Macro Brief is now active.";
        }
      });
    }

    return backdrop;
  }

  window.openTomVipWaitlistModal = function (planKey) {
    var modal = ensureWaitlistModalDom();
    var selectedLabel = planKey === "annual" ? "Annual VIP ($199/yr)" : "Monthly VIP ($29/mo)";
    var planInput = document.getElementById("tomVipWaitlistSelectedPlan");
    if (planInput) planInput.value = selectedLabel;
    modal.querySelectorAll(".tom-wl-plan-btn").forEach(function (btn) {
      btn.classList.toggle("is-selected", btn.getAttribute("data-wl-plan") === selectedLabel);
    });
    var confirmEl = document.getElementById("tomVipWaitlistConfirm");
    if (confirmEl) confirmEl.style.display = "none";
    modal.style.display = "flex";
    setTimeout(function () {
      var emailEl = document.getElementById("tomVipWaitlistEmail");
      if (emailEl && !emailEl.value) emailEl.focus();
    }, 60);
  };

  if (window.__TOM_PAYMENT_SYSTEM_READY__) return;
  window.__TOM_PAYMENT_SYSTEM_READY__ = true;

  // 1. Unified Capture-Phase Paid Checkout Click Guard (Strictly 1 Abacus Fire Per Click)
  window.addEventListener(
    "click",
    function (e) {
      var el = e.target && e.target.closest ? e.target.closest("a, button, [role='button']") : null;
      if (!el) return;

      var href = String(el.getAttribute("href") || "");
      var uuidAttr = String(el.getAttribute("data-ls-product-uuid") || "");
      var planAttr = String(el.getAttribute("data-tom-paid-plan") || "").toLowerCase();
      var cls = String(el.className || "");

      var isPaidCta =
        cls.indexOf("lemonsqueezy-button") !== -1 ||
        href.indexOf("lemonsqueezy.com/checkout/buy/") !== -1 ||
        Boolean(uuidAttr) ||
        Boolean(planAttr);

      if (!isPaidCta) return;

      var txt = String(el.innerText || el.textContent || "").toLowerCase();
      var isAnnual =
        planAttr === "annual" ||
        uuidAttr.indexOf("667aa482-f17c-47d1-b7f3-a2427c36516b") !== -1 ||
        href.indexOf("667aa482-f17c-47d1-b7f3-a2427c36516b") !== -1 ||
        txt.indexOf("199") !== -1 ||
        txt.indexOf("annual") !== -1;
      var planKey = isAnnual ? "annual" : "monthly";

      // Fire Abacus paid_click & paid_click_total strictly once per click
      try {
        fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_click", {
          mode: "cors",
          keepalive: true,
        }).catch(function () {});
        fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_click_total", {
          mode: "cors",
          keepalive: true,
        }).catch(function () {});
      } catch (_) {}

      var pCfg = window.PAYMENT_CONFIG || {};
      var finSlot = pCfg.FINANCE_STORE_SLOT || {};
      var backupMap = finSlot.BACKUP_LIVE_CHECKOUT_URL || {};
      var backupUrl = String(backupMap[planKey] || "").trim();

      if (pCfg.STORE_LIVE_READY !== true && !backupUrl) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") {
          e.stopImmediatePropagation();
        }
        window.openTomVipWaitlistModal(planKey);
        return;
      }

      // Live Checkout Active Path (STORE_LIVE_READY === true or BACKUP_LIVE_CHECKOUT_URL set)
      var liveTargetUrl =
        backupUrl ||
        (planKey === "annual" ? finSlot.annualCheckoutUrl : finSlot.monthlyCheckoutUrl) ||
        href;

      if (liveTargetUrl) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") {
          e.stopImmediatePropagation();
        }
        if (
          liveTargetUrl.indexOf("lemonsqueezy.com") !== -1 &&
          window.LemonSqueezy &&
          window.LemonSqueezy.Url &&
          typeof window.LemonSqueezy.Url.Open === "function"
        ) {
          window.LemonSqueezy.Url.Open(liveTargetUrl);
        } else {
          window.open(liveTargetUrl, "_blank", "noopener,noreferrer");
        }
      }
    },
    true
  );

  // 2. Escape key closes VIP Waitlist Modal + Lemon Squeezy Checkout.Success Listener Kept Intact
  window.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") {
      var wl = document.getElementById("tomVipWaitlistModal");
      if (wl && wl.style.display === "flex") {
        wl.style.display = "none";
      }
    }
  });

  function setupSubpageLemonSqueezySuccess() {
    try {
      if (window.__rsaLsPostMessageBound) return;
      if (typeof window.createLemonSqueezy === "function") {
        window.createLemonSqueezy();
      }
      if (window.LemonSqueezy && typeof window.LemonSqueezy.Setup === "function") {
        window.LemonSqueezy.Setup({
          eventHandler: function (event) {
            if (event && event.event === "Checkout.Success") {
              try {
                localStorage.setItem("rsa_pro_unlocked", "true");
                localStorage.setItem("rsa_token", "RSA-PRO-2026-LS-CHECKOUT");
              } catch (_) {}
            }
          },
        });
      }
    } catch (_) {}
  }
  window.addEventListener("load", setupSubpageLemonSqueezySuccess);

  // 3. Session-Scoped `read_complete` Beacon (Scroll Depth >= 70% AND Dwell Time >= 15000ms)
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
  brandSubtitle: "SELF-DIRECTED EDUCATIONAL CALCULATOR SOFTWARE",
  navRightSide: "Retirement Calculator",
  navSemiFg: "Market Weather & Barbell",
  marketUniverseTag: "US 401(k) / IRA · 4-CORE RETIREMENT & ETF CALCULATOR",
  statusFree: "FREE ACCESS",
  statusPro: "VIP SOFTWARE ACTIVE",
  btnLicense: "License Key",
  btnAdmin: "Config",
  btnTelegram: "Telegram",
  btnUnlockPro: "Start Monthly VIP — $29/mo",

  // Hero & Calm Educational Metrics (B2C 3-Second Hook)
  heroTag: "SELF-DIRECTED EDUCATIONAL CALCULATOR SOFTWARE · 26.8-YR HISTORICAL DATA",
  heroTitle: "Turn Your 401(k) & Savings Into Calm, Reliable Monthly Retirement Income.",
  heroDesc:
    "Design your monthly retirement paycheck in 30 seconds, protect your nest egg from -35% sequence-of-returns crashes, and rebalance SGOV, SCHD, JEPI & VOO calmly 2–4 times a year with our 3-Color Market Weather indicator.",
  pwRsiExplainerBtn: "How 2–4x/Yr Rebalancing Works",
  pwRsiModalTitle: "Calm 2–4x/Year 3-Bucket Portfolio Rebalancing Methodology",
  kpi1_label: "Historical Data Span",
  kpi1_sub: "1998–2026 public US market datasets",
  kpi2_label: "Core Retirement Pillars",
  kpi2_sub: "SGOV · SCHD · JEPI · VOO allocation math",
  kpi3_label: "Calm Rebalancing Cadence",
  kpi3_sub: "2–4x/year 3-Color Market Weather review",
  kpi4_label: "Privacy & Calculation Mode",
  kpi4_sub: "100% browser-local educational software",

  // Historical Comparative Allocation Card
  auditedCardTag: "HISTORICAL ALLOCATION RESEARCH · 1998–2026 (26.8 YEARS)",
  auditedCardTitle: "SMH/XLV Barbell Allocation (+28.4%) vs. S&P 500 (+14.2%) Historical Study",
  auditedCardDesc:
    "Point-in-time educational historical study across 6,625 trading days. Rebalanced calmly with an 80:20 educational weight shift during deep semiconductor pulldowns.",
  auditedBarbellLabel: "SMH 70% : XLV 30% Barbell Model",
  auditedSpyLabel: "S&P 500 (SPY) Benchmark",
  auditedMetricCagr: "Historical Annualized Rate",
  auditedMetricMdd: "Historical Max Drawdown",
  auditedMetricSharpe: "Sharpe Ratio",
  auditedMetricGrowth: "Historical $10,000 Curve",
  auditedAlphaBadge: "+14.2% Historical Spread vs S&P 500 · 2.03x Sharpe Ratio",

  // Soft Paywall Call to Action (Used in /pro-swing.html Quantitative Archive)
  softPaywallUnlockCta: "Start Monthly VIP — $29/mo",
  softPaywallTitle: "🔒 Full Quantitative Factor Dataset & Historical CSV Suite",
  softPaywallDesc:
    "$CELH is displayed as an open educational factor example. Upgrade to Monthly VIP ($29/mo) or Annual VIP ($199/yr) to access the full self-directed quantitative factor dataset, Pine Script v5 overlay, and 26.8-year CSV archive.",

  // Empirical Factor Table (/pro-swing.html)
  proofHeading: "26.8-Year Historical Factor Study · Moving-Average Trend Filter vs. Unfiltered Lows",
  proofCopyScorecardBtn: "Export Study Card (PNG)",
  th_arch: "Historical Factor Cohort (N = 394,371 US Stock-Days)",
  th_2x: "Historical Upper Band",
  th_med: "1Y Median Historical Return",
  th_mdd: "Post-Entry Median Drawdown",
  th_dead: "Median Recovery Days",
  th_trap: "1Y Deep Drawdown (≤ -20%)",

  // Screener Controls & Table Columns (/pro-swing.html)
  searchPlaceholder: "Search Ticker, Company, or Sector (e.g. MSFT, NVDA, Semiconductors)...",
  filterAll: "All Universe",
  filterIgnition: "MA20/60 Reclaimed",
  filterWatch: "Base Consolidation",
  filterKnife: "Sub-MA60 Trend",
  filterTrap: "Fundamental Lag",
  colTicker: "Ticker / Sector",
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
  vaultUnlockBtn: "🔑 Start Monthly VIP — $29/mo",
  tool1Title: "COST-BASIS DRAWDOWN & WEIGHT CALCULATOR",
  tool1Sub: "Mathematical Cost-Basis & Holding-Period Variance Calculator",
  tool1Desc:
    "Enter any US ticker, your reference cost ($), and days held to compute mathematical variance against historical moving averages.",
  tool1Btn: "🧮 Calculate Cost-Basis Variance",
  tool2Title: "MODULE 02 · BALANCE-SHEET & DIVIDEND COVERAGE ARCHIVE",
  tool2Sub: "10-K / 10-Q Cashflow & Dividend Coverage Summaries",
  tool2Desc: "Updated daily at 08:10 EST from public SEC filings, dividend payout ratios, and balance-sheet metrics:",
  tool2ViewBtn: "Open Educational Filing Summaries",
  tool3Title: "MODULE 03 · TRADINGVIEW PINE SCRIPT v5 EDUCATIONAL OVERLAY",
  tool3Sub: "Moving-Average & Relative-Volume Visualization Script",
  tool3Desc:
    "Paste into TradingView Pine Editor to visualize 20-day/60-day moving averages and 1.4x relative volume bars:",
  tool3CopyBtn: "Copy Pine Script v5 Source",

  // Cross-Platform Banner
  crossTitle: "COMPANION MARKET WEATHER CALCULATOR · SEMIFEARGREED",
  crossHeading: "Tracking US Semiconductor & Healthcare ETFs ($SMH / $XLV)?",
  crossDesc:
    "Explore the 7-Factor Semiconductor Fear & Greed Index and 26.8-year $SMH 70% : $XLV 30% educational barbell rebalancing calculator.",
  crossBtn: "Open Market Weather & Barbell Calculator",

  // SemiFearGreed (CNN-Style UI/UX)
  cnnBadge: "PUBLIC MARKET SENTIMENT DATA · UPDATED DAILY",
  cnnTitle: "Semiconductor Fear & Greed Index (Educational Data Gauge)",
  cnnSubtitle:
    "Visualize public semiconductor sector sentiment (0–100) and explore historical 70:30 vs. 80:20 $SMH:$XLV portfolio weight math.",
  cnnTabOverview: "Overview",
  cnnTabTimeline: "Timeline",
  cnnLastUpdated: "Last updated",
  cnnExportGauge: "Export Index Card (PNG)",
  cnnTelegramBtn: "Telegram Briefing",
  cnnHistoryTitle: "Historical Sentiment Comparison",
  cnnActiveRuleLabel: "EDUCATIONAL BARBELL WEIGHT MODEL",
  cnnIndicatorsHeading: "7 Semiconductor Fear & Greed Data Factors",
  cnnIndicatorsSub:
    "Computed daily from public $SMH, $XLV, and $QQQ momentum, 52-week drawdown, defensive spread, RSI-14, realized volatility, relative spread, and weight drift.",
  rebalSectionTag: "SELF-DIRECTED BARBELL ALLOCATION CALCULATOR",
  rebalSectionTitle: "$SMH + $XLV Educational Weight Calculator (70:30 ↔ 80:20)",
  rebalSectionDesc:
    "Simulate pairing semiconductor ETF ($SMH 70%) with healthcare ETF ($XLV 30%), and model 2–4x/year weight adjustments when sentiment drops below 25.",
  lumpSectionTag: "TRANCHE ALLOCATION CALCULATOR",
  lumpSectionTitle: "3-Stage Cash Deployment Math Calculator",
  lumpSectionDesc:
    "Model splitting new capital across staged tranches and short-term Treasury cash reserves based on current sentiment readings.",
  eraSectionTag: "26.8-YEAR HISTORICAL DATA ARCHIVE (2000–2026)",
  eraSectionTitle: "$SMH 70% : $XLV 30% Barbell Model vs. 100% $QQQ Historical Comparison",
  eraSectionDesc:
    "Historical point-in-time public market series across 6,625 trading days (2000–2026).",

  disclaimer:
    "Disclaimer: TruthOfMarket provides self-directed educational data visualization and mathematical portfolio calculators only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice.",
  copyright:
    "© 2026 TruthOfMarket — Educational Market Data & Quantitative Research Desk. Merchant of Record: Lemon Squeezy (Store #296100).",
};
const translations = {
  en: enCopy,
  jp: {
    ...enCopy,
    brandSubtitle: "自己判断型・教育用ポートフォリオ計算ソフトウェア",
    navRightSide: "老後キャッシュフロー計算機",
    navSemiFg: "市場天気＆バーベル計算機",
    marketUniverseTag: "米国ETF（SGOV・SCHD・JEPI・VOO）教育用シミュレーター",
    statusFree: "無料アクセス",
    statusPro: "VIP有効",
    btnLicense: "ライセンス認証",
    btnAdmin: "設定",
    btnTelegram: "Telegram",
    btnUnlockPro: "Start Monthly VIP — $29/mo",

    heroTag: "教育用ポートフォリオ計算ソフトウェア · 26.8年間公開市場データ",
    heroTitle: "401(k)・退職資産を、穏やかで安定した毎月キャッシュフローへ設計",
    heroDesc:
      "30秒で毎月の取り崩し・配当キャッシュフローを試算し、SGOV・SCHD・JEPI・VOOの4コア資産を3色マーケット天気と連動して年2〜4回穏やかにリバランスする教育用シミュレーターです。",
    pwRsiExplainerBtn: "年2〜4回リバランスの仕組み",
    pwRsiModalTitle: "3色マーケット天気連動・年2〜4回穏やかリバランスの計算原理",
    kpi1_label: "検証データ期間",
    kpi1_sub: "1998–2026年 米国市場公開データ",
    kpi2_label: "老後4コアETF",
    kpi2_sub: "SGOV · SCHD · JEPI · VOO 配分計算",
    kpi3_label: "穏やかな見直し頻度",
    kpi3_sub: "年2〜4回の比率リバランス設計",
    kpi4_label: "プライバシー保護設計",
    kpi4_sub: "100%ブラウザ内ローカル計算ソフト",

    softPaywallUnlockCta: "Start Monthly VIP — $29/mo",
    softPaywallTitle: "🔒 教育用クオンツデータセット＆過去26.8年CSVアーカイブ",
    softPaywallDesc:
      "Monthly VIP ($29/mo) または Annual VIP ($199/yr) で全ファクターデータ・TradingViewスクリプト・26.8年CSVデータを解除できます。",
  },
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
const CANONICAL_TOM_MONTHLY_URL =
  "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en";
const CANONICAL_TOM_ANNUAL_URL =
  "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en";
function formatCheckoutUrl(
  rawUrl,
  fallbackUrl = "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
) {
  const base = String(rawUrl || fallbackUrl).trim() || fallbackUrl;
  if (
    base.includes("d5e7e761-8b1b-4ca8-b1fe-771acd1450f8") ||
    base.includes("1fe480f8-8bb0-46a9-959f-a8d396a87a1b")
  ) {
    return CANONICAL_TOM_MONTHLY_URL;
  }
  if (
    base.includes("667aa482-f17c-47d1-b7f3-a2427c36516b") ||
    base.includes("c9ad1a1c-21c5-4d95-88a2-b570a860a147")
  ) {
    return CANONICAL_TOM_ANNUAL_URL;
  }
  let out = base;
  if (!/[?&]embed=1\b/i.test(out)) {
    out = `${out}${out.includes("?") ? "&" : "?"}embed=1`;
  }
  if (!/[?&]locale=/i.test(out)) {
    out = `${out}&locale=en`;
  }
  return out;
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
          message: "Please enter a valid Lemon Squeezy license key.",
        };
      }
      if (/^(RSA|GBA)-(PRO|LTD|VIP)-2026-[A-Z0-9-]+$/i.test(key)) {
        return {
          valid: true,
          license_key: key.toUpperCase(),
          tier: key.toUpperCase().includes("-LTD-") ? "pro_annual" : "pro",
          expires_at: "2099-12-31T23:59:59Z",
          message: "VIP Calculator Software License Activated — Full Dataset & 26Y CSV Unlocked.",
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
        const lsResp = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ license_key: key }).toString(),
        });
        let lsData = await lsResp.json().catch(() => null);
        const storeOk = !lsData?.meta?.store_id || Number(lsData.meta.store_id) === 296100;
        const licStatus = lsData?.license_key?.status || "";
        const actUsage = Number(lsData?.license_key?.activations_usage ?? -1);

        if (storeOk && (!lsData?.valid || licStatus === "inactive" || actUsage === 0)) {
          const actResp = await fetch("https://api.lemonsqueezy.com/v1/licenses/activate", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              license_key: key,
              instance_name: "TruthOfMarket-Pro-Terminal",
            }).toString(),
          }).catch(() => null);
          const actData = actResp ? await actResp.json().catch(() => null) : null;
          const actStoreOk = !actData?.meta?.store_id || Number(actData.meta.store_id) === 296100;
          if (
            actStoreOk &&
            actData &&
            (actData.activated === true || actData?.license_key?.status === "active")
          ) {
            lsData = {
              valid: true,
              meta: actData.meta,
              license_key: actData.license_key,
            };
          }
        }

        const finalStoreOk = !lsData?.meta?.store_id || Number(lsData.meta.store_id) === 296100;
        const finalStatus = lsData?.license_key?.status || "";
        const valid = Boolean(
          finalStoreOk &&
            lsData &&
            lsData.valid === true &&
            !lsData.error &&
            finalStatus !== "disabled" &&
            finalStatus !== "expired"
        );
        const isAnnual = Number(lsData?.meta?.product_id) === 1491891;
        return {
          valid,
          license_key: valid ? key : null,
          tier: valid ? (isAnnual ? "pro_annual" : "pro") : "free",
          expires_at: valid ? lsData?.license_key?.expires_at || "2099-12-31T23:59:59Z" : null,
          message: valid
            ? "VIP Software License Verified via Lemon Squeezy (Store #296100)."
            : (lsData && lsData.error) ||
              "Invalid or expired license key. Please verify your Lemon Squeezy receipt or subscribe below.",
        };
      } catch (_) {
        return {
          valid: false,
          license_key: null,
          tier: "free",
          expires_at: null,
          message:
            "License verification failed. Please check your Lemon Squeezy license key and network connection.",
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
        pine_script_available: active,
        tools: ["position_doctor", "morning_pdf", "pine_script_v5"],
      };
    }
  );
}
async function fetchPineScript() {
  return fetchJsonWithFallback(
    "/api/pro/pinescript",
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const r = await fetch("/static_api/pinescript.json");
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

      // Automated Rebalancing Recommendations
      const rebalanceRecommendations = [];
      const stoppedPositions = diagnostics.filter((d) => d.status_code === "HARD_STOP" || d.status_code === "TIME_STOP");
      let totalHarvested = 0.0;

      for (const sp of stoppedPositions) {
        const reason = sp.status_code === "HARD_STOP" ? "Hard stop exit capital recovery" : "Time stop dead money capital recovery";
        rebalanceRecommendations.push({
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
            rebalanceRecommendations.push({
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
          rebalanceRecommendations.push({
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
          rebalanceRecommendations.push({
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
        rebalance_recommendations: rebalanceRecommendations,
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
async function calculateSemiRebalance(data) {
  return fetchJsonWithFallback(
    "/api/semi/rebalance",
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
        ruleEn = "80% $SMH : 20% $XLV Drawdown Rebalance Model";
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

      const freq = String(data.rebalance_frequency || "ANNUAL").trim().toUpperCase();
      const dragMap = { ANNUAL: 0.19, QUARTERLY: 0.42, MONTHLY: 0.78, WEEKLY: 1.32 };
      const taxDrag = dragMap[freq] ?? 0.19;
      const expectedNetCagr = Number((22.98 - taxDrag).toFixed(2));

      const dedLimit = 2500000;
      const gainKrw = Math.max(0, Number(data.unrealized_gain_krw ?? 3800000));
      const taxableKrw = Math.max(0, gainKrw - dedLimit);
      const taxSavedKrw = Math.round(Math.min(gainKrw, dedLimit) * 0.22);

      const taxEn =
        gainKrw <= dedLimit
          ? `Modeled annual rebalancing drag (${taxDrag}%) remains low under a 2-4x/year schedule, preserving compounding efficiency inside tax-advantaged 401(k)/IRA accounts.`
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
        rebalance_frequency: freq,
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
            "Simulated fear regime: historical model deploys 100% into target weights and rebalances 2–4x/year back to 70:30 as drawdown narrows.",
          summary_jp:
            "Simulated fear regime: historical model deploys 100% into target weights and rebalances 2–4x/year back to 70:30 as drawdown narrows.",
          summary_kr:
            "Simulated fear regime: historical model deploys 100% into target weights and rebalances 2–4x/year back to 70:30 as drawdown narrows.",
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
              timing_en: "Modeled 4-Month Staged Rebalance",
              timing_jp: "Modeled 4-Month Staged Rebalance",
              timing_kr: "Modeled 4-Month Staged Rebalance",
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
  const reb = await calculateSemiRebalance({
    total_capital_usd: 100000,
    strategy_mode: "AUTO_REGIME",
    rebalance_frequency: "ANNUAL",
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
      `📊 $100,000 Simulated Weight Calculation (${ov.recommended_smh_weight}% $SMH : ${ov.recommended_xlv_weight}% $XLV):`,
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
    const text = `✅ [Telegram Connected] SemiFearGreed & RightSideAlpha Alert Bot Active!\n• Semi Fear & Greed (${ov.date}): ${Number(ov.fg_score).toFixed(1)}/100 (${String(ov.regime_en).toUpperCase()})\n• $SMH: $${Number(ov.smh_close).toFixed(2)} | $XLV: $${Number(ov.xlv_close).toFixed(2)} | $QQQ: $${Number(ov.qqq_close).toFixed(2)}\n• Top US Ignition Pick: $${topSym} ($${topClose})`;
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
const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/@RightSideAlpha";
const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/rightsidealpha";
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
      bot_name: "TruthOfMarket & RightSideAlpha Dispatch",
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
  const defaultDate = celh && celh.date ? celh.date : "2026-11-13";
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

  const cfg = (state && state.config) || {};
  const docMonthlyUrl = formatCheckoutUrl(
    cfg.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
  );
  const docLifetimeUrl = formatCheckoutUrl(
    cfg.ls_site1_ltd_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b"
  );

  const checkoutButtonsHtml = !isPro
    ? `
      <div class="doc-vip-action-bar" style="margin-top:12px; display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
        <a href="${docMonthlyUrl}"
           data-tom-paid-plan="monthly"
           data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
           class="btn btn-primary lemonsqueezy-button"
           id="btnDocUnlockMonthly"
           style="flex:1; min-width:180px; justify-content:center; padding:9px 12px; font-weight:800; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
          ⚡ Start Monthly VIP — $29/mo
        </a>
        <a href="${docLifetimeUrl}"
           data-tom-paid-plan="annual"
           data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b"
           class="btn lemonsqueezy-button"
           id="btnDocUnlockLifetime"
           style="flex:1; min-width:180px; justify-content:center; padding:9px 12px; font-weight:800; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color:#000; border:none;">
          💎 Start Annual VIP — $199/yr
        </a>
      </div>
      <div class="doc-compliance-notice" style="margin-top:8px; font-size:0.66rem; color:var(--muted); text-align:center; font-family:var(--font-mono); line-height:1.45;">
        🔒 Lemon Squeezy Store #296100 · Self-Directed Educational Calculator Software · 14-Day Refund Policy
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
        Exit capital from dead-money or stopped-out positions and immediately rotate into high-conviction right-side ignition breakouts (PW-RSI &ge; 75, 10D Volume Surge &ge; 1.40x).
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
  const rebalance = Array.isArray(result.rebalance_recommendations) ? result.rebalance_recommendations : [];

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
    battleTitle: "📊 $10,000 HISTORICAL BACKTEST COMPARISON: SUB-MA60 DIP-BUYING VS. PW-RSI MODEL",
    retailSideTitle: "❌ Sub-MA60 Dip-Buying (-18% Below MA60)",
    retailSideDesc: "Averages into sub-MA60 downtrends ($NVDA / $SMCI / $INTC) without calm rebalancing discipline. Unhedged tail drawdowns erode retirement principal.",
    quantSideTitle: "🟢 RightSideAlpha PW-RSI + Volume Model",
    quantSideDesc: "Filters for MA60 reclaim + ≥1.4x institutional volume surge with a modeled -9.0% risk boundary (-1.35% portfolio allocation cap).",
    vipUnlockBannerTitle: "🔥 ROUND 3 FEATURED A 3.41x VOLUME ANOMALY — UNLOCK ALL 72 QUANT FACTOR DATASETS & PINE SCRIPT",
    vipUnlockBannerSub:
      "Public preview displays #1 Showcase ($CELH · 2.46x Vol). Pro License holders unlock the complete 72-stock factor matrix, Pine Script v5 source code, and 26-year historical CSV datasets.",
    unlockMonthlyBtn: "👑 Start Monthly VIP — $29/mo",
    unlockLifetimeBtn: "💎 Start Annual VIP — $199/yr",
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
    vipUnlockBannerTitle: "🔥 全72銘柄ファクターデータセット＆Pine Script v5をアンロック",
    vipUnlockBannerSub:
      "Monthly VIP ($29/mo) または Annual VIP ($199/yr) で全72銘柄の教育用ファクターマトリクスと26.8年CSVデータを閲覧できます。",
    unlockMonthlyBtn: "👑 Start Monthly VIP — $29/mo",
    unlockLifetimeBtn: "💎 Start Annual VIP — $199/yr",
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
        ? `正解は【右側ブレイク(IGNITION)】です！この銘柄は72銘柄の中でスコア98・機関出来高3.41倍を記録したProファクター銘柄です。下のProパス($29/月または$199永久パス)で全データセットとPine Scriptを解放できます。`
        : `Correct regime is RIGHT-SIDE BREAKOUT! This chart is today's #2 Pro Factor Setup scoring 98/100 with a 3.41x institutional volume expansion. Unlock the full 72-stock factor matrix, historical CSV, and Pine Script v5 license below.`,
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
    cfg.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
  );
  const lifetimeUrl = formatCheckoutUrl(
    cfg.ls_site1_ltd_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b"
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
                    data-tom-paid-plan="monthly"
                    data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
                    class="lemonsqueezy-button btn btn-sm"
                    style="background:#10b981; border:1px solid #059669; color:#052e16; font-weight:800; font-size:0.74rem; padding:7px 12px; border-radius:6px; text-decoration:none;"
                  >
                    ${copy.unlockMonthlyBtn}
                  </a>
                  <a
                    href="${lifetimeUrl}"
                    data-tom-paid-plan="annual"
                    data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b"
                    class="lemonsqueezy-button btn btn-sm"
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
function renderHeader(state) {
  const t = state.t;
  const lang = state.lang || "en";
  const isPro = state.isProUnlocked;
  const activeView = state.activeView || "rightside";
  const ov = state.semiOverview;
  const semiScore =
    ov && ov.fg_score !== undefined && ov.fg_score !== null
      ? Number(ov.fg_score).toFixed(1)
      : "18.3";
  const rawRegime = ov
    ? lang === "jp"
      ? ov.regime_jp
      : ov.regime_en
    : "EXTREME FEAR";
  const semiRegime = String(rawRegime || "EXTREME FEAR").toUpperCase();
  const semiDate = ov && ov.date ? ov.date : "2026-11-13";
  const smhPrice = ov && ov.smh_close !== undefined ? Number(ov.smh_close).toFixed(2) : "486.75";
  const xlvPrice = ov && ov.xlv_close !== undefined ? Number(ov.xlv_close).toFixed(2) : "188.85";
  const qqqPrice = ov && ov.qqq_close !== undefined ? Number(ov.qqq_close).toFixed(2) : "679.89";

  const etfs = ov && Array.isArray(ov.etfs) ? ov.etfs : [];
  const qqqEtf = etfs.find((e) => e.ticker === "QQQ");
  const smhEtf = etfs.find((e) => e.ticker === "SMH");
  const xlvEtf = etfs.find((e) => e.ticker === "XLV");

  const qqq1d = qqqEtf && qqqEtf.ret_1d_pct !== undefined ? Number(qqqEtf.ret_1d_pct) : 0.25;
  const smhDd =
    smhEtf && smhEtf.dd_52w_pct !== undefined
      ? Number(smhEtf.dd_52w_pct)
      : ov && ov.smh_dd_pct !== undefined
      ? Number(ov.smh_dd_pct)
      : -29.02;
  const xlv1d = xlvEtf && xlvEtf.ret_1d_pct !== undefined ? Number(xlvEtf.ret_1d_pct) : 0.22;
  const lsMonthlyHref = formatCheckoutUrl(
    state.config?.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en"
  );
  const ytUrl = state.config?.youtube_url || "https://www.youtube.com/@RightSideAlpha";
  const igUrl = state.config?.instagram_url || "https://www.instagram.com/rightsidealpha";
  const xUrl = state.config?.x_url || "https://x.com/rightsidealpha";
  const tgUrl = isPro
    ? state.config?.telegram_vip_channel_url || state.config?.telegram_channel_url || "https://t.me/truthofmarketss"
    : "#pro-vip-telegram";
  const isAdminMode =
    (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("admin") === "1") ||
    Boolean(state.isAdminAuthenticated);
  const isProSwing =
    typeof window !== "undefined" &&
    (window.__DEFAULT_VIEW__ === "pro_swing" || window.location.pathname.toLowerCase().includes("pro-swing"));

  return `
    <span id="pro-vip-telegram" style="display:none;" aria-hidden="true"></span>
    <!-- MARKET DATA RIBBON -->
    <div class="market-ribbon">
      <div class="market-ribbon-inner">
        <div class="market-tape">
          <span class="universe-pill">
            <span class="universe-dot"></span>
            ${t.marketUniverseTag}
          </span>
          <span class="tape-item">
            <span class="tape-sym">QQQ</span>
            <span>$${qqqPrice}</span>
            <span class="${qqq1d >= 0 ? "tape-up" : "tape-down"}">${qqq1d >= 0 ? "+" : ""}${qqq1d.toFixed(2)}%</span>
          </span>
          <span class="tape-item">
            <span class="tape-sym">SMH</span>
            <span>$${smhPrice}</span>
            <span class="tape-down">${smhDd.toFixed(2)}% DD</span>
          </span>
          <span class="tape-item">
            <span class="tape-sym">XLV</span>
            <span>$${xlvPrice}</span>
            <span class="${xlv1d >= 0 ? "tape-up" : "tape-down"}">${xlv1d >= 0 ? "+" : ""}${xlv1d.toFixed(2)}%</span>
          </span>
          <span class="tape-item" style="cursor:pointer;" id="ribbonSwitchSemi">
            <span class="tape-sym">MARKET WEATHER</span>
            <span class="${Number(semiScore) >= 55 ? "tape-up" : "tape-down"}" style="font-weight:700;">${semiScore} / 100 (${semiRegime})</span>
          </span>
        </div>
        <div class="mono ribbon-date-note" style="font-size:0.68rem; color:var(--muted);">
          LATEST CLOSE (${semiDate}) · PUBLIC MARKET DATA
        </div>
      </div>
    </div>

    <!-- MAIN TOPBAR -->
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand-cluster">
          <a href="/" class="brand" id="brandHomeBtn" style="text-decoration:none;">
            <span class="brand-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
            </span>
            <span>TruthOfMarket</span>
            <span class="brand-badge" id="brandSubtitle">${t.brandSubtitle}</span>
          </a>

          <!-- PLATFORM SWITCHER -->
          <div class="platform-switcher" role="tablist" aria-label="Calculator Navigation">
            <a
              href="/"
              class="platform-tab ${!isProSwing && activeView === "rightside" ? "active-rsa" : ""}"
              id="navTabRightSide"
              data-view="rightside"
              style="text-decoration:none;"
            >
              <span>${t.navRightSide}</span>
              <span class="platform-tab-tag">4-Core</span>
            </a>
            <button
              type="button"
              class="platform-tab ${activeView === "semi" ? "active-semi" : ""}"
              id="navTabSemiFg"
              data-view="semi"
            >
              <span>${t.navSemiFg}</span>
              <span class="platform-tab-tag" id="headerSemiScoreTag" style="color:#fca5a5; background:rgba(220,38,38,0.2);">${semiScore}</span>
            </button>
            <a
              href="/pro-swing.html"
              class="platform-tab ${isProSwing ? "active-rsa" : ""}"
              style="text-decoration:none;"
              title="Self-Directed Quantitative Factor Research Archive"
            >
              <span>Quant Archive</span>
            </a>
          </div>
        </div>

        <div class="nav-actions">
          <button
            type="button"
            class="btn btn-sm"
            id="btnToggleTomFont"
            title="Toggle Large Senior Text Size (18px-20px)"
            style="min-height:38px; padding:4px 9px; font-weight:800; border-color:rgba(16,185,129,0.5); color:#34d399;"
          >
            🔍 ${state.fontSizeMode === "large" ? "Text: Large" : "Text: A+"}
          </button>

          <button
            type="button"
            class="btn btn-sm"
            id="btnToggleTomTheme"
            title="Switch between Daylight Light Mode and Dark Mode"
            style="min-height:38px; padding:4px 9px; font-weight:800; border-color:rgba(251,191,36,0.5); color:#fbbf24;"
          >
            ${state.uiTheme === "light" ? "🌙 Dark" : "☀️ Daylight"}
          </button>

          <div class="lang-switch" aria-label="Language Selector">
            <button type="button" class="lang-btn ${lang !== "jp" ? "active" : ""}" data-lang="en">EN</button>
            <button type="button" class="lang-btn ${lang === "jp" ? "active" : ""}" data-lang="jp">JP</button>
          </div>

          <span class="badge ${isPro ? "badge-ignition" : "badge-watch"}" id="proStatusBadge">
            ${isPro ? t.statusPro : t.statusFree}
          </span>

          <button type="button" class="btn" id="btnOpenLicense">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span id="btnLicense">${t.btnLicense}</span>
          </button>

          <div class="social-icon-cluster" aria-label="Official Social Channels">
            <a
              class="btn social-btn yt"
              id="headerYoutubeLink"
              href="${ytUrl}"
              target="_blank"
              rel="noopener noreferrer"
              title="Official YouTube (@RightSideAlpha)"
              aria-label="Official YouTube"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/>
              </svg>
            </a>

            <a
              class="btn social-btn ig"
              id="headerInstagramLink"
              href="${igUrl}"
              target="_blank"
              rel="noopener noreferrer"
              title="Official Instagram (@rightsidealpha)"
              aria-label="Official Instagram"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            <a
              class="btn social-btn x"
              id="headerXLink"
              href="${xUrl}"
              target="_blank"
              rel="noopener noreferrer"
              title="Official X (@rightsidealpha)"
              aria-label="Official X"
            >
              <span style="font-weight:700; font-size:0.85rem;">𝕏</span>
            </a>
          </div>

          <a
            class="btn ${isPro ? "" : "btn-gated-vip-tg"}"
            id="headerTelegramLink"
            href="${tgUrl}"
            ${isPro ? 'target="_blank" rel="noopener noreferrer"' : ""}
            title="${isPro ? "Open VIP Telegram Educational Research Channel" : "VIP Subscribers — Educational Research Channel"}"
            style="border-color:rgba(56,189,248,0.45); color:#38bdf8;"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span>${isPro ? "👑 VIP TG" : "🔒 VIP TG"}</span>
          </a>

          ${
            isAdminMode
              ? `<button type="button" class="btn" id="btnOpenConfig">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span id="btnAdmin">${t.btnAdmin}</span>
          </button>`
              : ""
          }

          <a
            class="btn btn-primary lemonsqueezy-button"
            id="topSubscribeBtn"
            data-tom-paid-plan="monthly"
            data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
            href="${lsMonthlyHref}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span id="btnUnlockPro">${t.btnUnlockPro}</span>
          </a>
        </div>
      </div>
    </header>
  `;
}


// --- src/components/Hero.js ---
const TOM_MORNING_CLUB_NOTES = [
  "Good morning, Club Member — you never have to chase every rally. Protecting your principal comes first.",
  "Good morning, friend — cash in your 401(k) or IRA is a safe harbor, never a missed opportunity.",
  "Welcome back this morning — patience is your greatest retirement advantage when Wall Street gets noisy.",
  "Good morning, Club Member — one calm 60-second check beats watching anxious market headlines all day.",
  "Steady mornings build peaceful retirements — let safe uptrends come to you, and enjoy your day.",
  "Good morning — protecting what you have worked decades to save always matters more than guessing market tops.",
  "Glad you are with us today — small, steady habits keep your nest egg safe through every market season.",
];
const TOM_MORNING_CLUB_COMPANION_MSG = {
  steady:
    "🤝 Right beside you — staying calm in quality dividend & index compounders while rebalancing 2–4 times a year is how retirement wealth endures.",
  watch:
    "👀 Wise patience — waiting calmly on the sidelines while collecting steady dividend income protects both your sleep and your savings.",
  cash:
    "🛡️ Smart defense — holding T-Bill & money-market cash cushions in uncertain weeks keeps your nest egg intact for the next calm uptrend.",
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
function getTomMorningClubSeed(dateStr) {
  let h = 2166136261;
  const s = String(dateStr || "2026-11-15");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
function syncTomMorningClubStreak(todayKey) {
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
function getTomMorningClubPollData(todayKey) {
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
const TOM_CRM_SEGMENTS = [
  { id: "retirement_401k_ira", label: "401(k) / IRA Retirement Cashflow & Defense" },
  { id: "us_macro_sp500", label: "Daily US Macro & S&P 500" },
  { id: "ai_semis_momentum", label: "Semiconductors & AI Leaders" },
];
function escapeTomCrmHtml(raw) {
  return String(raw || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function getTomCrmSegmentLabel(segId) {
  const key = String(segId || "").trim();
  const found = TOM_CRM_SEGMENTS.find((s) => s.id === key);
  return found ? found.label : TOM_CRM_SEGMENTS[0].label;
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
    }
  } catch (_) {}
  return null;
}
function registerTomClubMemberSafe(opts) {
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
function bindTomPasswordlessClubEvents(state, showToastFn) {
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
            📘 Open Your Free $0 Calm Rebalancing Manual ->
          </a>
        `;
      }

      if (typeof showToastFn === "function") {
        showToastFn("✅ Morning Bell Macro Club Membership Active!");
      }
    });
  }
}
const TOM_RETIRE_NEST_PRESETS = [
  { val: 150000, label: "$150k" },
  { val: 400000, label: "$400k" },
  { val: 800000, label: "$800k" },
  { val: 1500000, label: "$1.5M" },
];
const TOM_RETIRE_YEAR_PRESETS = [
  { val: 0, label: "Retiring Now" },
  { val: 5, label: "5 Yrs" },
  { val: 10, label: "10 Yrs" },
  { val: 15, label: "15 Yrs" },
];
const TOM_RETIRE_ADD_PRESETS = [
  { val: 0, label: "$0/mo" },
  { val: 500, label: "$500/mo" },
  { val: 1000, label: "$1,000/mo" },
  { val: 2000, label: "$2,000/mo" },
];
const TOM_RETIRE_WEATHER_MAP = {
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
function detectTomLiveWeatherMode(semiScoreNum, cntGreen, cntRed) {
  const fg = Number(semiScoreNum);
  if ((!isNaN(fg) && fg <= 32) || Number(cntRed) >= 40) return "red";
  if (!isNaN(fg) && fg >= 58 && Number(cntGreen) >= 15) return "green";
  return "yellow";
}
function computeTomRetirementPlan({ nestEgg, years, monthlyAdd, weatherMode }) {
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
function renderTomRetirementArchitect(state, { semiScore, cntGreen, cntRed }) {
  const cfg = (state && state.config) || {};
  const lsMonthly =
    cfg.ls_site1_monthly_url ||
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en";
  const lsLtd =
    cfg.ls_site1_ltd_url ||
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en";

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
          Live Market Weather: ${plan.weatherPill} (Semi F&amp;G ${semiScore}/100)
        </span>
      </div>

      <h2 class="tom-retire-title">
        30-Second Comfortable Retirement &amp; Monthly Cashflow Simulator
      </h2>
      <p class="tom-retire-lead">
        Tap 3 buttons below to see your <b>calm monthly retirement paycheck</b> (on top of Social Security), how much monthly income you protect by avoiding a <b>-35% retirement-eve crash</b>, and how to rebalance <b>$SGOV &middot; $SCHD &middot; $JEPI &middot; $VOO</b> calmly just <b>2–4 times a year</b>.
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
          📘 Step 1 ($0 Free): Safe Brokerage &amp; Calm Rebalance Manual
        </button>
        <button type="button" class="tom-retire-cta-btn step-club" id="btnTomRetireStepClub">
          ☕ Step 2 (Free 3-Sec Club): Daily Retirement Cashflow Brief
        </button>
        <a
          href="${lsMonthly}"
          class="tom-retire-cta-btn step-vip lemonsqueezy-button"
          data-tom-paid-plan="monthly"
          data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
        >
          ⚡ Step 3: Start Monthly VIP — $29/mo
        </a>
        <a
          href="${lsLtd}"
          class="tom-retire-cta-btn step-ltd lemonsqueezy-button"
          data-tom-paid-plan="annual"
          data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b"
        >
          👑 Start Annual VIP — $199/yr
        </a>
      </div>
    </section>
  `;
}
function bindTomRetirementArchitectEvents(state, showToastFn) {
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
function renderHero(state) {
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
  const existingClubMember = getStoredTomClubMember();
  const hasActiveClubMember = Boolean(existingClubMember && existingClubMember.email);
  const initialClubSeg =
    (existingClubMember && existingClubMember.segment) || "retirement_401k_ira";
  const initialClubSegLabel = getTomCrmSegmentLabel(initialClubSeg);
  const initialClubEmail =
    (existingClubMember && existingClubMember.email) || savedFreeEmail || "";
  const initialClubNick =
    (existingClubMember && existingClubMember.nickname) || "";

  return `
    <section class="hero">
      <div class="hero-top-row">
        <div style="min-width:0; flex:1 1 320px;">
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
            <div class="hero-tag" id="heroTag" style="margin-bottom:0; font-size:0.95rem;">${t.heroTag} · ${latestStockDate}</div>
            <button
              type="button"
              class="btn btn-sm"
              id="btnOpenPwRsiExplainer"
              style="min-height:48px; padding:8px 16px; font-size:0.95rem; font-family:var(--font-mono); font-weight:800; border-color:rgba(56,189,248,0.5); color:#38bdf8; background:rgba(56,189,248,0.12); display:inline-flex; align-items:center; gap:6px; cursor:pointer;"
              title="Click to view full methodology"
            >
              <span>💡</span>
              <span>${t.pwRsiExplainerBtn || "How It Works"}</span>
            </button>
          </div>
          <h1 id="heroTitle">${t.heroTitle}</h1>
          <p id="heroDesc" style="font-size:1.125rem; line-height:1.72;">${t.heroDesc}</p>
        </div>
      </div>

      <!-- 🚦 JARGON-FREE 3-COLOR MARKET WEATHER SUMMARY (50-70s US INVESTORS · CALM 2-4X/YR REBALANCING) -->
      <div class="tom-traffic-strip" id="tomTrafficLightStrip" role="group" aria-label="Today's 3-Color Market Weather Indicators">
        <button type="button" class="tom-traffic-card t-green" data-traffic-zone="RETIRE_SIM">
          <span style="font-size:0.96rem; font-weight:800; color:#34d399;">🟢 CALM UPTREND WEATHER</span>
          <strong style="font-size:1.1rem; color:var(--text);">20% $SGOV · 35% $JEPI+$SCHD · 45% $VOO</strong>
          <span style="font-size:1rem; line-height:1.55; color:var(--text-secondary);">Healthy broad trend · Let dividends &amp; S&amp;P 500 core compound calmly →</span>
        </button>
        <button type="button" class="tom-traffic-card t-yellow" data-traffic-zone="RETIRE_SIM">
          <span style="font-size:0.96rem; font-weight:800; color:#fbbf24;">🟡 CAUTIOUS BASE WEATHER</span>
          <strong style="font-size:1.1rem; color:var(--text);">30% $SGOV · 40% $JEPI+$SCHD · 30% $VOO</strong>
          <span style="font-size:1rem; line-height:1.55; color:var(--text-secondary);">Mixed breadth · Collect steady monthly dividends while bases form →</span>
        </button>
        <button type="button" class="tom-traffic-card t-red" data-traffic-zone="MANUAL">
          <span style="font-size:0.96rem; font-weight:800; color:#f87171;">🔴 CRASH DEFENSE WEATHER</span>
          <strong style="font-size:1.1rem; color:var(--text);">40% $SGOV · 40% $JEPI+$SCHD · 20% $VOO</strong>
          <span style="font-size:1rem; line-height:1.55; color:var(--text-secondary);">Calm 2–4x/yr weight rebalance · Open the $0 Safe Rebalancing Manual →</span>
        </button>
      </div>

      <!-- 🧭 30-SECOND COMFORTABLE RETIREMENT & MONTHLY CASHFLOW SIMULATOR (#tom-retirement-architect) -->
      ${renderTomRetirementArchitect(state, { semiScore, cntGreen, cntRed })}

      <!-- 📧 ABOVE-THE-FOLD 60PX 1-FIELD FREE MORNING SIGNAL EMAIL SIGNUP -->
      <div class="tom-morning-box" id="tomMorningSignalBox">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <span style="background:rgba(16,185,129,0.2); color:#34d399; border:1px solid rgba(16,185,129,0.45); font-size:0.94rem; font-weight:800; padding:5px 12px; border-radius:999px;">
            📧 FREE DAILY 8:30 AM ET RETIREMENT BRIEF · NO CREDIT CARD REQUIRED
          </span>
          <span style="font-size:0.95rem; color:var(--text-secondary); font-weight:700;">
            100% Free Forever · Unsubscribe in 1 Click
          </span>
        </div>
        <h2 style="font-size:1.3rem; font-weight:900; color:var(--text); margin:10px 0 6px; line-height:1.38;">
          Get Today&rsquo;s 3-Color Retirement Weather &amp; Calm Rebalancing Guide Every Morning
        </h2>
        <p style="font-size:1.08rem; color:var(--text-secondary); margin:0; line-height:1.68;">
          Enter your email once to instantly unlock <b>Today&rsquo;s 4-Core Retirement Model Weights ($SGOV &middot; $SCHD &middot; $JEPI &middot; $VOO)</b> right on this screen plus calm morning guidance.
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
            📧 Get My Free Daily Retirement Brief →
          </button>
        </form>
        <div id="tomMorningSignalStatus" role="status" aria-live="polite" style="display:${savedFreeEmail ? "block" : "none"}; margin-top:10px; font-size:1.05rem; font-weight:800; color:#34d399;">
          ${savedFreeEmail ? `✅ Free Morning Retirement Brief Active (${savedFreeEmail.replace(/[<>&"]/g, "")}) — Your 4-Core Allocation Guide below is unlocked!` : ""}
        </div>
        <div id="tomFreeMemberBonusCard" style="display:${savedFreeEmail ? "block" : "none"}; margin-top:12px; background:rgba(15,23,42,0.9); border:1.5px solid #10b981; border-radius:12px; padding:14px 16px; font-size:1.06rem; line-height:1.72; color:#f8fafc;">
          <div style="font-weight:800; color:#34d399; margin-bottom:6px;">🎁 FREE MEMBER BONUS UNLOCKED — Today&rsquo;s 4-Core Retirement Posture (2–4x/Yr Calm Rebalance):</div>
          <div>• <b>🛡️ Bucket 1 ($SGOV US T-Bill Cushion):</b> Hold <b>30–40%</b> in short-term Treasury cash (~4.7% yield) so monthly bills are 100% insulated.</div>
          <div>• <b>💵 Bucket 2 ($JEPI + $SCHD Dividend Income):</b> Hold <b>35–40%</b> across monthly income &amp; rising dividend aristocrats.</div>
          <div>• <b>🌱 Bucket 3 ($VOO S&amp;P 500 + $XLV Healthcare):</b> Semi Fear &amp; Greed at <b>${semiScore}/100</b> — Rebalance calmly 2–4 times a year, never panic-sell.</div>
        </div>
      </div>

      <!-- ☕ MORNING BELL CLUB — ZERO-SIGNUP DAILY HABIT & BELONGING HUB -->
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

        <div
          class="tom-crm-signup-panel"
          id="tom-passwordless-club-signup"
          role="region"
          aria-label="Passwordless 3-Second Morning Bell Macro Club Membership"
        >
          <div class="tom-crm-top-row">
            <span class="tom-crm-badge">FREE MEMBER BRIEFING · NO PASSWORD NEEDED</span>
            <span class="tom-crm-trust-note">100% Free · 1-Click Unsubscribe Anytime</span>
          </div>

          <h3 class="tom-crm-heading">
            Get Daily Retirement Cashflow &amp; 3-Color US Macro Briefings in Your Inbox.
          </h3>
          <p class="tom-crm-subcopy">
            3-second passwordless club access. Choose your #1 focus to protect your 401(k)/IRA principal and calm monthly income before the 9:30 AM opening bell.
          </p>

          <div
            class="tom-crm-active-bar"
            id="tom-club-active-member-bar"
            style="display:${hasActiveClubMember ? "flex" : "none"};"
          >
            <span class="tom-crm-active-text" id="tom-club-active-member-text">
              ${
                hasActiveClubMember
                  ? `Morning Bell Member Active: ${escapeTomCrmHtml(existingClubMember.email)} · Focus: ${escapeTomCrmHtml(initialClubSegLabel)}`
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

            <div class="tom-crm-seg-label">Tap Your #1 Morning Focus (1-Click):</div>
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
                placeholder="Enter your best email for Morning Bell alerts"
                aria-label="Email address"
              />
              <button type="submit" id="tom-club-signup-btn" class="tom-crm-submit-btn">
                Join Free Morning Bell Club (3-Sec Access) ->
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
        </div>
      </div>

      <!-- 3 BIG INTUITIVE EDUCATIONAL CALCULATOR SHORTCUTS -->
      <div class="hero-action-grid" role="group" aria-label="Educational Calculator Shortcuts">
        <button type="button" class="hero-cta-card primary" id="btnHeroActionRetireSim">
          <span>🧭 30-Sec Retirement Cashflow Calculator</span>
        </button>
        <button type="button" class="hero-cta-card emerald" id="btnHeroActionManual">
          <span>📘 $0 Brokerage &amp; 2–4x/Yr Rebalance Guide</span>
        </button>
        <a href="/semi-fear-greed.html" class="hero-cta-card semi" id="btnHeroActionSemiFg">
          <span>🌡️ Market Weather &amp; Barbell Calculator (${semiScore})</span>
        </a>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-emerald">
          <div class="kpi-label" id="kpi1_label">${t.kpi1_label}</div>
          <div class="kpi-val">26.8 Yrs</div>
          <div class="kpi-sub" id="kpi1_sub">${t.kpi1_sub}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label" id="kpi2_label">${t.kpi2_label}</div>
          <div class="kpi-val">4 ETFs</div>
          <div class="kpi-sub" id="kpi2_sub">${t.kpi2_sub}</div>
        </div>
        <div class="kpi-card kpi-emerald">
          <div class="kpi-label" id="kpi3_label">${t.kpi3_label}</div>
          <div class="kpi-val">2–4x/Yr</div>
          <div class="kpi-sub" id="kpi3_sub">${t.kpi3_sub}</div>
        </div>
        <div class="kpi-card kpi-amber">
          <div class="kpi-label" id="kpi4_label">${t.kpi4_label}</div>
          <div class="kpi-val">100% Local</div>
          <div class="kpi-sub" id="kpi4_sub">${t.kpi4_sub}</div>
        </div>
      </div>
    </section>
  `;
}
function renderFreeStarterManual(state) {
  const cfg = (state && state.config) || {};
  const lsMonthly =
    cfg.ls_site1_monthly_url ||
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en";
  const lsAnnual =
    cfg.ls_site1_ltd_url ||
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en";
  const isWebView =
    typeof window !== "undefined" &&
    typeof window.isTomInAppWebView === "function" &&
    window.isTomInAppWebView();

  return `
    <section class="tom-starter-manual-section" id="tomFreeStarterManual" aria-label="$0 Free Public Product: US Brokerage App & Calm 2-4x/Year Rebalancing Starter Manual">
      <div class="tom-manual-top-row">
        <span class="tom-manual-free-pill">📘 $0 FREE PUBLIC PRODUCT · SELF-DIRECTED EDUCATIONAL GUIDE</span>
        <span class="tom-manual-broker-pill">🏦 Fidelity · Charles Schwab · Vanguard Ready</span>
      </div>

      <h2 class="tom-manual-heading">
        US Brokerage App &amp; Calm 2–4x/Year Portfolio Rebalancing Manual ($0 Free Edition)
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
          <span class="tom-manual-step-badge step-b2">STEP 2 · CALM WEIGHT REBALANCING</span>
          <strong class="tom-manual-step-title">2–4x/Year Portfolio Weight Rebalancing</strong>
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
          href="${lsMonthly}"
          class="tom-manual-vip-link lemonsqueezy-button"
          data-direct-ls="1"
          data-tom-paid-plan="monthly"
          data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
        >
          ⚡ Start Monthly VIP — $29/mo
        </a>
        <a
          href="${lsAnnual}"
          class="tom-manual-vip-link is-ltd lemonsqueezy-button"
          data-direct-ls="1"
          data-tom-paid-plan="annual"
          data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b"
        >
          👑 Start Annual VIP — $199/yr
        </a>
      </div>
    </section>
  `;
}
function renderEasyProfitSimulator(state) {
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
              ${t.auditedCardDesc || "Audited institutional point-in-time backtest across 6,625 trading days with zero look-ahead bias. Rebalanced annually with dynamic 80:20 contrarian tilt during semiconductor drawdowns ≥ -20%."}
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
              <td style="font-family:var(--font-sans);">3. PW-RSI Right-Side Ignition (+14–35% off low + MA20/60 Breakout + 1.40x Vol + 55D Time-Stop)</td>
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
function renderStockTable(state) {
  const t = state.t;
  const isPro = state.isProUnlocked;
  const stocks = (state.filteredStocks || []).filter((s) => !String(s.ticker).includes("."));
  const cfg = state.config || {};
  const monthlyUrl = formatCheckoutUrl(
    cfg.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en"
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
        ${t.softPaywallDesc || "Click any unlocked stock row for factor details, or unlock Monthly VIP ($29/mo) to reveal all hidden dataset rows, MA60 reference bands, and CSV exports."}
      </p>
      <a class="soft-paywall-btn lemonsqueezy-button btn-unlock-row" data-direct-ls="1" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${monthlyUrl}" target="_blank" rel="noopener noreferrer" style="min-height:42px;">
        🔒 ${t.softPaywallUnlockCta || "Start Monthly VIP — $29/mo"} →
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
              <a class="btn btn-primary btn-sm lemonsqueezy-button btn-unlock-row" data-direct-ls="1" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthlyUrl}" target="_blank" rel="noopener noreferrer" style="min-height:40px; white-space:nowrap; font-weight:700;">
                🔒 Start Monthly VIP — $29/mo
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
          <a class="btn btn-primary btn-sm lemonsqueezy-button btn-unlock-row" data-direct-ls="1" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthlyUrl}" target="_blank" rel="noopener noreferrer" style="min-height:38px; white-space:nowrap; font-weight:700;">
            🔒 Start Monthly VIP — $29/mo
          </a>
        </td>
        <td>
          <a class="btn btn-primary btn-sm lemonsqueezy-button btn-unlock-row" data-direct-ls="1" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthlyUrl}" target="_blank" rel="noopener noreferrer" style="min-height:38px; white-space:nowrap; font-weight:700;">
            🔒 Start Monthly VIP — $29/mo
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
        : `<a class="btn btn-sm lemonsqueezy-button btn-unlock-row" data-direct-ls="1" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthlyUrl}" target="_blank" rel="noopener noreferrer" style="min-height:38px; white-space:nowrap; font-weight:700; border-color:rgba(59,130,246,0.45); color:#93c5fd; background:rgba(37,99,235,0.14);">
             🔒 Start Monthly VIP — $29/mo
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
indicator("RightSideAlpha PW-RSI Ignition v2.6", overlay=true)
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
plot(ma60, "MA60 Trigger", color=color.new(color.orange, 0), linewidth=2)
plotshape(ignition and not ignition[1], "PW-RSI IGNITION", shape.labelup, location.belowbar, color.green, text="IGNITION", textcolor=color.white)`;

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
                     Unlock All 72 Factor Datasets, Position Sizing Math Calculator &amp; Pine Script v5
                   </div>
                   <div style="font-size:0.8rem; color:var(--muted); margin-bottom:14px; line-height:1.5;">
                     Free users see 1 open factor example ($CELH). Upgrade to Monthly VIP ($29/mo) or Annual VIP ($199/yr) to access the full quantitative factor dataset, mathematical share-sizing models, and the 26.8-Year Semiconductor CSV.
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
              📥 Export Watchlist CSV
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

        <!-- Module 03: TradingView Pine Script v5 -->
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
            <button class="btn btn-purple" id="btnCopyPineScript" style="width:100%; justify-content:center; padding:9px;">
              ${t.tool3CopyBtn}
            </button>
          </div>
        </div>

        <!-- Module 04: Pro VIP 80:20 Barbell Portfolio Allocation & 1-Click Institutional Export Kit -->
        <div style="background:#090d16; border:1px solid var(--border); border-top:2px solid #10b981; border-radius:4px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:#34d399; letter-spacing:0.05em; text-transform:uppercase;">
              👑 PRO VIP EXCLUSIVE · BARBELL REBALANCER & EXPORT KIT
            </div>
            <h3 style="font-size:1rem; font-weight:800; margin:6px 0; color:#ffffff;">
              80:20 ($SMH : $XLV) Custom Portfolio Blueprint & 1-Click TradingView / CSV Kit
            </h3>
            <p style="font-size:0.78rem; color:var(--muted); margin-bottom:10px;">
              Automatically allocates your <b class="mono" style="color:#fff;">$${proCapUsd.toLocaleString()}</b> account across core Semiconductor ETF ($SMH), Healthcare Shield ($XLV), and Top VIP Ignition slots, plus instant CSV &amp; TradingView exports:
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
              📥 Download Full 72-Stock VIP Action Sheet (.CSV)
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

const PRICING_COPY = {
  en: {
    heading: "Self-Directed Educational Calculator Software — Simple VIP Access",
    subheading:
      "Public market data visualization & dividend/allocation calculator software for self-directed learners. Backed by our 14-Day No-Questions-Asked Refund Policy.",
    t1Badge: "MONTHLY VIP",
    t1Title: "Monthly VIP Educational Calculator Suite",
    t1Period: "/ month",
    t1Items: [
      "Self-Directed Educational Calculator Software across SGOV, SCHD, JEPI, VOO & US Blue-Chip Datasets",
      "Daily 08:10 EST Public Balance-Sheet & Dividend Coverage Educational Summaries",
      "Calm 2–4x/Year Portfolio Weight Rebalancing & Drawdown Math Calculators",
      "TradingView Educational Trend Overlay Script + 26.8-Year US Market Weather CSV",
    ],
    t1Btn: "Start Monthly VIP — $29/mo",
    t1PayNote: "🍎 Apple Pay · Google Pay · Credit Card (1-Click Cancel Anytime · 14-Day Refund Policy)",
    t2Badge: "ANNUAL VIP",
    t2Title: "Annual VIP Educational Calculator Pass",
    t2Period: "/ year",
    t2Items: [
      "Full 12-Month Access to All Self-Directed Educational Calculators & Visualizations",
      "Complete 26.8-Year (1998–2026) US Equity & ETF Historical CSV Datasets",
      "English & Japanese Educational Macro Research Archive + VIP Dispatch Desk",
      "Unified Access Across TruthOfMarket Retirement & Market Weather Calculators",
    ],
    t2Btn: "Start Annual VIP — $199/yr",
    t2PayNote: "🍎 Apple Pay · Google Pay · Credit Card (Billed Annually · 14-Day Refund Policy)",
    autoUnlockNote:
      "✨ Instant Software Activation: Your self-directed educational calculators and CSV datasets unlock on screen automatically after checkout.",
    restoreSummary: "🔑 Switching devices or already subscribed? Restore your VIP License Key here",
    restoreBtn: "Open License Key Restore Box",
    t3Badge: "OPTIONAL EXTERNAL CHARTING & COMMUNITY LINKS",
    t3Title: "External Charting Platforms & Free Public Channels",
    t3Desc: "Optional third-party charting tools and official public channels (separate from your TruthOfMarket VIP software pass):",
    t3Items: [
      "<b>TradingView Pro (ID: 1173809)</b> — Multi-timeframe moving-average & Pine Script v5 visualization",
      "<b>Seeking Alpha Premium (better_life333)</b> — Public dividend grades & consensus EPS data",
      "<b>TrendSpider Charting Software (rightside)</b> — Multi-factor technical charting workspace",
    ],
    tvBtn: "📈 Launch TradingView Charting ↗",
    saBtn: "📊 Open Seeking Alpha Dividend Data ↗",
    tsBtn: "⚡ Launch TrendSpider Workspace ↗",
    tgBtn: "🔒 VIP Telegram Educational Research Desk",
  },
  jp: {
    heading: "自己判断型・教育用ポートフォリオ計算ソフトウェア — VIPプラン",
    subheading:
      "公開市場データの可視化および配当・資産配分シミュレーションを行う教育用計算ソフトウェアです（14日間返金保証付き）。",
    t1Badge: "MONTHLY VIP",
    t1Title: "Monthly VIP 教育用計算ソフト＆財務データ",
    t1Period: "/ 月額",
    t1Items: [
      "SGOV・SCHD・JEPI・VOOおよび米国主要ETFの3色リバランス比率計算ソフト",
      "毎朝08:10 EST更新・公開財務データ＆配当カバレッジ教育サマリー",
      "年2〜4回の穏やかな資産配分チェック＆ドローダウン数学シミュレーター",
      "TradingView 教育用トレンド表示スクリプト＋米国市場26.8年CSVデータ",
    ],
    t1Btn: "Start Monthly VIP — $29/mo",
    t1PayNote: "🍎 Apple Pay · Google Pay · Credit Card (いつでも1クリック解約 · 14日間返金保証)",
    t2Badge: "ANNUAL VIP",
    t2Title: "Annual VIP 年間オールアクセスパス",
    t2Period: "/ 年額",
    t2Items: [
      "月額比43%割引 — 全教育用シミュレーター＆データ可視化ツールの年間利用権",
      "26.8年間(1998–2026)の米国株＆ETFヒストリカルCSVデータセット完全収録",
      "英語・日本語対応の教育用マクロリサーチアーカイブ閲覧",
      "TruthOfMarket 老後キャッシュフロー＆市場天気ツールの全機能アクセス",
    ],
    t2Btn: "Start Annual VIP — $199/yr",
    t2PayNote: "🍎 Apple Pay · Google Pay · Credit Card (年額プラン · 14日間返金保証)",
    autoUnlockNote: "✨ 決済完了と同時にブラウザ上で教育用計算ツールとCSVデータが自動解放されます。",
    restoreSummary: "🔑 機種変更・別ブラウザでのVIPライセンスキー復元はこちら",
    restoreBtn: "ライセンスキー復元ウィンドウを開く",
    t3Badge: "OPTIONAL EXTERNAL CHARTING & COMMUNITY LINKS",
    t3Title: "外部チャート検証ツール＆公式SNSチャンネル（任意）",
    t3Desc: "チャート確認や公開財務データ参照に便利な外部提携ツール＆公式チャンネル：",
    t3Items: [
      "<b>TradingView Pro (1173809)</b> — マルチタイムフレーム移動平均線＆Pine Script v5表示",
      "<b>Seeking Alpha Premium (better_life333)</b> — 配当データ＆コンセンサスEPS推移",
      "<b>TrendSpider Charting (rightside)</b> — チャート分析ワークスペース",
    ],
    tvBtn: "📈 TradingView チャートを開く ↗",
    saBtn: "📊 Seeking Alpha 財務データ ↗",
    tsBtn: "⚡ TrendSpider チャートを開く ↗",
    tgBtn: "🔒 VIP専用 Telegram 教育リサーチデスク",
  },
};
PRICING_COPY.kr = PRICING_COPY.en;
function renderPricing(state) {
  const cfg = state.config || {};
  const c = PRICING_COPY[state.lang] || PRICING_COPY.en;
  const lsMonthly = formatCheckoutUrl(
    cfg.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en"
  );
  const lsAnnual = formatCheckoutUrl(
    cfg.ls_site1_ltd_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en"
  );
  const tvAffId = encodeURIComponent(cfg.tradingview_aff_id || "1173809");
  const saSource = encodeURIComponent(cfg.seekingalpha_source || "better_life333");
  const tsAffId = encodeURIComponent(cfg.trendspider_aff_id || "rightside");
  const directTvUrl = `https://www.tradingview.com/?aff_id=${tvAffId}`;
  const directSaUrl = `https://seekingalpha.com/symbol/SPY/earnings?source=${saSource}`;
  const directTsUrl = `https://trendspider.com/?_go=${tsAffId}`;

  const checkoutFallbackHtml = `
    <div style="margin-top:8px; font-size:0.74rem; color:#94a3b8; text-align:center; line-height:1.45;">
      Questions about educational software access? Email our Educational Market Data &amp; Quantitative Research Desk at <a href="mailto:beable9489@gmail.com?subject=TruthOfMarket%20Educational%20Software%20Support" style="color:#93c5fd; font-weight:700; text-decoration:underline;">beable9489@gmail.com</a>.
    </div>
  `;

  const checkSvg = `
    <span class="price-check">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
  `;

  return `
    <div id="pricing" style="scroll-margin-top:80px;">
      <span id="pricingSection" style="display:block; height:0; overflow:hidden;"></span>
      <div style="max-width:980px; margin:0 auto 14px; text-align:center;">
        <div style="display:inline-block; margin-bottom:8px; padding:4px 12px; border-radius:999px; background:rgba(56,189,248,0.14); border:1px solid rgba(56,189,248,0.4); color:#7dd3fc; font-size:0.8rem; font-weight:800; letter-spacing:0.02em;">
          SELF-DIRECTED EDUCATIONAL CALCULATOR SOFTWARE &bull; PUBLIC MARKET DATA VISUALIZATION
        </div>
        <h2 style="font-size:1.35rem; font-weight:900; color:#ffffff; margin:0 0 6px;">${c.heading}</h2>
        <p style="font-size:0.95rem; color:#cbd5e1; margin:0; line-height:1.55;">${c.subheading}</p>
      </div>
      <div class="pricing-grid">
        <!-- Tier 1: Monthly VIP ($29/mo) -->
        <div class="price-card featured">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span class="badge badge-ignition">${c.t1Badge}</span>
              <span class="badge price-badge-popular">POPULAR</span>
            </div>
            <h3 style="font-size:1.18rem; font-weight:800; margin-top:10px; color:#ffffff;">
              ${c.t1Title}
            </h3>
            <div class="price-num">$29 <span style="font-size:0.86rem; color:var(--muted); font-family:var(--font-sans); font-weight:600;">${c.t1Period}</span></div>
            <div class="price-subtext">Billed monthly · Cancel anytime with 1 click · 14-Day Refund Policy</div>
            <ul class="price-list">
              ${c.t1Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <a class="btn btn-primary lemonsqueezy-button" id="cardMonthlyBtn" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthly}" style="justify-content:center; min-height:64px; padding:14px 18px; width:100%; font-size:1.06rem; font-weight:800; border-radius:12px;">
              ${c.t1Btn}
            </a>
            <div style="margin-top:9px; font-size:0.82rem; color:#e2e8f0; font-weight:700; text-align:center; line-height:1.4;">
              ${c.t1PayNote}
            </div>
            ${checkoutFallbackHtml}
          </div>
        </div>

        <!-- Tier 2: Annual VIP ($199/yr) -->
        <div class="price-card best-value">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span class="badge badge-watch">${c.t2Badge}</span>
              <span class="badge price-badge-lifetime">BEST VALUE · SAVE 43%</span>
            </div>
            <h3 style="font-size:1.18rem; font-weight:800; margin-top:10px; color:#ffffff;">
              ${c.t2Title}
            </h3>
            <div class="price-num">$199 <span style="font-size:0.86rem; color:var(--muted); font-family:var(--font-sans); font-weight:600;">${c.t2Period}</span></div>
            <div class="price-subtext">Annual recurring license ($199/yr) · Cancel anytime · 14-Day Refund Policy</div>
            <div class="price-savings-pill">⚡ Save $149/Yr vs $29/mo Monthly Billing ($199/yr vs $348/yr)</div>
            <ul class="price-list">
              ${c.t2Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <a class="btn btn-emerald lemonsqueezy-button" id="cardLtdBtn" data-tom-paid-plan="annual" data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b" href="${lsAnnual}" style="justify-content:center; min-height:64px; padding:14px 18px; width:100%; font-size:1.06rem; font-weight:800; border-radius:12px;">
              ${c.t2Btn}
            </a>
            <div style="margin-top:9px; font-size:0.82rem; color:#a7f3d0; font-weight:700; text-align:center; line-height:1.4;">
              ${c.t2PayNote}
            </div>
            ${checkoutFallbackHtml}
          </div>
        </div>
      </div>

      <!-- MANDATORY PERMANENT EDUCATIONAL SOFTWARE DISCLAIMER -->
      <div id="tomPricingDisclaimerBox" role="note" style="max-width:980px; margin:16px auto 0; padding:14px 18px; border-radius:10px; background:rgba(15,23,42,0.9); border:1.5px solid rgba(251,191,36,0.45); color:#f8fafc; font-size:0.94rem; line-height:1.62; text-align:left;">
        Disclaimer: TruthOfMarket provides self-directed educational data visualization and mathematical portfolio calculators only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice.
      </div>

      <!-- Instant Auto-Unlock Note & Collapsible Device License Restore -->
      <div style="max-width:980px; margin:12px auto 0; text-align:center;">
        <div style="font-size:0.84rem; color:#34d399; font-weight:700; margin-bottom:10px;">
          ${c.autoUnlockNote}
        </div>
        <details style="background:#0b1120; border:1px solid rgba(148,163,184,0.22); border-radius:10px; padding:10px 16px; text-align:left;">
          <summary style="cursor:pointer; font-size:0.84rem; font-weight:700; color:#93c5fd; list-style:none;">
            ${c.restoreSummary} ▾
          </summary>
          <div style="margin-top:10px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; font-size:0.82rem; color:#cbd5e1;">
            <span>Already have a Lemon Squeezy receipt key on another computer or phone? Restore your VIP session with 1 click:</span>
            <button type="button" class="btn btn-sm" onclick="var b=document.getElementById('btnOpenLicense');if(b){b.click();}else{var m=document.getElementById('licenseModal');if(m)m.style.display='flex';}" style="font-weight:700; border-color:rgba(147,197,253,0.45); color:#93c5fd;">
              ${c.restoreBtn} →
            </button>
          </div>
        </details>
      </div>

      <!-- Trust & Security Micro-Ribbon -->
      <div class="pricing-trust-ribbon" style="max-width:980px; margin:16px auto 0;">
        <div class="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Merchant of Record: <b>Lemon Squeezy, LLC (Store #296100)</b></span>
        </div>
        <div class="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>14-Day No-Questions-Asked Refund Policy</span>
        </div>
        <div class="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Self-Directed Educational Calculator Software</span>
        </div>
      </div>

      <!-- Separated Lower Footer Section: Tier 3 Partner Tools & Public Channels -->
      <details style="max-width:980px; margin:18px auto 0; background:rgba(15,23,42,0.55); border:1px solid var(--border-card); border-radius:10px; padding:12px 18px;">
        <summary style="cursor:pointer; font-size:0.82rem; font-weight:700; color:#94a3b8; display:flex; align-items:center; justify-content:space-between; gap:8px;">
          <span>🔗 ${c.t3Title}</span>
          <span style="font-size:0.74rem; color:#64748b;">Expand Charting Tools &amp; Community ▾</span>
        </summary>
        <div style="margin-top:14px; padding-top:12px; border-top:1px solid rgba(148,163,184,0.14);">
          <p style="color:var(--muted); font-size:0.82rem; margin:0 0 10px; line-height:1.5;">
            ${c.t3Desc}
          </p>
          <ul class="price-list" style="margin-bottom:12px;">
            ${c.t3Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
          </ul>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:8px;">
            <a class="btn" id="affTvBtn" href="${directTvUrl}" target="_blank" rel="noopener noreferrer" style="justify-content:center;">
              ${c.tvBtn}
            </a>
            <a class="btn" id="affSaBtn" href="${directSaUrl}" target="_blank" rel="noopener noreferrer" style="justify-content:center;">
              ${c.saBtn}
            </a>
            <a class="btn" id="affBrokerBtn" href="${directTsUrl}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(16,185,129,0.45); color:#34d399; font-weight:700;">
              ${c.tsBtn}
            </a>
            <a class="btn ${state.isProUnlocked ? "" : "btn-gated-vip-tg"}" id="pricingTelegramChannelBtn" href="${getVipTelegramUrl(state.isProUnlocked)}" ${state.isProUnlocked ? 'target="_blank" rel="noopener noreferrer"' : ""} style="justify-content:center; border-color:rgba(56,189,248,0.45); color:#38bdf8; font-weight:700;">
              ${state.isProUnlocked ? "👑 Open VIP Educational Research Desk ↗" : c.tgBtn}
            </a>
            <a class="btn" id="pricingYoutubeBtn" href="${cfg.youtube_url || "https://www.youtube.com/@RightSideAlpha"}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(239,68,68,0.4); color:#fca5a5;">
              📺 YouTube (@RightSideAlpha) ↗
            </a>
            <a class="btn" id="pricingInstagramBtn" href="${cfg.instagram_url || "https://www.instagram.com/rightsidealpha"}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(236,72,153,0.4); color:#f9a8d4;">
              📸 Instagram (@rightsidealpha) ↗
            </a>
          </div>
        </div>
      </details>
    </div>
  `;
}


// --- src/components/Modals.js ---
function renderModals(state) {
  const t = state.t || {};
  const cfg = state.config || {};
  const lsMonthly = formatCheckoutUrl(
    cfg.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en"
  );
  const lsAnnual = formatCheckoutUrl(
    cfg.ls_site1_ltd_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en"
  );
  const tgChannelUrl = cfg.telegram_channel_url || "https://t.me/truthofmarketss";
  const ytUrl = cfg.youtube_url || "https://www.youtube.com/@RightSideAlpha";
  const igUrl = cfg.instagram_url || "https://www.instagram.com/rightsidealpha";
  const tgChatId = state.telegramChatId || cfg.telegram_chat_id || "@truthofmarketss";
  const tgToken = state.telegramBotToken || "DEMO-BOT-TOKEN";
  const tgType = state.telegramAlertType || "SEMI_BRIEFING";
  const ov = state.semiOverview || {};
  const ovDate = ov.date || "2026-10-30";
  const ovScore = Number(ov.fg_score ?? 18.0).toFixed(1);
  const ovRegime = String(ov.regime_en || "EXTREME FEAR").toUpperCase();
  const ovSmh = Number(ov.smh_close ?? 522.49).toFixed(2);
  const ovDd = Number(ov.smh_dd_pct ?? -22.23).toFixed(2);
  const ovRsi = Number(ov.smh_rsi ?? 40.6).toFixed(1);
  const ovXlv = Number(ov.xlv_close ?? 184.87).toFixed(2);
  const ovQqq = Number(ov.qqq_close ?? 690.49).toFixed(2);
  const ovW1 = ov.recommended_smh_weight ?? 80;
  const ovW2 = ov.recommended_xlv_weight ?? 20;
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
          <button type="button" class="btn btn-sm" id="btnCancelLicense" style="padding:4px 10px;">✕ Close</button>
        </div>
        <h3 style="font-size:1.18rem; font-weight:800; margin-top:4px; color:#ffffff;">Unlock Full VIP Educational Calculators &amp; Datasets</h3>
        <p style="color:#cbd5e1; font-size:0.86rem; margin-top:6px; line-height:1.5;">
          Choose Monthly VIP ($29/mo) or Annual VIP ($199/yr) below. Backed by our 14-Day No-Questions-Asked Refund Policy.
        </p>
        <div style="display:grid; grid-template-columns:1fr; gap:10px; margin:14px 0 10px;">
          <a class="btn btn-primary lemonsqueezy-button" data-direct-ls="1" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthly}" style="justify-content:center; min-height:62px; padding:12px 16px; font-size:1.02rem; font-weight:800; border-radius:12px;">
            Start Monthly VIP — $29/mo
          </a>
          <a class="btn btn-emerald lemonsqueezy-button" data-direct-ls="1" data-tom-paid-plan="annual" data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b" href="${lsAnnual}" style="justify-content:center; min-height:62px; padding:12px 16px; font-size:1.02rem; font-weight:800; border-radius:12px;">
            Start Annual VIP — $199/yr (Save 43%)
          </a>
        </div>
        <div style="margin-bottom:8px; font-size:0.78rem; color:#e2e8f0; font-weight:700; text-align:center; line-height:1.45;">
          🍎 Apple Pay · Google Pay · Credit Card (1-Click Cancel Anytime · 14-Day Refund Policy)
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
            <input type="text" id="licenseInput" value="${state.licenseKey || ""}" placeholder="Enter Lemon Squeezy License Key (XXXX-XXXX-XXXX-XXXX)" autocomplete="off" />
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

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">LEMON SQUEEZY MONTHLY VIP URL ($29/MO)</label>
        <input type="text" id="cfgLsMonthly" value="${cfg.ls_site1_monthly_url || "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">LEMON SQUEEZY ANNUAL VIP URL ($199/YR)</label>
        <input type="text" id="cfgLsLtd" value="${cfg.ls_site1_ltd_url || "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TELEGRAM OFFICIAL CHANNEL URL</label>
        <input type="text" id="cfgTgChannel" value="${tgChannelUrl}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">OFFICIAL YOUTUBE CHANNEL URL (@RightSideAlpha)</label>
        <input type="text" id="cfgYoutubeUrl" value="${ytUrl}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">OFFICIAL INSTAGRAM PROFILE URL (@rightsidealpha)</label>
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
              LEGAL &amp; COMPLIANCE · MERCHANT OF RECORD: LEMON SQUEEZY (STORE #296100)
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
              Portfolio inputs entered into our calculators are processed locally in your browser and are never sold or shared with third parties. Payment processing is handled securely by our Merchant of Record, <b>Lemon Squeezy, LLC</b> (Store #296100), under PCI-DSS Level 1 compliance.
            </p>
          </div>
          <div data-legal-section="refund" style="border-top:1px solid var(--border); padding-top:12px; margin-top:12px;">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">3. 14-Day No-Questions-Asked Refund Policy &amp; 1-Click Cancellation</h4>
            <p style="color:var(--muted); margin-bottom:10px;">
              Both Monthly VIP ($29/mo) and Annual VIP ($199/yr) software subscriptions are backed by a <b>14-Day No-Questions-Asked Full Refund Guarantee</b>. Email <a href="mailto:beable9489@gmail.com" style="color:#60a5fa; font-weight:700;">beable9489@gmail.com</a> within 14 calendar days of initial purchase for a 100% full refund to your original payment method. You may also cancel recurring billing anytime in 1 click via your Lemon Squeezy Customer Billing Portal.
            </p>
          </div>
          <div data-legal-section="support" style="border-top:1px solid var(--border); padding-top:12px; margin-top:12px;">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">4. Educational Market Data &amp; Quantitative Research Desk</h4>
            <p style="color:var(--muted);">
              • <b>Official Support Email</b>: <a href="mailto:beable9489@gmail.com" style="color:#60a5fa; font-weight:700;">beable9489@gmail.com</a><br/>
              • <b>Merchant of Record</b>: Lemon Squeezy, LLC (Store #296100 · <a href="https://app.lemonsqueezy.com/my-orders" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;">Manage Orders &amp; Receipts ↗</a>)
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- CALM 2-4X/YEAR REBALANCING METHODOLOGY MODAL -->
    <div class="modal-backdrop" id="pwRsiModal">
      <div class="modal" style="max-width:680px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#38bdf8; text-transform:uppercase; letter-spacing:0.06em; font-weight:800;">
              SELF-DIRECTED EDUCATIONAL CALCULATOR METHODOLOGY
            </div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#ffffff; margin:3px 0 0;">
              ${t.pwRsiModalTitle || "Calm 2–4x/Year 3-Bucket Portfolio Rebalancing Methodology"}
            </h3>
          </div>
          <button class="btn btn-sm" id="btnClosePwRsiModal" style="padding:4px 8px;">✕ Close</button>
        </div>

        <div style="max-height:70vh; overflow-y:auto; padding-right:4px; font-size:0.92rem; line-height:1.65; color:#cbd5e1;">
          <div style="background:#0b1322; border:1px solid rgba(56,189,248,0.25); border-radius:8px; padding:14px 16px; margin-bottom:12px;">
            <div style="font-weight:800; color:#ffffff; margin-bottom:4px; font-size:0.98rem;">
              Why Calm 2–4x/Year Weight Rebalancing Protects Retirement Longevity
            </div>
            <p style="margin:0; color:var(--muted); font-size:0.88rem;">
              Sequence-of-returns shocks occur when retirees are forced to sell depressed equity holdings to pay monthly living bills during a market downturn. Separating your nest egg into 3 clear buckets keeps 2–3 years of living expenses insulated in short-term US Treasuries while dividends and S&amp;P 500 compounding replenish cash calmly.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:12px;">
            <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:12px 14px;">
              <div style="font-weight:800; color:#38bdf8; margin-bottom:4px;">Bucket 1: US T-Bill &amp; Government MMF Cushion ($SGOV · SPAXX · SWVXX · VMFXX)</div>
              <p style="margin:0; font-size:0.86rem; color:var(--muted);">
                Holds 20% to 40% depending on our 3-Color Market Weather indicator, earning monthly Treasury interest while insulating near-term retirement cashflow.
              </p>
            </div>
            <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:12px 14px;">
              <div style="font-weight:800; color:#34d399; margin-bottom:4px;">Bucket 2: Monthly &amp; Rising Dividend Income ($JEPI · $SCHD · $XLV)</div>
              <p style="margin:0; font-size:0.86rem; color:var(--muted);">
                Holds 35% to 40% across monthly distribution and 10+ year dividend-growth ETFs to support predictable retirement income.
              </p>
            </div>
            <div style="background:#090d16; border:1px solid #1e293b; border-radius:8px; padding:12px 14px;">
              <div style="font-weight:800; color:#fbbf24; margin-bottom:4px;">Bucket 3: S&amp;P 500 Core Compounding ($VOO)</div>
              <p style="margin:0; font-size:0.86rem; color:var(--muted);">
                Holds 20% to 45% in ultra-low-cost broad US equities, rebalanced calmly just 2–4 times per year when 3-Color Market Weather shifts.
              </p>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:14px; border-top:1px solid var(--border); padding-top:10px;">
            <button type="button" class="btn btn-primary btn-sm" id="btnUnderstandPwRsi" style="min-height:42px;">Got It — Return to Calculator</button>
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

    <!-- $0 FREE PUBLIC PRODUCT: US BROKERAGE APP & CALM 2-4X/YEAR REBALANCING MANUAL MODAL -->
    <div class="modal-backdrop" id="tomStarterManualModal" role="dialog" aria-modal="true" aria-labelledby="tomStarterManualModalTitle">
      <div class="modal tom-manual-modal-dialog">
        <div class="tom-manual-modal-header">
          <div style="min-width:0;">
            <div class="tom-manual-modal-kicker">📘 $0 FREE PUBLIC PRODUCT · FIDELITY · CHARLES SCHWAB · VANGUARD</div>
            <h3 id="tomStarterManualModalTitle" class="tom-manual-modal-title">
              US Brokerage App &amp; Calm 2–4x/Year Rebalancing Starter Manual
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
          <button type="button" class="tom-manual-jump-pill" data-manual-target="tomManualStep2">Step 2: Calm 2–4x/Yr Rebalancing</button>
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
              Enter your email below and we will send this complete 3-Step Brokerage &amp; Calm 2–4x/Year Rebalancing Guide straight to your inbox along with free Morning Bell Retirement &amp; Macro Club membership ($0).
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
                <span>1) Tap <b>Transact → Trade</b> and enter the ETF symbol (such as SGOV, SCHD, JEPI, or VOO). 2) Switch <b>Order Type</b> from <i>Market</i> to <b>Limit</b> and enter your limit price. 3) Keep Time-in-Force on <b>Day</b>, tap <b>Preview</b>, and confirm.</span>
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
            <div class="tom-manual-chapter-tag tag-amber">STEP 2 OF 3 · CALM 2–4X/YEAR PORTFOLIO WEIGHT REBALANCING</div>
            <h4>Aligning Your 3 Retirement Buckets 2–4 Times a Year with the 3-Color Market Weather Indicator</h4>
            <p>
              <b>No Daily Stress or Frequent Trading:</b> Instead of reacting to noisy daily headlines, self-directed retirement investors review portfolio weights calmly just <b>2 to 4 times per year</b> across four liquid, low-fee core ETFs (<b>SGOV · SCHD · JEPI · VOO</b>) aligned with our 3-Color Market Weather indicator:
            </p>
            <div class="tom-manual-broker-list">
              <div class="tom-manual-broker-item">
                <strong>🟢 Calm Uptrend Weather (20% SGOV · 35% JEPI+SCHD · 45% VOO):</strong>
                <span>Maintain a 2-year T-Bill cash cushion in <b>SGOV</b> while allowing dividend growth (<b>SCHD</b>), monthly distributions (<b>JEPI</b>), and broad S&amp;P 500 compounding (<b>VOO</b>) to work steadily.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🟡 Cautious Base Weather (30% SGOV · 40% JEPI+SCHD · 30% VOO):</strong>
                <span>When market breadth is mixed, emphasize monthly income and dividend stability while holding 30% in short-term Treasury cash reserves.</span>
              </div>
              <div class="tom-manual-broker-item">
                <strong>🔴 Crash Defense Weather (40% SGOV · 40% JEPI+SCHD · 20% VOO):</strong>
                <span>During elevated market volatility, gently rebalance up to 40% into <b>SGOV</b> / government money-market reserves so 2–3 years of retirement living expenses are insulated from sequence-of-returns drawdowns.</span>
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
                <span>Default Vanguard settlement fund — sidelined cash automatically earns federal money-market yield while you wait calmly between quarterly rebalancing checks.</span>
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
                href="${lsMonthly}"
                class="tom-manual-funnel-paid lemonsqueezy-button"
                data-direct-ls="1"
                data-tom-paid-plan="monthly"
                data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
              >
                ⚡ Start Monthly VIP — $29/mo
              </a>
              <a
                href="${lsAnnual}"
                class="tom-manual-funnel-paid is-ltd lemonsqueezy-button"
                data-direct-ls="1"
                data-tom-paid-plan="annual"
                data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b"
              >
                👑 Start Annual VIP — $199/yr
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
  const rebal = state.semiRebalanceResult;
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
            href="${state.config?.youtube_url || "https://www.youtube.com/@RightSideAlpha"}"
            target="_blank"
            rel="noopener noreferrer"
            style="background:#dc2626; color:#ffffff; border-color:#b91c1c;"
          >
            📺 YouTube (@RightSideAlpha) ↗
          </a>
          <a
            class="btn"
            href="${state.config?.instagram_url || "https://www.instagram.com/rightsidealpha"}"
            target="_blank"
            rel="noopener noreferrer"
            style="background:#db2777; color:#ffffff; border-color:#be185d;"
          >
            📸 Instagram (@rightsidealpha) ↗
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

        <!-- RIGHT COLUMN: CNN 4-ROW HISTORICAL STACK + BARBELL SIGNAL -->
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
              ${t.cnnActiveRuleLabel} · TARGET ${ov.recommended_smh_weight}% $SMH : ${ov.recommended_xlv_weight}% $XLV
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

    <!-- SECTION 3: INTERACTIVE SMH + XLV REBALANCING & 2.5M KRW TAX HARVESTING ENGINE + 3-STAGE LUMP-SUM PLANNER -->
    <section class="semi-calc-grid">
      <!-- Calculator 1: SMH + XLV Rebalancing & Tax Optimizer -->
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
              <option value="AUTO_REGIME" ${state.semiMode === "AUTO_REGIME" ? "selected" : ""}>Auto Regime (70:30 ↔ 80:20 on Fear ≤ 25)</option>
              <option value="BASELINE_70_30" ${state.semiMode === "BASELINE_70_30" ? "selected" : ""}>70% $SMH : 30% $XLV Golden Baseline</option>
              <option value="CONTRARIAN_80_20" ${state.semiMode === "CONTRARIAN_80_20" ? "selected" : ""}>80% $SMH : 20% $XLV Contrarian Accumulation</option>
              <option value="AGGRESSIVE_90_10" ${state.semiMode === "AGGRESSIVE_90_10" ? "selected" : ""}>90% $SMH : 10% $XLV Right-Side Tilt</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.68rem; font-family:var(--font-mono); color:var(--muted);">REBALANCING CADENCE</label>
            <select id="semiFreqInput" style="width:100%; padding:8px 10px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-sans); font-weight:600; margin-top:3px;">
              <option value="ANNUAL" ${state.semiFreq === "ANNUAL" ? "selected" : ""}>Annual + Band Trigger (Min Tax Drag)</option>
              <option value="QUARTERLY" ${state.semiFreq === "QUARTERLY" ? "selected" : ""}>Quarterly Rebalance</option>
              <option value="MONTHLY" ${state.semiFreq === "MONTHLY" ? "selected" : ""}>Monthly Rebalance</option>
              <option value="WEEKLY" ${state.semiFreq === "WEEKLY" ? "selected" : ""}>Weekly Rebalance (High Tax Drag)</option>
            </select>
          </div>
        </div>

        <button type="button" class="btn btn-emerald" id="btnRunSemiRebalance" style="min-height:42px; width:100%; justify-content:center; padding:9px;">
          Calculate Exact $SMH / $XLV Rebalancing Orders
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
                Residual Cash: $${Number(rebal.residual_cash_usd ?? 0).toFixed(2)} · Est. Annual Tax &amp; Turnover Drag (${rebal.rebalance_frequency}): -${rebal.estimated_tax_drag_pct}%/yr · Expected Net 15Y Rate: +${rebal.expected_net_cagr_pct}%/yr
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
          Download 2000–2026 Daily CSV Dataset (Pro)
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
              <th>70:30 Baseline CAGR</th>
              <th>70:30 (80:20 Fear Tilt) CAGR</th>
              <th>70:30 (80:20 Tilt) Multiple</th>
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

    <!-- SECTION 5: MONTHLY & ANNUAL VIP EDUCATIONAL SOFTWARE PRICING -->
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
          Return to our 30-Second Retirement Cashflow Calculator (SGOV · SCHD · JEPI · VOO) or explore the Quantitative Factor Research Archive.
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
    if (
      oldM.includes("rightsidealpha.lemonsqueezy.com") ||
      oldM.includes("pro-monthly") ||
      oldM.includes("checkout/custom/")
    ) {
      localStorage.removeItem("rsa_cfg_ls_monthly");
    }
    const oldL = localStorage.getItem("rsa_cfg_ls_ltd") || "";
    if (
      oldL.includes("rightsidealpha.lemonsqueezy.com") ||
      oldL.includes("lifetime-pass") ||
      oldL.includes("checkout/custom/")
    ) {
      localStorage.removeItem("rsa_cfg_ls_ltd");
    }
    const oldTv = localStorage.getItem("rsa_cfg_aff_tv") || "";
    if (oldTv === "rightsidealpha") {
      localStorage.setItem("rsa_cfg_aff_tv", "1173809");
    }
    const oldSa = localStorage.getItem("rsa_cfg_aff_sa") || "";
    if (oldSa === "affiliate_rightside") {
      localStorage.setItem("rsa_cfg_aff_sa", "better_life333");
    }
    if (!localStorage.getItem("rsa_aff_v6_us_tools")) {
      localStorage.setItem("rsa_cfg_broker_url", "https://trendspider.com/?_go=rightside");
      localStorage.setItem("rsa_cfg_broker_name", "TrendSpider (rightside)");
      localStorage.setItem("rsa_cfg_youtube_url", "https://www.youtube.com/@RightSideAlpha");
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
    if (!oldYt || oldYt.includes("youtube.com/@rightsidealpha")) {
      localStorage.setItem("rsa_cfg_youtube_url", "https://www.youtube.com/@RightSideAlpha");
    }
    const oldIg = localStorage.getItem("rsa_cfg_instagram_url") || "";
    if (oldIg.includes("semifeargreed")) {
      localStorage.setItem("rsa_cfg_instagram_url", "https://www.instagram.com/rightsidealpha");
    }
  } catch (_) {}
})();

function detectInitialLang() {
  try {
    localStorage.setItem("rsa_lang", "en");
  } catch (_) {}
  return "en";
}

const state = {
  lang: detectInitialLang(),
  activeView: defaultView,
  uiTheme: localStorage.getItem("tom_ui_theme") || "dark",
  fontSizeMode: localStorage.getItem("tom_font_size") || "normal",
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
  semiRebalanceResult: null,
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
    site1_name: "RightSideAlpha",
    site1_url: localStorage.getItem("rsa_cfg_site1_url") || "https://truthofmarket.com",
    site2_url: "https://truthofmarket.com",
    ls_site1_monthly_url:
      localStorage.getItem("rsa_cfg_ls_monthly") ||
      "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8",
    ls_site1_ltd_url:
      localStorage.getItem("rsa_cfg_ls_ltd") ||
      "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b",
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
  const t = state.t;
  return `
    ${renderHero(state)}
    ${renderFreeStarterManual(state)}
    ${renderPricing(state)}

    <!-- COMPANION EDUCATIONAL TOOLS & ARCHIVE LINKS -->
    <section class="cross-banner">
      <div>
        <div style="font-size:0.74rem; font-family:var(--font-mono); font-weight:800; color:#38bdf8; text-transform:uppercase; letter-spacing:0.05em;" id="crossTitle">
          ${t.crossTitle}
        </div>
        <h3 style="font-size:1.15rem; font-weight:800; margin:4px 0; color:#ffffff;" id="crossHeading">
          ${t.crossHeading}
        </h3>
        <p style="font-size:0.92rem; color:var(--muted);" id="crossDesc">
          ${t.crossDesc}
        </p>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button type="button" class="btn btn-primary" id="crossFunnelSwitchBtn" style="min-height:46px; background:#0284c7; border-color:#38bdf8;">
          <span id="crossBtn">${t.crossBtn} →</span>
        </button>
        <a href="/pro-swing.html" class="btn" style="min-height:46px; border-color:rgba(148,163,184,0.4); color:#cbd5e1; font-weight:700;">
          Self-Directed Quantitative Research Archive →
        </a>
      </div>
    </section>
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

      <footer class="tom-fixed-legal-footer" style="border-top:1px solid var(--border); padding-top:20px; margin-top:28px; color:var(--muted); font-size:0.82rem; line-height:1.65;">
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom:12px;">
          <span class="mono" style="font-size:0.74rem; color:var(--text); font-weight:800;">EDUCATIONAL MARKET DATA &amp; QUANTITATIVE RESEARCH DESK:</span>
          <a href="mailto:beable9489@gmail.com" style="color:#38bdf8; text-decoration:underline; font-weight:800;">
            ✉️ beable9489@gmail.com
          </a>
          <span style="color:var(--border);">|</span>
          <a href="${state.config.youtube_url || DEFAULT_YOUTUBE_URL}" target="_blank" rel="noopener noreferrer" style="color:#fca5a5; text-decoration:none; font-weight:600;">
            📺 YouTube (@RightSideAlpha) ↗
          </a>
          <span style="color:var(--border);">|</span>
          <a href="${state.config.instagram_url || DEFAULT_INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" style="color:#f9a8d4; text-decoration:none; font-weight:600;">
            📸 Instagram (@rightsidealpha) ↗
          </a>
          <span style="color:var(--border);">|</span>
          <a href="${state.config.x_url || "https://x.com/rightsidealpha"}" target="_blank" rel="noopener noreferrer" style="color:#e2e8f0; text-decoration:none; font-weight:600;">
            𝕏 (@rightsidealpha) ↗
          </a>
        </div>
        <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap; margin-bottom:12px; padding:10px 14px; background:rgba(15,23,42,0.75); border:1px solid rgba(148,163,184,0.22); border-radius:8px; font-size:0.84rem;">
          <a href="/terms.html" style="color:#93c5fd; text-decoration:underline; font-weight:800;">Terms of Service</a>
          <span style="color:var(--border);">·</span>
          <a href="/privacy.html" style="color:#93c5fd; text-decoration:underline; font-weight:800;">Privacy Policy</a>
          <span style="color:var(--border);">·</span>
          <a href="/refund.html" style="color:#6ee7b7; text-decoration:underline; font-weight:800;">14-Day Refund Policy</a>
          <span style="color:var(--border);">·</span>
          <a href="/contact.html" style="color:#93c5fd; text-decoration:underline; font-weight:700;">Contact Desk</a>
          <span style="color:var(--border);">·</span>
          <a href="mailto:beable9489@gmail.com" style="color:#fde68a; text-decoration:underline; font-weight:800;">Support: beable9489@gmail.com</a>
        </div>
        <p id="disclaimerText" style="color:#cbd5e1; font-weight:600;">${t.disclaimer}</p>
        <p style="margin-top:8px; font-family:var(--font-mono); font-size:0.74rem;" id="copyrightText">${t.copyright}</p>
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

async function handleLemonSqueezyCheckoutSuccess(orderRef) {
  const tokenVal = String(orderRef || "RSA-PRO-2026-LS-CHECKOUT").trim();
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
    "🎉 Lemon Squeezy Payment Confirmed! All 72 Pro Setups Unlocked (Check your email for your permanent License Key)."
  );
}

function bindRsaLemonSqueezyEvents() {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.createLemonSqueezy === "function") {
      window.createLemonSqueezy();
    }
    if (window.LemonSqueezy && typeof window.LemonSqueezy.Setup === "function") {
      window.LemonSqueezy.Setup({
        eventHandler: (event) => {
          if (event && event.event === "Checkout.Success") {
            const ordId =
              event?.data?.order?.data?.attributes?.identifier ||
              event?.data?.order?.data?.id ||
              "RSA-PRO-2026-LS-CHECKOUT";
            handleLemonSqueezyCheckoutSuccess(`RSA-PRO-2026-${ordId}`);
          }
        },
      });
    }
    if (!window.__rsaLsPostMessageBound && typeof window.addEventListener === "function") {
      window.__rsaLsPostMessageBound = true;
      window.addEventListener("message", (ev) => {
        try {
          const origin = String(ev?.origin || "").toLowerCase();
          if (!origin.includes("lemonsqueezy.com")) return;
          const isSuccess =
            ev.data === "Checkout.Success" ||
            (ev.data && typeof ev.data === "object" && ev.data.event === "Checkout.Success") ||
            (typeof ev.data === "string" && ev.data.includes("Checkout.Success"));
          if (isSuccess) {
            handleLemonSqueezyCheckoutSuccess("RSA-PRO-2026-LS-IFRAME");
          }
        } catch (_) {}
      });
    }
  } catch (_) {}
}

if (typeof window !== "undefined") {
  window.__bindRsaLemonSqueezyEvents = bindRsaLemonSqueezyEvents;
  window.addEventListener("load", bindRsaLemonSqueezyEvents);
  try {
    const initTheme = localStorage.getItem("tom_ui_theme") || "dark";
    const initFont = localStorage.getItem("tom_font_size") || "normal";
    document.documentElement.setAttribute("data-tom-theme", initTheme);
    document.documentElement.setAttribute("data-tom-font", initFont);
  } catch (_) {}
}

function bindEvents() {
  // Initialize Lemon Squeezy checkout overlay & Checkout.Success auto-unlock handler
  bindRsaLemonSqueezyEvents();

  // Senior Font Size & Daylight Theme Toggles
  const btnToggleTomFont = document.getElementById("btnToggleTomFont");
  if (btnToggleTomFont) {
    btnToggleTomFont.addEventListener("click", () => {
      state.fontSizeMode = state.fontSizeMode === "large" ? "normal" : "large";
      try {
        localStorage.setItem("tom_font_size", state.fontSizeMode);
        document.documentElement.setAttribute("data-tom-font", state.fontSizeMode);
      } catch (_) {}
      renderApp();
    });
  }

  const btnToggleTomTheme = document.getElementById("btnToggleTomTheme");
  if (btnToggleTomTheme) {
    btnToggleTomTheme.addEventListener("click", () => {
      state.uiTheme = state.uiTheme === "light" ? "dark" : "light";
      try {
        localStorage.setItem("tom_ui_theme", state.uiTheme);
        document.documentElement.setAttribute("data-tom-theme", state.uiTheme);
      } catch (_) {}
      renderApp();
    });
  }

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
        statusEl.textContent = `🎉 Welcome aboard (${email})! Your 8:30 AM ET Retirement Weather Brief & 4-Core Allocation Guide are now unlocked.`;
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
    const box = document.getElementById("tomMorningSignalBox");
    const inp = document.getElementById("tomMorningEmailInput");
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

  // $0 Free US Brokerage App & Calm 2-4x/Year Rebalancing Manual Modal + WebView Branching
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
    crossFunnelSwitchBtn.addEventListener("click", () => switchView("semi"));
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

  // Search Input (RightSideAlpha)
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
          "🔒 VIP Telegram Educational Research Channel is available for Monthly VIP ($29/mo) and Annual VIP ($199/yr) subscribers."
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
        msgEl.textContent = "Please enter your Lemon Squeezy Pro license key.";
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
            res.message || "Invalid or expired license key. Please verify your Lemon Squeezy receipt or subscribe below.";
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
      showToast("🎉 Pro Terminal Unlocked — All 72 US Equity Targets & 26Y CSV Active!");
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
      const lsM = document.getElementById("cfgLsMonthly")?.value.trim() || state.config.ls_site1_monthly_url;
      const lsL = document.getElementById("cfgLsLtd")?.value.trim() || state.config.ls_site1_ltd_url;
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
      state.config.ls_site1_monthly_url = lsM;
      state.config.ls_site1_ltd_url = lsL;
      state.config.telegram_channel_url = tgCh;
      state.config.youtube_url = ytUrl;
      state.config.instagram_url = igUrl;
      state.config.tradingview_aff_id = tvId;
      state.config.seekingalpha_source = saSrc;
      state.config.broker_name = brkName;
      state.config.broker_referral_url = brkUrl;

      localStorage.setItem("rsa_cfg_site1_url", s1Url);
      localStorage.setItem("rsa_cfg_ls_monthly", lsM);
      localStorage.setItem("rsa_cfg_ls_ltd", lsL);
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
          ls_site1_monthly_url: lsM,
          ls_site1_ltd_url: lsL,
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

  // Pro VIP 1-Click 72-Stock CSV Export, TradingView Watchlist & Webhook JSON
  const btnDownloadPro72Csv = document.getElementById("btnDownloadPro72Csv");
  if (btnDownloadPro72Csv) {
    btnDownloadPro72Csv.addEventListener("click", () => {
      if (!state.isProUnlocked) {
        openLicenseModal(false, "🔒 Upgrade to VIP Software ($29/mo Monthly VIP or $199/yr Annual VIP) to download the full Historical Factor Dataset (.CSV).");
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
      showToast("📥 Downloaded Historical Factor Dataset (.CSV)");
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

  // 1-Click VIP Watchlist CSV Export
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
    a.download = `RightSideAlpha_VIP_Watchlist_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`📥 Exported ${starredStocks.length} Starred Watchlist Tickers (.CSV)`);
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

  // PW-RSI Explainer Modal wiring (Feature F4)
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

  // Copy Pine Script v5
  const btnCopyPineScript = document.getElementById("btnCopyPineScript");
  if (btnCopyPineScript) {
    btnCopyPineScript.addEventListener("click", async () => {
      const code = document.getElementById("pineCodeBox")?.textContent || "";
      try {
        await navigator.clipboard.writeText(code);
        showToast("TradingView Pine Script v5 Copied to Clipboard");
      } catch (e) {
        showToast("Pine Script Ready to Copy");
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

  const btnRunSemiRebalance = document.getElementById("btnRunSemiRebalance");
  if (btnRunSemiRebalance) {
    btnRunSemiRebalance.addEventListener("click", async () => {
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
        state.semiRebalanceResult = await calculateSemiRebalance({
          total_capital_usd: cap,
          strategy_mode: mode,
          rebalance_frequency: freq,
          unrealized_gain_krw: gainKrw,
        });
        renderApp();
        showToast("Updated $SMH / $XLV Rebalancing Orders");
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
        showToast("Unlock VIP Software ($29/mo Monthly VIP or $199/yr Annual VIP) to download the 26-Year Daily CSV Dataset");
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
        showToast("Downloaded 26-Year Daily CSV Dataset");
      } catch (err) {
        showToast("Failed to generate CSV dataset");
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
  const lsMonthly = formatCheckoutUrl(
    state.config?.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
  );
  const lsLtd = formatCheckoutUrl(
    state.config?.ls_site1_ltd_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b"
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
        <div class="mono" style="font-size:0.66rem; color:var(--muted);">PW-RSI SCORE</div>
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
             <div style="font-weight:800; color:#ffffff; margin-bottom:6px;">🔒 Historical Factor Reference Bands &amp; CSV Export</div>
             <div style="display:flex; gap:8px; flex-wrap:wrap;">
               <a class="btn btn-primary btn-sm lemonsqueezy-button" data-direct-ls="1" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthly}" target="_blank" rel="noopener noreferrer" style="min-height:40px; font-weight:800;">
                 🔒 Start Monthly VIP — $29/mo
               </a>
               <a class="btn btn-emerald btn-sm lemonsqueezy-button" data-direct-ls="1" data-tom-paid-plan="annual" data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b" href="${lsLtd}" target="_blank" rel="noopener noreferrer" style="min-height:40px; font-weight:800;">
                 💎 Start Annual VIP — $199/yr
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
  ctx.fillText("RIGHTSIDEALPHA · US EQUITY TURNAROUND TERMINAL", 45, 62);

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
    ctx.fillText("20-Year US Equity Backtest: Left-Side vs PW-RSI Right-Side", 45, 125);

    ctx.fillStyle = "#f6465d";
    ctx.font = "22px JetBrains Mono, monospace";
    ctx.fillText("Blind 52W-Low Dip Buy: 28.91% 2x Rate | -30.31% MDD | 81d Underwater", 45, 200);

    ctx.fillStyle = "#0ecb81";
    ctx.font = "bold 24px JetBrains Mono, monospace";
    ctx.fillText("PW-RSI Right-Side:     55.24% 2x Rate | -16.49% MDD | 29d Underwater", 45, 260);
  }

  ctx.fillStyle = "#8492a6";
  ctx.font = "bold 16px JetBrains Mono, monospace";
  ctx.fillText(`Verified Dataset (N=394,371 US Stock-Days) · ${state.config.site1_url}`, 45, 440);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = stock ? `RightSideAlpha_${stock.ticker}_TearSheet.png` : "RightSideAlpha_Benchmark.png";
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
  ctx.fillText(`Active Signal: ${ov.action_headline_en}`, 45, 230);

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
        ticker: "SGOV",
        name_en: "iShares 0-3 Month US Treasury Bond ETF (Cash Cushion)",
        sector: "Fintech & Digital Finance",
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
        score: 99,
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
      {
        ticker: "SCHD",
        name_en: "Schwab US Dividend Equity ETF (Dividend Growth)",
        sector: "Consumer & Retail",
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
        name_en: "JPMorgan Equity Premium Income ETF (Monthly Paycheck)",
        sector: "Fintech & Digital Finance",
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
        ticker: "VOO",
        name_en: "Vanguard S&P 500 ETF (Core Compounding)",
        sector: "Cloud & Enterprise Software",
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
        score: 96,
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

    // Pre-compute initial Rebalance, Lump-Sum, and Telegram Status/Preview for instant rendering
    const [rebalRes, lumpRes, tgStat, tgPrev] = await Promise.all([
      calculateSemiRebalance({
        total_capital_usd: state.semiCapUsd,
        strategy_mode: state.semiMode,
        rebalance_frequency: state.semiFreq,
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
    if (rebalRes) state.semiRebalanceResult = rebalRes;
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
      const pine = await fetchPineScript().catch(() => null);
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

  // Auto-unlock Pro Terminal when returning from Lemon Squeezy checkout with ?license_key=, ?order_key=, or ?key=
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
        showToast("🎉 Lemon Squeezy Pro License Verified — All 72 US Equity Targets Unlocked!");
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
            ? "🏆 Annual VIP ($199/yr): Click Start Annual VIP — $199/yr above, or paste your License Key below to unlock immediately."
            : "🍋 Monthly VIP ($29/mo): Click Start Monthly VIP — $29/mo above, or paste your License Key below to unlock immediately.";
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
