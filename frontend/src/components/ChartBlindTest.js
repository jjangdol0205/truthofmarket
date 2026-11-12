import { formatCheckoutUrl } from "../services/api.js";

/**
 * Interactive 15-Second Wall Street Chart Blind Test & $10,000 Dip-Buyer vs Quant Battle
 * Designed as the primary Shorts/Reels -> Web traffic magnet on truthofmarket.com.
 */

const BLIND_TEST_I18N = {
  en: {
    badge: "🎯 VIRAL SHORTS CHALLENGE · 15-SECOND WALL STREET CHART BLIND TEST",
    title: "Can You Beat 92% of Retail Dip-Buyers? Spot the Real Institutional Breakout vs. Bull Trap",
    subtitle:
      "Most investors lose money buying 'cheap' stocks below their 60-day moving average (Left-Side Knife). Test your Quant IQ on 3 live anonymized S&P 500 / Nasdaq setups right now.",
    roundLabel: "ROUND",
    allRoundsView: "ALL 3 ROUNDS INTERACTIVE CHALLENGE",
    scoreBadgePrefix: "YOUR QUANT IQ:",
    answeredCountSuffix: "/ 3 SOLVED",
    resetBtn: "↻ Reset Challenge",
    jumpDocBtn: "🩺 Test My Own Stock Below",
    buyBtn: "🟢 RIGHT-SIDE BREAKOUT (Ignition)",
    trapBtn: "🔴 SUB-MA60 DOWNTREND (Trap)",
    correctTag: "✅ QUANT REGIME MATCHED!",
    wrongTag: "❌ LEFT-SIDE DRAWDOWN ZONE:",
    revealTickerLabel: "REVEALED LIVE TICKER",
    battleTitle: "📊 $10,000 HISTORICAL BACKTEST COMPARISON: SUB-MA60 DIP-BUYING VS. PW-RSI MODEL",
    retailSideTitle: "❌ Sub-MA60 Dip-Buying (-18% Below MA60)",
    retailSideDesc: "Averages into sub-MA60 downtrends ($NVDA / $SMCI / $COIN) without risk caps. Unhedged tail drawdowns erode multi-year returns.",
    quantSideTitle: "🟢 RightSideAlpha PW-RSI + Volume Model",
    quantSideDesc: "Filters for MA60 reclaim + ≥1.4x institutional volume surge with a modeled -9.0% risk boundary (-1.35% portfolio allocation cap).",
    vipUnlockBannerTitle: "🔥 ROUND 3 FEATURED A 3.41x VOLUME ANOMALY — UNLOCK ALL 72 QUANT FACTOR DATASETS & PINE SCRIPT",
    vipUnlockBannerSub:
      "Public preview displays #1 Showcase ($CELH · 2.46x Vol). Pro License holders unlock the complete 72-stock factor matrix, Pine Script v5 source code, and 26-year historical CSV datasets.",
    unlockMonthlyBtn: "👑 Unlock #2 & #3 VIP Tickers ($29/mo)",
    unlockLifetimeBtn: "💎 Lifetime VIP All-Access ($199)",
  },
  kr: {
    badge: "🎯 쇼츠·릴스 실전 챌린지 · 15초 월스트리트 차트 블라인드 테스트",
    title: "개미 92%가 속는 '떨어지는 칼날' vs '기관 수급 폭발 우측 돌파' — 당신은 구분할 수 있습니까?",
    subtitle:
      "대부분의 개인 투자자는 60일 이평선(MA60) 아래에서 '싸 보인다'는 이유로 물타기하다 계좌가 녹아내립니다. 지금 실전 72종목 중 익명 처리된 3개 차트에서 BUY(우측 돌파)와 TRAP(좌측 함정)을 직접 판별해 보세요.",
    roundLabel: "라운드",
    allRoundsView: "3단계 실전 차트 블라인드 테스트",
    scoreBadgePrefix: "나의 퀀트 IQ:",
    answeredCountSuffix: "/ 3 완료",
    resetBtn: "↻ 다시 테스트하기",
    jumpDocBtn: "🩺 내 보유종목 3초 무료 진단",
    buyBtn: "🟢 지금 매수 (우측 수급 돌파 · IGNITION)",
    trapBtn: "🔴 매수 금지 / 함정 (떨어지는 칼날 · TRAP)",
    correctTag: "✅ 월스트리트 퀀트 정답!",
    wrongTag: "❌ 개미 함정 주의! 이유를 확인하세요:",
    revealTickerLabel: "실제 종목 공개",
    battleTitle: "💰 $10,000(약 1,400만 원) 실전 계좌 비교: 좌측 물타기 개미 vs 우측 퀀트 엔진",
    retailSideTitle: "❌ 일반 개인 투자자 '고점 대비 낙폭과대 물타기'",
    retailSideDesc: "MA60 아래 역배열 종목($NVDA·$SMCI·$COIN 등)을 손절 없이 매수 → 단 한 번의 -48% 하락으로 3년 수익 반납",
    quantSideTitle: "🟢 RightSideAlpha PW-RSI + 기관 거래량 돌파",
    quantSideDesc: "MA60 탈환 + 기관 거래량 1.4배~3.4배 폭발 확인 후 진입 & -9.0% 기계적 손절(계좌 대비 -1.35% 리스크 고정)",
    vipUnlockBannerTitle: "🔥 방금 3라운드에서 보신 '거래량 3.41배 폭발(Score 98)' 주인공을 지금 즉시 언락하세요",
    vipUnlockBannerSub:
      "무료 회원은 #1 대표 쇼케이스($CELH · 거래량 2.46배)만 공개됩니다. 지금 VIP를 구독하시면 오늘 기관 수급이 3.41배·3.17배 폭발한 #2·#3 히든 돌파 종목과 72종목 전체 매수·손절·목표가를 즉시 확인하실 수 있습니다.",
    unlockMonthlyBtn: "👑 #2·#3 히든 급등주 즉시 언락 ($29/월)",
    unlockLifetimeBtn: "💎 평생 VIP 무제한 패스 ($199)",
  },
  jp: {
    badge: "🎯 ショート動画連動 · 15秒ウォール街チャート・ブラインドテスト",
    title: "個人投資家の92%が騙される「落ちるナイフ」vs「機関投資家の右側ブレイク」を見抜けますか？",
    subtitle:
      "60日移動平均線(MA60)の下で「安くなったから」と逆張りナンピンすると資金が塩漬けになります。実在する米国株72銘柄から匿名化された3つの実戦チャートで、あなたのクオンツIQを今すぐ診断してください。",
    roundLabel: "ラウンド",
    allRoundsView: "全3問 実践チャート・ブラインドテスト",
    scoreBadgePrefix: "あなたのクオンツIQ:",
    answeredCountSuffix: "/ 3 完了",
    resetBtn: "↻ もう一度挑戦",
    jumpDocBtn: "🩺 保有銘柄を3秒無料診断",
    buyBtn: "🟢 今すぐ買い (右側ブレイク · IGNITION)",
    trapBtn: "🔴 見送り・罠 (落ちるナイフ · TRAP)",
    correctTag: "✅ クオンツ正解！機関投資家の視点です:",
    wrongTag: "❌ 個人投資家の罠！理由を確認:",
    revealTickerLabel: "実際の銘柄を公開",
    battleTitle: "💰 $10,000 実戦口座シミュレーション：左側逆張りナンピン vs 右側PW-RSIクオンツ",
    retailSideTitle: "❌ 個人投資家の逆張りナンピン (MA60割れ)",
    retailSideDesc: "MA60の下で下落中の銘柄($NVDA/$SMCI/$COIN等)を損切りなしで買い下がり、1回の暴落で資産半減",
    quantSideTitle: "🟢 RightSideAlpha PW-RSI + 出来高急増ブレイク",
    quantSideDesc: "MA60奪還＋機関出来高1.4倍〜3.4倍爆発を確認してエントリー＆-9.0%機械的損切り(口座リスク-1.35%限定)",
    vipUnlockBannerTitle: "🔥 第3問の「出来高3.41倍爆発(スコア98)」銘柄を含むVIP限定シグナルを今すぐアンロック",
    vipUnlockBannerSub:
      "無料プレビューでは#1ショーケース($CELH・出来高2.46倍)のみ公開中。Pro VIPに参加すると、本日出来高3.41倍・3.17倍を記録した#2・#3銘柄と全72銘柄のエントリー・損切り・利確ラインが即座に解放されます。",
    unlockMonthlyBtn: "👑 #2・#3 VIP銘柄をアンロック ($29/月)",
    unlockLifetimeBtn: "💎 永久VIPフルアクセス ($199)",
  },
};

function buildRoundsData(state) {
  const stocks = Array.isArray(state.stocks) ? state.stocks : [];
  const findTicker = (tkr, fallback) => stocks.find((s) => s.ticker === tkr) || fallback;

  const nvda = findTicker("NVDA", {
    ticker: "NVDA",
    name_en: "NVIDIA Corp",
    sector: "Semiconductors",
    close: 178.67,
    score: 45.0,
    vol_surge_10d: 0.92,
    dd_high52_pct: -26.0,
    vs_ma60_pct: -18.3,
    zone_code: "LEFT_SIDE_KNIFE",
  });

  const celh = findTicker("CELH", {
    ticker: "CELH",
    name_en: "Celsius Holdings",
    sector: "Consumer Growth",
    close: 33.19,
    score: 84.0,
    vol_surge_10d: 2.46,
    dd_high52_pct: -44.2,
    vs_ma60_pct: 12.7,
    entry_price: 29.45,
    stop_loss_price: 30.2,
    target_1_price: 66.38,
    zone_code: "IGNITION_ZONE",
  });

  const fslr = findTicker("FSLR", {
    ticker: "FSLR",
    name_en: "First Solar Inc",
    sector: "Clean Energy / AI Power",
    close: 191.61,
    score: 98.0,
    vol_surge_10d: 3.41,
    dd_high52_pct: -31.5,
    vs_ma60_pct: 16.4,
    entry_price: 184.2,
    stop_loss_price: 174.37,
    target_1_price: 287.42,
    zone_code: "IGNITION_ZONE",
  });

  const lang = state.lang || "en";
  const isPro = Boolean(state.isProUnlocked);

  return [
    {
      id: "r1",
      roundNum: 1,
      mysteryTitle:
        lang === "kr"
          ? "익명 종목 A · AI 반도체 대형주 (고점 대비 -26.0% 하락)"
          : lang === "jp"
          ? "匿名銘柄 A · AI半導体大型株 (高値比 -26.0% 下落)"
          : "MYSTERY STOCK A · AI Mega-Cap (-26.0% Off 52W High)",
      chartType: "LEFT_TRAP",
      correctAnswer: "TRAP",
      metrics: [
        { label: "52W Drawdown", value: `${Number(nvda.dd_high52_pct || -26.0).toFixed(1)}%`, color: "#f87171" },
        { label: "Price vs MA60", value: `${Number(nvda.vs_ma60_pct || -18.3).toFixed(1)}% (Below)`, color: "#f87171" },
        { label: "10D Vol Surge", value: `${Number(nvda.vol_surge_10d || 0.92).toFixed(2)}x (Weak)`, color: "#94a3b8" },
        { label: "Quant Score", value: `${Number(nvda.score || 45).toFixed(0)} / 100`, color: "#fbbf24" },
      ],
      revealedTicker: `$${nvda.ticker} ($${Number(nvda.close || 178.67).toFixed(2)})`,
      revealedBadge: "🔴 LEFT_SIDE_KNIFE · FALLING KNIFE TRAP",
      explanation:
        lang === "kr"
          ? `정답은 [매수 금지 / 함정]입니다! 실제 종목은 $${nvda.ticker}($${Number(nvda.close || 178.67).toFixed(2)})입니다. 명성이 높은 AI 대장주라도 주가가 60일 이평선(MA60)보다 -18.3% 아래에 있고 기관 거래량(0.92x)이 실리지 않은 상태는 전형적인 '좌측 떨어지는 칼날'입니다. 우측에서 MA60을 탈환할 때까지 현금을 지켜야 합니다.`
          : lang === "jp"
          ? `正解は【見送り・罠(TRAP)】です！実際の銘柄は $${nvda.ticker} ($${Number(nvda.close || 178.67).toFixed(2)})。どんな有名AI株でも、株価がMA60より-18.3%下にあり機関出来高(0.92x)が伴っていない状態は「落ちるナイフ」です。右側でMA60を奪還するまで待機が鉄則です。`
          : `Correct call is AVOID / TRAP! This is $${nvda.ticker} at $${Number(nvda.close || 178.67).toFixed(2)}. Even a world-class AI leader is a Left-Side Falling Knife when trading -18.3% below a declining 60-day moving average with 0.92x volume. Wait for the Right-Side MA60 reclaim.`,
    },
    {
      id: "r2",
      roundNum: 2,
      mysteryTitle:
        lang === "kr"
          ? "익명 종목 B · 바닥 다지기 후 MA60 +12.7% 돌파 & 거래량 2.46배"
          : lang === "jp"
          ? "匿名銘柄 B · 底固め後にMA60を+12.7%突破＆出来高2.46倍"
          : "MYSTERY STOCK B · Base Washout + MA60 Reclaim (+12.7%) & 2.46x Vol",
      chartType: "RIGHT_IGNITION_1",
      correctAnswer: "BUY",
      metrics: [
        { label: "Price vs MA60", value: `+${Math.abs(Number(celh.vs_ma60_pct || 12.7)).toFixed(1)}% (Reclaimed)`, color: "#34d399" },
        { label: "10D Vol Surge", value: `${Number(celh.vol_surge_10d || 2.46).toFixed(2)}x (Surge!)`, color: "#34d399" },
        { label: "Quant Score", value: `${Number(celh.score || 84).toFixed(0)} / 100`, color: "#38bdf8" },
        { label: "Stop-Loss Rule", value: `-9.0% ($${Number(celh.stop_loss_price || 30.2).toFixed(2)})`, color: "#fbbf24" },
      ],
      revealedTicker: `$${celh.ticker} ($${Number(celh.close || 33.19).toFixed(2)}) — #1 FREE SHOWCASE`,
      revealedBadge: "🟢 IGNITION_ZONE · INSTITUTIONAL ACCUMULATION",
      explanation:
        lang === "kr"
          ? `정답은 [지금 매수(우측 수급 돌파)]입니다! 오늘 무료 대표 쇼케이스 종목인 $${celh.ticker}($${Number(celh.close || 33.19).toFixed(2)})로, 좌측 투매 구간을 끝내고 60일선을 +12.7% 상향 돌파하며 10일 평균 대비 2.46배의 기관 거래량이 폭발했습니다. 손절선 -9.0%($${Number(celh.stop_loss_price || 30.2).toFixed(2)})와 1차 목표가 $${Number(celh.target_1_price || 66.38).toFixed(2)}(+100%)의 손익비 5.5:1 타점입니다.`
          : lang === "jp"
          ? `正解は【今すぐ買い(右側ブレイク)】です！本日の無料ショーケース銘柄 $${celh.ticker} ($${Number(celh.close || 33.19).toFixed(2)})。底固めを終えてMA60を+12.7%上抜け、機関投資家の出来高が2.46倍に急増しました。損切り-9.0% ($${Number(celh.stop_loss_price || 30.2).toFixed(2)})・目標株価 $${Number(celh.target_1_price || 66.38).toFixed(2)} の高リスクリワード局面です。`
          : `Correct regime is RIGHT-SIDE BREAKOUT! This is today's #1 Public Showcase $${celh.ticker} ($${Number(celh.close || 33.19).toFixed(2)}). After base consolidation, it reclaimed MA60 (+12.7%) on 2.46x institutional volume (modeled -9.0% risk band $${Number(celh.stop_loss_price || 30.2).toFixed(2)}, 2x excursion band $${Number(celh.target_1_price || 66.38).toFixed(2)}).`,
    },
    {
      id: "r3",
      roundNum: 3,
      mysteryTitle:
        lang === "kr"
          ? "익명 종목 C · 오늘 72종목 중 기관 거래량 1위 (3.41배 폭발 · Score 98)"
          : lang === "jp"
          ? "匿名銘柄 C · 本日72銘柄中トップの機関出来高3.41倍爆発 (スコア98)"
          : "MYSTERY STOCK C · #1 Volume Anomaly in Universe (3.41x Surge · Score 98)",
      chartType: "RIGHT_IGNITION_2",
      correctAnswer: "BUY",
      metrics: [
        { label: "Price vs MA60", value: `+${Math.abs(Number(fslr.vs_ma60_pct || 16.4)).toFixed(1)}% (Breakout)`, color: "#34d399" },
        { label: "10D Vol Surge", value: `${Number(fslr.vol_surge_10d || 3.41).toFixed(2)}x (#1 Rank)`, color: "#10b981" },
        { label: "Quant Score", value: `${Number(fslr.score || 98).toFixed(0)} / 100 (Top 1%)`, color: "#f59e0b" },
        { label: "Portfolio Risk", value: "-1.35% Max Risk", color: "#38bdf8" },
      ],
      revealedTicker: isPro
        ? `$${fslr.ticker} ($${Number(fslr.close || 191.61).toFixed(2)}) — PRO UNLOCKED`
        : "🔒 $████ (Score 98 · Vol 3.41x · Pro Factor Rank #2)",
      revealedBadge: "🔥 SCORE 98/100 · EXTREME INSTITUTIONAL IGNITION",
      explanation: isPro
        ? lang === "kr"
          ? `정답은 [우측 수급 돌파(IGNITION)]입니다! Pro 언락 종목인 $${fslr.ticker}($${Number(fslr.close || 191.61).toFixed(2)})로, 퀀트 점수 98점·기관 거래량 3.41배가 동시에 기록된 최상위 팩터 셋업입니다.`
          : `Correct regime is RIGHT-SIDE BREAKOUT! Pro Terminal displays $${fslr.ticker} ($${Number(fslr.close || 191.61).toFixed(2)}) — Factor Score 98/100 with a 3.41x institutional volume expansion.`
        : lang === "kr"
        ? `정답은 [우측 수급 돌파(IGNITION)]입니다! 이 종목은 72종목 유니버스에서 퀀트 점수 98점·기관 거래량 3.41배를 기록한 Pro 팩터 셋업입니다. 아래 Pro 라이선스($29/월 또는 $199 평생권)로 전체 데이터셋과 Pine Script 지표를 언락하세요.`
        : lang === "jp"
        ? `正解は【右側ブレイク(IGNITION)】です！この銘柄は72銘柄の中でスコア98・機関出来高3.41倍を記録したProファクター銘柄です。下のProパス($29/月または$199永久パス)で全データセットとPine Scriptを解放できます。`
        : `Correct regime is RIGHT-SIDE BREAKOUT! This chart is today's #2 Pro Factor Setup scoring 98/100 with a 3.41x institutional volume expansion. Unlock the full 72-stock factor matrix, historical CSV, and Pine Script v5 license below.`,
    },
  ];
}

function renderMiniChartSvg(chartType, isRevealed) {
  if (chartType === "LEFT_TRAP") {
    // Downtrend chart below declining MA60 with weak volume and red bull-trap arrow
    return `
      <svg viewBox="0 0 360 145" width="100%" height="145" style="display:block; background:#070b14; border:1px solid rgba(239,68,68,0.28); border-radius:6px;">
        <defs>
          <linearGradient id="ma60TrapGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#ef4444" stop-opacity="0.95"/>
          </linearGradient>
        </defs>
        <!-- Grid lines -->
        <line x1="0" y1="32" x2="360" y2="32" stroke="rgba(148,163,184,0.1)" stroke-dasharray="3,3"/>
        <line x1="0" y1="72" x2="360" y2="72" stroke="rgba(148,163,184,0.1)" stroke-dasharray="3,3"/>
        <line x1="0" y1="110" x2="360" y2="110" stroke="rgba(148,163,184,0.15)"/>
        <!-- Declining MA60 Line -->
        <path d="M 15 24 Q 140 38, 240 58 T 345 76" fill="none" stroke="url(#ma60TrapGrad)" stroke-width="2.5"/>
        <text x="14" y="18" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="700">MA60 (Declining Resistance)</text>
        <!-- Falling Candlesticks below MA60 -->
        <g stroke-width="1.5">
          <line x1="35" y1="22" x2="35" y2="44" stroke="#ef4444"/><rect x="31" y="26" width="8" height="14" fill="#ef4444"/>
          <line x1="65" y1="34" x2="65" y2="56" stroke="#ef4444"/><rect x="61" y="38" width="8" height="15" fill="#ef4444"/>
          <line x1="95" y1="42" x2="95" y2="68" stroke="#ef4444"/><rect x="91" y="46" width="8" height="18" fill="#ef4444"/>
          <line x1="125" y1="52" x2="125" y2="70" stroke="#10b981"/><rect x="121" y="55" width="8" height="10" fill="#10b981"/>
          <line x1="155" y1="48" x2="155" y2="78" stroke="#ef4444"/><rect x="151" y="52" width="8" height="22" fill="#ef4444"/>
          <line x1="185" y1="68" x2="185" y2="92" stroke="#ef4444"/><rect x="181" y="72" width="8" height="16" fill="#ef4444"/>
          <line x1="215" y1="74" x2="215" y2="88" stroke="#10b981"/><rect x="211" y="76" width="8" height="9" fill="#10b981"/>
          <line x1="245" y1="64" x2="245" y2="82" stroke="#10b981"/><rect x="241" y="67" width="8" height="11" fill="#10b981"/>
          <line x1="275" y1="70" x2="275" y2="96" stroke="#ef4444"/><rect x="271" y="73" width="8" height="19" fill="#ef4444"/>
          <line x1="305" y1="84" x2="305" y2="104" stroke="#ef4444"/><rect x="301" y="87" width="8" height="14" fill="#ef4444"/>
        </g>
        <!-- Decision Circle -->
        <circle cx="305" cy="94" r="14" fill="rgba(251,191,36,0.14)" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,2"/>
        <text x="323" y="98" fill="${isRevealed ? "#f87171" : "#fbbf24"}" font-size="10" font-family="monospace" font-weight="800">${
      isRevealed ? "TRAP (-18.3%)" : "BUY or TRAP?"
    }</text>
        <!-- Volume Bars (Weak) -->
        <g fill="rgba(148,163,184,0.35)">
          <rect x="31" y="126" width="8" height="14"/><rect x="61" y="124" width="8" height="16"/>
          <rect x="91" y="122" width="8" height="18"/><rect x="121" y="130" width="8" height="10"/>
          <rect x="151" y="120" width="8" height="20"/><rect x="181" y="125" width="8" height="15"/>
          <rect x="211" y="131" width="8" height="9"/><rect x="241" y="130" width="8" height="10"/>
          <rect x="271" y="126" width="8" height="14"/><rect x="301" y="128" width="8" height="12" fill="#f87171"/>
        </g>
        <text x="14" y="122" fill="#94a3b8" font-size="8.5" font-family="monospace">VOL: 0.92x (No Institutional Bid)</text>
      </svg>
    `;
  }

  const volLabel = chartType === "RIGHT_IGNITION_2" ? "VOL SURGE: 3.41x (#1 IN UNIVERSE!)" : "VOL SURGE: 2.46x (INSTITUTIONAL BUY)";
  const maLabel = chartType === "RIGHT_IGNITION_2" ? "+16.4% Above MA60" : "+12.7% Above MA60";

  // Right-side washout -> flat base -> MA60 reclaim + towering green volume bars
  return `
    <svg viewBox="0 0 360 145" width="100%" height="145" style="display:block; background:#070b14; border:1px solid rgba(16,185,129,0.35); border-radius:6px;">
      <!-- Grid lines -->
      <line x1="0" y1="32" x2="360" y2="32" stroke="rgba(148,163,184,0.1)" stroke-dasharray="3,3"/>
      <line x1="0" y1="72" x2="360" y2="72" stroke="rgba(148,163,184,0.1)" stroke-dasharray="3,3"/>
      <line x1="0" y1="110" x2="360" y2="110" stroke="rgba(148,163,184,0.15)"/>
      <!-- Curving Upward MA60 Line -->
      <path d="M 15 48 Q 130 88, 220 76 T 345 52" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
      <text x="14" y="18" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="700">MA60 Reclaimed (${maLabel})</text>
      <!-- Left Washout -> Base -> Right-Side Breakout Candlesticks -->
      <g stroke-width="1.5">
        <line x1="35" y1="45" x2="35" y2="68" stroke="#ef4444"/><rect x="31" y="48" width="8" height="16" fill="#ef4444"/>
        <line x1="65" y1="62" x2="65" y2="86" stroke="#ef4444"/><rect x="61" y="65" width="8" height="17" fill="#ef4444"/>
        <line x1="95" y1="78" x2="95" y2="96" stroke="#ef4444"/><rect x="91" y="80" width="8" height="12" fill="#ef4444"/>
        <line x1="125" y1="82" x2="125" y2="95" stroke="#10b981"/><rect x="121" y="84" width="8" height="8" fill="#10b981"/>
        <line x1="155" y1="80" x2="155" y2="92" stroke="#10b981"/><rect x="151" y="82" width="8" height="7" fill="#10b981"/>
        <line x1="185" y1="74" x2="185" y2="88" stroke="#10b981"/><rect x="181" y="76" width="8" height="9" fill="#10b981"/>
        <line x1="215" y1="62" x2="215" y2="80" stroke="#10b981"/><rect x="211" y="64" width="8" height="13" fill="#10b981"/>
        <line x1="245" y1="46" x2="245" y2="68" stroke="#10b981"/><rect x="241" y="48" width="8" height="17" fill="#10b981"/>
        <line x1="275" y1="34" x2="275" y2="54" stroke="#10b981"/><rect x="271" y="36" width="8" height="15" fill="#10b981"/>
        <line x1="305" y1="20" x2="305" y2="44" stroke="#34d399"/><rect x="300" y="22" width="10" height="19" fill="#10b981"/>
      </g>
      <!-- Glowing Ignition Decision Circle -->
      <circle cx="305" cy="31" r="15" fill="rgba(16,185,129,0.18)" stroke="#34d399" stroke-width="2" stroke-dasharray="3,2"/>
      <text x="225" y="18" fill="#34d399" font-size="9.5" font-family="monospace" font-weight="800">${
    isRevealed ? "🟢 IGNITION CONFIRMED!" : "⚡ RIGHT-SIDE BREAKOUT?"
  }</text>
      <!-- Volume Bars with Massive Emerald Surge on Right -->
      <g fill="rgba(148,163,184,0.32)">
        <rect x="31" y="128" width="8" height="12"/><rect x="61" y="126" width="8" height="14"/>
        <rect x="91" y="130" width="8" height="10"/><rect x="121" y="132" width="8" height="8"/>
        <rect x="151" y="133" width="8" height="7"/><rect x="181" y="130" width="8" height="10"/>
        <rect x="211" y="124" width="8" height="16" fill="rgba(16,185,129,0.6)"/>
        <rect x="241" y="117" width="8" height="23" fill="#10b981"/>
        <rect x="271" y="114" width="8" height="26" fill="#10b981"/>
        <rect x="300" y="109" width="10" height="31" fill="#34d399"/>
      </g>
      <text x="14" y="122" fill="#34d399" font-size="8.5" font-family="monospace" font-weight="800">${volLabel}</text>
    </svg>
  `;
}

export function renderChartBlindTest(state) {
  const lang = state.lang && BLIND_TEST_I18N[state.lang] ? state.lang : "en";
  const copy = BLIND_TEST_I18N[lang];
  const rounds = buildRoundsData(state);
  const answers = state.blindTestAnswers || {};
  const isPro = Boolean(state.isProUnlocked);

  let solvedCount = 0;
  let correctCount = 0;
  rounds.forEach((r) => {
    const userPick = answers[r.id];
    if (userPick) {
      solvedCount += 1;
      if (userPick === r.correctAnswer) {
        correctCount += 1;
      }
    }
  });

  const iqScore = solvedCount === 0 ? "—" : `${Math.round((correctCount / solvedCount) * 100)} / 100`;
  const cfg = state.config || {};
  const monthlyUrl = formatCheckoutUrl(
    cfg.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
  );
  const lifetimeUrl = formatCheckoutUrl(
    cfg.ls_site1_ltd_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b"
  );

  return `
    <div id="chartBlindTestSection" style="margin-top:16px; background:linear-gradient(180deg, rgba(15,23,42,0.97) 0%, rgba(7,11,20,0.99) 100%); border:1px solid rgba(245,158,11,0.45); border-radius:10px; padding:18px; box-shadow:0 14px 36px rgba(0,0,0,0.45);">
      <!-- Header Strip -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:14px; padding-bottom:12px; border-bottom:1px solid rgba(148,163,184,0.16);">
        <div style="max-width:760px;">
          <div style="display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:0.69rem; font-weight:800; color:#fbbf24; background:rgba(245,158,11,0.14); border:1px solid rgba(245,158,11,0.4); padding:3px 10px; border-radius:999px; margin-bottom:6px;">
            <span>${copy.badge}</span>
          </div>
          <h2 style="font-size:1.12rem; font-weight:800; color:#ffffff; margin:0 0 5px 0; line-height:1.35;">
            ${copy.title}
          </h2>
          <p style="font-size:0.8rem; color:#cbd5e1; margin:0; line-height:1.5;">
            ${copy.subtitle}
          </p>
        </div>

        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <div id="blindTestIqBadge" class="mono" style="background:rgba(16,185,129,0.14); border:1px solid rgba(16,185,129,0.4); color:#34d399; padding:6px 11px; border-radius:6px; font-size:0.74rem; font-weight:800;">
            ${copy.scoreBadgePrefix} <span style="color:#ffffff;">${iqScore}</span> (${solvedCount} ${copy.answeredCountSuffix})
          </div>
          <button type="button" id="btnResetBlindTest" class="btn btn-sm" style="background:rgba(30,41,59,0.85); border:1px solid var(--border); color:#cbd5e1; font-size:0.72rem; padding:6px 10px; cursor:pointer;">
            ${copy.resetBtn}
          </button>
          <button type="button" id="btnBlindTestJumpDoctor" class="btn btn-sm" style="background:rgba(56,189,248,0.16); border:1px solid rgba(56,189,248,0.45); color:#38bdf8; font-size:0.72rem; font-weight:800; padding:6px 10px; cursor:pointer;">
            ${copy.jumpDocBtn}
          </button>
        </div>
      </div>

      <!-- 3-Card Interactive Blind Chart Grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(290px, 1fr)); gap:14px; margin-bottom:16px;">
        ${rounds
          .map((r) => {
            const userPick = answers[r.id] || null;
            const isRevealed = Boolean(userPick);
            const isCorrect = userPick === r.correctAnswer;

            return `
              <div class="blind-test-round-card" data-round-id="${r.id}" style="background:#0b1120; border:1px solid ${
              isRevealed ? (isCorrect ? "rgba(16,185,129,0.55)" : "rgba(239,68,68,0.55)") : "rgba(148,163,184,0.22)"
            }; border-radius:8px; padding:13px; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:8px;">
                    <span class="mono" style="font-size:0.68rem; font-weight:800; color:#fbbf24; background:rgba(245,158,11,0.14); padding:2px 8px; border-radius:4px;">
                      ${copy.roundLabel} ${r.roundNum} / 3
                    </span>
                    <span class="mono" style="font-size:0.68rem; font-weight:700; color:${
                      isRevealed ? (isCorrect ? "#34d399" : "#f87171") : "#94a3b8"
                    };">
                      ${isRevealed ? (isCorrect ? "🟢 +100 QUANT IQ" : "🔴 TRAP TRIGGERED") : "⏳ AWAITING YOUR CALL"}
                    </span>
                  </div>

                  <div style="font-size:0.84rem; font-weight:800; color:#ffffff; margin-bottom:8px; line-height:1.35;">
                    ${r.mysteryTitle}
                  </div>

                  <!-- Animated/Interactive SVG Mini-Chart -->
                  <div style="margin-bottom:10px;">
                    ${renderMiniChartSvg(r.chartType, isRevealed)}
                  </div>

                  <!-- 4 Live Quant Clues -->
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:10px;">
                    ${r.metrics
                      .map(
                        (m) => `
                      <div style="background:#070b14; border:1px solid rgba(148,163,184,0.14); border-radius:5px; padding:5px 8px;">
                        <div class="mono" style="font-size:0.62rem; color:#94a3b8;">${m.label}</div>
                        <div class="mono" style="font-size:0.75rem; font-weight:800; color:${m.color};">${m.value}</div>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>

                <!-- Decision Buttons OR Instant Reveal Panel -->
                <div>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                    <button
                      type="button"
                      class="btn btn-blind-test-pick"
                      data-round="${r.id}"
                      data-pick="BUY"
                      style="padding:8px 6px; font-size:0.73rem; font-family:var(--font-mono); font-weight:800; border-radius:6px; cursor:pointer; background:${
                        userPick === "BUY" ? "rgba(16,185,129,0.28)" : "rgba(16,185,129,0.12)"
                      }; border:1px solid ${userPick === "BUY" ? "#10b981" : "rgba(16,185,129,0.35)"}; color:#34d399;"
                    >
                      ${copy.buyBtn}
                    </button>
                    <button
                      type="button"
                      class="btn btn-blind-test-pick"
                      data-round="${r.id}"
                      data-pick="TRAP"
                      style="padding:8px 6px; font-size:0.73rem; font-family:var(--font-mono); font-weight:800; border-radius:6px; cursor:pointer; background:${
                        userPick === "TRAP" ? "rgba(239,68,68,0.28)" : "rgba(239,68,68,0.12)"
                      }; border:1px solid ${userPick === "TRAP" ? "#ef4444" : "rgba(239,68,68,0.35)"}; color:#fca5a5;"
                    >
                      ${copy.trapBtn}
                    </button>
                  </div>

                  ${
                    isRevealed
                      ? `
                    <div class="blind-test-reveal-box" style="margin-top:10px; padding:10px; border-radius:6px; background:${
                      isCorrect ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)"
                    }; border:1px solid ${isCorrect ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)"};">
                      <div class="mono" style="font-size:0.72rem; font-weight:800; color:${isCorrect ? "#34d399" : "#f87171"}; margin-bottom:4px;">
                        ${isCorrect ? copy.correctTag : copy.wrongTag}
                      </div>
                      <div class="mono" style="font-size:0.78rem; font-weight:800; color:#ffffff; margin-bottom:4px;">
                        ${copy.revealTickerLabel}: <span style="color:#fbbf24;">${r.revealedTicker}</span>
                      </div>
                      <div style="font-size:0.73rem; color:#e2e8f0; line-height:1.45;">
                        ${r.explanation}
                      </div>
                    </div>
                  `
                      : ""
                  }
                </div>
              </div>
            `;
          })
          .join("")}
      </div>

      <!-- $10,000 Real Account Comparison Strip + VIP Conversion Bridge -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:12px; align-items:stretch;">
        <div style="background:#080d19; border:1px solid rgba(148,163,184,0.2); border-radius:8px; padding:12px 14px;">
          <div class="mono" style="font-size:0.7rem; font-weight:800; color:#fbbf24; margin-bottom:8px;">
            ${copy.battleTitle}
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.28); border-radius:6px; padding:9px;">
              <div style="font-size:0.74rem; font-weight:800; color:#fca5a5; margin-bottom:3px;">${copy.retailSideTitle}</div>
              <div class="mono" style="font-size:1.05rem; font-weight:800; color:#f87171; margin-bottom:4px;">$10,000 &rarr; $5,200 (-48%)</div>
              <div style="font-size:0.7rem; color:#94a3b8; line-height:1.4;">${copy.retailSideDesc}</div>
            </div>
            <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.32); border-radius:6px; padding:9px;">
              <div style="font-size:0.74rem; font-weight:800; color:#6ee7b7; margin-bottom:3px;">${copy.quantSideTitle}</div>
              <div class="mono" style="font-size:1.05rem; font-weight:800; color:#34d399; margin-bottom:4px;">$10,000 &rarr; $22,697 (+127%)</div>
              <div style="font-size:0.7rem; color:#94a3b8; line-height:1.4;">${copy.quantSideDesc}</div>
            </div>
          </div>
        </div>

        <div style="background:linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(15,23,42,0.95) 100%); border:1px solid rgba(16,185,129,0.45); border-radius:8px; padding:12px 14px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.8rem; font-weight:800; color:#ffffff; margin-bottom:4px;">
              ${copy.vipUnlockBannerTitle}
            </div>
            <p style="font-size:0.73rem; color:#cbd5e1; margin:0 0 10px 0; line-height:1.45;">
              ${copy.vipUnlockBannerSub}
            </p>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            ${
              isPro
                ? `<span class="mono" style="font-size:0.75rem; font-weight:800; color:#34d399;">👑 PRO VIP ACTIVE — All 72 Tickers Unlocked Below!</span>`
                : `
                  <a
                    href="${monthlyUrl}"
                    class="lemonsqueezy-button btn btn-sm"
                    style="background:#10b981; border:1px solid #059669; color:#052e16; font-weight:800; font-size:0.74rem; padding:7px 12px; border-radius:6px; text-decoration:none;"
                  >
                    ${copy.unlockMonthlyBtn}
                  </a>
                  <a
                    href="${lifetimeUrl}"
                    class="lemonsqueezy-button btn btn-sm"
                    style="background:rgba(245,158,11,0.2); border:1px solid #f59e0b; color:#fbbf24; font-weight:800; font-size:0.74rem; padding:7px 12px; border-radius:6px; text-decoration:none;"
                  >
                    ${copy.unlockLifetimeBtn}
                  </a>
                  <div style="width:100%; font-size:0.69rem; color:#94a3b8; line-height:1.4; margin-top:2px;">
                    Checkout issue in your region? Join <a href="https://t.me/truthofmarketss" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; font-weight:700; text-decoration:underline;">@truthofmarketss</a> or request instant Pro activation via <a href="mailto:beable9489@gmail.com?subject=Instant%20Pro%20Activation%20Request%20(TruthOfMarket)" style="color:#93c5fd; font-weight:700; text-decoration:underline;">email</a>.
                  </div>
                `
            }
          </div>
        </div>
      </div>
    </div>
  `;
}
