/* =============================================================
   HERO BACKGROUND — subtle constellation network
   -------------------------------------------------------------
   - Sizes to the hero (not the whole window)
   - Recolors with the active theme (dark / light)
   - Gently reacts to the pointer
   - Fully skipped when the user prefers reduced motion
   ============================================================= */
(function () {
    'use strict';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var canvas = document.getElementById('hero-canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');

    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    var particles = [];
    var pointer = { x: null, y: null };
    var w = 0, h = 0;

    function isLight() { return document.documentElement.getAttribute('data-theme') === 'light'; }

    function size() {
        var rect = canvas.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Particle count scales with area, but stays modest for performance.
        var count = Math.min(70, Math.max(28, Math.round((w * h) / 22000)));
        particles = [];
        for (var i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                r: Math.random() * 1.6 + 0.8
            });
        }
    }

    var LINK_DIST = 140;

    function frame() {
        ctx.clearRect(0, 0, w, h);
        var light = isLight();
        var dotRGB  = light ? '84,104,255'  : '150,170,235';
        var lineRGB = light ? '84,104,255'  : '110,139,255';
        var dotA    = light ? 0.30 : 0.45;

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            ctx.beginPath();
            ctx.fillStyle = 'rgba(' + dotRGB + ',' + dotA + ')';
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            // Links to nearby particles
            for (var j = i + 1; j < particles.length; j++) {
                var q = particles[j];
                var dx = p.x - q.x, dy = p.y - q.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DIST) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(' + lineRGB + ',' + (0.18 * (1 - dist / LINK_DIST)) + ')';
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }

            // Link to the pointer
            if (pointer.x !== null) {
                var pdx = p.x - pointer.x, pdy = p.y - pointer.y;
                var pdist = Math.sqrt(pdx * pdx + pdy * pdy);
                if (pdist < LINK_DIST * 1.4) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(' + lineRGB + ',' + (0.30 * (1 - pdist / (LINK_DIST * 1.4))) + ')';
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(pointer.x, pointer.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(frame);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(size, 150);
    });

    var hero = canvas.parentElement;
    if (hero) {
        hero.addEventListener('pointermove', function (e) {
            var rect = canvas.getBoundingClientRect();
            pointer.x = e.clientX - rect.left;
            pointer.y = e.clientY - rect.top;
        });
        hero.addEventListener('pointerleave', function () { pointer.x = pointer.y = null; });
    }

    size();
    requestAnimationFrame(frame);
})();
