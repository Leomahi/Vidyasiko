import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { subjects as defaultSubjects, quizQuestions, Language, t } from "@/lib/data";
import { useAuth } from "@/hooks/useAuth";
import { getProfile, getLeaderboard, addXpToProfile, saveQuizScore, Profile } from "@/lib/db";
import LanguageSelector from "@/components/LanguageSelector";
import StatsBar from "@/components/StatsBar";
import SubjectCard from "@/components/SubjectCard";
import Leaderboard from "@/components/Leaderboard";
import BadgeWall from "@/components/BadgeWall";
import QuizGame from "@/components/QuizGame";
import FlashcardGame from "@/components/FlashcardGame";
import MatchingGame from "@/components/MatchingGame";
import WordScramble from "@/components/WordScramble";
import TeacherAnalytics from "@/components/TeacherAnalytics";
import { Button } from "@/components/ui/button";
import { GraduationCap, BarChart3, LogOut, BookOpen, Puzzle, Type } from "lucide-react";

type View = "dashboard" | "quiz" | "flashcards" | "matching" | "scramble" | "teacher";
type QuizSubjectFilter = string | null;

export default function Index() {
  const { user, signOut } = useAuth();
  const [language, setLanguage] = useState<Language>("en");
  const [view, setView] = useState<View>("dashboard");
  const [quizSubject, setQuizSubject] = useState<QuizSubjectFilter>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<Profile[]>([]);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [p, lb] = await Promise.all([getProfile(user.id), getLeaderboard()]);
    setProfile(p);
    setLeaderboardData(lb);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleQuizComplete = async (xpEarned: number, correctCount: number) => {
    if (!user) return;
    await Promise.all([
      addXpToProfile(user.id, xpEarned),
      saveQuizScore({
        user_id: user.id,
        subject_id: "mixed",
        score: correctCount * 10,
        xp_earned: xpEarned,
        questions_total: quizQuestions.length,
        questions_correct: correctCount,
      }),
    ]);
    await loadData();
  };

  const handleGenericXp = async (xpEarned: number) => {
    if (!user) return;
    await addXpToProfile(user.id, xpEarned);
    await loadData();
  };

  const handleScrambleComplete = async (xpEarned: number, correctCount: number) => {
    if (!user) return;
    await Promise.all([
      addXpToProfile(user.id, xpEarned),
      saveQuizScore({
        user_id: user.id,
        subject_id: "scramble",
        score: correctCount * 15,
        xp_earned: xpEarned,
        questions_total: 8,
        questions_correct: correctCount,
      }),
    ]);
    await loadData();
  };

  const studentProfile = {
    name: profile?.display_name ?? "Student",
    xp: profile?.xp ?? 0,
    level: profile?.level ?? 1,
    streak: profile?.streak ?? 0,
    badges: profile?.badges ?? [],
    rank: leaderboardData.findIndex((e) => e.user_id === user?.id) + 1 || 0,
  };

  const leaderboardEntries = leaderboardData.map((p) => ({
    name: p.display_name,
    xp: p.xp,
    level: p.level,
    avatar: "🧑",
  }));

  if (view === "quiz") {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <QuizGame questions={quizSubject ? quizQuestions.filter(q => q.subject === quizSubject) : quizQuestions} language={language} onBack={() => { setView("dashboard"); setQuizSubject(null); }} onComplete={handleQuizComplete} subjectName={quizSubject} />
      </div>
    );
  }

  if (view === "flashcards") {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <FlashcardGame language={language} onBack={() => setView("dashboard")} onComplete={handleGenericXp} />
      </div>
    );
  }

  if (view === "matching") {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <MatchingGame language={language} onBack={() => setView("dashboard")} onComplete={handleGenericXp} />
      </div>
    );
  }

  if (view === "scramble") {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <WordScramble language={language} onBack={() => setView("dashboard")} onComplete={handleScrambleComplete} />
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
              {language === "hi" ? "नमस्ते" : language === "ta" ? "வணக்கம்" : "Hello"}, {studentProfile.name}! 👋
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setView("teacher")} className="rounded-full gap-2">
            <BarChart3 className="w-4 h-4" />
            {t("teacher", language)}
          </Button>
          <LanguageSelector language={language} onChange={setLanguage} />
          <Button variant="ghost" size="icon" onClick={signOut} className="rounded-full">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      <div className="mb-8">
        <StatsBar profile={studentProfile} language={language} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">{t("subjects", language)}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {defaultSubjects.map((subject, i) => (
                <SubjectCard key={subject.id} subject={subject} language={language} index={i} onClick={() => { setQuizSubject(subject.id); setView("quiz"); }} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Quiz Games 🧠</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {defaultSubjects.map((subject) => {
                const count = quizQuestions.filter(q => q.subject === subject.id).length;
                return (
                  <motion.button
                    key={`quiz-${subject.id}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setQuizSubject(subject.id); setView("quiz"); }}
                    className="bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl p-4 text-left border border-border hover:shadow-md transition-shadow"
                  >
                    <span className="text-2xl">{subject.icon}</span>
                    <p className="font-bold mt-1">{language === "hi" ? subject.nameHi : language === "ta" ? subject.nameTa : subject.name} Quiz</p>
                    <p className="text-xs text-muted-foreground">{count} questions · 3 levels</p>
                  </motion.button>
                );
              })}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setQuizSubject(null); setView("quiz"); }}
                className="bg-gradient-to-br from-muted/40 to-muted/10 rounded-2xl p-4 text-left border border-border hover:shadow-md transition-shadow"
              >
                <span className="text-2xl">🎲</span>
                <p className="font-bold mt-1">Mixed Quiz</p>
                <p className="text-xs text-muted-foreground">{quizQuestions.length} questions · All subjects</p>
              </motion.button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">More Games 🎮</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: "📇", label: "Flashcards", desc: "Review key concepts", view: "flashcards" as View, color: "from-secondary/20 to-secondary/5" },
                { icon: "🧩", label: "Match Game", desc: "Match terms & definitions", view: "matching" as View, color: "from-accent/20 to-accent/5" },
                { icon: "🔤", label: "Word Scramble", desc: "Unscramble science words", view: "scramble" as View, color: "from-level/20 to-level/5" },
              ].map((game) => (
                <motion.button
                  key={game.view}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView(game.view)}
                  className={`bg-gradient-to-br ${game.color} rounded-2xl p-4 text-left border border-border hover:shadow-md transition-shadow`}
                >
                  <span className="text-2xl">{game.icon}</span>
                  <p className="font-bold mt-1">{game.label}</p>
                  <p className="text-xs text-muted-foreground">{game.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>

          <BadgeWall badges={studentProfile.badges} language={language} />
        </div>

        <div>
          <Leaderboard entries={leaderboardEntries} language={language} currentUser={studentProfile.name} />
        </div>
      </div>
    </div>
  );
}
