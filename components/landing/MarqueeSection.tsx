"use client";

import React from "react";

export function MarqueeSection() {
  const logos = [
    { name: "OpenAI", font: "font-serif tracking-wider font-semibold" },
    { name: "granola", font: "font-mono font-medium lowercase" },
    { name: "character.ai", font: "font-sans font-bold" },
    { name: "hellopatient", font: "font-serif italic" },
    { name: "Portola™", font: "font-mono font-semibold" },
    { name: "ORACLE", font: "font-sans tracking-widest font-black" },
    { name: "GitHub", font: "font-sans font-bold tracking-tight" },
    { name: "Vercel", font: "font-sans font-medium tracking-wide" },
    { name: "Supabase", font: "font-mono font-bold" },
    { name: "Stripe", font: "font-serif font-bold" },
  ];

  const duplicated = [...logos, ...logos, ...logos];

  return (
    <section className="relative bg-[#09090b] py-16 overflow-hidden border-b border-neutral-900">
      <div className="mx-auto max-w-7xl px-6 mb-8 text-center">
        <p className="text-xs sm:text-sm text-neutral-400">
          Serving developers shipping code at
        </p>
      </div>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <div className="flex w-max animate-[scroll_35s_linear_infinite] hover:[animation-play-state:paused] items-center gap-14 py-2">
          {duplicated.map((item, idx) => (
            <div
              key={idx}
              className={`text-xl sm:text-2xl text-neutral-400/70 hover:text-white transition-colors duration-200 select-none ${item.font}`}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
