# GEMINI.md — 1사업부 TruthOfMarket (`truthofmarket.com`) 절대 규칙 (Ground Rules)

이 문서는 `D:\드림컴퍼니\1사업부` 작업 시 루트 `D:\드림컴퍼니\GEMINI.md`와 100% 일관되게 적용되는 하위 규칙입니다. 모든 대화방(`텔레그램`, `hq_main`, `sns_video`, `seo_monetize`, `payment_pg`)은 반드시 루트 `D:\드림컴퍼니\GEMINI.md` 및 `D:\드림컴퍼니\data\hq_ssot_state.json`과 동일한 기준만 답변·수행합니다.

---

## 1. 법인 정체성 · 전담 CEO 봇 · 호스팅 (SSOT)
- **법인명 / 도메인**: 1사업부 (`TOM` 법인) — **`https://truthofmarket.com`** (**GitHub Pages**, 원격 저장소 `jjangdol0205/truthofmarket.git` `main` 브랜치; `getbreakai.git`은 3사업부 전용이므로 혼동 금지)
- **전담 CEO 봇**: **`@RigjtsideAlphabot`** (`1사업부/.env`의 `RSA_TELEGRAM_BOT_TOKEN`) / 그룹 비서실장·감사관: **`@Allcompany1_bot`** (`D:\드림컴퍼니\.env`의 `HQ_TELEGRAM_BOT_TOKEN`)
- **타깃 & 8대 웹사이트 원칙**: 미국 50~70대 은퇴계좌(`401(k)·IRA`) 투자자 맞춤형 **☀️ Daylight 라이트 기본 테마 + 본문 `18px+` + 상단 메뉴 `<=5개` + 텍스트 과밀 제거** 직관 설계. 상단 티커는 은퇴 코어 4대 자산(`$VOO · $SCHD · $JEPI · $SGOV`)과 `S&P 500 Retirement Weather` 기준으로 통일합니다.
- **핵심 가치 사다리 (Value Ladder)**:
  1. **무료 입문 (`$0`)**: 30초 은퇴 현금흐름 시뮬레이터(`#tom-retirement-architect`) + 미국 3대 증권앱(Fidelity · Charles Schwab · Vanguard) 안전주문·MMF 매뉴얼 (`#tomFreeStarterManual`) + 단일 통합 `Morning Bell Club` (`#tomMorningBellClub` / `#tom-passwordless-club-signup`, Substack형 에디터 레터)
  2. **유료 전환 (`Polar.sh` 글로벌 MoR — `window.PAYMENT_CONFIG`, `PROVIDER: 'polar_sh'`, `lemonsqueezy` `0건`)**:
     - `POLAR_TOM_MONTHLY_URL` / `POLAR_TOM_ANNUAL_URL` 개통 전에는 `STORE_LIVE_READY = false`로 `vip_waitlist` 20% 얼리버드 사전예약 모달이 이탈을 `0%` 방어하며, 개통 즉시 `buy.polar.sh/polar_cl_...` 체크아웃으로 전환됩니다.
     - **체감형 3대 VIP 효능감 베너핏**: ① 내 은퇴자금(`$`) 맞춤 리밸런싱 달러 처방표 · ② `IRA/Roth/과세계좌` 절세 배치 및 12개월 배당 입금 캘린더 · ③ 연 2~4회 신호등 변경 당일 발송 큰글씨 1페이지 액션시트 + 평생 업데이트 14p PDF 마스터북 번들 (`TradingView/CSV/일문 리포트` 등 단타·개발자 문구 배제).

---

## 2. 토큰 폭탄 방지 및 잠근 기능(Locked DOM) 보호
- `dist/`, `frontend/dist/`, `data/stocks_pro_master.json`, `static_api/*.json`을 직접 전체 열람하거나 수동 편집하지 마십시오.
- 반드시 `frontend/src/` 원본을 수정한 뒤 `python scripts/build_static_bundle.py`로 번들을 갱신합니다 (`Zero-Hangul` `[가-힣]` = `0건` 엄수).
- 핵심 잠근 DOM(`#tom-retirement-architect`, `#tomMorningBellClub`, `#tom-passwordless-club-signup`, `#tomFreeStarterManual`, `#tomStarterManualModal`)과 푸터 3대 약관(`terms.html`, `privacy.html`, `refund.html`)을 항상 보존하십시오.

---

## 3. 실서버 배포 및 `/live-audit` 출구 잠금
- 웹 수정 시 로컬 편집만으로 완료 선언 금지: `python scripts/build_static_bundle.py` 실행 ➜ `git commit & push` (`jjangdol0205/truthofmarket.git` `main`) ➜ CDN 전파 대기 후 `python "C:\Users\jjang\.gemini\config\skills\live-audit\run_live_audit.py" truthofmarket.com` `ALL PASS` 확인 후 보고합니다.
- `scripts/master_hq_telegram_bridge.js`는 그룹 비서실장(`@Allcompany1_bot`) 및 1~5사업부 6봇 연동 스크립트이므로 토큰 매핑(`HQ_TELEGRAM_BOT_TOKEN` 및 각 사업부 `.env`)을 훼손하지 마십시오.
