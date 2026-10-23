"use client";

import React from "react";
import { FileText, FileCode } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

export function MarqueeSection() {
  const items = [
    { label: "GitHub", icon: <GithubIcon className="h-4 w-4" /> },
    {
      label: "LinkedIn",
      icon: <LinkedinIcon className="h-4 w-4 text-[#0a66c2]" />,
      badge: "Coming soon",
    },
    { label: "PDF Export", icon: <FileText className="h-4 w-4 text-emerald-400" /> },
    { label: "Word (.docx)", icon: <FileCode className="h-4 w-4 text-blue-400" /> },
    { label: "JSON Resume", icon: <FileCode className="h-4 w-4 text-amber-400" /> },
  ];

  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <section className="relative border-y border-white/10 bg-[rgb(10,10,10)] py-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-[rgba(242,239,233,0.5)]">
          Works with the developer toolchain
        </p>
      </div>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused] gap-8 py-2">
          {duplicatedItems.map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm text-[rgb(242,239,233)] shadow-sm backdrop-blur-sm"
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-[rgba(242,239,233,0.6)]">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
