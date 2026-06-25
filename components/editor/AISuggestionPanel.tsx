"use client";

import { useEffect, useState } from "react";
import { Sparkles, Check, X, RotateCw } from "lucide-react";

interface DiffPart {
  type: "added" | "removed" | "unchanged";
  text: string;
}

// Longest Common Subsequence word diff algorithm
export function diffWords(oldStr: string, newStr: string): DiffPart[] {
  // Safe defaults
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

interface AISuggestionPanelProps {
  originalText: string;
  suggestedText: string;
  statusChipText?: string;
  subtitleText?: string;
  onAccept: () => void;
  onReject: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function AISuggestionPanel({
  originalText,
  suggestedText,
  statusChipText = "✨ Resummit AI Suggestion",
  subtitleText = "Improved clarity, impact, and ATS relevance.",
  onAccept,
  onReject,
  onRegenerate,
  isRegenerating = false,
}: AISuggestionPanelProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState(true);

  // When suggested text changes, reset success state
  useEffect(() => {
    setIsAccepting(false);
    setSuccess(false);
    setVisible(true);
  }, [suggestedText]);

  const diffParts = diffWords(originalText, suggestedText);

  const handleAcceptClick = () => {
    setIsAccepting(true);
    // Wait for the text dissolve animation to complete (800ms)
    setTimeout(() => {
      setSuccess(true);
    }, 800);
    // Apply changes after success message has finished rendering
    setTimeout(() => {
      onAccept();
    }, 2000);
  };

  const handleRejectClick = () => {
    setVisible(false);
    setTimeout(() => {
      onReject();
    }, 300);
  };

  if (!visible) return null;

  return (
    <div className={`ai-suggestion-panel transition-all duration-300 ${isAccepting ? "ai-accepting" : ""} ${success ? "scale-[0.98] opacity-90" : ""}`}>
      {/* Top Gradient Glow Strip */}
      <div className="ai-suggestion-glow" />

      {success ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2 ai-success-checkmark-pop">
            <Check className="w-5 h-5 text-emerald-500 stroke-[3]" />
          </div>
          <p className="text-xs font-bold text-white uppercase tracking-wider">Changes Applied</p>
        </div>
      ) : (
        <>
          {/* AI Suggestion Header */}
          <div className="flex items-start gap-2 mb-3">
            <div className="mt-0.5 p-1 bg-blue-500/10 rounded-lg text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-200 block dark:text-neutral-200 light:text-neutral-800">
                {statusChipText}
              </span>
              {subtitleText && (
                <span className="text-[10px] text-neutral-500 block">
                  {subtitleText}
                </span>
              )}
            </div>
          </div>

          {/* Diff View Area */}
          <div className="bg-neutral-950/80 rounded-lg p-3.5 mb-4 text-xs leading-relaxed text-neutral-300 border border-white/5 font-sans overflow-x-auto whitespace-pre-wrap">
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
                  <span key={index} className="ai-diff-removed font-medium opacity-60">
                    {part.text}
                  </span>
                );
              }
              return <span key={index}>{part.text}</span>;
            })}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAcceptClick}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Check className="w-3 h-3 stroke-[3.5]" />
                Accept Changes
              </button>
              <button
                type="button"
                onClick={handleRejectClick}
                className="flex items-center gap-1.5 bg-transparent border border-neutral-700 hover:border-neutral-500 text-neutral-400 hover:text-neutral-200 font-bold text-[10px] px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
              >
                <X className="w-3 h-3 stroke-[3]" />
                Keep Original
              </button>
            </div>

            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-1 hover:text-blue-400 text-neutral-500 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
                Regenerate
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
