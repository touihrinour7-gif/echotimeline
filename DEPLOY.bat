@echo off
chcp 65001 >nul
cls

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║           🔥 ECHOTIMELINE - AUTO DEPLOY SCRIPT 🔥        ║
echo ║                                                           ║
echo ║     Turn dusty albums into living timelines               ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Check if GitHub CLI is available
where gh >nul 2>&1
if %errorlevel% equ 0 (
    echo [1] GitHub CLI found! Creating repo automatically...
    echo.
    gh repo create echotimeline --public --description "Turn dusty albums into living timelines"
    echo.
    echo [OK] Repo created!
    echo.
    goto PUSH_CODE
)

echo.
echo [INFO] GitHub CLI not found. Let's create the repo together!
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║  STEP 1: Create GitHub Repository (1 minute)             ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 1. Open this link in your browser:
echo    https://github.com/new
echo.
echo 2. Fill in the form:
echo    - Repository name: echotimeline
echo    - Description: Turn dusty albums into living timelines
echo    - Public: SELECTED (default)
echo    - Add README: OFF (we already have one)
echo    - Add .gitignore: No .gitignore
echo    - License: No license
echo.
echo 3. Click "Create repository"
echo.
echo 4. Come back here and press any key to continue...
pause >nul

:PUSH_CODE
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║  STEP 2: Push Code to GitHub                              ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Set GitHub username
set /p GH_USER="Enter your GitHub username: "

echo.
echo Adding remote and pushing...
git remote add origin https://%GH_USER%@github.com/%GH_USER%/echotimeline.git 2>nul
git branch -M main
git push -u origin main

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║  STEP 3: Setup Firebase (5 minutes)                       ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 1. Go to: https://console.firebase.google.com/
echo.
echo 2. Click "Add project"
echo    - Name: echotimeline
echo    - Google Analytics: NO
echo.
echo 3. Enable Authentication:
echo    - Go to Authentication > Sign-in method
echo    - Enable "Google" provider
echo.
echo 4. Enable Firestore Database:
echo    - Go to Firestore Database > Create database
echo    - Location: us-central1
echo    - Mode: Start in production mode
echo.
echo 5. Enable Storage:
echo    - Go to Storage > Get started
echo    - Rules: Start in test mode
echo.
echo 6. Get your config:
echo    - Go to Project Settings (gear icon)
echo    - Scroll to "Your apps" > Click "</> (Web)"
echo    - Register app and copy the config values
echo.
echo Press any key when Firebase is setup...
pause >nul

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║  STEP 4: Deploy to Vercel (2 minutes)                     ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 1. Go to: https://vercel.com/new
echo.
echo 2. Click "Import" on your echotimeline repo
echo.
echo 3. Configure:
echo    - Framework Preset: Vite
echo    - Root Directory: client
echo.
echo 4. Before clicking Deploy, click "Environment Variables"
echo.
echo 5. Add these variables (from Firebase):
echo.
echo    Variable                    Value (from Firebase)
echo    ─────────────────────────────────────────────────────────
echo    VITE_FIREBASE_API_KEY       [copy from Firebase]
echo    VITE_FIREBASE_AUTH_DOMAIN   [copy from Firebase]
echo    VITE_FIREBASE_PROJECT_ID    [copy from Firebase]
echo    VITE_FIREBASE_STORAGE_BUCKET [copy from Firebase]
echo    VITE_FIREBASE_MESSAGING_SENDER_ID [copy from Firebase]
echo    VITE_FIREBASE_APP_ID        [copy from Firebase]
echo.
echo 6. Click Deploy!
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║  YOUR ECHOTIMELINE URL:                                     ║
echo ║  https://echotimeline.vercel.app                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo ===============================================================
echo FREE FOREVER! ✓
echo - Vercel: Unlimited projects
echo - Firebase: 1GB Firestore, 5GB Storage
echo - Maps: OpenStreetMap (free)
echo ===============================================================
echo.
echo Full guide: OPEN DEPLOY.md
echo.
pause
