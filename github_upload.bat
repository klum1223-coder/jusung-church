@echo off
echo ===============================================
echo Jusung Church - Force Upload to GitHub
echo Repository: https://github.com/klum1223-coder/jusung-church.git
echo ===============================================

echo [1/4] Fixing dependencies (Tailwind error fix)...
call npm install

echo [2/4] configuring Git repository...
git init
REM Remove verification to avoid errors if origin doesn't exist
git remote remove origin 2>nul
git remote add origin https://github.com/klum1223-coder/jusung-church.git

echo [3/4] Saving all files...
git add .
git commit -m "Site Update: Force overwrite from local"

echo [4/4] Force uploading to GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ===============================================
echo Upload Complete! 
echo You can now download this code on another computer.
echo ===============================================
pause
