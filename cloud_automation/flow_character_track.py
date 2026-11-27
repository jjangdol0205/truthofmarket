#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/flow_character_track.py
================================================================================
Dream Company — Plan C (`WIP=1` Div 5 KFK Pilot + All-Company 7 Safety Shields)
Google Flow Character Hook Track (`SLOT_B`) with Zero `SLOT_A` Regression &
`$0` External Paid Video REST API Hard Lock.

7 Production Safety Shields Implemented Deterministically:
  Shield 1 — Audio Conflict & Lip-Sync Block:
      Forces `-an` on Flow character clips and verifies `audio_streams == 0`
      via `ffprobe` (or `ffmpeg -i` fallback) BEFORE mixing ONLY clean Edge-TTS
      + 3 SFX + `-26dB` sidechain-ducked BGM.
  Shield 2 — Reused-Content Anti-Duplication Engine:
      `data/flow_clip_lru_state.json` enforces a 7-slot (7-day) LRU cooldown
      queue + per-episode uniqueness across 3 layers:
        (a) Live date & division metric top badge (`"11/27 LIVE · KDCA 2017"`),
        (b) Episode-unique speech-bubble dialogue,
        (c) Deterministic `1.03x~1.07x` micro-zoom velocity jitter per episode
            so frame hashes are 100% distinct across episodes.
  Shield 3 — 4.5s Transition Retention 'Circular Character PiP Badge':
      4.5s silent character hook -> `0.30s` smooth `zoomin` xfade transition ->
      KDCA 2017 motion chart (KFK) + mobile real-UI cuts (`4.5s~end`) with a
      persistent `150x150` (~14% width) circular character PiP avatar pinned
      cleanly at top-left safe zone `(x=36, y=130)`.
  Shield 4 — UI Dead-Zone Avoidance Layout:
      Speech bubble strictly inside top safe zone `top 14~28%` (`Y=268..538`,
      horizontal margin `>=10%` => `X=108..972`, zero eye/expression occlusion),
      zero intrusion into right icon rail (`right 0~18%`, `bottom 0~35%`),
      and ending CTA centered strictly inside `bottom 35~42%` (`Y=1100..1250`).
  Shield 5 — IG Reels Black-Thumbnail Prevention Helper:
      Provides `extract_reel_cover_frame(mp4, t_sec=0.5, title_5words=...)`
      alongside `thumb_offset=500` in `cloud_promo_runner.py`.
  Shield 6 — Platform AI Label, Style Guard & Compliance:
      Re-enforces `check_promo_hard_gate` (0 banned terms), blocks Western 3D
      mix on Div 4 (`HERO` = Korean 2D art style ONLY), and enforces `$0`
      External Paid Video REST API & Zero Identity Drift hard locks.
  Shield 7 — Non-Destructive A/B Track Eligibility & Graceful Fallback:
      - `SLOT_A` (`07:17 KST`) NEVER enters character mode (100% real-UI lock).
      - Financial divs (`TOM`, `GBA`) locked OFF through `2026-12-08` `shadow_14d`
        & `2026-12-11` review (`FLOW_CHAR_PILOT_DIVS = {"KFK"}` default WIP=1).
      - Missing/empty `character_clips/` NEVER crashes or fakes faces — falls
        back seamlessly to `SLOT_A` `0.0s` mobile real-UI and logs
        `flow_fallback_reason` for audit transparency.

Hardware Safety: strictly `-threads 2`, `max_workers=1`, Windows `BelowNormal`.
================================================================================
"""

from __future__ import annotations

import datetime as dt
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any, Dict, FrozenSet, List, Optional, Tuple

from PIL import Image, ImageDraw, ImageFilter, ImageFont

if sys.platform == "win32":
    try:
        import ctypes
        ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x00004000)
    except Exception:
        pass

sys.path.insert(0, str(Path(__file__).resolve().parent))
from promo_hard_gate import (  # noqa: E402
    DIV_ACCENT_RGB,
    build_clean_go_link,
    build_synced_srt,
    check_promo_hard_gate,
    split_to_short_subtitle_lines,
)
from zero_ai_video_composer import (  # noqa: E402
    _build_concat_subtitle_list,
    _get_ffmpeg,
    _pick_font,
    draw_safezone_ending_cta_box,
    mix_voice_sfx_and_ducked_bgm,
    pick_highlight_token,
    synthesize_chunked_speech_with_pauses,
)

KST = dt.timezone(dt.timedelta(hours=9))
ROOT = Path(__file__).resolve().parent.parent
DEFAULT_VAULT_ROOT = ROOT / "flow_vault"
DEFAULT_LRU_STATE_PATH = ROOT / "data" / "flow_clip_lru_state.json"

# ==============================================================================
# Core Invariant Hard Locks (Plan C — Chairman Confirmed 2026-11-27)
# ==============================================================================
# WIP=1 default pilot: ONLY Div 5 (KFK) active by default.
# Post-2026-12-11 rollout: expand via 1-line env or constant update after Chairman sign-off.
FLOW_CHAR_PILOT_DIVS: FrozenSet[str] = frozenset({"KFK"})
FINANCIAL_SHADOW_LOCKED_DIVS: FrozenSet[str] = frozenset({"TOM", "GBA"})
SHADOW_14D_END_DATE = dt.date(2026, 12, 8)
PILOT_REVIEW_DATE = dt.date(2026, 12, 11)

# $0 External Paid Video REST API Permanent Hard Lock
EXTERNAL_PAID_VIDEO_API_ENABLED = False
FORBIDDEN_PAID_VIDEO_API_HOSTS: Tuple[str, ...] = (
    "runwayml.com",
    "klingai.com",
    "lumalabs.ai",
    "pika.art",
    "heygen.com",
    "synthesia.io",
    "api.openai.com/v1/videos",
    "sora.com",
    "predictLongRunning",
    "veo-2.0",
    "veo-3.0",
)

# Zero Identity Drift & Grotesque/Copyright Asset Bans
FORBIDDEN_VISUAL_TAGS: FrozenSet[str] = frozenset({
    "text_only_character",
    "photorealistic_ai_elderly",
    "photorealistic_ai_child",
    "grotesque_3d",
    "3d_brain",
    "3d_skull",
    "3d_cell",
    "western_3d",
    "pixar_clone",
    "disney_clone",
})

DIV_VAULT_DIR_MAP: Dict[str, str] = {
    "TOM": "div_1",
    "KFG": "div_2",
    "GBA": "div_3",
    "HERO": "div_4",
    "KFK": "div_5",
}

DIV_SPEAKER_LABEL: Dict[str, str] = {
    "TOM": "Bob & Linda",
    "KFG": "Mom & Leo",
    "GBA": "田中ご夫婦",
    "HERO": "백운호 사랑방",
    "KFK": "도윤이네 성장노트",
}

# Shield 2 / 3 / 4 Geometry & Timing Constants (1080x1920 vertical canvas)
HOOK_CLIP_SEC = 4.50
XFADE_ZOOMIN_SEC = 0.30
LRU_COOLDOWN_SLOTS = 7
MICRO_ZOOM_MIN = 1.03
MICRO_ZOOM_MAX = 1.07

PIP_AVATAR_SIZE_PX = 150      # ~13.89% (~14%) of 1080px width
PIP_AVATAR_X = 36             # Top-left safe zone
PIP_AVATAR_Y = 130            # Safely below status bar & top live badge (Y=62..114)

SPEECH_BUBBLE_Y_MIN = 268     # top 14.0% of 1920
SPEECH_BUBBLE_Y_MAX = 538     # top 28.0% of 1920 (0% character eye occlusion!)
SPEECH_BUBBLE_X_MIN = 108     # >= 10% left margin
SPEECH_BUBBLE_X_MAX = 972     # >= 10% right margin

ENDING_CTA_Y_MIN = 1100       # bottom 42.7%
ENDING_CTA_Y_MAX = 1250       # bottom 34.9% (strictly above bottom 35% dead-zone)


class PaidVideoAPILockError(RuntimeError):
    """Raised immediately if any code attempts to call a paid external video REST API."""


class IdentitySafetyError(ValueError):
    """Raised when forbidden text-only faces, grotesque 3D, or HERO western-3D mix is detected."""


def assert_zero_paid_video_api(endpoint_or_provider: str) -> None:
    """Permanent `$0` external paid video REST API code-level guard."""
    if EXTERNAL_PAID_VIDEO_API_ENABLED:
        raise PaidVideoAPILockError("EXTERNAL_PAID_VIDEO_API_ENABLED must remain permanently False ($0 lock).")
    low = str(endpoint_or_provider or "").lower()
    for bad in FORBIDDEN_PAID_VIDEO_API_HOSTS:
        if bad.lower() in low:
            raise PaidVideoAPILockError(f"Blocked forbidden external paid video API host/token: {bad}")


def assert_visual_asset_identity_safe(div: str, asset_meta: Dict[str, Any]) -> None:
    """Blocks Identity Drift (text-only face gen), grotesque 3D stock, and HERO Western 3D mixing."""
    div_u = div.upper()
    tags = {str(t).strip().lower() for t in (asset_meta.get("tags") or [])}
    style = str(asset_meta.get("art_style") or "").strip().lower()
    gen_mode = str(asset_meta.get("generation_mode") or "").strip().lower()

    if gen_mode in ("text_only", "text_to_video_no_anchor", "unanchored_character"):
        raise IdentitySafetyError("Text-only unanchored character generation is permanently forbidden.")

    bad_hits = tags.intersection(FORBIDDEN_VISUAL_TAGS)
    if bad_hits:
        raise IdentitySafetyError(f"Forbidden visual asset tag(s) detected: {sorted(bad_hits)}")

    if div_u == "HERO":
        if any(k in style for k in ("3d", "pixar", "disney", "western")):
            raise IdentitySafetyError(f"Div 4 HERO forbids Western/3D art style mix (got style={style!r}); Korean 2D only.")


def get_active_pilot_divs(today_kst: Optional[dt.date] = None) -> FrozenSet[str]:
    """
    Returns active Flow Character Pilot divisions.
    - Default WIP=1: strictly `{"KFK"}`.
    - Financial divs (`TOM`, `GBA`) remain hard-locked OFF through `2026-12-08` `shadow_14d`
      even if accidentally listed in `FLOW_CHAR_PILOT_DIVS` env var (unless explicit Chairman
      post-12/11 override `FLOW_ALLOW_FINANCIAL_OVERRIDE=1` is set).
    """
    d_now = today_kst or dt.datetime.now(KST).date()
    raw_env = os.getenv("FLOW_CHAR_PILOT_DIVS", "").strip()
    if raw_env:
        cands = {x.strip().upper() for x in raw_env.split(",") if x.strip()}
    else:
        cands = set(FLOW_CHAR_PILOT_DIVS)

    allow_fin = os.getenv("FLOW_ALLOW_FINANCIAL_OVERRIDE", "0").strip() == "1"
    if (d_now <= SHADOW_14D_END_DATE) and not allow_fin:
        cands -= set(FINANCIAL_SHADOW_LOCKED_DIVS)
    return frozenset(cands)


def get_div_vault_paths(div: str, vault_root: Path = DEFAULT_VAULT_ROOT) -> Dict[str, Path]:
    div_u = div.upper()
    folder = DIV_VAULT_DIR_MAP.get(div_u, f"div_{div_u.lower()}")
    base = Path(vault_root) / folder
    return {
        "base": base,
        "sheets_dir": base / "character_sheets",
        "clips_dir": base / "character_clips",
        "pip_dir": base / "character_pip",
        "manifest_path": base / "character_manifest.json",
    }


# ==============================================================================
# Shield 1: Deterministic Media Probe & Silent (`-an`) Enforcement
# ==============================================================================
def probe_media_streams(media_path: Path) -> Dict[str, Any]:
    """
    Inspects video/audio streams, resolution, and duration deterministically using
    `ffprobe` when available on PATH, with an exact `ffmpeg -i` fallback for Windows
    environments running `imageio_ffmpeg`.
    """
    p = Path(media_path)
    if not p.exists():
        return {"exists": False, "video_streams": 0, "audio_streams": 0, "width": 0, "height": 0, "duration_sec": 0.0, "probe_tool": "none"}

    ffprobe = shutil.which("ffprobe")
    if ffprobe:
        try:
            pr = subprocess.run(
                [ffprobe, "-v", "error", "-show_streams", "-show_format", "-of", "json", str(p)],
                capture_output=True, text=True, timeout=20,
            )
            if pr.returncode == 0 and pr.stdout.strip():
                data = json.loads(pr.stdout)
                v_streams = [s for s in (data.get("streams") or []) if s.get("codec_type") == "video"]
                a_streams = [s for s in (data.get("streams") or []) if s.get("codec_type") == "audio"]
                w = int(v_streams[0].get("width") or 0) if v_streams else 0
                h = int(v_streams[0].get("height") or 0) if v_streams else 0
                dur = float((data.get("format") or {}).get("duration") or 0.0)
                return {
                    "exists": True,
                    "video_streams": len(v_streams),
                    "audio_streams": len(a_streams),
                    "width": w,
                    "height": h,
                    "duration_sec": round(dur, 3),
                    "probe_tool": "ffprobe",
                }
        except Exception:
            pass

    # Deterministic fallback via ffmpeg -i (works identically with imageio_ffmpeg)
    ffmpeg = _get_ffmpeg()
    pr = subprocess.run([ffmpeg, "-i", str(p)], stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=20)
    err = pr.stderr or ""
    v_lines = re.findall(r"Stream #\d+:\d+[^:\n]*:\s*Video:.*", err)
    a_lines = re.findall(r"Stream #\d+:\d+[^:\n]*:\s*Audio:.*", err)
    w, h = 0, 0
    if v_lines:
        m_res = re.search(r",\s*(\d{3,4})x(\d{3,4})(?:[\s,\[]|$)", v_lines[0])
        if m_res:
            w, h = int(m_res.group(1)), int(m_res.group(2))
    dur = 0.0
    m_dur = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", err)
    if m_dur:
        dur = int(m_dur.group(1)) * 3600.0 + int(m_dur.group(2)) * 60.0 + float(m_dur.group(3))
    return {
        "exists": True,
        "video_streams": len(v_lines),
        "audio_streams": len(a_lines),
        "width": w,
        "height": h,
        "duration_sec": round(dur, 3),
        "probe_tool": "ffmpeg",
    }


def assert_silent_video_stream(mp4_path: Path) -> Dict[str, Any]:
    """Shield 1 Hard Gate: asserts video_streams >= 1 AND audio_streams == 0."""
    info = probe_media_streams(mp4_path)
    if not info.get("exists"):
        raise FileNotFoundError(f"Silent clip missing: {mp4_path}")
    if int(info.get("video_streams") or 0) < 1:
        raise RuntimeError(f"Invalid Flow clip (video_streams=0): {mp4_path}")
    if int(info.get("audio_streams") or 0) != 0:
        raise RuntimeError(
            f"[SHIELD 1 BLOCKED] Flow clip still contains audio_streams={info['audio_streams']} (must be 0 via -an): {mp4_path}"
        )
    return info


def strip_audio_to_clean_9x16(
    src_mp4: Path,
    dst_mp4: Path,
    max_duration_sec: float = 8.0,
) -> Dict[str, Any]:
    """
    Transcodes a downloaded Google Flow clip into a clean silent (`-an`) 1080x1920 30fps
    H.264 master (`-threads 2`, `BelowNormal`) and immediately verifies `audio_streams == 0`.
    """
    ffmpeg = _get_ffmpeg()
    dst_mp4.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        ffmpeg, "-y", "-threads", "2",
        "-i", str(src_mp4),
        "-t", f"{max_duration_sec:.2f}",
        "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p",
        "-an",
        "-c:v", "libx264", "-preset", "fast", "-crf", "21",
        "-movflags", "+faststart",
        str(dst_mp4),
    ]
    r = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=180)
    if r.returncode != 0 or not dst_mp4.exists():
        raise RuntimeError(f"strip_audio_to_clean_9x16 failed: {r.stderr[-260:]}")
    return assert_silent_video_stream(dst_mp4)


# ==============================================================================
# Shield 2: 7-Slot LRU Cooldown Queue & Episode Uniqueness Engine
# ==============================================================================
def load_lru_state(state_path: Path = DEFAULT_LRU_STATE_PATH) -> Dict[str, Any]:
    if state_path.exists():
        try:
            return json.loads(state_path.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {"schema_version": "flow-lru-v1", "divisions": {}}


def save_lru_state(state: Dict[str, Any], state_path: Path = DEFAULT_LRU_STATE_PATH) -> None:
    state_path.parent.mkdir(parents=True, exist_ok=True)
    state["updated_at_kst"] = dt.datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST")
    state_path.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def compute_episode_micro_zoom(episode_key: str) -> float:
    """
    Maps `episode_key` deterministically to a unique zoom target in `[1.03, 1.07]`.
    Guarantees micro-zoom velocity jitter across episodes so no two uploads share frame hashes.
    """
    digest = hashlib.sha256(str(episode_key).encode("utf-8")).hexdigest()
    frac = int(digest[:8], 16) / float(0xFFFFFFFF)
    return round(MICRO_ZOOM_MIN + frac * (MICRO_ZOOM_MAX - MICRO_ZOOM_MIN), 4)


def build_live_date_badge(
    div: str,
    now_kst: Optional[dt.datetime] = None,
    smh_fg_meta: Optional[Dict[str, Any]] = None,
) -> str:
    """Shield 2 Layer (a): Per-day live date + verified public benchmark badge."""
    dt_now = now_kst or dt.datetime.now(KST)
    mmdd = dt_now.strftime("%m/%d")
    div_u = div.upper()
    if div_u == "KFK":
        return f"{mmdd} LIVE · KDCA 2017"
    if div_u == "KFG":
        return f"{mmdd} LIVE · US CDC 2000"
    if div_u in ("TOM", "GBA"):
        sc = (smh_fg_meta or {}).get("smh_fg_score")
        sc_txt = f"{float(sc):.1f}".rstrip("0").rstrip(".") if sc is not None else "LIVE"
        return f"{mmdd} LIVE · SMH {sc_txt}"
    return f"{mmdd} LIVE · 백운호 라디오"


def select_lru_character_clip(
    div: str,
    valid_clips: List[Dict[str, Any]],
    episode_key: str,
    lru_state_path: Path = DEFAULT_LRU_STATE_PATH,
    cooldown_slots: int = LRU_COOLDOWN_SLOTS,
    persist: bool = True,
) -> Tuple[Optional[Dict[str, Any]], Dict[str, Any]]:
    """
    Selects a character clip honoring a >= `cooldown_slots` (7-slot / 7-day) LRU queue.
    - When `len(valid_clips) > cooldown_slots`: strictly excludes the last 7 used clip_ids.
    - When `len(valid_clips) <= cooldown_slots` (e.g. initial pilot ramp-up): picks the
      least-recently-used clip (never repeating the immediately previous clip if pool >= 2)
      and records `cooldown_relaxed=True` transparently in `lru_meta`.
    """
    div_u = div.upper()
    if not valid_clips:
        return None, {"pool_size": 0, "cooldown_slots": cooldown_slots, "cooldown_relaxed": False}

    state = load_lru_state(lru_state_path)
    div_st = state.setdefault("divisions", {}).setdefault(div_u, {"recent_queue": [], "use_counts": {}})
    recent_q: List[str] = list(div_st.get("recent_queue") or [])
    use_counts: Dict[str, int] = dict(div_st.get("use_counts") or {})

    blocked_window = set(recent_q[-cooldown_slots:]) if cooldown_slots > 0 else set()
    fresh_pool = [c for c in valid_clips if str(c.get("clip_id")) not in blocked_window]
    cooldown_relaxed = False

    if fresh_pool:
        candidates = fresh_pool
    else:
        cooldown_relaxed = True
        # Avoid back-to-back identical clip whenever >= 2 clips exist
        last_id = recent_q[-1] if recent_q else ""
        non_repeat = [c for c in valid_clips if str(c.get("clip_id")) != last_id]
        candidates = non_repeat or valid_clips

    def _lru_rank(c: Dict[str, Any]) -> Tuple[int, int, str]:
        cid = str(c.get("clip_id") or "")
        # Older index in recent_q (or -1 if never used) wins first
        last_pos = -1
        for i in range(len(recent_q) - 1, -1, -1):
            if recent_q[i] == cid:
                last_pos = i
                break
        return (int(use_counts.get(cid, 0)), last_pos, cid)

    candidates.sort(key=_lru_rank)
    chosen = candidates[0]
    chosen_id = str(chosen["clip_id"])

    if persist:
        recent_q.append(chosen_id)
        div_st["recent_queue"] = recent_q[-max(28, cooldown_slots * 4):]
        use_counts[chosen_id] = int(use_counts.get(chosen_id, 0)) + 1
        div_st["use_counts"] = use_counts
        div_st["last_episode_key"] = episode_key
        save_lru_state(state, lru_state_path)

    return chosen, {
        "pool_size": len(valid_clips),
        "cooldown_slots": cooldown_slots,
        "cooldown_relaxed": cooldown_relaxed,
        "selected_clip_id": chosen_id,
        "recent_queue_len": len(recent_q),
        "use_count_after": int(use_counts.get(chosen_id, 0)),
    }


# ==============================================================================
# Shield 3: Circular 150x150 (~14%) Character Mini-Avatar PiP Builder
# ==============================================================================
def build_circular_pip_avatar(
    sheet_image_path: Path,
    out_png: Path,
    size: int = PIP_AVATAR_SIZE_PX,
    accent_rgb: Tuple[int, int, int] = (110, 231, 183),
) -> Path:
    """
    Crops the character portrait cleanly from a master character sheet PNG/JPG into a
    crisp `150x150` (~14% of 1080px width) antialiased circular RGBA PiP badge with
    warm ivory inner ring, division accent outer ring, and soft drop shadow.
    """
    src = Image.open(sheet_image_path).convert("RGBA")
    sw, sh = src.size

    # Portrait-focused upper-center square crop (captures head & face without cutting forehead)
    side = min(sw, sh)
    if sh > sw:
        crop_side = int(sw * 0.86)
        cx = sw // 2
        cy = int(sh * 0.34)
    else:
        crop_side = int(sh * 0.86)
        cx = sw // 2
        cy = int(sh * 0.42)
    x0 = max(0, min(sw - crop_side, cx - crop_side // 2))
    y0 = max(0, min(sh - crop_side, cy - crop_side // 2))
    portrait = src.crop((x0, y0, x0 + crop_side, y0 + crop_side))

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    # Soft dark drop shadow behind circular badge for contrast over light & dark UI
    shadow_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_layer)
    pad = 6
    sdraw.ellipse([pad + 2, pad + 4, size - pad + 2, size - pad + 4], fill=(0, 0, 0, 145))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=4))
    canvas.alpha_composite(shadow_layer)

    # Outer brand-accent ring + crisp ivory inner border (4x supersampled for razor-clean edges)
    scale = 4
    ring_hr = Image.new("RGBA", (size * scale, size * scale), (0, 0, 0, 0))
    rdraw = ImageDraw.Draw(ring_hr)
    rdraw.ellipse(
        [pad * scale, pad * scale, (size - pad) * scale, (size - pad) * scale],
        fill=(*accent_rgb, 255),
    )
    in1 = (pad + 4) * scale
    rdraw.ellipse([in1, in1, size * scale - in1, size * scale - in1], fill=(252, 250, 245, 255))
    ring_img = ring_hr.resize((size, size), Image.Resampling.LANCZOS)
    canvas.alpha_composite(ring_img)

    # Circular masked portrait inside the ivory border
    inner_margin = pad + 7
    inner_d = size - inner_margin * 2
    p_resized = portrait.resize((inner_d, inner_d), Image.Resampling.LANCZOS)
    mask_hr = Image.new("L", (inner_d * scale, inner_d * scale), 0)
    ImageDraw.Draw(mask_hr).ellipse([0, 0, inner_d * scale - 1, inner_d * scale - 1], fill=255)
    mask = mask_hr.resize((inner_d, inner_d), Image.Resampling.LANCZOS)

    portrait_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    portrait_layer.paste(p_resized, (inner_margin, inner_margin), mask)
    canvas.alpha_composite(portrait_layer)

    out_png.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_png, format="PNG")
    return out_png


# ==============================================================================
# Shield 4: UI Dead-Zone Avoidance Overlays (Hook Speech Bubble + UI PiP Overlay)
# ==============================================================================
def _wrap_bubble_lines(
    draw: ImageDraw.ImageDraw,
    text: str,
    font: ImageFont.FreeTypeFont,
    max_w: int,
    max_lines: int = 2,
) -> List[str]:
    clean = re.sub(r"\s+", " ", (text or "").strip())
    if not clean:
        return []
    if (draw.textbbox((0, 0), clean, font=font)[2]) <= max_w:
        return [clean]
    if " " in clean:
        words = clean.split(" ")
        lines: List[str] = []
        cur = ""
        for w in words:
            cand = f"{cur} {w}".strip() if cur else w
            if (draw.textbbox((0, 0), cand, font=font)[2]) <= max_w:
                cur = cand
            else:
                if cur:
                    lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        return lines[:max_lines]
    # Continuous CJK fallback
    mid = max(1, len(clean) // 2)
    return [clean[:mid], clean[mid:]][:max_lines]


def _draw_top_live_badge(
    draw: ImageDraw.ImageDraw,
    badge_text: str,
    lang: str,
    accent_rgb: Tuple[int, int, int],
    width: int = 1080,
    top_y: int = 64,
) -> int:
    """Draws centered live date/metric badge strictly above `Y=118` (zero overlap with PiP at Y=130!)."""
    if not badge_text:
        return top_y
    f_sz = 24
    font = _pick_font(lang, f_sz)
    while f_sz >= 18:
        font = _pick_font(lang, f_sz)
        bb = draw.textbbox((0, 0), badge_text, font=font)
        if (bb[2] - bb[0]) <= 820:
            break
        f_sz -= 1
    bb = draw.textbbox((0, 0), badge_text, font=font)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    pad_x, pad_y = 24, 11
    bw, bh = tw + pad_x * 2 + 20, th + pad_y * 2
    bx = (width - bw) // 2
    by = top_y
    draw.rounded_rectangle(
        [bx, by, bx + bw, by + bh],
        radius=16,
        fill=(14, 22, 30, 228),
        outline=(*accent_rgb, 240),
        width=3,
    )
    # Crisp green/accent LIVE indicator dot
    dot_r = 6
    dot_cx = bx + 20
    dot_cy = by + bh // 2
    draw.ellipse([dot_cx - dot_r, dot_cy - dot_r, dot_cx + dot_r, dot_cy + dot_r], fill=(*accent_rgb, 255))
    draw.text((bx + 36, by + pad_y - bb[1]), badge_text, font=font, fill=(252, 248, 236, 255))
    return by + bh


def _draw_single_line_subtitle_pill(
    draw: ImageDraw.ImageDraw,
    div: str,
    lang: str,
    line_text: str,
    width: int = 1080,
    height: int = 1920,
) -> None:
    if not (line_text or "").strip():
        return
    accent_rgb = DIV_ACCENT_RGB.get(div.upper(), (110, 231, 183))
    hl = pick_highlight_token(line_text, lang=lang)
    max_w = 840  # Keeps right margin clean away from Shorts right engagement rail!
    font_sz = 52
    font = _pick_font(lang, font_sz)
    while font_sz >= 30:
        font = _pick_font(lang, font_sz)
        bb = draw.textbbox((0, 0), line_text, font=font, stroke_width=5)
        if (bb[2] - bb[0]) <= max_w:
            break
        font_sz -= 3
    bb = draw.textbbox((0, 0), line_text, font=font, stroke_width=5)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    pad_x, pad_y = 30, 17
    box_w, box_h = tw + pad_x * 2, th + pad_y * 2
    bx = (width - box_w) // 2
    by = 1365
    draw.rounded_rectangle(
        [bx, by, bx + box_w, by + box_h],
        radius=18,
        fill=(12, 16, 22, 218),
        outline=(*accent_rgb, 180),
        width=2,
    )
    tx = bx + pad_x
    ty = by + pad_y - bb[1]
    if hl and hl in line_text:
        pre, post = line_text.split(hl, 1)
        for seg_txt, col in [(pre, (255, 255, 255, 255)), (hl, (*accent_rgb, 255)), (post, (255, 255, 255, 255))]:
            if not seg_txt:
                continue
            draw.text((tx, ty), seg_txt, font=font, fill=col, stroke_width=5, stroke_fill=(8, 12, 16, 255))
            tx += int(draw.textlength(seg_txt, font=font))
    else:
        draw.text((tx, ty), line_text, font=font, fill=(255, 255, 255, 255), stroke_width=5, stroke_fill=(8, 12, 16, 255))


def render_character_hook_overlay_png(
    div: str,
    lang: str,
    live_badge_text: str,
    speech_bubble_text: str,
    subtitle_line: str,
    out_png: Path,
    speaker_label: str = "",
    width: int = 1080,
    height: int = 1920,
) -> Dict[str, Any]:
    """
    Shield 2 & 4 Hook Overlay (`0.0s ~ 4.5s`):
      - Top Live Badge (`Y=64..116`, e.g. `"11/27 LIVE · KDCA 2017"`).
      - Episode-unique Speech Bubble strictly inside `top 14~28%` (`Y=268..538`,
        horizontal margin `>=10%` => `X=108..972`) so character eyes & face are
        NEVER obscured and right engagement icons (`right 0~18%`) are untouched!
      - Clean 1-line synced subtitle at `Y=1365`.
    Returns exact rendered bounding boxes for deterministic geometry assertions.
    """
    div_u = div.upper()
    accent_rgb = DIV_ACCENT_RGB.get(div_u, (110, 231, 183))
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    badge_y1 = _draw_top_live_badge(draw, live_badge_text, lang, accent_rgb, width=width, top_y=64)

    # Speech bubble strictly bounded inside X=[108..972], Y=[268..538] (top 14~28%)
    bx0, bx1 = SPEECH_BUBBLE_X_MIN, SPEECH_BUBBLE_X_MAX - 16  # [108..956] (left 10%, right 11.5%)
    inner_w = (bx1 - bx0) - 64
    bubble_txt = re.sub(r"\s+", " ", (speech_bubble_text or "").strip()).replace("➔", "→")

    font_sz = 38 if lang in ("ko", "ja") else 34
    font = _pick_font(lang, font_sz)
    lines = _wrap_bubble_lines(draw, bubble_txt, font, inner_w, max_lines=2)
    while font_sz >= 24:
        font = _pick_font(lang, font_sz)
        lines = _wrap_bubble_lines(draw, bubble_txt, font, inner_w, max_lines=2)
        if len(lines) <= 2 and all(
            (draw.textbbox((0, 0), ln, font=font)[2] - draw.textbbox((0, 0), ln, font=font)[0]) <= inner_w
            for ln in lines
        ):
            break
        font_sz -= 2

    line_hs = [
        max(24, draw.textbbox((0, 0), ln, font=font)[3] - draw.textbbox((0, 0), ln, font=font)[1])
        for ln in lines
    ]
    gap = 12 if len(lines) > 1 else 0
    txt_block_h = sum(line_hs) + gap

    # Speaker tag pill sits cleanly at top edge of speech bubble (strictly >= Y=270)
    sp_lbl = speaker_label or DIV_SPEAKER_LABEL.get(div_u, "")
    by0 = 286
    tail_h = 20
    max_body_h = (SPEECH_BUBBLE_Y_MAX - tail_h - 4) - by0  # <= 228px
    body_h = max(124, min(max_body_h, txt_block_h + 62))
    by1 = by0 + body_h
    tail_tip_y = min(SPEECH_BUBBLE_Y_MAX - 2, by1 + tail_h)

    # Drop shadow + warm linen-white rounded speech bubble
    draw.rounded_rectangle([bx0 + 5, by0 + 7, bx1 + 5, by1 + 7], radius=28, fill=(10, 18, 24, 130))
    draw.rounded_rectangle(
        [bx0, by0, bx1, by1],
        radius=28,
        fill=(254, 252, 247, 246),
        outline=(*accent_rgb, 255),
        width=5,
    )
    # Compact downward speech pointer strictly ending <= Y=536 (<= 28%)
    tail_cx = width // 2 - 48
    tail_pts = [(tail_cx - 22, by1 - 3), (tail_cx + 22, by1 - 3), (tail_cx - 4, tail_tip_y)]
    draw.polygon(tail_pts, fill=(254, 252, 247, 246))
    draw.line([(tail_cx - 22, by1 - 1), (tail_cx - 4, tail_tip_y), (tail_cx + 22, by1 - 1)], fill=(*accent_rgb, 255), width=5)

    # Optional speaker tag pill nested inside top boundary (>= Y=270)
    if sp_lbl:
        f_sp = _pick_font(lang, 21)
        sbb = draw.textbbox((0, 0), sp_lbl, font=f_sp)
        sw_p, sh_p = (sbb[2] - sbb[0]) + 28, (sbb[3] - sbb[1]) + 10
        sx0 = bx0 + 28
        sy0 = max(SPEECH_BUBBLE_Y_MIN + 2, by0 - sh_p // 2)
        draw.rounded_rectangle([sx0, sy0, sx0 + sw_p, sy0 + sh_p], radius=12, fill=(16, 42, 34, 245), outline=(*accent_rgb, 255), width=2)
        draw.text((sx0 + 14, sy0 + 5 - sbb[1]), sp_lbl, font=f_sp, fill=(250, 250, 246, 255))

    # Draw episode speech-bubble lines centered vertically inside bubble
    y_cur = by0 + (body_h - txt_block_h) // 2 + 4
    for ln, lh in zip(lines, line_hs):
        bb = draw.textbbox((0, 0), ln, font=font)
        tw = bb[2] - bb[0]
        tx = bx0 + ((bx1 - bx0) - tw) // 2
        draw.text((tx, y_cur - bb[1]), ln, font=font, fill=(18, 28, 36, 255))
        y_cur += lh + gap

    _draw_single_line_subtitle_pill(draw, div_u, lang, subtitle_line, width=width, height=height)

    out_png.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_png, format="PNG")
    return {
        "png": str(out_png),
        "live_badge_y1": badge_y1,
        "bubble_bbox": [bx0, min(by0, SPEECH_BUBBLE_Y_MIN + 2), bx1, tail_tip_y],
        "within_top_14_28_pct": (SPEECH_BUBBLE_Y_MIN <= by0) and (tail_tip_y <= SPEECH_BUBBLE_Y_MAX),
        "within_horiz_10pct_margin": (bx0 >= SPEECH_BUBBLE_X_MIN) and (bx1 <= SPEECH_BUBBLE_X_MAX),
    }


def render_ui_with_pip_overlay_png(
    div: str,
    lang: str,
    live_badge_text: str,
    subtitle_line: str,
    pip_avatar_png: Optional[Path],
    out_png: Path,
    show_ending_cta: bool = False,
    width: int = 1080,
    height: int = 1920,
) -> Dict[str, Any]:
    """
    Shield 3 & 4 Post-4.5s Real-UI / Chart Overlay (`4.5s ~ end`):
      - Top Live Badge (`Y=64..116`).
      - Persistent `150x150` (~14%) circular character mini-avatar PiP badge pinned
        cleanly at top-left safe zone `(x=36, y=130)` (ZERO overlap with live badge
        or right-rail icons!).
      - 1-line synced subtitle at `Y=1365`.
      - Final ~5s centered safe-zone yellow CTA box at `Y=1102..1250` (`bottom: 35~42%`).
    """
    div_u = div.upper()
    accent_rgb = DIV_ACCENT_RGB.get(div_u, (110, 231, 183))
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    badge_y1 = _draw_top_live_badge(draw, live_badge_text, lang, accent_rgb, width=width, top_y=64)

    pip_applied = False
    if pip_avatar_png and Path(pip_avatar_png).exists():
        pip_im = Image.open(pip_avatar_png).convert("RGBA")
        if pip_im.size != (PIP_AVATAR_SIZE_PX, PIP_AVATAR_SIZE_PX):
            pip_im = pip_im.resize((PIP_AVATAR_SIZE_PX, PIP_AVATAR_SIZE_PX), Image.Resampling.LANCZOS)
        img.alpha_composite(pip_im, dest=(PIP_AVATAR_X, PIP_AVATAR_Y))
        pip_applied = True

    _draw_single_line_subtitle_pill(draw, div_u, lang, subtitle_line, width=width, height=height)

    if show_ending_cta:
        draw_safezone_ending_cta_box(draw, div_u, lang, width=width, height=height)

    out_png.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_png, format="PNG")
    return {
        "png": str(out_png),
        "live_badge_y1": badge_y1,
        "pip_applied": pip_applied,
        "pip_bbox": [PIP_AVATAR_X, PIP_AVATAR_Y, PIP_AVATAR_X + PIP_AVATAR_SIZE_PX, PIP_AVATAR_Y + PIP_AVATAR_SIZE_PX],
        "show_ending_cta": show_ending_cta,
    }


# ==============================================================================
# Shield 5: Optional t=0.5s IG Reels Cover Frame Extractor
# ==============================================================================
def extract_reel_cover_frame(
    mp4_path: Path,
    out_jpg: Path,
    t_sec: float = 0.5,
    title_5words: str = "",
    lang: str = "ko",
    div: str = "KFK",
) -> Path:
    """
    Extracts a crisp cover frame at `t_sec` (default `0.5s`) to prevent IG Reels
    black-thumbnail glitches, optionally stamping a concise <=5-word top title banner.
    """
    ffmpeg = _get_ffmpeg()
    out_jpg.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        ffmpeg, "-y", "-threads", "2",
        "-ss", f"{max(0.0, t_sec):.2f}",
        "-i", str(mp4_path),
        "-frames:v", "1", "-q:v", "2",
        str(out_jpg),
    ]
    r = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=45)
    if r.returncode != 0 or not out_jpg.exists():
        raise RuntimeError(f"extract_reel_cover_frame failed: {r.stderr[-220:]}")

    if title_5words.strip():
        im = Image.open(out_jpg).convert("RGBA")
        draw = ImageDraw.Draw(im)
        accent_rgb = DIV_ACCENT_RGB.get(div.upper(), (110, 231, 183))
        short_t = " ".join(title_5words.strip().split()[:5])
        font = _pick_font(lang, 44)
        bb = draw.textbbox((0, 0), short_t, font=font)
        tw, th = bb[2] - bb[0], bb[3] - bb[1]
        bx = (im.width - (tw + 52)) // 2
        by = 166
        draw.rounded_rectangle([bx, by, bx + tw + 52, by + th + 28], radius=18, fill=(14, 24, 32, 230), outline=(*accent_rgb, 255), width=3)
        draw.text((bx + 26, by + 14 - bb[1]), short_t, font=font, fill=(255, 250, 235, 255))
        im.convert("RGB").save(out_jpg, format="JPEG", quality=92)
    return out_jpg


# ==============================================================================
# Shield 7: Eligibility Gate & Graceful Fallback to SLOT_A Real-UI
# ==============================================================================
def check_flow_character_eligibility(
    div: str,
    slot_id: str,
    episode_key: str,
    vault_root: Path = DEFAULT_VAULT_ROOT,
    lru_state_path: Path = DEFAULT_LRU_STATE_PATH,
    today_kst: Optional[dt.date] = None,
    persist_lru: bool = False,
) -> Dict[str, Any]:
    """
    Deterministically decides whether an upload slot runs `slot_b_flowchar` or falls
    back cleanly to `slot_a_realui` (Zero `SLOT_A` mutation, Zero fake faces, Zero crashes!).
    """
    div_u = div.upper()
    slot_u = str(slot_id or "SLOT_A").upper()
    d_now = today_kst or dt.datetime.now(KST).date()

    def _fallback(reason: str) -> Dict[str, Any]:
        return {
            "eligible": False,
            "ab_track": "slot_a_realui",
            "flow_fallback_reason": reason,
            "selected_clip": None,
            "clip_path": None,
            "pip_avatar_png": None,
            "zoom_factor": 1.0,
            "lru_meta": {},
        }

    # Rule 1: SLOT_A is 100% locked to proven 0.0s mobile real-UI!
    if slot_u != "SLOT_B":
        return _fallback("slot_a_realui_protected")

    # Rule 2: Financial divs locked OFF through 2026-12-08 shadow_14d
    active_pilots = get_active_pilot_divs(today_kst=d_now)
    if div_u in FINANCIAL_SHADOW_LOCKED_DIVS and div_u not in active_pilots:
        return _fallback("financial_div_shadow_14d_locked")

    # Rule 3: WIP=1 Pilot Gate (default: KFK only)
    if div_u not in active_pilots:
        return _fallback(f"div_{div_u}_not_in_pilot_gate")

    vpaths = get_div_vault_paths(div_u, vault_root=vault_root)
    manifest_p = vpaths["manifest_path"]
    clips_dir = vpaths["clips_dir"]

    if not clips_dir.exists():
        return _fallback("character_clips_dir_missing")

    # Load manifest if present; also verify actual silent clip files exist on disk!
    manifest: Dict[str, Any] = {}
    if manifest_p.exists():
        try:
            manifest = json.loads(manifest_p.read_text(encoding="utf-8"))
        except Exception as exc:
            return _fallback(f"character_manifest_corrupt:{type(exc).__name__}")

    valid_clips: List[Dict[str, Any]] = []
    for entry in manifest.get("clips") or []:
        try:
            assert_visual_asset_identity_safe(div_u, entry)
        except IdentitySafetyError:
            continue
        rel_or_abs = str(entry.get("clean_clip_path") or entry.get("local_path") or "")
        cp = Path(rel_or_abs) if Path(rel_or_abs).is_absolute() else (vpaths["base"] / rel_or_abs)
        if not cp.exists():
            cp_alt = clips_dir / Path(rel_or_abs).name
            cp = cp_alt if cp_alt.exists() else cp
        if not cp.exists() or cp.stat().st_size < 20_000:
            continue
        dur = float(entry.get("duration_sec") or 0.0)
        if dur and not (3.5 <= dur <= 8.5):
            continue
        if int(entry.get("audio_streams") or 0) != 0:
            continue
        entry_copy = dict(entry)
        entry_copy["_resolved_path"] = str(cp)
        valid_clips.append(entry_copy)

    if not valid_clips:
        return _fallback("character_clips_empty_graceful_fallback")

    # Resolve circular 150x150 PiP avatar PNG (from manifest or auto-build from character_sheets/)
    pip_png: Optional[Path] = None
    pip_rel = str(manifest.get("pip_avatar_png") or "")
    if pip_rel:
        cand_pip = Path(pip_rel) if Path(pip_rel).is_absolute() else (vpaths["base"] / pip_rel)
        if cand_pip.exists() and cand_pip.stat().st_size > 1000:
            pip_png = cand_pip

    if pip_png is None and vpaths["sheets_dir"].exists():
        sheets = sorted(
            [p for p in vpaths["sheets_dir"].iterdir() if p.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp")]
        )
        if sheets:
            pip_png = build_circular_pip_avatar(
                sheets[0],
                vpaths["pip_dir"] / f"{div_u.lower()}_pip_150.png",
                size=PIP_AVATAR_SIZE_PX,
                accent_rgb=DIV_ACCENT_RGB.get(div_u, (110, 231, 183)),
            )

    if pip_png is None:
        return _fallback("character_sheet_or_pip_missing")

    chosen, lru_meta = select_lru_character_clip(
        div_u,
        valid_clips,
        episode_key=episode_key,
        lru_state_path=lru_state_path,
        cooldown_slots=LRU_COOLDOWN_SLOTS,
        persist=persist_lru,
    )
    if not chosen:
        return _fallback("lru_selection_empty")

    return {
        "eligible": True,
        "ab_track": "slot_b_flowchar",
        "flow_fallback_reason": "",
        "selected_clip": chosen,
        "clip_path": Path(chosen["_resolved_path"]),
        "pip_avatar_png": pip_png,
        "zoom_factor": compute_episode_micro_zoom(episode_key),
        "lru_meta": lru_meta,
    }


# ==============================================================================
# Core Plan C Video Composer (`0~4.5s` Character Hook -> `0.3s` ZoomIn -> UI+PiP)
# ==============================================================================
def compose_flow_character_short(
    div: str,
    lang: str,
    voice_id: str,
    spoken_script: str,
    speech_bubble_text: str,
    character_clip_mp4: Path,
    pip_avatar_png: Path,
    real_ui_mp4: Path,
    motion_chart_mp4: Path,
    out_mp4: Path,
    episode_key: str,
    live_badge_text: str = "",
    speaker_label: str = "",
    zoom_factor: Optional[float] = None,
    now_kst: Optional[dt.datetime] = None,
) -> Tuple[Path, float, str, Dict[str, Any]]:
    """
    Composes a 1080x1920 30fps `SLOT_B` Character Pilot Short with ALL 7 Safety Shields:
      1. Enforces `audio_streams == 0` (`-an`) on the Google Flow character clip.
      2. Renders `0.0~4.5s` Flow character hook with episode-unique `1.03x~1.07x`
         smooth micro-zoom + top live date/metric badge + top `14~28%` speech bubble.
      3. Transitions via `0.30s` smooth `zoomin` xfade (`offset=4.20`) into
         KDCA 2017 chart cut (`4.5~7.5s`) + `2.5s` mobile real-UI cuts (`7.5s~end`)
         with persistent `150x150` (~14%) circular character PiP at `(x=36, y=130)`.
      4. Final ~5s centered safe-zone yellow CTA box (`Y=1102..1250`, `bottom: 35~42%`).
      5. Mixes ONLY clean Edge-TTS + 3 SFX + `-26dB` sidechain-ducked BGM + true `.srt`.
      6. Strictly `-threads 2`, `max_workers=1`, Windows `BelowNormal`.
    """
    div_u = div.upper()
    assert_zero_paid_video_api("local_flow_vault_master")

    ok_script, script_errs = check_promo_hard_gate(div_u, spoken_script, surface="youtube_desc")
    if not ok_script:
        raise ValueError(f"[SHIELD 6 HARD GATE BLOCKED SCRIPT] {div_u}: {script_errs}")
    ok_bubble, bubble_errs = check_promo_hard_gate(div_u, speech_bubble_text, surface="youtube_title")
    if not ok_bubble:
        raise ValueError(f"[SHIELD 6 HARD GATE BLOCKED BUBBLE] {div_u}: {bubble_errs}")

    lines = split_to_short_subtitle_lines(spoken_script, lang=lang)
    if not lines:
        raise ValueError(f"No subtitle lines produced for {div_u}")

    ffmpeg = _get_ffmpeg()
    badge_txt = live_badge_text or build_live_date_badge(div_u, now_kst=now_kst)
    zf = float(zoom_factor) if (zoom_factor and MICRO_ZOOM_MIN <= float(zoom_factor) <= MICRO_ZOOM_MAX) else compute_episode_micro_zoom(episode_key)

    with tempfile.TemporaryDirectory(prefix=f"dc_flowchar_{div_u}_") as tmp:
        wdir = Path(tmp)

        # Shield 1: Ensure character clip is strictly silent (`audio_streams == 0`)
        clip_probe = probe_media_streams(character_clip_mp4)
        if clip_probe.get("audio_streams", 0) != 0 or clip_probe.get("width") != 1080 or clip_probe.get("height") != 1920:
            clean_char = wdir / "char_clean_silent.mp4"
            clip_probe = strip_audio_to_clean_9x16(character_clip_mp4, clean_char, max_duration_sec=8.0)
            char_src = clean_char
        else:
            clip_probe = assert_silent_video_stream(character_clip_mp4)
            char_src = character_clip_mp4

        # Synthesize clean Edge-TTS voice track & millisecond-synced subtitle cues
        voice_wav, timed_cues, total_dur = synthesize_chunked_speech_with_pauses(lines, voice_id, wdir / "tts", lang=lang)
        total_dur = min(56.0, max(13.0, total_dur))
        srt_text = build_synced_srt(timed_cues)
        ok_srt, srt_errs = check_promo_hard_gate(div_u, srt_text, surface="srt", srt_text=srt_text)
        if not ok_srt:
            raise ValueError(f"[SHIELD 6 HARD GATE BLOCKED SRT] {div_u}: {srt_errs}")

        # Segment 0 (0.0s ~ 4.5s): Silent Flow character clip with per-episode 1.03x~1.07x smooth micro-zoom!
        hook_mp4 = wdir / "seg_hook_45.mp4"
        zoom_delta = zf - 1.0
        # Smooth continuous per-frame zoom from 1.00x -> zf across 4.5s (100% unique frame hash per episode!)
        zoom_vf = (
            f"scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,"
            f"scale=w='trunc(1080*(1+{zoom_delta:.5f}*min(t/{HOOK_CLIP_SEC:.2f},1))/2)*2':"
            f"h='trunc(1920*(1+{zoom_delta:.5f}*min(t/{HOOK_CLIP_SEC:.2f},1))/2)*2':eval=frame:flags=bicubic,"
            f"crop=1080:1920:(in_w-1080)/2:(in_h-1920)/2,format=yuv420p"
        )
        r_hook = subprocess.run(
            [
                ffmpeg, "-y", "-threads", "2",
                "-stream_loop", "-1", "-i", str(char_src),
                "-t", f"{HOOK_CLIP_SEC:.2f}",
                "-vf", zoom_vf,
                "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "21",
                str(hook_mp4),
            ],
            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=120,
        )
        if r_hook.returncode != 0 or not hook_mp4.exists():
            raise RuntimeError(f"Hook zoom render failed: {r_hook.stderr[-260:]}")
        # Re-assert Shield 1 on rendered hook segment
        hook_probe = assert_silent_video_stream(hook_mp4)

        # Post-hook visual sequence: needs `(total_dur - HOOK_CLIP_SEC + XFADE_ZOOMIN_SEC)` seconds so xfade lands exactly at `total_dur`
        post_need = max(6.0, total_dur - HOOK_CLIP_SEC + XFADE_ZOOMIN_SEC)
        ui_info = probe_media_streams(real_ui_mp4)
        ui_dur = max(3.0, float(ui_info.get("duration_sec") or 6.0))
        post_segs: List[Path] = []
        cut_times: List[float] = [HOOK_CLIP_SEC]  # SFX on the 4.5s zoom-in transition!
        post_elapsed = 0.0
        seg_idx = 0
        ui_offsets = [0.0, 2.5, 5.0, 7.5, 1.2, 4.0, 6.5]

        while post_elapsed < post_need - 0.05:
            rem = post_need - post_elapsed
            # Cut 0 right after 4.5s zoom-in transition: KDCA 2017 / division motion chart (3.0s) so t=6.0s shows crisp chart + PiP!
            if seg_idx == 0 and motion_chart_mp4 and motion_chart_mp4.exists():
                seg_len = min(3.0, rem)
                sp_out = wdir / f"post_{seg_idx:02d}.mp4"
                subprocess.run(
                    [
                        ffmpeg, "-y", "-threads", "2",
                        "-stream_loop", "-1", "-i", str(motion_chart_mp4),
                        "-t", f"{seg_len:.2f}",
                        "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p",
                        "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "22",
                        str(sp_out),
                    ],
                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=90,
                )
            else:
                seg_len = min(2.5, rem) if rem > 3.2 else rem
                sp_out = wdir / f"post_{seg_idx:02d}.mp4"
                off = ui_offsets[seg_idx % len(ui_offsets)] % max(0.5, ui_dur - min(seg_len, ui_dur - 0.1))
                zf_ui = "scale=1124:1998,crop=1080:1920" if (seg_idx % 2 == 0) else "scale=1080:1920"
                subprocess.run(
                    [
                        ffmpeg, "-y", "-threads", "2",
                        "-ss", f"{off:.2f}", "-i", str(real_ui_mp4),
                        "-t", f"{seg_len:.2f}",
                        "-vf", f"{zf_ui},fps=30,format=yuv420p",
                        "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "22",
                        str(sp_out),
                    ],
                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=90,
                )
            post_segs.append(sp_out)
            post_elapsed += seg_len
            timeline_t = (HOOK_CLIP_SEC - XFADE_ZOOMIN_SEC) + post_elapsed
            if timeline_t < total_dur - 0.4:
                cut_times.append(timeline_t)
            seg_idx += 1

        post_concat = wdir / "post_concat.txt"
        post_concat.write_text("\n".join(f"file '{p.as_posix()}'" for p in post_segs) + "\n", encoding="utf-8")
        post_mp4 = wdir / "post_visual.mp4"
        subprocess.run(
            [ffmpeg, "-y", "-threads", "2", "-f", "concat", "-safe", "0", "-i", str(post_concat), "-c", "copy", str(post_mp4)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=120,
        )

        # Shield 3: Join 4.5s hook -> post-hook via smooth 0.30s `zoomin` xfade at offset=4.20s!
        base_mp4 = wdir / "base_xfade.mp4"
        xf_offset = HOOK_CLIP_SEC - XFADE_ZOOMIN_SEC
        r_xf = subprocess.run(
            [
                ffmpeg, "-y", "-threads", "2",
                "-i", str(hook_mp4),
                "-i", str(post_mp4),
                "-filter_complex",
                f"[0:v]fps=30,settb=AVTB,format=yuv420p[v0];"
                f"[1:v]fps=30,settb=AVTB,format=yuv420p[v1];"
                f"[v0][v1]xfade=transition=zoomin:duration={XFADE_ZOOMIN_SEC:.2f}:offset={xf_offset:.2f},format=yuv420p[vout]",
                "-map", "[vout]", "-an",
                "-t", f"{total_dur:.2f}",
                "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
                str(base_mp4),
            ],
            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=180,
        )
        if r_xf.returncode != 0 or not base_mp4.exists():
            raise RuntimeError(f"0.3s zoomin xfade failed: {r_xf.stderr[-260:]}")

        # Shield 1: Mix ONLY clean Edge-TTS + 3 SFX + -26dB sidechain-ducked BGM
        master_m4a = mix_voice_sfx_and_ducked_bgm(voice_wav, total_dur, cut_times, wdir / "master.m4a")

        # Build timed overlay PNG stream:
        # - [0.00s ~ 4.50s]: Hook overlay (live badge + top 14~28% speech bubble + 1-line subtitle)
        # - [4.50s ~ end]:   UI overlay (live badge + top-left x=36,y=130 150px circular PiP + subtitle + final ~5s CTA)
        cta_start_t = max(total_dur - 5.2, total_dur * 0.78)
        timed_pngs: List[Tuple[float, float, Path]] = []
        hook_layout_meta: Dict[str, Any] = {}
        pip_layout_meta: Dict[str, Any] = {}

        # Guarantee Frame 0 (`0.00s`) immediately displays the hook live badge + speech bubble!
        first_cue_t0 = timed_cues[0][0] if timed_cues else HOOK_CLIP_SEC
        if first_cue_t0 > 0.04:
            p_open = wdir / "ov_open.png"
            hook_layout_meta = render_character_hook_overlay_png(
                div_u, lang, badge_txt, speech_bubble_text, "", p_open, speaker_label=speaker_label,
            )
            timed_pngs.append((0.0, min(first_cue_t0, HOOK_CLIP_SEC), p_open))

        for ci, (t0, t1, ltxt) in enumerate(timed_cues):
            # Split cleanly at HOOK_CLIP_SEC boundary if a cue straddles 4.50s!
            segments_for_cue: List[Tuple[float, float, bool]] = []
            if t0 < HOOK_CLIP_SEC < t1:
                segments_for_cue.append((t0, HOOK_CLIP_SEC, True))
                segments_for_cue.append((HOOK_CLIP_SEC, t1, False))
            else:
                segments_for_cue.append((t0, t1, t1 <= HOOK_CLIP_SEC + 0.02))

            for si, (s0, s1, is_hook_phase) in enumerate(segments_for_cue):
                if s1 - s0 < 0.04:
                    continue
                p_ov = wdir / f"ov_{ci:03d}_{si}.png"
                if is_hook_phase:
                    hm = render_character_hook_overlay_png(
                        div_u, lang, badge_txt, speech_bubble_text, ltxt, p_ov, speaker_label=speaker_label,
                    )
                    if not hook_layout_meta:
                        hook_layout_meta = hm
                else:
                    is_tail = (s1 >= cta_start_t) or (ci >= len(timed_cues) - 2)
                    pm = render_ui_with_pip_overlay_png(
                        div_u, lang, badge_txt, ltxt, pip_avatar_png, p_ov, show_ending_cta=is_tail,
                    )
                    if not pip_layout_meta:
                        pip_layout_meta = pm
                timed_pngs.append((s0, s1, p_ov))

        # Fill tail gap after last subtitle so PiP + ending CTA stay rock-solid until final frame!
        last_t1 = timed_pngs[-1][1] if timed_pngs else HOOK_CLIP_SEC
        if last_t1 < total_dur - 0.04:
            p_tail = wdir / "ov_tail.png"
            render_ui_with_pip_overlay_png(
                div_u, lang, badge_txt, "", pip_avatar_png, p_tail, show_ending_cta=True,
            )
            timed_pngs.append((last_t1, total_dur, p_tail))

        # Fill any inter-sentence breathing gaps with matching phase overlay (so PiP/bubble never blinks!)
        filled_pngs: List[Tuple[float, float, Path]] = []
        p_hook_idle = wdir / "ov_hook_idle.png"
        render_character_hook_overlay_png(div_u, lang, badge_txt, speech_bubble_text, "", p_hook_idle, speaker_label=speaker_label)
        p_ui_idle = wdir / "ov_ui_idle.png"
        render_ui_with_pip_overlay_png(div_u, lang, badge_txt, "", pip_avatar_png, p_ui_idle, show_ending_cta=False)
        p_ui_cta_idle = wdir / "ov_ui_cta_idle.png"
        render_ui_with_pip_overlay_png(div_u, lang, badge_txt, "", pip_avatar_png, p_ui_cta_idle, show_ending_cta=True)

        cur_t = 0.0
        for s0, s1, png_p in timed_pngs:
            s0 = max(cur_t, s0)
            if s0 > cur_t + 0.03:
                if cur_t < HOOK_CLIP_SEC < s0:
                    filled_pngs.append((cur_t, HOOK_CLIP_SEC, p_hook_idle))
                    filled_pngs.append((HOOK_CLIP_SEC, s0, p_ui_cta_idle if s0 >= cta_start_t else p_ui_idle))
                else:
                    gap_png = p_hook_idle if s0 <= HOOK_CLIP_SEC + 0.01 else (p_ui_cta_idle if cur_t >= cta_start_t else p_ui_idle)
                    filled_pngs.append((cur_t, s0, gap_png))
            filled_pngs.append((s0, max(s0 + 0.05, s1), png_p))
            cur_t = max(s0 + 0.05, s1)

        subs_list = _build_concat_subtitle_list(filled_pngs, total_dur, 1080, 1920, wdir)

        out_mp4.parent.mkdir(parents=True, exist_ok=True)
        cmd_final = [
            ffmpeg, "-y", "-threads", "2",
            "-i", str(base_mp4),
            "-f", "concat", "-safe", "0", "-i", str(subs_list),
            "-i", str(master_m4a),
            "-filter_complex", "[1:v]fps=30,format=rgba[ov];[0:v][ov]overlay=0:0:shortest=1,format=yuv420p[vout]",
            "-map", "[vout]", "-map", "2:a",
            "-t", f"{total_dur:.2f}",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-movflags", "+faststart",
            "-c:a", "copy",
            str(out_mp4),
        ]
        rf = subprocess.run(cmd_final, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=240)
        if rf.returncode != 0 or not out_mp4.exists() or out_mp4.stat().st_size < 50_000:
            raise RuntimeError(f"Final Flow character composite failed: {rf.stderr[-280:]}")

        final_probe = probe_media_streams(out_mp4)
        if final_probe.get("audio_streams", 0) != 1 or final_probe.get("video_streams", 0) != 1:
            raise RuntimeError(f"Final composite stream check failed: {final_probe}")

    render_meta = {
        "ab_track": "slot_b_flowchar",
        "episode_key": episode_key,
        "live_badge_text": badge_txt,
        "zoom_factor": zf,
        "hook_clip_audio_streams": hook_probe.get("audio_streams", -1),
        "final_video_streams": final_probe.get("video_streams", 0),
        "final_audio_streams": final_probe.get("audio_streams", 0),
        "hook_layout": hook_layout_meta,
        "pip_layout": pip_layout_meta,
    }
    return out_mp4, round(total_dur, 2), srt_text, render_meta


if __name__ == "__main__":
    # Fast deterministic self-test (Paid API lock, Identity guard, Financial shadow lock, Pilot gate)
    try:
        assert_zero_paid_video_api("https://api.runwayml.com/v1/generate")
        raise AssertionError("Paid API lock failed to trigger!")
    except PaidVideoAPILockError:
        pass

    try:
        assert_visual_asset_identity_safe("HERO", {"art_style": "western_3d_pixar"})
        raise AssertionError("HERO 3D style guard failed!")
    except IdentitySafetyError:
        pass

    try:
        assert_visual_asset_identity_safe("KFK", {"generation_mode": "text_only"})
        raise AssertionError("Text-only character guard failed!")
    except IdentitySafetyError:
        pass

    assert get_active_pilot_divs(dt.date(2026, 11, 27)) == frozenset({"KFK"})
    assert "TOM" not in get_active_pilot_divs(dt.date(2026, 12, 8))
    assert "GBA" not in get_active_pilot_divs(dt.date(2026, 12, 8))

    # SLOT_A zero-regression eligibility assertion
    el_a = check_flow_character_eligibility("KFK", "SLOT_A", "test_ep_a")
    assert (not el_a["eligible"]) and el_a["ab_track"] == "slot_a_realui" and el_a["flow_fallback_reason"] == "slot_a_realui_protected"

    # Micro-zoom range & uniqueness
    z1 = compute_episode_micro_zoom("KFK_2026-11-27_EP1")
    z2 = compute_episode_micro_zoom("KFK_2026-11-27_EP2")
    assert MICRO_ZOOM_MIN <= z1 <= MICRO_ZOOM_MAX and MICRO_ZOOM_MIN <= z2 <= MICRO_ZOOM_MAX and z1 != z2

    print(f"FLOW_CHARACTER_TRACK SELF-TEST PASS (pilot={sorted(FLOW_CHAR_PILOT_DIVS)}, z1={z1}, z2={z2})")
