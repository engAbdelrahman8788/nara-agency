import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardCard({
  children,
  className,
  padding = true,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/[0.075] bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]",
        padding && "p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-white">{title}</h2>
        {description && <p className="mt-1 text-[0.8rem] leading-5 text-white/48">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

const statusTones: Record<string, { dot: string; className: string }> = {
  Active: { dot: "bg-emerald-400", className: "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300" },
  Optimizing: { dot: "bg-electric-soft", className: "border-electric/20 bg-electric/[0.09] text-electric-pale" },
  Paused: { dot: "bg-white/40", className: "border-white/10 bg-white/[0.04] text-white/55" },
  Open: { dot: "bg-amber-400", className: "border-amber-400/15 bg-amber-400/[0.08] text-amber-300" },
  "In Progress": { dot: "bg-electric-soft", className: "border-electric/20 bg-electric/[0.09] text-electric-pale" },
  Resolved: { dot: "bg-emerald-400", className: "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300" },
  "At risk": { dot: "bg-amber-400", className: "border-amber-400/15 bg-amber-400/[0.08] text-amber-300" },
  Onboarding: { dot: "bg-[#7C5CFF]", className: "border-[#7C5CFF]/20 bg-[#7C5CFF]/[0.09] text-[#B6A6FF]" },
  Ready: { dot: "bg-emerald-400", className: "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300" },
  Draft: { dot: "bg-white/40", className: "border-white/10 bg-white/[0.04] text-white/55" },
  Approved: { dot: "bg-emerald-400", className: "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300" },
  "In review": { dot: "bg-amber-400", className: "border-amber-400/15 bg-amber-400/[0.08] text-amber-300" },
  New: { dot: "bg-amber-400", className: "border-amber-400/15 bg-amber-400/[0.08] text-amber-300" },
  Contacted: { dot: "bg-electric-soft", className: "border-electric/20 bg-electric/[0.09] text-electric-pale" },
  Won: { dot: "bg-emerald-400", className: "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300" },
};

const priorityTones: Record<string, string> = {
  Low: "text-white/48",
  Medium: "text-sky-300/75",
  High: "text-amber-300/85",
  Urgent: "text-red-300",
};

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const tone = statusTones[status] ?? {
    dot: "bg-white/40",
    className: "border-white/10 bg-white/[0.04] text-white/55",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-[0.7rem] font-semibold",
        tone.className,
        className,
      )}
    >
      <span className={cn("h-1 w-1 rounded-full", tone.dot)} />
      {status}
    </span>
  );
}

export function PriorityLabel({ priority }: { priority: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[0.7rem] font-medium", priorityTones[priority] ?? "text-white/55")}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {priority}
    </span>
  );
}

export function PlatformMark({ platform, showLabel = false }: { platform: string; showLabel?: boolean }) {
  if (platform === "Meta") {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#5B8CFF]/20 bg-[#004BFF]/10">
          <svg viewBox="0 0 24 16" className="h-3.5 w-4 text-[#7FA3FF]" fill="none" aria-hidden="true">
            <path d="M3 13c2.2-7.7 4-11.8 6-11.8 2.9 0 3.4 10.6 6.5 10.6 2 0 3.2-2.8 4.4-6.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
          </svg>
        </span>
        {showLabel && <span className="text-[0.84rem] text-white/70">Meta</span>}
      </span>
    );
  }

  if (platform === "Google") {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] font-display text-[0.8rem] font-semibold text-white/78">
          G
        </span>
        {showLabel && <span className="text-[0.84rem] text-white/70">Google</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#00C2FF]/15 bg-[#00C2FF]/[0.07]">
        <Music2 className="h-3.5 w-3.5 text-[#65DFFF]" />
      </span>
      {showLabel && <span className="text-[0.84rem] text-white/70">TikTok</span>}
    </span>
  );
}

const kpiTone = {
  blue: {
    icon: "border-electric/20 bg-electric/[0.09] text-electric-soft",
    glow: "bg-electric/[0.09]",
    fill: "rgba(0,75,255,0.18)",
    stroke: "#7FA3FF",
  },
  sky: {
    icon: "border-sky-400/15 bg-sky-400/[0.07] text-sky-300",
    glow: "bg-sky-400/[0.06]",
    fill: "rgba(56,189,248,0.13)",
    stroke: "#7DD3FC",
  },
  violet: {
    icon: "border-violet-400/15 bg-violet-400/[0.07] text-violet-300",
    glow: "bg-violet-400/[0.06]",
    fill: "rgba(139,92,246,0.13)",
    stroke: "#C4B5FD",
  },
  emerald: {
    icon: "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300",
    glow: "bg-emerald-400/[0.05]",
    fill: "rgba(52,211,153,0.11)",
    stroke: "#6EE7B7",
  },
};

export type KpiCardProps = {
  label: string;
  value: string;
  change: string;
  trend?: "up" | "down";
  detail?: string;
  icon: LucideIcon;
  tone?: keyof typeof kpiTone;
  sparkline?: number[];
  hint?: string;
};

export function KpiCard({
  label,
  value,
  change,
  trend = "up",
  detail = "vs. last period",
  icon: Icon,
  tone = "blue",
  sparkline = [22, 30, 26, 38, 34, 48, 52, 49, 62, 68, 72, 84],
  hint,
}: KpiCardProps) {
  const colors = kpiTone[tone];
  const width = 146;
  const height = 36;
  const max = Math.max(...sparkline);
  const min = Math.min(...sparkline);
  const points = sparkline.map((value, index) => {
    const x = (index / (sparkline.length - 1)) * width;
    const y = height - ((value - min) / (max - min || 1)) * (height - 6) - 3;
    return [x, y];
  });
  const line = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const fill = `${line} L${width} ${height} L0 ${height} Z`;
  const gid = `spark-${label.replace(/[^a-z0-9]/gi, "").toLowerCase()}-${tone}`;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.075] bg-surface p-5 transition-colors duration-300 hover:border-white/[0.13]">
      <div className={cn("pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-[50px] transition-opacity duration-500 group-hover:opacity-100", colors.glow)} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[0.75rem] font-medium tracking-[0.01em] text-white/48">{label}</p>
          <p className="mt-2.5 font-display text-[1.8rem] font-medium leading-none tracking-[-0.035em] text-white">{value}</p>
        </div>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", colors.icon)}>
          <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
        </span>
      </div>
      <div className="relative mt-4 flex items-end justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold",
              trend === "up" ? "bg-emerald-400/[0.08] text-emerald-300" : "bg-red-400/[0.07] text-red-300",
            )}
          >
            {trend === "up" ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
            {change}
          </span>
          <span className="text-[0.7rem] text-white/48">{detail}</span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-8 w-[6rem] opacity-90" aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
              <stop stopColor={colors.fill} />
              <stop offset="1" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path d={fill} fill={`url(#${gid})`} />
          <path d={line} fill="none" strokeWidth="1.4" stroke={colors.stroke} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {hint && <p className="relative mt-3 border-t border-white/[0.05] pt-3 text-[0.7rem] text-white/48">{hint}</p>}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-electric-pale/50">{eyebrow}</p>}
        <h1 className="font-display text-[1.7rem] font-medium leading-tight tracking-[-0.03em] text-white sm:text-[2rem]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[0.88rem] leading-6 text-white/48">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function MiniProgress({
  value,
  max = 100,
  className,
  tone = "blue",
}: {
  value: number;
  max?: number;
  className?: string;
  tone?: "blue" | "emerald" | "amber" | "violet";
}) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  const tones = {
    blue: "from-electric to-electric-soft",
    emerald: "from-emerald-500 to-emerald-300",
    amber: "from-amber-500 to-amber-300",
    violet: "from-violet-500 to-violet-300",
  };
  return (
    <div className={cn("h-1 overflow-hidden rounded-full bg-white/[0.06]", className)}>
      <div className={cn("h-full rounded-full bg-gradient-to-r", tones[tone])} style={{ width: `${percent}%` }} />
    </div>
  );
}

export function DateBadge({ label = "October 2026" }: { label?: string }) {
  return (
    <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-[0.8rem] font-medium text-white/55">
      <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3 text-white/48" aria-hidden="true">
        <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {label}
    </span>
  );
}
