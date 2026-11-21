window.__DEFAULT_VIEW__ = 'rightside';
  window.PAYMENT_CONFIG = {
    PROVIDER: 'whop',
    DIVISION: 'TOM',
    STORE_SLOT: 'FINANCE_STORE_SLOT',
    STORE_LIVE_READY: true,
    COMPANY_ID: 'biz_4ynqri19wFDIwm',
    STORE_NAME: 'TruthOfMarket Research',
    WHOP_PLAN_IDS: {
      monthly: 'plan_xVJeNwyrDef8T',
      annual: 'plan_9sdgFI753ucXQ'
    },
    WHOP_CHECKOUT_CONFIG_IDS: {
      monthly: 'ch_uFPUZl9jaGdNTvH',
      annual: 'ch_G3EyPgGXTTahfv7'
    },
    WHOP_CHECKOUT_URLS: {
      monthly: 'https://whop.com/checkout/plan_xVJeNwyrDef8T',
      annual: 'https://whop.com/checkout/plan_9sdgFI753ucXQ'
    },
    WHOP_REDIRECT_URLS: {
      monthly: 'https://truthofmarket.com/?payment=success&provider=whop&plan=monthly',
      annual: 'https://truthofmarket.com/?payment=success&provider=whop&plan=annual'
    },
    WHOP_TOM_MONTHLY_URL: 'https://whop.com/checkout/plan_xVJeNwyrDef8T',
    WHOP_TOM_ANNUAL_URL: 'https://whop.com/checkout/plan_9sdgFI753ucXQ',
    SUPPORT_EMAIL: 'hello@truthofmarket.com'
  };
  var COPY_MODE = 'LIVE_SHARP';
  window.TOM_COPY_MODE = COPY_MODE;
  try {
    var _th = localStorage.getItem('tom_ui_theme_v2') === 'dark' ? 'dark' : 'light';
    var _px = Number(localStorage.getItem('tom_font_px')) || 18;
    if ([18, 20, 22].indexOf(_px) === -1) _px = 18;
    document.documentElement.setAttribute('data-tom-theme', _th);
    document.documentElement.setAttribute('data-tom-font', String(_px));
  } catch (_e) {}
