import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Zap, Trophy, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { installEngine } from "./originalEngine";

interface Result { score: number; accuracy: number; time: number; }

interface Props {
  subject: "physics" | "chemistry" | "biology" | "maths" | "python";
  grade: number;
  title: string;
  emoji: string;
  onBack: () => void;
  onComplete: (xpEarned: number, correctCount: number) => void;
}

/** Subject-specific tips shown when the player loses (low score finish). */
const SOLUTION_HINTS: Record<Props["subject"], string[]> = {
  physics: [
    "Remember F = m · a — force equals mass times acceleration.",
    "Energy is conserved: KE + PE stays constant in a closed system.",
    "For projectiles, horizontal and vertical motion are independent.",
  ],
  chemistry: [
    "Balance atoms on both sides of the equation before coefficients.",
    "Acids donate H⁺; bases accept them. pH < 7 is acidic.",
    "Electrons fill orbitals: 1s, 2s, 2p, 3s, 3p, 4s, 3d…",
  ],
  biology: [
    "Mitochondria are the powerhouse of the cell — they make ATP.",
    "DNA bases pair A↔T and G↔C.",
    "Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.",
  ],
  maths: [
    "PEMDAS: Parentheses → Exponents → ×÷ → +−.",
    "For quadratics, try factoring before the formula.",
    "Derivative of xⁿ is n·xⁿ⁻¹.",
  ],
  python: [
    "Indentation matters — use 4 spaces consistently.",
    "`==` compares values; `=` assigns. Don't mix them up.",
    "Lists are mutable; tuples are not.",
  ],
};

export default function OriginalGameShell({ subject, grade, title, emoji, onBack, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    installEngine();
    // Provide the completion callback the engine calls.
    (window as any).showMissionComplete = (score: number, accuracy: number, time: number) => {
      if (completedRef.current) return;
      completedRef.current = true;
      const xp = Math.max(10, Math.round(score / 4));
      const correct = Math.max(1, Math.round(score / 25));
      const failed = score < 30 || accuracy < 25;
      setResult({ score, accuracy, time });
      // Show learning panel first if the player lost; XP awarded either way.
      if (failed) setShowSolution(true);
      onComplete(xp, correct);
    };

    // Wait one frame so the DOM ids are mounted, then start.
    const id = requestAnimationFrame(() => {
      try {
        (window as any).runShikshaGame?.(subject, grade);
      } catch (err) {
        console.error("[engine] failed to start", err);
      }
    });

    return () => {
      cancelAnimationFrame(id);
      // Best-effort cleanup of any intervals the engine left running.
      // Engine uses module-level `timerInterval` & `spawnInterval`; clearing
      // a wide range of recent ids is the simplest safe stop.
      const top = window.setTimeout(() => {}, 0) as unknown as number;
      for (let i = top; i > top - 500 && i > 0; i--) {
        clearInterval(i);
        clearTimeout(i);
      }
      completedRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showSolution && result) {
    const tips = SOLUTION_HINTS[subject] ?? [];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-card rounded-3xl p-8 shadow-sm border border-border"
      >
        <div className="text-center mb-4">
          <Lightbulb className="w-14 h-14 mx-auto text-accent mb-2" />
          <h2 className="text-2xl font-bold">Don't worry — let's learn!</h2>
          <p className="text-muted-foreground text-sm mt-1">
            You ran out of lives in {title}. Here's the answer key:
          </p>
        </div>
        <ul className="space-y-3 mb-6">
          {tips.map((tip, i) => (
            <li
              key={i}
              className="bg-muted/40 rounded-xl p-3 text-sm leading-relaxed"
            >
              <span className="font-bold text-primary mr-2">{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
        <Button onClick={() => setShowSolution(false)} className="w-full rounded-xl">
          Got it — show my score
        </Button>
      </motion.div>
    );
  }

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-card rounded-3xl p-8 shadow-sm border border-border text-center"
      >
        <Trophy className="w-16 h-16 mx-auto text-xp mb-3" />
        <h2 className="text-3xl font-bold mb-1">Mission Complete!</h2>
        <p className="text-muted-foreground mb-6">{title} · Grade {grade}</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Stat label="Score" value={result.score} />
          <Stat label="Accuracy" value={`${result.accuracy}%`} />
        </div>
        <Button onClick={onBack} className="w-full rounded-xl">Back to Games</Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Button>
        <h2 className="text-lg font-bold">
          <span className="mr-2">{emoji}</span><span id="levelTitle">{title}</span>
        </h2>
        <div className="w-20" />
      </div>

      {/* HUD — element ids the engine writes to */}
      <div className="grid grid-cols-4 gap-2 mb-3 text-xs">
        <div className="bg-muted/40 rounded-xl p-2 text-center">
          <div className="text-muted-foreground">Score</div>
          <div id="scoreDisplay" className="font-bold text-lg">0</div>
        </div>
        <div className="bg-muted/40 rounded-xl p-2 text-center">
          <div className="text-muted-foreground flex items-center justify-center gap-1"><Zap className="w-3 h-3"/>Combo</div>
          <div id="comboDisplay" className="font-bold text-lg">x1</div>
        </div>
        <div className="bg-muted/40 rounded-xl p-2 text-center">
          <div className="text-muted-foreground">Time</div>
          <div id="timerDisplay" className="font-bold text-lg">1:00</div>
        </div>
        <div className="bg-muted/40 rounded-xl p-2 text-center">
          <div className="text-muted-foreground flex items-center justify-center gap-1"><Heart className="w-3 h-3"/>Health</div>
          <div id="healthPct" className="font-bold text-lg">100%</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div id="healthBar" className="h-full bg-rose-500 transition-all" style={{ width: "100%" }} />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>Progress</span><span id="progressPct">0%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden mt-1">
          <div id="progressBar" className="h-full bg-primary transition-all" style={{ width: "0%" }} />
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden border border-border shadow-lg bg-black">
        <canvas
          ref={canvasRef}
          id="gameCanvas"
          width={720}
          height={520}
          className="w-full h-auto block touch-none"
          style={{ imageRendering: "auto" }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center mt-3">
        Tap / click to play. Bonus points for combos!
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-muted/40 rounded-2xl p-3">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
