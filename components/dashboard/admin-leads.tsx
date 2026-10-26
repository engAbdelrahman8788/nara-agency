"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Download,
  Inbox,
  MessageSquare,
  Phone,
  Search,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/lib/leads/provider";
import {
  formatLeadDate,
  getLeadInitials,
  LEAD_STATUSES,
  useLeads,
} from "@/lib/leads/provider";
import { cn } from "@/lib/utils";
import { downloadCsv } from "@/lib/download";
import { buttonStyles } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import {
  DashboardCard,
  PageHeader,
  SectionHeader,
  StatusPill,
} from "@/components/dashboard/ui";

const filters = ["All", ...LEAD_STATUSES] as const;
type LeadFilter = (typeof filters)[number];

const statusMeta: Record<
  LeadStatus,
  { tone: string; description: string; icon: typeof Target }
> = {
  New: {
    tone: "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
    description: "Needs first contact",
    icon: Sparkles,
  },
  Contacted: {
    tone: "border-electric/20 bg-electric/[0.09] text-electric-pale",
    description: "Conversation in progress",
    icon: MessageSquare,
  },
  Won: {
    tone: "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
    description: "Closed and converted",
    icon: Check,
  },
};

function LeadAvatar({ lead }: { lead: Lead }) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-display text-[0.72rem] font-semibold",
        lead.status === "Won"
          ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
          : lead.status === "Contacted"
            ? "border-electric/20 bg-electric/[0.09] text-electric-pale"
            : "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
      )}
    >
      {getLeadInitials(lead.name) || "NL"}
    </span>
  );
}

export function AdminLeads() {
  const { leads, ready, updateLeadStatus, deleteLead } = useLeads();
  const [filter, setFilter] = useState<LeadFilter>("All");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads
      .filter((lead) => filter === "All" || lead.status === filter)
      .filter(
        (lead) =>
          !query ||
          lead.name.toLowerCase().includes(query) ||
          lead.phone.toLowerCase().includes(query) ||
          lead.business.toLowerCase().includes(query) ||
          lead.message.toLowerCase().includes(query),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [filter, leads, search]);

  const selected = leads.find((lead) => lead.id === selectedId) ?? null;
  const newCount = leads.filter((lead) => lead.status === "New").length;
  const contactedCount = leads.filter((lead) => lead.status === "Contacted").length;
  const wonCount = leads.filter((lead) => lead.status === "Won").length;
  const conversion = leads.length
    ? Math.round((wonCount / leads.length) * 100)
    : 0;

  const openLead = (lead: Lead) => {
    setSelectedId(lead.id);
    setConfirmDelete(false);
  };

  const updateStatus = (lead: Lead, status: LeadStatus) => {
    if (lead.status === status) return;
    updateLeadStatus(lead.id, status);
    toast({
      title: `${lead.name} marked ${status.toLowerCase()}`,
      description:
        status === "Won"
          ? "The deal is logged as won. Nice work."
          : "The pipeline has been updated.",
      tone: status === "Won" ? "success" : "info",
    });
  };

  const removeLead = (lead: Lead) => {
    deleteLead(lead.id);
    setSelectedId(null);
    setConfirmDelete(false);
    toast({
      title: "Lead removed",
      description: `${lead.name} was deleted from this browser's pipeline.`,
      tone: "info",
    });
  };

  const exportLeads = () => {
    downloadCsv(
      "nara-leads.csv",
      ["Name", "Phone", "Business", "Message", "Status", "Source", "Created"],
      filtered.map((lead) => [
        lead.name,
        lead.phone,
        lead.business,
        lead.message,
        lead.status,
        lead.source,
        new Date(lead.createdAt).toISOString(),
      ]),
    );
    toast({
      title: "Lead pipeline exported",
      description: `${filtered.length} leads included in the CSV.`,
    });
  };

  const metrics = [
    {
      label: "New leads",
      value: newCount,
      icon: Sparkles,
      tone: "border-amber-400/15 bg-amber-400/[0.06] text-amber-300",
      detail: "Awaiting first contact",
    },
    {
      label: "Contacted",
      value: contactedCount,
      icon: MessageSquare,
      tone: "border-electric/20 bg-electric/[0.08] text-electric-pale",
      detail: "Active conversations",
    },
    {
      label: "Won",
      value: wonCount,
      icon: Check,
      tone: "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300",
      detail: "Closed successfully",
    },
    {
      label: "Win rate",
      value: `${conversion}%`,
      icon: TrendingUp,
      tone: "border-violet-400/15 bg-violet-400/[0.06] text-violet-300",
      detail: `${leads.length} total leads`,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Leads / CRM"
        title="Turn interest into revenue."
        description="Every enquiry from the website lands here. Qualify the opportunity, move it through the pipeline, and keep the next step obvious."
        actions={
          <>
            <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-[0.72rem] text-white/48">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  ready ? "bg-emerald-400" : "bg-amber-400",
                )}
              />
              {ready ? "Pipeline synced" : "Loading pipeline"}
            </span>
            <button
              type="button"
              onClick={exportLeads}
              disabled={filtered.length === 0}
              className={buttonStyles({
                variant: "secondary",
                size: "sm",
                className: "h-9",
              })}
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between rounded-xl border border-white/[0.075] bg-surface p-4 sm:p-5"
          >
            <div>
              <p className="text-[0.7rem] text-white/48">{metric.label}</p>
              <p className="mt-1.5 font-display text-[1.55rem] font-medium leading-none tracking-tight text-white">
                {metric.value}
              </p>
              <p className="mt-2 text-[0.65rem] text-white/38">{metric.detail}</p>
            </div>
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border",
                metric.tone,
              )}
            >
              <metric.icon className="h-3.5 w-3.5" />
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-electric/12 bg-electric/[0.035] px-4 py-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-electric/20 bg-electric/[0.08] text-electric-soft">
          <Target className="h-3 w-3" />
        </span>
        <p className="text-[0.7rem] leading-5 text-white/45">
          This CRM is browser-local. Website submissions made on this device
          appear here instantly, and status changes persist between visits.
        </p>
      </div>

      <DashboardCard padding={false}>
        <div className="p-4 sm:p-5">
          <SectionHeader
            title="Lead inbox"
            description={`${filtered.length} ${
              filter === "All" ? "total" : filter.toLowerCase()
            } leads`}
            action={
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.07] bg-black/15 px-2 py-1 text-[0.6rem] text-white/38">
                <Users className="h-3 w-3" />
                {leads.length} lifetime
              </span>
            }
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative min-w-0 flex-1 sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/32" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, phone, business..."
                aria-label="Search leads"
                className="h-9 w-full rounded-lg border border-white/[0.08] bg-black/15 pl-9 pr-9 text-[0.78rem] text-white placeholder:text-white/32 focus:border-electric/40"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear lead search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/38 transition hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div
              className="flex items-center gap-0.5 overflow-x-auto hide-scrollbar"
              role="group"
              aria-label="Filter leads by status"
            >
              {filters.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={filter === option}
                  className={cn(
                    "shrink-0 rounded-md px-2.5 py-1.5 text-[0.7rem] font-medium transition-colors",
                    filter === option
                      ? "bg-white/[0.08] text-white"
                      : "text-white/48 hover:text-white/62",
                  )}
                >
                  {option}
                  <span className="ms-1 text-[0.6rem] text-white/38">
                    {option === "All"
                      ? leads.length
                      : leads.filter((lead) => lead.status === option).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/[0.05] border-t border-white/[0.055]">
          {filtered.length > 0 ? (
            filtered.map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => openLead(lead)}
                className="group flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors hover:bg-white/[0.018] sm:px-5 lg:flex-row lg:items-center"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <LeadAvatar lead={lead} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="truncate text-[0.82rem] font-medium text-white/80 transition group-hover:text-white">
                        {lead.name}
                      </p>
                      <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
                      <p className="truncate text-[0.7rem] text-white/42">
                        {lead.business}
                      </p>
                    </div>
                    <p className="mt-1 line-clamp-1 text-[0.7rem] leading-5 text-white/42">
                      {lead.message}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.64rem] text-white/38">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-2.5 w-2.5" />
                        <span dir="ltr">{lead.phone}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Inbox className="h-2.5 w-2.5" />
                        {formatLeadDate(lead.createdAt)}
                      </span>
                      <span className="rounded border border-white/[0.06] px-1.5 py-0.5 text-[0.56rem] uppercase tracking-[0.08em] text-white/32">
                        {lead.source}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 lg:justify-end">
                  <StatusPill status={lead.status} />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.02] text-white/38 transition group-hover:border-electric/25 group-hover:text-electric-pale">
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-white/42">
                <Inbox className="h-4 w-4" />
              </span>
              <p className="mt-3 text-[0.85rem] font-medium text-white/62">
                No leads match this view
              </p>
              <p className="mt-1 max-w-xs text-[0.72rem] leading-5 text-white/38">
                New website submissions and leads you move through the pipeline
                will appear here.
              </p>
              {(search || filter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                  }}
                  className={buttonStyles({
                    variant: "secondary",
                    size: "sm",
                    className: "mt-4",
                  })}
                >
                  Reset filters
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.055] px-5 py-3">
          <p className="text-[0.65rem] text-white/38">
            Stored in this browser
          </p>
          <span className="flex items-center gap-1.5 text-[0.65rem] text-white/38">
            <TrendingUp className="h-2.5 w-2.5" />
            {conversion}% win rate
          </span>
        </div>
      </DashboardCard>

      <Modal
        open={Boolean(selected)}
        onClose={() => {
          setSelectedId(null);
          setConfirmDelete(false);
        }}
        labelledBy="lead-detail-title"
        size="lg"
      >
        {selected && (
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3.5 pe-10">
              <LeadAvatar lead={selected} />
              <div className="min-w-0 flex-1">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/38">
                  Lead details
                </p>
                <h2
                  id="lead-detail-title"
                  className="mt-1 font-display text-xl font-medium tracking-[-0.02em] text-white"
                >
                  {selected.name}
                </h2>
                <p className="mt-1 text-[0.75rem] text-white/48">
                  {selected.business}
                </p>
              </div>
              <StatusPill status={selected.status} />
            </div>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
              <a
                href={`tel:${selected.phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 transition hover:border-white/[0.14]"
              >
                <Phone className="h-3.5 w-3.5 text-electric-soft/70" />
                <span className="min-w-0">
                  <span className="block text-[0.58rem] uppercase tracking-[0.1em] text-white/32">
                    Phone
                  </span>
                  <span
                    className="block truncate text-[0.72rem] text-white/65"
                    dir="ltr"
                  >
                    {selected.phone}
                  </span>
                </span>
              </a>
              <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
                <Inbox className="h-3.5 w-3.5 text-electric-soft/70" />
                <span>
                  <span className="block text-[0.58rem] uppercase tracking-[0.1em] text-white/32">
                    Received
                  </span>
                  <span className="block text-[0.72rem] text-white/65">
                    {formatLeadDate(selected.createdAt)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
                <Users className="h-3.5 w-3.5 text-electric-soft/70" />
                <span>
                  <span className="block text-[0.58rem] uppercase tracking-[0.1em] text-white/32">
                    Source
                  </span>
                  <span className="block text-[0.72rem] text-white/65">
                    {selected.source}
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#070A12] p-4">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/38">
                Message
              </p>
              <p className="mt-2 text-[0.82rem] leading-6 text-white/60">
                {selected.message || "No message was provided."}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/38">
                Pipeline status
              </p>
              <div
                className="mt-2 grid gap-1.5 rounded-lg border border-white/[0.07] bg-black/15 p-1 sm:grid-cols-3"
                role="group"
                aria-label="Update lead status"
              >
                {LEAD_STATUSES.map((status) => {
                  const meta = statusMeta[status];
                  const active = selected.status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateStatus(selected, status)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-md border px-2.5 py-2 text-[0.7rem] font-medium transition",
                        active
                          ? meta.tone
                          : "border-transparent text-white/42 hover:bg-white/[0.03] hover:text-white/62",
                      )}
                    >
                      {active && <meta.icon className="h-3 w-3" />}
                      {status}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[0.65rem] text-white/38">
                {statusMeta[selected.status].description}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2 border-t border-white/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonStyles({
                    variant: "secondary",
                    size: "sm",
                  })}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
                <a
                  href={`tel:${selected.phone.replace(/[^\d+]/g, "")}`}
                  className={buttonStyles({ variant: "secondary", size: "sm" })}
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call lead
                </a>
              </div>

              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-[0.66rem] text-white/42">
                    Remove this lead?
                  </span>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className={buttonStyles({
                      variant: "ghost",
                      size: "sm",
                      className: "h-8 px-2.5",
                    })}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => removeLead(selected)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-400/25 bg-red-400/[0.08] px-2.5 text-[0.7rem] font-medium text-red-300 transition hover:bg-red-400/[0.14]"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[0.7rem] font-medium text-white/32 transition hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove lead
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
