"use client";

import { useId, useState } from "react";
import { ArrowUpRight, CalendarDays, Check, ChevronDown, Mail, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { buttonStyles } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useLanguage } from "@/lib/i18n/language-provider";
import { formatMessage } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  email: string;
  company: string;
  budget: string;
  goals: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  budget: "",
  goals: "",
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export function Contact() {
  const { t } = useLanguage();
  const copy = t.contact;
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const uid = useId().replace(/:/g, "");

  const setField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};

    if (form.name.trim().length < 2) nextErrors.name = copy.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = copy.errors.email;
    if (!form.budget) nextErrors.budget = copy.errors.budget;
    if (form.goals.trim().length < 12) nextErrors.goals = copy.errors.goals;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(`${uid}-${firstField}`)?.focus();
      return;
    }

    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
  };

  const firstName = form.name.trim().split(/\s+/)[0] || "";
  const whatsappHref = `https://wa.me/447700900123?text=${encodeURIComponent(copy.whatsappMessage)}`;

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/[0.06] py-20 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(0,75,255,0.13),transparent_58%)]" />
        <div className="absolute inset-0 bg-grid opacity-25 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]" />
        <div className="absolute -left-32 top-[20%] h-80 w-80 rounded-full bg-electric/[0.08] blur-[100px] rtl:left-auto rtl:-right-32" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-electric/[0.08] blur-[100px] rtl:right-auto rtl:-left-32" />
      </div>

      <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0A0D14]/70 shadow-card backdrop-blur-md">
          <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
            <Reveal className="relative border-b border-white/[0.07] p-7 sm:p-10 lg:border-b-0 lg:border-e lg:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,75,255,0.1),transparent_60%)]" />
              <div className="relative flex h-full flex-col">
                <SectionLabel>{copy.eyebrow}</SectionLabel>
                <h2 className="mt-5 max-w-md font-display text-display-sm font-medium leading-[1.05] tracking-[-0.035em] text-white text-balance">
                  {copy.title}
                </h2>
                <p className="mt-5 max-w-md text-[0.88rem] leading-7 text-mist">
                  {copy.description}
                </p>

                <div className="mt-8 space-y-3.5">
                  {[
                    { icon: Sparkles, text: copy.benefits[0] },
                    { icon: ShieldCheck, text: copy.benefits[1] },
                    { icon: Check, text: copy.benefits[2] },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-electric/20 bg-electric/[0.08] text-electric-soft">
                        <item.icon className="h-3 w-3" strokeWidth={2} />
                      </span>
                      <span className="text-[0.76rem] leading-5 text-white/62">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-9 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <a
                    href="https://cal.com/nara/strategy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.045]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-white/70">
                      <CalendarDays className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2 text-[0.72rem] font-semibold text-white/82">
                        {copy.bookCall}
                        <ArrowUpRight className="h-3.5 w-3.5 text-white/48 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                      </span>
                      <span className="mt-0.5 block text-[0.6rem] text-white/48">{copy.bookCallSubtitle}</span>
                    </span>
                  </a>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.045]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-white/70">
                      <MessageCircle className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2 text-[0.72rem] font-semibold text-white/82">
                        {copy.whatsapp}
                        <ArrowUpRight className="h-3.5 w-3.5 text-white/48 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                      </span>
                      <span className="mt-0.5 block text-[0.6rem] text-white/48">{copy.whatsappSubtitle}</span>
                    </span>
                  </a>
                </div>

                <div className="mt-auto flex items-center gap-3 pt-9">
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {[
                      { initials: "MC", name: "Maya Chen", accent: "from-[#5B8CFF] to-[#0030B4]" },
                      { initials: "JL", name: "Jordan Lee", accent: "from-[#C8A97E] to-[#766045]" },
                      { initials: "PR", name: "Priya Raman", accent: "from-[#00C2FF] to-[#00516D]" },
                    ].map((person) => (
                      <Avatar key={person.name} initials={person.initials} name={person.name} accent={person.accent} size="xs" className="ring-2 ring-[#0A0D14]" />
                    ))}
                  </div>
                  <p className="text-[0.58rem] leading-relaxed text-white/48 sm:text-[0.62rem]">
                    {copy.join}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={1} className="relative p-7 sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-electric/[0.08] blur-[90px] rtl:right-auto rtl:-left-20" />
              {status === "success" ? (
                <div className="relative flex min-h-[34rem] flex-col items-center justify-center py-10 text-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-electric/30 bg-electric/[0.08]">
                    <span className="absolute inset-0 animate-pulse-glow rounded-full bg-electric/20 blur-xl" />
                    <Check className="relative h-7 w-7 text-electric-pale" strokeWidth={2} />
                  </div>
                  <p className="mt-7 text-[0.63rem] font-semibold uppercase tracking-[0.2em] text-electric-pale/65">
                    {copy.successLabel}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-medium tracking-tight text-white">
                    {formatMessage(copy.successTitle, { name: firstName })}
                  </h3>
                  <p className="mt-4 max-w-sm text-[0.83rem] leading-7 text-mist">
                    {copy.successBody}
                  </p>
                  <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
                    <a
                      href="https://cal.com/nara/strategy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonStyles({ size: "md", className: "w-full" })}
                    >
                      <CalendarDays className="h-4 w-4" />
                      {copy.pickTime}
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(initialForm);
                        setErrors({});
                        setStatus("idle");
                      }}
                      className={buttonStyles({ variant: "ghost", size: "sm", className: "w-full" })}
                    >
                      {copy.submitAnother}
                    </button>
                  </div>
                  <p className="mt-7 flex items-center gap-1.5 text-[0.6rem] text-white/42">
                    <Mail className="h-3 w-3" />
                    {copy.preferEmail}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[0.61rem] font-semibold uppercase tracking-[0.18em] text-white/48">{copy.projectBrief}</p>
                      <h3 className="mt-1.5 font-display text-xl font-medium tracking-tight text-white">{copy.formTitle}</h3>
                    </div>
                    <span className="rounded-md border border-white/[0.08] bg-white/[0.025] px-2 py-1 text-[0.55rem] text-white/48">
                      {copy.twoMin}
                    </span>
                  </div>

                  <div className="mt-7 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor={`${uid}-name`} className="mb-1.5 block text-[0.68rem] font-medium text-white/55">
                          {copy.name} <span className="text-electric-soft">*</span>
                        </label>
                        <input
                          id={`${uid}-name`}
                          name="name"
                          autoComplete="name"
                          value={form.name}
                          onChange={(event) => setField("name", event.target.value)}
                          placeholder={copy.namePlaceholder}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                          className={cn(
                            "h-11 w-full rounded-lg border bg-white/[0.03] px-3.5 text-[0.82rem] text-white placeholder:text-white/42 transition-colors duration-200 focus:bg-white/[0.05]",
                            errors.name ? "border-red-400/50" : "border-white/[0.09] focus:border-electric/55",
                          )}
                        />
                        {errors.name && <p id={`${uid}-name-error`} className="mt-1.5 text-[0.62rem] text-red-300/90">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor={`${uid}-email`} className="mb-1.5 block text-[0.68rem] font-medium text-white/55">
                          {copy.email} <span className="text-electric-soft">*</span>
                        </label>
                        <input
                          id={`${uid}-email`}
                          name="email"
                          type="email"
                          dir="ltr"
                          autoComplete="email"
                          value={form.email}
                          onChange={(event) => setField("email", event.target.value)}
                          placeholder={copy.emailPlaceholder}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                          className={cn(
                            "h-11 w-full rounded-lg border bg-white/[0.03] px-3.5 text-start text-[0.82rem] text-white placeholder:text-white/42 transition-colors duration-200 focus:bg-white/[0.05]",
                            errors.email ? "border-red-400/50" : "border-white/[0.09] focus:border-electric/55",
                          )}
                        />
                        {errors.email && <p id={`${uid}-email-error`} className="mt-1.5 text-[0.62rem] text-red-300/90">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor={`${uid}-company`} className="mb-1.5 block text-[0.68rem] font-medium text-white/55">
                          {copy.company} <span className="text-white/42">{copy.optional}</span>
                        </label>
                        <input
                          id={`${uid}-company`}
                          name="company"
                          autoComplete="organization"
                          value={form.company}
                          onChange={(event) => setField("company", event.target.value)}
                          placeholder={copy.companyPlaceholder}
                          className="h-11 w-full rounded-lg border border-white/[0.09] bg-white/[0.03] px-3.5 text-[0.82rem] text-white placeholder:text-white/42 transition-colors duration-200 focus:border-electric/55 focus:bg-white/[0.05]"
                        />
                      </div>
                      <div>
                        <label htmlFor={`${uid}-budget`} className="mb-1.5 block text-[0.68rem] font-medium text-white/55">
                          {copy.budget} <span className="text-electric-soft">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id={`${uid}-budget`}
                            name="budget"
                            value={form.budget}
                            onChange={(event) => setField("budget", event.target.value)}
                            aria-invalid={Boolean(errors.budget)}
                            aria-describedby={errors.budget ? `${uid}-budget-error` : undefined}
                            className={cn(
                              "h-11 w-full cursor-pointer appearance-none rounded-lg border bg-white/[0.03] ps-3.5 pe-9 text-[0.82rem] transition-colors duration-200 focus:bg-white/[0.05]",
                              form.budget ? "text-white" : "text-white/42",
                              errors.budget ? "border-red-400/50" : "border-white/[0.09] focus:border-electric/55",
                            )}
                          >
                            <option value="" disabled>{copy.selectRange}</option>
                            {copy.budgetOptions.map((option) => (
                              <option key={option.id} value={option.id}>{option.label}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/48" />
                        </div>
                        {errors.budget && <p id={`${uid}-budget-error`} className="mt-1.5 text-[0.62rem] text-red-300/90">{errors.budget}</p>}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label htmlFor={`${uid}-goals`} className="block text-[0.68rem] font-medium text-white/55">
                          {copy.goals} <span className="text-electric-soft">*</span>
                        </label>
                        <span className="text-[0.57rem] tabular-nums text-white/42">{form.goals.length}/600</span>
                      </div>
                      <textarea
                        id={`${uid}-goals`}
                        name="goals"
                        rows={4}
                        maxLength={600}
                        value={form.goals}
                        onChange={(event) => setField("goals", event.target.value)}
                        placeholder={copy.goalsPlaceholder}
                        aria-invalid={Boolean(errors.goals)}
                        aria-describedby={errors.goals ? `${uid}-goals-error` : undefined}
                        className={cn(
                          "min-h-[6.25rem] w-full resize-none rounded-lg border bg-white/[0.03] px-3.5 py-3 text-[0.82rem] leading-6 text-white placeholder:text-white/42 transition-colors duration-200 focus:bg-white/[0.05]",
                          errors.goals ? "border-red-400/50" : "border-white/[0.09] focus:border-electric/55",
                        )}
                      />
                      {errors.goals && <p id={`${uid}-goals-error`} className="mt-1.5 text-[0.62rem] text-red-300/90">{errors.goals}</p>}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className={buttonStyles({ size: "lg", className: "mt-5 w-full disabled:cursor-wait" })}
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                        {copy.submitting}
                      </>
                    ) : (
                      <>
                        {copy.submit}
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5 rtl:group-hover/button:-translate-x-0.5" />
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center text-[0.6rem] leading-5 text-white/42">
                    {copy.privacyPrefix}{" "}
                    <a href="/privacy" className="text-white/55 underline decoration-white/15 underline-offset-2 hover:text-white/78">
                      {copy.privacyLink}
                    </a>
                    {copy.privacySuffix}
                  </p>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
