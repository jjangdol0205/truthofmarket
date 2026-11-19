@echo off
setlocal
set PYTHONIOENCODING=utf-8
cd /d "%~dp0.."
python scripts\run_daily_market_close_sync.py --broadcast --notify
