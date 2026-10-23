"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";

// Below-the-fold sections
const ResumePreviewSection = dynamic(
  () => import("./ResumePreviewSection").then((m) => m.ResumePreviewSection),
  { ssr: true }
);
const DesignStatementSection = dynamic(
  () => import("./DesignStatementSection").then((m) => m.DesignStatementSection),
  { ssr: true }
);
const StatsStripSection = dynamic(
  () => import("./StatsStripSection").then((m) => m.StatsStripSection),
  { ssr: true }
);
const MarqueeSection = dynamic(
  () => import("./MarqueeSection").then((m) => m.MarqueeSection),
  { ssr: true }
);
const MagicSection = dynamic(
  () => import("./MagicSection").then((m) => m.MagicSection),
  { ssr: true }
);
const FeaturePillarsSection = dynamic(
  () => import("./FeaturePillarsSection").then((m) => m.FeaturePillarsSection),
  { ssr: true }
);
const WorkflowCanvas = dynamic(
  () => import("./WorkflowCanvas").then((m) => m.WorkflowCanvas),
  { ssr: true }
);
const CommitStreamSection = dynamic(
  () => import("./CommitStreamSection").then((m) => m.CommitStreamSection),
  { ssr: true }
);
const RoleVersionsSection = dynamic(
  () => import("./RoleVersionsSection").then((m) => m.RoleVersionsSection),
  { ssr: true }
);
const PricingSection = dynamic(
  () => import("./PricingSection").then((m) => m.PricingSection),
  { ssr: true }
);
const FaqSection = dynamic(
  () => import("./FaqSection").then((m) => m.FaqSection),
  { ssr: true }
);
const FeedbackSection = dynamic(
  () => import("./FeedbackSection").then((m) => m.FeedbackSection),
  { ssr: true }
);
const FinalCtaSection = dynamic(
  () => import("./FinalCtaSection").then((m) => m.FinalCtaSection),
  { ssr: true }
);
const Footer = dynamic(
  () => import("./Footer").then((m) => m.Footer),
  { ssr: true }
);

export function NewLandingPage() {
  return (
    <div className="landing-root min-h-screen bg-[#0a0a0a] text-[#f2efe9] selection:bg-neutral-800 selection:text-white font-sans antialiased">
      <Navbar />
      <main>
        {/* 1. Single Unified Hero Section (Directly from localhost:3000 FairweatherHero, dark styled, no white borders) */}
        <Hero />

        {/* 2. Interactive Output (Screenshot 1: Authentic full Alex Developer resume + Recruiter-Ready copy) */}
        <ResumePreviewSection />

        {/* 3. Design Statement Quote (Screenshot 3: "Create meaningful digital experiences where every line unfolds with [precision]...") */}
        <DesignStatementSection />

        {/* 4. Stats Strip (Screenshot 4: 50+ Resumes Generated, 10+ Countries, <60s Generation, 100% Free) */}
        <StatsStripSection />

        {/* 5. Tech Stack Marquee (Docker, Prisma, Redis, AWS, Next.js, React, TypeScript, GitHub, TensorFlow, PostgreSQL...) */}
        <MarqueeSection />

        {/* 6. The Magic: Raw commit to recruiter bullet (Screenshot 5: weather-app commits -> pulsing AI synthesis -> Alex Carter resume) */}
        <MagicSection />

        {/* 7. Features: Built for developers (GitHub Sync, AI Resume Writing, PDF Export with sky header cards) */}
        <FeaturePillarsSection />

        {/* 8. Interactive Node Graph Canvas with animated pulsing SVG beams */}
        <WorkflowCanvas />

        {/* 9. Commit Stream & Real-time Throughput with World Matrix */}
        <CommitStreamSection />

        {/* 10. Role Catalog with Vertical Icon Rail */}
        <RoleVersionsSection />

        {/* 11. Pricing Matrix (Hobby, Pro, Lifetime, Campus) */}
        <PricingSection />

        {/* 12. FAQ Accordion */}
        <FaqSection />

        {/* 13. Feedback Form submitting to /api/feedback + Adel Muhammed attribution */}
        <FeedbackSection />

        {/* 14. Mountain Landscape Final CTA Banner */}
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
