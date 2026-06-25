"use client";

import { useEffect, useRef, useState } from "react";

interface DiffPart {
  type: "added" | "removed" | "unchanged";
  text: string;
}

// Longest Common Subsequence word diff algorithm
function diffWords(oldStr: string, newStr: string): DiffPart[] {
  const cleanOld = oldStr || "";
  const cleanNew = newStr || "";

  // Split keeping whitespace
  const oldWords = cleanOld.split(/(\s+)/);
  const newWords = cleanNew.split(/(\s+)/);

  const dp: number[][] = Array(oldWords.length + 1)
    .fill(0)
    .map(() => Array(newWords.length + 1).fill(0));

  for (let i = 1; i <= oldWords.length; i++) {
    for (let j = 1; j <= newWords.length; j++) {
      if (oldWords[i - 1] === newWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffPart[] = [];
  let i = oldWords.length;
  let j = newWords.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      result.unshift({ type: "unchanged", text: oldWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "added", text: newWords[j - 1] });
      j--;
    } else {
      result.unshift({ type: "removed", text: oldWords[i - 1] });
      i--;
    }
  }

  // Merge consecutive parts of the same type for cleaner rendering
  const merged: DiffPart[] = [];
  for (const part of result) {
    if (merged.length > 0 && merged[merged.length - 1].type === part.type) {
      merged[merged.length - 1].text += part.text;
    } else {
      merged.push(part);
    }
  }

  return merged;
}

interface AITextTransformProps {
  text: string;
  suggestion?: string;
  isGenerating?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onAccept?: (val: string) => void;
  onDiscard?: () => void;
  onRevert?: (oldValue: any) => void;
}

export function AITextTransform({
  text,
  suggestion,
  isGenerating = false,
  className = "",
  style,
  onAccept,
  onDiscard,
  onRevert,
}: AITextTransformProps) {
  const [displayState, setDisplayState] = useState<"idle" | "animating" | "pending">("idle");
  const [oldText, setOldText] = useState<any>(text);
  const [isAccepting, setIsAccepting] = useState(false);
  const [success, setSuccess] = useState(false);
  const prevSuggestionRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // If in the middle of accepting, ignore prop changes until finished
    if (isAccepting) return;

    if (suggestion && suggestion !== prevSuggestionRef.current) {
      setOldText(text);
      setDisplayState("animating");
      
      const timer = setTimeout(() => {
        setDisplayState("pending");
      }, 1500); // matches the full animation timeline
      
      prevSuggestionRef.current = suggestion;
      return () => clearTimeout(timer);
    } else if (!suggestion && prevSuggestionRef.current) {
      setDisplayState("idle");
      setIsAccepting(false);
      setSuccess(false);
      prevSuggestionRef.current = undefined;
    }
  }, [suggestion, text, isAccepting]);

  const handleAcceptClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAccepting(true);
    // Wait for the particles dissolve animation to run on CV (800ms)
    setTimeout(() => {
      setSuccess(true);
      if (onAccept && suggestion) {
        onAccept(suggestion);
      }
    }, 800);
    // Hide panel and restore clean state after success checkmark plays
    setTimeout(() => {
      setDisplayState("idle");
      setIsAccepting(false);
      setSuccess(false);
      prevSuggestionRef.current = undefined;
    }, 2000);
  };

  const handleDiscardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDiscard) {
      onDiscard();
    } else if (onRevert) {
      onRevert(oldText);
    }
    setDisplayState("idle");
    setIsAccepting(false);
    setSuccess(false);
    prevSuggestionRef.current = undefined;
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
          {suggestion}
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
    const diffParts = diffWords(oldText, suggestion || "");
    return (
      <span className={`relative inline-block ${className} ${isAccepting ? "ai-accepting" : ""}`} style={{ ...style }}>
        {/* Render word-by-word diff inline on the CV */}
        <span className="ai-diff-container">
          {diffParts.map((part, index) => {
            if (part.type === "added") {
              return (
                <span key={index} className="ai-diff-added font-semibold">
                  {part.text}
                </span>
              );
            }
            if (part.type === "removed") {
              return (
                <span key={index} className="ai-diff-removed font-medium">
                  {part.text}
                </span>
              );
            }
            return <span key={index}>{part.text}</span>;
          })}
        </span>

        {/* Sweep Glow Line (only during acceptance sweep) */}
        {isAccepting && <span className="ai-sweep-glow-line no-print" />}

        {/* Floating Particles during acceptance sweep */}
        {isAccepting && (
          <>
            <span className="ai-particle ai-particle-1 no-print" style={{ background: "#4f8cff" }} />
            <span className="ai-particle ai-particle-2 no-print" style={{ background: "#06b6d4" }} />
            <span className="ai-particle ai-particle-3 no-print" style={{ background: "#a78bfa" }} />
            <span className="ai-particle ai-particle-4 no-print" style={{ background: "#06b6d4" }} />
          </>
        )}

        {/* Sparkle pop at the end of text when accepted */}
        {isAccepting && (
          <span className="ai-sparkle no-print">
            <svg className="w-4 h-4 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm8 10a1 1 0 011-1h1v-1a1 1 0 112 0v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 01-1-1zM4 12a1 1 0 011-1h1v-1a1 1 0 112 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </span>
        )}

        {/* Floating CV Action Toolbar directly on top of the text */}
        <span className="ai-cv-floating-toolbar no-print">
          {success ? (
            <span className="ai-cv-toolbar-success">
              <svg className="w-3.5 h-3.5 text-emerald-400 ai-success-checkmark-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Changes Applied
            </span>
          ) : (
            <>
              <span className="ai-cv-toolbar-chip">
                <svg className="w-3 h-3 text-cyan-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm8 10a1 1 0 011-1h1v-1a1 1 0 112 0v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 01-1-1zM4 12a1 1 0 011-1h1v-1a1 1 0 112 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Suggested by Resummit AI
              </span>
              <button 
                onClick={handleAcceptClick}
                className="ai-cv-btn-accept cursor-pointer"
                title="Accept Changes"
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button 
                onClick={handleDiscardClick}
                className="ai-cv-btn-discard cursor-pointer"
                title="Keep Original"
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
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

