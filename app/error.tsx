"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buttonStyles } from "@/components/ui/button";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="relative flex min-h-[calc(100vh-4.5rem)] items-center overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_65%_60%_at_50%_45%,black,transparent_80%)]" />
          <div className="absolute left-1/2 top-1/2 h-[28rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/[0.1] blur-[130px]" />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-xl text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-electric/25 bg-electric/[0.08] text-electric-pale">
              <AlertTriangle className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <p className="mt-7 text-[0.63rem] font-semibold uppercase tracking-[0.2em] text-electric-pale/60">
              Something went off-script
            </p>
            <h1 className="mt-4 font-display text-display-sm font-medium tracking-[-0.035em] text-white text-balance">
              A temporary interruption.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-[0.9rem] leading-7 text-mist">
              The experience hit an unexpected error. Your data is safe — try the page again, or head
              back to familiar ground.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button type="button" onClick={reset} className={buttonStyles({ size: "lg", className: "w-full sm:w-auto" })}>
                <RotateCcw className="h-4 w-4" />
                Try again
              </button>
              <Link href="/" className={buttonStyles({ variant: "secondary", size: "lg", className: "group w-full sm:w-auto" })}>
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover/button:-translate-x-0.5" />
                Back to NARA
              </Link>
            </div>
            {error.digest && (
              <p className="mt-8 font-mono text-[0.62rem] tracking-[0.08em] text-white/30">
                Reference: {error.digest}
              </p>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
