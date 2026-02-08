@echo off
echo ============================================
echo EchoTimeline - Quick Setup Script
echo ============================================
echo.

REM Check if git remote exists
cd %~dp0
git remote geturl origin >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Git remote already configured
    echo.
    goto PUSH
)

REM GitHub Username
set /p GH_USERNAME="Enter your GitHub username: "

echo.
echo Creating GitHub repository...
echo.

REM Create GitHub repo using API (requires token)
set /p GH_TOKEN="Enter your GitHub Personal Access Token (create at https://github.com/settings/tokens): "

curl -s -X POST "https://api.github.com/user/repos" ^
  -H "Accept: application/vnd.github.v3+json" ^
  -H "Authorization: token %GH_TOKEN%" ^
  -d "{\"name\":\"echotimeline\",\"description\":\"Turn dusty albums into living timelines - free, private, forever\",\"private\":false}"

echo.
echo Adding Git remote...
git remote add origin https://%GH_USERNAME%:echotimeline.git

:PUSH
echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ============================================
echo GitHub Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com/new
echo 2. Import your echotimeline repo
echo 3. Add Firebase config in Vercel environment variables:
echo    - VITE_FIREBASE_API_KEY
echo    - VITE_FIREBASE_AUTH_DOMAIN
echo    - VITE_FIREBASE_PROJECT_ID
echo    - VITE_FIREBASE_STORAGE_BUCKET
echo    - VITE_FIREBASE_MESSAGING_SENDER_ID
echo    - VITE_FIREBASE_APP_ID
echo 4. Deploy!
echo.
pause
