(function () {
  'use strict';

  function buildCleanShareUrl(rawUrl, extraParams) {
    var base = String(rawUrl || (window.location.origin + window.location.pathname));
    var u = new URL(base);
    ['internal_check', 'owner_device', 'internal_test', 'smoke_test', 'nocache'].forEach(function (k) {
      u.searchParams.delete(k);
    });
    if (extraParams && typeof extraParams === 'object') {
      Object.keys(extraParams).forEach(function (k) {
        if (extraParams[k] !== undefined && extraParams[k] !== null && extraParams[k] !== '') {
          u.searchParams.set(k, String(extraParams[k]));
        }
      });
    }
    var vid = '';
    try {
      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.getOrCreateVisitorProfile === 'function') {
        vid = window.DreamCompanyCRM.getOrCreateVisitorProfile().visitor_id || '';
      } else {
        vid = localStorage.getItem('dc_visitor_id') || '';
        if (!vid) {
          vid = 'v_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
          localStorage.setItem('dc_visitor_id', vid);
        }
      }
    } catch (_) {}
    if (vid) u.searchParams.set('ref', vid);
    if (!u.searchParams.get('utm_source')) u.searchParams.set('utm_source', 'referral');
    if (!u.searchParams.get('utm_medium')) u.searchParams.set('utm_medium', 'share');
    return u.toString();
  }
  window.__dcBuildCleanShareUrl = buildCleanShareUrl;

  function triggerOneTouchShare(div, title, text, shareUrl, toastEl, copiedMsg) {
    var cleanUrl = buildCleanShareUrl(shareUrl);
    if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.trackFunnelEvent === 'function') {
      window.DreamCompanyCRM.trackFunnelEvent(div, 'share_click', { event_meta: 'seasonal_share_card' });
    }
    function showToast(msg) {
      if (!toastEl) return;
      toastEl.textContent = msg;
      toastEl.style.display = 'block';
    }
    if (navigator.share) {
      navigator.share({ title: title, text: text, url: cleanUrl }).then(function () {
        showToast(copiedMsg);
      }).catch(function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(cleanUrl).then(function () { showToast(copiedMsg); }).catch(function () { showToast(cleanUrl); });
        } else {
          showToast(cleanUrl);
        }
      });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cleanUrl).then(function () { showToast(copiedMsg); }).catch(function () { showToast(cleanUrl); });
    } else {
      showToast(cleanUrl);
    }
    return cleanUrl;
  }

  // IRS Publication 590-B Official Uniform Lifetime Table III (effective 2022+)
  var IRS_TABLE_III = {
    72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
    80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4,
    88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9
  };

  function fmtUsd(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function calc() {
    var age = Math.max(72, Math.min(95, parseInt(document.getElementById('rmdAge').value, 10) || 73));
    var bal = Math.max(0, parseFloat(document.getElementById('rmdBalance').value) || 0);
    var spend = Math.max(0, parseFloat(document.getElementById('rmdMonthlySpend').value) || 0);
    var cash = Math.max(0, parseFloat(document.getElementById('rmdCurrentCash').value) || 0);
    var yld = Math.max(0, Math.min(10, parseFloat(document.getElementById('rmdSgovYield').value) || 4.2));

    var div = IRS_TABLE_III[age] || 26.5;
    var rmdAnnual = bal / div;
    var rmdMonthly = rmdAnnual / 12;
    var rmdPct = bal > 0 ? (100 / div) : 0;
    var target24 = spend * 24;
    var gap = target24 - cash;
    var annualCashInterest = cash * (yld / 100);
    var coverageMonths = spend > 0 ? (cash / spend) : 0;

    document.getElementById('outDivisor').textContent = div.toFixed(1) + ' (' + rmdPct.toFixed(2) + '%)';
    document.getElementById('outRmdAnnual').textContent = fmtUsd(rmdAnnual);
    document.getElementById('outRmdMonthly').textContent = fmtUsd(rmdMonthly) + ' / mo';
    document.getElementById('outTarget24').textContent = fmtUsd(target24);
    document.getElementById('outBufferStatus').textContent = gap <= 0
      ? ('Covered +' + fmtUsd(-gap) + ' surplus (' + coverageMonths.toFixed(1) + ' mos)')
      : ('Shortfall ' + fmtUsd(gap) + ' (' + coverageMonths.toFixed(1) + ' mos funded)');
    document.getElementById('outSgovInterest').textContent = fmtUsd(annualCashInterest) + ' / yr';
  }

  document.addEventListener('DOMContentLoaded', function () {
    ['rmdAge', 'rmdBalance', 'rmdMonthlySpend', 'rmdCurrentCash', 'rmdSgovYield'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', calc);
    });
    var btn = document.getElementById('btnTomSeasonalShare');
    if (btn) {
      btn.addEventListener('click', function () {
        var rmdTxt = (document.getElementById('outRmdAnnual') || {}).textContent || '';
        triggerOneTouchShare(
          'TOM',
          '2026 Year-End RMD & SGOV Cash Buffer Simulator | Truth of Market',
          '2026 IRS Pub 590-B RMD check (' + rmdTxt + ') + 24-month Treasury liquidity buffer:',
          'https://truthofmarket.com/tools/rmd-sgov-buffer',
          document.getElementById('tomSeasonalShareToast'),
          'Clean referral link copied! Share with your spouse or family.'
        );
      });
    }
    calc();
  });
})();
