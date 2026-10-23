"use client";

import React from "react";
import RotatingText from "@/components/ui/RotatingText";

export function DesignStatementSection() {
  return (
    <section className="py-24 px-6 text-center bg-[#09090b] relative z-10 border-t border-neutral-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-neutral-400 leading-snug">
          <span className="inline-block bg-[#5473D1] text-white px-5 py-1 rounded-2xl font-extrabold mr-3 align-middle shadow-lg shadow-blue-500/25">
            Create
          </span>
          meaningful digital experiences where every line unfolds with{" "}
          <RotatingText
            texts={["purpose,", "precision,", "vision,", "structure,"]}
            color="#ffffff"
            badgeBackground="#18181b"
            badgeRadius={14}
            badgePaddingX={18}
            badgePaddingY={4}
            gap={8}
            font={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.8vw, 3.2rem)",
              letterSpacing: "-0.03em",
              color: "#ffffff",
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
