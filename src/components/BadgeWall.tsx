import { motion } from "framer-motion";
import { Language, t } from "@/lib/data";
import { Award } from "lucide-react";

interface Props {
  badges: string[];
  language: Language;
}

export default function BadgeWall({ badges, language }: Props) {
  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-bold">{t("badges", language)}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, i) => (
          <motion.div
            key={badge}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            className="bg-muted px-3 py-2 rounded-2xl text-sm font-medium"
          >
            {badge}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
