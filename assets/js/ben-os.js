/* =============================================================
   BEN BOYER — "BEN OS" INTERACTION LAYER
   -------------------------------------------------------------
   The interactive "operating system" layer that sits on top of
   the core portfolio. Vanilla JS, no dependencies, ES5-safe to
   match main.js. Loads after main.js so the base site is always
   usable even if this file fails.

   Sections:
   1.  Helpers + persisted state
   2.  Momentum Mode (toggle + microcopy + motion)
   3.  Viewing modes (Recruiter / Builder / Story lenses)
   4.  Command palette (Ctrl/Cmd + K)
   5.  Chaos -> Clarity interaction
   6.  Achievement unlocks (scroll-triggered)
   7.  Easter eggs (typed words + logo)
   8.  Shared toast utility
   ============================================================= */
(function () {
    'use strict';

    /* ---------- 1. HELPERS + STATE ---------- */
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var root = document.documentElement;
    var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

    var store = {
        get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
    };
    var session = {
        get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
    };

    // Is the current document the main portfolio (has the section anchors)?
    function hasSections() { return !!document.getElementById('projects'); }

    // Resolve an in-page hash to a working href from any page.
    function pageHref(hash) {
        return document.getElementById(hash.replace('#', '')) ? hash : 'index.html' + hash;
    }

    // Smooth-scroll to a section id, accounting for the fixed nav.
    function scrollToId(id) {
        var el = document.getElementById(id);
        if (!el) { window.location.href = pageHref('#' + id); return; }
        var nav = document.getElementById('nav');
        var offset = (nav ? nav.offsetHeight : 68) + 12;
        var top = el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - offset;
        window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initToast();
        initMomentum();
        initModes();
        initCommandPalette();
        initClarity();
        initAchievements();
        initEasterEggs();
    });

    /* ============================================================
       2. MOMENTUM MODE
       A site-wide "forward energy" toggle. Adds subtle motion via
       CSS ([data-momentum="on"]) and swaps a little microcopy.
       Persisted; fully neutralised by prefers-reduced-motion.
       ============================================================ */
    function initMomentum() {
        var btn = $('#momentumToggle');
        var saved = store.get('momentum') === 'on';
        if (saved) setMomentum(true, true);
        if (btn) {
            btn.addEventListener('click', function () {
                setMomentum(root.getAttribute('data-momentum') !== 'on');
            });
        }
    }

    function setMomentum(on, silent) {
        root.setAttribute('data-momentum', on ? 'on' : 'off');
        store.set('momentum', on ? 'on' : 'off');

        var btn = $('#momentumToggle');
        if (btn) {
            btn.setAttribute('aria-pressed', String(on));
            btn.setAttribute('title', on ? 'Momentum Mode: on' : 'Momentum Mode: off');
        }

        // Swap microcopy on tagged leaf elements (store the original once).
        $$('[data-momentum-copy]').forEach(function (el) {
            if (!el.hasAttribute('data-momentum-orig')) {
                el.setAttribute('data-momentum-orig', el.textContent);
            }
            el.textContent = on ? el.getAttribute('data-momentum-copy')
                                : el.getAttribute('data-momentum-orig');
        });

        // Keep any open lens / palette mode commands in sync (label state).
        var sysItem = $('#cmdk [data-cmd="momentum"] .ci-desc');
        if (sysItem) sysItem.textContent = on ? 'Currently on — tap to ease off' : 'Add forward energy & motion';

        if (!silent) {
            pushToast({
                eyebrow: 'Momentum Mode',
                name: on ? 'Engaged — full speed' : 'Eased back to calm',
                icon: on ? '⚡' : '⏸'
            });
        }
    }

    /* ============================================================
       3. VIEWING MODES — Recruiter / Builder / Story lenses
       Guides the visitor by highlighting the most relevant
       sections and showing a contextual callout. Never hides
       content. Persisted across visits.
       ============================================================ */
    var MODE_FOCUS = {
        recruiter: ['experience', 'skills', 'education', 'contact'],
        builder:   ['projects', 'now', 'ailab'],
        story:     ['about', 'experience', 'approach', 'direction']
    };
    var MODE_INFO = {
        recruiter: { label: 'Recruiter Mode', icon: '🎯', target: 'experience',
            blurb: 'Surfacing <b>impact, experience, skills</b> and the fastest way to reach me.' },
        builder:   { label: 'Builder Mode', icon: '🔧', target: 'projects',
            blurb: 'Foregrounding <b>projects, the stack, GitHub, ChronoBox &amp; Claptrap</b> and the AI Lab.' },
        story:     { label: 'Story Mode', icon: '📖', target: 'about',
            blurb: 'Following the path from <b>operations → IT → Agile delivery</b> and what’s next.' }
    };

    var calloutEl = null, calloutTimer = null;

    function initModes() {
        // Build the contextual callout shell once (only where sections live).
        if (hasSections()) buildCallout();

        // Lens switch buttons in the hero.
        $$('.lens-btn').forEach(function (b) {
            b.addEventListener('click', function () { setMode(b.getAttribute('data-lens')); });
        });

        // Re-apply a saved lens silently (no callout pop on load).
        var saved = store.get('mode');
        if (saved && (saved === 'default' || MODE_INFO[saved])) applyMode(saved, true);
    }

    function setMode(mode) { applyMode(mode, false); }

    function applyMode(mode, silent) {
        if (mode !== 'default' && !MODE_INFO[mode]) mode = 'default';
        root.setAttribute('data-mode', mode);
        store.set('mode', mode);

        // Reflect state on the hero lens switch.
        $$('.lens-btn').forEach(function (b) {
            b.setAttribute('aria-pressed', String(b.getAttribute('data-lens') === mode));
        });

        // Clear all focus, then highlight the sections this lens cares about.
        var all = [];
        Object.keys(MODE_FOCUS).forEach(function (k) {
            MODE_FOCUS[k].forEach(function (id) { if (all.indexOf(id) < 0) all.push(id); });
        });
        all.forEach(function (id) {
            var sec = document.getElementById(id);
            if (sec) sec.classList.remove('mode-focus');
        });
        if (mode !== 'default') {
            MODE_FOCUS[mode].forEach(function (id) {
                var sec = document.getElementById(id);
                if (sec) sec.classList.add('mode-focus');
            });
        }

        // Sync palette descriptions of the active lens.
        $$('#cmdk [data-cmd^="mode:"]').forEach(function (it) {
            var on = it.getAttribute('data-cmd') === 'mode:' + mode;
            it.classList.toggle('is-current', on);
        });

        if (silent) return;

        // If this page has no sections to focus (e.g. the Lab), jump to the
        // main page — the lens is persisted and applies on arrival.
        if (!hasSections()) { window.location.href = 'index.html'; return; }

        if (mode === 'default') { hideCallout(); }
        else { showCallout(mode); }
    }

    function buildCallout() {
        calloutEl = document.createElement('div');
        calloutEl.className = 'mode-callout';
        calloutEl.setAttribute('role', 'status');
        calloutEl.innerHTML =
            '<span class="mc-icon" aria-hidden="true"></span>' +
            '<span class="mc-text"></span>' +
            '<button class="btn btn-primary btn-sm mc-go" type="button">Take me there</button>' +
            '<button class="mc-close" type="button" aria-label="Dismiss">&times;</button>';
        document.body.appendChild(calloutEl);

        calloutEl.querySelector('.mc-close').addEventListener('click', hideCallout);
        calloutEl.querySelector('.mc-go').addEventListener('click', function () {
            var info = MODE_INFO[root.getAttribute('data-mode')];
            if (info) scrollToId(info.target);
            hideCallout();
        });
    }

    function showCallout(mode) {
        if (!calloutEl) return;
        var info = MODE_INFO[mode];
        calloutEl.querySelector('.mc-icon').textContent = info.icon;
        calloutEl.querySelector('.mc-text').innerHTML = '<b>' + info.label + '</b> · ' + info.blurb;
        calloutEl.classList.add('show');
        clearTimeout(calloutTimer);
        calloutTimer = setTimeout(hideCallout, 9000);
    }
    function hideCallout() {
        if (calloutEl) calloutEl.classList.remove('show');
        clearTimeout(calloutTimer);
    }

    /* ============================================================
       4. COMMAND PALETTE  (Ctrl / Cmd + K)
       A keyboard-first launcher styled like a terminal/OS prompt.
       Built dynamically so both index.html and lab.html share one
       implementation.
       ============================================================ */
    var palette = { backdrop: null, input: null, list: null, items: [], active: -1, opener: null };

    function commandList() {
        return [
            { group: 'Navigate', cmd: 'nav:projects',   icon: '📂', label: 'View Projects',    desc: 'See what I’ve built',          run: function () { scrollToId('projects'); } },
            { group: 'Navigate', cmd: 'nav:experience', icon: '🧭', label: 'View Experience',  desc: 'Jump to the systems story',         run: function () { scrollToId('experience'); } },
            { group: 'Navigate', cmd: 'nav:skills',     icon: '🧰', label: 'View Skills',      desc: 'Toolbox & honest strengths',        run: function () { scrollToId('skills'); } },
            { group: 'Navigate', cmd: 'nav:direction',  icon: '🚀', label: 'What’s Next',  desc: 'Explore current growth areas',      run: function () { scrollToId('direction'); } },
            { group: 'Navigate', cmd: 'nav:now',        icon: '📡', label: 'Now Building',     desc: 'The live status board',             run: function () { scrollToId('now'); } },
            { group: 'Navigate', cmd: 'nav:lab',        icon: '🤖', label: 'Open AI Lab',      desc: 'Practical AI experiments',          run: function () { window.location.href = pageHref('#ailab'); } },
            { group: 'Navigate', cmd: 'nav:arcade',     icon: '🕹️', label: 'Open the Arcade',  desc: 'Games I built from scratch (incl. DOOMBA)', run: function () { window.location.href = 'arcade.html'; } },
            { group: 'Navigate', cmd: 'nav:resume',     icon: '📄', label: 'Download Résumé', desc: 'Grab the one-page PDF',     run: function () { window.open('assets/pdf/BBoyer26-Resume.pdf', '_blank', 'noopener'); } },
            { group: 'Navigate', cmd: 'nav:contact',    icon: '✉️', label: 'Contact',          desc: 'Let’s build something or talk shop', run: function () { scrollToId('contact'); } },

            { group: 'Lenses', cmd: 'mode:recruiter', icon: '🎯', label: 'Recruiter Mode', desc: 'Impact, skills, résumé, experience', run: function () { setMode('recruiter'); } },
            { group: 'Lenses', cmd: 'mode:builder',   icon: '🔧', label: 'Builder Mode',   desc: 'Projects, stack, GitHub, experiments',          run: function () { setMode('builder'); } },
            { group: 'Lenses', cmd: 'mode:story',     icon: '📖', label: 'Story Mode',     desc: 'Operations → IT → Agile → next',  run: function () { setMode('story'); } },
            { group: 'Lenses', cmd: 'mode:default',   icon: '◻️', label: 'Standard View',  desc: 'Clear the lens',                                run: function () { setMode('default'); } },

            { group: 'System', cmd: 'momentum', icon: '⚡', label: 'Toggle Momentum Mode', desc: 'Add forward energy & motion', run: function () { setMomentum(root.getAttribute('data-momentum') !== 'on'); } },
            { group: 'System', cmd: 'theme',    icon: '🌓', label: 'Toggle Theme',     desc: 'Switch light / dark',          run: function () { var t = $('#themeToggle'); if (t) t.click(); } }
        ];
    }

    function initCommandPalette() {
        buildPalette();

        // Global shortcut.
        document.addEventListener('keydown', function (e) {
            var key = (e.key || '').toLowerCase();
            if ((e.metaKey || e.ctrlKey) && key === 'k') {
                e.preventDefault();
                togglePalette();
            } else if (key === 'escape' && palette.backdrop.classList.contains('open')) {
                closePalette();
            }
        });

        // Optional hint button in the nav.
        var hint = $('#cmdkHint');
        if (hint) hint.addEventListener('click', openPalette);
    }

    function buildPalette() {
        var b = document.createElement('div');
        b.className = 'cmdk-backdrop';
        b.id = 'cmdk';
        b.innerHTML =
            '<div class="cmdk grid-bg" role="dialog" aria-modal="true" aria-label="Command palette">' +
                '<div class="cmdk-top" aria-hidden="true">' +
                    '<span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>' +
                    '<span class="cmdk-title">ben@portfolio: ~/launcher</span>' +
                '</div>' +
                '<div class="cmdk-search">' +
                    '<span class="prompt" aria-hidden="true">›</span>' +
                    '<input type="text" id="cmdkInput" role="combobox" aria-expanded="true" aria-controls="cmdkList" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="Type a command or search…">' +
                '</div>' +
                '<div class="cmdk-list" id="cmdkList" role="listbox" aria-label="Commands"></div>' +
                '<div class="cmdk-foot" aria-hidden="true">' +
                    '<span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>' +
                    '<span><kbd>↵</kbd> select</span>' +
                    '<span><kbd>esc</kbd> close</span>' +
                    '<span style="margin-left:auto">Ben OS</span>' +
                '</div>' +
            '</div>';
        document.body.appendChild(b);

        palette.backdrop = b;
        palette.input = $('#cmdkInput', b);
        palette.list = $('#cmdkList', b);

        renderPalette('');

        palette.input.addEventListener('input', function () { renderPalette(palette.input.value); });
        palette.input.addEventListener('keydown', onPaletteKey);
        b.addEventListener('click', function (e) { if (e.target === b) closePalette(); });
        // Trap Tab inside the dialog (only the input is focusable).
        b.addEventListener('keydown', function (e) { if (e.key === 'Tab') e.preventDefault(); });
    }

    function renderPalette(query) {
        var q = (query || '').trim().toLowerCase();
        var cmds = commandList().filter(function (c) {
            return !q || (c.label + ' ' + c.desc + ' ' + c.group).toLowerCase().indexOf(q) >= 0;
        });

        palette.list.innerHTML = '';
        palette.items = [];

        if (!cmds.length) {
            palette.list.innerHTML = '<div class="cmdk-empty">No matching commands. Try “projects”, “mode”, or “résumé”.</div>';
            return;
        }

        var lastGroup = null, idx = 0;
        cmds.forEach(function (c) {
            if (c.group !== lastGroup) {
                var gl = document.createElement('div');
                gl.className = 'cmdk-group-label';
                gl.textContent = c.group;
                palette.list.appendChild(gl);
                lastGroup = c.group;
            }
            var item = document.createElement('div');
            item.className = 'cmdk-item';
            item.id = 'cmdk-item-' + idx;
            item.setAttribute('role', 'option');
            item.setAttribute('data-cmd', c.cmd);
            item.innerHTML =
                '<span class="ci-icon" aria-hidden="true">' + c.icon + '</span>' +
                '<span class="ci-text">' +
                    '<span class="ci-label"></span>' +
                    '<span class="ci-desc"></span>' +
                '</span>';
            item.querySelector('.ci-label').textContent = c.label;
            item.querySelector('.ci-desc').textContent = c.desc;
            item._run = c.run;
            item.addEventListener('click', function () { runItem(item); });
            item.addEventListener('mousemove', function () { setActive(palette.items.indexOf(item)); });
            palette.list.appendChild(item);
            palette.items.push(item);
            idx++;
        });

        setActive(0);
    }

    function setActive(i) {
        if (!palette.items.length) return;
        palette.active = Math.max(0, Math.min(i, palette.items.length - 1));
        palette.items.forEach(function (it, n) { it.classList.toggle('active', n === palette.active); });
        var el = palette.items[palette.active];
        if (el) {
            palette.input.setAttribute('aria-activedescendant', el.id);
            el.scrollIntoView({ block: 'nearest' });
        }
    }

    function onPaletteKey(e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(palette.active + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(palette.active - 1); }
        else if (e.key === 'Enter') { e.preventDefault(); if (palette.items[palette.active]) runItem(palette.items[palette.active]); }
    }

    function runItem(item) {
        closePalette();
        if (typeof item._run === 'function') item._run();
    }

    function togglePalette() {
        if (palette.backdrop.classList.contains('open')) closePalette(); else openPalette();
    }
    function openPalette() {
        palette.opener = document.activeElement;
        palette.backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
        palette.input.value = '';
        renderPalette('');
        // Focus after the open transition starts.
        setTimeout(function () { palette.input.focus(); }, 20);
    }
    function closePalette() {
        palette.backdrop.classList.remove('open');
        document.body.style.overflow = '';
        if (palette.opener && palette.opener.focus) palette.opener.focus();
    }

    /* ============================================================
       5. CHAOS -> CLARITY
       Messy floating tags reorganise into People / Process /
       Technology / Outcome when the visitor clarifies the system.
       ============================================================ */
    function initClarity() {
        var stage = $('#clarityStage');
        var btn = $('#clarifyBtn');
        if (!stage || !btn) return;

        btn.addEventListener('click', function () {
            var cleared = stage.classList.toggle('clarified');
            btn.innerHTML = cleared
                ? 'Reset the chaos <span aria-hidden="true">↺</span>'
                : 'Clarify the system <span aria-hidden="true">✨</span>';
            btn.setAttribute('aria-pressed', String(cleared));
            if (cleared) {
                pushToast({ eyebrow: 'Systems thinking', name: 'Chaos → Clarity', icon: '🧩' });
            }
        });
    }

    /* ============================================================
       6. ACHIEVEMENT UNLOCKS
       Tasteful, scroll-triggered confirmations as key sections
       enter view. Each fires once per browser session.
       ============================================================ */
    var ACHIEVEMENTS = {
        about:      { name: 'People + Process Lens', icon: '🧑‍🤝‍🧑' },
        experience: { name: 'Systems Thinker',       icon: '🧭' },
        projects:   { name: 'Builder Mode',          icon: '🔨' },
        skills:     { name: 'Cloud & Identity Path', icon: '☁️' },
        direction:  { name: 'Execution Mindset',     icon: '🚀' }
    };

    function initAchievements() {
        if (!('IntersectionObserver' in window) || !hasSections()) return;

        // A centered trigger band fires reliably no matter how tall a section
        // is (a high threshold never triggers on sections taller than the
        // viewport). Each achievement fires once per browser session.
        var io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = entry.target.id;
                var a = ACHIEVEMENTS[id];
                obs.unobserve(entry.target);
                if (!a || session.get('ach:' + id)) return;
                session.set('ach:' + id, '1');
                pushToast({ eyebrow: 'Unlocked', name: a.name, icon: a.icon });
            });
        }, { threshold: 0, rootMargin: '-35% 0px -35% 0px' });

        Object.keys(ACHIEVEMENTS).forEach(function (id) {
            var sec = document.getElementById(id);
            if (sec) io.observe(sec);
        });
    }

    /* ============================================================
       7. EASTER EGGS
       - type "build"    -> jump to Projects
       - type "momentum" -> activate Momentum Mode
       - click the logo a few times -> a short message
       ============================================================ */
    function initEasterEggs() {
        var buffer = '';
        var triggers = {
            build: function () { scrollToId('projects'); pushToast({ eyebrow: 'easter egg', name: 'build → Projects', icon: '🛠️' }); },
            momentum: function () { if (root.getAttribute('data-momentum') !== 'on') setMomentum(true); else pushToast({ eyebrow: 'easter egg', name: 'Already in motion', icon: '⚡' }); },
            doom: function () { pushToast({ eyebrow: 'easter egg', name: 'DOOMBA — booting…', icon: '🔫', timeout: 1200 }); setTimeout(function () { window.location.href = 'arcade.html#doomba'; }, 400); }
        };

        document.addEventListener('keydown', function (e) {
            // Ignore while typing in fields, using modifiers, or palette is open.
            var t = e.target;
            if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
            if (window.__arcadePlaying) return;   // don't hijack keys during a game
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (!/^[a-z]$/i.test(e.key)) return;

            buffer = (buffer + e.key.toLowerCase()).slice(-12);
            Object.keys(triggers).forEach(function (word) {
                if (buffer.slice(-word.length) === word) { triggers[word](); buffer = ''; }
            });
        });

        // Logo: a few quick clicks reveals a small message.
        var logo = $('.logo');
        if (logo) {
            var clicks = 0, timer = null;
            logo.addEventListener('click', function () {
                clicks++;
                clearTimeout(timer);
                timer = setTimeout(function () { clicks = 0; }, 1400);
                if (clicks >= 4) {
                    clicks = 0;
                    pushToast({ eyebrow: 'Ben Boyer', name: 'Break it down. Build it better.', icon: '⚡', timeout: 4200 });
                }
            });
        }
    }

    /* ============================================================
       8. SHARED TOAST UTILITY
       Bottom-left badge stack, reused by achievements, eggs, and
       mode/momentum confirmations. Announced for screen readers.
       ============================================================ */
    var toastStack = null, toastLive = null;

    function initToast() {
        toastStack = document.createElement('div');
        toastStack.className = 'ach-stack';
        document.body.appendChild(toastStack);

        toastLive = document.createElement('div');
        toastLive.setAttribute('aria-live', 'polite');
        toastLive.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;';
        document.body.appendChild(toastLive);
    }

    function pushToast(opts) {
        if (!toastStack) return;
        var el = document.createElement('div');
        el.className = 'ach-toast';
        el.innerHTML =
            '<span class="ach-badge" aria-hidden="true">' + (opts.icon || '✨') + '</span>' +
            '<span class="ach-meta">' +
                '<span class="ach-eyebrow"></span>' +
                '<span class="ach-name"></span>' +
            '</span>';
        el.querySelector('.ach-eyebrow').textContent = opts.eyebrow || '';
        el.querySelector('.ach-name').textContent = opts.name || '';
        toastStack.appendChild(el);
        if (toastLive) toastLive.textContent = (opts.eyebrow ? opts.eyebrow + ': ' : '') + (opts.name || '');

        // Animate in, then auto-dismiss.
        requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('show'); }); });
        var life = opts.timeout || 3400;
        setTimeout(function () {
            el.classList.remove('show');
            setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 520);
        }, life);

        // Never let the stack grow without bound.
        while (toastStack.children.length > 4) toastStack.removeChild(toastStack.firstChild);
    }

})();
