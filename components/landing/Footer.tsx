"use client";

import React from "react";
import Link from "next/link";
import { LANDING_CONFIG } from "@/lib/landing-config";
import { GithubIcon, LinkedinIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="bg-[#09090b] text-white pt-16 pb-12 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-base font-medium text-white tracking-tight"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="text-white">
                <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2L19 8.6v6.8L12 19.4 5 15.4V8.6L12 4.2z" />
              </svg>
              <span className="font-semibold text-lg">{LANDING_CONFIG.brand.name}</span>
            </Link>
            <p className="max-w-sm text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Fast resume generation from your code, built for every developer shipping in public.
            </p>
          </div>

          {/* 3 Navigation Columns */}
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            {/* Product */}
            <div>
              <p className="text-xs font-semibold text-white tracking-wider">Product</p>
              <ul className="mt-4 space-y-3 text-xs text-neutral-400">
                <li>
                  <a href="#pipeline" className="hover:text-white transition-colors">
                    Pipeline
                  </a>
                </li>
                <li>
                  <a href="#workflow" className="hover:text-white transition-colors">
                    Workflow
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-white transition-colors">
                    Role Presets
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <p className="text-xs font-semibold text-white tracking-wider">Developers</p>
              <ul className="mt-4 space-y-3 text-xs text-neutral-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Connect GitHub
                  </Link>
                </li>
                <li>
                  <a href="https://github.com/dragon486/Resummit" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    GitHub Repo
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <span className="inline-flex items-center gap-1.5 text-neutral-500">
                    <span>API</span>
                    <span className="rounded bg-sky-500/20 px-1.5 py-0.2 text-[10px] text-sky-400 font-mono">
                      Soon
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold text-white tracking-wider">Company</p>
              <ul className="mt-4 space-y-3 text-xs text-neutral-400">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/adel-muhammed-71328a2b5" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Status & Copyright Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/dragon486/Resummit"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/adel-muhammed-71328a2b5"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>{LANDING_CONFIG.realStats.bulletsWritten.toLocaleString()} bullets written</span>
            <span>{LANDING_CONFIG.footer.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
