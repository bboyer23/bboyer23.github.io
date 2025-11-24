// Fade elements in on scroll
const storyFadeEls = document.querySelectorAll(".fade-in, .scale-up");

function handleScroll() {
    storyFadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            el.classList.add("visible");
        }
    });
}

document.addEventListener("scroll", handleScroll);
document.addEventListener("DOMContentLoaded", handleScroll);
