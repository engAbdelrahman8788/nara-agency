"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LogIn, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonStyles } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();
  const { t } = useLanguage();
  const contactHref = pathname === "/" ? "#contact" : "/#contact";

  if (!visible) return null;

  return (
    <div className="relative z-40 border-b border-white/[0.06] bg-[#090b11]">
      <div className="mx-auto flex h-9 max-w-8xl items-center justify-center gap-2 px-10 text-center">
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <p className="text-[0.68rem] font-medium tracking-[0.06em] text-white/62 sm:text-[0.72rem]">
          {t.announcement.message}
          <span className="hidden text-white/42 sm:inline"> — </span>
          <span className="hidden text-white/55 sm:inline">{t.announcement.detail}</span>
        </p>
        <Link
          href={contactHref}
          className="group ms-1 inline-flex items-center gap-1 text-[0.68rem] font-semibold text-white/85 transition hover:text-white sm:text-[0.72rem]"
        >
          {t.announcement.cta}
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </Link>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label={t.announcement.dismiss}
          className="absolute end-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-white/48 transition hover:bg-white/[0.06] hover:text-white"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const isHome = pathname === "/";

  const resolveHref = (href: string) => (href.startsWith("#") && !isHome ? `/${href}` : href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled || mobileOpen
          ? "border-b border-white/[0.08] bg-[#070709]/78 backdrop-blur-2xl"
          : "border-b border-transparent bg-[#070709]/40 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-8xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="relative z-10 flex items-center rounded-md" aria-label={t.common.brandHome}>
          <Logo priority markClassName="h-14" />
        </Link>

        <nav aria-label={t.nav.ariaPrimary} className="hidden items-center gap-1 lg:flex">
          {t.nav.links.map((link) => (
            <Link
              key={link.href}
              href={resolveHref(link.href)}
              className="group relative rounded-lg px-3 py-2 text-[0.82rem] font-medium text-white/62 transition-colors duration-300 hover:text-white xl:px-4"
            >
              {link.label}
              <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-electric-soft to-transparent transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right rtl:bg-gradient-to-l" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <LanguageSwitcher />
          <Link
            href="/login"
            aria-label={t.nav.loginAria}
            className={buttonStyles({ variant: "outline", size: "md", className: "px-3.5" })}
          >
            <LogIn className="h-4 w-4 rtl:-scale-x-100" />
            <span className="hidden xl:inline">{t.nav.login}</span>
          </Link>
          <Link
            href={resolveHref("#contact")}
            className={buttonStyles({ size: "md", className: "px-4 max-xl:px-3.5" })}
          >
            {t.nav.bookCall}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5 rtl:group-hover/button:-translate-x-0.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 top-[4.5rem] z-40 bg-[#040508]/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
          <div
            id="mobile-navigation"
            className="absolute inset-x-0 top-full z-50 border-b border-white/10 bg-[#080a0f] px-5 pb-6 pt-3 shadow-2xl lg:hidden"
          >
            <nav aria-label={t.nav.ariaMobile} className="flex flex-col">
              {t.nav.links.map((link, index) => (
                <Link
                  key={link.href}
                  href={resolveHref(link.href)}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b border-white/[0.06] py-4 text-lg font-medium text-white/80 transition hover:text-white"
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4 text-white/48" />
                </Link>
              ))}
            </nav>
            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className={buttonStyles({ variant: "outline", size: "lg", className: "w-full" })}
              >
                <LogIn className="h-4 w-4 rtl:-scale-x-100" />
                {t.nav.login}
              </Link>
              <Link
                href={resolveHref("#contact")}
                onClick={() => setMobileOpen(false)}
                className={buttonStyles({ size: "lg", className: "w-full" })}
              >
                {t.nav.bookCall}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-5 text-center text-[0.7rem] uppercase tracking-[0.2em] text-white/42">
              {t.nav.locations}
            </p>
          </div>
        </>
      )}
    </header>
  );
}
