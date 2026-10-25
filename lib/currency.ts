export type CurrencyCode = "USD" | "EGP" | "SAR" | "AED";

export type CurrencyConfig = {
  code: CurrencyCode;
  /** Approximate local currency units per US dollar, used only for input conversion. */
  usdRate: number;
  defaultBudget: number;
  defaultItemValue: number;
  budgetStep: number;
  itemStep: number;
};

export const CURRENCY_STORAGE_KEY = "nara-currency";

export const currencies: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: "USD",
    usdRate: 1,
    defaultBudget: 25_000,
    defaultItemValue: 120,
    budgetStep: 500,
    itemStep: 5,
  },
  EGP: {
    code: "EGP",
    usdRate: 48.5,
    defaultBudget: 150_000,
    defaultItemValue: 1_500,
    budgetStep: 5_000,
    itemStep: 100,
  },
  SAR: {
    code: "SAR",
    usdRate: 3.75,
    defaultBudget: 30_000,
    defaultItemValue: 450,
    budgetStep: 1_000,
    itemStep: 50,
  },
  AED: {
    code: "AED",
    usdRate: 3.67,
    defaultBudget: 30_000,
    defaultItemValue: 450,
    budgetStep: 1_000,
    itemStep: 50,
  },
};

export const currencyOrder: CurrencyCode[] = ["USD", "EGP", "SAR", "AED"];

const timezoneCurrencies: Record<string, CurrencyCode> = {
  "Africa/Cairo": "EGP",
  "Africa/Alexandria": "EGP",
  "Asia/Riyadh": "SAR",
  "Asia/Jeddah": "SAR",
  "Asia/Dammam": "SAR",
  "Asia/Mecca": "SAR",
  "Asia/Medina": "SAR",
  "Asia/Dubai": "AED",
  "Asia/Abu_Dhabi": "AED",
  "Asia/Sharjah": "AED",
  "Asia/Ajman": "AED",
  "Asia/Ras_Al_Khaimah": "AED",
  "Asia/Fujairah": "AED",
  "Asia/Umm_Al_Quwain": "AED",
};

const regionCurrencies: Record<string, CurrencyCode> = {
  EG: "EGP",
  SA: "SAR",
  AE: "AED",
};

function isCurrencyCode(value: string | null | undefined): value is CurrencyCode {
  return value === "USD" || value === "EGP" || value === "SAR" || value === "AED";
}

function regionFromLocale(locale: string): string | null {
  try {
    const region = new Intl.Locale(locale).region;
    if (region) return region.toUpperCase();
  } catch {
    // Fall back to a simple locale tag parse.
  }

  const match = locale.match(/[-_]([a-zA-Z]{2})(?:[-_]|$)/);
  return match?.[1]?.toUpperCase() ?? null;
}

export function readStoredCurrency(): CurrencyCode | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    return isCurrencyCode(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function storeCurrency(code: CurrencyCode) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  } catch {
    // The selection still applies for the current session.
  }
}

export function detectCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "USD";

  const stored = readStoredCurrency();
  if (stored) return stored;

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneCurrency = timezone ? timezoneCurrencies[timezone] : undefined;
    if (timezoneCurrency) return timezoneCurrency;
  } catch {
    // Timezone detection is best-effort.
  }

  try {
    const locales = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const locale of locales) {
      const region = regionFromLocale(locale);
      const regionCurrency = region ? regionCurrencies[region] : undefined;
      if (regionCurrency) return regionCurrency;
    }
  } catch {
    // Language detection is best-effort.
  }

  return "USD";
}

export function roundToStep(value: number, step: number): number {
  if (!Number.isFinite(value) || value <= 0) return step;
  return Math.max(step, Math.round(value / step) * step);
}

export function getReturnMultiplier(budget: number, currency: CurrencyCode): number {
  const budgetInUsd = budget / currencies[currency].usdRate;
  const modeled = 3.2 + 1.6 * (1 - Math.exp(-Math.max(0, budgetInUsd) / 60_000));
  return Math.min(4.8, Math.max(3.2, Math.round(modeled * 10) / 10));
}

export function formatCurrency(
  value: number,
  currency: CurrencyCode,
  language: "en" | "ar",
): string {
  const locale = language === "ar" ? "ar-EG-u-nu-latn" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: language === "ar" ? "symbol" : "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, language: "en" | "ar"): string {
  const locale = language === "ar" ? "ar-EG-u-nu-latn" : "en-US";

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);
}
