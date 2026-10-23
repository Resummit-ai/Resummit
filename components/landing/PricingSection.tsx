"use client";

import React from "react";
import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import ArrowRevealButton from "@/components/ui/ArrowRevealButton";

export function PricingSection() {
  const earlyAccessFeatures = [
    {
      title: "Full GitHub Ingestion",
      desc: "Connect your profile and analyze public and private repositories.",
    },
    {
      title: "Google XYZ Formula",
      desc: "Automatically format achievements as: Accomplished [X] measured by [Y] by doing [Z].",
    },
    {
      title: "5 Role Variants",
      desc: "Instantly tailor versions for Full-Stack, Backend, Frontend, DevOps, and Data/ML.",
    },
    {
      title: "ATS Audit & Gap Analysis",
      desc: "Score keywords and formatting against Greenhouse, Lever, and Workday filters.",
    },
    {
      title: "Clean Single-Page PDF Export",
      desc: "Strict 1-page typography that passes automated recruiter screening pipelines.",
    },
    {
      title: "Read-Only Security Guarantee",
      desc: "We strictly request read permissions. Zero code write access, zero repo modifications.",
    },
  ];

  const honestFaqs = [
    {
      q: "Why is Resummit 100% free right now?",
      a: "We are building Resummit in public with developer feedback. Scanning real-world codebases helps us continuously tune our AST parsers and bullet point synthesis.",
    },
    {
      q: "Will I need to enter a credit card?",
      a: "No credit card required. You sign in directly with GitHub OAuth and get instant access to the builder.",
    },
    {
      q: "What happens to my resumes when beta ends?",
      a: "All resumes and role variants generated during early access remain saved in your account with unlimited PDF re-downloads and early supporter perks.",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 sm:py-32 bg-[#F5F5F3] dark:bg-[#0a0a0a] text-neutral-900 dark:text-[#f2efe9] relative overflow-hidden border-t border-[#E5E5E5] dark:border-[#27272a] transition-colors duration-300"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold tracking-wider uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
            100% Free · Public Beta
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold sm:font-bold tracking-tight text-neutral-950 dark:text-[#f2efe9] leading-[1.15] mb-4">
            Zero paywalls.
            <br />
            Completely free for developers.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-[#f2efe9]/70 leading-relaxed font-normal">
            No fake pricing tiers or surprise checkout screens. Resummit is free while in early access—all features unlocked from day one.
          </p>
        </motion.div>

        {/* Featured Early Access Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto rounded-3xl border border-[#E5E5E5] dark:border-[#27272a] bg-white dark:bg-[#141417] p-8 sm:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden transition-colors duration-300"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Price & CTA */}
            <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E5E5E5] dark:border-[#27272a] pb-8 lg:pb-0 lg:pr-8">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-[#0099ff] font-semibold font-mono">
                  Developer Access
                </span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-bold tracking-tight text-neutral-950 dark:text-[#f2efe9]">
                    $0
                  </span>
                  <span className="text-sm font-mono text-neutral-500 dark:text-[#f2efe9]/50">
                    / early access
                  </span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">
                  Full, unrestricted access to the entire synthesis engine. No credit card required.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <ArrowRevealButton
                  label="Build my CV free"
                  link="/login"
                  rounded={100}
                  padding="12px 20px 12px 26px"
                  gap={12}
                  style={{ width: "100%", justifyContent: "center" }}
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
                <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <ShieldCheck size={14} className="text-emerald-500 dark:text-emerald-400" />
                  <span>Read-only GitHub OAuth · Zero spam</span>
                </div>
              </div>
            </div>

            {/* Right: Feature Checklist */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {earlyAccessFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F7F6] dark:bg-[#18181b]/80 border border-[#E5E5E5] dark:border-[#27272a]/70 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-[#f2efe9]">{feat.title}</div>
                    <div className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-normal mt-0.5">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Professional FAQs */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {honestFaqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-2xl border border-[#E5E5E5] dark:border-[#27272a] bg-white dark:bg-[#141417]/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col justify-between transition-colors duration-300"
            >
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-[#f2efe9] mb-2 leading-snug">
                  {faq.q}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                  {faq.a}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
