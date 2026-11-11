"""
Empirical Challenger Bundle Verification Script
Validates static build assets across dist/, frontend/dist/, and assets/
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

JS_FILES = [
    ROOT / "dist" / "assets" / "index-BIziPp23.js",
    ROOT / "frontend" / "dist" / "assets" / "index-BIziPp23.js",
    ROOT / "assets" / "index-BIziPp23.js",
]

CSS_FILES = [
    ROOT / "dist" / "assets" / "index-CaOpdap3.css",
    ROOT / "frontend" / "dist" / "assets" / "index-CaOpdap3.css",
    ROOT / "assets" / "index-CaOpdap3.css",
]

MONTHLY_UUID = "d5e7e761-8b1b-4ca8-b1fe-771acd1450f8"
LIFETIME_UUID = "667aa482-f17c-47d1-b7f3-a2427c36516b"
STORE_ID = "296100"

def verify_bundles():
    passed = 0
    total = 0

    print("=== Empirical Asset Bundle Verification ===")
    for js_path in JS_FILES:
        total += 1
        assert js_path.exists(), f"File does not exist: {js_path}"
        code = js_path.read_text(encoding="utf-8")
        size = len(code)
        
        checks = {
            "Position Doctor preview container": "docVipIgnitionPreviewCard" in code,
            "Monthly VIP Live UUID": MONTHLY_UUID in code,
            "Lifetime VIP Live UUID": LIFETIME_UUID in code,
            "Store #296100 reference": STORE_ID in code,
            "embed=1 query param": "embed=1" in code,
            "lemonsqueezy-button class": "lemonsqueezy-button" in code,
            "DOM closest delegation": "closest(\".lemonsqueezy-button\")" in code,
            "LemonSqueezy.Url.Open invocation": "window.LemonSqueezy.Url.Open(href)" in code or "LemonSqueezy.Url.Open" in code,
            "formatDoctorResult state parameter": "formatDoctorResult" in code and "renderDoctorVipUnlockPreview" in code,
        }
        
        failed_checks = [name for name, result in checks.items() if not result]
        if failed_checks:
            print(f"[FAIL] {js_path.relative_to(ROOT)} ({size} bytes): Failed checks: {failed_checks}")
            sys.exit(1)
        else:
            print(f"[PASS] {js_path.relative_to(ROOT)} ({size} bytes): All 9 bundle assertions passed")
            passed += 1

    for css_path in CSS_FILES:
        total += 1
        assert css_path.exists(), f"File does not exist: {css_path}"
        css = css_path.read_text(encoding="utf-8")
        size = len(css)
        
        checks = {
            ".doc-vip-preview-card selector": ".doc-vip-preview-card" in css,
            ".doc-blur-lock selector": ".doc-blur-lock" in css,
            ".blurred-cell selector": ".blurred-cell" in css,
            "blur(5px) filter": "blur(5px)" in css,
        }
        
        failed_checks = [name for name, result in checks.items() if not result]
        if failed_checks:
            print(f"[FAIL] {css_path.relative_to(ROOT)} ({size} bytes): Failed checks: {failed_checks}")
            sys.exit(1)
        else:
            print(f"[PASS] {css_path.relative_to(ROOT)} ({size} bytes): All 4 CSS assertions passed")
            passed += 1

    print(f"\nAll {passed}/{total} bundle files passed 100% verification.")

if __name__ == "__main__":
    verify_bundles()
