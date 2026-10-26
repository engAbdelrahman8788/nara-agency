import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/noto-sans-arabic";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/language-provider";
import { CmsProvider } from "@/lib/cms/provider";
import { SkipLink } from "@/components/ui/skip-link";

export const metadata: Metadata = {
  metadataBase: new URL("https://nara.agency"),
  title: {
    default: "NARA — We Scale Brands Beyond Boundaries",
    template: "%s — NARA",
  },
  description:
    "NARA is a premier growth marketing agency engineering measurable outcomes through media buying, creative, SEO, and conversion design.",
  keywords: [
    "growth marketing agency",
    "performance marketing",
    "media buying",
    "SEO agency",
    "social media management",
    "conversion optimization",
  ],
  authors: [{ name: "NARA" }],
  openGraph: {
    title: "NARA — We Scale Brands Beyond Boundaries",
    description:
      "A senior-only growth partner for ambitious brands. Paid media, SEO, creative, and CRO under one roof.",
    url: "https://nara.agency",
    siteName: "NARA",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NARA — We Scale Brands Beyond Boundaries",
    description: "A senior-only growth partner for ambitious brands.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#070709",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const languageBootstrap = `(function(){try{var l=window.localStorage.getItem("nara-language");if(l!=="ar")return;if(window.location.pathname.indexOf("/dashboard")===0)return;var r=document.documentElement;r.lang="ar";r.dir="rtl";r.dataset.language="ar";}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: languageBootstrap }} />
      </head>
      <body className="min-h-screen bg-canvas font-sans text-white antialiased">
        <LanguageProvider>
          <CmsProvider>
            <SkipLink />
            {children}
          </CmsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
