"use client";

import React, { useState } from "react";
import { Check, Sparkles, FileText, Target, Award, RefreshCw, Zap } from "lucide-react";

export function WorkflowCanvas() {
  const [connectedNodes, setConnectedNodes] = useState<Record<string, boolean>>({
    node1: true,
    node2: false,
    node3: false,
    node4: false,
  });

  const inputNodes = [
    { id: "node1", label: "Master CV", desc: "Profile & Git History", icon: <FileText className="h-4 w-4" /> },
    { id: "node2", label: "Job Description", desc: "Requirements & Keywords", icon: <Target className="h-4 w-4" /> },
    { id: "node3", label: "Target Role", desc: "Senior Backend / ML", icon: <Award className="h-4 w-4" /> },
    { id: "node4", label: "Skills to Emphasize", desc: "Go, Kubernetes, Redis", icon: <Sparkles className="h-4 w-4" /> },
  ];

  const toggleNode = (id: string) => {
    setConnectedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const connectAll = () => {
    setConnectedNodes({
      node1: true,
      node2: true,
      node3: true,
      node4: true,
    });
  };

  const resetAll = () => {
    setConnectedNodes({
      node1: false,
      node2: false,
      node3: false,
      node4: false,
    });
  };

  const connectedCount = Object.values(connectedNodes).filter(Boolean).length;
  const isAllConnected = connectedCount === 4;

  return (
    <section className="bg-[rgb(10,10,10)] text-[rgb(242,239,233)] py-24 sm:py-32 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
              Interactive Engine
            </p>
            <h2 className="mt-3 text-4xl font-medium tracking-tight text-balance sm:text-5xl text-[rgb(242,239,233)]">
              Tailor a CV in a minute
            </h2>
            <p className="mt-4 text-base text-[rgba(242,239,233,0.7)]">
              Combine your Master profile with job requirements. Tap or click inputs to wire the connection.
            </p>
          </div>

          {/* Action buttons and status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-xs font-mono text-[rgba(242,239,233,0.6)]">
              {connectedCount} of 4 connected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={connectAll}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-[rgb(242,239,233)] hover:bg-white/15 transition-colors"
              >
                <Zap className="h-3 w-3 text-amber-400" />
                <span>Connect all</span>
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-[rgba(242,239,233,0.6)] hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Workflow Node Graph */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-10 backdrop-blur-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: 4 Input Nodes */}
            <div className="lg:col-span-5 space-y-4">
              {inputNodes.map((node) => {
                const isConnected = connectedNodes[node.id];

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => toggleNode(node.id)}
                    className={`w-full flex items-center justify-between rounded-xl border p-4 transition-all text-left ${
                      isConnected
                        ? "border-blue-500/40 bg-blue-500/[0.08] shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isConnected
                            ? "bg-blue-500 text-white"
                            : "bg-white/5 text-[rgba(242,239,233,0.5)]"
                        }`}
                      >
                        {node.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[rgb(242,239,233)]">{node.label}</p>
                        <p className="text-xs text-[rgba(242,239,233,0.5)]">{node.desc}</p>
                      </div>
                    </div>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                        isConnected
                          ? "border-blue-400 bg-blue-500 text-white"
                          : "border-white/20 bg-transparent text-transparent"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Middle: SVG Connection Flow Lines */}
            <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
              <svg width="100%" height="280" viewBox="0 0 100 280" className="overflow-visible">
                <path
                  d="M 0 35 C 50 35, 50 140, 100 140"
                  fill="none"
                  stroke={connectedNodes.node1 ? "#2563eb" : "rgba(255,255,255,0.1)"}
                  strokeWidth="2"
                  strokeDasharray={connectedNodes.node1 ? "4,4" : "none"}
                  className={connectedNodes.node1 ? "animate-[scroll_20s_linear_infinite]" : ""}
                />
                <path
                  d="M 0 105 C 50 105, 50 140, 100 140"
                  fill="none"
                  stroke={connectedNodes.node2 ? "#2563eb" : "rgba(255,255,255,0.1)"}
                  strokeWidth="2"
                  strokeDasharray={connectedNodes.node2 ? "4,4" : "none"}
                  className={connectedNodes.node2 ? "animate-[scroll_20s_linear_infinite]" : ""}
                />
                <path
                  d="M 0 175 C 50 175, 50 140, 100 140"
                  fill="none"
                  stroke={connectedNodes.node3 ? "#2563eb" : "rgba(255,255,255,0.1)"}
                  strokeWidth="2"
                  strokeDasharray={connectedNodes.node3 ? "4,4" : "none"}
                  className={connectedNodes.node3 ? "animate-[scroll_20s_linear_infinite]" : ""}
                />
                <path
                  d="M 0 245 C 50 245, 50 140, 100 140"
                  fill="none"
                  stroke={connectedNodes.node4 ? "#2563eb" : "rgba(255,255,255,0.1)"}
                  strokeWidth="2"
                  strokeDasharray={connectedNodes.node4 ? "4,4" : "none"}
                  className={connectedNodes.node4 ? "animate-[scroll_20s_linear_infinite]" : ""}
                />
              </svg>
            </div>

            {/* Right Column: Output Node "Tailored CV" */}
            <div className="lg:col-span-5">
              <div
                className={`rounded-2xl border p-6 transition-all ${
                  isAllConnected
                    ? "border-emerald-500/50 bg-emerald-500/[0.05] shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        isAllConnected ? "bg-emerald-500 text-white" : "bg-white/10 text-white/50"
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="font-semibold text-base text-[rgb(242,239,233)]">Tailored CV Output</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isAllConnected
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/10 text-[rgba(242,239,233,0.5)]"
                    }`}
                  >
                    {isAllConnected ? "Synthesized" : "Waiting for all nodes"}
                  </span>
                </div>

                {/* Synthesis summary cards */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-black/40 p-3 border border-white/5 text-xs">
                    <span className="text-[rgba(242,239,233,0.6)]">ATS Match Rating</span>
                    <span
                      className={`font-mono font-bold ${
                        isAllConnected ? "text-emerald-400" : "text-[rgba(242,239,233,0.4)]"
                      }`}
                    >
                      {isAllConnected ? "92%" : "Pending..."}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-black/40 p-3 border border-white/5 text-xs">
                    <span className="text-[rgba(242,239,233,0.6)]">PDF Single-Page Export</span>
                    <span
                      className={`font-medium ${
                        isAllConnected ? "text-emerald-400" : "text-[rgba(242,239,233,0.4)]"
                      }`}
                    >
                      {isAllConnected ? "Ready" : "Waiting"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-black/40 p-3 border border-white/5 text-xs">
                    <span className="text-[rgba(242,239,233,0.6)]">Identified Missing Skills</span>
                    <span className="font-mono text-amber-400">
                      {isAllConnected ? "2 suggestions" : "Pending"}
                    </span>
                  </div>

                  <div className="rounded-lg bg-blue-500/[0.06] p-3 border border-blue-500/20 text-xs">
                    <p className="font-medium text-blue-400">Cover Letter Align Hint</p>
                    <p className="mt-1 text-[11px] text-[rgba(242,239,233,0.7)]">
                      {isAllConnected
                        ? "Generated 3 talking points emphasizing your distributed backend experience."
                        : "Connect all nodes to activate."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
