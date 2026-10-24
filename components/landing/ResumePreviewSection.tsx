"use client";

import React, { useRef, useState, useEffect } from "react";
import { Cpu, FileCheck } from "lucide-react";

export function ResumePreviewSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resumeScale, setResumeScale] = useState(0.72);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        // 794px is base A4 width. Scale smoothly to fit column while maintaining exact 794x1123 A4 ratio
        const s = Math.min(0.85, Math.max(0.36, (w - 16) / 794));
        setResumeScale(s);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <section
      id="preview-resume"
      className="scroll-mt-24 bg-[#F5F5F3] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#f2efe9] py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-[#27272a] transition-colors duration-300"
    >
      {/* Scoped CSS to enforce high-contrast readable text in both themes */}
      <style>{`
        #preview-resume .lead-text {
          color: #334155 !important;
        }
        #preview-resume .feature-subtext {
          color: #475569 !important;
        }
        .dark #preview-resume .lead-text {
          color: rgba(242, 239, 233, 0.75) !important;
        }
        .dark #preview-resume .feature-subtext {
          color: rgba(242, 239, 233, 0.65) !important;
        }
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
          {/* Left: Rendered Single-Page Resume of Alex Developer with authentic A4 proportions */}
          <div className="lg:col-span-7 flex justify-center items-center">
            <div ref={containerRef} className="w-full flex justify-center items-center overflow-hidden py-2">
              <div
                className="resume-preview-wrapper relative rounded-lg overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-[#E5E5E5] dark:border-[#27272a] transition-all duration-300"
                style={{
                  width: `${Math.round(794 * resumeScale)}px`,
                  height: `${Math.round(1123 * resumeScale)}px`,
                }}
              >
                <div
                  className="resume-preview-sheet resume-paper bg-white select-text text-left"
                  style={{
                    width: "794px",
                    height: "1123px",
                    transform: `scale(${resumeScale})`,
                    transformOrigin: "top left",
                    padding: "36px 42px",
                    boxSizing: "border-box",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    fontFamily: "'Times New Roman', Georgia, serif",
                  }}
                >
                  {/* Header */}
                  <div style={{ textAlign: "center", marginBottom: "14px" }}>
                    <h2
                      id="alex-developer-heading"
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        margin: "0 0 4px 0",
                        color: "#0f172a",
                        fontFamily: "'Times New Roman', Georgia, serif",
                        letterSpacing: "1px",
                      }}
                    >
                      ALEX DEVELOPER
                    </h2>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#475569",
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                        fontFamily: "'Times New Roman', Georgia, serif",
                      }}
                    >
                      <span>Jalandhar, Punjab, India (Open to Remote)</span>
                      <span>•</span>
                      <span>alex.developer@email.com</span>
                      <span>•</span>
                      <span>+91 98765 43210</span>
                      <span>•</span>
                      <span className="resume-link" style={{ color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}>
                        github.com/alex-dev
                      </span>
                      <span>•</span>
                      <span className="resume-link" style={{ color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}>
                        linkedin.com/in/alex-developer
                      </span>
                    </div>
                  </div>

                  {/* Technical Summary */}
                  <div style={{ marginBottom: "10px" }}>
                    <div
                      style={{
                        fontSize: "11.5px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderTop: "1.5px solid #0f172a",
                        paddingTop: "4px",
                        marginBottom: "6px",
                        color: "#0f172a",
                        fontFamily: "'Times New Roman', Georgia, serif",
                      }}
                    >
                      TECHNICAL SUMMARY
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "#334155",
                        fontSize: "10.5px",
                        lineHeight: "1.45",
                        fontFamily: "'Times New Roman', Georgia, serif",
                        textAlign: "justify",
                      }}
                    >
                      Full-stack software engineer with deep fundamentals in distributed backend architectures, TypeScript systems, and cloud-native infrastructure. Proven track record transforming GitHub commits and system events into production-grade, highly measurable business solutions.
                    </p>
                  </div>

                  {/* Technical Skills */}
                  <div style={{ marginBottom: "10px" }}>
                    <div
                      style={{
                        fontSize: "11.5px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderTop: "1.5px solid #0f172a",
                        paddingTop: "4px",
                        marginBottom: "6px",
                        color: "#0f172a",
                        fontFamily: "'Times New Roman', Georgia, serif",
                      }}
                    >
                      TECHNICAL SKILLS
                    </div>
                    <div
                      style={{
                        margin: 0,
                        color: "#334155",
                        fontSize: "10.5px",
                        lineHeight: "1.45",
                        fontFamily: "'Times New Roman', Georgia, serif",
                      }}
                    >
                      <div style={{ margin: "2px 0" }}>
                        <strong>Languages:</strong> TypeScript, JavaScript, Python, Go, SQL
                      </div>
                      <div style={{ margin: "2px 0" }}>
                        <strong>Frameworks:</strong> Next.js, React, Node.js, Express, Flask, Tailwind CSS
                      </div>
                      <div style={{ margin: "2px 0" }}>
                        <strong>Tools &amp; Platforms:</strong> AWS, Docker, Redis, PostgreSQL, Prisma, Git, GitHub Actions, Linux
                      </div>
                    </div>
                  </div>

                  {/* Professional Experience */}
                  <div style={{ marginBottom: "10px" }}>
                    <div
                      style={{
                        fontSize: "11.5px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderTop: "1.5px solid #0f172a",
                        paddingTop: "4px",
                        marginBottom: "6px",
                        color: "#0f172a",
                        fontFamily: "'Times New Roman', Georgia, serif",
                      }}
                    >
                      PROFESSIONAL EXPERIENCE
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          color: "#0f172a",
                          fontSize: "11.5px",
                          marginBottom: "2px",
                          fontFamily: "'Times New Roman', Georgia, serif",
                        }}
                      >
                        <span>Senior Full-Stack Engineer — TechScale Systems</span>
                        <span>2024 — Present</span>
                      </div>
                      <div style={{ fontSize: "10.5px", color: "#475569", fontStyle: "italic", marginBottom: "3px" }}>
                        Distributed Platform Team (Remote)
                      </div>
                      <ul
                        style={{
                          margin: "0 0 0 14px",
                          padding: 0,
                          listStyleType: "disc",
                          color: "#334155",
                          fontSize: "10.5px",
                          lineHeight: "1.4",
                          fontFamily: "'Times New Roman', Georgia, serif",
                        }}
                      >
                        <li style={{ marginBottom: "2px" }}>
                          Architected high-throughput ingestion pipeline handling 12,000+ commit events daily, achieving 99.9% uptime.
                        </li>
                        <li style={{ marginBottom: "2px" }}>
                          Engineered Redis caching layer with optimistic cache warming, cutting database read latency by 42%.
                        </li>
                        <li style={{ marginBottom: "2px" }}>
                          Implemented Next.js 15 App Router server actions for instant UI updates, lowering TTFB to 180ms.
                        </li>
                      </ul>
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          color: "#0f172a",
                          fontSize: "11.5px",
                          marginBottom: "2px",
                          fontFamily: "'Times New Roman', Georgia, serif",
                        }}
                      >
                        <span>Software Engineering Intern — CloudPulse Labs</span>
                        <span>2023 — 2024</span>
                      </div>
                      <div style={{ fontSize: "10.5px", color: "#475569", fontStyle: "italic", marginBottom: "3px" }}>
                        Core Infrastructure
                      </div>
                      <ul
                        style={{
                          margin: "0 0 0 14px",
                          padding: 0,
                          listStyleType: "disc",
                          color: "#334155",
                          fontSize: "10.5px",
                          lineHeight: "1.4",
                          fontFamily: "'Times New Roman', Georgia, serif",
                        }}
                      >
                        <li style={{ marginBottom: "2px" }}>
                          Designed and shipped 15+ reusable TypeScript components conforming to strict WCAG 2.1 AA accessibility standards.
                        </li>
                        <li style={{ marginBottom: "2px" }}>
                          Automated GitHub Actions CI/CD workflows, shortening deployment cycle times from 35m to 8m.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Technical Projects */}
                  <div style={{ marginBottom: "10px" }}>
                    <div
                      style={{
                        fontSize: "11.5px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderTop: "1.5px solid #0f172a",
                        paddingTop: "4px",
                        marginBottom: "6px",
                        color: "#0f172a",
                        fontFamily: "'Times New Roman', Georgia, serif",
                      }}
                    >
                      TECHNICAL PROJECTS
                    </div>

                    <div style={{ marginBottom: "6px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          color: "#0f172a",
                          fontSize: "11.5px",
                          marginBottom: "2px",
                          fontFamily: "'Times New Roman', Georgia, serif",
                        }}
                      >
                        <span>weather-app (github.com/alex-dev/weather-app)</span>
                        <span style={{ fontStyle: "italic", fontWeight: "normal", color: "#475569", fontSize: "10.5px" }}>
                          Next.js, TypeScript, Redis
                        </span>
                      </div>
                      <ul
                        style={{
                          margin: "0 0 0 14px",
                          padding: 0,
                          listStyleType: "disc",
                          color: "#334155",
                          fontSize: "10.5px",
                          lineHeight: "1.4",
                          fontFamily: "'Times New Roman', Georgia, serif",
                        }}
                      >
                        <li style={{ marginBottom: "2px" }}>
                          Integrated OpenWeather API with asynchronous Redis caching, serving 2,500 daily requests under 25ms.
                        </li>
                      </ul>
                    </div>

                    <div style={{ marginBottom: "6px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          color: "#0f172a",
                          fontSize: "11.5px",
                          marginBottom: "2px",
                          fontFamily: "'Times New Roman', Georgia, serif",
                        }}
                      >
                        <span>distributed-task-runner (github.com/alex-dev/d-runner)</span>
                        <span style={{ fontStyle: "italic", fontWeight: "normal", color: "#475569", fontSize: "10.5px" }}>
                          Go, Docker, gRPC
                        </span>
                      </div>
                      <ul
                        style={{
                          margin: "0 0 0 14px",
                          padding: 0,
                          listStyleType: "disc",
                          color: "#334155",
                          fontSize: "10.5px",
                          lineHeight: "1.4",
                          fontFamily: "'Times New Roman', Georgia, serif",
                        }}
                      >
                        <li style={{ marginBottom: "2px" }}>
                          Built worker queue with automatic retry policies and Prometheus metrics, orchestrating 50 concurrent jobs.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <div
                      style={{
                        fontSize: "11.5px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderTop: "1.5px solid #0f172a",
                        paddingTop: "4px",
                        marginBottom: "4px",
                        color: "#0f172a",
                        fontFamily: "'Times New Roman', Georgia, serif",
                      }}
                    >
                      EDUCATION
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        color: "#0f172a",
                        fontSize: "11px",
                        fontFamily: "'Times New Roman', Georgia, serif",
                      }}
                    >
                      <span>B.Tech in Computer Science &amp; Engineering</span>
                      <span>Graduated 2024</span>
                    </div>
                    <div style={{ fontSize: "10.5px", color: "#475569", fontStyle: "italic", fontFamily: "'Times New Roman', Georgia, serif" }}>
                      National Institute of Technology · CGPA: 8.9 / 10.0
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Micro-Features with High Contrast */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-[#0099ff] mb-3">
                INTERACTIVE OUTPUT
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold sm:font-bold tracking-tight text-[#171717] dark:text-[#f2efe9] leading-[1.08] mb-5">
                Recruiter-Ready.<br />
                ATS-Optimized.
              </h2>
              <p className="lead-text text-base sm:text-lg text-slate-800 dark:text-neutral-200 leading-relaxed font-normal">
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
                <p className="feature-subtext text-sm text-slate-700 dark:text-neutral-300 leading-relaxed">
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
                <p className="feature-subtext text-sm text-slate-700 dark:text-neutral-300 leading-relaxed">
                  Conforms strictly to single-page PDF structures, typography limits, and machine-readable content rules.
                </p>
              </div>
            </div>

            {/* Live ATS Scorecard Badge */}
            <div className="rounded-xl border border-[#E5E5E5] dark:border-[#27272a] bg-white dark:bg-[#141417] p-5 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-2xl transition-colors duration-300">
              <div>
                <div className="text-xs text-slate-600 dark:text-neutral-400 font-medium">ATS Compliance Score</div>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">98% Match Rate</div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-neutral-400">
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
