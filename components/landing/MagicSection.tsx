"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { GitBranch, Sparkles, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function MagicSection({ hasSession = false }: { hasSession?: boolean }) {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !active) {
        setActive(true);
      }
    }, { threshold: 0.2 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setStep((s) => (s >= 3 ? 3 : s + 1));
    }, 1600);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-[#0a0a0a] text-[#f2efe9] relative overflow-hidden border-t border-[#27272a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs sm:text-sm font-medium uppercase tracking-wider text-[#0099ff] mb-3">
            THE MAGIC
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#f2efe9] leading-[1.12] mb-4">
            From raw commit<br />
            to recruiter-ready bullet
          </h2>
          <p className="text-base sm:text-lg text-[#f2efe9]/70 leading-relaxed font-normal">
            Resummit reads what you actually built — and translates it into the professional language recruiters expect.
          </p>
        </div>

        {/* 3-Column Magic Transformation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
          {/* Left: GitHub Commits Widget */}
          <motion.div
            animate={{
              borderColor: step === 0 || step === 3 ? "rgba(0, 153, 255, 0.4)" : "#27272a",
              opacity: step === 2 ? 0.7 : 1,
            }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 rounded-2xl border border-[#27272a] bg-[#141417] p-5 shadow-2xl"
          >
            {/* Repo Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" className="text-[#f2efe9]/60">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1.5 1.5 0 0 1 1.5-1.5h7.5z" />
                </svg>
                <span className="font-medium text-[#f2efe9] text-sm font-mono">weather-app</span>
                <span className="text-[10px] text-[#f2efe9]/60 bg-neutral-800 px-2 py-0.5 rounded font-mono">Public</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#f2efe9]/60 font-mono bg-neutral-800 px-2.5 py-0.5 rounded">
                <GitBranch size={12} />
                <span>main</span>
              </div>
            </div>

            {/* Commits List */}
            <div>
              <div className="text-xs font-mono text-[#f2efe9]/50 mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0099ff]" />
                Commits on Jun 7, 2026
              </div>

              <div className="space-y-3">
                {/* Commit 1 */}
                <div className="p-3 rounded-xl bg-[#18181b] border border-[#27272a] flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm font-normal text-[#f2efe9]">
                      feat: add weather api integration
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#f2efe9]/50">
                      <span className="w-4 h-4 rounded-full bg-[#0099ff] text-white font-bold flex items-center justify-center text-[9px]">
                        A
                      </span>
                      <span>Adel-muhammed</span>
                      <span>committed 4 hours ago</span>
                      <span className="text-emerald-400 font-bold">✓</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-medium text-[#0099ff] bg-[#0099ff]/10 px-2 py-1 rounded">
                    a3f2c1e
                  </span>
                </div>

                {/* Commit 2 */}
                <div className="p-3 rounded-xl bg-[#18181b] border border-[#27272a] flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm font-normal text-[#f2efe9]">
                      fix: render bug on mobile
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#f2efe9]/50">
                      <span className="w-4 h-4 rounded-full bg-[#0099ff] text-white font-bold flex items-center justify-center text-[9px]">
                        A
                      </span>
                      <span>Adel-muhammed</span>
                      <span>committed 4 hours ago</span>
                      <span className="text-emerald-400 font-bold">✓</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-medium text-[#0099ff] bg-[#0099ff]/10 px-2 py-1 rounded">
                    b8e4d2f
                  </span>
                </div>

                {/* Commit 3 */}
                <div className="p-3 rounded-xl bg-[#18181b] border border-[#27272a] flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm font-normal text-[#f2efe9]">
                      feat: hook up openweather api
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#f2efe9]/50">
                      <span className="w-4 h-4 rounded-full bg-[#0099ff] text-white font-bold flex items-center justify-center text-[9px]">
                        A
                      </span>
                      <span>Adel-muhammed</span>
                      <span>committed 4 hours ago</span>
                      <span className="text-emerald-400 font-bold">✓</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-medium text-[#0099ff] bg-[#0099ff]/10 px-2 py-1 rounded">
                    c9a1b3d
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center: AI Synthesis Engine Node */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center py-4 lg:py-0">
            <motion.div
              animate={step === 1 ? {
                scale: [1, 1.15, 1],
                boxShadow: ["0 0 15px rgba(0,153,255,0.3)", "0 0 35px rgba(168,85,247,0.8)", "0 0 15px rgba(0,153,255,0.3)"]
              } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0099ff] to-indigo-500 flex items-center justify-center shadow-lg border border-[#0099ff]/40"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-[11px] font-mono font-medium tracking-widest uppercase text-[#0099ff] mt-2 text-center">
              AI SYNTHESIS
            </span>
          </div>

          {/* Right: Recruiter-Ready Resume Output */}
          <motion.div
            animate={{
              opacity: step >= 2 ? 1 : 0.35,
              borderColor: step === 3 ? "rgba(16, 185, 129, 0.4)" : "#27272a",
            }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 rounded-2xl border border-[#27272a] bg-[#141417] p-6 shadow-2xl relative"
          >
            {/* Floating ATS Badge */}
            {step === 3 && (
              <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-black text-xs font-medium font-mono shadow-lg"
              >
                <Check size={12} strokeWidth={3} />
                <span>ATS Grade: A+</span>
              </motion.div>
            )}

            <div className="border-b border-[#27272a] pb-3 mb-4">
              <h3 className="text-lg font-medium text-[#f2efe9] uppercase tracking-wider font-serif">ALEX CARTER</h3>
              <p className="text-xs text-[#f2efe9]/50 font-mono">SOFTWARE ENGINEER</p>
            </div>

            <div className="space-y-3 font-serif text-xs leading-relaxed text-[#f2efe9]/85">
              <div className="text-[11px] font-medium uppercase tracking-wider text-[#f2efe9] border-b border-[#27272a] pb-1">
                PROJECTS
              </div>
              <div className="flex justify-between items-baseline font-medium text-[#f2efe9]">
                <span>weather-app — Creator &amp; Developer</span>
                <span className="font-mono text-[11px] text-[#f2efe9]/50">2026</span>
              </div>

              <div className="space-y-2">
                <p>
                  • Developed a <strong className="text-[#f2efe9] font-medium">weather forecasting application</strong> using React and the OpenWeather API to provide real-time weather information.
                </p>
                <p>
                  • Integrated <strong className="text-[#f2efe9] font-medium">external API services</strong> and implemented dynamic data rendering for live forecast updates.
                </p>
                <p>
                  • Improved <strong className="text-[#f2efe9] font-medium">mobile responsiveness</strong> by resolving rendering issues and optimizing the interface across devices.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA below transformation */}
        <div className="mt-14 text-center">
          <Link
            href={hasSession ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-2.5 text-sm font-medium text-black transition-all hover:bg-neutral-200 shadow-md group"
          >
            <span>{hasSession ? "Go to Dashboard" : "Sign In with GitHub"}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
