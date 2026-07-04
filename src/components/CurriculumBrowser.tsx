import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Gamepad2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CURRICULUM_SUBJECTS,
  CurriculumSubject,
  CurriculumSubjectId,
  Chapter,
  Topic,
  getChaptersFor,
} from "@/lib/curriculum";
import { Grade, QuizQuestion } from "@/lib/data";
import { Language } from "@/lib/translations";
import QuizGame from "@/components/QuizGame";
import OriginalGameShell from "@/games/engine/OriginalGameShell";

interface Props {
  grade: Grade;
  language: Language;
  quizQuestions: QuizQuestion[];
  onBack: () => void;
  onQuizComplete: (xpEarned: number, correctCount: number, subjectId: string) => void;
  onGameComplete: (xpEarned: number) => void;
}

type Mode = "browse" | "quiz" | "game";

export default function CurriculumBrowser({
  grade,
  language,
  quizQuestions,
  onBack,
  onQuizComplete,
  onGameComplete,
}: Props) {
  const [subject, setSubject] = useState<CurriculumSubject | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [mode, setMode] = useState<Mode>("browse");

  // ---- Quiz view ----
  if (mode === "quiz" && subject && topic) {
    const pool = quizQuestions.filter((q) => q.subject === subject.quizSubjectId);
    const questions = pool.length ? pool : quizQuestions;
    return (
      <div className="min-h-screen p-4 md:p-8">
        <QuizGame
          questions={questions}
          language={language}
          subjectName={`${subject.name} · ${topic.name}`}
          onBack={() => setMode("browse")}
          onComplete={(xp, correct) => {
            onQuizComplete(xp, correct, subject.quizSubjectId);
            setMode("browse");
          }}
        />
      </div>
    );
  }

  // ---- Game view ----
  if (mode === "game" && subject && topic) {
    return (
      <OriginalGameShell
        title={`${subject.name} · ${topic.name}`}
        emoji={subject.icon}
        subject={subject.gameSubject}
        grade={grade}
        onBack={() => setMode("browse")}
        onComplete={(xp) => {
          onGameComplete(xp);
          setMode("browse");
        }}
      />
    );
  }

  // ---- Topic detail ----
  if (subject && chapter && topic) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <Button variant="ghost" onClick={() => setTopic(null)} className="rounded-full mb-4">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to topics
        </Button>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-card to-muted/40 border rounded-3xl p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{subject.icon}</span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {subject.name} · {chapter.name}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold">{topic.name}</h2>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <BookOpen className="w-5 h-5 mt-1 text-primary shrink-0" />
            <p className="text-base leading-relaxed text-foreground/90">{topic.concept}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-8">
            <Button
              onClick={() => setMode("quiz")}
              className="rounded-2xl h-14 text-base gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
            >
              <HelpCircle className="w-5 h-5" /> Take Quiz
            </Button>
            <Button
              onClick={() => setMode("game")}
              variant="secondary"
              className="rounded-2xl h-14 text-base gap-2"
            >
              <Gamepad2 className="w-5 h-5" /> Play Game
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---- Chapter → topic list ----
  if (subject && chapter) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <Button variant="ghost" onClick={() => setChapter(null)} className="rounded-full mb-4">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to chapters
        </Button>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{subject.icon}</span>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {subject.name} · Grade {grade}
            </p>
            <h2 className="text-2xl font-bold">{chapter.name}</h2>
          </div>
        </div>
        <div className="grid gap-3">
          {chapter.topics.map((tp, i) => (
            <motion.button
              key={tp.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setTopic(tp)}
              className="text-left p-4 rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <p className="font-semibold text-lg">{tp.name}</p>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{tp.concept}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ---- Subject → chapter list ----
  if (subject) {
    const chapters = getChaptersFor(subject.id, grade);
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <Button variant="ghost" onClick={() => setSubject(null)} className="rounded-full mb-4">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to subjects
        </Button>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{subject.icon}</span>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Grade {grade}</p>
            <h2 className="text-3xl font-bold">{subject.name}</h2>
          </div>
        </div>
        {chapters.length === 0 ? (
          <p className="text-muted-foreground">No chapters yet for this grade.</p>
        ) : (
          <div className="grid gap-3">
            {chapters.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setChapter(c)}
                className={`text-left p-5 rounded-2xl border bg-gradient-to-br ${subject.color} hover:shadow-md transition-shadow`}
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Chapter {i + 1}
                </p>
                <p className="font-bold text-lg mt-1">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {c.topics.length} topics · lesson + quiz + game
                </p>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---- Subject picker (root) ----
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Button>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">📚 Learn by Topic</h2>
          <p className="text-sm text-muted-foreground">
            Grade {grade} · Pick a subject, chapter, then topic
          </p>
        </div>
      </div>

      <AnimatePresence>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM_SUBJECTS.map((s, i) => {
            const count = getChaptersFor(s.id, grade).length;
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSubject(s)}
                className={`text-left rounded-3xl p-6 border bg-gradient-to-br ${s.color} hover:shadow-lg transition-shadow`}
              >
                <div className="text-4xl mb-2">{s.icon}</div>
                <p className="font-bold text-lg">{s.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {count} chapters for Grade {grade}
                </p>
              </motion.button>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
