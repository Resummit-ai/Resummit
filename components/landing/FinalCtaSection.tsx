"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ArrowRevealButton from "@/components/ui/ArrowRevealButton";

export function FinalCtaSection() {
  return (
    <section className="bg-[#F5F5F3] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#f2efe9] py-16 sm:py-24 border-t border-[#E5E5E5] dark:border-[#27272a] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Mountain Landscape Banner matching reference final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-[#27272a] shadow-xl min-h-[300px] sm:min-h-[360px] p-8 sm:p-14 flex flex-col justify-end"
        >
          {/* Background Mountain Sky Image */}
          <img
            src="/images/fairweather_sky.jpg"
            alt="Resummit developer resume platform preview"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-85"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-400/30 bg-blue-500/20 text-blue-300 text-xs font-mono font-semibold tracking-wider uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Ready to ship
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                Ready to build the CV <br className="hidden sm:block" />your commits deserve?
              </h2>
              <p className="text-sm sm:text-base text-neutral-200 mt-3 max-w-xl font-normal leading-relaxed">
                Connect your GitHub in one click. Open access during public preview—no credit card required.
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
                  const el = document.getElementById("preview-resume") || document.getElementById("interactive-resume");
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
