import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_GAMES, GameId } from "@/games";
import { Language } from "@/lib/translations";

interface Props {
  language: Language;
  onBack: () => void;
  onComplete: (xpEarned: number, correctCount: number) => void;
}

const SUBJECTS = [
  { id: "all", label: "All", color: "bg-primary text-primary-foreground" },
  { id: "physics", label: "⚡ Physics", color: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300" },
  { id: "chemistry", label: "🧪 Chemistry", color: "bg-purple-500/15 text-purple-700 dark:text-purple-300" },
  { id: "biology", label: "🧬 Biology", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  { id: "maths", label: "📐 Maths", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  { id: "python", label: "🐍 Python", color: "bg-green-500/15 text-green-700 dark:text-green-300" },
] as const;

export default function GamesHub({ language, onBack, onComplete }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  if (activeGame) {
    const game = ALL_GAMES.find((g) => g.id === activeGame);
    if (game) {
      const Cmp = game.Component;
      return (
        <Cmp
          language={language}
          onBack={() => setActiveGame(null)}
          onComplete={(xp, correct) => {
            onComplete(xp, correct);
            setActiveGame(null);
          }}
        />
      );
    }
  }

  const visible = filter === "all" ? ALL_GAMES : ALL_GAMES.filter((g) => g.subject === filter);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Button>
        <h2 className="text-2xl font-bold">🎮 STEM Arcade — All 14 Games</h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === s.id ? s.color + " shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((g, i) => (
          <motion.button
            key={g.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveGame(g.id)}
            className="bg-gradient-to-br from-card to-muted/40 rounded-2xl p-5 text-left border border-border hover:border-primary hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-2">{g.emoji}</div>
            <h3 className="font-bold text-lg">{g.title}</h3>
            <p className="text-xs text-muted-foreground capitalize">{g.subject}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
