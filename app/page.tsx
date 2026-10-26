import { Hero } from "@/components/site/hero";
import { SiteHeader, AnnouncementBar } from "@/components/site/site-header";
import { LogoStrip } from "@/components/site/logo-strip";
import { Services } from "@/components/site/services";
import { Method } from "@/components/site/method";
import { CaseStudies } from "@/components/site/case-studies";
import { RoiCalculator } from "@/components/site/roi-calculator";
import { LeadCapture } from "@/components/site/lead-capture";
import { Testimonials } from "@/components/site/testimonials";
import { Insights } from "@/components/site/insights";
import { Contact } from "@/components/site/contact";
import { SiteFooter } from "@/components/site/site-footer";

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <LogoStrip />
        <Services />
        <Method />
        <CaseStudies />
        <RoiCalculator />
        <LeadCapture />
        <Testimonials />
        <Insights />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
