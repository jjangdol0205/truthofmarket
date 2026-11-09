#!/usr/bin/env node
/**
 * MASTER HQ TELEGRAM BRIDGE — Unified 3-Business Sequential Controller (Sleep/Wake Proof)
 * (1. truthofmarket.com | 2. kisfitglobal.com | 3. kidsfit.co.kr)
 *
 * - Single lightweight polling process with hard 15s socket watchdog (survives Windows Sleep/Wake)
 * - Listens across @kidsfittbot, @RigjtsideAlphabot, and @SemifearGreedbot in 1 process
 * - Strictly 1-at-a-time Sequential Queue (taskQueue) across all 3 businesses
 * - Supports `--notify "<msg>"` so Antigravity agents reply back upon task completion
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const { spawn, spawnSync } = require("child_process");

function loadEnvFile(filePath) {
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    raw.split(/\r?\n/).forEach((line) => {
      const t = line.trim();
      if (!t || t.startsWith("#") || !t.includes("=")) return;
      const idx = t.indexOf("=");
      out[t.slice(0, idx).trim()] = t.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    });
  } catch (_) {}
  return out;
}

function loadJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (_) {}
  return {};
}

const kfgEnv = loadEnvFile("D:\\드림컴퍼니\\2사업부\\.env");
const kfkEnv = loadEnvFile("D:\\드림컴퍼니\\3사업부\\.env");
const tomEnv = loadEnvFile(path.resolve(__dirname, "..", ".env"));
const tomTgCfg = loadJsonFile(path.resolve(__dirname, "..", "data", "telegram_config.json"));

const OWNER_USER_ID = "755033799";
const DEFAULT_GROUP_CHAT_ID = "-1003834697086";
const CHAT_ID = process.env.HQ_TELEGRAM_CHAT_ID || tomEnv.HQ_TELEGRAM_CHAT_ID || DEFAULT_GROUP_CHAT_ID;

// Dedicated Non-Overlapping Bot Tokens per Division:
// - Div 1 Bot (@RigjtsideAlphabot): Division 1 (truthofmarket.com) Dedicated Bot
// - Div 2 Bot (@kidsfittbot): Division 2 (kisfitglobal.com) Dedicated Bot
// - Div 3 Bot (@Moneyfiityyy_bot): Division 3 (kidsfit.co.kr) Dedicated Bot
const SEMI_BOT_TOKEN = tomTgCfg.bot_token || "9291573259:AAEZXNkQ4wuEPX6FYujxKT5mwLWdQpZOnes";
const RSA_BOT_TOKEN = tomEnv.RSA_TELEGRAM_BOT_TOKEN || "";
const KFG_BOT_TOKEN = kfgEnv.TELEGRAM_BOT_TOKEN || "";
const KFK_BOT_TOKEN = kfkEnv.TELEGRAM_BOT_TOKEN || "";
const PRIMARY_BOT_TOKEN = RSA_BOT_TOKEN || KFG_BOT_TOKEN || KFK_BOT_TOKEN || "";

// Collect active bot tokens (deduplicated: Div 1 + Div 2 + Div 3 + HQ)
const BOT_TOKENS = Array.from(
  new Set([RSA_BOT_TOKEN, KFG_BOT_TOKEN, KFK_BOT_TOKEN, SEMI_BOT_TOKEN].filter((t) => t && t.includes(":")))
);

const DATA_DIR = path.resolve(__dirname, "..", "data");
const STATE_FILE = path.join(DATA_DIR, "master_hq_bridge_state.json");
const PID_FILE = path.join(DATA_DIR, "master_hq_bridge.pid");
const BRIDGE_SCRIPT_PATH = __filename;

const HQ_ROOT_DIR = "D:\\드림컴퍼니";
const HQ_COMMON_DIRECTIVES_FILE = path.join(HQ_ROOT_DIR, "data", "hq_common_directives.json");
const LOCAL_COMMON_DIRECTIVES_FILE = path.join(DATA_DIR, "hq_common_directives.json");
const HQ_COMMON_DIRECTIVES_MD = path.join(HQ_ROOT_DIR, "docs", "HQ_COMMON_DIRECTIVES.md");

const LANGUAGE_SERVER_EXE = "C:\\Users\\jjang\\AppData\\Local\\Programs\\Antigravity\\resources\\bin\\language_server.exe";
const AGENTAPI_BAT = "C:\\Users\\jjang\\.gemini\\antigravity\\bin\\agentapi.bat";

// [채널 이원화] 텔레그램 원격 작업 전용 채널 vs 사장님 PC 직접 작업 전용 채널 분리
const MASTER_CONVERSATION_ID = "1921e31e-ab59-4720-9419-93cac770374d";
const PC_DIRECT_CONVERSATION_ID = "dbc61f0a-76cb-48e3-b617-a616c069564c";

function resolveSafeTelegramConversationId(candidateId) {
  const trimmed = String(candidateId || "").trim();
  if (!trimmed || trimmed === PC_DIRECT_CONVERSATION_ID) {
    return MASTER_CONVERSATION_ID;
  }
  return trimmed;
}

const DEFAULT_STANDING_DIRECTIVES = [
  {
    id: 1,
    title: "안티그래비티 채널 이원화 (텔레그램 원격 vs PC 직접 작업 분리)",
    rule: "텔레그램 원격 지시사항은 전용 대화창(1921e31e-ab59-4720-9419-93cac770374d)에서만 전담 처리하며, 사장님이 컴퓨터로 직접 작업하시는 기존 채널(dbc61f0a-76cb-48e3-b617-a616c069564c)에는 절대 원격 프롬프트를 전송하거나 간섭하지 않는다.",
    createdAt: "2026-11-08T22:12:00+09:00",
  },
  {
    id: 2,
    title: "전 사업부 결제·수익화 가드레일 절대 보호",
    rule: "1사업부(truthofmarket.com) 및 2사업부(kisfitglobal.com)의 Lemon Squeezy 실결제 Live UUID(#296100)와 3사업부(kidsfit.co.kr)의 쿠팡 파트너스(AF7865143)·링크프라이스(A100708867) 수익 코드 및 공정위 고지문, 금지어(최저가·할인율·특가·폭탄세일 사용 금지)를 절대 훼손하지 않는다.",
    createdAt: "2026-11-08T22:12:00+09:00",
  },
  {
    id: 3,
    title: "전 사업부 클린 숏폼(1080×1920) 마스터링 표준",
    rule: "1·2·3사업부 모든 숏폼 영상은 본문 100% 클린 풀스크린(상·하단 배너 및 워터마크 금지), 하단 세이프존(Y=1380~1450) 두꺼운 외곽선 자막(stroke_width >= 6), 종료 2.5~3.8초 엔딩 슬레이트 도메인 콜아웃 규격을 준수한다.",
    createdAt: "2026-11-08T22:12:00+09:00",
  },
  {
    id: 4,
    title: "전 사업부 1:1 전담 봇 결과 보고 및 라이브 검증 원칙",
    rule: "작업 완료 시 반드시 빌드 및 라이브/로컬 전수 검증을 마친 뒤, 본사 총괄(@SemifearGreedbot), 1사업부(@RigjtsideAlphabot), 2사업부(@kidsfittbot), 3사업부(@Moneyfiityyy_bot) 중 해당 전용 봇으로 핵심 요약 결과를 즉시 답장한다.",
    createdAt: "2026-11-08T22:12:00+09:00",
  },
];

function loadCommonDirectives() {
  const targetFile = fs.existsSync(HQ_COMMON_DIRECTIVES_FILE)
    ? HQ_COMMON_DIRECTIVES_FILE
    : fs.existsSync(LOCAL_COMMON_DIRECTIVES_FILE)
    ? LOCAL_COMMON_DIRECTIVES_FILE
    : null;
  if (targetFile) {
    try {
      const parsed = JSON.parse(fs.readFileSync(targetFile, "utf8"));
      if (!Array.isArray(parsed.standingDirectives) || parsed.standingDirectives.length === 0) {
        parsed.standingDirectives = [...DEFAULT_STANDING_DIRECTIVES];
      }
      if (!Array.isArray(parsed.recentCommonOrders)) {
        parsed.recentCommonOrders = [];
      }
      parsed.telegramDedicatedConversationId = MASTER_CONVERSATION_ID;
      parsed.pcDirectConversationId = PC_DIRECT_CONVERSATION_ID;
      return parsed;
    } catch (_) {}
  }
  return {
    updatedAt: new Date().toISOString(),
    telegramDedicatedConversationId: MASTER_CONVERSATION_ID,
    pcDirectConversationId: PC_DIRECT_CONVERSATION_ID,
    standingDirectives: [...DEFAULT_STANDING_DIRECTIVES],
    recentCommonOrders: [],
  };
}

function syncCommonDirectivesMarkdown(data) {
  try {
    const directives = data.standingDirectives || [];
    const orders = data.recentCommonOrders || [];
    const mdLines = [
      `# 📌 드림컴퍼니 (Dream Company) 전 사업부 공통 지시사항 원장 (HQ Common Directives)`,
      ``,
      `> 이 문서는 텔레그램 본사 총괄 리모컨(\`@SemifearGreedbot\` · \`/directives\` · \`/mode_all\`)과 연동되어 **1사업부(\`truthofmarket.com\`) · 2사업부(\`kisfitglobal.com\`) · 3사업부(\`kidsfit.co.kr\`)** 전 사업부 에이전트에게 공통으로 강제 주입되는 지시사항 원장입니다.`,
      ``,
      `---`,
      ``,
      `## 🖥️ 1. 안티그래비티 작업 채널 이원화 (Channel Separation)`,
      ``,
      `| 구분 | 안티그래비티 Conversation ID | 용도 및 운영 원칙 |`,
      `| :--- | :--- | :--- |`,
      `| **📱 텔레그램 원격 전용 채널** | \`${MASTER_CONVERSATION_ID}\` | 텔레그램(\`@SemifearGreedbot\`, \`@RigjtsideAlphabot\`, \`@kidsfittbot\`, \`@Moneyfiityyy_bot\`)에서 인입되는 전 사업부 공통 및 개별 사업부 원격 작업 100% 전담 수행 |`,
      `| **💻 컴퓨터(PC) 직접 작업 채널** | \`${PC_DIRECT_CONVERSATION_ID}\` | 사장님 PC 직접 지시 및 대화 전용 채널 (텔레그램 브릿지 발송 원천 차단 · 간섭 0%) |`,
      ``,
      `---`,
      ``,
      `## 📌 2. 영구 적용 전 사업부 공통 지시사항 (Standing Directives)`,
      ``,
      ...directives.map(
        (d, idx) =>
          `${idx + 1}. **[${d.title || `공통 수칙 #${idx + 1}`}]**\n   - ${d.rule}`
      ),
      ``,
      `---`,
      ``,
      `## 🕒 3. 최근 하달된 전 사업부 공통 작업 이력 (Recent All-Division Orders)`,
      ``,
      ...(orders.length > 0
        ? orders.slice(0, 10).map((o, idx) => `- **[${o.createdAt}]** ${o.text} (\`${o.status || "DISPATCHED"}\`)`)
        : [`- 아직 기록된 일괄 작업 이력이 없습니다.`]),
      ``,
      `---`,
      ``,
      `## 💬 4. 텔레그램 전 사업부 공통 지시사항 명령어 가이드`,
      ``,
      `- **리모컨 버튼**:`,
      `  - \`🏛️ 전 사업부 공통 지시 모드\` (\`/mode_all\`): 이후 입력하는 모든 일반 메시지를 1·2·3사업부 전체 공통 작업으로 하달`,
      `  - \`📌 전 사업부 공통 지시사항\` (\`/directives\`): 현재 등록된 영구 공통 지시사항 및 최근 공통 작업 내역 조회`,
      `- **텍스트 간편 명령어 (어느 모드에서든 즉시 작동)**:`,
      `  - \`[공통] <지시내용>\` 또는 \`전사업부: <지시내용>\` 또는 \`공통: <지시내용>\` → 1·2·3사업부 전체 일괄 실행`,
      `  - \`공통등록: <규칙내용>\` 또는 \`/공통추가 <규칙내용>\` → 영구 공통 지시사항 추가 (전 사업부 프롬프트 자동 주입)`,
      `  - \`공통삭제 <번호>\` 또는 \`/공통삭제 <번호>\` → 등록된 영구 공통 지시사항 삭제`,
      ``,
    ];
    fs.mkdirSync(path.dirname(HQ_COMMON_DIRECTIVES_MD), { recursive: true });
    fs.writeFileSync(HQ_COMMON_DIRECTIVES_MD, mdLines.join("\n"), "utf8");
  } catch (_) {}
}

function saveCommonDirectives(data) {
  try {
    data.updatedAt = new Date().toISOString();
    data.telegramDedicatedConversationId = MASTER_CONVERSATION_ID;
    data.pcDirectConversationId = PC_DIRECT_CONVERSATION_ID;
    // Re-index standingDirectives IDs cleanly 1..N
    if (Array.isArray(data.standingDirectives)) {
      data.standingDirectives = data.standingDirectives.map((item, idx) => ({
        ...item,
        id: idx + 1,
      }));
    }
    const jsonStr = JSON.stringify(data, null, 2);
    fs.mkdirSync(path.dirname(HQ_COMMON_DIRECTIVES_FILE), { recursive: true });
    fs.writeFileSync(HQ_COMMON_DIRECTIVES_FILE, jsonStr, "utf8");
    fs.mkdirSync(path.dirname(LOCAL_COMMON_DIRECTIVES_FILE), { recursive: true });
    fs.writeFileSync(LOCAL_COMMON_DIRECTIVES_FILE, jsonStr, "utf8");
    syncCommonDirectivesMarkdown(data);
  } catch (_) {}
  return data;
}

function addStandingDirective(ruleText, titleText = "") {
  const cleanRule = String(ruleText || "").trim();
  if (!cleanRule) return loadCommonDirectives();
  const data = loadCommonDirectives();
  const autoTitle =
    titleText ||
    (cleanRule.length > 28 ? `${cleanRule.slice(0, 28)}...` : cleanRule);
  data.standingDirectives.push({
    id: data.standingDirectives.length + 1,
    title: autoTitle,
    rule: cleanRule,
    createdAt: new Date().toISOString(),
  });
  return saveCommonDirectives(data);
}

function removeStandingDirective(targetIndexOrId) {
  const num = Number(targetIndexOrId);
  const data = loadCommonDirectives();
  if (!Number.isFinite(num) || num < 1 || num > data.standingDirectives.length) {
    return { ok: false, data, removed: null };
  }
  const removed = data.standingDirectives.splice(num - 1, 1)[0];
  saveCommonDirectives(data);
  return { ok: true, data, removed };
}

function recordCommonOrder(orderText, status = "DISPATCHED") {
  const cleanText = String(orderText || "").trim();
  if (!cleanText) return loadCommonDirectives();
  const data = loadCommonDirectives();
  data.recentCommonOrders.unshift({
    text: cleanText,
    status,
    createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
  });
  if (data.recentCommonOrders.length > 15) {
    data.recentCommonOrders = data.recentCommonOrders.slice(0, 15);
  }
  return saveCommonDirectives(data);
}

const DIVISIONS = {
  ALL: {
    code: "ALL",
    name: "전 사업부 공통 (1·2·3사업부 통합 지휘 · 드림컴퍼니 HQ)",
    domain: "https://truthofmarket.com | https://kisfitglobal.com | https://kidsfit.co.kr",
    cwd: HQ_ROOT_DIR,
    conversationId: MASTER_CONVERSATION_ID,
    botToken: SEMI_BOT_TOKEN,
    botHandle: "@SemifearGreedbot",
    managerTitle: "드림컴퍼니 본사 총괄 매니저 (HQ Chief Executive Agent)",
    multiAgents: [
      "HQ-Common-Directive-Controller (전 사업부 공통 지시사항 등록·강제 적용 및 1·2·3사업부 일괄 하달)",
      "TOM-Division-Lead (1사업부 truthofmarket.com — 72종목 PW-RSI & $SMH:$XLV 바벨 · VIP 속보)",
      "KFG-Division-Lead (2사업부 kisfitglobal.com — US CDC 2000 LMS · 영문 임상 Q&A · 글로벌 쇼츠)",
      "KFK-Division-Lead (3사업부 kidsfit.co.kr — 2017 질병관리청 성장 · 24종 큐레이션 · 네이버 바이럴)",
    ],
  },
  TOM: {
    code: "TOM",
    name: "1사업부: RightSideAlpha (truthofmarket.com)",
    domain: "https://truthofmarket.com",
    cwd: "D:\\드림컴퍼니\\1사업부",
    conversationId: MASTER_CONVERSATION_ID,
    botToken: RSA_BOT_TOKEN,
    botHandle: "@RigjtsideAlphabot",
    managerTitle: "1사업부 퀀트·반도체 부문장 (TOM Division Lead)",
    multiAgents: [
      "TOM-Quant-Agent (72종목 PW-RSI & $SMH:$XLV 80:20 바벨 퀀트 엔진)",
      "TOM-GEO-Promo-Agent (Telegra.ph 월가 백링크 · llms.txt · IndexNow 78개 URL 색인)",
      "TOM-Media-VIP-Agent (@rightsidealpha 쇼츠·릴스 & @truthofmarketss VIP 속보 데스크)",
    ],
  },
  KFG: {
    code: "KFG",
    name: "2사업부: KISFIT Global (kisfitglobal.com)",
    domain: "https://kisfitglobal.com",
    cwd: "D:\\드림컴퍼니\\2사업부",
    conversationId: resolveSafeTelegramConversationId(kfgEnv.ANTIGRAVITY_CONVERSATION_ID),
    botToken: KFG_BOT_TOKEN,
    botHandle: "@kidsfittbot",
    managerTitle: "2사업부 글로벌 소아성장 부문장 (KFG Division Lead)",
    multiAgents: [
      "KFG-Auxology-Agent (US CDC 2000 LMS & Khamis-Roche 성인키 정밀 예측 엔진)",
      "KFG-GlobalSEO-Agent (89+ 영문 임상 Q&A 증식 · Zero-Hangul 검열 · 글로벌 색인)",
      "KFG-Media-Agent (@kisfitglobal 3D 의학 다큐 쇼츠·릴스 마스터링 에이전트)",
    ],
  },
  KFK: {
    code: "KFK",
    name: "3사업부: 키즈핏 코리아 (kidsfit.co.kr)",
    domain: "https://kidsfit.co.kr",
    cwd: "D:\\드림컴퍼니\\3사업부",
    conversationId: resolveSafeTelegramConversationId(kfkEnv.ANTIGRAVITY_CONVERSATION_ID),
    botToken: KFK_BOT_TOKEN,
    botHandle: "@Moneyfiityyy_bot",
    managerTitle: "3사업부 국내 육아·커머스 부문장 (KFK Division Lead)",
    multiAgents: [
      "KFK-KDCA-Agent (2017 질병관리청 성장도표 & K-DST 발달 6축 진단 엔진)",
      "KFK-Commerce-Agent (24종 셀렉트샵 쿠팡 AF7865143 · 링크프라이스 A100708867 수익화)",
      "KFK-Naver-Viral-Agent (expertise333 블로그 · moneyfitlab 카페 · 지식iN · @kidsfit01 쇼츠)",
    ],
  },
};

function getLiveTokenTelemetryBanner() {
  try {
    const agyBrain = "C:\\Users\\jjang\\.gemini\\antigravity\\brain";
    if (!fs.existsSync(agyBrain)) return "";
    const nowMs = Date.now();
    const cutoff7d = nowMs - 7 * 86400 * 1000;
    const cutoff24h = nowMs - 24 * 3600 * 1000;
    let convs7d = 0;
    let fullBytes7d = 0;
    let fullBytes24h = 0;
    for (const dirName of fs.readdirSync(agyBrain)) {
      const logsDir = path.join(agyBrain, dirName, ".system_generated", "logs");
      const tfull = path.join(logsDir, "transcript_full.jsonl");
      const tf = path.join(logsDir, "transcript.jsonl");
      const target = fs.existsSync(tfull) ? tfull : fs.existsSync(tf) ? tf : null;
      if (!target) continue;
      const st = fs.statSync(target);
      if (st.mtimeMs >= cutoff7d) {
        convs7d += 1;
        fullBytes7d += st.size;
        if (st.mtimeMs >= cutoff24h) fullBytes24h += st.size;
      }
    }
    const tok24h = Math.round(fullBytes24h / 3.8).toLocaleString();
    const tok7d = Math.round(fullBytes7d / 3.8).toLocaleString();
    const mb24h = (fullBytes24h / (1024 * 1024)).toFixed(1);
    const mb7d = (fullBytes7d / (1024 * 1024)).toFixed(1);
    return (
      `\n━━━━━━━━━━━━━━━━━━━━\n` +
      `📊 <b>[실시간 안티그래비티 토큰 현황 보고]</b>\n` +
      `• <b>오늘(24h) 투입</b>: 약 <code>${tok24h} Tokens</code> (<code>${mb24h} MB</code>)\n` +
      `• <b>최근 7일 누적</b>: 약 <code>${tok7d} Tokens</code> (<b>${convs7d}개 에이전트 세션</b> / <code>${mb7d} MB</code>)\n` +
      `• <b>가동 출력</b>: 🔥 <b>토큰 절약 해제 · 최대치 풀가동(Full-Overdrive)</b>`
    );
  } catch (_) {
    return "";
  }
}

function resolveDivisionByBotToken(botToken, includeHqAsAll = false) {
  if (!botToken) return null;
  if (RSA_BOT_TOKEN && botToken === RSA_BOT_TOKEN) return "TOM";
  if (KFG_BOT_TOKEN && botToken === KFG_BOT_TOKEN) return "KFG";
  if (KFK_BOT_TOKEN && botToken === KFK_BOT_TOKEN) return "KFK";
  if (includeHqAsAll && SEMI_BOT_TOKEN && botToken === SEMI_BOT_TOKEN) return "ALL";
  return null;
}

const HQ_KEYBOARD = {
  inline_keyboard: [
    [
      { text: "🏛️ 전 사업부 공통 지시 모드", callback_data: "/mode_all" },
      { text: "📌 전 사업부 공통 지시사항", callback_data: "/directives" },
    ],
    [
      { text: "📋 1·2·3사업부 봇 일제 보고", callback_data: "/report" },
      { text: "🏢 전사 멀티에이전트 조직도", callback_data: "/company" },
    ],
    [
      { text: "📈 1사업부 (RightSideAlpha)", callback_data: "/mode_tom" },
      { text: "🌍 2사업부 (KISFIT Global)", callback_data: "/mode_kfg" },
    ],
    [
      { text: "🇰🇷 3사업부 (키즈핏 코리아)", callback_data: "/mode_kfk" },
      { text: "📊 3대 사업부 & 채널 상태", callback_data: "/status" },
    ],
    [
      { text: "📰 미국주식·SMH·XLV VIP뉴스 발송", callback_data: "/tom_news" },
      { text: "🎬 1사업부 Flow 릴스 1건 실행", callback_data: "/flow_tom" },
    ],
    [
      { text: "🎬 2사업부(영문) Flow 릴스 1건", callback_data: "/flow_kfg" },
      { text: "🎬 3사업부(국내) Flow 릴스 1건", callback_data: "/flow_kfk" },
    ],
    [
      { text: "📈 전사업부 방문자·봇별 브리핑", callback_data: "/visitors" },
      { text: "🛡️ 전사업부 무토큰 교차검열", callback_data: "/audit" },
    ],
    [
      { text: "🕒 24시간 1·2·3사업부 스케줄", callback_data: "/schedule24" },
      { text: "🍋 레몬스퀴지 승인·실결제 즉시조회", callback_data: "/ls" },
    ],
  ],
};

function ensureSingleInstance() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(PID_FILE)) {
      const oldPid = Number(fs.readFileSync(PID_FILE, "utf8").trim());
      if (oldPid && oldPid !== process.pid) {
        try {
          process.kill(oldPid, "SIGTERM");
        } catch (_) {}
      }
    }
    for (const legacyPidFile of [
      "D:\\드림컴퍼니\\3사업부\\logs\\telegram_bridge.pid",
      "D:\\드림컴퍼니\\3사업부\\logs\\telegram_bridge.pid",
      "D:\\드림컴퍼니\\2사업부\\logs\\telegram_bridge.pid",
    ]) {
      if (fs.existsSync(legacyPidFile)) {
        const lPid = Number(fs.readFileSync(legacyPidFile, "utf8").trim());
        if (lPid && lPid !== process.pid) {
          try {
            process.kill(lPid, "SIGTERM");
          } catch (_) {}
        }
      }
    }
    fs.writeFileSync(PID_FILE, String(process.pid), "utf8");
  } catch (_) {}
}

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
      if (!parsed.offsets) parsed.offsets = {};
      if (!parsed.lastAutoRunDate) parsed.lastAutoRunDate = {};
      if (!parsed.activeDivision) parsed.activeDivision = "TOM";
      return parsed;
    }
  } catch (_) {}
  return {
    lastUpdateId: 0,
    offsets: {},
    activeDivision: "TOM",
    lastAutoRunDate: {},
  };
}

function saveState(st) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(st, null, 2), "utf8");
  } catch (_) {}
}

/**
 * Sleep/Wake-Proof Telegram API request with hard JS watchdog timer (15 seconds max)
 */
function tgApiWithToken(botToken, method, payload = null, hardTimeoutMs = 15000) {
  return new Promise((resolve) => {
    let settled = false;
    let req = null;
    const finish = (val) => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);
      resolve(val);
    };

    const watchdog = setTimeout(() => {
      try {
        if (req) req.destroy();
      } catch (_) {}
      finish({ ok: false, error: "HARD_WATCHDOG_TIMEOUT" });
    }, hardTimeoutMs);

    try {
      const body = payload ? Buffer.from(JSON.stringify(payload), "utf8") : null;
      req = https.request(
        {
          hostname: "api.telegram.org",
          port: 443,
          path: `/bot${botToken}/${method}`,
          method: payload ? "POST" : "GET",
          headers: payload
            ? {
                "Content-Type": "application/json; charset=utf-8",
                "Content-Length": body.length,
              }
            : {},
          timeout: hardTimeoutMs - 1000,
        },
        (res) => {
          let raw = "";
          res.on("data", (c) => (raw += c.toString("utf8")));
          res.on("end", () => {
            try {
              finish(JSON.parse(raw));
            } catch (_) {
              finish({ ok: false });
            }
          });
        }
      );
      req.on("error", () => finish({ ok: false }));
      req.on("timeout", () => {
        try {
          req.destroy();
        } catch (_) {}
        finish({ ok: false });
      });
      if (body) req.write(body);
      req.end();
    } catch (_) {
      finish({ ok: false });
    }
  });
}

function getTargetChatId() {
  try {
    const st = loadState();
    if (st && st.groupChatId) return String(st.groupChatId);
  } catch (_) {}
  return String(DEFAULT_GROUP_CHAT_ID);
}

async function sendHqMessage(htmlText, withKeyboard = true, preferredToken = null, explicitChatId = null) {
  const tokenToUse = preferredToken || RSA_BOT_TOKEN || PRIMARY_BOT_TOKEN || BOT_TOKENS[0];
  const targetChat = explicitChatId || getTargetChatId();
  const payload = {
    chat_id: targetChat,
    text: htmlText,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };
  if (withKeyboard) payload.reply_markup = HQ_KEYBOARD;
  const res = await tgApiWithToken(tokenToUse, "sendMessage", payload, 12000);
  if (!res.ok && tokenToUse !== RSA_BOT_TOKEN && RSA_BOT_TOKEN) {
    // Fallback to Div 1 bot if the preferred token is not a member of the group chat
    const fallbackRes = await tgApiWithToken(RSA_BOT_TOKEN, "sendMessage", payload, 12000);
    if (fallbackRes.ok) return fallbackRes;
  }
  if (!res.ok && targetChat !== String(OWNER_USER_ID)) {
    payload.chat_id = String(OWNER_USER_ID);
    return await tgApiWithToken(RSA_BOT_TOKEN || tokenToUse, "sendMessage", payload, 12000);
  }
  return res;
}

function formatCommonDirectivesBoard(state) {
  const data = loadCommonDirectives();
  const directives = data.standingDirectives || [];
  const orders = data.recentCommonOrders || [];
  const activeDiv = DIVISIONS[state?.activeDivision] || DIVISIONS.ALL;

  const standingLines =
    directives.length > 0
      ? directives
          .map(
            (d, i) =>
              `<b>${i + 1}. [${d.title || `공통 수칙 #${i + 1}`}]</b>\n   └ ${d.rule}`
          )
          .join("\n\n")
      : "• 등록된 영구 공통 지시사항이 없습니다.";

  const recentOrderLines =
    orders.length > 0
      ? orders
          .slice(0, 5)
          .map((o, i) => `• <code>[${o.createdAt}]</code> ${o.text}`)
          .join("\n")
      : "• 최근 일괄 지시 이력이 없습니다.";

  return (
    `📌 <b>[드림컴퍼니 전 사업부 공통 지시사항 컨트롤 보드 (@SemifearGreedbot)]</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🖥️ <b>[안티그래비티 작업 채널 완벽 분리 현황]</b>\n` +
    `• 📱 <b>텔레그램 원격 전용 채널</b>: <code>${MASTER_CONVERSATION_ID}</code> (<b>현재 100% 전담 연결</b>)\n` +
    `• 💻 <b>컴퓨터(PC) 직접 작업 채널</b>: <code>${PC_DIRECT_CONVERSATION_ID}</code> (<b>독립 분리 · 원격 간섭 0%</b>)\n` +
    `• 🎯 <b>현재 리모컨 지시 대상</b>: <b>${activeDiv.name}</b>\n\n` +
    `📜 <b>[영구 적용 전 사업부 공통 지시사항 (${directives.length}건)]</b>\n` +
    `<i>(1·2·3사업부 모든 원격 작업 시 프롬프트에 자동 강제 주입됩니다)</i>\n` +
    `${standingLines}\n\n` +
    `🕒 <b>[최근 하달된 전 사업부 공통 작업 이력]</b>\n` +
    `${recentOrderLines}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💡 <b>[텔레그램에서 전 사업부 공통 지시 내리는 법]</b>\n` +
    `1️⃣ <b>전 사업부 일괄 작업 지시</b>:\n` +
    `   • 상단 <b>[🏛️ 전 사업부 공통 지시 모드]</b> 버튼 클릭 후 일반 메시지 입력\n` +
    `   • 또는 모드 상관없이 <code>[공통] 지시내용</code> / <code>전사업부: 지시내용</code> / <code>공통지시: 지시내용</code> 입력\n` +
    `2️⃣ <b>영구 공통 지시사항(수칙) 추가</b>:\n` +
    `   • <code>공통등록: 앞으로 모든 사업부는 ~게 작업해</code> (또는 <code>/공통추가 내용</code>)\n` +
    `3️⃣ <b>영구 공통 지시사항 삭제</b>:\n` +
    `   • <code>공통삭제 번호</code> (예: <code>공통삭제 5</code>)`
  );
}

async function sendDivisionReportsAll(state, explicitChatId = null) {
  const { runVisitorBriefing } = require("./hq_all_divisions_visitor_briefing");
  const { results } = await runVisitorBriefing({ sendTelegram: false });
  const rMap = {};
  for (const r of results || []) {
    if (r.code === "1사업부") rMap.TOM = r;
    if (r.code === "2사업부") rMap.KFG = r;
    if (r.code === "3사업부") rMap.KFK = r;
  }
  const commonData = loadCommonDirectives();
  const activeDiv = DIVISIONS[state?.activeDivision] || DIVISIONS.ALL;

  // 1. 본사 총괄 매니저 (@SemifearGreedbot)
  await sendHqMessage(
    `🏛️ <b>[드림컴퍼니 본사 총괄 매니저 보고 (@SemifearGreedbot)]</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `• <b>통합 대화방</b>: <b>모두컴퍼니</b> (<code>-1003834697086</code> · https://t.me/+gqQ4uTZpDW04Y2Nl)\n` +
      `• <b>통합 워크스페이스</b>: <code>D:\\드림컴퍼니</code> (1·2·3사업부 편제 완료)\n` +
      `• 📱 <b>텔레그램 전용 대화창</b>: <code>${MASTER_CONVERSATION_ID}</code> (<b>이쪽 채널로 전담 작업 중</b>)\n` +
      `• 💻 <b>컴퓨터(PC) 작업 대화창</b>: <code>${PC_DIRECT_CONVERSATION_ID}</code> (<b>기존 채널 · PC 전용 분리</b>)\n` +
      `• 🎯 <b>현재 리모컨 지시 모드</b>: <b>${activeDiv.name}</b>\n` +
      `• 📌 <b>전 사업부 공통 지시사항</b>: 영구 수칙 <b>${(commonData.standingDirectives || []).length}건</b> 상시 적용 중 (<code>/directives</code>)\n` +
      `• <b>현재 작업 대기열</b>: ${currentTask ? currentTask.title : "대기 중 (즉시 지시 가능)"} (대기 ${taskQueue.length}건)\n` +
      `<i>👇 이어서 1사업부 · 2사업부 · 3사업부 전담 봇이 차례대로 현황을 보고합니다.</i>`,
    false,
    SEMI_BOT_TOKEN,
    explicitChatId
  );

  // 2. 1사업부 (@RigjtsideAlphabot)
  const r1 = rMap.TOM || { uvToday: 0, pvToday: 0, uvTotal: 0, pvTotal: 0, paidClickToday: 0, paidClickTotal: 0, paidMemberTotal: 0, health: { ok: true, ms: 120 } };
  await sendHqMessage(
    `📈 <b>[1사업부 보고 — RightSideAlpha × SemiFearGreed (@RigjtsideAlphabot)]</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `• <b>도메인 / 경로</b>: https://truthofmarket.com (<code>${DIVISIONS.TOM.cwd}</code>)\n` +
      `• <b>서버 상태</b>: ${r1.health?.ok ? `🟢 정상 가동 (${r1.health.ms}ms)` : "🔴 점검 필요"} | SEO 128개 URL 색인\n` +
      `• <b>오늘 방문자(UV/PV)</b>: <b>${r1.uvToday}명</b> (${r1.pvToday}회) | 누적 <b>${r1.uvTotal}명</b> (${r1.pvTotal}회)\n` +
      `• <b>유료화 전환(PRO)</b>: 오늘 결제클릭 <b>${r1.paidClickToday}회</b> (누적 ${r1.paidClickTotal}회 / 실결제 ${r1.paidMemberTotal}건)\n` +
      `• <b>전담 에이전트</b>: 72종목 PW-RSI 타점 · $SMH:$XLV 바벨 · @truthofmarketss VIP 속보`,
    false,
    RSA_BOT_TOKEN,
    explicitChatId
  );

  // 3. 2사업부 (@kidsfittbot)
  const r2 = rMap.KFG || { uvToday: 0, pvToday: 0, uvTotal: 0, pvTotal: 0, paidClickToday: 0, paidClickTotal: 0, paidMemberTotal: 0, health: { ok: true, ms: 120 } };
  await sendHqMessage(
    `🌍 <b>[2사업부 보고 — KISFIT Global 영문 스튜디오 (@kidsfittbot)]</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `• <b>도메인 / 경로</b>: https://kisfitglobal.com (<code>${DIVISIONS.KFG.cwd}</code>)\n` +
      `• <b>서버 상태</b>: ${r2.health?.ok ? `🟢 정상 가동 (${r2.health.ms}ms)` : "🔴 점검 필요"} | US CDC 임상 Q&amp;A 222개 동기화\n` +
      `• <b>오늘 방문자(UV/PV)</b>: <b>${r2.uvToday}명</b> (${r2.pvToday}회) | 누적 <b>${r2.uvTotal}명</b> (${r2.pvTotal}회)\n` +
      `• <b>유료 리포트($8.99/$19.99)</b>: 오늘 결제클릭 <b>${r2.paidClickToday}회</b> (누적 ${r2.paidClickTotal}회 / 실결제 ${r2.paidMemberTotal}건)\n` +
      `• <b>전담 에이전트</b>: US CDC 2000 LMS · Khamis-Roche 성인키 예측 · @kisfitglobal 쇼츠`,
    false,
    KFG_BOT_TOKEN,
    explicitChatId
  );

  // 4. 3사업부 (@Moneyfiityyy_bot)
  const r3 = rMap.KFK || { uvToday: 0, pvToday: 0, uvTotal: 0, pvTotal: 0, refClickToday: 0, refClickTotal: 0, health: { ok: true, ms: 120 } };
  await sendHqMessage(
    `🇰🇷 <b>[3사업부 보고 — 키즈핏 코리아 국내·커머스 (@Moneyfiityyy_bot)]</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `• <b>도메인 / 경로</b>: https://kidsfit.co.kr (<code>${DIVISIONS.KFK.cwd}</code>)\n` +
      `• <b>서버 상태</b>: ${r3.health?.ok ? `🟢 정상 가동 (${r3.health.ms}ms)` : "🔴 점검 필요"} | 2017 질병관리청 성장도표 &amp; K-DST\n` +
      `• <b>오늘 방문자(UV/PV)</b>: <b>${r3.uvToday}명</b> (${r3.pvToday}회) | 누적 <b>${r3.uvTotal}명</b> (${r3.pvTotal}회)\n` +
      `• <b>제휴 커머스(쿠팡/링크프라이스)</b>: 오늘 상품클릭 <b>${r3.refClickToday}회</b> (누적 레퍼럴 <b>${r3.refClickTotal}회</b>)\n` +
      `• <b>전담 에이전트</b>: 24종 에디터 큐레이션 · 네이버 블로그/카페/지식iN · @kidsfit01 쇼츠`,
    true,
    KFK_BOT_TOKEN,
    explicitChatId
  );
}

// ---------------------------------------------------------------------------
// SEQUENTIAL 1-AT-A-TIME TASK QUEUE (Prevents PC Overload)
// ---------------------------------------------------------------------------
const taskQueue = [];
let currentTask = null;

function detectDivisionFromText(text, fallbackDiv) {
  const firstLine = (text || "").trim().split(/\r?\n/)[0].toLowerCase();
  // 1. Explicit division or common directive prefix on first line
  if (
    /^(\[?(공통|전\s*사업부|전사업부|전체|본사|all|hq)\]?|(공통|공통\s*지시|공통지시사항|전\s*사업부|전사업부|전체\s*사업부|전체|all|hq)\s*:)/.test(
      firstLine
    )
  ) {
    return "ALL";
  }
  if (/^(\[?1사업부\]?|1사업부\s*:|\[?tom\]?|tom\s*:)/.test(firstLine)) {
    return "TOM";
  }
  if (/^(\[?2사업부\]?|2사업부\s*:|\[?kfg\]?|kfg\s*:)/.test(firstLine)) {
    return "KFG";
  }
  if (/^(\[?3사업부\]?|3사업부\s*:|\[?kfk\]?|kfk\s*:)/.test(firstLine)) {
    return "KFK";
  }

  // 2. Strong all-divisions natural language keywords anywhere in the text
  const t = (text || "").toLowerCase();
  if (
    /전\s*사업부|모든\s*사업부|1\s*[·.,/]\s*2\s*[·.,/]\s*3\s*사업부|3개\s*사업부\s*(모두|전부|전체|공통)|전사\s*공통|공통\s*지시/.test(
      t
    )
  ) {
    return "ALL";
  }

  // 3. Respect active remote button mode if selected (ALL, TOM, KFG, KFK)
  if (fallbackDiv && DIVISIONS[fallbackDiv]) {
    return fallbackDiv;
  }

  // 4. Domain / division keyword fallback
  if (t.includes("kidsfit.co.kr") || t.includes("사업아이템") || t.includes("3사업")) {
    return "KFK";
  }
  if (t.includes("kisfitglobal.com") || t.includes("kidsfitglobal.com") || t.includes("키즈핏 영문") || t.includes("2사업")) {
    return "KFG";
  }
  return "TOM";
}

function enqueueTask(task, botToken) {
  task.botToken = botToken;
  taskQueue.push(task);
  if (currentTask) {
    sendHqMessage(
      `⏳ <b>[대기열 등록 완료 — 동시 실행 방지]</b>\n` +
        `• 현재 실행 중: <b>${currentTask.title}</b>\n` +
        `• 대기 등록됨 (#${taskQueue.length}): <b>${task.title}</b>\n` +
        `<i>컴퓨터 과부하 방지를 위해 앞 작업이 끝나는 즉시 순서대로 자동 실행됩니다.</i>`,
      false,
      botToken
    );
    return;
  }
  processNextTask();
}

async function processNextTask() {
  if (currentTask || taskQueue.length === 0) return;
  currentTask = taskQueue.shift();

  await sendHqMessage(
    `🚦 <b>[본사 순차 실행 시작 (1/1 단독 가동)]</b>\n` +
      `• <b>사업부</b>: ${currentTask.division.name}\n` +
      `• <b>작업 내용</b>: ${currentTask.title}\n` +
      `• <b>남은 대기열</b>: ${taskQueue.length}건`,
    false,
    currentTask.botToken
  );

  try {
    await currentTask.run();
  } catch (err) {
    await sendHqMessage(`⚠️ <b>[작업 오류]</b> ${currentTask.title}: ${err.message}`, true, currentTask.botToken);
  } finally {
    currentTask = null;
    if (taskQueue.length > 0) {
      setTimeout(processNextTask, 2500);
    }
  }
}

function runNodeScriptAsync(scriptPath, args = [], cwd = DIVISIONS.TOM.cwd) {
  return new Promise((resolve) => {
    const proc = spawn("node", [scriptPath, ...args], { cwd, encoding: "utf8" });
    let out = "";
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (out += d.toString()));
    proc.on("close", (code) => resolve({ code, output: out.slice(-800) }));
    proc.on("error", (err) => resolve({ code: 1, output: err.message }));
  });
}

function runPythonScriptAsync(scriptPath, args = [], cwd = DIVISIONS.TOM.cwd) {
  return new Promise((resolve) => {
    const proc = spawn("python", [scriptPath, ...args], { cwd, encoding: "utf8" });
    let out = "";
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (out += d.toString()));
    proc.on("close", (code) => resolve({ code, output: out.slice(-800) }));
    proc.on("error", (err) => resolve({ code: 1, output: err.message }));
  });
}

function buildAntigravityPromptText(div, promptText) {
  const agentList = (div.multiAgents || []).map((a, i) => `   - Subagent #${i + 1}: ${a}`).join("\n");
  const commonData = loadCommonDirectives();
  const standingRules = (commonData.standingDirectives || [])
    .map((d, idx) => `   ${idx + 1}. [${d.title || `공통수칙 #${idx + 1}`}] ${d.rule}`)
    .join("\n");

  if (div.code === "ALL") {
    return [
      `[UNIFIED AI COMPANY · 🏛️ 전 사업부 공통 지시사항 (1·2·3사업부 일괄 총괄) — ${div.managerTitle}]`,
      `전담 텔레그램 봇: ${div.botHandle} (드림컴퍼니 본사 총괄 지휘 채널)`,
      `텔레그램 원격 전용 채널 ID: ${MASTER_CONVERSATION_ID} (PC 작업 전용 채널 ${PC_DIRECT_CONVERSATION_ID} 간섭 절대 금지)`,
      `산하 지휘 대상 3대 사업부:`,
      `   - 1사업부 (TOM): D:\\드림컴퍼니\\1사업부 (https://truthofmarket.com · @RigjtsideAlphabot)`,
      `   - 2사업부 (KFG): D:\\드림컴퍼니\\2사업부 (https://kisfitglobal.com · @kidsfittbot)`,
      `   - 3사업부 (KFK): D:\\드림컴퍼니\\3사업부 (https://kidsfit.co.kr · @Moneyfiityyy_bot)`,
      ``,
      `📌 [전 사업부 공통 지시사항 (HQ Standing Common Directives — 전 사업부 필수 준수)]:`,
      standingRules,
      ``,
      `사장님이 텔레그램(${div.botHandle})을 통해 [전 사업부 공통 지시사항]으로 다음 작업을 하달하셨습니다:`,
      `"${promptText}"`,
      ``,
      `총괄 실행 원칙:`,
      `1. 통합 본사 폴더(D:\\드림컴퍼니)에서 1사업부(D:\\드림컴퍼니\\1사업부), 2사업부(D:\\드림컴퍼니\\2사업부), 3사업부(D:\\드림컴퍼니\\3사업부) 전체에 사장님의 공통 지시사항을 빠짐없이 순차 적용·점검하세요.`,
      `2. 만약 사장님의 지시가 앞으로도 계속 지켜야 할 전사 공통 수칙이라면 D:\\드림컴퍼니\\data\\hq_common_directives.json 및 GEMINI.md 에도 반영하세요.`,
      `3. 전 사업부 적용 및 검증이 완료되면 반드시 아래 명령어를 실행하여 본사 총괄 봇(@SemifearGreedbot)으로 결과를 보고하세요:`,
      `   node "${BRIDGE_SCRIPT_PATH}" --div HQ --notify "[전 사업부 공통 지시 완료] <1·2·3사업부 수행 요약>"`,
    ].join("\n");
  }

  return [
    `[UNIFIED AI COMPANY · ${div.managerTitle} — ${div.name}]`,
    `전담 텔레그램 봇: ${div.botHandle} (타 사업부 봇과 충돌 0% 독립 채널)`,
    `텔레그램 원격 전용 채널 ID: ${MASTER_CONVERSATION_ID} (PC 작업 전용 채널 ${PC_DIRECT_CONVERSATION_ID} 간섭 절대 금지)`,
    `산하 전문 멀티에이전트 편제:`,
    agentList,
    ``,
    `📌 [전 사업부 공통 지시사항 (HQ Standing Common Directives — 전 사업부 필수 준수)]:`,
    standingRules,
    ``,
    `사장님이 외부에서 텔레그램(${div.botHandle})으로 다음 작업을 지시하셨습니다:`,
    `"${promptText}"`,
    ``,
    `운영 원칙:`,
    `1. 현재 사업부 작업 폴더(${div.cwd})에서 위 [전 사업부 공통 지시사항]을 엄격히 준수하며 산하 멀티에이전트를 지휘하여 단독 실행하세요.`,
    `2. 작업이 완료되면 반드시 아래 명령어를 실행하여 해당 사업부 전용 텔레그램 봇(${div.botHandle})으로 완료 결과를 답장하세요:`,
    `   node "${BRIDGE_SCRIPT_PATH}" --div ${div.code} --notify "[${div.name} 완료] <수행한 작업 요약>"`,
  ].join("\n");
}

function dispatchAntigravityPrompt(div, promptText) {
  return new Promise((resolve) => {
    const binPath = fs.existsSync(LANGUAGE_SERVER_EXE) ? LANGUAGE_SERVER_EXE : AGENTAPI_BAT;
    const useDirect = fs.existsSync(LANGUAGE_SERVER_EXE);
    const fullPrompt = buildAntigravityPromptText(div, promptText);
    const targetConvId = resolveSafeTelegramConversationId(div.conversationId);

    const sendArgs = useDirect
      ? ["agentapi", "send-message", `--title=HQ Remote (${div.code})`, targetConvId, fullPrompt]
      : ["send-message", `--title=HQ Remote (${div.code})`, targetConvId, fullPrompt];

    const res = spawnSync(binPath, sendArgs, {
      cwd: div.cwd,
      encoding: "utf8",
      timeout: 30000,
      shell: !useDirect,
    });
    resolve({ ok: res.status === 0, conversationId: targetConvId, stdout: res.stdout, stderr: res.stderr });
  });
}

// ---------------------------------------------------------------------------
// COMMAND HANDLERS
// ---------------------------------------------------------------------------
async function handleCommand(rawText, state, botToken = null, opts = {}) {
  const text = (rawText || "").trim();
  if (!text) return;

  // Only bind division automatically from botToken when the user explicitly messaged/mentioned a bot (not on random group race or callback buttons)
  const explicitBotBoundDiv = opts.explicitDiv || (!opts.isGroup && !opts.isCallback ? resolveDivisionByBotToken(botToken, true) : null);
  if (explicitBotBoundDiv && DIVISIONS[explicitBotBoundDiv]) {
    state.activeDivision = explicitBotBoundDiv;
    saveState(state);
  }

  if (text === "/start" || text === "/help" || text === "도움말" || text === "메뉴" || text === "연결") {
    const activeDiv = DIVISIONS[explicitBotBoundDiv || state.activeDivision] || DIVISIONS.ALL;
    const isDedicatedDivBot = Boolean(explicitBotBoundDiv && explicitBotBoundDiv !== "ALL");
    await sendHqMessage(
      (isDedicatedDivBot
        ? `🟢 <b>[${activeDiv.name} 전용 텔레그램 지휘소 (${activeDiv.botHandle})]</b>\n`
        : `🏛️ <b>[본사 총괄 매니저 지휘소 (@SemifearGreedbot) — 멀티에이전트 통합 회사]</b>\n`) +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `• 🎯 <b>현재 지휘 모드</b>: <b>${activeDiv.name}</b>\n` +
        `• 👤 <b>담당 부문장</b>: <b>${activeDiv.managerTitle}</b>\n` +
        `• 📱 <b>텔레그램 전용 대화창</b>: <code>${MASTER_CONVERSATION_ID}</code> (전담 가동)\n` +
        `• 💻 <b>컴퓨터(PC) 작업 대화창</b>: <code>${PC_DIRECT_CONVERSATION_ID}</code> (독립 분리)\n\n` +
        `<b>[봇별 겹침 없는 1:1 전담 배정 현황]</b>\n` +
        `👑 <b>본사 총괄 &amp; 전 사업부 공통</b>: <code>@SemifearGreedbot</code> (전 사업부 공통 지시·실결제 감시·새벽 R&amp;D)\n` +
        `1️⃣ <b>1사업부 전용 봇</b>: <code>@RigjtsideAlphabot</code> → <code>truthofmarket.com</code>\n` +
        `2️⃣ <b>2사업부 전용 봇</b>: <code>@kidsfittbot</code> → <code>kisfitglobal.com</code>\n` +
        `3️⃣ <b>3사업부 전용 봇</b>: <code>@Moneyfiityyy_bot</code> → <code>kidsfit.co.kr</code>\n\n` +
        `<b>[현재 모드 산하 멀티에이전트]</b>\n` +
        (activeDiv.multiAgents || []).map((a) => `• <code>${a}</code>`).join("\n") +
        `\n━━━━━━━━━━━━━━━━━━━━\n` +
        `👇 <b>[🏛️ 전 사업부 공통 지시 모드]</b>를 누르거나 <code>[공통] 지시내용</code>을 보내시면 1·2·3사업부 전체에 일괄 적용됩니다!`,
      true,
      botToken
    );
    return;
  }

  // ─── 전 사업부 공통 지시사항 보드 조회 및 영구 수칙 추가/삭제 핸들러 ─────────────────
  if (
    text === "/directives" ||
    text === "/common" ||
    text === "/공통" ||
    text === "공통지시사항" ||
    text === "공통지시목록" ||
    text === "공통수칙" ||
    text === "전사업부공통"
  ) {
    await sendHqMessage(formatCommonDirectivesBoard(state), true, SEMI_BOT_TOKEN || botToken);
    return;
  }

  if (/^(\/공통추가|\/add_common|\/add_directive|공통등록\s*:?|공통추가\s*:?|공통수칙추가\s*:?)\s+(.+)$/is.test(text)) {
    const match = text.match(/^(\/공통추가|\/add_common|\/add_directive|공통등록\s*:?|공통추가\s*:?|공통수칙추가\s*:?)\s+(.+)$/is);
    const newRule = (match && match[2] ? match[2] : "").trim();
    if (newRule) {
      const updated = addStandingDirective(newRule);
      const addedItem = updated.standingDirectives[updated.standingDirectives.length - 1];
      await sendHqMessage(
        `✅ <b>[전 사업부 영구 공통 지시사항 등록 완료 (#${addedItem.id})]</b>\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `• <b>신규 등록 수칙</b>: "${addedItem.rule}"\n` +
          `• <b>적용 범위</b>: 1사업부(<code>truthofmarket.com</code>) · 2사업부(<code>kisfitglobal.com</code>) · 3사업부(<code>kidsfit.co.kr</code>) 전 에이전트 프롬프트에 즉시 영구 주입 완료!\n\n` +
          formatCommonDirectivesBoard(state),
        true,
        SEMI_BOT_TOKEN || botToken
      );
      return;
    }
  }

  if (/^(\/공통삭제|\/del_common|\/del_directive|공통삭제|공통제거)\s+(\d+)$/i.test(text)) {
    const match = text.match(/^(\/공통삭제|\/del_common|\/del_directive|공통삭제|공통제거)\s+(\d+)$/i);
    const targetNum = Number(match[2]);
    const res = removeStandingDirective(targetNum);
    if (res.ok) {
      await sendHqMessage(
        `🗑️ <b>[전 사업부 영구 공통 지시사항 #${targetNum} 삭제 완료]</b>\n` +
          `• <b>삭제된 수칙</b>: "${res.removed.rule}"\n\n` +
          formatCommonDirectivesBoard(state),
        true,
        SEMI_BOT_TOKEN || botToken
      );
    } else {
      await sendHqMessage(
        `⚠️ <b>[삭제 실패]</b> 번호 <code>#${targetNum}</code>에 해당하는 공통 지시사항이 없습니다.\n\n` +
          formatCommonDirectivesBoard(state),
        true,
        SEMI_BOT_TOKEN || botToken
      );
    }
    return;
  }

  if (text === "/company" || text === "/agents" || text === "조직도" || text === "회사" || text === "멀티에이전트") {
    await sendHqMessage(
      `🏛️ <b>[KIDS-FIT &amp; TruthOfMarket — 총괄 매니저 산하 무토큰(0-Token) 로컬 엔진 &amp; 조직도]</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👑 <b>본사 총괄 매니저 (HQ Chief Manager · @SemifearGreedbot)</b>\n` +
        `   ├ <code>HQ-Common-Directive-Controller</code>: 전 사업부 공통 지시사항 등록·강제 주입 및 1·2·3사업부 일괄 지휘\n` +
        `   ├ <code>HQ-CrossAudit-Healer</code>: 매시간 1·2·3사업부 상호 교차검열 &amp; 무결점 자동수리 (<b>안티그래비티 토큰 0</b>)\n` +
        `   └ <code>HQ-Channel-Isolator</code>: 텔레그램 전용(<code>${MASTER_CONVERSATION_ID}</code>) vs PC 전용(<code>${PC_DIRECT_CONVERSATION_ID}</code>) 완벽 분리\n\n` +
        `📈 <b>1사업부 부문장 (@RigjtsideAlphabot · truthofmarket.com)</b>\n` +
        DIVISIONS.TOM.multiAgents.map((a) => `   ├ ${a}`).join("\n") +
        `\n\n🌍 <b>2사업부 부문장 (@kidsfittbot · kisfitglobal.com)</b>\n` +
        DIVISIONS.KFG.multiAgents.map((a) => `   ├ ${a}`).join("\n") +
        `\n\n🇰🇷 <b>3사업부 부문장 (@Moneyfiityyy_bot · kidsfit.co.kr)</b>\n` +
        DIVISIONS.KFK.multiAgents.map((a) => `   ├ ${a}`).join("\n") +
        `\n━━━━━━━━━━━━━━━━━━━━\n` +
        `✅ <b>운영 원칙</b>: 24시간 홍보·검열·종가동기화는 <b>안티그래비티 토큰 0%</b> 로컬 스크립트로만 구동!`,
      true,
      botToken
    );
    return;
  }

  if (
    text === "/night" ||
    text === "/rnd" ||
    text === "/token" ||
    text === "토큰" ||
    text === "리밋" ||
    text === "토큰절약" ||
    text === "새벽연구" ||
    text === "야간연구"
  ) {
    enqueueTask(
      {
        division: DIVISIONS.TOM,
        title: "본사 총괄 매니저 — 안티그래비티 주간 리밋(Weekly Quota) 보호 & 무토큰(0 Token) 로컬 엔진 현황 보고",
        run: async () => {
          await runPythonScriptAsync("scripts/hq_dawn_high_token_rnd_engine.py", ["--notify"], DIVISIONS.TOM.cwd);
        },
      },
      botToken || PRIMARY_BOT_TOKEN
    );
    return;
  }

  if (
    text === "/mode_all" ||
    text === "/mode_common" ||
    text === "공통모드" ||
    text === "전사업부모드" ||
    text === "/mode_tom" ||
    text === "/mode_kfg" ||
    text === "/mode_kfk"
  ) {
    const map = {
      "/mode_all": "ALL",
      "/mode_common": "ALL",
      공통모드: "ALL",
      전사업부모드: "ALL",
      "/mode_tom": "TOM",
      "/mode_kfg": "KFG",
      "/mode_kfk": "KFK",
    };
    state.activeDivision = map[text] || "ALL";
    saveState(state);
    const d = DIVISIONS[state.activeDivision];
    if (d.code === "ALL") {
      const commonData = loadCommonDirectives();
      await sendHqMessage(
        `🏛️ <b>[전 사업부 공통 지시 모드 활성화 (@SemifearGreedbot)]</b>\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `• <b>지휘 범위</b>: <b>1사업부(truthofmarket.com) + 2사업부(kisfitglobal.com) + 3사업부(kidsfit.co.kr) 전체</b>\n` +
          `• <b>통합 경로</b>: <code>${d.cwd}</code>\n` +
          `• <b>텔레그램 전용 채널</b>: <code>${MASTER_CONVERSATION_ID}</code> (PC 채널 <code>${PC_DIRECT_CONVERSATION_ID}</code> 분리 보호)\n` +
          `• <b>적용 중인 영구 공통 수칙</b>: <b>${(commonData.standingDirectives || []).length}건</b>\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `👇 이제 채팅창에 입력하시는 모든 지시사항은 <b>1·2·3사업부 전체 공통 지시사항</b>으로 접수되어 전 사업부에 일괄 반영됩니다!\n` +
          `<i>(영구 수칙으로 추가하려면 <code>공통등록: 내용</code>, 수칙 목록 보기는 <b>[📌 전 사업부 공통 지시사항]</b> 클릭)</i>`,
        true,
        SEMI_BOT_TOKEN || botToken
      );
      return;
    }
    await sendHqMessage(
      `✅ <b>현재 원격 지시 대상이 [${d.name}]으로 전환되었습니다.</b>\n` +
        `• <b>대상 도메인</b>: <b>${d.domain}</b> (<code>${d.cwd}</code>)\n` +
        `• <b>텔레그램 전용 대화창</b>: <code>${MASTER_CONVERSATION_ID}</code> (전 사업부 공통 수칙 자동 적용)\n` +
        `이제 채팅창에 입력하시는 지시는 해당 사업부 전담 멀티에이전트로 전달됩니다.`,
      true,
      d.botToken || botToken
    );
    return;
  }

  if (text === "/report" || text === "/all" || text === "전체보고" || text === "보고" || text === "일제보고") {
    await sendDivisionReportsAll(state);
    return;
  }

  if (text === "/1on1" || text === "1대1" || text === "개인톡") {
    state.groupChatId = null;
    saveState(state);
    await sendHqMessage(
      `✅ <b>[1:1 개인 대화방 모드로 전환 완료]</b>\n이제 본사 및 1·2·3사업부 봇들이 사장님 개인 텔레그램(<code>${CHAT_ID}</code>)으로 보고합니다.`,
      true,
      botToken,
      CHAT_ID
    );
    return;
  }

  if (text === "/status" || text === "상태") {
    await sendDivisionReportsAll(state);
    return;
  }

  if (text === "/visitors" || text === "방문자" || text === "/stats" || text === "방문현황") {
    const { runVisitorBriefing } = require("./hq_all_divisions_visitor_briefing");
    await runVisitorBriefing({ sendTelegram: true, force: true });
    return;
  }

  if (text === "/schedule24" || text === "스케줄" || text === "24시간") {
    enqueueTask(
      {
        division: DIVISIONS.TOM,
        title: "24시간 1·2·3사업부 1시간 단위 순환 교대근무 실행 및 전체 스케줄표 브리핑",
        run: async () => {
          await runPythonScriptAsync("scripts/hq_24h_hourly_scheduler.py", ["--table", "--notify"], DIVISIONS.TOM.cwd);
        },
      },
      botToken
    );
    return;
  }

  if (text === "/rl" || text === "모니터링" || text === "유튜브" || text === "인스타") {
    enqueueTask(
      {
        division: DIVISIONS.TOM,
        title: "전사업부(1·2·3사업부) 유튜브 쇼츠·인스타 릴스·방문수·결제전환 실시간 모니터링 (강화학습 보류)",
        run: async () => {
          await runPythonScriptAsync("scripts/hq_dawn_rl_self_improver.py", ["--notify"], DIVISIONS.TOM.cwd);
        },
      },
      botToken
    );
    return;
  }

  if (text === "/tom_news" || text === "뉴스") {
    enqueueTask(
      {
        division: DIVISIONS.TOM,
        title: "TruthOfMarket 미국장 종가 동기화 + 정적번들(dist) 빌드·라이브 배포 + VIP 채널 발송",
        run: async () => {
          const res = await runPythonScriptAsync("scripts/run_daily_market_close_sync.py", ["--broadcast"], DIVISIONS.TOM.cwd);
          await sendHqMessage(
            `✅ <b>[1사업부 TruthOfMarket 일일 종가 동기화 &amp; 배포 완료]</b>\n` +
              `• 최신 미국장 72종목 &amp; $SMH/$XLV 종가 동기화 + 정적번들(dist) 빌드 + 라이브 배포 완료\n` +
              `• 유료 VIP 전용 채널로 <b>$SMH·$XLV 및 주요 종목 실시간 월가 뉴스 + 타점 오더북</b> 발송 및 상단 고정 완료!\n` +
              `<code>${res.output.trim().slice(-320)}</code>`,
            true,
            botToken
          );
        },
      },
      botToken
    );
    return;
  }

  if (text === "/flow_tom" || text === "/flow_kfg" || text === "/flow_kfk") {
    const map = { "/flow_tom": "TOM", "/flow_kfg": "KFG", "/flow_kfk": "KFK" };
    const div = DIVISIONS[map[text]];
    enqueueTask(
      {
        division: div,
        title: `${div.name} — 오늘의 Flow 유튜브 쇼츠(_YT_Shorts) & 인스타 릴스(_IG_Reels) 2종 발송`,
        run: async () => {
          let res;
          if (div.code === "TOM") {
            res = await runPythonScriptAsync("daily_6am_shorts_sender.py", [], DIVISIONS.TOM.cwd);
          } else if (div.code === "KFG") {
            res = await runNodeScriptAsync("scripts/send_daily_6am_shorts_reels.js", [], DIVISIONS.KFG.cwd);
          } else {
            res = await runNodeScriptAsync("scripts/send_daily_6am_shorts_telegram.js", [], DIVISIONS.KFK.cwd);
          }
          await sendHqMessage(
            `🎬 <b>[${div.name}] Flow 쇼츠·릴스 2종(YT/IG) 발송 완료!</b>\n` +
              `• 대상 도메인: ${div.domain}\n` +
              `• 결과: <code>${(res.output || "발송 완료").trim().slice(-240)}</code>`,
            true,
            botToken
          );
        },
      },
      botToken
    );
    return;
  }

  if (text === "/ls" || text === "/lemonsqueezy" || text === "레몬스퀴지") {
    await checkLemonSqueezyLiveStatus(state, true, botToken);
    return;
  }

  if (text === "/naver" || text === "네이버자동" || text === "블로그발행") {
    enqueueTask(
      {
        division: DIVISIONS.KFK,
        title: "3사업부(kidsfit.co.kr) — 네이버 블로그 학술 칼럼 발행 & 지식iN 자동 답변",
        run: async () => {
          const res = await runPythonScriptAsync("scripts/naver_cdp_live_runner.py", ["--all"], DIVISIONS.KFK.cwd);
          await sendHqMessage(
            `📝 <b>[3사업부 네이버 블로그 &amp; 지식iN 자동 수행 완료!]</b>\n` +
              `<code>${(res.output || "완료").trim().slice(-350)}</code>`,
            true,
            botToken
          );
        },
      },
      botToken
    );
    return;
  }

  if (/^(인증\s*[A-Za-z0-9]{4,6}|[A-Za-z0-9]{5})$/.test(text)) {
    const cleanCode = text.replace(/^인증\s*/, "").trim().toUpperCase();
    enqueueTask(
      {
        division: DIVISIONS.KFK,
        title: `3사업부(kidsfit.co.kr) — 네이버 서치어드바이저 소유확인 보안문자(${cleanCode}) 제출 & 사이트맵/RSS 등록`,
        run: async () => {
          await runPythonScriptAsync("scripts/naver_search_advisor_helper.py", ["--submit-code", cleanCode], DIVISIONS.KFK.cwd);
        },
      },
      botToken
    );
    return;
  }

  if (text === "/audit" || text === "검열" || text === "교차검열" || text === "전체점검" || text === "점검") {
    enqueueTask(
      {
        division: DIVISIONS.TOM,
        title: "전 사업부(1·2·3사업부) 16개 전환·결제 퍼널 상호 교차검열 및 자동수리 (안티그래비티 토큰 0)",
        run: async () => {
          const res = await runPythonScriptAsync("scripts/hq_hourly_cross_audit_healer.py", [], DIVISIONS.TOM.cwd);
          await sendHqMessage(
            `🛡️ <b>[전 사업부 무토큰(0 Token) 로컬 교차검열 &amp; 자동수리 완료]</b>\n` +
              `<code>${(res.output || "16/16 정상").trim().slice(-400)}</code>`,
            true,
            botToken || PRIMARY_BOT_TOKEN
          );
        },
      },
      botToken || PRIMARY_BOT_TOKEN
    );
    return;
  }

  // ─── 3대 핵심 결재 안건 콜백 핸들러 (R1 / R4) ───────────────────────────
  if (text.startsWith("/approve_agenda")) {
    const decisionLogPath = path.join(DATA_DIR, "ceo_agendas_decision.json");
    let currentDecisions = {};
    try {
      if (fs.existsSync(decisionLogPath)) {
        currentDecisions = JSON.parse(fs.readFileSync(decisionLogPath, "utf8"));
      }
    } catch (_) {}

    const nowIso = new Date().toISOString();
    let replyMsg = "";

    if (text === "/approve_agenda1_optA") {
      currentDecisions["agenda1"] = {
        choice: "A",
        title: "3사업부 kidsfit.co.kr 무인 자동 유지 + getbreakai.com 신규 프로젝트 전면 전환",
        decidedAt: nowIso,
        status: "APPROVED",
      };
      replyMsg = `✅ <b>[대표 결재 승인 완료 — 안건 1호]</b>\n` +
        `• <b>선택안</b>: <b>선택지 A (getbreakai.com 신규 전환 + kidsfit.co.kr 무인 유지)</b>\n` +
        `• <b>집행 조치</b>: kidsfit.co.kr은 추가 리소스 0 무인 상태로 유지하고, 에이전트 인프라를 getbreakai.com 글로벌 퀀트 SaaS 인프라 세팅으로 즉시 전환합니다!`;
    } else if (text === "/approve_agenda1_optB") {
      currentDecisions["agenda1"] = {
        choice: "B",
        title: "3사업부 kidsfit.co.kr 자체 유료화 수익 모델 전면 개편",
        decidedAt: nowIso,
        status: "APPROVED",
      };
      replyMsg = `✅ <b>[대표 결재 승인 완료 — 안건 1호]</b>\n` +
        `• <b>선택안</b>: <b>선택지 B (kidsfit.co.kr 자체 유료화 개편)</b>\n` +
        `• <b>집행 조치</b>: kidsfit.co.kr K-DST 정밀 성장진단서 및 월간 패스 유료 결제 모듈 세팅에 착수합니다!`;
    } else if (text === "/approve_agenda2_optA") {
      currentDecisions["agenda2"] = {
        choice: "A",
        title: "Google Flow(Veo) 병행 하이브리드 영상 파이프라인 채택",
        decidedAt: nowIso,
        status: "APPROVED",
      };
      replyMsg = `✅ <b>[대표 결재 승인 완료 — 안건 2호]</b>\n` +
        `• <b>선택안</b>: <b>선택지 A (Flow 병행 최고 화질 3D 모션)</b>\n` +
        `• <b>집행 조치</b>: 에이전트가 극실사 프롬프트/스틸컷을 대기시키고 후반 마스터링을 전담합니다!`;
    } else if (text === "/approve_agenda2_optB") {
      currentDecisions["agenda2"] = {
        choice: "B",
        title: "토큰 맥싱 기반 100% 완전 자동 무인 실사급 영상 파이프라인 채택",
        decidedAt: nowIso,
        status: "APPROVED",
      };
      replyMsg = `✅ <b>[대표 결재 승인 완료 — 안건 2호]</b>\n` +
        `• <b>선택안</b>: <b>선택지 B (100% 완전 자동 무인 실사급 영상)</b>\n` +
        `• <b>집행 조치</b>: 사람 개입 0%로 심야 시간대에 매일 3편의 완성 영상을 완전 자동 렌더링하여 아침 텔레그램으로 배달합니다!`;
    } else if (text === "/approve_agenda3_optA") {
      currentDecisions["agenda3"] = {
        choice: "A",
        title: "대규모 리서치 & 지식자산 확장 올인형 파이프라인 채택",
        decidedAt: nowIso,
        status: "APPROVED",
      };
      replyMsg = `✅ <b>[대표 결재 승인 완료 — 안건 3호]</b>\n` +
        `• <b>선택안</b>: <b>선택지 A (대규모 리서치 & 지식자산 올인)</b>\n` +
        `• <b>집행 조치</b>: 심야 시간대에 Seeking Alpha급 리포트 및 의학 논문 분석 대규모 집필을 풀가동합니다!`;
    } else if (text === "/approve_agenda3_optB") {
      currentDecisions["agenda3"] = {
        choice: "B",
        title: "숏폼 영상 & 미디어 팩토리 올인형 파이프라인 채택",
        decidedAt: nowIso,
        status: "APPROVED",
      };
      replyMsg = `✅ <b>[대표 결재 승인 완료 — 안건 3호]</b>\n` +
        `• <b>선택안</b>: <b>선택지 B (숏폼 영상 팩토리 올인)</b>\n` +
        `• <b>집행 조치</b>: 심야 시간대에 3개 사업부 숏폼 영상 및 카드뉴스를 대량 마스터링합니다!`;
    } else if (text === "/approve_agenda3_optC") {
      currentDecisions["agenda3"] = {
        choice: "C",
        title: "올인원 균형 풀가동형 (리서치+영상+SEO+종가) 파이프라인 채택",
        decidedAt: nowIso,
        status: "APPROVED",
      };
      replyMsg = `✅ <b>[대표 결재 승인 완료 — 안건 3호]</b>\n` +
        `• <b>선택안</b>: <b>선택지 C (올인원 균형 풀가동 통합 파이프라인 - 추천안)</b>\n` +
        `• <b>집행 조치</b>: 심야 00:00~06:30 리서치, 숏폼 영상 3편 렌더링, SEO 색인 푸시, 종가 동기화 후 06:30 아침에 완제품 배달 체제로 가동합니다!`;
    }

    try {
      fs.writeFileSync(decisionLogPath, JSON.stringify(currentDecisions, null, 2), "utf8");
    } catch (_) {}

    if (replyMsg) {
      await sendHqMessage(replyMsg, true, botToken || PRIMARY_BOT_TOKEN);
      return;
    }
  }

  if (state.lastDispatchedText === text && Date.now() - (state.lastDispatchedAt || 0) < 60000) {
    console.log(`[Bridge] Deduplicated identical prompt within 60s: "${text}"`);
    return;
  }
  state.lastDispatchedText = text;
  state.lastDispatchedAt = Date.now();

  const targetCode = detectDivisionFromText(text, explicitBotBoundDiv || state.activeDivision);
  const targetDiv = DIVISIONS[targetCode] || DIVISIONS.ALL;
  const replyBotToken = targetDiv.botToken || botToken || PRIMARY_BOT_TOKEN;
  state.activeDivision = targetCode;
  saveState(state);

  if (targetCode === "ALL") {
    recordCommonOrder(text, "DISPATCHED");
    // If prefixed with 공통지시: or 공통규칙:, also persist as a standing directive automatically
    if (/^(공통\s*지시|공통지시사항|공통\s*규칙|공통\s*수칙)\s*:/i.test(text)) {
      const ruleBody = text.replace(/^(공통\s*지시|공통지시사항|공통\s*규칙|공통\s*수칙)\s*:\s*/i, "").trim();
      if (ruleBody) addStandingDirective(ruleBody);
    }
  }

  enqueueTask(
    {
      division: targetDiv,
      title: `${targetDiv.name} 원격 지시: "${text.slice(0, 40)}"`,
      run: async () => {
        const r = await dispatchAntigravityPrompt(targetDiv, text);
        await sendHqMessage(
          (targetCode === "ALL"
            ? `🏛️ <b>[전 사업부 공통 지시사항 접수 &amp; 1·2·3사업부 일괄 가동 (@SemifearGreedbot)]</b>\n`
            : `✅ <b>[${targetDiv.name}] 전담 봇(${targetDiv.botHandle}) 작업 접수 &amp; 멀티에이전트 풀가동</b>\n`) +
            `• <b>지시 내용</b>: "${text}"\n` +
            `• <b>담당 부문장</b>: ${targetDiv.managerTitle}\n` +
            `• <b>텔레그램 전용 대화창</b>: <code>${MASTER_CONVERSATION_ID}</code> (PC 채널 분리됨)` +
            getLiveTokenTelemetryBanner(),
          true,
          replyBotToken
        );
      },
    },
    replyBotToken
  );
}

function checkDailyStaggeredSchedule(state) {
  const now = new Date();
  const ymd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  if (!state.lastAutoRunDate) state.lastAutoRunDate = {};
  // [DEPRECATED & SEVERED per R1 / Worker M1]:
  // 매시간 00분 정각 스팸 회전 루틴(hq_24h_hourly_scheduler.py) 전면 영구 중단.
  // 텔레그램 알림 공해(하루 96회 발송) 방지 및 무인 심야 토큰 맥싱 파이프라인으로 전면 이관.
  // Windows 작업 스케줄러(HQ_24H_Hourly_Rotation)와 함께 내부 타이머도 완전히 차단되었습니다.


  // 새벽 04:00: 실시간 안티그래비티 잔여 쿼터를 계측하여 평상시 안전마진 제외 가용 최대치(Smart Max-Pace)로 R&D 가동
  if (hhmm >= "04:00" && hhmm < "04:30" && state.lastAutoRunDate.DAWN_HIGH_TOKEN_RND !== ymd) {
    state.lastAutoRunDate.DAWN_HIGH_TOKEN_RND = ymd;
    saveState(state);
    handleCommand("/night", state, PRIMARY_BOT_TOKEN);
  }

  if (false && hhmm >= "05:00" && hhmm < "05:30" && state.lastAutoRunDate.DAWN_RL !== ymd) {
    state.lastAutoRunDate.DAWN_RL = ymd;
    saveState(state);
    handleCommand("/rl", state);
  }
  // 전 사업부(1·2·3사업부) 일일 영상 06:00 KST 발송 (지터 방지: 06:00 ~ 06:30 가드 윈도우 & 일일 1회 래칭)
  if (hhmm >= "06:00" && hhmm < "06:30" && state.lastAutoRunDate.DAILY_6AM_VIDEOS !== ymd) {
    state.lastAutoRunDate.DAILY_6AM_VIDEOS = ymd;
    state.lastAutoRunDate.FLOW_TOM = ymd;
    state.lastAutoRunDate.FLOW_KFG = ymd;
    state.lastAutoRunDate.FLOW_KFK = ymd;
    saveState(state);
    const commuteScript = path.resolve(HQ_ROOT_DIR, "scripts", "deliver_episode_8_commute.py");
    if (fs.existsSync(commuteScript)) {
      enqueueTask(
        {
          division: DIVISIONS.TOM,
          title: "전 사업부(1·2·3사업부) 8화 출근시간 06:00 모바일 최적화 일괄 발송",
          run: async () => {
            await runPythonScriptAsync("scripts/deliver_episode_8_commute.py", ["--send"], HQ_ROOT_DIR);
          },
        },
        PRIMARY_BOT_TOKEN
      );
    } else {
      handleCommand("/flow_tom", state, DIVISIONS.TOM.botToken);
      handleCommand("/flow_kfg", state, DIVISIONS.KFG.botToken);
      handleCommand("/flow_kfk", state, DIVISIONS.KFK.botToken);
    }
  }
  if (hhmm >= "06:30" && state.lastAutoRunDate.TOM !== ymd) {
    state.lastAutoRunDate.TOM = ymd;
    saveState(state);
    handleCommand("/tom_news", state, DIVISIONS.TOM.botToken);
  }
  if (hhmm >= "07:30" && state.lastAutoRunDate.TOM_CLOSE_VERIFY !== ymd) {
    state.lastAutoRunDate.TOM_CLOSE_VERIFY = ymd;
    saveState(state);
    enqueueTask(
      {
        division: DIVISIONS.TOM,
        title: "TruthOfMarket 미국장 최종 정산 종가 재검증 및 정적번들 자동 배포",
        run: async () => {
          await runPythonScriptAsync("scripts/run_daily_market_close_sync.py", [], DIVISIONS.TOM.cwd);
        },
      },
      DIVISIONS.TOM.botToken
    );
  }
  if (hhmm === "08:30" && state.lastAutoRunDate.VISITOR_AM !== ymd) {
    state.lastAutoRunDate.VISITOR_AM = ymd;
    saveState(state);
    handleCommand("/visitors", state);
  }
  if (hhmm === "21:00" && state.lastAutoRunDate.VISITOR_PM !== ymd) {
    state.lastAutoRunDate.VISITOR_PM = ymd;
    saveState(state);
    handleCommand("/visitors", state);
  }
  checkLemonSqueezyLiveStatus(state).catch(() => {});
}

let lastLsPollMs = 0;
async function checkLemonSqueezyLiveStatus(state, forceNotify = false, botToken = null) {
  const nowMs = Date.now();
  if (!forceNotify && nowMs - lastLsPollMs < 180000) return;
  lastLsPollMs = nowMs;

  const lsKey = kfgEnv.LEMONSQUEEZY_API_KEY || tomEnv.LEMONSQUEEZY_API_KEY || "";
  if (!lsKey) return;

  const fetchJson = (url, headers = {}) =>
    new Promise((resolve) => {
      const req = https.get(url, { headers, timeout: 8000 }, (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(raw) });
          } catch (_) {
            resolve({ status: res.statusCode, raw });
          }
        });
      });
      req.on("error", () => resolve({ status: 0 }));
      req.on("timeout", () => {
        req.destroy();
        resolve({ status: 0 });
      });
    });

  const storeRes = await fetchJson("https://api.lemonsqueezy.com/v1/stores/296100", {
    Authorization: `Bearer ${lsKey}`,
    Accept: "application/vnd.api+json",
  });
  const chkRes = await fetchJson("https://truthofmarket.lemonsqueezy.com/checkout/buy/bad98d00-7175-41f6-9d58-eeb2471d0da4");

  const attr = storeRes?.data?.data?.attributes || {};
  const plan = attr.plan || "free";
  const totalSales = Number(attr.total_sales || 0);
  const totalRevenueCents = Number(attr.total_revenue || 0);
  const isCheckoutLive = chkRes.status === 200 || (plan && plan !== "free");

  if (typeof state.lsActivated === "undefined") state.lsActivated = false;
  if (typeof state.lsTotalSales === "undefined") state.lsTotalSales = 0;

  if (isCheckoutLive && !state.lsActivated) {
    state.lsActivated = true;
    saveState(state);
    await sendHqMessage(
      `🎉 <b>[레몬스퀴지(Lemon Squeezy) 본심사 최종 승인 &amp; 실결제 개통 완료!]</b>\n\n` +
        `• <b>스토어</b>: KIDS-FIT Global Studio (<code>#296100</code>)\n` +
        `• <b>스토어 플랜 상태</b>: <code>${plan}</code> (체크아웃 HTTP ${chkRes.status})\n` +
        `• <b>1사업부(truthofmarket.com)</b>: Pro $29/mo · Lifetime $199 실결제 카드창 즉시 결제 가능!\n` +
        `• <b>2사업부(kisfitglobal.com)</b>: Single $8.99 · 6-Month $19.99 실결제 카드창 즉시 결제 가능!`,
      true,
      botToken
    );
  }

  if (totalSales > state.lsTotalSales) {
    const prevSales = state.lsTotalSales;
    state.lsTotalSales = totalSales;
    saveState(state);
    await sendHqMessage(
      `💰 <b>[레몬스퀴지(Lemon Squeezy) 신규 실결제 매출 발생 알림!]</b>\n\n` +
        `• <b>누적 결제 건수</b>: ${prevSales}건 ➡️ <b>${totalSales}건</b>\n` +
        `• <b>누적 결제 매출</b>: <b>$${(totalRevenueCents / 100).toFixed(2)} USD</b>\n` +
        `• <b>스토어</b>: #296100 (truthofmarket.com &amp; kisfitglobal.com)`,
      true,
      botToken
    );
  }

  if (forceNotify) {
    await sendHqMessage(
      `🍋 <b>[레몬스퀴지(Lemon Squeezy) 스토어 #296100 실시간 상태]</b>\n` +
        `• <b>온보딩 심사 상태</b>: ${isCheckoutLive ? "✅ 최종 승인 완료 (실결제 가동 중)" : "⏳ 온보딩팀 답장 검토 중 (승인 시 즉시 자동 알림 발송)"}\n` +
        `• <b>1·2사업부 체크아웃 UUID</b>: ✅ Live Mode UUID 전환 배포 완료\n` +
        `• <b>실결제 누적 건수 / 매출</b>: ${totalSales}건 / $${(totalRevenueCents / 100).toFixed(2)} USD\n` +
        `<i>※ 3분 주기로 레몬스퀴지 API 및 체크아웃 응답을 24시간 자동 감시하며, 개통 및 첫 결제 발생 즉시 텔레그램으로 알림을 보내드립니다.</i>`,
      true,
      botToken
    );
  }
}

const seenGroupMessages = new Set();

async function pollBotTokenOnce(botToken, state) {
  const botKey = botToken.split(":")[0];
  const currentOffset = state.offsets?.[botKey] || (botToken === PRIMARY_BOT_TOKEN ? state.lastUpdateId || 0 : 0);

  const res = await tgApiWithToken(
    botToken,
    "getUpdates",
    {
      offset: currentOffset + 1,
      timeout: 4,
      allowed_updates: ["message", "callback_query", "my_chat_member"],
    },
    8000
  );

  if (res && res.ok && Array.isArray(res.result) && res.result.length > 0) {
    for (const upd of res.result) {
      if (!state.offsets) state.offsets = {};
      state.offsets[botKey] = upd.update_id;
      if (botToken === PRIMARY_BOT_TOKEN) state.lastUpdateId = upd.update_id;
      saveState(state);

      if (upd.callback_query) {
        const cb = upd.callback_query;
        const cbChatId = String(cb.message?.chat?.id || "");
        const cbFromId = String(cb.from?.id || "");
        const isGroupCb = cbChatId.startsWith("-");
        if (cbFromId === String(OWNER_USER_ID) && isGroupCb) {
          state.groupChatId = cbChatId;
          saveState(state);
        }
        console.log(`[HQ Bridge] Button Click (${botKey}): ${cb.data}`);
        await tgApiWithToken(
          botToken,
          "answerCallbackQuery",
          {
            callback_query_id: cb.id,
            text: `⚡ [${cb.data}] 즉시 실행합니다!`,
          },
          5000
        );
        await handleCommand(cb.data || "", state, botToken, { isCallback: true, isGroup: isGroupCb });
      } else if (upd.message) {
        const incomingChatId = String(upd.message.chat?.id || "");
        const senderId = String(upd.message.from?.id || "");
        const chatType = String(upd.message.chat?.type || "");
        const isGroup = chatType === "group" || chatType === "supergroup" || incomingChatId.startsWith("-");

        // Deduplicate identical group messages received across multiple bots in the same room
        const msgDedupeKey = `${incomingChatId}_${upd.message.message_id}`;
        if (isGroup && upd.message.message_id) {
          if (seenGroupMessages.has(msgDedupeKey)) continue;
          seenGroupMessages.add(msgDedupeKey);
          if (seenGroupMessages.size > 500) {
            const firstKey = seenGroupMessages.values().next().value;
            seenGroupMessages.delete(firstKey);
          }
        }

        // If owner (755033799) adds the bots to a group chat or sends a message in a group chat, bind groupChatId automatically!
        // Ignore legacy pre-supergroup ID (-5459339357) after migration to supergroup (-1003834697086)
        const resolvedGroupId = upd.message.migrate_to_chat_id ? String(upd.message.migrate_to_chat_id) : incomingChatId;
        if (isGroup && senderId === String(OWNER_USER_ID) && resolvedGroupId && resolvedGroupId !== "-5459339357") {
          const isNewGroup = state.groupChatId !== resolvedGroupId;
          state.groupChatId = resolvedGroupId;
          saveState(state);
          if (isNewGroup && upd.message.new_chat_members && upd.message.new_chat_members.length > 0) {
            console.log(`[HQ Bridge] Bound to Unified Telegram Group Chat: ${resolvedGroupId}`);
            await sendDivisionReportsAll(state, resolvedGroupId);
            continue;
          }
        }

        if (upd.message.text) {
          const rawMsg = upd.message.text;
          let targetBotToken = botToken;
          let explicitDiv = null;
          // If the message mentions or replies to a specific bot in the group, route to that bot's division
          const replyBotUsername = String(upd.message.reply_to_message?.from?.username || "").toLowerCase();
          if (/semifeargreedbot/i.test(rawMsg) || replyBotUsername === "semifeargreedbot") {
            targetBotToken = SEMI_BOT_TOKEN;
            explicitDiv = "ALL";
          } else if (/rigjtsidealphabot/i.test(rawMsg) || replyBotUsername === "rigjtsidealphabot") {
            targetBotToken = RSA_BOT_TOKEN;
            explicitDiv = "TOM";
          } else if (/kidsfittbot/i.test(rawMsg) || replyBotUsername === "kidsfittbot") {
            targetBotToken = KFG_BOT_TOKEN;
            explicitDiv = "KFG";
          } else if (/moneyfiityyy_bot/i.test(rawMsg) || replyBotUsername === "moneyfiityyy_bot") {
            targetBotToken = KFK_BOT_TOKEN;
            explicitDiv = "KFK";
          } else if (!isGroup) {
            explicitDiv = resolveDivisionByBotToken(botToken, true);
          }

          const cleanCmd = rawMsg.replace(/@[A-Za-z0-9_]+/g, "").trim();
          console.log(`[HQ Bridge] Message (${botKey}) from ${senderId} in ${incomingChatId}: ${cleanCmd}`);
          if (incomingChatId === String(OWNER_USER_ID) || senderId === String(OWNER_USER_ID)) {
            await handleCommand(cleanCmd, state, targetBotToken, { isCallback: false, isGroup, explicitDiv });
          }
        }
      }
    }
  }
}

async function main() {
  if (BOT_TOKENS.length === 0) {
    console.error("Missing BOT_TOKENS");
    process.exit(1);
  }

  // CLI helper mode: `--report-all` triggers sequential reports from HQ, 1사업부, 2사업부, and 3사업부 bots
  if (process.argv.includes("--report-all")) {
    const state = loadState();
    await sendDivisionReportsAll(state);
    return;
  }

  // CLI helper mode: `--directives` sends the All-Divisions Common Directives Board to Telegram
  if (process.argv.includes("--directives")) {
    const state = loadState();
    await sendHqMessage(formatCommonDirectivesBoard(state), true, SEMI_BOT_TOKEN || PRIMARY_BOT_TOKEN);
    return;
  }

  // CLI helper mode: `--notify "message" [--div TOM|KFG|KFK|HQ|ALL]` sends a message via the dedicated division bot
  const notifyIdx = process.argv.indexOf("--notify");
  if (notifyIdx !== -1 && process.argv[notifyIdx + 1]) {
    const msg = process.argv[notifyIdx + 1];
    const divIdx = process.argv.indexOf("--div");
    let divArg = divIdx !== -1 && process.argv[divIdx + 1] ? process.argv[divIdx + 1].toUpperCase() : "";
    if (!divArg) {
      if (/1사업부|truthofmarket|rightsidealpha/i.test(msg) && !/2사업부|3사업부/.test(msg)) divArg = "TOM";
      else if (/2사업부|kisfitglobal|키즈핏 영문/i.test(msg) && !/1사업부|3사업부/.test(msg)) divArg = "KFG";
      else if (/3사업부|kidsfit\.co\.kr|사업아이템|키즈핏 코리아/i.test(msg) && !/1사업부|2사업부/.test(msg)) divArg = "KFK";
      else divArg = "ALL";
    }
    const targetToken =
      divArg === "HQ" || divArg === "ALL"
        ? SEMI_BOT_TOKEN
        : DIVISIONS[divArg]?.botToken || SEMI_BOT_TOKEN || PRIMARY_BOT_TOKEN;
    await sendHqMessage(`📬 <b>[작업 완료 보고]</b>\n${msg}${getLiveTokenTelemetryBanner()}`, true, targetToken);
    return;
  }

  ensureSingleInstance();
  const state = loadState();

  if (process.argv.includes("--announce")) {
    await sendDivisionReportsAll(state);
    if (process.argv.includes("--once")) return;
  }

  console.log(`[Master HQ Bridge] Active & Watchdog-Protected on Chat ID ${CHAT_ID} (${BOT_TOKENS.length} bots) | Telegram Conv: ${MASTER_CONVERSATION_ID} (PC Conv ${PC_DIRECT_CONVERSATION_ID} isolated)...`);
  setInterval(() => checkDailyStaggeredSchedule(state), 25000);

  while (true) {
    try {
      await Promise.all(BOT_TOKENS.map((tok) => pollBotTokenOnce(tok, state).catch(() => {})));
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 300));
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  MASTER_CONVERSATION_ID,
  PC_DIRECT_CONVERSATION_ID,
  DIVISIONS,
  HQ_KEYBOARD,
  resolveSafeTelegramConversationId,
  resolveDivisionByBotToken,
  detectDivisionFromText,
  loadCommonDirectives,
  saveCommonDirectives,
  addStandingDirective,
  removeStandingDirective,
  recordCommonOrder,
  formatCommonDirectivesBoard,
  buildAntigravityPromptText,
  handleCommand,
};
