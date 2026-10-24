"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { GitBranch, Check } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import RotatingText from "@/components/ui/RotatingText";
import ArrowRevealButton from "@/components/ui/ArrowRevealButton";
import { DitherCanvas } from "@/components/ui/DitherCanvas";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function Hero({ hasSession = false }: { hasSession?: boolean }) {
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroContainerRef,
    offset: ["start start", "end start"],
  });

  // Onscroll 3D perspective tilt and scale matching reference site
  const rotateX = useTransform(scrollYProgress, [0, 0.75], [0, 14]);
  const scale = useTransform(scrollYProgress, [0, 0.75], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.85]);

  return (
    <section
      ref={heroContainerRef}
      className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden border-b border-[#E5E5E5] dark:border-[#27272a]/60 bg-[#F5F5F3] dark:bg-[#0a0a0a] transition-colors duration-300"
    >
      {/* 1. Full-bleed Mountain Dither Background matching Aceternity */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <DitherCanvas
          imageSrc="/images/hero_mountain_bg.jpg"
          theme={theme}
          pixelSize={3}
          className="opacity-100 dark:opacity-80 transition-opacity duration-700"
        />

        {/* Ambient atmospheric color glow in light mode across BOTH left and right sides so left side matches right side richness */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-blue-500/15 to-blue-600/20 dark:hidden pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/15 via-transparent to-[#F5F5F3] dark:from-[#0a0a0a]/75 dark:via-[#0a0a0a]/30 dark:to-[#0a0a0a] pointer-events-none transition-colors duration-300" />

        {/* In dark mode, soft horizontal gradient on the left; in light mode, left side preserves the same natural mountain and sky colors as the right side */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-r dark:from-[#0a0a0a]/80 dark:via-[#0a0a0a]/25 dark:to-transparent pointer-events-none" />
      </div>

      {/* 2. Main Container with Left-Aligned Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-36 sm:pt-40 pb-16">
        {/* Editorial Left-Aligned Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-left"
        >
          {/* Huge Left-Aligned Headline */}
          <h1
            aria-label="Your GitHub already proves your experience. Tailor your CV to every job you apply to."
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold sm:font-bold tracking-tight text-[#171717] dark:text-[#f2efe9] leading-[1.08] mb-6"
          >
            Your GitHub already proves <br />
            your experience for <br />
            <span className="inline-block mt-2">
              <RotatingText
                texts={[
                  "every job you apply to",
                  "your next role",
                  "engineering teams",
                  "your next job application",
                  "top tech recruiters",
                ]}
                color="#FFFFFF"
                badgeBackground="#0077ff"
                badgeRadius={14}
                badgePaddingX={20}
                badgePaddingY={6}
                font={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(1.5rem, 3.2vw, 2.6rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: "1.2",
                }}
              />
            </span>
          </h1>

          {/* Left-Aligned Subtitle with Aceternity EncryptedText - crisp white matching reference */}
          <p className="hero-subtitle text-base sm:text-lg max-w-2xl mb-8 leading-relaxed font-mono">
            <EncryptedText
              text="Resummit analyzes your public repositories and commits to build a clean, ATS-friendly resume. Paste a job description to tailor your CV in seconds."
              encryptedClassName="text-white/45 dark:text-white/40 font-mono"
              revealedClassName="text-white font-medium font-sans drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]"
              revealDelayMs={25}
            />
          </p>

          {/* Left-Aligned Action Buttons with ArrowRevealButton */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <ArrowRevealButton
              label={hasSession ? "Go to Dashboard" : "Build my CV free"}
              link={hasSession ? "/dashboard" : "/login"}
              rounded={100}
              padding="10px 18px 10px 24px"
              gap={12}
              colors={{
                fill: theme === "light" ? "#171717" : "#ffffff",
                textColor: theme === "light" ? "#ffffff" : "#09090b",
                hoverFill: theme === "light" ? "#262626" : "#f4f4f5",
                hoverTextColor: theme === "light" ? "#ffffff" : "#09090b",
              }}
              icon={{
                side: "right",
                type: "arrow",
                background: "#0099ff",
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
                const element = document.getElementById("interactive-resume") || document.getElementById("preview-resume");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center rounded-full border border-[#E5E5E5] dark:border-white/15 bg-white/90 dark:bg-white/5 backdrop-blur-md px-6 py-3 text-sm font-medium text-[#171717] dark:text-[#f2efe9] hover:bg-white dark:hover:bg-white/10 hover:border-neutral-400 dark:hover:border-white/30 transition-all shadow-sm"
            >
              See sample resume →
            </button>

            <div className="inline-flex items-center gap-2 text-xs text-neutral-700 dark:text-[#f2efe9]/80 font-normal ml-2">
              <span className="text-amber-500 dark:text-amber-400 text-sm">★</span>
              <span className="font-bold text-neutral-900 dark:text-[#f2efe9]">{LANDING_CONFIG.realStats.userCountText}</span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-900 dark:text-[#f2efe9]/85 font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)] dark:drop-shadow-none mb-14">
            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-emerald-700 dark:text-emerald-400 stroke-[2.5]" />
              Free developer preview · No credit card required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-emerald-700 dark:text-emerald-400 stroke-[2.5]" />
              Read-only access to your public repos
            </span>
          </div>
        </motion.div>

        {/* 3. Product Showcase Window with 3D Onscroll Perspective Tilt */}
        <div style={{ perspective: "1200px" }}>
          <motion.div
            style={{
              rotateX,
              scale,
              opacity,
              transformStyle: "preserve-3d",
            }}
            className="rounded-2xl border border-[#E5E5E5] dark:border-[#27272a] bg-white dark:bg-[#121217]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 hover:border-neutral-400 dark:hover:border-neutral-700"
          >
            {/* Window Header */}
            <div className="px-5 py-3.5 bg-[#F7F7F6] dark:bg-[#18181b]/95 border-b border-[#E5E5E5] dark:border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                  PUBLIC REPOS · ATS-FRIENDLY FORMAT
                </span>
              </div>
              <div className="font-mono text-[10px] text-[#707070] dark:text-[#f2efe9]/50 font-medium">
                SAMPLE
              </div>
            </div>

            {/* Window Body: Authentic Developer GitHub to Resume Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 p-5 sm:p-6 gap-4 bg-[#F5F5F3] dark:bg-[#141417] text-left">
              {/* Left Panel: GitHub Repository Analysis */}
              <div className="bg-white dark:bg-[#18181b] border border-[#E5E5E5] dark:border-[#27272a] rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" className="text-[#171717] dark:text-[#f2efe9]/80">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    <span className="font-semibold text-sm text-[#171717] dark:text-[#f2efe9] font-mono">weather-app</span>
                    <span className="text-[10px] text-[#707070] dark:text-[#f2efe9]/60 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono">public</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#707070] dark:text-[#f2efe9]/60 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded font-mono">
                    <GitBranch size={11} className="text-[#707070] dark:text-[#f2efe9]/60" />
                    <span>main</span>
                  </div>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-[#0099ff] font-bold">a3f2c1e</span>
                    <span className="text-[#52525b] dark:text-[#f2efe9]/80 truncate">feat: add real-time weather api integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-[#0099ff] font-bold">c9a1b3d</span>
                    <span className="text-[#52525b] dark:text-[#f2efe9]/80 truncate">perf: cache layer with Redis & async workers</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Next.js 15", "TypeScript", "Prisma", "Redis"].map((chip) => (
                    <span
                      key={chip}
                      className="text-[10px] font-mono font-medium bg-[#F7F7F6] dark:bg-[#121217] text-[#171717] dark:text-[#f2efe9]/80 border border-[#E5E5E5] dark:border-[#27272a] px-2.5 py-0.5 rounded-md"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Panel: Recruiter-Ready Resume Output */}
              <div className="bg-white dark:bg-[#18181b] border border-[#E5E5E5] dark:border-[#27272a] rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#171717] dark:text-[#f2efe9]">Alex Carter</div>
                    <div className="text-[11px] text-[#707070] dark:text-[#f2efe9]/60">Full-Stack Engineer · Sample</div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
                    <Check size={11} strokeWidth={3} />
                    <span>ATS score: sample</span>
                  </div>
                </div>

                <div className="space-y-2 text-[11px] leading-relaxed text-[#52525b] dark:text-[#f2efe9]/85">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-[#0099ff] mt-1 shrink-0" />
                    <p>
                      Architected an asynchronous <strong className="text-[#171717] dark:text-[#f2efe9] font-medium">weather intelligence platform</strong> using Next.js and TypeScript, serving 12k+ daily requests with 99.9% uptime.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-[#0099ff] mt-1 shrink-0" />
                    <p>
                      Engineered a <strong className="text-[#171717] dark:text-[#f2efe9] font-medium">Redis caching layer</strong> for external API calls, cutting response latency by 42% and eliminating rate-limited errors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Resummit Specs Metrics Line */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5 px-6 sm:px-10 border-t border-[#E5E5E5] dark:border-[#27272a] bg-[#F7F7F6] dark:bg-[#101014] text-center">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold sm:font-medium text-[#171717] dark:text-[#f2efe9] tracking-tight">Free</div>
                <div className="text-xs text-[#707070] dark:text-[#f2efe9]/50">During public beta</div>
              </div>
              <div className="space-y-1 border-t md:border-t-0 md:border-x border-[#E5E5E5] dark:border-[#27272a] pt-3 md:pt-0">
                <div className="text-2xl sm:text-3xl font-bold sm:font-medium text-[#171717] dark:text-[#f2efe9] tracking-tight">Tailored</div>
                <div className="text-xs text-[#707070] dark:text-[#f2efe9]/50">To any job description</div>
              </div>
              <div className="space-y-1 border-t md:border-t-0 border-[#E5E5E5] dark:border-[#27272a] pt-3 md:pt-0">
                <div className="text-2xl sm:text-3xl font-bold sm:font-medium text-[#171717] dark:text-[#f2efe9] tracking-tight">Read-only</div>
                <div className="text-xs text-[#707070] dark:text-[#f2efe9]/50">GitHub access · Never changes your repos</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
