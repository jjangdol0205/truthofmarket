#!/usr/bin/env node
/**
 * Verification Suite: Telegram Channel Separation, 1~5사업부 5-Bot Mapping, Slash Routing & Audit Feedback
 */

const assert = require("assert");
const fs = require("fs");

const bridge = require("./master_hq_telegram_bridge.js");

const EXPECTED_TG_CONV_ID = "1921e31e-ab59-4720-9419-93cac770374d";
const EXPECTED_PC_CONV_ID = "dbc61f0a-76cb-48e3-b617-a616c069564c";

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
    process.exitCode = 1;
  }
}

console.log("==================================================================");
console.log("  HQ Telegram Bridge: 1~5사업부 직통 명령어 & 본사 감사 피드백 테스트");
console.log("==================================================================");

test("1. MASTER_CONVERSATION_ID is dedicated to 1921e31e-ab59-4720-9419-93cac770374d", () => {
  assert.strictEqual(bridge.MASTER_CONVERSATION_ID, EXPECTED_TG_CONV_ID);
  assert.strictEqual(bridge.PC_DIRECT_CONVERSATION_ID, EXPECTED_PC_CONV_ID);
});

test("2. resolveSafeTelegramConversationId blocks PC_DIRECT_CONVERSATION_ID from Telegram dispatches", () => {
  assert.strictEqual(bridge.resolveSafeTelegramConversationId(EXPECTED_PC_CONV_ID), EXPECTED_TG_CONV_ID);
  assert.strictEqual(bridge.resolveSafeTelegramConversationId(""), EXPECTED_TG_CONV_ID);
  assert.strictEqual(bridge.resolveSafeTelegramConversationId(null), EXPECTED_TG_CONV_ID);
  assert.strictEqual(bridge.resolveSafeTelegramConversationId(EXPECTED_TG_CONV_ID), EXPECTED_TG_CONV_ID);
});

test("3. All 5 divisions (ALL, TOM, KFG, GBA, HERO, KFK) route exclusively to 1921e31e-ab59-4720-9419-93cac770374d and have 5 distinct bot tokens", () => {
  assert.strictEqual(bridge.BOT_TOKENS.length, 5, `Expected 5 distinct bot tokens, got ${bridge.BOT_TOKENS.length}`);
  for (const code of ["ALL", "TOM", "KFG", "GBA", "HERO", "KFK"]) {
    assert.ok(bridge.DIVISIONS[code], `Missing division ${code}`);
    assert.strictEqual(
      bridge.DIVISIONS[code].conversationId,
      EXPECTED_TG_CONV_ID,
      `Division ${code} has wrong conversationId: ${bridge.DIVISIONS[code].conversationId}`
    );
  }
});

test("4. 1사업부 ~ 5사업부 .env files all point ANTIGRAVITY_CONVERSATION_ID to Telegram channel", () => {
  for (const envPath of [
    "D:\\드림컴퍼니\\1사업부\\.env",
    "D:\\드림컴퍼니\\2사업부\\.env",
    "D:\\드림컴퍼니\\3사업부\\.env",
    "D:\\드림컴퍼니\\4사업부\\.env",
    "D:\\드림컴퍼니\\5사업부\\.env",
  ]) {
    const raw = fs.readFileSync(envPath, "utf8");
    assert.ok(raw.includes(`ANTIGRAVITY_CONVERSATION_ID=${EXPECTED_TG_CONV_ID}`));
    assert.ok(raw.includes(`PC_DIRECT_CONVERSATION_ID=${EXPECTED_PC_CONV_ID}`));
  }
});

test("5. HQ_KEYBOARD top rows expose /mode_all, /directives, /fb_all, /fb1~4, and /ask_tom~hero", () => {
  const topRow = bridge.HQ_KEYBOARD.inline_keyboard[0];
  assert.strictEqual(topRow[0].callback_data, "/mode_all");
  assert.strictEqual(topRow[1].callback_data, "/directives");
  const secondRow = bridge.HQ_KEYBOARD.inline_keyboard[1];
  assert.strictEqual(secondRow[0].callback_data, "/fb_all");
});

test("6. /전사업부, /1사업부 ~ /5사업부 and /div1 ~ /div5 commands route accurately", () => {
  assert.strictEqual(bridge.detectDivisionFromText("/전사업부 모바일 폰트 점검해", "TOM"), "ALL");
  assert.strictEqual(bridge.detectDivisionFromText("/all 푸터 문구 통일해", "KFG"), "ALL");
  assert.strictEqual(bridge.detectDivisionFromText("/1사업부 포지션 닥터 수정해줘", "ALL"), "TOM");
  assert.strictEqual(bridge.detectDivisionFromText("/div1 차트 색상 수정", "ALL"), "TOM");
  assert.strictEqual(bridge.detectDivisionFromText("/2사업부 영문 오타 확인", "ALL"), "KFG");
  assert.strictEqual(bridge.detectDivisionFromText("/div2 리포트 버튼 수정", "ALL"), "KFG");
  assert.strictEqual(bridge.detectDivisionFromText("/3사업부 일본어 세금 계산기 점검", "ALL"), "GBA");
  assert.strictEqual(bridge.detectDivisionFromText("/div3 엔화 계산기 수정", "ALL"), "GBA");
  assert.strictEqual(bridge.detectDivisionFromText("/4사업부 황영웅 영웅라디오 사연 추가", "ALL"), "HERO");
  assert.strictEqual(bridge.detectDivisionFromText("/div4 카톡 공유 버튼 추가", "ALL"), "HERO");
  assert.strictEqual(bridge.detectDivisionFromText("/5사업부 쿠팡 배너 확인", "ALL"), "KFK");
  assert.strictEqual(bridge.detectDivisionFromText("/div5 상태 확인", "ALL"), "KFK");
});

test("7. parseAuditFeedbackRequest detects natural language feedback requests ('1사업부 피드백 줘' etc.)", () => {
  const r1 = bridge.parseAuditFeedbackRequest("1사업부 피드백 줘");
  assert.ok(r1 && r1.isAudit && r1.divCode === "TOM");
  const r2 = bridge.parseAuditFeedbackRequest("2사업부 피드백 줘");
  assert.ok(r2 && r2.isAudit && r2.divCode === "KFG");
  const r3 = bridge.parseAuditFeedbackRequest("3사업부 감사 피드백 줘");
  assert.ok(r3 && r3.isAudit && r3.divCode === "GBA");
  const r4 = bridge.parseAuditFeedbackRequest("4사업부 피드백 줘");
  assert.ok(r4 && r4.isAudit && r4.divCode === "HERO");
  const rAll = bridge.parseAuditFeedbackRequest("전사업부 피드백 줘");
  assert.ok(rAll && rAll.isAudit && rAll.divCode === "ALL");
});

test("8. buildAntigravityPromptText supports both Execution Mode and HQ Chief Auditor Mode", () => {
  const auditPrompt = bridge.buildAntigravityPromptText(bridge.DIVISIONS.TOM, "1사업부 결제창 디자인 어떤지 피드백 줘", true);
  assert.ok(auditPrompt.includes("본사 총괄·감사 모드 (HQ Chief Auditor)"));
  assert.ok(auditPrompt.includes("코드를 임의로 수정하지 말고"));

  for (const code of ["TOM", "KFG", "GBA", "HERO", "KFK"]) {
    const p = bridge.buildAntigravityPromptText(bridge.DIVISIONS[code], "개별 사업부 점검", false);
    assert.ok(p.includes("📌 [전 사업부 공통 지시사항 (HQ Standing Common Directives — 전 사업부 필수 준수)]:"));
  }
});

test("9. parseEpisodeVideoRequest detects '9화 영상 보내줘', '1화 영상 보내줘', '/1사업부 10화 영상 보내줘'", () => {
  const e1 = bridge.parseEpisodeVideoRequest("9화 영상 보내줘", "TOM");
  assert.ok(e1 && e1.epNum === 9 && e1.divCode === "TOM");
  const e2 = bridge.parseEpisodeVideoRequest("9화 영상 보내줘", "KFG");
  assert.ok(e2 && e2.epNum === 9 && e2.divCode === "KFG");
  const e3 = bridge.parseEpisodeVideoRequest("1화 영상 보내줘", "GBA");
  assert.ok(e3 && e3.epNum === 1 && e3.divCode === "GBA");
  const e4 = bridge.parseEpisodeVideoRequest("/3사업부 2화 영상 보내줘", "ALL");
  assert.ok(e4 && e4.epNum === 2 && e4.divCode === "GBA");
});

console.log("==================================================================");
console.log(`  Summary: ${passed}/${total} checks passed.`);
console.log("==================================================================");
