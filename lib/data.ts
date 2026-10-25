export type ServiceIcon =
  | "performance"
  | "social"
  | "search"
  | "content"
  | "web";

export type Service = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: ServiceIcon;
  metric: string;
  metricLabel: string;
  tags: string[];
  deliverables: string[];
  accent: string;
};

export type CaseStudy = {
  id: string;
  brand: string;
  monogram: string;
  category: string;
  industry: string;
  headline: string;
  summary: string;
  period: string;
  services: string[];
  heroMetric: string;
  heroMetricLabel: string;
  stats: { value: string; label: string }[];
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  challenge: string;
  approach: string[];
  result: string;
  quote: string;
  author: string;
  visual: "beauty" | "saas" | "wellness" | "b2b" | "home" | "fashion";
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  accent: string;
  image?: string;
  metric?: { value: string; label: string };
};

export type Insight = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  initials: string;
  visual: "chart" | "type" | "grid";
};

export const heroMetrics = [
  { value: "$15M+", label: "Client revenue generated" },
  { value: "4.8x", label: "Average blended ROAS" },
  { value: "120+", label: "Brands scaled" },
  { value: "38M+", label: "Impressions engineered" },
];

export const trustedBrands = [
  "AUREL",
  "NORTHWIND",
  "SOLACE",
  "HALDEN",
  "ÉLAN",
  "KINETIQ",
  "AETHER",
];

export const services: Service[] = [
  {
    id: "media",
    eyebrow: "01 / Acquisition",
    title: "Media buying & performance",
    description:
      "Full-funnel paid media engineered around contribution margin — not vanity metrics. Senior buyers across Meta, Google, TikTok, and LinkedIn.",
    icon: "performance",
    metric: "4.8x",
    metricLabel: "avg. blended ROAS",
    tags: ["Meta", "Google", "TikTok", "LinkedIn"],
    deliverables: [
      "Account architecture & audience strategy",
      "Creative testing roadmaps",
      "Incrementality & attribution modeling",
      "Weekly performance sprints",
    ],
    accent: "#004BFF",
  },
  {
    id: "social",
    eyebrow: "02 / Organic growth",
    title: "Social media management",
    description:
      "Editorial systems that build an owned audience while feeding the paid engine. Strategy, community, and always-on production.",
    icon: "social",
    metric: "183%",
    metricLabel: "avg. engagement lift",
    tags: ["Strategy", "Community", "Creator ops"],
    deliverables: [
      "Channel strategy & content calendars",
      "Creator sourcing and management",
      "Community management",
      "Monthly growth reporting",
    ],
    accent: "#5B8CFF",
  },
  {
    id: "seo",
    eyebrow: "03 / Demand capture",
    title: "Search engine optimization",
    description:
      "Technical precision and editorial authority that compound into durable non-paid demand. Built for revenue, not just rankings.",
    icon: "search",
    metric: "91%",
    metricLabel: "avg. organic revenue lift",
    tags: ["Technical", "Content", "Digital PR"],
    deliverables: [
      "Technical & Core Web Vitals audits",
      "Keyword and intent architecture",
      "Editorial production at scale",
      "Authority & backlink strategy",
    ],
    accent: "#00C2FF",
  },
  {
    id: "content",
    eyebrow: "04 / Brand gravity",
    title: "High-end content creation",
    description:
      "Scroll-stopping creative built for performance. A full in-house studio for motion, UGC, and campaign photography.",
    icon: "content",
    metric: "60+",
    metricLabel: "assets shipped monthly",
    tags: ["Production", "UGC", "Motion"],
    deliverables: [
      "Concepting & art direction",
      "Performance creative sprints",
      "Creator & UGC production",
      "Motion and edit systems",
    ],
    accent: "#7C5CFF",
  },
  {
    id: "web",
    eyebrow: "05 / Experience",
    title: "Web design & CRO",
    description:
      "Luxury digital experiences that convert. We design, build, and continuously test the full post-click journey.",
    icon: "web",
    metric: "+72%",
    metricLabel: "avg. conversion lift",
    tags: ["UX/UI", "Development", "Experimentation"],
    deliverables: [
      "Conversion-first UX/UI design",
      "Webflow & custom development",
      "A/B testing programs",
      "Analytics & event instrumentation",
    ],
    accent: "#FF7A59",
  },
];

export const caseStudies: CaseStudy[] = [
  {
    id: "aurel",
    brand: "AUREL",
    monogram: "A",
    category: "Beauty",
    industry: "Luxury skincare",
    headline: "From quiet cult favorite to category leader.",
    summary:
      "A full-funnel rebuild that turned a hero product into a scaled, repeatable acquisition system.",
    period: "7 months",
    services: ["Paid Media", "Creative", "CRO"],
    heroMetric: "+312%",
    heroMetricLabel: "revenue growth",
    stats: [
      { value: "5.2x", label: "Blended ROAS" },
      { value: "−37%", label: "CAC" },
      { value: "2.4x", label: "Repeat purchase" },
    ],
    before: "$112k",
    after: "$461k",
    beforeLabel: "Monthly revenue before",
    afterLabel: "Monthly revenue after",
    challenge:
      "AUREL had a best-in-class product and a loyal niche following, but paid acquisition plateaued. Creative fatigue and an over-reliance on discounting were eroding margin.",
    approach: [
      "Rebuilt the account around margin-based bidding and new-customer cohorts.",
      "Launched a 40-asset monthly creative sprint with editorial-grade UGC.",
      "Redesigned the PDP and post-purchase flow to increase AOV and retention.",
    ],
    result:
      "Within seven months, AUREL increased monthly revenue 312% while cutting blended CAC by 37% — unlocking the confidence to launch two new categories.",
    quote:
      "NARA didn't act like an agency. They moved like part of our leadership team and built a growth engine we now own.",
    author: "Noura Al-Harbi, Head of Growth at AUREL",
    visual: "beauty",
  },
  {
    id: "northwind",
    brand: "NORTHWIND",
    monogram: "N",
    category: "SaaS",
    industry: "B2B SaaS",
    headline: "A pipeline engine built for enterprise trust.",
    summary:
      "Demand generation and brand credibility combined to unlock a new enterprise segment.",
    period: "9 months",
    services: ["SEO", "Paid Media", "Web"],
    heroMetric: "+241%",
    heroMetricLabel: "qualified pipeline",
    stats: [
      { value: "3.4x", label: "Pipeline ROAS" },
      { value: "−28%", label: "Cost per SQL" },
      { value: "68%", label: "Share of voice" },
    ],
    before: "84",
    after: "264",
    beforeLabel: "Marketing-qualified leads / mo",
    afterLabel: "Marketing-qualified leads / mo",
    challenge:
      "Northwind had product-market fit but its marketing didn't match the sophistication of its buyers. Traffic was rising while qualified pipeline stayed flat.",
    approach: [
      "Repositioned the category story around operational resilience.",
      "Built a bottom-of-funnel content engine and interactive ROI tool.",
      "Deployed LinkedIn and search around high-intent account lists.",
    ],
    result:
      "Northwind grew qualified pipeline 241% and doubled enterprise deal velocity while lowering cost per SQL by 28%.",
    quote:
      "The first agency that understood our buyer. Our sales team now asks what marketing can build next.",
    author: "Faisal Al-Otaibi, VP Marketing at Northwind",
    visual: "saas",
  },
  {
    id: "solace",
    brand: "SOLACE",
    monogram: "S",
    category: "Wellness",
    industry: "Wellness & supplements",
    headline: "Profitable scale in a crowded category.",
    summary:
      "A disciplined creative system and offer architecture that made every dollar work harder.",
    period: "5 months",
    services: ["Paid Social", "Creative"],
    heroMetric: "8.1x",
    heroMetricLabel: "blended ROAS",
    stats: [
      { value: "$2.4M", label: "Incremental revenue" },
      { value: "+46%", label: "Subscription rate" },
      { value: "−22%", label: "Blended CAC" },
    ],
    before: "2.9x",
    after: "8.1x",
    beforeLabel: "ROAS before",
    afterLabel: "ROAS after",
    challenge:
      "Solace was scaling spend but ROAS was in steady decline. The brand relied on a single founder-led creative angle that had reached saturation.",
    approach: [
      "Mapped 14 distinct customer tensions and built creative around each.",
      "Introduced subscription-first offer tests with margin guardrails.",
      "Rebuilt landing pages by traffic temperature.",
    ],
    result:
      "Solace reached its most profitable quarter ever, adding $2.4M in incremental revenue and lifting subscription take-rate to 46%.",
    quote:
      "They found the angles we were too close to see. Our creative library finally reflects the depth of our brand.",
    author: "Mariam Al-Qasimi, Founder at Solace",
    visual: "wellness",
  },
  {
    id: "halden",
    brand: "HALDEN",
    monogram: "H",
    category: "Ecommerce",
    industry: "Premium home goods",
    headline: "Making considered design scale.",
    summary:
      "Luxury storytelling paired with rigorous performance media to build a national footprint.",
    period: "11 months",
    services: ["Paid Media", "CRO", "Social"],
    heroMetric: "+189%",
    heroMetricLabel: "year-over-year revenue",
    stats: [
      { value: "4.6x", label: "ROAS" },
      { value: "+31%", label: "AOV" },
      { value: "6.2x", label: "Return on creative" },
    ],
    before: "$1.8M",
    after: "$5.2M",
    beforeLabel: "Annual revenue before",
    afterLabel: "Annual revenue after",
    challenge:
      "Halden's craftsmanship translated beautifully in person, but its digital presence felt indistinguishable from mass-market competitors.",
    approach: [
      "Created a cinematic content system focused on materiality.",
      "Built a full-funnel Meta and Google program across new categories.",
      "Tested premium offer structures to lift average order value.",
    ],
    result:
      "Halden nearly tripled annual revenue and expanded distribution, without sacrificing its premium positioning or margin.",
    quote:
      "NARA gave us the confidence to grow without cheapening what makes Halden special.",
    author: "Yousef Al-Shamsi, Co-founder at Halden",
    visual: "home",
  },
  {
    id: "elan",
    brand: "ÉLAN",
    monogram: "É",
    category: "Ecommerce",
    industry: "Contemporary fashion",
    headline: "A global launch that landed.",
    summary:
      "A culturally-led launch campaign that turned a new collection into a sellout moment.",
    period: "3 months",
    services: ["Creative", "Influencer", "Paid Media"],
    heroMetric: "98%",
    heroMetricLabel: "launch inventory sold",
    stats: [
      { value: "31M", label: "Campaign impressions" },
      { value: "12.4x", label: "Launch ROAS" },
      { value: "+83%", label: "New customers" },
    ],
    before: "42%",
    after: "98%",
    beforeLabel: "Prior sell-through",
    afterLabel: "Launch sell-through",
    challenge:
      "ÉLAN was entering three new markets with one collection, a tight timeline, and a brand to protect. The campaign needed cultural relevance, not just reach.",
    approach: [
      "Built a network of 24 creators across fashion and culture.",
      "Developed a modular, city-specific campaign toolkit.",
      "Sequenced paid amplification against creator organic velocity.",
    ],
    result:
      "The collection sold through 98% of inventory in 19 days, with new-customer acquisition up 83% across three launch markets.",
    quote:
      "It felt less like an ad campaign and more like a moment. The team understood our world.",
    author: "Dania Ben Youssef, Brand Director at ÉLAN",
    visual: "fashion",
  },
  {
    id: "kinetiq",
    brand: "KINETIQ",
    monogram: "K",
    category: "B2B",
    industry: "Fintech infrastructure",
    headline: "From known player to category voice.",
    summary:
      "A category-defining narrative supported by search, content, and a conversion-led web experience.",
    period: "8 months",
    services: ["SEO", "Content", "Web"],
    heroMetric: "+364%",
    heroMetricLabel: "organic sessions",
    stats: [
      { value: "18", label: "Page-one rankings" },
      { value: "+57%", label: "Demo request rate" },
      { value: "$1.2M", label: "Influenced pipeline" },
    ],
    before: "0.8%",
    after: "3.1%",
    beforeLabel: "Site conversion rate",
    afterLabel: "Site conversion rate",
    challenge:
      "Kinetiq had strong technology but low category awareness. Search visibility was fragmented and the website wasn't converting its most valuable traffic.",
    approach: [
      "Built a proprietary category narrative and glossary.",
      "Launched a programmatic content engine around 120 intent clusters.",
      "Redesigned core conversion paths and implemented analytics.",
    ],
    result:
      "Organic sessions grew 364% in eight months and influenced pipeline crossed $1.2M, establishing Kinetiq as a credible category voice.",
    quote:
      "They brought rigor to a brand problem. Every recommendation connected back to pipeline.",
    author: "Karim Mostafa, CMO at Kinetiq",
    visual: "b2b",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "In one quarter they rebuilt our acquisition model. The reporting is now clear enough that our board reviews it every week — and growth is finally predictable.",
    name: "Sara Al-Otaibi",
    role: "Growth Director · Fintech",
    company: "NUWA · SAUDI ARABIA",
    initials: "SA",
    accent: "from-[#5B8CFF] to-[#0030B4]",
    image: "/testimonials/sara-al-otaibi.jpg",
    metric: { value: "4.4x", label: "ROAS" },
  },
  {
    id: "t2",
    quote:
      "NARA doesn't just hand over recommendations. They get into the account and build a growth system we can rely on. For the first time, the agency feels like part of our team.",
    name: "Ahmed Al-Mansouri",
    role: "Founder & CEO · Retail",
    company: "ORYX · UAE",
    initials: "AM",
    accent: "from-[#C8A97E] to-[#766045]",
    image: "/testimonials/ahmed-al-mansouri.jpg",
  },
  {
    id: "t3",
    quote:
      "What sets them apart is honesty with numbers. No inflated promises — just a clear plan, continuous testing, and steady growth we can plan around.",
    name: "Mohamed Hassan",
    role: "Co-founder · E-commerce",
    company: "ASEEL · EGYPT",
    initials: "MH",
    accent: "from-[#00C2FF] to-[#00516D]",
    image: "/testimonials/mohamed-hassan.jpg",
    metric: { value: "3.9x", label: "ROAS" },
  },
  {
    id: "t4",
    quote:
      "Their creative protects our brand identity while still performing. That's a hard balance, and they get it right.",
    name: "Laila Ben Salih",
    role: "Marketing Director · Beauty",
    company: "RIWAQ · UAE",
    initials: "LB",
    accent: "from-[#7C5CFF] to-[#3B1D9C]",
    image: "/testimonials/laila-ben-salih.jpg",
    metric: { value: "12M", label: "impressions" },
  },
  {
    id: "t5",
    quote:
      "Every riyal in the budget is justified and measured. They cut waste and improved ad efficiency without compromising lead quality.",
    name: "Omar Al-Nuaimi",
    role: "CMO · Hospitality",
    company: "LAMSA · SAUDI ARABIA",
    initials: "OA",
    accent: "from-[#FF7A59] to-[#8D2D18]",
    image: "/testimonials/omar-al-nuaimi.jpg",
  },
];

export const insights: Insight[] = [
  {
    id: "paid-media-playbook",
    category: "Paid Media",
    title: "The 2026 paid media playbook: fewer channels, deeper creative",
    excerpt:
      "Why the smartest growth teams are consolidating spend and investing in creative velocity over channel breadth.",
    date: "Oct 14, 2026",
    readTime: "8 min read",
    author: "Marcus Vale",
    initials: "MV",
    visual: "chart",
  },
  {
    id: "roas",
    category: "Analytics",
    title: "Why your ROAS is lying to you — and what to measure instead",
    excerpt:
      "Blended ROAS hides the signals that matter. A practical framework for measuring true incremental growth.",
    date: "Oct 02, 2026",
    readTime: "6 min read",
    author: "Sofia Marin",
    initials: "SM",
    visual: "grid",
  },
  {
    id: "creative-velocity",
    category: "Creative",
    title: "Creative velocity is the new media buying advantage",
    excerpt:
      "The operating system behind brands shipping 60+ performance assets a month without losing brand coherence.",
    date: "Sep 21, 2026",
    readTime: "5 min read",
    author: "Iris Chen",
    initials: "IC",
    visual: "type",
  },
];

export const chartRanges = ["7D", "30D", "90D"] as const;
export type ChartRange = (typeof chartRanges)[number];

export const performanceData: Record<
  ChartRange,
  { label: string; revenue: number; spend: number }[]
> = {
  "7D": [
    { label: "Fri", revenue: 33.4, spend: 7.1 },
    { label: "Sat", revenue: 38.2, spend: 7.9 },
    { label: "Sun", revenue: 35.6, spend: 7.4 },
    { label: "Mon", revenue: 41.8, spend: 8.6 },
    { label: "Tue", revenue: 44.2, spend: 9.2 },
    { label: "Wed", revenue: 38.4, spend: 8.0 },
    { label: "Thu", revenue: 47.6, spend: 9.8 },
  ],
  "30D": [
    { label: "Sep 23", revenue: 78, spend: 18.2 },
    { label: "Sep 26", revenue: 92, spend: 20.4 },
    { label: "Sep 29", revenue: 88, spend: 19.1 },
    { label: "Oct 02", revenue: 104, spend: 23.5 },
    { label: "Oct 05", revenue: 118, spend: 26.2 },
    { label: "Oct 08", revenue: 106, spend: 22.8 },
    { label: "Oct 11", revenue: 126, spend: 27.1 },
    { label: "Oct 14", revenue: 114, spend: 24.6 },
    { label: "Oct 17", revenue: 132, spend: 29.0 },
    { label: "Oct 20", revenue: 110, spend: 17.4 },
    { label: "Oct 22", revenue: 130, spend: 20.3 },
  ],
  "90D": [
    { label: "Jul 25", revenue: 92, spend: 22 },
    { label: "Aug 01", revenue: 108, spend: 25 },
    { label: "Aug 08", revenue: 104, spend: 24 },
    { label: "Aug 15", revenue: 121, spend: 27 },
    { label: "Aug 22", revenue: 136, spend: 29 },
    { label: "Aug 29", revenue: 129, spend: 28 },
    { label: "Sep 05", revenue: 148, spend: 31 },
    { label: "Sep 12", revenue: 161, spend: 33 },
    { label: "Sep 19", revenue: 154, spend: 32 },
    { label: "Sep 26", revenue: 174, spend: 35 },
    { label: "Oct 03", revenue: 191, spend: 38 },
    { label: "Oct 10", revenue: 186, spend: 37 },
    { label: "Oct 17", revenue: 212, spend: 41 },
    { label: "Oct 22", revenue: 226, spend: 44 },
  ],
};

export type CampaignStatus = "Active" | "Optimizing" | "Paused";
export type Platform = "Meta" | "Google" | "TikTok";

export type Campaign = {
  id: string;
  name: string;
  platform: Platform;
  status: CampaignStatus;
  objective: string;
  spend: number;
  budget: number;
  revenue: number;
  roas: number;
  conversions: number;
  ctr: number;
  trend: number;
  startDate: string;
};

export const campaigns: Campaign[] = [
  {
    id: "cmp-101",
    name: "Always-On | Prospecting",
    platform: "Meta",
    status: "Active",
    objective: "Conversions",
    spend: 48240,
    budget: 75000,
    revenue: 244900,
    roas: 5.08,
    conversions: 1620,
    ctr: 3.9,
    trend: 14.2,
    startDate: "Aug 12, 2026",
  },
  {
    id: "cmp-102",
    name: "Brand Search | United States",
    platform: "Google",
    status: "Active",
    objective: "Search",
    spend: 31680,
    budget: 48000,
    revenue: 198600,
    roas: 6.27,
    conversions: 1128,
    ctr: 8.4,
    trend: 8.6,
    startDate: "Feb 03, 2026",
  },
  {
    id: "cmp-103",
    name: "Spark Ads | Creator Series",
    platform: "TikTok",
    status: "Optimizing",
    objective: "Reach & conversion",
    spend: 28940,
    budget: 42000,
    revenue: 142400,
    roas: 4.92,
    conversions: 956,
    ctr: 2.8,
    trend: 22.8,
    startDate: "Sep 01, 2026",
  },
  {
    id: "cmp-104",
    name: "Retargeting | 30-Day Warm",
    platform: "Meta",
    status: "Optimizing",
    objective: "Retargeting",
    spend: 18760,
    budget: 30000,
    revenue: 111800,
    roas: 5.96,
    conversions: 704,
    ctr: 4.6,
    trend: 5.4,
    startDate: "Apr 18, 2026",
  },
  {
    id: "cmp-105",
    name: "Performance Max | Core Catalog",
    platform: "Google",
    status: "Active",
    objective: "Sales",
    spend: 36420,
    budget: 50000,
    revenue: 198500,
    roas: 5.45,
    conversions: 1312,
    ctr: 6.1,
    trend: 11.3,
    startDate: "Jan 09, 2026",
  },
  {
    id: "cmp-106",
    name: "Top-of-Funnel | Discovery",
    platform: "TikTok",
    status: "Paused",
    objective: "Awareness",
    spend: 11940,
    budget: 24000,
    revenue: 38100,
    roas: 3.19,
    conversions: 291,
    ctr: 1.9,
    trend: -4.2,
    startDate: "Jul 22, 2026",
  },
];

export const channelBreakdown = [
  { name: "Meta", value: 46, color: "#004BFF", spend: "$114,300" },
  { name: "Google", value: 32, color: "#5B8CFF", spend: "$79,500" },
  { name: "TikTok", value: 17, color: "#00C2FF", spend: "$42,300" },
  { name: "Other", value: 5, color: "#2B3348", spend: "$12,460" },
];

export const accountHealth = {
  score: 94,
  label: "Excellent",
  items: [
    { label: "Tracking health", value: "Verified", tone: "good" as const },
    { label: "Budget pacing", value: "On track", tone: "good" as const },
    { label: "Creative refresh", value: "6 days left", tone: "warn" as const },
  ],
};

export type TicketStatus = "Open" | "In Progress" | "Resolved";
export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";
export type TicketCategory = "Support" | "Budget change" | "Creative revision" | "Analytics";

export type TicketMessage = {
  id: string;
  from: "client" | "agency";
  author: string;
  initials: string;
  body: string;
  time: string;
};

export type Ticket = {
  id: string;
  client: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  assignee: string;
  messages: TicketMessage[];
};

export const initialTickets: Ticket[] = [
  {
    id: "NR-2418",
    client: "AUREL",
    subject: "Increase Q4 retargeting budget",
    description:
      "Retargeting is at 5.9x ROAS and budget-capped every day. Can we move an additional $8k/month from Discovery into retargeting for the rest of Q4?",
    category: "Budget change",
    priority: "Urgent",
    status: "Open",
    createdAt: "Oct 21, 2026",
    updatedAt: "2 hours ago",
    assignee: "Marcus Vale",
    messages: [
      {
        id: "m1",
        from: "client",
        author: "Jordan Lee",
        initials: "JL",
        body: "Retargeting has been capped for six days straight and is holding at 5.9x. We'd like to reallocate $8k/month from Discovery. Can you model the impact before we push it live?",
        time: "Oct 21, 9:14 AM",
      },
    ],
  },
  {
    id: "NR-2417",
    client: "AUREL",
    subject: "New UGC creator brief for Holiday set",
    description:
      "We need three additional creator angles for the holiday set, focused on gifting and sensitive skin. Ideally footage in hand by Oct 30.",
    category: "Creative revision",
    priority: "High",
    status: "In Progress",
    createdAt: "Oct 20, 2026",
    updatedAt: "Yesterday",
    assignee: "Iris Chen",
    messages: [
      {
        id: "m1",
        from: "client",
        author: "Jordan Lee",
        initials: "JL",
        body: "Loving the first two cuts. We'd like three more angles for the holiday set — gifting, sensitive skin, and a morning routine. Is Oct 30 realistic for final footage?",
        time: "Oct 20, 11:28 AM",
      },
      {
        id: "m2",
        from: "agency",
        author: "Iris Chen",
        initials: "IC",
        body: "Oct 30 works. We're casting two creators and will share the brief by tomorrow. We can also pull the unboxing moment from the first shoot into a separate cut.",
        time: "Oct 20, 2:06 PM",
      },
      {
        id: "m3",
        from: "client",
        author: "Jordan Lee",
        initials: "JL",
        body: "Perfect — yes to the unboxing cut. Please keep the gifting angle warm and editorial rather than discount-led.",
        time: "Yesterday, 9:42 AM",
      },
    ],
  },
  {
    id: "NR-2416",
    client: "NORTHWIND",
    subject: "GA4 conversion discrepancy",
    description:
      "GA4 is showing 18% fewer demo requests than HubSpot for last week. Could your analytics team investigate before the monthly review?",
    category: "Analytics",
    priority: "High",
    status: "Open",
    createdAt: "Oct 19, 2026",
    updatedAt: "3 hours ago",
    assignee: "Marcus Vale",
    messages: [
      {
        id: "m1",
        from: "client",
        author: "Priya Raman",
        initials: "PR",
        body: "Our VP Sales flagged an 18% gap between GA4 and HubSpot for demo requests. We need this reconciled before the QBR on Thursday.",
        time: "Oct 19, 4:21 PM",
      },
      {
        id: "m2",
        from: "client",
        author: "Priya Raman",
        initials: "PR",
        body: "Adding context: the gap only appears on the enterprise form, not the self-serve trial. Sharing access now.",
        time: "3 hours ago",
      },
    ],
  },
  {
    id: "NR-2415",
    client: "SOLACE",
    subject: "Approved: November creative batch",
    description:
      "Final approval on the 12-asset November creative batch. All feedback has been compiled in Figma.",
    category: "Creative revision",
    priority: "Low",
    status: "Resolved",
    createdAt: "Oct 18, 2026",
    updatedAt: "Oct 20, 2026",
    assignee: "Iris Chen",
    messages: [
      {
        id: "m1",
        from: "client",
        author: "Maya Chen",
        initials: "MC",
        body: "Approved across the board. The hero cut is beautiful. Let's plan a new round for December after launch.",
        time: "Oct 18, 3:07 PM",
      },
      {
        id: "m2",
        from: "agency",
        author: "Iris Chen",
        initials: "IC",
        body: "Amazing. Kicking off launch prep now and reserving a December shoot window. Thank you, Maya!",
        time: "Oct 20, 10:18 AM",
      },
    ],
  },
  {
    id: "NR-2414",
    client: "HALDEN",
    subject: "Monthly performance report walkthrough",
    description:
      "Can we schedule a 30-minute walkthrough of the September report with our founders? Particularly the new-customer CAC trend.",
    category: "Support",
    priority: "Medium",
    status: "In Progress",
    createdAt: "Oct 17, 2026",
    updatedAt: "2 days ago",
    assignee: "Dev Patel",
    messages: [
      {
        id: "m1",
        from: "client",
        author: "Theo Bennett",
        initials: "TB",
        body: "The report looks strong. Theo would love a walkthrough of the CAC trend and what you're seeing by category. Are you free Thursday?",
        time: "Oct 17, 12:45 PM",
      },
      {
        id: "m2",
        from: "agency",
        author: "Dev Patel",
        initials: "DP",
        body: "Thursday at 2 PM works for us. I'll bring the category-level cut and a short view on Q4 pacing. Invite is on the way.",
        time: "Oct 17, 4:10 PM",
      },
    ],
  },
  {
    id: "NR-2413",
    client: "ÉLAN",
    subject: "Add creator whitelisting access",
    description:
      "Requesting whitelisting access for two of our launch creators. They've agreed to paid partnership usage for 90 days.",
    category: "Support",
    priority: "Medium",
    status: "Resolved",
    createdAt: "Oct 12, 2026",
    updatedAt: "Oct 14, 2026",
    assignee: "Maya Chen",
    messages: [
      {
        id: "m1",
        from: "client",
        author: "Camille Duval",
        initials: "CD",
        body: "Both creators are on board for 90-day paid usage. What do you need from us to get whitelisting live?",
        time: "Oct 12, 10:33 AM",
      },
      {
        id: "m2",
        from: "agency",
        author: "Dev Patel",
        initials: "DP",
        body: "Access is live on both accounts and the new ads are queued. We'll review performance in 72 hours.",
        time: "Oct 14, 9:06 AM",
      },
    ],
  },
];

export type Report = {
  id: string;
  title: string;
  type: "PDF" | "CSV";
  category: string;
  period: string;
  size: string;
  date: string;
  status: "Ready" | "Draft";
};

export const reports: Report[] = [
  {
    id: "r1",
    title: "October Performance Report",
    type: "PDF",
    category: "Monthly report",
    period: "October 2026",
    size: "4.8 MB",
    date: "Oct 21, 2026",
    status: "Ready",
  },
  {
    id: "r2",
    title: "Q4 Marketing Roadmap",
    type: "PDF",
    category: "Roadmap",
    period: "Q4 2026",
    size: "2.1 MB",
    date: "Oct 04, 2026",
    status: "Ready",
  },
  {
    id: "r3",
    title: "Campaign Raw Data Export",
    type: "CSV",
    category: "Data export",
    period: "Oct 01 – Oct 21, 2026",
    size: "860 KB",
    date: "Oct 21, 2026",
    status: "Ready",
  },
  {
    id: "r4",
    title: "Holiday Creative Guidelines",
    type: "PDF",
    category: "Creative",
    period: "Holiday 2026",
    size: "6.4 MB",
    date: "Sep 28, 2026",
    status: "Ready",
  },
];

export const creativeAssets = [
  { id: "c1", name: "Holiday Hero — 9:16", type: "Video", status: "Approved", palette: "blue" },
  { id: "c2", name: "AUREL Ritual — 4:5", type: "Static", status: "Approved", palette: "sand" },
  { id: "c3", name: "Founder Story — 1:1", type: "Video", status: "Approved", palette: "night" },
  { id: "c4", name: "Gifting Edit — 9:16", type: "UGC", status: "In review", palette: "ice" },
];

export type Client = {
  id: string;
  name: string;
  industry: string;
  initials: string;
  contact: string;
  email: string;
  manager: string;
  budget: number;
  status: "Active" | "Onboarding" | "At risk";
  tenure: string;
  accent: string;
};

export const initialClients: Client[] = [
  {
    id: "cl-01",
    name: "AUREL",
    industry: "Luxury skincare",
    initials: "AU",
    contact: "Jordan Lee",
    email: "jordan@aurel.com",
    manager: "Dev Patel",
    budget: 75000,
    status: "Active",
    tenure: "18 months",
    accent: "#C8A97E",
  },
  {
    id: "cl-02",
    name: "NORTHWIND",
    industry: "B2B SaaS",
    initials: "NW",
    contact: "Priya Raman",
    email: "priya@northwind.io",
    manager: "Maya Chen",
    budget: 48000,
    status: "Active",
    tenure: "11 months",
    accent: "#5B8CFF",
  },
  {
    id: "cl-03",
    name: "SOLACE",
    industry: "Wellness & supplements",
    initials: "SO",
    contact: "Maya Chen",
    email: "maya@solace.co",
    manager: "Lena Ortiz",
    budget: 62000,
    status: "Active",
    tenure: "9 months",
    accent: "#00C2FF",
  },
  {
    id: "cl-04",
    name: "HALDEN",
    industry: "Premium home goods",
    initials: "HA",
    contact: "Theo Bennett",
    email: "theo@halden.com",
    manager: "Dev Patel",
    budget: 55000,
    status: "At risk",
    tenure: "26 months",
    accent: "#FF7A59",
  },
  {
    id: "cl-05",
    name: "ÉLAN",
    industry: "Contemporary fashion",
    initials: "ÉL",
    contact: "Camille Duval",
    email: "camille@elan.studio",
    manager: "Maya Chen",
    budget: 40000,
    status: "Active",
    tenure: "6 months",
    accent: "#7C5CFF",
  },
  {
    id: "cl-06",
    name: "KINETIQ",
    industry: "Fintech infrastructure",
    initials: "KI",
    contact: "Daniel Okafor",
    email: "daniel@kinetiq.co",
    manager: "Lena Ortiz",
    budget: 36000,
    status: "Onboarding",
    tenure: "1 month",
    accent: "#28C76F",
  },
];

export const accountManagers = ["Maya Chen", "Dev Patel", "Lena Ortiz", "Marcus Vale"];

export const adminRevenue = [
  { month: "May", revenue: 218000, target: 235000 },
  { month: "Jun", revenue: 236000, target: 240000 },
  { month: "Jul", revenue: 252000, target: 245000 },
  { month: "Aug", revenue: 249000, target: 255000 },
  { month: "Sep", revenue: 284000, target: 265000 },
  { month: "Oct", revenue: 316000, target: 285000 },
];

export const adminMetrics = [
  {
    id: "mrr",
    label: "Total monthly revenue",
    value: "$312,400",
    change: "+12.8%",
    trend: "up" as const,
    detail: "vs. last month",
  },
  {
    id: "retainers",
    label: "Active retainers",
    value: "24",
    change: "+3",
    trend: "up" as const,
    detail: "new this quarter",
  },
  {
    id: "clients",
    label: "Total clients",
    value: "28",
    change: "+2",
    trend: "up" as const,
    detail: "onboarding now",
  },
  {
    id: "tickets",
    label: "Pending tickets",
    value: "6",
    change: "2 urgent",
    trend: "down" as const,
    detail: "needs attention",
  },
];

export const teamUtilization = [
  { name: "Maya Chen", role: "Growth Director", utilization: 82, initials: "MC", color: "#004BFF" },
  { name: "Dev Patel", role: "Senior Media Buyer", utilization: 76, initials: "DP", color: "#5B8CFF" },
  { name: "Iris Chen", role: "Creative Director", utilization: 91, initials: "IC", color: "#7C5CFF" },
  { name: "Lena Ortiz", role: "SEO Lead", utilization: 64, initials: "LO", color: "#00C2FF" },
];

export const recentAdminActivity = [
  {
    id: "a1",
    text: "Dev Patel uploaded October reports for 4 clients",
    time: "34 minutes ago",
    type: "upload",
  },
  {
    id: "a2",
    text: "AUREL budget increased by $8,000/month",
    time: "2 hours ago",
    type: "budget",
  },
  {
    id: "a3",
    text: "New client KINETIQ moved to onboarding",
    time: "Yesterday",
    type: "client",
  },
  {
    id: "a4",
    text: "Maya Chen resolved ticket NR-2415",
    time: "Yesterday",
    type: "ticket",
  },
];

export const monthlyRoadmap = [
  { month: "October", title: "Peak season readiness", status: "done" as const },
  { month: "November", title: "Holiday acceleration & gifting", status: "active" as const },
  { month: "December", title: "Retention & post-purchase", status: "upcoming" as const },
  { month: "January", title: "New year category expansion", status: "upcoming" as const },
];
