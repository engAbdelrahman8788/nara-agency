"use client";

import { ArrowUpRight } from "lucide-react";
import { trustedBrands } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";
import { useLanguage } from "@/lib/i18n/language-provider";

export function LogoStrip() {
  const { t } = useLanguage();
  const logos = [...trustedBrands, ...trustedBrands];

  return (
    <section className="border-b border-white/[0.06]" aria-label={t.logoStrip.aria}>
      <div className="mx-auto flex max-w-8xl flex-col gap-6 px-5 py-9 sm:px-8 lg:flex-row lg:items-center lg:gap-12 lg:px-12">
        <Reveal className="shrink-0">
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-white/20" />
            <p className="max-w-[11rem] text-[0.6rem] font-semibold uppercase leading-[1.7] tracking-[0.18em] text-white/48">
              {t.logoStrip.title}
            </p>
          </div>
        </Reveal>

        <div className="relative min-w-0 flex-1 overflow-hidden mask-fade-x">
          <div className="marquee-track flex w-max animate-marquee items-center">
            {[0, 1].map((group) => (
              <div key={group} className="flex shrink-0 items-center" aria-hidden={group === 1 ? "true" : undefined}>
                {logos.map((brand, index) => (
                  <span
                    key={`${brand}-${group}-${index}`}
                    className="flex shrink-0 items-center gap-7 px-7 text-white/48 transition-colors duration-300 hover:text-white/80 lg:px-10"
                  >
                    <span
                      className={
                        brand === "ÉLAN"
                          ? "font-display text-lg font-normal italic tracking-[0.16em]"
                          : brand === "NORTHWIND"
                            ? "font-display text-[0.95rem] font-medium tracking-[0.2em]"
                            : brand === "AUREL"
                              ? "font-display text-lg font-light tracking-[0.35em]"
                              : "font-display text-[0.95rem] font-semibold tracking-[0.2em]"
                      }
                    >
                      {brand}
                    </span>
                    <span className="h-1 w-1 rotate-45 bg-white/18" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Reveal className="hidden shrink-0 xl:block">
          <a
            href="#work"
            className="group inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/55 transition hover:text-white"
          >
            {t.logoStrip.cta}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
