"use client";

import React from "react";
import { Cpu, FileCheck } from "lucide-react";

export function ResumePreviewSection() {
  return (
    <section
      id="preview-resume"
      className="scroll-mt-24 bg-[#F5F5F3] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#f2efe9] py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-[#27272a] transition-colors duration-300"
    >
      {/* Scoped CSS to enforce 100% dark, readable text on the resume paper */}
      <style>{`
        .resume-paper, .resume-paper * {
          color: #0f172a !important;
          -webkit-text-fill-color: #0f172a !important;
        }
        #alex-developer-heading {
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
        }
        .resume-paper .resume-muted, .resume-paper .resume-muted * {
          color: #475569 !important;
          -webkit-text-fill-color: #475569 !important;
        }
        .resume-paper .resume-link, .resume-paper .resume-link * {
          color: #1d4ed8 !important;
          -webkit-text-fill-color: #1d4ed8 !important;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Rendered Single-Page Resume of Alex Developer */}
          <div className="lg:col-span-7">
            <div
              className="resume-paper rounded-2xl border border-[#E5E5E5] dark:border-[#27272a] bg-[#ffffff] shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[rgba(255,255,255,0.07)_0px_0px_0px_1px,rgba(0,0,0,0.7)_0px_12px_32px_-12px] p-6 sm:p-9 font-serif text-[11px] leading-relaxed select-text"
            >
              {/* Header */}
              <div className="text-center pb-3 border-b-[1.5px] border-[#0f172a]">
                <div
                  id="alex-developer-heading"
                  style={{
                    fontSize: "22px",
                    fontWeight: "900",
                    margin: "0 0 4px 0",
                    color: "#000000",
                    fontFamily: "'Times New Roman', Georgia, serif",
                    letterSpacing: "1px",
                    lineHeight: "1.2"
                  }}
                >
                  ALEX DEVELOPER
                </div>
                <p className="mt-1 text-[10.5px] resume-muted" style={{ color: "#475569" }}>
                  Jalandhar, Punjab, India (Open to Remote) · alex.developer@email.com · +91 98765 43210 ·{" "}
                  <span className="resume-link underline font-medium cursor-pointer">github.com/alex-dev</span> ·{" "}
                  <span className="resume-link underline font-medium cursor-pointer">linkedin.com/in/alex-developer</span>
                </p>
              </div>

              {/* Technical Summary */}
              <div className="mt-3.5">
                <div className="font-bold text-[11px] uppercase tracking-wider border-b border-[#0f172a] pb-0.5 mb-1.5 text-[#000000]">
                  TECHNICAL SUMMARY
                </div>
                <p className="text-[10px] leading-relaxed">
                  Full-stack software engineer with strong fundamentals in distributed backend systems, TypeScript architectures, and cloud-native infrastructure. Proven track record transforming production commits into measurable business outcomes.
                </p>
              </div>

              {/* Experience Section */}
              <div className="mt-3.5">
                <div className="font-bold text-[11px] uppercase tracking-wider border-b border-[#0f172a] pb-0.5 mb-2 text-[#000000]">
                  EXPERIENCE
                </div>

                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between font-bold text-[10.5px] text-[#000000]">
                      <span>Senior Full-Stack Engineer — TechScale Systems</span>
                      <span>2024 – Present</span>
                    </div>
                    <ul className="list-disc ml-4 space-y-1 mt-1 text-[10px] leading-snug">
                      <li>Architected high-throughput ingestion pipeline handling 12,000+ commit events daily, achieving 99.9% uptime.</li>
                      <li>Engineered Redis caching layer with optimistic cache warming, cutting database read latency by 42%.</li>
                      <li>Implemented Next.js 15 App Router server actions for instant UI updates, lowering TTFB to 180ms.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[10.5px] text-[#000000]">
                      <span>Software Engineering Intern — CloudPulse Labs</span>
                      <span>2023 – 2024</span>
                    </div>
                    <ul className="list-disc ml-4 space-y-1 mt-1 text-[10px] leading-snug">
                      <li>Designed and shipped 15+ reusable TypeScript components conforming to strict WCAG 2.1 AA standards.</li>
                      <li>Automated GitHub Actions CI/CD workflows, shortening deployment cycle times from 35m to 8m.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Projects Section */}
              <div className="mt-3.5">
                <div className="font-bold text-[11px] uppercase tracking-wider border-b border-[#0f172a] pb-0.5 mb-2 text-[#000000]">
                  PROJECTS
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between font-bold text-[10.5px] text-[#000000]">
                      <span>weather-app (github.com/alex-dev/weather-app)</span>
                      <span>Next.js, TypeScript, Redis</span>
                    </div>
                    <p className="text-[10px] leading-snug mt-0.5">
                      • Integrated OpenWeather API with asynchronous Redis caching, serving 2,500 daily requests under 25ms.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[10.5px] text-[#000000]">
                      <span>distributed-task-runner (github.com/alex-dev/d-runner)</span>
                      <span>Go, Docker, gRPC</span>
                    </div>
                    <p className="text-[10px] leading-snug mt-0.5">
                      • Built worker queue with automatic retry policies and Prometheus metrics, orchestrating 50 concurrent jobs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-3.5 pt-2 border-t border-[#0f172a]">
                <div className="font-bold text-[10.5px] text-[#000000]">
                  LANGUAGES &amp; TOOLS:{" "}
                  <span className="font-normal text-[10px]">
                    TypeScript, JavaScript, Go, Python, Next.js, React, Node.js, PostgreSQL, Redis, Docker, Git, AWS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Micro-Features */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-[#0099ff] mb-3">
                INTERACTIVE OUTPUT
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold sm:font-bold tracking-tight text-[#171717] dark:text-[#f2efe9] leading-[1.08] mb-5">
                Recruiter-Ready.<br />
                ATS-Optimized.
              </h2>
              <p className="text-base sm:text-lg text-[#707070] dark:text-[#f2efe9]/70 leading-relaxed font-normal">
                Here is a real resume generated from developer commits. It uses professional formatting, clean sections, and is fully calibrated for Applicant Tracking Systems (ATS).
              </p>
            </div>

            {/* Feature Item 1 */}
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-[#0099ff] border border-blue-500/20 shrink-0">
                <Cpu size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#171717] dark:text-[#f2efe9] mb-1">AI Bullets Generation</h4>
                <p className="text-sm text-[#707070] dark:text-[#f2efe9]/60 leading-relaxed">
                  Parses your GitHub commits to write structured, accomplishment-focused resume points automatically.
                </p>
              </div>
            </div>

            {/* Feature Item 2 */}
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-[#0099ff] border border-blue-500/20 shrink-0">
                <FileCheck size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#171717] dark:text-[#f2efe9] mb-1">ATS Parser Certified</h4>
                <p className="text-sm text-[#707070] dark:text-[#f2efe9]/60 leading-relaxed">
                  Conforms strictly to single-page PDF structures, typography limits, and machine-readable content rules.
                </p>
              </div>
            </div>

            {/* Live ATS Scorecard Badge */}
            <div className="rounded-xl border border-[#E5E5E5] dark:border-[#27272a] bg-white dark:bg-[#141417] p-5 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-2xl transition-colors duration-300">
              <div>
                <div className="text-xs text-[#707070] dark:text-[#f2efe9]/50 font-medium">ATS Compliance Score</div>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">98% Match Rate</div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#707070] dark:text-[#f2efe9]/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Greenhouse · Lever · Workday
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
