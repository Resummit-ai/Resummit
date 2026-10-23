"use client";

import React, { useState } from "react";
import { Play, RotateCcw, CheckCircle2 } from "lucide-react";

export function EditorDemoSection() {
  const [activeTab, setActiveTab] = useState<"commits.log" | "README.md" | "resume.json">("commits.log");
  const [isRunning, setIsRunning] = useState(false);
  const [outputBullet, setOutputBullet] = useState(
    "Engineered high-throughput event processing pipeline with Kafka and Go, reducing queue backlog latency by 78% during peak surges."
  );

  const fileContents = {
    "commits.log": [
      "commit 9b2d8e4 (HEAD -> main)",
      "Author: developer <dev@resummit.app>",
      "Date:   Thu Oct 23 18:24:10 2026",
      "",
      "    perf: replace synchronous batch loop with parallel worker pool",
      "    - benchmarks indicate latency drop from 450ms -> 98ms",
      "    - resolves issue #142 (peak surge queue backlog)",
    ],
    "README.md": [
      "# Async Event Ingestion Engine",
      "",
      "High-throughput Go service designed to consume and buffer stream events.",
      "Handles up to 50,000 requests/sec with predictable p99 sub-100ms response.",
      "Integrates Prometheus metrics and distributed OpenTelemetry tracing.",
    ],
    "resume.json": [
      "{",
      '  "role": "Distributed Systems Engineer",',
      '  "company": "Core Infrastructure",',
      '  "metrics": {',
      '    "latencyReduction": "78%",',
      '    "throughput": "50k req/sec"',
      "  }",
      "}",
    ],
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutputBullet("");

    const fullText =
      "Engineered high-throughput event processing pipeline with Kafka and Go, reducing queue backlog latency by 78% during peak surges.";

    let i = 0;
    const interval = setInterval(() => {
      setOutputBullet(fullText.slice(0, i));
      i += 3;
      if (i > fullText.length + 3) {
        clearInterval(interval);
        setOutputBullet(fullText);
        setIsRunning(false);
      }
    }, 20);
  };

  return (
    <section className="bg-[rgb(10,10,10)] text-[rgb(242,239,233)] py-24 sm:py-32 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
            Live Demo
          </p>
          <h2 className="mt-3 text-4xl font-medium tracking-tight text-balance sm:text-5xl text-[rgb(242,239,233)]">
            From commit to bullet
          </h2>
          <p className="mt-4 text-base text-[rgba(242,239,233,0.7)]">
            Watch raw project history transform into an executive resume accomplishment.
          </p>
        </div>

        {/* Code Editor Window */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-[rgb(14,14,16)]/90 overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Header Bar */}
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4 bg-white/[0.02]">
            {/* Tabs */}
            <div className="flex items-center gap-1">
              {(["commits.log", "README.md", "resume.json"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-3 py-1 font-mono text-xs transition-colors ${
                    activeTab === tab
                      ? "bg-white/10 text-[rgb(242,239,233)] font-medium"
                      : "text-[rgba(242,239,233,0.5)] hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Run Button */}
            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              {isRunning ? <RotateCcw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 fill-current" />}
              <span>{isRunning ? "Synthesizing..." : "Run Analysis"}</span>
            </button>
          </div>

          {/* Editor Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
            {/* Left Source Code Pane */}
            <div className="lg:col-span-7 border-r border-white/10 p-4 font-mono text-xs leading-relaxed text-[rgba(242,239,233,0.8)] overflow-x-auto">
              {fileContents[activeTab].map((line, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="w-6 shrink-0 text-right text-[rgba(242,239,233,0.3)] select-none">
                    {idx + 1}
                  </span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </div>

            {/* Right Synthesized Result Pane */}
            <div className="lg:col-span-5 p-5 bg-white/[0.01] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[rgba(242,239,233,0.5)]">
                    Synthesized Result
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Recruiter Ready</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm font-sans leading-relaxed text-[rgb(242,239,233)]">
                    {outputBullet}
                    {isRunning && <span className="inline-block w-1.5 h-4 ml-1 bg-blue-500 animate-pulse" />}
                  </p>
                </div>
              </div>

              {/* Metric Chips */}
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                <div className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-[rgba(242,239,233,0.8)] border border-white/10">
                  ATS Score: <span className="font-bold text-emerald-400">92/100</span>
                </div>
                <div className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-[rgba(242,239,233,0.8)] border border-white/10">
                  Target Match: <span className="font-bold text-blue-400">96%</span>
                </div>
                <div className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-[rgba(242,239,233,0.8)] border border-white/10">
                  Generated in: <span className="font-bold text-amber-400">1.2s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
