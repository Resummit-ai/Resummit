"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type FontStyle = React.CSSProperties;

export type TransitionValue = {
  duration?: number;
  delay?: number;
  ease?: string | number[];
  staggerChildren?: number;
};

export type StaggerFrom = "first" | "last" | "center" | "random";
export type SplitBy = "characters" | "words" | "lines";

export type RotatingTextProps = {
  prefix?: string;
  texts?: string[];
  font?: FontStyle;
  color?: string;
  prefixColor?: string;
  badgeBackground?: string;
  badgePaddingX?: number;
  badgePaddingY?: number;
  badgeRadius?: number;
  gap?: number;
  splitBy?: SplitBy;
  staggerFrom?: StaggerFrom;
  auto?: boolean;
  rotationInterval?: number;
  transition?: TransitionValue;
  className?: string;
  style?: React.CSSProperties;
};

const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    try {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (part) => part.segment);
    } catch {
      // Fallback below
    }
  }
  return Array.from(text);
};

type WordPart = {
  characters: string[];
  needsSpace: boolean;
};

const buildElements = (text: string, splitBy: SplitBy): WordPart[] => {
  if (splitBy === "characters") {
    const words = text.split(" ");
    return words.map((word, i) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== words.length - 1,
    }));
  }

  if (splitBy === "words") {
    return text.split(" ").map((word, i, arr) => ({
      characters: [word],
      needsSpace: i !== arr.length - 1,
    }));
  }

  return text.split("\n").map((line, i, arr) => ({
    characters: [line],
    needsSpace: i !== arr.length - 1,
  }));
};

export default function RotatingText({
  prefix = "",
  texts = ["components!", "interfaces!", "experiences!"],
  font = {
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: "1.25",
    textAlign: "left",
  },
  color = "#FFFFFF",
  prefixColor = "#E8E8E8",
  badgeBackground = "#5473D1",
  badgePaddingX = 20,
  badgePaddingY = 6,
  badgeRadius = 14,
  gap = 10,
  splitBy = "characters",
  auto = true,
  rotationInterval = 2800,
  transition = {
    duration: 0.38,
    staggerChildren: 0.02,
  },
  className,
  style,
}: RotatingTextProps) {
  // Stabilize texts array so inline array props in parent components don't restart animations
  const textsKey = Array.isArray(texts) ? texts.join("|||") : "";
  const safeTexts = useMemo(() => {
    return texts && texts.length > 0 ? texts : ["components", "interfaces"];
  }, [textsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Rotation interval timer
  useEffect(() => {
    if (!auto || safeTexts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % safeTexts.length);
    }, rotationInterval);

    return () => clearInterval(timer);
  }, [auto, safeTexts.length, rotationInterval]);

  const currentText = safeTexts[currentTextIndex] ?? safeTexts[0] ?? "";
  const elements = useMemo(
    () => buildElements(currentText, splitBy),
    [currentText, splitBy]
  );

  const staggerEach = transition.staggerChildren ?? 0.02;
  const duration = transition.duration ?? 0.38;

  const textAlign = (font.textAlign as React.CSSProperties["textAlign"]) ?? "left";
  const justifyContent =
    textAlign === "center"
      ? "center"
      : textAlign === "right" || textAlign === "end"
      ? "flex-end"
      : "flex-start";

  return (
    <span
      className={className}
      style={{
        ...font,
        display: "inline-flex",
        alignItems: "center",
        justifyContent,
        flexWrap: "nowrap",
        gap,
        textAlign,
        verticalAlign: "middle",
        ...style,
      }}
    >
      {prefix ? (
        <span style={{ color: prefixColor, whiteSpace: "pre" }}>
          {prefix}
        </span>
      ) : null}

      <motion.span
        layout
        transition={{
          layout: {
            type: "spring",
            stiffness: 450,
            damping: 38,
            mass: 0.8,
          },
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          verticalAlign: "middle",
          backgroundColor: badgeBackground,
          color,
          borderRadius: badgeRadius,
          padding: `${badgePaddingY}px ${badgePaddingX}px`,
          boxSizing: "border-box",
          whiteSpace: "nowrap",
          overflow: "hidden",
          position: "relative",
          lineHeight: 1.25,
          minHeight: "1.35em",
          boxShadow:
            badgeBackground === "#FFFFFF"
              ? "0 4px 18px rgba(0,0,0,0.12)"
              : "0 8px 24px rgba(84, 115, 209, 0.35)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentTextIndex}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: {},
              animate: {
                transition: {
                  staggerChildren: staggerEach,
                  delayChildren: 0.015,
                },
              },
              exit: {
                transition: {
                  staggerChildren: staggerEach * 0.7,
                  staggerDirection: 1,
                },
              },
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              lineHeight: "inherit",
            }}
          >
            {elements.map((wordObj, wordIndex) => (
              <span
                key={`${currentTextIndex}-${wordIndex}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  lineHeight: "inherit",
                }}
              >
                {wordObj.characters.map((char, charIndex) => (
                  <motion.span
                    key={`${currentTextIndex}-${wordIndex}-${charIndex}`}
                    variants={{
                      initial: { y: "115%", opacity: 0 },
                      animate: {
                        y: "0%",
                        opacity: 1,
                        transition: {
                          duration,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      },
                      exit: {
                        y: "-115%",
                        opacity: 0,
                        transition: {
                          duration: duration * 0.65,
                          ease: [0.7, 0, 0.84, 0],
                        },
                      },
                    }}
                    style={{
                      display: "inline-block",
                      willChange: "transform, opacity",
                      whiteSpace: "pre",
                      lineHeight: "inherit",
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
                {wordObj.needsSpace ? (
                  <span style={{ display: "inline-block", width: "0.28em" }}>
                    {"\u00A0"}
                  </span>
                ) : null}
              </span>
            ))}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  );
}
