# -*- coding: utf-8 -*-
"""
HQ 5-Division Hourly Read-Only SSOT Cross-Audit Engine (Zero-Mutation / Anti-Crash v2.0)
(1~5사업부 매시간 실서버·SSOT 가드레일 읽기 전용 점검 엔진)

Anti-Crash & Stability Hardening (2026-11-21):
- Permanently removes legacy Lemon Squeezy auto-edits, hourly `build_static_bundle.py` /
  `node scripts/build.js` rebuild storms, and hourly `git commit/rebase/push` loops that
  triggered Antigravity file-watcher spikes and RAM/CPU thrashing 24x/day on 8GB RAM PCs.
- Website builds & deploys remain strictly owned by `homepage` (1921e31e) and
  `scripts/hq_security_and_modular_ops.py`.
- Preserves exact public API (`run_all_cross_audits`, `format_cross_audit_summary`,
  `check_url_status`) for full compatibility with `hq_24h_hourly_scheduler.py`.
"""

import json
import pathlib
import sys
import urllib.request
from datetime import datetime, timedelta, timezone

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

KST = timezone(timedelta(hours=9))

TOM_ROOT = pathlib.Path(r"D:\드림컴퍼니\1사업부")
KFG_ROOT = pathlib.Path(r"D:\드림컴퍼니\2사업부")
GBA_ROOT = pathlib.Path(r"D:\드림컴퍼니\3사업부")
HERO_ROOT = pathlib.Path(r"D:\드림컴퍼니\4사업부")
KFK_ROOT = pathlib.Path(r"D:\드림컴퍼니\5사업부")
AUDIT_LOG_PATH = TOM_ROOT / "data" / "hq_hourly_cross_audit_log.json"

KFK_PROHIBITED = ("\ucd5c\uc800\uac00", "\ud560\uc778\uc728", "\ud2b9\uac00", "\ud3ed\ud0c4\uc138\uc77c", "lemonsqueezy.com")
HERO_PROHIBITED = ("\ud669\uc601\uc6c5", "lemonsqueezy.com")


def check_url_status(url: str, timeout: int = 8) -> int:
    try:
        req = urllib.request.Request(
            url,
            method="HEAD",
            headers={"User-Agent": "DreamCompany-ReadOnlyAudit/2.0"},
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.getcode()
    except Exception:
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "DreamCompany-ReadOnlyAudit/2.0"},
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.getcode()
        except Exception as e:
            return getattr(e, "code", 0) or 0


def _read_text_safe(path: pathlib.Path, limit_bytes: int = 200_000) -> str:
    if not path.exists():
        return ""
    try:
        with path.open("rb") as f:
            raw = f.read(limit_bytes)
        return raw.decode("utf-8", errors="replace")
    except Exception:
        return ""


def audit_and_heal_tom() -> dict:
    """Read-only SSOT health check for 1사업부 (`truthofmarket.com`, Whop)."""
    checks = []
    alerts = []
    idx_txt = _read_text_safe(TOM_ROOT / "dist" / "index.html") or _read_text_safe(TOM_ROOT / "index.html")
    if idx_txt:
        if "lemonsqueezy.com" in idx_txt.lower():
            alerts.append("⚠️ [감지] 1사업부 index.html 내 구 lemonsqueezy.com 문자열 잔존")
        else:
            checks.append("✅ [SSOT검열] 1사업부 Whop 기준 정합 (lemonsqueezy 0건)")
    code = check_url_status("https://truthofmarket.com/")
    checks.append(f"✅ [라이브검열] truthofmarket.com 응답 HTTP {code}")
    if code != 200:
        alerts.append(f"⚠️ [라이브경보] truthofmarket.com HTTP {code}")
    return {
        "division": "1사업부 (truthofmarket.com · @RigjtsideAlphabot)",
        "auditors": "HQ 읽기전용 SSOT 감사관",
        "checks": checks,
        "healed": alerts,
    }


def audit_and_heal_kfg() -> dict:
    """Read-only SSOT health check for 2사업부 (`kisfitglobal.com`, Polar.sh)."""
    checks = []
    alerts = []
    idx_txt = _read_text_safe(KFG_ROOT / "dist-global" / "index.html") or _read_text_safe(KFG_ROOT / "index.html")
    if idx_txt:
        if "lemonsqueezy.com" in idx_txt.lower():
            alerts.append("⚠️ [감지] 2사업부 index.html 내 구 lemonsqueezy.com 문자열 잔존")
        else:
            checks.append("✅ [SSOT검열] 2사업부 Polar.sh ($8.99/$19.99) 기준 정합 (lemonsqueezy 0건)")
    code = check_url_status("https://kisfitglobal.com/")
    checks.append(f"✅ [라이브검열] kisfitglobal.com 응답 HTTP {code}")
    if code != 200:
        alerts.append(f"⚠️ [라이브경보] kisfitglobal.com HTTP {code}")
    return {
        "division": "2사업부 (kisfitglobal.com · @kidsfittbot)",
        "auditors": "HQ 읽기전용 SSOT 감사관",
        "checks": checks,
        "healed": alerts,
    }


def audit_and_heal_gba() -> dict:
    """Read-only SSOT health check for 3사업부 (`getbreakai.com/jp/`, Whop)."""
    checks = []
    alerts = []
    jp_txt = _read_text_safe(GBA_ROOT / "jp" / "index.html")
    if jp_txt:
        if "t.me" in jp_txt.lower() or "lemonsqueezy.com" in jp_txt.lower():
            alerts.append("⚠️ [감지] 3사업부 jp/index.html 내 금지 문자열(t.me/lemonsqueezy) 잔존")
        else:
            checks.append("✅ [SSOT검열] 3사업부 일본 新NISA Whop 기준 정합 (t.me·lemonsqueezy 0건)")
    code = check_url_status("https://getbreakai.com/jp/")
    checks.append(f"✅ [라이브검열] getbreakai.com/jp/ 응답 HTTP {code}")
    if code != 200:
        alerts.append(f"⚠️ [라이브경보] getbreakai.com/jp/ HTTP {code}")
    return {
        "division": "3사업부 (getbreakai.com/jp/ · @SemifearGreedbot)",
        "auditors": "HQ 읽기전용 SSOT 감사관",
        "checks": checks,
        "healed": alerts,
    }


def audit_and_heal_hero() -> dict:
    """Read-only SSOT health check for 4사업부 (`paradise-hero.com`, Baek Woon-ho IP)."""
    checks = []
    alerts = []
    idx_txt = _read_text_safe(HERO_ROOT / "index.html")
    if idx_txt:
        hits = [w for w in HERO_PROHIBITED if w in idx_txt.lower()]
        if hits:
            alerts.append(f"⚠️ [감지] 4사업부 index.html 금지 문자열 발견: {len(hits)}건")
        else:
            checks.append("✅ [SSOT검열] 4사업부 가상 트로트 가수 백운호 IP 청정 (실존가수·lemonsqueezy 0건)")
    code = check_url_status("https://paradise-hero.com/")
    checks.append(f"✅ [라이브검열] paradise-hero.com 응답 HTTP {code}")
    if code != 200:
        alerts.append(f"⚠️ [라이브경보] paradise-hero.com HTTP {code}")
    return {
        "division": "4사업부 (paradise-hero.com · @inves123_bot)",
        "auditors": "HQ 읽기전용 SSOT 감사관",
        "checks": checks,
        "healed": alerts,
    }


def audit_and_heal_kfk() -> dict:
    """Read-only SSOT health check for 5사업부 (`kidsfit.co.kr`, Latpeed 0-affiliate)."""
    checks = []
    alerts = []
    idx_txt = _read_text_safe(KFK_ROOT / "index.html")
    if idx_txt:
        hits = [w for w in KFK_PROHIBITED if w in idx_txt.lower()]
        if hits:
            alerts.append(f"⚠️ [감지] 5사업부 index.html 금지 문자열 발견: {len(hits)}건")
        else:
            checks.append("✅ [SSOT검열] 5사업부 Latpeed 순수 유료 2등급 · 금지어/lemonsqueezy 0건")
    code = check_url_status("https://kidsfit.co.kr/")
    checks.append(f"✅ [라이브검열] kidsfit.co.kr 응답 HTTP {code}")
    if code != 200:
        alerts.append(f"⚠️ [라이브경보] kidsfit.co.kr HTTP {code}")
    return {
        "division": "5사업부 (kidsfit.co.kr · @Moneyfiityyy_bot)",
        "auditors": "HQ 읽기전용 SSOT 감사관",
        "checks": checks,
        "healed": alerts,
    }


def run_all_cross_audits() -> dict:
    now_str = datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST")
    r_tom = audit_and_heal_tom()
    r_kfg = audit_and_heal_kfg()
    r_gba = audit_and_heal_gba()
    r_hero = audit_and_heal_hero()
    r_kfk = audit_and_heal_kfk()

    report = {
        "timestamp": now_str,
        "mode": "READ_ONLY_ZERO_MUTATION_V2",
        "results": [r_tom, r_kfg, r_gba, r_hero, r_kfk],
        "total_healed": sum(len(x["healed"]) for x in [r_tom, r_kfg, r_gba, r_hero, r_kfk]),
    }
    AUDIT_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    AUDIT_LOG_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    return report


def format_cross_audit_summary(report: dict) -> str:
    lines = [
        f"⚖️ <b>[매시간 1~5사업부 읽기전용 SSOT 건강 점검 리포트]</b> ({report['timestamp']})"
    ]
    for r in report["results"]:
        lines.append(f"• <b>{r['division']}</b> (감사: {r['auditors']})")
        for h in r["healed"]:
            lines.append(f"  └ {h}")
        for c in r["checks"]:
            lines.append(f"  └ {c}")
    return "\n".join(lines)


if __name__ == "__main__":
    rep = run_all_cross_audits()
    print(format_cross_audit_summary(rep))
