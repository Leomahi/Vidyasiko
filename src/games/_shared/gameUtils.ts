/**
 * Shared canvas game utilities ported from the original Flask STEM games engine.
 * Provides a reusable MCQ-on-canvas engine plus particle/visual helpers.
 */
import { Language } from "@/lib/translations";

export interface CanvasMCQ {
  q: string;
  choices: string[];   // length 4
  answer: number;      // index of correct
  // Optional translations: { hi: { q, choices }, ta: ... }
  i18n?: Partial<Record<Language, { q: string; choices: string[] }>>;
}

export interface MCQResult {
  score: number;
  correct: number;
  total: number;
  accuracyPct: number;
  timeTaken: number;
}

export function localizeQuestion(q: CanvasMCQ, lang: Language): { q: string; choices: string[]; answer: number } {
  const tr = q.i18n?.[lang];
  if (tr && tr.q && tr.choices && tr.choices.length === q.choices.length) {
    return { q: tr.q, choices: tr.choices, answer: q.answer };
  }
  return { q: q.q, choices: q.choices, answer: q.answer };
}

export function shuffleQuestion(q: CanvasMCQ, lang: Language) {
  const local = localizeQuestion(q, lang);
  const correctText = local.choices[local.answer];
  const shuffled = [...local.choices].sort(() => Math.random() - 0.5);
  return { q: local.q, choices: shuffled, answer: shuffled.indexOf(correctText) };
}

export function shake(el: HTMLElement) {
  el.style.transition = "transform 60ms";
  let i = 0;
  const seq = [-6, 6, -4, 4, -2, 2, 0];
  const id = setInterval(() => {
    el.style.transform = `translateX(${seq[i]}px)`;
    i++;
    if (i >= seq.length) clearInterval(id);
  }, 60);
}

export interface Particle {
  x: number; y: number; vx: number; vy: number; life: number; maxLife: number; col: string; r: number;
}

export function makeBurst(x: number, y: number, col: string, n = 18): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 1 + Math.random() * 4;
    out.push({
      x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      life: 0, maxLife: 30 + Math.random() * 30, col, r: 2 + Math.random() * 3,
    });
  }
  return out;
}

export function drawParticles(ctx: CanvasRenderingContext2D, parts: Particle[]) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life++;
    if (p.life > p.maxLife) { parts.splice(i, 1); continue; }
    const alpha = 1 - p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.col;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/**
 * Render an MCQ on a canvas with 4 answer buttons, click to answer.
 * Calls onAnswer with whether it was correct after each selection.
 */
export interface MCQEngineOptions {
  canvas: HTMLCanvasElement;
  questions: CanvasMCQ[];
  language: Language;
  accent: string;        // CSS color for highlights
  bgGradient?: [string, string];
  totalTime?: number;    // seconds, default 60
  onComplete: (result: MCQResult) => void;
}

export function startMCQEngine(opts: MCQEngineOptions): () => void {
  const { canvas, questions, language, accent, totalTime = 60, onComplete } = opts;
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = canvas.height;
  const bg = opts.bgGradient ?? ["#0b1224", "#1a1140"];

  let qIndex = 0;
  let score = 0;
  let correct = 0;
  let combo = 0;
  let parts: Particle[] = [];
  let startTime = performance.now();
  let endTime = startTime + totalTime * 1000;
  let cur = shuffleQuestion(questions[qIndex], language);
  let stopped = false;
  let feedback: { text: string; color: string; until: number } | null = null;

  const buttons = () => {
    const padX = 40, padY = 40, gap = 16;
    const bw = (W - padX * 2 - gap) / 2;
    const bh = 64;
    const top = H - padY - bh * 2 - gap;
    return cur.choices.map((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      return {
        x: padX + col * (bw + gap),
        y: top + row * (bh + gap),
        w: bw, h: bh, text: c, idx: i,
      };
    });
  };

  function draw() {
    // background
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, bg[0]);
    grad.addColorStop(1, bg[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // glowing accent header bar
    ctx.fillStyle = accent + "33";
    ctx.fillRect(0, 0, W, 48);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Q ${qIndex + 1} / ${questions.length}`, 16, 30);
    ctx.textAlign = "right";
    const remaining = Math.max(0, Math.ceil((endTime - performance.now()) / 1000));
    ctx.fillText(`⏱ ${remaining}s`, W - 16, 30);
    ctx.textAlign = "center";
    ctx.fillStyle = accent;
    ctx.fillText(`★ ${score}   x${combo}`, W / 2, 30);

    // question
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.textAlign = "center";
    wrapText(ctx, cur.q, W / 2, 110, W - 60, 28);

    // buttons
    for (const b of buttons()) {
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      roundRect(ctx, b.x, b.y, b.w, b.h, 14);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "600 17px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(b.text, b.x + b.w / 2, b.y + b.h / 2);
      ctx.textBaseline = "alphabetic";
    }

    drawParticles(ctx, parts);

    if (feedback && performance.now() < feedback.until) {
      ctx.fillStyle = feedback.color;
      ctx.font = "bold 28px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(feedback.text, W / 2, H / 2 - 20);
    }
  }

  function loop() {
    if (stopped) return;
    draw();
    if (performance.now() >= endTime) return finish();
    requestAnimationFrame(loop);
  }

  function nextQ() {
    qIndex++;
    if (qIndex >= questions.length) return finish();
    cur = shuffleQuestion(questions[qIndex], language);
  }

  function handleClick(e: MouseEvent | TouchEvent) {
    const rect = canvas.getBoundingClientRect();
    const point = "touches" in e
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const x = (point.x - rect.left) * sx;
    const y = (point.y - rect.top) * sy;

    for (const b of buttons()) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        const isRight = b.idx === cur.answer;
        if (isRight) {
          correct++;
          combo++;
          score += 10 + combo * 2;
          parts.push(...makeBurst(b.x + b.w / 2, b.y + b.h / 2, accent, 22));
          feedback = { text: "Correct!", color: "#4ade80", until: performance.now() + 600 };
        } else {
          combo = 0;
          parts.push(...makeBurst(b.x + b.w / 2, b.y + b.h / 2, "#ef4444", 16));
          feedback = { text: "Wrong!", color: "#ef4444", until: performance.now() + 600 };
          shake(canvas);
        }
        setTimeout(nextQ, 500);
        return;
      }
    }
  }

  function finish() {
    if (stopped) return;
    stopped = true;
    canvas.removeEventListener("mousedown", handleClick);
    canvas.removeEventListener("touchstart", handleClick as any);
    const timeTaken = (performance.now() - startTime) / 1000;
    const total = questions.length;
    onComplete({
      score,
      correct,
      total,
      accuracyPct: Math.round((correct / total) * 100),
      timeTaken,
    });
  }

  canvas.addEventListener("mousedown", handleClick);
  canvas.addEventListener("touchstart", handleClick as any, { passive: true });
  requestAnimationFrame(loop);

  return () => {
    stopped = true;
    canvas.removeEventListener("mousedown", handleClick);
    canvas.removeEventListener("touchstart", handleClick as any);
  };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
