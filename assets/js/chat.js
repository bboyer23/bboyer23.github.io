/* 
   R&D CHATBOT LOGIC 
   Connects to Cloudflare Worker -> OpenAI
*/

// CONFIGURATION
const WORKER_URL = "https://sweet-mountain-4e3b.benboyer47.workers.dev";
const REQUIRED_PASSWORD = "benfun"; // CHANGE THIS if you want a different password

// DOM ELEMENTS
const modal = document.getElementById('password-modal');
const passInput = document.getElementById('modal-pass-input');
const passSubmit = document.getElementById('modal-submit-btn');
const errorMsg = document.getElementById('login-error');

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-chat');

// 1. PASSWORD PROTECTION
function checkPassword() {
    if (passInput.value === REQUIRED_PASSWORD) {
        // Success: Fade out modal
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        // Save session (optional, so refresh doesn't lock them out)
        sessionStorage.setItem('auth', 'true');
    } else {
        errorMsg.textContent = "Access Denied: Invalid credentials.";
        passInput.value = '';
    }
}

// Check if already logged in this session
if (sessionStorage.getItem('auth') === 'true') {
    modal.style.display = 'none';
}

passSubmit.addEventListener('click', checkPassword);
passInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});


// 2. CHAT FUNCTIONALITY
function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.innerHTML = text; // innerHTML used to render simple formatting if needed
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto scroll to bottom
}

function showLoading() {
    const div = document.createElement('div');
    div.classList.add('message', 'ai', 'loading-msg');
    div.innerHTML = 'Analyzing <span class="loading-dots"></span>';
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return div;
}

async function handleChat() {
    const message = userInput.value.trim();
    if (!message) return;

    // 1. Add User Message
    appendMessage(message, 'user');
    userInput.value = '';
    userInput.disabled = true; // Disable input while waiting

    // 2. Show Loading Bubble
    const loadingBubble = showLoading();

    try {
        // 3. Call your existing Cloudflare Worker
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        // 4. Remove loader and show response
        loadingBubble.remove();
        
        // Handle response structure (adjust based on your actual Worker return)
        const reply = data.response || data.message || "I received a response, but it was empty.";
        appendMessage(reply, 'ai');

    } catch (error) {
        loadingBubble.remove();
        appendMessage("Error: Could not connect to the neural network.", 'ai');
        console.error(error);
    } finally {
        userInput.disabled = false;
        userInput.focus();
    }
}

// EVENT LISTENERS
sendBtn.addEventListener('click', handleChat);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});

clearBtn.addEventListener('click', () => {
    chatWindow.innerHTML = '<div class="message ai">System reset. Memory cleared.</div>';
});