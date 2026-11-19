@echo off
setlocal
set PYTHONIOENCODING=utf-8
cd /d "%~dp0.."
if "%1"=="" (
    python scripts\hq_24h_hourly_scheduler.py --silent
) else (
    python scripts\hq_24h_hourly_scheduler.py %*
)
