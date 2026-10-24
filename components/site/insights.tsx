"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Insight } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Avatar } from "@/components/ui/avatar";
import { useLanguage } from "@/lib/i18n/language-provider";
import { formatMessage } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

export function InsightVisual({ insight }: { insight: Insight }) {
  const { t } = useLanguage();
  const visual = t.insights.visual;

  if (insight.visual === "chart") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-[#08101E]">
        <div className="absolute inset-0 bg-radial-blue opacity-70" />
        <div className="absolute inset-0 bg-grid-fine opacity-[0.12]" />
        <p className="absolute start-6 top-5 text-[0.48rem] uppercase tracking-[0.24em] text-white/42">{visual.intelligence}</p>
        <div className="absolute inset-x-6 bottom-5 top-12 rounded-t-lg border border-white/[0.08] border-b-0 bg-[#0B1527]/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.42rem] uppercase tracking-[0.15em] text-white/42">{visual.chartLabel}</p>
              <p className="mt-1 font-display text-lg font-medium text-white">{visual.chartTitle}</p>
            </div>
            <span className="rounded-full border border-emerald-300/15 bg-emerald-400/[0.07] px-2 py-0.5 text-[0.45rem] text-emerald-300">
              +38.2%
            </span>
          </div>
          <svg viewBox="0 0 280 80" fill="none" className="mt-4 w-full" aria-hidden="true">
            <defs>
              <linearGradient id="insight-chart-fill" x1="140" y1="0" x2="140" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#004BFF" stopOpacity="0.3" />
                <stop offset="1" stopColor="#004BFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 67C23 66 34 57 48 59C67 62 71 43 94 47C117 51 123 31 145 35C168 39 178 22 199 25C221 28 236 13 258 10C269 8 276 5 280 3V80H0Z" fill="url(#insight-chart-fill)" />
            <path d="M0 67C23 66 34 57 48 59C67 62 71 43 94 47C117 51 123 31 145 35C168 39 178 22 199 25C221 28 236 13 258 10C269 8 276 5 280 3" stroke="#6C96FF" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="280" cy="3" r="3" fill="#fff" />
          </svg>
        </div>
        <div dir="ltr" className="absolute bottom-2 inset-x-6 flex justify-between text-[0.4rem] uppercase tracking-[0.1em] text-white/38">
          <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
        </div>
      </div>
    );
  }

  if (insight.visual === "grid") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-[#0D111A]">
        <div className="absolute inset-0 bg-grid-fine opacity-20" />
        <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]" />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-electric/20" />
        <div className="absolute start-6 top-5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-electric-soft" />
          <p className="text-[0.48rem] uppercase tracking-[0.24em] text-white/42">{visual.measurement}</p>
        </div>
        <div className="absolute inset-x-6 top-[35%] grid grid-cols-3 gap-2">
          {[
            { value: "8.1x", label: "ROAS", accent: true },
            { value: "3.4x", label: "MER" },
            { value: "−37%", label: "CAC" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "rounded-lg border p-2.5 backdrop-blur-sm",
                stat.accent ? "border-electric/25 bg-electric/[0.09]" : "border-white/[0.08] bg-white/[0.025]",
              )}
            >
              <p className={cn("font-display text-base font-medium", stat.accent ? "text-electric-pale" : "text-white/78")}>{stat.value}</p>
              <p className="mt-0.5 text-[0.4rem] uppercase tracking-[0.12em] text-white/42">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="absolute inset-x-8 bottom-6 text-center font-display text-[0.72rem] font-medium tracking-[-0.01em] text-white/48">
          {visual.signal}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-electric">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_20%,rgba(255,255,255,0.26),transparent_55%)]" />
      <div className="absolute inset-0 bg-grid-fine opacity-[0.1]" />
      <p className="absolute start-6 top-5 text-[0.48rem] uppercase tracking-[0.24em] text-white/62">{visual.velocity}</p>
      <p className="absolute -bottom-9 start-4 font-display text-[8.5rem] font-semibold leading-none tracking-[-0.09em] text-white/92">
        60<span className="text-white/55">+</span>
      </p>
      <div className="absolute end-5 top-[34%] space-y-2">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className={cn(
              "flex h-9 w-20 items-center justify-between rounded-md border border-white/18 bg-white/[0.09] px-2 backdrop-blur-sm",
              item === 1 && "me-4",
            )}
          >
            <span className="h-4 w-4 rounded-sm bg-white/20" />
            <span className="text-[0.42rem] font-medium text-white/62">0{item + 1}</span>
          </div>
        ))}
      </div>
      <p className="absolute bottom-5 end-5 max-w-[7.5rem] text-end text-[0.48rem] uppercase leading-[1.7] tracking-[0.16em] text-white/55">
        {visual.assets}
      </p>
    </div>
  );
}

export function InsightCard({ insight, index = 0 }: { insight: Insight; index?: number }) {
  const { t } = useLanguage();

  return (
    <Link
      href={`/insights/${insight.id}`}
      className="group flex h-full flex-col"
      aria-label={formatMessage(t.insights.readAria, { title: insight.title })}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.08] transition-all duration-500 group-hover:border-electric/30 group-hover:shadow-[0_25px_60px_-30px_rgba(0,75,255,0.35)]">
        <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]">
          <InsightVisual insight={insight} />
        </div>
        <div className="absolute end-4 top-4 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center gap-2 text-[0.57rem] font-semibold uppercase tracking-[0.14em]">
          <span className="text-electric-soft/80">{insight.category}</span>
          <span className="h-1 w-1 rounded-full bg-white/15" />
          <span className="flex items-center gap-1 normal-case tracking-normal text-white/48">
            <Clock3 className="h-2.5 w-2.5" />
            {insight.readTime}
          </span>
          {index === 0 && (
            <span className="ms-auto rounded border border-white/10 px-1.5 py-0.5 text-[0.5rem] tracking-[0.08em] text-white/48">
              {t.insights.latest}
            </span>
          )}
        </div>
        <h3 className="mt-3 font-display text-[1.17rem] font-medium leading-[1.4] tracking-[-0.02em] text-white/85 transition-colors duration-300 group-hover:text-white">
          {insight.title}
        </h3>
        <p className="mt-2.5 line-clamp-2 text-[0.76rem] leading-6 text-white/48">{insight.excerpt}</p>
        <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-2.5">
            <Avatar initials={insight.initials} name={insight.author} size="xs" accent="from-[#334155] to-[#0f172a]" />
            <span className="text-[0.6rem] text-white/48">{insight.author}</span>
          </div>
          <span className="text-[0.58rem] text-white/42">{insight.date}</span>
        </div>
      </div>
    </Link>
  );
}

export function Insights() {
  const { t } = useLanguage();
  const copy = t.insights;

  return (
    <section id="insights" className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-32">
      <div className="pointer-events-none absolute right-0 top-20 h-[25rem] w-[25rem] rounded-full bg-electric/[0.05] blur-[110px] rtl:right-auto rtl:left-0" />
      <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <Reveal>
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={
              <>
                {copy.titleLine1}
                <br />
                {copy.titleLine2}
              </>
            }
            description={copy.description}
            action={
              <Link
                href="/insights"
                className="group inline-flex items-center gap-2 border-b border-white/15 pb-1 text-[0.78rem] font-semibold text-white/62 transition hover:border-white/40 hover:text-white"
              >
                {copy.viewAll}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {copy.items.map((insight, index) => (
            <Reveal key={insight.id} delay={(index % 3) as 0 | 1 | 2}>
              <InsightCard insight={insight} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
