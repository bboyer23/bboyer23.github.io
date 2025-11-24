// Reveal animations for research elements
const researchEls = document.querySelectorAll(".fade-in, .scale-up");

function animateResearch() {
    researchEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 70) {
            el.classList.add("visible");
        }
    });
}

document.addEventListener("scroll", animateResearch);
document.addEventListener("DOMContentLoaded", animateResearch);
