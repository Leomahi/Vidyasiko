import { motion } from "framer-motion";
import { Language, t, subjects, leaderboard } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, Users, BookOpen, TrendingUp, Target } from "lucide-react";
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
];

export default function TeacherAnalytics({ language, onBack }: Props) {
  const subjectData = subjects.map((s) => ({
    name: language === "hi" ? s.nameHi : language === "ta" ? s.nameTa : s.name,
    progress: s.progress,
    students: Math.floor(Math.random() * 20) + 15,
  }));

  const engagementData = [
    { name: "Mon", active: 28 },
    { name: "Tue", active: 35 },
    { name: "Wed", active: 22 },
    { name: "Thu", active: 38 },
    { name: "Fri", active: 30 },
  ];

  const stats = [
    { icon: Users, label: "Total Students", value: "42", color: "text-primary" },
    { icon: BookOpen, label: "Active Lessons", value: "84", color: "text-secondary" },
    { icon: TrendingUp, label: "Avg. Progress", value: "54%", color: "text-accent" },
    { icon: Target, label: "Completion Rate", value: "67%", color: "text-level" },
  ];

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
          <h3 className="font-bold mb-4">Subject Progress</h3>
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
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
          <h3 className="font-bold mb-4">Daily Active Students</h3>
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-3 px-2">{t("rank", language)}</th>
                <th className="text-left py-3">Student</th>
                <th className="text-left py-3">XP</th>
                <th className="text-left py-3">{t("level", language)}</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, i) => (
                <tr key={entry.name} className="border-b border-border/50">
                  <td className="py-3 px-2 font-bold">#{i + 1}</td>
                  <td className="py-3">{entry.avatar} {entry.name}</td>
                  <td className="py-3 text-xp font-semibold">{entry.xp}</td>
                  <td className="py-3">{entry.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
