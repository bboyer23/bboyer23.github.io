// Reveal cards + leadership items on scroll
const expEls = document.querySelectorAll(".fade-in, .scale-up");

function animateExperience() {
    expEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            el.classList.add("visible");
        }
    });
}

document.addEventListener("scroll", animateExperience);
document.addEventListener("DOMContentLoaded", animateExperience);
