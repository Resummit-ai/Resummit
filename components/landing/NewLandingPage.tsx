"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";

// Below-the-fold dynamic imports
const MarqueeSection = dynamic(
  () => import("./MarqueeSection").then((m) => m.MarqueeSection),
  { ssr: true }
);
const PipelineSection = dynamic(
  () => import("./PipelineSection").then((m) => m.PipelineSection),
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
const EditorDemoSection = dynamic(
  () => import("./EditorDemoSection").then((m) => m.EditorDemoSection),
  { ssr: true }
);
const MagicSection = dynamic(
  () => import("./MagicSection").then((m) => m.MagicSection),
  { ssr: true }
);
const RoleVersionsSection = dynamic(
  () => import("./RoleVersionsSection").then((m) => m.RoleVersionsSection),
  { ssr: true }
);
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
const FeaturePillarsSection = dynamic(
  () => import("./FeaturePillarsSection").then((m) => m.FeaturePillarsSection),
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
const RevealSliderSection = dynamic(
  () => import("./RevealSliderSection").then((m) => m.RevealSliderSection),
  { ssr: true }
);
const Footer = dynamic(
  () => import("./Footer").then((m) => m.Footer),
  { ssr: true }
);
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";

export function NewLandingPage() {
  const scrollBarRef = useRef<HTMLDivElement>(null);

  // Scroll Progress Bar matching localhost:3000
  useEffect(() => {
    const onScroll = () => {
      if (!scrollBarRef.current) return;
      const el = document.documentElement;
      const pct = el.scrollHeight > el.clientHeight
        ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
        : 0;
      scrollBarRef.current.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-root min-h-screen bg-[#F5F5F3] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#f2efe9] selection:bg-neutral-800 selection:text-white font-sans antialiased transition-colors duration-300">
      <style jsx global>{`
        :root,
        [data-theme="light"],
        .light {
          --l-bg: #F5F5F3;
          --l-card: #FFFFFF;
          --l-surface-2: #F7F7F6;
          --l-text: #171717;
          --l-muted: #707070;
          --l-border: #E5E5E5;
        }

        [data-theme="dark"],
        .dark {
          --l-bg: #0a0a0a;
          --l-card: #141417;
          --l-surface-2: #18181b;
          --l-text: #f2efe9;
          --l-muted: #a1a1aa;
          --l-border: #27272a;
        }

        .light .landing-root,
        [data-theme="light"] .landing-root {
          background-color: #F5F5F3 !important;
          background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px) !important;
          background-size: 20px 20px !important;
          color: #171717 !important;
        }

        .dark .landing-root,
        [data-theme="dark"] .landing-root {
          background-color: #0a0a0a !important;
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px) !important;
          background-size: 20px 20px !important;
          color: #f2efe9 !important;
        }

        /* Hide browser scroll pad / vertical scrollbar completely across all browsers */
        html, body, :root {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* Light mode section and typography overrides */
        .light .landing-root section:not(.preserve-dark),
        [data-theme="light"] .landing-root section:not(.preserve-dark) {
          background-color: #F5F5F3 !important;
          border-color: #E5E5E5 !important;
          color: #171717 !important;
        }
        .light .landing-root h1,
        .light .landing-root h2,
        .light .landing-root h3,
        .light .landing-root h4,
        [data-theme="light"] .landing-root h1,
        [data-theme="light"] .landing-root h2,
        [data-theme="light"] .landing-root h3,
        [data-theme="light"] .landing-root h4 {
          color: #171717 !important;
        }
        .light .landing-root p:not(.preserve-dark *):not(.resume-paper *),
        [data-theme="light"] .landing-root p:not(.preserve-dark *):not(.resume-paper *) {
          color: #374151;
        }
        .light .hero-subtitle,
        [data-theme="light"] .hero-subtitle {
          color: #262626 !important;
          font-weight: 450 !important;
        }

        /* Dark mode section and typography overrides */
        .dark .landing-root section:not(.preserve-dark),
        [data-theme="dark"] .landing-root section:not(.preserve-dark) {
          background-color: #0a0a0a !important;
          border-color: #27272a !important;
          color: #f2efe9 !important;
        }
        .dark .landing-root h1,
        .dark .landing-root h2,
        .dark .landing-root h3,
        .dark .landing-root h4,
        [data-theme="dark"] .landing-root h1,
        [data-theme="dark"] .landing-root h2,
        [data-theme="dark"] .landing-root h3,
        [data-theme="dark"] .landing-root h4 {
          color: #f2efe9 !important;
        }
      `}</style>
      {/* 0. Scroll Progress Bar at the top of the viewport */}
      <div
        ref={scrollBarRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "3px",
          width: "0%",
          background: "linear-gradient(90deg, #0099ff, #a78bfa, #06b6d4)",
          backgroundSize: "200% 100%",
          zIndex: 99999,
          willChange: "width",
          boxShadow: "0 0 10px rgba(0, 153, 255, 0.7)",
        }}
      />

      <Navbar />

      <SmoothScrollProvider>
        <main>
          {/* 1. Hero Section: Editorial headline with RotatingText at top, real developer dashboard card below */}
          <Hero />

          {/* 2. Tech Stack Marquee (Serving developers shipping code at...) */}
          <MarqueeSection />

          {/* 3. Pipeline Architecture: Everything between your commits and your next offer (4 interactive tabs) */}
          <SectionReveal>
            <PipelineSection />
          </SectionReveal>

          {/* 4. Interactive Workflow Canvas: Wire up your resume in a minute (Connect all + animated laser beams) */}
          <SectionReveal>
            <WorkflowCanvas />
          </SectionReveal>

          {/* 5. Global Commit Stream: Real-time throughput & World Matrix */}
          <SectionReveal>
            <CommitStreamSection />
          </SectionReveal>

          {/* 6. Code Demo Section: Paste one repo. Generate in seconds (Interactive Run streaming code runner) */}
          <SectionReveal>
            <EditorDemoSection />
          </SectionReveal>

          {/* 7. The Magic: Raw commit to recruiter bullet (Continuous 4-phase looping transformation) */}
          <SectionReveal>
            <MagicSection />
          </SectionReveal>

          {/* 8. Role Catalog with Vertical Icon Rail (Tailored versions for every tech stack) */}
          <SectionReveal>
            <RoleVersionsSection />
          </SectionReveal>

          {/* 9. Interactive Resume Output (Alex Developer single-page resume + ATS audit score 98%) */}
          <SectionReveal>
            <ResumePreviewSection />
          </SectionReveal>

          {/* 10. Interactive Before/After Reveal Comparison Slider */}
          <RevealSliderSection />

          {/* 11. Design Statement Quote ("Create meaningful digital experiences where every line unfolds...") */}
          <SectionReveal>
            <DesignStatementSection />
          </SectionReveal>

          {/* 12. Stats Strip (50+ Resumes Generated, 10+ Countries, <60s Generation, 100% Free with animated counters) */}
          <SectionReveal>
            <StatsStripSection />
          </SectionReveal>

          {/* 13. Feature Pillars: Built for developers (3 cards with sky headers) */}
          <SectionReveal>
            <FeaturePillarsSection />
          </SectionReveal>

          {/* 14. Pricing Matrix with animated sliding Monthly/Annual toggle */}
          <SectionReveal>
            <PricingSection />
          </SectionReveal>

          {/* 15. FAQ Accordion */}
          <SectionReveal>
            <FaqSection />
          </SectionReveal>

          {/* 16. Feedback Form submitting to /api/feedback + Adel Muhammed attribution */}
          <SectionReveal>
            <FeedbackSection />
          </SectionReveal>

          {/* 17. Mountain Landscape Final CTA Banner */}
          <SectionReveal>
            <FinalCtaSection />
          </SectionReveal>
        </main>

        <Footer />
      </SmoothScrollProvider>
    </div>
  );
}
