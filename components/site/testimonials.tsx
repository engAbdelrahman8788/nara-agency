"use client";

import { Quote, ShieldCheck, TrendingUp } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Avatar, StarRating } from "@/components/ui/avatar";
import { useLanguage } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const { t } = useLanguage();
  const copy = t.testimonials;
  const [featured, ...rest] = copy.items;

  return (
    <section id="testimonials" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-56 bottom-0 h-[30rem] w-[30rem] rounded-full bg-electric/[0.07] blur-[120px] rtl:left-auto rtl:-right-56" />
      <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <Reveal>
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={
              <>
                {copy.titleLine1}
                <br />
                <span className="text-white/48">{copy.titleLine2}</span>
              </>
            }
            description={copy.description}
            action={
              <div className="flex items-center gap-5 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-2xl font-medium tracking-tight text-white">{copy.rating}</span>
                    <StarRating />
                  </div>
                  <p className="mt-1 text-[0.6rem] uppercase tracking-[0.1em] text-white/48">{copy.reviewCount}</p>
                </div>
                <span className="h-9 w-px bg-white/10" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-2xl font-medium tracking-tight text-white">{copy.retention}</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-300/80" />
                  </div>
                  <p className="mt-1 text-[0.6rem] uppercase tracking-[0.1em] text-white/48">{copy.retentionLabel}</p>
                </div>
              </div>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-electric/20 bg-[#0B1020] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-500 hover:border-electric/35 hover:shadow-glow-sm sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-electric/[0.18] blur-[80px] rtl:right-auto rtl:-left-20" />
              <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.08] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
              <Quote className="relative h-8 w-8 text-electric-soft/55" strokeWidth={1.2} />
              <blockquote className="relative mt-7">
                <p className="font-display text-[1.35rem] font-medium leading-[1.45] tracking-[-0.02em] text-white sm:text-[1.6rem]">
                  &ldquo;{featured.quote}&rdquo;
                </p>
              </blockquote>
              <div className="relative mt-auto pt-8">
                {featured.metric && (
                  <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-electric/25 bg-electric/[0.1] px-3 py-2">
                    <TrendingUp className="h-3.5 w-3.5 text-electric-soft" />
                    <span className="font-display text-base font-semibold text-white">{featured.metric.value}</span>
                    <span className="text-[0.58rem] uppercase tracking-[0.12em] text-white/48">{featured.metric.label}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-white/[0.08] pt-5">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={featured.initials}
                      name={featured.name}
                      imageSrc={featured.image}
                      accent={featured.accent}
                      size="lg"
                    />
                    <div>
                      <p className="text-[0.82rem] font-semibold text-white">{featured.name}</p>
                      <p className="mt-0.5 text-[0.64rem] text-white/48">{featured.role}, {featured.company}</p>
                    </div>
                  </div>
                  <StarRating size={12} />
                </div>
              </div>
            </article>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {rest.map((testimonial, index) => (
              <Reveal key={testimonial.id} delay={((index % 2) + 1) as 1 | 2}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-surface p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-[#111522] sm:p-6">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between">
                    <StarRating size={12} />
                    <span className="font-display text-[0.58rem] font-semibold tracking-[0.2em] text-white/42">
                      {testimonial.company}
                    </span>
                  </div>
                  <blockquote className="relative mt-4 flex-1">
                    <p className="text-[0.78rem] leading-[1.75] text-white/62">&ldquo;{testimonial.quote}&rdquo;</p>
                  </blockquote>
                  <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        initials={testimonial.initials}
                        name={testimonial.name}
                        imageSrc={testimonial.image}
                        accent={testimonial.accent}
                        size="sm"
                      />
                      <div>
                        <p className="text-[0.7rem] font-semibold text-white/82">{testimonial.name}</p>
                        <p className="text-[0.57rem] text-white/48">{testimonial.role}</p>
                      </div>
                    </div>
                    {testimonial.metric && (
                      <div className="text-end">
                        <p className="font-display text-base font-medium text-white/85">{testimonial.metric.value}</p>
                        <p className="text-[0.5rem] uppercase tracking-[0.1em] text-white/42">{testimonial.metric.label}</p>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={2}>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
            <p className="text-[0.63rem] uppercase tracking-[0.16em] text-white/42">
              {copy.footer}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {copy.badges.map((badge, index) => (
                <div key={badge} className={cn("flex items-center gap-2", index === 2 && "hidden sm:flex")}>
                  <span className="h-1 w-1 rotate-45 bg-electric-soft/60" />
                  <span className="text-[0.58rem] font-medium uppercase tracking-[0.1em] text-white/42">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
