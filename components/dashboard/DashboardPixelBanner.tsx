"use client";

import React from "react";

interface DashboardPixelBannerProps {
  children?: React.ReactNode;
}

export function DashboardPixelBanner({ children }: DashboardPixelBannerProps) {
  return (
    <div className="mb-10 relative rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-white/10 shadow-2xl min-h-[440px] flex items-center justify-center p-4 sm:p-8 md:p-10 transition-all duration-300">
      {/* Pixel Sky Art Background matching landing page pipeline */}
      <img
        src="/images/fairweather_sky.jpg"
        alt="Pixel art clouds and sky"
        className="absolute inset-0 h-full w-full object-cover object-center scale-105 select-none pointer-events-none"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/40 pointer-events-none" />

      {/* Floating Card on top of Pixel Sky Graphics */}
      <div className="relative z-10 w-full max-w-2xl">
        {children}
      </div>
    </div>
  );
}
