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
  const containerRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayState, setDisplayState] = useState<"idle" | "animating" | "pending">("idle");
  const [oldText, setOldText] = useState<any>(text);
  const [isAccepting, setIsAccepting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
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

  useEffect(() => {
    if (!showCanvas) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const parentRect = container.getBoundingClientRect();
    const W = parentRect.width;
    const H = parentRect.height;

    // Set canvas dimensions with DPR scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Bounding boxes of removed and added elements
    const removedElements = container.querySelectorAll(".ai-diff-removed") as NodeListOf<HTMLElement>;
    const addedElements = container.querySelectorAll(".ai-diff-added") as NodeListOf<HTMLElement>;

    const removedBounds = Array.from(removedElements).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        element: el,
        left: rect.left - parentRect.left,
        right: rect.right - parentRect.left,
        top: rect.top - parentRect.top,
        bottom: rect.bottom - parentRect.top,
        width: rect.width,
        height: rect.height
      };
    });

    const addedBounds = Array.from(addedElements).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        element: el,
        left: rect.left - parentRect.left,
        right: rect.right - parentRect.left,
        top: rect.top - parentRect.top,
        bottom: rect.bottom - parentRect.top,
        width: rect.width,
        height: rect.height
      };
    });

    // Make sure elements have display: inline-block for clipping
    removedBounds.forEach(b => {
      b.element.style.display = "inline-block";
      b.element.style.transition = "none";
    });
    addedBounds.forEach(b => {
      b.element.style.display = "inline-block";
      b.element.style.transition = "none";
    });

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
    }

    let particles: Particle[] = [];
    const startTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / 1000); // 1000ms duration
      const waveX = progress * (W + 60) - 30; // Sweep wave from left to right

      // Clear canvas
      ctx.clearRect(0, 0, W, H);

      // Draw subtle energy wave
      const grad = ctx.createLinearGradient(waveX - 25, 0, waveX + 25, 0);
      grad.addColorStop(0, "rgba(37, 99, 235, 0)");
      grad.addColorStop(0.3, "rgba(37, 99, 235, 0.3)");
      grad.addColorStop(0.5, "rgba(34, 211, 238, 0.8)");
      grad.addColorStop(0.7, "rgba(37, 99, 235, 0.3)");
      grad.addColorStop(1, "rgba(37, 99, 235, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(waveX - 25, 0, 50, H);

      // Update and draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 16.67;
        p.alpha = Math.max(0, p.life / p.maxLife);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      particles = particles.filter(p => p.life > 0);
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Clip removed elements and spawn particles at wave front
      removedBounds.forEach(b => {
        if (waveX >= b.left && waveX <= b.right + 30) {
          const clipLeft = Math.max(0, waveX - b.left);
          b.element.style.clipPath = `inset(0 0 0 ${clipLeft}px)`;

          // Spawn a burst of particles at the slice line
          const spawnCount = 2;
          for (let k = 0; k < spawnCount; k++) {
            const py = b.top + Math.random() * b.height;
            particles.push({
              x: waveX,
              y: py,
              vx: 1.2 + Math.random() * 1.8, // drift right
              vy: -0.4 - Math.random() * 1.2, // float up slightly
              color: Math.random() > 0.5 ? "#2563EB" : "#22D3EE",
              size: 1.5 + Math.random() * 1.5,
              alpha: 1,
              life: 300 + Math.random() * 300,
              maxLife: 300 + Math.random() * 300
            });
          }
        } else if (waveX > b.right + 30) {
          b.element.style.clipPath = `inset(0 0 0 100%)`;
        }
      });

      // Reveal added elements
      addedBounds.forEach(b => {
        if (waveX >= b.left) {
          const clipRight = Math.max(0, b.right - waveX);
          b.element.style.clipPath = `inset(0 ${clipRight}px 0 0)`;
          b.element.style.opacity = "1";

          const dist = waveX - b.left;
          const blurVal = Math.max(0, 5 - dist / 15);
          b.element.style.filter = blurVal > 0.1 ? `blur(${blurVal}px)` : "none";
        } else {
          b.element.style.clipPath = `inset(0 100% 0 0)`;
          b.element.style.opacity = "0";
          b.element.style.filter = "blur(5px)";
        }
      });

      if (progress < 1) {
        animId = requestAnimationFrame(loop);
      } else {
        // Cleanup styles when animation finishes
        removedBounds.forEach(b => {
          b.element.style.clipPath = "";
        });
        addedBounds.forEach(b => {
          b.element.style.clipPath = "";
          b.element.style.opacity = "";
          b.element.style.filter = "";
        });
        setShowCanvas(false);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [showCanvas]);

  const handleAcceptClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAccepting(true);
    setShowCanvas(true);
    
    // Wait for the particles dissolve animation to run on CV (1000ms)
    setTimeout(() => {
      setSuccess(true);
      if (onAccept && suggestion) {
        onAccept(suggestion);
      }
    }, 1000);
    // Hide panel and restore clean state after success checkmark plays
    setTimeout(() => {
      setDisplayState("idle");
      setIsAccepting(false);
      setSuccess(false);
      prevSuggestionRef.current = undefined;
    }, 3000);
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
      <span 
        ref={containerRef}
        className={`relative inline-block ${className} ${isAccepting ? "ai-accepting" : ""}`} 
        style={{ ...style }}
      >
        {/* Canvas overlay for particle dissolve wave */}
        {showCanvas && (
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 pointer-events-none z-10 no-print" 
          />
        )}
        
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

        {/* Floating CV Action Toolbar directly on top of the text */}
        <span className="ai-cv-floating-toolbar no-print">
          {success ? (
            <span className="ai-cv-toolbar-success flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-400">
              <svg className="w-3.5 h-3.5 text-emerald-400 ai-success-checkmark-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              ✨ AI Improvements Applied
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

