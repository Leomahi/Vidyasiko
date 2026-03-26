import { motion } from "framer-motion";
import { LeaderboardEntry, Language, t } from "@/lib/data";
import { Trophy } from "lucide-react";

interface Props {
  entries: LeaderboardEntry[];
  language: Language;
  currentUser: string;
}

const medals = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ entries, language, currentUser }: Props) {
  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-xp" />
        <h3 className="text-lg font-bold">{t("leaderboard", language)}</h3>
      </div>
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
              entry.name === currentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
            }`}
          >
            <span className="text-xl w-8 text-center">{i < 3 ? medals[i] : `#${i + 1}`}</span>
            <span className="text-2xl">{entry.avatar}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm">{entry.name}</p>
              <p className="text-xs text-muted-foreground">Lv. {entry.level}</p>
            </div>
            <span className="font-bold text-sm text-xp">{entry.xp} XP</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
