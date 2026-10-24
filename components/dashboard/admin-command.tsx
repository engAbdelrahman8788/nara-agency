"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Download,
  FileUp,
  Plus,
  RotateCcw,
  Ticket as TicketIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Client, Ticket } from "@/lib/data";
import { adminRevenue, recentAdminActivity, teamUtilization } from "@/lib/data";
import { cn } from "@/lib/utils";
import { downloadCsv } from "@/lib/download";
import { Button, buttonStyles } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import {
  DashboardCard,
  DateBadge,
  KpiCard,
  MiniProgress,
  PageHeader,
  PriorityLabel,
  SectionHeader,
  StatusPill,
} from "@/components/dashboard/ui";

const priorityOrder: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

function RetainerChart() {
  const [activeIndex, setActiveIndex] = useState(adminRevenue.length - 1);
  const activeMonth = adminRevenue[activeIndex];
  const max = Math.max(...adminRevenue.flatMap((month) => [month.revenue, month.target])) * 1.16;
  const growth = ((activeMonth.revenue - activeMonth.target) / activeMonth.target) * 100;

  return (
    <DashboardCard className="h-full">
      <SectionHeader
        title="Retainer revenue"
        description="Agency revenue vs. monthly target"
        action={
          <span className="flex items-center gap-1.5 rounded-md border border-emerald-400/15 bg-emerald-400/[0.06] px-2 py-1 text-[0.65rem] font-medium text-emerald-300">
            <TrendingUp className="h-2.5 w-2.5" />
            +44.9% YTD
          </span>
        }
      />

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.13em] text-white/48">{activeMonth.month} 2026 revenue</p>
          <p className="mt-1.5 font-display text-[1.9rem] font-medium leading-none tracking-[-0.04em] text-white">
            ${activeMonth.revenue.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-5 text-right">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.1em] text-white/48">Target</p>
            <p className="mt-1 text-[0.84rem] font-medium tabular-nums text-white/62">${(activeMonth.target / 1000).toFixed(0)}k</p>
          </div>
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.1em] text-white/48">vs. target</p>
            <p className={cn("mt-1 text-[0.84rem] font-semibold tabular-nums", growth >= 0 ? "text-emerald-300" : "text-red-300")}>
              {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex h-40 items-end gap-2 sm:gap-4">
          {adminRevenue.map((month, index) => {
            const revenueHeight = (month.revenue / max) * 100;
            const targetHeight = (month.target / max) * 100;
            const isActive = activeIndex === index;
            return (
              <button
                key={month.month}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
                aria-label={`${month.month}: $${month.revenue.toLocaleString()} revenue against $${month.target.toLocaleString()} target`}
                className="group relative flex h-full flex-1 flex-col justify-end focus-visible:outline-offset-4"
              >
                <span
                  className={cn(
                    "pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded border border-white/10 bg-[#0A0D15] px-2 py-1 text-[0.65rem] font-medium text-white/70 opacity-0 shadow-lg transition-opacity group-hover:opacity-100",
                    isActive && "opacity-100",
                  )}
                  style={{ bottom: `calc(${revenueHeight}% + 10px)` }}
                >
                  ${(month.revenue / 1000).toFixed(0)}k
                </span>
                <div className="relative w-full overflow-hidden rounded-t-[4px]" style={{ height: `${Math.max(revenueHeight, 2)}%` }}>
                  <div
                    className={cn(
                      "absolute inset-0 transition-all duration-500",
                      isActive
                        ? "bg-gradient-to-t from-[#003EDA] via-[#0C53FF] to-[#7FA3FF] shadow-[0_0_30px_-4px_rgba(0,75,255,0.6)]"
                        : "bg-gradient-to-t from-white/[0.07] to-white/[0.19] group-hover:from-electric/25 group-hover:to-electric-soft/40",
                    )}
                  />
                  <div className="absolute inset-0 bg-grid-fine opacity-[0.08]" />
                </div>
                <div className="absolute inset-x-0 border-t border-dashed border-white/20" style={{ bottom: `${targetHeight}%` }}>
                  <span className="absolute -right-0.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-white/40 bg-[#0F121C]" />
                </div>
                <span className={cn("mt-3 text-center text-[0.7rem] transition-colors", isActive ? "font-semibold text-white" : "text-white/48 group-hover:text-white/62")}>
                  {month.month}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.055] pt-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[0.65rem] text-white/48">
              <span className="h-2 w-2 rounded-sm bg-gradient-to-t from-[#003EDA] to-[#7FA3FF]" />
              Retainer revenue
            </span>
            <span className="flex items-center gap-1.5 text-[0.65rem] text-white/48">
              <span className="h-px w-4 border-t border-dashed border-white/35" />
              Monthly target
            </span>
          </div>
          <span className="text-[0.65rem] text-white/48">Click a month to inspect</span>
        </div>
      </div>
    </DashboardCard>
  );
}

const activityIcons = {
  upload: FileUp,
  budget: CircleDollarSign,
  client: Building2,
  ticket: CheckCircle2,
};

export function AdminCommand({
  clients,
  tickets,
  onNavigate,
}: {
  clients: Client[];
  tickets: Ticket[];
  onNavigate: (view: string) => void;
}) {
  const { toast } = useToast();
  const totalRevenue = clients.reduce((total, client) => total + client.budget, 0);
  const activeRetainers = clients.filter((client) => client.status !== "Onboarding").length;
  const pendingTickets = tickets.filter((ticket) => ticket.status !== "Resolved");
  const urgentTickets = pendingTickets.filter((ticket) => ticket.priority === "Urgent").length;
  const atRisk = clients.filter((client) => client.status === "At risk").length;

  const prioritizedTickets = useMemo(
    () =>
      [...pendingTickets]
        .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        .slice(0, 3),
    [pendingTickets],
  );

  const exportSnapshot = () => {
    downloadCsv(
      "nara-agency-snapshot-october-2026.csv",
      ["Client", "Industry", "Account manager", "Monthly budget", "Status", "Tenure", "Contact"],
      clients.map((client) => [client.name, client.industry, client.manager, client.budget, client.status, client.tenure, client.email]),
    );
    toast({
      title: "Agency snapshot exported",
      description: `${clients.length} client accounts included in the CSV.`,
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Agency command center"
        title="Everything in motion."
        description="A clear view of revenue, retainers, and the decisions that need you. Friday, October 23."
        actions={
          <>
            <DateBadge label="October 2026" />
            <Button variant="secondary" size="sm" onClick={exportSnapshot} className="h-9">
              <Download className="h-3.5 w-3.5" />
              Export snapshot
            </Button>
            <Button size="sm" onClick={() => onNavigate("clients")} className="h-9">
              <Plus className="h-3.5 w-3.5" />
              Add client
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total monthly revenue"
          value={`$${(totalRevenue / 1000).toFixed(1)}k`}
          change="12.8%"
          trend="up"
          icon={CircleDollarSign}
          tone="emerald"
          sparkline={[30, 34, 38, 36, 45, 51, 49, 58, 62, 60, 71, 78]}
          hint={`Across ${activeRetainers} retained accounts`}
        />
        <KpiCard
          label="Active retainers"
          value={`${activeRetainers}`}
          change="1"
          detail="new this month"
          icon={RotateCcw}
          tone="blue"
          sparkline={[26, 28, 30, 33, 32, 38, 41, 43, 48, 52, 58, 63]}
          hint="Average tenure: 11.8 months"
        />
        <KpiCard
          label="Total clients"
          value={`${clients.length}`}
          change={`${clients.filter((client) => client.status === "Onboarding").length}`}
          detail="onboarding"
          icon={Users}
          tone="violet"
          sparkline={[22, 25, 24, 30, 33, 35, 38, 43, 45, 48, 52, 56]}
          hint={`${atRisk} account${atRisk === 1 ? "" : "s"} flagged at risk`}
        />
        <KpiCard
          label="Pending tickets"
          value={`${pendingTickets.length}`}
          change={`${urgentTickets} urgent`}
          trend="down"
          detail="needs attention"
          icon={TicketIcon}
          tone="sky"
          sparkline={[54, 48, 51, 45, 42, 46, 40, 38, 35, 31, 28, 24]}
          hint="Median first response: 1h 42m"
        />
      </div>

      <div className="grid gap-3.5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <RetainerChart />
        </div>

        <div className="xl:col-span-4">
          <DashboardCard className="flex h-full flex-col">
            <SectionHeader
              title="Agency pulse"
              action={
                <span className="flex items-center gap-1.5 text-[0.65rem] font-medium text-emerald-300/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Healthy
                </span>
              }
            />
            <div className="mt-5 flex items-center gap-5">
              <div className="relative flex h-[5.25rem] w-[5.25rem] shrink-0 items-center justify-center">
                <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="5" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#004BFF" strokeWidth="5" strokeLinecap="round" strokeDasharray="209.5 213.6" />
                </svg>
                <div className="text-center">
                  <p className="font-display text-xl font-medium leading-none text-white">98%</p>
                  <p className="mt-1 text-[0.55rem] uppercase tracking-[0.1em] text-white/48">Retention</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[0.75rem] leading-5 text-white/48">
                  Client retention remains above the 95% agency target.
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[0.65rem] text-emerald-300/70">
                  <TrendingUp className="h-3 w-3" />
                  +3.2% vs. last quarter
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { label: "Average client health", value: 92, display: "92 / 100" },
                { label: "On-time report delivery", value: 100, display: "100%" },
                { label: "Average team utilization", value: 78, display: "78%" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-[0.75rem]">
                    <span className="text-white/48">{item.label}</span>
                    <span className="font-medium tabular-nums text-white/62">{item.display}</span>
                  </div>
                  <MiniProgress value={item.value} className="mt-2" tone={item.value > 95 ? "emerald" : "blue"} />
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-amber-400/12 bg-amber-400/[0.045] p-3">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <div className="flex-1">
                <p className="text-[0.75rem] font-medium text-amber-200/75">{atRisk} account needs attention</p>
                <p className="mt-0.5 text-[0.65rem] leading-4 text-white/48">HALDEN&apos;s health score dipped below the 80 threshold.</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("clients")}
                className="mt-0.5 text-[0.65rem] font-semibold text-amber-200/70 transition hover:text-white"
              >
                Review
              </button>
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="grid gap-3.5 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <DashboardCard padding={false} className="h-full">
            <div className="p-5 sm:p-6">
              <SectionHeader
                title="Client portfolio"
                description={`${clients.length} accounts · $${(totalRevenue / 1000).toFixed(1)}k monthly revenue`}
                action={
                  <button
                    type="button"
                    onClick={() => onNavigate("clients")}
                    className="group inline-flex items-center gap-1 text-[0.75rem] font-semibold text-electric-pale/70 transition hover:text-white"
                  >
                    Manage clients
                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </button>
                }
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[38rem] text-left">
                <thead>
                  <tr className="border-y border-white/[0.055] bg-white/[0.012] text-[0.65rem] uppercase tracking-[0.12em] text-white/48">
                    <th className="py-2.5 pl-5 font-medium sm:pl-6">Client</th>
                    <th className="py-2.5 font-medium">Account manager</th>
                    <th className="py-2.5 text-right font-medium">Monthly</th>
                    <th className="py-2.5 font-medium">Health</th>
                    <th className="py-2.5 pr-5 text-right font-medium sm:pr-6">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.slice(0, 5).map((client) => (
                    <tr key={client.id} className="border-b border-white/[0.045] last:border-b-0 hover:bg-white/[0.018]">
                      <td className="py-3 pl-5 sm:pl-6">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] font-display text-[0.65rem] font-semibold tracking-tight text-white/70"
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
                      <td className="py-3 text-[0.75rem] text-white/48">{client.manager}</td>
                      <td className="py-3 text-right text-[0.75rem] font-medium tabular-nums text-white/62">
                        ${(client.budget / 1000).toFixed(0)}k
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <MiniProgress value={client.status === "At risk" ? 72 : 91} className="w-14" tone={client.status === "At risk" ? "amber" : "emerald"} />
                          <span className={cn("text-[0.65rem] tabular-nums", client.status === "At risk" ? "text-amber-300/70" : "text-white/48")}>
                            {client.status === "At risk" ? "72" : "91"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-5 text-right sm:pr-6"><StatusPill status={client.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-4">
          <DashboardCard className="flex h-full flex-col">
            <SectionHeader
              title="Support queue"
              description={`${pendingTickets.length} requests need attention`}
              action={
                <button type="button" onClick={() => onNavigate("tickets")} className="text-[0.7rem] font-semibold text-electric-pale/65 transition hover:text-white">
                  Open desk
                </button>
              }
            />
            <div className="mt-4 space-y-2.5">
              {prioritizedTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => onNavigate("tickets")}
                  className="group w-full rounded-lg border border-white/[0.06] bg-white/[0.018] p-3 text-left transition hover:border-white/[0.13] hover:bg-white/[0.03]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[0.6rem] text-white/48">{ticket.id}</span>
                      <span className="text-[0.65rem] font-medium text-white/55">{ticket.client}</span>
                    </span>
                    <StatusPill status={ticket.status} />
                  </div>
                  <p className="mt-2 text-[0.75rem] font-medium text-white/70 transition-colors group-hover:text-white">{ticket.subject}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <PriorityLabel priority={ticket.priority} />
                    <span className="text-[0.65rem] text-white/48">{ticket.updatedAt}</span>
                  </div>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => onNavigate("tickets")} className={buttonStyles({ variant: "secondary", size: "sm", className: "mt-4 w-full" })}>
              View all tickets
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </DashboardCard>
        </div>
      </div>

      <div className="grid gap-3.5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <DashboardCard className="h-full">
            <SectionHeader title="Team utilization" description="Current capacity across account leads" action={<span className="text-[0.65rem] text-white/48">78% avg.</span>} />
            <div className="mt-5 space-y-4">
              {teamUtilization.map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <Avatar initials={member.initials} name={member.name} size="sm" accent="from-[#1e293b] to-[#0f172a]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-baseline gap-2">
                        <p className="text-[0.75rem] font-medium text-white/70">{member.name}</p>
                        <p className="hidden text-[0.65rem] text-white/48 sm:block">{member.role}</p>
                      </div>
                      <span className={cn("text-[0.7rem] font-medium tabular-nums", member.utilization >= 90 ? "text-amber-300/80" : "text-white/48")}>
                        {member.utilization}%
                      </span>
                    </div>
                    <MiniProgress
                      value={member.utilization}
                      className="mt-2"
                      tone={member.utilization >= 90 ? "amber" : "blue"}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-lg border border-white/[0.055] bg-white/[0.015] px-3 py-2.5">
              <p className="text-[0.7rem] text-white/48">Available capacity this week</p>
              <p className="text-[0.75rem] font-semibold text-emerald-300/75">38 hours</p>
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-5">
          <DashboardCard className="h-full">
            <SectionHeader title="Recent activity" action={<span className="text-[0.65rem] text-white/48">Today</span>} />
            <div className="mt-5 space-y-0">
              {recentAdminActivity.map((activity, index) => {
                const Icon = activityIcons[activity.type as keyof typeof activityIcons] ?? CheckCircle2;
                return (
                  <div key={activity.id} className="relative flex gap-3 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.025] text-white/48">
                        <Icon className="h-3 w-3" />
                      </span>
                      {index !== recentAdminActivity.length - 1 && <span className="mt-1.5 w-px flex-1 bg-white/[0.06]" />}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-[0.75rem] leading-5 text-white/55">{activity.text}</p>
                      <p className="mt-0.5 text-[0.65rem] text-white/48">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
