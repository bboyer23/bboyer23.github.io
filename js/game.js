document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.log("🟡 [game.js] No game canvas found on this page.");
        return;
    }

    console.log("✅ [game.js] Canvas found, starting game.");
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

        // Horizontal bounce
        if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
            ballDX = -ballDX;
        }
        // Vertical bounce
        if (ballY + ballDY > canvas.height - ballRadius || ballY + ballDY < ballRadius) {
            ballDY = -ballDY;
        }

        ballX += ballDX;
        ballY += ballDY;
    }

    setInterval(updateGame, 16); // ~60fps
});
