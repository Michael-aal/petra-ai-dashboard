# Quick Start - Petra AI Dashboard

## Run Locally (5 minutes)

```bash
cd backend
npm install
npm start
```

Visit: http://localhost:5000

Done! Start chatting with the AI.

## Deploy to Vercel (5 minutes)

```bash
git init
git add .
git commit -m "Petra AI Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/petra-ai-dashboard.git
git push -u origin main
```

Then:
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Click "Deploy"

## Features

✅ **AI Chat** - Works instantly, no API key needed (uses smart fallback)
✅ **Activities** - View and manage school activities
✅ **Announcements** - Latest school announcements
✅ **Dark/Light Theme** - Toggle between themes
✅ **Real-time Chat** - Instant responses

## Optional: Add OpenRouter API Key

For advanced AI with real large language models:

1. Sign up at https://openrouter.io
2. Get your API key
3. Add to `.env`:
   ```
   OPENROUTER_API_KEY=your_key_here
   ```
4. Restart server

The AI works great without this - the fallback system provides smart responses!

