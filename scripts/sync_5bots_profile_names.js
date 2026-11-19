#!/usr/bin/env node
/**
 * scripts/sync_5bots_profile_names.js
 * 1사업부 ~ 5사업부 텔레그램 봇 이름(setMyName), 설명(setMyDescription / setMyShortDescription), 명령어(setMyCommands) 일괄 표준화 스크립트
 * (각 사업부 .env의 라이브 토큰을 직접 로드하며 IPv4 직결로 타임아웃 방지)
 */

const fs = require("fs");
const https = require("https");

function loadEnv(envPath) {
  const out = {};
  if (!fs.existsSync(envPath)) return out;
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const eq = t.indexOf("=");
    out[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  return out;
}

function tg(tok, method, body = {}) {
  return new Promise((resolve) => {
    const data = Buffer.from(JSON.stringify(body), "utf8");
    const req = https.request(
      {
        hostname: "api.telegram.org",
        port: 443,
        family: 4,
        path: `/bot${tok}/${method}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": data.length,
        },
        timeout: 12000,
      },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            resolve({ ok: false, raw });
          }
        });
      }
    );
    req.on("error", (e) => resolve({ ok: false, error: e.message }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ ok: false, error: "timeout" });
    });
    req.write(data);
    req.end();
  });
}

const tomEnv = loadEnv("D:\\드림컴퍼니\\1사업부\\.env");
const kfgEnv = loadEnv("D:\\드림컴퍼니\\2사업부\\.env");
const gbaEnv = loadEnv("D:\\드림컴퍼니\\3사업부\\.env");
const heroEnv = loadEnv("D:\\드림컴퍼니\\4사업부\\.env");
const kfkEnv = loadEnv("D:\\드림컴퍼니\\5사업부\\.env");

const BOTS = [
  {
    div: "1사업부 (TOM)",
    handle: "@RigjtsideAlphabot",
    tok: tomEnv.RSA_TELEGRAM_BOT_TOKEN,
    name: "[1사업부] TruthOfMarket (미국주식)",
    desc: "[1사업부] https://truthofmarket.com — 미국주식 72종목 PW-RSI · 반도체 공포탐욕 · SMH:XLV 바벨 전략 전담 봇",
  },
  {
    div: "2사업부 (KFG)",
    handle: "@kidsfittbot",
    tok: kfgEnv.TELEGRAM_BOT_TOKEN,
    name: "[2사업부] KISFIT Global (영문)",
    desc: "[2사업부] https://kisfitglobal.com — 글로벌 소아성장 예측(US CDC 2000 LMS & Khamis-Roche) 전담 봇",
  },
  {
    div: "3사업부 (GBA) & 본사 총괄·감사",
    handle: "@SemifearGreedbot",
    tok: gbaEnv.TELEGRAM_BOT_TOKEN,
    name: "[3사업부 · 본사] GetBreakAI (일본퀀트)",
    desc: "[본사 총괄·감사 & 3사업부] 1~5사업부 감사 피드백 제공 & https://getbreakai.com/jp/ 일본 퀀트 전담 봇",
  },
  {
    div: "4사업부 (HERO)",
    handle: "@inves123_bot",
    tok: heroEnv.TELEGRAM_BOT_TOKEN,
    name: "[4사업부] 파라다이스히어로 · 영웅라디오",
    desc: "[4사업부] https://paradise-hero.com & @김쌤의영웅라디오 — 황영웅 팬덤 플랫폼 · 골드 VIP · 15분 시니어 롱폼 라디오 전담 봇",
  },
  {
    div: "5사업부 (KFK)",
    handle: "@Moneyfiityyy_bot",
    tok: kfkEnv.TELEGRAM_BOT_TOKEN,
    name: "[5사업부] KidsFit Korea (패시브)",
    desc: "[5사업부] https://kidsfit.co.kr — 키즈핏 코리아 100% 패시브 무인 자동화 유지보수 & 제휴 커머스 전담 봇",
  },
];

const COMMANDS = [
  { command: "all_status", description: "📊 5개 사업부 봇 통합 관제 현황 (<1초 응답)" },
  { command: "status", description: "🟢 현재 사업부 봇 및 워커 실시간 상태 확인" },
  { command: "live_audit", description: "🔍 외부 실서버 및 유튜브 채널 적대적 감사" },
  { command: "report", description: "📋 1~5사업부 5개 봇 일제 현황 보고" },
  { command: "div1", description: "🎯 1사업부 지시 (예: /div1 지시내용 또는 [미국] 지시내용)" },
  { command: "div2", description: "🎯 2사업부 지시 (예: /div2 지시내용 또는 [글로벌키즈] 지시내용)" },
  { command: "div3", description: "🎯 3사업부 지시 (예: /div3 지시내용 또는 [일본] 지시내용)" },
  { command: "div4", description: "🎯 4사업부 지시 (예: /div4 지시내용 또는 [영웅] 지시내용)" },
  { command: "div5", description: "🎯 5사업부 지시 (예: /div5 지시내용 또는 [한국키즈] 지시내용)" },
  { command: "all", description: "🏛️ 전사업부 공통 지시 (예: /all 지시내용 또는 /전사업부 지시내용)" },
  { command: "fb_all", description: "🕵️‍♂️ 전사업부 종합 감사 피드백 받기" },
  { command: "fb1", description: "🔍 1사업부 (truthofmarket.com) 감사 피드백" },
  { command: "fb2", description: "🔍 2사업부 (kisfitglobal.com) 감사 피드백" },
  { command: "fb3", description: "🔍 3사업부 (getbreakai.com 일본) 감사 피드백" },
  { command: "fb4", description: "🔍 4사업부 (영웅라디오·파라다이스) 감사 피드백" },
  { command: "fb5", description: "🔍 5사업부 (kidsfit.co.kr 패시브) 감사 피드백" },
  { command: "directives", description: "📌 전 사업부 공통 지시사항 보드" },
  { command: "kill_all", description: "🛑 실행 중인 하위 워커 일괄 강제 회수" },
  { command: "start", description: "🎛️ 전담 사업부 및 본사 통합 리모컨 열기" },
];

(async () => {
  for (const b of BOTS) {
    if (!b.tok) {
      console.error(`${b.div} (${b.handle}) -> MISSING TOKEN`);
      process.exitCode = 1;
      continue;
    }
    const cur = await tg(b.tok, "getMyName", {});
    let setRes = { ok: true, note: "already matched" };
    if (!cur.ok || cur.result?.name !== b.name) {
      setRes = await tg(b.tok, "setMyName", { name: b.name });
    }
    const curSd = await tg(b.tok, "getMyShortDescription", {});
    if (!curSd.ok || curSd.result?.short_description !== b.desc) {
      await tg(b.tok, "setMyDescription", { description: b.desc });
      await tg(b.tok, "setMyShortDescription", { short_description: b.desc });
    }
    const cmdRes = await tg(b.tok, "setMyCommands", { commands: COMMANDS });
    const after = await tg(b.tok, "getMe", {});
    console.log(
      `${b.div} (${b.handle}) -> ok=${Boolean(after.ok)} | first_name: "${after.result?.first_name}" | setMyName: ${Boolean(setRes.ok)} | setMyCommands: ${Boolean(cmdRes.ok)}`
    );
    if (!after.ok || !cmdRes.ok) process.exitCode = 1;
  }
})();
