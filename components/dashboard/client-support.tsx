"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  LifeBuoy,
  MessageSquare,
  Palette,
  Paperclip,
  Plus,
  Send,
  X,
} from "lucide-react";
import type { Ticket, TicketCategory, TicketPriority } from "@/lib/data";
import type { NewTicketInput } from "@/components/dashboard/types";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import { DashboardCard, PageHeader, PriorityLabel, SectionHeader, StatusPill } from "@/components/dashboard/ui";

const categoryIcons: Record<TicketCategory, LucideIcon> = {
  Support: LifeBuoy,
  "Budget change": CreditCard,
  "Creative revision": Palette,
  Analytics: BarChart3,
};

const filters = ["All", "Open", "In Progress", "Resolved"] as const;
type Filter = (typeof filters)[number];

const priorityOptions: TicketPriority[] = ["Low", "Medium", "High", "Urgent"];

const quickRequests: Array<{ category: TicketCategory; title: string; description: string }> = [
  { category: "Budget change", title: "Budget change", description: "Reallocate or scale spend" },
  { category: "Creative revision", title: "Creative revision", description: "Request a new angle" },
  { category: "Support", title: "General question", description: "Ask your growth pod" },
];

export function ClientSupport({
  tickets,
  onCreateTicket,
  onReply,
}: {
  tickets: Ticket[];
  onCreateTicket: (input: NewTicketInput) => Ticket;
  onReply: (ticketId: string, body: string) => void;
}) {
  const clientTickets = useMemo(() => tickets.filter((ticket) => ticket.client === "AUREL"), [tickets]);
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [category, setCategory] = useState<TicketCategory>("Support");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [errors, setErrors] = useState<{ subject?: string; description?: string }>({});
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);
  const [reply, setReply] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filtered = clientTickets.filter((ticket) => filter === "All" || ticket.status === filter);
  const selected = clientTickets.find((ticket) => ticket.id === selectedId) ?? null;
  const openCount = clientTickets.filter((ticket) => ticket.status === "Open").length;
  const progressCount = clientTickets.filter((ticket) => ticket.status === "In Progress").length;
  const resolvedCount = clientTickets.filter((ticket) => ticket.status === "Resolved").length;

  const openComposer = (preset?: TicketCategory) => {
    setCategory(preset ?? "Support");
    setSubject("");
    setDescription("");
    setPriority("Medium");
    setAttachmentNames([]);
    setErrors({});
    setComposerOpen(true);
  };

  const submitTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (subject.trim().length < 5) nextErrors.subject = "Give your request a clear subject.";
    if (description.trim().length < 20) nextErrors.description = "Please add at least a little more context.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const created = onCreateTicket({
      subject: subject.trim(),
      description: description.trim(),
      category,
      priority,
    });

    setComposerOpen(false);
    setSelectedId(created.id);
    setFilter("All");
    toast({
      title: `Request ${created.id} created`,
      description: "Your growth pod has been notified. We'll respond within 2 business hours.",
    });
  };

  const sendReply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected || !reply.trim()) return;
    onReply(selected.id, reply.trim());
    setReply("");
    toast({
      title: "Reply sent",
      description: "Your message has been shared with your growth pod.",
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Support & requests"
        title="We're right here."
        description="Questions, budget changes, creative revisions — your senior team is one message away."
        actions={
          <>
            <a
              href="https://cal.com/nara/strategy"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: "secondary", size: "sm", className: "h-9" })}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Book a call
            </a>
            <button type="button" onClick={() => openComposer()} className={buttonStyles({ size: "sm", className: "h-9" })}>
              <Plus className="h-3.5 w-3.5" />
              New request
            </button>
          </>
        }
      />

      <div className="grid gap-3.5 sm:grid-cols-3">
        {[
          { label: "Open requests", value: openCount, icon: LifeBuoy, tone: "text-amber-300", bg: "bg-amber-400/[0.07] border-amber-400/15" },
          { label: "In progress", value: progressCount, icon: Clock3, tone: "text-electric-pale", bg: "bg-electric/[0.08] border-electric/20" },
          { label: "Resolved this quarter", value: resolvedCount, icon: Check, tone: "text-emerald-300", bg: "bg-emerald-400/[0.07] border-emerald-400/15" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/[0.075] bg-surface p-4">
            <div>
              <p className="text-[0.75rem] text-white/48">{item.label}</p>
              <p className="mt-1.5 font-display text-2xl font-medium tracking-tight text-white">{item.value}</p>
            </div>
            <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", item.bg, item.tone)}>
              <item.icon className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-3.5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <DashboardCard padding={false}>
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <SectionHeader title="Your requests" description="Every conversation, in one thread" />
              <div className="flex items-center gap-0.5 overflow-x-auto rounded-lg border border-white/[0.08] bg-black/15 p-0.5 hide-scrollbar" role="group" aria-label="Filter tickets">
                {filters.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilter(option)}
                    aria-pressed={filter === option}
                    className={cn(
                      "shrink-0 rounded-md px-2.5 py-1.5 text-[0.7rem] font-medium transition-colors",
                      filter === option ? "bg-white/[0.09] text-white" : "text-white/48 hover:text-white/70",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="divide-y divide-white/[0.05] border-t border-white/[0.055]">
                {filtered.map((ticket) => {
                  const Icon = categoryIcons[ticket.category];
                  return (
                    <button
                      key={ticket.id}
                      type="button"
                      onClick={() => setSelectedId(ticket.id)}
                      className="group flex w-full items-start gap-3.5 p-4 text-left transition-colors hover:bg-white/[0.018] sm:px-6 sm:py-5"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-white/55 transition-colors group-hover:border-electric/20 group-hover:text-electric-soft">
                        <Icon className="h-4 w-4" strokeWidth={1.7} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="truncate text-[0.84rem] font-medium text-white/78 transition-colors group-hover:text-white">{ticket.subject}</p>
                          <span className="font-mono text-[0.65rem] text-white/48">{ticket.id}</span>
                        </div>
                        <p className="mt-1 line-clamp-1 max-w-xl text-[0.75rem] leading-5 text-white/48">{ticket.description}</p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[0.65rem] text-white/48">
                          <span>{ticket.category}</span>
                          <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
                          <span>Updated {ticket.updatedAt}</span>
                          <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
                          <PriorityLabel priority={ticket.priority} />
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 pt-1">
                        <StatusPill status={ticket.status} />
                        <ChevronRight className="hidden h-3.5 w-3.5 text-white/48 transition-transform group-hover:translate-x-0.5 sm:block" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border-t border-white/[0.055] py-16">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-white/48">
                  <Check className="h-4 w-4" />
                </span>
                <p className="mt-3 text-[0.84rem] font-medium text-white/62">Nothing here</p>
                <p className="mt-1 text-[0.75rem] text-white/48">No {filter.toLowerCase()} requests. You&apos;re all caught up.</p>
                <button type="button" onClick={() => openComposer()} className={buttonStyles({ variant: "secondary", size: "sm", className: "mt-4" })}>
                  Start a new request
                </button>
              </div>
            )}
          </DashboardCard>
        </div>

        <div className="space-y-3.5 xl:col-span-4">
          <DashboardCard>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar initials="DP" name="Dev Patel" accent="from-[#C8A97E] to-[#6B5136]" size="lg" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-400" />
              </div>
              <div>
                <p className="text-[0.88rem] font-semibold text-white/85">Dev Patel</p>
                <p className="text-[0.7rem] text-white/48">Senior Media Buyer · Your pod</p>
                <p className="mt-1 flex items-center gap-1 text-[0.65rem] text-emerald-300/75">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  Online now
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.018] p-2.5">
                <p className="text-[0.6rem] uppercase tracking-[0.1em] text-white/48">Avg. response</p>
                <p className="mt-1 text-[0.8rem] font-semibold text-white/70">&lt; 2 hours</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.018] p-2.5">
                <p className="text-[0.6rem] uppercase tracking-[0.1em] text-white/48">Support hours</p>
                <p className="mt-1 text-[0.8rem] font-semibold text-white/70">9am – 7pm ET</p>
              </div>
            </div>
            <button type="button" onClick={() => openComposer()} className={buttonStyles({ size: "sm", className: "mt-3 w-full" })}>
              <MessageSquare className="h-3.5 w-3.5" />
              Message your team
            </button>
          </DashboardCard>

          <DashboardCard>
            <SectionHeader title="Quick requests" description="Start with a template" />
            <div className="mt-4 space-y-2">
              {quickRequests.map((request) => {
                const Icon = categoryIcons[request.category];
                return (
                  <button
                    key={request.title}
                    type="button"
                    onClick={() => openComposer(request.category)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.018] p-3 text-left transition hover:border-white/[0.12] hover:bg-white/[0.035]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.03] text-white/48 group-hover:text-white/70">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[0.75rem] font-medium text-white/70">{request.title}</span>
                      <span className="mt-0.5 block text-[0.65rem] text-white/48">{request.description}</span>
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-white/48 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>
          </DashboardCard>

          <div className="rounded-xl border border-electric/15 bg-electric/[0.045] p-4">
            <p className="flex items-center gap-2 text-[0.75rem] font-medium text-electric-pale/80">
              <CalendarDays className="h-3.5 w-3.5" />
              Prefer to talk it through?
            </p>
            <p className="mt-1.5 text-[0.7rem] leading-5 text-white/48">
              Book 30 minutes with your strategist. No agenda needed.
            </p>
            <a
              href="https://cal.com/nara/strategy"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-[0.7rem] font-semibold text-electric-pale transition hover:text-white"
            >
              Open calendar
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      <Modal open={composerOpen} onClose={() => setComposerOpen(false)} labelledBy="new-ticket-title" size="lg">
        <form onSubmit={submitTicket} noValidate>
          <div className="border-b border-white/[0.08] p-5 pr-14 sm:p-6 sm:pr-16">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-electric-pale/55">New request</p>
            <h2 id="new-ticket-title" className="mt-1.5 font-display text-2xl font-medium tracking-tight text-white">What can we help with?</h2>
            <p className="mt-1.5 text-[0.8rem] text-white/48">Your request goes directly to your senior pod.</p>
          </div>
          <div className="max-h-[68vh] space-y-5 overflow-y-auto p-5 sm:p-6">
            <div>
              <p className="mb-2 text-[0.75rem] font-medium text-white/55">Request type</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(categoryIcons) as TicketCategory[]).map((option) => {
                  const Icon = categoryIcons[option];
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCategory(option)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg border p-3 text-left transition-all",
                        category === option
                          ? "border-electric/35 bg-electric/[0.08]"
                          : "border-white/[0.07] bg-white/[0.018] hover:border-white/[0.14]",
                      )}
                    >
                      <span className={cn("flex h-7 w-7 items-center justify-center rounded-md border", category === option ? "border-electric/25 bg-electric/10 text-electric-soft" : "border-white/[0.07] bg-white/[0.02] text-white/48")}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className={cn("text-[0.75rem] font-medium", category === option ? "text-white" : "text-white/62")}>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="ticket-subject" className="mb-1.5 block text-[0.75rem] font-medium text-white/55">Subject</label>
              <input
                id="ticket-subject"
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  if (errors.subject) setErrors((current) => ({ ...current, subject: undefined }));
                }}
                placeholder="A short summary of your request"
                aria-invalid={Boolean(errors.subject)}
                className={cn(
                  "h-10 w-full rounded-lg border bg-white/[0.025] px-3.5 text-[0.84rem] text-white placeholder:text-white/48 focus:border-electric/50",
                  errors.subject ? "border-red-400/40" : "border-white/[0.08]",
                )}
              />
              {errors.subject && <p className="mt-1.5 text-[0.7rem] text-red-300/80">{errors.subject}</p>}
            </div>

            <div>
              <label htmlFor="ticket-description" className="mb-1.5 block text-[0.75rem] font-medium text-white/55">Details</label>
              <textarea
                id="ticket-description"
                rows={4}
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  if (errors.description) setErrors((current) => ({ ...current, description: undefined }));
                }}
                placeholder="Share any context, numbers, or links that will help your team move quickly..."
                aria-invalid={Boolean(errors.description)}
                className={cn(
                  "min-h-[6rem] w-full resize-none rounded-lg border bg-white/[0.025] px-3.5 py-3 text-[0.84rem] leading-6 text-white placeholder:text-white/48 focus:border-electric/50",
                  errors.description ? "border-red-400/40" : "border-white/[0.08]",
                )}
              />
              {errors.description && <p className="mt-1.5 text-[0.7rem] text-red-300/80">{errors.description}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[0.75rem] font-medium text-white/55">Priority</p>
                <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-black/15 p-1">
                  {priorityOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPriority(option)}
                      aria-pressed={priority === option}
                      className={cn(
                        "flex-1 rounded-md px-1 py-1.5 text-[0.7rem] font-medium transition-colors",
                        priority === option ? "bg-white/[0.09] text-white" : "text-white/48 hover:text-white/62",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[0.75rem] font-medium text-white/55">Attachments <span className="text-white/48">optional</span></p>
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []).map((file) => file.name);
                    setAttachmentNames(files);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="flex h-[2.15rem] w-full items-center gap-2 rounded-lg border border-dashed border-white/[0.12] px-3 text-[0.7rem] text-white/48 transition hover:border-white/25 hover:text-white/62"
                >
                  <Paperclip className="h-3 w-3" />
                  {attachmentNames.length > 0 ? `${attachmentNames.length} file${attachmentNames.length > 1 ? "s" : ""} attached` : "Add files"}
                </button>
              </div>
            </div>
            {attachmentNames.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {attachmentNames.map((name) => (
                  <span key={name} className="flex items-center gap-1 rounded border border-white/[0.08] bg-white/[0.025] px-2 py-1 text-[0.65rem] text-white/55">
                    {name}
                    <button type="button" onClick={() => setAttachmentNames((names) => names.filter((item) => item !== name))} aria-label={`Remove ${name}`}>
                      <X className="h-2.5 w-2.5 text-white/48 hover:text-white" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-white/[0.08] p-5 sm:flex-row sm:justify-end sm:p-6">
            <button type="button" onClick={() => setComposerOpen(false)} className={buttonStyles({ variant: "secondary", size: "md" })}>
              Cancel
            </button>
            <button type="submit" className={buttonStyles({ size: "md" })}>
              <Send className="h-3.5 w-3.5" />
              Submit request
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(selected)} onClose={() => setSelectedId(null)} labelledBy="ticket-detail-title" size="lg">
        {selected && (
          <div>
            <div className="border-b border-white/[0.08] p-5 pr-14 sm:p-6 sm:pr-16">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[0.65rem] text-white/48">{selected.id}</span>
                <span className="h-3 w-px bg-white/10" />
                <span className="text-[0.65rem] text-white/48">{selected.category}</span>
                <StatusPill status={selected.status} />
                <PriorityLabel priority={selected.priority} />
              </div>
              <h2 id="ticket-detail-title" className="mt-3 max-w-xl font-display text-2xl font-medium leading-tight tracking-tight text-white">
                {selected.subject}
              </h2>
              <p className="mt-2 text-[0.7rem] text-white/48">Opened {selected.createdAt} · {selected.assignee} is handling this request</p>
            </div>
            <div className="max-h-[58vh] space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.018] p-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/48">Your request</p>
                <p className="mt-2 text-[0.84rem] leading-6 text-white/55">{selected.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-white/[0.06]" />
                <span className="text-[0.65rem] uppercase tracking-[0.1em] text-white/48">Conversation</span>
                <span className="h-px flex-1 bg-white/[0.06]" />
              </div>
              <div className="space-y-4">
                {selected.messages.map((message) => (
                  <div key={message.id} className={cn("flex gap-3", message.from === "agency" && "flex-row-reverse")}>
                    <Avatar
                      initials={message.initials}
                      name={message.author}
                      size="sm"
                      accent={message.from === "agency" ? "from-[#2563EB] to-[#072465]" : "from-[#C8A97E] to-[#766045]"}
                    />
                    <div className={cn("max-w-[85%]", message.from === "agency" && "text-right")}>
                      <div className={cn("mb-1 flex items-center gap-2", message.from === "agency" && "justify-end")}>
                        <span className="text-[0.7rem] font-medium text-white/62">{message.author}</span>
                        <span className="text-[0.6rem] text-white/48">{message.time}</span>
                      </div>
                      <div
                        className={cn(
                          "rounded-xl border px-3.5 py-2.5 text-left text-[0.8rem] leading-6",
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
            {selected.status !== "Resolved" ? (
              <form onSubmit={sendReply} className="border-t border-white/[0.08] p-4 sm:p-5">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label htmlFor="ticket-reply" className="sr-only">Reply to request</label>
                    <textarea
                      id="ticket-reply"
                      rows={2}
                      value={reply}
                      onChange={(event) => setReply(event.target.value)}
                      placeholder="Write a reply..."
                      className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-[0.8rem] leading-5 text-white placeholder:text-white/48 focus:border-electric/40"
                    />
                  </div>
                  <button type="submit" disabled={!reply.trim()} className={buttonStyles({ size: "md", className: "h-10 shrink-0 px-3.5" })} aria-label="Send reply">
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-2 border-t border-white/[0.08] p-4 text-[0.75rem] text-emerald-300/70 sm:p-5">
                <Check className="h-3.5 w-3.5" />
                This request has been resolved. Start a new request if you need anything else.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
