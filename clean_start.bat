@echo off
echo ==========================================
echo Jusung Church Website - Cache Clean & Start
echo ==========================================

echo [1/2] Stopping active processes...
taskkill /f /im node.exe >nul 2>&1

echo [2/2] Cleaning Next.js cache...
if exist .next (
    rmdir /s /q .next
    echo Cache deleted.
) else (
    echo Cache already clean.
)

echo.
echo Starting development server...
npm run dev
