/* Updated darkMode.js */
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (!toggleBtn) return;

    const body = document.body;
    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            document.documentElement.style.setProperty('--text-color', '#ffffff');
            document.documentElement.style.setProperty('--background-color', '#121212');
        } else {
            document.documentElement.style.setProperty('--text-color', '#333333');
            document.documentElement.style.setProperty('--background-color', '#ffffff');
        }
    });
});