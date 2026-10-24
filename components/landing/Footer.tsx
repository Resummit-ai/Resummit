"use client";

import React from "react";
import Link from "next/link";
import { LANDING_CONFIG } from "@/lib/landing-config";
import { GithubIcon, LinkedinIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="bg-[#F5F5F3] dark:bg-[#09090b] text-[#171717] dark:text-white pt-16 pb-12 border-t border-[#E5E5E5] dark:border-neutral-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column with Official Logo */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group transition-opacity hover:opacity-95"
            >
              <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7 6C7 4.34315 8.34315 3 10 3H19L25 9V26C25 27.6569 23.6569 29 22 29H10C8.34315 29 7 27.6569 7 26V6Z"
                  className="fill-blue-500/15 stroke-blue-600 dark:stroke-blue-500"
                  strokeWidth="2"
                />
                <path d="M19 3V9H25L19 3Z" className="fill-blue-600 dark:fill-blue-500 stroke-blue-600 dark:stroke-blue-500" strokeWidth="1.5" />
                <path
                  d="M11 13H17M11 17H21M11 21H18M11 25H20"
                  className="stroke-blue-500 dark:stroke-blue-400"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M20 8.5L25 3.5" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" strokeLinecap="round" />
                <path d="M25 3.5L27 6.5L23.5 5.5Z" className="fill-blue-500 dark:fill-blue-400" />
              </svg>
              <div className="flex flex-col text-left">
                <span className="font-extrabold tracking-tight text-[#171717] dark:text-white text-sm leading-none font-sans">
                  RESUMMIT
                </span>
                <span className="text-[9px] tracking-wider text-[#707070] dark:text-neutral-400 font-mono font-medium leading-tight mt-0.5">
                  YOUR COMMITS. YOUR CAREER.
                </span>
              </div>
            </Link>
            <p className="max-w-sm text-xs sm:text-sm text-[#707070] dark:text-neutral-400 leading-relaxed">
              Connect GitHub, paste a job description, and tailor your CV in seconds. Designed and built by{" "}
              <span className="text-[#171717] dark:text-white font-medium">Adel Muhammed</span>.
            </p>
          </div>

          {/* 3 Navigation Columns */}
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            {/* Product */}
            <div>
              <p className="text-xs font-bold text-[#171717] dark:text-white tracking-wider">Product</p>
              <ul className="mt-4 space-y-3 text-xs text-[#707070] dark:text-neutral-400">
                <li>
                  <a href="#features" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                    Core Features
                  </a>
                </li>
                <li>
                  <a href="#pipeline" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                    One CV Per Job
                  </a>
                </li>
                <li>
                  <a href="#preview-resume" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                    Sample Resume
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <p className="text-xs font-bold text-[#171717] dark:text-white tracking-wider">Developers</p>
              <ul className="mt-4 space-y-3 text-xs text-[#707070] dark:text-neutral-400">
                <li>
                  <Link href="/login" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                    Connect GitHub
                  </Link>
                </li>
                <li>
                  <a href="https://github.com/dragon486/Resummit" target="_blank" rel="noreferrer" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                    GitHub Repo
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-bold text-[#171717] dark:text-white tracking-wider">Company</p>
              <ul className="mt-4 space-y-3 text-xs text-[#707070] dark:text-neutral-400">
                <li>
                  <Link href="/privacy" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="#feedback" className="hover:text-[#171717] dark:hover:text-white transition-colors">
                    Share Feedback
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Status & Copyright Bar */}
        <div className="mt-16 pt-8 border-t border-[#E5E5E5] dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#707070] dark:text-neutral-500">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/dragon486/Resummit"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full hover:text-[#171717] dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/adel-muhammed-71328a2b5"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full hover:text-[#171717] dark:hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            {LANDING_CONFIG.realStats.userCountText && (
              <span>{LANDING_CONFIG.realStats.userCountText}</span>
            )}
            <span>{LANDING_CONFIG.footer.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
