"use client";

import React from "react";
import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import ArrowRevealButton from "@/components/ui/ArrowRevealButton";

export function PricingSection() {
  const earlyAccessFeatures = [
    {
      title: "Public GitHub Repositories",
      desc: "Connect your profile to analyze commits, languages, and READMEs across your public repositories.",
    },
    {
      title: "Accomplishment Bullets",
      desc: "Synthesize accomplishments into proven engineering bullets that start with what you built, how, and the result.",
    },
    {
      title: "Tailored to Any Job",
      desc: "Tailor your CV to any job description. Paste the role and get a tailored version.",
    },
    {
      title: "ATS-Friendly Format",
      desc: "ATS-friendly format: single column, standard headings, selectable text.",
    },
    {
      title: "Single-Page PDF Engine",
      desc: "Publication-grade single-page typography engineered for automated screening and technical hiring managers.",
    },
    {
      title: "Read-Only Security Guarantee",
      desc: "Resummit only reads your public GitHub data and never changes your repositories.",
    },
  ];

  const honestFaqs = [
    {
      q: "Why is Resummit available at no cost during public beta?",
      a: "We are actively tuning our bullet point synthesis with real developer workflows. Public beta enables continuous improvement against real public repositories.",
    },
    {
      q: "Is a payment method or credit card required?",
      a: "No payment information or credit card is required. Authenticate directly with read-only GitHub OAuth for immediate access.",
    },
    {
      q: "Will my generated resumes remain accessible?",
      a: "Yes. Your resumes stay in your account with PDF exports available whenever you need them.",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 sm:py-32 bg-[#F5F5F3] dark:bg-[#0a0a0a] text-neutral-900 dark:text-[#f2efe9] relative overflow-hidden border-t border-[#E5E5E5] dark:border-[#27272a] transition-colors duration-300"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

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
            Developer Access · Public Beta
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold sm:font-bold tracking-tight text-neutral-950 dark:text-[#f2efe9] leading-[1.15] mb-4">
            Full platform capabilities.
            <br />
            Available at no cost during preview.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-[#f2efe9]/70 leading-relaxed font-normal max-w-2xl mx-auto">
            Connect your GitHub profile to analyze public repositories, synthesize accomplishment-focused bullets, tailor your CV to any job description, and export ATS-friendly resumes.
          </p>
        </motion.div>

        {/* Featured Early Access Card with Aceternity-style Animated Border Glow & Hover Physics */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group max-w-4xl mx-auto rounded-3xl border border-[#E5E5E5] dark:border-[#27272a] hover:border-blue-500/40 dark:hover:border-blue-500/50 bg-white dark:bg-[#141417] p-8 sm:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden transition-all duration-300"
        >
          {/* Subtle Aceternity Spotlight Glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/15 dark:bg-blue-500/20 blur-[100px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Price & CTA */}
            <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E5E5E5] dark:border-[#27272a] pb-8 lg:pb-0 lg:pr-8">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-[#0099ff] font-semibold font-mono">
                  Developer Edition
                </span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-bold tracking-tight text-neutral-950 dark:text-[#f2efe9]">
                    $0
                  </span>
                  <span className="text-sm font-mono text-neutral-500 dark:text-[#f2efe9]/50">
                    / during public beta
                  </span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">
                  Free during public beta. Access repository intelligence, bullet synthesis, and ATS-friendly PDF exports. No credit card required.
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
                  <span>Resummit only reads your public GitHub data and never changes your repositories</span>
                </div>
              </div>
            </div>

            {/* Right: Feature Checklist */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {earlyAccessFeatures.map((feat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F7F6] dark:bg-[#18181b]/80 border border-[#E5E5E5] dark:border-[#27272a]/70 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-[#f2efe9]">{feat.title}</div>
                    <div className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-normal mt-0.5">{feat.desc}</div>
                  </div>
                </motion.div>
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
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl border border-[#E5E5E5] dark:border-[#27272a] hover:border-neutral-400 dark:hover:border-neutral-700 bg-white dark:bg-[#141417]/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col justify-between transition-all duration-300"
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
