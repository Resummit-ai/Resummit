"use client";

import React, { useState, useRef, useCallback } from "react";
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, SlidersHorizontal } from "lucide-react";
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
            Drag the comparison slider to reveal how Resummit transforms raw, uncalibrated GitHub commits into high-converting, ATS-certified achievement bullets.
          </p>
        </SectionReveal>

        {/* Comparison Slider Container */}
        <SectionReveal delay={1}>
          <div
            ref={containerRef}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            className="relative w-full max-w-5xl mx-auto h-[540px] sm:h-[480px] rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-[#27272a] shadow-2xl bg-white dark:bg-[#141417] select-none cursor-ew-resize"
          >
            {/* 1. AFTER Panel (Right / Full Background Layer) */}
            <div className="absolute inset-0 w-full h-full p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-white to-blue-50/20 dark:from-[#141417] dark:via-[#141417] dark:to-[#0099ff]/5">
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-xs font-bold font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    AFTER: RESUMMIT AI SYNTHESIS
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 size={14} />
                    <span>98% ATS Match Rate</span>
                  </div>
                </div>

                {/* Achievement Bullets */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05]">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                      <Sparkles size={14} />
                      <span>Google XYZ Formula · Quantified Impact</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-neutral-100 leading-relaxed font-sans">
                      &ldquo;Architected high-throughput Redis caching layer with optimistic cache warming, cutting database read latency by 42% across 12,000+ daily events.&rdquo;
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.03] dark:bg-blue-500/[0.05]">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-[#0099ff] mb-1">
                      <CheckCircle2 size={14} />
                      <span>ATS Parser Certified · Zero Parse Errors</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-neutral-100 leading-relaxed font-sans">
                      &ldquo;Automated GitHub Actions CI/CD workflows conforming to WCAG 2.1 AA standards, shortening deployment cycle times from 35m to 8m.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Footer */}
              <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#27272a] flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-neutral-400">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Greenhouse · Lever · Workday Certified</span>
                <span className="font-mono">100% Parsed</span>
              </div>
            </div>

            {/* 2. BEFORE Panel (Left / Clipped Layer) */}
            <div
              className="absolute inset-0 h-full overflow-hidden bg-neutral-100 dark:bg-[#0c0c0e] p-6 sm:p-10 flex flex-col justify-between"
              style={{ width: `${sliderPosition}%` }}
            >
              <div style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-6 pr-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/25 text-xs font-bold font-mono">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    BEFORE: RAW COMMITS &amp; DRAFT
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-800">
                    <AlertCircle size={14} />
                    <span>34% ATS Match (Rejected)</span>
                  </div>
                </div>

                {/* Raw Commits & Weak Bullets */}
                <div className="space-y-4 max-w-xl">
                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/[0.04]">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-400 mb-1">
                      <AlertCircle size={14} />
                      <span>Unquantified · Passive Verbs · No Metrics</span>
                    </div>
                    <p className="text-sm font-normal text-slate-600 dark:text-neutral-400 leading-relaxed font-sans line-through decoration-red-400">
                      &ldquo;Worked on backend stuff using Node.js and Redis to make the API faster for users.&rdquo;
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.04]">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                      <AlertCircle size={14} />
                      <span>Missing Action Verbs · Flagged by Lever Filters</span>
                    </div>
                    <p className="text-sm font-normal text-slate-600 dark:text-neutral-400 leading-relaxed font-sans line-through decoration-amber-400">
                      &ldquo;Helped team fix bugs in CI/CD pipeline and updated some CSS components.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Footer */}
              <div
                className="pt-4 border-t border-neutral-300 dark:border-neutral-800 flex items-center justify-between text-xs text-red-600 dark:text-red-400"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth - 80}px` : "100%" }}
              >
                <span>Filtered by Applicant Tracking Systems</span>
                <span className="font-mono">Parse Score: 34%</span>
              </div>
            </div>

            {/* 3. Slider Divider & Drag Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 shadow-[0_0_12px_rgba(0,119,255,0.8)] z-30"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-[#171717] border-2 border-blue-500 shadow-xl flex items-center justify-center text-blue-600 dark:text-[#0099ff]">
                <div className="flex items-center -space-x-1">
                  <ChevronLeft size={16} />
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
