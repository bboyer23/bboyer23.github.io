// navbar.js with context-aware navigation

document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.getElementById('navbar-toggle');
    const sideMenu = document.getElementById('side-menu');
    const closeSideMenu = document.getElementById('close-side-menu');

    if (navbarToggle && sideMenu && closeSideMenu) {
        navbarToggle.addEventListener('click', () => {
            sideMenu.classList.toggle('open');
            navbarToggle.classList.toggle('active');
        });

        closeSideMenu.addEventListener('click', () => {
            sideMenu.classList.remove('open');
            navbarToggle.classList.remove('active');
        });

        document.addEventListener('click', (e) => {
            if (!sideMenu.contains(e.target) && !navbarToggle.contains(e.target)) {
                sideMenu.classList.remove('open');
                navbarToggle.classList.remove('active');
            }
        });
    }

    // Context-aware navigation highlight
    const navLinks = document.querySelectorAll('.navbar-links a, .side-menu a');
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').replace(/^#/, '') === entry.target.id);
                });
            }
        });
    }, { threshold: 0.6 });

    sections.forEach(sec => observer.observe(sec));
});
