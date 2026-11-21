(function(){
    try {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      var ns = 'tom_truthofmarket';
      window.__tomCopyEssayLink = function(btnEl) {
        var url = (window.location && window.location.href) ? window.location.href : 'https://truthofmarket.com/insights/smh-xlv-80-20-barbell-drawdown-study.html';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function() {
            if (btnEl) {
              var orig = btnEl.getAttribute('data-orig') || btnEl.textContent;
              btnEl.setAttribute('data-orig', orig);
              btnEl.textContent = 'Copied Link';
              setTimeout(function() { btnEl.textContent = orig; }, 2200);
            }
          }).catch(function(){});
        }
      };
      window.__tomSubmitSubstackSubscribe = function(ev, formEl, essaySlug) {
        if (ev && ev.preventDefault) ev.preventDefault();
        var input = formEl ? formEl.querySelector('input[type="email"]') : null;
        var statusEl = formEl && formEl.parentNode ? formEl.parentNode.querySelector('.substack-sub-status') : null;
        var btnEl = formEl ? formEl.querySelector('button[type="submit"]') : null;
        var email = input ? String(input.value || '').trim().toLowerCase() : '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.color = '#991b1b';
            statusEl.textContent = 'Please enter a valid email address.';
          }
          if (input) input.focus();
          return false;
        }
        if (btnEl) {
          btnEl.disabled = true;
          btnEl.textContent = 'Subscribing...';
        }
        var noteStr = 'site=truthofmarket.com/insights/ | essay=' + (essaySlug || 'smh-xlv-80-20-barbell-drawdown-study.html');
        try {
          localStorage.setItem('tom_free_member_email', email);
          localStorage.setItem('tom_free_member_since', kst);
          localStorage.setItem('dc_member_TOM', JSON.stringify({
            div: 'TOM',
            email: email,
            nickname: '',
            segment: 'substack_essay_reader',
            notes: noteStr,
            joined_at: new Date().toISOString()
          }));
          (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/signup', { mode: 'cors', keepalive: true }).catch(function(){});
          (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/signup_total', { mode: 'cors', keepalive: true }).catch(function(){});
        } catch (_e) {}

        var finishOk = function() {
          if (btnEl) {
            btnEl.disabled = false;
            btnEl.textContent = 'Subscribed';
          }
          if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.color = '#065f46';
            statusEl.innerHTML = 'Thank you. Future morning notes will arrive quietly at <strong>' + email.replace(/[<>&"]/g, '') + '</strong> (no password needed, 1-click unsubscribe anytime).';
          }
        };

        if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.registerMember === 'function') {
          window.DreamCompanyCRM.registerMember({
            div: 'TOM',
            email: email,
            nickname: '',
            segment: 'substack_essay_reader',
            lang: 'en-US',
            notes: noteStr,
            message: noteStr
          }).then(finishOk).catch(finishOk);
        } else if (typeof window.submitTomVipWaitlistOrManualEmail === 'function') {
          window.submitTomVipWaitlistOrManualEmail({
            email: email,
            segment: 'substack_essay_reader',
            lang: 'en-US',
            notes: noteStr
          }).then(finishOk).catch(finishOk);
        } else {
          finishOk();
        }
        return false;
      };
      document.addEventListener('DOMContentLoaded', function() {
        try {
          var saved = localStorage.getItem('tom_free_member_email');
          if (saved) {
            document.querySelectorAll('.substack-inline-form input[type="email"]').forEach(function(inp) {
              if (!inp.value) inp.value = saved;
            });
          }
        } catch (_e2) {}
      });
      if (window.__HQ_KPI_TOM__) return;
      window.__HQ_KPI_TOM__ = true;
      var ua = navigator.userAgent || '';
      if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|python|curl|node|axios/i.test(ua)) return;
      var host = (location && location.hostname) || '';
      if (!host || host === 'localhost' || host === '127.0.0.1') return;
      (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/pv_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
      (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/pv_total', { mode: 'cors', keepalive: true }).catch(function(){});
      if (localStorage.getItem('hq_uv_' + ns + '_' + kst) !== '1') {
        localStorage.setItem('hq_uv_' + ns + '_' + kst, '1');
        (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/uv_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
      }
      if (localStorage.getItem('hq_uv_ever_' + ns) !== '1') {
        localStorage.setItem('hq_uv_ever_' + ns, '1');
        (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/uv_total', { mode: 'cors', keepalive: true }).catch(function(){});
      }
    } catch (e) {}
  })();
