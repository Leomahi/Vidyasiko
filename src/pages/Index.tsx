import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { gradeContent, Grade } from "@/lib/data";
import { Language, t, getSubjectName } from "@/lib/translations";
import { useAuth } from "@/hooks/useAuth";
import { getProfile, getLeaderboard, addXpToProfile, saveQuizScore, updateProfile, syncPendingActions, Profile } from "@/lib/db";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { getCSSubTopicsForGrade } from "@/lib/csSubTopics";
import { csSubTopicQuestions } from "@/lib/csSubTopics";
import { getNewGameData } from "@/lib/newGameData";
import OfflineBanner from "@/components/OfflineBanner";
import LanguageSelector from "@/components/LanguageSelector";
import StatsBar from "@/components/StatsBar";
import SubjectCard from "@/components/SubjectCard";
import Leaderboard from "@/components/Leaderboard";
import BadgeWall from "@/components/BadgeWall";
import QuizGame from "@/components/QuizGame";
import FlashcardGame from "@/components/FlashcardGame";
import MatchingGame from "@/components/MatchingGame";
import WordScramble from "@/components/WordScramble";
import FillBlanksGame from "@/components/FillBlanksGame";
import TrueFalseGame from "@/components/TrueFalseGame";
import DragDropSortGame from "@/components/DragDropSortGame";
import CrosswordGame from "@/components/CrosswordGame";
import CSSubTopicPicker from "@/components/CSSubTopicPicker";
import TeacherAnalytics from "@/components/TeacherAnalytics";
import GradeSelector from "@/components/GradeSelector";
import { Button } from "@/components/ui/button";
import { GraduationCap, BarChart3, LogOut } from "lucide-react";

type View = "dashboard" | "quiz" | "flashcards" | "matching" | "scramble" | "teacher" | "fillblanks" | "truefalse" | "sorting" | "crossword" | "cs-subtopic";
type QuizSubjectFilter = string | null;

export default function Index() {
  const { user, signOut } = useAuth();
  const [language, setLanguage] = useState<Language>("en");
  const [view, setView] = useState<View>("dashboard");
  const [quizSubject, setQuizSubject] = useState<QuizSubjectFilter>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<Profile[]>([]);
  const [csSubTopicId, setCsSubTopicId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [p, lb] = await Promise.all([getProfile(user.id), getLeaderboard()]);
    setProfile(p);
    setLeaderboardData(lb);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const userGrade = (profile?.grade as Grade) ?? null;
  const content = userGrade ? gradeContent[userGrade] : null;
  const newGameData = userGrade ? getNewGameData(userGrade) : null;

  const handleGradeSelect = async (grade: Grade) => {
    if (!user) return;
    await updateProfile(user.id, { grade } as any);
    await loadData();
  };

  if (profile && !userGrade) {
    return <GradeSelector onSelect={handleGradeSelect} />;
  }

  if (!profile || !content || !newGameData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const { subjects, quizQuestions, flashcards, matchPairs, scrambleWords } = content;

  const handleQuizComplete = async (xpEarned: number, correctCount: number) => {
    if (!user) return;
    const questionsUsed = quizSubject ? quizQuestions.filter(q => q.subject === quizSubject) : quizQuestions;
    await Promise.all([
      addXpToProfile(user.id, xpEarned),
      saveQuizScore({
        user_id: user.id,
        subject_id: quizSubject || "mixed",
        score: correctCount * 10,
        xp_earned: xpEarned,
        questions_total: questionsUsed.length,
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

  const handleGenericComplete = async (xpEarned: number, _correctCount: number) => {
    await handleGenericXp(xpEarned);
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
        questions_total: scrambleWords.length,
        questions_correct: correctCount,
      }),
    ]);
    await loadData();
  };

  const studentProfile = {
    name: profile.display_name ?? "Student",
    xp: profile.xp ?? 0,
    level: profile.level ?? 1,
    streak: profile.streak ?? 0,
    badges: profile.badges ?? [],
    rank: leaderboardData.findIndex((e) => e.user_id === user?.id) + 1 || 0,
  };

  const leaderboardEntries = leaderboardData.map((p) => ({
    name: p.display_name,
    xp: p.xp,
    level: p.level,
    avatar: "🧑",
  }));

  const handleSubjectClick = (subjectId: string) => {
    if (subjectId === "cs") {
      setView("cs-subtopic");
    } else {
      setQuizSubject(subjectId);
      setView("quiz");
    }
  };

  const handleCSSubTopicSelect = (subTopicId: string) => {
    setCsSubTopicId(subTopicId);
    setQuizSubject("cs");
    setView("quiz");
  };

  const getQuizQuestions = () => {
    if (quizSubject === "cs" && csSubTopicId && csSubTopicQuestions[csSubTopicId]) {
      return csSubTopicQuestions[csSubTopicId];
    }
    if (quizSubject) {
      return quizQuestions.filter(q => q.subject === quizSubject);
    }
    return quizQuestions;
  };

  if (view === "cs-subtopic") {
    const availableTopics = userGrade ? getCSSubTopicsForGrade(userGrade) : [];
    return (
      <div className="min-h-screen p-4 md:p-8">
        <CSSubTopicPicker subTopics={availableTopics} onSelect={handleCSSubTopicSelect} onBack={() => setView("dashboard")} />
      </div>
    );
  }

  if (view === "quiz") {
    const subjectLabel = csSubTopicId && quizSubject === "cs" ? csSubTopicId : quizSubject;
    return (
      <div className="min-h-screen p-4 md:p-8">
        <QuizGame questions={getQuizQuestions()} language={language} onBack={() => { setView("dashboard"); setQuizSubject(null); setCsSubTopicId(null); }} onComplete={handleQuizComplete} subjectName={subjectLabel} />
      </div>
    );
  }

  if (view === "flashcards") return <div className="min-h-screen p-4 md:p-8"><FlashcardGame language={language} onBack={() => setView("dashboard")} onComplete={handleGenericXp} flashcards={flashcards} /></div>;
  if (view === "matching") return <div className="min-h-screen p-4 md:p-8"><MatchingGame language={language} onBack={() => setView("dashboard")} onComplete={handleGenericXp} pairs={matchPairs} /></div>;
  if (view === "scramble") return <div className="min-h-screen p-4 md:p-8"><WordScramble language={language} onBack={() => setView("dashboard")} onComplete={handleScrambleComplete} words={scrambleWords} /></div>;
  if (view === "fillblanks") return <div className="min-h-screen p-4 md:p-8"><FillBlanksGame questions={newGameData.fillBlanks} onBack={() => setView("dashboard")} onComplete={handleGenericComplete} /></div>;
  if (view === "truefalse") return <div className="min-h-screen p-4 md:p-8"><TrueFalseGame questions={newGameData.trueFalse} onBack={() => setView("dashboard")} onComplete={handleGenericComplete} /></div>;
  if (view === "sorting") return <div className="min-h-screen p-4 md:p-8"><DragDropSortGame challenges={newGameData.sortChallenges} onBack={() => setView("dashboard")} onComplete={handleGenericComplete} /></div>;
  if (view === "crossword") return <div className="min-h-screen p-4 md:p-8"><CrosswordGame clues={newGameData.crosswordClues} onBack={() => setView("dashboard")} onComplete={handleGenericComplete} /></div>;
  if (view === "teacher") return <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto"><TeacherAnalytics language={language} onBack={() => setView("dashboard")} /></div>;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">VidyaQuest</h1>
            <p className="text-sm text-muted-foreground">
              {t("hello", language)}, {studentProfile.name}! 👋
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary/15 text-primary">
                {t("grade", language)} {userGrade}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
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

      <div className="mb-8"><StatsBar profile={studentProfile} language={language} /></div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">{t("subjects", language)}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {subjects.map((subject, i) => (
                <SubjectCard key={subject.id} subject={subject} language={language} index={i} onClick={() => handleSubjectClick(subject.id)} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">{t("quizGames", language)}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {subjects.map((subject) => {
                const count = subject.id === "cs" ? Object.values(csSubTopicQuestions).flat().length : quizQuestions.filter(q => q.subject === subject.id).length;
                return (
                  <motion.button key={`quiz-${subject.id}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleSubjectClick(subject.id)} className="bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl p-4 text-left border border-border hover:shadow-md transition-shadow">
                    <span className="text-2xl">{subject.icon}</span>
                    <p className="font-bold mt-1">{getSubjectName(subject.id, subject.name, language)} Quiz</p>
                    <p className="text-xs text-muted-foreground">{count} {t("questions", language)}</p>
                  </motion.button>
                );
              })}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setQuizSubject(null); setView("quiz"); }} className="bg-gradient-to-br from-muted/40 to-muted/10 rounded-2xl p-4 text-left border border-border hover:shadow-md transition-shadow">
                <span className="text-2xl">🎲</span>
                <p className="font-bold mt-1">{t("mixed", language)} Quiz</p>
                <p className="text-xs text-muted-foreground">{quizQuestions.length} {t("questions", language)} · {t("allSubjects", language)}</p>
              </motion.button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">{t("moreGames", language)}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: "📇", label: t("flashcards", language), desc: `${flashcards.length} ${t("cardsToReview", language)}`, view: "flashcards" as View, color: "from-secondary/20 to-secondary/5" },
                { icon: "🧩", label: t("matchGame", language), desc: `${matchPairs.length} ${t("pairsToMatch", language)}`, view: "matching" as View, color: "from-accent/20 to-accent/5" },
                { icon: "🔤", label: t("wordScramble", language), desc: `${scrambleWords.length} ${t("wordsToUnscramble", language)}`, view: "scramble" as View, color: "from-level/20 to-level/5" },
                { icon: "✍️", label: t("fillBlanks", language), desc: `${newGameData.fillBlanks.length} ${t("questions", language)}`, view: "fillblanks" as View, color: "from-primary/20 to-primary/5" },
                { icon: "✅", label: t("trueFalse", language), desc: `${newGameData.trueFalse.length} ${t("questions", language)}`, view: "truefalse" as View, color: "from-secondary/20 to-secondary/5" },
                { icon: "📋", label: t("sortingGame", language), desc: `${newGameData.sortChallenges.length} challenges`, view: "sorting" as View, color: "from-accent/20 to-accent/5" },
                { icon: "🧩", label: t("crossword", language), desc: `${newGameData.crosswordClues.length} clues`, view: "crossword" as View, color: "from-level/20 to-level/5" },
              ].map((game) => (
                <motion.button key={game.view} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setView(game.view)} className={`bg-gradient-to-br ${game.color} rounded-2xl p-4 text-left border border-border hover:shadow-md transition-shadow`}>
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
