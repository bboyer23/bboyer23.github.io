// Reveal animations for leadership elements
const leadershipEls = document.querySelectorAll(".fade-in, .scale-up");

function animateLeadership() {
    leadershipEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            el.classList.add("visible");
        }
    });
}

document.addEventListener("scroll", animateLeadership);
document.addEventListener("DOMContentLoaded", animateLeadership);
