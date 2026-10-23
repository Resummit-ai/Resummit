"use client";

import React from "react";
import { GitCommit, Sparkles, RefreshCw, Lock, Zap } from "lucide-react";

export function CommitStreamSection() {
  const commits = [
    {
      hash: "8f3a1c2",
      msg: "perf(cache): migrate session storage to Redis cluster",
      repo: "resummit/api",
      time: "2h ago",
      bullet: "Migrated session caching layer to Redis cluster, slashing median API latency by 42%.",
    },
    {
      hash: "3b91c0e",
      msg: "feat(auth): implement GitHub OAuth2 & JWT session validation",
      repo: "resummit/web",
      time: "4h ago",
      bullet: "Engineered secure GitHub OAuth2 authentication workflow supporting 10,000+ daily sessions.",
    },
    {
      hash: "1d4a9f7",
      msg: "refactor: optimize Postgres connection pool & index queries",
      repo: "resummit/db",
      time: "1d ago",
      bullet: "Optimized relational database queries and connection pooling, reducing 99th percentile query timeouts to 0%.",
    },
  ];

  const features = [
    {
      title: "One-click GitHub sync",
      desc: "Connect your profile in seconds without manual copy-pasting.",
      icon: <Zap className="h-5 w-5 text-blue-400" />,
    },
    {
      title: "Bullets from real commits",
      desc: "Accomplishments grounded in code you actually wrote and shipped.",
      icon: <Sparkles className="h-5 w-5 text-emerald-400" />,
    },
    {
      title: "Your edits are never overwritten",
      desc: "Refine bullets anytime; subsequent syncs preserve your personal wording.",
      icon: <RefreshCw className="h-5 w-5 text-amber-400" />,
    },
    {
      title: "Read-only GitHub access",
      desc: "Strictly read-only OAuth permissions. We never write or commit to your repos.",
      icon: <Lock className="h-5 w-5 text-purple-400" />,
    },
  ];

  return (
    <section className="bg-[rgb(10,10,10)] text-[rgb(242,239,233)] py-24 sm:py-32 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
            Continuous Sync
          </p>
          <h2 className="mt-3 text-4xl font-medium tracking-tight text-balance sm:text-5xl text-[rgb(242,239,233)]">
            Every commit, reflected
          </h2>
          <p className="mt-4 text-base text-[rgba(242,239,233,0.7)]">
            Your git history is converted directly into measurable, ATS-friendly achievement statements.
          </p>
        </div>

        {/* Split Visual: Left commits stream, Right synthesized bullets */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-10 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Commit Stream */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[rgba(242,239,233,0.5)] border-b border-white/10 pb-2">
                <span>RAW GIT COMMITS</span>
                <span>STATUS: PARSED</span>
              </div>
              <div className="space-y-3">
                {commits.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-black/40 p-3.5 font-mono text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[rgba(242,239,233,0.4)] text-[11px]">
                      <span className="flex items-center gap-1.5 text-blue-400">
                        <GitCommit className="h-3.5 w-3.5" />
                        <span>{c.hash}</span>
                      </span>
                      <span>{c.repo}</span>
                    </div>
                    <p className="text-[rgb(242,239,233)] font-sans text-xs">{c.msg}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Synthesized Resume Bullets */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[rgba(242,239,233,0.5)] border-b border-white/10 pb-2">
                <span>ATS-READY BULLETS</span>
                <span>METRICS APPLIED</span>
              </div>
              <div className="space-y-3">
                {commits.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3.5 text-xs text-[rgb(242,239,233)] space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Synthesized Impact</span>
                    </div>
                    <p className="text-[rgba(242,239,233,0.9)] leading-relaxed">{c.bullet}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Rows */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                {feat.icon}
              </div>
              <h3 className="text-base font-semibold text-[rgb(242,239,233)]">{feat.title}</h3>
              <p className="text-xs text-[rgba(242,239,233,0.7)] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
