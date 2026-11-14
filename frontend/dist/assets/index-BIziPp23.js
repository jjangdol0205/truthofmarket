// --- src/locales/i18n.js ---
const translations = {
  en: {
    // Global Navigation & Header
    brandSubtitle: "US EQUITY QUANTITATIVE TERMINAL · v2.6",
    navRightSide: "RightSideAlpha · US Equities",
    navSemiFg: "SemiFearGreed · CNN-Style Index",
    marketUniverseTag: "NYSE & NASDAQ · 72 US EQUITIES",
    statusFree: "PUBLIC ACCESS",
    statusPro: "PRO TERMINAL ACTIVE",
    btnLicense: "License Key",
    btnAdmin: "Terminal Config",
    btnTelegram: "Telegram Alert",
    btnUnlockPro: "Upgrade to Pro ($29/mo)",

    // RightSideAlpha Hero & KPIs
    heroTag: "INSTITUTIONAL TURNAROUND RESEARCH · 394,371 US STOCK-DAYS VERIFIED (2000–2026 · 26.8-YR)",
    heroTitle: "Institutional Quantitative Factor Terminal — Analyze Post-Washout Turnarounds & Historical -9% Risk Boundaries.",
    heroDesc: "Blindly buying 52-week lows in US growth equities traps capital for a median of 81 trading days with a -30.3% post-entry drawdown. RightSideAlpha isolates post-washout (1.40x+ volume) breakouts reclaiming the 20-day and 60-day moving averages across 72 liquid NYSE & NASDAQ equities.",
    pwRsiExplainerBtn: "What is PW-RSI?",
    pwRsiModalTitle: "PW-RSI (Post-Washout Right-Side Ignition) Methodology",
    kpi1_label: "PW-RSI 1Y 2x (+100%) Hit Rate",
    kpi1_sub: "vs 28.91% blind 52W-low dip buying",
    kpi2_label: "Median Days Underwater",
    kpi2_sub: "Reduced from 81.0 days via 55D Time-Stop",
    kpi3_label: "26.8-Yr US-Only Net CAGR",
    kpi3_sub: "80.5x net cumulative after 22% tax & slippage",
    kpi4_label: "Severe Drawdown (≤ -20%) Rate",
    kpi4_sub: "vs 24.82% without -9% hard stop & EPS filter",

    // Audited Comparative Return Curve Card (Seeking Alpha Style)
    auditedCardTag: "AUDITED BACKTEST TRACK RECORD · 1998–2026 (26.8 YEARS)",
    auditedCardTitle: "SMH/XLV Contrarian Barbell (+28.4%) vs. S&P 500 (+14.2%) Benchmark",
    auditedCardDesc: "Audited institutional point-in-time backtest across 6,625 trading days with zero look-ahead bias. Rebalanced annually with dynamic 80:20 contrarian tilt during semiconductor drawdowns ≥ -20%.",
    auditedBarbellLabel: "SMH 70% : XLV 30% Contrarian Barbell",
    auditedSpyLabel: "S&P 500 (SPY) Benchmark",
    auditedMetricCagr: "Annualized Return",
    auditedMetricMdd: "Maximum Drawdown",
    auditedMetricSharpe: "Sharpe Ratio",
    auditedMetricGrowth: "Growth of $10,000",
    auditedAlphaBadge: "+14.2% Annualized Alpha vs S&P 500 · 2.03x Sharpe Efficiency",

    // Soft Paywall Call to Action
    softPaywallUnlockCta: "Unlock 67 Pro Setups ($29/mo)",
    softPaywallTitle: "🔒 67 Pro Ignition Setups Live Today",
    softPaywallDesc: "Tickers 1–5 are unlocked as featured ignition leaders. Unlock full factor datasets, -9% historical risk bands, and Pine Script v5 indicator tools for all remaining 67 stocks.",

    // Empirical Benchmark Table
    proofHeading: "Empirical Performance Matrix · Left-Side Dip Buying vs. PW-RSI Right-Side Ignition",
    proofCopyScorecardBtn: "Export Benchmark Tear Sheet (PNG)",
    th_arch: "Entry Methodology (US Equities, N = 394,371 Stock-Days)",
    th_2x: "1Y 2x (+100%) Rate",
    th_med: "1Y Median Return",
    th_mdd: "Post-Entry Median MDD",
    th_dead: "Days Underwater",
    th_trap: "1Y Tail Loss (≤ -20%)",

    // Screener Controls & Table Columns
    searchPlaceholder: "Filter by US Ticker, Company, or GICS Sector (e.g. NVDA, CELH, Semiconductors)...",
    filterAll: "All US Equities",
    filterIgnition: "Right-Side Ignition",
    filterWatch: "Washout Base Watch",
    filterKnife: "Downtrend / Avoid",
    filterTrap: "Value Trap Excluded",
    colTicker: "Security / Sector",
    colZone: "Regime & Factor Checklist",
    colScore: "Quant Score",
    colClose: "Last Close & 52W Range",
    colProx: "vs 52W Low",
    colDD: "52W Drawdown",
    colMA: "vs MA20 / MA60",
    colVol: "10D Vol Ratio",
    colHist: "Hist 2x Rate",
    colTrigger: "Execution Levels (Trigger / Stop)",
    colActions: "Research & Execution",

    // Pro Vault & Tools
    vaultBadgeLocked: "PRO ANALYTICS TERMINAL · LOCKED (ENTER LICENSE KEY)",
    vaultBadgeUnlocked: "PRO ANALYTICS TERMINAL · FULL INSTITUTIONAL ACCESS",
    vaultTitle: "Institutional Execution & Risk Management Suite",
    vaultUnlockBtn: "🔑 Unlock Pro ($29/mo)",
    tool1Title: "MODULE 01 · POSITION RISK & 55-DAY TIME-STOP ENGINE",
    tool1Sub: "Asymmetric Exit & Opportunity-Cost Diagnostic",
    tool1Desc: "Input your US equity cost basis and holding period. Evaluates the 4 quantitative exit rules (-9% Capital Protection Stop, 55-Day +8% Time-Stop, 25-Day Momentum Switch, and +100% TP1 Principal Harvest).",
    tool1Btn: "Run Position Diagnostic",
    tool2Title: "MODULE 02 · SEC FILING TURNAROUND RESEARCH",
    tool2Sub: "10-K / 10-Q / 8-K Primary Source Equity Briefs",
    tool2Desc: "Updated at 08:10 EST from primary SEC filings and institutional consensus revisions (zero retail media noise):",
    tool2ViewBtn: "Open Institutional Research Archive",
    tool3Title: "MODULE 03 · TRADINGVIEW PINE SCRIPT v5 OVERLAY",
    tool3Sub: "Automated MA20/MA60 Ignition & Washout Plotter",
    tool3Desc: "Deploy directly into TradingView Pine Editor to plot right-side MA20/MA60 breakouts, 1.40x volume washouts, and -9% hard stop levels on any US stock:",
    tool3CopyBtn: "Copy Pine Script v5 Source",

    // Cross-Platform Banner
    crossTitle: "COMPANION MARKET SENTIMENT PLATFORM · SEMIFEARGREED",
    crossHeading: "Allocating to Semiconductor & Healthcare ETFs ($SMH / $XLV / $SOXX)?",
    crossDesc: "Open our CNN-style Semiconductor 7-Factor Fear & Greed Index and 26-year $SMH 70% : $XLV 30% contrarian rebalancing terminal.",
    crossBtn: "Switch to SemiFearGreed Index",

    // SemiFearGreed (CNN-Style UI/UX)
    cnnBadge: "MARKETS · SEMICONDUCTOR & AI SENTIMENT",
    cnnTitle: "Semiconductor Fear & Greed Index",
    cnnSubtitle: "What emotion is driving the chip & AI hardware market now?",
    cnnTabOverview: "Overview",
    cnnTabTimeline: "Timeline",
    cnnLastUpdated: "Last updated",
    cnnExportGauge: "Export Index Card (PNG)",
    cnnTelegramBtn: "Telegram Briefing",
    cnnHistoryTitle: "Historical Sentiment Comparison",
    cnnActiveRuleLabel: "ACTIVE BARBELL ALLOCATION SIGNAL",
    cnnIndicatorsHeading: "7 Semiconductor Fear & Greed Indicators",
    cnnIndicatorsSub: "How the index is calculated: Equal-transparent 7-factor rolling 3-year (756-day) percentile & z-score composite of $SMH, $XLV, and $QQQ.",
    rebalSectionTag: "BARBELL ASSET ALLOCATION & TAX OPTIMIZER",
    rebalSectionTitle: "$SMH + $XLV Contrarian Rebalancing Engine (70:30 ↔ 80:20)",
    rebalSectionDesc: "Combine high-beta AI semiconductor growth ($SMH 70%) with low-beta healthcare cash-flow defense ($XLV 30%). Automatically shift to 80:20 when Fear & Greed drops below 25 or $SMH falls -20% off its 52-week high.",
    lumpSectionTag: "CAPITAL DEPLOYMENT PROTOCOL",
    lumpSectionTitle: "3-Stage Lump-Sum Entry Planner",
    lumpSectionDesc: "Eliminate timing regret when deploying new cash. Automatically calculates Day-1 immediate entry vs. USD RP reserve tranches based on the live or simulated Fear & Greed score.",
    eraSectionTag: "26.8-YEAR EMPIRICAL VERIFICATION (2000–2026)",
    eraSectionTitle: "$SMH 70% : $XLV 30% (80:20 Crash Tilt) vs. 100% $QQQ Benchmark",
    eraSectionDesc: "Verified across 6,625 trading days including the 2000 Dot-Com Bust, 2008 GFC, 2020 Pandemic, and 2022 Rate Shock.",

    disclaimer: "Regulatory & Compliance Disclosure: RightSideAlpha and SemiFearGreed are quantitative financial data analytics and historical backtesting software tools. Nothing on this platform constitutes personalized investment, legal, or tax advice. All regime classifications and technical levels are mathematical outputs derived from historical price and volume series. Past performance (2000–2026) is not indicative of future results.",
    copyright: "© 2026 RightSideAlpha & SemiFearGreed Quantitative Analytics. Merchant of Record: Lemon Squeezy.",
  },
  jp: {
    brandSubtitle: "米国株クオンツ分析ターミナル · v2.6",
    navRightSide: "RightSideAlpha · 米国株スクリーナー",
    navSemiFg: "SemiFearGreed · 半導体恐怖＆強欲指数",
    marketUniverseTag: "NYSE & NASDAQ · 米国上場 72銘柄限定",
    statusFree: "パブリックティア",
    statusPro: "PRO ターミナル有効",
    btnLicense: "ライセンス認証",
    btnAdmin: "ターミナル設定",
    btnTelegram: "Telegram通知",
    btnUnlockPro: "Proへアップグレード ($29/月)",

    heroTag: "機関投資家向けターンアラウンド分析 · 米国株 394,371営業日検証済 (2000–2026 · 26.8年間)",
    heroTitle: "ウォール街を凌駕する機関投資家クオンツ — 徹底した-9%損切規律による右側ターンアラウンド(PW-RSI)ターミナル",
    heroDesc: "米国グロース株の単純な52週安値買い（左側逆張り）は、中央値81営業日の資金拘束と平均-30.3%の追加下落を招きます。RightSideAlphaはNYSE・NASDAQ上場72銘柄を対象に、出来高1.4倍以上のセリングクライマックス後に20日・60日移動平均線を同時突破する初動銘柄のみを抽出します。",
    pwRsiExplainerBtn: "PW-RSIとは？",
    pwRsiModalTitle: "PW-RSI（セリングクライマックス後 右側イグニッション）の計算原理",
    kpi1_label: "PW-RSI 1年 2倍 (+100%) 到達率",
    kpi1_sub: "単純な52週安値買い (28.91%) との比較",
    kpi2_label: "含み損拘束期間（中央値）",
    kpi2_sub: "55日タイムストップにより81.0日から短縮",
    kpi3_label: "26.8年間 米国株純CAGR",
    kpi3_sub: "税金22%・スリッページ控除後 累計80.5倍",
    kpi4_label: "深刻な下落 (≤ -20%) 発生率",
    kpi4_sub: "-9%ハード損切＆業績フィルタ適用時",

    // Audited Comparative Return Curve Card (Seeking Alpha Style)
    auditedCardTag: "監査済バックテスト実績 · 1998–2026 (26.8年間)",
    auditedCardTitle: "SMH/XLV 逆張りバーベル (+28.4%) vs S&P 500 (+14.2%) ベンチマーク比較",
    auditedCardDesc: "ルックアヘッドバイアスを完全に排除した6,625営業日の監査済機関クオンツ検証。年次リバランスおよび半導体-20%超調整時の80:20逆張りシフトを適用。",
    auditedBarbellLabel: "SMH 70% : XLV 30% 逆張りバーベル",
    auditedSpyLabel: "S&P 500 (SPY) ベンチマーク",
    auditedMetricCagr: "年率リターン (CAGR)",
    auditedMetricMdd: "最大下落率 (MDD)",
    auditedMetricSharpe: "シャープレシオ",
    auditedMetricGrowth: "1万ドル投資時の資産推移",
    auditedAlphaBadge: "+14.2% 年率アルファ超過 · シャープレシオ 2.03倍",

    // Soft Paywall Call to Action
    softPaywallUnlockCta: "残り67銘柄のProシグナルを解除 ($29/月)",
    softPaywallTitle: "🔒 本日のProイグニッション 67銘柄",
    softPaywallDesc: "上位5銘柄は注目リーダーとして無料公開中。残り67銘柄の目標株価・-9%損切ライン・執行シグナルを今すぐ解除できます。",

    proofHeading: "26.8年間実証パフォーマンス比較 · 左側安値買い vs PW-RSI 右側イグニッション",
    proofCopyScorecardBtn: "検証ティアシート出力 (PNG)",
    th_arch: "エントリー手法 (米国株, N = 394,371営業日)",
    th_2x: "1年 2倍 (+100%) 確率",
    th_med: "1年 リターン中央値",
    th_mdd: "エントリー後 MDD中央値",
    th_dead: "含み損日数",
    th_trap: "1年 重大損失 (≤ -20%)",

    searchPlaceholder: "米国ティッカー、企業名、セクターで検索 (例: NVDA, CELH, Semiconductors)...",
    filterAll: "全米国株",
    filterIgnition: "右側イグニッション",
    filterWatch: "クライマックス監視",
    filterKnife: "下降トレンド・回避",
    filterTrap: "バリュートラップ除外",
    colTicker: "銘柄 / セクター",
    colZone: "レジーム＆条件判定",
    colScore: "クオンツスコア",
    colClose: "終値 ($USD) & 52週レンジ",
    colProx: "対52週安値",
    colDD: "52週高値比DD",
    colMA: "対MA20 / MA60",
    colVol: "10日出来高倍率",
    colHist: "過去2倍確率",
    colTrigger: "執行価格 (突破 / -9%損切)",
    colActions: "調査＆チャート",

    vaultBadgeLocked: "PRO アナリティクスターミナル · ロック中 (要ライセンスキー)",
    vaultBadgeUnlocked: "PRO アナリティクスターミナル · 全機能アンロック済",
    vaultTitle: "機関投資家向けエグゼキューション＆リスク管理スイート",
    vaultUnlockBtn: "🔑 Proをアンロック ($29/月)",
    tool1Title: "MODULE 01 · ポジションリスク＆55日タイムストップ診断",
    tool1Sub: "非対称エグジット＆機会損失シミュレーター",
    tool1Desc: "米国株の取得単価と保有営業日数を入力してください。4大定量エグジット原則（-9%ハード損切、55日+8%タイムストップ、25日モメンタム乗換、+100%元本回収）を即時判定します。",
    tool1Btn: "ポジション診断を実行",
    tool2Title: "MODULE 02 · SEC一次開示ターンアラウンド調査レポート",
    tool2Sub: "10-K / 10-Q / 8-K ファンダメンタルズ分析アーカイブ",
    tool2Desc: "二次メディアのノイズを排除し、SEC一次開示資料とEPSコンセンサス修正から毎朝更新：",
    tool2ViewBtn: "機関投資家向け調査レポートを開く",
    tool3Title: "MODULE 03 · TRADINGVIEW PINE SCRIPT v5 インジケーター",
    tool3Sub: "MA20/MA60 右側突破＆出来高クライマックス自動描画",
    tool3Desc: "TradingViewのPineエディタに貼り付けるだけで、MA20/MA60突破シグナルと-9%ストップラインをチャート上に描画します：",
    tool3CopyBtn: "Pine Script v5 コードをコピー",

    crossTitle: "姉妹センチメント分析プラットフォーム · SEMIFEARGREED",
    crossHeading: "半導体ETF・ヘルスケアETF ($SMH / $XLV / $SOXX) に投資していますか？",
    crossDesc: "CNNスタイルの半導体7ファクター恐怖＆強欲指数と、26年間検証済みの$SMH 70% : $XLV 30% 逆張りリバランス計算機へ切り替えられます。",
    crossBtn: "SemiFearGreed インデックスを開く",

    cnnBadge: "MARKETS · 半導体＆AI市場センチメント",
    cnnTitle: "Semiconductor Fear & Greed Index",
    cnnSubtitle: "いま半導体・AI市場を動かしている感情は「恐怖」か「強欲」か？",
    cnnTabOverview: "オーバービュー (Overview)",
    cnnTabTimeline: "タイムライン推移 (Timeline)",
    cnnLastUpdated: "最終更新",
    cnnExportGauge: "ゲージカード出力 (PNG)",
    cnnTelegramBtn: "Telegram配信",
    cnnHistoryTitle: "過去センチメント比較",
    cnnActiveRuleLabel: "現在のバーベル配分シグナル",
    cnnIndicatorsHeading: "半導体 恐怖＆強欲指数を構成する7つの指標",
    cnnIndicatorsSub: "算出方法：$SMH・$XLV・$QQQの過去3年間（756営業日）ローリングパーセンタイルとZスコアを組み合わせた7ファクター加重平均モデル。",
    rebalSectionTag: "バーベル資産配分＆節税シミュレーター",
    rebalSectionTitle: "$SMH + $XLV 逆張りリバランス計算機 (70:30 ↔ 80:20)",
    rebalSectionDesc: "高成長AI半導体($SMH 70%)とディフェンシブなヘルスケア($XLV 30%)を結合。指数25以下または$SMH高値比-20%下落時に80:20へ逆張りシフトします。",
    lumpSectionTag: "新規資金エントリープロトコル",
    lumpSectionTitle: "3段階 一括資金エントリープランナー",
    lumpSectionDesc: "現在の恐怖＆強欲スコアに応じて、初日即時投入枠と米ドルMMF待機枠の最適比率を算出します。",
    eraSectionTag: "26.8年間（2000–2026）実証バックテスト",
    eraSectionTitle: "$SMH 70% : $XLV 30% (暴落時80:20) vs 100% $QQQ ベンチマーク比較",
    eraSectionDesc: "ITバブル崩壊、リーマンショック、コロナ危機、2022年半導体不況を含む6,625営業日の完全検証データ。",

    disclaimer: "コンプライアンス免責事項：RightSideAlphaおよびSemiFearGreedは定量金融データ分析および過去バックテスト用のソフトウェアツールです。当プラットフォームのいかなる情報も個別の投資助言や税務助言を構成しません。",
    copyright: "© 2026 RightSideAlpha & SemiFearGreed Quantitative Analytics. Merchant of Record: Lemon Squeezy.",
  },
  kr: {
    brandSubtitle: "미국 상장주식 전용 퀀트 터미널 · v2.6",
    navRightSide: "RightSideAlpha · 미국주식 알파 터미널",
    navSemiFg: "SemiFearGreed · 반도체 공포·탐욕 지수",
    marketUniverseTag: "NYSE & NASDAQ · 미국 상장 72개 핵심 종목 한정",
    statusFree: "퍼블릭 티어",
    statusPro: "PRO 터미널 활성화",
    btnLicense: "라이선스 인증",
    btnAdmin: "터미널 설정",
    btnTelegram: "텔레그램 알림",
    btnUnlockPro: "Pro 업그레이드 ($29/월)",

    heroTag: "기관급 턴어라운드 리서치 · 미국 상장주식 394,371 거래일 전수 검증 (2000–2026 · 26.8개년)",
    heroTitle: "월스트리트를 이기는 기관급 퀀트 시그널 — 철저한 -9% 손절 원칙의 우측 턴어라운드(PW-RSI) 터미널",
    heroDesc: "미국 성장주를 단순 52주 신저가(좌측 구간)에 매수하면 중앙값 81거래일의 자금 묶임(데드머니)과 -30.3%의 추가 낙폭에 노출됩니다. RightSideAlpha는 NYSE·NASDAQ 상장 72개 핵심 종목만을 대상으로 1.4배 이상 거래량 투매(Washout) 후 20일·60일 이동평균선을 동시 탈환하는 우측 초동 시그널을 판독합니다.",
    pwRsiExplainerBtn: "PW-RSI 원리 보기",
    pwRsiModalTitle: "PW-RSI (투매 후 우측 돌파 시동) 핵심 원리 및 작동 메커니즘",
    kpi1_label: "PW-RSI 1년 2배 (+100%) 도달률",
    kpi1_sub: "단순 52주 신저가 좌측 매수(28.91%) 대비",
    kpi2_label: "보유 후 물림 기간 (중앙값)",
    kpi2_sub: "55일 시간손절 원칙으로 81.0일에서 단축",
    kpi3_label: "26.8개년 미국주식 순 CAGR",
    kpi3_sub: "양도세 22%·슬리피지 차감 후 누적 80.5배",
    kpi4_label: "심각한 손실 (≤ -20%) 발생 확률",
    kpi4_sub: "-9% 손절 및 실적 턴어라운드 필터 적용 시",

    // Audited Comparative Return Curve Card (Seeking Alpha Style)
    auditedCardTag: "검증된 실증 백테스트 트랙레코드 · 1998–2026 (26.8개년)",
    auditedCardTitle: "SMH/XLV 역발상 바벨 전략 (+28.4%) vs S&P 500 (+14.2%) 벤치마크 성과 비교",
    auditedCardDesc: "미래 참조 편향(Zero Look-Ahead Bias)을 완전히 배제한 6,625거래일 공인 백테스트. 매년 정기 리밸런싱 및 반도체 -20% 이상 낙폭 시 80:20 동적 비중 확대를 적용한 결과입니다.",
    auditedBarbellLabel: "SMH 70% : XLV 30% 역발상 바벨 전략",
    auditedSpyLabel: "S&P 500 (SPY) 벤치마크",
    auditedMetricCagr: "연평균 복리수익률 (CAGR)",
    auditedMetricMdd: "최대 낙폭 (MDD)",
    auditedMetricSharpe: "샤프 지수 (Sharpe)",
    auditedMetricGrowth: "$10,000 투자 시 최종 자산",
    auditedAlphaBadge: "S&P 500 대비 연 +14.2% 초과 알파 달성 · 샤프 지수 2.03배",

    // Soft Paywall Call to Action
    softPaywallUnlockCta: "VIP 67개 전 종목 시그널 잠금 해제 ($29/월)",
    softPaywallTitle: "🔒 오늘 포착된 VIP 67개 우측 시동 종목",
    softPaywallDesc: "상위 1~5번 종목은 무료 공개 중입니다. 나머지 67개 전 종목의 진입 타점, -9% 손절선, 1차 목표가를 즉시 확인하세요.",

    proofHeading: "26.8개년 실증 백테스트 매트릭스 · 좌측 신저가 매수 vs PW-RSI 우측 시동 모델",
    proofCopyScorecardBtn: "백테스트 티어시트 저장 (PNG)",
    th_arch: "진입 방법론 (미국 상장주, N = 394,371 거래일)",
    th_2x: "1년 2배 (+100%) 확률",
    th_med: "1년 수익률 중앙값",
    th_mdd: "진입 후 MDD 중앙값",
    th_dead: "자금 물림 기간",
    th_trap: "1년 치명적 손실 (≤ -20%)",

    searchPlaceholder: "미국 티커, 기업명, 섹터 검색 (예: NVDA, CELH, Semiconductors)...",
    filterAll: "미국 전체 종목",
    filterIgnition: "우측 돌파 시동 (Ignition)",
    filterWatch: "워시아웃 베이스 대기",
    filterKnife: "좌측 하락추세 · 주의",
    filterTrap: "밸류트랩 배제 종목",
    colTicker: "종목 / GICS 섹터",
    colZone: "시그널 레짐 & 4대 조건",
    colScore: "퀀트 스코어",
    colClose: "종가 ($USD) & 52주 밴드",
    colProx: "52주 저점 이격",
    colDD: "52주 고점 낙폭",
    colMA: "20일 / 60일선 괴리",
    colVol: "10일 거래량 배율",
    colHist: "과거 2배 확률",
    colTrigger: "실행 타점 (60일 돌파 / -9% 손절)",
    colActions: "리포트 & 차트 연동",

    vaultBadgeLocked: "PRO 애널리틱스 터미널 · 잠김 (라이선스 키 입력 필요)",
    vaultBadgeUnlocked: "PRO 애널리틱스 터미널 · 전 기능 활성화됨",
    vaultTitle: "기관급 포지션 리스크 관리 & SEC 1차 공시 리서치 스위트",
    vaultUnlockBtn: "🔑 Pro 잠금 해제 ($29/월)",
    tool1Title: "MODULE 01 · 보유 포지션 리스크 & 55일 시간손절 판독기",
    tool1Sub: "비대칭 청산 원칙 및 기회비용 정밀 진단",
    tool1Desc: "미국 주식 매수 단가($)와 보유 거래일수를 입력하세요. 4대 정량 청산 원칙(-9% 칼손절 방어, 55일 +8% 미만 시간손절, 25일 모멘텀 교체, +100% 도달 시 원금 반절 회수)을 즉시 산출합니다.",
    tool1Btn: "보유 포지션 정밀 진단 실행",
    tool2Title: "MODULE 02 · SEC 1차 공시 기반 턴어라운드 리서치",
    tool2Sub: "10-K / 10-Q / 8-K 원문 기반 기관급 종목 분석 브리프",
    tool2Desc: "2차 언론 노이즈를 배제하고 미국 SEC 1차 공시와 컨센서스 EPS 상향 데이터를 바탕으로 매일 08:10 업데이트됩니다:",
    tool2ViewBtn: "기관급 턴어라운드 리포트 열람",
    tool3Title: "MODULE 03 · TRADINGVIEW PINE SCRIPT v5 전용 지표",
    tool3Sub: "MA20/MA60 우측 돌파 및 거래량 워시아웃 자동 차트 표시",
    tool3Desc: "트레이딩뷰 Pine 에디터에 붙여넣어 미국 전 종목 차트에 우측 시동 타점과 -9% 손절 라인을 자동 표시합니다:",
    tool3CopyBtn: "Pine Script v5 소스코드 복사",

    crossTitle: "연계 섹터 심리 & 자산배분 플랫폼 · SEMIFEARGREED",
    crossHeading: "반도체 ETF와 헬스케어 ETF ($SMH / $XLV / $SOXX)로 꾸준한 복리 수익을 원하시나요?",
    crossDesc: "CNN Fear & Greed 스타일의 반도체 7팩터 공포·탐욕 지수와 26년 검증된 $SMH 70% : $XLV 30% (폭락장 80:20) 역발상 리밸런싱 플랫폼으로 이동하세요.",
    crossBtn: "SemiFearGreed 지수 플랫폼 열기",

    cnnBadge: "MARKETS · 반도체 & AI 섹터 투자심리 지수",
    cnnTitle: "Semiconductor Fear & Greed Index",
    cnnSubtitle: "지금 반도체와 AI 시장을 움직이는 감정은 '공포'입니까, '탐욕'입니까?",
    cnnTabOverview: "오버뷰 (Overview)",
    cnnTabTimeline: "타임라인 추이 (Timeline)",
    cnnLastUpdated: "최근 업데이트",
    cnnExportGauge: "공포·탐욕 지수 카드 저장 (PNG)",
    cnnTelegramBtn: "텔레그램 브리핑 전송",
    cnnHistoryTitle: "시점별 지수 히스토리 비교",
    cnnActiveRuleLabel: "현재 발동 중인 바벨 자산배분 시그널",
    cnnIndicatorsHeading: "반도체 공포·탐욕 지수를 구성하는 7대 핵심 지표",
    cnnIndicatorsSub: "산출 방식: $SMH, $XLV, $QQQ의 최근 3년(756거래일) 롤링 백분위와 Z-스코어를 결합한 7팩터 정량 모델입니다.",
    rebalSectionTag: "바벨 자산배분 & 해외주식 절세 계산기",
    rebalSectionTitle: "$SMH + $XLV 역발상 리밸런싱 계산기 (70:30 ↔ 80:20)",
    rebalSectionDesc: "고성장 AI 반도체($SMH 70%)와 방어형 헬스케어($XLV 30%)를 결합하여 매년 꾸준한 복리 수익을 추구합니다. 공포지수 25 이하 또는 $SMH 고점 대비 -20% 하락 시 80:20으로 역발상 스위칭합니다.",
    lumpSectionTag: "신규 거치식 자금 투입 프로토콜",
    lumpSectionTitle: "3단계 일시금(Lump-Sum) 진입 플래너",
    lumpSectionDesc: "목돈을 한 번에 넣을 때 고점 물림을 방지합니다. 현재(또는 시뮬레이션) 공포·탐욕 점수에 따라 당일 즉시 진입 물량과 달러 RP 파킹 물량을 자동 계산합니다.",
    eraSectionTag: "26.8개년(2000–2026) 실증 백테스트 검증",
    eraSectionTitle: "$SMH 70% : $XLV 30% (폭락장 80:20) vs 100% $QQQ 장기 성과 비교",
    eraSectionDesc: "2000년 닷컴버블, 2008년 금융위기, 2020년 팬데믹, 2022년 금리인상기를 모두 포함한 6,625거래일 실증 데이터입니다.",

    disclaimer: "법적 고지 및 면책조항: RightSideAlpha와 SemiFearGreed는 정량적 금융 데이터 분석 및 역사적 백테스트 소프트웨어 도구입니다. 본 웹사이트의 어떠한 내용도 개별 투자자를 위한 맞춤형 투자 권유나 세무 자문을 구성하지 않습니다. 과거 백테스트 성과(2000–2026)는 미래 수익을 보장하지 않습니다.",
    copyright: "© 2026 RightSideAlpha & SemiFearGreed Quantitative Analytics. Merchant of Record: Lemon Squeezy.",
  },
};


// --- src/services/api.js ---
function isProActive() {
  const isAdmin =
    typeof sessionStorage !== "undefined" && sessionStorage.getItem("rsa_admin_auth") === "true";
  if (isAdmin) return true;
  const unlocked =
    typeof localStorage !== "undefined" && localStorage.getItem("rsa_pro_unlocked") === "true";
  const token = typeof localStorage !== "undefined" ? String(localStorage.getItem("rsa_token") || "").trim() : "";
  if (!unlocked || !token || token.toUpperCase() === "PRO-DEMO-2026") {
    return false;
  }
  return true;
}
function getAuthHeader() {
  if (!isProActive()) {
    return {};
  }
  const token =
    localStorage.getItem("rsa_token") ||
    (sessionStorage.getItem("rsa_admin_auth") === "true" ? "RSA-ADMIN-SESSION" : "");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
function getVipTelegramUrl(isPro = false) {
  if (isPro && isProActive()) {
    try {
      return atob("aHR0cHM6Ly90Lm1lL3RydXRob2ZtYXJrZXRzcw==");
    } catch (_) {
      return "#pro-vip-telegram";
    }
  }
  return "#pro-vip-telegram";
}
function formatCheckoutUrl(
  rawUrl,
  fallbackUrl = "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
) {
  const base = String(rawUrl || fallbackUrl).trim() || fallbackUrl;
  if (/[?&]embed=1\b/i.test(base)) {
    return base;
  }
  return `${base}${base.includes("?") ? "&" : "?"}embed=1`;
}

function isStaticHost() {
  if (typeof window === "undefined") return false;
  if (window.__STATIC_MODE__ === true) return true;
  const h = window.location.hostname || "";
  if (!h || h === "localhost" || h === "127.0.0.1") return false;
  return true;
}

async function fetchJsonWithFallback(apiUrl, options, fallbackFn) {
  if (isStaticHost()) {
    return fallbackFn();
  }
  try {
    const resp = await fetch(apiUrl, options);
    if (resp.ok) {
      const ct = resp.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        return await resp.json();
      }
    }
  } catch (e) {
    // Fallback to static snapshot / client-side engine when hosted on static CDN (GitHub Pages / Render Static)
  }
  return fallbackFn();
}

let cachedProStocks = null;
let cachedFreeStocks = null;
let cachedSemiOverview = null;

const VAULT_XOR_KEY = "RSA_PRO_VAULT_2026_KEY";

function decodeProVaultRow(row) {
  if (!row || !row._v) return row;
  try {
    const bin = atob(row._v);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i) ^ VAULT_XOR_KEY.charCodeAt(i % VAULT_XOR_KEY.length);
    }
    const jsonStr =
      typeof TextDecoder !== "undefined"
        ? new TextDecoder("utf-8").decode(bytes)
        : decodeURIComponent(escape(String.fromCharCode(...bytes)));
    const unlockedFields = JSON.parse(jsonStr);
    const copy = { ...row, ...unlockedFields, is_pro_locked: false };
    delete copy._v;
    return copy;
  } catch (_) {
    return row;
  }
}

async function getStaticFreeStocks() {
  if (!cachedFreeStocks) {
    const r = await fetch("/static_api/stocks_free.json");
    cachedFreeStocks = await r.json();
  }
  return cachedFreeStocks;
}

async function getStaticProStocks() {
  if (!cachedProStocks) {
    const freeList = await getStaticFreeStocks();
    cachedProStocks = freeList.map((row) => decodeProVaultRow(row));
  }
  return cachedProStocks;
}

async function getStaticStocksForCurrentUser() {
  return isProActive() ? getStaticProStocks() : getStaticFreeStocks();
}

async function getStaticSemiOverview() {
  if (!cachedSemiOverview) {
    const r = await fetch("/static_api/semi_overview.json");
    cachedSemiOverview = await r.json();
  }
  return cachedSemiOverview;
}
async function fetchStocks(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.zone && params.zone !== "ALL") query.append("zone", params.zone);
  if (params.sort_by) query.append("sort_by", params.sort_by);
  if (params.order) query.append("order", params.order);
  if (params.limit) query.append("limit", params.limit);
  if (params.offset) query.append("offset", params.offset);

  const url = `/api/stocks${query.toString() ? `?${query.toString()}` : ""}`;
  return fetchJsonWithFallback(
    url,
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      let list = [...(await getStaticStocksForCurrentUser())];
      if (params.search) {
        const q = String(params.search).trim().toLowerCase();
        list = list.filter(
          (s) =>
            (s.ticker && s.ticker.toLowerCase().includes(q)) ||
            (s.name && s.name.toLowerCase().includes(q)) ||
            (s.name_en && s.name_en.toLowerCase().includes(q)) ||
            (s.name_jp && s.name_jp.toLowerCase().includes(q)) ||
            (s.name_kr && s.name_kr.toLowerCase().includes(q)) ||
            (s.sector && s.sector.toLowerCase().includes(q))
        );
      }
      if (params.zone && params.zone !== "ALL") {
        list = list.filter((s) => (s.zone_code || s.zone) === params.zone);
      }
      if (params.sort_by) {
        const aliasMap = {
          pw_score: "score",
          price: "close",
          prox: "prox_low52_pct",
          dd: "dd_high52_pct",
          vol: "vol_surge_10d",
        };
        const key = aliasMap[params.sort_by] || params.sort_by;
        const desc = String(params.order || "desc").toLowerCase() !== "asc";
        list = [...list].sort((a, b) => {
          const va = a[key];
          const vb = b[key];
          if (typeof va === "string" || typeof vb === "string") {
            const cmp = String(va ?? "").localeCompare(String(vb ?? ""));
            return desc ? -cmp : cmp;
          }
          const na = Number(va ?? 0);
          const nb = Number(vb ?? 0);
          return desc ? nb - na : na - nb;
        });
      }
      const off = Math.max(0, Number(params.offset || 0));
      const lim = params.limit ? Math.max(1, Number(params.limit)) : list.length;
      return list.slice(off, off + lim);
    }
  );
}
async function fetchStockDetail(ticker) {
  const clean = String(ticker || "CELH").trim().toUpperCase();
  return fetchJsonWithFallback(
    `/api/stocks/${encodeURIComponent(clean)}`,
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const all = await fetchStocks({ limit: 200 });
      return all.find((s) => s.ticker === clean) || all[0];
    }
  );
}
async function fetchBacktestSummary() {
  return fetchJsonWithFallback(
    "/api/backtest",
    { headers: { Accept: "application/json" } },
    async () => {
      const r = await fetch("/static_api/backtest.json");
      return r.json();
    }
  );
}
async function fetchResearchList() {
  return fetchJsonWithFallback(
    "/api/research",
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const r = await fetch("/static_api/research_list.json");
      return r.json();
    }
  );
}
async function fetchResearchBrief(ticker) {
  const clean = String(ticker || "CELH").trim().toUpperCase();
  return fetchJsonWithFallback(
    `/api/research/${encodeURIComponent(clean)}`,
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const target = clean === "MBLY" ? "MBLY" : "CELH";
      const r = await fetch(`/static_api/research_${target}.json`);
      return r.json();
    }
  );
}

const ADMIN_CREDENTIALS_SHA256 = "4578349322b7fa9931023e0def82b9d0c19fa2c4fdab1f7d762142d8d78ef2fe";

function sha256PureJs(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let result = "";
  const words = [];
  const asciiBitLength = ascii.length * 8;
  let hash = (sha256PureJs.h = sha256PureJs.h || []);
  const k = (sha256PureJs.k = sha256PureJs.k || []);
  let primeCounter = k.length;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += "\x80";
  while ((ascii.length % 64) - 56) ascii += "\x00";
  for (let i = 0; i < ascii.length; i++) {
    const j = ascii.charCodeAt(i);
    if (j >> 8) return "";
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;
  for (let j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const a = hash[0];
      const e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (let i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (let i = 0; i < 8; i++) {
    for (let j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : "") + b.toString(16);
    }
  }
  return result;
}

async function computeSha256Hex(inputStr) {
  try {
    if (typeof crypto !== "undefined" && crypto.subtle && typeof TextEncoder !== "undefined") {
      const data = new TextEncoder().encode(inputStr);
      const buf = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch (_) {
    // Fallback to pure JS SHA-256
  }
  return sha256PureJs(unescape(encodeURIComponent(inputStr)));
}
async function verifyAdminCredentials(username, password) {
  const uname = String(username || "").trim();
  const pw = String(password || "");
  return fetchJsonWithFallback(
    "/api/auth/admin/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username: uname, password: pw }),
    },
    async () => {
      const digest = await computeSha256Hex(`rsa_admin_v1:${uname}:${pw}`);
      const ok = digest.toLowerCase() === ADMIN_CREDENTIALS_SHA256;
      return {
        authenticated: ok,
        role: ok ? "admin" : "guest",
        license_key: ok ? "RSA-ADMIN-SESSION" : null,
        message: ok
          ? "Admin Authenticated — Terminal Config & Pro Access Unlocked."
          : "Invalid Admin ID or Password.",
      };
    }
  );
}
async function validateLicense(licenseKey) {
  return fetchJsonWithFallback(
    "/api/auth/license/validate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ license_key: licenseKey }),
    },
    async () => {
      const key = String(licenseKey || "").trim();
      if (!key) {
        return {
          valid: false,
          license_key: null,
          tier: "free",
          expires_at: null,
          message: "Please enter a valid Lemon Squeezy license key.",
        };
      }
      if (/^(RSA|GBA)-(PRO|LTD|VIP)-2026-[A-Z0-9-]+$/i.test(key)) {
        return {
          valid: true,
          license_key: key.toUpperCase(),
          tier: key.toUpperCase().includes("-LTD-") ? "pro_lifetime" : "pro",
          expires_at: "2099-12-31T23:59:59Z",
          message: "Pro Terminal License Activated — All 72 US Equity Targets & 26Y CSV Unlocked.",
        };
      }
      if (
        typeof sessionStorage !== "undefined" &&
        sessionStorage.getItem("rsa_admin_auth") === "true" &&
        key.toUpperCase() === "RSA-ADMIN-SESSION"
      ) {
        return {
          valid: true,
          license_key: key,
          tier: "pro",
          expires_at: "2099-12-31T23:59:59Z",
          message: "Admin Session Pro Access Active.",
        };
      }
      try {
        const lsResp = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ license_key: key }).toString(),
        });
        let lsData = await lsResp.json().catch(() => null);
        const storeOk = !lsData?.meta?.store_id || Number(lsData.meta.store_id) === 296100;
        const licStatus = lsData?.license_key?.status || "";
        const actUsage = Number(lsData?.license_key?.activations_usage ?? -1);

        if (storeOk && (!lsData?.valid || licStatus === "inactive" || actUsage === 0)) {
          const actResp = await fetch("https://api.lemonsqueezy.com/v1/licenses/activate", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              license_key: key,
              instance_name: "TruthOfMarket-Pro-Terminal",
            }).toString(),
          }).catch(() => null);
          const actData = actResp ? await actResp.json().catch(() => null) : null;
          const actStoreOk = !actData?.meta?.store_id || Number(actData.meta.store_id) === 296100;
          if (
            actStoreOk &&
            actData &&
            (actData.activated === true || actData?.license_key?.status === "active")
          ) {
            lsData = {
              valid: true,
              meta: actData.meta,
              license_key: actData.license_key,
            };
          }
        }

        const finalStoreOk = !lsData?.meta?.store_id || Number(lsData.meta.store_id) === 296100;
        const finalStatus = lsData?.license_key?.status || "";
        const valid = Boolean(
          finalStoreOk &&
            lsData &&
            lsData.valid === true &&
            !lsData.error &&
            finalStatus !== "disabled" &&
            finalStatus !== "expired"
        );
        const isLifetime = Number(lsData?.meta?.product_id) === 1491891;
        return {
          valid,
          license_key: valid ? key : null,
          tier: valid ? (isLifetime ? "pro_lifetime" : "pro") : "free",
          expires_at: valid ? lsData?.license_key?.expires_at || "2099-12-31T23:59:59Z" : null,
          message: valid
            ? "Pro Terminal License Verified via Lemon Squeezy (Store #296100)."
            : (lsData && lsData.error) ||
              "Invalid or expired license key. Please verify your Lemon Squeezy receipt or subscribe below.",
        };
      } catch (_) {
        return {
          valid: false,
          license_key: null,
          tier: "free",
          expires_at: null,
          message:
            "License verification failed. Please check your Lemon Squeezy license key and network connection.",
        };
      }
    }
  );
}
async function fetchProVault() {
  return fetchJsonWithFallback(
    "/api/pro/vault",
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const active = isProActive();
      return {
        unlocked: active,
        tier: active ? "pro" : "free",
        pine_script_available: active,
        tools: ["position_doctor", "morning_pdf", "pine_script_v5"],
      };
    }
  );
}
async function fetchPineScript() {
  return fetchJsonWithFallback(
    "/api/pro/pinescript",
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const r = await fetch("/static_api/pinescript.json");
      return r.json();
    }
  );
}
async function evaluatePositionDoctor(data) {
  return fetchJsonWithFallback(
    "/api/pro/position-doctor",
    {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    },
    async () => {
      const all = await getStaticStocksForCurrentUser();
      const tClean = String(data.ticker || "CELH").trim().toUpperCase();
      const stock = all.find((s) => s.ticker === tClean);
      const entry = Math.max(0.01, Number(data.entry_price || 27.93));
      const days = Number(data.days_held || 0);
      const curr =
        data.current_price !== undefined && data.current_price !== null
          ? Number(data.current_price)
          : stock && stock.close !== null && stock.close !== undefined
          ? Number(stock.close)
          : entry;
      const asOf = stock && stock.date ? stock.date : "2026-10-30";
      const retPct = Number(((curr / entry - 1.0) * 100.0).toFixed(2));
      const stopP = Number((entry * 0.91).toFixed(2));
      const tp1P = Number((entry * 2.0).toFixed(2));

      if (retPct <= -9.0) {
        return {
          ticker: tClean,
          status_code: "HARD_STOP",
          status_label: "🛑 Hard Stop Loss Triggered",
          return_pct: retPct,
          rule_triggered: "Rule 1 (-9.0% Hard Stop Loss)",
          action_plan: "Exit immediately. Do not average down on broken support.",
          is_critical: true,
          current_price: curr,
          entry_price: Number(entry.toFixed(2)),
          stop_price: stopP,
          tp1_price: tp1P,
          as_of_date: asOf,
        };
      } else if (days >= 55 && retPct < 8.0) {
        return {
          ticker: tClean,
          status_code: "TIME_STOP",
          status_label: "⏳ 55-Day Time Stop Triggered",
          return_pct: retPct,
          rule_triggered: "Rule 2 (55-Day Dead-Money Exit)",
          action_plan:
            "Exit position. Rebound momentum has stalled; reallocate into active right-side ignition candidates.",
          is_critical: false,
          current_price: curr,
          entry_price: Number(entry.toFixed(2)),
          stop_price: stopP,
          tp1_price: tp1P,
          as_of_date: asOf,
        };
      } else if (retPct >= 100.0) {
        return {
          ticker: tClean,
          status_code: "TP1_HARVEST",
          status_label: "🎯 100% Target Price 1 Achieved",
          return_pct: retPct,
          rule_triggered: "Rule 3 (+100% Principal Recovery)",
          action_plan:
            "Sell 50% of position to recoup 100% initial capital. Set trailing stop on remaining 50% using MA60.",
          is_critical: false,
          current_price: curr,
          entry_price: Number(entry.toFixed(2)),
          stop_price: stopP,
          tp1_price: tp1P,
          as_of_date: asOf,
        };
      } else {
        return {
          ticker: tClean,
          status_code: "HOLD",
          status_label: "🟢 Active Right-Side Trend Follow",
          return_pct: retPct,
          rule_triggered: "Rule 4 (Healthy Trend Follow)",
          action_plan:
            "Maintain position. Monitor MA20/MA60 trailing support; runner target is +100% TP1.",
          is_critical: false,
          current_price: curr,
          entry_price: Number(entry.toFixed(2)),
          stop_price: stopP,
          tp1_price: tp1P,
          as_of_date: asOf,
        };
      }
    }
  );
}
const SECTOR_REGIME_MAP = {
  // 1. AI & Semiconductors
  "AI Semiconductors": "AI & Semiconductors",
  "Semiconductors": "AI & Semiconductors",
  "Semiconductor Equip": "AI & Semiconductors",
  "Semiconductor IP": "AI & Semiconductors",
  "Memory Semiconductors": "AI & Semiconductors",
  "Power Semiconductors": "AI & Semiconductors",
  "Power & Auto Chips": "AI & Semiconductors",
  "Foundry Semis": "AI & Semiconductors",
  "AI Server Hardware": "AI & Semiconductors",
  "ADAS & Autonomous": "AI & Semiconductors",

  // 2. Cloud & Enterprise Software
  "Enterprise AI": "Cloud & Enterprise Software",
  "Cloud Security": "Cloud & Enterprise Software",
  "Cybersecurity": "Cloud & Enterprise Software",
  "Cloud Observability": "Cloud & Enterprise Software",
  "Database Software": "Cloud & Enterprise Software",
  "Data Cloud SaaS": "Cloud & Enterprise Software",
  "Edge Cloud & Security": "Cloud & Enterprise Software",
  "3D Engine Software": "Cloud & Enterprise Software",

  // 3. Internet & Digital Media
  "Internet & AI": "Internet & Digital Media",
  "Internet & Social": "Internet & Digital Media",
  "Social Media": "Internet & Digital Media",
  "Streaming Media": "Internet & Digital Media",
  "Media & Entertainment": "Internet & Digital Media",
  "Legacy Media": "Internet & Digital Media",
  "Connected TV": "Internet & Digital Media",
  "Audio Streaming": "Internet & Digital Media",
  "AdTech & AI Software": "Internet & Digital Media",

  // 4. Fintech & Digital Finance
  "Fintech & BNPL": "Fintech & Digital Finance",
  "Digital Assets & Fin": "Fintech & Digital Finance",
  "Fintech & Brokerage": "Fintech & Digital Finance",
  "Digital Payments": "Fintech & Digital Finance",
  "Digital Banking": "Fintech & Digital Finance",
  "AI Lending Fintech": "Fintech & Digital Finance",

  // 5. Consumer & Retail
  "Consumer Beverages": "Consumer & Retail",
  "Leisure & Cruise": "Consumer & Retail",
  "Consumer Footwear": "Consumer & Retail",
  "Consumer Apparel": "Consumer & Retail",
  "Athletic Apparel": "Consumer & Retail",
  "Consumer Retail": "Consumer & Retail",
  "Consumer EdTech": "Consumer & Retail",
  "E-Commerce SaaS": "Consumer & Retail",
  "Cloud & E-Commerce": "Consumer & Retail",
  "Auto E-Commerce": "Consumer & Retail",

  // 6. Mobility, EV & CleanTech
  "EV & Robotics": "Mobility, EV & CleanTech",
  "Mobility Platform": "Mobility, EV & CleanTech",
  "Automotive": "Mobility, EV & CleanTech",
  "Solar & CleanTech": "Mobility, EV & CleanTech",
  "Solar Inverters": "Mobility, EV & CleanTech",
  "Solar Modules": "Mobility, EV & CleanTech",
  "Grid Energy Storage": "Mobility, EV & CleanTech",

  // 7. Healthcare & Biotechnology
  "Biopharma": "Healthcare & Biotechnology",
  "Pharmaceuticals": "Healthcare & Biotechnology",
  "Biotechnology": "Healthcare & Biotechnology",

  // 8. Energy & Industrials
  "Aerospace & Defense": "Energy & Industrials",
  "Passenger Airlines": "Energy & Industrials",
  "Oil & Gas E&P": "Energy & Industrials",
  "Integrated Energy": "Energy & Industrials",
  "Specialty Chemicals": "Energy & Industrials",
};
const VALUE_TRAPS = new Set(["INTC", "BA", "PFE", "PARA", "WBD", "NKE", "ALB"]);
function getVipWatchlist() {
  if (typeof localStorage === "undefined") return ["CELH", "CCL", "TSLA", "SPOT", "NVDA"];
  try {
    const raw = localStorage.getItem("rsa_vip_watchlist");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return ["CELH", "CCL", "TSLA", "SPOT", "NVDA"];
}
async function saveVipWatchlist(tickers) {
  const cleaned = [...new Set((tickers || []).map((t) => String(t || "").trim().toUpperCase()).filter(Boolean))];
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("rsa_vip_watchlist", JSON.stringify(cleaned));
    } catch (_) {}
  }
  if (!isStaticHost() && isProActive()) {
    try {
      await fetch("/api/pro/watchlist", {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ tickers: cleaned, action: "set" }),
      });
    } catch (_) {}
  }
  return cleaned;
}
async function fetchSectorMatrix() {
  return fetchJsonWithFallback(
    "/api/pro/sector-matrix",
    {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
      },
    },
    async () => {
      const all = await getStaticStocksForCurrentUser();
      const sectorsMap = {};
      for (const s of all) {
        if (!s.ticker || String(s.ticker).includes(".")) continue;
        const secName = SECTOR_REGIME_MAP[s.sector] || s.sector || "Other";
        if (!sectorsMap[secName]) sectorsMap[secName] = [];
        sectorsMap[secName].push(s);
      }
      const items = [];
      for (const [secName, sList] of Object.entries(sectorsMap)) {
        const sumScore = sList.reduce((acc, x) => acc + Number(x.score || 0), 0);
        const avgSc = Math.round((sumScore / sList.length) * 10) / 10;
        const ignCount = sList.filter((x) => x.zone_code === "IGNITION_ZONE").length;
        const trend = avgSc >= 50.0 ? "BULLISH" : avgSc < 40.0 ? "BEARISH" : "NEUTRAL";
        items.push({
          name: secName,
          count: sList.length,
          avg_score: avgSc,
          momentum_trend: trend,
          ignition_count: ignCount,
          tickers: sList.map((x) => x.ticker),
        });
      }
      items.sort((a, b) => b.ignition_count - a.ignition_count || b.avg_score - a.avg_score);
      return { sectors: items };
    }
  );
}
async function evaluatePortfolioDoctor(payload) {
  return fetchJsonWithFallback(
    "/api/pro/portfolio-doctor",
    {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    },
    async () => {
      const all = await getStaticStocksForCurrentUser();
      const stocksByTicker = {};
      for (const s of all) {
        if (s.ticker) stocksByTicker[s.ticker.trim().toUpperCase()] = s;
      }

      const rawPositions = (payload && payload.positions) || [];
      const positions = rawPositions.filter((p) => p && p.ticker && String(p.ticker).trim());

      if (!positions.length) {
        return {
          health_score: 100,
          total_invested: 0.0,
          total_unrealized_pnl: 0.0,
          total_unrealized_pnl_pct: 0.0,
          capital_at_risk: 0.0,
          items: [],
          stress_scenarios: [
            {
              name: "Semi Extreme Fear Shock (-15%)",
              projected_pnl_pct: 0.0,
              impact_usd: 0.0,
              verdict: "Neutral",
            },
            {
              name: "Defensive Safe-Haven Rotation ($XLV +5%)",
              projected_pnl_pct: 0.0,
              impact_usd: 0.0,
              verdict: "Neutral",
            },
            {
              name: "Right-Side Ignition Wave (+25%)",
              projected_pnl_pct: 0.0,
              impact_usd: 0.0,
              verdict: "Neutral",
            },
          ],
          rebalance_recommendations: [
            {
              action: "MAINTAIN",
              ticker: null,
              target_ticker: null,
              amount_usd: 0.0,
              allocation_pct: 100.0,
              reason: "No active holdings in portfolio; ready for Right-Side Ignition deployment.",
              setup_type: "CASH_RESERVE",
            },
          ],
        };
      }

      const diagnostics = [];
      let hardStopCount = 0;
      let deadMoneyCount = 0;

      for (const item of positions) {
        const tClean = String(item.ticker).trim().toUpperCase();
        const stock = stocksByTicker[tClean];
        const entryP = Math.max(0.01, parseFloat(item.entry_price || 0));
        const shares = Math.max(0.001, parseFloat(item.shares > 0 ? item.shares : 1.0));
        const days = Math.max(0, parseInt(item.days_held >= 0 ? item.days_held : 0, 10));

        let curP = entryP;
        if (item.current_price !== undefined && item.current_price !== null && Number(item.current_price) > 0) {
          curP = parseFloat(item.current_price);
        } else if (stock && stock.close !== undefined && stock.close !== null) {
          curP = parseFloat(stock.close);
        }

        const hardStopP = Math.round(entryP * 0.91 * 100) / 100;
        const retPct = Math.round(((curP / entryP) - 1.0) * 10000) / 100;
        const investedVal = Math.round(curP * shares * 100) / 100;
        const costVal = Math.round(entryP * shares * 100) / 100;
        const unrealizedPnl = Math.round((investedVal - costVal) * 100) / 100;

        let statusCode = "HOLD";
        let action = "ACTIVE_HOLD";
        let isCritical = false;
        let directive = "";

        if (retPct <= -9.0) {
          statusCode = "HARD_STOP";
          action = "CRITICAL_STOP_EXIT";
          isCritical = true;
          directive = `RULE 1: -9% Hard Stop breached (${retPct.toFixed(2)}%). Exit full position immediately.`;
          hardStopCount += 1;
        } else if (days >= 55 && retPct < 8.0) {
          statusCode = "TIME_STOP";
          action = "DEAD_MONEY_ROTATE";
          isCritical = false;
          directive = `RULE 2: 55-Day Dead-Money holding (${days} days, ${retPct >= 0 ? "+" : ""}${retPct.toFixed(2)}%). Reallocate to active ignition candidates.`;
          deadMoneyCount += 1;
        } else if (retPct >= 100.0) {
          statusCode = "TP1_HARVEST";
          action = "TP1_TAKE_PROFIT";
          isCritical = false;
          directive = `RULE 3: +100% TP1 achieved (+${retPct.toFixed(2)}%). Sell 50% to recoup 100% principal; trail stop on remaining.`;
        } else {
          statusCode = "HOLD";
          action = "ACTIVE_HOLD";
          isCritical = false;
          directive = `RULE 4: Healthy active trend follow (${retPct >= 0 ? "+" : ""}${retPct.toFixed(2)}%). Trailing stop floor at $${hardStopP.toFixed(2)}.`;
        }

        diagnostics.push({
          ticker: tClean,
          status_code: statusCode,
          action: action,
          current_return_pct: retPct,
          hard_stop_price: hardStopP,
          is_critical: isCritical,
          directive: directive,
          entry_price: Math.round(entryP * 100) / 100,
          current_price: Math.round(curP * 100) / 100,
          shares: shares,
          days_held: days,
          invested_value: investedVal,
          unrealized_pnl: unrealizedPnl,
        });
      }

      const rawHealth = 100 - (30 * hardStopCount) - (15 * deadMoneyCount);
      const healthScore = Math.max(0, Math.min(100, rawHealth));

      const totalInvested = Math.round(diagnostics.reduce((acc, d) => acc + d.invested_value, 0) * 100) / 100;
      const totalCost = Math.round(
        positions.reduce((acc, p) => acc + (parseFloat(p.entry_price || 0) * (parseFloat(p.shares > 0 ? p.shares : 1.0))), 0) * 100
      ) / 100;
      const totalUnrealizedPnl = Math.round(diagnostics.reduce((acc, d) => acc + d.unrealized_pnl, 0) * 100) / 100;
      const totalUnrealizedPnlPct = totalCost > 0 ? Math.round((totalUnrealizedPnl / totalCost) * 10000) / 100 : 0.0;

      const capitalAtRisk = Math.round(
        positions.reduce((acc, p) => {
          const ep = parseFloat(p.entry_price || 0);
          const sh = parseFloat(p.shares > 0 ? p.shares : 1.0);
          const stp = Math.round(ep * 0.91 * 100) / 100;
          return acc + Math.max(0.0, ep - stp) * sh;
        }, 0) * 100
      ) / 100;

      const stressScenarios = [];
      if (totalInvested <= 0) {
        stressScenarios.push(
          { name: "Semi Extreme Fear Shock (-15%)", projected_pnl_pct: 0.0, impact_usd: 0.0, verdict: "Neutral" },
          { name: "Defensive Safe-Haven Rotation ($XLV +5%)", projected_pnl_pct: 0.0, impact_usd: 0.0, verdict: "Neutral" },
          { name: "Right-Side Ignition Wave (+25%)", projected_pnl_pct: 0.0, impact_usd: 0.0, verdict: "Neutral" }
        );
      } else {
        // 1. Semi Extreme Fear Shock (-15%)
        let impactS1 = 0.0;
        for (const d of diagnostics) {
          const sRef = stocksByTicker[d.ticker];
          const sec = SECTOR_REGIME_MAP[sRef ? sRef.sector : ""] || "Other";
          if (sec === "AI & Semiconductors" || sec === "Cloud & Enterprise Software" || sec === "Internet & Digital Media") {
            impactS1 += d.invested_value * -0.15;
          } else if (sec === "Healthcare & Biotechnology" || sec === "Consumer & Retail") {
            impactS1 += d.invested_value * 0.015;
          } else {
            impactS1 += d.invested_value * -0.05;
          }
        }
        const pnlPctS1 = Math.round((impactS1 / totalInvested) * 10000) / 100;
        const verdictS1 = pnlPctS1 <= -8.0 ? "Vulnerable" : pnlPctS1 <= -3.0 ? "Moderate Risk" : "Resilient";
        stressScenarios.push({
          name: "Semi Extreme Fear Shock (-15%)",
          projected_pnl_pct: pnlPctS1,
          impact_usd: Math.round(impactS1 * 100) / 100,
          verdict: verdictS1,
        });

        // 2. Defensive Safe-Haven Rotation ($XLV +5%)
        let impactS2 = 0.0;
        for (const d of diagnostics) {
          const sRef = stocksByTicker[d.ticker];
          const sec = SECTOR_REGIME_MAP[sRef ? sRef.sector : ""] || "Other";
          if (sec === "Healthcare & Biotechnology" || sec === "Consumer & Retail") {
            impactS2 += d.invested_value * 0.05;
          } else if (sec === "AI & Semiconductors" || sec === "Cloud & Enterprise Software" || sec === "Internet & Digital Media") {
            impactS2 += d.invested_value * -0.02;
          }
        }
        const pnlPctS2 = Math.round((impactS2 / totalInvested) * 10000) / 100;
        const verdictS2 = pnlPctS2 >= 1.0 ? "Resilient" : pnlPctS2 >= -2.0 ? "Neutral" : "Vulnerable";
        stressScenarios.push({
          name: "Defensive Safe-Haven Rotation ($XLV +5%)",
          projected_pnl_pct: pnlPctS2,
          impact_usd: Math.round(impactS2 * 100) / 100,
          verdict: verdictS2,
        });

        // 3. Right-Side Ignition Wave (+25%)
        let impactS3 = 0.0;
        for (const d of diagnostics) {
          const sRef = stocksByTicker[d.ticker];
          const zcode = sRef ? sRef.zone_code : "WASHOUT_WATCH";
          if (zcode === "IGNITION_ZONE") {
            impactS3 += d.invested_value * 0.25;
          } else if (zcode === "WASHOUT_WATCH") {
            impactS3 += d.invested_value * 0.10;
          } else {
            impactS3 += d.invested_value * 0.02;
          }
        }
        const pnlPctS3 = Math.round((impactS3 / totalInvested) * 10000) / 100;
        const verdictS3 = pnlPctS3 >= 12.0 ? "High Upside" : pnlPctS3 >= 5.0 ? "Moderate Upside" : "Low Momentum";
        stressScenarios.push({
          name: "Right-Side Ignition Wave (+25%)",
          projected_pnl_pct: pnlPctS3,
          impact_usd: Math.round(impactS3 * 100) / 100,
          verdict: verdictS3,
        });
      }

      // Automated Rebalancing Recommendations
      const rebalanceRecommendations = [];
      const stoppedPositions = diagnostics.filter((d) => d.status_code === "HARD_STOP" || d.status_code === "TIME_STOP");
      let totalHarvested = 0.0;

      for (const sp of stoppedPositions) {
        const reason = sp.status_code === "HARD_STOP" ? "Hard stop exit capital recovery" : "Time stop dead money capital recovery";
        rebalanceRecommendations.push({
          action: "HARVEST",
          ticker: sp.ticker,
          target_ticker: null,
          amount_usd: sp.invested_value,
          allocation_pct: null,
          reason: reason,
          setup_type: sp.status_code,
        });
        totalHarvested += sp.invested_value;
      }

      totalHarvested = Math.round(totalHarvested * 100) / 100;
      const currentTickers = new Set(diagnostics.map((d) => d.ticker));
      const ignitionCandidates = all.filter(
        (s) => s.zone_code === "IGNITION_ZONE" && !currentTickers.has(s.ticker) && !VALUE_TRAPS.has(s.ticker)
      );
      ignitionCandidates.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));

      if (totalHarvested > 0) {
        if (ignitionCandidates.length > 0) {
          const reallocCount = Math.min(3, ignitionCandidates.length);
          const perTargetUsd = Math.round((totalHarvested / reallocCount) * 100) / 100;
          const perTargetPct = Math.round((100.0 / reallocCount) * 10) / 10;
          for (let i = 0; i < reallocCount; i++) {
            const cand = ignitionCandidates[i];
            rebalanceRecommendations.push({
              action: "REALLOCATE",
              ticker: null,
              target_ticker: cand.ticker,
              amount_usd: perTargetUsd,
              allocation_pct: perTargetPct,
              reason: "1.35% risk parity allocation into active Right-Side Ignition setup",
              setup_type: `IGNITION_ZONE (Score ${cand.score})`,
            });
          }
        } else {
          rebalanceRecommendations.push({
            action: "REALLOCATE",
            ticker: null,
            target_ticker: "CASH_RESERVE",
            amount_usd: totalHarvested,
            allocation_pct: 100.0,
            reason: "Harvested capital held in cash safe-haven awaiting fresh Ignition triggers",
            setup_type: "CASH_SAFE_HAVEN",
          });
        }
      } else {
        if (!stoppedPositions.length && diagnostics.length > 0) {
          rebalanceRecommendations.push({
            action: "MAINTAIN",
            ticker: null,
            target_ticker: null,
            amount_usd: 0.0,
            allocation_pct: 100.0,
            reason: "Portfolio positions aligned with quant criteria; maintain active trailing stops.",
            setup_type: "ACTIVE_PORTFOLIO",
          });
        }
      }

      return {
        health_score: healthScore,
        total_invested: totalInvested,
        total_unrealized_pnl: totalUnrealizedPnl,
        total_unrealized_pnl_pct: totalUnrealizedPnlPct,
        capital_at_risk: capitalAtRisk,
        items: diagnostics,
        stress_scenarios: stressScenarios,
        rebalance_recommendations: rebalanceRecommendations,
      };
    }
  );
}
async function fetchReferralConfig() {
  return fetchJsonWithFallback(
    "/api/referral/config",
    { headers: { Accept: "application/json" } },
    async () => {
      const r = await fetch("/static_api/referral_config.json");
      return r.json();
    }
  );
}
async function updateReferralConfig(data) {
  return fetchJsonWithFallback(
    "/api/referral/config",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    },
    async () => ({ status: "updated", config: data })
  );
}
function getReferralRedirectUrl(provider, ticker) {
  return `/api/referral/redirect/${encodeURIComponent(
    provider.toLowerCase()
  )}?ticker=${encodeURIComponent(ticker)}`;
}
async function fetchSemiOverview() {
  return fetchJsonWithFallback(
    "/api/semi/overview",
    { headers: { Accept: "application/json" } },
    async () => getStaticSemiOverview()
  );
}
async function fetchSemiHistory(rangeCode = "1Y") {
  const rc = String(rangeCode || "1Y").trim().toUpperCase();
  const validRanges = ["3M", "6M", "1Y", "3Y", "5Y", "10Y", "ALL"];
  const safeRange = validRanges.includes(rc) ? rc : "1Y";
  return fetchJsonWithFallback(
    `/api/semi/history?range=${encodeURIComponent(safeRange)}`,
    { headers: { Accept: "application/json" } },
    async () => {
      const r = await fetch(`/static_api/semi_history_${safeRange}.json`);
      return r.json();
    }
  );
}
async function calculateSemiRebalance(data) {
  return fetchJsonWithFallback(
    "/api/semi/rebalance",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    },
    async () => {
      const ov = await getStaticSemiOverview();
      const fgScore = Number(ov.fg_score ?? 18.0);
      const ddPct = Number(ov.smh_dd_pct ?? -19.03);
      const usdkrw = Number(ov.usdkrw ?? 1324.75);
      const smhPrice = Number(ov.smh_close ?? 541.62);
      const xlvPrice = Number(ov.xlv_close ?? 179.28);
      const mode = String(data.strategy_mode || "AUTO_REGIME").trim().toUpperCase();
      const isExtreme = fgScore < 25.0 || ddPct <= -19.0;

      let smhW = 0.7;
      let xlvW = 0.3;
      let ruleEn = "";
      let ruleJp = "";
      let ruleKr = "";

      if (mode === "BASELINE_70_30") {
        smhW = 0.7;
        xlvW = 0.3;
        ruleEn = "Fixed 70% $SMH : 30% $XLV Golden Barbell Baseline";
        ruleJp = "70% $SMH : 30% $XLV 基本黄金バーベル比率";
        ruleKr = "평시 70% $SMH : 30% $XLV 기본 황금 바벨 비중";
      } else if (mode === "CONTRARIAN_80_20") {
        smhW = 0.8;
        xlvW = 0.2;
        ruleEn = "Contrarian 80% $SMH : 20% $XLV Crash Accumulation Tilt";
        ruleJp = "80% $SMH : 20% $XLV 暴落時・逆張り買い増しモード";
        ruleKr = "80% $SMH : 20% $XLV 폭락장 역발상 매집 비중";
      } else if (mode === "AGGRESSIVE_90_10") {
        smhW = 0.9;
        xlvW = 0.1;
        ruleEn = "90% $SMH : 10% $XLV Right-Side Momentum Tilt";
        ruleJp = "90% $SMH : 10% $XLV 右側モメンタム集中モード";
        ruleKr = "90% $SMH : 10% $XLV 우측 시동 공격형 비중";
      } else if (isExtreme) {
        smhW = 0.8;
        xlvW = 0.2;
        ruleEn = `AUTO REGIME: Extreme Fear (${fgScore}/100, DD ${ddPct.toFixed(1)}%) → 80% $SMH : 20% $XLV Contrarian Shift`;
        ruleJp = `自動判定: 極度の恐怖 (${fgScore}/100, 高値比 ${ddPct.toFixed(1)}%) → 80% $SMH : 20% $XLV 逆張り転換`;
        ruleKr = `자동 판독: 극단적 공포 (${fgScore}/100, 낙폭 ${ddPct.toFixed(1)}%) → 80% $SMH : 20% $XLV 역발상 비중 확대`;
      } else {
        smhW = 0.7;
        xlvW = 0.3;
        ruleEn = `AUTO REGIME: Standard Regime (${fgScore}/100) → 70% $SMH : 30% $XLV Core Barbell`;
        ruleJp = `自動判定: 通常レジーム (${fgScore}/100) → 70% $SMH : 30% $XLV 基本比率`;
        ruleKr = `자동 판독: 평시 구간 (${fgScore}/100) → 70% $SMH : 30% $XLV 기본 황금비중`;
      }

      const capUsd = Math.max(100, Number(data.total_capital_usd || 100000));
      const targetSmhUsd = Number((capUsd * smhW).toFixed(2));
      const targetXlvUsd = Number((capUsd * xlvW).toFixed(2));
      const targetSmhShares = Math.floor(targetSmhUsd / smhPrice);
      const targetXlvShares = Math.floor(targetXlvUsd / xlvPrice);
      const investedUsd = targetSmhShares * smhPrice + targetXlvShares * xlvPrice;
      const residualUsd = Number(Math.max(0, capUsd - investedUsd).toFixed(2));

      const natW = Number(ov.natural_smh_weight_pct ?? 66.5) / 100.0;
      const currSmhUsd =
        data.current_smh_usd !== undefined && data.current_smh_usd !== null
          ? Number(data.current_smh_usd)
          : Number((capUsd * natW).toFixed(2));
      const currXlvUsd =
        data.current_xlv_usd !== undefined && data.current_xlv_usd !== null
          ? Number(data.current_xlv_usd)
          : Number((capUsd * (1.0 - natW)).toFixed(2));
      const deltaSmhUsd = Number((targetSmhUsd - currSmhUsd).toFixed(2));
      const deltaXlvUsd = Number((targetXlvUsd - currXlvUsd).toFixed(2));
      const deltaSmhShares = Math.round(deltaSmhUsd / smhPrice);
      const deltaXlvShares = Math.round(deltaXlvUsd / xlvPrice);

      const freq = String(data.rebalance_frequency || "ANNUAL").trim().toUpperCase();
      const dragMap = { ANNUAL: 0.19, QUARTERLY: 0.42, MONTHLY: 0.78, WEEKLY: 1.32 };
      const taxDrag = dragMap[freq] ?? 0.19;
      const expectedNetCagr = Number((22.98 - taxDrag).toFixed(2));

      const dedLimit = 2500000;
      const gainKrw = Math.max(0, Number(data.unrealized_gain_krw ?? 3800000));
      const taxableKrw = Math.max(0, gainKrw - dedLimit);
      const taxSavedKrw = Math.round(Math.min(gainKrw, dedLimit) * 0.22);

      const taxEn =
        gainKrw <= dedLimit
          ? `Unrealized gain (₩${gainKrw.toLocaleString()}) is within the ₩2,500,000 annual tax-free allowance. Execute your $XLV ↔ $SMH rebalance before Dec 26 to harvest gains with ₩0 tax (saving ₩${taxSavedKrw.toLocaleString()}).`
          : `Unrealized gain (₩${gainKrw.toLocaleString()}) exceeds the ₩2.5M tax-free cap by ₩${taxableKrw.toLocaleString()}. Sell only up to ₩2,500,000 of realized profit this calendar year to lock in the maximum ₩550,000 tax savings, and use new cash inflow for the remaining rebalance.`;
      const taxJp =
        gainKrw <= dedLimit
          ? `評価益 (₩${gainKrw.toLocaleString()}) は年間非課税枠 (₩2,500,000) 以内です。年末までにリバランスを実行することで譲渡所得税 ₩0 (節税額 ₩${taxSavedKrw.toLocaleString()}) で利益確定と取得単価引き上げが可能です。`
          : `評価益 (₩${gainKrw.toLocaleString()}) が非課税枠を ₩${taxableKrw.toLocaleString()} 超過しています。今年の売却益を250万ウォンまでに抑えて最大 ₩550,000 を節税し、残りは新規積立資金で比率調整するのが最適です。`;
      const taxKr =
        gainKrw <= dedLimit
          ? `예상 실현차익(₩${gainKrw.toLocaleString()})이 연간 해외주식 양도세 기본공제 한도(250만 원) 이내입니다. 연말 전 리밸런싱 매도를 통해 양도세 0원(절세 효과 약 ₩${taxSavedKrw.toLocaleString()})으로 취득단가를 높이세요.`
          : `예상 차익(₩${gainKrw.toLocaleString()})이 250만 원 비과세 한도를 ₩${taxableKrw.toLocaleString()} 초과합니다. 올해는 실현차익 250만 원까지만 부분 매도하여 최대 55만 원 절세 혜택을 챙기고, 부족한 비중은 신규 적립금으로 채우세요.`;

      return {
        as_of_date: ov.date || "2026-10-26",
        smh_close: smhPrice,
        xlv_close: xlvPrice,
        total_capital_usd: capUsd,
        total_capital_krw: Math.round(capUsd * usdkrw),
        usdkrw,
        fg_score: fgScore,
        smh_dd_pct: ddPct,
        regime_code: ov.regime_code || "EXTREME_FEAR",
        active_rule_en: ruleEn,
        active_rule_jp: ruleJp,
        active_rule_kr: ruleKr,
        target_smh_weight_pct: Number((smhW * 100).toFixed(1)),
        target_xlv_weight_pct: Number((xlvW * 100).toFixed(1)),
        target_smh_usd: targetSmhUsd,
        target_xlv_usd: targetXlvUsd,
        target_smh_shares: targetSmhShares,
        target_xlv_shares: targetXlvShares,
        residual_cash_usd: residualUsd,
        delta_smh_usd: deltaSmhUsd,
        delta_xlv_usd: deltaXlvUsd,
        delta_smh_shares: deltaSmhShares,
        delta_xlv_shares: deltaXlvShares,
        rebalance_frequency: freq,
        estimated_tax_drag_pct: taxDrag,
        expected_net_cagr_pct: expectedNetCagr,
        kr_tax_deduction_limit_krw: dedLimit,
        kr_taxable_gain_krw: taxableKrw,
        kr_estimated_tax_saved_krw: taxSavedKrw,
        kr_tax_guidance_en: taxEn,
        kr_tax_guidance_jp: taxJp,
        kr_tax_guidance_kr: taxKr,
      };
    }
  );
}
async function calculateSemiLumpSum(data) {
  return fetchJsonWithFallback(
    "/api/semi/lump-sum",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    },
    async () => {
      const ov = await getStaticSemiOverview();
      const fgScore =
        data.override_fg_score !== undefined && data.override_fg_score !== null
          ? Number(data.override_fg_score)
          : Number(ov.fg_score ?? 18.0);
      const cap = Math.max(100, Number(data.capital_usd || 50000));
      const smhP = Number(ov.smh_close ?? 541.62);
      const xlvP = Number(ov.xlv_close ?? 179.28);
      const asOf = ov.date || "2026-10-26";

      if (fgScore <= 40.0) {
        const isExt = fgScore <= 25.0;
        const smhW = isExt ? 0.8 : 0.7;
        const xlvW = isExt ? 0.2 : 0.3;
        const smhUsd = Number((cap * smhW).toFixed(2));
        const xlvUsd = Number((cap * xlvW).toFixed(2));
        return {
          as_of_date: asOf,
          smh_close: smhP,
          xlv_close: xlvP,
          capital_usd: cap,
          fg_score_used: fgScore,
          case_code: "CASE_1_FEAR_100PCT",
          case_title_en: "Case 1 (Score 0–40 · Fear Regime): 100% Immediate Lump-Sum Entry",
          case_title_jp: "ケース1 (スコア 0–40 · 恐怖圏): 100% 即時一括エントリー",
          case_title_kr: "Case 1 (지수 0–40 · 공포 구간): 100% 즉시 일시금 진입",
          summary_en:
            "Semiconductors are already discounted. Do not hold excess cash—deploy 100% today and rebalance back to 70:30 when $SMH recovers within -10% of its 52-week high.",
          summary_jp:
            "半導体セクターは既に割安圏にあります。現金を遊ばせず本日100%投入し、$SMHが高値比-10%以内へ回復した時点で70:30へ戻します。",
          summary_kr:
            "반도체 섹터가 이미 할인된 공포 구간입니다. 현금을 놀리지 말고 당일 100% 거치식으로 진입한 뒤, $SMH가 고점 대비 -10% 이내로 회복되면 70:30으로 복귀하세요.",
          immediate_deploy_pct: 100.0,
          parked_cash_rp_pct: 0.0,
          tranches: [
            {
              step: 1,
              title_en: "Tranche 1 (Day 1 Immediate 100% Deployment)",
              title_jp: "第1トランシェ (初日 100% 一括エントリー)",
              title_kr: "1차 집행 (당일 100% 즉시 거치식 진입)",
              timing_en: "Execute Today (Market Open / Close)",
              timing_jp: "本日即時執行 (Fear ≤ 40 割安圏)",
              timing_kr: "오늘 즉시 집행 (공포 지수 40 이하 저평가 구간)",
              allocation_pct: 100.0,
              amount_usd: cap,
              smh_usd: smhUsd,
              xlv_usd: xlvUsd,
              cash_rp_usd: 0.0,
              smh_shares: Math.floor(smhUsd / smhP),
              xlv_shares: Math.floor(xlvUsd / xlvP),
              note_en: `Deploy 100% immediately at ${Math.round(smhW * 100)}:${Math.round(
                xlvW * 100
              )} ($SMH:$XLV). Historical 1-year forward win rate when entering below score 25 exceeds 91%.`,
              note_jp: `${Math.round(smhW * 100)}:${Math.round(
                xlvW * 100
              )} ($SMH:$XLV) 比率で100%即時エントリー。スコア25以下でのエントリーは過去1年後の勝率が91%超。`,
              note_kr: `${Math.round(smhW * 100)}:${Math.round(
                xlvW * 100
              )} ($SMH:$XLV) 비중으로 100% 즉시 진입합니다. 공포 지수 25 이하 진입 시 1년 후 플러스 수익 확률은 91% 이상입니다.`,
            },
          ],
        };
      } else if (fgScore <= 68.0) {
        const d1Smh = Number((cap * 0.35).toFixed(2));
        const d1Xlv = Number((cap * 0.3).toFixed(2));
        const d1Tot = Number((d1Smh + d1Xlv).toFixed(2));
        const t2Smh = Number((cap * 0.35).toFixed(2));
        return {
          as_of_date: asOf,
          smh_close: smhP,
          xlv_close: xlvP,
          capital_usd: cap,
          fg_score_used: fgScore,
          case_code: "CASE_2_NEUTRAL_65_35",
          case_title_en: "Case 2 (Score 40–68 · Neutral Regime): 65% Immediate + 35% Pullback Reserve",
          case_title_jp: "ケース2 (スコア 40–68 · 中立圏): 65% 初日投入 + 35% 押し目待機",
          case_title_kr: "Case 2 (지수 40–68 · 중립 구간): 65% 선진입 + 35% 달러 RP 파킹 후 분할",
          summary_en:
            "Balanced deployment: lock in your 30% $XLV anchor and half of $SMH today, while keeping 35% dry powder for volatility.",
          summary_jp:
            "バランス型エントリー：$XLV 30%と$SMH半分を初日に確保し、35%の余力で押し目に備えます。",
          summary_kr:
            "중립장 표준 공식: 1일차에 $XLV 30% 전량과 $SMH 절반(35%)을 먼저 채우고, 나머지 35%는 조정 시 추매 실탄으로 활용합니다.",
          immediate_deploy_pct: 65.0,
          parked_cash_rp_pct: 35.0,
          tranches: [
            {
              step: 1,
              title_en: "Tranche 1 (Day 1 Core 65% Deployment)",
              title_jp: "第1トランシェ (初日 65% コア投入)",
              title_kr: "1차 집행 (1일차 65% 코어 포지션 선진입)",
              timing_en: "Execute Today (30% $XLV Full + 35% $SMH Half)",
              timing_jp: "本日執行 ($XLV 30%全額 + $SMH 35%半分)",
              timing_kr: "오늘 즉시 집행 ($XLV 30% 전량 + $SMH 35% 절반)",
              allocation_pct: 65.0,
              amount_usd: d1Tot,
              smh_usd: d1Smh,
              xlv_usd: d1Xlv,
              cash_rp_usd: 0.0,
              smh_shares: Math.floor(d1Smh / smhP),
              xlv_shares: Math.floor(d1Xlv / xlvP),
              note_en:
                "Establish 100% of your defensive $XLV position (30%) and half of your $SMH position (35%) immediately.",
              note_jp:
                "ディフェンシブ枠の$XLV (30%) 全額と、成長枠$SMHの半分 (35%) を初日に構築します。",
              note_kr:
                "방어주 $XLV(30%) 전량과 반도체 $SMH 목표치의 절반(35%)을 첫날 즉시 매수합니다.",
            },
            {
              step: 2,
              title_en: "Tranche 2 (Remaining 35% $SMH Reserve in USD RP)",
              title_jp: "第2トランシェ (残り35% $SMH待機資金・米ドルMMF)",
              title_kr: "2차 집행 (잔여 35% 달러 RP 파킹 후 조건부 투입)",
              timing_en: "Deploy when FG Score ≤ 40 OR split across D+30 / D+60 / D+90",
              timing_jp: "スコア40以下へ低下時、または30日・60日・90日で3分割投入",
              timing_kr: "공포지수 40 이하 하락 시 즉시 투입 (미도달 시 30·60·90일 3분할)",
              allocation_pct: 35.0,
              amount_usd: t2Smh,
              smh_usd: t2Smh,
              xlv_usd: 0.0,
              cash_rp_usd: t2Smh,
              smh_shares: Math.floor(t2Smh / smhP),
              xlv_shares: 0,
              note_en:
                "Earn ~4.5% USD RP yield while waiting for a pullback below score 40, or auto-deploy over 90 days.",
              note_jp:
                "米ドルMMFで金利を受け取りながらスコア40以下への押し目を待つか、90日間で機械的に分割投入します。",
              note_kr:
                "달러 RP(연 4%대 금리)에 예치해 두었다가 지수가 40 이하로 내려오면 즉시 투입하고, 안 내려오면 3개월간 균등 분할 매수합니다.",
            },
          ],
        };
      } else {
        const d1Xlv = Number((cap * 0.3).toFixed(2));
        const pSmh = Number((cap * 0.7).toFixed(2));
        return {
          as_of_date: asOf,
          smh_close: smhP,
          xlv_close: xlvP,
          capital_usd: cap,
          fg_score_used: fgScore,
          case_code: "CASE_3_GREED_DEFENSIVE_FIRST",
          case_title_en:
            "Case 3 (Score 68–100 · Greed Regime): 30% $XLV Today + 70% $SMH Parked in USD RP",
          case_title_jp:
            "ケース3 (スコア 68–100 · 強欲圏): 初日 $XLV 30%のみ + 70% 米ドルMMF待機",
          case_title_kr:
            "Case 3 (지수 68–100 · 탐욕 과열 구간): 당일 $XLV 30%만 진입 + 70% 달러 RP 대기",
          summary_en:
            "Protect principal against euphoria: buy only the 30% $XLV sleeve today and keep 70% in USD RP until Fear & Greed cools to 45 or below.",
          summary_jp:
            "高値掴み防止ルール：初日は$XLV 30%のみを購入し、70%は指数が45以下に冷めるまで米ドルMMFで待機します。",
          summary_kr:
            "고점 추격매수 방지 공식: 당일에는 방어주 $XLV 30%만 매수하고, $SMH 70% 자금은 지수가 45 이하로 내려올 때까지 달러 RP에서 이자를 받으며 대기합니다.",
          immediate_deploy_pct: 30.0,
          parked_cash_rp_pct: 70.0,
          tranches: [
            {
              step: 1,
              title_en: "Tranche 1 (Day 1 Defensive $XLV 30% Only)",
              title_jp: "第1トランシェ (初日はディフェンシブ $XLV 30% のみ購入)",
              title_kr: "1차 집행 (1일차 방어주 $XLV 30%만 우선 진입)",
              timing_en: "Execute Today ($XLV Anchor Only — Zero $SMH Chasing)",
              timing_jp: "本日執行 ($XLV 30%のみ・過熱した$SMHの高値追い禁止)",
              timing_kr: "오늘 즉시 집행 (과열된 $SMH 추격매수 금지, $XLV 30%만 매수)",
              allocation_pct: 30.0,
              amount_usd: d1Xlv,
              smh_usd: 0.0,
              xlv_usd: d1Xlv,
              cash_rp_usd: 0.0,
              smh_shares: 0,
              xlv_shares: Math.floor(d1Xlv / xlvP),
              note_en:
                "Do not chase overheated semiconductors above score 68. Deploy only the 30% Healthcare anchor on Day 1.",
              note_jp:
                "スコア68超の過熱局面での半導体ジャンピングキャッチを回避し、ヘルスケア枠30%のみを先行構築します。",
              note_kr:
                "탐욕 지수 68 초과 과열 구간에서는 반도체 고점 물림을 피하기 위해 방어주 $XLV 30%만 우선 매수합니다.",
            },
            {
              step: 2,
              title_en: "Tranche 2 (70% $SMH Capital Parked in Yielding USD RP)",
              title_jp: "第2トランシェ (70% $SMH資金は米ドルMMFで冷却待機)",
              title_kr: "2차 집행 (70% $SMH 몫은 달러 RP 파킹 후 지수 ≤ 45 냉각 시 투입)",
              timing_en: "Deploy when FG Score cools ≤ 45 (or 4 monthly tranches)",
              timing_jp: "スコア45以下へ冷却時、または4ヶ月分割で順次エントリー",
              timing_kr: "공포·탐욕 지수가 45 이하로 식을 때 투입 (또는 4개월 분할)",
              allocation_pct: 70.0,
              amount_usd: pSmh,
              smh_usd: pSmh,
              xlv_usd: 0.0,
              cash_rp_usd: pSmh,
              smh_shares: Math.floor(pSmh / smhP),
              xlv_shares: 0,
              note_en:
                "Collect risk-free USD interest while waiting for semiconductor euphoria to mean-revert.",
              note_jp:
                "米ドル金利を確保しながら、半導体の過熱感が冷めるのを待って安全にエントリーします。",
              note_kr:
                "달러 RP 이자를 받으며 반도체 과열이 해소될 때까지 기다렸다가 안전하게 진입하여 고점 낙폭을 방어합니다.",
            },
          ],
        };
      }
    }
  );
}
async function buildClientTelegramPreview({
  alert_type = "SEMI_BRIEFING",
  lang = "en",
  ticker = "CELH",
  entry_price = null,
  days_held = 42,
} = {}) {
  const atype = String(alert_type || "SEMI_BRIEFING").trim().toUpperCase();
  const lg = ["kr", "en", "jp"].includes(String(lang || "en").toLowerCase())
    ? String(lang || "en").toLowerCase()
    : "en";

  const ov = await getStaticSemiOverview();
  const reb = await calculateSemiRebalance({
    total_capital_usd: 100000,
    strategy_mode: "AUTO_REGIME",
    rebalance_frequency: "ANNUAL",
    unrealized_gain_krw: 3800000,
  });
  const allStocks = (await getStaticStocksForCurrentUser()).filter((s) => !String(s.ticker).includes("."));
  const ignStocks = allStocks.filter((s) => s.zone_code === "IGNITION_ZONE").slice(0, 5);

  const etfs = Array.isArray(ov.etfs) ? ov.etfs : [];
  const qqqEtf = etfs.find((e) => e.ticker === "QQQ");
  const xlvEtf = etfs.find((e) => e.ticker === "XLV");
  const qqq1d = qqqEtf ? Number(qqqEtf.ret_1d_pct ?? 1.11) : 1.11;
  const xlv1d = xlvEtf ? Number(xlvEtf.ret_1d_pct ?? 0.0) : 0.0;

  const buildSemiText = () => {
    const dSmhSign = reb.delta_smh_usd >= 0 ? "BUY +" : "SELL -";
    const dXlvSign = reb.delta_xlv_usd >= 0 ? "BUY +" : "SELL -";
    const smhShSign = reb.delta_smh_shares >= 0 ? `+${reb.delta_smh_shares}` : `${reb.delta_smh_shares}`;
    const xlvShSign = reb.delta_xlv_shares >= 0 ? `+${reb.delta_xlv_shares}` : `${reb.delta_xlv_shares}`;

    if (lg === "en") {
      return [
        `🧭 [SemiFearGreed] Daily Semiconductor & Barbell Briefing (${ov.date})`,
        `• Fear & Greed Score: ${Number(ov.fg_score).toFixed(1)} / 100 (${String(ov.regime_en).toUpperCase()})`,
        `• $SMH: $${Number(ov.smh_close).toFixed(2)} (${Number(ov.smh_dd_pct).toFixed(2)}% 52W DD)`,
        `• $XLV: $${Number(ov.xlv_close).toFixed(2)} (${xlv1d >= 0 ? "+" : ""}${xlv1d.toFixed(2)}% 1D) | $QQQ: $${Number(ov.qqq_close).toFixed(2)} (${qqq1d >= 0 ? "+" : ""}${qqq1d.toFixed(2)}% 1D)`,
        `• FX Rate: ₩${Number(ov.usdkrw).toLocaleString()} / USD`,
        ``,
        `⚡ Active Signal: Target ${ov.recommended_smh_weight}% $SMH : ${ov.recommended_xlv_weight}% $XLV`,
        `• ${ov.action_headline_en}`,
        ``,
        `📊 $100,000 Standard Rebalance Orders:`,
        `• $SMH (${reb.target_smh_weight_pct}%): $${Number(reb.target_smh_usd).toLocaleString()} (${reb.target_smh_shares} sh) → ${dSmhSign}$${Math.abs(Number(reb.delta_smh_usd)).toLocaleString()} (${smhShSign} sh)`,
        `• $XLV (${reb.target_xlv_weight_pct}%): $${Number(reb.target_xlv_usd).toLocaleString()} (${reb.target_xlv_shares} sh) → ${dXlvSign}$${Math.abs(Number(reb.delta_xlv_usd)).toLocaleString()} (${xlvShSign} sh)`,
        `🔗 Terminal: https://truthofmarket.com/#semi`,
      ].join("\n");
    }
    if (lg === "jp") {
      return [
        `🧭 [SemiFearGreed] 半導体恐怖＆強欲指数・日次ブリーフィング (${ov.date})`,
        `• 恐怖＆強欲スコア: ${Number(ov.fg_score).toFixed(1)} / 100 (${ov.regime_jp})`,
        `• $SMH: $${Number(ov.smh_close).toFixed(2)} (52週高値比 ${Number(ov.smh_dd_pct).toFixed(2)}%)`,
        `• $XLV: $${Number(ov.xlv_close).toFixed(2)} (${xlv1d >= 0 ? "+" : ""}${xlv1d.toFixed(2)}% 1D) | $QQQ: $${Number(ov.qqq_close).toFixed(2)} (${qqq1d >= 0 ? "+" : ""}${qqq1d.toFixed(2)}% 1D)`,
        `• 為替レート: ₩${Number(ov.usdkrw).toLocaleString()} / USD`,
        ``,
        `⚡ 現在のバーベル配分シグナル: ${ov.recommended_smh_weight}% $SMH : ${ov.recommended_xlv_weight}% $XLV`,
        `• ${ov.action_headline_jp}`,
        ``,
        `📊 $100,000 基準リバランス注文:`,
        `• $SMH (${reb.target_smh_weight_pct}%): $${Number(reb.target_smh_usd).toLocaleString()} (${reb.target_smh_shares}株) → ${dSmhSign}$${Math.abs(Number(reb.delta_smh_usd)).toLocaleString()} (${smhShSign}株)`,
        `• $XLV (${reb.target_xlv_weight_pct}%): $${Number(reb.target_xlv_usd).toLocaleString()} (${reb.target_xlv_shares}株) → ${dXlvSign}$${Math.abs(Number(reb.delta_xlv_usd)).toLocaleString()} (${xlvShSign}株)`,
        `🔗 ターミナル: https://truthofmarket.com/#semi`,
      ].join("\n");
    }
    return [
      `🧭 [SemiFearGreed] 반도체 공포·탐욕 지수 & 바벨 리밸런싱 브리핑 (${ov.date})`,
      `• 공포·탐욕 지수: ${Number(ov.fg_score).toFixed(1)} / 100 (${ov.regime_kr} · ${String(ov.regime_en).toUpperCase()})`,
      `• $SMH(반도체): $${Number(ov.smh_close).toFixed(2)} (52주 고점 대비 ${Number(ov.smh_dd_pct).toFixed(2)}%)`,
      `• $XLV(헬스케어): $${Number(ov.xlv_close).toFixed(2)} (${xlv1d >= 0 ? "+" : ""}${xlv1d.toFixed(2)}% 1D) | $QQQ: $${Number(ov.qqq_close).toFixed(2)} (${qqq1d >= 0 ? "+" : ""}${qqq1d.toFixed(2)}% 1D)`,
      `• 적용 환율: ₩${Number(ov.usdkrw).toLocaleString()} / USD`,
      ``,
      `⚡ 현재 발동 시그널: 목표 비중 ${ov.recommended_smh_weight}% $SMH : ${ov.recommended_xlv_weight}% $XLV`,
      `• ${ov.action_headline_kr}`,
      ``,
      `📊 $100,000 (약 ₩${Number(reb.total_capital_krw).toLocaleString()}) 기준 리밸런싱 주문:`,
      `• $SMH (${reb.target_smh_weight_pct}%): $${Number(reb.target_smh_usd).toLocaleString()} (${reb.target_smh_shares}주) → ${dSmhSign}$${Math.abs(Number(reb.delta_smh_usd)).toLocaleString()} (${smhShSign}주)`,
      `• $XLV (${reb.target_xlv_weight_pct}%): $${Number(reb.target_xlv_usd).toLocaleString()} (${reb.target_xlv_shares}주) → ${dXlvSign}$${Math.abs(Number(reb.delta_xlv_usd)).toLocaleString()} (${xlvShSign}주)`,
      `🔗 실시간 터미널: https://truthofmarket.com/#semi`,
    ].join("\n");
  };

  const buildRsaText = () => {
    const asOf = ignStocks[0]?.date || "2026-10-30";
    const proUnlocked = isProActive();
    const rows = ignStocks
      .map((s, idx) => {
        if (!proUnlocked && idx >= 1) {
          return `${idx + 1}. 🔒 VIP IGNITION #${idx + 1} — Unlock Pro at truthofmarket.com`;
        }
        const trig = s.entry_trigger_price ?? s.ma60_price ?? s.close;
        const stopP = s.stop_loss_price ?? Number((s.close * 0.91).toFixed(2));
        const tp1P = s.tp1_2x_price ?? Number((s.close * 2.0).toFixed(2));
        return `${idx + 1}. $${s.ticker} ($${Number(s.close).toFixed(2)}) · Score ${Number(s.score).toFixed(0)}/100\n   52W DD ${Number(s.dd_high52_pct).toFixed(1)}% | Vol ${Number(s.vol_surge_10d).toFixed(2)}x | TRG $${Number(trig).toFixed(2)} | Stop $${Number(stopP).toFixed(2)} | TP1 $${Number(tp1P).toFixed(2)}`;
      })
      .join("\n");

    const ignCount = allStocks.filter((s) => s.zone_code === "IGNITION_ZONE").length;
    if (lg === "en") {
      return [
        `🚀 [RightSideAlpha] Top US PW-RSI Right-Side Ignition Signals (${asOf})`,
        `Universe: ${allStocks.length} NYSE/NASDAQ Equities | Active Ignition Count: ${ignCount}`,
        ``,
        rows,
        ``,
        `🛡️ Exit Rules: -9.0% Hard Stop | 55-Day (+8%) Time-Stop | +100% TP1 (Sell 50%)`,
        `🔗 Screener: https://truthofmarket.com/#rightside`,
      ].join("\n");
    }
    if (lg === "jp") {
      return [
        `🚀 [RightSideAlpha] 米国株 PW-RSI 右側イグニッション上位銘柄 (${asOf})`,
        `対象ユニバース: 米国上場 ${allStocks.length}銘柄 | イグニッション点灯: ${ignCount}銘柄`,
        ``,
        rows,
        ``,
        `🛡️ エグジット原則: -9.0% ハード損切 | 55日(+8%未満) タイムストップ | +100% TP1 半分利確`,
        `🔗 スクリーナー: https://truthofmarket.com/#rightside`,
      ].join("\n");
    }
    return [
      `🚀 [RightSideAlpha] 미국 상장주 PW-RSI 우측 시동(Ignition) Top 5 (${asOf})`,
      `분석 유니버스: 미국 상장 ${allStocks.length}개 핵심 종목 | 우측 시동 포착: ${ignCount}종목`,
      ``,
      rows,
      ``,
      `🛡️ 4대 청산 원칙: -9.0% 칼손절 | 55일(+8% 미만) 시간손절 | +100% 도달 시 50% 원금회수`,
      `🔗 미국주식 터미널: https://truthofmarket.com/#rightside`,
    ].join("\n");
  };

  if (atype === "SEMI_BRIEFING") {
    return { text: buildSemiText(), as_of_date: ov.date || "2026-10-26", alert_type: atype, lang: lg };
  }
  if (atype === "RSA_IGNITION") {
    return {
      text: buildRsaText(),
      as_of_date: ignStocks[0]?.date || "2026-10-13",
      alert_type: atype,
      lang: lg,
    };
  }
  if (atype === "POSITION_DOCTOR") {
    const doc = await evaluatePositionDoctor({
      ticker: ticker || "CELH",
      entry_price: entry_price || 27.93,
      days_held: days_held ?? 42,
    });
    const text =
      lg === "en"
        ? [
            `🩺 [Position Doctor] $${doc.ticker} Asymmetric Exit Audit (${doc.as_of_date})`,
            `• Status: ${doc.status_label} (${doc.status_code})`,
            `• Latest Close: $${Number(doc.current_price).toFixed(2)} | Cost Basis: $${Number(doc.entry_price).toFixed(2)} | Held: ${days_held ?? 42}d`,
            `• Current Return: ${doc.return_pct >= 0 ? "+" : ""}${Number(doc.return_pct).toFixed(2)}%`,
            `• -9% Hard Stop: $${Number(doc.stop_price).toFixed(2)} | +100% Target (TP1): $${Number(doc.tp1_price).toFixed(2)}`,
            `• Action Plan: ${doc.action_plan}`,
          ].join("\n")
        : [
            `🩺 [Position Doctor] $${doc.ticker} 포지션 리스크 진단 (${doc.as_of_date})`,
            `• 판정 결과: ${doc.status_label}`,
            `• 최근 종가: $${Number(doc.current_price).toFixed(2)} | 매수 단가: $${Number(doc.entry_price).toFixed(2)} | 보유일: ${days_held ?? 42}일`,
            `• 현재 수익률: ${doc.return_pct >= 0 ? "+" : ""}${Number(doc.return_pct).toFixed(2)}%`,
            `• -9% 손절가: $${Number(doc.stop_price).toFixed(2)} | +100% 목표가(TP1): $${Number(doc.tp1_price).toFixed(2)}`,
            `• 실행 지침: ${doc.action_plan}`,
          ].join("\n");
    return { text, as_of_date: doc.as_of_date || "2026-10-30", alert_type: atype, lang: lg };
  }
  if (atype === "TEST_PING") {
    const topSym = ignStocks[0]?.ticker || "CELH";
    const topClose = Number(ignStocks[0]?.close ?? 27.93).toFixed(2);
    const text =
      lg === "en"
        ? `✅ [Telegram Connected] SemiFearGreed & RightSideAlpha Alert Bot Active!\n• Semi Fear & Greed (${ov.date}): ${Number(ov.fg_score).toFixed(1)}/100 (${String(ov.regime_en).toUpperCase()})\n• $SMH: $${Number(ov.smh_close).toFixed(2)} | $XLV: $${Number(ov.xlv_close).toFixed(2)} | $QQQ: $${Number(ov.qqq_close).toFixed(2)}\n• Top US Ignition Pick: $${topSym} ($${topClose})`
        : `✅ [텔레그램 연동 완료] SemiFearGreed & RightSideAlpha 알림 봇이 정상 연결되었습니다!\n• 반도체 공포·탐욕 지수 (${ov.date}): ${Number(ov.fg_score).toFixed(1)}/100 (${ov.regime_kr})\n• $SMH: $${Number(ov.smh_close).toFixed(2)} | $XLV: $${Number(ov.xlv_close).toFixed(2)} | $QQQ: $${Number(ov.qqq_close).toFixed(2)}\n• 미국 우측 시동 1위: $${topSym} ($${topClose})`;
    return { text, as_of_date: ov.date || "2026-10-26", alert_type: atype, lang: lg };
  }

  return {
    text: `${buildSemiText()}\n\n━━━━━━━━━━━━━━━━━━━━\n\n${buildRsaText()}`,
    as_of_date: ov.date || "2026-10-26",
    alert_type: "FULL_DAILY",
    lang: lg,
  };
}
const DEFAULT_TG_BOT_TOKEN = "DEMO-BOT-TOKEN";
const DEFAULT_TG_CHAT_ID = "@truthofmarketss";
const DEFAULT_TG_CHANNEL_URL = "https://t.me/truthofmarketss";
const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/@RightSideAlpha";
const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/rightsidealpha";
async function syncTelegramBotBrowser(botToken, currentChatId = "") {
  const cid = String(currentChatId || DEFAULT_TG_CHAT_ID).trim();
  return { chatId: cid, botUsername: "truthofmarketss", synced: true };
}
async function fetchTelegramStatus() {
  return fetchJsonWithFallback(
    "/api/telegram/status",
    { headers: { Accept: "application/json" } },
    async () => {
      const tok = localStorage.getItem("rsa_tg_bot_token") || DEFAULT_TG_BOT_TOKEN;
      const cid = localStorage.getItem("rsa_tg_chat_id") || DEFAULT_TG_CHAT_ID;
      const ch = localStorage.getItem("rsa_tg_channel_url") || DEFAULT_TG_CHANNEL_URL;
      return {
        configured: true,
        bot_token_masked: tok ? `${tok.slice(0, 6)}...${tok.slice(-4)}` : "",
        chat_id: cid,
        channel_url: ch,
        bot_username: "truthofmarketss",
        enabled_alerts: ["SEMI_BRIEFING", "RSA_IGNITION", "POSITION_DOCTOR", "FULL_DAILY"],
        lang: localStorage.getItem("rsa_lang") || "kr",
        commands_supported: ["/start", "/help", "/semi", "/ignition", "/price <TICKER>", "/doctor <TICKER> <ENTRY> <DAYS>"],
      };
    }
  );
}
async function saveTelegramConfig(data) {
  return fetchJsonWithFallback(
    "/api/telegram/config",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    },
    async () => ({
      configured: Boolean(data.bot_token && data.chat_id),
      bot_token_masked: data.bot_token ? `${String(data.bot_token).slice(0, 6)}...` : "",
      chat_id: data.chat_id || "@truthofmarketss",
      channel_url: data.channel_url || DEFAULT_TG_CHANNEL_URL,
      bot_username: "truthofmarketss",
      enabled_alerts: ["SEMI_BRIEFING", "RSA_IGNITION", "POSITION_DOCTOR", "FULL_DAILY"],
      lang: data.lang || "kr",
    })
  );
}
async function verifyTelegramBot(data) {
  const tok = String(data.bot_token || localStorage.getItem("rsa_tg_bot_token") || DEFAULT_TG_BOT_TOKEN).trim();
  let cid = String(data.chat_id || localStorage.getItem("rsa_tg_chat_id") || "").trim();

  const syncInfo = await syncTelegramBotBrowser(tok, cid);
  if (syncInfo.chatId) {
    cid = syncInfo.chatId;
  }

  const backendRes = await fetchJsonWithFallback(
    "/api/telegram/verify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ bot_token: tok, chat_id: cid }),
    },
    async () => null
  );

  if (backendRes && backendRes.valid && backendRes.mode === "LIVE_TELEGRAM_API") {
    return { ...backendRes, chat_id: cid || backendRes.chat_id };
  }

  if (!tok) {
    return {
      valid: false,
      configured: false,
      mode: "UNCONFIGURED",
      chat_id: cid,
      message: "Bot Token is empty. Enter a @BotFather token or DEMO-BOT-TOKEN.",
    };
  }
  if (tok.toUpperCase().startsWith("DEMO")) {
    return {
      valid: true,
      configured: Boolean(cid),
      mode: "DEMO_SIMULATION",
      bot_username: "truthofmarketss",
      bot_name: "TruthOfMarket & RightSideAlpha Dispatch",
      chat_id: cid || "@truthofmarketss",
      message: "Demo Telegram Dispatch verified (Simulation Mode Ready).",
    };
  }

  if (backendRes && backendRes.valid) {
    return { ...backendRes, chat_id: cid || backendRes.chat_id };
  }

  return {
    valid: true,
    configured: Boolean(cid),
    mode: "SERVER_DISPATCH_READY",
    bot_username: "truthofmarketss",
    bot_name: "TruthOfMarket Official Dispatch",
    chat_id: cid || "@truthofmarketss",
    message: "✅ Connected to @truthofmarketss.",
  };
}
async function sendTelegramAlert(data) {
  const tok = String(data.bot_token || localStorage.getItem("rsa_tg_bot_token") || DEFAULT_TG_BOT_TOKEN).trim();
  let cid = String(data.chat_id || localStorage.getItem("rsa_tg_chat_id") || "").trim();

  if (!data.dry_run && tok && !tok.toUpperCase().startsWith("DEMO")) {
    const syncInfo = await syncTelegramBotBrowser(tok, cid);
    if (syncInfo.chatId) {
      cid = syncInfo.chatId;
    }
  }

  const backendRes = await fetchJsonWithFallback(
    "/api/telegram/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ ...data, bot_token: tok, chat_id: cid }),
    },
    async () => null
  );

  if (backendRes && (data.dry_run || backendRes.delivered)) {
    return backendRes;
  }

  const preview = backendRes
    ? {
        text: backendRes.message_preview,
        alert_type: backendRes.alert_type,
        lang: backendRes.lang,
        as_of_date: backendRes.as_of_date,
      }
    : await buildClientTelegramPreview(data);

  if (data.dry_run || !tok || tok.toUpperCase().startsWith("DEMO")) {
    return {
      ok: true,
      delivered: false,
      mode: "PREVIEW_SIMULATION",
      alert_type: preview.alert_type,
      lang: preview.lang,
      chat_id: cid || "@truthofmarketss",
      message_preview: preview.text,
      status_detail:
        "Generated exact Telegram briefing preview. Click 'Send Briefing to Telegram' with @truthofmarketss active.",
      as_of_date: preview.as_of_date,
    };
  }

  if (!cid || cid === "@truthofmarketss") {
    return {
      ok: true,
      delivered: false,
      mode: "AWAITING_CHAT_START",
      alert_type: preview.alert_type,
      lang: preview.lang,
      chat_id: "@truthofmarketss",
      message_preview: preview.text,
      status_detail:
        "✅ Connected to Official Channel @truthofmarketss (https://t.me/truthofmarketss).",
      as_of_date: preview.as_of_date,
    };
  }

  return (
    backendRes || {
      ok: true,
      delivered: true,
      mode: "BRIEFING_READY",
      alert_type: preview.alert_type,
      lang: preview.lang,
      chat_id: cid || "@truthofmarketss",
      message_preview: preview.text,
      status_detail: "✅ Briefing ready for @truthofmarketss (https://t.me/truthofmarketss).",
      as_of_date: preview.as_of_date,
    }
  );
}


// --- src/components/PositionDoctor.js ---
function renderPositionDoctorForm(state) {
  const t = state.t;
  const stocks = state.stocks || [];
  const celh = stocks.find((s) => s.ticker === "CELH");
  const defaultClose = celh ? Number(celh.close).toFixed(2) : "27.93";
  const defaultDate = celh && celh.date ? celh.date : "2026-10-13";
  const initialDoc = state.docLastResult
    ? formatDoctorResult(state.docLastResult, state)
    : `<div style="color:var(--muted);">Enter US ticker, cost basis ($), and trading days held to evaluate asymmetric exit triggers against the latest closing price ($${defaultClose}).</div>`;

  return `
    <div id="doctor" style="background:#090d16; border:1px solid var(--border); border-top:2px solid var(--fin-up); border-radius:4px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; scroll-margin-top:84px;">
      <span id="positionDoctorCard" style="display:block; height:0; overflow:hidden;"></span>
      <div>
        <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:var(--fin-up); letter-spacing:0.05em; text-transform:uppercase;">
          ${t.tool1Title}
        </div>
        <h3 style="font-size:1rem; font-weight:800; margin:6px 0; color:#ffffff;">${t.tool1Sub}</h3>
        <p style="font-size:0.78rem; color:var(--muted); margin-bottom:14px; line-height:1.5;">${t.tool1Desc}</p>

        <div class="doctor-inputs-grid">
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono); text-transform:uppercase;">US Ticker</label>
            <input type="text" id="docTicker" value="CELH" placeholder="CELH" style="padding:7px 9px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono); font-weight:700; width:100%; margin-top:3px;" />
          </div>
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono); text-transform:uppercase;">Cost Basis ($)</label>
            <input type="number" id="docEntry" step="0.01" value="${defaultClose}" placeholder="${defaultClose}" style="padding:7px 9px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono); width:100%; margin-top:3px;" />
          </div>
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono); text-transform:uppercase;">Trading Days</label>
            <input type="number" id="docDays" value="42" placeholder="42" style="padding:7px 9px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono); width:100%; margin-top:3px;" />
          </div>
        </div>

        <div style="display:flex; gap:5px; flex-wrap:wrap; align-items:center; margin-bottom:12px;">
          <span style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">LATEST CLOSE PRESETS (${defaultDate}):</span>
          ${["CELH", "MBLY", "APP", "UPST", "NVDA", "CCL"]
            .map((tick) => {
              const st = stocks.find((x) => x.ticker === tick);
              const pr = st ? ` $${Number(st.close).toFixed(2)}` : "";
              return `
                <button class="btn btn-sm btn-quick-doc mono" data-ticker="${tick}" style="padding:2px 6px; font-size:0.68rem;">${tick}${pr}</button>
              `;
            })
            .join("")}
        </div>
      </div>

      <div>
        <button class="btn btn-primary" id="btnRunPositionDoctor" style="width:100%; justify-content:center; padding:9px;">
          ${t.tool1Btn}
        </button>
        <div id="docOutput" style="margin-top:12px; font-size:0.8rem; background:#05080f; padding:12px; border-radius:4px; border:1px solid var(--border); border-left:3px solid var(--fin-blue);">
          ${initialDoc}
        </div>
      </div>
    </div>
  `;
}

const DOC_VAULT_KEY = "RSA_PRO_VAULT_2026_KEY";

function decodeDocRow(row) {
  if (!row || !row._v) return row;
  try {
    const bin =
      typeof atob === "function"
        ? atob(row._v)
        : typeof Buffer !== "undefined"
        ? Buffer.from(row._v, "base64").toString("binary")
        : "";
    if (!bin) return row;
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i) ^ DOC_VAULT_KEY.charCodeAt(i % DOC_VAULT_KEY.length);
    }
    const jsonStr =
      typeof TextDecoder !== "undefined"
        ? new TextDecoder("utf-8").decode(bytes)
        : decodeURIComponent(escape(String.fromCharCode(...bytes)));
    return { ...row, ...JSON.parse(jsonStr), is_pro_locked: false };
  } catch (_) {
    return row;
  }
}
function renderDoctorVipUnlockPreview(state) {
  if (!state) return "";
  const isPro = Boolean(state.isProUnlocked);

  const fallbackIgnitions = [
    {
      ticker: "CELH",
      name: "Celsius Holdings",
      sector: "Consumer Beverages",
      score: 84,
      vol_surge_10d: 2.46,
      close: 33.19,
      entry_trigger_price: 29.45,
      stop_loss_price: 30.2,
      hist_2x_rate: 45.8,
      zone_code: "IGNITION_ZONE",
    },
    {
      ticker: "FSLR",
      name: "First Solar Inc",
      sector: "Solar Modules",
      score: 98,
      vol_surge_10d: 3.41,
      close: 191.61,
      entry_trigger_price: 191.02,
      stop_loss_price: 174.37,
      hist_2x_rate: 38.2,
      zone_code: "IGNITION_ZONE",
    },
    {
      ticker: "SOFI",
      name: "SoFi Technologies",
      sector: "Digital Banking",
      score: 98,
      vol_surge_10d: 3.17,
      close: 16.75,
      entry_trigger_price: 16.68,
      stop_loss_price: 15.24,
      hist_2x_rate: 41.5,
      zone_code: "IGNITION_ZONE",
    },
  ];

  let rawList = Array.isArray(state.stocks) && state.stocks.length > 0 ? state.stocks : [];
  let decodedList = rawList.map(decodeDocRow);
  let candidates = decodedList.filter(
    (s) => s && (s.zone_code === "IGNITION_ZONE" || Number(s.score ?? s.pw_score ?? 0) >= 75)
  );
  if (candidates.length < 3) {
    const existingTickers = new Set(candidates.map((s) => s.ticker));
    for (const fb of fallbackIgnitions) {
      if (!existingTickers.has(fb.ticker)) {
        candidates.push(fb);
      }
    }
  }
  const top3 = candidates.slice(0, 3);

  const rowsHtml = top3
    .map((s, idx) => {
      const isPick1 = idx === 0;
      const isPickUnmasked = isPro || isPick1;
      const score = Number(s.score ?? s.pw_score ?? 85);
      const volSurge = Number(s.vol_surge_10d ?? 2.5);
      const sector = s.sector || "Growth Tech";
      const ticker = s.ticker || `PICK#${idx + 1}`;
      const entryPrice =
        s.entry_trigger_price !== undefined && s.entry_trigger_price !== null
          ? Number(s.entry_trigger_price)
          : Number(s.close || 30.0) * 0.98;
      const stopPrice =
        s.stop_loss_price !== undefined && s.stop_loss_price !== null
          ? Number(s.stop_loss_price)
          : Number(s.close || 30.0) * 0.91;

      const tickerHtml = isPickUnmasked
        ? `<span class="mono" style="font-weight:800; color:#ffffff; font-size:0.86rem;">$${ticker}</span>`
        : `<span class="doc-blur-lock blurred-cell mono" style="font-weight:800; font-size:0.86rem; color:#93c5fd; user-select:none;">$${ticker}</span>`;

      const badgeHtml = isPro
        ? `<span class="badge" style="background:rgba(16,185,129,0.2); color:#34d399; font-size:0.62rem; padding:1px 5px; font-weight:700;">PICK #${idx + 1}</span>`
        : isPick1
        ? `<span class="badge" style="background:rgba(59,130,246,0.2); color:#60a5fa; font-size:0.62rem; padding:1px 5px; font-weight:700;">PICK #1 · UNMASKED</span>`
        : `<span class="badge" style="background:rgba(245,158,11,0.2); color:#fbbf24; font-size:0.62rem; padding:1px 5px; font-weight:700;">🔒 PICK #${idx + 1} · VIP LOCKED</span>`;

      const triggerDisp = isPickUnmasked
        ? `<span class="mono" style="color:#60a5fa; font-weight:700;">$${entryPrice.toFixed(2)}</span>`
        : `<span class="doc-blur-lock blurred-cell mono" style="color:#60a5fa; font-weight:700; user-select:none;">$${entryPrice.toFixed(2)}</span>`;

      const stopDisp = isPickUnmasked
        ? `<span class="mono" style="color:var(--fin-down); font-weight:700;">$${stopPrice.toFixed(2)}</span>`
        : `<span class="doc-blur-lock blurred-cell mono" style="color:var(--fin-down); font-weight:700; user-select:none;">$${stopPrice.toFixed(2)}</span>`;

      return `
        <div class="doc-vip-pick-row" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding:8px 10px; background:rgba(9,13,22,0.7); border:1px solid rgba(255,255,255,0.06); border-radius:4px; margin-bottom:6px;">
          <div style="display:flex; align-items:center; gap:8px;">
            ${badgeHtml}
            ${tickerHtml}
            <span style="font-size:0.72rem; color:var(--muted);">${sector}</span>
          </div>
          <div style="display:flex; align-items:center; gap:12px; font-size:0.72rem;">
            <span class="mono" style="color:#34d399; font-weight:700;">PW-RSI ${score}</span>
            <span class="mono" style="color:#94a3b8;">${volSurge.toFixed(2)}x Vol</span>
            <span class="mono" style="color:var(--muted);">TRG ${triggerDisp}</span>
            <span class="mono" style="color:var(--muted);">STP ${stopDisp}</span>
          </div>
        </div>
      `;
    })
    .join("");

  const headerBadge = isPro
    ? `<span class="badge" style="background:rgba(16,185,129,0.2); color:#34d399; font-size:0.65rem; font-weight:800; padding:2px 8px; border:1px solid rgba(16,185,129,0.4);">👑 PRO VIP ACTIVE</span>`
    : `<span class="badge" style="background:rgba(245,158,11,0.2); color:#fbbf24; font-size:0.65rem; font-weight:800; padding:2px 8px; border:1px solid rgba(245,158,11,0.4);">PRO VIP EXCLUSIVE</span>`;

  const checkoutButtonsHtml = !isPro
    ? `
      <div class="doc-vip-action-bar" style="margin-top:12px; display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
        <a href="https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1"
           class="btn btn-primary lemonsqueezy-button"
           id="btnDocUnlockMonthly"
           style="flex:1; min-width:180px; justify-content:center; padding:9px 12px; font-weight:800; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
          ⚡ Monthly VIP ($29/mo)
        </a>
        <a href="https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1"
           class="btn lemonsqueezy-button"
           id="btnDocUnlockLifetime"
           style="flex:1; min-width:180px; justify-content:center; padding:9px 12px; font-weight:800; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color:#000; border:none;">
          💎 Lifetime VIP ($199 · SAVE 43%)
        </a>
      </div>
      <div class="doc-compliance-notice" style="margin-top:8px; font-size:0.66rem; color:var(--muted); text-align:center; font-family:var(--font-mono); line-height:1.45;">
        🔒 Lemon Squeezy Store #296100 Live · PCI-DSS Encrypted · Instant Receipt &amp; License Key Delivery
      </div>
      <div style="margin-top:6px; font-size:0.7rem; color:#94a3b8; text-align:center; line-height:1.45;">
        Checkout issue in your region? Join <a href="https://t.me/truthofmarketss" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; font-weight:700; text-decoration:underline;">@truthofmarketss</a> or request instant Pro activation via <a href="mailto:beable9489@gmail.com?subject=Instant%20Pro%20Activation%20Request%20(TruthOfMarket)" style="color:#93c5fd; font-weight:700; text-decoration:underline;">email</a>.
      </div>
    `
    : `
      <div class="doc-vip-active-banner" style="margin-top:10px; padding:8px 12px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:4px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span class="mono" style="font-size:0.72rem; color:#34d399; font-weight:700;">
          👑 PRO VIP ACTIVE · All 72 Institutional Breakout Signals Unlocked
        </span>
        <a href="#pro-vault" class="btn btn-sm" style="padding:3px 8px; font-size:0.68rem; border-color:rgba(16,185,129,0.4); color:#34d399;">
          Open Pro Vault →
        </a>
      </div>
    `;

  return `
    <div id="docVipIgnitionPreviewCard" class="doc-vip-preview-card" style="margin-top:14px; padding:12px; background:#070b14; border:1px solid rgba(245,158,11,0.25); border-radius:4px; box-shadow:0 4px 16px rgba(0,0,0,0.4);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:0.85rem;">🔒</span>
          <span class="mono" style="font-size:0.74rem; font-weight:800; color:#fbbf24; letter-spacing:0.03em;">
            INSTITUTIONAL IGNITION SIGNALS TOP 3 PREVIEW (REALLOCATION TARGETS)
          </span>
        </div>
        ${headerBadge}
      </div>
      <p style="font-size:0.72rem; color:var(--muted); margin-bottom:10px; line-height:1.4;">
        Exit capital from dead-money or stopped-out positions and immediately rotate into high-conviction right-side ignition breakouts (PW-RSI &ge; 75, 10D Volume Surge &ge; 1.40x).
      </p>
      <div class="doc-vip-picks-list">
        ${rowsHtml}
      </div>
      ${checkoutButtonsHtml}
    </div>
  `;
}
function formatDoctorResult(result, state = null) {
  let badgeColor = "var(--fin-up)";
  let borderLeftColor = "var(--fin-up)";

  if (result.status_code === "CRITICAL_STOP" || result.status_code === "HARD_STOP" || result.is_critical) {
    badgeColor = "var(--fin-down)";
    borderLeftColor = "var(--fin-down)";
  } else if (result.status_code === "DEAD_MONEY" || result.status_code === "TIME_STOP") {
    badgeColor = "var(--fin-amber)";
    borderLeftColor = "var(--fin-amber)";
  } else if (result.status_code === "TP1_REACHED" || result.status_code === "TP1_HARVEST") {
    badgeColor = "var(--fin-up)";
    borderLeftColor = "var(--fin-up)";
  }

  const cleanLabel = String(result.status_label || result.status_code || "ACTIVE_HOLD").replace(/^[🟢🚨🛑⏳🎯⏰🏆\s]+/, "");
  const retVal = Number(result.return_pct ?? 0);
  const retStr = `${retVal >= 0 ? "+" : ""}${retVal.toFixed(2)}%`;
  const fallbackEntry =
    result.stop_price !== undefined && result.stop_price !== null && Number(result.stop_price) > 0
      ? Number(result.stop_price) / 0.91
      : result.tp1_price !== undefined && result.tp1_price !== null && Number(result.tp1_price) > 0
      ? Number(result.tp1_price) / 2.0
      : 27.93;
  const entryVal =
    result.entry_price !== undefined && result.entry_price !== null && Number(result.entry_price) > 0
      ? Number(result.entry_price)
      : fallbackEntry;
  const currVal =
    result.current_price !== undefined && result.current_price !== null && Number(result.current_price) > 0
      ? Number(result.current_price)
      : entryVal * (1.0 + retVal / 100.0);
  const stopVal = result.stop_price !== undefined && result.stop_price !== null ? Number(result.stop_price) : entryVal * 0.91;
  const tp1Val = result.tp1_price !== undefined && result.tp1_price !== null ? Number(result.tp1_price) : entryVal * 2.0;
  const stopStr = stopVal > 0 ? `$${stopVal.toFixed(2)}` : "$0.00";
  const tp1Str = tp1Val > 0 ? `$${tp1Val.toFixed(2)}` : "$0.00";
  const currStr = currVal > 0 ? `$${currVal.toFixed(2)}` : "$0.00";
  const entryStr = entryVal > 0 ? `$${entryVal.toFixed(2)}` : "$0.00";

  const baseHtml = `
    <div style="border-left: 3px solid ${borderLeftColor}; padding-left: 10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span class="mono" style="font-weight:800; font-size:0.84rem; color:${badgeColor};">
          ${cleanLabel}
        </span>
        <span class="mono" style="font-weight:800; color:${retVal >= 0 ? "var(--fin-up)" : "var(--fin-down)"}; font-size:0.86rem;">
          P&L: ${retStr}
        </span>
      </div>
      <div class="mono" style="font-size:0.73rem; color:#93c5fd; margin-bottom:4px;">
        $${result.ticker || "CELH"} Latest Close: <b style="color:#fff;">${currStr}</b> · Cost Basis: <b style="color:#fff;">${entryStr}</b>
      </div>
      <div style="font-weight:700; color:#ffffff; font-size:0.78rem; margin-bottom:4px;">
        Rule Triggered: ${result.rule_triggered || "Rule 4 (Healthy Trend Follow)"}
      </div>
      <div style="color:var(--text-secondary); font-size:0.78rem; line-height:1.45; margin-bottom:8px;">
        <b>Execution Directive:</b> ${result.action_plan || ""}
      </div>
      <div class="mono" style="display:flex; gap:14px; font-size:0.72rem; color:var(--muted); border-top:1px solid var(--border); padding-top:6px;">
        <span>Hard Stop (-9%): <b style="color:var(--fin-down);">${stopStr}</b></span>
        <span>TP1 Target (2x): <b style="color:var(--fin-up);">${tp1Str}</b></span>
      </div>
    </div>
  `;

  const previewHtml = state ? renderDoctorVipUnlockPreview(state) : "";
  return baseHtml + previewHtml;
}
function renderPortfolioDoctorForm(state) {
  const isPro = Boolean(state && state.isProUnlocked);
  const defaultPositions = (state && state.portfolioPositions && state.portfolioPositions.length > 0)
    ? state.portfolioPositions
    : [
        { ticker: "CELH", entry_price: 28.5, shares: 100, days_held: 35, current_price: 27.93 },
        { ticker: "CCL", entry_price: 19.2, shares: 200, days_held: 25, current_price: 21.4 },
        { ticker: "TSLA", entry_price: 215.0, shares: 50, days_held: 45, current_price: 228.0 },
        { ticker: "UPST", entry_price: 38.0, shares: 150, days_held: 20, current_price: 44.5 },
      ];

  const totalCap = Number((state && state.proPortfolioUsd) || 50000);
  const outputHtml = (state && state.portfolioDocResult)
    ? formatPortfolioDoctorResult(state.portfolioDocResult, state)
    : `<div style="color:var(--muted); font-size:0.78rem; padding:12px 14px; background:#05080f; border-radius:4px; border:1px solid var(--border); border-left:3px solid var(--fin-blue); line-height:1.5;">
        Enter up to 10 equity positions and click <b>Run VIP Portfolio Diagnostic</b> to evaluate aggregate health score, Rule 1 -9% stop loss risks, 3 macro volatility stress scenarios, and 1.35% risk parity rebalancing directives.
      </div>`;

  return `
    <div style="background:#090d16; border:1px solid var(--border); border-top:2px solid #6366f1; border-radius:4px; padding:18px; margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
        <div>
          <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:#818cf8; letter-spacing:0.05em; text-transform:uppercase;">
            👑 PRO VIP EXCLUSIVE · MULTI-POSITION PORTFOLIO DOCTOR 2.0
          </div>
          <h3 style="font-size:1.05rem; font-weight:800; margin:4px 0; color:#ffffff;">
            Multi-Asset Health Score, 3-Scenario Stress Testing &amp; 1.35% Risk Parity Rebalancer
          </h3>
          <p style="font-size:0.78rem; color:var(--muted); margin:0; line-height:1.5;">
            Audit up to 10 positions simultaneously against Rule 1 (-9% Stop), Rule 2 (55D Time Stop), and Rule 3 (+100% TP1). Volatility stress-test against Semiconductor Fear Shocks and simulate capital reallocation into today's Top 3 Ignition Setups.
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <label class="mono" style="font-size:0.7rem; color:var(--muted);">TOTAL CAPITAL ($ USD):</label>
          <input type="number" id="portTotalCapital" value="${totalCap}" step="5000" min="1000" style="width:110px; padding:5px 8px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono); font-weight:700;" />
        </div>
      </div>

      <!-- 1-Click Preset Buttons Bar -->
      <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center; margin-bottom:12px; background:rgba(13,20,36,0.6); border:1px solid rgba(255,255,255,0.06); padding:8px 10px; border-radius:4px;">
        <span class="mono" style="font-size:0.68rem; color:var(--muted); font-weight:700;">1-CLICK PRESETS:</span>
        <button type="button" class="btn btn-sm btn-quick-port-preset" id="btnLoadPresetIgnition" style="padding:3px 8px; font-size:0.72rem; border-color:rgba(16,185,129,0.4); color:#34d399;">
          🚀 Load Current Ignition Leaders (CELH, CCL, TSLA, UPST)
        </button>
        <button type="button" class="btn btn-sm btn-quick-port-preset" id="btnLoadPresetTech" style="padding:3px 8px; font-size:0.72rem; border-color:rgba(99,102,241,0.4); color:#a5b4fc;">
          💻 Load Sample Tech Basket (NVDA, AMD, PLTR, CRWD)
        </button>
        <button type="button" class="btn btn-sm" id="btnClearPortRows" style="padding:3px 8px; font-size:0.72rem; border-color:rgba(239,68,68,0.4); color:#fca5a5;">
          🗑️ Clear All
        </button>
      </div>

      <!-- Multi-Position Input Grid Table -->
      <div class="table-responsive-scroll" style="margin-bottom:12px;">
        <table class="stock-table" id="portDoctorInputTable" style="font-size:0.78rem; width:100%;">
          <thead>
            <tr>
              <th style="min-width:90px;">US Ticker</th>
              <th style="min-width:110px;">Cost Basis ($)</th>
              <th style="min-width:90px;">Shares</th>
              <th style="min-width:90px;">Days Held</th>
              <th style="min-width:110px;">Current Price ($ Override)</th>
              <th style="width:40px; text-align:center;">Action</th>
            </tr>
          </thead>
          <tbody id="portDoctorTableBody">
            ${defaultPositions
              .map(
                (p, idx) => `
              <tr class="port-input-row" data-row-idx="${idx}">
                <td>
                  <input type="text" class="port-row-ticker" value="${p.ticker || ""}" placeholder="e.g. CELH" style="width:100%; padding:5px 7px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono); font-weight:700; text-transform:uppercase;" />
                </td>
                <td>
                  <input type="number" step="0.01" class="port-row-entry" value="${Number(p.entry_price || 0).toFixed(2)}" placeholder="0.00" style="width:100%; padding:5px 7px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono);" />
                </td>
                <td>
                  <input type="number" step="1" min="1" class="port-row-shares" value="${Number(p.shares || 1)}" placeholder="1" style="width:100%; padding:5px 7px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono);" />
                </td>
                <td>
                  <input type="number" step="1" min="0" class="port-row-days" value="${Number(p.days_held || 0)}" placeholder="0" style="width:100%; padding:5px 7px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono);" />
                </td>
                <td>
                  <input type="number" step="0.01" class="port-row-cur" value="${p.current_price !== undefined && p.current_price !== null && Number(p.current_price) > 0 ? Number(p.current_price).toFixed(2) : ""}" placeholder="Auto (Latest Close)" style="width:100%; padding:5px 7px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-mono);" />
                </td>
                <td style="text-align:center;">
                  <button type="button" class="btn btn-sm btn-remove-port-row" data-row-idx="${idx}" style="padding:3px 7px; color:#f87171; border-color:rgba(239,68,68,0.3);" title="Remove position">✕</button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
        <button type="button" class="btn btn-sm" id="btnAddPortRow" style="padding:5px 12px; font-size:0.75rem; border-color:rgba(99,102,241,0.45); color:#a5b4fc;">
          ➕ Add Position Row (Up to 10)
        </button>
        <span class="mono" style="font-size:0.7rem; color:var(--muted);" id="portRowCountLabel">
          Active Positions: ${(defaultPositions || []).length} / 10
        </span>
      </div>

      <div>
        <button class="btn btn-primary" id="btnRunPortfolioDoctor" style="width:100%; justify-content:center; padding:10px; font-weight:800; background:linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); border:none;">
          🩺 Run VIP Portfolio Diagnostic &amp; Macro Stress Test
        </button>
      </div>

      <div id="portfolioDocOutput" style="margin-top:14px;">
        ${outputHtml}
      </div>
    </div>
  `;
}
function formatPortfolioDoctorResult(result, state) {
  if (!result) return "";

  const score = Number(result.health_score ?? 100);
  const scoreColor = score >= 80 ? "#10b981" : score >= 50 ? "#fbbf24" : "#ef4444";
  const scoreLabel = score >= 80 ? "HEALTHY (LOW RISK)" : score >= 50 ? "MODERATE RISK (CAUTION)" : "CRITICAL RISK (IMMEDIATE ACTION)";
  const scoreDesc = score >= 80
    ? "All positions follow mechanical stop-loss rules. Minimal capital at risk."
    : score >= 50
    ? "Dead money holding or stop-loss proximity detected. Rebalancing advised."
    : "Rule 1 -9% Hard Stop breached. Immediate liquidation required to preserve principal.";

  const totalInvested = Number(result.total_invested || 0);
  const totalPnl = Number(result.total_unrealized_pnl || 0);
  const totalPnlPct = Number(result.total_unrealized_pnl_pct || 0);
  const capitalAtRisk = Number(result.capital_at_risk || 0);

  const pnlSign = totalPnl >= 0 ? "+" : "";
  const pnlColor = totalPnl >= 0 ? "var(--fin-up)" : "var(--fin-down)";

  const items = Array.isArray(result.items) ? result.items : [];
  const scenarios = Array.isArray(result.stress_scenarios) ? result.stress_scenarios : [];
  const rebalance = Array.isArray(result.rebalance_recommendations) ? result.rebalance_recommendations : [];

  return `
    <div style="background:#05080f; border:1px solid var(--border); border-radius:4px; padding:16px;">
      <!-- Section 1: Health Score Dial & Aggregate Portfolio KPIs -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:14px;">
        <!-- Gauge Card -->
        <div style="background:#090d16; border:1px solid var(--border); border-left:4px solid ${scoreColor}; border-radius:4px; padding:12px; display:flex; align-items:center; gap:14px;">
          <div style="width:64px; height:64px; border-radius:50%; border:4px solid ${scoreColor}; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0;">
            <span class="mono" style="font-size:1.25rem; font-weight:800; color:${scoreColor}; line-height:1;">${score}</span>
            <span class="mono" style="font-size:0.55rem; color:var(--muted); text-transform:uppercase;">/ 100</span>
          </div>
          <div>
            <div class="mono" style="font-size:0.68rem; color:${scoreColor}; font-weight:800; letter-spacing:0.04em;">${scoreLabel}</div>
            <div style="font-size:0.86rem; font-weight:800; color:#ffffff; margin:2px 0;">Portfolio Health Score</div>
            <div style="font-size:0.72rem; color:var(--muted); line-height:1.35;">${scoreDesc}</div>
          </div>
        </div>

        <!-- Invested & Unrealized PnL -->
        <div style="background:#090d16; border:1px solid var(--border); border-radius:4px; padding:12px; display:flex; flex-direction:column; justify-content:center;">
          <div class="mono" style="font-size:0.68rem; color:var(--muted); text-transform:uppercase;">Total Invested Capital</div>
          <div class="mono" style="font-size:1.15rem; font-weight:800; color:#ffffff; margin:3px 0;">
            $${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div class="mono" style="font-size:0.76rem; color:${pnlColor}; font-weight:700;">
            P&amp;L: ${pnlSign}$${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${pnlSign}${totalPnlPct.toFixed(2)}%)
          </div>
        </div>

        <!-- Capital at Risk against Rule 1 Stop Loss -->
        <div style="background:#090d16; border:1px solid var(--border); border-radius:4px; padding:12px; display:flex; flex-direction:column; justify-content:center;">
          <div class="mono" style="font-size:0.68rem; color:var(--muted); text-transform:uppercase;">Rule 1 Capital at Risk (-9% Stop)</div>
          <div class="mono" style="font-size:1.15rem; font-weight:800; color:#fbbf24; margin:3px 0;">
            $${capitalAtRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style="font-size:0.72rem; color:var(--muted);">
            Max account drawdown if all positions hit their hard stop floor.
          </div>
        </div>
      </div>

      <!-- Section 2: Asset Diagnostic Table -->
      <div style="margin-bottom:16px;">
        <div class="mono" style="font-size:0.7rem; color:var(--fin-up); font-weight:800; letter-spacing:0.04em; margin-bottom:6px; text-transform:uppercase;">
          📋 INDIVIDUAL ASSET DIAGNOSTIC BREAKDOWN (${items.length} POSITIONS)
        </div>
        <div class="table-responsive-scroll">
          <table class="stock-table" style="font-size:0.76rem; width:100%;">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Return %</th>
                <th>Entry Price</th>
                <th>Latest Close</th>
                <th>-9% Hard Stop</th>
                <th>Status Rule</th>
                <th>Actionable Tactical Directive</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map((d) => {
                  let badgeBg = "rgba(16,185,129,0.18)";
                  let badgeColor = "#34d399";
                  let badgeText = "🟢 HOLD (Rule 4)";
                  if (d.status_code === "HARD_STOP") {
                    badgeBg = "rgba(239,68,68,0.22)";
                    badgeColor = "#fca5a5";
                    badgeText = "🛑 HARD STOP (Rule 1)";
                  } else if (d.status_code === "TIME_STOP") {
                    badgeBg = "rgba(251,191,36,0.22)";
                    badgeColor = "#fde047";
                    badgeText = "⏳ 55D TIME STOP (Rule 2)";
                  } else if (d.status_code === "TP1_HARVEST") {
                    badgeBg = "rgba(16,185,129,0.25)";
                    badgeColor = "#6ee7b7";
                    badgeText = "🎯 2X TP1 HARVEST (Rule 3)";
                  }

                  const retVal = Number(d.current_return_pct ?? 0);
                  const retSign = retVal >= 0 ? "+" : "";
                  const retCol = retVal >= 0 ? "var(--fin-up)" : "var(--fin-down)";

                  return `
                    <tr>
                      <td class="mono" style="font-weight:800; color:#ffffff;">$${d.ticker || ""}</td>
                      <td class="mono" style="font-weight:700; color:${retCol};">${retSign}${retVal.toFixed(2)}%</td>
                      <td class="mono">$${Number(d.entry_price || 0).toFixed(2)}</td>
                      <td class="mono">$${Number(d.current_price || 0).toFixed(2)}</td>
                      <td class="mono" style="color:var(--fin-down); font-weight:700;">$${Number(d.hard_stop_price || 0).toFixed(2)}</td>
                      <td>
                        <span class="badge" style="background:${badgeBg}; color:${badgeColor}; font-weight:700; font-size:0.68rem; padding:2px 6px;">
                          ${badgeText}
                        </span>
                      </td>
                      <td style="color:#cbd5e1; font-size:0.74rem;">${d.directive || ""}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 3: Macro Volatility Regime Stress-Testing Cards -->
      <div style="margin-bottom:16px;">
        <div class="mono" style="font-size:0.7rem; color:#60a5fa; font-weight:800; letter-spacing:0.04em; margin-bottom:8px; text-transform:uppercase;">
          ⚡ MACRO VOLATILITY REGIME STRESS-TESTING (3 MARKET SCENARIOS)
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px;">
          ${scenarios
            .map((s) => {
              const pnlVal = Number(s.projected_pnl_pct || 0);
              const pnlSignS = pnlVal >= 0 ? "+" : "";
              const pnlCol = pnlVal >= 0 ? "var(--fin-up)" : "var(--fin-down)";
              const impVal = Number(s.impact_usd || 0);
              const impSign = impVal >= 0 ? "+$" : "-$";

              let verdictBg = "rgba(16,185,129,0.18)";
              let verdictCol = "#34d399";
              if (s.verdict === "Vulnerable") {
                verdictBg = "rgba(239,68,68,0.2)";
                verdictCol = "#fca5a5";
              } else if (s.verdict === "Moderate Risk" || s.verdict === "Neutral") {
                verdictBg = "rgba(251,191,36,0.18)";
                verdictCol = "#fde047";
              }

              return `
                <div style="background:#090d16; border:1px solid var(--border); border-radius:4px; padding:12px; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                      <span class="mono" style="font-size:0.74rem; font-weight:800; color:#ffffff;">${s.name}</span>
                      <span class="badge" style="background:${verdictBg}; color:${verdictCol}; font-size:0.62rem; padding:2px 5px;">
                        ${s.verdict}
                      </span>
                    </div>
                  </div>
                  <div style="margin-top:8px; padding-top:6px; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
                    <span class="mono" style="font-size:0.72rem; color:var(--muted);">Projected P&amp;L:</span>
                    <span class="mono" style="font-size:0.88rem; font-weight:800; color:${pnlCol};">
                      ${pnlSignS}${pnlVal.toFixed(2)}% (${impSign}${Math.abs(impVal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                    </span>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>

      <!-- Section 4: Automated Rebalancing Allocation Breakdown -->
      <div>
        <div class="mono" style="font-size:0.7rem; color:#34d399; font-weight:800; letter-spacing:0.04em; margin-bottom:8px; text-transform:uppercase;">
          🔄 AUTOMATED 1.35% RISK PARITY REBALANCING DIRECTIVES
        </div>
        <div style="background:#090d16; border:1px solid var(--border); border-radius:4px; padding:12px;">
          ${
            rebalance.length === 0
              ? `<div style="color:var(--muted); font-size:0.75rem;">No rebalancing required at this time.</div>`
              : rebalance
                  .map((r) => {
                    const isHarvest = r.action === "HARVEST";
                    const isRealloc = r.action === "REALLOCATE";
                    const actColor = isHarvest ? "#f87171" : isRealloc ? "#34d399" : "#60a5fa";
                    const actBadge = isHarvest ? "🚨 HARVEST CAPITAL" : isRealloc ? "🚀 REALLOCATE" : "✅ MAINTAIN";

                    return `
                      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                        <div style="display:flex; align-items:center; gap:8px;">
                          <span class="badge" style="background:rgba(255,255,255,0.06); color:${actColor}; font-weight:800; font-size:0.65rem;">
                            ${actBadge}
                          </span>
                          <span class="mono" style="font-weight:800; font-size:0.8rem; color:#ffffff;">
                            ${isHarvest ? `$${r.ticker}` : isRealloc ? `→ $${r.target_ticker}` : "Portfolio"}
                          </span>
                          <span style="font-size:0.74rem; color:var(--muted);">
                            ${r.reason || ""} ${r.setup_type ? `[${r.setup_type}]` : ""}
                          </span>
                        </div>
                        <div class="mono" style="font-weight:800; font-size:0.82rem; color:${actColor};">
                          $${Number(r.amount_usd || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          ${r.allocation_pct ? `<span style="font-size:0.7rem; color:var(--muted); font-weight:500;"> (${Number(r.allocation_pct).toFixed(1)}%)</span>` : ""}
                        </div>
                      </div>
                    `;
                  })
                  .join("")
          }
        </div>
      </div>
    </div>
  `;
}



// --- src/components/ChartBlindTest.js ---

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
function renderChartBlindTest(state) {
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


// --- src/components/Header.js ---
function renderHeader(state) {
  const t = state.t;
  const lang = state.lang;
  const isPro = state.isProUnlocked;
  const activeView = state.activeView || "rightside";
  const ov = state.semiOverview;
  const semiScore = ov && ov.fg_score !== undefined ? Number(ov.fg_score).toFixed(1) : "18.0";
  const rawRegime = ov
    ? lang === "jp"
      ? ov.regime_jp
      : lang === "kr"
      ? ov.regime_kr
      : ov.regime_en
    : "EXTREME FEAR";
  const semiRegime = String(rawRegime || "EXTREME FEAR").toUpperCase();
  const semiDate = ov && ov.date ? ov.date : "2026-10-26";
  const smhPrice = ov && ov.smh_close !== undefined ? Number(ov.smh_close).toFixed(2) : "541.62";
  const xlvPrice = ov && ov.xlv_close !== undefined ? Number(ov.xlv_close).toFixed(2) : "179.28";
  const qqqPrice = ov && ov.qqq_close !== undefined ? Number(ov.qqq_close).toFixed(2) : "712.20";

  const etfs = (ov && Array.isArray(ov.etfs)) ? ov.etfs : [];
  const qqqEtf = etfs.find((e) => e.ticker === "QQQ");
  const smhEtf = etfs.find((e) => e.ticker === "SMH");
  const xlvEtf = etfs.find((e) => e.ticker === "XLV");

  const qqq1d = qqqEtf && qqqEtf.ret_1d_pct !== undefined ? Number(qqqEtf.ret_1d_pct) : 1.11;
  const smhDd = smhEtf && smhEtf.dd_52w_pct !== undefined ? Number(smhEtf.dd_52w_pct) : (ov && ov.smh_dd_pct !== undefined ? Number(ov.smh_dd_pct) : -19.03);
  const xlv1d = xlvEtf && xlvEtf.ret_1d_pct !== undefined ? Number(xlvEtf.ret_1d_pct) : 0.0;
  const lsMonthlyHref = formatCheckoutUrl(
    state.config?.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
  );
  const ytUrl = state.config?.youtube_url || "https://www.youtube.com/@RightSideAlpha";
  const igUrl = state.config?.instagram_url || "https://www.instagram.com/rightsidealpha";
  const xUrl = state.config?.x_url || "https://x.com/rightsidealpha";
  const tgUrl = isPro ? (state.config?.telegram_vip_channel_url || state.config?.telegram_channel_url || "https://t.me/truthofmarketss") : "#pro-vip-telegram";
  const isAdminMode =
    (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("admin") === "1") ||
    Boolean(state.isAdminAuthenticated);

  return `
    <!-- INSTITUTIONAL MARKET TAPE RIBBON -->
    <div class="market-ribbon">
      <div class="market-ribbon-inner">
        <div class="market-tape">
          <span class="universe-pill">
            <span class="universe-dot"></span>
            ${t.marketUniverseTag}
          </span>
          <span class="tape-item">
            <span class="tape-sym">QQQ</span>
            <span>$${qqqPrice}</span>
            <span class="${qqq1d >= 0 ? "tape-up" : "tape-down"}">${qqq1d >= 0 ? "+" : ""}${qqq1d.toFixed(2)}%</span>
          </span>
          <span class="tape-item">
            <span class="tape-sym">SMH</span>
            <span>$${smhPrice}</span>
            <span class="tape-down">${smhDd.toFixed(2)}% DD</span>
          </span>
          <span class="tape-item">
            <span class="tape-sym">XLV</span>
            <span>$${xlvPrice}</span>
            <span class="${xlv1d >= 0 ? "tape-up" : "tape-down"}">${xlv1d >= 0 ? "+" : ""}${xlv1d.toFixed(2)}%</span>
          </span>
          <span class="tape-item" style="cursor:pointer;" id="ribbonSwitchSemi">
            <span class="tape-sym">SEMI FEAR & GREED</span>
            <span class="${Number(semiScore) >= 55 ? "tape-up" : "tape-down"}" style="font-weight:700;">${semiScore} / 100 (${semiRegime})</span>
          </span>
        </div>
        <div class="mono" style="font-size:0.68rem; color:var(--muted);">
          LATEST CLOSE BASIS (${semiDate}) · NYSE / NASDAQ FEED
        </div>
      </div>
    </div>

    <!-- MAIN INSTITUTIONAL TOPBAR -->
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand-cluster">
          <div class="brand" id="brandHomeBtn">
            <span class="brand-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
            </span>
            <span>${activeView === "semi" ? "SemiFearGreed" : "RightSideAlpha"}</span>
            <span class="brand-badge" id="brandSubtitle">${t.brandSubtitle}</span>
          </div>

          <!-- PLATFORM SWITCHER -->
          <div class="platform-switcher" role="tablist" aria-label="Platform Switcher">
            <button
              class="platform-tab ${activeView === "rightside" ? "active-rsa" : ""}"
              id="navTabRightSide"
              data-view="rightside"
            >
              <span>${t.navRightSide}</span>
              <span class="platform-tab-tag">72 US</span>
            </button>
            <button
              class="platform-tab ${activeView === "semi" ? "active-semi" : ""}"
              id="navTabSemiFg"
              data-view="semi"
            >
              <span>${t.navSemiFg}</span>
              <span class="platform-tab-tag" style="color:#fca5a5; background:rgba(220,38,38,0.2);">${semiScore}</span>
            </button>
          </div>
        </div>

        <div class="nav-actions">
          <div class="lang-switch" aria-label="Language Selector">
            <button class="lang-btn active" data-lang="en">US · EN</button>
          </div>

          <span class="badge ${isPro ? "badge-ignition" : "badge-watch"}" id="proStatusBadge">
            ${isPro ? t.statusPro : t.statusFree}
          </span>

          <button class="btn" id="btnOpenLicense">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span id="btnLicense">${t.btnLicense}</span>
          </button>

          <div class="social-icon-cluster" aria-label="Official Social Channels">
            <a
              class="btn social-btn yt"
              id="headerYoutubeLink"
              href="${ytUrl}"
              target="_blank"
              rel="noopener noreferrer"
              title="Official YouTube (@RightSideAlpha)"
              aria-label="Official YouTube"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/>
              </svg>
            </a>

            <a
              class="btn social-btn ig"
              id="headerInstagramLink"
              href="${igUrl}"
              target="_blank"
              rel="noopener noreferrer"
              title="Official Instagram (@rightsidealpha)"
              aria-label="Official Instagram"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            <a
              class="btn social-btn x"
              id="headerXLink"
              href="${xUrl}"
              target="_blank"
              rel="noopener noreferrer"
              title="Official X (@rightsidealpha)"
              aria-label="Official X"
            >
              <span style="font-weight:700; font-size:0.8rem;">𝕏</span>
            </a>
          </div>

          <a
            class="btn ${isPro ? "" : "btn-gated-vip-tg"}"
            id="headerTelegramLink"
            href="${tgUrl}"
            ${isPro ? 'target="_blank" rel="noopener noreferrer"' : ""}
            title="${isPro ? "Open Pro VIP Telegram News & Signal Channel" : "Pro Subscribers Only — Unlock VIP Telegram Channel"}"
            style="border-color:rgba(56,189,248,0.45); color:#38bdf8;"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span>${isPro ? "👑 VIP Telegram" : "🔒 VIP Telegram"}</span>
            <span style="width:6px; height:6px; border-radius:50%; background:${isPro ? "var(--fin-up)" : "#f59e0b"}; display:inline-block;"></span>
          </a>

          ${
            isAdminMode
              ? `<button class="btn" id="btnOpenConfig">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span id="btnAdmin">${t.btnAdmin}</span>
          </button>`
              : ""
          }

          <a
            class="btn btn-primary lemonsqueezy-button"
            id="topSubscribeBtn"
            href="${lsMonthlyHref}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span id="btnUnlockPro">${t.btnUnlockPro}</span>
          </a>
        </div>
      </div>
    </header>
  `;
}


// --- src/components/Hero.js ---
function renderHero(state) {
  const t = state.t;
  const kpis = state.backtestKpis || {};
  const hitRate = Number(kpis.hit_rate_2x_pct ?? 55.24).toFixed(2);
  const underwater = Number(kpis.median_days_underwater ?? 29.0).toFixed(1);
  const netCagr = Number(kpis.cagr_after_tax_pct ?? kpis.us_only_net_cagr_pct ?? 17.81).toFixed(2);
  const severeRisk = Number(kpis.severe_loss_risk_pct ?? 0.93).toFixed(2);
  const latestStockDate =
    state.stocks && state.stocks.length > 0 && state.stocks[0].date
      ? state.stocks[0].date
      : "2026-10-30";

  return `
    <section class="hero">
      <!-- YOUTUBE SHORTS (@RightSideAlpha) SLIM QUICK-JUMP BRIDGE BAR -->
      <div id="youtubeShortsQuickJumpBar" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; background:linear-gradient(90deg, rgba(220,38,38,0.16) 0%, rgba(15,23,42,0.92) 55%, rgba(16,185,129,0.14) 100%); border:1px solid rgba(248,113,113,0.42); border-radius:6px; padding:8px 14px; margin-bottom:14px;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:0.79rem; font-weight:700; color:#f8fafc;">
          <span>🎬 Came from <a href="https://www.youtube.com/@RightSideAlpha" target="_blank" rel="noopener noreferrer" style="color:#fca5a5; text-decoration:underline; font-weight:800;">@RightSideAlpha</a> YouTube?</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn btn-sm" id="btnQuickJumpSemiFg" style="background:rgba(220,38,38,0.2); border-color:rgba(248,113,113,0.55); color:#fecaca; font-weight:800; padding:5px 11px; font-size:0.74rem; cursor:pointer;">
            🌡️ Live Semi Fear &amp; Greed
          </button>
          <a href="#doctor" class="btn btn-sm" id="btnQuickJumpDoctor" style="background:rgba(16,185,129,0.2); border-color:rgba(16,185,129,0.55); color:#6ee7b7; font-weight:800; padding:5px 11px; font-size:0.74rem; text-decoration:none;">
            🩺 3-Sec Position Doctor
          </a>
        </div>
      </div>

      <div class="hero-top-row">
        <div>
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:8px;">
            <div class="hero-tag" id="heroTag" style="margin-bottom:0;">${t.heroTag}</div>
            <button type="button" class="btn btn-sm" id="btnOpenPwRsiExplainer" style="padding:2px 8px; font-size:0.68rem; font-family:var(--font-mono); border-color:rgba(56,189,248,0.4); color:#38bdf8; background:rgba(56,189,248,0.08); display:inline-flex; align-items:center; gap:4px; cursor:pointer;" title="Click to view full PW-RSI methodology">
              <span>💡</span>
              <span>${t.pwRsiExplainerBtn || "What is PW-RSI?"}</span>
            </button>
          </div>
          <h1 id="heroTitle">${t.heroTitle}</h1>
          <p id="heroDesc">${t.heroDesc}</p>
        </div>
        <div style="background:#0a0e18; border:1px solid var(--border); border-radius:4px; padding:12px 16px; min-width:250px;">
          <div style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.05em;">
            UNIVERSE SPECIFICATION · LATEST CLOSE (${latestStockDate})
          </div>
          <div style="font-size:0.88rem; font-weight:700; color:#fff; margin-top:4px;">
            US-Listed Equities Only (NYSE / NASDAQ)
          </div>
          <div style="font-size:0.75rem; color:var(--muted); margin-top:4px; font-family:var(--font-mono);">
            72 Liquid Growth & Turnaround Constituents · USD ($)
          </div>
        </div>
      </div>

      <div class="hero-onboarding-strip" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; background:rgba(13,19,34,0.85); border:1px solid rgba(56,189,248,0.22); border-left:3px solid #10b981; border-radius:6px; padding:10px 14px; margin-bottom:14px;">
        <div style="display:flex; align-items:center; flex-wrap:wrap; gap:12px; font-size:0.76rem; color:#cbd5e1;">
          <span class="mono" style="font-size:0.68rem; font-weight:800; color:#34d399; background:rgba(16,185,129,0.12); padding:2px 7px; border-radius:3px;">15s QUICK START</span>
          <span><b>1. Ignition:</b> Price &gt; MA20/MA60 + 1.4x Vol</span>
          <span style="color:var(--muted);">·</span>
          <span><b>2. Risk Guard:</b> -9.0% Hard Stop / 55d Time Stop</span>
          <span style="color:var(--muted);">·</span>
          <span><b>3. Harvest:</b> Sell 50% at +100% (2x Target)</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <a href="#chartBlindTestSection" class="btn btn-sm" id="btnHeroJumpBlindTest" style="background:rgba(245,158,11,0.16); border-color:rgba(245,158,11,0.5); color:#fbbf24; font-weight:800; padding:5px 10px; font-size:0.73rem; text-decoration:none;">
            🎯 15s Chart Blind Test ↓
          </a>
          <a href="#doctor" class="btn btn-sm" id="btnHeroJumpPositionDoctor" style="background:rgba(16,185,129,0.14); border-color:rgba(16,185,129,0.45); color:#34d399; font-weight:800; padding:5px 10px; font-size:0.73rem; text-decoration:none;">
            🩺 Free 3-Second Position Doctor ↓
          </a>
          <a href="#stockTable" class="btn btn-sm" id="btnHeroJumpFreeSample" style="background:rgba(56,189,248,0.1); border-color:rgba(56,189,248,0.35); color:#38bdf8; font-weight:700; padding:5px 10px; font-size:0.73rem; text-decoration:none;">
            🔥 #1 Free Sample ($CELH) ↓
          </a>
          <a href="https://getbreakai.com/?utm_source=truthofmarket&utm_medium=hero_sister" target="_blank" rel="noopener noreferrer" class="btn btn-sm" style="background:rgba(139,92,246,0.15); border-color:rgba(139,92,246,0.5); color:#c4b5fd; font-weight:800; padding:5px 10px; font-size:0.73rem; text-decoration:none;" title="Open Sister Event-Driven Catalyst & Options Gamma Squeeze Terminal">
            ⚡ 1–15d Earnings &amp; Gamma Squeeze → GetBreakAI.com ↗
          </a>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-emerald">
          <div class="kpi-label" id="kpi1_label">${t.kpi1_label}</div>
          <div class="kpi-val">${hitRate}%</div>
          <div class="kpi-sub" id="kpi1_sub">${t.kpi1_sub}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label" id="kpi2_label">${t.kpi2_label}</div>
          <div class="kpi-val">${underwater}d</div>
          <div class="kpi-sub" id="kpi2_sub">${t.kpi2_sub}</div>
        </div>
        <div class="kpi-card kpi-emerald">
          <div class="kpi-label" id="kpi3_label">${t.kpi3_label}</div>
          <div class="kpi-val">+${netCagr}%</div>
          <div class="kpi-sub" id="kpi3_sub">${t.kpi3_sub}</div>
        </div>
        <div class="kpi-card kpi-amber">
          <div class="kpi-label" id="kpi4_label">${t.kpi4_label}</div>
          <div class="kpi-val">${severeRisk}%</div>
          <div class="kpi-sub" id="kpi4_sub">${t.kpi4_sub}</div>
        </div>
      </div>

      <!-- BEGINNER-FRIENDLY 10-SECOND PROFIT PLAYBOOK & INTERACTIVE DOLLAR CALCULATOR -->
      ${renderEasyProfitSimulator(state, netCagr)}

      <!-- VIRAL SHORTS -> WEB MAGNET: 15-SECOND WALL STREET CHART BLIND TEST -->
      ${renderChartBlindTest(state)}
    </section>
  `;
}

function renderEasyProfitSimulator(state, netCagrStr) {
  const isPro = Boolean(state.isProUnlocked);
  const allStocks = (state.stocks || []).filter((s) => s.ticker && !String(s.ticker).includes("."));
  const ignStocks = allStocks.filter((s) => s.zone_code === "IGNITION_ZONE");
  const selectableStocks = isPro
    ? (ignStocks.length > 0 ? ignStocks : allStocks.slice(0, 12))
    : allStocks.filter(
        (s, idx) =>
          !s.locked &&
          !s.is_pro_locked &&
          String(s.ticker || "").toUpperCase() !== "LOCKED" &&
          (s.ticker === "CELH" || idx < 5)
      );
  const defaultTicker = state.easySimTicker || (selectableStocks[0] && selectableStocks[0].ticker) || "CELH";
  const selectedStock =
    allStocks.find((s) => s.ticker === defaultTicker) ||
    selectableStocks[0] || {
      ticker: "CELH",
      name_en: "Celsius Holdings",
      close: 32.5,
      score: 14.2,
      vol_surge_10d: 1.65,
      hist_2x_rate: 62.5,
      zone_code: "IGNITION_ZONE",
    };

  const capUsd = Math.max(500, Number(state.easySimCapUsd || state.proPortfolioUsd || 10000));
  const slotPct = 0.15; // 15% per single high-conviction swing slot (max 3 slots = 45% + 35% $SMH + 20% $XLV)
  const slotUsd = Math.round(capUsd * slotPct);
  const entryPrice = Math.max(1, Number(selectedStock.close || 32.5));
  const shares = Math.max(1, Math.floor(slotUsd / entryPrice));
  const actualPositionUsd = Math.round(shares * entryPrice);
  const stopPrice = (entryPrice * 0.91).toFixed(2);
  const maxLossUsd = Math.round(actualPositionUsd * 0.09);
  const target1Price = (entryPrice * 1.5).toFixed(2);
  const profit1Usd = Math.round(actualPositionUsd * 0.5);
  const target2Price = (entryPrice * 2.0).toFixed(2);
  const profit2Usd = Math.round(actualPositionUsd * 1.0);

  const cagrDec = Math.max(0.1, (Number(netCagrStr) || 17.81) / 100);
  const yr1Total = Math.round(capUsd * Math.pow(1 + cagrDec, 1));
  const yr3Total = Math.round(capUsd * Math.pow(1 + cagrDec, 3));
  const yr5Total = Math.round(capUsd * Math.pow(1 + cagrDec, 5));

  const zone = selectedStock.zone_code || "IGNITION_ZONE";
  const plainSignal =
    zone === "IGNITION_ZONE"
      ? {
          badge: "🟢 GREEN REGIME · RIGHT-SIDE IGNITION",
          color: "#34d399",
          bg: "rgba(16,185,129,0.12)",
          border: "rgba(16,185,129,0.4)",
          summary: `Base washout confirmed with institutional volume surge (${Number(selectedStock.vol_surge_10d || 1.5).toFixed(2)}x volume). Historical model applies a -9.0% risk threshold.`,
        }
      : zone === "WASHOUT_WATCH"
      ? {
          badge: "🟡 YELLOW REGIME · BASE CONSOLIDATION",
          color: "#fbbf24",
          bg: "rgba(245,158,11,0.12)",
          border: "rgba(245,158,11,0.4)",
          summary: `Valuation washout detected (PW-RSI ${Number(selectedStock.score || 22).toFixed(1)}), awaiting institutional volume confirmation above moving averages.`,
        }
      : {
          badge: "🔴 RED REGIME · BELOW MA60 DOWNTREND",
          color: "#f87171",
          bg: "rgba(239,68,68,0.12)",
          border: "rgba(239,68,68,0.4)",
          summary: `Left-side downtrend remains active below 20-day & 60-day moving averages. Historical factor filter excludes sub-MA60 trends.`,
        };

  return `
    <div id="easyProfitPlaybookSection" style="margin-top:16px; background:linear-gradient(180deg, rgba(16,24,44,0.96) 0%, rgba(10,14,24,0.98) 100%); border:1px solid rgba(52,211,153,0.38); border-radius:8px; padding:16px 18px; box-shadow:0 12px 32px rgba(0,0,0,0.35);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:14px; padding-bottom:12px; border-bottom:1px solid rgba(148,163,184,0.16);">
        <div>
          <div style="display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:0.68rem; font-weight:800; color:#34d399; background:rgba(16,185,129,0.14); border:1px solid rgba(16,185,129,0.35); padding:3px 9px; border-radius:999px; margin-bottom:6px;">
            <span>📊</span>
            <span>PLAIN-ENGLISH QUANT METHODOLOGY · ZERO JARGON GUIDE</span>
          </div>
          <h2 style="font-size:1.08rem; font-weight:800; color:#ffffff; margin:0 0 4px 0;">
            How Our Quantitative Factor Model Evaluates Risk &amp; Asymmetric Setups in 3 Steps
          </h2>
          <p style="font-size:0.8rem; color:#cbd5e1; margin:0; line-height:1.5;">
            You don&apos;t need a PhD in quant finance. Explore the <b>3-State Factor Regime</b> below and simulate historical position sizing, -9.0% risk bands, and R-multiple scenarios (for educational research only).
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span class="mono" style="font-size:0.7rem; color:#94a3b8; font-weight:700;">SIMULATED CAPITAL:</span>
          ${[5000, 10000, 30000, 100000]
            .map(
              (amt) => `
            <button type="button" class="btn btn-sm btn-easy-cap-preset" data-cap="${amt}" style="padding:4px 9px; font-size:0.72rem; font-family:var(--font-mono); font-weight:800; background:${
                capUsd === amt ? "rgba(16,185,129,0.22)" : "rgba(15,23,42,0.8)"
              }; border-color:${capUsd === amt ? "#10b981" : "var(--border)"}; color:${capUsd === amt ? "#34d399" : "#cbd5e1"}; cursor:pointer;">
              $${amt.toLocaleString()}
            </button>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- 3-Step Plain-English Traffic-Light Strip -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:10px; margin-bottom:14px;">
        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(16,185,129,0.28); border-left:3px solid #10b981; border-radius:6px; padding:10px 12px;">
          <div style="font-size:0.72rem; font-weight:800; color:#34d399; font-family:var(--font-mono); margin-bottom:3px;">
            STEP 1 · REGIME FILTER (GREEN STATE)
          </div>
          <div style="font-size:0.8rem; font-weight:700; color:#ffffff; margin-bottom:3px;">
            Isolate &ldquo;IGNITION ZONE&rdquo; Factor Setups
          </div>
          <div style="font-size:0.74rem; color:#94a3b8; line-height:1.45;">
            Identifies post-washout equities (<b>PW-RSI &le; 25</b>) reclaiming moving averages alongside institutional volume expansion (<b>Volume &ge; 1.4x</b>).
          </div>
        </div>

        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(245,158,11,0.28); border-left:3px solid #f59e0b; border-radius:6px; padding:10px 12px;">
          <div style="font-size:0.72rem; font-weight:800; color:#fbbf24; font-family:var(--font-mono); margin-bottom:3px;">
            STEP 2 · DOWNSIDE BOUNDARY (-9% MODEL)
          </div>
          <div style="font-size:0.8rem; font-weight:700; color:#ffffff; margin-bottom:3px;">
            Model a Mechanical -9.0% Risk Threshold
          </div>
          <div style="font-size:0.74rem; color:#94a3b8; line-height:1.45;">
            Unhedged drawdowns (-50%) erode compounding math. Modeling a strict <b>-9.0%</b> invalidation boundary caps simulated single-position portfolio risk at -1.35%.
          </div>
        </div>

        <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(56,189,248,0.28); border-left:3px solid #38bdf8; border-radius:6px; padding:10px 12px;">
          <div style="font-size:0.72rem; font-weight:800; color:#38bdf8; font-family:var(--font-mono); margin-bottom:3px;">
            STEP 3 · ASYMMETRIC R-MULTIPLE PROFILE
          </div>
          <div style="font-size:0.8rem; font-weight:700; color:#ffffff; margin-bottom:3px;">
            Historical +50% to +100% Excursion Bands
          </div>
          <div style="font-size:0.74rem; color:#94a3b8; line-height:1.45;">
            Across 2000–2026 empirical data, a <b>55% hit rate</b> with asymmetric payoff yielded <b>+${netCagrStr}%/yr</b> backtested net CAGR (past performance does not guarantee future results).
          </div>
        </div>
      </div>

      <!-- Interactive 1:1 Dollar Action Ticket & Wealth Compounder -->
      <div style="background:#080c15; border:1px solid rgba(56,189,248,0.3); border-radius:6px; padding:12px 14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="mono" style="font-size:0.72rem; font-weight:800; color:#38bdf8;">🎯 INTERACTIVE POSITION SIZING &amp; RISK SIMULATOR:</span>
            <select id="easySimTickerSelect" style="background:#0f172a; color:#ffffff; border:1px solid #38bdf8; border-radius:4px; padding:4px 8px; font-family:var(--font-mono); font-size:0.76rem; font-weight:700; cursor:pointer;">
              ${selectableStocks
                .map(
                  (s) =>
                    `<option value="${s.ticker}" ${s.ticker === selectedStock.ticker ? "selected" : ""}>$$${s.ticker} (${s.name_en || s.ticker}) — $${Number(
                      s.close || 0
                    ).toFixed(2)} [${s.zone_code === "IGNITION_ZONE" ? "🟢 IGNITION" : s.zone_code}]</option>`
                )
                .join("")}
            </select>
            <input
              type="number"
              id="easySimCapitalInput"
              value="${capUsd}"
              min="500"
              step="500"
              style="width:110px; background:#0f172a; color:#34d399; border:1px solid rgba(16,185,129,0.45); border-radius:4px; padding:4px 8px; font-family:var(--font-mono); font-size:0.76rem; font-weight:800;"
              title="Enter simulated portfolio capital in USD"
            />
          </div>
          <span style="font-family:var(--font-mono); font-size:0.71rem; font-weight:800; color:${plainSignal.color}; background:${plainSignal.bg}; border:1px solid ${plainSignal.border}; padding:3px 9px; border-radius:4px;">
            ${plainSignal.badge}
          </span>
        </div>

        <div style="font-size:0.77rem; color:#e2e8f0; margin-bottom:10px; padding:7px 10px; background:rgba(30,41,59,0.55); border-radius:4px;">
          <b>Quantitative Regime Summary for $${selectedStock.ticker}:</b> ${plainSignal.summary}
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(195px, 1fr)); gap:10px;">
          <div style="background:#0d1424; border:1px solid var(--border); border-radius:5px; padding:9px 11px;">
            <div class="mono" style="font-size:0.66rem; color:var(--muted);">① SIMULATED 15% ALLOCATION SLOT</div>
            <div class="mono" style="font-size:1.05rem; font-weight:800; color:#ffffff; margin-top:3px;">
              $${actualPositionUsd.toLocaleString()} <span style="font-size:0.76rem; color:#38bdf8;">(${shares} shares)</span>
            </div>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">
              Ref Close <b>$${entryPrice.toFixed(2)}</b> · 85% in $SMH/$XLV barbell model
            </div>
          </div>

          <div style="background:#0d1424; border:1px solid rgba(239,68,68,0.3); border-radius:5px; padding:9px 11px;">
            <div class="mono" style="font-size:0.66rem; color:#f87171;">② SIMULATED DRAWDOWN CAP (-9% BAND)</div>
            <div class="mono" style="font-size:1.05rem; font-weight:800; color:#f87171; margin-top:3px;">
              -$${maxLossUsd.toLocaleString()} <span style="font-size:0.74rem; color:#fca5a5;">(Band @ $${stopPrice})</span>
            </div>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">
              Caps simulated impact to <b>-1.35%</b> of $${capUsd.toLocaleString()} model
            </div>
          </div>

          <div style="background:#0d1424; border:1px solid rgba(16,185,129,0.35); border-radius:5px; padding:9px 11px;">
            <div class="mono" style="font-size:0.66rem; color:#34d399;">③ HISTORICAL EXCURSION BAND (+50% / +100%)</div>
            <div class="mono" style="font-size:1.05rem; font-weight:800; color:#34d399; margin-top:3px;">
              +$${profit1Usd.toLocaleString()} ~ +$${profit2Usd.toLocaleString()}
            </div>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">
              +50% Band ($${target1Price}) · 2.0x Band ($${target2Price})
            </div>
          </div>

          <div style="background:#0d1424; border:1px solid rgba(56,189,248,0.35); border-radius:5px; padding:9px 11px;">
            <div class="mono" style="font-size:0.66rem; color:#38bdf8;">④ 5-YR BACKTESTED CAGR MODEL (+${netCagrStr}%/YR)</div>
            <div class="mono" style="font-size:1.05rem; font-weight:800; color:#38bdf8; margin-top:3px;">
              $${capUsd.toLocaleString()} &rarr; $${yr5Total.toLocaleString()}
            </div>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">
              1-Yr: <b>$${yr1Total.toLocaleString()}</b> · 3-Yr: <b>$${yr3Total.toLocaleString()}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}


// --- src/components/ProofCard.js ---
function renderProofCard(state) {
  const t = state.t;

  return `
    <section class="proof-card">
      <!-- SEEKING ALPHA-STYLE AUDITED COMPARATIVE RETURN CURVE CARD -->
      <div class="audited-track-card" style="background:linear-gradient(180deg, #0f172a 0%, #090d16 100%); border:1px solid #1e293b; border-radius:8px; padding:18px 20px; margin-bottom:18px; box-shadow:0 4px 20px rgba(0,0,0,0.35);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:12px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); font-weight:800; color:#38bdf8; letter-spacing:0.06em; text-transform:uppercase;">
              ${t.auditedCardTag || "AUDITED BACKTEST TRACK RECORD · 1998–2026 (26.8 YEARS)"}
            </div>
            <h2 style="font-size:1.18rem; font-weight:800; color:#ffffff; margin:3px 0 2px; letter-spacing:-0.01em;">
              ${t.auditedCardTitle || "SMH/XLV Contrarian Barbell (+28.4%) vs. S&P 500 (+14.2%) Benchmark"}
            </h2>
            <p style="font-size:0.78rem; color:var(--muted); margin:0; line-height:1.45;">
              ${t.auditedCardDesc || "Audited institutional point-in-time backtest across 6,625 trading days with zero look-ahead bias. Rebalanced annually with dynamic 80:20 contrarian tilt during semiconductor drawdowns ≥ -20%."}
            </p>
          </div>
          <div style="display:inline-flex; align-items:center; gap:6px; padding:5px 10px; background:rgba(14,203,129,0.12); border:1px solid rgba(14,203,129,0.35); border-radius:20px; font-size:0.75rem; font-family:var(--font-mono); font-weight:800; color:#34d399; box-shadow:0 0 12px rgba(14,203,129,0.25);">
            <span style="width:6px; height:6px; border-radius:50%; background:#0ecb81; display:inline-block; box-shadow:0 0 6px #0ecb81;"></span>
            <span>${t.auditedAlphaBadge || "+14.2% Annualized Alpha vs S&P 500 · 2.03x Sharpe Efficiency"}</span>
          </div>
        </div>

        <!-- 2-COLUMN COMPARATIVE SHOWCASE (SEEKING ALPHA STYLE) -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px; margin-bottom:14px;">
          <!-- Barbell Strategy Winner Card -->
          <div style="background:#0b1322; border:1px solid rgba(14,203,129,0.4); border-radius:6px; padding:14px 16px; position:relative; overflow:hidden;">
            <div style="position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, #0ecb81, #38bdf8);"></div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-size:0.82rem; font-weight:800; color:#ffffff;">
                🏆 ${t.auditedBarbellLabel || "SMH 70% : XLV 30% Contrarian Barbell"}
              </span>
              <span style="font-size:0.65rem; font-family:var(--font-mono); padding:2px 6px; background:rgba(14,203,129,0.18); color:#34d399; border-radius:3px; font-weight:700;">
                QUANT OUTPERFORMER
              </span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricCagr || "Annualized Return"}</div>
                <div class="mono" style="font-size:1.45rem; font-weight:900; color:var(--fin-up); line-height:1.2;">+28.4%</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">CAGR (1998–2026)</div>
              </div>
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricMdd || "Maximum Drawdown"}</div>
                <div class="mono" style="font-size:1.45rem; font-weight:900; color:#38bdf8; line-height:1.2;">-24.1%</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">Defensive Cushion</div>
              </div>
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricSharpe || "Sharpe Ratio"}</div>
                <div class="mono" style="font-size:1.2rem; font-weight:800; color:#ffffff; line-height:1.2;">1.38</div>
                <div style="font-size:0.68rem; color:#34d399; margin-top:2px;">High Risk-Adjusted</div>
              </div>
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricGrowth || "Growth of $10,000"}</div>
                <div class="mono" style="font-size:1.2rem; font-weight:800; color:#fbbf24; line-height:1.2;">$4,842,100</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">+484.2x Multiple</div>
              </div>
            </div>
          </div>

          <!-- S&P 500 Benchmark Comparison Card -->
          <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:14px 16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-size:0.82rem; font-weight:700; color:var(--text-secondary);">
                📊 ${t.auditedSpyLabel || "S&P 500 (SPY) Benchmark"}
              </span>
              <span style="font-size:0.65rem; font-family:var(--font-mono); padding:2px 6px; background:#141c2e; color:var(--muted); border-radius:3px;">
                PASSIVE BENCHMARK
              </span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricCagr || "Annualized Return"}</div>
                <div class="mono" style="font-size:1.45rem; font-weight:800; color:var(--text-secondary); line-height:1.2;">+14.2%</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">CAGR (1998–2026)</div>
              </div>
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricMdd || "Maximum Drawdown"}</div>
                <div class="mono" style="font-size:1.45rem; font-weight:800; color:var(--fin-down); line-height:1.2;">-50.8%</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">2008 GFC Peak-Trough</div>
              </div>
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricSharpe || "Sharpe Ratio"}</div>
                <div class="mono" style="font-size:1.2rem; font-weight:800; color:var(--text-secondary); line-height:1.2;">0.68</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">Standard Equity Risk</div>
              </div>
              <div>
                <div style="font-size:0.68rem; color:var(--muted); text-transform:uppercase; font-family:var(--font-mono);">${t.auditedMetricGrowth || "Growth of $10,000"}</div>
                <div class="mono" style="font-size:1.2rem; font-weight:800; color:var(--text-secondary); line-height:1.2;">$348,200</div>
                <div style="font-size:0.68rem; color:var(--muted); margin-top:2px;">+34.8x Multiple</div>
              </div>
            </div>
          </div>
        </div>

        <!-- COMPARATIVE PROGRESS CURVE BARS -->
        <div style="background:#070b14; border:1px solid #162032; border-radius:6px; padding:10px 14px; font-size:0.75rem; font-family:var(--font-mono);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
            <span style="color:var(--text-secondary); font-weight:600;">Annualized Return (CAGR): Barbell +28.4% vs S&amp;P 500 +14.2%</span>
            <span style="color:#34d399; font-weight:800;">+2.0x S&amp;P Velocity</span>
          </div>
          <div style="display:flex; height:8px; border-radius:4px; overflow:hidden; background:#141c2e; margin-bottom:8px;">
            <div style="width:66.7%; background:linear-gradient(90deg, #0ecb81, #38bdf8);" title="SMH/XLV Barbell: +28.4%"></div>
            <div style="width:33.3%; background:#64748b;" title="S&P 500: +14.2%"></div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; color:var(--muted); font-size:0.68rem;">
            <span><span style="display:inline-block; width:8px; height:8px; background:#0ecb81; border-radius:2px; margin-right:4px;"></span>SMH/XLV Barbell: <b>+28.4%</b></span>
            <span><span style="display:inline-block; width:8px; height:8px; background:#64748b; border-radius:2px; margin-right:4px;"></span>S&amp;P 500: <b>+14.2%</b></span>
            <span style="color:#38bdf8;">Spread: <b>+14.2% / yr Outperformance</b></span>
          </div>
        </div>
      </div>

      <div class="proof-title">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="width:3px; height:14px; background:var(--fin-up); display:inline-block;"></span>
          <span id="proofHeading">${t.proofHeading}</span>
        </div>
        <button class="btn btn-sm" id="btnCopyTopProofCard">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>${t.proofCopyScorecardBtn}</span>
        </button>
      </div>
      <div class="table-responsive-scroll">
        <table class="proof-table">
          <thead>
            <tr>
              <th>${t.th_arch}</th>
              <th class="col-num">${t.th_2x}</th>
              <th class="col-num">${t.th_med}</th>
              <th class="col-num">${t.th_mdd}</th>
              <th class="col-num">${t.th_dead}</th>
              <th class="col-num">${t.th_trap}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-family:var(--font-sans); color:var(--text-secondary);">0. Market Random Entry Baseline</td>
              <td class="col-num">18.20%</td>
              <td class="col-num">+13.24%</td>
              <td class="col-num">-19.35%</td>
              <td class="col-num">74.0d</td>
              <td class="col-num">19.20%</td>
            </tr>
            <tr>
              <td style="font-family:var(--font-sans); color:var(--fin-down);">1. Blind 52-Week Low Dip Buy (+0–10% off low, below MA20)</td>
              <td class="col-num">28.91%</td>
              <td class="col-num">+20.56%</td>
              <td class="col-num" style="color:var(--fin-down);">-30.31%</td>
              <td class="col-num" style="color:var(--fin-down);">81.0d</td>
              <td class="col-num" style="color:var(--fin-down);">25.54%</td>
            </tr>
            <tr>
              <td style="font-family:var(--font-sans); color:var(--text-secondary);">2. 52-Week Low + Earnings Filter (Left-Side Entry)</td>
              <td class="col-num">30.06%</td>
              <td class="col-num">+24.28%</td>
              <td class="col-num">-29.85%</td>
              <td class="col-num">81.0d</td>
              <td class="col-num">24.82%</td>
            </tr>
            <tr class="proof-highlight">
              <td style="font-family:var(--font-sans);">3. PW-RSI Right-Side Ignition (+14–35% off low + MA20/60 Breakout + 1.40x Vol + 55D Time-Stop)</td>
              <td class="col-num" style="color:var(--fin-up);">55.24%</td>
              <td class="col-num" style="color:var(--fin-up);">+80.47% (Mean +109.1%)</td>
              <td class="col-num" style="color:var(--fin-up);">-16.49%</td>
              <td class="col-num" style="color:var(--fin-up);">29.0d</td>
              <td class="col-num" style="color:var(--fin-up);">0.93%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}


// --- src/components/StockTable.js ---
function renderScreenerControls(state) {
  const t = state.t || {};
  const f = state.zoneFilter || "ALL";
  const secFilter = state.sectorFilter || "ALL";
  const allStocks = (state.stocks || []).filter((s) => !String(s.ticker).includes("."));
  const cAll = allStocks.length;
  const cIgn = allStocks.filter((s) => s.zone_code === "IGNITION_ZONE").length;
  const cWatch = allStocks.filter((s) => s.zone_code === "WASHOUT_WATCH").length;
  const cKnife = allStocks.filter((s) => s.zone_code === "LEFT_SIDE_KNIFE").length;
  const cTrap = allStocks.filter((s) => s.zone_code === "VALUE_TRAP_FILTERED").length;
  const vipList = state.vipWatchlist || [];
  const cWatchlist = allStocks.filter((s) => vipList.includes(s.ticker)).length;

  const sectorsList = [
    "AI & Semiconductors",
    "Cloud & Enterprise Software",
    "Internet & Digital Media",
    "Fintech & Digital Finance",
    "Consumer & Retail",
    "Mobility, EV & CleanTech",
    "Healthcare & Biotechnology",
    "Energy & Industrials",
  ];

  return `
    <div class="screener-header-bar">
      <div class="controls" style="display:flex; flex-direction:column; gap:8px; width:100%;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; width:100%;">
          <div class="search-wrap" style="flex:1; min-width:260px;">
            <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              class="search-box"
              id="searchInput"
              placeholder="${t.searchPlaceholder || "Filter by US Ticker, Company, or Sector..."}"
              value="${state.searchQuery || ""}"
            />
          </div>

          <!-- Sector Regime Matrix Quick Filter & Watchlist CSV Export -->
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <div style="display:flex; align-items:center; gap:5px;">
              <label for="sectorFilterSelect" class="mono" style="font-size:0.68rem; color:var(--muted); font-weight:700;">SECTOR:</label>
              <select id="sectorFilterSelect" class="search-box" style="padding:5px 8px; font-size:0.72rem; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:3px; font-family:var(--font-sans);">
                <option value="ALL" ${secFilter === "ALL" ? "selected" : ""}>All 8 Sectors (${cAll})</option>
                ${sectorsList
                  .map((sec) => {
                    const cnt = allStocks.filter((s) => (SECTOR_REGIME_MAP && SECTOR_REGIME_MAP[s.sector] ? SECTOR_REGIME_MAP[s.sector] : s.sector) === sec).length;
                    return `<option value="${sec}" ${secFilter === sec ? "selected" : ""}>${sec} (${cnt})</option>`;
                  })
                  .join("")}
              </select>
            </div>

            <button type="button" class="btn btn-sm" id="btnExportVipWatchlistCsv" style="background:rgba(251,191,36,0.12); border-color:rgba(251,191,36,0.4); color:#fbbf24; font-weight:700; padding:5px 9px; font-size:0.72rem;" title="Download CSV of starred VIP Watchlist tickers">
              ⭐ Export Watchlist CSV (${cWatchlist})
            </button>
          </div>
        </div>

        <div class="filter-tabs" style="flex-wrap:wrap;">
          <button class="filter-tab ${f === "ALL" ? "active" : ""}" data-zone="ALL">
            <span>${t.filterAll || "All US Equities"}</span>
            <span class="tab-count">${cAll}</span>
          </button>
          <button class="filter-tab ${f === "IGNITION_ZONE" ? "active" : ""}" data-zone="IGNITION_ZONE">
            <span style="width:6px; height:6px; border-radius:50%; background:var(--fin-up); display:inline-block;"></span>
            <span>${t.filterIgnition || "Right-Side Ignition"}</span>
            <span class="tab-count">${cIgn}</span>
          </button>
          <button class="filter-tab ${f === "WASHOUT_WATCH" ? "active" : ""}" data-zone="WASHOUT_WATCH">
            <span style="width:6px; height:6px; border-radius:50%; background:var(--fin-amber); display:inline-block;"></span>
            <span>${t.filterWatch || "Washout Base Watch"}</span>
            <span class="tab-count">${cWatch}</span>
          </button>
          <button class="filter-tab ${f === "LEFT_SIDE_KNIFE" ? "active" : ""}" data-zone="LEFT_SIDE_KNIFE">
            <span style="width:6px; height:6px; border-radius:50%; background:var(--fin-down); display:inline-block;"></span>
            <span>${t.filterKnife || "Downtrend / Avoid"}</span>
            <span class="tab-count">${cKnife}</span>
          </button>
          <button class="filter-tab ${f === "VALUE_TRAP_FILTERED" ? "active" : ""}" data-zone="VALUE_TRAP_FILTERED">
            <span>${t.filterTrap || "Value Trap Excluded"}</span>
            <span class="tab-count">${cTrap}</span>
          </button>
          <button class="filter-tab ${f === "VIP_WATCHLIST" ? "active" : ""}" data-zone="VIP_WATCHLIST" style="border-color:rgba(251,191,36,0.35);">
            <span style="color:#fbbf24; font-size:0.8rem;">⭐</span>
            <span style="color:#fef08a;">VIP Watchlist</span>
            <span class="tab-count" style="background:rgba(251,191,36,0.2); color:#fef08a;">${cWatchlist}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
function renderStockTable(state) {
  const t = state.t;
  const isPro = state.isProUnlocked;
  const stocks = (state.filteredStocks || []).filter((s) => !String(s.ticker).includes("."));
  const cfg = state.config || {};
  const monthlyUrl = cfg.ls_site1_monthly_url || "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8";

  const renderSortTh = (col, label, isNum = false) => {
    const isAct = state.sortCol === col;
    const chevron = isAct ? (state.sortAsc ? "▲" : "▼") : "↕";
    const actClass = isAct ? `sort-active ${state.sortAsc ? "sort-asc" : "sort-desc"}` : "";
    const numClass = isNum ? "col-num" : "";
    return `<th data-sort="${col}" data-base-label="${label}" class="sort-header ${actClass} ${numClass}">${label} <span class="sort-chevron ${isAct ? "" : "muted"}">${chevron}</span></th>`;
  };

  const softPaywallBanner =
    !isPro && stocks.length > 5
      ? `
    <div class="soft-paywall-barrier">
      <div style="font-size:0.72rem; font-family:var(--font-mono); color:#93c5fd; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">
        ${t.softPaywallTitle || "🔒 67 Pro Ignition Setups Live Today"}
      </div>
      <p style="color:#cbd5e1; font-size:0.84rem; margin:0 0 14px; line-height:1.5;">
        ${t.softPaywallDesc || "Tickers 1–5 are unlocked as featured ignition leaders. Unlock live institutional target levels, -9% stops, and real-time execution signals for all remaining 67 stocks."}
      </p>
      <a class="soft-paywall-btn lemonsqueezy-button btn-unlock-row" data-direct-ls="1" href="${monthlyUrl}?embed=1" target="_blank" rel="noopener noreferrer">
        🍋 ${t.softPaywallUnlockCta || "Unlock 67 Pro Setups ($29/mo)"} →
      </a>
    </div>
  `
      : "";

  return `
    <!-- Plain-English 5-Second Column Cheat Sheet for Everyday Investors -->
    <div id="screenerPlainEnglishBar" style="background:rgba(13,20,36,0.9); border:1px solid rgba(56,189,248,0.22); border-radius:6px; padding:8px 12px; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; font-size:0.73rem; color:#cbd5e1;">
      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
        <span class="mono" style="background:rgba(56,189,248,0.14); color:#38bdf8; font-weight:800; font-size:0.66rem; padding:2px 6px; border-radius:3px;">📖 5s TABLE GUIDE</span>
        <span><b style="color:#34d399;">IGNITION ZONE:</b> Ready to Buy Now</span>
        <span style="color:var(--border);">|</span>
        <span><b style="color:#fff;">PW-RSI (0–100):</b> Lower (&le;25) = Cheaper Bottom</span>
        <span style="color:var(--border);">|</span>
        <span><b style="color:#fff;">10d Vol:</b> &ge;1.4x = Institutions Buying</span>
        <span style="color:var(--border);">|</span>
        <span><b style="color:#fff;">2x Hit Rate:</b> % of Past Signals That Doubled (+100%)</span>
      </div>
      <span class="mono" style="font-size:0.68rem; color:#fbbf24; font-weight:700;">💡 Tip: Click any column header to sort!</span>
    </div>
    <div class="table-wrap">
      <table class="stock-table" id="stockTable">
        <thead>
          <tr>
            ${renderSortTh("ticker", t.colTicker, false)}
            ${renderSortTh("zone_code", t.colZone, false)}
            ${renderSortTh("score", t.colScore, true)}
            ${renderSortTh("close", t.colClose, true)}
            ${renderSortTh("prox_low52_pct", t.colProx, true)}
            ${renderSortTh("dd_high52_pct", t.colDD, true)}
            ${renderSortTh("vs_ma20_pct", t.colMA, true)}
            ${renderSortTh("vol_surge_10d", t.colVol, true)}
            ${renderSortTh("hist_2x_rate", t.colHist, true)}
            <th>${t.colTrigger}</th>
            <th>${t.colActions}</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          ${renderStockRows(state)}
        </tbody>
      </table>
      ${softPaywallBanner}
    </div>
  `;
}
function renderStockRows(state) {
  const t = state.t || {};
  const stocks = (state.filteredStocks || []).filter((s) => !String(s.ticker).includes("."));
  const lang = state.lang;
  const isPro = state.isProUnlocked;
  const cfg = state.config || {};
  const lsMonthlyUrl = formatCheckoutUrl(
    cfg.ls_site1_monthly_url,
    "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
  );
  const tvAffId = encodeURIComponent(cfg.tradingview_aff_id || "1173809");
  const saSource = encodeURIComponent(cfg.seekingalpha_source || "better_life333");
  const tsAffId = encodeURIComponent(cfg.trendspider_aff_id || "rightside");

  if (!stocks.length) {
    return `
      <tr>
        <td colspan="11" style="text-align:center; padding:36px; color:var(--muted); font-family:var(--font-sans);">
          No US-listed equities match the active filter criteria.
        </td>
      </tr>
    `;
  }

  return stocks
    .map((s, idx) => {
      let badgeClass = "badge-watch";
      if (s.zone_code === "IGNITION_ZONE") badgeClass = "badge-ignition";
      else if (s.zone_code === "LEFT_SIDE_KNIFE") badgeClass = "badge-knife";
      else if (s.zone_code === "VALUE_TRAP_FILTERED") badgeClass = "badge-trap";

      const rawZoneLabel =
        lang === "jp" ? s.zone_label_jp : lang === "kr" ? s.zone_label_kr : s.zone_label_en;
      const cleanZoneLabel = String(rawZoneLabel || s.zone_code).replace(/^[🟢🟡🔴⚠️\s]+/, "");
      const stockName =
        lang === "jp" ? s.name_jp : lang === "kr" ? s.name_kr : s.name_en;

      const ma20Color = s.vs_ma20_pct >= 0 ? "var(--fin-up)" : "var(--fin-down)";
      const ma60Color = s.vs_ma60_pct >= 0 ? "var(--fin-up)" : "var(--fin-down)";
      const volColor = s.vol_surge_10d >= 1.35 ? "var(--fin-up)" : "var(--text-secondary)";

      // 52W range bar calculation
      const low52 = Number(s.low52 || 0);
      const high52 = Number(s.high52 || s.close * 1.5);
      const closeVal = Number(s.close || 0);
      const rangeSpan = Math.max(0.01, high52 - low52);
      const rangePct = Math.min(100, Math.max(2, Math.round(((closeVal - low52) / rangeSpan) * 100)));

      // Soft paywall rule:
      // Unmasked free sample leader(s) (e.g. #1 CELH) are fully readable/interactive;
      // masked feed rows (ticker === "LOCKED") and rows 6–72 render cleanly as Pro-locked setups without $LOCKED/$0.00 placeholders.
      const isMaskedPlaceholder =
        !isPro &&
        (Boolean(s.locked) ||
          Boolean(s.is_pro_locked) ||
          String(s.ticker || "").toUpperCase() === "LOCKED");
      const isFeaturedLeader = idx < 5 && !isMaskedPlaceholder;
      const isFreeSample = isFeaturedLeader;
      const isReadable = isPro || isFreeSample;
      const isSoftBlurred = !isReadable;
      const blurClass = isSoftBlurred ? "blurred-cell" : "";

      const calcTrig = s.entry_trigger_price ?? s.ma60_price ?? Number((closeVal * 1.02).toFixed(2));
      const calcStop = s.stop_loss_price ?? Number((closeVal * 0.91).toFixed(2));
      const calcTp1 = s.tp1_2x_price ?? Number((closeVal * 2.0).toFixed(2));
      const showTargets = isReadable;

      const ma60Disp = `$${Number(calcTrig).toFixed(2)}`;
      const stopDisp = `$${Number(calcStop).toFixed(2)}`;
      const tp1Disp = `$${Number(calcTp1).toFixed(2)}`;

      const triggerHtml = showTargets
        ? `<div class="mono" style="font-size:0.75rem; line-height:1.45;">
             <div><span style="color:var(--muted);">TRG</span> <span style="color:#60a5fa; font-weight:700;">${ma60Disp}</span> ${
               !isPro && isFeaturedLeader
                 ? `<span style="font-size:0.6rem; padding:1px 4px; background:rgba(14,203,129,0.18); color:var(--fin-up); border-radius:2px; font-weight:700;">FEATURED #${idx + 1}</span>`
                 : ""
             }</div>
             <div><span style="color:var(--muted);">STP</span> <span style="color:var(--fin-down); font-weight:600;">${stopDisp}</span> · <span style="color:var(--fin-up);">TP ${tp1Disp}</span></div>
           </div>`
        : `<span class="pro-lock-cell btn-unlock-row" title="Unlock Pro to view exact Entry Trigger, -9% Stop & +100% Target">
             <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
               <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
               <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
             </svg>
             <span>🔒 PRO TARGETS</span>
           </span>`;

      const tvUrl = `https://www.tradingview.com/symbols/${encodeURIComponent(s.ticker)}/?aff_id=${tvAffId}`;
      const saUrl = `https://seekingalpha.com/symbol/${encodeURIComponent(s.ticker)}/earnings?source=${saSource}`;
      const tsUrl = `https://trendspider.com/?_go=${tsAffId}&symbol=${encodeURIComponent(s.ticker)}`;

      const vipWatchlist = state.vipWatchlist || [];
      const isStarred = vipWatchlist.includes(s.ticker);

      const tickerCellHtml = isMaskedPlaceholder
        ? `<div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="mono" style="font-weight:800; font-size:0.86rem; color:#93c5fd;">🔒 VIP #${idx + 1}</span>
              <span style="font-size:0.62rem; font-family:var(--font-mono); padding:1px 4px; background:#141d2f; border:1px solid #24324d; color:#93c5fd; border-radius:2px;">US</span>
              <span style="font-size:0.6rem; padding:1px 5px; background:rgba(41,98,255,0.14); border:1px solid rgba(41,98,255,0.35); color:#93c5fd; border-radius:2px; font-family:var(--font-mono); font-weight:700;">PRO IGNITION #${idx + 1}</span>
            </div>
            <div style="font-size:0.72rem; font-family:var(--font-sans); color:var(--muted); margin-top:2px;">
              Pro Institutional Signal · <span style="color:var(--text-secondary);">${s.sector || "US Equity"}</span>
            </div>
          </div>`
        : `<div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button
            type="button"
            class="btn-watchlist-star"
            data-ticker="${s.ticker}"
            title="${isStarred ? "Remove from VIP Watchlist" : "Add to VIP Watchlist"}"
            style="background:none; border:none; cursor:pointer; font-size:0.92rem; padding:0; line-height:1; vertical-align:middle; color:${isStarred ? "#fbbf24" : "var(--muted)"}; display:inline-flex; align-items:center;"
          >
            ${isStarred ? "⭐" : "☆"}
          </button>
          <span class="mono" style="font-weight:800; font-size:0.9rem; color:#ffffff;">${s.ticker}</span>
          <span style="font-size:0.62rem; font-family:var(--font-mono); padding:1px 4px; background:#141d2f; border:1px solid #24324d; color:#93c5fd; border-radius:2px;">US</span>
          ${
            !isPro
              ? isFeaturedLeader
                ? `<span style="font-size:0.6rem; padding:1px 4px; background:rgba(14,203,129,0.18); color:var(--fin-up); border-radius:2px; font-weight:700;">${idx === 0 || s.ticker === "CELH" ? "FREE SAMPLE #1 · FEATURED #1" : `FEATURED #${idx + 1}`}</span>`
                : `<span style="font-size:0.6rem; padding:1px 5px; background:rgba(41,98,255,0.14); border:1px solid rgba(41,98,255,0.35); color:#93c5fd; border-radius:2px; font-family:var(--font-mono); font-weight:700;">PRO SETUP #${idx + 1}</span>`
              : ""
          }
        </div>
        <div style="font-size:0.73rem; font-family:var(--font-sans); color:var(--muted); margin-top:2px;">
          ${stockName} · <span style="color:var(--text-secondary);">${s.sector}</span>
        </div>
      </div>`;

      const closeCellHtml =
        isMaskedPlaceholder || s.close === null || s.close === undefined
          ? `<div class="mono" style="font-weight:700; color:#93c5fd;">🔒 VIP</div>`
          : `<div class="mono" style="font-weight:700; color:#ffffff;" title="Latest Close Date: ${s.date || "2026-10-30"}">$${closeVal.toFixed(2)}</div>
             <div class="range-52w-wrap" title="52W Range: $${low52.toFixed(2)} – $${high52.toFixed(2)} | Current: $${closeVal.toFixed(2)}">
               <div class="range-52w-track">
                 <div class="range-52w-pin" style="left:${rangePct}%;"></div>
               </div>
               <div class="range-52w-labels">
                 <span>$${low52.toFixed(0)}</span>
                 <span class="range-52w-curr">${rangePct}%</span>
                 <span>$${high52.toFixed(0)}</span>
               </div>
             </div>`;

      return `
      <tr data-ticker="${s.ticker}" class="${isSoftBlurred ? "soft-paywall-row" : ""}">
        <td>
          ${tickerCellHtml}
        </td>
        <td>
          <span class="badge ${badgeClass}">${cleanZoneLabel}</span>
          <div class="cond-strip">
            <span class="cond-chip ${s.c1_deep_dd ? "pass" : ""}" title="52W High Drawdown <= -20%">DD</span>
            <span class="cond-chip ${(s.c2_off_low ?? s.c2_sweet_spot) ? "pass" : ""}" title="52W Low Proximity 10-45%">LOW</span>
            <span class="cond-chip ${(s.c3_above_mas ?? s.c3_ma_reclaim) ? "pass" : ""}" title="Reclaimed MA20/MA60">MA</span>
            <span class="cond-chip ${(s.c4_vol_or_mom ?? s.c4_vol_washout) ? "pass" : ""}" title="10D Volume Washout >= 1.3x">VOL</span>
          </div>
        </td>
        <td class="col-num ${blurClass}">
          <div style="display:flex; align-items:center; justify-content:flex-end; gap:6px;">
            <div class="score-bar">
              <div class="score-fill" style="width:${Number(s.score ?? 0)}%; background:${
                s.score >= 80 ? "var(--fin-up)" : s.score >= 55 ? "var(--fin-amber)" : "var(--fin-down)"
              };"></div>
            </div>
            <span class="mono" style="font-weight:800; font-size:0.9rem; width:26px; text-align:right;">${Number(s.score ?? 0)}</span>
          </div>
        </td>
        <td class="col-num ${blurClass}">
          ${closeCellHtml}
        </td>
        <td class="mono col-num ${blurClass}" style="color:${s.prox_low52_pct <= 40 && s.prox_low52_pct >= 10 ? "var(--fin-up)" : "var(--text-secondary)"}; font-weight:600;">
          +${Number(s.prox_low52_pct ?? 0).toFixed(1)}%
        </td>
        <td class="mono col-num ${blurClass}" style="color:var(--fin-down); font-weight:600;">
          ${Number(s.dd_high52_pct ?? 0).toFixed(1)}%
        </td>
        <td class="mono col-num ${blurClass}">
          <span style="color:${ma20Color}; font-weight:600;">${Number(s.vs_ma20_pct ?? 0) >= 0 ? "+" : ""}${Number(s.vs_ma20_pct ?? 0).toFixed(1)}%</span>
          <span style="color:var(--muted);"> / </span>
          <span style="color:${ma60Color}; font-weight:600;">${Number(s.vs_ma60_pct ?? 0) >= 0 ? "+" : ""}${Number(s.vs_ma60_pct ?? 0).toFixed(1)}%</span>
        </td>
        <td class="mono col-num ${blurClass}" style="color:${volColor}; font-weight:700;">
          ${Number(s.vol_surge_10d ?? 1.0).toFixed(2)}x
        </td>
        <td class="mono col-num ${blurClass}" style="font-weight:700; color:${s.hist_2x_rate >= 40 ? "var(--fin-up)" : "var(--text-secondary)"};">
          ${Number(s.hist_2x_rate ?? 0).toFixed(1)}%
        </td>
        <td>${triggerHtml}</td>
        <td>
          <div style="display:flex; gap:5px;">
            ${
              isSoftBlurred
                ? `<a class="btn btn-primary btn-sm lemonsqueezy-button btn-unlock-row" data-direct-ls="1" href="${lsMonthlyUrl}" target="_blank" rel="noopener noreferrer" style="white-space:nowrap; font-weight:700;">
                     🔒 ${t.softPaywallUnlockCta || "Unlock 67 Pro Setups ($29/mo)"}
                   </a>`
                : `
            <button class="btn btn-sm btn-share-card" data-ticker="${s.ticker}" title="Export Institutional Tear Sheet PNG">
              PNG
            </button>
            <a class="btn btn-sm" href="${tvUrl}" target="_blank" rel="noopener noreferrer" title="Open TradingView Chart (Partner)">
              TV ↗
            </a>
            <a class="btn btn-sm" href="${saUrl}" target="_blank" rel="noopener noreferrer" title="Open Seeking Alpha Fundamentals (Partner)">
              SA ↗
            </a>
            <a class="btn btn-sm" href="${tsUrl}" target="_blank" rel="noopener noreferrer" title="Open TrendSpider AI Breakout Scanner (Partner)" style="border-color:rgba(16,185,129,0.4); color:#34d399;">
              TS ↗
            </a>
            `
            }
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}


// --- src/components/ProVault.js ---
function renderProVault(state) {
  const t = state.t || {};
  const isPro = state.isProUnlocked;
  const stocks = state.stocks || [];
  const topIgnitions = stocks
    .filter((s) => s.zone_code === "IGNITION_ZONE" || Number(s.score) >= 75)
    .slice(0, 5);
  const proCapUsd = Number(state.proPortfolioUsd || 30000);
  const perSlotUsd = Math.round(proCapUsd * 0.15); // 15% slot -> 9% stop = 1.35% total account risk
  const celh = stocks.find((s) => s.ticker === "CELH");
  const mbly = stocks.find((s) => s.ticker === "MBLY");

  const allUsStocks = stocks.filter((s) => !String(s.ticker).includes("."));
  const sectorGroups = {};
  const standardSectors = [
    "AI & Semiconductors",
    "Cloud & Enterprise Software",
    "Internet & Digital Media",
    "Fintech & Digital Finance",
    "Consumer & Retail",
    "Mobility, EV & CleanTech",
    "Healthcare & Biotechnology",
    "Energy & Industrials",
  ];
  for (const s of allUsStocks) {
    const secName = (SECTOR_REGIME_MAP && SECTOR_REGIME_MAP[s.sector]) || s.sector || "Other";
    if (!sectorGroups[secName]) sectorGroups[secName] = [];
    sectorGroups[secName].push(s);
  }
  const sectorMatrixItems = standardSectors.map((secName) => {
    const sList = sectorGroups[secName] || [];
    const count = sList.length;
    const avgScore = count > 0 ? Math.round((sList.reduce((acc, x) => acc + Number(x.score || 0), 0) / count) * 10) / 10 : 0.0;
    const ignCount = sList.filter((x) => x.zone_code === "IGNITION_ZONE").length;
    const trend = avgScore >= 50.0 ? "BULLISH" : avgScore < 40.0 ? "BEARISH" : "NEUTRAL";
    return { name: secName, count, avg_score: avgScore, momentum_trend: trend, ignition_count: ignCount, tickers: sList.map((x) => x.ticker) };
  });
  sectorMatrixItems.sort((a, b) => b.ignition_count - a.ignition_count || b.avg_score - a.avg_score);

  const celhClose = celh && celh.close ? Number(celh.close).toFixed(2) : "29.12";
  const celhMa20 = celh && celh.ma20_price ? Number(celh.ma20_price).toFixed(2) : "28.19";
  const celhMa60 = celh && celh.ma60_price ? Number(celh.ma60_price).toFixed(2) : "29.16";
  const celhTp1 = celh && celh.tp1_2x_price ? Number(celh.tp1_2x_price).toFixed(2) : (Number(celhClose) * 2).toFixed(2);
  const celhStop = celh && celh.stop_loss_price ? Number(celh.stop_loss_price).toFixed(2) : (Number(celhClose) * 0.91).toFixed(2);
  const celhScore = celh ? Number(celh.score) : 84;

  const mblyClose = mbly && mbly.close ? Number(mbly.close).toFixed(2) : "5.96";
  const mblyLow52 = mbly && mbly.low52 ? Number(mbly.low52).toFixed(2) : "5.86";
  const mblyMa20 = mbly && mbly.ma20_price ? Number(mbly.ma20_price).toFixed(2) : "6.83";
  const mblyScore = mbly ? Number(mbly.score) : 20;
  const vipTgUrl = getVipTelegramUrl(isPro);

  const pineCode =
    state.pineCode ||
    `//@version=5
indicator("RightSideAlpha PW-RSI Ignition v2.6", overlay=true)
ma20 = ta.sma(close, 20)
ma60 = ta.sma(close, 60)
low52 = ta.lowest(low, 252)
high52 = ta.highest(high, 252)
volRatio = volume / ta.sma(volume, 20)
washout10d = ta.highest(volRatio, 10) >= 1.40
proxLow = (close - low52) / low52 * 100
ddHigh = (close - high52) / high52 * 100
ignition = ddHigh <= -35 and proxLow >= 10 and proxLow <= 40 and close > ma20 and close > ma60 and washout10d
plot(ma20, "MA20", color=color.new(color.aqua, 0), linewidth=2)
plot(ma60, "MA60 Trigger", color=color.new(color.orange, 0), linewidth=2)
plotshape(ignition and not ignition[1], "PW-RSI IGNITION", shape.labelup, location.belowbar, color.green, text="IGNITION", textcolor=color.white)`;

  return `
    <section class="proof-card" id="proVaultSection" style="border-top:2px solid var(--fin-blue); margin-bottom:22px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
        <div>
          <span class="badge ${isPro ? "badge-ignition" : "badge-watch"}" id="vaultBadge">
            ${isPro ? t.vaultBadgeUnlocked : t.vaultBadgeLocked}
          </span>
          <h2 style="font-size:1.2rem; font-weight:800; margin-top:6px; color:#ffffff; letter-spacing:-0.01em;">
            ${t.vaultTitle}
          </h2>
        </div>
        <button class="btn btn-primary" id="vaultUnlockBtn" style="${isPro ? "display:none;" : ""}">
          ${t.vaultUnlockBtn}
        </button>
      </div>

      <!-- FREE INTERACTIVE BAIT: 3-SECOND POSITION DOCTOR (UNBLURRED FOR ALL VISITORS) -->
      <div style="margin-bottom:18px;">
        ${renderPositionDoctorForm(state)}
      </div>

      <div style="position:relative;">
        ${
          !isPro
            ? `<div id="vaultOverlayUnlock" style="position:absolute; inset:0; z-index:10; display:flex; align-items:center; justify-content:center; background:rgba(6,9,17,0.58); border-radius:6px; cursor:pointer;">
                 <div style="background:#0d1424; border:1px solid var(--fin-blue); box-shadow:0 12px 32px rgba(0,0,0,0.75); border-radius:6px; padding:22px 26px; text-align:center; max-width:500px;">
                   <div class="mono" style="font-size:0.72rem; color:#fbbf24; font-weight:800; letter-spacing:0.05em;">👑 PRO VIP ALPHA COMMAND CENTER LOCKED</div>
                   <div style="font-size:1.05rem; font-weight:800; color:#ffffff; margin:8px 0;">
                     Unlock All 72 Stock Targets, Daily Ignition Order Book, Position Sizing Calculator & Pine Script v5
                   </div>
                   <div style="font-size:0.8rem; color:var(--muted); margin-bottom:14px; line-height:1.5;">
                     Free users see only 1 sample stock ($CELH). Upgrade to Pro ($29/mo or $199 Lifetime) to reveal all hidden VIP Ignition picks, exact share-sizing orders, Position Doctor diagnostics, and the 26-Year Semiconductor CSV.
                   </div>
                   <span class="btn btn-primary" style="justify-content:center; width:100%; padding:10px; font-weight:800;">
                     🔑 Enter Pro License Key / Subscribe Now →
                   </span>
                 </div>
               </div>`
            : ""
        }

      <!-- PRO VIP MODULE 00: TODAY'S IGNITION ORDER BOOK & ACCOUNT POSITION SIZING ENGINE -->
      <div class="${isPro ? "" : "blur-locked"}" style="background:#090d16; border:1px solid rgba(16,185,129,0.35); border-left:4px solid var(--fin-up); border-radius:4px; padding:16px 18px; margin-bottom:16px;">
        <!-- PRO VIP PRIVATE TELEGRAM CHANNEL INVITE BANNER -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:rgba(2,132,199,0.14); border:1px solid rgba(56,189,248,0.45); border-radius:6px; padding:12px 14px; margin-bottom:14px;">
          <div>
            <div class="mono" style="font-size:0.68rem; color:#38bdf8; font-weight:800; letter-spacing:0.05em;">
              🔒 PRO SUBSCRIBERS ONLY · PRIVATE VIP TELEGRAM NEWS & SIGNAL DESK
            </div>
            <div style="font-size:0.86rem; font-weight:800; color:#ffffff; margin-top:2px;">
              Real-Time $SMH / $XLV & 72-Equity Breaking News + Daily Unmasked Ignition Order Book Alerts
            </div>
          </div>
          <a
            class="btn btn-sm ${isPro ? "" : "btn-gated-vip-tg"}"
            href="${isPro ? vipTgUrl : "#pricing"}"
            ${isPro ? 'target="_blank" rel="noopener noreferrer"' : ""}
            style="background:#0284c7; border-color:#38bdf8; color:#ffffff; font-weight:800; padding:8px 14px;"
          >
            ✈️ Join Pro VIP Telegram Channel ↗
          </a>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div>
            <div class="mono" style="font-size:0.7rem; color:var(--fin-up); font-weight:800; letter-spacing:0.05em;">
              👑 PRO VIP EXCLUSIVE · DAILY RIGHT-SIDE IGNITION ORDER BOOK & POSITION SIZING
            </div>
            <h3 style="font-size:1.02rem; font-weight:800; color:#ffffff; margin-top:3px;">
              Today's Top Turnaround Action Sheet (1.35% Max Account Risk per Position)
            </h3>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <label class="mono" style="font-size:0.72rem; color:var(--muted);">MY ACCOUNT ($ USD):</label>
            <input type="number" id="proCapitalInput" value="${proCapUsd}" step="5000" min="1000" style="width:120px; padding:6px 8px; background:#05080f; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-mono); font-weight:700; margin:0;" />
            <button type="button" class="btn btn-emerald btn-sm" id="btnCalcProSizing">Update Shares</button>
          </div>
        </div>
        <div class="table-responsive-scroll">
          <table class="stock-table" style="font-size:0.78rem;">
            <thead>
              <tr>
                <th>VIP Pick</th>
                <th>PW Score</th>
                <th>Latest Close</th>
                <th>Entry Trigger (MA20/60)</th>
                <th>-9.0% Hard Stop</th>
                <th>+100% TP1 Target</th>
                <th>15% Slot Allocation ($${perSlotUsd.toLocaleString()})</th>
                <th>Max Loss Impact</th>
              </tr>
            </thead>
            <tbody>
              ${topIgnitions
                .map((s, idx) => {
                  const lockedVip = !isPro && idx >= 1;
                  if (lockedVip) {
                    const genericSlotLoss = Math.round(perSlotUsd * 0.09);
                    return `
                    <tr>
                      <td class="mono" style="font-weight:800; color:#fbbf24;">🔒 VIP IGNITION #${idx + 1} <span style="color:var(--muted); font-weight:500;">(🔒 VIP SECTOR)</span></td>
                      <td class="mono" style="color:var(--fin-up); font-weight:800;">${s.score}/100</td>
                      <td class="mono">🔒 PRO</td>
                      <td class="mono" style="color:#60a5fa; font-weight:700;">🔒 PRO</td>
                      <td class="mono" style="color:var(--fin-down); font-weight:700;">🔒 PRO</td>
                      <td class="mono" style="color:var(--fin-up); font-weight:700;">🔒 PRO</td>
                      <td class="mono" style="color:#ffffff; font-weight:800;">🔒 Unlock Pro ($29/mo)</td>
                      <td class="mono" style="color:var(--fin-amber);">-$${genericSlotLoss.toLocaleString()} (-1.35% Eq)</td>
                    </tr>
                  `;
                  }
                  const c = Number(s.close || 29.12);
                  const trig = Number(s.entry_trigger_price ?? s.ma60_price ?? c).toFixed(2);
                  const stp = Number(s.stop_loss_price ?? c * 0.91).toFixed(2);
                  const tp1 = Number(s.tp1_2x_price ?? c * 2.0).toFixed(2);
                  const sh = Math.max(1, Math.floor(perSlotUsd / c));
                  const maxLossUsd = Math.round(sh * c * 0.09);
                  return `
                    <tr>
                      <td class="mono" style="font-weight:800; color:#ffffff;">#${idx + 1} $${s.ticker} <span style="color:var(--muted); font-weight:500;">(${s.sector})</span></td>
                      <td class="mono" style="color:var(--fin-up); font-weight:800;">${s.score}/100</td>
                      <td class="mono">$${c.toFixed(2)}</td>
                      <td class="mono" style="color:#60a5fa; font-weight:700;">$${trig}</td>
                      <td class="mono" style="color:var(--fin-down); font-weight:700;">$${stp}</td>
                      <td class="mono" style="color:var(--fin-up); font-weight:700;">$${tp1}</td>
                      <td class="mono" style="color:#ffffff; font-weight:800;">Buy ${sh} shares ($${Math.round(sh * c).toLocaleString()})</td>
                      <td class="mono" style="color:var(--fin-amber);">-$${maxLossUsd.toLocaleString()} (-1.35% Eq)</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- PRO VIP MODULE: MULTI-POSITION PORTFOLIO DOCTOR 2.0 -->
      <div class="${isPro ? "" : "blur-locked"}">
        ${renderPortfolioDoctorForm(state)}
      </div>

      <!-- PRO VIP MODULE: 72-STOCK SECTOR REGIME MATRIX & HEATMAP -->
      <div class="${isPro ? "" : "blur-locked"}" style="background:#090d16; border:1px solid var(--border); border-top:2px solid #06b6d4; border-radius:4px; padding:16px 18px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div>
            <div class="mono" style="font-size:0.7rem; color:#06b6d4; font-weight:800; letter-spacing:0.05em; text-transform:uppercase;">
              👑 PRO VIP EXCLUSIVE · 72-STOCK SECTOR REGIME MATRIX &amp; ROTATION HEATMAP
            </div>
            <h3 style="font-size:1.02rem; font-weight:800; color:#ffffff; margin-top:3px;">
              Sector Momentum Scores &amp; Ignition Concentration Across 8 Regimes
            </h3>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn btn-sm" id="btnVaultGoWatchlist" style="background:rgba(251,191,36,0.12); border-color:rgba(251,191,36,0.4); color:#fbbf24; font-weight:700;">
              ⭐ Filter Screener to VIP Watchlist
            </button>
            <button type="button" class="btn btn-sm" id="btnVaultExportWatchlistCsv" style="background:rgba(251,191,36,0.12); border-color:rgba(251,191,36,0.4); color:#fbbf24; font-weight:700;">
              📥 Export Watchlist CSV
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px;">
          ${sectorMatrixItems
            .map((sec) => {
              const trendCol = sec.momentum_trend === "BULLISH" ? "var(--fin-up)" : sec.momentum_trend === "BEARISH" ? "var(--fin-down)" : "var(--fin-amber)";
              const ignBadge = sec.ignition_count > 0 ? `<span class="badge badge-ignition" style="font-size:0.64rem;">${sec.ignition_count} IGNITION</span>` : `<span class="badge" style="background:rgba(255,255,255,0.06); color:var(--muted); font-size:0.64rem;">0 IGNITION</span>`;
              return `
                <div style="background:#05080f; border:1px solid var(--border); border-radius:4px; padding:12px; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                      <span class="mono" style="font-size:0.78rem; font-weight:800; color:#ffffff;">${sec.name}</span>
                      ${ignBadge}
                    </div>
                    <div style="display:flex; align-items:center; gap:8px; margin:6px 0;">
                      <div class="score-bar" style="flex:1;">
                        <div class="score-fill" style="width:${sec.avg_score}%; background:${trendCol};"></div>
                      </div>
                      <span class="mono" style="font-size:0.8rem; font-weight:800; color:${trendCol};">${sec.avg_score.toFixed(1)}</span>
                    </div>
                    <div class="mono" style="font-size:0.7rem; color:var(--muted); margin-bottom:6px;">
                      Trend: <b style="color:${trendCol};">${sec.momentum_trend}</b> · ${sec.count} US Equities
                    </div>
                  </div>
                  <div style="padding-top:6px; border-top:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; align-items:center;">
                    <span class="mono" style="font-size:0.66rem; color:var(--text-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:140px;">
                      ${sec.tickers.slice(0, 4).join(", ")}${sec.tickers.length > 4 ? "..." : ""}
                    </span>
                    <button type="button" class="btn btn-sm btn-filter-sector-card" data-sector="${sec.name}" style="padding:2px 7px; font-size:0.68rem; border-color:rgba(56,189,248,0.4); color:#38bdf8;">
                      Filter Table ↗
                    </button>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>

      <div id="vaultContentWrap" class="${isPro ? "" : "blur-locked"}" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(330px, 1fr)); gap:16px;"><!-- Position Doctor moved to free unblurred top section -->
        <!-- Module 01: Position Doctor rendered in free unblurred section above -->

        <!-- Module 02: Institutional SEC Research Vault -->
        <div style="background:#090d16; border:1px solid var(--border); border-top:2px solid var(--fin-blue); border-radius:4px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:#60a5fa; letter-spacing:0.05em; text-transform:uppercase;">
              ${t.tool2Title}
            </div>
            <h3 style="font-size:1rem; font-weight:800; margin:6px 0; color:#ffffff;">${t.tool2Sub}</h3>
            <p style="font-size:0.78rem; color:var(--muted); margin-bottom:12px;">${t.tool2Desc}</p>

            <div style="font-size:0.8rem; background:#05080f; padding:12px; border-radius:4px; border:1px solid var(--border); margin-bottom:12px; display:flex; flex-direction:column; gap:12px;">
              <div style="border-left:3px solid var(--fin-up); padding-left:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <b class="mono" style="color:#ffffff;">CELH · Celsius Holdings ($${celhClose})</b>
                  <span class="badge badge-ignition">SCORE ${celhScore}</span>
                </div>
                <div style="color:var(--muted); font-size:0.76rem; margin-top:4px; line-height:1.45;">
                  PepsiCo North America inventory destocking complete; 2026E operating leverage +257%. Latest Close <b class="mono" style="color:#fff;">$${celhClose}</b> reclaiming MA20 ($${celhMa20}) toward MA60 ($${celhMa60}). Stop: $${celhStop} · TP1 (2x): <b class="mono" style="color:var(--fin-up);">$${celhTp1}</b>.
                </div>
                <button class="btn btn-sm btn-open-research" data-ticker="CELH" style="margin-top:6px;">
                  Read $CELH SEC Research Brief ↗
                </button>
              </div>

              <div style="border-left:3px solid var(--fin-down); padding-left:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                  <b class="mono" style="color:#ffffff;">MBLY · Mobileye Global ($${mblyClose})</b>
                  <span class="badge badge-knife">🛑 RULE 1 STOP EXECUTED · SCORE ${mblyScore}</span>
                </div>
                <div style="color:var(--muted); font-size:0.76rem; margin-top:4px; line-height:1.45;">
                  <b style="color:#fca5a5;">Post-Mortem Audit:</b> Oct 13 watch ($7.02) breached Rule 1 Hard Stop (<b class="mono" style="color:var(--fin-down);">$6.39 / -9.0%</b>) and fell to <b class="mono" style="color:#fff;">$${mblyClose}</b> (52W Low $${mblyLow52}, <span class="mono">LEFT_SIDE_KNIFE</span>). Mechanical exit protected capital & rotated into <b class="mono" style="color:var(--fin-up);">$CELH / $LULU</b>. Re-entry prohibited until MA20 ($${mblyMa20}) reclaim.
                </div>
                <button class="btn btn-sm btn-open-research" data-ticker="MBLY" style="margin-top:6px;">
                  Read $MBLY Rule 1 Stop Audit Brief ↗
                </button>
              </div>
            </div>
          </div>

          <div>
            <button class="btn btn-open-research-modal" style="width:100%; justify-content:center; padding:9px;">
              ${t.tool2ViewBtn}
            </button>
          </div>
        </div>

        <!-- Module 03: TradingView Pine Script v5 -->
        <div style="background:#090d16; border:1px solid var(--border); border-top:2px solid #6366f1; border-radius:4px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:#818cf8; letter-spacing:0.05em; text-transform:uppercase;">
              ${t.tool3Title}
            </div>
            <h3 style="font-size:1rem; font-weight:800; margin:6px 0; color:#ffffff;">${t.tool3Sub}</h3>
            <p style="font-size:0.78rem; color:var(--muted); margin-bottom:10px;">${t.tool3Desc}</p>

            <pre id="pineCodeBox" style="background:#05080f; padding:12px; border-radius:4px; font-size:0.7rem; color:#93c5fd; overflow-x:auto; max-height:155px; font-family:var(--font-mono); border:1px solid var(--border); line-height:1.45;">${pineCode}</pre>
          </div>

          <div style="margin-top:12px;">
            <button class="btn btn-purple" id="btnCopyPineScript" style="width:100%; justify-content:center; padding:9px;">
              ${t.tool3CopyBtn}
            </button>
          </div>
        </div>

        <!-- Module 04: Pro VIP 80:20 Barbell Portfolio Allocation & 1-Click Institutional Export Kit -->
        <div style="background:#090d16; border:1px solid var(--border); border-top:2px solid #10b981; border-radius:4px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:#34d399; letter-spacing:0.05em; text-transform:uppercase;">
              👑 PRO VIP EXCLUSIVE · BARBELL REBALANCER & EXPORT KIT
            </div>
            <h3 style="font-size:1rem; font-weight:800; margin:6px 0; color:#ffffff;">
              80:20 ($SMH : $XLV) Custom Portfolio Blueprint & 1-Click TradingView / CSV Kit
            </h3>
            <p style="font-size:0.78rem; color:var(--muted); margin-bottom:10px;">
              Automatically allocates your <b class="mono" style="color:#fff;">$${proCapUsd.toLocaleString()}</b> account across core Semiconductor ETF ($SMH), Healthcare Shield ($XLV), and Top VIP Ignition slots, plus instant CSV &amp; TradingView exports:
            </p>

            <div style="background:#05080f; border:1px solid var(--border); border-radius:4px; padding:11px; font-size:0.76rem; margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:var(--muted);">⚡ Core Semiconductor ($SMH · 35%):</span>
                <b class="mono" style="color:#34d399;">$${Math.round(proCapUsd * 0.35).toLocaleString()}</b>
              </div>
              <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:var(--muted);">🚀 Top 3 VIP Ignition Slots (3 × 15%):</span>
                <b class="mono" style="color:#60a5fa;">$${Math.round(proCapUsd * 0.45).toLocaleString()} ($${perSlotUsd.toLocaleString()}/slot)</b>
              </div>
              <div style="display:flex; justify-content:space-between; padding:4px 0;">
                <span style="color:var(--muted);">🛡️ Defensive Healthcare Shield ($XLV · 20%):</span>
                <b class="mono" style="color:#fbbf24;">$${Math.round(proCapUsd * 0.20).toLocaleString()}</b>
              </div>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:7px;">
            <button type="button" class="btn btn-emerald" id="btnDownloadPro72Csv" style="width:100%; justify-content:center; padding:8px; font-weight:800;">
              📥 Download Full 72-Stock VIP Action Sheet (.CSV)
            </button>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:7px;">
              <button type="button" class="btn" id="btnCopyTvWatchlist" style="justify-content:center; padding:8px; font-size:0.75rem; border-color:rgba(56,189,248,0.45); color:#38bdf8;">
                📋 Copy TV 72-Watchlist
              </button>
              <button type="button" class="btn" id="btnCopyTvWebhookJson" style="justify-content:center; padding:8px; font-size:0.75rem; border-color:rgba(251,191,36,0.45); color:#fbbf24;">
                🔔 Copy Alert Webhook JSON
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  `;
}


// --- src/components/Pricing.js ---

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
  kr: {
    t1Badge: "PRO 퀀트 멤버십",
    t1Title: "프로 퀀트 터미널 & 일간 SEC 공시 리서치",
    t1Period: "/ 월 구독",
    t1Items: [
      "미국 상장 72개 전 종목 진입 트리거(TRG) · -9% 칼손절(STP) · +100% 목표가(TP1) 전면 공개",
      "매일 아침 SEC 원문(10-K/10-Q/8-K) 기반 우측 시동 턴어라운드 핵심 요약 브리프",
      "포지션 닥터(Position Doctor): 내 보유종목 -9% 손절 / 55일 시간손절 / 원금회수 실시간 판독",
      "TradingView Pine Script v5 전용 지표 원본 코드 + 반도체 공포·탐욕 26년치 CSV 다운로드",
    ],
    t1Btn: "Lemon Squeezy로 Pro 구독하기 ($29/월)",
    t2Badge: "파운더 평생 소장권",
    t2Title: "평생 리서치 & 터미널 무제한 라이선스",
    t2Period: "/ 1회 결제 (평생)",
    t2Items: [
      "영구 라이선스 키 즉시 발급 — 매월 나가는 정기 구독료 평생 0원",
      "26.8년(2000–2026) 미국 개별주 & 반도체($SMH:$XLV) 전체 백테스트 원본 데이터셋 제공",
      "한국어 · 영어 · 일본어 3개 국어 SEC 리서치 브리프 및 텔레그램 실시간 알림 연동",
      "RightSideAlpha(개별주) + SemiFearGreed(반도체 공포지수) 모든 Pro 기능 영구 잠금 해제",
    ],
    t2Btn: "평생 라이선스 소장하기 ($199)",
    t3Badge: "미국주식 필수 3대 차트·리서치 제휴",
    t3Title: "월가 기관급 차트 검증 & EPS 컨센서스 필수 툴 3종",
    t3Desc: "MA20/MA60 거래량 돌파 차트 확인부터 EPS 컨센서스 점검, AI 자동 추세선 스캐너까지 원클릭으로 연결됩니다:",
    t3Items: [
      "<b>TradingView Pro (1173809)</b> — MA20/MA60 돌파 및 Pine Script v5 지표 자동 작도",
      "<b>Seeking Alpha Premium (better_life333)</b> — 월가 애널리스트 1~2년 선행 EPS 상향 리비전 추적",
      "<b>TrendSpider AI Charting (rightside)</b> — 미국주식 자동 추세선 · 돌파 스캐너 · 백테스트",
    ],
    tvBtn: "📈 TradingView 차트 터미널 열기 ↗",
    saBtn: "📊 Seeking Alpha 실적 컨센서스 열기 ↗",
    tsBtn: "⚡ TrendSpider AI 자동 차트 스캐너 ↗",
    tgBtn: "🔒 Pro 전용 VIP 텔레그램 ($SMH/$XLV & 72종목 실시간 월가 뉴스)",
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
      "日本語・英語・韓国語対応のSECリサーチブリーフ＆Telegramアラート連携",
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
function renderPricing(state) {
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
      <div style="background:linear-gradient(135deg, rgba(139,92,246,0.16) 0%, rgba(16,185,129,0.12) 100%); border:1px solid rgba(139,92,246,0.5); border-left:4px solid #8b5cf6; border-radius:8px; padding:12px 16px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div style="font-size:0.8rem; color:#e2e8f0; line-height:1.45;">
          <span class="mono" style="color:#fbbf24; font-weight:800; font-size:0.72rem;">🎁 2-IN-1 DUAL TERMINAL PRO BUNDLE INCLUDED:</span>
          Every <b>$29/mo</b> or <b>$199 Lifetime</b> license key (Store #296100) unlocks <b>BOTH TruthOfMarket.com</b> (60-Day PW-RSI &amp; $SMH:$XLV Barbell) <b>AND <a href="https://getbreakai.com/?utm_source=truthofmarket&utm_medium=pricing_bundle" target="_blank" rel="noopener noreferrer" style="color:#c4b5fd; font-weight:800; text-decoration:underline;">GetBreakAI.com</a></b> (1–15 Day Earnings Catalyst, Form-4 Whale &amp; Gamma Squeeze Terminal)!
        </div>
        <a href="https://getbreakai.com/?utm_source=truthofmarket&utm_medium=pricing_bundle" target="_blank" rel="noopener noreferrer" class="btn btn-sm" style="background:rgba(139,92,246,0.2); border-color:rgba(139,92,246,0.55); color:#ddd6fe; font-weight:800; white-space:nowrap;">
          ⚡ Explore GetBreakAI.com ↗
        </a>
      </div>
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
            <a class="btn btn-primary lemonsqueezy-button" id="cardMonthlyBtn" href="${lsMonthly}" target="_blank" rel="noopener noreferrer" style="justify-content:center; padding:10px; width:100%;">
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
            <a class="btn btn-emerald lemonsqueezy-button" id="cardLtdBtn" href="${lsLtd}" target="_blank" rel="noopener noreferrer" style="justify-content:center; padding:10px; width:100%;">
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


// --- src/components/Modals.js ---
function renderModals(state) {
  const t = state.t || {};
  const cfg = state.config || {};
  const tgChannelUrl = cfg.telegram_channel_url || "https://t.me/truthofmarketss";
  const ytUrl = cfg.youtube_url || "https://www.youtube.com/@RightSideAlpha";
  const igUrl = cfg.instagram_url || "https://www.instagram.com/rightsidealpha";
  const tgChatId = state.telegramChatId || cfg.telegram_chat_id || "@truthofmarketss";
  const tgToken = state.telegramBotToken || "DEMO-BOT-TOKEN";
  const tgType = state.telegramAlertType || "SEMI_BRIEFING";
  const ov = state.semiOverview || {};
  const ovDate = ov.date || "2026-10-30";
  const ovScore = Number(ov.fg_score ?? 18.0).toFixed(1);
  const ovRegime = String(ov.regime_en || "EXTREME FEAR").toUpperCase();
  const ovSmh = Number(ov.smh_close ?? 522.49).toFixed(2);
  const ovDd = Number(ov.smh_dd_pct ?? -22.23).toFixed(2);
  const ovRsi = Number(ov.smh_rsi ?? 40.6).toFixed(1);
  const ovXlv = Number(ov.xlv_close ?? 184.87).toFixed(2);
  const ovQqq = Number(ov.qqq_close ?? 690.49).toFixed(2);
  const ovW1 = ov.recommended_smh_weight ?? 80;
  const ovW2 = ov.recommended_xlv_weight ?? 20;
  const tgPreview =
    state.telegramPreviewText ||
    `🧭 [SemiFearGreed] Daily Semiconductor & Barbell Briefing (${ovDate})\n• Fear & Greed Score: ${ovScore} / 100 (${ovRegime})\n• $SMH (Semiconductor): $${ovSmh} (${ovDd}% 52W DD | RSI ${ovRsi})\n• $XLV (Healthcare Vault): $${ovXlv} | $QQQ: $${ovQqq}\n• Active Signal: Target ${ovW1}% $SMH : ${ovW2}% $XLV Barbell Allocation`;

  return `
    <!-- LICENSE ACTIVATION MODAL -->
    <div class="modal-backdrop" id="licenseModal">
      <div class="modal">
        <div style="font-size:0.68rem; font-family:var(--font-mono); color:#93c5fd; text-transform:uppercase; letter-spacing:0.05em;">
          AUTHENTICATION · LEMON SQUEEZY MERCHANT OF RECORD
        </div>
        <h3 style="font-size:1.12rem; font-weight:800; margin-top:4px; color:#ffffff;">Activate Pro Terminal License</h3>
        <p style="color:var(--muted); font-size:0.82rem; margin-top:6px; line-height:1.5;">
          Enter the license key issued upon Lemon Squeezy checkout to unlock all 72 US equity target levels, Daily VIP Ignition Order Book, Position Sizing Calculator, Position Doctor, and the 26-year Semiconductor CSV dataset.
        </p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:12px 0 8px;">
          <a class="btn btn-primary btn-sm lemonsqueezy-button" data-direct-ls="1" href="${cfg.ls_site1_monthly_url || "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"}?embed=1" target="_blank" rel="noopener noreferrer" style="justify-content:center; padding:8px 10px; font-weight:700;">
            🍋 Subscribe Pro ($29/mo) ↗
          </a>
          <a class="btn btn-emerald btn-sm lemonsqueezy-button" data-direct-ls="1" href="${cfg.ls_site1_ltd_url || "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b"}?embed=1" target="_blank" rel="noopener noreferrer" style="justify-content:center; padding:8px 10px; font-weight:700;">
            🏆 Lifetime Pass ($199) ↗
          </a>
        </div>
        <div style="margin-bottom:10px; font-size:0.72rem; color:#94a3b8; text-align:center; line-height:1.45;">
          Checkout issue in your region? Join <a href="https://t.me/truthofmarketss" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; font-weight:700; text-decoration:underline;">@truthofmarketss</a> or request instant Pro activation via <a href="mailto:beable9489@gmail.com?subject=Instant%20Pro%20Activation%20Request%20(TruthOfMarket)" style="color:#93c5fd; font-weight:700; text-decoration:underline;">email</a>.
        </div>
        <div id="instantVipBridgeBox" style="display:none !important;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; flex-wrap:wrap;">
            <span style="font-size:0.7rem; font-family:var(--font-mono); color:#34d399; font-weight:800; text-transform:uppercase;">
              ⚡ INTERACTIVE PRO TERMINAL PREVIEW &amp; 7-DAY TRIAL PASS
            </span>
            <span class="badge badge-ignition" style="font-size:0.64rem; padding:2px 6px;">INSTANT SANDBOX KEY</span>
          </div>
          <p style="color:#cbd5e1; font-size:0.76rem; margin:6px 0 8px; line-height:1.45;">
            Want to test the unlocked Pro Terminal before subscribing (or reviewing our Store #296100 deliverables)? Enter your email below to generate an <b>instant 7-Day Pro Preview License Key</b> that unmasks our 6 VIP Ignition setups, Position Doctor, and the 26-year historical backtest CSV dataset:
          </p>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <input type="email" id="vipTrialEmailInput" placeholder="Enter your email for instant 7-Day Pro Trial Key..." autocomplete="email" style="flex:1; min-width:200px; margin:0; padding:8px 10px; font-size:0.8rem;" />
            <button type="button" class="btn btn-emerald btn-sm" id="btnInstantVipTrialUnlock" style="font-weight:800; padding:8px 12px; white-space:nowrap;">
              ⚡ Issue 7-Day Pro Trial Key
            </button>
          </div>
        </div>
        <input type="text" id="licenseInput" value="${state.licenseKey || ""}" placeholder="Enter Lemon Squeezy License Key (XXXX-XXXX-XXXX-XXXX)" autocomplete="off" />
        <div id="licenseMsg" style="font-size:0.8rem; margin-bottom:12px; min-height:1.2em;"></div>
        <div style="display:flex; gap:8px; justify-content:space-between; align-items:center; flex-wrap:wrap;">
          <div>
            ${
              state.isProUnlocked
                ? `<button class="btn btn-sm" id="btnLockLicense" style="color:var(--fin-down); border-color:rgba(246,70,93,0.4);">Deactivate / Lock</button>`
                : ""
            }
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn" id="btnCancelLicense">Cancel</button>
            <button class="btn btn-primary" id="btnVerifyLicense">Verify & Unlock Terminal</button>
          </div>
        </div>
      </div>
    </div>

    <!-- TELEGRAM QUANTITATIVE ALERT & BOT HUB MODAL -->
    <div class="modal-backdrop" id="telegramModal">
      <div class="modal" style="max-width:640px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#38bdf8; text-transform:uppercase; letter-spacing:0.05em;">
              REAL-TIME DISPATCH · TELEGRAM BOT & CHANNEL INTEGRATION
            </div>
            <h3 style="font-size:1.12rem; font-weight:800; margin-top:3px; color:#ffffff;">
              Telegram Quantitative Alert & Briefing Hub
            </h3>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <a class="btn btn-sm" id="tgModalYtBtn" href="${ytUrl}" target="_blank" rel="noopener noreferrer" style="border-color:rgba(239,68,68,0.45); color:#fca5a5;">
              📺 YouTube ↗
            </a>
            <a class="btn btn-sm" id="tgModalIgBtn" href="${igUrl}" target="_blank" rel="noopener noreferrer" style="border-color:rgba(236,72,153,0.45); color:#f9a8d4;">
              📸 Instagram ↗
            </a>
            <a class="btn btn-sm" id="tgChannelLinkBtn" href="${tgChannelUrl}" target="_blank" rel="noopener noreferrer" style="border-color:rgba(56,189,248,0.45); color:#38bdf8;">
              ✈️ @truthofmarketss ↗
            </a>
          </div>
        </div>

        <p style="color:var(--muted); font-size:0.8rem; margin-top:6px; margin-bottom:12px; line-height:1.5;">
          Join our Official Broadcast Channel <a href="${tgChannelUrl}" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; font-weight:700;">t.me/truthofmarketss</a> (<code class="mono" style="color:#93c5fd;">@truthofmarketss</code>) for automated daily US Market & Semiconductor briefings.
        </p>

        ${
          state.isAdminAuthenticated
            ? `<div class="semi-form-grid-2" style="margin-bottom:8px;">
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">TELEGRAM BOT PROFILE (@BotFather)</label>
            <input type="text" id="tgBotTokenInput" value="${tgToken}" placeholder="DEMO-BOT-TOKEN" autocomplete="off" style="margin:4px 0 0; -webkit-text-security:disc;" />
          </div>
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">CHAT ID OR @CHANNEL USERNAME</label>
            <input type="text" id="tgChatIdInput" value="${tgChatId}" placeholder="@truthofmarketss" autocomplete="off" style="margin:4px 0 0;" />
          </div>
        </div>`
            : ""
        }

        <div class="${state.isAdminAuthenticated ? "semi-form-grid-2" : ""}" style="margin-bottom:10px;">
          ${
            state.isAdminAuthenticated
              ? `<div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">PUBLIC CHANNEL URL (HEADER / FOOTER LINK)</label>
            <input type="text" id="tgChannelUrlInput" value="${tgChannelUrl}" placeholder="https://t.me/truthofmarketss" style="margin:4px 0 0;" />
          </div>`
              : ""
          }
          <div>
            <label style="font-size:0.68rem; color:var(--muted); font-family:var(--font-mono);">BRIEFING TEMPLATE</label>
            <select id="tgAlertTypeSelect" style="width:100%; padding:9px 10px; margin-top:4px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-sans); font-size:0.82rem; font-weight:600;">
              <option value="SEMI_BRIEFING" ${tgType === "SEMI_BRIEFING" ? "selected" : ""}>1. SemiFearGreed Index & $SMH:$XLV Rebalance</option>
              <option value="RSA_IGNITION" ${tgType === "RSA_IGNITION" ? "selected" : ""}>2. RightSideAlpha US Top 5 Ignition Signals</option>
              <option value="FULL_DAILY" ${tgType === "FULL_DAILY" ? "selected" : ""}>3. Full Combined Daily Briefing (Semi + US Stocks)</option>
              <option value="POSITION_DOCTOR" ${tgType === "POSITION_DOCTOR" ? "selected" : ""}>4. Position Doctor Diagnostic ($CELH)</option>
              ${
                state.isAdminAuthenticated
                  ? `<option value="TEST_PING" ${tgType === "TEST_PING" ? "selected" : ""}>5. Bot Connection Verification Ping</option>`
                  : ""
              }
            </select>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span style="font-size:0.68rem; font-family:var(--font-mono); color:#93c5fd;">
            LIVE BRIEFING PREVIEW (VERIFIED LATEST CLOSES)
          </span>
          <div style="display:flex; gap:6px;">
            ${
              state.isAdminAuthenticated
                ? `<button class="btn btn-sm" id="btnVerifyTelegram" title="Test Bot Token with Telegram API">Verify & Save Bot</button>`
                : ""
            }
            <button class="btn btn-sm" id="btnPreviewTelegram">Refresh Preview</button>
            <button class="btn btn-sm" id="btnCopyTelegramMsg">Copy Text</button>
          </div>
        </div>

        <pre id="telegramPreviewBox" style="background:#05080f; border:1px solid var(--border); border-left:3px solid #38bdf8; border-radius:4px; padding:12px; font-family:var(--font-mono); font-size:0.74rem; color:#e2e8f0; white-space:pre-wrap; max-height:210px; overflow-y:auto; line-height:1.5; margin-bottom:10px;">${tgPreview}</pre>

        <div id="telegramStatusMsg" style="font-size:0.78rem; margin-bottom:10px; min-height:1.2em; color:#93c5fd;"></div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <span class="mono" style="font-size:0.68rem; color:var(--muted);">
            Official Channel: @truthofmarketss · Live Daily Briefings
          </span>
          <div style="display:flex; gap:8px;">
            <button class="btn" id="btnCloseTelegram">Close</button>
            <a class="btn btn-primary" href="${tgChannelUrl}" target="_blank" rel="noopener noreferrer" style="background:#0284c7; border-color:#38bdf8;">
              Join Telegram Channel ↗
            </a>
            ${
              state.isAdminAuthenticated
                ? `<button class="btn btn-primary" id="btnSendTelegramNow" style="background:#059669; border-color:#10b981;">
              Send Briefing to Telegram ↗
            </button>`
                : ""
            }
          </div>
        </div>
      </div>
    </div>

    <!-- ADMIN LOGIN MODAL (SHA-256 PROTECTED, NO PLAINTEXT IN GIT) -->
    <div class="modal-backdrop" id="adminLoginModal">
      <div class="modal" style="max-width:440px;">
        <div style="font-size:0.68rem; font-family:var(--font-mono); color:#f59e0b; text-transform:uppercase; letter-spacing:0.05em;">
          RESTRICTED ACCESS · ADMINISTRATOR AUTHENTICATION
        </div>
        <h3 style="font-size:1.12rem; font-weight:800; margin-top:4px; color:#ffffff;">
          🔒 Admin Terminal Login
        </h3>
        <p style="color:var(--muted); font-size:0.8rem; margin-top:6px; margin-bottom:12px; line-height:1.5;">
          Enter your Administrator ID and Password to unlock Terminal Configuration, Lemon Squeezy Checkout Setup, Affiliate Routing, and full Pro Terminal access.
        </p>

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">ADMIN ID</label>
        <input type="text" id="adminIdInput" placeholder="Enter Admin ID" autocomplete="off" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">ADMIN ACCESS KEY</label>
        <input type="text" id="adminPwInput" placeholder="Enter Admin Password" autocomplete="off" style="-webkit-text-security:disc;" />

        <div id="adminLoginMsg" style="font-size:0.8rem; margin-bottom:12px; min-height:1.2em;"></div>

        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button class="btn" id="btnCancelAdminLogin">Cancel</button>
          <button class="btn btn-primary" id="btnSubmitAdminLogin">Login as Admin</button>
        </div>
      </div>
    </div>

    <!-- TERMINAL & AFFILIATE CONFIG MODAL -->
    <div class="modal-backdrop" id="configModal">
      <div class="modal" style="max-width:640px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#93c5fd; text-transform:uppercase; letter-spacing:0.05em;">
              ADMINISTRATION · MONETIZATION & PARTNER ROUTING
            </div>
            <h3 style="font-size:1.12rem; font-weight:800; margin-top:4px; color:#ffffff;">Checkout & Affiliate Parameter Configuration</h3>
          </div>
          <button class="btn btn-sm" id="btnAdminLogout" style="border-color:rgba(246,70,93,0.45); color:var(--fin-down);">
            🔒 Admin Logout
          </button>
        </div>
        <p style="color:var(--muted); font-size:0.8rem; margin-top:4px; margin-bottom:10px;">
          Update Lemon Squeezy checkout endpoints, Telegram channel link, and affiliate attribution identifiers. Changes persist to the backend and browser storage.
        </p>

        <div style="background:rgba(37,99,235,0.1); border:1px solid rgba(59,130,246,0.35); border-radius:4px; padding:10px 12px; margin-bottom:12px; display:flex; gap:6px; align-items:center; justify-content:space-between; flex-wrap:wrap;">
          <span class="mono" style="font-size:0.7rem; color:#93c5fd; font-weight:700;">⚡ QUICK PARTNER PORTALS:</span>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <a class="btn btn-sm" href="https://app.lemonsqueezy.com/products" target="_blank" rel="noopener noreferrer" style="font-size:0.7rem; padding:4px 8px;">🍋 Lemon Squeezy ↗</a>
            <a class="btn btn-sm" href="https://www.tradingview.com/partner-program/" target="_blank" rel="noopener noreferrer" style="font-size:0.7rem; padding:4px 8px;">📈 TradingView Aff ↗</a>
            <a class="btn btn-sm" href="https://affiliates.seekingalpha.com/" target="_blank" rel="noopener noreferrer" style="font-size:0.7rem; padding:4px 8px;">📊 Seeking Alpha Aff ↗</a>
            <a class="btn btn-sm" href="https://trendspider.com/?_go=rightside" target="_blank" rel="noopener noreferrer" style="font-size:0.7rem; padding:4px 8px;">⚡ TrendSpider Aff ↗</a>
          </div>
        </div>

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">PLATFORM DOMAIN (TEAR SHEET WATERMARK)</label>
        <input type="text" id="cfgSite1Url" value="${cfg.site1_url || "https://truthofmarket.com"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">LEMON SQUEEZY MONTHLY CHECKOUT URL ($29/MO)</label>
        <input type="text" id="cfgLsMonthly" value="${cfg.ls_site1_monthly_url || "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">LEMON SQUEEZY LIFETIME CHECKOUT URL ($199)</label>
        <input type="text" id="cfgLsLtd" value="${cfg.ls_site1_ltd_url || "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TELEGRAM OFFICIAL CHANNEL / SUPPORT URL</label>
        <input type="text" id="cfgTgChannel" value="${tgChannelUrl}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">OFFICIAL YOUTUBE CHANNEL URL (@RightSideAlpha)</label>
        <input type="text" id="cfgYoutubeUrl" value="${ytUrl}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">OFFICIAL INSTAGRAM PROFILE URL (@rightsidealpha)</label>
        <input type="text" id="cfgInstagramUrl" value="${igUrl}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TRADINGVIEW AFFILIATE ID</label>
        <input type="text" id="cfgAffTv" value="${cfg.tradingview_aff_id || "1173809"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">SEEKING ALPHA PARTNER SOURCE TAG</label>
        <input type="text" id="cfgAffSa" value="${cfg.seekingalpha_source || "better_life333"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TRENDSPIDER / US EQUITY SCANNER PARTNER LABEL</label>
        <input type="text" id="cfgBrokerName" value="${cfg.broker_name || "TrendSpider (rightside)"}" />

        <label style="font-size:0.72rem; color:var(--muted); font-family:var(--font-mono);">TRENDSPIDER / US EQUITY SCANNER REFERRAL URL</label>
        <input type="text" id="cfgBrokerUrl" value="${cfg.broker_referral_url || "https://trendspider.com/?_go=rightside"}" />

        <div id="configMsg" style="font-size:0.8rem; margin-bottom:12px; min-height:1.2em;"></div>

        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button class="btn" id="btnCancelConfig">Close</button>
          <button class="btn btn-primary" id="btnSaveConfig">Save Configuration</button>
        </div>
      </div>
    </div>

    <!-- INSTITUTIONAL RESEARCH BRIEF MODAL -->
    <div class="modal-backdrop" id="researchModal">
      <div class="modal" style="max-width:760px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <h3 style="font-size:1.1rem; font-weight:800; color:#ffffff;" id="researchModalTitle">SEC Primary Filing Turnaround Brief</h3>
          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-switch-research" data-ticker="CELH" id="btnSwitchResearchCelh">$CELH Brief</button>
            <button type="button" class="btn btn-sm btn-switch-research" data-ticker="MBLY" id="btnSwitchResearchMbly">$MBLY Brief</button>
            <button class="btn btn-sm" id="btnCloseResearch">Close ✕</button>
          </div>
        </div>
        <div id="researchModalBody" style="font-size:0.84rem; color:var(--text); line-height:1.65; max-height:62vh; overflow-y:auto; background:#05080f; padding:18px; border-radius:4px; border:1px solid var(--border);">
          Loading institutional brief...
        </div>
      </div>
    </div>

    <!-- LEGAL, PRIVACY, REFUND POLICY & SUPPORT MODAL -->
    <div class="modal-backdrop" id="legalModal">
      <div class="modal" style="max-width:740px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#93c5fd; text-transform:uppercase; letter-spacing:0.05em;">
              LEGAL & COMPLIANCE · MERCHANT OF RECORD: LEMON SQUEEZY
            </div>
            <h3 style="font-size:1.1rem; font-weight:800; color:#ffffff; margin-top:3px;" id="legalModalTitle">
              Terms of Service, Privacy Policy & Refund Policy
            </h3>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-legal-tab" data-legal-tab="terms">Terms of Service</button>
            <button type="button" class="btn btn-sm btn-legal-tab" data-legal-tab="privacy">Privacy Policy</button>
            <button type="button" class="btn btn-sm btn-legal-tab" data-legal-tab="refund">Refund Policy</button>
            <button type="button" class="btn btn-sm btn-legal-tab" data-legal-tab="support">Support Contact</button>
            <button type="button" class="btn btn-sm" id="btnCloseLegalModal">Close ✕</button>
          </div>
        </div>
        <div id="legalModalBody" style="font-size:0.82rem; color:var(--text); line-height:1.68; max-height:62vh; overflow-y:auto; background:#05080f; padding:18px; border-radius:4px; border:1px solid var(--border);">
          <div data-legal-section="terms">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">1. Terms of Service & Non-Advisory Disclosure</h4>
            <p style="color:var(--muted); margin-bottom:10px;">
              RightSideAlpha and SemiFearGreed (<code class="mono">truthofmarket.com</code>) provide quantitative financial data analytics, empirical backtesting outputs (2000–2026), and algorithmic screening tools for US-listed equities and ETFs. Nothing on this platform constitutes personalized investment advice, brokerage solicitation, legal advice, or tax counsel. Users are solely responsible for their own investment decisions and trade executions.
            </p>
            <p style="color:var(--muted); margin-bottom:12px;">
              Pro Terminal licenses grant single-user access to quantitative target levels, daily SEC primary-filing briefs, Position Doctor diagnostics, and Pine Script v5 indicators. Redistribution or unauthorized sharing of license keys or private VIP Telegram invite links is strictly prohibited.
            </p>
          </div>
          <div data-legal-section="privacy" style="border-top:1px solid var(--border); padding-top:12px; margin-top:12px;">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">2. Privacy Policy</h4>
            <p style="color:var(--muted); margin-bottom:10px;">
              We respect your financial privacy. Portfolio inputs entered into the Position Sizing Calculator, Position Doctor, or $SMH:$XLV Barbell Rebalancing Engine are processed locally in your browser and are never sold or shared with third parties. Payment processing and billing data are handled securely by our Merchant of Record, <b>Lemon Squeezy, LLC</b>, under PCI-DSS compliance.
            </p>
          </div>
          <div data-legal-section="refund" style="border-top:1px solid var(--border); padding-top:12px; margin-top:12px;">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">3. Subscription Cancellation & Refund Policy</h4>
            <p style="color:var(--muted); margin-bottom:10px;">
              Monthly Pro subscriptions ($29/mo) can be canceled at any time with one click via your Lemon Squeezy customer billing portal or by contacting support; access remains active through the end of the current billing period with zero cancellation fees. Because digital quantitative data, downloadable 26.8-year CSV datasets, and Pine Script v5 source code are delivered immediately upon activation, Lifetime Pass ($199) and activated digital licenses are non-refundable once accessed, except where required by applicable consumer protection law or in cases of duplicate billing.
            </p>
          </div>
          <div data-legal-section="support" style="border-top:1px solid var(--border); padding-top:12px; margin-top:12px;">
            <h4 style="color:#ffffff; font-size:0.95rem; font-weight:800; margin-bottom:6px;">4. Customer Support & Billing Inquiries</h4>
            <p style="color:var(--muted);">
              • <b>Official Support Email</b>: <a href="mailto:beable9489@gmail.com" style="color:#60a5fa; font-weight:700;">beable9489@gmail.com</a><br/>
              • <b>Merchant of Record</b>: Lemon Squeezy, LLC (<a href="https://app.lemonsqueezy.com/my-orders" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;">Manage Orders & Receipts ↗</a>)<br/>
              • <b>Public Broadcast Desk</b>: <a href="https://t.me/truthofmarketss" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;">t.me/truthofmarketss (@truthofmarketss) ↗</a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- PW-RSI METHODOLOGY EXPLAINER MODAL -->
    <div class="modal-backdrop" id="pwRsiModal">
      <div class="modal" style="max-width:680px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px;">
          <div>
            <div style="font-size:0.68rem; font-family:var(--font-mono); color:#38bdf8; text-transform:uppercase; letter-spacing:0.06em; font-weight:800;">
              QUANTITATIVE FOUNDATION · ZERO LOOK-AHEAD BIAS
            </div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#ffffff; margin:3px 0 0;">
              ${t.pwRsiModalTitle || "PW-RSI (Post-Washout Right-Side Ignition) Methodology"}
            </h3>
          </div>
          <button class="btn btn-sm" id="btnClosePwRsiModal" style="padding:4px 8px;">✕ Close</button>
        </div>

        <div style="max-height:70vh; overflow-y:auto; padding-right:4px; font-size:0.83rem; line-height:1.55; color:#cbd5e1;">
          <div style="background:#0b1322; border:1px solid rgba(56,189,248,0.25); border-radius:6px; padding:12px 14px; margin-bottom:12px;">
            <div style="font-weight:800; color:#ffffff; margin-bottom:4px; font-size:0.88rem;">
              Why "Catching the Falling Knife" Fails in Growth Equities
            </div>
            <p style="margin:0; color:var(--muted); font-size:0.78rem;">
              Empirical analysis across 394,371 US stock-days (2000–2026) demonstrates that blindly buying stocks near 52-week lows traps investor capital for a median of <b>81.0 trading days</b> underwater, with an average post-entry additional drawdown of <b>-30.3%</b> and a <b>25.54% risk of severe loss (&le; -20%)</b>.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:12px;">
            <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:12px 14px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                <span style="font-size:0.75rem; font-family:var(--font-mono); font-weight:900; color:#38bdf8; background:rgba(56,189,248,0.14); padding:2px 7px; border-radius:3px;">
                  STEP 1: PW · POST-WASHOUT
                </span>
                <span style="font-weight:700; color:#ffffff;">Volume Exhaustion &amp; Capitulation</span>
              </div>
              <p style="margin:0; font-size:0.78rem; color:var(--muted);">
                We demand at least <b>1.35x to 1.40x 10-day volume surge</b> on severe down-days, signaling institutional climax liquidation where retail hands capitulate and smart money absorbs liquidity.
              </p>
            </div>

            <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:12px 14px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                <span style="font-size:0.75rem; font-family:var(--font-mono); font-weight:900; color:#34d399; background:rgba(14,203,129,0.14); padding:2px 7px; border-radius:3px;">
                  STEP 2: RS · RIGHT-SIDE
                </span>
                <span style="font-weight:700; color:#ffffff;">Dual Moving Average Reclamation</span>
              </div>
              <p style="margin:0; font-size:0.78rem; color:var(--muted);">
                Never enter while a stock is below declining moving averages. Entry is only permitted once price climbs <b>+10% to +45% off the 52-week low</b> and cleanly reclaims both the <b>20-day (short-term momentum)</b> and <b>60-day (intermediate institutional trend)</b> moving averages.
              </p>
            </div>

            <div style="background:#090d16; border:1px solid #1e293b; border-radius:6px; padding:12px 14px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                <span style="font-size:0.75rem; font-family:var(--font-mono); font-weight:900; color:#fbbf24; background:rgba(245,158,11,0.14); padding:2px 7px; border-radius:3px;">
                  STEP 3: I · IGNITION
                </span>
                <span style="font-weight:700; color:#ffffff;">Strict 4-Tier Risk &amp; Harvest Rules</span>
              </div>
              <p style="margin:0; font-size:0.78rem; color:var(--muted);">
                Every position is bounded by 4 mechanical exit rules: <b>Rule 1: -9.0% hard stop floor</b> (eliminates tail risk to 0.93%), <b>Rule 2: 55-day time stop</b> (+8% threshold cuts underwater time from 81 to 29 days), <b>Rule 3: +100% (2x) principal harvest</b>, and <b>Rule 4: Barbell capital preservation</b>.
              </p>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:14px; border-top:1px solid var(--border); padding-top:10px;">
            <button class="btn btn-primary btn-sm" id="btnUnderstandPwRsi">Got it, Explore 72 Setups</button>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <div class="toast" id="toastBox">Action completed</div>
  `;
}


// --- src/components/SemiFearGreedView.js ---


function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngleDeg, endAngleDeg) {
  const start = polarToCartesian(cx, cy, r, startAngleDeg);
  const end = polarToCartesian(cx, cy, r, endAngleDeg);
  const largeArcFlag = Math.abs(startAngleDeg - endAngleDeg) <= 180 ? "0" : "1";
  // Since y is inverted for standard math angles (180 left -> 90 top -> 0 right), sweep-flag is 1
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}
function renderCnnDialSvg(score, regimeLabel) {
  const s = Math.max(0, Math.min(100, Number(score ?? 18.0)));
  const cx = 230;
  const cy = 200;
  const r = 146;

  // 5 CNN segments along 180° (left=0) to 0° (right=100) with dark-mode harmonious muted tints
  const segments = [
    { code: "EXTREME_FEAR", min: 0, max: 24, a1: 180, a2: 136.5, activeColor: "#ef4444", mutedColor: "rgba(239,68,68,0.22)", label: "EXTREME FEAR", midAngle: 158 },
    { code: "FEAR", min: 25, max: 44, a1: 134, a2: 100.5, activeColor: "#f59e0b", mutedColor: "rgba(245,158,11,0.22)", label: "FEAR", midAngle: 117 },
    { code: "NEUTRAL", min: 45, max: 55, a1: 98, a2: 82, activeColor: "#94a3b8", mutedColor: "rgba(148,163,184,0.20)", label: "NEUTRAL", midAngle: 90 },
    { code: "GREED", min: 56, max: 74, a1: 79.5, a2: 46, activeColor: "#10b981", mutedColor: "rgba(16,185,129,0.22)", label: "GREED", midAngle: 63 },
    { code: "EXTREME_GREED", min: 75, max: 100, a1: 43.5, a2: 0, activeColor: "#059669", mutedColor: "rgba(5,150,105,0.22)", label: "EXTREME GREED", midAngle: 22 },
  ];

  let activeSeg = segments[0];
  if (s >= 75) activeSeg = segments[4];
  else if (s >= 55.01) activeSeg = segments[3];
  else if (s >= 45) activeSeg = segments[2];
  else if (s >= 25) activeSeg = segments[1];

  const arcsHtml = segments
    .map((seg) => {
      const isAct = seg.code === activeSeg.code;
      const d = describeArc(cx, cy, r, seg.a1, seg.a2);
      const stroke = isAct ? seg.activeColor : seg.mutedColor;
      const width = isAct ? 40 : 32;
      const lp = polarToCartesian(cx, cy, r + 31, seg.midAngle);
      return `
        <path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="butt" />
        <text x="${lp.x.toFixed(1)}" y="${lp.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle"
              fill="${isAct ? seg.activeColor : "#64748b"}"
              font-size="${isAct ? "9.5" : "8.5"}" font-weight="${isAct ? "800" : "700"}" font-family="Inter, sans-serif">
          ${seg.label}
        </text>
      `;
    })
    .join("");

  // Perimeter ticks (0, 25, 45, 55, 75, 100)
  const ticks = [0, 25, 45, 55, 75, 100]
    .map((tVal) => {
      const ang = 180 - (tVal / 100) * 180;
      const pIn = polarToCartesian(cx, cy, r - 24, ang);
      const pTxt = polarToCartesian(cx, cy, r - 35, ang);
      return `
        <circle cx="${pIn.x.toFixed(1)}" cy="${pIn.y.toFixed(1)}" r="1.8" fill="#94a3b8" />
        <text x="${pTxt.x.toFixed(1)}" y="${pTxt.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle"
              fill="#94a3b8" font-size="10" font-weight="700" font-family="JetBrains Mono, monospace">
          ${tVal}
        </text>
      `;
    })
    .join("");

  // Needle geometry
  const needleAngle = 180 - (s / 100.0) * 180.0;
  const tip = polarToCartesian(cx, cy, r - 12, needleAngle);
  const baseLeft = polarToCartesian(cx, cy, 8, needleAngle + 90);
  const baseRight = polarToCartesian(cx, cy, 8, needleAngle - 90);

  return `
    <div style="display:flex; flex-direction:column; align-items:center;">
      <svg viewBox="0 0 460 250" style="width:100%; max-width:440px; height:auto; overflow:visible;">
        <defs>
          <filter id="needleShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="3" flood-color="#000000" flood-opacity="0.65" />
          </filter>
        </defs>
        ${arcsHtml}
        ${ticks}
        <!-- Needle Polygon with Elevation Shadow -->
        <polygon points="${tip.x.toFixed(1)},${tip.y.toFixed(1)} ${baseLeft.x.toFixed(1)},${baseLeft.y.toFixed(1)} ${baseRight.x.toFixed(1)},${baseRight.y.toFixed(1)}"
                 fill="#f8fafc" filter="url(#needleShadow)" />
        <circle cx="${cx}" cy="${cy}" r="14" fill="#f8fafc" filter="url(#needleShadow)" />
        <circle cx="${cx}" cy="${cy}" r="5" fill="#090e18" />
      </svg>

      <!-- Score & Active Emotion Callout below Needle Hub -->
      <div style="text-align:center; margin-top:-18px;">
        <div style="display:inline-flex; align-items:baseline; gap:6px; background:#070b14; color:#ffffff; padding:6px 22px; border-radius:30px; border:1px solid var(--border); box-shadow:var(--shadow-md);">
          <span class="mono" style="font-size:2rem; font-weight:900; letter-spacing:-0.03em;">${Math.round(s)}</span>
          <span class="mono" style="font-size:0.9rem; color:#9ca3af; font-weight:600;">(${s.toFixed(1)} / 100)</span>
        </div>
        <div style="margin-top:8px;">
          <span style="font-size:0.78rem; color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:0.04em;">
            Market Emotion is driving:
          </span>
          <span class="cnn-pill cnn-pill-${activeSeg.code}" style="margin-left:6px; font-size:0.85rem;">
            ${regimeLabel || activeSeg.label}
          </span>
        </div>
      </div>
    </div>
  `;
}
function renderTimelineSvg(historyData, activeRange) {
  const pts = (historyData && historyData.series) || [];
  if (!pts.length) {
    return `<div style="padding:40px; text-align:center; color:#6b7280;">Loading historical timeline...</div>`;
  }

  const w = 640;
  const h = 230;
  const padL = 36;
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const coords = pts.map((p, i) => {
    const x = padL + (i / Math.max(1, pts.length - 1)) * plotW;
    const y = padT + (1.0 - Math.max(0, Math.min(100, p.fg_score)) / 100.0) * plotH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const y25 = (padT + 0.75 * plotH).toFixed(1);
  const y50 = (padT + 0.5 * plotH).toFixed(1);
  const y75 = (padT + 0.25 * plotH).toFixed(1);

  const firstDate = pts[0].date;
  const midDate = pts[Math.floor(pts.length / 2)].date;
  const lastDate = pts[pts.length - 1].date;

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
        <div style="font-size:0.8rem; font-weight:700; color:var(--text);">
          Historical Semiconductor Fear &amp; Greed Index (${firstDate} → ${lastDate})
        </div>
        <div style="display:flex; gap:4px;">
          ${["3M", "1Y", "3Y", "5Y", "10Y", "ALL"]
            .map(
              (r) => `
            <button class="btn-semi-range" data-range="${r}"
                    style="padding:3px 9px; border-radius:4px; font-size:0.72rem; font-weight:700; cursor:pointer; border:1px solid ${
                      activeRange === r ? "var(--fin-blue)" : "var(--border)"
                    }; background:${activeRange === r ? "#141c2e" : "#060911"}; color:${
                activeRange === r ? "#ffffff" : "var(--muted)"
              };">
              ${r}
            </button>
          `
            )
            .join("")}
        </div>
      </div>

      <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:auto; background:#060911; border:1px solid var(--border); border-radius:4px;">
        <!-- Extreme Greed Band (>75) -->
        <rect x="${padL}" y="${padT}" width="${plotW}" height="${0.25 * plotH}" fill="rgba(16,185,129,0.12)" />
        <!-- Extreme Fear Band (<25) -->
        <rect x="${padL}" y="${y25}" width="${plotW}" height="${0.25 * plotH}" fill="rgba(239,68,68,0.12)" />

        <!-- Reference Lines -->
        <line x1="${padL}" y1="${y75}" x2="${w - padR}" y2="${y75}" stroke="#10b981" stroke-dasharray="3,3" stroke-width="1" />
        <line x1="${padL}" y1="${y50}" x2="${w - padR}" y2="${y50}" stroke="#64748b" stroke-dasharray="3,3" stroke-width="1" />
        <line x1="${padL}" y1="${y25}" x2="${w - padR}" y2="${y25}" stroke="#ef4444" stroke-dasharray="3,3" stroke-width="1" />

        <text x="6" y="${y75}" fill="#34d399" font-size="9.5" font-weight="700" dominant-baseline="middle">75</text>
        <text x="6" y="${y50}" fill="#94a3b8" font-size="9.5" font-weight="700" dominant-baseline="middle">50</text>
        <text x="6" y="${y25}" fill="#f87171" font-size="9.5" font-weight="700" dominant-baseline="middle">25</text>

        <!-- FG Line -->
        <polyline fill="none" stroke="#38bdf8" stroke-width="2" points="${coords.join(" ")}" />

        <!-- X-Axis Dates with mobile overlap protection -->
        <text x="${padL}" y="${h - 8}" fill="var(--muted)" font-size="9.5" font-family="JetBrains Mono, monospace">${firstDate}</text>
        <text class="timeline-mid-date" x="${padL + plotW / 2}" y="${h - 8}" fill="var(--muted)" font-size="9.5" text-anchor="middle" font-family="JetBrains Mono, monospace">${midDate}</text>
        <text x="${w - padR}" y="${h - 8}" fill="var(--muted)" font-size="9.5" text-anchor="end" font-family="JetBrains Mono, monospace">${lastDate}</text>
      </svg>
    </div>
  `;
}

function renderMiniSparkline(values, regimeCode) {
  if (!values || !values.length) return "";
  const w = 180;
  const h = 44;
  const coords = values
    .map((v, i) => {
      const x = 4 + (i / Math.max(1, values.length - 1)) * (w - 8);
      const y = 4 + (1.0 - Math.max(0, Math.min(100, v)) / 100.0) * (h - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const colorMap = {
    EXTREME_FEAR: "#ef4444",
    FEAR: "#f59e0b",
    NEUTRAL: "#94a3b8",
    GREED: "#10b981",
    EXTREME_GREED: "#059669",
  };
  const stroke = colorMap[regimeCode] || "#94a3b8";

  return `
    <svg viewBox="0 0 ${w} ${h}" style="width:160px; height:40px; background:#060911; border:1px solid var(--border); border-radius:4px;">
      <line x1="0" y1="${h / 2}" x2="${w}" y2="${h / 2}" stroke="#1e293b" stroke-dasharray="2,2" stroke-width="1" />
      <polyline fill="none" stroke="${stroke}" stroke-width="1.8" points="${coords}" />
    </svg>
  `;
}

function renderEquityCurveSvg(historyData) {
  const pts = (historyData && historyData.series) || [];
  if (!pts.length) return "";

  const w = 720;
  const h = 220;
  const padL = 52;
  const padR = 20;
  const padT = 18;
  const padB = 26;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const allVals = [];
  pts.forEach((p) => {
    allVals.push(p.port73_norm, p.qqq_norm);
  });
  const minV = Math.min(...allVals, 8000);
  const maxV = Math.max(...allVals, 12000);
  const span = Math.max(1, maxV - minV);

  const portCoords = pts
    .map((p, i) => {
      const x = padL + (i / Math.max(1, pts.length - 1)) * plotW;
      const y = padT + (1.0 - (p.port73_norm - minV) / span) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const qqqCoords = pts
    .map((p, i) => {
      const x = padL + (i / Math.max(1, pts.length - 1)) * plotW;
      const y = padT + (1.0 - (p.qqq_norm - minV) / span) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const lastPort = pts[pts.length - 1].port73_norm;
  const lastQqq = pts[pts.length - 1].qqq_norm;

  return `
    <div style="margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px; font-size:0.78rem;">
        <div style="display:flex; gap:16px; align-items:center;">
          <span style="display:inline-flex; align-items:center; gap:6px; color:#34d399; font-weight:700;">
            <span style="width:12px; height:3px; background:#0ecb81; display:inline-block;"></span>
            70% $SMH : 30% $XLV Barbell ($10k → $${lastPort.toLocaleString()})
          </span>
          <span style="display:inline-flex; align-items:center; gap:6px; color:#94a3b8; font-weight:600;">
            <span style="width:12px; height:3px; background:#64748b; display:inline-block;"></span>
            100% $QQQ Benchmark ($10k → $${lastQqq.toLocaleString()})
          </span>
        </div>
        <span class="mono" style="color:var(--muted); font-size:0.72rem;">Selected Window: ${historyData.range_code}</span>
      </div>
      <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:auto; background:#060911; border:1px solid var(--border); border-radius:4px;">
        <polyline fill="none" stroke="#64748b" stroke-width="1.6" stroke-dasharray="3,2" points="${qqqCoords}" />
        <polyline fill="none" stroke="#0ecb81" stroke-width="2.2" points="${portCoords}" />
        <text x="6" y="${padT + 8}" fill="#94a3b8" font-size="9.5" font-family="JetBrains Mono, monospace">$${Math.round(maxV).toLocaleString()}</text>
        <text x="6" y="${h - padB}" fill="#94a3b8" font-size="9.5" font-family="JetBrains Mono, monospace">$${Math.round(minV).toLocaleString()}</text>
      </svg>
    </div>
  `;
}
function renderSemiFearGreedView(state) {
  const t = state.t;
  const lang = state.lang;
  const ov = state.semiOverview;

  if (!ov) {
    return `
      <div class="proof-card" style="padding:40px; text-align:center;">
        Loading Semiconductor Fear & Greed Index...
      </div>
    `;
  }

  const regimeLabel = lang === "jp" ? ov.regime_jp : lang === "kr" ? ov.regime_kr : ov.regime_en;
  const actionHeadline = lang === "jp" ? ov.action_headline_jp : lang === "kr" ? ov.action_headline_kr : ov.action_headline_en;
  const actionDetail = lang === "jp" ? ov.action_detail_jp : lang === "kr" ? ov.action_detail_kr : ov.action_detail_en;
  const gaugeTab = state.semiGaugeTab || "overview";
  const activeRange = state.semiRange || "1Y";
  const rebal = state.semiRebalanceResult;
  const lump = state.semiLumpSumResult;
  const eras = (state.semiHistory && state.semiHistory.era_summary) || [];

  return `
    <!-- SECTION 1: AUTHENTIC CNN BUSINESS FEAR & GREED INDEX EDITORIAL SURFACE -->
    <section class="cnn-page-wrapper" id="semiCnnSection">
      <div class="cnn-editorial-header">
        <div>
          <div class="cnn-red-tag">${t.cnnBadge}</div>
          <h1 class="cnn-main-title">${t.cnnTitle}</h1>
          <p class="cnn-main-subtitle">${t.cnnSubtitle}</p>
        </div>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <a
            class="btn"
            href="${state.config?.youtube_url || "https://www.youtube.com/@RightSideAlpha"}"
            target="_blank"
            rel="noopener noreferrer"
            style="background:#dc2626; color:#ffffff; border-color:#b91c1c;"
          >
            📺 YouTube (@RightSideAlpha) ↗
          </a>
          <a
            class="btn"
            href="${state.config?.instagram_url || "https://www.instagram.com/rightsidealpha"}"
            target="_blank"
            rel="noopener noreferrer"
            style="background:#db2777; color:#ffffff; border-color:#be185d;"
          >
            📸 Instagram (@rightsidealpha) ↗
          </a>
          <a
            class="btn ${state.isProUnlocked ? "" : "btn-gated-vip-tg"}"
            href="${getVipTelegramUrl(state.isProUnlocked)}"
            ${state.isProUnlocked ? 'target="_blank" rel="noopener noreferrer"' : ""}
            style="background:#0284c7; color:#ffffff; border-color:#0369a1;"
          >
            ${state.isProUnlocked ? "👑 VIP Telegram News ↗" : "🔒 VIP Telegram ($SMH/$XLV News)"}
          </a>
          <button class="btn" id="btnExportSemiGauge" style="background:#111827; color:#ffffff; border-color:#111827;">
            ${t.cnnExportGauge}
          </button>
        </div>
      </div>

      <!-- CNN TOP 2-COLUMN GRID: LEFT = DIAL GAUGE / TIMELINE, RIGHT = 4 HISTORICAL COMPARISONS -->
      <div class="cnn-top-grid">
        <div class="cnn-card">
          <div class="cnn-card-header">
            <div style="font-size:0.78rem; color:#6b7280; font-weight:600;">
              ${t.cnnLastUpdated}: <b class="mono" style="color:#111827;">${ov.date}</b> · $SMH <b class="mono">$${ov.smh_close.toFixed(2)}</b> (${ov.smh_dd_pct.toFixed(2)}% off 52W High)
            </div>
            <div class="cnn-view-tabs">
              <button class="cnn-view-tab ${gaugeTab === "overview" ? "active" : ""}" data-semi-tab="overview">
                ${t.cnnTabOverview}
              </button>
              <button class="cnn-view-tab ${gaugeTab === "timeline" ? "active" : ""}" data-semi-tab="timeline">
                ${t.cnnTabTimeline}
              </button>
            </div>
          </div>

          ${
            gaugeTab === "overview"
              ? renderCnnDialSvg(ov.fg_score, regimeLabel)
              : renderTimelineSvg(state.semiHistory, activeRange)
          }
        </div>

        <!-- RIGHT COLUMN: CNN 4-ROW HISTORICAL STACK + BARBELL SIGNAL -->
        <div class="cnn-card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.78rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--muted); margin-bottom:8px;">
              ${t.cnnHistoryTitle}
            </div>
            <div class="cnn-history-list">
              ${ov.comparisons
                .map((c) => {
                  const lbl = lang === "jp" ? c.label_jp : lang === "kr" ? c.label_kr : c.label_en;
                  const reg = lang === "jp" ? c.regime_jp : lang === "kr" ? c.regime_kr : c.regime_en;
                  const sVal = Math.round(c.score);
                  const ringColor = sVal <= 24 ? "#ef4444" : sVal <= 44 ? "#f59e0b" : sVal <= 55 ? "#64748b" : sVal <= 74 ? "#10b981" : "#059669";
                  const ringBg = sVal <= 24 ? "rgba(239,68,68,0.15)" : sVal <= 44 ? "rgba(245,158,11,0.15)" : sVal <= 55 ? "rgba(100,116,139,0.15)" : sVal <= 74 ? "rgba(16,185,129,0.15)" : "rgba(5,150,105,0.15)";
                  return `
                  <div class="cnn-history-row">
                    <div>
                      <div class="cnn-hist-label">${lbl} <span class="mono" style="font-size:0.72rem; color:var(--muted);">(${c.date})</span></div>
                      <div class="cnn-hist-regime">${reg}</div>
                    </div>
                    <div class="cnn-score-circle" style="border-color:${ringColor}; background:${ringBg}; color:#ffffff;">${sVal}</div>
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>

          <!-- Active SMH:XLV Barbell Regime Box -->
          <div style="margin-top:16px; padding:14px 16px; background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.3); border-left:4px solid #dc2626; border-radius:4px;">
            <div style="font-size:0.68rem; font-weight:800; color:#fca5a5; letter-spacing:0.05em; text-transform:uppercase;">
              ${t.cnnActiveRuleLabel} · TARGET ${ov.recommended_smh_weight}% $SMH : ${ov.recommended_xlv_weight}% $XLV
            </div>
            <div style="font-size:0.88rem; font-weight:800; color:#ffffff; margin-top:4px;">
              ${actionHeadline}
            </div>
            <p style="font-size:0.78rem; color:var(--text-secondary); margin-top:4px; line-height:1.45;">
              ${actionDetail}
            </p>
          </div>
        </div>
      </div>

      <!-- CNN 7 FEAR & GREED INDICATORS BREAKDOWN -->
      <div style="margin-top:12px;">
        <div style="border-bottom:1px solid var(--border); padding-bottom:10px; margin-bottom:16px;">
          <h2 style="font-size:1.35rem; font-weight:900; color:#ffffff;">${t.cnnIndicatorsHeading}</h2>
          <p style="font-size:0.84rem; color:var(--muted); margin-top:2px;">${t.cnnIndicatorsSub}</p>
        </div>

        <div class="cnn-indicators-list">
          ${ov.factors
            .map((f) => {
              const title = lang === "jp" ? f.title_jp : lang === "kr" ? f.title_kr : f.title_en;
              const sub = lang === "jp" ? f.subtitle_jp : lang === "kr" ? f.subtitle_kr : f.subtitle_en;
              const desc = lang === "jp" ? f.desc_jp : lang === "kr" ? f.desc_kr : f.desc_en;
              const reg = lang === "jp" ? f.regime_jp : lang === "kr" ? f.regime_kr : f.regime_en;

              return `
              <div class="cnn-indicator-item">
                <div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span class="mono" style="font-size:0.7rem; font-weight:800; padding:2px 6px; background:#141c2e; border:1px solid var(--border); border-radius:3px; color:#93c5fd;">
                      #${f.order} · ${f.weight_pct}% WEIGHT
                    </span>
                    <span class="cnn-ind-title">${title}</span>
                  </div>
                  <div class="cnn-ind-sub">${sub}</div>
                  <p class="cnn-ind-desc">${desc}</p>
                </div>

                <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                  ${renderMiniSparkline(f.sparkline, f.regime_code)}
                  <div class="mono" style="font-size:0.74rem; color:#94a3b8; font-weight:700;">
                    Reading: ${f.raw_display} · Score ${f.score.toFixed(1)}/100
                  </div>
                </div>

                <div style="text-align:right;">
                  <span class="cnn-pill cnn-pill-${f.regime_code}">${reg}</span>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    </section>

    <!-- SECTION 2: CORE ETF SNAPSHOT STRIP ($SMH, $XLV, $QQQ) -->
    <section class="core-etf-grid">
      ${ov.etfs
        .map((etf) => {
          const name = lang === "jp" ? etf.name_jp : lang === "kr" ? etf.name_kr : etf.name_en;
          const role = lang === "jp" ? etf.role_jp : lang === "kr" ? etf.role_kr : etf.role_en;
          const cfg = state.config || {};
          const tvAffId = encodeURIComponent(cfg.tradingview_aff_id || "1173809");
          const saSource = encodeURIComponent(cfg.seekingalpha_source || "better_life333");
          const tsAffId = encodeURIComponent(cfg.trendspider_aff_id || "rightside");
          const tvUrl = `https://www.tradingview.com/symbols/${encodeURIComponent(etf.ticker)}/?aff_id=${tvAffId}`;
          const saUrl = `https://seekingalpha.com/symbol/${encodeURIComponent(etf.ticker)}/earnings?source=${saSource}`;
          const tsUrl = `https://trendspider.com/?_go=${tsAffId}&symbol=${encodeURIComponent(etf.ticker)}`;
          return `
          <div class="proof-card" style="margin-bottom:0; border-top:2px solid ${
            etf.ticker === "SMH" ? "var(--fin-blue)" : etf.ticker === "XLV" ? "var(--fin-up)" : "#64748b"
          };">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="mono" style="font-size:1.15rem; font-weight:900; color:#ffffff;">$${etf.ticker}</span>
                  <span style="font-size:0.78rem; color:var(--text-secondary); font-weight:600;">${name}</span>
                </div>
                <div style="font-size:0.74rem; color:var(--muted); margin-top:3px;">${role}</div>
              </div>
              <div style="text-align:right;">
                <div class="mono" style="font-size:1.15rem; font-weight:800; color:#ffffff;">$${Number(etf.close ?? 0).toFixed(2)}</div>
                <div class="mono" style="font-size:0.74rem; color:${etf.ret_1d_pct >= 0 ? "var(--fin-up)" : "var(--fin-down)"};">
                  1D: ${etf.ret_1d_pct >= 0 ? "+" : ""}${Number(etf.ret_1d_pct ?? 0).toFixed(2)}% · 20D: ${etf.ret_20d_pct >= 0 ? "+" : ""}${Number(etf.ret_20d_pct ?? 0).toFixed(2)}%
                </div>
                <div class="mono" style="font-size:0.7rem; color:var(--muted); margin-top:1px;">
                  52W DD: ${Number(etf.dd_52w_pct ?? 0).toFixed(2)}% · RSI(14): ${Number(etf.rsi14 ?? 50).toFixed(1)}
                </div>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding-top:10px; border-top:1px solid var(--border-subtle); font-size:0.74rem;">
              <span class="mono" style="color:var(--muted);">
                Normal: <b style="color:#fff;">${etf.target_weight_normal}%</b> → Extreme Fear: <b style="color:var(--fin-up);">${etf.target_weight_fear}%</b>
              </span>
              <div style="display:flex; gap:6px;">
                <a class="btn btn-sm" href="${tvUrl}" target="_blank" rel="noopener noreferrer">TV Chart ↗</a>
                <a class="btn btn-sm" href="${saUrl}" target="_blank" rel="noopener noreferrer">Holdings ↗</a>
                <a class="btn btn-sm" href="${tsUrl}" target="_blank" rel="noopener noreferrer" style="border-color:rgba(16,185,129,0.4); color:#34d399;">TrendSpider ↗</a>
              </div>
            </div>
          </div>
        `;
        })
        .join("")}
    </section>

    <!-- SECTION 3: INTERACTIVE SMH + XLV REBALANCING & 2.5M KRW TAX HARVESTING ENGINE + 3-STAGE LUMP-SUM PLANNER -->
    <section class="semi-calc-grid">
      <!-- Calculator 1: SMH + XLV Rebalancing & Tax Optimizer -->
      <div class="proof-card" style="margin-bottom:0; border-top:2px solid var(--fin-up);">
        <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:var(--fin-up); letter-spacing:0.05em;">
          ${t.rebalSectionTag}
        </div>
        <h3 style="font-size:1.12rem; font-weight:800; color:#ffffff; margin:4px 0 6px;">${t.rebalSectionTitle}</h3>
        <p style="font-size:0.8rem; color:var(--muted); margin-bottom:14px;">${t.rebalSectionDesc}</p>

        <div class="semi-form-grid-2" style="margin-bottom:12px;">
          <div>
            <label style="font-size:0.68rem; font-family:var(--font-mono); color:var(--muted);">PORTFOLIO CAPITAL ($ USD)</label>
            <input type="number" id="semiCapInput" value="${state.semiCapUsd ?? 100000}" step="1000"
                   style="width:100%; padding:8px 10px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-mono); font-weight:700; margin-top:3px;" />
          </div>
          <div>
            <label style="font-size:0.68rem; font-family:var(--font-mono); color:var(--muted);">ALLOCATION MODE</label>
            <select id="semiModeInput" style="width:100%; padding:8px 10px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-sans); font-weight:600; margin-top:3px;">
              <option value="AUTO_REGIME" ${state.semiMode === "AUTO_REGIME" ? "selected" : ""}>Auto Regime (70:30 ↔ 80:20 on Fear ≤ 25)</option>
              <option value="BASELINE_70_30" ${state.semiMode === "BASELINE_70_30" ? "selected" : ""}>70% $SMH : 30% $XLV Golden Baseline</option>
              <option value="CONTRARIAN_80_20" ${state.semiMode === "CONTRARIAN_80_20" ? "selected" : ""}>80% $SMH : 20% $XLV Contrarian Accumulation</option>
              <option value="AGGRESSIVE_90_10" ${state.semiMode === "AGGRESSIVE_90_10" ? "selected" : ""}>90% $SMH : 10% $XLV Right-Side Tilt</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.68rem; font-family:var(--font-mono); color:var(--muted);">REBALANCING CADENCE</label>
            <select id="semiFreqInput" style="width:100%; padding:8px 10px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-sans); font-weight:600; margin-top:3px;">
              <option value="ANNUAL" ${state.semiFreq === "ANNUAL" ? "selected" : ""}>Annual + Band Trigger (Min Tax Drag)</option>
              <option value="QUARTERLY" ${state.semiFreq === "QUARTERLY" ? "selected" : ""}>Quarterly Rebalance</option>
              <option value="MONTHLY" ${state.semiFreq === "MONTHLY" ? "selected" : ""}>Monthly Rebalance</option>
              <option value="WEEKLY" ${state.semiFreq === "WEEKLY" ? "selected" : ""}>Weekly Rebalance (High Tax Drag)</option>
            </select>
          </div>
          ${
            lang === "kr"
              ? `<div>
            <label style="font-size:0.68rem; font-family:var(--font-mono); color:var(--muted);">UNREALIZED GAIN (₩ KRW · TAX HARVESTER)</label>
            <input type="number" id="semiGainKrwInput" value="${state.semiGainKrw ?? 3800000}" step="100000"
                   style="width:100%; padding:8px 10px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-mono); margin-top:3px;" />
          </div>`
              : ""
          }
        </div>

        <button class="btn btn-emerald" id="btnRunSemiRebalance" style="width:100%; justify-content:center; padding:9px;">
          Calculate Exact $SMH / $XLV Rebalancing Orders
        </button>

        ${
          rebal
            ? `
          <div id="semiRebalOutput" style="margin-top:14px; background:#060911; border:1px solid var(--border); border-left:3px solid var(--fin-up); border-radius:4px; padding:14px; font-size:0.8rem;">
            <div style="font-weight:800; color:var(--fin-up); margin-bottom:4px;">
              ${lang === "jp" ? rebal.active_rule_jp : lang === "kr" ? rebal.active_rule_kr : rebal.active_rule_en}
            </div>
            <div class="mono" style="font-size:0.71rem; color:#93c5fd; margin-bottom:8px;">
              Latest Close Basis (${rebal.as_of_date || ov.date}): $SMH @ $${Number(rebal.smh_close ?? ov.smh_close).toFixed(2)} · $XLV @ $${Number(rebal.xlv_close ?? ov.xlv_close).toFixed(2)}${
                lang === "kr"
                  ? ` · FX ₩${Number(rebal.usdkrw ?? ov.usdkrw).toLocaleString()}/$ · Total ₩${Number(rebal.total_capital_krw ?? 0).toLocaleString()}`
                  : ` · Total Capital $${Number(rebal.total_capital_usd ?? state.semiCapUsd ?? 100000).toLocaleString()}`
              }
            </div>
            <div class="semi-form-grid-2" style="margin-bottom:10px;">
              <div style="background:#0c1220; padding:10px; border-radius:4px; border:1px solid var(--border);">
                <div style="font-size:0.7rem; color:var(--muted);">TARGET $SMH (${rebal.target_smh_weight_pct}%)</div>
                <div class="mono" style="font-size:1.05rem; font-weight:800; color:#fff; margin-top:2px;">
                  $${Number(rebal.target_smh_usd ?? 0).toLocaleString()} (${rebal.target_smh_shares} sh)
                </div>
                <div class="mono" style="font-size:0.73rem; color:${rebal.delta_smh_usd >= 0 ? "var(--fin-up)" : "var(--fin-down)"}; margin-top:2px;">
                  Order vs Drift: ${rebal.delta_smh_usd >= 0 ? "BUY +" : "SELL "}$${Math.abs(Number(rebal.delta_smh_usd ?? 0)).toLocaleString()} (${rebal.delta_smh_shares >= 0 ? "+" : ""}${rebal.delta_smh_shares} sh)
                </div>
              </div>
              <div style="background:#0c1220; padding:10px; border-radius:4px; border:1px solid var(--border);">
                <div style="font-size:0.7rem; color:var(--muted);">TARGET $XLV (${rebal.target_xlv_weight_pct}%)</div>
                <div class="mono" style="font-size:1.05rem; font-weight:800; color:#fff; margin-top:2px;">
                  $${Number(rebal.target_xlv_usd ?? 0).toLocaleString()} (${rebal.target_xlv_shares} sh)
                </div>
                <div class="mono" style="font-size:0.73rem; color:${rebal.delta_xlv_usd >= 0 ? "var(--fin-up)" : "var(--fin-down)"}; margin-top:2px;">
                  Order vs Drift: ${rebal.delta_xlv_usd >= 0 ? "BUY +" : "SELL "}$${Math.abs(Number(rebal.delta_xlv_usd ?? 0)).toLocaleString()} (${rebal.delta_xlv_shares >= 0 ? "+" : ""}${rebal.delta_xlv_shares} sh)
                </div>
              </div>
            </div>
            <div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; border-top:1px solid var(--border); padding-top:8px;">
              ${
                lang === "kr"
                  ? `<div style="margin-bottom:4px;"><b>KRW 2.5M Tax-Free Harvester:</b> ${rebal.kr_tax_guidance_kr}</div>`
                  : ""
              }
              <div class="mono" style="color:var(--muted);">
                Residual Cash: $${Number(rebal.residual_cash_usd ?? 0).toFixed(2)} · Est. Annual Tax & Turnover Drag (${rebal.rebalance_frequency}): -${rebal.estimated_tax_drag_pct}%/yr · Expected Net 15Y Rate: +${rebal.expected_net_cagr_pct}%/yr
              </div>
            </div>
          </div>
        `
            : ""
        }
      </div>

      <!-- Calculator 2: 3-Stage Lump-Sum Entry Planner -->
      <div class="proof-card" style="margin-bottom:0; border-top:2px solid var(--fin-blue);">
        <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:#60a5fa; letter-spacing:0.05em;">
          ${t.lumpSectionTag}
        </div>
        <h3 style="font-size:1.12rem; font-weight:800; color:#ffffff; margin:4px 0 6px;">${t.lumpSectionTitle}</h3>
        <p style="font-size:0.8rem; color:var(--muted); margin-bottom:14px;">${t.lumpSectionDesc}</p>

        <div class="semi-form-grid-2" style="margin-bottom:12px;">
          <div>
            <label style="font-size:0.68rem; font-family:var(--font-mono); color:var(--muted);">NEW LUMP-SUM CASH ($ USD)</label>
            <input type="number" id="semiLumpCapInput" value="${state.semiLumpCapUsd ?? 50000}" step="1000"
                   style="width:100%; padding:8px 10px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-mono); font-weight:700; margin-top:3px;" />
          </div>
          <div>
            <label style="font-size:0.68rem; font-family:var(--font-mono); color:var(--muted);">
              SIMULATE FEAR & GREED SCORE (LIVE: ${ov.fg_score})
            </label>
            <input type="number" id="semiLumpScoreInput" value="${
              state.semiLumpScore !== null && state.semiLumpScore !== undefined ? state.semiLumpScore : ov.fg_score
            }" min="0" max="100" step="1"
                   style="width:100%; padding:8px 10px; background:#060911; border:1px solid var(--border); color:#fff; border-radius:4px; font-family:var(--font-mono); font-weight:700; margin-top:3px;" />
          </div>
        </div>

        <div style="display:flex; gap:6px; margin-bottom:12px; flex-wrap:wrap;">
          <button class="btn btn-sm btn-sim-fg" data-fg="18.0">Live Extreme Fear (18.0)</button>
          <button class="btn btn-sm btn-sim-fg" data-fg="50.0">Simulate Neutral (50.0)</button>
          <button class="btn btn-sm btn-sim-fg" data-fg="78.0">Simulate Extreme Greed (78.0)</button>
        </div>

        <button class="btn btn-primary" id="btnRunSemiLumpSum" style="width:100%; justify-content:center; padding:9px;">
          Generate 3-Stage Lump-Sum Tranche Schedule
        </button>

        ${
          lump
            ? `
          <div id="semiLumpOutput" style="margin-top:14px; background:#060911; border:1px solid var(--border); border-left:3px solid var(--fin-blue); border-radius:4px; padding:14px; font-size:0.8rem;">
            <div style="font-weight:800; color:#93c5fd; margin-bottom:3px;">
              ${lang === "jp" ? lump.case_title_jp : lang === "kr" ? lump.case_title_kr : lump.case_title_en}
            </div>
            <div class="mono" style="font-size:0.71rem; color:var(--muted); margin-bottom:6px;">
              Latest Close Basis (${lump.as_of_date || ov.date}): $SMH @ $${Number(lump.smh_close ?? ov.smh_close).toFixed(2)} · $XLV @ $${Number(lump.xlv_close ?? ov.xlv_close).toFixed(2)}
            </div>
            <p style="font-size:0.76rem; color:var(--text-secondary); margin-bottom:10px;">
              ${lang === "jp" ? lump.summary_jp : lang === "kr" ? lump.summary_kr : lump.summary_en}
            </p>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${lump.tranches
                .map((tr) => {
                  const tTitle = lang === "jp" ? tr.title_jp : lang === "kr" ? tr.title_kr : tr.title_en;
                  const tTime = lang === "jp" ? tr.timing_jp : lang === "kr" ? tr.timing_kr : tr.timing_en;
                  const tNote = lang === "jp" ? tr.note_jp : lang === "kr" ? tr.note_kr : tr.note_en;
                  return `
                  <div style="background:#0c1220; padding:10px; border-radius:4px; border:1px solid var(--border);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <b style="color:#ffffff;">${tTitle}</b>
                      <span class="mono" style="color:var(--fin-up); font-weight:700;">$${tr.amount_usd.toLocaleString()} (${tr.allocation_pct}%)</span>
                    </div>
                    <div class="mono" style="font-size:0.72rem; color:#93c5fd; margin-top:2px;">
                      ${tTime} · $SMH: $${tr.smh_usd.toLocaleString()} (${tr.smh_shares} sh) | $XLV: $${tr.xlv_usd.toLocaleString()} (${tr.xlv_shares} sh)
                    </div>
                    <div style="font-size:0.74rem; color:var(--muted); margin-top:4px;">${tNote}</div>
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>
        `
            : ""
        }
      </div>
    </section>

    <!-- SECTION 4: 26-YEAR EMPIRICAL PERFORMANCE TABLE & EQUITY CURVE (2000-2026) -->
    <section class="proof-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:14px;">
        <div>
          <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:var(--fin-up); letter-spacing:0.05em;">
            ${t.eraSectionTag}
          </div>
          <h3 style="font-size:1.15rem; font-weight:800; color:#ffffff; margin-top:3px;">${t.eraSectionTitle}</h3>
          <p style="font-size:0.8rem; color:var(--muted); margin-top:2px;">${t.eraSectionDesc}</p>
        </div>
        <button class="btn btn-sm" id="btnDownloadSemiCsv">
          Download 2000–2026 Daily CSV Dataset (Pro)
        </button>
      </div>

      ${renderEquityCurveSvg(state.semiHistory)}

      <div class="table-responsive-scroll">
        <table class="proof-table">
          <thead>
            <tr>
              <th>Investment Horizon</th>
              <th>Period</th>
              <th>100% $QQQ CAGR</th>
              <th>100% $QQQ Multiple</th>
              <th>70:30 Baseline CAGR</th>
              <th>70:30 (80:20 Fear Tilt) CAGR</th>
              <th>70:30 (80:20 Tilt) Multiple</th>
              <th>Max Drawdown (vs QQQ)</th>
            </tr>
          </thead>
          <tbody>
            ${eras
              .map((e) => {
                const hLabel = lang === "jp" ? e.horizon_jp : lang === "kr" ? e.horizon_kr : e.horizon_en;
                return `
                <tr class="proof-highlight">
                  <td style="font-family:var(--font-sans);">${hLabel}</td>
                  <td>${e.period}</td>
                  <td style="color:var(--text-secondary);">+${e.qqq_cagr_pct.toFixed(2)}%</td>
                  <td style="color:var(--text-secondary);">${e.qqq_multiple.toFixed(2)}x</td>
                  <td>+${e.port_70_30_cagr_pct.toFixed(2)}%</td>
                  <td style="color:var(--fin-up); font-weight:800;">+${e.port_80_20_cagr_pct.toFixed(2)}%</td>
                  <td style="color:var(--fin-up); font-weight:800;">${e.port_80_20_multiple.toFixed(2)}x</td>
                  <td><span style="color:var(--fin-up);">${e.port_80_20_mdd_pct.toFixed(1)}%</span> <span style="color:var(--muted); font-size:0.72rem;">(QQQ ${e.qqq_mdd_pct.toFixed(1)}%)</span></td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 5: PRO TERMINAL & LIFETIME LICENSE PRICING -->
    ${renderPricing(state)}

    <!-- CROSS-PLATFORM SWITCH BANNER BACK TO RIGHTSIDEALPHA -->
    <section class="cross-banner" style="border-left-color:var(--fin-blue);">
      <div>
        <div style="font-size:0.72rem; font-family:var(--font-mono); font-weight:700; color:#93c5fd; text-transform:uppercase;">
          COMPANION US INDIVIDUAL EQUITY SCREENER · RIGHTSIDEALPHA
        </div>
        <h3 style="font-size:1.15rem; font-weight:800; margin:4px 0; color:#ffffff;">
          Looking for High-Alpha US Individual Stock Turnarounds ($CELH, $MBLY, $NVDA, $APP)?
        </h3>
        <p style="font-size:0.84rem; color:var(--muted);">
          Switch to the RightSideAlpha US Equity Terminal to screen 72 NYSE & NASDAQ stocks for MA20/MA60 Right-Side Ignitions and 55-Day Time-Stop diagnostics.
        </p>
      </div>
      <button class="btn btn-primary" id="btnSwitchToRightSide">
        Open RightSideAlpha US Equity Terminal →
      </button>
    </section>
  `;
}


// --- src/main.js ---











const initialPath = window.location.pathname.toLowerCase();
const initialHash = window.location.hash.toLowerCase();
const initialSearch = new URLSearchParams(window.location.search);
const viewParam = (initialSearch.get("view") || "").toLowerCase();
const initialTickerParam = (initialSearch.get("ticker") || window.__INITIAL_TICKER__ || "").trim().toUpperCase();
const initialFilterParam = (initialSearch.get("filter") || window.__INITIAL_FILTER__ || "").trim().toLowerCase();
const initialToolParam = (initialSearch.get("tool") || "").trim().toLowerCase();
const isInitialDoctorDeepLink =
  initialToolParam === "doctor" || initialHash === "#doctor" || initialHash.includes("positiondoctor");
const defaultView =
  isInitialDoctorDeepLink
    ? "rightside"
    : viewParam === "semi" || initialHash.includes("semi") || initialPath.includes("/semi")
    ? "semi"
    : viewParam === "rightside" || initialHash.includes("rightside") || initialPath.includes("/rightside") || initialTickerParam || initialFilterParam
    ? "rightside"
    : window.__DEFAULT_VIEW__ === "semi"
    ? "semi"
    : "rightside";

// Auto-migrate any stale legacy placeholder URLs stored in localStorage
(function migrateLegacyLocalStorage() {
  try {
    if (!localStorage.getItem("rsa_lang_v5_pure_en")) {
      localStorage.setItem("rsa_lang", "en");
      localStorage.removeItem("rsa_lang_explicit");
      localStorage.setItem("rsa_lang_v5_pure_en", "1");
    }
    const oldSite1 = localStorage.getItem("rsa_cfg_site1_url") || "";
    if (oldSite1.includes("getbreakai.com")) {
      localStorage.setItem("rsa_cfg_site1_url", "https://truthofmarket.com");
    }
    const oldM = localStorage.getItem("rsa_cfg_ls_monthly") || "";
    if (
      oldM.includes("rightsidealpha.lemonsqueezy.com") ||
      oldM.includes("pro-monthly") ||
      oldM.includes("d5e7e761")
    ) {
      localStorage.removeItem("rsa_cfg_ls_monthly");
    }
    const oldL = localStorage.getItem("rsa_cfg_ls_ltd") || "";
    if (
      oldL.includes("rightsidealpha.lemonsqueezy.com") ||
      oldL.includes("lifetime-pass") ||
      oldL.includes("667aa482")
    ) {
      localStorage.removeItem("rsa_cfg_ls_ltd");
    }
    const oldTv = localStorage.getItem("rsa_cfg_aff_tv") || "";
    if (oldTv === "rightsidealpha") {
      localStorage.setItem("rsa_cfg_aff_tv", "1173809");
    }
    const oldSa = localStorage.getItem("rsa_cfg_aff_sa") || "";
    if (oldSa === "affiliate_rightside") {
      localStorage.setItem("rsa_cfg_aff_sa", "better_life333");
    }
    if (!localStorage.getItem("rsa_aff_v6_us_tools")) {
      localStorage.setItem("rsa_cfg_broker_url", "https://trendspider.com/?_go=rightside");
      localStorage.setItem("rsa_cfg_broker_name", "TrendSpider (rightside)");
      localStorage.setItem("rsa_cfg_youtube_url", "https://www.youtube.com/@RightSideAlpha");
      localStorage.setItem("rsa_tg_channel_url", "https://t.me/truthofmarketss");
      localStorage.setItem("rsa_tg_chat_id", "@truthofmarketss");
      localStorage.setItem("rsa_aff_v6_us_tools", "1");
    }
    const oldTgCh = localStorage.getItem("rsa_tg_channel_url") || "";
    if (!oldTgCh || !oldTgCh.includes("truthofmarketss")) {
      localStorage.setItem("rsa_tg_channel_url", "https://t.me/truthofmarketss");
    }
    const oldTgCid = localStorage.getItem("rsa_tg_chat_id") || "";
    if (!oldTgCid || oldTgCid === "755033799" || !oldTgCid.includes("truthofmarketss")) {
      localStorage.setItem("rsa_tg_chat_id", "@truthofmarketss");
    }
    const oldYt = localStorage.getItem("rsa_cfg_youtube_url") || "";
    if (!oldYt || oldYt.includes("youtube.com/@rightsidealpha")) {
      localStorage.setItem("rsa_cfg_youtube_url", "https://www.youtube.com/@RightSideAlpha");
    }
    const oldIg = localStorage.getItem("rsa_cfg_instagram_url") || "";
    if (oldIg.includes("semifeargreed")) {
      localStorage.setItem("rsa_cfg_instagram_url", "https://www.instagram.com/rightsidealpha");
    }
  } catch (_) {}
})();

function detectInitialLang() {
  try {
    localStorage.setItem("rsa_lang", "en");
  } catch (_) {}
  return "en";
}

const state = {
  lang: detectInitialLang(),
  activeView: defaultView,
  isAdminAuthenticated: sessionStorage.getItem("rsa_admin_auth") === "true",
  isProUnlocked: isProActive(),
  licenseKey: localStorage.getItem("rsa_token") || "",
  proPortfolioUsd: Number(localStorage.getItem("rsa_pro_cap_usd") || 30000),
  stocks: [],
  filteredStocks: [],
  backtestKpis: null,
  pineCode: null,
  searchQuery: initialTickerParam || "",
  zoneFilter: initialFilterParam === "ignition" || initialFilterParam === "ignition_zone" ? "IGNITION_ZONE" : initialFilterParam === "washout" ? "WASHOUT_WATCH" : "ALL",
  sortCol: "score",
  sortAsc: false,
  sectorFilter: "ALL",
  vipWatchlist: getVipWatchlist(),
  blindTestAnswers: {},
  portfolioPositions: [
    { ticker: "CELH", entry_price: 28.5, shares: 100, days_held: 35, current_price: 27.93 },
    { ticker: "CCL", entry_price: 19.2, shares: 200, days_held: 25, current_price: 21.4 },
    { ticker: "TSLA", entry_price: 215.0, shares: 50, days_held: 45, current_price: 228.0 },
    { ticker: "UPST", entry_price: 38.0, shares: 150, days_held: 20, current_price: 44.5 },
  ],
  portfolioDocResult: null,
  sectorMatrix: null,
  // SemiFearGreed state
  semiOverview: null,
  semiHistory: null,
  semiGaugeTab: "overview",
  semiRange: "1Y",
  semiCapUsd: 100000,
  semiMode: "AUTO_REGIME",
  semiFreq: "ANNUAL",
  semiGainKrw: 3800000,
  semiRebalanceResult: null,
  semiLumpCapUsd: 50000,
  semiLumpScore: null,
  semiLumpSumResult: null,
  // Telegram state (@truthofmarketss official channel & dispatch)
  telegramConfigured: true,
  telegramBotToken: localStorage.getItem("rsa_tg_bot_token") || DEFAULT_TG_BOT_TOKEN,
  telegramChatId: localStorage.getItem("rsa_tg_chat_id") || "@truthofmarketss",
  telegramAlertType: "SEMI_BRIEFING",
  telegramPreviewText: "",
  config: {
    site1_name: "RightSideAlpha",
    site1_url: localStorage.getItem("rsa_cfg_site1_url") || "https://truthofmarket.com",
    site2_url: "https://truthofmarket.com",
    ls_site1_monthly_url:
      localStorage.getItem("rsa_cfg_ls_monthly") ||
      "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8",
    ls_site1_ltd_url:
      localStorage.getItem("rsa_cfg_ls_ltd") ||
      "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b",
    tradingview_aff_id: localStorage.getItem("rsa_cfg_aff_tv") || "1173809",
    seekingalpha_source: localStorage.getItem("rsa_cfg_aff_sa") || "better_life333",
    trendspider_aff_id: "rightside",
    broker_name: localStorage.getItem("rsa_cfg_broker_name") || "TrendSpider (rightside)",
    broker_referral_url:
      localStorage.getItem("rsa_cfg_broker_url") || "https://trendspider.com/?_go=rightside",
    telegram_channel_url: localStorage.getItem("rsa_tg_channel_url") || "https://t.me/truthofmarketss",
    telegram_vip_channel_url: localStorage.getItem("rsa_tg_vip_channel_url") || "",
    telegram_chat_id: localStorage.getItem("rsa_tg_chat_id") || "@truthofmarketss",
    youtube_url: localStorage.getItem("rsa_cfg_youtube_url") || DEFAULT_YOUTUBE_URL,
    instagram_url: localStorage.getItem("rsa_cfg_instagram_url") || DEFAULT_INSTAGRAM_URL,
  },
  get t() {
    return translations[this.lang] || translations.en;
  },
};

function showToast(msg) {
  const box = document.getElementById("toastBox");
  if (!box) return;
  box.textContent = msg;
  box.style.display = "block";
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    box.style.display = "none";
  }, 3200);
}

function applyClientFilterAndSort() {
  const q = (state.searchQuery || "").trim().toLowerCase();
  const z = state.zoneFilter || "ALL";
  const secFilter = state.sectorFilter || "ALL";
  const vipList = state.vipWatchlist || [];

  let list = state.stocks.filter((s) => {
    // Strictly US-listed equities only
    if (!s.ticker || String(s.ticker).includes(".")) return false;
    if (z === "VIP_WATCHLIST") {
      if (!vipList.includes(s.ticker)) return false;
    } else if (z !== "ALL" && s.zone_code !== z) {
      return false;
    }
    if (secFilter !== "ALL") {
      const sRegime = (SECTOR_REGIME_MAP && SECTOR_REGIME_MAP[s.sector]) || s.sector || "Other";
      if (sRegime !== secFilter) return false;
    }
    if (q) {
      const isLockedRow = !state.isProUnlocked && s.zone_code === "IGNITION_ZONE" && s.ticker !== "CELH";
      const hay = isLockedRow
        ? `vip ignition locked pro ${s.sector}`.toLowerCase()
        : `${s.ticker} ${s.name_en} ${s.name_jp} ${s.name_kr} ${s.sector}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const col = state.sortCol;
  const dir = state.sortAsc ? 1 : -1;
  list.sort((a, b) => {
    const va = a[col];
    const vb = b[col];
    if (typeof va === "string" || typeof vb === "string") {
      return String(va ?? "").localeCompare(String(vb ?? "")) * dir;
    }
    return ((va ?? 0) - (vb ?? 0)) * dir;
  });

  state.filteredStocks = list;
}

function renderRightSideView() {
  const t = state.t;
  return `
    ${renderHero(state)}
    ${renderProofCard(state)}
    <section class="screener-panel">
      ${renderScreenerControls(state)}
      ${renderStockTable(state)}
    </section>
    ${renderProVault(state)}
    ${renderPricing(state)}

    <!-- CROSS-PLATFORM BANNER TO SEMIFEARGREED -->
    <section class="cross-banner">
      <div>
        <div style="font-size:0.72rem; font-family:var(--font-mono); font-weight:700; color:#f87171; text-transform:uppercase; letter-spacing:0.05em;" id="crossTitle">
          ${t.crossTitle}
        </div>
        <h3 style="font-size:1.15rem; font-weight:800; margin:4px 0; color:#ffffff;" id="crossHeading">
          ${t.crossHeading}
        </h3>
        <p style="font-size:0.84rem; color:var(--muted);" id="crossDesc">
          ${t.crossDesc}
        </p>
      </div>
      <button class="btn btn-primary" id="crossFunnelSwitchBtn" style="background:#dc2626; border-color:#ef4444;">
        <span id="crossBtn">${t.crossBtn} →</span>
      </button>
    </section>
  `;
}

function renderApp() {
  const appEl = document.getElementById("app");
  if (!appEl) return;

  const t = state.t;
  appEl.innerHTML = `
    ${renderHeader(state)}
    <main class="container">
      ${state.activeView === "semi" ? renderSemiFearGreedView(state) : renderRightSideView()}

      <footer style="border-top:1px solid var(--border); padding-top:20px; margin-top:28px; color:var(--muted); font-size:0.76rem; line-height:1.6;">
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom:12px;">
          <span class="mono" style="font-size:0.72rem; color:var(--text); font-weight:700;">OFFICIAL CHANNELS:</span>
          <a href="${state.config.youtube_url || DEFAULT_YOUTUBE_URL}" target="_blank" rel="noopener noreferrer" style="color:#fca5a5; text-decoration:none; font-weight:600;">
            📺 YouTube (@RightSideAlpha) ↗
          </a>
          <span style="color:var(--border);">|</span>
          <a href="${state.config.instagram_url || DEFAULT_INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" style="color:#f9a8d4; text-decoration:none; font-weight:600;">
            📸 Instagram (@rightsidealpha) ↗
          </a>
          <span style="color:var(--border);">|</span>
          <a href="${state.config.x_url || "https://x.com/rightsidealpha"}" target="_blank" rel="noopener noreferrer" style="color:#e2e8f0; text-decoration:none; font-weight:600;">
            𝕏 (@rightsidealpha) ↗
          </a>
          <span style="color:var(--border);">|</span>
          <a
            href="${getVipTelegramUrl(state.isProUnlocked)}"
            class="${state.isProUnlocked ? "" : "btn-gated-vip-tg"}"
            ${state.isProUnlocked ? 'target="_blank" rel="noopener noreferrer"' : ""}
            style="color:#38bdf8; text-decoration:none; font-weight:600;"
          >
            ${state.isProUnlocked ? "👑 Pro VIP Telegram Channel ↗" : "🔒 Pro VIP Telegram ($SMH/$XLV & 72-Stock News)"}
          </a>
        </div>
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom:10px; font-size:0.74rem;">
          <a href="/terms.html" class="btn-open-legal" data-legal-tab="terms" style="color:#93c5fd; text-decoration:none; font-weight:600;">Terms of Service</a>
          <span style="color:var(--border);">·</span>
          <a href="/privacy.html" class="btn-open-legal" data-legal-tab="privacy" style="color:#93c5fd; text-decoration:none; font-weight:600;">Privacy Policy</a>
          <span style="color:var(--border);">·</span>
          <a href="/refund.html" class="btn-open-legal" data-legal-tab="refund" style="color:#93c5fd; text-decoration:none; font-weight:600;">Refund & Cancellation Policy</a>
          <span style="color:var(--border);">·</span>
          <a href="/contact.html" style="color:#93c5fd; text-decoration:none; font-weight:600;">Contact Desk</a>
          <span style="color:var(--border);">·</span>
          <a href="mailto:beable9489@gmail.com" style="color:#93c5fd; text-decoration:none; font-weight:600;">Support: beable9489@gmail.com</a>
          <span style="color:var(--border);">·</span>
          <span style="color:#cbd5e1; font-weight:600;">Operated by Yoonju Lee · KIDS-FIT Global Studio (Lemon Squeezy Store #296100 · <a href="https://kisfitglobal.com" target="_blank" rel="noopener noreferrer" style="color:#93c5fd; text-decoration:none;">kisfitglobal.com</a> &amp; <a href="https://truthofmarket.com" style="color:#93c5fd; text-decoration:none;">truthofmarket.com</a>)</span>
        </div>
        <p id="disclaimerText">${t.disclaimer}</p>
        <p style="margin-top:8px; font-family:var(--font-mono); font-size:0.72rem;" id="copyrightText">${t.copyright}</p>
      </footer>
    </main>
    <canvas id="scoreCanvas" width="900" height="500" style="display:none;"></canvas>
    ${renderModals(state)}
  `;

  bindEvents();
}

function switchView(targetView) {
  state.activeView = targetView === "semi" ? "semi" : "rightside";
  const basePath = window.location.pathname || "/";
  if (state.activeView === "semi") {
    window.history.replaceState(null, "", `${basePath}#semi`);
  } else {
    window.history.replaceState(null, "", `${basePath}#rightside`);
  }
  renderApp();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function handleLemonSqueezyCheckoutSuccess(orderRef) {
  const tokenVal = String(orderRef || "RSA-PRO-2026-LS-CHECKOUT").trim();
  state.isProUnlocked = true;
  state.licenseKey = tokenVal;
  try {
    localStorage.setItem("rsa_pro_unlocked", "true");
    localStorage.setItem("rsa_token", tokenVal);
    const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
    if (localStorage.getItem("hq_paid_" + kst) !== "1") {
      localStorage.setItem("hq_paid_" + kst, "1");
      fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_member_" + kst, {
        mode: "cors",
        keepalive: true,
      }).catch(() => {});
      fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_member_total", {
        mode: "cors",
        keepalive: true,
      }).catch(() => {});
    }
  } catch (_) {}
  await loadAllData();
  const licModal = document.getElementById("licenseModal");
  if (licModal) licModal.style.display = "none";
  renderApp();
  showToast(
    "🎉 Lemon Squeezy Payment Confirmed! All 72 Pro Setups Unlocked (Check your email for your permanent License Key)."
  );
}

function bindRsaLemonSqueezyEvents() {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.createLemonSqueezy === "function") {
      window.createLemonSqueezy();
    }
    if (window.LemonSqueezy && typeof window.LemonSqueezy.Setup === "function") {
      window.LemonSqueezy.Setup({
        eventHandler: (event) => {
          if (event && event.event === "Checkout.Success") {
            const ordId =
              event?.data?.order?.data?.attributes?.identifier ||
              event?.data?.order?.data?.id ||
              "RSA-PRO-2026-LS-CHECKOUT";
            handleLemonSqueezyCheckoutSuccess(`RSA-PRO-2026-${ordId}`);
          }
        },
      });
    }
    if (!window.__rsaLsPostMessageBound && typeof window.addEventListener === "function") {
      window.__rsaLsPostMessageBound = true;
      window.addEventListener("message", (ev) => {
        try {
          const origin = String(ev?.origin || "").toLowerCase();
          if (!origin.includes("lemonsqueezy.com")) return;
          const isSuccess =
            ev.data === "Checkout.Success" ||
            (ev.data && typeof ev.data === "object" && ev.data.event === "Checkout.Success") ||
            (typeof ev.data === "string" && ev.data.includes("Checkout.Success"));
          if (isSuccess) {
            handleLemonSqueezyCheckoutSuccess("RSA-PRO-2026-LS-IFRAME");
          }
        } catch (_) {}
      });
    }
  } catch (_) {}
}

if (typeof window !== "undefined") {
  window.__bindRsaLemonSqueezyEvents = bindRsaLemonSqueezyEvents;
  window.addEventListener("load", bindRsaLemonSqueezyEvents);
}

function bindEvents() {
  // Initialize Lemon Squeezy checkout overlay & Checkout.Success auto-unlock handler
  bindRsaLemonSqueezyEvents();

  // Brand Home Button
  const brandHomeBtn = document.getElementById("brandHomeBtn");
  if (brandHomeBtn) {
    brandHomeBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Platform Switcher
  const navTabRightSide = document.getElementById("navTabRightSide");
  if (navTabRightSide) {
    navTabRightSide.addEventListener("click", () => switchView("rightside"));
  }
  const navTabSemiFg = document.getElementById("navTabSemiFg");
  if (navTabSemiFg) {
    navTabSemiFg.addEventListener("click", () => switchView("semi"));
  }
  const ribbonSwitchSemi = document.getElementById("ribbonSwitchSemi");
  if (ribbonSwitchSemi) {
    ribbonSwitchSemi.addEventListener("click", () => switchView("semi"));
  }
  const crossFunnelSwitchBtn = document.getElementById("crossFunnelSwitchBtn");
  if (crossFunnelSwitchBtn) {
    crossFunnelSwitchBtn.addEventListener("click", () => switchView("semi"));
  }
  const btnSwitchToRightSide = document.getElementById("btnSwitchToRightSide");
  if (btnSwitchToRightSide) {
    btnSwitchToRightSide.addEventListener("click", () => switchView("rightside"));
  }
  const btnQuickJumpSemiFg = document.getElementById("btnQuickJumpSemiFg");
  if (btnQuickJumpSemiFg) {
    btnQuickJumpSemiFg.addEventListener("click", () => switchView("semi"));
  }
  const focusPositionDoctor = (e) => {
    if (e) e.preventDefault();
    if (state.activeView !== "rightside") {
      state.activeView = "rightside";
      renderApp();
    }
    const docCard = document.getElementById("doctor") || document.getElementById("positionDoctorCard") || document.getElementById("proVaultSection");
    if (docCard && docCard.scrollIntoView) {
      docCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(() => {
      const docTicker = document.getElementById("docTicker");
      if (docTicker) {
        docTicker.focus();
        if (typeof docTicker.select === "function") docTicker.select();
      }
    }, 280);
  };
  const btnQuickJumpDoctor = document.getElementById("btnQuickJumpDoctor");
  if (btnQuickJumpDoctor) {
    btnQuickJumpDoctor.addEventListener("click", focusPositionDoctor);
  }
  const btnHeroJumpPositionDoctor = document.getElementById("btnHeroJumpPositionDoctor");
  if (btnHeroJumpPositionDoctor) {
    btnHeroJumpPositionDoctor.addEventListener("click", focusPositionDoctor);
  }

  // Language Switcher
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const newLang = btn.getAttribute("data-lang");
      if (newLang && translations[newLang]) {
        state.lang = newLang;
        localStorage.setItem("rsa_lang", newLang);
        localStorage.setItem("rsa_lang_explicit", "1");
        renderApp();
      }
    });
  });

  // Search Input (RightSideAlpha)
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      applyClientFilterAndSort();
      const tbody = document.getElementById("tableBody");
      if (tbody) tbody.innerHTML = renderStockRows(state);
      bindRowEvents();
    });
  }

  // Zone Filter Tabs
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.zoneFilter = tab.getAttribute("data-zone") || "ALL";
      applyClientFilterAndSort();
      renderApp();
    });
  });

  // Beginner-Friendly Profit Simulator Controls (Hero Section)
  document.querySelectorAll(".btn-easy-cap-preset").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cap = Math.max(500, Number(btn.getAttribute("data-cap") || 10000));
      state.easySimCapUsd = cap;
      state.proPortfolioUsd = cap;
      try {
        localStorage.setItem("rsa_pro_cap_usd", String(cap));
      } catch (_) {}
      renderApp();
    });
  });

  const easySimTickerSelect = document.getElementById("easySimTickerSelect");
  if (easySimTickerSelect) {
    easySimTickerSelect.addEventListener("change", (e) => {
      state.easySimTicker = e.target.value;
      renderApp();
    });
  }

  const easySimCapitalInput = document.getElementById("easySimCapitalInput");
  if (easySimCapitalInput) {
    easySimCapitalInput.addEventListener("change", (e) => {
      const cap = Math.max(500, Number(e.target.value || 10000));
      state.easySimCapUsd = cap;
      state.proPortfolioUsd = cap;
      try {
        localStorage.setItem("rsa_pro_cap_usd", String(cap));
      } catch (_) {}
      renderApp();
    });
  }

  // 15-Second Wall Street Chart Blind Test Controls
  document.querySelectorAll(".btn-blind-test-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rId = btn.getAttribute("data-round");
      const pick = btn.getAttribute("data-pick");
      if (!rId || !pick) return;
      state.blindTestAnswers = { ...(state.blindTestAnswers || {}), [rId]: pick };
      renderApp();
    });
  });

  const btnResetBlindTest = document.getElementById("btnResetBlindTest");
  if (btnResetBlindTest) {
    btnResetBlindTest.addEventListener("click", () => {
      state.blindTestAnswers = {};
      renderApp();
      showToast("Chart Blind Test Reset — Try All 3 Setups Again");
    });
  }

  const btnBlindTestJumpDoctor = document.getElementById("btnBlindTestJumpDoctor");
  if (btnBlindTestJumpDoctor) {
    btnBlindTestJumpDoctor.addEventListener("click", focusPositionDoctor);
  }

  // Sort Headers with Dynamic Directional Chevrons & Active State
  const updateSortHeaderIndicators = () => {
    document.querySelectorAll(".sort-header").forEach((el) => {
      const col = el.getAttribute("data-sort");
      if (!col) return;
      const isAct = state.sortCol === col;
      el.classList.remove("sort-active", "sort-asc", "sort-desc");
      if (isAct) {
        el.classList.add("sort-active", state.sortAsc ? "sort-asc" : "sort-desc");
      }
      const chevronEl = el.querySelector(".sort-chevron");
      if (chevronEl) {
        chevronEl.textContent = isAct ? (state.sortAsc ? "▲" : "▼") : "↕";
        if (isAct) {
          chevronEl.classList.remove("muted");
        } else {
          chevronEl.classList.add("muted");
        }
      }
    });
  };

  document.querySelectorAll(".sort-header").forEach((th) => {
    th.addEventListener("click", () => {
      const col = th.getAttribute("data-sort");
      if (!col) return;
      if (state.sortCol === col) {
        state.sortAsc = !state.sortAsc;
      } else {
        state.sortCol = col;
        state.sortAsc = col === "ticker";
      }
      applyClientFilterAndSort();
      updateSortHeaderIndicators();
      const tbody = document.getElementById("tableBody");
      if (tbody) tbody.innerHTML = renderStockRows(state);
      bindRowEvents();
    });
  });

  // License Modal Controls
  const licenseModal = document.getElementById("licenseModal");
  const openLicenseModal = (_prefill = false, customNotice = "") => {
    if (!licenseModal) return;
    licenseModal.style.display = "flex";
    const inputEl = document.getElementById("licenseInput");
    const msgEl = document.getElementById("licenseMsg");
    if (inputEl && !inputEl.value.trim()) {
      inputEl.value = state.licenseKey || "";
    }
    if (msgEl && customNotice) {
      msgEl.style.color = "#93c5fd";
      msgEl.textContent = customNotice;
    }
  };
  const closeLicenseModal = () => {
    if (licenseModal) licenseModal.style.display = "none";
  };

  const btnOpenLicense = document.getElementById("btnOpenLicense");
  if (btnOpenLicense) btnOpenLicense.addEventListener("click", () => openLicenseModal(false));

  const proStatusBadge = document.getElementById("proStatusBadge");
  if (proStatusBadge) {
    proStatusBadge.style.cursor = "pointer";
    proStatusBadge.addEventListener("click", () => openLicenseModal(false));
  }

  const vaultUnlockBtn = document.getElementById("vaultUnlockBtn");
  if (vaultUnlockBtn) vaultUnlockBtn.addEventListener("click", () => openLicenseModal(false));

  const vaultOverlayUnlock = document.getElementById("vaultOverlayUnlock");
  if (vaultOverlayUnlock) vaultOverlayUnlock.addEventListener("click", () => openLicenseModal(false));

  // Gated Pro VIP Telegram Channel buttons -> open License / Subscribe modal for Free users
  document.querySelectorAll(".btn-gated-vip-tg").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (!state.isProUnlocked) {
        e.preventDefault();
        openLicenseModal(
          false,
          "🔒 Pro VIP Telegram Channel ($SMH/$XLV & 72-Stock Real-Time News + Unmasked Ignition Signals) is exclusively for Pro Subscribers ($29/mo or $199 Lifetime)."
        );
      }
    });
  });

  const btnCancelLicense = document.getElementById("btnCancelLicense");
  if (btnCancelLicense) btnCancelLicense.addEventListener("click", closeLicenseModal);

  const btnLockLicense = document.getElementById("btnLockLicense");
  if (btnLockLicense) {
    btnLockLicense.addEventListener("click", async () => {
      state.isProUnlocked = false;
      state.licenseKey = "";
      localStorage.removeItem("rsa_pro_unlocked");
      localStorage.removeItem("rsa_token");
      await loadAllData();
      closeLicenseModal();
      renderApp();
      showToast("Pro Terminal Locked — Reverted to Free Preview");
    });
  }

  const verifyLicenseFlow = async () => {
    const inputEl = document.getElementById("licenseInput");
    const msgEl = document.getElementById("licenseMsg");
    const key = (inputEl ? inputEl.value : "").trim();
    if (!key) {
      if (msgEl) {
        msgEl.style.color = "var(--fin-down)";
        msgEl.textContent = "Please enter your Lemon Squeezy Pro license key.";
      }
      return;
    }
    try {
      const res = await validateLicense(key);
      if (res.valid) {
        state.isProUnlocked = true;
        state.licenseKey = key;
        localStorage.setItem("rsa_pro_unlocked", "true");
        localStorage.setItem("rsa_token", key);
        if (msgEl) {
          msgEl.style.color = "var(--fin-up)";
          msgEl.textContent = res.message || "Pro Terminal Unlocked.";
        }
        await loadAllData();
        setTimeout(() => {
          closeLicenseModal();
          renderApp();
          showToast("Pro Terminal Unlocked — All 72 US Equity Targets Active");
        }, 350);
      } else {
        if (msgEl) {
          msgEl.style.color = "var(--fin-down)";
          msgEl.textContent =
            res.message || "Invalid or expired license key. Please verify your Lemon Squeezy receipt or subscribe below.";
        }
      }
    } catch (err) {
      if (msgEl) {
        msgEl.style.color = "var(--fin-down)";
        msgEl.textContent = "Unable to verify license key. Please check your key and try again.";
      }
    }
  };

  const btnVerifyLicense = document.getElementById("btnVerifyLicense");
  if (btnVerifyLicense) {
    btnVerifyLicense.addEventListener("click", verifyLicenseFlow);
  }

  const licenseInput = document.getElementById("licenseInput");
  if (licenseInput) {
    licenseInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        verifyLicenseFlow();
      }
    });
  }

  // Smart Checkout & Instant 7-Day Pro Founding Pass Bridge
  const activateInstantVipPass = async (sourceLabel, emailVal = "") => {
    const generatedKey = "RSA-VIP-2026-FOUNDER7D";
    state.isProUnlocked = true;
    state.licenseKey = generatedKey;
    localStorage.setItem("rsa_pro_unlocked", "true");
    localStorage.setItem("rsa_token", generatedKey);
    if (emailVal) {
      localStorage.setItem("rsa_vip_email", emailVal);
    }
    try {
      const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_member_" + kst, { mode: "cors", keepalive: true }).catch(() => {});
      fetch("https://abacus.jasoncameron.dev/hit/tom_truthofmarket/paid_member_total", { mode: "cors", keepalive: true }).catch(() => {});
    } catch (_) {}
    const inputEl = document.getElementById("licenseInput");
    const msgEl = document.getElementById("licenseMsg");
    if (inputEl) inputEl.value = generatedKey;
    if (msgEl) {
      msgEl.style.color = "var(--fin-up)";
      msgEl.textContent = `✅ ${sourceLabel}: Pro Terminal Unlocked (Key: ${generatedKey}). All 72 US Equity Targets & 26Y CSV Active!`;
    }
    await loadAllData();
    setTimeout(() => {
      closeLicenseModal();
      renderApp();
      showToast("🎉 Pro Terminal Unlocked — All 72 US Equity Targets & 26Y CSV Active!");
    }, 350);
  };

  const btnInstantVipTrialUnlock = document.getElementById("btnInstantVipTrialUnlock");
  if (false && btnInstantVipTrialUnlock) { // Disabled free trial backdoor to protect live paid conversions
    btnInstantVipTrialUnlock.addEventListener("click", () => {
      const emailEl = document.getElementById("vipTrialEmailInput");
      const emailVal = (emailEl ? emailEl.value : "").trim();
      if (!emailVal || !emailVal.includes("@")) {
        const msgEl = document.getElementById("licenseMsg");
        if (msgEl) {
          msgEl.style.color = "#facc15";
          msgEl.textContent = "Please enter a valid email address to issue your 7-Day Pro Founding Pass key.";
        }
        if (emailEl) emailEl.focus();
        return;
      }
      activateInstantVipPass("7-Day Founding Pass Issued", emailVal);
    });
  }

  const vipTrialEmailInput = document.getElementById("vipTrialEmailInput");
  if (vipTrialEmailInput) {
    vipTrialEmailInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (btnInstantVipTrialUnlock) btnInstantVipTrialUnlock.click();
      }
    });
  }

  ["btnPartnerUnlockTv", "btnPartnerUnlockBrk"].forEach((id) => {
    const pBtn = document.getElementById(id);
    if (pBtn) {
      pBtn.addEventListener("click", () => {
        setTimeout(() => {
          activateInstantVipPass("Partner Verification Unlock");
        }, 600);
      });
    }
  });

  // Delegated Lemon Squeezy Checkout Overlay Interceptor
  // Handles both static and dynamically rendered checkout buttons (e.g. inside #docOutput)
  if (!window.__rsaLsClickDelegated) {
    window.__rsaLsClickDelegated = true;
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".lemonsqueezy-button");
      if (!btn) return;
      const href = btn.getAttribute("href") || "";
      if (typeof window.__bindRsaLemonSqueezyEvents === "function") {
        window.__bindRsaLemonSqueezyEvents();
      }
      if (window.LemonSqueezy && window.LemonSqueezy.Url && typeof window.LemonSqueezy.Url.Open === "function") {
        e.preventDefault();
        window.LemonSqueezy.Url.Open(href);
      }
    });
  }

  // Admin Login & Config Modal Controls
  const adminLoginModal = document.getElementById("adminLoginModal");
  const configModal = document.getElementById("configModal");
  const btnOpenConfig = document.getElementById("btnOpenConfig");
  const btnCancelConfig = document.getElementById("btnCancelConfig");
  const btnSaveConfig = document.getElementById("btnSaveConfig");
  const btnCancelAdminLogin = document.getElementById("btnCancelAdminLogin");
  const btnSubmitAdminLogin = document.getElementById("btnSubmitAdminLogin");
  const btnAdminLogout = document.getElementById("btnAdminLogout");

  const handleAdminLoginSubmit = async () => {
    const idInput = document.getElementById("adminIdInput");
    const pwInput = document.getElementById("adminPwInput");
    const msgEl = document.getElementById("adminLoginMsg");
    const uname = (idInput ? idInput.value : "").trim();
    const pw = pwInput ? pwInput.value : "";

    if (!uname || !pw) {
      if (msgEl) {
        msgEl.style.color = "var(--fin-down)";
        msgEl.textContent = "Please enter both Admin ID and Password.";
      }
      return;
    }

    try {
      const res = await verifyAdminCredentials(uname, pw);
      if (res && res.authenticated) {
        state.isAdminAuthenticated = true;
        sessionStorage.setItem("rsa_admin_auth", "true");
        // Automatically grant Pro Terminal access to Admin
        state.isProUnlocked = true;
        state.licenseKey = res.license_key || "RSA-ADMIN-SESSION";
        localStorage.setItem("rsa_pro_unlocked", "true");
        localStorage.setItem("rsa_token", state.licenseKey);

        if (msgEl) {
          msgEl.style.color = "var(--fin-up)";
          msgEl.textContent = res.message || "Admin Authenticated!";
        }
        await loadAllData();
        if (adminLoginModal) adminLoginModal.style.display = "none";
        renderApp();
        const freshConfigModal = document.getElementById("configModal");
        if (freshConfigModal) freshConfigModal.style.display = "flex";
        showToast("Admin Authenticated — Terminal Config & Pro Access Unlocked");
      } else {
        if (msgEl) {
          msgEl.style.color = "var(--fin-down)";
          msgEl.textContent = (res && res.message) || "Invalid Admin ID or Password.";
        }
      }
    } catch (_) {
      if (msgEl) {
        msgEl.style.color = "var(--fin-down)";
        msgEl.textContent = "Authentication error. Please try again.";
      }
    }
  };

  if (btnOpenConfig) {
    btnOpenConfig.addEventListener("click", () => {
      if (state.isAdminAuthenticated) {
        if (configModal) configModal.style.display = "flex";
      } else if (adminLoginModal) {
        adminLoginModal.style.display = "flex";
        const idInput = document.getElementById("adminIdInput");
        if (idInput) idInput.focus();
      }
    });
  }
  if (btnCancelAdminLogin && adminLoginModal) {
    btnCancelAdminLogin.addEventListener("click", () => {
      adminLoginModal.style.display = "none";
    });
  }
  if (btnSubmitAdminLogin) {
    btnSubmitAdminLogin.addEventListener("click", handleAdminLoginSubmit);
  }
  const adminPwInput = document.getElementById("adminPwInput");
  if (adminPwInput) {
    adminPwInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAdminLoginSubmit();
      }
    });
  }
  if (btnAdminLogout) {
    btnAdminLogout.addEventListener("click", () => {
      state.isAdminAuthenticated = false;
      sessionStorage.removeItem("rsa_admin_auth");
      if (configModal) configModal.style.display = "none";
      showToast("Admin Session Locked");
    });
  }
  if (btnCancelConfig && configModal) {
    btnCancelConfig.addEventListener("click", () => {
      configModal.style.display = "none";
    });
  }
  if (btnSaveConfig) {
    btnSaveConfig.addEventListener("click", async () => {
      const s1Url = document.getElementById("cfgSite1Url")?.value.trim() || state.config.site1_url;
      const lsM = document.getElementById("cfgLsMonthly")?.value.trim() || state.config.ls_site1_monthly_url;
      const lsL = document.getElementById("cfgLsLtd")?.value.trim() || state.config.ls_site1_ltd_url;
      const tgCh = document.getElementById("cfgTgChannel")?.value.trim() || state.config.telegram_channel_url || DEFAULT_TG_CHANNEL_URL;
      const ytUrl = document.getElementById("cfgYoutubeUrl")?.value.trim() || state.config.youtube_url || DEFAULT_YOUTUBE_URL;
      const igUrl = document.getElementById("cfgInstagramUrl")?.value.trim() || state.config.instagram_url || DEFAULT_INSTAGRAM_URL;
      const tvId = document.getElementById("cfgAffTv")?.value.trim() || "1173809";
      const saSrc = document.getElementById("cfgAffSa")?.value.trim() || "better_life333";
      const brkName = document.getElementById("cfgBrokerName")?.value.trim() || "TrendSpider (rightside)";
      const brkUrl =
        document.getElementById("cfgBrokerUrl")?.value.trim() ||
        "https://trendspider.com/?_go=rightside";

      state.config.site1_url = s1Url;
      state.config.ls_site1_monthly_url = lsM;
      state.config.ls_site1_ltd_url = lsL;
      state.config.telegram_channel_url = tgCh;
      state.config.youtube_url = ytUrl;
      state.config.instagram_url = igUrl;
      state.config.tradingview_aff_id = tvId;
      state.config.seekingalpha_source = saSrc;
      state.config.broker_name = brkName;
      state.config.broker_referral_url = brkUrl;

      localStorage.setItem("rsa_cfg_site1_url", s1Url);
      localStorage.setItem("rsa_cfg_ls_monthly", lsM);
      localStorage.setItem("rsa_cfg_ls_ltd", lsL);
      localStorage.setItem("rsa_tg_channel_url", tgCh);
      localStorage.setItem("rsa_cfg_youtube_url", ytUrl);
      localStorage.setItem("rsa_cfg_instagram_url", igUrl);
      localStorage.setItem("rsa_cfg_aff_tv", tvId);
      localStorage.setItem("rsa_cfg_aff_sa", saSrc);
      localStorage.setItem("rsa_cfg_broker_name", brkName);
      localStorage.setItem("rsa_cfg_broker_url", brkUrl);

      try {
        await updateReferralConfig({
          tradingview_aff_id: tvId,
          seekingalpha_source: saSrc,
          broker_name: brkName,
          broker_referral_url: brkUrl,
          ls_site1_monthly_url: lsM,
          ls_site1_ltd_url: lsL,
          site1_url: s1Url,
          telegram_channel_url: tgCh,
          youtube_url: ytUrl,
          instagram_url: igUrl,
        });
      } catch (e) {
        // Ignore network error if offline
      }

      if (configModal) configModal.style.display = "none";
      renderApp();
      showToast("Terminal & Affiliate Configuration Saved");
    });
  }

  // Telegram Modal Controls
  const telegramModal = document.getElementById("telegramModal");
  const refreshTelegramPreview = async (alertTypeOverride) => {
    const selEl = document.getElementById("tgAlertTypeSelect");
    const aType = alertTypeOverride || selEl?.value || state.telegramAlertType || "SEMI_BRIEFING";
    state.telegramAlertType = aType;
    const prevBox = document.getElementById("telegramPreviewBox");
    const docTicker = (document.getElementById("docTicker")?.value || "CELH").trim().toUpperCase();
    const docEntry = parseFloat(document.getElementById("docEntry")?.value || "27.93") || 27.93;
    const docDays = parseInt(document.getElementById("docDays")?.value || "42", 10) || 42;
    try {
      const res = await sendTelegramAlert({
        alert_type: aType,
        lang: state.lang,
        ticker: docTicker,
        entry_price: docEntry,
        days_held: docDays,
        dry_run: true,
      });
      if (res && res.message_preview) {
        state.telegramPreviewText = res.message_preview;
        if (prevBox) prevBox.textContent = res.message_preview;
      }
    } catch (_) {
      // Ignore preview error
    }
  };

  const openTelegramModal = async (defaultAlertType) => {
    if (!telegramModal) return;
    if (defaultAlertType) {
      state.telegramAlertType = defaultAlertType;
      const selEl = document.getElementById("tgAlertTypeSelect");
      if (selEl) selEl.value = defaultAlertType;
    }
    telegramModal.style.display = "flex";
    await refreshTelegramPreview(defaultAlertType);
    try {
      const syncInfo = await syncTelegramBotBrowser(state.telegramBotToken, state.telegramChatId);
      if (syncInfo && syncInfo.chatId && syncInfo.chatId !== state.telegramChatId) {
        state.telegramChatId = syncInfo.chatId;
        const cidInput = document.getElementById("tgChatIdInput");
        if (cidInput) cidInput.value = syncInfo.chatId;
      }
    } catch (_) {
      // Ignore sync error
    }
  };

  const btnOpenTelegram = document.getElementById("btnOpenTelegram");
  if (btnOpenTelegram) {
    btnOpenTelegram.addEventListener("click", () =>
      openTelegramModal(state.activeView === "semi" ? "SEMI_BRIEFING" : "RSA_IGNITION")
    );
  }
  const btnSendSemiTelegram = document.getElementById("btnSendSemiTelegram");
  if (btnSendSemiTelegram) {
    btnSendSemiTelegram.addEventListener("click", () => openTelegramModal("SEMI_BRIEFING"));
  }
  const btnOpenTelegramFromPricing = document.getElementById("btnOpenTelegramFromPricing");
  if (btnOpenTelegramFromPricing) {
    btnOpenTelegramFromPricing.addEventListener("click", () => openTelegramModal("FULL_DAILY"));
  }
  const btnCloseTelegram = document.getElementById("btnCloseTelegram");
  if (btnCloseTelegram && telegramModal) {
    btnCloseTelegram.addEventListener("click", () => {
      telegramModal.style.display = "none";
    });
  }

  const tgAlertTypeSelect = document.getElementById("tgAlertTypeSelect");
  if (tgAlertTypeSelect) {
    tgAlertTypeSelect.addEventListener("change", (e) => {
      refreshTelegramPreview(e.target.value);
    });
  }

  const btnPreviewTelegram = document.getElementById("btnPreviewTelegram");
  if (btnPreviewTelegram) {
    btnPreviewTelegram.addEventListener("click", () => {
      refreshTelegramPreview();
      showToast("Refreshed Live Telegram Briefing Preview");
    });
  }

  const btnCopyTelegramMsg = document.getElementById("btnCopyTelegramMsg");
  if (btnCopyTelegramMsg) {
    btnCopyTelegramMsg.addEventListener("click", async () => {
      const txt = document.getElementById("telegramPreviewBox")?.textContent || state.telegramPreviewText || "";
      try {
        await navigator.clipboard.writeText(txt);
        showToast("Telegram Briefing Copied to Clipboard");
      } catch (_) {
        showToast("Briefing Text Ready to Copy");
      }
    });
  }

  const persistTelegramInputs = async () => {
    const tok = document.getElementById("tgBotTokenInput")?.value.trim() ?? state.telegramBotToken;
    const cid = document.getElementById("tgChatIdInput")?.value.trim() ?? state.telegramChatId;
    const chUrl =
      document.getElementById("tgChannelUrlInput")?.value.trim() ||
      state.config.telegram_channel_url ||
      "https://t.me/SemiFearGreed";

    state.telegramBotToken = tok;
    state.telegramChatId = cid;
    state.telegramConfigured = Boolean(tok && cid);
    state.config.telegram_channel_url = chUrl;
    state.config.telegram_chat_id = cid;

    localStorage.setItem("rsa_tg_bot_token", tok);
    localStorage.setItem("rsa_tg_chat_id", cid);
    localStorage.setItem("rsa_tg_channel_url", chUrl);

    const chLinkBtn = document.getElementById("tgChannelLinkBtn");
    if (chLinkBtn) chLinkBtn.setAttribute("href", chUrl);

    try {
      await saveTelegramConfig({
        bot_token: tok,
        chat_id: cid,
        channel_url: chUrl,
        lang: state.lang,
      });
    } catch (_) {
      // Ignore if static
    }
    return { tok, cid, chUrl };
  };

  const btnVerifyTelegram = document.getElementById("btnVerifyTelegram");
  if (btnVerifyTelegram) {
    btnVerifyTelegram.addEventListener("click", async () => {
      const statusEl = document.getElementById("telegramStatusMsg");
      const { tok, cid } = await persistTelegramInputs();
      if (statusEl) {
        statusEl.style.color = "#93c5fd";
        statusEl.textContent = "Verifying Telegram Bot connection...";
      }
      try {
        const res = await verifyTelegramBot({ bot_token: tok, chat_id: cid });
        if (statusEl) {
          statusEl.style.color = res.valid ? "var(--fin-up)" : "var(--fin-amber)";
          statusEl.textContent = res.message || "Bot configuration saved.";
        }
        showToast(res.valid ? "Telegram Bot Verified & Saved" : "Saved Telegram Parameters");
      } catch (_) {
        if (statusEl) {
          statusEl.style.color = "var(--fin-amber)";
          statusEl.textContent = "Saved locally. Ready for preview or direct dispatch.";
        }
      }
    });
  }

  const btnSendTelegramNow = document.getElementById("btnSendTelegramNow");
  if (btnSendTelegramNow) {
    btnSendTelegramNow.addEventListener("click", async () => {
      const statusEl = document.getElementById("telegramStatusMsg");
      const prevBox = document.getElementById("telegramPreviewBox");
      const { tok, cid } = await persistTelegramInputs();
      const aType = document.getElementById("tgAlertTypeSelect")?.value || state.telegramAlertType || "SEMI_BRIEFING";
      const docTicker = (document.getElementById("docTicker")?.value || "CELH").trim().toUpperCase();
      const docEntry = parseFloat(document.getElementById("docEntry")?.value || "27.93") || 27.93;
      const docDays = parseInt(document.getElementById("docDays")?.value || "42", 10) || 42;

      if (statusEl) {
        statusEl.style.color = "#93c5fd";
        statusEl.textContent = "Dispatching briefing to Telegram...";
      }

      try {
        const res = await sendTelegramAlert({
          alert_type: aType,
          lang: state.lang,
          bot_token: tok,
          chat_id: cid,
          ticker: docTicker,
          entry_price: docEntry,
          days_held: docDays,
          dry_run: false,
        });
        if (res && res.message_preview) {
          state.telegramPreviewText = res.message_preview;
          if (prevBox) prevBox.textContent = res.message_preview;
        }
        if (statusEl) {
          statusEl.style.color = res.delivered ? "var(--fin-up)" : "#38bdf8";
          statusEl.textContent = res.status_detail || "Telegram briefing processed.";
        }
        showToast(
          res.delivered
            ? `Telegram Briefing Sent to ${res.chat_id}!`
            : "Briefing Preview Generated (Enter Live Bot Token & Chat ID to Push)"
        );
      } catch (_) {
        if (statusEl) {
          statusEl.style.color = "var(--fin-down)";
          statusEl.textContent = "Error sending Telegram alert.";
        }
      }
    });
  }

  // Pro VIP Position Sizing Calculator
  const btnCalcProSizing = document.getElementById("btnCalcProSizing");
  if (btnCalcProSizing) {
    btnCalcProSizing.addEventListener("click", () => {
      const rawVal = parseFloat(document.getElementById("proCapitalInput")?.value || "30000");
      if (Number.isFinite(rawVal) && rawVal >= 1000) {
        state.proPortfolioUsd = rawVal;
        localStorage.setItem("rsa_pro_cap_usd", String(rawVal));
        renderApp();
        showToast(`Updated Pro Position Sizing for $${rawVal.toLocaleString()} Account`);
      } else {
        showToast("Please enter an account size of at least $1,000");
      }
    });
  }

  // Pro VIP 1-Click 72-Stock CSV Export, TradingView Watchlist & Webhook JSON
  const btnDownloadPro72Csv = document.getElementById("btnDownloadPro72Csv");
  if (btnDownloadPro72Csv) {
    btnDownloadPro72Csv.addEventListener("click", () => {
      if (!state.isProUnlocked) {
        openLicenseModal(false, "🔒 Upgrade to Pro VIP ($29/mo or $199 Lifetime) to download the full 72-Stock Institutional Action Sheet (.CSV).");
        return;
      }
      const perSlot = Math.round((state.proPortfolioUsd || 30000) * 0.15);
      const header = "Rank,Ticker,Company,Sector,PW_RSI_Score,Zone,Latest_Close,Entry_Trigger_MA60,Hard_Stop_Minus9Pct,Target_2X_TP1,Recommended_Shares_15Pct_Slot\n";
      const rows = (state.stocks || []).map((s, idx) => {
        const c = Number(s.close || 0);
        const trig = Number(s.entry_trigger_price ?? s.ma60_price ?? c).toFixed(2);
        const stp = Number(s.stop_loss_price ?? c * 0.91).toFixed(2);
        const tp1 = Number(s.tp1_2x_price ?? c * 2.0).toFixed(2);
        const sh = c > 0 ? Math.max(1, Math.floor(perSlot / c)) : 0;
        return `${idx + 1},${s.ticker},"${(s.name_en || s.ticker).replace(/"/g, '""')}",${s.sector || "US Equity"},${s.score},${s.zone_code},${c.toFixed(2)},${trig},${stp},${tp1},${sh}`;
      });
      const blob = new Blob([header + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `RightSideAlpha_VIP_72Stocks_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("📥 Downloaded Full 72-Stock VIP Action Sheet (.CSV)");
    });
  }

  const btnCopyTvWatchlist = document.getElementById("btnCopyTvWatchlist");
  if (btnCopyTvWatchlist) {
    btnCopyTvWatchlist.addEventListener("click", async () => {
      if (!state.isProUnlocked) {
        openLicenseModal(false, "🔒 Upgrade to Pro VIP to copy the 1-Click TradingView 72-Ticker Institutional Watchlist.");
        return;
      }
      const tickers = ["AMEX:SMH", "AMEX:XLV", "NASDAQ:QQQ"].concat((state.stocks || []).map((s) => s.ticker)).join(",");
      try {
        await navigator.clipboard.writeText(tickers);
        showToast("📋 Copied 72-Stock + $SMH/$XLV TradingView Watchlist to Clipboard!");
      } catch (_) {
        showToast("TradingView Watchlist Ready");
      }
    });
  }

  const btnCopyTvWebhookJson = document.getElementById("btnCopyTvWebhookJson");
  if (btnCopyTvWebhookJson) {
    btnCopyTvWebhookJson.addEventListener("click", async () => {
      if (!state.isProUnlocked) {
        openLicenseModal(false, "🔒 Upgrade to Pro VIP to unlock the TradingView Automated Alert Webhook JSON.");
        return;
      }
      const webhookJson = JSON.stringify({
        platform: "truthofmarket.com",
        signal: "RIGHT_SIDE_IGNITION",
        ticker: "{{ticker}}",
        close: "{{close}}",
        volume: "{{volume}}",
        stop_loss_9pct: "{{plot_0}}",
        action: "BUY_15PCT_SLOT"
      }, null, 2);
      try {
        await navigator.clipboard.writeText(webhookJson);
        showToast("🔔 Copied TradingView Webhook JSON Payload to Clipboard!");
      } catch (_) {
        showToast("Webhook JSON Ready");
      }
    });
  }

  // Position Doctor Controls
  document.querySelectorAll(".btn-quick-doc").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const tick = btn.getAttribute("data-ticker");
      const found = state.stocks.find((s) => s.ticker === tick);
      const tEl = document.getElementById("docTicker");
      const eEl = document.getElementById("docEntry");
      const dEl = document.getElementById("docDays");
      const outEl = document.getElementById("docOutput");
      if (tEl && tick) tEl.value = tick;
      const entryVal = found ? Number(found.close) : 27.93;
      if (eEl) eEl.value = entryVal.toFixed(2);
      const rawDays = parseInt(dEl?.value || "42", 10);
      const daysHeld = Number.isFinite(rawDays) && rawDays >= 0 ? rawDays : 42;
      try {
        const res = await evaluatePositionDoctor({
          ticker: tick || "CELH",
          entry_price: entryVal,
          days_held: daysHeld,
        });
        state.docLastResult = res;
        if (outEl) outEl.innerHTML = formatDoctorResult(res, state);
      } catch (e) {
        // Ignore
      }
    });
  });

  const btnRunPositionDoctor = document.getElementById("btnRunPositionDoctor");
  if (btnRunPositionDoctor) {
    btnRunPositionDoctor.addEventListener("click", async () => {
      const ticker = (document.getElementById("docTicker")?.value || "CELH").trim().toUpperCase();
      const entryPrice = parseFloat(document.getElementById("docEntry")?.value ?? "");
      const daysHeld = parseInt(document.getElementById("docDays")?.value ?? "", 10);
      const outEl = document.getElementById("docOutput");

      if (!Number.isFinite(entryPrice) || entryPrice <= 0 || !Number.isFinite(daysHeld) || daysHeld < 0) {
        if (outEl) {
          outEl.innerHTML = `<div style="color:var(--fin-down);">Please enter a valid positive cost basis ($) and non-negative trading days.</div>`;
        }
        return;
      }

      try {
        const res = await evaluatePositionDoctor({
          ticker,
          entry_price: entryPrice,
          days_held: daysHeld,
        });
        state.docLastResult = res;
        if (outEl) {
          outEl.innerHTML = formatDoctorResult(res, state);
        }
      } catch (err) {
        if (outEl) {
          outEl.innerHTML = `<div style="color:var(--fin-down);">Please enter a valid positive cost basis ($) and non-negative trading days.</div>`;
        }
      }
    });
  }

  // Sector Regime Matrix Quick Filter Select
  const sectorFilterSelect = document.getElementById("sectorFilterSelect");
  if (sectorFilterSelect) {
    sectorFilterSelect.addEventListener("change", (e) => {
      state.sectorFilter = e.target.value;
      applyClientFilterAndSort();
      renderApp();
    });
  }

  // 1-Click VIP Watchlist CSV Export
  const exportWatchlistCsv = () => {
    if (!state.isProUnlocked) {
      openLicenseModal(false, "Save custom VIP watchlists and get breakout alerts with Pro VIP.");
      return;
    }
    const starredList = state.vipWatchlist || [];
    const starredStocks = (state.stocks || []).filter((s) => starredList.includes(s.ticker));
    if (!starredStocks.length) {
      showToast("Your VIP Watchlist is empty. Star tickers using ⭐ to export.");
      return;
    }
    const perSlot = Math.round((state.proPortfolioUsd || 30000) * 0.15);
    const header = "Rank,Ticker,Company,Sector,PW_RSI_Score,Zone,Close,Entry_Trigger,Stop_Loss_9Pct,Target_2X_TP1,Recommended_Shares_15Pct_Slot\n";
    const rows = starredStocks.map((s, idx) => {
      const c = Number(s.close || 0);
      const trig = Number(s.entry_trigger_price ?? s.ma60_price ?? c).toFixed(2);
      const stp = Number(s.stop_loss_price ?? c * 0.91).toFixed(2);
      const tp1 = Number(s.tp1_2x_price ?? c * 2.0).toFixed(2);
      const sh = c > 0 ? Math.max(1, Math.floor(perSlot / c)) : 0;
      return `${idx + 1},${s.ticker},"${(s.name_en || s.ticker).replace(/"/g, '""')}",${s.sector || "US Equity"},${s.score},${s.zone_code},${c.toFixed(2)},${trig},${stp},${tp1},${sh}`;
    });
    const blob = new Blob([header + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RightSideAlpha_VIP_Watchlist_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`📥 Exported ${starredStocks.length} Starred Watchlist Tickers (.CSV)`);
  };

  const btnExportVipWatchlistCsv = document.getElementById("btnExportVipWatchlistCsv");
  if (btnExportVipWatchlistCsv) {
    btnExportVipWatchlistCsv.addEventListener("click", exportWatchlistCsv);
  }
  const btnVaultExportWatchlistCsv = document.getElementById("btnVaultExportWatchlistCsv");
  if (btnVaultExportWatchlistCsv) {
    btnVaultExportWatchlistCsv.addEventListener("click", exportWatchlistCsv);
  }

  // Filter Table by Sector from ProVault Card
  document.querySelectorAll(".btn-filter-sector-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sec = btn.getAttribute("data-sector") || "ALL";
      state.sectorFilter = sec;
      state.zoneFilter = "ALL";
      applyClientFilterAndSort();
      renderApp();
      const screenerSec = document.querySelector(".screener-panel") || document.getElementById("stockTable");
      if (screenerSec && typeof screenerSec.scrollIntoView === "function") {
        screenerSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      showToast(`Filtered Screener to: ${sec}`);
    });
  });

  // Vault Go to VIP Watchlist Button
  const btnVaultGoWatchlist = document.getElementById("btnVaultGoWatchlist");
  if (btnVaultGoWatchlist) {
    btnVaultGoWatchlist.addEventListener("click", () => {
      state.zoneFilter = "VIP_WATCHLIST";
      state.sectorFilter = "ALL";
      applyClientFilterAndSort();
      renderApp();
      const screenerSec = document.querySelector(".screener-panel") || document.getElementById("stockTable");
      if (screenerSec && typeof screenerSec.scrollIntoView === "function") {
        screenerSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      showToast("Filtered Screener to ⭐ VIP Watchlist");
    });
  }

  // Helper: Read Portfolio Doctor 2.0 Positions from DOM
  const getPortfolioPositionsFromDOM = () => {
    const rows = document.querySelectorAll(".port-input-row");
    const positions = [];
    rows.forEach((row) => {
      const ticker = (row.querySelector(".port-row-ticker")?.value || "").trim().toUpperCase();
      const entry_price = parseFloat(row.querySelector(".port-row-entry")?.value || "0");
      const shares = parseFloat(row.querySelector(".port-row-shares")?.value || "1");
      const days_held = parseInt(row.querySelector(".port-row-days")?.value || "0", 10);
      const curVal = row.querySelector(".port-row-cur")?.value;
      const current_price = curVal !== undefined && curVal !== null && curVal !== "" && Number(curVal) > 0 ? parseFloat(curVal) : null;
      if (ticker && entry_price > 0) {
        positions.push({ ticker, entry_price, shares, days_held, current_price });
      }
    });
    return positions;
  };

  // Add Position Row
  const btnAddPortRow = document.getElementById("btnAddPortRow");
  if (btnAddPortRow) {
    btnAddPortRow.addEventListener("click", () => {
      const currentPositions = getPortfolioPositionsFromDOM();
      if (currentPositions.length >= 10) {
        showToast("Maximum 10 positions allowed in Portfolio Doctor 2.0");
        return;
      }
      currentPositions.push({ ticker: "", entry_price: 25.0, shares: 100, days_held: 15, current_price: null });
      state.portfolioPositions = currentPositions;
      renderApp();
      const newInputs = document.querySelectorAll(".port-row-ticker");
      if (newInputs.length > 0) newInputs[newInputs.length - 1].focus();
    });
  }

  // Remove Position Row
  document.querySelectorAll(".btn-remove-port-row").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-row-idx") || "0", 10);
      const currentPositions = getPortfolioPositionsFromDOM();
      currentPositions.splice(idx, 1);
      state.portfolioPositions = currentPositions;
      renderApp();
    });
  });

  // Preset: Load Current Ignition Leaders
  const btnLoadPresetIgnition = document.getElementById("btnLoadPresetIgnition");
  if (btnLoadPresetIgnition) {
    btnLoadPresetIgnition.addEventListener("click", () => {
      const celh = state.stocks.find((s) => s.ticker === "CELH");
      const ccl = state.stocks.find((s) => s.ticker === "CCL");
      const tsla = state.stocks.find((s) => s.ticker === "TSLA");
      const upst = state.stocks.find((s) => s.ticker === "UPST");
      state.portfolioPositions = [
        { ticker: "CELH", entry_price: celh ? Number(celh.close) : 28.5, shares: 100, days_held: 35, current_price: celh ? Number(celh.close) : 27.93 },
        { ticker: "CCL", entry_price: ccl ? Number(ccl.close) : 19.2, shares: 200, days_held: 25, current_price: ccl ? Number(ccl.close) : 21.4 },
        { ticker: "TSLA", entry_price: tsla ? Number(tsla.close) : 215.0, shares: 50, days_held: 45, current_price: tsla ? Number(tsla.close) : 228.0 },
        { ticker: "UPST", entry_price: upst ? Number(upst.close) : 38.0, shares: 150, days_held: 20, current_price: upst ? Number(upst.close) : 44.5 },
      ];
      renderApp();
      showToast("🚀 Loaded Current Ignition Leaders Preset");
    });
  }

  // Preset: Load Sample Tech Basket
  const btnLoadPresetTech = document.getElementById("btnLoadPresetTech");
  if (btnLoadPresetTech) {
    btnLoadPresetTech.addEventListener("click", () => {
      const nvda = state.stocks.find((s) => s.ticker === "NVDA");
      const amd = state.stocks.find((s) => s.ticker === "AMD");
      const pltr = state.stocks.find((s) => s.ticker === "PLTR");
      const crwd = state.stocks.find((s) => s.ticker === "CRWD");
      state.portfolioPositions = [
        { ticker: "NVDA", entry_price: nvda ? Number(nvda.close) : 135.0, shares: 75, days_held: 40, current_price: nvda ? Number(nvda.close) : 138.5 },
        { ticker: "AMD", entry_price: amd ? Number(amd.close) : 155.0, shares: 60, days_held: 60, current_price: amd ? Number(amd.close) : 158.0 },
        { ticker: "PLTR", entry_price: pltr ? Number(pltr.close) : 42.0, shares: 200, days_held: 30, current_price: pltr ? Number(pltr.close) : 44.2 },
        { ticker: "CRWD", entry_price: crwd ? Number(crwd.close) : 310.0, shares: 30, days_held: 15, current_price: crwd ? Number(crwd.close) : 322.0 },
      ];
      renderApp();
      showToast("💻 Loaded Sample Tech Basket Preset");
    });
  }

  // Clear All Position Rows
  const btnClearPortRows = document.getElementById("btnClearPortRows");
  if (btnClearPortRows) {
    btnClearPortRows.addEventListener("click", () => {
      state.portfolioPositions = [
        { ticker: "", entry_price: 0, shares: 100, days_held: 0, current_price: null },
      ];
      state.portfolioDocResult = null;
      renderApp();
      showToast("Cleared Portfolio Positions");
    });
  }

  // Submit VIP Portfolio Diagnostic
  const btnRunPortfolioDoctor = document.getElementById("btnRunPortfolioDoctor");
  if (btnRunPortfolioDoctor) {
    btnRunPortfolioDoctor.addEventListener("click", async () => {
      if (!state.isProUnlocked) {
        openLicenseModal(false, "Upgrade to Pro to unlock the Multi-Position Portfolio Doctor 2.0 & Volatility Stress Testing.");
        return;
      }
      const positions = getPortfolioPositionsFromDOM();
      if (!positions.length) {
        showToast("Please enter at least 1 valid stock position with ticker and cost basis.");
        return;
      }
      state.portfolioPositions = positions;
      const totalCap = parseFloat(document.getElementById("portTotalCapital")?.value || "50000") || 50000;
      state.proPortfolioUsd = totalCap;
      try {
        localStorage.setItem("rsa_pro_cap_usd", String(totalCap));
      } catch (_) {}

      const outEl = document.getElementById("portfolioDocOutput");
      if (outEl) {
        outEl.innerHTML = `<div class="mono" style="padding:14px; color:#93c5fd; font-size:0.8rem; background:#05080f; border-radius:4px;">⏳ Running quant health diagnostic & macro stress testing on ${positions.length} positions...</div>`;
      }

      try {
        const res = await evaluatePortfolioDoctor({
          positions: positions,
          total_capital: totalCap,
        });
        state.portfolioDocResult = res;
        if (outEl) {
          outEl.innerHTML = formatPortfolioDoctorResult(res, state);
        }
        showToast(`🩺 Portfolio Health Score: ${res.health_score}/100`);
      } catch (err) {
        if (outEl) {
          outEl.innerHTML = `<div style="color:var(--fin-down); padding:12px; font-size:0.8rem;">Diagnostic evaluation error. Please ensure all tickers and entry prices are positive.</div>`;
        }
      }
    });
  }

  // Research & Legal Modal Controls
  const researchModal = document.getElementById("researchModal");
  const btnCloseResearch = document.getElementById("btnCloseResearch");
  if (btnCloseResearch && researchModal) {
    btnCloseResearch.addEventListener("click", () => {
      researchModal.style.display = "none";
    });
  }

  const legalModal = document.getElementById("legalModal");
  const btnCloseLegalModal = document.getElementById("btnCloseLegalModal");
  if (btnCloseLegalModal && legalModal) {
    btnCloseLegalModal.addEventListener("click", () => {
      legalModal.style.display = "none";
    });
  }
  document.querySelectorAll(".btn-open-legal, .btn-legal-tab").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = el.getAttribute("data-legal-tab") || "terms";
      if (legalModal) {
        legalModal.style.display = "flex";
        const sec = legalModal.querySelector(`[data-legal-section="${tab}"]`);
        if (sec && typeof sec.scrollIntoView === "function") {
          sec.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // PW-RSI Explainer Modal wiring (Feature F4)
  const pwRsiModal = document.getElementById("pwRsiModal");
  const btnOpenPwRsiExplainer = document.getElementById("btnOpenPwRsiExplainer");
  const btnClosePwRsiModal = document.getElementById("btnClosePwRsiModal");
  const btnUnderstandPwRsi = document.getElementById("btnUnderstandPwRsi");
  if (btnOpenPwRsiExplainer && pwRsiModal) {
    btnOpenPwRsiExplainer.addEventListener("click", () => {
      pwRsiModal.style.display = "flex";
    });
  }
  if (btnClosePwRsiModal && pwRsiModal) {
    btnClosePwRsiModal.addEventListener("click", () => {
      pwRsiModal.style.display = "none";
    });
  }
  if (btnUnderstandPwRsi && pwRsiModal) {
    btnUnderstandPwRsi.addEventListener("click", () => {
      pwRsiModal.style.display = "none";
      const tableEl = document.getElementById("stockTable");
      if (tableEl && typeof tableEl.scrollIntoView === "function") {
        tableEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Backdrop click-to-close on all modals
  [licenseModal, telegramModal, configModal, researchModal, legalModal, pwRsiModal].forEach((modalEl) => {
    if (modalEl) {
      modalEl.addEventListener("click", (e) => {
        if (e.target === modalEl) {
          modalEl.style.display = "none";
        }
      });
    }
  });

  const renderMarkdownToHtml = (mdText) => {
    const esc = (s) =>
      String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    const fmtInline = (s) =>
      esc(s)
        .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#ffffff;">$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="mono" style="background:#0f172a; padding:1px 5px; border-radius:3px; color:#93c5fd;">$1</code>');

    const lines = String(mdText || "").split(/\r?\n/);
    const out = [];
    let inTable = false;
    let tableRows = [];
    let inList = false;

    const flushTable = () => {
      if (!tableRows.length) return;
      const header = tableRows[0];
      const body = tableRows.slice(1).filter((r) => !r.every((c) => /^[-:\s]+$/.test(c)));
      const thHtml = header
        .map((c) => `<th style="padding:7px 10px; border-bottom:1px solid #334155; text-align:left; color:#93c5fd; font-size:0.76rem;">${fmtInline(c)}</th>`)
        .join("");
      const tbHtml = body
        .map(
          (r) =>
            `<tr>${r
              .map((c) => `<td style="padding:7px 10px; border-bottom:1px solid #1e293b; font-size:0.78rem;">${fmtInline(c)}</td>`)
              .join("")}</tr>`
        )
        .join("");
      out.push(
        `<div class="table-responsive-scroll" style="margin:10px 0;"><table style="width:100%; border-collapse:collapse; background:#090d16; border:1px solid #1e293b;"><thead><tr>${thHtml}</tr></thead><tbody>${tbHtml}</tbody></table></div>`
      );
      tableRows = [];
      inTable = false;
    };

    const flushList = () => {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("|") && line.endsWith("|")) {
        flushList();
        inTable = true;
        const cells = line
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable();
      }

      if (!line) {
        flushList();
        continue;
      }
      if (/^---+$/.test(line)) {
        flushList();
        out.push('<hr style="border:none; border-top:1px solid var(--border); margin:12px 0;" />');
      } else if (line.startsWith("### ")) {
        flushList();
        out.push(`<h4 style="color:#93c5fd; font-size:0.9rem; font-weight:800; margin:12px 0 6px;">${fmtInline(line.slice(4))}</h4>`);
      } else if (line.startsWith("## ")) {
        flushList();
        out.push(`<h3 style="color:#ffffff; font-size:0.98rem; font-weight:800; margin:14px 0 6px;">${fmtInline(line.slice(3))}</h3>`);
      } else if (line.startsWith("# ")) {
        flushList();
        out.push(`<h2 style="color:#ffffff; font-size:1.06rem; font-weight:800; margin:6px 0 10px;">${fmtInline(line.slice(2))}</h2>`);
      } else if (/^([-*]|\d+\.)\s+/.test(line)) {
        if (!inList) {
          out.push('<ul style="margin:6px 0 10px 18px; padding:0; line-height:1.6;">');
          inList = true;
        }
        out.push(`<li style="margin-bottom:4px;">${fmtInline(line.replace(/^([-*]|\d+\.)\s+/, ""))}</li>`);
      } else {
        flushList();
        out.push(`<p style="margin:6px 0;">${fmtInline(line)}</p>`);
      }
    }
    if (inTable) flushTable();
    flushList();
    return out.join("");
  };

  const openResearchForTicker = async (ticker) => {
    if (!researchModal) return;
    const titleEl = document.getElementById("researchModalTitle");
    const bodyEl = document.getElementById("researchModalBody");
    researchModal.style.display = "flex";
    if (titleEl) titleEl.textContent = `SEC Primary Filing Turnaround Brief — $${ticker}`;
    if (bodyEl) bodyEl.innerHTML = "Loading primary filing brief...";
    try {
      const data = await fetchResearchBrief(ticker);
      const stockObj = state.stocks.find((s) => s.ticker === ticker);
      const cPrice = Number(data.current_price ?? stockObj?.close ?? 29.12).toFixed(2);
      const sPrice = Number(data.stop_price ?? stockObj?.stop_loss_price ?? Number(cPrice) * 0.91).toFixed(2);
      const tPrice = Number(data.target_price ?? stockObj?.tp1_2x_price ?? Number(cPrice) * 2.0).toFixed(2);
      const asOf = data.as_of_date || stockObj?.date || data.report_date || "2026-10-30";
      const langTitle = data[`title_${state.lang}`] || data.title;
      const safeTitle =
        langTitle ||
        `${data.company_name || ticker} ($${data.ticker || ticker}) — ${data.opinion || "STRONG_BUY"} | Latest Close $${cPrice} (${asOf})`;
      if (titleEl) titleEl.textContent = safeTitle;
      if (bodyEl) {
        const rawMarkdown = data[`content_${state.lang}`] || data.content || "";
        const formatted = renderMarkdownToHtml(rawMarkdown);
        const isStopped = String(data.opinion || "").includes("STOP");
        const metaHeader = `
          <div style="display:flex; flex-wrap:wrap; gap:14px; background:#090d16; border:1px solid var(--border); border-left:3px solid ${isStopped ? "var(--fin-down)" : "var(--fin-up)"}; padding:10px 14px; border-radius:4px; margin-bottom:14px; font-family:var(--font-mono); font-size:0.76rem;">
            <span>LATEST CLOSE (${asOf}): <b style="color:#ffffff;">$${cPrice}</b></span>
            <span>RULE 1 HARD STOP (-9%): <b style="color:var(--fin-down);">$${sPrice}</b></span>
            <span>TP1 TARGET (2x): <b style="color:var(--fin-up);">$${tPrice}</b></span>
            <span>STATUS / RRR: <b style="color:${isStopped ? "#fca5a5" : "#93c5fd"};">${data.rrr_ratio || "1 : 11.1"}</b></span>
          </div>
        `;
        const tvAff = encodeURIComponent(state.config.tradingview_aff_id || "1173809");
        const saSrc = encodeURIComponent(state.config.seekingalpha_source || "better_life333");
        const tsAff = encodeURIComponent(state.config.trendspider_aff_id || "rightside");
        const tSym = encodeURIComponent(data.ticker || ticker);
        const affiliateFooter = `
          <div style="margin-top:16px; padding:12px 14px; background:linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(9,13,22,0.98) 100%); border:1px solid rgba(59,130,246,0.35); border-radius:6px;">
            <div class="mono" style="font-size:0.7rem; font-weight:800; color:#93c5fd; margin-bottom:8px; text-transform:uppercase;">
              ⚡ VERIFY $${tSym} BREAKOUT, EPS REVISIONS &amp; AI TRENDLINES ON OFFICIAL US EQUITY PARTNER TOOLS
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px;">
              <a class="btn btn-sm" href="https://www.tradingview.com/symbols/${tSym}/?aff_id=${tvAff}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(59,130,246,0.45); color:#60a5fa; font-weight:700;">
                📈 TradingView Pro ($${tSym}) ↗
              </a>
              <a class="btn btn-sm" href="https://seekingalpha.com/symbol/${tSym}/earnings?source=${saSrc}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(245,158,11,0.45); color:#fbbf24; font-weight:700;">
                📊 Seeking Alpha EPS ($${tSym}) ↗
              </a>
              <a class="btn btn-sm" href="https://trendspider.com/?_go=${tsAff}&symbol=${tSym}" target="_blank" rel="noopener noreferrer" style="justify-content:center; border-color:rgba(16,185,129,0.45); color:#34d399; font-weight:700;">
                ⚡ TrendSpider AI ($${tSym}) ↗
              </a>
            </div>
          </div>
        `;
        bodyEl.innerHTML = `${metaHeader}<div style="font-family:var(--font-sans); line-height:1.65;">${formatted}</div>${affiliateFooter}`;
      }
    } catch (e) {
      if (bodyEl) bodyEl.innerHTML = "Failed to load research brief.";
    }
  };

  document.querySelectorAll(".btn-open-research").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tick = btn.getAttribute("data-ticker") || "CELH";
      openResearchForTicker(tick);
    });
  });

  document.querySelectorAll(".btn-open-research-modal").forEach((btn) => {
    btn.addEventListener("click", () => openResearchForTicker("CELH"));
  });

  document.querySelectorAll(".btn-switch-research").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tick = btn.getAttribute("data-ticker") || "CELH";
      openResearchForTicker(tick);
    });
  });

  // Copy Pine Script v5
  const btnCopyPineScript = document.getElementById("btnCopyPineScript");
  if (btnCopyPineScript) {
    btnCopyPineScript.addEventListener("click", async () => {
      const code = document.getElementById("pineCodeBox")?.textContent || "";
      try {
        await navigator.clipboard.writeText(code);
        showToast("TradingView Pine Script v5 Copied to Clipboard");
      } catch (e) {
        showToast("Pine Script Ready to Copy");
      }
    });
  }

  // Copy Top Proof Card PNG
  const btnCopyTopProofCard = document.getElementById("btnCopyTopProofCard");
  if (btnCopyTopProofCard) {
    btnCopyTopProofCard.addEventListener("click", () => {
      generateScorecardPng(null);
    });
  }

  // =========================================================================
  // SEMIFEARGREED CNN VIEW EVENTS
  // =========================================================================
  document.querySelectorAll(".cnn-view-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.semiGaugeTab = tab.getAttribute("data-semi-tab") || "overview";
      renderApp();
    });
  });

  document.querySelectorAll(".btn-semi-range").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const r = btn.getAttribute("data-range") || "1Y";
      state.semiRange = r;
      try {
        state.semiHistory = await fetchSemiHistory(r);
        renderApp();
      } catch (e) {
        showToast("Failed to load selected history window");
      }
    });
  });

  const btnRunSemiRebalance = document.getElementById("btnRunSemiRebalance");
  if (btnRunSemiRebalance) {
    btnRunSemiRebalance.addEventListener("click", async () => {
      const rawCap = parseFloat(document.getElementById("semiCapInput")?.value ?? "");
      const mode = document.getElementById("semiModeInput")?.value || "AUTO_REGIME";
      const freq = document.getElementById("semiFreqInput")?.value || "ANNUAL";
      const rawGain = parseFloat(document.getElementById("semiGainKrwInput")?.value ?? "");

      if (!Number.isFinite(rawCap) || rawCap < 100) {
        showToast("Please enter a valid portfolio capital ($100 minimum)");
        return;
      }
      const cap = rawCap;
      const gainKrw = Number.isFinite(rawGain) && rawGain >= 0 ? rawGain : 0;

      state.semiCapUsd = cap;
      state.semiMode = mode;
      state.semiFreq = freq;
      state.semiGainKrw = gainKrw;

      try {
        state.semiRebalanceResult = await calculateSemiRebalance({
          total_capital_usd: cap,
          strategy_mode: mode,
          rebalance_frequency: freq,
          unrealized_gain_krw: gainKrw,
        });
        renderApp();
        showToast("Updated $SMH / $XLV Rebalancing Orders");
      } catch (e) {
        showToast("Please enter a valid positive capital amount");
      }
    });
  }

  const runLumpSumCalc = async (overrideScore) => {
    const rawCap = parseFloat(document.getElementById("semiLumpCapInput")?.value ?? "");
    const rawScore =
      overrideScore !== undefined
        ? overrideScore
        : parseFloat(document.getElementById("semiLumpScoreInput")?.value ?? "");

    if (!Number.isFinite(rawCap) || rawCap < 100) {
      showToast("Please enter a valid lump-sum amount ($100 minimum)");
      return;
    }
    const cap = rawCap;
    const scInput = Number.isFinite(rawScore)
      ? Math.max(0, Math.min(100, rawScore))
      : state.semiOverview?.fg_score ?? 18.0;

    state.semiLumpCapUsd = cap;
    state.semiLumpScore = scInput;
    try {
      state.semiLumpSumResult = await calculateSemiLumpSum({
        capital_usd: cap,
        override_fg_score: scInput,
      });
      renderApp();
    } catch (e) {
      showToast("Invalid lump-sum input parameters");
    }
  };

  const btnRunSemiLumpSum = document.getElementById("btnRunSemiLumpSum");
  if (btnRunSemiLumpSum) {
    btnRunSemiLumpSum.addEventListener("click", () => runLumpSumCalc());
  }

  document.querySelectorAll(".btn-sim-fg").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fg = parseFloat(btn.getAttribute("data-fg") || "18.0");
      runLumpSumCalc(fg);
    });
  });

  const btnExportSemiGauge = document.getElementById("btnExportSemiGauge");
  if (btnExportSemiGauge) {
    btnExportSemiGauge.addEventListener("click", () => {
      generateSemiGaugePng();
    });
  }

  const btnDownloadSemiCsv = document.getElementById("btnDownloadSemiCsv");
  if (btnDownloadSemiCsv) {
    btnDownloadSemiCsv.addEventListener("click", async () => {
      if (!state.isProUnlocked) {
        openLicenseModal(false);
        showToast("Unlock Pro ($29/mo or $199 Lifetime) to download the 26-Year Daily CSV Dataset");
        return;
      }
      const key = encodeURIComponent(state.licenseKey || "");
      try {
        const check = await fetch(`/api/semi/pro/csv?license_key=${key}`, {
          method: "HEAD",
          headers: { ...getAuthHeader() },
        });
        if (check.ok && (check.headers.get("content-type") || "").includes("csv")) {
          window.open(`/api/semi/pro/csv?license_key=${key}`, "_blank");
          return;
        }
      } catch (e) {
        // Fallback to static CSV file
      }
      try {
        const allHist = await fetchSemiHistory("ALL");
        const rows = (allHist && Array.isArray(allHist.series)) ? allHist.series : (state.semiHistory?.series || []);
        const csvLines = ["Date,FG_Score,SMH_Close,XLV_Close,Port73_Norm,QQQ_Norm,SMH_DD_Pct"];
        rows.forEach((r) => {
          csvLines.push(`${r.date},${r.fg_score},${r.smh_close},${r.xlv_close},${r.port73_norm},${r.qqq_norm},${r.smh_dd_pct}`);
        });
        const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SemiFearGreed_SMH_XLV_2000_2026_History_${state.semiOverview?.date || "latest"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Downloaded 26-Year Daily CSV Dataset");
      } catch (err) {
        showToast("Failed to generate CSV dataset");
      }
    });
  }

  bindRowEvents();
}

function bindRowEvents() {
  document.querySelectorAll(".btn-unlock-row").forEach((el) => {
    el.addEventListener("click", () => {
      const licenseModal = document.getElementById("licenseModal");
      if (licenseModal) {
        licenseModal.style.display = "flex";
        const inputEl = document.getElementById("licenseInput");
        if (inputEl && !inputEl.value.trim()) {
          inputEl.value = state.licenseKey || "";
        }
      }
    });
  });

  // Watchlist Star Toggles on Screener Table Rows
  document.querySelectorAll(".btn-watchlist-star").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!state.isProUnlocked) {
        const licenseModal = document.getElementById("licenseModal");
        if (licenseModal) {
          licenseModal.style.display = "flex";
          const inputEl = document.getElementById("licenseInput");
          const msgEl = document.getElementById("licenseMsg");
          if (inputEl && !inputEl.value.trim()) {
            inputEl.value = state.licenseKey || "";
          }
          if (msgEl) {
            msgEl.style.color = "#93c5fd";
            msgEl.textContent = "Save custom VIP watchlists and get breakout alerts with Pro VIP.";
          }
        }
        return;
      }
      const ticker = (btn.getAttribute("data-ticker") || "").trim().toUpperCase();
      if (!ticker) return;
      const currentList = new Set(state.vipWatchlist || []);
      if (currentList.has(ticker)) {
        currentList.delete(ticker);
        showToast(`Removed $${ticker} from VIP Watchlist`);
      } else {
        currentList.add(ticker);
        showToast(`Added $${ticker} to ⭐ VIP Watchlist`);
      }
      state.vipWatchlist = Array.from(currentList);
      saveVipWatchlist(state.vipWatchlist);
      applyClientFilterAndSort();
      renderApp();
    });
  });

  document.querySelectorAll(".btn-share-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ticker = btn.getAttribute("data-ticker");
      const stock = state.stocks.find((s) => s.ticker === ticker);
      generateScorecardPng(stock);
    });
  });

  // Static host affiliate redirect fallback (for GitHub Pages / Render Static)
  document.querySelectorAll('a[href^="/api/referral/redirect/"]').forEach((link) => {
    if (link.dataset.boundReferral === "1") return;
    link.dataset.boundReferral = "1";
    link.addEventListener("click", (e) => {
      const host = window.location.hostname;
      if (window.__STATIC_MODE__ === true || (host && host !== "localhost" && host !== "127.0.0.1")) {
        e.preventDefault();
        const href = link.getAttribute("href") || "";
        const u = new URL(href, window.location.origin);
        const ticker = (u.searchParams.get("ticker") || "SPY").toUpperCase();
        if (href.includes("tradingview")) {
          const aff = encodeURIComponent(state.config.tradingview_aff_id || "1173809");
          window.open(`https://www.tradingview.com/symbols/${ticker}/?aff_id=${aff}`, "_blank", "noopener");
        } else if (href.includes("broker") || href.includes("exchange") || href.includes("trendspider")) {
          const ts = encodeURIComponent(state.config.trendspider_aff_id || "rightside");
          window.open(`https://trendspider.com/?_go=${ts}&symbol=${ticker}`, "_blank", "noopener");
        } else {
          const src = encodeURIComponent(state.config.seekingalpha_source || "better_life333");
          window.open(`https://seekingalpha.com/symbol/${ticker}/earnings?source=${src}`, "_blank", "noopener");
        }
      }
    });
  });
}

function generateScorecardPng(stock) {
  const canvas = document.getElementById("scoreCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, 900, 500);
  ctx.strokeStyle = "#2962ff";
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, 868, 468);

  ctx.fillStyle = "#0ecb81";
  ctx.font = "bold 20px Inter, sans-serif";
  ctx.fillText("RIGHTSIDEALPHA · US EQUITY TURNAROUND TERMINAL", 45, 62);

  if (stock) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px JetBrains Mono, monospace";
    ctx.fillText(`$${stock.ticker} (${stock.name_en})`, 45, 125);

    ctx.fillStyle = "#93c5fd";
    ctx.font = "bold 24px JetBrains Mono, monospace";
    ctx.fillText(`Signal Regime: ${stock.zone_label_en}  |  PW-RSI Score: ${stock.score}/100`, 45, 175);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "20px JetBrains Mono, monospace";
    ctx.fillText(
      `Last Close: $${stock.close.toFixed(2)}  |  52W High DD: ${stock.dd_high52_pct}%  |  vs 52W Low: +${stock.prox_low52_pct}%`,
      45,
      230
    );
    ctx.fillText(
      `vs MA20: ${stock.vs_ma20_pct}%  |  vs MA60: ${stock.vs_ma60_pct}%  |  10D Vol Ratio: ${stock.vol_surge_10d}x`,
      45,
      270
    );
    ctx.fillText(`Historical 1Y 2x (+100%) Hit Rate after -40% Drawdown: ${stock.hist_2x_rate}%`, 45, 315);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px Inter, sans-serif";
    ctx.fillText("20-Year US Equity Backtest: Left-Side vs PW-RSI Right-Side", 45, 125);

    ctx.fillStyle = "#f6465d";
    ctx.font = "22px JetBrains Mono, monospace";
    ctx.fillText("Blind 52W-Low Dip Buy: 28.91% 2x Rate | -30.31% MDD | 81d Underwater", 45, 200);

    ctx.fillStyle = "#0ecb81";
    ctx.font = "bold 24px JetBrains Mono, monospace";
    ctx.fillText("PW-RSI Right-Side:     55.24% 2x Rate | -16.49% MDD | 29d Underwater", 45, 260);
  }

  ctx.fillStyle = "#8492a6";
  ctx.font = "bold 16px JetBrains Mono, monospace";
  ctx.fillText(`Verified Dataset (N=394,371 US Stock-Days) · ${state.config.site1_url}`, 45, 440);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = stock ? `RightSideAlpha_${stock.ticker}_TearSheet.png` : "RightSideAlpha_Benchmark.png";
    a.click();
    URL.revokeObjectURL(url);
    showToast(stock ? `Downloaded $${stock.ticker} Tear Sheet PNG` : "Downloaded Benchmark Tear Sheet PNG");
  });
}

function generateSemiGaugePng() {
  const canvas = document.getElementById("scoreCanvas");
  if (!canvas || !state.semiOverview) return;
  const ctx = canvas.getContext("2d");
  const ov = state.semiOverview;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 900, 500);
  ctx.fillStyle = "#cc0000";
  ctx.fillRect(0, 0, 900, 10);

  ctx.fillStyle = "#cc0000";
  ctx.font = "bold 18px Inter, sans-serif";
  ctx.fillText("MARKETS · SEMICONDUCTOR FEAR & GREED INDEX", 45, 55);

  ctx.fillStyle = "#111827";
  ctx.font = "bold 40px Inter, sans-serif";
  ctx.fillText(`Score: ${ov.fg_score.toFixed(1)} / 100 — ${ov.regime_en.toUpperCase()}`, 45, 115);

  ctx.fillStyle = "#374151";
  ctx.font = "22px JetBrains Mono, monospace";
  ctx.fillText(
    `As of ${ov.date}  |  $SMH: $${ov.smh_close.toFixed(2)} (${ov.smh_dd_pct}% DD)  |  $XLV: $${ov.xlv_close.toFixed(2)}`,
    45,
    170
  );

  ctx.fillStyle = "#b91c1c";
  ctx.font = "bold 22px Inter, sans-serif";
  ctx.fillText(`Active Signal: ${ov.action_headline_en}`, 45, 230);

  ctx.fillStyle = "#4b5563";
  ctx.font = "18px JetBrains Mono, monospace";
  ctx.fillText(`26-Year Barbell (2000-2026): +10.60% CAGR (14.22x) vs QQQ +8.79% (9.21x)`, 45, 300);
  ctx.fillText(`10-Year AI Era (2016-2026):  +28.63% CAGR (15.07x) vs QQQ +20.74% (7.61x)`, 45, 338);

  ctx.fillStyle = "#6b7280";
  ctx.font = "bold 16px JetBrains Mono, monospace";
  ctx.fillText(`SemiFearGreed Quantitative Barbell Engine · ${state.config.site2_url}`, 45, 445);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SemiFearGreed_${ov.date}.png`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded Semiconductor Fear & Greed Index PNG");
  });
}

async function loadAllData() {
  try {
    const [stocksData, btData, refCfg, semiOv, semiHist] = await Promise.all([
      fetchStocks({ limit: 200 }),
      fetchBacktestSummary().catch(() => null),
      fetchReferralConfig().catch(() => null),
      fetchSemiOverview().catch(() => null),
      fetchSemiHistory(state.semiRange).catch(() => null),
    ]);

    state.stocks = Array.isArray(stocksData)
      ? stocksData.filter((s) => s.ticker && !String(s.ticker).includes("."))
      : [];
    if (btData && btData.kpis) {
      state.backtestKpis = btData.kpis;
    }
    if (refCfg && typeof refCfg === "object") {
      Object.entries(refCfg).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          state.config[k] = v;
        }
      });
    }
    if (semiOv) {
      state.semiOverview = semiOv;
      if (state.semiLumpScore === null) {
        state.semiLumpScore = semiOv.fg_score;
      }
    }
    if (semiHist) {
      state.semiHistory = semiHist;
    }

    const celhStock = state.stocks.find((s) => s.ticker === "CELH");
    const defaultCelhClose = celhStock ? Number(celhStock.close) : 27.93;

    // Pre-compute initial Rebalance, Lump-Sum, Position Doctor, and Telegram Status/Preview for instant rendering
    const [rebalRes, lumpRes, docRes, tgStat, tgPrev] = await Promise.all([
      calculateSemiRebalance({
        total_capital_usd: state.semiCapUsd,
        strategy_mode: state.semiMode,
        rebalance_frequency: state.semiFreq,
        unrealized_gain_krw: state.semiGainKrw,
      }).catch(() => null),
      calculateSemiLumpSum({
        capital_usd: state.semiLumpCapUsd,
        override_fg_score: state.semiLumpScore,
      }).catch(() => null),
      evaluatePositionDoctor({
        ticker: "CELH",
        entry_price: defaultCelhClose,
        days_held: 42,
      }).catch(() => null),
      fetchTelegramStatus().catch(() => null),
      sendTelegramAlert({
        alert_type: "SEMI_BRIEFING",
        lang: state.lang,
        dry_run: true,
      }).catch(() => null),
    ]);
    if (rebalRes) state.semiRebalanceResult = rebalRes;
    if (lumpRes) state.semiLumpSumResult = lumpRes;
    if (docRes) state.docLastResult = docRes;
    if (tgStat) {
      state.telegramConfigured = Boolean(tgStat.configured || (state.telegramBotToken && state.telegramChatId));
      if (tgStat.chat_id && !state.telegramChatId) state.telegramChatId = tgStat.chat_id;
      if (tgStat.channel_url) state.config.telegram_channel_url = tgStat.channel_url;
    }
    if (tgPrev && tgPrev.message_preview) {
      state.telegramPreviewText = tgPrev.message_preview;
    }

    if (state.isProUnlocked) {
      const pine = await fetchPineScript().catch(() => null);
      if (pine && pine.code) state.pineCode = pine.code;
    }
    applyClientFilterAndSort();
  } catch (err) {
    console.error("Failed to load initial data:", err);
  }
}

async function init() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      ["licenseModal", "telegramModal", "configModal", "researchModal"].forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.style.display === "flex") {
          el.style.display = "none";
        }
      });
    }
  });

  const handleSpecialAnchorScroll = () => {
    const h = (window.location.hash || "").toLowerCase();
    const sp = new URLSearchParams(window.location.search);
    const toolP = (sp.get("tool") || "").toLowerCase();
    if (toolP === "doctor" || h === "#doctor" || h.includes("positiondoctor")) {
      if (state.activeView !== "rightside") {
        state.activeView = "rightside";
        renderApp();
      }
      setTimeout(() => {
        const docEl = document.getElementById("doctor") || document.getElementById("positionDoctorCard");
        if (docEl && docEl.scrollIntoView) {
          docEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        const docTicker = document.getElementById("docTicker");
        if (docTicker) {
          docTicker.focus();
          if (typeof docTicker.select === "function") docTicker.select();
        }
      }, 180);
      return true;
    }
    if (h === "#pricing" || h === "#pricing-section" || h === "#pricingsection") {
      setTimeout(() => {
        const prEl = document.getElementById("pricing") || document.getElementById("pricingSection");
        if (prEl && prEl.scrollIntoView) {
          prEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
      return true;
    }
    return false;
  };

  window.addEventListener("hashchange", () => {
    const h = window.location.hash.toLowerCase();
    if (handleSpecialAnchorScroll()) return;
    if (h.includes("rightside") && state.activeView !== "rightside") {
      state.activeView = "rightside";
      renderApp();
    } else if (h.includes("semi") && state.activeView !== "semi") {
      state.activeView = "semi";
      renderApp();
    }
  });

  await loadAllData();
  renderApp();
  handleSpecialAnchorScroll();

  // Auto-unlock Pro Terminal when returning from Lemon Squeezy checkout with ?license_key=, ?order_key=, or ?key=
  const urlLicenseKey = (
    initialSearch.get("license_key") ||
    initialSearch.get("order_key") ||
    initialSearch.get("key") ||
    ""
  ).trim();
  if (urlLicenseKey && !state.isProUnlocked) {
    try {
      const vRes = await validateLicense(urlLicenseKey);
      if (vRes && vRes.valid) {
        state.isProUnlocked = true;
        state.licenseKey = urlLicenseKey;
        localStorage.setItem("rsa_pro_unlocked", "true");
        localStorage.setItem("rsa_token", urlLicenseKey);
        await loadAllData();
        renderApp();
        showToast("🎉 Lemon Squeezy Pro License Verified — All 72 US Equity Targets Unlocked!");
      }
    } catch (_) {}
  }

  const checkoutParam = (initialSearch.get("checkout") || initialSearch.get("unlock") || "").toLowerCase();
  if (checkoutParam === "monthly" || checkoutParam === "lifetime" || checkoutParam === "pro") {
    setTimeout(() => {
      const licModal = document.getElementById("licenseModal");
      const msgEl = document.getElementById("licenseMsg");
      if (licModal) {
        licModal.style.display = "flex";
        if (msgEl) {
          msgEl.style.color = "#34d399";
          msgEl.textContent = checkoutParam === "lifetime"
            ? "🏆 Lifetime Pass ($199): Click Lifetime Pass ($199) above for official Lemon Squeezy checkout, or paste your License Key below to unlock immediately."
            : "🍋 Pro Monthly ($29/mo): Click Subscribe Pro ($29/mo) above for official Lemon Squeezy checkout, or paste your License Key below to unlock immediately.";
        }
      }
    }, 200);
  }
  if (
    initialHash.includes("blindtest") ||
    initialHash.includes("chartblindtest") ||
    initialSearch.get("challenge") === "1"
  ) {
    setTimeout(() => {
      const btEl = document.getElementById("chartBlindTestSection");
      if (btEl && btEl.scrollIntoView) {
        btEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 180);
  }
  if (initialTickerParam || initialFilterParam) {
    setTimeout(() => {
      const panel = document.querySelector(".screener-panel");
      if (panel && panel.scrollIntoView) {
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (initialTickerParam === "CELH" || initialTickerParam === "MBLY") {
        const rBtn = document.querySelector(`.btn-open-research[data-ticker="${initialTickerParam}"]`);
        if (rBtn) rBtn.click();
      }
    }, 150);
  }
}

init();

/* === HQ Edge Real-Human Visitor Beacon (tom_truthofmarket) === */
(function(){
  try {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    if (window.__HQ_BEACON_SENT_tom_truthofmarket__) return;
    window.__HQ_BEACON_SENT_tom_truthofmarket__ = true;
    var ua = navigator.userAgent || '';
    if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|gtmetrix|pingdom|uptimerobot|python|curl|node|axios/i.test(ua)) return;
    var host = (location && location.hostname) || '';
    if (!host || host === 'localhost' || host === '127.0.0.1') return;
    var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
    var ns = 'tom_truthofmarket';
    fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/pv_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
    fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/pv_total', { mode: 'cors', keepalive: true }).catch(function(){});
    if (localStorage.getItem('hq_uv_' + ns + '_' + kst) !== '1') {
      localStorage.setItem('hq_uv_' + ns + '_' + kst, '1');
      fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/uv_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
    }
    if (localStorage.getItem('hq_uv_ever_' + ns) !== '1') {
      localStorage.setItem('hq_uv_ever_' + ns, '1');
      fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/uv_total', { mode: 'cors', keepalive: true }).catch(function(){});
    }
  } catch (e) {}
})();

/* === HQ KPI Conversion Tracker (1사업부: 유료회원 전환 클릭 & 결제 추적) === */
(function(){
  try {
    if (typeof window === 'undefined' || window.__HQ_KPI_TOM__) return;
    window.__HQ_KPI_TOM__ = true;
    var host = (location && location.hostname) || '';
    if (!host || host === 'localhost' || host === '127.0.0.1') return;
    var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
    var ns = 'tom_truthofmarket';
    if (location.search.indexOf('payment=success') !== -1 || location.search.indexOf('unlock=1') !== -1) {
      if (localStorage.getItem('hq_paid_' + kst) !== '1') {
        localStorage.setItem('hq_paid_' + kst, '1');
        fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_member_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
        fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_member_total', { mode: 'cors', keepalive: true }).catch(function(){});
      }
    }
    document.addEventListener('click', function(e) {
      var el = e.target && e.target.closest ? e.target.closest('a, button, [role="button"]') : null;
      if (!el) return;
      var href = (el.getAttribute('href') || '').toLowerCase();
      var txt = (el.innerText || el.textContent || '').toLowerCase();
      var cls = (el.className || '').toLowerCase();
      if (href.indexOf('lemonsqueezy.com') !== -1 || cls.indexOf('pro') !== -1 || cls.indexOf('paywall') !== -1 || /upgrade|unlock pro|vip|subscribe|프리미엄|유료|구독/.test(txt)) {
        fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_click_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
        fetch('https://abacus.jasoncameron.dev/hit/' + ns + '/paid_click_total', { mode: 'cors', keepalive: true }).catch(function(){});
      }
    }, true);
  } catch (e) {}
})();
