document.addEventListener('DOMContentLoaded', () => {
    // Typed.js
    const typedEl = document.querySelector('.typed-text');
    if (typedEl) {
        new Typed('.typed-text', {
            strings: [
                "Exploring the intersection of technology, creativity, and ambition."
            ],
            typeSpeed: 50,
            backSpeed: 25,
            loop: true,
            showCursor: false,
            // cursorChar: 'a',
            smartBackspace: true
        });
    }

    // Particles.js
    const particlesDiv = document.getElementById('particles-js');
    if (particlesDiv) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#3498db' },
                shape: { type: 'circle' },
                opacity: { value: 0.5 },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#3498db', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 3, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' }
                },
                modes: {
                    repulse: { distance: 200, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
});
