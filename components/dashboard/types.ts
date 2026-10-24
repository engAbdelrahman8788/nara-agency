import type { Report } from "@/lib/data";

export type DashboardRole = "client" | "admin";

export type ClientReport = Report & {
  client: string;
  uploadedBy?: string;
};

export type NewTicketInput = {
  subject: string;
  description: string;
  category: "Support" | "Budget change" | "Creative revision" | "Analytics";
  priority: "Low" | "Medium" | "High" | "Urgent";
};

export type UploadReportInput = {
  client: string;
  title: string;
  period: string;
  type: "PDF" | "CSV";
  fileName: string;
  fileSize: string;
  category: string;
};

export const dashboardRoleMeta = {
  client: {
    name: "Jordan Lee",
    role: "Head of Growth",
    company: "AUREL",
    initials: "JL",
    accent: "from-[#C8A97E] to-[#766045]",
  },
  admin: {
    name: "Maya Chen",
    role: "Growth Director",
    company: "NARA",
    initials: "MC",
    accent: "from-[#2563EB] to-[#072465]",
  },
} as const;
