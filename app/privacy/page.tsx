import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import type { LegalSection } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How NARA collects, uses, and protects personal information across our website and client services.",
  alternates: { canonical: "/privacy" },
};

const sections: LegalSection[] = [
  {
    id: "overview",
    title: "Overview",
    paragraphs: [
      "This Privacy Policy explains how NARA Growth Studio (\"NARA\", \"we\", \"us\", or \"our\") collects, uses, shares, and protects personal information when you visit nara.agency, contact us, subscribe to our newsletter, or engage us for services.",
      "We keep this policy deliberately readable. If anything is unclear, contact us at privacy@nara.agency and we will explain it.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: ["We collect information in three broad ways:"],
    bullets: [
      "Information you provide: your name, email address, company, role, phone number, project details, and any other information you include in a form, email, or call.",
      "Client and account data: information needed to deliver our services, including workspace users, billing contacts, campaign briefs, and materials you share with us.",
      "Information collected automatically: IP address, browser type, device information, referring pages, and interaction data collected through cookies and similar technologies.",
    ],
  },
  {
    id: "how-we-use",
    title: "How we use information",
    bullets: [
      "To respond to enquiries, schedule calls, and prepare proposals.",
      "To provide, operate, and improve our services and client workspace.",
      "To send service updates, invoices, and administrative communications.",
      "To send newsletters and marketing communications where you have opted in or where permitted by law.",
      "To analyse website performance, diagnose issues, and improve the experience.",
      "To meet legal, accounting, and regulatory obligations, and to enforce our agreements.",
    ],
  },
  {
    id: "legal-bases",
    title: "Legal bases for processing",
    paragraphs: [
      "Where the GDPR or UK GDPR applies, we rely on one or more of the following legal bases: performance of a contract (delivering services you have engaged us for), legitimate interests (running and improving our business, provided your rights are not overridden), consent (marketing communications and non-essential cookies), and legal obligation (record keeping and compliance).",
      "You may withdraw consent at any time. Withdrawal does not affect processing carried out before withdrawal.",
    ],
  },
  {
    id: "sharing",
    title: "How we share information",
    paragraphs: [
      "We do not sell personal information. We share it only with parties who help us operate, and only to the extent necessary.",
    ],
    bullets: [
      "Service providers: hosting, analytics, email delivery, scheduling, payment processing, and project management tools, each bound by appropriate confidentiality and data protection terms.",
      "Professional advisers: lawyers, accountants, and auditors where necessary.",
      "Business transfers: in connection with a merger, acquisition, financing, or sale of assets, subject to appropriate safeguards.",
      "Legal requirements: where required by law, regulation, court order, or to protect our rights and the safety of others.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    paragraphs: [
      "We use essential cookies to operate the site and, where you consent, analytics cookies to understand how visitors use it. Analytics data is aggregated and used to improve content, navigation, and performance.",
      "You can control cookies through your browser settings. Blocking some cookies may affect how the site works. Where required, we present a consent mechanism before setting non-essential cookies.",
    ],
  },
  {
    id: "retention",
    title: "Data retention",
    paragraphs: [
      "We keep personal information only as long as needed for the purposes described in this policy. Enquiry records are typically retained for 24 months from the last interaction. Client records are retained for the duration of the engagement and for a reasonable period afterward to meet legal, tax, and accounting obligations.",
      "When information is no longer needed, we delete it or anonymise it in accordance with our internal retention schedule.",
    ],
  },
  {
    id: "transfers",
    title: "International transfers",
    paragraphs: [
      "NARA operates across the United States and the United Kingdom, and some of our service providers process information in other countries. Where we transfer personal information internationally, we use appropriate safeguards, including standard contractual clauses and supplementary measures where required.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "We use administrative, technical, and physical safeguards designed to protect personal information, including encryption in transit, access controls, least-privilege permissions, and regular reviews of our systems and vendors.",
      "No method of transmission or storage is completely secure. If we become aware of a breach affecting your personal information, we will notify affected individuals and regulators where required by law.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    paragraphs: [
      "Depending on where you live, you may have the right to access, correct, delete, restrict, or object to the processing of your personal information, to request portability, and to withdraw consent. California residents may also have rights to know, delete, and correct personal information and to opt out of certain sharing.",
      "To exercise a right, email privacy@nara.agency. We will respond within the timeframe required by applicable law and may ask for information to verify your identity. You also have the right to complain to your local data protection authority.",
    ],
  },
  {
    id: "children",
    title: "Children's privacy",
    paragraphs: [
      "Our website and services are intended for businesses and are not directed at children under 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us and we will delete it.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time to reflect changes in our practices, technology, or legal requirements. The updated date at the top of this page shows when the current version took effect. Material changes will be communicated through the website or directly where appropriate.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: [
      "For privacy questions or requests, contact privacy@nara.agency. You can also write to NARA Growth Studio, Attn: Privacy, at our New York or London office. We will route your request to the appropriate team.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy, without the small print fog."
      intro="How we collect, use, and protect personal information across the NARA website and client services."
      updated="October 23, 2026"
      sections={sections}
      contactEmail="privacy@nara.agency"
    />
  );
}
