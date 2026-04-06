import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, CheckCircle, XCircle } from "lucide-react";

export interface FillBlankQuestion {
  id: string;
  sentence: string; // use ___ for the blank
  answer: string;
  options: string[];
  subject: string;
}

interface Props {
  questions: FillBlankQuestion[];
  onBack: () => void;
  onComplete: (xpEarned: number, correctCount: number) => void;
}

export default function FillBlanksGame({ questions, onBack, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions.length) return <div className="text-center p-8">No questions available.</div>;

  const q = questions[current];

  const handleSelect = (opt: string) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    if (opt === q.answer) {
      setTotalXp((p) => p + 10);
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
      onComplete(totalXp, correctCount);
    }
  };

  if (finished) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-7xl mb-6">✍️</div>
        <h2 className="text-3xl font-bold mb-2">Fill in the Blanks Complete!</h2>
        <p className="text-muted-foreground mb-2">{correctCount}/{questions.length} correct</p>
        <div className="flex items-center gap-2 text-xp text-2xl font-bold mb-6"><Zap className="w-7 h-7" /> +{totalXp} XP</div>
        <Button onClick={onBack} size="lg" className="rounded-full px-8">Back to Dashboard</Button>
      </motion.div>
    );
  }

  const parts = q.sentence.split("___");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="rounded-full"><ArrowLeft className="w-5 h-5 mr-1" /> Back</Button>
        <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm border border-border"><Zap className="w-4 h-4 text-xp" /><span className="font-bold">{totalXp} XP</span></div>
      </div>
      <div className="flex gap-1.5 mb-8">
        {questions.map((_, i) => (<div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i < current ? "bg-primary" : i === current ? "bg-secondary" : "bg-muted"}`} />))}
      </div>
      <p className="text-xs text-muted-foreground mb-2">Question {current + 1} of {questions.length}</p>
      <div className="text-xl font-bold mb-6 leading-relaxed">
        {parts[0]}
        <span className={`inline-block min-w-[80px] px-3 py-1 mx-1 rounded-lg border-2 text-center ${answered ? (selected === q.answer ? "bg-primary/15 border-primary text-primary" : "bg-destructive/15 border-destructive text-destructive") : "bg-muted border-border"}`}>
          {selected || "___"}
        </span>
        {parts[1]}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {q.options.map((opt) => {
          let style = "bg-card border-border hover:border-primary";
          if (answered) {
            if (opt === q.answer) style = "bg-primary/10 border-primary text-primary";
            else if (opt === selected) style = "bg-destructive/10 border-destructive text-destructive";
          }
          return (
            <motion.button key={opt} whileHover={!answered ? { scale: 1.02 } : {}} whileTap={!answered ? { scale: 0.98 } : {}} onClick={() => handleSelect(opt)} className={`p-3 rounded-2xl border-2 font-medium transition-colors flex items-center justify-center gap-2 ${style}`}>
              {opt}
              {answered && opt === q.answer && <CheckCircle className="w-4 h-4" />}
              {answered && opt === selected && opt !== q.answer && <XCircle className="w-4 h-4" />}
            </motion.button>
          );
        })}
      </div>
      {answered && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Button onClick={handleNext} size="lg" className="rounded-full px-8">{current < questions.length - 1 ? "Next" : "Finish 🎉"}</Button>
        </motion.div>
      )}
    </div>
  );
}
