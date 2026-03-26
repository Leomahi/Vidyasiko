import { motion } from "framer-motion";
import { Subject, Language, t } from "@/lib/data";
import { Progress } from "@/components/ui/progress";

interface Props {
  subject: Subject;
  language: Language;
  index: number;
  onClick: () => void;
}

const colorMap: Record<string, string> = {
  "bg-primary": "from-primary to-primary/80",
  "bg-secondary": "from-secondary to-secondary/80",
  "bg-accent": "from-accent to-accent/80",
  "bg-level": "from-level to-level/80",
};

export default function SubjectCard({ subject, language, index, onClick }: Props) {
  const name = language === "hi" ? subject.nameHi : language === "ta" ? subject.nameTa : subject.name;
  const gradient = colorMap[subject.color] || "from-primary to-primary/80";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 text-primary-foreground shadow-lg hover:shadow-xl transition-shadow`}>
        <div className="text-4xl mb-3">{subject.icon}</div>
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-sm opacity-80 mb-4">
          {subject.completedLessons}/{subject.totalLessons} {t("lessons", language)}
        </p>
        <Progress value={subject.progress} className="h-2 bg-white/20" />
        <p className="text-right text-sm font-semibold mt-1">{subject.progress}%</p>
      </div>
    </motion.div>
  );
}
