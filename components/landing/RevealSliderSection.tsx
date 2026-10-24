"use client";

import React, { useState, useRef, useCallback } from "react";
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";

export function RevealSliderSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  return (
    <section
      id="comparison-reveal"
      className="scroll-mt-24 bg-[#F5F5F3] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#f2efe9] py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-[#27272a] transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <SectionReveal className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-[#0099ff] border border-blue-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            <SlidersHorizontal size={14} />
            <span>Interactive Comparison</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] dark:text-[#f2efe9] leading-[1.12] mb-4">
            Before &amp; After AI Synthesis
          </h2>
          <p className="text-base sm:text-lg text-slate-700 dark:text-neutral-300 font-normal leading-relaxed">
            Drag the comparison slider to reveal how Resummit transforms raw, uncalibrated developer commits into an ATS-certified, recruiter-ready resume.
          </p>
        </SectionReveal>

        {/* Realistic Resume Comparison Slider */}
        <SectionReveal delay={1}>
          <div
            ref={containerRef}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            className="relative w-full max-w-5xl mx-auto h-[620px] sm:h-[580px] rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-[#27272a] shadow-2xl bg-white dark:bg-[#141417] select-none cursor-ew-resize"
          >
            {/* 1. AFTER Panel: Recruiter-Ready ATS Resume (Full Underlayer) */}
            <div className="absolute inset-0 w-full h-full p-6 sm:p-10 flex flex-col justify-between bg-white dark:bg-[#141417] text-[#0f172a] dark:text-[#f2efe9]">
              {/* Floating Top Badge */}
              <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-xs font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  AFTER: RESUMMIT AI SYNTHESIS
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  <CheckCircle2 size={14} />
                  <span>98% ATS Match Rate · Recruiter Certified</span>
                </div>
              </div>

              {/* Realistic Resume Sheet Content (After) */}
              <div className="space-y-4 font-serif text-[12px] sm:text-[13px] leading-relaxed">
                {/* Header */}
                <div className="text-center pb-2 border-b-[1.5px] border-[#0f172a] dark:border-[#f2efe9]">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-wider text-[#0f172a] dark:text-[#f2efe9]">
                    ALEX DEVELOPER
                  </h3>
                  <p className="text-[11px] text-[#475569] dark:text-neutral-400 mt-1 font-sans">
                    San Francisco, CA (Open to Remote) · alex@developer.com · github.com/alex-dev · linkedin.com/in/alex-dev
                  </p>
                </div>

                {/* Summary */}
                <div>
                  <div className="font-bold text-[11px] uppercase tracking-wider border-b border-[#0f172a] dark:border-[#f2efe9] pb-0.5 mb-1.5 text-[#0f172a] dark:text-[#f2efe9] font-sans">
                    TECHNICAL SUMMARY
                  </div>
                  <p className="text-[11.5px] text-[#334155] dark:text-neutral-200">
                    Full-Stack Software Engineer with expertise in distributed backend systems and high-throughput TypeScript architectures. Proven track record transforming GitHub commits into measurable, production-grade business outcomes.
                  </p>
                </div>

                {/* Experience */}
                <div>
                  <div className="font-bold text-[11px] uppercase tracking-wider border-b border-[#0f172a] dark:border-[#f2efe9] pb-0.5 mb-2 text-[#0f172a] dark:text-[#f2efe9] font-sans">
                    PROFESSIONAL EXPERIENCE
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between font-bold text-[12px] text-[#0f172a] dark:text-[#f2efe9]">
                        <span>Senior Full-Stack Engineer — TechScale Systems</span>
                        <span>2024 — Present</span>
                      </div>
                      <ul className="list-disc ml-5 space-y-1 mt-1 text-[11.5px] text-[#334155] dark:text-neutral-200">
                        <li>
                          <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">[Google XYZ]</strong> Architected high-throughput Redis caching layer with optimistic cache warming, cutting database read latency by 42% across 12,000+ daily events.
                        </li>
                        <li>
                          Implemented Next.js 15 App Router server actions with optimistic UI mutations, lowering overall TTFB to 180ms.
                        </li>
                        <li>
                          Automated GitHub Actions CI/CD workflows conforming to strict WCAG 2.1 AA standards, shortening release cycle times from 35m to 8m.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Telemetry */}
              <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#27272a] flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-neutral-400 font-sans">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Greenhouse · Lever · Workday Certified</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">0 Formatting Errors · 100% Parsed</span>
              </div>
            </div>

            {/* 2. BEFORE Panel: Realistic Rejected Draft Resume (Clipped Overlayer) */}
            <div
              className="absolute inset-0 h-full overflow-hidden bg-[#fafafa] dark:bg-[#111113] p-6 sm:p-10 flex flex-col justify-between text-neutral-800 dark:text-neutral-300"
              style={{ width: `${sliderPosition}%` }}
            >
              <div style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}>
                {/* Floating Top Badge */}
                <div className="flex items-center justify-between mb-4 border-b border-red-500/20 pb-3 pr-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/25 text-xs font-bold font-mono">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    BEFORE: UNCALIBRATED DRAFT
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-800">
                    <AlertCircle size={14} />
                    <span>34% ATS Match (Rejected by Filters)</span>
                  </div>
                </div>

                {/* Realistic Messy Resume Sheet Content (Before) */}
                <div className="space-y-4 font-sans text-[12px] sm:text-[13px] leading-relaxed max-w-4xl opacity-80">
                  {/* Header */}
                  <div className="text-center pb-2 border-b border-red-300 dark:border-red-900/50">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-700 dark:text-neutral-400 line-through decoration-red-400">
                      Alex Developer
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Alex&apos;s Resume | Email: alex@gmail.com | Phone: 555-0192 | Portfolio: (wip)
                    </p>
                  </div>

                  {/* Summary */}
                  <div>
                    <div className="font-bold text-[11px] uppercase tracking-wider text-red-600 dark:text-red-400 pb-0.5 mb-1.5 flex items-center gap-2">
                      <span>Objective</span>
                      <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                        ⚠️ Objective statements are obsolete
                      </span>
                    </div>
                    <p className="text-[11.5px] text-neutral-600 dark:text-neutral-400 line-through decoration-red-400">
                      Hardworking software engineer looking to learn new technologies and contribute to a fast-paced team environment.
                    </p>
                  </div>

                  {/* Experience */}
                  <div>
                    <div className="font-bold text-[11px] uppercase tracking-wider text-red-600 dark:text-red-400 pb-0.5 mb-2 flex items-center gap-2">
                      <span>Experience</span>
                      <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                        ⚠️ Missing business impact &amp; metrics
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between font-medium text-[12px] text-neutral-700 dark:text-neutral-400">
                          <span>Developer at TechScale Systems</span>
                          <span>2024 — Present</span>
                        </div>
                        <ul className="list-disc ml-5 space-y-1 mt-1 text-[11.5px] text-neutral-500 dark:text-neutral-400 line-through decoration-red-300">
                          <li>
                            Worked on backend stuff using Node.js and Redis to make the API faster for users.
                          </li>
                          <li>
                            Helped team fix bugs in authentication and database queries when needed.
                          </li>
                          <li>
                            Responsible for writing unit tests and deploying code to AWS servers.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Telemetry */}
              <div
                className="pt-3 border-t border-red-200 dark:border-red-900/40 flex items-center justify-between text-xs text-red-600 dark:text-red-400 font-sans"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth - 80}px` : "100%" }}
              >
                <span>Flagged by Greenhouse &amp; Lever ATS Parsers</span>
                <span className="font-mono">Match Score: 34% (Failed)</span>
              </div>
            </div>

            {/* 3. Slider Divider & Drag Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 shadow-[0_0_14px_rgba(0,119,255,0.9)] z-30 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white dark:bg-[#171717] border-2 border-blue-500 shadow-2xl flex items-center justify-center text-blue-600 dark:text-[#0099ff] pointer-events-auto cursor-grab active:cursor-grabbing">
                <div className="flex items-center -space-x-1">
                  <ChevronLeft size={18} />
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
