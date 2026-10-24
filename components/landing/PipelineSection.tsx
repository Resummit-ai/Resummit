"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function PipelineSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: "sync",
      title: "Re-sync your GitHub",
      description:
        "Re-sync your GitHub in one click and review new suggestions before adding them to your master resume.",
      metricTime: "Fast",
      breakdown: [
        { label: "Scan repositories", time: "Ready" },
        { label: "Parse README & skills", time: "Done" },
        { label: "Structure bullets", time: "Ready" },
        { label: "Format ATS resume", time: "Done" },
      ],
      tag: "github.com/developer/portfolio",
      footer: "From public commits to interview-ready bullet",
    },
    {
      id: "xyz",
      title: "Accomplishment-focused bullets",
      description:
        "Every bullet starts with what you built, how you built it, and the resulting impact, transforming raw code into recruiter-friendly accomplishments.",
      metricTime: "Example",
      breakdown: [
        { label: "Action verbs extracted", time: "High" },
        { label: "Impact highlighted", time: "High" },
        { label: "Tech stack identified", time: "High" },
        { label: "ATS format verified", time: "Done" },
      ],
      tag: "resume.engine/accomplishment-parser",
      footer: "Aligned with engineering hiring expectations",
    },
    {
      id: "roles",
      title: "Tailor to any job description",
      description:
        "Paste a job description to tailor your CV in seconds. Resummit highlights the exact skills and projects that match the position.",
      metricTime: "On demand",
      breakdown: [
        { label: "Full-Stack focus", time: "Ready" },
        { label: "Backend focus", time: "Ready" },
        { label: "Frontend focus", time: "Ready" },
        { label: "DevOps focus", time: "Ready" },
      ],
      tag: "resume.engine/role-matrix",
      footer: "One master CV, tailored for every job application",
    },
    {
      id: "ats",
      title: "ATS-optimized export",
      description:
        "Single-column, recruiter-scannable PDF and clean plain-text formats with standard headings and selectable text.",
      metricTime: "Clean",
      breakdown: [
        { label: "Single-column format", time: "Enforced" },
        { label: "Standard headings", time: "Enforced" },
        { label: "Selectable text", time: "Verified" },
        { label: "No unparseable tables", time: "Guaranteed" },
      ],
      tag: "export.resummit.app/pdf-engine",
      footer: "Clean, readable layout on all applicant tracking systems",
    },
  ];

  const currentTab = tabs[activeTab];

  return (
    <section
      id="pipeline"
      className="scroll-mt-12 bg-[#F5F5F3] dark:bg-[#09090b] text-[#171717] dark:text-white py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-neutral-900 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <h2 className="text-4xl font-extrabold sm:font-bold tracking-tight text-[#171717] dark:text-white sm:text-5xl leading-[1.15]">
            Everything between your commits and your next offer
          </h2>
        </div>

        {/* Mountain Container with Floating Live Status Card */}
        <div className="mt-12 relative rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-white/10 shadow-2xl min-h-[460px] sm:min-h-[500px] flex items-center justify-center p-6 sm:p-12">
          {/* Mountain Artwork Background */}
          <img
            src="/images/fairweather_sky.jpg"
            alt="Resummit turning commits into resume bullets"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

          {/* Floating White Card */}
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/95 dark:bg-[#fafafa]/95 backdrop-blur-md p-6 text-neutral-900 shadow-2xl border border-white/60 transition-all duration-300">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-neutral-500 font-medium">
                {currentTab.tag}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>

            {/* Big Metric Display */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-neutral-950">
                {currentTab.metricTime}
              </span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                execution
              </span>
            </div>

            {/* Checklist Items with Durations */}
            <div className="mt-5 space-y-2.5 border-t border-neutral-200/80 pt-4">
              {currentTab.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-neutral-700 font-medium">{item.label}</span>
                  </div>
                  <span className="font-mono text-xs text-neutral-500">{item.time}</span>
                </div>
              ))}
            </div>

            {/* Card Footer */}
            <div className="mt-5 border-t border-neutral-200/80 pt-3 text-center">
              <p className="text-[11px] text-neutral-500">{currentTab.footer}</p>
            </div>
          </div>
        </div>

        {/* 4 Horizontal Tabs below Mountain Card */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className="text-left group transition-all"
              >
                {/* Active indicator top bar */}
                <div
                  className={`h-[2px] w-full transition-all duration-300 ${isActive
                      ? "bg-blue-600 dark:bg-white"
                      : "bg-[#E5E5E5] dark:bg-neutral-800 group-hover:bg-neutral-400 dark:group-hover:bg-neutral-700"
                    }`}
                />
                <h3
                  className={`mt-4 text-base font-semibold tracking-tight transition-colors ${isActive
                      ? "text-[#171717] dark:text-white"
                      : "text-[#707070] dark:text-neutral-400 group-hover:text-black dark:group-hover:text-neutral-200"
                    }`}
                >
                  {tab.title}
                </h3>
                {isActive && (
                  <p className="mt-2 text-xs sm:text-sm text-[#52525b] dark:text-neutral-400 leading-relaxed animate-fadeIn">
                    {tab.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons below Tabs */}
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href={LANDING_CONFIG.brand.primaryCta.href}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-white/20 bg-[#171717] dark:bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800 hover:border-neutral-500 dark:hover:border-white/40 shadow-sm"
          >
            <span>Start auto-syncing</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#workflow"
            className="text-sm font-semibold text-[#707070] dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Explore the pipeline workflow →
          </a>
        </div>
      </div>
    </section>
  );
}
