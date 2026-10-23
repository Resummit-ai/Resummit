// Centralized Landing Page Configuration & Truth Rules Dictionary
export interface NavLink {
  label: string;
  href: string;
}

export interface MetricStat {
  label: string;
  value: number | string | null;
  suffix?: string;
  description?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface ComparisonRow {
  name: string;
  free: string | boolean;
  pro: string | boolean;
  campus: string | boolean;
}

export interface ComparisonCategory {
  category: string;
  rows: ComparisonRow[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const LANDING_CONFIG = {
  brand: {
    name: "Resummit",
    tagline: "Your CV that updates itself.",
    description:
      "Connect GitHub, paste a job description, and get a CV tailored to that role. No templates, no rewriting.",
    pillText: "New · Tailor your CV to any job in seconds",
    primaryCta: {
      label: "Build my CV free",
      href: "/login",
    },
    secondaryCta: {
      label: "See how it works",
      href: "#pipeline",
    },
  },

  // Real verified numbers
  realStats: {
    userCountText: "Used by 31 developers",
    reposScanned: 1420,
    bulletsWritten: 8900,
    versionsGenerated: 420,
    avgAtsScore: 82,
  },

  navLinks: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#pipeline" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ] as NavLink[],

  pricing: {
    yearlyDiscountBadge: "Save 20%",
    plans: [
      {
        id: "free",
        name: "Hobby",
        description: "Essential GitHub CV generation for students and hobbyists.",
        monthlyPrice: 0,
        yearlyPrice: 0,
        popular: false,
        features: [
          "1 Master CV synced with GitHub",
          "Automatic commit & repository analysis",
          "1 Tailored CV version",
          "Standard PDF export",
          "Public GitHub repository support",
        ],
        ctaLabel: "Build my CV free",
        ctaHref: "/login",
      },
      {
        id: "pro",
        name: "Pro",
        description: "Unlimited tailored versions and role-matching for active job seekers.",
        monthlyPrice: 12,
        yearlyPrice: 9.6,
        popular: true,
        features: [
          "Unlimited Tailored CV versions",
          "Specialized role-targeting mode",
          "Deep commit impact analysis",
          "Missing skills gap analysis",
          "Priority AI bullet refinement",
          "Continuous background sync",
        ],
        ctaLabel: "Start Pro free trial",
        ctaHref: "/login",
      },
      {
        id: "campus",
        name: "Campus",
        description: "Special access for accredited university students.",
        monthlyPrice: 6,
        yearlyPrice: 4.8,
        popular: false,
        features: [
          "Everything in Pro",
          "Student organization badge",
          "Campus career portal alignment",
          "Extended history storage",
        ],
        ctaLabel: "Verify student email",
        ctaHref: "/login",
      },
    ] as PricingPlan[],

    comparison: [
      {
        category: "Usage & Versions",
        rows: [
          { name: "Master CV profiles", free: "1 Profile", pro: "Unlimited", campus: "Unlimited" },
          { name: "Tailored versions", free: "1 Version", pro: "Unlimited", campus: "Unlimited" },
          { name: "GitHub repositories scanned", free: "Up to 5", pro: "Unlimited", campus: "Unlimited" },
          { name: "Sync frequency", free: "Manual trigger", pro: "Automatic daily", campus: "Automatic daily" },
        ],
      },
      {
        category: "AI & Tailoring Features",
        rows: [
          { name: "Commit impact extraction", free: true, pro: true, campus: true },
          { name: "Job description matching", free: "Basic", pro: "Advanced semantic", campus: "Advanced semantic" },
          { name: "Skills gap audit", free: false, pro: true, campus: true },
          { name: "Bullet rewriting suggestions", free: "3 / day", pro: "Unlimited", campus: "Unlimited" },
        ],
      },
      {
        category: "Export & Support",
        rows: [
          { name: "Clean PDF export", free: true, pro: true, campus: true },
          { name: "Plain text / JSON export", free: true, pro: true, campus: true },
          { name: "Support response time", free: "Community", pro: "< 24 hours", campus: "< 24 hours" },
        ],
      },
    ] as ComparisonCategory[],
  },

  faq: [
    {
      question: "Is my GitHub account safe?",
      answer:
        "Yes, completely safe. Resummit requests strict read-only access to your public repositories and metadata. We cannot modify your code, commit to branches, or make any changes to your GitHub account.",
    },
    {
      question: "Does Resummit write to my repositories?",
      answer:
        "No. We never write, commit, or create pull requests in your repositories. Our connection is strictly read-only to analyze your project code, commit logs, and README descriptions.",
    },
    {
      question: "Can I manually edit my CV after it's generated?",
      answer:
        "Yes. Every bullet point, summary sentence, and experience item is completely editable. When GitHub syncs new commits, your personal edits and customizations are preserved and never overwritten.",
    },
    {
      question: "Does it work without GitHub?",
      answer:
        "Yes. You can start with a blank profile, paste existing bullet points, or import an existing resume. Connecting GitHub is optional, but it powers the automatic bullet generation.",
    },
    {
      question: "How does job tailoring work?",
      answer:
        "You paste the job description you are targeting. Resummit compares the required skills and qualifications against your real projects and emphasizes the most relevant accomplishments and metrics.",
    },
    {
      question: "Is Resummit free to use?",
      answer:
        "Yes, Resummit is 100% free while in public early access. You get full access to GitHub repo ingestion, Google XYZ bullet generation, role tailoring, and ATS compliance audits with no credit card required.",
    },
    {
      question: "Which export formats are supported?",
      answer:
        "Currently we export clean, ATS-parsed standard PDF and structured JSON. Formats like Word (.docx) are coming soon.",
    },
  ] as FaqItem[],

  footer: {
    columns: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "How it works", href: "#pipeline" },
          { label: "Free Access", href: "#pricing" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Documentation", href: "#" },
          { label: "API Reference", href: "#" },
          { label: "Changelog", href: "#" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "#" },
          { label: "GitHub", href: "https://github.com/dragon486/Resummit" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/adel-muhammed-71328a2b5" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ],
      },
    ],
    copyright: "© 2026 Resummit. Built for developers and students.",
  },
};
