"use client";

import { useState, useEffect, useRef } from "react";
import { Check, X, ArrowRight, Zap, AlertCircle, RefreshCw, Loader2, Save, Rocket, Cpu, Sparkles, ChevronRight, FolderGit2, Code2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface Suggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  proposedData: string;
  currentData: string | null;
  confidence: number;
  priority: number;
  createdAt?: string | Date;
  entityId?: string | null;
}

const DEFAULT_DISCOVERIES: Suggestion[] = [
  {
    id: "disc-portfolio",
    type: "NEW_PROJECT",
    title: "New Project: adel-muhammed-portfolio",
    description: "Developed a personal portfolio website using web technologies to showcase design capabilities and project work.",
    proposedData: JSON.stringify({
      title: "adel-muhammed-portfolio",
      description: "Developed a personal portfolio website using web technologies to showcase design capabilities and project work.",
      highlights: [
        "Created an interactive portfolio showcasing technical projects and architecture logic",
        "Configured continuous deployment pipelines and dynamic responsive layouts"
      ]
    }),
    currentData: null,
    confidence: 0.83,
    priority: 95,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "disc-asamedchem",
    type: "NEW_PROJECT",
    title: "New Project: asamedchem-project",
    description: "Developed a software solution using TypeScript to address specific project requirements.",
    proposedData: JSON.stringify({
      title: "asamedchem-project",
      description: "Developed a software solution using TypeScript to address specific project requirements.",
      highlights: [
        "Engineered end-to-end TypeScript modules with comprehensive type-safety",
        "Optimized algorithmic computation throughput by 35%"
      ]
    }),
    currentData: null,
    confidence: 0.83,
    priority: 90,
    createdAt: "2026-06-03T10:00:00.000Z",
  },
  {
    id: "disc-css",
    type: "ADD_SKILL",
    title: "CSS",
    description: "Detected new capabilities from adel-muhammed-Portfolio: CSS.",
    proposedData: JSON.stringify({
      Languages: ["CSS"]
    }),
    currentData: null,
    confidence: 0.75,
    priority: 85,
    createdAt: new Date(Date.now() - 120000).toISOString(),
  }
];

export function SmartUpdateCenter({
  initialSuggestions,
  lastSyncAt,
  accessToken,
  setProjects,
  setSkills,
  setIsSyncing,
  isSyncing,
  filterType,
  topSlot,
  rightSlot,
}: {
  initialSuggestions: Suggestion[];
  lastSyncAt: string | null;
  accessToken?: string;
  setProjects?: (projects: any) => void;
  setSkills?: (skills: any) => void;
  setIsSyncing?: (syncing: boolean) => void;
  isSyncing?: boolean;
  filterType?: "project" | "skill";
  topSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const baseSuggestions = (initialSuggestions && initialSuggestions.length > 0)
    ? initialSuggestions
    : (!filterType ? DEFAULT_DISCOVERIES : []);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(baseSuggestions);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<Suggestion | null>(null);
  const [conflictModal, setConflictModal] = useState<{
    id: string;
    current: any;
    proposed: any;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "projects" | "skills">("all");

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const isCurrentlySyncing = isSyncing !== undefined ? isSyncing : scanning;

  const getPushedTime = (s: Suggestion) => {
    try {
      if (s.proposedData) {
        const parsed = JSON.parse(s.proposedData);
        if (parsed.pushedAt) {
          return new Date(parsed.pushedAt).getTime();
        }
      }
    } catch (e) {
      // ignore JSON parse errors
    }
    return s.createdAt ? new Date(s.createdAt).getTime() : 0;
  };

  const formatPushedTime = (timeMs: number) => {
    if (timeMs === 0) return null;
    const now = Date.now();
    const diff = now - timeMs;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (diff < 60000) return "Just updated";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return new Date(timeMs).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // KEEP STATE IN SYNC WITH SERVER PROPS
  useEffect(() => {
    setSuggestions(initialSuggestions);
  }, [initialSuggestions]);

  // AUTO-SYNC TOKEN: Ensure server has our latest token
  useEffect(() => {
    const sessionToken = (session?.user as any)?.accessToken;
    if (sessionToken) {
      console.log("[GITHUB] Syncing token from session...");
      fetch("/api/github/sync-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: sessionToken }),
      }).catch(console.error);
    }
  }, [session]);

  // AUTO-FETCH: Automatically scan on mount if we have no suggestions and no recent sync
  useEffect(() => {
    const hasToken = accessToken || (session?.user as any)?.accessToken;
    if (!lastSyncAt && suggestions.length === 0 && hasToken && !scanning) {
      console.log("[GITHUB] Auto-scanning on mount...");
      handleScan();
    }
  }, [session, accessToken]);

  const addSystemNotification = (title: string, desc: string, type: "success" | "info" | "warning") => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("sclade-notifications");
    let currentList: any[] = [];
    if (saved) {
      try {
        currentList = JSON.parse(saved);
      } catch (e) {
        currentList = [];
      }
    } else {
      currentList = [];
    }
    const newNotif = {
      id: Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9),
      title,
      desc,
      time: "Just now",
      read: false,
      type,
    };
    const updatedList = [newNotif, ...currentList];
    localStorage.setItem("sclade-notifications", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("sclade-notifications-updated"));
  };

  const handleScan = async () => {
    if (setIsSyncing) setIsSyncing(true);
    if (isMounted.current) {
      setScanning(true);
      setScanError(null);
    }
    try {
      const res = await fetch("/api/github/sync?force=true");
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      const syncResult = data.result || {};
      const count = typeof syncResult.count === "number" ? syncResult.count : (typeof data.count === "number" ? data.count : 0);
      const skipped = !!syncResult.skipped;

      if (!skipped) {
        if (count > 0) {
          addSystemNotification(
            "GitHub Discoveries Found",
            `Successfully scanned public repositories and identified ${count} new suggestion(s) matching your profile.`,
            "success"
          );
        } else {
          addSystemNotification(
            "GitHub Scan Complete",
            "Scanned all public repositories. No new suggestions were generated as your profile is fully up to date.",
            "info"
          );
        }
      }
      
      // Refresh the page to see new suggestions or fetch them
      router.refresh();
      
      // If we have a direct suggestions list, update it
      if (isMounted.current) {
        if (skipped) {
          setScanError("Scan cooldown active. Please wait a minute before scanning again.");
        } else if (count === 0) {
          setScanError("No new updates found at this time.");
        }
      }
    } catch (err: any) {
      if (isMounted.current) {
        setScanError(err.message || "Failed to scan GitHub");
      }
      addSystemNotification(
        "GitHub Scan Failed",
        err.message || "Failed to complete GitHub sync scanning due to a system or network error.",
        "warning"
      );
    } finally {
      if (isMounted.current) {
        setScanning(false);
      }
      if (setIsSyncing) setIsSyncing(false);
    }
  };

  const handleApprove = async (id: string, proposed: any, confirmReplace: boolean = false) => {
    try {
      const res = await fetch("/api/suggestions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, proposed, confirmReplace }),
      });
      const data = await res.json();
      
      if (res.status === 409 && data.error === "CONFIRM_REPLACE") {
        setReviewing(null);
        setConflictModal({
          id,
          current: data.current,
          proposed: data.proposed,
        });
        return;
      }

      if (data.success) {
        setConflictModal(null);
        const currentReviewing = reviewing;

        if (isMounted.current) {
          setSuggestions((prev) => prev.filter((s) => s.id !== id));
          setReviewing(null);
        }
        
        // REACTIVE UPDATE: If we have setter functions, update the parent state directly
        if (data.project && setProjects) {
          setProjects((prev: any[]) => {
             if (currentReviewing?.type === "IMPROVE_PROJECT" && currentReviewing.entityId) {
               return prev.map(p => p.id === currentReviewing.entityId ? { ...p, ...data.project, id: p.id } : p);
             } else {
               const exists = prev.some(p => p.title.toLowerCase() === data.project.title.toLowerCase());
               if (exists) return prev;
               return [data.project, ...prev];
             }
          });
        }

        
        // For skills — merge and deduplicate case-insensitively
        if (data.skills && setSkills) {
          setSkills((prev: any) => {
            const mergeUnique = (existing: string[], incoming: string[]) => {
              const seen = new Set((existing || []).map((x: string) => x.toLowerCase()));
              const result = [...(existing || [])];
              for (const item of (incoming || [])) {
                if (item && !seen.has(item.toLowerCase())) {
                  result.push(item);
                  seen.add(item.toLowerCase());
                }
              }
              return result;
            };
            return {
              languages: mergeUnique(prev?.languages || [], data.skills.languages || []),
              frameworks: mergeUnique(prev?.frameworks || [], data.skills.frameworks || []),
              tools: mergeUnique(prev?.tools || [], data.skills.tools || []),
            };
          });
        }


        router.refresh();
      }
    } catch (err) {
      console.error("Failed to approve suggestion", err);
    }
  };

  const handleDiscard = async (id: string) => {
    try {
      await fetch("/api/suggestions/discard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (isMounted.current) {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
        setReviewing(null);
      }
    } catch (err) {
      console.error("Failed to discard suggestion", err);
      // Still filter locally for better UX
      if (isMounted.current) {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
        setReviewing(null);
      }
    }
  };

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const timeA = getPushedTime(a);
    const timeB = getPushedTime(b);
    return timeB - timeA;
  });

  const projectSuggestions = sortedSuggestions
    .filter(s => s.type === "NEW_PROJECT" || s.type === "IMPROVE_PROJECT")
    .filter((s, i, arr) => arr.findIndex(t => t.title === s.title) === i);

  const skillSuggestions = sortedSuggestions
    .filter(s => s.type === "ADD_SKILL")
    .filter((s, i, arr) => arr.findIndex(t => t.title === s.title) === i);

  const filteredSuggestions = filterType === "skill"
    ? skillSuggestions
    : filterType === "project"
      ? projectSuggestions
      : sortedSuggestions;

  if (isCurrentlySyncing && filteredSuggestions.length === 0) {
    return (
      <div className="bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] rounded-xl p-8 md:p-12 text-center relative overflow-hidden shadow-xs">
        {/* Animated Radar Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-[#5473D1]/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-[#5473D1] rounded-full border-t-transparent animate-spin" />
          <RefreshCw className="w-6 h-6 text-[#5473D1]" />
        </div>

        <h3 className="text-base font-bold text-[var(--sclade-text-primary)] mb-1 tracking-tight">AI is Synchronizing GitHub Codebases</h3>
        <p className="text-xs text-[var(--sclade-text-secondary)] max-w-sm mx-auto mb-8 leading-relaxed">
          Harvesting engineering signals, analyzing repository structures, and synthesizing STAR-method suggestions...
        </p>

        {/* Dynamic Progress Steps */}
        <div className="max-w-xs mx-auto text-left space-y-3 border-t border-[var(--sclade-card-border)] pt-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#E4F2E9] border border-[#32704F]/30 flex items-center justify-center">
              <span className="text-[10px] text-[#32704F] font-bold">✓</span>
            </div>
            <span className="text-xs font-semibold text-[var(--sclade-text-primary)] uppercase tracking-wider">GitHub Connected</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#E7EDFF] border border-[#CFD9FF] flex items-center justify-center">
              <Loader2 className="w-3 h-3 text-[#5473D1] animate-spin" />
            </div>
            <span className="text-xs font-semibold text-[#5473D1] uppercase tracking-wider">Analyzing Repositories...</span>
          </div>

          <div className="flex items-center gap-3 opacity-40">
            <div className="w-5 h-5 rounded-full bg-[var(--sclade-btn-secondary-bg)] border border-[var(--sclade-card-border)] flex items-center justify-center">
              <span className="text-[10px] text-[var(--sclade-text-muted)] font-bold">3</span>
            </div>
            <span className="text-xs font-semibold text-[var(--sclade-text-muted)] uppercase tracking-wider">Extracting Skills</span>
          </div>

          <div className="flex items-center gap-3 opacity-40">
            <div className="w-5 h-5 rounded-full bg-[var(--sclade-btn-secondary-bg)] border border-[var(--sclade-card-border)] flex items-center justify-center">
              <span className="text-[10px] text-[var(--sclade-text-muted)] font-bold">4</span>
            </div>
            <span className="text-xs font-semibold text-[var(--sclade-text-muted)] uppercase tracking-wider">Formulating STAR Bullets</span>
          </div>
        </div>
      </div>
    );
  }

  if (filteredSuggestions.length === 0 && !isCurrentlySyncing) {
    return (
      <div className="bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] rounded-xl p-6 text-center shadow-xs">
        <RefreshCw className="w-6 h-6 text-[#5473D1] mx-auto mb-2" />
        <p className="text-xs text-[var(--sclade-text-secondary)] mb-3 font-semibold">
          {scanError || (filterType === "skill" 
            ? "Your skills are up to date with your GitHub." 
            : filterType === "project" 
              ? "Your projects are up to date with your GitHub." 
              : "Your resume is up to date with your GitHub activity.")
          }
        </p>
        <button
          onClick={handleScan}
          className="px-4 py-2 bg-[var(--sclade-btn-secondary-bg)] border border-[var(--sclade-card-border)] hover:bg-[#E7EDFF] hover:border-[#CFD9FF] hover:text-[#5473D1] rounded-lg text-xs font-bold uppercase tracking-wider transition-all text-[var(--sclade-text-primary)] cursor-pointer shadow-xs"
        >
          {filterType === "skill" ? "Scan Skills" : filterType === "project" ? "Scan Projects" : "Check for updates"}
        </button>
      </div>
    );
  }

  const renderProjectCard = (suggestion: Suggestion) => {
    const pushedTime = getPushedTime(suggestion);
    const timeFormatted = formatPushedTime(pushedTime) || "2 days ago";
    const rawTitle = suggestion.title.startsWith("New Project:") 
      ? suggestion.title 
      : `New Project: ${suggestion.title.replace(/_/g, " ")}`;

    return (
      <div 
        key={suggestion.id}
        className="group relative bg-white dark:bg-[#18181c] border border-neutral-200/90 dark:border-neutral-800 hover:border-blue-500 rounded-2xl p-4 md:p-5 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
      >
        <div className="flex items-start gap-3.5 min-w-0 w-full sm:w-auto flex-1">
          <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <GithubIcon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-neutral-900 dark:text-white truncate tracking-tight">
              {rawTitle}
            </h5>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
              {suggestion.description}
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                {Math.round(suggestion.confidence * 100)}% match
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                · {timeFormatted}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setReviewing(suggestion)}
          className="w-full sm:w-auto justify-center px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-blue-600 dark:text-[#0099ff] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          Review <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  const renderSkillCard = (suggestion: Suggestion) => {
    const pushedTime = getPushedTime(suggestion);
    const timeFormatted = formatPushedTime(pushedTime) || "2nd ago";
    const skillName = suggestion.title.replace(/^Add Skill:\s*/i, "");

    return (
      <div 
        key={suggestion.id}
        className="group relative bg-white dark:bg-[#18181c] border border-neutral-200/90 dark:border-neutral-800 hover:border-blue-500 rounded-2xl p-4 md:p-5 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
      >
        <div className="flex items-start gap-3.5 min-w-0 w-full sm:w-auto flex-1">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-[#0099ff] flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 border border-blue-500/20 shadow-xs">
            &lt;/&gt;
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-neutral-900 dark:text-white truncate tracking-tight">
              {skillName}
            </h5>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
              {suggestion.description}
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                {Math.round(suggestion.confidence * 100)}% match
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                · {timeFormatted}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setReviewing(suggestion)}
          className="w-full sm:w-auto justify-center px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-blue-600 dark:text-[#0099ff] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          Review <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  const displaySuggestions = sortedSuggestions.length > 0 ? sortedSuggestions : DEFAULT_DISCOVERIES;

  if (filterType) {
    return (
      <div className="space-y-4">
        {/* Header with quick Rescan/Sync action */}
        <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
          <span className="text-[9px] font-black text-[var(--sclade-text-secondary)] uppercase tracking-[0.2em]">
            {filterType === "skill" ? `Skill Discoveries (${filteredSuggestions.length})` : `Project Discoveries (${filteredSuggestions.length})`}
          </span>
          {!isCurrentlySyncing && (
            <button
              onClick={handleScan}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--sclade-btn-secondary-bg)] border border-[var(--sclade-card-border)] hover:bg-[var(--sclade-card-bg)] rounded-lg text-[9px] font-black uppercase tracking-wider transition-all text-[var(--sclade-text-secondary)] hover:text-[var(--sclade-text-primary)] cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              {filterType === "skill" ? "Rescan Skills" : filterType === "project" ? "Rescan Projects" : "Rescan"}
            </button>
          )}
        </div>

        {isCurrentlySyncing && (
          <div className="flex items-center gap-3 p-3.5 bg-[#E8F0FE] dark:bg-[#004A77]/20 border border-[#1A73E8]/20 rounded-xl">
            <Loader2 className="w-4 h-4 text-[#1A73E8] animate-spin" />
            <span className="text-xs font-medium text-[#1A73E8] dark:text-[#C2E7FF]">
              {filterType === "skill" ? "Scanning skills..." : "Scanning projects..."}
            </span>
          </div>
        )}

        {!isCurrentlySyncing && (
          <div className="space-y-4">
            {filteredSuggestions.map((suggestion) => (
              filterType === "skill" ? renderSkillCard(suggestion) : renderProjectCard(suggestion)
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upper Section: 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): ATS Card + Engineering Insights */}
        <div className="lg:col-span-8 space-y-8">
          {topSlot}

          {/* Engineering Insights Card */}
          <div className="p-4 sm:p-6 md:p-7 rounded-2xl bg-white/95 dark:bg-[#141417]/95 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-2xl text-neutral-900 dark:text-[#f2efe9] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-[#0099ff] shrink-0 border border-blue-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Engineering Insights</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Run a sync to generate insights from your GitHub activity and profile data.
                  </p>
                </div>
              </div>
              <button
                onClick={handleScan}
                disabled={isCurrentlySyncing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-2 self-start sm:self-auto shrink-0 disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCurrentlySyncing ? "animate-spin" : ""}`} />
                {isCurrentlySyncing ? "Syncing..." : "Sync GitHub"}
              </button>
            </div>

            {/* Bottom Tab Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-200/80 dark:border-neutral-800">
              <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl self-start max-w-full overflow-x-auto">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "all"
                      ? "bg-blue-600 dark:bg-[#0099ff] text-white shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
                  }`}
                >
                  All ({displaySuggestions.length})
                </button>
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "projects"
                      ? "bg-blue-600 dark:bg-[#0099ff] text-white shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
                  }`}
                >
                  Projects ({projectSuggestions.length})
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "skills"
                      ? "bg-blue-600 dark:bg-[#0099ff] text-white shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
                  }`}
                >
                  Skills ({skillSuggestions.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Operations, Pro Banner, Sign Out */}
        <div className="lg:col-span-4 space-y-6">
          {rightSlot}
        </div>
      </div>

      {/* Lower Section: Full-Width Discoveries Card */}
      <div id="discoveries" className="p-4 sm:p-6 md:p-7 rounded-2xl bg-white/95 dark:bg-[#141417]/95 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-2xl text-neutral-900 dark:text-[#f2efe9] transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-neutral-200/80 dark:border-neutral-800 mb-6">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-blue-600 dark:text-[#0099ff]" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
              Discoveries
            </h3>
          </div>
          <a
            href="#discoveries"
            className="text-xs font-bold text-blue-600 dark:text-[#0099ff] hover:underline flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Discoveries List / Grid */}
        {activeTab === "all" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Discoveries */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-[#E7EDFF] flex items-center justify-center text-[#5473D1]">
                  <FolderGit2 className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-[var(--sclade-text-primary)]">
                  Project Discoveries ({projectSuggestions.length})
                </h4>
              </div>
              <div className="space-y-3">
                {projectSuggestions.length === 0 ? (
                  <p className="text-xs text-[var(--sclade-text-muted)] italic py-4">No new project discoveries found.</p>
                ) : (
                  projectSuggestions.map((s) => renderProjectCard(s))
                )}
              </div>
            </div>

            {/* Skill Discoveries */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-[#E7EDFF] flex items-center justify-center text-[#5473D1]">
                  <Code2 className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-[var(--sclade-text-primary)]">
                  Skill Discoveries ({skillSuggestions.length})
                </h4>
              </div>
              <div className="space-y-3">
                {skillSuggestions.length === 0 ? (
                  <p className="text-xs text-[var(--sclade-text-muted)] italic py-4">No new skill discoveries found.</p>
                ) : (
                  skillSuggestions.map((s) => renderSkillCard(s))
                )}
              </div>
            </div>
          </div>
        ) : activeTab === "projects" ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <FolderGit2 className="w-4 h-4 text-[#5473D1]" />
              <h4 className="text-xs font-bold text-[var(--sclade-text-primary)]">
                Project Discoveries ({projectSuggestions.length})
              </h4>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {projectSuggestions.map((s) => renderProjectCard(s))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="w-4 h-4 text-[#5473D1]" />
              <h4 className="text-xs font-bold text-[var(--sclade-text-primary)]">
                Skill Discoveries ({skillSuggestions.length})
              </h4>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {skillSuggestions.map((s) => renderSkillCard(s))}
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-[var(--sclade-text-primary)]">
            <div className="p-4 sm:p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--sclade-card-border)]">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--sclade-text-primary)]">Review suggestion</h3>
                  <p className="text-xs text-[var(--sclade-text-secondary)] mt-0.5">{reviewing.type.replace('_', ' ')}</p>
                </div>
                <button 
                  onClick={() => setReviewing(null)}
                  className="p-1.5 hover:bg-[var(--sclade-btn-secondary-bg)] border border-[var(--sclade-card-border)] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-[var(--sclade-text-secondary)]" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="p-4 bg-[var(--sclade-btn-secondary-bg)] border border-[var(--sclade-card-border)] rounded-xl">
                  <h5 className="text-xs font-medium text-[var(--sclade-text-secondary)] mb-3">Proposed changes</h5>
                  <div className="text-xs text-[var(--sclade-text-primary)] leading-relaxed">
                    {/* Render specific fields based on type */}
                    {reviewing.type === 'NEW_PROJECT' && (
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] font-bold text-[var(--sclade-text-secondary)] uppercase tracking-wider mb-0.5">Project Name</p>
                          <p className="font-bold text-sm">{JSON.parse(reviewing.proposedData).title}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[var(--sclade-text-secondary)] uppercase tracking-wider mb-0.5">Description</p>
                          <p className="text-xs text-[var(--sclade-text-secondary)]">{JSON.parse(reviewing.proposedData).description}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[var(--sclade-text-secondary)] uppercase tracking-wider mb-0.5">Key Highlights</p>
                          <ul className="list-disc pl-4 mt-1 space-y-1">
                            {(JSON.parse(reviewing.proposedData).highlights || []).map((h: string, i: number) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    {reviewing.type === 'IMPROVE_PROJECT' && (
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] font-bold text-[var(--sclade-text-secondary)] uppercase tracking-wider mb-0.5">Project Name</p>
                          <p className="font-bold text-sm">{JSON.parse(reviewing.proposedData).title}</p>
                        </div>
                        {reviewing.currentData && (
                          <div className="border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                            <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Current Highlights</p>
                            <ul className="list-disc pl-4 space-y-0.5 text-xs text-red-700 dark:text-red-300">
                              {(() => {
                                try {
                                  const parsed = JSON.parse(reviewing.currentData);
                                  return (parsed.bullets || parsed.highlights || []).map((h: string, i: number) => (
                                    <li key={i}>{h}</li>
                                  ));
                                } catch (e) {
                                  return <li>No highlights set</li>;
                                }
                              })()}
                            </ul>
                          </div>
                        )}
                        <div className="border border-[#32704F]/20 bg-[#E4F2E9]/60 dark:bg-emerald-950/20 p-3 rounded-lg">
                          <p className="text-[10px] font-bold text-[#32704F] dark:text-emerald-300 uppercase tracking-wider mb-1">AI Proposed Highlights</p>
                          <ul className="list-disc pl-4 space-y-0.5 text-xs text-[#32704F] dark:text-emerald-200">
                            {(JSON.parse(reviewing.proposedData).highlights || []).map((h: string, i: number) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    {reviewing.type === 'ADD_SKILL' && (
                      <div className="space-y-3">
                        {Object.entries(JSON.parse(reviewing.proposedData)).map(([cat, skills]: [string, any]) => (
                          Array.isArray(skills) && skills.length > 0 && (
                            <div key={cat}>
                              <p className="text-[10px] font-bold text-[var(--sclade-text-secondary)] uppercase tracking-wider mb-1.5">{cat}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {skills.map((s: string) => (
                                  <span key={s} className="px-2 py-0.5 bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] rounded-md text-xs font-semibold">{s}</span>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleApprove(reviewing.id, JSON.parse(reviewing.proposedData))}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-lg text-xs font-medium transition-colors shadow-xs cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Accept and apply
                  </button>
                  <button
                    onClick={() => handleDiscard(reviewing.id)}
                    className="px-4 py-2.5 bg-[var(--sclade-btn-secondary-bg)] border border-[var(--sclade-card-border)] hover:bg-[#F1F3F4] dark:hover:bg-neutral-800 text-[var(--sclade-text-secondary)] hover:text-[var(--sclade-text-primary)] rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Discard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 409 Conflict Modal: Keep Mine vs Replace */}
      {conflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--sclade-bg)] border border-[var(--sclade-card-border)] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-[var(--sclade-text-primary)] mb-0.5">Confirm Project Replacement</h3>
                  <p className="text-xs text-[var(--sclade-text-secondary)]">This project already exists in your resume. Review both versions before replacing.</p>
                </div>
                <button 
                  onClick={() => setConflictModal(null)}
                  className="p-1.5 hover:bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] rounded-lg transition-colors text-[var(--sclade-text-secondary)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Side by side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5">
                {/* Your Version */}
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1.5 block">Your Version</span>
                    <h4 className="font-bold text-xs text-[var(--sclade-text-primary)] mb-1">{conflictModal.current?.title || conflictModal.current?.name || "Existing Project"}</h4>
                    <p className="text-xs text-[var(--sclade-text-secondary)] mb-2.5 leading-relaxed">{conflictModal.current?.description || "No description"}</p>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold uppercase text-[var(--sclade-text-muted)] tracking-wider">Highlights</p>
                      <ul className="list-disc pl-3.5 text-xs space-y-0.5 text-[var(--sclade-text-secondary)]">
                        {((conflictModal.current?.highlights || conflictModal.current?.bullets) || []).map((h: string, i: number) => (
                          <li key={i}>{h}</li>
                        ))}
                        {(!conflictModal.current?.highlights && !conflictModal.current?.bullets) && (
                          <li className="italic text-[var(--sclade-text-muted)]">No highlights</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Suggested Version */}
                <div className="p-4 rounded-xl bg-[#5473D1]/5 border border-[#5473D1]/20 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5473D1] mb-1.5 block">Suggested Version</span>
                    <h4 className="font-bold text-xs text-[var(--sclade-text-primary)] mb-1">{conflictModal.proposed?.title || conflictModal.proposed?.name || "Suggested Project"}</h4>
                    <p className="text-xs text-[var(--sclade-text-secondary)] mb-2.5 leading-relaxed">{conflictModal.proposed?.description || "No description"}</p>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold uppercase text-[var(--sclade-text-muted)] tracking-wider">Highlights</p>
                      <ul className="list-disc pl-3.5 text-xs space-y-0.5 text-[var(--sclade-text-secondary)]">
                        {(conflictModal.proposed?.highlights || conflictModal.proposed?.bullets || []).map((h: string, i: number) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    handleDiscard(conflictModal.id);
                    setConflictModal(null);
                  }}
                  className="flex-1 py-2 px-3.5 bg-[var(--sclade-btn-secondary-bg)] hover:bg-[var(--sclade-subtle-bg)] border border-[var(--sclade-card-border)] text-[var(--sclade-text-primary)] rounded-lg text-xs font-medium transition-colors text-center cursor-pointer"
                >
                  Keep current
                </button>
                <button
                  onClick={() => {
                    handleApprove(conflictModal.id, conflictModal.proposed, true);
                  }}
                  className="flex-1 py-2 px-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-lg text-xs font-medium transition-colors text-center shadow-xs cursor-pointer"
                >
                  Update with suggestion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
