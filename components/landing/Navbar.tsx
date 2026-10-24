"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LANDING_CONFIG } from "@/lib/landing-config";
import { Menu, X, Sun, Moon } from "lucide-react";
import ArrowRevealButton from "@/components/ui/ArrowRevealButton";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Sync theme with localStorage or document
    const savedTheme = localStorage.getItem("resummit-theme") || localStorage.getItem("sclade-theme");
    const root = document.documentElement;
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme as "dark" | "light");
      root.setAttribute("data-theme", savedTheme);
      if (savedTheme === "light") {
        root.classList.remove("dark");
        root.classList.add("light");
      } else {
        root.classList.remove("light");
        root.classList.add("dark");
      }
    } else {
      // Default matching current document class or dark
      const isDark = root.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    const root = document.documentElement;
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem("resummit-theme", nextTheme);
    localStorage.setItem("sclade-theme", nextTheme);

    if (nextTheme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[#F5F5F3]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#27272a] py-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
          : "bg-white/45 dark:bg-transparent backdrop-blur-[6px] border-b border-black/[0.04] dark:border-transparent py-4"
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
              className="fill-blue-500/15 stroke-blue-600 dark:stroke-[#0099ff]"
              strokeWidth="2"
            />
            <path d="M19 3V9H25L19 3Z" className="fill-blue-600 dark:fill-[#0099ff] stroke-blue-600 dark:stroke-[#0099ff]" strokeWidth="1.5" />
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
            <span className="font-extrabold tracking-tight text-black dark:text-[#f2efe9] text-sm leading-none font-sans">
              RESUMMIT
            </span>
            <span className="text-[9px] tracking-wider text-black/80 dark:text-[#f2efe9]/60 font-mono font-bold leading-tight mt-0.5">
              YOUR COMMITS. YOUR CAREER.
            </span>
          </div>
        </Link>

        {/* Center Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-bold text-neutral-950 dark:text-[#f2efe9]/80 transition-colors hover:!text-blue-600 dark:hover:!text-blue-400 drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)] dark:drop-shadow-none hover:drop-shadow-[0_1px_2px_rgba(37,99,235,0.3)]"
          >
            Features
          </a>
          <a
            href="#pipeline"
            className="text-sm font-bold text-neutral-950 dark:text-[#f2efe9]/80 transition-colors hover:!text-blue-600 dark:hover:!text-blue-400 drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)] dark:drop-shadow-none hover:drop-shadow-[0_1px_2px_rgba(37,99,235,0.3)]"
          >
            Workflow
          </a>
          <a
            href="#preview-resume"
            className="text-sm font-bold text-neutral-950 dark:text-[#f2efe9]/80 transition-colors hover:!text-blue-600 dark:hover:!text-blue-400 drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)] dark:drop-shadow-none hover:drop-shadow-[0_1px_2px_rgba(37,99,235,0.3)]"
          >
            Sample Resume
          </a>
          <a
            href="#pricing"
            className="text-sm font-bold text-neutral-950 dark:text-[#f2efe9]/80 transition-colors hover:!text-blue-600 dark:hover:!text-blue-400 drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)] dark:drop-shadow-none hover:drop-shadow-[0_1px_2px_rgba(37,99,235,0.3)]"
          >
            Access
          </a>
          <a
            href="#faq"
            className="text-sm font-bold text-neutral-950 dark:text-[#f2efe9]/80 transition-colors hover:!text-blue-600 dark:hover:!text-blue-400 drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)] dark:drop-shadow-none hover:drop-shadow-[0_1px_2px_rgba(37,99,235,0.3)]"
          >
            FAQ
          </a>
          <a
            href="#feedback"
            className="text-sm font-bold text-neutral-950 dark:text-[#f2efe9]/80 transition-colors hover:!text-blue-600 dark:hover:!text-blue-400 drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)] dark:drop-shadow-none hover:drop-shadow-[0_1px_2px_rgba(37,99,235,0.3)]"
          >
            Contact
          </a>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-5">
          {/* Authentic localhost:3000 Theme Toggle Pill */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="relative flex items-center justify-between w-[58px] h-[32px] rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-200/60 dark:bg-neutral-800/60 p-[3px] transition-all cursor-pointer hover:border-blue-500 shadow-inner"
          >
            <div
              className={`absolute top-[3px] left-[3px] w-[24px] h-[24px] rounded-full shadow-md transition-transform duration-300 ease-out ${theme === "dark" ? "translate-x-[26px] bg-[#1e293b]" : "translate-x-0 bg-white"
                }`}
            />
            <div
              className={`w-6 h-6 flex items-center justify-center z-10 transition-opacity ${theme === "light" ? "opacity-100 text-amber-500" : "opacity-40 text-neutral-400"
                }`}
            >
              <Sun size={14} className="stroke-[2.5]" />
            </div>
            <div
              className={`w-6 h-6 flex items-center justify-center z-10 transition-opacity ${theme === "dark" ? "opacity-100 text-blue-400" : "opacity-40 text-neutral-400"
                }`}
            >
              <Moon size={14} className="stroke-[2.5]" />
            </div>
          </button>

          <Link
            href="/login"
            className="text-sm font-bold text-neutral-950 dark:text-[#f2efe9]/80 hover:!text-blue-600 dark:hover:!text-blue-400 transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)] dark:drop-shadow-none hover:drop-shadow-[0_1px_2px_rgba(37,99,235,0.3)]"
          >
            Sign In
          </Link>

          <ArrowRevealButton
            label="Build my CV free"
            link={LANDING_CONFIG.brand.primaryCta.href}
            rounded={100}
            padding="7px 14px 7px 18px"
            gap={9}
            colors={{
              fill: theme === "light" ? "#171717" : "#ffffff",
              textColor: theme === "light" ? "#ffffff" : "#09090b",
              hoverFill: theme === "light" ? "#262626" : "#f4f4f5",
              hoverTextColor: theme === "light" ? "#ffffff" : "#09090b",
            }}
            icon={{
              side: "right",
              type: "arrow",
              background: "#0099ff",
              color: "#FFFFFF",
              size: 11,
              padding: 5,
              direction: "right",
              restAngle: 0,
              hoverAngle: -45,
            }}
          />
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E5E5] dark:border-neutral-800 bg-[#F5F5F3] dark:bg-[#0a0a0a] px-6 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-black dark:text-neutral-100 hover:!text-blue-600 dark:hover:!text-blue-400 py-1 transition-colors"
            >
              Features
            </a>
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-black dark:text-neutral-100 hover:!text-blue-600 dark:hover:!text-blue-400 py-1 transition-colors"
            >
              Workflow
            </a>
            <a
              href="#preview-resume"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-black dark:text-neutral-100 hover:!text-blue-600 dark:hover:!text-blue-400 py-1 transition-colors"
            >
              Sample Resume
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-black dark:text-neutral-100 hover:!text-blue-600 dark:hover:!text-blue-400 py-1 transition-colors"
            >
              Access
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-black dark:text-neutral-100 hover:!text-blue-600 dark:hover:!text-blue-400 py-1 transition-colors"
            >
              FAQ
            </a>
            <a
              href="#feedback"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-black dark:text-neutral-100 hover:!text-blue-600 dark:hover:!text-blue-400 py-1 transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] dark:border-neutral-800 flex items-center justify-between">
            <Link
              href="/login"
              className="text-sm font-bold text-black dark:text-neutral-100 hover:!text-blue-600 dark:hover:!text-blue-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={LANDING_CONFIG.brand.primaryCta.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-black dark:bg-white px-4 py-1.5 text-xs font-semibold text-white dark:text-black"
            >
              <span>Build my CV free</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
