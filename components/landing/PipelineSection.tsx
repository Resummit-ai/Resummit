"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, PenTool, Target, FileDown } from "lucide-react";
import { GithubIcon } from "./Icons";

export function PipelineSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "connect",
      title: "Connect",
      headline: "One-click read-only GitHub integration",
      copy: "Sign in with GitHub in 5 seconds. Resummit requests strict read-only permissions and never alters repository code.",
      icon: <GithubIcon className="h-5 w-5" />,
      timelineLabel: "Connect GitHub (5s)",
    },
    {
      id: "write",
      title: "Write",
      headline: "Bullets synthesized from real commits",
      copy: "AI scans pull requests, release notes, and commit diffs to formulate quantified, action-driven achievement bullets.",
      icon: <PenTool className="h-5 w-5" />,
      timelineLabel: "Write bullets",
    },
    {
      id: "tailor",
      title: "Tailor",
      headline: "Re-rank and re-frame for the target job",
      copy: "Paste a target job description. The engine aligns your technical stack and highlights the most relevant project accomplishments.",
      icon: <Target className="h-5 w-5" />,
      timelineLabel: "Tailor to job",
    },
    {
      id: "export",
      title: "Export",
      headline: "ATS-optimized single-page PDF",
      copy: "Generate a perfectly formatted, ATS-compliant PDF ready to submit directly through corporate applicant portals.",
      icon: <FileDown className="h-5 w-5" />,
      timelineLabel: "Export PDF",
    },
  ];

  // Looping timeline
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section id="pipeline" className="scroll-mt-6 bg-[rgb(10,10,10)] text-[rgb(242,239,233)] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
            Full Pipeline
          </p>
          <h2 className="mt-3 max-w-[24ch] text-4xl font-medium tracking-tight text-balance sm:text-5xl text-[rgb(242,239,233)]">
            Everything between your commits and your next interview
          </h2>
          <p className="mt-4 text-base text-[rgba(242,239,233,0.7)]">
            From raw git history to an interview-ready resume without manual formatting.
          </p>
        </div>

        {/* Interactive Split Pane */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Animated Step Timeline Card */}
          <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-md">
            <div className="space-y-6">
              {steps.map((step, idx) => {
                const isCurrent = activeStep === idx;
                const isCompleted = activeStep > idx;

                return (
                  <div key={step.id} className="relative flex items-start gap-4">
                    {/* Step Icon / Circle */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                        isCurrent
                          ? "border-blue-500 bg-blue-600/20 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                          : isCompleted
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                          : "border-white/10 bg-white/5 text-[rgba(242,239,233,0.4)]"
                      }`}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : step.icon}
                    </div>

                    {/* Step Content & Animated Progress Bar */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={`font-medium ${
                            isCurrent
                              ? "text-[rgb(242,239,233)] font-semibold"
                              : "text-[rgba(242,239,233,0.7)]"
                          }`}
                        >
                          {step.timelineLabel}
                        </span>
                        {isCurrent && (
                          <span className="text-xs font-mono text-blue-400">Processing...</span>
                        )}
                        {isCompleted && (
                          <span className="text-xs font-mono text-emerald-400">Done</span>
                        )}
                      </div>

                      {/* Animated Progress line */}
                      {isCurrent && (
                        <div className="mt-2 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500 animate-[moveHorizontal_4s_linear_infinite]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: 4 Clickable Tabs Driving Animation */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left rounded-xl p-5 transition-all border ${
                      isActive
                        ? "border-white/15 bg-white/[0.05] shadow-lg"
                        : "border-transparent bg-transparent hover:bg-white/[0.02] text-[rgba(242,239,233,0.6)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono uppercase tracking-wider ${
                          isActive ? "text-blue-400" : "text-[rgba(242,239,233,0.4)]"
                        }`}
                      >
                        Step 0{idx + 1}
                      </span>
                      <h3
                        className={`text-lg font-medium ${
                          isActive ? "text-[rgb(242,239,233)]" : "text-[rgba(242,239,233,0.7)]"
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    {isActive && (
                      <p className="mt-2 text-sm text-[rgba(242,239,233,0.7)] leading-relaxed">
                        {step.copy}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Section CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-[rgb(242,239,233)] px-6 py-2.5 text-sm font-medium text-neutral-950 transition-all hover:bg-[rgb(242,239,233)]/90"
              >
                Build my CV
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-full bg-white/5 px-6 py-2.5 text-sm font-medium text-[rgb(242,239,233)] inset-ring inset-ring-white/10 hover:bg-white/10"
              >
                See pricing
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
