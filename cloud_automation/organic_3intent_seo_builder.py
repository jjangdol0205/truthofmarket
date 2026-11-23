#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/organic_3intent_seo_builder.py
================================================================================
Generates & publishes 15 High-Intent 3-Intent Organic Search Ladder HTML Pages
(3 comparison `vs` & transactional guides per division x 5 divisions = 15 pages)
with:
- Book Ch.12 Slippery-Slide Prose (ZERO AI cliches, ZERO banned strings)
- Verified Comparison Tables + 3-Step Checklists + Article & FAQPage JSON-LD
- Active-Channel 1-Click Share Loops ONLY (Email for TOM/GBA, SMS/Email for KFG,
  WebShare/SMS/Copy for HERO/KFK — strictly ZERO LINE, ZERO Threads!)
- Automatic `/{INDEXNOW_KEY}.txt`, `sitemap.xml`, `rss.xml`, and live IndexNow ping!
"""

from __future__ import annotations

import argparse
import datetime as dt
import html as _html
import json
import sys
from pathlib import Path
from typing import Any, Dict, List

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

sys.path.insert(0, str(Path(__file__).resolve().parent))
from written_promo_engine import (  # noqa: E402
    DIV_WEB_CONFIG,
    KST,
    _append_to_sitemap_and_rss,
    check_written_auto_gate,
    ensure_indexnow_key,
    ping_indexnow,
)

PAGES_15: Dict[str, List[Dict[str, Any]]] = {
    "TOM": [
        {
            "slug": "smh-xlv-vs-60-40-retirement-2000-2025.html",
            "title": "Traditional 60/40 vs SMH x XLV + SGOV: 25 Years of Retirement Drawdown Recovery",
            "meta_desc": "Compare traditional 60/40 long-bond portfolios against a 2-pillar SMH x XLV + 24-month SGOV cash buffer across 2000, 2008, and 2022.",
            "lead": "Most retirees in their 60s were promised that a classic 60/40 stock-and-long-bond mix would cushion every storm. Then 2022 arrived and stocks and long-duration bonds fell together in the very same year.",
            "p2": "When you are still working at 42, a bad year is just a line on a screen. When you are drawing monthly living expenses at 64, selling depressed shares or fallen 20-year bonds locks in permanent retirement loss—often quietly trimming years off a nest egg you spent three decades building.",
            "p3": "Looking calmly at 2000–2025 historical data, separating 24 months of near-zero-duration Treasury bills (SGOV) from a balanced growth-plus-defensive core (SMH semiconductor secular growth paired with XLV healthcare stability) changed the retirement experience. Instead of praying interest rates drop, your short-term spending bucket stays steady while the growth pillar has years to recover.",
            "table_headers": ["Historical Stress Period", "Classic 60/40 Long Bonds", "SMH x XLV + 24-Mo SGOV Buffer"],
            "rows": [
                ["2000–2002 Dot-Com Reset", "Severe equity drag; long recovery", "Healthcare & cash buffer softened living withdrawals"],
                ["2008 Global Financial Crisis", "Deep equity drawdown; panic selling risk", "24-month Treasury runway avoided forced low sales"],
                ["2022 Inflation & Rate Shock", "Both stocks AND long bonds dropped sharply", "SGOV short T-bills preserved principal & yield"],
                ["2023–2025 AI Capex Cycle", "Muted upside weighted down by slow bonds", "Balanced semiconductor participation with calm guardrails"],
            ],
            "steps": [
                "Separate 24 months of essential living expenses into ultra-short Treasury cash (SGOV) before adjusting equities.",
                "Check today's free 7-factor SMH Fear & Greed Index to see public sentiment without guessing daily market timing.",
                "Review the free 2-page 2000–2025 Crash Study PDF at your kitchen table before deciding whether the $9 full 14-page workbook fits your plan.",
            ],
            "cta_url": "https://truthofmarket.com/smh-fear-greed?utm_source=seo&utm_medium=seo_article&utm_campaign=tom_vs_6040",
            "cta_label": "Check Today's Free SMH Fear & Greed Gauge →",
            "faq": [
                ("Does Truth of Market tell me when to buy or sell?", "No. Truth of Market publishes independent historical education and public regime statistics only—zero buy/sell advice."),
                ("Can I inspect the workbook before paying $9?", "Yes. Open the free 2-page 2000–2025 sample PDF with zero email wall before choosing the one-time $9 14-page edition."),
            ],
        },
        {
            "slug": "sgov-vs-bank-sweep-001-ira-cash.html",
            "title": "Broker 0.01% Idle Cash Sweep vs SGOV Treasury Buffer for Age 55+ Retirees",
            "meta_desc": "Why leaving $100,000 in a default 0.01% brokerage sweep pays $10 a year—and how retirees structure a calm 24-month SGOV Treasury safety bucket.",
            "lead": "Open your IRA statement tonight and look at the tiny line labeled 'core cash sweep.' On many major brokerages, default uninvested cash still earns roughly 0.01%—just $10 a year on $100,000.",
            "p2": "Retirees hold cash for a noble reason: protecting sleep and avoiding forced stock sales during a downturn. Yet leaving two full years of retirement expenses sitting in a 0.01% bank sweep quietly bleeds purchasing power to groceries, property taxes, and Medicare premiums every single month.",
            "p3": "That is why our 2000–2025 Retirement Study models a dedicated 24-month ultra-short U.S. Treasury bill buffer (SGOV, 0–3 month T-bills) alongside the SMH x XLV core. Because short-term T-bills carry minimal duration risk compared to 20-year bond funds, retirees keep daily liquidity while letting their safety bucket actually pull its weight.",
            "table_headers": ["Comparison Criterion", "Default 0.01% Bank/Broker Sweep", "0–3 Month U.S. T-Bill ETF (SGOV)"],
            "rows": [
                ["Annual Interest on $100,000", "~$10 / year (effectively zero)", "Tracks short-term U.S. Treasury bill rates"],
                ["Interest-Rate Duration Risk", "None", "Minimal (0–3 month maturity profile)"],
                ["State Income Tax Treatment", "Generally fully taxable", "U.S. Treasury interest often exempt from state tax"],
                ["Role in 3-Bucket Retirement Plan", "Hidden inflation leak", "Calm 24-month withdrawal runway during market storms"],
            ],
            "steps": [
                "Calculate 24 months of your essential post-Social-Security retirement gap.",
                "Run the free 30-second Retirement Crash Stress-Test on truthofmarket.com to see how your safety runway holds up.",
                "Download the free 2-page sample PDF to view the exact IRA/401(k) tax-location worksheet included in the $9 complete workbook.",
            ],
            "cta_url": "https://truthofmarket.com/?utm_source=seo&utm_medium=seo_article&utm_campaign=tom_sgov_vs_sweep",
            "cta_label": "Run Free 30-Second Retirement Stress-Test →",
            "faq": [
                ("Why keep 24 months of safe cash instead of 100% stocks?", "Historical downturns like 2000 and 2008 required multi-year patience; a 24-month cash runway helps avoid selling shares at the bottom."),
                ("Is there a recurring fee for the 14-page workbook?", "No. The 14-page Crisis & Retirement Workbook is a single one-time $9 study with a 7-day unopened refund guarantee."),
            ],
        },
        {
            "slug": "smh-fear-greed-index-guide-2026.html",
            "title": "How Retirees Use One Free SMH Fear & Greed Gauge Instead of Watching 40 Tickers",
            "meta_desc": "A calm 10-second guide to reading our 7-factor daily Semiconductor Fear & Greed Index for 50–70+ long-term ETF discipline.",
            "lead": "Checking forty flashing tickers before breakfast never made anyone wealthier—it only raises blood pressure and tempts emotional decisions at the worst possible hour.",
            "p2": "Most investors approaching retirement know they should ignore noisy financial television, yet when semiconductor headlines swing wildly, curiosity pulls them back to their phone ten times a day. The hidden cost isn't just time; it is decision fatigue.",
            "p3": "We built the free daily SMH Fear & Greed Index (0–100 across 7 transparent historical factors) so disciplined retirees can check the broader semiconductor temperature once in 10 seconds, put the phone away, and measure any emotion against 25 years of real SMH x XLV + SGOV context.",
            "table_headers": ["Morning Habit", "Watching 40 Tickers & News Alerts", "Checking 1 Free 7-Factor SMH Gauge"],
            "rows": [
                ["Daily Time Required", "45–90 minutes of headline anxiety", "10 seconds, zero login required"],
                ["Emotional Bias", "Amplifies fear at lows & greed at highs", "Anchors perspective in 0–100 historical percentile"],
                ["Alignment With Written Plan", "Triggers impulsive trades", "Reinforces calm twice-yearly rebalancing discipline"],
            ],
            "steps": [
                "Bookmark truthofmarket.com/smh-fear-greed for a quiet 10-second public sentiment glance.",
                "Compare today's 0–100 regime reading against 2008 and 2022 historical context—never react to a single headline.",
                "Pair the free daily gauge with our free 2-page PDF sample or optional daily pre-market research letter.",
            ],
            "cta_url": "https://truthofmarket.com/smh-fear-greed?utm_source=seo&utm_medium=seo_article&utm_campaign=tom_fg_guide",
            "cta_label": "Open Today's Free SMH Fear & Greed Index →",
            "faq": [
                ("Is the SMH Fear & Greed gauge completely free?", "Yes. It updates daily with zero email wall and zero account required."),
                ("What are the 7 factors inside the gauge?", "Price momentum, volatility regime, trend distance, breadth context, relative defensive ratio vs XLV, drawdown depth, and mean-reversion band."),
            ],
        },
    ],
    "KFG": [
        {
            "slug": "cdc-growth-velocity-vs-parent-height-average.html",
            "title": "US CDC Growth Velocity vs Mid-Parental Height Average: Why Siblings Differ by 3+ Inches",
            "meta_desc": "Why simply averaging Mom and Dad's height misleads parents—and how official US CDC 2000 percentile curves and annual growth velocity clarify the real trend.",
            "lead": "Every parent has typed Mom's height and Dad's height into a free web box, hit calculate, and stared at one stiff number wondering why their two children are already tracking inches apart.",
            "p2": "A mid-parental formula only estimates a broad genetic neighborhood—often spanning plus or minus 3 to 4 inches. It tells you nothing about whether your child is currently accelerating, holding steady on their US CDC percentile lane, or quietly drifting downward because of late nights or uneven evening nutrition.",
            "p3": "That is why KISFIT Studio pairs official US CDC 2000 age-in-days curves with annual growth velocity (inches per year) and everyday household sleep, posture, and protein benchmarks—with zero supplement ads and zero recurring fee required for your first calm check.",
            "table_headers": ["What Parents Compare", "Simple Mid-Parental Average", "KISFIT Studio US CDC Velocity Check"],
            "rows": [
                ["Age Precision", "Whole years only", "Exact birth-date interpolation against US CDC 2000"],
                ["Tracks Speed (in/yr)", "No—single static guess", "Yes—tracks monthly & 6-month velocity trajectory"],
                ["Bone-Age Time Shift", "Ignored completely", "Accounts for months elapsed since last wrist X-ray"],
                ["Supplement Ads", "Common in generic sites", "Zero supplement ads—100% independent educational tool"],
            ],
            "steps": [
                "Measure your child barefoot against a flat wall first thing in the morning.",
                "Run the free 60-second US CDC height percentile check on kisfitglobal.com with zero email wall.",
                "Preview the free 2-page printable sample PDF, or cover up to 4 siblings with the $19.99 6-month Velocity Pass.",
            ],
            "cta_url": "https://kisfitglobal.com/?utm_source=seo&utm_medium=seo_article&utm_campaign=kfg_vs_parent_avg",
            "cta_label": "Run Free 60-Second US CDC Height Check →",
            "faq": [
                ("Is KISFIT Studio a medical service?", "No. KISFIT Studio is a 100% automated self-serve educational reference built on public US CDC 2000 tables for parents."),
                ("Can one pass track multiple children?", "Yes. Both the $19.99 6-Month Velocity Pass and $49 12-Month Family Suite support up to 4 siblings in one family binder."),
            ],
        },
        {
            "slug": "wrist-bone-age-6-months-ago-time-shift-guide.html",
            "title": "Got a Wrist Bone-Age X-Ray 6 Months Ago? Why That Number Has Already Shifted Today",
            "meta_desc": "Understand how elapsed months since a routine wrist bone-age reading affect height reference tracking—and how to organize notes calmly before your next checkup.",
            "lead": "Six months ago, a quick wrist X-ray gave you a bone-age number that you saved in a photo on your phone. Today, your child is half a year older—yet most parents still plug that old number unchanged into online tables.",
            "p2": "In childhood, six months is an entire season of growth. If your child grew briskly—or slowed down during a stressful school term with late bedtimes—relying on an outdated snapshot creates unnecessary confusion and anxiety before your next annual well-child visit.",
            "p3": "KISFIT Studio automatically adjusts for elapsed months since your recorded check and helps parents pair height-lane math with calm, verifiable daily routines: earlier lights-out, morning sunlight, protein-rich dinners, and upright desk posture.",
            "table_headers": ["Tracking Approach", "Static Old X-Ray Snapshot", "Time-Adjusted US CDC Reference Log"],
            "rows": [
                ["Elapsed Months Adjustment", "Frozen at test date", "Updated smoothly to today's exact child age"],
                ["Daily Actionability", "Numbers only, no evening routine", "Printable 30-day refrigerator habit checklist"],
                ["Checkup Preparation", "Scattered phone screenshots", "Clean 1-page timeline & 3 calm parent questions"],
            ],
            "steps": [
                "Enter your child's birth date and today's barefoot height into the free 60-second US CDC check.",
                "Inspect the free 2-page printable US CDC Sample PDF to see the refrigerator habit checklist layout.",
                "Log barefoot height once every 30 days so you arrive at your next routine pediatric checkup calm and prepared.",
            ],
            "cta_url": "https://kisfitglobal.com/assets/downloads/kfg_sample_2p.pdf",
            "cta_label": "Preview Free 2-Page US CDC Sample PDF →",
            "faq": [
                ("What if we never took a wrist bone-age X-ray?", "No problem at all—our free US CDC height percentile and velocity tracker works seamlessly using birth date and barefoot height alone."),
                ("Do you sell height pills or supplements?", "Never. KISFIT Studio carries zero affiliate links and zero supplement promotions."),
            ],
        },
        {
            "slug": "pediatric-checkup-height-questions-for-parents.html",
            "title": "3 Calm Questions Parents Bring to Routine Child Height Checkups (Before Leaving the Room)",
            "meta_desc": "Pediatricians often spend just 90 seconds on the height chart. Bring these 3 simple questions and a clean barefoot growth log to your next routine checkup.",
            "lead": "Routine well-child appointments move fast. The nurse measures your child with shoes half-untying, the chart flashes on a screen for ninety seconds, and you only remember your real question in the parking lot.",
            "p2": "Parents do not need complicated medical jargon to be great advocates for their kids. What helps most is walking in with three steady numbers: barefoot height taken at home on the same wall, six-month annual pace in inches per year, and honest bedtime/sleep-breathing notes.",
            "p3": "Our printable 2-page sample PDF and $8.99 single reference report organize those exact points onto a clean kitchen-ready sheet—so checkups feel collaborative, calm, and completely free of guesswork.",
            "table_headers": ["Checkup Topic", "What Parents Usually Forget to Ask", "What to Bring on 1 Clean Sheet"],
            "rows": [
                ["Percentile Lane", "Did our child cross a major US CDC line?", "Last 3 barefoot morning heights with dates"],
                ["Annual Pace", "Is our current inches/year pace steady for age?", "Calculated 6-month annualized growth velocity"],
                ["Evening Rhythm", "Could mouth-breathing or 10 PM sleep affect rest?", "30-day bedtime & morning energy summary"],
            ],
            "steps": [
                "Run the free 60-second US CDC percentile check on kisfitglobal.com today.",
                "Download the free 2-page printable sample PDF before deciding on the $8.99 single report or $19.99 6-month multi-sibling pass.",
                "Tape the 30-day evening routine checklist to your fridge so bedtime becomes calm instead of a nightly negotiation.",
            ],
            "cta_url": "https://kisfitglobal.com/?utm_source=seo&utm_medium=seo_article&utm_campaign=kfg_checkup_3qs",
            "cta_label": "Start Free 60-Second US CDC Check (No Email Wall) →",
            "faq": [
                ("How long does the free height check take?", "Under 60 seconds with zero email required to view your child's immediate US CDC percentile summary."),
                ("What is the refund policy on paid PDF passes?", "Full 7-day refund if unopened/undownloaded, plus 100% refund for any file or billing issue."),
            ],
        },
    ],
    "GBA": [
        {
            "slug": "shin-nisa-1200man-us-etf-vs-tsumitate-guide.html",
            "title": "新NISA 1,800万円の壁：成長投資枠1,200万円上限と米国ETF配分の実務整理",
            "meta_desc": "新NISA生涯非課税枠1,800万円のうち米国ETFが入るのは法律上1,200万円まで。50〜70代が暴落の夜も眠れるSMH×XLV＋個人向け国債の統計整理。",
            "lead": "新NISAの生涯非課税枠は1,800万円ですが、米国ETFをそのまま1,800万円分買おうとしても、法律上「成長投資枠の上限1,200万円」までしか入りません。",
            "p2": "さらに見落とされやすいのが、新NISA口座であっても米国ETFの分配金には米国側で10%の現地源泉税がかかる点です。50代・60代が退職金や老後資金を振り分ける際、この制度上の境界線を知らずに一括購入してしまうと、後から取り返せない枠のロスや暴落時の強い不安につながります。",
            "p3": "GetBreakAI 日本では日々の短期的な相場予想を行わず、2000〜2025年の客観的な過去統計をもとに「成長投資枠1,200万円（SMH半導体×XLVヘルスケアの均衡）＋つみたて枠600万円＋個人向け国債（変動10年）の安全クッション」という穏やかな設計図を整理しています。",
            "table_headers": ["比較項目", "人気米国株1本への集中", "SMH×XLV＋個人向け国債の均衡設計"],
            "rows": [
                ["新NISA成長投資枠1,200万円上限", "枠の配分設計なく一括偏重しがち", "成長枠1,200万円と安全資金を明確に分離"],
                ["米国配当10%現地源泉税の意識", "高配当ランキング優先で手取り目減り", "税引き後トータルと暴落耐性を重視"],
                ["暴落時の心理負担（ITバブル・2008年）", "連日スマホを見て眠れない", "国債クッションにより慌てて売らずに静観"],
            ],
            "steps": [
                "毎日無料で公開中の「米国半導体・恐怖と強欲指数（7指標）」で市場温度を10秒だけ確認する。",
                "メール不要の無料4ステップ過去統計チェックで、ご自身の年齢に合う安全資金比率を把握する。",
                "無料2ページ・サンプルPDFを先に閲覧し、手元に残したい方だけ¥1,480買い切り完全版ワークブックを確認する。",
            ],
            "cta_url": "https://getbreakai.com/jp/smh-fear-greed?utm_source=seo&utm_medium=seo_article&utm_campaign=gba_nisa_1200",
            "cta_label": "本日の無料「米国半導体・恐怖と強欲指数」を見る →",
            "faq": [
                ("投資助言や銘柄推奨は含まれますか？", "いいえ。GetBreakAI 日本は2000〜2025年の過去統計と制度整理の教育出版のみを行っており、個別銘柄の売買推奨は一切行いません。"),
                ("買い切りワークブックに定期課金はありますか？", "いいえ。¥1,480の12p完全版ワークブックは1回買い切りで自動更新はありません。"),
            ],
        },
        {
            "slug": "teiki-yokin-vs-kojinmuke-kokusai-1000man.html",
            "title": "1,000万円を定期預金に置く前に：個人向け国債（変動10年）との手取り・安心感比較",
            "meta_desc": "50〜70代の安全資金1,000万円を銀行の定期預金と個人向け国債（変動10年）で置いた場合の違いを30秒で客観整理。",
            "lead": "退職金や大切な老後資金1,000万円を前にしたとき、「減らしたくないから銀行の定期預金にそのまま置いておこう」と考えるのはとても自然な感覚です。",
            "p2": "ただ、金利環境や物価が緩やかに動く局面では、固定金利の定期預金に長期間預けっぱなしにすることで、安全を守りながら受け取れるはずの利息差やインフレ耐性を静かに逃してしまうケースが少なくありません。",
            "p3": "私たちが50〜70代の安全クッションとして個人向け国債（変動10年）に注目するのは、元本保証の安心感を保ちつつ半年ごとに適用利率が見直され、発行から1年経てば中途換金も可能な仕組みだからです。攻めの枠（SMH×XLV）と完全に分けておくことで、相場が荒れた夜も穏やかに眠れます。",
            "table_headers": ["比較の視点", "一般的な銀行定期預金", "個人向け国債（変動10年）"],
            "rows": [
                ["金利上昇への追随性", "満期まで固定されやすい", "半年ごとに実勢金利に応じて見直し"],
                ["元本の安全性", "ペイオフ上限（1,000万円＋利息）あり", "日本国が元本と利子を保証"],
                ["老後設計での役割", "生活費の即時決済口座", "暴落時に取り崩さない2〜3年分の防衛資金"],
            ],
            "steps": [
                "まず今後2〜3年間に必ず使う生活費・医療予備費を安全資金として別枠に切り分ける。",
                "getbreakai.com/jp/ の無料4ステップ統計診断で、安全資金と新NISA枠の全体バランスを確認する。",
                "メール不要の無料2pサンプルPDFで、過去25年の暴落回復月数と楽天・SBI証券の実務手順を見比べる。",
            ],
            "cta_url": "https://getbreakai.com/jp/?utm_source=seo&utm_medium=seo_article&utm_campaign=gba_kokusai_vs_teiki",
            "cta_label": "メール不要・無料30秒で新NISA統計バランスを確認 →",
            "faq": [
                ("無料チェックにメールアドレスは必須ですか？", "いいえ。最初の4ステップ統計診断と2pサンプルPDFはメールアドレス不要ですぐご確認いただけます。"),
                ("60代から新NISAを考えても遅くありませんか？", "人生100年時代では60歳からでも20〜30年の運用期間があるため、安全資金を厚く確保した穏やかな配分設計が有効です。"),
            ],
        },
        {
            "slug": "smh-fear-greed-jp-25yr-statistics-guide.html",
            "title": "米国半導体・恐怖と強欲指数（7指標）の見方と過去25年統計の穏やかな活用法",
            "meta_desc": "毎朝ニュースに振り回されないための無料日本語ツール「米国半導体・恐怖と強欲指数」の7指標と、50〜70代の落ち着いた見方を解説。",
            "lead": "朝起きてスマートフォンを開いた瞬間、米国株急落の見出しが飛び込んでくると、それだけで一日じゅう落ち着かなくなってしまう方は多いものです。",
            "p2": "ニュースの見出しは人間の不安を刺激するように書かれています。感情のままに売ってしまえば、非課税枠360万円の年間枠も一度失われ、長期の複利が途中で途切れてしまいます。",
            "p3": "GetBreakAI 日本が毎日無料で更新している「米国半導体・恐怖と強欲指数（0〜100点・7指標）」は、相場の過熱感や極度の恐怖をひと目で客観視し、2000〜2025年の過去25年データに照らして静かに心を整えるための温度計です。",
            "table_headers": ["相場の確認スタイル", "SNS・ニュース速報を毎日追う", "無料・恐怖と強欲指数を10秒確認"],
            "rows": [
                ["1日に奪われる時間", "30〜60分の不安スクロール", "10秒で客観スコア（0〜100）を確認"],
                ["心理的な影響", "底値で怖くなり高値で焦る", "過去25年の統計帯と照らして冷静さを維持"],
                ["利用料金・登録", "情報過多で有料商材に迷いやすい", "毎日無料・登録不要ですぐ閲覧可能"],
            ],
            "steps": [
                "getbreakai.com/jp/smh-fear-greed をブックマークし、相場の温度を客観的な数値だけで確認する。",
                "スコアが極端に低い夜ほど「自分の安全資金（国債・現金）は何年分あるか」を静かに確認する。",
                "無料2pサンプルPDFで、ITバブル・リーマン・2022年の回復月数表を手元に置いておく。",
            ],
            "cta_url": "https://getbreakai.com/jp/smh-fear-greed?utm_source=seo&utm_medium=seo_article&utm_campaign=gba_fg_guide",
            "cta_label": "本日の無料・恐怖と強欲指数（7指標）を開く →",
            "faq": [
                ("恐怖と強欲指数が低い日は必ず購入すべきですか？", "いいえ。本指数は市場心理を客観視するための教育統計データであり、投資判断の指示ではありません。"),
                ("未閲覧時の返金保証はありますか？", "はい。買い切りワークブックは未閲覧・未ダウンロードの場合、決済後7日以内は全額返金に対応しています。"),
            ],
        },
    ],
    "HERO": [
        {
            "slug": "baek-woonho-free-radio-guide-2026.html",
            "title": "회원가입 없이 큰글씨로 매일 듣는 백운호 6곡 완곡 무료 라디오 이용 안내",
            "meta_desc": "마음을 노래하는 AI 가상 트로트 가수 백운호의 6곡 완곡과 화·금 저녁 6시 연속 인생 사연 라디오를 회원가입 없이 26px 큰글씨로 무료 청취하는 방법.",
            "lead": "스마트폰 앱을 새로 깔고 비밀번호를 외우는 일이 번거로워 좋아하는 노래 한 곡 듣기도 망설이셨나요? 김쌤의 영웅라디오 사랑방은 회원가입도, 돈 내는 절차도 일절 없는 평생 무료 공간입니다.",
            "p2": "밤 10시 텅 빈 거실에서 마음이 헛헛하실 때, 작은 글씨와 복잡한 광고 팝업에 지치신 어머님·아버님을 위해 돋보기 없이도 편안한 큰글씨 화면과 큼직한 버튼만으로 정성껏 만들었습니다.",
            "p3": "마음을 노래하는 AI 가상 트로트 가수 백운호의 대표곡 〈어머니의 봄날〉·〈백운호 연가〉·〈다시 피는 동백꽃〉 등 6곡 완곡과 매주 화·금 저녁 6시에 이어지는 2~3부작 연속 인생 사연 극장을 언제든 편안하게 들어 보세요.",
            "table_headers": ["일반 음악 앱과 다른 점", "일반 유료 음악 앱", "백운호 무료 라디오 사랑방"],
            "rows": [
                ["회원가입 · 비밀번호", "복잡한 가입과 결제 카드 등록 필요", "가입 없음 · 평생 100% 무료"],
                ["글씨 크기 · 버튼", "작은 글씨와 수많은 메뉴", "어머님 눈이 편안한 20~26px 큰글씨"],
                ["사연 · 소통", "노래만 재생", "화·금 14분 연속 사연 극장 & 무료 안부카드"],
            ],
            "steps": [
                "아래 파란 버튼을 눌러 백운호 6곡 완곡 무료 라디오 화면을 바로 열어 주세요.",
                "듣고 싶으신 노래 제목을 한 번만 톡 누르시면 105pt 왕글씨 가사와 함께 흘러나옵니다.",
                "마음에 드신다면 다음 화 연속 사연 예고도 보시고 친구분께 카톡으로 나눠 보세요.",
            ],
            "cta_url": "https://paradise-hero.com/radio.html?utm_source=seo&utm_medium=seo_article&utm_campaign=hero_radio_guide",
            "cta_label": "🎵 백운호 6곡 완곡 무료 라디오 바로 듣기 →",
            "faq": [
                ("정말 끝까지 무료로 들을 수 있나요?", "네, 백운호 라디오와 카톡 아침 안부카드는 평생 100% 무료이며 비용 부담 없이 마음 편히 들으실 수 있습니다."),
                ("가수 백운호는 어떤 가수인가요?", "어머님·아버님들의 마음을 위로하기 위해 탄생한 오리지널 AI 가상(버추얼) 트로트 가수입니다."),
            ],
        },
        {
            "slug": "baek-woonho-morning-greeting-card-guide.html",
            "title": "내일 아침 단톡방에 3초 만에 보내는 백운호 꽃그림 무료 카톡 안부카드 만들기",
            "meta_desc": "복잡한 앱 설치 없이 3초 만에 이름과 따뜻한 인사말을 넣어 카카오톡 단톡방에 보내는 백운호 꽃그림 아침 안부카드 무료 사용법.",
            "lead": "내일 아침 친구분들이나 가족 단톡방에 글자만 덩그러니 보내기 아쉬우셨나요? 백운호의 환한 미소와 봄꽃이 담긴 큰글씨 아침 안부카드를 3초 만에 무료로 만들어 보내실 수 있습니다.",
            "p2": "남이 보낸 오래된 그림을 돌려쓰다 보면 화질이 흐려지거나 날짜가 맞지 않아 민망할 때가 있지요. 여기서는 오늘 날짜와 어머님 성함이 또렷하게 들어간 새 그림 카드를 매일 무료로 저장하실 수 있습니다.",
            "p3": "카드 맨 아래에는 '무료 백운호 라디오 듣기: paradise-hero.com' 안내가 깔끔하게 담겨 있어, 카드를 받으신 친구분도 함께 따뜻한 백운호 노래를 들으실 수 있습니다.",
            "table_headers": ["만드는 순서", "어머님이 하실 일", "걸리는 시간"],
            "rows": [
                ["1단계 · 그림 고르기", "봄꽃·감사·건강 안부 배경 중 1가지 터치", "1초"],
                ["2단계 · 이름 적기", "보내는 분 성함 입력 (기본 문구 자동 완성)", "1초"],
                ["3단계 · 저장·공유", "큰 저장 버튼 눌러 카카오톡으로 바로 전송", "1초"],
            ],
            "steps": [
                "아래 버튼을 눌러 백운호 무료 아침 안부카드 제작 화면을 열어 주세요.",
                "마음에 드는 꽃그림 배경과 인사 문구를 고르고 보내는 분 성함을 적어 주세요.",
                "저장 버튼을 누르신 뒤 가족·친구 단톡방에 따뜻한 아침 인사를 전해 보세요.",
            ],
            "cta_url": "https://paradise-hero.com/vip.html?utm_source=seo&utm_medium=seo_article&utm_campaign=hero_card_guide",
            "cta_label": "💐 백운호 무료 카톡 아침 안부카드 만들기 →",
            "faq": [
                ("카드를 여러 장 만들어도 무료인가요?", "네, 매일 아침 몇 장을 만드시든 회원가입 없이 평생 무료입니다."),
                ("글씨가 작아서 잘 안 보이지는 않나요?", "시니어 어머님·아버님 눈높이에 맞춰 큰글씨와 고화질(1080×1350) 그림으로 자동 완성됩니다."),
            ],
        },
        {
            "slug": "senior-radio-listening-guide-kitchen-bedside-livingroom.html",
            "title": "주방 설거지·침대 머리맡·거실 청취용 — 어머님 일상 상황별 라디오 청취 준비물 가이드",
            "meta_desc": "백운호 14분 연속 사연 라디오를 주방·침실·거실에서 눈과 목이 편안하게 즐기실 수 있도록 정리한 어머님 일상 상황별 맞춤 안내.",
            "lead": "라디오 사연과 백운호 노래를 매일 들으시다 보면, 주방에서 설거지하실 때나 밤늦게 침대 머리맡에서 들으실 때 소리·눈 피로·목 건조함이 은근히 신경 쓰이시지요.",
            "p2": "인터넷에 너무 많은 물건이 쏟아져 무엇을 골라야 할지 헷갈려 하시는 어머님들을 위해, 김쌤의 영웅라디오 사랑방은 꼭 필요한 7가지 실속 준비물만 일상 상황 3가지로 나누어 차분하게 정리했습니다.",
            "p3": "사랑방의 모든 노래와 사연, 카톡 안부카드는 평생 100% 무료로 즐기시고, 일상에서 꼭 필요하신 물건이 있으실 때만 하단 공식 준비물관을 천천히 둘러보시면 됩니다.",
            "table_headers": ["어머님 일상 상황", "자주 겪으시는 불편", "맞춤 준비물 안내"],
            "rows": [
                ["주방 설거지·집안일 하실 때", "물소리 때문에 휴대폰 소리가 작고 잘 안 들림", "큰 버튼·풍성한 중저음 효도 블루투스 라디오 스피커"],
                ["침대 머리맡·취침 전 청취", "어두운 방 화면 눈 침침함 & 건조한 목 칼칼함", "황반 케어 루테인 지아잔틴 · 목 촉촉 도라지배즙 스틱"],
                ["거실 장시간 청취·나들이", "배터리 방전 걱정 & 오래 앉아 계실 때 허리 불편", "대용량 보조배터리 · 무하중 에어방석 · 보온 숄"],
            ],
            "steps": [
                "먼저 평생 무료인 백운호 6곡 완곡 라디오와 14분 연속 사연 극장을 편안하게 들어 보세요.",
                "주방·침실·거실 중 평소 가장 불편하셨던 순간에 맞는 준비물만 골라 확인해 보세요.",
                "평소 쓰시던 네이버페이 공식관 또는 쿠팡 공식관에서 안전하게 상세 정보를 확인하실 수 있습니다.",
            ],
            "cta_url": "https://paradise-hero.com/#senior-curation-market",
            "cta_label": "💚 어머님 일상 상황별 안심 준비물관 둘러보기 →",
            "faq": [
                ("사랑방 이용 시 물건을 꼭 사야 하나요?", "전혀 아닙니다. 노래 듣기, 연속 사연 라디오, 카톡 안부카드는 평생 100% 무료이며 필요하신 분만 천천히 둘러보시면 됩니다."),
                ("제휴 수수료 안내가 있나요?", "네, 투명하게 안내드리며 네이버 쇼핑커넥트 및 쿠팡 파트너스 활동의 일환으로 판매 발생 시 일정액의 수수료를 제공받습니다."),
            ],
        },
    ],
    "KFK": [
        {
            "slug": "bone-age-6months-time-delta-vs-naver-calculator.html",
            "title": "네이버 키 계산기 vs 뼈나이 시차(Δt) 보정: 6개월 전 검사 결과가 오늘 달라지는 이유",
            "meta_desc": "단순 부모 키 평균 계산기와 달리 태어난 일수 보간과 뼈나이 경과 시차(Δt)를 함께 반영해야 우리 아이 진짜 성장 흐름이 보입니다. 상업성 광고 0건.",
            "lead": "병원에서 손목 엑스레이로 뼈나이를 찍고 나왔는데, 벌써 6개월이 지났다면 오늘 우리 아이의 성장판은 그때와 같을까요? 반년 전 숫자를 그대로 믿고 계산하면 예상키가 3~4cm씩 어긋나기 쉬워요.",
            "p2": "포털 기본 키 계산기는 엄마·아빠 키를 더해 나누는 단순 공식만 보여주기 때문에, 아이의 정확한 태어난 일수 기준 질병관리청(KDCA 2017) 백분위도, 뼈나이 촬영 이후 흘러간 경과 시차(Δt)도 반영하지 못해요.",
            "p3": "키즈핏 소아성장 아틀리에는 영양제나 상업성 쇼핑 제휴 광고가 단 1건도 없어요. 오직 질병관리청 공식 성장도표와 뼈나이 경과 시차 보정을 바탕으로 1분 만에 차분하게 현재 위치를 확인하고, 필요하실 때만 2p 무료 샘플 PDF를 먼저 열어 보실 수 있게 준비했어요.",
            "table_headers": ["비교 기준", "단순 포털 부모 평균키 계산기", "키즈핏 질병관리청 + 뼈나이 시차(Δt) 진단"],
            "rows": [
                ["개월·일수 정밀도", "단순 만 나이 또는 부모 키 평균", "태어난 일수 보간 + 질병관리청(KDCA 2017) 공식 도표"],
                ["뼈나이 촬영 경과 반영", "반영 불가", "촬영 시점 경과 시차(Δt) 자동 보정"],
                ["연간 성장속도(cm/년)", "확인 불가", "30일 주기 맨발 기록으로 속도 변화 판독"],
                ["영양제·쇼핑 광고", "상업성 광고·제휴 링크 혼재", "상업성 상품 광고 0건 (순수 유료 9,900원/19,900원/39,000원)"],
            ],
            "steps": [
                "오늘 아침 기상 직후 맨발로 벽에 기대어 아이 키를 정확히 재어 보세요.",
                "이메일 입력 없이 kidsfit.co.kr에서 1분 무료 질병관리청 백분위 진단을 바로 확인해 보세요.",
                "결제 전 2페이지 무료 샘플 PDF로 소아과 질문지와 30일 냉장고 달력 구성을 먼저 눈으로 확인해 보세요.",
            ],
            "cta_url": "https://kidsfit.co.kr/?utm_source=seo&utm_medium=seo_article&utm_campaign=kfk_vs_naver_calc",
            "cta_label": "📏 이메일 없이 1분 무료 예상키·뼈나이 진단하기 →",
            "faq": [
                ("뼈나이 검사를 아직 안 받았는데도 무료 진단이 되나요?", "네, 뼈나이 기록이 없어도 아이 생년월일과 현재 키·몸무게만으로 질병관리청 기준 또래 백분위와 생활 병목을 바로 확인하실 수 있어요."),
                ("영양제 판매나 제휴 광고가 있나요?", "전혀 없어요. 키즈핏은 상업성 제휴 광고 0건 원칙을 지키는 순수 소아성장 분석 아틀리에예요."),
            ],
        },
        {
            "slug": "annual-height-velocity-8cm-early-plate-check.html",
            "title": "1년에 8cm 컸다고 안심하기 전에: 급성장기(PHV)와 성장판 속도 확인 기준 3가지",
            "meta_desc": "사춘기 전 정상 연간 성장속도는 5.0~6.5cm. 갑자기 1년에 8cm 이상 크거나 4cm 미만으로 주춤할 때 부모님이 꼭 확인해야 할 3가지 기준.",
            "lead": "우리 아이가 최근 1년 사이 갑자기 8cm나 훌쩍 자라서 주변에서 다들 부러워하셨나요? 반가운 소식일 수도 있지만, 초등 저·중학년에서 갑자기 속도가 튀어 올랐다면 한 번쯤 차분히 살펴보셔야 해요.",
            "p2": "질병관리청 성장 기준상 사춘기 전 아이들의 안정적인 연간 성장속도는 연 5.0~6.5cm 안팎이에요. 반대로 연 4.0cm 미만으로 주춤하거나, 이른 나이에 연 8cm 이상 급가속이 붙으면 성장판이 예정보다 일찍 닫히는 신호일 수 있어 기록을 남겨두는 것이 중요해요.",
            "p3": "매일 키를 재며 조바심을 내실 필요는 없어요. 딱 한 달에 한 번, 아침 맨발 키를 30초만 기록해 연간 성장속도(cm/년) 추세를 보면 소아과에 갈 시기와 집에서 챙길 밤 10시 통잠 루틴이 한눈에 정리돼요.",
            "table_headers": ["연간 성장속도 구간", "의미와 해석 포인트", "부모님 권장 행동"],
            "rows": [
                ["연 5.0 ~ 6.5cm (사춘기 전)", "가장 이상적이고 안정적인 성장 궤도", "밤 10시 전 취침·저녁 단백질·바른자세 루틴 유지"],
                ["연 4.0cm 미만 정체", "성장 속도 둔화 점검 필요 구간", "최근 6개월 기록 정리 후 소아청소년과 상담 권장"],
                ["초등 저·중학년 연 8cm+ 급증", "이른 급성장기(PHV) 진입 여부 확인 필요", "손목 뼈나이(골연령) 및 2차 성징 신호 함께 점검"],
            ],
            "steps": [
                "최근 6개월 동안 아이가 몇 cm 자랐는지 곱하기 2로 연간 성장속도(cm/년)를 계산해 보세요.",
                "kidsfit.co.kr 1분 무료 진단에서 또래 백분위와 저녁 수면·구강호흡 병목을 확인해 보세요.",
                "매달 자동 성장속도 추적과 6개월 졸업장 앨범이 필요하시다면 2p 무료 샘플 확인 후 19,900원 6개월 패스를 살펴보세요.",
            ],
            "cta_url": "https://kidsfit.co.kr/kfk_sample_2p.pdf",
            "cta_label": "📄 결제 전 2페이지 무료 샘플 PDF 먼저 보기 →",
            "faq": [
                ("9,900원 단건과 19,900원 6개월 패스의 차이는 무엇인가요?", "9,900원 단건은 현재 정밀 리포트+17p 마스터북+소아과 질문지+30일 달력을 제공하며, 19,900원 패스는 6개월간 매월 30일 키 재측정 성장속도 자동 판독까지 포함해요."),
                ("결제 후 마음에 안 들면 환불이 되나요?", "미열람·미다운로드 시 결제 후 7일 이내 전액 환불되며 파일 오류나 중복 결제 시 100% 환불해 드려요."),
            ],
        },
        {
            "slug": "pediatric-growth-clinic-3-questions-checklist.html",
            "title": "성장클리닉 10만 원 진료 후 후회 없도록 미리 적어가는 소아과 질문 3가지",
            "meta_desc": "성장판 엑스레이 진료실은 3분이면 끝납니다. 어머님이 진료실 나오며 후회하지 않도록 미리 메모해 갈 3가지 핵심 질문과 준비 서류 체크리스트.",
            "lead": "큰맘 먹고 소아청소년과 성장클리닉 예약까지 잡았는데, 막상 진료실에 들어가면 아이 달래랴 설명 들으랴 3분이 순식간에 지나가 버려요. 엘리베이터 타고 내려오면서 '아, 그걸 못 물어봤네!' 후회해 보신 적 있으시죠?",
            "p2": "진료 전 딱 1장만 정리해 가셔도 상담의 깊이가 완전히 달라져요. 오늘 잰 정확한 맨발 키·최근 6개월 성장폭·아이가 입을 벌리고 자는지와 평소 취침 시각까지 적어 가시면 선생님께서 우리 아이에게 꼭 맞는 현실적인 조언을 훨씬 정확하게 해주세요.",
            "p3": "키즈핏 2페이지 무료 샘플과 9,900원 단건 정밀 리포트에는 소아과 진료실에 그대로 들고 가실 수 있는 질문지와 30일 냉장고 실천 달력이 깔끔하게 정리되어 있어요.",
            "table_headers": ["진료실 필수 질문 3가지", "왜 꼭 물어봐야 할까요?", "미리 챙겨갈 숫자"],
            "rows": [
                ["1) 실제 만 개월수 대비 뼈나이 시차는?", "뼈나이가 1년 빠르면 남은 성장 기간이 줄어들어요", "오늘 측정 정확한 신장·체중(소수점 1자리)"],
                ["2) 최근 6개월 기준 연간 성장속도는?", "현재 키보다 '크는 속도(cm/년)'가 더 중요해요", "6개월 전 키 vs 오늘 아침 맨발 키"],
                ["3) 다음 추적 엑스레이 권장 시기는?", "불필요한 잦은 촬영을 줄이고 골든타임을 지켜요", "평소 취침 시각·구강호흡·저녁 식습관 메모"],
            ],
            "steps": [
                "병원 가기 전날, kidsfit.co.kr 무료 1분 진단으로 질병관리청 표준키 대비 백분위를 확인해 두세요.",
                "위 3가지 질문과 최근 6개월 키 기록을 휴대폰 메모장이나 출력본에 적어 가세요.",
                "진료 후 받아온 뼈나이 수치를 입력해 시차(Δt) 보정 예상키와 저녁 수면 루틴을 꾸준히 관리해 보세요.",
            ],
            "cta_url": "https://kidsfit.co.kr/?utm_source=seo&utm_medium=seo_article&utm_campaign=kfk_clinic_3qs",
            "cta_label": "📏 소아과 가기 전 1분 무료 성장 진단해 보기 →",
            "faq": [
                ("형제자매가 둘 이상인데 같이 관리할 수 있나요?", "네, 39,000원 12개월 가족 마스터 패스는 최대 4명 형제자매의 사계절 성장속도와 소아과 브리핑 PDF를 한 번에 관리할 수 있어요."),
                ("질병관리청 성장도표는 몇 년 기준인가요?", "대한민국 질병관리청(KDCA) 2017 공식 소아청소년 성장도표 기준을 엄격히 사용해요."),
            ],
        },
    ],
}


def _share_bar_html(div: str, canonical_url: str, title: str) -> str:
    """Active-channel 1-click referral share loops ONLY (ZERO LINE, ZERO Threads!)."""
    esc_url = _html.escape(canonical_url)
    esc_title = _html.escape(title)
    if div in ("TOM", "GBA"):
        lbl = "Share with a spouse or friend via Email" if div == "TOM" else "ご家族・ご友人にメールで共有する"
        copy_lbl = "Copy Article Link" if div == "TOM" else "記事リンクをコピー"
        mail_href = f"mailto:?subject={_html.escape(title)}&body={esc_url}"
        return (
            f'<div class="share-bar" style="margin:24px 0;padding:16px;border:1px solid #D1D5DB;border-radius:10px;background:#F9FAFB;display:flex;flex-wrap:wrap;gap:10px;align-items:center;">'
            f'<a href="{mail_href}" style="padding:10px 16px;background:#0F2C22;color:#FFF;text-decoration:none;border-radius:8px;font-weight:700;">✉️ {lbl}</a>'
            f'<button type="button" onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href);this.textContent=\'Copied ✓\'" style="padding:10px 16px;background:#FFF;color:#0F2C22;border:1.5px solid #0F2C22;border-radius:8px;font-weight:700;cursor:pointer;">🔗 {copy_lbl}</button>'
            f'</div>'
        )
    if div == "KFG":
        mail_href = f"mailto:?subject={_html.escape(title)}&body={esc_url}"
        sms_href = f"sms:?body={esc_title}%20{esc_url}"
        return (
            f'<div class="share-bar" style="margin:24px 0;padding:16px;border:1px solid #D1D5DB;border-radius:10px;background:#F9FAFB;display:flex;flex-wrap:wrap;gap:10px;">'
            f'<a href="{sms_href}" style="padding:10px 16px;background:#1B4332;color:#FFF;text-decoration:none;border-radius:8px;font-weight:700;">💬 Text to a Parent Friend</a>'
            f'<a href="{mail_href}" style="padding:10px 16px;background:#FFF;color:#1B4332;border:1.5px solid #1B4332;text-decoration:none;border-radius:8px;font-weight:700;">✉️ Email Guide</a>'
            f'<button type="button" onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href);this.textContent=\'Copied ✓\'" style="padding:10px 16px;background:#FFF;color:#1B4332;border:1.5px solid #1B4332;border-radius:8px;font-weight:700;cursor:pointer;">🔗 Copy Link</button>'
            f'</div>'
        )
    # HERO & KFK (Korean active channels: Web Share / Kakao / SMS / Copy — ZERO LINE, ZERO Threads)
    sms_href = f"sms:?body={esc_title}%20{esc_url}"
    bg = "#0E2820" if div == "HERO" else "#1B4332"
    fs = "19px" if div == "HERO" else "16px"
    return (
        f'<div class="share-bar" style="margin:24px 0;padding:16px;border:1.5px solid {bg};border-radius:12px;background:#FFFDF5;display:flex;flex-wrap:wrap;gap:10px;">'
        f'<button type="button" onclick="if(navigator.share){{navigator.share({{title:document.title,url:location.href}})}}else{{navigator.clipboard&&navigator.clipboard.writeText(location.href);this.textContent=\'링크 복사 완료 ✓\'}}" style="padding:12px 18px;background:{bg};color:#FFF;border:none;border-radius:10px;font-weight:800;font-size:{fs};cursor:pointer;">💛 카톡·문자로 바로 나누기</button>'
        f'<a href="{sms_href}" style="padding:12px 18px;background:#FFF;color:{bg};border:1.5px solid {bg};text-decoration:none;border-radius:10px;font-weight:800;font-size:{fs};">📱 문자로 보내기</a>'
        f'<button type="button" onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href);this.textContent=\'주소 복사 완료 ✓\'" style="padding:12px 18px;background:#FFF;color:{bg};border:1.5px solid {bg};border-radius:10px;font-weight:800;font-size:{fs};cursor:pointer;">🔗 링크 복사</button>'
        f'</div>'
    )


def render_page_html(div: str, spec: Dict[str, Any], date_str: str) -> Dict[str, Any]:
    wcfg = DIV_WEB_CONFIG[div]
    canonical = f"{wcfg['base_url']}{wcfg['article_url_prefix']}{spec['slug']}"
    accent = wcfg["accent"]
    bg = wcfg["bg"]
    fsize = wcfg["body_font_px"]

    ths = "".join(f"<th>{_html.escape(h)}</th>" for h in spec["table_headers"])
    trs = "".join(
        "<tr>" + "".join(f"<td>{_html.escape(c)}</td>" for c in row) + "</tr>"
        for row in spec["rows"]
    )
    steps_li = "".join(f"<li>{_html.escape(s)}</li>" for s in spec["steps"])
    faq_html = "".join(
        f"<div style='margin:14px 0;'><strong>Q. {_html.escape(q)}</strong><p style='margin:6px 0 0;'>A. {_html.escape(a)}</p></div>"
        for q, a in spec["faq"]
    )

    ld_article = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": spec["title"],
        "description": spec["meta_desc"],
        "datePublished": date_str,
        "dateModified": date_str,
        "mainEntityOfPage": canonical,
        "publisher": {"@type": "Organization", "name": wcfg["brand"]},
    }
    ld_faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in spec["faq"]
        ],
    }

    html_doc = f"""<!DOCTYPE html>
<html lang="{wcfg['lang']}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- AB_TITLE_SLOT_START --><title>{_html.escape(spec['title'])} | {_html.escape(wcfg['brand'])}</title><!-- AB_TITLE_SLOT_END -->
  <meta name="description" content="{_html.escape(spec['meta_desc'])}">
  <link rel="canonical" href="{_html.escape(canonical)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="{_html.escape(spec['title'])}">
  <meta property="og:description" content="{_html.escape(spec['meta_desc'])}">
  <meta property="og:url" content="{_html.escape(canonical)}">
  <script type="application/ld+json">{json.dumps(ld_article, ensure_ascii=False)}</script>
  <script type="application/ld+json">{json.dumps(ld_faq, ensure_ascii=False)}</script>
  <style>
    body {{ margin:0; background:{bg}; color:#111827; font-family:Georgia,'Malgun Gothic','Hiragino Sans',sans-serif; font-size:{fsize}px; line-height:1.82; }}
    main {{ max-width:680px; margin:0 auto; padding:42px 22px 68px; }}
    .eyebrow {{ font-size:14px; font-weight:700; color:{accent}; letter-spacing:0.04em; text-transform:uppercase; margin-bottom:10px; }}
    h1 {{ font-size:{32 if div!='HERO' else 34}px; line-height:1.34; color:{accent}; margin:0 0 18px; }}
    h2 {{ font-size:23px; color:{accent}; margin:32px 0 12px; }}
    table {{ width:100%; border-collapse:collapse; margin:20px 0; background:#FFF; font-size:{max(15, fsize-2)}px; }}
    th, td {{ border:1px solid #D1D5DB; padding:12px 14px; text-align:left; vertical-align:top; }}
    th {{ background:{accent}; color:#FFF; }}
    .cta-box {{ margin:28px 0; padding:22px; background:#FFF; border:2px solid {accent}; border-radius:14px; }}
    .cta-btn {{ display:inline-block; padding:14px 22px; background:{accent}; color:#FFF; text-decoration:none; border-radius:10px; font-weight:800; }}
    ol li {{ margin-bottom:10px; }}
    footer {{ margin-top:44px; padding-top:20px; border-top:1px solid #E5E7EB; font-size:14px; color:#6B7280; }}
  </style>
</head>
<body>
  <main>
    <div class="eyebrow">{_html.escape(wcfg['brand'])} · {date_str}</div>
    <!-- AB_H1_SLOT_START --><h1>{_html.escape(spec['title'])}</h1><!-- AB_H1_SLOT_END -->
    <p>{_html.escape(spec['lead'])}</p>
    <p>{_html.escape(spec['p2'])}</p>
    <p>{_html.escape(spec['p3'])}</p>

    <div class="cta-box">
      <a class="cta-btn" href="{_html.escape(spec['cta_url'])}">{_html.escape(spec['cta_label'])}</a>
    </div>

    <h2>{'Comparison Table' if wcfg['lang']=='en' else ('客観比較表' if wcfg['lang']=='ja' else '핵심 비교 표')}</h2>
    <table>
      <thead><tr>{ths}</tr></thead>
      <tbody>{trs}</tbody>
    </table>

    <h2>{'3 Calm Steps Today' if wcfg['lang']=='en' else ('今日から始める3ステップ' if wcfg['lang']=='ja' else '오늘 바로 해보는 3단계 체크')}</h2>
    <ol>{steps_li}</ol>

    {_share_bar_html(div, canonical, spec['title'])}

    <h2>{'Frequently Asked Questions' if wcfg['lang']=='en' else ('よくあるご質問' if wcfg['lang']=='ja' else '자주 묻는 질문')}</h2>
    {faq_html}

    <div class="cta-box">
      <a class="cta-btn" href="{_html.escape(spec['cta_url'])}">{_html.escape(spec['cta_label'])}</a>
    </div>

    <footer>
      <p>{_html.escape(wcfg['disclaimer'])}</p>
      <p><a href="{_html.escape(wcfg['base_url'])}" style="color:{accent};font-weight:700;">← {_html.escape(wcfg['brand'])}</a></p>
    </footer>
  </main>
</body>
</html>
"""
    plain = f"{spec['title']}\n{spec['lead']}\n{spec['p2']}\n{spec['p3']}\n" + "\n".join(spec["steps"]) + "\n" + "\n".join(f"{q} {a}" for q, a in spec["faq"])
    ok, errs = check_written_auto_gate(div, spec["title"], html_doc, plain, is_seo_article=False)
    return {
        "ok": ok,
        "errors": errs,
        "division": div,
        "slug": spec["slug"],
        "canonical_url": canonical,
        "title": spec["title"],
        "meta_desc": spec["meta_desc"],
        "html": html_doc,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ping-indexnow", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    today = dt.datetime.now(KST).strftime("%Y-%m-%d")
    key = ensure_indexnow_key()
    results = []

    for div, specs in PAGES_15.items():
        wcfg = DIV_WEB_CONFIG[div]
        div_urls: List[str] = []
        for spec in specs:
            page = render_page_html(div, spec, today)
            if not page["ok"]:
                raise RuntimeError(f"3-Intent SEO Gate BLOCKED {div}/{spec['slug']}: {page['errors']}")
            written = []
            if not args.dry_run:
                for wroot in wcfg["local_roots"]:
                    if not wroot.exists():
                        continue
                    (wroot / f"{key}.txt").write_text(key, encoding="utf-8")
                    out_dir = wroot / wcfg["article_rel_dir"]
                    out_dir.mkdir(parents=True, exist_ok=True)
                    fp = out_dir / spec["slug"]
                    fp.write_text(page["html"], encoding="utf-8")
                    written.append(str(fp))
                    _append_to_sitemap_and_rss(
                        wroot, wcfg["base_url"], wcfg["brand"],
                        page["canonical_url"], page["title"], page["meta_desc"], today,
                    )
            div_urls.append(page["canonical_url"])
            results.append({"division": div, "url": page["canonical_url"], "written_count": len(written)})

        if args.ping_indexnow and not args.dry_run:
            ping = ping_indexnow(wcfg["host"], div_urls, key, dry_run=False)
            print(f"[INDEXNOW {div}] {ping}", flush=True)

    print(json.dumps({"ok": True, "total_pages": len(results), "indexnow_key": key, "pages": results}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
