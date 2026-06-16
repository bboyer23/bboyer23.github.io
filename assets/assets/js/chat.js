/* 
   R&D CHATBOT LOGIC 
   Connects to Cloudflare Worker -> OpenAI
   SECURE VERSION
*/

// CONFIGURATION
const WORKER_URL = "https://sweet-mountain-4e3b.benboyer47.workers.dev";
// NOTE: Password is no longer hardcoded here. It stays in user input/storage.

// DOM ELEMENTS
const modal = document.getElementById('password-modal');
const passInput = document.getElementById('modal-pass-input');
const passSubmit = document.getElementById('modal-submit-btn');
const errorMsg = document.getElementById('login-error');

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-chat');

// 1. PASSWORD HANDLING
function savePasswordAndClose() {
    const input = passInput.value.trim();
    if (input) {
        // Store password in session storage so it persists on refresh
        sessionStorage.setItem('chat_access_key', input);
        
        // Hide modal (Validation happens on the server when they try to chat)
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Clear error message in case it was there
        errorMsg.textContent = ""; 
    } else {
        errorMsg.textContent = "Please enter a password.";
    }
}

// Check if we already have a password saved from before
if (sessionStorage.getItem('chat_access_key')) {
    modal.style.display = 'none';
}

passSubmit.addEventListener('click', savePasswordAndClose);
passInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') savePasswordAndClose();
});


// 2. CHAT FUNCTIONALITY
function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.innerHTML = text; 
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight; 
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

    // Retrieve password from storage
    const storedPassword = sessionStorage.getItem('chat_access_key');
    
    // If somehow the modal was bypassed but no password exists
    if (!storedPassword) {
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        errorMsg.textContent = "Session expired. Please log in.";
        return;
    }

    // 1. Add User Message to UI
    appendMessage(message, 'user');
    userInput.value = '';
    userInput.disabled = true;

    // 2. Show Loading Bubble
    const loadingBubble = showLoading();

    try {
        // 3. Send Request to Worker with Password in Body
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: message,
                access_key: storedPassword // SECURITY: Sending key to backend
            })
        });

        // 4. Check for Unauthorized Access (Wrong Password)
        if (response.status === 401) {
            loadingBubble.remove();
            appendMessage("⛔ Access Denied: Incorrect Password.", 'ai');
            
            // Re-open modal so they can try again
            setTimeout(() => {
                sessionStorage.removeItem('chat_access_key'); // Clear wrong pass
                modal.style.display = 'flex';
                modal.style.opacity = '1';
                passInput.value = '';
                errorMsg.textContent = "Incorrect password. Please try again.";
            }, 1500);
            return;
        }

        const data = await response.json();
        loadingBubble.remove();

        // 5. Handle Valid Response
        if (data.error) {
            appendMessage(`Error: ${data.error}`, 'ai');
        } else {
            const reply = data.response || "No response received.";
            appendMessage(reply, 'ai');
        }

    } catch (error) {
        loadingBubble.remove();
        appendMessage("Error: Connection failure.", 'ai');
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