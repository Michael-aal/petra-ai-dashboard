# 💬 Frontend-Backend Communication Guide

## How Your Dashboard Works

Your dashboard has **two main parts** that talk to each other:

### 🖥️ Frontend (User Interface)
- **File:** `user interface/index.html`
- **Styles:** `user interface/style.css`
- **Logic:** `user interface/script.js`
- **Purpose:** Shows the chat interface, lets you type messages
- **API Base:** `http://localhost:5000/api`

### 🔌 Backend (Server)
- **File:** `backend/server.js`
- **Database:** `backend/school.db` (SQLite)
- **Config:** `backend/.env` (stores OPENROUTER_API_KEY)
- **Purpose:** Processes messages, calls OpenRouter AI, stores history

---

## Communication Flow 📡

### When You Send a Message:

```
1. USER TYPES MESSAGE
   └─ Clicks Send or presses Enter
      └─ script.js captures input: "What activities are there?"

2. FRONTEND SENDS REQUEST
   └─ POST to http://localhost:5000/api/chat
   └─ Headers: { 'Content-Type': 'application/json' }
   └─ Body: { "message": "What activities are there?" }

3. BACKEND RECEIVES REQUEST
   └─ server.js /api/chat endpoint gets the message
   └─ Fetches school context (activities, announcements)
   └─ Creates system prompt with school info

4. CALLS OPENROUTER AI
   └─ Sends to https://openrouter.ai/api/v1/chat/completions
   └─ Model: gpt-3.5-turbo
   └─ Authorization: Bearer OPENROUTER_API_KEY from .env
   └─ Max tokens: 200
   └─ Temperature: 0.7

5. AI RESPONDS
   └─ OpenRouter generates response
   └─ Returns: "Petra School has: Math Club, Science Lab, Sports Day..."

6. BACKEND PROCESSES RESPONSE
   └─ Stores message in SQLite database (chat_history table)
   └─ Returns JSON response with:
      ├─ user_message: "What activities are there?"
      ├─ ai_response: "Petra School has..."
      └─ timestamp: "2026-05-16T14:26:12.332Z"

7. FRONTEND RECEIVES RESPONSE
   └─ script.js gets the JSON data
   └─ Removes typing indicator (3 dots)
   └─ Calls displayAIMessage()

8. DISPLAYS IN CHAT
   └─ Message appears in gray bubble
   └─ Formatted with timestamp
   └─ Animation: fadeIn 0.3s
```

---

## API Endpoints Your Frontend Uses

### 1. Send Message
```
POST /api/chat

Request:
{
  "message": "Your question here"
}

Response:
{
  "user_message": "Your question here",
  "ai_response": "AI's answer",
  "timestamp": "2026-05-16T14:26:12.332Z"
}
```

### 2. Get Chat History
```
GET /api/chat-history

Response: [
  { id: 1, user_message: "Hello", ai_response: "Hi there!", created_at: "..." },
  { id: 2, user_message: "...", ai_response: "...", created_at: "..." }
]
```

### 3. Get Activities
```
GET /api/activities

Response: [
  { id: 1, name: "Math Club", description: "...", time: "3:00 PM" },
  { id: 2, name: "Science Lab", description: "...", time: "2:30 PM" }
]
```

### 4. Get Announcements
```
GET /api/announcements

Response: [
  { id: 1, title: "School Opening", content: "...", date: "2024-01-01" }
]
```

### 5. Get School Info
```
GET /api/school

Response: {
  "school_name": "Petra School",
  "school_description": "A premier educational institution...",
  "contact": "+1-800-PETRA-SCHOOL",
  "email": "info@petraschool.edu"
}
```

---

## Key Code Snippets

### Frontend Sends Message (script.js)
```javascript
async function sendMessage() {
  const message = inputField.value.trim();
  
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  
  const data = await response.json();
  displayAIMessage(data.ai_response);
}
```

### Backend Receives & Processes (server.js)
```javascript
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  // Get school context
  getSchoolContextAsync(async (context) => {
    // Build system prompt with school info
    const systemPrompt = buildSystemPrompt(context);
    
    // Call OpenRouter AI
    const aiResponse = await callOpenRouterAPI(systemPrompt, message);
    
    // Store in database
    db.run('INSERT INTO chat_history ...', [message, aiResponse]);
    
    // Send response back to frontend
    res.json({
      user_message: message,
      ai_response: aiResponse,
      timestamp: new Date()
    });
  });
});
```

---

## Data Storage

### SQLite Database (`backend/school.db`)

#### chat_history table
```
| id | user_message | ai_response | created_at |
|----|--------------|-------------|------------|
| 1  | "Hello"      | "Hi there!" | 2026-05-16 |
```

#### activities table
```
| id | name | description | time | created_at |
|----|------|-------------|------|------------|
| 1  | "Math Club" | "Weekly competitions" | "3:00 PM" | ... |
```

#### announcements table
```
| id | title | content | date | created_at |
|----|-------|---------|------|------------|
| 1  | "School Opening" | "Jan 15, 2024" | "2024-01-01" | ... |
```

---

## CORS Configuration

✅ **CORS is enabled** in backend (`server.js`):
```javascript
app.use(cors());
```

This allows frontend to make requests from:
- `http://localhost:8000`
- `http://localhost:5000`
- Any origin during development

---

## Environment Variables

### `.env` File (backend)
```
PORT=5000                    # Server port
NODE_ENV=development         # Environment
OPENROUTER_API_KEY=...       # Your API key
```

### Frontend Config
```javascript
const API_URL = 'http://localhost:5000/api';  // in script.js
```

---

## Error Handling

### If API call fails:
```javascript
catch (error) {
  console.error('Chat error:', error);
  displayAIMessage('Sorry, I encountered an error. Please check your OpenRouter API key in .env file.');
}
```

### If OpenRouter API fails:
```javascript
if (response.error) {
  reject(new Error(response.error.message || 'OpenRouter API error'));
}
```

---

## Performance Tips

- **Response Time:** 2-5 seconds typically (depends on OpenRouter)
- **Max Tokens:** 200 (configurable in server.js)
- **Database:** SQLite (fast, lightweight)
- **Chat History:** Loaded from database
- **Typing Indicator:** Shows while waiting for response

---

## Testing Communication

### Test Backend Endpoint:
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

### Expected Response:
```json
{
  "user_message": "Hello",
  "ai_response": "Hello! I'm an AI assistant for Petra School...",
  "timestamp": "2026-05-16T14:26:12.332Z"
}
```

### Test API Availability:
```bash
curl http://localhost:5000/health
```

---

## Summary

Your dashboard is a **real-time AI chat interface** that:
1. ✅ Captures user input on frontend
2. ✅ Sends to Node.js backend via HTTP POST
3. ✅ Backend fetches school context from database
4. ✅ Sends to OpenRouter AI API
5. ✅ Stores response in SQLite
6. ✅ Returns response to frontend
7. ✅ Displays in beautiful chat interface

**All communication is JSON-based and REST-compliant!** 🚀
