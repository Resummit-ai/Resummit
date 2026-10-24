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
    <section
      id="faq"
      className="scroll-mt-12 bg-[#F5F5F3] dark:bg-[#09090b] text-[#171717] dark:text-white py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-neutral-900 transition-colors duration-300"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold sm:font-bold tracking-tight text-[#171717] dark:text-white sm:text-5xl leading-[1.15]">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400 font-normal">
            Clear, transparent answers about code privacy, GitHub permissions, and ATS compliance.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-14 space-y-3">
          {LANDING_CONFIG.faq.map((item, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E5E5E5] dark:border-neutral-800/80 bg-white dark:bg-[#111114] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-[#171717] dark:text-neutral-200 hover:text-blue-600 dark:hover:text-white transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 text-[#707070] dark:text-neutral-400 ${
                      isOpen ? "rotate-180 text-blue-600 dark:text-white" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed border-t border-[#E5E5E5] dark:border-neutral-800/50 pt-3 font-normal">
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
