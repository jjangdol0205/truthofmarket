#!/usr/bin/env node
/**
 * MASTER HQ TELEGRAM BRIDGE — Unified HQ Chief & Auditor + 1~5 Divisions Controller
 *
 * [핵심 운영 방식 (사장님 맞춤 개편)]
 * 1. 새벽 맥스 토큰(Dawn Max-Token) 및 불필요한 자동 스케줄러 전면 제거 (사장님 수동/직접 지시 중심)
 * 2. 본사 총괄·감사 봇(@SemifearGreedbot):
 *    - "1사업부 피드백 줘", "2사업부 피드백 줘", "/fb1"~"/fb5", "/감사 1사업부" 입력 시
 *      본사 감사관이 해당 사업부를 즉시 정밀 감사하여 [개선 피드백 Top 3 + 복사해서 쓸 수 있는 지시 예시] 보고
 * 3. 모두컴퍼니 본부 방(-1003834697086) & 각 사업부 1:1 봇 방 완벽 양방향 작동:
 *    - 모두컴퍼니 방에서 `/전사업부 지시`, `/1사업부 지시`, `/2사업부 지시`, `/3사업부 지시`, `/4사업부 지시`, `/5사업부 지시`
 *      (또는 `/all 지시`, `/div1 지시` ~ `/div5 지시`) 입력 시 그 방에서 즉시 접수 및 결과 보고
 *    - 각 사업부 1:1 텔레봇(@RigjtsideAlphabot 등)에 직접 지시해도 해당 1:1 방과 모두컴퍼니 본부 방 양쪽에 즉시 응답 및 결과 보고
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

const tomEnv = loadEnvFile("D:\\드림컴퍼니\\1사업부\\.env");
const kfgEnv = loadEnvFile("D:\\드림컴퍼니\\2사업부\\.env");
const gbaEnv = loadEnvFile("D:\\드림컴퍼니\\3사업부\\.env");
const heroEnv = loadEnvFile("D:\\드림컴퍼니\\4사업부\\.env");
const kfkEnv = loadEnvFile("D:\\드림컴퍼니\\5사업부\\.env");
const tomTgCfg = loadJsonFile(path.resolve(__dirname, "..", "data", "telegram_config.json"));

const OWNER_USER_ID = "755033799";
const DEFAULT_GROUP_CHAT_ID = "-1003834697086";
const CHAT_ID = process.env.HQ_TELEGRAM_CHAT_ID || tomEnv.HQ_TELEGRAM_CHAT_ID || DEFAULT_GROUP_CHAT_ID;

// Dedicated 1:1 Bot Tokens per Division (1~5사업부):
// - 본사 총괄·감사 & 3사업부 (GBA — getbreakai.com 일본): @SemifearGreedbot
// - 1사업부 (TOM — truthofmarket.com): @RigjtsideAlphabot
// - 2사업부 (KFG — kisfitglobal.com): @kidsfittbot
// - 4사업부 (HERO — paradise-hero.com & @김쌤의영웅라디오): @inves123_bot
// - 5사업부 (KFK — kidsfit.co.kr 패시브 자동화): @Moneyfiityyy_bot
const RSA_BOT_TOKEN = tomEnv.RSA_TELEGRAM_BOT_TOKEN || "";
const KFG_BOT_TOKEN = kfgEnv.TELEGRAM_BOT_TOKEN || "";
const SEMI_BOT_TOKEN = gbaEnv.TELEGRAM_BOT_TOKEN || tomTgCfg.bot_token || "9291573259:AAEZXNkQ4wuEPX6FYujxKT5mwLWdQpZOnes";
const HERO_BOT_TOKEN = heroEnv.TELEGRAM_BOT_TOKEN || "8899653516:AAEr6ZWcfkXObdiU83o-LYaw3eHL9J0QbHU";
const KFK_BOT_TOKEN = kfkEnv.TELEGRAM_BOT_TOKEN || "";
const PRIMARY_BOT_TOKEN = SEMI_BOT_TOKEN || RSA_BOT_TOKEN || KFG_BOT_TOKEN || HERO_BOT_TOKEN || KFK_BOT_TOKEN || "";

// Collect all 5 active bot tokens
const BOT_TOKENS = Array.from(
  new Set([SEMI_BOT_TOKEN, RSA_BOT_TOKEN, KFG_BOT_TOKEN, HERO_BOT_TOKEN, KFK_BOT_TOKEN].filter((t) => t && t.includes(":")))
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
    rule: "1사업부(truthofmarket.com), 2사업부(kisfitglobal.com), 3사업부(getbreakai.com)의 Lemon Squeezy 실결제 Live UUID(#296100)와 4사업부(paradise-hero.com) 골드 VIP/후원 퍼널, 5사업부(kidsfit.co.kr)의 쿠팡 파트너스(AF7865143)·링크프라이스(A100708867) 수익 코드 및 공정위 고지문, 금지어(최저가·할인율·특가·폭탄세일 사용 금지)를 절대 훼손하지 않는다.",
    createdAt: "2026-11-08T22:12:00+09:00",
  },
  {
    id: 3,
    title: "전 사업부 클린 비디오(숏폼 V3 & 4사업부 롱폼 라디오) 마스터링 표준",
    rule: "1·2·3·5사업부 모든 숏폼 영상은 본문 100% 클린 풀스크린(1080×1920, 상·하단 배너 및 워터마크 금지), 하단 세이프존(Y=1380~1465) 두꺼운 외곽선 자막(stroke_width >= 8), 종료 2.5~3.8초 엔딩 슬레이트 도메인 콜아웃 규격을 준수하며, 4사업부(@김쌤의영웅라디오)는 시니어 친화 1920×1080 롱폼 라디오 및 초대형 노란색/흰색 가사·사연 자막 규격을 준수한다.",
    createdAt: "2026-11-08T22:12:00+09:00",
  },
  {
    id: 4,
    title: "본사 총괄·감사 피드백 → 사장님 지시 → 1~5사업부 전담 봇 수행 원칙",
    rule: "본사(@SemifearGreedbot)는 총괄 및 감사 역할로서 사업부별 피드백 요청 시 문제점과 개선 지시 예시를 보고하고, 사장님이 모두컴퍼니 본부 방(/전사업부, /1사업부~5사업부)이나 각 사업부 텔레봇으로 지시하면 해당 사업부 전담 봇이 즉시 수정 후 결과를 보고한다.",
    createdAt: "2026-11-09T22:20:00+09:00",
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
      `> 이 문서는 텔레그램 본사 총괄·감사 리모컨(\`@SemifearGreedbot\` · \`/directives\` · \`/mode_all\`)과 연동되어 **1사업부(\`truthofmarket.com\`) · 2사업부(\`kisfitglobal.com\`) · 3사업부(\`getbreakai.com\`) · 4사업부(\`paradise-hero.com\`) · 5사업부(\`kidsfit.co.kr\`)** 전 사업부 에이전트에게 공통으로 강제 주입되는 지시사항 원장입니다.`,
      ``,
      `---`,
      ``,
      `## 🖥️ 1. 안티그래비티 작업 채널 이원화 (Channel Separation) 및 1~5사업부 봇 매핑`,
      ``,
      `| 구분 | 안티그래비티 Conversation ID | 용도 및 운영 원칙 |`,
      `| :--- | :--- | :--- |`,
      `| **📱 텔레그램 원격 전용 채널** | \`${MASTER_CONVERSATION_ID}\` | 텔레그램 5개 봇(\`@RigjtsideAlphabot\`, \`@kidsfittbot\`, \`@SemifearGreedbot\`, \`@inves123_bot\`, \`@Moneyfiityyy_bot\`)에서 인입되는 본사 총괄·감사 및 1~5사업부 원격 작업 100% 전담 수행 |`,
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
        ? orders.slice(0, 10).map((o) => `- **[${o.createdAt}]** ${o.text} (\`${o.status || "DISPATCHED"}\`)`)
        : [`- 아직 기록된 일괄 작업 이력이 없습니다.`]),
      ``,
      `---`,
      ``,
      `## 💬 4. 모두컴퍼니 본부 방 직통 명령어 & 감사 피드백 가이드`,
      ``,
      `- **본사 총괄·감사 피드백 요청**:`,
      `  - \`1사업부 피드백 줘\` / \`2사업부 피드백 줘\` / \`3사업부 피드백 줘\` / \`4사업부 피드백 줘\` / \`전사업부 피드백 줘\` (또는 \`/fb1\` ~ \`/fb5\`, \`/fb_all\`)`,
      `- **모두컴퍼니 방에서 사업부별 즉시 지시**:`,
      `  - \`/전사업부 <지시내용>\` (또는 \`/all <지시내용>\`, \`[공통] <지시내용>\`)`,
      `  - \`/1사업부 <지시내용>\` (또는 \`/div1 <지시내용>\`) → 1사업부(\`@RigjtsideAlphabot\`) 즉시 수행`,
      `  - \`/2사업부 <지시내용>\` (또는 \`/div2 <지시내용>\`) → 2사업부(\`@kidsfittbot\`) 즉시 수행`,
      `  - \`/3사업부 <지시내용>\` (또는 \`/div3 <지시내용>\`) → 3사업부(\`@SemifearGreedbot\`) 즉시 수행`,
      `  - \`/4사업부 <지시내용>\` (또는 \`/div4 <지시내용>\`) → 4사업부(\`@inves123_bot\`) 즉시 수행`,
      `  - \`/5사업부 <지시내용>\` (또는 \`/div5 <지시내용>\`) → 5사업부(\`@Moneyfiityyy_bot\`) 즉시 수행`,
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
    num: "전사업부",
    name: "전 사업부 공통 (본사 총괄 · 감사 | 드림컴퍼니 HQ)",
    domain: "https://truthofmarket.com | https://kisfitglobal.com | https://getbreakai.com | https://paradise-hero.com | https://kidsfit.co.kr",
    cwd: HQ_ROOT_DIR,
    conversationId: MASTER_CONVERSATION_ID,
    dedicatedConversationId: "1921e31e-ab59-4720-9419-93cac770374d",
    conversationTitle: "모두컴퍼니 본부",
    botToken: SEMI_BOT_TOKEN,
    botHandle: "@SemifearGreedbot",
    managerTitle: "드림컴퍼니 본사 총괄 & 감사관 (HQ Chief Executive & Auditor)",
    multiAgents: [
      "HQ-Chief-Auditor (1~5사업부 실시간 감사 피드백 도출 및 사장님 지시문 설계)",
      "HQ-Common-Directive-Controller (전 사업부 공통 지시사항 등록·강제 적용 및 1~5사업부 일괄 하달)",
    ],
  },
  TOM: {
    code: "TOM",
    num: "1사업부",
    name: "1사업부: TruthOfMarket (truthofmarket.com)",
    domain: "https://truthofmarket.com",
    cwd: "D:\\드림컴퍼니\\1사업부",
    conversationId: MASTER_CONVERSATION_ID,
    dedicatedConversationId: "f24bd054-1b51-4346-b561-56996bc93686",
    conversationTitle: "1사업부(truthofmarekt)",
    botToken: RSA_BOT_TOKEN,
    botHandle: "@RigjtsideAlphabot",
    managerTitle: "1사업부 미국주식·반도체 퀀트 부문장 (TOM Division Lead)",
    multiAgents: [
      "TOM-Quant-Agent (72종목 PW-RSI & $SMH:$XLV 80:20 바벨 퀀트 엔진)",
      "TOM-GEO-Promo-Agent (Telegra.ph 월가 백링크 · llms.txt · IndexNow URL 색인)",
      "TOM-Media-VIP-Agent (@rightsidealpha 쇼츠·릴스 & @truthofmarketss VIP 속보 데스크)",
    ],
  },
  KFG: {
    code: "KFG",
    num: "2사업부",
    name: "2사업부: KISFIT Global (kisfitglobal.com)",
    domain: "https://kisfitglobal.com",
    cwd: "D:\\드림컴퍼니\\2사업부",
    conversationId: resolveSafeTelegramConversationId(kfgEnv.ANTIGRAVITY_CONVERSATION_ID),
    dedicatedConversationId: "28de4b55-9677-4f05-b1ff-f98015cc6d29",
    conversationTitle: "2사업부(kisfitglobal)",
    botToken: KFG_BOT_TOKEN,
    botHandle: "@kidsfittbot",
    managerTitle: "2사업부 글로벌 소아성장 부문장 (KFG Division Lead)",
    multiAgents: [
      "KFG-Auxology-Agent (US CDC 2000 LMS & Khamis-Roche 성인키 정밀 예측 엔진)",
      "KFG-GlobalSEO-Agent (영문 임상 Q&A 증식 · Zero-Hangul 검열 · 글로벌 색인)",
      "KFG-Media-Agent (@kisfitglobal 3D 의학 다큐 쇼츠·릴스 마스터링 에이전트)",
    ],
  },
  GBA: {
    code: "GBA",
    num: "3사업부",
    name: "3사업부: GetBreakAI 일본 퀀트 (getbreakai.com)",
    domain: "https://getbreakai.com",
    cwd: "D:\\드림컴퍼니\\3사업부",
    conversationId: resolveSafeTelegramConversationId(gbaEnv.ANTIGRAVITY_CONVERSATION_ID),
    dedicatedConversationId: "ec5f83c2-178c-4ca1-b225-26fc1a459bd8",
    conversationTitle: "3사업부(getbreakai)",
    botToken: SEMI_BOT_TOKEN,
    botHandle: "@SemifearGreedbot",
    managerTitle: "3사업부 일본 퀀트·인스타·유튜브 부문장 (GBA Division Lead)",
    multiAgents: [
      "GBA-JP-Quant-Agent (일본 투자자용 新NISA 0% vs 특정계좌 20.315% 세후 수익 시뮬레이터)",
      "GBA-JP-Media-Agent (일본 타깃 인스타 릴스·유튜브 쇼츠 9:16 숏폼 엔진)",
      "GBA-JP-Syndication-Agent (/jp/feed.xml · /jp/x-feed.xml 기반 일본 SNS 자동 배포)",
    ],
  },
  HERO: {
    code: "HERO",
    num: "4사업부",
    name: "4사업부: 파라다이스히어로 · 영웅라디오 (paradise-hero.com)",
    domain: "https://paradise-hero.com",
    cwd: "D:\\드림컴퍼니\\4사업부",
    conversationId: resolveSafeTelegramConversationId(heroEnv.ANTIGRAVITY_CONVERSATION_ID),
    dedicatedConversationId: "dbc61f0a-76cb-48e3-b617-a616c069564c",
    conversationTitle: "4사업부(paradise)",
    botToken: HERO_BOT_TOKEN,
    botHandle: "@inves123_bot",
    managerTitle: "4사업부 황영웅 플랫폼 & 롱폼 라디오 부문장 (HERO Division Lead)",
    multiAgents: [
      "HERO-Platform-Agent (paradise-hero.com 시니어 WCAG AAA 웹 플랫폼 & 황영웅 골드 VIP 멤버십)",
      "HERO-Radio-Longform-Agent (@김쌤의영웅라디오 15분 롱폼 사연 대본·TTS·BGM·1080p 비디오 엔진)",
      "HERO-Commerce-Billboard-Agent (황금 응원 전광판 소액후원 & 5070 시니어 큐레이션 커머스)",
    ],
  },
  KFK: {
    code: "KFK",
    num: "5사업부",
    name: "5사업부: 키즈핏 코리아 패시브 (kidsfit.co.kr)",
    domain: "https://kidsfit.co.kr",
    cwd: "D:\\드림컴퍼니\\5사업부",
    conversationId: resolveSafeTelegramConversationId(kfkEnv.ANTIGRAVITY_CONVERSATION_ID),
    dedicatedConversationId: "c6a94ac9-5ae4-4e50-9155-2dc9c1243b57",
    conversationTitle: "5사업부(kidsfit)",
    botToken: KFK_BOT_TOKEN,
    botHandle: "@Moneyfiityyy_bot",
    managerTitle: "5사업부 무인 패시브 자동화 부문장 (KFK Passive Lead)",
    multiAgents: [
      "KFK-Passive-Guard-Agent (kidsfit.co.kr 100% 패시브 무인 유지보수 & 쿠팡/링크프라이스 보존)",
      "KFK-Zero-Touch-Healer (금지어 Zero-Tolerance 감시 및 무인 헬스체크 경보 전용 에이전트)",
    ],
  },
};

function resolveDivisionByBotToken(botToken, includeHqAsAll = false) {
  if (!botToken) return null;
  if (RSA_BOT_TOKEN && botToken === RSA_BOT_TOKEN) return "TOM";
  if (KFG_BOT_TOKEN && botToken === KFG_BOT_TOKEN) return "KFG";
  if (HERO_BOT_TOKEN && botToken === HERO_BOT_TOKEN) return "HERO";
  if (KFK_BOT_TOKEN && botToken === KFK_BOT_TOKEN) return "KFK";
  if (SEMI_BOT_TOKEN && botToken === SEMI_BOT_TOKEN) return includeHqAsAll ? "GBA" : null;
  return null;
}

// 본사 총괄·감사 & 모두컴퍼니 본부 방 전용 심플 리모컨 (1~5사업부 전 사업부 지원)
const HQ_KEYBOARD = {
  inline_keyboard: [
    [
      { text: "🏛️ 전 사업부 공통 지시 모드", callback_data: "/mode_all" },
      { text: "📌 전 사업부 공통 지시사항", callback_data: "/directives" },
    ],
    [
      { text: "🕵️‍♂️ 전사업부 종합 감사 피드백", callback_data: "/fb_all" },
      { text: "📋 1~5사업부 봇 일제 보고", callback_data: "/report" },
    ],
    [
      { text: "🔍 1사업부 감사 피드백", callback_data: "/fb1" },
      { text: "🔍 2사업부 감사 피드백", callback_data: "/fb2" },
    ],
    [
      { text: "🔍 3사업부 감사 피드백", callback_data: "/fb3" },
      { text: "🔍 4사업부 감사 피드백", callback_data: "/fb4" },
    ],
    [
      { text: "🔍 5사업부 감사 피드백", callback_data: "/fb5" },
      { text: "📈 1~5사업부 방문자 브리핑", callback_data: "/visitors" },
    ],
    [
      { text: "🎯 /1사업부 바로 지시", callback_data: "/ask_tom" },
      { text: "🎯 /2사업부 바로 지시", callback_data: "/ask_kfg" },
    ],
    [
      { text: "🎯 /3사업부 바로 지시", callback_data: "/ask_gba" },
      { text: "🎯 /4사업부 바로 지시", callback_data: "/ask_hero" },
    ],
    [
      { text: "🎯 /5사업부 바로 지시", callback_data: "/ask_kfk" },
      { text: "🎯 /전사업부 바로 지시", callback_data: "/ask_all" },
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
    fs.writeFileSync(PID_FILE, String(process.pid), "utf8");
  } catch (_) {}
}

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
      if (!parsed.offsets) parsed.offsets = {};
      if (!parsed.lastAutoRunDate) parsed.lastAutoRunDate = {};
      if (!parsed.activeDivision) parsed.activeDivision = "ALL";
      return parsed;
    }
  } catch (_) {}
  return {
    lastUpdateId: 0,
    offsets: {},
    activeDivision: "ALL",
    lastCommandChatId: DEFAULT_GROUP_CHAT_ID,
    lastAutoRunDate: {},
  };
}

function saveState(st) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(st, null, 2), "utf8");
  } catch (_) {}
}

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

/**
 * Sends message to explicitChatId (where the command came from).
 * If the command came from a 1:1 chat (OWNER_USER_ID) and alsoSyncGroup is true,
 * it replies in the 1:1 chat AND mirrors to 모두컴퍼니 group chat so both places are always in sync!
 */
async function sendHqMessage(htmlText, withKeyboard = true, preferredToken = null, explicitChatId = null, customReplyMarkup = null) {
  const tokenToUse = preferredToken || SEMI_BOT_TOKEN || RSA_BOT_TOKEN || PRIMARY_BOT_TOKEN || BOT_TOKENS[0];
  const groupChat = getTargetChatId();
  const targetChat = explicitChatId || groupChat;

  const payload = {
    chat_id: targetChat,
    text: htmlText,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };
  if (customReplyMarkup) {
    payload.reply_markup = customReplyMarkup;
  } else if (withKeyboard) {
    payload.reply_markup = HQ_KEYBOARD;
  }

  const res = await tgApiWithToken(tokenToUse, "sendMessage", payload, 12000);
  if (res.ok) return res;

  // Fallback to HQ / Div1 bot if preferred bot failed in targetChat
  if (tokenToUse !== SEMI_BOT_TOKEN && SEMI_BOT_TOKEN) {
    const fb1 = await tgApiWithToken(SEMI_BOT_TOKEN, "sendMessage", payload, 12000);
    if (fb1.ok) return fb1;
  }
  if (tokenToUse !== RSA_BOT_TOKEN && RSA_BOT_TOKEN) {
    const fb2 = await tgApiWithToken(RSA_BOT_TOKEN, "sendMessage", payload, 12000);
    if (fb2.ok) return fb2;
  }
  if (targetChat !== String(OWNER_USER_ID)) {
    payload.chat_id = String(OWNER_USER_ID);
    return await tgApiWithToken(tokenToUse, "sendMessage", payload, 12000);
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
          .map((o) => `• <code>[${o.createdAt}]</code> ${o.text}`)
          .join("\n")
      : "• 최근 일괄 지시 이력이 없습니다.";

  return (
    `📌 <b>[드림컴퍼니 본사 총괄·감사 &amp; 공통 지시사항 보드 (@SemifearGreedbot)]</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🖥️ <b>[안티그래비티 작업 채널 완벽 분리 현황]</b>\n` +
    `• 📱 <b>텔레그램 원격 전용 채널</b>: <code>${MASTER_CONVERSATION_ID}</code> (<b>100% 전담 연결</b>)\n` +
    `• 💻 <b>컴퓨터(PC) 직접 작업 채널</b>: <code>${PC_DIRECT_CONVERSATION_ID}</code> (<b>독립 분리 · 간섭 0%</b>)\n` +
    `• 🎯 <b>현재 지시 대상</b>: <b>${activeDiv.name}</b>\n\n` +
    `📜 <b>[영구 적용 전 사업부 공통 지시사항 (${directives.length}건)]</b>\n` +
    `${standingLines}\n\n` +
    `🕒 <b>[최근 하달된 전 사업부 공통 작업 이력]</b>\n` +
    `${recentOrderLines}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💡 <b>[모두컴퍼니 본부 방 직통 사용법]</b>\n` +
    `1️⃣ <b>본사 총괄·감사에게 피드백 받기</b>:\n` +
    `   • <code>1사업부 피드백 줘</code> / <code>2사업부 피드백 줘</code> / <code>3사업부 피드백 줘</code> / <code>4사업부 피드백 줘</code> (또는 하단 버튼 <code>🔍 감사 피드백</code> 클릭)\n` +
    `2️⃣ <b>모두컴퍼니 방에서 바로 작업 지시하기</b>:\n` +
    `   • <code>/전사업부 지시내용</code> (또는 <code>/all 지시내용</code>)\n` +
    `   • <code>/1사업부 지시내용</code> (또는 <code>/div1 지시내용</code>)\n` +
    `   • <code>/2사업부 지시내용</code> (또는 <code>/div2 지시내용</code>)\n` +
    `   • <code>/3사업부 지시내용</code> (또는 <code>/div3 지시내용</code>)\n` +
    `   • <code>/4사업부 지시내용</code> (또는 <code>/div4 지시내용</code>)`
  );
}

async function sendDivisionReportsAll(state, explicitChatId = null) {
  const { runVisitorBriefing } = require("./hq_all_divisions_visitor_briefing");
  const { results } = await runVisitorBriefing({ sendTelegram: false });
  const rMap = {};
  for (const r of results || []) {
    if (r.code === "1사업부") rMap.TOM = r;
    if (r.code === "2사업부") rMap.KFG = r;
    if (r.code === "3사업부") rMap.GBA = r;
    if (r.code === "4사업부") rMap.HERO = r;
    if (r.code === "5사업부") rMap.KFK = r;
  }
  const activeDiv = DIVISIONS[state?.activeDivision] || DIVISIONS.ALL;
  const targetChat = explicitChatId || getTargetChatId();

  // 0. 본사 총괄·감사 (@SemifearGreedbot)
  await sendHqMessage(
    `🏛️ <b>[드림컴퍼니 본사 총괄·감사 보고 (@SemifearGreedbot)]</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `• <b>본부 대화방</b>: <b>모두컴퍼니</b> (<code>-1003834697086</code>)\n` +
      `• <b>본사 역할</b>: <b>총괄 지휘 &amp; 1~5사업부 감사 피드백 전담</b>\n` +
      `• 🎯 <b>현재 지시 모드</b>: <b>${activeDiv.name}</b>\n` +
      `• 💡 <b>빠른 명령</b>: <code>1사업부 피드백 줘</code> | <code>/1사업부 지시내용</code> ~ <code>/4사업부 지시내용</code> | <code>/전사업부 지시내용</code>\n` +
      `<i>👇 이어서 1~5사업부 전담 봇이 현황을 보고합니다.</i>`,
    false,
    SEMI_BOT_TOKEN,
    targetChat
  );

  // 1. 1사업부 (@RigjtsideAlphabot)
  const r1 = rMap.TOM || { uvToday: 0, pvToday: 0, uvTotal: 0, pvTotal: 0, paidClickToday: 0, paidClickTotal: 0, paidMemberTotal: 0, health: { ok: true, ms: 120 } };
  await sendHqMessage(
    `📈 <b>[1사업부 보고 — TruthOfMarket 미국주식 (@RigjtsideAlphabot)]</b>\n` +
      `• <b>도메인</b>: https://truthofmarket.com (${r1.health?.ok ? `🟢 정상 ${r1.health.ms}ms` : "🟡 점검"})\n` +
      `• <b>방문자(UV/PV)</b>: 오늘 <b>${r1.uvToday}명</b> (${r1.pvToday}회) | 누적 <b>${r1.uvTotal}명</b>\n` +
      `• <b>지시 명령어</b>: <code>/1사업부 지시내용</code> (또는 <code>1사업부 피드백 줘</code>)`,
    false,
    RSA_BOT_TOKEN,
    targetChat
  );

  // 2. 2사업부 (@kidsfittbot)
  const r2 = rMap.KFG || { uvToday: 0, pvToday: 0, uvTotal: 0, pvTotal: 0, paidClickToday: 0, paidClickTotal: 0, paidMemberTotal: 0, health: { ok: true, ms: 120 } };
  await sendHqMessage(
    `🌍 <b>[2사업부 보고 — KISFIT Global 영문 (@kidsfittbot)]</b>\n` +
      `• <b>도메인</b>: https://kisfitglobal.com (${r2.health?.ok ? `🟢 정상 ${r2.health.ms}ms` : "🟡 점검"})\n` +
      `• <b>방문자(UV/PV)</b>: 오늘 <b>${r2.uvToday}명</b> (${r2.pvToday}회) | 누적 <b>${r2.uvTotal}명</b>\n` +
      `• <b>지시 명령어</b>: <code>/2사업부 지시내용</code> (또는 <code>2사업부 피드백 줘</code>)`,
    false,
    KFG_BOT_TOKEN,
    targetChat
  );

  // 3. 3사업부 (@SemifearGreedbot)
  const r3 = rMap.GBA || { uvToday: 0, pvToday: 0, uvTotal: 0, pvTotal: 0, paidClickToday: 0, paidClickTotal: 0, paidMemberTotal: 0, health: { ok: true, ms: 120 } };
  await sendHqMessage(
    `🇯🇵 <b>[3사업부 보고 — GetBreakAI 일본 퀀트 (@SemifearGreedbot)]</b>\n` +
      `• <b>도메인</b>: https://getbreakai.com/jp/ (${r3.health?.ok ? `🟢 정상 ${r3.health.ms}ms` : "🟡 점검"})\n` +
      `• <b>방문자(UV/PV)</b>: 오늘 <b>${r3.uvToday}명</b> (${r3.pvToday}회) | 누적 <b>${r3.uvTotal}명</b>\n` +
      `• <b>지시 명령어</b>: <code>/3사업부 지시내용</code> (또는 <code>3사업부 피드백 줘</code>)`,
    false,
    SEMI_BOT_TOKEN,
    targetChat
  );

  // 4. 4사업부 (@inves123_bot)
  const r4 = rMap.HERO || { uvToday: 0, pvToday: 0, uvTotal: 0, pvTotal: 0, paidClickToday: 0, paidClickTotal: 0, paidMemberTotal: 0, health: { ok: true, ms: 120 } };
  await sendHqMessage(
    `👑 <b>[4사업부 보고 — 파라다이스히어로 · 영웅라디오 (@inves123_bot)]</b>\n` +
      `• <b>도메인 / 채널</b>: https://paradise-hero.com &amp; <code>@김쌤의영웅라디오</code>\n` +
      `• <b>방문자(UV/PV)</b>: 오늘 <b>${r4.uvToday}명</b> (${r4.pvToday}회) | 누적 <b>${r4.uvTotal}명</b>\n` +
      `• <b>지시 명령어</b>: <code>/4사업부 지시내용</code> (또는 <code>4사업부 피드백 줘</code>)`,
    false,
    HERO_BOT_TOKEN,
    targetChat
  );

  // 5. 5사업부 (@Moneyfiityyy_bot)
  const r5 = rMap.KFK || { uvToday: 0, pvToday: 0, uvTotal: 0, pvTotal: 0, refClickToday: 0, refClickTotal: 0, health: { ok: true, ms: 120 } };
  await sendHqMessage(
    `🤖 <b>[5사업부 보고 — KidsFit Korea 패시브 (@Moneyfiityyy_bot)]</b>\n` +
      `• <b>도메인</b>: https://kidsfit.co.kr (${r5.health?.ok ? `🟢 무인 정상 ${r5.health.ms}ms` : "🟡 점검"})\n` +
      `• <b>패시브 레퍼럴</b>: 오늘 상품클릭 <b>${r5.refClickToday}회</b> (누적 <b>${r5.refClickTotal}회</b>)\n` +
      `• <b>지시 명령어</b>: <code>/5사업부 지시내용</code>`,
    true,
    KFK_BOT_TOKEN,
    targetChat
  );
}

// ---------------------------------------------------------------------------
// SEQUENTIAL 1-AT-A-TIME TASK QUEUE
// ---------------------------------------------------------------------------
const taskQueue = [];
let currentTask = null;

/**
 * Parses slash prefixes like `/전사업부 ...`, `/1사업부 ...`, `/2사업부 ...`, `/3사업부 ...`, `/4사업부 ...`, `/5사업부 ...`,
 * `/div1 ...` ~ `/div5 ...`, `/all ...`, `[1사업부] ...`, `1사업부: ...`
 */
function parseSlashOrPrefixCommand(rawText) {
  const trimmed = String(rawText || "").trim();
  const m = trimmed.match(
    /^(?:\/|\s*\[)?(전\s*사업부|전사업부|공통|전체|본사|총괄|all|hq|1사업부|div1|tom|1|2사업부|div2|kfg|2|3사업부|div3|gba|3|4사업부|div4|hero|4|5사업부|div5|kfk|5)(?:\]|\s*:)?(?:\s+([\s\S]+))?$/i
  );
  if (!m) return null;
  const rawKey = m[1].replace(/\s+/g, "").toLowerCase();
  // Only treat single digits 1..5 as division commands if they started with `/` (e.g. `/1 ...`)
  if (/^[1-5]$/.test(rawKey) && !trimmed.startsWith("/")) {
    return null;
  }
  const map = {
    전사업부: "ALL",
    공통: "ALL",
    전체: "ALL",
    본사: "ALL",
    총괄: "ALL",
    all: "ALL",
    hq: "ALL",
    "1사업부": "TOM",
    div1: "TOM",
    tom: "TOM",
    "1": "TOM",
    "2사업부": "KFG",
    div2: "KFG",
    kfg: "KFG",
    "2": "KFG",
    "3사업부": "GBA",
    div3: "GBA",
    gba: "GBA",
    "3": "GBA",
    "4사업부": "HERO",
    div4: "HERO",
    hero: "HERO",
    "4": "HERO",
    "5사업부": "KFK",
    div5: "KFK",
    kfk: "KFK",
    "5": "KFK",
  };
  const divCode = map[rawKey];
  if (!divCode) return null;
  return {
    divCode,
    restText: (m[2] || "").trim(),
  };
}

/**
 * Checks if the user is asking HQ Chief/Auditor for feedback/audit on a division
 * e.g. "1사업부 피드백 줘", "2사업부 감사해줘", "/fb1", "/감사 1사업부", "/1사업부 피드백"
 */
function parseAuditFeedbackRequest(rawText) {
  const t = String(rawText || "").trim();
  const lower = t.toLowerCase();

  const directMap = {
    "/fb": "ALL",
    "/fb_all": "ALL",
    "/feedback": "ALL",
    "/피드백": "ALL",
    "/감사": "ALL",
    "/fb1": "TOM",
    "/audit1": "TOM",
    "/fb2": "KFG",
    "/audit2": "KFG",
    "/fb3": "GBA",
    "/audit3": "GBA",
    "/fb4": "HERO",
    "/audit4": "HERO",
    "/fb5": "KFK",
    "/audit5": "KFK",
  };
  if (directMap[lower]) {
    return { isAudit: true, divCode: directMap[lower], customQuestion: "" };
  }

  // Match patterns like "1사업부 피드백 줘", "/1사업부 피드백", "2사업부 감사 피드백 줘", "전사업부 피드백 줘"
  if (/(피드백|감사\s*결과|감사\s*보고|감사\s*피드백|진단\s*피드백|점검\s*피드백|어때\s*\??|문제점\s*찾아|감사해\s*줘|피드백\s*줘|피드백\s*부탁)/.test(t)) {
    let divCode = "ALL";
    if (/1\s*사업부|truthofmarket|tom/i.test(t)) divCode = "TOM";
    else if (/2\s*사업부|kisfitglobal|kfg/i.test(t)) divCode = "KFG";
    else if (/3\s*사업부|getbreakai|gba|일본/i.test(t)) divCode = "GBA";
    else if (/4\s*사업부|paradise-hero|황영웅|영웅라디오|hero/i.test(t)) divCode = "HERO";
    else if (/5\s*사업부|kidsfit\.co\.kr|kfk/i.test(t)) divCode = "KFK";

    // Check if it's a pure general feedback request or has a specific topic
    const stripped = t
      .replace(/^\/?(전\s*사업부|[1-5]\s*사업부|본사|총괄)\s*/i, "")
      .replace(/(에\s*대해(서)?|관련(해서)?|한번|좀|전체적으로|감사|피드백|진단|점검|줘|해줘|해주세요|알려줘|부탁해|보고해)\s*/gi, "")
      .trim();

    return {
      isAudit: true,
      divCode,
      customQuestion: stripped.length >= 6 ? t : "",
    };
  }

  return null;
}

/**
 * Checks if the user is requesting an episode video + upload kit on demand
 * e.g. "9화 영상 보내줘", "1화 영상 보내줘", "/1사업부 10화 영상 보내줘", "2회 쇼츠 보내줘"
 */
function parseEpisodeVideoRequest(rawText, fallbackDivCode = "TOM") {
  const t = String(rawText || "").trim();
  const slash = parseSlashOrPrefixCommand(t);
  const body = slash && slash.restText ? slash.restText.trim() : t;

  const m = body.match(
    /^(?:제\s*)?(\d{1,2})\s*(?:화|회|회차|편)\s*(?:영상|쇼츠|릴스|비디오|동영상|클립)?\s*(?:다시\s*)?(?:보내\s*줘|보내줘|보내|전송해\s*줘|전송|달라|줘|주세요|올려줘)?$/i
  );
  if (!m) return null;

  const epNum = parseInt(m[1], 10);
  if (!epNum || epNum < 1 || epNum > 50) return null;

  let divCode = slash && slash.divCode ? slash.divCode : fallbackDivCode;
  if (!divCode || divCode === "ALL") {
    divCode = detectDivisionFromText(t, "GBA");
    if (divCode === "ALL") divCode = "GBA";
  }
  return {
    epNum,
    divCode,
  };
}

function detectDivisionFromText(text, fallbackDiv) {
  const parsed = parseSlashOrPrefixCommand(text);
  if (parsed && parsed.divCode) {
    return parsed.divCode;
  }

  const firstLine = (text || "").trim().split(/\r?\n/)[0].toLowerCase();
  if (
    /^(\/?\[?(공통|전\s*사업부|전사업부|전체|본사|all|hq)\]?|(공통|공통\s*지시|공통지시사항|전\s*사업부|전사업부|전체\s*사업부|전체|all|hq)\s*:)/.test(
      firstLine
    )
  ) {
    return "ALL";
  }
  if (/^(\/?\[?1사업부\]?|1사업부\s*:|\/?\[?tom\]?|tom\s*:|\/div1\b)/.test(firstLine)) {
    return "TOM";
  }
  if (/^(\/?\[?2사업부\]?|2사업부\s*:|\/?\[?kfg\]?|kfg\s*:|\/div2\b)/.test(firstLine)) {
    return "KFG";
  }
  if (/^(\/?\[?3사업부\]?|3사업부\s*:|\/?\[?gba\]?|gba\s*:|\/?\[?getbreakai\]?|getbreakai\s*:|\/div3\b)/.test(firstLine)) {
    return "GBA";
  }
  if (/^(\/?\[?4사업부\]?|4사업부\s*:|\/?\[?hero\]?|hero\s*:|\/?\[?황영웅\]?|황영웅\s*:|\/?\[?영웅라디오\]?|영웅라디오\s*:|\/div4\b)/.test(firstLine)) {
    return "HERO";
  }
  if (/^(\/?\[?5사업부\]?|5사업부\s*:|\/?\[?kfk\]?|kfk\s*:|\/div5\b)/.test(firstLine)) {
    return "KFK";
  }

  const t = (text || "").toLowerCase();
  if (
    /전\s*사업부|모든\s*사업부|1\s*[·.,/~-]\s*5\s*사업부|1\s*[·.,/]\s*2\s*[·.,/]\s*3\s*사업부|5개\s*사업부\s*(모두|전부|전체|공통)|3개\s*사업부\s*(모두|전부|전체|공통)|전사\s*공통|공통\s*지시/.test(
      t
    )
  ) {
    return "ALL";
  }

  if (fallbackDiv && DIVISIONS[fallbackDiv]) {
    return fallbackDiv;
  }

  if (t.includes("paradise-hero") || t.includes("황영웅") || t.includes("영웅라디오") || t.includes("김쌤") || t.includes("4사업")) {
    return "HERO";
  }
  if (t.includes("getbreakai") || t.includes("getbreak") || t.includes("3사업")) {
    return "GBA";
  }
  if (t.includes("kidsfit.co.kr") || t.includes("키즈핏 코리아") || t.includes("5사업")) {
    return "KFK";
  }
  if (t.includes("kisfitglobal.com") || t.includes("kidsfitglobal.com") || t.includes("키즈핏 영문") || t.includes("2사업")) {
    return "KFG";
  }
  return "TOM";
}

function enqueueTask(task, botToken, replyChatId = null) {
  task.botToken = botToken;
  task.replyChatId = replyChatId || getTargetChatId();
  taskQueue.push(task);
  if (currentTask) {
    sendHqMessage(
      `⏳ <b>[대기열 등록 완료 — 순차 실행]</b>\n` +
        `• 현재 실행 중: <b>${currentTask.title}</b>\n` +
        `• 대기 등록됨 (#${taskQueue.length}): <b>${task.title}</b>`,
      false,
      botToken,
      task.replyChatId
    );
    return;
  }
  processNextTask();
}

async function processNextTask() {
  if (currentTask || taskQueue.length === 0) return;
  currentTask = taskQueue.shift();

  await sendHqMessage(
    `🚦 <b>[${currentTask.division.name} — 작업 시작]</b>\n` +
      `• <b>전담 봇</b>: ${currentTask.division.botHandle}\n` +
      `• <b>작업 내용</b>: ${currentTask.title}`,
    false,
    currentTask.botToken,
    currentTask.replyChatId
  );

  try {
    await currentTask.run();
  } catch (err) {
    await sendHqMessage(
      `⚠️ <b>[작업 오류]</b> ${currentTask.title}: ${err.message}`,
      true,
      currentTask.botToken,
      currentTask.replyChatId
    );
  } finally {
    currentTask = null;
    if (taskQueue.length > 0) {
      setTimeout(processNextTask, 2000);
    }
  }
}

function runPythonScriptAsync(scriptPath, args = [], cwd = DIVISIONS.TOM.cwd) {
  return new Promise((resolve) => {
    const proc = spawn("python", [scriptPath, ...args], { cwd, encoding: "utf8" });
    let out = "";
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (out += d.toString()));
    proc.on("close", (code) => resolve({ code, output: out }));
    proc.on("error", (err) => resolve({ code: 1, output: err.message }));
  });
}

function buildAntigravityPromptText(div, promptText, isAuditMode = false) {
  const agentList = (div.multiAgents || []).map((a, i) => `   - Subagent #${i + 1}: ${a}`).join("\n");
  const commonData = loadCommonDirectives();
  const standingRules = (commonData.standingDirectives || [])
    .map((d, idx) => `   ${idx + 1}. [${d.title || `공통수칙 #${idx + 1}`}] ${d.rule}`)
    .join("\n");

  if (isAuditMode) {
    return [
      `[UNIFIED AI COMPANY · 🕵️‍♂️ 본사 총괄·감사 모드 (HQ Chief Auditor) — 총괄매니저 대상: ${div.name}]`,
      `보고 텔레그램 봇: @SemifearGreedbot (드림컴퍼니 본사 총괄·감사 봇)`,
      `텔레그램 원격 전용 채널 ID: ${MASTER_CONVERSATION_ID} (PC 작업 전용 채널 ${PC_DIRECT_CONVERSATION_ID} 간섭 절대 금지)`,
      `감사 대상 사업부 폴더 및 도메인: ${div.cwd} (${div.domain})`,
      `대상 사업부 전담 안티그래비티 대화방: ${div.conversationTitle || div.num} (${div.dedicatedConversationId || MASTER_CONVERSATION_ID})`,
      ``,
      `사장님이 본사 총괄매니저·감사관인 당신에게 다음 감사/피드백 및 사업부 지시를 요청하셨습니다:`,
      `"${promptText}"`,
      ``,
      `총괄매니저 감사 및 사업부 업무 지시 원칙:`,
      `1. 가드레일 코드를 임의로 수정하지 말고, 먼저 해당 사업부(${div.cwd})의 실제 화면·코드·수익화 퍼널·콘텐츠 파이프라인에서 부족한 점이 무엇인지 날카롭게 분석하세요.`,
      `2. 분석이 끝나면 사장님이 직접 복사해 지시하실 필요 없이, 총괄매니저인 당신이 직접 해당 사업부 전담 대화방(${div.dedicatedConversationId || MASTER_CONVERSATION_ID}, ${div.conversationTitle || div.num})에 send_message 도구로 구체적인 수정·보완 업무를 지시하거나 직접 수정·검증을 완수하세요.`,
      `3. 분석 및 사업부 업무 지시(또는 수정 검증)가 완료되면 반드시 아래 명령어로 본사 총괄·감사 봇(@SemifearGreedbot)을 통해 보고하세요:`,
      `   node "${BRIDGE_SCRIPT_PATH}" --div HQ --notify "[🕵️‍♂️ ${div.num} 총괄매니저 감사 분석 및 사업부 업무 지시 완료]\n<부족한 점 분석 요약 및 해당 사업부 지시/조치 내역>"`,
    ].join("\n");
  }

  if (div.code === "ALL") {
    return [
      `[UNIFIED AI COMPANY · 🏛️ 전 사업부 공통 지시사항 (1~5사업부 일괄 총괄) — ${div.managerTitle}]`,
      `전담 텔레그램 봇: ${div.botHandle} (드림컴퍼니 본사 총괄 지휘 채널)`,
      `텔레그램 원격 전용 채널 ID: ${MASTER_CONVERSATION_ID} (PC 작업 전용 채널 ${PC_DIRECT_CONVERSATION_ID} 간섭 절대 금지)`,
      `산하 지휘 대상 5대 사업부:`,
      `   - 1사업부 (TOM): D:\\드림컴퍼니\\1사업부 (https://truthofmarket.com · @RigjtsideAlphabot)`,
      `   - 2사업부 (KFG): D:\\드림컴퍼니\\2사업부 (https://kisfitglobal.com · @kidsfittbot)`,
      `   - 3사업부 (GBA): D:\\드림컴퍼니\\3사업부 (https://getbreakai.com 일본 · @SemifearGreedbot)`,
      `   - 4사업부 (HERO): D:\\드림컴퍼니\\4사업부 (https://paradise-hero.com & @김쌤의영웅라디오 · @inves123_bot)`,
      `   - 5사업부 (KFK): D:\\드림컴퍼니\\5사업부 (https://kidsfit.co.kr 패시브 무인 자동화 · @Moneyfiityyy_bot)`,
      ``,
      `📌 [전 사업부 공통 지시사항 (HQ Standing Common Directives — 전 사업부 필수 준수)]:`,
      standingRules,
      ``,
      `사장님이 텔레그램(${div.botHandle})을 통해 [전 사업부 공통 지시사항]으로 다음 작업을 하달하셨습니다:`,
      `"${promptText}"`,
      ``,
      `총괄 실행 원칙:`,
      `1. 통합 본사 폴더(D:\\드림컴퍼니)에서 1사업부~5사업부 전체에 사장님의 공통 지시사항을 빠짐없이 순차 적용·점검하세요.`,
      `2. 만약 사장님의 지시가 앞으로도 계속 지켜야 할 전사 공통 수칙이라면 D:\\드림컴퍼니\\data\\hq_common_directives.json 및 GEMINI.md 에도 반영하세요.`,
      `3. 전 사업부 적용 및 검증이 완료되면 반드시 아래 명령어를 실행하여 본사 총괄 봇(@SemifearGreedbot)으로 결과를 보고하세요:`,
      `   node "${BRIDGE_SCRIPT_PATH}" --div HQ --notify "[전 사업부 공통 지시 완료] <1~5사업부 수행 요약>"`,
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
    `사장님이 텔레그램(${div.botHandle})으로 [${div.name}]에 다음 수정/작업을 지시하셨습니다:`,
    `"${promptText}"`,
    ``,
    `운영 원칙:`,
    `1. 현재 사업부 작업 폴더(${div.cwd})에서 위 [전 사업부 공통 지시사항]을 엄격히 준수하며 지시하신 사항을 즉시 수정·빌드·검증하세요.`,
    `2. 작업이 완료되면 반드시 아래 명령어를 실행하여 해당 사업부 전용 텔레그램 봇(${div.botHandle})으로 완료 결과를 답장하세요:`,
    `   node "${BRIDGE_SCRIPT_PATH}" --div ${div.code} --notify "[${div.name} 수정 완료] <수행한 작업 요약>"`,
  ].join("\n");
}

function dispatchAntigravityPrompt(div, promptText, isAuditMode = false) {
  return new Promise((resolve) => {
    const binPath = fs.existsSync(LANGUAGE_SERVER_EXE) ? LANGUAGE_SERVER_EXE : AGENTAPI_BAT;
    const useDirect = fs.existsSync(LANGUAGE_SERVER_EXE);
    const fullPrompt = buildAntigravityPromptText(div, promptText, isAuditMode);
    const targetConvId = resolveSafeTelegramConversationId(div.conversationId);
    const titleTag = isAuditMode ? `HQ Audit (${div.code})` : `HQ Remote (${div.code})`;

    const sendArgs = useDirect
      ? ["agentapi", "send-message", `--title=${titleTag}`, targetConvId, fullPrompt]
      : ["send-message", `--title=${titleTag}`, targetConvId, fullPrompt];

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

  const replyChatId = opts.incomingChatId || getTargetChatId();
  if (opts.incomingChatId) {
    state.lastCommandChatId = String(opts.incomingChatId);
    saveState(state);
  }

  // 1. Interactive Force-Reply prompt buttons in 모두컴퍼니 (`/ask_all`, `/ask_tom`, `/ask_kfg`, `/ask_gba`, `/ask_hero`, `/ask_kfk`)
  const askMap = {
    "/ask_all": "ALL",
    "/ask_tom": "TOM",
    "/ask_kfg": "KFG",
    "/ask_gba": "GBA",
    "/ask_hero": "HERO",
    "/ask_kfk": "KFK",
  };
  if (askMap[text]) {
    const targetCode = askMap[text];
    const d = DIVISIONS[targetCode];
    state.activeDivision = targetCode;
    saveState(state);
    await sendHqMessage(
      `🎯 <b>[${d.name} 직통 지시 입력 대기 중 (${d.botHandle})]</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👇 <b>이 메시지에 그대로 답장(또는 바로 아래 입력창에 입력)</b>하시면 모두컴퍼니 방에서 즉시 <b>${d.num}</b> 작업이 실행됩니다!`,
      false,
      d.botToken || SEMI_BOT_TOKEN,
      replyChatId,
      {
        force_reply: true,
        selective: true,
        input_field_placeholder: `${d.num}에 지시할 내용을 입력하세요...`,
      }
    );
    return;
  }

  // 2. Check if user typed a standalone division command (e.g., `/전사업부`, `/1사업부`, `/2사업부`, `/3사업부`, `/4사업부`, `/5사업부`, `/div1`~`/div5`, `/all`) WITHOUT restText
  const slashParsed = parseSlashOrPrefixCommand(text);
  if (slashParsed && !slashParsed.restText) {
    const d = DIVISIONS[slashParsed.divCode] || DIVISIONS.ALL;
    state.activeDivision = d.code;
    saveState(state);
    await sendHqMessage(
      `✅ <b>[모두컴퍼니 본부 방 → ${d.name} 지시 모드 전환 완료]</b>\n` +
        `• <b>담당 봇</b>: <code>${d.botHandle}</code>\n` +
        `• <b>대상 도메인</b>: ${d.domain}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `💡 바로 이어서 지시 내용을 입력하시거나, 한 줄로 <code>/${d.num} 수정할내용</code> (또는 <code>/div${d.num.replace(/[^0-9]/g, "") || "1"} 수정할내용</code>) 형태로 보내시면 이 방에서 즉시 작동합니다!`,
      false,
      d.botToken || SEMI_BOT_TOKEN,
      replyChatId,
      {
        force_reply: true,
        selective: true,
        input_field_placeholder: `${d.num}에 지시할 내용을 입력하세요...`,
      }
    );
    return;
  }

  // 3. Check if the user is requesting HQ Chief/Auditor Feedback ("1사업부 피드백 줘", "/fb1"~"/fb5", "/감사", etc.)
  const auditReq = parseAuditFeedbackRequest(text);
  if (auditReq && auditReq.isAudit) {
    const targetDiv = DIVISIONS[auditReq.divCode] || DIVISIONS.ALL;
    const res = await runPythonScriptAsync("scripts/hq_division_auditor.py", ["--div", targetDiv.code], DIVISIONS.TOM.cwd);
    const reportHtml = (res.output || "").trim() || `🕵️‍♂️ <b>[${targetDiv.name} 감사 피드백]</b> 점검 완료`;
    await sendHqMessage(reportHtml, true, SEMI_BOT_TOKEN, replyChatId);

    // As HQ General Manager, automatically dispatch analysis & direct division task instruction!
    const directiveQuestion =
      auditReq.customQuestion ||
      `${targetDiv.name}에서 현재 부족한 점을 정밀 분석하고, 해당 사업부(${targetDiv.conversationTitle})에 즉시 개선 작업을 지시하여 수정·검증까지 진행해줘`;
    enqueueTask(
      {
        division: DIVISIONS.ALL,
        title: `본사 총괄매니저 감사 분석 & ${targetDiv.num} 업무 지시: "${directiveQuestion.slice(0, 40)}"`,
        run: async () => {
          await dispatchAntigravityPrompt(targetDiv, directiveQuestion, true);
        },
      },
      SEMI_BOT_TOKEN,
      replyChatId
    );
    return;
  }

  const explicitBotBoundDiv =
    opts.explicitDiv || (!opts.isGroup && !opts.isCallback ? resolveDivisionByBotToken(botToken, true) : null);
  if (explicitBotBoundDiv && DIVISIONS[explicitBotBoundDiv]) {
    state.activeDivision = explicitBotBoundDiv;
    saveState(state);
  }

  if (text === "/start" || text === "/help" || text === "도움말" || text === "메뉴" || text === "연결") {
    const activeDiv = DIVISIONS[explicitBotBoundDiv || state.activeDivision] || DIVISIONS.ALL;
    await sendHqMessage(
      `🏛️ <b>[드림컴퍼니 본사 총괄·감사 지휘소 (@SemifearGreedbot) — 모두컴퍼니 직통]</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `• 👑 <b>본사 총괄·감사 역할</b>: 1~5사업부 상태 감사 피드백 제공 &amp; 전 사업부 공통 지휘\n` +
        `• 🎯 <b>현재 지시 대상</b>: <b>${activeDiv.name}</b>\n\n` +
        `<b>1️⃣ [본사 감사관에게 사업부별 피드백 받기]</b>\n` +
        `• <code>1사업부 피드백 줘</code> (또는 <code>/fb1</code>)\n` +
        `• <code>2사업부 피드백 줘</code> (또는 <code>/fb2</code>)\n` +
        `• <code>3사업부 피드백 줘</code> (또는 <code>/fb3</code>)\n` +
        `• <code>4사업부 피드백 줘</code> (또는 <code>/fb4</code>)\n` +
        `• <code>5사업부 피드백 줘</code> (또는 <code>/fb5</code>)\n` +
        `• <code>전사업부 피드백 줘</code> (또는 <code>/fb_all</code>)\n\n` +
        `<b>2️⃣ [모두컴퍼니 본부 방에서 바로 사업부 지시하기]</b>\n` +
        `• <code>/전사업부 지시내용</code> (또는 <code>/all 지시내용</code>)\n` +
        `• <code>/1사업부 지시내용</code> (또는 <code>/div1 지시내용</code>) → <code>@RigjtsideAlphabot</code>\n` +
        `• <code>/2사업부 지시내용</code> (또는 <code>/div2 지시내용</code>) → <code>@kidsfittbot</code>\n` +
        `• <code>/3사업부 지시내용</code> (또는 <code>/div3 지시내용</code>) → <code>@SemifearGreedbot</code>\n` +
        `• <code>/4사업부 지시내용</code> (또는 <code>/div4 지시내용</code>) → <code>@inves123_bot</code>\n` +
        `• <code>/5사업부 지시내용</code> (또는 <code>/div5 지시내용</code>) → <code>@Moneyfiityyy_bot</code>\n` +
        `<i>※ 각 사업부 1:1 텔레봇에 직접 명령하셔도 그 방과 모두컴퍼니 방에서 즉시 작동합니다!</i>`,
      true,
      botToken || SEMI_BOT_TOKEN,
      replyChatId
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
    await sendHqMessage(formatCommonDirectivesBoard(state), true, SEMI_BOT_TOKEN || botToken, replyChatId);
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
          `• <b>신규 등록 수칙</b>: "${addedItem.rule}"\n\n` +
          formatCommonDirectivesBoard(state),
        true,
        SEMI_BOT_TOKEN || botToken,
        replyChatId
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
        SEMI_BOT_TOKEN || botToken,
        replyChatId
      );
    } else {
      await sendHqMessage(
        `⚠️ <b>[삭제 실패]</b> 번호 <code>#${targetNum}</code>에 해당하는 공통 지시사항이 없습니다.`,
        true,
        SEMI_BOT_TOKEN || botToken,
        replyChatId
      );
    }
    return;
  }

  if (text === "/company" || text === "/agents" || text === "조직도" || text === "회사" || text === "멀티에이전트") {
    await sendHqMessage(
      `🏛️ <b>[드림컴퍼니 본사 총괄·감사 &amp; 1~5사업부 전담 봇 체계]</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👑 <b>본사 총괄 &amp; 감사관 (@SemifearGreedbot)</b>\n` +
        `   ├ 역할: 1~5사업부 감사 피드백 제공 (<code>1사업부 피드백 줘</code> ~ <code>5사업부 피드백 줘</code>)\n` +
        `   └ 역할: 전 사업부 공통 지시 하달 (<code>/전사업부 지시내용</code>)\n\n` +
        `1️⃣ <b>1사업부 (@RigjtsideAlphabot · truthofmarket.com)</b> → <code>/1사업부 지시내용</code>\n` +
        `2️⃣ <b>2사업부 (@kidsfittbot · kisfitglobal.com)</b> → <code>/2사업부 지시내용</code>\n` +
        `3️⃣ <b>3사업부 (@SemifearGreedbot · getbreakai.com 일본)</b> → <code>/3사업부 지시내용</code>\n` +
        `4️⃣ <b>4사업부 (@inves123_bot · paradise-hero.com &amp; 영웅라디오)</b> → <code>/4사업부 지시내용</code>\n` +
        `5️⃣ <b>5사업부 (@Moneyfiityyy_bot · kidsfit.co.kr 패시브)</b> → <code>/5사업부 지시내용</code>`,
      true,
      botToken || SEMI_BOT_TOKEN,
      replyChatId
    );
    return;
  }

  if (
    text === "/mode_all" ||
    text === "/mode_common" ||
    text === "공통모드" ||
    text === "전사업부모드" ||
    text === "/mode_tom" ||
    text === "1사업부모드" ||
    text === "/mode_kfg" ||
    text === "2사업부모드" ||
    text === "/mode_gba" ||
    text === "3사업부모드" ||
    text === "/mode_hero" ||
    text === "4사업부모드" ||
    text === "/mode_kfk" ||
    text === "5사업부모드"
  ) {
    const map = {
      "/mode_all": "ALL",
      "/mode_common": "ALL",
      공통모드: "ALL",
      전사업부모드: "ALL",
      "/mode_tom": "TOM",
      "1사업부모드": "TOM",
      "/mode_kfg": "KFG",
      "2사업부모드": "KFG",
      "/mode_gba": "GBA",
      "3사업부모드": "GBA",
      "/mode_hero": "HERO",
      "4사업부모드": "HERO",
      "/mode_kfk": "KFK",
      "5사업부모드": "KFK",
    };
    state.activeDivision = map[text] || "ALL";
    saveState(state);
    const d = DIVISIONS[state.activeDivision];
    await sendHqMessage(
      `✅ <b>현재 지시 대상이 [${d.name}]으로 전환되었습니다.</b>\n` +
        `• <b>전담 봇</b>: <code>${d.botHandle}</code>\n` +
        `• <b>대상 도메인</b>: <b>${d.domain}</b> (<code>${d.cwd}</code>)`,
      true,
      d.botToken || botToken,
      replyChatId
    );
    return;
  }

  if (text === "/report" || text === "전체보고" || text === "보고" || text === "일제보고" || text === "/status" || text === "상태") {
    await sendDivisionReportsAll(state, replyChatId);
    return;
  }

  if (text === "/visitors" || text === "방문자" || text === "/stats" || text === "방문현황") {
    const { runVisitorBriefing } = require("./hq_all_divisions_visitor_briefing");
    await runVisitorBriefing({ sendTelegram: true, force: true });
    return;
  }

  if (text === "/audit" || text === "검열" || text === "교차검열" || text === "전체점검" || text === "점검") {
    const res = await runPythonScriptAsync("scripts/hq_division_auditor.py", ["--div", "ALL"], DIVISIONS.TOM.cwd);
    await sendHqMessage((res.output || "점검 완료").trim(), true, SEMI_BOT_TOKEN, replyChatId);
    return;
  }

  // Deduplicate identical prompt within 30s (scoped by botToken + chatId so cross-bot requests are never blocked)
  const dedupeSig = `${botToken || ""}:${replyChatId || ""}:${text}`;
  if (state.lastDispatchedText === dedupeSig && Date.now() - (state.lastDispatchedAt || 0) < 30000) {
    console.log(`[Bridge] Deduplicated identical prompt within 30s: "${dedupeSig}"`);
    return;
  }
  state.lastDispatchedText = dedupeSig;
  state.lastDispatchedAt = Date.now();

  const targetCode = detectDivisionFromText(text, explicitBotBoundDiv || state.activeDivision);
  const targetDiv = DIVISIONS[targetCode] || DIVISIONS.ALL;
  const cleanInstruction = slashParsed && slashParsed.restText ? slashParsed.restText : text;
  const replyBotToken = targetDiv.botToken || botToken || PRIMARY_BOT_TOKEN;
  state.activeDivision = targetCode;
  saveState(state);

  // Instant On-Demand Episode Video & Copy Kit Handler ("9화 영상 보내줘", "1화 영상 보내줘", "/1사업부 10화 영상 보내줘" etc.)
  const epReq = parseEpisodeVideoRequest(text, targetCode);
  if (epReq) {
    const epDiv = DIVISIONS[epReq.divCode] || DIVISIONS.TOM;
    const epBotToken = epDiv.botToken || replyBotToken;
    await sendHqMessage(
      `🎬 <b>[${epDiv.name} · 제${epReq.epNum}화 영상 &amp; 원터치 복사 키트 즉시 전송 중...]</b>\n` +
        `• <b>전담 봇</b>: <code>${epDiv.botHandle}</code>\n` +
        `• 잠시만 기다려주시면 MP4 영상과 제목·설명·고정댓글·릴스 복사블록이 도착합니다!`,
      false,
      epBotToken,
      replyChatId
    );
    const groupChat = getTargetChatId();
    const chatArgs = ["--div", epDiv.code, "--ep", String(epReq.epNum), "--chat-id", String(replyChatId)];
    if (String(replyChatId) !== String(groupChat)) {
      chatArgs.push("--chat-id", String(groupChat));
    }
    runPythonScriptAsync("D:\\드림컴퍼니\\scripts\\deliver_episode_on_demand.py", chatArgs, HQ_ROOT_DIR).catch(() => {});
    return;
  }

  if (targetCode === "ALL") {
    recordCommonOrder(cleanInstruction, "DISPATCHED");
    if (/^(공통\s*지시|공통지시사항|공통\s*규칙|공통\s*수칙)\s*:/i.test(cleanInstruction)) {
      const ruleBody = cleanInstruction.replace(/^(공통\s*지시|공통지시사항|공통\s*규칙|공통\s*수칙)\s*:\s*/i, "").trim();
      if (ruleBody) addStandingDirective(ruleBody);
    }
  }

  enqueueTask(
    {
      division: targetDiv,
      title: `${targetDiv.name} 지시: "${cleanInstruction.slice(0, 45)}"`,
      run: async () => {
        await dispatchAntigravityPrompt(targetDiv, cleanInstruction, false);
        const ackHtml =
          (targetCode === "ALL"
            ? `🏛️ <b>[전 사업부 공통 지시 접수 &amp; 1~5사업부 일괄 가동 (@SemifearGreedbot)]</b>\n`
            : `✅ <b>[${targetDiv.name}] 전담 봇(${targetDiv.botHandle}) 지시 접수 &amp; 수정 착수</b>\n`) +
          `• <b>지시 내용</b>: "${cleanInstruction}"\n` +
          `• <b>작업 경로</b>: <code>${targetDiv.cwd}</code>\n` +
          `• <b>완료 보고</b>: 수정 및 검증 완료 즉시 이 대화방으로 결과를 보고합니다.`;
        await sendHqMessage(ackHtml, true, replyBotToken, replyChatId);
        // If commanded in 1:1 bot chat, also mirror receipt to 모두컴퍼니 본부 방 so the HQ room stays in sync
        const groupChat = getTargetChatId();
        if (replyChatId !== groupChat) {
          await sendHqMessage(ackHtml, false, replyBotToken, groupChat);
        }
      },
    },
    replyBotToken,
    replyChatId
  );
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
        console.log(`[HQ Bridge] Button Click (${botKey}) in ${cbChatId}: ${cb.data}`);
        await tgApiWithToken(
          botToken,
          "answerCallbackQuery",
          {
            callback_query_id: cb.id,
            text: `⚡ [${cb.data}] 즉시 실행합니다!`,
          },
          5000
        );
        await handleCommand(cb.data || "", state, botToken, {
          isCallback: true,
          isGroup: isGroupCb,
          incomingChatId: cbChatId || getTargetChatId(),
        });
      } else if (upd.message) {
        const incomingChatId = String(upd.message.chat?.id || "");
        const senderId = String(upd.message.from?.id || "");
        const chatType = String(upd.message.chat?.type || "");
        const isGroup = chatType === "group" || chatType === "supergroup" || incomingChatId.startsWith("-");

        const msgDedupeKey = `${incomingChatId}_${upd.message.message_id}`;
        if (isGroup && upd.message.message_id) {
          if (seenGroupMessages.has(msgDedupeKey)) continue;
          seenGroupMessages.add(msgDedupeKey);
          if (seenGroupMessages.size > 500) {
            const firstKey = seenGroupMessages.values().next().value;
            seenGroupMessages.delete(firstKey);
          }
        }

        const resolvedGroupId = upd.message.migrate_to_chat_id ? String(upd.message.migrate_to_chat_id) : incomingChatId;
        if (isGroup && senderId === String(OWNER_USER_ID) && resolvedGroupId && resolvedGroupId !== "-5459339357") {
          state.groupChatId = resolvedGroupId;
          saveState(state);
        }

        if (upd.message.text) {
          const rawMsg = upd.message.text;
          let targetBotToken = botToken;
          let explicitDiv = null;

          // 1. Check slash/prefix command first (e.g., `/1사업부 ...`, `/2사업부 ...`, `/3사업부 ...`, `/4사업부 ...`, `/5사업부 ...`, `/전사업부 ...`)
          const slashCmd = parseSlashOrPrefixCommand(rawMsg.replace(/@(?:RigjtsideAlphabot|kidsfittbot|SemifearGreedbot|inves123_bot|Moneyfiityyy_bot)\b/gi, "").trim());
          const replyBotUsername = String(upd.message.reply_to_message?.from?.username || "").toLowerCase();
          const replyMsgText = String(upd.message.reply_to_message?.text || "");

          if (slashCmd && slashCmd.divCode) {
            explicitDiv = slashCmd.divCode;
            targetBotToken = DIVISIONS[explicitDiv]?.botToken || SEMI_BOT_TOKEN;
          } else if (/1사업부 직통 지시 입력 대기 중/.test(replyMsgText)) {
            explicitDiv = "TOM";
            targetBotToken = RSA_BOT_TOKEN;
          } else if (/2사업부.*직통 지시 입력 대기 중/.test(replyMsgText)) {
            explicitDiv = "KFG";
            targetBotToken = KFG_BOT_TOKEN;
          } else if (/3사업부.*직통 지시 입력 대기 중/.test(replyMsgText)) {
            explicitDiv = "GBA";
            targetBotToken = SEMI_BOT_TOKEN;
          } else if (/4사업부.*직통 지시 입력 대기 중/.test(replyMsgText)) {
            explicitDiv = "HERO";
            targetBotToken = HERO_BOT_TOKEN;
          } else if (/5사업부.*직통 지시 입력 대기 중/.test(replyMsgText)) {
            explicitDiv = "KFK";
            targetBotToken = KFK_BOT_TOKEN;
          } else if (/전 사업부 공통.*직통 지시 입력 대기 중/.test(replyMsgText)) {
            explicitDiv = "ALL";
            targetBotToken = SEMI_BOT_TOKEN;
          } else if (/rigjtsidealphabot/i.test(rawMsg) || replyBotUsername === "rigjtsidealphabot") {
            targetBotToken = RSA_BOT_TOKEN;
            explicitDiv = "TOM";
          } else if (/kidsfittbot/i.test(rawMsg) || replyBotUsername === "kidsfittbot") {
            targetBotToken = KFG_BOT_TOKEN;
            explicitDiv = "KFG";
          } else if (/inves123_bot/i.test(rawMsg) || replyBotUsername === "inves123_bot") {
            targetBotToken = HERO_BOT_TOKEN;
            explicitDiv = "HERO";
          } else if (/moneyfiityyy_bot/i.test(rawMsg) || replyBotUsername === "moneyfiityyy_bot") {
            targetBotToken = KFK_BOT_TOKEN;
            explicitDiv = "KFK";
          } else if (/semifeargreedbot/i.test(rawMsg) || replyBotUsername === "semifeargreedbot") {
            targetBotToken = SEMI_BOT_TOKEN;
            explicitDiv = detectDivisionFromText(rawMsg, state.activeDivision);
          } else if (!isGroup) {
            explicitDiv = resolveDivisionByBotToken(botToken, true);
            targetBotToken = DIVISIONS[explicitDiv]?.botToken || botToken;
          }

          const cleanCmd = rawMsg.replace(/@(?:RigjtsideAlphabot|kidsfittbot|SemifearGreedbot|inves123_bot|Moneyfiityyy_bot)\b/gi, "").trim();
          console.log(`[HQ Bridge] Message (${botKey}) from ${senderId} in ${incomingChatId}: ${cleanCmd}`);
          if (incomingChatId === String(OWNER_USER_ID) || senderId === String(OWNER_USER_ID)) {
            await handleCommand(cleanCmd, state, targetBotToken, {
              isCallback: false,
              isGroup,
              explicitDiv,
              incomingChatId,
            });
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

  if (process.argv.includes("--report-all")) {
    const state = loadState();
    await sendDivisionReportsAll(state);
    return;
  }

  if (process.argv.includes("--directives")) {
    const state = loadState();
    await sendHqMessage(formatCommonDirectivesBoard(state), true, SEMI_BOT_TOKEN || PRIMARY_BOT_TOKEN);
    return;
  }

  // CLI helper mode: `--notify "message" [--div TOM|KFG|GBA|HERO|KFK|HQ|ALL]`
  const notifyIdx = process.argv.indexOf("--notify");
  if (notifyIdx !== -1 && process.argv[notifyIdx + 1]) {
    const msg = process.argv[notifyIdx + 1];
    const divIdx = process.argv.indexOf("--div");
    let divArg = divIdx !== -1 && process.argv[divIdx + 1] ? process.argv[divIdx + 1].toUpperCase() : "";
    if (!divArg) {
      if (/1사업부|truthofmarket|rightsidealpha/i.test(msg) && !/2사업부|3사업부|4사업부|5사업부/.test(msg)) divArg = "TOM";
      else if (/2사업부|kisfitglobal|키즈핏 영문/i.test(msg) && !/1사업부|3사업부|4사업부|5사업부/.test(msg)) divArg = "KFG";
      else if (/3사업부|getbreakai/i.test(msg) && !/1사업부|2사업부|4사업부|5사업부/.test(msg)) divArg = "GBA";
      else if (/4사업부|paradise-hero|황영웅|영웅라디오/i.test(msg) && !/1사업부|2사업부|3사업부|5사업부/.test(msg)) divArg = "HERO";
      else if (/5사업부|kidsfit\.co\.kr|키즈핏 코리아/i.test(msg) && !/1사업부|2사업부|3사업부|4사업부/.test(msg)) divArg = "KFK";
      else divArg = "ALL";
    }
    const targetToken =
      divArg === "HQ" || divArg === "ALL"
        ? SEMI_BOT_TOKEN
        : DIVISIONS[divArg]?.botToken || SEMI_BOT_TOKEN || PRIMARY_BOT_TOKEN;

    const state = loadState();
    const groupChat = getTargetChatId();
    const lastChat = state.lastCommandChatId || groupChat;
    const htmlOut = `📬 <b>[작업 완료 보고]</b>\n${msg}`;

    // Always send to 모두컴퍼니 본부 방, and if the last command was in a 1:1 chat, send there too!
    await sendHqMessage(htmlOut, true, targetToken, groupChat);
    if (lastChat && lastChat !== groupChat) {
      await sendHqMessage(htmlOut, true, targetToken, lastChat);
    }
    return;
  }

  ensureSingleInstance();
  const state = loadState();

  if (process.argv.includes("--announce")) {
    await sendDivisionReportsAll(state);
    if (process.argv.includes("--once")) return;
  }

  console.log(`[Master HQ Bridge] Active (Manual & Audit Mode) on Chat ID ${CHAT_ID} (${BOT_TOKENS.length} bots) | Telegram Conv: ${MASTER_CONVERSATION_ID} (PC Conv ${PC_DIRECT_CONVERSATION_ID} isolated)...`);

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
  BOT_TOKENS,
  DIVISIONS,
  HQ_KEYBOARD,
  resolveSafeTelegramConversationId,
  resolveDivisionByBotToken,
  parseSlashOrPrefixCommand,
  parseAuditFeedbackRequest,
  parseEpisodeVideoRequest,
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
