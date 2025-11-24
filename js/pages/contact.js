// Copy Email to Clipboard
const copyBtn = document.getElementById("copyEmail");
const emailText = document.getElementById("emailText");
const feedback = document.getElementById("copyFeedback");

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(emailText.textContent);

    feedback.style.opacity = "1";

    setTimeout(() => {
        feedback.style.opacity = "0";
    }, 1600);
});

// Trigger animations on load/scroll
const contactEls = document.querySelectorAll(".fade-in, .scale-up");

function animateContact() {
    contactEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            el.classList.add("visible");
        }
    });
}

document.addEventListener("scroll", animateContact);
document.addEventListener("DOMContentLoaded", animateContact);
