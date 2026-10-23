"use client";

import React from "react";
import Link from "next/link";
import { GitBranch, Check, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import RotatingText from "@/components/ui/RotatingText";

export function Hero({ hasSession = false }: { hasSession?: boolean }) {
  return (
    <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Main Hero Card Container - matches localhost:3000 FairweatherHero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-[28px] border border-neutral-800/80 bg-[#0d0e12] overflow-hidden shadow-2xl"
      >
        {/* Top Sky Artwork Panel */}
        <div className="relative h-[340px] sm:h-[400px] w-full overflow-visible bg-[#1a365d]">
          <img
            src="/images/fairweather_sky.jpg"
            alt="Pixel-art sky landscape"
            className="w-full h-full object-cover object-[center_30%] block pixelated"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/60 pointer-events-none" />

          {/* Floating Product Preview Window rising out of the sky */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[94%] max-w-[840px] bg-[#121318]/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] z-10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700">
            {/* Window Header */}
            <div className="px-4 py-3 bg-[#181920]/90 border-b border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs font-bold text-emerald-400 tracking-wider">
                  3 REPOS SYNCED · ATS READY
                </span>
              </div>
              <div className="font-mono text-[10px] text-neutral-400 font-medium">
                DEV PREVIEW
              </div>
            </div>

            {/* Window Body: Authentic Developer GitHub to Resume Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 p-4 sm:p-5 gap-3 sm:gap-4 bg-[#0e0f14]/90 text-left">
              {/* Left Panel: GitHub Repository Analysis */}
              <div className="bg-[#14151c] border border-neutral-800/70 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="text-neutral-300">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    <span className="font-semibold text-xs sm:text-sm text-neutral-100 font-mono">weather-app</span>
                    <span className="text-[10px] text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded font-mono">public</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded font-mono">
                    <GitBranch size={11} className="text-neutral-400" />
                    <span>main</span>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">a3f2c1e</span>
                    <span className="text-neutral-300 truncate">feat: add real-time weather api integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">c9a1b3d</span>
                    <span className="text-neutral-300 truncate">perf: cache layer with Redis & async workers</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Next.js 15", "TypeScript", "Prisma", "Redis"].map((chip) => (
                    <span
                      key={chip}
                      className="text-[10px] font-mono font-medium bg-neutral-800/90 text-neutral-300 border border-neutral-700/60 px-2 py-0.5 rounded-md"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Panel: Recruiter-Ready Resume Output */}
              <div className="bg-[#14151c] border border-neutral-800/70 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-neutral-100">Alex Carter</div>
                    <div className="text-[11px] text-neutral-400">Software Engineer</div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                    <Check size={11} strokeWidth={3} />
                    <span>ATS 98%</span>
                  </div>
                </div>

                <div className="space-y-2 text-[11px] leading-relaxed text-neutral-300">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                    <p>
                      Architected an asynchronous <strong className="text-neutral-100 font-semibold">weather intelligence platform</strong> using Next.js and TypeScript, serving 12k+ daily requests with 99.9% uptime.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                    <p>
                      Engineered a <strong className="text-neutral-100 font-semibold">Redis caching layer</strong> for external API calls, cutting response latency by 42% and eliminating rate-limited errors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Hero Content: Editorial Resummit Content */}
        <div className="pt-28 sm:pt-32 pb-14 px-6 sm:px-12 text-center max-w-4xl mx-auto">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 px-3.5 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-neutral-300">GitHub-powered resume intelligence</span>
          </div>

          {/* Dynamic Headline with RotatingText */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            Your GitHub already proves <br className="hidden sm:inline" />
            your experience in{" "}
            <span className="inline-block mt-1 sm:mt-0">
              <RotatingText
                texts={[
                  "Full-Stack Systems",
                  "Cloud Infrastructure",
                  "Distributed Systems",
                  "High-Scale APIs",
                  "AI & Machine Learning",
                  "Modern Web Apps",
                ]}
                color="#ffffff"
                badgeBackground="#181920"
                badgeRadius={14}
                badgePaddingX={18}
                badgePaddingY={4}
                font={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem, 3.4vw, 2.5rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: "1.2",
                }}
              />
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Resummit analyzes repositories, commits, technologies, and project structures
            to generate clean, recruiter-ready resumes from the work you already built.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link
              href={hasSession ? "/dashboard" : "/login"}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-all hover:bg-neutral-200 shadow-md group"
            >
              <span>{hasSession ? "Go to Dashboard" : "Start for free"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              onClick={() => {
                const element = document.getElementById("interactive-resume");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/80 px-6 py-3 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              See how it works
            </button>
          </div>

          {/* Verified Resummit Specs Metrics Line */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-neutral-800/80 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">94%</div>
              <div className="text-xs text-neutral-400">Median ATS parse rate across tech recruiters</div>
            </div>
            <div className="space-y-1 border-t md:border-t-0 md:border-x border-neutral-800/80 pt-4 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">&lt;60s</div>
              <div className="text-xs text-neutral-400">Average generation time from public repos</div>
            </div>
            <div className="space-y-1 border-t md:border-t-0 border-neutral-800/80 pt-4 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">100%</div>
              <div className="text-xs text-neutral-400">Read-only GitHub access · Never writes to repos</div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-emerald-400" />
              Free to start · No credit card required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-emerald-400" />
              Read-only GitHub OAuth · Zero write permissions
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
