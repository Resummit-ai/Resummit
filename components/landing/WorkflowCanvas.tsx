"use client";

import React, { useState } from "react";
import {
  FileCode2,
  Cpu,
  Globe2,
  MessageSquareCode,
  FileText,
  Bot,
  Sparkles,
  BellRing,
  Check,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

export function WorkflowCanvas() {
  const [connectedNodes, setConnectedNodes] = useState<Record<string, boolean>>({
    repos: true,
    commits: true,
    roles: false,
    rules: false,
  });

  const toggleNode = (id: string) => {
    setConnectedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const connectAll = () => {
    setConnectedNodes({
      repos: true,
      commits: true,
      roles: true,
      rules: true,
    });
  };

  const resetAll = () => {
    setConnectedNodes({
      repos: false,
      commits: false,
      roles: false,
      rules: false,
    });
  };

  const connectedCount = Object.values(connectedNodes).filter(Boolean).length;

  return (
    <section id="workflow" className="scroll-mt-12 bg-[#09090b] text-white py-24 sm:py-32 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-normal sm:font-medium tracking-tight text-white sm:text-5xl leading-[1.15]">
              Wire up your resume in a minute
            </h2>
            <p className="mt-4 text-base text-neutral-400">
              Connect repositories, commit history, target roles, and rewrite formulas. Resummit turns the graph into an interview-ready resume.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetAll}
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors px-2 py-1"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={connectAll}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <Zap className="h-3 w-3 text-amber-400" />
              <span>Connect all</span>
            </button>
          </div>
        </div>

        {/* Workflow Node Canvas with Subtle Grid & Animated Connecting Beams */}
        <div className="mt-12 relative rounded-3xl border border-white/10 bg-[#0c0c0e] p-6 sm:p-10 overflow-hidden shadow-2xl">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Animated SVG Beams in background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block opacity-40">
            {connectedNodes.repos && (
              <motion.path
                d="M 340 100 C 450 100, 430 220, 500 220"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ strokeDashoffset: 50 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
            {connectedNodes.commits && (
              <motion.path
                d="M 340 210 C 440 210, 440 250, 500 250"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ strokeDashoffset: 50 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
            {connectedNodes.roles && (
              <motion.path
                d="M 340 320 C 440 320, 440 280, 500 280"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ strokeDashoffset: 50 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
            {connectedNodes.rules && (
              <motion.path
                d="M 340 430 C 450 430, 430 310, 500 310"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ strokeDashoffset: 50 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </svg>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: 4 Source Nodes */}
            <div className="lg:col-span-4 space-y-4">
              {/* Node 1: GitHub Repos */}
              <div
                onClick={() => toggleNode("repos")}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 select-none ${
                  connectedNodes.repos
                    ? "border-amber-500/50 bg-[#141417] shadow-[0_0_20px_rgba(245,158,11,0.12)] scale-[1.01]"
                    : "border-neutral-800 bg-[#121215] opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileCode2 className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-semibold text-white">GitHub Repos</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">::</span>
                </div>
                <div className="mt-2 text-xs text-neutral-300 font-mono">
                  github.com/developer/core
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  12 repositories · 1,420 commits
                </div>
                <div className="mt-3 flex items-center justify-end gap-1.5">
                  <span className="text-[10px] font-mono text-neutral-400">repos</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      connectedNodes.repos ? "bg-amber-400 shadow-[0_0_8px_#f59e0b]" : "bg-neutral-600"
                    }`}
                  />
                </div>
              </div>

              {/* Node 2: Commits & Diffs */}
              <div
                onClick={() => toggleNode("commits")}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 select-none ${
                  connectedNodes.commits
                    ? "border-blue-500/50 bg-[#141417] shadow-[0_0_20px_rgba(59,130,246,0.12)] scale-[1.01]"
                    : "border-neutral-800 bg-[#121215] opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-semibold text-white">Key PRs & Diffs</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">::</span>
                </div>
                <div className="mt-2 text-xs text-neutral-300 font-mono">
                  89 merged PRs · Releases
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Benchmarks, schema refactors, latency cuts
                </div>
                <div className="mt-3 flex items-center justify-end gap-1.5">
                  <span className="text-[10px] font-mono text-neutral-400">diffs</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      connectedNodes.commits ? "bg-blue-400 shadow-[0_0_8px_#3b82f6]" : "bg-neutral-600"
                    }`}
                  />
                </div>
              </div>

              {/* Node 3: Target Role */}
              <div
                onClick={() => toggleNode("roles")}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 select-none ${
                  connectedNodes.roles
                    ? "border-emerald-500/50 bg-[#141417] shadow-[0_0_20px_rgba(16,185,129,0.12)] scale-[1.01]"
                    : "border-neutral-800 bg-[#121215] opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Globe2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">Target Roles</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">::</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-300">
                    Full-Stack
                  </span>
                  <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-300">
                    Backend Eng
                  </span>
                  <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-300">
                    AI/ML
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-end gap-1.5">
                  <span className="text-[10px] font-mono text-neutral-400">roles</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      connectedNodes.roles ? "bg-emerald-400 shadow-[0_0_8px_#10b981]" : "bg-neutral-600"
                    }`}
                  />
                </div>
              </div>

              {/* Node 4: ATS Rules */}
              <div
                onClick={() => toggleNode("rules")}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 select-none ${
                  connectedNodes.rules
                    ? "border-purple-500/50 bg-[#141417] shadow-[0_0_20px_rgba(168,85,247,0.12)] scale-[1.01]"
                    : "border-neutral-800 bg-[#121215] opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MessageSquareCode className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-semibold text-white">XYZ Formula Rules</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">::</span>
                </div>
                <div className="mt-2 text-xs text-neutral-400 leading-snug">
                  Accomplished [X] as measured by [Y] by doing [Z].
                </div>
                <div className="mt-3 flex items-center justify-end gap-1.5">
                  <span className="text-[10px] font-mono text-neutral-400">formula</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      connectedNodes.rules ? "bg-purple-400 shadow-[0_0_8px_#a855f7]" : "bg-neutral-600"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Center Column: Primary Endpoint Node */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-neutral-700 bg-[#16161a] p-5 shadow-2xl relative">
                {/* Node Title */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-white">Pipeline</span>
                    <span className="font-mono text-[11px] text-neutral-400">cv-synthesizer</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">::</span>
                </div>

                {/* Ports / Checklist inside center node */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          connectedNodes.repos ? "bg-amber-400" : "bg-neutral-600"
                        }`}
                      />
                      <span className="text-neutral-200">Repository metadata</span>
                    </div>
                    {connectedNodes.repos && <Check className="h-3.5 w-3.5 text-amber-400" />}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          connectedNodes.commits ? "bg-blue-400" : "bg-neutral-600"
                        }`}
                      />
                      <span className="text-neutral-200">Commit metrics</span>
                    </div>
                    {connectedNodes.commits && <Check className="h-3.5 w-3.5 text-blue-400" />}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          connectedNodes.roles ? "bg-emerald-400" : "bg-neutral-600"
                        }`}
                      />
                      <span className="text-neutral-200">Target role weighting</span>
                    </div>
                    {connectedNodes.roles && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          connectedNodes.rules ? "bg-purple-400" : "bg-neutral-600"
                        }`}
                      />
                      <span className="text-neutral-200">ATS formatting schema</span>
                    </div>
                    {connectedNodes.rules && <Check className="h-3.5 w-3.5 text-purple-400" />}
                  </div>
                </div>

                {/* Output ports on the right */}
                <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">
                    {connectedCount === 4
                      ? "• Ready to export (4/4)"
                      : `• Awaiting inputs · ${connectedCount}/4`}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-mono text-neutral-300">live</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 4 Target Output Nodes */}
            <div className="lg:col-span-4 space-y-4">
              {/* Output 1: Single-page PDF */}
              <div className="rounded-2xl border border-neutral-800 bg-[#121215] p-4 opacity-90 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sky-400" />
                    <span className="text-xs font-semibold text-white">Single-Page PDF</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">::</span>
                </div>
                <div className="mt-1 text-xs text-neutral-400">
                  {connectedCount >= 2
                    ? "✓ Formatted with 14 bullets"
                    : "• Waiting for pipeline inputs"}
                </div>
              </div>

              {/* Output 2: ATS Scanner Score */}
              <div className="rounded-2xl border border-neutral-800 bg-[#121215] p-4 opacity-90 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">ATS Scanner Score</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">::</span>
                </div>
                <div className="mt-1 text-xs text-neutral-400">
                  {connectedCount >= 3
                    ? "✓ 98/100 score on Greenhouse"
                    : "• Waiting for pipeline inputs"}
                </div>
              </div>

              {/* Output 3: Webhook Auto-Updates */}
              <div className="rounded-2xl border border-neutral-800 bg-[#121215] p-4 opacity-90 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-semibold text-white">GitHub Webhook</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">::</span>
                </div>
                <div className="mt-1 text-xs text-neutral-400">
                  {connectedCount === 4
                    ? "✓ Auto-updating on every push"
                    : "• Waiting for pipeline inputs"}
                </div>
              </div>

              {/* Output 4: Portfolio Markdown */}
              <div className="rounded-2xl border border-neutral-800 bg-[#121215] p-4 opacity-90 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-semibold text-white">Portfolio Markdown</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">::</span>
                </div>
                <div className="mt-1 text-xs text-neutral-400">
                  {connectedCount >= 2
                    ? "✓ Syncs to personal website"
                    : "• Waiting for pipeline inputs"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
