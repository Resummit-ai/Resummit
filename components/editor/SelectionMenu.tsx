"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles,
  Zap,
  Target,
  Briefcase,
  Copy,
  Check,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";

export type RewriteAction = "improve" | "shorten" | "verbs" | "tone";

interface SelectionMenuProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  targetRole?: string;
  onApplyText?: (originalText: string, newText: string) => void;
}

interface Position {
  x: number;
  y: number;
  isFlipped: boolean;
}

export function SelectionMenu({
  containerRef,
  targetRole = "Software Engineer",
  onApplyText,
}: SelectionMenuProps) {
  const [selectedText, setSelectedText] = useState<string>("");
  const [position, setPosition] = useState<Position | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "loading" | "preview" | "applied">("idle");
  const [activeAction, setActiveAction] = useState<RewriteAction>("improve");
  const [rewrittenText, setRewrittenText] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // Update selection position
  const updateSelection = useCallback(() => {
    // If we are currently showing a preview or loading, don't clear unless user explicitly closed
    if (status === "loading" || status === "preview" || status === "applied") {
      return;
    }

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setIsOpen(false);
      return;
    }

    const text = sel.toString().trim();
    if (text.length < 4) {
      setIsOpen(false);
      return;
    }

    const range = sel.getRangeAt(0);

    // Verify selection is within resume document / preview container
    if (containerRef && containerRef.current) {
      const startNode = range.startContainer;
      const endNode = range.endContainer;
      if (
        !containerRef.current.contains(startNode) ||
        !containerRef.current.contains(endNode)
      ) {
        setIsOpen(false);
        return;
      }
    } else {
      // Fallback check: ensure it's inside #printable-resume
      const resumeEl = document.getElementById("printable-resume");
      if (resumeEl && (!resumeEl.contains(range.startContainer) || !resumeEl.contains(range.endContainer))) {
        setIsOpen(false);
        return;
      }
    }

    // Do not show menu if selection is within form inputs or textareas
    const activeEl = document.activeElement;
    if (
      activeEl &&
      (activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement).isContentEditable)
    ) {
      setIsOpen(false);
      return;
    }

    savedRangeRef.current = range.cloneRange();
    const rect = range.getBoundingClientRect();

    // Calculate position
    const menuWidth = 360;
    const isFlipped = rect.top < 80; // If near viewport top, display below selection
    const y = isFlipped ? rect.bottom + 10 : rect.top - 10;
    const rawX = rect.left + rect.width / 2;
    const x = Math.max(menuWidth / 2 + 16, Math.min(window.innerWidth - menuWidth / 2 - 16, rawX));

    setSelectedText(text);
    setPosition({ x, y, isFlipped });
    setIsOpen(true);
    setStatus("idle");
    setErrorMsg(null);
  }, [containerRef, status]);

  useEffect(() => {
    const handleMouseUp = () => {
      // Small delay to allow range to stabilize
      setTimeout(updateSelection, 20);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setStatus("idle");
        return;
      }
      setTimeout(updateSelection, 20);
    };

    const handleScroll = () => {
      // Reposition on scroll if menu is open
      if (savedRangeRef.current && isOpen && status === "idle") {
        const rect = savedRangeRef.current.getBoundingClientRect();
        const menuWidth = 360;
        const isFlipped = rect.top < 80;
        const y = isFlipped ? rect.bottom + 10 : rect.top - 10;
        const rawX = rect.left + rect.width / 2;
        const x = Math.max(menuWidth / 2 + 16, Math.min(window.innerWidth - menuWidth / 2 - 16, rawX));
        setPosition({ x, y, isFlipped });
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // User clicked outside menu
        if (status === "preview" || status === "applied") {
          setIsOpen(false);
          setStatus("idle");
        }
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("scroll", handleScroll, true);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [updateSelection, isOpen, status]);

  // Execute AI Rewrite
  const handleAction = async (action: RewriteAction) => {
    if (!selectedText) return;
    setActiveAction(action);
    setStatus("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/cv/rewrite-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText,
          action,
          targetRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to enhance text");
      }

      setRewrittenText(data.rewritten || selectedText);
      setStatus("preview");
    } catch (err: any) {
      console.error("Selection AI Rewrite Error:", err);
      setErrorMsg(err.message || "AI service is temporarily busy. Please try again.");
      setStatus("preview");
      setRewrittenText(selectedText);
    }
  };

  // Apply to document
  const handleApply = () => {
    if (!selectedText || !rewrittenText) return;
    setStatus("applied");
    if (onApplyText) {
      onApplyText(selectedText, rewrittenText);
    }
    // Dismiss after brief success indication
    setTimeout(() => {
      setIsOpen(false);
      setStatus("idle");
      // Clear native text selection for clean feel
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
    }, 700);
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStatus("idle");
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
  };

  if (!isOpen || !position) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: position.isFlipped ? "translate(-50%, 0)" : "translate(-50%, -100%)",
        zIndex: 9999,
      }}
      className="animate-in fade-in zoom-in-95 duration-150 select-none"
    >
      {/* ── Toolbar: Idle State ── */}
      {status === "idle" && (
        <div className="flex items-center gap-0.5 p-1 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/90 dark:border-neutral-700/80 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_-6px_rgba(0,0,0,0.7)] text-neutral-700 dark:text-neutral-200">
          {/* AI Improve Button */}
          <button
            onClick={() => handleAction("improve")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 text-blue-600 dark:text-blue-400 hover:from-blue-500/20 hover:to-violet-500/20 transition-all cursor-pointer active:scale-95"
            title="Rewrite for maximum ATS impact, clarity & signal"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
            <span>Improve</span>
          </button>

          {/* Make Concise Button */}
          <button
            onClick={() => handleAction("shorten")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer active:scale-95"
            title="Make concise and remove filler words"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Shorten</span>
          </button>

          {/* Stronger Verbs Button */}
          <button
            onClick={() => handleAction("verbs")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer active:scale-95"
            title="Inject powerful, active past-tense verbs"
          >
            <Target className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verbs</span>
          </button>

          {/* Fix Tone Button */}
          <button
            onClick={() => handleAction("tone")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer active:scale-95"
            title="Elevate to executive, professional tone"
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            <span>Tone</span>
          </button>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700 mx-1" />

          {/* Copy Button */}
          <button
            onClick={() => handleCopy(selectedText)}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            title="Copy selection"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Dismiss Button */}
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            title="Close menu"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Loading State ── */}
      {status === "loading" && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/90 dark:border-neutral-700/80 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.2)] text-neutral-800 dark:text-neutral-200 min-w-[280px]">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {activeAction === "improve" && "Enhancing with AI..."}
              {activeAction === "shorten" && "Trimming & sharpening..."}
              {activeAction === "verbs" && "Injecting power verbs..."}
              {activeAction === "tone" && "Refining executive tone..."}
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
              Applying recruiter-grade heuristics
            </span>
          </div>
        </div>
      )}

      {/* ── Preview / Result Card ── */}
      {status === "preview" && (
        <div className="w-[380px] max-w-[90vw] rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/90 dark:border-neutral-700/80 shadow-[0_16px_44px_-8px_rgba(0,0,0,0.25),0_6px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_48px_-8px_rgba(0,0,0,0.8)] overflow-hidden text-neutral-800 dark:text-neutral-100">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Sparkles className="w-3 h-3 text-blue-500" />
                {activeAction === "improve" && "AI Improved"}
                {activeAction === "shorten" && "Concise Version"}
                {activeAction === "verbs" && "Stronger Verbs"}
                {activeAction === "tone" && "Executive Tone"}
              </span>
            </div>

            {/* Quick Action Switcher */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleAction("improve")}
                className={`p-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                  activeAction === "improve"
                    ? "bg-blue-500/20 text-blue-600 dark:text-blue-300 font-bold"
                    : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
                title="AI Improve"
              >
                Improve
              </button>
              <button
                onClick={() => handleAction("shorten")}
                className={`p-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                  activeAction === "shorten"
                    ? "bg-blue-500/20 text-blue-600 dark:text-blue-300 font-bold"
                    : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
                title="Make Concise"
              >
                Shorten
              </button>
              <button
                onClick={() => handleAction("verbs")}
                className={`p-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                  activeAction === "verbs"
                    ? "bg-blue-500/20 text-blue-600 dark:text-blue-300 font-bold"
                    : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
                title="Stronger Verbs"
              >
                Verbs
              </button>

              <button
                onClick={handleClose}
                className="p-1 rounded-md hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 ml-1 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3.5 space-y-2.5">
            {errorMsg ? (
              <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-2.5 rounded-xl">
                {errorMsg}
              </div>
            ) : (
              <div className="bg-neutral-50/80 dark:bg-neutral-800/60 rounded-xl p-3 border border-neutral-200/70 dark:border-neutral-700/60 text-[12.5px] leading-relaxed font-sans text-neutral-800 dark:text-neutral-200 max-h-[160px] overflow-y-auto select-text">
                {rewrittenText}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => handleAction(activeAction)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
                title="Try another variation"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(rewrittenText)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={handleApply}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to Resume</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Applied State ── */}
      {status === "applied" && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 text-white font-medium text-xs shadow-xl animate-in zoom-in-95 duration-150">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Applied to Resume!</span>
        </div>
      )}
    </div>
  );
}
