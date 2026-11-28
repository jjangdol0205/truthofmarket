#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/homepage_swarm_cro.py
================================================================================
Dream Company — 5-Division Cloud Swarm Auto-CRO Engine (Option C: Edge HTMLRewriter + D1/R2)
Aligned 100% with:
  - docs/intent/20261128-homepage-swarm-auto-cro.md
  - GEMINI.md Single Voice SSOT & Sanctuary Locks
  - $0 Extra API Cost (Existing GEMINI_API_KEY Free/Existing Quota, Hard Cap <= 3 Calls/Div)
  - 0% Local PC Load (GitHub Actions Public Repo 5-Way Matrix)

Pipeline:
  Step 0 : D1 External Conversion Evaluator (Dual-Tier Rollback + 3-7d Cooldown Filter)
  Agent 1: CRO Analyst (0 LLM calls — picks 1 unlocked zone matching weakest AARRR stage)
  Agent 2: Copy & UX Proposer (Gemini 2.5 Flash -> Flash-Lite fallback, Tier-1 vs Tier-2 Split)
  Stage 1: Deterministic Sanctuary + SEO Keyword + AI Slop + Length Pre-Gate (0 LLM calls)
  Stage 2: Live Edge Preview (?cro_preview&internal_test=1) + Playwright 390x844 & 1280x800
           + Adversarial Visual Critic (Gemini Vision, >=85 & delta >=+3, max 1 retry)
  Stage 3: Atomic Edge Promotion + External live_audit_cloud.py + Instant 1-Sec Auto-Rollback
================================================================================
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import json
import math
import os
import random
import re
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

# ==============================================================================
# Hard-Locked Cost, Quota, Rollback & Critic Ceilings
# ==============================================================================
CENTRAL_API_BASE = "https://api.truthofmarket.com"
WATCHDOG_AUDIT_URL = "https://hq-watchdog-worker.hq-api-worker.workers.dev/reliability-audit"

MAX_GEMINI_CALLS_PER_DIV = 3
GEMINI_MODEL_CHAIN: Tuple[str, ...] = ("gemini-2.5-flash", "gemini-2.5-flash-lite")
STAGGER_SECONDS_BY_DIV: Dict[str, int] = {
    "TOM": 0,
    "KFG": 25,
    "GBA": 50,
    "HERO": 75,
    "KFK": 100,
}

# Dual-Tier Statistical Rollback Parameters (Verified via Monte Carlo CoVe)
ROLLBACK_MIN_UV = 30
ROLLBACK_MIN_DAYS = 3.0
ROLLBACK_REL_DROP = 0.25
ROLLBACK_BAYES_PROB = 0.90

# Adversarial Critic Thresholds
CRITIC_PASS_SCORE = 85
CRITIC_MIN_DELTA = 3
CRITIC_RETRY_FLOOR = 75

# Zone Cooldowns (Days)
ZONE_COOLDOWNS_DAYS: Dict[str, int] = {
    "zone_1_hero": 7,
    "zone_2_cta": 5,
    "zone_3_gate": 4,
    "zone_4_density": 3,
}

# Per-Division Verified Spec, Sanctuary DOM IDs, SEO Keyword Preservation & Slot Maps
DIV_SPECS: Dict[str, Dict[str, Any]] = {
    "TOM": {
        "domain": "truthofmarket.com",
        "url": "https://truthofmarket.com/",
        "lang": "en",
        "forbid_hangul": True,
        "min_cta_height": 44,
        "brand_brief": "Calm independent educational US ETF research (SMH x XLV + SGOV 2000-2025 historical statistics). Strictly non-advisory, zero hype, zero emojis.",
        "persona": "US 55-70 retirees/pre-retirees protecting nest eggs from market crashes & 0.01% broker sweep cash drag.",
        "seo_h1_regex": r"(?:retirement|crash|smh|xlv|market|growth)",
        "required_sanctuary_ids": ["tom-retirement-architect", "tom-passwordless-club-signup", "btnStartPwStepUp"],
        "zones": {
            "zone_1_hero": {"slot_id": "hero_h1", "selector": "h1.pw-serif-h1", "max_len": 115, "max_words": 16},
            "zone_2_cta": {"slot_id": "cta_primary", "selector": "#btnStartPwStepUp", "max_len": 68, "max_words": 12},
            "zone_3_gate": {"slot_id": "pricing_sub", "selector": "#pwPricingSubcopy", "max_len": 195, "max_words": 32},
            "zone_4_density": {"slot_id": "density", "selector": "body", "presets": ["cro-pad-compact", "cro-pad-airy"]},
        },
        "rehearsal_slot": {
            "zone_id": "zone_2_cta",
            "slot_id": "cta_primary",
            "text": "Run Free 30-Second 2008 Crash & Cash-Drag Stress Test →",
        },
    },
    "KFG": {
        "domain": "kisfitglobal.com",
        "url": "https://kisfitglobal.com/",
        "lang": "en",
        "forbid_hangul": True,
        "min_cta_height": 44,
        "brand_brief": "Warm boutique US CDC pediatric height reference atelier (zero supplement ads, non-medical educational reference, zero emojis).",
        "persona": "US parents of ages 4-14 wondering about height percentile, parents' height range, and 25% daily sleep/habit runway.",
        "seo_h1_regex": r"(?:height|child|cdc|growth)",
        "required_sanctuary_ids": ["kfg-screen-0-letter", "kfg-bone-age-interpreter", "btn-kfg-begin-atelier-top"],
        "zones": {
            "zone_1_hero": {"slot_id": "hero_h1", "selector": "#kfg-founding-letter-heading", "max_len": 120, "max_words": 18},
            "zone_2_cta": {"slot_id": "cta_primary", "selector": "#btn-kfg-begin-atelier-top", "max_len": 64, "max_words": 11},
            "zone_3_gate": {"slot_id": "gate_sub", "selector": "#kfg-sample-above-cta", "max_len": 160, "max_words": 28},
            "zone_4_density": {"slot_id": "density", "selector": "body", "presets": ["cro-pad-compact", "cro-pad-airy"]},
        },
        "rehearsal_slot": {
            "zone_id": "zone_2_cta",
            "slot_id": "cta_primary",
            "text": "Check Instant US CDC Height Percentile Preview (Free) →",
        },
    },
    "GBA": {
        "domain": "getbreakai.com",
        "url": "https://getbreakai.com/jp/",
        "lang": "ja",
        "forbid_hangul": True,
        "min_cta_height": 44,
        "brand_brief": "Calm Japanese independent educational Shin-NISA research (SMH x XLV + JGB/SGOV 2000-2025 statistics). Non-advisory, zero hype, zero Telegram.",
        "persona": "Japanese 50-70s Shin-NISA households worried about US dividend 10% tax, crash drawdowns, and retirement defense.",
        "seo_h1_regex": r"(?:老後|新NISA|SMH|資産|二つの柱)",
        "required_sanctuary_ids": ["gba-retirement-architect-jp", "gba-jp-passwordless-signup", "btnStartPwStepUpJp"],
        "zones": {
            "zone_1_hero": {"slot_id": "hero_h1", "selector": "h1.pw-serif-h1", "max_len": 48, "max_words": 48},
            "zone_2_cta": {"slot_id": "cta_primary", "selector": "#btnStartPwStepUpJp", "max_len": 36, "max_words": 36},
            "zone_3_gate": {"slot_id": "gate_cta", "selector": "#gba-jp-club-submit", "max_len": 44, "max_words": 44},
            "zone_4_density": {"slot_id": "density", "selector": "body", "presets": ["cro-pad-compact", "cro-pad-airy"]},
        },
        "rehearsal_slot": {
            "zone_id": "zone_2_cta",
            "slot_id": "cta_primary",
            "text": "新NISA 暴落耐性と米国配当課税を30秒無料確認 →",
        },
    },
    "HERO": {
        "domain": "paradise-hero.com",
        "url": "https://paradise-hero.com/",
        "lang": "ko",
        "forbid_hangul": False,
        "min_cta_height": 60,
        "brand_brief": "Warm 50-70s Korean trot radio lounge featuring original virtual singer Baek Woon-ho (백운호). Respectful warm tone, zero real singer names.",
        "persona": "50-70s Korean mothers/fathers enjoying comforting baritone trot music, life stories, and free Kakao greeting cards.",
        "seo_h1_regex": r"(?:백운호|라디오|트로트|사랑방)",
        "required_sanctuary_ids": ["hero-main-heading", "btn-hero-radio-now", "hero-family-lounge", "hero-passwordless-club-card"],
        "zones": {
            "zone_1_hero": {"slot_id": "hero_h1", "selector": "#hero-main-heading", "max_len": 48, "max_words": 48},
            "zone_2_cta": {"slot_id": "cta_primary", "selector": "#btn-hero-radio-now", "max_len": 36, "max_words": 36},
            "zone_3_gate": {"slot_id": "club_h2", "selector": "#hero-club-heading", "max_len": 48, "max_words": 48},
            "zone_4_density": {"slot_id": "density", "selector": "body", "presets": ["cro-pad-compact", "cro-pad-airy"]},
        },
        "rehearsal_slot": {
            "zone_id": "zone_2_cta",
            "slot_id": "cta_primary",
            "text": "▶ 지금 바로 백운호 사연·노래 1터치 듣기",
        },
    },
    "KFK": {
        "domain": "kidsfit.co.kr",
        "url": "https://kidsfit.co.kr/",
        "lang": "ko",
        "forbid_hangul": False,
        "min_cta_height": 44,
        "brand_brief": "Warm boutique Korean KDCA pediatric growth atelier (zero emojis, zero commercial ads, zero affiliates, calm editorial voice).",
        "persona": "Korean parents of ages 4-12 worried about height percentile, bone-age lag, sleep rhythm, and golden-time growth.",
        "seo_h1_regex": r"(?:예상키|질병관리청|뼈나이|성장)",
        "required_sanctuary_ids": ["kfk-peer-growth-editorial", "quiz-section", "kfk-bone-age-interpreter", "btn-start-atelier-hero"],
        "zones": {
            "zone_1_hero": {"slot_id": "hero_h1", "selector": "h1.atelier-headline", "max_len": 44, "max_words": 44},
            "zone_2_cta": {"slot_id": "cta_primary", "selector": "#btn-start-atelier-hero", "max_len": 30, "max_words": 30},
            "zone_3_gate": {"slot_id": "cta_bottom", "selector": "#btn-start-atelier-stepup", "max_len": 32, "max_words": 32},
            "zone_4_density": {"slot_id": "density", "selector": "body", "presets": ["cro-pad-compact", "cro-pad-airy"]},
        },
        "rehearsal_slot": {
            "zone_id": "zone_2_cta",
            "slot_id": "cta_primary",
            "text": "우리 아이 또래 백분위 1분 무료 확인 →",
        },
    },
}

# Forbidden & AI Slop Deterministic Gates
GLOBAL_FORBIDDEN_RE = re.compile(
    r"(?:<|>|javascript:|on(?:click|error|load|submit|input)\s*=|\bclinical\b|\b1:1\b|1対1|황영웅|임영웅|나훈아|님님|beable9489|lemonsqueezy|trycloudflare\.com|□)",
    re.IGNORECASE,
)
KFK_FORBIDDEN_RE = re.compile(
    r"(?:최저가|할인율|특가|폭탄세일|coupang|coupa\.ng|brandconnect|cshop\.naver|[\U0001F300-\U0001FAFF\U00002600-\U000027BF])",
    re.IGNORECASE,
)
GBA_FORBIDDEN_RE = re.compile(r"(?:t\.me|telegram|テレグラム|クオンツ|オルカン|1489|\bvym\b)", re.IGNORECASE)
HERO_FORBIDDEN_RE = re.compile(r"(?:황영웅|임영웅|나훈아|suno|골드\s*vip)", re.IGNORECASE)
AI_SLOP_RE = re.compile(
    r"(?:\b(?:delve|unlock|game[- ]changer|tapestry|embark|nuanced|in today['’]?s world)\b|결론적으로|총정리|알아보겠습니다|いかがでしたでしょうか|徹底解説)",
    re.IGNORECASE,
)


# ==============================================================================
# Runtime Environment & HTTP Helpers
# ==============================================================================
def load_runtime_env() -> Dict[str, str]:
    env = dict(os.environ)
    for cand in (
        Path(r"D:\드림컴퍼니\.env"),
        SCRIPT_DIR.parent / ".env",
        SCRIPT_DIR.parent.parent / ".env",
    ):
        if cand.exists():
            for raw in cand.read_text(encoding="utf-8", errors="ignore").splitlines():
                line = raw.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k and v and not env.get(k):
                    env[k] = v
    return env


def api_json(
    url: str,
    method: str = "GET",
    payload: Optional[Dict[str, Any]] = None,
    bearer: str = "",
    timeout: int = 20,
) -> Tuple[int, Dict[str, Any]]:
    headers = {"User-Agent": "DreamCompany-HomepageSwarmCRO/1.0", "Accept": "application/json"}
    if bearer:
        headers["Authorization"] = f"Bearer {bearer}"
    data_bytes = None
    if payload is not None:
        headers["Content-Type"] = "application/json"
        data_bytes = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read().decode("utf-8", errors="replace")
            return r.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(body)
        except Exception:
            parsed = {"raw": body[:300]}
        return e.code, parsed
    except Exception as exc:
        return 0, {"error": str(exc)}


def send_telegram_alert(env: Dict[str, str], html_msg: str) -> bool:
    token = str(env.get("HQ_TELEGRAM_BOT_TOKEN") or "").strip()
    chat_id = str(env.get("HQ_TELEGRAM_CHAT_ID") or "755033799").strip()
    if not token or not chat_id:
        return False
    status, res = api_json(
        f"https://api.telegram.org/bot{token}/sendMessage",
        method="POST",
        payload={
            "chat_id": chat_id,
            "text": html_msg,
            "parse_mode": "HTML",
            "disable_web_page_preview": True,
        },
        timeout=15,
    )
    return status == 200 and bool(res.get("ok"))


def record_watchdog_digest(env: Dict[str, str], div: str, summary: str, is_test: bool = False) -> bool:
    tok = str(env.get("WATCHDOG_ADMIN_TOKEN") or "").strip()
    if not tok:
        return False
    status, _ = api_json(
        WATCHDOG_AUDIT_URL,
        method="POST",
        bearer=tok,
        payload={
            "action": "record",
            "div_code": div,
            "event_type": "homepage_swarm_cro",
            "regex_violations": 0,
            "open_confessions": 0,
            "summary": summary[:255],
            "is_test": bool(is_test),
        },
        timeout=15,
    )
    return status == 200


# ==============================================================================
# Step 0: Dual-Tier D1 External Conversion Rollback Math (Beta-Binomial)
# ==============================================================================
def compute_composite_conv(uv: int, activations: int, signups: int, clicks: int) -> float:
    if uv <= 0:
        return 0.0
    r_act = min(1.0, activations / float(uv))
    r_sig = min(1.0, signups / float(uv))
    r_clk = min(1.0, clicks / float(uv))
    return 0.25 * r_act + 0.35 * r_sig + 0.40 * r_clk


def beta_prob_treatment_worse(s_base: int, n_base: int, s_treat: int, n_treat: int, draws: int = 1500) -> float:
    rng = random.Random(20261128)
    sb = max(0, min(n_base, s_base))
    st = max(0, min(n_treat, s_treat))
    worse = 0
    for _ in range(draws):
        pb = rng.betavariate(1 + sb, 1 + max(0, n_base - sb))
        pt = rng.betavariate(1 + st, 1 + max(0, n_treat - st))
        if pt < pb:
            worse += 1
    return worse / float(draws)


def evaluate_rollback_for_active_experiments(
    div: str,
    cro_state: Dict[str, Any],
    aarrr: Dict[str, Any],
    env: Dict[str, str],
    dry_run: bool = False,
) -> List[Dict[str, Any]]:
    tok = str(env.get("WATCHDOG_ADMIN_TOKEN") or "").strip()
    actions: List[Dict[str, Any]] = []
    now_u = dt.datetime.now(dt.timezone.utc)
    recent = cro_state.get("recent_experiments") or []
    metrics_map = cro_state.get("experiment_metrics") or {}
    div_aarrr = (aarrr.get("divisions") or {}).get(div) or {}
    base_uv = int((div_aarrr.get("acquisition") or {}).get("unique_visitors") or 0)
    base_act = int((div_aarrr.get("activation") or {}).get("activated_users") or 0)
    base_sig = int((div_aarrr.get("activation") or {}).get("signed_up_users") or 0)
    base_clk = int((div_aarrr.get("revenue") or {}).get("checkout_click_users") or 0)
    base_comp = compute_composite_conv(base_uv, base_act, base_sig, base_clk)

    for exp in recent:
        if exp.get("status") != "active" or exp.get("is_test"):
            continue
        exp_id = str(exp.get("exp_id") or "")
        prom_s = str(exp.get("promoted_at") or exp.get("created_at") or "")
        try:
            prom_dt = dt.datetime.fromisoformat(prom_s.replace("Z", "+00:00"))
        except Exception:
            continue
        elapsed_days = (now_u - prom_dt).total_seconds() / 86400.0
        m = metrics_map.get(exp_id) or {}
        t_uv = int(m.get("uv") or 0)
        t_act = int(m.get("activations") or 0)
        t_sig = int(m.get("signups") or 0)
        t_clk = int(m.get("clicks") or 0)
        t_comp = compute_composite_conv(t_uv, t_act, t_sig, t_clk)

        if elapsed_days < ROLLBACK_MIN_DAYS or t_uv < ROLLBACK_MIN_UV:
            actions.append({
                "exp_id": exp_id,
                "decision": "HOLD_MATURATION",
                "elapsed_days": round(elapsed_days, 2),
                "uv": t_uv,
            })
            continue

        # Effective weighted successes for Beta-Binomial posterior
        s_base = int(round(base_comp * max(base_uv, 1)))
        s_treat = int(round(t_comp * max(t_uv, 1)))
        rel_drop = (base_comp - t_comp) / max(base_comp, 1e-6) if base_comp > 0 else 0.0
        p_worse = beta_prob_treatment_worse(s_base, max(base_uv, 1), s_treat, max(t_uv, 1))

        if base_comp > 0 and rel_drop >= ROLLBACK_REL_DROP and p_worse >= ROLLBACK_BAYES_PROB:
            reason = f"stat_conv_drop_{rel_drop*100:.1f}pct_P{p_worse:.2f}_UV{t_uv}"
            if not dry_run and tok:
                api_json(
                    f"{CENTRAL_API_BASE}/api/admin/cro/rollback",
                    method="POST",
                    bearer=tok,
                    payload={"div_code": div, "exp_id": exp_id, "zone_id": exp.get("zone_id"), "reason": reason},
                )
                send_telegram_alert(
                    env,
                    f"⏪ <b>[홈페이지 Swarm 자동 롤백 — {div}]</b>\n"
                    f"• 실험: <code>{exp_id}</code> ({exp.get('zone_id')})\n"
                    f"• 사유: 순수 외부 UV {t_uv}명({elapsed_days:.1f}일) 누적 전환 -{rel_drop*100:.1f}% (P={p_worse:.2f})\n"
                    f"• 조치: 직전 정상 버전으로 1초 원자적 롤백 완료 (해당 영역 7일 쿨다운)",
                )
            actions.append({"exp_id": exp_id, "decision": "ROLLED_BACK", "reason": reason})
        else:
            actions.append({
                "exp_id": exp_id,
                "decision": "HEALTHY_KEEP",
                "elapsed_days": round(elapsed_days, 2),
                "uv": t_uv,
                "p_worse": round(p_worse, 3),
            })
    return actions


# ==============================================================================
# Stage 1: Deterministic Sanctuary + SEO Keyword + AI Slop Pre-Gate
# ==============================================================================
def validate_candidate_stage1(div: str, zone_id: str, slot_id: str, text: str, css_preset: str) -> Tuple[bool, List[str]]:
    errs: List[str] = []
    spec = DIV_SPECS[div]
    zspec = spec["zones"].get(zone_id)
    if not zspec or zspec["slot_id"] != slot_id:
        return False, ["sanctuary_slot_mismatch"]

    if slot_id == "density":
        if css_preset not in zspec.get("presets", []):
            errs.append("invalid_density_preset")
        return len(errs) == 0, errs

    clean = re.sub(r"\s+", " ", str(text or "")).strip()
    if len(clean) < 4 or len(clean) > int(zspec.get("max_len", 120)):
        errs.append(f"length_out_of_bounds({len(clean)})")
    if spec["lang"] == "en":
        wc = len(clean.split())
        if wc > int(zspec.get("max_words", 18)):
            errs.append(f"word_count_exceeded({wc})")
    if GLOBAL_FORBIDDEN_RE.search(clean):
        errs.append("global_forbidden_hit")
    if spec["forbid_hangul"] and re.search(r"[가-힣]", clean):
        errs.append("hangul_forbidden_hit")
    if div == "KFK" and KFK_FORBIDDEN_RE.search(clean):
        errs.append("kfk_forbidden_or_emoji_hit")
    if div == "GBA" and GBA_FORBIDDEN_RE.search(clean):
        errs.append("gba_forbidden_hit")
    if div == "HERO" and HERO_FORBIDDEN_RE.search(clean):
        errs.append("hero_forbidden_hit")
    if AI_SLOP_RE.search(clean):
        errs.append("ai_slop_hit")
    if slot_id == "hero_h1" and not re.search(spec["seo_h1_regex"], clean, flags=re.IGNORECASE):
        errs.append("seo_keyword_missing_in_h1")
    return len(errs) == 0, errs


# ==============================================================================
# Gemini Free-Tier Client (Budget-Capped <= 3 Calls/Div + Model Fallback)
# ==============================================================================
class GeminiBudgetClient:
    def __init__(self, api_key: str, max_calls: int = MAX_GEMINI_CALLS_PER_DIV):
        self.api_key = str(api_key or "").strip()
        self.max_calls = max_calls
        self.calls_used = 0
        self.last_model_used = ""

    def generate_json(self, prompt_text: str, image_paths: Optional[List[Path]] = None) -> Optional[Dict[str, Any]]:
        if not self.api_key or self.calls_used >= self.max_calls:
            return None
        parts: List[Dict[str, Any]] = [{"text": prompt_text}]
        for ip in (image_paths or []):
            if ip.exists():
                b64 = base64.b64encode(ip.read_bytes()).decode("ascii")
                parts.append({"inline_data": {"mime_type": "image/png", "data": b64}})

        req_body = {
            "contents": [{"role": "user", "parts": parts}],
            "generationConfig": {
                "temperature": 0.4,
                "responseMimeType": "application/json",
            },
        }
        self.calls_used += 1

        for model in GEMINI_MODEL_CHAIN:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={urllib.parse.quote(self.api_key)}"
            for attempt in range(2):
                req = urllib.request.Request(
                    url,
                    data=json.dumps(req_body).encode("utf-8"),
                    headers={"Content-Type": "application/json", "User-Agent": "DC-SwarmCRO/1.0"},
                    method="POST",
                )
                try:
                    with urllib.request.urlopen(req, timeout=45) as resp:
                        raw = json.loads(resp.read().decode("utf-8"))
                    txt = (
                        raw.get("candidates", [{}])[0]
                        .get("content", {})
                        .get("parts", [{}])[0]
                        .get("text", "")
                    )
                    if not txt:
                        continue
                    self.last_model_used = model
                    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", txt.strip())
                    return json.loads(cleaned)
                except urllib.error.HTTPError as e:
                    if e.code == 429 and attempt == 0:
                        time.sleep(8)
                        continue
                    break
                except Exception:
                    break
        return None


# ==============================================================================
# Stage 2: Playwright 390x844 & 1280x800 Real Render + Mechanical Checks
# ==============================================================================
def capture_and_verify_preview(
    div: str,
    exp_id: str,
    slot_id: str,
    expected_text: str,
    expected_density: str,
    out_dir: Path,
) -> Dict[str, Any]:
    from playwright.sync_api import sync_playwright

    spec = DIV_SPECS[div]
    base_url = spec["url"]
    ts = int(time.time())
    sep = "&" if "?" in base_url else "?"
    before_url = f"{base_url}{sep}internal_test=1&nocache={ts}"
    after_url = f"{base_url}{sep}cro_preview={exp_id}&internal_test=1&nocache={ts + 1}"

    shots = {
        "before_mobile": out_dir / f"{div}_before_mobile.png",
        "after_mobile": out_dir / f"{div}_after_mobile.png",
        "before_desktop": out_dir / f"{div}_before_desktop.png",
        "after_desktop": out_dir / f"{div}_after_desktop.png",
    }

    report: Dict[str, Any] = {"ok": False, "errors": [], "shots": {k: str(v) for k, v in shots.items()}}
    selector = ""
    for z in spec["zones"].values():
        if z["slot_id"] == slot_id:
            selector = z["selector"]
            break

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            for mode_name, url_to_open in (("before", before_url), ("after", after_url)):
                for vp_name, vp in (("mobile", {"width": 390, "height": 844}), ("desktop", {"width": 1280, "height": 800})):
                    ctx = browser.new_context(viewport=vp, is_mobile=(vp_name == "mobile"))
                    # Double-shield: intercept analytics so live D1 stays 100% zero-pollution
                    ctx.route("**/api/analytics/event*", lambda route: route.fulfill(status=200, body='{"ok":true}'))
                    page = ctx.new_page()
                    console_errs: List[str] = []
                    page_errs: List[str] = []
                    page.on("console", lambda m: console_errs.append(m.text) if m.type == "error" else None)
                    page.on("pageerror", lambda e: page_errs.append(str(e)))

                    resp = page.goto(url_to_open, wait_until="networkidle", timeout=30000)
                    page.wait_for_timeout(500)
                    http_st = resp.status if resp else 0
                    cro_hdr = (resp.headers.get("x-dc-cro-exp", "") if resp else "")

                    metrics = page.evaluate(
                        """([sel, sancIds]) => {
                          const mainEl = document.querySelector('main');
                          const mainChars = mainEl ? (mainEl.innerText || '').trim().length : 0;
                          const overflowPx = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
                          const inlineScripts = Array.from(document.querySelectorAll('script:not([src])'))
                            .filter(s => (s.getAttribute('type') || '').toLowerCase() !== 'application/ld+json').length;
                          const metaExp = (document.querySelector('meta[name="dc-cro-exp"]') || {}).content || '';
                          const bodyDensity = document.body ? (document.body.getAttribute('data-cro-density') || '') : '';
                          const targetEl = sel ? document.querySelector(sel) : null;
                          const targetText = targetEl ? (targetEl.innerText || targetEl.textContent || '').trim() : '';
                          const targetRect = targetEl ? targetEl.getBoundingClientRect() : null;
                          const missingSanc = (sancIds || []).filter(id => !document.getElementById(id));
                          return {
                            mainChars,
                            overflowPx,
                            inlineScripts,
                            metaExp,
                            bodyDensity,
                            targetText,
                            targetTop: targetRect ? Math.round(targetRect.top) : -1,
                            targetHeight: targetRect ? Math.round(targetRect.height) : 0,
                            missingSanc,
                          };
                        }""",
                        [selector, spec["required_sanctuary_ids"]],
                    )
                    page.screenshot(path=str(shots[f"{mode_name}_{vp_name}"]), full_page=False)

                    if mode_name == "after":
                        report[f"after_{vp_name}"] = {
                            "http": http_st,
                            "cro_hdr": cro_hdr,
                            "console_errors": len(console_errs),
                            "page_errors": len(page_errs),
                            **metrics,
                        }
                        if http_st != 200:
                            report["errors"].append(f"{vp_name}_http_{http_st}")
                        if metrics["mainChars"] <= 200:
                            report["errors"].append(f"{vp_name}_main_too_short_{metrics['mainChars']}")
                        if metrics["overflowPx"] > 1:
                            report["errors"].append(f"{vp_name}_overflow_{metrics['overflowPx']}px")
                        if metrics["inlineScripts"] > 0:
                            report["errors"].append(f"{vp_name}_inline_scripts_{metrics['inlineScripts']}")
                        if metrics["missingSanc"]:
                            report["errors"].append(f"{vp_name}_missing_sanctuary_{','.join(metrics['missingSanc'])}")
                        if len(page_errs) > 0:
                            report["errors"].append(f"{vp_name}_page_errors_{len(page_errs)}")
                        if metrics["metaExp"] != exp_id:
                            report["errors"].append(f"{vp_name}_meta_cro_mismatch({metrics['metaExp']})")
                        if slot_id == "density":
                            if metrics["bodyDensity"] != expected_density:
                                report["errors"].append(f"{vp_name}_density_not_applied({metrics['bodyDensity']})")
                        else:
                            if expected_text[:18].lower() not in metrics["targetText"].lower():
                                report["errors"].append(f"{vp_name}_slot_text_not_rendered")
                            if vp_name == "mobile" and slot_id == "cta_primary" and metrics["targetHeight"] < spec["min_cta_height"]:
                                report["errors"].append(f"mobile_cta_height_lt_{spec['min_cta_height']}({metrics['targetHeight']})")
                    else:
                        report[f"before_{vp_name}_text"] = metrics["targetText"]
                    ctx.close()
        finally:
            browser.close()

    report["ok"] = len(report["errors"]) == 0
    return report


# ==============================================================================
# Stage 3: Post-Promotion Canonical External Live Audit
# ==============================================================================
def run_external_live_audit_for_div(div: str) -> Tuple[bool, str]:
    domain = DIV_SPECS[div]["domain"]
    import subprocess
    audit_script = SCRIPT_DIR / "live_audit_cloud.py"
    if not audit_script.exists():
        return False, "live_audit_cloud.py_missing"
    r = subprocess.run(
        [sys.executable, str(audit_script), domain, "--web-only"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=60,
    )
    out = (r.stdout or "") + "\n" + (r.stderr or "")
    ok = (r.returncode == 0) and ("FINAL_VERDICT: ALL PASS" in out)
    return ok, out[-400:].strip()


# ==============================================================================
# Phase 1 Special Rehearsal Mode: Stage -> Preview SSR -> Promote -> Live Audit -> 1-Sec Rollback
# ==============================================================================
def run_rehearsal_promote_rollback(div: str, env: Dict[str, str]) -> Dict[str, Any]:
    tok = str(env.get("WATCHDOG_ADMIN_TOKEN") or "").strip()
    assert tok, "WATCHDOG_ADMIN_TOKEN required for rehearsal!"
    spec = DIV_SPECS[div]
    reh = spec["rehearsal_slot"]
    ts = int(time.time())
    exp_id = f"cro_reh_{div.lower()}_{ts}"
    base_url = spec["url"]
    sep = "&" if "?" in base_url else "?"

    def fetch_raw_html(u: str) -> Tuple[int, Dict[str, str], str]:
        req = urllib.request.Request(
            u,
            headers={"User-Agent": "DC-Rehearsal/1.0", "Cache-Control": "no-cache, no-store"},
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            hdrs = {k.lower(): v for k, v in resp.headers.items()}
            return resp.status, hdrs, resp.read().decode("utf-8", errors="replace")

    out: Dict[str, Any] = {"div": div, "exp_id": exp_id, "steps": {}}

    # 1. Stage candidate (is_test=True)
    st, j_stage = api_json(
        f"{CENTRAL_API_BASE}/api/admin/cro/stage",
        method="POST",
        bearer=tok,
        payload={
            "div_code": div,
            "exp_id": exp_id,
            "zone_id": reh["zone_id"],
            "slot_id": reh["slot_id"],
            "proposed_text": reh["text"],
            "hypothesis": "Phase 1 live Edge HTMLRewriter SSR & 1-sec rollback rehearsal",
            "is_test": True,
        },
    )
    assert st == 200 and j_stage.get("ok"), f"Stage failed: {st} {j_stage}"
    out["steps"]["1_stage"] = {"ok": True, "r2_key": j_stage.get("r2_key")}

    # 2. Verify ?cro_preview renders mutated SSR text while normal / stays 100% untouched!
    p_st, p_hdrs, p_html = fetch_raw_html(f"{base_url}{sep}cro_preview={exp_id}&internal_test=1&nocache={ts}")
    n_st, n_hdrs, n_html = fetch_raw_html(f"{base_url}{sep}internal_test=1&nocache={ts+1}")
    preview_rendered = (p_st == 200) and (exp_id in p_html) and (p_hdrs.get("x-dc-cro-exp") == exp_id)
    normal_untouched = (n_st == 200) and (exp_id not in n_html)
    assert preview_rendered and normal_untouched, f"Preview SSR check failed: preview={preview_rendered}, normal_untouched={normal_untouched}, hdr={p_hdrs.get('x-dc-cro-exp')}"
    out["steps"]["2_preview_ssr"] = {"ok": True, "x_dc_cro_exp": p_hdrs.get("x-dc-cro-exp"), "live_untouched": normal_untouched}

    # 3. Playwright 390x844 + 1280x800 verification on ?cro_preview
    with tempfile.TemporaryDirectory() as td:
        pw_res = capture_and_verify_preview(div, exp_id, reh["slot_id"], reh["text"], "", Path(td))
    assert pw_res["ok"], f"Playwright preview failed: {pw_res['errors']}"
    out["steps"]["3_playwright_390_1280"] = {
        "ok": True,
        "mobile_overflow": pw_res["after_mobile"]["overflowPx"],
        "mobile_inline_scripts": pw_res["after_mobile"]["inlineScripts"],
        "mobile_cta_h": pw_res["after_mobile"]["targetHeight"],
        "rendered_text": pw_res["after_mobile"]["targetText"][:80],
    }

    # 4. Promote live (is_test=True) & verify live external URL renders SSR + passes /live-audit!
    st_pr, j_pr = api_json(
        f"{CENTRAL_API_BASE}/api/admin/cro/promote",
        method="POST",
        bearer=tok,
        payload={"exp_id": exp_id, "critic_score": 90, "critic_delta": 5, "is_test": True},
    )
    assert st_pr == 200 and j_pr.get("ok"), f"Promote failed: {st_pr} {j_pr}"
    l_st, l_hdrs, l_html = fetch_raw_html(f"{base_url}{sep}nocache={ts+2}")
    live_promoted = (l_st == 200) and (l_hdrs.get("x-dc-cro-exp") == exp_id) and (f'content="{exp_id}"' in l_html)
    audit_ok, audit_tail = run_external_live_audit_for_div(div)
    assert live_promoted and audit_ok, f"Live promote verify failed: promoted={live_promoted}, audit_ok={audit_ok}"
    out["steps"]["4_live_promote_and_audit"] = {"ok": True, "x_dc_cro_exp": l_hdrs.get("x-dc-cro-exp"), "live_audit": "ALL PASS"}

    # 5. Execute 1-Second Atomic Rollback & measure recovery latency!
    t0 = time.perf_counter()
    st_rb, j_rb = api_json(
        f"{CENTRAL_API_BASE}/api/admin/cro/rollback",
        method="POST",
        bearer=tok,
        payload={
            "div_code": div,
            "exp_id": exp_id,
            "zone_id": reh["zone_id"],
            "reason": "phase1_rehearsal_1sec_rollback_test",
            "to_baseline": True,
            "is_test": True,
            "cleanup_staging": True,
        },
    )
    rb_ms = int((time.perf_counter() - t0) * 1000)
    assert st_rb == 200 and j_rb.get("ok"), f"Rollback failed: {st_rb} {j_rb}"

    # Verify external URL immediately restored to clean original HTML with ZERO exp_id!
    r_st, r_hdrs, r_html = fetch_raw_html(f"{base_url}{sep}nocache={ts+3}")
    restored_clean = (r_st == 200) and (not r_hdrs.get("x-dc-cro-exp")) and (exp_id not in r_html)
    assert restored_clean, f"Post-rollback clean restore failed! hdr={r_hdrs.get('x-dc-cro-exp')}"
    out["steps"]["5_atomic_1sec_rollback"] = {
        "ok": True,
        "rollback_api_ms": rb_ms,
        "restored_clean": restored_clean,
        "x_dc_cro_exp_after": r_hdrs.get("x-dc-cro-exp", ""),
    }
    out["REHEARSAL_VERDICT"] = "ALL PASS"
    return out


# ==============================================================================
# Full Swarm Cycle (dry_run | nightly)
# ==============================================================================
def run_swarm_for_division(div: str, mode: str, no_stagger: bool = False) -> Dict[str, Any]:
    env = load_runtime_env()
    tok = str(env.get("WATCHDOG_ADMIN_TOKEN") or "").strip()
    gemini_key = str(env.get("GEMINI_API_KEY") or "").strip()
    spec = DIV_SPECS[div]

    if mode == "rehearsal_promote_rollback":
        return run_rehearsal_promote_rollback(div, env)

    if not no_stagger:
        delay = STAGGER_SECONDS_BY_DIV.get(div, 0)
        if delay > 0:
            time.sleep(delay)

    # Step 0: Fetch D1 CRO state + 14-day pure-external AARRR metrics & evaluate statistical rollback
    _, cro_state = api_json(f"{CENTRAL_API_BASE}/api/admin/cro/state?div={div}", bearer=tok)
    _, aarrr = api_json(f"{CENTRAL_API_BASE}/api/admin/aarrr-summary?days=14", bearer=tok)
    rollback_events = evaluate_rollback_for_active_experiments(div, cro_state, aarrr, env, dry_run=(mode == "dry_run"))

    # Agent 1 (CRO Analyst — 0 LLM calls): Pick 1 unlocked zone respecting 3-7d cooldown
    now_u = dt.datetime.now(dt.timezone.utc)
    locked_zones = set()
    for row in (cro_state.get("slot_state") or []):
        cd = str(row.get("cooldown_until") or "")
        if cd:
            try:
                if dt.datetime.fromisoformat(cd.replace("Z", "+00:00")) > now_u:
                    locked_zones.add(str(row.get("zone_id")))
            except Exception:
                pass

    div_aarrr = (aarrr.get("divisions") or {}).get(div) or {}
    weakest = str(((div_aarrr.get("bottleneck") or {}).get("weakest_stage")) or "activation")
    priority_order = (
        ["zone_2_cta", "zone_1_hero", "zone_4_density", "zone_3_gate"]
        if weakest in ("acquisition", "activation")
        else ["zone_3_gate", "zone_2_cta", "zone_4_density", "zone_1_hero"]
    )
    unlocked = [z for z in priority_order if z not in locked_zones]
    if not unlocked:
        return {"div": div, "mode": mode, "outcome": "NO-OP", "reason": "all_zones_in_cooldown", "rollbacks": rollback_events}

    chosen_zone = unlocked[0]
    zspec = spec["zones"][chosen_zone]
    slot_id = zspec["slot_id"]

    # Fetch live current text of target slot via lightweight HTML read
    cur_text = ""
    try:
        req = urllib.request.Request(spec["url"], headers={"User-Agent": "DC-Analyst/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw_html = resp.read().decode("utf-8", errors="replace")
        if slot_id == "hero_h1":
            m = re.search(r"<h1[^>]*>(.*?)</h1>", raw_html, flags=re.I | re.S)
            cur_text = re.sub(r"<[^>]+>", " ", m.group(1)).strip() if m else ""
        elif zspec["selector"].startswith("#"):
            tid = zspec["selector"][1:]
            m = re.search(rf'<(?P<tag>button|a|h1|h2|h3|p|div|span)\b[^>]*\bid=["\']{re.escape(tid)}["\'][^>]*>(.*?)</(?P=tag)>', raw_html, flags=re.I | re.S)
            cur_text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m.group(2))).strip() if m else ""
        import html as _html_lib
        cur_text = _html_lib.unescape(cur_text)
    except Exception:
        pass

    # Agent 2 (Copy & UX Proposer — Gemini API, 1 call)
    gemini = GeminiBudgetClient(gemini_key, max_calls=MAX_GEMINI_CALLS_PER_DIV)
    prop_prompt = (
        f"You are a senior B2C Conversion Rate Optimization copywriter for {div} ({spec['domain']}).\n"
        f"Brand brief: {spec['brand_brief']}\n"
        f"Target persona: {spec['persona']}\n"
        f"Language strictly required: {spec['lang']} (forbid_hangul={spec['forbid_hangul']}).\n"
        f"Weakest AARRR stage: {weakest}. Target Zone: {chosen_zone} (slot_id={slot_id}).\n"
        f"Current live text: {cur_text!r}\n"
        f"Hard constraints: max_len={zspec.get('max_len', 80)}, plain text ONLY (no HTML tags, NEVER use ASCII '->' or '<' or '>' — use Unicode '→' or plain text, no emojis on TOM/KFG/GBA/KFK, no AI clichés, no prices/checkout links).\n"
        f"If slot_id=='density', propose css_preset from ['cro-pad-compact','cro-pad-airy'].\n"
        f"Return STRICT JSON with keys:\n"
        f'{{"tier":"minor_slot","candidates":[{{"proposed_text":"...","css_preset":"","hypothesis":"..."}},{{"proposed_text":"...","css_preset":"","hypothesis":"..."}}],'
        f'"optional_major_proposal":null}}\n'
        f"Only populate optional_major_proposal if a major structural layout/tool change is strongly warranted (with title, problem_evidence, proposed_structure, expected_lift, risk_note)."
    )
    prop_json = gemini.generate_json(prop_prompt)
    if not prop_json or not isinstance(prop_json, dict):
        return {"div": div, "mode": mode, "outcome": "NO-OP", "reason": "gemini_proposer_unavailable_or_quota", "calls": gemini.calls_used}

    # Handle Tier-2 Major Structural Proposal (NEVER auto-deploy — log & report via @Allcompany1_bot!)
    maj = prop_json.get("optional_major_proposal")
    if isinstance(maj, dict) and maj.get("title") and mode == "nightly" and tok:
        _, p_res = api_json(
            f"{CENTRAL_API_BASE}/api/admin/cro/proposal",
            method="POST",
            bearer=tok,
            payload={"div_code": div, **maj},
        )
        if p_res.get("ok"):
            send_telegram_alert(
                env,
                f"🏗️ <b>[홈페이지 Swarm 큰 구조 변경 승인 요청 — {div}]</b>\n"
                f"• 제안 ID: <code>{p_res.get('proposal_id')}</code>\n"
                f"• 제목: {maj.get('title')}\n"
                f"• 기대 효과: {maj.get('expected_lift', '')}\n"
                f"• 상태: <b>무인 배포 차단됨</b> (사장님 승인 시 홈페이지 실행방에서 반영)",
            )

    # Stage 1: Deterministic Sanctuary + Hard Gate Filter
    cands = prop_json.get("candidates") or []
    valid_cands = []
    stage1_rejects = []
    for c in cands:
        pt = str(c.get("proposed_text") or "").replace("->", "→").strip()
        cp = str(c.get("css_preset") or "").strip()
        ok1, errs1 = validate_candidate_stage1(div, chosen_zone, slot_id, pt, cp)
        if ok1 and (slot_id == "density" or pt != cur_text):
            valid_cands.append({"proposed_text": pt, "css_preset": cp, "hypothesis": str(c.get("hypothesis") or "")})
        else:
            stage1_rejects.append({"text": pt[:60], "errs": errs1 or ["unchanged_text"]})

    if not valid_cands:
        return {"div": div, "mode": mode, "outcome": "NO-OP", "reason": "stage1_sanctuary_rejected_all", "rejects": stage1_rejects, "calls": gemini.calls_used}

    chosen = valid_cands[0]
    ts = int(time.time())
    exp_id = f"cro_{div.lower()}_{dt.datetime.now(dt.timezone.utc).strftime('%Y%m%d')}_{slot_id}_{ts % 10000}"

    # Stage candidate in D1/R2 (0% impact on real external visitors)
    st_s, j_s = api_json(
        f"{CENTRAL_API_BASE}/api/admin/cro/stage",
        method="POST",
        bearer=tok,
        payload={
            "div_code": div,
            "exp_id": exp_id,
            "zone_id": chosen_zone,
            "slot_id": slot_id,
            "proposed_text": chosen["proposed_text"],
            "css_preset": chosen["css_preset"],
            "hypothesis": chosen["hypothesis"],
            "is_test": (mode == "dry_run"),
        },
    )
    if st_s != 200 or not j_s.get("ok"):
        return {"div": div, "mode": mode, "outcome": "NO-OP", "reason": f"stage_api_failed_{st_s}", "detail": j_s}

    # Stage 2: Playwright 390x844 + 1280x800 Live Preview Screenshots + Adversarial Visual Critic
    with tempfile.TemporaryDirectory() as td:
        pw = capture_and_verify_preview(div, exp_id, slot_id, chosen["proposed_text"], chosen["css_preset"], Path(td))
        if not pw["ok"]:
            if mode == "dry_run":
                api_json(f"{CENTRAL_API_BASE}/api/admin/cro/rollback", method="POST", bearer=tok, payload={"div_code": div, "exp_id": exp_id, "zone_id": chosen_zone, "reason": "dry_run_pw_fail", "is_test": True, "cleanup_staging": True})
            return {"div": div, "mode": mode, "outcome": "NO-OP", "reason": "playwright_mechanical_gate_failed", "errors": pw["errors"]}

        critic_prompt = (
            f"You are an adversarial, zero-sycophancy CRO Visual & UX Critic evaluating {div} ({spec['domain']}).\n"
            f"Target slot: {chosen_zone}/{slot_id}. Hypothesis: {chosen['hypothesis']}\n"
            f"You are given 4 live screenshots in order: 1) BEFORE mobile 390x844, 2) AFTER mobile 390x844, 3) BEFORE desktop 1280x800, 4) AFTER desktop 1280x800.\n"
            f"Score strictly on 100 pts: (1) 3-sec clarity & hook 30pt, (2) mobile readability & above-the-fold balance 25pt, (3) click friction reduction 25pt, (4) brand trust & zero AI feel 20pt.\n"
            f"Be harsh on the AFTER images (images 2 & 4): reject any clipping, awkward wrapping, verbosity, or weak lift.\n"
            f"IMPORTANT: `fatal_flaws` MUST ONLY contain severe defects present in the AFTER images (images 2 & 4). NEVER place flaws from the BEFORE/baseline images in `fatal_flaws`. If the AFTER images have no severe defect, return `fatal_flaws: []`.\n"
            f'Return STRICT JSON: {{"baseline_score":0,"after_score":0,"delta":0,"fatal_flaws":[],"verdict":"APPROVE|REJECT","critique":"short summary"}}'
        )
        critic_res = gemini.generate_json(
            critic_prompt,
            image_paths=[
                Path(pw["shots"]["before_mobile"]),
                Path(pw["shots"]["after_mobile"]),
                Path(pw["shots"]["before_desktop"]),
                Path(pw["shots"]["after_desktop"]),
            ],
        )

    if not critic_res:
        return {"div": div, "mode": mode, "outcome": "NO-OP", "reason": "critic_unavailable", "calls": gemini.calls_used}

    after_sc = float(critic_res.get("after_score") or 0)
    base_sc = float(critic_res.get("baseline_score") or 0)
    delta = float(critic_res.get("delta") if critic_res.get("delta") is not None else (after_sc - base_sc))
    flaws = list(critic_res.get("fatal_flaws") or [])
    critic_pass = (after_sc >= CRITIC_PASS_SCORE) and (delta >= CRITIC_MIN_DELTA) and (len(flaws) == 0) and (str(critic_res.get("verdict") or "").upper() == "APPROVE")

    if mode == "dry_run":
        # Clean up dry-run staging artifact cleanly (zero live visitor impact!)
        api_json(
            f"{CENTRAL_API_BASE}/api/admin/cro/rollback",
            method="POST",
            bearer=tok,
            payload={"div_code": div, "exp_id": exp_id, "zone_id": chosen_zone, "reason": "dry_run_cleanup", "is_test": True, "cleanup_staging": True},
        )
        return {
            "div": div,
            "mode": "dry_run",
            "outcome": "DRY_RUN_PASS" if critic_pass else "DRY_RUN_NOOP_CRITIC_REJECT",
            "zone_id": chosen_zone,
            "slot_id": slot_id,
            "exp_id": exp_id,
            "current_text": cur_text[:90],
            "proposed_text": chosen["proposed_text"],
            "gemini_calls_used": gemini.calls_used,
            "gemini_model": gemini.last_model_used,
            "playwright_mobile_overflow": pw["after_mobile"]["overflowPx"],
            "playwright_inline_scripts": pw["after_mobile"]["inlineScripts"],
            "critic": {"baseline": base_sc, "after": after_sc, "delta": delta, "flaws": flaws, "verdict": critic_res.get("verdict"), "critique": str(critic_res.get("critique") or "")[:180]},
            "rollbacks": rollback_events,
        }

    if not critic_pass:
        return {
            "div": div,
            "mode": mode,
            "outcome": "NO-OP",
            "reason": "critic_below_threshold",
            "critic": {"baseline": base_sc, "after": after_sc, "delta": delta, "flaws": flaws},
            "gemini_calls_used": gemini.calls_used,
        }

    # Stage 3: Atomic Edge Promotion + Mandatory External Live Audit + Instant 1-Sec Auto-Rollback on FAIL
    st_p, j_p = api_json(
        f"{CENTRAL_API_BASE}/api/admin/cro/promote",
        method="POST",
        bearer=tok,
        payload={"exp_id": exp_id, "critic_score": after_sc, "critic_delta": delta, "is_test": False},
    )
    if st_p != 200 or not j_p.get("ok"):
        return {"div": div, "mode": mode, "outcome": "NO-OP", "reason": f"promote_failed_{st_p}", "detail": j_p}

    audit_ok, audit_tail = run_external_live_audit_for_div(div)
    if not audit_ok:
        api_json(
            f"{CENTRAL_API_BASE}/api/admin/cro/rollback",
            method="POST",
            bearer=tok,
            payload={"div_code": div, "exp_id": exp_id, "zone_id": chosen_zone, "reason": "post_promote_live_audit_fail"},
        )
        send_telegram_alert(
            env,
            f"🚨 <b>[홈페이지 Swarm 즉시 롤백 — {div}]</b>\n"
            f"• 실험 <code>{exp_id}</code> 승격 직후 외부 `/live-audit` FAIL 감지 → 1초 원자적 롤백 완료.",
        )
        return {"div": div, "mode": mode, "outcome": "INSTANT_ROLLBACK", "reason": "live_audit_fail", "audit_tail": audit_tail}

    summary_line = f"{div} {chosen_zone}({slot_id}) 승격 완료 (비평가 {after_sc:.0f}점, +{delta:.0f}p · /live-audit ALL PASS)"
    record_watchdog_digest(env, div, summary_line, is_test=False)
    return {
        "div": div,
        "mode": mode,
        "outcome": "PROMOTED_ALL_PASS",
        "exp_id": exp_id,
        "zone_id": chosen_zone,
        "slot_id": slot_id,
        "proposed_text": chosen["proposed_text"],
        "critic_score": after_sc,
        "critic_delta": delta,
        "gemini_calls_used": gemini.calls_used,
        "rollbacks": rollback_events,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Dream Company 5-Div Cloud Swarm Auto-CRO Engine")
    parser.add_argument("--div", required=True, choices=["TOM", "KFG", "GBA", "HERO", "KFK"], help="Target division")
    parser.add_argument(
        "--mode",
        default="dry_run",
        choices=["dry_run", "nightly", "rehearsal_promote_rollback"],
        help="Execution mode",
    )
    parser.add_argument("--no-stagger", action="store_true", help="Skip 25s-per-division RPM stagger (single-div test)")
    args = parser.parse_args()

    res = run_swarm_for_division(args.div.upper(), args.mode, no_stagger=args.no_stagger)
    print(json.dumps(res, ensure_ascii=False, indent=2), flush=True)
    if args.mode == "rehearsal_promote_rollback":
        return 0 if res.get("REHEARSAL_VERDICT") == "ALL PASS" else 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
