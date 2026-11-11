# -*- coding: utf-8 -*-
"""
V4 Interactive Quant Chart & Blind-Test HUD Video Mastering Engine (1사업부 TruthOfMarket)
-----------------------------------------------------------------------------------------
Solves the '0 Views / Generic AI B-Roll' problem by rendering real-time 30fps animated
Wall Street Candlestick + MA60 + Institutional Volume Surge HUDs directly on the 1080x1920
fullscreen canvas, paired with natural-paced Edge-TTS narration (seg_dur >= tts_dur + 0.26s),
thick black-stroke safe-zone subtitles (Y=1385..1460), point SFX, -0.5 dBFS limiter,
and a 3.2s truthofmarket.com interactive blind-test outro slate.
"""

import asyncio
import json
import math
import os
import shutil
import subprocess
import sys
import wave
from pathlib import Path
from typing import Dict, List, Tuple

import edge_tts
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE_DIR = Path(r"d:\드림컴퍼니\1사업부")
OUT_DIR = BASE_DIR / "viral_shorts_10_output"
WORK_DIR = BASE_DIR / "data" / "_v4_chart_shorts_work"
BROLL_DIR = BASE_DIR / "data" / "_veo_luxury_broll"

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_version() and imageio_ffmpeg.get_ffmpeg_exe()
W, H = 1080, 1920
FPS = 30
SAMPLE_RATE = 44100


def load_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    candidates = [
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\malgunbd.ttf" if bold else r"C:\Windows\Fonts\malgun.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


import re

FONT_PILL = load_font(27, True)
FONT_TITLE = load_font(33, True)
FONT_SUBTITLE_HUD = load_font(24, False)
FONT_TICKER = load_font(42, True)
FONT_METRIC_LBL = load_font(22, True)
FONT_METRIC_VAL = load_font(33, True)
FONT_CHART_TAG = load_font(23, True)
FONT_CAPTION = load_font(38, True)
FONT_OUTRO_DOMAIN = load_font(60, True)
FONT_OUTRO_SUB = load_font(32, True)
FONT_OUTRO_CTA = load_font(29, True)


def clean_video_text(s: str) -> str:
    """Strip unsupported emoji characters that render as tofu boxes in Arial/Segoe on Windows PIL."""
    if not s:
        return ""
    replacements = {
        "🎯": "[QUIZ] ",
        "⚔️": "[VS] ",
        "🔥": "[HOT] ",
        "🛑": "[STOP] ",
        "🟢": "[BUY] ",
        "🔴": "[TRAP] ",
        "⚠️": "[WARN] ",
        "⏳": ">> ",
        "❓": "[?] ",
        "🛡️": "[SAFE] ",
        "🚀": "[2X] ",
        "👑": "[VIP] ",
        "🔒": "[VIP] ",
        "🔓": "[FREE] ",
        "📉": "[DOWN] ",
        "💸": "[LOSS] ",
        "💰": "[USD] ",
        "🩺": "[DOC] ",
        "🚨": "[ALERT] ",
        "🔍": "[SCAN] ",
        "📐": "[PLAN] ",
        "🆓": "[FREE] ",
        "⚡": ">> ",
        "👉": ">> ",
    }
    for k, v in replacements.items():
        s = s.replace(k, v)
    # Remove any remaining astral-plane emoji characters (> U+FFFF)
    s = re.sub(r"[\U00010000-\U0010ffff]", "", s)
    return s.strip()


async def synth_tts_natural(text: str, out_wav: Path, voice: str = "en-US-AndrewMultilingualNeural") -> float:
    """Synthesize natural announcer TTS without atempo speed distortion, with fallback voices."""
    out_wav.parent.mkdir(parents=True, exist_ok=True)
    if out_wav.exists() and out_wav.stat().st_size > 8000:
        with wave.open(str(out_wav), "rb") as wf:
            return wf.getnframes() / float(wf.getframerate())

    voices = [
        voice,
        "en-US-BrianMultilingualNeural",
        "en-US-ChristopherNeural",
        "en-US-GuyNeural",
    ]
    tmp_mp3 = out_wav.with_suffix(".mp3")
    last_err = None
    for v in voices:
        for attempt in range(3):
            try:
                comm = edge_tts.Communicate(text=text, voice=v, rate="+4%")
                await comm.save(str(tmp_mp3))
                if tmp_mp3.exists() and tmp_mp3.stat().st_size > 1000:
                    subprocess.run(
                        [
                            FFMPEG_EXE,
                            "-y",
                            "-i",
                            str(tmp_mp3),
                            "-ac",
                            "2",
                            "-ar",
                            str(SAMPLE_RATE),
                            str(out_wav),
                        ],
                        check=True,
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                    )
                    tmp_mp3.unlink(missing_ok=True)
                    with wave.open(str(out_wav), "rb") as wf:
                        return wf.getnframes() / float(wf.getframerate())
            except Exception as e:
                last_err = e
                await asyncio.sleep(0.6)
    raise RuntimeError(f"TTS failed for {text}: {last_err}")


def read_wav_stereo(path: Path) -> np.ndarray:
    with wave.open(str(path), "rb") as wf:
        n_ch = wf.getnchannels()
        frames = wf.readframes(wf.getnframes())
        arr = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
        if n_ch == 2:
            arr = arr.reshape(-1, 2)
        else:
            arr = np.column_stack([arr, arr])
        return arr


def synth_sfx(kind: str, dur_s: float, seed_val: int = 20261111) -> np.ndarray:
    n = int(SAMPLE_RATE * dur_s)
    t = np.linspace(0.0, dur_s, n, endpoint=False, dtype=np.float32)
    if kind == "hook_impact":
        freq = np.linspace(135.0, 42.0, n, dtype=np.float32)
        phase = 2.0 * np.pi * np.cumsum(freq) / SAMPLE_RATE
        sub = np.tanh(1.2 * np.sin(phase)) * np.exp(-t * 5.0)
        ping = np.sin(2.0 * np.pi * 880.0 * t) * np.exp(-t * 14.0) * 0.35
        sig = (sub * 0.7 + ping) * 0.42
    elif kind == "whoosh":
        rng = np.random.default_rng(seed_val)
        noise = rng.standard_normal(n).astype(np.float32)
        env = np.sin(np.pi * (t / dur_s)) ** 2
        tone = (2.0 / np.pi) * np.arcsin(np.sin(2.0 * np.pi * np.linspace(240.0, 520.0, n, dtype=np.float32) * t))
        sig = (np.convolve(noise * 0.16, np.ones(12, dtype=np.float32) / 12.0, mode="same") + tone * 0.22) * env * 0.25
    elif kind == "ping":
        sig = (
            np.sin(2.0 * np.pi * 1046.5 * t) * np.exp(-t * 9.0) * 0.5
            + np.sin(2.0 * np.pi * 1567.98 * t) * np.exp(-t * 12.0) * 0.35
        ) * 0.30
    else:  # sub_drop
        freq = np.linspace(110.0, 34.0, n, dtype=np.float32)
        phase = 2.0 * np.pi * np.cumsum(freq) / SAMPLE_RATE
        sig = np.tanh(1.2 * np.sin(phase)) * np.exp(-t * 2.8) * 0.45
    return np.column_stack([sig, sig])


def build_master_audio(beats: List[Dict], outro_dur: float, out_wav: Path) -> Tuple[List[Tuple[float, float]], float]:
    """Assemble beat narrations + point SFX + rotating documentary BGM, limited at -0.5 dBFS."""
    timings = []
    cur_t = 0.0
    beat_arrays = []
    dyn_seed = (sum((idx + 1) * ord(ch) for idx, ch in enumerate(out_wav.stem)) * 1664525) % 2147483647 or 20261111
    for idx, b in enumerate(beats):
        tts_arr = read_wav_stereo(b["wav_path"])
        tts_dur = len(tts_arr) / float(SAMPLE_RATE)
        # Ensure at least +0.26s tail so 100% of every subtitle is read before transition
        seg_dur = max(tts_dur + 0.28, b.get("min_dur", 0.0))
        seg_samples = int(round(seg_dur * SAMPLE_RATE))
        padded = np.zeros((seg_samples, 2), dtype=np.float32)
        padded[: len(tts_arr)] = tts_arr

        # Overlay point SFX at start of beat
        sfx_kind = "hook_impact" if idx == 0 else ("ping" if idx in (1, 2) else "whoosh")
        sfx = synth_sfx(sfx_kind, min(0.45, seg_dur * 0.5), seed_val=dyn_seed + idx * 97)
        padded[: len(sfx)] += sfx

        beat_arrays.append(padded)
        timings.append((cur_t, cur_t + seg_dur))
        cur_t += seg_dur

    # Outro audio
    outro_samples = int(round(outro_dur * SAMPLE_RATE))
    outro_arr = np.zeros((outro_samples, 2), dtype=np.float32)
    drop = synth_sfx("sub_drop", min(0.9, outro_dur * 0.8), seed_val=dyn_seed + 999)
    outro_arr[: len(drop)] += drop
    if beats and "outro_wav_path" in beats[-1] and Path(beats[-1]["outro_wav_path"]).exists():
        ow = read_wav_stereo(Path(beats[-1]["outro_wav_path"]))
        take = min(len(ow), outro_samples - int(0.15 * SAMPLE_RATE))
        if take > 0:
            outro_arr[int(0.10 * SAMPLE_RATE) : int(0.10 * SAMPLE_RATE) + take] += ow[:take]

    full_audio = np.vstack(beat_arrays + [outro_arr])
    total_dur = len(full_audio) / float(SAMPLE_RATE)

    # Rotating dark-documentary low-pass string/pulse BGM (zero pure-sine drone!)
    bgm_progressions = [
        [110.0, 130.81, 98.0, 123.47],
        [82.41, 98.00, 73.42, 92.50],
        [92.50, 110.0, 82.41, 103.83],
        [73.42, 87.31, 65.41, 82.41],
    ]
    prog_notes = bgm_progressions[dyn_seed % len(bgm_progressions)]
    t_all = np.linspace(0.0, total_dur, len(full_audio), endpoint=False, dtype=np.float32)
    sec_note = total_dur / len(prog_notes)
    bgm_track = np.zeros(len(full_audio), dtype=np.float32)
    for n_idx, f0 in enumerate(prog_notes):
        s_t, e_t = n_idx * sec_note, (n_idx + 1) * sec_note
        env = np.clip((t_all - s_t) / 0.6, 0, 1) * np.clip((e_t - t_all) / 0.6, 0, 1)
        tri = (2.0 / np.pi) * np.arcsin(np.sin(2.0 * np.pi * f0 * t_all))
        fifth = (2.0 / np.pi) * np.arcsin(np.sin(2.0 * np.pi * (f0 * 1.5) * t_all + 0.4))
        pulse = 0.72 + 0.28 * np.cos(2.0 * np.pi * 1.75 * t_all)
        bgm_track += (0.022 * tri + 0.012 * fifth) * pulse * env
    lp_k = np.ones(14, dtype=np.float32) / 14.0
    bgm_track = np.convolve(bgm_track, lp_k, mode="same")
    full_audio[:, 0] += bgm_track
    full_audio[:, 1] += bgm_track

    # Soft knee compression + strict -0.5 dBFS peak ceiling (<= 0.891)
    peak = float(np.max(np.abs(full_audio)))
    if peak > 0.001:
        full_audio = np.tanh(full_audio * 1.15)
        peak2 = float(np.max(np.abs(full_audio)))
        full_audio = full_audio * (0.88 / peak2)

    pcm = np.clip(full_audio * 32767.0, -32767, 32767).astype(np.int16)
    with wave.open(str(out_wav), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(pcm.tobytes())

    return timings, total_dur


def wrap_caption_two_lines(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_w: int = 900) -> List[str]:
    text = clean_video_text(text)
    words = text.strip().split()
    if not words:
        return [""]
    lines = []
    cur = words[0]
    for w in words[1:]:
        test = f"{cur} {w}"
        bbox = draw.textbbox((0, 0), test, font=font, stroke_width=10)
        if (bbox[2] - bbox[0]) <= max_w:
            cur = test
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    return lines[:3]


def draw_chart_hud_frame(
    bg_img: Image.Image,
    beat: Dict,
    progress: float,
    global_t: float,
) -> Image.Image:
    """
    Renders a 1080x1920 clean fullscreen frame with:
    1) Darkened atmospheric luxury background (no top/bottom template bars!)
    2) Floating Challenge Pill (Y=190..265)
    3) Animated Wall Street Candlestick + MA60 + Volume Surge Chart Box (Y=295..1015)
    4) Dual Live Telemetry Comparison Cards (Y=1040..1305)
    5) Thick Black-Stroke Subtitle in Safe Zone (Y=1390..1465, stroke_width=10)
    """
    frame = bg_img.copy().convert("RGBA")
    # Darken background so chart HUD pops with razor-sharp contrast
    overlay = Image.new("RGBA", (W, H), (5, 9, 18, 212))
    frame = Image.alpha_composite(frame, overlay)
    draw = ImageDraw.Draw(frame, "RGBA")

    # 1. Floating Challenge Pill (Y=185..260)
    pill_color = beat.get("accent_rgb", (251, 191, 36))
    draw.rounded_rectangle(
        [70, 185, W - 70, 258],
        radius=36,
        fill=(12, 19, 36, 230),
        outline=(*pill_color, 220),
        width=3,
    )
    pill_txt = clean_video_text(beat.get("pill_text", "[QUIZ] WALL STREET CHART BLIND TEST · LIVE US STOCKS"))
    tb = draw.textbbox((0, 0), pill_txt, font=FONT_PILL)
    draw.text(((W - (tb[2] - tb[0])) // 2, 207), pill_txt, font=FONT_PILL, fill=(*pill_color, 255))

    # 2. Main Animated Chart HUD Panel (Y=285..1020)
    chart_mode = beat.get("chart_mode", "LEFT_TRAP")
    border_col = (239, 68, 68, 210) if chart_mode == "LEFT_TRAP" else (16, 185, 129, 225)
    draw.rounded_rectangle(
        [54, 285, W - 54, 1020],
        radius=24,
        fill=(8, 13, 25, 242),
        outline=border_col,
        width=3,
    )

    # Chart Header inside box
    ticker_title = clean_video_text(beat.get("chart_title", "$NVDA ($178.67) — LEFT-SIDE FALLING KNIFE"))
    draw.text((84, 312), ticker_title, font=FONT_TITLE, fill=(255, 255, 255, 255))
    sub_hud = clean_video_text(beat.get("chart_subtitle", "60-Day Moving Average (MA60) & 10-Day Institutional Volume"))
    draw.text((84, 360), sub_hud, font=FONT_SUBTITLE_HUD, fill=(148, 163, 184, 255))

    # Grid lines inside chart plot area (X=88..992, Y=420..820)
    plot_l, plot_r, plot_t, plot_b = 88, 992, 420, 810
    vol_t, vol_b = 845, 965
    for gy in [470, 560, 650, 740, 810]:
        draw.line([(plot_l, gy), (plot_r, gy)], fill=(51, 65, 85, 110), width=2)

    # Candlestick + MA60 data series (14 bars)
    if chart_mode == "LEFT_TRAP":
        # Declining candles below a falling MA60 line
        candles = [
            (460, 520, 445, 535, False),
            (485, 540, 470, 555, False),
            (530, 510, 495, 545, True),
            (515, 585, 505, 600, False),
            (580, 635, 565, 650, False),
            (630, 605, 590, 645, True),
            (610, 675, 595, 690, False),
            (670, 715, 655, 730, False),
            (710, 680, 665, 720, True),
            (685, 660, 645, 695, True),
            (665, 735, 655, 755, False),
            (730, 770, 715, 785, False),
            (765, 745, 735, 780, True),
            (750, 795, 740, 808, False),
        ]
        ma60_y = [450, 462, 476, 492, 510, 528, 545, 564, 580, 596, 614, 630, 648, 665]
        vols = [0.38, 0.44, 0.28, 0.52, 0.48, 0.25, 0.46, 0.42, 0.24, 0.26, 0.50, 0.44, 0.22, 0.35]
        ma_col = (245, 158, 11, 255)
        ma_label = "MA60 Resistance (-18.3% Below)"
    elif chart_mode == "ACCOUNT_RACE":
        # Dual equity curve mode + breakout candles
        candles = [
            (720, 750, 710, 765, False),
            (745, 775, 735, 785, False),
            (765, 735, 725, 775, True),
            (735, 715, 705, 745, True),
            (715, 690, 680, 725, True),
            (690, 650, 640, 700, True),
            (650, 670, 640, 680, False),
            (670, 610, 600, 680, True),
            (610, 560, 545, 620, True),
            (560, 520, 505, 575, True),
            (520, 540, 510, 555, False),
            (540, 485, 470, 550, True),
            (485, 450, 435, 495, True),
            (450, 428, 418, 462, True),
        ]
        ma60_y = [735, 732, 725, 712, 695, 675, 655, 632, 608, 582, 558, 535, 512, 492]
        vols = [0.22, 0.25, 0.30, 0.35, 0.42, 0.68, 0.32, 0.78, 0.86, 0.92, 0.38, 0.90, 0.96, 1.00]
        ma_col = (56, 189, 248, 255)
        ma_label = "PW-RSI Right-Side Compounding Curve (+17.81%/yr)"
    else:
        # RIGHT_IGNITION: Left washout -> tight base -> explosive MA60 reclaim & 2.46x / 3.41x volume
        candles = [
            (540, 610, 530, 625, False),
            (605, 675, 595, 690, False),
            (670, 730, 660, 745, False),
            (725, 760, 715, 775, False),
            (755, 735, 725, 770, True),
            (735, 748, 725, 760, False),
            (745, 722, 712, 755, True),
            (722, 695, 685, 732, True),
            (695, 640, 625, 705, True),
            (640, 585, 570, 650, True),
            (585, 535, 520, 595, True),
            (535, 490, 475, 545, True),
            (490, 455, 440, 500, True),
            (455, 425, 415, 465, True),
        ]
        ma60_y = [575, 605, 635, 662, 680, 690, 692, 685, 670, 650, 625, 598, 572, 548]
        vols = [0.32, 0.38, 0.42, 0.30, 0.22, 0.18, 0.25, 0.40, 0.68, 0.78, 0.85, 0.90, 0.95, 1.00]
        ma_col = (56, 189, 248, 255)
        ma_label = "MA60 Reclaimed (+12.7% ~ +16.4% Breakout)"

    n_bars = len(candles)
    # Progressive animation: reveal from 4 bars up to all 14 bars within the first 70% of the cut
    vis_float = 4.0 + (n_bars - 4.0) * min(1.0, progress / 0.68)
    vis_count = max(4, min(n_bars, int(math.ceil(vis_float))))
    step_x = (plot_r - plot_l - 60) / float(n_bars - 1)

    # Draw MA60 polyline
    ma_pts = [(int(plot_l + 30 + i * step_x), int(ma60_y[i])) for i in range(vis_count)]
    if len(ma_pts) >= 2:
        draw.line(ma_pts, fill=ma_col, width=6)
    draw.text((plot_l + 12, plot_t + 8), ma_label, font=FONT_CHART_TAG, fill=ma_col)

    # Draw Candlesticks & Volume Bars
    for i in range(vis_count):
        cx = int(plot_l + 30 + i * step_x)
        o_y, c_y, hi_y, lo_y, is_bull = candles[i]
        col = (16, 185, 129, 255) if is_bull else (239, 68, 68, 255)
        # Wick
        draw.line([(cx, hi_y), (cx, lo_y)], fill=col, width=4)
        # Body
        top_y, bot_y = min(o_y, c_y), max(o_y, c_y)
        if bot_y - top_y < 8:
            bot_y = top_y + 8
        draw.rounded_rectangle([cx - 16, top_y, cx + 16, bot_y], radius=4, fill=col)

        # Volume bar
        v_ratio = vols[i]
        vh = int((vol_b - vol_t) * v_ratio)
        v_col = (
            (52, 211, 153, 255)
            if (is_bull and v_ratio >= 0.65)
            else ((239, 68, 68, 190) if not is_bull else (100, 116, 139, 170))
        )
        draw.rounded_rectangle([cx - 15, vol_b - vh, cx + 15, vol_b], radius=3, fill=v_col)

    # Pulsing Decision Ring at latest visible bar
    last_idx = vis_count - 1
    last_cx = int(plot_l + 30 + last_idx * step_x)
    last_cy = int(candles[last_idx][1])
    pulse_r = int(28 + 6 * math.sin(global_t * 8.0))
    ring_col = (251, 191, 36, 255) if chart_mode == "LEFT_TRAP" else (52, 211, 153, 255)
    draw.ellipse(
        [last_cx - pulse_r, last_cy - pulse_r, last_cx + pulse_r, last_cy + pulse_r],
        outline=ring_col,
        width=5,
    )

    # Volume Banner Text inside bottom of chart panel
    vol_banner = clean_video_text(beat.get("vol_banner", ">> 10D INSTITUTIONAL VOLUME SURGE: 2.46x ~ 3.41x"))
    vb_col = (248, 113, 113, 255) if chart_mode == "LEFT_TRAP" else (52, 211, 153, 255)
    draw.text((84, 974), vol_banner, font=FONT_CHART_TAG, fill=vb_col)

    # 3. Golden Safe-Zone Subtitle (Y=1055..1125, thick black stroke >= 10, zero box, zero UI overlap!)
    cap_lines = wrap_caption_two_lines(draw, beat["caption"], FONT_CAPTION, max_w=900)
    y_cursor = 1052 if len(cap_lines) >= 2 else 1072
    for ln in cap_lines:
        tb = draw.textbbox((0, 0), ln, font=FONT_CAPTION, stroke_width=10)
        tw = tb[2] - tb[0]
        tx = (W - tw) // 2
        draw.text(
            (tx, y_cursor),
            ln,
            font=FONT_CAPTION,
            fill=(255, 255, 255, 255),
            stroke_width=10,
            stroke_fill=(0, 0, 0, 255),
        )
        y_cursor += 50

    # 4. Dual Live Telemetry Scoreboard Cards (Y=1215..1465, cleanly below Golden Safe-Zone subtitle)
    left_card = beat.get(
        "left_card",
        {
            "title": "[TRAP] LEFT-SIDE KNIFE ($NVDA)",
            "val": "-18.3% Below MA60",
            "sub": "$10,000 Dip -> $5,200 (-48%)",
            "rgb": (239, 68, 68),
        },
    )
    right_card = beat.get(
        "right_card",
        {
            "title": "[BUY] RIGHT-SIDE IGNITION",
            "val": "2.46x ~ 3.41x Vol",
            "sub": "$10,000 Quant -> $22,697 (+127%)",
            "rgb": (16, 185, 129),
        },
    )

    for idx_c, (card, x0, x1) in enumerate([(left_card, 54, 526), (right_card, 554, W - 54)]):
        cr, cg, cb = card["rgb"]
        draw.rounded_rectangle(
            [x0, 1215, x1, 1468],
            radius=20,
            fill=(10, 16, 30, 240),
            outline=(cr, cg, cb, 215),
            width=3,
        )
        draw.text((x0 + 24, 1239), clean_video_text(card["title"]), font=FONT_METRIC_LBL, fill=(cr, cg, cb, 255))
        draw.text((x0 + 24, 1285), clean_video_text(card["val"]), font=FONT_METRIC_VAL, fill=(255, 255, 255, 255))
        draw.text((x0 + 24, 1345), clean_video_text(card["sub"]), font=FONT_METRIC_LBL, fill=(203, 213, 225, 255))
        extra = clean_video_text(card.get("extra", "Strict -9.0% Hard Stop" if idx_c == 1 else "No Stop-Loss Trap"))
        draw.text((x0 + 24, 1395), extra, font=FONT_CHART_TAG, fill=(cr, cg, cb, 240))

    return frame.convert("RGB")


def draw_outro_slate_frame(bg_img: Image.Image, progress: float, outro_cta: str) -> Image.Image:
    """Renders the final 3.2s truthofmarket.com Interactive Blind Test & Position Doctor callout slate."""
    frame = bg_img.copy().convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (4, 8, 16, 232))
    frame = Image.alpha_composite(frame, overlay)
    draw = ImageDraw.Draw(frame, "RGBA")

    # Central luxury card
    draw.rounded_rectangle(
        [64, 420, W - 64, 1340],
        radius=32,
        fill=(10, 18, 36, 248),
        outline=(16, 185, 129, 245),
        width=4,
    )

    badge = "[LIVE] PLAY THE 15-SECOND CHART BLIND TEST NOW"
    tb = draw.textbbox((0, 0), badge, font=FONT_PILL)
    draw.text(((W - (tb[2] - tb[0])) // 2, 485), badge, font=FONT_PILL, fill=(251, 191, 36, 255))

    dom = "truthofmarket.com"
    tb2 = draw.textbbox((0, 0), dom, font=FONT_OUTRO_DOMAIN)
    draw.text(((W - (tb2[2] - tb2[0])) // 2, 565), dom, font=FONT_OUTRO_DOMAIN, fill=(52, 211, 153, 255))

    sub1 = "1. Test Your Quant IQ on 3 Anonymized US Stock Charts"
    sub2 = "2. Run the Free 3-Second Position Doctor on Your Ticker"
    sub3 = "3. Unlock Today's #1 ($CELH 2.46x) & VIP 3.41x Breakouts"
    for idx_s, s_txt in enumerate([sub1, sub2, sub3]):
        tbs = draw.textbbox((0, 0), s_txt, font=FONT_OUTRO_CTA)
        draw.text(((W - (tbs[2] - tbs[0])) // 2, 700 + idx_s * 76), s_txt, font=FONT_OUTRO_CTA, fill=(255, 255, 255, 255))

    # Glowing CTA Button inside Outro
    draw.rounded_rectangle(
        [110, 980, W - 110, 1105],
        radius=24,
        fill=(16, 185, 129, 255),
    )
    btn_txt = ">> Visit truthofmarket.com (#1 Free Showcase Active)"
    tbb = draw.textbbox((0, 0), btn_txt, font=FONT_OUTRO_CTA)
    draw.text(((W - (tbb[2] - tbb[0])) // 2, 1024), btn_txt, font=FONT_OUTRO_CTA, fill=(4, 24, 18, 255))

    foot = "US-Listed Equities Only (NYSE/NASDAQ) · Store #296100 Verified"
    tbf = draw.textbbox((0, 0), foot, font=FONT_METRIC_LBL)
    draw.text(((W - (tbf[2] - tbf[0])) // 2, 1235), foot, font=FONT_METRIC_LBL, fill=(148, 163, 184, 255))

    # Safe-zone caption
    cap_lines = wrap_caption_two_lines(draw, outro_cta, FONT_CAPTION, max_w=940)
    y_cursor = 1390 if len(cap_lines) > 1 else 1415
    for ln in cap_lines:
        tb_c = draw.textbbox((0, 0), ln, font=FONT_CAPTION, stroke_width=10)
        draw.text(
            ((W - (tb_c[2] - tb_c[0])) // 2, y_cursor),
            ln,
            font=FONT_CAPTION,
            fill=(255, 255, 255, 255),
            stroke_width=10,
            stroke_fill=(0, 0, 0, 255),
        )
        y_cursor += 58

    return frame.convert("RGB")


def prepare_dark_bg() -> Image.Image:
    """Create a rich dark-luxury procedural financial grid background so we never show fake AI gibberish."""
    img = Image.new("RGB", (W, H), (6, 10, 20))
    draw = ImageDraw.Draw(img)
    for y in range(0, H, 60):
        draw.line([(0, y), (W, y)], fill=(14, 23, 42), width=1)
    for x in range(0, W, 60):
        draw.line([(x, 0), (x, H)], fill=(14, 23, 42), width=1)
    return img


EPISODES_V4 = [
    {
        "ep_num": 10,
        "slug": "EP10_26Y_Backtest_Truth",
        "outro_cta": "Play the 15-second chart blind test now at truthofmarket.com.",
        "beats": [
            {
                "caption": "Why do 92% of dip buyers lose money while this 26-year quant rule compounds at +17.81% a year?",
                "pill_text": "🎯 26-YEAR BACKTEST TRUTH · 2,938 REAL US TRADES",
                "chart_mode": "LEFT_TRAP",
                "chart_title": "LEFT-SIDE DIP BUYER ($NVDA -18.3% Below MA60)",
                "chart_subtitle": "Buying below the 60-Day Moving Average traps capital for months",
                "vol_banner": "⚠️ LEFT-SIDE VOLUME: 0.92x (No Institutional Accumulation)",
                "accent_rgb": (251, 191, 36),
                "left_card": {
                    "title": "❌ AMATEUR DIP BUYING",
                    "val": "-48.0% Drawdown",
                    "sub": "$10,000 -> $5,200 Trapped",
                    "extra": "No MA60 Filter · No Hard Stop",
                    "rgb": (239, 68, 68),
                },
                "right_card": {
                    "title": "🟢 26-YEAR PW-RSI ENGINE",
                    "val": "+17.81% Net CAGR",
                    "sub": "55.24% 2x Win Rate (After Tax)",
                    "extra": "0.93% Severe Loss Risk",
                    "rgb": (16, 185, 129),
                },
            },
            {
                "caption": "Look at the chart: buying a falling knife below its 60-day moving average destroys your compounding.",
                "pill_text": "🛑 RULE #1 · NEVER CATCH A FALLING KNIFE BELOW MA60",
                "chart_mode": "LEFT_TRAP",
                "chart_title": "$SMCI ($28.60) & $COIN ($136.10) — BELOW MA60",
                "chart_subtitle": "Price -21.9% to -23.3% below MA60 = Institutional Avoidance Zone",
                "vol_banner": "🔴 RED LIGHT: WAIT FOR RIGHT-SIDE MA60 RECLAIM",
                "accent_rgb": (239, 68, 68),
                "left_card": {
                    "title": "❌ $SMCI LEFT-SIDE TRAP",
                    "val": "-23.3% vs MA60",
                    "sub": "PW-RSI Score: 45 / 100",
                    "extra": "Downtrend Still Active",
                    "rgb": (239, 68, 68),
                },
                "right_card": {
                    "title": "❌ $COIN LEFT-SIDE TRAP",
                    "val": "-21.9% vs MA60",
                    "sub": "PW-RSI Score: 55 / 100",
                    "extra": "Protect Cash Until Reclaim",
                    "rgb": (239, 68, 68),
                },
            },
            {
                "caption": "Instead, enter only when price reclaims MA60 with 2.46x institutional volume like $CELH at $33.19.",
                "pill_text": "🟢 RULE #2 · RIGHT-SIDE IGNITION ($CELH +12.7% ABOVE MA60)",
                "chart_mode": "RIGHT_IGNITION",
                "chart_title": "$CELH ($33.19) — #1 FREE SHOWCASE IGNITION",
                "chart_subtitle": "Reclaimed MA20/MA60 (+12.7%) + 2.46x Institutional Volume Surge",
                "vol_banner": "🟢 2.46x INSTITUTIONAL VOLUME BREAKOUT CONFIRMED",
                "accent_rgb": (16, 185, 129),
                "left_card": {
                    "title": "🎯 $CELH ENTRY & STOP",
                    "val": "Stop @ $30.20 (-9%)",
                    "sub": "Portfolio Risk Capped at -1.35%",
                    "extra": "55-Day Time Stop Protection",
                    "rgb": (56, 189, 248),
                },
                "right_card": {
                    "title": "🚀 $CELH PROFIT TARGET",
                    "val": "Target $66.38 (+100%)",
                    "sub": "5.5 : 1 Asymmetric Reward/Risk",
                    "extra": "Today's #1 Free Sample Pick",
                    "rgb": (16, 185, 129),
                },
            },
            {
                "caption": "Plus, two VIP stocks just triggered 3.41x volume with Score 98. Test your ticker at truthofmarket.com.",
                "pill_text": "🔥 TODAY'S VIP IGNITION #2 (3.41x VOL) & #3 (3.17x VOL)",
                "chart_mode": "ACCOUNT_RACE",
                "chart_title": "VIP MYSTERY #2 (SCORE 98/100 · 3.41x VOL SURGE)",
                "chart_subtitle": "$10,000 Compounding: $22,697 in 5 Years at +17.81%/yr Net CAGR",
                "vol_banner": "👑 UNLOCK #2 (3.41x) & #3 (3.17x) AT TRUTHOFMARKET.COM",
                "accent_rgb": (251, 191, 36),
                "left_card": {
                    "title": "🔒 VIP IGNITION #2",
                    "val": "Score 98 · Vol 3.41x",
                    "sub": "+16.4% Above MA60 Breakout",
                    "extra": "Unlock Ticker ($29/mo or $199)",
                    "rgb": (251, 191, 36),
                },
                "right_card": {
                    "title": "🔒 VIP IGNITION #3",
                    "val": "Score 98 · Vol 3.17x",
                    "sub": "Institutional FinTech Reversal",
                    "extra": "Play 15s Blind Test on Site!",
                    "rgb": (16, 185, 129),
                },
            },
        ],
    },
    {
        "ep_num": 23,
        "slug": "EP23_NVDA_Trap_vs_341x_Blind_Test",
        "outro_cta": "Take the 15-second Wall Street chart blind test at truthofmarket.com.",
        "beats": [
            {
                "caption": "Wall Street Blind Test: Stock A is down 26% from its high. Do you buy this dip or avoid the trap?",
                "pill_text": "🎯 15-SECOND WALL STREET CHART BLIND TEST · ROUND 1",
                "chart_mode": "LEFT_TRAP",
                "chart_title": "MYSTERY STOCK A (-26.0% Off High · -18.3% vs MA60)",
                "chart_subtitle": "Pause & Call It: Is This a Bargain Dip or a Falling Knife Trap?",
                "vol_banner": "⏳ CLUE: 10-DAY VOLUME IS ONLY 0.92x (NO INSTITUTIONAL BID)",
                "accent_rgb": (251, 191, 36),
                "left_card": {
                    "title": "❓ OPTION A: BUY THE DIP",
                    "val": "92% of Retail Buys",
                    "sub": "'It dropped 26%, it must bounce!'",
                    "extra": "Catching a Left-Side Knife",
                    "rgb": (239, 68, 68),
                },
                "right_card": {
                    "title": "❓ OPTION B: AVOID TRAP",
                    "val": "Top 8% Quant Call",
                    "sub": "Price is -18.3% Below MA60",
                    "extra": "Wait for Right-Side Reclaim",
                    "rgb": (16, 185, 129),
                },
            },
            {
                "caption": "Reveal: Mystery Stock A is NVIDIA at $178.67, trading 18.3% below its 60-day moving average. That is a Left-Side Trap.",
                "pill_text": "🔴 REVEAL ROUND 1 · $NVDA ($178.67) IS IN LEFT-SIDE KNIFE ZONE",
                "chart_mode": "LEFT_TRAP",
                "chart_title": "REVEALED: $NVDA ($178.67 · Score 45/100)",
                "chart_subtitle": "Even the #1 AI Giant traps money when trading -18.3% below MA60",
                "vol_banner": "🛑 DO NOT BUY BELOW MA60 — WAIT FOR VOLUME IGNITION",
                "accent_rgb": (239, 68, 68),
                "left_card": {
                    "title": "🔴 $NVDA QUANT VERDICT",
                    "val": "LEFT_SIDE_KNIFE",
                    "sub": "Price vs MA60: -18.3%",
                    "extra": "10D Volume: 0.92x (Weak)",
                    "rgb": (239, 68, 68),
                },
                "right_card": {
                    "title": "🛡️ QUANT ACTION PLAN",
                    "val": "HOLD CASH / WAIT",
                    "sub": "Zero Capital Lost to Drawdown",
                    "extra": "Rotate to Right-Side Ignitions",
                    "rgb": (56, 189, 248),
                },
            },
            {
                "caption": "Now look at Mystery Stock B: it washed out, reclaimed MA60 by 12.7%, and exploded on 2.46x institutional volume.",
                "pill_text": "🟢 ROUND 2 REVEAL · $CELH ($33.19) RIGHT-SIDE IGNITION!",
                "chart_mode": "RIGHT_IGNITION",
                "chart_title": "REVEALED: $CELH ($33.19 · #1 FREE SHOWCASE)",
                "chart_subtitle": "MA60 Reclaimed (+12.7%) + 2.46x Institutional Volume Breakout",
                "vol_banner": "🟢 BUY ZONE: STOP @ $30.20 (-9%) · TARGET $66.38 (+100%)",
                "accent_rgb": (16, 185, 129),
                "left_card": {
                    "title": "🟢 $CELH QUANT SCORE",
                    "val": "84 / 100 (IGNITION)",
                    "sub": "2.46x Volume Surge Confirmed",
                    "extra": "Free Showcase Unlocked on Site",
                    "rgb": (16, 185, 129),
                },
                "right_card": {
                    "title": "🎯 EXACT TRADE TICKET",
                    "val": "-1.35% Max Risk",
                    "sub": "Stop $30.20 · Target $66.38",
                    "extra": "5.5x Reward-to-Risk Ratio",
                    "rgb": (56, 189, 248),
                },
            },
            {
                "caption": "Can you pass Round 3 with a 3.41x volume surge and Score 98? Play the live blind test at truthofmarket.com.",
                "pill_text": "🔥 ROUND 3 CHALLENGE · SCORE 98 & 3.41x VOLUME ANOMALY",
                "chart_mode": "ACCOUNT_RACE",
                "chart_title": "ROUND 3: MYSTERY VIP STOCK (3.41x VOL · SCORE 98)",
                "chart_subtitle": "Play all 3 rounds interactively right now on truthofmarket.com",
                "vol_banner": "👉 PLAY FREE BLIND TEST AT TRUTHOFMARKET.COM/#BLINDTEST",
                "accent_rgb": (251, 191, 36),
                "left_card": {
                    "title": "🎯 YOUR QUANT IQ QUIZ",
                    "val": "15-Sec Interactive",
                    "sub": "Test Your Chart Eye for Free",
                    "extra": "Instant Score & Explanation",
                    "rgb": (251, 191, 36),
                },
                "right_card": {
                    "title": "👑 VIP #2 & #3 UNLOCK",
                    "val": "3.41x & 3.17x Vol",
                    "sub": "Both Scoring 98/100 Today",
                    "extra": "truthofmarket.com",
                    "rgb": (16, 185, 129),
                },
            },
        ],
    },
    {
        "ep_num": 24,
        "slug": "EP24_10K_Account_Race_DipBuyer_vs_Quant",
        "outro_cta": "Simulate your own $10,000 portfolio at truthofmarket.com.",
        "beats": [
            {
                "caption": "We put $10,000 into a retail dip-buyer strategy versus $10,000 into our Right-Side PW-RSI quant engine.",
                "pill_text": "⚔️ $10,000 REAL ACCOUNT BATTLE · DIP BUYER VS QUANT",
                "chart_mode": "LEFT_TRAP",
                "chart_title": "TRADER A: $10,000 'BUY THE DIP' BELOW MA60",
                "chart_subtitle": "Buying $SMCI (-23% vs MA60) & $COIN (-21% vs MA60) with no stop-loss",
                "vol_banner": "❌ RESULT: 1 FALLING KNIFE WIPES OUT 3 YEARS OF GAINS",
                "accent_rgb": (239, 68, 68),
                "left_card": {
                    "title": "❌ TRADER A (DIP BUYER)",
                    "val": "$10,000 -> $5,200",
                    "sub": "-48.0% Account Drawdown",
                    "extra": "Needs +92% Just to Break Even!",
                    "rgb": (239, 68, 68),
                },
                "right_card": {
                    "title": "🟢 TRADER B (QUANT)",
                    "val": "$10,000 -> $22,697",
                    "sub": "+127% (5-Yr @ +17.81%/yr)",
                    "extra": "Max Loss Capped at -1.35%/Trade",
                    "rgb": (16, 185, 129),
                },
            },
            {
                "caption": "Trader A bought $SMCI and $COIN 22% below their 60-day moving average, turning $10,000 into $5,200.",
                "pill_text": "📉 WHY RETAIL ACCOUNTS BLOW UP: NO -9% HARD STOP",
                "chart_mode": "LEFT_TRAP",
                "chart_title": "THE -48% TRAP: HOLDING LOSERS BELOW MA60",
                "chart_subtitle": "A -48% loss requires a +92.3% gain just to get back to $10,000",
                "vol_banner": "🛑 NEVER RISK MORE THAN -1.35% OF TOTAL EQUITY ON ONE IDEA",
                "accent_rgb": (239, 68, 68),
                "left_card": {
                    "title": "💸 WITHOUT -9% STOP",
                    "val": "-$4,800 Lost",
                    "sub": "290+ Days Trapped Underwater",
                    "extra": "Emotional Averaging Down",
                    "rgb": (239, 68, 68),
                },
                "right_card": {
                    "title": "🛡️ WITH -9% HARD STOP",
                    "val": "-$135 Max Loss",
                    "sub": "15% Slot x -9% Stop = -1.35%",
                    "extra": "98.65% of Capital Protected!",
                    "rgb": (56, 189, 248),
                },
            },
            {
                "caption": "Trader B risked only $135 per trade with a strict 9% stop-loss on 2.46x volume breakouts like $CELH.",
                "pill_text": "🟢 THE 5.5x ASYMMETRIC PAYOFF · RISK $135 TO MAKE $750~$1,500",
                "chart_mode": "RIGHT_IGNITION",
                "chart_title": "TRADER B: $1,500 SLOT IN $CELH ($33.19 IGNITION)",
                "chart_subtitle": "If wrong: lose -$135 (-9% stop). If right: make +$750 to +$1,500 (+100%)",
                "vol_banner": "🟢 55.24% 2X WIN RATE ACROSS 2,938 VALIDATED TRADES",
                "accent_rgb": (16, 185, 129),
                "left_card": {
                    "title": "🛡️ IF WRONG (-9% STOP)",
                    "val": "-$135 Risk Only",
                    "sub": "Stop Price: $30.20 on $CELH",
                    "extra": "Only -1.35% of $10,000 Account",
                    "rgb": (251, 191, 36),
                },
                "right_card": {
                    "title": "🚀 IF RIGHT (+50%~+100%)",
                    "val": "+$750 ~ +$1,500",
                    "sub": "Target $49.79 ~ $66.38",
                    "extra": "5.5x to 11x Reward vs Risk",
                    "rgb": (16, 185, 129),
                },
            },
            {
                "caption": "Enter your own capital on truthofmarket.com and copy the exact dollar buy, stop, and profit ticket in 3 seconds.",
                "pill_text": "💰 LIVE 1:1 DOLLAR TRADE TICKET CALCULATOR ACTIVE NOW",
                "chart_mode": "ACCOUNT_RACE",
                "chart_title": "$10,000 -> $22,697 COMPOUNDING PLAYBOOK",
                "chart_subtitle": "Free 3-Second Position Doctor + Live 72-Stock PW-RSI Scanner",
                "vol_banner": "👉 SIMULATE YOUR PORTFOLIO AT TRUTHOFMARKET.COM",
                "accent_rgb": (56, 189, 248),
                "left_card": {
                    "title": "🩺 3-SEC POSITION DOCTOR",
                    "val": "100% Free Check",
                    "sub": "Type Any US Ticker & Avg Price",
                    "extra": "Instant Stop & Target Line",
                    "rgb": (56, 189, 248),
                },
                "right_card": {
                    "title": "🔥 TODAY'S TOP 3 PICKS",
                    "val": "#1 $CELH Free",
                    "sub": "#2 (3.41x) & #3 (3.17x) VIP",
                    "extra": "truthofmarket.com",
                    "rgb": (16, 185, 129),
                },
            },
        ],
    },
    {
        "ep_num": 25,
        "slug": "EP25_Top3_Institutional_Volume_Anomalies",
        "outro_cta": "See #1 $CELH free and unlock #2 & #3 at truthofmarket.com.",
        "beats": [
            {
                "caption": "Three US stocks just triggered extreme institutional volume anomalies across our 72-stock scanner today.",
                "pill_text": "🚨 INSTITUTIONAL RADAR · TOP 3 VOLUME ANOMALIES TODAY",
                "chart_mode": "RIGHT_IGNITION",
                "chart_title": "72-STOCK UNIVERSE SCAN: ONLY 5 IN IGNITION ZONE",
                "chart_subtitle": "67 stocks filtered out as noise or traps · Top 3 surging on 2.4x~3.4x volume",
                "vol_banner": "⚡ INSTITUTIONS CANNOT HIDE 3.41x VOLUME FOOTPRINTS",
                "accent_rgb": (16, 185, 129),
                "left_card": {
                    "title": "🔍 UNIVERSE FILTERED",
                    "val": "72 Liquid US Stocks",
                    "sub": "NYSE & NASDAQ Constituents",
                    "extra": "67 Wait/Trap · 5 Ignition",
                    "rgb": (56, 189, 248),
                },
                "right_card": {
                    "title": "🔥 TOP VOLUME SURGE",
                    "val": "Up to 3.41x Avg Vol",
                    "sub": "PW-RSI Score Up to 98 / 100",
                    "extra": "Right-Side MA60 Breakouts",
                    "rgb": (16, 185, 129),
                },
            },
            {
                "caption": "Number one is unlocked free right now: $CELH at $33.19, surging on 2.46x volume with a $30.20 stop-loss.",
                "pill_text": "🔓 #1 FREE DAILY SHOWCASE · $CELH ($33.19 · 2.46x VOL)",
                "chart_mode": "RIGHT_IGNITION",
                "chart_title": "#1 UNLOCKED: $CELH ($33.19 · SCORE 84/100)",
                "chart_subtitle": "10D Volume: 2.46x · Reclaimed MA60 (+12.7%) · Consumer Turnaround",
                "vol_banner": "🟢 ENTRY ZONE ACTIVE · HARD STOP $30.20 · TARGET $66.38",
                "accent_rgb": (16, 185, 129),
                "left_card": {
                    "title": "🟢 #1 $CELH (UNLOCKED)",
                    "val": "$33.19 (Vol 2.46x)",
                    "sub": "PW-RSI Quant Score: 84 / 100",
                    "extra": "100% Free on truthofmarket.com",
                    "rgb": (16, 185, 129),
                },
                "right_card": {
                    "title": "📐 $CELH RISK PLAN",
                    "val": "Stop $30.20 (-9%)",
                    "sub": "TP1: $66.38 (+100% Double)",
                    "extra": "-1.35% Max Portfolio Risk",
                    "rgb": (56, 189, 248),
                },
            },
            {
                "caption": "Number two and three are scoring 98 out of 100 with massive 3.41x and 3.17x institutional volume breakouts.",
                "pill_text": "🔒 #2 & #3 VIP IGNITION ANOMALIES · SCORE 98 / 100",
                "chart_mode": "ACCOUNT_RACE",
                "chart_title": "#2 VIP ($████ · 3.41x Vol) & #3 VIP ($████ · 3.17x Vol)",
                "chart_subtitle": "Highest PW-RSI Conviction (98/100) in the entire 72-stock universe",
                "vol_banner": "🔥 #2 SOLAR/AI POWER (3.41x VOL) · #3 FINTECH BREAKOUT (3.17x VOL)",
                "accent_rgb": (251, 191, 36),
                "left_card": {
                    "title": "🔒 #2 VIP IGNITION",
                    "val": "Score 98 · Vol 3.41x",
                    "sub": "+16.4% Above MA60 Breakout",
                    "extra": "AI Power / Clean Energy Leader",
                    "rgb": (251, 191, 36),
                },
                "right_card": {
                    "title": "🔒 #3 VIP IGNITION",
                    "val": "Score 98 · Vol 3.17x",
                    "sub": "Explosive Right-Side Base Break",
                    "extra": "High-Beta FinTech Leader",
                    "rgb": (251, 191, 36),
                },
            },
            {
                "caption": "Check $CELH for free and unlock the full 72-stock institutional scanner today at truthofmarket.com.",
                "pill_text": "👑 UNLOCK ALL 72 US STOCKS & PRO VIP VAULT ALERTS",
                "chart_mode": "RIGHT_IGNITION",
                "chart_title": "TRUTHOFMARKET.COM — INSTITUTIONAL ALPHA TERMINAL",
                "chart_subtitle": "15-Sec Chart Blind Test + 3-Sec Position Doctor + Pro VIP Vault",
                "vol_banner": "👉 VISIT TRUTHOFMARKET.COM RIGHT NOW",
                "accent_rgb": (16, 185, 129),
                "left_card": {
                    "title": "🆓 FREE VISITOR ACCESS",
                    "val": "#1 $CELH + Doctor",
                    "sub": "15-Sec Blind Test Included",
                    "extra": "No Sign-Up Required to Test",
                    "rgb": (56, 189, 248),
                },
                "right_card": {
                    "title": "👑 PRO VIP PASS",
                    "val": "$29/mo or $199 LTD",
                    "sub": "Unlocks All 72 Tickers & CSV",
                    "extra": "Store #296100 Instant Key",
                    "rgb": (16, 185, 129),
                },
            },
        ],
    },
]


async def build_single_v4_episode(ep: Dict) -> Tuple[Path, Path]:
    ep_num = ep["ep_num"]
    slug = ep["slug"]
    ep_work = WORK_DIR / f"ep{ep_num:02d}"
    ep_work.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"[V4 Engine] Synthesizing natural TTS for {slug}...")
    for idx, b in enumerate(ep["beats"]):
        wav_p = ep_work / f"beat_{idx:02d}.wav"
        dur = await synth_tts_natural(b["caption"], wav_p)
        b["wav_path"] = wav_p
        b["tts_dur"] = dur

    outro_wav_p = ep_work / "outro_cta.wav"
    outro_tts_dur = await synth_tts_natural(ep["outro_cta"], outro_wav_p)
    ep["beats"][-1]["outro_wav_path"] = outro_wav_p
    outro_dur = max(3.25, outro_tts_dur + 0.35)

    master_wav = ep_work / f"{slug}_master.wav"
    timings, total_dur = build_master_audio(ep["beats"], outro_dur, master_wav)
    total_frames = int(round(total_dur * FPS))
    print(f"[V4 Engine] Rendering {total_frames} frames ({total_dur:.2f}s @ {FPS}fps) for {slug}...")

    bg_base = prepare_dark_bg()
    yt_out = OUT_DIR / f"{slug}_YT_Shorts.mp4"
    ig_out = OUT_DIR / f"{slug}_IG_Reels.mp4"
    tmp_mp4 = ep_work / f"{slug}_raw.mp4"

    cmd = [
        FFMPEG_EXE,
        "-y",
        "-f",
        "rawvideo",
        "-vcodec",
        "rawvideo",
        "-s",
        f"{W}x{H}",
        "-pix_fmt",
        "rgb24",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-i",
        str(master_wav),
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "18",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-shortest",
        "-movflags",
        "+faststart",
        str(tmp_mp4),
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    body_end_t = timings[-1][1]

    for f_idx in range(total_frames):
        t = f_idx / float(FPS)
        if t < body_end_t:
            # Find active beat
            active_b = ep["beats"][-1]
            b_start, b_end = timings[-1]
            for b_idx, (st, et) in enumerate(timings):
                if st <= t < et:
                    active_b = ep["beats"][b_idx]
                    b_start, b_end = st, et
                    break
            prog = (t - b_start) / max(0.001, (b_end - b_start))
            img = draw_chart_hud_frame(bg_base, active_b, prog, t)
        else:
            prog = (t - body_end_t) / max(0.001, outro_dur)
            img = draw_outro_slate_frame(bg_base, prog, ep["outro_cta"])

        proc.stdin.write(img.tobytes())

    proc.stdin.close()
    proc.wait()
    if proc.returncode != 0:
        raise RuntimeError(f"FFmpeg encode failed for {slug}")

    shutil.copy2(tmp_mp4, yt_out)
    shutil.copy2(tmp_mp4, ig_out)

    # Also sync to EP{ep_num:02d}_US_Viral_Shorts.mp4 (+ _YT_Shorts / _IG_Reels) used by daily_6am_shorts_sender.py
    us_base = OUT_DIR / f"EP{ep_num:02d}_US_Viral_Shorts.mp4"
    us_yt = OUT_DIR / f"EP{ep_num:02d}_US_Viral_Shorts_YT_Shorts.mp4"
    us_ig = OUT_DIR / f"EP{ep_num:02d}_US_Viral_Shorts_IG_Reels.mp4"
    shutil.copy2(tmp_mp4, us_base)
    shutil.copy2(tmp_mp4, us_yt)
    shutil.copy2(tmp_mp4, us_ig)
    try:
        sys.path.insert(0, str(BASE_DIR))
        from scripts.render_dual_yt_ig_cta import ensure_dual_videos

        ensure_dual_videos(str(us_base), "TOM", force=True)
    except Exception as e_dual:
        print(f"[V4 Engine] Dual CTA note: {e_dual}")

    # Export official .srt captions + @RightSideAlpha YouTube upload metadata (22:00 KST = 08:00 EST)
    def _fmt_srt_ts(sec: float) -> str:
        s = max(0.0, float(sec))
        hh = int(s // 3600)
        mm = int((s % 3600) // 60)
        ss = int(s % 60)
        ms = int(round((s - int(s)) * 1000))
        if ms >= 1000:
            ms -= 1000
            ss += 1
        return f"{hh:02d}:{mm:02d}:{ss:02d},{ms:03d}"

    srt_blocks = []
    for c_idx, (st, et) in enumerate(timings, 1):
        srt_blocks.append(f"{c_idx}\n{_fmt_srt_ts(st)} --> {_fmt_srt_ts(et)}\n{ep['beats'][c_idx - 1]['caption']}\n")
    srt_blocks.append(f"{len(timings) + 1}\n{_fmt_srt_ts(body_end_t)} --> {_fmt_srt_ts(total_dur)}\n{ep['outro_cta']}\n")
    srt_text = "\n".join(srt_blocks)
    yt_out.with_suffix(".srt").write_text(srt_text, encoding="utf-8")
    us_base.with_suffix(".srt").write_text(srt_text, encoding="utf-8")

    yt_meta = {
        "channel_handle": "@RightSideAlpha",
        "channel_profile_link": "https://truthofmarket.com/?view=semi",
        "snippet": {
            "title": f"{slug.replace('_', ' ')} #Shorts"[:55],
            "description": (
                "🖥️ Live 72-Stock Breakout Scanner & Free 3s Position Doctor "
                "👉 Tap truthofmarket.com in @RightSideAlpha channel bio!\n\n"
                "🔗 Free Position Doctor: https://truthofmarket.com/?tool=doctor\n"
                "🌡️ Semi Fear & Greed: https://truthofmarket.com/?view=semi\n"
                "💬 Support Fallback: https://t.me/truthofmarketss\n\n"
                "#Shorts #USStocks #SwingTrading #BreakoutTrading #TechnicalAnalysis"
            ),
            "tags": ["us stocks", "swing trading", "breakout trading", "technical analysis", "NVDA", "SMH", "CELH"],
            "categoryId": "27",
            "defaultLanguage": "en-US",
            "defaultAudioLanguage": "en-US",
        },
        "status": {
            "privacyStatus": "private",
            "selfDeclaredMadeForKids": False,
            "publishAt_schedule_kst": "22:00:00+09:00",
        },
    }
    yt_out.with_suffix(".youtube.json").write_text(json.dumps(yt_meta, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"[V4 Engine] Completed: {yt_out.name}, {us_base.name} ({yt_out.stat().st_size // 1024} KB)")
    return yt_out, ig_out


async def main():
    for ep in EPISODES_V4:
        await build_single_v4_episode(ep)


if __name__ == "__main__":
    asyncio.run(main())
