import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SectionLabel } from "@/components/ui/section-label";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export function LegalPage({
  title,
  intro,
  updated,
  sections,
  contactEmail,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  contactEmail: string;
}) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main-content">
        <header className="relative overflow-hidden border-b border-white/[0.06]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_-20%,rgba(0,75,255,0.14),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.2]" />
          <div className="relative mx-auto max-w-8xl px-5 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:px-12">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-[0.65rem] text-white/48 transition hover:text-white/78"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              Back to NARA
            </Link>
            <div className="mt-8 max-w-3xl">
              <SectionLabel>Legal</SectionLabel>
              <h1 className="mt-5 font-display text-display-md font-medium tracking-[-0.04em] text-gradient-white">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-[0.9rem] leading-7 text-white/48">{intro}</p>
              <p className="mt-6 text-[0.58rem] uppercase tracking-[0.16em] text-white/42">Last updated {updated}</p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,48rem)] lg:gap-20">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-[0.53rem] font-semibold uppercase tracking-[0.18em] text-white/42">Contents</p>
                <nav aria-label="Legal document contents" className="mt-4">
                  <ol className="space-y-1 border-l border-white/[0.08]">
                    {sections.map((section, index) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="-ml-px flex gap-2.5 border-l border-transparent py-1.5 pl-4 text-[0.7rem] leading-5 text-white/48 transition hover:border-white/25 hover:text-white/70"
                        >
                          <span className="font-display text-[0.55rem] text-white/38">{String(index + 1).padStart(2, "0")}</span>
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
                <div className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <Mail className="h-3.5 w-3.5 text-white/48" />
                  <p className="mt-2 text-[0.65rem] font-medium text-white/62">Questions?</p>
                  <p className="mt-1 text-[0.62rem] leading-5 text-white/42">
                    Email us at{" "}
                    <a href={`mailto:${contactEmail}`} className="text-electric-pale/70 transition hover:text-white">
                      {contactEmail}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </aside>

            <div>
              <div className="space-y-12">
                {sections.map((section, index) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-[0.6rem] font-medium text-electric-pale/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-white/82 sm:text-[1.4rem]">
                        {section.title}
                      </h2>
                    </div>
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="mt-4 text-[0.84rem] leading-7 text-white/55">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="mt-4 space-y-2.5">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 text-[0.82rem] leading-6 text-white/55">
                            <span className="mt-[0.62rem] h-1 w-1 shrink-0 rounded-full bg-electric-soft/70" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              <div className="mt-14 rounded-xl border border-white/[0.08] bg-white/[0.018] p-5 sm:flex sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-white/42">Need clarification?</p>
                  <p className="mt-1.5 text-[0.78rem] text-white/55">
                    Our team is happy to walk you through this document.
                  </p>
                </div>
                <a
                  href={`mailto:${contactEmail}`}
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-[0.7rem] font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white sm:mt-0"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
