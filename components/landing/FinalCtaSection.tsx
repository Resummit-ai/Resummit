"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ArrowRevealButton from "@/components/ui/ArrowRevealButton";

export function FinalCtaSection() {
  return (
    <section className="bg-[#0a0a0a] text-[#f2efe9] py-16 sm:py-24 border-t border-[#27272a]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Mountain Landscape Banner matching reference final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-[#27272a] shadow-2xl min-h-[300px] sm:min-h-[360px] p-8 sm:p-14 flex flex-col justify-end"
        >
          {/* Background Mountain Sky Image */}
          <img
            src="/images/fairweather_sky.jpg"
            alt="Mountain ridge landscape"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-85"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/60 to-transparent pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-[#0099ff] text-xs font-mono font-semibold tracking-wider uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0099ff] animate-pulse" />
                Ready to ship
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#f2efe9] leading-[1.08]">
                Ready to build the CV <br className="hidden sm:block" />your commits deserve?
              </h2>
              <p className="text-sm sm:text-base text-[#f2efe9]/75 mt-3 max-w-xl font-normal leading-relaxed">
                Connect your GitHub in one click. 100% free while in early access—no credit card required.
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
                className="inline-flex items-center rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-6 py-3 text-sm font-medium text-[#f2efe9] hover:bg-white/10 hover:border-white/30 transition-all shadow-sm"
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
