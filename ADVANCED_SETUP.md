# 🚀 ADVANCED SETUP: OpenAI + SQLite Integration

## What's New (v2.0)

✅ **Real AI Responses** - Connected to OpenAI GPT-3.5 Turbo  
✅ **Database** - SQLite for persistent data storage  
✅ **School Management** - Add/edit activities and announcements  
✅ **Chat History** - All chats stored in database  
✅ **Better UI** - Typing indicators, timestamps, animations  
✅ **Advanced Endpoints** - Full CRUD operations  

---

## 📋 STEP-BY-STEP SETUP

### Step 1: Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a **New API Key**
4. Copy the key (starts with `sk-`)
5. **Keep it secret!** (Don't share or commit to git)

**Cost:** ~$0.002 per 1000 tokens (~500 chat messages)

---

### Step 2: Update .env File

Edit `c:\Users\austi\Videos\ai dashboard\backend\.env`:

```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Replace `sk-your-actual-api-key-here` with your real key!**

---

### Step 3: Install New Dependencies

```bash
cd "c:\Users\austi\Videos\ai dashboard\backend"
npm install
```

This installs:
- ✅ `sqlite3` - Database
- ✅ `openai` - AI integration

---

### Step 4: Start Backend

```bash
npm start
```

**You should see:**
```
✅ Connected to SQLite database
🚀 Server running on http://localhost:5000
🤖 OpenAI GPT-3.5 enabled
💾 SQLite database connected
📊 API available at http://localhost:5000/api
```

---

### Step 5: Start Frontend

**In a NEW terminal:**

```bash
cd "c:\Users\austi\Videos\ai dashboard\user interface"
python -m http.server 3000
```

---

### Step 6: Open Dashboard

```
http://localhost:3000
```

---

## 🎯 TEST IT

Try these messages:

1. **"Hello"** → Real AI responds
2. **"What activities do you have?"** → AI reads from database
3. **"Tell me about the Math Club"** → AI gives smart response
4. **"When is Sports Day?"** → AI looks up schedule

---

## 📊 NEW API ENDPOINTS

### School Management

```
GET  /api/school                    → School info
POST /api/school/update             → Update school info

GET  /api/activities                → List activities
POST /api/activities/add            → Add activity
DELETE /api/activities/:id          → Delete activity

GET  /api/announcements             → List announcements
POST /api/announcements/add         → Add announcement
DELETE /api/announcements/:id       → Delete announcement
```

### Chat

```
POST /api/chat                      → Send message (uses OpenAI)
GET  /api/chat-history              → Get all chats
DELETE /api/chat-history            → Clear history
```

---

## 💾 DATABASE SCHEMA

Your data is stored in `backend/school.db`:

### `activities` Table
```
id (auto)
name TEXT
description TEXT
time TEXT
created_at DATETIME
```

### `announcements` Table
```
id (auto)
title TEXT
content TEXT
date TEXT
created_at DATETIME
```

### `school_info` Table
```
id (auto)
key TEXT (unique)
value TEXT
updated_at DATETIME
```

### `chat_history` Table
```
id (auto)
user_message TEXT
ai_response TEXT
created_at DATETIME
```

---

## 🔧 TESTING WITH CURL

### Test Chat Endpoint

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

### Get Activities

```bash
curl http://localhost:5000/api/activities
```

### Add Activity

```bash
curl -X POST http://localhost:5000/api/activities/add \
  -H "Content-Type: application/json" \
  -d '{"name": "Chess Club", "description": "Learn chess", "time": "4:00 PM"}'
```

---

## 🆘 TROUBLESHOOTING

### "OpenAI API error" or "invalid api key"

**Solution:**
1. Check your `.env` file has correct API key
2. Ensure key starts with `sk-`
3. Go to https://platform.openai.com/account/api-keys to verify key still works
4. Restart backend server

### "Cannot find module 'sqlite3'"

**Solution:**
```bash
cd backend
npm install sqlite3
npm start
```

### "Port 5000 in use"

**Solution:**
Change in `.env`:
```env
PORT=3001
```

### Database locked error

**Solution:**
1. Stop backend (Ctrl+C)
2. Delete `backend/school.db`
3. Run `npm start` again

### Nothing loads in browser

**Solution:**
1. Check browser console (F12)
2. Verify both servers running
3. Try `http://localhost:3000`
4. Hard refresh (Ctrl+Shift+R)

---

## 📈 FEATURES OVERVIEW

### What AI Can Do Now

The AI reads from your database and responds intelligently:

```
User: "What activities are available?"
AI: "We have 5 activities: Math Club (3:00 PM) - Weekly math 
     competitions, Science Lab (2:30 PM) - Hands-on science..."

User: "When is the Sports Day?"
AI: "Sports Day is scheduled for 4:00 PM. It's an inter-school 
     sports competition. Would you like to know about other activities?"

User: "Tell me about Petra School"
AI: "Petra School is a premier educational institution focused on 
     excellence and innovation. We offer various activities..."
```

---

## 🎨 IMPROVED UI FEATURES

### New Chat Features

- ✅ **Typing Indicator** - Shows when AI is thinking
- ✅ **Message Timestamps** - See when messages sent
- ✅ **Better Bubbles** - Styled like modern chat apps
- ✅ **Smooth Animations** - Messages fade in
- ✅ **Dark Mode** - Full dark theme support
- ✅ **Responsive** - Works on all screen sizes

---

## 🔐 SECURITY NOTES

### API Key Best Practices

1. **Never commit .env to git**
2. **Never share your API key**
3. **Rotate keys regularly** (on OpenAI dashboard)
4. **Use environment variables** in production
5. **Monitor usage** (check billing on OpenAI)

### Set up .gitignore

Create `backend/.gitignore`:
```
node_modules/
.env
school.db
*.log
```

---

## 💡 NEXT STEPS

### Immediate (Easy)

1. Add more school information via database
2. Create admin form to add activities
3. Customize AI personality
4. Add school logo/images

### Medium (Medium)

1. Add user authentication
2. Create admin dashboard
3. Add activity registration
4. Send notifications

### Advanced (Hard)

1. Deploy to cloud (Heroku, AWS)
2. Add WebSocket for real-time chat
3. Integrate payment system
4. Mobile app with React Native

---

## 📊 COST BREAKDOWN

### OpenAI Pricing
- **Model:** gpt-3.5-turbo
- **Input:** $0.0005 / 1K tokens
- **Output:** $0.0015 / 1K tokens
- **Average message:** ~50 tokens = $0.00003
- **1000 chats:** ~$0.03

**Very affordable!** 💰

---

## 🎓 PRODUCTION CHECKLIST

Before deploying to production:

- [ ] Remove API key from code
- [ ] Use environment variables
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Add error logging
- [ ] Monitor API usage
- [ ] Set up backups
- [ ] Test with multiple users
- [ ] Document API changes

---

## 📚 FILES CHANGED

**Backend:**
- ✅ `server.js` - Added OpenAI + SQLite integration
- ✅ `package.json` - Added sqlite3 & openai packages
- ✅ `.env` - Added OPENAI_API_KEY

**Frontend:**
- ✅ `script.js` - Better chat logic, typing indicators
- ✅ `style.css` - Better styling, animations

---

## 🚀 YOU'RE READY!

Your Petra AI Dashboard now has:
- ✅ Real AI responses from OpenAI
- ✅ Persistent data in SQLite
- ✅ Professional UI with animations
- ✅ Full CRUD API endpoints
- ✅ Production-ready code

**Start chatting with real AI!** 🤖

```bash
npm start
# Open http://localhost:3000
```

---

## 📞 QUICK REFERENCE

```bash
# Backend setup (first time)
cd backend
npm install

# Start backend
npm start

# Start frontend (new terminal)
cd "user interface"
python -m http.server 3000

# Open browser
http://localhost:3000
```

**Need help?** Check the comprehensive guides in session files.

Happy building! 🎉
