"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Copy, Check } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function EditorDemoSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [streamIndex, setStreamIndex] = useState(120);

  const tabs = [
    { name: "Commit diffs", desc: "Parsed line-by-line" },
    { name: "Pull requests", desc: "PR descriptions & issues" },
    { name: "Batch import", badge: "50% off", desc: "Sync entire GitHub orgs" },
    { name: "Role tuning", desc: "Weight for target job" },
    { name: "ATS report", badge: "New", desc: "Greenhouse & Lever pass" },
  ];

  const codeSnippet = `import { ResummitClient } from "@resummit/sdk";

const client = new ResummitClient({
  apiKey: process.env.RESUMMIT_API_KEY,
});

// Auto-parse commit diff into Google XYZ bullet
const bullet = await client.bullets.synthesize({
  repo: "github.com/developer/core-engine",
  commit: "8f3a1c2",
  framework: "google-xyz",
  targetRole: "Senior Systems Engineer",
});

console.log(bullet.text);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setIsRunning(true);
    setStreamIndex(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 6;
      setStreamIndex(current);
      if (current >= 240) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 25);
  };

  const fullResponseText =
    "Architected high-throughput distributed caching pipeline in Go & Redis, reducing p95 database query latency from 140ms to 12ms and saving $2,400/month in cloud infrastructure costs.";

  return (
    <section className="bg-[#09090b] text-white py-24 sm:py-32 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title Header */}
        <div className="max-w-3xl">
          <h2 className="text-4xl font-normal sm:font-medium tracking-tight text-white sm:text-6xl leading-[1.1]">
            Paste one repo link. Keep the code you have.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Resummit speaks your Git history, so the work you push every day turns directly into quantifiable achievements without rewriting your life.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={LANDING_CONFIG.brand.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:border-white/40 shadow-sm"
            >
              <span>Try the live builder</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-neutral-800 bg-[#121215] px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
            >
              Connect GitHub
            </Link>
          </div>
        </div>

        {/* 5 Horizontal Tabs with Active Top Line */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 border-b border-neutral-800/80 pb-4">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveTab(idx)}
                className="text-left group transition-all"
              >
                <div
                  className={`h-[2px] w-full transition-all duration-300 ${
                    isActive ? "bg-sky-400" : "bg-transparent group-hover:bg-neutral-700"
                  }`}
                />
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"
                    }`}
                  >
                    {tab.name}
                  </span>
                  {tab.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        tab.badge === "50% off"
                          ? "bg-sky-500/20 text-sky-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-neutral-500">{tab.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Two-Column Split Window (Editor & Response) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Code Editor Pane */}
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0e0e12] overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Window Header */}
            <div className="flex h-11 items-center justify-between border-b border-neutral-800/80 px-4 bg-[#14141a]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded bg-neutral-800 px-2 py-0.5 font-mono text-[11px] text-neutral-200">
                  <span className="text-amber-400">TS</span> commit_parser.ts
                </span>
                <span className="font-mono text-[11px] text-neutral-500 hover:text-neutral-300 cursor-pointer">
                  .env
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 text-neutral-400 hover:text-white transition-colors"
                  title="Copy snippet"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>{isRunning ? "Running..." : "Run"}</span>
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-4 sm:p-6 font-mono text-xs leading-relaxed text-neutral-300 overflow-x-auto space-y-1">
              {codeSnippet.split("\n").map((line, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="w-6 shrink-0 text-right text-neutral-600 select-none">
                    {idx + 1}
                  </span>
                  <span
                    className={`whitespace-pre ${
                      line.includes("import") || line.includes("const") || line.includes("await")
                        ? "text-sky-400"
                        : line.includes('"')
                        ? "text-emerald-300"
                        : line.includes("//")
                        ? "text-neutral-500 italic"
                        : "text-neutral-200"
                    }`}
                  >
                    {line}
                  </span>
                </div>
              ))}
            </div>

            {/* Editor Footer Status */}
            <div className="flex items-center justify-between border-t border-neutral-800/80 px-4 py-2 text-[11px] font-mono text-neutral-500 bg-[#121217]">
              <span>TypeScript 5.4 UTF-8</span>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>api.resummit.dev Ln 11, Col 3</span>
              </div>
            </div>
          </div>

          {/* Right: Response / Output Pane */}
          <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0e0e12] p-6 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Response Header */}
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                <span className="text-xs font-semibold text-white">Response</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-xs font-mono text-sky-400">Streaming</span>
                </div>
              </div>

              {/* Chat / Query prompt bubble */}
              <div className="mt-4">
                <div className="inline-block rounded-xl bg-neutral-800/80 px-3.5 py-2 text-xs text-neutral-300">
                  Parse commit 8f3a1c2 into resume bullet:
                </div>
              </div>

              {/* Streaming AI output */}
              <div className="mt-4 rounded-xl border border-neutral-800 bg-[#14141a] p-4 text-sm text-neutral-200 leading-relaxed font-sans min-h-[120px]">
                {fullResponseText.slice(0, streamIndex)}
                {isRunning && <span className="inline-block w-1.5 h-4 ml-1 bg-sky-400 animate-pulse align-middle" />}
              </div>
            </div>

            {/* Bottom 3 Metrics matching reference */}
            <div className="mt-8 pt-4 border-t border-neutral-800/80 grid grid-cols-3 gap-2">
              <div>
                <span className="block text-[10px] font-mono text-neutral-500 uppercase">
                  First bullet
                </span>
                <span className="text-base font-bold font-mono text-white">84 ms</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-neutral-500 uppercase">
                  Throughput
                </span>
                <span className="text-base font-bold font-mono text-white">14 bullets/s</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-neutral-500 uppercase">
                  Cost
                </span>
                <span className="text-base font-bold font-mono text-emerald-400">$0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
