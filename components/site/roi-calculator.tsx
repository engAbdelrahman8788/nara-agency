"use client";

import { useEffect, useId, useState } from "react";
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
import { useLanguage } from "@/lib/i18n/language-provider";
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
} from "@/lib/currency";
import { cn } from "@/lib/utils";

type Projection = {
  estimatedRevenue: number;
  roiMultiplier: number;
  projectedCustomers: number;
  netReturn: number;
};

type TouchedFields = {
  budget: boolean;
  itemValue: boolean;
};

function parsePositiveInput(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function buildProjection(
  budget: number,
  itemValue: number,
  roiMultiplier: number,
): Projection | null {
  const rawRevenue = budget * roiMultiplier;
  if (!Number.isFinite(rawRevenue) || rawRevenue <= 0) return null;

  const estimatedRevenue = Math.round((rawRevenue + Number.EPSILON) * 100) / 100;

  return {
    estimatedRevenue,
    roiMultiplier,
    projectedCustomers: Math.floor(estimatedRevenue / itemValue),
    netReturn: Math.round((estimatedRevenue - budget + Number.EPSILON) * 100) / 100,
  };
}

export function RoiCalculator() {
  const { language, t } = useLanguage();
  const copy = t.roi;
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("USD");
  const [budget, setBudget] = useState(String(currencies.USD.defaultBudget));
  const [itemValue, setItemValue] = useState(String(currencies.USD.defaultItemValue));
  const [touched, setTouched] = useState<TouchedFields>({ budget: false, itemValue: false });
  const uid = useId().replace(/:/g, "");

  const config = currencies[currencyCode];

  useEffect(() => {
    const detected = detectCurrency();
    const next = currencies[detected];
    setCurrencyCode(detected);
    setBudget(String(next.defaultBudget));
    setItemValue(String(next.defaultItemValue));
  }, []);

  const budgetNumber = parsePositiveInput(budget);
  const itemValueNumber = parsePositiveInput(itemValue);
  const budgetError =
    budget.trim() === ""
      ? copy.budgetRequired
      : budgetNumber === null
        ? copy.budgetPositive
        : undefined;
  const itemValueError =
    itemValue.trim() === ""
      ? copy.itemRequired
      : itemValueNumber === null
        ? copy.itemPositive
        : undefined;
  const roiMultiplier =
    budgetNumber !== null ? getReturnMultiplier(budgetNumber, currencyCode) : null;
  const projection =
    budgetNumber !== null && itemValueNumber !== null && roiMultiplier !== null
      ? buildProjection(budgetNumber, itemValueNumber, roiMultiplier)
      : null;

  const showBudgetError = touched.budget ? budgetError : undefined;
  const showItemValueError = touched.itemValue ? itemValueError : undefined;

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCode = event.target.value as CurrencyCode;
    if (nextCode === currencyCode) return;

    const previous = currencies[currencyCode];
    const next = currencies[nextCode];
    const isPristine =
      budget.trim() === String(previous.defaultBudget) &&
      itemValue.trim() === String(previous.defaultItemValue);

    const nextBudget = isPristine
      ? next.defaultBudget
      : budgetNumber !== null
        ? roundToStep((budgetNumber * next.usdRate) / previous.usdRate, next.budgetStep)
        : next.defaultBudget;
    const nextItemValue = isPristine
      ? next.defaultItemValue
      : itemValueNumber !== null
        ? roundToStep((itemValueNumber * next.usdRate) / previous.usdRate, next.itemStep)
        : next.defaultItemValue;

    setCurrencyCode(nextCode);
    setBudget(String(nextBudget));
    setItemValue(String(nextItemValue));
    setTouched({ budget: false, itemValue: false });
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
              {copy.description}
            </p>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-300/80" />
                  <p className="font-display text-[1.6rem] font-medium tracking-[-0.04em] text-white">
                    <span dir="ltr">{copy.returnRangeValue}</span>
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
              {copy.disclaimer}
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
                  setTouched({ budget: true, itemValue: true });
                }}
                noValidate
                className="relative px-5 pb-4 pt-5 sm:px-6 sm:pt-6"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`${uid}-budget`}
                      className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-white/55"
                    >
                      {copy.budgetLabel}
                    </label>
                    <div className="relative mt-2">
                      <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[0.52rem] font-semibold uppercase tracking-[0.08em] text-white/38">
                        {currencyCode}
                      </span>
                      <input
                        id={`${uid}-budget`}
                        name="budget"
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={budget}
                        onChange={(event) => setBudget(event.target.value)}
                        onBlur={() => setTouched((current) => ({ ...current, budget: true }))}
                        aria-invalid={Boolean(showBudgetError)}
                        aria-describedby={showBudgetError ? `${uid}-budget-error` : undefined}
                        placeholder={String(config.defaultBudget)}
                        className={cn(
                          "h-12 w-full rounded-xl border bg-[#070A12] ps-12 pe-3 text-[0.9rem] font-medium tabular-nums text-white outline-none transition placeholder:text-white/20 focus:border-electric/50 focus:ring-2 focus:ring-electric/15",
                          showBudgetError ? "border-red-400/40" : "border-white/[0.09]",
                        )}
                      />
                    </div>
                    {showBudgetError && (
                      <p id={`${uid}-budget-error`} className="mt-1.5 text-[0.68rem] text-red-300">
                        {showBudgetError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`${uid}-item-value`}
                      className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-white/55"
                    >
                      {copy.itemValueLabel}
                    </label>
                    <div className="relative mt-2">
                      <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[0.52rem] font-semibold uppercase tracking-[0.08em] text-white/38">
                        {currencyCode}
                      </span>
                      <input
                        id={`${uid}-item-value`}
                        name="itemValue"
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={itemValue}
                        onChange={(event) => setItemValue(event.target.value)}
                        onBlur={() => setTouched((current) => ({ ...current, itemValue: true }))}
                        aria-invalid={Boolean(showItemValueError)}
                        aria-describedby={showItemValueError ? `${uid}-item-value-error` : undefined}
                        placeholder={String(config.defaultItemValue)}
                        className={cn(
                          "h-12 w-full rounded-xl border bg-[#070A12] ps-12 pe-3 text-[0.9rem] font-medium tabular-nums text-white outline-none transition placeholder:text-white/20 focus:border-electric/50 focus:ring-2 focus:ring-electric/15",
                          showItemValueError ? "border-red-400/40" : "border-white/[0.09]",
                        )}
                      />
                    </div>
                    {showItemValueError && (
                      <p id={`${uid}-item-value-error`} className="mt-1.5 text-[0.68rem] text-red-300">
                        {showItemValueError}
                      </p>
                    )}
                  </div>
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
                        key={`${currencyCode}-${projection.estimatedRevenue}-${projection.projectedCustomers}-${projection.netReturn}`}
                        className="animate-fade-up"
                      >
                        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <p className="max-w-full break-words font-display text-[2rem] font-medium leading-none tracking-[-0.045em] tabular-nums text-white sm:text-[2.45rem]">
                            {formatCurrency(projection.estimatedRevenue, currencyCode, language)}
                          </p>
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2 py-1 text-[0.62rem] font-semibold text-emerald-300">
                            <TrendingUp className="h-3 w-3" />
                            {projection.roiMultiplier.toFixed(1)}x {copy.returnSuffix}
                          </span>
                        </div>

                        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-4">
                          <div>
                            <dt className="text-[0.58rem] uppercase tracking-[0.12em] text-white/42">
                              {copy.netRevenue}
                            </dt>
                            <dd className="mt-1 text-[0.92rem] font-semibold tabular-nums text-white/82">
                              {formatCurrency(projection.netReturn, currencyCode, language)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[0.58rem] uppercase tracking-[0.12em] text-white/42">
                              {copy.newCustomers}
                            </dt>
                            <dd className="mt-1 flex items-center gap-1.5 text-[0.92rem] font-semibold tabular-nums text-white/82">
                              <Users className="h-3 w-3 text-white/38" />
                              {formatNumber(projection.projectedCustomers, language)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[0.58rem] uppercase tracking-[0.12em] text-white/42">
                              {copy.returnMultiple}
                            </dt>
                            <dd className="mt-1 text-[0.92rem] font-semibold tabular-nums text-white/82">
                              {projection.roiMultiplier.toFixed(1)}x
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
