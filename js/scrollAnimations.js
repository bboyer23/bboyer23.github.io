// scrollAnimations.js
// Cinematic scroll-based animations using GSAP and ScrollTrigger

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || !window.ScrollTrigger) {
        console.warn('[scrollAnimations] GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Animate section titles
    gsap.utils.toArray('.section').forEach(section => {
        const title = section.querySelector('h2');
        if (!title) return;

        gsap.from(title, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
            }
        });
    });
});
