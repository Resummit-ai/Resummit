"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ArrowRevealButton from "@/components/ui/ArrowRevealButton";

export function FinalCtaSection() {
  return (
    <section className="bg-[#F5F5F3] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#f2efe9] py-16 sm:py-24 border-t border-[#E5E5E5] dark:border-[#27272a] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* CSS-Engineered Gradient CTA Banner (No stock image) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-[#0c1222] shadow-2xl min-h-[300px] sm:min-h-[360px] p-8 sm:p-14 flex flex-col justify-end"
        >
          {/* Subtle Ambient Mesh Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-500/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-indigo-500/15 blur-[90px] pointer-events-none" />

          {/* Decorative Dot Grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-400/30 bg-blue-500/20 text-blue-300 text-xs font-mono font-semibold tracking-wider uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Free to start
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                Ready to build the CV <br className="hidden sm:block" />your commits deserve?
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 mt-3 max-w-xl font-normal leading-relaxed">
                Connect your public GitHub repos in one click, paste a job description, and tailor your resume in seconds. Free to start.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <ArrowRevealButton
                label="Build my CV free"
                link="/login"
                rounded={100}
                padding="12px 20px 12px 26px"
                gap={12}
                colors={{
                  fill: "#ffffff",
                  textColor: "#09090b",
                  hoverFill: "#f4f4f5",
                  hoverTextColor: "#09090b",
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
                  const el = document.getElementById("preview-resume") || document.getElementById("alex-developer-heading");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-6 py-3 text-sm font-medium text-white hover:bg-black/60 hover:border-white/40 transition-all shadow-sm"
              >
                See sample resume →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
