import { formatCheckoutUrl, getVipTelegramUrl } from "../services/api.js";

const PRICING_COPY = {
  en: {
    heading: "Simple, Transparent VIP Access — Unlocks Instantly After Payment",
    subheading: "Choose Monthly or Lifetime below. Your screen unlocks automatically the moment checkout finishes — no license key typing required.",
    t1Badge: "MONTHLY VIP",
    t1Title: "Monthly VIP Terminal & Daily Signals",
    t1Period: "/ month",
    t1Items: [
      "Full 3-Color Rebalance Signals Across SGOV, SCHD, JEPI, VOO & 72 US Leaders",
      "Daily 08:10 EST Retirement Cashflow & Corporate Balance-Sheet Briefs",
      "Portfolio Doctor: Calm 2–4x/Year Weight Check & Drawdown Protection",
      "Full TradingView Trend Script + 26-Year US Market Weather CSV",
    ],
    t1Btn: "Start Monthly VIP — $29/mo",
    t1PayNote: "🍎 Apple Pay · Google Pay · Credit Card (1-Click Cancel Anytime)",
    t2Badge: "LIFETIME VIP",
    t2Title: "Lifetime VIP All-Access Pass",
    t2Period: "/ one-time",
    t2Items: [
      "Pay Once, Own Forever — Zero recurring monthly charges",
      "Complete 26.8-Year (2000–2026) US Equity & Semiconductor Datasets",
      "English & Japanese Research Briefs + VIP Alert Channel",
      "Permanent Access to Both RightSideAlpha & SemiFearGreed Pro",
    ],
    t2Btn: "Get Lifetime VIP — $199",
    t2PayNote: "🍎 Apple Pay · Google Pay · Credit Card (One-Time · Instant Auto-Unlock)",
    autoUnlockNote: "✨ Instant Auto-Unlock: All 72 VIP stock setups open automatically on this screen right after payment.",
    restoreSummary: "🔑 Switching devices or already paid? Restore your VIP License Key here",
    restoreBtn: "Open License Key Restore Box",
    t3Badge: "OPTIONAL EXTERNAL CHARTING & COMMUNITY LINKS",
    t3Title: "External Charting Platforms & Free Public Channels",
    t3Desc: "Optional third-party charting tools and official public channels (separate from your TruthOfMarket VIP pass):",
    t3Items: [
      "<b>TradingView Pro (ID: 1173809)</b> — Multi-timeframe MA20/MA60 & Pine Script v5 execution",
      "<b>Seeking Alpha Premium (better_life333)</b> — Quant Grades & 1-2Y consensus EPS revision tracking",
      "<b>TrendSpider Automated Charting (rightside)</b> — Institutional AI trendline, breakout & unusual options scanner",
    ],
    tvBtn: "📈 Launch TradingView Terminal ↗",
    saBtn: "📊 Open Seeking Alpha EPS Consensus ↗",
    tsBtn: "⚡ Launch TrendSpider AI Scanner ↗",
    tgBtn: "🔒 Pro VIP Telegram ($SMH/$XLV & 72-Stock Live News)",
  },
  jp: {
    heading: "シンプルでわかりやすいVIPプラン — 決済完了と同時に自動アンロック",
    subheading: "月額プランまたは永久パスをお選びください。決済完了と同時にこの画面で自動解放されます（36桁キーのコピー＆貼り付け不要）。",
    t1Badge: "MONTHLY VIP",
    t1Title: "月額VIPターミナル＆日次SECリサーチ",
    t1Period: "/ 月額",
    t1Items: [
      "SGOV・SCHD・JEPI・VOOおよび米国優良株の3色リバランス判定を完全公開",
      "毎朝08:10 EST更新・配当安定性＆財務キャッシュフロー分析ブリーフ",
      "ポートフォリオ診断：年2〜4回の穏やかな配分チェック",
      "TradingView トレンドスクリプト＋米国市場26年分CSVダウンロード",
    ],
    t1Btn: "Start Monthly VIP — $29/mo (月額VIPを始める)",
    t1PayNote: "🍎 Apple Pay · Google Pay · Credit Card (1-Click Cancel Anytime / いつでも1クリック解約)",
    t2Badge: "LIFETIME VIP",
    t2Title: "永久VIPオールアクセスパス (買い切り)",
    t2Period: "/ 買い切り(永久)",
    t2Items: [
      "1回のお支払いのみ — 毎月のサブスクリプション費用ゼロ",
      "26.8年間(2000–2026)の米国株＆半導体ETF完全データセット収録",
      "英語・日本語対応のSECリサーチブリーフ＆VIPアラート連携",
      "RightSideAlpha＋SemiFearGreedの全Pro機能を永久アンロック",
    ],
    t2Btn: "Get Lifetime VIP — $199 (永久VIPパスを取得)",
    t2PayNote: "🍎 Apple Pay · Google Pay · Credit Card (買い切り・決済後すぐ自動アンロック)",
    autoUnlockNote: "✨ 決済完了と同時にブラウザ上で全72銘柄のVIPデータが自動解放されます（キー入力不要）。",
    restoreSummary: "🔑 機種変更・別ブラウザでのVIPライセンスキー復元はこちら",
    restoreBtn: "ライセンスキー復元ウィンドウを開く",
    t3Badge: "OPTIONAL EXTERNAL CHARTING & COMMUNITY LINKS",
    t3Title: "外部チャート検証ツール＆公式SNSチャンネル（任意）",
    t3Desc: "MA20/MA60出来高ブレイクの確認やEPSコンセンサス検証に便利な外部提携ツール＆公式チャンネル：",
    t3Items: [
      "<b>TradingView Pro (1173809)</b> — マルチタイムフレームMA20/MA60＆Pine Script v5実行",
      "<b>Seeking Alpha Premium (better_life333)</b> — クオンツ評価＆1〜2年先EPSコンセンサス推移",
      "<b>TrendSpider AI Charting (rightside)</b> — 自動トレンドライン＆機関投資家ブレイクスキャナー",
    ],
    tvBtn: "📈 TradingView チャートを開く ↗",
    saBtn: "📊 Seeking Alpha EPSコンセンサス ↗",
    tsBtn: "⚡ TrendSpider AIスキャナーを開く ↗",
    tgBtn: "🔒 Pro専用 VIP Telegram ($SMH/$XLV & 72銘柄リアルタイムニュース)",
  },
};
PRICING_COPY.kr = PRICING_COPY.en;

export function renderPricing(state) {
  const cfg = state.config || {};
  const c = PRICING_COPY[state.lang] || PRICING_COPY.en;
  const lsMonthly = formatCheckoutUrl(
    cfg.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
  );
  const lsLtd = formatCheckoutUrl(
    cfg.ls_site1_ltd_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b"
  );
  const tvAffId = encodeURIComponent(cfg.tradingview_aff_id || "1173809");
  const saSource = encodeURIComponent(cfg.seekingalpha_source || "better_life333");
  const tsAffId = encodeURIComponent(cfg.trendspider_aff_id || "rightside");
  const directTvUrl = `https://www.tradingview.com/?aff_id=${tvAffId}`;
  const directSaUrl = `https://seekingalpha.com/symbol/SPY/earnings?source=${saSource}`;
  const directTsUrl = `https://trendspider.com/?_go=${tsAffId}`;

  const checkoutFallbackHtml = `
    <div style="margin-top:8px; font-size:0.71rem; color:#94a3b8; text-align:center; line-height:1.45;">
      Checkout issue in your region? Join <a href="https://t.me/truthofmarketss" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; font-weight:700; text-decoration:underline;">@truthofmarketss</a> or request instant Pro activation via <a href="mailto:beable9489@gmail.com?subject=Instant%20Pro%20Activation%20Request%20(TruthOfMarket)" style="color:#93c5fd; font-weight:700; text-decoration:underline;">email</a>.
    </div>
  `;

  const checkSvg = `
    <span class="price-check">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
  `;

  return `
    <div id="pricing" style="scroll-margin-top:80px;">
      <span id="pricingSection" style="display:block; height:0; overflow:hidden;"></span>
      <div style="max-width:980px; margin:0 auto 14px; text-align:center;">
        <h2 style="font-size:1.35rem; font-weight:900; color:#ffffff; margin:0 0 6px;">${c.heading}</h2>
        <p style="font-size:0.9rem; color:#cbd5e1; margin:0; line-height:1.5;">${c.subheading}</p>
      </div>
      <div class="pricing-grid">
        <!-- Tier 1: Pro Monthly -->
        <div class="price-card featured">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span class="badge badge-ignition">${c.t1Badge}</span>
              <span class="badge price-badge-popular">POPULAR</span>
            </div>
            <h3 style="font-size:1.18rem; font-weight:800; margin-top:10px; color:#ffffff;">
              ${c.t1Title}
            </h3>
            <div class="price-num">$29 <span style="font-size:0.86rem; color:var(--muted); font-family:var(--font-sans); font-weight:600;">${c.t1Period}</span></div>
            <div class="price-subtext">Billed monthly · Cancel anytime with 1 click</div>
            <ul class="price-list">
              ${c.t1Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <a class="btn btn-primary lemonsqueezy-button" id="cardMonthlyBtn" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthly}" style="justify-content:center; min-height:64px; padding:14px 18px; width:100%; font-size:1.06rem; font-weight:800; border-radius:12px;">
              ${c.t1Btn}
            </a>
            <div style="margin-top:9px; font-size:0.8rem; color:#e2e8f0; font-weight:700; text-align:center; line-height:1.4;">
              ${c.t1PayNote}
            </div>
            ${checkoutFallbackHtml}
          </div>
        </div>

        <!-- Tier 2: Lifetime Pass -->
        <div class="price-card best-value">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span class="badge badge-watch">${c.t2Badge}</span>
              <span class="badge price-badge-lifetime">BEST VALUE · SAVE 43%</span>
            </div>
            <h3 style="font-size:1.18rem; font-weight:800; margin-top:10px; color:#ffffff;">
              ${c.t2Title}
            </h3>
            <div class="price-num">$199 <span style="font-size:0.86rem; color:var(--muted); font-family:var(--font-sans); font-weight:600;">${c.t2Period}</span></div>
            <div class="price-subtext">One-time payment · Instant automatic unlock on screen</div>
            <div class="price-savings-pill">⚡ Breakeven in 6.8 Months vs $29/mo ($199 vs $348/yr) · 100% Free Thereafter</div>
            <ul class="price-list">
              ${c.t2Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <a class="btn btn-emerald lemonsqueezy-button" id="cardLtdBtn" data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b" href="${lsLtd}" style="justify-content:center; min-height:64px; padding:14px 18px; width:100%; font-size:1.06rem; font-weight:800; border-radius:12px;">
              ${c.t2Btn}
            </a>
            <div style="margin-top:9px; font-size:0.8rem; color:#a7f3d0; font-weight:700; text-align:center; line-height:1.4;">
              ${c.t2PayNote}
            </div>
            ${checkoutFallbackHtml}
          </div>
        </div>
      </div>

      <!-- Instant Auto-Unlock Note & Collapsible Device License Restore -->
      <div style="max-width:980px; margin:10px auto 0; text-align:center;">
        <div style="font-size:0.82rem; color:#34d399; font-weight:700; margin-bottom:10px;">
          ${c.autoUnlockNote}
        </div>
        <details style="background:#0b1120; border:1px solid rgba(148,163,184,0.22); border-radius:10px; padding:10px 16px; text-align:left;">
          <summary style="cursor:pointer; font-size:0.82rem; font-weight:700; color:#93c5fd; list-style:none;">
            ${c.restoreSummary} ▾
          </summary>
          <div style="margin-top:10px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; font-size:0.8rem; color:#cbd5e1;">
            <span>Already have a Lemon Squeezy receipt key on another computer or phone? Restore your VIP session with 1 click:</span>
            <button type="button" class="btn btn-sm" onclick="var b=document.getElementById('btnOpenLicense');if(b){b.click();}else{var m=document.getElementById('licenseModal');if(m)m.style.display='flex';}" style="font-weight:700; border-color:rgba(147,197,253,0.45); color:#93c5fd;">
              ${c.restoreBtn} →
            </button>
          </div>
        </details>
      </div>

      <!-- Trust & Security Micro-Ribbon (Lemon Squeezy PCI-DSS & Instant Key Delivery) -->
      <div class="pricing-trust-ribbon" style="max-width:980px; margin:16px auto 0;">
        <div class="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Merchant of Record: <b>Lemon Squeezy, LLC</b></span>
        </div>
        <div class="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>256-Bit SSL Encrypted Inline Checkout</span>
        </div>
        <div class="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Instant On-Screen Auto-Unlock &amp; Receipt Key</span>
        </div>
      </div>

      <!-- Separated Lower Footer Section: Tier 3 Partner Tools & Public Channels -->
      <details style="max-width:980px; margin:18px auto 0; background:rgba(15,23,42,0.55); border:1px solid var(--border-card); border-radius:10px; padding:12px 18px;">
        <summary style="cursor:pointer; font-size:0.8rem; font-weight:700; color:#94a3b8; display:flex; align-items:center; justify-content:space-between; gap:8px;">
          <span>🔗 ${c.t3Title}</span>
          <span style="font-size:0.72rem; color:#64748b;">Expand Partner Tools &amp; Community ▾</span>
        </summary>
        <div style="margin-top:14px; padding-top:12px; border-top:1px solid rgba(148,163,184,0.14);">
          <p style="color:var(--muted); font-size:0.8rem; margin:0 0 10px; line-height:1.5;">
            ${c.t3Desc}
          </p>
          <ul class="price-list" style="margin-bottom:12px;">
            ${c.t3Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
          </ul>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:8px;">
            <a class="btn" id="affTvBtn" href="${directTvUrl}" target="_blank" rel="noopener noreferrer" style="justify-content:center;">
              ${c.tvBtn}
            </a>
            <a class="btn" id="affSaBtn" href="${directSaUrl}" target="_blank" rel="noopener noreferrer" style="justify-content:center;">
              ${c.saBtn}
            </a>
            <a class="btn" id="affBrokerBtn" href="${directTsUrl}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(16,185,129,0.45); color:#34d399; font-weight:700;">
              ${c.tsBtn}
            </a>
            <a class="btn ${state.isProUnlocked ? "" : "btn-gated-vip-tg"}" id="pricingTelegramChannelBtn" href="${getVipTelegramUrl(state.isProUnlocked)}" ${state.isProUnlocked ? 'target="_blank" rel="noopener noreferrer"' : ""} style="justify-content:center; border-color:rgba(56,189,248,0.45); color:#38bdf8; font-weight:700;">
              ${state.isProUnlocked ? "👑 Enter Pro VIP Telegram Channel ↗" : c.tgBtn}
            </a>
            <a class="btn" id="pricingYoutubeBtn" href="${cfg.youtube_url || "https://www.youtube.com/@RightSideAlpha"}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(239,68,68,0.4); color:#fca5a5;">
              📺 YouTube (@RightSideAlpha) ↗
            </a>
            <a class="btn" id="pricingInstagramBtn" href="${cfg.instagram_url || "https://www.instagram.com/rightsidealpha"}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(236,72,153,0.4); color:#f9a8d4;">
              📸 Instagram (@rightsidealpha) ↗
            </a>
          </div>
        </div>
      </details>
    </div>
  `;
}
