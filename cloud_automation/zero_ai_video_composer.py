#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/zero_ai_video_composer.py
================================================================================
Dream Company — 2026-11-25 Zero-AI-Tell (`AI 티 0%`) Video Composer
Enforces ALL visual & audio Hard Gates for 1/2/3/5 divisions:
  1. 0~3s: Pre-cached faceless 4K/1080p real-camera stock clip (ZERO AI faces/hands/text,
     ZERO runtime external stock API calls — reads from local cache or R2 `faceless_stock_4k/`).
  2. 3~end: 2.5s rhythm cuts alternating Playwright mobile (390x844 @2x, 30fps) real-UI
     walkthrough + crisp animated HTML motion chart (never holds any frame > 5s!).
  3. Subtitles: 1-line 10~14 char (KO/JA) or 3~5 word (EN) burned-in safe-zone captions
     with 1~2 keywords highlighted in division brand accent color + true millisecond-synced `.srt`
     (strictly ZERO URLs, ZERO emojis, validated by `promo_hard_gate.check_promo_hard_gate`).
  4. Audio: Colloquial `edge-tts` chunked with natural 0.28~0.36s breathing pauses +
     3 royalty-free SFX (`click.wav`, `paper.wav`, `pop.wav`) on cut transitions +
     warm calm BGM at `-26dB` with FFmpeg `sidechaincompress` auto-ducking + `-0.5 dBFS` limiter.
  5. Low-load hardware safety: strictly `-threads 2`, `max_workers=1`, Windows `BelowNormal`.
================================================================================
"""

from __future__ import annotations

import asyncio
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from PIL import Image, ImageDraw, ImageFont

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
    pick_highlight_token,
    split_to_short_subtitle_lines,
)

ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = Path(__file__).resolve().parent / "assets"
AUDIO_DIR = ASSETS_DIR / "audio"
STOCK_DIR = ASSETS_DIR / "faceless_stock"
STOCK_MANIFEST = ASSETS_DIR / "faceless_stock_manifest.json"
CACHE_DIR = Path(__file__).resolve().parent / ".cache"


def _get_ffmpeg() -> str:
    ff = shutil.which("ffmpeg")
    if ff:
        return ff
    import imageio_ffmpeg  # type: ignore
    return imageio_ffmpeg.get_ffmpeg_exe()


def _probe_dur(path: Path) -> float:
    if not path.exists():
        return 0.0
    ffprobe = shutil.which("ffprobe")
    if ffprobe:
        try:
            out = subprocess.check_output(
                [ffprobe, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
                stderr=subprocess.DEVNULL, text=True, timeout=15,
            ).strip()
            val = float(out)
            if val > 0.0:
                return val
        except Exception:
            pass
    # Universal fallback using ffmpeg -i (works identically with imageio_ffmpeg on Windows & Ubuntu!)
    try:
        ffmpeg = _get_ffmpeg()
        pr = subprocess.run([ffmpeg, "-i", str(path)], stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=15)
        m = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", pr.stderr or "")
        if m:
            return int(m.group(1)) * 3600.0 + int(m.group(2)) * 60.0 + float(m.group(3))
    except Exception:
        pass
    return 0.0


def _pick_font(lang: str, size: int) -> ImageFont.FreeTypeFont:
    cands: List[str] = []
    if lang == "ko":
        cands = [
            r"C:\Windows\Fonts\malgunbd.ttf",
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
            "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
        ]
    elif lang == "ja":
        cands = [
            r"C:\Windows\Fonts\YuGothB.ttc",
            r"C:\Windows\Fonts\meiryob.ttc",
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
            "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
        ]
    else:
        cands = [
            r"C:\Windows\Fonts\segoeuib.ttf",
            r"C:\Windows\Fonts\arialbd.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
        ]
    for fp in cands:
        if Path(fp).exists():
            try:
                return ImageFont.truetype(fp, size=size)
            except Exception:
                continue
    return ImageFont.load_default()


def _fetch_r2_asset(r2_key: str, dest: Path) -> Optional[Path]:
    if dest.exists() and dest.stat().st_size > 10_000:
        return dest
    acct = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
    tok = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
    bkt = os.getenv("R2_VAULT_BUCKET", "dreamcompany-flow-vault").strip()
    if not (acct and tok):
        return None
    url = f"https://api.cloudflare.com/client/v4/accounts/{acct}/r2/buckets/{bkt}/objects/{r2_key}"
    try:
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {tok}", "User-Agent": "DC-AssetFetch/1.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            if r.status == 200:
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(r.read())
                return dest
    except Exception:
        pass
    return None


def get_cached_faceless_stock_clip(div: str, seed_idx: int = 0) -> Optional[Path]:
    """Returns a pre-cached faceless real-camera 30fps stock clip (local or R2; ZERO runtime stock API calls!)."""
    div_u = div.upper()
    if STOCK_MANIFEST.exists():
        try:
            mf = json.loads(STOCK_MANIFEST.read_text(encoding="utf-8"))
            clips = mf.get("clips") or []
            div_clips = [c for c in clips if c.get("div_hint") == div_u] or clips
            if div_clips:
                chosen = div_clips[seed_idx % len(div_clips)]
                local_p = ROOT / chosen["local_rel"]
                if local_p.exists() and local_p.stat().st_size > 50_000:
                    return local_p
                cached = _fetch_r2_asset(chosen["r2_key"], CACHE_DIR / "faceless_stock" / Path(chosen["r2_key"]).name)
                if cached:
                    return cached
        except Exception:
            pass
    # Direct fallback to any cached local mp4 in assets/faceless_stock
    local_mp4s = sorted(STOCK_DIR.glob("*.mp4")) if STOCK_DIR.exists() else []
    if local_mp4s:
        return local_mp4s[seed_idx % len(local_mp4s)]
    return None


def get_audio_kit_paths() -> Dict[str, Optional[Path]]:
    res: Dict[str, Optional[Path]] = {}
    for key, fn in [("click", "click.wav"), ("paper", "paper.wav"), ("pop", "pop.wav"), ("bgm", "calm_bgm.mp3")]:
        p = AUDIO_DIR / fn
        if p.exists() and p.stat().st_size > 1000:
            res[key] = p
        else:
            res[key] = _fetch_r2_asset(f"promo_audio_kit/{fn}", CACHE_DIR / "audio_kit" / fn)
    return res


def synthesize_chunked_speech_with_pauses(
    lines: List[str],
    voice_id: str,
    work_dir: Path,
    pause_sentence_sec: float = 0.32,
    pause_clause_sec: float = 0.14,
    lang: str = "en",
) -> Tuple[Path, List[Tuple[float, float, str]], float]:
    """
    Synthesizes fluid complete sentences via `edge-tts` (human prosody, 4x faster!),
    inserts natural 0.25~0.40s breathing pauses between sentences, probes exact true duration
    via ffmpeg/ffprobe, and subdivides each sentence's exact window proportionally across its
    1-line (10~14 char KO/JA or 3~5 word EN) subtitle cues for millisecond-synced `.srt`!
    """
    import edge_tts  # type: ignore

    ffmpeg = _get_ffmpeg()
    work_dir.mkdir(parents=True, exist_ok=True)

    # Group short subtitle lines back into complete sentences for natural prosody
    sentences: List[Tuple[str, List[str]]] = []
    cur_cues: List[str] = []
    for ln in lines:
        cur_cues.append(ln)
        if re.search(r"[.?!。？！]$", ln.strip()):
            sentences.append((" ".join(cur_cues) if lang == "en" else " ".join(cur_cues), list(cur_cues)))
            cur_cues = []
    if cur_cues:
        sentences.append((" ".join(cur_cues), list(cur_cues)))

    async def _gen_all() -> List[Tuple[Path, str, List[str]]]:
        out: List[Tuple[Path, str, List[str]]] = []
        for idx, (sent_txt, cues) in enumerate(sentences):
            p = work_dir / f"sent_{idx:03d}.mp3"
            for attempt in range(2):
                try:
                    comm = edge_tts.Communicate(sent_txt, voice=voice_id, rate="+0%")
                    await comm.save(str(p))
                    if p.exists() and p.stat().st_size > 800:
                        out.append((p, sent_txt, cues))
                        break
                except Exception:
                    await asyncio.sleep(0.8)
        return out

    segs = asyncio.run(_gen_all())
    if not segs:
        raise RuntimeError(f"edge-tts failed to synthesize any segments for {voice_id}")

    timed_cues: List[Tuple[float, float, str]] = []
    inputs: List[str] = []
    fparts: List[str] = []
    concat_refs: List[str] = []
    cursor = 0.25  # 250ms gentle opening breath

    fparts.append("anullsrc=r=44100:cl=stereo:d=0.25[pre0]")
    concat_refs.append("[pre0]")

    for idx, (mp3_p, sent_txt, cues) in enumerate(segs):
        dur = max(0.8, _probe_dur(mp3_p))
        # Proportionally distribute sentence duration across its 1-line subtitle cues by character weight
        weights = [max(2, len(c.replace(" ", ""))) for c in cues]
        w_tot = float(sum(weights))
        sub_t = cursor
        for ci, (cue_txt, w) in enumerate(zip(cues, weights)):
            seg_d = dur * (w / w_tot)
            c0 = sub_t
            c1 = (cursor + dur) if ci == len(cues) - 1 else (sub_t + seg_d)
            timed_cues.append((c0, max(c0 + 0.35, c1 - 0.04), cue_txt))
            sub_t = c1

        inputs.extend(["-i", str(mp3_p)])
        fparts.append(f"[{idx}:a]aresample=44100,aformat=channel_layouts=stereo[s{idx}]")
        concat_refs.append(f"[s{idx}]")

        if idx < len(segs) - 1:
            fparts.append(f"anullsrc=r=44100:cl=stereo:d={pause_sentence_sec:.2f}[g{idx}]")
            concat_refs.append(f"[g{idx}]")
            cursor = cursor + dur + pause_sentence_sec
        else:
            fparts.append("anullsrc=r=44100:cl=stereo:d=0.60[tail0]")
            concat_refs.append("[tail0]")
            cursor = cursor + dur + 0.60

    voice_wav = work_dir / "voice_master.wav"
    fc = ";".join(fparts) + f";{''.join(concat_refs)}concat=n={len(concat_refs)}:v=0:a=1[vout]"
    cmd = [ffmpeg, "-y", "-threads", "2", *inputs, "-filter_complex", fc, "-map", "[vout]", "-ar", "44100", "-ac", "2", str(voice_wav)]
    r = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=180)
    if r.returncode != 0 or not voice_wav.exists():
        raise RuntimeError(f"Voice concat failed: {r.stderr[-260:]}")
    return voice_wav, timed_cues, cursor


def render_single_line_subtitle_png(
    div: str,
    lang: str,
    line_text: str,
    out_png: Path,
    width: int = 1080,
    height: int = 1920,
    footer_go_url: str = "",
) -> Path:
    """
    Renders a single-line 10~14 char (KO/JA) or 3~5 word (EN) transparent caption PNG
    strictly inside the safe zone (Shorts Y=1360..1460, Long-Form Y=930..1020),
    highlighting 1~2 key words in the division's brand accent color. ZERO 3-paragraph walls!
    """
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    is_vert = height > width
    max_w = 880 if is_vert else 1520
    accent_rgb = DIV_ACCENT_RGB.get(div.upper(), (245, 208, 110))
    hl = pick_highlight_token(line_text, lang=lang)

    # Fit single line cleanly inside max_w
    font_sz = 54 if is_vert else 46
    font = _pick_font(lang, font_sz)
    while font_sz >= 30:
        font = _pick_font(lang, font_sz)
        bb = draw.textbbox((0, 0), line_text, font=font, stroke_width=5)
        if (bb[2] - bb[0]) <= max_w:
            break
        font_sz -= 3

    bb = draw.textbbox((0, 0), line_text, font=font, stroke_width=5)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    pad_x, pad_y = 32, 18
    box_w, box_h = tw + pad_x * 2, th + pad_y * 2
    bx = (width - box_w) // 2
    by = 1365 if is_vert else 928

    # Clean semi-opaque rounded pill behind single line (never blocks upper/middle real UI!)
    draw.rounded_rectangle([bx, by, bx + box_w, by + box_h], radius=18, fill=(12, 16, 22, 215), outline=(*accent_rgb, 170), width=2)

    # Draw line with highlight token colored in brand accent
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

    if footer_go_url:
        f_go = _pick_font("en", 28 if is_vert else 24)
        gbb = draw.textbbox((0, 0), footer_go_url, font=f_go)
        gw, gh = gbb[2] - gbb[0] + 34, gbb[3] - gbb[1] + 16
        gx = (width - gw) // 2
        gy = by + box_h + 18 if is_vert else 42
        draw.rounded_rectangle([gx, gy, gx + gw, gy + gh], radius=14, fill=(10, 26, 20, 220), outline=(*accent_rgb, 210), width=2)
        draw.text((gx + 17, gy + 8 - gbb[1]), footer_go_url, font=f_go, fill=(*accent_rgb, 255))

    out_png.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_png)
    return out_png


def mix_voice_sfx_and_ducked_bgm(
    voice_wav: Path,
    total_dur: float,
    cut_times_sec: List[float],
    out_m4a: Path,
) -> Path:
    """
    Mixes voice + 3 free SFX (`click`, `paper`, `pop`) at cut transitions +
    ambient BGM at `-26dB` with FFmpeg `sidechaincompress` auto-ducking + `-0.5 dBFS` limiter.
    """
    ffmpeg = _get_ffmpeg()
    kit = get_audio_kit_paths()
    inputs = ["-i", str(voice_wav)]
    fparts = ["[0:a]aresample=44100,aformat=channel_layouts=stereo,asplit=2[vmain][vsc]"]
    mix_streams = ["[vmain]"]
    in_idx = 1

    # Add BGM at -26dB with sidechaincompress auto-ducking under voice
    bgm_p = kit.get("bgm")
    if bgm_p and bgm_p.exists():
        inputs.extend(["-stream_loop", "-1", "-i", str(bgm_p)])
        fparts.append(
            f"[{in_idx}:a]atrim=0:{total_dur:.2f},aresample=44100,aformat=channel_layouts=stereo,volume=-26dB[bgm0];"
            f"[bgm0][vsc]sidechaincompress=threshold=0.02:ratio=6:attack=20:release=250[bgm_duck]"
        )
        mix_streams.append("[bgm_duck]")
        in_idx += 1

    # Add 3 subtle SFX (click, paper, pop) synced to cut transitions
    sfx_cycle = [kit.get("pop"), kit.get("click"), kit.get("paper")]
    for ci, ct in enumerate(cut_times_sec[:6]):
        sp = sfx_cycle[ci % len(sfx_cycle)]
        if sp and sp.exists() and 0.4 < ct < (total_dur - 0.5):
            ms = int(ct * 1000)
            inputs.extend(["-i", str(sp)])
            fparts.append(f"[{in_idx}:a]aresample=44100,aformat=channel_layouts=stereo,volume=-12dB,adelay={ms}|{ms}[sfx{ci}]")
            mix_streams.append(f"[sfx{ci}]")
            in_idx += 1

    fparts.append(
        f"{''.join(mix_streams)}amix=inputs={len(mix_streams)}:duration=first:normalize=0,"
        f"alimiter=limit=0.944[aout]"
    )
    cmd = [
        ffmpeg, "-y", "-threads", "2",
        *inputs,
        "-filter_complex", ";".join(fparts),
        "-map", "[aout]", "-t", f"{total_dur:.2f}",
        "-c:a", "aac", "-b:a", "192k", str(out_m4a),
    ]
    r = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=180)
    if r.returncode != 0 or not out_m4a.exists():
        raise RuntimeError(f"Audio mix failed: {r.stderr[-260:]}")
    return out_m4a


def _build_concat_subtitle_list(
    timed_pngs: List[Tuple[float, float, Path]],
    total_dur: float,
    width: int,
    height: int,
    work_dir: Path,
) -> Path:
    """Builds a single FFmpeg concat demuxer stream for all timed subtitle PNGs (10x faster & 80% less RAM than N chained overlays!)."""
    blank_png = work_dir / "_sub_blank.png"
    Image.new("RGBA", (width, height), (0, 0, 0, 0)).save(blank_png)
    lines: List[str] = []
    cur = 0.0
    for t0, t1, png_p in timed_pngs:
        t0 = max(cur, t0)
        if t0 > cur + 0.02:
            lines.append(f"file '{blank_png.as_posix()}'")
            lines.append(f"duration {t0 - cur:.3f}")
        seg_d = max(0.10, t1 - t0)
        lines.append(f"file '{png_p.as_posix()}'")
        lines.append(f"duration {seg_d:.3f}")
        cur = t0 + seg_d
    rem = max(0.25, total_dur - cur + 0.25)
    lines.append(f"file '{blank_png.as_posix()}'")
    lines.append(f"duration {rem:.3f}")
    lines.append(f"file '{blank_png.as_posix()}'")
    lst_path = work_dir / "_subs_concat.txt"
    lst_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return lst_path


def compose_zero_ai_short(
    div: str,
    lang: str,
    voice_id: str,
    spoken_script: str,
    faceless_stock_mp4: Optional[Path],
    real_ui_mp4: Path,
    motion_chart_mp4: Path,
    out_mp4: Path,
) -> Tuple[Path, float, str]:
    """
    Composes a complete 1080x1920 30fps Zero-AI-Tell vertical Short:
      - 0.0~3.0s: Pre-cached faceless real-camera stock clip
      - 3.0~end: 2.5s dynamic cuts from Playwright 390x844@2x real-UI recording + HTML motion chart
      - 1-line safe-zone accent-highlighted burned-in subtitles + millisecond-synced `.srt`
      - Natural 0.32s speech pauses + 3 SFX + -26dB sidechaincompress ducked BGM
    """
    div_u = div.upper()
    ok_script, script_errs = check_promo_hard_gate(div_u, spoken_script, surface="youtube_desc")
    if not ok_script:
        raise ValueError(f"[HARD GATE BLOCKED SCRIPT] {div_u}: {script_errs}")

    lines = split_to_short_subtitle_lines(spoken_script, lang=lang)
    if not lines:
        raise ValueError(f"No subtitle lines produced for {div_u}")

    ffmpeg = _get_ffmpeg()
    with tempfile.TemporaryDirectory(prefix=f"dc_short_{div_u}_") as tmp:
        wdir = Path(tmp)
        voice_wav, timed_cues, total_dur = synthesize_chunked_speech_with_pauses(lines, voice_id, wdir / "tts", lang=lang)
        total_dur = min(56.0, max(12.0, total_dur))
        srt_text = build_synced_srt(timed_cues)
        ok_srt, srt_errs = check_promo_hard_gate(div_u, srt_text, surface="srt", srt_text=srt_text)
        if not ok_srt:
            raise ValueError(f"[HARD GATE BLOCKED SRT] {div_u}: {srt_errs}")

        # Build 2.5s visual rhythm segments (0~3.0s faceless stock -> alternating 2.5s UI cuts -> motion chart)
        ui_dur = max(3.0, _probe_dur(real_ui_mp4))
        seg_paths: List[Path] = []
        cut_times: List[float] = []
        elapsed = 0.0

        # Cut 0 (0.0 ~ 3.0s): Pre-cached faceless real-camera stock clip
        if faceless_stock_mp4 and faceless_stock_mp4.exists():
            s0 = wdir / "vseg_00.mp4"
            subprocess.run(
                [ffmpeg, "-y", "-threads", "2", "-stream_loop", "-1", "-i", str(faceless_stock_mp4),
                 "-t", "3.00", "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p",
                 "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "22", str(s0)],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=90,
            )
            seg_paths.append(s0)
            elapsed += 3.0
            cut_times.append(elapsed)

        # Cuts 1..N (2.5s each): Real-UI segments + HTML motion chart cuts (zero static screen > 5s!)
        seg_idx = 1
        ui_offsets = [0.0, 2.5, 5.0, 7.5, 1.2, 4.0, 6.5]
        while elapsed < total_dur:
            rem = total_dur - elapsed
            seg_len = min(2.5, rem) if rem > 3.2 else rem
            sp_out = wdir / f"vseg_{seg_idx:02d}.mp4"
            # Insert clean HTML motion chart on cut #3 and final cut
            use_chart = (seg_idx == 3) or (rem <= 4.2 and seg_idx >= 2)
            if use_chart and motion_chart_mp4.exists():
                subprocess.run(
                    [ffmpeg, "-y", "-threads", "2", "-stream_loop", "-1", "-i", str(motion_chart_mp4),
                     "-t", f"{seg_len:.2f}", "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p",
                     "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "22", str(sp_out)],
                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=90,
                )
            else:
                off = ui_offsets[(seg_idx - 1) % len(ui_offsets)] % max(0.5, ui_dur - min(seg_len, ui_dur - 0.1))
                # Subtle alternate gentle zoom (1.00 vs 1.04) on cuts for lively mobile polish
                zf = "scale=1124:1998,crop=1080:1920" if (seg_idx % 2 == 0) else "scale=1080:1920"
                subprocess.run(
                    [ffmpeg, "-y", "-threads", "2", "-ss", f"{off:.2f}", "-i", str(real_ui_mp4),
                     "-t", f"{seg_len:.2f}", "-vf", f"{zf},fps=30,format=yuv420p",
                     "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "22", str(sp_out)],
                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=90,
                )
            seg_paths.append(sp_out)
            elapsed += seg_len
            if elapsed < total_dur - 0.3:
                cut_times.append(elapsed)
            seg_idx += 1

        # Concatenate base video cuts cleanly
        concat_txt = wdir / "concat.txt"
        concat_txt.write_text("\n".join(f"file '{p.as_posix()}'" for p in seg_paths) + "\n", encoding="utf-8")
        base_mp4 = wdir / "base_visual.mp4"
        subprocess.run(
            [ffmpeg, "-y", "-threads", "2", "-f", "concat", "-safe", "0", "-i", str(concat_txt), "-c", "copy", str(base_mp4)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=120,
        )

        # Mix Voice + SFX 3종 + -26dB sidechaincompress BGM
        master_m4a = mix_voice_sfx_and_ducked_bgm(voice_wav, total_dur, cut_times, wdir / "master.m4a")

        # Render 1-line safe-zone subtitle PNGs into a single ultra-fast concat overlay stream (10x faster, low RAM!)
        go_short = build_clean_go_link(div_u, "yt").replace("https://", "")
        timed_pngs: List[Tuple[float, float, Path]] = []
        for ci, (t0, t1, ltxt) in enumerate(timed_cues):
            is_tail = (ci >= len(timed_cues) - 2)
            png_p = render_single_line_subtitle_png(
                div_u, lang, ltxt, wdir / f"sub_{ci:03d}.png",
                width=1080, height=1920,
                footer_go_url=(go_short if is_tail else ""),
            )
            timed_pngs.append((t0, t1, png_p))
        subs_list = _build_concat_subtitle_list(timed_pngs, total_dur, 1080, 1920, wdir)

        out_mp4.parent.mkdir(parents=True, exist_ok=True)
        cmd_final = [
            ffmpeg, "-y", "-threads", "2",
            "-i", str(base_mp4),
            "-f", "concat", "-safe", "0", "-i", str(subs_list),
            "-i", str(master_m4a),
            "-filter_complex", "[1:v]fps=30,format=rgba[subv];[0:v][subv]overlay=0:0:shortest=1,format=yuv420p[vout]",
            "-map", "[vout]", "-map", "2:a",
            "-t", f"{total_dur:.2f}",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-movflags", "+faststart",
            "-c:a", "copy", str(out_mp4),
        ]
        rf = subprocess.run(cmd_final, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=240)
        if rf.returncode != 0 or not out_mp4.exists() or out_mp4.stat().st_size < 50_000:
            raise RuntimeError(f"Final Short composite failed: {rf.stderr[-280:]}")
    return out_mp4, round(total_dur, 2), srt_text


def compose_flagship_longform_16x9(
    div: str,
    lang: str,
    voice_id: str,
    chapters: List[Dict[str, Any]],
    out_mp4: Path,
) -> Tuple[Path, float, str]:
    """
    Composes a 2~3 minute (125~175s) 1920x1080 30fps Zero-AI-Tell Flagship Long-Form Video
    from multi-chapter real-UI screen recordings + animated HTML motion charts +
    colloquial voice with natural pauses + SFX + -26dB ducked BGM + crisp synced .srt.
    Each chapter dict: {"clip": Path, "script": str, "badge": str}
    """
    div_u = div.upper()
    ffmpeg = _get_ffmpeg()
    go_short = build_clean_go_link(div_u, "yt").replace("https://", "")

    with tempfile.TemporaryDirectory(prefix=f"dc_lf_{div_u}_") as tmp:
        wdir = Path(tmp)
        all_srt_cues: List[Tuple[float, float, str]] = []
        chap_mp4s: List[Path] = []
        global_t = 0.0

        for idx, ch in enumerate(chapters):
            script = str(ch["script"]).strip()
            ok_s, errs = check_promo_hard_gate(div_u, script, surface="youtube_desc")
            if not ok_s:
                raise ValueError(f"[HARD GATE BLOCKED LONGFORM CH{idx+1}] {div_u}: {errs}")

            lines = split_to_short_subtitle_lines(script, lang=lang)
            ch_dir = wdir / f"ch{idx:02d}"
            voice_wav, cues, ch_dur = synthesize_chunked_speech_with_pauses(lines, voice_id, ch_dir / "tts", lang=lang)
            for t0, t1, txt in cues:
                all_srt_cues.append((global_t + t0, global_t + t1, txt))

            # Cut cues every ~8s for subtle SFX placement inside long-form chapter
            sfx_times = [t for t in (0.6, ch_dur * 0.45, ch_dur * 0.85) if t < ch_dur - 0.6]
            ch_audio = mix_voice_sfx_and_ducked_bgm(voice_wav, ch_dur, sfx_times, ch_dir / "ch_audio.m4a")

            # Prepare looped 1920x1080 30fps visual for this chapter
            clip_p = Path(ch["clip"])
            ch_base = ch_dir / "ch_base.mp4"
            subprocess.run(
                [ffmpeg, "-y", "-threads", "2", "-stream_loop", "-1", "-i", str(clip_p),
                 "-t", f"{ch_dur:.2f}",
                 "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,format=yuv420p",
                 "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "22", str(ch_base)],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=180,
            )

            # Overlay subtle chapter subtitle pills via ultra-fast 1-pass concat stream (low RAM, 30fps!)
            timed_pngs_lf: List[Tuple[float, float, Path]] = []
            for ci, (t0, t1, ltxt) in enumerate(cues):
                png_p = render_single_line_subtitle_png(
                    div_u, lang, ltxt, ch_dir / f"sub_{ci:03d}.png",
                    width=1920, height=1080,
                    footer_go_url=f"{ch.get('badge', '')}  ·  {go_short}" if ch.get("badge") else go_short,
                )
                timed_pngs_lf.append((t0, t1, png_p))
            subs_list_lf = _build_concat_subtitle_list(timed_pngs_lf, ch_dur, 1920, 1080, ch_dir)

            ch_out = ch_dir / f"chapter_{idx:02d}.mp4"
            r = subprocess.run(
                [ffmpeg, "-y", "-threads", "2",
                 "-i", str(ch_base),
                 "-f", "concat", "-safe", "0", "-i", str(subs_list_lf),
                 "-i", str(ch_audio),
                 "-filter_complex", "[1:v]fps=30,format=rgba[subv];[0:v][subv]overlay=0:0:shortest=1,format=yuv420p[vout]",
                 "-map", "[vout]", "-map", "2:a", "-t", f"{ch_dur:.2f}",
                 "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-movflags", "+faststart",
                 "-c:a", "copy", str(ch_out)],
                stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=300,
            )
            if r.returncode != 0 or not ch_out.exists():
                raise RuntimeError(f"Longform ch{idx} render failed: {r.stderr[-260:]}")
            chap_mp4s.append(ch_out)
            global_t += ch_dur

        concat_txt = wdir / "chapters_concat.txt"
        concat_txt.write_text("\n".join(f"file '{p.as_posix()}'" for p in chap_mp4s) + "\n", encoding="utf-8")
        out_mp4.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [ffmpeg, "-y", "-threads", "2", "-f", "concat", "-safe", "0", "-i", str(concat_txt),
             "-c", "copy", "-movflags", "+faststart", str(out_mp4)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=180,
        )

    srt_text = build_synced_srt(all_srt_cues)
    ok_srt, srt_errs = check_promo_hard_gate(div_u, srt_text, surface="srt", srt_text=srt_text)
    if not ok_srt:
        raise ValueError(f"[HARD GATE BLOCKED LONGFORM SRT] {div_u}: {srt_errs}")
    return out_mp4, round(global_t, 2), srt_text
