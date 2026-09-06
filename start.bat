@echo off
TITLE KisanKart Launch Assistant
color 0A
cd /d "%~dp0"

echo =================================================================
echo        KisanKart - 1-Click Launch Assistant
echo =================================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this machine!
    echo Please download and install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 2. Check dependencies
if not exist "node_modules" (
    echo [*] Installing project dependencies (first run only)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

:: 3. Run launch script
node scripts/launch.js
if %errorlevel% neq 0 (
    echo.
    echo [NOTE] Server terminated.
    pause
)
