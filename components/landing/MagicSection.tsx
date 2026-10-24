"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { GitBranch, Sparkles, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ArrowRevealButton from "@/components/ui/ArrowRevealButton";

const leftItemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: delay * 0.3, duration: 0.25 }
  }),
  dimmed: {
    opacity: 0.45,
    x: 0,
    transition: { duration: 0.2 }
  }
};

const rightItemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: delay * 0.3, duration: 0.25 }
  }),
  hiddenInstant: {
    opacity: 0.1,
    y: 6,
    transition: { duration: 0.2 }
  }
};

export function MagicSection({ hasSession = false }: { hasSession?: boolean }) {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true);
      }
    }, { threshold: 0.15 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setStep((s) => (s >= 3 ? 0 : s + 1));
    }, 2400);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <section
      ref={ref}
      className="py-24 sm:py-32 bg-[#F5F5F3] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#f2efe9] relative overflow-hidden border-t border-[#E5E5E5] dark:border-[#27272a] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-[#0099ff] mb-3">
            THE MAGIC
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold sm:font-bold tracking-tight text-[#171717] dark:text-[#f2efe9] leading-[1.12] mb-4">
            From raw commit<br />
            to recruiter-ready bullet
          </h2>
          <p className="text-base sm:text-lg text-[#707070] dark:text-[#f2efe9]/70 leading-relaxed font-normal">
            Resummit reads what you actually built — and translates it into the professional language recruiters expect.
          </p>
        </div>

        {/* 3-Column Magic Transformation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
          {/* Left: GitHub Commits Widget */}
          <motion.div
            animate={{
              borderColor: step === 0 || step === 3 ? "rgba(0, 153, 255, 0.45)" : undefined,
              opacity: step === 2 ? 0.7 : 1,
            }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 rounded-2xl border border-[#E5E5E5] dark:border-[#27272a] bg-white dark:bg-[#141417] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-2xl transition-colors duration-300"
          >
            {/* Repo Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#E5E5E5] dark:border-[#27272a]">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" className="text-[#171717] dark:text-[#f2efe9]/60">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1.5 1.5 0 0 1 1.5-1.5h7.5z" />
                </svg>
                <span className="font-semibold text-[#171717] dark:text-[#f2efe9] text-sm font-mono">weather-app</span>
                <span className="text-[10px] text-[#707070] dark:text-[#f2efe9]/60 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded font-mono">Public</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#707070] dark:text-[#f2efe9]/60 font-mono bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded">
                <GitBranch size={12} />
                <span>main</span>
              </div>
            </div>

            {/* Commits List */}
            <div>
              <div className="text-xs font-mono text-[#707070] dark:text-[#f2efe9]/50 mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-[#0099ff]" />
                Commits on Jun 7, 2026
              </div>

              <div className="space-y-3">
                {/* Commit 1 */}
                <motion.div
                  variants={leftItemVariants}
                  custom={0.1}
                  animate={step === 0 || step === 3 ? "visible" : "dimmed"}
                  className="p-3 rounded-xl bg-[#F7F7F6] dark:bg-[#18181b] border border-[#E5E5E5] dark:border-[#27272a] flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm font-medium text-[#171717] dark:text-[#f2efe9]">
                      feat: add weather api integration
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#707070] dark:text-[#f2efe9]/50">
                      <span className="w-4 h-4 rounded-full bg-blue-600 dark:bg-[#0099ff] text-white font-bold flex items-center justify-center text-[9px]">
                        A
                      </span>
                      <span>alex-carter</span>
                      <span>Oct 14, 2025</span>
                      <span className="text-emerald-500 font-bold">✓</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-blue-600 dark:text-[#0099ff] bg-blue-500/10 px-2 py-1 rounded">
                    a3f2c1e
                  </span>
                </motion.div>

                {/* Commit 2 */}
                <motion.div
                  variants={leftItemVariants}
                  custom={0.3}
                  animate={step === 0 || step === 3 ? "visible" : "dimmed"}
                  className="p-3 rounded-xl bg-[#F7F7F6] dark:bg-[#18181b] border border-[#E5E5E5] dark:border-[#27272a] flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm font-medium text-[#171717] dark:text-[#f2efe9]">
                      perf: cache layer with Redis &amp; workers
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#707070] dark:text-[#f2efe9]/50">
                      <span className="w-4 h-4 rounded-full bg-blue-600 dark:bg-[#0099ff] text-white font-bold flex items-center justify-center text-[9px]">
                        A
                      </span>
                      <span>alex-carter</span>
                      <span>Oct 14, 2025</span>
                      <span className="text-emerald-500 font-bold">✓</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-blue-600 dark:text-[#0099ff] bg-blue-500/10 px-2 py-1 rounded">
                    c9a1b3d
                  </span>
                </motion.div>

                {/* Commit 3 */}
                <motion.div
                  variants={leftItemVariants}
                  custom={0.5}
                  animate={step === 0 || step === 3 ? "visible" : "dimmed"}
                  className="p-3 rounded-xl bg-[#F7F7F6] dark:bg-[#18181b] border border-[#E5E5E5] dark:border-[#27272a] flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm font-medium text-[#171717] dark:text-[#f2efe9]">
                      fix: mobile responsiveness across devices
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#707070] dark:text-[#f2efe9]/50">
                      <span className="w-4 h-4 rounded-full bg-blue-600 dark:bg-[#0099ff] text-white font-bold flex items-center justify-center text-[9px]">
                        A
                      </span>
                      <span>alex-carter</span>
                      <span>Oct 13, 2025</span>
                      <span className="text-emerald-500 font-bold">✓</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-blue-600 dark:text-[#0099ff] bg-blue-500/10 px-2 py-1 rounded">
                    e8b4f2a
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Middle: Sparkle Pulse Bridge */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center py-4 lg:py-0">
            <motion.div
              animate={{
                scale: step === 1 ? [1, 1.25, 1] : 1,
                rotate: step === 1 ? [0, 180, 360] : 0,
              }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg border border-blue-400/50"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <motion.span
              animate={step === 1 ? { color: ["#0099ff", "#a855f7", "#0099ff"] } : { color: "#0099ff" }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-[11px] font-mono font-bold tracking-widest uppercase mt-2 text-center"
            >
              SYNTHESIS
            </motion.span>
          </div>

          {/* Right: Recruiter-Ready Resume Output */}
          <motion.div
            animate={{
              opacity: step >= 2 ? 1 : 0.35,
              borderColor: step === 3 ? "rgba(16, 185, 129, 0.45)" : undefined,
            }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 rounded-2xl border border-[#E5E5E5] dark:border-[#27272a] bg-white dark:bg-[#141417] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-2xl relative transition-colors duration-300"
          >
            {/* Floating ATS Badge with Spring Animation */}
            <AnimatePresence>
              {step === 3 && (
                <motion.div
                  initial={{ scale: 0, y: 12 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 15 }}
                  className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold font-mono shadow-lg"
                >
                  <Check size={12} strokeWidth={3} />
                  <span>ATS-Friendly Format</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-b border-[#E5E5E5] dark:border-[#27272a] pb-3 mb-4">
              <h3 className="text-lg font-bold text-[#171717] dark:text-[#f2efe9] uppercase tracking-wider font-serif">ALEX CARTER</h3>
              <p className="text-xs text-[#707070] dark:text-[#f2efe9]/50 font-mono">SOFTWARE ENGINEER · SAMPLE</p>
            </div>

            <div className="space-y-3 font-serif text-xs leading-relaxed text-[#52525b] dark:text-[#f2efe9]/85">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#171717] dark:text-[#f2efe9] border-b border-[#E5E5E5] dark:border-[#27272a] pb-1">
                PROJECTS
              </div>
              <div className="flex justify-between items-baseline font-semibold text-[#171717] dark:text-[#f2efe9]">
                <span>weather-app — Creator &amp; Developer</span>
                <span className="font-mono text-[11px] text-[#707070] dark:text-[#f2efe9]/50">2026</span>
              </div>

              <div className="space-y-2">
                <motion.p
                  variants={rightItemVariants}
                  custom={0.1}
                  animate={step >= 2 ? "visible" : "hiddenInstant"}
                >
                  • Developed a <strong className="text-[#171717] dark:text-[#f2efe9] font-semibold">weather forecasting application</strong> using React and the OpenWeather API to provide real-time weather information.
                </motion.p>
                <motion.p
                  variants={rightItemVariants}
                  custom={0.3}
                  animate={step >= 2 ? "visible" : "hiddenInstant"}
                >
                  • Integrated <strong className="text-[#171717] dark:text-[#f2efe9] font-semibold">external API services</strong> and implemented dynamic data rendering for live forecast updates.
                </motion.p>
                <motion.p
                  variants={rightItemVariants}
                  custom={0.5}
                  animate={step >= 2 ? "visible" : "hiddenInstant"}
                >
                  • Improved <strong className="text-[#171717] dark:text-[#f2efe9] font-semibold">mobile responsiveness</strong> by resolving rendering issues and optimizing the interface across devices.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA below transformation */}
        <div className="mt-14 flex justify-center">
          <ArrowRevealButton
            label={hasSession ? "Go to Dashboard" : "Build my CV free"}
            link={hasSession ? "/dashboard" : "/login"}
            rounded={100}
            padding="10px 18px 10px 24px"
            gap={12}
            colors={{
              fill: "#171717",
              textColor: "#ffffff",
              hoverFill: "#262626",
              hoverTextColor: "#ffffff",
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
        </div>
      </div>
    </section>
  );
}
