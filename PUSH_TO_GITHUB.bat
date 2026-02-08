@echo off
chcp 65001 >nul
cls

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║       🔥 PUSH ECHOTIMELINE TO GITHUB - AUTO SCRIPT 🔥    ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Get GitHub username
set /p GH_USER="Enter your GitHub username: "

REM Get GitHub token
set /p GH_TOKEN="Enter your GitHub Personal Access Token: "

echo.
echo [1/4] Creating GitHub repository...
echo.

curl -s -X POST "https://api.github.com/user/repos" ^
  -H "Accept: application/vnd.github.v3+json" ^
  -H "Authorization: token %GH_TOKEN%" ^
  -d "{\"name\":\"echotimeline\",\"description\":\"Turn dusty albums into living timelines - free, private, forever\",\"private\":false}"

echo.
echo [2/4] Adding Git remote...
git remote remove origin 2>nul
git remote add origin "https://%GH_USER%:%GH_TOKEN%@github.com/%GH_USER%/echotimeline.git"

echo.
echo [3/4] Pushing to GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║   ✅ ECHOTIMELINE PUSHED TO GITHUB!                       ║
echo ║                                                           ║
echo ║   Repo URL: https://github.com/%GH_USER%/echotimeline    ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo Now you can give the CLAUDE_PROMPT.md to Claude Opus 4!
echo.
pause
