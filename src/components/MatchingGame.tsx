import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Language } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Clock } from "lucide-react";

interface MatchPair {
  id: string;
  term: string;
  definition: string;
}

const pairs: MatchPair[] = [
  { id: "m1", term: "H₂O", definition: "Water" },
  { id: "m2", term: "π", definition: "3.14159..." },
  { id: "m3", term: "CPU", definition: "Central Processing Unit" },
  { id: "m4", term: "Noun", definition: "Person, place, or thing" },
  { id: "m5", term: "Fe", definition: "Iron" },
  { id: "m6", term: "DNA", definition: "Genetic blueprint" },
];

interface Tile {
  id: string;
  text: string;
  pairId: string;
  type: "term" | "definition";
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  language: Language;
  onBack: () => void;
  onComplete: (xpEarned: number) => void;
}

export default function MatchingGame({ language, onBack, onComplete }: Props) {
  const [tiles] = useState<Tile[]>(() => {
    const terms: Tile[] = pairs.map((p) => ({ id: p.id + "-t", text: p.term, pairId: p.id, type: "term" }));
    const defs: Tile[] = pairs.map((p) => ({ id: p.id + "-d", text: p.definition, pairId: p.id, type: "definition" }));
    return shuffle([...terms, ...defs]);
  });

  const [selected, setSelected] = useState<Tile | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [finished]);

  const handleTileClick = (tile: Tile) => {
    if (matched.has(tile.pairId) || wrong.has(tile.id)) return;

    if (!selected) {
      setSelected(tile);
      return;
    }

    if (selected.id === tile.id) {
      setSelected(null);
      return;
    }

    if (selected.pairId === tile.pairId && selected.type !== tile.type) {
      setMatched((prev) => new Set(prev).add(tile.pairId));
      setSelected(null);
      if (matched.size + 1 === pairs.length) {
        setFinished(true);
        const xp = Math.max(30, 60 - seconds);
        onComplete(xp);
      }
    } else {
      setWrong(new Set([selected.id, tile.id]));
      setTimeout(() => {
        setWrong(new Set());
        setSelected(null);
      }, 600);
    }
  };

  if (finished) {
    const xp = Math.max(30, 60 - seconds);
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-7xl mb-6">🧩</div>
        <h2 className="text-3xl font-bold mb-2">All Matched!</h2>
        <p className="text-muted-foreground mb-2">Completed in {seconds}s</p>
        <div className="flex items-center gap-2 text-xp text-2xl font-bold mb-6">
          <Zap className="w-7 h-7" /> +{xp} XP
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" /> {seconds}s
          </div>
          <div className="text-sm font-medium">{matched.size}/{pairs.length} matched</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 text-center">Match the terms with their definitions</h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {tiles.map((tile) => {
          const isMatched = matched.has(tile.pairId);
          const isSelected = selected?.id === tile.id;
          const isWrong = wrong.has(tile.id);

          let bg = "bg-card border-border hover:border-primary";
          if (isMatched) bg = "bg-primary/15 border-primary/40 opacity-60";
          else if (isWrong) bg = "bg-destructive/15 border-destructive animate-pulse";
          else if (isSelected) bg = "bg-secondary border-secondary ring-2 ring-secondary";

          return (
            <motion.button
              key={tile.id}
              whileHover={!isMatched ? { scale: 1.05 } : {}}
              whileTap={!isMatched ? { scale: 0.95 } : {}}
              onClick={() => handleTileClick(tile)}
              disabled={isMatched}
              className={`p-3 rounded-2xl border-2 text-center text-sm font-medium min-h-[80px] flex items-center justify-center transition-colors ${bg}`}
            >
              {tile.text}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
