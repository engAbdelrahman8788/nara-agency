export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; id: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; quote: string; attribution: string; role: string }
  | { type: "stats"; items: { value: string; label: string; detail: string }[] }
  | { type: "callout"; label: string; title: string; text: string };

export type ArticleContent = {
  subtitle: string;
  authorRole: string;
  authorBio: string;
  takeaways: string[];
  blocks: ArticleBlock[];
  nextSlug: string;
};

export const articles: Record<string, ArticleContent> = {
  "paid-media-playbook": {
    subtitle:
      "Channel sprawl is a tax on focus. The teams compounding in 2026 are narrowing their media mix, industrialising creative, and measuring what actually moved.",
    authorRole: "Co-founder & Growth Partner",
    authorBio:
      "Marcus has led paid media for category-defining brands across beauty, consumer tech, and marketplace businesses. He writes about the operating systems behind durable growth.",
    takeaways: [
      "Concentrate spend where you have signal density, not where your competitors happen to be.",
      "Creative remains the last true lever inside automated auctions. Budget should follow learning.",
      "Measure incremental contribution, not platform-reported ROAS.",
    ],
    nextSlug: "roas",
    blocks: [
      {
        type: "paragraph",
        text: "For the better part of a decade, the prevailing growth playbook was simple: be everywhere. Add another channel, another platform, another attribution pixel. More surface area meant more shots on goal. In a world of cheap reach and loose measurement, that logic held. It no longer does.",
      },
      {
        type: "paragraph",
        text: "The 2026 version looks almost inverted. The strongest accounts we see are not the ones running the most placements. They are the ones running a deliberately narrow media mix with an unusually deep creative engine behind it. Fewer channels, more signal. Fewer bets, more conviction.",
      },
      {
        type: "heading",
        id: "channel-breadth-trap",
        text: "The channel-breadth trap",
      },
      {
        type: "paragraph",
        text: "Every new channel carries a fixed cost that rarely appears in the media plan: learning cost. A platform needs enough conversions, enough creative variation, and enough time to build a reliable optimisation model. Split that attention across five platforms and you do not get five learning curves. You get five shallow ones.",
      },
      {
        type: "paragraph",
        text: "There is also an organisational cost. Each channel introduces its own reporting logic, creative specs, and account rituals. Teams end up managing the complexity of the media mix instead of the growth of the business. The dashboard gets busier; the decisions get worse.",
      },
      {
        type: "quote",
        quote:
          "The goal is not to be present in every auction. It is to be unmistakably good in the two or three auctions that determine your category.",
        attribution: "Marcus Vale",
        role: "Co-founder & Growth Partner, NARA",
      },
      {
        type: "heading",
        id: "signal-density",
        text: "Signal density beats reach",
      },
      {
        type: "paragraph",
        text: "Signal density is the amount of reliable learning you generate per dollar and per week. A channel with high signal density tells you quickly which message, audience, and offer is working. That learning compounds. It improves creative briefs, landing pages, sales conversations, and the next media bet.",
      },
      {
        type: "paragraph",
        text: "In practice, this means resisting the urge to spread a fixed budget evenly. Most brands should have one primary channel where they intend to be top decile, a secondary channel that supports the first, and a small experimental budget that exists to answer questions rather than to hit a spend target.",
      },
      {
        type: "list",
        items: [
          "Primary channel: 60–70% of spend. The place where you have the clearest economics and the most creative learning.",
          "Secondary channel: 20–30% of spend. A deliberate complement, not a duplicate. Retargeting, search capture, or a second demand surface.",
          "Experimental budget: 5–10% of spend. Time-boxed tests with a written hypothesis and a kill date.",
        ],
      },
      {
        type: "stats",
        items: [
          { value: "2.6x", label: "Faster learning", detail: "Median improvement in test velocity after consolidating to two core channels." },
          { value: "18%", label: "Lower acquisition cost", detail: "Typical CAC improvement within two quarters of reallocating spend." },
          { value: "41%", label: "Less wasted spend", detail: "Budget redirected away from channels without incremental contribution." },
        ],
      },
      {
        type: "heading",
        id: "creative-operating-system",
        text: "The creative operating system",
      },
      {
        type: "paragraph",
        text: "When channels are consolidated, creative becomes the primary variable. Automated bidding has flattened many of the old targeting advantages. The auction can now find the audience if the creative gives it something to work with. That shifts the job from media buying to message production.",
      },
      {
        type: "paragraph",
        text: "High-performing creative teams run like product teams. They maintain a thesis about the customer, ship concepts in structured sprints, and review performance against a small set of leading indicators. They do not wait for a monthly report to decide what to make next.",
      },
      {
        type: "callout",
        label: "Operating rule",
        title: "One insight, three expressions, one week.",
        text: "Every creative sprint starts with a single customer insight, produces three distinct expressions of it, and runs for a fixed period before a decision. Volume is a byproduct of the system, not the goal.",
      },
      {
        type: "heading",
        id: "budget-model",
        text: "A budget model that respects learning",
      },
      {
        type: "paragraph",
        text: "Media budgets are usually built around spend targets. Learning budgets are built around questions. The difference sounds philosophical until you watch a team spend six figures proving nothing because the budget had to be deployed by month end.",
      },
      {
        type: "paragraph",
        text: "We use a simple 70/20/10 allocation as a starting point. Seventy percent goes to proven programs with known contribution. Twenty percent goes to scaling promising programs that have cleared an initial threshold. Ten percent goes to tests that could change the shape of the plan. The percentages are less important than the discipline of naming which bucket each dollar belongs to.",
      },
      {
        type: "list",
        items: [
          "Fund learning before you fund scale. A test without a decision rule is just spend.",
          "Set a minimum viable sample for every channel and stop pretending a three-day test is conclusive.",
          "Reallocate weekly, but re-architect quarterly. Constant structural changes destroy the learning you paid for.",
        ],
      },
      {
        type: "heading",
        id: "measurement",
        text: "Measurement that survives the auction",
      },
      {
        type: "paragraph",
        text: "Platform-reported ROAS is a useful directional signal and a poor economic truth. Every platform is incentivised to claim as much credit as its attribution window allows. The result is a set of numbers that can all improve while the business does not.",
      },
      {
        type: "paragraph",
        text: "The fix is triangulation. Combine platform data with contribution margin, blended efficiency, and periodic incrementality tests. Treat the three as a court, not a single judge. When they disagree, that disagreement is the most valuable signal you have.",
      },
      {
        type: "heading",
        id: "monday",
        text: "What to do Monday",
      },
      {
        type: "list",
        items: [
          "List every active channel and the last time it produced a decision-changing insight.",
          "Cut or pause the bottom quartile for two weeks. Ring-fence the budget for a named test.",
          "Write one creative thesis for your primary channel. Brief three expressions of it.",
          "Define the two numbers you will use to judge the next 30 days. Make them economic, not platform-native.",
        ],
      },
      {
        type: "paragraph",
        text: "None of this requires a bigger team or a new stack. It requires the willingness to be narrower than your competitors and more rigorous about what earns the next dollar. In a market that rewards learning velocity, focus is not a constraint. It is the advantage.",
      },
    ],
  },
  roas: {
    subtitle:
      "Platform ROAS is a directional signal, not an economic truth. Here is the measurement stack we use to see what paid media is actually adding.",
    authorRole: "Head of Analytics",
    authorBio:
      "Sofia builds measurement systems for growth teams that have outgrown platform dashboards. Her work sits at the intersection of incrementality, media economics, and decision design.",
    takeaways: [
      "ROAS is a ratio. Your business runs on contribution margin and cash.",
      "Triangulate platform attribution, blended efficiency, and incrementality tests.",
      "Set guardrails by cohort and payback period, not by a single blended target.",
    ],
    nextSlug: "creative-velocity",
    blocks: [
      {
        type: "paragraph",
        text: "Every growth team has a ROAS target. Very few can explain what it is protecting. The number is usually inherited — a benchmark from a board deck, a competitor rumour, or a ratio that looked comfortable in a previous business. It survives because it is easy to say and hard to argue with.",
      },
      {
        type: "paragraph",
        text: "The trouble is that ROAS compresses an entire economic system into one ratio. It says nothing about margin, repeat rate, cash conversion, or whether the sale would have happened anyway. Optimising it directly can make a dashboard look excellent while the P&L quietly deteriorates.",
      },
      {
        type: "heading",
        id: "ratio-not-strategy",
        text: "ROAS is a ratio, not a strategy",
      },
      {
        type: "paragraph",
        text: "Return on ad spend is revenue divided by media spend. It is useful for comparing creative, audiences, and campaigns inside the same platform and the same window. It becomes dangerous when it is promoted to the level of business truth.",
      },
      {
        type: "paragraph",
        text: "A brand with 70% gross margin can comfortably acquire at a lower ROAS than a brand with 25% margin. A subscription business can accept a longer payback than a one-off retailer. A marketplace with strong organic halo can afford a blended number that would sink a pure-play DTC brand. The ratio is identical; the economics are not.",
      },
      {
        type: "heading",
        id: "three-lies",
        text: "Three ways ROAS lies",
      },
      {
        type: "list",
        items: [
          "Credit inflation: platforms claim conversions that would have happened without the ad, especially on retargeting and branded search.",
          "Window shopping: a 7-day click and 1-day view window can pull organic demand into paid reporting, making acquisition look better than it is.",
          "Margin blindness: revenue is not profit. A high-ROAS campaign selling a low-margin product can destroy more value than a lower-ROAS campaign selling a durable, high-margin one.",
        ],
      },
      {
        type: "paragraph",
        text: "None of these are platform conspiracies. They are the natural consequence of asking an ad system to grade its own homework. The system optimises for the conversions it can see and the credit it can claim. Your job is to add the context it cannot.",
      },
      {
        type: "quote",
        quote:
          "If every platform is reporting record ROAS and your bank balance is flat, you do not have a measurement problem. You have a decision problem.",
        attribution: "Sofia Marin",
        role: "Head of Analytics, NARA",
      },
      {
        type: "heading",
        id: "contribution-margin",
        text: "Start with contribution margin",
      },
      {
        type: "paragraph",
        text: "Before touching attribution, calculate what a customer is worth after the costs that scale with the sale: COGS, fulfilment, payment fees, returns, and any channel-specific costs. That contribution margin is the budget from which acquisition is funded.",
      },
      {
        type: "paragraph",
        text: "Then layer in retention. A first-order contribution figure is a snapshot; a 12-month cohort value is a strategy. When we model payback by cohort, we often find that channels dismissed as inefficient are actually the strongest long-term sources of value, while some apparent winners are buying one-off discount hunters.",
      },
      {
        type: "stats",
        items: [
          { value: "38%", label: "Budget reallocated", detail: "Share of media budget moved after the first incrementality cycle in a recent engagement." },
          { value: "2.4x", label: "Median variance", detail: "Gap between platform-reported ROAS and measured incremental return across accounts." },
          { value: "6 wks", label: "Minimum test window", detail: "The shortest period we trust for a geo or audience holdout in most categories." },
        ],
      },
      {
        type: "heading",
        id: "triangulation",
        text: "The triangulation stack",
      },
      {
        type: "paragraph",
        text: "We use three layers of evidence. The first is platform attribution: fast, granular, and biased. The second is blended efficiency: total revenue against total media spend and total acquisition cost. Slower, but harder to game. The third is incrementality: geo holdouts, audience splits, or conversion lift studies that estimate what would have happened without the spend.",
      },
      {
        type: "paragraph",
        text: "No single layer is sufficient. Platform data tells you where to look. Blended data tells you whether the whole system is working. Incrementality tells you whether the spend caused the outcome. When all three point in the same direction, you can scale with confidence. When they diverge, you have found the most valuable question in the account.",
      },
      {
        type: "callout",
        label: "Measurement principle",
        title: "One test at a time, one decision per test.",
        text: "Run incrementality tests in sequence, not in a cluster. Overlapping tests contaminate each other and produce confident answers to the wrong questions. Write the decision rule before the test begins.",
      },
      {
        type: "heading",
        id: "weekly-truth",
        text: "Build a weekly truth table",
      },
      {
        type: "paragraph",
        text: "Dashboards are designed to be looked at. Truth tables are designed to be argued with. Once a week, put four numbers side by side for each major channel: spend, platform-reported revenue, contribution after margin, and incremental contribution estimate. Then write one sentence explaining the gap.",
      },
      {
        type: "paragraph",
        text: "The ritual matters more than the precision. It trains the team to treat every reported number as a claim rather than a fact, and it creates a written record of what you believed and why. Over a quarter, that record becomes more valuable than any single attribution model.",
      },
      {
        type: "list",
        items: [
          "Keep the table to one page. If it needs a scroll, it will not be used.",
          "Annotate structural changes: promotions, launches, pricing, creative resets, seasonality.",
          "Review leading indicators weekly and economic outcomes monthly. Do not confuse the two.",
        ],
      },
      {
        type: "heading",
        id: "guardrails",
        text: "Guardrails, not dashboard theatre",
      },
      {
        type: "paragraph",
        text: "The output of measurement should be a small set of guardrails that shape decisions: a maximum CAC payback by cohort, a minimum contribution margin after media, a blended efficiency floor, and a trigger for reallocating budget. These are not dashboards. They are operating rules.",
      },
      {
        type: "paragraph",
        text: "When a guardrail is breached, the team has a pre-agreed response. That is the difference between measurement as reporting and measurement as management. The number stops being something you present and becomes something you act on.",
      },
      {
        type: "paragraph",
        text: "ROAS will remain on the dashboard, and that is fine. Just do not let a ratio make decisions that belong to the P&L. Measure the business, then optimise the channel.",
      },
    ],
  },
  "creative-velocity": {
    subtitle:
      "Volume without a system produces noise. The brands winning the feed are running creative like a product team — briefs, sprints, scorecards, and a ruthless feedback loop.",
    authorRole: "Creative Director",
    authorBio:
      "Iris leads NARA's creative practice, building performance systems that keep brand coherence intact at high output. She has directed campaigns for beauty, wellness, and technology brands.",
    takeaways: [
      "Creative velocity is an operating model, not a content calendar.",
      "Ship against a thesis, score against leading indicators, and retire without sentiment.",
      "Brand codes create recognition. Recognition is what makes volume compound.",
    ],
    nextSlug: "paid-media-playbook",
    blocks: [
      {
        type: "paragraph",
        text: "There is a version of creative velocity that looks impressive in a case study and destructive in a business: fifty assets a month, no point of view, no memory, no compounding. The feed gets fed. Nothing gets learned. This is not velocity. It is churn with a production budget.",
      },
      {
        type: "paragraph",
        text: "The alternative is to run creative the way a good product team runs software. A clear thesis, small bets, fast feedback, and a system that gets smarter with every release. The output is not just more assets. It is more certainty about what to make next.",
      },
      {
        type: "heading",
        id: "creative-is-media",
        text: "Creative is now a media function",
      },
      {
        type: "paragraph",
        text: "Automated bidding has absorbed much of the tactical work that used to define media buying. The algorithm can explore audiences, adjust bids, and allocate budget at a speed no human can match. What it cannot do is invent a reason for someone to stop scrolling.",
      },
      {
        type: "paragraph",
        text: "That reason lives in the creative. In most accounts we audit, creative is now the largest controllable variable in performance — larger than audience targeting, placement, or bid strategy. Yet creative is still often managed as a vendor relationship rather than a core growth system.",
      },
      {
        type: "heading",
        id: "velocity-trap",
        text: "The velocity trap",
      },
      {
        type: "paragraph",
        text: "When teams first commit to creative volume, they usually optimise for the wrong thing: asset count. More variations, more edits, more hooks. The result is a pile of near-duplicates that teach the auction nothing and exhaust the team.",
      },
      {
        type: "paragraph",
        text: "Real velocity is measured in learning cycles, not deliverables. A team that ships twelve deliberately different concepts and learns which insight drives response is moving faster than a team that ships sixty variations of the same idea. The first team has a map. The second has a pile.",
      },
      {
        type: "quote",
        quote:
          "The goal is not to make more ads. The goal is to make the next ad smarter than the last one.",
        attribution: "Iris Chen",
        role: "Creative Director, NARA",
      },
      {
        type: "heading",
        id: "creative-thesis",
        text: "Start with a creative thesis",
      },
      {
        type: "paragraph",
        text: "A creative thesis is a point of view about why the customer should care. It is specific enough to be wrong. 'Our product is high quality' is not a thesis. 'Women in their late thirties are tired of being sold anti-aging and want to be sold capability' is a thesis. It implies a message, a tone, a visual world, and a set of tests.",
      },
      {
        type: "paragraph",
        text: "We build theses from three inputs: customer language, category conventions, and the brand's own evidence. Customer language comes from reviews, support tickets, and sales calls. Category conventions tell us what to subvert. Brand evidence tells us what we can credibly claim. The intersection is where distinctive work lives.",
      },
      {
        type: "callout",
        label: "Sprint structure",
        title: "One insight. Three worlds. Five days.",
        text: "Each sprint begins with one customer insight and produces three distinct creative worlds, not three edits of one ad. Every world gets a hypothesis and a success metric before production starts.",
      },
      {
        type: "heading",
        id: "four-week-sprint",
        text: "The four-week operating rhythm",
      },
      {
        type: "list",
        items: [
          "Week 1 — Insight: mine customer language, review top and bottom performers, and write the sprint thesis.",
          "Week 2 — Production: build three distinct worlds across the formats that matter. Keep brand codes fixed; vary the idea.",
          "Week 3 — Launch: run a clean test with enough budget to reach significance. Do not judge before the data is ready.",
          "Week 4 — Decide: score, document, and retire. Feed the learning into the next thesis.",
        ],
      },
      {
        type: "paragraph",
        text: "The rhythm is intentionally boring. Creativity benefits from constraint, and the market benefits from consistency. A team that knows what happens on each week of the cycle spends its energy on ideas instead of logistics.",
      },
      {
        type: "heading",
        id: "scoring",
        text: "Score the work, not the vibe",
      },
      {
        type: "paragraph",
        text: "Performance creative needs a scorecard that separates the parts of the ad. We score hook rate, hold rate, click-through, and conversion rate, then tie each back to the creative decision that produced it. A weak hook and a weak offer demand different fixes. Without component-level scoring, teams redesign the whole ad and lose the signal.",
      },
      {
        type: "paragraph",
        text: "Retire quickly. The most common failure in high-volume creative is sentimental persistence — keeping an underperformer alive because it was expensive to produce or because someone in the room likes it. A clear kill rule protects the system from taste.",
      },
      {
        type: "stats",
        items: [
          { value: "60+", label: "Assets per month", detail: "Typical output for a mature performance creative engine across core formats." },
          { value: "5–7d", label: "Feedback loop", detail: "Time from launch to an initial read on hook and hold performance." },
          { value: "3", label: "Fixed brand codes", detail: "The recognition anchors that stay constant across every creative world." },
        ],
      },
      {
        type: "heading",
        id: "brand-coherence",
        text: "Coherence at volume",
      },
      {
        type: "paragraph",
        text: "High-volume creative only compounds if people recognise it as you. That requires a small set of brand codes — a colour, a typographic move, a recurring phrase, a casting principle — that remain stable while the idea changes. Codes are not a constraint on creativity. They are the reason creativity accumulates instead of resetting.",
      },
      {
        type: "paragraph",
        text: "The mistake is treating consistency as sameness. A brand can explore wildly different stories as long as the recognition layer is intact. The feed should feel varied; the brand should feel unmistakable.",
      },
      {
        type: "paragraph",
        text: "Build the system, protect the codes, and let the ideas move. Velocity without coherence is noise. Coherence without velocity is inertia. The compounding happens in the overlap.",
      },
    ],
  },
};

export function getArticle(slug: string) {
  return articles[slug];
}

export function getNextInsight(slug: string) {
  const article = articles[slug];
  return article ? article.nextSlug : undefined;
}
