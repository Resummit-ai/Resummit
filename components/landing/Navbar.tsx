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
      localStorage.setItem("sclade-theme", "dark");
    } else if (nextTheme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
      localStorage.setItem("sclade-theme", "light");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
      localStorage.removeItem("sclade-theme");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#09090b]/85 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand Logo - clean geometric hexagon matching reference */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-base font-medium text-white tracking-tight"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="text-white">
            <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2L19 8.6v6.8L12 19.4 5 15.4V8.6L12 4.2z" />
          </svg>
          <span className="font-semibold">{LANDING_CONFIG.brand.name}</span>
        </Link>

        {/* Center Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {LANDING_CONFIG.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-normal text-neutral-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
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
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white/15"
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#09090b]/95 px-6 py-6 backdrop-blur-md">
          <nav className="flex flex-col gap-4">
            {LANDING_CONFIG.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-white/10">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-white/5 text-sm font-medium text-white"
              >
                Log in
              </Link>
              <Link
                href={LANDING_CONFIG.brand.primaryCta.href}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-white text-sm font-medium text-black"
              >
                {LANDING_CONFIG.brand.primaryCta.label}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
