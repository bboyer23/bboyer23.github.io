// Animate personal projects page items
const ppEls = document.querySelectorAll(".fade-in, .scale-up");

function animatePP() {
    ppEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
            el.classList.add("visible");
        }
    });
}

document.addEventListener("scroll", animatePP);
document.addEventListener("DOMContentLoaded", animatePP);
