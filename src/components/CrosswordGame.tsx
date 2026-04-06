import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Zap, CheckCircle, XCircle } from "lucide-react";

export interface CrosswordClue {
  id: string;
  clue: string;
  answer: string;
  direction: "across" | "down";
  subject: string;
}

interface Props {
  clues: CrosswordClue[];
  onBack: () => void;
  onComplete: (xpEarned: number, correctCount: number) => void;
}

export default function CrosswordGame({ clues, onBack, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!clues.length) return <div className="text-center p-8">No crossword clues available.</div>;

  const clue = clues[current];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answered) return;
    setAnswered(true);
    const isCorrect = guess.trim().toLowerCase() === clue.answer.toLowerCase();
    setCorrect(isCorrect);
    if (isCorrect) {
      setTotalXp((p) => p + 12);
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (current < clues.length - 1) {
      setCurrent((c) => c + 1);
      setGuess("");
      setAnswered(false);
      setCorrect(false);
    } else {
      setFinished(true);
      onComplete(totalXp, correctCount);
    }
  };

  if (finished) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-7xl mb-6">🧩</div>
        <h2 className="text-3xl font-bold mb-2">Crossword Complete!</h2>
        <p className="text-muted-foreground mb-2">{correctCount}/{clues.length} correct</p>
        <div className="flex items-center gap-2 text-xp text-2xl font-bold mb-6"><Zap className="w-7 h-7" /> +{totalXp} XP</div>
        <Button onClick={onBack} size="lg" className="rounded-full px-8">Back to Dashboard</Button>
      </motion.div>
    );
  }

  // Visual: show letter boxes for the answer
  const letterCount = clue.answer.length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="rounded-full"><ArrowLeft className="w-5 h-5 mr-1" /> Back</Button>
        <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm border border-border"><Zap className="w-4 h-4 text-xp" /><span className="font-bold">{totalXp} XP</span></div>
      </div>
      <div className="flex gap-1.5 mb-8">
        {clues.map((_, i) => (<div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i < current ? "bg-primary" : i === current ? "bg-secondary" : "bg-muted"}`} />))}
      </div>
      <div className="text-center mb-6">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${clue.direction === "across" ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary/10 text-secondary border-secondary/30"}`}>
          {clue.direction === "across" ? "→ Across" : "↓ Down"}
        </span>
        <p className="text-xs text-muted-foreground mt-2">Clue {current + 1} of {clues.length}</p>
      </div>
      <h2 className="text-xl font-bold mb-6 text-center">{clue.clue}</h2>
      {/* Letter boxes hint */}
      <div className="flex justify-center gap-1.5 mb-6">
        {Array.from({ length: letterCount }).map((_, i) => (
          <div key={i} className={`w-9 h-10 rounded-lg border-2 flex items-center justify-center text-lg font-bold ${answered ? (correct ? "border-primary bg-primary/10 text-primary" : "border-destructive bg-destructive/10 text-destructive") : "border-border bg-card"}`}>
            {answered ? clue.answer[i]?.toUpperCase() : (guess[i]?.toUpperCase() || "")}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto mb-6">
        <Input value={guess} onChange={(e) => setGuess(e.target.value)} placeholder={`${letterCount} letters...`} className="rounded-xl text-center uppercase tracking-widest font-bold" disabled={answered} autoFocus maxLength={letterCount + 2} />
        {!answered && <Button type="submit" className="rounded-xl px-6">Check</Button>}
      </form>
      {answered && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className={`flex items-center justify-center gap-2 text-lg font-bold mb-2 ${correct ? "text-primary" : "text-destructive"}`}>
            {correct ? <><CheckCircle className="w-5 h-5" /> Correct!</> : <><XCircle className="w-5 h-5" /> Answer: {clue.answer}</>}
          </div>
          <Button onClick={handleNext} size="lg" className="rounded-full px-8 mt-4">{current < clues.length - 1 ? "Next Clue" : "Finish 🎉"}</Button>
        </motion.div>
      )}
    </div>
  );
}
