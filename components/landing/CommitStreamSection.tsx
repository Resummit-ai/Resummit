"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Globe, GitFork, ShieldCheck, Activity } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function CommitStreamSection() {
  const features = [
    {
      title: "Public repository sync",
      desc: "Connect once. Re-sync your GitHub in one click and review new suggestions before adding them to your master resume.",
      icon: <Globe className="h-4 w-4 text-blue-600 dark:text-sky-400" />,
    },
    {
      title: "Accomplishment-focused bullets",
      desc: "Repo descriptions, READMEs, and commit messages are converted into structured bullets highlighting what you built and the result.",
      icon: <GitFork className="h-4 w-4 text-blue-600 dark:text-sky-400" />,
    },
    {
      title: "Strict code privacy",
      desc: "We read repository details like names, languages, READMEs and commit messages to write your resume. We never change your repositories.",
      icon: <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-sky-400" />,
    },
    {
      title: "ATS-friendly structure",
      desc: "Single-column format, standard section headings, and clean selectable text calibrated for recruiter ATS filters.",
      icon: <Activity className="h-4 w-4 text-blue-600 dark:text-sky-400" />,
    },
  ];

  return (
    <section className="bg-[#F5F5F3] dark:bg-[#09090b] text-[#171717] dark:text-white py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-neutral-900 overflow-hidden transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Title & Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-sky-400">
              <span>✳</span>
              <span>Commit-to-bullet preview</span>
            </div>

            <h2 className="text-4xl font-extrabold sm:font-bold tracking-tight text-[#171717] dark:text-white sm:text-5xl leading-[1.15]">
              Every commit lands close to your resume
            </h2>

            <p className="text-base text-[#707070] dark:text-neutral-400 leading-relaxed">
              Resummit reads your public GitHub activity, converting real project commits into interview-ready resume bullets.
            </p>

            <div>
              <Link
                href={LANDING_CONFIG.brand.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-800 bg-[#171717] dark:bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 shadow-sm"
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
                <span className="block text-[11px] font-mono text-[#707070] dark:text-neutral-400 uppercase tracking-wider">
                  Public Beta
                </span>
                <span className="text-2xl font-bold font-mono text-[#171717] dark:text-white">Free</span>
              </div>
              <div className="text-right">
                <span className="block text-[11px] font-mono text-[#707070] dark:text-neutral-400 uppercase tracking-wider">
                  GitHub
                </span>
                <span className="text-2xl font-bold font-mono text-[#171717] dark:text-white">Read-only</span>
              </div>
            </div>

            {/* Matrix Card */}
            <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-neutral-800/80 bg-white dark:bg-[#0e0e11] p-6 sm:p-8 overflow-hidden min-h-[320px] flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-2xl transition-colors duration-300">
              {/* Subtle Dotted Grid World */}
              <div
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              {/* Glowing Nodes / Commit Points */}
              <div className="relative z-10 flex items-center justify-between text-xs text-[#707070] dark:text-neutral-400">
                <span className="font-mono text-[11px] text-[#707070] dark:text-neutral-500">COMMIT-TO-BULLET (EXAMPLE)</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-sky-400 animate-ping" />
                  <span className="font-mono text-[11px] text-blue-600 dark:text-sky-400 font-semibold">
                    EXAMPLE
                  </span>
                </div>
              </div>

              {/* Interactive Visual Commit Stream Line */}
              <div className="relative z-10 my-8 space-y-3">
                <div className="rounded-xl border border-[#E5E5E5] dark:border-neutral-800 bg-[#F7F7F6] dark:bg-[#16161c]/80 p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-sky-400" />
                    <span className="font-mono text-[#171717] dark:text-neutral-300 font-medium">git commit -m &quot;feat: cache layer with Redis &amp; async workers&quot;</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#707070] dark:text-neutral-500">weather-app</span>
                </div>

                <div className="rounded-xl border border-blue-500/30 bg-blue-500/[0.08] p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[#171717] dark:text-neutral-200 font-medium">
                      Engineered a Redis caching layer for external API calls, reducing response latency.
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">ATS score: sample</span>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[#707070] dark:text-neutral-500 pt-3 border-t border-[#E5E5E5] dark:border-neutral-800/80">
                <span>Read-only public repo access</span>
                <span>Tailored to any job description</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Columns Below Map */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-[#E5E5E5] dark:border-neutral-900">
          {features.map((feat, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                {feat.icon}
              </div>
              <h3 className="text-sm font-bold text-[#171717] dark:text-white tracking-tight">{feat.title}</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
