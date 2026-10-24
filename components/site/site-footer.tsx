"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check, Instagram, Linkedin, Twitter } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useLanguage } from "@/lib/i18n/language-provider";
import { formatMessage } from "@/lib/i18n/translations";

const socials = [
  { label: "Instagram", handle: "@nara.agency", href: "https://instagram.com/nara.agency", icon: Instagram },
  { label: "LinkedIn", handle: "NARA", href: "https://linkedin.com/company/nara-agency", icon: Linkedin },
  { label: "X / Twitter", handle: "@naraagency", href: "https://x.com/naraagency", icon: Twitter },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const pathname = usePathname();
  const { t } = useLanguage();

  const resolveHref = (href: string) => (href.startsWith("#") && pathname !== "/" ? `/${href}` : href);

  const subscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-[#050609]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,75,255,0.09),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />

      <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.1fr_0.55fr_0.55fr_1.15fr] lg:gap-8">
          <div className="max-w-xs">
            <Link href="/" aria-label={t.footer.homeAria} className="inline-block rounded-md">
              <Logo markClassName="h-9" />
            </Link>
            <p className="mt-5 text-[0.78rem] leading-6 text-white/48">{t.footer.tagline}</p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={formatMessage(t.footer.socialAria, { label: social.label, handle: social.handle })}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-white/48 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
            <div className="mt-6 space-y-1 text-[0.65rem] leading-5 text-white/42">
              <p>{t.footer.locations}</p>
              <p>{t.footer.worldwide}</p>
            </div>
          </div>

          {t.footer.columns.map((column) => (
            <div key={column.title}>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/42">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => {
                  const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto");
                  const className =
                    "group inline-flex items-center gap-1 text-[0.75rem] text-white/55 transition-colors duration-200 hover:text-white";
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className={className}
                        >
                          {link.label}
                          <ArrowUpRight className="h-2.5 w-2.5 opacity-0 transition-all duration-200 group-hover:opacity-50" />
                        </a>
                      ) : (
                        <Link href={resolveHref(link.href)} className={className}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="lg:ps-4">
            <p className="font-display text-[0.95rem] font-medium tracking-tight text-white">{t.footer.newsletterTitle}</p>
            <p className="mt-2 max-w-xs text-[0.73rem] leading-6 text-white/48">
              {t.footer.newsletterDescription}
            </p>
            {status === "success" ? (
              <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] px-3.5 py-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <p className="text-[0.7rem] font-medium text-emerald-200/80">{t.footer.newsletterSuccess}</p>
              </div>
            ) : (
              <form onSubmit={subscribe} noValidate className="mt-4">
                <div className="flex rounded-lg border border-white/[0.09] bg-white/[0.03] p-1 transition-colors focus-within:border-electric/45">
                  <label htmlFor="footer-email" className="sr-only">{t.footer.emailLabel}</label>
                  <input
                    id="footer-email"
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder={t.footer.emailPlaceholder}
                    className="h-8 min-w-0 flex-1 bg-transparent px-2.5 text-start text-[0.72rem] text-white outline-none placeholder:text-white/42"
                    aria-invalid={status === "error"}
                  />
                  <button
                    type="submit"
                    aria-label={t.footer.subscribeAria}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-electric text-white transition hover:bg-electric-hover"
                  >
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </button>
                </div>
                {status === "error" && <p className="mt-1.5 text-[0.6rem] text-red-300/80">{t.footer.newsletterError}</p>}
                <p className="mt-2 text-[0.57rem] text-white/42">{t.footer.newsletterNote}</p>
              </form>
            )}
            <div className="mt-6 flex flex-wrap gap-1.5">
              {t.footer.badges.map((badge) => (
                <span key={badge} className="rounded border border-white/[0.07] px-2 py-1 text-[0.52rem] uppercase tracking-[0.1em] text-white/42">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/[0.06] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.61rem] text-white/42">{t.footer.copyright}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.61rem] text-white/42">
            <Link href="/privacy" className="transition hover:text-white/70">{t.footer.privacy}</Link>
            <Link href="/terms" className="transition hover:text-white/70">{t.footer.terms}</Link>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
              {t.footer.accepting}
            </span>
          </div>
        </div>

        <div aria-hidden="true" className="pointer-events-none relative -mb-3 select-none overflow-hidden">
          <p className="bg-gradient-to-b from-white/[0.055] to-transparent bg-clip-text text-center font-display text-[24vw] font-semibold leading-[0.72] tracking-[0.12em] text-transparent">
            NARA
          </p>
        </div>
      </div>
    </footer>
  );
}
