/* Updated navbar.js */
document.addEventListener("DOMContentLoaded", () => {
    const navbarToggle = document.getElementById("navbar-toggle");
    const sideMenu = document.getElementById("side-menu");
    const closeSideMenu = document.getElementById("close-side-menu");

    if (!navbarToggle || !sideMenu || !closeSideMenu) return;

    navbarToggle.addEventListener("click", () => {
        sideMenu.classList.toggle("open");
        navbarToggle.classList.toggle("active");
    });

    closeSideMenu.addEventListener("click", () => {
        sideMenu.classList.remove("open");
        navbarToggle.classList.remove("active");
    });

    document.addEventListener("click", (e) => {
        if (!sideMenu.contains(e.target) && !navbarToggle.contains(e.target)) {
            sideMenu.classList.remove("open");
            navbarToggle.classList.remove("active");
        }
    });
});