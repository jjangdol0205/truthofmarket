#!/usr/bin/env node
/**
 * Verification Suite: Telegram Channel Separation & All-Divisions Common Directives
 * - Verifies Telegram Dedicated Channel (1921e31e-ab59-4720-9419-93cac770374d) vs PC Direct Channel (dbc61f0a-76cb-48e3-b617-a616c069564c)
 * - Verifies DIVISIONS.ALL (/mode_all), /directives board, standing directives CRUD, and prompt injection
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

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
console.log("  HQ Telegram Bridge: Channel Separation & Common Directives Tests");
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

test("3. All divisions (ALL, TOM, KFG, KFK) route exclusively to 1921e31e-ab59-4720-9419-93cac770374d", () => {
  for (const code of ["ALL", "TOM", "KFG", "KFK"]) {
    assert.ok(bridge.DIVISIONS[code], `Missing division ${code}`);
    assert.strictEqual(
      bridge.DIVISIONS[code].conversationId,
      EXPECTED_TG_CONV_ID,
      `Division ${code} has wrong conversationId: ${bridge.DIVISIONS[code].conversationId}`
    );
  }
});

test("4. 1사업부, 2사업부, 3사업부 .env files all point ANTIGRAVITY_CONVERSATION_ID to Telegram channel", () => {
  for (const envPath of [
    "D:\\드림컴퍼니\\1사업부\\.env",
    "D:\\드림컴퍼니\\2사업부\\.env",
    "D:\\드림컴퍼니\\3사업부\\.env",
  ]) {
    const raw = fs.readFileSync(envPath, "utf8");
    assert.ok(
      raw.includes(`ANTIGRAVITY_CONVERSATION_ID=${EXPECTED_TG_CONV_ID}`),
      `${envPath} missing ANTIGRAVITY_CONVERSATION_ID=${EXPECTED_TG_CONV_ID}`
    );
    assert.ok(
      raw.includes(`PC_DIRECT_CONVERSATION_ID=${EXPECTED_PC_CONV_ID}`),
      `${envPath} missing PC_DIRECT_CONVERSATION_ID=${EXPECTED_PC_CONV_ID}`
    );
  }
});

test("5. HQ_KEYBOARD top row exposes /mode_all and /directives buttons", () => {
  const topRow = bridge.HQ_KEYBOARD.inline_keyboard[0];
  assert.ok(Array.isArray(topRow) && topRow.length === 2);
  assert.strictEqual(topRow[0].callback_data, "/mode_all");
  assert.strictEqual(topRow[1].callback_data, "/directives");
});

test("6. detectDivisionFromText routes common directive prefixes & keywords to ALL", () => {
  assert.strictEqual(bridge.detectDivisionFromText("[공통] 모바일 폰트 크기 점검해", "TOM"), "ALL");
  assert.strictEqual(bridge.detectDivisionFromText("공통: 푸터 문구 통일해", "KFG"), "ALL");
  assert.strictEqual(bridge.detectDivisionFromText("공통지시: 버튼 반응속도 개선", "KFK"), "ALL");
  assert.strictEqual(bridge.detectDivisionFromText("전사업부: 이미지 최적화", "TOM"), "ALL");
  assert.strictEqual(bridge.detectDivisionFromText("전 사업부 홈페이지 속도 점검해줘", "TOM"), "ALL");
  assert.strictEqual(bridge.detectDivisionFromText("모든 사업부 배너 확인해", "KFG"), "ALL");
  assert.strictEqual(bridge.detectDivisionFromText("1·2·3사업부 전체 점검", "KFK"), "ALL");
  // When in /mode_all, plain messages stay in ALL unless prefixed with [1사업부]/[2사업부]/[3사업부]
  assert.strictEqual(bridge.detectDivisionFromText("메인 화면 버튼 색상 더 눈에 띄게 수정해줘", "ALL"), "ALL");
  assert.strictEqual(bridge.detectDivisionFromText("[1사업부] 차트 색상 수정", "ALL"), "TOM");
  assert.strictEqual(bridge.detectDivisionFromText("[2사업부] 영문 오타 확인", "ALL"), "KFG");
  assert.strictEqual(bridge.detectDivisionFromText("[3사업부] 쿠팡 배너 확인", "ALL"), "KFK");
});

test("7. Standing Directives CRUD (addStandingDirective / removeStandingDirective) & Markdown sync", () => {
  const before = bridge.loadCommonDirectives();
  const initialCount = before.standingDirectives.length;
  assert.ok(initialCount >= 4, "Expected at least 4 core standing directives");

  const testRule = "테스트용 임시 전 사업부 공통 수칙 (자동 삭제 검증)";
  const afterAdd = bridge.addStandingDirective(testRule, "테스트 수칙");
  assert.strictEqual(afterAdd.standingDirectives.length, initialCount + 1);
  const addedId = afterAdd.standingDirectives[afterAdd.standingDirectives.length - 1].id;

  const mdContent = fs.readFileSync("D:\\드림컴퍼니\\docs\\HQ_COMMON_DIRECTIVES.md", "utf8");
  assert.ok(mdContent.includes(testRule), "Markdown file should include newly added directive");

  const afterRemove = bridge.removeStandingDirective(addedId);
  assert.strictEqual(afterRemove.ok, true);
  assert.strictEqual(afterRemove.data.standingDirectives.length, initialCount);
});

test("8. buildAntigravityPromptText injects Standing Common Directives into ALL and individual divisions", () => {
  const promptAll = bridge.buildAntigravityPromptText(bridge.DIVISIONS.ALL, "전 사업부 속도 최적화");
  assert.ok(promptAll.includes("전 사업부 공통 지시사항"), "ALL prompt missing common directives header");
  assert.ok(promptAll.includes(EXPECTED_TG_CONV_ID), "ALL prompt missing Telegram dedicated conversation ID");
  assert.ok(promptAll.includes("1사업부 (TOM)"), "ALL prompt missing Division 1");
  assert.ok(promptAll.includes("2사업부 (KFG)"), "ALL prompt missing Division 2");
  assert.ok(promptAll.includes("3사업부 (KFK)"), "ALL prompt missing Division 3");

  for (const code of ["TOM", "KFG", "KFK"]) {
    const p = bridge.buildAntigravityPromptText(bridge.DIVISIONS[code], "개별 사업부 점검");
    assert.ok(
      p.includes("📌 [전 사업부 공통 지시사항 (HQ Standing Common Directives — 전 사업부 필수 준수)]:"),
      `Division ${code} prompt missing injected standing common directives`
    );
    assert.ok(
      p.includes("안티그래비티 채널 이원화"),
      `Division ${code} prompt missing standing directive #1`
    );
  }
});

console.log("==================================================================");
console.log(`  Summary: ${passed}/${total} checks passed.`);
console.log("==================================================================");
