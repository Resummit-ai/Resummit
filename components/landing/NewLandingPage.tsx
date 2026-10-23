"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";

// Lazy-load below-the-fold sections for maximum performance
const MarqueeSection = dynamic(() => import("./MarqueeSection").then((m) => m.MarqueeSection), {
  ssr: true,
});
const ProofStatementSection = dynamic(
  () => import("./ProofStatementSection").then((m) => m.ProofStatementSection),
  { ssr: true }
);
const PipelineSection = dynamic(() => import("./PipelineSection").then((m) => m.PipelineSection), {
  ssr: true,
});
const WorkflowCanvas = dynamic(() => import("./WorkflowCanvas").then((m) => m.WorkflowCanvas), {
  ssr: true,
});
const CommitStreamSection = dynamic(
  () => import("./CommitStreamSection").then((m) => m.CommitStreamSection),
  { ssr: true }
);
const EditorDemoSection = dynamic(
  () => import("./EditorDemoSection").then((m) => m.EditorDemoSection),
  { ssr: true }
);
const ResumePreviewSection = dynamic(
  () => import("./ResumePreviewSection").then((m) => m.ResumePreviewSection),
  { ssr: true }
);
const FeaturePillarsSection = dynamic(
  () => import("./FeaturePillarsSection").then((m) => m.FeaturePillarsSection),
  { ssr: true }
);
const RoleVersionsSection = dynamic(
  () => import("./RoleVersionsSection").then((m) => m.RoleVersionsSection),
  { ssr: true }
);
const PricingSection = dynamic(() => import("./PricingSection").then((m) => m.PricingSection), {
  ssr: true,
});
const FaqSection = dynamic(() => import("./FaqSection").then((m) => m.FaqSection), {
  ssr: true,
});
const FeedbackSection = dynamic(
  () => import("./FeedbackSection").then((m) => m.FeedbackSection),
  { ssr: true }
);
const FinalCtaSection = dynamic(
  () => import("./FinalCtaSection").then((m) => m.FinalCtaSection),
  { ssr: true }
);
const Footer = dynamic(() => import("./Footer").then((m) => m.Footer), {
  ssr: true,
});

export function NewLandingPage() {
  return (
    <div className="landing-root min-h-screen bg-[#09090b] text-white selection:bg-neutral-700 selection:text-white font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <MarqueeSection />
        <ProofStatementSection />
        <PipelineSection />
        <WorkflowCanvas />
        <CommitStreamSection />
        <EditorDemoSection />
        <ResumePreviewSection />
        <FeaturePillarsSection />
        <RoleVersionsSection />
        <PricingSection />
        <FaqSection />
        <FeedbackSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
