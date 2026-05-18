@echo off
REM Quick Vercel Deployment Setup for Windows

echo.
echo 🚀 Petra AI Dashboard - Vercel Deployment Setup
echo ================================================
echo.

REM Check if Git is initialized
if exist .git (
  echo ✅ Git repository already initialized
) else (
  echo 📁 Initializing Git repository...
  git init
  git add .
  git commit -m "Initial commit for Vercel deployment"
  git branch -M main
  echo ✅ Git repository initialized
)

echo.
echo 📋 Setup Complete! Next steps:
echo.
echo 1. Push to GitHub:
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo    git push -u origin main
echo.
echo 2. Deploy to Vercel:
echo    vercel --prod
echo    (or sign up at https://vercel.com and connect repo)
echo.
echo 3. Set environment variables in Vercel Dashboard:
echo    - OPENROUTER_API_KEY ^(from https://openrouter.ai^)
echo.
echo 4. Test deployment:
echo    https://your-project.vercel.app
echo.
echo For detailed guide, see: VERCEL_DEPLOYMENT_GUIDE.md
echo.
pause
