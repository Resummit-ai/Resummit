"use client";

import React from "react";
import Link from "next/link";
import { LANDING_CONFIG } from "@/lib/landing-config";
import { GithubIcon, LinkedinIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[rgb(10,10,10)] text-[rgb(242,239,233)] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-base font-semibold text-[rgb(242,239,233)]">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgb(242,239,233)] text-neutral-950 font-bold text-xs">
                R
              </div>
              <span>{LANDING_CONFIG.brand.name}</span>
            </Link>
            <p className="mt-3 max-w-sm text-xs text-[rgba(242,239,233,0.6)] leading-relaxed">
              GitHub-powered, auto-updating resume builder for software engineers, CS students, and tech professionals.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com/dragon486/Resummit"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[rgba(242,239,233,0.7)] hover:text-white hover:bg-white/10 transition-colors"
                aria-label="GitHub repository"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/adel-muhammed-71328a2b5"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[rgba(242,239,233,0.7)] hover:text-white hover:bg-white/10 transition-colors"
                aria-label="LinkedIn profile"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* 4 Directory Columns */}
          {LANDING_CONFIG.footer.columns.map((col, idx) => (
            <div key={idx} className="col-span-1">
              <p className="text-xs font-semibold tracking-wider text-[rgb(242,239,233)] uppercase">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5 text-xs text-[rgba(242,239,233,0.6)]">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    {link.href.startsWith("/") || link.href.startsWith("#") ? (
                      <Link href={link.href} className="hover:text-[rgb(242,239,233)] transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-[rgb(242,239,233)] transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[rgba(242,239,233,0.5)] gap-4">
          <p>{LANDING_CONFIG.footer.copyright}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[rgb(242,239,233)]">Privacy</Link>
            <Link href="/terms" className="hover:text-[rgb(242,239,233)]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
