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
    <section id="faq" className="bg-[rgb(10,10,10)] text-[rgb(242,239,233)] py-24 sm:py-32 border-t border-white/10">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
            Questions & Answers
          </p>
          <h2 className="mt-3 text-4xl font-medium tracking-tight text-balance sm:text-5xl text-[rgb(242,239,233)]">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base text-[rgba(242,239,233,0.7)]">
            Transparent answers about privacy, GitHub integration, and resume ownership.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-14 space-y-4">
          {LANDING_CONFIG.faq.map((item, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-medium text-[rgb(242,239,233)] hover:text-white"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 text-[rgba(242,239,233,0.5)] ${
                      isOpen ? "rotate-180 text-blue-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[rgba(242,239,233,0.7)] leading-relaxed border-t border-white/5 pt-3">
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
