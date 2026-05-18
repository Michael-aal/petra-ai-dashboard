# 🏗️ Dashboard Architecture & Communication

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR BROWSER                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         FRONTEND (React-like UI)                         │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  index.html (Structure)                            │  │   │
│  │  │  style.css (Professional SaaS Colors)             │  │   │
│  │  │  script.js (Chat Logic & API Calls)               │  │   │
│  │  │                                                    │  │   │
│  │  │  📤 Sends: { message: "user input" }              │  │   │
│  │  │  📥 Receives: { ai_response: "..." }              │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  │  Display Components:                                      │   │
│  │  ├─ Left Sidebar (Activities, Projects)                 │   │
│  │  ├─ Main Chat Area (Messages)                           │   │
│  │  ├─ Input Box (Send Message)                            │   │
│  │  ├─ Typing Indicator (Loading dots)                     │   │
│  │  └─ Theme Toggle (Light/Dark mode)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
              HTTP POST/GET (JSON over HTTPS)
                         localhost:5000
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    NODE.JS SERVER (Backend)                      │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         server.js (Express.js)                           │   │
│  │                                                          │   │
│  │  API ENDPOINTS:                                         │   │
│  │  ├─ POST   /api/chat              → Send to AI         │   │
│  │  ├─ GET    /api/chat-history      → Get past chats    │   │
│  │  ├─ GET    /api/activities        → Get activities    │   │
│  │  ├─ GET    /api/announcements     → Get news          │   │
│  │  ├─ GET    /api/school            → Get info          │   │
│  │  └─ GET    /health                → Check status      │   │
│  │                                                          │   │
│  │  1. Receive message from frontend                       │   │
│  │  2. Fetch school context from SQLite                    │   │
│  │  3. Build system prompt with activities/announcements   │   │
│  │  4. Call OpenRouter API with message                    │   │
│  │  5. Store message pair in database                      │   │
│  │  6. Return response to frontend                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         SQLite Database (school.db)                      │   │
│  │                                                          │   │
│  │  Tables:                                                │   │
│  │  ├─ chat_history      (user messages & AI responses)   │   │
│  │  ├─ activities        (school activities)              │   │
│  │  ├─ announcements     (school news)                    │   │
│  │  └─ school_info       (school details)                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         .env Configuration                              │   │
│  │                                                          │   │
│  │  PORT=5000                                              │   │
│  │  OPENROUTER_API_KEY=sk-or-v1-...                       │   │
│  │  NODE_ENV=development                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                   HTTPS Request (Secure)
              https://openrouter.ai/api/v1/...
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│              OPENROUTER AI (External Service)                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Model: gpt-3.5-turbo                                   │   │
│  │  Authentication: Bearer Token (OPENROUTER_API_KEY)      │   │
│  │                                                          │   │
│  │  Receives:                                              │   │
│  │  ├─ System Prompt (school context)                     │   │
│  │  └─ User Message (user input)                          │   │
│  │                                                          │   │
│  │  Responds with:                                         │   │
│  │  └─ AI-generated response text                         │   │
│  │                                                          │   │
│  │  Features:                                              │   │
│  │  ├─ Max 200 tokens per response                        │   │
│  │  ├─ Temperature 0.7 (balanced creativity)              │   │
│  │  ├─ Fast responses (2-5 seconds)                       │   │
│  │  └─ Free tier available                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Message Flow Sequence Diagram

```
┌─────────────┐                 ┌─────────────┐                 ┌──────────────┐
│  FRONTEND   │                 │   BACKEND   │                 │  OPENROUTER  │
│  (Browser)  │                 │   (Node.js) │                 │     AI       │
└──────┬──────┘                 └──────┬──────┘                 └──────┬───────┘
       │                               │                               │
       │  1️⃣ User types message       │                               │
       │     "What activities?"        │                               │
       │                               │                               │
       │  2️⃣ Frontend captures        │                               │
       │     Shows typing indicator    │                               │
       │                               │                               │
       │  3️⃣ POST /api/chat           │                               │
       │     { "message": "..." }      │                               │
       ├──────────────────────────────→│                               │
       │                               │                               │
       │                               │  4️⃣ Server receives          │
       │                               │     message                   │
       │                               │                               │
       │                               │  5️⃣ Query SQLite             │
       │                               │     Get activities,           │
       │                               │     announcements             │
       │                               │                               │
       │                               │  6️⃣ Build system prompt      │
       │                               │     with context              │
       │                               │                               │
       │                               │  7️⃣ HTTPS Request            │
       │                               │     With auth header          │
       │                               ├──────────────────────────────→
       │                               │                               │
       │                               │                               │  8️⃣ AI Process
       │                               │                               │     message
       │                               │                               │
       │                               │                               │  9️⃣ Generate
       │                               │                               │     response
       │                               │                               │
       │                               │  🔟 AI Response JSON          │
       │                               │←──────────────────────────────┤
       │                               │                               │
       │                               │  1️⃣1️⃣ Parse response          │
       │                               │     Extract AI message        │
       │                               │                               │
       │                               │  1️⃣2️⃣ Store in SQLite        │
       │                               │     chat_history table        │
       │                               │                               │
       │  1️⃣3️⃣ JSON Response           │                               │
       │  { ai_response: "..." }       │                               │
       │←──────────────────────────────┤                               │
       │                               │                               │
       │  1️⃣4️⃣ Display AI message     │                               │
       │     Remove typing indicator   │                               │
       │     Show in chat bubble       │                               │
       │                               │                               │
```

---

## Component Interaction Map

```
FRONTEND (Script.js)
│
├─ Event Listeners
│  ├─ Send Button Click
│  ├─ Enter Key Press
│  ├─ Theme Toggle
│  └─ Settings Menu
│
├─ API Functions
│  ├─ sendMessage()
│  │  └─ fetch POST /api/chat
│  ├─ loadActivities()
│  │  └─ fetch GET /api/activities
│  ├─ loadAnnouncements()
│  │  └─ fetch GET /api/announcements
│  └─ loadSchoolInfo()
│     └─ fetch GET /api/school
│
├─ Display Functions
│  ├─ displayUserMessage()
│  ├─ displayAIMessage()
│  ├─ showTypingIndicator()
│  ├─ removeTypingIndicator()
│  └─ updateUI()
│
└─ State Management
   ├─ chatHistory []
   ├─ darkMode boolean
   └─ schoolData object


BACKEND (Server.js)
│
├─ Database Connection
│  └─ SQLite3 (school.db)
│
├─ API Routes
│  ├─ POST /api/chat
│  │  ├─ Validate message
│  │  ├─ Fetch school context
│  │  ├─ Build system prompt
│  │  ├─ Call OpenRouter
│  │  ├─ Store in database
│  │  └─ Return response
│  │
│  ├─ GET /api/chat-history
│  ├─ GET /api/activities
│  ├─ GET /api/announcements
│  ├─ GET /api/school
│  └─ GET /health
│
├─ Helper Functions
│  ├─ getSchoolContextAsync()
│  ├─ buildSystemPrompt()
│  ├─ callOpenRouterAPI()
│  └─ initializeDatabase()
│
├─ Error Handling
│  ├─ Validation errors
│  ├─ API errors
│  ├─ Database errors
│  └─ Response errors
│
└─ Environment Config
   └─ OPENROUTER_API_KEY
   └─ PORT
   └─ NODE_ENV
```

---

## Data Model

```
CHAT MESSAGE PAIR
┌──────────────────────────────────────┐
│ id: 1                                │
│ user_message: "Hello"                │
│ ai_response: "Hi there! How can..."  │
│ created_at: 2026-05-16T14:26:12Z     │
└──────────────────────────────────────┘

SCHOOL ACTIVITY
┌──────────────────────────────────────┐
│ id: 1                                │
│ name: "Math Club"                    │
│ description: "Weekly competitions"   │
│ time: "3:00 PM"                      │
│ created_at: 2026-05-16T...           │
└──────────────────────────────────────┘

ANNOUNCEMENT
┌──────────────────────────────────────┐
│ id: 1                                │
│ title: "School Opening"              │
│ content: "January 15, 2024"          │
│ date: "2024-01-01"                   │
│ created_at: 2026-05-16T...           │
└──────────────────────────────────────┘
```

---

## Communication Protocol

```
REQUEST (Frontend → Backend)
{
  "method": "POST",
  "url": "http://localhost:5000/api/chat",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "message": "What activities are there?"
  }
}

RESPONSE (Backend → Frontend)
{
  "status": 200,
  "body": {
    "user_message": "What activities are there?",
    "ai_response": "Petra School has Math Club, Science Lab...",
    "timestamp": "2026-05-16T14:26:12.332Z"
  }
}
```

---

## Technology Stack

```
FRONTEND
├─ HTML5 (Structure)
├─ CSS3 (Styling - SaaS colors)
│  ├─ Primary Blue: #3b7bff
│  ├─ Neutral Grays: #f9fafb to #111827
│  └─ Accent Teal: #10b981
├─ Vanilla JavaScript (Logic)
│  └─ Fetch API (HTTP requests)
└─ FontAwesome Icons

BACKEND
├─ Node.js (Runtime)
├─ Express.js (Web framework)
├─ SQLite3 (Database)
├─ CORS (Cross-origin requests)
└─ HTTPS (Secure connections)

EXTERNAL API
└─ OpenRouter (GPT-3.5-Turbo)

CONFIGURATION
└─ dotenv (.env file)
```

---

## You're All Set! 🎉

Your dashboard uses **modern architecture** with:
- ✅ Clean separation of frontend & backend
- ✅ RESTful API communication
- ✅ Real-time AI responses
- ✅ Persistent data storage
- ✅ Professional UI/UX
- ✅ Secure API integration

**Ready to communicate!** 🚀
