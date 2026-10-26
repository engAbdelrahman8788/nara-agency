"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const LEADS_STORAGE_KEY = "nara-leads-v1";

export const LEAD_STATUSES = ["New", "Contacted", "Won"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type LeadSource = "Website" | "Manual";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  business: string;
  message: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
};

export type NewLeadInput = {
  name: string;
  phone: string;
  business: string;
  message: string;
  status?: LeadStatus;
  source?: LeadSource;
};

type LeadsContextValue = {
  leads: Lead[];
  ready: boolean;
  addLead: (input: NewLeadInput) => Lead;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  deleteLead: (leadId: string) => void;
};

const LeadsContext = createContext<LeadsContextValue | null>(null);

function daysAgo(days: number, hours = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

function buildSeedLeads(): Lead[] {
  return [
    {
      id: "lead-seed-1",
      name: "Omar Khaled",
      phone: "+20 100 482 7719",
      business: "Velocity Scooter Showroom",
      message:
        "We want to sell more e-scooters in Alexandria and need a lead campaign that actually fills the showroom. Can you share a plan for the next 60 days?",
      status: "New",
      source: "Website",
      createdAt: daysAgo(0, 2),
    },
    {
      id: "lead-seed-2",
      name: "Salma Nabil",
      phone: "+20 122 905 3348",
      business: "Nile Crest Real Estate",
      message:
        "We are launching two compounds in New Cairo and need qualified buyer leads, not just clicks. What would a test budget look like?",
      status: "Contacted",
      source: "Website",
      createdAt: daysAgo(1, 4),
    },
    {
      id: "lead-seed-3",
      name: "Youssef Al-Mansouri",
      phone: "+971 50 663 1284",
      business: "Al-Mansouri Auto Group",
      message:
        "Our dealership group is expanding in Dubai. We want to book more test drives for the new SUV line and improve follow-up speed.",
      status: "Won",
      source: "Website",
      createdAt: daysAgo(4),
    },
    {
      id: "lead-seed-4",
      name: "Nour Hassan",
      phone: "+20 111 274 9056",
      business: "Aura Skin Studio",
      message:
        "We have three clinics and only one is consistently busy. Looking for a local marketing partner to fill the calendar.",
      status: "Contacted",
      source: "Website",
      createdAt: daysAgo(6),
    },
    {
      id: "lead-seed-5",
      name: "Karim Mostafa",
      phone: "+966 55 841 2290",
      business: "Kinetiq Technologies",
      message:
        "We need a B2B demand engine for enterprise demos across Saudi Arabia. Is this something NARA can own end to end?",
      status: "New",
      source: "Website",
      createdAt: daysAgo(8),
    },
  ];
}

function isLeadStatus(value: unknown): value is LeadStatus {
  return (
    value === "New" || value === "Contacted" || value === "Won"
  );
}

function normalizeLead(raw: unknown, index: number): Lead | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

  const record = raw as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const phone = typeof record.phone === "string" ? record.phone.trim() : "";

  if (!name || !phone) return null;

  const business =
    typeof record.business === "string" ? record.business.trim() : "";
  const message =
    typeof record.message === "string" ? record.message.trim() : "";
  const createdAt =
    typeof record.createdAt === "string" &&
    !Number.isNaN(new Date(record.createdAt).getTime())
      ? record.createdAt
      : new Date().toISOString();
  const source: LeadSource = record.source === "Manual" ? "Manual" : "Website";

  return {
    id:
      typeof record.id === "string" && record.id.trim()
        ? record.id.trim()
        : `lead-restored-${index + 1}`,
    name,
    phone,
    business: business || "Not provided",
    message,
    status: isLeadStatus(record.status) ? record.status : "New",
    source,
    createdAt,
  };
}

function normalizeLeads(raw: unknown): Lead[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeLead)
    .filter((lead): lead is Lead => Boolean(lead));
}

function readStoredLeads(): Lead[] | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(LEADS_STORAGE_KEY);
    if (stored === null) return null;
    return normalizeLeads(JSON.parse(stored));
  } catch {
    return null;
  }
}

function persist(leads: Lead[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // The pipeline still works for the current session.
  }
}

function buildLeadId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `lead-${crypto.randomUUID()}`;
  }

  return `lead-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(buildSeedLeads);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredLeads();
    if (stored !== null) setLeads(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== LEADS_STORAGE_KEY) return;
      if (event.newValue === null) {
        setLeads(buildSeedLeads());
        return;
      }

      try {
        setLeads(normalizeLeads(JSON.parse(event.newValue)));
      } catch {
        // Ignore malformed cross-tab payloads.
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addLead = useCallback((input: NewLeadInput): Lead => {
    const lead: Lead = {
      id: buildLeadId(),
      name: input.name.trim(),
      phone: input.phone.trim(),
      business: input.business.trim() || "Not provided",
      message: input.message.trim(),
      status: input.status ?? "New",
      source: input.source ?? "Website",
      createdAt: new Date().toISOString(),
    };

    setLeads((current) => {
      const next = [lead, ...current];
      persist(next);
      return next;
    });

    return lead;
  }, []);

  const updateLeadStatus = useCallback((leadId: string, status: LeadStatus) => {
    setLeads((current) => {
      const next = current.map((lead) =>
        lead.id === leadId ? { ...lead, status } : lead,
      );
      persist(next);
      return next;
    });
  }, []);

  const deleteLead = useCallback((leadId: string) => {
    setLeads((current) => {
      const next = current.filter((lead) => lead.id !== leadId);
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo<LeadsContextValue>(
    () => ({
      leads,
      ready,
      addLead,
      updateLeadStatus,
      deleteLead,
    }),
    [addLead, deleteLead, leads, ready, updateLeadStatus],
  );

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (!context) throw new Error("useLeads must be used within a LeadsProvider");
  return context;
}

export function getLeadInitials(name: string): string {
  return name
    .replace(/[^\w\s\u0600-\u06FF]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function formatLeadDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const startOfDay = (input: Date) =>
    new Date(input.getFullYear(), input.getMonth(), input.getDate()).getTime();
  const dayDiff = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000,
  );

  if (dayDiff <= 0) return "Today";
  if (dayDiff === 1) return "Yesterday";
  if (dayDiff < 7) return `${dayDiff}d ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}
