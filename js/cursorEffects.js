// cursorEffects.js
// Simple cursor trail effect using canvas

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        particles.push({
            x: e.clientX,
            y: e.clientY,
            radius: 8,
            alpha: 1
        });
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(30, 144, 255, ${p.alpha})`;
            ctx.fill();
            p.radius -= 0.4;
            p.alpha -= 0.02;
            if (p.alpha <= 0) particles.splice(i, 1);
        }
        requestAnimationFrame(draw);
    }

    draw();
});
