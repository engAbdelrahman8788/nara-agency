"use client";

import { useId, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Check,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { buttonStyles } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-provider";
import { formatMessage } from "@/lib/i18n/translations";
import { useLeads } from "@/lib/leads/provider";
import { cn } from "@/lib/utils";

type LeadFormState = {
  name: string;
  phone: string;
  business: string;
  message: string;
};

const initialForm: LeadFormState = {
  name: "",
  phone: "",
  business: "",
  message: "",
};

type LeadFormErrors = Partial<Record<keyof LeadFormState, string>>;

const fieldClass =
  "h-11 w-full rounded-xl border border-white/[0.09] bg-[#070A12] px-3.5 text-[0.85rem] text-white outline-none transition placeholder:text-white/25 focus:border-electric/50 focus:ring-2 focus:ring-electric/15";

export function LeadCapture() {
  const { t } = useLanguage();
  const copy = t.leadCapture;
  const { addLead } = useLeads();
  const [form, setForm] = useState<LeadFormState>(initialForm);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const uid = useId().replace(/:/g, "");

  const setField = (field: keyof LeadFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: LeadFormErrors = {};

    if (form.name.trim().length < 2) nextErrors.name = copy.errors.name;
    if (form.phone.replace(/\D/g, "").length < 7) {
      nextErrors.phone = copy.errors.phone;
    }
    if (form.business.trim().length < 2) {
      nextErrors.business = copy.errors.business;
    }
    if (form.message.trim().length < 10) {
      nextErrors.message = copy.errors.message;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(`${uid}-${firstField}`)?.focus();
      return;
    }

    addLead({
      name: form.name,
      phone: form.phone,
      business: form.business,
      message: form.message,
      status: "New",
      source: "Website",
    });
    setStatus("success");
  };

  const firstName = form.name.trim().split(/\s+/)[0] || "";

  return (
    <section
      id="lead"
      className="relative overflow-hidden border-t border-white/[0.06] py-20 sm:py-28 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_35%,rgba(0,75,255,0.11),transparent_55%)]" />
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_75%,transparent)]" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-[#0B2D7A]/20 blur-[110px] rtl:left-auto rtl:-right-40" />
      </div>

      <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14">
          <Reveal>
            <SectionLabel>{copy.eyebrow}</SectionLabel>
            <h2 className="mt-5 max-w-xl text-display-sm font-display font-medium leading-[1.05] tracking-[-0.035em] text-balance">
              <span className="text-white">{copy.titleLine1}</span>
              <br />
              <span className="text-gradient-blue">{copy.titleLine2}</span>
            </h2>
            <p className="mt-5 max-w-lg text-[0.92rem] leading-7 text-mist">
              {copy.description}
            </p>

            <div className="mt-8 space-y-3">
              {copy.benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  <span className="text-[0.78rem] leading-5 text-white/62">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.07] pt-5">
              <span className="flex items-center gap-1.5 text-[0.66rem] text-white/48">
                <ShieldCheck className="h-3.5 w-3.5 text-electric-soft/70" />
                {copy.responseTime}
              </span>
              <span className="flex items-center gap-1.5 text-[0.66rem] text-white/38">
                <Sparkles className="h-3.5 w-3.5 text-white/30" />
                {copy.privacy}
              </span>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0A0D14]/85 p-6 shadow-card backdrop-blur-md sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-electric/[0.12] blur-[80px] rtl:right-auto rtl:-left-20" />

              <div className="relative flex items-start gap-3 border-b border-white/[0.07] pb-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-electric/20 bg-electric/10 text-electric-soft">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-[1.15rem] font-medium tracking-[-0.02em] text-white">
                    {copy.formTitle}
                  </h3>
                  <p className="mt-1 text-[0.72rem] leading-5 text-white/45">
                    {copy.formSubtitle}
                  </p>
                </div>
              </div>

              {status === "success" ? (
                <div className="relative flex min-h-[25rem] flex-col items-center justify-center py-8 text-center">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-electric/30 bg-electric/[0.08]">
                    <span className="absolute inset-0 animate-pulse-glow rounded-full bg-electric/20 blur-xl" />
                    <Check
                      className="relative h-6 w-6 text-electric-pale"
                      strokeWidth={2.4}
                    />
                  </div>
                  <p className="mt-6 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-electric-pale/65">
                    {copy.successLabel}
                  </p>
                  <h4 className="mt-2 font-display text-2xl font-medium tracking-tight text-white">
                    {formatMessage(copy.successTitle, { name: firstName })}
                  </h4>
                  <p className="mt-3 max-w-sm text-[0.82rem] leading-7 text-mist">
                    {copy.successBody}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(initialForm);
                      setErrors({});
                      setStatus("idle");
                    }}
                    className={buttonStyles({
                      variant: "ghost",
                      size: "sm",
                      className: "mt-7",
                    })}
                  >
                    {copy.submitAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="relative mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`${uid}-name`}
                        className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white/52"
                      >
                        {copy.nameLabel}
                      </label>
                      <input
                        id={`${uid}-name`}
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(event) => setField("name", event.target.value)}
                        placeholder={copy.namePlaceholder}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                        className={cn(
                          fieldClass,
                          errors.name && "border-red-400/45 focus:border-red-400/60",
                        )}
                      />
                      {errors.name && (
                        <p
                          id={`${uid}-name-error`}
                          role="alert"
                          className="mt-1.5 text-[0.68rem] text-red-300"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`${uid}-phone`}
                        className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white/52"
                      >
                        {copy.phoneLabel}
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute start-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/28" />
                        <input
                          id={`${uid}-phone`}
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          dir="ltr"
                          value={form.phone}
                          onChange={(event) =>
                            setField("phone", event.target.value)
                          }
                          placeholder={copy.phonePlaceholder}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={
                            errors.phone ? `${uid}-phone-error` : undefined
                          }
                          className={cn(
                            fieldClass,
                            "ps-10",
                            errors.phone &&
                              "border-red-400/45 focus:border-red-400/60",
                          )}
                        />
                      </div>
                      {errors.phone && (
                        <p
                          id={`${uid}-phone-error`}
                          role="alert"
                          className="mt-1.5 text-[0.68rem] text-red-300"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`${uid}-business`}
                      className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white/52"
                    >
                      {copy.businessLabel}
                    </label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute start-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/28" />
                      <input
                        id={`${uid}-business`}
                        name="business"
                        type="text"
                        autoComplete="organization"
                        value={form.business}
                        onChange={(event) =>
                          setField("business", event.target.value)
                        }
                        placeholder={copy.businessPlaceholder}
                        aria-invalid={Boolean(errors.business)}
                        aria-describedby={
                          errors.business ? `${uid}-business-error` : undefined
                        }
                        className={cn(
                          fieldClass,
                          "ps-10",
                          errors.business &&
                            "border-red-400/45 focus:border-red-400/60",
                        )}
                      />
                    </div>
                    {errors.business && (
                      <p
                        id={`${uid}-business-error`}
                        role="alert"
                        className="mt-1.5 text-[0.68rem] text-red-300"
                      >
                        {errors.business}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`${uid}-message`}
                      className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white/52"
                    >
                      {copy.messageLabel}
                    </label>
                    <div className="relative">
                      <MessageSquare className="pointer-events-none absolute start-3.5 top-3.5 h-3.5 w-3.5 text-white/28" />
                      <textarea
                        id={`${uid}-message`}
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={(event) =>
                          setField("message", event.target.value)
                        }
                        placeholder={copy.messagePlaceholder}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={
                          errors.message ? `${uid}-message-error` : undefined
                        }
                        className={cn(
                          "w-full resize-none rounded-xl border border-white/[0.09] bg-[#070A12] px-3.5 py-3 text-[0.85rem] leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-electric/50 focus:ring-2 focus:ring-electric/15",
                          "ps-10",
                          errors.message &&
                            "border-red-400/45 focus:border-red-400/60",
                        )}
                      />
                    </div>
                    {errors.message && (
                      <p
                        id={`${uid}-message-error`}
                        role="alert"
                        className="mt-1.5 text-[0.68rem] text-red-300"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={buttonStyles({
                      size: "md",
                      className: "w-full",
                    })}
                  >
                    {copy.submit}
                    <Send className="h-3.5 w-3.5" />
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-center text-[0.64rem] leading-5 text-white/38">
                    <ArrowUpRight className="h-3 w-3" />
                    {copy.responseTime}
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
