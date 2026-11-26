#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cloud_automation/promo_hard_gate.py
================================================================================
Dream Company — 2026-11-25 Zero-Manual Promo Breakthrough Shared Hard Gate
Enforces Fail-Closed (`AI 티 0%` & `자동화 티 0%`) across ALL video, SEO,
YouTube, and Instagram pipelines:

1. KO / EN / JA AI-Cliché + Polar/Whop/Legal Banned Regex Auto-Gate (0 hits required)
2. Bot-Tag / Long-UTM Leak Ban (`_SLOT_A`, `_v1`, `utm_source=` forbidden in social copy & SRT)
3. Clean Short `/go/yt` & `/go/ig` Redirect URL Generator (zero bot query strings)
4. YouTube Data API v3 `status.publishAt` Golden-Time Random Jitter (±17~43m, sleep 0s!)
5. 20-Pattern Rotating Conversational Comment Questions per Division (5 x 20 = 100)
6. 1-Line 10~14 Char Subtitle Cue Splitter + Brand Accent Highlight Selector + True SRT Builder
7. Explicit Out-of-Scope Enforcement (No Pinterest API, No Naver bots, No unsupported YT API fields)
================================================================================
"""

from __future__ import annotations

import datetime as dt
import hashlib
import html as _html_lib
import random
import re
from typing import Any, Dict, List, Optional, Tuple

KST = dt.timezone(dt.timedelta(hours=9))
UTC = dt.timezone.utc

# Explicit Out-of-Scope Guardrail Flags (docs/HQ_5DIV_PROMO_BREAKTHROUGH_20261125.md)
PINTEREST_API_ENABLED = False
NAVER_MANUAL_AND_BOT_FROZEN = True
X_PAID_API_FORBIDDEN = True
GHA_SLEEP_JITTER_FORBIDDEN = True
YT_UNSUPPORTED_API_FIELDS = ("containsSyntheticMedia", "relatedVideo", "related_video")

# Clean Short Redirect Endpoints (/go/yt, /go/yt-fg, /go/yt-sample, /go/ig)
DIV_GO_LINKS: Dict[str, Dict[str, str]] = {
    "TOM": {
        "host": "truthofmarket.com",
        "yt": "https://truthofmarket.com/go/yt",
        "yt_fg": "https://truthofmarket.com/go/yt-fg",
        "yt_sample": "https://truthofmarket.com/go/yt-sample",
        "ig": "https://truthofmarket.com/go/ig",
    },
    "KFG": {
        "host": "kisfitglobal.com",
        "yt": "https://kisfitglobal.com/go/yt",
        "yt_sample": "https://kisfitglobal.com/go/yt-sample",
        "ig": "https://kisfitglobal.com/go/ig",
    },
    "GBA": {
        "host": "getbreakai.com",
        "yt": "https://getbreakai.com/go/yt",
        "yt_fg": "https://getbreakai.com/go/yt-fg",
        "yt_sample": "https://getbreakai.com/go/yt-sample",
        "ig": "https://getbreakai.com/go/ig",
    },
    "HERO": {
        "host": "paradise-hero.com",
        "yt": "https://paradise-hero.com/go/yt",
        "yt_card": "https://paradise-hero.com/go/yt-card",
        "ig": "https://paradise-hero.com/go/ig",
    },
    "KFK": {
        "host": "kidsfit.co.kr",
        "yt": "https://kidsfit.co.kr/go/yt",
        "yt_sample": "https://kidsfit.co.kr/go/yt-sample",
        "ig": "https://kidsfit.co.kr/go/ig",
    },
}

DIV_FORBIDDEN_DOMAINS: Dict[str, Tuple[str, ...]] = {
    "TOM": ("kisfitglobal.com", "getbreakai.com", "paradise-hero.com", "kidsfit.co.kr"),
    "KFG": ("truthofmarket.com", "getbreakai.com", "paradise-hero.com", "kidsfit.co.kr", "iherb.com", "amazon.com"),
    "GBA": ("truthofmarket.com", "kisfitglobal.com", "paradise-hero.com", "kidsfit.co.kr"),
    "HERO": ("truthofmarket.com", "kisfitglobal.com", "getbreakai.com", "kidsfit.co.kr"),
    "KFK": ("truthofmarket.com", "kisfitglobal.com", "getbreakai.com", "paradise-hero.com", "coupang.com", "cshop.naver.com"),
}

# Brand accent RGB colors for 1~2 highlighted keywords inside 1-line subtitles
DIV_ACCENT_RGB: Dict[str, Tuple[int, int, int]] = {
    "TOM": (245, 208, 110),   # Private-wealth champagne gold
    "KFG": (110, 231, 183),   # Calm sage emerald
    "GBA": (245, 208, 110),   # NISA warm gold
    "HERO": (255, 226, 118),  # Warm senior gold
    "KFK": (110, 231, 183),   # Warm studio mint-emerald
}

# 1. AI Clichés (KO / EN / JA) — Fail-Closed Regex Patterns
AI_CLICHE_REGEXES: Tuple[Tuple[str, str], ...] = (
    # Korean
    ("ko_about_to_explore", r"에\s*대해\s*알아보겠습니다|알아보겠습니다"),
    ("ko_in_conclusion", r"결론적으로"),
    ("ko_very_important", r"매우\s*중요합니다"),
    ("ko_key_points_are", r"핵심은\s*다음과\s*같습니다"),
    ("ko_stiff_honorific", r"하십니다"),
    ("ko_summary_cliche", r"총정리|란\s*무엇인가"),
    # English
    ("en_fast_paced_world", r"in\s+today['’]?s\s+fast[- ]paced\s+world"),
    ("en_delve", r"\bdelve(?:s|d|ing)?\b"),
    ("en_nuanced", r"\bnuanced\b"),
    ("en_unlock", r"\bunlock(?:ing|ed|s)?\b"),
    ("en_game_changer", r"\bgame[- ]changer\b"),
    ("en_tapestry", r"\btapestry\b"),
    ("en_embark", r"\bembark(?:s|ed|ing)?\b"),
    ("en_navigating", r"\bnavigating\b"),
    ("en_crucial", r"\bcrucial\b"),
    ("en_comprehensive_guide", r"\bcomprehensive\s+guide\b"),
    # Japanese
    ("ja_very_important", r"することが非常に重要です"),
    ("ja_in_conclusion", r"結論として"),
    ("ja_how_was_it", r"いかがでしたでしょうか"),
    ("ja_thorough_explain", r"徹底解説"),
    ("ja_us_stock_quant", r"米国株クオンツ|クオンツ"),
)

# 1b. AI Slop Structural Tells (Standing Directive #35 — Context Hub & Binary Eval)
AI_SLOP_STRUCTURE_REGEXES: Tuple[Tuple[str, str, int], ...] = (
    ("ko_not_just_but", r"(?:단지|단순히|단순한)\s+[^.!?\n]{1,45}?(?:이|가|을|를|은|는|만)?\s*아니라", 0),
    ("en_not_just_but", r"\b(?:not\s+just|more\s+than\s+just)\s+[^.!?\n]{1,45}?,?\s+but\b", re.IGNORECASE),
    ("ja_not_just_but", r"単なる[^。！？\n]{1,35}?ではなく", 0),
    ("ko_mechanical_triad", r"첫째[\s,:].{1,250}둘째[\s,:].{1,250}셋째[\s,:]", re.DOTALL),
)

# 2. Global + Division Banned Terms (Polar / Whop / Legal / Brand Guardrails)
GLOBAL_BANNED_REGEXES: Tuple[Tuple[str, str], ...] = (
    ("lemonsqueezy", r"lemonsqueezy"),
    ("trycloudflare", r"trycloudflare\.com"),
    ("tofu_char", r"□"),
    ("double_nim", r"님님"),
)

DIV_BANNED_REGEXES: Dict[str, Tuple[Tuple[str, str], ...]] = {
    "TOM": (
        ("buy_sell_signal", r"\b(buy|sell)\s+(signal|now|today|alert)\b|best\s+etf\s+to\s+buy\s+now"),
        ("usdkrw", r"\busdkrw\b"),
        ("guaranteed_return", r"guaranteed\s+return"),
        ("legacy_tickers", r"\b(SOXL|TQQQ|SQQQ|NVDA|SCHD|JEPI|VOO)\b"),
        ("one_to_one", r"\b1:1\b"),
    ),
    "KFG": (
        ("polar_medical", r"\b(clinical|diagnosis|diagnose|prescription|prescribe|disease|disorder|cure)\b"),
        ("polar_1to1", r"\b1:1\b"),
        ("legacy_brand", r"brain\s*lq|bio\s*labs|#kfg-bone-age-interpreter"),
        ("growth_hormone_claim", r"\bgrowth\s+hormone\b"),
        ("affiliates", r"\b(iherb|amazon)\b"),
    ),
    "GBA": (
        ("jp_trade_timing", r"買い時|売り時|おすすめ銘柄|買いシグナル|売りシグナル|売買タイミング"),
        ("jp_telegram", r"t\.me|telegram"),
        ("jp_legacy_assets", r"オルカン|1489|\bVYM\b|\bSOXL\b|\bTQQQ\b"),
        ("one_to_one", r"\b1:1\b"),
    ),
    "HERO": (
        ("real_singers", r"황영웅|임영웅|나훈아|영탁|이찬원|김호중|장민호|정동원|박서진"),
        ("paid_pg_on_hero", r"whop\.com|buy\.polar\.sh|latpeed\.com|골드\s*VIP"),
    ),
    "KFK": (
        ("kfk_legacy_banned", r"두뇌발달|K-DST|하브루타|숨은\s*키\s*\+?\s*7cm|진단/처방"),
        ("kfk_1to1", r"\b1:1\b"),
        ("kfk_sales_hype", r"최저가|할인율|특가|폭탄세일"),
        ("kfk_affiliates", r"쿠팡|네이버페이|쇼핑커넥트|링크프라이스|아이클타임|칼마디|락토바이오"),
    ),
}

# 3. Bot-Tag & Long-UTM Leak Patterns (Forbidden on social copy & SRT)
BOT_TAG_LEAK_REGEXES: Tuple[Tuple[str, str], ...] = (
    ("slot_bot_tag", r"_SLOT_[ABC]\b"),
    ("variant_bot_tag", r"_[vV][12AB]\b"),
    ("date_slot_title_tag", r"[\(\【]\s*\d{1,2}[./]\d{1,2}\s*[#・]?\s*[ABC]\s*[\)\】]"),
    ("exposed_utm_query", r"utm_(?:source|medium|campaign|content)="),
)

_EMOJI_RE = re.compile(
    "["
    "\U0001F300-\U0001FAFF"
    "\U00002600-\U000027BF"
    "]",
    flags=re.UNICODE,
)


_HTML_BLOCK_DETECT_RE = re.compile(
    r"</(?:p|div|html|body|td|th|li|span|h[1-6]|section|article|main|aside|footer|header)>",
    re.IGNORECASE,
)
_HTML_TOKEN_SPLIT_RE = re.compile(
    r"(<(?:script|style|noscript|svg)[^>]*>.*?</(?:script|style|noscript|svg)>|<[^>]+>)",
    re.IGNORECASE | re.DOTALL,
)


def _strip_html_for_slop_check(raw: str, is_html: Optional[bool] = None) -> str:
    txt = str(raw or "")
    treat_as_html = bool(is_html) if is_html is not None else bool(_HTML_BLOCK_DETECT_RE.search(txt))
    if treat_as_html:
        txt = re.sub(r"<(script|style|noscript|svg)[^>]*>.*?</\1>", " ", txt, flags=re.IGNORECASE | re.DOTALL)
        txt = re.sub(r"<[^>]+>", " ", txt)
        txt = _html_lib.unescape(txt)
    return re.sub(r"\s+", " ", txt).strip()


def check_ai_slop_gate(
    text: str,
    max_em_dashes: int = 2,
    is_html: Optional[bool] = None,
) -> Tuple[bool, List[str]]:
    """
    Fail-Closed AI Slop Gate (Standing Directive #35, aligned with verify_binary_eval_gate.py --slop):
      - Em-dash (`—`) count > `max_em_dashes` (default 2) -> FAIL
      - Pretentious contrast (`단지/단순히/단순한 ... 아니라`, `not just ... but`, `単なる...ではなく`) -> FAIL
      - Mechanical Korean 3-part triad (`첫째... 둘째... 셋째...`) -> FAIL
      - KO / EN / JA AI buzzwords & clichés (`delve`, `nuanced`, `unlock`, `game-changer`, `tapestry`, `embark`, etc.) -> FAIL
    """
    plain = _strip_html_for_slop_check(text, is_html=is_html)
    errors: List[str] = []
    if not plain:
        return True, []

    em_count = plain.count("—")
    if em_count > max_em_dashes:
        errors.append(f"ai_slop:em_dash_overuse({em_count}>{max_em_dashes})")

    for code, pat, flags in AI_SLOP_STRUCTURE_REGEXES:
        if re.search(pat, plain, flags=flags):
            errors.append(f"ai_slop:{code}")

    for code, pat in AI_CLICHE_REGEXES:
        if re.search(pat, plain, flags=re.IGNORECASE):
            errors.append(f"ai_cliche:{code}")

    return len(errors) == 0, errors


def _preserve_case_replace(match_text: str, replacement: str) -> str:
    if not match_text:
        return replacement
    if match_text.isupper():
        return replacement.upper()
    if match_text[0].isupper():
        return replacement[0].upper() + replacement[1:]
    return replacement


def _scrub_plain_slop_phrases(segment: str, lang: str, applied: List[str]) -> str:
    s = segment
    if not s:
        return s

    # Normalize HTML em-dash entities inside text nodes so counts match rendered DOM
    if "&mdash;" in s or "&#8212;" in s:
        s = s.replace("&mdash;", "—").replace("&#8212;", "—")

    # 1. Pretentious contrast patterns (KO / EN / JA)
    def _ko_contrast(m: re.Match[str]) -> str:
        applied.append("ko_not_just_but")
        core = re.sub(r"(?:뿐만|이|가|을|를|은|는|만)+$", "", m.group(1).strip()).strip()
        return f"{core}을 넘어 " if core else ""

    s = re.sub(
        r"(?:단지|단순히|단순한)\s+([^.!?\n]{1,45}?)(?:이|가|을|를|은|는|만)?\s*아니라\s*,?\s*",
        _ko_contrast,
        s,
    )

    def _en_contrast(m: re.Match[str]) -> str:
        applied.append("en_not_just_but")
        core = m.group(1).strip().rstrip(",")
        lead = _preserve_case_replace(m.group(0), "both")
        return f"{lead} {core} and "

    s = re.sub(
        r"\b(?:not\s+just|more\s+than\s+just)\s+([^.!?\n]{1,45}?),?\s+but\s+(?:also\s+)?",
        _en_contrast,
        s,
        flags=re.IGNORECASE,
    )

    def _ja_contrast(m: re.Match[str]) -> str:
        applied.append("ja_not_just_but")
        return f"{m.group(1).strip()}にとどまらず、"

    s = re.sub(r"単なる([^。！？\n]{1,35}?)ではなく(?:、)?", _ja_contrast, s)

    # 2. English AI buzzwords & clichés
    en_word_swaps: Tuple[Tuple[str, str, str], ...] = (
        ("en_fast_paced_world", r"\bin\s+today['’]?s\s+fast[- ]paced\s+world\b", "today"),
        ("en_delve_into", r"\bdelve(?:s|d|ing)?\s+into\b", "examine"),
        ("en_delve", r"\bdelve(?:s|d|ing)?\b", "look closely"),
        ("en_nuanced", r"\bnuanced\b", "detailed"),
        ("en_unlock_ing", r"\bunlocking\b", "opening"),
        ("en_unlock_ed", r"\bunlocked\b", "opened"),
        ("en_unlock_s", r"\bunlocks\b", "opens"),
        ("en_unlock", r"\bunlock\b", "open"),
        ("en_game_changer", r"\bgame[- ]changer\b", "turning point"),
        ("en_tapestry", r"\btapestry\b", "blend"),
        ("en_embark_on", r"\bembark(?:s|ed|ing)?\s+(?:on|upon)\b", "start"),
        ("en_embark", r"\bembark(?:s|ed|ing)?\b", "begin"),
        ("en_navigating", r"\bnavigating\b", "handling"),
        ("en_crucial", r"\bcrucial\b", "essential"),
        ("en_comprehensive_guide", r"\bcomprehensive\s+guide\b", "practical guide"),
    )
    for tag, pat, repl in en_word_swaps:
        def _en_repl(m: re.Match[str], _tag: str = tag, _repl: str = repl) -> str:
            applied.append(_tag)
            return _preserve_case_replace(m.group(0), _repl)
        s = re.sub(pat, _en_repl, s, flags=re.IGNORECASE)

    # 3. Korean & Japanese AI clichés
    cjk_swaps: Tuple[Tuple[str, str, str], ...] = (
        ("ko_about_to_explore", r"에\s*대해\s*알아보겠습니다", "을 차분히 살펴봅니다"),
        ("ko_explore", r"알아보겠습니다", "살펴봅니다"),
        ("ko_in_conclusion", r"결론적으로\s*,?\s*", "정리하면 "),
        ("ko_very_important", r"매우\s*중요합니다", "핵심 기준입니다"),
        ("ko_key_points_are", r"핵심은\s*다음과\s*같습니다", "핵심 기준은 이렇습니다"),
        ("ko_summary_cliche", r"총정리", "핵심 정리"),
        ("ko_what_is", r"란\s*무엇인가", "의 핵심 기준"),
        ("ja_how_was_it", r"いかがでしたでしょうか[。？?]?", "お役に立てば幸いです。"),
        ("ja_thorough_explain", r"徹底解説", "実務整理"),
        ("ja_in_conclusion", r"結論として[、,]?", "要点を整理すると、"),
        ("ja_very_important", r"することが非常に重要です", "することが大切です"),
    )
    for tag, pat, repl in cjk_swaps:
        if re.search(pat, s):
            applied.append(tag)
            s = re.sub(pat, repl, s)

    return s


def _soften_em_dashes_in_segments(
    segments: List[Tuple[bool, str]],
    lang: str,
    max_em_dashes: int,
    applied: List[str],
) -> List[Tuple[bool, str]]:
    """Reduces visible em-dashes (`—`) across text segments to <= `max_em_dashes` naturally."""
    total_em = sum(seg.count("—") for is_tag, seg in segments if not is_tag)
    if total_em <= max_em_dashes:
        return segments

    out = list(segments)

    # Pass A: Convert paired parenthetical em-dashes (` — ... — ` or `—...—`) into parentheses
    if total_em > max_em_dashes:
        open_p, close_p = ("（", "）") if lang == "ja" else (" (", ")")
        new_out: List[Tuple[bool, str]] = []
        for is_tag, seg in out:
            if not is_tag and "—" in seg and total_em > max_em_dashes:
                def _pair_repl(m: re.Match[str]) -> str:
                    nonlocal total_em
                    if total_em <= max_em_dashes:
                        return m.group(0)
                    inner = m.group(1).strip()
                    total_em -= 2
                    applied.append("em_dash_pair_to_parens")
                    lead = "" if lang == "ja" else " "
                    trail = "" if lang == "ja" else " "
                    return f"{lead}{open_p.strip()}{inner}{close_p}{trail}"
                seg = re.sub(r"\s*—\s*([^—\n]{4,110}?)\s*—\s*", _pair_repl, seg)
                seg = re.sub(r"[ \t]{2,}", " ", seg)
                seg = re.sub(r"\s+([,.;:!?])", r"\1", seg)
            new_out.append((is_tag, seg))
        out = new_out

    # Pass B: Convert short label prefixes (`Low — ...`, `GREEN — ...`, `낮음 — ...`) to colons
    if total_em > max_em_dashes:
        label_pat = re.compile(
            r"\b(Low|High|None|No|Yes|GREEN|AMBER(?:-DEFENSIVE)?|RED|Caution|Defensive|Balanced|낮음|높음)\s*—\s*"
        )
        new_out = []
        for is_tag, seg in out:
            if not is_tag and "—" in seg and total_em > max_em_dashes:
                def _lbl_repl(m: re.Match[str]) -> str:
                    nonlocal total_em
                    if total_em <= max_em_dashes:
                        return m.group(0)
                    total_em -= 1
                    applied.append("em_dash_label_to_colon")
                    return f"{m.group(1)}: "
                seg = label_pat.sub(_lbl_repl, seg)
            new_out.append((is_tag, seg))
        out = new_out

    # Pass C: Soften remaining excess em-dashes to natural commas or periods
    if total_em > max_em_dashes:
        kept = 0
        new_out = []
        for is_tag, seg in out:
            if not is_tag and "—" in seg:
                def _rem_repl(m: re.Match[str]) -> str:
                    nonlocal kept
                    if kept < max_em_dashes:
                        kept += 1
                        return m.group(0)
                    applied.append("em_dash_to_comma_or_period")
                    after = m.group(1) or ""
                    if lang == "ja":
                        return f"、{after}"
                    if after and after[0].isupper():
                        return f". {after}"
                    return f", {after}" if after else ","
                seg = re.sub(r"\s*—\s*(\S?)", _rem_repl, seg)
                seg = re.sub(r",\s*,", ",", seg)
                seg = re.sub(r"[ \t]{2,}", " ", seg)
            new_out.append((is_tag, seg))
        out = new_out

    return out


def scrub_ai_slop(
    text: str,
    lang: str = "auto",
    max_em_dashes: int = 2,
    is_html: Optional[bool] = None,
) -> Tuple[str, Dict[str, Any]]:
    """
    Pass 3 AI Slop Dedicated Wash Function (Standing Directive #35):
      - HTML-safe: never mutates `<script>`, `<style>`, tags, or URLs.
      - Removes pretentious contrasts (`단지/단순히/단순한 ... 아니라`, `not just ... but`, `単なる...ではなく`),
        mechanical Korean 3-part triads (`첫째... 둘째... 셋째...`), EN/KO/JA AI buzzwords,
        and excess em-dashes (`—` strictly reduced to <= `max_em_dashes`).
      - Returns `(scrubbed_text, audit_report)`.
    """
    raw = str(text or "")
    treat_as_html = bool(is_html) if is_html is not None else bool(_HTML_BLOCK_DETECT_RE.search(raw))
    plain_before = _strip_html_for_slop_check(raw, is_html=treat_as_html)
    em_before = plain_before.count("—")
    applied: List[str] = []

    if treat_as_html:
        tokens = _HTML_TOKEN_SPLIT_RE.split(raw)
        segments: List[Tuple[bool, str]] = [
            (bool(tok.startswith("<") and tok.endswith(">")), tok)
            for tok in tokens
            if tok != ""
        ]
    else:
        segments = [(False, raw)]

    # 1. Phrase-level scrub on text nodes
    segments = [
        (is_tag, seg if is_tag else _scrub_plain_slop_phrases(seg, lang, applied))
        for is_tag, seg in segments
    ]

    # 2. Cross-paragraph mechanical Korean 3-part triad check (`첫째... 둘째... 셋째...`)
    joined_plain_mid = _strip_html_for_slop_check("".join(s for _, s in segments), is_html=treat_as_html)
    if re.search(r"첫째[\s,:].{1,250}둘째[\s,:].{1,250}셋째[\s,:]", joined_plain_mid, flags=re.DOTALL):
        triad_swaps = ((r"첫째[\s,:]+", "우선 "), (r"둘째[\s,:]+", "여기에 더해 "), (r"셋째[\s,:]+", "마지막으로 "))
        new_segs: List[Tuple[bool, str]] = []
        for is_tag, seg in segments:
            if not is_tag:
                for pat, repl in triad_swaps:
                    if re.search(pat, seg):
                        seg = re.sub(pat, repl, seg)
                        applied.append("ko_mechanical_triad")
            new_segs.append((is_tag, seg))
        segments = new_segs

    # 3. Em-dash softener (strictly <= max_em_dashes)
    segments = _soften_em_dashes_in_segments(segments, lang, max_em_dashes, applied)

    scrubbed = "".join(seg for _, seg in segments)
    plain_after = _strip_html_for_slop_check(scrubbed, is_html=treat_as_html)
    ok_after, remaining = check_ai_slop_gate(scrubbed, max_em_dashes=max_em_dashes, is_html=treat_as_html)
    return scrubbed, {
        "em_dashes_before": em_before,
        "em_dashes_after": plain_after.count("—"),
        "replacements_count": len(applied),
        "replacements_applied": sorted(set(applied)),
        "passed_after_scrub": ok_after,
        "remaining_issues": remaining,
    }


def build_clean_go_link(div: str, kind: str = "yt") -> str:
    cfg = DIV_GO_LINKS[div.upper()]
    return cfg.get(kind) or cfg["yt"]


def check_promo_hard_gate(
    div: str,
    text: str,
    surface: str = "youtube_desc",
    srt_text: str = "",
    max_em_dashes: int = 2,
) -> Tuple[bool, List[str]]:
    """
    Fail-Closed Hard Gate (`AI 티 0%` & `자동화 티 0%`).
    surface:
      - 'youtube_title' | 'youtube_desc' | 'youtube_comment' | 'ig_caption' -> blocks bot tags & long UTMs + emoji spam
      - 'seo_article' | 'pseo_page' | 'newsletter' -> allows internal site href UTMs, enforces AI Slop gate + banned terms
      - 'srt' -> additionally blocks URLs and emojis so CC tracks never show links or icons
    """
    div_u = div.upper()
    errors: List[str] = []
    combined = f"{text or ''}\n{srt_text or ''}".strip()

    if not combined:
        return False, ["empty_content"]

    # 1. AI Clichés & AI Slop Structural Gate (em-dash <= 2, contrast clichés, mechanical triad, EN buzzwords)
    slop_ok, slop_errs = check_ai_slop_gate(combined, max_em_dashes=max_em_dashes)
    if not slop_ok:
        for e in slop_errs:
            if e not in errors:
                errors.append(e)

    # 2. Global + Division Banned Terms
    for code, pat in GLOBAL_BANNED_REGEXES:
        if re.search(pat, combined, flags=re.I):
            errors.append(f"global_banned:{code}")

    for code, pat in DIV_BANNED_REGEXES.get(div_u, ()):
        if re.search(pat, combined, flags=re.I):
            errors.append(f"div_{div_u}_banned:{code}")

    # 3. Cross-division domain leaks
    for fd in DIV_FORBIDDEN_DOMAINS.get(div_u, ()):
        if fd.lower() in combined.lower():
            errors.append(f"wrong_div_domain:{fd}")

    # 4. Zero-Hangul on EN/JA divisions
    if div_u in ("TOM", "KFG", "GBA") and re.search(r"[\uac00-\ud7a3]", combined):
        errors.append(f"hangul_leak_in_{div_u}")

    # 5. Bot-tag & Long-UTM ban on public social surfaces
    if surface in ("youtube_title", "youtube_desc", "youtube_comment", "ig_caption", "srt"):
        for code, pat in BOT_TAG_LEAK_REGEXES:
            if re.search(pat, combined):
                errors.append(f"automation_tell:{code}")

    # 6. Emoji spam check (max 2 emojis per paragraph)
    if surface in ("youtube_desc", "youtube_comment", "ig_caption", "seo_article", "pseo_page"):
        for idx, para in enumerate((text or "").split("\n")):
            if len(_EMOJI_RE.findall(para)) > 2:
                errors.append(f"emoji_spam_line_{idx + 1}")
                break

    # 7. Strict SRT quality gate (no URLs, no emails, no emojis, must contain -->)
    if srt_text or surface == "srt":
        s = (srt_text or text).strip()
        if "-->" not in s or len(s) < 25:
            errors.append("srt_missing_or_malformed")
        if re.search(r"https?://|www\.|@[a-z0-9_]+\.[a-z]{2,}", s, flags=re.I):
            errors.append("srt_contains_url_or_email")
        if _EMOJI_RE.search(s):
            errors.append("srt_contains_emoji")

    return len(errors) == 0, errors


def strip_unsupported_yt_api_fields(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Guarantees no YouTube Data API v3 unsupported fields (`containsSyntheticMedia`, `relatedVideo`) are sent."""
    clean = dict(payload)
    for k in YT_UNSUPPORTED_API_FIELDS:
        clean.pop(k, None)
    if isinstance(clean.get("status"), dict):
        st = dict(clean["status"])
        for k in YT_UNSUPPORTED_API_FIELDS:
            st.pop(k, None)
        clean["status"] = st
    return clean


# 4. Golden-Time Target Windows (KST hour, minute) for `status.publishAt`
# Random jitter: ±17 to ±43 minutes (zero GHA `sleep`!)
DIV_GOLDEN_WINDOWS_KST: Dict[str, List[Tuple[int, int]]] = {
    "TOM": [(10, 0), (22, 30)],   # US ET evening 8 PM / morning 8:30 AM
    "KFG": [(10, 30), (22, 0)],   # US parents evening / morning
    "GBA": [(8, 15), (19, 30)],   # Japan morning / evening commute & relax
    "HERO": [(8, 0), (18, 30)],   # Korea senior morning tea / 6:30 PM radio
    "KFK": [(9, 30), (21, 0)],    # Korea parents morning / kids bedtime
}


def compute_yt_publish_at_iso(
    div: str,
    now_utc: Optional[dt.datetime] = None,
    seed_key: str = "",
) -> str:
    """
    Computes an RFC3339 UTC timestamp (`YYYY-MM-DDTHH:MM:SSZ`) for YouTube API v3
    `status.publishAt` at the division's next golden-time window with ±17~43 min
    natural random jitter (strictly >= now + 20 minutes). ZERO `sleep` required!
    """
    now_u = now_utc or dt.datetime.now(UTC)
    now_kst = now_u.astimezone(KST)
    min_future_kst = now_kst + dt.timedelta(minutes=20)

    rng = random.Random(
        int(hashlib.sha256(f"{div}:{seed_key}:{now_kst.strftime('%Y-%m-%d-%H')}".encode()).hexdigest()[:12], 16)
    ) if seed_key else random.SystemRandom()

    sign = rng.choice((-1, 1))
    jitter_min = sign * rng.randint(17, 43)
    jitter_sec = rng.randint(4, 54)

    windows = DIV_GOLDEN_WINDOWS_KST.get(div.upper(), [(9, 0), (20, 0)])
    candidates: List[dt.datetime] = []
    for day_off in (0, 1):
        d = (now_kst + dt.timedelta(days=day_off)).date()
        for hh, mm in windows:
            base = dt.datetime(d.year, d.month, d.day, hh, mm, 0, tzinfo=KST)
            cand = base + dt.timedelta(minutes=jitter_min, seconds=jitter_sec)
            if cand >= min_future_kst:
                candidates.append(cand)

    chosen_kst = min(candidates) if candidates else (now_kst + dt.timedelta(minutes=rng.randint(22, 43), seconds=jitter_sec))
    return chosen_kst.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


# 5. 20-Pattern Rotating Conversational Comment Questions (5 divs x 20 = 100)
COMMENT_QUESTION_BANK_20: Dict[str, List[str]] = {
    "TOM": [
        "When markets drop 20%, do you prefer 24 months of Treasury cash or staying fully invested?",
        "At 60+, do you check your retirement account every week or just twice a year?",
        "For safety cash right now, do you keep it in a bank sweep or short-term Treasury bills?",
        "Which worries you more in early retirement: a bad first crash or steady inflation?",
        "Have you checked what interest rate your brokerage sweep actually paid last month?",
        "If you hold a target-date fund, do you know how much long-term bond risk sits inside it?",
        "Do you keep your retirement rebalancing dates written on a single sheet of paper?",
        "Would a two-year cash cushion help you sleep through a rough quarter without selling?",
        "How many separate tickers are sitting inside your 401(k) or IRA right now?",
        "Did 2022 change how you look at traditional 60/40 bond allocations?",
        "When headlines turn loud, do you turn off market TV or read the raw numbers?",
        "Do you separate your monthly living cash from your long-term growth bucket?",
        "Have you ever stress-tested your retirement balance against a 2008-style drawdown?",
        "What percentage of your nest egg sits in cash earning less than one percent?",
        "Do you rebalance on fixed calendar dates or only when weights drift far apart?",
        "Which feels harder to manage after 55: saving more or protecting what you already built?",
        "Do you track your household's exact 24-month baseline expenses in one place?",
        "When semiconductors swing sharply, do you ignore the noise or check historical gauges?",
        "Have you reviewed your IRA tax-location split between growth and defense this year?",
        "If you could simplify your retirement accounts down to three core sleeves, would you?",
    ],
    "KFG": [
        "Does your child usually fall asleep before 9:30 PM or after 10:00 PM on school nights?",
        "Do you mark your child's height on a doorframe wall or save it in a phone note?",
        "What feels harder at bedtime in your home: screens off or earlier lights-out?",
        "Have you noticed your child waking up with dry lips or breathing through the mouth?",
        "How often do you measure barefoot height at home: monthly or once a year?",
        "Did your pediatrician have enough time to walk through the percentile curve last visit?",
        "Which dinner habit is trickier on weekdays: steady protein or skipping late sweet snacks?",
        "Do you have more than one child whose growth pace looks surprisingly different?",
        "Has your child ever had a wrist bone-age check more than six months ago?",
        "What outdoor movement or jump play does your child actually enjoy after school?",
        "Do you measure height in the morning right after waking or in the evening?",
        "Have you ever compared your child's yearly inches gained rather than one snapshot?",
        "What time do bright overhead lights usually get dimmed in your house at night?",
        "Do you keep a simple paper growth log ready before annual pediatric checkups?",
        "Has a sudden shoe-size jump caught you off guard this school year?",
        "What is your child's favorite high-protein dinner that takes under twenty minutes?",
        "Do weekend bedtimes drift more than an hour later than school nights?",
        "Have you ever felt frustrated by how many supplement ads pop up when searching height charts?",
        "Which number do you watch more closely: percentile rank or inches gained per year?",
        "Would a calm monthly reminder help you track growth without worrying every week?",
    ],
    "GBA": [
        "新NISAの安全資金は、銀行預金と個人向け国債のどちらを軸に考えていますか？",
        "相場が大きく揺れた夜、スマホをすぐ見ますか？それとも閉じて朝まで眠りますか？",
        "50代からの新NISA、一括よりも毎月コツコツ整える派ですか？",
        "成長投資枠1,200万円の上限ルール、口座を開く前にご存じでしたか？",
        "老後資金の点検は、月に一度派ですか？年に二回派ですか？",
        "株安と円高が同時に来た場面、紙のメモで想定したことはありますか？",
        "向こう2年分の生活費を安全資金へ分ける考え方、安心感につながりそうですか？",
        "証券口座の注文は、成行よりも指値で落ち着いて出す派ですか？",
        "新NISAの非課税枠、今はどのくらいのペースで埋めていますか？",
        "定期預金と個人向け国債（変動10年）の差、最近比べたことはありますか？",
        "老後設計で一番気がかりなのは、暴落時の揺れ幅と物価上昇のどちらですか？",
        "米国ETFの配当に10%の米国課税がかかる点、計算に入れていましたか？",
        "保有銘柄の数は、少数に絞る派ですか？幅広く持つ派ですか？",
        "2022年の株と債券の同時下落を見て、債券の見方は変わりましたか？",
        "ご家族と老後資金の取り崩し順序について話したことはありますか？",
        "毎朝の市場ニュース、見すぎて疲れた経験はありますか？",
        "半導体セクターの過熱感、数字で一度見てから判断する派ですか？",
        "退職金やまとまった資金を動かす前、過去25年の下落幅を確認されましたか？",
        "投資のルールは頭の中だけですか？それとも紙1枚に書いていますか？",
        "定年後の取り崩し、定額と定率のどちらが暮らしに合いそうですか？",
    ],
    "HERO": [
        "어머님이 가장 그리운 계절은 봄날인가요, 선선한 가을녘인가요?",
        "오늘 밤 더 듣고 싶은 백운호 노래는 〈어머니의 봄날〉인가요, 〈백운호 연가〉인가요?",
        "아침 가족 단톡방 인사, 글자보다 꽃그림 안부카드가 더 반가우신가요?",
        "산책길에 들으실 때 잔잔한 연가가 좋으신가요, 힘찬 응원곡이 좋으신가요?",
        "저녁 설거지 끝내고 쉬실 때 따뜻한 차와 노래 중 무엇이 먼저 생각나세요?",
        "백운호 6곡 가운데 어머님 마음속 1등 애창곡은 어떤 곡인가요?",
        "옛날 고향 정거장이나 장터 길 떠올리면 가장 먼저 생각나는 분은 누구신가요?",
        "비 오는 저녁에는 잔잔한 라디오 사연과 구수한 트로트 중 어느 쪽이 더 좋으세요?",
        "주말 아침에 일어나시면 따뜻한 보리차부터 끓이시나요, 커피부터 내리시나요?",
        "요즘 자주 연락 주고받는 친구분이나 자식에게 오늘 안부 한 줄 보내보셨나요?",
        "백운호 다음 신곡으로는 고향 노래가 좋으실까요, 부부 정 노래가 좋으실까요?",
        "라디오 들으실 때 저녁 6시가 편하신가요, 밤 9시 잠들기 전이 더 편하신가요?",
        "어머님께서 요즘 가장 힘 나시는 소소한 일상 즐거움은 무엇인가요?",
        "오랜만에 동네 산책 다녀오실 때 주로 어느 시간대에 걸으시나요?",
        "가슴 뭉클한 사연을 들으시면 먼저 눈물이 나시나요, 잔잔한 미소가 나시나요?",
        "명절 때 자식들 뒷모습 배웅하고 나면 어떤 노래가 제일 먼저 떠오르시나요?",
        "큰글씨 가사 보시면서 따라 부르실 때 박자 맞추기 편안하셨나요?",
        "요즘 환절기 목 관리로 따뜻한 도라지차나 생강차 챙겨 드시고 계신가요?",
        "오늘 하루 고생한 나 자신에게 딱 한 마디 건넨다면 어떤 말을 해주고 싶으세요?",
        "다음 14분 연속극장에서는 어떤 사연을 먼저 들려드리면 좋을까요?",
    ],
    "KFK": [
        "우리 아이 취침 시간은 보통 9시 반 이전인가요, 10시 이후인가요?",
        "집에서 더 어려운 건 일찍 재우기인가요, 저녁 단백질 챙기기인가요?",
        "아이 키는 매달 벽에 재 보시나요, 영유아·학교 검진 때만 확인하시나요?",
        "우리 아이 잘 때 입을 살짝 벌리고 자거나 코를 고는 편인가요?",
        "소아과에서 뼈나이 검사를 받아 보신 적이 있으신가요?",
        "요즘 우리 아이가 저녁에 가장 잘 먹는 단백질 반찬은 무엇인가요?",
        "주말 취침 시간이 평일보다 1시간 넘게 늦어지는 편인가요?",
        "아이 키가 최근 1년 사이 몇 cm 정도 자랐는지 기록해 두셨나요?",
        "집에서 아이와 함께 하는 저녁 스트레칭이나 줄넘기 루틴이 있으신가요?",
        "성장클리닉 가기 전에 꼭 물어보고 싶었던 궁금증이 있으신가요?",
        "아침에 일어나자마자 잰 키와 저녁 키 차이를 느껴 보신 적 있으세요?",
        "아이 잠들기 전 스마트폰이나 영상 끄는 시간은 보통 몇 시인가요?",
        "우유를 많이 먹이는데도 키 속도가 고민되신 적이 있으신가요?",
        "형제나 자매가 있는 집이라면 두 아이 성장 속도가 꽤 다른 편인가요?",
        "초등 고학년 들어가면서 갑자기 신발 사이즈가 훌쩍 큰 적 있으신가요?",
        "거실 형광등을 밤 9시 넘어 은은한 조명으로 바꿔 보신 적 있으세요?",
        "아이 키 검색할 때 영양제 광고가 너무 많아서 피곤하셨던 적 있으신가요?",
        "우리 아이 평소 방과 후 바깥 활동 시간은 하루 몇 분 정도인가요?",
        "성장도표 백분위 숫자와 연간 성장속도 중 어느 쪽이 더 헷갈리시나요?",
        "매달 1일 아침 맨발 키 기록, 이번 달부터 함께 시작해 보실래요?",
    ],
}


def pick_rotating_comment_question(div: str, index_seed: int) -> str:
    bank = COMMENT_QUESTION_BANK_20[div.upper()]
    return bank[index_seed % len(bank)]


def build_clean_social_comment(div: str, index_seed: int, is_longform: bool = False) -> str:
    """Builds a clean human-tone comment using ONLY short `/go/yt` links and 20-pattern questions."""
    div_u = div.upper()
    go_url = build_clean_go_link(div_u, "yt")
    q = pick_rotating_comment_question(div_u, index_seed)
    if div_u == "TOM":
        sample_go = build_clean_go_link("TOM", "yt_sample")
        lead = (
            f"Free daily SMH Fear & Greed gauge + 2000-2025 stress-test: {go_url}\n"
            f"Free 2-page sample workbook PDF: {sample_go}\n\n"
            f"{q}"
        )
    elif div_u == "KFG":
        sample_go = build_clean_go_link("KFG", "yt_sample")
        lead = (
            f"Free 60-second US CDC height percentile check (no email wall, zero supplement ads): {go_url}\n"
            f"Free 2-page printable sample PDF: {sample_go}\n\n"
            f"{q}"
        )
    elif div_u == "GBA":
        sample_go = build_clean_go_link("GBA", "yt_sample")
        lead = (
            f"毎日無料の米国半導体・恐怖と強欲指数＆新NISA25年統計: {go_url}\n"
            f"無料2ページ・サンプルPDF: {sample_go}\n\n"
            f"{q}"
        )
    elif div_u == "HERO":
        lead = (
            f"백운호 6곡 무료 연속듣기 · 사연 사랑방 · 카톡 무료 아침 안부카드:\n"
            f"{go_url}\n\n"
            f"{q}"
        )
    else:  # KFK
        sample_go = build_clean_go_link("KFK", "yt_sample")
        lead = (
            f"상업성 광고 없는 1분 무료 질병관리청 예상키·뼈나이 시차 진단: {go_url}\n"
            f"결제 전 미리 보는 2페이지 무료 샘플 PDF: {sample_go}\n\n"
            f"{q}"
        )
    ok, errs = check_promo_hard_gate(div_u, lead, surface="youtube_comment")
    if not ok:
        raise ValueError(f"Hard Gate rejected comment for {div_u}: {errs}")
    return lead


# 6. 1-Line 10~14 Char Subtitle Cue Splitter + Highlight Word Picker + True SRT Formatter
def _fmt_srt_ts(sec: float) -> str:
    s = max(0.0, float(sec))
    h, m, r = int(s // 3600), int((s % 3600) // 60), int(s % 60)
    ms = int(round((s - int(s)) * 1000)) % 1000
    return f"{h:02d}:{m:02d}:{r:02d},{ms:03d}"


def split_to_short_subtitle_lines(text: str, lang: str = "ko") -> List[str]:
    """
    Splits spoken script into crisp 1-line subtitle phrases:
      - KO / JA: 10~14 chars target (max 15 chars, zero 3-paragraph walls!)
      - EN: 3~5 words target (max ~24 chars)
    Strips URLs & emojis strictly.
    """
    cleaned = re.sub(r"https?://\S+|#\S+", "", text or "")
    cleaned = _EMOJI_RE.sub("", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    if not cleaned:
        return []

    lines: List[str] = []
    if lang in ("ko", "ja"):
        # Split first on natural clause punctuation
        clauses = [c.strip() for c in re.split(r"(?<=[.?!。？！,、—–])\s*|\n+", cleaned) if c.strip()]
        for cl in clauses:
            if len(cl) <= 14:
                lines.append(cl)
                continue
            if " " in cl:
                words = cl.split(" ")
                cur = ""
                for w in words:
                    cand = f"{cur} {w}".strip() if cur else w
                    if len(cand) <= 14:
                        cur = cand
                    else:
                        if cur:
                            lines.append(cur)
                        cur = w
                if cur:
                    lines.append(cur)
            else:
                # Japanese continuous text without spaces: slice cleanly at 12-14 chars avoiding leading punctuation
                pos = 0
                while pos < len(cl):
                    end = min(len(cl), pos + 13)
                    if end < len(cl) and cl[end] in "。、！？）」』":
                        end += 1
                    lines.append(cl[pos:end])
                    pos = end
    else:
        clauses = [c.strip() for c in re.split(r"(?<=[.?!,;—–])\s+|\n+", cleaned) if c.strip()]
        for cl in clauses:
            words = cl.split(" ")
            cur = ""
            for w in words:
                cand = f"{cur} {w}".strip() if cur else w
                if len(cand) <= 24 and len(cand.split()) <= 5:
                    cur = cand
                else:
                    if cur:
                        lines.append(cur)
                    cur = w
            if cur:
                lines.append(cur)

    return [ln.strip() for ln in lines if ln.strip()]


def pick_highlight_token(line: str, lang: str = "ko") -> str:
    """Selects 1~2 key words (numbers, percentages, or strongest content noun) for brand accent color."""
    m_num = re.search(r"[\$¥]?\d[\d.,]*(?:%|만|억|cm|in|년|개월|세|점|歳|万円|K|M)?", line)
    if m_num:
        return m_num.group(0)
    tokens = line.split(" ") if " " in line else [line[:4]]
    stop = {"the", "and", "for", "with", "that", "this", "your", "from", "into", "what", "when", "does", "are", "you"}
    cands = [t for t in tokens if len(t.strip(".,?!")) >= 3 and t.lower().strip(".,?!") not in stop]
    if cands:
        return max(cands, key=len)
    return tokens[0] if tokens else ""


def build_synced_srt(timed_cues: List[Tuple[float, float, str]]) -> str:
    """Formats verified millisecond-synced .srt (strictly zero URLs / zero emojis)."""
    blocks: List[str] = []
    idx = 1
    for t0, t1, txt in timed_cues:
        clean = _EMOJI_RE.sub("", re.sub(r"https?://\S+|#\S+", "", txt or "")).strip()
        if not clean:
            continue
        blocks.append(f"{idx}\n{_fmt_srt_ts(t0)} --> {_fmt_srt_ts(max(t0 + 0.3, t1))}\n{clean}\n")
        idx += 1
    return "\n".join(blocks)


def check_hero_lyric_sync_catalog_gate(catalog: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """
    Fail-Closed Lyric-Audio Sync Hard Gate for Div 4 (HERO) Baek Woon-ho MV Catalog:
      1. Requires `sync_verified == True` at catalog & song level.
      2. Blocks copy-pasted uniform templates (>= 3 songs sharing identical start_sec + cue timings).
      3. Blocks lyric cues placed on vocal-free instrumental tail (beyond `vocal_end_rel_sec + 0.8s`)
         or with `min_cue_vocal_ratio < 0.35` or out-of-bounds / overlapping cue times.
    """
    errs: List[str] = []
    if not isinstance(catalog, dict) or not catalog.get("songs"):
        return False, ["hero_catalog_empty"]

    if catalog.get("sync_verified") is not True:
        errs.append("hero_catalog_sync_unverified")

    songs = catalog.get("songs") or []
    sig_counts: Dict[Tuple[Any, ...], int] = {}

    for s in songs:
        sid_name = str(s.get("song_id") or s.get("track_no") or "unknown")
        if s.get("sync_verified") is not True:
            errs.append(f"song_sync_unverified:{sid_name}")

        for sl in s.get("slices") or []:
            sl_id = str(sl.get("slice_id") or "unknown")
            dur = float(sl.get("duration_sec") or 0.0)
            st = float(sl.get("start_sec") or 0.0)
            cues = sl.get("cues") or []
            if dur < 12.0 or len(cues) < 2:
                errs.append(f"invalid_slice_bounds:{sid_name}:{sl_id}")
                continue

            # Anti-copy-paste fingerprint across songs
            c0 = cues[0]
            fp = (sl_id, round(st, 1), round(float(c0[0]), 1), round(float(c0[1]), 1))
            sig_counts[fp] = sig_counts.get(fp, 0) + 1

            # Min vocal active ratio check
            min_vr = sl.get("min_cue_vocal_ratio")
            if min_vr is not None and float(min_vr) < 0.35:
                errs.append(f"low_vocal_ratio:{sid_name}:{sl_id}:{min_vr}")

            voc_end = sl.get("vocal_end_rel_sec")
            prev_t1 = -0.01
            for ci, cue in enumerate(cues):
                t0, t1 = float(cue[0]), float(cue[1])
                l1 = str(cue[2] or "").strip()
                if t0 < 0.0 or t1 <= t0 or t1 > dur + 0.15:
                    errs.append(f"cue_out_of_bounds:{sid_name}:{sl_id}:c{ci}")
                if t0 < prev_t1 - 0.05:
                    errs.append(f"cue_overlap:{sid_name}:{sl_id}:c{ci}")
                prev_t1 = t1
                # Non-lyric outro/title cards begin with '♪'; sung lyric cues must NOT sit on vocal-free tail
                is_non_lyric_card = l1.startswith("♪")
                if (voc_end is not None) and (not is_non_lyric_card) and (t1 > float(voc_end) + 0.8):
                    errs.append(f"lyric_on_nonvocal_outro:{sid_name}:{sl_id}:c{ci}({t1:.1f}>{float(voc_end):.1f})")

    if len(songs) >= 3:
        for fp, cnt in sig_counts.items():
            if cnt >= 3:
                errs.append(f"copypaste_template_detected:{fp[0]}:x{cnt}")

    return len(errs) == 0, errs


if __name__ == "__main__":
    # Self-test all 100 comment questions & Hard Gate fail-closed checks
    passed_q = 0
    for d in ("TOM", "KFG", "GBA", "HERO", "KFK"):
        for idx in range(20):
            c = build_clean_social_comment(d, idx)
            ok, errs = check_promo_hard_gate(d, c, surface="youtube_comment")
            assert ok, f"Failed {d}[{idx}]: {errs}"
            passed_q += 1
        pub = compute_yt_publish_at_iso(d, seed_key="smoke")
        assert pub.endswith("Z") and "T" in pub, f"Bad publishAt: {pub}"

    # Negative fail-closed tests
    bad_cases = [
        ("KFK", "오늘은 키 성장에 대해 알아보겠습니다.", "youtube_desc"),
        ("TOM", "Delve into this game-changer ETF!", "youtube_desc"),
        ("TOM", "This nuanced tapestry helps you embark on retirement.", "seo_article"),
        ("TOM", "It is not just cash, but calm peace of mind.", "seo_article"),
        ("TOM", "One — two — three — four em-dashes in one note.", "seo_article"),
        ("KFK", "이건 단순히 키가 아니라 자신감의 문제입니다.", "seo_article"),
        ("KFK", "첫째: 수면. 둘째: 단백질. 셋째: 운동.", "seo_article"),
        ("GBA", "単なる預金ではなく老後の防衛です。", "seo_article"),
        ("GBA", "結論として、米国株クオンツの買い時です。", "youtube_desc"),
        ("KFG", "Clinical diagnosis for Brain LQ 1:1 coaching.", "youtube_desc"),
        ("TOM", "Check https://truthofmarket.com/?utm_source=youtube&utm_campaign=x_SLOT_A", "youtube_comment"),
        ("HERO", "1\n00:00:00,000 --> 00:00:04,000\nhttps://paradise-hero.com 💚\n", "srt"),
    ]
    for d, bad, surf in bad_cases:
        ok, errs = check_promo_hard_gate(d, bad, surface=surf)
        assert not ok, f"Hard Gate FAILED to block bad case ({d}/{surf}): {bad}"

    # Pass-3 scrub_ai_slop() positive self-test (HTML-safe + zero residual slop)
    slop_html = (
        '<article><p>In today\'s fast-paced world, we delve into a nuanced tapestry — not just numbers, but calm — '
        'to unlock a game-changer plan — and embark on steady habits — every year.</p>'
        '<script>var keep = "delve — — —";</script></article>'
    )
    cleaned_en, rep_en = scrub_ai_slop(slop_html, lang="en", max_em_dashes=2, is_html=True)
    assert rep_en["passed_after_scrub"], f"EN scrub failed: {rep_en}"
    assert 'var keep = "delve — — —";' in cleaned_en, "HTML <script> was mutated!"

    slop_ko = "<p>이건 단순히 숫자가 아니라 습관입니다. 첫째, 일찍 자고 둘째, 잘 먹고 셋째, 기록하세요. 결론적으로 매우 중요합니다.</p>"
    cleaned_ko, rep_ko = scrub_ai_slop(slop_ko, lang="ko", max_em_dashes=2, is_html=True)
    assert rep_ko["passed_after_scrub"], f"KO scrub failed: {rep_ko}"

    slop_ja = "<p>単なる預金ではなく安心の設計です。徹底解説しました。いかがでしたでしょうか？</p>"
    cleaned_ja, rep_ja = scrub_ai_slop(slop_ja, lang="ja", max_em_dashes=2, is_html=True)
    assert rep_ja["passed_after_scrub"], f"JA scrub failed: {rep_ja}"

    # Negative Fail-Closed Lyric-Sync Hard Gate tests (unverified + copy-paste + vocal-free outro)
    bad_cat_copypaste = {
        "sync_verified": True,
        "songs": [
            {
                "song_id": f"s{i}",
                "sync_verified": True,
                "slices": [{
                    "slice_id": "chorus2", "start_sec": 119.0, "duration_sec": 34.0,
                    "vocal_end_rel_sec": 24.0, "min_cue_vocal_ratio": 0.8,
                    "cues": [[0.5, 8.2, "가사1", "가사2"], [8.3, 33.5, "무보컬후주가사", "차단대상"]],
                }],
            }
            for i in range(3)
        ],
    }
    ok_sync, sync_errs = check_hero_lyric_sync_catalog_gate(bad_cat_copypaste)
    assert not ok_sync, "Sync Hard Gate failed to block copy-paste + non-vocal outro catalog!"
    assert any("copypaste_template_detected" in e for e in sync_errs), f"Missing copypaste error: {sync_errs}"
    assert any("lyric_on_nonvocal_outro" in e for e in sync_errs), f"Missing nonvocal outro error: {sync_errs}"

    print(f"PROMO_HARD_GATE SELF-TEST PASS: {passed_q}/100 comments verified, {len(bad_cases)}/{len(bad_cases)} text + sync bad cases Fail-Closed blocked.")
