"use client";

import { useState } from "react";
import { Check, X, ArrowRight, Zap, AlertCircle, RefreshCw } from "lucide-react";

interface Suggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  proposedData: string;
  currentData: string | null;
  confidence: number;
  priority: number;
}

export function SmartUpdateCenter({
  initialSuggestions,
  lastSyncAt,
  accessToken,
}: {
  initialSuggestions: Suggestion[];
  lastSyncAt: string | null;
  accessToken?: string;
}) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<Suggestion | null>(null);

  const handleScan = async () => {
    setScanning(true);
    setScanError(null);
    try {
      if (!accessToken) {
        setScanError("GitHub access token unavailable. Please re-login.");
        return;
      }
      const res = await fetch("/api/sync/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        setScanError(data.error || "Scan failed. Please try again.");
      }
    } catch {
      setScanError("Network error during scan. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  const handleApprove = async (id: string) => {
    const res = await fetch("/api/suggestions/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      setReviewing(null);
    }
  };

  const handleDiscard = async (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setReviewing(null);
  };

  if (suggestions.length === 0 && !scanning) {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="text-neutral-500 w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold mb-2">CV is up to date</h3>
        <p className="text-neutral-500 text-sm mb-6">No new meaningful GitHub activity detected.</p>

        {scanError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
            {scanError}
          </div>
        )}

        <button
          onClick={handleScan}
          disabled={scanning}
          className="inline-flex items-center gap-2 px-6 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Scanning..." : "Force Scan Now"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">
          Smart Updates
          {suggestions.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px]">
              {suggestions.length}
            </span>
          )}
        </h2>
        <button
          onClick={handleScan}
          disabled={scanning}
          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Scanning..." : "Refresh"}
        </button>
      </div>

      {scanError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {scanError}
        </div>
      )}

      <div className="grid gap-4">
        {suggestions.map((s) => (
          <div
            key={s.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between group hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${
                  s.priority === 3
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-violet-500/10 text-violet-400"
                }`}
              >
                {s.type === "NEW_PROJECT" ? (
                  <Zap className="w-5 h-5" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{s.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-md">
                  {s.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400 uppercase tracking-tighter">
                    {Math.round(s.confidence * 100)}% Confidence
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-4">
              <button
                onClick={() => handleDiscard(s.id)}
                className="p-1.5 text-neutral-600 hover:text-neutral-400 hover:bg-neutral-800 rounded-lg transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => setReviewing(s)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#161616] border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Review Update</h3>
                <p className="text-xs text-neutral-500">{reviewing.title}</p>
              </div>
              <button
                onClick={() => setReviewing(null)}
                className="text-neutral-500 hover:text-white p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Current
                  </span>
                  <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 min-h-[150px]">
                    {reviewing.currentData ? (
                      <div className="opacity-50 line-through text-xs space-y-2">
                        <p className="font-bold">
                          {JSON.parse(reviewing.currentData).name}
                        </p>
                        <ul className="list-disc ml-4 space-y-1">
                          {JSON.parse(reviewing.currentData).bullets.map(
                            (b: string, i: number) => (
                              <li key={i}>{b}</li>
                            )
                          )}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-600 italic mt-10 text-center">
                        No current data (New Project)
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                    Proposed
                  </span>
                  <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 min-h-[150px]">
                    <div className="text-xs space-y-2 text-neutral-200">
                      <p className="font-bold text-white">
                        {JSON.parse(reviewing.proposedData).name}
                      </p>
                      <ul className="list-disc ml-4 space-y-1">
                        {JSON.parse(reviewing.proposedData).bullets.map(
                          (b: string, i: number) => (
                            <li key={i}>{b}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex gap-3">
                <AlertCircle className="text-blue-400 w-5 h-5 shrink-0" />
                <p className="text-xs text-blue-200/70 leading-relaxed">
                  AI determined this as a high-confidence improvement. Applying this will update
                  your{" "}
                  {reviewing.type === "NEW_PROJECT"
                    ? "Technical Projects list"
                    : "existing project bullets"}
                  .
                </p>
              </div>
            </div>

            <div className="p-6 bg-neutral-900 border-t border-neutral-800 flex justify-end gap-3">
              <button
                onClick={() => setReviewing(null)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDiscard(reviewing.id)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-neutral-500 hover:text-red-400 border border-neutral-700 hover:border-red-500/30 transition-all"
              >
                Discard
              </button>
              <button
                onClick={() => handleApprove(reviewing.id)}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-blue-600/20"
              >
                Approve & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
