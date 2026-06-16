/* =============================================================
   BEN BOYER — PORTFOLIO INTERACTIONS
   -------------------------------------------------------------
   Vanilla JS, no dependencies. Sections:
   1.  Theme toggle (persisted)
   2.  Scroll: progress bar + sticky nav + scrollspy + back-to-top
   3.  Mobile menu
   4.  Reveal-on-scroll
   5.  Hero role rotator (typewriter)
   6.  "Currently exploring" terminal status line
   7.  Experience cards: expand / collapse
   8.  Skills: category filter
   9.  GitHub: live public repositories
   10. Projects: case-study modal
   11. Misc (footer year, card glow)
   ============================================================= */

(function () {
    'use strict';

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

    document.addEventListener('DOMContentLoaded', function () {

        /* ---------- 1. THEME TOGGLE ---------- */
        var root = document.documentElement;
        var themeToggle = $('#themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                root.setAttribute('data-theme', next);
                try { localStorage.setItem('theme', next); } catch (e) {}
                var meta = $('meta[name="theme-color"]');
                if (meta) meta.setAttribute('content', next === 'light' ? '#F6F8FC' : '#0A0E17');
            });
        }

        /* ---------- 2. SCROLL: progress / nav / scrollspy / back-to-top ---------- */
        var nav = $('#nav');
        var progress = $('#scrollProgress');
        var toTop = $('#toTop');
        var navLinks = $$('.nav-links a');
        var sections = navLinks
            .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
            .filter(Boolean);
        var ticking = false;

        function onScroll() {
            var y = window.scrollY || window.pageYOffset;
            var docH = document.documentElement.scrollHeight - window.innerHeight;

            if (progress) progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
            if (nav) nav.classList.toggle('scrolled', y > 24);
            if (toTop) toTop.classList.toggle('show', y > 600);

            // Scrollspy
            var current = sections[0] ? sections[0].id : null;
            var probe = y + (window.innerHeight * 0.35);
            sections.forEach(function (sec) {
                if (sec.offsetTop <= probe) current = sec.id;
            });
            navLinks.forEach(function (a) {
                a.classList.toggle('active', a.getAttribute('href') === '#' + current);
            });
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
        }, { passive: true });
        onScroll();

        if (toTop) toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
        });

        /* ---------- 3. MOBILE MENU ---------- */
        var hamburger = $('#hamburger');
        var mobileMenu = $('#mobileMenu');
        if (hamburger && mobileMenu) {
            var toggleMenu = function (open) {
                hamburger.classList.toggle('active', open);
                mobileMenu.classList.toggle('active', open);
                hamburger.setAttribute('aria-expanded', String(open));
                hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
                document.body.style.overflow = open ? 'hidden' : '';
            };
            hamburger.addEventListener('click', function () {
                toggleMenu(!mobileMenu.classList.contains('active'));
            });
            $$('a', mobileMenu).forEach(function (link) {
                link.addEventListener('click', function () { toggleMenu(false); });
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && mobileMenu.classList.contains('active')) toggleMenu(false);
            });
        }

        /* ---------- 4. REVEAL ON SCROLL ---------- */
        var revealEls = $$('.reveal');
        if (prefersReduced || !('IntersectionObserver' in window)) {
            revealEls.forEach(function (el) { el.classList.add('show'); });
        } else {
            var io = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) { entry.target.classList.add('show'); obs.unobserve(entry.target); }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
            revealEls.forEach(function (el) { io.observe(el); });
        }

        /* ---------- 5. HERO ROLE ROTATOR ---------- */
        var rotator = $('#rotator');
        if (rotator) {
            var phrases = [
                'IT systems & support',
                'Agile & sprint coordination',
                'cloud, identity & security',
                'AI & automation',
                'solutions engineering',
                'process improvement'
            ];
            if (prefersReduced) {
                rotator.textContent = phrases[0];
            } else {
                var pi = 0, ci = 0, deleting = false;
                var tick = function () {
                    var word = phrases[pi];
                    ci += deleting ? -1 : 1;
                    rotator.textContent = word.slice(0, ci);
                    var delay = deleting ? 45 : 85;
                    if (!deleting && ci === word.length) { deleting = true; delay = 1600; }
                    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
                    setTimeout(tick, delay);
                };
                setTimeout(tick, 800);
            }
        }

        /* ---------- 6. TERMINAL STATUS LINE ---------- */
        var typed = $('.terminal-body .typed');
        if (typed) {
            var msg = 'open to early-career roles ✓';
            if (prefersReduced) {
                typed.textContent = msg;
            } else {
                var ti = 0;
                var typeIt = function () {
                    typed.textContent = msg.slice(0, ti);
                    if (ti <= msg.length) { ti++; setTimeout(typeIt, 55); }
                };
                // start once the terminal scrolls into view
                if ('IntersectionObserver' in window) {
                    var tio = new IntersectionObserver(function (e, o) {
                        if (e[0].isIntersecting) { typeIt(); o.disconnect(); }
                    }, { threshold: 0.5 });
                    tio.observe(typed);
                } else { typeIt(); }
            }
        }

        /* ---------- 7. EXPERIENCE EXPAND / COLLAPSE ---------- */
        $$('.xp-card').forEach(function (card) {
            var toggle = function () {
                var open = card.classList.toggle('open');
                card.setAttribute('aria-expanded', String(open));
            };
            card.addEventListener('click', toggle);
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
            });
        });

        /* ---------- 8. SKILLS FILTER ---------- */
        var filters = $$('.skill-filter');
        var groups = $$('.skill-group');
        filters.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filters.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var f = btn.getAttribute('data-filter');
                groups.forEach(function (g) {
                    g.classList.toggle('dim', f !== 'all' && g.getAttribute('data-category') !== f);
                });
            });
        });

        /* ---------- 9. GITHUB REPOS ---------- */
        loadGitHubRepos('bboyer23');

        /* ---------- 10. PROJECT MODAL ---------- */
        initProjectModal();

        /* ---------- 11. MISC ---------- */
        var yearEl = $('#year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        // Pointer-tracking glow on project cards (skipped for reduced motion)
        if (!prefersReduced) {
            $$('.project-card').forEach(function (card) {
                card.addEventListener('pointermove', function (e) {
                    var r = card.getBoundingClientRect();
                    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
                });
            });
        }
    });

    /* =========================================================
       GITHUB FEED
       ========================================================= */
    function loadGitHubRepos(username) {
        var container = document.getElementById('github-repos');
        if (!container) return;

        fetch('https://api.github.com/users/' + username + '/repos?per_page=100&sort=updated')
            .then(function (r) { if (!r.ok) throw new Error('GitHub ' + r.status); return r.json(); })
            .then(function (repos) {
                if (!Array.isArray(repos)) throw new Error('Unexpected response');
                var visible = repos.filter(function (repo) { return !repo.fork && !repo.archived; }).slice(0, 6);

                if (!visible.length) { return showFallback(); }

                container.innerHTML = '';
                visible.forEach(function (repo) {
                    var card = document.createElement('a');
                    card.className = 'panel gh-card';
                    card.href = repo.html_url;
                    card.target = '_blank';
                    card.rel = 'noopener';
                    card.innerHTML =
                        '<h4>' + escapeHtml(repo.name) + ' <span aria-hidden="true" style="color:var(--text-faint)">↗</span></h4>' +
                        '<p>' + escapeHtml(repo.description || 'No description provided.') + '</p>' +
                        '<div class="gh-meta">' +
                            (repo.language ? '<span class="lang">' + escapeHtml(repo.language) + '</span>' : '') +
                            '<span>★ ' + repo.stargazers_count + '</span>' +
                            (repo.forks_count ? '<span>⑂ ' + repo.forks_count + '</span>' : '') +
                        '</div>';
                    container.appendChild(card);
                });
            })
            .catch(function (err) {
                console.warn('GitHub feed unavailable:', err.message);
                showFallback();
            });

        function showFallback() {
            container.innerHTML =
                '<a class="panel gh-card" href="https://github.com/' + username + '" target="_blank" rel="noopener">' +
                '<h4>View my GitHub <span aria-hidden="true">↗</span></h4>' +
                '<p>Live repository data couldn\'t load right now (GitHub rate limits unauthenticated requests). Browse everything directly on my profile.</p>' +
                '<div class="gh-meta"><span class="lang">@' + username + '</span></div></a>';
        }
    }

    /* =========================================================
       PROJECT CASE-STUDY MODAL
       ========================================================= */
    function initProjectModal() {
        var backdrop = document.getElementById('projectModal');
        if (!backdrop) return;
        var roleEl = document.getElementById('modalRole');
        var titleEl = document.getElementById('modalTitle');
        var bodyEl = document.getElementById('modalBody');
        var closeBtn = document.getElementById('modalClose');
        var lastFocused = null;

        // ----- Project case-study content (edit here to update projects) -----
        var PROJECTS = {
            chronobox: {
                role: 'Founder · Jun 2024 – Oct 2025',
                title: 'ChronoBox — Local Private Cloud Appliance',
                blocks: [
                    { h: 'What it is', p: 'A privacy-first local private-cloud appliance: a self-hosted system that gives an individual or small team their own cloud storage and services on hardware they physically control.' },
                    { h: 'Why it matters', p: 'As public-cloud breaches become routine and user data is increasingly used to train AI, ChronoBox explores giving people real data autonomy — without giving up the convenience of a modern cloud.' },
                    { h: 'What I did', ul: [
                        'Engineered the system on Nextcloud + Debian 13 with RAID-1 for redundancy and secure data autonomy.',
                        'Developed a setup framework, documentation, and a cost analysis for an MVP deployment.',
                        'Defined a Hybrid Product-as-a-Service (HPaaS) model with a 40% <em>projected</em> margin.'
                    ] },
                    { h: 'Tech', tags: ['Nextcloud', 'Debian 13', 'RAID-1', 'Linux', 'Self-Hosting'] },
                    { h: 'Status', p: 'MVP / framework stage — a working concept with documentation and a costed model. The 40% margin is <b>projected, not realized revenue</b>; ChronoBox is a project and product concept, not a launched company.' },
                    { h: 'What I learned', p: 'Hardware selection, RAID configuration, Linux security hardening, and how to turn a technical idea into a documented, costed product concept.' },
                    { links: [{ label: 'Read the related research paper', href: 'assets/resources/Final-Research-BBoyer25.docx' }] },
                    { note: 'TODO(ben): a system architecture diagram (CIAB-Diagram.png) was referenced on the old site but isn\'t in the repo. Drop it into assets/resources/ and a GitHub repo link, and I\'ll showcase them here.' }
                ]
            },
            fedc: {
                role: 'Team Lead · Capstone · Sept 2025 – Present',
                title: 'Framingham EDC Website',
                blocks: [
                    { h: 'What it is', p: 'A capstone client project: designing and launching a Squarespace website for the Framingham Economic Development Corporation (EDC).' },
                    { h: 'My role', p: 'I lead a 6-person team, owning client relations, UI/UX direction, and SEO, and managing deliverables through to handoff.' },
                    { h: 'What I did', ul: [
                        'Led a 6-person team to design and launch the site on Squarespace.',
                        'Translated client needs into clear requirements and managed milestones to a real deadline.',
                        'Oversaw UI/UX and SEO with the goal of presenting the EDC professionally to enterprise investors.',
                        'Managed key deliverables and prepared a clean handoff for continuous-improvement work.'
                    ] },
                    { h: 'Skills', tags: ['Squarespace', 'UI / UX', 'SEO', 'Stakeholder Mgmt', 'Team Leadership'] },
                    { h: 'Status', p: 'In progress.' },
                    { h: 'What I learned', p: 'How to run stakeholder communication, keep a team aligned, and ship something real for an external client.' },
                    { note: 'TODO(ben): add the live site URL and a few screenshots (FEDC-1/2/3.png) to assets/resources/ and I\'ll feature them here.' }
                ]
            },
            research: {
                role: 'Senior Research',
                title: 'A New Era of Cloud Computing',
                blocks: [
                    { h: 'Overview', p: 'Research analyzing why trust in public-cloud storage is eroding, and proposing a hybrid “local centralized private cloud” model for sensitive use cases — the conceptual foundation behind ChronoBox.' },
                    { h: 'Methodology', ul: [
                        'Quantitative analysis of major cloud breaches (2020–2024) by vector and scale.',
                        'Qualitative survey of sentiment around AI training on user data vs. privacy expectations.',
                        'An architectural proposal specified as a Debian / Nextcloud implementation (ChronoBox).'
                    ] },
                    { h: 'What I learned', p: 'How to structure a research argument, combine quantitative and qualitative evidence, and connect a technical proposal to a real-world problem.' },
                    { links: [{ label: 'Download the full paper (.docx)', href: 'assets/resources/Final-Research-BBoyer25.docx' }] },
                    { note: 'TODO(ben): the old site mentioned a UMass research-poster presentation (Spring 2025). I left it off to stay strictly verifiable — tell me if you\'d like it added back.' }
                ]
            },
            network: {
                role: 'Coursework',
                title: 'Enterprise Network Design Proposal',
                blocks: [
                    { h: 'Overview', p: 'A formal written proposal designing an enterprise network — covering topology, addressing, segmentation, and security considerations — delivered as a professional design document.' },
                    { links: [{ label: 'Download the proposal (.docx)', href: 'assets/resources/Boyer-NetworkDesignProposal.docx' }] },
                    { note: 'TODO(ben): confirm the specifics (scope, tools used) and I\'ll expand this summary — kept intentionally modest for accuracy.' }
                ]
            }
        };

        function renderBlocks(blocks) {
            return blocks.map(function (b) {
                var html = '';
                if (b.h) html += '<h4>' + b.h + '</h4>';
                if (b.p) html += '<p>' + b.p + '</p>';
                if (b.ul) html += '<ul>' + b.ul.map(function (li) { return '<li>' + li + '</li>'; }).join('') + '</ul>';
                if (b.tags) html += '<div class="tag-row">' + b.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div>';
                if (b.note) html += '<div class="modal-note"><b>Note —</b> ' + b.note + '</div>';
                if (b.links) html += '<div class="modal-links">' + b.links.map(function (l) {
                    return '<a class="btn btn-ghost btn-sm" href="' + l.href + '" target="_blank" rel="noopener">' + l.label + ' ↗</a>';
                }).join('') + '</div>';
                return html;
            }).join('');
        }

        function open(id, trigger) {
            var data = PROJECTS[id];
            if (!data) return;
            lastFocused = trigger || document.activeElement;
            roleEl.textContent = data.role;
            titleEl.textContent = data.title;
            bodyEl.innerHTML = renderBlocks(data.blocks);
            backdrop.classList.add('open');
            backdrop.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }
        function close() {
            backdrop.classList.remove('open');
            backdrop.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocused) lastFocused.focus();
        }

        $$('.project-card').forEach(function (card) {
            var id = card.getAttribute('data-project');
            if (!id) return;
            card.addEventListener('click', function () { open(id, card); });
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(id, card); }
            });
        });

        closeBtn.addEventListener('click', close);
        backdrop.addEventListener('click', function (e) { if (e.target === backdrop) close(); });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && backdrop.classList.contains('open')) close();
        });
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
})();
