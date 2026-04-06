import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, CheckCircle, XCircle } from "lucide-react";

export interface TrueFalseQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  subject: string;
}

interface Props {
  questions: TrueFalseQuestion[];
  onBack: () => void;
  onComplete: (xpEarned: number, correctCount: number) => void;
}

export default function TrueFalseGame({ questions, onBack, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [answered, setAnswered] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions.length) return <div className="text-center p-8">No questions available.</div>;

  const q = questions[current];

  const handleSelect = (val: boolean) => {
    if (answered) return;
    setSelected(val);
    setAnswered(true);
    if (val === q.isTrue) {
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
        <div className="text-7xl mb-6">✅</div>
        <h2 className="text-3xl font-bold mb-2">True or False Complete!</h2>
        <p className="text-muted-foreground mb-2">{correctCount}/{questions.length} correct</p>
        <div className="flex items-center gap-2 text-xp text-2xl font-bold mb-6"><Zap className="w-7 h-7" /> +{totalXp} XP</div>
        <Button onClick={onBack} size="lg" className="rounded-full px-8">Back to Dashboard</Button>
      </motion.div>
    );
  }

  const isCorrect = selected === q.isTrue;

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
      <h2 className="text-2xl font-bold mb-8 text-center">{q.statement}</h2>
      <div className="flex gap-4 justify-center mb-6">
        {[true, false].map((val) => {
          let style = val ? "bg-primary/5 border-primary/30 hover:bg-primary/15" : "bg-destructive/5 border-destructive/30 hover:bg-destructive/15";
          if (answered) {
            if (val === q.isTrue) style = "bg-primary/20 border-primary text-primary ring-2 ring-primary";
            else if (val === selected) style = "bg-destructive/20 border-destructive text-destructive";
            else style = "opacity-50 border-border";
          }
          return (
            <motion.button key={String(val)} whileHover={!answered ? { scale: 1.05 } : {}} whileTap={!answered ? { scale: 0.95 } : {}} onClick={() => handleSelect(val)} className={`flex-1 max-w-[180px] p-6 rounded-3xl border-2 font-bold text-xl transition-all ${style}`}>
              {val ? "✅ True" : "❌ False"}
            </motion.button>
          );
        })}
      </div>
      {answered && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className={`flex items-center justify-center gap-2 text-lg font-bold mb-2 ${isCorrect ? "text-primary" : "text-destructive"}`}>
            {isCorrect ? <><CheckCircle className="w-5 h-5" /> Correct!</> : <><XCircle className="w-5 h-5" /> Wrong!</>}
          </div>
          <p className="text-sm text-muted-foreground mb-4">{q.explanation}</p>
          <Button onClick={handleNext} size="lg" className="rounded-full px-8">{current < questions.length - 1 ? "Next" : "Finish 🎉"}</Button>
        </motion.div>
      )}
    </div>
  );
}
