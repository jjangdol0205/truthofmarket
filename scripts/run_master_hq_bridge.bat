@echo off
setlocal
cd /d "%~dp0.."
if "%1"=="" (
    node scripts\master_hq_telegram_bridge.js 1>> data\master_hq_bridge.log 2>> data\master_hq_bridge.err.log
) else (
    node scripts\master_hq_telegram_bridge.js %*
)
