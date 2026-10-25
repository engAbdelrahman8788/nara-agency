import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Compass } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buttonStyles } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export const metadata = {
  title: "Page not found",
  description: "The page you are looking for has moved or no longer exists.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="relative flex min-h-[calc(100vh-4.5rem)] items-center overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_65%_60%_at_50%_45%,black,transparent_80%)]" />
          <div className="absolute left-1/2 top-1/2 h-[30rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/[0.11] blur-[130px]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center">
              <Logo markClassName="h-12" />
            </div>

            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-3.5 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.18em] text-white/55">
              <Compass className="h-3 w-3 text-electric-soft" />
              Error 404
            </div>

            <p className="mt-6 font-display text-[clamp(5rem,16vw,11rem)] font-medium leading-[0.8] tracking-[-0.07em] text-gradient-blue">
              404
            </p>

            <h1 className="mt-8 font-display text-display-sm font-medium tracking-[-0.035em] text-white text-balance">
              This page moved beyond the map.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-[0.9rem] leading-7 text-mist">
              The link may be outdated, or the page may have been retired. Let&apos;s get you back to
              the work that moves the needle.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/" className={buttonStyles({ size: "lg", className: "group w-full sm:w-auto" })}>
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover/button:-translate-x-0.5" />
                Back to NARA
              </Link>
              <Link href="/#work" className={buttonStyles({ variant: "secondary", size: "lg", className: "group w-full sm:w-auto" })}>
                Explore selected work
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
              </Link>
            </div>

            <div className="mx-auto mt-12 flex max-w-sm items-center justify-center gap-5 border-t border-white/[0.07] pt-6 text-[0.68rem] text-white/42">
              <Link href="/insights" className="transition hover:text-white">Insights</Link>
              <span className="h-3 w-px bg-white/10" />
              <a href="mailto:hello@nara.agency" className="transition hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
