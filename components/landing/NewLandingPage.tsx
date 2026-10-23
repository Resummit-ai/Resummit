"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";

// Lazy-load below-the-fold sections with next/dynamic for Lighthouse 90+
const MarqueeSection = dynamic(() => import("./MarqueeSection").then((m) => m.MarqueeSection), {
  ssr: true,
});
const PipelineSection = dynamic(() => import("./PipelineSection").then((m) => m.PipelineSection), {
  ssr: true,
});
const WorkflowCanvas = dynamic(() => import("./WorkflowCanvas").then((m) => m.WorkflowCanvas), {
  ssr: true,
});
const CommitStreamSection = dynamic(() => import("./CommitStreamSection").then((m) => m.CommitStreamSection), {
  ssr: true,
});
const EditorDemoSection = dynamic(() => import("./EditorDemoSection").then((m) => m.EditorDemoSection), {
  ssr: true,
});
const RoleVersionsSection = dynamic(() => import("./RoleVersionsSection").then((m) => m.RoleVersionsSection), {
  ssr: true,
});
const PricingSection = dynamic(() => import("./PricingSection").then((m) => m.PricingSection), {
  ssr: true,
});
const FaqSection = dynamic(() => import("./FaqSection").then((m) => m.FaqSection), {
  ssr: true,
});
const FinalCtaSection = dynamic(() => import("./FinalCtaSection").then((m) => m.FinalCtaSection), {
  ssr: true,
});
const Footer = dynamic(() => import("./Footer").then((m) => m.Footer), {
  ssr: true,
});

export function NewLandingPage() {
  return (
    <div className="landing-root min-h-screen bg-[rgb(10,10,10)] text-[rgb(242,239,233)] selection:bg-blue-500 selection:text-white font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <MarqueeSection />
        <PipelineSection />
        <WorkflowCanvas />
        <CommitStreamSection />
        <EditorDemoSection />
        <RoleVersionsSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
