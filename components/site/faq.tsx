"use client";

import Link from "next/link";
import { ArrowUpRight, Calculator } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { buttonStyles } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-provider";

export function Faq() {
  const { t } = useLanguage();
  const copy = t.faq;

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.06] py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,75,255,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[26rem] w-[26rem] rounded-full bg-electric/[0.05] blur-[120px] rtl:right-auto rtl:-left-40" />

      <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
          <Reveal>
            <SectionLabel>{copy.eyebrow}</SectionLabel>
            <h2
              id="faq-heading"
              className="mt-5 max-w-md text-display-md font-display font-medium text-gradient-white text-balance"
            >
              {copy.titleLine1}
              <br />
              <span className="text-white/48">{copy.titleLine2}</span>
            </h2>
            <p className="mt-5 max-w-md text-[0.95rem] leading-7 text-mist text-pretty">
              {copy.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#roi"
                className={buttonStyles({
                  variant: "secondary",
                  size: "md",
                })}
              >
                <Calculator className="h-4 w-4 text-white/55" />
                {copy.calcCta}
              </Link>
              <Link
                href="#contact"
                className="group inline-flex items-center gap-2 border-b border-white/15 pb-1 text-[0.78rem] font-semibold text-white/62 transition hover:border-white/40 hover:text-white"
              >
                {copy.askCta}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <div className="space-y-3">
            {copy.items.map((item, index) => (
              <Reveal
                key={item.question}
                delay={(index % 3) as 0 | 1 | 2}
              >
                <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface p-6 transition-colors duration-300 hover:border-white/[0.15] sm:p-7">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-electric/[0.06] opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-100 rtl:right-auto rtl:-left-16" />
                  <div className="relative flex items-start gap-4 sm:gap-5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-electric/20 bg-electric/[0.08] font-display text-[0.68rem] font-semibold tabular-nums text-electric-soft">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-white sm:text-[1.15rem]">
                        {item.question}
                      </h3>
                      <p className="mt-2.5 text-[0.8rem] leading-[1.75] text-white/55">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
