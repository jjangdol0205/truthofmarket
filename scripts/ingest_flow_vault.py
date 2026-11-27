#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/ingest_flow_vault.py
================================================================================
Dream Company — Google Flow Character Vault Auto-Validator & Ingest CLI (Plan C)

One-command ingestion for Google Flow Web Studio assets dropped into:
  - `flow_vault/{div_id}/character_sheets/`  (PNG/JPG master character sheets)
  - `flow_vault/{div_id}/character_clips/`   (MP4/MOV 9:16 3.5~8.0s silent motion clips)

What it verifies and produces automatically:
  1. Validates every clip: 9:16 vertical aspect (`height > width`), duration
     `3.5s ~ 8.0s`, AND blank-frame check (samples 3 frames across 15%/50%/85%
     and rejects monochrome/black/white blank renders!).
  2. Strips original audio (`-an`) and transcodes clean `1080x1920 30fps H.264`
     (`-threads 2`, Windows `BelowNormal`), immediately asserting `audio_streams == 0`
     via `ffprobe` / `ffmpeg -i` (Shield 1).
  3. Auto-crops a crisp `150x150` (~14% width) circular RGBA PiP avatar PNG from
     the primary master character sheet into `character_pip/{div}_pip_150.png` (Shield 3).
  4. Enforces Div 4 HERO Korean 2D art-style guard & `$0` paid API lock (Shield 6).
  5. Writes/updates `flow_vault/{div_id}/character_manifest.json` cleanly.
  6. Optional `--sync-r2` uploads verified silent clips + PiP PNG + manifest to
     Cloudflare R2 (`dreamcompany-flow-vault`) for unattended GitHub Actions cloud runs.

Usage:
  python scripts/ingest_flow_vault.py --div KFK
  python scripts/ingest_flow_vault.py --div KFK --sync-r2
================================================================================
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
from PIL import Image

if sys.platform == "win32":
    try:
        import ctypes
        ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x00004000)
    except Exception:
        pass

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "cloud_automation"))

from flow_character_track import (  # noqa: E402
    DEFAULT_VAULT_ROOT,
    DIV_VAULT_DIR_MAP,
    PIP_AVATAR_SIZE_PX,
    assert_silent_video_stream,
    assert_visual_asset_identity_safe,
    assert_zero_paid_video_api,
    build_circular_pip_avatar,
    get_div_vault_paths,
    probe_media_streams,
    strip_audio_to_clean_9x16,
)
from promo_hard_gate import DIV_ACCENT_RGB  # noqa: E402
from zero_ai_video_composer import _get_ffmpeg  # noqa: E402

KST = dt.timezone(dt.timedelta(hours=9))
MIN_CLIP_SEC = 3.5
MAX_CLIP_SEC = 8.0
VIDEO_EXTS = {".mp4", ".mov", ".m4v", ".webm"}
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}


def _sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def check_zero_blank_frames(mp4_path: Path, duration_sec: float) -> Tuple[bool, List[float]]:
    """
    Samples 3 frames (15%, 50%, 85% of clip duration) and verifies every sampled
    frame has meaningful visual variance (std >= 8.0, not pure black/white blank).
    """
    ffmpeg = _get_ffmpeg()
    sample_ts = [max(0.2, duration_sec * f) for f in (0.15, 0.50, 0.85)]
    stds: List[float] = []
    with tempfile.TemporaryDirectory(prefix="dc_blankchk_") as tmp:
        for idx, ts in enumerate(sample_ts):
            frame_jpg = Path(tmp) / f"f_{idx}.jpg"
            r = subprocess.run(
                [ffmpeg, "-y", "-threads", "2", "-ss", f"{ts:.2f}", "-i", str(mp4_path), "-frames:v", "1", "-q:v", "4", str(frame_jpg)],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=30,
            )
            if r.returncode != 0 or not frame_jpg.exists():
                return False, stds
            arr = np.asarray(Image.open(frame_jpg).convert("RGB"), dtype=np.float32)
            std_val = float(np.std(arr))
            mean_val = float(np.mean(arr))
            stds.append(round(std_val, 2))
            if std_val < 8.0 or mean_val < 4.0 or mean_val > 251.0:
                return False, stds
    return True, stds


def _upload_to_r2(local_path: Path, r2_key: str, content_type: str) -> Dict[str, Any]:
    acct = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
    tok = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
    bucket = os.getenv("R2_VAULT_BUCKET", "dreamcompany-flow-vault").strip()
    if not (acct and tok):
        return {"ok": False, "skipped": "missing_cloudflare_r2_credentials"}
    safe_key = re.sub(r"[^A-Za-z0-9._/-]", "_", r2_key)
    url = f"https://api.cloudflare.com/client/v4/accounts/{acct}/r2/buckets/{bucket}/objects/{safe_key}"
    req = urllib.request.Request(
        url,
        data=local_path.read_bytes(),
        method="PUT",
        headers={
            "Authorization": f"Bearer {tok}",
            "Content-Type": content_type,
            "User-Agent": "DreamCompany-FlowIngest/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            return {"ok": resp.status in (200, 201), "status": resp.status, "bucket": bucket, "r2_key": safe_key}
    except Exception as exc:
        return {"ok": False, "error": str(exc)[:200], "r2_key": safe_key}


def ingest_division_vault(
    div: str,
    vault_root: Path = DEFAULT_VAULT_ROOT,
    sync_r2: bool = False,
    art_style: str = "",
) -> Dict[str, Any]:
    div_u = div.upper()
    if div_u not in DIV_VAULT_DIR_MAP:
        raise ValueError(f"Unsupported division: {div_u} (expected one of {sorted(DIV_VAULT_DIR_MAP)})")

    assert_zero_paid_video_api("google_flow_web_studio_manual_export")
    vpaths = get_div_vault_paths(div_u, vault_root=vault_root)
    sheets_dir = vpaths["sheets_dir"]
    clips_dir = vpaths["clips_dir"]
    pip_dir = vpaths["pip_dir"]
    clean_dir = vpaths["base"] / "character_clips_clean"

    for d in (sheets_dir, clips_dir, pip_dir):
        d.mkdir(parents=True, exist_ok=True)

    resolved_style = art_style.strip().lower() or ("korean_2d_illustration" if div_u == "HERO" else "stylized_original_character")
    assert_visual_asset_identity_safe(div_u, {"art_style": resolved_style, "generation_mode": "anchored_character_sheet"})

    # 1. Scan & register master character sheets + auto-crop 150x150 circular PiP PNG
    sheet_files = sorted([p for p in sheets_dir.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTS])
    sheets_meta: List[Dict[str, Any]] = []
    pip_avatar_path: Optional[Path] = None

    for idx, sp in enumerate(sheet_files):
        with Image.open(sp) as im:
            sw, sh = im.size
        sheet_rec = {
            "sheet_id": sp.stem,
            "filename": sp.name,
            "rel_path": f"character_sheets/{sp.name}",
            "width": sw,
            "height": sh,
            "sha256": _sha256_file(sp),
            "is_primary": idx == 0,
        }
        sheets_meta.append(sheet_rec)

    if sheet_files:
        pip_avatar_path = build_circular_pip_avatar(
            sheet_files[0],
            pip_dir / f"{div_u.lower()}_pip_{PIP_AVATAR_SIZE_PX}.png",
            size=PIP_AVATAR_SIZE_PX,
            accent_rgb=DIV_ACCENT_RGB.get(div_u, (110, 231, 183)),
        )

    # 2. Validate & transcode silent (`-an`) 1080x1920 30fps clips
    raw_clips = sorted([p for p in clips_dir.iterdir() if p.is_file() and p.suffix.lower() in VIDEO_EXTS])
    accepted: List[Dict[str, Any]] = []
    rejected: List[Dict[str, Any]] = []
    r2_results: List[Dict[str, Any]] = []

    for cp in raw_clips:
        stem_clean = re.sub(r"[^A-Za-z0-9_-]", "_", cp.stem).strip("_") or f"clip_{len(accepted) + 1:02d}"
        probe = probe_media_streams(cp)
        w, h, dur = int(probe.get("width") or 0), int(probe.get("height") or 0), float(probe.get("duration_sec") or 0.0)

        reasons: List[str] = []
        if int(probe.get("video_streams") or 0) < 1:
            reasons.append("no_video_stream")
        if not (w > 0 and h > w):
            reasons.append(f"not_9x16_vertical({w}x{h})")
        else:
            ratio = w / float(h)
            if not (0.48 <= ratio <= 0.65):
                reasons.append(f"aspect_ratio_out_of_9x16({w}x{h},r={ratio:.3f})")
        if not (MIN_CLIP_SEC <= dur <= MAX_CLIP_SEC):
            reasons.append(f"duration_out_of_range({dur:.2f}s,expected={MIN_CLIP_SEC}~{MAX_CLIP_SEC}s)")

        blank_stds: List[float] = []
        if not reasons:
            ok_blank, blank_stds = check_zero_blank_frames(cp, dur)
            if not ok_blank:
                reasons.append(f"blank_or_monochrome_frame_detected(stds={blank_stds})")

        if reasons:
            rejected.append({"filename": cp.name, "reasons": reasons})
            continue

        clean_dir.mkdir(parents=True, exist_ok=True)
        clean_mp4 = clean_dir / f"{div_u.lower()}_{stem_clean}_silent.mp4"
        clean_probe = strip_audio_to_clean_9x16(cp, clean_mp4, max_duration_sec=MAX_CLIP_SEC)
        assert_silent_video_stream(clean_mp4)

        r2_key = f"flow_character_vault/{DIV_VAULT_DIR_MAP[div_u]}/clips/{clean_mp4.name}"
        if sync_r2:
            r2_results.append(_upload_to_r2(clean_mp4, r2_key, "video/mp4"))

        accepted.append({
            "clip_id": f"{div_u}_{stem_clean}",
            "source_filename": cp.name,
            "local_path": f"character_clips/{cp.name}",
            "clean_clip_path": f"character_clips_clean/{clean_mp4.name}",
            "r2_key": r2_key,
            "aspect_ratio": "9:16",
            "width": clean_probe["width"],
            "height": clean_probe["height"],
            "duration_sec": clean_probe["duration_sec"],
            "audio_streams": clean_probe["audio_streams"],
            "source_audio_streams_stripped": int(probe.get("audio_streams") or 0),
            "frame_stds": blank_stds,
            "art_style": resolved_style,
            "generation_mode": "anchored_character_sheet",
            "tags": ["google_flow_web_studio", "silent_verified"],
            "sha256": _sha256_file(clean_mp4),
        })

    pip_r2_key = f"flow_character_vault/{DIV_VAULT_DIR_MAP[div_u]}/pip/{pip_avatar_path.name}" if pip_avatar_path else ""
    if sync_r2 and pip_avatar_path and pip_avatar_path.exists():
        r2_results.append(_upload_to_r2(pip_avatar_path, pip_r2_key, "image/png"))

    manifest_obj = {
        "schema_version": "flow-character-manifest-v1",
        "division": div_u,
        "vault_dir": DIV_VAULT_DIR_MAP[div_u],
        "art_style": resolved_style,
        "updated_at_kst": dt.datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST"),
        "pip_avatar_png": f"character_pip/{pip_avatar_path.name}" if pip_avatar_path else "",
        "pip_avatar_r2_key": pip_r2_key,
        "sheets": sheets_meta,
        "clips": accepted,
        "rejected": rejected,
    }
    vpaths["manifest_path"].write_text(json.dumps(manifest_obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if sync_r2:
        mf_key = f"flow_character_vault/{DIV_VAULT_DIR_MAP[div_u]}/character_manifest.json"
        r2_results.append(_upload_to_r2(vpaths["manifest_path"], mf_key, "application/json"))

    return {
        "ok": True,
        "division": div_u,
        "vault_base": str(vpaths["base"]),
        "manifest_path": str(vpaths["manifest_path"]),
        "sheets_count": len(sheets_meta),
        "pip_avatar_png": str(pip_avatar_path) if pip_avatar_path else "",
        "accepted_clips": len(accepted),
        "rejected_clips": len(rejected),
        "rejected_details": rejected,
        "r2_sync_count": len(r2_results),
        "r2_results": r2_results,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Dream Company Google Flow Character Vault Auto-Validator & Ingest CLI")
    parser.add_argument("--div", required=True, choices=["TOM", "KFG", "GBA", "HERO", "KFK"], help="Target division code")
    parser.add_argument("--vault-root", type=str, default=str(DEFAULT_VAULT_ROOT), help="Root path to flow_vault/")
    parser.add_argument("--sync-r2", action="store_true", help="Upload clean silent clips + PiP PNG + manifest to Cloudflare R2")
    parser.add_argument("--art-style", type=str, default="", help="Optional art style tag (HERO enforces korean_2d_illustration)")
    args = parser.parse_args()

    res = ingest_division_vault(
        div=args.div,
        vault_root=Path(args.vault_root),
        sync_r2=args.sync_r2,
        art_style=args.art_style,
    )
    print(json.dumps(res, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
