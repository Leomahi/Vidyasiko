import { useState } from "react";
import { motion } from "framer-motion";
import { subjects, quizQuestions, studentProfile, leaderboard, Language, t } from "@/lib/data";
import LanguageSelector from "@/components/LanguageSelector";
import StatsBar from "@/components/StatsBar";
import SubjectCard from "@/components/SubjectCard";
import Leaderboard from "@/components/Leaderboard";
import BadgeWall from "@/components/BadgeWall";
import QuizGame from "@/components/QuizGame";
import TeacherAnalytics from "@/components/TeacherAnalytics";
import { Button } from "@/components/ui/button";
import { GraduationCap, BarChart3 } from "lucide-react";

type View = "dashboard" | "quiz" | "teacher";

export default function Index() {
  const [language, setLanguage] = useState<Language>("en");
  const [view, setView] = useState<View>("dashboard");
  const [profile, setProfile] = useState(studentProfile);

  const handleQuizComplete = (xpEarned: number) => {
    setProfile((prev) => ({ ...prev, xp: prev.xp + xpEarned }));
  };

  if (view === "quiz") {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <QuizGame
          questions={quizQuestions}
          language={language}
          onBack={() => setView("dashboard")}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  if (view === "teacher") {
    return (
      <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
        <TeacherAnalytics language={language} onBack={() => setView("dashboard")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">VidyaQuest</h1>
            <p className="text-sm text-muted-foreground">
              {language === "hi" ? "नमस्ते" : language === "ta" ? "வணக்கம்" : "Hello"}, {profile.name}! 👋
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setView("teacher")}
            className="rounded-full gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {t("teacher", language)}
          </Button>
          <LanguageSelector language={language} onChange={setLanguage} />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mb-8">
        <StatsBar profile={profile} language={language} />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Subjects */}
          <div>
            <h2 className="text-xl font-bold mb-4">{t("subjects", language)}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {subjects.map((subject, i) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  language={language}
                  index={i}
                  onClick={() => setView("quiz")}
                />
              ))}
            </div>
          </div>

          {/* Quiz CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-secondary to-secondary/80 rounded-3xl p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-secondary-foreground">Daily Challenge 🎯</h3>
              <p className="text-secondary-foreground/80 text-sm">Complete 5 questions to earn bonus XP!</p>
            </div>
            <Button
              onClick={() => setView("quiz")}
              variant="secondary"
              size="lg"
              className="rounded-full bg-card text-foreground hover:bg-card/90 shadow-lg"
            >
              {t("quiz", language)}
            </Button>
          </motion.div>

          {/* Badges */}
          <BadgeWall badges={profile.badges} language={language} />
        </div>

        {/* Sidebar */}
        <div>
          <Leaderboard entries={leaderboard} language={language} currentUser={profile.name} />
        </div>
      </div>
    </div>
  );
}
