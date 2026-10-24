"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  Download,
  Mail,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { Client } from "@/lib/data";
import { accountManagers } from "@/lib/data";
import { cn, getInitials, uid } from "@/lib/utils";
import { downloadCsv } from "@/lib/download";
import { Button, buttonStyles } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import { DashboardCard, PageHeader, SectionHeader, StatusPill } from "@/components/dashboard/ui";

type ClientStatus = Client["status"];
const statuses: ClientStatus[] = ["Active", "Onboarding", "At risk"];
const accentPalette = ["#C8A97E", "#5B8CFF", "#00C2FF", "#FF7A59", "#7C5CFF", "#28C76F", "#F4B942"];

type ClientForm = {
  name: string;
  industry: string;
  contact: string;
  email: string;
  manager: string;
  budget: string;
  status: ClientStatus;
};

const blankForm: ClientForm = {
  name: "",
  industry: "",
  contact: "",
  email: "",
  manager: accountManagers[0],
  budget: "",
  status: "Onboarding",
};

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[0.75rem] font-medium text-white/55">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-[0.7rem] text-red-300/85">{error}</p>}
    </div>
  );
}

const inputClass =
  "h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.025] px-3.5 text-[0.84rem] text-white placeholder:text-white/48 transition-colors focus:border-electric/45";

export function AdminClients({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
}: {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "All">("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState<ClientForm>(blankForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientForm, string>>>({});
  const { toast } = useToast();

  const totalMrr = clients.reduce((total, client) => total + client.budget, 0);
  const active = clients.filter((client) => client.status === "Active").length;
  const onboarding = clients.filter((client) => client.status === "Onboarding").length;
  const atRisk = clients.filter((client) => client.status === "At risk").length;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesQuery =
        !query ||
        client.name.toLowerCase().includes(query) ||
        client.industry.toLowerCase().includes(query) ||
        client.contact.toLowerCase().includes(query) ||
        client.manager.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All" || client.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...blankForm, manager: accountManagers[0] });
    setErrors({});
    setConfirmDelete(false);
    setModalOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditing(client);
    setForm({
      name: client.name,
      industry: client.industry,
      contact: client.contact,
      email: client.email,
      manager: client.manager,
      budget: String(client.budget),
      status: client.status,
    });
    setErrors({});
    setConfirmDelete(false);
    setModalOpen(true);
  };

  const updateField = (field: keyof ClientForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Enter the client name.";
    if (form.industry.trim().length < 2) nextErrors.industry = "Enter an industry.";
    if (form.contact.trim().length < 2) nextErrors.contact = "Add a primary contact.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!form.budget || Number(form.budget) <= 0) nextErrors.budget = "Set a monthly budget.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const trimmedName = form.name.trim();
    if (editing) {
      onUpdateClient({
        ...editing,
        name: trimmedName,
        industry: form.industry.trim(),
        contact: form.contact.trim(),
        email: form.email.trim(),
        manager: form.manager,
        budget: Number(form.budget),
        status: form.status,
      });
      toast({
        title: "Client updated",
        description: `${trimmedName}'s account details are now up to date.`,
      });
    } else {
      const client: Client = {
        id: uid("cl"),
        name: trimmedName,
        industry: form.industry.trim(),
        initials: getInitials(trimmedName).padEnd(2, trimmedName[0]?.toUpperCase() ?? "N").slice(0, 2),
        contact: form.contact.trim(),
        email: form.email.trim(),
        manager: form.manager,
        budget: Number(form.budget),
        status: form.status,
        tenure: "New",
        accent: accentPalette[clients.length % accentPalette.length],
      };
      onAddClient(client);
      toast({
        title: "Client added",
        description: `${trimmedName} has been added to your portfolio.`,
      });
    }
    setModalOpen(false);
  };

  const deleteClient = () => {
    if (!editing) return;
    const removed = editing;
    onDeleteClient(removed);
    setModalOpen(false);
    setConfirmDelete(false);
    setEditing(null);
    toast({
      title: "Client removed",
      description: `${removed.name} has been removed from the portfolio.`,
    });
  };

  const exportClients = () => {
    downloadCsv(
      "nara-client-portfolio.csv",
      ["Client", "Industry", "Primary contact", "Email", "Account manager", "Monthly budget", "Status", "Tenure"],
      filtered.map((client) => [client.name, client.industry, client.contact, client.email, client.manager, client.budget, client.status, client.tenure]),
    );
    toast({
      title: "Client portfolio exported",
      description: `${filtered.length} accounts included in the CSV.`,
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Client management"
        title="Your portfolio."
        description="Manage account health, senior ownership, and monthly investment across every partnership."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={exportClients} className="h-9">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button size="sm" onClick={openAdd} className="h-9">
              <Plus className="h-3.5 w-3.5" />
              Add client
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {[
          { label: "Monthly portfolio", value: `$${(totalMrr / 1000).toFixed(1)}k`, icon: Wallet, tone: "border-electric/20 bg-electric/[0.08] text-electric-soft", detail: "Recurring retainer value" },
          { label: "Active clients", value: `${active}`, icon: Users, tone: "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300", detail: `${onboarding} onboarding now` },
          { label: "At risk", value: `${atRisk}`, icon: ShieldAlert, tone: "border-amber-400/15 bg-amber-400/[0.06] text-amber-300", detail: "Needs attention" },
          { label: "Avg. retainer", value: clients.length ? `$${(totalMrr / clients.length / 1000).toFixed(1)}k` : "$0k", icon: Building2, tone: "border-violet-400/15 bg-violet-400/[0.06] text-violet-300", detail: "Per account / month" },
        ].map((metric) => (
          <div key={metric.label} className="rounded-xl border border-white/[0.075] bg-surface p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[0.7rem] text-white/48">{metric.label}</p>
                <p className="mt-2 font-display text-[1.55rem] font-medium leading-none tracking-[-0.03em] text-white">{metric.value}</p>
              </div>
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", metric.tone)}>
                <metric.icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-3 border-t border-white/[0.05] pt-2.5 text-[0.65rem] text-white/48">{metric.detail}</p>
          </div>
        ))}
      </div>

      <DashboardCard padding={false}>
        <div className="space-y-4 p-5 sm:p-6">
          <SectionHeader
            title="All clients"
            description={`${filtered.length} of ${clients.length} accounts shown`}
            action={
              <span className="hidden items-center gap-1.5 text-[0.65rem] text-white/48 sm:flex">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Portfolio synced
              </span>
            }
          />
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[18rem]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/48" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search clients, managers, industries..."
                aria-label="Search clients"
                className="h-9 w-full rounded-lg border border-white/[0.08] bg-black/15 pl-9 pr-8 text-[0.8rem] text-white placeholder:text-white/48 focus:border-electric/40"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-white/48 hover:text-white" aria-label="Clear search">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/[0.08] bg-black/15 p-0.5" role="group" aria-label="Filter clients by status">
              {(["All", ...statuses] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatusFilter(option)}
                  aria-pressed={statusFilter === option}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-[0.7rem] font-medium transition-colors",
                    statusFilter === option ? "bg-white/[0.09] text-white" : "text-white/48 hover:text-white/70",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[54rem] text-left">
                <thead>
                  <tr className="border-y border-white/[0.055] bg-white/[0.012] text-[0.65rem] uppercase tracking-[0.12em] text-white/48">
                    <th className="py-2.5 pl-6 font-medium">Client</th>
                    <th className="py-2.5 font-medium">Primary contact</th>
                    <th className="py-2.5 font-medium">Account manager</th>
                    <th className="py-2.5 text-right font-medium">Monthly budget</th>
                    <th className="py-2.5 font-medium">Status</th>
                    <th className="py-2.5 font-medium">Tenure</th>
                    <th className="w-20 py-2.5 pr-6 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client) => (
                    <tr key={client.id} className="group border-b border-white/[0.045] last:border-b-0 hover:bg-white/[0.018]">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] font-display text-[0.75rem] font-semibold"
                            style={{ color: client.accent }}
                          >
                            {client.initials}
                          </span>
                          <div>
                            <p className="text-[0.8rem] font-medium text-white/78">{client.name}</p>
                            <p className="mt-0.5 text-[0.65rem] text-white/48">{client.industry}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-[0.8rem] text-white/55">{client.contact}</p>
                        <p className="mt-0.5 text-[0.65rem] text-white/48">{client.email}</p>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Avatar initials={getInitials(client.manager)} name={client.manager} size="xs" accent="from-[#25324A] to-[#111826]" />
                          <span className="text-[0.75rem] text-white/55">{client.manager}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right text-[0.8rem] font-medium tabular-nums text-white/70">
                        ${client.budget.toLocaleString()}
                      </td>
                      <td className="py-4"><StatusPill status={client.status} /></td>
                      <td className="py-4 text-[0.75rem] text-white/48">{client.tenure}</td>
                      <td className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`mailto:${client.email}`}
                            aria-label={`Email ${client.contact}`}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-white/48 transition hover:bg-white/[0.05] hover:text-white"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => openEdit(client)}
                            aria-label={`Edit ${client.name}`}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-white/48 transition hover:bg-white/[0.05] hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-white/[0.05] md:hidden">
              {filtered.map((client) => (
                <div key={client.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] font-display text-[0.75rem] font-semibold"
                        style={{ color: client.accent }}
                      >
                        {client.initials}
                      </span>
                      <div>
                        <p className="text-[0.84rem] font-medium text-white/78">{client.name}</p>
                        <p className="mt-0.5 text-[0.65rem] text-white/48">{client.industry}</p>
                      </div>
                    </div>
                    <StatusPill status={client.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-white/[0.06] bg-black/10 p-2.5 text-[0.7rem]">
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.1em] text-white/48">Monthly</p>
                      <p className="mt-1 font-medium text-white/70">${client.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.1em] text-white/48">Manager</p>
                      <p className="mt-1 font-medium text-white/70">{client.manager}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[0.65rem] text-white/48">{client.contact} · {client.tenure}</p>
                    <button
                      type="button"
                      onClick={() => openEdit(client)}
                      className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] px-2 py-1 text-[0.7rem] font-medium text-white/55 transition hover:border-white/20 hover:text-white"
                    >
                      <Pencil className="h-2.5 w-2.5" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center border-t border-white/[0.055] py-20">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-white/48">
              <Search className="h-5 w-5" />
            </span>
            <p className="mt-4 text-[0.95rem] font-medium text-white/70">No clients found</p>
            <p className="mt-1 text-[0.8rem] text-white/48">Try a different search or add a new client.</p>
            <button type="button" onClick={openAdd} className={buttonStyles({ variant: "secondary", size: "sm", className: "mt-5" })}>
              <UserPlus className="h-3.5 w-3.5" />
              Add client
            </button>
          </div>
        )}
        <div className="flex items-center justify-between gap-3 border-t border-white/[0.055] px-5 py-3 sm:px-6">
          <p className="text-[0.7rem] text-white/48">Showing {filtered.length} of {clients.length} client accounts</p>
          <p className="text-[0.7rem] text-white/48">Q4 2026</p>
        </div>
      </DashboardCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} labelledBy="client-modal-title" size="lg">
        <form onSubmit={submit} noValidate>
          <div className="border-b border-white/[0.08] p-5 pr-14 sm:p-6 sm:pr-16">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-electric-pale/55">
              {editing ? "Edit account" : "New partnership"}
            </p>
            <h2 id="client-modal-title" className="mt-1.5 font-display text-2xl font-medium tracking-tight text-white">
              {editing ? `Edit ${editing.name}` : "Add a client"}
            </h2>
            <p className="mt-1.5 text-[0.8rem] text-white/48">
              {editing ? "Update ownership, budget, and partnership status." : "Set up a new account and assign a senior owner."}
            </p>
          </div>
          <div className="max-h-[65vh] space-y-4 overflow-y-auto p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Client name" error={errors.name}>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. AUREL"
                  aria-invalid={Boolean(errors.name)}
                  className={cn(inputClass, errors.name && "border-red-400/40")}
                />
              </Field>
              <Field label="Industry" error={errors.industry}>
                <input
                  value={form.industry}
                  onChange={(event) => updateField("industry", event.target.value)}
                  placeholder="e.g. Luxury skincare"
                  aria-invalid={Boolean(errors.industry)}
                  className={cn(inputClass, errors.industry && "border-red-400/40")}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Primary contact" error={errors.contact}>
                <input
                  value={form.contact}
                  onChange={(event) => updateField("contact", event.target.value)}
                  placeholder="Full name"
                  aria-invalid={Boolean(errors.contact)}
                  className={cn(inputClass, errors.contact && "border-red-400/40")}
                />
              </Field>
              <Field label="Contact email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="name@company.com"
                  aria-invalid={Boolean(errors.email)}
                  className={cn(inputClass, errors.email && "border-red-400/40")}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Account manager">
                <div className="relative">
                  <select
                    value={form.manager}
                    onChange={(event) => updateField("manager", event.target.value)}
                    className={cn(inputClass, "cursor-pointer appearance-none pr-9 text-white/78")}
                  >
                    {accountManagers.map((manager) => (
                      <option key={manager} value={manager}>{manager}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/48" />
                </div>
              </Field>
              <Field label="Monthly budget (USD)" error={errors.budget}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.84rem] text-white/48">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={form.budget}
                    onChange={(event) => updateField("budget", event.target.value)}
                    placeholder="25,000"
                    aria-invalid={Boolean(errors.budget)}
                    className={cn(inputClass, "pl-7 tabular-nums", errors.budget && "border-red-400/40")}
                  />
                </div>
              </Field>
            </div>
            <div>
              <p className="mb-2 text-[0.75rem] font-medium text-white/55">Partnership status</p>
              <div className="grid grid-cols-3 gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateField("status", status)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[0.75rem] font-medium transition-all",
                      form.status === status
                        ? "border-electric/35 bg-electric/[0.08] text-white"
                        : "border-white/[0.07] bg-white/[0.018] text-white/48 hover:border-white/[0.14]",
                    )}
                  >
                    {form.status === status && <Check className="h-3 w-3 text-electric-soft" />}
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.018] p-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-electric/10 text-electric-soft">
                <Check className="h-2.5 w-2.5" />
              </span>
              <p className="text-[0.7rem] leading-5 text-white/48">
                New accounts automatically receive a dedicated growth pod, onboarding workspace, and 30-day launch plan.
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            {editing ? (
              confirmDelete ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-red-400/20 bg-red-400/[0.05] px-3 py-2 text-[0.7rem] text-red-200/75">
                  <span>Remove {editing.name}?</span>
                  <button type="button" onClick={deleteClient} className="font-semibold text-red-300 underline decoration-red-300/40 underline-offset-2 transition hover:text-red-200">
                    Yes, remove
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="text-white/55 transition hover:text-white">
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
                  Delete account
                </button>
              )
            ) : (
              <span />
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button type="button" onClick={() => setModalOpen(false)} className={buttonStyles({ variant: "secondary", size: "md" })}>
                Cancel
              </button>
              <button type="submit" className={buttonStyles({ size: "md" })}>
                {editing ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Save changes
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    Add client
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
