import type { Metadata } from "next";
import { Hero } from "@/components/site/hero";
import { SiteHeader, AnnouncementBar } from "@/components/site/site-header";
import { LogoStrip } from "@/components/site/logo-strip";
import { Services } from "@/components/site/services";
import { Method } from "@/components/site/method";
import { CaseStudies } from "@/components/site/case-studies";
import { RoiCalculator } from "@/components/site/roi-calculator";
import { Faq } from "@/components/site/faq";
import { LeadCapture } from "@/components/site/lead-capture";
import { Testimonials } from "@/components/site/testimonials";
import { Insights } from "@/components/site/insights";
import { Contact } from "@/components/site/contact";
import { SiteFooter } from "@/components/site/site-footer";
import { siteUrl } from "@/lib/site";
import {
  faqJsonLd,
  serializeJsonLd,
  serviceJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: {
    canonical: `${siteUrl}/`,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <AnnouncementBar />
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <LogoStrip />
        <Services />
        <Method />
        <CaseStudies />
        <RoiCalculator />
        <Faq />
        <LeadCapture />
        <Testimonials />
        <Insights />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
