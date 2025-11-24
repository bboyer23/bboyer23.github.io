/**
 * Main.js — Global Application Logic
 * Hamburger menu, navigation, animations, etc.
 */

// ==============================
// HAMBURGER MENU TOGGLE
// ==============================
function initHamburgerMenu() {
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (!navToggle || !navMenu) {
        console.warn("Hamburger menu elements not found, retrying in 100ms");
        setTimeout(initHamburgerMenu, 100);
        return;
    }

    console.log("✓ Hamburger menu initialized");

    // Toggle menu on hamburger click
    navToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        navMenu.classList.toggle("open");
        navToggle.classList.toggle("active");
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            navToggle.classList.remove("active");
        });
    });

    // Close menu when clicking outside (on body/document)
    document.addEventListener("click", (e) => {
        // Only close if click is NOT on the menu or toggle button
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove("open");
            navToggle.classList.remove("active");
        }
    });
}

// ==============================
// LOAD COMPONENTS & INITIALIZE
// ==============================
function loadComponent(id, file, callback) {
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${file}: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const container = document.getElementById(id);
            if (!container) {
                console.error(`Element #${id} not found.`);
                return;
            }

            container.innerHTML = html;

            if (typeof callback === "function") {
                callback();
            }
        })
        .catch(err => console.error("Error loading component:", err));
}

// Load navbar + footer and initialize hamburger menu
document.addEventListener("DOMContentLoaded", () => {
    loadComponent("navbar", "components/navbar.html", () => {
        console.log("✓ Navbar loaded");
        initHamburgerMenu(); // Initialize after navbar is loaded
    });

    loadComponent("footer", "components/footer.html", () => {
        console.log("✓ Footer loaded");
    });
});
