"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Download,
  Filter,
  Megaphone,
  Search,
  SlidersHorizontal,
  Wallet,
  X,
} from "lucide-react";
import type { Campaign, CampaignStatus, Platform } from "@/lib/data";
import { campaigns } from "@/lib/data";
import { cn } from "@/lib/utils";
import { downloadCsv } from "@/lib/download";
import { Button, buttonStyles } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import {
  DashboardCard,
  KpiCard,
  MiniProgress,
  PageHeader,
  PlatformMark,
  SectionHeader,
  StatusPill,
} from "@/components/dashboard/ui";
import { TrendingUp } from "lucide-react";

const platforms: Array<Platform | "All"> = ["All", "Meta", "Google", "TikTok"];
const statuses: Array<CampaignStatus | "All"> = ["All", "Active", "Optimizing", "Paused"];

export function ClientCampaigns({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<Platform | "All">("All");
  const [status, setStatus] = useState<CampaignStatus | "All">("All");
  const [selected, setSelected] = useState<Campaign | null>(null);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return campaigns.filter((campaign) => {
      const matchesSearch = !query || campaign.name.toLowerCase().includes(query) || campaign.objective.toLowerCase().includes(query);
      const matchesPlatform = platform === "All" || campaign.platform === platform;
      const matchesStatus = status === "All" || campaign.status === status;
      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [search, platform, status]);

  const totalSpend = campaigns.reduce((total, campaign) => total + campaign.spend, 0);
  const totalBudget = campaigns.reduce((total, campaign) => total + campaign.budget, 0);
  const totalRevenue = campaigns.reduce((total, campaign) => total + campaign.revenue, 0);
  const averageRoas = totalRevenue / totalSpend;
  const activeCount = campaigns.filter((campaign) => campaign.status === "Active").length;

  const exportCampaigns = () => {
    downloadCsv(
      "nara-campaigns-october-2026.csv",
      ["Campaign", "Platform", "Status", "Objective", "Spend", "Budget", "Revenue", "ROAS", "Conversions", "CTR", "Start date"],
      filtered.map((campaign) => [
        campaign.name,
        campaign.platform,
        campaign.status,
        campaign.objective,
        campaign.spend,
        campaign.budget,
        campaign.revenue,
        campaign.roas,
        campaign.conversions,
        `${campaign.ctr}%`,
        campaign.startDate,
      ]),
    );
    toast({
      title: "Campaign export ready",
      description: `${filtered.length} campaigns exported as CSV.`,
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Campaigns"
        title="Campaign command."
        description="Every active bet across your media portfolio, in one place. Spend, efficiency, and pacing — always current."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={exportCampaigns} className="h-9">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button size="sm" onClick={() => onNavigate("support")} className="h-9">
              <Megaphone className="h-3.5 w-3.5" />
              New campaign request
            </Button>
          </>
        }
      />

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active campaigns"
          value={`${activeCount}`}
          change="2"
          detail="optimizing"
          icon={Megaphone}
          tone="blue"
          sparkline={[3, 3, 4, 4, 4, 3, 4, 4]}
        />
        <KpiCard
          label="October spend"
          value={`$${(totalSpend / 1000).toFixed(1)}k`}
          change="12.4%"
          detail="vs. last month"
          icon={Wallet}
          tone="violet"
          sparkline={[22, 28, 27, 32, 37, 34, 43, 48]}
        />
        <KpiCard
          label="Attributed revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}k`}
          change="18.6%"
          detail="vs. last month"
          icon={TrendingUp}
          tone="emerald"
          sparkline={[30, 36, 33, 45, 52, 49, 64, 72]}
        />
        <KpiCard
          label="Blended ROAS"
          value={`${averageRoas.toFixed(2)}x`}
          change="0.42x"
          detail="vs. 4.4x target"
          icon={SlidersHorizontal}
          tone="sky"
          sparkline={[26, 28, 31, 29, 38, 35, 42, 46]}
        />
      </div>

      <DashboardCard padding={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="All campaigns"
            description={`${campaigns.length} campaigns across 3 platforms · $${(totalSpend / 1000).toFixed(1)}k of $${(totalBudget / 1000).toFixed(0)}k budget used`}
            action={
              <span className="hidden items-center gap-1.5 text-[0.7rem] text-white/48 sm:flex">
                <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
                Synced 2 min ago
              </span>
            }
          />

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[17rem]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/48" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search campaigns..."
                aria-label="Search campaigns"
                className="h-9 w-full rounded-lg border border-white/[0.08] bg-black/15 pl-9 pr-8 text-[0.8rem] text-white placeholder:text-white/48 transition-colors focus:border-electric/40"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-white/48 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-lg border border-white/[0.08] bg-black/15 p-0.5" role="group" aria-label="Filter by platform">
                {platforms.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPlatform(option)}
                    aria-pressed={platform === option}
                    className={cn(
                      "rounded-md px-2.5 py-1.5 text-[0.7rem] font-medium transition-colors",
                      platform === option ? "bg-white/[0.09] text-white" : "text-white/48 hover:text-white/70",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/48" />
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as CampaignStatus | "All")}
                  aria-label="Filter by status"
                  className="h-9 cursor-pointer rounded-lg border border-white/[0.08] bg-black/15 pl-8 pr-8 text-[0.75rem] text-white/62 transition-colors focus:border-electric/40"
                >
                  {statuses.map((option) => (
                    <option key={option} value={option}>{option === "All" ? "All statuses" : option}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/48" />
              </div>
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[58rem] text-left">
                <thead>
                  <tr className="border-y border-white/[0.055] bg-white/[0.012] text-[0.65rem] uppercase tracking-[0.12em] text-white/48">
                    <th className="py-2.5 pl-6 font-medium">Campaign</th>
                    <th className="py-2.5 font-medium">Status</th>
                    <th className="py-2.5 font-medium">Budget pacing</th>
                    <th className="py-2.5 text-right font-medium">ROAS</th>
                    <th className="py-2.5 text-right font-medium">Conversions</th>
                    <th className="py-2.5 text-right font-medium">CTR</th>
                    <th className="w-12 py-2.5 pr-6 font-medium"><span className="sr-only">View details</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((campaign) => {
                    const pacing = Math.round((campaign.spend / campaign.budget) * 100);
                    return (
                      <tr key={campaign.id} className="group border-b border-white/[0.045] transition-colors last:border-b-0 hover:bg-white/[0.018]">
                        <td className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <PlatformMark platform={campaign.platform} />
                            <div>
                              <p className="max-w-[18rem] truncate text-[0.8rem] font-medium text-white/78 transition-colors group-hover:text-white">
                                {campaign.name}
                              </p>
                              <p className="mt-0.5 text-[0.65rem] text-white/48">{campaign.platform} · {campaign.objective}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4"><StatusPill status={campaign.status} /></td>
                        <td className="py-4">
                          <div className="w-[8.5rem]">
                            <div className="flex items-center justify-between gap-2 text-[0.7rem]">
                              <span className="tabular-nums text-white/55">${(campaign.spend / 1000).toFixed(1)}k</span>
                              <span className="tabular-nums text-white/48">of ${(campaign.budget / 1000).toFixed(0)}k</span>
                            </div>
                            <MiniProgress
                              value={pacing}
                              className="mt-1.5"
                              tone={pacing > 92 ? "amber" : campaign.status === "Paused" ? "violet" : "blue"}
                            />
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <span className={cn("text-[0.84rem] font-semibold tabular-nums", campaign.roas >= 5 ? "text-emerald-300" : "text-white/78")}>
                            {campaign.roas.toFixed(2)}x
                          </span>
                        </td>
                        <td className="py-4 text-right text-[0.8rem] tabular-nums text-white/55">{campaign.conversions.toLocaleString()}</td>
                        <td className="py-4 text-right text-[0.8rem] tabular-nums text-white/55">{campaign.ctr}%</td>
                        <td className="py-4 pr-6 text-right">
                          <button
                            type="button"
                            onClick={() => setSelected(campaign)}
                            aria-label={`View details for ${campaign.name}`}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-white/48 transition hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-white/[0.05] md:hidden">
              {filtered.map((campaign) => {
                const pacing = Math.round((campaign.spend / campaign.budget) * 100);
                return (
                  <button
                    key={campaign.id}
                    type="button"
                    onClick={() => setSelected(campaign)}
                    className="flex w-full flex-col gap-3 p-5 text-left transition hover:bg-white/[0.02]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <PlatformMark platform={campaign.platform} />
                        <div className="min-w-0">
                          <p className="truncate text-[0.84rem] font-medium text-white/80">{campaign.name}</p>
                          <p className="mt-0.5 text-[0.7rem] text-white/48">{campaign.platform} · {campaign.objective}</p>
                        </div>
                      </div>
                      <StatusPill status={campaign.status} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/[0.06] bg-black/10 p-2.5">
                      <div>
                        <p className="text-[0.6rem] uppercase tracking-[0.1em] text-white/48">Spend</p>
                        <p className="mt-1 text-[0.8rem] font-medium tabular-nums text-white/70">${(campaign.spend / 1000).toFixed(1)}k</p>
                      </div>
                      <div>
                        <p className="text-[0.6rem] uppercase tracking-[0.1em] text-white/48">ROAS</p>
                        <p className="mt-1 text-[0.8rem] font-semibold tabular-nums text-emerald-300">{campaign.roas.toFixed(2)}x</p>
                      </div>
                      <div>
                        <p className="text-[0.6rem] uppercase tracking-[0.1em] text-white/48">Conversions</p>
                        <p className="mt-1 text-[0.8rem] font-medium tabular-nums text-white/70">{campaign.conversions}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[0.65rem] text-white/48">
                        <span>Budget pacing</span>
                        <span>{pacing}%</span>
                      </div>
                      <MiniProgress value={pacing} className="mt-1.5" tone={pacing > 92 ? "amber" : "blue"} />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center border-t border-white/[0.05] py-20">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-white/48">
              <Search className="h-5 w-5" />
            </span>
            <p className="mt-4 text-[0.95rem] font-medium text-white/70">No campaigns found</p>
            <p className="mt-1 text-[0.8rem] text-white/48">Try a different search or clear your filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPlatform("All");
                setStatus("All");
              }}
              className={buttonStyles({ variant: "secondary", size: "sm", className: "mt-5" })}
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.055] px-5 py-3 sm:px-6">
          <p className="text-[0.7rem] text-white/48">
            Showing {filtered.length} of {campaigns.length} campaigns
          </p>
          <p className="text-[0.7rem] text-white/48">Data refreshed every 15 minutes</p>
        </div>
      </DashboardCard>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} labelledBy="campaign-modal-title" size="lg">
        {selected && (
          <>
            <div className="relative border-b border-white/[0.08] p-6 pr-14 sm:p-7 sm:pr-16">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,75,255,0.13),transparent_60%)]" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <PlatformMark platform={selected.platform} showLabel />
                  <span className="h-3 w-px bg-white/10" />
                  <StatusPill status={selected.status} />
                  <span className="text-[0.7rem] text-white/48">{selected.objective}</span>
                </div>
                <h2 id="campaign-modal-title" className="mt-4 max-w-lg font-display text-2xl font-medium leading-tight tracking-tight text-white">
                  {selected.name}
                </h2>
                <p className="mt-2 text-[0.75rem] text-white/48">Live since {selected.startDate} · {selected.id}</p>
              </div>
            </div>
            <div className="space-y-6 overflow-y-auto p-6 sm:p-7">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  { label: "Spend", value: `$${selected.spend.toLocaleString()}` },
                  { label: "Revenue", value: `$${selected.revenue.toLocaleString()}` },
                  { label: "ROAS", value: `${selected.roas.toFixed(2)}x`, accent: true },
                  { label: "Conversions", value: selected.conversions.toLocaleString() },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.1em] text-white/48">{item.label}</p>
                    <p className={cn("mt-1.5 font-display text-lg font-medium", item.accent ? "text-emerald-300" : "text-white")}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between text-[0.75rem]">
                  <span className="text-white/48">Budget pacing</span>
                  <span className="tabular-nums text-white/70">
                    ${selected.spend.toLocaleString()} <span className="text-white/48">of ${selected.budget.toLocaleString()}</span>
                  </span>
                </div>
                <MiniProgress value={(selected.spend / selected.budget) * 100} className="mt-2.5 h-1.5" />
                <div className="mt-2 flex justify-between text-[0.7rem] text-white/48">
                  <span>{Math.round((selected.spend / selected.budget) * 100)}% of monthly budget</span>
                  <span>${(selected.budget - selected.spend).toLocaleString()} remaining</span>
                </div>
              </div>

              <div className="rounded-lg border border-electric/15 bg-electric/[0.045] p-4">
                <p className="flex items-center gap-2 text-[0.75rem] font-semibold text-electric-pale/80">
                  <TrendingUp className="h-3.5 w-3.5" />
                  NARA insight
                </p>
                <p className="mt-2 text-[0.84rem] leading-6 text-white/55">
                  {selected.roas >= 5
                    ? "This campaign is outperforming the account benchmark. We recommend a 10–15% budget increase while creative fatigue remains low."
                    : selected.status === "Paused"
                      ? "This campaign is currently paused while we rebuild creative variations. Relaunch is scheduled after the holiday refresh."
                      : "Creative iteration is the next lever here. A new angle is already in production and will enter testing this week."}
                </p>
              </div>

              <div className="grid gap-2.5 border-t border-white/[0.06] pt-5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    onNavigate("support");
                  }}
                  className={buttonStyles({ size: "md", className: "w-full" })}
                >
                  Request a budget change
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => setSelected(null)} className={buttonStyles({ variant: "secondary", size: "md", className: "w-full" })}>
                  Close details
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
