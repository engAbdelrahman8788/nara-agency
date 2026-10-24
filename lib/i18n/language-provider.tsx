"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  translations,
  type Dictionary,
  type Direction,
  type Language,
} from "@/lib/i18n/translations";

const STORAGE_KEY = "nara-language";

type LanguageContextValue = {
  language: Language;
  direction: Direction;
  t: Dictionary;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

function applyDocumentLanguage(language: Language, forceEnglish = false) {
  if (typeof document === "undefined") return;
  const effectiveLanguage = forceEnglish ? "en" : language;
  const root = document.documentElement;
  root.lang = effectiveLanguage;
  root.dir = effectiveLanguage === "ar" ? "rtl" : "ltr";
  root.dataset.language = effectiveLanguage;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [language, setLanguageState] = useState<Language>("en");
  const isDashboard = pathname?.startsWith("/dashboard") ?? false;

  useIsomorphicLayoutEffect(() => {
    const stored = readStoredLanguage();
    if (stored !== "en") setLanguageState(stored);
  }, []);

  useEffect(() => {
    applyDocumentLanguage(language, isDashboard);
  }, [language, isDashboard]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next: Language = event.newValue === "ar" ? "ar" : "en";
      setLanguageState(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setLanguage = useCallback(
    (next: Language) => {
      if (next === language) return;

      const root = document.documentElement;
      root.classList.add("language-fade");
      applyDocumentLanguage(next, isDashboard);
      setLanguageState(next);

      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Language still applies for the current session.
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => root.classList.remove("language-fade"));
      });
    },
    [isDashboard, language],
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "ar" : "en");
  }, [language, setLanguage]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      direction: language === "ar" ? "rtl" : "ltr",
      t: translations[language],
      setLanguage,
      toggleLanguage,
    }),
    [language, setLanguage, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
