#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/flagship_longform_producer.py
================================================================================
Dream Company — Track B: 1·2·3·5사업부 AI 티 0% 대표 롱폼 (2~3분, 1920x1080, 30fps)
Live Real-UI Calculator/Gauge + Actual 2-Page Sample PDF Walkthrough Producer
& Official YouTube Data API v3 Uploader.

Priority #1: KFG (2사업부 @kisfitglobal — currently 0 long-form Videos!),
followed sequentially (max_workers=1, -threads 2) by TOM, GBA, and KFK.
Strictly enforces:
  - promo_hard_gate (AI 티 0%, 자동화 티 0%, /go/yt short link ONLY, zero unsupported API fields)
  - real_ui_mobile_recorder (<main> > 200 chars Fail-Closed Auto-Gate!)
  - zero_ai_video_composer (0.32s natural pauses, 3 SFX, -26dB sidechaincompress BGM, true .srt)
  - outbound_allowlist (#5 channel ID verification before upload)
================================================================================
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from PIL import Image, ImageDraw, ImageFont

if sys.platform == "win32":
    try:
        import ctypes
        ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x00004000)
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

sys.path.insert(0, str(Path(__file__).resolve().parent))
from outbound_allowlist import assert_allowed_yt_channel  # noqa: E402
from promo_hard_gate import (  # noqa: E402
    build_clean_go_link,
    build_clean_social_comment,
    check_promo_hard_gate,
    strip_unsupported_yt_api_fields,
)
from real_ui_mobile_recorder import (  # noqa: E402
    DIV_REAL_UI_SPEC,
    record_html_motion_chart_clip,
    record_longform_16x9_walkthrough,
)
from zero_ai_video_composer import (  # noqa: E402
    _pick_font,
    compose_flagship_longform_16x9,
    get_cached_faceless_stock_clip,
)

ROOT = Path(__file__).resolve().parent.parent
OUT_ROOT = ROOT / "cloud_automation" / ".cache" / "flagship_longform_20261125"
LEDGER_PATH = ROOT / "data" / "flagship_longform_20261125.json"

FLAGSHIP_SPECS: Dict[str, Dict[str, Any]] = {
    "KFG": {
        "lang": "en",
        "voice_id": "en-US-AvaMultilingualNeural",
        "yt_title": "How to Check Your Child's Real Growth Pace in 60 Seconds (US CDC 2000 Walkthrough)",
        "thumb_eyebrow": "KISFIT STUDIO · US CDC 2000 WALKTHROUGH",
        "thumb_line1": "60-Second Child Height",
        "thumb_line2": "& Growth Pace Check",
        "thumb_sub": "Zero Supplement Ads · Real Screen Demo + Free 2p Sample PDF",
        "thumb_bg": (250, 247, 242),
        "thumb_ink": (24, 34, 30),
        "thumb_accent": (27, 67, 50),
        "pdf_url": "https://kisfitglobal.com/assets/downloads/kfg_sample_2p.pdf",
        "pdf_local_cands": [
            ROOT / "2사업부" / "assets" / "downloads" / "kfg_sample_2p.pdf",
            ROOT / "2사업부" / "dist" / "assets" / "downloads" / "kfg_sample_2p.pdf",
            ROOT / "2사업부" / "dist-global" / "assets" / "downloads" / "kfg_sample_2p.pdf",
            ROOT / "2사업부" / ".gh-pages-kisfitglobal" / "assets" / "downloads" / "kfg_sample_2p.pdf",
        ],
        "chapters": [
            {
                "kind": "chart",
                "badge": "01 · Why One Number Is Not Enough",
                "script": (
                    "Most parents walk out of an annual checkup with one height percentile written on a slip of paper, "
                    "and still feel unsure when they get home. "
                    "Averaging mom and dad's height alone carries a wide plus or minus three and a half inch spread on official US CDC reference charts. "
                    "What actually tells the calm truth for ages four through ten is yearly pace: how many inches your child grew over the past twelve months. "
                    "In the next two minutes, let us walk through our free ad-free studio screen together, step by step."
                ),
            },
            {
                "kind": "ui_primary",
                "badge": "02 · Live 60-Second US CDC Check",
                "script": (
                    "Here is the live KISFIT Studio screen on kisfitglobal dot com, with zero supplement ads and zero email wall to start. "
                    "First, you enter your child's age, sex, and barefoot morning height. "
                    "Next, you can add mom and dad's heights plus optional wrist bone-age notes if you have them. "
                    "Even if that wrist check happened six or twelve months ago, the calculator automatically adjusts for the elapsed time gap so your baseline stays grounded. "
                    "Then you pick three quick evening routine checks: lights-out hour, open-mouth sleep signs, and dinner protein rhythm. "
                    "Within sixty seconds, you see your child's current US CDC percentile lane and the single evening habit worth adjusting first."
                ),
            },
            {
                "kind": "pdf",
                "badge": "03 · Inside the Free 2-Page Sample PDF",
                "script": (
                    "Before you ever spend a dollar, you can open our free two-page printable sample PDF right on the screen. "
                    "Page one lays out the official US CDC height velocity benchmark table so you can compare your child's yearly inches against steady school-age norms. "
                    "Page two gives you a clean refrigerator evening checklist covering lights-out timing, mouth-breathing cues, and simple high-protein dinners. "
                    "Parents often print this sheet once and bring their monthly barefoot wall log right to their routine pediatric visit."
                ),
            },
            {
                "kind": "ui_secondary",
                "badge": "04 · Your Calm Next Step",
                "script": (
                    "You do not need expensive gummies or late-night guesswork to stay steady as a parent. "
                    "Start by marking barefoot morning height on the exact same hallway wall once every thirty days. "
                    "Tap the short link right below this video to run the free sixty-second US CDC check and download the two-page sample PDF today. "
                    "And tell us in the comments: does your child usually fall asleep before nine thirty or after ten on school nights?"
                ),
            },
        ],
    },
    "TOM": {
        "lang": "en",
        "voice_id": "en-US-AndrewMultilingualNeural",
        "yt_title": "Free Daily SMH Fear & Greed Gauge + 2000-2025 Retirement Stress-Test Walkthrough",
        "thumb_eyebrow": "TRUTH OF MARKET · 2000-2025 RESEARCH DEMO",
        "thumb_line1": "SMH Fear & Greed Gauge",
        "thumb_line2": "+ 25-Year Crash Walkthrough",
        "thumb_sub": "Live 7-Factor Gauge Demo + Free 2-Page Historical Workbook PDF",
        "thumb_bg": (15, 30, 24),
        "thumb_ink": (248, 250, 252),
        "thumb_accent": (212, 175, 55),
        "pdf_url": "https://truthofmarket.com/assets/downloads/tom_sample_2p.pdf",
        "pdf_local_cands": [
            ROOT / "1사업부" / "assets" / "downloads" / "tom_sample_2p.pdf",
            ROOT / "1사업부" / "dist" / "assets" / "downloads" / "tom_sample_2p.pdf",
        ],
        "chapters": [
            {
                "kind": "chart",
                "badge": "01 · Why Average Returns Mislead Retirees",
                "script": (
                    "Standard retirement calculators assume a neat seven percent line moving upward every single year. "
                    "Real markets arrive in lumpy shocks like 2000, 2008, and 2022, when stocks and long bonds fell together. "
                    "If you draw monthly living cash directly from fallen shares during a bad first year, those sold shares never come back. "
                    "Over the next two minutes, let us walk through our live daily gauge and twenty-five year historical stress-test."
                ),
            },
            {
                "kind": "ui_primary",
                "badge": "02 · Live 7-Factor SMH Fear & Greed Gauge",
                "script": (
                    "Here is our free daily Semiconductor Fear and Greed page, updated automatically after every US market close with no login required. "
                    "Instead of checking forty separate headlines every morning, you see seven public market structure factors distilled into one calm zero-to-one-hundred reading. "
                    "You can inspect breadth, volatility pressure, and semiconductor leadership against defensive healthcare in under ten seconds. "
                    "Below the gauge, our four-step retirement planner lets you compare twenty-four months of short-term Treasury cash beside an SMH and XLV balance across past crashes."
                ),
            },
            {
                "kind": "pdf",
                "badge": "03 · Inside the Free 2-Page Sample Study PDF",
                "script": (
                    "Before deciding whether you want our full research workbook, you can inspect the free two-page historical study PDF right on screen. "
                    "Page one compares peak-to-trough drawdowns and recovery months across 2000, 2008, and 2022 against classic 60/40 and single-sector tech. "
                    "Page two shows a simple one-sheet semi-annual rebalancing checklist designed so retirees spend twenty minutes twice a year rather than watching screens all week."
                ),
            },
            {
                "kind": "ui_secondary",
                "badge": "04 · Check Today's Gauge Free",
                "script": (
                    "Educational research works best when you can verify every historical number for yourself in plain English. "
                    "Tap the short link in the description right below this video to view today's live SMH Fear and Greed score and preview the two-page sample PDF. "
                    "Let us know in the comments: do you keep your retirement cash cushion in a bank sweep or short-term Treasury bills?"
                ),
            },
        ],
    },
    "GBA": {
        "lang": "ja",
        "voice_id": "ja-JP-KeitaNeural",
        "yt_title": "【実画面ガイド】毎日無料の米国半導体・恐怖と強欲指数＆新NISA25年統計の使い方",
        "thumb_eyebrow": "GETBREAKAI 日本 · 新NISA 25年統計ガイド",
        "thumb_line1": "米国半導体・恐怖と強欲指数",
        "thumb_line2": "＆新NISA実画面ガイド",
        "thumb_sub": "ログイン不要・毎日更新ゲージ＋無料2ページ統計サンプルPDF",
        "thumb_bg": (15, 30, 24),
        "thumb_ink": (248, 250, 252),
        "thumb_accent": (212, 175, 55),
        "pdf_url": "https://getbreakai.com/jp/downloads/gba_jp_sample_2p.pdf",
        "pdf_local_cands": [
            ROOT / "3사업부" / "jp" / "downloads" / "gba_jp_sample_2p.pdf",
            ROOT / "3사업부" / "dist" / "jp" / "downloads" / "gba_jp_sample_2p.pdf",
            ROOT / "3사업부" / "cf_dist" / "jp" / "downloads" / "gba_jp_sample_2p.pdf",
        ],
        "chapters": [
            {
                "kind": "chart",
                "badge": "01 · 新NISAで迷いやすい3つの壁",
                "script": (
                    "50代・60代から新NISAを整えようとすると、毎朝のニュースや高配当ランキングばかりが目に入り、かえって迷い深くなりがちです。 "
                    "特に見落とされやすいのが、成長投資枠の生涯上限1,200万円と、相場急落時に生活費のために株を売ってしまう順序リスクです。 "
                    "この2分間の動画では、ログイン不要で毎日使える実画面と、過去25年統計サンプルPDFの見方を落ち着いてご案内します。"
                ),
            },
            {
                "kind": "ui_primary",
                "badge": "02 · 毎日更新・米国半導体 恐怖と強欲指数",
                "script": (
                    "こちらが毎営業日の米国市場引け後に自動更新される、無料の米国半導体・恐怖と強欲指数の実画面です。 "
                    "7つの公開指標を0点から100点の1つの温度計にまとめてあるため、毎朝いくつもの銘柄を追わなくても市場の過熱感と恐怖水準を10秒で確認できます。 "
                    "さらに新NISA設計画面では、向こう2年分の生活費を個人向け国債など安全資金へ切り分けたうえで、半導体成長SMHとヘルスケア防衛XLVの過去バランスを確認できます。"
                ),
            },
            {
                "kind": "pdf",
                "badge": "03 · 無料2ページ過去25年サンプルPDF",
                "script": (
                    "詳しいワークブックをご検討いただく前に、まずは無料の2ページ・サンプルPDFをそのまま開いて中身をお確かめいただけます。 "
                    "1ページ目には2000年・2008年・2022年の歴史的な下落幅と回復期間の比較表を、2ページ目には年2回だけの穏やかな点検チェック表を収録しています。 "
                    "日々の値動きを予想するのではなく、ご自身の机で落ち着いて見返せる教育資料として整えました。"
                ),
            },
            {
                "kind": "ui_secondary",
                "badge": "04 · まずは今日の数値から確認",
                "script": (
                    "大切な老後資金ほど、声の大きな予想ではなく過去25年の事実データから静かに整えるのが安心です。 "
                    "動画すぐ下の概要欄にある短いリンクから、本日の恐怖と強欲指数と無料2ページサンプルPDFをそのままご覧ください。 "
                    "コメント欄でも、新NISAの安全資金は銀行預金と個人向け国債のどちらを軸に考えているかぜひ教えてくださいね。"
                ),
            },
        ],
    },
    "KFK": {
        "lang": "ko",
        "voice_id": "ko-KR-SunHiNeural",
        "yt_title": "영양제 광고 없는 1분 무료 질병관리청 예상키·뼈나이 시차 진단 실화면 안내",
        "thumb_eyebrow": "키즈핏 성장 아틀리에 · 광고 0건 실화면 안내",
        "thumb_line1": "1분 무료 질병관리청 예상키",
        "thumb_line2": "& 뼈나이 시차 진단 사용법",
        "thumb_sub": "이메일 없이 즉시 확인 · 실제 계산기 시연 + 2페이지 무료 샘플 PDF",
        "thumb_bg": (250, 247, 242),
        "thumb_ink": (24, 34, 30),
        "thumb_accent": (27, 67, 50),
        "pdf_url": "https://kidsfit.co.kr/kfk_sample_2p.pdf",
        "pdf_local_cands": [
            ROOT / "5사업부" / "assets" / "downloads" / "kfk_sample_2p.pdf",
            ROOT / "5사업부" / "kfk_sample_2p.pdf",
            ROOT / "5사업부" / "dist" / "kfk_sample_2p.pdf",
        ],
        "chapters": [
            {
                "kind": "chart",
                "badge": "01 · 단순 부모 키 평균이 어긋나는 이유",
                "script": (
                    "초등 아이 키를 검색하면 수십만 원짜리 영양제 광고부터 쏟아져서 정작 믿을 만한 숫자를 찾기 어렵습니다. "
                    "엄마 아빠 키만 더하는 단순 유전 공식은 실제 최종 성인키와 최대 8센티미터까지 벌어질 수 있고, 작년에 찍은 뼈나이 역시 경과한 개월수를 보정하지 않으면 기준이 크게 흔들립니다. "
                    "지금부터 상업성 광고가 단 한 건도 없는 키즈핏 실화면으로, 1분 무료 진단과 2페이지 샘플 PDF를 차분히 보여드릴게요."
                ),
            },
            {
                "kind": "ui_primary",
                "badge": "02 · 1분 무료 질병관리청·뼈나이 시차 진단",
                "script": (
                    "지금 보시는 화면이 kidsfit.co.kr 실제 진단 화면입니다. 이메일 입력이나 회원가입 없이 바로 시작할 수 있어요. "
                    "아이의 성별과 생년월일, 오늘 잰 맨발 키를 넣으면 태어난 일수까지 세밀하게 반영해 질병관리청 공식 또래 백분위를 바로 계산합니다. "
                    "병원 뼈나이 검사를 예전에 받으셨다면 촬영 시기 경과 시차를 자동으로 보정하고, 아직 안 찍으셨더라도 저녁 취침 시각과 구강호흡 습관만으로 오늘 밤 먼저 챙길 한 가지를 짚어 드립니다."
                ),
            },
            {
                "kind": "pdf",
                "badge": "03 · 결제 전 미리 보는 2페이지 무료 샘플 PDF",
                "script": (
                    "유료 리포트를 고민하시기 전에 누구나 무료 2페이지 샘플 PDF를 먼저 열어 보실 수 있습니다. "
                    "첫 페이지에는 질병관리청 기준 연령별 정상 연간 성장속도와 급성장 점검 기준이 한눈에 정리되어 있고, "
                    "둘째 페이지에는 냉장고에 붙여 두고 쓰는 밤 9시 반 수면 루틴과 저녁 단백질 체크표가 담겨 있습니다. "
                    "매달 1일 아침 같은 벽에서 잰 맨발 키 기록을 소아과 진료 때 그대로 가져가시는 부모님도 많습니다."
                ),
            },
            {
                "kind": "ui_secondary",
                "badge": "04 · 오늘 밤 바로 무료 확인하기",
                "script": (
                    "막연한 걱정으로 비싼 영양제를 바꾸기 전에, 정확한 백분위와 연간 성장속도부터 차분히 확인해 보세요. "
                    "영상 바로 아래 설명란의 짧은 링크를 누르시면 광고 없는 1분 무료 진단과 2페이지 샘플 PDF를 바로 보실 수 있습니다. "
                    "우리 아이 평일 취침 시간은 보통 9시 반 이전인지, 10시 이후인지 댓글로도 편하게 남겨 주세요."
                ),
            },
        ],
    },
}


def _load_env() -> Dict[str, str]:
    env: Dict[str, str] = {}
    ep = ROOT / ".env"
    if ep.exists():
        for line in ep.read_text(encoding="utf-8", errors="ignore").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def _refresh_yt_token(div: str, env: Dict[str, str]) -> Optional[str]:
    div_u = div.upper()
    use_proj2 = div_u in ("HERO", "KFK")
    cid = env.get(f"YT_CLIENT_ID_{div_u}") or (env.get("YT_CLIENT_ID_2") if use_proj2 else "") or env.get("YT_CLIENT_ID", "")
    csec = env.get(f"YT_CLIENT_SECRET_{div_u}") or (env.get("YT_CLIENT_SECRET_2") if use_proj2 else "") or env.get("YT_CLIENT_SECRET", "")
    rtok = env.get(f"YT_REFRESH_TOKEN_{div_u}", "")
    if not (cid and csec and rtok):
        return None
    data = urllib.parse.urlencode({"client_id": cid, "client_secret": csec, "refresh_token": rtok, "grant_type": "refresh_token"}).encode()
    with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=data, method="POST"), timeout=20) as r:
        return json.loads(r.read().decode()).get("access_token")


def _resolve_sample_pdf(div: str, work_dir: Path) -> Path:
    spec = FLAGSHIP_SPECS[div]
    for cand in spec["pdf_local_cands"]:
        if Path(cand).exists() and Path(cand).stat().st_size > 20_000:
            return Path(cand)
    dest = work_dir / f"{div.lower()}_sample_2p.pdf"
    req = urllib.request.Request(spec["pdf_url"], headers={"User-Agent": "DC-Longform/1.0"})
    dest.write_bytes(urllib.request.urlopen(req, timeout=30).read())
    return dest


def record_real_pdf_scroll_16x9(div: str, pdf_path: Path, out_mp4: Path, target_sec: float = 36.0) -> Path:
    """Renders actual 2-page Sample PDF pages via PyMuPDF (fitz) into a crisp editorial 16:9 viewer and records smooth scroll at 30fps."""
    import fitz  # type: ignore
    from playwright.sync_api import sync_playwright

    doc = fitz.open(str(pdf_path))
    page_imgs_b64: List[str] = []
    for pno in range(min(2, len(doc))):
        pix = doc[pno].get_pixmap(dpi=160)
        page_imgs_b64.append(base64.b64encode(pix.tobytes("png")).decode("ascii"))
    doc.close()

    spec = DIV_REAL_UI_SPEC[div]
    is_dark = spec["bg"].startswith("#0")
    bg_hex = "#121E19" if is_dark else "#F4EFE6"
    imgs_html = "\n".join(
        f'<div class="sheet"><div class="pg-tag">FREE SAMPLE PDF · PAGE {i+1} OF {len(page_imgs_b64)}</div>'
        f'<img src="data:image/png;base64,{b64}" alt="Sample page {i+1}"></div>'
        for i, b64 in enumerate(page_imgs_b64)
    )
    html = f"""<!doctype html>
<html><head><meta charset="utf-8"><style>
  body {{ margin: 0; background: {bg_hex}; font-family: 'Malgun Gothic', 'Segoe UI', sans-serif; padding: 36px 0 90px; }}
  .wrap {{ max-width: 920px; margin: 0 auto; display: flex; flex-direction: column; gap: 36px; align-items: center; }}
  .sheet {{ width: 860px; background: #FFF; border-radius: 14px; overflow: hidden; box-shadow: 0 18px 50px rgba(0,0,0,0.22); }}
  .pg-tag {{ background: {spec['accent']}; color: #FFF; font-size: 15px; font-weight: 700; padding: 10px 20px; letter-spacing: 0.06em; }}
  .sheet img {{ display: block; width: 100%; height: auto; }}
</style></head>
<body><main class="wrap">{imgs_html}</main></body></html>"""

    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        import imageio_ffmpeg  # type: ignore
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    with tempfile.TemporaryDirectory(prefix=f"dc_pdf_{div}_") as tmp:
        tdir = Path(tmp)
        hp = tdir / "pdf_view.html"
        hp.write_text(html, encoding="utf-8")
        with sync_playwright() as p:
            br = p.chromium.launch(headless=True)
            ctx = br.new_context(
                viewport={"width": 1280, "height": 720},
                record_video_dir=str(tdir),
                record_video_size={"width": 1280, "height": 720},
            )
            pg = ctx.new_page()
            pg.goto(hp.as_uri(), wait_until="load", timeout=20000)
            pg.wait_for_timeout(1500)
            total_h = pg.evaluate("document.body.scrollHeight")
            steps = 9
            step_ms = max(2000, int(((target_sec - 2.5) * 1000) / steps))
            for s in range(1, steps + 1):
                ty = int((total_h - 680) * (s / steps))
                pg.evaluate(f"window.scrollTo({{top: {max(0, ty)}, behavior: 'smooth'}});")
                pg.wait_for_timeout(step_ms)
            vid = pg.video
            ctx.close()
            br.close()
            subprocess.run(
                [ffmpeg, "-y", "-threads", "2", "-i", str(vid.path()), "-t", f"{target_sec:.2f}",
                 "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,format=yuv420p",
                 "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-movflags", "+faststart", str(out_mp4)],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=180,
            )
    return out_mp4


def render_editorial_thumbnail_1280x720(div: str, out_png: Path) -> Path:
    """Renders a crisp, zero-AI-face 1280x720 editorial thumbnail for the flagship 16:9 Long-Form video."""
    spec = FLAGSHIP_SPECS[div]
    lang = spec["lang"]
    W, H = 1280, 720
    img = Image.new("RGB", (W, H), spec["thumb_bg"])
    draw = ImageDraw.Draw(img)
    acc = spec["thumb_accent"]
    ink = spec["thumb_ink"]

    # Crisp editorial frame & accent pillar
    draw.rectangle([0, 0, 22, H], fill=acc)
    draw.rounded_rectangle([54, 48, W - 54, H - 48], radius=24, outline=acc, width=3)

    f_eye = _pick_font(lang, 28)
    f_h1 = _pick_font(lang, 68 if lang == "en" else 64)
    f_sub = _pick_font(lang, 32 if lang == "en" else 30)
    f_go = _pick_font("en", 30)

    draw.text((96, 98), spec["thumb_eyebrow"], font=f_eye, fill=acc)
    draw.text((96, 185), spec["thumb_line1"], font=f_h1, fill=ink)
    draw.text((96, 278), spec["thumb_line2"], font=f_h1, fill=acc)
    draw.rectangle([96, 386, 280, 394], fill=acc)
    draw.text((96, 424), spec["thumb_sub"], font=f_sub, fill=ink)

    go_txt = f"FREE DEMO  ·  {build_clean_go_link(div, 'yt').replace('https://', '')}"
    bb = draw.textbbox((0, 0), go_txt, font=f_go)
    bw, bh = bb[2] - bb[0] + 48, bb[3] - bb[1] + 24
    draw.rounded_rectangle([96, 540, 96 + bw, 540 + bh], radius=14, fill=acc)
    pill_fg = (15, 23, 42) if sum(acc) > 420 else (255, 255, 255)
    draw.text((120, 552 - bb[1]), go_txt, font=f_go, fill=pill_fg)

    out_png.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_png, format="PNG", optimize=True)
    return out_png


def upload_longform_to_youtube(
    div: str,
    mp4_path: Path,
    thumb_png: Path,
    srt_text: str,
    env: Dict[str, str],
) -> Dict[str, Any]:
    spec = FLAGSHIP_SPECS[div]
    lang = spec["lang"]
    go_url = build_clean_go_link(div, "yt")
    sample_go = build_clean_go_link(div, "yt_sample")
    comment_txt = build_clean_social_comment(div, index_seed=0, is_longform=True)

    if lang == "en":
        desc = (
            f"{spec['yt_title']}\n\n"
            f"Run the free interactive check (clickable link): {go_url}\n"
            f"Preview the free 2-page sample PDF: {sample_go}\n\n"
            f"Chapters:\n"
            + "\n".join(f"- {c['badge']}" for c in spec["chapters"])
            + "\n\nEducational public-data reference only."
        )
    elif lang == "ja":
        desc = (
            f"{spec['yt_title']}\n\n"
            f"無料実画面ツール＆本日の指数はこちら: {go_url}\n"
            f"無料2ページ過去25年サンプルPDF: {sample_go}\n\n"
            f"チャプター:\n"
            + "\n".join(f"・{c['badge']}" for c in spec["chapters"])
            + "\n\n※過去統計に基づく教育・情報提供のみを目的としています。"
        )
    else:
        desc = (
            f"{spec['yt_title']}\n\n"
            f"광고 없는 1분 무료 질병관리청 진단 바로가기: {go_url}\n"
            f"결제 전 미리 보는 2페이지 무료 샘플 PDF: {sample_go}\n\n"
            f"목차:\n"
            + "\n".join(f"- {c['badge']}" for c in spec["chapters"])
            + "\n\n상업성 영양제 제휴 광고 0건 · 질병관리청 공식 성장도표 기반 교육 참고 자료입니다."
        )

    ok_hg, errs = check_promo_hard_gate(div, f"{spec['yt_title']}\n{desc}", surface="youtube_desc", srt_text=srt_text)
    if not ok_hg:
        raise ValueError(f"[HARD GATE BLOCKED LONGFORM UPLOAD] {div}: {errs}")

    atok = _refresh_yt_token(div, env)
    if not atok:
        return {"ok": False, "error": "missing_yt_oauth"}

    # Verify #5 Outbound Allowlist
    creq = urllib.request.Request("https://www.googleapis.com/youtube/v3/channels?part=id&mine=true", headers={"Authorization": f"Bearer {atok}"})
    with urllib.request.urlopen(creq, timeout=20) as cr:
        ch_id = str((json.loads(cr.read().decode()).get("items") or [{}])[0].get("id", ""))
    assert_allowed_yt_channel(div, ch_id)

    meta = strip_unsupported_yt_api_fields({
        "snippet": {
            "title": spec["yt_title"][:98],
            "description": desc[:4900],
            "categoryId": "27",
            "defaultLanguage": lang,
            "defaultAudioLanguage": lang,
        },
        "status": {
            "privacyStatus": "public",
            "selfDeclaredMadeForKids": False,
        },
    })
    raw = mp4_path.read_bytes()
    init_req = urllib.request.Request(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        data=json.dumps(meta, ensure_ascii=False).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"Bearer {atok}",
            "Content-Type": "application/json; charset=UTF-8",
            "X-Upload-Content-Length": str(len(raw)),
            "X-Upload-Content-Type": "video/mp4",
        },
    )
    with urllib.request.urlopen(init_req, timeout=30) as ir:
        up_url = ir.headers.get("Location")
    put_req = urllib.request.Request(up_url, data=raw, method="PUT", headers={"Content-Type": "video/mp4", "Content-Length": str(len(raw))})
    with urllib.request.urlopen(put_req, timeout=300) as pr:
        vid = json.loads(pr.read().decode("utf-8")).get("id", "")

    # Thumbnail
    thumb_ok = False
    try:
        treq = urllib.request.Request(
            f"https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId={vid}&uploadType=media",
            data=thumb_png.read_bytes(), method="POST",
            headers={"Authorization": f"Bearer {atok}", "Content-Type": "image/png"},
        )
        with urllib.request.urlopen(treq, timeout=45) as tr:
            thumb_ok = tr.status in (200, 201)
    except Exception as te:
        print(f"  [THUMB WARN {div}] {te}", flush=True)

    # True synced .srt caption
    srt_ok = False
    try:
        boundary = "----DCFlagshipSRT20261125"
        cmeta = json.dumps({"snippet": {"videoId": vid, "language": lang, "name": f"Official {lang.upper()}", "isDraft": False}})
        cbody = (
            f"--{boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n{cmeta}\r\n"
            f"--{boundary}\r\nContent-Type: application/octet-stream\r\n\r\n{srt_text}\r\n"
            f"--{boundary}--\r\n"
        ).encode("utf-8")
        sreq = urllib.request.Request(
            "https://www.googleapis.com/upload/youtube/v3/captions?part=snippet&uploadType=multipart",
            data=cbody, method="POST",
            headers={"Authorization": f"Bearer {atok}", "Content-Type": f"multipart/related; boundary={boundary}"},
        )
        with urllib.request.urlopen(sreq, timeout=30) as sr:
            srt_ok = sr.status in (200, 201)
    except Exception as se:
        print(f"  [SRT WARN {div}] {se}", flush=True)

    # Top comment with clean /go/yt link
    cmt_ok = False
    try:
        cpay = json.dumps({"snippet": {"channelId": ch_id, "videoId": vid, "topLevelComment": {"snippet": {"textOriginal": comment_txt}}}}, ensure_ascii=False).encode("utf-8")
        creq2 = urllib.request.Request(
            "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet",
            data=cpay, method="POST",
            headers={"Authorization": f"Bearer {atok}", "Content-Type": "application/json"},
        )
        with urllib.request.urlopen(creq2, timeout=25) as c2:
            cmt_ok = c2.status in (200, 201)
    except Exception as ce:
        print(f"  [COMMENT WARN {div}] {ce}", flush=True)

    return {
        "ok": True,
        "video_id": vid,
        "url": f"https://youtu.be/{vid}",
        "thumb_ok": thumb_ok,
        "srt_ok": srt_ok,
        "comment_ok": cmt_ok,
    }


def produce_and_upload_division(div: str, upload: bool = True) -> Dict[str, Any]:
    div_u = div.upper()
    spec = FLAGSHIP_SPECS[div_u]
    ui_spec = DIV_REAL_UI_SPEC[div_u]
    wdir = OUT_ROOT / div_u
    wdir.mkdir(parents=True, exist_ok=True)
    print(f"\n=== [{div_u}] Producing Flagship 16:9 30fps Real-UI Long-Form ===", flush=True)

    # 1. Record 16:9 HTML Motion Chart
    chart_mp4 = record_html_motion_chart_clip(div_u, wdir / f"{div_u}_chart_16x9.mp4", aspect="16:9", duration_sec=6.0)
    # 2. Record 16:9 Primary Live Real-UI Walkthrough (Fail-Closed <main> > 200 chars Auto-Gate!)
    ui1_mp4, gate1 = record_longform_16x9_walkthrough(div_u, wdir / f"{div_u}_ui1_16x9.mp4", target_sec=36.0, url_override=ui_spec["primary_url"])
    print(f"  [{div_u}] Real-UI Primary Gate PASS: mainLen={gate1['mainLen']} widget={gate1['matched_widget']}", flush=True)
    # 3. Record 16:9 Real 2-Page Sample PDF Walkthrough
    pdf_p = _resolve_sample_pdf(div_u, wdir)
    pdf_mp4 = record_real_pdf_scroll_16x9(div_u, pdf_p, wdir / f"{div_u}_pdf_16x9.mp4", target_sec=34.0)
    # 4. Record 16:9 Secondary Live Real-UI (or reuse primary if same URL)
    if ui_spec["secondary_url"] != ui_spec["primary_url"]:
        ui2_mp4, gate2 = record_longform_16x9_walkthrough(div_u, wdir / f"{div_u}_ui2_16x9.mp4", target_sec=26.0, url_override=ui_spec["secondary_url"])
        print(f"  [{div_u}] Real-UI Secondary Gate PASS: mainLen={gate2['mainLen']}", flush=True)
    else:
        ui2_mp4 = ui1_mp4

    clip_map = {"chart": chart_mp4, "ui_primary": ui1_mp4, "pdf": pdf_mp4, "ui_secondary": ui2_mp4}
    chapters_arg = [{"clip": clip_map[c["kind"]], "script": c["script"], "badge": c["badge"]} for c in spec["chapters"]]

    out_mp4 = wdir / f"{div_u}_flagship_20261125_16x9_30fps.mp4"
    final_mp4, dur_sec, srt_text = compose_flagship_longform_16x9(
        div=div_u, lang=spec["lang"], voice_id=spec["voice_id"], chapters=chapters_arg, out_mp4=out_mp4,
    )
    (wdir / f"{div_u}_flagship_20261125.srt").write_text(srt_text, encoding="utf-8")
    thumb_png = render_editorial_thumbnail_1280x720(div_u, wdir / f"{div_u}_thumb_1280x720.png")
    print(f"  [{div_u}] Rendered Flagship Long-Form: {final_mp4.name} | dur={dur_sec:.1f}s ({dur_sec/60:.2f}m) | size={final_mp4.stat().st_size//1024} KB", flush=True)

    yt_res: Dict[str, Any] = {"ok": False, "skipped": "render_only"}
    if upload:
        env = _load_env()
        yt_res = upload_longform_to_youtube(div_u, final_mp4, thumb_png, srt_text, env)
        print(f"  [{div_u}] YOUTUBE UPLOAD RESULT: {yt_res}", flush=True)

    return {
        "division": div_u,
        "duration_sec": dur_sec,
        "size_bytes": final_mp4.stat().st_size,
        "mp4": str(final_mp4),
        "thumb": str(thumb_png),
        "gate_main_len": gate1["mainLen"],
        "youtube": yt_res,
        "created_at_kst": dt.datetime.now(dt.timezone(dt.timedelta(hours=9))).strftime("%Y-%m-%d %H:%M:%S KST"),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--divs", default="KFG,TOM,GBA,KFK", help="Comma-separated divisions (KFG priority #1!)")
    ap.add_argument("--no-upload", action="store_true")
    args = ap.parse_args()

    ledger = json.loads(LEDGER_PATH.read_text(encoding="utf-8")) if LEDGER_PATH.exists() else {"videos": {}}
    divs = [d.strip().upper() for d in args.divs.split(",") if d.strip()]
    for d in divs:
        if ledger.get("videos", {}).get(d, {}).get("youtube", {}).get("ok") and not args.no_upload:
            print(f"=== [{d}] Already uploaded flagship longform: {ledger['videos'][d]['youtube']['url']} -> skipping ===", flush=True)
            continue
        try:
            res = produce_and_upload_division(d, upload=(not args.no_upload))
            ledger.setdefault("videos", {})[d] = res
            LEDGER_PATH.parent.mkdir(parents=True, exist_ok=True)
            LEDGER_PATH.write_text(json.dumps(ledger, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        except Exception as exc:
            print(f"=== [{d}] ERROR: {exc} ===", flush=True)
            ledger.setdefault("errors", {})[d] = str(exc)
            LEDGER_PATH.parent.mkdir(parents=True, exist_ok=True)
            LEDGER_PATH.write_text(json.dumps(ledger, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
