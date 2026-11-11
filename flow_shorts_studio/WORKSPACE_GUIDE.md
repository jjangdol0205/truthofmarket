# 🎬 3_AI쇼츠_홍보영상_스튜디오 (Google Flow Veo & AI Viral Shorts Studio)

이 폴더는 **Google Flow (Veo) 실사 클립 생성, `RightSideAlpha` & `SemiFearGreed` 미국 홍보 쇼츠 제작, 그리고 AI 바이럴 쇼츠 자동 렌더링** 전용 독립 워크스페이스입니다.

## 주요 실행 파일
- **`build_rsa_semi_promo_shorts.py`**: RightSideAlpha(`truthofmarket.com`) & SemiFearGreed(`truthofmarket.com/?view=semi`) 3단 실제 OHLCV 차트 모션 홍보 영상(Shot 1~3 실차트 드로잉 + Shot 4 실제 사이트 UI 녹화 + Punchline 서브베이스 엔딩) 빌더
- **`PROMO_VIDEO_FLOW_GUIDE.md`**: Google Flow 9:16 복붙용 영문 프롬프트 및 유튜브 쇼츠/틱톡 업로드 키트
- **`flow_shorts_merger.py`**: Google Flow 클립 문장 호흡 동기화 합본 마스터링 엔진
- **`flow_cdp_pilot.py`**: Chrome CDP 연동 Google Flow 자동 파일럿
- **`ai_shorts_factory.py` / `us_viral_studio.py` / `us_real_motion_studio.py`**: 자체 합성 BGM + 신경망 TTS + 1080x1920 쇼츠 렌더링 스튜디오
- **`ai_shorts_output/`**: 렌더링 완료된 `.mp4` 영상 및 `flow_clips/` 보관 폴더
