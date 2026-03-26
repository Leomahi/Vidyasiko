import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion, Language, t } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, Zap } from "lucide-react";

interface Props {
  questions: QuizQuestion[];
  language: Language;
  onBack: () => void;
  onComplete: (xpEarned: number, correctCount: number) => void;
}

export default function QuizGame({ questions, language, onBack, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correctAnswer) {
      setTotalXp((prev) => prev + q.xpReward);
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
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-7xl mb-6">
          🏆
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-muted-foreground mb-2">{correctCount}/{questions.length} correct</p>
        <div className="flex items-center gap-2 text-xp text-2xl font-bold mb-6">
          <Zap className="w-7 h-7" /> +{totalXp} XP
        </div>
        <Button onClick={onBack} size="lg" className="rounded-full px-8">Back to Dashboard</Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Button>
        <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm border border-border">
          <Zap className="w-4 h-4 text-xp" />
          <span className="font-bold">{totalXp} XP</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-8">
        {questions.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i < current ? "bg-primary" : i === current ? "bg-secondary" : "bg-muted"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          <h2 className="text-2xl font-bold mb-6">{q.question}</h2>
          <div className="grid gap-3">
            {q.options.map((opt, i) => {
              let style = "bg-card border-border hover:border-primary hover:bg-primary/5";
              if (answered) {
                if (i === q.correctAnswer) style = "bg-primary/10 border-primary text-primary";
                else if (i === selected) style = "bg-destructive/10 border-destructive text-destructive";
              }
              return (
                <motion.button
                  key={i}
                  whileHover={!answered ? { scale: 1.02 } : {}}
                  whileTap={!answered ? { scale: 0.98 } : {}}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-2xl border-2 font-medium transition-colors flex items-center gap-3 ${style}`}
                >
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {answered && i === q.correctAnswer && <CheckCircle className="w-5 h-5 ml-auto text-primary" />}
                  {answered && i === selected && i !== q.correctAnswer && <XCircle className="w-5 h-5 ml-auto text-destructive" />}
                </motion.button>
              );
            })}
          </div>

          {answered && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
              <p className={`text-lg font-bold mb-4 ${selected === q.correctAnswer ? "text-primary" : "text-destructive"}`}>
                {selected === q.correctAnswer ? t("correct", language) : t("wrong", language)}
              </p>
              <Button onClick={handleNext} size="lg" className="rounded-full px-8">
                {current < questions.length - 1 ? t("next", language) : "Finish 🎉"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
