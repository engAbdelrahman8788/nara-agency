"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  Check,
  Copy,
  Lightbulb,
  Megaphone,
  RefreshCw,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { AD_EXAMPLES, generateAdPack, type AdPack } from "@/lib/ad-generator";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { DashboardCard, PageHeader, SectionHeader } from "@/components/dashboard/ui";

function CopyButton({
  text,
  label,
  className,
}: {
  text: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `${label} is ready to paste.`,
      });
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast({
        title: "Couldn't copy automatically",
        description: "Select the text and copy it manually.",
        tone: "info",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.025] px-2 text-[0.65rem] font-medium text-white/48 transition hover:border-white/15 hover:text-white/78",
        copied && "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300",
        className,
      )}
      aria-label={`Copy ${label.toLowerCase()}`}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function packToText(pack: AdPack): string {
  return [
    `AD PACK — ${pack.businessType}`,
    `Niche: ${pack.niche}`,
    `Audience: ${pack.audience}`,
    "",
    "HOOKS",
    ...pack.hooks.map((hook, index) => `${index + 1}. ${hook}`),
    "",
    "PRIMARY AD COPY",
    ...pack.ads.flatMap((ad, index) => [
      `${index + 1}. ${ad.headline}`,
      ad.body,
      `CTA: ${ad.cta}`,
      "",
    ]),
    "B2B OUTREACH ANGLES",
    ...pack.outreach.flatMap((angle, index) => [
      `${index + 1}. ${angle.audience}`,
      `Angle: ${angle.angle}`,
      angle.opener,
      "",
    ]),
  ].join("\n");
}

export function AdminAdGenerator() {
  const [businessType, setBusinessType] = useState("");
  const [result, setResult] = useState<AdPack | null>(null);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const generate = (value: string, nextVariation = 0) => {
    const cleaned = value.trim();
    if (cleaned.length < 2) {
      setError("Enter a business type to generate your ad pack.");
      return;
    }

    setError("");
    setVariation(nextVariation);
    setResult(generateAdPack(cleaned, nextVariation));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    generate(businessType, 0);
  };

  const regenerate = () => {
    const next = variation + 1;
    generate(result?.businessType || businessType, next);
    toast({
      title: "Fresh angles generated",
      description: "A new mix of hooks, ads, and outreach openers is ready.",
      tone: "info",
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="AI ad studio"
        title="One idea. Every angle."
        description="Turn a business type into high-converting hooks, primary ad copy, and B2B outreach angles. Built for speed, so your team can test more and guess less."
        actions={
          <>
            <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.05] px-3 text-[0.72rem] text-emerald-300/85">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Runs locally · no API key
            </span>
            {result && (
              <button
                type="button"
                onClick={regenerate}
                className={buttonStyles({
                  variant: "secondary",
                  size: "sm",
                  className: "h-9",
                })}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </button>
            )}
          </>
        }
      />

      <div className="grid items-start gap-3.5 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-3.5">
          <DashboardCard className="border-electric/15 bg-[radial-gradient(ellipse_at_top_right,rgba(0,75,255,0.14),transparent_62%)]">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-electric/20 bg-electric/10 text-electric-soft">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[0.9rem] font-semibold text-white">
                  What do you sell?
                </p>
                <p className="mt-1 text-[0.74rem] leading-5 text-white/45">
                  Describe the business in a few words. The generator adapts the
                  hooks, offer language, and outreach angles to the category.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5">
              <label
                htmlFor="ad-business-type"
                className="mb-1.5 block text-[0.72rem] font-medium text-white/55"
              >
                Business type
              </label>
              <div className="relative">
                <Megaphone className="pointer-events-none absolute start-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                <input
                  id="ad-business-type"
                  value={businessType}
                  onChange={(event) => {
                    setBusinessType(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. Scooter Showroom"
                  className="h-11 w-full rounded-lg border border-white/[0.09] bg-[#070A12] ps-10 pe-3.5 text-[0.86rem] text-white placeholder:text-white/30 focus:border-electric/45"
                />
              </div>
              {error && (
                <p role="alert" className="mt-2 text-[0.7rem] text-red-300">
                  {error}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {AD_EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setBusinessType(example);
                      generate(example, 0);
                    }}
                    className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[0.65rem] text-white/48 transition hover:border-electric/25 hover:bg-electric/[0.05] hover:text-white/78"
                  >
                    {example}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className={buttonStyles({
                  size: "md",
                  className: "mt-5 w-full",
                })}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate ad pack
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </DashboardCard>

          <DashboardCard>
            <SectionHeader
              title="What you'll get"
              description="Three formats, one brief."
            />
            <div className="mt-4 space-y-2.5">
              {[
                {
                  icon: Lightbulb,
                  label: "Scroll-stopping hooks",
                  text: "Three openers built around the buyer's real objection.",
                },
                {
                  icon: Megaphone,
                  label: "Primary ad variations",
                  text: "Three headline, body, and CTA combinations ready to test.",
                },
                {
                  icon: Users,
                  label: "B2B outreach angles",
                  text: "Three partnership audiences with openers you can send today.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.015] p-3"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-electric-soft/80">
                    <item.icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[0.74rem] font-medium text-white/75">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[0.68rem] leading-4 text-white/42">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {result ? (
          <div className="space-y-3.5">
            <DashboardCard className="border-electric/20 bg-[radial-gradient(ellipse_at_top_right,rgba(0,75,255,0.2),transparent_60%)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-electric/25 bg-electric/[0.09] px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-electric-pale">
                      {result.niche}
                    </span>
                    <span className="text-[0.62rem] text-emerald-300/75">
                      Pack ready
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-[1.5rem] font-medium leading-tight tracking-[-0.03em] text-white">
                    {result.businessType}
                  </h2>
                  <p className="mt-2 max-w-xl text-[0.75rem] leading-5 text-white/48">
                    <span className="text-white/65">Audience:</span>{" "}
                    {result.audience}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {result.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded border border-white/[0.07] bg-black/15 px-2 py-0.5 text-[0.6rem] text-white/42"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <CopyButton
                    text={packToText(result)}
                    label="the full ad pack"
                    className="h-8 px-2.5 text-[0.68rem]"
                  />
                  <button
                    type="button"
                    onClick={regenerate}
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                      className: "h-8 px-2.5 text-[0.68rem]",
                    })}
                  >
                    <RefreshCw className="h-3 w-3" />
                    New angles
                  </button>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <SectionHeader
                title="Hooks"
                description="Openers designed to stop the scroll and earn the next line."
                action={<CopyButton text={result.hooks.join("\n\n")} label="all hooks" />}
              />
              <div className="mt-4 space-y-2.5">
                {result.hooks.map((hook, index) => (
                  <div
                    key={hook}
                    className="group flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.015] p-3.5 transition hover:border-white/[0.12]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-electric/20 bg-electric/[0.07] font-display text-[0.65rem] font-semibold text-electric-pale">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="flex-1 text-[0.8rem] leading-6 text-white/72">
                      {hook}
                    </p>
                    <CopyButton text={hook} label={`hook ${index + 1}`} className="mt-0.5 shrink-0" />
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard>
              <SectionHeader
                title="Primary ad copy"
                description="Three distinct concepts, each with a clear call to action."
                action={
                  <span className="rounded-md border border-white/[0.07] bg-black/15 px-2 py-1 text-[0.6rem] text-white/38">
                    {result.ads.length} concepts
                  </span>
                }
              />
              <div className="mt-4 space-y-3">
                {result.ads.map((ad, index) => (
                  <article
                    key={`${ad.headline}-${index}`}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 transition hover:border-white/[0.13]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-[0.6rem] font-semibold text-white/48">
                          {index + 1}
                        </span>
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/42">
                          Concept {String(index + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <CopyButton
                        text={`${ad.headline}\n\n${ad.body}\n\nCTA: ${ad.cta}`}
                        label={`concept ${index + 1}`}
                      />
                    </div>
                    <h3 className="mt-3 font-display text-[1.02rem] font-medium leading-snug tracking-[-0.01em] text-white">
                      {ad.headline}
                    </h3>
                    <p className="mt-2 text-[0.78rem] leading-6 text-white/55">
                      {ad.body}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md border border-electric/20 bg-electric/[0.08] px-2 py-1 text-[0.62rem] font-semibold text-electric-pale/85">
                        <Target className="h-2.5 w-2.5" />
                        {ad.cta}
                      </span>
                      <span className="text-[0.6rem] text-white/30">
                        {ad.body.split(/\s+/).length} words
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard>
              <SectionHeader
                title="B2B outreach angles"
                description="Partner conversations that open a second growth channel."
                action={<CopyButton text={result.outreach.map((angle) => angle.opener).join("\n\n")} label="all outreach openers" />}
              />
              <div className="mt-4 space-y-3">
                {result.outreach.map((angle, index) => (
                  <article
                    key={`${angle.audience}-${index}`}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-violet-400/15 bg-violet-400/[0.06] text-violet-300">
                          <Briefcase className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="text-[0.76rem] font-medium text-white/78">
                            {angle.audience}
                          </p>
                          <p className="mt-0.5 text-[0.64rem] text-white/42">
                            {angle.angle}
                          </p>
                        </div>
                      </div>
                      <CopyButton
                        text={`Audience: ${angle.audience}\nAngle: ${angle.angle}\n\n${angle.opener}`}
                        label={`outreach angle ${index + 1}`}
                      />
                    </div>
                    <p className="mt-3 rounded-lg border border-white/[0.05] bg-black/15 px-3 py-2.5 text-[0.75rem] leading-6 text-white/55">
                      “{angle.opener}”
                    </p>
                  </article>
                ))}
              </div>
            </DashboardCard>

            <p className="flex items-center gap-2 px-1 text-[0.64rem] text-white/32">
              <Sparkles className="h-3 w-3" />
              Generated from tested direct-response patterns. Edit the offer,
              proof, and numbers to match the client before publishing.
            </p>
          </div>
        ) : (
          <DashboardCard padding={false} className="min-h-[38rem]">
            <div className="flex h-full min-h-[38rem] flex-col items-center justify-center p-8 text-center">
              <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-electric/20 bg-electric/[0.07] text-electric-soft">
                <span className="absolute inset-0 rounded-2xl bg-electric/15 blur-xl" />
                <Megaphone className="relative h-6 w-6" />
              </span>
              <h2 className="mt-6 font-display text-[1.35rem] font-medium tracking-[-0.02em] text-white">
                Your next campaign starts here.
              </h2>
              <p className="mt-2 max-w-sm text-[0.8rem] leading-6 text-white/45">
                Enter a business type or pick an example. You'll get hooks, ad
                copy, and partner outreach angles in seconds.
              </p>
              <div className="mt-8 grid w-full max-w-md gap-2 text-left">
                {[
                  "Describe the business in plain language.",
                  "Generate a full pack of hooks, ads, and outreach angles.",
                  "Copy the winner, test it, and come back for a fresh angle.",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.015] px-3.5 py-2.5"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[0.58rem] font-semibold text-white/48">
                      {index + 1}
                    </span>
                    <span className="text-[0.72rem] text-white/52">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        )}
      </div>
    </div>
  );
}
