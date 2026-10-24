"use client";

import React from "react";
import { GitBranch, Check, Sparkles, Terminal } from "lucide-react";
import ArrowRevealButton from "@/components/ui/ArrowRevealButton";
import RotatingText from "@/components/ui/RotatingText";

interface FairweatherHeroProps {
  hasSession?: boolean;
  theme: "dark" | "light";
}

export default function FairweatherHero({ hasSession, theme }: FairweatherHeroProps) {
  const isDark = theme === "dark";

  return (
    <section className="fairweather-hero-section">
      <div className="container">
        {/* Main Hero Card Container */}
        <div className="fairweather-hero-card">
          {/* Top Sky Artwork Panel */}
          <div className="fairweather-sky-band">
            <img
              src="/images/fairweather_sky.jpg"
              alt="Dithered pixel-art sky"
              className="fairweather-sky-image"
            />
            <div className="fairweather-sky-overlay" />

            {/* Floating Product Preview Window rising out of the sky */}
            <div className="fairweather-floating-window">
              {/* Window Header */}
              <div className="fairweather-window-header">
                <div className="fairweather-window-dots">
                  <span className="window-dot red" />
                  <span className="window-dot yellow" />
                  <span className="window-dot green" />
                </div>
                <div className="fairweather-status-pill">
                  <span className="status-indicator-dot" />
                  <span className="status-indicator-text">3 REPOS SYNCED · ATS READY</span>
                </div>
                <div className="fairweather-window-actions">
                  <span className="window-mode-pill">DEV PREVIEW</span>
                </div>
              </div>

              {/* Window Body: Realistic Developer GitHub to Resume Preview */}
              <div className="fairweather-window-grid">
                {/* Left Panel: GitHub Repository Analysis */}
                <div className="fairweather-panel left-panel">
                  <div className="panel-header">
                    <div className="repo-badge">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                      <span className="repo-name">weather-app</span>
                      <span className="repo-tag">public</span>
                    </div>
                    <div className="branch-tag">
                      <GitBranch size={11} />
                      <span>main</span>
                    </div>
                  </div>

                  <div className="repo-commit-snippet">
                    <div className="commit-row">
                      <span className="commit-hash">a3f2c1e</span>
                      <span className="commit-title">feat: add real-time weather api integration</span>
                    </div>
                    <div className="commit-row">
                      <span className="commit-hash">c9a1b3d</span>
                      <span className="commit-title">perf: cache layer with Redis & async workers</span>
                    </div>
                  </div>

                  <div className="tech-chips">
                    <span className="chip">Next.js 15</span>
                    <span className="chip">TypeScript</span>
                    <span className="chip">Prisma</span>
                    <span className="chip">Redis</span>
                  </div>
                </div>

                {/* Right Panel: Recruiter-Ready Resume Output */}
                <div className="fairweather-panel right-panel">
                  <div className="panel-header">
                    <div>
                      <div className="candidate-name">Alex Developer</div>
                      <div className="candidate-role">Software Engineer · Sample (fictional)</div>
                    </div>
                    <div className="ats-grade-chip">
                      <Check size={11} strokeWidth={3} />
                      <span>ATS-Friendly</span>
                    </div>
                  </div>

                  <div className="resume-bullet-preview">
                    <div className="bullet-item">
                      <span className="bullet-dot" />
                      <p>
                        Architected an asynchronous <strong>weather intelligence platform</strong> using Next.js and TypeScript, serving 12k+ daily requests with 99.9% uptime.
                      </p>
                    </div>
                    <div className="bullet-item">
                      <span className="bullet-dot" />
                      <p>
                        Engineered a <strong>Redis caching layer</strong> for external API calls, cutting response latency by 42% and eliminating rate-limited errors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lower White Card Area: Editorial Resummit Content */}
          <div className="fairweather-hero-content">
            <div className="fairweather-badge">
              <span className="fairweather-badge-dot" />
              <span>GitHub-powered resume intelligence</span>
            </div>

            <h1 className="fairweather-hero-headline">
              Your GitHub already proves <br />
              your experience in{" "}
              <span className="fairweather-rotating-slot">
                <RotatingText
                  texts={[
                    "Full-Stack Systems",
                    "Cloud Infrastructure",
                    "Distributed Systems",
                    "High-Scale APIs",
                    "AI & Machine Learning",
                    "Modern Web Apps",
                  ]}
                  color="#171717"
                  badgeBackground="#EEEEEC"
                  badgeRadius={12}
                  badgePaddingX={18}
                  badgePaddingY={4}
                  font={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1.4rem, 3.2vw, 2.4rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: "1.15",
                  }}
                />
              </span>
            </h1>

            <p className="fairweather-hero-desc">
              Resummit analyzes repositories, commits, technologies, and project structures
              to generate clean, recruiter-ready resumes from the work you already built.
            </p>

            <div className="fairweather-hero-actions">
              <ArrowRevealButton
                label={hasSession ? "Go to Dashboard" : "Start for free"}
                link={hasSession ? "/dashboard" : "/login"}
                rounded={12}
                padding="12px 20px 12px 24px"
                gap={12}
                colors={{
                  fill: "#171717",
                  textColor: "#FFFFFF",
                  hoverFill: "#262626",
                  hoverTextColor: "#FFFFFF",
                }}
                border={{
                  borderColor: "#171717",
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
                icon={{
                  side: "right",
                  type: "arrow",
                  background: "#262626",
                  color: "#FFFFFF",
                  size: 13,
                  padding: 6,
                  direction: "right",
                  restAngle: 0,
                  hoverAngle: -45,
                }}
              />

              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById("preview-section");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="fairweather-secondary-btn"
              >
                See how it works
              </button>
            </div>

            {/* Compact Fairweather Metrics Line (Preserving Verified Resummit Specs) */}
            <div className="fairweather-hero-metrics">
              <div className="metric-item">
                <div className="metric-val">94%</div>
                <div className="metric-lbl">Median ATS parse rate across tech recruiters</div>
              </div>
              <div className="metric-sep" />
              <div className="metric-item">
                <div className="metric-val">&lt;60s</div>
                <div className="metric-lbl">Average generation time from public repos</div>
              </div>
              <div className="metric-sep" />
              <div className="metric-item">
                <div className="metric-val">100%</div>
                <div className="metric-lbl">Read-only GitHub access · Never writes to repos</div>
              </div>
            </div>

            {/* Subtle Trust Line */}
            <div className="fairweather-trust-row">
              <span className="trust-pill">
                <Check size={13} className="text-emerald-500" />
                Free to start · No credit card required
              </span>
              <span className="trust-pill">
                <Check size={13} className="text-emerald-500" />
                Read-only GitHub OAuth · Zero write permissions
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
