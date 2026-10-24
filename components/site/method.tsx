"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { buttonStyles } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useLanguage } from "@/lib/i18n/language-provider";

export function Method() {
  const { t } = useLanguage();
  const copy = t.method;

  return (
    <section id="method" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute -right-52 top-44 h-[32rem] w-[32rem] rounded-full bg-electric/[0.08] blur-[140px] rtl:left-[-13rem] rtl:right-auto" />

      <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="noise-overlay overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0E16] shadow-card">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-electric/[0.09] blur-[90px] rtl:left-auto rtl:-right-20" />

            <div className="relative grid lg:grid-cols-[0.84fr_1.16fr]">
              <div className="flex flex-col justify-between border-b border-white/[0.07] p-7 sm:p-10 lg:border-b-0 lg:border-e lg:p-12">
                <div>
                  <SectionLabel>{copy.eyebrow}</SectionLabel>
                  <h2 className="mt-5 max-w-md font-display text-display-sm font-medium leading-[1.06] tracking-[-0.035em] text-white text-balance">
                    {copy.titleLine1}{" "}
                    <span className="text-white/55">{copy.titleLine2}</span>
                  </h2>
                  <p className="mt-5 max-w-sm text-[0.87rem] leading-7 text-mist">{copy.description}</p>

                  <ul className="mt-7 space-y-2.5">
                    {copy.principles.map((principle) => (
                      <li key={principle} className="flex items-center gap-2.5 text-[0.76rem] font-medium text-white/70">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-electric/20 bg-electric/10 text-electric-soft">
                          <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                        </span>
                        {principle}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-12">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 rtl:space-x-reverse">
                      <Avatar initials="MC" name="Maya Chen" accent="from-[#5B8CFF] to-[#0030B4]" size="sm" className="ring-2 ring-[#0B0E16]" />
                      <Avatar initials="DP" name="Dev Patel" accent="from-[#C8A97E] to-[#6B5136]" size="sm" className="ring-2 ring-[#0B0E16]" />
                      <Avatar initials="IC" name="Iris Chen" accent="from-[#7C5CFF] to-[#3B1D9C]" size="sm" className="ring-2 ring-[#0B0E16]" />
                      <Avatar initials="LO" name="Lena Ortiz" accent="from-[#00C2FF] to-[#00516D]" size="sm" className="ring-2 ring-[#0B0E16]" />
                    </div>
                    <div>
                      <p className="text-[0.7rem] font-semibold text-white/78">{copy.podTitle}</p>
                      <p className="text-[0.58rem] text-white/48">{copy.podSubtitle}</p>
                    </div>
                  </div>
                  <Link
                    href="#contact"
                    className={buttonStyles({ variant: "secondary", size: "md", className: "mt-6 w-full sm:w-auto" })}
                  >
                    {copy.cta}
                    <ArrowUpRight className="h-4 w-4 text-white/55" />
                  </Link>
                </div>
              </div>

              <div className="relative p-7 sm:p-10 lg:p-12">
                <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-electric-soft" />
                    <span className="text-[0.63rem] font-semibold uppercase tracking-[0.16em] text-white/55">
                      {copy.engagementLabel}
                    </span>
                  </div>
                  <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[0.55rem] font-medium uppercase tracking-[0.12em] text-white/48">
                    {copy.engagementWindow}
                  </span>
                </div>

                <div>
                  {copy.phases.map((phase, index) => (
                    <div
                      key={phase.number}
                      className="group grid grid-cols-[auto_1fr] gap-4 border-b border-white/[0.07] py-6 last:border-b-0 sm:gap-6"
                    >
                      <div className="flex flex-col items-center">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.025] font-display text-[0.67rem] font-medium text-white/55 transition-colors duration-300 group-hover:border-electric/30 group-hover:bg-electric/10 group-hover:text-electric-pale">
                          {phase.number}
                        </span>
                        {index !== copy.phases.length - 1 && <span className="mt-2 w-px flex-1 bg-gradient-to-b from-white/10 to-transparent" />}
                      </div>
                      <div className="pb-5 last:pb-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-display text-[1.02rem] font-medium tracking-tight text-white/88 transition-colors group-hover:text-white">
                            {phase.title}
                          </h3>
                          <span className="text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-white/42">
                            {phase.duration}
                          </span>
                        </div>
                        <p className="mt-2 max-w-lg text-[0.76rem] leading-[1.7] text-white/48">{phase.description}</p>
                        <div className="mt-3 inline-flex items-center gap-2 text-[0.6rem] text-white/48">
                          <span className="h-1 w-1 rounded-full bg-electric-soft/70" />
                          {copy.outputLabel} {phase.output}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
