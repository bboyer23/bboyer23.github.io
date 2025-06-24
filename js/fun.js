document.addEventListener("DOMContentLoaded", () => {
    console.log("[fun.js] Loaded successfully!");

    // ========== QUIZ ==========
    const quizContainer = document.getElementById("quiz-container");
    const quizQuestion = document.getElementById("quiz-question");
    const quizOptions = document.querySelector(".quiz-options");
    const quizResult = document.getElementById("quiz-result");
    const startQuizBtn = document.getElementById("start-quiz");

    if (quizContainer && quizQuestion && quizOptions && quizResult && startQuizBtn) {
        console.log("✅ Quiz elements found. Initializing quiz logic.");
        const quizData = [
            {
                question: "What excites you the most in tech?",
                options: ["Building apps", "Fixing networks", "Securing systems", "Talking to clients"],
                answers: ["Software Engineer", "Network Engineer", "Cybersecurity Analyst", "Solutions Architect"]
            },
            {
                question: "How do you approach problem-solving?",
                options: ["Coding solutions", "Troubleshooting hardware", "Analyzing risks", "Explaining ideas"],
                answers: ["Software Engineer", "IT Support Specialist", "Cybersecurity Analyst", "Technical Sales"]
            },
            {
                question: "What would you rather work with?",
                options: ["Code", "Servers", "Firewalls", "People"],
                answers: ["Software Engineer", "System Administrator", "Cybersecurity Analyst", "Consultant"]
            }
        ];

        let currentQuestion = 0;
        let resultCount = {};

        function loadQuiz() {
            if (currentQuestion < quizData.length) {
                quizResult.style.display = "none";
                quizContainer.style.display = "block";
                quizQuestion.textContent = quizData[currentQuestion].question;

                // Clear old options
                quizOptions.innerHTML = "";

                // Add new options
                quizData[currentQuestion].options.forEach((option, index) => {
                    const btn = document.createElement("button");
                    btn.classList.add("quiz-option", "btn");
                    btn.textContent = option;
                    btn.onclick = () => {
                        const selectedRole = quizData[currentQuestion].answers[index];
                        resultCount[selectedRole] = (resultCount[selectedRole] || 0) + 1;
                        currentQuestion++;
                        loadQuiz();
                    };
                    quizOptions.appendChild(btn);
                });
            } else {
                displayQuizResult();
            }
        }

        function displayQuizResult() {
            const topRole = Object.keys(resultCount).reduce((a, b) =>
                resultCount[a] > resultCount[b] ? a : b, ""
            );
            quizResult.textContent = `Your ideal tech role is: ${topRole}!`;
            quizResult.style.display = "block";
            quizContainer.style.display = "none";
        }

        startQuizBtn.addEventListener("click", () => {
            currentQuestion = 0;
            resultCount = {};
            loadQuiz();
        });
    }

    // ========== PASSWORD-PROTECTED CHATBOT ==========
    const passwordModal = document.getElementById("password-modal");
    const chatSection = document.getElementById("mini-chatbot");
    const chatPasswordInput = document.getElementById("chat-password");
    const chatPasswordSubmit = document.getElementById("chat-password-submit");
    const passwordError = document.getElementById("password-error");

    // Read the password from config.js or environment variable
    const chatbotPassword = window.APP_CONFIG?.CHATBOT_PASSWORD || "";

    chatPasswordSubmit.addEventListener("click", () => {
        const enteredPassword = chatPasswordInput.value.trim();

        if (enteredPassword === chatbotPassword) {
            passwordModal.style.display = "none"; // Hide modal
            chatSection.style.display = "block";  // Show chatbot
            chatPasswordInput.value = ""; // Clear input field
        } else {
            passwordError.textContent = "Incorrect password. Try again!";
            passwordError.style.color = "red";
        }
    });

    // Allow pressing Enter to submit password
    chatPasswordInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            chatPasswordSubmit.click();
        }
    });

    // ========== AI CHATBOT ==========
    const chatInput = document.getElementById("chat-input");
    const chatSubmit = document.getElementById("chat-submit");
    const chatClear = document.getElementById("chat-clear");
    const chatOutput = document.getElementById("chat-output");

    if (chatInput && chatSubmit && chatOutput) {
        console.log("✅ Chatbot elements found. Initializing chatbot.");

        // Load stored history if available
        const storedHistory = localStorage.getItem('chatHistory');
        if (storedHistory) {
            chatOutput.innerHTML = storedHistory;
        }

        chatSubmit.addEventListener("click", async () => {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            // Display user message
            chatOutput.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;

            try {
                // Replace with actual AI endpoint
                const response = await fetch("https://sweet-mountain-4e3b.benboyer47.workers.dev", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: userMessage })
                });
                const data = await response.json();
                chatOutput.innerHTML += `<p><strong>AI:</strong> ${data.response}</p>`;
            } catch (error) {
                chatOutput.innerHTML += `<p><strong>AI:</strong> Unable to connect. Try again later.</p>`;
                console.error("[fun.js] Chatbot error:", error);
            }

            localStorage.setItem('chatHistory', chatOutput.innerHTML);
            chatInput.value = "";
        });

        // Enter key submission for chatbot
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                chatSubmit.click();
            }
        });

        if (chatClear) {
            chatClear.addEventListener("click", () => {
                chatOutput.innerHTML = "";
                localStorage.removeItem('chatHistory');
            });
        }
    }

    // ========== MINI GAME ==========
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        console.log("✅ Mini-game detected, initializing.");
        const context = canvas.getContext('2d');

        let ballX = canvas.width / 2;
        let ballY = canvas.height - 30;
        let ballDX = 2;
        let ballDY = -2;
        const ballRadius = 10;

        function drawBall() {
            context.beginPath();
            context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
            context.fillStyle = "#3498db";
            context.fill();
            context.closePath();
        }

        function updateGame() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();

            if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
                ballDX = -ballDX;
            }
            if (ballY + ballDY > canvas.height - ballRadius || ballY + ballDY < ballRadius) {
                ballDY = -ballDY;
            }

            ballX += ballDX;
            ballY += ballDY;
        }

        setInterval(updateGame, 16); // ~60fps
    }
});
