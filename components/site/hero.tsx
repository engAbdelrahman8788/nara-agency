"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { Avatar, StarRating } from "@/components/ui/avatar";
import { Reveal } from "@/components/ui/reveal";
import { useLanguage } from "@/lib/i18n/language-provider";

function HeroChart({ ariaLabel }: { ariaLabel: string }) {
  return (
    <svg viewBox="0 0 480 182" fill="none" className="h-auto w-full" role="img" aria-label={ariaLabel}>
      <defs>
        <linearGradient id="hero-area" x1="240" y1="15" x2="240" y2="175" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B59FF" stopOpacity="0.32" />
          <stop offset="0.72" stopColor="#004BFF" stopOpacity="0.04" />
          <stop offset="1" stopColor="#004BFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-line" x1="24" y1="112" x2="462" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3E78FF" />
          <stop offset="0.6" stopColor="#7FA3FF" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      {[35, 70, 105, 140, 175].map((y) => (
        <line key={y} x1="10" y1={y} x2="470" y2={y} stroke="white" strokeOpacity="0.055" strokeDasharray="3 6" />
      ))}
      <path
        d="M18 142 C48 140 53 126 79 128 C106 130 110 108 136 111 C161 114 170 96 196 99 C222 102 232 83 258 87 C285 91 290 64 318 67 C346 70 352 57 378 50 C405 43 427 38 462 22 L462 176 L18 176 Z"
        fill="url(#hero-area)"
      />
      <path
        d="M18 142 C48 140 53 126 79 128 C106 130 110 108 136 111 C161 114 170 96 196 99 C222 102 232 83 258 87 C285 91 290 64 318 67 C346 70 352 57 378 50 C405 43 427 38 462 22"
        stroke="url(#hero-line)"
        strokeWidth="2.25"
        strokeLinecap="round"
        className="chart-line"
      />
      <path
        d="M18 154 C56 148 76 144 110 141 C152 137 181 127 220 119 C268 109 315 91 354 78 C390 66 423 55 462 44"
        stroke="white"
        strokeOpacity="0.13"
        strokeWidth="1.25"
        strokeDasharray="4 5"
      />
      <circle cx="462" cy="22" r="7" fill="#004BFF" fillOpacity="0.2" />
      <circle cx="462" cy="22" r="3.5" fill="#FFFFFF" />
      <circle cx="462" cy="22" r="8" stroke="white" strokeOpacity="0.3" strokeWidth="0.75" />
    </svg>
  );
}

function HeroConsole() {
  const { t } = useLanguage();
  const consoleCopy = t.hero.console;

  return (
    <div className="relative mx-auto w-full max-w-[34rem] lg:ms-auto">
      <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.055] sm:h-[36rem] sm:w-[36rem]" />
      <div className="absolute left-1/2 top-1/2 h-[23rem] w-[23rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.045] sm:h-[28rem] sm:w-[28rem]" />
      <div className="absolute left-1/2 top-1/2 h-[17rem] w-[17rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/[0.16] blur-[90px] sm:h-[24rem] sm:w-[24rem]" />
      <div className="absolute -end-2 top-4 hidden items-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.25em] text-white/42 lg:flex">
        <span className="h-px w-8 bg-white/20" />
        {consoleCopy.label}
      </div>

      <div className="animate-float-delayed relative">
        <div className="absolute inset-x-8 -bottom-3 top-8 rounded-2xl border border-white/[0.06] bg-[#090d16]/95 shadow-float" />

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.11] bg-[#0b0f19]/95 shadow-float backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.15] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-electric/[0.22] blur-[70px]" />

          <div className="relative flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                  <path d="M4 16V4h3l6 8V4h3v12h-3L7 8v8H4Z" fill="#6E96FF" />
                </svg>
              </span>
              <div>
                <p className="text-[0.68rem] font-semibold text-white/88">{consoleCopy.title}</p>
                <p className="text-[0.58rem] text-white/48">{consoleCopy.client}</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-emerald-300">
              <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
              {consoleCopy.live}
            </span>
          </div>

          <div className="relative px-5 pb-5 pt-5 sm:px-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[0.63rem] font-medium uppercase tracking-[0.15em] text-white/48">{consoleCopy.attributedRevenue}</p>
                <div className="mt-1.5 flex items-end gap-2.5">
                  <span className="font-display text-[2.1rem] font-medium leading-none tracking-tight text-white sm:text-[2.45rem]">
                    $842,600
                  </span>
                  <span className="mb-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-400/[0.09] px-2 py-0.5 text-[0.62rem] font-semibold text-emerald-300">
                    <TrendingUp className="h-2.5 w-2.5" />
                    38.2%
                  </span>
                </div>
              </div>
              <div className="hidden items-center gap-1.5 sm:flex">
                {consoleCopy.ranges.map((range, index) => (
                  <span
                    key={range}
                    className={
                      index === 0
                        ? "rounded-md bg-white/[0.08] px-2.5 py-1 text-[0.6rem] font-medium text-white"
                        : "rounded-md px-2.5 py-1 text-[0.6rem] font-medium text-white/48"
                    }
                  >
                    {range}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <HeroChart ariaLabel={consoleCopy.chartAria} />
            </div>
            <div dir="ltr" className="flex justify-between border-t border-white/[0.06] pt-3 text-[0.55rem] uppercase tracking-[0.08em] text-white/42">
              <span>{consoleCopy.dates[0]}</span>
              <span className="hidden sm:inline">{consoleCopy.dates[1]}</span>
              <span>{consoleCopy.dates[2]}</span>
              <span className="hidden sm:inline">{consoleCopy.dates[3]}</span>
              <span>{consoleCopy.dates[4]}</span>
            </div>

            <div className="mt-5 grid grid-cols-3 divide-x divide-white/[0.07] rounded-xl border border-white/[0.07] bg-white/[0.025] rtl:divide-x-reverse">
              {consoleCopy.stats.map((stat) => (
                <div key={stat.label} className="px-3 py-3 sm:px-4">
                  <p className="truncate text-[0.55rem] uppercase tracking-[0.1em] text-white/48">{stat.label}</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <p className="font-display text-sm font-medium text-white sm:text-base">{stat.value}</p>
                    <span className="hidden text-[0.55rem] font-medium text-emerald-300 sm:inline">{stat.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -end-3 top-[26%] w-[8.8rem] animate-float rounded-xl border border-white/[0.11] bg-[#111624]/95 p-3.5 shadow-float backdrop-blur-xl sm:-end-7 sm:w-[10rem]">
        <div className="flex items-center justify-between">
          <p className="text-[0.54rem] font-medium uppercase tracking-[0.12em] text-white/48">{consoleCopy.goalPace}</p>
          <span className="h-1.5 w-1.5 rounded-full bg-electric-soft shadow-[0_0_8px_#5B8CFF]" />
        </div>
        <div className="mt-2 flex items-end justify-between">
          <span className="font-display text-2xl font-medium text-white">{consoleCopy.goalValue}</span>
          <span className="text-[0.56rem] font-medium text-emerald-300">{consoleCopy.onTrack}</span>
        </div>
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-electric to-electric-soft" />
        </div>
      </div>

      <div className="absolute -bottom-5 start-0 w-[12.8rem] animate-float-delayed rounded-xl border border-white/[0.1] bg-[#0d111b]/95 p-3.5 shadow-float backdrop-blur-xl sm:-start-8 sm:w-[14rem]">
        <div className="flex items-center gap-2.5">
          <Avatar initials="JL" size="sm" accent="from-[#C8A97E] to-[#766045]" name="Jordan Lee" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.68rem] font-semibold text-white">{consoleCopy.milestone}</p>
            <p className="mt-0.5 text-[0.56rem] text-white/48">{consoleCopy.milestoneDetail}</p>
          </div>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/[0.12]">
            <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5 text-emerald-300" aria-hidden="true">
              <path d="m2.5 6.2 2.2 2.1 4.8-4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

function MetricsTicker() {
  const { t } = useLanguage();
  const tickerItems = [...t.hero.ticker, ...t.hero.ticker];

  return (
    <div className="relative mt-20 border-y border-white/[0.07] bg-white/[0.012]">
      <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-24 bg-gradient-to-r from-canvas to-transparent rtl:bg-gradient-to-l" />
      <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-24 bg-gradient-to-l from-canvas to-transparent rtl:bg-gradient-to-r" />
      <div className="overflow-hidden py-4">
        <div className="marquee-track flex w-max animate-marquee items-center">
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0 items-center" aria-hidden={group === 1 ? "true" : undefined}>
              {tickerItems.map((metric, index) => (
                <div key={`${metric.label}-${group}-${index}`} className="flex shrink-0 items-center gap-5 px-8">
                  <span className="h-1.5 w-1.5 rotate-45 bg-electric-soft/70" />
                  <span className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl">{metric.value}</span>
                  <span className="whitespace-nowrap text-[0.63rem] font-medium uppercase tracking-[0.18em] text-white/48">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="noise-overlay relative overflow-hidden pb-2 pt-14 sm:pt-20 lg:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_18%,black,transparent_80%)]" />
        <div className="absolute left-1/2 top-[-12rem] h-[34rem] w-[62rem] -translate-x-1/2 rounded-full bg-electric/[0.12] blur-[130px]" />
        <div className="absolute right-[-10rem] top-[18rem] h-[26rem] w-[26rem] rounded-full bg-[#0B2D7A]/20 blur-[110px] rtl:right-auto rtl:left-[-10rem]" />
        <div className="absolute left-0 top-[26rem] h-[20rem] w-[20rem] rounded-full bg-[#0B2D7A]/10 blur-[100px] rtl:left-auto rtl:right-0" />
      </div>

      <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 xl:gap-16">
          <div>
            <Reveal delay={1}>
              <h1 className="text-display-xl font-display font-medium text-white text-balance">
                {t.hero.titleLead}
                <br />
                <span className="relative inline-block">
                  <span className="text-gradient-blue">{t.hero.titleAccent}</span>
                  <svg
                    viewBox="0 0 260 14"
                    fill="none"
                    aria-hidden="true"
                    className="absolute -bottom-1 start-0 h-3 w-full text-electric/65 sm:-bottom-2"
                    preserveAspectRatio="none"
                  >
                    <path d="M2 11C59 3.5 166 2 258 7.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                <span className="whitespace-nowrap text-gradient-blue">{t.hero.titleEnd}</span>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="mt-7 max-w-lg text-[0.98rem] leading-[1.8] text-mist sm:text-[1.06rem]">
                {t.hero.description}
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="#contact" className={buttonStyles({ size: "lg", className: "group w-full sm:w-auto" })}>
                  {t.hero.primaryCta}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5 rtl:group-hover/button:-translate-x-0.5" />
                </Link>
                <Link
                  href="#work"
                  className={buttonStyles({ variant: "secondary", size: "lg", className: "group w-full sm:w-auto" })}
                >
                  {t.hero.secondaryCta}
                  <ArrowDownRight className="h-4 w-4 text-white/55 transition-transform duration-300 group-hover/button:translate-y-0.5 rtl:-scale-x-100" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={4}>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5 rtl:space-x-reverse">
                    {[
                      { initials: "MC", accent: "from-[#5B8CFF] to-[#0030B4]", name: "Maya Chen" },
                      { initials: "JL", accent: "from-[#C8A97E] to-[#766045]", name: "Jordan Lee" },
                      { initials: "PR", accent: "from-[#00C2FF] to-[#00516D]", name: "Priya Raman" },
                      { initials: "CD", accent: "from-[#7C5CFF] to-[#3B1D9C]", name: "Camille Duval" },
                    ].map((person) => (
                      <Avatar
                        key={person.name}
                        initials={person.initials}
                        name={person.name}
                        accent={person.accent}
                        size="sm"
                        className="avatar-ring"
                      />
                    ))}
                    <span className="avatar-ring inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#171c2a] text-[0.58rem] font-semibold text-white/70">
                      {t.hero.clientCount}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <StarRating size={11} />
                      <span className="text-[0.65rem] font-semibold text-white/78">{t.hero.rating}</span>
                    </div>
                    <p className="mt-0.5 text-[0.62rem] text-white/48">{t.hero.partnerReviews}</p>
                  </div>
                </div>
                <div className="hidden h-7 w-px bg-white/10 sm:block" />
                <p className="max-w-[11rem] text-[0.65rem] leading-relaxed text-white/48">{t.hero.trusted}</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={2} className="relative lg:ps-3">
            <HeroConsole />
          </Reveal>
        </div>

        <MetricsTicker />
      </div>
    </section>
  );
}
