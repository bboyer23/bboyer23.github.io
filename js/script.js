// script.js (Master entry point for all modules)

// Import modules (dark mode, navbar, effects, quiz, game).
// They will only be executed once per page load, no duplicates.

import './darkMode.js';
import './navbar.js';
import './effects.js';
import './fun.js';
import './game.js';

console.log("[script.js] All modules imported successfully!");

// OPTIONAL: If you prefer Intersection Observer to ScrollReveal, uncomment below:
/*
const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('animated-fade-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animateOnScrollElements.forEach(el => observer.observe(el));
*/
