#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/real_ui_mobile_recorder.py
================================================================================
Dream Company — Playwright Mobile (390x844 @2x, 30fps) Real-UI & Motion Chart
Screen Recorder + Fail-Closed Blank-Page Auto-Gate (`<main> > 200 chars` &
target interactive widget `visible` required BEFORE any recording/upload!).

Also supports `16:9` (1920x1080, 30fps) Flagship Long-Form Walkthrough recording
for 1/2/3/5 divisions (actual free calculator / SMH Fear & Greed gauge +
real 2-page Sample PDF preview scroll).
================================================================================
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

if sys.platform == "win32":
    try:
        import ctypes
        ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x00004000)
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent


class RealUIAutoGateError(RuntimeError):
    """Raised Fail-Closed when target web UI renders blank (<200 chars) or key widget is missing."""


DIV_REAL_UI_SPEC: Dict[str, Dict[str, Any]] = {
    "TOM": {
        "primary_url": "https://truthofmarket.com/smh-fear-greed",
        "secondary_url": "https://truthofmarket.com/",
        "sample_pdf_local": ROOT / "1사업부" / "assets" / "downloads" / "tom_sample_2p.pdf",
        "widget_selectors": ["canvas", "svg", "button", "a[href*='truthofmarket']", "main section"],
        "accent": "#C5A059",
        "bg": "#0F1E18",
        "chart_title": "2000-2025 Historical Crisis Recovery",
        "chart_sub": "Months to Recover Peak · Public ETF Data",
        "chart_bars": [
            ("SMH x XLV + SGOV", 17, "17 mo", "#C5A059"),
            ("Classic 60/40", 36, "36 mo", "#64748B"),
            ("100% Tech Alone", 62, "62 mo", "#94A3B8"),
        ],
        "go_label": "truthofmarket.com/go/yt",
    },
    "KFG": {
        "primary_url": "https://kisfitglobal.com/",
        "secondary_url": "https://kisfitglobal.com/",
        "sample_pdf_local": ROOT / "2사업부" / "assets" / "downloads" / "kfg_sample_2p.pdf",
        "widget_selectors": ["button", "input", "main section", "a"],
        "accent": "#1B4332",
        "bg": "#FAF7F2",
        "chart_title": "US CDC 2000 School-Age Pace",
        "chart_sub": "Normal Pre-Puberty Velocity (Ages 4-10)",
        "chart_bars": [
            ("Target CDC Pace", 82, "2.2 in/yr", "#1B4332"),
            ("Late Bedtime Drift", 54, "1.6 in/yr", "#B45309"),
            ("Parent Avg Error", 96, "+/- 3.5 in", "#9CA3AF"),
        ],
        "go_label": "kisfitglobal.com/go/yt",
    },
    "GBA": {
        "primary_url": "https://getbreakai.com/jp/smh-fear-greed",
        "secondary_url": "https://getbreakai.com/jp/",
        "sample_pdf_local": ROOT / "3사업부" / "jp" / "downloads" / "gba_jp_sample_2p.pdf",
        "widget_selectors": ["canvas", "svg", "button", "main section"],
        "accent": "#C5A059",
        "bg": "#0F1E18",
        "chart_title": "新NISA 1,800万円 枠と回復比較",
        "chart_sub": "2000〜2025年 過去統計（教育参考）",
        "chart_bars": [
            ("SMH×XLV＋国債", 28, "約17ヶ月", "#C5A059"),
            ("従来の60/40", 58, "約36ヶ月", "#64748B"),
            ("米国ハイテク単独", 94, "60ヶ月超", "#94A3B8"),
        ],
        "go_label": "getbreakai.com/go/yt",
    },
    "KFK": {
        "primary_url": "https://kidsfit.co.kr/",
        "secondary_url": "https://kidsfit.co.kr/",
        "sample_pdf_local": ROOT / "5사업부" / "assets" / "downloads" / "kfk_sample_2p.pdf",
        "widget_selectors": ["button", "input", "main section", "a"],
        "accent": "#1B4332",
        "bg": "#FAF7F2",
        "chart_title": "질병관리청 초등 연간 성장속도",
        "chart_sub": "만 6~11세 표준 기준 (광고 0건)",
        "chart_bars": [
            ("정상 성장 기준", 78, "연 5~6cm", "#1B4332"),
            ("둔화 점검 신호", 48, "4cm 미만", "#B45309"),
            ("뼈나이 미보정 오차", 92, "최대 ±4cm", "#9CA3AF"),
        ],
        "go_label": "kidsfit.co.kr/go/yt",
    },
}


def _get_ffmpeg() -> str:
    ff = shutil.which("ffmpeg")
    if ff:
        return ff
    try:
        import imageio_ffmpeg  # type: ignore
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception as exc:
        raise RuntimeError(f"ffmpeg not available: {exc}")


def _transcode_webm_to_mp4(webm_path: Path, out_mp4: Path, width: int, height: int, fps: int = 30, max_sec: float = 16.0, trim_start_sec: float = 0.0) -> Path:
    ffmpeg = _get_ffmpeg()
    out_mp4.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        ffmpeg, "-y", "-threads", "2",
        *(["-ss", f"{trim_start_sec:.2f}"] if trim_start_sec > 0.1 else []),
        "-i", str(webm_path),
        "-t", f"{max_sec:.2f}",
        "-vf", f"scale={width}:{height}:flags=lanczos:force_original_aspect_ratio=increase,crop={width}:{height},fps={fps},format=yuv420p",
        "-an",
        "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-movflags", "+faststart",
        str(out_mp4),
    ]
    r = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, timeout=180)
    if r.returncode != 0 or not out_mp4.exists() or out_mp4.stat().st_size < 15_000:
        raise RuntimeError(f"FFmpeg transcode failed: {r.stderr[-240:]}")
    return out_mp4


def _assert_real_ui_auto_gate(page: Any, div: str, url: str) -> Dict[str, Any]:
    """Fail-Closed Auto-Gate: <main> text > 200 chars AND target widget visible."""
    info = page.evaluate("""() => {
        const m = document.querySelector('main');
        const mainText = m ? m.innerText.trim() : '';
        const bodyText = document.body ? document.body.innerText.trim() : '';
        const effectiveLen = mainText.length > 0 ? mainText.length : bodyText.length;
        return {
            hasMain: !!m,
            mainLen: mainText.length,
            bodyLen: bodyText.length,
            effectiveLen: effectiveLen,
            title: document.title || ''
        };
    }""")
    if info["effectiveLen"] <= 200:
        raise RealUIAutoGateError(
            f"[AUTO-GATE BLOCKED] {div} ({url}) blank/thin DOM: mainLen={info['mainLen']} bodyLen={info['bodyLen']} (<=200)"
        )
    spec = DIV_REAL_UI_SPEC[div.upper()]
    widget_ok = False
    matched_sel = ""
    for sel in spec["widget_selectors"]:
        try:
            loc = page.locator(sel).first
            if loc.count() > 0 and loc.is_visible(timeout=2000):
                widget_ok = True
                matched_sel = sel
                break
        except Exception:
            continue
    if not widget_ok:
        raise RealUIAutoGateError(
            f"[AUTO-GATE BLOCKED] {div} ({url}) target widget not visible (checked {spec['widget_selectors']})"
        )
    info["matched_widget"] = matched_sel
    return info


def record_mobile_real_ui_clip(
    div: str,
    out_mp4: Path,
    duration_sec: float = 11.0,
) -> Tuple[Path, Dict[str, Any]]:
    """
    Records live mobile vertical UI (390x844, deviceScaleFactor=2, 30fps -> 1080x1920)
    with smooth human-paced scroll & real widget interaction.
    Aborts Fail-Closed via `RealUIAutoGateError` if `<main> <= 200 chars` or widget hidden.
    """
    from playwright.sync_api import sync_playwright

    div_u = div.upper()
    spec = DIV_REAL_UI_SPEC[div_u]
    url = spec["primary_url"]

    with tempfile.TemporaryDirectory(prefix=f"dc_ui_{div_u}_") as tmp:
        tmp_dir = Path(tmp)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            t_ctx0 = time.monotonic()
            ctx = browser.new_context(
                viewport={"width": 390, "height": 844},
                device_scale_factor=2,
                record_video_dir=str(tmp_dir),
                record_video_size={"width": 390, "height": 844},
                locale="ja-JP" if div_u == "GBA" else ("ko-KR" if div_u == "KFK" else "en-US"),
            )
            page = ctx.new_page()
            page.goto(url, wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(1200)
            gate_info = _assert_real_ui_auto_gate(page, div_u, url)
            # Mark exact post-load timestamp so initial blank loading frames are cleanly trimmed!
            t_ready = max(0.0, time.monotonic() - t_ctx0 - 0.1)

            # Perform realistic mobile walkthrough: gentle scroll -> inspect gauge/start CTA -> scroll table
            page.wait_for_timeout(1600)
            for y_target in (320, 680, 1080, 1450):
                page.evaluate(f"window.scrollTo({{top: {y_target}, behavior: 'smooth'}});")
                page.wait_for_timeout(1900)

            # Try clicking primary non-destructive start/step button if on KFG/KFK
            if div_u in ("KFG", "KFK"):
                try:
                    btn = page.locator("main button").first
                    if btn.count() > 0 and btn.is_visible(timeout=1500):
                        btn.scroll_into_view_if_needed()
                        page.wait_for_timeout(600)
                        btn.click(timeout=2000)
                        page.wait_for_timeout(2200)
                except Exception:
                    pass
            else:
                page.evaluate("window.scrollTo({top: 180, behavior: 'smooth'});")
                page.wait_for_timeout(1800)

            video = page.video
            ctx.close()
            browser.close()
            webm_path = Path(video.path())
            _transcode_webm_to_mp4(webm_path, out_mp4, width=1080, height=1920, fps=30, max_sec=duration_sec, trim_start_sec=t_ready)
    return out_mp4, gate_info


def record_html_motion_chart_clip(
    div: str,
    out_mp4: Path,
    aspect: str = "9:16",
    duration_sec: float = 4.5,
) -> Path:
    """
    Renders a crisp, animated HTML/CSS data chart (zero AI text distortion!)
    at 390x844 @2x (9:16) or 1280x720 (16:9), 30fps.
    """
    from playwright.sync_api import sync_playwright

    div_u = div.upper()
    spec = DIV_REAL_UI_SPEC[div_u]
    is_dark = spec["bg"].startswith("#0")
    ink = "#F8FAFC" if is_dark else "#1C2321"
    muted = "#94A3B8" if is_dark else "#52605A"
    card_bg = "rgba(255,255,255,0.06)" if is_dark else "#FFFFFF"
    card_border = "rgba(197,160,89,0.32)" if is_dark else "#E5E0D5"

    bars_html = ""
    for idx, (label, pct, val_txt, col) in enumerate(spec["chart_bars"]):
        delay = 0.25 + idx * 0.35
        bars_html += f"""
        <div class="bar-row">
          <div class="bar-meta"><span>{label}</span><strong style="color:{col}">{val_txt}</strong></div>
          <div class="bar-track"><div class="bar-fill" style="--w:{pct}%;--c:{col};animation-delay:{delay:.2f}s"></div></div>
        </div>
        """

    is_vert = aspect == "9:16"
    vp_w, vp_h = (390, 844) if is_vert else (1280, 720)
    rec_w, rec_h = (390, 844) if is_vert else (1280, 720)
    out_w, out_h = (1080, 1920) if is_vert else (1920, 1080)

    html = f"""<!doctype html>
<html><head><meta charset="utf-8"><style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    width: {vp_w}px; height: {vp_h}px; background: {spec['bg']}; color: {ink};
    font-family: 'Malgun Gothic', 'Hiragino Sans', 'Segoe UI', system-ui, sans-serif;
    display: flex; align-items: center; justify-content: center; padding: {24 if is_vert else 56}px;
  }}
  .card {{
    width: 100%; max-width: {350 if is_vert else 960}px;
    background: {card_bg}; border: 1.5px solid {card_border}; border-radius: 20px;
    padding: {26 if is_vert else 42}px; box-shadow: 0 18px 48px rgba(0,0,0,0.16);
  }}
  .eyebrow {{ font-size: {12 if is_vert else 18}px; font-weight: 700; letter-spacing: 0.08em; color: {spec['accent']}; text-transform: uppercase; margin-bottom: 10px; }}
  h1 {{ font-size: {22 if is_vert else 38}px; line-height: 1.28; margin-bottom: 8px; }}
  .sub {{ font-size: {13 if is_vert else 20}px; color: {muted}; margin-bottom: {24 if is_vert else 36}px; }}
  .bar-row {{ margin-bottom: {20 if is_vert else 28}px; }}
  .bar-meta {{ display: flex; justify-content: space-between; font-size: {14 if is_vert else 22}px; margin-bottom: 8px; }}
  .bar-track {{ height: {16 if is_vert else 26}px; background: {'rgba(255,255,255,0.10)' if is_dark else '#ECE7DC'}; border-radius: 99px; overflow: hidden; }}
  .bar-fill {{
    height: 100%; width: 0; background: var(--c); border-radius: 99px;
    animation: grow 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }}
  @keyframes grow {{ from {{ width: 0; }} to {{ width: var(--w); }} }}
  .footer {{
    margin-top: {22 if is_vert else 30}px; padding-top: 14px; border-top: 1px solid {card_border};
    font-size: {13 if is_vert else 20}px; font-weight: 700; color: {spec['accent']};
    display: flex; justify-content: space-between;
  }}
</style></head>
<body>
  <main class="card">
    <div class="eyebrow">PUBLIC DATA BENCHMARK</div>
    <h1>{spec['chart_title']}</h1>
    <p class="sub">{spec['chart_sub']}</p>
    {bars_html}
    <div class="footer"><span>{spec['go_label']}</span><span>FREE GUIDE</span></div>
  </main>
</body></html>"""

    with tempfile.TemporaryDirectory(prefix=f"dc_chart_{div_u}_") as tmp:
        tmp_dir = Path(tmp)
        html_path = tmp_dir / "chart.html"
        html_path.write_text(html, encoding="utf-8")
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            t_ctx0 = time.monotonic()
            ctx = browser.new_context(
                viewport={"width": vp_w, "height": vp_h},
                device_scale_factor=2 if is_vert else 1,
                record_video_dir=str(tmp_dir),
                record_video_size={"width": rec_w, "height": rec_h},
            )
            page = ctx.new_page()
            page.goto(html_path.as_uri(), wait_until="load", timeout=15000)
            page.wait_for_timeout(350)
            # Trim Chromium initial `about:blank` white frames before HTML chart painted!
            t_ready = max(0.35, time.monotonic() - t_ctx0)
            page.wait_for_timeout(int((duration_sec + 0.6) * 1000))
            video = page.video
            ctx.close()
            browser.close()
            _transcode_webm_to_mp4(Path(video.path()), out_mp4, width=out_w, height=out_h, fps=30, max_sec=duration_sec, trim_start_sec=t_ready)
    return out_mp4


def record_longform_16x9_walkthrough(
    div: str,
    out_mp4: Path,
    target_sec: float = 38.0,
    url_override: str = "",
) -> Tuple[Path, Dict[str, Any]]:
    """
    Records a clean, calm 16:9 (1920x1080, 30fps) desktop real-UI screen walkthrough
    for the flagship 2~3 minute Long-Form video (checking `<main> > 200 chars` Auto-Gate!).
    """
    from playwright.sync_api import sync_playwright

    div_u = div.upper()
    spec = DIV_REAL_UI_SPEC[div_u]
    url = url_override or spec["primary_url"]

    with tempfile.TemporaryDirectory(prefix=f"dc_lf_{div_u}_") as tmp:
        tmp_dir = Path(tmp)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            t_ctx0 = time.monotonic()
            ctx = browser.new_context(
                viewport={"width": 1280, "height": 720},
                device_scale_factor=1,
                record_video_dir=str(tmp_dir),
                record_video_size={"width": 1280, "height": 720},
                locale="ja-JP" if div_u == "GBA" else ("ko-KR" if div_u == "KFK" else "en-US"),
            )
            page = ctx.new_page()
            page.goto(url, wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(1200)
            gate_info = _assert_real_ui_auto_gate(page, div_u, url)
            t_ready = max(0.0, time.monotonic() - t_ctx0 - 0.1)

            # Smooth deliberate walkthrough matching long-form pacing
            page.wait_for_timeout(2500)
            scroll_steps = [260, 560, 920, 1280, 1650, 900, 300, 0]
            per_step_ms = max(1800, int(((target_sec - 4.0) * 1000) / (len(scroll_steps) + 2)))
            for sy in scroll_steps:
                page.evaluate(f"window.scrollTo({{top: {sy}, behavior: 'smooth'}});")
                page.wait_for_timeout(per_step_ms)

            # Interactive step preview on KFG / KFK / TOM / GBA if button visible
            try:
                btn = page.locator("main button").first
                if btn.count() > 0 and btn.is_visible(timeout=1500):
                    btn.scroll_into_view_if_needed()
                    page.wait_for_timeout(800)
                    btn.click(timeout=2000)
                    page.wait_for_timeout(per_step_ms)
            except Exception:
                pass

            video = page.video
            ctx.close()
            browser.close()
            _transcode_webm_to_mp4(Path(video.path()), out_mp4, width=1920, height=1080, fps=30, max_sec=target_sec, trim_start_sec=t_ready)
    return out_mp4, gate_info


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--div", default="KFG")
    ap.add_argument("--out", default=str(ROOT / "cloud_automation" / ".cache" / "smoke_real_ui.mp4"))
    args = ap.parse_args()
    p_out, info = record_mobile_real_ui_clip(args.div, Path(args.out), duration_sec=8.0)
    print(json.dumps({"ok": True, "div": args.div, "mp4": str(p_out), "bytes": p_out.stat().st_size, "gate": info}, ensure_ascii=False))
