// Simple fade-in animation on scroll
const fadeElements = document.querySelectorAll(".fade-in");

function fadeInOnScroll() {
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add("visible");
        }
    });
}

document.addEventListener("scroll", fadeInOnScroll);
document.addEventListener("DOMContentLoaded", fadeInOnScroll);
