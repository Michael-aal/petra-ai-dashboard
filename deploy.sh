#!/bin/bash
# Quick Vercel Deployment Script

echo "🚀 Petra AI Dashboard - Vercel Deployment Setup"
echo "================================================"

# Check if Git is initialized
if [ ! -d .git ]; then
  echo "📁 Initializing Git repository..."
  git init
  git add .
  git commit -m "Initial commit for Vercel deployment"
  git branch -M main
else
  echo "✅ Git repository already initialized"
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "📦 Installing Vercel CLI..."
  npm install -g vercel
else
  echo "✅ Vercel CLI already installed"
fi

echo ""
echo "📋 Setup Complete! Next steps:"
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "3. Set environment variables in Vercel Dashboard:"
echo "   - OPENROUTER_API_KEY"
echo ""
echo "For detailed guide, see: VERCEL_DEPLOYMENT_GUIDE.md"
