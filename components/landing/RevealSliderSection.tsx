"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";

export function RevealSliderSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth position updater with extended edge snapping
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Total physical width
    const totalWidth = rect.width;
    if (totalWidth <= 0) return;

    // Handle radius is ~20px. Snap when within 24px of edge (or <= 4% / >= 96%)
    const x = clientX - rect.left;
    let percent = (x / totalWidth) * 100;

    // Strict snapping: ensures 100% clean view with ZERO ghost slivers at edges
    if (percent <= 4.5 || x <= 28) {
      percent = 0;
    } else if (percent >= 95.5 || x >= totalWidth - 28) {
      percent = 100;
    }

    setSliderPosition(Math.max(0, Math.min(100, percent)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  return (
    <section
      id="comparison-reveal"
      className="scroll-mt-24 bg-[#F5F5F3] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#f2efe9] py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-[#27272a] transition-colors duration-300"
    >
      {/* Scoped CSS to enforce high-contrast black ink on white CV paper in both light & dark modes */}
      <style>{`
        .cv-sheet-paper,
        .cv-sheet-paper * {
          color: #0f172a !important;
          -webkit-text-fill-color: #0f172a !important;
        }
        .cv-sheet-paper .cv-heading {
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
        }
        .cv-sheet-paper .cv-subheading {
          color: #1e293b !important;
          -webkit-text-fill-color: #1e293b !important;
        }
        .cv-sheet-paper .cv-muted {
          color: #475569 !important;
          -webkit-text-fill-color: #475569 !important;
        }
        .cv-sheet-paper .cv-link {
          color: #1d4ed8 !important;
          -webkit-text-fill-color: #1d4ed8 !important;
        }
        .cv-sheet-paper .cv-red-text {
          color: #dc2626 !important;
          -webkit-text-fill-color: #dc2626 !important;
        }
        .cv-sheet-paper .cv-red-badge {
          background-color: #fee2e2 !important;
          color: #991b1b !important;
          -webkit-text-fill-color: #991b1b !important;
          border-color: #fca5a5 !important;
        }
        .cv-sheet-paper .cv-green-badge {
          background-color: #dcfce7 !important;
          color: #166534 !important;
          -webkit-text-fill-color: #166534 !important;
          border-color: #86efac !important;
        }
        .cv-sheet-paper .cv-strike {
          text-decoration: line-through !important;
          text-decoration-color: #ef4444 !important;
          color: #475569 !important;
          -webkit-text-fill-color: #475569 !important;
        }
      `}</style>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <SectionReveal className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-[#0099ff] border border-blue-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            <SlidersHorizontal size={14} />
            <span>Interactive Resume Audit</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] dark:text-[#f2efe9] leading-[1.12] mb-4">
            Before &amp; After AI Synthesis
          </h2>
          <p className="text-base sm:text-lg text-slate-700 dark:text-neutral-300 font-normal leading-relaxed">
            Drag the comparison slider across the CV to reveal how Resummit transforms a rejected, uncalibrated developer draft into a 98% ATS-optimized recruiter resume.
          </p>
        </SectionReveal>

        {/* The Authentic Resume Paper Sheet Container */}
        <SectionReveal delay={1}>
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative w-full max-w-4xl mx-auto min-h-[640px] sm:min-h-[660px] bg-white rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-[#E5E5E5] dark:border-[#27272a] select-none cursor-ew-resize touch-none"
          >
              {/* 1. UNDERLAYER: Recruiter-Ready ATS Resume Paper (Full 100% Width & Height) */}
              <div className="cv-sheet-paper absolute inset-0 w-full h-full bg-white text-[#0f172a] p-6 sm:p-10 md:p-12 flex flex-col justify-between font-serif select-text">
                {/* Top Recruiter Verification Pill */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 font-sans">
                  <span className="cv-muted text-[10px] font-mono font-bold tracking-wider uppercase">
                    RESUMMIT SYNTHESIS ENGINE · V2.4
                  </span>
                  <span className="cv-green-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-sans">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>98% ATS MATCH · RECRUITER CERTIFIED</span>
                  </span>
                </div>

                {/* CV Body Content */}
                <div className="space-y-4 text-[12px] sm:text-[13px] leading-relaxed">
                  {/* CV Header */}
                  <div className="text-center pb-2 border-b-[1.5px] border-[#0f172a]">
                    <h3
                      className="cv-heading text-2xl font-bold tracking-wider uppercase"
                      style={{ letterSpacing: "1.5px" }}
                    >
                      ALEX M. DEVELOPER
                    </h3>
                    <p className="cv-muted text-[11px] mt-1 font-sans">
                      San Francisco, CA (Open to Remote) · alex@developer.com · +1 (555) 019-2834 ·{" "}
                      <span className="cv-link underline">github.com/alex-dev</span> ·{" "}
                      <span className="cv-link underline">linkedin.com/in/alex-dev</span>
                    </p>
                  </div>

                  {/* Technical Summary */}
                  <div>
                    <div className="font-bold text-[11px] uppercase tracking-wider border-b border-[#0f172a] pb-0.5 mb-1.5 text-[#0f172a] font-sans">
                      PROFESSIONAL SUMMARY
                    </div>
                    <p className="text-[11.5px] text-[#334155] leading-relaxed">
                      High-impact Full-Stack Software Engineer with deep expertise in distributed backend systems and high-throughput TypeScript architectures. Proven track record turning production GitHub commits into measurable, high-concurrency business outcomes, cutting p99 read latency by 42% and automating mission-critical deployment pipelines.
                    </p>
                  </div>

                  {/* Professional Experience */}
                  <div>
                    <div className="font-bold text-[11px] uppercase tracking-wider border-b border-[#0f172a] pb-0.5 mb-2 text-[#0f172a] font-sans">
                      WORK EXPERIENCE
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between font-bold text-[12px] text-[#0f172a]">
                          <span>TechScale Systems — Senior Full-Stack Engineer</span>
                          <span>2024 — Present</span>
                        </div>
                        <div className="text-[10.5px] text-[#475569] italic mb-1 font-sans">
                          Core Platform Engineering · San Francisco, CA
                        </div>
                        <ul className="list-disc ml-5 space-y-1 text-[11.5px] text-[#334155] leading-snug">
                          <li>
                            <strong className="text-emerald-800 font-semibold">[Google XYZ]</strong> Architected distributed Redis caching layer with optimistic cache warming, cutting database read latency by 42% across 14,000+ daily events.
                          </li>
                          <li>
                            Automated GitHub Actions CI/CD workflows conforming to strict WCAG 2.1 AA standards, shortening release cycle times from 35m to 8m (77% speedup).
                          </li>
                          <li>
                            Implemented Next.js 15 App Router server actions with optimistic UI mutations, lowering overall TTFB to 180ms.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Technical Skills */}
                  <div>
                    <div className="font-bold text-[11px] uppercase tracking-wider border-b border-[#0f172a] pb-0.5 mb-1 text-[#0f172a] font-sans">
                      TECHNICAL SKILLS
                    </div>
                    <p className="text-[11px] text-[#334155] font-sans leading-normal">
                      <strong>Languages &amp; Frameworks:</strong> TypeScript, Go, Python, Next.js, React, Node.js, Express, Tailwind CSS<br />
                      <strong>Infrastructure &amp; Databases:</strong> AWS (ECS, S3, RDS), Docker, Redis, PostgreSQL, Prisma ORM, GitHub Actions CI/CD
                    </p>
                  </div>
                </div>

                {/* Bottom Telemetry Footer */}
                <div className="pt-2.5 border-t border-neutral-200 flex items-center justify-between text-[11px] text-[#475569] font-sans">
                  <span className="text-emerald-800 font-semibold">
                    ✓ Greenhouse · Lever · Workday ATS Parser Certified
                  </span>
                  <span className="font-mono text-emerald-800 font-bold">
                    0 Formatting Errors · 100% Parsed
                  </span>
                </div>
              </div>

              {/* 2. OVERLAYER: Rejected Draft Paper (Clipped with polygon) */}
              <div
                className="cv-sheet-paper absolute inset-0 w-full h-full bg-[#FAF9F5] text-[#334155] p-6 sm:p-10 md:p-12 flex flex-col justify-between font-sans select-text pointer-events-none"
                style={{
                  clipPath:
                    sliderPosition <= 0
                      ? "polygon(0 0, 0 0, 0 100%, 0 100%)"
                      : `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                  WebkitClipPath:
                    sliderPosition <= 0
                      ? "polygon(0 0, 0 0, 0 100%, 0 100%)"
                      : `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                  opacity: sliderPosition <= 0 ? 0 : 1,
                  visibility: sliderPosition <= 0 ? "hidden" : "visible",
                  transition: isDragging ? "none" : "opacity 0.15s ease",
                }}
              >
                {/* Top Rejection Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-red-200">
                  <span className="cv-red-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold">
                    <AlertTriangle size={13} className="text-red-600" />
                    <span>34% ATS MATCH · HIGH REJECTION RISK</span>
                  </span>
                  <span className="cv-red-text text-[10px] font-mono font-bold">
                    FLAGGED BY APPLICANT TRACKERS
                  </span>
                </div>

                {/* Draft CV Body */}
                <div className="space-y-4 text-[12px] sm:text-[13px] leading-relaxed">
                  {/* Draft Header */}
                  <div className="text-center pb-2 border-b border-red-300">
                    <h3 className="cv-heading cv-strike text-2xl font-bold tracking-tight">
                      Alex Developer
                    </h3>
                    <p className="cv-muted text-[11px] mt-1">
                      Alex&apos;s Resume | Email: alex@gmail.com | Phone: 555-0192 | Portfolio: (in progress)
                    </p>
                  </div>

                  {/* Draft Objective */}
                  <div>
                    <div className="font-bold text-[11px] uppercase tracking-wider cv-red-text pb-0.5 mb-1.5 flex items-center justify-between">
                      <span className="cv-red-text">CAREER OBJECTIVE</span>
                      <span className="text-[10px] font-normal px-1.5 py-0.5 rounded cv-red-badge">
                        ❌ Obsolete format (waste of resume space)
                      </span>
                    </div>
                    <p className="cv-strike text-[11.5px]">
                      Hardworking software engineer looking for an opportunity to learn new technologies and help the company grow while gaining experience.
                    </p>
                  </div>

                  {/* Draft Experience */}
                  <div>
                    <div className="font-bold text-[11px] uppercase tracking-wider cv-red-text pb-0.5 mb-2 flex items-center justify-between">
                      <span className="cv-red-text">EXPERIENCE</span>
                      <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        ⚠️ 0 quantifiable business metrics
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between font-medium text-[12px] text-neutral-800">
                          <span className="cv-subheading">Developer at TechScale Systems</span>
                          <span className="cv-muted">2024 — Present</span>
                        </div>
                        <div className="text-[10.5px] cv-muted italic mb-1">
                          Backend stuff
                        </div>
                        <ul className="list-disc ml-5 space-y-1 text-[11.5px]">
                          <li className="cv-strike">
                            Worked on backend stuff using Node.js and Redis to make the API faster for users.
                          </li>
                          <li className="cv-strike">
                            Helped team fix bugs in authentication and database queries when needed.
                          </li>
                          <li className="cv-strike">
                            Responsible for writing unit tests and deploying code to AWS servers.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Draft Skills */}
                  <div>
                    <div className="font-bold text-[11px] uppercase tracking-wider cv-red-text pb-0.5 mb-1 flex items-center justify-between">
                      <span className="cv-red-text">SKILLS</span>
                      <span className="text-[10px] font-normal px-1.5 py-0.5 rounded cv-red-badge">
                        ⚠️ Low keyword density (fails parser filter)
                      </span>
                    </div>
                    <p className="cv-strike text-[11px]">
                      Node.js, React, CSS, Git, whatever tools the team is using
                    </p>
                  </div>
                </div>

                {/* Draft Telemetry Footer */}
                <div className="pt-2.5 border-t border-red-200 flex items-center justify-between text-[11px] text-red-700">
                  <span className="font-semibold">
                    Rejected by Greenhouse &amp; Lever ATS Parsers
                  </span>
                  <span className="font-mono font-bold">
                    Match Score: 34% (Failed)
                  </span>
                </div>
              </div>

              {/* 3. Slider Divider & Drag Handle */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.8)] z-30 pointer-events-none"
                style={{
                  left: `${sliderPosition}%`,
                  opacity: sliderPosition <= 0 ? 0.4 : sliderPosition >= 100 ? 0.4 : 1,
                }}
              >
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-blue-600 shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex items-center justify-center text-blue-600 pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-transform"
                  style={{
                    left: sliderPosition <= 4 ? "0px" : sliderPosition >= 96 ? "-40px" : "-20px",
                  }}
                  title="Drag horizontally to compare"
                >
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
