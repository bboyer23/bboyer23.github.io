// Scroll animation
const schoolFadeEls = document.querySelectorAll(".fade-in, .scale-up");

function animateSchoolProjects() {
    schoolFadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            el.classList.add("visible");
        }
    });
}

document.addEventListener("scroll", animateSchoolProjects);
document.addEventListener("DOMContentLoaded", animateSchoolProjects);
