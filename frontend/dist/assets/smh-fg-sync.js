/* Live SMH Fear & Greed Sync Helper v2 (Strict CSP, Same-Origin JSON, Overwrite-Proof) */
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof document === 'undefined' || typeof fetch !== 'function') return;
  var canonicalTom = '';
  var canonicalGba = '';

  function enforceText() {
    var tomEl = document.getElementById('tomLiveTempText');
    if (tomEl && canonicalTom && tomEl.textContent !== canonicalTom) {
      tomEl.textContent = canonicalTom;
    }
    var gbaEl = document.getElementById('gbaLiveTempTextJp');
    if (gbaEl && canonicalGba && gbaEl.textContent !== canonicalGba) {
      gbaEl.textContent = canonicalGba;
    }
  }

  function hydrateMiniGauge(d) {
    var scNum = Math.max(0, Math.min(100, Number(d.score)));
    var sc = scNum.toFixed(1);
    var lbl = String(d.label_en || 'Extreme Fear');
    var dt = String(d.as_of_date || '');
    var smhP = d.prices && typeof d.prices.SMH === 'number' ? '$' + d.prices.SMH.toFixed(2) : '';
    var xlvP = d.prices && typeof d.prices.XLV === 'number' ? '$' + d.prices.XLV.toFixed(2) : '';

    var elScore = document.getElementById('tomMiniFgScore');
    var elLabel = document.getElementById('tomMiniFgLabel');
    var elDate = document.getElementById('tomMiniFgDate');
    var elPrice = document.getElementById('tomMiniFgPrice');
    var elMarker = document.getElementById('tomMiniFgMarker');
    if (elScore) elScore.textContent = sc + ' / 100';
    if (elLabel) elLabel.textContent = lbl;
    if (elDate && dt) elDate.textContent = 'US Close ' + dt;
    if (elPrice && smhP && xlvP) elPrice.textContent = 'SMH ' + smhP + ' \u00b7 XLV ' + xlvP;
    if (elMarker) elMarker.style.left = scNum.toFixed(1) + '%';
  }

  function hydrate() {
    var tomEl = document.getElementById('tomLiveTempText');
    var gbaEl = document.getElementById('gbaLiveTempTextJp');
    var miniEl = document.getElementById('tomMiniFgGaugeCard');
    if (!tomEl && !gbaEl && !miniEl) return;
    fetch('/data/smh_fg_latest.json?v=' + Math.floor(Date.now() / 300000), { cache: 'no-cache' })
      .then(function (r) { return r && r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || typeof d.score !== 'number' || !d.as_of_date) return;
        var sc = Number(d.score).toFixed(1);
        canonicalTom = 'Data As Of: ' + d.as_of_date + ' \u00b7 SMH Fear & Greed: ' + sc + ' / 100 (' + String(d.label_en || 'Extreme Fear') + ') \u2192';
        canonicalGba = '\u6700\u65b0\u30c7\u30fc\u30bf\u57fa\u6e96\u65e5\uff1a' + d.as_of_date + ' \u30fb SMH\u6050\u6016\u3068\u5f37\u6b32\u6307\u6570\uff1a' + sc + ' / 100\uff08' + String(d.label_ja || '\u6975\u5ea6\u306e\u6050\u6016') + '\u570f\uff09 \u2192';
        enforceText();
        hydrateMiniGauge(d);
        [tomEl, gbaEl].forEach(function (el) {
          if (!el || el._smhFgObs) return;
          el._smhFgObs = true;
          var mo = new MutationObserver(enforceText);
          mo.observe(el, { childList: true, characterData: true, subtree: true });
        });
        setTimeout(enforceText, 450);
        setTimeout(enforceText, 1200);
      })
      .catch(function () {});
  }

  function bindTomInlineStepAndStartParam() {
    var inlineBtns = document.querySelectorAll('[data-tom-inline-obj]');
    if (inlineBtns && inlineBtns.length) {
      inlineBtns.forEach(function (btn) {
        if (btn.__dcInlineBound) return;
        btn.__dcInlineBound = true;
        btn.addEventListener('click', function () {
          var objVal = btn.getAttribute('data-tom-inline-obj') || 'balanced';
          setTimeout(function () {
            var realOpt = document.querySelector('#pwScreen1 [data-pw-field="objective"][data-pw-val="' + objVal + '"]');
            if (realOpt && typeof realOpt.click === 'function') {
              realOpt.click();
            }
          }, 40);
        });
      });
    }
    try {
      var sp = new URLSearchParams((window.location && window.location.search) || '');
      if (sp.get('start') === '1' && document.getElementById('btnStartPwStepUp')) {
        var qScale = sp.get('scale');
        setTimeout(function () {
          var startBtn = document.getElementById('btnStartPwStepUp');
          var s0 = document.getElementById('pwScreen0');
          if (startBtn && s0 && s0.style.display !== 'none') {
            startBtn.click();
            if (qScale) {
              var scBtn = document.querySelector('#pwScreen1 [data-pw-field="scale"][data-pw-val="' + qScale + '"]');
              if (scBtn) scBtn.classList.add('is-selected');
            }
          }
        }, 280);
      }
    } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { hydrate(); bindTomInlineStepAndStartParam(); });
  } else {
    hydrate(); bindTomInlineStepAndStartParam();
  }
  window.addEventListener('load', enforceText);
})();
