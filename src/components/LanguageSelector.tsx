import { Language, languageMeta } from "@/lib/translations";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Languages, Check } from "lucide-react";

interface Props {
  language: Language;
  onChange: (lang: Language) => void;
}

const allLanguages: Language[] = ["en", "hi", "ta", "te", "kn", "ml", "mr"];

export default function LanguageSelector({ language, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = languageMeta[language];
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full gap-2" title="Select language">
          <Languages className="w-4 h-4" />
          <span className="text-xs font-medium">{current.flag} {current.label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1">
        <div className="flex flex-col">
          {allLanguages.map((lang) => {
            const meta = languageMeta[lang];
            const active = language === lang;
            return (
              <button
                key={lang}
                onClick={() => {
                  onChange(lang);
                  setOpen(false);
                }}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
                title={meta.nativeName}
              >
                <span>{meta.flag} {meta.label}</span>
                {active && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
