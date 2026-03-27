import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, t } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Zap, ChevronLeft, ChevronRight } from "lucide-react";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
}

const flashcards: Flashcard[] = [
  { id: "f1", front: "What is photosynthesis?", back: "The process by which plants convert sunlight, water, and CO₂ into glucose and oxygen.", subject: "science" },
  { id: "f2", front: "What is the Pythagorean theorem?", back: "a² + b² = c², where c is the hypotenuse of a right triangle.", subject: "math" },
  { id: "f3", front: "What is an adjective?", back: "A word that describes or modifies a noun (e.g., tall, blue, happy).", subject: "english" },
  { id: "f4", front: "What is a variable in programming?", back: "A named container that stores a value which can change during program execution.", subject: "cs" },
  { id: "f5", front: "What is Newton's 3rd law?", back: "For every action, there is an equal and opposite reaction.", subject: "science" },
  { id: "f6", front: "What is the area of a circle?", back: "A = πr², where r is the radius.", subject: "math" },
  { id: "f7", front: "What is a simile?", back: "A figure of speech comparing two things using 'like' or 'as' (e.g., fast as lightning).", subject: "english" },
  { id: "f8", front: "What is an algorithm?", back: "A step-by-step set of instructions to solve a problem or complete a task.", subject: "cs" },
];

interface Props {
  language: Language;
  onBack: () => void;
  onComplete: (xpEarned: number) => void;
}

export default function FlashcardGame({ language, onBack, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<Set<number>>(new Set());

  const card = flashcards[current];
  const allReviewed = reviewed.size === flashcards.length;

  const handleFlip = () => setFlipped(!flipped);

  const handleNext = () => {
    setReviewed((prev) => new Set(prev).add(current));
    setFlipped(false);
    if (current < flashcards.length - 1) setCurrent(current + 1);
  };

  const handlePrev = () => {
    setFlipped(false);
    if (current > 0) setCurrent(current - 1);
  };

  const handleFinish = () => {
    onComplete(flashcards.length * 5);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Button>
        <div className="text-sm text-muted-foreground font-medium">
          {current + 1} / {flashcards.length}
        </div>
      </div>

      <div className="flex gap-1.5 mb-8">
        {flashcards.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${reviewed.has(i) ? "bg-primary" : i === current ? "bg-secondary" : "bg-muted"}`} />
        ))}
      </div>

      <div className="flex justify-center mb-8" style={{ perspective: 1000 }}>
        <motion.div
          onClick={handleFlip}
          className="w-full max-w-md aspect-[3/2] cursor-pointer relative"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-3xl bg-card border-2 border-border shadow-lg p-8 flex flex-col items-center justify-center text-center backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Question</p>
            <p className="text-xl font-bold">{card.front}</p>
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Tap to flip
            </p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-3xl bg-primary/10 border-2 border-primary shadow-lg p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-xs uppercase tracking-wider text-primary mb-3">Answer</p>
            <p className="text-lg font-medium">{card.back}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={handlePrev} disabled={current === 0} className="rounded-full" size="icon">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        {allReviewed ? (
          <Button onClick={handleFinish} size="lg" className="rounded-full px-8 gap-2">
            <Zap className="w-4 h-4" /> Finish (+{flashcards.length * 5} XP)
          </Button>
        ) : (
          <Button onClick={handleNext} size="lg" className="rounded-full px-8">
            {flipped ? "Next Card" : "Skip"}
          </Button>
        )}
        <Button variant="outline" onClick={handleNext} disabled={current === flashcards.length - 1} className="rounded-full" size="icon">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
