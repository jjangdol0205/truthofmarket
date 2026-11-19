export function renderFooter(state) {
  const t = state.t;

  return `
    <footer class="footer">
      <div style="display:flex; gap:14px; flex-wrap:wrap; align-items:center; margin-bottom:10px; font-weight:700;">
        <a href="/terms.html" style="color:#93c5fd; text-decoration:underline;">Terms of Service</a>
        <span>·</span>
        <a href="/privacy.html" style="color:#93c5fd; text-decoration:underline;">Privacy Policy</a>
        <span>·</span>
        <a href="/refund.html" style="color:#93c5fd; text-decoration:underline;">14-Day Refund Policy</a>
        <span>·</span>
        <a href="https://www.youtube.com/@TruthOfMarketUS" target="_blank" rel="noopener" style="color:#93c5fd; text-decoration:underline;">YouTube @TruthOfMarketUS</a>
        <span>·</span>
        <a href="https://www.instagram.com/truthofmarket/" target="_blank" rel="noopener" style="color:#93c5fd; text-decoration:underline;">Instagram @truthofmarket</a>
        <span>·</span>
        <a href="mailto:beable9489@gmail.com" style="color:#38bdf8; text-decoration:underline;">Support: beable9489@gmail.com</a>
        <span>·</span>
        <a href="mailto:beable9489@gmail.com?subject=TruthOfMarket%20Brand%20%26%20Media%20Partnership" style="color:#6ee7b7; text-decoration:underline;">Sponsorship &amp; Media Partnerships: beable9489@gmail.com</a>
      </div>
      <p>${t.disclaimer}</p>
      <p style="margin-top:8px;">${t.copyright}</p>
    </footer>
  `;
}
