/* 
   MAIN INTERACTION SCRIPT
   - Scroll Reveal Animation
   - Mobile Navigation Toggle
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SCROLL REVEAL ANIMATION
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));


    // 2. MOBILE NAVIGATION LOGIC
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            if (mobileMenu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = 'auto';
            }
        });

        const mobileLinks = document.querySelectorAll('.mobile-menu a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = 'auto';
            });
        });
    }


    // 3. LOAD ALL PUBLIC GITHUB REPOS
    async function loadGitHubRepos() {
        const username = "bboyer23"; 

        try {
            const response = await fetch(
                `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
            );

            const repos = await response.json();
            const container = document.getElementById("github-repos");

            if (!container) return;

            container.innerHTML = "";

            repos
                .filter(repo => !repo.fork)
                .forEach(repo => {

                    const card = document.createElement("div");
                    card.classList.add("project-card");

                    card.innerHTML = `
                        <h3 style="margin-bottom: 0.5rem;">${repo.name}</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
                            ${repo.description || "No description provided."}
                        </p>
                        <div class="tag-container" style="margin-bottom: 1rem;">
                            <span class="tag">${repo.language || "Code"}</span>
                            <span class="tag">⭐ ${repo.stargazers_count}</span>
                        </div>
                        <a href="${repo.html_url}" target="_blank" class="view-case-study">
                            View Repository →
                        </a>
                    `;

                    container.appendChild(card);
                });

        } catch (error) {
            console.error("Error loading GitHub repos:", error);
        }
    }

    loadGitHubRepos();

});
