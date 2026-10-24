import { Hero } from "@/components/site/hero";
import { SiteHeader, AnnouncementBar } from "@/components/site/site-header";
import { LogoStrip } from "@/components/site/logo-strip";
import { Services } from "@/components/site/services";
import { Method } from "@/components/site/method";
import { CaseStudies } from "@/components/site/case-studies";
import { RoiCalculator } from "@/components/site/roi-calculator";
import { Testimonials } from "@/components/site/testimonials";
import { Insights } from "@/components/site/insights";
import { Contact } from "@/components/site/contact";
import { SiteFooter } from "@/components/site/site-footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "NARA",
  description:
    "NARA is a senior-only growth marketing agency specializing in paid media, SEO, creative, social, and conversion optimization.",
  url: "https://nara.agency",
  email: "hello@nara.agency",
  foundingDate: "2019",
  areaServed: "Worldwide",
  slogan: "We scale brands beyond boundaries.",
  serviceType: [
    "Performance Marketing",
    "Media Buying",
    "Social Media Management",
    "Search Engine Optimization",
    "Content Creation",
    "Conversion Rate Optimization",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "36",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        <Testimonials />
        <Insights />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
