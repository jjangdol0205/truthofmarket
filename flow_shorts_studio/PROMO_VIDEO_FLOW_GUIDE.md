# 🎬 RightSideAlpha & SemiFearGreed — US Retail Investor Promo Shorts Guide (Google Flow + Live UI Hybrid)

## 1. 제작 구조 요약 (선택하신 옵션 반영 완료)
- **타겟 시장**: 미국·글로벌 개인투자자 (YouTube Shorts / TikTok / X) — 100% 원어민 영문 나레이션 (`en-US-AndrewMultilingualNeural`)
- **포맷**: **3단 실차트 모션 + 라이브 UI 4-Shot 구성 (약 20~26초)**
  - **Shot 1 ~ Shot 3**: 실제 OHLCV 30fps 캔들차트 모션 드로잉 (`60-Day MA` 돌파선, `1.8x~2.5x` 기관 거래량 바, `-9.0%` 하드 손절선, `26-Year Backtest` 비교 바) — *AI 양복 인물 및 가짜 외계어 모니터 영구 폐기*
  - **Shot 4 (마지막 5~6초)**: **실제 배포된 우리 사이트(`truthofmarket.com` / `truthofmarket.com/?view=semi`) 1080×1920 라이브 UI 녹화 영상 자동 합성** (`rsa_shot4_live_ui.mp4`, `semi_shot4_live_ui.mp4` 자동 생성 완료)
- **엔딩 방식**: **Punchline 엔딩** (마지막 단어 직후 극장판 62Hz→26Hz 서브베이스 드롭 + 1초 여운 페이드아웃)

---

## 2. [편집기 1] RightSideAlpha (`truthofmarket.com` · `@RightSideAlpha`) — 3단 실차트 구성

`D:\드림컴퍼니\1사업부\flow_shorts_studio\build_rsa_semi_promo_shorts.py` 실행 시 실제 OHLCV 차트 기반으로 `rsa_shot1.mp4`, `rsa_shot2.mp4`, `rsa_shot3.mp4`가 자동 생성됩니다. *(AI 양복 인물 클립 금지)*

### 🔹 Shot 1 (`rsa_shot1.mp4` — 실제 폭락 차트 급속 줌인)
```text
Vertical 9:16 dark institutional chart canvas. $CELH -71% CRASH: BULL TRAP OR 2X? Real OHLCV red candlesticks cascading from peak to seller washout trough.
```
- **매칭 영문 대사**: *"You bought a stock down fifty percent thinking it was cheap, and somehow it dropped another forty percent."*

### 🔹 Shot 2 (`rsa_shot2.mp4` — 좌측 물타기 vs -9.0% 하드 손절선)
```text
Vertical 9:16 dark institutional OHLCV chart canvas highlighting left-side falling knife trap vs -9.0% mechanical hard stop line.
```
- **매칭 영문 대사**: *"Catching falling knives on the left side of a crash is how retail investors trap their money for years."*

### 🔹 Shot 3 (`rsa_shot3.mp4` — 60일선 돌파 & 1.8x~2.5x 기관 거래량 폭발)
```text
Vertical 9:16 dark institutional OHLCV chart canvas showing flat base breakout reclaiming the 60-DAY MA with 2.1x emerald institutional volume bars.
```
- **매칭 영문 대사**: *"Wall Street quants never buy the crash. They wait for the Right-Side Ignition, when seller washout ends and price reclaims the twenty and sixty-day moving averages."*

### 🔹 Shot 4 (`rsa_shot4_live_ui.mp4` — **자동 녹화 완료**)
- **화면**: 실제 `RightSideAlpha` 72개 미국주식 스캐너 ➔ `$CELH` / `$NVDA` 4팩터(`DD·LOW·MA·VOL`) 시그널 ➔ 무료 **Position Doctor** 진단 화면 스크롤
- **매칭 영문 대사**: *"Holding a losing stock right now? Type any US ticker into our free Position Doctor at truthofmarket dot com to see in three seconds if it is a hold, a time stop, or an immediate cut."*

---

## 3. [편집기 2] SemiFearGreed (`truthofmarket.com/?view=semi`) — 3단 실차트 & 바벨 구성

동일하게 `D:\드림컴퍼니\1사업부\flow_shorts_studio\ai_shorts_output\flow_clips\` 폴더에 **`semi_shot1.mp4`, `semi_shot2.mp4`, `semi_shot3.mp4`** 가 실제 `$SMH` / `$XLV` OHLCV 데이터로 자동 렌더링됩니다.

### 🔸 Shot 1 (`semi_shot1.mp4`)
```text
Vertical 9:16 dark institutional chart canvas showing $SMH -24% semiconductor correction with Fear & Greed gauge hitting 18 Extreme Fear.
```
- **매칭 영문 대사**: *"Every time semiconductor stocks drop twenty percent, retail investors panic and sell at the exact bottom."*

### 🔸 Shot 2 (`semi_shot2.mp4`)
```text
Vertical 9:16 dark institutional 7-Factor Semiconductor Fear & Greed dial at 18/100 Extreme Fear with 80% $SMH : 20% $XLV contrarian barbell signal.
```
- **매칭 영문 대사**: *"Right now, the Semiconductor Fear and Greed Index plunged to eighteen, Extreme Fear, while ninety percent of traders are too scared to buy."*

### 🔸 Shot 3 (`semi_shot3.mp4`)
```text
Vertical 9:16 dark institutional 26-Year Backtest curve comparing 70% $SMH : 30% $XLV Barbell (23.1% CAGR) vs Nasdaq benchmark.
```
- **매칭 영문 대사**: *"Instead of gambling everything on chip volatility, pairing seventy percent SMH with thirty percent Healthcare XLV delivered a twenty-three percent annual return, and shifting to eighty-twenty in Extreme Fear is where fortunes are made."*

### 🔸 Shot 4 (`semi_shot4_live_ui.mp4` — **자동 녹화 완료**)
- **화면**: 실제 `SemiFearGreed` CNN 스타일 공포·탐욕 게이지(`18 / 100 EXTREME FEAR`) ➔ `$SMH 70% : $XLV 30%` 바벨 성과 ➔ 실시간 리밸런싱·거치식 주식수 계산기 스크롤
- **매칭 영문 대사**: *"Want the exact SMH and XLV shares to buy for your portfolio today? Run our free live Semiconductor Fear and Greed calculator at truthofmarket dot com right now."*

---

## 4. 원클릭 영상 합본 실행 명령어

아래 명령어 한 줄만 실행하시면, 실제 OHLCV 30fps 차트 드로잉 + 문장 호흡 동기화 + 골든 세이프존(`Y=1060`) 자막 + `.srt` + `@RightSideAlpha` 업로드 메타데이터(`22:00 KST` / `08:00 EST`, `categoryId=27`, `en-US`)가 결합된 최종 `.mp4` 2편이 즉시 완성됩니다:

```powershell
python "D:\드림컴퍼니\1사업부\flow_shorts_studio\build_rsa_semi_promo_shorts.py"
```

- **완성본 저장 경로**:
  1. `D:\드림컴퍼니\1사업부\flow_shorts_studio\ai_shorts_output\RightSideAlpha_US_Promo_Shorts.mp4`
  2. `D:\드림컴퍼니\1사업부\flow_shorts_studio\ai_shorts_output\SemiFearGreed_US_Promo_Shorts.mp4`

---

## 5. YouTube Shorts (`@RightSideAlpha`) 업로드용 제목 · 설명 · 고정댓글 세트

### 📌 Video 1: RightSideAlpha (`truthofmarket.com/?tool=doctor`)
- **Title (55자 이내)**:
  `$CELH -71% Crash: Why Buying Dips Fails #Shorts`
- **Pinned Comment / CTA**:
  `🖥️ Live 72-Stock Breakout Scanner & Free 3s Position Doctor 👉 Tap truthofmarket.com in @RightSideAlpha channel bio!`

### 📌 Video 2: SemiFearGreed (`truthofmarket.com/?view=semi`)
- **Title (55자 이내)**:
  `$SMH Fear Hit 18: The 80/20 Barbell Rule #Shorts`
- **Pinned Comment / CTA**:
  `🖥️ Live 72-Stock Breakout Scanner & Free 3s Position Doctor 👉 Tap truthofmarket.com in @RightSideAlpha channel bio!`
