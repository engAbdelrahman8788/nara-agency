"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  Inbox,
  LifeBuoy,
  Palette,
  Search,
  Send,
  Sparkles,
  TicketCheck,
  X,
} from "lucide-react";
import type { Ticket, TicketStatus } from "@/lib/data";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadCsv } from "@/lib/download";
import { buttonStyles } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import { DashboardCard, PageHeader, PriorityLabel, SectionHeader, StatusPill } from "@/components/dashboard/ui";

const categoryIcons: Record<string, LucideIcon> = {
  Support: LifeBuoy,
  "Budget change": CreditCard,
  "Creative revision": Palette,
  Analytics: BarChart3,
};

const filters = ["All", "Open", "In Progress", "Resolved"] as const;
type Filter = (typeof filters)[number];
const statusOptions: TicketStatus[] = ["Open", "In Progress", "Resolved"];
const priorityOrder: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

function TicketDetail({
  ticket,
  onUpdateStatus,
  onReply,
}: {
  ticket: Ticket;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  onReply: (ticketId: string, body: string) => void;
}) {
  const [reply, setReply] = useState("");
  const { toast } = useToast();
  const Icon = categoryIcons[ticket.category] ?? LifeBuoy;

  const updateStatus = (status: TicketStatus) => {
    onUpdateStatus(ticket.id, status);
    toast({
      title: `Ticket ${ticket.id} marked ${status.toLowerCase()}`,
      description: status === "Resolved" ? "The client has been notified automatically." : "The workspace has been updated.",
      tone: status === "Resolved" ? "success" : "info",
    });
  };

  const send = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reply.trim()) return;
    onReply(ticket.id, reply.trim());
    setReply("");
    toast({ title: "Reply sent", description: "Your response is live in the client portal." });
  };

  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-white/[0.07] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.7rem] text-white/48">{ticket.id}</span>
            <span className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-1.5 text-[0.7rem] text-white/48">
              <Icon className="h-3 w-3" />
              {ticket.category}
            </span>
            <PriorityLabel priority={ticket.priority} />
          </div>
          <StatusPill status={ticket.status} />
        </div>
        <h2 className="mt-3 max-w-2xl font-display text-xl font-medium leading-tight tracking-[-0.025em] text-white sm:text-[1.4rem]">
          {ticket.subject}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] text-white/48">
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-white/[0.06] text-[0.55rem] font-semibold text-white/62">{ticket.client.slice(0, 2)}</span>
            {ticket.client}
          </span>
          <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
          <span>Opened {ticket.createdAt}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
          <span>Assigned to {ticket.assignee}</span>
        </div>

        <div className="mt-4 flex items-center gap-1 rounded-lg border border-white/[0.07] bg-black/15 p-0.5" role="group" aria-label="Update ticket status">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => updateStatus(status)}
              aria-pressed={ticket.status === status}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[0.7rem] font-medium transition-colors",
                ticket.status === status ? "bg-white/[0.09] text-white" : "text-white/48 hover:text-white/70",
              )}
            >
              {ticket.status === status && <span className="h-1 w-1 rounded-full bg-electric-soft" />}
              {status}
            </button>
          ))}
        </div>
        {ticket.priority === "Urgent" && ticket.status !== "Resolved" && (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-red-400/12 bg-red-400/[0.04] px-2.5 py-1.5 text-[0.7rem] text-red-200/65">
            <Clock3 className="h-3 w-3" />
            Urgent · first response target is 1 hour
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-6 lg:max-h-[24rem]">
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.018] p-3.5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/48">Client request</p>
          <p className="mt-1.5 text-[0.8rem] leading-6 text-white/55">{ticket.description}</p>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/[0.055]" />
          <span className="text-[0.6rem] uppercase tracking-[0.11em] text-white/48">Thread · {ticket.messages.length} messages</span>
          <span className="h-px flex-1 bg-white/[0.055]" />
        </div>
        <div className="mt-4 space-y-4">
          {ticket.messages.map((message) => (
            <div key={message.id} className={cn("flex gap-2.5", message.from === "agency" && "flex-row-reverse")}>
              <Avatar
                initials={message.initials}
                name={message.author}
                size="sm"
                accent={message.from === "agency" ? "from-[#2563EB] to-[#072465]" : "from-[#C8A97E] to-[#766045]"}
              />
              <div className={cn("max-w-[88%]", message.from === "agency" && "text-right")}>
                <div className={cn("mb-1 flex items-center gap-2", message.from === "agency" && "justify-end")}>
                  <span className="text-[0.7rem] font-medium text-white/55">{message.author}</span>
                  <span className="text-[0.6rem] text-white/48">{message.time}</span>
                </div>
                <div
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left text-[0.8rem] leading-5",
                    message.from === "agency"
                      ? "border-electric/15 bg-electric/[0.07] text-white/62"
                      : "border-white/[0.06] bg-white/[0.025] text-white/55",
                  )}
                >
                  {message.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {ticket.status === "Resolved" ? (
        <div className="border-t border-white/[0.07] p-4 sm:p-5">
          <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-emerald-400/12 bg-emerald-400/[0.04] p-4 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[0.75rem] font-medium text-emerald-200/75">Request resolved</p>
                <p className="mt-0.5 text-[0.65rem] text-white/48">The conversation is closed and archived.</p>
              </div>
            </div>
            <button type="button" onClick={() => updateStatus("In Progress")} className={buttonStyles({ variant: "secondary", size: "sm" })}>
              Reopen ticket
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={send} className="border-t border-white/[0.07] p-4 sm:p-5">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {["Thanks — looking into this now.", "Could you share account access?", "Resolved — details in the portal."].map((quick) => (
              <button
                key={quick}
                type="button"
                onClick={() => setReply(quick)}
                className="rounded border border-white/[0.07] bg-white/[0.018] px-2 py-1 text-[0.65rem] text-white/48 transition hover:border-white/15 hover:text-white/62"
              >
                {quick}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <label htmlFor={`admin-reply-${ticket.id}`} className="sr-only">Reply to client</label>
            <textarea
              id={`admin-reply-${ticket.id}`}
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              rows={2}
              placeholder={`Reply to ${ticket.client}...`}
              className="w-full flex-1 resize-none rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-[0.8rem] leading-5 text-white placeholder:text-white/48 focus:border-electric/40"
            />
            <button type="submit" disabled={!reply.trim()} className={buttonStyles({ size: "md", className: "h-10 shrink-0 px-3.5" })} aria-label="Send reply">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[0.6rem] text-white/48">
            <Check className="h-2.5 w-2.5" />
            Replies are visible to the client and recorded in the account history.
          </p>
        </form>
      )}
    </div>
  );
}

export function AdminTickets({
  tickets,
  onUpdateStatus,
  onReply,
}: {
  tickets: Ticket[];
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  onReply: (ticketId: string, body: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [priorityFirst, setPriorityFirst] = useState(true);
  const [selectedId, setSelectedId] = useState(tickets[0]?.id ?? null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tickets
      .filter((ticket) => filter === "All" || ticket.status === filter)
      .filter(
        (ticket) =>
          !query ||
          ticket.subject.toLowerCase().includes(query) ||
          ticket.client.toLowerCase().includes(query) ||
          ticket.id.toLowerCase().includes(query),
      )
      .sort((a, b) => (priorityFirst ? priorityOrder[a.priority] - priorityOrder[b.priority] : 0));
  }, [tickets, filter, search, priorityFirst]);

  const selected = tickets.find((ticket) => ticket.id === selectedId) ?? filtered[0] ?? null;
  const open = tickets.filter((ticket) => ticket.status === "Open").length;
  const progress = tickets.filter((ticket) => ticket.status === "In Progress").length;
  const resolved = tickets.filter((ticket) => ticket.status === "Resolved").length;
  const urgent = tickets.filter((ticket) => ticket.priority === "Urgent" && ticket.status !== "Resolved").length;

  const selectTicket = (id: string) => {
    setSelectedId(id);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      setMobileOpen(true);
    }
  };

  const exportQueue = () => {
    downloadCsv(
      "nara-ticket-queue.csv",
      ["Ticket", "Client", "Subject", "Category", "Priority", "Status", "Assignee", "Updated"],
      filtered.map((ticket) => [ticket.id, ticket.client, ticket.subject, ticket.category, ticket.priority, ticket.status, ticket.assignee, ticket.updatedAt]),
    );
    toast({ title: "Ticket queue exported", description: `${filtered.length} tickets included in the CSV.` });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Ticket resolution desk"
        title="Close the loop."
        description="Client requests, contextualised and owned. Every reply brings the partnership closer."
        actions={
          <>
            <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-[0.75rem] text-white/48">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>
            <button type="button" onClick={exportQueue} className={buttonStyles({ variant: "secondary", size: "sm", className: "h-9" })}>
              <Download className="h-3.5 w-3.5" />
              Export queue
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {[
          { label: "Open", value: open, icon: Inbox, color: "text-amber-300", bg: "border-amber-400/15 bg-amber-400/[0.06]" },
          { label: "In progress", value: progress, icon: Clock3, color: "text-electric-pale", bg: "border-electric/20 bg-electric/[0.08]" },
          { label: "Resolved", value: resolved, icon: TicketCheck, color: "text-emerald-300", bg: "border-emerald-400/15 bg-emerald-400/[0.06]" },
          { label: "First response", value: "1h 42m", icon: Sparkles, color: "text-violet-300", bg: "border-violet-400/15 bg-violet-400/[0.06]" },
        ].map((metric) => (
          <div key={metric.label} className="flex items-center justify-between rounded-xl border border-white/[0.075] bg-surface p-4 sm:p-5">
            <div>
              <p className="text-[0.7rem] text-white/48">{metric.label}</p>
              <p className="mt-1.5 font-display text-[1.55rem] font-medium leading-none tracking-tight text-white">{metric.value}</p>
              {metric.label === "Open" && urgent > 0 && <p className="mt-2 text-[0.65rem] text-red-300/70">{urgent} urgent · needs a reply</p>}
              {metric.label === "First response" && <p className="mt-2 text-[0.65rem] text-emerald-300/60">− 18m vs. last month</p>}
              {metric.label === "Resolved" && <p className="mt-2 text-[0.65rem] text-white/48">This week</p>}
              {metric.label === "In progress" && <p className="mt-2 text-[0.65rem] text-white/48">Within SLA</p>}
            </div>
            <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", metric.bg, metric.color)}>
              <metric.icon className="h-3.5 w-3.5" />
            </span>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-3.5 lg:grid-cols-[minmax(19rem,0.82fr)_1.18fr]">
        <DashboardCard padding={false}>
          <div className="p-4 sm:p-5">
            <SectionHeader
              title="Request inbox"
              description={`${filtered.length} ${filter === "All" ? "total" : filter.toLowerCase()} requests`}
              action={
                <button type="button" onClick={() => setPriorityFirst((value) => !value)} className={cn("rounded-md border px-2 py-1 text-[0.65rem] font-medium transition", priorityFirst ? "border-electric/20 bg-electric/[0.07] text-electric-pale/70" : "border-white/[0.08] text-white/48 hover:text-white")}>
                  Priority first
                </button>
              }
            />
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/48" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search requests..."
                aria-label="Search tickets"
                className="h-8 w-full rounded-lg border border-white/[0.08] bg-black/15 pl-8 pr-8 text-[0.75rem] text-white placeholder:text-white/48 focus:border-electric/40"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label="Clear ticket search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/48 hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="mt-2.5 flex items-center gap-0.5 overflow-x-auto hide-scrollbar" role="group" aria-label="Filter tickets">
              {filters.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={filter === option}
                  className={cn(
                    "shrink-0 rounded-md px-2 py-1.5 text-[0.7rem] font-medium transition-colors",
                    filter === option ? "bg-white/[0.08] text-white" : "text-white/48 hover:text-white/62",
                  )}
                >
                  {option}
                  <span className="ml-1 text-[0.6rem] text-white/48">
                    {option === "All" ? tickets.length : tickets.filter((ticket) => ticket.status === option).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[43rem] divide-y divide-white/[0.05] overflow-y-auto border-t border-white/[0.055]">
            {filtered.length > 0 ? (
              filtered.map((ticket) => {
                const isSelected = selected?.id === ticket.id;
                const Icon = categoryIcons[ticket.category] ?? LifeBuoy;
                return (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => selectTicket(ticket.id)}
                    className={cn(
                      "group relative flex w-full flex-col gap-2 p-4 text-left transition-colors sm:px-5",
                      isSelected ? "bg-electric/[0.055]" : "hover:bg-white/[0.018]",
                    )}
                  >
                    {isSelected && <span className="absolute inset-y-0 left-0 w-0.5 bg-electric-soft" />}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-white/[0.06] text-[0.55rem] font-semibold text-white/62">
                          {ticket.client.slice(0, 2)}
                        </span>
                        <span className="text-[0.7rem] font-medium text-white/55">{ticket.client}</span>
                        <span className="font-mono text-[0.6rem] text-white/48">{ticket.id}</span>
                      </div>
                      <StatusPill status={ticket.status} />
                    </div>
                    <p className={cn("text-[0.8rem] font-medium transition-colors", isSelected ? "text-white" : "text-white/70 group-hover:text-white/85")}>
                      {ticket.subject}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center gap-1 text-[0.65rem] text-white/48">
                          <Icon className="h-2.5 w-2.5" />
                          {ticket.category}
                        </span>
                        <PriorityLabel priority={ticket.priority} />
                      </div>
                      <span className="text-[0.6rem] text-white/48">{ticket.updatedAt}</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center py-16">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-white/48">
                  <Check className="h-4 w-4" />
                </span>
                <p className="mt-3 text-[0.8rem] font-medium text-white/62">No tickets found</p>
                <p className="mt-1 text-[0.7rem] text-white/48">Your filters returned nothing.</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.055] px-5 py-3">
            <p className="text-[0.65rem] text-white/48">Synced just now</p>
            <span className="flex items-center gap-1.5 text-[0.65rem] text-white/48">
              <ArrowUpRight className="h-2.5 w-2.5" />
              {tickets.length} lifetime
            </span>
          </div>
        </DashboardCard>

        <div className="hidden lg:block">
          <DashboardCard padding={false} className="min-h-[42rem] overflow-hidden">
            {selected ? (
              <TicketDetail key={selected.id} ticket={selected} onUpdateStatus={onUpdateStatus} onReply={onReply} />
            ) : (
              <div className="flex h-full min-h-[42rem] flex-col items-center justify-center p-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-white/48">
                  <TicketCheck className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-lg text-white/62">Select a ticket</p>
                <p className="mt-1 max-w-xs text-[0.75rem] leading-5 text-white/48">Choose a request from the inbox to review the conversation and respond.</p>
              </div>
            )}
          </DashboardCard>
        </div>

        <div className="lg:hidden">
          {selected ? (
            <DashboardCard padding={false} className="overflow-hidden">
              <TicketDetail key={`mobile-${selected.id}`} ticket={selected} onUpdateStatus={onUpdateStatus} onReply={onReply} />
            </DashboardCard>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-white/[0.075] bg-surface py-12">
              <Inbox className="h-5 w-5 text-white/48" />
              <p className="mt-3 text-[0.8rem] text-white/48">Select a request to view details</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={mobileOpen && Boolean(selected)} onClose={() => setMobileOpen(false)} labelledBy="mobile-ticket-title" size="lg">
        {selected && (
          <div>
            <span id="mobile-ticket-title" className="sr-only">{selected.subject}</span>
            <TicketDetail ticket={selected} onUpdateStatus={onUpdateStatus} onReply={onReply} />
          </div>
        )}
      </Modal>
    </div>
  );
}
