# Petra AI Dashboard

An AI-powered school management dashboard built with Express.js, SQLite, and the OpenRouter API.

## Features

- 🤖 AI Chat Assistant powered by OpenRouter
- 📚 Activity Management
- 📢 Announcements
- 🏫 School Information Management
- 💾 Persistent Chat History (localStorage)
- 🌓 Dark/Light Mode
- 📱 Responsive Design

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **AI**: OpenRouter API

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/Michael-aal/petra-ai-dashboard.git
cd petra-ai-dashboard
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the `backend` directory:
```bash
OPENROUTER_API_KEY=your_api_key_here
PORT=5000
```

4. Start the server:
```bash
npm start
```

5. Open your browser and go to `http://localhost:5000`

## API Endpoints

### Chat
- `POST /api/chat` - Send a message and get AI response
- `GET /api/chat-history` - Get chat history
- `DELETE /api/chat-history` - Clear chat history

### Activities
- `GET /api/activities` - Get all activities
- `POST /api/activities/add` - Add new activity
- `DELETE /api/activities/:id` - Delete activity

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements/add` - Add new announcement
- `DELETE /api/announcements/:id` - Delete announcement

### School Info
- `GET /api/school` - Get school information
- `POST /api/school/update` - Update school information

## Usage

### Chat Commands
- Type normally to chat with the AI
- Type `clear` to clear the chat history

## Deployment

### Netlify Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Set environment variables in Netlify dashboard:
   - `OPENROUTER_API_KEY`
4. Deploy

### Railway Deployment

1. Push code to GitHub
2. Connect to Railway
3. Add environment variables
4. Deploy with one click

### Heroku Deployment

```bash
heroku login
heroku create your-app-name
git push heroku main
```

## Environment Variables

```
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=5000
```

## License

MIT

## Author

Michael-aal
