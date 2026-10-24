"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  Clapperboard,
  LayoutTemplate,
  MessagesSquare,
  Search,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Modal } from "@/components/ui/modal";
import { buttonStyles } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-provider";
import { formatMessage } from "@/lib/i18n/translations";

const iconMap: Record<string, typeof Target> = {
  media: Target,
  social: MessagesSquare,
  seo: Search,
  content: Clapperboard,
  web: LayoutTemplate,
};

const accentStyles: Record<string, { icon: string; wash: string; line: string }> = {
  media: {
    icon: "bg-electric/15 text-electric-soft border-electric/25",
    wash: "from-electric/[0.16] via-transparent to-transparent",
    line: "from-electric to-electric-soft",
  },
  social: {
    icon: "bg-[#5B8CFF]/12 text-[#8AABFF] border-[#5B8CFF]/20",
    wash: "from-[#5B8CFF]/12 via-transparent to-transparent",
    line: "from-[#5B8CFF] to-[#9DB7FF]",
  },
  seo: {
    icon: "bg-[#00C2FF]/10 text-[#56D9FF] border-[#00C2FF]/20",
    wash: "from-[#00C2FF]/10 via-transparent to-transparent",
    line: "from-[#00C2FF] to-[#6BE6FF]",
  },
  content: {
    icon: "bg-[#7C5CFF]/12 text-[#A692FF] border-[#7C5CFF]/20",
    wash: "from-[#7C5CFF]/12 via-transparent to-transparent",
    line: "from-[#7C5CFF] to-[#BAAEFF]",
  },
  web: {
    icon: "bg-[#FF7A59]/10 text-[#FFA28B] border-[#FF7A59]/20",
    wash: "from-[#FF7A59]/10 via-transparent to-transparent",
    line: "from-[#FF7A59] to-[#FFC0AE]",
  },
};

function ServiceVisual({ id }: { id: string }) {
  const { t } = useLanguage();
  const visual = t.services.visual;

  if (id === "media") {
    return (
      <div className="mt-6 grid grid-cols-3 gap-2.5">
        {[
          { name: "Meta", value: "5.2x", width: "88%", opacity: "bg-electric" },
          { name: "Google", value: "4.6x", width: "72%", opacity: "bg-electric-soft" },
          { name: "TikTok", value: "3.8x", width: "54%", opacity: "bg-electric-pale" },
        ].map((channel) => (
          <div key={channel.name} className="rounded-lg border border-white/[0.07] bg-black/15 p-3">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[0.6rem] font-medium text-white/55">{channel.name}</span>
              <span className="font-display text-[0.7rem] font-semibold text-white">{channel.value}</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
              <div className={cn("h-full rounded-full", channel.opacity)} style={{ width: channel.width }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id === "social") {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/15 p-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5B8CFF]/12 text-[#96B1FF]">
          <BarChart3 className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 text-[0.61rem]">
            <span className="text-white/55">{visual.engagement}</span>
            <span className="font-semibold text-emerald-300">+183%</span>
          </div>
          <div className="mt-2 flex h-7 items-end gap-1">
            {[31, 42, 36, 52, 45, 68, 61, 76, 84, 73, 92, 100].map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-sm bg-gradient-to-t from-[#335CC8]/40 to-[#8AABFF]"
                style={{ height: `${height}%`, opacity: 0.4 + index * 0.05 }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id === "seo") {
    return (
      <div className="mt-6 space-y-2">
        {[
          { keyword: visual.keywords[0], rank: "#1" },
          { keyword: visual.keywords[1], rank: "#2" },
        ].map((item) => (
          <div
            key={item.keyword}
            className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-black/15 px-3 py-2.5 text-[0.63rem]"
          >
            <span className="flex items-center gap-2 text-white/55">
              <Search className="h-3 w-3 text-[#56D9FF]/65" />
              {item.keyword}
            </span>
            <span className="font-display font-semibold text-[#7BE5FF]">{item.rank}</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === "content") {
    return (
      <div className="mt-6 flex gap-2.5">
        {[
          "from-[#2A3763] via-[#11182C] to-[#0B1125]",
          "from-[#3B2A4F] via-[#1A1427] to-[#110D20]",
          "from-[#423128] via-[#1D1714] to-[#120F0E]",
        ].map((gradient, index) => (
          <div
            key={gradient}
            className={cn(
              "relative h-[4.5rem] flex-1 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br",
              gradient,
            )}
          >
            <div className="absolute inset-0 bg-grid-fine opacity-20" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span className="text-[0.48rem] font-semibold uppercase tracking-[0.12em] text-white/55">0{index + 1}</span>
              <span className="h-1 w-1 rounded-full bg-white/45" />
            </div>
            <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-sm" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-white/[0.07] bg-black/15 p-3.5">
      <div className="flex items-center justify-between text-[0.59rem] uppercase tracking-[0.12em] text-white/48">
        <span>{visual.experiment}</span>
        <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 font-semibold text-emerald-300">{visual.winner}</span>
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <div className="flex-1 rounded-md border border-white/[0.07] bg-white/[0.025] px-2.5 py-2">
          <p className="text-[0.52rem] text-white/48">{visual.variantA}</p>
          <p className="mt-0.5 font-display text-sm text-white/62">2.8%</p>
        </div>
        <ArrowUpRight className="h-3.5 w-3.5 text-white/42 rtl:-scale-x-100" />
        <div className="flex-1 rounded-md border border-[#FF7A59]/20 bg-[#FF7A59]/[0.06] px-2.5 py-2">
          <p className="text-[0.52rem] text-[#FFA28B]/60">{visual.variantB}</p>
          <p className="mt-0.5 font-display text-sm text-[#FFB39F]">4.9%</p>
        </div>
      </div>
    </div>
  );
}

export function Services() {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = t.services.items.find((service) => service.id === selectedId) ?? null;

  const handleMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  };

  return (
    <section id="services" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[75%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute -left-64 top-1/3 h-[30rem] w-[30rem] rounded-full bg-electric/[0.06] blur-[120px] rtl:left-auto rtl:-right-64" />

      <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <Reveal>
          <SectionHeading
            eyebrow={t.services.eyebrow}
            title={
              <>
                {t.services.titleLine1}
                <br />
                {t.services.titleLine2}
              </>
            }
            description={t.services.description}
            action={
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 border-b border-white/15 pb-1 text-[0.78rem] font-semibold text-white/62 transition hover:border-white/40 hover:text-white"
              >
                {t.services.action}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </a>
            }
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          {t.services.items.map((service, index) => {
            const Icon = iconMap[service.id] ?? Target;
            const accent = accentStyles[service.id] ?? accentStyles.media;
            const span = index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5" : "lg:col-span-4";

            return (
              <Reveal key={service.id} delay={(index % 3) as 0 | 1 | 2} className={span}>
                <button
                  type="button"
                  onClick={() => setSelectedId(service.id)}
                  onMouseMove={handleMove}
                  aria-label={formatMessage(t.services.exploreAria, { title: service.title })}
                  className={cn(
                    "group relative flex h-full min-h-[20rem] w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-surface p-6 text-start card-interactive sm:p-7",
                    index === 0 && "lg:min-h-[25rem]",
                  )}
                >
                  <div className="mouse-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60", accent.wash)} />
                  <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.08] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

                  <div className="relative flex items-start justify-between">
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/42">
                      {service.eyebrow}
                    </span>
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-500 group-hover:scale-105 group-hover:bg-white/[0.07]",
                        accent.icon,
                      )}
                    >
                      <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.55} />
                    </span>
                  </div>

                  <div className="relative mt-8">
                    <h3 className="max-w-sm font-display text-[1.38rem] font-medium leading-snug tracking-[-0.02em] text-white sm:text-[1.5rem]">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-md text-[0.8rem] leading-[1.75] text-white/55">{service.description}</p>
                  </div>

                  <ServiceVisual id={service.id} />

                  <div className="relative mt-auto flex items-end justify-between gap-4 pt-7">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[0.57rem] font-medium text-white/48"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex shrink-0 items-end gap-3">
                      <div className="text-end">
                        <span className="font-display text-xl font-medium tracking-tight text-white sm:text-[1.65rem]">
                          {service.metric}
                        </span>
                        <p className="mt-0.5 whitespace-nowrap text-[0.53rem] uppercase tracking-[0.12em] text-white/42">
                          {service.metricLabel}
                        </p>
                      </div>
                      <span className="mb-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/55 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-white/25 group-hover:text-white rtl:group-hover:-translate-x-0.5">
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelectedId(null)} labelledBy="service-modal-title" size="lg">
        {selected && (
          <>
            <div className="relative overflow-hidden border-b border-white/[0.08] p-6 pe-14 sm:p-8 sm:pe-16">
              <div className="pointer-events-none absolute inset-0 bg-radial-blue opacity-60" />
              <div className="relative">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-electric-pale/65">
                  {selected.eyebrow}
                </span>
                <h2 id="service-modal-title" className="mt-4 max-w-lg font-display text-3xl font-medium leading-tight tracking-tight text-white">
                  {selected.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-mist">{selected.description}</p>
              </div>
            </div>
            <div className="grid gap-8 overflow-y-auto p-6 sm:grid-cols-[1fr_0.7fr] sm:p-8">
              <div>
                <p className="text-[0.63rem] font-semibold uppercase tracking-[0.17em] text-white/48">{t.services.included}</p>
                <ul className="mt-4 space-y-3">
                  {selected.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[0.83rem] leading-6 text-white/78">
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-electric/15 text-electric-soft">
                        <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] p-5">
                <div>
                  <p className="font-display text-4xl font-medium tracking-tight text-white">{selected.metric}</p>
                  <p className="mt-2 text-[0.7rem] uppercase tracking-[0.14em] text-white/48">{selected.metricLabel}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="rounded border border-white/10 px-2 py-1 text-[0.6rem] text-white/62">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href="#contact"
                  onClick={() => setSelectedId(null)}
                  className={buttonStyles({ className: "mt-7 w-full", size: "md" })}
                >
                  {t.services.discuss}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
