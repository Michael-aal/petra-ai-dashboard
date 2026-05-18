# 📚 SCHOOL DATA MANAGEMENT GUIDE

## Overview

Your Petra AI Dashboard now stores all school information in a SQLite database that persists across sessions. The AI reads this data to give smart, contextual responses.

---

## 🎯 TYPES OF DATA STORED

### 1. Activities
```
- Name: Math Club
- Description: Weekly math competitions and problem-solving
- Time: 3:00 PM
- Auto-stored in database
```

### 2. Announcements
```
- Title: School Opening
- Content: School opens on January 15, 2024
- Date: 2024-01-01
- Auto-stored in database
```

### 3. School Information
```
- School Name: Petra School
- Description: A premier educational institution...
- Contact: +1-800-PETRA-SCHOOL
- Email: info@petraschool.edu
```

### 4. Chat History
```
- All user messages stored
- All AI responses stored
- Timestamps recorded
- Can be retrieved anytime
```

---

## 🛠️ HOW TO ADD/EDIT DATA

### Method 1: Using Backend API Directly

#### Add a New Activity

```bash
curl -X POST http://localhost:5000/api/activities/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chess Club",
    "description": "Learn and play chess",
    "time": "4:00 PM"
  }'
```

#### Add a New Announcement

```bash
curl -X POST http://localhost:5000/api/announcements/add \
  -H "Content-Type: application/json" \
  -d '{
    "title": "School Trip",
    "content": "School trip to museum on Friday",
    "date": "2024-05-20"
  }'
```

#### Update School Info

```bash
curl -X POST http://localhost:5000/api/school/update \
  -H "Content-Type: application/json" \
  -d '{
    "key": "school_name",
    "value": "Petra International School"
  }'
```

---

### Method 2: Using Browser Console

Open browser developer tools (F12) → Console tab:

```javascript
// Add activity
fetch('http://localhost:5000/api/activities/add', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    name: 'Music Club',
    description: 'Learn music and instruments',
    time: '5:00 PM'
  })
})
.then(r => r.json())
.then(d => console.log('Added:', d))

// Add announcement
fetch('http://localhost:5000/api/announcements/add', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    title: 'Exam Results',
    content: 'First term exam results released',
    date: '2024-05-15'
  })
})
.then(r => r.json())
.then(d => console.log('Added:', d))
```

---

### Method 3: Using Node.js Script

Create `backend/add-data.js`:

```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./school.db');

// Add activity
db.run(
  'INSERT INTO activities (name, description, time) VALUES (?, ?, ?)',
  ['Computer Club', 'Learn programming and tech', '3:30 PM'],
  function(err) {
    if (err) console.error(err);
    else console.log('Activity added with ID:', this.lastID);
  }
);

// Add announcement
db.run(
  'INSERT INTO announcements (title, content, date) VALUES (?, ?, ?)',
  ['Parent-Teacher Meeting', 'Meeting scheduled for Saturday', '2024-05-25'],
  function(err) {
    if (err) console.error(err);
    else console.log('Announcement added with ID:', this.lastID);
  }
);

db.close();
```

Run: `node add-data.js`

---

## 📖 CURRENT SAMPLE DATA

### Pre-loaded Activities (5 total)

1. **Math Club**
   - Time: 3:00 PM
   - Description: Weekly math competitions and problem-solving

2. **Science Lab**
   - Time: 2:30 PM
   - Description: Hands-on science experiments

3. **Sports Day**
   - Time: 4:00 PM
   - Description: Inter-school sports competition

4. **Art Workshop**
   - Time: 1:30 PM
   - Description: Creative arts and crafts

5. **Debate Club**
   - Time: 3:30 PM
   - Description: Public speaking and debates

### Pre-loaded Announcements (3 total)

1. **School Opening**
   - Date: 2024-01-01
   - Content: School opens on January 15, 2024

2. **Holiday Schedule**
   - Date: 2024-02-15
   - Content: Holiday break from March 1-7

3. **Exam Schedule**
   - Date: 2024-03-01
   - Content: Final exams starting April 1st

### School Info

- **school_name**: Petra School
- **school_description**: A premier educational institution focused on excellence and innovation
- **contact**: +1-800-PETRA-SCHOOL
- **email**: info@petraschool.edu

---

## 📊 VIEWING DATA

### Get All Activities
```bash
curl http://localhost:5000/api/activities
```

### Get All Announcements
```bash
curl http://localhost:5000/api/announcements
```

### Get School Info
```bash
curl http://localhost:5000/api/school
```

### Get Chat History
```bash
curl http://localhost:5000/api/chat-history
```

---

## 🗑️ DELETING DATA

### Delete Activity by ID

```bash
curl -X DELETE http://localhost:5000/api/activities/1
```

### Delete Announcement by ID

```bash
curl -X DELETE http://localhost:5000/api/announcements/2
```

### Clear Chat History

```bash
curl -X DELETE http://localhost:5000/api/chat-history
```

---

## 🔍 QUERYING DATABASE DIRECTLY

### Using SQLite CLI

Open Command Prompt:

```bash
cd "c:\Users\austi\Videos\ai dashboard\backend"
sqlite3 school.db
```

Then run SQL queries:

```sql
-- View all activities
SELECT * FROM activities;

-- View all announcements
SELECT * FROM announcements;

-- View chat history
SELECT user_message, ai_response FROM chat_history ORDER BY created_at DESC;

-- Count messages
SELECT COUNT(*) as total_messages FROM chat_history;

-- Exit
.exit
```

---

## 🤖 HOW AI READS THIS DATA

When you send a message, the AI:

1. **Reads all data** from database
2. **Builds context** with activities and announcements
3. **Generates prompt** with this information
4. **Sends to OpenAI** for intelligent response
5. **Returns answer** using real school data

**Example:**

```
User: "What activities are available?"

AI reads database:
- Activities table: 5 entries
- Announcements table: 3 entries
- School info: Petra School

AI generates context:
"You have these activities: Math Club (3 PM), Science Lab (2:30 PM)..."

OpenAI generates smart response:
"We have 5 activities available! Math Club at 3:00 PM focuses on 
weekly competitions. Science Lab at 2:30 PM offers hands-on experiments..."
```

---

## 💡 BEST PRACTICES

### 1. Update Regularly
Keep your activities and announcements current so AI gives accurate info

### 2. Use Clear Descriptions
Write detailed descriptions - AI uses these to generate good responses

### 3. Set Proper Times
Include time information so AI can tell when activities happen

### 4. Archive Old Data
Delete old announcements to keep database clean

### 5. Backup Your Data
```bash
# Backup database
copy backend\school.db backend\school.db.backup
```

---

## 📝 EXAMPLE WORKFLOW

### Day 1: Initial Setup
```
1. Database created with sample data
2. 5 activities and 3 announcements pre-loaded
3. Dashboard ready to use
```

### Day 2: Update School Info
```bash
curl -X POST http://localhost:5000/api/school/update \
  -H "Content-Type: application/json" \
  -d '{"key":"school_name","value":"Petra Secondary School"}'
```

### Day 3: Add New Activity
```bash
curl -X POST http://localhost:5000/api/activities/add \
  -H "Content-Type: application/json" \
  -d '{"name":"Robotics Club","description":"Build robots","time":"4:30 PM"}'
```

### Day 4: Add Announcement
```bash
curl -X POST http://localhost:5000/api/announcements/add \
  -H "Content-Type: application/json" \
  -d '{"title":"Robot Competition","content":"Inter-school competition","date":"2024-06-15"}'
```

### Day 5: Chat with Updated Data
```
User: "What events are coming up?"
AI: "We have an exciting robot competition coming up on June 15th! 
We have a Robotics Club (4:30 PM) where you can build robots..."
```

---

## 🔄 DATABASE FILE

Your data is saved in:
```
c:\Users\austi\Videos\ai dashboard\backend\school.db
```

This is a SQLite database file that:
- ✅ Persists data between sessions
- ✅ Survives server restarts
- ✅ Can be backed up
- ✅ Can be shared with others

---

## 🚀 AUTOMATE DATA ENTRY

### Option 1: Batch Import Script

Create `backend/import-activities.js`:

```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./school.db');

const activities = [
  { name: 'Drama Club', description: 'Stage performances', time: '5:00 PM' },
  { name: 'Photography', description: 'Learn photography', time: '3:30 PM' },
  { name: 'Coding Club', description: 'Learn programming', time: '4:00 PM' }
];

activities.forEach(activity => {
  db.run(
    'INSERT INTO activities (name, description, time) VALUES (?, ?, ?)',
    [activity.name, activity.description, activity.time]
  );
});

db.close();
console.log('Activities imported!');
```

Run: `node import-activities.js`

### Option 2: CSV Import

Coming soon - upload CSV files

---

## ✅ DATA MANAGEMENT CHECKLIST

- [ ] Database created successfully
- [ ] Sample data loaded
- [ ] Can fetch activities
- [ ] Can fetch announcements
- [ ] Can add new activities
- [ ] Can add announcements
- [ ] Chat history is being saved
- [ ] AI reads data correctly
- [ ] Data persists after restart
- [ ] Backups are regular

---

## 📞 QUICK REFERENCE

| Task | Command |
|------|---------|
| Add Activity | POST /api/activities/add |
| View Activities | GET /api/activities |
| Delete Activity | DELETE /api/activities/:id |
| Add Announcement | POST /api/announcements/add |
| View Announcements | GET /api/announcements |
| Delete Announcement | DELETE /api/announcements/:id |
| Update School Info | POST /api/school/update |
| Get School Info | GET /api/school |
| View Chat History | GET /api/chat-history |
| Clear Chat History | DELETE /api/chat-history |

---

## 🎉 You're All Set!

Your school data is now:
- ✅ Stored in database
- ✅ Read by AI
- ✅ Returned in smart responses
- ✅ Persisted across sessions
- ✅ Easy to update

**Start managing your school data!** 📚

---

For more help, check:
- ADVANCED_SETUP.md - Full setup guide
- README.md - API documentation
- Testing examples in this guide
