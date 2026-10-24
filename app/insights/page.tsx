import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { InsightCard, InsightVisual } from "@/components/site/insights";
import { Avatar } from "@/components/ui/avatar";
import { SectionLabel } from "@/components/ui/section-label";
import { insights } from "@/lib/data";
import { articles } from "@/lib/insights-content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Sharp thinking on paid media, measurement, and creative systems from the NARA growth desk. No fluff, no hot takes.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "NARA Insights — Ideas for the growth-obsessed",
    description:
      "Sharp thinking on paid media, measurement, and creative systems from the NARA growth desk.",
    url: "/insights",
    type: "website",
  },
};

const principles = [
  { value: "01", title: "Written from the work", text: "Every essay comes from an account, a test, or a decision we had to make with a client." },
  { value: "02", title: "No recycled takes", text: "If it has been said better elsewhere, we link to it instead of paraphrasing it." },
  { value: "03", title: "Useful by Monday", text: "The test is simple: can an operator do something differently after reading it?" },
];

export default function InsightsIndexPage() {
  const [featured, ...rest] = insights;
  const featuredArticle = articles[featured.id];

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/[0.06]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(0,75,255,0.15),transparent_58%)]" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.22]" />
          <div className="relative mx-auto max-w-8xl px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pt-24">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <SectionLabel>NARA insights</SectionLabel>
                <h1 className="mt-6 font-display text-display-lg font-medium text-balance text-gradient-white">
                  Ideas for the
                  <br />
                  growth-obsessed.
                </h1>
                <p className="mt-6 max-w-xl text-[0.98rem] leading-7 text-mist text-pretty">
                  Sharp thinking on the systems, creative, and signals shaping modern growth.
                  Written by the people doing the work.
                </p>
              </div>
              <div className="flex shrink-0 items-end gap-8 border-l border-white/[0.08] pl-6 pb-1 sm:gap-12">
                <div>
                  <p className="font-display text-[1.6rem] font-medium leading-none text-white/78">Vol. 01</p>
                  <p className="mt-2 text-[0.55rem] uppercase tracking-[0.16em] text-white/42">Current edition</p>
                </div>
                <div>
                  <p className="font-display text-[1.6rem] font-medium leading-none text-white/78">2026</p>
                  <p className="mt-2 text-[0.55rem] uppercase tracking-[0.16em] text-white/42">Field notes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-14 sm:py-20">
          <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white/42">Featured essay</p>
              <span className="text-[0.58rem] text-white/42">The latest from the desk</span>
            </div>

            <Link
              href={`/insights/${featured.id}`}
              className="group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0E16] transition-all duration-500 hover:border-electric/25 hover:shadow-[0_40px_100px_-50px_rgba(0,75,255,0.45)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(0,75,255,0.05),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative grid lg:grid-cols-[1.02fr_0.98fr]">
                <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                  <div className="flex flex-wrap items-center gap-2.5 text-[0.54rem] font-semibold uppercase tracking-[0.15em]">
                    <span className="rounded-full border border-electric/25 bg-electric/[0.07] px-2.5 py-1 text-electric-pale">
                      {featured.category}
                    </span>
                    <span className="text-white/42">{featured.date}</span>
                    <span className="flex items-center gap-1.5 normal-case tracking-normal text-white/42">
                      <Clock3 className="h-2.5 w-2.5" />
                      {featured.readTime}
                    </span>
                  </div>

                  <h2 className="mt-6 max-w-[34rem] font-display text-[clamp(1.8rem,3.1vw,2.85rem)] font-medium leading-[1.08] tracking-[-0.04em] text-white/88 transition-colors duration-300 group-hover:text-white">
                    {featured.title}
                  </h2>
                  <p className="mt-5 max-w-[31rem] text-[0.87rem] leading-7 text-white/48">
                    {featuredArticle.subtitle}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-5">
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        initials={featured.initials}
                        name={featured.author}
                        size="sm"
                        accent="from-[#4D7DFF] to-[#0B1B4D]"
                      />
                      <div>
                        <p className="text-[0.66rem] font-semibold text-white/70">{featured.author}</p>
                        <p className="mt-0.5 text-[0.52rem] text-white/42">{featuredArticle.authorRole}</p>
                      </div>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/55 transition-all duration-300 group-hover:border-electric/40 group-hover:bg-electric/10 group-hover:text-white">
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>

                <div className="relative min-h-[16rem] overflow-hidden border-t border-white/[0.06] lg:min-h-[27rem] lg:border-l lg:border-t-0">
                  <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.025]">
                    <InsightVisual insight={featured} />
                  </div>
                  <div className="absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-[#0B0E16] to-transparent lg:block" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="relative pb-16 sm:pb-24">
          <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between border-t border-white/[0.07] pt-10">
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white/42">The archive</p>
                <h2 className="mt-3 font-display text-display-sm font-medium tracking-[-0.03em] text-white/80">
                  More from the desk.
                </h2>
              </div>
              <p className="hidden text-[0.62rem] text-white/42 sm:block">{insights.length} essays in this edition</p>
            </div>

            <div className="mt-10 grid gap-x-7 gap-y-12 md:grid-cols-2">
              {rest.map((insight, index) => (
                <InsightCard key={insight.id} insight={insight} index={index + 1} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative border-t border-white/[0.07] bg-[#090B11]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_0%,rgba(0,75,255,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-8xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-electric-pale/55">Editorial standard</p>
                <h2 className="mt-4 font-display text-[clamp(1.7rem,2.7vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.035em] text-white/82">
                  We publish when we have something to say.
                </h2>
                <p className="mt-4 max-w-sm text-[0.82rem] leading-7 text-white/48">
                  Not on a content calendar. Not to feed an algorithm. Only when there is a useful
                  point of view worth defending.
                </p>
              </div>
              <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
                {principles.map((principle) => (
                  <div key={principle.value} className="grid gap-2 py-5 sm:grid-cols-[3rem_1fr] sm:gap-4">
                    <span className="font-display text-[0.62rem] font-medium text-electric-pale/40">{principle.value}</span>
                    <div>
                      <p className="text-[0.8rem] font-semibold text-white/70">{principle.title}</p>
                      <p className="mt-1.5 max-w-md text-[0.72rem] leading-6 text-white/42">{principle.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
