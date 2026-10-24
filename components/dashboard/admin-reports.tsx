"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CloudUpload,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  HardDrive,
  Mail,
  Send,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";
import type { Client } from "@/lib/data";
import type { ClientReport, UploadReportInput } from "@/components/dashboard/types";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { DashboardCard, MiniProgress, PageHeader, SectionHeader, StatusPill } from "@/components/dashboard/ui";

const inputClass =
  "h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.025] px-3.5 text-[0.84rem] text-white placeholder:text-white/48 transition-colors focus:border-electric/45";

const periods = ["October 2026", "September 2026", "Q3 2026", "Q4 2026", "Holiday 2026", "November 2026"];
const categories = ["Monthly report", "Quarterly review", "Roadmap", "Data export", "Creative"];

export function AdminReports({
  clients,
  reports,
  onUpload,
  onViewClientLibrary,
}: {
  clients: Client[];
  reports: ClientReport[];
  onUpload: (input: UploadReportInput) => void;
  onViewClientLibrary: () => void;
}) {
  const [client, setClient] = useState(clients[0]?.name ?? "AUREL");
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState(periods[0]);
  const [category, setCategory] = useState(categories[0]);
  const [type, setType] = useState<"PDF" | "CSV">("PDF");
  const [notify, setNotify] = useState(true);
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const recent = useMemo(() => reports.slice(0, 4), [reports]);
  const monthlyCount = reports.filter((report) => report.period.includes("October")).length;

  const acceptFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return;
    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (extension !== "pdf" && extension !== "csv") {
      setFileError("Please upload a PDF or CSV file.");
      return;
    }
    if (selectedFile.size > 25 * 1024 * 1024) {
      setFileError("This file is larger than 25 MB.");
      return;
    }
    const size =
      selectedFile.size > 1024 * 1024
        ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(selectedFile.size / 1024))} KB`;
    setFile({ name: selectedFile.name, size });
    setFileError(null);
    setType(extension === "csv" ? "CSV" : "PDF");
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let hasError = false;
    if (title.trim().length < 3) {
      setTitleError("Give the report a clear title.");
      hasError = true;
    }
    if (!file) {
      setFileError("Upload the report file before publishing.");
      hasError = true;
    }
    if (hasError) return;

    setUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    onUpload({
      client,
      title: title.trim(),
      period,
      type,
      fileName: file!.name,
      fileSize: file!.size,
      category,
    });

    toast({
      title: "Report published",
      description: `${title.trim()} is now available to ${client}${notify ? " and the client has been notified" : ""}.`,
    });
    setUploading(false);
    setTitle("");
    setFile(null);
    setPeriod(periods[0]);
    setCategory(categories[0]);
    setNotify(true);
    setTitleError(null);
    setFileError(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Reports & delivery"
        title="Send the signal."
        description="Publish client-ready reporting, roadmaps, and data packs — with delivery tracked end to end."
        actions={
          <>
            <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-[0.75rem] text-white/48">
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-300/65" />
              {monthlyCount} reports published this month
            </span>
            <button type="button" onClick={onViewClientLibrary} className={buttonStyles({ variant: "secondary", size: "sm", className: "h-9" })}>
              <ArrowUpRight className="h-3.5 w-3.5" />
              View client library
            </button>
          </>
        }
      />

      <div className="grid gap-3.5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <DashboardCard>
            <SectionHeader title="Publish a report" description="Delivered to the client portal immediately" action={<span className="rounded border border-white/[0.08] px-2 py-1 text-[0.65rem] text-white/48">Step 1 of 1</span>} />
            <form onSubmit={submit} noValidate className="mt-6 space-y-5">
              <div>
                <label htmlFor="report-client" className="mb-1.5 block text-[0.75rem] font-medium text-white/55">Client account</label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/48" />
                  <select
                    id="report-client"
                    value={client}
                    onChange={(event) => setClient(event.target.value)}
                    className={cn(inputClass, "cursor-pointer pl-9 pr-9 text-white/78")}
                  >
                    {clients.map((item) => (
                      <option key={item.id} value={item.name}>{item.name} · {item.industry}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/48" />
                </div>
              </div>

              <div>
                <label htmlFor="report-title" className="mb-1.5 block text-[0.75rem] font-medium text-white/55">Report title</label>
                <input
                  id="report-title"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    if (titleError) setTitleError(null);
                  }}
                  placeholder="e.g. October Performance Report"
                  aria-invalid={Boolean(titleError)}
                  className={cn(inputClass, titleError && "border-red-400/40")}
                />
                {titleError && <p className="mt-1.5 text-[0.7rem] text-red-300/85">{titleError}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="report-period" className="mb-1.5 block text-[0.75rem] font-medium text-white/55">Reporting period</label>
                  <div className="relative">
                    <select id="report-period" value={period} onChange={(event) => setPeriod(event.target.value)} className={cn(inputClass, "cursor-pointer appearance-none pr-9 text-white/78")}>
                      {periods.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/48" />
                  </div>
                </div>
                <div>
                  <label htmlFor="report-category" className="mb-1.5 block text-[0.75rem] font-medium text-white/55">Document type</label>
                  <div className="relative">
                    <select id="report-category" value={category} onChange={(event) => setCategory(event.target.value)} className={cn(inputClass, "cursor-pointer appearance-none pr-9 text-white/78")}>
                      {categories.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/48" />
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[0.75rem] font-medium text-white/55">Report file</p>
                  <span className="text-[0.65rem] text-white/48">PDF or CSV · 25 MB max</span>
                </div>
                <input
                  ref={fileInput}
                  type="file"
                  accept=".pdf,.csv,application/pdf,text/csv"
                  className="hidden"
                  onChange={(event) => acceptFile(event.target.files?.[0])}
                />
                {file ? (
                  <div className="flex items-center gap-3 rounded-xl border border-electric/20 bg-electric/[0.045] p-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-electric/20 bg-electric/[0.08] text-electric-soft">
                      {type === "PDF" ? <FileText className="h-4 w-4" /> : <FileSpreadsheet className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.8rem] font-medium text-white/78">{file.name}</p>
                      <p className="mt-0.5 text-[0.65rem] text-white/48">{file.size} · {type} · Ready to publish</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        if (fileInput.current) fileInput.current.value = "";
                      }}
                      aria-label="Remove file"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/48 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={cn(
                      "group flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-5 py-9 transition-all",
                      dragging
                        ? "border-electric/60 bg-electric/[0.07]"
                        : "border-white/[0.12] bg-white/[0.012] hover:border-electric/30 hover:bg-electric/[0.025]",
                      fileError && "border-red-400/30",
                    )}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-white/48 transition group-hover:border-electric/20 group-hover:text-electric-soft">
                      <CloudUpload className="h-4 w-4" />
                    </span>
                    <span className="mt-3 text-[0.8rem] font-medium text-white/62">Drop your report here, or click to browse</span>
                    <span className="mt-1 text-[0.7rem] text-white/48">Your file is encrypted in transit and at rest</span>
                  </button>
                )}
                {fileError && <p className="mt-1.5 text-[0.7rem] text-red-300/85">{fileError}</p>}
              </div>

              <div className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.06] bg-white/[0.018] p-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.025] text-white/48">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[0.75rem] font-medium text-white/70">Notify the client by email</p>
                    <p className="mt-0.5 text-[0.65rem] text-white/48">Send {client} a branded delivery email</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notify}
                  aria-label="Notify client by email"
                  onClick={() => setNotify((value) => !value)}
                  className={cn("relative h-5 w-9 shrink-0 rounded-full border transition-colors", notify ? "border-electric bg-electric" : "border-white/15 bg-white/[0.06]")}
                >
                  <span className={cn("absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow transition-all", notify ? "left-[1.1rem]" : "left-0.5")} />
                </button>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-1.5 text-[0.65rem] text-white/48">
                  <Check className="h-3 w-3 text-emerald-300/50" />
                  You can replace the file after publishing
                </p>
                <button type="submit" disabled={uploading} className={buttonStyles({ size: "md", className: "w-full sm:w-auto" })}>
                  {uploading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-3.5 w-3.5" />
                      Publish to portal
                    </>
                  )}
                </button>
              </div>
            </form>
          </DashboardCard>
        </div>

        <div className="space-y-3.5 xl:col-span-5">
          <DashboardCard>
            <SectionHeader title="Recent uploads" description="Across all client accounts" action={<button type="button" onClick={onViewClientLibrary} className="text-[0.7rem] font-medium text-white/48 transition hover:text-white">View all</button>} />
            <div className="mt-4 space-y-2">
              {recent.map((report) => (
                <div key={report.id} className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.016] p-2.5">
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md border", report.type === "PDF" ? "border-red-400/15 bg-red-400/[0.05] text-red-300/65" : "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300/65")}>
                    {report.type === "PDF" ? <FileText className="h-3.5 w-3.5" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.75rem] font-medium text-white/70">{report.title}</p>
                    <p className="mt-0.5 text-[0.65rem] text-white/48">{report.client} · {report.date}</p>
                  </div>
                  <StatusPill status={report.status} />
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard>
            <SectionHeader title="Delivery checklist" description="Before you hit publish" />
            <div className="mt-4 space-y-3">
              {[
                { label: "Client data verified", done: true },
                { label: "Numbers reconciled to source", done: true },
                { label: "Account manager approved", done: true },
                { label: "Client notification queued", done: notify },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 text-[0.75rem]">
                  <span className={cn("flex h-4 w-4 items-center justify-center rounded-full border", item.done ? "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300" : "border-white/10 text-white/48")}>
                    {item.done && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                  </span>
                  <span className={item.done ? "text-white/55" : "text-white/48"}>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-emerald-400/12 bg-emerald-400/[0.035] p-3">
              <p className="flex items-center gap-1.5 text-[0.7rem] font-medium text-emerald-300/70">
                <Send className="h-3 w-3" />
                Client portal is live
              </p>
              <p className="mt-1 text-[0.65rem] leading-4 text-white/48">Published reports appear instantly in the client&apos;s workspace.</p>
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-white/48">
                  <HardDrive className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[0.75rem] font-medium text-white/70">Report storage</p>
                  <p className="mt-0.5 text-[0.65rem] text-white/48">18.4 GB of 50 GB used</p>
                </div>
              </div>
              <span className="text-[0.75rem] font-medium text-white/62">37%</span>
            </div>
            <MiniProgress value={37} className="mt-4" />
            <p className="mt-2 text-[0.65rem] text-white/48">Files retained for the lifetime of each partnership.</p>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
