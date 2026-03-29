import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Language, ScrambleWord } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Zap, CheckCircle, XCircle } from "lucide-react";

function scramble(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join("");
  return result === word ? scramble(word) : result;
}

interface Props {
  language: Language;
  onBack: () => void;
  onComplete: (xpEarned: number, correctCount: number) => void;
  words: ScrambleWord[];
}

export default function WordScramble({ language, onBack, onComplete, words }: Props) {
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const scrambled = useMemo(() => words.map((w) => scramble(w.word)), [words]);
  const w = words[current];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answered) return;
    setAnswered(true);
    const isCorrect = guess.trim().toUpperCase() === w.word;
    setCorrect(isCorrect);
    if (isCorrect) { setTotalXp((p) => p + 15); setCorrectCount((c) => c + 1); }
  };

  const handleNext = () => {
    if (current < words.length - 1) {
      setCurrent((c) => c + 1); setGuess(""); setAnswered(false); setCorrect(false);
    } else { setFinished(true); onComplete(totalXp, correctCount); }
  };

  if (!words.length) return <div className="text-center p-8">No scramble words available.</div>;

  if (finished) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-7xl mb-6">🔤</div>
        <h2 className="text-3xl font-bold mb-2">Word Scramble Complete!</h2>
        <p className="text-muted-foreground mb-2">{correctCount}/{words.length} correct</p>
        <div className="flex items-center gap-2 text-xp text-2xl font-bold mb-6"><Zap className="w-7 h-7" /> +{totalXp} XP</div>
        <Button onClick={onBack} size="lg" className="rounded-full px-8">Back to Dashboard</Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="rounded-full"><ArrowLeft className="w-5 h-5 mr-1" /> Back</Button>
        <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm border border-border"><Zap className="w-4 h-4 text-xp" /><span className="font-bold">{totalXp} XP</span></div>
      </div>
      <div className="flex gap-1.5 mb-8">
        {words.map((_, i) => (<div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i < current ? "bg-primary" : i === current ? "bg-secondary" : "bg-muted"}`} />))}
      </div>
      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground mb-2">Unscramble the word</p>
        <div className="flex justify-center gap-2 flex-wrap mb-4">
          {scrambled[current].split("").map((letter, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="w-10 h-12 rounded-xl bg-card border-2 border-border flex items-center justify-center text-lg font-bold shadow-sm">{letter}</motion.span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">💡 Hint: {w.hint}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto mb-6">
        <Input value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Type your answer..." className="rounded-xl text-center uppercase tracking-widest font-bold" disabled={answered} autoFocus />
        {!answered && <Button type="submit" className="rounded-xl px-6">Check</Button>}
      </form>
      {answered && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className={`flex items-center justify-center gap-2 text-lg font-bold mb-2 ${correct ? "text-primary" : "text-destructive"}`}>
            {correct ? <><CheckCircle className="w-5 h-5" /> Correct!</> : <><XCircle className="w-5 h-5" /> The answer was: {w.word}</>}
          </div>
          <Button onClick={handleNext} size="lg" className="rounded-full px-8 mt-4">{current < words.length - 1 ? "Next Word" : "Finish 🎉"}</Button>
        </motion.div>
      )}
    </div>
  );
}
