import { Language } from "@/lib/data";

interface Props {
  language: Language;
  onChange: (lang: Language) => void;
}

const flags: Record<Language, string> = { en: "🇬🇧", hi: "🇮🇳", ta: "🇮🇳" };
const labels: Record<Language, string> = { en: "EN", hi: "हिं", ta: "த" };

export default function LanguageSelector({ language, onChange }: Props) {
  return (
    <div className="flex gap-1 rounded-full bg-card p-1 shadow-sm border border-border">
      {(["en", "hi", "ta"] as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            language === lang
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {flags[lang]} {labels[lang]}
        </button>
      ))}
    </div>
  );
}
