"use client";

import {
  cloneElement,
  isValidElement,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Clapperboard,
  Database,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Globe2,
  LayoutTemplate,
  Layers,
  MessagesSquare,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import type { CaseStudyVisual, ServiceIcon } from "@/lib/data";
import {
  CASE_STUDY_CATEGORIES,
  CASE_STUDY_VISUALS,
  SERVICE_ACCENTS,
  SERVICE_ICON_OPTIONS,
  TESTIMONIAL_ACCENTS,
  type CmsCaseStudy,
  type CmsCaseStudyCopy,
  type CmsContent,
  type CmsCurrencyPreset,
  type CmsHeroContent,
  type CmsLanguage,
  type CmsRoiSettings,
  type CmsService,
  type CmsServiceCopy,
  type CmsTestimonial,
  type CmsTestimonialCopy,
} from "@/lib/cms/content";
import { useCms } from "@/lib/cms/provider";
import {
  currencies,
  currencyOrder,
  getReturnMultiplier,
  type CurrencyCode,
} from "@/lib/currency";
import { cn, getInitials, uid } from "@/lib/utils";
import { Avatar, StarRating } from "@/components/ui/avatar";
import { Button, buttonStyles } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import {
  DashboardCard,
  PageHeader,
  SectionHeader,
} from "@/components/dashboard/ui";

type ContentTab = "hero" | "services" | "testimonials" | "caseStudies" | "roi";

type TabDefinition = {
  id: ContentTab;
  label: string;
  icon: LucideIcon;
};

const tabs: TabDefinition[] = [
  { id: "hero", label: "Hero section", icon: Sparkles },
  { id: "services", label: "Services", icon: Layers },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "caseStudies", label: "Case studies", icon: TrendingUp },
  { id: "roi", label: "ROI model", icon: Wallet },
];

const iconOptions: { value: ServiceIcon; label: string; icon: LucideIcon }[] = [
  { value: "performance", label: "Performance", icon: Target },
  { value: "social", label: "Social", icon: MessagesSquare },
  { value: "search", label: "Search", icon: Search },
  { value: "content", label: "Content", icon: Clapperboard },
  { value: "web", label: "Web & CRO", icon: LayoutTemplate },
];

const accentPalette = Array.from(
  new Set([...Object.values(SERVICE_ACCENTS), ...TESTIMONIAL_ACCENTS]),
);

const CASE_STUDY_VISUAL_LABELS: Record<CaseStudyVisual, string> = {
  beauty: "Beauty & skincare",
  saas: "SaaS dashboard",
  wellness: "Wellness product",
  b2b: "B2B network",
  home: "Home & interiors",
  fashion: "Fashion editorial",
};

const CASE_STUDY_CATEGORY_LABELS: Record<string, string> = {
  beauty: "Beauty",
  saas: "SaaS",
  wellness: "Wellness",
  ecommerce: "Ecommerce",
  b2b: "B2B",
  automotive: "Automotive",
  realestate: "Real estate",
  other: "Other",
};

const CASE_STUDY_VISUAL_BY_CATEGORY: Record<string, CaseStudyVisual> = {
  beauty: "beauty",
  saas: "saas",
  wellness: "wellness",
  ecommerce: "fashion",
  b2b: "b2b",
  automotive: "home",
  realestate: "home",
  other: "b2b",
};

const inputClass =
  "h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.025] px-3.5 text-[0.84rem] text-white placeholder:text-white/38 transition-colors focus:border-electric/45";

const textareaClass =
  "w-full rounded-lg border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-[0.84rem] leading-6 text-white placeholder:text-white/38 transition-colors focus:border-electric/45";

const currencyNames: Record<CurrencyCode, string> = {
  USD: "US Dollar",
  EGP: "Egyptian Pound",
  SAR: "Saudi Riyal",
  AED: "UAE Dirham",
};

type FieldControlProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<FieldControlProps>, {
        id,
        ...(descriptionId ? { "aria-describedby": descriptionId } : {}),
        ...(error ? { "aria-invalid": true } : {}),
      })
    : children;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.75rem] font-medium text-white/55"
      >
        {label}
      </label>
      {control}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.66rem] leading-4 text-white/38">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-[0.7rem] text-red-300/85"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function LanguageToggle({
  value,
  onChange,
}: {
  value: CmsLanguage;
  onChange: (language: CmsLanguage) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Editing language"
      className="inline-flex items-center gap-0.5 rounded-lg border border-white/[0.08] bg-black/15 p-0.5"
    >
      {(["en", "ar"] as const).map((language) => (
        <button
          key={language}
          type="button"
          aria-pressed={value === language}
          onClick={() => onChange(language)}
          className={cn(
            "rounded-md px-2.5 py-1.5 text-[0.72rem] font-medium transition-colors",
            value === language
              ? "bg-white/[0.09] text-white"
              : "text-white/48 hover:text-white/70",
          )}
        >
          {language === "en" ? "English" : "العربية"}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-lg border border-white/[0.07] bg-white/[0.018] px-3.5 py-3 text-left transition hover:border-white/[0.13]"
    >
      <span>
        <span className="block text-[0.78rem] font-medium text-white/78">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[0.68rem] leading-4 text-white/42">
            {description}
          </span>
        )}
      </span>
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors",
          checked
            ? "border-electric/40 bg-electric"
            : "border-white/10 bg-white/[0.07]",
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[1.05rem]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

function StatusBadge({
  tone,
  children,
}: {
  tone: "live" | "hidden" | "featured";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em]",
        tone === "live" &&
          "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300",
        tone === "hidden" &&
          "border-white/10 bg-white/[0.03] text-white/42",
        tone === "featured" &&
          "border-electric/25 bg-electric/[0.09] text-electric-pale",
      )}
    >
      {tone === "live" && <span className="h-1 w-1 rounded-full bg-emerald-400" />}
      {tone === "featured" && <Star className="h-2 w-2 fill-current" />}
      {children}
    </span>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.1] bg-white/[0.012] px-6 py-12 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-white/48">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 text-[0.9rem] font-medium text-white/78">{title}</p>
      <p className="mt-1 max-w-sm text-[0.76rem] leading-5 text-white/42">{description}</p>
      <div className="mt-4">{action}</div>
    </div>
  );
}

function formatSavedAt(value: string | null) {
  if (!value) return "Defaults";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function AdminContent() {
  const {
    content,
    ready,
    update,
    resetContent,
    importContent,
    exportContent,
  } = useCms();
  const { toast } = useToast();
  const [tab, setTab] = useState<ContentTab>("hero");
  const [resetOpen, setResetOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const enabledServices = content.services.filter((service) => service.enabled);
  const enabledTestimonials = content.testimonials.filter(
    (testimonial) => testimonial.enabled,
  );
  const enabledCaseStudies = content.caseStudies.filter(
    (study) => study.enabled,
  );
  const savedLabel = formatSavedAt(content.updatedAt);

  const saveHero = (hero: CmsHeroContent) => {
    update((current) => ({ ...current, hero }));
    toast({
      title: "Hero updated",
      description: "The new headline and subtitle are live on the public site.",
    });
  };

  const saveServices = (services: CmsService[]) => {
    update((current) => ({ ...current, services }));
  };

  const saveTestimonials = (testimonials: CmsTestimonial[]) => {
    update((current) => ({ ...current, testimonials }));
  };

  const saveCaseStudies = (caseStudies: CmsCaseStudy[]) => {
    update((current) => ({ ...current, caseStudies }));
  };

  const saveRoi = (roi: CmsRoiSettings) => {
    update((current) => ({ ...current, roi }));
    toast({
      title: "ROI model updated",
      description: "New multipliers and currency presets are live in the calculator.",
    });
  };

  const handleExport = () => {
    const blob = new Blob([exportContent()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nara-cms-content.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast({
      title: "Content exported",
      description: "Use the JSON file as a backup or import it in another browser.",
    });
  };

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const result = importContent(await file.text());

    if (result.ok) {
      toast({
        title: "Content imported",
        description: `${file.name} is now live for this browser.`,
      });
    } else {
      toast({
        title: "Import failed",
        description: result.error,
        tone: "info",
      });
    }
  };

  const handleReset = () => {
    resetContent();
    setResetOpen(false);
    toast({
      title: "Content reset",
      description: "The original hero, services, testimonials, case studies, and ROI settings are restored.",
    });
  };

  const summary = [
    {
      label: "Live services",
      value: `${enabledServices.length}/${content.services.length}`,
      icon: Layers,
      tone: "border-electric/20 bg-electric/[0.08] text-electric-soft",
      detail: "Shown on the public site",
    },
    {
      label: "Live testimonials",
      value: `${enabledTestimonials.length}/${content.testimonials.length}`,
      icon: Star,
      tone: "border-violet-400/15 bg-violet-400/[0.06] text-violet-300",
      detail: "First live review is featured",
    },
    {
      label: "Live case studies",
      value: `${enabledCaseStudies.length}/${content.caseStudies.length}`,
      icon: TrendingUp,
      tone: "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300",
      detail: "Published in the portfolio",
    },
    {
      label: "Last saved",
      value: savedLabel,
      icon: Database,
      tone: "border-amber-400/15 bg-amber-400/[0.06] text-amber-300",
      detail: !ready
        ? "Loading store"
        : content.updatedAt
          ? "Browser store ready"
          : "Original content",
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Content studio"
        title="Your website, live."
        description="Edit the public marketing site without a redeploy. Hero copy, services, testimonials, case studies, and the ROI model all update in place."
        actions={
          <>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({
                variant: "secondary",
                size: "sm",
                className: "h-9",
              })}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View site
            </a>
            <Button
              variant="secondary"
              size="sm"
              className="h-9"
              onClick={() => importRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" />
              Import
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-9"
              onClick={handleExport}
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-9 text-red-300/75 hover:text-red-200"
              onClick={() => setResetOpen(true)}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <input
              ref={importRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              aria-label="Import CMS content JSON"
              onChange={handleImportFile}
            />
          </>
        }
      />

      <DashboardCard className="border-electric/15 bg-[radial-gradient(ellipse_at_top_right,rgba(0,75,255,0.15),transparent_60%)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-electric/20 bg-electric/[0.09] text-electric-soft">
              <Database className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[0.82rem] font-semibold text-white">
                Browser-local content store
              </p>
              <p className="mt-1 max-w-2xl text-[0.75rem] leading-5 text-white/48">
                Edits save instantly to this browser and appear on the public site
                in every open tab. Use Export to back up the content or move it to
                another browser.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.07] bg-white/[0.02] px-2.5 py-1.5 text-[0.66rem] text-white/48">
              <span
                className={cn(
                  "h-1 w-1 rounded-full",
                  ready ? "bg-emerald-400" : "bg-amber-400",
                )}
              />
              {!ready
                ? "Loading content"
                : content.updatedAt
                  ? `Saved ${savedLabel}`
                  : "Using default content"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1.5 text-[0.66rem] text-emerald-300/85">
              <ShieldCheck className="h-3 w-3" />
              Admin only
            </span>
          </div>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {summary.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-white/[0.075] bg-surface p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[0.7rem] text-white/48">{metric.label}</p>
                <p className="mt-2 truncate font-display text-[1.55rem] font-medium leading-none tracking-[-0.03em] text-white">
                  {metric.value}
                </p>
              </div>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                  metric.tone,
                )}
              >
                <metric.icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-3 border-t border-white/[0.05] pt-2.5 text-[0.65rem] text-white/48">
              {metric.detail}
            </p>
          </div>
        ))}
      </div>

      <div
        role="tablist"
        aria-label="CMS sections"
        className="flex gap-1 overflow-x-auto rounded-xl border border-white/[0.075] bg-white/[0.018] p-1"
      >
        {tabs.map((item) => {
          const Icon = item.icon;
          const count =
            item.id === "services"
              ? content.services.length
              : item.id === "testimonials"
                ? content.testimonials.length
                : item.id === "caseStudies"
                  ? content.caseStudies.length
                  : null;

          return (
            <button
              key={item.id}
              id={`content-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              aria-controls={`content-panel-${item.id}`}
              onClick={() => setTab(item.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[0.76rem] font-medium transition-colors",
                tab === item.id
                  ? "bg-white/[0.085] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : "text-white/48 hover:bg-white/[0.03] hover:text-white/70",
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5",
                  tab === item.id ? "text-electric-soft" : "text-white/42",
                )}
              />
              {item.label}
              {count !== null && (
                <span className="rounded border border-white/[0.08] bg-black/20 px-1.5 py-0.5 text-[0.58rem] tabular-nums text-white/42">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div>
        <div
          id="content-panel-hero"
          role="tabpanel"
          aria-labelledby="content-tab-hero"
          hidden={tab !== "hero"}
        >
          <HeroEditor
            key={JSON.stringify(content.hero)}
            hero={content.hero}
            onSave={saveHero}
          />
        </div>
        <div
          id="content-panel-services"
          role="tabpanel"
          aria-labelledby="content-tab-services"
          hidden={tab !== "services"}
        >
          <ServicesEditor services={content.services} onChange={saveServices} />
        </div>
        <div
          id="content-panel-testimonials"
          role="tabpanel"
          aria-labelledby="content-tab-testimonials"
          hidden={tab !== "testimonials"}
        >
          <TestimonialsEditor
            testimonials={content.testimonials}
            onChange={saveTestimonials}
          />
        </div>
        <div
          id="content-panel-caseStudies"
          role="tabpanel"
          aria-labelledby="content-tab-caseStudies"
          hidden={tab !== "caseStudies"}
        >
          <CaseStudiesEditor
            caseStudies={content.caseStudies}
            onChange={saveCaseStudies}
          />
        </div>
        <div
          id="content-panel-roi"
          role="tabpanel"
          aria-labelledby="content-tab-roi"
          hidden={tab !== "roi"}
        >
          <RoiEditor
            key={JSON.stringify(content.roi)}
            roi={content.roi}
            onSave={saveRoi}
          />
        </div>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        labelledBy="reset-cms-title"
        size="sm"
      >
        <div className="p-6 pr-14">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-red-400/20 bg-red-400/[0.08] text-red-300">
            <RotateCcw className="h-4 w-4" />
          </span>
          <h2
            id="reset-cms-title"
            className="mt-4 font-display text-xl font-medium tracking-tight text-white"
          >
            Reset all website content?
          </h2>
          <p className="mt-2 text-[0.8rem] leading-6 text-white/48">
            This restores the original hero copy, services, testimonials, case
            studies, and ROI settings for every tab in this browser. Export a
            backup first if you want to keep your edits.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setResetOpen(false)}
              className={buttonStyles({ variant: "secondary", size: "md" })}
            >
              Cancel
            </button>
            <Button
              onClick={handleReset}
              className="border-red-400/30 bg-red-500 text-white shadow-[0_8px_30px_-10px_rgba(239,68,68,0.65)] hover:bg-red-400"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset content
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function HeroEditor({
  hero,
  onSave,
}: {
  hero: CmsHeroContent;
  onSave: (hero: CmsHeroContent) => void;
}) {
  const [draft, setDraft] = useState(hero);
  const [dirty, setDirty] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const updateCopy = (
    language: CmsLanguage,
    field: keyof CmsHeroContent["en"],
    value: string,
  ) => {
    setDraft((current) => ({
      ...current,
      [language]: { ...current[language], [field]: value },
    }));
    setDirty(true);
  };

  const incomplete = (["en", "ar"] as const).some((language) =>
    (["titleLead", "titleAccent", "titleEnd", "description"] as const).some(
      (field) => !draft[language][field].trim(),
    ),
  );

  const submit = () => {
    setAttempted(true);
    if (incomplete) return;

    onSave({
      en: {
        titleLead: draft.en.titleLead.trim(),
        titleAccent: draft.en.titleAccent.trim(),
        titleEnd: draft.en.titleEnd.trim(),
        description: draft.en.description.trim(),
      },
      ar: {
        titleLead: draft.ar.titleLead.trim(),
        titleAccent: draft.ar.titleAccent.trim(),
        titleEnd: draft.ar.titleEnd.trim(),
        description: draft.ar.description.trim(),
      },
    });
    setDirty(false);
    setAttempted(false);
  };

  return (
    <DashboardCard>
      <SectionHeader
        title="Hero copy"
        description="The first message visitors see. Edit both languages to keep the bilingual experience consistent."
        action={
          <div className="flex items-center gap-2">
            {dirty ? (
              <span className="hidden text-[0.66rem] font-medium text-amber-300/80 sm:inline">
                Unsaved changes
              </span>
            ) : (
              <span className="hidden items-center gap-1.5 text-[0.66rem] text-emerald-300/80 sm:flex">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Published
              </span>
            )}
            <Button size="sm" onClick={submit} disabled={!dirty}>
              <Save className="h-3.5 w-3.5" />
              Save hero
            </Button>
          </div>
        }
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {(["en", "ar"] as const).map((language) => (
          <div
            key={language}
            dir={language === "ar" ? "rtl" : "ltr"}
            className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-white/78">
                  <Globe2 className="h-3.5 w-3.5 text-electric-soft/70" />
                  {language === "en" ? "English" : "Arabic"}
                </p>
                <p className="mt-0.5 text-[0.66rem] text-white/38">
                  {language === "en" ? "Primary site language" : "RTL public experience"}
                </p>
              </div>
              <span className="rounded border border-white/[0.07] bg-black/15 px-1.5 py-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-white/38">
                {language === "en" ? "EN" : "AR"}
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              <Field label="Title line 1">
                <input
                  value={draft[language].titleLead}
                  onChange={(event) =>
                    updateCopy(language, "titleLead", event.target.value)
                  }
                  placeholder="We scale brands"
                  className={inputClass}
                />
              </Field>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field label="Accent phrase">
                  <input
                    value={draft[language].titleAccent}
                    onChange={(event) =>
                      updateCopy(language, "titleAccent", event.target.value)
                    }
                    placeholder="beyond"
                    className={inputClass}
                  />
                </Field>
                <Field label="Title ending">
                  <input
                    value={draft[language].titleEnd}
                    onChange={(event) =>
                      updateCopy(language, "titleEnd", event.target.value)
                    }
                    placeholder="boundaries."
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field
                label="Hero subtitle"
                hint="Shown under the headline on the public homepage."
              >
                <textarea
                  rows={4}
                  value={draft[language].description}
                  onChange={(event) =>
                    updateCopy(language, "description", event.target.value)
                  }
                  className={textareaClass}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>

      {attempted && incomplete && (
        <p className="mt-3 text-[0.72rem] text-red-300/85" role="alert">
          Add a title, accent phrase, ending, and subtitle in both languages before
          publishing.
        </p>
      )}

      <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#070A12] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.63rem] font-semibold uppercase tracking-[0.16em] text-white/42">
            Public preview
          </p>
          <span className="text-[0.6rem] text-white/32">Live from your draft</span>
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {(["en", "ar"] as const).map((language) => (
            <div
              key={language}
              dir={language === "ar" ? "rtl" : "ltr"}
              className="rounded-lg border border-white/[0.06] bg-[radial-gradient(ellipse_at_top_right,rgba(0,75,255,0.14),transparent_65%)] p-4"
            >
              <p className="font-display text-[1.25rem] font-medium leading-tight tracking-[-0.03em] text-white">
                {draft[language].titleLead || "Title line 1"}{" "}
                <span className="text-gradient-blue">
                  {draft[language].titleAccent || "accent"}
                </span>{" "}
                <span className="text-gradient-blue">
                  {draft[language].titleEnd || "ending."}
                </span>
              </p>
              <p className="mt-2 line-clamp-3 text-[0.72rem] leading-5 text-white/45">
                {draft[language].description || "Hero subtitle preview."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}

type ServiceCopyDraft = {
  eyebrow: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  tags: string;
  deliverables: string;
};

type ServiceDraft = {
  id: string | null;
  icon: ServiceIcon;
  accent: string;
  enabled: boolean;
  en: ServiceCopyDraft;
  ar: ServiceCopyDraft;
};

function emptyServiceCopy(): ServiceCopyDraft {
  return {
    eyebrow: "",
    title: "",
    description: "",
    metric: "",
    metricLabel: "",
    tags: "",
    deliverables: "",
  };
}

function blankServiceDraft(): ServiceDraft {
  return {
    id: null,
    icon: "performance",
    accent: SERVICE_ACCENTS.performance,
    enabled: true,
    en: emptyServiceCopy(),
    ar: emptyServiceCopy(),
  };
}

function serviceToDraft(service: CmsService): ServiceDraft {
  const copyToDraft = (copy: CmsServiceCopy): ServiceCopyDraft => ({
    eyebrow: copy.eyebrow,
    title: copy.title,
    description: copy.description,
    metric: copy.metric,
    metricLabel: copy.metricLabel,
    tags: copy.tags.join(", "),
    deliverables: copy.deliverables.join("\n"),
  });

  return {
    id: service.id,
    icon: service.icon,
    accent: service.accent,
    enabled: service.enabled,
    en: copyToDraft(service.en),
    ar: copyToDraft(service.ar),
  };
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function serviceFromDraft(draft: ServiceDraft): CmsService {
  const cleanCopy = (copy: ServiceCopyDraft): CmsServiceCopy => ({
    eyebrow: copy.eyebrow.trim(),
    title: copy.title.trim(),
    description: copy.description.trim(),
    metric: copy.metric.trim(),
    metricLabel: copy.metricLabel.trim(),
    tags: splitTags(copy.tags),
    deliverables: splitLines(copy.deliverables),
  });

  return {
    id: draft.id ?? uid("svc"),
    icon: draft.icon,
    accent: draft.accent,
    enabled: draft.enabled,
    en: cleanCopy(draft.en),
    ar: cleanCopy(draft.ar),
  };
}

function ServicesEditor({
  services,
  onChange,
}: {
  services: CmsService[];
  onChange: (services: CmsService[]) => void;
}) {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ServiceDraft>(blankServiceDraft);
  const [language, setLanguage] = useState<CmsLanguage>("en");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setDraft(blankServiceDraft());
    setLanguage("en");
    setErrors({});
    setConfirmDelete(false);
    setModalOpen(true);
  };

  const openEdit = (service: CmsService) => {
    setEditingId(service.id);
    setDraft(serviceToDraft(service));
    setLanguage("en");
    setErrors({});
    setConfirmDelete(false);
    setModalOpen(true);
  };

  const updateCopy = (
    field: keyof ServiceCopyDraft,
    value: string,
  ) => {
    setDraft((current) => ({
      ...current,
      [language]: { ...current[language], [field]: value },
    }));
    setErrors((current) => {
      const key = `${language}.${field}`;
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    for (const code of ["en", "ar"] as const) {
      if (!draft[code].title.trim()) nextErrors[`${code}.title`] = "Enter a title.";
      if (!draft[code].description.trim()) {
        nextErrors[`${code}.description`] = "Enter a description.";
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const service = serviceFromDraft(draft);
    const next = editingId
      ? services.map((item) => (item.id === editingId ? service : item))
      : [...services, service];

    onChange(next);
    setModalOpen(false);
    toast({
      title: editingId ? "Service updated" : "Service added",
      description: `${service.en.title} is now available in the content studio.`,
    });
  };

  const remove = () => {
    if (!editingId) return;
    const removed = services.find((service) => service.id === editingId);

    onChange(services.filter((service) => service.id !== editingId));
    setModalOpen(false);
    setConfirmDelete(false);
    setEditingId(null);
    toast({
      title: "Service removed",
      description: `${removed?.en.title ?? "The service"} has been removed from the public site.`,
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= services.length) return;
    const next = [...services];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const toggle = (id: string) => {
    onChange(
      services.map((service) =>
        service.id === id ? { ...service, enabled: !service.enabled } : service,
      ),
    );
  };

  return (
    <DashboardCard>
      <SectionHeader
        title="Services"
        description="Add new offers, rewrite descriptions, control the order, and hide anything that is no longer active."
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-3.5 w-3.5" />
            Add service
          </Button>
        }
      />

      {services.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={Layers}
            title="No services yet"
            description="Add the first service to populate the public services grid."
            action={
              <Button size="sm" onClick={openAdd}>
                <Plus className="h-3.5 w-3.5" />
                Add service
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {services.map((service, index) => {
            const iconOption =
              iconOptions.find((option) => option.value === service.icon) ??
              iconOptions[0];
            const Icon = iconOption.icon;

            return (
              <div
                key={service.id}
                className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 transition-colors hover:border-white/[0.12]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                      style={{
                        color: service.accent,
                        borderColor: `${service.accent}40`,
                        backgroundColor: `${service.accent}14`,
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[0.84rem] font-semibold text-white/85">
                          {service.en.title}
                        </p>
                        <StatusBadge tone={service.enabled ? "live" : "hidden"}>
                          {service.enabled ? "Live" : "Hidden"}
                        </StatusBadge>
                      </div>
                      <p
                        className="mt-0.5 text-[0.7rem] text-white/38"
                        dir="rtl"
                      >
                        {service.ar.title}
                      </p>
                      <p className="mt-2 max-w-2xl text-[0.74rem] leading-5 text-white/45">
                        {service.en.description}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.64rem] text-white/38">
                        <span>{service.en.metric || "No metric"}</span>
                        <span className="h-2.5 w-px bg-white/10" />
                        <span>{service.en.tags.length} tags</span>
                        <span className="h-2.5 w-px bg-white/10" />
                        <span>{service.en.deliverables.length} deliverables</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-0.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${service.en.title} up`}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/38 transition hover:bg-white/[0.05] hover:text-white disabled:pointer-events-none disabled:opacity-25"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === services.length - 1}
                      aria-label={`Move ${service.en.title} down`}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/38 transition hover:bg-white/[0.05] hover:text-white disabled:pointer-events-none disabled:opacity-25"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(service.id)}
                      aria-label={
                        service.enabled
                          ? `Hide ${service.en.title}`
                          : `Publish ${service.en.title}`
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/38 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      {service.enabled ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(service)}
                      aria-label={`Edit ${service.en.title}`}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/38 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        labelledBy="service-editor-title"
        size="lg"
      >
        <form onSubmit={submit} noValidate>
          <div className="border-b border-white/[0.08] p-5 pr-14 sm:p-6 sm:pr-16">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-electric-pale/55">
              {editingId ? "Edit service" : "New service"}
            </p>
            <h2
              id="service-editor-title"
              className="mt-1.5 font-display text-2xl font-medium tracking-tight text-white"
            >
              {editingId ? draft.en.title || "Service details" : "Add a service"}
            </h2>
            <p className="mt-1.5 text-[0.8rem] text-white/48">
              Update both languages so the public site stays consistent.
            </p>
          </div>

          <div className="max-h-[66vh] space-y-5 overflow-y-auto p-5 sm:p-6">
            <div>
              <p className="mb-2 text-[0.75rem] font-medium text-white/55">
                Card icon
              </p>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map((option) => {
                  const Icon = option.icon;
                  const active = draft.icon === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          icon: option.value,
                          accent:
                            current.accent === SERVICE_ACCENTS[current.icon]
                              ? SERVICE_ACCENTS[option.value]
                              : current.accent,
                        }))
                      }
                      aria-pressed={active}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[0.72rem] font-medium transition",
                        active
                          ? "border-electric/35 bg-electric/[0.09] text-white"
                          : "border-white/[0.07] bg-white/[0.018] text-white/48 hover:border-white/[0.15] hover:text-white/70",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="mb-2 text-[0.75rem] font-medium text-white/55">
                  Accent color
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {accentPalette.map((accent) => (
                    <button
                      key={accent}
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({ ...current, accent }))
                      }
                      aria-label={`Use accent ${accent}`}
                      aria-pressed={draft.accent === accent}
                      className={cn(
                        "h-6 w-6 rounded-full border transition-transform hover:scale-110",
                        draft.accent === accent
                          ? "border-white ring-2 ring-white/20"
                          : "border-white/15",
                      )}
                      style={{ backgroundColor: accent }}
                    />
                  ))}
                  <label className="inline-flex h-6 cursor-pointer items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] px-2 text-[0.62rem] text-white/48">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-white/15"
                      style={{ backgroundColor: draft.accent }}
                    />
                    Custom
                    <input
                      type="color"
                      value={draft.accent}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          accent: event.target.value,
                        }))
                      }
                      className="sr-only"
                      aria-label="Custom accent color"
                    />
                  </label>
                </div>
              </div>
              <div className="sm:w-52">
                <Toggle
                  checked={draft.enabled}
                  onChange={(enabled) =>
                    setDraft((current) => ({ ...current, enabled }))
                  }
                  label="Visible on site"
                  description={
                    draft.enabled
                      ? "Published in the services grid."
                      : "Hidden until you publish it."
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
              <p className="text-[0.72rem] font-medium text-white/55">
                Service copy
              </p>
              <LanguageToggle value={language} onChange={setLanguage} />
            </div>

            <div
              dir={language === "ar" ? "rtl" : "ltr"}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Eyebrow"
                  hint="e.g. 01 / Acquisition"
                  error={errors[`${language}.eyebrow`]}
                >
                  <input
                    value={draft[language].eyebrow}
                    onChange={(event) =>
                      updateCopy("eyebrow", event.target.value)
                    }
                    placeholder="01 / Acquisition"
                    className={inputClass}
                  />
                </Field>
                <Field
                  label="Title"
                  error={errors[`${language}.title`]}
                >
                  <input
                    value={draft[language].title}
                    onChange={(event) =>
                      updateCopy("title", event.target.value)
                    }
                    placeholder="Media buying & performance"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field
                label="Description"
                error={errors[`${language}.description`]}
              >
                <textarea
                  rows={3}
                  value={draft[language].description}
                  onChange={(event) =>
                    updateCopy("description", event.target.value)
                  }
                  className={textareaClass}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Result metric" hint="e.g. 4.8x or +72%">
                  <input
                    value={draft[language].metric}
                    onChange={(event) =>
                      updateCopy("metric", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Metric label" hint="e.g. avg. blended ROAS">
                  <input
                    value={draft[language].metricLabel}
                    onChange={(event) =>
                      updateCopy("metricLabel", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field
                label="Tags"
                hint="Comma-separated. e.g. Meta, Google, TikTok"
              >
                <input
                  value={draft[language].tags}
                  onChange={(event) => updateCopy("tags", event.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field
                label="Deliverables"
                hint="One deliverable per line. These appear in the service modal."
              >
                <textarea
                  rows={4}
                  value={draft[language].deliverables}
                  onChange={(event) =>
                    updateCopy("deliverables", event.target.value)
                  }
                  className={textareaClass}
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            {editingId ? (
              confirmDelete ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-red-400/20 bg-red-400/[0.05] px-3 py-2 text-[0.7rem] text-red-200/75">
                  <span>Remove this service?</span>
                  <button
                    type="button"
                    onClick={remove}
                    className="font-semibold text-red-300 underline decoration-red-300/40 underline-offset-2 transition hover:text-red-200"
                  >
                    Yes, remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-white/55 transition hover:text-white"
                  >
                    Keep
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1.5 self-start rounded-md px-1 py-1 text-[0.72rem] font-medium text-red-300/65 transition hover:text-red-200 sm:self-auto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete service
                </button>
              )
            ) : (
              <span />
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className={buttonStyles({ variant: "secondary", size: "md" })}
              >
                Cancel
              </button>
              <button type="submit" className={buttonStyles({ size: "md" })}>
                {editingId ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Save service
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    Add service
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </DashboardCard>
  );
}

type TestimonialCopyDraft = {
  quote: string;
  name: string;
  role: string;
  company: string;
  metricValue: string;
  metricLabel: string;
};

type TestimonialDraft = {
  id: string | null;
  rating: number;
  initials: string;
  accent: string;
  enabled: boolean;
  en: TestimonialCopyDraft;
  ar: TestimonialCopyDraft;
};

function emptyTestimonialCopy(): TestimonialCopyDraft {
  return {
    quote: "",
    name: "",
    role: "",
    company: "",
    metricValue: "",
    metricLabel: "",
  };
}

function blankTestimonialDraft(): TestimonialDraft {
  return {
    id: null,
    rating: 5,
    initials: "",
    accent: TESTIMONIAL_ACCENTS[0],
    enabled: true,
    en: emptyTestimonialCopy(),
    ar: emptyTestimonialCopy(),
  };
}

function testimonialToDraft(testimonial: CmsTestimonial): TestimonialDraft {
  const copyToDraft = (copy: CmsTestimonialCopy): TestimonialCopyDraft => ({
    quote: copy.quote,
    name: copy.name,
    role: copy.role,
    company: copy.company,
    metricValue: copy.metricValue,
    metricLabel: copy.metricLabel,
  });

  return {
    id: testimonial.id,
    rating: testimonial.rating,
    initials: testimonial.initials,
    accent: testimonial.accent,
    enabled: testimonial.enabled,
    en: copyToDraft(testimonial.en),
    ar: copyToDraft(testimonial.ar),
  };
}

function testimonialFromDraft(
  draft: TestimonialDraft,
  image?: string,
): CmsTestimonial {
  const cleanCopy = (copy: TestimonialCopyDraft): CmsTestimonialCopy => ({
    quote: copy.quote.trim(),
    name: copy.name.trim(),
    role: copy.role.trim(),
    company: copy.company.trim(),
    metricValue: copy.metricValue.trim(),
    metricLabel: copy.metricLabel.trim(),
  });

  return {
    id: draft.id ?? uid("testimonial"),
    rating: draft.rating,
    initials:
      draft.initials.trim() || getInitials(draft.en.name) || "NA",
    accent: draft.accent,
    image,
    enabled: draft.enabled,
    en: cleanCopy(draft.en),
    ar: cleanCopy(draft.ar),
  };
}

function TestimonialsEditor({
  testimonials,
  onChange,
}: {
  testimonials: CmsTestimonial[];
  onChange: (testimonials: CmsTestimonial[]) => void;
}) {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TestimonialDraft>(blankTestimonialDraft);
  const [language, setLanguage] = useState<CmsLanguage>("en");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const editing = editingId
    ? testimonials.find((testimonial) => testimonial.id === editingId) ?? null
    : null;
  const featuredId = testimonials.find((testimonial) => testimonial.enabled)?.id;

  const openAdd = () => {
    setEditingId(null);
    setDraft(blankTestimonialDraft());
    setLanguage("en");
    setErrors({});
    setConfirmDelete(false);
    setModalOpen(true);
  };

  const openEdit = (testimonial: CmsTestimonial) => {
    setEditingId(testimonial.id);
    setDraft(testimonialToDraft(testimonial));
    setLanguage("en");
    setErrors({});
    setConfirmDelete(false);
    setModalOpen(true);
  };

  const updateCopy = (
    field: keyof TestimonialCopyDraft,
    value: string,
  ) => {
    setDraft((current) => ({
      ...current,
      [language]: { ...current[language], [field]: value },
    }));
    setErrors((current) => {
      const key = `${language}.${field}`;
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    for (const code of ["en", "ar"] as const) {
      if (!draft[code].name.trim()) nextErrors[`${code}.name`] = "Enter a client name.";
      if (!draft[code].quote.trim()) nextErrors[`${code}.quote`] = "Enter the feedback text.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const testimonial = testimonialFromDraft(draft, editing?.image);
    const next = editingId
      ? testimonials.map((item) =>
          item.id === editingId ? testimonial : item,
        )
      : [...testimonials, testimonial];

    onChange(next);
    setModalOpen(false);
    toast({
      title: editingId ? "Testimonial updated" : "Testimonial added",
      description: `${testimonial.en.name} is now in the review rotation.`,
    });
  };

  const remove = () => {
    if (!editingId) return;
    const removed = testimonials.find(
      (testimonial) => testimonial.id === editingId,
    );

    onChange(testimonials.filter((testimonial) => testimonial.id !== editingId));
    setModalOpen(false);
    setConfirmDelete(false);
    setEditingId(null);
    toast({
      title: "Testimonial removed",
      description: `${removed?.en.name ?? "The review"} has been removed from the public site.`,
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= testimonials.length) return;
    const next = [...testimonials];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const toggle = (id: string) => {
    onChange(
      testimonials.map((testimonial) =>
        testimonial.id === id
          ? { ...testimonial, enabled: !testimonial.enabled }
          : testimonial,
      ),
    );
  };

  return (
    <DashboardCard>
      <SectionHeader
        title="Client testimonials"
        description="Add Arab client reviews, set a star rating, and choose the order. The first live review is featured."
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-3.5 w-3.5" />
            Add testimonial
          </Button>
        }
      />

      {testimonials.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={Star}
            title="No testimonials yet"
            description="Add the first client review to populate the public testimonial section."
            action={
              <Button size="sm" onClick={openAdd}>
                <Plus className="h-3.5 w-3.5" />
                Add testimonial
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 transition-colors hover:border-white/[0.12]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <Avatar
                    initials={testimonial.initials}
                    name={testimonial.en.name}
                    imageSrc={testimonial.image}
                    accentHex={testimonial.accent}
                    size="md"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[0.84rem] font-semibold text-white/85">
                        {testimonial.en.name}
                      </p>
                      <StatusBadge
                        tone={testimonial.enabled ? "live" : "hidden"}
                      >
                        {testimonial.enabled ? "Live" : "Hidden"}
                      </StatusBadge>
                      {testimonial.id === featuredId && (
                        <StatusBadge tone="featured">Featured</StatusBadge>
                      )}
                    </div>
                    <p className="mt-0.5 text-[0.7rem] text-white/38" dir="rtl">
                      {testimonial.ar.name}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[0.66rem] text-white/42">
                      <StarRating rating={testimonial.rating} size={11} />
                      <span>{testimonial.rating}/5</span>
                      <span className="h-2.5 w-px bg-white/10" />
                      <span>{testimonial.en.company || testimonial.en.role}</span>
                    </div>
                    <p className="mt-2 max-w-2xl text-[0.74rem] leading-5 text-white/45">
                      &ldquo;{testimonial.en.quote}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-0.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${testimonial.en.name} up`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-white/38 transition hover:bg-white/[0.05] hover:text-white disabled:pointer-events-none disabled:opacity-25"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === testimonials.length - 1}
                    aria-label={`Move ${testimonial.en.name} down`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-white/38 transition hover:bg-white/[0.05] hover:text-white disabled:pointer-events-none disabled:opacity-25"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggle(testimonial.id)}
                    aria-label={
                      testimonial.enabled
                        ? `Hide ${testimonial.en.name}`
                        : `Publish ${testimonial.en.name}`
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-md text-white/38 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    {testimonial.enabled ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(testimonial)}
                    aria-label={`Edit ${testimonial.en.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-white/38 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        labelledBy="testimonial-editor-title"
        size="lg"
      >
        <form onSubmit={submit} noValidate>
          <div className="border-b border-white/[0.08] p-5 pr-14 sm:p-6 sm:pr-16">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-electric-pale/55">
              {editingId ? "Edit testimonial" : "New testimonial"}
            </p>
            <h2
              id="testimonial-editor-title"
              className="mt-1.5 font-display text-2xl font-medium tracking-tight text-white"
            >
              {editingId ? draft.en.name || "Client review" : "Add a client review"}
            </h2>
            <p className="mt-1.5 text-[0.8rem] text-white/48">
              Ratings and both languages appear on the public site.
            </p>
          </div>

          <div className="max-h-[66vh] space-y-5 overflow-y-auto p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.018] p-3">
                <Avatar
                  initials={draft.initials || getInitials(draft.en.name) || "NA"}
                  name={draft.en.name || "New testimonial"}
                  imageSrc={editing?.image}
                  accentHex={draft.accent}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="truncate text-[0.78rem] font-semibold text-white/78">
                    {draft.en.name || "New client"}
                  </p>
                  <p className="mt-0.5 truncate text-[0.66rem] text-white/42">
                    {draft.en.company || draft.en.role || "Client details"}
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-[0.75rem] font-medium text-white/55">
                  Star rating
                </p>
                <div className="flex items-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.018] px-2 py-1.5">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({ ...current, rating }))
                      }
                      aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
                      aria-pressed={draft.rating === rating}
                      className="flex h-7 w-7 items-center justify-center rounded transition hover:bg-white/[0.05]"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          rating <= draft.rating
                            ? "fill-[#FFC857] text-[#FFC857]"
                            : "text-white/25",
                        )}
                      />
                    </button>
                  ))}
                  <span className="ms-1 text-[0.65rem] tabular-nums text-white/42">
                    {draft.rating}/5
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Initials"
                hint="Leave blank to generate from the English name."
              >
                <input
                  value={draft.initials}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      initials: event.target.value,
                    }))
                  }
                  maxLength={3}
                  placeholder={getInitials(draft.en.name) || "SA"}
                  className={inputClass}
                />
              </Field>
              <div>
                <p className="mb-1.5 text-[0.75rem] font-medium text-white/55">
                  Avatar accent
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {TESTIMONIAL_ACCENTS.map((accent) => (
                    <button
                      key={accent}
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({ ...current, accent }))
                      }
                      aria-label={`Use accent ${accent}`}
                      aria-pressed={draft.accent === accent}
                      className={cn(
                        "h-6 w-6 rounded-full border transition-transform hover:scale-110",
                        draft.accent === accent
                          ? "border-white ring-2 ring-white/20"
                          : "border-white/15",
                      )}
                      style={{ backgroundColor: accent }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Toggle
              checked={draft.enabled}
              onChange={(enabled) =>
                setDraft((current) => ({ ...current, enabled }))
              }
              label="Visible on site"
              description={
                draft.enabled
                  ? "Published in the testimonial section."
                  : "Hidden from the public site."
              }
            />

            <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
              <p className="text-[0.72rem] font-medium text-white/55">
                Review copy
              </p>
              <LanguageToggle value={language} onChange={setLanguage} />
            </div>

            <div
              dir={language === "ar" ? "rtl" : "ltr"}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Client name"
                  error={errors[`${language}.name`]}
                >
                  <input
                    value={draft[language].name}
                    onChange={(event) =>
                      updateCopy("name", event.target.value)
                    }
                    placeholder="Sara Al-Otaibi"
                    className={inputClass}
                  />
                </Field>
                <Field label="Role">
                  <input
                    value={draft[language].role}
                    onChange={(event) =>
                      updateCopy("role", event.target.value)
                    }
                    placeholder="Growth Director · Fintech"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Company">
                <input
                  value={draft[language].company}
                  onChange={(event) =>
                    updateCopy("company", event.target.value)
                  }
                  placeholder="NUWA · Saudi Arabia"
                  className={inputClass}
                />
              </Field>

              <Field
                label="Feedback text"
                error={errors[`${language}.quote`]}
              >
                <textarea
                  rows={4}
                  value={draft[language].quote}
                  onChange={(event) =>
                    updateCopy("quote", event.target.value)
                  }
                  className={textareaClass}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Result value" hint="Optional. e.g. 4.4x">
                  <input
                    value={draft[language].metricValue}
                    onChange={(event) =>
                      updateCopy("metricValue", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Result label" hint="Optional. e.g. ROAS">
                  <input
                    value={draft[language].metricLabel}
                    onChange={(event) =>
                      updateCopy("metricLabel", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            {editingId ? (
              confirmDelete ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-red-400/20 bg-red-400/[0.05] px-3 py-2 text-[0.7rem] text-red-200/75">
                  <span>Remove this testimonial?</span>
                  <button
                    type="button"
                    onClick={remove}
                    className="font-semibold text-red-300 underline decoration-red-300/40 underline-offset-2 transition hover:text-red-200"
                  >
                    Yes, remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-white/55 transition hover:text-white"
                  >
                    Keep
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1.5 self-start rounded-md px-1 py-1 text-[0.72rem] font-medium text-red-300/65 transition hover:text-red-200 sm:self-auto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete testimonial
                </button>
              )
            ) : (
              <span />
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className={buttonStyles({ variant: "secondary", size: "md" })}
              >
                Cancel
              </button>
              <button type="submit" className={buttonStyles({ size: "md" })}>
                {editingId ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Save testimonial
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    Add testimonial
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </DashboardCard>
  );
}

type CaseStudyCopyDraft = {
  title: string;
  niche: string;
  growthMetric: string;
  growthLabel: string;
  description: string;
};

type CaseStudyDraft = {
  id: string | null;
  brand: string;
  monogram: string;
  period: string;
  category: string;
  visual: CaseStudyVisual;
  enabled: boolean;
  services: string;
  stats: string;
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  challenge: string;
  approach: string;
  result: string;
  quote: string;
  author: string;
  en: CaseStudyCopyDraft;
  ar: CaseStudyCopyDraft;
};

function emptyCaseStudyCopy(): CaseStudyCopyDraft {
  return {
    title: "",
    niche: "",
    growthMetric: "",
    growthLabel: "",
    description: "",
  };
}

function blankCaseStudyDraft(): CaseStudyDraft {
  return {
    id: null,
    brand: "",
    monogram: "",
    period: "",
    category: "ecommerce",
    visual: "fashion",
    enabled: true,
    services: "",
    stats: "",
    before: "",
    after: "",
    beforeLabel: "Before",
    afterLabel: "After",
    challenge: "",
    approach: "",
    result: "",
    quote: "",
    author: "",
    en: emptyCaseStudyCopy(),
    ar: emptyCaseStudyCopy(),
  };
}

function caseStudyToDraft(study: CmsCaseStudy): CaseStudyDraft {
  const copyToDraft = (copy: CmsCaseStudyCopy): CaseStudyCopyDraft => ({
    title: copy.title,
    niche: copy.niche,
    growthMetric: copy.growthMetric,
    growthLabel: copy.growthLabel,
    description: copy.description,
  });

  return {
    id: study.id,
    brand: study.brand,
    monogram: study.monogram,
    period: study.period,
    category: study.category,
    visual: study.visual,
    enabled: study.enabled,
    services: study.services.join(", "),
    stats: study.stats
      .map((stat) => `${stat.value} | ${stat.label}`)
      .join("\n"),
    before: study.before,
    after: study.after,
    beforeLabel: study.beforeLabel,
    afterLabel: study.afterLabel,
    challenge: study.challenge,
    approach: study.approach.join("\n"),
    result: study.result,
    quote: study.quote,
    author: study.author,
    en: copyToDraft(study.en),
    ar: copyToDraft(study.ar),
  };
}

function parseCaseStudyStats(value: string) {
  return splitLines(value)
    .map((line) => {
      const [rawValue, ...labelParts] = line.split("|");
      return {
        value: rawValue.trim(),
        label: labelParts.join("|").trim() || "Result",
      };
    })
    .filter((stat) => stat.value)
    .slice(0, 6);
}

function caseStudyFromDraft(draft: CaseStudyDraft): CmsCaseStudy {
  const cleanCopy = (copy: CaseStudyCopyDraft): CmsCaseStudyCopy => ({
    title: copy.title.trim(),
    niche: copy.niche.trim(),
    growthMetric: copy.growthMetric.trim(),
    growthLabel: copy.growthLabel.trim(),
    description: copy.description.trim(),
  });

  const en = cleanCopy(draft.en);
  const ar = cleanCopy(draft.ar);
  const brand = draft.brand.trim() || en.title.slice(0, 24);
  const growthMetric = en.growthMetric || ar.growthMetric;
  const growthLabel = en.growthLabel || ar.growthLabel;
  const parsedStats = parseCaseStudyStats(draft.stats);
  const stats =
    parsedStats.length > 0
      ? parsedStats
      : growthMetric
        ? [{ value: growthMetric, label: growthLabel || "Growth" }]
        : [];

  return {
    id: draft.id ?? uid("case"),
    brand,
    monogram:
      draft.monogram.trim().slice(0, 2) ||
      brand.slice(0, 1).toUpperCase() ||
      "N",
    period: draft.period.trim() || "Recent engagement",
    services: splitTags(draft.services),
    stats,
    before: draft.before.trim(),
    after: draft.after.trim() || growthMetric,
    beforeLabel: draft.beforeLabel.trim() || "Before",
    afterLabel: draft.afterLabel.trim() || "After",
    challenge: draft.challenge.trim() || en.description,
    approach: splitLines(draft.approach),
    result: draft.result.trim() || en.description,
    quote: draft.quote.trim(),
    author: draft.author.trim(),
    visual: draft.visual,
    category: draft.category,
    enabled: draft.enabled,
    en,
    ar,
  };
}

function CaseStudiesEditor({
  caseStudies,
  onChange,
}: {
  caseStudies: CmsCaseStudy[];
  onChange: (caseStudies: CmsCaseStudy[]) => void;
}) {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CaseStudyDraft>(blankCaseStudyDraft);
  const [language, setLanguage] = useState<CmsLanguage>("en");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setDraft(blankCaseStudyDraft());
    setLanguage("en");
    setErrors({});
    setConfirmDelete(false);
    setModalOpen(true);
  };

  const openEdit = (study: CmsCaseStudy) => {
    setEditingId(study.id);
    setDraft(caseStudyToDraft(study));
    setLanguage("en");
    setErrors({});
    setConfirmDelete(false);
    setModalOpen(true);
  };

  const updateCopy = (field: keyof CaseStudyCopyDraft, value: string) => {
    setDraft((current) => ({
      ...current,
      [language]: { ...current[language], [field]: value },
    }));
    setErrors((current) => {
      const key = `${language}.${field}`;
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    for (const code of ["en", "ar"] as const) {
      if (!draft[code].title.trim()) {
        nextErrors[`${code}.title`] = "Enter a case study title.";
      }
      if (!draft[code].niche.trim()) {
        nextErrors[`${code}.niche`] = "Enter the client niche.";
      }
      if (!draft[code].growthMetric.trim()) {
        nextErrors[`${code}.growthMetric`] = "Enter a growth metric.";
      }
      if (!draft[code].description.trim()) {
        nextErrors[`${code}.description`] = "Enter a description.";
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const study = caseStudyFromDraft(draft);
    const next = editingId
      ? caseStudies.map((item) => (item.id === editingId ? study : item))
      : [...caseStudies, study];

    onChange(next);
    setModalOpen(false);
    toast({
      title: editingId ? "Case study updated" : "Case study added",
      description: `${study.brand} is ${
        editingId ? "updated" : "live"
      } in the public portfolio.`,
    });
  };

  const remove = () => {
    if (!editingId) return;
    const removed = caseStudies.find((study) => study.id === editingId);

    onChange(caseStudies.filter((study) => study.id !== editingId));
    setModalOpen(false);
    setConfirmDelete(false);
    setEditingId(null);
    toast({
      title: "Case study removed",
      description: `${removed?.brand ?? "The story"} has been removed from the public portfolio.`,
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= caseStudies.length) return;
    const next = [...caseStudies];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const toggle = (id: string) => {
    onChange(
      caseStudies.map((study) =>
        study.id === id ? { ...study, enabled: !study.enabled } : study,
      ),
    );
  };

  return (
    <DashboardCard>
      <SectionHeader
        title="Case studies"
        description="Publish proof from the portfolio. Add the headline, niche, growth metric, and story — the public work section updates instantly."
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-3.5 w-3.5" />
            Add case study
          </Button>
        }
      />

      {caseStudies.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={TrendingUp}
            title="No case studies yet"
            description="Add the first story to populate the public portfolio section."
            action={
              <Button size="sm" onClick={openAdd}>
                <Plus className="h-3.5 w-3.5" />
                Add case study
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 transition-colors hover:border-white/[0.12]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-electric/20 bg-electric/[0.08] font-display text-[0.8rem] font-semibold text-electric-pale">
                    {study.monogram || study.brand.slice(0, 1) || "N"}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[0.84rem] font-semibold tracking-[0.02em] text-white/85">
                        {study.brand}
                      </p>
                      <StatusBadge tone={study.enabled ? "live" : "hidden"}>
                        {study.enabled ? "Live" : "Hidden"}
                      </StatusBadge>
                      <span className="rounded border border-white/[0.08] bg-black/15 px-1.5 py-0.5 text-[0.58rem] text-white/42">
                        {CASE_STUDY_CATEGORY_LABELS[study.category] ??
                          study.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[0.7rem] text-white/38" dir="rtl">
                      {study.ar.title}
                    </p>
                    <p className="mt-2 max-w-2xl text-[0.78rem] font-medium leading-5 text-white/68">
                      {study.en.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.64rem] text-white/38">
                      <span className="font-semibold text-electric-pale/75">
                        {study.en.growthMetric ||
                          study.ar.growthMetric ||
                          "No metric"}
                      </span>
                      <span>{study.en.growthLabel || "Growth"}</span>
                      <span className="h-2.5 w-px bg-white/10" />
                      <span>{study.services.length} services</span>
                      <span className="h-2.5 w-px bg-white/10" />
                      <span>{study.stats.length} stats</span>
                    </div>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-[0.74rem] leading-5 text-white/45">
                      {study.en.description}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-0.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${study.brand} up`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-white/38 transition hover:bg-white/[0.05] hover:text-white disabled:pointer-events-none disabled:opacity-25"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === caseStudies.length - 1}
                    aria-label={`Move ${study.brand} down`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-white/38 transition hover:bg-white/[0.05] hover:text-white disabled:pointer-events-none disabled:opacity-25"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggle(study.id)}
                    aria-label={
                      study.enabled
                        ? `Hide ${study.brand}`
                        : `Publish ${study.brand}`
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-md text-white/38 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    {study.enabled ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(study)}
                    aria-label={`Edit ${study.brand}`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-white/38 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        labelledBy="case-study-editor-title"
        size="xl"
      >
        <form onSubmit={submit} noValidate>
          <div className="border-b border-white/[0.08] p-5 pr-14 sm:p-6 sm:pr-16">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-electric-pale/55">
              {editingId ? "Edit case study" : "New case study"}
            </p>
            <h2
              id="case-study-editor-title"
              className="mt-1.5 font-display text-2xl font-medium tracking-tight text-white"
            >
              {editingId
                ? draft.brand || draft.en.title || "Case study details"
                : "Add a case study"}
            </h2>
            <p className="mt-1.5 text-[0.8rem] text-white/48">
              Everything here appears in the public portfolio — both languages,
              the cover art, and the detail modal.
            </p>
          </div>

          <div className="max-h-[68vh] space-y-5 overflow-y-auto p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Brand" error={errors.brand}>
                <input
                  value={draft.brand}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      brand: event.target.value,
                    }))
                  }
                  placeholder="AUREL"
                  className={inputClass}
                />
              </Field>
              <Field label="Monogram" hint="1–2 characters.">
                <input
                  value={draft.monogram}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      monogram: event.target.value,
                    }))
                  }
                  maxLength={2}
                  placeholder={draft.brand.slice(0, 1) || "A"}
                  className={inputClass}
                />
              </Field>
              <Field label="Period" hint="e.g. 7 months">
                <input
                  value={draft.period}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      period: event.target.value,
                    }))
                  }
                  placeholder="7 months"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Portfolio category">
                <select
                  value={draft.category}
                  onChange={(event) => {
                    const category = event.target.value;
                    setDraft((current) => ({
                      ...current,
                      category,
                      visual:
                        CASE_STUDY_VISUAL_BY_CATEGORY[category] ?? current.visual,
                    }));
                  }}
                  className={inputClass}
                >
                  {CASE_STUDY_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {CASE_STUDY_CATEGORY_LABELS[category] ?? category}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Cover artwork">
                <select
                  value={draft.visual}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      visual: event.target.value as CaseStudyVisual,
                    }))
                  }
                  className={inputClass}
                >
                  {CASE_STUDY_VISUALS.map((visual) => (
                    <option key={visual} value={visual}>
                      {CASE_STUDY_VISUAL_LABELS[visual]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Toggle
              checked={draft.enabled}
              onChange={(enabled) =>
                setDraft((current) => ({ ...current, enabled }))
              }
              label="Visible in the portfolio"
              description={
                draft.enabled
                  ? "Published with the public case studies."
                  : "Hidden until you publish it."
              }
            />

            <Field
              label="Services"
              hint="Comma-separated. e.g. Paid Media, Creative, CRO"
            >
              <input
                value={draft.services}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    services: event.target.value,
                  }))
                }
                placeholder="Paid Media, Creative, CRO"
                className={inputClass}
              />
            </Field>

            <Field
              label="Headline stats"
              hint="One per line as 'value | label'. e.g. 5.2x | Blended ROAS"
            >
              <textarea
                rows={3}
                value={draft.stats}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    stats: event.target.value,
                  }))
                }
                placeholder={"5.2x | Blended ROAS\n−37% | CAC"}
                className={textareaClass}
              />
            </Field>

            <div className="border-t border-white/[0.06] pt-4">
              <p className="text-[0.72rem] font-medium text-white/55">
                Before / after
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Before value">
                <input
                  value={draft.before}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      before: event.target.value,
                    }))
                  }
                  placeholder="$112k"
                  className={inputClass}
                />
              </Field>
              <Field label="After value">
                <input
                  value={draft.after}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      after: event.target.value,
                    }))
                  }
                  placeholder="$461k"
                  className={inputClass}
                />
              </Field>
              <Field label="Before label">
                <input
                  value={draft.beforeLabel}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      beforeLabel: event.target.value,
                    }))
                  }
                  placeholder="Monthly revenue before"
                  className={inputClass}
                />
              </Field>
              <Field label="After label">
                <input
                  value={draft.afterLabel}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      afterLabel: event.target.value,
                    }))
                  }
                  placeholder="Monthly revenue after"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="border-t border-white/[0.06] pt-4">
              <p className="text-[0.72rem] font-medium text-white/55">
                Case story
              </p>
            </div>

            <Field label="The challenge">
              <textarea
                rows={3}
                value={draft.challenge}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    challenge: event.target.value,
                  }))
                }
                className={textareaClass}
              />
            </Field>

            <Field label="Our approach" hint="One step per line.">
              <textarea
                rows={3}
                value={draft.approach}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    approach: event.target.value,
                  }))
                }
                className={textareaClass}
              />
            </Field>

            <Field label="The result">
              <textarea
                rows={3}
                value={draft.result}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    result: event.target.value,
                  }))
                }
                className={textareaClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Client quote">
                <textarea
                  rows={3}
                  value={draft.quote}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      quote: event.target.value,
                    }))
                  }
                  className={textareaClass}
                />
              </Field>
              <Field label="Quote author">
                <input
                  value={draft.author}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      author: event.target.value,
                    }))
                  }
                  placeholder="Noura Al-Harbi, Head of Growth at AUREL"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
              <p className="text-[0.72rem] font-medium text-white/55">
                Localized portfolio copy
              </p>
              <LanguageToggle value={language} onChange={setLanguage} />
            </div>

            <div
              dir={language === "ar" ? "rtl" : "ltr"}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Title"
                  hint="The main headline in the portfolio card."
                  error={errors[`${language}.title`]}
                >
                  <input
                    value={draft[language].title}
                    onChange={(event) =>
                      updateCopy("title", event.target.value)
                    }
                    placeholder="From quiet cult favorite to category leader."
                    className={inputClass}
                  />
                </Field>
                <Field
                  label="Client niche"
                  hint="e.g. Luxury skincare"
                  error={errors[`${language}.niche`]}
                >
                  <input
                    value={draft[language].niche}
                    onChange={(event) =>
                      updateCopy("niche", event.target.value)
                    }
                    placeholder="Luxury skincare"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Growth metric"
                  hint="e.g. +40%"
                  error={errors[`${language}.growthMetric`]}
                >
                  <input
                    value={draft[language].growthMetric}
                    onChange={(event) =>
                      updateCopy("growthMetric", event.target.value)
                    }
                    placeholder="+40%"
                    className={inputClass}
                  />
                </Field>
                <Field label="Growth label" hint="e.g. More leads">
                  <input
                    value={draft[language].growthLabel}
                    onChange={(event) =>
                      updateCopy("growthLabel", event.target.value)
                    }
                    placeholder="Qualified leads"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field
                label="Description"
                error={errors[`${language}.description`]}
              >
                <textarea
                  rows={4}
                  value={draft[language].description}
                  onChange={(event) =>
                    updateCopy("description", event.target.value)
                  }
                  className={textareaClass}
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            {editingId ? (
              confirmDelete ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-red-400/20 bg-red-400/[0.05] px-3 py-2 text-[0.7rem] text-red-200/75">
                  <span>Remove this case study?</span>
                  <button
                    type="button"
                    onClick={remove}
                    className="font-semibold text-red-300 underline decoration-red-300/40 underline-offset-2 transition hover:text-red-200"
                  >
                    Yes, remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-white/55 transition hover:text-white"
                  >
                    Keep
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1.5 self-start rounded-md px-1 py-1 text-[0.72rem] font-medium text-red-300/65 transition hover:text-red-200 sm:self-auto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete case study
                </button>
              )
            ) : (
              <span />
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className={buttonStyles({ variant: "secondary", size: "md" })}
              >
                Cancel
              </button>
              <button type="submit" className={buttonStyles({ size: "md" })}>
                {editingId ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Save case study
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    Add case study
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </DashboardCard>
  );
}

type RoiPresetDraft = {
  defaultBudget: string;
  defaultItemValue: string;
};

type RoiDraft = {
  minMultiplier: string;
  maxMultiplier: string;
  curveBudgetUsd: string;
  presets: Record<CurrencyCode, RoiPresetDraft>;
};

function roiToDraft(roi: CmsRoiSettings): RoiDraft {
  const presets = {} as Record<CurrencyCode, RoiPresetDraft>;

  for (const code of currencyOrder) {
    presets[code] = {
      defaultBudget: String(roi.presets[code].defaultBudget),
      defaultItemValue: String(roi.presets[code].defaultItemValue),
    };
  }

  return {
    minMultiplier: String(roi.minMultiplier),
    maxMultiplier: String(roi.maxMultiplier),
    curveBudgetUsd: String(roi.curveBudgetUsd),
    presets,
  };
}

function RoiEditor({
  roi,
  onSave,
}: {
  roi: CmsRoiSettings;
  onSave: (roi: CmsRoiSettings) => void;
}) {
  const [draft, setDraft] = useState<RoiDraft>(() => roiToDraft(roi));
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: "minMultiplier" | "maxMultiplier" | "curveBudgetUsd", value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setDirty(true);
  };

  const updatePreset = (
    code: CurrencyCode,
    field: keyof RoiPresetDraft,
    value: string,
  ) => {
    setDraft((current) => ({
      ...current,
      presets: {
        ...current.presets,
        [code]: { ...current.presets[code], [field]: value },
      },
    }));
    setDirty(true);
  };

  const parsed = useMemo(() => {
    const min = Number(draft.minMultiplier);
    const max = Number(draft.maxMultiplier);
    const curve = Number(draft.curveBudgetUsd);

    return {
      min: Number.isFinite(min) ? min : 0,
      max: Number.isFinite(max) ? max : 0,
      curve: Number.isFinite(curve) ? curve : 0,
    };
  }, [draft.curveBudgetUsd, draft.maxMultiplier, draft.minMultiplier]);

  const previewModel = {
    min: parsed.min > 0 ? parsed.min : 3.2,
    max: parsed.max > parsed.min ? parsed.max : 4.8,
    curveBudgetUsd: parsed.curve > 0 ? parsed.curve : 60_000,
  };

  const submit = () => {
    const nextErrors: Record<string, string> = {};

    if (!Number.isFinite(parsed.min) || parsed.min < 1 || parsed.min > 19) {
      nextErrors.min = "Use a base multiplier between 1 and 19.";
    }
    if (!Number.isFinite(parsed.max) || parsed.max <= parsed.min || parsed.max > 20) {
      nextErrors.max = "The maximum must be greater than the base multiplier.";
    }
    if (!Number.isFinite(parsed.curve) || parsed.curve < 1_000) {
      nextErrors.curve = "Use a curve budget of at least 1,000 USD.";
    }

    const presets = {} as Record<CurrencyCode, CmsCurrencyPreset>;

    for (const code of currencyOrder) {
      const budget = Number(draft.presets[code].defaultBudget);
      const itemValue = Number(draft.presets[code].defaultItemValue);

      if (!Number.isFinite(budget) || budget <= 0) {
        nextErrors[`${code}.budget`] = "Enter a default budget above 0.";
      }
      if (!Number.isFinite(itemValue) || itemValue <= 0) {
        nextErrors[`${code}.item`] = "Enter a customer value above 0.";
      }

      presets[code] = {
        defaultBudget: budget,
        defaultItemValue: itemValue,
      };
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      minMultiplier: parsed.min,
      maxMultiplier: parsed.max,
      curveBudgetUsd: parsed.curve,
      presets,
    });
    setDirty(false);
  };

  return (
    <DashboardCard>
      <SectionHeader
        title="ROI calculator model"
        description="Tune the return curve and the starting values visitors see for each market currency."
        action={
          <div className="flex items-center gap-2">
            {dirty ? (
              <span className="hidden text-[0.66rem] font-medium text-amber-300/80 sm:inline">
                Unsaved changes
              </span>
            ) : (
              <span className="hidden items-center gap-1.5 text-[0.66rem] text-emerald-300/80 sm:flex">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Published
              </span>
            )}
            <Button size="sm" onClick={submit} disabled={!dirty}>
              <Save className="h-3.5 w-3.5" />
              Save model
            </Button>
          </div>
        }
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-electric/20 bg-electric/[0.08] text-electric-soft">
              <Wallet className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-[0.8rem] font-semibold text-white/82">
                Return curve
              </p>
              <p className="text-[0.66rem] text-white/38">
                Low budgets start at the base; high budgets approach the maximum.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Base multiplier" error={errors.min}>
              <input
                type="number"
                min="1"
                max="19"
                step="0.1"
                value={draft.minMultiplier}
                onChange={(event) =>
                  updateField("minMultiplier", event.target.value)
                }
                className={cn(inputClass, "tabular-nums")}
              />
            </Field>
            <Field label="Maximum multiplier" error={errors.max}>
              <input
                type="number"
                min="1.1"
                max="20"
                step="0.1"
                value={draft.maxMultiplier}
                onChange={(event) =>
                  updateField("maxMultiplier", event.target.value)
                }
                className={cn(inputClass, "tabular-nums")}
              />
            </Field>
            <Field
              label="Curve budget (USD)"
              hint="Higher means slower growth."
              error={errors.curve}
            >
              <input
                type="number"
                min="1000"
                step="1000"
                value={draft.curveBudgetUsd}
                onChange={(event) =>
                  updateField("curveBudgetUsd", event.target.value)
                }
                className={cn(inputClass, "tabular-nums")}
              />
            </Field>
          </div>

          <div className="mt-4 rounded-lg border border-white/[0.06] bg-[#070A12] p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/42">
                Sample multipliers
              </p>
              <span className="text-[0.6rem] tabular-nums text-white/42">
                {previewModel.min.toFixed(1)}x – {previewModel.max.toFixed(1)}x
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[10_000, 25_000, 50_000, 100_000].map((budget) => (
                <div
                  key={budget}
                  className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-2"
                >
                  <p className="text-[0.6rem] text-white/38">
                    ${(budget / 1000).toFixed(0)}k / 90d
                  </p>
                  <p className="mt-0.5 font-display text-[0.95rem] font-medium text-white">
                    {getReturnMultiplier(budget, "USD", previewModel).toFixed(1)}x
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300">
              <Globe2 className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-[0.8rem] font-semibold text-white/82">
                Currency presets
              </p>
              <p className="text-[0.66rem] text-white/38">
                Initial calculator values when a currency is selected.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {currencyOrder.map((code) => (
              <div
                key={code}
                className="rounded-lg border border-white/[0.06] bg-black/10 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[0.74rem] font-semibold text-white/78">
                      {code} <span className="font-normal text-white/38">· {currencyNames[code]}</span>
                    </p>
                    <p className="mt-0.5 text-[0.6rem] text-white/32">
                      1 USD ≈ {currencies[code].usdRate} {code}
                    </p>
                  </div>
                  <span className="rounded border border-white/[0.07] bg-white/[0.02] px-1.5 py-0.5 text-[0.58rem] text-white/38">
                    {code}
                  </span>
                </div>
                <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                  <Field label="Default budget" error={errors[`${code}.budget`]}>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={draft.presets[code].defaultBudget}
                      onChange={(event) =>
                        updatePreset(code, "defaultBudget", event.target.value)
                      }
                      className={cn(inputClass, "h-9 text-[0.78rem] tabular-nums")}
                    />
                  </Field>
                  <Field
                    label="Avg. customer value"
                    error={errors[`${code}.item`]}
                  >
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={draft.presets[code].defaultItemValue}
                      onChange={(event) =>
                        updatePreset(
                          code,
                          "defaultItemValue",
                          event.target.value,
                        )
                      }
                      className={cn(inputClass, "h-9 text-[0.78rem] tabular-nums")}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-[0.68rem] leading-5 text-white/38">
        Multipliers are illustrative projections, not guarantees. Currency
        conversion rates and input steps stay fixed in the calculator.
      </p>
    </DashboardCard>
  );
}
