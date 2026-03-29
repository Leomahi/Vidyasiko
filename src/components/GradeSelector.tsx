import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { Grade } from "@/lib/data";

interface Props {
  onSelect: (grade: Grade) => void;
  loading?: boolean;
}

const gradeInfo: { grade: Grade; label: string; desc: string }[] = [
  { grade: 6, label: "Grade 6", desc: "Basic Math, Science, English, Computers" },
  { grade: 7, label: "Grade 7", desc: "Pre-Algebra, Life Science, Language, Digital Literacy" },
  { grade: 8, label: "Grade 8", desc: "Algebra, Physics & Chemistry, Literature, Coding" },
  { grade: 9, label: "Grade 9", desc: "Advanced Algebra, Biology & Physics, Composition, Python" },
  { grade: 10, label: "Grade 10", desc: "Trigonometry, Chemistry & Biology, Advanced English, JavaScript" },
  { grade: 11, label: "Grade 11", desc: "Calculus & Stats, Advanced Physics, Rhetoric, Data Structures" },
  { grade: 12, label: "Grade 12", desc: "Linear Algebra, Modern Physics, World Literature, Algorithms" },
];

export default function GradeSelector({ onSelect, loading }: Props) {
  const [selected, setSelected] = useState<Grade | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Select Your Grade</h1>
          <p className="text-muted-foreground mt-1">Choose your class to get personalized content</p>
        </div>

        <div className="space-y-3 mb-6">
          {gradeInfo.map((g) => (
            <motion.button
              key={g.grade}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(g.grade)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-colors ${
                selected === g.grade
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <p className="font-bold text-lg">{g.label}</p>
              <p className="text-sm text-muted-foreground">{g.desc}</p>
            </motion.button>
          ))}
        </div>

        <Button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected || loading}
          className="w-full rounded-xl"
          size="lg"
        >
          {loading ? "Saving..." : "Continue →"}
        </Button>
      </motion.div>
    </div>
  );
}
