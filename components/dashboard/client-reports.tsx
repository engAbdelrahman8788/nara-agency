"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Layers,
  Sparkles,
} from "lucide-react";
import type { ClientReport } from "@/components/dashboard/types";
import { buttonStyles } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import { DashboardCard, PageHeader, SectionHeader, StatusPill } from "@/components/dashboard/ui";
import { creativeAssets, monthlyRoadmap } from "@/lib/data";
import { cn } from "@/lib/utils";
import { downloadCsv } from "@/lib/download";
import { downloadReportPdf } from "@/lib/generate-pdf";

const roadmapDetails = [
  {
    deliverables: ["Q4 account audit", "Creative testing system", "Budget reallocation"],
    note: "Peak season foundation locked. Retargeting scaled to 5.9x.",
  },
  {
    deliverables: ["Holiday gifting push", "Creator UGC wave", "Retargeting scale"],
    note: "Holiday acceleration live. 12 net-new creatives in market.",
  },
  {
    deliverables: ["Retention flows", "Post-purchase series", "Audience refresh"],
    note: "Shifting from acquisition to lifetime value and retention.",
  },
  {
    deliverables: ["Category expansion", "New testing roadmap", "Annual planning"],
    note: "New year growth thesis and 2027 planning sprint.",
  },
];

const creativePalettes: Record<string, string> = {
  blue: "from-[#164BCC] via-[#03267F] to-[#041433]",
  sand: "from-[#CDB58D] via-[#8D7652] to-[#2C2419]",
  night: "from-[#2A3355] via-[#141B30] to-[#080B14]",
  ice: "from-[#DCE5E9] via-[#A9BBC2] to-[#596B72]",
};

export function ClientReports({
  reports,
  onNavigate,
}: {
  reports: ClientReport[];
  onNavigate: (view: string) => void;
}) {
  const [preview, setPreview] = useState<ClientReport | null>(null);
  const [creative, setCreative] = useState<(typeof creativeAssets)[number] | null>(null);
  const { toast } = useToast();
  const latest = reports[0];

  const handleDownload = (report: ClientReport) => {
    if (report.type === "CSV") {
      downloadCsv(`${report.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`, ["Date", "Platform", "Campaign", "Spend", "Revenue", "ROAS", "Conversions"], [
        ["2026-10-01", "Meta", "Always-On | Prospecting", 68240, 342000, "5.01", 2200],
        ["2026-10-01", "Google", "Brand Search | United States", 42680, 261000, "6.12", 1540],
        ["2026-10-01", "TikTok", "Spark Ads | Creator Series", 36940, 168000, "4.55", 1320],
        ["2026-10-01", "Meta", "Retargeting | 30-Day Warm", 28760, 164000, "5.70", 980],
        ["2026-10-01", "Google", "Performance Max | Core Catalog", 48420, 216000, "4.46", 1820],
        ["2026-10-01", "TikTok", "Top-of-Funnel | Discovery", 23520, 47060, "2.00", 569],
      ]);
    } else {
      downloadReportPdf({
        filename: `${report.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`,
        title: report.title,
        subtitle: `AUREL · ${report.period} · Prepared by NARA`,
        metrics: [
          { label: "Attributed revenue", value: "$1,198,060" },
          { label: "Blended ROAS", value: "4.82x" },
          { label: "Conversions", value: "8,429" },
          { label: "New customers", value: "1,601" },
        ],
        summary:
          "October was a strong month across the full funnel. AUREL is pacing 12% ahead of the Q4 revenue plan, with retargeting and brand search carrying the highest efficiency. Creative testing delivered three new winning angles and cut blended CAC by 37% year over year.",
        bullets: [
          "Meta prospecting delivered $342k in attributed revenue at 5.01x ROAS.",
          "Retargeting reached 5.70x ROAS and remains budget-capped; a reallocation recommendation is included.",
          "Holiday creative batch is approved and scheduled for launch on October 28.",
          "Next focus: scale winning angles, protect margin, and build the post-purchase retention flow.",
        ],
      });
    }
    toast({
      title: report.type === "PDF" ? "PDF report downloaded" : "CSV export downloaded",
      description: `${report.title} · ${report.period}`,
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Reports & files"
        title="The receipts."
        description="Every report, roadmap, and approved asset — organised and ready when you need it."
        actions={
          <>
            <button
              type="button"
              onClick={() => onNavigate("support")}
              className={buttonStyles({ variant: "secondary", size: "sm", className: "h-9" })}
            >
              <Layers className="h-3.5 w-3.5" />
              Request custom report
            </button>
            {latest && (
              <button type="button" onClick={() => handleDownload(latest)} className={buttonStyles({ size: "sm", className: "h-9" })}>
                <Download className="h-3.5 w-3.5" />
                Download latest
              </button>
            )}
          </>
        }
      />

      <div className="grid gap-3.5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          {latest && (
            <div className="relative h-full overflow-hidden rounded-xl border border-electric/20 bg-[#0A1020] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-8">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-electric/[0.22] blur-[100px]" />
              <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.08] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
              <div className="relative grid h-full gap-8 md:grid-cols-[1fr_0.68fr]">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-electric/25 bg-electric/[0.1] px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-electric-pale">
                      Latest report
                    </span>
                    <span className="text-[0.65rem] text-white/48">Available now</span>
                  </div>
                  <h2 className="mt-5 max-w-md font-display text-[1.65rem] font-medium leading-[1.2] tracking-[-0.03em] text-white sm:text-[2rem]">
                    {latest.title}
                  </h2>
                  <p className="mt-3 max-w-md text-[0.88rem] leading-6 text-white/48">
                    Your complete performance readout, channel insights, creative learnings, and
                    the decisions we&apos;re making next.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                    {[
                      { label: "Revenue", value: "$1.198M" },
                      { label: "ROAS", value: "4.82x" },
                      { label: "Conversions", value: "8,429" },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <p className="text-[0.6rem] uppercase tracking-[0.12em] text-white/48">{metric.label}</p>
                        <p className="mt-1 font-display text-base font-medium text-white/85">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2 pt-8">
                    <button type="button" onClick={() => handleDownload(latest)} className={buttonStyles({ size: "sm" })}>
                      <Download className="h-3.5 w-3.5" />
                      Download PDF
                    </button>
                    <button type="button" onClick={() => setPreview(latest)} className={buttonStyles({ variant: "secondary", size: "sm" })}>
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </button>
                  </div>
                </div>

                <div className="relative hidden items-center justify-center md:flex">
                  <div className="absolute h-52 w-44 rotate-6 rounded-lg border border-white/10 bg-white/[0.035]" />
                  <div className="relative h-56 w-44 -rotate-2 rounded-lg border border-white/[0.13] bg-[#F2F0E9] p-4 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.8)]">
                    <div className="flex items-center justify-between border-b border-black/10 pb-2.5">
                      <span className="font-display text-[0.65rem] font-bold tracking-[0.16em] text-[#0A0D14]">NARA</span>
                      <span className="text-[0.55rem] uppercase tracking-[0.1em] text-black/30">Oct / 2026</span>
                    </div>
                    <p className="mt-5 font-display text-[0.95rem] font-semibold leading-tight text-[#0A0D14]">October<br />Performance<br />Report</p>
                    <p className="mt-1.5 text-[0.55rem] uppercase tracking-[0.13em] text-black/35">Prepared for AUREL</p>
                    <div className="mt-5 flex items-end gap-1">
                      {[22, 34, 28, 45, 39, 58, 52, 68, 74, 64, 82, 92].map((height, index) => (
                        <span key={index} className="flex-1 rounded-sm bg-[#0A3ECC]" style={{ height: `${height * 0.32}px`, opacity: 0.45 + index * 0.045 }} />
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-black/10 pt-3">
                      <div>
                        <p className="text-[0.55rem] uppercase tracking-[0.08em] text-black/30">Revenue</p>
                        <p className="mt-0.5 text-[0.7rem] font-semibold text-[#0A0D14]">$1.198M</p>
                      </div>
                      <div>
                        <p className="text-[0.55rem] uppercase tracking-[0.08em] text-black/30">ROAS</p>
                        <p className="mt-0.5 text-[0.7rem] font-semibold text-[#0A0D14]">4.82x</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[0.55rem] uppercase tracking-[0.08em] text-black/25">
                      <span>Confidential</span>
                      <span>nara.agency</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-4">
          <DashboardCard className="flex h-full flex-col">
            <SectionHeader
              title="Strategist's note"
              action={<span className="text-[0.65rem] uppercase tracking-[0.1em] text-white/48">Oct 2026</span>}
            />
            <div className="mt-5 flex-1 rounded-lg border border-white/[0.065] bg-white/[0.018] p-4">
              <p className="text-[0.84rem] leading-[1.8] text-white/55">
                &ldquo;Strong month. We&apos;ve found three durable creative angles and retargeting
                is ready to absorb more budget. My recommendation: shift $8k from Discovery into
                retargeting for the rest of Q4.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2.5 border-t border-white/[0.06] pt-3.5">
                <Avatar initials="DP" name="Dev Patel" accent="from-[#C8A97E] to-[#6B5136]" size="sm" />
                <div>
                  <p className="text-[0.75rem] font-semibold text-white/78">Dev Patel</p>
                  <p className="text-[0.65rem] text-white/48">Senior Media Buyer · Your pod</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("support")}
              className={buttonStyles({ variant: "secondary", size: "sm", className: "mt-4 w-full" })}
            >
              Ask Dev a question
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </DashboardCard>
        </div>
      </div>

      <DashboardCard padding={false}>
        <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <SectionHeader title="Report library" description={`${reports.length} files · ${reports.filter((report) => report.status === "Ready").length} ready to download`} />
          <span className="inline-flex items-center gap-1.5 self-start rounded-md border border-white/[0.07] bg-white/[0.02] px-2 py-1 text-[0.65rem] text-white/48 sm:self-auto">
            <FolderOpen className="h-3 w-3" />
            AUREL / Reports
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left">
            <thead>
              <tr className="border-y border-white/[0.055] bg-white/[0.012] text-[0.65rem] uppercase tracking-[0.12em] text-white/48">
                <th className="py-2.5 pl-5 font-medium sm:pl-6">File</th>
                <th className="py-2.5 font-medium">Category</th>
                <th className="py-2.5 font-medium">Period</th>
                <th className="py-2.5 font-medium">Added</th>
                <th className="py-2.5 font-medium">Size</th>
                <th className="py-2.5 pr-5 text-right font-medium sm:pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="group border-b border-white/[0.045] last:border-b-0 hover:bg-white/[0.018]">
                  <td className="py-4 pl-5 sm:pl-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                          report.type === "PDF"
                            ? "border-red-400/15 bg-red-400/[0.06] text-red-300/75"
                            : "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300/75",
                        )}
                      >
                        {report.type === "PDF" ? <FileText className="h-4 w-4" /> : <FileSpreadsheet className="h-4 w-4" />}
                      </span>
                      <div>
                        <button
                          type="button"
                          onClick={() => setPreview(report)}
                          className="text-left text-[0.8rem] font-medium text-white/78 transition-colors hover:text-white"
                        >
                          {report.title}
                        </button>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[0.65rem] text-white/48">
                          <span>{report.type}</span>
                          <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
                          <span>{report.uploadedBy ? `Uploaded by ${report.uploadedBy}` : "Prepared by NARA"}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-[0.75rem] text-white/55">{report.category}</td>
                  <td className="py-4 text-[0.75rem] text-white/55">{report.period}</td>
                  <td className="py-4 text-[0.75rem] text-white/48">{report.date}</td>
                  <td className="py-4 text-[0.75rem] tabular-nums text-white/48">{report.size}</td>
                  <td className="py-4 pr-5 sm:pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <StatusPill status={report.status} className="mr-2 hidden sm:inline-flex" />
                      <button
                        type="button"
                        onClick={() => setPreview(report)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-white/48 transition hover:bg-white/[0.05] hover:text-white"
                        aria-label={`Preview ${report.title}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(report)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-white/48 transition hover:bg-white/[0.05] hover:text-white"
                        aria-label={`Download ${report.title}`}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-white/[0.055] px-5 py-3 sm:px-6">
          <p className="text-[0.7rem] text-white/48">Files are retained for the duration of your partnership.</p>
          <span className="flex items-center gap-1.5 text-[0.65rem] text-emerald-300/60">
            <Check className="h-3 w-3" />
            All files secure
          </span>
        </div>
      </DashboardCard>

      <div className="grid gap-3.5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <DashboardCard className="h-full">
            <SectionHeader
              title="Q4 growth roadmap"
              description="October 2026 – January 2027"
              action={<span className="rounded-md border border-electric/20 bg-electric/[0.07] px-2 py-1 text-[0.65rem] font-semibold text-electric-pale">On track</span>}
            />
            <div className="mt-6 space-y-0">
              {monthlyRoadmap.map((phase, index) => {
                const details = roadmapDetails[index];
                return (
                  <div key={phase.month} className="relative grid grid-cols-[auto_1fr] gap-3.5 pb-6 last:pb-0 sm:gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-[0.65rem] font-semibold",
                          phase.status === "done"
                            ? "border-emerald-400/25 bg-emerald-400/[0.1] text-emerald-300"
                            : phase.status === "active"
                              ? "border-electric/40 bg-electric/15 text-electric-pale shadow-glow-sm"
                              : "border-white/10 bg-white/[0.025] text-white/48",
                        )}
                      >
                        {phase.status === "done" ? <Check className="h-3 w-3" strokeWidth={2.5} /> : `0${index + 1}`}
                      </span>
                      {index !== monthlyRoadmap.length - 1 && (
                        <span className={cn("mt-2 w-px flex-1", phase.status === "done" ? "bg-emerald-400/15" : "bg-white/[0.07]")} />
                      )}
                    </div>
                    <div className={cn("rounded-lg border p-3.5", phase.status === "active" ? "border-electric/20 bg-electric/[0.045]" : "border-white/[0.06] bg-white/[0.012]")}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/48">{phase.month}</span>
                          {phase.status === "active" && (
                            <span className="rounded bg-electric/15 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-electric-pale">Current focus</span>
                          )}
                        </div>
                        <span className="text-[0.65rem] uppercase tracking-[0.09em] text-white/48">
                          {phase.status === "done" ? "Complete" : phase.status === "active" ? "In progress" : "Upcoming"}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[0.84rem] font-medium text-white/78">{phase.title}</p>
                      <p className="mt-1 text-[0.75rem] leading-5 text-white/48">{details.note}</p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {details.deliverables.map((deliverable) => (
                          <span key={deliverable} className="rounded border border-white/[0.07] px-1.5 py-0.5 text-[0.6rem] text-white/48">
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-5">
          <DashboardCard className="h-full">
            <SectionHeader
              title="Approved creative"
              description="Latest assets cleared for distribution"
              action={<span className="text-[0.65rem] text-white/48">{creativeAssets.length} assets</span>}
            />
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {creativeAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => setCreative(asset)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-white/[0.08] text-left transition-all duration-300 hover:border-white/20"
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105", creativePalettes[asset.palette])} />
                  <div className="absolute inset-0 bg-grid-fine opacity-[0.08]" />
                  <div className="absolute left-3 top-3 rounded border border-white/15 bg-black/20 px-1.5 py-0.5 text-[0.55rem] font-medium uppercase tracking-[0.1em] text-white/70 backdrop-blur-sm">
                    {asset.type}
                  </div>
                  <div className="absolute inset-x-3 bottom-3">
                    <p className={cn("font-display text-xs font-medium leading-tight", asset.palette === "ice" || asset.palette === "sand" ? "text-[#17202A]/80" : "text-white/80")}>
                      {asset.name}
                    </p>
                    <p className={cn("mt-1 text-[0.55rem] uppercase tracking-[0.1em]", asset.palette === "ice" || asset.palette === "sand" ? "text-black/35" : "text-white/48")}>
                      {asset.status}
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.018] px-3 py-2.5">
              <p className="flex items-center gap-2 text-[0.7rem] text-white/48">
                <ImageIcon className="h-3 w-3" />
                Assets remain available for 12 months
              </p>
              <button type="button" onClick={() => onNavigate("support")} className="text-[0.65rem] font-medium text-white/48 transition hover:text-white">
                Request revision
              </button>
            </div>
          </DashboardCard>
        </div>
      </div>

      <Modal open={Boolean(preview)} onClose={() => setPreview(null)} labelledBy="report-preview-title" size="xl">
        {preview && (
          <div>
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] p-5 pr-14 sm:p-6 sm:pr-16">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-electric/20 bg-electric/[0.08] text-electric-soft">
                  {preview.type === "PDF" ? <FileText className="h-4 w-4" /> : <FileSpreadsheet className="h-4 w-4" />}
                </span>
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/48">Report preview · {preview.type}</p>
                  <h2 id="report-preview-title" className="mt-1 font-display text-lg font-medium tracking-tight text-white">{preview.title}</h2>
                </div>
              </div>
              <button type="button" onClick={() => handleDownload(preview)} className={buttonStyles({ size: "sm", className: "mt-1 hidden sm:inline-flex" })}>
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-8">
              <div className="mx-auto max-w-3xl rounded-lg border border-white/[0.08] bg-[#F4F2EB] p-6 shadow-2xl sm:p-9">
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#004BFF] font-display text-[0.65rem] font-bold text-white">N</span>
                    <span className="font-display text-[0.75rem] font-bold tracking-[0.22em] text-[#111522]">NARA</span>
                  </div>
                  <span className="text-[0.6rem] uppercase tracking-[0.14em] text-black/30">Confidential · AUREL</span>
                </div>
                <p className="mt-8 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#004BFF]">{preview.period}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-[#111522] sm:text-3xl">
                  {preview.title.replace("October ", "")}
                </h3>
                <p className="mt-3 max-w-xl text-[0.84rem] leading-6 text-black/45">
                  October delivered $1.198M in attributed revenue at 4.82x blended ROAS — 12% ahead
                  of the Q4 plan. Retargeting and brand search remain the strongest efficiency drivers.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 border-y border-black/10 py-4">
                  {[
                    ["Attributed revenue", "$1.198M", "+18.6%"],
                    ["Blended ROAS", "4.82x", "+0.63x"],
                    ["New customers", "1,601", "+18.2%"],
                  ].map(([label, value, change]) => (
                    <div key={label}>
                      <p className="text-[0.55rem] uppercase tracking-[0.1em] text-black/30">{label}</p>
                      <p className="mt-1 font-display text-lg font-semibold text-[#111522]">{value}</p>
                      <p className="mt-0.5 text-[0.6rem] font-medium text-emerald-700">{change}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#111522]">Revenue trajectory</p>
                  <div className="mt-4 flex h-28 items-end gap-2 border-b border-black/10 pb-2">
                    {[36, 42, 39, 55, 61, 54, 68, 64, 77, 84, 80, 94].map((height, index) => (
                      <div key={index} className="flex flex-1 items-end gap-0.5">
                        <div className="w-full rounded-t-sm bg-[#004BFF]" style={{ height: `${height}%`, opacity: 0.38 + index * 0.05 }} />
                        <div className="w-full rounded-t-sm bg-black/15" style={{ height: `${height * 0.32}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-[0.55rem] uppercase tracking-[0.08em] text-black/25">
                    <span>Sep 23</span><span>Oct 08</span><span>Oct 22</span>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#111522]">What worked</p>
                    <ul className="mt-2.5 space-y-2 text-[0.7rem] leading-5 text-black/45">
                      <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#004BFF]" />Creative testing produced 3 durable angles</li>
                      <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#004BFF]" />Retargeting scaled to 5.70x ROAS</li>
                      <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#004BFF]" />CAC reduced 37% year over year</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#111522]">Next up</p>
                    <ul className="mt-2.5 space-y-2 text-[0.7rem] leading-5 text-black/45">
                      <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-black/30" />Reallocate $8k to retargeting</li>
                      <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-black/30" />Launch holiday creative batch</li>
                      <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-black/30" />Build post-purchase retention flow</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-4 text-[0.55rem] uppercase tracking-[0.1em] text-black/25">
                  <span>Prepared by NARA · {preview.date}</span>
                  <span>nara.agency</span>
                </div>
              </div>
              <div className="mx-auto mt-4 flex max-w-3xl justify-between text-[0.65rem] text-white/48">
                <span>{preview.size} · Uploaded {preview.date}</span>
                <button type="button" onClick={() => handleDownload(preview)} className="font-medium text-white/55 hover:text-white sm:hidden">
                  Download file
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={Boolean(creative)} onClose={() => setCreative(null)} labelledBy="creative-modal-title" size="md">
        {creative && (
          <div>
            <div className={cn("relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br", creativePalettes[creative.palette])}>
              <div className="absolute inset-0 bg-grid-fine opacity-[0.1]" />
              <div className="relative text-center">
                <p className={cn("text-[0.65rem] uppercase tracking-[0.28em]", creative.palette === "ice" || creative.palette === "sand" ? "text-black/35" : "text-white/55")}>AUREL / Holiday 2026</p>
                <p className={cn("mt-3 font-display text-3xl font-medium tracking-[-0.03em]", creative.palette === "ice" || creative.palette === "sand" ? "text-[#15202A]" : "text-white/85")}>
                  The ritual,<br />reimagined.
                </p>
                <div className={cn("absolute -bottom-8 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full border", creative.palette === "ice" ? "border-black/10" : "border-white/10")} />
              </div>
              <span className="absolute bottom-4 right-4 font-display text-sm font-semibold tracking-[0.25em] text-white/48">AUREL</span>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-electric-pale/55">Approved creative</p>
                  <h2 id="creative-modal-title" className="mt-1.5 font-display text-xl font-medium tracking-tight text-white">{creative.name}</h2>
                  <p className="mt-1 text-[0.75rem] text-white/48">{creative.type} · 1080 × 1920 · Delivered Oct 20</p>
                </div>
                <StatusPill status={creative.status} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-white/[0.06] pt-4 text-[0.7rem]">
                <div>
                  <p className="text-white/48">Approved by</p>
                  <p className="mt-1 text-white/70">Jordan Lee · AUREL</p>
                </div>
                <div>
                  <p className="text-white/48">Usage rights</p>
                  <p className="mt-1 text-white/70">Paid & organic · Global</p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCreative(null);
                    onNavigate("support");
                  }}
                  className={buttonStyles({ size: "md", className: "flex-1" })}
                >
                  Request revision
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreative(null);
                    toast({
                      title: "Asset download started",
                      description: `${creative.name} · ${creative.type}`,
                    });
                  }}
                  className={buttonStyles({ variant: "secondary", size: "md", className: "flex-1" })}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download asset
                </button>
              </div>
              <Link href="#contact" className="sr-only">Contact NARA</Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
