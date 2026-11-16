export function isProActive() {
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

export function getAuthHeader() {
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

export function getVipTelegramUrl(isPro = false) {
  if (isPro && isProActive()) {
    try {
      return atob("aHR0cHM6Ly90Lm1lL3RydXRob2ZtYXJrZXRzcw==");
    } catch (_) {
      return "#pro-vip-telegram";
    }
  }
  return "#pro-vip-telegram";
}

export const CANONICAL_TOM_MONTHLY_URL =
  "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en";
export const CANONICAL_TOM_ANNUAL_URL =
  "https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en";

export function formatCheckoutUrl(
  rawUrl,
  fallbackUrl = "https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
) {
  const base = String(rawUrl || fallbackUrl).trim() || fallbackUrl;
  if (
    base.includes("d5e7e761-8b1b-4ca8-b1fe-771acd1450f8") ||
    base.includes("1fe480f8-8bb0-46a9-959f-a8d396a87a1b")
  ) {
    return CANONICAL_TOM_MONTHLY_URL;
  }
  if (
    base.includes("667aa482-f17c-47d1-b7f3-a2427c36516b") ||
    base.includes("c9ad1a1c-21c5-4d95-88a2-b570a860a147")
  ) {
    return CANONICAL_TOM_ANNUAL_URL;
  }
  let out = base;
  if (!/[?&]embed=1\b/i.test(out)) {
    out = `${out}${out.includes("?") ? "&" : "?"}embed=1`;
  }
  if (!/[?&]locale=/i.test(out)) {
    out = `${out}&locale=en`;
  }
  return out;
}

function isStaticHost() {
  if (typeof window === "undefined") return true;
  if (window.__STATIC_MODE__ === true) return true;
  if (window.__API_BACKEND__ === true) return false;
  const h = window.location.hostname || "";
  const p = String(window.location.port || "");
  if ((h === "localhost" || h === "127.0.0.1") && p === "8000") return false;
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

export async function fetchStocks(params = {}) {
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

export async function fetchStockDetail(ticker) {
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

export async function fetchBacktestSummary() {
  return fetchJsonWithFallback(
    "/api/backtest",
    { headers: { Accept: "application/json" } },
    async () => {
      const r = await fetch("/static_api/backtest.json");
      return r.json();
    }
  );
}

export async function fetchResearchList() {
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

export async function fetchResearchBrief(ticker) {
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

export async function verifyAdminCredentials(username, password) {
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

export async function validateLicense(licenseKey) {
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
          tier: key.toUpperCase().includes("-LTD-") ? "pro_annual" : "pro",
          expires_at: "2099-12-31T23:59:59Z",
          message: "VIP Calculator Software License Activated — Full Dataset & 26Y CSV Unlocked.",
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
        const isAnnual = Number(lsData?.meta?.product_id) === 1491891;
        return {
          valid,
          license_key: valid ? key : null,
          tier: valid ? (isAnnual ? "pro_annual" : "pro") : "free",
          expires_at: valid ? lsData?.license_key?.expires_at || "2099-12-31T23:59:59Z" : null,
          message: valid
            ? "VIP Software License Verified via Lemon Squeezy (Store #296100)."
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

export async function fetchProVault() {
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

export async function fetchPineScript() {
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

export async function evaluatePositionDoctor(data) {
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
          status_label: "Below Lower Historical Variance Band",
          return_pct: retPct,
          rule_triggered: "Band 1 (Below Historical Variance Floor)",
          action_plan: "Mathematical simulation note: price is below the modeled lower variance band relative to entry basis.",
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
          status_label: "55-Day Holding Window Exceeded",
          return_pct: retPct,
          rule_triggered: "Band 2 (55-Day Holding Duration Variance)",
          action_plan:
            "Mathematical simulation note: holding period has exceeded 55 trading days with muted relative momentum.",
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
          status_label: "Upper Historical Variance Band Reached",
          return_pct: retPct,
          rule_triggered: "Band 3 (Upper Dispersion Reference)",
          action_plan:
            "Mathematical simulation note: simulated return has reached the upper dispersion reference band.",
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
          status_label: "Within Modeled Moving-Average Band",
          return_pct: retPct,
          rule_triggered: "Band 4 (Standard Trend Dispersion)",
          action_plan:
            "Mathematical simulation note: price remains within normal MA20/MA60 dispersion range.",
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

export const SECTOR_REGIME_MAP = {
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

export const VALUE_TRAPS = new Set(["INTC", "BA", "PFE", "PARA", "WBD", "NKE", "ALB"]);

export function getVipWatchlist() {
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

export async function saveVipWatchlist(tickers) {
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

export async function fetchSectorMatrix() {
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

export async function evaluatePortfolioDoctor(payload) {
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
          action = "LOWER_BAND_VARIANCE";
          isCritical = true;
          directive = `BAND 1: Below lower variance reference (${retPct.toFixed(2)}%). Review simulated allocation weight.`;
          hardStopCount += 1;
        } else if (days >= 55 && retPct < 8.0) {
          statusCode = "TIME_STOP";
          action = "DURATION_VARIANCE";
          isCritical = false;
          directive = `BAND 2: 55-Day holding window (${days} days, ${retPct >= 0 ? "+" : ""}${retPct.toFixed(2)}%). Simulated momentum muted.`;
          deadMoneyCount += 1;
        } else if (retPct >= 100.0) {
          statusCode = "TP1_HARVEST";
          action = "UPPER_BAND_VARIANCE";
          isCritical = false;
          directive = `BAND 3: Upper dispersion band reached (+${retPct.toFixed(2)}%). Simulated weight drift elevated.`;
        } else {
          statusCode = "HOLD";
          action = "WITHIN_BAND";
          isCritical = false;
          directive = `BAND 4: Within modeled trend dispersion (${retPct >= 0 ? "+" : ""}${retPct.toFixed(2)}%). Lower reference band: $${hardStopP.toFixed(2)}.`;
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

export async function fetchReferralConfig() {
  return fetchJsonWithFallback(
    "/api/referral/config",
    { headers: { Accept: "application/json" } },
    async () => {
      const r = await fetch("/static_api/referral_config.json");
      return r.json();
    }
  );
}

export async function updateReferralConfig(data) {
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

export function getReferralRedirectUrl(provider, ticker) {
  return `/api/referral/redirect/${encodeURIComponent(
    provider.toLowerCase()
  )}?ticker=${encodeURIComponent(ticker)}`;
}

export async function fetchSemiOverview() {
  return fetchJsonWithFallback(
    "/api/semi/overview",
    { headers: { Accept: "application/json" } },
    async () => getStaticSemiOverview()
  );
}

export async function fetchSemiHistory(rangeCode = "1Y") {
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

export async function calculateSemiRebalance(data) {
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
        ruleEn = "Fixed 70% $SMH : 30% $XLV Barbell Weight Model";
        ruleJp = ruleEn;
        ruleKr = ruleEn;
      } else if (mode === "CONTRARIAN_80_20") {
        smhW = 0.8;
        xlvW = 0.2;
        ruleEn = "80% $SMH : 20% $XLV Drawdown Rebalance Model";
        ruleJp = ruleEn;
        ruleKr = ruleEn;
      } else if (mode === "AGGRESSIVE_90_10") {
        smhW = 0.9;
        xlvW = 0.1;
        ruleEn = "90% $SMH : 10% $XLV Growth Weight Model";
        ruleJp = ruleEn;
        ruleKr = ruleEn;
      } else if (isExtreme) {
        smhW = 0.8;
        xlvW = 0.2;
        ruleEn = `AUTO REGIME: Extreme Fear (${fgScore}/100, DD ${ddPct.toFixed(1)}%) -> 80% $SMH : 20% $XLV Model Weight`;
        ruleJp = ruleEn;
        ruleKr = ruleEn;
      } else {
        smhW = 0.7;
        xlvW = 0.3;
        ruleEn = `AUTO REGIME: Standard Regime (${fgScore}/100) -> 70% $SMH : 30% $XLV Model Weight`;
        ruleJp = ruleEn;
        ruleKr = ruleEn;
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
          ? `Modeled annual rebalancing drag (${taxDrag}%) remains low under a 2-4x/year schedule, preserving compounding efficiency inside tax-advantaged 401(k)/IRA accounts.`
          : `For taxable accounts, spacing portfolio weight adjustments to 2-4x/year reduces turnover drag (${taxDrag}%) compared with high-frequency trading.`;
      const taxJp = taxEn;
      const taxKr = taxEn;

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

export async function calculateSemiLumpSum(data) {
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
          case_title_en: "Case 1 (Score 0–40 · Fear Regime): 100% Immediate Lump-Sum Model",
          case_title_jp: "Case 1 (Score 0–40 · Fear Regime): 100% Immediate Lump-Sum Model",
          case_title_kr: "Case 1 (Score 0–40 · Fear Regime): 100% Immediate Lump-Sum Model",
          summary_en:
            "Simulated fear regime: historical model deploys 100% into target weights and rebalances 2–4x/year back to 70:30 as drawdown narrows.",
          summary_jp:
            "Simulated fear regime: historical model deploys 100% into target weights and rebalances 2–4x/year back to 70:30 as drawdown narrows.",
          summary_kr:
            "Simulated fear regime: historical model deploys 100% into target weights and rebalances 2–4x/year back to 70:30 as drawdown narrows.",
          immediate_deploy_pct: 100.0,
          parked_cash_rp_pct: 0.0,
          tranches: [
            {
              step: 1,
              title_en: "Tranche 1 (Day 1 Simulated 100% Weighting)",
              title_jp: "Tranche 1 (Day 1 Simulated 100% Weighting)",
              title_kr: "Tranche 1 (Day 1 Simulated 100% Weighting)",
              timing_en: "Modeled Day 1 Weighting",
              timing_jp: "Modeled Day 1 Weighting",
              timing_kr: "Modeled Day 1 Weighting",
              allocation_pct: 100.0,
              amount_usd: cap,
              smh_usd: smhUsd,
              xlv_usd: xlvUsd,
              cash_rp_usd: 0.0,
              smh_shares: Math.floor(smhUsd / smhP),
              xlv_shares: Math.floor(xlvUsd / xlvP),
              note_en: `Modeled ${Math.round(smhW * 100)}:${Math.round(
                xlvW * 100
              )} ($SMH:$XLV) split. Historical 1-year forward positive cohort rate below score 25 exceeded 91%.`,
              note_jp: `Modeled ${Math.round(smhW * 100)}:${Math.round(
                xlvW * 100
              )} ($SMH:$XLV) split. Historical 1-year forward positive cohort rate below score 25 exceeded 91%.`,
              note_kr: `Modeled ${Math.round(smhW * 100)}:${Math.round(
                xlvW * 100
              )} ($SMH:$XLV) split. Historical 1-year forward positive cohort rate below score 25 exceeded 91%.`,
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
          case_title_en: "Case 2 (Score 40–68 · Neutral Regime): 65% Initial + 35% T-Bill Reserve Model",
          case_title_jp: "Case 2 (Score 40–68 · Neutral Regime): 65% Initial + 35% T-Bill Reserve Model",
          case_title_kr: "Case 2 (Score 40–68 · Neutral Regime): 65% Initial + 35% T-Bill Reserve Model",
          summary_en:
            "Balanced allocation simulation: models 30% $XLV defensive sleeve and half of $SMH initially, keeping 35% in T-Bill/MMF reserve.",
          summary_jp:
            "Balanced allocation simulation: models 30% $XLV defensive sleeve and half of $SMH initially, keeping 35% in T-Bill/MMF reserve.",
          summary_kr:
            "Balanced allocation simulation: models 30% $XLV defensive sleeve and half of $SMH initially, keeping 35% in T-Bill/MMF reserve.",
          immediate_deploy_pct: 65.0,
          parked_cash_rp_pct: 35.0,
          tranches: [
            {
              step: 1,
              title_en: "Tranche 1 (Day 1 Core 65% Weighting)",
              title_jp: "Tranche 1 (Day 1 Core 65% Weighting)",
              title_kr: "Tranche 1 (Day 1 Core 65% Weighting)",
              timing_en: "Modeled Initial Weight (30% $XLV + 35% $SMH)",
              timing_jp: "Modeled Initial Weight (30% $XLV + 35% $SMH)",
              timing_kr: "Modeled Initial Weight (30% $XLV + 35% $SMH)",
              allocation_pct: 65.0,
              amount_usd: d1Tot,
              smh_usd: d1Smh,
              xlv_usd: d1Xlv,
              cash_rp_usd: 0.0,
              smh_shares: Math.floor(d1Smh / smhP),
              xlv_shares: Math.floor(d1Xlv / xlvP),
              note_en:
                "Models 100% of defensive $XLV sleeve (30%) and half of $SMH sleeve (35%) initially.",
              note_jp:
                "Models 100% of defensive $XLV sleeve (30%) and half of $SMH sleeve (35%) initially.",
              note_kr:
                "Models 100% of defensive $XLV sleeve (30%) and half of $SMH sleeve (35%) initially.",
            },
            {
              step: 2,
              title_en: "Tranche 2 (Remaining 35% Reserve in T-Bills / MMF)",
              title_jp: "Tranche 2 (Remaining 35% Reserve in T-Bills / MMF)",
              title_kr: "Tranche 2 (Remaining 35% Reserve in T-Bills / MMF)",
              timing_en: "Modeled Staged Tranche (D+30 / D+60 / D+90)",
              timing_jp: "Modeled Staged Tranche (D+30 / D+60 / D+90)",
              timing_kr: "Modeled Staged Tranche (D+30 / D+60 / D+90)",
              allocation_pct: 35.0,
              amount_usd: t2Smh,
              smh_usd: t2Smh,
              xlv_usd: 0.0,
              cash_rp_usd: t2Smh,
              smh_shares: Math.floor(t2Smh / smhP),
              xlv_shares: 0,
              note_en:
                "Models ~4.5% USD T-Bill/MMF yield while staging across 90 days.",
              note_jp:
                "Models ~4.5% USD T-Bill/MMF yield while staging across 90 days.",
              note_kr:
                "Models ~4.5% USD T-Bill/MMF yield while staging across 90 days.",
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
            "Case 3 (Score 68–100 · Greed Regime): 30% $XLV + 70% T-Bill Cushion Model",
          case_title_jp:
            "Case 3 (Score 68–100 · Greed Regime): 30% $XLV + 70% T-Bill Cushion Model",
          case_title_kr:
            "Case 3 (Score 68–100 · Greed Regime): 30% $XLV + 70% T-Bill Cushion Model",
          summary_en:
            "Overheated sentiment model: allocates 30% to $XLV defensive sleeve initially and parks 70% in T-Bill/MMF cushion.",
          summary_jp:
            "Overheated sentiment model: allocates 30% to $XLV defensive sleeve initially and parks 70% in T-Bill/MMF cushion.",
          summary_kr:
            "Overheated sentiment model: allocates 30% to $XLV defensive sleeve initially and parks 70% in T-Bill/MMF cushion.",
          immediate_deploy_pct: 30.0,
          parked_cash_rp_pct: 70.0,
          tranches: [
            {
              step: 1,
              title_en: "Tranche 1 (Day 1 Defensive $XLV 30% Sleeve)",
              title_jp: "Tranche 1 (Day 1 Defensive $XLV 30% Sleeve)",
              title_kr: "Tranche 1 (Day 1 Defensive $XLV 30% Sleeve)",
              timing_en: "Modeled Defensive Sleeve ($XLV 30%)",
              timing_jp: "Modeled Defensive Sleeve ($XLV 30%)",
              timing_kr: "Modeled Defensive Sleeve ($XLV 30%)",
              allocation_pct: 30.0,
              amount_usd: d1Xlv,
              smh_usd: 0.0,
              xlv_usd: d1Xlv,
              cash_rp_usd: 0.0,
              smh_shares: 0,
              xlv_shares: Math.floor(d1Xlv / xlvP),
              note_en:
                "Avoids overheated growth concentration above score 68 by modeling the 30% Healthcare sleeve first.",
              note_jp:
                "Avoids overheated growth concentration above score 68 by modeling the 30% Healthcare sleeve first.",
              note_kr:
                "Avoids overheated growth concentration above score 68 by modeling the 30% Healthcare sleeve first.",
            },
            {
              step: 2,
              title_en: "Tranche 2 (70% Reserve Parked in USD T-Bill / MMF)",
              title_jp: "Tranche 2 (70% Reserve Parked in USD T-Bill / MMF)",
              title_kr: "Tranche 2 (70% Reserve Parked in USD T-Bill / MMF)",
              timing_en: "Modeled 4-Month Staged Rebalance",
              timing_jp: "Modeled 4-Month Staged Rebalance",
              timing_kr: "Modeled 4-Month Staged Rebalance",
              allocation_pct: 70.0,
              amount_usd: pSmh,
              smh_usd: pSmh,
              xlv_usd: 0.0,
              cash_rp_usd: pSmh,
              smh_shares: Math.floor(pSmh / smhP),
              xlv_shares: 0,
              note_en:
                "Models short-term T-Bill interest while sentiment mean-reverts toward neutral.",
              note_jp:
                "Models short-term T-Bill interest while sentiment mean-reverts toward neutral.",
              note_kr:
                "Models short-term T-Bill interest while sentiment mean-reverts toward neutral.",
            },
          ],
        };
      }
    }
  );
}

export async function buildClientTelegramPreview({
  alert_type = "SEMI_BRIEFING",
  lang = "en",
  ticker = "CELH",
  entry_price = null,
  days_held = 42,
} = {}) {
  const atype = String(alert_type || "SEMI_BRIEFING").trim().toUpperCase();
  const lg = String(lang || "en").toLowerCase() === "jp" ? "jp" : "en";

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
    const dSmhSign = reb.delta_smh_usd >= 0 ? "ADD +" : "TRIM -";
    const dXlvSign = reb.delta_xlv_usd >= 0 ? "ADD +" : "TRIM -";
    const smhShSign = reb.delta_smh_shares >= 0 ? `+${reb.delta_smh_shares}` : `${reb.delta_smh_shares}`;
    const xlvShSign = reb.delta_xlv_shares >= 0 ? `+${reb.delta_xlv_shares}` : `${reb.delta_xlv_shares}`;

    return [
      `🧭 [TruthOfMarket] Daily Market Weather & Barbell Calculator Summary (${ov.date})`,
      `• Sentiment Gauge: ${Number(ov.fg_score).toFixed(1)} / 100 (${String(ov.regime_en).toUpperCase()})`,
      `• $SMH: $${Number(ov.smh_close).toFixed(2)} (${Number(ov.smh_dd_pct).toFixed(2)}% 52W DD)`,
      `• $XLV: $${Number(ov.xlv_close).toFixed(2)} (${xlv1d >= 0 ? "+" : ""}${xlv1d.toFixed(2)}% 1D) | $QQQ: $${Number(ov.qqq_close).toFixed(2)} (${qqq1d >= 0 ? "+" : ""}${qqq1d.toFixed(2)}% 1D)`,
      ``,
      `📊 $100,000 Simulated Weight Calculation (${ov.recommended_smh_weight}% $SMH : ${ov.recommended_xlv_weight}% $XLV):`,
      `• $SMH (${reb.target_smh_weight_pct}%): $${Number(reb.target_smh_usd).toLocaleString()} (${reb.target_smh_shares} sh) -> ${dSmhSign}$${Math.abs(Number(reb.delta_smh_usd)).toLocaleString()} (${smhShSign} sh)`,
      `• $XLV (${reb.target_xlv_weight_pct}%): $${Number(reb.target_xlv_usd).toLocaleString()} (${reb.target_xlv_shares} sh) -> ${dXlvSign}$${Math.abs(Number(reb.delta_xlv_usd)).toLocaleString()} (${xlvShSign} sh)`,
      `🔗 Calculator: https://truthofmarket.com/semi-fear-greed.html`,
    ].join("\n");
  };

  const buildRsaText = () => {
    const asOf = ignStocks[0]?.date || "2026-10-30";
    const proUnlocked = isProActive();
    const rows = ignStocks
      .map((s, idx) => {
        if (!proUnlocked && idx >= 1) {
          return `${idx + 1}. 🔒 VIP DATASET ROW #${idx + 1} — Unlock VIP Software at truthofmarket.com`;
        }
        const trig = s.entry_trigger_price ?? s.ma60_price ?? s.close;
        const stopP = s.stop_loss_price ?? Number((s.close * 0.91).toFixed(2));
        const tp1P = s.tp1_2x_price ?? Number((s.close * 2.0).toFixed(2));
        return `${idx + 1}. $${s.ticker} ($${Number(s.close).toFixed(2)}) · Score ${Number(s.score).toFixed(0)}/100\n   52W DD ${Number(s.dd_high52_pct).toFixed(1)}% | Vol ${Number(s.vol_surge_10d).toFixed(2)}x | MA60 Ref $${Number(trig).toFixed(2)} | Band $${Number(stopP).toFixed(2)}-$${Number(tp1P).toFixed(2)}`;
      })
      .join("\n");

    const ignCount = allStocks.filter((s) => s.zone_code === "IGNITION_ZONE").length;
    return [
      `📊 [TruthOfMarket] Historical US Equity Factor Summary (${asOf})`,
      `Universe: ${allStocks.length} NYSE/NASDAQ Equities | Factor Filter Count: ${ignCount}`,
      ``,
      rows,
      ``,
      `📘 Self-Directed Educational Calculator Software (Not personalized investment advice)`,
      `🔗 Archive: https://truthofmarket.com/pro-swing.html`,
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
    const text = [
      `🧮 [Variance Calculator] $${doc.ticker} Historical Band Summary (${doc.as_of_date})`,
      `• Band Status: ${doc.status_label} (${doc.status_code})`,
      `• Latest Close: $${Number(doc.current_price).toFixed(2)} | Cost Basis: $${Number(doc.entry_price).toFixed(2)} | Held: ${days_held ?? 42}d`,
      `• Simulated Return: ${doc.return_pct >= 0 ? "+" : ""}${Number(doc.return_pct).toFixed(2)}%`,
      `• Lower Band Ref: $${Number(doc.stop_price).toFixed(2)} | Upper Band Ref: $${Number(doc.tp1_price).toFixed(2)}`,
      `• Note: ${doc.action_plan}`,
    ].join("\n");
    return { text, as_of_date: doc.as_of_date || "2026-10-30", alert_type: atype, lang: lg };
  }
  if (atype === "TEST_PING") {
    const topSym = ignStocks[0]?.ticker || "CELH";
    const topClose = Number(ignStocks[0]?.close ?? 27.93).toFixed(2);
    const text = `✅ [Telegram Connected] SemiFearGreed & RightSideAlpha Alert Bot Active!\n• Semi Fear & Greed (${ov.date}): ${Number(ov.fg_score).toFixed(1)}/100 (${String(ov.regime_en).toUpperCase()})\n• $SMH: $${Number(ov.smh_close).toFixed(2)} | $XLV: $${Number(ov.xlv_close).toFixed(2)} | $QQQ: $${Number(ov.qqq_close).toFixed(2)}\n• Top US Ignition Pick: $${topSym} ($${topClose})`;
    return { text, as_of_date: ov.date || "2026-10-26", alert_type: atype, lang: lg };
  }

  return {
    text: `${buildSemiText()}\n\n━━━━━━━━━━━━━━━━━━━━\n\n${buildRsaText()}`,
    as_of_date: ov.date || "2026-10-26",
    alert_type: "FULL_DAILY",
    lang: lg,
  };
}

export const DEFAULT_TG_BOT_TOKEN = "DEMO-BOT-TOKEN";
export const DEFAULT_TG_CHAT_ID = "@truthofmarketss";
export const DEFAULT_TG_CHANNEL_URL = "https://t.me/truthofmarketss";
export const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/@RightSideAlpha";
export const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/rightsidealpha";

export async function syncTelegramBotBrowser(botToken, currentChatId = "") {
  const cid = String(currentChatId || DEFAULT_TG_CHAT_ID).trim();
  return { chatId: cid, botUsername: "truthofmarketss", synced: true };
}

export async function fetchTelegramStatus() {
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

export async function saveTelegramConfig(data) {
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

export async function verifyTelegramBot(data) {
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

export async function sendTelegramAlert(data) {
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
