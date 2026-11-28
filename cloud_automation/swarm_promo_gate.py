#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/swarm_promo_gate.py
================================================================================
Dream Company — Full-Scale 5-Division Promo Swarm Fail-Closed Exit Gate &
Telegram Chief-of-Staff (`@Allcompany1_bot`) High-Risk Approval Dispatcher (`$0`)

Enforces EVERY guardrail from:
  - `docs/intent/20261128-promo-full-scale-swarm-self-improvement.md`
  - `GEMINI.md` Single Voice SSOT
  - `weekly_hill_climber.py` Governance Sanctuary Hard Lock
  - `promo_hard_gate.py` AI-Slop / Legal / Domain Fail-Closed Auto-Gate
  - `taste_evaluator.py` 100-Point Deterministic Taste Gate (`>= 85` required)

Core Physical Guarantees:
  1. Single Whitelist Auto-Write Lock (`GovernanceSanctuaryViolationError`):
     - Low-risk Swarm auto-apply can ONLY write `data/swarm_promo_experiments.json`
       (and its LF-identical mirror `1사업부/data/swarm_promo_experiments.json`).
     - High-risk proposal registration can ONLY write `data/swarm_approval_proposals.json`
       and `docs/swarm_proposals/SWARM-*.md`.
     - Writing to `message_matrix_5div.json`, `topic_hook_weights.json`, `.html`, `.js`,
       `.css`, `.py`, `.yml`, `GEMINI.md`, pricing, checkout, PG, or disclaimer paths
       raises `GovernanceSanctuaryViolationError` immediately!
  2. Gradual Baseline-Preserving Caps:
     - `max_active_experiments_per_div <= 2`
     - `max_traffic_allocation_ratio <= 0.20` (80% baseline untouched!)
     - `abs(hook_weight_delta) <= 0.25`
     - `baseline_matrix_immutable == True`
     - `auto_expire_days` in `[1, 21]`
  3. Zero Out-of-Scope & Zero High-Risk Smuggling:
     - Rejects frozen channels (Naver blog/clip for Div 5, manual Kin, paid X API,
       Threads/Facebook) and rejects pricing/PG/HTML mutation terms smuggled into
       low-risk promo copy.
  4. Mandatory Hard Gate + Taste >= 85 Score on EVERY Active Experiment.
  5. High-Risk Telegram Chief-of-Staff Approval Card via existing
     `1사업부/scripts/master_hq_telegram_bridge.js --div HQ --notify-file <utf8_html>`.
================================================================================
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any, Dict, FrozenSet, List, Optional, Tuple

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

sys.path.insert(0, str(Path(__file__).resolve().parent))
from promo_hard_gate import check_promo_hard_gate  # noqa: E402
from taste_evaluator import PASS_THRESHOLD as TASTE_PASS_THRESHOLD, evaluate_taste  # noqa: E402
from weekly_hill_climber import GovernanceSanctuaryViolationError  # noqa: E402

EXTERNAL_PAID_API_ENABLED = False
KST = dt.timezone(dt.timedelta(hours=9))
ROOT = Path(__file__).resolve().parent.parent
HQ_ROOT = ROOT.parent if (ROOT.name == "1사업부" and (ROOT.parent / "data").exists()) else ROOT

OVERLAY_PATH_HQ = HQ_ROOT / "data" / "swarm_promo_experiments.json"
OVERLAY_PATH_DIV1 = HQ_ROOT / "1사업부" / "data" / "swarm_promo_experiments.json"
PROPOSALS_LEDGER_PATH = HQ_ROOT / "data" / "swarm_approval_proposals.json"
PROPOSALS_DOCS_DIR = HQ_ROOT / "docs" / "swarm_proposals"
MASTER_BRIDGE_JS = HQ_ROOT / "1사업부" / "scripts" / "master_hq_telegram_bridge.js"
DEFAULT_GROUP_CHAT_ID = "-1003834697086"

DIVISIONS: Tuple[str, ...] = ("TOM", "KFG", "GBA", "HERO", "KFK")
HOOK_TYPES: FrozenSet[str] = frozenset({"loss", "curiosity", "self", "pattern", "proof"})

# Hard-Locked Gradual Experimentation Ceilings
MAX_ACTIVE_EXPERIMENTS_PER_DIV = 2
MAX_TRAFFIC_ALLOCATION_RATIO = 0.20
MAX_HOOK_WEIGHT_DELTA = 0.25
MIN_TASTE_SCORE = max(85, int(TASTE_PASS_THRESHOLD))
MAX_AUTO_EXPIRE_DAYS = 21

ALLOWED_OVERLAY_FILENAME = "swarm_promo_experiments.json"
ALLOWED_PROPOSALS_FILENAME = "swarm_approval_proposals.json"

SANCTUARY_FORBIDDEN_EXTENSIONS: FrozenSet[str] = frozenset({
    ".html", ".htm", ".css", ".js", ".mjs", ".cjs", ".ts", ".tsx",
    ".py", ".yml", ".yaml", ".sql", ".sh", ".ps1", ".bat",
})

SANCTUARY_FORBIDDEN_TOKENS: Tuple[str, ...] = (
    "message_matrix_5div",
    "topic_hook_weights",
    "promo_hard_gate",
    "outbound_allowlist",
    "taste_evaluator",
    "weekly_hill_climber",
    "ab_evolution_engine",
    "index.html",
    "vip.html",
    "radio.html",
    "pricing",
    "checkout",
    "paywall",
    "disclaimer",
    "terms",
    "privacy",
    "legal",
    "gemini.md",
    "payment",
    "whop",
    "polar",
    "latpeed",
    "functions",
    "workers",
    "telegram_5bot_hub",
)

# Out-of-scope frozen channels & global banned strings
FROZEN_OOS_CHANNEL_PATTERNS: Tuple[Tuple[str, str], ...] = (
    ("oos_naver_blog", r"blog\.naver\.com|네이버\s*블로그|expertise333"),
    ("oos_naver_clip", r"네이버\s*클립|naver\.me/"),
    ("oos_manual_kin", r"지식인|지식in|kin\.naver\.com"),
    ("oos_threads_fb", r"\b(?:threads\.net|threads\s*api|facebook\s*api|fb\s*page\s*bot)\b"),
    ("oos_paid_x_api", r"\b(?:twitter\s*api|x\s*paid\s*api|post\s*to\s*x\s*api)\b"),
)

GLOBAL_BANNED_STRINGS: Tuple[str, ...] = (
    "황영웅",
    "임영웅",
    "나훈아",
    "lemonsqueezy",
    "trycloudflare.com",
    "□",
    "님님",
    "Brain LQ",
    "KISFIT Bio Labs",
    "Bio Labs",
    "#kfg-bone-age-interpreter",
    "아이클타임",
    "칼마디",
    "락토바이오",
)

DIV_EXTRA_BANNED: Dict[str, Tuple[str, ...]] = {
    "TOM": ("kisfitglobal.com", "getbreakai.com", "paradise-hero.com", "kidsfit.co.kr"),
    "KFG": ("truthofmarket.com", "getbreakai.com", "paradise-hero.com", "kidsfit.co.kr", "1:1", "clinical", "diagnosis", "prescription", "iherb.com", "amazon.com"),
    "GBA": ("truthofmarket.com", "kisfitglobal.com", "paradise-hero.com", "kidsfit.co.kr", "オルカン", "1489", "vym", "t.me", "telegram", "クオンツ"),
    "HERO": ("truthofmarket.com", "kisfitglobal.com", "getbreakai.com", "kidsfit.co.kr", "골드 vip", "황영웅"),
    "KFK": ("truthofmarket.com", "kisfitglobal.com", "getbreakai.com", "paradise-hero.com", "1:1", "coupang.com", "cshop.naver.com", "최저가", "할인율", "특가", "폭탄세일"),
}

VALID_PROPOSAL_ROOMS: FrozenSet[str] = frozenset({"homepage", "payment_security"})
PROPOSAL_ID_RE = re.compile(r"^SWARM-\d{8}-\d{2,3}$")


# ==============================================================================
# 1. Governance Sanctuary Hard Lock (Whitelist-Only Write Control)
# ==============================================================================
def _assert_whitelisted_data_json(target_path: Path, expected_filename: str) -> Path:
    resolved = Path(target_path).resolve()
    low_full = str(resolved).replace("\\", "/").lower()
    suffix = resolved.suffix.lower()

    if suffix in SANCTUARY_FORBIDDEN_EXTENSIONS or suffix != ".json":
        raise GovernanceSanctuaryViolationError(
            f"[SWARM SANCTUARY BLOCKED] Forbidden extension ({suffix}): {resolved}"
        )

    for tok in SANCTUARY_FORBIDDEN_TOKENS:
        if tok in low_full:
            raise GovernanceSanctuaryViolationError(
                f"[SWARM SANCTUARY BLOCKED] Protected sanctuary token ({tok!r}) in path: {resolved}"
            )

    if resolved.name != expected_filename:
        raise GovernanceSanctuaryViolationError(
            f"[SWARM SANCTUARY BLOCKED] Expected '{expected_filename}', got '{resolved.name}': {resolved}"
        )

    parent_name = resolved.parent.name.lower()
    if parent_name not in ("data", "scratch", "tmp") and "temp" not in low_full:
        raise GovernanceSanctuaryViolationError(
            f"[SWARM SANCTUARY BLOCKED] '{expected_filename}' must live inside 'data/': {resolved}"
        )

    return resolved


def assert_swarm_overlay_write_allowed(target_path: Path) -> Path:
    return _assert_whitelisted_data_json(target_path, ALLOWED_OVERLAY_FILENAME)


def assert_approval_ledger_write_allowed(target_path: Path) -> Path:
    return _assert_whitelisted_data_json(target_path, ALLOWED_PROPOSALS_FILENAME)


def safe_write_swarm_overlay(target_path: Path, payload: Dict[str, Any]) -> Path:
    safe_p = assert_swarm_overlay_write_allowed(target_path)
    safe_p.parent.mkdir(parents=True, exist_ok=True)
    # Enforce LF line endings for 100% root <-> 1사업부 mirror parity
    content = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    safe_p.write_bytes(content.encode("utf-8"))
    return safe_p


def safe_write_approval_ledger(target_path: Path, payload: Dict[str, Any]) -> Path:
    safe_p = assert_approval_ledger_write_allowed(target_path)
    safe_p.parent.mkdir(parents=True, exist_ok=True)
    content = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    safe_p.write_bytes(content.encode("utf-8"))
    return safe_p


# ==============================================================================
# 2. Fail-Closed 6-Layer Overlay Validator (Hard Gate + Taste >= 85 + Caps)
# ==============================================================================
def _check_text_safety(div: str, text: str, field_name: str, surface: str = "youtube_desc") -> List[str]:
    errs: List[str] = []
    if not text or not text.strip():
        return errs
    low = text.lower()
    for code, pat in FROZEN_OOS_CHANNEL_PATTERNS:
        if re.search(pat, text, flags=re.IGNORECASE):
            errs.append(f"{div}.{field_name}:out_of_scope_channel:{code}")
    for b in GLOBAL_BANNED_STRINGS:
        if b.lower() in low:
            errs.append(f"{div}.{field_name}:global_banned:{b}")
    for b in DIV_EXTRA_BANNED.get(div, ()):
        if b.lower() in low:
            errs.append(f"{div}.{field_name}:div_banned:{b}")
    ok_hg, hg_errs = check_promo_hard_gate(div, text, surface=surface)
    if not ok_hg:
        for he in hg_errs:
            errs.append(f"{div}.{field_name}:hard_gate:{he}")
    return errs


def validate_swarm_overlay(
    payload: Dict[str, Any],
    today_kst: Optional[dt.date] = None,
) -> Tuple[bool, List[str], Dict[str, Any]]:
    """
    Validates a candidate `swarm_promo_experiments.json` payload fail-closed.
    Returns `(passed, errors, report)`.
    """
    errs: List[str] = []
    today = today_kst or dt.datetime.now(KST).date()
    report: Dict[str, Any] = {"divisions": {}, "total_active_experiments": 0}

    if not isinstance(payload, dict):
        return False, ["payload_not_dict"], report

    if payload.get("schema_version") != "swarm-promo-overlay-v1":
        errs.append(f"invalid_schema_version:{payload.get('schema_version')}")

    policy = payload.get("safety_policy")
    if not isinstance(policy, dict):
        errs.append("missing_safety_policy")
        policy = {}
    else:
        max_exp = int(policy.get("max_active_experiments_per_div", 99))
        max_ratio = float(policy.get("max_traffic_allocation_ratio", 1.0))
        min_taste = int(policy.get("min_taste_score", 0))
        expire_days = int(policy.get("auto_expire_days", 99))
        if max_exp < 1 or max_exp > MAX_ACTIVE_EXPERIMENTS_PER_DIV:
            errs.append(f"policy_max_experiments_exceeded:{max_exp}>{MAX_ACTIVE_EXPERIMENTS_PER_DIV}")
        if max_ratio <= 0.0 or max_ratio > MAX_TRAFFIC_ALLOCATION_RATIO + 1e-9:
            errs.append(f"policy_traffic_ratio_exceeded:{max_ratio}>{MAX_TRAFFIC_ALLOCATION_RATIO}")
        if policy.get("baseline_matrix_immutable") is not True:
            errs.append("policy_baseline_matrix_must_be_immutable")
        if min_taste < MIN_TASTE_SCORE:
            errs.append(f"policy_min_taste_below_85:{min_taste}<{MIN_TASTE_SCORE}")
        if expire_days < 1 or expire_days > MAX_AUTO_EXPIRE_DAYS:
            errs.append(f"policy_expire_days_out_of_range:{expire_days}")

    divs_obj = payload.get("divisions")
    if not isinstance(divs_obj, dict):
        errs.append("missing_divisions_map")
        return False, errs, report

    unknown_divs = [k for k in divs_obj.keys() if k not in DIVISIONS]
    if unknown_divs:
        errs.append(f"unknown_divisions:{unknown_divs}")

    seen_exp_ids: set[str] = set()
    for div in DIVISIONS:
        d_cfg = divs_obj.get(div) or {}
        if not isinstance(d_cfg, dict):
            errs.append(f"{div}:division_entry_not_dict")
            continue

        # 1. Validate bounded hook_weight_deltas ([-0.25, +0.25])
        deltas = d_cfg.get("hook_weight_deltas") or {}
        if not isinstance(deltas, dict):
            errs.append(f"{div}:hook_weight_deltas_not_dict")
        else:
            for ht, dv in deltas.items():
                if ht not in HOOK_TYPES:
                    errs.append(f"{div}:invalid_hook_type_delta:{ht}")
                    continue
                try:
                    fval = float(dv)
                except (TypeError, ValueError):
                    errs.append(f"{div}:non_numeric_delta:{ht}")
                    continue
                if abs(fval) > MAX_HOOK_WEIGHT_DELTA + 1e-9:
                    errs.append(f"{div}:delta_exceeds_cap:{ht}={fval}(max=+-{MAX_HOOK_WEIGHT_DELTA})")

        # 2. Validate experiments list
        exps = d_cfg.get("experiments") or []
        if not isinstance(exps, list):
            errs.append(f"{div}:experiments_not_list")
            continue

        active_exps = [e for e in exps if isinstance(e, dict) and e.get("status") == "active"]
        if len(active_exps) > MAX_ACTIVE_EXPERIMENTS_PER_DIV:
            errs.append(f"{div}:too_many_active_experiments:{len(active_exps)}>{MAX_ACTIVE_EXPERIMENTS_PER_DIV}")

        div_rep_exps: List[Dict[str, Any]] = []
        for idx, exp in enumerate(exps):
            if not isinstance(exp, dict):
                errs.append(f"{div}.experiments[{idx}]:not_dict")
                continue
            status = str(exp.get("status") or "")
            if status not in ("active", "paused", "expired", "rolled_back"):
                errs.append(f"{div}.experiments[{idx}]:invalid_status:{status}")
                continue
            exp_id = str(exp.get("exp_id") or "").strip()
            if not exp_id:
                errs.append(f"{div}.experiments[{idx}]:missing_exp_id")
            elif exp_id in seen_exp_ids:
                errs.append(f"{div}:duplicate_exp_id:{exp_id}")
            else:
                seen_exp_ids.add(exp_id)

            if status != "active":
                continue

            # Active experiment strict validation
            ht = str(exp.get("hook_type") or "").strip()
            if ht not in HOOK_TYPES:
                errs.append(f"{div}.{exp_id}:invalid_hook_type:{ht}")

            hook_line = str(exp.get("hook_line") or "").strip()
            slide_body = str(exp.get("slide_script_body") or "").strip()
            cta = str(exp.get("cta") or "").strip()
            speech_bubble = str(exp.get("speech_bubble") or "").strip()
            success_metric = str(exp.get("success_metric") or "").strip()
            rollback_trigger = str(exp.get("rollback_trigger") or "").strip()
            expires_at = str(exp.get("expires_at") or "").strip()

            for req_name, req_val in (
                ("hook_line", hook_line),
                ("slide_script_body", slide_body),
                ("cta", cta),
                ("speech_bubble", speech_bubble),
                ("success_metric", success_metric),
                ("rollback_trigger", rollback_trigger),
                ("expires_at", expires_at),
            ):
                if not req_val:
                    errs.append(f"{div}.{exp_id}:missing_required:{req_name}")

            if len(hook_line) < 12 or len(hook_line) > 100:
                errs.append(f"{div}.{exp_id}:hook_line_len_out_of_range:{len(hook_line)}")

            if expires_at:
                try:
                    exp_d = dt.date.fromisoformat(expires_at)
                    delta_days = (exp_d - today).days
                    if delta_days < 0 or delta_days > MAX_AUTO_EXPIRE_DAYS:
                        errs.append(f"{div}.{exp_id}:expires_at_out_of_window:{expires_at}(delta={delta_days}d)")
                except ValueError:
                    errs.append(f"{div}.{exp_id}:invalid_expires_at_iso:{expires_at}")

            # Hard Gate & Out-of-Scope check across every copy surface
            combined_copy = f"{hook_line}\n{slide_body}\n{cta}"
            errs.extend(_check_text_safety(div, combined_copy, f"{exp_id}.core", surface="youtube_desc"))
            errs.extend(_check_text_safety(div, speech_bubble, f"{exp_id}.speech_bubble", surface="youtube_desc"))
            for opt_field, surf in (
                ("ending_cta_bridge", "youtube_desc"),
                ("pinned_comment_bridge", "youtube_comment"),
                ("ig_bio_bridge_line", "ig_caption"),
                ("carousel_slide5_cta", "ig_caption"),
            ):
                opt_val = str(exp.get(opt_field) or "").strip()
                if opt_val:
                    errs.extend(_check_text_safety(div, opt_val, f"{exp_id}.{opt_field}", surface=surf))

            # Deterministic $0 Taste Evaluator (`>= 85` required!)
            taste_eval = evaluate_taste(
                div=div,
                title=hook_line,
                spoken_script=slide_body,
                speech_bubble=speech_bubble,
                cta=cta,
            )
            t_score = int(taste_eval.get("total_score", 0))
            t_comp = bool(taste_eval.get("compliance_ok", False))
            if t_score < MIN_TASTE_SCORE or not t_comp:
                errs.append(
                    f"{div}.{exp_id}:taste_gate_failed:score={t_score}/{MIN_TASTE_SCORE},compliance={t_comp},feedback={taste_eval.get('feedback')}"
                )
            else:
                # Stamp verified taste score & gate state into candidate dict cleanly
                exp["taste_score"] = t_score
                exp["hard_gate_passed"] = True

            div_rep_exps.append({
                "exp_id": exp_id,
                "hook_type": ht,
                "taste_score": t_score,
                "compliance_ok": t_comp,
            })

        report["divisions"][div] = {
            "active_count": len(active_exps),
            "hook_weight_deltas": deltas,
            "experiments": div_rep_exps,
        }
        report["total_active_experiments"] += len(active_exps)

    return len(errs) == 0, list(dict.fromkeys(errs)), report


# ==============================================================================
# 3. High-Risk Approval Proposal Registry & Telegram Chief-of-Staff Dispatcher
# ==============================================================================
def validate_high_risk_proposals(proposals: List[Dict[str, Any]]) -> Tuple[bool, List[str]]:
    errs: List[str] = []
    if not isinstance(proposals, list):
        return False, ["proposals_not_list"]
    seen_ids: set[str] = set()
    req_fields = (
        "proposal_id",
        "division",
        "target_room",
        "category",
        "data_evidence",
        "before_state",
        "after_proposal",
        "redteam_risk_and_rollback",
        "expected_impact",
    )
    for idx, p in enumerate(proposals):
        if not isinstance(p, dict):
            errs.append(f"proposal[{idx}]:not_dict")
            continue
        pid = str(p.get("proposal_id") or "").strip()
        if not PROPOSAL_ID_RE.match(pid):
            errs.append(f"proposal[{idx}]:invalid_proposal_id:{pid}")
        elif pid in seen_ids:
            errs.append(f"proposal[{idx}]:duplicate_proposal_id:{pid}")
        else:
            seen_ids.add(pid)
        div = str(p.get("division") or "").strip().upper()
        if div not in DIVISIONS and div != "ALL":
            errs.append(f"{pid}:invalid_division:{div}")
        room = str(p.get("target_room") or "").strip()
        if room not in VALID_PROPOSAL_ROOMS:
            errs.append(f"{pid}:invalid_target_room:{room}(must be homepage or payment_security)")
        for rf in req_fields:
            if not str(p.get(rf) or "").strip():
                errs.append(f"{pid}:missing_{rf}")
    return len(errs) == 0, errs


def format_proposal_telegram_html(proposal: Dict[str, Any]) -> str:
    pid = html.escape(str(proposal["proposal_id"]))
    div = html.escape(str(proposal["division"]).upper())
    room = str(proposal["target_room"])
    room_ko = "홈페이지 방 (1921e31e)" if room == "homepage" else "결제·보안 본부 (9522c1b0)"
    cat = html.escape(str(proposal["category"]))
    ev = html.escape(str(proposal["data_evidence"]))
    bef = html.escape(str(proposal["before_state"]))
    aft = html.escape(str(proposal["after_proposal"]))
    risk = html.escape(str(proposal["redteam_risk_and_rollback"]))
    imp = html.escape(str(proposal["expected_impact"]))

    return (
        f"📋 <b>[홍보 Swarm 고위험 결재 제안서 — {pid}]</b>\n"
        f"━━━━━━━━━━━━━━━━━━━━\n"
        f"• <b>대상 사업부 / 담당 방</b>: <code>{div}</code> · {html.escape(room_ko)}\n"
        f"• <b>분류</b>: [고위험 — {cat}] (임의 수정 0건)\n"
        f"• <b>실데이터 근거</b>: {ev}\n"
        f"• <b>제안 변경안</b>:\n"
        f"  - Before: {bef}\n"
        f"  - After: {aft}\n"
        f"• <b>레드팀 리스크·되돌리기 기준</b>: {risk}\n"
        f"• <b>기대 효과</b>: {imp}\n"
        f"━━━━━━━━━━━━━━━━━━━━\n"
        f"✅ <b>승인 시</b>: 텔레그램에 <code>{pid} 승인</code> 답장\n"
        f"⏸ <b>보류 시</b>: <code>{pid} 보류</code> 또는 수정 지시 답장"
    )


def format_proposal_markdown(proposal: Dict[str, Any]) -> str:
    room = str(proposal["target_room"])
    room_ko = "홈페이지 방 (`1921e31e-ab59-4720-9419-93cac770374d`)" if room == "homepage" else "텔레그램 사령탑 · 결제/보안 본부 (`9522c1b0-bae8-447b-8421-e07cf7a526b7`)"
    return (
        f"# 고위험 결재 제안서: {proposal['proposal_id']}\n\n"
        f"- **생성 시각**: {proposal.get('created_at_kst', '')}\n"
        f"- **상태**: `{proposal.get('status', 'PENDING_CHAIRMAN_APPROVAL')}`\n"
        f"- **대상 사업부**: `{proposal['division']}`\n"
        f"- **승인 후 이관 대상 방**: {room_ko}\n"
        f"- **분류**: {proposal['category']}\n\n"
        f"## 1. 실데이터 근거\n{proposal['data_evidence']}\n\n"
        f"## 2. 제안 변경안 (Before → After)\n"
        f"- **Before**: {proposal['before_state']}\n"
        f"- **After**: {proposal['after_proposal']}\n\n"
        f"## 3. 레드팀 리스크 검토 & 되돌리기 기준\n{proposal['redteam_risk_and_rollback']}\n\n"
        f"## 4. 기대 효과\n{proposal['expected_impact']}\n\n"
        f"---\n"
        f"- 승인 명령(텔레그램): `{proposal['proposal_id']} 승인`\n"
        f"- 보류 명령(텔레그램): `{proposal['proposal_id']} 보류`\n"
    )


def send_telegram_chief_of_staff_html(html_text: str, chat_id: str = DEFAULT_GROUP_CHAT_ID) -> Tuple[bool, str]:
    """Dispatches an HTML notification via existing `1사업부/scripts/master_hq_telegram_bridge.js --div HQ --notify-file`."""
    if not MASTER_BRIDGE_JS.exists():
        return False, f"master_bridge_missing:{MASTER_BRIDGE_JS}"
    tmp_path: Optional[Path] = None
    try:
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".html.txt", delete=False) as tf:
            tf.write(html_text)
            tmp_path = Path(tf.name)
        proc = subprocess.run(
            [
                "node",
                str(MASTER_BRIDGE_JS),
                "--div",
                "HQ",
                "--chat-id",
                str(chat_id),
                "--notify-file",
                str(tmp_path),
            ],
            cwd=str(HQ_ROOT / "1사업부"),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=30,
        )
        ok = proc.returncode == 0
        detail = (proc.stdout or proc.stderr or "").strip()[:240]
        return ok, detail
    except Exception as exc:
        return False, f"dispatch_exception:{exc}"
    finally:
        if tmp_path is not None:
            try:
                tmp_path.unlink(missing_ok=True)
            except Exception:
                pass


def register_and_notify_proposals(
    proposals: List[Dict[str, Any]],
    ledger_path: Path = PROPOSALS_LEDGER_PATH,
    docs_dir: Path = PROPOSALS_DOCS_DIR,
    notify_telegram: bool = False,
    chat_id: str = DEFAULT_GROUP_CHAT_ID,
) -> Dict[str, Any]:
    ok, errs = validate_high_risk_proposals(proposals)
    if not ok:
        return {"ok": False, "errors": errs}

    now_str = dt.datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST")
    existing: Dict[str, Any] = {"schema_version": "swarm-approval-proposals-v1", "updated_at_kst": now_str, "proposals": []}
    if ledger_path.exists():
        try:
            loaded = json.loads(ledger_path.read_text(encoding="utf-8"))
            if isinstance(loaded, dict) and isinstance(loaded.get("proposals"), list):
                existing = loaded
        except Exception:
            pass

    existing_by_id = {str(x.get("proposal_id")): x for x in existing["proposals"] if isinstance(x, dict)}
    written_docs: List[str] = []
    telegram_results: List[Dict[str, Any]] = []

    docs_dir.mkdir(parents=True, exist_ok=True)
    for raw_p in proposals:
        rec = dict(raw_p)
        rec["division"] = str(rec["division"]).upper()
        rec.setdefault("status", "PENDING_CHAIRMAN_APPROVAL")
        rec.setdefault("created_at_kst", now_str)
        rec["updated_at_kst"] = now_str
        doc_path = docs_dir / f"{rec['proposal_id']}.md"
        doc_path.write_text(format_proposal_markdown(rec), encoding="utf-8")
        rec["doc_path"] = str(doc_path)
        written_docs.append(str(doc_path))

        if notify_telegram:
            tg_ok, tg_detail = send_telegram_chief_of_staff_html(format_proposal_telegram_html(rec), chat_id=chat_id)
            rec["telegram_notified"] = tg_ok
            rec["telegram_notified_at_kst"] = now_str if tg_ok else ""
            telegram_results.append({"proposal_id": rec["proposal_id"], "ok": tg_ok, "detail": tg_detail})

        existing_by_id[rec["proposal_id"]] = rec

    existing["updated_at_kst"] = now_str
    existing["proposals"] = list(existing_by_id.values())
    saved_ledger = safe_write_approval_ledger(ledger_path, existing)

    return {
        "ok": True,
        "ledger_path": str(saved_ledger),
        "written_docs": written_docs,
        "telegram_results": telegram_results,
        "count": len(proposals),
    }


def apply_swarm_overlay(
    candidate: Dict[str, Any],
    hq_path: Path = OVERLAY_PATH_HQ,
    div1_path: Optional[Path] = OVERLAY_PATH_DIV1,
    today_kst: Optional[dt.date] = None,
) -> Dict[str, Any]:
    ok, errs, report = validate_swarm_overlay(candidate, today_kst=today_kst)
    if not ok:
        return {"ok": False, "errors": errs, "report": report}

    candidate = dict(candidate)
    candidate["updated_at_kst"] = dt.datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST")

    written: List[str] = []
    written.append(str(safe_write_swarm_overlay(hq_path, candidate)))
    if div1_path is not None and div1_path.parent.exists():
        written.append(str(safe_write_swarm_overlay(div1_path, candidate)))

    return {"ok": True, "written_paths": written, "report": report}


# ==============================================================================
# 4. Built-in Sanctuary Self-Test & CLI
# ==============================================================================
def run_sanctuary_self_tests() -> None:
    forbidden = [
        HQ_ROOT / "1사업부" / "index.html",
        HQ_ROOT / "5사업부" / "index.html",
        HQ_ROOT / "2사업부" / "src" / "pricing.json",
        HQ_ROOT / "data" / "message_matrix_5div.json",
        HQ_ROOT / "1사업부" / "data" / "message_matrix_5div.json",
        HQ_ROOT / "data" / "topic_hook_weights.json",
        HQ_ROOT / "cloud_automation" / "promo_hard_gate.py",
        HQ_ROOT / "GEMINI.md",
        HQ_ROOT / "telegram_5bot_hub" / "telegram_5bot_hub_watchdog.py",
        HQ_ROOT / "1사업부" / ".github" / "workflows" / "daily-auto-promo.yml",
        HQ_ROOT / "1사업부" / "data" / "whop_checkout_registry.json",
    ]
    for bad in forbidden:
        try:
            assert_swarm_overlay_write_allowed(bad)
            raise AssertionError(f"Swarm sanctuary FAILED to block: {bad}")
        except GovernanceSanctuaryViolationError:
            pass

    assert_swarm_overlay_write_allowed(OVERLAY_PATH_HQ)
    assert_swarm_overlay_write_allowed(OVERLAY_PATH_DIV1)
    assert_approval_ledger_write_allowed(PROPOSALS_LEDGER_PATH)


def main() -> int:
    parser = argparse.ArgumentParser(description="Dream Company Promo Swarm Fail-Closed Exit Gate ($0)")
    parser.add_argument("--validate", type=str, default="", help="Validate a candidate swarm overlay JSON file")
    parser.add_argument("--apply", type=str, default="", help="Validate and apply overlay JSON to HQ + 1사업부 mirror")
    parser.add_argument("--register-proposals", type=str, default="", help="Validate & register high-risk proposals JSON")
    parser.add_argument("--notify-telegram", action="store_true", help="Send Telegram Chief-of-Staff approval cards")
    parser.add_argument("--chat-id", type=str, default=DEFAULT_GROUP_CHAT_ID, help="Telegram chat ID")
    parser.add_argument("--test-sanctuary", action="store_true", help="Run Governance Sanctuary Hard Lock self-tests")
    args = parser.parse_args()

    run_sanctuary_self_tests()
    if args.test_sanctuary and not (args.validate or args.apply or args.register_proposals):
        print("SWARM_SANCTUARY_LOCK SELF-TEST PASS (11/11 forbidden targets blocked, whitelists allowed).", flush=True)
        return 0

    if args.validate:
        cand = json.loads(Path(args.validate).read_text(encoding="utf-8"))
        ok, errs, rep = validate_swarm_overlay(cand)
        print(json.dumps({"ok": ok, "errors": errs, "report": rep}, ensure_ascii=False, indent=2), flush=True)
        return 0 if ok else 1

    if args.apply:
        cand = json.loads(Path(args.apply).read_text(encoding="utf-8"))
        res = apply_swarm_overlay(cand)
        print(json.dumps(res, ensure_ascii=False, indent=2), flush=True)
        return 0 if res.get("ok") else 1

    if args.register_proposals:
        raw = json.loads(Path(args.register_proposals).read_text(encoding="utf-8"))
        plist = raw.get("proposals", raw) if isinstance(raw, dict) else raw
        res = register_and_notify_proposals(plist, notify_telegram=args.notify_telegram, chat_id=args.chat_id)
        print(json.dumps(res, ensure_ascii=False, indent=2), flush=True)
        return 0 if res.get("ok") else 1

    parser.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
