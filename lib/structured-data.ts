import { faqItems } from "@/lib/faq";
import { organizationId, siteUrl } from "@/lib/site";

const areaServed = [
  { "@type": "Country", name: "Saudi Arabia" },
  { "@type": "Country", name: "United Arab Emirates" },
  { "@type": "Country", name: "Egypt" },
  { "@type": "Place", name: "Gulf Cooperation Council" },
];

const serviceOffers = [
  {
    name: "B2B Lead Generation",
    description:
      "Qualified-lead programs with offer testing, landing pages, lead scoring, and CRM handoff.",
  },
  {
    name: "Performance Marketing",
    description:
      "Paid media across Meta, Google, TikTok, and LinkedIn, optimized for cost per qualified lead and contribution margin.",
  },
  {
    name: "ROI and Growth Strategy",
    description:
      "Budget modeling, channel mix design, and a 90-day roadmap tied to revenue and margin targets.",
  },
  {
    name: "Marketing Analytics and CRM Integration",
    description:
      "Campaign-to-CRM tracking, lead-source attribution, pipeline reporting, and shared performance dashboards.",
  },
  {
    name: "Web Design and CRO",
    description:
      "Conversion-first landing pages, analytics instrumentation, and A/B testing programs.",
  },
];

export const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${siteUrl}/#b2b-growth-service`,
  name: "B2B Performance Marketing & Lead Generation",
  serviceType:
    "B2B lead generation, performance marketing, ROI optimization, and digital strategy",
  description:
    "NARA plans, runs, and measures B2B lead generation and performance marketing programs for companies selling into Saudi Arabia, the UAE, Egypt, and the wider Gulf region.",
  url: `${siteUrl}/`,
  provider: { "@id": organizationId },
  areaServed,
  availableLanguage: ["English", "Arabic"],
  audience: {
    "@type": "BusinessAudience",
    audienceType:
      "B2B companies, SaaS, professional services, and growth-stage brands",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "NARA B2B growth services",
    itemListElement: serviceOffers.map((offer, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: offer.name,
        description: offer.description,
        provider: { "@id": organizationId },
      },
    })),
  },
};

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${siteUrl}/#faq`,
  inLanguage: "en",
  mainEntity: faqItems.en.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
