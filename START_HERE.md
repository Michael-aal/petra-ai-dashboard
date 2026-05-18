# 🚀 Start Your Dashboard - Complete Guide

## ✅ Everything is Ready!

Your AI Dashboard frontend is configured to communicate with the backend at `http://localhost:5000/api`

---

## Step 1️⃣: Start the Backend Server

### Windows Users (EASIEST):
1. Open file explorer
2. Go to: `c:\Users\austi\Videos\ai dashboard\backend\`
3. **Double-click:** `start_server.bat`
4. A command window will open and show:
```
🚀 Server running on http://localhost:5000
🤖 OpenRouter API enabled
💾 SQLite database connected
```

### Or use Command Prompt/PowerShell:
```bash
cd c:\Users\austi\Videos\ai dashboard\backend
node server.js
```

**✅ Keep this window open!**

---

## Step 2️⃣: Open the Dashboard Frontend

Once the server is running:

### Option A: Open HTML File Directly
1. Open file explorer
2. Go to: `c:\Users\austi\Videos\ai dashboard\user interface\`
3. **Double-click:** `index.html`
4. It opens in your default browser

### Option B: Using a Web Server (Better)
Open a **NEW** command prompt/PowerShell:
```bash
cd c:\Users\austi\Videos\ai dashboard\user interface
python -m http.server 8000
```
Then open browser: `http://localhost:8000`

### Option C: Direct URL
Just type in your browser:
```
http://localhost:5000
```

---

## Step 3️⃣: Start Chatting! 💬

Once the dashboard opens:
1. **Type a message** in the chat input box at the bottom
2. **Press Enter** or **click Send button** ➡️
3. **Wait for AI response** from OpenRouter

### Example Messages to Try:
- "What activities does the school have?"
- "Tell me about announcements"
- "Hello! How are you?"
- "What can you help me with?"

---

## 📋 What's Happening Behind the Scenes

```
You type message in browser
    ↓
Frontend sends to: http://localhost:5000/api/chat
    ↓
Backend (Node.js server) receives it
    ↓
Server adds school context (activities, announcements)
    ↓
Sends to OpenRouter AI via OPENROUTER_API_KEY
    ↓
AI generates response
    ↓
Response stored in database
    ↓
Sent back to frontend
    ↓
Message appears in chat! ✨
```

---

## ✅ Checklist

- [ ] Backend server running (`node server.js`)
- [ ] Can see "🚀 Server running on http://localhost:5000"
- [ ] Dashboard opened in browser
- [ ] Type a message and press Enter
- [ ] See typing indicator (3 bouncing dots)
- [ ] AI response appears in chat ✅

---

## 🆘 Troubleshooting

**Q: Dashboard won't load?**
- Make sure backend is running first
- Check that `http://localhost:5000` shows server is running
- Try opening: `http://localhost:5000/health`

**Q: Messages not sending?**
- Check console for errors (F12 in browser)
- Make sure OPENROUTER_API_KEY is in `.env`
- Verify server is still running

**Q: Slow responses?**
- OpenRouter may be processing
- API free tier has rate limits
- Wait a moment and try again

**Q: Port 5000 already in use?**
- Change PORT in `.env`: `PORT=5001`
- Update API_URL in `script.js`

---

## 🎉 You're All Set!

Your AI-powered school dashboard is ready to use with:
- ✅ Professional SaaS colors
- ✅ OpenRouter AI integration
- ✅ School activities & announcements
- ✅ Real-time chat with AI

**Start the server and have fun!** 🚀

---

**Files to Remember:**
- Backend: `c:\Users\austi\Videos\ai dashboard\backend\server.js`
- Frontend: `c:\Users\austi\Videos\ai dashboard\user interface\index.html`
- Config: `c:\Users\austi\Videos\ai dashboard\backend\.env`
