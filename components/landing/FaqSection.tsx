"use client";

import React, { useState } from "react";
import { LANDING_CONFIG } from "@/lib/landing-config";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="scroll-mt-12 bg-[#09090b] text-white py-24 sm:py-32 border-t border-neutral-900">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-normal sm:font-medium tracking-tight text-white sm:text-5xl leading-[1.15]">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            Clear, transparent answers about code privacy, GitHub permissions, and ATS compliance.
          </p>
        </div>

        {/* Accordion List matching dark clean reference */}
        <div className="mt-14 space-y-3">
          {LANDING_CONFIG.faq.map((item, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-800/80 bg-[#111114] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-medium text-neutral-200 hover:text-white"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 text-neutral-400 ${
                      isOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/50 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
