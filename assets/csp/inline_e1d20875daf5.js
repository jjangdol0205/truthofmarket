/* === HQ Edge Real-Human Visitor & Signup Helper (tom_truthofmarket) === */
  (function(){
    try {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      var ns = 'tom_truthofmarket';
      window.trackTomFreeSignup = function(emailAddr) {
        try {
          var h = (location && location.hostname) || '';
          if (!h || h === 'localhost' || h === '127.0.0.1') return;
          (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/signup', { mode: 'cors', keepalive: true }).catch(function(){});
          (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/signup_total', { mode: 'cors', keepalive: true }).catch(function(){});
        } catch (e) {}
      };
    } catch (e) {}
  })();
