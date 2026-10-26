import type { CaseStudy, CaseStudyVisual, ServiceIcon, Testimonial } from "@/lib/data";
import { services as seedServices } from "@/lib/data";
import { currencies, currencyOrder, type CurrencyCode } from "@/lib/currency";
import { translations, type ServiceCopy } from "@/lib/i18n/translations";

export const CMS_STORAGE_KEY = "nara-cms-content-v1";
export const CMS_VERSION = 2;

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

export type CmsCaseStudyCopy = {
  title: string;
  niche: string;
  growthMetric: string;
  growthLabel: string;
  description: string;
};

export type CmsCaseStudyStat = {
  value: string;
  label: string;
};

export type CmsCaseStudy = {
  id: string;
  brand: string;
  monogram: string;
  period: string;
  services: string[];
  stats: CmsCaseStudyStat[];
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  challenge: string;
  approach: string[];
  result: string;
  quote: string;
  author: string;
  visual: CaseStudyVisual;
  category: string;
  enabled: boolean;
  en: CmsCaseStudyCopy;
  ar: CmsCaseStudyCopy;
};

export type CmsContent = {
  version: number;
  hero: CmsHeroContent;
  services: CmsService[];
  testimonials: CmsTestimonial[];
  caseStudies: CmsCaseStudy[];
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

export const CASE_STUDY_VISUALS: CaseStudyVisual[] = [
  "beauty",
  "saas",
  "wellness",
  "b2b",
  "home",
  "fashion",
];

export const CASE_STUDY_CATEGORIES = [
  "beauty",
  "saas",
  "wellness",
  "ecommerce",
  "b2b",
  "automotive",
  "realestate",
  "other",
];

const CASE_STUDY_CATEGORY_BY_ID: Record<string, string> = {
  aurel: "beauty",
  northwind: "saas",
  solace: "wellness",
  halden: "ecommerce",
  elan: "ecommerce",
  kinetiq: "b2b",
};

const VISUAL_BY_CATEGORY: Record<string, CaseStudyVisual> = {
  beauty: "beauty",
  saas: "saas",
  wellness: "wellness",
  ecommerce: "fashion",
  b2b: "b2b",
  automotive: "home",
  realestate: "home",
  other: "b2b",
};

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

function pickCaseStudyCopy(item: CaseStudy): CmsCaseStudyCopy {
  return {
    title: item.headline,
    niche: item.industry,
    growthMetric: item.heroMetric,
    growthLabel: item.heroMetricLabel,
    description: item.summary,
  };
}

function buildDefaultCaseStudies(): CmsCaseStudy[] {
  const arById = new Map(
    translations.ar.work.items.map((item) => [item.id, item]),
  );

  return translations.en.work.items.map((enItem) => {
    const arItem = arById.get(enItem.id) ?? enItem;
    const category = CASE_STUDY_CATEGORY_BY_ID[enItem.id] ?? "other";

    return {
      id: enItem.id,
      brand: enItem.brand,
      monogram: enItem.monogram,
      period: enItem.period,
      services: [...enItem.services],
      stats: enItem.stats.map((stat) => ({ ...stat })),
      before: enItem.before,
      after: enItem.after,
      beforeLabel: enItem.beforeLabel,
      afterLabel: enItem.afterLabel,
      challenge: enItem.challenge,
      approach: [...enItem.approach],
      result: enItem.result,
      quote: enItem.quote,
      author: enItem.author,
      visual: enItem.visual,
      category,
      enabled: true,
      en: pickCaseStudyCopy(enItem),
      ar: pickCaseStudyCopy(arItem),
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
  caseStudies: buildDefaultCaseStudies(),
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

function inferCaseStudyCategory(...values: string[]): string {
  const text = values.join(" ").toLowerCase();

  if (
    /(auto|cars?|vehicle|dealership|scooter|motorcycle|motorbike|showroom|سيار|معرض|دراج)/.test(
      text,
    )
  ) {
    return "automotive";
  }

  if (/(real estate|property|properties|عقار|عقاري)/.test(text)) {
    return "realestate";
  }

  if (/(skin|beauty|cosmetic|serum|spa|جمال|بشرة|تجميل)/.test(text)) {
    return "beauty";
  }

  if (/(saas|software|platform|fintech|برمج|منص)/.test(text)) {
    return "saas";
  }

  if (/(b2b|enterprise|wholesale|industrial|أعمال)/.test(text)) {
    return "b2b";
  }

  if (/(wellness|health|fitness|supplement|clinic|صحة|عافية|مكمل|لياقة)/.test(text)) {
    return "wellness";
  }

  if (
    /(fashion|apparel|clothing|ecommerce|e-commerce|shop|store|أزياء|ملابس|متجر|تجارة)/.test(
      text,
    )
  ) {
    return "ecommerce";
  }

  return "other";
}

function readCaseStudyCategory(value: unknown, fallback: string): string {
  return typeof value === "string" && CASE_STUDY_CATEGORIES.includes(value)
    ? value
    : fallback;
}

function readCaseStudyVisual(
  value: unknown,
  category: string,
): CaseStudyVisual {
  if (CASE_STUDY_VISUALS.includes(value as CaseStudyVisual)) {
    return value as CaseStudyVisual;
  }

  return VISUAL_BY_CATEGORY[category] ?? "b2b";
}

function sanitizeCaseStudyCopy(
  raw: unknown,
  fallback: CmsCaseStudyCopy,
): CmsCaseStudyCopy {
  const record = isRecord(raw) ? raw : {};

  return {
    title: readText(record.title, fallback.title),
    niche: readText(record.niche, fallback.niche),
    growthMetric: readText(record.growthMetric, fallback.growthMetric),
    growthLabel: readText(record.growthLabel, fallback.growthLabel),
    description: readText(record.description, fallback.description),
  };
}

function sanitizeCaseStudyStats(
  raw: unknown,
  fallback: CmsCaseStudyStat[],
): CmsCaseStudyStat[] {
  if (!Array.isArray(raw)) return [...fallback];

  const stats = raw
    .filter(isRecord)
    .map((stat) => ({
      value: readText(stat.value, "").trim(),
      label: readText(stat.label, "").trim(),
    }))
    .filter((stat) => stat.value && stat.label)
    .slice(0, 6);

  return stats.length > 0 ? stats : [...fallback];
}

function sanitizeCaseStudy(raw: unknown, index: number): CmsCaseStudy | null {
  if (!isRecord(raw)) return null;

  const fallback =
    DEFAULT_CONTENT.caseStudies.find((item) => item.id === raw.id) ??
    DEFAULT_CONTENT.caseStudies[index % DEFAULT_CONTENT.caseStudies.length];

  const id =
    typeof raw.id === "string" && raw.id.trim()
      ? raw.id.trim()
      : `case-${index + 1}`;

  const en = sanitizeCaseStudyCopy(raw.en, fallback.en);
  const ar = sanitizeCaseStudyCopy(raw.ar, fallback.ar);

  if (!en.title.trim() && !ar.title.trim()) return null;

  const category = readCaseStudyCategory(
    raw.category,
    inferCaseStudyCategory(en.niche, ar.niche, en.title, ar.title),
  );
  const brand =
    readText(raw.brand, fallback.brand).trim() || en.title.trim().slice(0, 24);
  const growthMetric = en.growthMetric.trim() || ar.growthMetric.trim();
  const growthLabel = en.growthLabel.trim() || ar.growthLabel.trim();
  const metricFallback: CmsCaseStudyStat[] =
    growthMetric || growthLabel
      ? [{ value: growthMetric || "—", label: growthLabel || "Growth" }]
      : [];

  return {
    id,
    brand,
    monogram:
      readText(raw.monogram, fallback.monogram).trim().slice(0, 2) ||
      brand.slice(0, 1).toUpperCase(),
    period: readText(raw.period, fallback.period).trim() || "Recent engagement",
    services: readTextArray(raw.services, fallback.services),
    stats: sanitizeCaseStudyStats(raw.stats, metricFallback),
    before: readText(raw.before, fallback.before).trim(),
    after: readText(raw.after, fallback.after).trim() || growthMetric,
    beforeLabel: readText(raw.beforeLabel, fallback.beforeLabel).trim(),
    afterLabel: readText(raw.afterLabel, fallback.afterLabel).trim(),
    challenge:
      readText(raw.challenge, fallback.challenge).trim() || en.description,
    approach: readTextArray(raw.approach, fallback.approach),
    result: readText(raw.result, fallback.result).trim() || en.description,
    quote: readText(raw.quote, fallback.quote).trim(),
    author: readText(raw.author, fallback.author).trim(),
    visual: readCaseStudyVisual(raw.visual, category),
    category,
    enabled: readBoolean(raw.enabled, true),
    en,
    ar,
  };
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
  const caseStudies = Array.isArray(raw.caseStudies)
    ? raw.caseStudies
        .map(sanitizeCaseStudy)
        .filter((item): item is CmsCaseStudy => Boolean(item))
    : DEFAULT_CONTENT.caseStudies.map((item) => ({
        ...item,
        services: [...item.services],
        stats: item.stats.map((stat) => ({ ...stat })),
        approach: [...item.approach],
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
    caseStudies,
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

export type ResolvedCaseStudy = CmsCaseStudyCopy & {
  id: string;
  brand: string;
  monogram: string;
  period: string;
  services: string[];
  stats: CmsCaseStudyStat[];
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  challenge: string;
  approach: string[];
  result: string;
  quote: string;
  author: string;
  visual: CaseStudyVisual;
  category: string;
};

export function getLocalizedCaseStudies(
  content: CmsContent,
  language: CmsLanguage,
): ResolvedCaseStudy[] {
  return content.caseStudies
    .filter((study) => study.enabled)
    .map((study) => ({
      id: study.id,
      brand: study.brand,
      monogram: study.monogram,
      period: study.period,
      services: study.services,
      stats: study.stats,
      before: study.before,
      after: study.after,
      beforeLabel: study.beforeLabel,
      afterLabel: study.afterLabel,
      challenge: study.challenge,
      approach: study.approach,
      result: study.result,
      quote: study.quote,
      author: study.author,
      visual: study.visual,
      category: study.category,
      ...study[language],
    }));
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
