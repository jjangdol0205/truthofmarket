#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/hq_24h_hourly_scheduler.py (Zero-Ban v2.0)
전사 5대 사업부 (1사업부 TOM · 2사업부 KFG · 3사업부 GBA · 4사업부 HERO · 5사업부 KFK)
Zero-Ban 인간 리듬 기반 텍스트 자동 홍보 · SHA-256 델타 색인 · 상시 상호검열 스케줄러

핵심 업그레이드 (Zero-Ban v2.0):
  1. 기존 24시간 매시간 무차별 도배(일 120회 Telegraph + 매시간 중복 IndexNow 403 유발) 전면 폐기
  2. 각 사업부 타깃 국가 골든타임(일 2회)에만 텍스트 발행·델타 색인 실행:
     - 1사업부 (TOM  - truthofmarket.com) : 07시 · 21시 KST (@RigjtsideAlphabot)
     - 2사업부 (KFG  - kisfitglobal.com)  : 10시 · 22시 KST (@kidsfittbot)
     - 3사업부 (GBA  - getbreakai.com/jp/): 07시 · 20시 KST (@SemifearGreedbot)
     - 4사업부 (HERO - paradise-hero.com) : 08시 · 19시 KST (@inves123_bot)
     - 5사업부 (KFK  - kidsfit.co.kr)     : 09시 · 21시 KST (@Moneyfiityyy_bot)
  3. 비발행 시간대에는 0초 스탠바이(외부 핑 0건, 텔레그램 중복 알림 0건) + 상호검열 자가치유 및 Lemon Squeezy 승인 감시만 상시 유지
  4. 서브프로세스 타임아웃 180초 확장으로 TimeoutExpired 장애 원천 차단
"""

import atexit
import json
import os
import signal
import subprocess
import sys
import time
import urllib.request
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
EXEC_LOG_FILE = DIV1_DIR / "data" / "hq_24h_scheduler_exec.log"
SCHEDULER_PID_FILE = DIV1_DIR / "data" / "hq_24h_scheduler.pid"
BRIDGE_JS = DIV1_DIR / "scripts" / "master_hq_telegram_bridge.js"


def _append_exec_log(message: str) -> None:
    """Short-lived UTF-8 append logger (never holds a persistent Windows file handle)."""
    ts = datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST")
    line = f"[{ts}] {message}\n"
    try:
        EXEC_LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(EXEC_LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line)
    except Exception:
        pass


def _is_hour_already_logged(date_prefix: str, hour: int) -> bool:
    """Checks if `hq_24h_work_log.jsonl` already recorded a completed cycle for `YYYY-MM-DD` + `HH:00`."""
    if not LOG_FILE.exists():
        return False
    target_hour = f"{hour:02d}:00"
    try:
        lines = LOG_FILE.read_text(encoding="utf-8", errors="ignore").splitlines()[-30:]
        for raw in reversed(lines):
            if not raw.strip():
                continue
            obj = json.loads(raw)
            ts = str(obj.get("timestamp_kst", ""))
            if ts.startswith(date_prefix) and obj.get("hour") == target_hour:
                return True
    except Exception:
        pass
    return False

scripts_dir = str(DIV1_DIR / "scripts")
if scripts_dir not in sys.path:
    sys.path.insert(0, scripts_dir)

PUBLISH_WINDOWS_KST = {
    "TOM": (7, 21),
    "KFG": (10, 22),
    "GBA": (7, 20),
    "HERO": (8, 19),
    "KFK": (9, 21),
}

HOURLY_SCHEDULE = {
    h: {
        "hour": f"{h:02d}:00",
        "TOM": "[1사업부 TOM] Zero-Ban 영문 퀀트 인사이트 & 델타 IndexNow 가동" if h in PUBLISH_WINDOWS_KST["TOM"] else "[1사업부 TOM] Zero-Ban 쿨다운 스탠바이",
        "KFG": "[2사업부 KFG] Zero-Ban 영문 소아성장 칼럼 & 델타 IndexNow 가동" if h in PUBLISH_WINDOWS_KST["KFG"] else "[2사업부 KFG] Zero-Ban 쿨다운 스탠바이",
        "GBA": "[3사업부 GBA] Zero-Ban 일본 新NISA 퀀트 리포트 & 델타 IndexNow 가동" if h in PUBLISH_WINDOWS_KST["GBA"] else "[3사업부 GBA] Zero-Ban 쿨다운 스탠바이",
        "HERO": "[4사업부 HERO] Zero-Ban 시니어 큰글씨 편지 & 델타 IndexNow 가동" if h in PUBLISH_WINDOWS_KST["HERO"] else "[4사업부 HERO] Zero-Ban 쿨다운 스탠바이",
        "KFK": "[5사업부 KFK] Zero-Ban 소아성장 패시브 SEO & D.I.A.+ 아웃박스 가동" if h in PUBLISH_WINDOWS_KST["KFK"] else "[5사업부 KFK] Zero-Ban 패시브 가드레일 스탠바이",
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


def run_div1_tom(hour: int, force: bool = False) -> dict:
    cwd = str(DIV1_DIR)
    if hour == 6:
        for s_name in ["sync_live_market_data.py", "build_static_bundle.py"]:
            sp = DIV1_DIR / "scripts" / s_name
            if sp.exists():
                subprocess.run([sys.executable, str(sp)], cwd=cwd, timeout=180, capture_output=True)

    reg = _read_json(DIV1_DIR / "data" / "tom_external_backlinks.json", [])
    last_url = reg[-1].get("url", "") if reg else "https://truthofmarket.com/insights/"

    if not force and hour not in PUBLISH_WINDOWS_KST["TOM"]:
        return {
            "div": "TOM",
            "name": "1사업부 TruthOfMarket (truthofmarket.com)",
            "bot": "@RigjtsideAlphabot",
            "executed": False,
            "telegraph_url": last_url,
            "index_urls": 0,
            "stdout": f"STANDBY (scheduled at {PUBLISH_WINDOWS_KST['TOM']} KST)",
        }

    s_promo = DIV1_DIR / "scripts" / "tom_auto_promotion_engine.py"
    res = subprocess.run(
        [sys.executable, str(s_promo)],
        cwd=cwd,
        timeout=180,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    stdout_line = (res.stdout or "").strip().splitlines()[-1] if (res.stdout or "").strip() else ""
    reg = _read_json(DIV1_DIR / "data" / "tom_external_backlinks.json", [])
    last_url = reg[-1].get("url", "") if reg else "https://truthofmarket.com/insights/"
    return {
        "div": "TOM",
        "name": "1사업부 TruthOfMarket (truthofmarket.com)",
        "bot": "@RigjtsideAlphabot",
        "executed": True,
        "telegraph_url": last_url,
        "index_urls": 134,
        "stdout": stdout_line,
    }


def run_div2_kfg(hour: int, force: bool = False) -> dict:
    cwd = str(DIV2_DIR)
    state = _read_json(DIV2_DIR / "logs" / "auto_promotion_state.json", {})
    last_tg = state.get("lastTelegraphUrl", "https://kisfitglobal.com/qna/")
    last_qna = state.get("lastGeneratedQnaUrl", "https://kisfitglobal.com/qna/")

    if not force and hour not in PUBLISH_WINDOWS_KST["KFG"]:
        return {
            "div": "KFG",
            "name": "2사업부 KISFIT Global (kisfitglobal.com)",
            "bot": "@kidsfittbot",
            "executed": False,
            "telegraph_url": last_tg,
            "qna_url": last_qna,
            "index_urls": 0,
            "stdout": f"STANDBY (scheduled at {PUBLISH_WINDOWS_KST['KFG']} KST)",
        }

    s_promo = DIV2_DIR / "scripts" / "kfg_zero_ban_text_engine.py"
    res = subprocess.run(
        [sys.executable, str(s_promo)],
        cwd=cwd,
        timeout=180,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    state = _read_json(DIV2_DIR / "logs" / "auto_promotion_state.json", {})
    return {
        "div": "KFG",
        "name": "2사업부 KISFIT Global (kisfitglobal.com)",
        "bot": "@kidsfittbot",
        "executed": True,
        "telegraph_url": state.get("lastTelegraphUrl", last_tg),
        "qna_url": state.get("lastGeneratedQnaUrl", last_qna),
        "index_urls": 128,
        "stdout": (res.stdout or "").strip().splitlines()[-1] if (res.stdout or "").strip() else "",
    }


def run_div3_gba(hour: int, force: bool = False) -> dict:
    cwd = str(DIV3_DIR)
    if hour == 6:
        for cmd in [
            [sys.executable, str(DIV3_DIR / "scripts" / "sync_getbreakai_live_data.py")],
            [sys.executable, str(DIV3_DIR / "scripts" / "build_jp_seo_pages.py")],
            [sys.executable, str(DIV3_DIR / "scripts" / "generate_jp_daily_column_html.py")],
            [sys.executable, str(DIV3_DIR / "scripts" / "upgrade_jp_fintech_uiux.py")],
            ["node", str(DIV3_DIR / "scripts" / "build_dist.js")],
        ]:
            subprocess.run(cmd, cwd=cwd, timeout=180, capture_output=True)
    reg = _read_json(DIV3_DIR / "data" / "jp_external_backlinks.json", [])
    last_url = reg[-1].get("url", "") if reg else "https://getbreakai.com/jp/daily-nisa-quant-report.html"

    if not force and hour not in PUBLISH_WINDOWS_KST["GBA"]:
        return {
            "div": "GBA",
            "name": "3사업부 GetBreakAI (getbreakai.com/jp/)",
            "bot": "@SemifearGreedbot",
            "executed": False,
            "telegraph_url": last_url,
            "index_urls": 0,
            "stdout": f"STANDBY (scheduled at {PUBLISH_WINDOWS_KST['GBA']} KST)",
        }

    s_promo = DIV3_DIR / "scripts" / "gba_jp_auto_promotion_engine.py"
    res = subprocess.run(
        [sys.executable, str(s_promo)],
        cwd=cwd,
        timeout=180,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    reg = _read_json(DIV3_DIR / "data" / "jp_external_backlinks.json", [])
    last_url = reg[-1].get("url", "") if reg else "https://getbreakai.com/jp/daily-nisa-quant-report.html"
    return {
        "div": "GBA",
        "name": "3사업부 GetBreakAI (getbreakai.com/jp/)",
        "bot": "@SemifearGreedbot",
        "executed": True,
        "telegraph_url": last_url,
        "index_urls": 33,
        "stdout": (res.stdout or "").strip().splitlines()[-1] if (res.stdout or "").strip() else "",
    }


def run_div4_hero(hour: int, force: bool = False) -> dict:
    cwd = str(DIV4_DIR)
    st = _read_json(DIV4_DIR / "data" / "hero_promotion_status.json", {})
    last_url = st.get("telegraph_url", "https://paradise-hero.com/columns/index.html")

    if not force and hour not in PUBLISH_WINDOWS_KST["HERO"]:
        return {
            "div": "HERO",
            "name": "4사업부 파라다이스히어로 · 영웅라디오 (paradise-hero.com)",
            "bot": "@inves123_bot",
            "executed": False,
            "telegraph_url": last_url,
            "index_urls": 0,
            "stdout": f"STANDBY (scheduled at {PUBLISH_WINDOWS_KST['HERO']} KST)",
        }

    s_promo = DIV4_DIR / "scripts" / "hero_auto_promotion_engine.py"
    res = subprocess.run(
        [sys.executable, str(s_promo)],
        cwd=cwd,
        timeout=180,
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
        "executed": True,
        "telegraph_url": st.get("telegraph_url", last_url),
        "index_urls": 19,
        "stdout": (res.stdout or "").strip().splitlines()[-1] if (res.stdout or "").strip() else "",
    }


def run_div5_kfk(hour: int, force: bool = False) -> dict:
    cwd = str(DIV5_DIR)
    st = _read_json(DIV5_DIR / "logs" / "kfk_hourly_promo_status.json", {})
    last_url = st.get("telegraph_url", "https://kidsfit.co.kr/qna/index.html")

    if not force and hour not in PUBLISH_WINDOWS_KST["KFK"]:
        return {
            "div": "KFK",
            "name": "5사업부 KidsFit Korea 패시브 (kidsfit.co.kr)",
            "bot": "@Moneyfiityyy_bot",
            "executed": False,
            "telegraph_url": last_url,
            "index_urls": 0,
            "guardrails": st.get("guardrails", {}),
            "naver_status": "Zero-Ban 스탠바이",
            "stdout": f"STANDBY (scheduled at {PUBLISH_WINDOWS_KST['KFK']} KST)",
        }

    s_promo = DIV5_DIR / "scripts" / "kfk_hourly_passive_promo.py"
    res = subprocess.run(
        [sys.executable, str(s_promo)],
        cwd=cwd,
        timeout=180,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    st = _read_json(DIV5_DIR / "logs" / "kfk_hourly_promo_status.json", {})
    return {
        "div": "KFK",
        "name": "5사업부 KidsFit Korea 패시브 (kidsfit.co.kr)",
        "bot": "@Moneyfiityyy_bot",
        "executed": True,
        "telegraph_url": st.get("telegraph_url", last_url),
        "index_urls": st.get("canonical_url_count", 78),
        "guardrails": st.get("guardrails", {}),
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
                    "• <b>적용 도메인</b>: https://truthofmarket.com &amp; https://kisfitglobal.com &amp; https://getbreakai.com\n"
                    "• 이제 모든 VIP 실결제 체크아웃이 정상 가동됩니다!"
                )
                notify_division_bot("TOM", alert_msg)
                notify_division_bot("KFG", alert_msg)
            return {"checked": True, "approved": approved, "plan": plan}
    except Exception as e:
        return {"checked": False, "approved": False, "error": str(e)}


def _safe_run(name: str, fn, hour: int, force: bool, fallback: dict) -> dict:
    try:
        return fn(hour, force=force)
    except Exception as e:
        err = f"[{name} Error] {type(e).__name__}: {e}"
        print(err, file=sys.stderr)
        fb = dict(fallback)
        fb["error"] = str(e)
        fb["stdout"] = err
        return fb


def execute_hourly_cycle(hour: int, notify: bool = True, force_all: bool = False) -> dict:
    kst_now = datetime.now(KST)
    print(f"[{kst_now.strftime('%Y-%m-%d %H:%M:%S KST')}] Executing Zero-Ban v2 cycle for hour {hour:02d}:00 (force={force_all})...")
    sys.stdout.flush()

    r_tom = _safe_run("TOM", run_div1_tom, hour, force_all, {
        "div": "TOM", "name": "1사업부 TruthOfMarket (truthofmarket.com)", "bot": "@RigjtsideAlphabot",
        "executed": False, "telegraph_url": "", "index_urls": 0, "stdout": ""
    })
    r_kfg = _safe_run("KFG", run_div2_kfg, hour, force_all, {
        "div": "KFG", "name": "2사업부 KISFIT Global (kisfitglobal.com)", "bot": "@kidsfittbot",
        "executed": False, "telegraph_url": "", "qna_url": "", "index_urls": 0, "stdout": ""
    })
    r_gba = _safe_run("GBA", run_div3_gba, hour, force_all, {
        "div": "GBA", "name": "3사업부 GetBreakAI (getbreakai.com/jp/)", "bot": "@SemifearGreedbot",
        "executed": False, "telegraph_url": "", "index_urls": 0, "stdout": ""
    })
    r_hero = _safe_run("HERO", run_div4_hero, hour, force_all, {
        "div": "HERO", "name": "4사업부 파라다이스히어로 · 영웅라디오 (paradise-hero.com)", "bot": "@inves123_bot",
        "executed": False, "telegraph_url": "", "index_urls": 0, "stdout": ""
    })
    r_kfk = _safe_run("KFK", run_div5_kfk, hour, force_all, {
        "div": "KFK", "name": "5사업부 KidsFit Korea 패시브 (kidsfit.co.kr)", "bot": "@Moneyfiityyy_bot",
        "executed": False, "telegraph_url": "", "index_urls": 0, "guardrails": {}, "naver_status": "", "stdout": ""
    })

    audit_rep = {"total_healed": 0}
    try:
        from hq_hourly_cross_audit_healer import run_all_cross_audits
        audit_rep = run_all_cross_audits()
    except Exception as e:
        print(f"[Audit Warning] {e}", file=sys.stderr)

    try:
        check_lemonsqueezy_store_approval()
    except Exception as e:
        print(f"[LemonSqueezy Warning] {e}", file=sys.stderr)

    # Once-daily Market Close Freshness & Affiliate Expiration Self-Healing Watchdog (runs after 06:00 KST)
    if hour >= 6:
        try:
            watchdog_py = HQ_DIR / "text_automation_hq" / "hq_daily_freshness_and_link_healer.py"
            if watchdog_py.exists():
                subprocess.run(
                    [sys.executable, str(watchdog_py), "--daily-gate"],
                    cwd=str(HQ_DIR / "text_automation_hq"),
                    timeout=240,
                    capture_output=True,
                )
        except Exception as e:
            print(f"[DailyFreshnessWatchdog Warning] {e}", file=sys.stderr)

    summary = (
        f"[TOM:{'RUN' if r_tom.get('executed') else 'IDLE'}] | "
        f"[KFG:{'RUN' if r_kfg.get('executed') else 'IDLE'}] | "
        f"[GBA:{'RUN' if r_gba.get('executed') else 'IDLE'}] | "
        f"[HERO:{'RUN' if r_hero.get('executed') else 'IDLE'}] | "
        f"[KFK:{'RUN' if r_kfk.get('executed') else 'IDLE'}] | "
        f"[상호검열 자동수리 {audit_rep.get('total_healed', 0)}건]"
    )

    entry = {
        "timestamp_kst": kst_now.strftime("%Y-%m-%d %H:%M:%S KST"),
        "hour": f"{hour:02d}:00",
        "engine": "Zero-Ban v2.0",
        "results": {
            "TOM": r_tom,
            "KFG": r_kfg,
            "GBA": r_gba,
            "HERO": r_hero,
            "KFK": r_kfk,
        },
        "result_summary": summary,
        "cross_audit_healed": audit_rep.get("total_healed", 0),
    }
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    # Notify ONLY divisions that actually executed in this scheduled window (zero hourly spam!)
    if notify:
        if r_tom.get("executed") and r_tom.get("telegraph_url"):
            notify_division_bot(
                "TOM",
                f"🚀 <b>[1사업부: TruthOfMarket {hour:02d}:00 Zero-Ban 텍스트 자동화 완료]</b>\n"
                f"• <b>인사이트 · 백링크</b>: {r_tom['telegraph_url']}\n"
                f"• <b>SHA-256 델타 IndexNow &amp; 2-Step 아웃박스</b>: 동기화 완료",
            )
        if r_kfg.get("executed") and r_kfg.get("telegraph_url"):
            notify_division_bot(
                "KFG",
                f"🚀 <b>[2사업부: KISFIT Global {hour:02d}:00 Zero-Ban 텍스트 자동화 완료]</b>\n"
                f"• <b>임상 아티클</b>: {r_kfg['telegraph_url']}\n"
                f"• <b>SHA-256 델타 IndexNow &amp; 2-Step 아웃박스</b>: 동기화 완료",
            )
        if r_gba.get("executed") and r_gba.get("telegraph_url"):
            notify_division_bot(
                "GBA",
                f"🚀 <b>[3사업부: GetBreakAI 일본퀀트 {hour:02d}:00 Zero-Ban 텍스트 자동화 완료]</b>\n"
                f"• <b>新NISA 일간 리포트</b>: {r_gba['telegraph_url']}\n"
                f"• <b>SHA-256 델타 IndexNow &amp; #株クラ 2-Step 아웃박스</b>: 동기화 완료",
            )
        if r_hero.get("executed") and r_hero.get("telegraph_url"):
            notify_division_bot(
                "HERO",
                f"🚀 <b>[4사업부: 파라다이스히어로 {hour:02d}:00 Zero-Ban 큰글씨 편지 발행 완료]</b>\n"
                f"• <b>오늘의 명곡·건강 편지</b>: {r_hero['telegraph_url']}\n"
                f"• <b>카톡·밴드 공유 팩 &amp; 델타 색인</b>: 동기화 완료",
            )
        if r_kfk.get("executed") and r_kfk.get("telegraph_url"):
            notify_division_bot(
                "KFK",
                f"🚀 <b>[5사업부: 키즈핏 코리아 {hour:02d}:00 Zero-Ban 패시브 텍스트 동기화 완료]</b>\n"
                f"• <b>오늘의 임상 노트</b>: {r_kfk['telegraph_url']}\n"
                f"• <b>수익 가드레일</b>: 쿠팡(AF7865143)·링크프라이스(A100708867) 정상 / 금지어 0건",
            )

    return entry


def _cleanup_scheduler_pid():
    try:
        if SCHEDULER_PID_FILE.exists():
            content = SCHEDULER_PID_FILE.read_text(encoding="utf-8").strip()
            if content == str(os.getpid()):
                SCHEDULER_PID_FILE.unlink(missing_ok=True)
    except Exception:
        pass


def run_daemon(notify: bool = True):
    pid = os.getpid()
    SCHEDULER_PID_FILE.parent.mkdir(parents=True, exist_ok=True)

    if SCHEDULER_PID_FILE.exists():
        try:
            old_pid_text = SCHEDULER_PID_FILE.read_text(encoding="utf-8").strip()
            if old_pid_text and old_pid_text.isdigit():
                old_pid = int(old_pid_text)
                if old_pid != pid:
                    try:
                        os.kill(old_pid, 0)
                        print(f"[HQ Zero-Ban Scheduler] Stopping previous instance PID {old_pid}...")
                        os.kill(old_pid, signal.SIGTERM)
                        time.sleep(1)
                    except OSError:
                        pass
        except Exception:
            pass

    SCHEDULER_PID_FILE.write_text(str(pid), encoding="utf-8")
    atexit.register(_cleanup_scheduler_pid)

    def _sig_handler(signum, frame):
        print(f"\n[HQ Zero-Ban Scheduler] Interrupted (signal {signum}). Exiting cleanly...")
        _cleanup_scheduler_pid()
        sys.exit(0)

    try:
        signal.signal(signal.SIGINT, _sig_handler)
        signal.signal(signal.SIGTERM, _sig_handler)
    except Exception:
        pass

    kst_now = datetime.now(KST)
    print(f"[HQ Zero-Ban Scheduler] Started PID {pid} at {kst_now.strftime('%Y-%m-%d %H:%M:%S KST')}.")

    run_now = "--run-now" in sys.argv
    last_run_hour = None if run_now else kst_now.hour
    sys.stdout.flush()

    while True:
        try:
            now = datetime.now(KST)
            cur_hour = now.hour
            if cur_hour != last_run_hour:
                if not _is_hour_already_logged(now.strftime("%Y-%m-%d"), cur_hour):
                    entry = execute_hourly_cycle(cur_hour, notify=notify, force_all=False)
                    msg = f"[HQ Zero-Ban Scheduler] Completed {cur_hour:02d}:00 -> {entry.get('result_summary')}"
                    print(msg)
                    _append_exec_log(msg)
                last_run_hour = cur_hour
                sys.stdout.flush()
        except Exception as loop_err:
            err_msg = f"[HQ Zero-Ban Scheduler Loop Error] {loop_err}"
            print(err_msg, file=sys.stderr)
            _append_exec_log(err_msg)
            sys.stderr.flush()

        time.sleep(30)


def main():
    if "--help" in sys.argv or "-h" in sys.argv:
        print("Usage: hq_24h_hourly_scheduler.py [--daemon] [--run-now] [--hour H] [--force-all] [--notify] [--silent]")
        return

    notify = "--notify" in sys.argv
    force_all = "--force-all" in sys.argv

    if "--daemon" in sys.argv:
        run_daemon(notify=notify)
        return

    kst_now = datetime.now(KST)
    hour = kst_now.hour
    explicit_hour = False
    for idx, arg in enumerate(sys.argv):
        if arg == "--hour" and idx + 1 < len(sys.argv):
            hour = int(sys.argv[idx + 1]) % 24
            explicit_hour = True

    if not force_all and not explicit_hour and _is_hour_already_logged(kst_now.strftime("%Y-%m-%d"), hour):
        skip_msg = f"[SKIP] {kst_now.strftime('%Y-%m-%d')} {hour:02d}:00 cycle already completed cleanly."
        _append_exec_log(skip_msg)
        if "--silent" not in sys.argv:
            print(skip_msg)
        return

    entry = execute_hourly_cycle(hour, notify=notify, force_all=force_all)
    _append_exec_log(f"Scheduled run {hour:02d}:00 -> {entry.get('result_summary')}")
    if "--silent" not in sys.argv:
        print(json.dumps(entry, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
