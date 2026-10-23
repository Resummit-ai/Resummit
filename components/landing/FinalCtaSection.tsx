"use client";

import React from "react";
import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[rgb(10,10,10)] text-[rgb(242,239,233)] py-24 sm:py-32 border-t border-white/10">
      {/* Background glow blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl"
      >
        <div className="aspect-[1000/500] w-[60rem] bg-gradient-to-tr from-blue-600/30 to-[rgb(242,239,233)]/10 opacity-30" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl text-[rgb(242,239,233)]">
          Ready to build the CV your commits deserve?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-[rgba(242,239,233,0.7)]">
          Join developers using Resummit to stay interview-ready without rewriting resumes from scratch.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[rgb(242,239,233)] px-6 py-2.5 text-sm font-medium text-neutral-950 transition-all hover:bg-[rgb(242,239,233)]/90 shadow-[0_0_20px_rgba(242,239,233,0.2)]"
          >
            Build my CV free
          </Link>
          <a
            href="#pricing"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white/5 px-6 py-2.5 text-sm font-medium text-[rgb(242,239,233)] inset-ring inset-ring-white/10 hover:bg-white/10"
          >
            See pricing
          </a>
        </div>
      </div>
    </section>
  );
}
