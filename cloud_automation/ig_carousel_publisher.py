#!/usr/bin/env python3
# -*- coding: utf-8 -*-
r"""
cloud_automation/ig_carousel_publisher.py
================================================================================
Channel 3 — Instagram 5-Slide 'Slippery-Slide' Text Carousel Publisher (3x/week)
  - Renders 5 crisp `1080x1350` editorial brand PNG slides per division using
    native CJK/English fonts (zero broken `□` glyphs on Windows & Ubuntu GHA):
      Slide 1: 0.3s Hook Big Headline (Stage 1-2 from 5x5 Matrix)
      Slide 2: StoryBrand 3-Layer Empathy (External + Internal + Philosophical)
      Slide 3: Pattern-Interrupt Verified Real-Data Comparison Table
      Slide 4: Simple 3-Step Calm Action Summary
      Slide 5: Frictionless Profile-Link Free Check / Sample / Radio CTA
  - Stages PNGs to Cloudflare R2 (`dreamcompany-reels-staging`, 24h auto-delete)
    -> Instagram Graph API (`is_carousel_item=true` x 5 -> `media_type=CAROUSEL`
    -> `media_publish`). ZERO trycloudflare tunnels, ZERO auto-comments!
================================================================================
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional, Tuple

from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

KST = dt.timezone(dt.timedelta(hours=9))
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from outbound_allowlist import (
    ALLOWED_IG_ACCOUNTS,
    OutboundAllowlistError,
    assert_allowed_ig_target,
    sanitize_and_classify_ig_token,
)
from written_promo_engine import (
    DIV_WEB_CONFIG,
    DIVISION_DEEP_DATA,
    MATRIX_PATH,
    check_written_auto_gate,
    select_article_ab_pair,
)

CAROUSEL_EITHER_OR_Q: Dict[str, str] = {
    "TOM": "💬 Quick question: When markets fall -20%, do you prefer 24 months of Treasury cash or staying 100% invested?",
    "KFG": "💬 Quick question: Does your child usually fall asleep before 9:30 PM or after 10:00 PM on school nights?",
    "GBA": "💬 ひとことアンケート：新NISAの安全資金は、銀行預金派ですか？それとも個人向け国債派ですか？",
    "HERO": "💬 어머님이 가장 그리운 계절은 봄날인가요, 가을녘인가요? 다음 백운호 신곡 주제도 댓글로 투표해 주세요!",
    "KFK": "💬 우리 아이 취침 시간은 보통 9시 반 이전인가요, 10시 이후인가요? 댓글로 한 줄 남겨주세요.",
}

CAROUSEL_BIP_NOTE: Dict[str, str] = {
    "TOM": "Behind our desk: We built our free daily SMH Fear & Greed gauge so retirees can check 7 factors in 10 seconds without watching 40 tickers.",
    "KFG": "Behind KISFIT Studio: We kept this 100% ad-free with zero supplement sponsors so parents get calm US CDC math for up to 4 siblings.",
    "GBA": "制作ノート：50〜70代の方が暴落の夜も安心して眠れるよう、毎日無料の日本語「米国半導体・恐怖と強欲指数」を公開しています。",
    "HERO": "🎤 [내가 키운 가수 · 백운호 신곡 투표] 마음을 노래하는 AI 가상 트로트 가수 백운호의 다음 노래 주제를 댓글로 골라주세요!",
    "KFK": "키즈핏 연구실 노트: 상업성 상품 광고 없이 질병관리청 공식 성장도표와 뼈나이 시차(Δt)만으로 1분 무료 진단을 만들었어요.",
}

CAROUSEL_OUT_DIR = ROOT / "data" / "carousel_renders"

PALETTES: Dict[str, Dict[str, Tuple[int, int, int]]] = {
    "TOM": {"bg": (15, 44, 34), "card": (252, 252, 250), "accent": (197, 160, 89), "ink": (17, 24, 39), "muted": (75, 85, 99)},
    "KFG": {"bg": (250, 247, 242), "card": (255, 255, 255), "accent": (27, 67, 50), "ink": (28, 35, 33), "muted": (82, 96, 90)},
    "GBA": {"bg": (15, 44, 34), "card": (252, 252, 250), "accent": (197, 160, 89), "ink": (17, 24, 39), "muted": (75, 85, 99)},
    "HERO": {"bg": (14, 40, 32), "card": (250, 247, 242), "accent": (245, 158, 11), "ink": (17, 24, 39), "muted": (55, 65, 81)},
    "KFK": {"bg": (250, 247, 242), "card": (255, 255, 255), "accent": (27, 67, 50), "ink": (28, 35, 33), "muted": (75, 85, 99)},
}


def _load_font(lang: str, size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates: List[str] = []
    if lang == "ko":
        candidates = [
            r"C:\Windows\Fonts\malgunbd.ttf" if bold else r"C:\Windows\Fonts\malgun.ttf",
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc" if bold else "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
            "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
        ]
    elif lang == "ja":
        candidates = [
            r"C:\Windows\Fonts\YuGothB.ttc" if bold else r"C:\Windows\Fonts\YuGothM.ttc",
            r"C:\Windows\Fonts\msgothic.ttc",
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc" if bold else "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        ]
    else:
        candidates = [
            r"C:\Windows\Fonts\georgiab.ttf" if bold else r"C:\Windows\Fonts\georgia.ttf",
            r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
        ]
    for p in candidates:
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, size=size)
            except Exception:
                continue
    return ImageFont.load_default()


def _wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_w: int) -> List[str]:
    lines: List[str] = []
    for para in str(text).split("\n"):
        para = para.strip()
        if not para:
            lines.append("")
            continue
        # Character-aware wrapping handles CJK + English cleanly with zero clipping
        if re.search(r"[\uac00-\ud7a3\u3040-\u30ff\u4e00-\u9fff]", para):
            cur = ""
            for ch in para:
                test = cur + ch
                # Kinsoku rule: never start a wrapped line with CJK/English closing punctuation
                if draw.textlength(test, font=font) <= max_w or (ch in "。、.,!?)」』" and cur):
                    cur = test
                else:
                    if cur:
                        lines.append(cur)
                    cur = ch
            if cur:
                lines.append(cur)
        else:
            words = para.split(" ")
            cur = ""
            for w in words:
                test = (cur + " " + w).strip()
                if draw.textlength(test, font=font) <= max_w:
                    cur = test
                else:
                    if cur:
                        lines.append(cur)
                    cur = w
            if cur:
                lines.append(cur)
    return lines


def _draw_slide_frame(div: str, lang: str, slide_num: int, eyebrow: str, title: str, body_blocks: List[str], footer_tag: str, out_path: Path, is_cover: bool = False) -> Path:
    W, H = 1080, 1350
    pal = PALETTES[div]
    bg_col = pal["bg"] if is_cover else pal["card"]
    fg_col = (255, 255, 255) if (is_cover and sum(pal["bg"]) < 380) else pal["ink"]
    sub_col = (229, 231, 235) if (is_cover and sum(pal["bg"]) < 380) else pal["muted"]
    acc_col = pal["accent"]

    img = Image.new("RGB", (W, H), bg_col)
    draw = ImageDraw.Draw(img)

    # Top accent bar & clean editorial border
    draw.rectangle([0, 0, W, 16], fill=acc_col)
    draw.rounded_rectangle([48, 48, W - 48, H - 48], radius=24, outline=acc_col, width=3)

    f_eye = _load_font(lang, 28, bold=True)
    f_title = _load_font(lang, 62 if is_cover else 48, bold=True)
    f_body = _load_font(lang, 38 if div == "HERO" else 34, bold=False)
    f_foot = _load_font(lang, 26, bold=True)

    # Eyebrow + Slide Counter Pill
    draw.text((92, 92), eyebrow, font=f_eye, fill=acc_col)
    pill_txt = f"{slide_num} / 5"
    draw.rounded_rectangle([W - 210, 82, W - 88, 134], radius=22, fill=acc_col)
    pill_fg = (17, 24, 39) if sum(acc_col) > 420 else (255, 255, 255)
    draw.text((W - 180, 92), pill_txt, font=f_eye, fill=pill_fg)

    # Title
    y = 195 if is_cover else 175
    for ln in _wrap_text(draw, title, f_title, W - 184)[:5]:
        draw.text((92, y), ln, font=f_title, fill=fg_col)
        y += (78 if is_cover else 64)

    # Divider line
    y += 18
    draw.rectangle([92, y, 240, y + 6], fill=acc_col)
    y += 38

    # Body blocks
    for blk in body_blocks:
        if y > H - 185:
            break
        for ln in _wrap_text(draw, blk, f_body, W - 184):
            if y > H - 175:
                break
            draw.text((92, y), ln, font=f_body, fill=sub_col if is_cover else fg_col)
            y += (56 if div == "HERO" else 48)
        y += 22

    # Footer brand strip
    draw.line([(92, H - 128), (W - 92, H - 128)], fill=acc_col, width=2)
    draw.text((92, H - 106), footer_tag, font=f_foot, fill=acc_col)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, format="PNG", optimize=True)
    return out_path


def render_5slide_carousel(div: str, matrix_db: Dict[str, Any], date_str: str, week_seed: int = 0) -> Dict[str, Any]:
    div_u = div.upper()
    wcfg = DIV_WEB_CONFIG[div_u]
    lang = wcfg["lang"]
    d_obj = matrix_db["divisions"][div_u]
    sb = d_obj["storybrand_7parts"]
    p3 = sb["problem_3layers"]
    deep = DIVISION_DEEP_DATA[div_u]
    arm_a, _ = select_article_ab_pair(matrix_db, div_u, week_seed=week_seed)

    hook = str(arm_a["hook_line"]).strip()
    matrix_id = str(arm_a["id"])
    utm_content = f"{matrix_id}_carousel"
    out_dir = CAROUSEL_OUT_DIR / f"{date_str}_{div_u}_{matrix_id}"

    # Validate text before rendering
    combined_txt = " ".join([hook, p3["external"], p3["internal"], p3["philosophical"], deep["table_caption"]] + deep["checklist_items"])
    ok, errs = check_written_auto_gate(div_u, hook, combined_txt, combined_txt, is_seo_article=False)
    if not ok:
        raise RuntimeError(f"Auto-Gate blocked Carousel {div_u}: {errs}")

    # Build 5 crisp slides
    slides_spec = [
        (1, True, f"{wcfg['brand']} · SAVE THIS", hook, [str(arm_a["slide_script_body"])]),
        (2, False, "WHY THIS FEELS SO HEAVY" if lang == "en" else ("多くの方が立ち止まる理由" if lang == "ja" else "마음이 유독 무거워지는 이유"),
         "The 3 Hidden Layers" if lang == "en" else ("見落としやすい3つの壁" if lang == "ja" else "놓치기 쉬운 3겹의 고민"),
         [f"1. {p3['external']}", f"2. {p3['internal']}", f"3. {p3['philosophical']}"]),
        (3, False, "VERIFIED DATA CHECK" if lang == "en" else ("過去データの比較" if lang == "ja" else "공식 실데이터 비교"),
         deep["table_caption"],
         [f"• {r[0]} → {r[1]} ({r[2]})" for r in deep["table_rows"]]),
        (4, False, "CALM 3-STEP PLAN" if lang == "en" else ("今日からの3ステップ" if lang == "ja" else "오늘 바로 실천하는 3단계"),
         deep["checklist_title"],
         [f"{i+1}. {it}" for i, it in enumerate(deep["checklist_items"])]),
        (5, True, "NEXT FREE STEP" if lang == "en" else ("無料チェックへ" if lang == "ja" else "부담 없는 무료 시작"),
         wcfg["radio_label"] if div_u == "HERO" else wcfg["diag_label"],
         [wcfg["card_label"] if div_u == "HERO" else wcfg["sample_label"], f"→ Link in Bio ({wcfg['host']})"]),
    ]

    png_paths: List[str] = []
    for num, cover, eye, ttl, blks in slides_spec:
        p = _draw_slide_frame(
            div_u, lang, num, eye, ttl, blks,
            f"{wcfg['brand']}  ·  {wcfg['host']}",
            out_dir / f"slide_{num:02d}.png",
            is_cover=cover,
        )
        png_paths.append(str(p))

    bip_note = CAROUSEL_BIP_NOTE.get(div_u, "")
    q_line = CAROUSEL_EITHER_OR_Q.get(div_u, "")
    # 30% Build-in-Public mix (triggered cleanly on week_seed % 3 == 0 or HERO)
    include_bip = (div_u == "HERO") or (week_seed % 3 == 0)
    parts = [hook, arm_a["slide_script_body"]]
    if include_bip and bip_note:
        parts.append(bip_note)
    parts.append(f"→ {wcfg['host']} (Link in bio · {utm_content})")
    if q_line:
        parts.append(q_line)
    caption = "\n\n".join(parts)
    return {
        "ok": True,
        "division": div_u,
        "matrix_id": matrix_id,
        "utm_content": utm_content,
        "slides": png_paths,
        "caption": caption,
        "build_in_public_included": include_bip,
    }


def stage_png_to_r2_24h(png_path: Path, ascii_key: str) -> Optional[str]:
    acct = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
    tok = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
    bucket = os.getenv("R2_BUCKET_NAME", "dreamcompany-reels-staging").strip()
    pub_base = os.getenv("R2_PUBLIC_BASE", "https://pub-c1592ad8d860431c9bf3d4dd12c228ef.r2.dev").rstrip("/")
    if not (acct and tok and png_path.exists()):
        return None
    safe_key = re.sub(r"[^A-Za-z0-9._/-]", "_", ascii_key)
    api_url = f"https://api.cloudflare.com/client/v4/accounts/{acct}/r2/buckets/{bucket}/objects/{safe_key}"
    req = urllib.request.Request(
        api_url,
        data=png_path.read_bytes(),
        method="PUT",
        headers={"Authorization": f"Bearer {tok}", "Content-Type": "image/png"},
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            if r.status in (200, 201):
                return f"{pub_base}/{safe_key}"
    except Exception:
        return None
    return None


def publish_ig_carousel(div: str, png_paths: List[str], caption: str, date_str: str, dry_run: bool = False) -> Dict[str, Any]:
    raw_tok = os.getenv(f"IG_ACCESS_TOKEN_{div}", "")
    ig_uid = (os.getenv(f"IG_USER_ID_{div}", "") or ALLOWED_IG_ACCOUNTS.get(div, {}).get("ig_user_id", "")).strip()
    try:
        ig_uid = assert_allowed_ig_target(div, ig_uid)
    except OutboundAllowlistError as oe:
        return {"ok": False, "blocked_by_allowlist": str(oe)}
    if dry_run:
        return {"ok": True, "status": "dry_run_rendered_5_slides", "slide_count": len(png_paths), "allowlisted_uid": ig_uid}
    tinfo = sanitize_and_classify_ig_token(raw_tok)
    if not tinfo["ok"]:
        return {"ok": True, "status": f"rendered_awaiting_valid_ig_token:{tinfo['reason']}", "slide_count": len(png_paths)}
    ig_tok = str(tinfo["token"])

    child_ids: List[str] = []
    for idx, p_str in enumerate(png_paths, start=1):
        img_url = stage_png_to_r2_24h(Path(p_str), f"carousel/{date_str}/{div.lower()}_s{idx}.png")
        if not img_url:
            return {"ok": False, "error": f"r2_stage_failed_slide_{idx}"}
        qs = urllib.parse.urlencode({"image_url": img_url, "is_carousel_item": "true", "access_token": ig_tok}).encode("utf-8")
        try:
            with urllib.request.urlopen(urllib.request.Request(f"https://graph.facebook.com/v21.0/{ig_uid}/media", data=qs, method="POST"), timeout=30) as r:
                cid = json.loads(r.read().decode("utf-8")).get("id")
                if cid:
                    child_ids.append(cid)
        except urllib.error.HTTPError as e:
            return {"ok": False, "http_error": e.code, "body": e.read().decode("utf-8", errors="replace")[:200]}

    if len(child_ids) != len(png_paths):
        return {"ok": False, "error": "incomplete_carousel_children"}

    # Parent CAROUSEL container + publish (ZERO auto-comments!)
    p_qs = urllib.parse.urlencode({
        "media_type": "CAROUSEL",
        "children": ",".join(child_ids),
        "caption": caption,
        "access_token": ig_tok,
    }).encode("utf-8")
    try:
        with urllib.request.urlopen(urllib.request.Request(f"https://graph.facebook.com/v21.0/{ig_uid}/media", data=p_qs, method="POST"), timeout=30) as r:
            parent_id = json.loads(r.read().decode("utf-8")).get("id")
        time.sleep(5)
        pub_qs = urllib.parse.urlencode({"creation_id": parent_id, "access_token": ig_tok}).encode("utf-8")
        with urllib.request.urlopen(urllib.request.Request(f"https://graph.facebook.com/v21.0/{ig_uid}/media_publish", data=pub_qs, method="POST"), timeout=30) as pr:
            mid = json.loads(pr.read().decode("utf-8")).get("id")
        return {"ok": True, "status": "published_carousel_live", "media_id": mid, "children": len(child_ids)}
    except urllib.error.HTTPError as e:
        return {"ok": False, "http_error": e.code, "body": e.read().decode("utf-8", errors="replace")[:200]}


def main() -> int:
    parser = argparse.ArgumentParser(description="Channel 3: Instagram 5-Slide Slippery-Slide Text Carousel Publisher")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--date", type=str, default="")
    args = parser.parse_args()

    today = args.date or dt.datetime.now(KST).strftime("%Y-%m-%d")
    week_seed = dt.datetime.now(KST).isocalendar().week
    matrix_db = json.loads(MATRIX_PATH.read_text(encoding="utf-8"))

    summary = []
    for div in ("TOM", "KFG", "GBA", "HERO", "KFK"):
        res = render_5slide_carousel(div, matrix_db, today, week_seed=week_seed)
        res["publish"] = publish_ig_carousel(div, res["slides"], res["caption"], today, dry_run=args.dry_run)
        summary.append({"division": div, "matrix_id": res["matrix_id"], "slides": len(res["slides"]), "first_png": res["slides"][0], "publish": res["publish"]})

    print(json.dumps({"ok": True, "date": today, "carousels": summary}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
