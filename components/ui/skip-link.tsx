"use client";

import { useLanguage } from "@/lib/i18n/language-provider";

export function SkipLink() {
  const { t } = useLanguage();

  return (
    <a
      href="#main-content"
      className="fixed start-4 top-4 z-[300] -translate-y-20 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-transform focus:translate-y-0"
    >
      {t.common.skipToContent}
    </a>
  );
}
