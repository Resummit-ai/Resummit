"use client";

import React from "react";

interface DashboardPixelBannerProps {
  children?: React.ReactNode;
}

export function DashboardPixelBanner({ children }: DashboardPixelBannerProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-white/10 shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 transition-all duration-300">
      {/* Pixel Sky Art Background matching landing page pipeline */}
      <img
        src="/images/fairweather_sky.jpg"
        alt="Pixel art clouds and sky"
        className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Atmospheric vignette & gradient overlay for rich contrast and readable cards */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/45 pointer-events-none" />

      {/* All Dashboard Cards floating on top of the Pixel Sky Backdrop */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
