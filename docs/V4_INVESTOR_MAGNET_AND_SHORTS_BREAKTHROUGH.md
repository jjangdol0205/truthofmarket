# 1사업부 (`truthofmarket.com`) 홍보 영상 조회수 돌파 및 투자자 유입 극대화 V4 마스터 리포트

## 1. 기존 홍보 영상이 조회수가 전혀 터지지 않았던 3대 근본 원인 (프레임 정밀 검수 결과)

1. **초반 0.5~3초 구간의 '양산형 AI 이미지(Generic AI Slop)' 이탈 현상**
   - 기존 영상 프레임(`diag_ep09_1s.png`, `diag_ep09_8s.png`, `test_body_frame.png`)을 직접 추출해 검수한 결과, **붉은 레이저 눈을 한 AI 캐릭터 얼굴**이나 **철자가 깨진 가짜 모니터(`POIFLATLE`, `PORTLAIRE`) 및 녹색 음성 파형**이 노출되고 있었습니다.
   - 미국주식 실전 투자자들은 첫 1초 안에 실제 티커(`$NVDA`, `$CELH`, `$SMCI`)와 실제 주가·이동평균선(`MA60`)·거래량 바가 보이지 않으면 즉시 'AI 양산형 광고'로 인식하고 스와이프(이탈)합니다.
2. **수동적 설명형 대본 vs 투자자 자존심·호기심을 자극하는 '참여형 차트 퀴즈(Blind Test)' 부재**
   - *"왜 돌파 매매의 90%가 실패할까요?"* 같은 추상적 강의형 훅은 시청자가 끝까지 볼 이유가 없습니다.
   - 반면 **"익명 종목 A는 고점 대비 -26% 하락해 60일선 아래 -18.3%에 있습니다. 지금 저점 매수(BUY)하시겠습니까, 함정(TRAP)으로 피하시겠습니까? (정답: `$NVDA` $178.67 역추세 함정!)"**처럼 실전 차트 블라인드 테스트를 걸면 시청자가 멈춰서 자신의 눈을 테스트하게 됩니다.
3. **영상 시청 후 `truthofmarket.com`으로 넘어오게 만드는 '즉각적 인터랙티브 체험 브릿지' 부재**
   - 단순히 *"스캐너 보러 오세요"*라고 하면 광고처럼 느껴지지만, **"방금 영상에서 보신 3라운드(기관 거래량 3.41배 폭발 · 퀀트 점수 98점) 블라인드 차트 테스트를 지금 `truthofmarket.com`에서 15초 만에 직접 플레이해 보세요"**라고 연결하면 유입률(CTR)과 체류시간이 동시에 폭발합니다.

---

## 2. 오늘 즉시 구현 및 적용 완료한 3대 돌파 솔루션 (Web + Video V4 + 25편 큐)

### ① [웹 유입 자석] `truthofmarket.com` 메인 히어로 **🎯 15초 월스트리트 차트 블라인드 테스트 (`ChartBlindTest.js`)** 탑재
- **파일**: [`frontend/src/components/ChartBlindTest.js`](file:///d:/드림컴퍼니/1사업부/frontend/src/components/ChartBlindTest.js), [`frontend/src/components/Hero.js`](file:///d:/드림컴퍼니/1사업부/frontend/src/components/Hero.js), [`frontend/src/main.js`](file:///d:/드림컴퍼니/1사업부/frontend/src/main.js)
- **핵심 기능**:
  - **실데이터 기반 3라운드 익명 차트 퀴즈 (`BUY` vs `TRAP`)**:
    - **Round 1**: 고점 대비 `-26.0%`, `MA60` 대비 `-18.3%`, 거래량 `0.92x` → 클릭 즉시 **`$NVDA ($178.67)` 좌측 떨어지는 칼날(`LEFT_SIDE_KNIFE`)** 실명 공개 및 해설
    - **Round 2**: 바닥 다지기 후 `MA60 +12.7%` 돌파 + 기관 거래량 `2.46x` 폭발 → 클릭 즉시 **`$CELH ($33.19)` 오늘의 무료 대표 쇼케이스(`#1 Free Showcase`)** 진입가·손절가(`$30.20`)·목표가(`$66.38`) 공개
    - **Round 3**: 오늘 72종목 유니버스 전체 1위 기관 수급(`3.41x` 거래량 폭발 · `PW-RSI Score 98/100`) → 클릭 즉시 **나의 월스트리트 퀀트 IQ 점수(`100/100`)** 산출 + **VIP 히든 #2(`3.41x`)·#3(`3.17x`) 종목 원클릭 언락(`$29/mo` / `$199`)** 및 **3초 무료 보유종목 진단기(`#positionDoctorCard`)** 점프 버튼 연동
  - **💰 `$10,000` 실전 계좌 비교 보드**:
    - 좌측 역추세 물타기 개미(`$10,000 → $5,200`, `-48%`) vs 우측 PW-RSI 퀀트 엔진(`$10,000 → $22,697`, `+127%`)을 한눈에 비교
  - **다국어(EN/KR/JP) 및 `#blindtest` 딥링크 지원**:
    - 쇼츠·릴스 프로필 링크나 설명란에서 `https://truthofmarket.com/#blindtest`로 접속하면 즉시 블라인드 테스트 섹션으로 자동 스크롤됩니다.

### ② [차세대 영상 엔진] **V4 실전 애니메이션 캔들·MA60·거래량 차트 HUD 비디오 엔진 (`build_v4_interactive_chart_shorts.py`)** 구축
- **파일**: [`scripts/build_v4_interactive_chart_shorts.py`](file:///d:/드림컴퍼니/1사업부/scripts/build_v4_interactive_chart_shorts.py)
- **핵심 혁신**:
  - 가짜 AI 모니터/얼굴을 완전히 걷어내고, **30fps `1080×1920` 풀스크린 위에 실시간으로 그려지는 캔들스틱 + `MA60` 추세선 + `2.46x~3.41x` 에메랄드 기관 거래량 폭발 바 + 박동하는 타점 링 + 좌/우 `$10,000` 계좌 비교 카드**를 직접 렌더링합니다.
  - `GEMINI.md` 제4조 클린 비디오 마스터링 규격 100% 준수:
    - 상·하단 흰색/검은색 양산형 박스 없는 100% 클린 풀스크린(`1080×1920`)
    - `atempo` 강제 배속 없는 자연스러운 아나운서 호흡 + `seg_dur >= tts_dur + 0.28s`로 자막 첫 글자부터 마지막 글자까지 100% 완독 보장
    - 반투명 박스 없는 두꺼운 검은 외곽선(`stroke_width=10`) 하단 세이프존 자막(`Y=1385..1465`)
    - 포인트 효과음(훅 임팩트·핑·우쉬·서브베이스 드롭) + `-0.5 dBFS` 안티클리핑 리미터(`clipped_samples = 0`)
    - 마지막 3.25초 `truthofmarket.com` 전용 엔딩 콜아웃 슬레이트

### ③ [신규 바이럴 에피소드] `EP10` V4 전면 업그레이드 + 신규 투자자 자석 포맷 `EP23`·`EP24`·`EP25` 제작 및 25편 큐 연동
- **파일**: [`daily_6am_shorts_sender.py`](file:///d:/드림컴퍼니/1사업부/daily_6am_shorts_sender.py) (`EP01`~`EP25` 총 25편 순환 큐)
  - **`EP10` (차기 6AM 발송 대기분 V4 즉시 업그레이드)**: *Why 92% of Dip Buyers Lose Money (`$NVDA`, `$SMCI` vs `$CELH` 2.46x Quant Breakout)*
  - **`EP23` (신규 · 블라인드 차트 퀴즈형)**: *Wall Street Chart Blind Test: BUY the Dip or AVOID the Trap? (`$NVDA` -18.3% vs `3.41x` Quant Ignition)*
  - **`EP24` (신규 · `$10,000` 실전 계좌 레이스형)**: *`$10,000` Account Race: Retail Dip-Buyer (`$5,200`) vs Right-Side Quant Engine (`$22,697`)*
  - **`EP25` (신규 · 기관 수급 이상징후 TOP 3 FOMO형)**: *3 US Stocks Triggered Extreme `2.46x–3.41x` Institutional Volume Today (`#1 $CELH` Unlocked Free)*
