document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const navbarToggle = document.getElementById('navbar-toggle');
    const sideMenu = document.getElementById('side-menu');
    const closeSideMenu = document.getElementById('close-side-menu');

    // Dark mode toggle functionality
    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const icon = toggleBtn.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // Navbar toggle functionality for smaller screens
    navbarToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('show');
    });

    // Close side menu functionality
    closeSideMenu.addEventListener('click', () => {
        sideMenu.classList.remove('show');
    });

    // Initialize Typed.js
    try {
        const typed = new Typed('.typed-text', {
            strings: ["Hi, I'm Benjamin Boyer", "Exploring the intersection of technology, creativity, and ambition"],
            typeSpeed: 50,
            backSpeed: 25,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            smartBackspace: true,
            autoInsertCss: true
        });
    } catch (error) {
        console.error("Typed.js initialization error:", error);
    }

    // Initialize Particles.js
    try {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#3498db'
                },
                shape: {
                    type: 'circle',
                },
                opacity: {
                    value: 0.5,
                },
                size: {
                    value: 3,
                    random: true,
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#3498db',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    out_mode: 'out',
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                },
                modes: {
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    } catch (error) {
        console.error("Particles.js initialization error:", error);
    }

    // Initialize Canvas Game
    const canvas = document.getElementById('gameCanvas');
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

    setInterval(updateGame, 10);
});
