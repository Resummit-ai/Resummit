"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import RotatingText from "@/components/ui/RotatingText";
import { motion } from "framer-motion";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function ProofStatementSection() {
  return (
    <section id="proof" className="bg-[#09090b] text-white py-24 sm:py-32 border-t border-neutral-900 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent_70%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-medium text-sky-400 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span>GitHub-powered resume intelligence</span>
        </div>

        {/* Rotating Headline */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal sm:font-medium tracking-tight text-white leading-[1.12]">
            Your GitHub already proves your experience in
          </h2>
          <div className="mt-4 flex items-center justify-center">
            <RotatingText
              texts={["Infrastructure", "Full-Stack Web", "AI & ML Systems", "Cloud & DevOps"]}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 inline-block py-2"
              rotationInterval={2800}
            />
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-neutral-400 leading-relaxed">
          Resummit analyzes repositories, commits, dependencies, and PR structures to generate clean, recruiter-ready resumes directly from the software you already shipped.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={LANDING_CONFIG.brand.primaryCta.href}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-200 shadow-xl"
          >
            <span>Start for free</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#pipeline"
            className="inline-flex items-center rounded-full border border-white/20 bg-neutral-900/80 px-6 py-3 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* 3 Metric Callouts */}
        <div className="mt-16 pt-12 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl border border-neutral-800/80 bg-[#121217]">
            <div className="text-3xl font-bold font-mono text-white">94%</div>
            <p className="mt-1 text-xs text-neutral-400 leading-normal">
              Median ATS parse rate across Greenhouse, Lever, and Workday recruiters.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800/80 bg-[#121217]">
            <div className="text-3xl font-bold font-mono text-white">&lt;60s</div>
            <p className="mt-1 text-xs text-neutral-400 leading-normal">
              Average generation time from public GitHub repositories.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800/80 bg-[#121217]">
            <div className="text-3xl font-bold font-mono text-white">100%</div>
            <p className="mt-1 text-xs text-neutral-400 leading-normal">
              Strict read-only GitHub access. We never write or push to your repos.
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-400" />
            Free to start · No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-400" />
            Read-only GitHub OAuth · Zero write permissions
          </span>
        </div>
      </div>
    </section>
  );
}
