#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
daily_6am_shorts_sender.py — Daily 6:00 AM KST Telegram Video + YouTube/Instagram/X/Reddit Copy Kit Dispatcher
==============================================================================================================
Sends 1 mastered US Viral Short MP4 per day (EP01 -> EP22) to Telegram along with
1-tap mobile copy blocks (`<pre>...</pre>`) for:
  1) YouTube Shorts Title (with live $SMH Fear & Greed score)
  2) YouTube Shorts Description
  3) YouTube Shorts Safe Pinned Comment (Related Video + Channel Bio Bridge)
  4) Instagram Reels Caption (ManyChat 'SMH' / 'ALPHA' DM Automation + 1 Unmasked & 2 Blurred VIP Picks)
  5) X (Twitter) & Stocktwits $Cashtag Sniping Copy ($SMH $NVDA $SOXL $AMD $AVGO $CELH $XLV)
  6) Reddit (r/swingtrading, r/ETFs, r/Semiconductors) & TradingView Idea Copy

Usage:
  python daily_6am_shorts_sender.py --next          # Sends next queued episode (1..22) and advances pointer
  python daily_6am_shorts_sender.py --ep 9          # Sends specific episode (1..22)
"""
import argparse
import html
import json
import os
import pathlib
import re
import sys
from datetime import datetime, timezone
from typing import Any, Dict, List

import httpx

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = pathlib.Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from backend.app.services.telegram_service import telegram_service

VIDEOS_DIR = BASE_DIR / "viral_shorts_10_output"
STATE_FILE = BASE_DIR / "data" / "daily_shorts_state.json"
SEMI_OVERVIEW_FILE = BASE_DIR / "static_api" / "semi_overview.json"
STOCKS_MASTER_FILE = BASE_DIR / "data" / "stocks_pro_master.json"

EPISODE_COPY_KIT: List[Dict[str, Any]] = [
    {
        "num": 1,
        "id": "EP01",
        "topic_kr": "폭락장 물타기(-50% Dip Trap) vs 월가 우측 돌파(Right-Side Ignition)",
        "yt_title": 'Why "Buying the Dip" on $NVDA, $TSLA & $SOXL Destroys 90% of Accounts (The Right-Side Rule) 📉📈 #nvda #tsla #stocks',
        "yt_desc": (
            "You bought a stock down 50% thinking it was cheap—and somehow it dropped another 40%.\n"
            "Wall Street quants never catch falling knives on the left side of a crash. They wait for Right-Side Ignition above the 60-day moving average (MA60) with institutional volume.\n\n"
            "🖥️ Scan 72+ US Tech & Growth Stocks Live: https://truthofmarket.com\n"
            "🧭 Live $SMH Semiconductor Fear & Greed Terminal: https://truthofmarket.com/semi-fear-greed.html\n"
            "✈️ Free Real-Time Telegram Briefing Channel: https://t.me/truthofmarketss\n\n"
            "#usstocks #stockmarket #swingtrading #daytrading #nvda #tsla #celh #quanttrading #technicalanalysis #wallstreet"
        ),
        "yt_pin": (
            "📌 Bagholding a crashed stock right now? Tap our channel icon (@rightsidealpha) or the Related Video link below to run our FREE Position Doctor (3s Stop-Loss & 2x Target diagnosis)!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" and I’ll DM you the live 72-stock PW-RSI terminal link & Free Telegram Breakout Bot 👇\n\n'
            "Stop catching falling knives on the left side of a crash.\n"
            "Our 26-year Right-Side Quant Engine tracks 72+ US market leaders in real time:\n\n"
            "🔥 IGNITION: Institutional breakout confirmed above 60-day trendline (MA60)\n"
            "⚠️ TRAP: Price below MA60 — high bull-trap risk\n"
            "🩺 POSITION DOCTOR: Enter your avg cost for exact -9% Stop-Loss & +100% Target levels in 3 seconds.\n\n"
            '💬 Drop "SMH" in the comments below and check your DMs!\n\n'
            "#usstocks #stockmarket #daytrading #swingtrading #nvda #tsla #pltr #quanttrading #tradingstrategy #wallstreet"
        ),
    },
    {
        "num": 2,
        "id": "EP02",
        "topic_kr": "비자발적 장기투자(Bagholding)를 막아주는 -9% 기계적 칼손절 법칙",
        "yt_title": "$NVDA, $TSLA & $PLTR: How One -9% Stop Rule Saves You From a -70% Wipeout 🛑📉 #nvda #tsla #pltr",
        "yt_desc": (
            "Every massive -50% portfolio wipeout starts as a small dip that you refused to sell.\n"
            "Institutional quants survive every bear market using one ruthless rule: an automatic -9.0% hard stop loss.\n\n"
            "🩺 Diagnose Your Stock in 3 Seconds (Position Doctor): https://truthofmarket.com\n"
            "✈️ Free Telegram Quant Alert Channel: https://t.me/truthofmarketss\n\n"
            "#stockmarket #usstocks #riskmanagement #swingtrading #daytrading #optionsflow #nvda #tsla #quanttrading"
        ),
        "yt_pin": (
            "🛑 Stuck bagholding a losing US stock? Tap @rightsidealpha below and open our free Position Doctor to see your exact mathematical -9% Stop & +100% Target!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" and I’ll DM you our free 3-second Position Doctor & Telegram Alert Bot 👇\n\n'
            "Every -70% bagholder nightmare started as a small dip you refused to cut.\n"
            "Here is how our institutional Position Doctor protects your capital:\n\n"
            "🛑 RULE 1 (-9% Hard Stop): Automatic exit before a dip becomes a crash\n"
            "⏳ RULE 2 (55-Day Time Stop): Cut dead money that fails to gain +8%\n"
            "💰 RULE 3 (+100% TP1): Sell 50% at 2x to ride a risk-free runner\n\n"
            '💬 Comment "SMH" below to test your portfolio in 3 seconds!\n\n'
            "#usstocks #stockmarket #swingtrading #daytrading #riskmanagement #nvda #tsla #wallstreet #quanttrading"
        ),
    },
    {
        "num": 3,
        "id": "EP03",
        "topic_kr": "계좌 복리를 망치는 '횡보장 기회비용' — 월가의 55일 시간 손절(Time Stop) 법칙",
        "yt_title": "$SOXL, $AMD & $TSLA: The 55-Day 'Dead Money' Rule Wall Street Quants Live By ⏱️📈 #soxl #amd #tsla",
        "yt_desc": (
            "The biggest hidden killer of your trading account isn't a crash—it's dead money.\n"
            "When you hold a sideways stock for 6 months, you miss every real institutional breakout. Our 26-year quant engine enforces a strict 55-Day Time Stop.\n\n"
            "🖥️ Live 72-Stock Breakout Scanner & Position Doctor: https://truthofmarket.com\n"
            "✈️ Free Telegram Breakout Channel: https://t.me/truthofmarketss\n\n"
            "#usstocks #stockmarket #tradingstrategy #quanttrading #daytrading #nvda #tsla #pltr #momentumtrading"
        ),
        "yt_pin": (
            "⏱️ Holding a stock that refuses to move? Run your ticker + days held through our free Position Doctor via the link in @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" and I’ll send you direct access to our Live US Quant Terminal & Telegram Bot 👇\n\n'
            "Crashes aren't the only thing killing your returns—Dead Money is.\n"
            "If a stock fails to gain +8% within 55 trading days, institutional quants rotate out immediately into active Right-Side Ignitions.\n\n"
            '💬 Drop "SMH" in the comments to check which US stocks are in the live Ignition Zone today!\n\n'
            "#usstocks #stockmarket #swingtrading #daytrading #quanttrading #tradingtips #nvda #tsla #wallstreet"
        ),
    },
    {
        "num": 4,
        "id": "EP04",
        "topic_kr": "반도체 공포·탐욕 지수 18 (Extreme Fear) 진입 — 80% SMH : 20% XLV 역발상 바벨",
        "yt_title": "Semiconductor Fear & Greed Just Hit 18 (Extreme Fear) — The 80/20 Secret 🚨 #semiconductors #nvda #smh",
        "yt_desc": (
            "Every time semiconductor stocks drop 20%, retail traders panic and sell at the exact bottom.\n"
            "Right now, our 7-Factor Semiconductor Fear & Greed Index plunged to 18.0 (Extreme Fear)—triggering the 80% $SMH : 20% $XLV Contrarian Barbell.\n\n"
            "🧭 Live Semi Fear & Greed Terminal: https://truthofmarket.com/semi-fear-greed.html\n"
            "✈️ Free Telegram /semi & /ignition Alerts: https://t.me/truthofmarketss\n\n"
            "#semiconductors #nvda #amd #mu #smh #soxx #etf #usstocks #stockmarket #quanttrading"
        ),
        "yt_pin": (
            "🧭 Check today's live Semiconductor 7-Factor Fear & Greed score and exact $SMH : $XLV barbell weights via the top link on @rightsidealpha!"
        ),
        "ig_caption": (
            'Comment "SMH" to get our live Semiconductor Fear & Greed Index + Telegram Alert Bot 👇\n\n'
            "While 90% of retail traders panic during chip pullbacks, our 7-Factor Semiconductor Fear & Greed Index just hit 18.0 (EXTREME FEAR).\n\n"
            "⚡ Contrarian Barbell Directive: Shift from 70/30 to 80% $SMH (Semiconductors) : 20% $XLV (Healthcare Vault)\n"
            "📈 26-Year Backtest: 23.1% CAGR with significantly lower drawdown than holding 100% tech.\n\n"
            '💬 Comment "SMH" below and check your DMs for the live dashboard!\n\n'
            "#nvda #semiconductors #smh #soxx #amd #usstocks #stockmarket #etfinvesting #quanttrading #wallstreet"
        ),
    },
    {
        "num": 5,
        "id": "EP05",
        "topic_kr": "고점 대비 -71% 폭락한 $CELH, 데드캣 바운스인가 진짜 기관 수급 돌파인가?",
        "yt_title": "$CELH Crashed 71% — Bull Trap or Institutional Right-Side Breakout? 🔥📈 #celh #stocks #swingtrading",
        "yt_desc": (
            "When a growth stock like Celsius ($CELH) crashes from its high, how do you know if the bounce is a fakeout or a real institutional turnaround?\n"
            "We check 4 mathematical conditions: C1 Deep DD Washout, C2 Off 52W Low, C3 MA20/MA60 Reclamation, and C4 Volume Surge.\n\n"
            "📑 Read the Full $CELH Institutional Quant Brief: https://truthofmarket.com/stocks/celh.html\n"
            "✈️ Free Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#celh #usstocks #growthstocks #stockmarket #breakoutstocks #swingtrading #quanttrading #technicalanalysis"
        ),
        "yt_pin": (
            "📈 See the exact $CELH Entry Trigger, -9% Hard Stop, and +100% Target on our live terminal via @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" and I’ll DM you the full $CELH Institutional Research Brief & Live Scanner 👇\n\n'
            "How do you separate a dead-cat bounce from a real institutional turnaround?\n"
            "Look at $CELH on our Right-Side Engine:\n"
            "✅ C1: Deep 52W washout complete\n"
            "✅ C2: Rebounding off 52-week low\n"
            "✅ C3: Reclaimed 20-day & 60-day moving averages\n"
            "✅ C4: 2.45x 10-day institutional volume surge\n\n"
            '💬 Comment "SMH" below to unlock all active Ignition stocks!\n\n'
            "#celh #usstocks #growthstocks #swingtrading #daytrading #stockscanner #quanttrading #wallstreet"
        ),
    },
    {
        "num": 6,
        "id": "EP06",
        "topic_kr": "$TSLA · $NVDA 급등 직전에 개인투자자만 털리는 이유 (기관 Entry Trigger)",
        "yt_title": "Why $TSLA & $NVDA Always Shake You Out Right Before Ripping 20% ⚡📈 #tsla #nvda #daytrading",
        "yt_desc": (
            "Ever feel like market makers wait for you to sell $TSLA or $NVDA before ripping it 20% higher?\n"
            "That happens because retail traders buy inside the chop zone before price clears the institutional 60-day Entry Trigger (TRG).\n\n"
            "🎯 Check Exact TRG Levels for $NVDA & 72 US Stocks: https://truthofmarket.com/stocks/nvda.html\n"
            "✈️ Free Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#tsla #nvda #usstocks #stockmarket #daytrading #swingtrading #breakouttrading #quanttrading"
        ),
        "yt_pin": (
            "🎯 Stop getting shaken out in the chop zone! Check live Entry Trigger (TRG) prices for $TSLA, $NVDA, $AMD, and 72 US leaders via @rightsidealpha!"
        ),
        "ig_caption": (
            'Comment "SMH" to get instant alerts when $TSLA, $NVDA & 72 US leaders hit their Entry Trigger 👇\n\n'
            "Why do you always get shaken out right before the real move?\n"
            "Because buying below the 60-day moving average puts you inside institutional chop.\n"
            "Our terminal calculates the exact dollar Entry Trigger (TRG) so you only strike when momentum is confirmed.\n\n"
            '💬 Drop "SMH" in the comments and check your DMs!\n\n'
            "#tsla #nvda #usstocks #stockmarket #daytrading #swingtrading #optionsflow #quanttrading #wallstreet"
        ),
    },
    {
        "num": 7,
        "id": "EP07",
        "topic_kr": "+100% 수익(TP1)에서 원금 100% 회수하고 '무위험 공짜 주식'으로 끝까지 먹는 법",
        "yt_title": "$NVDA & $PLTR +100% 'Free-Ride' Rule: How Quants Trade With Zero Principal Risk 💰🚀 #nvda #pltr #stocks",
        "yt_desc": (
            "The worst feeling in trading is watching an +80% gain round-trip all the way back into a loss.\n"
            "Wall Street quants prevent this with Rule 3: at +100% (TP1), sell 50% to recover 100% of your initial capital, and trail the rest on the 60-day moving average.\n\n"
            "🖥️ Calculate Your Exact 2x Target & Stop Levels: https://truthofmarket.com\n"
            "✈️ Free Telegram Quant Channel: https://t.me/truthofmarketss\n\n"
            "#usstocks #stockmarket #swingtrading #wealthbuilding #quanttrading #tradingpsychology #wallstreet"
        ),
        "yt_pin": (
            "💰 Never round-trip a winning trade again. Get exact -9% Stop & +100% TP1 levels for your portfolio via @rightsidealpha!"
        ),
        "ig_caption": (
            'Comment "SMH" and I’ll DM you our Position Doctor calculator & Telegram Quant Bot 👇\n\n'
            "How do institutional traders ride massive multi-baggers without stress?\n"
            "The +100% Free-Ride Rule (TP1):\n"
            "1️⃣ Enter on Right-Side Ignition with a strict -9% Hard Stop\n"
            "2️⃣ At +100% gain (2x), sell exactly 50% of your shares\n"
            "3️⃣ Your original cash is now 100% back in your pocket—the remaining shares are a mathematically risk-free runner.\n\n"
            '💬 Comment "SMH" below for instant access to the live terminal!\n\n'
            "#usstocks #stockmarket #swingtrading #daytrading #tradingpsychology #quanttrading #wallstreet"
        ),
    },
    {
        "num": 8,
        "id": "EP08",
        "topic_kr": "미국주식 126종목 26년 백테스트(2000~2026) — 나스닥 14배 vs 우측 돌파 349배의 비밀",
        "yt_title": "26-Year Backtest ($QQQ, $NVDA, $SMH): Why Right-Side Breakout Crushed Wall Street 349x 📊🏆 #nvda #qqq #smh",
        "yt_desc": (
            "We tested 126 US stocks across 26.78 years (2000 Dot-Com Crash, 2008 GFC, 2020 COVID, 2022 Bear Market).\n"
            "Blindly buying 52-week lows suffered -71% drawdowns. Waiting for Right-Side PW-RSI Ignition compounded at 24.48% CAGR (349.3x vs QQQ 14.3x).\n\n"
            "📊 Explore the Full 26-Year Backtest & Live Scanner: https://truthofmarket.com\n"
            "✈️ Free Telegram Quant Channel: https://t.me/truthofmarketss\n\n"
            "#quanttrading #backtesting #usstocks #stockmarket #algotrading #qqq #spy #swingtrading #wallstreet"
        ),
        "yt_pin": (
            "📊 Verify every year of our 26-year backtest (2000–2026) and see today's Ignition stocks live via @rightsidealpha!"
        ),
        "ig_caption": (
            'Comment "SMH" to explore our 26-Year Backtest & Live 72-Stock Scanner 👇\n\n'
            "Numbers don't lie. Across 26.78 years and 126 US stocks (including 2000, 2008, and 2022):\n"
            "📉 Naive 52-Week Low Dip Buying: Crushed by -71% max drawdowns\n"
            "📈 Right-Side PW-RSI Engine: 24.48% CAGR (349.3x cumulative return vs QQQ 14.3x)\n\n"
            '💬 Drop "SMH" in the comments and I’ll DM you the live terminal link!\n\n'
            "#quanttrading #algotrading #usstocks #stockmarket #swingtrading #investing #qqq #nvda #wallstreet"
        ),
    },
    {
        "num": 9,
        "id": "EP09",
        "topic_kr": "[V3 도파민판] 가짜 돌파(Bull Trap)에 속지 않는 단 하나의 지표 — 10일 거래량 1.8배 폭발(Vol Surge)",
        "yt_title": "$NVDA, $TSLA & $SOFI Fake Breakout vs Real Institutional Buying: The 1.8x Volume Tell 🔍📊 #nvda #tsla #sofi",
        "yt_desc": (
            "90% of retail breakout trades fail within 48 hours because traders only watch green price candles and ignore institutional volume.\n"
            "When price crosses the 60-day moving average on weak volume, it's a Bull Trap. True institutional accumulation surges 1.8x–2.5x+ above 10-day average volume.\n\n"
            "🔍 Scan Live Institutional Volume Surges (#1 Signal Unlocked Free): https://truthofmarket.com\n"
            "✈️ Free Telegram Breakout Channel: https://t.me/truthofmarketss\n\n"
            "#volumeanalysis #technicalanalysis #breakouttrading #usstocks #stockmarket #daytrading #swingtrading #quant"
        ),
        "yt_pin": (
            "🔍 Today's #1 Institutional Volume Breakout is unlocked FREE (and #2-#3 Pro VIP tickers are live) via @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" and I’ll DM you our Live Institutional Volume & Breakout Scanner 👇\n\n'
            "Price can be manipulated on low volume—institutional volume surge cannot hide.\n"
            "Before entering any breakout, verify:\n"
            "1️⃣ Price reclaimed both MA20 and MA60\n"
            "2️⃣ 10-Day Volume Surge is spiking 1.8x to 2.5x+ above normal\n\n"
            '💬 Comment "SMH" below to get the live scanner & Telegram bot in your DMs!\n\n'
            "#technicalanalysis #daytrading #swingtrading #usstocks #stockmarket #priceaction #quanttrading #wallstreet"
        ),
    },
    {
        "num": 10,
        "id": "EP10",
        "topic_kr": "[V4 실전 차트 HUD] 개미 92%가 물리는 좌측 물타기($NVDA·$SMCI) vs 26년 백테스트 +17.81% 우측 돌파($CELH 2.46x)",
        "yt_title": "Why 92% of Dip Buyers Lose Money ($NVDA, $SMCI vs $CELH 2.46x Quant Breakout) 📊🎯 #nvda #smci #celh",
        "yt_desc": (
            "Buying a 'cheap' stock while it is -18% to -23% below its 60-day moving average ($NVDA, $SMCI, $COIN) traps retail capital for months.\n"
            "Across 2,938 validated US trades over 26 years, waiting for Right-Side MA60 reclamation + institutional volume surge ($CELH 2.46x, VIP #2 3.41x) compounded at +17.81% net CAGR with a 55.24% 2x hit rate.\n\n"
            "🎯 Play the 15-Second Wall Street Chart Blind Test: https://truthofmarket.com/#blindtest\n"
            "🩺 Free 3-Second Position Doctor & Live Scanner: https://truthofmarket.com\n"
            "✈️ Free Morning Briefing Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#usstocks #stockmarket #daytrading #swingtrading #nvda #smci #celh #quanttrading #wallstreet"
        ),
        "yt_pin": (
            "🎯 Can you spot the Bull Trap vs the 3.41x Institutional Breakout? Tap @rightsidealpha below and take the 15-Second Chart Blind Test on truthofmarket.com!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" and I’ll DM you our 15-Second Wall Street Chart Blind Test + Live Quant Terminal 👇\n\n'
            "Why do 92% of dip buyers get trapped while Right-Side quants compound at +17.81%/yr?\n"
            "❌ Left-Side Trap: Buying below a falling 60-day moving average ($NVDA -18.3% vs MA60)\n"
            "🟢 Right-Side Ignition: Reclaiming MA60 with 2.46x–3.41x institutional volume ($CELH #1 Free Showcase + VIP #2 Score 98)\n\n"
            '💬 Drop "SMH" in the comments right now and test your Quant IQ in 15 seconds!\n\n'
            "#usstocks #stockmarket #daytrading #swingtrading #nvda #celh #quanttrading #wallstreet"
        ),
    },
    {
        "num": 11,
        "id": "EP11",
        "topic_kr": "$SMCI · $AMD 60일선 붕괴 상태에서의 저가 매수가 계좌를 녹이는 이유",
        "yt_title": "Why $SMCI & $AMD Dip Buyers Got Trapped (The 60-Day Institutional Trend Filter) 📉🚨 #smci #amd #nvda",
        "yt_desc": (
            "Buying a crashing semiconductor stock while it is still trapped below its 60-day moving average is financial suicide.\n"
            "Wall Street quants wait for one non-negotiable proof: price must reclaim the 60-day trendline with surging institutional volume.\n\n"
            "🖥️ Live 72-Stock Breakout Scanner: https://truthofmarket.com\n"
            "✈️ Free Telegram Quant Channel: https://t.me/truthofmarketss\n\n"
            "#smci #amd #nvda #semiconductors #usstocks #stockmarket #swingtrading #quanttrading #wallstreet"
        ),
        "yt_pin": (
            "🚨 Check which semiconductor stocks just reclaimed their 60-day line with volume via @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" and I’ll DM you our Live 60-Day Trend & Breakout Scanner 👇\n\n'
            "Every dead-cat bounce looks like a bottom until institutional sellers slam it down another 30%.\n"
            "Never buy below the 60-day trendline—wait for confirmed Right-Side Ignition.\n\n"
            '💬 Drop "SMH" in the comments for instant access!\n\n'
            "#smci #amd #nvda #semiconductors #usstocks #stockmarket #swingtrading #quanttrading #wallstreet"
        ),
    },
    {
        "num": 12,
        "id": "EP12",
        "topic_kr": "실적 발표(Earnings) 도박 vs 실적 발표 후 기관 수급 확인 우측 돌파 전략",
        "yt_title": "Stop Gambling on $NVDA & $TSLA Earnings — Trade the Post-Earnings Quant Ignition 🎲📈 #nvda #tsla #earnings",
        "yt_desc": (
            "Holding a stock into an earnings report is not investing—it is flipping a coin at a casino.\n"
            "Instead of gambling before earnings, our quant engine waits for post-earnings washout to finish and flags the exact day institutional buyers step back in.\n\n"
            "🖥️ Scan Post-Earnings Institutional Breakouts: https://truthofmarket.com\n"
            "✈️ Free Telegram Quant Channel: https://t.me/truthofmarketss\n\n"
            "#earnings #nvda #tsla #usstocks #stockmarket #daytrading #swingtrading #quanttrading #wallstreet"
        ),
        "yt_pin": (
            "🎯 Scan all 72 US market leaders for post-earnings institutional breakouts via @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" and I’ll DM you our Post-Earnings Institutional Breakout Scanner 👇\n\n'
            "Even when a company beats estimates, Wall Street algorithms can gap the stock down 20% overnight.\n"
            "Stop flipping coins before earnings—wait for confirmed institutional accumulation.\n\n"
            '💬 Comment "SMH" below and check your DMs!\n\n'
            "#earnings #nvda #tsla #usstocks #stockmarket #swingtrading #daytrading #quanttrading #wallstreet"
        ),
    },
    {
        "num": 13,
        "id": "EP13",
        "topic_kr": "반도체 공포·탐욕 지수 75 돌파(Extreme Greed) 시 월가 퀀트가 몰래 비중을 줄이는 법",
        "yt_title": "Semiconductor Fear & Greed Above 75 (Extreme Greed): When Quants Secretly Trim ⚠️🧭 #smh #nvda #soxl",
        "yt_desc": (
            "When everyone on social media is bragging about semiconductor gains, smart money is quietly heading for the exit.\n"
            "Whenever our 7-Factor Semiconductor Fear & Greed Index climbs above 75, our barbell engine trims offensive tech and locks profits into defensive healthcare ($XLV).\n\n"
            "🧭 Live Semiconductor Fear & Greed Gauge: https://truthofmarket.com/semi-fear-greed.html\n"
            "✈️ Free Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#smh #soxl #nvda #semiconductors #usstocks #stockmarket #etfinvesting #quanttrading #wallstreet"
        ),
        "yt_pin": (
            "🧭 Track today's live Semiconductor Fear & Greed score and exact $SMH : $XLV barbell weights via @rightsidealpha!"
        ),
        "ig_caption": (
            'Comment "SMH" to get our Live Semiconductor Fear & Greed Gauge in your DMs 👇\n\n'
            "Chasing semiconductor breakouts when Fear & Greed is above 75 carries massive drawdown risk.\n"
            "See our exact daily $SMH : $XLV barbell allocation in real time.\n\n"
            '💬 Drop "SMH" in the comments below!\n\n'
            "#smh #soxl #nvda #semiconductors #usstocks #stockmarket #quanttrading #wallstreet"
        ),
    },
    {
        "num": 14,
        "id": "EP14",
        "topic_kr": "하락장 물타기(Averaging Down) vs 상승장 불타기(Pyramiding Up)의 수학적 계좌 차이",
        "yt_title": "Averaging Down vs Pyramiding Up: The Math That Separates Quants From Losers 📊🔥 #usstocks #nvda #tsla",
        "yt_desc": (
            "Averaging down into a losing stock is how one bad trade wipes out three years of gains.\n"
            "Wall Street quants cut losers at -9.0% and only add capital after a stock proves itself above the 60-day trendline.\n\n"
            "🩺 Run 3-Second Position Doctor: https://truthofmarket.com\n"
            "✈️ Free Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#usstocks #stockmarket #riskmanagement #swingtrading #daytrading #nvda #tsla #quanttrading"
        ),
        "yt_pin": (
            "🩺 Diagnose your current holdings in 3 seconds with Position Doctor via @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" for instant access to our 3-Second Position Doctor 👇\n\n'
            "Stop feeding good capital to a broken trend while institutional sellers keep unloading.\n"
            "Cut at -9% and ride confirmed Right-Side leaders.\n\n"
            '💬 Comment "SMH" below and check your DMs!\n\n'
            "#usstocks #stockmarket #riskmanagement #swingtrading #quanttrading #wallstreet"
        ),
    },
    {
        "num": 15,
        "id": "EP15",
        "topic_kr": "52주 신저가 종목을 덜컥 사면 추가로 -60% 폭락하는 이유 (바닥 반등 +12% 확인 법칙)",
        "yt_title": "The 52-Week Low Illusion: Why 'Cheap' Stocks Drop Another 60% 📉🛑 #stocks #swingtrading #nvda",
        "yt_desc": (
            "Buying a stock just because it hit the 52-week low list is the fastest way to catch a falling knife.\n"
            "Our 26-year quant study proves the sweet spot only begins after a stock rebounds at least +12% off its low and reclaims the 60-day trendline.\n\n"
            "🖥️ See Confirmed Turnaround Leaders Live: https://truthofmarket.com\n"
            "✈️ Free Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#usstocks #stockmarket #valueinvesting #swingtrading #quanttrading #technicalanalysis #wallstreet"
        ),
        "yt_pin": (
            "📈 See every US stock in the confirmed post-washout Ignition Zone right now via @rightsidealpha!"
        ),
        "ig_caption": (
            'Comment "SMH" and I’ll DM you our Live 72-Stock Turnaround Scanner 👇\n\n'
            "Stocks making new 52-week lows have endless institutional tax-loss selling.\n"
            "Wait until washout completes and price reclaims the 60-day trendline.\n\n"
            '💬 Drop "SMH" in the comments below!\n\n'
            "#usstocks #stockmarket #swingtrading #daytrading #quanttrading #wallstreet"
        ),
    },
    {
        "num": 16,
        "id": "EP16",
        "topic_kr": "주가 폭등 전 헤지펀드 다크풀(Dark Pool) 매집을 포착하는 10일 상대거래량 지표",
        "yt_title": "How to Spot Hedge Fund Accumulation Before a Stock Explodes 2x 🔍🐋 #usstocks #daytrading #nvda",
        "yt_desc": (
            "Hedge funds cannot buy 10 million shares in one day without spiking the price.\n"
            "They leave behind one unmistakable clue: 10-day relative volume surging 1.5x to 2.0x+ above the 20-day average right at the 60-day trendline.\n\n"
            "🔍 Track Institutional Volume Surges Live: https://truthofmarket.com\n"
            "✈️ Free Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#darkpool #volumeanalysis #usstocks #stockmarket #swingtrading #daytrading #quanttrading #wallstreet"
        ),
        "yt_pin": (
            "🐋 Track real-time institutional volume surges across 72 US market leaders via @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" to unlock our Institutional Volume Scanner 👇\n\n'
            "Big money cannot hide volume expansion.\n"
            "See which US stocks are showing 1.8x–2.5x institutional volume surges today.\n\n"
            '💬 Comment "SMH" below and check your DMs!\n\n'
            "#volumeanalysis #usstocks #stockmarket #swingtrading #quanttrading #wallstreet"
        ),
    },
    {
        "num": 17,
        "id": "EP17",
        "topic_kr": "-25% 물린 계좌, 기도매매 대신 3초 포지션 닥터로 보유·교체 매매 판별하기",
        "yt_title": "Down -25% on a US Stock? Run This 3-Second Quant Triage Right Now 🩺📉 #usstocks #nvda #tsla",
        "yt_desc": (
            "When you are down 25% on a stock, hope is the most expensive emotion in the market.\n"
            "Enter your ticker and average buy price into our quantitative Position Doctor for your exact mathematical stop-loss, trend health, and 2x target.\n\n"
            "🩺 Free 3-Second Position Doctor: https://truthofmarket.com\n"
            "✈️ Free Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#usstocks #stockmarket #portfolio #riskmanagement #swingtrading #nvda #tsla #quanttrading"
        ),
        "yt_pin": (
            "🩺 Enter your ticker & avg price into our free 3-Second Position Doctor via @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" and I’ll DM you our free 3-Second Position Doctor link 👇\n\n'
            "Should you hold for recovery, cut the loss, or rotate into an active institutional leader?\n"
            "Let math decide in 3 seconds.\n\n"
            '💬 Drop "SMH" in the comments below!\n\n'
            "#usstocks #stockmarket #swingtrading #riskmanagement #quanttrading #wallstreet"
        ),
    },
    {
        "num": 18,
        "id": "EP18",
        "topic_kr": "금리 급등·매크로 쇼크 때 유행주 90%가 폭락해도 살아남는 4단계 수학적 필터",
        "yt_title": "Why 90% of Hype Stocks Crash in Macro Panics — And the 4-Gate Quant Filter 🛡️📊 #usstocks #qqq #nvda",
        "yt_desc": (
            "Every time treasury yields spike or macro panic hits, 90% of social media hype stocks get wiped out.\n"
            "Our quant engine survived 26 years of crashes because every trade must pass 4 strict gates: C1 Deep Washout, C2 Floor Recovery, C3 MA60 Reclamation, and C4 Volume Surge.\n\n"
            "🛡️ Check Today's 4-Gate Passed Stocks: https://truthofmarket.com\n"
            "✈️ Free Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#usstocks #stockmarket #quanttrading #algotrading #swingtrading #qqq #nvda #wallstreet"
        ),
        "yt_pin": (
            "🛡️ Check which US market leaders pass all 4 institutional gates today via @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" to see today’s US stocks passing all 4 institutional quant gates 👇\n\n'
            "1️⃣ C1: Deep seller washout complete\n"
            "2️⃣ C2: Confirmed floor recovery\n"
            "3️⃣ C3: 60-day trend reclamation\n"
            "4️⃣ C4: Institutional volume surge\n\n"
            '💬 Comment "SMH" below for the live terminal link!\n\n'
            "#usstocks #stockmarket #quanttrading #swingtrading #wallstreet"
        ),
    },
    {
        "num": 19,
        "id": "EP19",
        "topic_kr": "+10%에 일찍 팔지 않고 60일선 트레일링으로 +240% 대세 상승 끝까지 먹는 법",
        "yt_title": "Stop Selling Winners at +10%: How Quants Trail the 60-Day Line for +240% Runs 🚀📈 #nvda #pltr #stocks",
        "yt_desc": (
            "Retail traders cut their winners at +10% and hold their losers down -50%.\n"
            "After taking half off at +100% (TP1) for a risk-free ride, our engine trails the remaining shares along the 60-day moving average until the macro trend breaks.\n\n"
            "📈 See Live Trailing Trend Signals: https://truthofmarket.com\n"
            "✈️ Free Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#nvda #pltr #usstocks #stockmarket #swingtrading #trendfollowing #quanttrading #wallstreet"
        ),
        "yt_pin": (
            "🚀 Flip the retail equation—see live trailing 60-day trend signals across 72 US leaders via @rightsidealpha!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" for our Live 72-Stock Trailing Trend Terminal 👇\n\n'
            "Cut losers mechanically at -9%, lock principal at +100%, and ride the 60-day trendline for massive multi-baggers.\n\n"
            '💬 Drop "SMH" in the comments below!\n\n'
            "#nvda #pltr #usstocks #stockmarket #swingtrading #quanttrading #wallstreet"
        ),
    },
    {
        "num": 20,
        "id": "EP20",
        "topic_kr": "일요일 밤 60초 만에 월요일 급등 임박 Top 5 워치리스트 뽑는 월가 루틴",
        "yt_title": "Wall Street Prep: Build Your Top 5 Breakout Watchlist in 60 Seconds ⚡📋 #usstocks #nvda #tsla",
        "yt_desc": (
            "Amateur traders wake up at 9:25 AM and chase whatever stock is trending on social media.\n"
            "Professional quants filter 72 liquid US leaders down to the exact stocks coiling just below their Right-Side Ignition trigger before the bell.\n\n"
            "📋 Build Your Breakout Watchlist Now: https://truthofmarket.com\n"
            "✈️ Free Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#watchlist #usstocks #stockmarket #swingtrading #daytrading #nvda #tsla #quanttrading #wallstreet"
        ),
        "yt_pin": (
            "📋 Filter 72 liquid US leaders down to today's top Right-Side Ignition candidates via @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" and I’ll DM you today’s Top Right-Side Breakout Watchlist 👇\n\n'
            "Stop chasing social media hype at the open.\n"
            "Track the exact dollar Entry Trigger (TRG) on 72 liquid US leaders in 60 seconds.\n\n"
            '💬 Comment "SMH" below and check your DMs!\n\n'
            "#watchlist #usstocks #stockmarket #swingtrading #daytrading #quanttrading #wallstreet"
        ),
    },
    {
        "num": 21,
        "id": "EP21",
        "topic_kr": "[V3 도파민 대결] $10,000 반도체 물타기 개미(-48%) vs 월가 우측 돌파 퀀트 엔진",
        "yt_title": "$10,000 Retail Dip Buyer vs Wall Street Quant Engine ($SMH, $NVDA, $SOXL) ⚡📊 #nvda #smh #soxl",
        "yt_desc": (
            "Watch what happens to $10,000 buying semiconductor dips below the 60-day line (-48% wipeout) versus our Wall Street Right-Side Quant Engine on the exact same cycle.\n"
            "Zero left-side guessing: wait for MA60 reclamation + 2.0x institutional volume + PW-RSI 90+ ignition.\n\n"
            "🖥️ Live 72-Stock Terminal (#1 Signal Free): https://truthofmarket.com\n"
            "🧭 Semiconductor Fear & Greed: https://truthofmarket.com/semi-fear-greed.html\n"
            "✈️ Free Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#nvda #smh #soxl #semiconductors #usstocks #stockmarket #quanttrading #swingtrading #wallstreet"
        ),
        "yt_pin": (
            "⚡ Stop averaging down below the 60-day line! Check today's #1 Free Ignition Stock & Semi Fear/Greed score via @rightsidealpha!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" and I’ll DM you the live Wall Street Quant Terminal link 👇\n\n'
            "📉 $10,000 Retail Dip Buyer: Buys below MA60, averages down at -25%, wiped out -48% on a dead-cat trap.\n"
            "📈 Wall Street Quant Engine: Waits for MA60 breakout + 2.0x volume + PW-RSI 90 ignition with a strict -9% stop.\n\n"
            '💬 Drop "SMH" in the comments to unlock today’s live signals!\n\n'
            "#nvda #smh #soxl #semiconductors #usstocks #stockmarket #quanttrading #wallstreet"
        ),
    },
    {
        "num": 22,
        "id": "EP22",
        "topic_kr": "[V3 10초 초압축 도파민] 60일선 붕괴 반도체 절대 물타기 금지 — 2배 거래량 + PW-RSI 90 법칙",
        "yt_title": "Never Buy Crashing Chip Stocks Below the 60-Day Line ($NVDA, $SMH, $AMD) 🚨⚡ #nvda #smh #amd",
        "yt_desc": (
            "90% of semiconductor bottom-guessers get wiped out by dead-cat traps.\n"
            "Wait for 2.0x institutional volume and Price-Weighted RSI 90+ ignition, lock a -9% stop, and ride 2x targets.\n\n"
            "🖥️ Check Live Ignition Stocks: https://truthofmarket.com\n"
            "✈️ Free Telegram Channel: https://t.me/truthofmarketss\n\n"
            "#nvda #smh #amd #soxl #semiconductors #usstocks #stockmarket #quanttrading #wallstreet"
        ),
        "yt_pin": (
            "🚨 Check which semiconductor & US growth stocks hit 2.0x volume + PW-RSI 90 ignition today via @rightsidealpha!"
        ),
        "ig_caption": (
            'Comment "SMH" and I’ll DM you our Live Semiconductor & 72-Stock Breakout Scanner 👇\n\n'
            "Never catch a falling chip stock below its 60-day line.\n"
            "Wait for 2.0x volume + PW-RSI 90 ignition at truthofmarket.com.\n\n"
            '💬 Comment "SMH" below for instant DM access!\n\n'
            "#nvda #smh #amd #semiconductors #usstocks #stockmarket #quanttrading #wallstreet"
        ),
    },
    {
        "num": 23,
        "id": "EP23",
        "topic_kr": "[V4 실전 차트 블라인드 테스트] 익명 차트 A($NVDA -18.3% 함정) vs 익명 차트 B($CELH 2.46x 돌파) — 당신의 선택은?",
        "yt_title": "Wall Street Chart Blind Test: BUY the Dip or AVOID the Trap? ($NVDA vs 3.41x Quant Ignition) 🎯📊 #nvda #stocks",
        "yt_desc": (
            "Can you beat 92% of retail dip-buyers on this 15-second Wall Street Chart Blind Test?\n"
            "• Mystery Stock A: Down 26% off its 52-week high, trading -18.3% below MA60 on 0.92x volume → Revealed as $NVDA ($178.67 Left-Side Trap).\n"
            "• Mystery Stock B: Washed out, reclaimed MA60 by +12.7%, and surged on 2.46x institutional volume → Revealed as $CELH ($33.19 #1 Free Showcase).\n\n"
            "🎯 Play All 3 Rounds Interactively (Including the Score 98 / 3.41x Volume Anomaly): https://truthofmarket.com/#blindtest\n"
            "✈️ Free Telegram Quant Channel: https://t.me/truthofmarketss\n\n"
            "#chartquiz #technicalanalysis #nvda #celh #usstocks #stockmarket #swingtrading #quanttrading #wallstreet"
        ),
        "yt_pin": (
            "🎯 Did you call Round 1 ($NVDA Trap) and Round 2 ($CELH Ignition) correctly? Play Round 3 (3.41x Volume Surge, Score 98) live via @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" and I’ll DM you the interactive 15-Second Wall Street Chart Blind Test 👇\n\n'
            "Can you tell a Left-Side Falling Knife from a Right-Side Institutional Ignition?\n"
            "🔴 Round 1 Reveal: $NVDA ($178.67) sitting -18.3% below MA60 on 0.92x volume = Left-Side Trap\n"
            "🟢 Round 2 Reveal: $CELH ($33.19) reclaiming MA60 (+12.7%) on 2.46x volume = Right-Side Ignition\n"
            "🔥 Round 3 Challenge: Score 98/100 + 3.41x Institutional Volume Anomaly\n\n"
            '💬 Comment "SMH" below to test your Quant IQ and unlock today’s top signals!\n\n'
            "#chartanalysis #usstocks #stockmarket #nvda #celh #swingtrading #quanttrading #wallstreet"
        ),
    },
    {
        "num": 24,
        "id": "EP24",
        "topic_kr": "[V4 $10,000 실전 계좌 대결] 좌측 물타기 개미($5,200 반토막) vs 우측 PW-RSI 퀀트($22,697 복리)",
        "yt_title": "$10,000 Account Race: Retail Dip-Buyer ($5,200) vs Right-Side Quant Engine ($22,697) 💰⚔️ #usstocks #nvda #smci",
        "yt_desc": (
            "What happens when you put $10,000 into 'Buy the Dip' below the 60-day moving average versus $10,000 into a mechanical Right-Side PW-RSI Quant Engine?\n"
            "• Trader A (Dip Buyer): Bought $SMCI (-23% vs MA60) & $COIN (-21% vs MA60) with no stop-loss → $10,000 shrank to $5,200 (-48%).\n"
            "• Trader B (RightSideAlpha): Risked only -$135 per trade (-9% stop on 15% slot) on 2.46x–3.41x volume breakouts → $10,000 compounded to $22,697.\n\n"
            "💰 Simulate Your Own $10,000 Trade Ticket: https://truthofmarket.com\n"
            "🎯 Take the 15-Second Chart Blind Test: https://truthofmarket.com/#blindtest\n\n"
            "#portfoliomanagement #riskmanagement #usstocks #stockmarket #smci #coin #celh #quanttrading #wallstreet"
        ),
        "yt_pin": (
            "💰 Enter your own capital ($5K–$100K) and copy exact dollar buy, -9% stop, and +100% target tickets via @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" and I’ll DM you our Live $10,000 Trade Ticket Calculator + 3-Second Position Doctor 👇\n\n'
            "The math that separates institutional compounders from trapped retail accounts:\n"
            "📉 Without a -9% stop below MA60: $10,000 drops to $5,200 (-48% requires +92% just to break even!)\n"
            "📈 With our 15% slot & -9% stop: Max risk is just -$135 (-1.35% of equity) while targeting +$750 to +$1,500 on 2.46x+ volume breakouts.\n\n"
            '💬 Drop "SMH" below for instant access!\n\n'
            "#riskmanagement #usstocks #stockmarket #swingtrading #quanttrading #wallstreet"
        ),
    },
    {
        "num": 25,
        "id": "EP25",
        "topic_kr": "[V4 기관 수급 레이더] 오늘 72종목 중 기관 거래량 2.46배~3.41배 폭발한 TOP 3 (#1 $CELH 무료 공개 & #2·#3 VIP)",
        "yt_title": "3 US Stocks Triggered Extreme 2.46x–3.41x Institutional Volume Today (#1 $CELH Unlocked) 🚨🐋 #celh #usstocks",
        "yt_desc": (
            "Out of 72 liquid NYSE & NASDAQ leaders today, 67 were filtered out as noise or left-side traps—and only 5 entered our confirmed Ignition Zone.\n"
            "• #1 Free Daily Showcase: $CELH ($33.19 | Score 84 | 2.46x Vol Surge | Stop $30.20 | Target $66.38)\n"
            "• #2 & #3 VIP Anomalies: Scoring 98/100 with 3.41x and 3.17x institutional volume breakouts.\n\n"
            "🔓 Check #1 $CELH Free & Unlock #2–#3 VIP Tickers: https://truthofmarket.com\n"
            "🎯 15-Second Chart Blind Test: https://truthofmarket.com/#blindtest\n\n"
            "#celh #volumeanalysis #breakoutstocks #usstocks #stockmarket #swingtrading #quanttrading #wallstreet"
        ),
        "yt_pin": (
            "🐋 See #1 $CELH ($33.19, 2.46x Vol) unlocked FREE and reveal today's Score 98 / 3.41x VIP breakout via @rightsidealpha bio!"
        ),
        "ig_caption": (
            'Comment "SMH" or "ALPHA" to see today’s #1 Free Showcase ($CELH 2.46x Vol) & unlock the 3.41x VIP Breakout 👇\n\n'
            "Institutions cannot hide 3.41x volume expansion.\n"
            "🔓 #1 Free Showcase: $CELH ($33.19 · Score 84 · Stop $30.20 · TP1 $66.38)\n"
            "🔒 #2 Pro VIP: Score 98/100 · 3.41x Institutional Volume Surge\n"
            "🔒 #3 Pro VIP: Score 98/100 · 3.17x Institutional Volume Surge\n\n"
            '💬 Comment "SMH" below and check your DMs!\n\n'
            "#celh #breakoutstocks #usstocks #stockmarket #swingtrading #quanttrading #wallstreet"
        ),
    },
]


def load_daily_state() -> Dict[str, Any]:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {"next_ep": 1, "last_sent_date": "", "history": []}


def save_daily_state(st: Dict[str, Any]) -> None:
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(st, ensure_ascii=False, indent=2), encoding="utf-8")


def _load_live_market_snapshot() -> Dict[str, Any]:
    snap = {
        "as_of": "2026-11-05",
        "fg_score": 18.0,
        "regime_en": "EXTREME FEAR",
        "smh_close": 504.48,
        "smh_dd_pct": -24.58,
        "xlv_close": 179.28,
        "celh_close": 30.04,
        "celh_trg": 29.33,
        "celh_stop": 27.34,
        "celh_tp1": 60.08,
        "celh_score": 98,
        "vip2_score": 94,
        "vip2_sector": "Solar Modules",
        "vip2_vol": 2.15,
        "vip3_score": 92,
        "vip3_sector": "Semiconductors",
        "vip3_vol": 1.98,
    }
    if SEMI_OVERVIEW_FILE.exists():
        try:
            ov = json.loads(SEMI_OVERVIEW_FILE.read_text(encoding="utf-8"))
            snap["as_of"] = str(ov.get("date") or snap["as_of"])
            snap["fg_score"] = float(ov.get("fg_score") or snap["fg_score"])
            snap["regime_en"] = str(ov.get("regime_en") or snap["regime_en"]).upper()
            snap["smh_close"] = float(ov.get("smh_close") or snap["smh_close"])
            snap["smh_dd_pct"] = float(ov.get("smh_dd_pct") or snap["smh_dd_pct"])
            snap["xlv_close"] = float(ov.get("xlv_close") or snap["xlv_close"])
        except Exception:
            pass
    if STOCKS_MASTER_FILE.exists():
        try:
            raw = json.loads(STOCKS_MASTER_FILE.read_text(encoding="utf-8"))
            rows = raw if isinstance(raw, list) else raw.get("stocks", [])
            ign = [r for r in rows if r.get("zone_code") == "IGNITION_ZONE"]
            if len(ign) >= 1:
                s1 = ign[0]
                snap["celh_close"] = float(s1.get("close") or snap["celh_close"])
                snap["celh_trg"] = float(s1.get("entry_trigger_price") or snap["celh_trg"])
                snap["celh_stop"] = float(s1.get("stop_loss_price") or snap["celh_stop"])
                snap["celh_tp1"] = float(s1.get("tp1_2x_price") or snap["celh_tp1"])
                snap["celh_score"] = int(s1.get("score") or snap["celh_score"])
            if len(ign) >= 2:
                s2 = ign[1]
                snap["vip2_score"] = int(s2.get("score") or snap["vip2_score"])
                snap["vip2_sector"] = str(s2.get("sector") or snap["vip2_sector"])
                snap["vip2_vol"] = float(s2.get("vol_surge_10d") or snap["vip2_vol"])
            if len(ign) >= 3:
                s3 = ign[2]
                snap["vip3_score"] = int(s3.get("score") or snap["vip3_score"])
                snap["vip3_sector"] = str(s3.get("sector") or snap["vip3_sector"])
                snap["vip3_vol"] = float(s3.get("vol_surge_10d") or snap["vip3_vol"])
        except Exception:
            pass
    return snap


def send_episode_package_to_telegram(ep_num: int, advance_state: bool = False) -> bool:
    total_eps = len(EPISODE_COPY_KIT)
    ep_idx = (ep_num - 1) % total_eps
    kit = EPISODE_COPY_KIT[ep_idx]
    real_num = kit["num"]
    mp4_path = VIDEOS_DIR / f"EP{real_num:02d}_US_Viral_Shorts.mp4"
    snap = _load_live_market_snapshot()

    def _read_env_tok(fp, key):
        if os.path.exists(fp):
            m = re.search(rf"^{key}=(.+)$", open(fp, encoding="utf-8", errors="ignore").read(), re.M)
            if m:
                return m.group(1).strip().strip("'\"")
        return ""

    rsa_tok = _read_env_tok(str(BASE_DIR / ".env"), "RSA_TELEGRAM_BOT_TOKEN")
    env_chat_id = _read_env_tok(str(BASE_DIR / ".env"), "HQ_TELEGRAM_CHAT_ID")
    kfg_tok = _read_env_tok(r"D:\드림컴퍼니\2사업부\.env", "TELEGRAM_BOT_TOKEN")
    token = os.environ.get("RSA_TELEGRAM_BOT_TOKEN") or rsa_tok or os.environ.get("HQ_TELEGRAM_BOT_TOKEN") or telegram_service._resolve_token() or kfg_tok
    chat_id = os.environ.get("HQ_TELEGRAM_CHAT_ID") or env_chat_id or "-1003834697086"
    base = f"https://api.telegram.org/bot{token}"

    yt_title = kit["yt_title"].replace("getbreakai.com", "truthofmarket.com")
    yt_desc = (
        kit["yt_desc"]
        .replace("getbreakai.com", "truthofmarket.com")
        .replace("https://t.me/RigjtsideAlphabot", "https://t.me/truthofmarketss")
    )
    ig_caption = (
        kit["ig_caption"]
        .replace("getbreakai.com", "truthofmarket.com")
        .replace("https://t.me/RigjtsideAlphabot", "https://t.me/truthofmarketss")
        + f"\n\n📊 LIVE PW-RSI ORDER BOOK ({snap['as_of']}):\n"
        + f"🔥 #1 [FREE SHOWCASE] $CELH (${snap['celh_close']:.2f} | Score {snap['celh_score']}/100) → Entry ${snap['celh_trg']:.2f} | -9% Stop ${snap['celh_stop']:.2f} | +100% TP1 ${snap['celh_tp1']:.2f}\n"
        + f"🔒 #2 $████ [PRO VIP — {snap['vip2_sector']}] (Score {snap['vip2_score']}/100 | Vol {snap['vip2_vol']:.2f}x)\n"
        + f"🔒 #3 $████ [PRO VIP — {snap['vip3_sector']}] (Score {snap['vip3_score']}/100 | Vol {snap['vip3_vol']:.2f}x)\n"
        + '👉 Comment "SMH" or "ALPHA" for the instant DM link!'
    )

    x_cashtag_copy = (
        f"🧭 Semiconductor Fear & Greed Index: {snap['fg_score']:.1f}/100 ({snap['regime_en']}) as of {snap['as_of']}\n"
        f"• $SMH Close: ${snap['smh_close']:.2f} ({snap['smh_dd_pct']:.1f}% 52W DD) → 80% $SMH : 20% $XLV Contrarian Barbell Active\n\n"
        f"🎯 Daily PW-RSI Right-Side Ignition Order Book:\n"
        f"#1 Free Showcase: $CELH (${snap['celh_close']:.2f} | Score {snap['celh_score']}/100 | Stop ${snap['celh_stop']:.2f} | TP1 ${snap['celh_tp1']:.2f})\n"
        f"#2-#5 Pro VIP Picks: Locked ({snap['vip2_sector']} & {snap['vip3_sector']}, 2.0x+ Vol Surge)\n\n"
        f"🖥️ Live 72-Stock Terminal: https://truthofmarket.com/semi-fear-greed.html\n"
        f"$NVDA $SOXL $AMD $AVGO $TSLA $PLTR"
    )

    reddit_tv_copy = (
        f"[Quant Study] $SMH Semiconductor Fear & Greed at {snap['fg_score']:.1f} ({snap['regime_en']}) + 72-Stock Post-Washout Right-Side Ignition (PW-RSI) Screen ({snap['as_of']})\n\n"
        f"1. Macro Regime ($SMH vs $XLV Barbell):\n"
        f"- 7-Factor Semiconductor Fear & Greed Score: {snap['fg_score']:.1f}/100 ({snap['regime_en']})\n"
        f"- $SMH is trading at ${snap['smh_close']:.2f} ({snap['smh_dd_pct']:.2f}% off 52W high). When FG <= 25, our 26.8-year model shifts from 70/30 to 80% $SMH : 20% $XLV.\n\n"
        f"2. PW-RSI Right-Side Turnaround Rules (2000-2026 Backtest: 24.48% CAGR):\n"
        f"- C1: Deep 52W High Drawdown washout complete\n"
        f"- C2: Rebounding off 52W low support\n"
        f"- C3: Price reclaimed both 20D & 60D Moving Averages\n"
        f"- C4: 10D Relative Volume Surge >= 1.5x\n"
        f"- Risk Rules: -9.0% Mechanical Hard Stop (Rule 1) | 55-Day Dead Money Time Stop (Rule 2) | +100% 2x Principal Harvest (Rule 3)\n\n"
        f"3. Today's #1 Unmasked Signal:\n"
        f"- $CELH (Score {snap['celh_score']}/100): Close ${snap['celh_close']:.2f} | Entry Trigger ${snap['celh_trg']:.2f} | -9% Hard Stop ${snap['celh_stop']:.2f} | +100% TP1 ${snap['celh_tp1']:.2f}\n\n"
        f"Full interactive 72-stock screener & $SMH/$XLV simulator: https://truthofmarket.com"
    )

    timeout_cfg = httpx.Timeout(connect=20.0, read=240.0, write=240.0, pool=30.0)
    with httpx.Client(timeout=timeout_cfg) as client:
        from scripts.render_dual_yt_ig_cta import ensure_dual_videos

        yt_video_path = mp4_path
        ig_video_path = mp4_path
        if mp4_path.exists():
            try:
                yt_str, ig_str = ensure_dual_videos(str(mp4_path), "TOM", force=False)
                yt_video_path = pathlib.Path(yt_str)
                ig_video_path = pathlib.Path(ig_str)
            except Exception as e_render:
                print(f"[DailyShorts] Dual render warning: {e_render}")

        yt_safe_pin = (
            f"📌 External links aren't clickable in Shorts comments!\n"
            f"👉 {kit['yt_pin']} (Full $NVDA, $TSLA, $SOXL, $PLTR & $SMH -9% Stop / +100% Target table + FREE 3-Second Position Doctor: tap @rightsidealpha channel icon below → click truthofmarket.com in Bio! 📊🚀)"
        )

        yt_title_esc = html.escape(yt_title)
        yt_desc_esc = html.escape(yt_desc)
        yt_pin_esc = html.escape(yt_safe_pin)
        ig_cap_esc = html.escape(ig_caption)
        x_copy_esc = html.escape(x_cashtag_copy)
        reddit_copy_esc = html.escape(reddit_tv_copy)

        if yt_video_path.exists():
            yt_caption = (
                f"🇺🇸 <b>[1사업부: truthofmarket.com · 1/2 영상: 유튜브 쇼츠 전용판 ({real_num}/{total_eps}편)]</b>\n"
                f"📌 주제: {kit['topic_kr']}\n"
                "✅ 엔딩 자막: 유튜브 맞춤형 (@rightsidealpha 관련 동영상 &amp; 프로필 링크 유도)\n"
                "📺 업로드 유튜브: https://www.youtube.com/@rightsidealpha"
            )
            client.post(
                f"{base}/sendVideo",
                data={"chat_id": chat_id, "caption": yt_caption, "parse_mode": "HTML", "supports_streaming": "true"},
                files={"video": (yt_video_path.name, yt_video_path.read_bytes(), "video/mp4")},
            )

        yt_messages = [
            f"🔴 <b>[1/4] 1사업부 유튜브 쇼츠 제목 (@rightsidealpha)</b> — 아래 박스 터치 시 바로 복사\n<pre>{yt_title_esc}</pre>",
            f"🟠 <b>[2/4] 1사업부 유튜브 쇼츠 설명란 (@rightsidealpha)</b> — 아래 박스 터치 시 바로 복사\n<pre>{yt_desc_esc}</pre>",
            f"📌 <b>[3/4] 1사업부 유튜브 쇼츠 안전 고정댓글 (외부 URL 0% · 관련 동영상 브릿지)</b> — 아래 박스 터치 시 복사 후 고정(Pin)\n<pre>{yt_pin_esc}</pre>",
        ]
        ok = True
        for m_html in yt_messages:
            r_txt = client.post(
                f"{base}/sendMessage",
                json={"chat_id": chat_id, "text": m_html, "parse_mode": "HTML", "disable_web_page_preview": True},
            )
            ok = ok and (r_txt.status_code == 200 and r_txt.json().get("ok", False))

        if ig_video_path.exists():
            ig_caption_vid = (
                f"📸 <b>[1사업부: truthofmarket.com · 2/2 영상: 인스타 릴스 전용판 ({real_num}/{total_eps}편)]</b>\n"
                "✅ 엔딩 자막: 인스타 매니챗 맞춤형 (댓글에 'SMH' 또는 'ALPHA' 입력 시 1초 만에 DM 자동 발송 유도)\n"
                "📸 업로드 인스타: https://www.instagram.com/rightsidealpha"
            )
            client.post(
                f"{base}/sendVideo",
                data={"chat_id": chat_id, "caption": ig_caption_vid, "parse_mode": "HTML", "supports_streaming": "true"},
                files={"video": (ig_video_path.name, ig_video_path.read_bytes(), "video/mp4")},
            )

        extra_messages = [
            f"🟣 <b>[4/4] 1사업부 인스타그램 릴스 전체 본문 (@rightsidealpha · 매니챗 'SMH'/'ALPHA' 연동)</b> — 아래 박스 터치 시 바로 복사\n<pre>{ig_cap_esc}</pre>",
        ]
        for m_html in extra_messages:
            r_extra = client.post(
                f"{base}/sendMessage",
                json={"chat_id": chat_id, "text": m_html, "parse_mode": "HTML", "disable_web_page_preview": True},
            )
            ok = ok and (r_extra.status_code == 200 and r_extra.json().get("ok", False))

        print(f"[DailyShorts] Sent Full YT+IG Package EP{real_num:02d}/{total_eps:02d}: ok={ok}")

    if advance_state and ok:
        st = load_daily_state()
        today_str = datetime.now().strftime("%Y-%m-%d")
        st["last_sent_date"] = today_str
        st["next_ep"] = (real_num % total_eps) + 1
        st.setdefault("history", []).append(
            {"ep": real_num, "sent_at": datetime.now(timezone.utc).isoformat()}
        )
        save_daily_state(st)

    return ok


def main() -> int:
    parser = argparse.ArgumentParser(description="Daily 6:00 AM Shorts & Reels Telegram Sender")
    parser.add_argument("--ep", type=int, default=0, help="Send specific episode (1..22)")
    parser.add_argument("--next", action="store_true", help="Send next queued episode and advance state")
    args = parser.parse_args()

    if args.ep > 0:
        ok = send_episode_package_to_telegram(args.ep, advance_state=False)
        return 0 if ok else 1

    st = load_daily_state()
    next_ep = int(st.get("next_ep", 1))
    ok = send_episode_package_to_telegram(next_ep, advance_state=True)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
