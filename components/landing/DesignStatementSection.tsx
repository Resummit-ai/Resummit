"use client";

import React from "react";
import RotatingText from "@/components/ui/RotatingText";

export function DesignStatementSection() {
  return (
    <section className="py-24 px-6 text-center bg-[#0a0a0a] relative z-10 border-t border-[#27272a]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#f2efe9]/70 leading-snug">
          <span className="inline-block bg-[#5473D1] text-white px-5 py-1 rounded-2xl font-semibold mr-3 align-middle shadow-lg shadow-blue-500/25">
            Create
          </span>
          meaningful digital experiences where every line unfolds with{" "}
          <RotatingText
            texts={["purpose,", "precision,", "vision,", "structure,"]}
            color="#f2efe9"
            badgeBackground="#1c1d22"
            badgeRadius={14}
            badgePaddingX={18}
            badgePaddingY={4}
            gap={8}
            font={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(1.8rem, 3.8vw, 3.2rem)",
              letterSpacing: "-0.03em",
              color: "#f2efe9",
              display: "inline-flex",
              verticalAlign: "middle",
            }}
          />
          {" "}clarity, and a touch of motion.
        </h2>
      </div>
    </section>
  );
}
