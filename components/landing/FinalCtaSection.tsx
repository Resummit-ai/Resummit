"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function FinalCtaSection() {
  return (
    <section className="bg-[#09090b] text-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Mountain Landscape Banner matching reference final CTA */}
        <div className="relative rounded-3xl overflow-hidden border border-neutral-800/80 shadow-2xl min-h-[300px] sm:min-h-[360px] p-8 sm:p-14 flex flex-col justify-end">
          {/* Background Mountain Sky Image */}
          <img
            src="/images/fairweather_sky.jpg"
            alt="Mountain ridge landscape"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal sm:font-medium tracking-tight text-white leading-[1.08]">
                Ready to build the CV your commits deserve?
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                href={LANDING_CONFIG.brand.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-200 shadow-xl"
              >
                <span>{LANDING_CONFIG.brand.primaryCta.label}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center rounded-full border border-neutral-700 bg-black/60 backdrop-blur-md px-6 py-3 text-sm font-medium text-white transition-all hover:bg-black/80 hover:border-neutral-600 shadow-sm"
              >
                See pricing
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
