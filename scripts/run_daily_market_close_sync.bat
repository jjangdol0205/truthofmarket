@echo off
cd /d "D:\드림컴퍼니\1사업부"
set PYTHONIOENCODING=utf-8
python "D:\드림컴퍼니\1사업부\scripts\run_daily_market_close_sync.py" --broadcast --notify
