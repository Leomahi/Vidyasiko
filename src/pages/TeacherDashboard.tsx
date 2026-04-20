import { useAuth } from "@/hooks/useAuth";
import { Language } from "@/lib/translations";
import { useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import TeacherAnalytics from "@/components/TeacherAnalytics";
import { Button } from "@/components/ui/button";
import { LogOut, Users } from "lucide-react";

export default function TeacherDashboard() {
  const { signOut } = useAuth();
  const [language, setLanguage] = useState<Language>("en");

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
            <Users className="w-7 h-7 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Teacher Portal</h1>
            <p className="text-sm text-muted-foreground">Monitor your classroom</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <LanguageSelector language={language} onChange={setLanguage} />
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={signOut} className="rounded-full">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <TeacherAnalytics language={language} onBack={() => { /* root view */ }} />
    </div>
  );
}
