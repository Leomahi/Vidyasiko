import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CSSubTopic } from "@/lib/csSubTopics";

interface Props {
  subTopics: CSSubTopic[];
  onSelect: (subTopicId: string) => void;
  onBack: () => void;
}

export default function CSSubTopicPicker({ subTopics, onSelect, onBack }: Props) {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Button>
      </div>
      <h2 className="text-2xl font-bold mb-2">💻 Computer Science</h2>
      <p className="text-muted-foreground mb-6 text-sm">Choose a programming topic</p>
      <div className="grid gap-3">
        {subTopics.map((topic) => (
          <motion.button
            key={topic.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(topic.id)}
            className="p-4 rounded-2xl border-2 border-border bg-card font-medium text-left flex items-center gap-3 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <span className="text-2xl">{topic.icon}</span>
            <span className="text-lg">{topic.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
