const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const https = require('https');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'user interface')));

// Initialize SQLite Database
const db = new sqlite3.Database('./school.db', (err) => {
  if (err) {
    console.error('Database error:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Initialize Database Schema
function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        time TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS school_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, () => {
      db.run(`INSERT OR IGNORE INTO school_info (key, value) VALUES ('school_name', 'Petra School')`);
      db.run(`INSERT OR IGNORE INTO school_info (key, value) VALUES ('school_description', 'A premier educational institution focused on excellence and innovation')`);
      db.run(`INSERT OR IGNORE INTO school_info (key, value) VALUES ('contact', '+1-800-PETRA-SCHOOL')`);
      db.run(`INSERT OR IGNORE INTO school_info (key, value) VALUES ('email', 'info@petraschool.edu')`);
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_message TEXT NOT NULL,
        ai_response TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.get('SELECT COUNT(*) as count FROM activities', (err, row) => {
      if (row && row.count === 0) {
        insertSampleData();
      }
    });
  });
}

// Insert Sample Data
function insertSampleData() {
  const activities = [
    { name: 'Math Club', description: 'Weekly math competitions and problem-solving', time: '3:00 PM' },
    { name: 'Science Lab', description: 'Hands-on science experiments', time: '2:30 PM' },
    { name: 'Sports Day', description: 'Inter-school sports competition', time: '4:00 PM' },
    { name: 'Art Workshop', description: 'Creative arts and crafts', time: '1:30 PM' },
    { name: 'Debate Club', description: 'Public speaking and debates', time: '3:30 PM' }
  ];

  const announcements = [
    { title: 'School Opening', content: 'School opens on January 15, 2024', date: '2024-01-01' },
    { title: 'Holiday Schedule', content: 'Holiday break from March 1-7', date: '2024-02-15' },
    { title: 'Exam Schedule', content: 'Final exams starting April 1st', date: '2024-03-01' }
  ];

  activities.forEach(activity => {
    db.run(
      'INSERT INTO activities (name, description, time) VALUES (?, ?, ?)',
      [activity.name, activity.description, activity.time]
    );
  });

  announcements.forEach(announcement => {
    db.run(
      'INSERT INTO announcements (title, content, date) VALUES (?, ?, ?)',
      [announcement.title, announcement.content, announcement.date]
    );
  });

  console.log('📚 Sample data inserted');
}

// Promise-based database helpers
const dbAll = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});

const dbGet = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
});

const dbRun = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve({ id: this.lastID, changes: this.changes });
  });
});

async function getSchoolContext() {
  const [activities, announcements, schoolInfo] = await Promise.all([
    dbAll('SELECT * FROM activities'),
    dbAll('SELECT * FROM announcements'),
    dbAll('SELECT * FROM school_info')
  ]);
  
  return { activities: activities || [], announcements: announcements || [], schoolInfo: schoolInfo || [] };
}

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    ai: 'OpenRouter API enabled',
    apiKey: OPENROUTER_API_KEY ? 'configured' : 'NOT CONFIGURED'
  });
});
app.get('/api/school', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM school_info');
    const schoolInfo = {};
    rows.forEach(row => {
      schoolInfo[row.key] = row.value;
    });
    res.json(schoolInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update School Info
app.post('/api/school/update', async (req, res) => {
  const { key, value } = req.body;
  if (!key || !value) {
    return res.status(400).json({ error: 'Key and value are required' });
  }
  try {
    await dbRun('INSERT OR REPLACE INTO school_info (key, value) VALUES (?, ?)', [key, value]);
    res.json({ success: true, key, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Activities
app.get('/api/activities', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM activities ORDER BY time');
    res.json(rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Activity
app.post('/api/activities/add', async (req, res) => {
  const { name, description, time } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Activity name is required' });
  }
  try {
    const result = await dbRun(
      'INSERT INTO activities (name, description, time) VALUES (?, ?, ?)',
      [name, description || '', time || '']
    );
    res.json({ id: result.id, name, description, time });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Activity
app.delete('/api/activities/:id', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM activities WHERE id = ?', [req.params.id]);
    res.json({ success: true, deleted: result.changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json(rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Announcement
app.post('/api/announcements/add', async (req, res) => {
  const { title, content, date } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Announcement title is required' });
  }
  try {
    const result = await dbRun(
      'INSERT INTO announcements (title, content, date) VALUES (?, ?, ?)',
      [title, content || '', date || new Date().toISOString().split('T')[0]]
    );
    res.json({ id: result.id, title, content, date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Announcement
app.delete('/api/announcements/:id', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM announcements WHERE id = ?', [req.params.id]);
    res.json({ success: true, deleted: result.changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OpenRouter API Helper Function
function callOpenRouterAPI(systemPrompt, userMessage) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Petra AI Dashboard'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(response.error.message || 'OpenRouter API error'));
          } else {
            resolve(response.choices[0].message.content);
          }
        } catch (error) {
          reject(new Error('Failed to parse OpenRouter response: ' + error.message));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

// Chat Endpoint with OpenRouter API
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OpenRouter API key not configured' });
    }

    const context = await getSchoolContext();
    const systemPrompt = buildSystemPrompt(context);

    try {
      const aiResponse = await callOpenRouterAPI(systemPrompt, message);

      db.run(
        'INSERT INTO chat_history (user_message, ai_response) VALUES (?, ?)',
        [message, aiResponse],
        (dbErr) => {
          if (dbErr) console.error('Database error:', dbErr.message);
        }
      );

      res.json({
        user_message: message,
        ai_response: aiResponse,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('OpenRouter Error:', error.message);
      res.status(500).json({ error: 'Failed to get AI response: ' + error.message });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Chat History
app.get('/api/chat-history', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM chat_history ORDER BY created_at DESC LIMIT 50');
    res.json(rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear Chat History
app.delete('/api/chat-history', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM chat_history');
    res.json({ success: true, cleared: result.changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Build system prompt with school context
function buildSystemPrompt(context) {
  const activitiesList = context.activities
    .map(a => `- ${a.name}: ${a.description} (${a.time})`)
    .join('\n');

  const announcementsList = context.announcements
    .map(a => `- ${a.title}: ${a.content}`)
    .join('\n');

  return `You are a helpful AI assistant for Petra School. You help students and parents with information about school activities, announcements, and general inquiries.

SCHOOL ACTIVITIES:
${activitiesList || 'No activities listed'}

ANNOUNCEMENTS:
${announcementsList || 'No announcements'}

INSTRUCTIONS:
- Be friendly and helpful
- Provide information about school activities when asked
- Share announcements when relevant
- If asked about something not in your knowledge base, offer to help in other ways
- Keep responses concise (under 150 words)
- Always be professional and supportive`;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🤖 OpenRouter API enabled`);
  console.log(`💾 SQLite database connected`);
});