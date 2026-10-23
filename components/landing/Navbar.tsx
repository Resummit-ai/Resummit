"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LANDING_CONFIG } from "@/lib/landing-config";
import { Menu, X, Sun, Moon, Laptop } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"dark" | "light" | "system">("dark");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cycleTheme = () => {
    const nextTheme = themeMode === "dark" ? "light" : themeMode === "light" ? "system" : "dark";
    setThemeMode(nextTheme);

    const root = document.documentElement;
    if (nextTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else if (nextTheme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#09090b]/85 backdrop-blur-md border-b border-neutral-800/50 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand Logo - Resummit's official document icon + wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-95"
        >
          <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 6C7 4.34315 8.34315 3 10 3H19L25 9V26C25 27.6569 23.6569 29 22 29H10C8.34315 29 7 27.6569 7 26V6Z"
              className="fill-blue-500/15 stroke-blue-500"
              strokeWidth="2"
            />
            <path d="M19 3V9H25L19 3Z" className="fill-blue-500 stroke-blue-500" strokeWidth="1.5" />
            <path
              d="M11 13H17M11 17H21M11 21H18M11 25H20"
              className="stroke-blue-400"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M20 8.5L25 3.5" className="stroke-blue-400" strokeWidth="2" strokeLinecap="round" />
            <path d="M25 3.5L27 6.5L23.5 5.5Z" className="fill-blue-400" />
          </svg>
          <div className="flex flex-col text-left">
            <span className="font-extrabold tracking-tight text-white text-sm leading-none font-sans">
              RESUMMIT
            </span>
            <span className="text-[9px] tracking-wider text-neutral-400 font-mono font-medium leading-tight mt-0.5">
              YOUR COMMITS. YOUR CAREER.
            </span>
          </div>
        </Link>

        {/* Center Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-normal text-neutral-400 transition-colors hover:text-white"
          >
            Features
          </a>
          <a
            href="#pipeline"
            className="text-sm font-normal text-neutral-400 transition-colors hover:text-white"
          >
            Workflow
          </a>
          <a
            href="#preview-resume"
            className="text-sm font-normal text-neutral-400 transition-colors hover:text-white"
          >
            Sample Resume
          </a>
          <a
            href="#pricing"
            className="text-sm font-normal text-neutral-400 transition-colors hover:text-white"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm font-normal text-neutral-400 transition-colors hover:text-white"
          >
            FAQ
          </a>
          <a
            href="#feedback"
            className="text-sm font-normal text-neutral-400 transition-colors hover:text-white"
          >
            Contact
          </a>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-5">
          {/* Theme switcher */}
          <button
            type="button"
            onClick={cycleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:text-white transition-colors"
          >
            {themeMode === "dark" && <Moon className="h-4 w-4" />}
            {themeMode === "light" && <Sun className="h-4 w-4" />}
            {themeMode === "system" && <Laptop className="h-4 w-4" />}
          </button>

          <Link
            href="/login"
            className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
          >
            Log in
          </Link>

          <Link
            href={LANDING_CONFIG.brand.primaryCta.href}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition-all hover:bg-neutral-200 shadow-sm"
          >
            {LANDING_CONFIG.brand.primaryCta.label}
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800/80 bg-[#09090b]/95 backdrop-blur-xl px-6 py-5 space-y-4">
          <div className="flex flex-col space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-neutral-300 hover:text-white py-1"
            >
              Features
            </a>
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-neutral-300 hover:text-white py-1"
            >
              Workflow
            </a>
            <a
              href="#preview-resume"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-neutral-300 hover:text-white py-1"
            >
              Sample Resume
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-neutral-300 hover:text-white py-1"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-neutral-300 hover:text-white py-1"
            >
              FAQ
            </a>
            <a
              href="#feedback"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-neutral-300 hover:text-white py-1"
            >
              Contact
            </a>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-300 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-neutral-950"
            >
              Build my CV free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
