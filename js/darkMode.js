// darkMode.js with audio toggle

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (!toggleBtn) return;

    const body = document.body;

    function playBeep() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        playBeep();

        if (body.classList.contains('dark-mode')) {
            document.documentElement.style.setProperty('--text-color', '#ffffff');
            document.documentElement.style.setProperty('--background-color', '#121212');
        } else {
            document.documentElement.style.setProperty('--text-color', '#333333');
            document.documentElement.style.setProperty('--background-color', '#ffffff');
        }
    });
});
