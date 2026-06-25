"use client";

import { useEffect, useRef, useState } from "react";

interface AITextTransformProps {
  text: string;
  isGenerating?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onRevert?: (oldValue: any) => void;
}

export function AITextTransform({
  text,
  isGenerating = false,
  className = "",
  style,
  onRevert,
}: AITextTransformProps) {
  const prevTextRef = useRef(text);
  const [displayState, setDisplayState] = useState<"idle" | "animating" | "pending">("idle");
  const [oldText, setOldText] = useState<any>(text);

  useEffect(() => {
    // Only trigger animation if text changed, it's not the initial mount, and not already pending
    if (prevTextRef.current !== text && displayState !== "pending") {
      setOldText(prevTextRef.current);
      setDisplayState("animating");
      
      const timer = setTimeout(() => {
        setDisplayState("pending");
      }, 1500); // matches the full animation timeline
      
      prevTextRef.current = text;
      return () => clearTimeout(timer);
    } else if (prevTextRef.current !== text && displayState === "pending") {
      // Sync ref if text updates while we are already in pending state
      prevTextRef.current = text;
    }
  }, [text, displayState]);

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDisplayState("idle");
  };

  const handleDiscard = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onRevert) {
      onRevert(oldText);
    }
    setDisplayState("idle");
  };

  if (displayState === "animating") {
    return (
      <span className={`relative inline-block ${className}`} style={{ ...style }}>
        {/* Old Text (Fades out via left-to-right sweeping mask) */}
        <span className="ai-animating-text-old inline">
          {oldText}
        </span>
        
        {/* New Text (Fades in via left-to-right sweeping mask) */}
        <span className="ai-animating-text-new inline">
          {text}
        </span>

        {/* Sweep Glow Line */}
        <span className="ai-sweep-glow-line no-print" />

        {/* Status Chip */}
        <span className="ai-status-chip no-print">
          <svg className="w-3 h-3 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Improved by AI
        </span>

        {/* Floating Particles staggered along the sweep progress */}
        <span className="ai-particle ai-particle-1 no-print" style={{ background: "#4f8cff" }} />
        <span className="ai-particle ai-particle-2 no-print" style={{ background: "#06b6d4" }} />
        <span className="ai-particle ai-particle-3 no-print" style={{ background: "#a78bfa" }} />
        <span className="ai-particle ai-particle-4 no-print" style={{ background: "#06b6d4" }} />

        {/* Sparkle pop at the end of the text */}
        <span className="ai-sparkle no-print">
          <svg className="w-4 h-4 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm8 10a1 1 0 011-1h1v-1a1 1 0 112 0v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 01-1-1zM4 12a1 1 0 011-1h1v-1a1 1 0 112 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </span>
      </span>
    );
  }

  if (displayState === "pending") {
    return (
      <span className={`relative inline-block ${className}`} style={{ ...style }}>
        {text}

        {/* Floating AI Actions Toolbar */}
        <span className="ai-actions-floating-bar no-print">
          <button 
            onClick={handleAccept}
            className="ai-action-btn-accept cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Keep
          </button>
          <button 
            onClick={handleDiscard}
            className="ai-action-btn-discard cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Revert
          </button>
        </span>
      </span>
    );
  }

  // Active generating pulse styling
  const pulseClass = isGenerating ? "ai-generating-text" : "";

  return (
    <span className={`${pulseClass} ${className}`} style={style}>
      {text}
    </span>
  );
}
