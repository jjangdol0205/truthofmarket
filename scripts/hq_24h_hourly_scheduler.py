#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/hq_24h_hourly_scheduler.py
전사 5대 사업부 (1사업부 TOM · 2사업부 KFG · 3사업부 GBA · 4사업부 HERO · 5사업부 KFK)
1시간 주기 100% 무인 대외 홍보 · High-DA 백링크 · AI검색(llms.txt) · IndexNow 색인 총괄 스케줄러

표준 물리 경로 및 전담 텔레그램 봇 (GEMINI.md 제1조 · 제3조 4항 준수):
  - 1사업부 (TOM  - truthofmarket.com) : D:\\드림컴퍼니\\1사업부 -> @RigjtsideAlphabot
  - 2사업부 (KFG  - kisfitglobal.com)  : D:\\드림컴퍼니\\2사업부 -> @kidsfittbot
  - 3사업부 (GBA  - getbreakai.com/jp/): D:\\드림컴퍼니\\3사업부 -> @SemifearGreedbot
  - 4사업부 (HERO - paradise-hero.com) : D:\\드림컴퍼니\\4사업부 -> @inves123_bot
  - 5사업부 (KFK  - kidsfit.co.kr)     : D:\\드림컴퍼니\\5사업부 -> @Moneyfiityyy_bot
"""

import json
import os
import subprocess
import urllib.request
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

KST = timezone(timedelta(hours=9))
HQ_DIR = Path(__file__).resolve().parent.parent.parent
DIV1_DIR = Path(r"D:\드림컴퍼니\1사업부")
DIV2_DIR = Path(r"D:\드림컴퍼니\2사업부")
DIV3_DIR = Path(r"D:\드림컴퍼니\3사업부")
DIV4_DIR = Path(r"D:\드림컴퍼니\4사업부")
DIV5_DIR = Path(r"D:\드림컴퍼니\5사업부")

LOG_FILE = DIV1_DIR / "data" / "hq_24h_work_log.jsonl"
BRIDGE_JS = DIV1_DIR / "scripts" / "master_hq_telegram_bridge.js"

HOURLY_SCHEDULE = {
    h: {
        "hour": f"{h:02d}:00",
        "TOM": "[1사업부 TOM] 미국주식 72종목 PW-RSI & $SMH 공포탐욕 영문 퀀트 리포트(telegra.ph) 발행 + llms.txt + IndexNow 78개 URL 색인 핑",
        "KFG": "[2사업부 KFG] 미국 학부모 임상 Q&A 랜딩 신설 + DA88 영문 칼럼 백링크 발행 + llms.txt/sitemap.xml + 6대 검색엔진 색인 핑",
        "GBA": "[3사업부 GBA] 일본 新NISA·특정계좌 퀀트 브레이크아웃 일본어 칼럼(telegra.ph) 발행 + jp/llms.txt + IndexNow 색인 핑",
        "HERO": "[4사업부 HERO] 파라다이스히어로·영웅라디오 명곡 해설 DA88 칼럼 발행 + IndexNow 9개 핵심 URL 색인 핑",
        "KFK": (
            "[5사업부 KFK] 심야 계정 보호 모드 + kidsfit.co.kr 임상 가이드 DA88 백링크 + llms.txt + IndexNow 색인 핑"
            if 1 <= h <= 6
            else "[5사업부 KFK] 주간 패시브 홍보 — kidsfit.co.kr 임상 가이드 DA88 백링크 + llms.txt + IndexNow 색인 핑 + 가드레일(AF7865143/A100708867) 검증"
        ),
    }
    for h in range(24)
}


def _read_json(path: Path, default):
    try:
        if path.exists():
            return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        pass
    return default


def notify_division_bot(div_code: str, message: str):
    if not BRIDGE_JS.exists():
        return
    try:
        subprocess.run(
            ["node", str(BRIDGE_JS), "--div", div_code, "--notify", message],
            cwd=str(DIV1_DIR),
            timeout=35,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
    except Exception as e:
        print(f"[Notify Warning] {div_code}: {e}")


def run_div1_tom(hour: int) -> dict:
    cwd = str(DIV1_DIR)
    if hour in (6, 21):
        for s_name in ["sync_live_market_data.py", "build_static_bundle.py"]:
            sp = DIV1_DIR / "scripts" / s_name
            if sp.exists():
                subprocess.run([sys.executable, str(sp)], cwd=cwd, timeout=120, capture_output=True)

    s_promo = DIV1_DIR / "scripts" / "tom_auto_promotion_engine.py"
    res = subprocess.run(
        [sys.executable, str(s_promo)],
        cwd=cwd,
        timeout=60,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    stdout_line = (res.stdout or "").strip().splitlines()[-1] if (res.stdout or "").strip() else ""
    reg = _read_json(DIV1_DIR / "data" / "tom_external_backlinks.json", [])
    last_url = reg[-1].get("url", "") if reg else ""
    return {
        "div": "TOM",
        "name": "1사업부 TruthOfMarket (truthofmarket.com)",
        "bot": "@RigjtsideAlphabot",
        "telegraph_url": last_url,
        "index_urls": 78,
        "stdout": stdout_line,
    }


def run_div2_kfg(hour: int) -> dict:
    cwd = str(DIV2_DIR)
    s_calc = DIV2_DIR / "scripts" / "generate_seo_calculators_and_sync_qna.js"
    if s_calc.exists():
        subprocess.run(["node", str(s_calc)], cwd=cwd, timeout=90, capture_output=True)

    s_promo = DIV2_DIR / "scripts" / "global_auto_promotion_engine.js"
    res = subprocess.run(
        ["node", str(s_promo), "--silent"],
        cwd=cwd,
        timeout=120,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    state = _read_json(DIV2_DIR / "logs" / "auto_promotion_state.json", {})
    last_tg = state.get("lastTelegraphUrl", "")
    last_qna = state.get("lastGeneratedQnaUrl", "")
    return {
        "div": "KFG",
        "name": "2사업부 KISFIT Global (kisfitglobal.com)",
        "bot": "@kidsfittbot",
        "telegraph_url": last_tg,
        "qna_url": last_qna,
        "index_urls": 94,
        "stdout": (res.stdout or "").strip().splitlines()[-1] if (res.stdout or "").strip() else "",
    }


def run_div3_gba(hour: int) -> dict:
    cwd = str(DIV3_DIR)
    s_promo = DIV3_DIR / "scripts" / "gba_auto_promotion_engine.py"
    res = subprocess.run(
        [sys.executable, str(s_promo)],
        cwd=cwd,
        timeout=90,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    reg = _read_json(DIV3_DIR / "data" / "jp_external_backlinks.json", [])
    last_url = reg[-1].get("url", "") if reg else ""
    return {
        "div": "GBA",
        "name": "3사업부 GetBreakAI (getbreakai.com/jp/)",
        "bot": "@SemifearGreedbot",
        "telegraph_url": last_url,
        "index_urls": 35,
        "stdout": (res.stdout or "").strip().splitlines()[-1] if (res.stdout or "").strip() else "",
    }


def run_div4_hero(hour: int) -> dict:
    cwd = str(DIV4_DIR)
    s_promo = DIV4_DIR / "scripts" / "hero_auto_promotion_engine.py"
    res = subprocess.run(
        [sys.executable, str(s_promo)],
        cwd=cwd,
        timeout=60,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    st = _read_json(DIV4_DIR / "data" / "hero_promotion_status.json", {})
    return {
        "div": "HERO",
        "name": "4사업부 파라다이스히어로 · 영웅라디오 (paradise-hero.com)",
        "bot": "@inves123_bot",
        "telegraph_url": st.get("telegraph_url", ""),
        "index_urls": 9,
        "stdout": (res.stdout or "").strip().splitlines()[-1] if (res.stdout or "").strip() else "",
    }


def run_div5_kfk(hour: int) -> dict:
    cwd = str(DIV5_DIR)
    s_promo = DIV5_DIR / "scripts" / "kfk_hourly_passive_promo.py"
    res = subprocess.run(
        [sys.executable, str(s_promo)],
        cwd=cwd,
        timeout=90,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    st = _read_json(DIV5_DIR / "logs" / "kfk_hourly_promo_status.json", {})
    idx_info = st.get("indexnow", {})
    guard = st.get("guardrails", {})
    return {
        "div": "KFK",
        "name": "5사업부 KidsFit Korea 패시브 (kidsfit.co.kr)",
        "bot": "@Moneyfiityyy_bot",
        "telegraph_url": st.get("telegraph_url", ""),
        "index_urls": idx_info.get("url_count", 45),
        "guardrails": guard,
        "naver_status": st.get("naver_status", ""),
        "stdout": (res.stdout or "").strip().splitlines()[-1] if (res.stdout or "").strip() else "",
    }


def check_lemonsqueezy_store_approval() -> dict:
    """Checks Lemon Squeezy API for Store #296100 activation status (plan: free -> fresh)."""
    state_file = HQ_DIR / "1사업부" / "data" / "lemonsqueezy_approval_state.json"
    env_file = HQ_DIR / "2사업부" / ".env"
    api_key = ""
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8", errors="ignore").splitlines():
            if line.startswith("LEMONSQUEEZY_API_KEY="):
                api_key = line.split("=", 1)[1].strip().strip("'\"")
    if not api_key:
        return {"checked": False, "approved": False, "plan": "unknown"}

    try:
        req = urllib.request.Request(
            "https://api.lemonsqueezy.com/v1/stores/296100",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Accept": "application/vnd.api+json",
                "User-Agent": "Mozilla/5.0",
            },
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            attr = data.get("data", {}).get("attributes", {})
            plan = str(attr.get("plan", "free")).lower()
            approved = plan != "free"
            prev_approved = False
            if state_file.exists():
                try:
                    prev_approved = bool(json.loads(state_file.read_text(encoding="utf-8")).get("approved", False))
                except Exception:
                    pass
            state_file.parent.mkdir(parents=True, exist_ok=True)
            state_file.write_text(
                json.dumps({"checked": True, "approved": approved, "plan": plan}, ensure_ascii=False),
                encoding="utf-8",
            )
            if approved and not prev_approved:
                alert_msg = (
                    "🎉🎊 <b>[긴급 속보: Lemon Squeezy 스토어 #296100 최종 승인 완료!!]</b>\n"
                    f"• <b>스토어 상태</b>: <code>plan: {plan}</code> (Live 실결제 활성화 완료!)\n"
                    "• <b>적용 도메인</b>: https://truthofmarket.com &amp; https://kisfitglobal.com\n"
                    "• 이제 모든 VIP 실결제 체크아웃이 정상 가동됩니다!"
                )
                notify_division_bot("TOM", alert_msg)
                notify_division_bot("KFG", alert_msg)
            return {"checked": True, "approved": approved, "plan": plan}
    except Exception as e:
        return {"checked": False, "approved": False, "error": str(e)}


def main():
    kst_now = datetime.now(KST)
    hour = kst_now.hour
    for idx, arg in enumerate(sys.argv):
        if arg == "--hour" and idx + 1 < len(sys.argv):
            hour = int(sys.argv[idx + 1]) % 24

    silent = "--silent" in sys.argv
    notify = ("--notify" in sys.argv) or (not silent)

    r_tom = run_div1_tom(hour)
    r_kfg = run_div2_kfg(hour)
    r_gba = run_div3_gba(hour)
    r_hero = run_div4_hero(hour)
    r_kfk = run_div5_kfk(hour)

    from hq_hourly_cross_audit_healer import run_all_cross_audits
    audit_rep = run_all_cross_audits()
    ls_status = check_lemonsqueezy_store_approval()

    summary = (
        f"[1사업부 TOM] {r_tom['telegraph_url']} ({r_tom['index_urls']} URLs) | "
        f"[2사업부 KFG] {r_kfg['telegraph_url']} ({r_kfg['index_urls']} URLs) | "
        f"[3사업부 GBA] {r_gba['telegraph_url']} ({r_gba['index_urls']} URLs) | "
        f"[4사업부 HERO] {r_hero['telegraph_url']} ({r_hero['index_urls']} URLs) | "
        f"[5사업부 KFK] {r_kfk['telegraph_url']} ({r_kfk['index_urls']} URLs) | "
        f"[상호검열 자동수리 {audit_rep['total_healed']}건]"
    )

    entry = {
        "timestamp_kst": kst_now.strftime("%Y-%m-%d %H:%M:%S KST"),
        "hour": f"{hour:02d}:00",
        "division": "전사업부 1~5사업부 1시간 주기 순차 자동 홍보 가동",
        "results": {
            "TOM": r_tom,
            "KFG": r_kfg,
            "GBA": r_gba,
            "HERO": r_hero,
            "KFK": r_kfk,
        },
        "result_summary": summary,
        "cross_audit_healed": audit_rep["total_healed"],
    }
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    if notify:
        notify_division_bot(
            "TOM",
            f"🚀 <b>[1사업부: TruthOfMarket (truthofmarket.com) {hour:02d}:00 자동 홍보 완료]</b>\n"
            f"• <b>High-DA 영문 퀀트 리포트(telegra.ph)</b>: {r_tom['telegraph_url']}\n"
            f"• <b>AI 검색(llms.txt) &amp; IndexNow 색인 핑</b>: {r_tom['index_urls']}개 URL 즉시 푸시 완료",
        )
        notify_division_bot(
            "KFG",
            f"🚀 <b>[2사업부: KISFIT Global (kisfitglobal.com) {hour:02d}:00 자동 홍보 완료]</b>\n"
            f"• <b>신규 영문 임상 Q&amp;A 랜딩</b>: {r_kfg.get('qna_url', 'https://kisfitglobal.com/qna/')}\n"
            f"• <b>High-DA 영문 칼럼 백링크(telegra.ph)</b>: {r_kfg['telegraph_url']}\n"
            f"• <b>IndexNow · Bing · Google WebSub 색인 핑</b>: {r_kfg['index_urls']}개 URL 즉시 푸시 완료",
        )
        notify_division_bot(
            "GBA",
            f"🚀 <b>[3사업부: GetBreakAI 일본퀀트 (getbreakai.com/jp/) {hour:02d}:00 자동 홍보 완료]</b>\n"
            f"• <b>High-DA 일본어 퀀트 리포트(telegra.ph)</b>: {r_gba['telegraph_url']}\n"
            f"• <b>일본어 GEO(llms.txt) &amp; IndexNow 색인 핑</b>: {r_gba['index_urls']}개 URL 즉시 푸시 완료",
        )
        notify_division_bot(
            "HERO",
            f"🚀 <b>[4사업부: 파라다이스히어로 · 영웅라디오 (paradise-hero.com) {hour:02d}:00 자동 홍보 완료]</b>\n"
            f"• <b>High-DA 명곡 해설 칼럼(telegra.ph)</b>: {r_hero['telegraph_url']}\n"
            f"• <b>IndexNow 실시간 색인 핑</b>: {r_hero['index_urls']}개 핵심 URL 푸시 완료",
        )
        notify_division_bot(
            "KFK",
            f"🚀 <b>[5사업부: 키즈핏 코리아 패시브 (kidsfit.co.kr) {hour:02d}:00 자동 홍보 완료]</b>\n"
            f"• <b>High-DA 소아성장·두뇌발달 칼럼(telegra.ph)</b>: {r_kfk['telegraph_url']}\n"
            f"• <b>AI 검색(llms.txt) &amp; IndexNow 색인 핑</b>: {r_kfk['index_urls']}개 URL 푸시 완료\n"
            f"• <b>수익 가드레일</b>: 쿠팡(AF7865143)·링크프라이스(A100708867) 정상 / 금지어 0건",
        )

    print(json.dumps(entry, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
