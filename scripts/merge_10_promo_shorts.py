#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
🎬 10-Episode US Viral Promo Shorts Merger & Subtitle Mastering Engine
================================================================================
- Supports all 10 US Viral Promo Episodes (EP01 ~ EP10) for:
  * SemiFearGreed (https://truthofmarket.com)
  * RightSideAlpha (https://truthofmarket.com)
  * Official Channel (@truthofmarketss)
- Automatically picks up downloaded Google Flow (.mp4) clips from:
  1) `D:/드림컴퍼니/1사업부/flow_shorts_studio/ai_shorts_output/flow_clips/epXX_shot1.mp4` (or `epXX.mp4`)
  2) User's Windows `Downloads` folder (most recent `.mp4` files downloaded from Google Flow)
- Appends the 1080x1920 Live Website UI recording as the final CTA shot (Shot 4),
  synthesizes native US voiceover (`en-US-AndrewMultilingualNeural`),
  burns 0.01s-synced Word-by-Word Active Pop-up Subtitles, and adds cinematic sub-bass boom!

Usage:
  python scripts/merge_10_promo_shorts.py --ep 1
  python scripts/merge_10_promo_shorts.py --all
  python scripts/merge_10_promo_shorts.py --from-downloads --ep 1
"""
import argparse
import shutil
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parents[1]
STUDIO_DIR = ROOT_DIR / "flow_shorts_studio"
if not STUDIO_DIR.exists():
    STUDIO_DIR = next(ROOT_DIR.parent.glob("3_*"), ROOT_DIR.parent / "3_AI영상_홍보_스튜디오")
if str(STUDIO_DIR) not in sys.path:
    sys.path.insert(0, str(STUDIO_DIR))

OUTPUT_DIR = STUDIO_DIR / "ai_shorts_output"
FLOW_CLIPS_DIR = OUTPUT_DIR / "flow_clips"
LOCAL_OUT_DIR = ROOT_DIR / "promo_shorts_output"
LOCAL_OUT_DIR.mkdir(parents=True, exist_ok=True)


# ==============================================================================
# 10 US VIRAL PROMO SHORTS EPISODES (PROMPTS + VOICEOVER SCRIPTS + CTA CONFIG)
# ==============================================================================
EPISODES = {
    1: {
        "code": "ep01",
        "title": "EP01_Semi_2AM_Panic_Extreme_Fear",
        "platform": "semi",
        "style_tag": "Dark Fincher Psychological Hook",
        "accent_color": (239, 68, 68, 255),  # Crimson Red
        "ending_mode": "punchline",
        "flow_prompts": [
            "Vertical 9:16 dark institutional chart canvas. $SMH -22% washout red candlesticks with 7-factor Fear & Greed dial entering 18 Extreme Fear.",
            "Vertical 9:16 dark institutional terminal gauge slamming into glowing crimson 18/100 Extreme Fear with Contrarian Barbell alert.",
            "Vertical 9:16 dark institutional 26-year backtest equity curve shifting from 70:30 baseline to 80% $SMH : 20% $XLV on emerald volume.",
        ],
        "shot_scripts": [
            "Every single time semiconductor stocks drop twenty percent, retail traders panic and sell at the exact bottom.",
            "Right now, our seven-factor Semiconductor Fear and Greed Index just plunged to eighteen, Extreme Fear.",
            "Over twenty-six years of market data, shifting from a seventy-thirty baseline to eighty percent SMH and twenty percent Healthcare XLV during Extreme Fear crushed the Nasdaq.",
            "Check today's live Fear and Greed score and exact rebalance shares free at truthofmarket dot com.",
        ],
    },
    2: {
        "code": "ep02",
        "title": "EP02_RSA_Falling_Knife_Trap",
        "platform": "rsa",
        "style_tag": "Brutal Truth / Wall Street Wake-Up",
        "accent_color": (16, 185, 129, 255),  # Emerald Green
        "ending_mode": "punchline",
        "flow_prompts": [
            "Vertical 9:16 dark institutional OHLCV chart plunging -50% then another -40% in left-side falling knife washout.",
            "Vertical 9:16 dark institutional risk chart marking -9.0% mechanical hard stop vs retail bagholder drawdown.",
            "Vertical 9:16 dark institutional OHLCV chart rounding out a flat base and erupting through the golden 60-DAY MA on 2.1x emerald volume.",
        ],
        "shot_scripts": [
            "You bought a famous stock down fifty percent thinking it was cheap, and then it dropped another forty percent.",
            "Buying the left side of a crash is called catching a falling knife, and it traps retail capital for years.",
            "Institutional quants never guess the bottom. They wait for Right-Side Ignition, when price reclaims the sixty-day moving average on surging volume.",
            "Scan all seventy-two US momentum leaders and test your portfolio free at truthofmarket dot com.",
        ],
    },
    3: {
        "code": "ep03",
        "title": "EP03_Semi_80_20_Barbell_Secret",
        "platform": "semi",
        "style_tag": "Dark Luxury / Hedge Fund Playbook",
        "accent_color": (245, 158, 11, 255),  # Gold Amber
        "ending_mode": "punchline",
        "flow_prompts": [
            "Vertical 9:16 dark institutional chart comparing 100% $SMH -35% drawdown shock vs hedged barbell trajectory.",
            "Vertical 9:16 dark institutional allocation matrix showing 70% $SMH Semiconductors paired with 30% $XLV Healthcare.",
            "Vertical 9:16 dark institutional 26-year compounding equity curve (23.1% CAGR) rotating to 80% $SMH : 20% $XLV below score 25.",
        ],
        "shot_scripts": [
            "Going one hundred percent into semiconductor ETFs feels genius in a bull run, until a thirty-five percent drawdown wipes out your nerve.",
            "That is why institutional money uses the Golden Barbell: seventy percent SMH semiconductors paired with thirty percent XLV defensive healthcare.",
            "When chip stocks crash into Extreme Fear below twenty-five, you sell defensive XLV at the top and rotate into eighty percent SMH at dirt-cheap prices.",
            "Calculate your exact dollar and share rebalance in three seconds at truthofmarket dot com.",
        ],
    },
    4: {
        "code": "ep04",
        "title": "EP04_RSA_Position_Doctor_Bagholder_Audit",
        "platform": "rsa",
        "style_tag": "Interactive Diagnostic / Pain Relief Hook",
        "accent_color": (56, 189, 248, 255),  # Cyan Blue
        "ending_mode": "punchline",
        "flow_prompts": [
            "Vertical 9:16 dark institutional portfolio audit table showing -22% unrealized drawdown vs -9.0% hard stop rule.",
            "Vertical 9:16 dark institutional 3D OHLCV candlestick chart highlighting broken MA60 support and 55-day time stop.",
            "Vertical 9:16 dark institutional Position Doctor terminal displaying exact -9.0% stop loss and +100% 2X target price.",
        ],
        "shot_scripts": [
            "Be honest. How many red stocks are sitting in your brokerage account right now because you hope they will bounce back?",
            "Hope is not a risk management strategy. Every institutional trade needs a hard nine-percent stop loss and a fifty-five day time stop.",
            "Instead of guessing whether to hold or cut, run your ticker, entry price, and holding days through our algorithmic Position Doctor.",
            "Get an instant mathematical verdict on your stock right now at truthofmarket dot com or on our free Telegram bot.",
        ],
    },
    5: {
        "code": "ep05",
        "title": "EP05_RSA_Institutional_Breakout_Footprints",
        "platform": "rsa",
        "style_tag": "'Feels Illegal to Know' Insider Quant Style",
        "accent_color": (16, 185, 129, 255),  # Emerald Green
        "ending_mode": "punchline",
        "flow_prompts": [
            "Vertical 9:16 dark institutional order-flow footprint chart tracking multi-day accumulation bars.",
            "Vertical 9:16 dark institutional OHLCV chart where 10-day volume spikes 1.8x-2.5x in neon emerald as price crosses 60-DAY MA.",
            "Vertical 9:16 dark institutional 72-stock PW-RSI scanner locking top 5 US tickers into the emerald Ignition Zone.",
        ],
        "shot_scripts": [
            "Wall Street hedge funds cannot hide when they accumulate millions of shares in a turnaround stock.",
            "Before a stock doubles, it leaves four mathematical footprints: seller washout, higher lows, reclaiming the sixty-day moving average, and a ten-day volume surge.",
            "Our PW-RSI engine scans seventy-two US market leaders daily to catch that exact Right-Side Ignition before financial television even notices.",
            "See today's top five US Ignition stocks unlocked right now at truthofmarket dot com.",
        ],
    },
    6: {
        "code": "ep06",
        "title": "EP06_Semi_SOXL_Wipeout_vs_Smart_Barbell",
        "platform": "semi",
        "style_tag": "3D Stress-Test / Volatility Reality Check",
        "accent_color": (239, 68, 68, 255),  # Crimson Red
        "ending_mode": "punchline",
        "flow_prompts": [
            "Vertical 9:16 dark institutional chart comparing $SOXL 3x leverage volatility decay vs unleveraged $SMH:$XLV barbell.",
            "Vertical 9:16 dark institutional 2000-2026 semiconductor drawdown table across four major macro bear cycles.",
            "Vertical 9:16 dark institutional equity curve compounding $10,000 into $2,210,000 via systematic $SMH:$XLV rebalancing.",
        ],
        "shot_scripts": [
            "Everyone loves semiconductor stocks when Nvidia and SMH are hitting all-time highs, but a twenty percent pullback destroys over-leveraged accounts.",
            "In our twenty-six year backtest from two thousand to twenty twenty-six, the semiconductor cycle suffered brutal drawdowns every few years.",
            "Yet investors who systematically rebalanced between SMH semiconductors and XLV healthcare turned ten thousand dollars into over two million dollars with lower stress.",
            "Download the full twenty-six year dataset and check today's regime signal at truthofmarket dot com.",
        ],
    },
    7: {
        "code": "ep07",
        "title": "EP07_RSA_55_Day_Dead_Money_Rule",
        "platform": "rsa",
        "style_tag": "Opportunity Cost / Time-Stop Secret",
        "accent_color": (245, 158, 11, 255),  # Amber
        "ending_mode": "punchline",
        "flow_prompts": [
            "Vertical 9:16 dark institutional OHLCV chart flatlining sideways for 55 trading days with opportunity cost counter.",
            "Vertical 9:16 dark institutional split chart contrasting stagnant dead-money stock vs emerald Right-Side Ignition leader.",
            "Vertical 9:16 dark institutional Rule 2 capital rotation dashboard cutting <+8% 55-day laggards into active leaders.",
        ],
        "shot_scripts": [
            "The biggest silent killer of your stock portfolio is not a sudden crash. It is dead money.",
            "When you hold a stagnant stock for months waiting for a bounce, you miss every real institutional breakout happening across the market.",
            "That is why our quantitative engine enforces Rule Two: if a position fails to gain eight percent within fifty-five trading days, you cut it and rotate into active Right-Side leaders.",
            "Test if your stocks have triggered the fifty-five day time stop right now at truthofmarket dot com.",
        ],
    },
    8: {
        "code": "ep08",
        "title": "EP08_RSA_100_Percent_TP1_Free_Runner",
        "platform": "rsa",
        "style_tag": "Asymmetric Wealth / House Money Rule",
        "accent_color": (16, 185, 129, 255),  # Emerald
        "ending_mode": "punchline",
        "flow_prompts": [
            "Vertical 9:16 dark institutional OHLCV chart showing an unbooked +100% rally round-tripping back to breakeven.",
            "Vertical 9:16 dark institutional Rule 3 TP1 chart locking 50% principal harvest at +100% (2X) gain.",
            "Vertical 9:16 dark institutional OHLCV chart trailing the remaining 50% house-money runner along the 60-DAY MA.",
        ],
        "shot_scripts": [
            "Have you ever watched a winning stock double in your account, only to hold too long and watch the entire profit vanish?",
            "Professional momentum traders never ride a full position back down. At plus one hundred percent gain, you sell exactly half.",
            "That single move locks in one hundred percent of your original cash into your pocket, turning the remaining half into a stress-free runner trailed by the sixty-day moving average.",
            "Get exact two-x target prices and trailing stop levels for seventy-two US stocks at truthofmarket dot com.",
        ],
    },
    9: {
        "code": "ep09",
        "title": "EP09_Telegram_Quant_Bot_Instant_Alerts",
        "platform": "semi",
        "style_tag": "Speed & Automation / Telegram Bot Hook",
        "accent_color": (56, 189, 248, 255),  # Telegram Sky Blue
        "ending_mode": "punchline",
        "flow_prompts": [
            "Vertical 9:16 dark institutional chart showing institutional accumulation +40% ahead of late retail headlines.",
            "Vertical 9:16 dark institutional alert feed showing live Semiconductor Fear & Greed at 18 and top 5 Ignition triggers.",
            "Vertical 9:16 dark institutional Position Doctor mobile card computing -9.0% hard stop and 2X target in 3 seconds.",
        ],
        "shot_scripts": [
            "By the time financial news anchors tell you semiconductor stocks are a buy, institutional money is already up forty percent.",
            "You do not have time to stare at charts for six hours a day. You need real-time quantitative signals delivered straight to your phone.",
            "Our free Telegram bot gives you the live Semiconductor Fear and Greed score, top five US Right-Side Ignition stocks, and instant price diagnostics with one tap.",
            "Join @truthofmarketss on Telegram or tap the link at truthofmarket dot com to connect in ten seconds.",
        ],
    },
    10: {
        "code": "ep10",
        "title": "EP10_Semi_3_Tranche_Crash_Deployment",
        "platform": "semi",
        "style_tag": "Master Blueprint / $100K Crash Calculator",
        "accent_color": (16, 185, 129, 255),  # Emerald Green
        "ending_mode": "punchline",
        "flow_prompts": [
            "Vertical 9:16 dark institutional drawdown chart showing 100% lump-sum entry at -5% dip caught in deeper -28% washout.",
            "Vertical 9:16 dark institutional 3-tranche deployment matrix (30% Fear / 40% Extreme Fear / 30% Right-Side Rebound).",
            "Vertical 9:16 dark institutional Lump-Sum Tranche Calculator computing exact $SMH and $XLV share counts at score 18.",
        ],
        "shot_scripts": [
            "The worst mistake investors make in a tech sell-off is firing all their cash on the very first five percent dip.",
            "When semiconductors enter a real correction, smart money deploys cash in three mathematical tranches: thirty percent in Fear, forty percent in Extreme Fear, and thirty percent on the right-side rebound.",
            "With the Semiconductor Fear and Greed Index sitting at eighteen right now, our Lump-Sum Tranche Calculator shows you the exact dollar amounts to deploy today.",
            "Run your own cash deployment blueprint free right now at truthofmarket dot com.",
        ],
    },
}


def find_clips_for_episode(ep_num: int, use_downloads: bool = False) -> list[str]:
    """
    Resolves clips for an episode:
    1) Checks `flow_clips/ep{02d}_shot1.mp4`, `ep{02d}_shot2.mp4`, `ep{02d}_shot3.mp4`
    2) Checks `flow_clips/ep{02d}.mp4` (if user generated 1 clip for the episode, repeats/splits across Shots 1-3)
    3) If --from-downloads is set (or no epXX files found), checks recent `.mp4` files in ~/Downloads
    4) Appends the live website UI recording (`semi_shot4_live_ui.mp4` or `rsa_shot4_live_ui.mp4`) as Shot 4!
    """
    ep = EPISODES[ep_num]
    code = ep["code"]
    platform = ep["platform"]

    shot4_ui = FLOW_CLIPS_DIR / ("semi_shot4_live_ui.mp4" if platform == "semi" else "rsa_shot4_live_ui.mp4")
    if not shot4_ui.exists():
        # Fallback if Shot 4 UI hasn't been captured yet
        alt = sorted(FLOW_CLIPS_DIR.glob("*shot4*.mp4"))
        if alt:
            shot4_ui = alt[0]

    # 1. Check dedicated 3-shot files: ep01_shot1.mp4, ep01_shot2.mp4, ep01_shot3.mp4
    three_shots = [FLOW_CLIPS_DIR / f"{code}_shot{i}.mp4" for i in range(1, 4)]
    if all(p.exists() for p in three_shots):
        print(f"✅ [{code.upper()}] Found dedicated 3 Flow clips: {[p.name for p in three_shots]}")
        return [str(p) for p in three_shots] + [str(shot4_ui)]

    # 2. Check single clip for the episode: ep01.mp4 or ep1.mp4
    for single_name in [f"{code}.mp4", f"ep{ep_num}.mp4", f"ep{ep_num:02d}_flow.mp4"]:
        sp = FLOW_CLIPS_DIR / single_name
        if sp.exists():
            print(f"✅ [{code.upper()}] Found single Flow clip {sp.name} -> pairing with Live UI Shot 4")
            return [str(sp), str(sp), str(sp), str(shot4_ui)]

    # 3. Check user's Windows Downloads folder if requested
    dl_dir = Path.home() / "Downloads"
    if use_downloads and dl_dir.exists():
        recent_mp4s = sorted(
            [p for p in dl_dir.glob("*.mp4") if p.stat().st_size > 30_000],
            key=lambda p: p.stat().st_mtime,
            reverse=True,
        )
        if len(recent_mp4s) >= 3:
            chosen = list(reversed(recent_mp4s[:3]))
            for idx, src in enumerate(chosen, start=1):
                dst = FLOW_CLIPS_DIR / f"{code}_shot{idx}.mp4"
                shutil.copy2(src, dst)
            print(f"✅ [{code.upper()}] Imported 3 latest MP4s from Downloads: {[p.name for p in chosen]}")
            return [str(FLOW_CLIPS_DIR / f"{code}_shot{i}.mp4") for i in range(1, 4)] + [str(shot4_ui)]
        elif len(recent_mp4s) >= 1:
            src = recent_mp4s[0]
            dst = FLOW_CLIPS_DIR / f"{code}.mp4"
            shutil.copy2(src, dst)
            print(f"✅ [{code.upper()}] Imported latest MP4 from Downloads: {src.name}")
            return [str(dst), str(dst), str(dst), str(shot4_ui)]

    # 4. Fallback to existing Flow clips in flow_clips so preview works out of the box
    fallback = [FLOW_CLIPS_DIR / f"shot{i}_flow.mp4" for i in range(1, 4)]
    if all(p.exists() for p in fallback):
        print(f"ℹ️ [{code.upper()}] Using existing studio Flow clips for preview.")
        return [str(p) for p in fallback] + [str(shot4_ui)]

    any_mp4s = sorted(FLOW_CLIPS_DIR.glob("*.mp4"))[:3]
    return [str(p) for p in any_mp4s] + [str(shot4_ui)]


def build_episode(ep_num: int, use_downloads: bool = False) -> Path:
    import json
    from flow_shorts_merger import render_clean_fullscreen_shorts_from_clips
    from build_rsa_semi_promo_shorts import build_rightsidealpha_youtube_metadata, render_real_ohlcv_3stage_clips

    ep = EPISODES[ep_num]
    code = ep["code"]
    ticker_hint = "$SMH" if ep["platform"] == "semi" else "$CELH"
    three_shots = [FLOW_CLIPS_DIR / f"{code}_shot{i}.mp4" for i in range(1, 4)]
    if not all(p.exists() for p in three_shots) and not use_downloads:
        ohlcv_shots = render_real_ohlcv_3stage_clips(prefix=code, ticker=ticker_hint.lstrip("$"))
        for idx_c, src_c in enumerate(ohlcv_shots[:3], 1):
            shutil.copy2(src_c, FLOW_CLIPS_DIR / f"{code}_shot{idx_c}.mp4")
    clips = find_clips_for_episode(ep_num, use_downloads=use_downloads)
    out_mp4 = LOCAL_OUT_DIR / f"{ep['title']}.mp4"

    print(f"\n🎬 Rendering {ep['title']} ({ep['style_tag']})...")
    render_clean_fullscreen_shorts_from_clips(
        clip_paths=clips,
        script=" ".join(ep["shot_scripts"]),
        output_mp4=out_mp4,
        voice="en-US-AndrewMultilingualNeural",
        style="wealth",
        accent_color=ep["accent_color"],
        top_clean_title="",
        shot_scripts=ep["shot_scripts"],
        ending_mode=ep["ending_mode"],
    )
    yt_meta = build_rightsidealpha_youtube_metadata(
        ticker=ticker_hint.lstrip("$"),
        hook_metric=ep["title"].split("_", 2)[-1].replace("_", " "),
        video_path=out_mp4,
    )
    out_mp4.with_suffix(".youtube.json").write_text(json.dumps(yt_meta, ensure_ascii=False, indent=2), encoding="utf-8")
    # Also copy to flow_shorts_studio/ai_shorts_output
    try:
        shutil.copy2(out_mp4, OUTPUT_DIR / out_mp4.name)
    except Exception:
        pass
    print(f"🎉 Completed: {out_mp4}")
    return out_mp4


def main() -> int:
    parser = argparse.ArgumentParser(description="Merge Google Flow clips + Live UI + Native US Subtitles for 10 Promo Shorts")
    parser.add_argument("--ep", type=int, default=1, choices=range(1, 11), help="Episode number (1 to 10)")
    parser.add_argument("--all", action="store_true", help="Render all 10 episodes")
    parser.add_argument("--from-downloads", action="store_true", help="Automatically import latest MP4s from ~/Downloads")
    args = parser.parse_args()

    if args.all:
        for e in range(1, 11):
            build_episode(e, use_downloads=False)
    else:
        build_episode(args.ep, use_downloads=args.from_downloads)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
