@echo off
REM PETRA AI DASHBOARD - INSTANT DEPLOYMENT SCRIPT
REM This script will deploy to Vercel in 3 simple steps

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   PETRA AI DASHBOARD - VERCEL DEPLOYMENT (INSTANT)        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if in correct directory
if not exist "vercel.json" (
    echo ERROR: vercel.json not found! Make sure you're in the project root.
    pause
    exit /b 1
)

echo ✓ Project verified
echo.

REM Initialize Git if needed
if not exist ".git" (
    echo [1/4] Initializing Git repository...
    git init
    git add .
    git commit -m "Petra AI Dashboard - Ready for Vercel deployment"
    git branch -M main
    echo ✓ Git initialized
) else (
    echo ✓ Git repository already exists
)

echo.
echo ════════════════════════════════════════════════════════════
echo [2/4] NEXT STEPS - Follow these to complete deployment:
echo ════════════════════════════════════════════════════════════
echo.
echo STEP 1: Add GitHub remote (one-time only)
echo   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo   git push -u origin main
echo.
echo STEP 2: Connect to Vercel at https://vercel.com
echo   - Click "New Project"
echo   - Select your GitHub repository
echo   - Add environment variable: OPENROUTER_API_KEY
echo   - Click "Deploy"
echo.
echo STEP 3: Wait 2-3 minutes for deployment to complete
echo.
echo STEP 4: Visit https://your-project.vercel.app
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Alternative: Use Vercel CLI
echo   npm install -g vercel
echo   vercel --prod
echo.
pause
