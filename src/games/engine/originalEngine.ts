/* eslint-disable */
// @ts-nocheck
/**
 * Original ShikshaSetu Game Engine v5.0 — ported verbatim.
 * Wrapped to be invoked from React via runGame(subject, grade).
 * Expects DOM elements with these IDs to exist when called:
 *   #gameCanvas, #scoreDisplay, #healthBar, #healthPct,
 *   #progressBar, #progressPct, #comboDisplay, #levelTitle, #timerDisplay
 * Calls window.showMissionComplete(score, accuracy, time) on finish.
 */
export function installEngine() {
  if ((window as any).__shikshaEngineInstalled) return;
  (window as any).__shikshaEngineInstalled = true;

/* ================================================================
   ShikshaSetu — Game Engine v5.0 (Fully Translated)
   Grades 6-12 | Physics · Chemistry · Biology · Maths · Python
   ================================================================
   FEATURES:
   • Full multilingual support via window.translationManager
   • All game texts (questions, options, facts, instructions) translatable
   • Dynamic text replacement at runtime
   • Fallback to original English if translation fails
================================================================ */

'use strict';

let score = 0;
let spawnInterval = null;
let timerInterval = null;

/* ================================================================
   TRANSLATION HELPER
   ================================================================ */

async function translateTexts(texts) {
    if (!window.translationManager || !window.translationManager.currentLang) {
        return texts;
    }
    
    const currentLang = window.translationManager.currentLang;
    if (currentLang === 'en') return texts;
    
    try {
        return await window.translationManager.translateGameTexts(texts, currentLang);
    } catch (e) {
        console.warn('Translation failed, using original:', e);
        return texts;
    }
}

/* ================================================================
   CORE UTILITIES
   ================================================================ */

async function initGame() {
    score = 0;
    updateHUD(0);
    updateHealth(100);
    updateProgress(0);
    updateCombo(1);
    await routeGame();
}

function finishMission(accuracy, timeTaken) {
    score = Math.max(0, Math.round(score));
    if (typeof showMissionComplete === 'function') {
        showMissionComplete(score, accuracy || 0, timeTaken || 0);
    }
}

function updateHUD(s)      { const e = document.getElementById('scoreDisplay');  if (e) e.textContent = s; }
function updateProgress(p) { const b = document.getElementById('progressBar'),   l = document.getElementById('progressPct');  if (b) b.style.width = p + '%'; if (l) l.textContent = p + '%'; }
function updateHealth(p)   { const b = document.getElementById('healthBar'),     l = document.getElementById('healthPct');    if (b) b.style.width = p + '%'; if (l) l.textContent = p + '%'; }
function updateCombo(c)    { const e = document.getElementById('comboDisplay');  if (e) e.textContent = 'x' + c; }
function setLevelTitle(t)  { const e = document.getElementById('levelTitle');    if (e) e.textContent = t; }

function updateTimer(t) {
    const e = document.getElementById('timerDisplay');
    if (e) e.textContent = Math.floor(t / 60) + ':' + (t % 60 < 10 ? '0' : '') + (t % 60);
}

function showFloatingText(text, x, y, col) {
    const canvas = document.getElementById('gameCanvas');
    const r  = canvas.getBoundingClientRect();
    const sx = r.width  / canvas.width;
    const sy = r.height / canvas.height;
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `
        position:fixed;
        left:${r.left + x * sx}px;
        top:${r.top + y * sy}px;
        transform:translate(-50%,-50%);
        color:${col};
        font-family:'Outfit',sans-serif;
        font-weight:800;
        font-size:14px;
        pointer-events:none;
        z-index:9999;
        text-shadow:0 0 10px ${col};
        animation:floatUp 1s ease-out forwards;
    `;
    if (!document.getElementById('ftStyle')) {
        const s = document.createElement('style');
        s.id = 'ftStyle';
        s.textContent = '@keyframes floatUp{from{opacity:1;transform:translate(-50%,-50%)}to{opacity:0;transform:translate(-50%,-220%)}}';
        document.head.appendChild(s);
    }
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function shakeCanvas(c) {
    let frame = 0;
    const id = setInterval(() => {
        c.style.transform = `translate(${(Math.random() - .5) * 10}px,${(Math.random() - .5) * 10}px)`;
        if (++frame > 8) { clearInterval(id); c.style.transform = ''; }
    }, 40);
}

function gpos(canvas, e) {
    const r   = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
        x: (src.clientX - r.left) * (canvas.width  / r.width),
        y: (src.clientY - r.top)  * (canvas.height / r.height)
    };
}

function shuffleQuestion(q) {
    const correctText = q.opts[q.ans];
    const shuffled    = q.opts.slice().sort(() => Math.random() - 0.5);
    const newAns      = shuffled.indexOf(correctText);
    return { ...q, opts: shuffled, ans: newAns };
}

/* ================================================================
   TRANSLATED MCQ ENGINE
   ================================================================ */

async function mcqEngine(canvas, ctx, bank, g, accentCol, label, totalTime) {
    let localScore = 0, lives = 3, time = totalTime || 90;
    let isOver = false, animId;
    let qIdx = 0, currentQ = null, selected = null, answered = false;
    let particles = [];
    
    // Translate the question bank if needed
    const translatedBank = [];
    for (const q of bank) {
        const textsToTranslate = [q.q, ...q.opts, q.fact || ''];
        const translated = await translateTexts(textsToTranslate);
        translatedBank.push({
            q: translated[0],
            opts: translated.slice(1, 1 + q.opts.length),
            ans: q.ans,
            fact: translated[translated.length - 1]
        });
    }
    
    const finalBank = translatedBank;

    function nextQ() {
        const raw = finalBank[qIdx % finalBank.length];
        currentQ  = shuffleQuestion(raw);
        qIdx++;
        selected = null;
        answered = false;
    }

    function burst(x, y, col, n = 18) {
        for (let i = 0; i < n; i++) {
            particles.push({
                x, y,
                vx: (Math.random() - .5) * 10,
                vy: (Math.random() - .5) * 10,
                r: Math.random() * 4 + 2,
                life: 1, col
            });
        }
    }

    function draw() {
        const gr = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gr.addColorStop(0, '#030c1a');
        gr.addColorStop(1, '#060820');
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!currentQ) return;

        const prog = (qIdx / finalBank.length) * canvas.width;
        const pgr  = ctx.createLinearGradient(0, 0, prog, 0);
        pgr.addColorStop(0, accentCol);
        pgr.addColorStop(1, accentCol + '88');
        ctx.fillStyle = pgr;
        ctx.fillRect(0, 0, prog, 5);

        ctx.save();
        ctx.fillStyle   = 'rgba(10,5,30,0.92)';
        ctx.strokeStyle = accentCol + '55';
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.roundRect(36, 28, canvas.width - 72, 90, 16);
        ctx.fill();
        ctx.stroke();
        ctx.font      = '10px Outfit';
        ctx.fillStyle = accentCol + '88';
        ctx.textAlign = 'right';
        ctx.fillText('Gr.' + g + ' ' + label, canvas.width - 50, 50);
        ctx.font        = 'bold 15px Outfit';
        ctx.fillStyle   = '#fff';
        ctx.textAlign   = 'center';
        ctx.shadowBlur  = 6;
        ctx.shadowColor = accentCol + '66';
        ctx.fillText('Q' + qIdx + ':  ' + currentQ.q, canvas.width / 2, 82);
        ctx.shadowBlur = 0;
        ctx.restore();

        if (answered && currentQ.fact) {
            ctx.save();
            ctx.fillStyle   = 'rgba(0,20,30,0.85)';
            ctx.strokeStyle = accentCol + '44';
            ctx.lineWidth   = 1;
            ctx.beginPath();
            ctx.roundRect(36, 126, canvas.width - 72, 32, 10);
            ctx.fill();
            ctx.stroke();
            ctx.font      = '11px Outfit';
            ctx.fillStyle = accentCol;
            ctx.textAlign = 'center';
            ctx.fillText('💡 ' + currentQ.fact, canvas.width / 2, 146);
            ctx.restore();
        }

        const startY  = (answered && currentQ.fact) ? 170 : 136;
        const optH    = 54, optGap = 12;
        currentQ.opts.forEach((opt, i) => {
            const oy = startY + i * (optH + optGap);
            let bg = 'rgba(255,255,255,0.04)', border = 'rgba(255,255,255,0.09)', textCol = '#bbb', icon = '';

            if (answered) {
                if (i === currentQ.ans) {
                    bg = accentCol + '22'; border = accentCol; textCol = accentCol; icon = '✓ ';
                } else if (i === selected) {
                    bg = 'rgba(255,45,155,0.12)'; border = '#FF2D9B'; textCol = '#FF2D9B'; icon = '✗ ';
                }
            } else if (i === selected) {
                bg = accentCol + '15'; border = accentCol + '80'; textCol = '#fff';
            }

            ctx.save();
            ctx.fillStyle   = bg;
            ctx.strokeStyle = border;
            ctx.lineWidth   = 1.8;
            ctx.shadowBlur  = (answered && i === currentQ.ans) ? 20 : 0;
            ctx.shadowColor = accentCol;
            ctx.beginPath();
            ctx.roundRect(56, oy, canvas.width - 112, optH, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = (answered)
                ? (i === currentQ.ans ? accentCol : 'rgba(255,255,255,0.15)')
                : 'rgba(255,255,255,0.1)';
            ctx.beginPath();
            ctx.arc(82, oy + optH / 2, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.font          = 'bold 12px Outfit';
            ctx.fillStyle     = '#fff';
            ctx.textAlign     = 'center';
            ctx.textBaseline  = 'middle';
            ctx.shadowBlur    = 0;
            ctx.fillText(String.fromCharCode(65 + i), 82, oy + optH / 2);

            ctx.font          = '13px Outfit';
            ctx.fillStyle     = textCol;
            ctx.textAlign     = 'left';
            ctx.textBaseline  = 'alphabetic';
            ctx.fillText(icon + opt, 106, oy + optH / 2 + 5);
            ctx.restore();
        });

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle   = p.col;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            p.x    += p.vx;
            p.y    += p.vy;
            p.life -= 0.025;
            if (p.life <= 0) particles.splice(i, 1);
            ctx.restore();
        }

        ctx.font         = '16px sans-serif';
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'alphabetic';
        let h = '';
        for (let i = 0; i < 3; i++) h += i < lives ? '❤️ ' : '🖤 ';
        ctx.fillText(h, 12, canvas.height - 10);
    }

    function handleClick(e) {
        if (!currentQ || answered) return;
        const { x, y } = gpos(canvas, e);
        const startY = 136, optH = 54, optGap = 12;

        for (let i = 0; i < currentQ.opts.length; i++) {
            const oy = startY + i * (optH + optGap);
            if (x >= 56 && x <= canvas.width - 56 && y >= oy && y <= oy + optH) {
                selected = i;
                answered = true;
                if (i === currentQ.ans) {
                    localScore += 25;
                    score = localScore;
                    updateHUD(localScore);
                    burst(canvas.width / 2, 220, accentCol);
                    showFloatingText('✓ Correct! +25', canvas.width / 2, 150, accentCol);
                    updateProgress(Math.min(100, Math.round((qIdx / finalBank.length) * 100)));
                } else {
                    lives--;
                    updateHealth(Math.max(0, (lives / 3) * 100));
                    shakeCanvas(canvas);
                    showFloatingText('✗ Wrong!', canvas.width / 2, 150, '#FF2D9B');
                }
                setTimeout(nextQ, 1700);
                break;
            }
        }
    }

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        const t = e.touches[0];
        handleClick({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: false });

    function loop() {
        if (isOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        animId = requestAnimationFrame(loop);
    }

    function end() {
        isOver = true;
        clearInterval(timerInterval);
        cancelAnimationFrame(animId);
        score = localScore;
        finishMission(
            Math.min(100, Math.round((localScore / (finalBank.length * 25)) * 100)),
            totalTime - time
        );
    }

    timerInterval = setInterval(() => {
        time--;
        updateTimer(time);
        if (time <= 0 || lives <= 0) end();
    }, 1000);

    updateTimer(time);
    nextQ();
    loop();
}

/* ================================================================
   ROUTER
   ================================================================ */

async function routeGame() {
    const s = SUBJECT, g = GRADE;
    if      (s === 'physics')                                    await dispatchPhysics(g);
    else if (s === 'chemistry')                                  await dispatchChemistry(g);
    else if (s === 'biology')                                    await dispatchBiology(g);
    else if (s === 'mathematics' || s === 'maths' || s === 'math') await dispatchMaths(g);
    else if (s === 'python'      || s === 'coding')              await dispatchPython(g);
    else await dispatchPhysics(6);
}

async function dispatchPhysics(g) {
    setLevelTitle('⚡ Physics — Grade ' + g);
    if      (g <= 7)  await physicsArcade(g);
    else if (g <= 9)  await physicsShooter(g);
    else              await physicsMCQ(g);
}

async function dispatchChemistry(g) {
    setLevelTitle('⚗️ Chemistry — Grade ' + g);
    if      (g <= 7)  await chemLab(g);
    else if (g <= 9)  await chemHeist(g);
    else if (g <= 10) await chemMCQ(g);
    else              await chemAdvanced(g);
}

async function dispatchBiology(g) {
    setLevelTitle('🧬 Biology — Grade ' + g);
    if      (g <= 7)  await bioDefence(g);
    else if (g <= 9)  await bioDNA(g);
    else              await bioMCQ(g);
}

async function dispatchMaths(g) {
    setLevelTitle('📐 Maths — Grade ' + g);
    if      (g <= 7)  await mathsNinja(g);
    else if (g === 8) await mathsLaser(g);
    else if (g === 9) await mathsCannon(g);
    else if (g <= 10) await mathsBubble(g);
    else              await mathsAdvanced(g);
}

async function dispatchPython(g) {
    setLevelTitle('🐍 Python — Grade ' + g);
    if      (g <= 8)  await pythonFill(g);
    else if (g <= 10) await pythonDebug(g);
    else              await pythonDrag(g);
}

/* ================================================================
   PHYSICS ARCADE (Grades 6-7)
   ================================================================ */

async function physicsArcade(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const BANKS = {
        6: [
            () => { const d = (~~(Math.random() * 9) + 1) * 10, t = ~~(Math.random() * 8) + 2, a = Math.round(d / t);    
                return { q: `Speed? d=${d}m t=${t}s`,        ans: a, u: 'm/s', qText: `Speed?`, ansText: `${a} m/s` }; },
            () => { const m = ~~(Math.random() * 10) + 2,  a2 = ~~(Math.random() * 6) + 1, r = m * a2;                   
                return { q: `Force? m=${m}kg a=${a2}m/s²`,    ans: r, u: 'N', qText: `Force?`, ansText: `${r} N` }; },
            () => { const f = ~~(Math.random() * 20) + 5,  d2 = ~~(Math.random() * 10) + 1, r = f * d2;                  
                return { q: `Work? F=${f}N d=${d2}m`,          ans: r, u: 'J', qText: `Work?`, ansText: `${r} J` }; },
            () => { const m = ~~(Math.random() * 5) + 1,   v = ~~(Math.random() * 6) + 2, r = Math.round(.5 * m * v * v); 
                return { q: `KE? m=${m}kg v=${v}m/s`,         ans: r, u: 'J', qText: `Kinetic Energy?`, ansText: `${r} J` }; }
        ],
        7: [
            () => { const u = ~~(Math.random() * 8) + 1, v = ~~(Math.random() * 10) + u + 2, t = ~~(Math.random() * 5) + 1, r = Math.round((v - u) / t); 
                return { q: `Acc? u=${u} v=${v} t=${t}s`, ans: r, u: 'm/s²', qText: `Acceleration?`, ansText: `${r} m/s²` }; },
            () => { const m = ~~(Math.random() * 8) + 2, h = ~~(Math.random() * 10) + 1, r = m * 10 * h;                
                return { q: `PE? m=${m}kg h=${h}m g=10`,       ans: r, u: 'J', qText: `Potential Energy?`, ansText: `${r} J` }; },
            () => { const p = ~~(Math.random() * 8) + 2, t = ~~(Math.random() * 6) + 1, r = p * t;                      
                return { q: `Work? P=${p}W t=${t}s`,           ans: r, u: 'J', qText: `Work?`, ansText: `${r} J` }; },
            () => { const f = ~~(Math.random() * 20) + 5, a = ~~(Math.random() * 6) + 2, r = Math.round(f / a);         
                return { q: `Mass? F=${f}N a=${a}m/s²`,        ans: r, u: 'kg', qText: `Mass?`, ansText: `${r} kg` }; }
        ]
    };
    const bank = BANKS[g] || BANKS[6];

    let player = { x: canvas.width / 2 - 55, y: canvas.height - 55, w: 110, h: 20, speed: 9 };
    let blocks = [], particles = [], stars = [], lives = 3, gameTime = 60 + (g - 6) * 5;
    let combo = 1, streak = 0, localScore = 0, isOver = false, animId;
    let qText = '';

    for (let i = 0; i < 160; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.8,
            spd: Math.random() * 0.4 + 0.1,
            a: Math.random()
        });
    }

    async function spawnBlock() {
        const t = bank[~~(Math.random() * bank.length)]();
        const off = ~~(Math.random() * 12) + 3;
        
        // Translate question and answers if needed
        const textsToTranslate = [t.qText, `${t.ans} ${t.u}`, `${t.ans + off} ${t.u}`, `${Math.max(1, t.ans - off)} ${t.u}`];
        const translated = await translateTexts(textsToTranslate);
        
        qText = translated[0];
        const opts = [
            { label: translated[1], ok: true },
            { label: translated[2], ok: false },
            { label: translated[3], ok: false }
        ].sort(() => Math.random() - 0.5);
        
        const sw = canvas.width / 3;
        opts.forEach((o, i) => {
            blocks.push({
                x: i * sw + sw / 2 - 55,
                y: -60,
                w: 110, h: 52,
                label: o.label,
                ok: o.ok,
                spd: 2 + localScore * 0.007 + (g - 6) * 0.25
            });
        });
    }

    function burst(x, y, col, n = 22) {
        for (let i = 0; i < n; i++) {
            particles.push({ x, y, vx: (Math.random() - .5) * 9, vy: (Math.random() - .5) * 9, r: Math.random() * 4 + 2, life: 1, col });
        }
    }

    function draw() {
        const gr = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gr.addColorStop(0, '#04010f');
        gr.addColorStop(1, '#0f0830');
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(s => {
            s.a = 0.3 + 0.7 * Math.abs(Math.sin(Date.now() * 0.001 + s.x));
            ctx.globalAlpha = s.a;
            ctx.fillStyle   = '#fff';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
            s.y += s.spd;
            if (s.y > canvas.height) s.y = 0;
        });
        ctx.globalAlpha = 1;

        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,.55)';
        ctx.fillRect(0, 0, canvas.width, 48);
        ctx.font        = 'bold 14px "Courier New"';
        ctx.fillStyle   = '#FFD700';
        ctx.textAlign   = 'center';
        ctx.shadowBlur  = 8;
        ctx.shadowColor = '#FFD700';
        ctx.fillText(qText, canvas.width / 2, 30);
        ctx.shadowBlur = 0;
        ctx.restore();

        blocks.forEach(b => {
            ctx.save();
            const bgr = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
            if (b.ok) { bgr.addColorStop(0, '#00C84A'); bgr.addColorStop(1, '#006E28'); }
            else       { bgr.addColorStop(0, '#E7223A'); bgr.addColorStop(1, '#8B000F'); }
            ctx.shadowBlur  = 12;
            ctx.shadowColor = b.ok ? '#00F5A0' : '#FF2D9B';
            ctx.fillStyle   = bgr;
            ctx.beginPath();
            ctx.roundRect(b.x, b.y, b.w, b.h, 10);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,.25)';
            ctx.lineWidth   = 1.5;
            ctx.stroke();
            ctx.fillStyle     = '#fff';
            ctx.font          = 'bold 13px Outfit';
            ctx.textAlign     = 'center';
            ctx.textBaseline  = 'middle';
            ctx.shadowBlur    = 0;
            ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2);
            ctx.restore();
        });

        ctx.save();
        ctx.shadowBlur  = 24;
        ctx.shadowColor = '#00C3FF';
        const pg = ctx.createLinearGradient(player.x, 0, player.x + player.w, 0);
        pg.addColorStop(0,   '#00C3FF');
        pg.addColorStop(0.5, '#00F5A0');
        pg.addColorStop(1,   '#00C3FF');
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.roundRect(player.x, player.y, player.w, player.h, 8);
        ctx.fill();
        ctx.restore();

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle   = p.col;
            ctx.shadowBlur  = 8;
            ctx.shadowColor = p.col;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.vx; p.y += p.vy; p.life -= 0.025;
            if (p.life <= 0) particles.splice(i, 1);
            ctx.restore();
        }

        ctx.font         = '16px sans-serif';
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'alphabetic';
        let h = '';
        for (let i = 0; i < 3; i++) h += i < lives ? '❤️ ' : '🖤 ';
        ctx.fillText(h, 10, canvas.height - 10);

        if (combo > 1) {
            ctx.save();
            ctx.font        = `bold ${13 + combo * 2}px Outfit`;
            ctx.fillStyle   = '#FFD700';
            ctx.textAlign   = 'right';
            ctx.shadowBlur  = 12;
            ctx.shadowColor = '#FFD700';
            ctx.fillText('COMBO ×' + combo + ' 🔥', canvas.width - 10, canvas.height - 10);
            ctx.restore();
        }
    }

    function update() {
        blocks.forEach((b, i) => {
            b.y += b.spd;

            if (b.y + b.h >= player.y && b.y <= player.y + player.h &&
                b.x + b.w >= player.x && b.x <= player.x + player.w) {
                if (b.ok) {
                    streak++;
                    combo = Math.min(5, 1 + ~~(streak / 2));
                    const pts = 10 * combo;
                    localScore += pts;
                    score = localScore;
                    burst(b.x + b.w / 2, b.y, '#FFD700');
                    showFloatingText('+' + pts, b.x + b.w / 2, b.y, '#FFD700');
                } else {
                    lives--;
                    streak = 0;
                    combo  = 1;
                    burst(b.x + b.w / 2, b.y, '#FF2D9B');
                    shakeCanvas(canvas);
                }
                blocks.splice(i, 1);
                updateHUD(localScore);
                updateHealth(Math.max(0, (lives / 3) * 100));
                updateCombo(combo);
                return;
            }

            if (b.y > canvas.height) blocks.splice(i, 1);
        });
    }

    let keys = {};
    document.addEventListener('keydown', e => {
        keys[e.key] = true;
        if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    });
    document.addEventListener('keyup', e => { keys[e.key] = false; });

    let isDrag = false, dragX = 0, pX = 0;
    canvas.addEventListener('touchstart', e => { isDrag = true; dragX = e.touches[0].clientX; pX = player.x; }, { passive: true });
    canvas.addEventListener('touchmove',  e => { if (isDrag) { const dx = e.touches[0].clientX - dragX; player.x = Math.max(0, Math.min(canvas.width - player.w, pX + dx)); } });
    canvas.addEventListener('touchend',   () => { isDrag = false; });

    function handleInput() {
        if (keys['ArrowLeft']  && player.x > 0)                        player.x -= player.speed;
        if (keys['ArrowRight'] && player.x + player.w < canvas.width)  player.x += player.speed;
        if (!isOver) requestAnimationFrame(handleInput);
    }

    function loop() {
        if (isOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        update();
        animId = requestAnimationFrame(loop);
    }

    function end() {
        isOver = true;
        clearInterval(spawnInterval);
        clearInterval(timerInterval);
        cancelAnimationFrame(animId);
        score = localScore;
        finishMission(Math.min(100, ~~((localScore / 150) * 100)), 0);
    }

    spawnInterval = setInterval(spawnBlock, 1400);
    timerInterval = setInterval(() => { gameTime--; updateTimer(gameTime); if (gameTime <= 0 || lives <= 0) end(); }, 1000);
    updateTimer(gameTime);
    await spawnBlock();
    handleInput();
    loop();
}

/* ================================================================
   PHYSICS SHOOTER (Grades 8-9)
   ================================================================ */

async function physicsShooter(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const BANK = {
        8: [
            { q: 'V=12V R=4Ω → I=?',             opts: ['3 A',    '48 A',  '4 A'],    ans: 0, fact: "Ohm's Law: I=V/R=12/4=3A" },
            { q: 'Series R1=3Ω R2=5Ω → Total=?', opts: ['8 Ω',   '15 Ω',  '2 Ω'],    ans: 0, fact: 'Series: R=R1+R2=8Ω' },
            { q: 'Parallel R1=4Ω R2=4Ω → Total=?',opts: ['2 Ω',  '8 Ω',   '4 Ω'],    ans: 0, fact: 'Parallel: 1/R=1/4+1/4 → R=2Ω' },
            { q: 'Sound travels fastest in:',      opts: ['Solids','Liquids','Gases'],  ans: 0, fact: 'Speed: Solids > Liquids > Gases' },
            { q: 'Law of Reflection: ∠i = ?',     opts: ['∠r',   '90°',   '∠refraction'], ans: 0, fact: 'Angle of incidence = Angle of reflection' },
            { q: 'f=200Hz λ=1.5m → Wave speed=?', opts: ['300 m/s','133 m/s','250 m/s'], ans: 0, fact: 'v=fλ=200×1.5=300 m/s' }
        ],
        9: [
            { q: 'Object falls 5s (g=9.8). v=?',  opts: ['49 m/s', '45 m/s', '9.8 m/s'],    ans: 0, fact: 'v=u+gt=0+9.8×5=49 m/s' },
            { q: "Newton's 2nd Law: F=?",         opts: ['ma',    'mv',     'm/a'],           ans: 0, fact: 'Force = mass × acceleration' },
            { q: 'Momentum =?',                   opts: ['mass×velocity','force×time','mass×acc'], ans: 0, fact: 'p=mv (unit: kg·m/s)' },
            { q: 'Escape velocity from Earth≈',   opts: ['11.2 km/s','9.8 km/s','340 m/s'],  ans: 0, fact: 'Escape velocity=√(2GM/R)≈11.2 km/s' },
            { q: 'Convex lens:',                  opts: ['Converges light','Diverges light','No effect'], ans: 0, fact: 'Convex (converging) lens focuses rays at focal point' },
            { q: 'Buoyancy = ?',                  opts: ['Weight of fluid displaced','Weight of object','Mass×g'], ans: 0, fact: 'Buoyant force = weight of displaced fluid' }
        ]
    };
    const rawBank = BANK[g] || BANK[8];
    
    // Translate the question bank
    const translatedBank = [];
    for (const q of rawBank) {
        const textsToTranslate = [q.q, ...q.opts, q.fact];
        const translated = await translateTexts(textsToTranslate);
        translatedBank.push({
            q: translated[0],
            opts: translated.slice(1, 1 + q.opts.length),
            ans: q.ans,
            fact: translated[translated.length - 1]
        });
    }

    let localScore = 0, lives = 3, gameTime = 75 + (g - 8) * 5, isOver = false, animId;
    let targets = [], bullets = [], particles = [], qIdx = 0, currentQ = null;
    let cannon = { x: canvas.width / 2, y: canvas.height - 28, angle: -Math.PI / 2 };

    function nextQ() {
        const raw  = translatedBank[qIdx % translatedBank.length];
        currentQ   = shuffleQuestion(raw);
        qIdx++;
        const cols = ['#00C3FF', '#FF2D9B', '#FFD700'];
        targets = currentQ.opts.map((opt, i) => ({
            x:      90 + i * (canvas.width - 120) / currentQ.opts.length + (canvas.width - 120) / currentQ.opts.length / 2,
            y:      70 + Math.random() * 50,
            r:      44,
            label:  opt,
            ok:     i === currentQ.ans,
            wobble: Math.random() * Math.PI * 2,
            col:    cols[i]
        }));
    }

    function fire() {
        bullets.push({ x: cannon.x, y: cannon.y - 18, angle: cannon.angle, spd: 10, r: 7, col: '#00F5A0' });
    }

    function burst(x, y, col, n = 16) {
        for (let i = 0; i < n; i++) {
            particles.push({ x, y, vx: (Math.random() - .5) * 10, vy: (Math.random() - .5) * 10, r: Math.random() * 4 + 2, life: 1, col });
        }
    }

    function draw() {
        const gr = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gr.addColorStop(0, '#030c20'); gr.addColorStop(1, '#080025');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.strokeStyle = 'rgba(0,195,255,.04)'; ctx.lineWidth = 0.5;
        for (let x = 0; x < canvas.width; x += 40)  { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
        for (let y = 0; y < canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = 'rgba(0,245,160,.18)'; ctx.lineWidth = 1; ctx.setLineDash([6, 8]);
        ctx.beginPath(); ctx.moveTo(cannon.x, cannon.y - 18);
        for (let d = 0; d < 200; d += 10) {
            ctx.lineTo(cannon.x + Math.cos(cannon.angle) * d, cannon.y + Math.sin(cannon.angle) * d - 18);
        }
        ctx.stroke(); ctx.setLineDash([]); ctx.restore();

        if (currentQ) {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.beginPath(); ctx.roundRect(canvas.width / 2 - 260, 6, 520, 44, 12); ctx.fill();
            ctx.font = 'bold 14px Outfit'; ctx.fillStyle = '#FFD700'; ctx.textAlign = 'center';
            ctx.shadowBlur = 8; ctx.shadowColor = '#FFD700';
            ctx.fillText('🎯 ' + currentQ.q, canvas.width / 2, 33); ctx.shadowBlur = 0;
            ctx.restore();
        }

        targets.forEach(t => {
            t.wobble += 0.04;
            const wy = Math.sin(t.wobble) * 4;
            ctx.save();
            ctx.shadowBlur  = 18; ctx.shadowColor = t.col;
            ctx.fillStyle   = t.col + '44'; ctx.strokeStyle = t.col; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(t.x, t.y + wy, t.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.font = 'bold 11px Outfit'; ctx.fillStyle = '#fff';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(t.label, t.x, t.y + wy);
            ctx.restore();
        });

        ctx.save();
        ctx.translate(cannon.x, cannon.y); ctx.rotate(cannon.angle + Math.PI / 2);
        ctx.shadowBlur = 20; ctx.shadowColor = '#00F5A0';
        ctx.fillStyle  = '#007A50'; ctx.beginPath(); ctx.roundRect(-14, 2, 28, 18, 4); ctx.fill();
        ctx.fillStyle  = '#00F5A0'; ctx.beginPath(); ctx.roundRect(-9, -32, 18, 36, 4); ctx.fill();
        ctx.restore();

        bullets.forEach(b => {
            ctx.save();
            ctx.fillStyle = b.col; ctx.shadowBlur = 12; ctx.shadowColor = b.col;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        });

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = p.col;
            ctx.shadowBlur = 8; ctx.shadowColor = p.col;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            p.x += p.vx; p.y += p.vy; p.life -= 0.025;
            if (p.life <= 0) particles.splice(i, 1);
            ctx.restore();
        }

        ctx.font = '16px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        let h = '';
        for (let i = 0; i < 3; i++) h += i < lives ? '❤️ ' : '🖤 ';
        ctx.fillText(h, 10, canvas.height - 10);
    }

    function update() {
        for (let bi = bullets.length - 1; bi >= 0; bi--) {
            const b = bullets[bi];
            b.x += Math.cos(b.angle) * b.spd;
            b.y += Math.sin(b.angle) * b.spd;

            let hit = false;
            for (let ti = targets.length - 1; ti >= 0; ti--) {
                const t  = targets[ti];
                const dx = b.x - t.x, dy = b.y - t.y;
                if (Math.sqrt(dx * dx + dy * dy) < b.r + t.r) {
                    if (t.ok) {
                        localScore += 20; score = localScore;
                        updateHUD(localScore);
                        burst(t.x, t.y, t.col);
                        showFloatingText('+20', t.x, t.y, '#00F5A0');
                        showFloatingText('💡 ' + currentQ.fact, canvas.width / 2, canvas.height - 60, '#00C3FF');
                        updateProgress(Math.min(100, ~~((qIdx / translatedBank.length) * 100)));
                        setTimeout(nextQ, 700);
                    } else {
                        lives--;
                        updateHealth(Math.max(0, (lives / 3) * 100));
                        burst(t.x, t.y, '#FF2D9B', 10);
                        shakeCanvas(canvas);
                    }
                    targets.splice(ti, 1);
                    hit = true;
                    break;
                }
            }
            if (hit || b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
                bullets.splice(bi, 1);
            }
        }
    }

    canvas.addEventListener('mousemove', e => {
        const { x, y } = gpos(canvas, e);
        cannon.angle = Math.atan2(y - canvas.height + 28, x - cannon.x);
    });
    canvas.addEventListener('click', e => {
        const { x } = gpos(canvas, e);
        cannon.x = Math.max(30, Math.min(canvas.width - 30, x));
        fire();
    });
    canvas.addEventListener('touchstart', e => {
        const { x, y } = gpos(canvas, e.touches[0]);
        cannon.x = Math.max(30, Math.min(canvas.width - 30, x));
        cannon.angle = Math.atan2(y - canvas.height + 28, x - cannon.x);
        fire();
    }, { passive: true });
    document.addEventListener('keydown', e => { if (e.code === 'Space') { fire(); e.preventDefault(); } });

    function loop() {
        if (isOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(); update();
        animId = requestAnimationFrame(loop);
    }

    function end() {
        isOver = true;
        clearInterval(timerInterval);
        cancelAnimationFrame(animId);
        score = localScore;
        finishMission(Math.min(100, ~~((localScore / 120) * 100)), 0);
    }

    timerInterval = setInterval(() => { gameTime--; updateTimer(gameTime); if (gameTime <= 0 || lives <= 0) end(); }, 1000);
    updateTimer(gameTime);
    nextQ();
    loop();
}

/* ================================================================
   CHEM LAB (Grades 6-7) - Fully Translated
   ================================================================ */

async function chemLab(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const TASKS_G6 = [
        { inst: '💧 Make Salt Water',    hint: 'Drag Water + Salt into beaker',      needs: ['Water','Salt'],          mixed: [], res: { r:173,g:216,b:230, label:'🧂 Salt Solution!',  fact:'Salt dissolves in water = SOLUTION' } },
        { inst: '🍋 Acid Test',          hint: 'Lemon Juice + Litmus Paper',         needs: ['Lemon Juice','Litmus Paper'], mixed: [], res: { r:255,g:80,b:80,   label:'🔴 ACID (pH<7)!', fact:'Lemon juice turns litmus RED → ACIDIC' } },
        { inst: '🧼 Base Test',          hint: 'Soap + Litmus Paper',                needs: ['Soap','Litmus Paper'],    mixed: [], res: { r:147,g:112,b:219, label:'🔵 BASE (pH>7)!',   fact:'Soap turns litmus BLUE → BASIC' } },
        { inst: '🏖️ Suspension',         hint: 'Sand + Water into beaker',           needs: ['Sand','Water'],          mixed: [], res: { r:194,g:178,b:128, label:'🌀 Suspension!',    fact:"Sand doesn't dissolve — SUSPENSION!" } },
        { inst: '⚗️ Neutralisation',     hint: 'Vinegar + Soap',                     needs: ['Vinegar','Soap'],        mixed: [], res: { r:100,g:220,b:160, label:'✨ Neutral! pH≈7',   fact:'Acid + Base → Salt + Water = NEUTRALISATION!' } }
    ];
    
    const TASKS_G7 = [
        { inst: '⚛️ Build Hydrogen (H)',  hint: '1 Proton + 1 Electron',             needs: ['Proton','Electron'],      mixed: [], res: { r:100,g:180,b:255, label:'H — Hydrogen! Z=1', fact:'Simplest atom: 1 proton + 1 electron' } },
        { inst: '💧 Water Molecule H₂O',  hint: 'H Atom + H Atom2 + O Atom',        needs: ['H Atom','H Atom2','O Atom'], mixed: [], res: { r:80,g:170,b:255, label:'H₂O — Water!',   fact:'2 Hydrogen + 1 Oxygen = Water (covalent)' } },
        { inst: '🌬️ Carbon Dioxide CO₂', hint: 'Carbon + O Atom + O Atom2',         needs: ['Carbon','O Atom','O Atom2'], mixed: [], res: { r:180,g:180,b:200, label:'CO₂ formed!',   fact:'Carbon + 2 Oxygen → CO₂' } },
        { inst: '🧪 Ionic Compound NaCl', hint: 'Na Ion + Cl Ion',                   needs: ['Na Ion','Cl Ion'],        mixed: [], res: { r:240,g:240,b:220, label:'NaCl — Ionic!',    fact:'Metal + Non-metal = Ionic compound' } }
    ];
    
    const TASKS = g <= 6 ? TASKS_G6 : TASKS_G7;
    
    // Translate all task texts
    const translatedTasks = [];
    for (const task of TASKS) {
        const textsToTranslate = [task.inst, task.hint, ...task.needs, task.res.label, task.res.fact];
        const translated = await translateTexts(textsToTranslate);
        
        const needsCount = task.needs.length;
        translatedTasks.push({
            ...task,
            inst: translated[0],
            hint: translated[1],
            needs: translated.slice(2, 2 + needsCount),
            res: {
                ...task.res,
                label: translated[2 + needsCount],
                fact: translated[3 + needsCount]
            }
        });
    }

    const CHEMS_G6 = [
        { name:'Water',       r:77,  g2:166,b:255, icon:'💧', col:'#4da6ff' },
        { name:'Salt',        r:240, g2:240,b:240, icon:'🧂', col:'#e8e8e8' },
        { name:'Sand',        r:194, g2:178,b:128, icon:'🏖️', col:'#c2b280' },
        { name:'Lemon Juice', r:255, g2:215,b:0,   icon:'🍋', col:'#FFD700' },
        { name:'Soap',        r:221, g2:160,b:221, icon:'🧼', col:'#DDA0DD' },
        { name:'Vinegar',     r:255, g2:220,b:150, icon:'🍶', col:'#ffdc96' },
        { name:'Litmus Paper',r:200, g2:200,b:255, icon:'📄', col:'#c8c8ff' },
        { name:'Baking Soda', r:240, g2:240,b:240, icon:'🥄', col:'#f0f0f0' }
    ];
    
    const CHEMS_G7 = [
        { name:'Proton',  r:255,g2:80, b:80,  icon:'⊕',  col:'#FF5050' },
        { name:'Electron',r:80, g2:150,b:255, icon:'⊖',  col:'#5096FF' },
        { name:'O Atom',  r:255,g2:80, b:80,  icon:'O',  col:'#FF5050' },
        { name:'O Atom2', r:255,g2:100,b:80,  icon:'O',  col:'#FF6450' },
        { name:'Carbon',  r:80, g2:80, b:80,  icon:'C',  col:'#505050' },
        { name:'H Atom',  r:100,g2:200,b:255, icon:'H',  col:'#64C8FF' },
        { name:'H Atom2', r:100,g2:210,b:255, icon:'H',  col:'#64D2FF' },
        { name:'Na Ion',  r:255,g2:200,b:80,  icon:'Na⁺',col:'#FFC850' },
        { name:'Cl Ion',  r:80, g2:220,b:80,  icon:'Cl⁻',col:'#50DC50' },
        { name:'Neutron', r:180,g2:180,b:180, icon:'◉',  col:'#B4B4B4' }
    ];
    
    const CDEFS = g <= 6 ? CHEMS_G6 : CHEMS_G7;
    
    // Translate chemical names if needed
    const chemNamesToTranslate = CDEFS.map(c => c.name);
    const translatedChemNames = await translateTexts(chemNamesToTranslate);
    const chems = CDEFS.slice(0, 8).map((c, i) => ({
        ...c,
        name: translatedChemNames[i],
        x: i < 4 ? 14 : canvas.width - 68 - 14,
        y: 55 + (i % 4) * (64 + 10),
        ox: i < 4 ? 14 : canvas.width - 68 - 14,
        oy: 55 + (i % 4) * (64 + 10),
        hover: 0,
        bob: Math.random() * Math.PI * 2
    }));

    let taskIdx = 0;
    let task = JSON.parse(JSON.stringify(translatedTasks[0]));

    const BKX = canvas.width / 2 - 82, BKY = 62, BKW = 164, BKH = 224;
    let bk = {
        x: BKX, y: BKY, w: BKW, h: BKH,
        lvl: 0, tlvl: 0,
        lr: 60, lg: 120, lb: 200,
        tr: 60, tg: 120, tb: 200,
        glow: 0, glowCol: '#00C3FF',
        label: '', la: 0,
        done: false, wave: 0
    };

    let localScore = 0, lives = 3, gameTime = 90 + (g - 6) * 15, isOver = false, animId;
    let bubbles = [], smoke = [], drag = null, dox = 0, doy = 0, dropGlow = 0, shake = 0;
    let factText = '', factAlpha = 0, factLife = 0;

    function spawnBubbles(x, y, col, n) {
        for (let i = 0; i < n; i++) {
            bubbles.push({ x: x + (Math.random() - .5) * 60, y: y + Math.random() * 15, r: Math.random() * 5 + 2, spd: Math.random() * 1.8 + 0.6, wobble: Math.random() * Math.PI * 2, life: 1, col });
        }
    }
    
    function spawnSmoke(x, y, n) {
        for (let i = 0; i < n; i++) {
            smoke.push({ x: x + (Math.random() - .5) * 30, y, vx: (Math.random() - .5) * 2, vy: -(Math.random() * 2.5 + 1), r: Math.random() * 12 + 6, life: 1 });
        }
    }

    function addToBK(c) {
        if (task.needs.includes(c.name) && !task.mixed.includes(c.name)) {
            task.mixed.push(c.name);
            bk.tlvl = Math.min(BKH - 20, bk.tlvl + (BKH - 20) / task.needs.length);
            spawnBubbles(bk.x + bk.w / 2, bk.y + bk.h - bk.lvl, c.col, 20);

            if (task.needs.every(n => task.mixed.includes(n))) {
                bk.tr = task.res.r; bk.tg = task.res.g; bk.tb = task.res.b;
                bk.label = task.res.label; bk.glow = 1;
                bk.glowCol = `rgb(${task.res.r},${task.res.g},${task.res.b})`;
                bk.done = true;
                localScore += 35; score = localScore;
                updateHUD(localScore);
                updateProgress(~~(((taskIdx + 1) / translatedTasks.length) * 100));
                factText = task.res.fact; factAlpha = 0; factLife = 3.5;
                showFloatingText('+35 XP!', canvas.width / 2, BKY - 45, '#00F5A0');
                setTimeout(nextTask, 2400);
            } else {
                showFloatingText('✓ ' + c.name, bk.x + bk.w / 2, bk.y - 15, '#FFD700');
            }
        } else if (task.mixed.includes(c.name)) {
            showFloatingText('Already added!', canvas.width / 2, BKY - 20, '#9B8FC0');
        } else {
            lives--;
            updateHealth(Math.max(0, (lives / 3) * 100));
            shake = 14;
            spawnSmoke(bk.x + bk.w / 2, bk.y + 20, 18);
            showFloatingText('❌ Wrong!', canvas.width / 2, 52, '#FF2D9B');
        }
    }

    function nextTask() {
        taskIdx++;
        if (taskIdx >= translatedTasks.length) { end(); return; }
        task = JSON.parse(JSON.stringify(translatedTasks[taskIdx]));
        bk.tlvl = 0; bk.tr = 60; bk.tg = 120; bk.tb = 200;
        bk.label = ''; bk.la = 0; bk.done = false; bk.glow = 0;
        bubbles = []; smoke = [];
    }

    function drawBg() {
        const gr = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gr.addColorStop(0, '#050818'); gr.addColorStop(1, '#060a14');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawBottle(c) {
        const bob = Math.sin(Date.now() * 0.002 + c.bob) * 2;
        const fw = 68 - 10, fh = 64 - 8;
        ctx.save();
        ctx.translate(c.x + 68 / 2, c.y + 64 / 2 + bob - c.hover * 4);
        ctx.shadowBlur  = 8 + c.hover * 10;
        ctx.shadowColor = c.col;
        ctx.beginPath();
        ctx.moveTo(-fw/2, fh/2);
        ctx.lineTo(fw/2, fh/2);
        ctx.quadraticCurveTo(fw/2+4, 0, fw*.28, -fh*.15);
        ctx.lineTo(fw*.22, -fh*.5);
        ctx.lineTo(-fw*.22, -fh*.5);
        ctx.lineTo(-fw*.28, -fh*.15);
        ctx.quadraticCurveTo(-fw/2-4, 0, -fw/2, fh/2);
        ctx.closePath();
        const gr = ctx.createLinearGradient(-fw/2, -fh/2, fw/2, fh/2);
        gr.addColorStop(0,   `rgba(${c.r},${c.g2},${c.b},.18)`);
        gr.addColorStop(0.4, `rgba(${c.r},${c.g2},${c.b},.35)`);
        gr.addColorStop(1,   `rgba(${c.r},${c.g2},${c.b},.22)`);
        ctx.fillStyle   = gr;
        ctx.fill();
        ctx.strokeStyle = `rgba(${c.r},${c.g2},${c.b},.65)`;
        ctx.lineWidth   = 1.8;
        ctx.stroke();
        ctx.save();
        ctx.clip();
        const lq = ctx.createLinearGradient(0, fh*.05, 0, fh/2);
        lq.addColorStop(0, `rgba(${c.r},${c.g2},${c.b},.5)`);
        lq.addColorStop(1, `rgba(${c.r},${c.g2},${c.b},.85)`);
        ctx.fillStyle = lq;
        ctx.fillRect(-fw/2, fh*.05, fw, fh*.5);
        ctx.restore();
        ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(c.icon, 0, -fh * 0.22);
        ctx.fillStyle = 'rgba(0,0,0,.5)';
        ctx.beginPath(); ctx.roundRect(-68/2+2, fh*.22, 68-4, 15, 3); ctx.fill();
        ctx.font = 'bold 8px Outfit'; ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle';
        ctx.fillText(c.name.slice(0, 11), 0, fh*.22+7.5);
        ctx.restore();
    }

    function drawBeaker() {
        bk.lvl += (bk.tlvl - bk.lvl) * 0.04;
        bk.lr  += (bk.tr - bk.lr) * 0.03;
        bk.lg  += (bk.tg - bk.lg) * 0.03;
        bk.lb  += (bk.tb - bk.lb) * 0.03;
        if (bk.glow > 0) bk.glow = 0.6 + 0.4 * Math.sin(Date.now() * 0.006);
        bk.wave = Date.now() * 0.004;

        const { x, y, w, h } = bk;
        const topW = w * 0.85, topX = x + (w - topW) / 2;

        ctx.save();
        if (bk.glow > 0) { ctx.shadowBlur = 40 * bk.glow; ctx.shadowColor = bk.glowCol; }
        if (dropGlow > 0) {
            const dg = ctx.createRadialGradient(x+w/2, y+h/2, 10, x+w/2, y+h/2, w);
            dg.addColorStop(0, `rgba(255,215,0,${dropGlow*.12})`);
            dg.addColorStop(1, 'transparent');
            ctx.fillStyle = dg;
            ctx.fillRect(x-18, y-18, w+36, h+36);
            dropGlow *= 0.92;
        }
        ctx.beginPath();
        ctx.moveTo(topX, y); ctx.lineTo(topX + topW, y);
        ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h);
        ctx.closePath();
        ctx.fillStyle   = 'rgba(180,220,255,.05)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.5)';
        ctx.lineWidth   = 2;
        ctx.stroke();
        ctx.shadowBlur  = 0;

        if (bk.lvl > 1) {
            const ly = y + h - bk.lvl;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(topX, y); ctx.lineTo(topX + topW, y);
            ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h);
            ctx.closePath();
            ctx.clip();
            const lg = ctx.createLinearGradient(x, ly, x, y + h);
            lg.addColorStop(0, `rgba(${bk.lr|0},${bk.lg|0},${bk.lb|0},.55)`);
            lg.addColorStop(1, `rgba(${bk.lr|0},${bk.lg|0},${bk.lb|0},.9)`);
            ctx.fillStyle = lg;
            ctx.fillRect(x, ly, w, h);
            ctx.fillStyle = `rgba(${bk.lr|0},${bk.lg|0},${bk.lb|0},.95)`;
            ctx.beginPath();
            ctx.moveTo(x, ly);
            for (let xi = x; xi <= x + w; xi += 3) {
                ctx.lineTo(xi, ly + Math.sin(bk.wave + xi * 0.06) * 3);
            }
            ctx.lineTo(x + w, ly + 10); ctx.lineTo(x, ly + 10);
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(topX - 6, y); ctx.lineTo(topX + topW + 6, y); ctx.stroke();

        if (bk.label) {
            bk.la = Math.min(1, bk.la + 0.025);
            ctx.save();
            ctx.globalAlpha = bk.la;
            const lw = 162, lh = 24, lx2 = x + w/2 - lw/2, ly2 = y + h + 14;
            ctx.fillStyle   = `rgba(${bk.lr|0},${bk.lg|0},${bk.lb|0},.15)`;
            ctx.strokeStyle = `rgba(${bk.lr|0},${bk.lg|0},${bk.lb|0},.5)`;
            ctx.lineWidth   = 1.5;
            ctx.shadowBlur  = 12; ctx.shadowColor = bk.glowCol;
            ctx.beginPath(); ctx.roundRect(lx2, ly2, lw, lh, 12); ctx.fill(); ctx.stroke();
            ctx.font = 'bold 10px Outfit'; ctx.fillStyle = bk.glowCol;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowBlur = 0;
            ctx.fillText(bk.label, x + w/2, ly2 + lh/2);
            ctx.restore();
        }
        ctx.restore();
    }

    function drawUI() {
        ctx.save();
        ctx.fillStyle   = 'rgba(10,6,30,.88)';
        ctx.strokeStyle = 'rgba(100,150,255,.35)';
        ctx.lineWidth   = 1.5;
        ctx.beginPath(); ctx.roundRect(90, 7, canvas.width - 180, 48, 12); ctx.fill(); ctx.stroke();
        ctx.font = 'bold 13px Outfit'; ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center'; ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(255,215,0,.4)';
        ctx.fillText(task.inst, canvas.width / 2, 26);
        ctx.font = '10px Outfit'; ctx.fillStyle = '#9B8FC0'; ctx.shadowBlur = 0;
        ctx.fillText(task.hint, canvas.width / 2, 42);
        ctx.restore();

        const cw = 90, cg = 8, cy = canvas.height - 42;
        const tot = task.needs.length * cw + (task.needs.length - 1) * cg;
        const sx  = canvas.width / 2 - tot / 2;
        task.needs.forEach((n, i) => {
            const done = task.mixed.includes(n), cx2 = sx + i * (cw + cg);
            ctx.save();
            ctx.shadowBlur  = done ? 16 : 0; ctx.shadowColor = '#00F5A0';
            ctx.fillStyle   = done ? 'rgba(0,245,160,.2)' : 'rgba(255,255,255,.04)';
            ctx.strokeStyle = done ? 'rgba(0,245,160,.6)' : 'rgba(255,255,255,.15)';
            ctx.lineWidth   = 1.5;
            ctx.beginPath(); ctx.roundRect(cx2, cy, cw, 26, 10); ctx.fill(); ctx.stroke();
            ctx.font = 'bold 9px Outfit'; ctx.fillStyle = done ? '#00F5A0' : '#9B8FC0';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowBlur = 0;
            ctx.fillText((done ? '✓ ' : '○ ') + n.slice(0, 10), cx2 + cw/2, cy + 13);
            ctx.restore();
        });

        const dr = 7, dg2 = 16, tx = canvas.width - 14 - translatedTasks.length * (dr*2+dg2) + dg2, ty = 20;
        translatedTasks.forEach((_, i) => {
            ctx.save();
            ctx.shadowBlur  = i === taskIdx ? 12 : 0; ctx.shadowColor = '#FFD700';
            ctx.fillStyle   = i < taskIdx ? '#00F5A0' : i === taskIdx ? '#FFD700' : 'rgba(255,255,255,.15)';
            ctx.beginPath(); ctx.arc(tx + i * (dr*2+dg2), ty, dr, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        });

        if (factLife > 0) {
            factLife  -= 0.012;
            factAlpha  = Math.min(1, factAlpha + 0.04);
            if (factLife < 0.5) factAlpha = factLife * 2;
            ctx.save();
            ctx.globalAlpha = factAlpha;
            ctx.fillStyle   = 'rgba(0,245,160,.1)'; ctx.strokeStyle = 'rgba(0,245,160,.35)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(90, canvas.height - 76, canvas.width - 180, 32, 10); ctx.fill(); ctx.stroke();
            ctx.font = 'bold 10px Outfit'; ctx.fillStyle = '#00F5A0';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('💡 ' + factText, canvas.width / 2, canvas.height - 60);
            ctx.restore();
        }

        ctx.font = '16px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        let h = '';
        for (let i = 0; i < 3; i++) h += i < lives ? '❤️ ' : '🖤 ';
        ctx.fillText(h, 10, canvas.height - 8);
    }

    function loop() {
        if (isOver) return;
        let ox = 0, oy = 0;
        if (shake > 0) { ox = (Math.random() - .5) * shake; oy = (Math.random() - .5) * shake; shake *= 0.78; if (shake < 0.4) shake = 0; }
        ctx.save();
        if (shake > 0) ctx.translate(ox, oy);
        ctx.clearRect(-20, -20, canvas.width + 40, canvas.height + 40);

        drawBg();
        drawBeaker();
        chems.forEach(c => { if (c !== drag) drawBottle(c); });

        for (let i = bubbles.length - 1; i >= 0; i--) {
            const b = bubbles[i];
            b.wobble += 0.05; b.x += Math.sin(b.wobble) * 0.8; b.y -= b.spd; b.life -= 0.014;
            if (b.life <= 0) { bubbles.splice(i, 1); continue; }
            ctx.save(); ctx.globalAlpha = b.life * 0.8;
            ctx.strokeStyle = b.col; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
            ctx.restore();
        }

        for (let i = smoke.length - 1; i >= 0; i--) {
            const s = smoke[i];
            s.x += s.vx; s.y += s.vy; s.r *= 1.02; s.life -= 0.018;
            if (s.life <= 0) { smoke.splice(i, 1); continue; }
            ctx.save(); ctx.globalAlpha = s.life * 0.4;
            ctx.fillStyle = 'rgba(220,80,80,1)';
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        }

        if (drag) {
            dropGlow = Math.max(dropGlow, 0.7);
            ctx.save(); ctx.globalAlpha = 0.75; drawBottle(drag); ctx.restore();
        }

        drawUI();
        ctx.restore();
        animId = requestAnimationFrame(loop);
    }

    function onDown(e) {
        const { x, y } = gpos(canvas, e);
        chems.forEach(c => {
            if (x >= c.ox && x <= c.ox + 68 && y >= c.oy && y <= c.oy + 64) {
                drag = c; dox = x - c.x; doy = y - c.y;
            }
        });
    }
    
    function onMove(e) {
        const { x, y } = gpos(canvas, e);
        chems.forEach(c => {
            const cx2 = c.ox + 68/2, cy2 = c.oy + 64/2;
            const d = Math.hypot(x - cx2, y - cy2);
            c.hover = Math.min(1, Math.max(0, c.hover + (d < 68 * 0.7 ? 0.1 : -0.1)));
        });
        if (drag) { drag.x = x - dox; drag.y = y - doy; }
    }
    
    function onUp(e) {
        if (!drag) return;
        const { x, y } = gpos(canvas, e);
        if (x > BKX - 18 && x < BKX + BKW + 18 && y > BKY && y < BKY + BKH) addToBK(drag);
        drag.x = drag.ox; drag.y = drag.oy;
        drag = null;
    }
    
    canvas.addEventListener('mousedown',  onDown);
    canvas.addEventListener('mousemove',  onMove);
    canvas.addEventListener('mouseup',    onUp);
    canvas.addEventListener('touchstart', onDown, { passive: true });
    canvas.addEventListener('touchmove',  e => { onMove(e); e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchend',   e => { onUp({ ...e, touches: e.changedTouches }); });

    function end() {
        isOver = true;
        clearInterval(timerInterval);
        cancelAnimationFrame(animId);
        score = localScore;
        finishMission(~~((localScore / (translatedTasks.length * 35)) * 100), 0);
    }

    timerInterval = setInterval(() => { gameTime--; updateTimer(gameTime); if (lives <= 0 || gameTime <= 0) end(); }, 1000);
    updateTimer(gameTime);
    loop();
}

/* ================================================================
   CHEM HEIST (Grades 8-9)
   ================================================================ */

async function chemHeist(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const QUESTS_G8 = [
        { q: 'Steal the alkali metal in Period 3',   target: 'Na', symbol:'Na', col:'#FFD700', row:2, col2:0,  fact:'Na (Sodium) — Group 1, Period 3, Z=11' },
        { q: 'Find the noble gas in Period 2',       target: 'Ne', symbol:'Ne', col:'#00C3FF', row:1, col2:17, fact:'Ne (Neon) — Group 18, Period 2, full outer shell' },
        { q: 'Grab the halogen in Period 3',         target: 'Cl', symbol:'Cl', col:'#FF8C00', row:2, col2:16, fact:'Cl (Chlorine) — Group 17, Period 3, Z=17' },
        { q: 'Steal the lightest alkaline earth',    target: 'Be', symbol:'Be', col:'#7CFC00', row:1, col2:1,  fact:'Be (Beryllium) — Group 2, Period 2, lightest alkaline earth' },
        { q: 'Get the Period 2 nitrogen group element',target:'N', symbol:'N',  col:'#FF2D9B', row:1, col2:14, fact:'N (Nitrogen) — Group 15, Period 2, 78% of air' },
        { q: 'Find the most reactive halogen',       target: 'F',  symbol:'F',  col:'#00F5A0', row:1, col2:16, fact:'F (Fluorine) — most electronegative element, Group 17 Period 2' }
    ];
    
    const QUESTS_G9 = [
        { q: 'Steal the element with Z=26 (magnetic)', target:'Fe',symbol:'Fe',col:'#FF6450',row:3,col2:6,  fact:'Fe (Iron) — Z=26, Period 4, transition metal, used in magnets' },
        { q: 'Find the semiconductor in Group 14',   target:'Si', symbol:'Si', col:'#00C3FF', row:2,col2:13, fact:'Si (Silicon) — metalloid, Z=14, backbone of electronics' },
        { q: 'Grab the most abundant metal in crust',target:'Al', symbol:'Al', col:'#FFD700', row:2,col2:12, fact:'Al (Aluminium) — Z=13, most abundant metal in Earth\'s crust' },
        { q: 'Steal the radioactive alkali metal',   target:'Fr', symbol:'Fr', col:'#FF2D9B', row:6,col2:0,  fact:'Fr (Francium) — Z=87, most radioactive alkali metal' },
        { q: 'Find the element named after Curie',   target:'Cm', symbol:'Cm', col:'#7CFC00', row:9,col2:7,  fact:'Cm (Curium) — Z=96, named after Marie & Pierre Curie' },
        { q: 'Get the Period 4 noble gas',           target:'Kr', symbol:'Kr', col:'#00F5A0', row:3,col2:17, fact:'Kr (Krypton) — Z=36, Period 4, noble gas' }
    ];
    
    const QUESTS = g <= 8 ? QUESTS_G8 : QUESTS_G9;
    
    // Translate questions and facts
    const translatedQuests = [];
    for (const q of QUESTS) {
        const textsToTranslate = [q.q, q.fact];
        const translated = await translateTexts(textsToTranslate);
        translatedQuests.push({
            ...q,
            q: translated[0],
            fact: translated[1]
        });
    }

    let localScore = 0, lives = 3, gameTime = 80 + (g - 8) * 10, isOver = false, animId;
    let qIdx = 0, currentQ = null, phase = 'hunt', alarmTimer = 0, successTimer = 0;
    let spotAngle = 0, spotSpd = 0.012 + (g - 8) * 0.006;
    let cursorX = canvas.width / 2, cursorY = canvas.height / 2;
    let caught = false, foundIt = false, particles = [];

    const CELL_W = (canvas.width - 20) / 18;
    const CELL_H = 24;
    const TABLE_Y = 52;

    const ELEM_POS = {
        H:{r:0,c:0},He:{r:0,c:17},
        Li:{r:1,c:0},Be:{r:1,c:1},B:{r:1,c:12},C:{r:1,c:13},N:{r:1,c:14},O:{r:1,c:15},F:{r:1,c:16},Ne:{r:1,c:17},
        Na:{r:2,c:0},Mg:{r:2,c:1},Al:{r:2,c:12},Si:{r:2,c:13},P:{r:2,c:14},S:{r:2,c:15},Cl:{r:2,c:16},Ar:{r:2,c:17},
        K:{r:3,c:0},Ca:{r:3,c:1},Fe:{r:3,c:6},Cu:{r:3,c:10},Zn:{r:3,c:11},Br:{r:3,c:16},Kr:{r:3,c:17},
        Rb:{r:4,c:0},Sr:{r:4,c:1},Ag:{r:4,c:10},I:{r:4,c:16},Xe:{r:4,c:17},
        Cs:{r:5,c:0},Ba:{r:5,c:1},Au:{r:5,c:10},Hg:{r:5,c:11},At:{r:5,c:16},Rn:{r:5,c:17},
        Fr:{r:6,c:0},Ra:{r:6,c:1},
        Cm:{r:9,c:7}
    };

    const GROUP_COLS = {
        0:'#FF5050',1:'#FF8C00',12:'#FFD700',13:'#A0C070',14:'#50C870',
        15:'#50B0C8',16:'#5090E0',17:'#8050E0',17.5:'#505050',default:'#606060'
    };

    function nextQ() {
        if (qIdx >= translatedQuests.length) { end(); return; }
        currentQ   = translatedQuests[qIdx]; qIdx++;
        phase      = 'hunt'; caught = false; foundIt = false;
        alarmTimer = 0; successTimer = 0;
    }

    function burst(x, y, col, n = 20) {
        for (let i = 0; i < n; i++) {
            particles.push({ x, y, vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8, r: Math.random()*4+2, life:1, col });
        }
    }

    function getCellRect(r, c) {
        const rowY = r <= 6 ? TABLE_Y + r * (CELL_H + 2) : TABLE_Y + (r - 1) * (CELL_H + 2) + 20;
        return { x: 10 + c * CELL_W, y: rowY, w: CELL_W - 2, h: CELL_H };
    }

    function isInSpotlight(px, py) {
        const cx = canvas.width / 2, cy = canvas.height + 60;
        const dx = px - cx, dy = py - cy;
        const angle = Math.atan2(dy, dx);
        const diff  = Math.abs(((angle - spotAngle) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
        return diff < 0.3;
    }

    function draw() {
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        Object.entries(ELEM_POS).forEach(([sym, pos]) => {
            const rect  = getCellRect(pos.r, pos.c);
            const isTarget = currentQ && sym === currentQ.target;
            ctx.save();
            ctx.fillStyle   = isTarget && foundIt ? currentQ.col + '88' : 'rgba(255,255,255,0.07)';
            ctx.strokeStyle = isTarget ? currentQ.col : 'rgba(255,255,255,0.15)';
            ctx.lineWidth   = isTarget ? 2 : 0.5;
            if (isTarget) { ctx.shadowBlur = 20; ctx.shadowColor = currentQ.col; }
            ctx.beginPath(); ctx.roundRect(rect.x, rect.y, rect.w, rect.h, 3); ctx.fill(); ctx.stroke();
            ctx.font          = `bold ${sym.length > 2 ? 6 : 8}px monospace`;
            ctx.fillStyle     = isTarget ? currentQ.col : 'rgba(255,255,255,0.55)';
            ctx.textAlign     = 'center';
            ctx.textBaseline  = 'middle';
            ctx.shadowBlur    = 0;
            ctx.fillText(sym, rect.x + rect.w/2, rect.y + rect.h/2);
            ctx.restore();
        });

        const cx = canvas.width / 2, cy = canvas.height + 60;
        ctx.save();
        ctx.globalAlpha = caught ? 0.6 : 0.25;
        const coneLen = canvas.height + 80;
        const halfAngle = 0.28;
        const sx1 = cx + Math.cos(spotAngle - halfAngle) * coneLen;
        const sy1 = cy + Math.sin(spotAngle - halfAngle) * coneLen;
        const sx2 = cx + Math.cos(spotAngle + halfAngle) * coneLen;
        const sy2 = cy + Math.sin(spotAngle + halfAngle) * coneLen;
        const spotGr = ctx.createLinearGradient(cx, cy, cx + Math.cos(spotAngle) * coneLen, cy + Math.sin(spotAngle) * coneLen);
        spotGr.addColorStop(0, caught ? 'rgba(255,50,50,0.9)' : 'rgba(255,240,150,0.9)');
        spotGr.addColorStop(1, 'rgba(255,240,150,0)');
        ctx.fillStyle = spotGr;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.font = '20px sans-serif';
        ctx.textAlign   = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(caught ? '😱' : '🕵️', cursorX, cursorY);
        ctx.restore();

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = p.col;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            p.x += p.vx; p.y += p.vy; p.life -= 0.03;
            if (p.life <= 0) particles.splice(i, 1);
            ctx.restore();
        }

        if (currentQ) {
            ctx.save();
            ctx.fillStyle   = 'rgba(0,0,0,0.8)';
            ctx.strokeStyle = 'rgba(255,215,0,0.3)';
            ctx.lineWidth   = 1;
            ctx.beginPath(); ctx.roundRect(10, canvas.height - 56, canvas.width - 20, 46, 8); ctx.fill(); ctx.stroke();
            ctx.font        = 'bold 11px Outfit'; ctx.fillStyle = '#FFD700';
            ctx.textAlign   = 'center';
            ctx.fillText('🕵️ MISSION: ' + currentQ.q, canvas.width/2, canvas.height - 36);
            ctx.font        = '9px Outfit'; ctx.fillStyle = '#9B8FC0';
            ctx.fillText('Move to ' + currentQ.target + ' without touching the spotlight', canvas.width/2, canvas.height - 20);
            ctx.restore();
        }

        if (caught && alarmTimer > 0) {
            ctx.save();
            ctx.globalAlpha = Math.sin(alarmTimer * 0.3) * 0.3;
            ctx.fillStyle   = 'rgba(255,0,0,1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
            alarmTimer--;
        }

        if (foundIt && successTimer > 0) {
            ctx.save();
            ctx.globalAlpha = Math.sin(successTimer * 0.3) * 0.25;
            ctx.fillStyle   = currentQ ? currentQ.col : '#00F5A0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
            successTimer--;
        }

        ctx.font = '15px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        let h = '';
        for (let i = 0; i < 3; i++) h += i < lives ? '❤️ ' : '🖤 ';
        ctx.fillText(h, 10, 20);
        ctx.font = 'bold 10px Outfit'; ctx.fillStyle = '#9B8FC0'; ctx.textAlign = 'right';
        ctx.fillText('Mission ' + qIdx + '/' + translatedQuests.length, canvas.width - 10, 20);
    }

    function update() {
        if (phase !== 'hunt') return;
        spotAngle = (spotAngle - spotSpd + Math.PI * 2) % (Math.PI * 2);

        if (isInSpotlight(cursorX, cursorY) && !caught) {
            caught     = true;
            alarmTimer = 50;
            lives--;
            updateHealth(Math.max(0, (lives / 3) * 100));
            shakeCanvas(canvas);
            showFloatingText('🚨 CAUGHT!', canvas.width/2, canvas.height/2, '#FF2D9B');
            setTimeout(() => { caught = false; }, 2000);
        }

        if (!caught && currentQ && !foundIt) {
            const pos  = ELEM_POS[currentQ.target];
            if (pos) {
                const rect = getCellRect(pos.r, pos.c);
                if (cursorX >= rect.x && cursorX <= rect.x + rect.w &&
                    cursorY >= rect.y && cursorY <= rect.y + rect.h) {
                    foundIt      = true;
                    successTimer = 40;
                    phase        = 'done';
                    localScore  += 30;
                    score        = localScore;
                    updateHUD(localScore);
                    burst(rect.x + rect.w/2, rect.y + rect.h/2, currentQ.col);
                    showFloatingText('🕵️ STOLEN! +30', cursorX, cursorY - 30, currentQ.col);
                    showFloatingText('💡 ' + currentQ.fact, canvas.width/2, canvas.height - 70, '#00C3FF');
                    updateProgress(Math.min(100, ~~((qIdx / translatedQuests.length) * 100)));
                    setTimeout(nextQ, 2200);
                }
            }
        }
    }

    canvas.addEventListener('mousemove', e => {
        const p = gpos(canvas, e); cursorX = p.x; cursorY = p.y;
    });
    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        const p = gpos(canvas, e.touches[0]); cursorX = p.x; cursorY = p.y;
    }, { passive: false });
    canvas.addEventListener('touchstart', e => {
        const p = gpos(canvas, e.touches[0]); cursorX = p.x; cursorY = p.y;
    }, { passive: true });

    function loop() {
        if (isOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(); update();
        animId = requestAnimationFrame(loop);
    }

    function end() {
        isOver = true;
        clearInterval(timerInterval);
        cancelAnimationFrame(animId);
        score = localScore;
        finishMission(Math.min(100, ~~((localScore / (translatedQuests.length * 30)) * 100)), 0);
    }

    timerInterval = setInterval(() => { gameTime--; updateTimer(gameTime); if (gameTime <= 0 || lives <= 0) end(); }, 1000);
    updateTimer(gameTime);
    nextQ();
    loop();
}

/* ================================================================
   BIO DEFENCE (Grades 6-7)
   ================================================================ */

async function bioDefence(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const QA_G6 = [
        { q:'Cell control center?',   a:'Nucleus',    w:['Mitochondria','Ribosome'], fact:'Nucleus contains DNA, controls cell activities' },
        { q:'Energy powerhouse?',     a:'Mitochondria',w:['Nucleus','Vacuole'],      fact:'Mitochondria produces ATP via cellular respiration' },
        { q:'Protein synthesis site?',a:'Ribosome',   w:['Nucleus','Cell Wall'],    fact:'Ribosomes translate mRNA into proteins' },
        { q:'Only in plant cells?',   a:'Cell Wall',  w:['Nucleus','Mitochondria'], fact:'Cellulose cell wall gives plants rigidity' },
        { q:'Stores water in plants?',a:'Vacuole',    w:['Ribosome','Lysosome'],    fact:'Large central vacuole stores water & nutrients' },
        { q:'Oxygen carrier in blood?',a:'RBC',       w:['WBC','Platelet'],         fact:'Haemoglobin in RBCs binds O₂ in lungs' },
        { q:'Immune defence cell?',   a:'WBC',        w:['RBC','Platelet'],         fact:'WBCs (leukocytes) destroy pathogens' },
        { q:'Blood pump organ?',      a:'Heart',      w:['Lungs','Kidney'],         fact:'Heart pumps ~5 L/min through blood vessels' }
    ];
    
    const QA_G7 = [
        { q:'Enzyme in saliva?',         a:'Amylase',         w:['Pepsin','Lipase'],           fact:'Salivary amylase breaks starch → maltose' },
        { q:'Protein digestion begins in?',a:'Stomach',       w:['Mouth','Small intestine'],   fact:'Pepsin (pH 2) digests proteins in stomach' },
        { q:'Site of photosynthesis?',   a:'Chloroplast',     w:['Mitochondria','Nucleus'],    fact:'Chlorophyll absorbs sunlight for photosynthesis' },
        { q:'Gas released in photosynthesis?',a:'Oxygen',     w:['CO₂','Nitrogen'],            fact:'6CO₂+6H₂O+light→C₆H₁₂O₆+6O₂' },
        { q:'Anaerobic respiration in yeast?',a:'Ethanol',    w:['Lactic acid','Water'],       fact:'Yeast: glucose→ethanol+CO₂ (fermentation)' },
        { q:'Nutrient absorption in?',   a:'Small intestine', w:['Stomach','Large intestine'],  fact:'Villi/microvilli in small intestine absorb nutrients' },
        { q:'Transpiration: water lost from?',a:'Leaves (stomata)',w:['Roots','Stems'],        fact:'Stomata open → water vapour escapes (transpiration)' }
    ];
    
    const QA = g <= 6 ? QA_G6 : QA_G7;
    
    // Translate all QA content
    const translatedQA = [];
    for (const q of QA) {
        const textsToTranslate = [q.q, q.a, ...q.w, q.fact];
        const translated = await translateTexts(textsToTranslate);
        const wrongCount = q.w.length;
        translatedQA.push({
            q: translated[0],
            a: translated[1],
            w: translated.slice(2, 2 + wrongCount),
            fact: translated[2 + wrongCount]
        });
    }

    let localScore = 0, lives = 3, gameTime = 75 + (g - 6) * 5, isOver = false, animId;
    let wave = 1, combo = 0;
    let pathogens = [], antibodies = [], particles = [], factBanners = [];
    let cell = { x: 58, y: canvas.height / 2, r: 28 };

    function spawnPathogens() {
        if (isOver) return;
        const qa   = translatedQA[~~(Math.random() * translatedQA.length)];
        const opts = [qa.a, ...qa.w].sort(() => Math.random() - 0.5);
        const spread = (canvas.height - 80) / opts.length;
        opts.forEach((opt, i) => {
            pathogens.push({
                x: canvas.width + 20,
                y: 58 + i * spread + spread / 2,
                r: 32, spd: 1.2 + wave * 0.15,
                label: opt, ok: opt === qa.a,
                q: qa.q, fact: qa.fact,
                col:  ['#FF2D9B','#E7223A','#FF6B00','#8B00E8'][i % 4],
                icon: ['🦠','🧫','💀','🔴'][i % 4],
                wobble: Math.random() * Math.PI * 2
            });
        });
    }

    function fireAntibody() {
        antibodies.push({ x: cell.x + cell.r, y: cell.y, r: 8, spd: 8, col: '#00F5A0' });
    }

    function burst(x, y, col, n = 16) {
        for (let i = 0; i < n; i++) {
            particles.push({ x, y, vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8, r: Math.random()*4+2, life:1, col });
        }
    }

    function draw() {
        const gr = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gr.addColorStop(0, '#001a0a'); gr.addColorStop(1, '#0a0020');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 4; i++) {
            ctx.save(); ctx.globalAlpha = 0.03; ctx.fillStyle = '#00F5A0';
            ctx.beginPath(); ctx.arc(100 + i*150, 80 + Math.sin(Date.now()*.001+i)*30, 60, 0, Math.PI*2); ctx.fill();
            ctx.restore();
        }

        ctx.save();
        ctx.shadowBlur = 20; ctx.shadowColor = '#00F5A0';
        ctx.strokeStyle = '#00F5A0'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cell.x, cell.y, cell.r + 6, 0, Math.PI * 2); ctx.stroke();
        const cg = ctx.createRadialGradient(cell.x, cell.y, 2, cell.x, cell.y, cell.r);
        cg.addColorStop(0, '#00F5A033'); cg.addColorStop(1, '#00F5A011');
        ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cell.x, cell.y, cell.r, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#00C3FF33'; ctx.strokeStyle = '#00C3FF'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cell.x, cell.y, cell.r * 0.45, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
        ctx.font = '9px Outfit'; ctx.fillStyle = '#00F5A0'; ctx.textAlign = 'center';
        ctx.fillText('WBC', cell.x, cell.y + cell.r + 14);

        pathogens.forEach(p => {
            p.wobble += 0.05;
            const wy = Math.sin(p.wobble) * 3;
            ctx.save();
            ctx.shadowBlur = 16; ctx.shadowColor = p.col;
            ctx.fillStyle   = p.col + '44'; ctx.strokeStyle = p.col; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(p.x, p.y + wy, p.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.font = '18px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(p.icon, p.x, p.y + wy - 6);
            ctx.font = 'bold 10px Outfit'; ctx.fillStyle = '#fff'; ctx.textBaseline = 'bottom';
            ctx.fillText(p.label, p.x, p.y + wy + p.r + 2);
            ctx.restore();
        });

        antibodies.forEach(a => {
            ctx.save(); ctx.fillStyle = a.col; ctx.shadowBlur = 12; ctx.shadowColor = a.col;
            ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI*2); ctx.fill(); ctx.restore();
        });

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = p.col;
            ctx.shadowBlur = 8; ctx.shadowColor = p.col;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
            p.x += p.vx; p.y += p.vy; p.life -= 0.025;
            if (p.life <= 0) particles.splice(i, 1);
            ctx.restore();
        }

        factBanners = factBanners.filter(f => f.life > 0);
        factBanners.forEach(f => {
            f.life -= 0.012;
            ctx.save(); ctx.globalAlpha = Math.min(1, f.life);
            ctx.fillStyle = 'rgba(0,20,10,.8)';
            ctx.beginPath(); ctx.roundRect(canvas.width - 234, canvas.height - 52, 222, 34, 8); ctx.fill();
            ctx.font = '9px Outfit'; ctx.fillStyle = '#00F5A0'; ctx.textAlign = 'center';
            ctx.fillText('💡 ' + f.text.slice(0, 42), canvas.width - 123, canvas.height - 30);
            ctx.restore();
        });

        if (pathogens.length > 0) {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.beginPath(); ctx.roundRect(80, 6, canvas.width - 160, 30, 8); ctx.fill();
            ctx.font = 'bold 11px Outfit'; ctx.fillStyle = '#FFD700';
            ctx.textAlign = 'center'; ctx.fillText('❓ ' + pathogens[0].q, canvas.width/2, 26);
            ctx.restore();
        }

        ctx.font = '16px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        let h = '';
        for (let i = 0; i < 3; i++) h += i < lives ? '❤️ ' : '🖤 ';
        ctx.fillText(h, 10, canvas.height - 10);
        ctx.font = 'bold 10px Outfit'; ctx.fillStyle = 'rgba(255,215,0,.5)'; ctx.textAlign = 'right';
        ctx.fillText('Wave ' + wave, canvas.width - 10, canvas.height - 10);
    }

    function update() {
        for (let ai = antibodies.length - 1; ai >= 0; ai--) {
            const a = antibodies[ai];
            a.x += a.spd;
            for (let pi = pathogens.length - 1; pi >= 0; pi--) {
                const p = pathogens[pi];
                const dx = a.x - p.x, dy = a.y - p.y;
                if (Math.sqrt(dx*dx + dy*dy) < a.r + p.r) {
                    if (p.ok) {
                        combo++;
                        const pts = 15 + combo * 5;
                        localScore += pts; score = localScore;
                        burst(p.x, p.y, '#00F5A0');
                        showFloatingText('+' + pts, p.x, p.y - 20, '#00F5A0');
                        factBanners.push({ text: p.fact, life: 3.5 });
                        updateHUD(localScore);
                        updateCombo(Math.min(combo, 9));
                    } else {
                        combo = 0;
                        burst(p.x, p.y, '#FF2D9B', 8);
                    }
                    pathogens.splice(pi, 1);
                    antibodies.splice(ai, 1);
                    break;
                }
            }
            if (ai < antibodies.length && antibodies[ai] && antibodies[ai].x > canvas.width) {
                antibodies.splice(ai, 1);
            }
        }
        for (let pi = pathogens.length - 1; pi >= 0; pi--) {
            const p = pathogens[pi];
            p.x -= p.spd;
            if (p.x + p.r < cell.x + cell.r + 8) {
                lives--;
                updateHealth(Math.max(0, (lives / 3) * 100));
                burst(cell.x, cell.y, '#FF2D9B');
                pathogens.splice(pi, 1);
            }
        }
    }

    let keys = {};
    document.addEventListener('keydown', e => {
        keys[e.key] = true;
        if (e.code === 'Space') { fireAntibody(); e.preventDefault(); }
    });
    document.addEventListener('keyup', e => { keys[e.key] = false; });
    canvas.addEventListener('click',      fireAntibody);
    canvas.addEventListener('touchstart', fireAntibody, { passive: true });

    function moveCell() {
        if (keys['ArrowUp']   && cell.y > cell.r + 50)                     cell.y -= 5;
        if (keys['ArrowDown'] && cell.y < canvas.height - cell.r)           cell.y += 5;
        if (!isOver) requestAnimationFrame(moveCell);
    }

    function loop() {
        if (isOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(); update();
        animId = requestAnimationFrame(loop);
    }

    function end() {
        isOver = true;
        clearInterval(spawnInterval);
        clearInterval(timerInterval);
        cancelAnimationFrame(animId);
        score = localScore;
        finishMission(Math.min(100, ~~((localScore / 300) * 100)), 0);
    }

    spawnInterval = setInterval(spawnPathogens, 3500);
    timerInterval = setInterval(() => {
        gameTime--; updateTimer(gameTime);
        if (gameTime % 20 === 0 && gameTime > 0) wave++;
        if (gameTime <= 0 || lives <= 0) end();
    }, 1000);
    spawnPathogens(); moveCell(); loop(); updateTimer(gameTime);
}

/* ================================================================
   BIO DNA (Grades 8-9)
   ================================================================ */

async function bioDNA(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const PAIRS_G8 = [
        { template:'A', correct:'T', wrong:['G','C','A'], fact:'Adenine pairs with Thymine (2 hydrogen bonds)' },
        { template:'T', correct:'A', wrong:['G','C','T'], fact:'Thymine pairs with Adenine (2 hydrogen bonds)' },
        { template:'G', correct:'C', wrong:['A','T','G'], fact:'Guanine pairs with Cytosine (3 hydrogen bonds)' },
        { template:'C', correct:'G', wrong:['A','T','C'], fact:'Cytosine pairs with Guanine (3 hydrogen bonds)' }
    ];
    
    const PAIRS_G9 = [
        ...PAIRS_G8,
        { template:'A (DNA→RNA)', correct:'U', wrong:['T','G','C'], fact:'In RNA transcription: DNA Adenine → RNA Uracil' },
        { template:'T (DNA→RNA)', correct:'A', wrong:['U','G','C'], fact:'In RNA transcription: DNA Thymine → RNA Adenine' },
        { template:'G (DNA→RNA)', correct:'C', wrong:['A','U','T'], fact:'In RNA transcription: DNA Guanine → RNA Cytosine' },
        { template:'C (DNA→RNA)', correct:'G', wrong:['A','U','T'], fact:'In RNA transcription: DNA Cytosine → RNA Guanine' }
    ];
    
    const PAIRS = g <= 8 ? PAIRS_G8 : PAIRS_G9;
    
    // Translate facts only (bases are symbols, not translated)
    const translatedPairs = [];
    for (const p of PAIRS) {
        const translatedFact = await translateTexts([p.fact]);
        translatedPairs.push({
            ...p,
            fact: translatedFact[0]
        });
    }

    const BASE_COLS = { A:'#FF5050', T:'#00C3FF', G:'#FFD700', C:'#00F5A0', U:'#FF2D9B' };

    let localScore = 0, lives = 3, gameTime = 90 + (g - 8) * 10, isOver = false, animId;
    let pairsBuilt = 0, totalPairs = 12, qIdx = 0, currentPair = null;
    let fallingBases = [], particles = [], helix = [];
    let collector = { x: canvas.width / 2 - 36, y: canvas.height - 36, w: 72, h: 20, speed: 8 };

    function spawnBases() {
        if (isOver) return;
        currentPair = translatedPairs[qIdx % translatedPairs.length];
        qIdx++;
        const allBases = [currentPair.correct, ...currentPair.wrong.slice(0, 3)];
        const shuffled  = allBases.sort(() => Math.random() - 0.5);
        const slotW     = (canvas.width - 40) / 4;
        shuffled.forEach((base, i) => {
            fallingBases.push({
                x:    20 + i * slotW + slotW / 2,
                y:    -30,
                r:    22,
                base,
                ok:   base === currentPair.correct,
                spd:  2.5 + (g - 8) * 0.5 + pairsBuilt * 0.08,
                col:  BASE_COLS[base] || '#9B8FC0',
                wobble: Math.random() * Math.PI * 2
            });
        });
    }

    function burst(x, y, col, n = 18) {
        for (let i = 0; i < n; i++) {
            particles.push({ x, y, vx: (Math.random()-0.5)*9, vy: (Math.random()-0.5)*9, r: Math.random()*4+2, life: 1, col });
        }
    }

    function addToHelix(base, col) {
        helix.push({ base, col, x: 80 + (pairsBuilt % 6) * 95, y: canvas.height - 80 - ~~(pairsBuilt / 6) * 30 });
        pairsBuilt++;
        if (pairsBuilt >= totalPairs) { setTimeout(end, 800); }
    }

    function draw() {
        const gr = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gr.addColorStop(0, '#000a14'); gr.addColorStop(1, '#000520');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save(); ctx.strokeStyle = 'rgba(0,195,255,0.1)'; ctx.lineWidth = 1.5;
        for (let y = 0; y < canvas.height; y += 4) {
            const x1 = canvas.width * 0.05 + Math.sin(y * 0.04) * 15;
            const x2 = canvas.width * 0.95 + Math.cos(y * 0.04) * 15;
            ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
        }
        ctx.restore();

        if (currentPair) {
            const templateDisplay = currentPair.template.includes('DNA→RNA') ? 
                currentPair.template : 'Template strand: ' + currentPair.template + ' → ?';
            ctx.save();
            ctx.fillStyle   = 'rgba(0,0,0,0.7)';
            ctx.strokeStyle = 'rgba(255,215,0,0.3)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(canvas.width/2 - 200, 8, 400, 44, 10); ctx.fill(); ctx.stroke();
            ctx.font      = 'bold 13px Outfit'; ctx.fillStyle = '#FFD700';
            ctx.textAlign = 'center';
            ctx.fillText(templateDisplay, canvas.width/2, 26);
            ctx.font      = '9px Outfit'; ctx.fillStyle = '#9B8FC0';
            ctx.fillText('Catch the correct complementary base!', canvas.width/2, 42);
            ctx.restore();
        }

        fallingBases.forEach(b => {
            b.wobble += 0.03; b.y += b.spd;
            ctx.save();
            ctx.shadowBlur  = 14; ctx.shadowColor = b.col;
            ctx.fillStyle   = b.col + '33'; ctx.strokeStyle = b.col; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.font      = 'bold 14px "Courier New"';
            ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(b.base, b.x, b.y);
            ctx.restore();
        });

        ctx.save();
        const cg = ctx.createLinearGradient(collector.x, 0, collector.x + collector.w, 0);
        cg.addColorStop(0,   '#00F5A0');
        cg.addColorStop(0.5, '#00C3FF');
        cg.addColorStop(1,   '#00F5A0');
        ctx.fillStyle   = cg;
        ctx.shadowBlur  = 18; ctx.shadowColor = '#00F5A0';
        ctx.beginPath(); ctx.roundRect(collector.x, collector.y, collector.w, collector.h, 8); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath(); ctx.roundRect(10, canvas.height - 98, canvas.width - 20, 56, 8); ctx.fill();
        helix.forEach((pair, i) => {
            const hx = 20 + i * ((canvas.width - 40) / totalPairs);
            ctx.shadowBlur  = 6; ctx.shadowColor = pair.col;
            ctx.fillStyle   = pair.col;
            ctx.beginPath(); ctx.arc(hx, canvas.height - 70, 8, 0, Math.PI*2); ctx.fill();
            ctx.font      = 'bold 7px monospace'; ctx.fillStyle = '#000';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowBlur = 0;
            ctx.fillText(pair.base, hx, canvas.height - 70);
        });
        ctx.restore();

        ctx.font = 'bold 11px Outfit'; ctx.fillStyle = '#00F5A0'; ctx.textAlign = 'right';
        ctx.fillText(`Pairs: ${pairsBuilt}/${totalPairs}`, canvas.width - 10, canvas.height - 110);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = p.col;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
            p.x += p.vx; p.y += p.vy; p.life -= 0.025;
            if (p.life <= 0) particles.splice(i, 1);
            ctx.restore();
        }

        ctx.font = '16px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        let h = '';
        for (let i = 0; i < 3; i++) h += i < lives ? '❤️ ' : '🖤 ';
        ctx.fillText(h, 10, canvas.height - 10);
    }

    function update() {
        for (let bi = fallingBases.length - 1; bi >= 0; bi--) {
            const b = fallingBases[bi];
            if (b.y + b.r >= collector.y && b.y - b.r <= collector.y + collector.h &&
                b.x >= collector.x && b.x <= collector.x + collector.w) {
                if (b.ok) {
                    localScore += 20; score = localScore;
                    updateHUD(localScore);
                    updateProgress(Math.min(100, ~~((pairsBuilt / totalPairs) * 100)));
                    burst(b.x, collector.y, b.col);
                    showFloatingText('+20 ✓', b.x, collector.y - 20, b.col);
                    showFloatingText('💡 ' + currentPair.fact, canvas.width/2, 60, '#00C3FF');
                    addToHelix(b.base, b.col);
                    fallingBases.splice(0, fallingBases.length);
                    setTimeout(spawnBases, 600);
                    break;
                } else {
                    lives--;
                    updateHealth(Math.max(0, (lives / 3) * 100));
                    shakeCanvas(canvas);
                    showFloatingText('🧬 MUTATION! Wrong base!', canvas.width/2, collector.y - 30, '#FF2D9B');
                    fallingBases.splice(bi, 1);
                }
                continue;
            }
            if (b.y - b.r > canvas.height) {
                if (b.ok) {
                    showFloatingText('Missed!', b.x, canvas.height - 20, '#FF2D9B');
                }
                fallingBases.splice(bi, 1);
                if (fallingBases.length === 0) spawnBases();
            }
        }
    }

    let keys = {};
    document.addEventListener('keydown', e => {
        keys[e.key] = true;
        ['ArrowLeft','ArrowRight'].includes(e.key) && e.preventDefault();
    });
    document.addEventListener('keyup', e => { keys[e.key] = false; });
    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        const { x } = gpos(canvas, e.touches[0]);
        collector.x = Math.max(0, Math.min(canvas.width - collector.w, x - collector.w / 2));
    }, { passive: false });

    function handleInput() {
        if (keys['ArrowLeft'])  collector.x = Math.max(0, collector.x - collector.speed);
        if (keys['ArrowRight']) collector.x = Math.min(canvas.width - collector.w, collector.x + collector.speed);
        if (!isOver) requestAnimationFrame(handleInput);
    }

    function loop() {
        if (isOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(); update();
        animId = requestAnimationFrame(loop);
    }

    function end() {
        isOver = true;
        clearInterval(timerInterval);
        cancelAnimationFrame(animId);
        score = localScore;
        finishMission(Math.min(100, ~~((localScore / (totalPairs * 20)) * 100)), 0);
    }

    timerInterval = setInterval(() => { gameTime--; updateTimer(gameTime); if (gameTime <= 0 || lives <= 0) end(); }, 1000);
    updateTimer(gameTime);
    spawnBases(); handleInput(); loop();
}

/* ================================================================
   MATHS NINJA (Grades 6-7)
   ================================================================ */

async function mathsNinja(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const BANKS = {
        6: [
            () => { const a=~~(Math.random()*12)+2, b=~~(Math.random()*12)+2;       
                return { q:`${a} × ${b} = ?`, ans:a*b, qText:'Multiplication', ansText:`${a} × ${b} = ?` }; },
            () => { const a=~~(Math.random()*50)+20, b=~~(Math.random()*20)+5;      
                return { q:`${a} + ${b} = ?`, ans:a+b, qText:'Addition', ansText:`${a} + ${b} = ?` }; },
            () => { const a=~~(Math.random()*60)+30, b=~~(Math.random()*20)+5;      
                return { q:`${a} − ${b} = ?`, ans:a-b, qText:'Subtraction', ansText:`${a} − ${b} = ?` }; },
            () => { const b=[2,3,4,5,6,10][~~(Math.random()*6)],a=b*(~~(Math.random()*12)+2); 
                return { q:`${a} ÷ ${b} = ?`, ans:a/b, qText:'Division', ansText:`${a} ÷ ${b} = ?` }; },
            () => { const a=~~(Math.random()*40)+10, p=~~(Math.random()*8)+2; 
                return { q:`${p}% of ${a} = ?`, ans:Math.round(a*p/100), qText:'Percentage', ansText:`${p}% of ${a} = ?` }; }
        ],
        7: [
            () => { const a=~~(Math.random()*8)+2, b=~~(Math.random()*8)+1; 
                return { q:`${a}x + ${b} = ${a*3+b}. x=?`, ans:3, qText:'Algebra', ansText:`${a}x + ${b} = ${a*3+b}` }; },
            () => { const a=~~(Math.random()*10)+2, b=~~(Math.random()*5)+1; 
                return { q:`${a}² + ${b} = ?`, ans:a*a+b, qText:'Square', ansText:`${a}² + ${b} = ?` }; },
            () => { const n=[4,9,16,25,36,49,64,81][~~(Math.random()*8)]; 
                return { q:`√${n} = ?`, ans:Math.sqrt(n), qText:'Square Root', ansText:`√${n} = ?` }; },
            () => { const a=~~(Math.random()*12)+2, b=~~(Math.random()*12)+2, c=~~(Math.random()*6)+1; 
                return { q:`${a}×${b}−${c}=?`, ans:a*b-c, qText:'Mixed', ansText:`${a}×${b}−${c}=?` }; },
            () => { const d=[2,4,5,10][~~(Math.random()*4)], n=~~(Math.random()*(d-1))+1; 
                return { q:`${n}/${d} of 120=?`, ans:Math.round(n/d*120), qText:'Fraction', ansText:`${n}/${d} of 120=?` }; }
        ]
    };
    const bank = BANKS[g] || BANKS[6];

    let localScore = 0, lives = 3, gameTime = 70, isOver = false, animId;
    let combo = 0, streak = 0;
    let bubbles = [], slashes = [], particles = [], currentQ = null;

    function genQ() {
        const fn  = bank[~~(Math.random() * bank.length)];
        const q   = fn();
        const off1 = ~~(Math.random() * 5) + 1;
        const off2 = ~~(Math.random() * 8) + 3;
        const w1   = Math.round(q.ans + (Math.random() > 0.5 ? off1 : -off1));
        const w2   = Math.round(Math.max(0, q.ans + (Math.random() > 0.5 ? off2 : -off2)));
        const vals = [...new Set([Math.round(q.ans), w1, w2])];
        while (vals.length < 3) vals.push(Math.round(q.ans) + vals.length * 7);
        const shuffled = vals.slice(0, 3).sort(() => Math.random() - 0.5);
        currentQ = q;
        const cols = ['#FF2D9B','#00C3FF','#FFD700','#00F5A0'];
        bubbles = [];
        shuffled.forEach((val, i) => {
            bubbles.push({
                x: 80 + Math.random() * (canvas.width - 160),
                y: canvas.height + 60 + i * 40,
                r: 40, vy: -(1.2 + (g - 6) * 0.3),
                val, ok: val === Math.round(q.ans),
                col: cols[i % cols.length],
                wobble: Math.random() * Math.PI * 2,
                scale: 1, popped: false
            });
        });
    }

    function slash(x, y) {
        slashes.push({ x, y, life: 1 });
        bubbles.forEach(b => {
            if (b.popped) return;
            const dx = x - b.x, dy = y - b.y;
            if (Math.sqrt(dx*dx + dy*dy) < b.r + 12) {
                b.popped = true;
                if (b.ok) {
                    combo++; streak++;
                    localScore += 10 + combo * 3; score = localScore;
                    burst(b.x, b.y, b.col);
                    showFloatingText('✓ +' + (10 + combo * 3), b.x, b.y - 20, '#00F5A0');
                    updateHUD(localScore); updateCombo(Math.min(combo, 9));
                    updateProgress(Math.min(100, ~~((localScore / 350) * 100)));
                    setTimeout(genQ, 550);
                } else {
                    lives--; combo = 0; streak = 0;
                    burst(b.x, b.y, '#FF2D9B', 10);
                    shakeCanvas(canvas);
                    showFloatingText('✗ Wrong!', b.x, b.y - 20, '#FF2D9B');
                    updateHealth(Math.max(0, (lives / 3) * 100));
                }
            }
        });
    }

    function burst(x, y, col, n = 20) {
        for (let i = 0; i < n; i++) {
            particles.push({ x, y, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, r: Math.random()*5+2, life:1, col });
        }
    }

    function draw() {
        const gr = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gr.addColorStop(0, '#0a001a'); gr.addColorStop(1, '#001a2a');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, canvas.width, canvas.height);

        const syms = ['+','−','×','÷','=','²','√','π','%'];
        ctx.save(); ctx.globalAlpha = 0.04; ctx.fillStyle = '#FFD700'; ctx.font = '26px serif';
        for (let i = 0; i < 14; i++) {
            ctx.fillText(syms[i % syms.length], 30 + i*48, 50 + Math.sin(Date.now()*0.001+i)*18);
            ctx.fillText(syms[(i+3) % syms.length], 20 + i*48, canvas.height - 28 + Math.cos(Date.now()*0.001+i)*14);
        }
        ctx.restore();

        if (currentQ) {
            ctx.save();
            ctx.fillStyle   = 'rgba(255,215,0,.08)'; ctx.strokeStyle = 'rgba(255,215,0,.35)'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.roundRect(canvas.width/2 - 170, 10, 340, 56, 12); ctx.fill(); ctx.stroke();
            ctx.font      = 'bold 22px "Courier New"'; ctx.fillStyle = '#FFD700';
            ctx.textAlign = 'center'; ctx.shadowBlur = 10; ctx.shadowColor = '#FFD700';
            ctx.fillText(currentQ.q, canvas.width/2, 48); ctx.shadowBlur = 0;
            ctx.restore();
        }

        bubbles.forEach(b => {
            if (b.popped) b.scale *= 1.15;
            b.wobble += 0.04; b.y += b.vy; b.x += Math.sin(b.wobble) * 0.4;
            ctx.save(); ctx.translate(b.x, b.y); ctx.scale(b.scale, b.scale);
            ctx.shadowBlur = 18; ctx.shadowColor = b.col;
            const bg = ctx.createRadialGradient(-b.r*.3,-b.r*.3,b.r*.1,0,0,b.r);
            bg.addColorStop(0, b.col + '55'); bg.addColorStop(0.7, b.col + '22'); bg.addColorStop(1, b.col + '00');
            ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = b.col; ctx.lineWidth = 2.5; ctx.globalAlpha = b.popped ? 0.3 : 0.9;
            ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI*2); ctx.stroke();
            ctx.globalAlpha = b.popped ? 0.2 : 1;
            ctx.fillStyle = '#fff'; ctx.font = 'bold 18px "Courier New"';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowBlur = 0;
            ctx.fillText(b.val, 0, 0);
            ctx.restore();
        });
        for (let i = bubbles.length - 1; i >= 0; i--) {
            if (bubbles[i].y < -80 || (bubbles[i].popped && bubbles[i].scale > 2.5)) bubbles.splice(i, 1);
        }

        slashes.forEach((s, i) => {
            s.life -= 0.06;
            if (s.life <= 0) { slashes.splice(i, 1); return; }
            ctx.save(); ctx.globalAlpha = s.life;
            ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 3 * s.life; ctx.shadowBlur = 12; ctx.shadowColor = '#FFD700';
            ctx.beginPath(); ctx.moveTo(s.x-18, s.y-18); ctx.lineTo(s.x+18, s.y+18);
            ctx.moveTo(s.x+18, s.y-18); ctx.lineTo(s.x-18, s.y+18); ctx.stroke();
            ctx.restore();
        });

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = p.col; ctx.shadowBlur = 6; ctx.shadowColor = p.col;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
            p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.025;
            if (p.life <= 0) particles.splice(i, 1);
            ctx.restore();
        }

        ctx.font = '36px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('🥷', 50, canvas.height - 42 + Math.sin(Date.now() * 0.008) * 5);

        ctx.font = '15px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        let h = '';
        for (let i = 0; i < 3; i++) h += i < lives ? '❤️ ' : '🖤 ';
        ctx.fillText(h, 10, canvas.height - 10);
        ctx.font = 'bold 11px Outfit'; ctx.fillStyle = 'rgba(255,215,0,.6)'; ctx.textAlign = 'right';
        ctx.fillText('Streak ' + streak, canvas.width - 10, canvas.height - 10);
    }

    function onSlash(e) { const { x, y } = gpos(canvas, e); slash(x, y); }
    canvas.addEventListener('click',      onSlash);
    canvas.addEventListener('mousemove',  e => { if (e.buttons) onSlash(e); });
    canvas.addEventListener('touchstart', e => { onSlash(e.touches[0]); e.preventDefault(); }, { passive: false });

    function loop() {
        if (isOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        animId = requestAnimationFrame(loop);
    }

    function end() {
        isOver = true;
        clearInterval(timerInterval); cancelAnimationFrame(animId);
        score = localScore;
        finishMission(Math.min(100, ~~((localScore / 250) * 100)), 0);
    }

    timerInterval = setInterval(() => { gameTime--; updateTimer(gameTime); if (gameTime <= 0 || lives <= 0) end(); }, 1000);
    updateTimer(gameTime); genQ(); loop();
}

/* ================================================================
   MATHS LASER (Grade 8)
   ================================================================ */

async function mathsLaser(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const QUESTIONS = [
        { q:'Pythagoras: a=3 b=4. c=?',   opts:[5,7,6],        ans:0, fact:'c²=3²+4²=25 → c=5 (3-4-5 Pythagorean triple)' },
        { q:'Area of square side=8:',      opts:[64,16,32],     ans:0, fact:'Area=s²=8²=64 sq.units' },
        { q:'Angles in triangle sum to:',  opts:[180,360,90],   ans:0, fact:'Angle sum property: all triangles = 180°' },
        { q:'Volume of cube side=3:',      opts:[27,9,18],      ans:0, fact:'V=s³=3³=27 cubic units' },
        { q:'Perimeter of rectangle 5×3:', opts:[16,15,10],     ans:0, fact:'P=2(l+w)=2(5+3)=16 units' },
        { q:'Interior angle of regular hexagon:', opts:[120,60,135], ans:0, fact:'(n-2)×180/n = (6-2)×180/6 = 120°' }
    ];
    
    // Translate questions and facts
    const translatedQuestions = [];
    for (const q of QUESTIONS) {
        const textsToTranslate = [q.q, ...q.opts.map(String), q.fact];
        const translated = await translateTexts(textsToTranslate);
        translatedQuestions.push({
            q: translated[0],
            opts: translated.slice(1, 1 + q.opts.length).map(Number),
            ans: q.ans,
            fact: translated[translated.length - 1]
        });
    }

    let localScore = 0, lives = 3, gameTime = 85, isOver = false, animId;
    let qIdx = 0, currentQ = null, laserAngle = 0, particles = [], answered = false;
    let targets = [];

    function nextQ() {
        const raw   = translatedQuestions[qIdx % translatedQuestions.length];
        const correctVal   = raw.opts[raw.ans];
        const shuffledOpts = raw.opts.slice().sort(() => Math.random() - 0.5);
        const newAns       = shuffledOpts.indexOf(correctVal);
        currentQ  = { ...raw, opts: shuffledOpts, ans: newAns };
        qIdx++;
        answered = false;
        laserAngle = Math.PI + 0.5;

        const spacing = (canvas.width - 80) / currentQ.opts.length;
        targets = currentQ.opts.map((val, i) => ({
            x: 40 + i * spacing + spacing / 2,
            y: 80,
            r: 36,
            val,
            ok: i === currentQ.ans,
            col: ['#00C3FF','#FF2D9B','#FFD700'][i % 3],
            hit: false,
            hitAlpha: 0
        }));
    }

    function burst(x, y, col, n = 20) {
        for (let i = 0; i < n; i++) {
            particles.push({ x, y, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, r: Math.random()*5+2, life:1, col });
        }
    }

    function getLaserEndpoint() {
        const ox = canvas.width / 2, oy = canvas.height - 50;
        const dx = Math.cos(laserAngle), dy = Math.sin(laserAngle);
        const points = [{ x: ox, y: oy }];
        let cx = ox, cy = oy, cdx = dx, cdy = dy;
        for (let step = 0; step < 2; step++) {
            if (cdx === 0 && cdy === 0) break;
            let tMin = 99999;
            let nx = cx + cdx * tMin, ny = cy + cdy * tMin;

            if (cdx !== 0) {
                const t = cdx > 0 ? (canvas.width - cx) / cdx : -cx / cdx;
                if (t > 0 && t < tMin) { tMin = t; }
            }
            if (cdy !== 0) {
                const t = cdy < 0 ? -cy / cdy : (canvas.height - cy) / cdy;
                if (t > 0 && t < tMin) { tMin = t; }
            }
            nx = cx + cdx * tMin; ny = cy + cdy * tMin;
            points.push({ x: nx, y: ny });
            if (ny <= 0 || ny >= canvas.height) break;
            cdx = -cdx;
            cx = nx; cy = ny;
        }
        return points;
    }

    function draw() {
        const gr = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gr.addColorStop(0, '#020814'); gr.addColorStop(1, '#080020');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save(); ctx.strokeStyle = 'rgba(0,195,255,.03)'; ctx.lineWidth = 0.5;
        for (let x2 = 0; x2 < canvas.width; x2 += 35) { ctx.beginPath(); ctx.moveTo(x2,0); ctx.lineTo(x2,canvas.height); ctx.stroke(); }
        for (let y2 = 0; y2 < canvas.height; y2 += 35) { ctx.beginPath(); ctx.moveTo(0,y2); ctx.lineTo(canvas.width,y2); ctx.stroke(); }
        ctx.restore();

        if (currentQ) {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.strokeStyle = 'rgba(0,195,255,0.3)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(canvas.width/2-230, 8, 460, 36, 8); ctx.fill(); ctx.stroke();
            ctx.font = 'bold 13px Outfit'; ctx.fillStyle = '#00C3FF'; ctx.textAlign = 'center';
            ctx.fillText('🔦 ' + currentQ.q, canvas.width/2, 31); ctx.restore();
        }

        targets.forEach(t => {
            ctx.save();
            ctx.shadowBlur  = t.hit ? 30 : 14; ctx.shadowColor = t.col;
            ctx.fillStyle   = t.hit ? t.col + '88' : t.col + '33';
            ctx.strokeStyle = t.col; ctx.lineWidth = t.hit ? 3 : 2;
            ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.font = 'bold 16px "Courier New"'; ctx.fillStyle = '#fff';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(t.val, t.x, t.y);
            ctx.restore();
        });

        const pts = getLaserEndpoint();
        ctx.save();
        const laserGr = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[pts.length-1].x, pts[pts.length-1].y);
        laserGr.addColorStop(0, '#FF0080');
        laserGr.addColorStop(1, '#FF0080aa');
        ctx.strokeStyle = '#FF0080'; ctx.lineWidth = 3; ctx.shadowBlur = 16; ctx.shadowColor = '#FF0080';
        ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke(); ctx.restore();

        const ex = canvas.width / 2, ey = canvas.height - 50;
        ctx.save(); ctx.translate(ex, ey);
        ctx.shadowBlur = 20; ctx.shadowColor = '#FF0080';
        ctx.fillStyle  = '#300020'; ctx.strokeStyle = '#FF0080'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#FF0080'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(laserAngle)*22, Math.sin(laserAngle)*22); ctx.stroke();
        ctx.restore();

        ctx.font = '10px Outfit'; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.textAlign = 'center';
        ctx.fillText('← → keys or drag to aim | Click to FIRE', canvas.width/2, canvas.height - 18);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = p.col; ctx.shadowBlur = 8; ctx.shadowColor = p.col;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
            p.x += p.vx; p.y += p.vy; p.life -= 0.025;
            if (p.life <= 0) particles.splice(i, 1);
            ctx.restore();
        }

        ctx.font = '16px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        let h = '';
        for (let i = 0; i < 3; i++) h += i < lives ? '❤️ ' : '🖤 ';
        ctx.fillText(h, 10, canvas.height - 10);
    }

    function fire() {
        if (answered) return;
        const pts   = getLaserEndpoint();
        const endPt = pts[pts.length - 1];
        let hitAny  = false;
        targets.forEach(t => {
            const dx = endPt.x - t.x, dy = endPt.y - t.y;
            if (Math.sqrt(dx*dx + dy*dy) < t.r + 8) {
                hitAny = true; t.hit = true;
                if (t.ok) {
                    answered = true;
                    localScore += 25; score = localScore;
                    updateHUD(localScore); burst(t.x, t.y, t.col);
                    showFloatingText('🎯 Hit! +25', t.x, t.y, '#00F5A0');
                    showFloatingText('💡 ' + currentQ.fact, canvas.width/2, canvas.height/2, '#00C3FF');
                    updateProgress(Math.min(100, ~~((qIdx / translatedQuestions.length) * 100)));
                    setTimeout(nextQ, 1200);
                } else {
                    lives--;
                    updateHealth(Math.max(0, (lives/3)*100));
                    shakeCanvas(canvas);
                    showFloatingText('✗ Wrong target!', t.x, t.y, '#FF2D9B');
                    setTimeout(() => { t.hit = false; }, 600);
                }
            }
        });
        if (!hitAny) showFloatingText('Miss!', endPt.x, endPt.y, '#9B8FC0');
    }

    let keys = {};
    document.addEventListener('keydown', e => {
        keys[e.key] = true;
        ['ArrowLeft','ArrowRight'].includes(e.key) && e.preventDefault();
    });
    document.addEventListener('keyup', e => { keys[e.key] = false; });
    canvas.addEventListener('click', fire);
    canvas.addEventListener('touchstart', e => {
        const { x } = gpos(canvas, e.touches[0]);
        laserAngle = Math.atan2(-1, x - canvas.width/2) + (x < canvas.width/2 ? -0.3 : 0.3);
        fire();
    }, { passive: true });
    canvas.addEventListener('mousemove', e => {
        const { x, y } = gpos(canvas, e);
        laserAngle = Math.atan2(y - (canvas.height - 50), x - canvas.width/2);
    });

    function handleInput() {
        if (keys['ArrowLeft'])  laserAngle -= 0.04;
        if (keys['ArrowRight']) laserAngle += 0.04;
        if (!isOver) requestAnimationFrame(handleInput);
    }

    function loop() {
        if (isOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(); animId = requestAnimationFrame(loop);
    }

    function end() {
        isOver = true;
        clearInterval(timerInterval); cancelAnimationFrame(animId);
        score = localScore;
        finishMission(Math.min(100, ~~((localScore / (translatedQuestions.length * 25)) * 100)), 0);
    }

    timerInterval = setInterval(() => { gameTime--; updateTimer(gameTime); if (gameTime <= 0 || lives <= 0) end(); }, 1000);
    updateTimer(gameTime); nextQ(); handleInput(); loop();
}

/* ================================================================
   MATHS CANNON (Grade 9)
   ================================================================ */

async function mathsCannon(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const QUESTIONS = [
        { q:'Solve x²−5x+6=0. Roots:',       roots:[2,3], fact:'Factor: (x-2)(x-3)=0 → x=2 and x=3' },
        { q:'Solve x²−7x+12=0. Roots:',      roots:[3,4], fact:'Factor: (x-3)(x-4)=0 → x=3 and x=4' },
        { q:'Sum of roots of x²−5x+6=0:',    roots:[5],   single:true, fact:'Sum = -b/a = 5 (Vieta\'s formula)' },
        { q:'Product of roots of x²−5x+6=0:',roots:[6],   single:true, fact:'Product = c/a = 6 (Vieta\'s formula)' },
        { q:'Solve x²−9=0. Positive root:',  roots:[3],   single:true, fact:'x²=9 → x=±3; positive root=3' },
        { q:'Solve x²−8x+15=0. Roots:',      roots:[3,5], fact:'Factor: (x-3)(x-5)=0 → x=3 and x=5' }
    ];
    
    // Translate questions and facts
    const translatedQuestions = [];
    for (const q of QUESTIONS) {
        const textsToTranslate = [q.q, q.fact];
        const translated = await translateTexts(textsToTranslate);
        translatedQuestions.push({
            ...q,
            q: translated[0],
            fact: translated[1]
        });
    }

    let localScore = 0, lives = 3, gameTime = 90, isOver = false, animId;
    let qIdx = 0, currentQ = null, power = 1, maxPower = 8;
    let ball = null, targets = [], particles = [], answered = false;

    const HILL_X = 80, HILL_Y = canvas.height - 80, CANNON_ANGLE = -Math.PI / 3;

    function nextQ() {
        currentQ = translatedQuestions[qIdx % translatedQuestions.length]; qIdx++;
        answered = false; ball = null;
        targets = currentQ.roots.map((root, i) => ({
            x: HILL_X + root * 60,
            y: HILL_Y - 10,
            r: 28, val: root,
            col: ['#FFD700','#FF2D9B'][i],
            hit: false
        }));
    }

    function burst(x, y, col, n = 20) {
        for (let i = 0; i < n; i++) {
            particles.push({ x, y, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, r: Math.random()*4+2, life:1, col });
        }
    }

    function fireCannon() {
        if (answered || ball) return;
        const speed = 6 + power * 0.5;
        ball = {
            x: HILL_X + 20, y: HILL_Y - 20,
            vx: Math.cos(CANNON_ANGLE) * speed,
            vy: Math.sin(CANNON_ANGLE) * speed,
            r: 10, trail: [], col: '#FFD700'
        };
    }

    function draw() {
        const gr = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gr.addColorStop(0, '#0a0014'); gr.addColorStop(1, '#1a1040');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, canvas.width, canvas.height);

        const ggr = ctx.createLinearGradient(0, HILL_Y, 0, canvas.height);
        ggr.addColorStop(0, '#1a3020'); ggr.addColorStop(1, '#0a1810');
        ctx.fillStyle = ggr; ctx.fillRect(0, HILL_Y, canvas.width, canvas.height - HILL_Y);

        ctx.save(); ctx.fillStyle = '#2a4030'; ctx.shadowBlur = 10; ctx.shadowColor = '#00F5A0';
        ctx.beginPath(); ctx.arc(HILL_X, HILL_Y, 40, Math.PI, 0); ctx.fill(); ctx.restore();

        if (currentQ) {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.strokeStyle = 'rgba(255,215,0,0.3)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(10, 8, canvas.width - 20, 44, 8); ctx.fill(); ctx.stroke();
            ctx.font = 'bold 13px Outfit'; ctx.fillStyle = '#FFD700'; ctx.textAlign = 'center';
            ctx.fillText('💥 ' + currentQ.q, canvas.width/2, 26);
            ctx.font = '10px Outfit'; ctx.fillStyle = '#9B8FC0';
            ctx.fillText('Set power with ← → keys, then press SPACE or click to fire!', canvas.width/2, 42);
            ctx.restore();
        }

        targets.forEach(t => {
            ctx.save();
            ctx.shadowBlur = t.hit ? 30 : 12; ctx.shadowColor = t.col;
            ctx.fillStyle  = t.hit ? t.col + '88' : t.col + '44';
            ctx.strokeStyle = t.col; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.font = 'bold 16px "Courier New"'; ctx.fillStyle = '#fff';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(t.val, t.x, t.y);
            ctx.strokeStyle = t.col; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(t.x, t.y - t.r); ctx.lineTo(t.x, t.y - t.r - 20); ctx.stroke();
            ctx.fillStyle = t.col; ctx.beginPath(); ctx.moveTo(t.x, t.y - t.r - 20); ctx.lineTo(t.x + 12, t.y - t.r - 14); ctx.lineTo(t.x, t.y - t.r - 8); ctx.fill();
            ctx.restore();
        });

        ctx.save();
        ctx.translate(HILL_X, HILL_Y - 10); ctx.rotate(CANNON_ANGLE);
        ctx.fillStyle = '#00F5A0'; ctx.shadowBlur = 10; ctx.shadowColor = '#00F5A0';
        ctx.beginPath(); ctx.roundRect(-5, -6, 42, 12, 4); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle   = 'rgba(0,0,0,0.5)'; ctx.strokeStyle = 'rgba(255,215,0,0.3)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(10, canvas.height - 50, 200, 20, 4); ctx.fill(); ctx.stroke();
        const pmGr = ctx.createLinearGradient(10, 0, 210, 0);
        pmGr.addColorStop(0, '#00F5A0'); pmGr.addColorStop(1, '#FF2D9B');
        ctx.fillStyle = pmGr;
        ctx.beginPath(); ctx.roundRect(10, canvas.height - 50, (power / maxPower) * 200, 20, 4); ctx.fill();
        ctx.font = '10px Outfit'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
        ctx.fillText('POWER: ' + power, 110, canvas.height - 35);
        ctx.restore();

        if (ball) {
            ball.trail.forEach((p, i) => {
                ctx.save(); ctx.globalAlpha = (i / ball.trail.length) * 0.5;
                ctx.fillStyle = '#FFD700';
                ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill(); ctx.restore();
            });
            ctx.save(); ctx.fillStyle = '#FFD700'; ctx.shadowBlur = 14; ctx.shadowColor = '#FFD700';
            ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fill(); ctx.restore();
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = p.col;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
            p.x += p.vx; p.y += p.vy; p.life -= 0.025;
            if (p.life <= 0) particles.splice(i, 1);
            ctx.restore();
        }

        ctx.font = '16px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        let h = '';
        for (let i = 0; i < 3; i++) h += i < lives ? '❤️ ' : '🖤 ';
        ctx.fillText(h, 10, canvas.height - 10);
    }

    function update() {
        if (!ball) return;
        ball.trail.push({ x: ball.x, y: ball.y });
        if (ball.trail.length > 20) ball.trail.shift();

        ball.vx *= 0.995;
        ball.vy += 0.18;
        ball.x  += ball.vx;
        ball.y  += ball.vy;

        targets.forEach(t => {
            if (t.hit) return;
            const dx = ball.x - t.x, dy = ball.y - t.y;
            if (Math.sqrt(dx*dx + dy*dy) < ball.r + t.r) {
                t.hit = true;
                burst(t.x, t.y, t.col);
                showFloatingText('💥 Hit root ' + t.val + '! +20', t.x, t.y - 30, t.col);
                localScore += 20; score = localScore; updateHUD(localScore);
                ball = null;
                if (targets.every(tt => tt.hit)) {
                    answered = true;
                    showFloatingText('💡 ' + currentQ.fact, canvas.width/2, canvas.height/2, '#00C3FF');
                    updateProgress(Math.min(100, ~~((qIdx / translatedQuestions.length) * 100)));
                    setTimeout(nextQ, 1800);
                }
            }
        });

        if (ball && ball.y > HILL_Y + 10) {
            showFloatingText('Miss!', ball.x, ball.y, '#FF2D9B');
            ball = null;
        }
        if (ball && (ball.x > canvas.width + 20 || ball.x < -20)) { ball = null; }
    }

    let keys = {};
    document.addEventListener('keydown', e => {
        keys[e.key] = true;
        if (e.code === 'Space') { fireCannon(); e.preventDefault(); }
        if (e.key === 'ArrowLeft')  { power = Math.max(1, power - 1); e.preventDefault(); }
        if (e.key === 'ArrowRight') { power = Math.min(maxPower, power + 1); e.preventDefault(); }
    });
    document.addEventListener('keyup', e => { keys[e.key] = false; });
    canvas.addEventListener('click', e => {
        const { x } = gpos(canvas, e);
        power = Math.round(Math.max(1, Math.min(maxPower, (x / canvas.width) * maxPower)));
        fireCannon();
    });
    canvas.addEventListener('touchstart', e => {
        const { x } = gpos(canvas, e.touches[0]);
        power = Math.round(Math.max(1, Math.min(maxPower, (x / canvas.width) * maxPower)));
        fireCannon();
    }, { passive: true });

    function loop() {
        if (isOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(); update();
        animId = requestAnimationFrame(loop);
    }

    function end() {
        isOver = true;
        clearInterval(timerInterval); cancelAnimationFrame(animId);
        score = localScore;
        finishMission(Math.min(100, ~~((localScore / (translatedQuestions.length * 20)) * 100)), 0);
    }

    timerInterval = setInterval(() => { gameTime--; updateTimer(gameTime); if (gameTime <= 0 || lives <= 0) end(); }, 1000);
    updateTimer(gameTime); nextQ(); loop();
}

/* ================================================================
   PHYSICS MCQ (Grades 10-12) - Particle Collider
   ================================================================ */

async function physicsMCQ(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const BANKS = {
        10:[
            { q:"Snell's Law governs?",      correct:'Refraction',    wrong:['Reflection','Diffraction'],     fact:'n₁sinθ₁=n₂sinθ₂' },
            { q:'1 kWh in Joules?',          correct:'3.6×10⁶ J',    wrong:['3600 J','1000 J'],              fact:'1kWh=1000W×3600s=3.6MJ' },
            { q:'Magnetic force F=?',        correct:'qvBsinθ',       wrong:['qE','BIl'],                     fact:'Lorentz force: F=qvBsinθ' },
            { q:'Peak V from 220V rms?',     correct:'311 V',         wrong:['220 V','156 V'],                fact:'V_peak=V_rms×√2≈311V' },
            { q:'Photoelectric proves light=?', correct:'Particle',   wrong:['Pure wave','Magnetic field'],   fact:'Einstein: E=hf, light quanta' },
            { q:'Mirror f=20cm u=60cm v=?',  correct:'30 cm real',   wrong:['60 cm virtual','∞'],            fact:'1/v+1/u=1/f → v=30cm' },
        ],
        11:[
            { q:'First Law ΔU=?',            correct:'Q−W',           wrong:['Q+W','W−Q'],                   fact:'Energy conservation: ΔU=Q−W' },
            { q:'SHM acceleration a=?',      correct:'−ω²x',          wrong:['ω²x','kx/m'],                  fact:'Restoring: a=−ω²x' },
            { q:'Torque τ=?',                correct:'r×F',           wrong:['Fd/r','mr²α'],                 fact:'τ = r cross F' },
            { q:"Young's modulus = stress÷?", correct:'Strain',        wrong:['Force','Area'],                 fact:'E=σ/ε' },
            { q:'Bernoulli faster fluid→?',   correct:'Lower P',      wrong:['Higher P','Same P'],            fact:'P+½ρv²=const' },
            { q:'Adiabatic Q=?',             correct:'Zero',          wrong:['Max','Constant'],               fact:'Adiabatic: no heat exchange' },
        ],
        12:[
            { q:'De Broglie λ=?',            correct:'h/mv',          wrong:['h/mc²','hf'],                  fact:'λ=h/p wave-particle duality' },
            { q:"Einstein's E=?",            correct:'mc²',           wrong:['mv²','mgh'],                   fact:'Mass-energy equivalence' },
            { q:'Boron doped semiconductor?', correct:'p-type',       wrong:['n-type','intrinsic'],           fact:'Boron creates holes → p-type' },
            { q:'Highest binding E/nucleon?', correct:'Iron-56',      wrong:['Uranium-238','Hydrogen-1'],     fact:'Fe-56 peak ~8.8 MeV/nucleon' },
            { q:'NAND = NOT of?',            correct:'AND',           wrong:['OR','XOR'],                     fact:'NAND: 1,1→0; else→1' },
            { q:'Half-life ²³⁸U≈?',          correct:'4.5 Gyr',      wrong:['5730 yr','1620 yr'],            fact:'²³⁸U: 4.5×10⁹ yr' },
        ]
    };
    const bank = (BANKS[g] || BANKS[10]).slice();
    
    // Translate the bank
    const translatedBank = [];
    for (const q of bank) {
        const textsToTranslate = [q.q, q.correct, ...q.wrong, q.fact];
        const translated = await translateTexts(textsToTranslate);
        const wrongCount = q.wrong.length;
        translatedBank.push({
            q: translated[0],
            correct: translated[1],
            wrong: translated.slice(2, 2 + wrongCount),
            fact: translated[2 + wrongCount]
        });
    }

    const CX = canvas.width / 2, CY = canvas.height / 2 + 20;
    const RING_R = Math.min(canvas.width, canvas.height) * 0.36;

    let localScore = 0, lives = 3, gameTime = 80 + (g-10)*8;
    let isOver = false, animId;
    let particles = [], beams = [], sparks = [];
    let qIdx = 0, currentQ = null, shieldFlicker = 0;

    function spawnRound() {
        if (isOver) return;
        const raw  = translatedBank[qIdx % translatedBank.length]; qIdx++;
        currentQ   = raw;
        const all  = [raw.correct, ...raw.wrong].sort(() => Math.random()-0.5);
        const startAngle = Math.random() * Math.PI * 2;
        const speed      = (0.012 + (g-10)*0.004) * (Math.random()>0.5?1:-1);
        const cols       = ['#00C3FF','#FF2D9B','#FFD700'];
        particles = all.map((label, i) => ({
            angle: startAngle + i*(Math.PI*2/all.length),
            speed,
            label,
            ok: label === raw.correct,
            col: cols[i % cols.length],
            r: 28,
            pulse: Math.random()*Math.PI*2
        }));
    }

    function spawnSparks(x, y, col, n=20) {
        for (let i=0;i<n;i++) sparks.push({x,y,vx:(Math.random()-.5)*10,vy:(Math.random()-.5)*10,life:1,col,r:Math.random()*4+2});
    }

    function fireBeam(px, py, col) {
        beams.push({ x:CX, y:CY, tx:px, ty:py, life:1, col });
    }

    function draw() {
        const bg = ctx.createRadialGradient(CX,CY,20,CX,CY,canvas.width);
        bg.addColorStop(0,'#060820'); bg.addColorStop(1,'#020408');
        ctx.fillStyle = bg; ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.save();
        ctx.strokeStyle = 'rgba(0,195,255,0.15)'; ctx.lineWidth = 18;
        ctx.beginPath(); ctx.arc(CX,CY,RING_R,0,Math.PI*2); ctx.stroke();
        ctx.strokeStyle = 'rgba(0,195,255,0.4)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(CX,CY,RING_R,0,Math.PI*2); ctx.stroke();
        ctx.restore();

        const cg = ctx.createRadialGradient(CX,CY,4,CX,CY,28);
        cg.addColorStop(0,'#00C3FF'); cg.addColorStop(1,'transparent');
        ctx.save();
        ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(CX,CY,28,0,Math.PI*2); ctx.fill();
        if (shieldFlicker > 0) {
            ctx.globalAlpha = shieldFlicker*0.6;
            ctx.fillStyle = '#FF2D9B';
            ctx.beginPath(); ctx.arc(CX,CY,34,0,Math.PI*2); ctx.fill();
            shieldFlicker -= 0.05;
        }
        ctx.restore();

        if (currentQ) {
            ctx.save();
            ctx.fillStyle='rgba(0,0,0,0.75)'; ctx.strokeStyle='rgba(0,195,255,0.35)'; ctx.lineWidth=1;
            ctx.beginPath(); ctx.roundRect(CX-220,14,440,40,10); ctx.fill(); ctx.stroke();
            ctx.font='bold 14px Outfit'; ctx.fillStyle='#FFD700'; ctx.textAlign='center';
            ctx.shadowBlur=8; ctx.shadowColor='#FFD700';
            ctx.fillText('COLLIDE → '+currentQ.q, CX, 39); ctx.shadowBlur=0;
            ctx.restore();
        }

        particles.forEach(p => {
            p.angle += p.speed;
            p.pulse += 0.05;
            const px = CX + Math.cos(p.angle)*RING_R;
            const py = CY + Math.sin(p.angle)*RING_R;
            const glow = 0.7 + 0.3*Math.sin(p.pulse);

            ctx.save();
            ctx.globalAlpha = 0.3*glow;
            ctx.fillStyle = p.col;
            for (let t=1;t<=6;t++) {
                const ta = p.angle - p.speed*t*3;
                ctx.beginPath();
                ctx.arc(CX+Math.cos(ta)*RING_R, CY+Math.sin(ta)*RING_R, (7-t)*1.2, 0, Math.PI*2);
                ctx.fill();
            }
            ctx.globalAlpha=1;

            ctx.shadowBlur=20*glow; ctx.shadowColor=p.col;
            ctx.fillStyle=p.col+'44'; ctx.strokeStyle=p.col; ctx.lineWidth=2.5;
            ctx.beginPath(); ctx.arc(px,py,p.r,0,Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.shadowBlur=0;
            ctx.font='bold 9px Outfit'; ctx.fillStyle='#fff';
            ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText(p.label.slice(0,10), px, py);
            ctx.restore();
        });

        for (let i=beams.length-1;i>=0;i--) {
            const b=beams[i];
            ctx.save(); ctx.globalAlpha=b.life;
            ctx.strokeStyle=b.col; ctx.lineWidth=4*b.life; ctx.shadowBlur=20; ctx.shadowColor=b.col;
            ctx.beginPath(); ctx.moveTo(b.x,b.y); ctx.lineTo(b.tx,b.ty); ctx.stroke();
            ctx.restore(); b.life-=0.08;
            if(b.life<=0) beams.splice(i,1);
        }

        for (let i=sparks.length-1;i>=0;i--) {
            const s=sparks[i];
            ctx.save(); ctx.globalAlpha=s.life; ctx.fillStyle=s.col;
            ctx.shadowBlur=8; ctx.shadowColor=s.col;
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
            s.x+=s.vx; s.y+=s.vy; s.life-=0.03; s.r*=0.97;
            if(s.life<=0) sparks.splice(i,1);
            ctx.restore();
        }

        ctx.font='15px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
        let h=''; for(let i=0;i<3;i++) h+=i<lives?'❤️ ':'🖤 ';
        ctx.fillText(h, 10, canvas.height-10);
        ctx.font='bold 11px Outfit'; ctx.fillStyle='rgba(0,195,255,0.6)';
        ctx.textAlign='right'; ctx.fillText('Grade '+g+' Physics', canvas.width-10, canvas.height-10);
    }

    function handleTap(e) {
        if (!currentQ || isOver) return;
        const {x,y} = gpos(canvas,e);
        let hit = false;
        particles.forEach((p,i) => {
            const px = CX + Math.cos(p.angle)*RING_R;
            const py = CY + Math.sin(p.angle)*RING_R;
            const dx = x-px, dy = y-py;
            if (Math.sqrt(dx*dx+dy*dy) < p.r+14) {
                hit = true;
                if (p.ok) {
                    localScore+=30; score=localScore; updateHUD(localScore);
                    fireBeam(px,py,p.col);
                    spawnSparks(px,py,p.col,28);
                    showFloatingText('⚛️ Collide! +30', px, py-40, p.col);
                    showFloatingText('💡 '+currentQ.fact, CX, CY+RING_R+28, '#00C3FF');
                    updateProgress(Math.min(100,~~((qIdx/translatedBank.length)*100)));
                    particles=[];
                    setTimeout(spawnRound, 900);
                } else {
                    lives--; shieldFlicker=1;
                    updateHealth(Math.max(0,(lives/3)*100));
                    shakeCanvas(canvas);
                    spawnSparks(px,py,'#FF2D9B',16);
                    showFloatingText('✗ Wrong particle!', px, py-30, '#FF2D9B');
                    particles.splice(i,1);
                }
            }
        });
    }

    canvas.addEventListener('click', handleTap);
    canvas.addEventListener('touchstart', e=>{e.preventDefault(); handleTap(e.touches[0]);},{passive:false});

    function loop() {
        if(isOver) return;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        draw(); animId=requestAnimationFrame(loop);
    }
    function end() {
        isOver=true; clearInterval(timerInterval); cancelAnimationFrame(animId);
        score=localScore; finishMission(Math.min(100,~~((localScore/(translatedBank.length*30))*100)),0);
    }
    timerInterval=setInterval(()=>{gameTime--;updateTimer(gameTime);if(gameTime<=0||lives<=0)end();},1000);
    updateTimer(gameTime); spawnRound(); loop();
}

/* ================================================================
   CHEM MCQ / CHEM ADVANCED (Grades 10-12) - Molecule Forge
   ================================================================ */

function chemMCQ(g) { moleculeForge(g); }
function chemAdvanced(g) { moleculeForge(g); }

async function moleculeForge(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const PUZZLES = {
        10:[
            { name:'Ethanol (C₂H₅OH)', slots:[
                  {label:'C₂H₅−',x:0.38,y:0.42,needs:'Ethyl'},
                  {label:'−OH',  x:0.62,y:0.42,needs:'Hydroxyl'}
                ], pool:['Ethyl','Hydroxyl','Methyl','Carboxyl','Amino'], fact:'Alcohol = alkyl + −OH group' },
            { name:'Acetic Acid (CH₃COOH)', slots:[
                  {label:'CH₃−',x:0.35,y:0.42,needs:'Methyl'},
                  {label:'−COOH',x:0.62,y:0.42,needs:'Carboxyl'}
                ], pool:['Methyl','Carboxyl','Hydroxyl','Ethyl','Amino'], fact:'Carboxylic acid: alkyl + −COOH' },
            { name:'Methylamine (CH₃NH₂)', slots:[
                  {label:'CH₃−',x:0.35,y:0.42,needs:'Methyl'},
                  {label:'−NH₂',x:0.62,y:0.42,needs:'Amino'}
                ], pool:['Methyl','Amino','Hydroxyl','Carboxyl','Ethyl'], fact:'Amine: alkyl + −NH₂ group' },
        ],
        11:[
            { name:'Ethyl Ethanoate (Ester)', slots:[
                  {label:'CH₃−',x:0.3, y:0.4, needs:'Methyl'},
                  {label:'−COO−',x:0.52,y:0.4, needs:'EsterLink'},
                  {label:'−C₂H₅',x:0.72,y:0.4,needs:'Ethyl'}
                ], pool:['Methyl','EsterLink','Ethyl','Amino','Carboxyl','Hydroxyl'], fact:'Ester = acid + alcohol − water' },
            { name:'Glycine (Amino Acid)', slots:[
                  {label:'H₂N−',x:0.28,y:0.4,needs:'Amino'},
                  {label:'−CH₂−',x:0.5,y:0.4,needs:'Methylene'},
                  {label:'−COOH',x:0.72,y:0.4,needs:'Carboxyl'}
                ], pool:['Amino','Methylene','Carboxyl','Ethyl','Hydroxyl','Methyl'], fact:'Glycine: simplest amino acid' },
        ],
        12:[
            { name:'Chloroethane (Haloalkane)', slots:[
                  {label:'CH₃CH₂−',x:0.35,y:0.42,needs:'Ethyl'},
                  {label:'−Cl',    x:0.62,y:0.42,needs:'Chloro'}
                ], pool:['Ethyl','Chloro','Bromo','Amino','Hydroxyl','Methyl'], fact:'Haloalkane: alkyl + halogen' },
            { name:'Benzaldehyde', slots:[
                  {label:'C₆H₅−',x:0.35,y:0.42,needs:'Phenyl'},
                  {label:'−CHO',  x:0.62,y:0.42,needs:'Aldehyde'}
                ], pool:['Phenyl','Aldehyde','Ketone','Hydroxyl','Carboxyl','Methyl'], fact:'Benzaldehyde: phenyl + aldehyde group' },
        ]
    };
    const puzzleSet = PUZZLES[g] || PUZZLES[10];
    
    // Translate puzzle names and facts
    const translatedPuzzles = [];
    for (const p of puzzleSet) {
        const textsToTranslate = [p.name, p.fact];
        const translated = await translateTexts(textsToTranslate);
        
        // Translate slot labels
        const slotLabels = p.slots.map(s => s.label);
        const translatedSlotLabels = await translateTexts(slotLabels);
        
        // Translate pool items
        const translatedPool = await translateTexts(p.pool);
        
        translatedPuzzles.push({
            ...p,
            name: translated[0],
            fact: translated[1],
            slots: p.slots.map((s, i) => ({
                ...s,
                label: translatedSlotLabels[i]
            })),
            pool: translatedPool
        });
    }

    const TILE_W=80, TILE_H=36;
    let pIdx=0, currentP=null, tiles=[], slots=[], drag=null, dox=0, doy=0;
    let localScore=0, lives=3, gameTime=100+(g-10)*10, isOver=false, animId;
    let smoke=[], sparks=[], beltX=0;

    const GROUP_COLS={
        'Ethyl':'#00C3FF','Methyl':'#FFD700','Hydroxyl':'#00F5A0','Carboxyl':'#FF2D9B',
        'Amino':'#7CFC00','EsterLink':'#FF8C00','Methylene':'#9B8FC0','Chloro':'#50E0FF',
        'Bromo':'#FF6450','Phenyl':'#E050FF','Aldehyde':'#FFA040','Ketone':'#40A0FF'
    };

    function loadPuzzle() {
        if (pIdx>=translatedPuzzles.length){end();return;}
        currentP = translatedPuzzles[pIdx]; pIdx++;
        slots = currentP.slots.map(s=>({
            ...s,
            px: s.x*canvas.width, py: s.y*canvas.height,
            w:80, h:36, filled:null
        }));
        const pool = currentP.pool.slice().sort(()=>Math.random()-0.5);
        tiles = pool.map((name,i)=>({
            name, col:GROUP_COLS[name]||'#9B8FC0',
            x: 40+i*(TILE_W+12), y: canvas.height-55,
            ox:40+i*(TILE_W+12), oy:canvas.height-55,
            w:TILE_W, h:TILE_H, placed:false
        }));
        smoke=[]; sparks=[];
    }

    function spawnSmoke(x,y){
        for(let i=0;i<14;i++) smoke.push({x,y,vx:(Math.random()-.5)*3,vy:-(Math.random()*2+1),r:10+Math.random()*10,life:1});
    }
    function spawnSparks(x,y,col){
        for(let i=0;i<18;i++) sparks.push({x,y,vx:(Math.random()-.5)*9,vy:(Math.random()-.5)*9,r:3+Math.random()*3,life:1,col});
    }

    function tryDrop(tile) {
        let dropped=false;
        slots.forEach(s=>{
            if(s.filled) return;
            const dx=tile.x+tile.w/2-s.px, dy=tile.y+tile.h/2-s.py;
            if(Math.abs(dx)<52 && Math.abs(dy)<30) {
                if(tile.name===s.needs) {
                    s.filled=tile.name; tile.placed=true;
                    spawnSparks(s.px,s.py,tile.col);
                    showFloatingText('✓ '+tile.name, s.px, s.py-30, tile.col);
                    if(slots.every(sl=>sl.filled)) {
                        localScore+=40; score=localScore; updateHUD(localScore);
                        updateProgress(~~((pIdx/translatedPuzzles.length)*100));
                        showFloatingText('🧪 Molecule Built! +40', canvas.width/2, canvas.height/2-30, '#00F5A0');
                        showFloatingText('💡 '+currentP.fact, canvas.width/2, canvas.height/2+10, '#00C3FF');
                        setTimeout(loadPuzzle,1800);
                    }
                } else {
                    lives--; updateHealth(Math.max(0,(lives/3)*100));
                    spawnSmoke(s.px,s.py);
                    shakeCanvas(canvas);
                    showFloatingText('❌ Wrong group!', s.px, s.py-30, '#FF2D9B');
                }
                dropped=true;
            }
        });
        if(!dropped){ tile.x=tile.ox; tile.y=tile.oy; }
    }

    function draw(){
        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,'#0a0808'); bg.addColorStop(1,'#150c04');
        ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);

        beltX=(beltX+0.5)%40;
        ctx.save();
        ctx.fillStyle='rgba(80,60,40,0.8)';
        ctx.fillRect(0,canvas.height-70,canvas.width,70);
        ctx.strokeStyle='rgba(160,120,60,0.5)'; ctx.lineWidth=1.5;
        for(let x=-40+beltX;x<canvas.width;x+=40){
            ctx.beginPath(); ctx.moveTo(x,canvas.height-70); ctx.lineTo(x,canvas.height); ctx.stroke();
        }
        ctx.strokeStyle='rgba(200,160,80,0.4)'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.moveTo(0,canvas.height-70); ctx.lineTo(canvas.width,canvas.height-70); ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.strokeStyle='rgba(255,215,0,0.3)'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.roundRect(20,55,canvas.width-40,canvas.height-145,12); ctx.fill(); ctx.stroke();
        ctx.font='bold 13px Outfit'; ctx.fillStyle='#FFD700'; ctx.textAlign='center';
        ctx.shadowBlur=8; ctx.shadowColor='#FFD700';
        ctx.fillText('🧪 Build: '+currentP.name, canvas.width/2, 80); ctx.shadowBlur=0;
        if(slots.length>1){
            ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=3;
            ctx.beginPath();
            ctx.moveTo(slots[0].px+slots[0].w/2, slots[0].py);
            slots.slice(1).forEach(s=>ctx.lineTo(s.px+s.w/2,s.py));
            ctx.stroke();
        }
        ctx.restore();

        slots.forEach(s=>{
            const col=s.filled?(GROUP_COLS[s.filled]||'#9B8FC0'):'rgba(255,255,255,0.12)';
            ctx.save();
            ctx.fillStyle  =s.filled?col+'33':'rgba(255,255,255,0.06)';
            ctx.strokeStyle=s.filled?col:'rgba(255,255,255,0.25)';
            ctx.lineWidth  =s.filled?2.5:1.5;
            ctx.shadowBlur =s.filled?20:0; ctx.shadowColor=col;
            ctx.beginPath(); ctx.roundRect(s.px-40,s.py-18,80,36,8); ctx.fill(); ctx.stroke();
            ctx.font='bold 10px Outfit'; ctx.fillStyle=s.filled?col:'rgba(255,255,255,0.4)';
            ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.shadowBlur=0;
            ctx.fillText(s.filled||s.label, s.px, s.py);
            ctx.restore();
        });

        tiles.forEach(t=>{
            if(t.placed||t===drag) return;
            ctx.save();
            ctx.fillStyle=t.col+'33'; ctx.strokeStyle=t.col; ctx.lineWidth=1.8;
            ctx.shadowBlur=8; ctx.shadowColor=t.col;
            ctx.beginPath(); ctx.roundRect(t.x,t.y,t.w,t.h,8); ctx.fill(); ctx.stroke();
            ctx.font='bold 11px Outfit'; ctx.fillStyle='#fff';
            ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.shadowBlur=0;
            ctx.fillText(t.name, t.x+t.w/2, t.y+t.h/2);
            ctx.restore();
        });

        if(drag){
            ctx.save();
            ctx.fillStyle=drag.col+'55'; ctx.strokeStyle=drag.col; ctx.lineWidth=2.5;
            ctx.shadowBlur=22; ctx.shadowColor=drag.col;
            ctx.beginPath(); ctx.roundRect(drag.x,drag.y,drag.w,drag.h,8); ctx.fill(); ctx.stroke();
            ctx.font='bold 11px Outfit'; ctx.fillStyle='#fff';
            ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.shadowBlur=0;
            ctx.fillText(drag.name, drag.x+drag.w/2, drag.y+drag.h/2);
            ctx.restore();
        }

        for(let i=smoke.length-1;i>=0;i--){
            const s=smoke[i]; s.x+=s.vx; s.y+=s.vy; s.r*=1.03; s.life-=0.02;
            if(s.life<=0){smoke.splice(i,1);continue;}
            ctx.save(); ctx.globalAlpha=s.life*0.35; ctx.fillStyle='rgba(200,100,80,1)';
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore();
        }
        for(let i=sparks.length-1;i>=0;i--){
            const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.life-=0.03;
            if(s.life<=0){sparks.splice(i,1);continue;}
            ctx.save(); ctx.globalAlpha=s.life; ctx.fillStyle=s.col;
            ctx.shadowBlur=8; ctx.shadowColor=s.col;
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore();
        }

        ctx.save();
        ctx.fillStyle='rgba(0,0,0,0.75)'; ctx.beginPath();
        ctx.roundRect(0,0,canvas.width,50,0); ctx.fill();
        ctx.font='bold 12px Outfit'; ctx.fillStyle='#FF8C00'; ctx.textAlign='center';
        ctx.fillText('⚗️ MOLECULE FORGE — Grade '+g+' Chemistry', canvas.width/2, 32);
        ctx.restore();

        ctx.font='15px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
        let h=''; for(let i=0;i<3;i++) h+=i<lives?'❤️ ':'🖤 ';
        ctx.fillText(h, 10, canvas.height-10);
    }

    function onDown(e){
        const {x,y}=gpos(canvas,e);
        for(const t of tiles){
            if(!t.placed && x>=t.x && x<=t.x+t.w && y>=t.y && y<=t.y+t.h){
                drag=t; dox=x-t.x; doy=y-t.y; return;
            }
        }
    }
    function onMove(e){
        if(!drag) return;
        const {x,y}=gpos(canvas,e);
        drag.x=x-dox; drag.y=y-doy;
    }
    function onUp(e){
        if(!drag) return;
        tryDrop(drag);
        drag=null;
    }
    canvas.addEventListener('mousedown',onDown);
    canvas.addEventListener('mousemove',onMove);
    canvas.addEventListener('mouseup',onUp);
    canvas.addEventListener('touchstart',onDown,{passive:true});
    canvas.addEventListener('touchmove',e=>{onMove(e.touches[0]);e.preventDefault();},{passive:false});
    canvas.addEventListener('touchend',e=>{onUp(e.changedTouches[0]);});

    function loop(){
        if(isOver) return;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        draw(); animId=requestAnimationFrame(loop);
    }
    function end(){
        isOver=true; clearInterval(timerInterval); cancelAnimationFrame(animId);
        score=localScore; finishMission(Math.min(100,~~((localScore/(translatedPuzzles.length*40))*100)),0);
    }
    timerInterval=setInterval(()=>{gameTime--;updateTimer(gameTime);if(gameTime<=0||lives<=0)end();},1000);
    updateTimer(gameTime); loadPuzzle(); loop();
}

/* ================================================================
   BIO MCQ (Grades 10-12) - Ecosystem Architect
   ================================================================ */

function bioMCQ(g) { ecosystemArchitect(g); }

async function ecosystemArchitect(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const LAYERS = [
        { name:'Producers (Autotrophs)',    y:0.78, col:'#00C84A', hint:'Plants, algae, phytoplankton' },
        { name:'Primary Consumers',         y:0.58, col:'#FFD700', hint:'Herbivores' },
        { name:'Secondary Consumers',       y:0.38, col:'#FF8C00', hint:'Omnivores / small carnivores' },
        { name:'Apex Predators',            y:0.18, col:'#FF2D9B', hint:'Top carnivores' },
    ];
    
    // Translate layer hints
    const translatedLayerHints = await translateTexts(LAYERS.map(l => l.hint));
    const translatedLayers = LAYERS.map((l, i) => ({
        ...l,
        hint: translatedLayerHints[i]
    }));

    const ORGANISM_BANKS = {
        10:[
            {name:'Grass',      emoji:'🌿',layer:0,fact:'Producer: photosynthesises sunlight'},
            {name:'Phytoplankton',emoji:'🦠',layer:0,fact:'Marine producer: base of ocean food web'},
            {name:'Rabbit',     emoji:'🐇',layer:1,fact:'Primary consumer: herbivore eats grass'},
            {name:'Deer',       emoji:'🦌',layer:1,fact:'Primary consumer: grazes on plants'},
            {name:'Fox',        emoji:'🦊',layer:2,fact:'Secondary consumer: eats rabbits and rodents'},
            {name:'Snake',      emoji:'🐍',layer:2,fact:'Secondary consumer: eats rodents & frogs'},
            {name:'Eagle',      emoji:'🦅',layer:3,fact:'Apex predator: top of terrestrial food chain'},
            {name:'Shark',      emoji:'🦈',layer:3,fact:'Apex predator: top of marine food chain'},
        ],
        11:[
            {name:'Algae',      emoji:'🌱',layer:0,fact:'Aquatic producer, oxygenates water'},
            {name:'Oak Tree',   emoji:'🌳',layer:0,fact:'Producer: stores carbon in wood'},
            {name:'Caterpillar',emoji:'🐛',layer:1,fact:'Primary consumer: eats leaves'},
            {name:'Zooplankton',emoji:'🔬',layer:1,fact:'Primary consumer: eats phytoplankton'},
            {name:'Frog',       emoji:'🐸',layer:2,fact:'Secondary consumer: eats insects'},
            {name:'Tuna',       emoji:'🐟',layer:2,fact:'Secondary consumer: eats smaller fish'},
            {name:'Owl',        emoji:'🦉',layer:3,fact:'Apex predator: nocturnal hunter'},
            {name:'Killer Whale',emoji:'🐋',layer:3,fact:'Apex marine predator: eats seals, fish'},
        ],
        12:[
            {name:'Seagrass',   emoji:'🌿',layer:0,fact:'Marine producer: supports dugongs'},
            {name:'Cyanobacteria',emoji:'🦠',layer:0,fact:'Prokaryotic producer, nitrogen-fixer'},
            {name:'Sea Urchin', emoji:'🌊',layer:1,fact:'Primary consumer: grazes on seagrass'},
            {name:'Krill',      emoji:'🦐',layer:1,fact:'Primary consumer: eaten by whales, penguins'},
            {name:'Seal',       emoji:'🦭',layer:2,fact:'Secondary consumer: eats fish, squid'},
            {name:'Leopard',    emoji:'🐆',layer:2,fact:'Secondary consumer: eats herbivores'},
            {name:'Polar Bear', emoji:'🐻‍❄️',layer:3,fact:'Apex predator: hunts seals on ice'},
            {name:'Lion',       emoji:'🦁',layer:3,fact:'Apex predator: pride-hunting savannah king'},
        ]
    };

    const organisms = (ORGANISM_BANKS[g]||ORGANISM_BANKS[10]).slice().sort(()=>Math.random()-0.5);
    
    // Translate organism names and facts
    const orgNamesToTranslate = organisms.map(o => o.name);
    const orgFactsToTranslate = organisms.map(o => o.fact);
    const translatedOrgNames = await translateTexts(orgNamesToTranslate);
    const translatedOrgFacts = await translateTexts(orgFactsToTranslate);
    
    const translatedOrganisms = organisms.map((org, i) => ({
        ...org,
        name: translatedOrgNames[i],
        fact: translatedOrgFacts[i]
    }));

    const CARD_W=72, CARD_H=64;
    let cards=[], placedCount=0;
    let localScore=0, lives=3, gameTime=100+(g-10)*10, isOver=false, animId;
    let drag=null, dox=0, doy=0, sparks=[], arrows=[];

    function initCards(){
        cards = translatedOrganisms.map((org,i)=>({
            ...org,
            x: 30+((i%4))*(CARD_W+14),
            y: -CARD_H*2 - i*20,
            tx: 30+((i%4))*(CARD_W+14),
            ty: 60 + ~~(i/4)*(CARD_H+10),
            vy: 0.04,
            placed:false, correct:false,
            scale:1
        }));
    }

    function spawnSparks(x,y,col){
        for(let i=0;i<16;i++) sparks.push({x,y,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,life:1,col,r:3});
    }

    function getLayerY(layerIdx){
        return translatedLayers[layerIdx].y * canvas.height;
    }

    function getLayerAtY(py){
        for(let i=0;i<translatedLayers.length;i++){
            const ly = translatedLayers[i].y * canvas.height;
            if(py >= ly-36 && py <= ly+36) return i;
        }
        return -1;
    }

    function tryPlace(card){
        const cx = card.x + CARD_W/2, cy = card.y + CARD_H/2;
        const layerIdx = getLayerAtY(cy);
        if(layerIdx<0){ card.x=card.tx; card.y=card.ty; return; }

        card.placed = true;
        if(layerIdx===card.layer){
            card.correct = true; card.y = getLayerY(layerIdx)-CARD_H/2;
            localScore+=25; score=localScore; updateHUD(localScore);
            spawnSparks(cx, cy, translatedLayers[layerIdx].col);
            showFloatingText('✅ +25', cx, cy-30, translatedLayers[layerIdx].col);
            showFloatingText('💡 '+card.fact, canvas.width/2, canvas.height/2, '#00C3FF');
            updateProgress(Math.min(100,~~(((++placedCount)/translatedOrganisms.length)*100)));
            if(placedCount>=translatedOrganisms.length) setTimeout(end,1200);
        } else {
            card.placed=false; card.x=card.tx; card.y=card.ty;
            lives--; updateHealth(Math.max(0,(lives/3)*100));
            shakeCanvas(canvas);
            showFloatingText('❌ Wrong layer!', cx, cy-30, '#FF2D9B');
            showFloatingText('Hint: '+translatedLayers[card.layer].hint, cx, cy, '#FFD700');
        }
    }

    function draw(){
        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,'#001020'); bg.addColorStop(0.4,'#002818'); bg.addColorStop(1,'#003008');
        ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);

        translatedLayers.forEach((layer,i)=>{
            const ly=layer.y*canvas.height;
            ctx.save();
            ctx.fillStyle=layer.col+'18';
            ctx.fillRect(0,ly-32,canvas.width,64);
            ctx.strokeStyle=layer.col+'55'; ctx.lineWidth=1.5; ctx.setLineDash([8,6]);
            ctx.beginPath(); ctx.moveTo(0,ly); ctx.lineTo(canvas.width,ly); ctx.stroke();
            ctx.setLineDash([]);
            ctx.font='bold 10px Outfit'; ctx.fillStyle=layer.col+'CC';
            ctx.textAlign='right'; ctx.textBaseline='middle';
            ctx.fillText(layer.name, canvas.width-10, ly);
            ctx.restore();
        });

        for(let i=0;i<translatedLayers.length-1;i++){
            const ly1=translatedLayers[i].y*canvas.height, ly2=translatedLayers[i+1].y*canvas.height;
            ctx.save(); ctx.globalAlpha=0.25;
            ctx.strokeStyle=translatedLayers[i+1].col; ctx.lineWidth=1.5; ctx.setLineDash([4,5]);
            ctx.beginPath(); ctx.moveTo(canvas.width/2,ly1); ctx.lineTo(canvas.width/2,ly2); ctx.stroke();
            ctx.setLineDash([]); ctx.restore();
        }

        ctx.save();
        ctx.fillStyle='rgba(0,0,0,0.75)';
        ctx.fillRect(0,0,canvas.width,48);
        ctx.font='bold 12px Outfit'; ctx.fillStyle='#7CFC00'; ctx.textAlign='center';
        ctx.shadowBlur=6; ctx.shadowColor='#7CFC00';
        ctx.fillText('🌍 ECOSYSTEM ARCHITECT — Drag organisms to correct trophic level', canvas.width/2, 30);
        ctx.shadowBlur=0; ctx.restore();

        cards.forEach(card=>{
            if(!card.placed && card.y<card.ty-2) card.y+=(card.ty-card.y)*0.06+1;

            if(card===drag) return;
            const col = card.correct ? translatedLayers[card.layer].col : (card.placed?'#FF2D9B':'rgba(255,255,255,0.15)');
            ctx.save();
            ctx.fillStyle  =col+'33'; ctx.strokeStyle=col; ctx.lineWidth=card.correct?2.5:1.5;
            ctx.shadowBlur =card.correct?20:0; ctx.shadowColor=col;
            ctx.beginPath(); ctx.roundRect(card.x,card.y,CARD_W,CARD_H,10); ctx.fill(); ctx.stroke();
            ctx.shadowBlur=0;
            ctx.font='28px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText(card.emoji, card.x+CARD_W/2, card.y+CARD_H/2-8);
            ctx.font='bold 8px Outfit'; ctx.fillStyle='#fff';
            ctx.fillText(card.name, card.x+CARD_W/2, card.y+CARD_H-10);
            ctx.restore();
        });

        if(drag){
            ctx.save();
            ctx.fillStyle=drag.col?translatedLayers[drag.layer].col+'44':'rgba(255,255,255,0.2)';
            ctx.strokeStyle=translatedLayers[drag.layer].col; ctx.lineWidth=2.5;
            ctx.shadowBlur=24; ctx.shadowColor=translatedLayers[drag.layer].col;
            ctx.beginPath(); ctx.roundRect(drag.x,drag.y,CARD_W,CARD_H,10); ctx.fill(); ctx.stroke();
            ctx.shadowBlur=0;
            ctx.font='28px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText(drag.emoji, drag.x+CARD_W/2, drag.y+CARD_H/2-8);
            ctx.font='bold 8px Outfit'; ctx.fillStyle='#fff';
            ctx.fillText(drag.name, drag.x+CARD_W/2, drag.y+CARD_H-10);
            ctx.restore();
        }

        for(let i=sparks.length-1;i>=0;i--){
            const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.life-=0.03;
            if(s.life<=0){sparks.splice(i,1);continue;}
            ctx.save(); ctx.globalAlpha=s.life; ctx.fillStyle=s.col;
            ctx.shadowBlur=6; ctx.shadowColor=s.col;
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore();
        }

        ctx.font='15px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
        let h=''; for(let i=0;i<3;i++) h+=i<lives?'❤️ ':'🖤 ';
        ctx.fillText(h, 10, canvas.height-10);
        ctx.font='bold 10px Outfit'; ctx.fillStyle='rgba(124,252,0,0.5)';
        ctx.textAlign='right';
        ctx.fillText('Placed: '+placedCount+'/'+translatedOrganisms.length, canvas.width-10, canvas.height-10);
    }

    function onDown(e){
        const {x,y}=gpos(canvas,e);
        for(const c of cards){
            if(!c.placed && !c.correct && x>=c.x && x<=c.x+CARD_W && y>=c.y && y<=c.y+CARD_H){
                drag=c; dox=x-c.x; doy=y-c.y; break;
            }
        }
    }
    function onMove(e){
        if(!drag) return;
        const {x,y}=gpos(canvas,e);
        drag.x=x-dox; drag.y=y-doy;
    }
    function onUp(){
        if(!drag) return;
        tryPlace(drag); drag=null;
    }
    canvas.addEventListener('mousedown',onDown);
    canvas.addEventListener('mousemove',onMove);
    canvas.addEventListener('mouseup',onUp);
    canvas.addEventListener('touchstart',onDown,{passive:true});
    canvas.addEventListener('touchmove',e=>{onMove(e.touches[0]);e.preventDefault();},{passive:false});
    canvas.addEventListener('touchend',()=>onUp());

    function loop(){
        if(isOver) return;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        draw(); animId=requestAnimationFrame(loop);
    }
    function end(){
        isOver=true; clearInterval(timerInterval); cancelAnimationFrame(animId);
        score=localScore; finishMission(Math.min(100,~~((localScore/(translatedOrganisms.length*25))*100)),0);
    }
    timerInterval=setInterval(()=>{gameTime--;updateTimer(gameTime);if(gameTime<=0||lives<=0)end();},1000);
    updateTimer(gameTime); initCards(); loop();
}

/* ================================================================
   MATHS BUBBLE (Grade 10) - Maths Mission
   ================================================================ */

function mathsBubble(g) { mathsMission(g); }

async function mathsMission(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const QUESTIONS = [
        { q:'Distance (0,0)→(3,4)=?', correct:'5',    wrong:['7','√25 ≈5.5'] },
        { q:'Midpoint (2,4)&(6,8)=?', correct:'(4,6)',wrong:['(3,5)','(8,12)'] },
        { q:'GP 2,6,18 ratio=?',      correct:'3',    wrong:['2','6'] },
        { q:'Sum 1..10=?',            correct:'55',   wrong:['45','50'] },
        { q:'log₁₀(1000)=?',         correct:'3',    wrong:['4','2'] },
        { q:'sin²θ+cos²θ=?',         correct:'1',    wrong:['0','2'] },
        { q:'Slope of y=3x−2=?',     correct:'3',    wrong:['−2','½'] },
        { q:'(a+b)²=?',               correct:'a²+2ab+b²',wrong:['a²+b²','2a+2b'] },
    ];
    
    // Translate questions and answers
    const translatedQuestions = [];
    for (const q of QUESTIONS) {
        const textsToTranslate = [q.q, q.correct, ...q.wrong];
        const translated = await translateTexts(textsToTranslate);
        const wrongCount = q.wrong.length;
        translatedQuestions.push({
            q: translated[0],
            correct: translated[1],
            wrong: translated.slice(2, 2 + wrongCount)
        });
    }

    let localScore=0, lives=3, gameTime=85, isOver=false, animId;
    let qIdx=0, currentQ=null, panels=[], bullets=[], sparks=[];
    let reticleX=canvas.width/2, reticleY=canvas.height/2;

    function spawnRound(){
        const raw=translatedQuestions[qIdx%translatedQuestions.length]; qIdx++;
        const correctVal=raw.correct;
        const all=[raw.correct,...raw.wrong].sort(()=>Math.random()-0.5);
        currentQ={q:raw.q, correct:correctVal};
        panels=all.map((val,i)=>{
            const angle=Math.random()*Math.PI*2;
            const dist=90+Math.random()*70;
            const cx=canvas.width/2+Math.cos(angle)*dist;
            const cy=canvas.height/2+Math.sin(angle)*dist;
            return {
                x:cx, y:cy,
                angle:Math.random()*Math.PI*2,
                orbitAngle:angle,
                orbitR:dist,
                orbitSpd:(0.008+Math.random()*0.006)*(Math.random()>0.5?1:-1),
                val, ok:val===correctVal,
                col:['#00C3FF','#FFD700','#FF2D9B'][i%3],
                w:80, h:36, pulse:Math.random()*Math.PI*2
            };
        });
        bullets=[];
    }

    function fire(){
        bullets.push({x:reticleX,y:reticleY,vx:0,vy:0,r:6,life:1});
    }

    function spawnSparks(x,y,col){
        for(let i=0;i<18;i++) sparks.push({x,y,vx:(Math.random()-.5)*9,vy:(Math.random()-.5)*9,life:1,col,r:3});
    }

    function draw(){
        const bg=ctx.createRadialGradient(canvas.width/2,canvas.height/2,10,canvas.width/2,canvas.height/2,canvas.width);
        bg.addColorStop(0,'#050820'); bg.addColorStop(1,'#020408');
        ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.save(); ctx.fillStyle='rgba(255,255,255,0.6)';
        for(let i=0;i<80;i++){
            const sx=(i*137.5)%canvas.width, sy=(i*97.3)%canvas.height;
            ctx.beginPath(); ctx.arc(sx,sy,Math.random()<0.1?1.5:0.8,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();

        ctx.save();
        ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(0,0,canvas.width,50);
        ctx.font='bold 13px Outfit'; ctx.fillStyle='#00C3FF'; ctx.textAlign='center';
        ctx.shadowBlur=8; ctx.shadowColor='#00C3FF';
        ctx.fillText('🛰️ MISSION CONTROL — Lock onto: '+currentQ.q, canvas.width/2,32);
        ctx.shadowBlur=0; ctx.restore();

        panels.forEach(p=>{
            p.orbitAngle+=p.orbitSpd;
            p.pulse+=0.05;
            p.x=canvas.width/2+Math.cos(p.orbitAngle)*p.orbitR;
            p.y=canvas.height/2+Math.sin(p.orbitAngle)*p.orbitR;
            const glow=0.7+0.3*Math.sin(p.pulse);
            ctx.save();
            ctx.translate(p.x,p.y);
            ctx.shadowBlur=14*glow; ctx.shadowColor=p.col;
            ctx.fillStyle=p.col+'33'; ctx.strokeStyle=p.col; ctx.lineWidth=2;
            ctx.beginPath(); ctx.roundRect(-p.w/2,-p.h/2,p.w,p.h,8); ctx.fill(); ctx.stroke();
            ctx.shadowBlur=0;
            ctx.font='bold 11px Outfit'; ctx.fillStyle='#fff';
            ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText(p.val, 0, 0);
            for(let t=1;t<=5;t++){
                const ta=p.orbitAngle-p.orbitSpd*t*4;
                const tx=Math.cos(ta)*p.orbitR-Math.cos(p.orbitAngle)*p.orbitR;
                const ty=Math.sin(ta)*p.orbitR-Math.sin(p.orbitAngle)*p.orbitR;
                ctx.globalAlpha=(6-t)/6*0.3;
                ctx.fillStyle=p.col;
                ctx.beginPath(); ctx.arc(tx,ty,3,0,Math.PI*2); ctx.fill();
            }
            ctx.restore();
        });

        ctx.save();
        ctx.strokeStyle='rgba(0,245,160,0.8)'; ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
        ctx.beginPath(); ctx.arc(reticleX,reticleY,22,0,Math.PI*2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle='rgba(0,245,160,0.5)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(reticleX-34,reticleY); ctx.lineTo(reticleX+34,reticleY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(reticleX,reticleY-34); ctx.lineTo(reticleX,reticleY+34); ctx.stroke();
        ctx.restore();

        bullets.forEach(b=>{
            ctx.save(); ctx.globalAlpha=b.life; ctx.fillStyle='#00F5A0';
            ctx.shadowBlur=12; ctx.shadowColor='#00F5A0';
            ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); ctx.restore();
        });

        for(let i=sparks.length-1;i>=0;i--){
            const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.life-=0.03;
            if(s.life<=0){sparks.splice(i,1);continue;}
            ctx.save(); ctx.globalAlpha=s.life; ctx.fillStyle=s.col;
            ctx.shadowBlur=8; ctx.shadowColor=s.col;
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore();
        }

        ctx.font='15px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
        let h=''; for(let i=0;i<3;i++) h+=i<lives?'❤️ ':'🖤 ';
        ctx.fillText(h, 10, canvas.height-10);
    }

    function checkHit(x,y){
        panels.forEach((p,i)=>{
            const dx=x-p.x, dy=y-p.y;
            if(Math.abs(dx)<p.w/2+8 && Math.abs(dy)<p.h/2+8){
                if(p.ok){
                    localScore+=25; score=localScore; updateHUD(localScore);
                    spawnSparks(p.x,p.y,p.col);
                    showFloatingText('🎯 Locked! +25',p.x,p.y-40,p.col);
                    updateProgress(Math.min(100,~~((qIdx/translatedQuestions.length)*100)));
                    panels=[];
                    setTimeout(spawnRound,700);
                } else {
                    lives--; updateHealth(Math.max(0,(lives/3)*100));
                    shakeCanvas(canvas); spawnSparks(p.x,p.y,'#FF2D9B');
                    showFloatingText('✗ Wrong target!',p.x,p.y-30,'#FF2D9B');
                    panels.splice(i,1);
                }
            }
        });
    }

    canvas.addEventListener('mousemove',e=>{const p=gpos(canvas,e);reticleX=p.x;reticleY=p.y;});
    canvas.addEventListener('click',e=>{const p=gpos(canvas,e);checkHit(p.x,p.y);});
    canvas.addEventListener('touchmove',e=>{e.preventDefault();const p=gpos(canvas,e.touches[0]);reticleX=p.x;reticleY=p.y;},{passive:false});
    canvas.addEventListener('touchstart',e=>{const p=gpos(canvas,e.touches[0]);reticleX=p.x;reticleY=p.y;checkHit(p.x,p.y);},{passive:true});

    function loop(){
        if(isOver) return;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        draw(); animId=requestAnimationFrame(loop);
    }
    function end(){
        isOver=true; clearInterval(timerInterval); cancelAnimationFrame(animId);
        score=localScore; finishMission(Math.min(100,~~((localScore/(translatedQuestions.length*25))*100)),0);
    }
    timerInterval=setInterval(()=>{gameTime--;updateTimer(gameTime);if(gameTime<=0||lives<=0)end();},1000);
    updateTimer(gameTime); spawnRound(); loop();
}

/* ================================================================
   MATHS ADVANCED (Grades 11-12) - Calculus Coaster
   ================================================================ */

function mathsAdvanced(g) { calculusCoaster(g); }

async function calculusCoaster(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const QUESTIONS = {
        11:[
            { q:'d/dx(sin x)=?',    correct:1,  min:-2, max:2, label:'cos x=1',   display:'cos 0°=?',   fact:'d/dx(sin x)=cos x' },
            { q:'∫2x dx = ?+C',     correct:4,  min:0,  max:8, label:'x²(at 2)',  display:'x² at x=2=?',fact:'∫2x dx = x² + C' },
            { q:'lim sinx/x (x→0)=?',correct:1, min:0,  max:3, label:'=1',        display:'lim sinx/x=?',fact:'Standard limit = 1' },
            { q:'det[[1,2],[3,4]]=?', correct:-2, min:-5, max:5,label:'-2',        display:'1×4−2×3=?',  fact:'ad−bc=4−6=−2' },
            { q:"f(x)=x³ → f'(2)=?",correct:12, min:0, max:20,label:'12',         display:"f'(2) for x³=?",fact:"f'(x)=3x²→3×4=12" },
            { q:'Domain of ln(x)?',  correct:1,  min:0,  max:2, label:'x>0 → 1',  display:'ln(x) at x=1=?',fact:'ln(x) defined for x>0' },
        ],
        12:[
            { q:'∫₀¹ x² dx=?',       correct:0.33,min:0,max:1,  label:'1/3≈0.33', display:'∫₀¹x²dx=?',   fact:'[x³/3]₀¹=1/3' },
            { q:'d/dx(eˣ)=?',        correct:1,  min:0,  max:3, label:'eˣ at 0=1',display:'eˣ at x=0=?', fact:'eˣ is its own derivative' },
            { q:'A·B=0 means?',      correct:90, min:0,  max:180,label:'90°',      display:'angle when A·B=0=?',fact:'Perpendicular: θ=90°' },
            { q:'C(5,2)=?',          correct:10, min:0,  max:20, label:'10',       display:'5C2=?',        fact:'5!/(2!3!)=10' },
            { q:'P(A∪B) needs P(A∩B)?',correct:1,min:0, max:3,  label:'yes→1',    display:'P(A)+P(B)−?=P(A∪B)',fact:'Subtract P(A∩B) once' },
            { q:'Matrix 2×3 × 3×4 gives?',correct:8,min:0,max:16,label:'2×4=8 cells',display:'rows×cols for 2×4?',fact:'(m×n)(n×p)=m×p → 2×4' },
        ]
    };
    const bank = (QUESTIONS[g]||QUESTIONS[11]).slice();
    
    // Translate questions, labels, displays, and facts
    const translatedBank = [];
    for (const q of bank) {
        const textsToTranslate = [q.q, q.display, q.fact];
        const translated = await translateTexts(textsToTranslate);
        translatedBank.push({
            ...q,
            q: translated[0],
            display: translated[1],
            fact: translated[2]
        });
    }

    let localScore=0, lives=3, gameTime=95+(g-11)*5, isOver=false, animId;
    let qIdx=0, currentQ=null, dialValue=0, draggingDial=false;
    let carT=0, carSpd=0.003, gateT=0.5, gateOpen=false, crashed=false;
    let sparks=[], smoke=[];

    const TRACK_MID=canvas.height*0.52;
    function trackY(t){ return TRACK_MID + Math.sin(t*Math.PI*4)*60 + Math.cos(t*Math.PI*2.5)*30; }

    function nextQ(){
        if(qIdx>=translatedBank.length){end();return;}
        currentQ=translatedBank[qIdx]; qIdx++;
        dialValue=currentQ.min+(currentQ.max-currentQ.min)*0.5;
        gateT=0.45+Math.random()*0.3;
        gateOpen=false; crashed=false;
    }

    function spawnSparks(x,y,col,n=20){
        for(let i=0;i<n;i++) sparks.push({x,y,vx:(Math.random()-.5)*10,vy:(Math.random()-.5)*10,life:1,col,r:3+Math.random()*3});
    }
    function spawnSmoke(x,y){
        for(let i=0;i<12;i++) smoke.push({x,y,vx:(Math.random()-.5)*3,vy:-(1+Math.random()*2),r:8+Math.random()*8,life:1});
    }

    const DIAL_X=60, DIAL_Y=canvas.height-55, DIAL_W=canvas.width-120, DIAL_H=20;

    function dialToValue(px){ return currentQ.min+(currentQ.max-currentQ.min)*Math.max(0,Math.min(1,(px-DIAL_X)/DIAL_W)); }
    function valueToDial(v){ return DIAL_X+(v-currentQ.min)/(currentQ.max-currentQ.min)*DIAL_W; }

    function checkAnswer(){
        if(!currentQ||gateOpen||crashed) return;
        const tol=Math.abs(currentQ.max-currentQ.min)*0.12;
        if(Math.abs(dialValue-currentQ.correct)<=tol){
            gateOpen=true;
            localScore+=30; score=localScore; updateHUD(localScore);
            spawnSparks(gateT*canvas.width, trackY(gateT), '#00F5A0', 25);
            showFloatingText('🎢 +30 Gate Open!', gateT*canvas.width, trackY(gateT)-40, '#00F5A0');
            showFloatingText('💡 '+currentQ.fact, canvas.width/2, canvas.height/2, '#00C3FF');
            updateProgress(Math.min(100,~~((qIdx/translatedBank.length)*100)));
            setTimeout(()=>{carT=gateT+0.01; nextQ();},1200);
        } else {
            crashed=true; lives--;
            updateHealth(Math.max(0,(lives/3)*100));
            shakeCanvas(canvas);
            spawnSmoke(gateT*canvas.width, trackY(gateT));
            showFloatingText('💥 CRASH! Wrong answer', gateT*canvas.width, trackY(gateT)-30, '#FF2D9B');
            setTimeout(()=>{crashed=false; carT=Math.max(0,gateT-0.05);},1000);
        }
    }

    function draw(){
        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,'#020818'); bg.addColorStop(0.5,'#0a1820'); bg.addColorStop(1,'#081408');
        ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle='#0a180a'; ctx.fillRect(0,TRACK_MID+80,canvas.width,canvas.height);

        ctx.save();
        ctx.strokeStyle='rgba(200,160,80,0.5)'; ctx.lineWidth=6;
        ctx.beginPath(); ctx.moveTo(0,trackY(0));
        for(let t=0;t<=1;t+=0.005) ctx.lineTo(t*canvas.width, trackY(t));
        ctx.stroke();
        ctx.strokeStyle='rgba(120,80,40,0.4)'; ctx.lineWidth=2;
        for(let t=0;t<=1;t+=0.03){
            const tx=t*canvas.width, ty=trackY(t);
            ctx.beginPath(); ctx.moveTo(tx-8,ty-4); ctx.lineTo(tx+8,ty+4); ctx.stroke();
        }
        ctx.restore();

        if(currentQ){
            const gx=gateT*canvas.width, gy=trackY(gateT);
            ctx.save();
            ctx.strokeStyle=gateOpen?'#00F5A0':'#FF2D9B'; ctx.lineWidth=3;
            ctx.shadowBlur=16; ctx.shadowColor=gateOpen?'#00F5A0':'#FF2D9B';
            ctx.beginPath(); ctx.moveTo(gx-20,gy-60); ctx.lineTo(gx-20,gy+20); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(gx+20,gy-60); ctx.lineTo(gx+20,gy+20); ctx.stroke();
            if(!gateOpen && !crashed){
                ctx.beginPath(); ctx.moveTo(gx-20,gy-20); ctx.lineTo(gx+20,gy-20); ctx.stroke();
            }
            ctx.shadowBlur=0; ctx.restore();
            ctx.save();
            ctx.fillStyle='rgba(0,0,0,0.8)'; ctx.strokeStyle='rgba(255,215,0,0.4)'; ctx.lineWidth=1;
            ctx.beginPath(); ctx.roundRect(gx-90,gy-95,180,34,8); ctx.fill(); ctx.stroke();
            ctx.font='bold 11px Outfit'; ctx.fillStyle='#FFD700'; ctx.textAlign='center';
            ctx.fillText('⚡ '+currentQ.display, gx, gy-73);
            ctx.restore();
        }

        if(!crashed){
            const cx=carT*canvas.width, cy=trackY(carT);
            ctx.save();
            ctx.shadowBlur=18; ctx.shadowColor='#00C3FF';
            ctx.fillStyle='#00C3FF'; ctx.strokeStyle='#fff'; ctx.lineWidth=1.5;
            ctx.beginPath(); ctx.roundRect(cx-18,cy-14,36,22,6); ctx.fill(); ctx.stroke();
            ctx.fillStyle='#FFD700';
            ctx.beginPath(); ctx.arc(cx-10,cy+8,5,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx+10,cy+8,5,0,Math.PI*2); ctx.fill();
            ctx.restore();
        }

        if(currentQ){
            ctx.save();
            ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=1;
            ctx.beginPath(); ctx.roundRect(DIAL_X,DIAL_Y,DIAL_W,DIAL_H,DIAL_H/2); ctx.fill(); ctx.stroke();
            const fillW=(dialValue-currentQ.min)/(currentQ.max-currentQ.min)*DIAL_W;
            const fg=ctx.createLinearGradient(DIAL_X,0,DIAL_X+DIAL_W,0);
            fg.addColorStop(0,'#00C3FF'); fg.addColorStop(1,'#FF2D9B');
            ctx.fillStyle=fg;
            ctx.beginPath(); ctx.roundRect(DIAL_X,DIAL_Y,fillW,DIAL_H,DIAL_H/2); ctx.fill();
            const thumbX=valueToDial(dialValue);
            ctx.fillStyle='#fff'; ctx.shadowBlur=12; ctx.shadowColor='#00F5A0';
            ctx.beginPath(); ctx.arc(thumbX,DIAL_Y+DIAL_H/2,13,0,Math.PI*2); ctx.fill();
            ctx.shadowBlur=0;
            ctx.font='bold 10px Outfit'; ctx.fillStyle='#000';
            ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText(dialValue.toFixed(dialValue%1===0?0:1), thumbX, DIAL_Y+DIAL_H/2);
            ctx.font='9px Outfit'; ctx.fillStyle='rgba(255,255,255,0.4)';
            ctx.textAlign='left';  ctx.fillText(currentQ.min, DIAL_X, DIAL_Y-6);
            ctx.textAlign='right'; ctx.fillText(currentQ.max, DIAL_X+DIAL_W, DIAL_Y-6);
            ctx.textAlign='center'; ctx.fillStyle='rgba(255,215,0,0.6)';
            ctx.fillText('← Drag to set answer, then tap CHECK →', canvas.width/2, DIAL_Y-6);
            ctx.restore();
            ctx.save();
            ctx.fillStyle='rgba(0,245,160,0.15)'; ctx.strokeStyle='#00F5A0'; ctx.lineWidth=1.5;
            ctx.beginPath(); ctx.roundRect(canvas.width-110,DIAL_Y-2,100,DIAL_H+4,8); ctx.fill(); ctx.stroke();
            ctx.font='bold 12px Outfit'; ctx.fillStyle='#00F5A0';
            ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText('✓ CHECK', canvas.width-60, DIAL_Y+DIAL_H/2);
            ctx.restore();
        }

        for(let i=sparks.length-1;i>=0;i--){
            const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.life-=0.03;
            if(s.life<=0){sparks.splice(i,1);continue;}
            ctx.save(); ctx.globalAlpha=s.life; ctx.fillStyle=s.col;
            ctx.shadowBlur=8; ctx.shadowColor=s.col;
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore();
        }
        for(let i=smoke.length-1;i>=0;i--){
            const s=smoke[i]; s.x+=s.vx; s.y+=s.vy; s.r*=1.03; s.life-=0.025;
            if(s.life<=0){smoke.splice(i,1);continue;}
            ctx.save(); ctx.globalAlpha=s.life*0.4; ctx.fillStyle='rgba(200,100,80,1)';
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore();
        }

        ctx.save();
        ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(0,0,canvas.width,44);
        ctx.font='bold 12px Outfit'; ctx.fillStyle='#FFD700'; ctx.textAlign='center';
        ctx.fillText('🎢 CALCULUS COASTER — Grade '+g, canvas.width/2, 28);
        ctx.restore();
        ctx.font='15px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
        let h=''; for(let i=0;i<3;i++) h+=i<lives?'❤️ ':'🖤 ';
        ctx.fillText(h, 10, canvas.height-10);
    }

    function update(){
        if(!crashed && !gateOpen) carT=Math.min(gateT-0.01, carT+carSpd);
        if(gateOpen) carT=Math.min(1, carT+carSpd*1.5);
        if(carT>=1) end();
    }

    function dialDown(e){
        const {x,y}=gpos(canvas,e);
        if(y>=DIAL_Y-10 && y<=DIAL_Y+DIAL_H+10 && x>=DIAL_X && x<=DIAL_X+DIAL_W){ draggingDial=true; dialValue=dialToValue(x); }
        if(x>=canvas.width-110 && x<=canvas.width-10 && y>=DIAL_Y-2 && y<=DIAL_Y+DIAL_H+4) checkAnswer();
    }
    function dialMove(e){
        if(!draggingDial) return;
        const {x}=gpos(canvas,e);
        dialValue=dialToValue(x);
    }
    function dialUp(){ draggingDial=false; }

    canvas.addEventListener('mousedown',dialDown);
    canvas.addEventListener('mousemove',dialMove);
    canvas.addEventListener('mouseup',dialUp);
    canvas.addEventListener('touchstart',dialDown,{passive:true});
    canvas.addEventListener('touchmove',e=>{dialMove(e.touches[0]);e.preventDefault();},{passive:false});
    canvas.addEventListener('touchend',dialUp);

    function loop(){
        if(isOver) return;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        draw(); update(); animId=requestAnimationFrame(loop);
    }
    function end(){
        isOver=true; clearInterval(timerInterval); cancelAnimationFrame(animId);
        score=localScore; finishMission(Math.min(100,~~((localScore/(translatedBank.length*30))*100)),0);
    }
    timerInterval=setInterval(()=>{gameTime--;updateTimer(gameTime);if(gameTime<=0||lives<=0)end();},1000);
    updateTimer(gameTime); nextQ(); loop();
}

/* ================================================================
   PYTHON FILL (Grades 7-8)
   ================================================================ */

async function pythonFill(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const QS_G7 = [
        { code:'___("Hello, World!")',             blank:'print',  opts:['print','input','return','def'],    fact:'print() outputs to console' },
        { code:'x = ___(input("Enter: "))',        blank:'int',    opts:['int','str','float','bool'],        fact:'int() converts string → integer' },
        { code:'name = ___("Your name? ")',        blank:'input',  opts:['input','print','read','scan'],     fact:'input() reads from keyboard' },
        { code:'pi = ___',                         blank:'3.14',   opts:['3.14','3','"3.14"','3,14'],        fact:'Float literal — decimal point required' },
        { code:'flag = ___',                       blank:'True',   opts:['True','true','1','yes'],           fact:'Boolean True — capital T in Python' },
        { code:'x = 10\nprint(type(___))',         blank:'x',      opts:['x','10','int','type'],             fact:"type(x) → <class 'int'>" },
    ];
    
    const QS_G8 = [
        { code:'for i in ___(5):\n    print(i)',   blank:'range',  opts:['range','list','iter','count'],     fact:'range(5) → 0,1,2,3,4' },
        { code:'if x>10:\n    print("big")\n___:\n    print("small")', blank:'else', opts:['else','elif','catch','then'], fact:'else: alternate branch' },
        { code:'i=0\nwhile i ___ 5:\n    i+=1',   blank:'<',      opts:['<','<=','>','=='],                 fact:'< means strictly less than' },
        { code:'for i in range(10):\n    if i==5: ___', blank:'break', opts:['break','continue','pass','stop'], fact:'break exits the loop immediately' },
        { code:'nums=[1,2,3]\nfor n in ___:\n    print(n)', blank:'nums', opts:['nums','num','list','range(3)'], fact:'Iterate over the list variable directly' },
        { code:'x=5\nif x%2 ___ 0:\n    print("even")', blank:'==', opts:['==','=','!=','>='],             fact:'== equality check (not = assignment)' },
    ];
    
    const QS = g<=7 ? QS_G7 : QS_G8;
    
    // Translate facts
    const factsToTranslate = QS.map(q => q.fact);
    const translatedFacts = await translateTexts(factsToTranslate);
    const translatedQS = QS.map((q, i) => ({
        ...q,
        fact: translatedFacts[i]
    }));

    const TILE_W=72, TILE_H=36;
    let qIdx=0, currentQ=null, tiles=[], drag=null, dox=0, doy=0;
    let localScore=0, lives=3, gameTime=90, isOver=false, animId;
    let sparks=[], blankFilled=null, showSuccess=false, successTimer=0;

    function nextQ(){
        if(qIdx>=translatedQS.length){end();return;}
        const raw=translatedQS[qIdx]; qIdx++;
        const correctOpt=raw.blank;
        const shuffled=raw.opts.slice().sort(()=>Math.random()-0.5);
        currentQ={...raw, opts:shuffled};
        const spacing=(canvas.width-40)/shuffled.length;
        tiles=shuffled.map((name,i)=>({
            name, ok:name===correctOpt,
            x:20+i*spacing+spacing/2-TILE_W/2,
            y:canvas.height-56,
            ox:20+i*spacing+spacing/2-TILE_W/2,
            oy:canvas.height-56,
            w:TILE_W, h:TILE_H, placed:false,
            col:['#00C3FF','#FFD700','#FF2D9B','#00F5A0'][i%4]
        }));
        blankFilled=null; showSuccess=false; drag=null;
    }

    function spawnSparks(x,y,col){
        for(let i=0;i<20;i++) sparks.push({x,y,vx:(Math.random()-.5)*10,vy:(Math.random()-.5)*10,life:1,col,r:3});
    }

    const BLANK_X=canvas.width/2, BLANK_Y=148;
    const BLANK_W=100, BLANK_H=32;

    function tryDrop(tile){
        const cx=tile.x+tile.w/2, cy=tile.y+tile.h/2;
        if(Math.abs(cx-BLANK_X)<BLANK_W/2+20 && Math.abs(cy-BLANK_Y)<BLANK_H/2+20){
            if(tile.ok){
                blankFilled=tile.name; tile.placed=true;
                spawnSparks(BLANK_X,BLANK_Y,'#00F5A0');
                localScore+=20; score=localScore; updateHUD(localScore);
                showFloatingText('✓ Correct! +20', BLANK_X, BLANK_Y-40, '#00F5A0');
                showFloatingText('💡 '+currentQ.fact, canvas.width/2, canvas.height/2, '#00C3FF');
                updateProgress(Math.min(100,~~((qIdx/translatedQS.length)*100)));
                showSuccess=true; successTimer=60;
                setTimeout(nextQ,1600);
            } else {
                lives--; updateHealth(Math.max(0,(lives/3)*100));
                shakeCanvas(canvas); spawnSparks(BLANK_X,BLANK_Y,'#FF2D9B');
                showFloatingText('✗ Wrong keyword!', BLANK_X, BLANK_Y-40, '#FF2D9B');
                tile.x=tile.ox; tile.y=tile.oy;
            }
        } else {
            tile.x=tile.ox; tile.y=tile.oy;
        }
    }

    function draw(){
        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,'#0d0d1a'); bg.addColorStop(1,'#0a1a0a');
        ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);
        if(!currentQ) return;

        ctx.fillStyle='#FF2D9B'; ctx.fillRect(0,0,(qIdx/translatedQS.length)*canvas.width,5);

        ctx.save();
        ctx.fillStyle='rgba(0,0,0,0.88)'; ctx.strokeStyle='#FF2D9B44'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.roundRect(20,16,canvas.width-40,170,12); ctx.fill(); ctx.stroke();
        const lines=currentQ.code.split('\n');
        lines.forEach((line,i)=>{
            const ly=44+i*22;
            ctx.font='11px "Courier New"';
            ctx.fillStyle='rgba(255,45,155,0.3)'; ctx.textAlign='right';
            ctx.fillText(i+1,44,ly);
            if(line.includes(currentQ.blank)){
                const parts=line.split(currentQ.blank);
                ctx.fillStyle='#88CC88'; ctx.textAlign='left';
                ctx.fillText(parts[0],54,ly);
                const bw=ctx.measureText(parts[0]).width;
                const filled=blankFilled;
                ctx.save();
                ctx.fillStyle=filled?'rgba(0,245,160,0.2)':'rgba(255,45,155,0.15)';
                ctx.strokeStyle=filled?'#00F5A0':'#FF2D9B'; ctx.lineWidth=2;
                ctx.shadowBlur=filled?20:8; ctx.shadowColor=filled?'#00F5A0':'#FF2D9B';
                ctx.beginPath(); ctx.roundRect(54+bw-2,ly-15,BLANK_W,BLANK_H,6); ctx.fill(); ctx.stroke();
                ctx.font='bold 13px "Courier New"'; ctx.fillStyle=filled?'#00F5A0':'rgba(255,45,155,0.6)';
                ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.shadowBlur=0;
                ctx.fillText(filled||'  ___  ', 54+bw+BLANK_W/2-2, ly-15+BLANK_H/2);
                ctx.restore();
                if(parts[1]){ctx.fillStyle='#88CC88'; ctx.textAlign='left'; ctx.textBaseline='alphabetic'; ctx.fillText(parts[1],54+bw+BLANK_W+4,ly);}
            } else {
                ctx.fillStyle='#88CC88'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
                ctx.fillText(line,54,ly);
            }
        });
        ctx.restore();

        ctx.font='11px Outfit'; ctx.fillStyle='#FF2D9B88'; ctx.textAlign='center';
        ctx.fillText('💡 Drag the correct keyword into the blank ↑', canvas.width/2, 195);

        ctx.save();
        ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(0,canvas.height-75,canvas.width,75);
        ctx.strokeStyle='rgba(255,45,155,0.2)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(0,canvas.height-75); ctx.lineTo(canvas.width,canvas.height-75); ctx.stroke();
        ctx.restore();

        tiles.forEach(t=>{
            if(t.placed||t===drag) return;
            ctx.save();
            ctx.fillStyle=t.col+'33'; ctx.strokeStyle=t.col; ctx.lineWidth=1.8;
            ctx.shadowBlur=8; ctx.shadowColor=t.col;
            ctx.beginPath(); ctx.roundRect(t.x,t.y,t.w,t.h,8); ctx.fill(); ctx.stroke();
            ctx.font='bold 12px "Courier New"'; ctx.fillStyle='#fff';
            ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.shadowBlur=0;
            ctx.fillText(t.name, t.x+t.w/2, t.y+t.h/2);
            ctx.restore();
        });

        if(drag){
            ctx.save();
            ctx.fillStyle=drag.col+'55'; ctx.strokeStyle=drag.col; ctx.lineWidth=2.5;
            ctx.shadowBlur=22; ctx.shadowColor=drag.col;
            ctx.beginPath(); ctx.roundRect(drag.x,drag.y,drag.w,drag.h,8); ctx.fill(); ctx.stroke();
            ctx.font='bold 12px "Courier New"'; ctx.fillStyle='#fff'; ctx.shadowBlur=0;
            ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText(drag.name, drag.x+drag.w/2, drag.y+drag.h/2);
            ctx.restore();
        }

        for(let i=sparks.length-1;i>=0;i--){
            const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.life-=0.03;
            if(s.life<=0){sparks.splice(i,1);continue;}
            ctx.save(); ctx.globalAlpha=s.life; ctx.fillStyle=s.col;
            ctx.shadowBlur=8; ctx.shadowColor=s.col;
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore();
        }

        ctx.font='15px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
        let h=''; for(let i=0;i<3;i++) h+=i<lives?'❤️ ':'🖤 ';
        ctx.fillText(h,10,canvas.height-10);
        ctx.font='bold 9px Outfit'; ctx.fillStyle='#FF2D9B66'; ctx.textAlign='right';
        ctx.fillText('Grade '+g+' Python',canvas.width-10,canvas.height-10);
    }

    function onDown(e){
        const {x,y}=gpos(canvas,e);
        for(const t of tiles){
            if(!t.placed && x>=t.x && x<=t.x+t.w && y>=t.y && y<=t.y+t.h){
                drag=t; dox=x-t.x; doy=y-t.y; return;
            }
        }
    }
    function onMove(e){
        if(!drag) return;
        const {x,y}=gpos(canvas,e); drag.x=x-dox; drag.y=y-doy;
    }
    function onUp(){ if(!drag) return; tryDrop(drag); drag=null; }

    canvas.addEventListener('mousedown',onDown);
    canvas.addEventListener('mousemove',onMove);
    canvas.addEventListener('mouseup',onUp);
    canvas.addEventListener('touchstart',onDown,{passive:true});
    canvas.addEventListener('touchmove',e=>{onMove(e.touches[0]);e.preventDefault();},{passive:false});
    canvas.addEventListener('touchend',onUp);

    function loop(){
        if(isOver) return;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        draw(); animId=requestAnimationFrame(loop);
    }
    function end(){
        isOver=true; clearInterval(timerInterval); cancelAnimationFrame(animId);
        score=localScore; finishMission(Math.min(100,~~((localScore/(translatedQS.length*20))*100)),0);
    }
    timerInterval=setInterval(()=>{gameTime--;updateTimer(gameTime);if(gameTime<=0||lives<=0)end();},1000);
    updateTimer(gameTime); nextQ(); loop();
}

/* ================================================================
   PYTHON DEBUG (Grades 9-10)
   ================================================================ */

async function pythonDebug(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const ALL_BUGS = {
        9:[
            { title:'Fix the function call',
              code:['def greet(name):','    print("Hello, " + name)','greet()  ← BUG'],
              bugLine:2, fix:'greet("Alice")', wrong:['greet[name]','greet = "Alice"','greet.call()'],
              fact:'Pass required argument: greet("Alice")' },
            { title:'Fix list index',
              code:['nums = [10, 20, 30]','print(nums[3])  ← BUG'],
              bugLine:1, fix:'print(nums[2])', wrong:['print(nums[4])','print(nums[0:4])','print(nums[−1:])'],
              fact:'Valid indices for 3-item list: 0, 1, 2' },
            { title:'Fix string + int',
              code:['age = 20','print("Age: " + age)  ← BUG'],
              bugLine:1, fix:'print("Age: " + str(age))', wrong:['print("Age: " + int(age))','print("Age: ",age,)','print("Age:"age)'],
              fact:'str(age) converts int to string for concatenation' },
            { title:'Fix indentation',
              code:['def square(n):','    result = n * n','print(result)  ← BUG'],
              bugLine:2, fix:'    return result', wrong:['return n*n','    print(result)','result = square(5)'],
              fact:'return must be indented inside the function body' },
            { title:'Fix comparison type',
              code:['x = "5"','if x == 5:  ← BUG','    print("Five")'],
              bugLine:1, fix:'if int(x) == 5:', wrong:['if x = 5:','if x is 5:','if x like 5:'],
              fact:'"5" (str) != 5 (int) — use int(x) to convert first' },
        ],
        10:[
            { title:'Fix missing base case',
              code:['def factorial(n):','    return n * factorial(n-1)  ← BUG'],
              bugLine:1, fix:'    if n==0: return 1\n    return n*(n-1)', wrong:['    return 1','    if n>0: return n','    while n: return n'],
              fact:'Base case n==0 prevents infinite recursion' },
            { title:'Fix KeyError',
              code:['d = {"a":1,"b":2}','val = d["c"]  ← BUG'],
              bugLine:1, fix:'val = d.get("c",0)', wrong:['val = d["c"] or 0','val = d.find("c")','val = d.setdefault("c")'],
              fact:'.get(key, default) safely returns default if key missing' },
            { title:'Fix scope error',
              code:['total = 0','def add(x):','    total += x  ← BUG'],
              bugLine:2, fix:'    global total\n    total += x', wrong:['    local total\n    total+=x','    total = x','    return total+x'],
              fact:'"global total" tells Python to use the outer variable' },
            { title:'Fix mutable default',
              code:['def append_to(val,lst=[]):  ← BUG','    lst.append(val)','    return lst'],
              bugLine:0, fix:'def append_to(val,lst=None):\n    if lst is None:lst=[]', wrong:['def append_to(val,lst=list):','def append_to(val,*lst):','def append_to(val,lst={}):'],
              fact:'Mutable defaults persist between calls — use None instead' },
        ]
    };
    const BUGS = ALL_BUGS[g] || ALL_BUGS[9];
    
    // Translate all text content
    const translatedBugs = [];
    for (const bug of BUGS) {
        const textsToTranslate = [bug.title, bug.fix, ...bug.wrong, bug.fact];
        const translated = await translateTexts(textsToTranslate);
        const wrongCount = bug.wrong.length;
        translatedBugs.push({
            ...bug,
            title: translated[0],
            fix: translated[1],
            wrong: translated.slice(2, 2 + wrongCount),
            fact: translated[2 + wrongCount]
        });
    }

    const TILE_W=canvas.width/4-12, TILE_H=38;
    let qIdx=0, currentBug=null, tiles=[], drag=null, dox=0, doy=0;
    let localScore=0, lives=3, gameTime=100, isOver=false, animId;
    let sparks=[], fixApplied=false;

    function nextQ(){
        if(qIdx>=translatedBugs.length){end();return;}
        const raw=translatedBugs[qIdx]; qIdx++;
        currentBug=raw;
        const all=[raw.fix,...raw.wrong].sort(()=>Math.random()-0.5);
        tiles=all.map((name,i)=>({
            name, ok:name===raw.fix,
            x:8+i*(TILE_W+8), y:canvas.height-52,
            ox:8+i*(TILE_W+8), oy:canvas.height-52,
            w:TILE_W, h:TILE_H,
            col:['#00C3FF','#FFD700','#FF2D9B','#00F5A0'][i%4],
            placed:false
        }));
        fixApplied=false; drag=null;
    }

    function spawnSparks(x,y,col){
        for(let i=0;i<18;i++) sparks.push({x,y,vx:(Math.random()-.5)*9,vy:(Math.random()-.5)*9,life:1,col,r:3});
    }

    function bugLineY(){ return 56+currentBug.bugLine*22+8; }

    function tryDrop(tile){
        const cx=tile.x+tile.w/2, cy=tile.y+tile.h/2;
        const bly=bugLineY();
        if(cy>=bly-20 && cy<=bly+34 && cx>=20 && cx<=canvas.width-20){
            if(tile.ok){
                fixApplied=true; tile.placed=true;
                spawnSparks(canvas.width/2, bly, '#00F5A0');
                localScore+=25; score=localScore; updateHUD(localScore);
                showFloatingText('🐛 Fixed! +25', canvas.width/2, bly-40, '#00F5A0');
                showFloatingText('📚 '+currentBug.fact, canvas.width/2, canvas.height/2, '#00C3FF');
                updateProgress(Math.min(100,~~((qIdx/translatedBugs.length)*100)));
                setTimeout(nextQ,1800);
            } else {
                lives--; updateHealth(Math.max(0,(lives/3)*100));
                shakeCanvas(canvas); spawnSparks(canvas.width/2,bly,'#FF2D9B');
                showFloatingText('✗ Still buggy!', canvas.width/2, bly-30, '#FF2D9B');
                tile.x=tile.ox; tile.y=tile.oy;
            }
        } else {
            tile.x=tile.ox; tile.y=tile.oy;
        }
    }

    function draw(){
        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,'#100010'); bg.addColorStop(1,'#080010');
        ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);
        if(!currentBug) return;

        ctx.save(); ctx.font='11px "Courier New"'; ctx.fillStyle='rgba(255,45,155,0.04)';
        for(let i=0;i<10;i++) ctx.fillText(Math.random()>0.5?'1':'0',i*60+Math.sin(Date.now()*.001+i)*5,((Date.now()*0.035+i*75)%canvas.height));
        ctx.restore();

        ctx.save();
        ctx.fillStyle='rgba(0,0,0,0.8)'; ctx.strokeStyle='rgba(255,45,155,0.4)'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.roundRect(12,6,canvas.width-24,34,8); ctx.fill(); ctx.stroke();
        ctx.font='bold 12px Outfit'; ctx.fillStyle='#FF2D9B'; ctx.textAlign='center';
        ctx.fillText('🐛 DEBUG HUNT: '+currentBug.title, canvas.width/2, 28); ctx.restore();

        const codeH=currentBug.code.length*22+20;
        ctx.save();
        ctx.fillStyle='rgba(0,0,0,0.85)'; ctx.strokeStyle='#333'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.roundRect(14,46,canvas.width-28,codeH,8); ctx.fill(); ctx.stroke();
        currentBug.code.forEach((line,i)=>{
            const isBug=i===currentBug.bugLine, ly=56+i*22;
            if(isBug){
                ctx.fillStyle=fixApplied?'rgba(0,245,160,0.15)':'rgba(255,45,155,0.15)';
                ctx.fillRect(14,ly-14,canvas.width-28,22);
                ctx.strokeStyle=fixApplied?'#00F5A0':'rgba(255,45,155,0.6)';
                ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
                ctx.strokeRect(14,ly-14,canvas.width-28,22); ctx.setLineDash([]);
            }
            ctx.font='11px "Courier New"';
            ctx.fillStyle='rgba(255,45,155,0.35)'; ctx.textAlign='right';
            ctx.fillText(i+1, 36, ly);
            ctx.textAlign='left';
            if(isBug){
                const cleanLine=line.replace('← BUG','').trim();
                ctx.fillStyle=fixApplied?'#00F5A0':'#FF8888';
                ctx.fillText(fixApplied?('✓ '+currentBug.fix.split('\n')[0]):cleanLine, 44, ly);
                if(!fixApplied){
                    ctx.fillStyle='rgba(255,100,100,0.7)';
                    ctx.font='9px Outfit'; ctx.fillText('↑ drag fix tile here', 44, ly+13);
                }
            } else {
                ctx.fillStyle='#88CC88'; ctx.fillText(line,44,ly);
            }
        });
        ctx.restore();

        ctx.fillStyle='#FF2D9B'; ctx.fillRect(0,0,(qIdx/translatedBugs.length)*canvas.width,5);

        ctx.save();
        ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(0,canvas.height-70,canvas.width,70);
        ctx.strokeStyle='rgba(255,45,155,0.2)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(0,canvas.height-70); ctx.lineTo(canvas.width,canvas.height-70); ctx.stroke();
        ctx.font='9px Outfit'; ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.textAlign='center';
        ctx.fillText('Drag the correct fix onto the highlighted line ↑', canvas.width/2, canvas.height-58);
        ctx.restore();

        tiles.forEach(t=>{
            if(t.placed||t===drag) return;
            ctx.save();
            ctx.fillStyle=t.col+'33'; ctx.strokeStyle=t.col; ctx.lineWidth=1.8;
            ctx.shadowBlur=6; ctx.shadowColor=t.col;
            ctx.beginPath(); ctx.roundRect(t.x,t.y,t.w,t.h,8); ctx.fill(); ctx.stroke();
            ctx.font='9px "Courier New"'; ctx.fillStyle='#fff'; ctx.shadowBlur=0;
            ctx.textAlign='center'; ctx.textBaseline='middle';
            const disp=t.name.split('\n')[0];
            ctx.fillText(disp.length>22?disp.slice(0,21)+'…':disp, t.x+t.w/2, t.y+t.h/2);
            ctx.restore();
        });

        if(drag){
            ctx.save();
            ctx.fillStyle=drag.col+'55'; ctx.strokeStyle=drag.col; ctx.lineWidth=2.5;
            ctx.shadowBlur=20; ctx.shadowColor=drag.col;
            ctx.beginPath(); ctx.roundRect(drag.x,drag.y,drag.w,drag.h,8); ctx.fill(); ctx.stroke();
            ctx.font='9px "Courier New"'; ctx.fillStyle='#fff'; ctx.shadowBlur=0;
            ctx.textAlign='center'; ctx.textBaseline='middle';
            const disp=drag.name.split('\n')[0];
            ctx.fillText(disp.length>22?disp.slice(0,21)+'…':disp, drag.x+drag.w/2, drag.y+drag.h/2);
            ctx.restore();
        }

        for(let i=sparks.length-1;i>=0;i--){
            const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.life-=0.03;
            if(s.life<=0){sparks.splice(i,1);continue;}
            ctx.save(); ctx.globalAlpha=s.life; ctx.fillStyle=s.col;
            ctx.shadowBlur=8; ctx.shadowColor=s.col;
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore();
        }

        ctx.font='15px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
        let h=''; for(let i=0;i<3;i++) h+=i<lives?'❤️ ':'🖤 ';
        ctx.fillText(h,10,canvas.height-10);
    }

    function onDown(e){
        const {x,y}=gpos(canvas,e);
        for(const t of tiles){
            if(!t.placed && x>=t.x && x<=t.x+t.w && y>=t.y && y<=t.y+t.h){
                drag=t; dox=x-t.x; doy=y-t.y; return;
            }
        }
    }
    function onMove(e){
        if(!drag) return;
        const {x,y}=gpos(canvas,e); drag.x=x-dox; drag.y=y-doy;
    }
    function onUp(){ if(!drag) return; tryDrop(drag); drag=null; }

    canvas.addEventListener('mousedown',onDown);
    canvas.addEventListener('mousemove',onMove);
    canvas.addEventListener('mouseup',onUp);
    canvas.addEventListener('touchstart',onDown,{passive:true});
    canvas.addEventListener('touchmove',e=>{onMove(e.touches[0]);e.preventDefault();},{passive:false});
    canvas.addEventListener('touchend',onUp);

    function loop(){
        if(isOver) return;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        draw(); animId=requestAnimationFrame(loop);
    }
    function end(){
        isOver=true; clearInterval(timerInterval); cancelAnimationFrame(animId);
        score=localScore; finishMission(Math.min(100,~~((localScore/(translatedBugs.length*25))*100)),0);
    }
    timerInterval=setInterval(()=>{gameTime--;updateTimer(gameTime);if(gameTime<=0||lives<=0)end();},1000);
    updateTimer(gameTime); nextQ(); loop();
}

/* ================================================================
   PYTHON DRAG (Grades 11-12)
   ================================================================ */

async function pythonDrag(g) {
    const canvas = document.getElementById('gameCanvas');
    const ctx    = canvas.getContext('2d');

    const PUZZLES = {
        11:[
            { title:'Build a Class',
              goal:'Define Dog class with bark method',
              blocks:['class Dog:','    def __init__(self,name):','        self.name = name','    def bark(self):','        return "Woof!"','    name = self  # WRONG','    return dog  # WRONG'],
              correct:[0,1,2,3,4], hint:'Constructor: self.name=name. Method returns string.' },
            { title:'List Comprehension',
              goal:'One-liner: even numbers 0-9',
              blocks:['evens=[]','evens=[x for x in range(10) if x%2==0]','evens=[x for x in range(10)]','evens=filter(even,range(10))','for x in range(10): evens.append(x)'],
              correct:[1], hint:'[expr for item in iterable if condition]' },
            { title:'Exception Handling',
              goal:'Safe division with try/except',
              blocks:['def safe_div(a,b):','    try:','        return a/b','    except ZeroDivisionError:','        return None','    catch ZeroDivisionError:  # WRONG','    finally: return 0  # WRONG'],
              correct:[0,1,2,3,4], hint:'try→except ZeroDivisionError→return None' },
        ],
        12:[
            { title:'Recursive Fibonacci',
              goal:'Correct recursive fib(n)',
              blocks:['def fib(n):','    if n<=1: return n','    if n<=1: return 1  # WRONG','    return fib(n-1)+fib(n-2)','    return fib(n)+fib(n-1)  # WRONG'],
              correct:[0,1,3], hint:'Base: fib(0)=0,fib(1)=1. Recurse: fib(n-1)+fib(n-2)' },
            { title:'NumPy Mean',
              goal:'Create array and compute mean',
              blocks:['import numpy as np','import numpy','arr = np.array([1,2,3,4,5])','arr = numpy.array([1,2,3])','mean = arr.mean()','mean = np.mean(arr)'],
              correct:[0,2,4], hint:'import numpy as np → arr.mean()' },
            { title:'Bubble Sort',
              goal:'Correct bubble sort implementation',
              blocks:['def bubble_sort(arr):','    for i in range(len(arr)-1):','        for j in range(len(arr)-1-i):','            if arr[j]>arr[j+1]:','                arr[j],arr[j+1]=arr[j+1],arr[j]','                arr[j]=arr[j+1]  # WRONG','    return arr'],
              correct:[0,1,2,3,4,6], hint:'Nested loops + swap adjacent. Return arr at end.' },
        ]
    };
    const puzzleSet = PUZZLES[g] || PUZZLES[11];
    
    // Translate puzzle titles, goals, and hints
    const translatedPuzzles = [];
    for (const p of puzzleSet) {
        const textsToTranslate = [p.title, p.goal, p.hint];
        const translated = await translateTexts(textsToTranslate);
        translatedPuzzles.push({
            ...p,
            title: translated[0],
            goal: translated[1],
            hint: translated[2]
        });
    }

    const BH=34, BW=canvas.width-60, BX=30;
    let pIdx=0, currentP=null, blocks=[], slots=[], drag=null, dox=0, doy=0;
    let localScore=0, lives=3, gameTime=120, isOver=false, animId;
    let sparks=[];

    function loadPuzzle(){
        if(pIdx>=translatedPuzzles.length){end();return;}
        currentP=translatedPuzzles[pIdx]; pIdx++;
        blocks=currentP.blocks.map((code,i)=>({
            id:i, code,
            x:BX, y:72+i*(BH+6), ox:BX, oy:72+i*(BH+6),
            w:BW, h:BH, placed:false
        }));
        slots=currentP.correct.map((expects,i)=>({
            idx:i, expects,
            x:BX, y:canvas.height-270+i*(BH+6),
            w:BW, h:BH, filled:-1
        }));
        drag=null;
    }

    function spawnSparks(x,y,col){
        for(let i=0;i<16;i++) sparks.push({x,y,vx:(Math.random()-.5)*9,vy:(Math.random()-.5)*9,life:1,col,r:3});
    }

    function checkAnswer(){
        if(slots.every(s=>s.filled===s.expects)){
            localScore+=40; score=localScore; updateHUD(localScore);
            updateProgress(~~((pIdx/translatedPuzzles.length)*100));
            spawnSparks(canvas.width/2,canvas.height/2,'#00F5A0',30);
            showFloatingText('🧩 Perfect! +40',canvas.width/2,canvas.height/2-40,'#00F5A0');
            showFloatingText('💡 '+currentP.hint,canvas.width/2,canvas.height/2+10,'#00C3FF');
            setTimeout(loadPuzzle,1600);
        } else {
            lives--; updateHealth(Math.max(0,(lives/3)*100));
            shakeCanvas(canvas); showFloatingText('Check order/selection!',canvas.width/2,canvas.height/2,'#FF2D9B');
        }
    }

    function draw(){
        const bg=ctx.createLinearGradient(0,0,0,canvas.height);
        bg.addColorStop(0,'#0d0010'); bg.addColorStop(1,'#080018');
        ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);
        if(!currentP) return;

        ctx.save();
        ctx.fillStyle='rgba(0,0,0,0.8)'; ctx.strokeStyle='rgba(255,45,155,0.4)'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.roundRect(10,6,canvas.width-20,52,8); ctx.fill(); ctx.stroke();
        ctx.font='bold 12px Outfit'; ctx.fillStyle='#FF2D9B'; ctx.textAlign='center';
        ctx.fillText('🧩 '+currentP.title,canvas.width/2,24);
        ctx.font='10px Outfit'; ctx.fillStyle='#9B8FC0';
        ctx.fillText('Goal: '+currentP.goal,canvas.width/2,40);
        ctx.restore();

        ctx.font='9px Outfit'; ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.textAlign='left';
        ctx.fillText('Available blocks (drag down):',BX,64);

        blocks.forEach(b=>{
            if(b.placed||b===drag) return;
            const isCorrectBlock=currentP.correct.includes(b.id);
            ctx.save();
            ctx.fillStyle=isCorrectBlock?'rgba(0,195,255,0.08)':'rgba(255,45,155,0.06)';
            ctx.strokeStyle=isCorrectBlock?'rgba(0,195,255,0.3)':'rgba(255,45,155,0.2)';
            ctx.lineWidth=1;
            ctx.beginPath(); ctx.roundRect(b.x,b.y,b.w,b.h,5); ctx.fill(); ctx.stroke();
            ctx.font='10px "Courier New"'; ctx.fillStyle=isCorrectBlock?'#88CCFF':'rgba(255,150,150,0.7)';
            ctx.textAlign='left'; ctx.textBaseline='middle';
            ctx.fillText(b.code.slice(0,55)+(b.code.length>55?'…':''),b.x+8,b.y+b.h/2);
            ctx.restore();
        });

        const divY=canvas.height-285;
        ctx.save();
        ctx.strokeStyle='rgba(255,45,155,0.3)'; ctx.lineWidth=1; ctx.setLineDash([6,6]);
        ctx.beginPath(); ctx.moveTo(20,divY); ctx.lineTo(canvas.width-20,divY); ctx.stroke();
        ctx.setLineDash([]);
        ctx.font='9px Outfit'; ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.textAlign='left';
        ctx.fillText('Drop correct blocks here (in order) — '+currentP.correct.length+' needed:',BX,divY+10);
        ctx.restore();

        slots.forEach((s,i)=>{
            const filled=s.filled>=0;
            const correct=filled&&s.filled===s.expects;
            const col=correct?'#00F5A0':'#FF2D9B';
            ctx.save();
            ctx.fillStyle=filled?(correct?'rgba(0,245,160,0.12)':'rgba(255,45,155,0.1)'):'rgba(255,255,255,0.03)';
            ctx.strokeStyle=filled?col:'rgba(255,255,255,0.12)'; ctx.lineWidth=filled?2:1;
            if(correct){ctx.shadowBlur=12;ctx.shadowColor='#00F5A0';}
            ctx.beginPath(); ctx.roundRect(s.x,s.y,s.w,s.h,5); ctx.fill(); ctx.stroke();
            ctx.shadowBlur=0;
            ctx.font='10px "Courier New"'; ctx.textAlign='left'; ctx.textBaseline='middle';
            ctx.fillStyle=filled?(correct?'#00F5A0':'#FF8888'):'rgba(255,255,255,0.18)';
            const label=filled?currentP.blocks[s.filled]:(i+1+'. ← drop here');
            ctx.fillText(label.slice(0,55)+(label.length>55?'…':''),s.x+8,s.y+s.h/2);
            ctx.restore();
        });

        if(drag){
            ctx.save();
            ctx.fillStyle='rgba(0,195,255,0.25)'; ctx.strokeStyle='#00C3FF'; ctx.lineWidth=2;
            ctx.shadowBlur=18; ctx.shadowColor='#00C3FF';
            ctx.beginPath(); ctx.roundRect(drag.x,drag.y,drag.w,drag.h,5); ctx.fill(); ctx.stroke();
            ctx.font='10px "Courier New"'; ctx.fillStyle='#fff'; ctx.shadowBlur=0;
            ctx.textAlign='left'; ctx.textBaseline='middle';
            ctx.fillText(drag.code.slice(0,55),drag.x+8,drag.y+drag.h/2);
            ctx.restore();
        }

        ctx.save();
        ctx.fillStyle='rgba(0,245,160,0.15)'; ctx.strokeStyle='rgba(0,245,160,0.5)'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.roundRect(canvas.width-118,canvas.height-46,108,32,8); ctx.fill(); ctx.stroke();
        ctx.font='bold 12px Outfit'; ctx.fillStyle='#00F5A0';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('✓ CHECK',canvas.width-64,canvas.height-30);
        ctx.restore();

        ctx.font='9px Outfit'; ctx.fillStyle='rgba(255,215,0,0.45)'; ctx.textAlign='left';
        ctx.textBaseline='alphabetic';
        ctx.fillText('💡 '+currentP.hint,10,canvas.height-10);

        ctx.fillStyle='#FF2D9B'; ctx.fillRect(0,0,(pIdx/translatedPuzzles.length)*canvas.width,5);

        for(let i=sparks.length-1;i>=0;i--){
            const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.life-=0.03;
            if(s.life<=0){sparks.splice(i,1);continue;}
            ctx.save(); ctx.globalAlpha=s.life; ctx.fillStyle=s.col;
            ctx.shadowBlur=8; ctx.shadowColor=s.col;
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore();
        }

        ctx.font='15px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
        let h=''; for(let i=0;i<3;i++) h+=i<lives?'❤️ ':'🖤 ';
        ctx.fillText(h,10,canvas.height-30);
    }

    function onDown(e){
        const {x,y}=gpos(canvas,e);
        if(x>=canvas.width-118&&x<=canvas.width-10&&y>=canvas.height-46&&y<=canvas.height-14){checkAnswer();return;}
        for(const b of blocks){
            if(!b.placed&&x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){drag=b;dox=x-b.x;doy=y-b.y;return;}
        }
        for(const s of slots){
            if(s.filled>=0&&x>=s.x&&x<=s.x+s.w&&y>=s.y&&y<=s.y+s.h){
                const b=blocks[s.filled]; b.placed=false; b.x=s.x; b.y=s.y;
                s.filled=-1; drag=b; dox=x-b.x; doy=y-b.y; return;
            }
        }
    }
    function onMove(e){
        if(!drag) return;
        const {x,y}=gpos(canvas,e); drag.x=x-dox; drag.y=y-doy;
    }
    function onUp(){
        if(!drag) return;
        let dropped=false;
        for(const s of slots){
            const cx=drag.x+drag.w/2, cy=drag.y+drag.h/2;
            if(cx>=s.x&&cx<=s.x+s.w&&cy>=s.y&&cy<=s.y+s.h&&s.filled<0){
                s.filled=drag.id; drag.placed=true; dropped=true; break;
            }
        }
        if(!dropped){drag.placed=false;drag.x=drag.ox;drag.y=drag.oy;}
        drag=null;
    }
    canvas.addEventListener('mousedown',onDown);
    canvas.addEventListener('mousemove',onMove);
    canvas.addEventListener('mouseup',onUp);
    canvas.addEventListener('touchstart',onDown,{passive:true});
    canvas.addEventListener('touchmove',e=>{onMove(e.touches[0]);e.preventDefault();},{passive:false});
    canvas.addEventListener('touchend',onUp);

    function loop(){
        if(isOver) return;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        draw(); animId=requestAnimationFrame(loop);
    }
    function end(){
        isOver=true; clearInterval(timerInterval); cancelAnimationFrame(animId);
        score=localScore; finishMission(Math.min(100,~~((localScore/(translatedPuzzles.length*40))*100)),0);
    }
    timerInterval=setInterval(()=>{gameTime--;updateTimer(gameTime);if(gameTime<=0||lives<=0)end();},1000);
    updateTimer(gameTime); loadPuzzle(); loop();
}

/* ================================================================
   END OF GAME ENGINE v5.0 (Fully Translated)
   ================================================================ */
  // Expose entry points on window so React can call them.
  (window as any).runShikshaGame = async function(subject: string, grade: number) {
    (window as any).SUBJECT = subject;
    (window as any).GRADE = grade;
    // @ts-ignore - defined in pasted engine
    await initGame();
  };
}
