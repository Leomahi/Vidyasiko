import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Language } from "@/lib/translations";
import { CanvasMCQ, MCQResult, startMCQEngine } from "./gameUtils";

interface Props {
  title: string;
  emoji: string;
  questions: CanvasMCQ[];
  language: Language;
  accent: string;
  bgGradient?: [string, string];
  totalTime?: number;
  onBack: () => void;
  onComplete: (xpEarned: number, correctCount: number) => void;
}

/**
 * Generic shell used by every canvas game. Renders the canvas + back button,
 * starts the MCQ engine, and shows results.
 */
export default function CanvasGameShell({
  title, emoji, questions, language, accent, bgGradient, totalTime = 60, onBack, onComplete,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [result, setResult] = useState<MCQResult | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || result) return;
    const stop = startMCQEngine({
      canvas: canvasRef.current,
      questions,
      language,
      accent,
      bgGradient,
      totalTime,
      onComplete: (r) => {
        if (completedRef.current) return;
        completedRef.current = true;
        setResult(r);
        const xp = r.correct * 12 + Math.floor(r.score / 5);
        onComplete(xp, r.correct);
      },
    });
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-card rounded-3xl p-8 shadow-sm border border-border text-center"
      >
        <Trophy className="w-16 h-16 mx-auto text-xp mb-3" />
        <h2 className="text-3xl font-bold mb-1">Game Complete!</h2>
        <p className="text-muted-foreground mb-6">{title}</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Stat label="Score" value={result.score} />
          <Stat label="Correct" value={`${result.correct}/${result.total}`} />
          <Stat label="Accuracy" value={`${result.accuracyPct}%`} />
        </div>
        <Button onClick={onBack} className="w-full rounded-xl">Back to Games</Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Button>
        <h2 className="text-xl font-bold">
          <span className="mr-2">{emoji}</span>{title}
        </h2>
        <div className="w-20" />
      </div>
      <div className="rounded-3xl overflow-hidden border border-border shadow-lg bg-black">
        <canvas
          ref={canvasRef}
          width={720}
          height={520}
          className="w-full h-auto block touch-none"
          style={{ imageRendering: "auto" }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center mt-3">
        Tap an answer. You get bonus points for combos!
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
