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

    // Time until the TJX start date (Sept 14, 2026). Powers the live status
    // touches and gracefully flips to "started" once the date passes — no edits
    // needed after the fact.
    function tjxCountdown() {
        var start = new Date(2026, 8, 14); // months are 0-indexed → 8 = September
        var diff = start - new Date();
        if (diff <= 0) return { started: true };
        var day = 24 * 60 * 60 * 1000;
        return { started: false, days: Math.ceil(diff / day), weeks: Math.round(diff / (7 * day)) };
    }

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
        // Tell the inline <head> safety net that interactions initialized successfully.
        window.__portfolioReady = true;

        /* ---------- 5. HERO ROLE ROTATOR ---------- */
        var rotator = $('#rotator');
        if (rotator) {
            var phrases = [
                'IT systems & support',
                'Agile & sprint coordination',
                'cloud, identity & security',
                'AI & automation',
                'local AI & self-hosting',
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
            var tjx = tjxCountdown();
            var msg = tjx.started ? 'on the team @ TJX ✓'
                                  : 'incoming @ TJX · Sep 14 · ~' + tjx.weeks + ' wks ✓';
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

        // Live countdown chip in the Now-Building status bar
        var tjxEl = $('#tjxCountdown');
        if (tjxEl) {
            var nbTjx = tjxCountdown();
            tjxEl.textContent = nbTjx.started
                ? 'day one cleared · now at TJX'
                : '~' + nbTjx.weeks + ' wks to day one @ TJX · Sep 14';
            tjxEl.classList.add('is-on');
        }

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

        // ----- Case-study diagrams (built inline so they inherit the site theme) -----
        var FIG = {
            chronobox: '<div class="arch"><div class="arch-layer"><span class="arch-ico">🔒</span><div class="arch-txt"><b>Private access</b><span>Only you, on your own LAN — nothing exposed to the public internet</span></div></div><div class="arch-layer"><span class="arch-ico">☁️</span><div class="arch-txt"><b>Nextcloud</b><span>Files, sync &amp; sharing — served by Nginx + PHP-FPM</span></div></div><div class="arch-layer"><span class="arch-ico">🗃️</span><div class="arch-txt"><b>Data services</b><span>PostgreSQL 17 · Redis cache — bound to localhost</span></div></div><div class="arch-layer"><span class="arch-ico">💽</span><div class="arch-txt"><b>Storage</b><span>NVMe boot · RAID-1 mirror, 1.8&nbsp;TB usable · SMART-monitored</span></div></div><div class="arch-layer"><span class="arch-ico">🐧</span><div class="arch-txt"><b>Debian 13 (Trixie)</b><span>Intel J4125 mini-NAS — low-power, always-on</span></div></div><div class="arch-rail"><span>🛡️ Hardened —</span> UFW default-deny · Fail2Ban · SSH keys-only · automatic security updates</div></div>',
            claptrap: '<div class="systems-flow"><div class="flow-node"><div class="fn-icon">🎤</div><div class="fn-label">You speak</div><div class="fn-sub">mic capture</div></div><div class="flow-arrow">→</div><div class="flow-node"><div class="fn-icon">📝</div><div class="fn-label">Transcribe</div><div class="fn-sub">faster-whisper</div></div><div class="flow-arrow">→</div><div class="flow-node"><div class="fn-icon">🧠</div><div class="fn-label">Reason</div><div class="fn-sub">Ollama · Llama 3.2</div></div><div class="flow-arrow">→</div><div class="flow-node"><div class="fn-icon">🔊</div><div class="fn-label">Speak back</div><div class="fn-sub">Piper TTS</div></div></div><div class="arch-rail"><span>⚡ Action system —</span> open apps · URLs · web search · screenshot, allowlisted &amp; confirm-gated · 100% on-device</div>',
            fedc: '<div class="systems-flow"><div class="flow-node"><div class="fn-icon">🧭</div><div class="fn-label">Foundations</div><div class="fn-sub">September</div></div><div class="flow-arrow">→</div><div class="flow-node"><div class="fn-icon">🎨</div><div class="fn-label">Design</div><div class="fn-sub">October</div></div><div class="flow-arrow">→</div><div class="flow-node"><div class="fn-icon">🛠️</div><div class="fn-label">Build</div><div class="fn-sub">Oct–Nov</div></div><div class="flow-arrow">→</div><div class="flow-node"><div class="fn-icon">🚀</div><div class="fn-label">Delivery</div><div class="fn-sub">December</div></div></div>',
            worthit: '<svg viewBox="0 0 520 280" role="img" aria-label="Mockup of the Worth-It discovery screen with poppable opportunity bubbles" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="508" height="268" rx="26" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/><text x="34" y="46" font-family="Space Grotesk, sans-serif" font-size="24" font-weight="700" fill="#0f172a">Discovery</text><text x="35" y="64" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2" fill="#94a3b8">POPPABLE OPPORTUNITIES</text><rect x="452" y="26" width="36" height="36" rx="11" fill="#0f172a"/><text x="470" y="50" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="15" font-weight="800" fill="#ffffff">7</text><rect x="34" y="80" width="44" height="22" rx="11" fill="#0f172a"/><text x="56" y="95" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="#ffffff">All</text><rect x="86" y="80" width="94" height="22" rx="11" fill="#eef2f7"/><text x="133" y="95" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="#64748b">Environment</text><rect x="188" y="80" width="78" height="22" rx="11" fill="#eef2f7"/><text x="227" y="95" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="#64748b">Education</text><rect x="274" y="80" width="74" height="22" rx="11" fill="#eef2f7"/><text x="311" y="95" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="#64748b">Community</text><g font-family="Space Grotesk, sans-serif" font-weight="800" fill="#ffffff" text-anchor="middle"><circle cx="105" cy="192" r="50" fill="#34d399"/><circle cx="105" cy="192" r="42" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1.5"/><text x="105" y="196" font-size="13">Environment</text><circle cx="218" cy="168" r="37" fill="#60a5fa"/><circle cx="218" cy="168" r="31" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1.5"/><text x="218" y="172" font-size="11">Education</text><circle cx="312" cy="198" r="31" fill="#f472b6"/><text x="312" y="202" font-size="9.5">Community</text><circle cx="398" cy="160" r="42" fill="#a78bfa"/><circle cx="398" cy="160" r="34" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1.5"/><text x="398" y="164" font-size="12">Arts</text><circle cx="467" cy="220" r="26" fill="#fbbf24"/><text x="467" y="224" font-size="9">Animals</text><circle cx="300" cy="252" r="20" fill="#f87171" fill-opacity="0.55"/><text x="300" y="256" font-size="8">Health</text></g></svg><figcaption>A mockup of the Discovery screen — opportunities you match float larger; ones you’ve seen shrink and fade.</figcaption>'
        };

        // ----- Project case-study content (edit here to update projects) -----
        var PROJECTS = {
            chronobox: {
                role: 'Founder · Cloud in a Box → ChronoBox · 2024–2025',
                title: 'ChronoBox — Local Private-Cloud Appliance',
                blocks: [
                    { spec: [
                        { k: 'Problem', v: 'Public-cloud breaches are routine and personal data increasingly trains AI models — yet rolling your own private cloud is usually too clunky for everyday use.' },
                        { k: 'What I built', v: 'A privacy-first local private-cloud appliance running <strong>Nextcloud on Debian 13</strong>, with an NVMe boot disk and a <strong>RAID-1 mirrored 1.8&nbsp;TB</strong> data array — plus a hardening roadmap, full documentation, and a costed MVP model. It started as the “Cloud in a Box” prototype and became ChronoBox.' },
                        { k: 'Tools used', v: 'Debian 13 · Nextcloud · Nginx + PHP-FPM · PostgreSQL 17 · Redis · mdadm RAID-1 · UFW + Fail2Ban · Linux hardening' },
                        { k: 'What it taught me', v: 'Hardware selection, RAID configuration and recovery, Linux security hardening, and how to turn a technical idea into a documented, costed product concept.' },
                        { k: 'Impact', impact: true, v: 'A working MVP / framework with a defined Hybrid Product-as-a-Service model (<strong>~40% projected</strong> margin — projected, not realized revenue).' }
                    ] },
                    { h: 'Architecture', figure: FIG.chronobox },
                    { h: 'The stack, in detail', ul: [
                        'Debian 13 (Trixie) on a low-power Intel J4125 mini-NAS — a long support runway and a tiny idle footprint.',
                        'NVMe system disk plus two HDDs in a <strong>RAID-1 mirror</strong> (mdadm) for the Nextcloud data array, with SMART health monitoring.',
                        'Web &amp; data stack: Nginx + PHP-FPM serving Nextcloud, PostgreSQL 17, and Redis caching — bound to localhost.',
                        'Security posture: a UFW default-deny firewall, Fail2Ban brute-force protection, SSH root-login disabled, and automatic security updates.'
                    ] },
                    { h: 'From prototype to MVP', p: 'A staged roadmap moved it forward: <strong>(1) Hardened build</strong> — key-only SSH, RAID failure/recovery drills, automated rsync/Borg backups, and a one-command rebuild script. <strong>(2) MVP appliance</strong> — ChronoBox-themed Nextcloud, a two-step setup wizard, a customer quick-start guide, and beta feedback. <strong>(3) Launch prep</strong> — bill-of-materials costing, a pitch deck, and demo-ready units.' },
                    { h: 'Why it matters', p: 'As public-cloud breaches become routine and user data is increasingly used to train AI, ChronoBox explores giving people real data autonomy — without giving up the convenience of a modern cloud. It’s the infrastructure layer of a larger local-first idea that continues in <strong>Claptrap</strong>.' },
                    { h: 'Honest status', p: 'MVP / framework stage — a working appliance with documentation and a costed model. The ~40% margin is <b>projected, not realized revenue</b>; ChronoBox is a project and product concept, not a launched company.' },
                    { links: [{ label: 'Read the research paper behind it', href: 'assets/resources/Final-Research-BBoyer25.docx' }] }
                ]
            },
            claptrap: {
                role: 'Personal Project · 2026',
                title: 'Claptrap — Local Voice AI Sidekick',
                blocks: [
                    { spec: [
                        { k: 'Problem', v: 'Most voice assistants ship everything you say to the cloud. I wanted to see how capable a desktop assistant could be while running <strong>100% locally</strong> — no data leaving the machine.' },
                        { k: 'What I built', v: 'A Python voice assistant that listens, thinks, talks back, and takes safe desktop actions — entirely offline. It’s the playful “interface” layer of the same local-first idea behind ChronoBox.' },
                        { k: 'Tools used', v: 'Python · Ollama (Llama 3.2) · faster-whisper (speech-to-text) · Piper + pyttsx3 (text-to-speech) · sounddevice' },
                        { k: 'What it taught me', v: 'Wiring a real local-AI pipeline — speech-to-text, a local LLM, and text-to-speech — and designing an action system that’s useful without being unsafe.' },
                        { k: 'Impact', impact: true, v: 'A working voice loop: speak → transcribe → local LLM → spoken reply, with confirmation-gated actions. A genuine experiment, not a product.' }
                    ] },
                    { h: 'The voice loop', figure: FIG.claptrap },
                    { h: 'How it works', ul: [
                        '<strong>Hears you:</strong> records the mic and transcribes locally with faster-whisper.',
                        '<strong>Thinks:</strong> sends the conversation to a local Ollama model (Llama 3.2), with a graceful fallback if the model is offline.',
                        '<strong>Talks back:</strong> speaks replies with Piper (a neural voice) or pyttsx3.',
                        '<strong>Acts — carefully:</strong> can open apps, open URLs, run a web search, or take a screenshot — but only from an <strong>allowlist</strong>, and by default only after you confirm.'
                    ] },
                    { h: 'The bigger idea', p: 'ChronoBox gives you private infrastructure; Claptrap is the local, voice-driven <em>interface</em> to it. Together they sketch a personal “edge” ecosystem — your data and your AI, on hardware you control.' },
                    { h: 'Honest scope', p: 'Claptrap is a personal experiment built to learn the local-AI stack — funny on purpose, genuinely useful, and clearly not a shipped product.' }
                ]
            },
            fedc: {
                role: 'Team Lead · Capstone · Sept – Dec 2025',
                title: 'Framingham EDC Website',
                blocks: [
                    { spec: [
                        { k: 'Problem', v: 'The Framingham Economic Development Corporation needed a polished, visual-first web presence to present itself credibly to enterprise investors and highlight the city’s life-sciences and emerging-tech base.' },
                        { k: 'What I led', v: 'As <strong>team lead of “BlackGroup” — a capstone team that grew from four to six</strong> — I owned project coordination, the plan and timeline, client communication, and final delivery, guiding the team from requirements through a built Squarespace site.' },
                        { k: 'Tools used', v: 'Squarespace · UX / visual design · SEO &amp; analytics · stakeholder management · Agile-style status tracking' },
                        { k: 'What it taught me', v: 'How to run stakeholder communication, keep a team aligned to real milestones, manage scope and risk, and ship something real for an external client.' },
                        { k: 'Impact', impact: true, v: 'Delivered on schedule with a clean handoff package (design decisions, technical setup, content log) so non-technical FEDC staff could maintain it.' }
                    ] },
                    { h: 'Timeline', figure: FIG.fedc },
                    { h: 'How we built it', ul: [
                        'Anchored the design on a clean, “Ritz-Carlton-style” visual-first aesthetic agreed with the client.',
                        'Structured the site around eight sections — Home, About, Programs/Services, Life in Framingham, News &amp; Events, Business Resources, Board of Advisors, and Contact.',
                        'Planned SEO &amp; analytics from day one: clean URLs, alt text, Open Graph tags, SSL, and Google Search Console / Analytics.',
                        'Ran weekly client check-ins and a documented risk matrix to keep scope and delivery under control.'
                    ] },
                    { h: 'Outcome & handoff', p: 'We delivered the capstone build to the client in December 2025. The client wanted to keep iterating after the academic deadline, so I handed the site off to a teammate who continues to maintain it — it now lives under their ownership. Leading it end-to-end and transitioning it cleanly was the real win.' },
                    { h: 'Site structure', tags: ['Home', 'About', 'Programs', 'Life in Framingham', 'News &amp; Events', 'Business Resources', 'Board of Advisors', 'Contact'] },
                    { links: [{ label: 'View the project plan', href: 'assets/resources/FEDC-Project-Plan.pdf' }, { label: 'Technical setup plan', href: 'assets/resources/FEDC-Technical-Setup.pdf' }] }
                ]
            },
            worthit: {
                role: 'Personal Project · React PWA',
                title: 'Worth-It — Volunteer Discovery PWA',
                blocks: [
                    { spec: [
                        { k: 'Problem', v: 'Finding volunteer work is usually a dull list of postings. I wanted discovery to feel playful — something you’d actually want to browse.' },
                        { k: 'What I built', v: 'A mobile-first <strong>progressive web app</strong> where volunteer opportunities float as <strong>poppable bubbles</strong> — tap one to “pop” it open. It’s a two-sided marketplace connecting volunteers and organizations.' },
                        { k: 'Tools used', v: 'React 19 · TypeScript · Vite · D3 (force simulation) · React Router · PWA (service worker + manifest)' },
                        { k: 'What it taught me', v: 'Building a real React app end-to-end — physics-driven UI with D3, role-based routing and auth, and shipping it as an installable PWA.' },
                        { k: 'Impact', impact: true, v: 'A working prototype with separate volunteer and organization experiences, onboarding, and in-app messaging between the two sides.' }
                    ] },
                    { h: 'A look at the app', figure: FIG.worthit },
                    { h: 'What makes it fun', ul: [
                        'A <strong>D3 force-directed “bubble” canvas</strong> — opportunities you match better float bigger; ones you’ve already seen shrink and fade.',
                        'Tap to pop a bubble open into its details, then message the organization in one tap.',
                        'Two roles, two flows: <strong>volunteers</strong> discover and reach out; <strong>organizations</strong> post opportunities and manage interest.',
                        'Installable and mobile-first — built as a PWA with offline-friendly scaffolding.'
                    ] },
                    { h: 'Honest scope', p: 'A working prototype / learning project — the discovery UX and the two-sided flows are real and interactive; it runs on sample data, not a live community yet.' }
                ]
            },
            research: {
                role: 'Senior Research · Framingham State University',
                title: 'A New Era of Cloud Computing',
                blocks: [
                    { h: 'Overview', p: 'A research paper — “A New Era of Cloud Computing: The Local Centralized Private Cloud Model” — arguing that over-reliance on public-cloud storage is risky in an era of data scraping and AI training, and proposing a locally-centralized private-cloud model for sensitive data. It’s the conceptual foundation behind ChronoBox.' },
                    { h: 'Methodology', ul: [
                        'A <strong>mixed-methods</strong> design, grounded in the NIST definition of cloud computing and the public / private / hybrid models.',
                        'Quantitative analysis of security-breach trends across <strong>~200 companies</strong> to surface where public-cloud risk concentrates.',
                        'A qualitative <strong>Likert-scale survey</strong> gauging trust in and perceptions of cloud security.',
                        'An architectural argument for a local centralized private cloud — later realized as the Debian / Nextcloud ChronoBox build.'
                    ] },
                    { h: 'What I learned', p: 'How to structure a research argument, combine quantitative and qualitative evidence, and connect a technical proposal to a real-world privacy problem.' },
                    { links: [{ label: 'Download the full paper (.docx)', href: 'assets/resources/Final-Research-BBoyer25.docx' }] }
                ]
            },
            network: {
                role: 'Coursework · Network Design',
                title: 'Enterprise Network Design Proposal',
                blocks: [
                    { h: 'Overview', p: 'A full written network-design proposal for a fictional 20-person electronics manufacturer (“Boyer Technologies”) — a professional design document covering requirements, component selection, physical layout, and cost.' },
                    { h: 'What it covers', ul: [
                        'Requirements framed around <strong>scalability, security, performance, and redundancy</strong>.',
                        'Vendor-comparison component selection — router, firewall, managed switch, Wi-Fi 6 access points, CAT6 cabling, server, VoIP phones, and a UPS — each chosen from a pros/cons table.',
                        'Security &amp; segmentation via <strong>VLANs, a stateful firewall, and IDS/IPS</strong>; resilience via <strong>UPS battery backup and RAID</strong> on servers.',
                        'Floor-plan layout, LAN/WAN cabling (including PoE for phones and access points), and a full cost breakdown.'
                    ] },
                    { h: 'What I learned', p: 'How to translate business requirements into a concrete, costed network design — and how to justify technology choices against real product options.' },
                    { links: [{ label: 'Download the proposal (.docx)', href: 'assets/resources/Boyer-NetworkDesignProposal.docx' }] }
                ]
            }
        };

        function renderBlocks(blocks) {
            return blocks.map(function (b) {
                var html = '';
                if (b.h) html += '<h4>' + b.h + '</h4>';
                if (b.figure) html += '<figure class="pc-figure">' + b.figure + '</figure>';
                // Power-card spec: the five-part case-study framing
                if (b.spec) html += '<div class="pc-spec">' + b.spec.map(function (r) {
                    return '<div class="pc-row' + (r.impact ? ' is-impact' : '') + '">' +
                               '<div class="pc-k">' + r.k + '</div>' +
                               '<div class="pc-v">' + r.v + '</div>' +
                           '</div>';
                }).join('') + '</div>';
                if (b.p) html += '<p>' + b.p + '</p>';
                if (b.ul) html += '<ul>' + b.ul.map(function (li) { return '<li>' + li + '</li>'; }).join('') + '</ul>';
                if (b.tags) html += '<div class="tag-row">' + b.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div>';
                if (b.note) html += '<div class="modal-note"><b>🚧 In progress —</b> ' + b.note + '</div>';
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
