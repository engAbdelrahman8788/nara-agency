"use client";

import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "muted";
};

export function SectionLabel({ children, className, tone = "light" }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em]",
        tone === "light" ? "text-white/62" : "text-mist",
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-soft opacity-40" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric-soft" />
      </span>
      {children}
    </span>
  );
}
