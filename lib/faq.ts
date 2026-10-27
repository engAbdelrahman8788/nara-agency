export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Single source of truth for the homepage FAQ.
 * The visible section and the FAQPage JSON-LD both read from these entries,
 * so the structured data always matches the on-page copy.
 */
export const faqItems: Record<"en" | "ar", FaqItem[]> = {
  en: [
    {
      question: "How does NARA calculate ad ROI?",
      answer:
        "NARA uses two inputs: monthly ad budget and average ticket size. The calculator applies a market-adjusted return multiple between 3.2x and 4.8x, scaled to the budget level, to project monthly revenue. Projected leads are that revenue divided by the average ticket size. The result is a directional monthly estimate; live engagements replace it with channel-level attribution, contribution margin, and CRM-confirmed pipeline data.",
    },
    {
      question:
        "What B2B marketing services does NARA offer in the Gulf region?",
      answer:
        "NARA provides B2B lead generation, performance marketing across Meta, Google, TikTok, and LinkedIn, SEO, content and social media management, web design and conversion optimization, and CRM-integrated lead tracking. Engagements are built for companies selling into Saudi Arabia, the UAE, Egypt, and the wider Gulf region, with English and Arabic delivery.",
    },
    {
      question: "How to track lead generation performance with NARA?",
      answer:
        "NARA connects campaign, landing-page, form, and CRM data so each lead can be traced to its source, campaign, and pipeline stage. Reporting covers cost per qualified lead, lead-to-opportunity and opportunity-to-close rates, pipeline value, customer acquisition cost, and return on ad spend. Performance is reviewed in weekly sprints and a shared dashboard.",
    },
  ],
  ar: [
    {
      question: "كيف تحسب NARA العائد على الإعلانات؟",
      answer:
        "تعتمد NARA على مدخلين: ميزانية الإعلان الشهرية ومتوسط قيمة الطلب. وتطبّق حاسبة العائد مضاعف عائد معدّلًا حسب السوق بين 3.2x و4.8x، يتدرّج بحسب مستوى الميزانية، لتقدير الإيراد الشهري. أما العملاء المتوقعون فيُحتسبون بقسمة الإيراد على متوسط قيمة الطلب. النتيجة تقدير استرشادي شهري، وفي التعاون الفعلي تستبدلها NARA بإسناد على مستوى القناة وهامش المساهمة وبيانات خط المبيعات المؤكدة من CRM.",
    },
    {
      question: "ما خدمات التسويق B2B التي تقدمها NARA في منطقة الخليج؟",
      answer:
        "تقدّم NARA توليد العملاء B2B، والتسويق الأدائي عبر Meta وGoogle وTikTok وLinkedIn، وتحسين محركات البحث، وإدارة المحتوى والتواصل الاجتماعي، وتصميم المواقع وتحسين التحويل، وتتبع العملاء المتكامل مع CRM. وتُصمّم الشراكات لشركات تستهدف السعودية والإمارات ومصر ومنطقة الخليج الأوسع، مع تنفيذ بالعربية والإنجليزية.",
    },
    {
      question: "كيف أتابع أداء توليد العملاء مع NARA؟",
      answer:
        "تربط NARA بيانات الحملات وصفحات الهبوط والنماذج وCRM، بحيث يمكن تتبع كل عميل محتمل إلى مصدره وحملته ومرحلة خط المبيعات. وتشمل التقارير تكلفة العميل المؤهل، ومعدلات التحول من عميل محتمل إلى فرصة ومن فرصة إلى إغلاق، وقيمة خط المبيعات، وتكلفة اكتساب العميل، والعائد على الإنفاق الإعلاني. وتُراجع النتائج في دورات أسبوعية ولوحة مشتركة.",
    },
  ],
};
