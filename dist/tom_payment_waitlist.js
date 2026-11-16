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
      '      <div style="font-size:11.5px;color:#cbd5e1;margin-top:4px;line-height:1.35;">Includes Lifetime-Updated 401(k)/IRA Drawdown Defense PDF Guide + 3-Bucket Rebalancing Calculator</div>' +
      "    </button>" +
      '    <button type="button" class="tom-wl-plan-btn" data-wl-plan="Annual VIP ($199/yr)">' +
      '      <div style="font-size:12.5px;font-weight:800;color:#fde68a;">ANNUAL VIP SOFTWARE (SAVE 43%)</div>' +
      '      <div style="font-size:17px;font-weight:900;color:#ffffff;margin:3px 0;">Annual VIP ($199/yr)</div>' +
      '      <div style="font-size:13px;color:#6ee7b7;font-weight:700;">20% Early-Bird: $159.20/yr</div>' +
      '      <div style="font-size:11.5px;color:#cbd5e1;margin-top:4px;line-height:1.35;">Includes Lifetime-Updated 401(k)/IRA Drawdown Defense PDF Guide + 3-Bucket Rebalancing Calculator</div>' +
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
      var el =
        e.target && e.target.closest
          ? e.target.closest(".lemonsqueezy-button") || e.target.closest("a, button, [role='button']")
          : null;
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
