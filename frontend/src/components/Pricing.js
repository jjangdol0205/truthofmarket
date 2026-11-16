import { formatCheckoutUrl, getVipTelegramUrl } from "../services/api.js";

const PRICING_COPY = {
  en: {
    heading: "Self-Directed Educational Calculator Software — Simple VIP Access",
    subheading:
      "Public market data visualization & dividend/allocation calculator software for self-directed learners. Backed by our 14-Day No-Questions-Asked Refund Policy.",
    t1Badge: "MONTHLY VIP",
    t1Title: "Monthly VIP Educational Calculator Suite",
    t1Period: "/ month",
    t1Items: [
      "Self-Directed Educational Calculator Software across SGOV, SCHD, JEPI, VOO & US Blue-Chip Datasets",
      "Daily 08:10 EST Public Balance-Sheet & Dividend Coverage Educational Summaries",
      "Calm 2–4x/Year Portfolio Weight Rebalancing & Drawdown Math Calculators",
      "TradingView Educational Trend Overlay Script + 26.8-Year US Market Weather CSV",
    ],
    t1Btn: "Start Monthly VIP — $29/mo",
    t1PayNote: "🍎 Apple Pay · Google Pay · Credit Card (1-Click Cancel Anytime · 14-Day Refund Policy)",
    t2Badge: "ANNUAL VIP",
    t2Title: "Annual VIP Educational Calculator Pass",
    t2Period: "/ year",
    t2Items: [
      "Full 12-Month Access to All Self-Directed Educational Calculators & Visualizations",
      "Complete 26.8-Year (1998–2026) US Equity & ETF Historical CSV Datasets",
      "English & Japanese Educational Macro Research Archive + VIP Dispatch Desk",
      "Unified Access Across TruthOfMarket Retirement & Market Weather Calculators",
    ],
    t2Btn: "Start Annual VIP — $199/yr",
    t2PayNote: "🍎 Apple Pay · Google Pay · Credit Card (Billed Annually · 14-Day Refund Policy)",
    autoUnlockNote:
      "✨ Instant Software Activation: Your self-directed educational calculators and CSV datasets unlock on screen automatically after checkout.",
    restoreSummary: "🔑 Switching devices or already subscribed? Restore your VIP License Key here",
    restoreBtn: "Open License Key Restore Box",
    t3Badge: "OPTIONAL EXTERNAL CHARTING & COMMUNITY LINKS",
    t3Title: "External Charting Platforms & Free Public Channels",
    t3Desc: "Optional third-party charting tools and official public channels (separate from your TruthOfMarket VIP software pass):",
    t3Items: [
      "<b>TradingView Pro (ID: 1173809)</b> — Multi-timeframe moving-average & Pine Script v5 visualization",
      "<b>Seeking Alpha Premium (better_life333)</b> — Public dividend grades & consensus EPS data",
      "<b>TrendSpider Charting Software (rightside)</b> — Multi-factor technical charting workspace",
    ],
    tvBtn: "📈 Launch TradingView Charting ↗",
    saBtn: "📊 Open Seeking Alpha Dividend Data ↗",
    tsBtn: "⚡ Launch TrendSpider Workspace ↗",
    tgBtn: "🔒 VIP Telegram Educational Research Desk",
  },
  jp: {
    heading: "自己判断型・教育用ポートフォリオ計算ソフトウェア — VIPプラン",
    subheading:
      "公開市場データの可視化および配当・資産配分シミュレーションを行う教育用計算ソフトウェアです（14日間返金保証付き）。",
    t1Badge: "MONTHLY VIP",
    t1Title: "Monthly VIP 教育用計算ソフト＆財務データ",
    t1Period: "/ 月額",
    t1Items: [
      "SGOV・SCHD・JEPI・VOOおよび米国主要ETFの3色リバランス比率計算ソフト",
      "毎朝08:10 EST更新・公開財務データ＆配当カバレッジ教育サマリー",
      "年2〜4回の穏やかな資産配分チェック＆ドローダウン数学シミュレーター",
      "TradingView 教育用トレンド表示スクリプト＋米国市場26.8年CSVデータ",
    ],
    t1Btn: "Start Monthly VIP — $29/mo",
    t1PayNote: "🍎 Apple Pay · Google Pay · Credit Card (いつでも1クリック解約 · 14日間返金保証)",
    t2Badge: "ANNUAL VIP",
    t2Title: "Annual VIP 年間オールアクセスパス",
    t2Period: "/ 年額",
    t2Items: [
      "月額比43%割引 — 全教育用シミュレーター＆データ可視化ツールの年間利用権",
      "26.8年間(1998–2026)の米国株＆ETFヒストリカルCSVデータセット完全収録",
      "英語・日本語対応の教育用マクロリサーチアーカイブ閲覧",
      "TruthOfMarket 老後キャッシュフロー＆市場天気ツールの全機能アクセス",
    ],
    t2Btn: "Start Annual VIP — $199/yr",
    t2PayNote: "🍎 Apple Pay · Google Pay · Credit Card (年額プラン · 14日間返金保証)",
    autoUnlockNote: "✨ 決済完了と同時にブラウザ上で教育用計算ツールとCSVデータが自動解放されます。",
    restoreSummary: "🔑 機種変更・別ブラウザでのVIPライセンスキー復元はこちら",
    restoreBtn: "ライセンスキー復元ウィンドウを開く",
    t3Badge: "OPTIONAL EXTERNAL CHARTING & COMMUNITY LINKS",
    t3Title: "外部チャート検証ツール＆公式SNSチャンネル（任意）",
    t3Desc: "チャート確認や公開財務データ参照に便利な外部提携ツール＆公式チャンネル：",
    t3Items: [
      "<b>TradingView Pro (1173809)</b> — マルチタイムフレーム移動平均線＆Pine Script v5表示",
      "<b>Seeking Alpha Premium (better_life333)</b> — 配当データ＆コンセンサスEPS推移",
      "<b>TrendSpider Charting (rightside)</b> — チャート分析ワークスペース",
    ],
    tvBtn: "📈 TradingView チャートを開く ↗",
    saBtn: "📊 Seeking Alpha 財務データ ↗",
    tsBtn: "⚡ TrendSpider チャートを開く ↗",
    tgBtn: "🔒 VIP専用 Telegram 教育リサーチデスク",
  },
};
PRICING_COPY.kr = PRICING_COPY.en;

export function renderPricing(state) {
  const cfg = state.config || {};
  const c = PRICING_COPY[state.lang] || PRICING_COPY.en;
  const lsMonthly = formatCheckoutUrl(
    cfg.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en"
  );
  const lsAnnual = formatCheckoutUrl(
    cfg.ls_site1_ltd_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en"
  );
  const tvAffId = encodeURIComponent(cfg.tradingview_aff_id || "1173809");
  const saSource = encodeURIComponent(cfg.seekingalpha_source || "better_life333");
  const tsAffId = encodeURIComponent(cfg.trendspider_aff_id || "rightside");
  const directTvUrl = `https://www.tradingview.com/?aff_id=${tvAffId}`;
  const directSaUrl = `https://seekingalpha.com/symbol/SPY/earnings?source=${saSource}`;
  const directTsUrl = `https://trendspider.com/?_go=${tsAffId}`;

  const checkoutFallbackHtml = `
    <div style="margin-top:8px; font-size:0.74rem; color:#94a3b8; text-align:center; line-height:1.45;">
      Questions about educational software access? Email our Educational Market Data &amp; Quantitative Research Desk at <a href="mailto:beable9489@gmail.com?subject=TruthOfMarket%20Educational%20Software%20Support" style="color:#93c5fd; font-weight:700; text-decoration:underline;">beable9489@gmail.com</a>.
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
        <div style="display:inline-block; margin-bottom:8px; padding:4px 12px; border-radius:999px; background:rgba(56,189,248,0.14); border:1px solid rgba(56,189,248,0.4); color:#7dd3fc; font-size:0.8rem; font-weight:800; letter-spacing:0.02em;">
          SELF-DIRECTED EDUCATIONAL CALCULATOR SOFTWARE &bull; PUBLIC MARKET DATA VISUALIZATION
        </div>
        <h2 style="font-size:1.35rem; font-weight:900; color:#ffffff; margin:0 0 6px;">${c.heading}</h2>
        <p style="font-size:0.95rem; color:#cbd5e1; margin:0; line-height:1.55;">${c.subheading}</p>
      </div>
      <div class="pricing-grid">
        <!-- Tier 1: Monthly VIP ($29/mo) -->
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
            <div class="price-subtext">Billed monthly · Cancel anytime with 1 click · 14-Day Refund Policy</div>
            <ul class="price-list">
              ${c.t1Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <a class="btn btn-primary lemonsqueezy-button" id="cardMonthlyBtn" data-tom-paid-plan="monthly" data-ls-product-uuid="d5e7e761-8b1b-4ca8-b1fe-771acd1450f8" href="${lsMonthly}" style="justify-content:center; min-height:64px; padding:14px 18px; width:100%; font-size:1.06rem; font-weight:800; border-radius:12px;">
              ${c.t1Btn}
            </a>
            <div style="margin-top:9px; font-size:0.82rem; color:#e2e8f0; font-weight:700; text-align:center; line-height:1.4;">
              ${c.t1PayNote}
            </div>
            ${checkoutFallbackHtml}
          </div>
        </div>

        <!-- Tier 2: Annual VIP ($199/yr) -->
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
            <div class="price-subtext">Annual recurring license ($199/yr) · Cancel anytime · 14-Day Refund Policy</div>
            <div class="price-savings-pill">⚡ Save $149/Yr vs $29/mo Monthly Billing ($199/yr vs $348/yr)</div>
            <ul class="price-list">
              ${c.t2Items.map((item) => `<li>${checkSvg}<span>${item}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <a class="btn btn-emerald lemonsqueezy-button" id="cardLtdBtn" data-tom-paid-plan="annual" data-ls-product-uuid="667aa482-f17c-47d1-b7f3-a2427c36516b" href="${lsAnnual}" style="justify-content:center; min-height:64px; padding:14px 18px; width:100%; font-size:1.06rem; font-weight:800; border-radius:12px;">
              ${c.t2Btn}
            </a>
            <div style="margin-top:9px; font-size:0.82rem; color:#a7f3d0; font-weight:700; text-align:center; line-height:1.4;">
              ${c.t2PayNote}
            </div>
            ${checkoutFallbackHtml}
          </div>
        </div>
      </div>

      <!-- MANDATORY PERMANENT EDUCATIONAL SOFTWARE DISCLAIMER -->
      <div id="tomPricingDisclaimerBox" role="note" style="max-width:980px; margin:16px auto 0; padding:14px 18px; border-radius:10px; background:rgba(15,23,42,0.9); border:1.5px solid rgba(251,191,36,0.45); color:#f8fafc; font-size:0.94rem; line-height:1.62; text-align:left;">
        Disclaimer: TruthOfMarket provides self-directed educational data visualization and mathematical portfolio calculators only. Nothing on this site constitutes personalized investment, financial, legal, or tax advice.
      </div>

      <!-- Instant Auto-Unlock Note & Collapsible Device License Restore -->
      <div style="max-width:980px; margin:12px auto 0; text-align:center;">
        <div style="font-size:0.84rem; color:#34d399; font-weight:700; margin-bottom:10px;">
          ${c.autoUnlockNote}
        </div>
        <details style="background:#0b1120; border:1px solid rgba(148,163,184,0.22); border-radius:10px; padding:10px 16px; text-align:left;">
          <summary style="cursor:pointer; font-size:0.84rem; font-weight:700; color:#93c5fd; list-style:none;">
            ${c.restoreSummary} ▾
          </summary>
          <div style="margin-top:10px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; font-size:0.82rem; color:#cbd5e1;">
            <span>Already have a Lemon Squeezy receipt key on another computer or phone? Restore your VIP session with 1 click:</span>
            <button type="button" class="btn btn-sm" onclick="var b=document.getElementById('btnOpenLicense');if(b){b.click();}else{var m=document.getElementById('licenseModal');if(m)m.style.display='flex';}" style="font-weight:700; border-color:rgba(147,197,253,0.45); color:#93c5fd;">
              ${c.restoreBtn} →
            </button>
          </div>
        </details>
      </div>

      <!-- Trust & Security Micro-Ribbon -->
      <div class="pricing-trust-ribbon" style="max-width:980px; margin:16px auto 0;">
        <div class="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Merchant of Record: <b>Lemon Squeezy, LLC (Store #296100)</b></span>
        </div>
        <div class="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>14-Day No-Questions-Asked Refund Policy</span>
        </div>
        <div class="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Self-Directed Educational Calculator Software</span>
        </div>
      </div>

      <!-- Separated Lower Footer Section: Tier 3 Partner Tools & Public Channels -->
      <details style="max-width:980px; margin:18px auto 0; background:rgba(15,23,42,0.55); border:1px solid var(--border-card); border-radius:10px; padding:12px 18px;">
        <summary style="cursor:pointer; font-size:0.82rem; font-weight:700; color:#94a3b8; display:flex; align-items:center; justify-content:space-between; gap:8px;">
          <span>🔗 ${c.t3Title}</span>
          <span style="font-size:0.74rem; color:#64748b;">Expand Charting Tools &amp; Community ▾</span>
        </summary>
        <div style="margin-top:14px; padding-top:12px; border-top:1px solid rgba(148,163,184,0.14);">
          <p style="color:var(--muted); font-size:0.82rem; margin:0 0 10px; line-height:1.5;">
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
              ${state.isProUnlocked ? "👑 Open VIP Educational Research Desk ↗" : c.tgBtn}
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
