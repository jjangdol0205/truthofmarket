/**
 * TruthOfMarket (Division 1) — Polar.sh Native PAYMENT_CONFIG, VIP Founding Member Waitlist Modal,
 * In-App WebView Safe Redirect & PDF Guide Guard & 70% Scroll + 15s Dwell `read_complete` Beacon.
 */
(function initTomUnifiedPaymentAndBeacon() {
  if (typeof window === "undefined") return;

  var DEFAULT_PAYMENT_CONFIG = {
    PROVIDER: "polar_sh",
    DIVISION: "TOM",
    STORE_SLOT: "FINANCE_STORE_SLOT",
    STORE_LIVE_READY: false,
    POLAR_CHECKOUT_URLS: {
      monthly_29: "",
      annual_199: "",
    },
    POLAR_TOM_MONTHLY_URL: "",
    POLAR_TOM_ANNUAL_URL: "",
    SUPPORT_EMAIL: "beable9489@gmail.com",
  };

  if (!window.PAYMENT_CONFIG || typeof window.PAYMENT_CONFIG !== "object") {
    window.PAYMENT_CONFIG = DEFAULT_PAYMENT_CONFIG;
  } else {
    window.PAYMENT_CONFIG.PROVIDER = "polar_sh";
    window.PAYMENT_CONFIG.DIVISION = window.PAYMENT_CONFIG.DIVISION || "TOM";
    window.PAYMENT_CONFIG.STORE_SLOT = window.PAYMENT_CONFIG.STORE_SLOT || "FINANCE_STORE_SLOT";
    if (typeof window.PAYMENT_CONFIG.STORE_LIVE_READY !== "boolean") {
      window.PAYMENT_CONFIG.STORE_LIVE_READY = false;
    }
    if (
      !window.PAYMENT_CONFIG.POLAR_CHECKOUT_URLS ||
      typeof window.PAYMENT_CONFIG.POLAR_CHECKOUT_URLS !== "object"
    ) {
      window.PAYMENT_CONFIG.POLAR_CHECKOUT_URLS = {
        monthly_29: "",
        annual_199: "",
      };
    } else {
      if (typeof window.PAYMENT_CONFIG.POLAR_CHECKOUT_URLS.monthly_29 !== "string") {
        window.PAYMENT_CONFIG.POLAR_CHECKOUT_URLS.monthly_29 = "";
      }
      if (typeof window.PAYMENT_CONFIG.POLAR_CHECKOUT_URLS.annual_199 !== "string") {
        window.PAYMENT_CONFIG.POLAR_CHECKOUT_URLS.annual_199 = "";
      }
    }
    if (typeof window.PAYMENT_CONFIG.POLAR_TOM_MONTHLY_URL !== "string") {
      window.PAYMENT_CONFIG.POLAR_TOM_MONTHLY_URL = "";
    }
    if (typeof window.PAYMENT_CONFIG.POLAR_TOM_ANNUAL_URL !== "string") {
      window.PAYMENT_CONFIG.POLAR_TOM_ANNUAL_URL = "";
    }
    if (!window.PAYMENT_CONFIG.SUPPORT_EMAIL) {
      window.PAYMENT_CONFIG.SUPPORT_EMAIL = "beable9489@gmail.com";
    }
  }

  function getKstDateString() {
    try {
      return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
    } catch (_) {
      return "2026-11-17";
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

  function resolvePolarCheckoutUrl(planKey) {
    var pCfg = window.PAYMENT_CONFIG || {};
    var urls = pCfg.POLAR_CHECKOUT_URLS || {};
    var raw =
      planKey === "annual"
        ? String(urls.annual_199 || pCfg.POLAR_TOM_ANNUAL_URL || "").trim()
        : String(urls.monthly_29 || pCfg.POLAR_TOM_MONTHLY_URL || "").trim();
    if (raw && /^https:\/\/(buy\.)?polar\.sh\//i.test(raw)) {
      return raw;
    }
    return "";
  }

  function appendPolarCustomerEmail(checkoutUrl, emailOverride) {
    var url = String(checkoutUrl || "").trim();
    if (!url) return "";
    var memberEmail = String(emailOverride || getKnownTomMemberEmail() || "").trim().toLowerCase();
    if (memberEmail && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(memberEmail) && url.indexOf("customer_email=") === -1) {
      return url + (url.indexOf("?") !== -1 ? "&" : "?") + "customer_email=" + encodeURIComponent(memberEmail);
    }
    return url;
  }

  window.resolveTomPolarCheckoutUrl = resolvePolarCheckoutUrl;
  window.appendTomPolarCustomerEmail = appendPolarCustomerEmail;

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
        "#tomVipWaitlistModal{position:fixed;inset:0;z-index:10060;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,0.72);backdrop-filter:blur(6px);}",
        "#tomVipWaitlistDialog{width:100%;max-width:600px;background:#ffffff;border:2px solid #059669;border-radius:16px;padding:24px 22px;color:#0f172a;box-shadow:0 24px 56px rgba(15,23,42,0.32);font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;max-height:92vh;overflow-y:auto;}",
        "html[data-tom-theme='dark'] #tomVipWaitlistDialog{background:linear-gradient(155deg,#0f172a 0%,#071929 100%);border-color:#10b981;color:#f8fafc;box-shadow:0 24px 56px rgba(0,0,0,0.65);}",
        ".tom-wl-plan-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0;}",
        ".tom-wl-plan-btn{padding:12px 12px;border-radius:12px;border:2px solid #cbd5e1;background:#f8fafc;color:#0f172a;text-align:left;cursor:pointer;transition:all 0.15s ease;font-family:inherit;}",
        "html[data-tom-theme='dark'] .tom-wl-plan-btn{border-color:#334155;background:rgba(15,23,42,0.85);color:#cbd5e1;}",
        ".tom-wl-plan-btn.is-selected{border-color:#059669;background:#ecfdf5;color:#064e3b;box-shadow:0 0 0 2px rgba(5,150,105,0.2);}",
        "html[data-tom-theme='dark'] .tom-wl-plan-btn.is-selected{border-color:#10b981;background:rgba(16,185,129,0.16);color:#ffffff;}",
        ".tom-wl-benefits-box{margin:10px 0 14px;padding:12px 14px;border-radius:12px;background:#f8fafc;border:1px solid #cbd5e1;font-size:15px;line-height:1.55;color:#1e293b;}",
        "html[data-tom-theme='dark'] .tom-wl-benefits-box{background:rgba(15,23,42,0.75);border-color:#334155;color:#e2e8f0;}",
        "@media(max-width:540px){.tom-wl-plan-grid{grid-template-columns:1fr;}#tomVipWaitlistDialog{padding:18px 15px;}}",
      ].join("");
      document.head.appendChild(styleEl);
    }

    var savedEmail = getKnownTomMemberEmail();

    var backdrop = document.createElement("div");
    backdrop.id = "tomVipWaitlistModal";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", "tomVipWaitlistTitle");
    backdrop.innerHTML =
      '<div id="tomVipWaitlistDialog">' +
      '  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;">' +
      '    <span style="display:inline-flex;align-items:center;gap:6px;background:#ecfdf5;border:1px solid #059669;color:#065f46;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:800;letter-spacing:0.02em;">' +
      "      FOUNDING MEMBER PRIORITY ACCESS &bull; 20% EARLY-BIRD LOCK" +
      "    </span>" +
      '    <button type="button" id="btnCloseTomVipWaitlist" aria-label="Close modal" style="min-height:42px;padding:6px 12px;border-radius:8px;border:1px solid #94a3b8;background:#f1f5f9;color:#0f172a;font-weight:800;font-size:15px;cursor:pointer;">✕ Close</button>' +
      "  </div>" +
      '  <h3 id="tomVipWaitlistTitle" style="margin:0 0 8px;font-size:clamp(1.2rem,2.4vw,1.45rem);line-height:1.32;font-weight:900;">' +
      "    VIP Founding Member Launch Alert &amp; 20% Early-Bird Discount Reservation (1-Second Email Reserve)" +
      "  </h3>" +
      '  <p style="margin:0;font-size:16.5px;line-height:1.6;">' +
      "    Our Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay) self-directed educational calculator software checkout is completing final gateway activation. Reserve your spot in <b>1 second ($0 charged today)</b> to lock in a <b>20% Founding Member Discount</b>—plus instant free Morning Bell Club access." +
      "  </p>" +
      '  <div class="tom-wl-benefits-box">' +
      '    <div style="font-weight:800;color:#047857;margin-bottom:6px;">📦 3 Retiree VIP Software Tools Included ($29/mo or $199/yr):</div>' +
      '    <div style="margin-bottom:4px;">&bull; <b>Custom Nest-Egg Dollar ($) Budget Worksheet:</b> Exact dollar amounts across <b>$SGOV, $SCHD, $JEPI &amp; $VOO</b> for your exact portfolio size (e.g., $500,000).</div>' +
      '    <div style="margin-bottom:4px;">&bull; <b>12-Month Dividend Paycheck Calendar &amp; Tax-Bucket Placement Reference:</b> Educational tax-location guide across <b>Traditional IRA, Roth IRA &amp; Taxable</b> accounts.</div>' +
      '    <div>&bull; <b>Large-Print 1-Page Weather Change Action Sheet (2–4x/Year):</b> Includes Lifetime-Updated 401(k)/IRA Drawdown Defense PDF Guide + 3-Bucket Retirement Budget Calculator.</div>' +
      "  </div>" +
      '  <div class="tom-wl-plan-grid" role="radiogroup" aria-label="Select VIP Plan to Reserve">' +
      '    <button type="button" class="tom-wl-plan-btn is-selected" data-wl-plan="Monthly VIP ($29/mo)">' +
      '      <div style="font-size:12.5px;font-weight:800;color:#047857;">MONTHLY VIP SOFTWARE</div>' +
      '      <div style="font-size:17px;font-weight:900;margin:3px 0;">Monthly VIP ($29/mo)</div>' +
      '      <div style="font-size:13px;color:#b45309;font-weight:800;">20% Early-Bird: $23.20/mo</div>' +
      '      <div style="font-size:12px;margin-top:4px;line-height:1.35;">All 3 Retiree Worksheets + Drawdown Defense PDF Guide</div>' +
      "    </button>" +
      '    <button type="button" class="tom-wl-plan-btn" data-wl-plan="Annual VIP ($199/yr)">' +
      '      <div style="font-size:12.5px;font-weight:800;color:#b45309;">ANNUAL VIP SOFTWARE (SAVE 43%)</div>' +
      '      <div style="font-size:17px;font-weight:900;margin:3px 0;">Annual VIP ($199/yr)</div>' +
      '      <div style="font-size:13px;color:#047857;font-weight:800;">20% Early-Bird: $159.20/yr</div>' +
      '      <div style="font-size:12px;margin-top:4px;line-height:1.35;">Full 12-Month Pass + Lifetime-Updated PDF Guide Bundle</div>' +
      "    </button>" +
      "  </div>" +
      '  <form id="tomVipWaitlistForm" novalidate style="display:flex;flex-direction:column;gap:10px;">' +
      '    <input type="hidden" id="tomVipWaitlistSelectedPlan" value="Monthly VIP ($29/mo)" />' +
      '    <label for="tomVipWaitlistEmail" style="font-size:15px;font-weight:800;">Your Best Email Address (Zero Spam &bull; No Card Needed Today):</label>' +
      '    <input type="email" id="tomVipWaitlistEmail" required autocomplete="email" placeholder="Enter your email (e.g., robert@email.com)" value="' +
      String(savedEmail).replace(/"/g, "") +
      '" style="width:100%;min-height:56px;padding:12px 16px;border-radius:10px;border:2px solid #64748b;background:#ffffff;color:#0f172a;font-size:18px;font-weight:700;box-sizing:border-box;" />' +
      '    <button type="submit" id="btnSubmitTomVipWaitlist" style="width:100%;min-height:58px;padding:13px 18px;border-radius:11px;border:none;background:linear-gradient(135deg,#059669 0%,#047857 100%);color:#ffffff;font-size:18px;font-weight:900;cursor:pointer;box-shadow:0 8px 22px rgba(5,150,105,0.28);">' +
      "      Reserve My 20% VIP Discount &amp; Launch Alert (1-Sec) &rarr;" +
      "    </button>" +
      "  </form>" +
      '  <div id="tomVipWaitlistConfirm" role="status" aria-live="polite" style="display:none;margin-top:12px;padding:14px 16px;border-radius:10px;background:#ecfdf5;border:1.5px solid #059669;color:#064e3b;font-size:16px;line-height:1.55;font-weight:700;"></div>' +
      '  <div style="margin-top:12px;padding-top:10px;border-top:1px solid #cbd5e1;font-size:13.5px;color:#475569;line-height:1.5;">' +
      '    Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay) &bull; 14-Day No-Questions-Asked Refund Policy once live &bull; Self-Directed Educational Calculator Software &bull; Support: <a href="mailto:beable9489@gmail.com" style="color:#1d4ed8;font-weight:700;text-decoration:underline;">beable9489@gmail.com</a>' +
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
            confirmEl.style.borderColor = "#dc2626";
            confirmEl.style.background = "#fef2f2";
            confirmEl.style.color = "#991b1b";
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
          var kst = getKstDateString();
          fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/vip_waitlist_" + kst, {
            mode: "cors",
            keepalive: true,
          }).catch(function () {});
          fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/vip_waitlist_total", {
            mode: "cors",
            keepalive: true,
          }).catch(function () {});
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
          notes: "site=truthofmarket.com | provider=polar_sh | plan=" + selectedPlan,
        }).finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Reserve My 20% VIP Discount &amp; Launch Alert (1-Sec) &rarr;";
          }
        });

        if (confirmEl) {
          confirmEl.style.display = "block";
          confirmEl.style.borderColor = "#059669";
          confirmEl.style.background = "#ecfdf5";
          confirmEl.style.color = "#064e3b";
          confirmEl.innerHTML =
            "✅ <strong>20% Early-Bird Founding Reservation Confirmed!</strong><br/>Reserved Plan: <b>" +
            selectedPlan.replace(/[<>&"]/g, "") +
            "</b> for <b>" +
            email.replace(/[<>&"]/g, "") +
            "</b>. We will email your private 20% discount Polar.sh checkout link the moment live billing opens—and your complimentary Morning Bell Retirement &amp; Macro Brief is now active.";
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
    var emailEl = document.getElementById("tomVipWaitlistEmail");
    if (emailEl && !emailEl.value) {
      var latestEmail = getKnownTomMemberEmail();
      if (latestEmail) emailEl.value = latestEmail;
    }
    var confirmEl = document.getElementById("tomVipWaitlistConfirm");
    if (confirmEl) confirmEl.style.display = "none";
    modal.style.display = "flex";
    setTimeout(function () {
      if (emailEl && !emailEl.value) emailEl.focus();
    }, 60);
  };

  if (window.__TOM_PAYMENT_SYSTEM_READY__) return;
  window.__TOM_PAYMENT_SYSTEM_READY__ = true;

  // 1. Unified Capture-Phase Paid Checkout Click Guard (Strictly 1 Abacus Fire Per Click)
  window.addEventListener(
    "click",
    function (e) {
      var el =
        e.target && e.target.closest
          ? e.target.closest(".polar-checkout-button, [data-polar-checkout], [data-tom-paid-plan]") ||
            e.target.closest("a, button, [role='button']")
          : null;
      if (!el) return;

      var href = String(el.getAttribute("href") || "");
      var planAttr = String(el.getAttribute("data-tom-paid-plan") || "").toLowerCase();
      var polarPlanAttr = String(el.getAttribute("data-polar-plan") || "").toLowerCase();
      var cls = String(el.className || "");

      var isPortalManageLink = href.indexOf("polar.sh/purchases") !== -1;
      var isPaidCta =
        !isPortalManageLink &&
        (cls.indexOf("polar-checkout-button") !== -1 ||
          el.hasAttribute("data-polar-checkout") ||
          Boolean(planAttr) ||
          Boolean(polarPlanAttr) ||
          href.indexOf("buy.polar.sh") !== -1 ||
          href.indexOf("polar.sh/checkout") !== -1 ||
          href.indexOf("#tom-vip-") === 0);

      if (!isPaidCta) return;

      var txt = String(el.innerText || el.textContent || "").toLowerCase();
      var isAnnual =
        planAttr === "annual" ||
        polarPlanAttr === "annual_199" ||
        href.indexOf("annual") !== -1 ||
        txt.indexOf("199") !== -1 ||
        txt.indexOf("annual") !== -1;
      var planKey = isAnnual ? "annual" : "monthly";

      // Fire Abacus paid_click_<YYYY-MM-DD> & paid_click_total strictly once per click
      if (!e.__tomPaidClickTracked) {
        e.__tomPaidClickTracked = true;
        try {
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

      var pCfg = window.PAYMENT_CONFIG || {};
      var resolvedPolarUrl = resolvePolarCheckoutUrl(planKey);

      if (pCfg.STORE_LIVE_READY !== true || !resolvedPolarUrl) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") {
          e.stopImmediatePropagation();
        }
        window.openTomVipWaitlistModal(planKey);
        return;
      }

      // Live Polar.sh Checkout Active Path (STORE_LIVE_READY === true AND valid Polar URL configured)
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") {
        e.stopImmediatePropagation();
      }

      var checkoutUrl = appendPolarCustomerEmail(resolvedPolarUrl);
      if (window.isTomInAppWebView()) {
        window.location.href = checkoutUrl;
        return;
      }
      if (window.PolarEmbedCheckout && typeof window.PolarEmbedCheckout.create === "function") {
        var curTheme = document.documentElement.getAttribute("data-tom-theme") === "dark" ? "dark" : "light";
        window.PolarEmbedCheckout.create(checkoutUrl, curTheme).catch(function () {
          window.location.href = checkoutUrl;
        });
      } else {
        window.location.href = checkoutUrl;
      }
    },
    true
  );

  // 2. Escape key closes VIP Waitlist Modal + Polar.sh Checkout Success Unlock
  window.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") {
      var wl = document.getElementById("tomVipWaitlistModal");
      if (wl && wl.style.display === "flex") {
        wl.style.display = "none";
      }
    }
  });

  function applyPolarCheckoutUnlock(orderRef) {
    var cleanRef = String(orderRef || "RSA-PRO-2026-POLAR-VIP").trim();
    try {
      localStorage.setItem("rsa_pro_unlocked", "true");
      localStorage.setItem("rsa_token", cleanRef);
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
  }

  function setupPolarCheckoutSuccess() {
    try {
      var searchStr = (window.location && window.location.search) || "";
      if (
        searchStr.indexOf("payment=success") !== -1 ||
        searchStr.indexOf("polar_checkout_success") !== -1
      ) {
        var sp = new URLSearchParams(searchStr);
        var cid = sp.get("checkout_id") || sp.get("customer_session_token") || "POLAR-VIP";
        applyPolarCheckoutUnlock("RSA-PRO-2026-" + cid);
      }
      if (!window.__tomPolarPostMessageBound) {
        window.__tomPolarPostMessageBound = true;
        window.addEventListener("message", function (ev) {
          try {
            var origin = String((ev && ev.origin) || "").toLowerCase();
            if (origin.indexOf("polar.sh") === -1) return;
            var d = ev.data;
            var isSuccess =
              d === "polar_checkout_success" ||
              (d &&
                typeof d === "object" &&
                (d.event === "success" ||
                  d.event === "polar_checkout_success" ||
                  d.type === "polar_checkout_success" ||
                  d.status === "succeeded"));
            if (isSuccess) {
              applyPolarCheckoutUnlock("RSA-PRO-2026-POLAR-EMBED");
            }
          } catch (_) {}
        });
      }
    } catch (_) {}
  }
  setupPolarCheckoutSuccess();
  window.addEventListener("load", setupPolarCheckoutSuccess);

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
