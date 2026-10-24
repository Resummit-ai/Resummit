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

  // Real verified numbers only (hidden when null)
  realStats: {
    userCountText: "Used by 31 developers",
    reposScanned: null,
    bulletsWritten: null,
    versionsGenerated: null,
    avgAtsScore: null,
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
        description: "Essential GitHub CV generation for students and developers.",
        monthlyPrice: 0,
        yearlyPrice: 0,
        popular: false,
        features: [
          "1 Master CV synced with GitHub",
          "Automatic commit & README analysis",
          "Tailor your CV to a job description",
          "Standard ATS-friendly PDF export",
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
          "Commit impact extraction",
          "Skills gap analysis",
          "Priority AI bullet refinement",
          "On-demand refresh",
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
          { name: "GitHub repositories scanned", free: "Public repos", pro: "Public repos", campus: "Public repos" },
          { name: "Sync frequency", free: "Manual (up to 3/hr)", pro: "Priority manual", campus: "Priority manual" },
        ],
      },
      {
        category: "AI & Tailoring Features",
        rows: [
          { name: "Commit impact extraction", free: true, pro: true, campus: true },
          { name: "Tailor CV to job description", free: "Included", pro: "Advanced semantic", campus: "Advanced semantic" },
          { name: "Skills gap audit", free: false, pro: true, campus: true },
          { name: "Bullet rewriting suggestions", free: "3 / day", pro: "Unlimited", campus: "Unlimited" },
        ],
      },
      {
        category: "Export & Support",
        rows: [
          { name: "ATS-friendly PDF export", free: true, pro: true, campus: true },
          { name: "Plain text export", free: true, pro: true, campus: true },
          { name: "Support response time", free: "Community", pro: "< 24 hours", campus: "< 24 hours" },
        ],
      },
    ] as ComparisonCategory[],
  },

  faq: [
    {
      question: "Is my GitHub account safe?",
      answer:
        "Yes. We read repository metadata, READMEs and commit messages to write your resume. We do not modify your repositories.",
    },
    {
      question: "Does Resummit write to my repositories?",
      answer:
        "No. We never write, commit, or create pull requests in your repositories. Read-only access to your public repos.",
    },
    {
      question: "Can I manually edit my CV after it's generated?",
      answer:
        "Yes. Every bullet point, summary sentence, and experience item is completely editable. Your edits are never overwritten.",
    },
    {
      question: "How do I tailor my CV to a job description?",
      answer:
        "Paste any job description to tailor your CV in seconds. Resummit analyzes the role requirements against your repositories and highlights your most relevant project experience, tech stack, and accomplishments.",
    },
    {
      question: "Does it work without GitHub?",
      answer:
        "Yes. You can start with a blank profile, paste existing bullet points, or import your resume. Connecting GitHub is optional, but it powers automatic project and bullet extraction.",
    },
    {
      question: "Is Resummit free to use?",
      answer:
        "Yes, Resummit is free to start during public preview. You can connect public GitHub repositories, tailor your CV to job descriptions, and export clean ATS-friendly PDFs with no credit card required.",
    },
    {
      question: "Can I sync LinkedIn profile data?",
      answer:
        "LinkedIn sync is coming soon. Today, you can connect your public GitHub repositories and paste job descriptions for instant resume tailoring.",
    },
    {
      question: "Which export formats are supported?",
      answer:
        "Currently we export clean, single-column, ATS-friendly standard PDFs. Clean text and JSON formats are also available.",
    },
  ] as FaqItem[],

  footer: {
    columns: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "How it works", href: "#pipeline" },
          { label: "One CV per job", href: "#roles" },
          { label: "Sample Resume", href: "#preview-resume" },
          { label: "Pricing", href: "#pricing" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "GitHub", href: "https://github.com/dragon486/Resummit" },
          { label: "Share Feedback", href: "#feedback" },
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
