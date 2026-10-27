import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/noto-sans-arabic";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/language-provider";
import { CmsProvider } from "@/lib/cms/provider";
import { LeadsProvider } from "@/lib/leads/provider";
import { SkipLink } from "@/components/ui/skip-link";
import { organizationId, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NARA — We Scale Brands Beyond Boundaries",
    template: "%s — NARA",
  },
  description:
    "NARA is a B2B growth marketing agency engineering measurable outcomes through lead generation, performance media, creative, SEO, and conversion design across Saudi Arabia, the UAE, Egypt, and the wider Gulf region.",
  keywords: [
    "B2B lead generation agency",
    "performance marketing",
    "growth marketing agency",
    "media buying",
    "SEO agency",
    "conversion optimization",
    "Saudi Arabia marketing agency",
    "UAE performance marketing",
    "Egypt digital marketing",
  ],
  authors: [{ name: "NARA" }],
  openGraph: {
    title: "NARA — We Scale Brands Beyond Boundaries",
    description:
      "A senior-only B2B growth partner for ambitious brands across Saudi Arabia, the UAE, Egypt, and the Gulf. Paid media, lead generation, SEO, creative, and CRO under one roof.",
    url: siteUrl,
    siteName: "NARA",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NARA — We Scale Brands Beyond Boundaries",
    description:
      "B2B lead generation, performance marketing, and ROI strategy for Saudi Arabia, the UAE, Egypt, and the Gulf.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "9vFwhkbQX5FY1KQ9eG4ulgKtKOY44mB9wdx9RgPocw0",
  },
};

export const viewport: Viewport = {
  themeColor: "#070709",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const languageBootstrap = `(function(){try{var l=window.localStorage.getItem("nara-language");if(l!=="ar")return;if(window.location.pathname.indexOf("/dashboard")===0)return;var r=document.documentElement;r.lang="ar";r.dir="rtl";r.dataset.language="ar";}catch(e){}})();`;

const organizationJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": organizationId,
  name: "NARA Marketing Agency",
  alternateName: "NARA",
  url: siteUrl,
  logo: `${siteUrl}/brand/nara-monogram.png`,
  description:
    "NARA Marketing Agency is a B2B growth marketing agency delivering lead generation, performance marketing, ROI optimization, digital strategy, automotive marketing, and web development for brands in Saudi Arabia, the UAE, Egypt, and the wider Gulf region.",
  email: "hello@nara.agency",
  foundingDate: "2019",
  slogan: "We scale brands beyond boundaries.",
  areaServed: [
    { "@type": "Country", name: "Saudi Arabia" },
    { "@type": "Country", name: "United Arab Emirates" },
    { "@type": "Country", name: "Egypt" },
    { "@type": "City", name: "Alexandria" },
    { "@type": "Place", name: "Gulf Cooperation Council" },
  ],
  knowsAbout: [
    "B2B Lead Generation",
    "Performance Marketing",
    "ROI Optimization",
    "Digital Strategy",
    "Marketing Analytics",
    "CRM Integration",
    "Automotive Marketing",
    "Web Development",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "B2B growth and digital services",
    itemListElement: [
      "B2B Lead Generation",
      "Performance Marketing",
      "ROI & Growth Strategy",
      "Digital Strategy",
      "Automotive Marketing",
      "Web Development",
    ].map((service, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: service,
        provider: { "@id": organizationId },
      },
    })),
  },
  sameAs: [
    "https://instagram.com/nara.agency",
    "https://linkedin.com/company/nara-agency",
    "https://x.com/naraagency",
  ],
}).replace(/</g, "\\u003c");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: languageBootstrap }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
      </head>
      <body className="min-h-screen bg-canvas font-sans text-white antialiased">
        <LanguageProvider>
          <CmsProvider>
            <LeadsProvider>
              <SkipLink />
              {children}
            </LeadsProvider>
          </CmsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
