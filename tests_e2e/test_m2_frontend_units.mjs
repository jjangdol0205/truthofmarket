import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Setup Mock DOM / Storage
globalThis.__STATIC_MODE__ = true;
const storage = {};
globalThis.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};
globalThis.sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};
globalThis.fetch = async (url) => {
  if (url.includes('stocks_free.json')) {
    const raw = fs.readFileSync(path.join(ROOT, 'static_api', 'stocks_free.json'), 'utf-8');
    return { json: async () => JSON.parse(raw) };
  }
  if (url.includes('semi_overview.json')) {
    const raw = fs.readFileSync(path.join(ROOT, 'static_api', 'semi_overview.json'), 'utf-8');
    return { json: async () => JSON.parse(raw) };
  }
  throw new Error('Unmocked fetch: ' + url);
};

const apiModule = await import('../frontend/src/services/api.js');
const { getVipWatchlist, saveVipWatchlist, fetchSectorMatrix, evaluatePortfolioDoctor, SECTOR_REGIME_MAP } = apiModule;

const posDocModule = await import('../frontend/src/components/PositionDoctor.js');
const { renderPositionDoctorForm, formatDoctorResult, renderPortfolioDoctorForm, formatPortfolioDoctorResult } = posDocModule;

const stockTableModule = await import('../frontend/src/components/StockTable.js');
const { renderScreenerControls, renderStockTable, renderStockRows } = stockTableModule;

const proVaultModule = await import('../frontend/src/components/ProVault.js');
const { renderProVault } = proVaultModule;

const i18nModule = await import('../frontend/src/locales/i18n.js');
const { translations } = i18nModule;

// Test 1: Watchlist functions
const wl1 = getVipWatchlist();
console.log('Test 1 getVipWatchlist default:', wl1);
if (!Array.isArray(wl1) || wl1.length === 0) throw new Error('Failed wl1');
await saveVipWatchlist(['CELH', 'TSLA', 'celh', 'AAPL']);
const wl2 = getVipWatchlist();
console.log('Test 1 saveVipWatchlist deduplicated:', wl2);
if (wl2.length !== 3 || !wl2.includes('AAPL') || !wl2.includes('CELH') || !wl2.includes('TSLA')) {
  throw new Error('Failed wl2: ' + JSON.stringify(wl2));
}

// Test 2: Sector Matrix (Free mode has masked stocks, Pro mode has exact 8 sectors)
const secMatrixFree = await fetchSectorMatrix();
console.log('Test 2 Sector Matrix (Free) sectors count:', secMatrixFree.sectors.length);
if (secMatrixFree.sectors.length < 8) throw new Error('Expected at least 8 sectors, got ' + secMatrixFree.sectors.length);

globalThis.localStorage.setItem('rsa_pro_unlocked', 'true');
globalThis.localStorage.setItem('rsa_token', 'RSA-PRO-2026-KEY');
const secMatrixPro = await fetchSectorMatrix();
console.log('Test 2 Sector Matrix (Pro) sectors count:', secMatrixPro.sectors.length);
if (secMatrixPro.sectors.length !== 8) throw new Error('Expected exactly 8 sectors in Pro mode, got ' + secMatrixPro.sectors.length);
for (const s of secMatrixPro.sectors) {
  if (!s.name || s.count <= 0 || isNaN(s.avg_score)) {
    throw new Error('Invalid sector item: ' + JSON.stringify(s));
  }
}
console.log('Top Pro sector:', secMatrixPro.sectors[0].name, 'avg_score:', secMatrixPro.sectors[0].avg_score, 'ignitions:', secMatrixPro.sectors[0].ignition_count);

// Test 3: evaluatePortfolioDoctor
const diagResult = await evaluatePortfolioDoctor({
  positions: [
    { ticker: 'CELH', entry_price: 35.0, shares: 100, days_held: 45, current_price: 28.5 }, // -18.57% -> HARD_STOP
    { ticker: 'CCL', entry_price: 20.0, shares: 150, days_held: 60, current_price: 21.0 },  // +5% & 60d -> TIME_STOP
    { ticker: 'TSLA', entry_price: 100.0, shares: 50, days_held: 40, current_price: 215.0 }, // +115% -> TP1_HARVEST
    { ticker: 'UPST', entry_price: 38.0, shares: 100, days_held: 20, current_price: 44.0 }   // +15.79% -> HOLD
  ],
  total_capital: 50000
});
console.log('Test 3 Portfolio Doctor Result: health_score =', diagResult.health_score);
if (diagResult.health_score !== 55) throw new Error('Expected health score 55, got ' + diagResult.health_score);
if (diagResult.items.length !== 4) throw new Error('Expected 4 items');
if (diagResult.stress_scenarios.length !== 3) throw new Error('Expected 3 stress scenarios');
if (diagResult.rebalance_recommendations.length < 2) throw new Error('Expected rebalance recommendations');

// Check rule assignments
const itemMap = Object.fromEntries(diagResult.items.map(it => [it.ticker, it]));
if (itemMap.CELH.status_code !== 'HARD_STOP') throw new Error('CELH should be HARD_STOP');
if (itemMap.CCL.status_code !== 'TIME_STOP') throw new Error('CCL should be TIME_STOP');
if (itemMap.TSLA.status_code !== 'TP1_HARVEST') throw new Error('TSLA should be TP1_HARVEST');
if (itemMap.UPST.status_code !== 'HOLD') throw new Error('UPST should be HOLD');

// Test 4: Render UI components across all 3 locales and check zero undefined or NaN
const rawStocks = JSON.parse(fs.readFileSync(path.join(ROOT, 'static_api', 'stocks_free.json'), 'utf-8'));
for (const lang of ['en', 'jp', 'kr']) {
  for (const isPro of [false, true]) {
    const state = {
      lang,
      isProUnlocked: isPro,
      stocks: rawStocks,
      filteredStocks: rawStocks,
      vipWatchlist: ['CELH', 'TSLA'],
      portfolioPositions: [
        { ticker: 'CELH', entry_price: 28.5, shares: 100, days_held: 35, current_price: 27.93 },
        { ticker: 'CCL', entry_price: 19.2, shares: 200, days_held: 25, current_price: 21.4 }
      ],
      portfolioDocResult: diagResult,
      sectorFilter: 'ALL',
      zoneFilter: 'ALL',
      get t() { return translations[this.lang] || translations.en; }
    };

    const portFormHtml = renderPortfolioDoctorForm(state);
    const portResHtml = formatPortfolioDoctorResult(diagResult, state);
    const screenerHtml = renderScreenerControls(state);
    const rowsHtml = renderStockRows(state);
    const vaultHtml = renderProVault(state);

    for (const [name, html] of Object.entries({ portFormHtml, portResHtml, screenerHtml, rowsHtml, vaultHtml })) {
      if (html.includes('undefined')) throw new Error(`${name} contains undefined for lang=${lang}, isPro=${isPro}`);
      if (html.includes('NaN')) throw new Error(`${name} contains NaN for lang=${lang}, isPro=${isPro}`);
    }

    // Verify Star toggles exist on rows
    if (!rowsHtml.includes('btn-watchlist-star')) throw new Error('Missing btn-watchlist-star in rowsHtml');
    // Verify ⭐ VIP Watchlist filter tab exists
    if (!screenerHtml.includes('VIP Watchlist')) throw new Error('Missing VIP Watchlist in screenerHtml');
    // Verify Watchlist export button exists
    if (!screenerHtml.includes('btnExportVipWatchlistCsv')) throw new Error('Missing btnExportVipWatchlistCsv in screenerHtml');
    // Verify Sector Matrix exists in ProVault
    if (!vaultHtml.includes('SECTOR REGIME MATRIX')) throw new Error('Missing SECTOR REGIME MATRIX in vaultHtml');
    // Verify Portfolio Doctor 2.0 exists in ProVault
    if (!vaultHtml.includes('PORTFOLIO DOCTOR 2.0')) throw new Error('Missing PORTFOLIO DOCTOR 2.0 in vaultHtml');
  }
}

console.log('>>> ALL FRONTEND UNIT & INTEGRATION TESTS PASSED 100% WITH ZERO UNDEFINED/NAN <<<');
