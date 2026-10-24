import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import type { LegalSection } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of the NARA website and the professional services we provide.",
  alternates: { canonical: "/terms" },
};

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    paragraphs: [
      "These Terms of Service (\"Terms\") govern your access to and use of nara.agency (the \"Site\") and, unless a separate signed agreement says otherwise, the professional services provided by NARA Growth Studio (\"NARA\", \"we\", \"us\", or \"our\").",
      "By using the Site or engaging our services, you agree to these Terms. If you are accepting on behalf of a company, you confirm that you have authority to bind that company.",
    ],
  },
  {
    id: "services",
    title: "Services and proposals",
    paragraphs: [
      "NARA provides growth marketing services including paid media, social media management, search engine optimization, content, and conversion optimization. The specific scope, deliverables, timelines, and fees for an engagement are set out in a proposal, statement of work, or retainer agreement (an \"SOW\").",
      "An SOW becomes binding when both parties sign it or when work begins with the client's written approval. If these Terms conflict with an executed SOW, the SOW controls for that engagement.",
    ],
  },
  {
    id: "fees",
    title: "Fees and payment",
    paragraphs: [
      "Fees are stated in the applicable SOW and are exclusive of applicable taxes unless otherwise indicated. Media spend is separate from service fees and is typically billed in advance or replenished according to the SOW.",
      "Unless the SOW states otherwise, invoices are due within 15 days of issue. Late payments may accrue interest at 1.5% per month or the maximum permitted by law, whichever is lower. We may pause work on accounts more than 14 days overdue after written notice.",
      "Fees for work already performed are non-refundable. Third-party costs, including media spend, software licenses, and production expenses, are passed through at cost unless the SOW says otherwise.",
    ],
  },
  {
    id: "client-responsibilities",
    title: "Client responsibilities",
    paragraphs: [
      "We need timely access to accounts, data, approvals, and stakeholders to do our best work. Delays in these areas may affect timelines and results; we will flag them promptly.",
    ],
    bullets: [
      "Provide accurate information about your business, products, and claims.",
      "Ensure that materials you supply do not infringe third-party rights and comply with applicable laws and platform policies.",
      "Maintain ownership of and admin access to your advertising accounts and data sources unless otherwise agreed.",
      "Obtain any consents required for customer data, testimonials, and creative assets you share with us.",
      "Respond to approval requests within the agreed turnaround, typically two business days.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    paragraphs: [
      "Each party retains ownership of its pre-existing intellectual property. Upon full payment of applicable fees, the client receives ownership of the final deliverables created specifically for it under an SOW, excluding NARA's pre-existing tools, frameworks, methodologies, and know-how.",
      "NARA retains ownership of its methodologies, processes, internal templates, and derivative know-how, and may reuse general skills and experience. Unless the client opts out in writing, we may reference the engagement and non-confidential results in our portfolio and marketing.",
      "The Site, including its design, code, copy, and visual systems, is owned by NARA and may not be copied or reproduced without permission.",
    ],
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    paragraphs: [
      "Each party may receive information that the other treats as confidential. The receiving party will use reasonable care to protect that information and will use it only to perform under the SOW. These obligations do not apply to information that is public, already known without a duty of confidence, independently developed, or required to be disclosed by law.",
      "These obligations survive termination of the engagement for three years, or longer for trade secrets.",
    ],
  },
  {
    id: "results",
    title: "No guarantee of results",
    paragraphs: [
      "Marketing outcomes depend on many factors outside our control, including market conditions, platform algorithms, pricing, product quality, and client execution. We bring rigorous process and senior expertise, but we do not guarantee specific revenue, ROAS, ranking, or other performance outcomes unless expressly stated in a signed SOW.",
      "Forecasts, projections, and examples on the Site or in proposals are illustrative and not commitments.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-party platforms",
    paragraphs: [
      "Our services rely on third-party platforms such as advertising networks, analytics providers, and software tools. Your use of those platforms is governed by their own terms. We are not responsible for platform outages, policy changes, account suspensions, or data practices outside our control, though we will use reasonable efforts to mitigate their impact.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "To the maximum extent permitted by law, neither party will be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, lost revenue, or lost data, arising out of or related to the engagement.",
      "NARA's total aggregate liability arising out of or related to an SOW will not exceed the total service fees paid by the client to NARA under that SOW in the six months preceding the event giving rise to the claim. These limits do not apply to gross negligence, wilful misconduct, fraud, or any liability that cannot be limited by law.",
    ],
  },
  {
    id: "indemnity",
    title: "Indemnity",
    paragraphs: [
      "The client will indemnify NARA against claims arising from client-supplied materials, products, or claims, or from the client's breach of these Terms. NARA will indemnify the client against claims that NARA's original deliverables infringe a third party's intellectual property, provided the client promptly notifies us and allows us to control the defence.",
    ],
  },
  {
    id: "term-termination",
    title: "Term and termination",
    paragraphs: [
      "Each engagement continues for the term stated in its SOW. Unless the SOW provides otherwise, either party may terminate for convenience with 30 days' written notice. Either party may terminate immediately for material breach if the breach is not cured within 10 days of written notice.",
      "On termination, the client will pay for work performed and non-cancellable commitments through the effective date. NARA will provide reasonable transition assistance, including account access and final reporting, subject to payment of outstanding invoices.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing law and disputes",
    paragraphs: [
      "These Terms are governed by the laws of the State of New York, without regard to conflict-of-law principles. The parties will first attempt to resolve any dispute through good-faith discussion between senior representatives. If unresolved after 30 days, the dispute will be subject to the exclusive jurisdiction of the state and federal courts located in New York County, New York.",
      "Nothing in this section prevents either party from seeking injunctive relief to protect its intellectual property or confidential information.",
    ],
  },
  {
    id: "general",
    title: "General",
    paragraphs: [
      "These Terms, together with any applicable SOW, are the entire agreement between the parties on their subject matter. If any provision is found unenforceable, the remainder will remain in effect. A failure to enforce a provision is not a waiver.",
      "We may update these Terms from time to time. The version in effect when an SOW is signed governs that engagement. Continued use of the Site after an update constitutes acceptance of the revised Terms.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: [
      "Questions about these Terms or an engagement can be sent to legal@nara.agency. For project enquiries, use hello@nara.agency.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Clear terms. Serious work."
      intro="The terms that govern use of the NARA website and the professional services we provide to our clients."
      updated="October 23, 2026"
      sections={sections}
      contactEmail="legal@nara.agency"
    />
  );
}
