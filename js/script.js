document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const navbarToggle = document.getElementById('navbar-toggle');
    const fullscreenMenu = document.getElementById('fullscreen-menu');
    const closeMenuBtn = document.getElementById('close-menu');

    // Dark mode toggle functionality
    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const icon = toggleBtn.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            document.getElementById('particles-js').style.backgroundColor = '#1e1e1e'; // Dark background for particles
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            document.getElementById('particles-js').style.backgroundColor = '#ffffff'; // Light background for particles
        }
    });

    // Navbar toggle functionality for smaller screens
    navbarToggle.addEventListener('click', () => {
        fullscreenMenu.classList.toggle('active');
        const navbarLinks = document.querySelectorAll('.navbar a');
        navbarLinks.forEach(link => {
            link.classList.toggle('show');
        });
    });

    // Close menu functionality
    closeMenuBtn.addEventListener('click', () => {
        fullscreenMenu.classList.remove('active');
    });

    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#3498db'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#3498db',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
});
