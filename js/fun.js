document.addEventListener("DOMContentLoaded", () => {
    console.log("[fun.js] Loaded successfully!");

    // ================================
    // QUIZ
    // ================================
    const quizContainer = document.getElementById("quiz-container");
    const quizQuestion = document.getElementById("quiz-question");
    const quizOptions = document.querySelector(".quiz-options");
    const quizResult = document.getElementById("quiz-result");
    const startQuizBtn = document.getElementById("start-quiz");

    if (quizContainer && quizQuestion && quizOptions && quizResult && startQuizBtn) {
        console.log("✅ Quiz system detected.");

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

                quizOptions.innerHTML = "";

                quizData[currentQuestion].options.forEach((option, index) => {
                    const btn = document.createElement("button");
                    btn.classList.add("quiz-option", "btn");
                    btn.textContent = option;
                    btn.onclick = () => {
                        const role = quizData[currentQuestion].answers[index];
                        resultCount[role] = (resultCount[role] || 0) + 1;
                        currentQuestion++;
                        loadQuiz();
                    };
                    quizOptions.appendChild(btn);
                });

            } else {
                displayResult();
            }
        }

        function displayResult() {
            const topRole = Object.keys(resultCount).reduce((a, b) =>
                resultCount[a] > resultCount[b] ? a : b
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

    // ================================
    // PASSWORD-PROTECTED CHATBOT
    // ================================
    const passwordModal = document.getElementById("password-modal");
    const chatSection = document.getElementById("mini-chatbot");
    const chatPasswordInput = document.getElementById("chat-password");
    const chatPasswordSubmit = document.getElementById("chat-password-submit");
    const passwordError = document.getElementById("password-error");

    const chatbotPassword = window.APP_CONFIG?.CHATBOT_PASSWORD || "";

    if (passwordModal && chatPasswordSubmit && chatPasswordInput) {
        chatPasswordSubmit.addEventListener("click", () => {
            const entered = chatPasswordInput.value.trim();
            if (entered === chatbotPassword) {
                passwordModal.style.display = "none";
                chatSection.style.display = "block";
                chatPasswordInput.value = "";
            } else {
                passwordError.textContent = "Incorrect password. Try again!";
                passwordError.style.color = "red";
            }
        });

        chatPasswordInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") chatPasswordSubmit.click();
        });
    }

    // ================================
    // AI CHATBOT
    // ================================
    const chatInput = document.getElementById("chat-input");
    const chatSubmit = document.getElementById("chat-submit");
    const chatClear = document.getElementById("chat-clear");
    const chatOutput = document.getElementById("chat-output");

    if (chatInput && chatSubmit && chatOutput) {
        console.log("✅ Chatbot detected.");

        const storedHistory = localStorage.getItem("chatHistory");
        if (storedHistory) chatOutput.innerHTML = storedHistory;

        chatSubmit.addEventListener("click", async () => {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            chatOutput.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;

            try {
                const response = await fetch("https://sweet-mountain-4e3b.benboyer47.workers.dev", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: userMessage })
                });

                const data = await response.json();

                chatOutput.innerHTML += `<p><strong>AI:</strong> ${data.response}</p>`;

            } catch (err) {
                chatOutput.innerHTML += `<p><strong>AI:</strong> Error connecting.</p>`;
                console.error(err);
            }

            localStorage.setItem("chatHistory", chatOutput.innerHTML);
            chatInput.value = "";
        });

        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") chatSubmit.click();
        });

        if (chatClear) {
            chatClear.addEventListener("click", () => {
                chatOutput.innerHTML = "";
                localStorage.removeItem("chatHistory");
            });
        }
    }

    // ================================
    // MINI GAME
    // ================================
    const canvas = document.getElementById("gameCanvas");
    if (canvas) {
        console.log("🎮 Mini-game initialized.");
        const ctx = canvas.getContext("2d");

        let x = canvas.width / 2;
        let y = canvas.height - 30;
        let dx = 2;
        let dy = -2;
        const radius = 10;

        function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = "#3498db";
            ctx.fill();
            ctx.closePath();
        }

        function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();

            if (x + dx > canvas.width - radius || x + dx < radius) dx = -dx;
            if (y + dy > canvas.height - radius || y + dy < radius) dy = -dy;

            x += dx;
            y += dy;
        }

        setInterval(update, 16);
    }
});
