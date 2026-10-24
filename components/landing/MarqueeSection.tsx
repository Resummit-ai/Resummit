"use client";

import React from "react";

export function MarqueeSection() {
  const logos = [
    { name: "GitHub", font: "font-sans font-bold tracking-tight" },
    { name: "Vercel", font: "font-sans font-medium tracking-wide" },
    { name: "OpenAI", font: "font-serif tracking-wider font-semibold" },
    { name: "Supabase", font: "font-mono font-bold" },
    { name: "Stripe", font: "font-serif font-bold" },
    { name: "AWS", font: "font-sans font-black tracking-widest" },
    { name: "Docker", font: "font-mono font-semibold" },
    { name: "Linear", font: "font-sans font-semibold tracking-tight" },
    { name: "Next.js", font: "font-sans font-bold tracking-tight" },
    { name: "PostgreSQL", font: "font-mono font-bold tracking-tight" },
  ];

  const duplicated = [...logos, ...logos, ...logos];

  return (
    <section className="relative bg-[#F5F5F3] dark:bg-[#09090b] py-16 overflow-hidden border-b border-[#E5E5E5] dark:border-neutral-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 mb-8 text-center">
        <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 tracking-wider uppercase">
          Built for developers and students
        </p>
      </div>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <div className="flex w-max animate-[scroll_35s_linear_infinite] hover:[animation-play-state:paused] items-center gap-14 py-2">
          {duplicated.map((item, idx) => (
            <div
              key={idx}
              className={`text-xl sm:text-2xl text-neutral-700/80 hover:text-black dark:text-neutral-400/80 dark:hover:text-white transition-colors duration-200 select-none ${item.font}`}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
