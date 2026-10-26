"use client";

import { useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Quote, TrendingUp } from "lucide-react";
import type { CaseStudyVisual } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Modal } from "@/components/ui/modal";
import { buttonStyles } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-provider";
import { formatMessage } from "@/lib/i18n/translations";
import { useCms } from "@/lib/cms/provider";
import {
  CASE_STUDY_CATEGORIES,
  getLocalizedCaseStudies,
  type ResolvedCaseStudy,
} from "@/lib/cms/content";

function AurelCover({ study }: { study: ResolvedCaseStudy }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#14120F]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(199,172,127,0.3),transparent_58%)]" />
      <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full border border-[#D2B88A]/10" />
      <div className="absolute left-8 top-7 h-28 w-28 rounded-full border border-[#D2B88A]/10" />
      <p className="absolute left-7 top-1/2 -translate-y-1/2 -rotate-90 font-display text-[0.54rem] uppercase tracking-[0.4em] text-[#CDB894]/38">
        Skin ritual / No. 04
      </p>
      <p className="absolute -right-3 -top-6 font-display text-[8rem] font-medium leading-none tracking-[-0.08em] text-[#EADDC4]/[0.035] sm:text-[11rem]">
        {study.monogram}
      </p>
      <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-gradient-to-t from-[#0D0C0A] via-[#0D0C0A]/50 to-transparent" />

      <div className="absolute left-1/2 top-[47%] flex -translate-x-1/2 -translate-y-1/2 items-end gap-3 sm:gap-5">
        <div className="relative h-28 w-12 rotate-[-7deg] rounded-[1.3rem_1.3rem_0.2rem_0.2rem] border border-white/15 bg-gradient-to-b from-[#EDE0C8] via-[#CDB894] to-[#8C7556] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)] sm:h-36 sm:w-16">
          <div className="absolute inset-x-[3px] top-8 h-px bg-black/15" />
          <span className="absolute inset-x-0 top-[52%] truncate px-1 text-center font-display text-[0.42rem] font-semibold tracking-[0.26em] text-[#3A2E21]">
            {study.brand}
          </span>
          <span className="absolute inset-x-0 top-[62%] text-center text-[0.27rem] uppercase tracking-[0.16em] text-[#3A2E21]/55">
            Renewal serum
          </span>
        </div>
        <div className="relative h-36 w-20 rounded-[0.65rem] border border-white/15 bg-gradient-to-br from-[#4B3A2A] via-[#2D2319] to-[#17120D] shadow-[0_28px_50px_-14px_rgba(0,0,0,0.9)] sm:h-44 sm:w-24">
          <div className="absolute inset-x-0 top-0 h-2 rounded-t-[0.65rem] border-b border-white/10 bg-[#1A1510]" />
          <span className="absolute inset-x-0 top-[38%] truncate px-1 text-center font-display text-[0.5rem] font-semibold tracking-[0.25em] text-[#D9C7A8]">
            {study.brand}
          </span>
          <span className="absolute inset-x-0 top-[47%] text-center text-[0.23rem] uppercase tracking-[0.18em] text-[#D9C7A8]/50">
            La crème / 50ml
          </span>
          <div className="absolute inset-x-3 bottom-4 h-px bg-[#D9C7A8]/20" />
        </div>
        <div className="hidden h-24 w-14 rotate-[-4deg] items-center justify-center rounded-full border border-[#CBB38E]/25 bg-[#CBB38E]/10 sm:flex">
          <div className="h-11 w-11 rounded-full border border-[#CBB38E]/30" />
        </div>
      </div>

      <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="max-w-[8rem] truncate font-display text-lg font-medium tracking-[0.3em] text-[#F2E8D7]">
            {study.brand}
          </p>
          <p className="mt-1 truncate text-[0.5rem] uppercase tracking-[0.2em] text-[#D9C7A8]/38">
            {study.niche}
          </p>
        </div>
        <span className="shrink-0 font-display text-[0.62rem] tracking-[0.1em] text-[#D9C7A8]/55">
          {study.growthMetric}
        </span>
      </div>
    </div>
  );
}

function NorthwindCover({ study }: { study: ResolvedCaseStudy }) {
  const stats =
    study.stats.length > 0
      ? study.stats.slice(0, 3)
      : [{ value: study.growthMetric, label: study.growthLabel }];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#081121]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(0,75,255,0.32),transparent_55%)]" />
      <div className="absolute inset-0 bg-grid-fine opacity-[0.16]" />
      <span className="absolute -left-2 -top-8 font-display text-[9rem] font-medium leading-none tracking-[-0.08em] text-white/[0.025] sm:text-[12rem]">
        {study.monogram}
      </span>
      <div className="absolute left-[9%] top-[16%] right-[8%] rounded-xl border border-white/[0.11] bg-[#0D1627]/93 p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:left-[14%] sm:right-[13%] sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.48rem] uppercase tracking-[0.17em] text-white/48">Pipeline overview</p>
            <p className="mt-1 font-display text-xl font-medium text-white sm:text-2xl">$4.8M</p>
          </div>
          <span className="flex max-w-[6rem] items-center gap-1 rounded-full border border-emerald-300/15 bg-emerald-400/[0.08] px-2 py-0.5 text-[0.48rem] font-semibold text-emerald-300">
            <TrendingUp className="h-2 w-2 shrink-0" />
            <span className="truncate">{study.growthMetric}</span>
          </span>
        </div>
        <svg viewBox="0 0 300 64" fill="none" className="mt-4 w-full" aria-hidden="true">
          <defs>
            <linearGradient id="nw-cover-fill" x1="150" y1="0" x2="150" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" stopOpacity="0.32" />
              <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M2 54C24 52 32 45 46 47C63 49 67 36 84 38C101 40 107 26 124 29C141 32 147 20 165 22C183 24 191 15 209 18C228 21 236 10 254 12C272 14 283 6 298 3V64H2Z"
            fill="url(#nw-cover-fill)"
          />
          <path
            d="M2 54C24 52 32 45 46 47C63 49 67 36 84 38C101 40 107 26 124 29C141 32 147 20 165 22C183 24 191 15 209 18C228 21 236 10 254 12C272 14 283 6 298 3"
            stroke="#7FA3FF"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <div className="mt-2 flex justify-between gap-2 border-t border-white/[0.07] pt-2.5">
          {stats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="min-w-0">
              <p className="truncate text-[0.42rem] uppercase tracking-[0.09em] text-white/42">
                {stat.label}
              </p>
              <p className="mt-0.5 truncate font-display text-[0.65rem] font-medium text-white/78">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-[13%] right-[8%] hidden max-w-[9rem] rounded-lg border border-white/10 bg-[#111B2D]/90 px-2.5 py-2 shadow-xl backdrop-blur sm:block">
        <p className="text-[0.42rem] uppercase tracking-[0.12em] text-white/48">Engagement</p>
        <p className="mt-0.5 truncate font-display text-[0.7rem] text-white/85">
          {study.period}
        </p>
      </div>
      <div className="absolute bottom-5 left-6 flex min-w-0 items-center gap-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#7FA3FF]/30 bg-[#7FA3FF]/10">
          <span className="font-display text-[0.45rem] font-bold text-[#B7C9FF]">
            {study.monogram}
          </span>
        </span>
        <div className="min-w-0">
          <p className="max-w-[8rem] truncate font-display text-[0.7rem] font-medium tracking-[0.19em] text-white/78">
            {study.brand}
          </p>
          <p className="truncate text-[0.42rem] uppercase tracking-[0.15em] text-white/42">
            {study.niche}
          </p>
        </div>
      </div>
      <div className="absolute bottom-5 right-6 font-display text-[0.62rem] text-[#9BB7FF]/70">
        {study.growthMetric}
      </div>
    </div>
  );
}

function SolaceCover({ study }: { study: ResolvedCaseStudy }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0E1713]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(107,158,125,0.24),transparent_60%)]" />
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A7C7AE]/12 sm:h-56 sm:w-56" />
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A7C7AE]/10 sm:h-40 sm:w-40" />
      <div className="absolute left-[30%] top-[22%] h-20 w-10 rotate-[24deg] rounded-[100%_0_100%_0] bg-gradient-to-b from-[#728E78]/30 to-transparent blur-[1px]" />
      <div className="absolute right-[26%] top-[19%] h-16 w-8 rotate-[-35deg] rounded-[0_100%_0_100%] bg-gradient-to-b from-[#9AB29E]/20 to-transparent blur-[1px]" />
      <div className="absolute left-1/2 top-1/2 flex h-28 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[1rem] border border-[#CADDCB]/25 bg-gradient-to-br from-[#BBCBB9] via-[#899C87] to-[#536653] shadow-[0_25px_50px_-16px_rgba(0,0,0,0.7)] sm:h-32 sm:w-40">
        <div className="absolute -top-[0.55rem] inset-x-3 h-3 rounded-full border border-[#D8E5D5]/35 bg-[#3D4B3D]" />
        <p className="max-w-[8rem] truncate px-2 font-display text-[0.7rem] font-semibold tracking-[0.25em] text-[#1F2B21]">
          {study.brand}
        </p>
        <p className="mt-1 text-[0.32rem] uppercase tracking-[0.17em] text-[#1F2B21]/55">Daily resilience</p>
        <div className="mt-2 h-px w-10 bg-[#1F2B21]/20" />
        <p className="mt-1 text-[0.3rem] text-[#1F2B21]/45">60 capsules</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A100D] to-transparent" />
      <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="max-w-[8rem] truncate font-display text-base font-medium tracking-[0.27em] text-[#DCE8D9]">
            {study.brand}
          </p>
          <p className="mt-1 truncate text-[0.46rem] uppercase tracking-[0.18em] text-[#AFC5B1]/35">
            {study.niche}
          </p>
        </div>
        <span className="shrink-0 font-display text-[0.62rem] tracking-[0.08em] text-[#BBD3BE]/60">
          {study.growthMetric}
        </span>
      </div>
    </div>
  );
}

function HaldenCover({ study }: { study: ResolvedCaseStudy }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#171511]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_63%_38%,rgba(195,166,124,0.24),transparent_58%)]" />
      <div className="absolute bottom-0 left-[12%] top-[14%] w-[38%] rounded-t-[100px] border border-[#C3A67C]/16 bg-gradient-to-b from-[#3A3227]/55 to-[#171511]/10" />
      <div className="absolute bottom-0 left-[12%] top-[14%] w-[38%] rounded-t-[100px] bg-gradient-to-r from-white/[0.04] to-transparent" />
      <div className="absolute right-[13%] top-[26%] h-[46%] w-[31%] border border-[#C3A67C]/12 bg-[#211D16]/80">
        <div className="absolute inset-5 border border-[#C3A67C]/10" />
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C3A67C]/10 blur-md" />
      </div>
      <div className="absolute bottom-[22%] left-1/2 h-8 w-[48%] border-t border-[#C3A67C]/20" />
      <div className="absolute bottom-[22%] left-[47%] h-[15%] w-px bg-[#C3A67C]/16" />
      <div className="absolute right-[20%] top-[44%] font-display text-[5rem] font-light leading-none tracking-[-0.08em] text-[#F1E7D6]/10 sm:text-[6.5rem]">
        {study.monogram}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0C0B09] via-[#0C0B09]/70 to-transparent" />
      <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="max-w-[8rem] truncate font-display text-[0.78rem] font-medium tracking-[0.3em] text-[#EEE5D6]">
            {study.brand}
          </p>
          <p className="mt-1 truncate text-[0.46rem] uppercase tracking-[0.18em] text-[#C3A67C]/40">
            {study.niche}
          </p>
        </div>
        <span className="shrink-0 font-display text-[0.62rem] tracking-[0.08em] text-[#D8C3A0]/60">
          {study.growthMetric}
        </span>
      </div>
      <div className="absolute left-6 top-5 text-[0.44rem] uppercase tracking-[0.2em] text-[#C3A67C]/30">
        Collection / 26
      </div>
    </div>
  );
}

function ElanCover({ study }: { study: ResolvedCaseStudy }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#E8E2D9]">
      <div className="absolute inset-y-0 right-0 w-[52%] bg-[#101010]" />
      <div className="absolute right-[8%] top-[16%] h-[64%] w-[27%] overflow-hidden rounded-t-[100px] bg-gradient-to-b from-[#514B43] via-[#242220] to-[#0A0A0A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_45%_30%,rgba(255,255,255,0.16),transparent_55%)]" />
        <div className="absolute -left-8 top-[24%] h-[50%] w-16 rotate-[18deg] rounded-[100%] bg-[#101010]/55 blur-md" />
      </div>
      <div className="absolute right-[19%] top-[12%] h-[40%] w-[22%] rotate-[16deg] rounded-full border border-white/10 opacity-60" />
      <div className="absolute left-7 top-1/2 max-w-[45%] -translate-y-1/2">
        <p className="font-display text-[0.46rem] uppercase tracking-[0.3em] text-black/30">Collection 03</p>
        <p className="mt-3 max-w-[10rem] break-words font-display text-[2.4rem] font-light leading-[0.9] tracking-[-0.05em] text-[#141210] sm:text-[3.5rem]">
          {study.brand}
        </p>
        <p className="mt-3 max-w-[6rem] text-[0.48rem] uppercase leading-[1.7] tracking-[0.18em] text-black/35">
          {study.niche}
        </p>
        <div className="mt-5 h-px w-12 bg-black/20" />
      </div>
      <span className="absolute bottom-[8%] right-8 rotate-90 origin-bottom-right text-[0.42rem] uppercase tracking-[0.28em] text-white/42">
        Paris — New York
      </span>
      <div className="absolute bottom-5 left-6 max-w-[40%] truncate text-[0.46rem] uppercase tracking-[0.15em] text-black/30">
        {study.growthLabel || "Sold out in 19 days"}
      </div>
      <div className="absolute bottom-5 right-6 font-display text-[0.62rem] text-white/62">
        {study.growthMetric}
      </div>
    </div>
  );
}

function KinetiqCover({ study }: { study: ResolvedCaseStudy }) {
  const stats =
    study.stats.length > 0
      ? study.stats.slice(0, 3)
      : [{ value: study.growthMetric, label: study.growthLabel }];
  const suffix = study.growthMetric.trim().endsWith("%") ? "%" : "";
  const metricValue = suffix
    ? study.growthMetric.trim().slice(0, -1)
    : study.growthMetric;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#071016]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,194,255,0.13),transparent_62%)]" />
      <div className="absolute inset-0 bg-grid-fine opacity-[0.12]" />
      <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 600 360" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M100 250 235 170 350 226 490 100" stroke="rgba(0,194,255,0.16)" strokeWidth="1" strokeDasharray="3 5" />
        <path d="M87 110 235 170 400 62 525 190" stroke="rgba(0,194,255,0.1)" strokeWidth="1" strokeDasharray="3 5" />
        {[
          [100, 250],
          [235, 170],
          [350, 226],
          [490, 100],
          [87, 110],
          [400, 62],
          [525, 190],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="10" fill="#00C2FF" fillOpacity="0.045" />
            <circle cx={x} cy={y} r="2.5" fill="#53DBFF" fillOpacity="0.5" />
          </g>
        ))}
      </svg>
      <div className="absolute inset-x-[10%] top-[22%] text-center sm:top-[20%]">
        <p className="truncate text-[0.45rem] uppercase tracking-[0.28em] text-[#56D9FF]/40">
          {study.growthLabel || "Organic search growth"}
        </p>
        <p className="mt-2 break-words font-display text-[2.6rem] font-medium leading-none tracking-[-0.04em] text-white sm:text-[3.5rem]">
          {metricValue}
          {suffix && <span className="text-[#56D9FF]">{suffix}</span>}
        </p>
        <p className="mt-2 text-[0.55rem] text-white/48">{study.period}</p>
      </div>
      <div className="absolute inset-x-[11%] bottom-[16%] flex items-center justify-between gap-2 rounded-lg border border-white/[0.08] bg-[#0A1720]/80 px-3 py-2.5 backdrop-blur-sm">
        {stats.map((stat, index) => (
          <div key={`${stat.label}-${index}`} className="flex min-w-0 flex-1 items-center gap-2">
            {index > 0 && <span className="h-6 w-px shrink-0 bg-white/[0.08]" />}
            <div className="min-w-0">
              <p className="truncate text-[0.41rem] uppercase tracking-[0.12em] text-white/42">
                {stat.label}
              </p>
              <p className="mt-0.5 truncate font-display text-[0.7rem] text-white/80">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
        <p className="max-w-[8rem] truncate font-display text-[0.7rem] font-medium tracking-[0.24em] text-[#D5F6FF]/72">
          {study.brand}
        </p>
        <span className="truncate text-[0.42rem] uppercase tracking-[0.16em] text-white/42">
          {study.niche}
        </span>
      </div>
    </div>
  );
}

const coverMap: Record<
  CaseStudyVisual,
  ComponentType<{ study: ResolvedCaseStudy }>
> = {
  beauty: AurelCover,
  saas: NorthwindCover,
  wellness: SolaceCover,
  home: HaldenCover,
  fashion: ElanCover,
  b2b: KinetiqCover,
};

function CaseCover({ study }: { study: ResolvedCaseStudy }) {
  const Cover = coverMap[study.visual] ?? KinetiqCover;
  return <Cover study={study} />;
}

export function CaseStudies() {
  const { t, language } = useLanguage();
  const { content } = useCms();
  const copy = t.work;
  const studies = useMemo(
    () => getLocalizedCaseStudies(content, language),
    [content, language],
  );
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = studies.find((study) => study.id === selectedId) ?? null;

  const categoryLabels = copy.categoryLabels as Record<string, string>;
  const categoryFilters = useMemo(() => {
    const present = new Set(studies.map((study) => study.category));

    return [
      { id: "all", label: copy.filters[0]?.label ?? "All work" },
      ...CASE_STUDY_CATEGORIES.filter((category) => present.has(category)).map(
        (category) => ({
          id: category,
          label: categoryLabels[category] ?? category,
        }),
      ),
    ];
  }, [categoryLabels, copy.filters, studies]);

  const validFilter = categoryFilters.some(
    (filter) => filter.id === activeFilter,
  )
    ? activeFilter
    : "all";
  const filtered = useMemo(
    () =>
      validFilter === "all"
        ? studies
        : studies.filter((study) => study.category === validFilter),
    [studies, validFilter],
  );

  return (
    <section id="work" className="relative overflow-hidden border-y border-white/[0.06] bg-[#080A10] py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,75,255,0.08),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />

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
              <div className="flex items-center gap-3">
                <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/48">
                  {formatMessage(copy.showing, { count: filtered.length, total: studies.length })}
                </span>
                <span className="h-px w-8 bg-white/15" />
              </div>
            }
          />
        </Reveal>

        {studies.length > 0 && (
          <Reveal delay={1}>
            <div
              className="mt-10 flex gap-2 overflow-x-auto pb-1 hide-scrollbar"
              role="group"
              aria-label={copy.filterAria}
            >
              {categoryFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={validFilter === filter.id}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-[0.7rem] font-semibold transition-all duration-300",
                    validFilter === filter.id
                      ? "border-electric/40 bg-electric/15 text-white shadow-glow-sm"
                      : "border-white/[0.08] bg-white/[0.02] text-white/55 hover:border-white/20 hover:text-white/78",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {filtered.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-2 lg:gap-x-6 lg:gap-y-12">
            {filtered.map((study, index) => (
              <button
                key={`${validFilter}-${study.id}`}
                type="button"
                onClick={() => setSelectedId(study.id)}
                className="group animate-fade-up text-start"
                style={{ animationDelay: `${index * 70}ms` }}
                aria-label={formatMessage(copy.viewAria, { brand: study.brand, headline: study.title })}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.09] bg-surface transition-all duration-500 ease-out-expo group-hover:border-electric/30 group-hover:shadow-[0_28px_70px_-32px_rgba(0,75,255,0.3)]">
                  <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.035]">
                    <CaseCover study={study} />
                  </div>
                  <div className="absolute start-4 top-4 z-10 rounded-full border border-white/12 bg-black/35 px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-white/78 backdrop-blur-md">
                    {categoryLabels[study.category] ?? study.category}
                  </div>
                  <div className="absolute end-4 top-4 z-10 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.04]" />
                </div>

                <div className="mt-5 flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-[0.6rem] font-semibold tracking-[0.2em] text-white/42">
                        {study.niche}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-white/15" />
                      <span className="text-[0.58rem] text-white/42">{study.period}</span>
                    </div>
                    <h3 className="mt-2.5 max-w-lg font-display text-xl font-medium leading-[1.25] tracking-[-0.02em] text-white/88 transition-colors duration-300 group-hover:text-white sm:text-[1.38rem]">
                      {study.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 max-w-lg text-[0.76rem] leading-6 text-white/48">{study.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {study.services.map((service, serviceIndex) => (
                        <span
                          key={`${service}-${serviceIndex}`}
                          className="rounded border border-white/[0.07] px-2 py-0.5 text-[0.55rem] font-medium text-white/48"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 pt-1 text-end">
                    <p className="font-display text-xl font-medium tracking-tight text-white sm:text-[1.55rem]">{study.growthMetric}</p>
                    <p className="mt-1 max-w-[5.5rem] text-[0.52rem] uppercase leading-[1.5] tracking-[0.1em] text-white/42">
                      {study.growthLabel}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <Reveal delay={1}>
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.012] px-6 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-electric/20 bg-electric/[0.07] text-electric-soft">
                <TrendingUp className="h-5 w-5" />
              </span>
              <p className="mt-4 font-display text-xl font-medium tracking-[-0.02em] text-white">
                {copy.emptyTitle}
              </p>
              <p className="mt-2 max-w-md text-[0.8rem] leading-6 text-white/45">
                {copy.emptyText}
              </p>
            </div>
          </Reveal>
        )}
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        labelledBy="case-modal-title"
        describedBy="case-modal-description"
        size="xl"
      >
        {selected && (
          <div className="overflow-y-auto">
            <div className="relative h-48 overflow-hidden border-b border-white/[0.08] sm:h-60">
              <CaseCover study={selected} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F121C] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8">
                <div className="min-w-0">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/55">
                    {selected.niche} · {selected.period}
                  </p>
                  <h2
                    id="case-modal-title"
                    className="mt-2 max-w-2xl font-display text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl"
                  >
                    {selected.title}
                  </h2>
                </div>
                <div className="shrink-0 rounded-lg border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md">
                  <p className="font-display text-xl font-medium text-white">{selected.growthMetric}</p>
                  <p className="text-[0.52rem] uppercase tracking-[0.12em] text-white/55">{selected.growthLabel}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.3fr_0.7fr]">
              <div>
                <p id="case-modal-description" className="max-w-xl text-[0.9rem] leading-7 text-white/70">
                  {selected.description}
                </p>

                {selected.stats.length > 0 && (
                  <div className="mt-8 grid grid-cols-3 gap-2.5">
                    {selected.stats.map((stat, index) => (
                      <div key={`${stat.label}-${index}`} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5">
                        <p className="font-display text-xl font-medium text-white sm:text-2xl">{stat.value}</p>
                        <p className="mt-1 text-[0.55rem] uppercase tracking-[0.1em] text-white/48">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selected.challenge && (
                  <div className="mt-8">
                    <h3 className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-white/48">{copy.challenge}</h3>
                    <p className="mt-3 text-[0.83rem] leading-7 text-white/62">{selected.challenge}</p>
                  </div>
                )}

                {selected.approach.length > 0 && (
                  <div className="mt-7">
                    <h3 className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-white/48">{copy.approach}</h3>
                    <ul className="mt-3 space-y-2.5">
                      {selected.approach.map((item, index) => (
                        <li key={`${item}-${index}`} className="flex items-start gap-2.5 text-[0.8rem] leading-6 text-white/62">
                          <span className="mt-1.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-electric/25 bg-electric/10 text-electric-soft">
                            <Check className="h-2 w-2" strokeWidth={3} />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selected.result && (
                  <div className="mt-7">
                    <h3 className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-white/48">{copy.result}</h3>
                    <p className="mt-3 text-[0.83rem] leading-7 text-white/62">{selected.result}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {(selected.before || selected.after) && (
                  <div className="rounded-xl border border-white/[0.08] bg-[#0A0D15] p-5">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/48">{copy.beforeAfter}</p>
                    <div className="mt-5 space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-3 text-[0.62rem]">
                          <span className="text-white/48">{selected.beforeLabel}</span>
                          <span className="text-white/62">{selected.before}</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                          <div className="h-full w-[31%] rounded-full bg-white/20" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-3 text-[0.62rem]">
                          <span className="text-white/62">{selected.afterLabel}</span>
                          <span className="font-semibold text-white">{selected.after}</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                          <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-electric to-electric-soft shadow-glow-sm rtl:bg-gradient-to-l" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selected.quote && (
                  <blockquote className="relative rounded-xl border border-white/[0.08] bg-white/[0.025] p-5">
                    <Quote className="h-5 w-5 text-electric-soft/40" />
                    <p className="mt-3 text-[0.8rem] leading-6 text-white/70">{selected.quote}</p>
                    {selected.author && (
                      <footer className="mt-4 border-t border-white/[0.07] pt-3 text-[0.6rem] text-white/48">{selected.author}</footer>
                    )}
                  </blockquote>
                )}

                {selected.services.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selected.services.map((service, index) => (
                      <span key={`${service}-${index}`} className="rounded border border-white/[0.08] px-2 py-1 text-[0.56rem] text-white/48">
                        {service}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href="#contact"
                  onClick={() => setSelectedId(null)}
                  className={buttonStyles({ className: "w-full", size: "md" })}
                >
                  {copy.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
