"use client";

import React, { useState, useEffect } from "react";
import RotatingText from "@/components/ui/RotatingText";

export function DesignStatementSection() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 px-6 text-center bg-[#F5F5F3] dark:bg-[#0a0a0a] relative z-10 border-t border-[#E5E5E5] dark:border-[#27272a] transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold sm:font-medium tracking-tight text-[#171717]/80 dark:text-[#f2efe9]/70 leading-snug">
          <span className="inline-block bg-[#245DFF] dark:bg-[#5473D1] text-white px-5 py-1 rounded-2xl font-semibold mr-3 align-middle shadow-lg shadow-blue-500/25">
            Turn
          </span>
          the code you already wrote into a resume{" "}
          <RotatingText
            texts={["recruiters", "interviewers", "hiring teams", "recruiters"]}
            color={theme === "light" ? "#171717" : "#f2efe9"}
            badgeBackground={theme === "light" ? "#ffffff" : "#1c1d22"}
            badgeRadius={14}
            badgePaddingX={18}
            badgePaddingY={4}
            gap={8}
            font={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(1.8rem, 3.8vw, 3.2rem)",
              letterSpacing: "-0.03em",
              color: theme === "light" ? "#171717" : "#f2efe9",
              display: "inline-flex",
              verticalAlign: "middle",
            }}
          />
          {" "}can read.
        </h2>
      </div>
    </section>
  );
}
