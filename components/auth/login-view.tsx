"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { buttonStyles } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-provider";

type ErrorKind = "invalid" | "rateLimited" | "genericError" | null;

export function LoginView() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ErrorKind>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (response.ok) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      if (response.status === 401) setError("invalid");
      else if (response.status === 429) setError("rateLimited");
      else setError("genericError");
    } catch {
      setError("genericError");
    }

    setPending(false);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.22] [mask-image:radial-gradient(ellipse_70%_65%_at_50%_35%,black,transparent_82%)]" />
        <div className="absolute -left-40 top-[-18rem] h-[40rem] w-[40rem] rounded-full bg-electric/[0.16] blur-[150px]" />
        <div className="absolute -bottom-56 right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-electric/[0.09] blur-[140px]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-8xl flex-col px-5 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="NARA home" className="inline-flex items-center rounded-md">
            <Logo markClassName="h-9 sm:h-10" priority />
          </Link>
          <LanguageSwitcher />
        </header>

        <main id="main-content" className="flex flex-1 items-center py-10 lg:py-14">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:gap-16 xl:gap-24">
            <section className="hidden lg:block">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-3.5 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.18em] text-white/55">
                <Sparkles className="h-3 w-3 text-electric-soft" aria-hidden="true" />
                {t.auth.eyebrow}
              </div>

              <h2 className="mt-7 max-w-xl text-display-md font-medium text-balance text-white">
                {t.auth.title}
              </h2>
              <p className="mt-6 max-w-lg text-[0.95rem] leading-7 text-mist">
                {t.auth.description}
              </p>

              <ul className="mt-9 space-y-4">
                {t.auth.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-[0.86rem] leading-6 text-white/68">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-electric/25 bg-electric/[0.1] text-electric-pale">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="mt-10 max-w-lg rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-electric-soft" aria-hidden="true" />
                  <p className="text-[0.78rem] leading-6 text-white/48">{t.auth.securityNote}</p>
                </div>
              </div>
            </section>

            <section aria-labelledby="login-heading" className="mx-auto w-full max-w-md">
              <div className="glass rounded-2xl p-6 shadow-float sm:p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-electric/25 bg-electric/[0.1] text-electric-pale shadow-glow-sm">
                  <LockKeyhole className="h-5 w-5" aria-hidden="true" />
                </div>

                <h1
                  id="login-heading"
                  className="mt-6 text-[1.75rem] font-medium leading-tight tracking-[-0.03em] text-white sm:text-[1.95rem]"
                >
                  {t.auth.formTitle}
                </h1>
                <p className="mt-2.5 text-[0.84rem] leading-6 text-mist">
                  {t.auth.formDescription}
                </p>

                <form className="mt-7" onSubmit={handleSubmit} aria-busy={pending}>
                  {error && (
                    <div
                      id="login-error"
                      role="alert"
                      className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-500/[0.08] px-3.5 py-3 text-[0.78rem] leading-5 text-red-200"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{t.auth[error]}</span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="login-email" className="text-[0.74rem] font-semibold text-white/72">
                      {t.auth.emailLabel}
                    </label>
                    <div className="relative mt-2">
                      <Mail
                        className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32"
                        aria-hidden="true"
                      />
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder={t.auth.emailPlaceholder}
                        disabled={pending}
                        aria-invalid={error === "invalid" ? true : undefined}
                        aria-describedby={error ? "login-error" : undefined}
                        className="h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] ps-11 pe-4 text-[0.88rem] text-white placeholder:text-white/28 transition focus:border-electric/50 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-electric/20 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="login-password" className="text-[0.74rem] font-semibold text-white/72">
                      {t.auth.passwordLabel}
                    </label>
                    <div className="relative mt-2">
                      <LockKeyhole
                        className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32"
                        aria-hidden="true"
                      />
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={t.auth.passwordPlaceholder}
                        disabled={pending}
                        aria-invalid={error === "invalid" ? true : undefined}
                        aria-describedby={error ? "login-error" : undefined}
                        className="h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] ps-11 pe-12 text-[0.88rem] text-white placeholder:text-white/28 transition focus:border-electric/50 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-electric/20 disabled:opacity-60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                        aria-pressed={showPassword}
                        aria-controls="login-password"
                        className="absolute end-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/38 transition hover:bg-white/[0.06] hover:text-white/80"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className={buttonStyles({ size: "lg", className: "mt-6 w-full" })}
                  >
                    {pending ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>{pending ? t.auth.submitting : t.auth.submit}</span>
                    {!pending && (
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-0.5 rtl:rotate-180 rtl:group-hover/button:-translate-x-0.5"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </form>

                <p className="mt-6 border-t border-white/[0.07] pt-5 text-[0.7rem] leading-5 text-white/35">
                  {t.auth.securityNote}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-[0.76rem] font-medium text-white/45 transition hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                  {t.auth.backToSite}
                </Link>
              </div>
            </section>
          </div>
        </main>

        <footer className="border-t border-white/[0.06] py-5">
          <p className="text-center text-[0.66rem] tracking-[0.03em] text-white/30">
            {t.auth.footer}
          </p>
        </footer>
      </div>
    </div>
  );
}
