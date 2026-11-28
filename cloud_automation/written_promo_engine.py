#!/usr/bin/env python3
# -*- coding: utf-8 -*-
r"""
cloud_automation/written_promo_engine.py
================================================================================
Dream Company 365-Day Unattended 'Written Promotion' Engine (Channel 1 + A/B Evolver)
Implements Book Ch.12 Slippery-Slide Copywriting x Own-Domain High-Density SEO
Columns (2,000+ chars, Real-Data Table, Checklist, Article+FAQPage JSON-LD,
Mid+Bottom Inline CTA) + Official IndexNow (Naver/Bing) + Weekly Single-Variable
Headline A/B Auto-Evolution (`<title>` & `<h1>` auto-swap + IndexNow re-ping).

Hard Safety Guardrails:
  - X (Twitter) Paid API ($0.20/link post): PERMANENTLY DISABLED (`X_PAID_API_FORBIDDEN = True`)
  - Unofficial Naver Selenium/scraping bots: PERMANENTLY FORBIDDEN
  - Polar banned words (`1:1`, `Clinical`, `Diagnosis`, `Prescription`), buy/sell
    timing signals, real singer names, fake subscriber counts/reviews, KFK affiliates:
    100% BLOCKED by `check_written_auto_gate()` before any write or publish!
================================================================================
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import html as _html
import json
import os
from pathlib import Path
import re
import sys
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional, Tuple

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

sys.path.insert(0, str(Path(__file__).resolve().parent))
from promo_hard_gate import check_ai_slop_gate, check_promo_hard_gate, scrub_ai_slop  # noqa: E402
try:
    from brand_signature import format_series_header  # noqa: E402
except Exception:
    def format_series_header(div: str, episode: Any = None, channel: str = "seo", path: Any = None, allow_em_dash: bool = True, max_len: Any = None) -> str:  # type: ignore[misc]
        return ""


def to_clean_url(url: str) -> str:
    """Normalizes Cloudflare Pages URLs to final HTTP 200 Clean URLs (strips `/index.html` and `.html`)."""
    raw = str(url or "").strip()
    if not raw:
        return raw
    base, frag = (raw.split("#", 1) + [""])[:2]
    path_part, query = (base.split("?", 1) + [""])[:2]
    if path_part.endswith("/index.html"):
        path_part = path_part[: -len("index.html")]
    elif path_part.endswith(".html"):
        path_part = path_part[:-5]
    rebuilt = path_part + (f"?{query}" if query else "") + (f"#{frag}" if frag else "")
    return rebuilt

KST = dt.timezone(dt.timedelta(hours=9))
ROOT = Path(__file__).resolve().parent.parent
MATRIX_PATH = ROOT / "data" / "message_matrix_5div.json"
INDEXNOW_CFG_PATH = ROOT / "data" / "indexnow_config.json"
LEDGER_PATH = ROOT / "data" / "written_promo_ledger.json"

D1_DB_ID = "5fca0c1f-64cb-4277-85c4-b2ee9944bc06"
X_PAID_API_FORBIDDEN = True  # Paid X API ($0.20/post with link) permanently excluded
UNOFFICIAL_SCRAPER_FORBIDDEN = True  # Official IndexNow + Meta Graph APIs ONLY

DEFAULT_INDEXNOW_KEY = "dc7a91e4f28b4c6ea513d809b7c2f418"

AI_CLICHE_BANNED = (
    "란 무엇인가",
    "알아보겠습니다",
    "결론적으로",
    "총정리",
    "delve into",
    "game-changer",
    "いかがでしたでしょうか",
    "徹底解説",
)

DIV_BANNED: Dict[str, Tuple[str, ...]] = {
    "TOM": ("buy signal", "sell signal", "guaranteed return", "SOXL", "TQQQ", "SQQQ", "NVDA", "SCHD", "JEPI", "VOO", "lemonsqueezy", "trycloudflare.com", "□"),
    "KFG": ("1:1", "clinical", "diagnosis", "diagnose", "prescription", "prescribe", "disease", "disorder", "cure", "iherb", "amazon", "lemonsqueezy", "trycloudflare.com", "□"),
    "GBA": ("買いシグナル", "売りシグナル", "売買タイミング", "t.me", "Telegram", "オルカン", "1489", "VYM", "SOXL", "TQQQ", "lemonsqueezy", "trycloudflare.com", "□"),
    "HERO": ("\ud669\uc601\uc6c5", "\uc784\uc601\uc6c5", "\uc601\ud0c1", "\uc774\ucc2c\uc6d0", "\uae40\ud638\uc911", "\uc7a5\ubbfc\ud638", "\uc815\ub3d9\uc6d0", "\ubc15\uc11c\uc9c4", "whop.com", "buy.polar.sh", "latpeed.com", "유료 결제", "구독료", "골드 VIP", "lemonsqueezy", "trycloudflare.com", "□"),
    "KFK": ("1:1", "최저가", "할인율", "특가", "폭탄세일", "쿠팡", "네이버페이", "쇼핑커넥트", "링크프라이스", "lemonsqueezy", "trycloudflare.com", "□"),
}

DIV_WEB_CONFIG: Dict[str, Dict[str, Any]] = {
    "TOM": {
        "host": "truthofmarket.com",
        "base_url": "https://truthofmarket.com",
        "article_url_prefix": "/insights/",
        "local_roots": [ROOT / "1사업부", ROOT / "1사업부" / "dist"],
        "article_rel_dir": "insights",
        "lang": "en",
        "brand": "Truth of Market",
        "accent": "#0F2C22",
        "bg": "#FCFCFA",
        "body_font_px": 18,
        "diag_url": "https://truthofmarket.com/#tom-retirement-architect",
        "diag_label": "Run the Free 30-Second Retirement Crash Stress-Test",
        "sample_url": "https://truthofmarket.com/assets/downloads/tom_sample_2p.pdf",
        "sample_label": "Preview the Free 2-Page 2000–2025 Sample Workbook PDF",
        "disclaimer": "Educational retirement and historical allocation research only (not individualized investment advice).",
    },
    "KFG": {
        "host": "kisfitglobal.com",
        "base_url": "https://kisfitglobal.com",
        "article_url_prefix": "/qna/",
        "local_roots": [ROOT / "2사업부" / ".gh-pages-kisfitglobal", ROOT / "2사업부" / "dist", ROOT / "2사업부" / "dist-global", ROOT / "2사업부"],
        "article_rel_dir": "qna",
        "lang": "en",
        "brand": "KISFIT Studio",
        "accent": "#1B4332",
        "bg": "#FAF7F2",
        "body_font_px": 18,
        "diag_url": "https://kisfitglobal.com/",
        "diag_label": "Run Your Free 60-Second US CDC Height & Velocity Check",
        "sample_url": "https://kisfitglobal.com/assets/downloads/kfg_sample_2p.pdf",
        "sample_label": "Preview the Free 2-Page US CDC Sample Reference PDF",
        "disclaimer": "100% automated self-serve educational reference built on public US CDC growth tables for adult parents (18+).",
    },
    "GBA": {
        "host": "getbreakai.com",
        "base_url": "https://getbreakai.com",
        "article_url_prefix": "/jp/column/",
        "local_roots": [ROOT / "3사업부", ROOT / "3사업부" / "dist", ROOT / "3사업부" / "cf_dist"],
        "article_rel_dir": "jp/column",
        "lang": "ja",
        "brand": "GetBreakAI 日本",
        "accent": "#0F2C22",
        "bg": "#FCFCFA",
        "body_font_px": 18,
        "diag_url": "https://getbreakai.com/jp/#gba-retirement-architect-jp",
        "diag_label": "30秒無料・新NISA暴落耐性診断を回してみる",
        "sample_url": "https://getbreakai.com/jp/downloads/gba_jp_sample_2p.pdf",
        "sample_label": "無料2ページ・過去25年統計サンプルPDFを先に見る",
        "disclaimer": "※本記事は2000〜2025年の過去統計に基づく教育・情報提供を目的としており、個別銘柄の投資助言ではありません。",
    },
    "HERO": {
        "host": "paradise-hero.com",
        "base_url": "https://paradise-hero.com",
        "article_url_prefix": "/story/",
        "local_roots": [ROOT / "4사업부", ROOT / "4사업부" / "cf_dist"],
        "article_rel_dir": "story",
        "lang": "ko",
        "brand": "김쌤의영웅라디오 · 백운호 사랑방",
        "accent": "#0E2820",
        "bg": "#FAF7F2",
        "body_font_px": 21,  # Strict 20px+ senior big-font breathing!
        "radio_url": "https://paradise-hero.com/stream.html",
        "radio_label": "백운호 14분 라디오·6대 대표곡 바로 듣기 (평생 100% 무료)",
        "card_url": "https://paradise-hero.com/vip.html",
        "card_label": "큰글씨 카톡 아침 안부카드 3초 무료 공유하기",
        "market_url": "https://paradise-hero.com/#senior-curation-market",
        "market_shop_naver": "https://cshop.naver.com/paradiseshop",
        "market_shop_coupang": "https://influencers.coupang.com/s/paradisehero",
        "disclaimer": "※ 가수 백운호는 김쌤의영웅라디오 오리지널 가상 트로트 아티스트이며 사랑방은 평생 100% 무료입니다. (하단 시니어 생활 추천 상품은 네이버 쇼핑커넥트 및 쿠팡 파트너스 활동의 일환으로 이에 따른 일정액의 수수료를 제공받습니다.)",
    },
    "KFK": {
        "host": "kidsfit.co.kr",
        "base_url": "https://kidsfit.co.kr",
        "article_url_prefix": "/qna/",
        "local_roots": [ROOT / "5사업부", ROOT / "5사업부" / "dist"],
        "article_rel_dir": "qna",
        "lang": "ko",
        "brand": "키즈핏 성장 아틀리에",
        "accent": "#1B4332",
        "bg": "#FAF7F2",
        "body_font_px": 18,
        "diag_url": "https://kidsfit.co.kr/#kfk-bone-age-interpreter",
        "diag_label": "상업성 광고 없는 30초 무료 질병관리청 성장 진단 돌리기",
        "sample_url": "https://kidsfit.co.kr/assets/downloads/kfk_sample_2p.pdf",
        "sample_label": "결제 전 2페이지 무료 샘플 리포트 PDF 먼저 보기",
        "disclaimer": "키즈핏 성장 아틀리에는 상업성 제휴 광고가 0건인 순수 데이터 기반 교육 가이드입니다.",
    },
}


# ==============================================================================
# 1. Verified Real-Data Comparison Tables & Deep Slippery-Slide Essay Knowledge
# ==============================================================================
DIVISION_DEEP_DATA: Dict[str, Dict[str, Any]] = {
    "TOM": {
        "table_caption": "Verified 2000–2025 Historical Stress Comparison (Dot-Com, 2008 GFC, 2022 Rate Shock)",
        "table_headers": ["Allocation Approach", "Typical Crisis Drawdown", "Historical Recovery Rhythm", "24-Mo Liquidity Buffer"],
        "table_rows": [
            ["100% Brokerage Sweep Cash (~0.01%)", "0% nominal / -35% real over 15 yrs", "Never recovers inflation purchasing power", "High nominal, erodes silently"],
            ["Classic 60/40 (Long Bonds + Stocks)", "-18% to -32% (both fell in 2022)", "28–42 months in rate-shock regimes", "Exposed to bond duration risk"],
            ["100% Single-Sector Tech Growth", "-45% to -70% in deep cycles", "48–72+ months (sequence risk)", "None: forces selling at lows"],
            ["SMH × XLV + 24-Mo SGOV Cushion", "Cut severe drawdowns nearly in half", "~17 months historical calm recovery", "Ring-fenced 24 months of bills"],
        ],
        "checklist_title": "Your 3-Step Calm Retirement Stress-Check (Zero Complex Spreadsheets)",
        "checklist_items": [
            "Ring-fence 24 months of net living expenses outside equities in short-term US Treasury liquidity (SGOV) so a bad quarter never forces a share sale.",
            "Pair secular semiconductor compounding (SMH) with non-cyclical healthcare resilience (XLV) instead of leaning on long-duration bonds that broke in 2022.",
            "Write down your semi-annual rebalancing calendar and 401(k)/IRA tax-location rules once, then stop checking daily headlines the other 363 days.",
        ],
        "why_old_fails": (
            "Walk into almost any retirement workshop or open a standard online retirement calculator, and you will notice the exact same blind spot. "
            "Nearly every free tool assumes a neat, flat seven percent return marching upward in a straight line every single year. "
            "Real retirement life never arrives in straight lines. It arrives in lumpy waves like 2000, 2008, and 2022, and the order in which those waves strike matters more than the 25-year average.\n\n"
            "When a retiree withdraws monthly living bills directly from fallen equity shares during an early downturn, those sold shares are gone forever and can never rebound when markets recover. "
            "Meanwhile, the opposite extreme (leaving six figures sitting in a default 0.01% brokerage sweep account) feels calm on Monday morning yet quietly surrenders tens of thousands of dollars in real buying power over a single decade. "
            "Neither extreme respects the thirty years of disciplined work it took to build that nest egg."
        ),
        "mechanism_deep": (
            "That is why serious independent retirement design separates two completely different jobs instead of forcing one crowded portfolio to do everything at once. "
            "Job One is sleeping calmly through a two-year storm: ring-fencing 24 months of real household cash flow inside short-duration US Treasuries (SGOV) so Wall Street headlines cannot touch next month's grocery or property-tax check.\n\n"
            "Job Two is outrunning 25 years of living-cost inflation without gambling on speculative stories: balancing structural semiconductor productivity (SMH) alongside non-cyclical healthcare demand (XLV). "
            "Across the documented 2000–2025 public market record (covering the Dot-Com bust, the 2008 Global Financial Crisis, and the 2022 simultaneous stock-and-bond shock), separating liquidity from a growth-plus-defense core removed forced bear-market liquidation while keeping semi-annual upkeep under twenty minutes."
        ),
        "faqs": [
            ("Why did the classic 60/40 portfolio struggle so sharply in 2022?", "Long-duration bonds fell sharply alongside equities when interest rates rose rapidly in 2022, leaving retirees without a stable liquidity sleeve for monthly withdrawals."),
            ("How many months of safe Treasury cash does the 2-pillar stress-test model?", "The historical 2000–2025 study models an 18-to-24-month short-term Treasury liquidity buffer (SGOV) so retirees avoid selling equities during drawdowns."),
            ("Can I inspect the historical tables before paying for any workbook?", "Yes. Every reader can run the free 30-second stress-test and open our free 2-page 2000–2025 sample workbook PDF before deciding."),
        ],
    },
    "KFG": {
        "table_caption": "Official US CDC Stature Velocity & Bone-Age Elapsed-Lag Reference (Ages 4–14)",
        "table_headers": ["Parent Check Method", "Typical Blind Spot", "US CDC Velocity Benchmark", "Actionable Clarity"],
        "table_rows": [
            ["Parent Height Average Alone", "+/- 3.5 inch error band", "Ignores current percentile lane", "Low: misses routine bottlenecks"],
            ["Annual Birthday Wall Mark Only", "Misses 12 months of pace slowdown", "Normal ages 4–10: 2.0–2.5 in/yr", "Delayed by a full year"],
            ["1-Year-Old Wrist Bone-Age Note", "Can drift 1.5–2.0 in during pre-puberty", "Must adjust for elapsed months (Δt)", "Outdated without lag adjustment"],
            ["Monthly Barefoot Wall + CDC Velocity", "Spots slowing pace within 60–90 days", "Tracks true in/yr & bedtime/protein levers", "High: calm checkup preparation"],
        ],
        "checklist_title": "3 Calm Evening & Measurement Habits Parents Can Start Tonight ($0)",
        "checklist_items": [
            "Shift lights-out earlier toward 9:00–9:30 PM with a 2-hour bedtime sugar buffer so early slow-wave sleep runs undisturbed.",
            "Anchor dinner around complete protein (eggs, salmon, lean meats, tofu) and 10 minutes of daily vertical jump play instead of chasing expensive gummy ads.",
            "Measure barefoot against the exact same hallway wall once every 30 days in the morning and log annualized growth pace (in/yr) for calm routine checkups.",
        ],
        "why_old_fails": (
            "If you have ever searched late at night wondering whether your child is growing on track, you already know how noisy the internet feels. "
            "One tab sells eighty-dollar chewable gummies promising effortless inches, while another offers a generic parent-height average that carries a massive plus-or-minus 3.5-inch spread.\n\n"
            "Even a single height reading at a quick annual checkup leaves most parents with unanswered questions on the drive home. "
            "A static number on one Tuesday morning cannot show whether your child grew 2.4 inches over the past twelve months or quietly slowed to 1.6 inches while bedtime drifted past 10 PM and evening snacks crept closer to sleep. "
            "And when parents rely on an older bone-age note without adjusting for elapsed months, expectations can silently drift by two full inches right before the pre-puberty window accelerates."
        ),
        "mechanism_deep": (
            "Calm parenting starts when guesswork gives way to clean, verifiable public reference math. "
            "Published US CDC 2–18 growth tables show that healthy school-age children generally grow 2.0 to 2.5 inches per year before their adolescent spurt, meaning annual pace tells far more truth than a single snapshot.\n\n"
            "Instead of pushing affiliate supplements or overwhelming families with jargon, KISFIT Studio pairs official US CDC percentile curves with elapsed-time bone-age adjustment and three realistic home habits: consistent lights-out timing, solid dinner protein, and playful vertical movement. "
            "In sixty seconds you see where your child tracks today, spot the single evening bottleneck worth fixing first, and can preview a free 2-page sample PDF before ever deciding whether you want the full printable family log."
        ),
        "faqs": [
            ("How fast do school-age kids normally grow on official US CDC reference charts?", "Before the adolescent growth spurt, school-age children ages 4 to 10 typically average 2.0 to 2.5 inches (roughly 5 to 6 cm) per year."),
            ("Why is measuring barefoot at the same time of day every 30 days helpful?", "Spine compression can change standing height by up to half an inch between morning and night, so consistent morning wall checks give parents clean velocity trends."),
            ("Does KISFIT Studio sell affiliate vitamins or require a subscription?", "Never. KISFIT Studio is a 100% automated, ad-free educational reference tool with a free 60-second check and free 2-page sample PDF preview."),
        ],
    },
    "GBA": {
        "table_caption": "2000〜2025年 過去25年統計に基づく新NISA（1,800万円枠）設計アプローチ比較",
        "table_headers": ["老後資産の置き方", "歴史的危機時の揺れ幅", "回復リズムの目安", "新NISA法定枠の活かし方"],
        "table_rows": [
            ["銀行普通預金のみ（実質目減り）", "名目0%／物価2〜3%で10年約2割減", "購買力は取り戻しにくい", "非課税枠1,800万円を未活用"],
            ["高配当・人気投信への一点集中", "危機時に-35%〜-55%の深い下落", "回復に3〜5年かかる局面あり", "頻繁な売買で年間360万円枠を消耗"],
            ["従来の米国長期債入り60/40", "2022年利上げ局面で株・債券同時下落", "金利上昇期に回復が長期化", "円建て老後生活費クッションが薄い"],
            ["SMH×XLV（成長枠上限1,200万円）＋安全資産クッション", "2000・2008・2022年で深い下落を約半減", "過去統計で約17ヶ月前後の穏やかな回復", "成長枠1,200万円＋つみたて枠600万円＋個人向け国債で整然管理"],
        ],
        "checklist_title": "50代・60代が今夜30秒で確認したい穏やかな3ステップ",
        "checklist_items": [
            "向こう2年分の生活防衛資金を個人向け国債（変動10年）や短期安全資産へ切り分け、相場急落時に慌てて売却しない土台を作る。",
            "新NISAの成長投資枠（上限1,200万円）は半導体成長（SMH）と生活防衛ヘルスケア（XLV）の両輪で過去25年のバランスを確認する。",
            "楽天・SBI証券では成り行き注文を避け、年2回の穏やかな点検日だけを紙の設計図に書き残して普段は相場ニュースから離れる。",
        ],
        "why_old_fails": (
            "定年が視野に入る50代・60代になると、テレビや動画サイトから毎日のように「新NISAは今すぐ満額埋めるべき」「高利回り商品で毎月配当を」という威勢のよい言葉が流れてきます。\n\n"
            "ところが、いざ大切にしてきた退職金や預金を動かそうとすると、多くの方が同じ壁の前で立ち止まります。銀行預金のまま置けば物価上昇で毎年じわじわ購買力が削られる一方で、流行りのハイテク銘柄や高利回り投信へ偏って乗せてしまえば、2008年や2022年級の急落が一度来ただけで老後5年分の安心が一気に吹き飛んでしまうからです。\n\n"
            "さらに見落とされがちなのが、新NISAの年間投資枠（360万円）と生涯成長投資枠（上限1,200万円）の仕組みです。相場の値動きに驚いて売買を繰り返すほど、せっかくの非課税メリットは薄れ、特定口座での約20.315%課税や高コスト投信の手数料が静かに資産を削っていきます。"
        ),
        "mechanism_deep": (
            "長年ご家族のために誠実に働いてこられた50代・60代の方に必要なのは、毎日の値動きを当てにいく騒がしい相場予想ではありません。必要なのは、2000年から2025年までの25年間（ITバブル崩壊・リーマンショック・2022年金利急騰）という厳しい現実をくぐり抜けた客観的な過去統計と、ご自宅の机に置いて静かに見返せる1枚の設計図です。\n\n"
            "GetBreakAI 日本では、生活費を守る安全クッション（個人向け国債・変動10年等）と、インフレに負けない成長×防衛の両輪（SMH×XLV）を明確に分けて考える教育ワークブックを整備しています。まずは30秒の無料診断と2ページの無料サンプルPDFで、ご自身の配分が過去の大暴落をどう通過するか静かに確かめてみてください。"
        ),
        "faqs": [
            ("新NISAの成長投資枠1,200万円は1年で使い切る必要がありますか？", "いいえ。年間上限（成長投資枠240万円・つみたて枠120万円、計360万円）の範囲で5年以上かけて穏やかに整える設計が定年前後の心理的負担を抑えます。"),
            ("なぜ生活費2年分の安全クッションを先に切り分けるのですか？", "相場急落時に生活費のために株を取り崩すと回復期の資産が大きく目減りするため、2年分の安全資金を別に確保しておくことで慌てた売却を防げます。"),
            ("購入前にワークブックの中身を確認できますか？", "はい。まずは無料4ステップ診断と無料2ページ・サンプルPDFをご確認いただき、ご納得された場合のみご検討いただけます。"),
        ],
    },
    "HERO": {
        "table_caption": "어머님·아버님 저녁 일상을 편안하게 바꾸는 백운호 사랑방 무료 루틴 비교",
        "table_headers": ["저녁 시간 보내는 법", "눈·마음의 피로도", "동년배 소통·위로", "이용 비용"],
        "table_rows": [
            ["어두운 방 작은 글씨 스마트폰 검색", "눈 시림·어깨 뻐근함 급증", "혼자 보는 적적함 지속", "시력·수면 피로 누적"],
            ["자극적인 뉴스·광고 많은 영상 반복", "마음이 복잡해지고 잠 설침", "광고 끊김에 몰입 방해", "마음의 휴식 부족"],
            ["화·금·일 저녁 6시 백운호 14분 라디오", "큰글씨(20px+) · 잔잔한 76 BPM 휴식", "전국 어머님 감동 사연 공감", "평생 100% 무료"],
            ["3초 카톡 큰글씨 아침 안부카드 공유", "버튼 1번으로 돋보기 없이 완성", "자식·친구에게 따뜻한 안부 전달", "평생 100% 무료"],
        ],
        "checklist_title": "어머님·아버님이 오늘 저녁부터 바로 누리시는 3가지 무료 기쁨",
        "checklist_items": [
            "해 질 녘 집안이 조용해질 때 광고 없는 백운호 6대 대표곡과 14분 라디오 방송을 편하게 틀어두세요.",
            "잠들기 전 어두운 방에서 작은 글씨를 억지로 보지 마시고, 큰글씨 가사집과 따뜻한 차 한 잔으로 눈과 목을 쉬게 해 주세요.",
            "내일 아침에는 회원가입 없이 3초 만에 백운호 큰글씨 아침 안부카드를 만들어 가족·친구 카톡방에 건네 보세요.",
        ],
        "why_old_fails": (
            "낮 동안에는 집안일이며 장보기며 바쁘게 움직여서 잘 모르지만, 저녁 식사를 마치고 설거지까지 끝낸 밤 9시가 넘어가면 거실이 유난히 크게 느껴질 때가 있습니다.\n\n"
            "그 적적한 마음을 달래 보려고 스마트폰을 켜 보아도, 글씨는 깨알처럼 작아 눈이 금세 침침해지고 노래 한 곡 들으려 하면 중간마다 시끄러운 광고가 흐름을 뚝 끊어 놓습니다. 바쁜 자식들에게 괜히 전화해서 서운한 마음을 비치기도 미안해, 결국 조용히 불을 끄고 천장만 바라보며 하루를 마무리하시는 어머님·아버님들이 참 많습니다.\n\n"
            "평생 가족을 위해 가장 먼저 일어나고 가장 늦게 주무시며 묵묵히 버텨 오신 어머님·아버님께서는 눈치 보거나 돈 걱정할 필요 없이, 언제든 편히 문 열고 들어와 쉬실 수 있는 따뜻한 사랑방이 꼭 필요합니다."
        ),
        "mechanism_deep": (
            "김쌤의영웅라디오와 오리지널 가상 트로트 가수 백운호의 사랑방은 바로 그런 어머님·아버님의 마음을 어루만지기 위해 평생 100% 무료로 문을 열었습니다.\n\n"
            "돋보기 없이도 시원하게 읽히는 20px 이상 큰글씨 화면, 매주 화·금·일 저녁 6시에 찾아오는 14분 감동 사연 라디오, 그리고 중간 광고 없이 잔잔한 76 BPM 바리톤 음색으로 흘러나오는 백운호 6대 대표곡까지 복잡한 로그인 절차 없이 터치 한 번으로 바로 즐기실 수 있습니다.\n\n"
            "오늘 밤에는 따뜻한 보리차나 도라지차 한 잔 곁에 두시고 백운호의 노래 한 곡과 함께 어깨의 짐을 잠시 내려놓아 보세요. 내일 아침 가족 단톡방에 전할 큰글씨 안부카드도 3초면 무료로 완성됩니다."
        ),
        "faqs": [
            ("백운호 라디오와 6대 대표곡 감상은 정말 평생 무료인가요?", "네, 김쌤의영웅라디오 사랑방과 백운호 6대 대표곡, 카톡 아침 안부카드는 비용 부담 없이 언제나 열려 있는 평생 100% 무료 공간입니다."),
            ("정규 라디오 방송은 언제 들을 수 있나요?", "매주 화요일·금요일·일요일 저녁 6시에 14분 감동 사연과 백운호 대표곡 정규 방송이 열립니다."),
            ("스마트폰 글씨가 작아서 어려운데 이용하기 괜찮을까요?", "paradise-hero.com 사랑방은 시니어 어머님·아버님을 위해 모든 본문을 20px 이상 큰글씨와 큼직한 버튼으로 설계해 돋보기 없이도 편안합니다."),
        ],
    },
    "KFK": {
        "table_caption": "질병관리청 소아청소년 성장도표 기준 초등 성장 점검 방식별 정확도 비교",
        "table_headers": ["성장 확인 방법", "가장 흔한 놓침 포인트", "질병관리청 핵심 기준", "부모 실천 명확도"],
        "table_rows": [
            ["엄마·아빠 키 평균 계산만 확인", "최대 ±7cm 오차 발생", "현재 백분위·성장속도 미반영", "낮음: 습관 병목 파악 불가"],
            ["1년에 1번 학교 신체검사만 확인", "성장 정체(연 4cm 미만) 1년 뒤 인지", "초등 평균 연 5~6cm 성장", "골든타임 대응 지연"],
            ["작년 뼈나이 결과 그대로 신뢰", "촬영 경과 시차(Δt)로 예상키 4cm 오차", "경과 개월수(Δt) 보정 필수", "시차 미보정 시 오판 위험"],
            ["월 1회 맨발 키 기록 + Δt 보정", "60~90일 내 속도 변화 즉시 포착", "연간 성장속도(cm/년) 자동 판독", "높음: 수면·식단·진료질문 정리"],
        ],
        "checklist_title": "비싼 영양제보다 먼저 오늘 밤 집에서 바꾸는 3가지 무료 성장 세팅",
        "checklist_items": [
            "밤 9시 이후 거실 하얀 형광등과 스마트폰 빛을 줄여 초등 아이가 밤 10시 전 깊은 서파수면에 들도록 세팅하세요.",
            "우유만 하루 3잔 넘게 먹이는 대신 저녁 식탁에 달걀·두부·생선 같은 완전 단백질과 채소를 균형 있게 올리세요.",
            "매달 1일 아침 기상 직후 같은 벽에 맨발로 키를 기록해 우리 아이의 실제 연간 성장속도(cm/년)가 연 5cm 이상인지 확인하세요.",
        ],
        "why_old_fails": (
            "초등학교 3~5학년 아이를 키우는 부모님이라면 누구나 한 번쯤 밤늦게 검색창을 열었다가 더 큰 불안에 빠진 경험이 있으실 겁니다.\n\n"
            "인터넷에는 수십만 원짜리 키 성장 영양제 후기와 협찬 광고가 끝없이 쏟아지고, 정작 궁금한 '우리 아이가 지금 잘 크고 있는 건지, 성장판이 빨리 닫히고 있는 건지'에 대한 객관적인 기준은 어디에도 속 시원히 나와 있지 않습니다.\n\n"
            "특히 부모님들이 가장 많이 놓치는 대목이 두 가지입니다. 첫째는 1년에 7~8cm씩 갑자기 크는 것을 무조건 반가워하다가 뼈나이가 실제 나이보다 1년 이상 앞서가는 신호를 놓치는 경우이고, 둘째는 작년에 소아과에서 들었던 뼈나이 결과를 오늘 그대로 대입해 최종 예상키가 4~5cm씩 어긋나는 경우입니다. 좋은 부모라면 아이의 성장 골든타임을 놓치지 말아야 한다는 조용한 책임감이 무거울수록, 과장된 광고가 아니라 정확한 숫자가 필요합니다."
        ),
        "mechanism_deep": (
            "키즈핏 성장 아틀리에는 상업성 제휴 광고나 영양제 판매 링크가 단 1건도 없는 순수 데이터 기반 소아성장 연구 공간입니다.\n\n"
            "질병관리청 공식 소아청소년 성장도표를 토대로 우리 아이의 현재 또래 백분위는 물론, 뼈나이 촬영 이후 흐른 시간(Δt)을 자동 보정한 성인 예상키, 그리고 수면 시각·저녁 단백질·활동량 중 지금 당장 손을 봐야 할 단 1가지 핵심 병목을 30초 만에 차분하게 짚어 드립니다.\n\n"
            "유료 리포트를 고민하시기 전에 먼저 무료 30초 진단과 2페이지 무료 샘플 PDF부터 직접 열어 보세요. 감에 의존해 비싼 영양제를 바꾸며 흘려보내는 1년과, 매달 30초 맨발 키 기록으로 실제 성장속도(cm/년)를 확인하며 지켜내는 1년은 아이의 최종 키에서 분명한 차이를 만듭니다."
        ),
        "faqs": [
            ("초등학생 아이가 1년에 몇 cm 미만으로 크면 점검이 필요한가요?", "질병관리청 성장 기준상 사춘기 전 초등학생은 보통 연 5~6cm 자라며, 1년에 4cm 미만으로 둔화되거나 반대로 사춘기 징후와 함께 연 7~8cm 급증하면 뼈나이 및 성장속도 점검이 권장됩니다."),
            ("뼈나이 촬영을 아직 하지 않았어도 무료 진단을 받을 수 있나요?", "네, 뼈나이 미측정 상태에서도 현재 나이·성별·키·부모 키와 저녁 습관만으로 질병관리청 또래 백분위와 핵심 습관 병목을 무료로 확인하실 수 있습니다."),
            ("키즈핏은 영양제나 건강기능식품 제휴 광고를 넣나요?", "전혀 넣지 않습니다. 키즈핏은 제휴 상품 노출 0건을 원칙으로 하며, 먼저 2페이지 무료 샘플 PDF를 확인하신 뒤 필요할 때만 정밀 리포트를 선택하실 수 있습니다."),
        ],
    },
}


# ==============================================================================
# 2. Strict Book Ch.12 Written Auto-Gate
# ==============================================================================
def check_written_auto_gate(div: str, title: str, html_doc: str, plain_text: str, is_seo_article: bool = True) -> Tuple[bool, List[str]]:
    errors: List[str] = []
    div_u = div.upper()
    comb = f"{title}\n{plain_text}"
    low = comb.lower()

    if not X_PAID_API_FORBIDDEN or not UNOFFICIAL_SCRAPER_FORBIDDEN:
        errors.append("safety_flag_tampered")

    if len(title.strip()) < 14:
        errors.append("title_too_short")

    # 2026-11-25 Shared Hard Gate (KO/EN/JA AI clichés + Polar/Whop/Legal banned terms)
    hg_ok, hg_errs = check_promo_hard_gate(div_u, comb, surface="seo_article" if is_seo_article else "ig_caption")
    if not hg_ok:
        for e in hg_errs:
            if e not in errors:
                errors.append(e)

    # Reject AI clichés & textbook intros
    for cl in AI_CLICHE_BANNED:
        if cl.lower() in low:
            errors.append(f"ai_cliche:{cl}")

    # Division-specific strict guardrails
    for bad in DIV_BANNED.get(div_u, ()):
        if bad.lower() in low:
            errors.append(f"banned_{div_u}:{bad}")

    # Zero-Hangul enforcement for EN/JA divisions
    if div_u in ("TOM", "KFG", "GBA") and re.search(r"[\uac00-\ud7a3]", comb):
        errors.append(f"hangul_leak_in_{div_u}")

    # Reject fabricated subscriber/review numbers
    for fake in ("10,000+ subscribers", "50,000 parents", "100,000 users", "만 명이 선택한", "1만 구독자 돌파"):
        if fake.lower() in low:
            errors.append(f"fabricated_claim:{fake}")

    if is_seo_article:
        visible_len = len(re.sub(r"\s+", " ", plain_text).strip())
        min_len = 2000 if div_u in ("TOM", "KFG") else 1500
        if visible_len < min_len:
            errors.append(f"seo_article_too_thin:{visible_len}<{min_len}")
        if "<table" not in html_doc:
            errors.append("missing_real_data_table")
        if '"@type": "FAQPage"' not in html_doc or '"@type": "Article"' not in html_doc:
            errors.append("missing_json_ld_article_or_faq")
        if "utm_medium=seo_article" not in html_doc:
            errors.append("missing_seo_inline_utm_cta")
        if "<!-- AB_TITLE_SLOT_START -->" not in html_doc:
            errors.append("missing_ab_title_slot_marker")
        if div_u == "HERO":
            if "font-size: 21px" not in html_doc and "font-size:21px" not in html_doc:
                errors.append("hero_missing_20px_plus_font")
            if "#senior-curation-market" not in html_doc or "수수료" not in html_doc:
                errors.append("hero_missing_market_or_ftc_disclosure")

    return len(errors) == 0, errors


# ==============================================================================
# 3. High-Density Slippery-Slide SEO Article Builder + Sitemap/RSS + IndexNow
# ==============================================================================
def ensure_indexnow_key() -> str:
    if INDEXNOW_CFG_PATH.exists():
        try:
            cfg = json.loads(INDEXNOW_CFG_PATH.read_text(encoding="utf-8"))
            if cfg.get("indexnow_key"):
                return str(cfg["indexnow_key"]).strip()
        except Exception:
            pass
    key = os.getenv("INDEXNOW_KEY", "").strip() or DEFAULT_INDEXNOW_KEY
    INDEXNOW_CFG_PATH.parent.mkdir(parents=True, exist_ok=True)
    INDEXNOW_CFG_PATH.write_text(
        json.dumps(
            {
                "indexnow_key": key,
                "created_at_kst": dt.datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST"),
                "endpoints": [
                    "https://api.indexnow.org/indexnow",
                    "https://searchadvisor.naver.com/indexnow",
                ],
                "hosts": [cfg["host"] for cfg in DIV_WEB_CONFIG.values()],
            },
            ensure_ascii=False,
            indent=2,
        ) + "\n",
        encoding="utf-8",
    )
    return key


def _slugify(div: str, matrix_id: str, date_str: str) -> str:
    raw = f"{matrix_id.lower()}-{date_str}"
    return re.sub(r"[^a-z0-9-]+", "-", raw).strip("-") + ".html"


def select_article_ab_pair(matrix_db: Dict[str, Any], div: str, week_seed: int = 0) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """Selects Stage 1-2 Control (Arm A) + Challenger (Arm B, different hook_type!) from 5x5 matrix."""
    d_obj = matrix_db["divisions"][div.upper()]
    s12 = [c for c in d_obj["matrix"] if int(c.get("stage", 0)) in (1, 2) and c.get("status", "active") != "paused"]
    if len(s12) < 2:
        s12 = [c for c in d_obj["matrix"] if int(c.get("stage", 0)) in (1, 2)]
    s12.sort(key=lambda c: (-float(c.get("weight", 1.0)), c["id"]))
    idx_a = week_seed % len(s12)
    arm_a = s12[idx_a]
    diff = [c for c in s12 if c["hook_type"] != arm_a["hook_type"]]
    arm_b = diff[week_seed % len(diff)] if diff else s12[(idx_a + 1) % len(s12)]
    return arm_a, arm_b


def _pass1_lock_seo_outline(div_u: str, matrix_db: Dict[str, Any], date_str: str, week_seed: int = 0) -> Dict[str, Any]:
    """Pass 1: Lock primary verified numbers, single thesis, scene hook, and Clean URL canonical."""
    wcfg = DIV_WEB_CONFIG[div_u]
    d_obj = matrix_db["divisions"][div_u]
    sb = d_obj["storybrand_7parts"]
    deep = DIVISION_DEEP_DATA[div_u]
    arm_a, arm_b = select_article_ab_pair(matrix_db, div_u, week_seed=week_seed)

    headline = str(arm_a["hook_line"]).strip()
    challenger_headline = str(arm_b["hook_line"]).strip()
    matrix_id = str(arm_a["id"])
    slug = _slugify(div_u, matrix_id, date_str)
    clean_slug = slug[:-5] if slug.endswith(".html") else slug
    canonical_url = to_clean_url(f"{wcfg['base_url']}{wcfg['article_url_prefix']}{clean_slug}")

    return {
        "div_u": div_u,
        "wcfg": wcfg,
        "sb": sb,
        "deep": deep,
        "arm_a": arm_a,
        "arm_b": arm_b,
        "headline": headline,
        "challenger_headline": challenger_headline,
        "matrix_id": matrix_id,
        "utm_a": f"{matrix_id}_vA",
        "utm_b": f"{arm_b['id']}_vB",
        "slug": slug,
        "canonical_url": canonical_url,
        "date_str": date_str,
        "locked_evidence_rows": len(deep["table_rows"]),
    }


def _pass3_wash_and_verify_seo(
    div_u: str,
    headline: str,
    draft_html: str,
    lang: str,
    canonical_url: str,
) -> Tuple[str, str, bool, List[str], Dict[str, Any]]:
    """Pass 3: Dedicated AI Slop wash pass + Fail-Closed Hard Gate & Clean URL verification."""
    washed_html, scrub_report = scrub_ai_slop(draft_html, lang=lang, max_em_dashes=2, is_html=True)
    plain_text = re.sub(r"<script.*?</script>|<style.*?</style>|<[^>]+>", " ", washed_html, flags=re.S)
    plain_text = _html.unescape(re.sub(r"\s+", " ", plain_text)).strip()

    ok, errs = check_written_auto_gate(div_u, headline, washed_html, plain_text, is_seo_article=True)
    slop_ok, slop_errs = check_ai_slop_gate(washed_html, max_em_dashes=2, is_html=True)
    if not slop_ok:
        ok = False
        for e in slop_errs:
            if e not in errs:
                errs.append(e)
    if canonical_url.endswith(".html"):
        ok = False
        errs.append("canonical_url_has_html_extension")
    return washed_html, plain_text, ok, errs, scrub_report


def build_seo_article_html(div: str, matrix_db: Dict[str, Any], date_str: str, week_seed: int = 0) -> Dict[str, Any]:
    div_u = div.upper()
    # Pass 1: Lock verified evidence numbers, outline & Clean URL
    outline = _pass1_lock_seo_outline(div_u, matrix_db, date_str=date_str, week_seed=week_seed)
    wcfg = outline["wcfg"]
    sb = outline["sb"]
    deep = outline["deep"]
    arm_a = outline["arm_a"]
    arm_b = outline["arm_b"]
    headline = outline["headline"]
    challenger_headline = outline["challenger_headline"]
    matrix_id = outline["matrix_id"]
    utm_a = outline["utm_a"]
    utm_b = outline["utm_b"]
    slug = outline["slug"]
    canonical_url = outline["canonical_url"]

    # Pass 2: Compose complete Slippery-Slide HTML draft
    esc = _html.escape

    # Build verified real-data table HTML
    th_html = "".join(f"<th>{esc(h)}</th>" for h in deep["table_headers"])
    tr_html = "".join(
        "<tr>" + "".join(f"<td>{esc(cell)}</td>" for cell in row) + "</tr>"
        for row in deep["table_rows"]
    )
    table_html = (
        f'<figure class="data-card"><figcaption>{esc(deep["table_caption"])}</figcaption>'
        f'<div class="tbl-wrap"><table><thead><tr>{th_html}</tr></thead><tbody>{tr_html}</tbody></table></div></figure>'
    )

    checklist_li = "".join(f"<li>{esc(it)}</li>" for it in deep["checklist_items"])
    checklist_html = f'<section class="check-box"><h2>{esc(deep["checklist_title"])}</h2><ol>{checklist_li}</ol></section>'

    # Mid & Bottom Inline Conversion Bridge (UTM tagged for D1 attribution!)
    if div_u == "HERO":
        r_url = f"{wcfg['radio_url']}?utm_source=seo&utm_medium=seo_article&utm_content={utm_a}"
        c_url = f"{wcfg['card_url']}?utm_source=seo&utm_medium=seo_article&utm_content={utm_a}"
        m_url = f"{wcfg['market_url']}"
        mid_cta_html = (
            f'<aside class="inline-cta">'
            f'<p class="cta-kicker">평생 100% 무료 백운호 가족 사랑방</p>'
            f'<div class="cta-row">'
            f'<a class="btn-primary" href="{esc(r_url)}">{esc(wcfg["radio_label"])}</a>'
            f'<a class="btn-secondary" href="{esc(c_url)}">{esc(wcfg["card_label"])}</a>'
            f'</div></aside>'
        )
        bottom_cta_html = (
            mid_cta_html +
            f'<section id="senior-curation-market" class="curation-card">'
            f'<h2>어머님·아버님 저녁 라디오 감상을 편하게 돕는 실생활 추천 준비물</h2>'
            f'<p>주방 설거지·침대 머리맡·거실 청취 시 눈과 목을 지켜 주는 도라지배즙·루테인·큰글씨 블루투스 라디오만 정직하게 골라 두었습니다. 필요하신 분만 <a href="{esc(m_url)}">사랑방 안심 준비물관(#senior-curation-market)</a>을 천천히 둘러보세요.</p>'
            f'<div class="cta-row">'
            f'<a class="btn-primary" href="{esc(wcfg["market_shop_naver"])}" rel="sponsored noopener" target="_blank">네이버페이 안심 셀렉트샵 보기 &rarr;</a>'
            f'<a class="btn-secondary" href="{esc(wcfg["market_shop_coupang"])}" rel="sponsored noopener" target="_blank">쿠팡 내일 도착 효도 준비물관 &rarr;</a>'
            f'</div>'
            f'<p class="ftc-note">{esc(wcfg["disclaimer"])}</p>'
            f'</section>'
        )
    else:
        sep_d = "&" if "?" in wcfg["diag_url"] else "?"
        d_base, d_frag = (wcfg["diag_url"].split("#", 1) + [""])[:2]
        d_utm = f"{d_base}{sep_d}utm_source=seo&utm_medium=seo_article&utm_content={utm_a}" + (f"#{d_frag}" if d_frag else "")
        s_utm = f"{wcfg['sample_url']}?utm_source=seo&utm_medium=seo_article&utm_content={utm_a}"
        kicker = (
            "Free 30-Second Interactive Tool & Sample Preview" if wcfg["lang"] == "en"
            else ("無料30秒診断＆2ページ無料サンプル" if wcfg["lang"] == "ja" else "부담 없는 무료 30초 진단 & 2페이지 샘플 확인")
        )
        mid_cta_html = (
            f'<aside class="inline-cta">'
            f'<p class="cta-kicker">{esc(kicker)}</p>'
            f'<div class="cta-row">'
            f'<a class="btn-primary" href="{esc(d_utm)}">{esc(wcfg["diag_label"])} &rarr;</a>'
            f'<a class="btn-secondary" href="{esc(s_utm)}">{esc(wcfg["sample_label"])} &rarr;</a>'
            f'</div></aside>'
        )
        bottom_cta_html = mid_cta_html

    # Paragraph split helper (2-3 sentences per paragraph)
    def _p_blocks(txt: str) -> str:
        return "\n".join(f"<p>{esc(p.strip())}</p>" for p in txt.strip().split("\n\n") if p.strip())

    p3 = sb["problem_3layers"]
    empathy_html = (
        f'<section class="empathy-lead">'
        f'<p class="hook-lead">{esc(arm_a["slide_script_body"])}</p>'
        f'<p>{esc(p3["external"])} {esc(p3["internal"])}</p>'
        f'<p><strong>{esc(p3["philosophical"])}</strong></p>'
        f'</section>'
    )

    contrast_title = (
        "One Year From Today: Drifting vs. Having a Written Calm Plan" if wcfg["lang"] == "en"
        else ("1年後の違い：先送りした日々 vs 穏やかな設計図を持つ日々" if wcfg["lang"] == "ja" else "1년 뒤의 차이: 막연한 걱정으로 흘려보낸 1년 vs 기준을 세운 1년")
    )
    contrast_html = (
        f'<section class="contrast-box"><h2>{esc(contrast_title)}</h2>'
        f'<p><strong>If left unchanged:</strong> {esc(sb["failure_avoided_1yr"])}</p>'
        f'<p><strong>With a calm routine:</strong> {esc(sb["success_peaceful_life"])}</p></section>'
    )

    faq_items_html = "\n".join(
        f'<div class="faq-item"><h3>{esc(q)}</h3><p>{esc(a)}</p></div>'
        for q, a in deep["faqs"]
    )

    # Valid Article + FAQPage JSON-LD
    json_ld = json.dumps(
        {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Article",
                    "headline": headline,
                    "description": arm_a["slide_script_body"][:155],
                    "datePublished": f"{date_str}T07:00:00+09:00",
                    "dateModified": f"{date_str}T07:00:00+09:00",
                    "inLanguage": wcfg["lang"],
                    "mainEntityOfPage": canonical_url,
                    "author": {"@type": "Organization", "name": wcfg["brand"]},
                    "publisher": {"@type": "Organization", "name": wcfg["brand"]},
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
                        for q, a in deep["faqs"]
                    ],
                },
            ],
        },
        ensure_ascii=False,
        indent=2,
    )

    h2_why = (
        "Why Conventional Advice Quietly Breaks Down" if wcfg["lang"] == "en"
        else ("なぜ従来のやり方では心が落ち着かないのか" if wcfg["lang"] == "ja" else "기존 방식대로 해도 마음이 놓이지 않는 진짜 이유")
    )
    h2_how = (
        "A Simpler, Evidence-Anchored Mechanism" if wcfg["lang"] == "en"
        else ("迷いを終わらせる、過去データに基づくシンプルな仕組み" if wcfg["lang"] == "ja" else "복잡한 추측을 끝내는 가장 단순하고 정확한 해결 기준")
    )
    h2_faq = "Frequently Asked Questions" if wcfg["lang"] == "en" else ("よくあるご質問" if wcfg["lang"] == "ja" else "자주 묻는 질문")
    nl_prompt = (
        "Get one calm weekly note like this (no password, 1-click unsubscribe):" if wcfg["lang"] == "en"
        else ("このような穏やかな統計レターを無料で受け取る（1クリック解除可）：" if wcfg["lang"] == "ja" else "이런 차분한 실전 레터를 무료로 받아보세요 (비밀번호 없음 · 1클릭 수신거부):")
    )
    nl_btn = "Subscribe Free" if wcfg["lang"] == "en" else ("無料で受け取る" if wcfg["lang"] == "ja" else "무료 구독하기")
    series_sig_hdr = format_series_header(div_u, channel="seo", allow_em_dash=False)
    eyebrow_text = f"{wcfg['brand']} · {date_str}" + (f" · {series_sig_hdr}" if series_sig_hdr else "")

    html_doc = f"""<!DOCTYPE html>
<html lang="{wcfg['lang']}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- AB_TITLE_SLOT_START --><title>{esc(headline)} | {esc(wcfg['brand'])}</title><!-- AB_TITLE_SLOT_END -->
  <meta name="description" content="{esc(arm_a['slide_script_body'][:155])}">
  <link rel="canonical" href="{esc(canonical_url)}">
  <script type="application/ld+json">
{json_ld}
  </script>
  <style>
    body {{ margin: 0; background: {wcfg['bg']}; color: #1F2937; font-family: Georgia, 'Hiragino Sans', 'Malgun Gothic', serif; font-size: {wcfg['body_font_px']}px; line-height: 1.85; }}
    .wrap {{ max-width: 680px; margin: 0 auto; padding: 36px 22px 72px; }}
    .eyebrow {{ font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: {wcfg['accent']}; font-weight: 700; margin-bottom: 10px; }}
    h1 {{ font-size: {32 if div_u == 'HERO' else 30}px; line-height: 1.32; color: #111827; margin: 0 0 18px; }}
    h2 {{ font-size: {24 if div_u == 'HERO' else 22}px; color: {wcfg['accent']}; margin: 34px 0 12px; }}
    h3 {{ font-size: {20 if div_u == 'HERO' else 18}px; color: #111827; margin: 18px 0 6px; }}
    p {{ margin: 0 0 16px; }}
    .hook-lead {{ font-size: {wcfg['body_font_px'] + 2}px; font-weight: 600; color: #111827; }}
    .data-card {{ margin: 28px 0; padding: 18px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; }}
    .data-card figcaption {{ font-weight: 700; color: {wcfg['accent']}; margin-bottom: 12px; font-size: 15px; }}
    .tbl-wrap {{ overflow-x: auto; }}
    table {{ width: 100%; border-collapse: collapse; font-size: 15px; }}
    th, td {{ text-align: left; padding: 10px 12px; border-bottom: 1px solid #E5E7EB; }}
    th {{ background: #F3F4F6; color: #111827; }}
    .check-box, .contrast-box, .curation-card {{ margin: 28px 0; padding: 20px 22px; background: #FFFFFF; border-left: 4px solid {wcfg['accent']}; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }}
    .check-box ol {{ margin: 10px 0 0; padding-left: 22px; }}
    .check-box li {{ margin-bottom: 10px; }}
    .inline-cta {{ margin: 30px 0; padding: 22px; background: #F3F7F5; border: 1px solid #D1E3DA; border-radius: 12px; }}
    .cta-kicker {{ font-size: 14px; font-weight: 700; color: {wcfg['accent']}; margin: 0 0 12px; }}
    .cta-row {{ display: flex; flex-wrap: wrap; gap: 12px; }}
    .btn-primary {{ display: inline-block; padding: 13px 20px; min-height: 48px; box-sizing: border-box; background: {wcfg['accent']}; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: 700; }}
    .btn-secondary {{ display: inline-block; padding: 13px 20px; min-height: 48px; box-sizing: border-box; background: #FFFFFF; color: {wcfg['accent']}; border: 1.5px solid {wcfg['accent']}; text-decoration: none; border-radius: 8px; font-weight: 700; }}
    .nl-box {{ margin: 34px 0 20px; padding: 18px 20px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 10px; }}
    .nl-form {{ display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }}
    .nl-form input {{ flex: 1 1 220px; padding: 12px 14px; font-size: 16px; border: 1px solid #D1D5DB; border-radius: 8px; }}
    .nl-form button {{ padding: 12px 20px; background: {wcfg['accent']}; color: #FFF; border: none; border-radius: 8px; font-weight: 700; font-size: 16px; cursor: pointer; }}
    .ftc-note, footer {{ font-size: 13px; color: #6B7280; margin-top: 24px; }}
  </style>
</head>
<body data-division="{div_u}" data-matrix-id="{esc(matrix_id)}" data-utm-content="{esc(utm_a)}" data-article-slug="{esc(slug)}">
  <article class="wrap">
    <div class="eyebrow">{esc(eyebrow_text)}</div>
    <!-- AB_H1_SLOT_START --><h1>{esc(headline)}</h1><!-- AB_H1_SLOT_END -->
    {empathy_html}
    <h2>{esc(h2_why)}</h2>
    {_p_blocks(deep['why_old_fails'])}
    {table_html}
    {mid_cta_html}
    <h2>{esc(h2_how)}</h2>
    {_p_blocks(deep['mechanism_deep'])}
    {checklist_html}
    {contrast_html}
    <section class="faq-box"><h2>{esc(h2_faq)}</h2>{faq_items_html}</section>
    {bottom_cta_html}
    <section class="nl-box">
      <p style="margin:0;font-weight:700;">{esc(nl_prompt)}</p>
      <form class="nl-form" onsubmit="event.preventDefault();var em=this.querySelector('input').value.trim();if(!em)return;fetch('https://api.truthofmarket.com/api/crm/register',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:JSON.stringify({{div_code:'{div_u}',email:em,segment:'seo_article',metadata:{{utm_content:'{esc(utm_a)}',article:'{esc(slug)}'}}}})}}).then(function(){{alert('OK');}});this.reset();">
        <input type="email" required placeholder="you@example.com" aria-label="Email address">
        <button type="submit">{esc(nl_btn)}</button>
      </form>
    </section>
    <footer>{esc(wcfg['disclaimer'])} &middot; <a href="{esc(wcfg['base_url'])}">{esc(wcfg['brand'])}</a></footer>
  </article>
  <script>
    (function(){{
      try{{
        var _sp0=new URLSearchParams(location.search||'');var _ic=_sp0.get('internal_check'),_od=_sp0.get('owner_device'),_hs=(location.protocol==='https:'?'; Secure':'');if(_ic==='0'||_od==='0'){{try{{localStorage.removeItem('dc_internal_exclude');}}catch(_r){{}}try{{document.cookie='dc_internal_exclude=; Max-Age=0; Path=/; SameSite=Lax'+_hs;}}catch(_r){{}}}}else if(_ic==='1'||_od==='1'){{try{{localStorage.setItem('dc_internal_exclude','1');}}catch(_w){{}}try{{document.cookie='dc_internal_exclude=1; Max-Age=31536000; Path=/; SameSite=Lax'+_hs;}}catch(_w){{}}return;}}try{{if(localStorage.getItem('dc_internal_exclude')==='1')return;}}catch(_l){{}}try{{if(/(?:^|;\s*)dc_internal_exclude=1(?:;|$)/.test(document.cookie||''))return;}}catch(_c){{}}if(_sp0.get('internal_test')==='1'||_sp0.get('smoke_test')==='1'){{try{{sessionStorage.setItem('dc_internal_test','1');}}catch(_s){{}}return;}}try{{if(sessionStorage.getItem('dc_internal_test')==='1')return;}}catch(_s){{}}if(navigator.webdriver===true||/HeadlessChrome|Playwright|Puppeteer|Selenium|LiveAudit|Watchdog|GitHub-Actions/i.test(navigator.userAgent||''))return;
        var sp=new URLSearchParams(location.search);
        var uc=sp.get('utm_content')||'{esc(utm_a)}';
        fetch('https://api.truthofmarket.com/api/analytics/event',{{
          method:'POST',headers:{{'Content-Type':'application/json'}},
          body:JSON.stringify({{div_code:'{div_u}',event_name:'landing_view',utm_source:sp.get('utm_source')||'seo',utm_medium:sp.get('utm_medium')||'seo_article',utm_campaign:'{esc(slug)}',utm_content:uc,page_path:location.pathname}})
        }}).catch(function(){{}});
      }}catch(_){{}}
    }})();
  </script>
</body>
</html>
"""

    # Pass 3: Dedicated AI Slop wash + Fail-Closed Hard Gate verification
    washed_html, plain_text, ok, errs, scrub_report = _pass3_wash_and_verify_seo(
        div_u, headline, html_doc, lang=wcfg["lang"], canonical_url=canonical_url
    )
    return {
        "ok": ok,
        "errors": errs,
        "division": div_u,
        "slug": slug,
        "canonical_url": canonical_url,
        "matrix_id_a": arm_a["id"],
        "matrix_id_b": arm_b["id"],
        "hook_type_a": arm_a["hook_type"],
        "hook_type_b": arm_b["hook_type"],
        "headline_a": headline,
        "headline_b": challenger_headline,
        "utm_content_a": utm_a,
        "utm_content_b": utm_b,
        "visible_chars": len(plain_text),
        "html": washed_html,
        "date_str": date_str,
        "pipeline_3pass": {
            "pass1_locked_evidence_rows": outline["locked_evidence_rows"],
            "pass2_draft_composed": True,
            "pass3_scrub": scrub_report,
        },
    }


def _append_to_sitemap_and_rss(web_root: Path, base_url: str, brand: str, url: str, title: str, desc: str, date_str: str) -> None:
    # Normalize to Cloudflare Pages HTTP 200 Clean URL (zero 308 .html redirects in sitemap/RSS!)
    url = to_clean_url(url)
    # 1. Sitemap update (idempotent; also upgrades legacy .html loc if present)
    sm_path = web_root / "sitemap.xml"
    url_block = f"  <url>\n    <loc>{url}</loc>\n    <lastmod>{date_str}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n"
    if sm_path.exists():
        raw = sm_path.read_text(encoding="utf-8", errors="ignore")
        legacy_loc = f"<loc>{url}.html</loc>"
        clean_loc = f"<loc>{url}</loc>"
        if legacy_loc in raw:
            raw = raw.replace(legacy_loc, clean_loc)
            sm_path.write_text(raw, encoding="utf-8")
        elif clean_loc not in raw and "</urlset>" in raw:
            sm_path.write_text(raw.replace("</urlset>", url_block + "</urlset>"), encoding="utf-8")
    else:
        sm_path.write_text(
            f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{url_block}</urlset>\n',
            encoding="utf-8",
        )

    # 2. RSS 2.0 update (idempotent)
    rss_path = web_root / "rss.xml"
    item_block = (
        f"    <item>\n"
        f"      <title>{_html.escape(title)}</title>\n"
        f"      <link>{_html.escape(url)}</link>\n"
        f"      <guid>{_html.escape(url)}</guid>\n"
        f"      <pubDate>{date_str}</pubDate>\n"
        f"      <description>{_html.escape(desc[:220])}</description>\n"
        f"    </item>\n"
    )
    if rss_path.exists():
        raw_r = rss_path.read_text(encoding="utf-8", errors="ignore")
        if url not in raw_r and "</channel>" in raw_r:
            rss_path.write_text(raw_r.replace("</channel>", item_block + "  </channel>"), encoding="utf-8")
    else:
        rss_path.write_text(
            f'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n'
            f'    <title>{_html.escape(brand)}</title>\n    <link>{_html.escape(base_url)}</link>\n'
            f'    <description>{_html.escape(brand)} Official Insights</description>\n{item_block}  </channel>\n</rss>\n',
            encoding="utf-8",
        )


def ping_indexnow(host: str, urls: List[str], key: str, dry_run: bool = False) -> Dict[str, Any]:
    """Official IndexNow ping shared by Bing & Naver Search Advisor (zero scraping!)."""
    payload = {
        "host": host,
        "key": key,
        "keyLocation": f"https://{host}/{key}.txt",
        "urlList": urls,
    }
    if dry_run:
        return {"ok": True, "dry_run": True, "host": host, "urls": urls, "keyLocation": payload["keyLocation"]}
    results = {}
    for ep in ("https://api.indexnow.org/indexnow", "https://searchadvisor.naver.com/indexnow"):
        req = urllib.request.Request(
            ep,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": "DreamCompany-IndexNow/1.0"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as r:
                results[ep] = r.status
        except urllib.error.HTTPError as e:
            results[ep] = e.code
        except Exception as e:
            results[ep] = str(e)[:120]
    ok = any(isinstance(v, int) and v in (200, 202) for v in results.values())
    return {"ok": ok, "host": host, "results": results, "keyLocation": payload["keyLocation"]}


def publish_seo_batch(divs: List[str], date_str: str, week_seed: int = 0, write_files: bool = True, send_ping: bool = False) -> Dict[str, Any]:
    matrix_db = json.loads(MATRIX_PATH.read_text(encoding="utf-8"))
    key = ensure_indexnow_key()
    ledger = json.loads(LEDGER_PATH.read_text(encoding="utf-8")) if LEDGER_PATH.exists() else {"articles": [], "updated_at_kst": ""}
    published = []

    for div in divs:
        art = build_seo_article_html(div, matrix_db, date_str=date_str, week_seed=week_seed)
        if not art["ok"]:
            raise RuntimeError(f"Auto-Gate blocked {div} SEO article: {art['errors']}")
        wcfg = DIV_WEB_CONFIG[div]
        written_paths = []
        if write_files:
            for wroot in wcfg["local_roots"]:
                if not wroot.exists():
                    continue
                # Place IndexNow key file at web root (`/{KEY}.txt`)
                (wroot / f"{key}.txt").write_text(key, encoding="utf-8")
                art_dir = wroot / wcfg["article_rel_dir"]
                art_dir.mkdir(parents=True, exist_ok=True)
                fpath = art_dir / art["slug"]
                fpath.write_text(art["html"], encoding="utf-8")
                written_paths.append(str(fpath))
                _append_to_sitemap_and_rss(
                    wroot, wcfg["base_url"], wcfg["brand"],
                    art["canonical_url"], art["headline_a"],
                    art["headline_b"], date_str,
                )
        ping_res = ping_indexnow(wcfg["host"], [art["canonical_url"]], key, dry_run=(not send_ping))
        rec = {
            "division": div,
            "slug": art["slug"],
            "canonical_url": art["canonical_url"],
            "date_str": date_str,
            "matrix_id_a": art["matrix_id_a"],
            "matrix_id_b": art["matrix_id_b"],
            "hook_type_a": art["hook_type_a"],
            "hook_type_b": art["hook_type_b"],
            "headline_a": art["headline_a"],
            "headline_b": art["headline_b"],
            "utm_content_a": art["utm_content_a"],
            "utm_content_b": art["utm_content_b"],
            "visible_chars": art["visible_chars"],
            "written_paths": written_paths,
            "indexnow": ping_res,
            "winner_swapped": False,
        }
        published.append(rec)
        # Upsert ledger
        ledger["articles"] = [a for a in ledger.get("articles", []) if a.get("canonical_url") != rec["canonical_url"]]
        ledger["articles"].append(rec)

    if write_files:
        ledger["updated_at_kst"] = dt.datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST")
        LEDGER_PATH.parent.mkdir(parents=True, exist_ok=True)
        LEDGER_PATH.write_text(json.dumps(ledger, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    return {"ok": True, "indexnow_key": key, "published_count": len(published), "articles": published}


# ==============================================================================
# 4. Weekly Written-Promo Single-Variable Headline A/B Evolver (Swap <title>/<h1>!)
# ==============================================================================
def swap_article_headline_on_disk(div: str, slug: str, new_headline: str) -> List[str]:
    """Replaces `<title>` & `<h1>` inside AB_TITLE_SLOT/AB_H1_SLOT markers on winning headline."""
    wcfg = DIV_WEB_CONFIG[div.upper()]
    esc_h = _html.escape(new_headline.strip())
    esc_b = _html.escape(wcfg["brand"])
    swapped: List[str] = []
    for wroot in wcfg["local_roots"]:
        fpath = wroot / wcfg["article_rel_dir"] / slug
        if not fpath.exists():
            continue
        raw = fpath.read_text(encoding="utf-8")
        raw2 = re.sub(
            r"<!-- AB_TITLE_SLOT_START -->.*?<!-- AB_TITLE_SLOT_END -->",
            f"<!-- AB_TITLE_SLOT_START --><title>{esc_h} | {esc_b}</title><!-- AB_TITLE_SLOT_END -->",
            raw,
            flags=re.S,
        )
        raw2 = re.sub(
            r"<!-- AB_H1_SLOT_START -->.*?<!-- AB_H1_SLOT_END -->",
            f"<!-- AB_H1_SLOT_START --><h1>{esc_h}</h1><!-- AB_H1_SLOT_END -->",
            raw2,
            flags=re.S,
        )
        if raw2 != raw:
            fpath.write_text(raw2, encoding="utf-8")
            swapped.append(str(fpath))
    return swapped


def run_written_ab_evolution(
    metrics_by_utm: Optional[Dict[str, Dict[str, int]]] = None,
    save: bool = True,
    ping_on_swap: bool = False,
) -> Dict[str, Any]:
    """
    Written-Promo Weekly Single-Variable Headline A/B Evaluator:
      - Gate 1 (Sample Sufficiency): `clicks >= 30` OR `emails_sent >= 100`
      - Gate 2 (Relative Lift): `(winner_cvr - loser_cvr) / loser_cvr >= 20%`
      - Action on Win:
        1. Swaps `<title>` & `<h1>` of corresponding SEO article HTML to winning headline
        2. Sends IndexNow re-index ping
        3. Doubles matrix weight (`2x`) in `data/message_matrix_5div.json`
        4. Writes `[이번 주 최고 클릭 글 제목 1위]` summary line for Monday 09:00 KST Chairman report
    """
    ledger = json.loads(LEDGER_PATH.read_text(encoding="utf-8")) if LEDGER_PATH.exists() else {"articles": []}
    matrix_db = json.loads(MATRIX_PATH.read_text(encoding="utf-8")) if MATRIX_PATH.exists() else {}
    key = ensure_indexnow_key()

    if metrics_by_utm is None:
        acct = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
        tok = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
        metrics_by_utm = _fetch_d1_written_metrics(acct, tok)

    winners = []
    for art in ledger.get("articles", []):
        div = art["division"]
        ua, ub = art.get("utm_content_a", ""), art.get("utm_content_b", "")
        ma = metrics_by_utm.get(ua) or {}
        mb = metrics_by_utm.get(ub) or {}
        clk_a, clk_b = int(ma.get("clicks", 0)), int(mb.get("clicks", 0))
        em_a, em_b = int(ma.get("emails_sent", 0)), int(mb.get("emails_sent", 0))
        conv_a, conv_b = int(ma.get("conversions", 0)), int(mb.get("conversions", 0))

        # Gate 1: sufficient sample on BOTH arms (`clicks >= 30` OR `emails_sent >= 100`)
        ok_a = (clk_a >= 30 or em_a >= 100)
        ok_b = (clk_b >= 30 or em_b >= 100)
        if not (ok_a and ok_b):
            continue

        denom_a = clk_a if clk_a >= 30 else max(1, em_a)
        denom_b = clk_b if clk_b >= 30 else max(1, em_b)
        rate_a = (conv_a if clk_a >= 30 else clk_a) / float(denom_a)
        rate_b = (conv_b if clk_b >= 30 else clk_b) / float(denom_b)
        top_arm = "A" if rate_a >= rate_b else "B"
        top_r, low_r = (rate_a, rate_b) if top_arm == "A" else (rate_b, rate_a)
        rel_lift_pct = ((top_r - low_r) / low_r * 100.0) if low_r > 0 else (100.0 if top_r > 0 else 0.0)
        if rel_lift_pct < 20.0 or top_r <= 0:
            continue

        win_headline = art["headline_a"] if top_arm == "A" else art["headline_b"]
        win_mid = art["matrix_id_a"] if top_arm == "A" else art["matrix_id_b"]
        win_utm = ua if top_arm == "A" else ub
        win_clicks = clk_a if top_arm == "A" else clk_b

        swapped_paths = []
        ping_res = {"ok": False, "skipped": True}
        if save:
            if top_arm == "B":
                swapped_paths = swap_article_headline_on_disk(div, art["slug"], win_headline)
                art["headline_a"] = win_headline
                art["winner_swapped"] = True
                ping_res = ping_indexnow(DIV_WEB_CONFIG[div]["host"], [art["canonical_url"]], key, dry_run=(not ping_on_swap))
            # Double winning cell weight in message_matrix_5div.json
            for cell in (matrix_db.get("divisions", {}).get(div, {}).get("matrix") or []):
                if cell.get("id") == win_mid:
                    cell["weight"] = min(4.0, round(float(cell.get("weight", 1.0)) * 2.0, 2))

        winners.append({
            "division": div,
            "slug": art["slug"],
            "winner_arm": top_arm,
            "winner_matrix_id": win_mid,
            "winner_utm_content": win_utm,
            "winner_headline": win_headline,
            "winner_clicks": win_clicks,
            "relative_lift_pct": round(rel_lift_pct, 1),
            "swapped_paths": swapped_paths,
            "indexnow": ping_res,
        })

    if winners:
        top = sorted(winners, key=lambda w: (w["winner_clicks"], w["relative_lift_pct"]), reverse=True)[0]
        monday_line = f"[이번 주 최고 클릭 글 제목 1위] [{top['division']}] \"{top['winner_headline'][:52]}\" ({top['winner_clicks']}클릭 · +{top['relative_lift_pct']}% 우위, 가중치 2배)"
        status = "WRITTEN_WINNERS_EVOLVED"
    else:
        monday_line = "[이번 주 최고 클릭 글 제목 1위] 표본 수집 중 (링크 클릭 30회 또는 메일 발송 100통 + 격차 20% 이상 시 <title>/<h1> 자동 교체)"
        status = "COLLECTING_SAMPLE"

    summary = {
        "evaluated_at_kst": dt.datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST"),
        "status": status,
        "monday_report_line": monday_line,
        "winners": winners,
    }
    if save:
        ledger["last_written_ab_summary"] = summary
        LEDGER_PATH.write_text(json.dumps(ledger, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if winners and MATRIX_PATH.exists():
            MATRIX_PATH.write_text(json.dumps(matrix_db, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return summary


def _fetch_d1_written_metrics(acct: str, tok: str) -> Dict[str, Dict[str, int]]:
    if not (acct and tok):
        return {}
    url = f"https://api.cloudflare.com/client/v4/accounts/{acct}/d1/database/{D1_DB_ID}/query"

    def _q(sql: str) -> List[Dict[str, Any]]:
        req = urllib.request.Request(
            url,
            data=json.dumps({"sql": sql}).encode("utf-8"),
            headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return ((json.loads(r.read().decode("utf-8")).get("result") or [{}])[0]).get("results") or []
        except Exception:
            return []

    agg: Dict[str, Dict[str, int]] = {}
    for row in _q(
        "SELECT COALESCE(utm_content,'') AS uc, event_name, COUNT(*) AS c FROM funnel_events "
        "WHERE created_at >= datetime('now','-7 days') AND utm_medium IN ('seo_article','text','email') AND COALESCE(utm_content,'') != '' "
        "GROUP BY uc, event_name;"
    ):
        uc = str(row.get("uc") or "").strip()
        if not uc:
            continue
        b = agg.setdefault(uc, {"clicks": 0, "conversions": 0, "emails_sent": 0})
        if row.get("event_name") == "landing_view":
            b["clicks"] += int(row.get("c") or 0)
        elif row.get("event_name") in ("quiz_complete", "email_signup", "checkout_click", "paid_success", "audio_play", "gift_download"):
            b["conversions"] += int(row.get("c") or 0)

    for row in _q(
        "SELECT COALESCE(utm_content,'') AS uc, COUNT(*) AS c FROM email_ab_sends "
        "WHERE created_at >= datetime('now','-7 days') AND COALESCE(utm_content,'') != '' GROUP BY uc;"
    ):
        uc = str(row.get("uc") or "").strip()
        if uc:
            agg.setdefault(uc, {"clicks": 0, "conversions": 0, "emails_sent": 0})["emails_sent"] += int(row.get("c") or 0)
    return agg


def main() -> int:
    parser = argparse.ArgumentParser(description="Dream Company 365-Day Written Promotion Engine (SEO + IndexNow + A/B Headline Evolver)")
    parser.add_argument("--publish-seo", action="store_true", help="Generate & write 2,000+ char Slippery-Slide SEO articles for all 5 divisions")
    parser.add_argument("--ping-indexnow", action="store_true", help="Send live IndexNow ping to Bing & Naver Search Advisor")
    parser.add_argument("--evolve-ab", action="store_true", help="Run weekly single-variable written headline A/B evolution")
    parser.add_argument("--dry-run", action="store_true", help="Validate without modifying disk or pinging external endpoints")
    parser.add_argument("--date", type=str, default="", help="Override YYYY-MM-DD date")
    args = parser.parse_args()

    today = args.date or dt.datetime.now(KST).strftime("%Y-%m-%d")
    week_seed = dt.datetime.now(KST).isocalendar().week

    if args.publish_seo or (not args.evolve_ab):
        res = publish_seo_batch(
            ["TOM", "KFG", "GBA", "HERO", "KFK"],
            date_str=today,
            week_seed=week_seed,
            write_files=(not args.dry_run),
            send_ping=(args.ping_indexnow and not args.dry_run),
        )
        print(json.dumps({
            "ok": res["ok"],
            "indexnow_key": res["indexnow_key"],
            "published_count": res["published_count"],
            "articles": [{k: a[k] for k in ("division", "slug", "canonical_url", "visible_chars", "headline_a", "headline_b", "utm_content_a", "utm_content_b", "indexnow")} for a in res["articles"]],
        }, ensure_ascii=False, indent=2))

    if args.evolve_ab:
        ev = run_written_ab_evolution(save=(not args.dry_run), ping_on_swap=(args.ping_indexnow and not args.dry_run))
        print(json.dumps(ev, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
