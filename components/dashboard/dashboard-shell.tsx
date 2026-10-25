"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Command,
  FileText,
  Gauge,
  Headphones,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  Plus,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Client, Ticket, TicketStatus } from "@/lib/data";
import {
  initialClients,
  initialTickets,
  reports as seedReports,
} from "@/lib/data";
import type { ClientReport, DashboardRole, NewTicketInput, UploadReportInput } from "@/components/dashboard/types";
import { dashboardRoleMeta } from "@/components/dashboard/types";
import { cn, getInitials, uid } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Logo } from "@/components/brand/logo";
import { ToastProvider } from "@/components/ui/toast";
import { buttonStyles } from "@/components/ui/button";
import { ClientOverview } from "@/components/dashboard/client-overview";
import { ClientCampaigns } from "@/components/dashboard/client-campaigns";
import { ClientReports } from "@/components/dashboard/client-reports";
import { ClientSupport } from "@/components/dashboard/client-support";
import { AdminCommand } from "@/components/dashboard/admin-command";
import { AdminClients } from "@/components/dashboard/admin-clients";
import { AdminReports } from "@/components/dashboard/admin-reports";
import { AdminTickets } from "@/components/dashboard/admin-tickets";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

const clientNav: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, description: "Performance at a glance" },
  { id: "campaigns", label: "Campaigns", icon: Gauge, description: "Your active campaigns" },
  { id: "reports", label: "Reports & files", icon: FileText, description: "Reporting and creative" },
  { id: "support", label: "Support & requests", icon: LifeBuoy, description: "Talk to your growth pod" },
];

const adminNav: NavItem[] = [
  { id: "command", label: "Command center", icon: Command, description: "Agency performance" },
  { id: "clients", label: "Clients", icon: Users, description: "Portfolio management" },
  { id: "reports", label: "Report uploader", icon: FileText, description: "Publish client reports" },
  { id: "tickets", label: "Ticket desk", icon: Headphones, description: "Client support inbox" },
];

const fallbackReportDate = "Oct 23, 2026";

type DashboardViewer = {
  name: string;
  email: string;
};

function getViewerMeta(role: DashboardRole, viewer?: DashboardViewer) {
  const base = dashboardRoleMeta[role];
  const name = viewer?.name.trim() || base.name;

  return {
    ...base,
    name,
    initials: getInitials(name) || base.initials,
    email: viewer?.email ?? "",
  };
}

function Sidebar({
  role,
  viewer,
  activeView,
  onNavigate,
  onSignOut,
  ticketCount,
  onClose,
}: {
  role: DashboardRole;
  viewer?: DashboardViewer;
  activeView: string;
  onNavigate: (view: string) => void;
  onSignOut: () => void;
  ticketCount: number;
  onClose?: () => void;
}) {
  const nav = role === "client" ? clientNav : adminNav;
  const meta = getViewerMeta(role, viewer);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-white/[0.065] px-4">
        <Link href="/" aria-label="Back to NARA website" className="flex items-center rounded-md">
          <Logo markClassName="h-9" />
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/48 transition hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex w-full items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.022] p-2.5 text-left">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-[0.75rem] font-semibold",
              role === "client"
                ? "border-[#C8A97E]/20 bg-[#C8A97E]/10 text-[#D9C6A6]"
                : "border-electric/25 bg-electric/10 font-display text-electric-pale",
            )}
          >
            {role === "client" ? "AU" : "N"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-[0.8rem] font-semibold tracking-[0.08em] text-white/78">
              {role === "client" ? "AUREL" : "NARA Agency"}
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 text-[0.65rem] text-white/48">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              {role === "client" ? "Client workspace" : "Admin workspace"}
            </span>
          </span>
        </div>

        <div className="mt-6">
          <p className="px-3 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/48">Workspace</p>
          <nav aria-label={`${role} dashboard navigation`} className="mt-2 space-y-0.5">
            {nav.map((item) => {
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    onClose?.();
                  }}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all duration-200",
                    active ? "bg-white/[0.055] text-white" : "text-white/48 hover:bg-white/[0.028] hover:text-white/78",
                  )}
                >
                  {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-electric-soft shadow-[0_0_8px_rgba(91,140,255,0.7)]" />}
                  <item.icon className={cn("h-[1.05rem] w-[1.05rem] shrink-0 transition-colors", active ? "text-electric-soft" : "text-white/48 group-hover:text-white/62")} strokeWidth={1.7} />
                  <span className="flex-1 text-[0.8rem] font-medium">{item.label}</span>
                  {item.id === "support" || item.id === "tickets" ? (
                    ticketCount > 0 ? (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] px-1 text-[0.6rem] font-semibold text-white/55">
                        {ticketCount}
                      </span>
                    ) : null
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-6">
          <p className="px-3 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/48">Account</p>
          <nav aria-label="Account navigation" className="mt-2 space-y-0.5">
            <Link
              href="/"
              className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-white/48 transition hover:bg-white/[0.028] hover:text-white/70"
            >
              <PanelLeftClose className="h-[1.05rem] w-[1.05rem] text-white/48 group-hover:text-white/55" strokeWidth={1.7} />
              <span className="text-[0.8rem] font-medium">Main website</span>
            </Link>
            <a
              href="mailto:support@nara.agency"
              className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-white/48 transition hover:bg-white/[0.028] hover:text-white/70"
            >
              <MessageSquare className="h-[1.05rem] w-[1.05rem] text-white/48 group-hover:text-white/55" strokeWidth={1.7} />
              <span className="text-[0.8rem] font-medium">Contact support</span>
            </a>
          </nav>
        </div>

        <div className="mt-8 rounded-xl border border-white/[0.07] bg-[#0B0E16] p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-electric-soft/70" />
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/48">Secure workspace</p>
          </div>
          <p className="mt-1.5 text-[0.7rem] leading-4 text-white/48">
            Access is limited to your assigned role. Sessions expire after 8 hours.
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/[0.065] p-3">
        <div className="flex items-center gap-2.5 rounded-lg p-1.5">
          <Avatar initials={meta.initials} name={meta.name} accent={meta.accent} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.75rem] font-semibold text-white/78">{meta.name}</p>
            <p className="mt-0.5 truncate text-[0.65rem] text-white/48">{meta.role} · {meta.company}</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            aria-label="Sign out"
            className="flex h-6 w-6 items-center justify-center rounded-md text-white/48 transition hover:bg-white/[0.05] hover:text-white/70"
          >
            <LogOut className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

type Notification = { id: string; title: string; description: string; time: string; read: boolean };

const clientNotifications: Notification[] = [
  { id: "n1", title: "October report is ready", description: "Attributed revenue hit $1.198M at 4.82x ROAS.", time: "2h ago", read: false },
  { id: "n2", title: "Holiday creative approved", description: "The new batch is live in your report library.", time: "Yesterday", read: false },
  { id: "n3", title: "Retargeting budget update", description: "Dev has shared a recommendation for review.", time: "3d ago", read: true },
];

const adminNotifications: Notification[] = [
  { id: "n1", title: "Urgent ticket from AUREL", description: "Budget reallocation request is awaiting a response.", time: "2h ago", read: false },
  { id: "n2", title: "Revenue target surpassed", description: "October revenue is 10.9% above the monthly target.", time: "Yesterday", read: false },
  { id: "n3", title: "HALDEN health score dropped", description: "The account has moved into the at-risk band.", time: "2d ago", read: true },
];

export function DashboardShell({
  role,
  viewer,
}: {
  role: DashboardRole;
  viewer?: DashboardViewer;
}) {
  const [activeView, setActiveView] = useState(role === "admin" ? "command" : "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(
    role === "admin" ? adminNotifications : clientNotifications,
  );

  const [clients, setClients] = useState<Client[]>(initialClients);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [clientReports, setClientReports] = useState<ClientReport[]>(
    seedReports.map((report) => ({ ...report, client: "AUREL" })),
  );
  const ticketCounter = useRef(2419);

  const nav = role === "client" ? clientNav : adminNav;
  const activeNav = nav.find((item) => item.id === activeView) ?? nav[0];
  const meta = getViewerMeta(role, viewer);
  const unresolvedTickets = tickets.filter((ticket) => ticket.status !== "Resolved").length;
  const aurelTickets = tickets.filter((ticket) => ticket.client === "AUREL" && ticket.status !== "Resolved").length;
  const unread = notifications.some((notification) => !notification.read);

  useEffect(() => {
    if (!sidebarOpen) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navigate = useCallback((view: string) => {
    setActiveView(view);
    setSidebarOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const signOut = useCallback(async () => {
    setSidebarOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });
    } finally {
      window.location.replace("/login");
    }
  }, []);

  const createTicket = useCallback((input: NewTicketInput) => {
    const id = `NR-${ticketCounter.current++}`;
    const ticket: Ticket = {
      id,
      client: "AUREL",
      subject: input.subject,
      description: input.description,
      category: input.category,
      priority: input.priority,
      status: "Open",
      createdAt: fallbackReportDate,
      updatedAt: "Just now",
      assignee: "Maya Chen",
      messages: [
        {
          id: uid("msg"),
          from: "client",
          author: "Jordan Lee",
          initials: "JL",
          body: input.description,
          time: "Just now",
        },
      ],
    };
    setTickets((current) => [ticket, ...current]);
    return ticket;
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, status, updatedAt: "Just now" }
          : ticket,
      ),
    );
  }, []);

  const replyAsClient = useCallback((ticketId: string, body: string) => {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              updatedAt: "Just now",
              messages: [
                ...ticket.messages,
                {
                  id: uid("msg"),
                  from: "client" as const,
                  author: "Jordan Lee",
                  initials: "JL",
                  body,
                  time: "Just now",
                },
              ],
            }
          : ticket,
      ),
    );
  }, []);

  const replyAsAdmin = useCallback((ticketId: string, body: string) => {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: ticket.status === "Open" ? "In Progress" : ticket.status,
              updatedAt: "Just now",
              messages: [
                ...ticket.messages,
                {
                  id: uid("msg"),
                  from: "agency" as const,
                  author: "Maya Chen",
                  initials: "MC",
                  body,
                  time: "Just now",
                },
              ],
            }
          : ticket,
      ),
    );
  }, []);

  const addClient = useCallback((client: Client) => {
    setClients((current) => [...current, client]);
  }, []);

  const updateClient = useCallback((client: Client) => {
    setClients((current) => current.map((item) => (item.id === client.id ? client : item)));
  }, []);

  const deleteClient = useCallback((client: Client) => {
    setClients((current) => current.filter((item) => item.id !== client.id));
  }, []);

  const uploadReport = useCallback((input: UploadReportInput) => {
    const report: ClientReport = {
      id: uid("report"),
      title: input.title,
      type: input.type,
      category: input.category,
      period: input.period,
      size: input.fileSize,
      date: fallbackReportDate,
      status: "Ready",
      client: input.client,
      uploadedBy: "Maya Chen",
    };
    setClientReports((current) => [report, ...current]);
    return report;
  }, []);

  const visibleReports = useMemo(
    () =>
      role === "client"
        ? clientReports.filter((report) => report.client === "AUREL")
        : clientReports,
    [clientReports, role],
  );

  const markNotificationsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  };

  const renderView = () => {
    if (role === "client") {
      switch (activeView) {
        case "campaigns":
          return <ClientCampaigns onNavigate={navigate} />;
        case "reports":
          return <ClientReports reports={visibleReports} onNavigate={navigate} />;
        case "support":
          return (
            <ClientSupport
              tickets={tickets}
              onCreateTicket={createTicket}
              onReply={replyAsClient}
            />
          );
        default:
          return <ClientOverview onNavigate={navigate} />;
      }
    }

    switch (activeView) {
      case "clients":
        return <AdminClients clients={clients} onAddClient={addClient} onUpdateClient={updateClient} onDeleteClient={deleteClient} />;
      case "reports":
        return (
          <AdminReports
            clients={clients}
            reports={clientReports}
            onUpload={uploadReport}
          />
        );
      case "tickets":
        return (
          <AdminTickets
            tickets={tickets}
            onUpdateStatus={updateTicketStatus}
            onReply={replyAsAdmin}
          />
        );
      default:
        return <AdminCommand clients={clients} tickets={tickets} onNavigate={navigate} />;
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-canvas">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17.5rem] border-r border-white/[0.065] bg-[#080A10] lg:block">
          <Sidebar
            role={role}
            viewer={viewer}
            activeView={activeView}
            onNavigate={navigate}
            onSignOut={signOut}
            ticketCount={role === "client" ? aurelTickets : unresolvedTickets}
          />
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-[80] lg:hidden">
            <button
              type="button"
              aria-label="Close navigation overlay"
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 cursor-default bg-black/65 backdrop-blur-sm animate-fade-in"
            />
            <div className="relative z-10 h-full w-[18.25rem] border-r border-white/[0.08] bg-[#080A10] shadow-2xl animate-fade-in">
              <Sidebar
                role={role}
                viewer={viewer}
                activeView={activeView}
                onNavigate={navigate}
                onSignOut={signOut}
                ticketCount={role === "client" ? aurelTickets : unresolvedTickets}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        <div className="lg:pl-[17.5rem]">
          <header className="sticky top-0 z-30 flex h-[4.5rem] items-center justify-between gap-4 border-b border-white/[0.065] bg-[#070709]/78 px-4 backdrop-blur-2xl sm:px-6 lg:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-white/55 transition hover:text-white lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.12em] text-white/48">
                  <span className="hidden sm:inline">{role === "client" ? "Client workspace" : "Agency workspace"}</span>
                  <span className="hidden h-2.5 w-px bg-white/12 sm:block" />
                  <span className="hidden text-white/48 sm:inline">{activeNav.label}</span>
                </div>
                <p className="truncate text-[0.88rem] font-semibold tracking-[-0.01em] text-white/82 sm:mt-0.5">
                  {activeNav.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="mr-1 hidden items-center gap-1.5 rounded-md border border-white/[0.07] bg-white/[0.02] px-2 py-1 text-[0.65rem] text-white/48 xl:flex">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Q4 · Week 4
              </span>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen((value) => !value);
                    setProfileOpen(false);
                  }}
                  aria-label={`Notifications${unread ? " (unread)" : ""}`}
                  aria-expanded={notificationsOpen}
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-white/48 transition hover:border-white/[0.07] hover:bg-white/[0.03] hover:text-white"
                >
                  <Bell className="h-4 w-4" strokeWidth={1.7} />
                  {unread && <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full border border-[#070709] bg-electric-soft" />}
                </button>
                {notificationsOpen && (
                  <>
                    <button type="button" tabIndex={-1} aria-label="Close notifications" className="fixed inset-0 z-10 cursor-default" onClick={() => setNotificationsOpen(false)} />
                    <div className="absolute right-0 top-[calc(100%+0.65rem)] z-20 w-[20rem] overflow-hidden rounded-xl border border-white/[0.1] bg-[#0C1019] shadow-[0_24px_70px_-15px_rgba(0,0,0,0.9)] animate-scale-in">
                      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                        <p className="text-[0.8rem] font-semibold text-white/80">Notifications</p>
                        <button type="button" onClick={markNotificationsRead} className="text-[0.65rem] font-medium text-electric-pale/60 transition hover:text-white">
                          Mark all read
                        </button>
                      </div>
                      <div className="divide-y divide-white/[0.05]">
                        {notifications.map((notification) => (
                          <div key={notification.id} className={cn("flex gap-2.5 px-4 py-3", !notification.read && "bg-electric/[0.025]")}>
                            <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", notification.read ? "bg-white/15" : "bg-electric-soft")} />
                            <div>
                              <p className="text-[0.75rem] font-medium text-white/78">{notification.title}</p>
                              <p className="mt-0.5 text-[0.7rem] leading-4 text-white/48">{notification.description}</p>
                              <p className="mt-1 text-[0.6rem] text-white/48">{notification.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNotificationsOpen(false);
                          navigate(role === "client" ? "support" : "tickets");
                        }}
                        className="w-full border-t border-white/[0.07] py-2.5 text-center text-[0.7rem] font-medium text-white/48 transition hover:bg-white/[0.025] hover:text-white"
                      >
                        View all activity
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen((value) => !value);
                    setNotificationsOpen(false);
                  }}
                  aria-expanded={profileOpen}
                  aria-label="Account menu"
                  className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] py-1 pl-1 pr-2 transition hover:border-white/[0.12] sm:pr-2.5"
                >
                  <Avatar initials={meta.initials} name={meta.name} accent={meta.accent} size="sm" className="h-7 w-7 text-[0.7rem]" />
                  <div className="hidden text-left sm:block">
                    <p className="text-[0.7rem] font-semibold leading-none text-white/78">{meta.name}</p>
                    <p className="mt-1 text-[0.6rem] leading-none text-white/48">{role === "client" ? "Client" : "Admin"}</p>
                  </div>
                  <ChevronDown className={cn("hidden h-3 w-3 text-white/48 transition-transform sm:block", profileOpen && "rotate-180")} />
                </button>
                {profileOpen && (
                  <>
                    <button type="button" tabIndex={-1} aria-label="Close account menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-[calc(100%+0.65rem)] z-20 w-[16rem] overflow-hidden rounded-xl border border-white/[0.1] bg-[#0C1019] shadow-[0_24px_70px_-15px_rgba(0,0,0,0.9)] animate-scale-in">
                      <div className="border-b border-white/[0.07] p-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={meta.initials} name={meta.name} accent={meta.accent} size="md" />
                          <div>
                            <p className="text-[0.8rem] font-semibold text-white/80">{meta.name}</p>
                            <p className="mt-0.5 max-w-[10.5rem] truncate text-[0.65rem] text-white/48">
                              {meta.email || `${meta.role} · ${meta.company}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-1.5">
                        <p className="px-2 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/48">Workspace access</p>
                        <div className="flex items-center gap-2 rounded-md px-2 py-2 text-[0.75rem] text-white/55">
                          <ShieldCheck className="h-3.5 w-3.5 text-white/48" />
                          {role === "client" ? "Client access" : "Agency access"}
                          <span className="ms-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </div>
                      </div>
                      <div className="border-t border-white/[0.07] p-1.5">
                        <Link href="/" className="flex items-center gap-2 rounded-md px-2 py-2 text-[0.75rem] text-white/48 transition hover:bg-white/[0.04] hover:text-white/70">
                          <PanelLeftClose className="h-3.5 w-3.5" />
                          Back to website
                        </Link>
                        <button
                          type="button"
                          onClick={signOut}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[0.75rem] text-white/48 transition hover:bg-white/[0.04] hover:text-white/70"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <main id="main-content" className="dashboard-grid-bg min-h-[calc(100vh-4.5rem)] px-4 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
            <div className="mx-auto max-w-[96rem]">{renderView()}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
