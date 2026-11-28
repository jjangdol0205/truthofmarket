#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Global Adversarial External Live Audit (`run_live_audit.py`)
============================================================
Strictly audits live external production websites and YouTube channels using ONLY
Python standard library (`urllib`, `re`, `json`, `time`, `ssl`) with cache-busting
headers (`?nocache=<ts>`, `Cache-Control: no-cache`).
NEVER reads any local workspace source files.

Usage:
  python run_live_audit.py                      # Audit all 5 websites + 5 YouTube channels
  python run_live_audit.py truthofmarket.com    # Audit a single domain/channel
  python run_live_audit.py --web-only           # Audit only the 5 websites
  python run_live_audit.py --json               # Emit machine-readable JSON + Markdown table
"""

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import re
import ssl
import sys
import time
from typing import Any, Dict, List, Optional, Tuple
import urllib.error
import urllib.parse
import urllib.request

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
)

SSL_CTX = ssl.create_default_context()


def fetch_external(
    url: str,
    bust_cache: bool = True,
    timeout: float = 18.0,
    extra_headers: Optional[Dict[str, str]] = None,
) -> Tuple[int, Dict[str, str], str, str]:
    """Returns (status_code, headers_lower, body_text, final_url)."""
    ts = int(time.time() * 1000)
    target_url = url
    if bust_cache:
        sep = "&" if "?" in url else "?"
        target_url = f"{url}{sep}nocache={ts}"

    headers = {
        "User-Agent": USER_AGENT,
        "Cache-Control": "no-cache, no-store, max-age=0",
        "Pragma": "no-cache",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,ko;q=0.8,ja;q=0.7",
    }
    if extra_headers:
        headers.update(extra_headers)

    req = urllib.request.Request(target_url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=SSL_CTX) as resp:
            status = resp.getcode() or 200
            hdrs = {k.lower(): v for k, v in resp.headers.items()}
            raw = resp.read(3_500_000)  # cap at 3.5 MB to avoid memory blowup
            body = raw.decode("utf-8", errors="replace")
            return status, hdrs, body, resp.geturl()
    except urllib.error.HTTPError as e:
        hdrs = {k.lower(): v for k, v in (e.headers.items() if e.headers else [])}
        try:
            body = e.read(500_000).decode("utf-8", errors="replace")
        except Exception:
            body = ""
        return e.code, hdrs, body, target_url
    except Exception as e:
        return 0, {"error": str(e)}, "", target_url


def fetch_local_js_bundles(base_url: str, html: str, max_bundles: int = 6) -> str:
    """Fetches same-origin JS bundles referenced in HTML (skipping huge >2.5MB data bundles)."""
    srcs = re.findall(r'<script[^>]+src=["\']([^"\']+\.js[^"\']*)["\']', html, flags=re.I)
    combined: List[str] = []
    count = 0
    for src in srcs:
        if count >= max_bundles:
            break
        if any(skip in src.lower() for skip in ("data-bundle.js", "googletagmanager", "clarity.ms", "jsdelivr", "cdnjs", "lemonsqueezy.com")):
            continue
        full_url = urllib.parse.urljoin(base_url, src)
        if urllib.parse.urlparse(full_url).netloc != urllib.parse.urlparse(base_url).netloc:
            continue
        st, _, js_txt, _ = fetch_external(full_url, bust_cache=True, timeout=12.0)
        if st == 200 and len(js_txt) <= 2_500_000:
            combined.append(js_txt)
            count += 1
    return "\n".join(combined)


def strip_tags_visible(html: str) -> str:
    cleaned = re.sub(r"<script\b[^>]*>.*?</script>", " ", html, flags=re.I | re.S)
    cleaned = re.sub(r"<style\b[^>]*>.*?</style>", " ", cleaned, flags=re.I | re.S)
    cleaned = re.sub(r"<!--.*?-->", " ", cleaned, flags=re.S)
    return cleaned


SITE_SPECS: List[Dict[str, Any]] = [
    {
        "key": "truthofmarket.com",
        "div": "1사업부 (TOM)",
        "url": "https://truthofmarket.com/",
        "extra_200_urls": ["https://truthofmarket.com/sitemap.xml"],
        "forbidden_regex": [
            ("bitget 잔존", r"bitget", True),
        ],
        "required_regex": [
            ("Whop/PAYMENT_CONFIG 결제 연동", r"(whop\.com/checkout/|@whop/checkout|buy\.polar\.sh|polar\.sh|polar_sh|PAYMENT_CONFIG|vip_waitlist)"),
        ],
        "forbid_hangul_visible": False,
    },
    {
        "key": "getbreakai.com",
        "div": "3사업부 (GBA)",
        "url": "https://getbreakai.com/jp/",
        "extra_200_urls": ["https://getbreakai.com/"],
        "forbidden_regex": [
            ("telegram/t.me 노출", r"(telegram|t\.me|semifeargreedbot|テレグラム)", True),
            ("임시 슬러그(gb-starter-29)", r"gb-starter-29", True),
        ],
        "required_regex": [
            ("Whop/PAYMENT_CONFIG 결제 연동", r"(whop\.com/checkout/|@whop/checkout|buy\.polar\.sh|polar\.sh|polar_sh|PAYMENT_CONFIG|vip_waitlist)"),
        ],
        "forbid_hangul_visible": True,
    },
    {
        "key": "kisfitglobal.com",
        "div": "2사업부 (KFG)",
        "url": "https://kisfitglobal.com/",
        "extra_200_urls": [],
        "forbidden_regex": [
            ("@kidsfit01 오노출", r"@kidsfit01", True),
            ("Height &Unlock 오타", r"Height\s*&Unlock", False),
        ],
        "required_regex": [
            ("Polar.sh/PAYMENT_CONFIG 실결제 연동", r"(buy\.polar\.sh|polar\.sh|polar_sh)"),
        ],
        "forbid_hangul_visible": True,
    },
    {
        "key": "kidsfit.co.kr",
        "div": "5사업부 (KFK)",
        "url": "https://kidsfit.co.kr/",
        "extra_200_urls": [],
        "forbidden_regex": [
            ("lemonsqueezy 혼입", r"lemonsqueezy", True),
            ("쿠팡/제휴링크 잔존", r"(coupang\.com|coupa\.ng|AF7865143|A100708867|brandconnect\.naver\.com)", True),
            ("금지 홍보문구(최저가/할인율/특가/폭탄세일)", r"(최저가|할인율|특가|폭탄세일)", False),
        ],
        "required_regex": [
            ("Latpeed 유료플랫폼 연동", r"(latpeed\.com|KFK_EBOOK_CONFIG)"),
        ],
        "forbid_hangul_visible": False,
    },
    {
        "key": "paradise-hero.com",
        "div": "4사업부 (HERO)",
        "url": "https://paradise-hero.com/",
        "extra_200_urls": ["https://paradise-hero.com/booth.html"],
        "forbidden_regex": [
            ("lemonsqueezy 혼입", r"lemonsqueezy", True),
            ("Store #296100 오노출", r"Store\s*#296100", True),
            ("황영웅 실존가수 잔존", r"황영웅", False),
            ("10대 왕자 구문구", r"10대\s*왕자", False),
            ("깨진 문자(□/)", r"[□\ufffd]", False),
        ],
        "required_regex": [
            ("가상 트로트 가수 백운호 코어", r"백운호"),
        ],
        "forbid_hangul_visible": False,
    },
]

YOUTUBE_SPECS: List[Dict[str, Any]] = [
    {
        "key": "@RightSideAlpha",
        "div": "1사업부 YT",
        "channel_id": "UCbxWByxJntRqoweWy-4QnqA",
        "expected_domain": "truthofmarket.com",
    },
    {
        "key": "@kisfitglobal",
        "div": "2사업부 YT",
        "channel_id": "UCMabm6nnINhHFwekDP6mqoA",
        "expected_domain": "kisfitglobal.com",
    },
    {
        "key": "@GetBreakAI",
        "div": "3사업부 YT",
        "channel_id": "UCz_lV9K4EUZylnnS8zXGrng",
        "expected_domain": "getbreakai.com",
    },
    {
        "key": "@김쌤의영웅라디오",
        "div": "4사업부 YT",
        "channel_id": "UCVsUonyLFpyWHfLi0tqJzPg",
        "expected_domain": "paradise-hero.com",
        "forbidden_regex": [
            ("황영웅 실존가수 잔존", r"황영웅", False),
            ("#파라다이스 구팬덤 태그", r"#파라다이스", False),
        ],
        "required_regex": [
            ("백운호 IP 코어", r"백운호"),
        ],
    },
    {
        "key": "@kidsfit01",
        "div": "5사업부 YT",
        "channel_id": "UCZb2uBYNLfld4CkQl0CvWLQ",
        "expected_domain": "kidsfit.co.kr",
    },
]


def audit_single_website(spec: Dict[str, Any]) -> Dict[str, Any]:
    st, hdrs, html, final_url = fetch_external(spec["url"], bust_cache=True)
    last_mod = hdrs.get("last-modified") or hdrs.get("etag") or hdrs.get("date") or "-"
    failures: List[str] = []
    details: List[str] = []

    if st != 200:
        failures.append(f"HTTP {st} (expected 200)")
        return {
            "kind": "WEB",
            "target": spec["key"],
            "div": spec["div"],
            "http": st,
            "last_modified": last_mod,
            "passed": False,
            "summary": "; ".join(failures),
        }

    js_bundle_text = fetch_local_js_bundles(final_url, html)
    combined = html + "\n" + js_bundle_text
    visible_html = strip_tags_visible(html)
    visible_text = re.sub(r"<[^>]+>", " ", visible_html)

    # Universal check across all 5 websites: broken HTML comment / separator fragments leaking visibly on screen
    broken_comment_hits = re.findall(r"(?:-->|<!--|=====)", visible_text)
    if broken_comment_hits:
        failures.append(f"깨진 HTML 주석/구분선 노출({len(broken_comment_hits)}건)")
    else:
        details.append("깨진주석=0건")

    # Extra 200 URLs (e.g., sitemap.xml, booth.html)
    for ex_url in spec.get("extra_200_urls", []):
        ex_st, _, _, _ = fetch_external(ex_url, bust_cache=True)
        short_name = ex_url.rstrip("/").split("/")[-1] or "/"
        if ex_st != 200:
            failures.append(f"{short_name} HTTP {ex_st}")
        else:
            details.append(f"{short_name}=200")

    # Forbidden regex checks
    for label, pattern, icase in spec.get("forbidden_regex", []):
        flags = re.I if icase else 0
        # Check visible text for character glyphs/promo words, or main HTML for 5사업부 affiliate-removal check, or full combined for tokens/URLs
        if "문자" in label or "문구" in label:
            haystack = visible_html
        elif "제휴링크" in label:
            haystack = html
        else:
            haystack = combined
        hits = re.findall(pattern, haystack, flags=flags)
        if hits:
            failures.append(f"{label}: {len(hits)}건 검출")
        else:
            details.append(f"{label}=0건")

    # Hangul check on English/Japanese sites
    if spec.get("forbid_hangul_visible"):
        hangul_hits = re.findall(r"[가-힣]+", visible_html)
        if hangul_hits:
            sample = ",".join(hangul_hits[:3])
            failures.append(f"한글 잔존({len(hangul_hits)}건: {sample})")
        else:
            details.append("한글=0건")

    # Required regex checks
    for label, pattern in spec.get("required_regex", []):
        if not re.search(pattern, combined, flags=re.I):
            failures.append(f"{label} 누락")
        else:
            details.append(f"{label}=OK")

    passed = len(failures) == 0
    return {
        "kind": "WEB",
        "target": spec["key"],
        "div": spec["div"],
        "http": st,
        "last_modified": last_mod,
        "passed": passed,
        "summary": " | ".join(details) if passed else " ❌ " + "; ".join(failures),
    }


def _extract_yt_initial_data(html: str) -> Optional[Dict[str, Any]]:
    m = re.search(r"var\s+ytInitialData\s*=\s*(\{.*?\});\s*</script>", html, flags=re.S)
    if not m:
        m = re.search(r"ytInitialData\"\s*:\s*(\{.*?\})\s*[,;]<", html, flags=re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except Exception:
        return None


def audit_single_youtube(spec: Dict[str, Any]) -> Dict[str, Any]:
    cid = spec["channel_id"]
    shorts_url = f"https://www.youtube.com/channel/{cid}/shorts"
    st, hdrs, html, _ = fetch_external(
        shorts_url,
        bust_cache=True,
        extra_headers={"Cookie": "CONSENT=YES+cb.20210328-17-p0.en+FX+471"},
    )
    failures: List[str] = []
    details: List[str] = []

    if st != 200:
        return {
            "kind": "YOUTUBE",
            "target": spec["key"],
            "div": spec["div"],
            "http": st,
            "last_modified": hdrs.get("date", "-"),
            "passed": False,
            "summary": f" ❌ HTTP {st}",
        }

    # 1. Channel Title sanity check (no placeholder like 'djdkf')
    title_m = re.search(r'<meta\s+property="og:title"\s+content="([^"]+)"', html)
    ch_title = title_m.group(1).strip() if title_m else ""
    if not ch_title or ch_title.lower() in ("djdkf", "youtube", "untitled"):
        failures.append(f"비정상 채널명({ch_title!r})")
    else:
        details.append(f"채널명={ch_title[:22]}")

    # 2. Strict Channel Header Profile External Link (`event=channel_header` -> HTTP 200 OK)
    # Fetch channel home header as well to verify actual profile header link (`q=<url>`), not just video descriptions
    st_home, _, raw_home, _ = fetch_external(
        f"https://www.youtube.com/channel/{cid}",
        bust_cache=True,
        extra_headers={"Cookie": "CONSENT=YES+cb.20210328-17-p0.en+FX+471"},
    )
    home_unescaped = urllib.parse.unquote((raw_home if st_home == 200 else html).replace("\\u0026", "&").replace("\\/", "/"))
    hdr_redirects = re.findall(
        r"https?://www\.youtube\.com/redirect\?[^\"'\s<>]*event=channel_header[^\"'\s<>]*",
        home_unescaped,
    )
    extracted_q_url = ""
    for redir in hdr_redirects:
        parsed_qs = urllib.parse.parse_qs(urllib.parse.urlparse(redir).query)
        q_vals = parsed_qs.get("q", [])
        if q_vals and spec["expected_domain"].lower() in q_vals[0].lower():
            extracted_q_url = q_vals[0]
            break

    if not extracted_q_url:
        failures.append(f"채널 헤더 프로필링크({spec['expected_domain']}) 누락(null)")
    else:
        q_st, _, _, _ = fetch_external(extracted_q_url, bust_cache=True, timeout=12.0)
        if q_st != 200:
            failures.append(f"프로필링크({extracted_q_url}) HTTP {q_st}")
        else:
            details.append(f"프로필링크({extracted_q_url})=200 OK")

    # 3. Recent Shorts duplicate title check
    data = _extract_yt_initial_data(html)
    short_titles: List[str] = []
    if data:
        blob = json.dumps(data, ensure_ascii=False)
        # Extract accessibility / overlayMetadata primaryText titles on Shorts grid
        for m in re.finditer(r'"overlayMetadata"\s*:\s*\{\s*"primaryText"\s*:\s*\{\s*"content"\s*:\s*"([^"]+)"', blob):
            t = m.group(1).strip()
            if t and (not short_titles or short_titles[-1] != t or len(short_titles) < 8):
                short_titles.append(t)
    # Deduplicate adjacent serialization twins only if exact same videoId, so instead parse richItemRenderer blocks!
    rich_titles: List[str] = []
    for chunk in html.split('"richItemRenderer"')[1:7]:
        m_t = re.search(r'"primaryText"\s*:\s*\{\s*"content"\s*:\s*"([^"]+)"', chunk)
        if not m_t:
            m_t = re.search(r'"headline"\s*:\s*\{\s*"simpleText"\s*:\s*"([^"]+)"', chunk)
        if m_t:
            rich_titles.append(m_t.group(1).strip())

    if len(rich_titles) >= 2:
        seen = set()
        dups = []
        for t in rich_titles[:5]:
            if t in seen:
                dups.append(t[:28])
            seen.add(t)
        if dups:
            failures.append(f"최근 쇼츠 중복제목({dups[0]}...)")
        else:
            details.append(f"최근쇼츠({len(rich_titles)}건) 중복=0")
    else:
        details.append(f"공개쇼츠={len(rich_titles)}건")

    # 4. Channel-specific forbidden / required regex checks across /shorts + /about + RSS feed
    if spec.get("forbidden_regex") or spec.get("required_regex"):
        st_ab, _, raw_about, _ = fetch_external(
            f"https://www.youtube.com/channel/{cid}/about",
            bust_cache=True,
            extra_headers={"Cookie": "CONSENT=YES+cb.20210328-17-p0.en+FX+471"},
        )
        st_rss, _, raw_rss, _ = fetch_external(
            f"https://www.youtube.com/feeds/videos.xml?channel_id={cid}",
            bust_cache=True,
        )
        yt_haystack = "\n".join([
            html,
            raw_home if st_home == 200 else "",
            raw_about if st_ab == 200 else "",
            raw_rss if st_rss == 200 else "",
        ])
        for label, pattern, icase in spec.get("forbidden_regex", []):
            flags = re.I if icase else 0
            hits = re.findall(pattern, yt_haystack, flags=flags)
            if hits:
                failures.append(f"{label}: {len(hits)}건 검출")
            else:
                details.append(f"{label}=0건")
        for label, pattern in spec.get("required_regex", []):
            if not re.search(pattern, yt_haystack, flags=re.I):
                failures.append(f"{label} 누락")
            else:
                details.append(f"{label}=OK")

    passed = len(failures) == 0
    return {
        "kind": "YOUTUBE",
        "target": spec["key"],
        "div": spec["div"],
        "http": st,
        "last_modified": hdrs.get("date", "-"),
        "passed": passed,
        "summary": " | ".join(details) if passed else " ❌ " + "; ".join(failures),
    }


def run_audit(target_filter: str = "", web_only: bool = False) -> Dict[str, Any]:
    filt = (target_filter or "").strip().lower()
    web_targets = [
        s for s in SITE_SPECS
        if not filt or filt in s["key"].lower() or filt in s["div"].lower()
    ]
    yt_targets = [] if web_only else [
        y for y in YOUTUBE_SPECS
        if not filt or filt in y["key"].lower() or filt in y["expected_domain"].lower() or filt in y["div"].lower()
    ]

    results: List[Dict[str, Any]] = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        fut_map = {}
        for s in web_targets:
            fut_map[pool.submit(audit_single_website, s)] = ("WEB", s["key"])
        for y in yt_targets:
            fut_map[pool.submit(audit_single_youtube, y)] = ("YT", y["key"])
        for fut in as_completed(fut_map):
            results.append(fut.result())

    order_keys = [s["key"] for s in SITE_SPECS] + [y["key"] for y in YOUTUBE_SPECS]
    results.sort(key=lambda r: order_keys.index(r["target"]) if r["target"] in order_keys else 99)

    all_passed = len(results) > 0 and all(r["passed"] for r in results)
    return {
        "verdict": "ALL PASS" if all_passed else "FAIL",
        "checked_at_epoch": int(time.time()),
        "total_targets": len(results),
        "passed_count": sum(1 for r in results if r["passed"]),
        "failed_count": sum(1 for r in results if not r["passed"]),
        "results": results,
    }


def print_markdown_report(report: Dict[str, Any]) -> None:
    verdict = report["verdict"]
    badge = "✅ ALL PASS" if verdict == "ALL PASS" else f"❌ FAIL ({report['failed_count']} target(s) failed)"
    print(f"## [LIVE EXTERNAL AUDIT] Verdict: {badge}")
    print()
    print("| 구분 | 사업부 | 외부 점검 대상 | HTTP | Last-Modified / ETag | 판정 | 세부 검증 내역 |")
    print("| :---: | :--- | :--- | :---: | :--- | :---: | :--- |")
    for r in report["results"]:
        mark = "PASS ✅" if r["passed"] else "**FAIL ❌**"
        lm = str(r["last_modified"])[:34]
        print(f"| {r['kind']} | {r['div']} | `{r['target']}` | `{r['http']}` | `{lm}` | {mark} | {r['summary']} |")
    print()
    print(f"FINAL_VERDICT: {verdict} ({report['passed_count']}/{report['total_targets']})")


def main() -> int:
    parser = argparse.ArgumentParser(description="External Adversarial Live Production Auditor")
    parser.add_argument("target", nargs="?", default="", help="Optional domain or channel filter")
    parser.add_argument("--web-only", action="store_true", help="Audit only live websites")
    parser.add_argument("--json", action="store_true", help="Also print raw JSON output")
    args = parser.parse_args()

    report = run_audit(target_filter=args.target, web_only=args.web_only)
    print_markdown_report(report)
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["verdict"] == "ALL PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
