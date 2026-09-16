@echo off
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%
echo Starting Logic Tech Frontend...
"C:\Program Files\nodejs\npm.cmd" run dev
pause
