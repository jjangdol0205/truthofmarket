import { formatCheckoutUrl, getVipTelegramUrl } from "../services/api.js";

const PRICING_COPY = {
  en: {
    t1Badge: "INSTITUTIONAL PRO",
    t1Title: "Pro Quantitative Terminal & Daily SEC Brief",
    t1Period: "/ month",
    t1Items: [
      "Unmask all 72 US Equity PW-RSI Scores, MA60 Breakout Triggers & -9% Stop Levels",
      "Daily 08:10 EST Primary-Filing (10-K/10-Q/8-K) Turnaround Research Digest",
      "Position Risk & 55-Day Time-Stop Diagnostic Engine (Position Doctor)",
      "Full TradingView Pine Script v5 Indicator Source Code + SemiFearGreed 26Y CSV",
    ],
    t1Btn: "Subscribe via Lemon Squeezy ($29/mo)",
    t2Badge: "FOUNDER ALLOCATION",
    t2Title: "Lifetime Research & Terminal License",
    t2Period: "/ one-time",
    t2Items: [
      "Permanent License Key — Zero recurring monthly subscription charges",
      "Complete 26.8-Year (2000–2026) US Equity & Semiconductor ETF Backtest Datasets",
      "Multilingual Access (English, Japanese & Korean SEC Research Briefs)",
      "Full Access to both RightSideAlpha and SemiFearGreed Pro Features",
    ],
    t2Btn: "Acquire Lifetime License ($199)",
    t3Badge: "ESSENTIAL US EQUITY PARTNER TOOLS",
    t3Title: "Institutional Charting, Consensus & Automated Scanners",
    t3Desc: "Verify MA20/MA60 volume breakouts, Wall Street EPS revisions, and automated multi-timeframe trendlines with our official US equity partner stack:",
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
    t1Badge: "INSTITUTIONAL PRO",
    t1Title: "Pro クオンツターミナル＆日次SECリサーチ",
    t1Period: "/ 月額",
    t1Items: [
      "米国72銘柄すべてのMA60突破トリガー(TRG)・-9%損切(STP)・+100%目標値(TP1)を完全公開",
      "毎朝08:10 EST更新・SEC一次開示(10-K/10-Q/8-K)ターンアラウンド分析ブリーフ",
      "ポジションドクター：保有銘柄の-9%損切 / 55日タイムストップ / 元本回収を即時診断",
      "TradingView Pine Script v5 インジケーター完全ソース＋半導体指数26年分CSVダウンロード",
    ],
    t1Btn: "Lemon SqueezyでPro購読 ($29/月)",
    t2Badge: "FOUNDER LIFETIME",
    t2Title: "永久リサーチ＆ターミナルライセンス",
    t2Period: "/ 買い切り(永久)",
    t2Items: [
      "永久ライセンスキー発行 — 毎月のサブスクリプション費用ゼロ",
      "26.8年間(2000–2026)の米国株＆半導体ETF完全バックテストデータセット収録",
      "英語・日本語対応のSECリサーチブリーフ＆Telegramアラート連携",
      "RightSideAlpha＋SemiFearGreedの全Pro機能を永久アンロック",
    ],
    t2Btn: "永久ライセンスを取得 ($199)",
    t3Badge: "ESSENTIAL US EQUITY PARTNER TOOLS",
    t3Title: "米国株必須チャート検証・EPSコンセンサス・AIスキャナー",
    t3Desc: "MA20/MA60出来高ブレイクの確認、EPSリビジョン検証、マルチタイムフレーム自動トレンドライン分析：",
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
      <div class="pricing-grid">
        <!-- Tier 1: Pro Monthly -->
        <div class="price-card featured">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span class="badge badge-ignition">${c.t1Badge}</span>
              <span class="badge price-badge-popular">POPULAR</span>
            </div>
            <h3 style="font-size:1.12rem; font-weight:800; margin-top:10px; color:#ffffff;">
              ${c.t1Title}
            </h3>
            <div class="price-num">$29 <span style="font-size:0.82rem; color:var(--muted); font-family:var(--font-sans); font-weight:500;">${c.t1Period}</span></div>
            <div class="price-subtext">Billed monthly · Cancel anytime with 1 click</div>
            <ul class="price-list">
              ${c.t1Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <a class="btn btn-primary lemonsqueezy-button" id="cardMonthlyBtn" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthly}" target="_blank" rel="noopener noreferrer" style="justify-content:center; padding:10px; width:100%;">
              ${c.t1Btn}
            </a>
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
            <h3 style="font-size:1.12rem; font-weight:800; margin-top:10px; color:#ffffff;">
              ${c.t2Title}
            </h3>
            <div class="price-num">$199 <span style="font-size:0.82rem; color:var(--muted); font-family:var(--font-sans); font-weight:500;">${c.t2Period}</span></div>
            <div class="price-subtext">One-time payment · Instant permanent license delivery</div>
            <div class="price-savings-pill">⚡ Breakeven in 6.8 Months vs $29/mo ($199 vs $348/yr) · 100% Free Thereafter</div>
            <ul class="price-list">
              ${c.t2Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <a class="btn btn-emerald lemonsqueezy-button" id="cardLtdBtn" data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b" href="${lsLtd}" target="_blank" rel="noopener noreferrer" style="justify-content:center; padding:10px; width:100%;">
              ${c.t2Btn}
            </a>
            ${checkoutFallbackHtml}
          </div>
        </div>

        <!-- Tier 3: Essential US Equity Partner Tools -->
        <div class="price-card">
          <div>
            <span class="badge" style="background:rgba(41,98,255,0.14); color:#93c5fd; border:1px solid rgba(41,98,255,0.3);">${c.t3Badge}</span>
            <h3 style="font-size:1.12rem; font-weight:800; margin-top:10px; color:#ffffff;">
              ${c.t3Title}
            </h3>
            <p style="color:var(--muted); font-size:0.8rem; margin-top:8px; line-height:1.5;">
              ${c.t3Desc}
            </p>
            <ul class="price-list">
              ${c.t3Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div style="display:flex; flex-direction:column; gap:7px;">
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
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <a class="btn" id="pricingYoutubeBtn" href="${cfg.youtube_url || "https://www.youtube.com/@RightSideAlpha"}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(239,68,68,0.4); color:#fca5a5;">
                📺 YouTube (@RightSideAlpha) ↗
              </a>
              <a class="btn" id="pricingInstagramBtn" href="${cfg.instagram_url || "https://www.instagram.com/rightsidealpha"}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(236,72,153,0.4); color:#f9a8d4;">
                📸 Instagram (@rightsidealpha) ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust & Security Micro-Ribbon (Lemon Squeezy PCI-DSS & Instant Key Delivery) -->
      <div class="pricing-trust-ribbon">
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
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
        <div class="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Instant Key Delivery &amp; VAT Invoicing</span>
        </div>
      </div>
    </div>
  `;
}
