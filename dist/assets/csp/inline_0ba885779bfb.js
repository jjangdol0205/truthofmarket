/* === HQ Edge Real-Human Visitor & Free Email Signup Beacon (tom_truthofmarket) === */
  (function(){
    try {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      var ns = 'tom_truthofmarket';
      window.__tomSubmitLeadMagnet = function(ev, formEl, topicLabel) {
        if (ev && ev.preventDefault) ev.preventDefault();
        var input = formEl ? formEl.querySelector('input[type="email"]') : null;
        var msgBox = formEl ? formEl.parentNode.querySelector('.tom-lead-status') : null;
        var email = input ? String(input.value || '').trim() : '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          if (msgBox) {
            msgBox.style.display = 'block';
            msgBox.style.color = '#fca5a5';
            msgBox.textContent = 'Please enter a valid email address (e.g., investor@email.com).';
          }
          if (input) input.focus();
          return false;
        }
        try {
          localStorage.setItem('tom_free_member_email', email);
          localStorage.setItem('tom_free_member_since', kst);
          if (typeof window.submitTomVipWaitlistOrManualEmail === 'function') {
            window.submitTomVipWaitlistOrManualEmail({
              email: email,
              segment: 'retirement_401k_ira',
              lang: 'en-US',
              notes: 'site=truthofmarket.com | topic=' + (topicLabel || '')
            });
          } else if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.registerMember === 'function') {
            window.DreamCompanyCRM.registerMember({
              div: 'TOM',
              email: email,
              nickname: '',
              segment: 'retirement_401k_ira',
              message: topicLabel || '',
              lang: 'en-US',
              website_hp: ''
            });
          }
          (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/signup', { mode: 'cors', keepalive: true }).catch(function(){});
          (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/signup_total', { mode: 'cors', keepalive: true }).catch(function(){});
        } catch (_e) {}
        document.querySelectorAll('.tom-lead-status').forEach(function(el) {
          el.style.display = 'block';
          el.style.color = '#86efac';
          el.innerHTML = '<strong>Welcome aboard!</strong> Complimentary Morning Research Notes &amp; Historical Study Updates are now active for <strong>' + email.replace(/[<>&"]/g, '') + '</strong>' + (topicLabel ? ' (' + topicLabel.replace(/[<>&"]/g, '') + ')' : '') + '.';
        });
        document.querySelectorAll('.tom-lead-form input[type="email"]').forEach(function(inp) { inp.value = email; });
        return false;
      };
      document.addEventListener('DOMContentLoaded', function() {
        try {
          var saved = localStorage.getItem('tom_free_member_email');
          if (saved) {
            document.querySelectorAll('.tom-lead-form input[type="email"]').forEach(function(inp) { inp.value = saved; });
          }
        } catch (_e2) {}
      });
      if (window.__HQ_BEACON_SENT_tom_truthofmarket__ || window.__HQ_KPI_TOM__) return;
      window.__HQ_BEACON_SENT_tom_truthofmarket__ = true;
      window.__HQ_KPI_TOM__ = true;
      var ua = navigator.userAgent || '';
      if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|gtmetrix|pingdom|uptimerobot|python|curl|node|axios/i.test(ua)) return;
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
      if (location.search.indexOf('payment=success') !== -1 || location.search.indexOf('unlock=1') !== -1) {
        if (localStorage.getItem('hq_paid_' + kst) !== '1') {
          localStorage.setItem('hq_paid_' + kst, '1');
          (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/paid_member_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
          (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/paid_member_total', { mode: 'cors', keepalive: true }).catch(function(){});
        }
      }
    } catch (e) {}
  })();
