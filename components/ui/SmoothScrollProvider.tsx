"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current || !contentRef.current) return;

    let smoother: any = null;
    try {
      smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: 1.15,
        effects: false,
        smoothTouch: 0.1,
      });
    } catch (err) {
      // Fallback gracefully if hardware doesn't support
      console.warn("ScrollSmoother setup:", err);
    }

    return () => {
      if (smoother && typeof smoother.kill === "function") {
        smoother.kill();
      }
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapperRef} className="w-full overflow-hidden">
      <div id="smooth-content" ref={contentRef} className="w-full">
        {children}
      </div>
    </div>
  );
}
