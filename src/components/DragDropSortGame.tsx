import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, CheckCircle, XCircle, ArrowUp, ArrowDown } from "lucide-react";

export interface SortChallenge {
  id: string;
  instruction: string;
  items: string[];
  correctOrder: string[];
  subject: string;
}

interface Props {
  challenges: SortChallenge[];
  onBack: () => void;
  onComplete: (xpEarned: number, correctCount: number) => void;
}

export default function DragDropSortGame({ challenges, onBack, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [items, setItems] = useState<string[]>(() => shuffle(challenges[0]?.items ?? []));
  const [answered, setAnswered] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const ch = challenges[current];

  const moveItem = useCallback((index: number, direction: -1 | 1) => {
    if (answered) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
  }, [items, answered]);

  const handleCheck = () => {
    setAnswered(true);
    const isCorrect = items.every((item, i) => item === ch.correctOrder[i]);
    if (isCorrect) {
      setTotalXp((p) => p + 15);
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (current < challenges.length - 1) {
      const nextIdx = current + 1;
      setCurrent(nextIdx);
      setItems(shuffle(challenges[nextIdx].items));
      setAnswered(false);
    } else {
      setFinished(true);
      onComplete(totalXp, correctCount);
    }
  };

  if (!challenges.length) return <div className="text-center p-8">No sorting challenges available.</div>;

  if (finished) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-7xl mb-6">📋</div>
        <h2 className="text-3xl font-bold mb-2">Sorting Game Complete!</h2>
        <p className="text-muted-foreground mb-2">{correctCount}/{challenges.length} correct</p>
        <div className="flex items-center gap-2 text-xp text-2xl font-bold mb-6"><Zap className="w-7 h-7" /> +{totalXp} XP</div>
        <Button onClick={onBack} size="lg" className="rounded-full px-8">Back to Dashboard</Button>
      </motion.div>
    );
  }

  const isCorrect = answered && items.every((item, i) => item === ch.correctOrder[i]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="rounded-full"><ArrowLeft className="w-5 h-5 mr-1" /> Back</Button>
        <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm border border-border"><Zap className="w-4 h-4 text-xp" /><span className="font-bold">{totalXp} XP</span></div>
      </div>
      <div className="flex gap-1.5 mb-8">
        {challenges.map((_, i) => (<div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i < current ? "bg-primary" : i === current ? "bg-secondary" : "bg-muted"}`} />))}
      </div>
      <p className="text-xs text-muted-foreground mb-2">Challenge {current + 1} of {challenges.length}</p>
      <h2 className="text-xl font-bold mb-6 text-center">{ch.instruction}</h2>
      <p className="text-sm text-muted-foreground text-center mb-4">Use arrows to reorder items</p>
      <div className="space-y-2 max-w-md mx-auto mb-6">
        {items.map((item, i) => {
          let itemStyle = "bg-card border-border";
          if (answered) {
            itemStyle = item === ch.correctOrder[i] ? "bg-primary/10 border-primary" : "bg-destructive/10 border-destructive";
          }
          return (
            <motion.div key={item} layout className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${itemStyle}`}>
              <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
              <span className="flex-1 font-medium text-sm">{item}</span>
              {!answered && (
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveItem(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-muted disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="p-1 rounded hover:bg-muted disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                </div>
              )}
              {answered && (item === ch.correctOrder[i] ? <CheckCircle className="w-4 h-4 text-primary" /> : <XCircle className="w-4 h-4 text-destructive" />)}
            </motion.div>
          );
        })}
      </div>
      {!answered ? (
        <div className="text-center">
          <Button onClick={handleCheck} size="lg" className="rounded-full px-8">Check Order</Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className={`text-lg font-bold mb-2 ${isCorrect ? "text-primary" : "text-destructive"}`}>
            {isCorrect ? "Perfect order! ✅" : "Not quite right. Here's the correct order above."}
          </div>
          {!isCorrect && (
            <p className="text-sm text-muted-foreground mb-3">Correct: {ch.correctOrder.join(" → ")}</p>
          )}
          <Button onClick={handleNext} size="lg" className="rounded-full px-8">{current < challenges.length - 1 ? "Next" : "Finish 🎉"}</Button>
        </motion.div>
      )}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
