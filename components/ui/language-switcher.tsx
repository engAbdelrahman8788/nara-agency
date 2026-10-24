"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/language-provider";
import type { Language } from "@/lib/i18n/translations";

const options: { id: Language; shortKey: "english" | "arabic"; ariaKey: "switchToEnglish" | "switchToArabic" }[] = [
  { id: "en", shortKey: "english", ariaKey: "switchToEnglish" },
  { id: "ar", shortKey: "arabic", ariaKey: "switchToArabic" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      dir="ltr"
      role="group"
      aria-label={t.language.label}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-0.5 rounded-lg border border-white/[0.09] bg-white/[0.025] p-0.5",
        className,
      )}
    >
      <Globe className="mx-1 h-3.5 w-3.5 shrink-0 text-white/38" aria-hidden="true" />
      {options.map((option) => {
        const active = language === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setLanguage(option.id)}
            aria-pressed={active}
            aria-label={t.language[option.ariaKey]}
            className={cn(
              "flex h-7 items-center rounded-md px-2 text-[0.66rem] font-semibold leading-none transition-all duration-300",
              active
                ? "bg-white/[0.1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "text-white/45 hover:bg-white/[0.04] hover:text-white/80",
            )}
          >
            <span lang={option.id === "ar" ? "ar" : "en"}>{option.id === "ar" ? "العربية" : "EN"}</span>
          </button>
        );
      })}
    </div>
  );
}
