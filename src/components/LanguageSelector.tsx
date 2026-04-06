import { Language, languageMeta } from "@/lib/translations";

interface Props {
  language: Language;
  onChange: (lang: Language) => void;
}

const allLanguages: Language[] = ["en", "hi", "ta", "te", "kn", "ml", "mr"];

export default function LanguageSelector({ language, onChange }: Props) {
  return (
    <div className="flex gap-0.5 rounded-full bg-card p-1 shadow-sm border border-border flex-wrap">
      {allLanguages.map((lang) => {
        const meta = languageMeta[lang];
        return (
          <button
            key={lang}
            onClick={() => onChange(lang)}
            className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
              language === lang
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={meta.nativeName}
          >
            {meta.flag} {meta.label}
          </button>
        );
      })}
    </div>
  );
}
