"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Globe, GitFork, ShieldCheck, Activity } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function CommitStreamSection() {
  const features = [
    {
      title: "One link, all repositories",
      desc: "Connect once. Resummit tracks your public and private repositories, auto-updating achievements whenever you push.",
      icon: <Globe className="h-4 w-4 text-sky-400" />,
    },
    {
      title: "Automated impact metrics",
      desc: "Diffs and PR descriptions are converted into Google XYZ-style quantified bullet points with real performance numbers.",
      icon: <GitFork className="h-4 w-4 text-sky-400" />,
    },
    {
      title: "Strict code privacy",
      desc: "Strict read-only metadata access. Your proprietary business logic and code secrets are never indexed or retained.",
      icon: <ShieldCheck className="h-4 w-4 text-sky-400" />,
    },
    {
      title: "ATS scored on every sync",
      desc: "We validate every bullet against real corporate applicant tracking filters before exporting your PDF.",
      icon: <Activity className="h-4 w-4 text-sky-400" />,
    },
  ];

  return (
    <section className="bg-[#09090b] text-white py-24 sm:py-32 border-t border-neutral-900 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Title & Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400">
              <span>✳</span>
              <span>Git Activity Matrix</span>
            </div>

            <h2 className="text-4xl font-normal sm:font-medium tracking-tight text-white sm:text-5xl leading-[1.15]">
              Every commit lands close to your resume
            </h2>

            <p className="text-base text-neutral-400 leading-relaxed">
              Resummit continuously tracks your GitHub activity across organizations, converting daily engineering output into interview-ready proof.
            </p>

            <div>
              <Link
                href={LANDING_CONFIG.brand.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:border-neutral-700 shadow-sm"
              >
                <span>See sample resume</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Matrix Graphic with Stats */}
          <div className="lg:col-span-7 relative">
            {/* Top Stats */}
            <div className="flex items-center justify-end gap-8 mb-4 pr-4">
              <div className="text-right">
                <span className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  Bullets / sec
                </span>
                <span className="text-2xl font-bold font-mono text-white">14.8</span>
              </div>
              <div className="text-right">
                <span className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  Repos live
                </span>
                <span className="text-2xl font-bold font-mono text-white">1,420</span>
              </div>
            </div>

            {/* Matrix Card */}
            <div className="relative rounded-2xl border border-neutral-800/80 bg-[#0e0e11] p-6 sm:p-8 overflow-hidden min-h-[320px] flex flex-col justify-between">
              {/* Subtle Dotted Grid World */}
              <div
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              {/* Glowing Nodes / Commit Points */}
              <div className="relative z-10 flex items-center justify-between text-xs text-neutral-400">
                <span className="font-mono text-[11px] text-neutral-500">RESUMMIT GLOBAL SYNC</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                  <span className="font-mono text-[11px] text-sky-400 font-semibold">
                    GITHUB 42 MS
                  </span>
                </div>
              </div>

              {/* Interactive Visual Commit Stream Line */}
              <div className="relative z-10 my-8 space-y-3">
                <div className="rounded-xl border border-neutral-800 bg-[#16161c]/80 p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                    <span className="font-mono text-neutral-300">git push origin main</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">api/v2 8f3a1c2</span>
                </div>

                <div className="rounded-xl border border-sky-500/30 bg-sky-500/[0.08] p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-neutral-200">
                      Auto-synthesized: "Reduced API response times by 42% via Redis cache..."
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">ATS 98%</span>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-3 border-t border-neutral-800/80">
                <span>Active Webhooks: 4 organizations</span>
                <span>Latency p95: 84ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Columns Below Map (Exact match to reference) */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-neutral-900">
          {features.map((feat, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
                {feat.icon}
              </div>
              <h3 className="text-sm font-semibold text-white tracking-tight">{feat.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
