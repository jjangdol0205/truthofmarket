#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
send_3_major_agendas.py
Transmit the 3 Major Agendas to Telegram Group -1003834697086 via @SemifearGreedbot
with interactive options and inline keyboard callback buttons.
Verifies HTTP 200 OK and logs all results.
"""

import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path
from datetime import datetime, timezone, timedelta

BOT_TOKEN = "9291573259:AAEZXNkQ4wuEPX6FYujxKT5mwLWdQpZOnes"
TARGET_CHAT_ID = "-1003834697086"
API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
KST = timezone(timedelta(hours=9))

AGENDAS = [
    {
        "id": 1,
        "title": "[안건 1] 3사업부 kidsfit.co.kr 유지/개편 여부 vs getbreakai.com 신규 프로젝트 전환 안",
        "text": """📋 <b>[드림컴퍼니 대표 결재 안건 1호]</b>
<b>제목: 3사업부 전략적 진로 결정 — kidsfit.co.kr 유지/개편 vs getbreakai.com 전환</b>

대표님, 3사업부의 실질적인 유료 매출 창출과 에이전트 리소스의 전략적 집중을 위해 사업 진로에 대한 최종 결재를 요청드립니다.

━━━━━━━━━━━━━━━━━━━━
<b>■ 선택지 A: [무인 자동 유지 + 신규 프로젝트 런칭] (추천안)</b>
• <b>내용</b>: 기존 <code>kidsfit.co.kr</code>은 질병청 성장도표·쿠팡/링크프라이스 제휴 수익 체제로 100% 무인 자동 유지(추가 개발 리소스 투입 0)하고, 확보된 인프라를 글로벌 AI 퀀트/브레이크아웃 플랫폼인 <code>getbreakai.com</code> 신규 런칭으로 전면 전환.
• <b>기대 효과</b>:
  - 저마진(1~3%) 국내 커머스 제휴 한계를 탈피하여 글로벌 고마진($29~$199) 구독형 SaaS 매출원 창출.
  - 1사업부(RightSideAlpha) 퀀트 엔진과의 시너지 극대화(미국장 돌파 스캐너 연계).
• <b>투입 공수(ROI)</b>: 전환 세팅 3일 소요 / 예상 월간 순익 잠재력 $3,000~$15,000 / ROI 최상.

━━━━━━━━━━━━━━━━━━━━
<b>■ 선택지 B: [kidsfit.co.kr 자체 유료화 수익 모델 전면 개편]</b>
• <b>내용</b>: <code>kidsfit.co.kr</code>을 단순 무료 진단+쿠팡 링크 구조에서 벗어나, K-DST 기반 1:1 맞춤형 정밀 발달·성장 유료 진단서(건당 9,900원) 및 월간 성장 케어 패스(월 19,900원) 직결제 플랫폼으로 전면 유료화 개편.
• <b>기대 효과</b>: 국내 학부모 타깃의 즉각적인 원화 캐시플로우 창출, 국내 육아 커뮤니티 트래픽 직접 흡수.
• <b>투입 공수(ROI)</b>: 국내 PG/네이버페이 결제 모듈 연동 및 진단서 엔진 개편 5일 소요 / 예상 월간 순익 100만~400만 원.
━━━━━━━━━━━━━━━━━━━━

💡 <b>아래 버튼을 눌러 승인하시면 에이전트가 즉각 세팅에 착수합니다:</b>""",
        "keyboard": {
            "inline_keyboard": [
                [
                    {"text": "✅ [선택지 A 승인] getbreakai.com 전환 (추천)", "callback_data": "/approve_agenda1_optA"}
                ],
                [
                    {"text": "🛠️ [선택지 B 승인] kidsfit.co.kr 유료화 개편", "callback_data": "/approve_agenda1_optB"}
                ]
            ]
        }
    },
    {
        "id": 2,
        "title": "[안건 2] 영상 제작 시 Flow 병행 사용 vs 토큰 맥싱 기반 100% 완전 자동 실사급 생성 안",
        "text": """🎬 <b>[드림컴퍼니 대표 결재 안건 2호]</b>
<b>제목: 숏폼 영상 제작 파이프라인 확정 — Google Flow(Veo) 병행 vs 100% 완전 자동 실사급 생성</b>

매일 3개 사업부의 숏폼(유튜브 쇼츠, 인스타 릴스) 제작과 관련하여, 영상의 물리 엔진 퀄리티와 무인 자동화 편의성 사이의 최적 방식을 결정해 주시기 바랍니다.

━━━━━━━━━━━━━━━━━━━━
<b>■ 선택지 A: [Google Flow(Veo) 병행 하이브리드 파이프라인]</b>
• <b>방식</b>: 에이전트가 1080×1920 극실사 스틸컷 3장과 최적화 카메라 앵글 프롬프트를 자동 생성하여 대기시켜 두고, 대표님이 Google Flow 웹에서 Veo 비디오로 렌더링(클릭 2~3회)하여 다운로드 폴더에 넣으면, 로컬 에이전트가 0.01초 싱크 자막·외곽선·BGM·엔딩 슬레이트를 결합해 완성본 마스터링.
• <b>장점</b>: 헐리우드 영화 수준의 압도적 3D 공간 물리 엔진 및 인물 모션 구현 (최고 화질).
• <b>단점</b>: 대표님의 브라우저 접속 및 프롬프트 복사/다운로드 행동(약 3분) 필요.

━━━━━━━━━━━━━━━━━━━━
<b>■ 선택지 B: [토큰 맥싱 기반 100% 무인 완전 자동 실사급 파이프라인] (추천안)</b>
• <b>방식</b>: Gemini Ultra/Max 토큰과 OpenCV 2.5D 모션 시네마틱 엔진, Edge-TTS 미국 원어민 내레이션을 결합하여 사람의 개입 0%로 심야 시간대에 매일 3편의 완성형 1080×1920 비디오를 완전 자동 렌더링.
• <b>장점</b>: 사람 개입 0% 완전 무인 자동화. 아침에 텔레그램으로 완제품 비디오 파일만 즉시 수신.
• <b>단점</b>: Google Veo의 3D 물리 모션 대비 시네마틱 카메라 패닝/줌 중심의 2.5D 모션으로 구현.
━━━━━━━━━━━━━━━━━━━━

💡 <b>원하시는 영상 제작 방식을 선택해 주십시오:</b>""",
        "keyboard": {
            "inline_keyboard": [
                [
                    {"text": "🌟 [선택지 A 승인] Flow 병행 최고화질 3D", "callback_data": "/approve_agenda2_optA"}
                ],
                [
                    {"text": "⚡ [선택지 B 승인] 100% 완전자동 무인영상 (추천)", "callback_data": "/approve_agenda2_optB"}
                ]
            ]
        }
    },
    {
        "id": 3,
        "title": "[안건 3] 심야·새벽 시간대(Overnight) 울트라/맥스 토큰 맥싱 활용 방안 및 자동 수행 과업 안",
        "text": """🌙 <b>[드림컴퍼니 대표 결재 안건 3호]</b>
<b>제목: 심야·새벽(00:00~06:30) 울트라/맥스 토큰 맥싱 파이프라인 가동 구성안</b>

대표님이 취침 중이신 심야·새벽 시간대에 Gemini+Antigravity 병렬 컴퓨팅 자원과 울트라/맥스 토큰을 집중 투입하여 수익 창출 자산을 무인 구축하는 3가지 운용 방안입니다.

━━━━━━━━━━━━━━━━━━━━
<b>■ 선택지 A: [대규모 리서치 & 지식자산 확장 올인형]</b>
• <b>과업</b>: 1사업부 S&P500 전종목 PW-RSI/실적 분석 및 Seeking Alpha급 1만자 영문 심층 리포트 3편 자동 집필, 2사업부 PubMed 최신 소아성장 임상 논문 50편 분석 및 100개 영문 Q&A SEO 배포.
• <b>특징</b>: 검색엔진 및 AI(ChatGPT, Perplexity) 인용 점유 극대화, 유료 가치 텍스트 자산 축적.

━━━━━━━━━━━━━━━━━━━━
<b>■ 선택지 B: [숏폼 영상 & 미디어 팩토리 올인형]</b>
• <b>과업</b>: 1·2·3사업부의 숏폼 영상(쇼츠/릴스) 당일분 3편 및 주간 백로그 10편을 연속 렌더링, 클린 1080×1920 마스터링 및 인포그래픽 카드뉴스 20장 자동 생성.
• <b>특징</b>: 소셜 미디어 바이럴 유입 파이프라인의 압도적 비주얼 물량 확보.

━━━━━━━━━━━━━━━━━━━━
<b>■ 선택지 C: [올인원 균형 풀가동형 (통합 파이프라인)] (강력 추천안)</b>
• <b>00:00~02:30</b>: Seeking Alpha급 퀀트 리서치 리포트 집필 + 글로벌 의학 Q&A 30건 증식
• <b>02:30~05:00</b>: 당일 3개 사업부 1080×1920 클린 숏폼 영상 3편 완전 렌더링 및 마스터링
• <b>05:00~06:00</b>: 전사 sitemap, llms.txt, IndexNow 푸시 및 미국장 마감 종가 동기화
• <b>06:30 정각</b>: 대표 텔레그램으로 [완성 영상 3편 + 1줄 요약 + 업로드용 문구] 1건만 단독 전송!
• <b>특징</b>: 리서치, 영상, SEO, 데이터 동기화가 조화롭게 완결되며 대표는 아침에 '업로드 버튼'만 누르면 끝.
━━━━━━━━━━━━━━━━━━━━

💡 <b>새벽 시간대 가동할 파이프라인 방식을 선택해 주십시오:</b>""",
        "keyboard": {
            "inline_keyboard": [
                [
                    {"text": "📚 [선택지 A] 대규모 리서치 집중", "callback_data": "/approve_agenda3_optA"}
                ],
                [
                    {"text": "🎬 [선택지 B] 숏폼 영상 팩토리", "callback_data": "/approve_agenda3_optB"}
                ],
                [
                    {"text": "🚀 [선택지 C] 올인원 균형 풀가동 (강력 추천)", "callback_data": "/approve_agenda3_optC"}
                ]
            ]
        }
    }
]


def send_message(agenda):
    payload = {
        "chat_id": TARGET_CHAT_ID,
        "text": agenda["text"],
        "parse_mode": "HTML",
        "reply_markup": agenda["keyboard"]
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=data,
        headers={"Content-Type": "application/json"}
    )
    
    timestamp = datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST")
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            res_code = res.getcode()
            res_body = res.read().decode("utf-8")
            res_json = json.loads(res_body)
            return {
                "agenda_id": agenda["id"],
                "agenda_title": agenda["title"],
                "http_status": res_code,
                "ok": res_json.get("ok", False),
                "message_id": res_json.get("result", {}).get("message_id"),
                "date": res_json.get("result", {}).get("date"),
                "timestamp": timestamp,
                "raw_response": res_json
            }
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8") if e.fp else ""
        return {
            "agenda_id": agenda["id"],
            "agenda_title": agenda["title"],
            "http_status": e.code,
            "ok": False,
            "error": str(e),
            "err_body": err_body,
            "timestamp": timestamp
        }
    except Exception as e:
        return {
            "agenda_id": agenda["id"],
            "agenda_title": agenda["title"],
            "http_status": 0,
            "ok": False,
            "error": str(e),
            "timestamp": timestamp
        }


def main():
    print(f"[*] Starting 3 Major Agendas Transmission to chat_id={TARGET_CHAT_ID} via @SemifearGreedbot...")
    results = []
    all_success = True

    for agenda in AGENDAS:
        print(f"[*] Sending Agenda {agenda['id']}...")
        res = send_message(agenda)
        print(f"    -> HTTP {res.get('http_status')} | ok={res.get('ok')} | message_id={res.get('message_id')}")
        results.append(res)
        if not (res.get("http_status") == 200 and res.get("ok") is True):
            all_success = False

    log_path = Path(r"D:\드림컴퍼니\.agents\teamwork\worker_m1\agenda_transmission_log.json")
    log_path.parent.mkdir(parents=True, exist_ok=True)
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"[*] Transmission results logged to {log_path}")
    if all_success:
        print("[SUCCESS] All 3 Agendas successfully delivered with HTTP 200 OK.")
        sys.exit(0)
    else:
        print("[FAILURE] One or more agendas failed to deliver.")
        sys.exit(1)


if __name__ == "__main__":
    main()
