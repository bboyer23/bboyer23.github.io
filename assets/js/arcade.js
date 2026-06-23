/* =============================================================
   BEN OS — ARCADE  ·  assets/js/arcade.js
   -------------------------------------------------------------
   A self-contained "sandbox" of hand-written games. No engines,
   no libraries, no assets — every pixel is drawn from vanilla JS
   onto a single <canvas>. Loaded only by arcade.html.

   Games:
     1. DOOMBA   — a from-scratch raycasting FPS (DOOM/Wolf-style)
     2. SNAKE    — the classic
     3. BREAKOUT — brick-breaker

   The shell owns one rAF loop and a shared input manager; each
   game exposes { update(dt), render(), stop() }. Theme-aware via
   the site's CSS custom properties. ES5-safe to match the rest
   of the codebase.
   ============================================================= */
(function () {
    'use strict';

    var canvas = document.getElementById('screen');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;          // backing res: 640 x 400

    /* ---------- theme palette (read from CSS tokens) ---------- */
    function palette() {
        var s = getComputedStyle(document.documentElement);
        function v(n, f) { return (s.getPropertyValue(n) || '').trim() || f; }
        return {
            accent:  v('--accent',  '#6E8BFF'),
            accent2: v('--accent-2','#22D3EE'),
            accent3: v('--accent-3','#A78BFA'),
            text:    v('--text',    '#E9EDF5'),
            faint:   v('--text-faint','#677488'),
            surface: v('--surface', '#131A28'),
            bg:      v('--bg',      '#0A0E17'),
            success: v('--success', '#34D399'),
            danger:  '#FF5F57',
            warn:    '#FEBC2E'
        };
    }
    function hexRgb(h) {
        h = h.replace('#', '');
        if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
        return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)];
    }
    function shade(rgb, k) {
        return 'rgb(' + ((rgb[0]*k)|0) + ',' + ((rgb[1]*k)|0) + ',' + ((rgb[2]*k)|0) + ')';
    }
    function mono(px) { return px + 'px "JetBrains Mono", ui-monospace, monospace'; }

    /* ---------- shared input ---------- */
    var GAME_KEYS = { arrowup:1, arrowdown:1, arrowleft:1, arrowright:1, w:1, a:1, s:1, d:1, space:1, q:1, e:1, r:1 };
    var input = { keys: {}, just: {}, mdx: 0, locked: false, mouseX: null };
    var shellActive = false, paused = false;

    function norm(e) { return e.key === ' ' ? 'space' : (e.key || '').toLowerCase(); }
    window.addEventListener('keydown', function (e) {
        var k = norm(e);
        if (!input.keys[k]) input.just[k] = true;
        input.keys[k] = true;
        if (shellActive && GAME_KEYS[k]) e.preventDefault();
        if (paused) { paused = false; }
    });
    window.addEventListener('keyup', function (e) { input.keys[norm(e)] = false; });

    canvas.addEventListener('mousemove', function (e) {
        if (input.locked) input.mdx += e.movementX || 0;
        var r = canvas.getBoundingClientRect();
        input.mouseX = (e.clientX - r.left) / r.width * W;
    });
    canvas.addEventListener('mousedown', function () {
        if (paused) { paused = false; return; }
        input.just.fire = true;
        if (currentId === 'doomba' && !input.locked && canvas.requestPointerLock) canvas.requestPointerLock();
    });
    document.addEventListener('pointerlockchange', function () {
        input.locked = (document.pointerLockElement === canvas);
    });

    /* ---------- shell / loop ---------- */
    var current = null, currentId = null, raf = null, last = 0;

    var selectEl  = document.getElementById('arcadeSelect');
    var cabinetEl = document.getElementById('arcadeCabinet');
    var titleEl   = document.getElementById('cabTitle');
    var helpEl    = document.getElementById('cabHelp');

    var GAMES = {
        doomba:   { make: createDoomba,   title: 'DOOMBA',   help: 'WASD / arrows move · A·D or mouse turn · Space fire · R restart' },
        snake:    { make: createSnake,    title: 'SNAKE',    help: 'Arrows / WASD steer · eat the cells · R restart' },
        breakout: { make: createBreakout, title: 'BREAKOUT', help: 'Mouse or ← → move paddle · Space launch · R restart' }
    };

    function launch(id) {
        var g = GAMES[id]; if (!g) return;
        stop();
        currentId = id;
        current = g.make();
        try { current.render(); } catch (e) {}   // instant first frame (no blank flash before rAF)
        shellActive = true; paused = false;
        window.__arcadePlaying = true;   // tells ben-os.js to mute typed easter eggs
        if (titleEl) titleEl.textContent = g.title;
        if (helpEl)  helpEl.textContent  = g.help;
        if (selectEl)  selectEl.classList.add('hidden');
        if (cabinetEl) cabinetEl.classList.remove('hidden');
        last = (window.performance && performance.now()) || Date.now();
        if (!raf) raf = requestAnimationFrame(loop);
        try { canvas.focus(); } catch (e) {}
        if (history.replaceState) history.replaceState(null, '', '#' + id);
    }
    function stop() {
        shellActive = false;
        window.__arcadePlaying = false;
        if (current && current.stop) { try { current.stop(); } catch (e) {} }
        current = null; currentId = null;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        if (document.pointerLockElement === canvas && document.exitPointerLock) document.exitPointerLock();
    }
    function exitToMenu() {
        stop();
        if (cabinetEl) cabinetEl.classList.add('hidden');
        if (selectEl)  selectEl.classList.remove('hidden');
        if (history.replaceState) history.replaceState(null, '', location.pathname);
    }

    function loop(ts) {
        if (!shellActive) { raf = null; return; }
        raf = requestAnimationFrame(loop);
        var dt = Math.min(0.05, (ts - last) / 1000) || 0; last = ts;
        try {
            if (paused) { drawPause(); }
            else if (current) { current.update(dt); current.render(); }
        } catch (err) { console.error('arcade error:', err); }
        input.just = {}; input.mdx = 0;
    }
    function drawPause() {
        ctx.fillStyle = 'rgba(10,14,23,0.72)'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = palette().text; ctx.textAlign = 'center'; ctx.font = mono(22);
        ctx.fillText('PAUSED', W/2, H/2 - 6);
        ctx.fillStyle = palette().faint; ctx.font = mono(12);
        ctx.fillText('press any key or click to resume', W/2, H/2 + 18);
        ctx.textAlign = 'left';
    }

    document.addEventListener('visibilitychange', function () {
        if (document.hidden && shellActive) { paused = true; input.keys = {}; }
    });

    // Wire up the game-select cards + exit button + hash auto-launch.
    document.addEventListener('DOMContentLoaded', function () {
        var cards = document.querySelectorAll('[data-game]');
        for (var i = 0; i < cards.length; i++) {
            (function (card) {
                var id = card.getAttribute('data-game');
                card.addEventListener('click', function () { launch(id); });
                card.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); launch(id); }
                });
            })(cards[i]);
        }
        var exitBtn = document.getElementById('cabExit');
        if (exitBtn) exitBtn.addEventListener('click', exitToMenu);

        var hash = (location.hash || '').replace('#', '');
        if (GAMES[hash]) launch(hash);
    });

    // Lets the "doom" easter egg (and deep links) boot a game even after load.
    window.addEventListener('hashchange', function () {
        var h = (location.hash || '').replace('#', '');
        if (GAMES[h]) launch(h);
    });

    /* =========================================================
       1. DOOMBA — raycasting FPS
       ========================================================= */
    function createDoomba() {
        var pal = palette();
        var MW = 24, MH = 24;
        var grid = [];
        var y, x;
        for (y = 0; y < MH; y++) {
            grid[y] = [];
            for (x = 0; x < MW; x++) grid[y][x] = (x === 0 || y === 0 || x === MW-1 || y === MH-1) ? 1 : 0;
        }
        function box(x0, y0, x1, y1, c) { for (var j = y0; j <= y1; j++) for (var i = x0; i <= x1; i++) grid[j][i] = c; }
        box(6,6,9,7,2); box(15,5,17,11,3); box(5,15,12,16,2); box(17,16,20,19,3); box(11,10,13,12,1);

        var pos = { x: 2.5, y: 2.5 };
        var dir = { x: 1, y: 0 };
        var plane = { x: 0, y: 0.66 };

        var enemies = [];
        var spots = [[20,3],[12,20],[3,20],[20,20],[8,12],[19,8]];
        for (var s = 0; s < spots.length; s++) enemies.push({ x: spots[s][0]+0.5, y: spots[s][1]+0.5, alive: true, hit: 0 });

        var health = 100, score = 0, hurt = 0, muzzle = 0, bob = 0, dead = false, won = false;
        var zbuf = new Float32Array(W);

        // offscreen low-res buffer for that chunky retro look
        var rc = document.createElement('canvas'); rc.width = 320; rc.height = 200;
        var rx = rc.getContext('2d');
        var RW = 320, RH = 200;

        var imp = makeImp(pal);

        function cellWall(cx, cy) {
            if (cx < 0 || cy < 0 || cx >= MW || cy >= MH) return 1;
            return grid[cy|0][cx|0];
        }
        function tryMove(nx, ny) {
            if (cellWall(nx + (nx>pos.x?0.2:-0.2), pos.y) === 0) pos.x = nx;
            if (cellWall(pos.x, ny + (ny>pos.y?0.2:-0.2)) === 0) pos.y = ny;
        }
        function rot(a) {
            var c = Math.cos(a), si = Math.sin(a);
            var ox = dir.x; dir.x = dir.x*c - dir.y*si; dir.y = ox*si + dir.y*c;
            var px = plane.x; plane.x = plane.x*c - plane.y*si; plane.y = px*si + plane.y*c;
        }
        function reset() {
            pos.x = 2.5; pos.y = 2.5; dir.x = 1; dir.y = 0; plane.x = 0; plane.y = 0.66;
            health = 100; score = 0; dead = false; won = false; hurt = 0;
            for (var i = 0; i < enemies.length; i++) { enemies[i].alive = true; enemies[i].hit = 0; }
        }

        function update(dt) {
            if (input.just.r) { reset(); return; }
            if (dead || won) return;

            var moveSpd = 3.0 * dt, rotSpd = 2.4 * dt, moving = false;
            // mouse-look
            if (input.mdx) rot(input.mdx * 0.0028);
            // turn
            if (input.keys.arrowleft) rot(-rotSpd);
            if (input.keys.arrowright) rot(rotSpd);
            if (input.keys.q) tryMove(pos.x - plane.x*moveSpd, pos.y - plane.y*moveSpd), moving = true;
            if (input.keys.e) tryMove(pos.x + plane.x*moveSpd, pos.y + plane.y*moveSpd), moving = true;
            // forward / back
            if (input.keys.w || input.keys.arrowup)   { tryMove(pos.x + dir.x*moveSpd, pos.y + dir.y*moveSpd); moving = true; }
            if (input.keys.s || input.keys.arrowdown) { tryMove(pos.x - dir.x*moveSpd, pos.y - dir.y*moveSpd); moving = true; }
            // turn with a/d so plain WASD is playable without capturing the mouse
            // (Q/E strafe; arrow keys and mouse also turn)
            if (input.keys.a) rot(-rotSpd);
            if (input.keys.d) rot(rotSpd);
            if (moving) bob += dt * 9;

            // fire (hitscan)
            if (input.just.space || input.just.fire) {
                muzzle = 0.08;
                var best = -1, bestD = 1e9;
                for (var i = 0; i < enemies.length; i++) {
                    var en = enemies[i]; if (!en.alive) continue;
                    var dx = en.x - pos.x, dy = en.y - pos.y;
                    var d = Math.sqrt(dx*dx + dy*dy);
                    var ang = Math.atan2(dy, dx) - Math.atan2(dir.y, dir.x);
                    while (ang < -Math.PI) ang += 2*Math.PI; while (ang > Math.PI) ang -= 2*Math.PI;
                    if (Math.abs(ang) < 0.13 && d < bestD && !blocked(en)) { bestD = d; best = i; }
                }
                if (best >= 0) { enemies[best].alive = false; enemies[best].hit = 0.2; score += 100; }
            }
            if (muzzle > 0) muzzle -= dt;

            // enemies drift toward player + contact damage
            var aliveCount = 0;
            for (var k = 0; k < enemies.length; k++) {
                var e2 = enemies[k]; if (!e2.alive) continue; aliveCount++;
                var ex = pos.x - e2.x, ey = pos.y - e2.y;
                var ed = Math.sqrt(ex*ex + ey*ey);
                if (ed > 0.8) {
                    var nx = e2.x + (ex/ed) * 0.9 * dt, ny = e2.y + (ey/ed) * 0.9 * dt;
                    if (cellWall(nx, e2.y) === 0) e2.x = nx;
                    if (cellWall(e2.x, ny) === 0) e2.y = ny;
                } else {
                    health -= 14 * dt; hurt = 0.25;
                }
                if (e2.hit > 0) e2.hit -= dt;
            }
            if (hurt > 0) hurt -= dt;
            if (health <= 0) { health = 0; dead = true; }
            if (aliveCount === 0) won = true;
        }

        function blocked(en) {
            // step from player toward enemy; if a wall comes first, it's occluded
            var dx = en.x - pos.x, dy = en.y - pos.y;
            var dist = Math.sqrt(dx*dx + dy*dy), steps = (dist / 0.12) | 0;
            for (var i = 1; i < steps; i++) {
                var t = i / steps;
                if (cellWall(pos.x + dx*t, pos.y + dy*t) !== 0) return true;
            }
            return false;
        }

        function render() {
            // ceiling + floor
            var cg = rx.createLinearGradient(0, 0, 0, RH/2);
            cg.addColorStop(0, shade(hexRgb(pal.bg), 0.7)); cg.addColorStop(1, shade(hexRgb(pal.surface), 1.0));
            rx.fillStyle = cg; rx.fillRect(0, 0, RW, RH/2);
            var fg = rx.createLinearGradient(0, RH/2, 0, RH);
            fg.addColorStop(0, shade(hexRgb(pal.surface), 0.8)); fg.addColorStop(1, shade(hexRgb(pal.bg), 0.6));
            rx.fillStyle = fg; rx.fillRect(0, RH/2, RW, RH/2);

            var c1 = hexRgb(pal.accent), c2 = hexRgb(pal.accent3), c3 = hexRgb(pal.accent2);
            var col;
            for (var sx = 0; sx < RW; sx++) {
                var camX = 2 * sx / RW - 1;
                var rdx = dir.x + plane.x * camX, rdy = dir.y + plane.y * camX;
                var mapX = pos.x | 0, mapY = pos.y | 0;
                var ddx = Math.abs(1 / (rdx || 1e-9)), ddy = Math.abs(1 / (rdy || 1e-9));
                var stepX, stepY, sideX, sideY, side = 0;
                if (rdx < 0) { stepX = -1; sideX = (pos.x - mapX) * ddx; } else { stepX = 1; sideX = (mapX + 1 - pos.x) * ddx; }
                if (rdy < 0) { stepY = -1; sideY = (pos.y - mapY) * ddy; } else { stepY = 1; sideY = (mapY + 1 - pos.y) * ddy; }
                var hitC = 0, guard = 0;
                while (hitC === 0 && guard++ < 64) {
                    if (sideX < sideY) { sideX += ddx; mapX += stepX; side = 0; }
                    else { sideY += ddy; mapY += stepY; side = 1; }
                    if (mapX < 0 || mapY < 0 || mapX >= MW || mapY >= MH) { hitC = 1; break; }
                    hitC = grid[mapY][mapX];
                }
                var pd = side === 0 ? (sideX - ddx) : (sideY - ddy);
                if (pd < 0.05) pd = 0.05;
                zbuf[sx] = pd;
                var lh = (RH / pd) | 0;
                var y0 = (RH/2 - lh/2) | 0;
                var br = Math.max(0.12, 1 - pd / 13);
                if (side === 1) br *= 0.62;
                col = hitC === 2 ? c2 : (hitC === 3 ? c3 : c1);
                rx.fillStyle = shade(col, br);
                rx.fillRect(sx, y0, 1, lh);
            }

            // sprites (enemies), far -> near
            var order = enemies.slice().filter(function (e) { return e.alive || e.hit > 0; });
            order.sort(function (a, b) {
                var da = (a.x-pos.x)*(a.x-pos.x)+(a.y-pos.y)*(a.y-pos.y);
                var db = (b.x-pos.x)*(b.x-pos.x)+(b.y-pos.y)*(b.y-pos.y);
                return db - da;
            });
            var invDet = 1 / (plane.x * dir.y - dir.x * plane.y);
            for (var oi = 0; oi < order.length; oi++) {
                var en = order[oi];
                var dx = en.x - pos.x, dy = en.y - pos.y;
                var tx = invDet * (dir.y * dx - dir.x * dy);
                var ty = invDet * (-plane.y * dx + plane.x * dy);
                if (ty <= 0.15) continue;
                var scrX = (RW / 2) * (1 + tx / ty);
                var sh = Math.abs(RH / ty) | 0, sw = sh;
                var sy = (RH/2 - sh/2 + sh*0.08) | 0;
                var sx0 = (scrX - sw/2) | 0;
                for (var col2 = sx0; col2 < sx0 + sw; col2++) {
                    if (col2 < 0 || col2 >= RW) continue;
                    if (ty >= zbuf[col2]) continue;
                    var texX = (((col2 - sx0) / sw) * 16) | 0;
                    rx.drawImage(en.hit > 0 ? imp.hit : imp.tex, texX, 0, 1, 16, col2, sy, 1, sh);
                }
            }

            // blit upscaled, crisp
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(rc, 0, 0, W, H);
            ctx.imageSmoothingEnabled = true;

            drawWeapon();
            drawHud();
            if (hurt > 0) { ctx.fillStyle = 'rgba(255,60,60,' + Math.min(0.4, hurt) + ')'; ctx.fillRect(0, 0, W, H); }
            if (dead) banner('YOU DIED', 'press R to respawn', pal.danger);
            if (won)  banner('SECTOR CLEARED', 'press R to run it back', pal.success);
        }

        function drawWeapon() {
            var bx = W/2 + Math.sin(bob)*8, by = H - 8 + Math.abs(Math.cos(bob))*4;
            // barrel
            ctx.fillStyle = shade(hexRgb(pal.faint), 1.1);
            ctx.fillRect(bx - 16, by - 70, 32, 70);
            ctx.fillStyle = shade(hexRgb(pal.faint), 0.7);
            ctx.fillRect(bx - 22, by - 30, 44, 30);
            ctx.fillStyle = shade(hexRgb(pal.accent2), 1);
            ctx.fillRect(bx - 6, by - 86, 12, 18);
            if (muzzle > 0) {
                ctx.fillStyle = 'rgba(255,210,90,0.95)';
                ctx.beginPath(); ctx.arc(bx, by - 90, 16 + Math.random()*6, 0, 7); ctx.fill();
            }
        }
        function drawHud() {
            // status bar
            ctx.fillStyle = 'rgba(10,14,23,0.82)'; ctx.fillRect(0, H - 34, W, 34);
            ctx.fillStyle = palette().faint; ctx.font = mono(11);
            ctx.fillText('HEALTH', 14, H - 20);
            ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(70, H - 26, 120, 12);
            var hp = Math.max(0, health) / 100;
            ctx.fillStyle = hp > 0.5 ? pal.success : (hp > 0.25 ? pal.warn : pal.danger);
            ctx.fillRect(70, H - 26, 120 * hp, 12);
            var left = 0; for (var i = 0; i < enemies.length; i++) if (enemies[i].alive) left++;
            ctx.fillStyle = palette().text; ctx.font = mono(13);
            ctx.textAlign = 'center';
            ctx.fillText('SCORE ' + score, W/2, H - 17);
            ctx.textAlign = 'right';
            ctx.fillStyle = left ? pal.danger : pal.success;
            ctx.fillText('IMPS ' + left, W - 14, H - 17);
            ctx.textAlign = 'left';
            // minimap
            var ms = 4, mx = W - 24*ms - 12, my = 12;
            ctx.fillStyle = 'rgba(10,14,23,0.6)'; ctx.fillRect(mx-2, my-2, 24*ms+4, 24*ms+4);
            for (var yy = 0; yy < MH; yy++) for (var xx = 0; xx < MW; xx++) {
                if (grid[yy][xx]) { ctx.fillStyle = 'rgba(110,139,255,0.55)'; ctx.fillRect(mx+xx*ms, my+yy*ms, ms, ms); }
            }
            for (var e3 = 0; e3 < enemies.length; e3++) if (enemies[e3].alive) {
                ctx.fillStyle = pal.danger; ctx.fillRect(mx + enemies[e3].x*ms - 1, my + enemies[e3].y*ms - 1, 3, 3);
            }
            ctx.fillStyle = pal.accent2; ctx.fillRect(mx + pos.x*ms - 1, my + pos.y*ms - 1, 3, 3);
            // crosshair
            ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(W/2-7, H/2); ctx.lineTo(W/2-2, H/2);
            ctx.moveTo(W/2+2, H/2); ctx.lineTo(W/2+7, H/2);
            ctx.moveTo(W/2, H/2-7); ctx.lineTo(W/2, H/2-2);
            ctx.moveTo(W/2, H/2+2); ctx.lineTo(W/2, H/2+7); ctx.stroke();
        }
        function banner(big, small, color) {
            ctx.fillStyle = 'rgba(10,14,23,0.74)'; ctx.fillRect(0, 0, W, H);
            ctx.textAlign = 'center';
            ctx.fillStyle = color; ctx.font = '700 ' + mono(40);
            ctx.fillText(big, W/2, H/2 - 6);
            ctx.fillStyle = palette().text; ctx.font = mono(14);
            ctx.fillText(small, W/2, H/2 + 26);
            ctx.textAlign = 'left';
        }

        return { update: update, render: render, stop: function () {} };
    }

    // tiny 16x16 "imp" sprite, drawn once into two tinted variants
    function makeImp(pal) {
        function build(flash) {
            var c = document.createElement('canvas'); c.width = 16; c.height = 16;
            var g = c.getContext('2d');
            var body = flash ? '#ffffff' : '#C0452E';
            var dark = flash ? '#ffd2d2' : '#7A2417';
            g.fillStyle = dark; g.fillRect(4, 2, 8, 3);                 // horns base
            g.fillRect(3, 1, 2, 3); g.fillRect(11, 1, 2, 3);           // horns
            g.fillStyle = body;
            g.beginPath(); g.ellipse(8, 9, 5.4, 6.2, 0, 0, 7); g.fill(); // body
            g.fillStyle = dark; g.fillRect(5, 14, 2, 2); g.fillRect(9, 14, 2, 2); // feet
            g.fillStyle = flash ? '#C0452E' : '#FEBC2E';
            g.fillRect(6, 8, 2, 2); g.fillRect(9, 8, 2, 2);            // eyes
            g.fillStyle = dark; g.fillRect(6, 11, 4, 1);               // mouth
            return c;
        }
        return { tex: build(false), hit: build(true) };
    }

    /* =========================================================
       2. SNAKE
       ========================================================= */
    function createSnake() {
        var pal = palette();
        var CS = 20, COLS = W / CS, ROWS = H / CS;       // 32 x 20
        var snake, dirx, diry, ndx, ndy, food, score, over, acc, step;
        function spawnFood() {
            do { food = { x: (Math.random()*COLS)|0, y: (Math.random()*ROWS)|0 }; }
            while (hit(food.x, food.y));
        }
        function hit(x, y) { for (var i = 0; i < snake.length; i++) if (snake[i].x===x && snake[i].y===y) return true; return false; }
        function reset() {
            snake = [{x:8,y:10},{x:7,y:10},{x:6,y:10}];
            dirx = 1; diry = 0; ndx = 1; ndy = 0; score = 0; over = false; acc = 0; step = 0.12;
            spawnFood();
        }
        reset();
        function update(dt) {
            if (input.just.r && over) { reset(); return; }
            if (over) return;
            if ((input.keys.arrowup || input.keys.w) && diry === 0) { ndx = 0; ndy = -1; }
            else if ((input.keys.arrowdown || input.keys.s) && diry === 0) { ndx = 0; ndy = 1; }
            else if ((input.keys.arrowleft || input.keys.a) && dirx === 0) { ndx = -1; ndy = 0; }
            else if ((input.keys.arrowright || input.keys.d) && dirx === 0) { ndx = 1; ndy = 0; }
            acc += dt;
            if (acc < step) return;
            acc = 0; dirx = ndx; diry = ndy;
            var head = { x: snake[0].x + dirx, y: snake[0].y + diry };
            if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS || hit(head.x, head.y)) { over = true; return; }
            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) { score += 10; if (step > 0.05) step -= 0.004; spawnFood(); }
            else snake.pop();
        }
        function render() {
            ctx.fillStyle = pal.bg; ctx.fillRect(0, 0, W, H);
            ctx.strokeStyle = 'rgba(255,255,255,0.04)';
            for (var gx = 0; gx <= COLS; gx++) { ctx.beginPath(); ctx.moveTo(gx*CS,0); ctx.lineTo(gx*CS,H); ctx.stroke(); }
            for (var gy = 0; gy <= ROWS; gy++) { ctx.beginPath(); ctx.moveTo(0,gy*CS); ctx.lineTo(W,gy*CS); ctx.stroke(); }
            // food
            var pulse = 3 + Math.sin(Date.now()/200)*2;
            ctx.fillStyle = pal.accent2;
            ctx.beginPath(); ctx.arc(food.x*CS+CS/2, food.y*CS+CS/2, CS/2 - pulse, 0, 7); ctx.fill();
            // snake
            for (var i = snake.length-1; i >= 0; i--) {
                var t = 1 - i / snake.length;
                ctx.fillStyle = i === 0 ? pal.accent2 : shade(hexRgb(pal.accent), 0.5 + 0.5*t);
                round(snake[i].x*CS+1, snake[i].y*CS+1, CS-2, CS-2, 5);
            }
            ctx.fillStyle = pal.text; ctx.font = mono(14);
            ctx.fillText('SCORE ' + score, 12, 22);
            if (over) {
                ctx.fillStyle = 'rgba(10,14,23,0.74)'; ctx.fillRect(0,0,W,H);
                ctx.textAlign = 'center';
                ctx.fillStyle = pal.danger; ctx.font = '700 ' + mono(38); ctx.fillText('GAME OVER', W/2, H/2-6);
                ctx.fillStyle = pal.text; ctx.font = mono(14); ctx.fillText('score ' + score + ' · press R', W/2, H/2+24);
                ctx.textAlign = 'left';
            }
        }
        return { update: update, render: render, stop: function () {} };
    }

    /* =========================================================
       3. BREAKOUT
       ========================================================= */
    function createBreakout() {
        var pal = palette();
        var pad, ball, bricks, score, lives, live, launched;
        var BW = 60, BH = 12, BALLR = 7, COLS = 10, ROWS = 5, BRW, BRH = 22, TOP = 60;
        function reset() {
            BRW = (W - 40) / COLS;
            pad = { x: W/2 - BW/2, w: BW };
            ball = { x: W/2, y: H - 60, vx: 0, vy: 0 };
            launched = false; score = 0; lives = 3; live = true;
            bricks = [];
            for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++)
                bricks.push({ x: 20 + c*BRW, y: TOP + r*BRH, w: BRW-4, h: BRH-4, alive: true, row: r });
        }
        reset();
        function launch2() { launched = true; ball.vx = 3.4 * (Math.random() < 0.5 ? -1 : 1); ball.vy = -4.2; }
        function update(dt) {
            if (input.just.r && !live) { reset(); return; }
            if (!live) return;
            // paddle
            if (input.mouseX != null) pad.x = input.mouseX - pad.w/2;
            if (input.keys.arrowleft || input.keys.a) pad.x -= 360*dt;
            if (input.keys.arrowright || input.keys.d) pad.x += 360*dt;
            pad.x = Math.max(0, Math.min(W - pad.w, pad.x));
            if (!launched) { ball.x = pad.x + pad.w/2; ball.y = H - 60; if (input.just.space || input.just.fire) launch2(); return; }
            // step (scaled so it's framerate-ish independent)
            var st = Math.min(2, dt * 60);
            ball.x += ball.vx * st; ball.y += ball.vy * st;
            if (ball.x < BALLR || ball.x > W-BALLR) ball.vx *= -1;
            if (ball.y < BALLR) ball.vy *= -1;
            // paddle bounce
            if (ball.y > H-26-BALLR && ball.y < H-26+BH && ball.x > pad.x && ball.x < pad.x+pad.w && ball.vy > 0) {
                ball.vy *= -1; ball.vx += ((ball.x - (pad.x+pad.w/2)) / (pad.w/2)) * 2;
            }
            if (ball.y > H + 20) { lives--; launched = false; if (lives <= 0) live = false; }
            // bricks
            var remaining = 0;
            for (var i = 0; i < bricks.length; i++) {
                var b = bricks[i]; if (!b.alive) continue; remaining++;
                if (ball.x > b.x && ball.x < b.x+b.w && ball.y > b.y && ball.y < b.y+b.h) {
                    b.alive = false; ball.vy *= -1; score += 10;
                }
            }
            if (remaining === 0) live = false;
        }
        function render() {
            ctx.fillStyle = pal.bg; ctx.fillRect(0, 0, W, H);
            var cols = [pal.accent2, pal.accent, pal.accent3, pal.accent, pal.accent2];
            for (var i = 0; i < bricks.length; i++) {
                var b = bricks[i]; if (!b.alive) continue;
                ctx.fillStyle = cols[b.row % cols.length];
                round(b.x, b.y, b.w, b.h, 4);
            }
            ctx.fillStyle = pal.text; round(pad.x, H-26, pad.w, BH, 6);
            ctx.fillStyle = pal.accent2; ctx.beginPath(); ctx.arc(ball.x, ball.y, BALLR, 0, 7); ctx.fill();
            ctx.fillStyle = pal.text; ctx.font = mono(14);
            ctx.fillText('SCORE ' + score, 14, 24);
            ctx.textAlign = 'right'; ctx.fillText('LIVES ' + Math.max(0,lives), W-14, 24); ctx.textAlign = 'left';
            if (!launched && lives > 0) {
                ctx.fillStyle = pal.faint; ctx.font = mono(13); ctx.textAlign = 'center';
                ctx.fillText('press SPACE to launch', W/2, H/2); ctx.textAlign = 'left';
            }
            if (!live) {
                var winw = bricks.every(function (b) { return !b.alive; });
                ctx.fillStyle = 'rgba(10,14,23,0.74)'; ctx.fillRect(0,0,W,H);
                ctx.textAlign = 'center';
                ctx.fillStyle = winw ? pal.success : pal.danger; ctx.font = '700 ' + mono(34);
                ctx.fillText(winw ? 'YOU CLEARED IT' : 'GAME OVER', W/2, H/2-6);
                ctx.fillStyle = pal.text; ctx.font = mono(14); ctx.fillText('score ' + score + ' · press R', W/2, H/2+24);
                ctx.textAlign = 'left';
            }
        }
        return { update: update, render: render, stop: function () {} };
    }

    /* rounded-rect fill helper */
    function round(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.arcTo(x+w, y, x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x, y+h, r);
        ctx.arcTo(x, y+h, x, y, r);
        ctx.arcTo(x, y, x+w, y, r);
        ctx.closePath(); ctx.fill();
    }
})();
