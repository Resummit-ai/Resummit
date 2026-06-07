"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { GitBranch, Brain, FileDown, KeyRound, Terminal, Cpu, FileCheck, ChevronDown, Globe, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const TECH_LOGOS = [
  {
    name: "Next.js",
    logo: (
      <svg viewBox="0 0 180 180" width="18" height="18" fill="currentColor">
        <path d="M90 0a90 90 0 1 0 90 90A90 90 0 0 0 90 0zM141 143l-45-58v58H84V57h12l42 55V57h12v86h-9z" fillRule="evenodd"/>
      </svg>
    )
  },
  {
    name: "React",
    logo: (
      <svg viewBox="-11.5 -10.23174 23 20.46348" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none">
        <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
        <g stroke="currentColor">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
    )
  },
  {
    name: "TypeScript",
    logo: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <rect width="20" height="20" x="2" y="2" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="5" y="16" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="11px" fill="currentColor">TS</text>
      </svg>
    )
  },
  {
    name: "GitHub",
    logo: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    )
  },
  {
    name: "TensorFlow",
    logo: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 2L2 7.5v11L12 24l10-5.5v-11L12 2zm-1 18.8l-7-3.8V9.2l7 3.8v7.8zm1-9L5 8l7-3.8 7 3.8-7 3.8zm8 5.8l-7 3.8v-7.8l7-3.8v7.8z"/>
      </svg>
    )
  },
  {
    name: "PostgreSQL",
    logo: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
      </svg>
    )
  },
  {
    name: "Node.js",
    logo: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
        <path d="M12 22V12"/>
        <path d="M12 12L2 7"/>
        <path d="M12 12l10-5"/>
      </svg>
    )
  },
  {
    name: "Python",
    logo: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M11.927 0C5.39 0 5.626 2.833 5.626 2.833v2.946h6.42v.907H4.077S0 6.223 0 12.062c0 5.839 3.55 5.632 3.55 5.632h2.122v-2.986c0-3.267 2.658-5.633 5.925-5.633h6.42V6.13S18.257 0 11.927 0zM12.073 24c6.537 0 6.301-2.833 6.301-2.833v-2.946h-6.42v-.907h7.969s4.077.463 4.077-5.376c0-5.839-3.55-5.632-3.55-5.632h-2.122v2.986c0 3.267-2.658 5.633-5.925 5.633h-6.42v2.945S5.743 24 12.073 24zm2.148-20.732a.823.823 0 1 1 0 1.646.823.823 0 0 1 0-1.646zm-4.442 17.464a.823.823 0 1 1 0-1.646.823.823 0 0 1 0 1.646z"/>
      </svg>
    )
  },
  {
    name: "Docker",
    logo: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M13.983 11.078h2.119c.102 0 .186-.084.186-.186V8.773c0-.102-.084-.186-.186-.186h-2.119c-.102 0-.186.084-.186.186v2.119c0 .102.084.186.186.186zM11.266 11.078h2.119c.102 0 .186-.084.186-.186V8.773c0-.102-.084-.186-.186-.186h-2.119c-.102 0-.186.084-.186.186v2.119c0 .102.084.186.186.186zM11.266 8.361h2.119c.102 0 .186-.084.186-.186V6.056c0-.102-.084-.186-.186-.186h-2.119c-.102 0-.186.084-.186.186v2.119c0 .102.084.186.186.186zM8.577 11.078h2.119c.102 0 .186-.084.186-.186V8.773c0-.102-.084-.186-.186-.186H8.577c-.102 0-.186.084-.186.186v2.119c0 .102.084.186.186.186zM8.577 8.361h2.119c.102 0 .186-.084.186-.186V6.056c0-.102-.084-.186-.186-.186H8.577c-.102 0-.186.084-.186.186v2.119c0 .102.084.186.186.186zM5.888 11.078h2.119c.102 0 .186-.084.186-.186V8.773c0-.102-.084-.186-.186-.186H5.888c-.102 0-.186.084-.186.186v2.119c0 .102.084.186.186.186zM13.983 8.361h2.119c.102 0 .186-.084.186-.186V6.056c0-.102-.084-.186-.186-.186h-2.119c-.102 0-.186.084-.186.186v2.119c0 .102.084.186.186.186zM16.672 11.078h2.119c.102 0 .186-.084.186-.186V8.773c0-.102-.084-.186-.186-.186h-2.119c-.102 0-.186.084-.186.186v2.119c0 .102.084.186.186.186zM23.99 12.18c-.287-.852-.942-1.57-2.128-1.57a.186.186 0 0 0-.186.186c.01.218-.01.442-.064.664-.176.719-.664 1.341-1.341 1.764a.186.186 0 0 0-.084.22c.488 1.157 1.391 1.83 2.502 1.83.102 0 .186-.084.186-.186v-.218c-.005-.333.049-.664.161-.981.282-.821.84-1.637.954-2.603zM2.164 12.871H20.48c.102 0 .186-.084.186-.186v-.59c0-3.333-2.113-6.056-5.839-6.056-1.127 0-2.138.25-3.036.759a.186.186 0 0 0-.084.22c.245 1.025.437 2.113.437 3.255 0 2.215-.815 4.38-2.222 5.92A.186.186 0 0 0 9.8 16.48c-1.283-1.428-2.036-3.286-2.036-5.267 0-1.142.22-2.23.664-3.255a.186.186 0 0 0-.084-.22C7.446 7.23 6.435 6.98 5.308 6.98 1.583 6.98 0 9.703 0 13.036v.59c0 .102.084.186.186.186h1.792c.102 0 .186-.084.186-.186V12.87zM.186 14.542a.186.186 0 0 0-.186.186v.218c0 3.333 3.661 6.056 8.17 6.056 4.51 0 8.17-2.723 8.17-6.056v-.218a.186.186 0 0 0-.186-.186H.186z"/>
      </svg>
    )
  },
  {
    name: "Prisma",
    logo: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 22h20L12 2z"/>
        <path d="M12 2v20"/>
        <path d="M2 22l10-10L22 22"/>
      </svg>
    )
  },
  {
    name: "Redis",
    logo: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5zM2 12l10 5 10-5-10-5-10 5z"/>
      </svg>
    )
  },
  {
    name: "AWS",
    logo: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.48 0-.96.06-1.42.17A6 6 0 0 0 4 14c0 2.76 2.24 5 5 5h8.5z"/>
        <path d="M9 19h6"/>
      </svg>
    )
  }
];

const leftItemVariants = {
  hidden: { opacity: 0, x: -5 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: delay * 0.4, duration: 0.18 }
  }),
  dimmed: {
    opacity: 0.4,
    x: 0,
    transition: { duration: 0.15 }
  }
};

const rightItemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: delay * 0.4, duration: 0.2 }
  }),
  hiddenInstant: {
    opacity: 0.05,
    y: 5,
    transition: { duration: 0.15 }
  }
};

export function LandingClient({ 
  hasSession, 
  userName = "", 
  userEmail = "" 
}: { 
  hasSession?: boolean; 
  userName?: string; 
  userEmail?: string; 
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [resumeScale, setResumeScale] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  // Scroll progress bar — ref-based (no re-renders)
  const scrollBarRef = useRef<HTMLDivElement>(null);

  // Mouse parallax — ref-based (no re-renders)
  const glowRef = useRef<HTMLDivElement>(null);

  // Typewriter
  const typewriterRoles = [
    "Full-Stack Development",
    "AI Engineering",
    "Backend Engineering",
    "Software Engineering",
    "DevOps Engineering"
  ];
  const [twIndex, setTwIndex] = useState(0);
  const [twText, setTwText] = useState("");
  const [twDeleting, setTwDeleting] = useState(false);

  // Stats counters
  const [countersActive, setCountersActive] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  // FAQ accordion
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Magic transformation step (0 = GitHub commits typed, 1 = AI Processing, 2 = Bullet points typed, 3 = Highlighted results)
  const [magicStep, setMagicStep] = useState(0);
  const [magicActive, setMagicActive] = useState(false);
  const magicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!magicRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !magicActive) {
        setMagicActive(true);
      }
    }, { threshold: 0.15 });
    observer.observe(magicRef.current);
    return () => observer.disconnect();
  }, [magicActive]);

  useEffect(() => {
    if (!magicActive) return;
    const timer = setInterval(() => {
      setMagicStep((step) => {
        if (step >= 3) {
          clearInterval(timer);
          return 3;
        }
        return step + 1;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [magicActive]);

  // Feedback Form State
  const [feedbackName, setFeedbackName] = useState(userName);
  const [feedbackEmail, setFeedbackEmail] = useState(userEmail);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackEmail || !feedbackMsg) return;
    setFeedbackSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: feedbackName,
          email: feedbackEmail,
          rating: feedbackRating,
          message: feedbackMsg,
        }),
      });
      if (res.ok) {
        setFeedbackSubmitted(true);
        // Clear inputs
        setFeedbackName("");
        setFeedbackEmail("");
        setFeedbackRating(5);
        setFeedbackMsg("");
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };
  const resumeContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll progress bar — direct DOM, no re-renders
  useEffect(() => {
    const onScroll = () => {
      if (!scrollBarRef.current) return;
      const el = document.documentElement;
      const pct = el.scrollHeight > el.clientHeight
        ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
        : 0;
      scrollBarRef.current.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mouse parallax — direct DOM, no re-renders
  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!glowRef.current) return;
        const dx = (e.clientX / window.innerWidth - 0.5) * -50;
        const dy = (e.clientY / window.innerHeight - 0.5) * -50;
        glowRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  // Typewriter effect
  useEffect(() => {
    const current = typewriterRoles[twIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!twDeleting && twText.length < current.length) {
      timeout = setTimeout(() => setTwText(current.slice(0, twText.length + 1)), 60);
    } else if (!twDeleting && twText.length === current.length) {
      timeout = setTimeout(() => setTwDeleting(true), 2000);
    } else if (twDeleting && twText.length > 0) {
      timeout = setTimeout(() => setTwText(twText.slice(0, -1)), 35);
    } else if (twDeleting && twText.length === 0) {
      setTwDeleting(false);
      setTwIndex((i) => (i + 1) % typewriterRoles.length);
    }
    return () => clearTimeout(timeout);
  }, [twText, twDeleting, twIndex]);

  // Stats counter animation
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !countersActive) {
        setCountersActive(true);
        // Animate count1 to 50
        let c1 = 0; const t1 = setInterval(() => { c1 += 2; setCount1(c1); if (c1 >= 50) clearInterval(t1); }, 40);
        // Animate count2 to 10
        let c2 = 0; const t2 = setInterval(() => { c2 += 1; setCount2(c2); if (c2 >= 10) clearInterval(t2); }, 80);
        // Animate count3 to 60
        let c3 = 0; const t3 = setInterval(() => { c3 += 3; setCount3(c3); if (c3 >= 60) clearInterval(t3); }, 33);
      }
    }, { threshold: 0.4 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [countersActive]);

  useEffect(() => {
    if (typeof window === "undefined" || !resumeContainerRef.current) return;

    const updateScale = () => {
      if (!resumeContainerRef.current) return;
      const gridWidth = resumeContainerRef.current.getBoundingClientRect().width;
      const isMobile = window.innerWidth <= 980;
      let availableWidth = 0;

      if (isMobile) {
        availableWidth = gridWidth - 20;
      } else {
        // Grid columns are 1fr and 1.1fr, with gap of 60px
        availableWidth = (gridWidth - 60) * (1 / 2.1) - 20;
      }

      const newScale = Math.min(1, Math.max(0.1, availableWidth / 794));
      setResumeScale(newScale);
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    if (resumeContainerRef.current) {
      observer.observe(resumeContainerRef.current);
    }

    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  useEffect(() => {
    // Theme toggle logic initialization
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("resummit-theme") as "dark" | "light";
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      root.setAttribute("data-theme", savedTheme);
      if (savedTheme === "light") {
        root.classList.remove("dark");
        root.classList.add("light");
      } else {
        root.classList.remove("light");
        root.classList.add("dark");
      }
    } else {
      root.setAttribute("data-theme", "dark");
      root.classList.add("dark");
    }

    // Scroll reveal observer
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.14 }
    );

    reveals.forEach((el) => observer.observe(el));

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    root.setAttribute("data-theme", next);
    localStorage.setItem("resummit-theme", next);
    localStorage.setItem("sclade-theme", next);
    if (next === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  };

  return (
    <>
      {/* Load Google Fonts directly in React */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Scroll Progress Bar — DOM ref, zero re-renders */}
      <div ref={scrollBarRef} style={{ position: "fixed", top: 0, left: 0, height: "3px", width: "0%", background: "linear-gradient(90deg, #4f8cff, #a78bfa, #06b6d4)", backgroundSize: "200% 100%", zIndex: 9999, willChange: "width", boxShadow: "0 0 8px rgba(79,140,255,0.5)" }} />

      {/* Exact style block from your HTML */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --radius: 24px;
          --transition: 0.35s cubic-bezier(.22,.61,.36,1);
          --max-width: 100%;
        }

        [data-theme="dark"] {
          --bg: #060816;
          --surface: #0f172a;
          --surface-2: #131d35;
          --text: #f8fafc;
          --muted: #94a3b8;
          --border: rgba(255,255,255,0.08);
          --primary: #4f8cff;
          --shadow: rgba(0,0,0,0.4);
          --nav: rgba(6,8,22,0.72);
          --logo-doc-body: #172554;
          --logo-doc-fold: #1d4ed8;
          --logo-doc-lines: #3b82f6;
          --logo-flag-pole: #60a5fa;
          --logo-flag-banner: #60a5fa;
          --logo-text: #ffffff;
          --logo-tagline: #64748b;
          
          /* Cards Theme variables */
          --card-bg: rgba(15, 23, 42, 0.35);
          --card-border: rgba(255, 255, 255, 0.03);
          --card-hover-bg: rgba(15, 23, 42, 0.6);
          --card-hover-border: rgba(79, 140, 255, 0.25);
          --card-number-color: rgba(255, 255, 255, 0.12);
          --card-icon-bg: rgba(255, 255, 255, 0.02);
          --card-icon-border: rgba(255, 255, 255, 0.06);
          --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          --card-hover-shadow: 0 20px 40px rgba(0, 0, 0, 0.45), 0 0 30px rgba(79, 140, 255, 0.06);
        }

        [data-theme="light"] {
          --bg: #ffffff;
          --surface: #ffffff;
          --surface-2: #f1f5f9;
          --text: #0f172a;
          --muted: #475569;
          --border: rgba(15, 23, 42, 0.08);
          --primary: #2563eb;
          --shadow: rgba(15, 23, 42, 0.08);
          --nav: rgba(255, 255, 255, 0.82);
          --logo-doc-body: #dbeafe;
          --logo-doc-fold: #bfdbfe;
          --logo-doc-lines: #93c5fd;
          --logo-flag-pole: #2563eb;
          --logo-flag-banner: #2563eb;
          --logo-text: #0f172a;
          --logo-tagline: #64748b;
          
          /* Cards Theme variables */
          --card-bg: rgba(241, 245, 249, 0.6);
          --card-border: rgba(15, 23, 42, 0.04);
          --card-hover-bg: #ffffff;
          --card-hover-border: rgba(37, 99, 235, 0.2);
          --card-number-color: rgba(15, 23, 42, 0.08);
          --card-icon-bg: rgba(15, 23, 42, 0.02);
          --card-icon-border: rgba(15, 23, 42, 0.06);
          --card-shadow: 0 8px 24px rgba(15, 23, 42, 0.02);
          --card-hover-shadow: 0 16px 32px rgba(15, 23, 42, 0.06), 0 0 25px rgba(37, 99, 235, 0.03);
        }

        .landing-body * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif !important;
        }

        .landing-body {
          font-family: 'Inter', sans-serif !important;
          background: var(--bg);
          color: var(--text);
          transition: background var(--transition), color var(--transition);
          line-height: 1.6;
          overflow-x: hidden;
          width: 100%;
          min-height: 100vh;
        }

        .landing-body h1,
        .landing-body h2,
        .landing-body .title,
        .landing-body .contact h2 {
          font-weight: 800 !important;
        }

        .landing-body h3,
        .landing-body h4,
        .landing-body .step h4,
        .landing-body .card h3,
        .landing-body .footer-column h4,
        .landing-body strong,
        .landing-body b {
          font-weight: 700 !important;
        }

        .landing-body .container {
          width: min(92%, var(--max-width, 100%)) !important;
          max-width: var(--max-width, 100%) !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .landing-body .code, .landing-body .code * {
          font-family: monospace !important;
        }

        .landing-body nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          background: var(--nav);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid var(--border);
        }

        .landing-body .nav-inner {
          height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .landing-body .logo span {
          color: var(--primary);
        }

        .landing-body .nav-links {
          display: flex;
          gap: 28px;
        }

        .landing-body .nav-links a {
          text-decoration: none;
          color: var(--muted);
          font-weight: 500;
          transition: 0.3s;
        }

        .landing-body .nav-links a:hover {
          color: var(--text);
        }

        .landing-body .nav-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .landing-body .theme-switch {
          position: relative;
          width: 58px;
          height: 32px;
          border-radius: 9999px;
          border: 1px solid var(--border);
          background: rgba(0, 0, 0, 0.05);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 3px;
          outline: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        [data-theme="dark"] .landing-body .theme-switch {
          background: rgba(255, 255, 255, 0.05);
        }

        .landing-body .theme-switch:hover {
          border-color: var(--primary);
          box-shadow: 0 0 12px rgba(79, 140, 255, 0.15);
        }

        .landing-body .theme-switch-indicator {
          position: absolute;
          left: 3px;
          top: 3.5px;
          width: 23px;
          height: 23px;
          border-radius: 50%;
          background: var(--text);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s;
          z-index: 1;
        }

        .landing-body .theme-switch-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: opacity 0.25s ease, color 0.25s ease;
          color: var(--text);
        }
        
        [data-theme="light"] .landing-body .theme-switch .sun-icon {
          color: #d97706;
        }
        
        [data-theme="dark"] .landing-body .theme-switch .moon-icon {
          color: #60a5fa;
        }

        .landing-body .primary-btn {
          padding: 13px 22px;
          border: none;
          border-radius: 16px;
          background: var(--text);
          color: var(--bg);
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .landing-body .primary-btn:hover {
          transform: translateY(-2px);
        }

        .landing-body .logout-btn {
          padding: 13px 22px;
          border-radius: 16px;
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: rgba(239, 68, 68, 0.85);
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .landing-body .logout-btn:hover {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.4);
          color: rgb(239, 68, 68);
          transform: translateY(-2px);
        }

        .landing-body .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 100px;
          padding-bottom: 100px;
          position: relative;
          overflow: hidden;
        }

        .landing-body .glow {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79, 140, 255, 0.16), transparent 70%);
          pointer-events: none;
          transition: transform 0.15s ease-out;
        }

        /* Stats strip */
        .stats-strip {
          padding: 80px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: radial-gradient(circle at 50% 50%, var(--surface-2) 0%, var(--bg) 100%);
        }
        .stats-strip-inner {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .stat-item {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          padding: 30px;
          flex: 1 1 240px;
          max-width: 280px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          box-shadow: var(--card-shadow);
        }
        .stat-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), rgba(79, 140, 255, 0.1));
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
        .stat-item:hover {
          transform: translateY(-8px);
          background: var(--card-hover-bg);
          border-color: var(--card-hover-border);
          box-shadow: var(--card-hover-shadow);
        }
        .stat-item:hover::before {
          opacity: 1;
        }
        .stat-badge-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .stat-icon-container {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--card-icon-bg);
          border: 1px solid var(--card-icon-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          transition: all 0.3s ease;
        }
        .stat-icon-container svg {
          width: 20px;
          height: 20px;
          stroke-width: 1.5;
        }
        .stat-item:hover .stat-icon-container {
          background: rgba(79, 140, 255, 0.1);
          border-color: rgba(79, 140, 255, 0.35);
          color: var(--primary);
          box-shadow: 0 0 15px rgba(79, 140, 255, 0.15);
        }
        .stat-number {
          font-family: monospace !important;
          font-size: 2.2rem;
          font-weight: 900 !important;
          color: var(--card-number-color);
          transition: color 0.3s ease, text-shadow 0.3s ease;
          line-height: 1;
        }
        .stat-item:hover .stat-number {
          color: var(--primary);
          text-shadow: 0 0 15px rgba(79, 140, 255, 0.6);
        }
        .stat-label-title {
          font-size: 1.15rem;
          font-weight: 700 !important;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .stat-sublabel-desc {
          font-size: 0.88rem;
          color: var(--muted);
          line-height: 1.5;
        }

        /* Marquee */
        .marquee-wrap {
          position: relative;
          overflow: hidden;
          padding: 32px 0;
          border-bottom: 1px solid var(--border);
          background: var(--surface-2);
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        .marquee-track {
          display: flex;
          gap: 64px;
          animation: marquee 35s linear infinite;
          width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--muted);
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
          opacity: 0.45;
          transition: opacity 0.25s, color 0.25s;
        }
        .marquee-item:hover { 
          opacity: 0.95;
          color: var(--primary);
        }
        .marquee-item svg {
          fill: currentColor;
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        .marquee-item:hover svg {
          transform: scale(1.1);
        }

        /* Magic section grid */
        .magic-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 36px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* Decorative glows for the magic section */
        .magic-bg-glow-1 {
          position: absolute;
          top: 30%;
          left: 10%;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.04) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
          filter: blur(50px);
        }
        .magic-bg-glow-2 {
          position: absolute;
          bottom: 20%;
          right: 10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
          filter: blur(60px);
        }
        .magic-arrow-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (max-width: 768px) {
          .magic-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .magic-arrow-container {
            transform: rotate(90deg);
            margin: 12px 0;
          }
        }

        /* Testimonials */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 980px) { .testimonials-grid { grid-template-columns: 1fr; } }
        .testimonial-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          padding: 32px;
          box-shadow: var(--card-shadow);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .testimonial-card::before {
          content: '\\201C';
          position: absolute;
          top: 16px;
          right: 24px;
          font-size: 6rem;
          line-height: 1;
          color: var(--primary);
          opacity: 0.08;
          font-family: Georgia, serif;
          z-index: 1;
        }
        .testimonial-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), rgba(79, 140, 255, 0.1));
          opacity: 0.7;
          transition: opacity 0.3s ease;
          z-index: 2;
        }
        .testimonial-card:hover {
          transform: translateY(-8px);
          background: var(--card-hover-bg);
          border-color: var(--card-hover-border);
          box-shadow: var(--card-hover-shadow);
        }
        .testimonial-card:hover::after {
          opacity: 1;
        }
        .testimonial-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 16px;
        }
        .testimonial-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1rem;
          flex-shrink: 0;
        }

        /* Pricing */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }
        @media (max-width: 980px) { .pricing-grid { grid-template-columns: 1fr; } }
        .pricing-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          padding: 36px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--card-shadow);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pricing-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), rgba(79, 140, 255, 0.1));
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
        .pricing-card:hover {
          transform: translateY(-8px);
          background: var(--card-hover-bg);
          border-color: var(--card-hover-border);
          box-shadow: var(--card-hover-shadow);
        }
        .pricing-card:hover::before {
          opacity: 1;
        }
        .pricing-card.featured {
          border-color: rgba(79, 140, 255, 0.5);
          background: linear-gradient(135deg, rgba(79, 140, 255, 0.08), rgba(79, 140, 255, 0.03));
          box-shadow: 0 10px 40px rgba(79, 140, 255, 0.12);
        }
        .pricing-card.featured::before {
          background: linear-gradient(90deg, var(--primary), #a78bfa);
          height: 4px;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
          opacity: 0.9;
        }
        .pricing-price {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 1;
          margin-bottom: 4px;
        }
        .pricing-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--muted);
          margin-bottom: 10px;
        }
        .pricing-split-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        .pricing-split-text-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .pricing-split-text-col .label {
          margin-bottom: 16px;
        }
        .pricing-split-text-col .title {
          font-size: clamp(2.4rem, 4.5vw, 4rem) !important;
          line-height: 1.05 !important;
          letter-spacing: -0.06em !important;
          margin-bottom: 20px;
          font-weight: 800 !important;
        }
        .pricing-split-text-col .desc {
          font-size: 1.15rem;
          color: var(--muted);
          line-height: 1.6;
          max-width: 500px;
        }
        .pricing-split-card-col {
          display: flex;
          justify-content: flex-start;
          width: 100%;
        }
        @media (max-width: 980px) {
          .pricing-split-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }
          .pricing-split-text-col {
            align-items: center;
            text-align: center;
            order: -1; /* Stack text above the card on tablet/mobile */
          }
          .pricing-split-text-col .desc {
            margin: 0 auto;
          }
          .pricing-split-card-col {
            justify-content: center;
          }
        }
        /* Custom Premium dark theme for pricing card */
        .pricing-card.premium-theme {
          background: linear-gradient(135deg, #0b0f19, #111726) !important;
          border-color: rgba(79, 140, 255, 0.35) !important;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(79, 140, 255, 0.12) !important;
          color: #f8fafc !important;
        }
        .pricing-card.premium-theme::before {
          display: none !important;
        }
        .pricing-card.premium-theme .pricing-price {
          color: #ffffff !important;
        }
        .pricing-card.premium-theme .pricing-feature {
          color: #cbd5e1 !important;
        }
        .pricing-card.premium-theme .secondary-btn {
          background: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
        }
        .pricing-card.premium-theme .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }


        /* FAQ */
        .faq-split-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 48px;
        }
        @media (max-width: 768px) {
          .faq-split-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        .faq-list { max-width: 720px; margin: 0 auto; }
        .faq-item {
          border-bottom: 1px solid var(--border);
          padding: 6px 0;
        }
        .faq-question {
          width: 100%;
          background: none;
          border: none;
          color: var(--text);
          font-size: 1.05rem;
          font-weight: 700;
          text-align: left;
          padding: 20px 0;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          transition: color 0.2s;
        }
        .faq-question:hover { color: var(--primary); }
        .faq-answer {
          font-size: 0.95rem;
          color: var(--muted);
          line-height: 1.7;
          padding-bottom: 20px;
          max-width: 640px;
        }

        /* Gradient text animation */
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .gradient-text {
          background: linear-gradient(90deg, #4f8cff, #a78bfa, #06b6d4, #4f8cff);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 5s ease infinite;
        }

        /* Typewriter Cursor blinking */
        @keyframes cursorBlink {
          50% { border-color: transparent; }
        }
        .typewriter-cursor {
          display: inline-block;
          border-right: 3.5px solid var(--primary);
          margin-left: 4px;
          animation: cursorBlink 0.8s step-end infinite;
          vertical-align: middle;
        }

        .landing-body .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 70px;
          align-items: center;
        }

        .landing-body .badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--surface);
          margin-bottom: 26px;
          color: var(--primary);
          font-size: 0.88rem;
          font-weight: 700;
        }

        .landing-body .dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
        }

        .landing-body .hero h1 {
          font-size: clamp(3.2rem, 7.2vw, 9.5rem) !important;
          line-height: 0.95 !important;
          letter-spacing: -0.06em !important;
          margin-bottom: 24px;
          max-width: 1000px !important;
        }

        .landing-body .hero p {
          max-width: 750px !important;
          font-size: clamp(1.08rem, 1.6vw, 1.4rem) !important;
          color: var(--muted);
          margin-bottom: 34px;
        }

        .landing-body .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .landing-body .secondary-btn {
          padding: 13px 22px;
          border-radius: 16px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .landing-body .preview {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 30px 80px var(--shadow);
        }

        .resume-preview-wrapper {
          position: relative;
          overflow: hidden;
          width: 794px;
          height: 1123px;
          margin: 0 auto;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 4px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease;
        }
        .resume-preview-wrapper:hover {
          transform: translateY(-10px) scale(1.005) !important;
          box-shadow: 0 35px 80px rgba(0, 0, 0, 0.35) !important;
          border-color: rgba(79, 140, 255, 0.3) !important;
        }

        .resume-preview-sheet {
          width: 794px;
          height: 1123px;
          background: #ffffff;
          color: #0f172a;
          padding: 40px 44px 92px 44px;
          font-family: "'Times New Roman', Georgia, serif";
          text-align: left;
          color-scheme: light;
          box-sizing: border-box;
          position: absolute;
          top: 0;
          left: 0;
          transform-origin: top left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* Responsive scaling breakpoints */
        @media (max-width: 840px) {
          .resume-preview-wrapper {
            width: 635px;
            height: 898px;
          }
          .resume-preview-sheet {
            transform: scale(0.8);
          }
        }
        @media (max-width: 680px) {
          .resume-preview-wrapper {
            width: 476px;
            height: 673px;
          }
          .resume-preview-sheet {
            transform: scale(0.6);
          }
        }
        @media (max-width: 500px) {
          .resume-preview-wrapper {
            width: 357px;
            height: 505px;
          }
          .resume-preview-sheet {
            transform: scale(0.45);
          }
        }
        @media (max-width: 380px) {
          .resume-preview-wrapper {
            width: 290px;
            height: 410px;
          }
          .resume-preview-sheet {
            transform: scale(0.365);
          }
        }

        .landing-body .preview-header {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
        }

        .landing-body .preview-body {
          padding: 28px;
        }

        .landing-body .code {
          background: #020617;
          color: #dbeafe;
          border-radius: 22px;
          padding: 26px;
          font-family: monospace;
          line-height: 1.9;
          font-size: 0.92rem;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .landing-body .section {
          padding: 140px 0;
        }

        .landing-body .section-head {
          margin-bottom: 58px;
        }

        .landing-body .label {
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--primary);
          font-weight: 700;
          margin-bottom: 16px;
        }

        .landing-body .title {
          font-size: clamp(2.5rem, 5vw, 4.8rem);
          line-height: 0.95;
          letter-spacing: -0.08em;
          margin-bottom: 18px;
        }

        .landing-body .desc {
          max-width: 700px;
          font-size: 1.05rem;
          color: var(--muted);
        }

        .landing-body .cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .landing-body .card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          padding: 34px;
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--card-shadow);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .landing-body .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), rgba(79, 140, 255, 0.1));
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .landing-body .card:hover {
          transform: translateY(-8px);
          background: var(--card-hover-bg);
          border-color: var(--card-hover-border);
          box-shadow: var(--card-hover-shadow);
        }

        .landing-body .card:hover::before {
          opacity: 1;
        }

        .landing-body .card-icon-wrapper {
          margin-bottom: 22px;
          display: inline-flex;
        }

        .landing-body .card-icon-container {
          width: 62px;
          height: 62px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(79, 140, 255, 0.1), rgba(79, 140, 255, 0.03));
          border: 1px solid rgba(79, 140, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          transition: border-color 0.3s ease, background 0.3s ease;
        }

        .landing-body .card:hover .card-icon-container {
          background: linear-gradient(135deg, rgba(79, 140, 255, 0.2), rgba(79, 140, 255, 0.05));
          border-color: rgba(79, 140, 255, 0.4);
          box-shadow: 0 0 20px rgba(79, 140, 255, 0.15);
        }

        .landing-body .icon-style {
          width: 26px;
          height: 26px;
          stroke-width: 2px;
        }

        .landing-body .card h3 {
          margin-bottom: 12px;
          font-size: 1.22rem;
        }

        .landing-body .card p {
          color: var(--muted);
        }

        .landing-body .workflow {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
          position: relative;
        }

        .landing-body .workflow-step-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          padding: 30px;
          position: relative;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          box-shadow: var(--card-shadow);
        }

        .landing-body .workflow-step-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), rgba(79, 140, 255, 0.1));
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .landing-body .workflow-step-card:hover {
          transform: translateY(-8px);
          background: var(--card-hover-bg);
          border-color: var(--card-hover-border);
          box-shadow: var(--card-hover-shadow);
        }

        .landing-body .workflow-step-card:hover::before {
          opacity: 1;
        }

        .landing-body .step-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .landing-body .step-number {
          font-family: monospace !important;
          font-size: 2.2rem;
          font-weight: 900 !important;
          color: var(--card-number-color);
          transition: color 0.3s ease, text-shadow 0.3s ease;
          line-height: 1;
        }

        .landing-body .workflow-step-card:hover .step-number {
          color: var(--primary);
          text-shadow: 0 0 15px rgba(79, 140, 255, 0.6);
        }

        .landing-body .step-icon-container {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--card-icon-bg);
          border: 1px solid var(--card-icon-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          transition: all 0.3s ease;
        }

        .landing-body .workflow-step-card:hover .step-icon-container {
          background: rgba(79, 140, 255, 0.1);
          border-color: rgba(79, 140, 255, 0.35);
          color: var(--primary);
          box-shadow: 0 0 15px rgba(79, 140, 255, 0.15);
        }

        .landing-body .step-icon-container svg {
          width: 20px;
          height: 20px;
          stroke-width: 2px;
        }

        .landing-body .workflow-step-card h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .landing-body .workflow-step-card p {
          font-size: 0.92rem;
          color: var(--muted);
          line-height: 1.6;
        }

        .landing-body .contact {
          background: linear-gradient(135deg, #111827, #1e293b);
          border-radius: 36px;
          padding: 60px;
          border: 1px solid var(--border);
          text-align: left;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
          align-items: center;
        }

        .landing-body .contact-left {
          display: flex;
          flex-direction: column;
        }

        .landing-body .contact h2 {
          font-size: clamp(2.4rem, 4vw, 4rem);
          line-height: 1.05;
          letter-spacing: -0.06em;
          color: white;
          margin-bottom: 20px;
        }

        .landing-body .contact p {
          max-width: 600px;
          margin: 0;
          color: #cbd5e1;
          margin-bottom: 34px;
          line-height: 1.6;
        }

        .landing-body .contact-links {
          display: flex;
          justify-content: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        }

        .landing-body .contact-links a {
          padding: 14px 20px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-weight: 700;
          text-decoration: none;
          transition: 0.3s;
        }

        .landing-body .contact-links a:hover {
          background: white;
          color: #0f172a;
          transform: translateY(-2px);
        }

        /* Feedback Form Container */
        .landing-body .feedback-form-container {
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 28px;
          padding: 40px;
          backdrop-filter: blur(16px);
        }

        .landing-body .feedback-form-container h3 {
          font-size: 1.25rem;
          color: white;
          margin-bottom: 8px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .landing-body .feedback-form-container p {
          font-size: 0.9rem;
          color: var(--muted);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .landing-body .feedback-form-group {
          margin-bottom: 18px;
        }

        .landing-body .feedback-form-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          margin-bottom: 8px;
        }

        .landing-body .feedback-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 0.88rem;
          color: white;
          outline: none;
          transition: 0.25s ease;
        }

        .landing-body .feedback-input:focus {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.06);
        }

        .landing-body .feedback-textarea {
          resize: none;
          height: 100px;
        }

        .landing-body .rating-buttons {
          display: flex;
          gap: 8px;
        }

        .landing-body .rating-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--muted);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .landing-body .rating-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .landing-body .rating-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          box-shadow: 0 0 15px rgba(79, 140, 255, 0.4);
        }

        .landing-body .feedback-submit-btn {
          width: 100%;
          padding: 14px;
          background: var(--primary);
          border: none;
          border-radius: 14px;
          color: white;
          font-weight: 700;
          font-size: 0.88rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .landing-body .feedback-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(79, 140, 255, 0.3);
        }

        .landing-body .feedback-submit-btn:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: var(--muted);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        @media(max-width: 980px) {
          .landing-body .contact {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 40px 24px;
            text-align: center;
          }

          .landing-body .contact-left {
            align-items: center;
          }

          .landing-body .contact-links {
            justify-content: center;
          }
        }

        .landing-body footer {
          padding: 80px 0 40px 0;
          background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.01) 100%);
          border-top: 1px solid var(--border);
        }

        [data-theme="dark"] .landing-body footer {
          background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.15) 100%);
        }

        .landing-body .footer-grid {
          display: flex;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
          align-items: flex-start;
          margin-bottom: 50px;
        }

        .landing-body .footer-left p {
          margin-top: 18px;
          color: var(--muted);
          max-width: 380px;
          font-size: 0.95rem;
          line-height: 1.65;
        }

        .landing-body .footer-links {
          display: flex;
          gap: 80px;
          flex-wrap: wrap;
        }

        .landing-body .footer-column h4 {
          margin-bottom: 20px;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text);
          font-weight: 700;
        }

        .landing-body .footer-column a {
          display: block;
          margin-bottom: 12px;
          color: var(--muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .landing-body .footer-column a:hover {
          color: var(--primary);
          transform: translateX(4px);
        }

        .landing-body .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 30px;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 20px;
          font-size: 0.85rem;
          color: var(--muted);
        }

        .landing-body .footer-bottom .creator-credit a {
          color: var(--text);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.25s ease;
          border-bottom: 1px dotted rgba(255, 255, 255, 0.2);
        }

        [data-theme="light"] .landing-body .footer-bottom .creator-credit a {
          border-bottom: 1px dotted rgba(0, 0, 0, 0.2);
        }

        .landing-body .footer-bottom .creator-credit a:hover {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .landing-body .reveal {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.9s cubic-bezier(.22,.61,.36,1);
        }

        .landing-body .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        @media(max-width:980px) {
          .landing-body .hero-grid,
          .landing-body .cards,
          .landing-body .workflow {
            grid-template-columns: 1fr;
          }

          .landing-body .nav-links {
            display: none;
          }

          .landing-body .contact {
            padding: 50px 24px;
          }

          .landing-body .hero {
            padding-bottom: 70px;
          }
        }

        @media (max-width: 500px) {
          .landing-body .nav-inner {
            height: 64px;
          }

          .landing-body .logo-icon-svg {
            width: 28px !important;
            height: 28px !important;
          }

          .landing-body .logo-wordmark {
            font-size: 1.15rem !important;
          }

          .landing-body .logo-tagline {
            display: none !important;
          }

          .landing-body .nav-actions {
            gap: 8px !important;
          }

          .landing-body .nav-actions .primary-btn {
            padding: 8px 14px !important;
            font-size: 0.82rem !important;
            border-radius: 12px !important;
          }

          .landing-body .nav-actions .logout-btn {
            display: none !important;
          }

          .landing-body .theme-switch {
            width: 48px !important;
            height: 26px !important;
            padding: 2px !important;
          }

          .landing-body .theme-switch-indicator {
            width: 20px !important;
            height: 20px !important;
            top: 2px !important;
            left: 2px !important;
          }

          .landing-body .theme-switch-icon {
            width: 20px !important;
            height: 20px !important;
          }

          .landing-body .hero-actions {
            flex-direction: column;
            gap: 12px !important;
            width: 100%;
          }

          .landing-body .hero-actions .primary-btn,
          .landing-body .hero-actions .secondary-btn {
            width: 100% !important;
            padding: 14px 20px !important;
            font-size: 1rem !important;
            border-radius: 16px !important;
          }
        }

        .preview-grid-container {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 60px;
          align-items: center;
        }

        .preview-left-column {
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 20px 0;
          box-sizing: border-box;
        }

        .preview-right-column {
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: left;
        }

        @media (max-width: 980px) {
          .preview-grid-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .preview-right-column {
            order: -1;
            text-align: center;
            align-items: center;
          }
          
          .preview-right-column .label,
          .preview-right-column .title,
          .preview-right-column .desc {
            text-align: center !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }

        /* GitHub Magic Card Widget */
        .github-magic-card {
          background: #0d1117;
          border: 1px solid rgba(240, 246, 252, 0.1);
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          width: 100%;
          transition: all 0.3s ease;
        }

        .github-repo-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(240, 246, 252, 0.1);
          padding-bottom: 14px;
          margin-bottom: 20px;
        }

        .github-repo-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e6edf3;
          font-size: 0.98rem;
          font-weight: 600;
        }

        .github-public-tag {
          font-size: 0.75rem;
          color: #8b949e;
          border: 1px solid rgba(240, 246, 252, 0.15);
          padding: 2px 8px;
          border-radius: 20px;
          background: rgba(240, 246, 252, 0.05);
        }

        .github-branch-selector {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #8b949e;
          background: rgba(240, 246, 252, 0.05);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(240, 246, 252, 0.1);
        }

        /* GitHub Commit List styles */
        .github-commit-group {
          margin-top: 10px;
          text-align: left;
        }

        .github-group-title {
          font-size: 0.86rem;
          color: #8b949e;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .github-commit-box {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 6px;
          overflow: hidden;
        }

        .github-commit-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          border-bottom: 1px solid #30363d;
          background: #0d1117;
          transition: background 0.2s ease;
        }

        .github-commit-row:last-child {
          border-bottom: none;
        }

        .github-commit-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-width: 78%;
        }

        .github-commit-title {
          color: #c9d1d9;
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .github-commit-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: #8b949e;
        }

        .github-avatar-mock {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #388bfd;
          color: white;
          font-size: 0.65rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
        }

        .github-author {
          font-weight: 600;
          color: #c9d1d9;
        }

        .github-action-text {
          color: #8b949e;
        }

        .github-status-check {
          color: #3fb950;
          font-weight: bold;
          font-size: 0.85rem;
        }

        .github-commit-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .github-hash-btn {
          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
          font-size: 0.78rem;
          color: #58a6ff;
          background: rgba(56, 139, 253, 0.1);
          border: 1px solid rgba(56, 139, 253, 0.2);
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 500;
        }

        .github-action-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          border: 1px solid #30363d;
          background: #21262d;
          color: #8b949e;
        }

        /* AI Processor */
        .ai-pulse-core {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--primary) 0%, rgba(167, 139, 250, 0.3) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 24px rgba(79, 140, 255, 0.35);
          position: relative;
          z-index: 5;
        }

        .ai-pulse-core::before {
          content: '';
          position: absolute;
          inset: -7px;
          border-radius: 50%;
          border: 2px dashed rgba(79, 140, 255, 0.4);
          animation: spin-clockwise 12s linear infinite;
        }

        .ai-pulse-core.processing::before {
          animation: spin-clockwise 2s linear infinite;
          border-color: #a78bfa;
        }

        .ai-pulse-core::after {
          content: '';
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          border: 1px solid rgba(79, 140, 255, 0.1);
        }

        /* Resume Magic Card Mockup */
        .resume-magic-card {
          background: #ffffff !important;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 40px 36px;
          color: #0f172a !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          width: 100%;
          position: relative;
          overflow: visible;
          text-align: left;
          transition: all 0.3s ease;
        }

        .resume-header {
          text-align: center;
          border-bottom: 2px solid #cbd5e1;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }

        .resume-name {
          font-family: serif;
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #0f172a !important;
          text-transform: uppercase;
        }

        .resume-title-sub {
          font-size: 0.82rem;
          color: #475569 !important;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .resume-section-title {
          font-size: 0.85rem;
          color: #1e293b !important;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .resume-job-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.92rem;
          font-weight: 700;
          color: #1e293b !important;
          margin-bottom: 8px;
        }

        .resume-job-date {
          color: #64748b !important;
          font-weight: 500;
        }

        .resume-bullet-point {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #334155 !important;
          margin-bottom: 10px;
          display: flex;
          gap: 8px;
        }

        .resume-bullet-point strong {
          color: #0f172a !important;
          font-weight: 700 !important;
        }

        .resume-bullet-point::before {
          content: "•";
          color: var(--primary);
          font-weight: 900;
          font-size: 1.1rem;
          line-height: 1.1;
        }

        /* Floating ATS Badge */
        .ats-badge-hud {
          position: absolute;
          top: -12px;
          right: 18px;
          background: #10b981;
          color: white;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
          z-index: 10;
        }

        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` }} />

      <div className="landing-body">
        {/* Navigation */}
        <nav>
          <div className="container nav-inner">
            <div className="logo">
              <svg viewBox="0 0 32 32" className="logo-icon-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 6C7 4.34315 8.34315 3 10 3H19L25 9V26C25 27.6569 23.6569 29 22 29H10C8.34315 29 7 27.6569 7 26V6Z" className="logo-doc-body" />
                <path d="M19 3V9H25L19 3Z" className="logo-doc-fold" />
                <path d="M11 13H17M11 17H21M11 21H18M11 25H20" className="logo-doc-lines" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 8.5L25 3.5" className="logo-flag-pole" strokeWidth="2" strokeLinecap="round" />
                <path d="M25 3.5L27 6.5L23.5 5.5Z" className="logo-flag-banner" />
              </svg>
              <div className="logo-text-group">
                <div className="logo-wordmark">RESUMMIT</div>
                <div className="logo-tagline">YOUR COMMITS. YOUR CAREER.</div>
              </div>
            </div>

            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#workflow">Workflow</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
            </div>

            <div className="nav-actions" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button 
                className="theme-switch" 
                onClick={toggleTheme} 
                aria-label="Toggle theme"
              >
                <span 
                  className="theme-switch-indicator" 
                  style={{ transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(0px)' }} 
                />
                <div className="theme-switch-icon sun-icon" style={{ opacity: theme === 'light' ? 1 : 0.35 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                </div>
                <div className="theme-switch-icon moon-icon" style={{ opacity: theme === 'dark' ? 1 : 0.35 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                </div>
              </button>
              {hasSession ? (
                <>
                  <Link href="/dashboard" className="primary-btn">Go to Dashboard</Link>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      signOut({ callbackUrl: "/" });
                    }}
                    className="logout-btn"
                  >
                    Sign Out
                  </a>
                </>
              ) : (
                <Link href="/login" className="primary-btn">Connect GitHub</Link>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div ref={glowRef} className="glow" style={{ top: "-220px", right: "-220px", willChange: "transform" }}></div>
          <div className="container hero-grid">
            <div className="reveal">
              <div className="badge">
                <div className="dot"></div>
                GitHub-powered resume intelligence
              </div>

              <h1>
                Your GitHub already proves <br />
                your experience in
                <span className="gradient-text" style={{ display: "block", height: "2.05em", marginTop: "8px", overflow: "hidden" }}>
                  {twText}
                  <span className="typewriter-cursor">&nbsp;</span>
                </span>
              </h1>

              <p>
                Resummit analyzes repositories, commits, technologies, and project structures
                to generate clean, recruiter-ready resumes from the work you already built.
              </p>

              <div className="hero-actions">
                <Link href={hasSession ? "/dashboard" : "/login"} className="primary-btn">{hasSession ? "Go to Dashboard" : "Get Started — It's Free"}</Link>
                <button 
                  onClick={() => {
                    const element = document.getElementById("preview-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="secondary-btn"
                  style={{ cursor: "pointer" }}
                >
                  See Resume Preview
                </button>
              </div>

              {/* Trust line */}
              <div style={{ display: "flex", alignItems: "center", gap: "18px", marginTop: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "14px", height: "14px", color: "#10b981", flexShrink: 0 }}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Free to start · No credit card required
                </span>
                <span style={{ fontSize: "0.82rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "14px", height: "14px", color: "#10b981", flexShrink: 0 }}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Read-only GitHub access · Never writes to your repos
                </span>
              </div>

              {/* Social proof badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginTop: "20px", padding: "10px 18px", borderRadius: "100px", background: "rgba(79,140,255,0.08)", border: "1px solid rgba(79,140,255,0.2)" }}>
                <div style={{ display: "flex", gap: "-6px" }}>
                  {["🧑‍💻","👩‍💻","🧑‍🎓"].map((e, i) => (
                    <span key={i} style={{ fontSize: "1.1rem", marginLeft: i > 0 ? "-4px" : 0 }}>{e}</span>
                  ))}
                </div>
                <span style={{ fontSize: "0.82rem", color: "var(--muted)", fontWeight: 600 }}>
                  Joined by <span style={{ color: "var(--primary)", fontWeight: 700 }}>developers</span> from 10+ countries since launch
                </span>
              </div>
            </div>

            <div className="preview reveal">
              <div className="preview-header">
                <strong>Live Resume Generation</strong>
                <span style={{ color: "var(--muted)" }}>Real project analysis</span>
              </div>

              <div className="preview-body">
                <div className="code">
                  {"$ resummit analyze github/dragon486\n\n"}
                  {"→ Reading repositories\n"}
                  {"→ Detecting frameworks & languages\n"}
                  {"→ Parsing project structures\n"}
                  {"→ Generating professional resume bullets\n\n"}
                  {"✓ Resume generated successfully\n\n"}
                  {"• Built AI-based sentiment analysis systems\n"}
                  {"• Developed scalable Next.js applications\n"}
                  {"• Integrated Redis caching infrastructure\n"}
                  {"• Automated meeting summarization workflows"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resume Preview Section */}
        <section className="section" id="preview-section" style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "100px 0 130px 0" }}>
          <div className="container preview-grid-container" ref={resumeContainerRef}>
            
            {/* Left Column: Interactive CV Preview */}
            <div className="reveal preview-left-column">
              <div 
                className="resume-preview-wrapper"
                style={isMounted ? {
                  width: `${794 * resumeScale}px`,
                  height: `${1123 * resumeScale}px`,
                } : {}}
              >
                <div 
                  className="resume-preview-sheet"
                  style={isMounted ? {
                    transform: `scale(${resumeScale})`,
                    transformOrigin: "top left",
                  } : {}}
                >
                  {/* Resume Header */}
                  <div style={{ textAlign: "center", marginBottom: "14px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "bold", margin: "0 0 4px 0", color: "#0f172a", fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "1px" }}>ALEX DEVELOPER</h2>
                    <div style={{ fontSize: "11px", color: "#475569", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px", fontFamily: "'Times New Roman', Georgia, serif" }}>
                      <span>Jalandhar, Punjab, India (Open to Remote)</span>
                      <span>•</span>
                      <span>alex.developer@email.com</span>
                      <span>•</span>
                      <span>+91 98765 43210</span>
                      <span>•</span>
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>github.com/alex-dev</a>
                      <span>•</span>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>linkedin.com/in/alex-developer</a>
                    </div>
                  </div>

                  {/* Technical Summary */}
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{
                      fontSize: "11.5px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderTop: "1.5px solid #0f172a",
                      paddingTop: "4px",
                      marginBottom: "6px",
                      color: "#0f172a",
                      fontFamily: "'Times New Roman', Georgia, serif"
                    }}>
                      TECHNICAL SUMMARY
                    </div>
                    <p style={{ margin: 0, color: "#334155", fontSize: "10.5px", lineHeight: "1.4", fontFamily: "'Times New Roman', Georgia, serif", textAlign: "justify" }}>
                      Innovative Full-Stack Software Engineer expert in building high-throughput distributed systems and AI capabilities. Proficient in Python, JavaScript, and TypeScript with deep hands-on expertise in Next.js, Node.js, Flask, Prisma, and AWS. Adept at transforming complex data streams and model inference into clean, production-grade applications that drive business value.
                    </p>
                  </div>

                  {/* Technical Skills */}
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{
                      fontSize: "11.5px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderTop: "1.5px solid #0f172a",
                      paddingTop: "4px",
                      marginBottom: "6px",
                      color: "#0f172a",
                      fontFamily: "'Times New Roman', Georgia, serif"
                    }}>
                      TECHNICAL SKILLS
                    </div>
                    <div style={{ margin: 0, color: "#334155", fontSize: "10.5px", lineHeight: "1.4", fontFamily: "'Times New Roman', Georgia, serif" }}>
                      <div style={{ margin: "2px 0" }}><strong>Languages:</strong> Python, JavaScript, TypeScript</div>
                      <div style={{ margin: "2px 0" }}><strong>Frameworks:</strong> Next.js, Node.js, React, Express, Flask, Django</div>
                      <div style={{ margin: "2px 0" }}><strong>Tools &amp; Platforms:</strong> AWS, PostgreSQL, Git, Docker, TensorFlow, OpenCV, Prisma, Redis, MongoDB, Jupyter, Slack, Bolt.io</div>
                    </div>
                  </div>

                  {/* Professional Experience */}
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{
                      fontSize: "11.5px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderTop: "1.5px solid #0f172a",
                      paddingTop: "4px",
                      marginBottom: "6px",
                      color: "#0f172a",
                      fontFamily: "'Times New Roman', Georgia, serif"
                    }}>
                      PROFESSIONAL EXPERIENCE
                    </div>
                    
                    <div style={{ marginBottom: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#0f172a", fontSize: "11.5px", marginBottom: "2px", fontFamily: "'Times New Roman', Georgia, serif" }}>
                        <span>Software &amp; AI Engineer Intern</span>
                        <span>Mar 2026 — Present</span>
                      </div>
                      <div style={{ fontSize: "10.5px", color: "#475569", fontStyle: "italic", marginBottom: "3px", fontFamily: "'Times New Roman', Georgia, serif" }}>AI Innovation Labs (Remote)</div>
                      <ul style={{ margin: "0 0 0 14px", padding: 0, listStyleType: "disc", color: "#334155", fontSize: "10.5px", lineHeight: "1.35", fontFamily: "'Times New Roman', Georgia, serif" }}>
                        <li style={{ marginBottom: "2px" }}>Designed AI-powered customer support chatbot systems using Python and TensorFlow, increasing support ticket resolution efficiency by 34%.</li>
                        <li style={{ marginBottom: "2px" }}>Implemented classification algorithms in Python for predictive modeling of user engagement patterns, yielding a 12% boost in retention.</li>
                        <li style={{ marginBottom: "2px" }}>Automated functional QA scripts using Selenium WebDriver, cutting regression test duration by 60%.</li>
                      </ul>
                    </div>

                    <div style={{ marginBottom: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#0f172a", fontSize: "11.5px", marginBottom: "2px", fontFamily: "'Times New Roman', Georgia, serif" }}>
                        <span>Junior Software Engineer</span>
                        <span>Jun 2025 — Aug 2025</span>
                      </div>
                      <div style={{ fontSize: "10.5px", color: "#475569", fontStyle: "italic", marginBottom: "3px", fontFamily: "'Times New Roman', Georgia, serif" }}>Oros AI Solutions</div>
                      <ul style={{ margin: "0 0 0 14px", padding: 0, listStyleType: "disc", color: "#334155", fontSize: "10.5px", lineHeight: "1.35", fontFamily: "'Times New Roman', Georgia, serif" }}>
                        <li style={{ marginBottom: "2px" }}>Engineered and scaled a Node.js/Express backend serving 15,000+ active concurrent users with 99.9% uptime, reducing server response latency by 28%.</li>
                        <li style={{ marginBottom: "2px" }}>Built and documented a high-performance RESTful Django API for microservices, increasing data sync speeds by 40%.</li>
                        <li style={{ marginBottom: "2px" }}>Integrated automated integration tests using Pytest and Behave, boosting pipeline code coverage to 92%.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Technical Projects */}
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{
                      fontSize: "11.5px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderTop: "1.5px solid #0f172a",
                      paddingTop: "4px",
                      marginBottom: "6px",
                      color: "#0f172a",
                      fontFamily: "'Times New Roman', Georgia, serif"
                    }}>
                      TECHNICAL PROJECTS
                    </div>
                    
                    <div style={{ marginBottom: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#0f172a", fontSize: "11.5px", marginBottom: "2px", fontFamily: "'Times New Roman', Georgia, serif" }}>
                        <span>Nexio</span>
                        <span style={{ fontStyle: "italic", fontWeight: "normal", color: "#475569", fontSize: "10.5px" }}>Python, TensorFlow</span>
                      </div>
                      <p style={{ margin: "0 0 4px 0", color: "#334155", fontSize: "10.5px", lineHeight: "1.35", fontFamily: "'Times New Roman', Georgia, serif", textAlign: "justify" }}>
                        Nexio is a high-density, multi-tenant AI ecosystem designed for hyper-growth sales teams, combining professional CRM capabilities with a distributed Neural Persona engine.
                      </p>
                      <ul style={{ margin: "0 0 0 14px", padding: 0, listStyleType: "disc", color: "#334155", fontSize: "10.5px", lineHeight: "1.35", fontFamily: "'Times New Roman', Georgia, serif" }}>
                        <li style={{ marginBottom: "2px" }}>Automated intent scoring using TensorFlow and asynchronous workers results in sub-500ms response times for lead intake.</li>
                        <li style={{ marginBottom: "2px" }}>Distributed idempotency ensured through Redis-backed locking and atomic MongoDB logic, preventing re-execution during retry storms.</li>
                      </ul>
                    </div>

                    <div style={{ marginBottom: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#0f172a", fontSize: "11.5px", marginBottom: "2px", fontFamily: "'Times New Roman', Georgia, serif" }}>
                        <span>Billiq</span>
                        <span style={{ fontStyle: "italic", fontWeight: "normal", color: "#475569", fontSize: "10.5px" }}>Next.js, Prisma</span>
                      </div>
                      <p style={{ margin: "0 0 4px 0", color: "#334155", fontSize: "10.5px", lineHeight: "1.35", fontFamily: "'Times New Roman', Georgia, serif", textAlign: "justify" }}>
                        Billiq is an intelligent, hardware-free POS and digital billing platform that sends instant receipts via WhatsApp, manages kitchen workflows with a real-time KDS, and uses transaction data for automated customer marketing.
                      </p>
                      <ul style={{ margin: "0 0 0 14px", padding: 0, listStyleType: "disc", color: "#334155", fontSize: "10.5px", lineHeight: "1.35", fontFamily: "'Times New Roman', Georgia, serif" }}>
                        <li style={{ marginBottom: "2px" }}>Utilizes Prisma ORM to manage database schema and Next.js App Router for server-side rendering, enabling seamless integration of real-time analytics with the POS system.</li>
                        <li style={{ marginBottom: "2px" }}>Leverages Server-Sent Events (SSE) to deliver instant receipts via WhatsApp without requiring app installs, improving customer satisfaction and reducing support queries.</li>
                      </ul>
                    </div>

                    <div style={{ marginBottom: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#0f172a", fontSize: "11.5px", marginBottom: "2px", fontFamily: "'Times New Roman', Georgia, serif" }}>
                        <span>Clustering-Crop-Health-Patterns-from-Multispectral-Satellite-Imagery</span>
                        <span style={{ fontStyle: "italic", fontWeight: "normal", color: "#475569", fontSize: "10.5px" }}>Python</span>
                      </div>
                      <p style={{ margin: "0 0 4px 0", color: "#334155", fontSize: "10.5px", lineHeight: "1.35", fontFamily: "'Times New Roman', Georgia, serif", textAlign: "justify" }}>
                        Automates crop health pattern discovery from multispectral satellite imagery using unsupervised machine learning, enabling data-driven insights for agricultural decision-making.
                      </p>
                      <ul style={{ margin: "0 0 0 14px", padding: 0, listStyleType: "disc", color: "#334155", fontSize: "10.5px", lineHeight: "1.35", fontFamily: "'Times New Roman', Georgia, serif" }}>
                        <li style={{ marginBottom: "2px" }}>Applies three clustering algorithms (K-Means, HDBSCAN, GMM) to a seven-index spectral feature space in Python.</li>
                        <li style={{ marginBottom: "2px" }}>Generates actionable heat maps and yield predictions without requiring labelled training data.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Education */}
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{
                      fontSize: "11.5px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderTop: "1.5px solid #0f172a",
                      paddingTop: "4px",
                      marginBottom: "6px",
                      color: "#0f172a",
                      fontFamily: "'Times New Roman', Georgia, serif"
                    }}>
                      EDUCATION
                    </div>
                    
                    <div style={{ marginBottom: "3px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#0f172a", fontSize: "11.5px", marginBottom: "2px", fontFamily: "'Times New Roman', Georgia, serif" }}>
                        <span>B.Tech Computer Science AI &amp; ML</span>
                        <span>Expected 2027</span>
                      </div>
                      <div style={{ fontSize: "10.5px", color: "#475569", fontStyle: "italic", fontFamily: "'Times New Roman', Georgia, serif" }}>LPU Technical Academy</div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#0f172a", fontSize: "11.5px", marginBottom: "2px", fontFamily: "'Times New Roman', Georgia, serif" }}>
                        <span>High School Graduation (Science / PCM Stream)</span>
                        <span>Jun 2021 — May 2023</span>
                      </div>
                      <div style={{ fontSize: "10.5px", color: "#475569", fontStyle: "italic", fontFamily: "'Times New Roman', Georgia, serif" }}>Sarvodaya Central Academy • CBSE Board • Percentage: 75%</div>
                    </div>
                  </div>

                  {/* Achievements & Certifications */}
                  <div>
                    <div style={{
                      fontSize: "11.5px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderTop: "1.5px solid #0f172a",
                      paddingTop: "4px",
                      marginBottom: "6px",
                      color: "#0f172a",
                      fontFamily: "'Times New Roman', Georgia, serif"
                    }}>
                      ACHIEVEMENTS &amp; CERTIFICATIONS
                    </div>
                    <div style={{ fontSize: "10.5px", color: "#334155", lineHeight: "1.4", fontFamily: "'Times New Roman', Georgia, serif" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                        <span>• Cloud Integration Specialist Certification <a href="https://credly.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#1a0dab", fontWeight: "bold", cursor: "pointer" }}>[Link]</a></span>
                        <span style={{ fontWeight: "bold" }}>Dec 2025</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                        <span>• freeCodeCamp Responsive Web Design Developer Certification <a href="https://freecodecamp.org" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#1a0dab", fontWeight: "bold", cursor: "pointer" }}>[Link]</a></span>
                        <span style={{ fontWeight: "bold" }}>2025</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                        <span>• Open-Source Hackathon Participation Certificate <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#1a0dab", fontWeight: "bold", cursor: "pointer" }}>[Link]</a></span>
                        <span style={{ fontWeight: "bold" }}>2025</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                        <span>• Computational Systems &amp; Finite Automata Excellence <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#1a0dab", fontWeight: "bold", cursor: "pointer" }}>[Link]</a></span>
                        <span style={{ fontWeight: "bold" }}>2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Copy & Micro-Features */}
            <div className="reveal preview-right-column" style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "600px", margin: "0 auto" }}>
              <div>
                <div className="label" style={{ textAlign: "left", margin: "0 0 12px 0", fontSize: "0.9rem" }}>Interactive Output</div>
                <h2 className="title" style={{ textAlign: "left", margin: "0 0 20px 0", fontSize: "clamp(2.8rem, 4.8vw, 3.8rem)", lineHeight: "1.1", fontWeight: "800", color: "var(--text)" }}>
                  Recruiter-Ready.<br />ATS-Optimized.
                </h2>
                <p className="desc" style={{ textAlign: "left", margin: "0", fontSize: "1.25rem", color: "var(--muted)", lineHeight: "1.7" }}>
                  Here is a real resume generated from developer commits. It uses professional formatting, clean sections, and is fully optimized for Applicant Tracking Systems (ATS).
                </p>
              </div>

              {/* Premium Feature Items */}
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "28px" }}>
                <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
                  <div style={{ background: "rgba(79, 140, 255, 0.1)", color: "var(--primary)", padding: "14px", borderRadius: "12px", display: "flex", flexShrink: 0 }}>
                    <Cpu size={26} />
                  </div>
                  <div>
                    <h4 style={{ color: "var(--text)", fontWeight: "700", fontSize: "1.28rem", marginBottom: "6px" }}>AI Bullets Generation</h4>
                    <p style={{ color: "var(--muted)", fontSize: "1.06rem", lineHeight: "1.6" }}>Parses your GitHub commits to write structured, accomplishment-focused resume points automatically.</p>
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
                  <div style={{ background: "rgba(79, 140, 255, 0.1)", color: "var(--primary)", padding: "14px", borderRadius: "12px", display: "flex", flexShrink: 0 }}>
                    <FileCheck size={26} />
                  </div>
                  <div>
                    <h4 style={{ color: "var(--text)", fontWeight: "700", fontSize: "1.28rem", marginBottom: "6px" }}>ATS Parser Certified</h4>
                    <p style={{ color: "var(--muted)", fontSize: "1.06rem", lineHeight: "1.6" }}>Conforms strictly to single-page PDF structures, typography limits, and machine-readable content rules.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Stats Strip */}
        <div className="stats-strip" ref={statsRef}>
          <div className="container stats-strip-inner">
            <div className="stat-item reveal">
              <div className="stat-badge-row">
                <div className="stat-number">{count1}+</div>
                <div className="stat-icon-container">
                  <FileCheck />
                </div>
              </div>
              <div className="stat-label-title">Resumes Generated</div>
              <div className="stat-sublabel-desc">Crafted by developers to secure interviews at top tech companies.</div>
            </div>
            
            <div className="stat-item reveal" style={{ transitionDelay: "100ms" }}>
              <div className="stat-badge-row">
                <div className="stat-number">{count2}+</div>
                <div className="stat-icon-container">
                  <Globe />
                </div>
              </div>
              <div className="stat-label-title">Countries Reached</div>
              <div className="stat-sublabel-desc">Helping engineers build global careers across multiple continents.</div>
            </div>
            
            <div className="stat-item reveal" style={{ transitionDelay: "200ms" }}>
              <div className="stat-badge-row">
                <div className="stat-number">&lt;{count3}s</div>
                <div className="stat-icon-container">
                  <Sparkles />
                </div>
              </div>
              <div className="stat-label-title">Generation Time</div>
              <div className="stat-sublabel-desc">Instantly parsed from public repository commit histories.</div>
            </div>
            
            <div className="stat-item reveal" style={{ transitionDelay: "300ms" }}>
              <div className="stat-badge-row">
                <div className="stat-number">100%</div>
                <div className="stat-icon-container">
                  <KeyRound />
                </div>
              </div>
              <div className="stat-label-title">Free to Start</div>
              <div className="stat-sublabel-desc">Sign up today and sync your GitHub without any credit card.</div>
            </div>
          </div>
        </div>

        {/* Tech Logo Marquee */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...TECH_LOGOS, ...TECH_LOGOS].map((t, i) => (
              <div key={i} className="marquee-item">
                {t.logo}
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
        <section ref={magicRef} className="section reveal" style={{ padding: "140px 0", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
          {/* Decorative Background Glows */}
          <div className="magic-bg-glow-1" />
          <div className="magic-bg-glow-2" />
          <div className="container">
            <div className="section-head reveal" style={{ marginBottom: "58px" }}>
              <div className="label">The Magic</div>
              <div className="title">
                From raw commit<br />to recruiter-ready bullet
              </div>
              <div className="desc">
                Resummit reads what you actually built — and translates it into the professional language recruiters expect.
              </div>
            </div>

            <div className="magic-grid">

              {/* Before: Realistic GitHub Commits Widget */}
              <motion.div 
                className="github-magic-card reveal" 
                animate={{
                  borderColor: magicStep === 0 || magicStep === 3 ? "rgba(79, 140, 255, 0.35)" : "rgba(240, 246, 252, 0.1)",
                  opacity: magicStep === 2 ? 0.65 : 1
                }}
                transition={{ duration: 0.5 }}
                style={{ padding: "18px 20px" }}
              >
                <div className="github-repo-header" style={{ marginBottom: "14px", paddingBottom: "10px" }}>
                  <div className="github-repo-title">
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ color: "#8b949e" }}>
                      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1.5 1.5 0 0 1 1.5-1.5h7.5z" />
                    </svg>
                    <span style={{ color: "#e6edf3" }}>weather-app</span>
                    <span className="github-public-tag">Public</span>
                  </div>
                  <div className="github-branch-selector">
                    <GitBranch size={12} />
                    <span>main</span>
                  </div>
                </div>

                <div className="github-commit-group">
                  <div className="github-group-title">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style={{ marginRight: '6px', opacity: 0.7 }}>
                      <path d="M10.5 7.75a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm1.43.072a4.002 4.002 0 0 0-7.86 0H.75a.75.75 0 0 0 0 1.5h3.32a4.002 4.002 0 0 0 7.86 0h3.32a.75.75 0 0 0 0-1.5h-3.32Z" />
                    </svg>
                    Commits on Jun 7, 2026
                  </div>

                  <div className="github-commit-box">
                    {/* Commit 1 */}
                    <motion.div 
                      className="github-commit-row"
                      variants={leftItemVariants}
                      custom={0.1}
                      animate={magicStep === 0 || magicStep === 3 ? "visible" : "dimmed"}
                    >
                      <div className="github-commit-left">
                        <div className="github-commit-title">
                          feat: add weather api integration
                        </div>
                        <div className="github-commit-meta">
                          <div className="github-avatar-mock" style={{ background: "#388bfd" }}>A</div>
                          <span className="github-author">Adel-muhammed</span>
                          <span className="github-action-text">committed 4 hours ago</span>
                          <span className="github-status-check">✓</span>
                        </div>
                      </div>
                      <div className="github-commit-right">
                        <span className="github-hash-btn">a3f2c1e</span>
                        <span className="github-action-icon">
                          <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>
                        </span>
                        <span className="github-action-icon">
                          <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor"><path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L13.94 8l-3.72-3.72a.75.75 0 0 1 1.06-1.06Zm-6.56 0a.75.75 0 0 1 0 1.06L1.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L-.53 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"/></svg>
                        </span>
                      </div>
                    </motion.div>

                    {/* Commit 2 */}
                    <motion.div 
                      className="github-commit-row"
                      variants={leftItemVariants}
                      custom={0.4}
                      animate={magicStep === 0 || magicStep === 3 ? "visible" : "dimmed"}
                    >
                      <div className="github-commit-left">
                        <div className="github-commit-title">
                          fix: render bug on mobile
                        </div>
                        <div className="github-commit-meta">
                          <div className="github-avatar-mock" style={{ background: "#388bfd" }}>A</div>
                          <span className="github-author">Adel-muhammed</span>
                          <span className="github-action-text">committed 4 hours ago</span>
                          <span className="github-status-check">✓</span>
                        </div>
                      </div>
                      <div className="github-commit-right">
                        <span className="github-hash-btn">b8e4d2f</span>
                        <span className="github-action-icon">
                          <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>
                        </span>
                        <span className="github-action-icon">
                          <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor"><path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L13.94 8l-3.72-3.72a.75.75 0 0 1 1.06-1.06Zm-6.56 0a.75.75 0 0 1 0 1.06L1.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L-.53 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"/></svg>
                        </span>
                      </div>
                    </motion.div>

                    {/* Commit 3 */}
                    <motion.div 
                      className="github-commit-row"
                      variants={leftItemVariants}
                      custom={0.7}
                      animate={magicStep === 0 || magicStep === 3 ? "visible" : "dimmed"}
                    >
                      <div className="github-commit-left">
                        <div className="github-commit-title">
                          feat: hook up openweather api
                        </div>
                        <div className="github-commit-meta">
                          <div className="github-avatar-mock" style={{ background: "#388bfd" }}>A</div>
                          <span className="github-author">Adel-muhammed</span>
                          <span className="github-action-text">committed 4 hours ago</span>
                          <span className="github-status-check">✓</span>
                        </div>
                      </div>
                      <div className="github-commit-right">
                        <span className="github-hash-btn">c9a1b3d</span>
                        <span className="github-action-icon">
                          <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>
                        </span>
                        <span className="github-action-icon">
                          <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor"><path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L13.94 8l-3.72-3.72a.75.75 0 0 1 1.06-1.06Zm-6.56 0a.75.75 0 0 1 0 1.06L1.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L-.53 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"/></svg>
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Arrow / AI Synth Engine */}
              <div className="magic-arrow-container">
                <motion.div 
                  className={`ai-pulse-core ${magicStep === 1 ? 'processing' : ''}`}
                  animate={magicStep === 1 ? { 
                    scale: [1, 1.12, 1],
                    boxShadow: ["0 0 15px rgba(79,140,255,0.3)", "0 0 35px rgba(167,139,250,0.8)", "0 0 15px rgba(79,140,255,0.3)"]
                  } : {}}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles size={22} style={{ color: "white" }} />
                </motion.div>
                <motion.span 
                  animate={magicStep === 1 ? { color: ["var(--primary)", "#a78bfa", "var(--primary)"] } : {}}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", whiteSpace: "nowrap", marginTop: "4px" }}
                >
                  AI Synthesis
                </motion.span>
              </div>

              {/* After: Professional Resume Preview */}
              <motion.div 
                className="resume-magic-card reveal" 
                animate={{
                  opacity: magicStep === 2 || magicStep === 3 ? 1 : 0.25,
                  filter: magicStep === 2 || magicStep === 3 ? "none" : "blur(1.5px)",
                  borderColor: magicStep === 2 || magicStep === 3 ? "#cbd5e1" : "#e2e8f0",
                  boxShadow: magicStep === 3 
                    ? "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 30px rgba(16, 185, 129, 0.1)" 
                    : "0 10px 25px rgba(0, 0, 0, 0.08)"
                }}
                transition={{ duration: 0.5 }}
              >
                {/* Floating ATS Badge */}
                {magicStep === 3 && (
                  <motion.div 
                    className="ats-badge-hud"
                    initial={{ scale: 0, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    ATS Grade: A+
                  </motion.div>
                )}

                <div className="resume-header">
                  <div className="resume-name">Alex Carter</div>
                  <div className="resume-title-sub">Software Engineer</div>
                </div>

                <div className="resume-section-title">Projects</div>
                <div className="resume-job-meta">
                  <span>weather-app — Creator & Developer</span>
                  <span className="resume-job-date">2026</span>
                </div>

                {/* Bullet 1 */}
                <motion.div 
                  className="resume-bullet-point"
                  variants={rightItemVariants}
                  custom={0.1}
                  animate={magicStep >= 2 ? "visible" : "hiddenInstant"}
                >
                  <span>Developed a <strong>weather forecasting application</strong> using React and the OpenWeather API to provide real-time weather information.</span>
                </motion.div>

                {/* Bullet 2 */}
                <motion.div 
                  className="resume-bullet-point"
                  variants={rightItemVariants}
                  custom={0.5}
                  animate={magicStep >= 2 ? "visible" : "hiddenInstant"}
                >
                  <span>Integrated <strong>external API services</strong> and implemented dynamic data rendering for live forecast updates.</span>
                </motion.div>

                {/* Bullet 3 */}
                <motion.div 
                  className="resume-bullet-point"
                  variants={rightItemVariants}
                  custom={0.9}
                  animate={magicStep >= 2 ? "visible" : "hiddenInstant"}
                >
                  <span>Improved <strong>mobile responsiveness</strong> by resolving rendering issues and optimizing the interface across devices.</span>
                </motion.div>
              </motion.div>
            </div>

            {/* CTA under transformation */}
            <div className="reveal" style={{ textAlign: "center", marginTop: "48px" }}>
              <Link href={hasSession ? "/dashboard" : "/login"} className="primary-btn" style={{ display: "inline-flex" }}>
                {hasSession ? "Generate My Resume" : "Try It Free — Connect GitHub"}
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section" id="features">
          <div className="container">
            <div className="section-head reveal">
              <div className="label">Features</div>
              <div className="title">
                Built for developers,<br />
                not generic templates.
              </div>
              <div className="desc">
                Professional resume generation powered directly by your repositories,
                projects, and engineering work.
              </div>
            </div>

            <div className="cards">
              <motion.div className="card reveal" whileHover="hover">
                <div className="card-icon-wrapper">
                  <motion.div 
                    className="card-icon-container"
                    variants={{
                      hover: { scale: 1.15, rotate: 8 }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  >
                    <GitBranch className="icon-style" />
                  </motion.div>
                </div>
                <h3>GitHub Sync</h3>
                <p>
                  Secure OAuth integration that reads repositories, commits,
                  README files, and technologies automatically.
                </p>
              </motion.div>

              <motion.div className="card reveal" whileHover="hover">
                <div className="card-icon-wrapper">
                  <motion.div 
                    className="card-icon-container"
                    variants={{
                      hover: { scale: 1.15, rotate: 8 }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  >
                    <Brain className="icon-style" />
                  </motion.div>
                </div>
                <h3>AI Resume Writing</h3>
                <p>
                  Generate recruiter-friendly resume bullets from the systems,
                  projects, and workflows you've actually built.
                </p>
              </motion.div>

              <motion.div className="card reveal" whileHover="hover">
                <div className="card-icon-wrapper">
                  <motion.div 
                    className="card-icon-container"
                    variants={{
                      hover: { scale: 1.15, rotate: 8 }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  >
                    <FileDown className="icon-style" />
                  </motion.div>
                </div>
                <h3>PDF Export</h3>
                <p>
                  Export clean, professional resumes with consistent formatting
                  and ATS-friendly layouts.
                </p>
              </motion.div>
            </div>

            {/* Workflow anchor inside unified section */}
            <div id="workflow" style={{ position: "relative", top: "-100px" }} />

            {/* Subsection divider/title */}
            <div className="reveal" style={{ marginTop: "110px", marginBottom: "50px" }}>
              <div className="label" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>How it works</div>
              <h3 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: "800", color: "var(--text)", letterSpacing: "-0.04em", margin: 0 }}>
                Fast workflow. Minimal friction.
              </h3>
            </div>

            <div className="workflow">
              <motion.div 
                className="workflow-step-card reveal" 
                whileHover="hover"
              >
                <div className="step-badge-row">
                  <span className="step-number">01</span>
                  <motion.div 
                    className="step-icon-container"
                    variants={{ hover: { scale: 1.1, rotate: 360 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <KeyRound />
                  </motion.div>
                </div>
                <h3>Secure Connect</h3>
                <p>Connect GitHub securely using OAuth authentication.</p>
              </motion.div>

              <motion.div 
                className="workflow-step-card reveal" 
                whileHover="hover"
              >
                <div className="step-badge-row">
                  <span className="step-number">02</span>
                  <motion.div 
                    className="step-icon-container"
                    variants={{ hover: { scale: 1.1, y: -2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Terminal />
                  </motion.div>
                </div>
                <h3>Smart Analysis</h3>
                <p>Repositories and technologies are analyzed automatically.</p>
              </motion.div>

              <motion.div 
                className="workflow-step-card reveal" 
                whileHover="hover"
              >
                <div className="step-badge-row">
                  <span className="step-number">03</span>
                  <motion.div 
                    className="step-icon-container"
                    variants={{ hover: { scale: 1.1, rotate: 15 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Cpu />
                  </motion.div>
                </div>
                <h3>AI Synthesis</h3>
                <p>AI generates structured professional resume content.</p>
              </motion.div>

              <motion.div 
                className="workflow-step-card reveal" 
                whileHover="hover"
              >
                <div className="step-badge-row">
                  <span className="step-number">04</span>
                  <motion.div 
                    className="step-icon-container"
                    variants={{ hover: { scale: 1.1, y: 3 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <FileCheck />
                  </motion.div>
                </div>
                <h3>Instant Export</h3>
                <p>Export a polished PDF ready for recruiters and applications.</p>
              </motion.div>
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section className="section" style={{ paddingTop: "140px", paddingBottom: "220px" }}>
          <div className="container">
            <div className="section-head reveal" style={{ textAlign: "center" }}>
              <div className="label">Testimonials</div>
              <div className="title">Loved by developers</div>
              <div className="desc" style={{ margin: "0 auto" }}>Early users share how Resummit changed their job hunt.</div>
            </div>
            <div className="testimonials-grid reveal">
              {[
                { initials: "AK", name: "Aditya Kumar", role: "Final Year CS Student · IIT Delhi", color: "#4f8cff", bg: "rgba(79,140,255,0.15)", rating: 5, text: "I applied to 30 companies and got 8 interview calls. Resummit took my messy commit history and turned it into the most professional resume I've ever had. The ATS score feature is a game changer." },
                { initials: "SR", name: "Sara Reyes", role: "Junior Backend Developer · Remote", color: "#a78bfa", bg: "rgba(167,139,250,0.15)", rating: 4.5, text: "I was spending hours writing resume bullets. Resummit does it in under a minute, and the output is way better than what I was writing manually. Literally saved my job search." },
                { initials: "MM", name: "Marcus M.", role: "AI Engineer Intern · Berlin", color: "#06b6d4", bg: "rgba(6,182,212,0.15)", rating: 5, text: "The before/after is wild. It turned 'added API endpoint' into a full bullet with metrics and context. I connected my GitHub and had a recruiter-ready resume in about 45 seconds." },
              ].map((t, i) => (
                <motion.div key={i} className="testimonial-card reveal" whileHover={{ y: -8 }}>
                  <div className="testimonial-stars" style={{ display: "flex", gap: "2px", marginBottom: "16px" }}>
                    {[1, 2, 3, 4, 5].map((s) => {
                      const fill = t.rating >= s ? 1 : (t.rating + 0.5 === s ? 0.5 : 0);
                      return (
                        <svg key={s} viewBox="0 0 24 24" width="16" height="16" style={{ flexShrink: 0 }}>
                          {fill === 1 && <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#f59e0b" />}
                          {fill === 0.5 && (
                            <g>
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="var(--card-border)" />
                              <path d="M12 17.27V2L9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#f59e0b" />
                            </g>
                          )}
                          {fill === 0 && <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="var(--card-border)" />}
                        </svg>
                      );
                    })}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.7", marginBottom: "24px" }}>{t.text}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="testimonial-avatar" style={{ background: t.bg, color: t.color }}>{t.initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text)" }}>{t.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing anchor */}
        <section id="pricing" style={{ position: "relative", top: "-140px" }} />

        {/* Pricing Section */}
        <section className="section" style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "220px 0 140px 0" }}>
          <div className="container">
            <div className="pricing-split-grid">
              
              {/* Left Column: The Pricing Card */}
              <div className="reveal pricing-split-card-col">
                <div className="pricing-card featured premium-theme" style={{ maxWidth: "480px", width: "100%", padding: "40px", position: "relative", overflow: "visible" }}>
                  <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", padding: "6px 18px", background: "#f59e0b", color: "white", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(245, 158, 11, 0.25)" }}>Limited-Time Free</div>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--primary)", fontWeight: 700, marginBottom: "16px", textAlign: "center" }}>Early Access</div>
                  <div className="pricing-price" style={{ textAlign: "center", marginBottom: "8px" }}>$0<span style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--muted)", marginLeft: "4px" }}>/ limited time</span></div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "32px", textAlign: "center" }}>No credit card required. Full access to all features during beta.</div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                    <Link href={hasSession ? "/dashboard" : "/login"} className="primary-btn" style={{ width: "100%", display: "flex", justifyContent: "center", padding: "14px" }}>
                      Connect GitHub to Start
                    </Link>
                    <a href="https://github.com/Resummit-ai/Resummit" target="_blank" rel="noopener noreferrer" className="secondary-btn" style={{ width: "100%", display: "flex", justifyContent: "center", padding: "14px", gap: "8px" }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Star on GitHub
                    </a>
                  </div>

                  <div style={{ borderTop: "1px solid rgba(79,140,255,0.2)", paddingTop: "28px" }}>
                    {[
                      "Create unlimited active resumes",
                      "Sync all public & private GitHub repositories",
                      "Automated AI-powered bullet generation",
                      "Applicant Tracking System (ATS) compatibility analysis",
                      "Clean, recruiter-ready PDF exports with zero watermarks",
                      "100% open-source and developer-focused"
                    ].map((f) => (
                      <div key={f} className="pricing-feature" style={{ marginBottom: "14px" }}><span style={{ color: "#10b981", marginRight: "6px", fontWeight: "bold" }}>✓</span>{f}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Section Heading / Description */}
              <div className="reveal pricing-split-text-col">
                <div className="label">Pricing</div>
                <h2 className="title">Free for a limited time</h2>
                <p className="desc">
                  Resummit is completely free and open-source during our launch phase. Experience full access to our automated, AI-powered resume generation pipeline without any credit card or commitments.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ section is now integrated inside the Contact section below */}

        {/* Contact/CTA Section */}
        <section className="section" id="contact">
          <div className="container">
            <div className="contact reveal">
              <div className="contact-left">
                <h2>
                  Built from your work.<br />
                  Not from templates.
                </h2>
                <p>
                  Resummit turns real engineering work into professional resumes developers can confidently share with recruiters and hiring teams. Designed, developed, and maintained by <strong>Adel Muhammed</strong>.
                </p>
                <div className="contact-links">
                  <a href="mailto:adelmuhammed786@gmail.com">Contact Email</a>
                  <a href="https://github.com/dragon486" target="_blank" rel="noopener noreferrer">GitHub Profile</a>
                  <a href="https://www.linkedin.com/in/adel-muhammed-49136a282/" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a>
                </div>
              </div>

              {/* Sleek Interactive Feedback Form — open to all visitors */}
              <div className="feedback-form-container">
                {feedbackSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: "center", padding: "20px 0" }}
                  >
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto", color: "#10b981" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: "24px", height: "24px" }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 style={{ color: "white" }}>Thank you for your feedback!</h3>
                    <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: "8px 0 20px 0" }}>Your inputs have been received and help us build a better workspace for engineers.</p>
                    <button 
                      onClick={() => setFeedbackSubmitted(false)}
                      className="primary-btn"
                      style={{ cursor: "pointer", width: "auto", display: "inline-flex", padding: "10px 20px", fontSize: "0.8rem", borderRadius: "12px", border: "none" }}
                    >
                      Submit Another Feedback
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4" style={{ display: "flex", flexDirection: "column" }}>
                    <h3>Share Your Feedback</h3>
                    <p>Help us improve Resummit. We read every message.</p>
 
                    <div className="feedback-form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={feedbackName}
                        onChange={(e) => setFeedbackName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        className="feedback-input"
                      />
                    </div>
 
                    <div className="feedback-form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={feedbackEmail}
                        onChange={(e) => setFeedbackEmail(e.target.value)}
                        placeholder="e.g. alex@example.com"
                        className="feedback-input"
                      />
                    </div>
 
                    <div className="feedback-form-group">
                      <label>Rating</label>
                      <div className="rating-buttons">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setFeedbackRating(val)}
                            className={`rating-btn ${feedbackRating === val ? "active" : ""}`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
 
                    <div className="feedback-form-group">
                      <label>Your Message</label>
                      <textarea 
                        required
                        value={feedbackMsg}
                        onChange={(e) => setFeedbackMsg(e.target.value)}
                        placeholder="What features do you love? What should we build next?"
                        className="feedback-input feedback-textarea"
                      />
                    </div>
 
                    <button 
                      type="submit" 
                      disabled={feedbackSubmitting}
                      className="feedback-submit-btn"
                    >
                      {feedbackSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          Submit Feedback
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* FAQ anchor inside unified section */}
            <div id="faq" style={{ position: "relative", top: "-100px" }} />

            {/* FAQ Sub-section inside Contact */}
            <div className="reveal" style={{ marginTop: "90px", borderTop: "1px solid var(--border)", paddingTop: "80px" }}>
              <div className="faq-split-grid">
                <div>
                  <div className="label" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>FAQ</div>
                  <h3 style={{ fontSize: "2.2rem", fontWeight: "800", color: "var(--text)", letterSpacing: "-0.04em", lineHeight: "1.1", margin: 0 }}>
                    Common questions
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.6", marginTop: "16px" }}>
                    Have questions about security, how the AI parses your GitHub data, or exporting? Here are the details.
                  </p>
                </div>
                
                <div className="faq-list" style={{ marginTop: 0, width: "100%", maxWidth: "100%" }}>
                  {[
                    { q: "Does Resummit write to or modify my GitHub repos?", a: "Never. Resummit requests read-only access to your public repositories. It reads your code, commits, and README files to understand what you built — it cannot push, edit, or delete anything on your GitHub account." },
                    { q: "How long does it take to generate my resume?", a: "Usually under 60 seconds. Resummit fetches your top repositories, analyzes the tech stack and commit history using Gemini AI, and generates professional resume bullets almost instantly." },
                    { q: "Is my GitHub data stored or shared?", a: "Your repository data is fetched and analyzed to build your resume. We store only the resume content you explicitly save. We do not sell, share, or expose your data to any third party." },
                    { q: "Why is it better than just asking ChatGPT?", a: "ChatGPT requires you to manually describe your projects. Resummit reads your actual code, commit messages, and repository structures to generate context-aware, specific bullets — no copy-pasting, no fabrication." },
                    { q: "Is it really free?", a: "Yes. The current version is completely free with no credit card required. We plan to keep the core product free for our early users during beta." },
                  ].map((faq, i) => (
                    <div key={i} className="faq-item">
                      <button className="faq-question" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                        <span>{faq.q}</span>
                        <ChevronDown style={{ width: "18px", height: "18px", flexShrink: 0, transform: faqOpen === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)", color: "var(--primary)" }} />
                      </button>
                      <AnimatePresence>
                        {faqOpen === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="faq-answer">{faq.a}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="container footer-grid">
            <div className="footer-left">
              <div className="logo">
                <svg viewBox="0 0 32 32" className="logo-icon-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 6C7 4.34315 8.34315 3 10 3H19L25 9V26C25 27.6569 23.6569 29 22 29H10C8.34315 29 7 27.6569 7 26V6Z" className="logo-doc-body" />
                  <path d="M19 3V9H25L19 3Z" className="logo-doc-fold" />
                  <path d="M11 13H17M11 17H21M11 21H18M11 25H20" className="logo-doc-lines" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 8.5L25 3.5" className="logo-flag-pole" strokeWidth="2" strokeLinecap="round" />
                  <path d="M25 3.5L27 6.5L23.5 5.5Z" className="logo-flag-banner" />
                </svg>
                <div className="logo-text-group">
                  <div className="logo-wordmark">RESUMMIT</div>
                  <div className="logo-tagline">YOUR COMMITS. YOUR CAREER.</div>
                </div>
              </div>
              <p>
                AI-powered resume intelligence for developers.
                Built around the projects, systems, and code you've already created.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Navigation</h4>
                <a href="#features">Features</a>
                <a href="#workflow">Workflow</a>
                <a href="#contact">Contact</a>
              </div>

              <div className="footer-column">
                <h4>Profiles</h4>
                <a href="https://github.com/dragon486" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://www.linkedin.com/in/adel-muhammed-49136a282/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="mailto:adelmuhammed786@gmail.com">Email</a>
              </div>
            </div>
          </div>

          <div className="container footer-bottom">
            <div>
              © {new Date().getFullYear()} Resummit. All rights reserved.
            </div>
            <div className="creator-credit">
              Created & Founded by{" "}
              <a href="https://github.com/dragon486" target="_blank" rel="noopener noreferrer">
                Adel Muhammed
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
