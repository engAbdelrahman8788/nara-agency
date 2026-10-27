import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { InsightVisual } from "@/components/site/insights";
import { ArticleBody } from "@/components/site/article-body";
import { ArticleToc, ReadingProgress, ShareRow } from "@/components/site/article-tools";
import { Avatar } from "@/components/ui/avatar";
import { insights } from "@/lib/data";
import { articles } from "@/lib/insights-content";
import { siteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const insight = insights.find((item) => item.id === params.slug);
  if (!insight) return {};

  return {
    title: insight.title,
    description: insight.excerpt,
    alternates: { canonical: `/insights/${insight.id}` },
    openGraph: {
      title: insight.title,
      description: insight.excerpt,
      type: "article",
      url: `/insights/${insight.id}`,
      publishedTime: new Date(insight.date).toISOString(),
      authors: [insight.author],
    },
    twitter: {
      card: "summary_large_image",
      title: insight.title,
      description: insight.excerpt,
    },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const insight = insights.find((item) => item.id === params.slug);
  const article = articles[params.slug];

  if (!insight || !article) notFound();

  const nextInsight = insights.find((item) => item.id === article.nextSlug) ?? insights[0];
  const headings = article.blocks
    .filter((block): block is Extract<typeof block, { type: "heading" }> => block.type === "heading")
    .map((block) => ({ id: block.id, text: block.text }));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt,
    datePublished: new Date(insight.date).toISOString(),
    author: { "@type": "Person", name: insight.author },
    publisher: { "@type": "Organization", name: "NARA", url: siteUrl },
    mainEntityOfPage: `${siteUrl}/insights/${insight.id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ReadingProgress />
      <AnnouncementBar />
      <SiteHeader />
      <main id="main-content">
        <article>
          <header className="relative overflow-hidden border-b border-white/[0.06]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_-10%,rgba(0,75,255,0.16),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.28]" />
            <div className="pointer-events-none absolute -right-32 top-1/3 h-[26rem] w-[26rem] rounded-full bg-electric/[0.07] blur-[110px]" />

            <div className="relative mx-auto max-w-8xl px-5 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[0.62rem] text-white/42">
                <Link href="/" className="transition hover:text-white/78">Home</Link>
                <span aria-hidden="true" className="text-white/38">/</span>
                <Link href="/insights" className="transition hover:text-white/78">Insights</Link>
                <span aria-hidden="true" className="text-white/38">/</span>
                <span className="text-white/55">{insight.category}</span>
              </nav>

              <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 text-[0.55rem] font-semibold uppercase tracking-[0.15em]">
                    <span className="flex items-center gap-1.5 rounded-full border border-electric/25 bg-electric/[0.07] px-2.5 py-1 text-electric-pale">
                      <span className="h-1 w-1 rounded-full bg-electric-soft" />
                      {insight.category}
                    </span>
                    <span className="text-white/42">{insight.date}</span>
                  </div>

                  <h1 className="mt-6 max-w-[48rem] font-display text-[clamp(2.2rem,4.1vw,3.9rem)] font-medium leading-[1.04] tracking-[-0.045em] text-balance text-gradient-white">
                    {insight.title}
                  </h1>

                  <p className="mt-6 max-w-[40rem] text-[0.93rem] leading-7 text-white/55 text-pretty">
                    {article.subtitle}
                  </p>

                  <div className="mt-8 flex flex-col gap-5 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar
                        initials={insight.initials}
                        name={insight.author}
                        size="md"
                        accent="from-[#4D7DFF] to-[#0B1B4D]"
                      />
                      <div>
                        <p className="text-[0.72rem] font-semibold text-white/78">{insight.author}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[0.58rem] text-white/42">
                          {article.authorRole}
                          <span className="h-1 w-1 rounded-full bg-white/15" />
                          <Clock3 className="h-2.5 w-2.5" />
                          {insight.readTime}
                        </p>
                      </div>
                    </div>
                    <ShareRow slug={insight.id} title={insight.title} />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-4 rounded-2xl bg-electric/[0.07] blur-2xl" />
                  <div className="relative aspect-[16/11] overflow-hidden rounded-xl border border-white/[0.1] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)]">
                    <InsightVisual insight={insight} />
                  </div>
                  <div className="absolute -bottom-3 -left-3 flex items-center gap-2 rounded-lg border border-white/[0.1] bg-[#0A0D16]/90 px-3 py-2 backdrop-blur-md">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[0.5rem] uppercase tracking-[0.16em] text-white/55">NARA field notes</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="relative mx-auto max-w-8xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
            <div className="grid gap-12 xl:grid-cols-[13rem_minmax(0,46rem)_1fr] xl:gap-14">
              <aside className="hidden xl:block">
                <div className="sticky top-28">
                  <ArticleToc headings={headings} />
                  <div className="mt-8 border-t border-white/[0.07] pt-5">
                    <p className="text-[0.53rem] font-semibold uppercase tracking-[0.18em] text-white/42">Written by</p>
                    <div className="mt-3 flex items-center gap-2.5">
                      <Avatar initials={insight.initials} name={insight.author} size="sm" accent="from-[#4D7DFF] to-[#0B1B4D]" />
                      <div>
                        <p className="text-[0.66rem] font-semibold text-white/70">{insight.author}</p>
                        <p className="mt-0.5 text-[0.54rem] text-white/42">{article.authorRole}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="min-w-0">
                <ArticleBody blocks={article.blocks} takeaways={article.takeaways} />

                <div id="author" className="mt-14 scroll-mt-28 border-t border-white/[0.08] pt-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <Avatar
                      initials={insight.initials}
                      name={insight.author}
                      size="lg"
                      accent="from-[#4D7DFF] to-[#0B1B4D]"
                      className="h-14 w-14 text-base"
                    />
                    <div className="flex-1">
                      <p className="text-[0.53rem] font-semibold uppercase tracking-[0.18em] text-white/42">About the author</p>
                      <p className="mt-1.5 font-display text-[1.1rem] font-medium tracking-[-0.01em] text-white/85">{insight.author}</p>
                      <p className="text-[0.63rem] text-white/42">{article.authorRole}</p>
                      <p className="mt-3 max-w-xl text-[0.78rem] leading-6 text-white/48">{article.authorBio}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <Link
                          href="/insights"
                          className="group inline-flex items-center gap-1.5 text-[0.66rem] font-semibold text-electric-pale/75 transition hover:text-white"
                        >
                          More insights
                          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                        <Link
                          href="/#contact"
                          className="text-[0.66rem] text-white/42 transition hover:text-white/70"
                        >
                          Work with {insight.author.split(" ")[0]}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="hidden xl:block">
                <div className="sticky top-28 space-y-6">
                  <div>
                    <p className="text-[0.53rem] font-semibold uppercase tracking-[0.18em] text-white/42">Filed under</p>
                    <span className="mt-3 inline-flex rounded-full border border-white/[0.09] bg-white/[0.025] px-2.5 py-1 text-[0.58rem] font-medium text-white/55">
                      {insight.category}
                    </span>
                  </div>
                  <div className="border-t border-white/[0.07] pt-5">
                    <p className="text-[0.53rem] font-semibold uppercase tracking-[0.18em] text-white/42">Share this piece</p>
                    <div className="mt-3">
                      <ShareRow slug={insight.id} title={insight.title} />
                    </div>
                  </div>
                  <Link
                    href={`/insights/${nextInsight.id}`}
                    className="group block rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-electric/25 hover:bg-electric/[0.03]"
                  >
                    <p className="text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-white/42">Next read</p>
                    <p className="mt-2 font-display text-[0.82rem] font-medium leading-5 tracking-[-0.01em] text-white/70 transition group-hover:text-white/85">
                      {nextInsight.title}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[0.56rem] text-electric-pale/50 transition group-hover:text-electric-pale">
                      {nextInsight.readTime}
                      <ArrowUpRight className="h-2.5 w-2.5" />
                    </span>
                  </Link>
                </div>
              </aside>
            </div>
          </div>

          <section className="relative overflow-hidden border-t border-white/[0.07] bg-[#090B11]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,rgba(0,75,255,0.1),transparent_55%)]" />
            <div className="relative mx-auto max-w-8xl px-5 py-14 sm:px-8 lg:px-12">
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
                <div>
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-electric-pale/55">Continue reading</p>
                  <p className="mt-3 text-[0.6rem] uppercase tracking-[0.14em] text-white/42">{nextInsight.category} · {nextInsight.readTime}</p>
                  <h2 className="mt-3 max-w-[32rem] font-display text-[clamp(1.65rem,2.7vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.035em] text-white/85">
                    {nextInsight.title}
                  </h2>
                  <p className="mt-4 max-w-lg text-[0.85rem] leading-7 text-white/48">{nextInsight.excerpt}</p>
                  <Link
                    href={`/insights/${nextInsight.id}`}
                    className="group mt-7 inline-flex items-center gap-2 text-[0.78rem] font-semibold text-white/78 transition hover:text-white"
                  >
                    Read the next insight
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/12 transition group-hover:border-electric/50 group-hover:bg-electric/10">
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </Link>
                </div>
                <Link href={`/insights/${nextInsight.id}`} className="group relative hidden lg:block" aria-label={`Read ${nextInsight.title}`}>
                  <div className="absolute -inset-3 rounded-2xl bg-electric/[0.05] blur-2xl transition group-hover:bg-electric/[0.1]" />
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/[0.08] transition group-hover:border-electric/25">
                    <InsightVisual insight={nextInsight} />
                  </div>
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
                <Link href="/insights" className="group inline-flex items-center gap-2 text-[0.68rem] text-white/48 transition hover:text-white">
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  All insights
                </Link>
                <p className="text-[0.6rem] text-white/42">New thinking from the NARA desk, every other week.</p>
              </div>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
