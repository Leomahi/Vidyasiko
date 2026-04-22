import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Language, t } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowLeft, Users, BookOpen, TrendingUp, Target, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  language: Language;
  onBack: () => void;
}

const CHART_COLORS = [
  "hsl(152, 55%, 42%)",
  "hsl(35, 92%, 55%)",
  "hsl(262, 60%, 55%)",
  "hsl(200, 80%, 50%)",
  "hsl(15, 80%, 55%)",
];

interface StudentRow {
  user_id: string;
  display_name: string;
  grade: number | null;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
}

interface QuizRow {
  user_id: string;
  subject_id: string;
  score: number;
  questions_correct: number;
  questions_total: number;
  created_at: string;
}

export default function TeacherAnalytics({ language, onBack }: Props) {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      // Profiles whose user_id has a 'student' role
      const { data: roleRows } = await supabase
        .from("user_roles" as any)
        .select("user_id")
        .eq("role", "student");
      const studentIds = (roleRows ?? []).map((r: any) => r.user_id);
      if (studentIds.length === 0) {
        if (!cancelled) { setStudents([]); setQuizzes([]); setLoading(false); }
        return;
      }
      const [{ data: profs }, { data: qs }] = await Promise.all([
        supabase.from("profiles").select("user_id,display_name,grade,xp,level,streak,badges").in("user_id", studentIds),
        supabase.from("quiz_scores").select("user_id,subject_id,score,questions_correct,questions_total,created_at").in("user_id", studentIds).order("created_at", { ascending: false }).limit(500),
      ]);
      if (cancelled) return;
      setStudents((profs ?? []) as StudentRow[]);
      setQuizzes((qs ?? []) as QuizRow[]);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Aggregate quiz scores by subject
  const subjectAgg = new Map<string, { correct: number; total: number; attempts: number }>();
  quizzes.forEach((q) => {
    const cur = subjectAgg.get(q.subject_id) ?? { correct: 0, total: 0, attempts: 0 };
    cur.correct += q.questions_correct;
    cur.total += q.questions_total;
    cur.attempts += 1;
    subjectAgg.set(q.subject_id, cur);
  });
  const subjectData = Array.from(subjectAgg.entries()).map(([name, v]) => ({
    name,
    progress: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
    attempts: v.attempts,
  }));

  // Engagement: count quizzes per day for last 7 days
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const engagementData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const key = d.toDateString();
    const active = quizzes.filter((q) => new Date(q.created_at).toDateString() === key).length;
    return { name: dayLabels[d.getDay()], active };
  });

  const totalStudents = students.length;
  const totalAttempts = quizzes.length;
  const avgXp = totalStudents > 0 ? Math.round(students.reduce((s, p) => s + (p.xp ?? 0), 0) / totalStudents) : 0;
  const avgAccuracy = (() => {
    const tot = quizzes.reduce((s, q) => s + q.questions_total, 0);
    const cor = quizzes.reduce((s, q) => s + q.questions_correct, 0);
    return tot > 0 ? Math.round((cor / tot) * 100) : 0;
  })();

  const stats = [
    { icon: Users, label: "Total Students", value: String(totalStudents), color: "text-primary" },
    { icon: BookOpen, label: "Quiz Attempts", value: String(totalAttempts), color: "text-secondary" },
    { icon: TrendingUp, label: "Avg. XP", value: String(avgXp), color: "text-accent" },
    { icon: Target, label: "Avg. Accuracy", value: avgAccuracy + "%", color: "text-level" },
  ];

  const ranked = [...students].sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0)).slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Button>
        <h2 className="text-2xl font-bold">{t("teacher", language)} — {t("analytics", language)}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-3xl p-5 shadow-sm border border-border text-center"
          >
            <s.icon className={`w-8 h-8 mx-auto mb-2 ${s.color}`} />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
          <h3 className="font-bold mb-4">Subject Accuracy (%)</h3>
          {subjectData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">No quiz attempts yet.</p>
          ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" radius={[8, 8, 0, 0]}>
                {subjectData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
          <h3 className="font-bold mb-4">Quiz Attempts (last 7 days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={engagementData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="active" fill="hsl(152, 55%, 42%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
        <h3 className="font-bold mb-4">Top Performing Students</h3>
        {ranked.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No students have signed up yet.</p>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-3 px-2">{t("rank", language)}</th>
                <th className="text-left py-3">Student</th>
                <th className="text-left py-3">Grade</th>
                <th className="text-left py-3">XP</th>
                <th className="text-left py-3">{t("level", language)}</th>
                <th className="text-left py-3">Badges</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((s, i) => (
                <tr key={s.user_id} className="border-b border-border/50">
                  <td className="py-3 px-2 font-bold">#{i + 1}</td>
                  <td className="py-3">🧑 {s.display_name}</td>
                  <td className="py-3">{s.grade ?? "—"}</td>
                  <td className="py-3 text-xp font-semibold">{s.xp}</td>
                  <td className="py-3">{s.level}</td>
                  <td className="py-3">{(s.badges ?? []).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}
