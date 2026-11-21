/* === HQ Edge Real-Human Visitor & Signup Helper (tom_truthofmarket) === */
  (function(){
    try {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      var ns = 'tom_truthofmarket';
      window.trackTomFreeSignup = function(emailAddr) {
        try {
          var h = (location && location.hostname) || '';
          if (!h || h === 'localhost' || h === '127.0.0.1') return;
        } catch (e) {}
      };
    } catch (e) {}
  })();
