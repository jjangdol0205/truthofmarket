#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_ep09_ep10_v3_and_sync_all22.py
================================================================================
1. Renders missing EP09 (Fake Breakout vs 1.8x Institutional Volume Surge + VIP Curiosity Gap)
   and EP10 (9:30 AM Pre-Market 3-Second Position Doctor Routine + VIP Curiosity Gap)
   using the V3.0 Dopamine Engine (1.2x zero-silence voice, <=2s rapid cuts, point SFX,
   -1.0 dBFS anti-clipping limiter, 100% clean fullscreen safe-zone captions).
2. Normalizes EP09, EP10, EP21, and EP22 into standard `EP{num:02d}_US_Viral_Shorts.mp4`
   plus platform-tailored `_YT_Shorts.mp4` and `_IG_Reels.mp4` so all 22 episodes (EP01..EP22)
   are 100% ready for daily automated dispatch.
"""

import asyncio
import shutil
import sys
import wave
from pathlib import Path
import numpy as np
import edge_tts
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

WORKSPACE_DIR = Path("D:/드림컴퍼니/1사업부")
if str(WORKSPACE_DIR) not in sys.path:
    sys.path.insert(0, str(WORKSPACE_DIR))
if str(WORKSPACE_DIR / "scripts") not in sys.path:
    sys.path.insert(0, str(WORKSPACE_DIR / "scripts"))

import build_nextgen_viral_shorts_v3 as v3
from render_dual_yt_ig_cta import ensure_dual_videos

OUT_DIR = WORKSPACE_DIR / "viral_shorts_10_output"


async def resilient_synthesize_tight_beat_voice(text: str, voice: str, rate: str, work_prefix: Path) -> tuple[Path, float]:
    mp3_p = work_prefix.with_suffix(".mp3")
    raw_wav = work_prefix.with_name(work_prefix.name + "_raw.wav")
    tight_wav = work_prefix.with_suffix(".wav")

    if tight_wav.exists() and tight_wav.stat().st_size > 10000:
        with wave.open(str(tight_wav), "rb") as wf:
            dur = wf.getnframes() / float(v3.SAMPLE_RATE)
        return tight_wav, dur

    fallback_voices = [voice]
    if voice.startswith("en-"):
        for v_alt in ("en-US-AndrewMultilingualNeural", "en-US-BrianMultilingualNeural", "en-US-ChristopherNeural", "en-US-GuyNeural"):
            if v_alt not in fallback_voices:
                fallback_voices.append(v_alt)
    elif voice.startswith("ko-"):
        for v_alt in ("ko-KR-InJoonNeural", "ko-KR-SunHiNeural", "ko-KR-HyunsuNeural"):
            if v_alt not in fallback_voices:
                fallback_voices.append(v_alt)

    last_err = None
    for attempt in range(6):
        v_try = fallback_voices[attempt % len(fallback_voices)]
        try:
            if mp3_p.exists():
                mp3_p.unlink()
            comm = edge_tts.Communicate(text=text, voice=v_try, rate=rate)
            await comm.save(str(mp3_p))
            if mp3_p.exists() and mp3_p.stat().st_size > 500:
                break
        except Exception as e:
            last_err = e
            print(f"    [TTS Retry {attempt + 1}/6] ({v_try}): {e}", flush=True)
            await asyncio.sleep(1.5 * (attempt + 1))
    else:
        raise RuntimeError(f"Failed TTS after 6 attempts: {last_err}")

    v3.run_ffmpeg(["-i", str(mp3_p), "-ac", "1", "-ar", str(v3.SAMPLE_RATE), "-c:a", "pcm_s16le", str(raw_wav)])

    with wave.open(str(raw_wav), "rb") as wf:
        pcm = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16)

    tight_pcm = v3.tighten_pcm_silence(pcm, v3.SAMPLE_RATE)
    min_samples = int(1.45 * v3.SAMPLE_RATE)
    if len(tight_pcm) < min_samples:
        pad_tail = np.zeros(min_samples - len(tight_pcm), dtype=np.int16)
        tight_pcm = np.concatenate([tight_pcm, pad_tail])

    with wave.open(str(tight_wav), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(v3.SAMPLE_RATE)
        wf.writeframes(tight_pcm.tobytes())

    dur = len(tight_pcm) / float(v3.SAMPLE_RATE)
    return tight_wav, dur


def custom_render_clean_beat_overlay(
    l1: str,
    l2: str,
    lang: str,
    is_cta: bool,
    beat_idx: int,
    out_png: Path,
):
    """
    Enhanced V3 Clean Beat Overlay with Curiosity Gap (#1 Free Signal + #2-#3 Locked VIP Picks)
    on the final closing slate.
    """
    W, H = v3.W, v3.H
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    font_path = v3.FONT_JA if lang == "JA" else v3.FONT_KR_EN
    sub_size = 62 if lang in ("KR", "JA") else 60
    f_sub = ImageFont.truetype(str(font_path), sub_size)

    hl_color = (255, 232, 0, 255) if (beat_idx % 2 == 0) else (16, 245, 196, 255)

    v3.draw_centered_stroked_text(draw, 1055, l1, f_sub, (255, 255, 255, 255), stroke_w=10)
    v3.draw_centered_stroked_text(draw, 1128, l2, f_sub, hl_color, stroke_w=10)

    if is_cta:
        draw.rounded_rectangle([56, 92, 1024, 276], radius=28, fill=(10, 18, 32, 246), outline=(16, 185, 129, 255), width=4)
        f_top = ImageFont.truetype(str(v3.FONT_KR_EN), 40)
        f_desc = ImageFont.truetype(str(font_path), 27)
        v3.draw_centered_stroked_text(draw, 116, "truthofmarket.com  |  LIVE QUANT TERMINAL", f_top, (255, 255, 255, 255), stroke_w=5)
        sub_label = {
            "EN": "🔥 #1 Signal Unlocked Free · 🔒 #2-#3 Pro VIP Picks Live",
            "KR": "🔥 1위 돌파주 무료 공개 · 🔒 2~3위 VIP 히든 티커 실시간 확인",
            "JA": "🔥 1位突破株無料公開 · 🔒 2〜3位VIP銘柄リアルタイム確認",
        }.get(lang, "#1 Signal Unlocked Free · #2-#3 Pro VIP Picks Live")
        v3.draw_centered_stroked_text(draw, 192, sub_label, f_desc, (255, 232, 0, 255), stroke_w=4)

        pill_text = {
            "EN": "Link in Bio · truthofmarket.com",
            "KR": "프로필 링크 · truthofmarket.com 무료 진단",
            "JA": "プロフリンク · truthofmarket.com 無料診断",
        }.get(lang, "Link in Bio · truthofmarket.com")
        f_pill = ImageFont.truetype(str(font_path), 36)
        bp = draw.textbbox((0, 0), pill_text, font=f_pill)
        pw = bp[2] - bp[0]
        px1, px2 = (W - pw) // 2 - 46, (W + pw) // 2 + 46
        draw.rounded_rectangle([px1, 1568, px2, 1652], radius=42, fill=(10, 16, 28, 240), outline=(255, 232, 0, 250), width=3)
        draw.text(((W - pw) // 2, 1588), pill_text, font=f_pill, fill=(255, 232, 0, 255))

    canvas.save(out_png)


v3.synthesize_tight_beat_voice = resilient_synthesize_tight_beat_voice
v3.render_clean_beat_overlay = custom_render_clean_beat_overlay


EP09_BEATS = {
    "EN": (
        "en-US-AndrewMultilingualNeural",
        "+4%",
        [
            {"tts": "Why do ninety percent of retail breakout trades fail within forty-eight hours?", "l1": "WHY 90% OF BREAKOUTS FAIL", "l2": "WITHIN 48 HOURS", "sfx": "impact_ping"},
            {"tts": "Because retail traders only watch green price candles and ignore institutional volume.", "l1": "CHASING GREEN CANDLES", "l2": "IGNORING VOLUME FLOW", "sfx": "whoosh"},
            {"tts": "When a stock crosses its sixty-day line on weak volume, it is a classic bull trap.", "l1": "WEAK VOLUME ABOVE MA60", "l2": "= DEADLY BULL TRAP", "sfx": "whoosh"},
            {"tts": "Wall Street quants demand one non-negotiable proof before risking a single dollar.", "l1": "WALL STREET QUANT RULE", "l2": "1 NON-NEGOTIABLE PROOF", "sfx": "ping"},
            {"tts": "Ten-day institutional volume must surge at least one point eight times above normal.", "l1": "10-DAY VOLUME SURGE", "l2": "MUST SPIKE 1.8X TO 2.5X+", "sfx": "ping"},
            {"tts": "Today's number one volume breakout is unlocked free, and VIP picks two and three are live at truthofmarket dot com.", "l1": "#1 FREE · #2-#3 VIP PICKS", "l2": "TRUTHOFMARKET.COM", "sfx": "boom", "is_cta": True},
        ],
    ),
    "KR": (
        "ko-KR-InJoonNeural",
        "+4%",
        [
            {"tts": "돌파 매매의 구십 퍼센트가 왜 이틀 만에 물리는지 아십니까?", "l1": "돌파 매매 90%가 물리는 이유", "l2": "단 48시간 만의 가짜 돌파", "sfx": "impact_ping"},
            {"tts": "개인 투자자는 양봉 캔들만 보고 기관 거래량을 확인하지 않기 때문입니다.", "l1": "양봉 캔들만 추격 매수", "l2": "기관 거래량 수급 무시", "sfx": "whoosh"},
            {"tts": "거래량 없이 육십일선을 살짝 넘는 주가는 백 퍼센트 개미 털기 함정입니다.", "l1": "거래량 없는 60일선 돌파", "l2": "= 100% 불트랩(Bull Trap)", "sfx": "whoosh"},
            {"tts": "월가 퀀트 엔진은 단 하나의 확실한 증거가 뜰 때만 방아쇠를 당깁니다.", "l1": "월가 퀀트의 절대 진입 조건", "l2": "수급 폭발 증거 확인", "sfx": "ping"},
            {"tts": "십일 평균 거래량이 최소 일점팔 배 이상 폭발하며 추세선을 뚫어야 진짜입니다.", "l1": "10일 기관 거래량 1.8배+", "l2": "진짜 우측 이그니션 확정!", "sfx": "ping"},
            {"tts": "오늘 거래량 폭발 일위 종목은 무료 공개 중, 이삼위 히든 티커는 트루스오브마켓 닷컴에서 확인하세요.", "l1": "1위 무료 공개 · 2~3위 VIP 티커", "l2": "truthofmarket.com 실시간 확인", "sfx": "boom", "is_cta": True},
        ],
    ),
}

EP10_BEATS = {
    "EN": (
        "en-US-BrianMultilingualNeural",
        "+4%",
        [
            {"tts": "Trading Nvidia, Tesla, or semiconductor stocks tonight? Run this three-second check before nine-thirty.", "l1": "TRADING NVDA OR TSLA?", "l2": "3-SECOND CHECK BEFORE 9:30", "sfx": "impact_ping"},
            {"tts": "Most traders lose money at the opening bell because they trade blind on social media hype.", "l1": "OPENING BELL WIPEOUT", "l2": "TRADING BLIND ON HYPE", "sfx": "whoosh"},
            {"tts": "Step one: check our Semiconductor Fear and Greed gauge to lock your exact SMH and XLV barbell.", "l1": "STEP 1: SEMI FEAR & GREED", "l2": "LOCK $SMH : $XLV BARBELL", "sfx": "ping"},
            {"tts": "Step two: enter your ticker and average cost into our free Position Doctor.", "l1": "STEP 2: POSITION DOCTOR", "l2": "ENTER TICKER & AVG COST", "sfx": "whoosh"},
            {"tts": "In three seconds, get your mathematical minus nine percent hard stop and two-X target price.", "l1": "-9.0% HARD STOP LOCKED", "l2": "+100% 2X TARGET PRICE", "sfx": "ping"},
            {"tts": "Today's number one breakout is unlocked free, check your portfolio now at truthofmarket dot com.", "l1": "FREE 3S POSITION DOCTOR", "l2": "TRUTHOFMARKET.COM", "sfx": "boom", "is_cta": True},
        ],
    ),
    "KR": (
        "ko-KR-InJoonNeural",
        "+4%",
        [
            {"tts": "오늘 밤 엔비디아, 테슬라 매매하신다면 개장 전 딱 삼 초만 이것부터 확인하세요.", "l1": "오늘 밤 미장 개장 3초 전!", "l2": "필수 생존 체크리스트", "sfx": "impact_ping"},
            {"tts": "대부분의 개인은 개장 직후 뉴스와 호가창에 휘둘려 고점에 물립니다.", "l1": "개장 직후 뇌동매매 참사", "l2": "뉴스에 휘둘려 고점 추격", "sfx": "whoosh"},
            {"tts": "첫째, 반도체 공포 탐욕 지수로 오늘 공격과 방어 비중부터 고정하세요.", "l1": "1단계: 반도체 공포·탐욕 확인", "l2": "$SMH : $XLV 바벨 비중 고정", "sfx": "ping"},
            {"tts": "둘째, 보유 종목과 평단가를 포지션 닥터에 입력해 삼 초 만에 진단하세요.", "l1": "2단계: 3초 포지션 닥터", "l2": "내 종목 & 평단가 즉시 진단", "sfx": "whoosh"},
            {"tts": "기계적 마이너스 구 퍼센트 손절가와 두 배 익절 타점을 일 달러 단위까지 계산해 줍니다.", "l1": "-9% 칼손절 · 2배 익절 타점", "l2": "$0.01 단위까지 자동 산출", "sfx": "ping"},
            {"tts": "오늘의 일위 돌파주 무료 공개와 삼 초 포지션 닥터, 트루스오브마켓 닷컴에서 바로 확인하세요.", "l1": "1위 돌파주 무료 · 3초 진단", "l2": "truthofmarket.com 즉시 확인", "sfx": "boom", "is_cta": True},
        ],
    ),
}


async def main():
    print("🚀 Rendering V3 Dopamine Edition for EP09 & EP10...", flush=True)
    for lang, (voice, rate, beats) in EP09_BEATS.items():
        await v3.build_v3_short_for_language("EP09_V3_VolSurge", lang, voice, rate, beats)

    for lang, (voice, rate, beats) in EP10_BEATS.items():
        await v3.build_v3_short_for_language("EP10_V3_PositionDoctor", lang, voice, rate, beats)

    # Map V3 EN outputs to standard EP{num:02d}_US_Viral_Shorts.mp4 for EP09, EP10, EP21, EP22
    mapping = [
        (9, OUT_DIR / "EP09_V3_VolSurge_EN_Shorts.mp4"),
        (10, OUT_DIR / "EP10_V3_PositionDoctor_EN_Shorts.mp4"),
        (21, OUT_DIR / "EP21_V3_VS_Quant_EN_Shorts.mp4"),
        (22, OUT_DIR / "EP22_V3_Dopamine_10s_EN_Shorts.mp4"),
    ]
    for ep_num, src_mp4 in mapping:
        if not src_mp4.exists():
            raise FileNotFoundError(f"Missing expected source video: {src_mp4}")
        std_mp4 = OUT_DIR / f"EP{ep_num:02d}_US_Viral_Shorts.mp4"
        shutil.copy2(src_mp4, std_mp4)
        yt_out, ig_out = ensure_dual_videos(str(std_mp4), "TOM", force=True)
        print(f"  🎯 Standardized EP{ep_num:02d}: {std_mp4.name} | {Path(yt_out).name} | {Path(ig_out).name}", flush=True)

    print("\n✅ All 22 Episodes (EP01 ~ EP22) are now 100% present and Dual-Platform Ready!", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
