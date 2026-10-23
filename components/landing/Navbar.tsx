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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[rgb(10,10,10)]/80 backdrop-blur-md border-b border-white/10 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold text-[rgb(242,239,233)] tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(242,239,233)]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(242,239,233)] text-neutral-950 font-bold text-sm">
            R
          </div>
          <span>{LANDING_CONFIG.brand.name}</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {LANDING_CONFIG.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[rgba(242,239,233,0.7)] transition-colors hover:text-[rgb(242,239,233)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme cycle button */}
          <button
            type="button"
            onClick={cycleTheme}
            aria-label="Toggle color theme"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[rgb(242,239,233)] inset-ring inset-ring-white/10 hover:bg-white/10 transition-colors"
          >
            {themeMode === "dark" && <Moon className="h-4 w-4" />}
            {themeMode === "light" && <Sun className="h-4 w-4" />}
            {themeMode === "system" && <Laptop className="h-4 w-4" />}
          </button>

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-[rgb(242,239,233)] hover:text-white transition-colors"
          >
            Log in
          </Link>

          <Link
            href={LANDING_CONFIG.brand.primaryCta.href}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[rgb(242,239,233)] px-5 py-2 text-sm font-medium text-neutral-950 transition-all hover:bg-[rgb(242,239,233)]/90"
          >
            {LANDING_CONFIG.brand.primaryCta.label}
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={cycleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[rgb(242,239,233)] inset-ring inset-ring-white/10"
          >
            {themeMode === "dark" && <Moon className="h-4 w-4" />}
            {themeMode === "light" && <Sun className="h-4 w-4" />}
            {themeMode === "system" && <Laptop className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[rgb(242,239,233)] inset-ring inset-ring-white/10"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[rgb(10,10,10)]/95 px-6 py-6 backdrop-blur-md">
          <nav className="flex flex-col gap-4">
            {LANDING_CONFIG.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[rgba(242,239,233,0.8)] hover:text-[rgb(242,239,233)]"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-white/10">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-white/5 text-sm font-medium text-[rgb(242,239,233)] inset-ring inset-ring-white/10"
              >
                Log in
              </Link>
              <Link
                href={LANDING_CONFIG.brand.primaryCta.href}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[rgb(242,239,233)] text-sm font-medium text-neutral-950"
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
