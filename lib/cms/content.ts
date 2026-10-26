import type { ServiceIcon, Testimonial } from "@/lib/data";
import { services as seedServices } from "@/lib/data";
import { currencies, currencyOrder, type CurrencyCode } from "@/lib/currency";
import { translations, type ServiceCopy } from "@/lib/i18n/translations";

export const CMS_STORAGE_KEY = "nara-cms-content-v1";
export const CMS_VERSION = 1;

export type CmsLanguage = "en" | "ar";

export type CmsHeroCopy = {
  titleLead: string;
  titleAccent: string;
  titleEnd: string;
  description: string;
};

export type CmsHeroContent = Record<CmsLanguage, CmsHeroCopy>;

export type CmsServiceCopy = {
  eyebrow: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  deliverables: string[];
};

export type CmsService = {
  id: string;
  icon: ServiceIcon;
  accent: string;
  enabled: boolean;
  en: CmsServiceCopy;
  ar: CmsServiceCopy;
};

export type CmsTestimonialCopy = {
  quote: string;
  name: string;
  role: string;
  company: string;
  metricValue: string;
  metricLabel: string;
};

export type CmsTestimonial = {
  id: string;
  rating: number;
  initials: string;
  accent: string;
  image?: string;
  enabled: boolean;
  en: CmsTestimonialCopy;
  ar: CmsTestimonialCopy;
};

export type CmsCurrencyPreset = {
  defaultBudget: number;
  defaultItemValue: number;
};

export type CmsRoiSettings = {
  minMultiplier: number;
  maxMultiplier: number;
  curveBudgetUsd: number;
  presets: Record<CurrencyCode, CmsCurrencyPreset>;
};

export type CmsContent = {
  version: number;
  hero: CmsHeroContent;
  services: CmsService[];
  testimonials: CmsTestimonial[];
  roi: CmsRoiSettings;
  updatedAt: string | null;
};

export const SERVICE_ICON_OPTIONS: ServiceIcon[] = [
  "performance",
  "social",
  "search",
  "content",
  "web",
];

export const SERVICE_ACCENTS: Record<ServiceIcon, string> = {
  performance: "#004BFF",
  social: "#5B8CFF",
  search: "#00C2FF",
  content: "#7C5CFF",
  web: "#FF7A59",
};

export const TESTIMONIAL_ACCENTS = [
  "#5B8CFF",
  "#C8A97E",
  "#00C2FF",
  "#7C5CFF",
  "#FF7A59",
  "#28C76F",
  "#F4B942",
];

const DEFAULT_HERO: CmsHeroContent = {
  en: pickHeroCopy("en"),
  ar: pickHeroCopy("ar"),
};

function pickHeroCopy(language: CmsLanguage): CmsHeroCopy {
  const hero = translations[language].hero;

  return {
    titleLead: hero.titleLead,
    titleAccent: hero.titleAccent,
    titleEnd: hero.titleEnd,
    description: hero.description,
  };
}

function pickServiceCopy(item: ServiceCopy): CmsServiceCopy {
  return {
    eyebrow: item.eyebrow,
    title: item.title,
    description: item.description,
    metric: item.metric,
    metricLabel: item.metricLabel,
    tags: [...item.tags],
    deliverables: [...item.deliverables],
  };
}

function pickTestimonialCopy(item: Testimonial): CmsTestimonialCopy {
  return {
    quote: item.quote,
    name: item.name,
    role: item.role,
    company: item.company,
    metricValue: item.metric?.value ?? "",
    metricLabel: item.metric?.label ?? "",
  };
}

function buildDefaultServices(): CmsService[] {
  const arById = new Map(
    translations.ar.services.items.map((item) => [item.id, item]),
  );
  const metaById = new Map(
    seedServices.map((item) => [item.id, { icon: item.icon, accent: item.accent }]),
  );

  return translations.en.services.items.map((enItem) => {
    const arItem = arById.get(enItem.id) ?? enItem;
    const meta = metaById.get(enItem.id) ?? {
      icon: "performance" as ServiceIcon,
      accent: SERVICE_ACCENTS.performance,
    };

    return {
      id: enItem.id,
      icon: meta.icon,
      accent: meta.accent,
      enabled: true,
      en: pickServiceCopy(enItem),
      ar: pickServiceCopy(arItem),
    };
  });
}

function extractAccentHex(value: string, fallback: string): string {
  const match = /#([0-9a-f]{6})/i.exec(value);
  return match ? `#${match[1].toLowerCase()}` : fallback;
}

function buildDefaultTestimonials(): CmsTestimonial[] {
  const arById = new Map(
    translations.ar.testimonials.items.map((item) => [item.id, item]),
  );

  return translations.en.testimonials.items.map((enItem, index) => {
    const arItem = arById.get(enItem.id) ?? enItem;

    return {
      id: enItem.id,
      rating: 5,
      initials: enItem.initials,
      accent: extractAccentHex(
        enItem.accent,
        TESTIMONIAL_ACCENTS[index % TESTIMONIAL_ACCENTS.length],
      ),
      image: enItem.image,
      enabled: true,
      en: pickTestimonialCopy(enItem),
      ar: pickTestimonialCopy(arItem),
    };
  });
}

function buildDefaultRoi(): CmsRoiSettings {
  const presets = {} as Record<CurrencyCode, CmsCurrencyPreset>;

  for (const code of currencyOrder) {
    presets[code] = {
      defaultBudget: currencies[code].defaultBudget,
      defaultItemValue: currencies[code].defaultItemValue,
    };
  }

  return {
    minMultiplier: 3.2,
    maxMultiplier: 4.8,
    curveBudgetUsd: 60_000,
    presets,
  };
}

const DEFAULT_CONTENT: CmsContent = {
  version: CMS_VERSION,
  hero: DEFAULT_HERO,
  services: buildDefaultServices(),
  testimonials: buildDefaultTestimonials(),
  roi: buildDefaultRoi(),
  updatedAt: null,
};

function cloneContent(content: CmsContent): CmsContent {
  return JSON.parse(JSON.stringify(content)) as CmsContent;
}

export function createDefaultContent(): CmsContent {
  return cloneContent(DEFAULT_CONTENT);
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function readBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function readNumber(
  value: unknown,
  fallback: number,
  min = -Infinity,
  max = Infinity,
): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function readTextArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return [...fallback];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function readAccent(value: unknown, fallback: string): string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)
    ? value
    : fallback;
}

function readIcon(value: unknown, fallback: ServiceIcon): ServiceIcon {
  return SERVICE_ICON_OPTIONS.includes(value as ServiceIcon)
    ? (value as ServiceIcon)
    : fallback;
}

function sanitizeHeroCopy(raw: unknown, fallback: CmsHeroCopy): CmsHeroCopy {
  const record = isRecord(raw) ? raw : {};

  return {
    titleLead: readText(record.titleLead, fallback.titleLead),
    titleAccent: readText(record.titleAccent, fallback.titleAccent),
    titleEnd: readText(record.titleEnd, fallback.titleEnd),
    description: readText(record.description, fallback.description),
  };
}

function sanitizeServiceCopy(
  raw: unknown,
  fallback: CmsServiceCopy,
): CmsServiceCopy {
  const record = isRecord(raw) ? raw : {};

  return {
    eyebrow: readText(record.eyebrow, fallback.eyebrow),
    title: readText(record.title, fallback.title),
    description: readText(record.description, fallback.description),
    metric: readText(record.metric, fallback.metric),
    metricLabel: readText(record.metricLabel, fallback.metricLabel),
    tags: readTextArray(record.tags, fallback.tags),
    deliverables: readTextArray(record.deliverables, fallback.deliverables),
  };
}

function sanitizeService(raw: unknown, index: number): CmsService | null {
  if (!isRecord(raw)) return null;

  const fallback =
    DEFAULT_CONTENT.services.find((item) => item.id === raw.id) ??
    DEFAULT_CONTENT.services[index % DEFAULT_CONTENT.services.length];

  const id =
    typeof raw.id === "string" && raw.id.trim()
      ? raw.id.trim()
      : `service-${index + 1}`;

  const service: CmsService = {
    id,
    icon: readIcon(raw.icon, fallback.icon),
    accent: readAccent(raw.accent, fallback.accent),
    enabled: readBoolean(raw.enabled, fallback.enabled),
    en: sanitizeServiceCopy(raw.en, fallback.en),
    ar: sanitizeServiceCopy(raw.ar, fallback.ar),
  };

  return service.en.title.trim() || service.ar.title.trim() ? service : null;
}

function sanitizeTestimonialCopy(
  raw: unknown,
  fallback: CmsTestimonialCopy,
): CmsTestimonialCopy {
  const record = isRecord(raw) ? raw : {};

  return {
    quote: readText(record.quote, fallback.quote),
    name: readText(record.name, fallback.name),
    role: readText(record.role, fallback.role),
    company: readText(record.company, fallback.company),
    metricValue: readText(record.metricValue, fallback.metricValue),
    metricLabel: readText(record.metricLabel, fallback.metricLabel),
  };
}

function sanitizeTestimonial(
  raw: unknown,
  index: number,
): CmsTestimonial | null {
  if (!isRecord(raw)) return null;

  const fallback =
    DEFAULT_CONTENT.testimonials.find((item) => item.id === raw.id) ??
    DEFAULT_CONTENT.testimonials[index % DEFAULT_CONTENT.testimonials.length];

  const id =
    typeof raw.id === "string" && raw.id.trim()
      ? raw.id.trim()
      : `testimonial-${index + 1}`;

  const testimonial: CmsTestimonial = {
    id,
    rating: Math.round(readNumber(raw.rating, fallback.rating, 1, 5)),
    initials: readText(raw.initials, fallback.initials),
    accent: readAccent(raw.accent, fallback.accent),
    image:
      typeof raw.image === "string" && raw.image.trim()
        ? raw.image.trim()
        : undefined,
    enabled: readBoolean(raw.enabled, fallback.enabled),
    en: sanitizeTestimonialCopy(raw.en, fallback.en),
    ar: sanitizeTestimonialCopy(raw.ar, fallback.ar),
  };

  return testimonial.en.name.trim() || testimonial.ar.name.trim()
    ? testimonial
    : null;
}

function sanitizeRoi(raw: unknown): CmsRoiSettings {
  const fallback = DEFAULT_CONTENT.roi;
  const record = isRecord(raw) ? raw : {};
  const presetsRaw = isRecord(record.presets) ? record.presets : {};
  const minMultiplier = readNumber(record.minMultiplier, fallback.minMultiplier, 1, 19);
  const maxMultiplier = readNumber(
    record.maxMultiplier,
    Math.max(fallback.maxMultiplier, minMultiplier + 0.1),
    minMultiplier + 0.1,
    20,
  );
  const presets = {} as Record<CurrencyCode, CmsCurrencyPreset>;

  for (const code of currencyOrder) {
    const preset = isRecord(presetsRaw[code]) ? presetsRaw[code] : {};
    const defaults = fallback.presets[code];

    presets[code] = {
      defaultBudget: readNumber(preset.defaultBudget, defaults.defaultBudget, 1),
      defaultItemValue: readNumber(
        preset.defaultItemValue,
        defaults.defaultItemValue,
        1,
      ),
    };
  }

  return {
    minMultiplier,
    maxMultiplier,
    curveBudgetUsd: readNumber(
      record.curveBudgetUsd,
      fallback.curveBudgetUsd,
      1_000,
      10_000_000,
    ),
    presets,
  };
}

export function sanitizeContent(raw: unknown): CmsContent {
  if (!isRecord(raw)) return createDefaultContent();

  const heroRaw = isRecord(raw.hero) ? raw.hero : {};
  const services = Array.isArray(raw.services)
    ? raw.services
        .map(sanitizeService)
        .filter((item): item is CmsService => Boolean(item))
    : DEFAULT_CONTENT.services.map((item) => ({
        ...item,
        en: { ...item.en, tags: [...item.en.tags], deliverables: [...item.en.deliverables] },
        ar: { ...item.ar, tags: [...item.ar.tags], deliverables: [...item.ar.deliverables] },
      }));
  const testimonials = Array.isArray(raw.testimonials)
    ? raw.testimonials
        .map(sanitizeTestimonial)
        .filter((item): item is CmsTestimonial => Boolean(item))
    : DEFAULT_CONTENT.testimonials.map((item) => ({
        ...item,
        en: { ...item.en },
        ar: { ...item.ar },
      }));

  return {
    version: CMS_VERSION,
    hero: {
      en: sanitizeHeroCopy(heroRaw.en, DEFAULT_CONTENT.hero.en),
      ar: sanitizeHeroCopy(heroRaw.ar, DEFAULT_CONTENT.hero.ar),
    },
    services,
    testimonials,
    roi: sanitizeRoi(raw.roi),
    updatedAt:
      typeof raw.updatedAt === "string" && raw.updatedAt.trim()
        ? raw.updatedAt
        : null,
  };
}

export type ResolvedService = CmsServiceCopy & {
  id: string;
  icon: ServiceIcon;
  accent: string;
};

export function getLocalizedServices(
  content: CmsContent,
  language: CmsLanguage,
): ResolvedService[] {
  return content.services
    .filter((service) => service.enabled)
    .map((service) => ({
      id: service.id,
      icon: service.icon,
      accent: service.accent,
      ...service[language],
    }));
}

export type ResolvedTestimonial = CmsTestimonialCopy & {
  id: string;
  rating: number;
  initials: string;
  accent: string;
  image?: string;
  metric?: { value: string; label: string };
};

export function getLocalizedTestimonials(
  content: CmsContent,
  language: CmsLanguage,
): ResolvedTestimonial[] {
  return content.testimonials
    .filter((testimonial) => testimonial.enabled)
    .map((testimonial) => {
      const copy = testimonial[language];
      const metric =
        copy.metricValue.trim() && copy.metricLabel.trim()
          ? { value: copy.metricValue, label: copy.metricLabel }
          : undefined;

      return {
        id: testimonial.id,
        rating: testimonial.rating,
        initials: testimonial.initials,
        accent: testimonial.accent,
        image: testimonial.image,
        metric,
        ...copy,
      };
    });
}

export function getAverageRating(
  testimonials: Array<{ rating: number }>,
): number {
  if (testimonials.length === 0) return 0;
  const total = testimonials.reduce(
    (sum, testimonial) => sum + testimonial.rating,
    0,
  );
  return Math.round((total / testimonials.length) * 10) / 10;
}
