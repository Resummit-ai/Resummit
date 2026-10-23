"use client";

import React, { useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";

export function RoleVersionsSection() {
  const roles = [
    {
      id: "frontend",
      title: "Frontend Engineer",
      match: "94%",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Web Performance"],
      missingSkills: [
        { skill: "GraphQL", inCv: false, suggestion: "Add GitHub PR #34 query caching example" },
        { skill: "Cypress E2E", inCv: false, suggestion: "Highlight playwright automated test suite" },
        { skill: "Next.js App Router", inCv: true, suggestion: "Present in master resume profile" },
      ],
    },
    {
      id: "backend",
      title: "Backend Engineer",
      match: "88%",
      skills: ["Node.js", "PostgreSQL", "Go", "Docker", "Redis"],
      missingSkills: [
        { skill: "Kubernetes", inCv: false, suggestion: "Connect homelab k3s deployment manifest repo" },
        { skill: "gRPC", inCv: true, suggestion: "Present in microservices commit log" },
        { skill: "Kafka Streaming", inCv: false, suggestion: "Mention async webhook message queue" },
      ],
    },
    {
      id: "ai",
      title: "AI & ML Engineer",
      match: "82%",
      skills: ["Python", "PyTorch", "Hugging Face", "Vector DBs", "RAG"],
      missingSkills: [
        { skill: "LangChain / LlamaIndex", inCv: true, suggestion: "Highlight LLM document search project" },
        { skill: "vLLM / TensorRT", inCv: false, suggestion: "Extract GPU batch benchmark from README" },
        { skill: "Eval Metrics (ROUGE)", inCv: false, suggestion: "Include prompt tuning evaluation test results" },
      ],
    },
    {
      id: "data",
      title: "Data Engineer",
      match: "79%",
      skills: ["SQL", "dbt", "Apache Spark", "Airflow", "Snowflake"],
      missingSkills: [
        { skill: "Apache Airflow", inCv: false, suggestion: "Sync automated ETL cron workflow repository" },
        { skill: "dbt transformations", inCv: true, suggestion: "Present in analytics modeling pipeline" },
        { skill: "Delta Lake", inCv: false, suggestion: "Document parquet storage format optimizations" },
      ],
    },
  ];

  const [selectedRole, setSelectedRole] = useState(roles[0]);

  return (
    <section className="bg-[rgb(10,10,10)] text-[rgb(242,239,233)] py-24 sm:py-32 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
            Role Targeting
          </p>
          <h2 className="mt-3 text-4xl font-medium tracking-tight text-balance sm:text-5xl text-[rgb(242,239,233)]">
            One CV per job
          </h2>
          <p className="mt-4 text-base text-[rgba(242,239,233,0.7)]">
            Select a target profile to view real-time skill matching and gap recommendations.
          </p>
        </div>

        {/* Roles & Audit Split */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Role Selection Cards */}
          <div className="lg:col-span-5 space-y-3">
            {roles.map((role) => {
              const isSelected = selectedRole.id === role.id;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/[0.08] shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[rgb(242,239,233)]">{role.title}</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
                      {role.match} match
                    </span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {role.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded bg-white/5 px-2 py-0.5 text-[11px] text-[rgba(242,239,233,0.6)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Skill Gap Audit Panel */}
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-semibold text-[rgb(242,239,233)]">
                  Missing Skills Gap Analysis
                </h3>
                <p className="text-xs text-[rgba(242,239,233,0.5)]">
                  Target Role: {selectedRole.title}
                </p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-[rgba(242,239,233,0.8)]">
                {selectedRole.missingSkills.filter((s) => !s.inCv).length} gaps found
              </span>
            </div>

            {/* Gap Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[rgba(242,239,233,0.5)] font-mono uppercase">
                    <th className="pb-3 font-medium">Skill</th>
                    <th className="pb-3 font-medium">In your CV?</th>
                    <th className="pb-3 font-medium">Suggestion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {selectedRole.missingSkills.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 font-medium text-[rgb(242,239,233)]">{row.skill}</td>
                      <td className="py-3.5">
                        {row.inCv ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                            <Check className="h-3 w-3" /> Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-400">
                            <X className="h-3 w-3" /> Missing
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-[rgba(242,239,233,0.7)]">{row.suggestion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-400">
              <span>Automatic tailoring addresses identified gaps</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
