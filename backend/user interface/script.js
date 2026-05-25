const API_URL = 'http://localhost:5000/api';
let chatHistory = [];
let darkMode = false;

let greetingEL = document.querySelector('.greetings');
let hamburgerEL = document.querySelector('.hamburger');
let headerEL = document.querySelector('.header');
let closeBtnEL = document.querySelector('.closebtns');


hamburgerEL.addEventListener('click', () => {
    headerEL.style = "display: flex; flex-direction: column; justify-items: center; align-items: center; width: 100%; position: absolute; gap: 50px;";
});

closeBtnEL.addEventListener('click', () => {
    headerEL.style = "display: none; flex-direction: column; justify-items: center; align-items: center; width: 0%; position: absolute; gap: 50px;";
}); 

document.addEventListener('DOMContentLoaded', () => {
  loadLocalChat();
  initializeApp();
});

function loadLocalChat() {
  const savedChat = localStorage.getItem('chatHistory');
  if (!savedChat) return;
  
  const chatArea = document.querySelector('.chat_area');
  try {
    const messages = JSON.parse(savedChat);
    messages.forEach(msg => {
      const msgEl = document.createElement('div');
      msgEl.className = `message ${msg.type}-message`;
      msgEl.innerHTML = `
        <div class="message-content">${escapeHtml(msg.content)}</div>
        <div class="message-time">${msg.time}</div>
      `;
      chatArea.appendChild(msgEl);
    });
    if (messages.length > 0) {
      greetingEL.style.display = 'none';
      scrollToBottom();
    }
  } catch (error) {
    console.error('Failed to load chat from localStorage:', error);
  }
}

function initializeApp() {
  const sendBtn = document.querySelector('.send');
  const inputField = document.querySelector('input[placeholder="message..."]');

  sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    sendMessage();
  });

  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  });

  setupSettingsListeners();
  setupModals();
}

// ============ CHAT FUNCTIONS ============

async function sendMessage() {
  const inputField = document.querySelector('input[placeholder="message..."]');
  const message = inputField.value.trim();

  if (!message) {
    return;
  }

  if (message.toLowerCase() === 'clear') {
    clearChat();
    inputField.value = '';
    return;
  }

  greetingEL.style.display = 'none';
  displayUserMessage(message);
  saveChatToLocalStorage();
  inputField.value = '';
  inputField.focus();

  showTypingIndicator();

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    removeTypingIndicator();

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      displayAIMessage(`❌ ${data.error}`);
    } else if (data.ai_response) {
      displayAIMessage(data.ai_response);
    } else {
      displayAIMessage('❌ No response received from server.');
    }
    
    saveChatToLocalStorage();
  } catch (error) {
    removeTypingIndicator();
    console.error('Chat error:', error);
    displayAIMessage(`❌ Failed to get response: ${error.message}`);
    saveChatToLocalStorage();
  }
}


function displayUserMessage(message) {
  const chatArea = document.querySelector('.chat_area');
  const msgEl = document.createElement('div');
  msgEl.className = 'message user-message';
  msgEl.innerHTML = `
    <div class="message-content">${escapeHtml(message)}</div>
    <div class="message-time">${getCurrentTime()}</div>
  `;
  chatArea.appendChild(msgEl);
  scrollToBottom();
}

function displayAIMessage(message) {
  const chatArea = document.querySelector('.chat_area');
  if (!chatArea) return;

  const msgEl = document.createElement('div');
  msgEl.className = 'message ai-message';
  msgEl.innerHTML = `
    <div class="message-content">${escapeHtml(message)}</div>
    <div class="message-time">${getCurrentTime()}</div>
  `;
  chatArea.appendChild(msgEl);
  scrollToBottom();
}

function saveChatToLocalStorage() {
  const chatArea = document.querySelector('.chat_area');
  const messages = [];
  
  chatArea.querySelectorAll('.message').forEach(msgEl => {
    const type = msgEl.classList.contains('user-message') ? 'user' : 'ai';
    const content = msgEl.querySelector('.message-content')?.textContent || '';
    const time = msgEl.querySelector('.message-time')?.textContent || '';
    messages.push({ type, content, time });
  });
  
  localStorage.setItem('chatHistory', JSON.stringify(messages));
}

function clearChat() {
  const chatArea = document.querySelector('.chat_area');
  chatArea.innerHTML = '';
  localStorage.removeItem('chatHistory');
  greetingEL.style.display = 'block';
}

function showTypingIndicator() {
  const chatArea = document.querySelector('.chat_area');
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.id = 'typing-indicator';
  indicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  chatArea.appendChild(indicator);
  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

function scrollToBottom() {
  const chatArea = document.querySelector('.chat_area');
  if (chatArea) {
    setTimeout(() => {
      chatArea.scrollTop = chatArea.scrollHeight;
    }, 0);
  }
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}


function updateAnnouncementDisplay(announcements) {
  console.log('Announcements:', announcements);
}

function updateSchoolInfoDisplay(schoolInfo) {
  const nameEl = document.querySelector('.profile_name');
  if (nameEl && schoolInfo.school_name) {
    // Can update profile or other elements
  }
}

// ============ SETTINGS & MANAGEMENT ============

function setupSettingsListeners() {
  const darkBtn = document.querySelector('.togglebtn.dark');
  const lightBtn = document.querySelector('.togglebtn.light');

  if (darkBtn) {
    darkBtn.addEventListener('click', toggleDarkMode);
  }
  if (lightBtn) {
    lightBtn.addEventListener('click', toggleLightMode);
  }
}

function toggleDarkMode() {
  darkMode = true;
  document.documentElement.style.setProperty('--bg-body', '#141a23');
  document.documentElement.style.setProperty('--text-primary', '#ffffff');
  document.body.classList.add('dark-mode');
}

function toggleLightMode() {
  darkMode = false;
  document.documentElement.style.setProperty('--bg-body', '#f7f8fa');
  document.documentElement.style.setProperty('--text-primary', '#0b0f1a');
  document.body.classList.remove('dark-mode');
}

function setupModals() {
  // Modal for adding activities (future feature)
  // Modal for adding announcements (future feature)
  // Modal for school info (future feature)
}


fetch("https://backend.vercel.app/api")
  .then(res => res.json())
  .then(data => console.log(data));