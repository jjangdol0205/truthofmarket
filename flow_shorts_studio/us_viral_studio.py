# -*- coding: utf-8 -*-
"""
================================================================================
🎬 US Viral Shorts & Reels Pro Studio Engine (No-AI-Slop Edition)
================================================================================
미국 유튜브 쇼츠 & 인스타 릴스 인기 채널(Zack D. Films, Vox, MagnatesMedia,
Dark Luxury Listicle)의 실제 프리미어 프로 / 애프터이펙트 편집 기법을 구현한 스튜디오 엔진.

핵심 차별점 (왜 '싼티 나는 AI 느낌'이 전혀 없는가?):
1. [원테이크 자연 호흡 성우 + 단어 단위(WordBoundary) 0.01초 싱크]
   - 문장을 쪼개서 녹음하지 않고 전체 대본을 한 번의 호흡으로 녹음해 실제 다큐멘터리 내레이터 억양 구현
   - edge-tts의 WordBoundary 타임스탬프를 추출해 현재 발음 중인 단어만 색상이 바뀌며 커지는
     실제 미국 쇼츠 표준 'Active-Word Kinetic Caption' 구현 (촌스러운 반투명 자막 박스 제거)
2. [멀티 앵글 4컷 전환 + 핸드헬드 짐벌 흔들림 + 35mm 필름 그레인]
   - 사진 1장으로 버티지 않고 이야기 흐름에 맞춰 2.5~3.5초마다 4개의 카메라 샷 전환
   - 컷 전환 시 4프레임 휩(Whip) 줌 + 노출 플래시(Flash) + 컷 전환 효과음(Whoosh & Sub-Thud SFX) 동기화
   - 미세한 핸드헬드 카메라 호흡과 아날로그 35mm 필름 그레인을 입혀 인위적인 AI 광택 제거
3. [프로 사운드 디자인 (SFX + 로우패스 필터 스튜디오 BGM)]
   - 컷 전환마다 들어가는 시네마틱 우쉬(Whoosh), 심장박동 서브베이스(Heartbeat Sub),
     카메라 셔터/틱(Tick) 효과음과 로우패스 필터링된 다크 앰비언트 트랙 믹싱
================================================================================
"""

import os
import sys
import math
import wave
import asyncio
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import edge_tts
import edge_tts.communicate as _edge_comm
import imageio_ffmpeg

# Windows 시스템 루트 인증서 로드
try:
    _edge_comm._SSL_CTX.load_default_certs()
except Exception:
    pass

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "ai_shorts_output"
ASSETS_DIR = OUTPUT_DIR / "assets"
TEMP_DIR = OUTPUT_DIR / "temp_us"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
ASSETS_DIR.mkdir(parents=True, exist_ok=True)
TEMP_DIR.mkdir(parents=True, exist_ok=True)

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

WIDTH = 1080
HEIGHT = 1920
FPS = 30
GOLDEN_SAFE_Y = 1060  # YouTube Shorts Golden Safe Zone (avoids bottom 3-line title/bio overlay)

FONT_IMPACT = r"C:\Windows\Fonts\impact.ttf"
FONT_ARIAL_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_ARIAL_REG = r"C:\Windows\Fonts\arial.ttf"
FONT_SEGOE_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_SEGOE_REG = r"C:\Windows\Fonts\segoeui.ttf"


# ==============================================================================
# 0. 영문 발음 숫자·티커·보조지표 → 화면 표기 자동 정규화 & 정식 .SRT 추출기
# ==============================================================================
_MULTIWORD_CAPTION_RULES = [
    (("sixty", "day", "m", "a"), "60-DAY MA"),
    (("sixty-day", "m", "a"), "60-DAY MA"),
    (("sixty", "day", "moving", "average"), "60-DAY MA"),
    (("sixty-day", "moving", "average"), "60-DAY MA"),
    (("sixty", "day", "moving", "averages"), "60-DAY MA"),
    (("sixty-day", "moving", "averages"), "60-DAY MA"),
    (("sixty", "day", "trendline"), "60-DAY MA"),
    (("sixty-day", "trendline"), "60-DAY MA"),
    (("sixty", "day", "line"), "60-DAY MA"),
    (("sixty-day", "line"), "60-DAY MA"),
    (("twenty", "day", "m", "a"), "20-DAY MA"),
    (("twenty-day", "m", "a"), "20-DAY MA"),
    (("twenty", "day", "moving", "average"), "20-DAY MA"),
    (("twenty-day", "moving", "average"), "20-DAY MA"),
    (("twenty", "and", "sixty-day", "moving", "averages"), "20 & 60-DAY MA"),
    (("minus", "nine", "percent"), "-9.0%"),
    (("plus", "one", "hundred", "percent"), "+100%"),
    (("twenty-five", "percent"), "25%"),
    (("twenty", "five", "percent"), "25%"),
    (("forty-eight", "percent"), "48%"),
    (("forty", "eight", "percent"), "48%"),
    (("twenty-three", "percent"), "23%"),
    (("twenty", "three", "percent"), "23%"),
    (("ninety", "percent"), "90%"),
    (("eighty", "percent"), "80%"),
    (("seventy", "percent"), "70%"),
    (("sixty", "percent"), "60%"),
    (("fifty", "percent"), "50%"),
    (("forty", "percent"), "40%"),
    (("thirty", "percent"), "30%"),
    (("twenty", "percent"), "20%"),
    (("twelve", "percent"), "12%"),
    (("ten", "percent"), "10%"),
    (("nine", "percent"), "9.0%"),
    (("one", "point", "eight", "times"), "1.8X"),
    (("one", "point", "five"), "1.5X"),
    (("two", "times"), "2X"),
    (("two", "x"), "2X"),
    (("three", "seconds"), "3-SEC"),
    (("fifty-two", "week"), "52-WEEK"),
    (("twenty-six", "year"), "26-YEAR"),
    (("twenty-six", "years"), "26-YEAR"),
    (("truthofmarket", "dot", "com"), "TRUTHOFMARKET.COM"),
]

_SINGLE_TOKEN_MAP = {
    "SIXTY": "60",
    "FORTY": "40",
    "FIFTY": "50",
    "THIRTY": "30",
    "TWENTY": "20",
    "SEVENTY": "70",
    "EIGHTY": "80",
    "NINETY": "90",
    "EIGHTEEN": "18",
    "TWELVE": "12",
    "TEN": "10",
    "NINE": "9",
    "EIGHT": "8",
    "SEVEN": "7",
    "SIX": "6",
    "FIVE": "5",
    "THREE": "3",
    "TWO-X": "2X",
    "SIXTY-DAY": "60-DAY",
    "TWENTY-DAY": "20-DAY",
    "TWENTY-FOUR": "24",
    "TWENTY-FIVE": "25",
    "TWENTY-SIX": "26",
    "FORTY-EIGHT": "48",
    "FIFTY-TWO": "52",
    "SEVENTY-TWO": "72",
    "SEVENTY-FIVE": "75",
    "EIGHTY-TWENTY": "80:20",
    "NVIDIA": "$NVDA",
    "NVDA": "$NVDA",
    "TESLA": "$TSLA",
    "TSLA": "$TSLA",
    "PALANTIR": "$PLTR",
    "PLTR": "$PLTR",
    "CELH": "$CELH",
    "SMH": "$SMH",
    "XLV": "$XLV",
    "SOXL": "$SOXL",
    "SOXX": "$SOXX",
    "QQQ": "$QQQ",
    "AMD": "$AMD",
    "SMCI": "$SMCI",
}


def _split_punct(raw: str) -> tuple[str, str, str]:
    lead = ""
    trail = ""
    s = raw.strip()
    while s and s[0] in "\"'([":
        lead += s[0]
        s = s[1:]
    while s and s[-1] in ".,?!:;\"')]":
        trail = s[-1] + trail
        s = s[:-1]
    return lead, s, trail


def normalize_caption_token(token: str) -> str:
    """발음용 영단어/티커를 즉각 인지 가능한 숫자·기호($NVDA, 60, 40, -9.0%)로 변환합니다."""
    lead, core, trail = _split_punct(token)
    if not core:
        return token.upper()
    possessive = ""
    if core.upper().endswith("'S"):
        possessive = "'S"
        core = core[:-2]
    mapped = _SINGLE_TOKEN_MAP.get(core.upper(), core.upper())
    return f"{lead}{mapped}{possessive}{trail}"


def normalize_spoken_words(words: list) -> list:
    """WordBoundary 단어 리스트에서 다중 어절 숫자/지표 표현을 병합하고 기호로 정규화합니다."""
    if not words:
        return []
    out = []
    n = len(words)
    i = 0
    while i < n:
        matched = False
        for pat, replacement in _MULTIWORD_CAPTION_RULES:
            k = len(pat)
            if i + k <= n:
                seq = [_split_punct(words[i + j]["word"])[1].lower() for j in range(k)]
                if tuple(seq) == pat:
                    _, _, last_trail = _split_punct(words[i + k - 1]["word"])
                    start_s = words[i]["start"]
                    end_s = words[i + k - 1]["end"]
                    out.append({
                        "word": f"{replacement}{last_trail}",
                        "start": start_s,
                        "end": end_s,
                        "duration": max(0.08, end_s - start_s),
                    })
                    i += k
                    matched = True
                    break
        if not matched:
            w_copy = dict(words[i])
            w_copy["word"] = normalize_caption_token(w_copy["word"])
            out.append(w_copy)
            i += 1
    return out


def _format_srt_timestamp(sec: float) -> str:
    ms_total = max(0, int(round(sec * 1000.0)))
    hh = ms_total // 3_600_000
    rem = ms_total % 3_600_000
    mm = rem // 60_000
    rem %= 60_000
    ss = rem // 1000
    ms = rem % 1000
    return f"{hh:02d}:{mm:02d}:{ss:02d},{ms:03d}"


def export_srt(phrase_groups: list, out_srt: Path) -> Path:
    """WordBoundary 구절 그룹(또는 단일 단어 리스트)을 유튜브/편집기 표준 SubRip(.srt) 자막 파일로 정식 추출합니다."""
    out_srt = Path(out_srt)
    out_srt.parent.mkdir(parents=True, exist_ok=True)
    if phrase_groups and isinstance(phrase_groups[0], dict) and "words" not in phrase_groups[0] and "word" in phrase_groups[0]:
        phrase_groups = group_words_into_phrases(phrase_groups)
    blocks = []
    for idx, g in enumerate(phrase_groups, 1):
        st = _format_srt_timestamp(float(g.get("start", 0.0)))
        et = _format_srt_timestamp(max(float(g.get("start", 0.0)) + 0.12, float(g.get("end", 0.12))))
        line_txt = " ".join(normalize_caption_token(w["word"]) for w in g.get("words", [])).strip()
        if not line_txt:
            continue
        blocks.append(f"{idx}\n{st} --> {et}\n{line_txt}\n")
    out_srt.write_text("\n".join(blocks), encoding="utf-8")
    return out_srt


def load_font(path: str, size: int) -> ImageFont.FreeTypeFont:
    for candidate in [path, FONT_SEGOE_BOLD, FONT_ARIAL_BOLD]:
        if os.path.exists(candidate):
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


# ==============================================================================
# 1. 원테이크 자연 성우 합성 + 단어별(WordBoundary) 정밀 타임스탬프 추출
# ==============================================================================
async def synthesize_natural_voice_with_words(
    full_script: str,
    voice: str,
    out_mp3: Path,
    out_wav: Path,
    rate: str = "+4%",
    pitch: str = "+0Hz",
):
    """
    전체 스크립트를 끊지 않고 한 번에 합성하여 실제 사람처럼 자연스러운 억양을 만들고,
    동시에 모든 단어의 정확한 시작/종료 초(sec)를 추출합니다.
    """
    comm = edge_tts.Communicate(
        text=full_script,
        voice=voice,
        rate=rate,
        pitch=pitch,
        boundary="WordBoundary",
    )
    words = []
    with open(out_mp3, "wb") as audio_file:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                audio_file.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                w_text = chunk["text"].strip()
                start_s = chunk["offset"] / 1e7
                dur_s = max(0.08, chunk["duration"] / 1e7)
                if w_text:
                    words.append({
                        "word": w_text,
                        "start": start_s,
                        "end": start_s + dur_s,
                        "duration": dur_s,
                    })

    # 44.1kHz 스테레오 WAV 변환 + 끝에 0.45초 자연스러운 루프 여운 추가
    cmd = [
        FFMPEG_EXE, "-y",
        "-i", str(out_mp3),
        "-af", "apad=pad_dur=0.45",
        "-ar", "44100",
        "-ac", "2",
        str(out_wav),
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    with wave.open(str(out_wav), "rb") as wf:
        total_dur = wf.getnframes() / float(wf.getframerate())

    return words, total_dur


def group_words_into_phrases(words: list, max_words_per_group: int = 3, max_chars: int = 20) -> list:
    """
    단어 타임스탬프 리스트를 기호 정규화($NVDA, 60-DAY MA, -9.0%)한 뒤
    미국 쇼츠 표준인 2~3단어 묶음(Phrase Chunk)으로 그룹화합니다.
    구두점(., ?, !, —)이 나오면 즉시 구절을 끊어 호흡과 시각적 리듬을 일치시킵니다.
    """
    words = normalize_spoken_words(words)
    groups = []
    cur = []
    cur_chars = 0

    for w in words:
        token = w["word"]
        if cur and (len(cur) >= max_words_per_group or (cur_chars + len(token) > max_chars)):
            groups.append({
                "start": cur[0]["start"],
                "end": cur[-1]["end"],
                "words": cur,
            })
            cur = []
            cur_chars = 0

        cur.append(w)
        cur_chars += len(token) + 1

        if any(token.endswith(p) for p in [".", "?", "!", ",", ";", ":"]):
            groups.append({
                "start": cur[0]["start"],
                "end": cur[-1]["end"],
                "words": cur,
            })
            cur = []
            cur_chars = 0

    if cur:
        groups.append({
            "start": cur[0]["start"],
            "end": cur[-1]["end"],
            "words": cur,
        })

    # 구절 간 빈틈을 부드럽게 메워 자막이 깜빡거리지 않게 보정
    for i in range(len(groups) - 1):
        gap = groups[i + 1]["start"] - groups[i]["end"]
        if 0 < gap < 0.35:
            groups[i]["end"] = groups[i + 1]["start"]

    return groups


# ==============================================================================
# 2. 스튜디오 사운드 디자인 엔진 (다크 다큐 BGM 5종 로테이션 + 포인트 SFX + -0.5dBFS 리미터)
# ==============================================================================
_DOCU_BGM_ROTATION = [
    # Preset 0: Wall Street Midnight Pulse (Bloomberg / MagnatesMedia tension)
    {"name": "wall_street_pulse", "notes": [110.0, 130.81, 98.00, 123.47], "arp": [220.0, 261.63, 329.63, 246.94], "beat_hz": 1.90, "lp_taps": 14},
    # Preset 1: Cold Quant Strings (Institutional macro cello harmonics)
    {"name": "cold_quant_strings", "notes": [82.41, 98.00, 73.42, 92.50], "arp": [164.81, 246.94, 196.00, 220.00], "beat_hz": 1.55, "lp_taps": 18},
    # Preset 2: Dark Semiconductor Chamber (Zack D. / Vox investigative pacing)
    {"name": "dark_semi_chamber", "notes": [92.50, 110.00, 82.41, 103.83], "arp": [277.18, 220.00, 246.94, 311.13], "beat_hz": 2.00, "lp_taps": 12},
    # Preset 3: Deep Liquidity Noir (Warm filtered analog bass + pluck)
    {"name": "deep_liquidity_noir", "notes": [73.42, 87.31, 65.41, 82.41], "arp": [220.26, 174.61, 196.23, 247.23], "beat_hz": 1.35, "lp_taps": 20},
    # Preset 4: Asymmetric Alpha Documentary (Crisp rhythmic pulse + warm fifths)
    {"name": "asymmetric_alpha_docu", "notes": [98.00, 116.54, 87.31, 110.00], "arp": [294.00, 233.08, 261.63, 329.63], "beat_hz": 1.75, "lp_taps": 16},
]


def _warm_filtered_osc(freq: float, t: np.ndarray, phase_offset: float, lp_taps: int) -> np.ndarray:
    """순수 np.sin 기계음 드론을 배제하고 삼각파·배음 감쇠 + 로우패스 필터로 따뜻한 현악/아날로그 질감을 생성합니다."""
    ph = 2.0 * np.pi * freq * t + phase_offset
    # Triangle-like warm acoustic body + gentle fifth/octave overtones (zero harsh pure-sine buzz)
    tri = (2.0 / np.pi) * np.arcsin(np.sin(ph))
    fifth = 0.22 * (2.0 / np.pi) * np.arcsin(np.sin(ph * 1.498 + 0.4))
    sub_warm = 0.18 * np.tanh(1.4 * np.sin(ph * 0.5 + 0.2))
    raw = 0.60 * tri + fifth + sub_warm
    if lp_taps > 1 and len(raw) > lp_taps:
        kernel = np.hanning(lp_taps + 2)[1:-1]
        kernel /= np.sum(kernel)
        return np.convolve(raw, kernel, mode="same")
    return raw


def build_studio_soundtrack(
    voice_wav: Path,
    cut_times: list,
    total_duration: float,
    style: str,
    final_wav: Path,
):
    """
    고정 시드(default_rng(42)) 및 순수 사인파(np.sin) 기계음 드론을 완전히 탈피하여,
    영상별 동적 시드로 로테이션되는 5종 다크 다큐멘터리 BGM(로우패스 현악/플럭 텍스처)과
    포인트 효과음(0초 훅 임팩트·컷 우쉬·수치 핑), -0.5 dBFS 리미터를 합성합니다.
    """
    sr = 44100
    total_samples = max(1, int(total_duration * sr))
    t = np.linspace(0, total_duration, total_samples, endpoint=False)

    # 영상 파일명 + 스타일 기반 동적 시드 및 다크 다큐 BGM 프리셋 로테이션 (고정 시드 42 영구 폐기)
    seed_key = f"{Path(final_wav).stem}:{style}:{round(total_duration, 2)}"
    dyn_seed = (sum((idx + 1) * ord(ch) for idx, ch in enumerate(seed_key)) * 2654435761) % 2147483647 or 20261111
    rng = np.random.default_rng(dyn_seed)
    preset_idx = dyn_seed % len(_DOCU_BGM_ROTATION)
    preset = _DOCU_BGM_ROTATION[preset_idx]

    notes = preset["notes"]
    arp_notes = preset["arp"]
    beat_hz = preset["beat_hz"] if style not in ("reels_luxury", "history") else max(1.25, preset["beat_hz"] - 0.25)
    lp_taps = preset["lp_taps"]

    left = np.zeros(total_samples, dtype=np.float64)
    right = np.zeros(total_samples, dtype=np.float64)

    sec_per_note = total_duration / len(notes)
    for idx, f0 in enumerate(notes):
        s_t = idx * sec_per_note
        e_t = (idx + 1) * sec_per_note
        env = np.clip((t - s_t) / 0.75, 0, 1) * np.clip((e_t - t) / 0.75, 0, 1)
        # 호흡감 있는 다큐멘터리 바운스 모듈레이션 (정적인 일자 드론 방지)
        swell = 0.72 + 0.28 * np.cos(2.0 * np.pi * (beat_hz * 0.5) * t)
        pad_l = _warm_filtered_osc(f0 * 0.999, t, 0.15 * idx, lp_taps) * swell
        pad_r = _warm_filtered_osc(f0 * 1.001, t, 0.55 + 0.15 * idx, lp_taps) * swell
        left += 0.20 * pad_l * env
        right += 0.20 * pad_r * env

    # 다큐멘터리 스타일 댐핑 어쿠스틱 플럭(Damped Arpeggio Pluck) — 긴장감 있는 지성적 리듬감 부여
    step_sec = 1.0 / max(0.8, beat_hz)
    n_steps = int(total_duration / step_sec)
    for s_i in range(n_steps):
        st_idx = int(s_i * step_sec * sr)
        pl_len = min(int(step_sec * 0.85 * sr), total_samples - st_idx)
        if pl_len <= 32:
            continue
        pt = np.linspace(0.0, pl_len / sr, pl_len, endpoint=False)
        f_arp = arp_notes[s_i % len(arp_notes)]
        pluck_env = np.exp(-pt * 6.8) * np.minimum(1.0, pt / 0.008)
        pluck_wave = _warm_filtered_osc(f_arp, pt, 0.2 * (s_i % 4), max(6, lp_taps // 2)) * pluck_env * 0.075
        pan_r = 0.35 + 0.30 * ((s_i % 3) / 2.0)
        left[st_idx:st_idx + pl_len] += pluck_wave * (1.0 - pan_r * 0.4)
        right[st_idx:st_idx + pl_len] += pluck_wave * (0.6 + pan_r * 0.4)

    # 부드러운 로우엔드 다큐멘터리 펄스 킥 (클리핑 없는 소프트 새추레이션)
    beat_phase = (t * beat_hz) % 1.0
    kick_env = np.exp(-beat_phase * 8.2)
    kick_phase = 2.0 * np.pi * (52.0 * t + 1.8 * (1.0 - np.exp(-beat_phase * 16.0)) / 16.0)
    kick = 0.18 * np.tanh(1.3 * np.sin(kick_phase)) * kick_env
    left += kick
    right += kick

    if style == "science":
        tick_phase = (t * beat_hz) % 1.0
        tick_env = np.exp(-tick_phase * 70.0)
        noise_tick = np.convolve(rng.normal(0, 1, total_samples) * tick_env * 0.038, np.ones(6) / 6.0, mode="same")
        left += noise_tick * 0.85
        right += noise_tick * 1.0

    # --- 컷 전환 시점(cut_times)마다 시네마틱 Whoosh + Sub-Impact 효과음 삽입 ---
    all_impacts = [0.02] + list(cut_times)
    for imp_i, c_t in enumerate(all_impacts):
        idx_center = int(c_t * sr)
        win = int(0.36 * sr)
        i_start = max(0, idx_center - win // 2)
        i_end = min(total_samples, idx_center + win // 2)
        if i_end <= i_start:
            continue
        local_t = np.linspace(-0.18, 0.18, i_end - i_start)
        w_env = np.exp(-(local_t / 0.072) ** 2)
        sweep_phase = 2.0 * np.pi * np.cumsum(np.linspace(115.0, 44.0, i_end - i_start)) / sr
        sub_thump = 0.32 * np.tanh(1.25 * np.sin(sweep_phase)) * w_env
        whoosh_noise = rng.normal(0, 1, i_end - i_start) * w_env * 0.11
        kernel = np.hanning(22)[1:-1]
        kernel /= np.sum(kernel)
        whoosh_smooth = np.convolve(whoosh_noise, kernel, mode="same")
        pan = np.linspace(0.25, 0.75, i_end - i_start) if imp_i % 2 == 0 else np.linspace(0.75, 0.25, i_end - i_start)
        left[i_start:i_end] += sub_thump + whoosh_smooth * (1.0 - pan)
        right[i_start:i_end] += sub_thump + whoosh_smooth * pan

    # 전체 페이드 인/아웃
    fade = np.clip(t / 0.22, 0, 1) * np.clip((total_duration - t) / 0.55, 0, 1)
    left *= fade
    right *= fade

    # 성우 음성과 사이드체인 덕킹 믹싱
    if voice_wav and voice_wav.exists():
        with wave.open(str(voice_wav), "rb") as wf:
            v_raw = wf.readframes(wf.getnframes())
            n_ch = wf.getnchannels()
            v_flat = np.frombuffer(v_raw, dtype=np.int16).astype(np.float64) / 32768.0
            v_arr = v_flat.reshape(-1, 2) if n_ch == 2 else np.column_stack([v_flat, v_flat])
        m_len = min(total_samples, len(v_arr))
        v_mono = np.abs(v_arr[:m_len, 0])
        duck_kernel = np.ones(int(sr * 0.14)) / float(int(sr * 0.14))
        v_env = np.convolve(v_mono, duck_kernel, mode="same")
        bgm_gain = np.clip(0.58 - v_env * 1.35, 0.24, 0.58)

        final_l = v_arr[:m_len, 0] * 1.12 + left[:m_len] * bgm_gain
        final_r = v_arr[:m_len, 1] * 1.12 + right[:m_len] * bgm_gain
    else:
        final_l = left * 0.82
        final_r = right * 0.82

    # Strict -0.5 dBFS Anti-Clipping Limiter (ceiling <= 0.891, zero clipped samples)
    stereo = np.vstack((final_l, final_r)).T
    peak = float(np.max(np.abs(stereo))) if stereo.size else 0.0
    ceiling = 0.891  # -1.0 dBFS safety margin inside -0.5 dBFS spec
    if peak > ceiling:
        stereo = np.tanh(stereo / peak * 1.08)
        stereo *= ceiling / float(np.max(np.abs(stereo)))
    stereo = np.clip(stereo, -ceiling, ceiling)
    pcm = (stereo * 32767).astype(np.int16)

    with wave.open(str(final_wav), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(pcm.tobytes())


# ==============================================================================
# 3. 프로 카메라 워크 (핸드헬드 짐벌 무빙 + 컷 전환 휩/플래시 + 35mm 필름 그레인)
# ==============================================================================
def render_camera_motion(
    img: Image.Image,
    t_local: float,
    shot_dur: float,
    shot_idx: int,
    whip_intensity: float = 0.0,
) -> Image.Image:
    """
    단순 직선 줌이 아니라 실제 카메라맨이 짐벌을 들고 찍은 듯한 미세한 핸드헬드 호흡과
    컷 전환 직후 0.12초간의 광학 휩(Whip Zoom) 효과를 적용합니다.
    """
    prog = np.clip(t_local / max(0.01, shot_dur), 0.0, 1.0)
    # 샷마다 줌인 / 줌아웃 교차로 역동성 부여
    if shot_idx % 2 == 0:
        base_zoom = 1.04 + 0.11 * (prog * prog * (3 - 2 * prog))
    else:
        base_zoom = 1.15 - 0.10 * (prog * prog * (3 - 2 * prog))

    # 컷 전환 순간의 빠른 카메라 휩(Whip) 줌인 보정
    zoom = base_zoom + whip_intensity * 0.09

    src_w, src_h = img.size
    aspect_target = WIDTH / float(HEIGHT)
    aspect_src = src_w / float(src_h)

    if aspect_src > aspect_target:
        base_h = src_h
        base_w = int(src_h * aspect_target)
    else:
        base_w = src_w
        base_h = int(src_w / aspect_target)

    crop_w = base_w / zoom
    crop_h = base_h / zoom

    # 유기적인 핸드헬드 카메라 드리프트 (사인파 합성)
    sway_x = math.sin(t_local * 1.8 + shot_idx * 1.7) * 18.0 + math.cos(t_local * 0.9) * 10.0
    sway_y = math.cos(t_local * 1.4 + shot_idx * 2.3) * 14.0

    cx = (src_w / 2.0) + sway_x
    cy = (src_h / 2.0) + sway_y

    x1 = max(0.0, min(src_w - crop_w, cx - crop_w / 2.0))
    y1 = max(0.0, min(src_h - crop_h, cy - crop_h / 2.0))

    frame = img.crop((x1, y1, x1 + crop_w, y1 + crop_h)).resize((WIDTH, HEIGHT), Image.Resampling.BICUBIC)

    # 컷 전환 순간(whip_intensity > 0) 미세한 시네마틱 노출 플래시 효과
    if whip_intensity > 0.05:
        enhancer = ImageEnhance.Brightness(frame)
        frame = enhancer.enhance(1.0 + whip_intensity * 0.28)

    return frame


# 미리 생성해 두는 35mm 아날로그 필름 그레인 & 광학 비네팅 텍스처 (AI 플라스틱 느낌 제거용)
_GRAIN_FRAMES = []


def init_film_grain_cache(num_frames: int = 12):
    global _GRAIN_FRAMES
    if _GRAIN_FRAMES:
        return
    rng = np.random.default_rng(1999)
    y_g = np.linspace(-1, 1, HEIGHT)[:, None]
    x_g = np.linspace(-1, 1, WIDTH)[None, :]
    rad = np.sqrt(x_g ** 2 + y_g ** 2)
    vig = np.clip(1.0 - 0.32 * (rad ** 2.2), 0.55, 1.0)
    # 하단 자막 영역(y > 0.45) 자연스러운 다크 그라데이션
    bottom_shade = np.where(y_g > 0.25, np.clip(1.0 - (y_g - 0.25) * 0.55, 0.42, 1.0), 1.0)
    combined_mask = (vig * bottom_shade)[..., None]

    for _ in range(num_frames):
        noise = rng.normal(0.0, 5.5, (HEIGHT // 2, WIDTH // 2, 1)).astype(np.float32)
        noise_full = np.repeat(np.repeat(noise, 2, axis=0), 2, axis=1)
        _GRAIN_FRAMES.append((combined_mask, noise_full))


def apply_film_look(frame_rgb: Image.Image, frame_idx: int) -> Image.Image:
    init_film_grain_cache()
    mask, grain = _GRAIN_FRAMES[frame_idx % len(_GRAIN_FRAMES)]
    arr = np.asarray(frame_rgb, dtype=np.float32)
    arr = arr * mask + grain
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, mode="RGB")


# ==============================================================================
# 4. 미국 쇼츠 표준 'Active-Word Kinetic Caption' 렌더러 (박스 없는 단어별 팝업 자막)
# ==============================================================================
def draw_active_word_captions(
    overlay_draw: ImageDraw.ImageDraw,
    phrase_groups: list,
    t: float,
    accent_color: tuple = (0, 245, 212, 255),
    danger_words: set = None,
    y_pos: int = GOLDEN_SAFE_Y,
):
    """
    현재 시점(t)에 발화 중인 2~3단어 구절을 유튜브 쇼츠 골든 세이프존(y_pos=1060)에 표시하되,
    숫자·티커·지표를 자동 기호화($NVDA, 60-DAY MA, -9.0%)하고 현재 발화 단어만 팝업 렌더링합니다.
    """
    if danger_words is None:
        danger_words = {
            "toxic", "shrinks", "plaque", "damage", "deadly", "die", "stop", "never",
            "illegal", "survive", "blood", "poison", "crash", "trap", "wiped", "suicide", "-9.0%",
        }

    active_group = None
    for g in phrase_groups:
        if g["start"] - 0.06 <= t <= g["end"] + 0.08:
            active_group = g
            break

    if not active_group:
        return

    font_normal = load_font(FONT_SEGOE_BOLD, 84)
    font_active = load_font(FONT_SEGOE_BOLD, 90)

    words = active_group["words"]
    # 구절 등장 첫 0.08초 동안 전체 구절이 살짝 떠오르는 모션
    group_age = max(0.0, t - active_group["start"])
    pop_y = int(max(0.0, (0.08 - group_age) / 0.08) * 20)

    # 각 단어 폭 계산하여 중앙 정렬 배치 (발음 단어 → 기호 자동 정규화 보장)
    word_metrics = []
    space_w = 24
    total_w = 0

    for w_info in words:
        is_speaking = (w_info["start"] - 0.04 <= t <= w_info["end"] + 0.04)
        f_use = font_active if is_speaking else font_normal
        disp_text = normalize_caption_token(w_info["word"])
        bbox = overlay_draw.textbbox((0, 0), disp_text, font=f_use, stroke_width=10)
        ww = bbox[2] - bbox[0]
        wh = bbox[3] - bbox[1]
        word_metrics.append((disp_text, is_speaking, f_use, ww, wh))
        total_w += ww

    total_w += space_w * max(0, len(words) - 1)

    # 만약 폭이 940px을 넘으면 2줄로 자동 분할
    if total_w > 940 and len(word_metrics) >= 2:
        split_at = max(1, len(word_metrics) // 2)
        rows = [word_metrics[:split_at], word_metrics[split_at:]]
    else:
        rows = [word_metrics]

    for r_idx, row in enumerate(rows):
        row_w = sum(m[3] for m in row) + space_w * max(0, len(row) - 1)
        cur_x = (WIDTH - row_w) // 2
        cur_y = y_pos + pop_y + r_idx * 98

        for disp_text, is_speaking, f_use, ww, wh in row:
            clean_w = disp_text.strip(".,?!:;\"'").lower()
            if is_speaking:
                if clean_w in danger_words or clean_w.startswith("-"):
                    fill_col = (255, 65, 85, 255)  # 강렬한 경고 레드
                else:
                    fill_col = accent_color
                wy = cur_y - 6
            else:
                fill_col = (255, 255, 255, 255)
                wy = cur_y

            # 1) 깊은 드롭 섀도우 (배경 박스 없이도 어떤 영상 위에서든 100% 읽히게 함)
            overlay_draw.text(
                (cur_x + 5, wy + 7),
                disp_text,
                font=f_use,
                fill=(0, 0, 0, 215),
                stroke_width=12,
                stroke_fill=(0, 0, 0, 215),
            )
            # 2) 선명한 본문 + 두꺼운 블랙 아웃라인 (stroke_width >= 10)
            overlay_draw.text(
                (cur_x, wy),
                disp_text,
                font=f_use,
                fill=fill_col,
                stroke_width=10,
                stroke_fill=(10, 12, 16, 255),
            )
            cur_x += ww + space_w


# ==============================================================================
# 5. [영상 1] 미국 유튜브 1위: 3D 인체·뇌과학 다큐 쇼츠 (Zack D. Films / Vox 스타일)
# ==============================================================================
def build_video_1_body_science():
    print("\n============================================================")
    print("🎬 [1/3] 미국 유튜브 1위: 3D 인체·뇌과학 호기심 쇼츠 제작 시작")
    print("============================================================")

    script = (
        "If you sleep less than six hours tonight, your brain literally begins to eat itself. "
        "While you are awake, your neurons produce toxic metabolic waste every single second. "
        "Normally, during deep sleep, spinal fluid flushes those toxins right out. "
        "But when you skip sleep, microglial cells go into overdrive and start destroying healthy synapses. "
        "Even worse, just five nights of poor sleep drops your memory retention by forty percent."
    )

    mp3_path = TEMP_DIR / "v1_voice.mp3"
    wav_path = TEMP_DIR / "v1_voice.wav"
    words, total_dur = asyncio.run(
        synthesize_natural_voice_with_words(
            full_script=script,
            voice="en-US-AndrewMultilingualNeural",
            out_mp3=mp3_path,
            out_wav=wav_path,
            rate="+6%",
        )
    )
    phrases = group_words_into_phrases(words, max_words_per_group=3, max_chars=18)

    # 4개의 멀티 카메라 샷 로드
    shots = [
        Image.open(ASSETS_DIR / "v1_shot1_eye.jpg").convert("RGB"),
        Image.open(ASSETS_DIR / "v1_shot2_brain_scan.jpg").convert("RGB"),
        Image.open(ASSETS_DIR / "v1_shot3_neurons.jpg").convert("RGB"),
        Image.open(ASSETS_DIR / "v1_shot4_mri.jpg").convert("RGB"),
    ]
    shot_labels = [
        ("STAGE 01 // 03:00 AM", "SLEEP DEPRIVATION ONSET"),
        ("STAGE 02 // NEURAL CORTEX", "METABOLIC TOXIN BUILDUP"),
        ("STAGE 03 // SYNAPSE LEVEL", "MICROGLIAL CELL OVERDRIVE"),
        ("STAGE 04 // CLINICAL MRI", "-40% MEMORY CAPACITY"),
    ]

    # 컷 전환 시점 계산 (4등분)
    shot_dur = total_dur / 4.0
    cut_times = [shot_dur * 1, shot_dur * 2, shot_dur * 3]

    final_audio = TEMP_DIR / "v1_master.wav"
    build_studio_soundtrack(wav_path, cut_times, total_dur, style="science", final_wav=final_audio)

    out_mp4 = OUTPUT_DIR / "US_1_BodyScience_BrainSleep_Shorts.mp4"
    total_frames = int(total_dur * FPS)

    font_hud_sm = load_font(FONT_SEGOE_BOLD, 26)
    font_hud_lg = load_font(FONT_SEGOE_BOLD, 34)

    cmd = [
        FFMPEG_EXE, "-y",
        "-f", "rawvideo", "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}", "-pix_fmt", "rgb24", "-r", str(FPS),
        "-i", "-", "-i", str(final_audio),
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
        "-shortest", "-movflags", "+faststart", str(out_mp4),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    for f_idx in range(total_frames):
        t = f_idx / float(FPS)
        shot_idx = min(3, int(t / shot_dur))
        t_local = t - (shot_idx * shot_dur)

        # 컷 전환 직후 0.14초 동안 카메라 휩(Whip) 모션
        whip = max(0.0, (0.14 - t_local) / 0.14) if shot_idx > 0 else 0.0

        base_frame = render_camera_motion(shots[shot_idx], t_local, shot_dur, shot_idx, whip_intensity=whip)
        filmic_frame = apply_film_look(base_frame, f_idx)

        overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        odraw = ImageDraw.Draw(overlay)

        # 다큐멘터리 미니멀 메디컬 HUD (왼쪽 상단 깔끔한 텔레메트리만 표시)
        tag_top, tag_main = shot_labels[shot_idx]
        odraw.rounded_rectangle((64, 96, 560, 198), radius=14, fill=(8, 14, 24, 165), outline=(0, 245, 212, 110), width=2)
        odraw.ellipse((88, 118, 102, 132), fill=(0, 245, 212, 255))
        odraw.text((116, 109), tag_top, font=font_hud_sm, fill=(0, 245, 212, 230))
        odraw.text((88, 144), tag_main, font=font_hud_lg, fill=(245, 250, 255, 255))

        # 단어별 Active-Word Kinetic Captions (골든 세이프존 y_pos=1060)
        draw_active_word_captions(
            odraw,
            phrases,
            t,
            accent_color=(0, 245, 212, 255),
            y_pos=GOLDEN_SAFE_Y,
        )

        # 하단 얇은 시안 진행바 (4px)
        prog_w = int(WIDTH * (f_idx / float(max(1, total_frames - 1))))
        odraw.rectangle((0, HEIGHT - 8, prog_w, HEIGHT), fill=(0, 245, 212, 230))

        comp = Image.alpha_composite(filmic_frame.convert("RGBA"), overlay).convert("RGB")
        proc.stdin.write(comp.tobytes())

    proc.stdin.close()
    proc.wait()
    export_srt(phrases, out_mp4.with_suffix(".srt"))
    print(f"✅ [완료] {out_mp4} + .srt ({total_dur:.1f}초)")


# ==============================================================================
# 6. [영상 2] 미국 인스타 릴스 1위: '저장 폭탄' 다크 럭셔리 리스트 릴스
# ==============================================================================
def build_video_2_insta_reels_listicle():
    print("\n============================================================")
    print("📸 [2/3] 미국 인스타 릴스 1위: 다크 럭셔리 '저장 폭탄' 리스트 릴스 제작 시작")
    print("============================================================")

    # 미국 인스타 릴스 특유의 짧은 감성 훅 보이스 + 11.5초 무한 루프 구성
    hook_script = (
        "Save this before you scroll. "
        "Here are five websites so powerful, they actually feel illegal to know in twenty twenty-six."
    )
    mp3_path = TEMP_DIR / "v2_voice.mp3"
    wav_path = TEMP_DIR / "v2_voice.wav"
    words, voice_dur = asyncio.run(
        synthesize_natural_voice_with_words(
            full_script=hook_script,
            voice="en-US-AndrewMultilingualNeural",
            out_mp3=mp3_path,
            out_wav=wav_path,
            rate="+2%",
        )
    )
    # 릴스 최적 길이 11.0초 보장 (음성이 끝난 뒤에도 리스트를 읽느라 자동 루프되도록 설계)
    total_dur = max(11.0, voice_dur + 3.8)
    cut_time = total_dur * 0.52

    # 음성 WAV 뒤에 무음을 붙여 total_dur 길이로 맞춤
    padded_wav = TEMP_DIR / "v2_voice_padded.wav"
    subprocess.run(
        [
            FFMPEG_EXE, "-y", "-i", str(wav_path),
            "-af", f"apad=whole_dur={total_dur}",
            "-ar", "44100", "-ac", "2", str(padded_wav),
        ],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True,
    )

    final_audio = TEMP_DIR / "v2_master.wav"
    build_studio_soundtrack(padded_wav, [cut_time], total_dur, style="reels_luxury", final_wav=final_audio)

    shots = [
        Image.open(ASSETS_DIR / "v2_shot1_porsche_rain.jpg").convert("RGB"),
        Image.open(ASSETS_DIR / "v2_shot2_macbook_desk.jpg").convert("RGB"),
    ]

    list_items = [
        ("01", "Perplexity.ai", "Replaces hours of Google research in 5 seconds"),
        ("02", "Gamma.app", "Turns a single text prompt into a full deck or site"),
        ("03", "TinyWow.com", "100+ free PDF, video & file tools with zero sign-up"),
        ("04", "Scribehow.com", "Auto-generates step-by-step guides while you work"),
        ("05", "NotebookLM.google", "Turns any document into an interactive AI podcast"),
    ]

    font_header_tag = load_font(FONT_SEGOE_BOLD, 25)
    font_title = load_font(FONT_SEGOE_BOLD, 46)
    font_num = load_font(FONT_SEGOE_BOLD, 32)
    font_site = load_font(FONT_SEGOE_BOLD, 36)
    font_desc = load_font(FONT_SEGOE_REG, 27)
    font_cta = load_font(FONT_SEGOE_BOLD, 31)

    out_mp4 = OUTPUT_DIR / "US_2_InstaReels_DarkLuxury_Listicle.mp4"
    total_frames = int(total_dur * FPS)

    cmd = [
        FFMPEG_EXE, "-y",
        "-f", "rawvideo", "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}", "-pix_fmt", "rgb24", "-r", str(FPS),
        "-i", "-", "-i", str(final_audio),
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
        "-shortest", "-movflags", "+faststart", str(out_mp4),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    for f_idx in range(total_frames):
        t = f_idx / float(FPS)
        if t < cut_time:
            shot_idx = 0
            t_local = t
            s_dur = cut_time
            whip = 0.0
        else:
            shot_idx = 1
            t_local = t - cut_time
            s_dur = total_dur - cut_time
            whip = max(0.0, (0.15 - t_local) / 0.15)

        base_frame = render_camera_motion(shots[shot_idx], t_local, s_dur, shot_idx, whip_intensity=whip)
        # 다크 에스테틱 무드를 위해 배경 밝기를 살짝 낮추고 대비를 높임
        base_frame = ImageEnhance.Brightness(base_frame).enhance(0.76)
        filmic_frame = apply_film_look(base_frame, f_idx)

        overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        odraw = ImageDraw.Draw(overlay)

        # 상단 애플 에디토리얼 스타일 헤더
        odraw.rounded_rectangle((90, 240, 440, 294), radius=27, fill=(255, 255, 255, 32), outline=(255, 255, 255, 85), width=1)
        odraw.text((118, 252), "BOOKMARK THIS FOR LATER", font=font_header_tag, fill=(235, 240, 245, 240))

        draw_title_1 = "5 Websites So Powerful They"
        draw_title_2 = "Feel Illegal to Know (2026)"
        odraw.text((92, 322), draw_title_1, font=font_title, fill=(255, 255, 255, 255), stroke_width=2, stroke_fill=(0, 0, 0, 180))
        odraw.text((92, 382), draw_title_2, font=font_title, fill=(255, 218, 120, 255), stroke_width=2, stroke_fill=(0, 0, 0, 180))

        # 중앙 글래스모피즘(Glassmorphism) 리스트 카드 5종 (0.4초 간격으로 순차 슬라이드 인)
        card_start_y = 495
        card_h = 162
        card_gap = 22

        for idx, (num_str, site_name, site_desc) in enumerate(list_items):
            appear_t = 0.25 + idx * 0.42
            if t < appear_t:
                continue
            item_prog = min(1.0, (t - appear_t) / 0.28)
            ease = 1.0 - (1.0 - item_prog) ** 3
            slide_dy = int((1.0 - ease) * 35)
            alpha_card = int(205 * ease)
            alpha_txt = int(255 * ease)

            cy1 = card_start_y + idx * (card_h + card_gap) + slide_dy
            cy2 = cy1 + card_h

            # 반투명 다크 프로스트 글래스 카드
            odraw.rounded_rectangle(
                (84, cy1, WIDTH - 84, cy2),
                radius=24,
                fill=(14, 17, 24, alpha_card),
                outline=(255, 255, 255, int(65 * ease)),
                width=2,
            )
            # 번호 뱃지
            odraw.rounded_rectangle(
                (112, cy1 + 32, 176, cy1 + 92),
                radius=16,
                fill=(255, 215, 110, int(38 * ease)),
                outline=(255, 215, 110, int(140 * ease)),
                width=1,
            )
            odraw.text((126, cy1 + 44), num_str, font=font_num, fill=(255, 220, 130, alpha_txt))
            odraw.text((202, cy1 + 28), site_name, font=font_site, fill=(255, 255, 255, alpha_txt))
            odraw.text((202, cy1 + 84), site_desc, font=font_desc, fill=(195, 205, 218, alpha_txt))

        # 하단 미국 릴스 ManyChat 자동 DM 수익화 퍼널 배너
        cta_box_y = 1495
        odraw.rounded_rectangle(
            (84, cta_box_y, WIDTH - 84, cta_box_y + 104),
            radius=52,
            fill=(255, 255, 255, 238),
        )
        cta_txt = 'Comment "LIST" & I\'ll DM you all 5 links'
        cb = odraw.textbbox((0, 0), cta_txt, font=font_cta)
        cw = cb[2] - cb[0]
        odraw.text(((WIDTH - cw) // 2, cta_box_y + 32), cta_txt, font=font_cta, fill=(12, 14, 18, 255))

        comp = Image.alpha_composite(filmic_frame.convert("RGBA"), overlay).convert("RGB")
        proc.stdin.write(comp.tobytes())

    proc.stdin.close()
    proc.wait()
    print(f"✅ [완료] {out_mp4} ({total_dur:.1f}초)")


# ==============================================================================
# 7. [영상 3] 미국 역사·미스터리 'What-If' 다큐 쇼츠 (Ridley Scott 영화 질감)
# ==============================================================================
def build_video_3_history_whatif():
    print("\n============================================================")
    print("🏛️ [3/3] 미국 역사 'What-If' 다큐 쇼츠 제작 시작")
    print("============================================================")

    script = (
        "Could you actually survive twenty-four hours in Ancient Rome? "
        "First, forget sleeping in. By dawn, a million people pack into muddy streets narrower than your hallway. "
        "If you get sick, doctors might prescribe crushed gladiator sweat as medicine. "
        "Need to brush your teeth? Romans used aged human urine to whiten their smiles. "
        "And if your apartment catches fire at night, there is no public fire department, unless you pay them on the spot."
    )

    mp3_path = TEMP_DIR / "v3_voice.mp3"
    wav_path = TEMP_DIR / "v3_voice.wav"
    words, total_dur = asyncio.run(
        synthesize_natural_voice_with_words(
            full_script=script,
            voice="en-US-BrianMultilingualNeural",
            out_mp3=mp3_path,
            out_wav=wav_path,
            rate="+5%",
        )
    )
    phrases = group_words_into_phrases(words, max_words_per_group=3, max_chars=19)

    shots = [
        Image.open(ASSETS_DIR / "v3_shot1_rome_street.jpg").convert("RGB"),
        Image.open(ASSETS_DIR / "v3_shot2_roman_coins.jpg").convert("RGB"),
        Image.open(ASSETS_DIR / "v3_shot3_thermae_bath.jpg").convert("RGB"),
        Image.open(ASSETS_DIR / "v3_shot4_colosseum_dusk.jpg").convert("RGB"),
    ]
    chapter_titles = [
        ("06:00 AM // SUBURA DISTRICT", "1,000,000 CITIZENS AWAKEN"),
        ("11:00 AM // ROMAN MEDICINE", "THE GLADIATOR SWEAT CURE"),
        ("03:00 PM // PUBLIC BATHS", "ANCIENT HYGIENE SECRETS"),
        ("11:00 PM // NIGHTFALL IN ROME", "PRIVATE FIRE BRIGADES"),
    ]

    shot_dur = total_dur / 4.0
    cut_times = [shot_dur * 1, shot_dur * 2, shot_dur * 3]

    final_audio = TEMP_DIR / "v3_master.wav"
    build_studio_soundtrack(wav_path, cut_times, total_dur, style="history", final_wav=final_audio)

    out_mp4 = OUTPUT_DIR / "US_3_History_SurviveAncientRome_Shorts.mp4"
    total_frames = int(total_dur * FPS)

    font_ch_sm = load_font(FONT_SEGOE_BOLD, 25)
    font_ch_lg = load_font(FONT_SEGOE_BOLD, 33)

    cmd = [
        FFMPEG_EXE, "-y",
        "-f", "rawvideo", "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}", "-pix_fmt", "rgb24", "-r", str(FPS),
        "-i", "-", "-i", str(final_audio),
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
        "-shortest", "-movflags", "+faststart", str(out_mp4),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    for f_idx in range(total_frames):
        t = f_idx / float(FPS)
        shot_idx = min(3, int(t / shot_dur))
        t_local = t - (shot_idx * shot_dur)
        whip = max(0.0, (0.14 - t_local) / 0.14) if shot_idx > 0 else 0.0

        base_frame = render_camera_motion(shots[shot_idx], t_local, shot_dur, shot_idx, whip_intensity=whip)
        filmic_frame = apply_film_look(base_frame, f_idx)

        overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        odraw = ImageDraw.Draw(overlay)

        # 넷플릭스 다큐멘터리 스타일 상단 타임스탬프 캡션
        c_top, c_main = chapter_titles[shot_idx]
        odraw.rounded_rectangle((64, 96, 595, 198), radius=14, fill=(18, 14, 10, 175), outline=(255, 200, 110, 120), width=2)
        odraw.text((92, 109), c_top, font=font_ch_sm, fill=(255, 205, 115, 235))
        odraw.text((92, 144), c_main, font=font_ch_lg, fill=(255, 250, 240, 255))

        # 단어별 Active-Word Kinetic Captions (골든 세이프존 y_pos=1060)
        draw_active_word_captions(
            odraw,
            phrases,
            t,
            accent_color=(255, 214, 60, 255),
            y_pos=GOLDEN_SAFE_Y,
        )

        prog_w = int(WIDTH * (f_idx / float(max(1, total_frames - 1))))
        odraw.rectangle((0, HEIGHT - 8, prog_w, HEIGHT), fill=(255, 205, 90, 230))

        comp = Image.alpha_composite(filmic_frame.convert("RGBA"), overlay).convert("RGB")
        proc.stdin.write(comp.tobytes())

    proc.stdin.close()
    proc.wait()
    export_srt(phrases, out_mp4.with_suffix(".srt"))
    print(f"✅ [완료] {out_mp4} + .srt ({total_dur:.1f}초)")


if __name__ == "__main__":
    build_video_1_body_science()
    build_video_2_insta_reels_listicle()
    build_video_3_history_whatif()
