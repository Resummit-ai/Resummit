"use client";

import React, { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

// Cubic-bezier ease matching https://framer.com/m/Macos-xzl7JE.js@hZPDCufvhjM2iKjciKIg
const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;

export const sectionRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
    filter: "blur(10px)",
  },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: custom * 0.12,
      duration: 0.65,
      ease: EASE_OUT,
    },
  }),
};

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export function SectionReveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.15,
}: SectionRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      custom={delay}
      variants={sectionRevealVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
