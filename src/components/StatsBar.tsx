import { motion } from "framer-motion";
import { StudentProfile } from "@/lib/data";
import { Language, t } from "@/lib/translations";
import { Flame, Star, TrendingUp, Wifi, WifiOff } from "lucide-react";

interface Props {
  profile: StudentProfile;
  language: Language;
}

export default function StatsBar({ profile, language }: Props) {
  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

  const stats = [
    { icon: Star, value: profile.xp, label: t("xp", language), color: "text-xp" },
    { icon: Flame, value: profile.streak, label: t("streak", language), color: "text-streak" },
    { icon: TrendingUp, value: profile.level, label: t("level", language), color: "text-level" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-2 bg-card rounded-2xl px-4 py-2.5 shadow-sm border border-border"
        >
          <stat.icon className={`w-5 h-5 ${stat.color}`} />
          <div>
            <p className="text-lg font-bold leading-none">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
      <div className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium ${isOnline ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
        {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
        {isOnline ? "Online" : t("offline", language)}
      </div>
    </div>
  );
}
