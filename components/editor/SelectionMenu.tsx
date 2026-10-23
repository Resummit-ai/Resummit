"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

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

// ─────────────────────────────────────────────────────────────
// Authentic Google Material Symbols (fonts.google.com/icons)
// Standard 24dp viewBox, optical weight 400
// ─────────────────────────────────────────────────────────────

function GoogleAutoFixIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7.5 5.6L10 0l2.5 5.6L18 8l-5.5 2.4L10 16 7.5 10.4 2 8l5.5-2.4zm12 9.4l1.5-3.4 1.5 3.4 3.5 1.5-3.5 1.5-1.5 3.4-1.5-3.4-3.5-1.5 3.5-1.5z" />
    </svg>
  );
}

function GoogleShortTextIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4 9h16v2H4V9zm0 4h10v2H4v-2z" />
    </svg>
  );
}

function GoogleTrendingUpIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
    </svg>
  );
}

function GoogleTuneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
    </svg>
  );
}

function GoogleCopyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
  );
}

function GoogleCheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

function GoogleCloseIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function GoogleRefreshIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}

function GoogleSpinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${className} animate-spin`} aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#1A73E8" strokeWidth="3" />
      <path className="opacity-75" fill="#1A73E8" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
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

    const menuWidth = 360;
    const isFlipped = rect.top < 80;
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
        throw new Error(data.message || data.error || "Failed to refine text");
      }

      setRewrittenText(data.rewritten || selectedText);
      setStatus("preview");
    } catch (err: any) {
      console.error("Selection AI Rewrite Error:", err);
      setErrorMsg(err.message || "Unable to refine text at this moment. Please try again.");
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
    setTimeout(() => {
      setIsOpen(false);
      setStatus("idle");
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
    }, 700);
  };

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
      className="animate-in fade-in zoom-in-95 duration-150 select-none font-sans"
    >
      {/* ── Google Material 3 Floating Pill Toolbar ── */}
      {status === "idle" && (
        <div className="flex items-center gap-1 p-1 rounded-full bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] text-[#3C4043] dark:text-[#E8EAED]">
          {/* Refine Button (Google Blue Pill) */}
          <button
            onClick={() => handleAction("improve")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#174EA6] text-white transition-colors cursor-pointer"
            title="Refine with AI"
          >
            <GoogleAutoFixIcon className="w-3.5 h-3.5" />
            <span>Refine</span>
          </button>

          {/* Shorten Button (Google Tonal) */}
          <button
            onClick={() => handleAction("shorten")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#303134] text-[#3C4043] dark:text-[#E8EAED] transition-colors cursor-pointer"
            title="Make concise"
          >
            <GoogleShortTextIcon className="w-3.5 h-3.5 text-[#5F6368] dark:text-[#9AA0A6]" />
            <span>Shorten</span>
          </button>

          {/* Action Verbs Button */}
          <button
            onClick={() => handleAction("verbs")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#303134] text-[#3C4043] dark:text-[#E8EAED] transition-colors cursor-pointer"
            title="Strengthen action verbs"
          >
            <GoogleTrendingUpIcon className="w-3.5 h-3.5 text-[#5F6368] dark:text-[#9AA0A6]" />
            <span>Action Verbs</span>
          </button>

          {/* Adjust Tone Button */}
          <button
            onClick={() => handleAction("tone")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#303134] text-[#3C4043] dark:text-[#E8EAED] transition-colors cursor-pointer"
            title="Adjust tone"
          >
            <GoogleTuneIcon className="w-3.5 h-3.5 text-[#5F6368] dark:text-[#9AA0A6]" />
            <span>Tone</span>
          </button>

          <div className="h-4 w-px bg-[#DADCE0] dark:bg-[#3C4043] mx-0.5" />

          {/* Copy Button */}
          <button
            onClick={() => handleCopy(selectedText)}
            className="p-1.5 rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#303134] text-[#5F6368] dark:text-[#9AA0A6] transition-colors cursor-pointer"
            title="Copy selection"
          >
            {copied ? <GoogleCheckIcon className="w-3.5 h-3.5 text-[#137333]" /> : <GoogleCopyIcon className="w-3.5 h-3.5" />}
          </button>

          {/* Dismiss Button */}
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#303134] text-[#5F6368] dark:text-[#9AA0A6] transition-colors cursor-pointer"
            title="Close menu"
          >
            <GoogleCloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Loading State ── */}
      {status === "loading" && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] text-[#202124] dark:text-[#E8EAED] min-w-[260px]">
          <GoogleSpinner className="w-4 h-4 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-[#1A73E8]">
              {activeAction === "improve" && "Refining with AI..."}
              {activeAction === "shorten" && "Making concise..."}
              {activeAction === "verbs" && "Strengthening verbs..."}
              {activeAction === "tone" && "Adjusting tone..."}
            </span>
          </div>
        </div>
      )}

      {/* ── Google Workspace Suggestion Card ── */}
      {status === "preview" && (
        <div className="w-[390px] max-w-[92vw] rounded-2xl bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] shadow-[0_2px_6px_2px_rgba(60,64,67,0.15),0_1px_2px_0_rgba(60,64,67,0.3)] overflow-hidden text-[#202124] dark:text-[#E8EAED]">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#DADCE0] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#28292A]">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F0FE] text-[#1967D2] dark:bg-[#004A77] dark:text-[#C2E7FF]">
                <GoogleAutoFixIcon className="w-3.5 h-3.5" />
                {activeAction === "improve" && "Refined"}
                {activeAction === "shorten" && "Concise"}
                {activeAction === "verbs" && "Action Verbs"}
                {activeAction === "tone" && "Adjusted Tone"}
              </span>
            </div>

            {/* Google-style segmented action switcher */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleAction("improve")}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  activeAction === "improve"
                    ? "bg-[#E8F0FE] text-[#1967D2] dark:bg-[#004A77] dark:text-[#C2E7FF]"
                    : "text-[#5F6368] dark:text-[#9AA0A6] hover:bg-[#F1F3F4] dark:hover:bg-[#303134]"
                }`}
              >
                Refine
              </button>
              <button
                onClick={() => handleAction("shorten")}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  activeAction === "shorten"
                    ? "bg-[#E8F0FE] text-[#1967D2] dark:bg-[#004A77] dark:text-[#C2E7FF]"
                    : "text-[#5F6368] dark:text-[#9AA0A6] hover:bg-[#F1F3F4] dark:hover:bg-[#303134]"
                }`}
              >
                Shorten
              </button>
              <button
                onClick={() => handleAction("verbs")}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  activeAction === "verbs"
                    ? "bg-[#E8F0FE] text-[#1967D2] dark:bg-[#004A77] dark:text-[#C2E7FF]"
                    : "text-[#5F6368] dark:text-[#9AA0A6] hover:bg-[#F1F3F4] dark:hover:bg-[#303134]"
                }`}
              >
                Verbs
              </button>

              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-[#E8EAED] dark:hover:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] ml-1 transition-colors cursor-pointer"
                title="Close"
              >
                <GoogleCloseIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3.5 space-y-3">
            {errorMsg ? (
              <div className="text-xs text-[#D93025] bg-[#FCE8E6] dark:bg-[#5C1D18] p-2.5 rounded-xl border border-[#FAD2CF] dark:border-[#8C231B]">
                {errorMsg}
              </div>
            ) : (
              <div className="bg-[#F8F9FA] dark:bg-[#28292A] rounded-xl p-3 border border-[#DADCE0] dark:border-[#3C4043] text-[13px] leading-relaxed text-[#202124] dark:text-[#E8EAED] max-h-[160px] overflow-y-auto select-text">
                {rewrittenText}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => handleAction(activeAction)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#202124] dark:hover:text-[#E8EAED] hover:bg-[#F1F3F4] dark:hover:bg-[#303134] rounded-full transition-colors cursor-pointer font-medium"
                title="Retry variation"
              >
                <GoogleRefreshIcon className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(rewrittenText)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#3C4043] dark:text-[#E8EAED] hover:bg-[#F1F3F4] dark:hover:bg-[#303134] rounded-full border border-[#DADCE0] dark:border-[#3C4043] transition-colors cursor-pointer"
                >
                  {copied ? <GoogleCheckIcon className="w-3.5 h-3.5 text-[#137333]" /> : <GoogleCopyIcon className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={handleApply}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#174EA6] rounded-full shadow-sm transition-colors cursor-pointer"
                >
                  <GoogleCheckIcon className="w-3.5 h-3.5" />
                  <span>Apply</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Applied State (Google Green Pill) ── */}
      {status === "applied" && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#137333] text-white font-medium text-xs shadow-lg animate-in zoom-in-95 duration-150">
          <GoogleCheckIcon className="w-4 h-4" />
          <span>Applied to Resume</span>
        </div>
      )}
    </div>
  );
}
