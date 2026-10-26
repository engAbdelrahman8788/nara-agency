export type AdVariant = {
  headline: string;
  body: string;
  cta: string;
};

export type OutreachAngle = {
  audience: string;
  angle: string;
  opener: string;
};

export type AdPack = {
  businessType: string;
  niche: string;
  audience: string;
  keywords: string[];
  hooks: string[];
  ads: AdVariant[];
  outreach: OutreachAngle[];
};

type OutreachTemplate = {
  audience: string;
  angle: string;
  opener: string;
};

type NicheProfile = {
  id: string;
  label: string;
  pattern: RegExp;
  audience: string;
  keywords: string[];
  hooks: string[];
  ads: AdVariant[];
  outreach: OutreachTemplate[];
};

const profiles: NicheProfile[] = [
  {
    id: "scooter",
    label: "Scooter & two-wheel showroom",
    pattern:
      /(scooter|moped|motorcycle|motorbike|e-bike|ebike|atv|two.wheel|دراجة|سكوتر|موتوسيكل)/i,
    audience: "Riders within 20km who are ready to upgrade their daily commute",
    keywords: [
      "scooter showroom",
      "best scooter under budget",
      "test ride near me",
      "scooter finance",
      "daily commute",
    ],
    hooks: [
      "Still losing scooter buyers to the showroom across town? Here's the 30-second reason they choose {biz} instead.",
      "Your next 20 scooter sales are already searching online. The only question is whether {biz} shows up first.",
      "Riders don't need another generic ad. They need a reason to visit {biz} this weekend.",
      "What if every 1,000 in ad spend came back as a booked test ride at {biz}?",
    ],
    ads: [
      {
        headline: "Book a Test Ride. Feel the Difference.",
        body: "Shopping for a scooter should not feel like guesswork. At {biz}, compare the models, check the real range, and take your favourite for a proper test ride — no pressure, no runaround. This week only, visitors who book online get priority slots and a transparent on-road price before they arrive.",
        cta: "Book your test ride",
      },
      {
        headline: "The Daily Commute Just Got Cheaper",
        body: "Fuel prices keep climbing. A smart scooter from {biz} can cut your daily commute cost while getting you through traffic faster. We'll help you match the right model to your budget, riding style, and parking situation in under 10 minutes. Come see the lineup in person and leave with a clear number — not a maybe.",
        cta: "See this week's offers",
      },
      {
        headline: "Your First Scooter, Without the Guesswork",
        body: "First-time rider? {biz} walks you through helmets, insurance, servicing, and finance in plain language. No hidden fees. No pressure to buy on the spot. Book a free fit session and test ride, and we'll help you choose the model you'll still be happy with a year from now.",
        cta: "Claim a free fit session",
      },
    ],
    outreach: [
      {
        audience: "Delivery and courier companies",
        angle: "Fleet replacement with predictable servicing",
        opener:
          "Hi — I work with {biz}. We're helping delivery teams in the area cut downtime by moving to scooters with fixed servicing and fast replacement parts. Worth a 10-minute call to see if a small pilot fleet makes sense?",
      },
      {
        audience: "Local employers and campuses",
        angle: "Staff commute benefit with a co-branded offer",
        opener:
          "Hi — I'm with {biz}. We're building a staff commute package for nearby employers: preferential pricing, servicing, and a test-ride day on site. Would your operations team be open to exploring it?",
      },
      {
        audience: "Rider communities and micro-influencers",
        angle: "Test-ride content in exchange for a tracked offer",
        opener:
          "Hey — {biz} is looking for a few local riders to film honest test-ride content. We'll provide the scooter, a tracked offer for your audience, and a simple brief. Interested in the details?",
      },
    ],
  },
  {
    id: "automotive",
    label: "Automotive dealership & showroom",
    pattern:
      /(auto|car |cars|dealership|vehicle|truck|showroom|سيار|وكالة|معرض)/i,
    audience: "In-market buyers comparing models, offers, and trade-in value",
    keywords: [
      "car dealership near me",
      "test drive",
      "trade-in value",
      "new car offers",
      "SUV deals",
    ],
    hooks: [
      "Most car buyers decide where to visit before they ever leave the house. Here's how {biz} wins that moment.",
      "Your showroom is full of great cars. Your ads should fill it with great buyers. Here's the difference.",
      "What would 30 extra qualified test drives this month be worth to {biz}?",
      "Stop paying for clicks from people who were never going to buy. Start booking the ones who are.",
    ],
    ads: [
      {
        headline: "Book a Test Drive. Skip the Sales Pressure.",
        body: "You already know what you want to compare. {biz} makes it easy: choose your model, pick a time, and get a confirmed test-drive slot before you leave home. No queue, no guesswork, no pressure. This week, online bookings also get a transparent trade-in estimate before they arrive.",
        cta: "Book your test drive",
      },
      {
        headline: "Know Your Trade-In Before You Walk In",
        body: "Your current car is worth more than a vague conversation. Send {biz} the details and get a clear trade-in range, monthly payment options, and the exact model you're comparing — all before your visit. Spend less time negotiating and more time driving the car you actually want.",
        cta: "Get your trade-in estimate",
      },
      {
        headline: "The SUV You Want. The Payment You Planned For.",
        body: "Upgrading to a bigger car shouldn't blow up your monthly budget. {biz} pre-qualifies your options, shows the real on-road price, and helps you compare trims side by side. Book a weekday test drive and get a written quote the same day — no surprises at the desk.",
        cta: "See your payment options",
      },
    ],
    outreach: [
      {
        audience: "Small business fleet buyers",
        angle: "Fleet packages with fixed servicing and quick delivery",
        opener:
          "Hi — I'm with {biz}. We're putting together a small-business fleet package: priority delivery, fixed servicing, and one account manager for every vehicle. Would a 10-minute review of your current fleet costs be useful?",
      },
      {
        audience: "Auto lenders and insurance brokers",
        angle: "Co-marketing to pre-qualified buyers",
        opener:
          "Hi — {biz} is looking for a lending partner to co-market pre-qualified offers to in-market buyers. We handle the audience and showroom experience; you handle the finance options. Open to exploring a pilot?",
      },
      {
        audience: "Local employers and relocation teams",
        angle: "Employee car-buying program",
        opener:
          "Hi — I'm with {biz}. We're building an employee purchase program with preferential pricing and a dedicated contact for your team. Would your HR or operations lead be open to a short intro?",
      },
    ],
  },
  {
    id: "realestate",
    label: "Real estate & property",
    pattern:
      /(real estate|property|properties|developer|broker|compound|عقار|عقاري|تطوير)/i,
    audience: "Qualified buyers and investors actively comparing locations and payment plans",
    keywords: [
      "property for sale",
      "new compound",
      "payment plan",
      "investment property",
      "book a viewing",
    ],
    hooks: [
      "Buyers don't book viewings from a brochure. They book when the ad makes the next step obvious. Here's how {biz} does it.",
      "Your best buyer is already comparing three developments. Give them a reason to shortlist {biz} today.",
      "What if every enquiry was a real buyer with a budget — not a form-fill with no follow-up?",
      "Stop selling square metres. Start selling the decision your buyer is trying to make.",
    ],
    ads: [
      {
        headline: "Book a Private Viewing. See the Difference.",
        body: "Photos only tell you so much. {biz} offers private viewings with a clear walkthrough of the unit, payment plan, delivery timeline, and what the neighbourhood will look like when you move in. Choose a time that suits you and get the full picture before you commit.",
        cta: "Book a private viewing",
      },
      {
        headline: "A Payment Plan You Can Actually Plan Around",
        body: "The right property should fit your life, not stretch it. {biz} walks you through the down payment, monthly instalments, handover date, and total cost in one clear conversation. No vague numbers, no surprise fees. Request the full payment breakdown for the units currently available.",
        cta: "Get the payment breakdown",
      },
      {
        headline: "Investing? Start With the Numbers.",
        body: "Yield, occupancy, exit timing, and delivery risk matter more than the render. {biz} shares the actual unit economics, comparable rents, and completion track record so you can decide with your head, not the brochure. Book a 20-minute investor briefing with the team.",
        cta: "Request the investor brief",
      },
    ],
    outreach: [
      {
        audience: "Relocation and HR teams",
        angle: "Corporate housing shortlist for new hires",
        opener:
          "Hi — I'm with {biz}. We're building a shortlist of ready-to-move homes for companies relocating staff into the city. Would it help to have a vetted options pack with pricing and viewing slots?",
      },
      {
        audience: "Mortgage advisors and finance brokers",
        angle: "Co-marketing to pre-qualified buyers",
        opener:
          "Hi — {biz} has a pipeline of buyers actively comparing payment plans. We'd like to explore a referral partnership with a finance advisor who can pre-qualify them early. Worth a quick call?",
      },
      {
        audience: "Interior designers and home services",
        angle: "Post-purchase partner bundle",
        opener:
          "Hi — I'm with {biz}. We're assembling a handover bundle for new buyers: design consultation, curtains, and moving support. Would you be open to a referral arrangement?",
      },
    ],
  },
  {
    id: "beauty",
    label: "Beauty, skin & aesthetics",
    pattern:
      /(skin|beauty|cosmetic|aesthetic|serum|spa|salon|clinic|بشرة|تجميل|جمال|صالون|عيادة)/i,
    audience: "Local clients researching treatments and comparing before/after results",
    keywords: [
      "skin clinic near me",
      "acne treatment",
      "best facial",
      "before and after",
      "book consultation",
    ],
    hooks: [
      "Your next client is comparing three clinics right now. Here's why {biz} should be the obvious first choice.",
      "Before-and-after photos get attention. A clear consultation gets bookings. Here's how {biz} turns both into revenue.",
      "What would 15 extra consultations a month be worth to {biz}?",
      "Stop promoting treatments. Start removing the reason clients hesitate to book.",
    ],
    ads: [
      {
        headline: "Book a Skin Consultation That Actually Explains Your Options",
        body: "Not every skin concern needs the same treatment. At {biz}, your consultation starts with your skin, your routine, and your budget — then a clear plan with realistic timelines. No pressure to book a package on the spot. Reserve a slot and get a personalised recommendation before you decide.",
        cta: "Book your consultation",
      },
      {
        headline: "Real Results. Honest Timelines.",
        body: "You've seen the filters. Now see what's actually possible. {biz} shares real client journeys, expected downtime, and the number of sessions a result usually takes — before you pay. If a treatment isn't right for your skin, we'll tell you. Book a consultation and get a plan you can trust.",
        cta: "See real client results",
      },
      {
        headline: "The Facial Everyone Books Again",
        body: "A good facial should still feel worth it a week later. {biz} builds each session around your skin barrier, not a one-size package. This month, first-time clients get a skin analysis and a tailored aftercare plan with every booking. Limited weekday slots available.",
        cta: "Claim a first-visit slot",
      },
    ],
    outreach: [
      {
        audience: "Bridal and event planners",
        angle: "Pre-event skin packages with priority scheduling",
        opener:
          "Hi — I'm with {biz}. We're creating a bridal and events skin package with priority slots and a clear pre-event timeline. Would your clients benefit from a preferred partner offer?",
      },
      {
        audience: "Hotels, spas, and wellness studios",
        angle: "Referral partnership for visiting clients",
        opener:
          "Hi — {biz} is looking for a local partner to refer guests who want advanced skin treatments during their stay. We can offer a tracked referral fee and a simple booking link. Open to a quick intro?",
      },
      {
        audience: "Corporate wellness teams",
        angle: "Lunch-and-learn skin health sessions",
        opener:
          "Hi — I'm with {biz}. We run short skin-health sessions for teams, with optional one-to-one consultations afterwards. Would your wellness lead be open to a pilot for the next quarter?",
      },
    ],
  },
  {
    id: "wellness",
    label: "Wellness, fitness & supplements",
    pattern:
      /(wellness|fitness|gym|health|supplement|nutrition|yoga|clinic|عيادة|صحة|عافية|لياقة|مكمل|رياضة)/i,
    audience: "People ready to commit to a routine but unsure which option fits their life",
    keywords: [
      "personal training",
      "gym near me",
      "wellness program",
      "nutrition plan",
      "free trial",
    ],
    hooks: [
      "Everyone says they want to get healthier. Very few ads make the first step feel easy. Here's how {biz} changes that.",
      "Your next 25 members are not looking for a gym. They're looking for a plan they can keep. Show them.",
      "What if your ad sold the first week — not a 12-month commitment?",
      "Stop advertising facilities. Start advertising the outcome your client can feel by Friday.",
    ],
    ads: [
      {
        headline: "Start With a Week. Decide After.",
        body: "You don't need another intimidating fitness pitch. {biz} gives you a structured first week: a simple assessment, a plan that fits your schedule, and a coach who checks in. No long contract to try it. Book your starter week and see how your body and routine respond.",
        cta: "Claim your starter week",
      },
      {
        headline: "A Plan Built Around Your Real Schedule",
        body: "Work, family, travel — your training has to survive real life. {biz} builds your plan around the days you can actually show up, with progress check-ins that keep you honest without burning you out. Book a free assessment and leave with a routine you can start the next morning.",
        cta: "Book a free assessment",
      },
      {
        headline: "The Accountability You've Been Missing",
        body: "Motivation fades. A good coach doesn't. {biz} pairs every member with a dedicated coach, weekly check-ins, and a plan that adjusts as you progress. If you've started strong before and quietly stopped, this is the reset you need. Book a no-pressure intro session this week.",
        cta: "Meet your coach",
      },
    ],
    outreach: [
      {
        audience: "Corporate wellness teams",
        angle: "Team challenge with measurable participation",
        opener:
          "Hi — I'm with {biz}. We run four-week team challenges with simple tracking and on-site intro sessions. Would your wellbeing lead be open to a small pilot?",
      },
      {
        audience: "Physiotherapists and nutritionists",
        angle: "Referral network for complementary clients",
        opener:
          "Hi — {biz} is building a referral network with local physios and nutritionists. We're careful to send clients whose goals fit your expertise. Would you be open to a short intro call?",
      },
      {
        audience: "Local employers",
        angle: "Lunchtime sessions and staff membership",
        opener:
          "Hi — {biz} is offering nearby teams a lunchtime movement session and a preferred staff rate. Would your office manager be interested in a trial date?",
      },
    ],
  },
  {
    id: "ecommerce",
    label: "Ecommerce, retail & fashion",
    pattern:
      /(ecommerce|e-commerce|online store|shop|store|fashion|apparel|clothing|retail|jewel|furniture|home decor|أزياء|ملابس|متجر|تجارة|أثاث|ديكور)/i,
    audience: "Shoppers with intent who need a reason to buy now rather than save for later",
    keywords: [
      "buy online",
      "new collection",
      "free shipping",
      "best seller",
      "limited offer",
    ],
    hooks: [
      "Your product page has three seconds to answer one question: why buy now? Here's how {biz} makes that case.",
      "Most stores pay for the click and lose the sale at the offer. Let's fix the second part.",
      "What would a 15% lift in conversion rate do to {biz}'s ad budget?",
      "Stop discounting your way to growth. Start giving buyers a better reason to choose you.",
    ],
    ads: [
      {
        headline: "The Piece Everyone Asks About",
        body: "Some products earn their place in the rotation. This is one of them. {biz} designed it for everyday wear with details that hold up close, not just in the photo. Free returns, fast delivery, and a fit guide that actually helps. See why it keeps selling out — and why it comes back.",
        cta: "Shop the bestseller",
      },
      {
        headline: "New Season. Same Standards.",
        body: "New drops are easy. Getting the fit, fabric, and finish right is not. {biz} built this collection to survive real life: repeat wear, easy care, and a silhouette that works beyond one season. Shop the new arrivals before the most requested sizes go.",
        cta: "Explore new arrivals",
      },
      {
        headline: "Buy Once. Wear It Everywhere.",
        body: "You don't need more things. You need the few that work harder. {biz} focuses on pieces that pair easily, travel well, and still look considered after a long day. Free returns make trying it risk-free. Find your next everyday favourite.",
        cta: "Find your fit",
      },
    ],
    outreach: [
      {
        audience: "Micro-creators and affiliates",
        angle: "Tracked codes with product seeding",
        opener:
          "Hi — I'm with {biz}. We're seeding a small group of creators with our best-selling pieces and a tracked code. No scripted content, just honest fit and wear tests. Interested in the details?",
      },
      {
        audience: "Complementary brands",
        angle: "Bundle partnership for shared customers",
        opener:
          "Hi — {biz} is looking for a complementary brand to build a bundle offer with. We share an audience but not a product category. Would a short brainstorm be useful?",
      },
      {
        audience: "Wholesale and stockists",
        angle: "Low-risk opening order",
        opener:
          "Hi — I'm with {biz}. We're opening a limited number of wholesale accounts with a low-risk first order and tested bestsellers. Would you like the line sheet?",
      },
    ],
  },
  {
    id: "tech",
    label: "B2B software & technology",
    pattern:
      /(saas|software|tech|technology|platform|fintech|cloud|app|it |b2b|برمج|تقنية|منص|تطبيق)/i,
    audience: "Operations and growth leaders comparing solutions with a real budget and deadline",
    keywords: [
      "B2B software",
      "book a demo",
      "enterprise platform",
      "ROI calculator",
      "integration",
    ],
    hooks: [
      "Your buyer doesn't want a demo. They want proof the next quarter gets easier. Here's how {biz} leads with that.",
      "Most B2B ads sell features. The best ones sell a decision. Which one is {biz} running?",
      "What would 20 more qualified demos a month be worth to {biz}?",
      "Stop gating a brochure. Start giving buyers the number they need to justify the meeting.",
    ],
    ads: [
      {
        headline: "See the ROI Before You Book the Demo",
        body: "You shouldn't need a sales call to find out if {biz} is worth evaluating. Use the interactive ROI model to estimate the hours saved, cost reduced, and payback period for your team. If the numbers make sense, book a 20-minute walkthrough with a solutions lead — no junior SDR handoff.",
        cta: "Run the ROI model",
      },
      {
        headline: "The Demo Your Operations Team Actually Needs",
        body: "Generic demos waste everyone's quarter. {biz} tailors the walkthrough to your workflow, integrations, and reporting requirements — then sends a written summary with next steps. Bring your toughest process question. We'll show you exactly where the platform fits, and where it doesn't.",
        cta: "Book a tailored demo",
      },
      {
        headline: "From Spreadsheet Chaos to One Source of Truth",
        body: "If your team is still reconciling three exports before Monday's meeting, the problem isn't effort. It's the system. {biz} connects the workflow, automates the handoffs, and gives every lead one clean view. See the migration plan and the first 30 days before you commit.",
        cta: "Get the migration plan",
      },
    ],
    outreach: [
      {
        audience: "Consultancies and implementation partners",
        angle: "Referral and co-delivery partnership",
        opener:
          "Hi — I'm with {biz}. We're building a partner bench for implementation and change management. You keep the client relationship; we support the platform layer. Open to a 15-minute fit check?",
      },
      {
        audience: "Industry associations and communities",
        angle: "Member-only benchmark report",
        opener:
          "Hi — {biz} is producing a benchmark report for operations leaders in your industry. We'd love to offer it to your members and co-host a short session on the findings. Would that be useful?",
      },
      {
        audience: "Adjacent SaaS platforms",
        angle: "Integration-led co-marketing",
        opener:
          "Hi — {biz} integrates with your platform and shares a similar buyer. We'd like to explore a joint webinar or co-authored migration guide. Worth a quick conversation?",
      },
    ],
  },
  {
    id: "food",
    label: "Restaurants, cafés & food",
    pattern:
      /(restaurant|cafe|coffee|food|bakery|catering|kitchen|مطعم|كافيه|قهوة|طعام|مخبز)/i,
    audience: "Local diners choosing where to eat, book, or order this week",
    keywords: [
      "restaurant near me",
      "book a table",
      "best breakfast",
      "private dining",
      "order online",
    ],
    hooks: [
      "People don't crave a restaurant. They crave a reason to leave the house. Here's how {biz} gives them one.",
      "Your food is the product. Your ad should make the table feel booked before they arrive.",
      "What would 20 extra weekday covers be worth to {biz}?",
      "Stop posting menus. Start selling the occasion.",
    ],
    ads: [
      {
        headline: "Your Table Is Waiting",
        body: "Some meals are worth planning around. {biz} is serving the kind of menu that turns a normal weeknight into the plan. Book online in under a minute, choose indoor or terrace seating, and arrive to a table that's ready. Weekday reservations include a welcome bite.",
        cta: "Book your table",
      },
      {
        headline: "The Breakfast That Fixes the Morning",
        body: "Good coffee is the baseline. A breakfast that actually holds you until lunch is the reason to come back. {biz} serves a focused morning menu with fresh ingredients, fast service, and seats for the people who need to open a laptop. Drop in before 10am and skip the queue.",
        cta: "See the morning menu",
      },
      {
        headline: "Private Dining, Without the Corporate Feel",
        body: "Birthdays, client dinners, family gatherings — {biz} has a private space that feels considered, not rented. Custom menus, flexible timings, and a team that handles the details. Tell us the occasion and we'll send a simple proposal within one business day.",
        cta: "Plan your private dinner",
      },
    ],
    outreach: [
      {
        audience: "Local offices and coworking spaces",
        angle: "Corporate lunch program with weekly ordering",
        opener:
          "Hi — I'm with {biz}. We're setting up a weekly lunch program for nearby teams with a fixed menu, delivery window, and one invoice. Would your office manager be open to a tasting?",
      },
      {
        audience: "Hotels and event planners",
        angle: "Preferred dining partner for guests and events",
        opener:
          "Hi — {biz} is looking for a preferred dining partner for guests and small events. We can offer a set menu, priority bookings, and a simple referral arrangement. Worth a short intro?",
      },
      {
        audience: "Food creators and local reviewers",
        angle: "Invite-led content with a tracked booking link",
        opener:
          "Hi — {biz} is inviting a few local food creators for an honest tasting. No scripted review, just a tracked booking link if your audience wants to try it. Interested?",
      },
    ],
  },
  {
    id: "general",
    label: "Local & B2B services",
    pattern: /./i,
    audience: "High-intent buyers comparing local providers and looking for a safe next step",
    keywords: [
      "local business",
      "request a quote",
      "book a consultation",
      "near me",
      "trusted provider",
    ],
    hooks: [
      "Your next customer is comparing three options. Make {biz} the one that feels easiest to trust.",
      "Most local ads ask for the sale too early. Here's how {biz} earns the enquiry first.",
      "What would 15 more qualified enquiries a month be worth to {biz}?",
      "Stop buying attention. Start buying confidence.",
    ],
    ads: [
      {
        headline: "A Clear Next Step. No Pressure.",
        body: "Choosing a provider shouldn't feel like a gamble. {biz} starts with a short conversation about what you need, what it costs, and what happens next. No vague quotes, no chasing. Request a callback and get a straight answer from someone who can actually help.",
        cta: "Request a callback",
      },
      {
        headline: "The Quote You Can Actually Compare",
        body: "You shouldn't need a finance degree to compare proposals. {biz} breaks down the scope, timeline, and total cost in plain language, then tells you what's included and what isn't. Ask for a written quote and make the decision with the full picture.",
        cta: "Get a written quote",
      },
      {
        headline: "Local Team. Real Accountability.",
        body: "Big promises are easy. Showing up is harder. {biz} works with a small, local team that answers the phone, owns the details, and tells you when something isn't the right fit. Book a 15-minute intro and see how we work before you commit.",
        cta: "Book a 15-minute intro",
      },
    ],
    outreach: [
      {
        audience: "Complementary local businesses",
        angle: "Referral partnership with a clear handoff",
        opener:
          "Hi — I'm with {biz}. We serve a similar local customer but don't compete with you. I'd like to explore a simple referral arrangement that's easy for both teams to explain. Open to a quick chat?",
      },
      {
        audience: "Industry associations and networks",
        angle: "Member offer plus an educational session",
        opener:
          "Hi — {biz} would like to offer your members a practical session on [topic] plus a member-only offer. We can handle the content and promotion. Would that fit your calendar?",
      },
      {
        audience: "Corporate procurement teams",
        angle: "Pilot engagement with clear KPIs",
        opener:
          "Hi — I'm with {biz}. We're proposing a small pilot with agreed KPIs before any longer commitment. Could we send a one-page scope to the right person on your team?",
      },
    ],
  },
];

function fill(template: string, businessType: string): string {
  return template.replace(/\{biz\}/g, businessType);
}

function rotate<T>(items: T[], variation: number): T[] {
  if (items.length === 0) return [];
  const offset = ((variation % items.length) + items.length) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function pickProfile(businessType: string): NicheProfile {
  const normalized = businessType.trim().toLowerCase();
  return (
    profiles.find(
      (profile) => profile.id !== "general" && profile.pattern.test(normalized),
    ) ?? profiles[profiles.length - 1]
  );
}

export function generateAdPack(
  businessTypeInput: string,
  variation = 0,
): AdPack {
  const businessType = businessTypeInput.trim().replace(/\s+/g, " ").slice(0, 80);
  const profile = pickProfile(businessType);

  return {
    businessType,
    niche: profile.label,
    audience: profile.audience,
    keywords: [...profile.keywords],
    hooks: rotate(profile.hooks, variation)
      .slice(0, 3)
      .map((hook) => fill(hook, businessType)),
    ads: rotate(profile.ads, variation)
      .slice(0, 3)
      .map((ad) => ({
        headline: fill(ad.headline, businessType),
        body: fill(ad.body, businessType),
        cta: fill(ad.cta, businessType),
      })),
    outreach: rotate(profile.outreach, variation)
      .slice(0, 3)
      .map((angle) => ({
        audience: fill(angle.audience, businessType),
        angle: fill(angle.angle, businessType),
        opener: fill(angle.opener, businessType),
      })),
  };
}

export const AD_EXAMPLES = [
  "Scooter Showroom",
  "Auto Dealership",
  "Luxury Real Estate",
  "Skin Clinic",
  "B2B SaaS",
];
