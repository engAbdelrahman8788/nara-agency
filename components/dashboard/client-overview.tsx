"use client";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  CreditCard,
  Download,
  MousePointerClick,
  Percent,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import {
  DashboardCard,
  DateBadge,
  KpiCard,
  MiniProgress,
  PageHeader,
  PlatformMark,
  SectionHeader,
  StatusPill,
} from "@/components/dashboard/ui";
import { accountHealth, campaigns, channelBreakdown, monthlyRoadmap } from "@/lib/data";
import { cn } from "@/lib/utils";

const team = [
  { name: "Maya Chen", role: "Growth Director", initials: "MC", accent: "from-[#5B8CFF] to-[#0030B4]", online: true },
  { name: "Dev Patel", role: "Senior Media Buyer", initials: "DP", accent: "from-[#C8A97E] to-[#6B5136]", online: true },
  { name: "Iris Chen", role: "Creative Director", initials: "IC", accent: "from-[#7C5CFF] to-[#3B1D9C]", online: false },
];

const topCampaigns = [...campaigns].sort((a, b) => b.roas - a.roas).slice(0, 5);

function ChannelDonut() {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-label="Spend allocation by channel" role="img">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="9" />
        {channelBreakdown.map((channel) => {
          const length = (channel.value / 100) * circumference;
          const offset = -accumulated;
          accumulated += length;
          return (
            <circle
              key={channel.name}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={channel.color}
              strokeWidth="9"
              strokeDasharray={`${Math.max(length - 4, 0)} ${circumference - Math.max(length - 4, 0)}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
              className="transition-all duration-700"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-medium tracking-[-0.04em] text-white">4.82x</span>
        <span className="mt-0.5 text-[0.65rem] uppercase tracking-[0.12em] text-white/48">Blended ROAS</span>
      </div>
    </div>
  );
}

export function ClientOverview({ onNavigate }: { onNavigate: (view: string) => void }) {
  const { toast } = useToast();

  const downloadReport = () => {
    toast({
      title: "Report download started",
      description: "October Performance Report · PDF · 4.8 MB",
      tone: "success",
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="AUREL · Client workspace"
        title="Good morning, Jordan."
        description="Here's how your growth engine is tracking this month. Q4 is pacing 12% ahead of plan."
        actions={
          <>
            <DateBadge label="Oct 2026" />
            <Button variant="secondary" size="sm" onClick={downloadReport} className="h-9">
              <Download className="h-3.5 w-3.5" />
              Download report
            </Button>
            <Button size="sm" onClick={() => onNavigate("campaigns")} className="h-9">
              View campaigns
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total ad spend"
          value="$248,560"
          change="12.4%"
          trend="up"
          icon={CreditCard}
          tone="blue"
          sparkline={[28, 34, 31, 43, 38, 52, 48, 61, 66, 72, 68, 84]}
          hint="74% of $335k quarterly budget"
        />
        <KpiCard
          label="Blended ROAS"
          value="4.82x"
          change="0.63x"
          trend="up"
          icon={TrendingUp}
          tone="emerald"
          sparkline={[22, 28, 25, 34, 31, 42, 45, 43, 55, 53, 64, 72]}
          hint="0.42x above 4.4x target"
        />
        <KpiCard
          label="Conversions"
          value="8,429"
          change="18.2%"
          trend="up"
          icon={MousePointerClick}
          tone="violet"
          sparkline={[18, 26, 22, 35, 30, 41, 44, 40, 57, 62, 68, 78]}
          hint="1,601 new customers acquired"
        />
        <KpiCard
          label="Click-through rate"
          value="3.84%"
          change="0.6%"
          trend="up"
          icon={Percent}
          tone="sky"
          sparkline={[32, 30, 36, 33, 41, 38, 44, 42, 49, 47, 55, 58]}
          hint="Creative refresh due in 6 days"
        />
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <PerformanceChart />
        </div>

        <div className="xl:col-span-4">
          <DashboardCard className="flex h-full flex-col">
            <SectionHeader
              title="Spend allocation"
              description="By channel · October"
              action={<span className="text-[0.7rem] text-white/48">$248.5k total</span>}
            />
            <div className="mt-8">
              <ChannelDonut />
            </div>
            <div className="mt-8 flex-1 space-y-3.5">
              {channelBreakdown.map((channel) => (
                <div key={channel.name} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: channel.color }} />
                  <span className="flex-1 text-[0.8rem] text-white/55">{channel.name}</span>
                  <span className="text-[0.75rem] tabular-nums text-white/48">{channel.spend}</span>
                  <span className="w-7 text-right text-[0.75rem] font-semibold tabular-nums text-white/78">{channel.value}%</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onNavigate("campaigns")}
              className="group mt-6 flex w-full items-center justify-between border-t border-white/[0.06] pt-4 text-[0.8rem] font-medium text-white/55 transition-colors hover:text-white"
            >
              View full media plan
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </DashboardCard>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <DashboardCard padding={false} className="h-full">
            <div className="p-5 pb-4 sm:px-6 sm:pt-5">
              <SectionHeader
                title="Top campaigns"
                description="Ranked by blended ROAS this month"
                action={
                  <button
                    type="button"
                    onClick={() => onNavigate("campaigns")}
                    className="group inline-flex items-center gap-1 text-[0.75rem] font-semibold text-electric-pale/70 transition hover:text-white"
                  >
                    View all
                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </button>
                }
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left">
                <thead>
                  <tr className="border-y border-white/[0.055] bg-white/[0.012] text-[0.65rem] uppercase tracking-[0.12em] text-white/48">
                    <th className="py-2.5 pl-5 font-medium sm:pl-6">Campaign</th>
                    <th className="py-2.5 font-medium">Status</th>
                    <th className="py-2.5 text-right font-medium">Spend</th>
                    <th className="py-2.5 text-right font-medium">ROAS</th>
                    <th className="py-2.5 pr-5 text-right font-medium sm:pr-6">Conv.</th>
                  </tr>
                </thead>
                <tbody>
                  {topCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-white/[0.045] transition-colors hover:bg-white/[0.02]">
                      <td className="py-3.5 pl-5 sm:pl-6">
                        <div className="flex items-center gap-2.5">
                          <PlatformMark platform={campaign.platform} />
                          <div className="min-w-0">
                            <p className="max-w-[14rem] truncate text-[0.8rem] font-medium text-white/78">{campaign.name}</p>
                            <p className="mt-0.5 text-[0.65rem] text-white/48">{campaign.platform} · {campaign.objective}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5"><StatusPill status={campaign.status} /></td>
                      <td className="py-3.5 text-right text-[0.8rem] tabular-nums text-white/55">
                        ${(campaign.spend / 1000).toFixed(1)}k
                      </td>
                      <td className="py-3.5 text-right">
                        <span className={cn("text-[0.8rem] font-semibold tabular-nums", campaign.roas >= 5 ? "text-emerald-300" : "text-white/78")}>
                          {campaign.roas.toFixed(2)}x
                        </span>
                      </td>
                      <td className="py-3.5 pr-5 text-right text-[0.8rem] tabular-nums text-white/55 sm:pr-6">
                        {campaign.conversions.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/[0.055] px-5 py-3 sm:px-6">
              <span className="text-[0.65rem] text-white/48">
                Showing 5 of {campaigns.length} campaigns · Synced 2 min ago
              </span>
              <button
                type="button"
                onClick={() => onNavigate("campaigns")}
                className="group inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-white/48 transition hover:text-white"
              >
                All campaigns
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-3.5 xl:col-span-4">
          <DashboardCard>
            <SectionHeader
              title="Account health"
              action={
                <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/15 bg-emerald-400/[0.06] px-2 py-1 text-[0.65rem] font-semibold text-emerald-300">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  Excellent
                </span>
              }
            />
            <div className="mt-5 flex items-center gap-4">
              <div className="relative flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center">
                <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="#5B8CFF"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${(accountHealth.score / 100) * 213.6} 213.6`}
                  />
                </svg>
                <div className="text-center">
                  <p className="font-display text-lg font-medium leading-none text-white">{accountHealth.score}</p>
                  <p className="mt-0.5 text-[0.55rem] uppercase tracking-[0.1em] text-white/48">Score</p>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {accountHealth.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2 text-[0.75rem]">
                    <span className="text-white/48">{item.label}</span>
                    <span className={item.tone === "warn" ? "font-medium text-amber-300/80" : "font-medium text-emerald-300/80"}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-amber-400/12 bg-amber-400/[0.045] px-3 py-2.5">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/70" />
                <div>
                  <p className="text-[0.75rem] font-medium text-amber-200/75">Creative refresh suggested</p>
                  <p className="mt-0.5 text-[0.7rem] leading-4 text-white/48">Holiday batch arrives in 2 days. No action needed.</p>
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard>
            <SectionHeader title="Your growth pod" description="Senior team, direct access" />
            <div className="mt-4 space-y-2.5">
              {team.map((member) => (
                <div key={member.name} className="flex items-center gap-2.5">
                  <div className="relative">
                    <Avatar initials={member.initials} name={member.name} accent={member.accent} size="sm" />
                    {member.online && <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-surface bg-emerald-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.8rem] font-medium text-white/78">{member.name}</p>
                    <p className="text-[0.65rem] text-white/48">{member.role}</p>
                  </div>
                  <span className="rounded border border-white/[0.07] px-1.5 py-0.5 text-[0.6rem] text-white/48">Your pod</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onNavigate("support")}
              className={buttonStyles({ variant: "secondary", size: "sm", className: "mt-4 w-full" })}
            >
              Message your team
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </DashboardCard>
        </div>
      </div>

      <DashboardCard padding={false}>
        <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <SectionHeader title="Your next 90 days" description="Q4 growth roadmap · reviewed monthly" />
          <button
            type="button"
            onClick={() => onNavigate("reports")}
            className="group inline-flex items-center gap-1 self-start text-[0.75rem] font-semibold text-white/48 transition hover:text-white sm:self-auto"
          >
            Open roadmap
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
        <div className="grid border-t border-white/[0.055] sm:grid-cols-2 lg:grid-cols-4">
          {monthlyRoadmap.map((item) => (
            <div key={item.month} className="relative border-b border-white/[0.055] p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:border-r lg:[&:nth-child(2n)]:border-r lg:last:border-r-0 sm:px-6">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/48">{item.month}</span>
                {item.status === "done" ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-electric/15 text-electric-soft">
                    <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                  </span>
                ) : item.status === "active" ? (
                  <span className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-electric-pale">
                    <span className="h-1 w-1 animate-pulse rounded-full bg-electric-soft" />
                    Active
                  </span>
                ) : (
                  <span className="text-[0.65rem] uppercase tracking-[0.08em] text-white/48">Upcoming</span>
                )}
              </div>
              <p className="mt-2.5 text-[0.84rem] font-medium text-white/70">{item.title}</p>
              <MiniProgress
                value={item.status === "done" ? 100 : item.status === "active" ? 62 : 0}
                className="mt-3"
                tone={item.status === "done" ? "emerald" : "blue"}
              />
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
