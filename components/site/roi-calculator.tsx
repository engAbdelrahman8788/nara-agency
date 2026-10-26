"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calculator,
  ChevronDown,
  Globe2,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { buttonStyles } from "@/components/ui/button";
import { useCms } from "@/lib/cms/provider";
import { useLanguage } from "@/lib/i18n/language-provider";
import { formatMessage } from "@/lib/i18n/translations";
import {
  currencies,
  currencyOrder,
  detectCurrency,
  formatCurrency,
  formatNumber,
  getReturnMultiplier,
  roundToStep,
  storeCurrency,
  type CurrencyCode,
  type CurrencyConfig,
} from "@/lib/currency";
import { cn } from "@/lib/utils";

type Projection = {
  generatedRevenue: number;
  totalRevenue: number;
  roiMultiplier: number;
  projectedLeads: number;
  liftPercent: number;
};

type TouchedFields = {
  revenue: boolean;
  budget: boolean;
  ticket: boolean;
};

function parsePositiveInput(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function defaultRevenueFor(config: CurrencyConfig): number {
  return config.defaultBudget * 4;
}

function defaultRevenueStep(config: CurrencyConfig): number {
  return config.budgetStep * 5;
}

function buildProjection(
  revenue: number,
  budget: number,
  ticket: number,
  roiMultiplier: number,
): Projection | null {
  const rawGenerated = budget * roiMultiplier;
  if (!Number.isFinite(rawGenerated) || rawGenerated <= 0) return null;

  const round = (value: number) =>
    Math.round((value + Number.EPSILON) * 100) / 100;

  return {
    generatedRevenue: round(rawGenerated),
    totalRevenue: round(revenue + rawGenerated),
    roiMultiplier,
    projectedLeads: Math.max(0, Math.round(rawGenerated / ticket)),
    liftPercent: (rawGenerated / revenue) * 100,
  };
}

function SliderField({
  id,
  label,
  hint,
  currency,
  language,
  value,
  placeholder,
  error,
  min,
  max,
  step,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  hint?: string;
  currency: CurrencyCode;
  language: "en" | "ar";
  value: string;
  placeholder: string;
  error?: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const numeric = Number(value);
  const sliderValue =
    value.trim() !== "" && Number.isFinite(numeric)
      ? Math.min(Math.max(numeric, min), max)
      : min;
  const progress =
    max > min
      ? Math.min(100, Math.max(0, ((sliderValue - min) / (max - min)) * 100))
      : 0;

  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        <label
          htmlFor={id}
          className="text-[0.62rem] font-semibold uppercase leading-4 tracking-[0.1em] text-white/55"
        >
          {label}
        </label>
        <span className="rounded border border-white/[0.07] bg-white/[0.02] px-1.5 py-0.5 text-[0.5rem] font-semibold text-white/38">
          {currency}
        </span>
      </div>
      {hint && (
        <p className="mt-0.5 text-[0.58rem] leading-4 text-white/32">{hint}</p>
      )}
      <div className="relative mt-2">
        <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[0.52rem] font-semibold uppercase tracking-[0.06em] text-white/38">
          {currency}
        </span>
        <input
          id={id}
          name={id}
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder={placeholder}
          className={cn(
            "h-11 w-full rounded-xl border bg-[#070A12] ps-12 pe-2.5 text-[0.86rem] font-medium tabular-nums text-white outline-none transition placeholder:text-white/20 focus:border-electric/50 focus:ring-2 focus:ring-electric/15",
            error ? "border-red-400/40" : "border-white/[0.09]",
          )}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(event) => onChange(event.target.value)}
        aria-label={`${label} slider`}
        aria-valuetext={formatCurrency(sliderValue, currency, language)}
        style={{ "--range-progress": `${progress}%` } as React.CSSProperties}
        className="nara-range mt-3 w-full"
      />
      <div className="mt-1 flex items-center justify-between gap-2 text-[0.54rem] tabular-nums text-white/30">
        <span>{formatCurrency(min, currency, language)}</span>
        <span>{formatCurrency(max, currency, language)}</span>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.66rem] leading-4 text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function RoiCalculator() {
  const { language, t } = useLanguage();
  const { content, ready } = useCms();
  const copy = t.roi;
  const roi = content.roi;
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("USD");
  const [revenue, setRevenue] = useState(
    String(defaultRevenueFor(currencies.USD)),
  );
  const [budget, setBudget] = useState(String(currencies.USD.defaultBudget));
  const [ticket, setTicket] = useState(String(currencies.USD.defaultItemValue));
  const [touched, setTouched] = useState<TouchedFields>({
    revenue: false,
    budget: false,
    ticket: false,
  });
  const uid = useId().replace(/:/g, "");
  const initialized = useRef(false);
  const previousConfigs = useRef<Record<CurrencyCode, CurrencyConfig> | null>(
    null,
  );

  const configs = useMemo(() => {
    const next = {} as Record<CurrencyCode, CurrencyConfig>;

    for (const code of currencyOrder) {
      next[code] = {
        ...currencies[code],
        defaultBudget:
          roi.presets[code]?.defaultBudget ?? currencies[code].defaultBudget,
        defaultItemValue:
          roi.presets[code]?.defaultItemValue ?? currencies[code].defaultItemValue,
      };
    }

    return next;
  }, [roi.presets]);

  const config = configs[currencyCode];

  useEffect(() => {
    if (!ready) return;

    if (!initialized.current) {
      initialized.current = true;
      previousConfigs.current = configs;

      const detected = detectCurrency();
      const next = configs[detected];
      setCurrencyCode(detected);
      setRevenue(String(defaultRevenueFor(next)));
      setBudget(String(next.defaultBudget));
      setTicket(String(next.defaultItemValue));
      return;
    }

    const previous = previousConfigs.current;
    previousConfigs.current = configs;
    if (!previous) return;

    const next = configs[currencyCode];
    const last = previous[currencyCode];

    setRevenue((current) =>
      current.trim() === String(defaultRevenueFor(last))
        ? String(defaultRevenueFor(next))
        : current,
    );
    setBudget((current) =>
      current.trim() === String(last.defaultBudget)
        ? String(next.defaultBudget)
        : current,
    );
    setTicket((current) =>
      current.trim() === String(last.defaultItemValue)
        ? String(next.defaultItemValue)
        : current,
    );
  }, [configs, currencyCode, ready]);

  const revenueNumber = parsePositiveInput(revenue);
  const budgetNumber = parsePositiveInput(budget);
  const ticketNumber = parsePositiveInput(ticket);

  const revenueError =
    revenue.trim() === ""
      ? copy.revenueRequired
      : revenueNumber === null
        ? copy.revenuePositive
        : undefined;
  const budgetError =
    budget.trim() === ""
      ? copy.budgetRequired
      : budgetNumber === null
        ? copy.budgetPositive
        : undefined;
  const ticketError =
    ticket.trim() === ""
      ? copy.itemRequired
      : ticketNumber === null
        ? copy.itemPositive
        : undefined;

  const roiMultiplier =
    budgetNumber !== null
      ? getReturnMultiplier(budgetNumber, currencyCode, {
          min: roi.minMultiplier,
          max: roi.maxMultiplier,
          curveBudgetUsd: roi.curveBudgetUsd,
        })
      : null;
  const projection =
    revenueNumber !== null &&
    budgetNumber !== null &&
    ticketNumber !== null &&
    roiMultiplier !== null
      ? buildProjection(revenueNumber, budgetNumber, ticketNumber, roiMultiplier)
      : null;

  const showRevenueError = touched.revenue ? revenueError : undefined;
  const showBudgetError = touched.budget ? budgetError : undefined;
  const showTicketError = touched.ticket ? ticketError : undefined;
  const minLabel = roi.minMultiplier.toFixed(1);
  const maxLabel = roi.maxMultiplier.toFixed(1);
  const rangeLabel = `${minLabel}–${maxLabel}x`;
  const description = formatMessage(copy.description, {
    min: minLabel,
    max: maxLabel,
  });
  const disclaimer = formatMessage(copy.disclaimer, {
    min: minLabel,
    max: maxLabel,
  });

  const revenueStep = defaultRevenueStep(config);
  const revenueMax = Math.ceil(
    (Math.max(revenueStep * 20, (revenueNumber ?? defaultRevenueFor(config)) * 3) +
      Number.EPSILON) /
      revenueStep,
  ) * revenueStep;
  const budgetMax = Math.ceil(
    (Math.max(
      config.budgetStep * 10,
      (budgetNumber ?? config.defaultBudget) * 4,
    ) +
      Number.EPSILON) /
      config.budgetStep,
  ) * config.budgetStep;
  const ticketMax = Math.ceil(
    (Math.max(
      config.itemStep * 20,
      (ticketNumber ?? config.defaultItemValue) * 6,
    ) +
      Number.EPSILON) /
      config.itemStep,
  ) * config.itemStep;

  const liftLabel =
    projection !== null
      ? `+${new Intl.NumberFormat(
          language === "ar" ? "ar-EG-u-nu-latn" : "en-US",
          { maximumFractionDigits: 1 },
        ).format(projection.liftPercent)}%`
      : "";

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCode = event.target.value as CurrencyCode;
    if (nextCode === currencyCode) return;

    const previous = configs[currencyCode];
    const next = configs[nextCode];
    const isPristine =
      revenue.trim() === String(defaultRevenueFor(previous)) &&
      budget.trim() === String(previous.defaultBudget) &&
      ticket.trim() === String(previous.defaultItemValue);

    const convert = (value: number | null, step: number, fallback: number) =>
      isPristine
        ? fallback
        : value !== null
          ? roundToStep((value * next.usdRate) / previous.usdRate, step)
          : fallback;

    setCurrencyCode(nextCode);
    setRevenue(
      String(
        convert(
          revenueNumber,
          defaultRevenueStep(next),
          defaultRevenueFor(next),
        ),
      ),
    );
    setBudget(
      String(convert(budgetNumber, next.budgetStep, next.defaultBudget)),
    );
    setTicket(
      String(convert(ticketNumber, next.itemStep, next.defaultItemValue)),
    );
    setTouched({ revenue: false, budget: false, ticket: false });
    storeCurrency(nextCode);
  };

  return (
    <section id="roi" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-electric/[0.08] blur-[130px] rtl:left-auto rtl:-right-40" />
      <div className="pointer-events-none absolute -right-52 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[#0B2D7A]/15 blur-[120px] rtl:right-auto rtl:-left-52" />

      <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal>
            <SectionLabel>{copy.eyebrow}</SectionLabel>
            <h2 className="mt-5 max-w-xl text-display-md font-display font-medium text-gradient-white text-balance">
              {copy.titleLine1}
              <br />
              <span className="text-white/48">{copy.titleLine2}</span>
            </h2>
            <p className="mt-5 max-w-lg text-[0.95rem] leading-7 text-mist text-pretty">
              {description}
            </p>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-300/80" />
                  <p className="font-display text-[1.6rem] font-medium tracking-[-0.04em] text-white">
                    <span dir="ltr">{rangeLabel}</span>
                  </p>
                </div>
                <p className="mt-1 text-[0.64rem] uppercase tracking-[0.12em] text-white/48">
                  {copy.blendedReturn}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-electric-soft/80" />
                  <p className="font-display text-[1.6rem] font-medium tracking-[-0.04em] text-white">
                    {copy.windowValue}
                  </p>
                </div>
                <p className="mt-1 text-[0.64rem] uppercase tracking-[0.12em] text-white/48">
                  {copy.projectionWindow}
                </p>
              </div>
            </div>

            <Link
              href="#contact"
              className={buttonStyles({ variant: "secondary", size: "md", className: "mt-7" })}
            >
              {copy.cta}
              <ArrowUpRight className="h-4 w-4 text-white/55" />
            </Link>
            <p className="mt-4 max-w-md text-[0.66rem] leading-5 text-white/38">
              {disclaimer}
            </p>
          </Reveal>

          <Reveal delay={1}>
            <div className="noise-overlay relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0A0D14] shadow-card">
              <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-electric/[0.15] blur-[80px] rtl:right-auto rtl:-left-24" />

              <div className="relative flex items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-electric/20 bg-electric/10 text-electric-soft">
                    <Calculator className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[0.8rem] font-semibold text-white/85">{copy.cardTitle}</p>
                    <p className="mt-0.5 text-[0.62rem] text-white/48">{copy.cardSubtitle}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  {copy.instant}
                </span>
              </div>

              <div className="relative flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] px-5 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Globe2 className="h-3.5 w-3.5 shrink-0 text-electric-soft/70" />
                  <div>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/55">
                      {copy.currencyLabel}
                    </p>
                    <p id={`${uid}-currency-note`} className="mt-0.5 text-[0.6rem] text-white/38">
                      {copy.currencyNote}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor={`${uid}-currency`} className="sr-only">
                    {copy.currencyLabel}
                  </label>
                  <select
                    id={`${uid}-currency`}
                    value={currencyCode}
                    onChange={handleCurrencyChange}
                    aria-describedby={`${uid}-currency-note`}
                    className="h-8 cursor-pointer appearance-none rounded-lg border border-white/[0.09] bg-[#070A12] py-0 pe-7 ps-2.5 text-[0.68rem] font-medium text-white/78 outline-none transition focus:border-electric/50 focus:ring-2 focus:ring-electric/15"
                  >
                    {currencyOrder.map((code) => (
                      <option key={code} value={code}>
                        {copy.currencyOptions[code]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/38" />
                </div>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setTouched({ revenue: true, budget: true, ticket: true });
                }}
                noValidate
                className="relative px-5 pb-4 pt-5 sm:px-6 sm:pt-6"
              >
                <div className="grid gap-5 sm:grid-cols-3 sm:gap-4">
                  <SliderField
                    id={`${uid}-revenue`}
                    label={copy.revenueLabel}
                    hint={copy.revenueHint}
                    currency={currencyCode}
                    language={language}
                    value={revenue}
                    placeholder={String(defaultRevenueFor(config))}
                    error={showRevenueError}
                    min={revenueStep}
                    max={revenueMax}
                    step={revenueStep}
                    onChange={(value) =>
                      setRevenue(value.trim() === "" ? "" : value)
                    }
                    onBlur={() =>
                      setTouched((current) => ({ ...current, revenue: true }))
                    }
                  />
                  <SliderField
                    id={`${uid}-budget`}
                    label={copy.budgetLabel}
                    currency={currencyCode}
                    language={language}
                    value={budget}
                    placeholder={String(config.defaultBudget)}
                    error={showBudgetError}
                    min={config.budgetStep}
                    max={budgetMax}
                    step={config.budgetStep}
                    onChange={(value) =>
                      setBudget(value.trim() === "" ? "" : value)
                    }
                    onBlur={() =>
                      setTouched((current) => ({ ...current, budget: true }))
                    }
                  />
                  <SliderField
                    id={`${uid}-ticket`}
                    label={copy.itemValueLabel}
                    currency={currencyCode}
                    language={language}
                    value={ticket}
                    placeholder={String(config.defaultItemValue)}
                    error={showTicketError}
                    min={config.itemStep}
                    max={ticketMax}
                    step={config.itemStep}
                    onChange={(value) =>
                      setTicket(value.trim() === "" ? "" : value)
                    }
                    onBlur={() =>
                      setTouched((current) => ({ ...current, ticket: true }))
                    }
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 text-[0.66rem] leading-5 text-white/42">
                  <span className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <p>{copy.liveNote}</p>
                </div>
              </form>

              <div className="relative px-5 pb-5 sm:px-6 sm:pb-6">
                <div
                  aria-live="polite"
                  aria-atomic="true"
                  className="relative min-h-[13.25rem] overflow-hidden rounded-xl border border-electric/25 bg-[#080D1B] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,75,255,0.22),transparent_62%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.08]" />

                  <div className="relative">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/48">
                        {copy.resultLabel}
                      </p>
                      <span className="rounded-md border border-emerald-400/15 bg-emerald-400/[0.05] px-2 py-1 text-[0.56rem] font-medium uppercase tracking-[0.12em] text-emerald-300/80">
                        {copy.resultChip}
                      </span>
                    </div>

                    {projection ? (
                      <div
                        key={`${currencyCode}-${projection.generatedRevenue}-${projection.projectedLeads}-${projection.totalRevenue}`}
                        className="animate-fade-up"
                      >
                        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <p className="max-w-full break-words font-display text-[2rem] font-medium leading-none tracking-[-0.045em] tabular-nums text-white sm:text-[2.45rem]">
                            {formatCurrency(projection.generatedRevenue, currencyCode, language)}
                          </p>
                          <span className="text-[0.78rem] font-medium text-white/42">
                            {copy.perMonth}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2 py-1 text-[0.62rem] font-semibold text-emerald-300">
                            <TrendingUp className="h-3 w-3" />
                            {projection.roiMultiplier.toFixed(1)}x {copy.returnSuffix}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[0.62rem] uppercase tracking-[0.12em] text-white/38">
                          {copy.generatedLabel}
                        </p>

                        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-4">
                          <div className="min-w-0">
                            <dt className="text-[0.56rem] uppercase leading-4 tracking-[0.1em] text-white/42">
                              {copy.netRevenue}
                            </dt>
                            <dd className="mt-1 truncate text-[0.88rem] font-semibold tabular-nums text-white/82">
                              {formatCurrency(projection.totalRevenue, currencyCode, language)}
                            </dd>
                          </div>
                          <div className="min-w-0">
                            <dt className="text-[0.56rem] uppercase leading-4 tracking-[0.1em] text-white/42">
                              {copy.projectedLeads}
                            </dt>
                            <dd className="mt-1 flex items-center gap-1.5 text-[0.88rem] font-semibold tabular-nums text-white/82">
                              <Users className="h-3 w-3 shrink-0 text-white/38" />
                              {formatNumber(projection.projectedLeads, language)}
                            </dd>
                          </div>
                          <div className="min-w-0">
                            <dt className="text-[0.56rem] uppercase leading-4 tracking-[0.1em] text-white/42">
                              {copy.liftLabel}
                            </dt>
                            <dd className="mt-1 truncate text-[0.88rem] font-semibold tabular-nums text-emerald-300">
                              {liftLabel}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    ) : (
                      <div className="mt-4 flex min-h-[8.5rem] flex-col justify-center">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-electric/20 bg-electric/[0.07] text-electric-soft">
                          <Calculator className="h-4 w-4" />
                        </span>
                        <p className="mt-3 font-display text-[1.1rem] font-medium tracking-[-0.02em] text-white/82">
                          {copy.awaiting}
                        </p>
                        <p className="mt-1 text-[0.72rem] leading-5 text-white/45">
                          {copy.awaitingText}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
